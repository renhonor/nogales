import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to safely fetch target page with timeout
async function fetchPage(targetUrl: string): Promise<{ html: string; headers: Record<string, string>; status: number }> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    clearTimeout(id);
    const html = await response.text();
    
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      responseHeaders[key.toLowerCase()] = val;
    });

    return {
      html,
      headers: responseHeaders,
      status: response.status
    };
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// 1. PROXY ENDPOINT
// Fetches the site, strips iframe restrictions, and rewrites relative links to resolve correctly.
// Also injects action logging to send messages to parent window for live simulation.
app.get("/api/proxy-site", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    // Basic protocol prefixing if missing
    let resolvedUrl = targetUrl;
    if (!/^https?:\/\//i.test(resolvedUrl)) {
      resolvedUrl = "https://" + resolvedUrl;
    }

    const { html: originalHtml, headers, status } = await fetchPage(resolvedUrl);

    // If response is not HTML, we can pipe or redirect, but since we are simulating, let's treat it as HTML
    const contentType = headers['content-type'] || 'text/html';
    res.setHeader('Content-Type', contentType);
    
    // Set permissive CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Strip header restrictions
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', '');

    if (contentType.includes('text/html')) {
      const parsedUrl = new URL(resolvedUrl);
      const origin = parsedUrl.origin;
      const basePath = origin + parsedUrl.pathname.substring(0, parsedUrl.pathname.lastIndexOf('/') + 1);

      let html = originalHtml;

      // 1. Strip native frame-blocking headers in meta tags
      html = html.replace(/<meta\s+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');
      html = html.replace(/<meta\s+http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');

      // 2. Rewrite relative paths for href, src, and action to absolute paths on the original site
      html = html.replace(/(href|src|action)=["']([^"']+)["']/g, (match, attr, val) => {
        // If val is already absolute or a special URI scheme
        if (/^(https?:|data:|javascript:|#|mailto:|\/\/)/i.test(val)) {
          return match;
        }
        let resolved = val;
        if (val.startsWith('/')) {
          resolved = origin + val;
        } else {
          resolved = basePath + val;
        }
        return `${attr}="${resolved}"`;
      });

      // 3. Inject our Client Simulation Capture Script in the <head>
      const captureScript = `
        <script id="web-auditor-simulator-capture">
          (function() {
            // Wait for DOM to load to bind handlers
            function initSimulator() {
              // Capture click events
              document.addEventListener('click', function(e) {
                var el = e.target;
                if (!el) return;
                
                // Find descriptive name
                var description = el.tagName.toLowerCase();
                if (el.id) {
                  description += '#' + el.id;
                } else if (el.className) {
                  var classes = typeof el.className === 'string' ? el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : '';
                  if (classes) description += '.' + classes;
                }
                
                var text = el.textContent ? el.textContent.trim().substring(0, 30) : '';
                if (text) {
                  description += ' ("' + text + '")';
                }

                window.parent.postMessage({
                  type: 'SIMULATION_LOG',
                  payload: {
                    type: 'click',
                    details: 'Clicked element: <' + description + '>',
                    timestamp: new Date().toLocaleTimeString()
                  }
                }, '*');
              }, true);

              // Capture form submission events
              document.addEventListener('submit', function(e) {
                var form = e.target;
                if (!form) return;
                var action = form.getAttribute('action') || 'self';
                var inputs = form.querySelectorAll('input, select, textarea');
                var formData = [];
                inputs.forEach(function(input) {
                  if (input.name && input.type !== 'password') {
                    formData.push(input.name + '=' + input.value);
                  }
                });

                window.parent.postMessage({
                  type: 'SIMULATION_LOG',
                  payload: {
                    type: 'form',
                    details: 'Form submitted (action: ' + action + ')' + (formData.length ? ' with inputs: ' + formData.join(', ') : ''),
                    timestamp: new Date().toLocaleTimeString()
                  }
                }, '*');
              }, true);

              // Intercept window.alert or log calls
              var originalLog = console.log;
              console.log = function() {
                var args = Array.prototype.slice.call(arguments);
                originalLog.apply(console, args);
                
                window.parent.postMessage({
                  type: 'SIMULATION_LOG',
                  payload: {
                    type: 'console',
                    details: '[Console.log] ' + args.join(' '),
                    timestamp: new Date().toLocaleTimeString()
                  }
                }, '*');
              };

              // Notify parent that iframe simulation is initialized
              window.parent.postMessage({
                type: 'SIMULATION_LOG',
                payload: {
                  type: 'navigation',
                  details: 'Simulated page fully loaded: ' + window.location.href,
                  timestamp: new Date().toLocaleTimeString()
                }
              }, '*');
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initSimulator);
            } else {
              initSimulator();
            }
          })();
        </script>
      `;

      // Insert capture script into <head>
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${captureScript}`);
      } else {
        html = captureScript + html;
      }

      res.status(status).send(html);
    } else {
      // Just proxy non-HTML assets (if they end up here)
      res.status(status).send(originalHtml);
    }
  } catch (error: any) {
    console.error("Proxy error:", error);
    res.status(500).send(`Error proxying site: ${error.message}`);
  }
});

// 2. AUDIT ENDPOINT
// Performs static checks, cleans up HTML, and prompts Gemini to run interactive, accessibility, and heuristic reviews.
app.post("/api/audit-site", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: "Missing url parameter" });
  }

  try {
    let resolvedUrl = url;
    if (!/^https?:\/\//i.test(resolvedUrl)) {
      resolvedUrl = "https://" + resolvedUrl;
    }

    const { html, headers } = await fetchPage(resolvedUrl);

    // STATIC AUDIT ANALYTICS (Node/Regex checks for high precision)
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "Missing Title";

    const descMatch = html.match(/<meta\s+[^>]*name=["']description["']\s+content=["']([^"']+)["']/i) ||
                      html.match(/<meta\s+content=["']([^"']+)["']\s+[^>]*name=["']description["']/i);
    const metaDescription = descMatch ? descMatch[1].trim() : "Missing Description";

    const hasFavicon = /<link\s+[^>]*rel=["'](shortcut\s+)?icon["']/i.test(html);
    const hasViewport = /<meta\s+[^>]*name=["']viewport["']/i.test(html);
    const hasOgImage = /<meta\s+[^>]*property=["']og:image["']/i.test(html);

    // Heading counts
    const headingsCount = {
      h1: (html.match(/<h1[^>]*>/gi) || []).length,
      h2: (html.match(/<h2[^>]*>/gi) || []).length,
      h3: (html.match(/<h3[^>]*>/gi) || []).length,
      h4: (html.match(/<h4[^>]*>/gi) || []).length,
    };

    // Images
    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    const totalImages = imgMatches.length;
    let imagesMissingAlt = 0;
    imgMatches.forEach(img => {
      if (!/alt\s*=\s*["']/i.test(img) || /alt\s*=\s*["']\s*["']/i.test(img)) {
        imagesMissingAlt++;
      }
    });

    // Buttons
    const buttonMatches = html.match(/<button[^>]*>|<a\s+[^>]*role=["']button["']/gi) || [];
    const totalButtons = buttonMatches.length;
    let buttonsMissingLabel = 0; // Simple approximation for demonstration
    // Just mock or evaluate a small ratio for simplicity if we can't extract the innerText here

    // Inputs
    const inputMatches = html.match(/<input[^>]*>|<textarea[^>]*>/gi) || [];
    const totalInputs = inputMatches.length;
    let inputsMissingLabel = 0;
    inputMatches.forEach(input => {
      // Check if lacks placeholder and lacks label tag or id
      if (!/placeholder=/i.test(input) && !/id=/i.test(input)) {
        inputsMissingLabel++;
      }
    });

    // Security Headers Check
    const securityHeaders = {
      csp: !!(headers['content-security-policy'] || headers['x-webkit-csp']),
      xFrameOptions: !!headers['x-frame-options'],
      xContentTypeOptions: !!headers['x-content-type-options'],
      hsts: !!headers['strict-transport-security'],
      cors: headers['access-control-allow-origin'] || "none"
    };

    const staticAudit = {
      url: resolvedUrl,
      title,
      metaDescription,
      hasFavicon,
      hasViewport,
      hasOgImage,
      headingsCount,
      totalImages,
      imagesMissingAlt,
      totalButtons,
      buttonsMissingLabel,
      totalInputs,
      inputsMissingLabel,
      securityHeaders
    };

    // CLEAN HTML FOR GEMINI (To avoid overloading tokens, strip CSS, SVGs, and inline JS)
    let cleanHtmlForGemini = html;
    cleanHtmlForGemini = cleanHtmlForGemini.replace(/<path[^>]*>.*?<\/path>/gi, '');
    cleanHtmlForGemini = cleanHtmlForGemini.replace(/<svg[^>]*>.*?<\/svg>/gi, '<svg>[SVG Vector Stripped]</svg>');
    cleanHtmlForGemini = cleanHtmlForGemini.replace(/<style[^>]*>.*?<\/style>/gi, '<style>[CSS Styles Stripped]</style>');
    cleanHtmlForGemini = cleanHtmlForGemini.replace(/<script[^>]*>.*?<\/script>/gi, '<script>[JS Code Stripped]</script>');
    if (cleanHtmlForGemini.length > 35000) {
      cleanHtmlForGemini = cleanHtmlForGemini.substring(0, 35000) + "\n... [Content Truncated for Audit]";
    }

    // Call Gemini to generate deep analysis and testing artifacts
    const prompt = `
      You are an expert Web App Auditor, Accessibility Specialist, and QA Automation Engineer.
      Analyze the following HTML structure and metadata findings for the website: ${resolvedUrl}.
      
      Target URL: ${resolvedUrl}
      Static Metadata Audits:
      - Title: ${title}
      - Meta Description: ${metaDescription}
      - Viewport defined: ${hasViewport}
      - H1 Heading Count: ${headingsCount.h1}
      - H2 Heading Count: ${headingsCount.h2}
      - Total Images: ${totalImages} (Images missing alt tags: ${imagesMissingAlt})
      - Total Form Inputs: ${totalInputs}
      - Security Headers Profile: ${JSON.stringify(securityHeaders)}

      Here is the trimmed semantic HTML structure of the page:
      \`\`\`html
      ${cleanHtmlForGemini}
      \`\`\`

      Perform a rigorous, professional visual and heuristic audit of this page, and synthesize real-world automation tests.
      Generate:
      1. Overall UX/UI Rating (1-100) and a sophisticated summary of design patterns, contrast, layout, and visual flow.
      2. 5 detailed heuristic evaluations from Nielsen's 10 Usability Heuristics, specifically matched to this site's elements.
      3. A structured critique of Accessibility (e.g. screen reader navigation, missing labels, contrast, headings structure).
      4. A comprehensive, production-grade Cypress test script (Cypress v12+) complete with real selector guesses from the HTML, form interactions (like typing if inputs exist), and page-load/title checks. Ensure the Cypress tests use realistic assertions.
      5. A comprehensive, production-grade Playwright (TypeScript) test script doing the same.
      6. A list of 4-6 sequential interactive verification steps that a human tester can manually follow inside our device simulator. Give precise instructions (e.g. "Step 1: Check header logo is visible", "Step 2: Enter text into input field").

      Output MUST be strictly valid JSON according to the requested schema. Do not include markdown wraps around the JSON or any other text before/after.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            uxRating: { type: Type.NUMBER, description: "Overall UX rating out of 100" },
            uxSummary: { type: Type.STRING, description: "Comprehensive analysis of layout, visual hierarchy, branding, and typography" },
            heuristics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Heuristic name" },
                  status: { type: Type.STRING, description: "Must be 'PASSED', 'WARNING', or 'FAILED'" },
                  observation: { type: Type.STRING, description: "Detailed observation of the site's layout or behavior" },
                  recommendation: { type: Type.STRING, description: "Actionable prescription for fixing the issue" }
                },
                required: ["name", "status", "observation", "recommendation"]
              }
            },
            accessibilityCritique: { type: Type.STRING, description: "Critique of web accessibility and suggestions for improvement" },
            cypressScript: { type: Type.STRING, description: "Cypress integration test script" },
            playwrightScript: { type: Type.STRING, description: "Playwright TypeScript test script" },
            interactiveSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  action: { type: Type.STRING, description: "Action to take inside simulator" },
                  assertion: { type: Type.STRING, description: "Expected result or visual confirmation" }
                },
                required: ["id", "action", "assertion"]
              }
            }
          },
          required: [
            "uxRating",
            "uxSummary",
            "heuristics",
            "accessibilityCritique",
            "cypressScript",
            "playwrightScript",
            "interactiveSteps"
          ]
        }
      }
    });

    const responseText = response.text;
    const geminiAudit = JSON.parse(responseText.trim());

    res.json({
      success: true,
      staticAudit,
      geminiAudit
    });

  } catch (error: any) {
    console.error("Audit error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to audit site" });
  }
});

// Serve frontend assets in production and Vite middleware in dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
