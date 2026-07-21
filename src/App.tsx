import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { 
  Plus, 
  Trash2, 
  Search, 
  Download, 
  Upload, 
  RefreshCw, 
  LogOut, 
  User as UserIcon, 
  Info, 
  ChevronRight, 
  ChevronDown, 
  TrendingUp, 
  CalendarDays, 
  Layers, 
  DollarSign,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Wrench,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Partida, FlujoSemana } from './types';
import { defaultPartidas } from './data';
import { OpenArquitectosLogo } from './components/OpenArquitectosLogo';

// Supabase configuration using the user's actual credentials
const SUPABASE_URL = 'https://xsnohophlkthtofguamk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzbm9ob3BobGt0aHRvZmd1YW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0Nzg1NjgsImV4cCI6MjEwMDA1NDU2OH0.e05PgfTJFkVnCViV-PmGIwJGPPxFQH1rjGoZ69shYWk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  // Authentication states
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Editable Project Title
  const [projectTitle, setProjectTitle] = useState('Remodelación Nogales');

  // Application data states
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'local'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search & Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [showTips, setShowTips] = useState(true);

  // File import reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for creating custom rows
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPartida, setNewPartida] = useState<Partida>({
    esp: 'PRIMER NIVEL',
    subesp: 'ADICIONAL',
    codigo: '1.99',
    nombre: 'Nueva Partida Especial',
    inicio: 1,
    duracion: 4,
    mat: 1000,
    mo: 1000
  });

  // Hover state for interactive SVG cash flow chart tooltip
  const [activeTooltip, setActiveTooltip] = useState<{
    week: number;
    mat: number;
    mo: number;
    total: number;
    x: number;
    y: number;
  } | null>(null);

  // PDF exporting state
  const [exportingPDF, setExportingPDF] = useState<string | null>(null);

  // Format currencies with Soles (S/) locale
  const fmtMoneda = useMemo(() => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
  }, []);

  // Check for active session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
        cargarDatosUsuario(data.session.user.id);
      } else {
        // Try to load guest data if previously used
        const localData = localStorage.getItem('nogales_guest_budget');
        if (localData) {
          try {
            setPartidas(JSON.parse(localData));
            setIsGuestMode(true);
            setSaveStatus('local');
          } catch (e) {
            console.error('Error reading guest data', e);
          }
        }
        const localTitle = localStorage.getItem('nogales_project_title');
        if (localTitle) {
          setProjectTitle(localTitle);
        }
      }
    };
    checkSession();

    // Setup Auth State Change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        setIsGuestMode(false);
        cargarDatosUsuario(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsGuestMode(false);
        setPartidas([]);
        setProjectTitle('Remodelación Nogales');
        setSaveStatus('idle');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch budget data for user
  const cargarDatosUsuario = async (userId: string) => {
    setIsLoadingData(true);
    setSaveStatus('idle');
    try {
      const { data, error } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching data from Supabase', error);
        setSaveStatus('error');
        return;
      }

      if (data && data.contenido) {
        setPartidas(data.contenido);
        if (data.titulo) {
          setProjectTitle(data.titulo);
        } else {
          setProjectTitle('Remodelación Nogales');
        }
        setSaveStatus('saved');
      } else {
        // First login, initialize user's table with the default dataset
        const { error: insertError } = await supabase
          .from('presupuestos')
          .insert({ user_id: userId, contenido: defaultPartidas, titulo: 'Remodelación Nogales' });
        
        if (insertError) {
          console.error('Error creating initial user data', insertError);
          setSaveStatus('error');
        }
        setPartidas(JSON.parse(JSON.stringify(defaultPartidas)));
        setProjectTitle('Remodelación Nogales');
        setSaveStatus('saved');
      }
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError('Por favor complete todos los campos.');
      return;
    }
    setAuthError(null);
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword
      });

      if (error) {
        setAuthError(error.message);
      } else if (data?.user) {
        setUser(data.user);
        setIsGuestMode(false);
        cargarDatosUsuario(data.user.id);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error al iniciar sesión');
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError('Por favor complete todos los campos.');
      return;
    }
    setAuthError(null);
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail.trim(),
        password: authPassword
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setAuthError('Usuario registrado con éxito. Inicie sesión para continuar o revise su correo.');
        setIsSignUp(false);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error en el registro');
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('nogales_guest_budget');
    setUser(null);
    setIsGuestMode(false);
    setPartidas([]);
    setSaveStatus('idle');
  };

  // Enter Guest Mode
  const enterGuestMode = () => {
    setIsGuestMode(true);
    setAuthError(null);
    const localData = localStorage.getItem('nogales_guest_budget');
    if (localData) {
      try {
        setPartidas(JSON.parse(localData));
      } catch (e) {
        setPartidas(JSON.parse(JSON.stringify(defaultPartidas)));
      }
    } else {
      setPartidas(JSON.parse(JSON.stringify(defaultPartidas)));
      localStorage.setItem('nogales_guest_budget', JSON.stringify(defaultPartidas));
    }
    
    const localTitle = localStorage.getItem('nogales_project_title');
    if (localTitle) {
      setProjectTitle(localTitle);
    } else {
      setProjectTitle('Remodelación Nogales');
    }
    setSaveStatus('local');
  };

  // Programmed autosave (Debounce)
  const persistChanges = (updatedPartidas: Partida[], updatedTitle?: string) => {
    setPartidas(updatedPartidas);
    const titleToSave = updatedTitle !== undefined ? updatedTitle : projectTitle;

    if (isGuestMode) {
      localStorage.setItem('nogales_guest_budget', JSON.stringify(updatedPartidas));
      if (updatedTitle !== undefined) {
        localStorage.setItem('nogales_project_title', updatedTitle);
      }
      setSaveStatus('local');
      return;
    }

    if (!user) return;

    setSaveStatus('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('presupuestos')
          .update({ 
            contenido: updatedPartidas, 
            titulo: titleToSave,
            updated_at: new Date().toISOString() 
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error saving data', error);
          setSaveStatus('error');
        } else {
          setSaveStatus('saved');
        }
      } catch (e) {
        console.error(e);
        setSaveStatus('error');
      }
    }, 1500);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Edit budget item
  const handleEditItem = (index: number, field: keyof Partida, value: any) => {
    const updated = [...partidas];
    if (field === 'inicio' || field === 'duracion') {
      updated[index] = {
        ...updated[index],
        [field]: Math.max(1, parseInt(value) || 1)
      };
    } else if (field === 'mat' || field === 'mo') {
      updated[index] = {
        ...updated[index],
        [field]: Math.max(0, parseFloat(value) || 0)
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
    }
    persistChanges(updated);
  };

  // Add custom manual item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...partidas, { ...newPartida }];
    persistChanges(updated);
    setShowAddModal(false);
  };

  // Delete budget item
  const handleDeleteItem = (index: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta partida?')) {
      const updated = partidas.filter((_, idx) => idx !== index);
      persistChanges(updated);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Especialidad', 'Sub-especialidad', 'Código', 'Nombre', 'Semana de Inicio', 'Duración (Semanas)', 'Costo Materiales (S/)', 'Costo Mano de Obra (S/)'];
    const rows = partidas.map(p => [
      p.esp,
      p.subesp,
      p.codigo,
      p.nombre,
      p.inicio,
      p.duracion,
      p.mat,
      p.mo
    ]);
    
    // Add UTF-8 BOM so Excel opens it with correct accents (á, é, í, ó, ú, ñ)
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'presupuesto_ Nogales.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import from CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        
        if (lines.length <= 1) {
          alert('El archivo CSV está vacío.');
          return;
        }

        const isHeader = lines[0].includes('Especialidad') || lines[0].includes('Codigo') || lines[0].includes('Código');
        const startIdx = isHeader ? 1 : 0;
        
        const importedItems: Partida[] = [];
        
        for (let i = startIdx; i < lines.length; i++) {
          const line = lines[i];
          // simple CSV parser handling quoted comma values
          const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
          const cols = matches.map(col => col.replace(/^"|"$/g, '').trim());
          
          if (cols.length < 8) continue;
          
          const esp = cols[0];
          const subesp = cols[1];
          const codigo = cols[2];
          const nombre = cols[3];
          const inicio = Math.max(1, parseInt(cols[4]) || 1);
          const duracion = Math.max(1, parseInt(cols[5]) || 1);
          const mat = Math.max(0, parseFloat(cols[6]) || 0);
          const mo = Math.max(0, parseFloat(cols[7]) || 0);
          
          importedItems.push({ esp, subesp, codigo, nombre, inicio, duracion, mat, mo });
        }
        
        if (importedItems.length > 0) {
          if (window.confirm(`Se procesaron ${importedItems.length} partidas. ¿Deseas reemplazar el presupuesto actual por este archivo?`)) {
            persistChanges(importedItems);
          }
        } else {
          alert('No se pudieron procesar filas válidas del archivo CSV. Asegúrate de respetar la estructura de columnas.');
        }
      } catch (err) {
        console.error(err);
        alert('Error leyendo el archivo. Asegúrate de subir un CSV válido.');
      }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = ''; // Clear value
  };

  // Helper to sanitize cloned document for html2canvas to fix Tailwind v4 "oklab" / "oklch" color parsing error
  // and convert form inputs to clear, unclipped static text for PDFs without destroying true background colors.
  const sanitizeClonedDocForPDF = (clonedDoc: Document) => {
    // Dynamic color cache and browser style evaluator
    const colorCache = new Map<string, string>();
    const convertColorToRGB = (colorStr: string): string => {
      if (colorCache.has(colorStr)) return colorCache.get(colorStr)!;
      try {
        const div = document.createElement('div');
        div.style.color = colorStr;
        document.body.appendChild(div);
        const computed = window.getComputedStyle(div).color;
        document.body.removeChild(div);
        if (computed && (computed.startsWith('rgb') || computed.startsWith('rgba'))) {
          colorCache.set(colorStr, computed);
          return computed;
        }
      } catch {
        // fallback
      }
      return colorStr;
    };

    const sanitizeColorRules = (str: string): string => {
      if (!str) return str;
      return str.replace(/(oklab|oklch|color-mix|light-dark)\([^)]+\)/gi, (match) => {
        return convertColorToRGB(match);
      });
    };

    // 1. Clean all <style> elements in clonedDoc
    const styleElements = clonedDoc.querySelectorAll('style');
    styleElements.forEach((style) => {
      if (style.textContent) {
        style.textContent = sanitizeColorRules(style.textContent);
      }
    });

    // 2. Clean stylesheet rules if accessible
    try {
      Array.from(clonedDoc.styleSheets).forEach((sheet) => {
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            Array.from(rules).forEach((rule) => {
              if (rule.cssText && (rule.cssText.includes('oklab') || rule.cssText.includes('oklch') || rule.cssText.includes('light-dark') || rule.cssText.includes('color-mix'))) {
                const styleObj = (rule as CSSStyleRule).style;
                if (styleObj) {
                  for (let i = 0; i < styleObj.length; i++) {
                    const prop = styleObj[i];
                    const val = styleObj.getPropertyValue(prop);
                    if (val && (val.includes('oklab') || val.includes('oklch') || val.includes('light-dark') || val.includes('color-mix'))) {
                      styleObj.setProperty(prop, sanitizeColorRules(val));
                    }
                  }
                }
              }
            });
          }
        } catch (e) {
          // Ignore cross-origin sheet errors
        }
      });
    } catch (e) {
      // Ignore sheet errors
    }

    // 3. Clean all element inline styles
    const allElements = clonedDoc.querySelectorAll('*');
    allElements.forEach((node) => {
      const el = node as HTMLElement;
      if (el.style && el.style.cssText) {
        if (
          el.style.cssText.includes('oklab') ||
          el.style.cssText.includes('oklch') ||
          el.style.cssText.includes('light-dark') ||
          el.style.cssText.includes('color-mix')
        ) {
          el.style.cssText = sanitizeColorRules(el.style.cssText);
        }
      }
    });

    // 4. Convert all <input> and <select> elements to plain text nodes so html2canvas never clips text inside form boxes
    const inputs = clonedDoc.querySelectorAll('input, select');
    inputs.forEach((input) => {
      const el = input as HTMLInputElement | HTMLSelectElement;
      const val = el.value || '';
      const textDiv = clonedDoc.createElement('div');
      textDiv.textContent = val;
      textDiv.style.display = 'block';
      textDiv.style.width = '100%';
      textDiv.style.color = '#f1f5f9';
      textDiv.style.fontSize = '11px';
      textDiv.style.fontWeight = '500';
      textDiv.style.fontFamily = 'sans-serif';
      textDiv.style.whiteSpace = 'normal';
      textDiv.style.wordBreak = 'break-word';
      textDiv.style.padding = '3px 4px';
      textDiv.style.lineHeight = '1.3';
      if (el.parentNode) {
        el.parentNode.replaceChild(textDiv, el);
      }
    });
  };

  // Export functions to PDF using jsPDF and html2canvas-pro
  const exportPresupuestoPDF = async () => {
    if (exportingPDF) return;
    setExportingPDF('presupuesto');
    try {
      const element = document.getElementById('section-presupuesto');
      if (!element) return;

      const scrollWrapper = element.querySelector('.budget-table-container') as HTMLElement;
      
      // Save original styles for expansion
      let origMaxHeight = '';
      let origOverflowY = '';
      if (scrollWrapper) {
        origMaxHeight = scrollWrapper.style.maxHeight;
        origOverflowY = scrollWrapper.style.overflowY;
        scrollWrapper.style.maxHeight = 'none';
        scrollWrapper.style.overflowY = 'visible';
      }

      // Temporarily change sticky elements to static so they render inline in the grid/table
      const stickyEls = element.querySelectorAll('.sticky');
      const originalStickies: { el: HTMLElement; position: string }[] = [];
      stickyEls.forEach((el: any) => {
        originalStickies.push({ el, position: el.style.position });
        el.style.position = 'static';
      });

      // Wait a brief moment for layout reflow
      await new Promise(resolve => setTimeout(resolve, 150));

      // Capture canvas
      const html2canvasFn = (html2canvas as any).default || html2canvas;
      const canvas = await html2canvasFn(element, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document) => {
          sanitizeClonedDocForPDF(clonedDoc);
        }
      });

      // Restore original styles
      if (scrollWrapper) {
        scrollWrapper.style.maxHeight = origMaxHeight;
        scrollWrapper.style.overflowY = origOverflowY;
      }
      originalStickies.forEach(item => {
        item.el.style.position = item.position;
      });

      // Generate PDF with page margins and crisp scaling
      const jsPDFClass = (jsPDF as any).jsPDF || (jsPDF as any).default || jsPDF;
      const pdf = new jsPDFClass('l', 'mm', 'a4'); // landscape (297mm x 210mm)
      const margin = 10;
      const printableWidth = 297 - (margin * 2); // 277mm
      const printableHeight = 210 - (margin * 2); // 190mm

      const imgWidth = printableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      if (imgHeight <= printableHeight) {
        const yPos = margin + (printableHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= printableHeight;

        while (heightLeft > 0) {
          pdf.addPage();
          position = margin - (imgHeight - heightLeft);
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          heightLeft -= printableHeight;
        }
      }

      pdf.save('presupuesto_Nogales.pdf');
    } catch (error) {
      console.error('Error al exportar presupuesto a PDF:', error);
      alert('Error al exportar presupuesto a PDF: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setExportingPDF(null);
    }
  };

  const exportFlujoPDF = async () => {
    if (exportingPDF) return;
    setExportingPDF('flujo');
    try {
      const element = document.getElementById('section-flujocaja');
      if (!element) return;

      const scrollWrapper = element.querySelector('.cashflow-container') as HTMLElement;
      
      // Calculate chart width based on week count
      const chartWidth = 80 + (flujoSemanas.length || 1) * 65 + 90 + 35;
      const totalWidthWithPadding = chartWidth + 48;

      // Save original styles for full viewport capture
      const origElWidth = element.style.width;
      const origElMinWidth = element.style.minWidth;
      element.style.width = `${totalWidthWithPadding}px`;
      element.style.minWidth = `${totalWidthWithPadding}px`;

      let origMaxHeight = '';
      let origOverflowY = '';
      let origOverflowX = '';
      let origWidth = '';
      let origMinWidth = '';
      if (scrollWrapper) {
        origMaxHeight = scrollWrapper.style.maxHeight;
        origOverflowY = scrollWrapper.style.overflowY;
        origOverflowX = scrollWrapper.style.overflowX;
        origWidth = scrollWrapper.style.width;
        origMinWidth = scrollWrapper.style.minWidth;

        // Force full expansion
        scrollWrapper.style.maxHeight = 'none';
        scrollWrapper.style.overflowY = 'visible';
        scrollWrapper.style.overflowX = 'visible';
        scrollWrapper.style.width = `${chartWidth}px`;
        scrollWrapper.style.minWidth = `${chartWidth}px`;
      }

      // Temporarily change sticky elements to static so they render inline in html2canvas
      const stickyEls = element.querySelectorAll('.sticky');
      const originalStickies: { el: HTMLElement; position: string }[] = [];
      stickyEls.forEach((el: any) => {
        originalStickies.push({ el, position: el.style.position });
        el.style.position = 'static';
      });

      // Wait a moment for layout reflow
      await new Promise(resolve => setTimeout(resolve, 150));

      const html2canvasFn = (html2canvas as any).default || html2canvas;
      const canvas = await html2canvasFn(element, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document) => {
          sanitizeClonedDocForPDF(clonedDoc);

          const clonedSection = clonedDoc.getElementById('section-flujocaja');
          if (clonedSection) {
            clonedSection.style.width = `${totalWidthWithPadding}px`;
            clonedSection.style.minWidth = `${totalWidthWithPadding}px`;
          }

          const clonedCashflow = clonedDoc.querySelector('.cashflow-container') as HTMLElement;
          if (clonedCashflow) {
            clonedCashflow.style.width = `${chartWidth}px`;
            clonedCashflow.style.minWidth = `${chartWidth}px`;
            clonedCashflow.style.overflow = 'visible';
            clonedCashflow.style.maxHeight = 'none';
          }
        }
      });

      // Restore original styles
      element.style.width = origElWidth;
      element.style.minWidth = origElMinWidth;

      if (scrollWrapper) {
        scrollWrapper.style.maxHeight = origMaxHeight;
        scrollWrapper.style.overflowY = origOverflowY;
        scrollWrapper.style.overflowX = origOverflowX;
        scrollWrapper.style.width = origWidth;
        scrollWrapper.style.minWidth = origMinWidth;
      }
      originalStickies.forEach(item => {
        item.el.style.position = item.position;
      });

      const jsPDFClass = (jsPDF as any).jsPDF || (jsPDF as any).default || jsPDF;
      const pdf = new jsPDFClass('l', 'mm', 'a4'); // landscape (297mm x 210mm)
      const margin = 10;
      const printableWidth = 297 - (margin * 2); // 277mm
      const printableHeight = 210 - (margin * 2); // 190mm

      // Scale Flujo de caja so all months & weeks fit cleanly onto 1 landscape page
      const scale = Math.min(printableWidth / canvas.width, printableHeight / canvas.height);
      const imgWidth = canvas.width * scale;
      const imgHeight = canvas.height * scale;

      const xPos = margin + (printableWidth - imgWidth) / 2;
      const yPos = margin + (printableHeight - imgHeight) / 2;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);

      pdf.save('flujo_de_caja_Nogales.pdf');
    } catch (error) {
      console.error('Error al exportar flujo de caja a PDF:', error);
      alert('Error al exportar flujo de caja a PDF: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setExportingPDF(null);
    }
  };

  const exportGanttPDF = async () => {
    if (exportingPDF) return;
    setExportingPDF('cronograma');
    try {
      const element = document.getElementById('section-cronograma');
      if (!element) return;

      const scrollWrapper = element.querySelector('.gantt-container') as HTMLElement;
      const gridEl = element.querySelector('.gantt-grid') as HTMLElement;

      // Calculate full natural width of the Gantt chart (Code 60px + Partida 240px + 45px per week)
      const totalGanttWidth = 60 + 240 + (calculations.maxSemana * 45);
      const totalWidthWithPadding = totalGanttWidth + 48;

      // Save original styles for full viewport capture
      const origElWidth = element.style.width;
      const origElMinWidth = element.style.minWidth;
      element.style.width = `${totalWidthWithPadding}px`;
      element.style.minWidth = `${totalWidthWithPadding}px`;

      let origMaxHeight = '';
      let origOverflowY = '';
      let origOverflowX = '';
      let origWidth = '';
      let origMinWidth = '';
      if (scrollWrapper) {
        origMaxHeight = scrollWrapper.style.maxHeight;
        origOverflowY = scrollWrapper.style.overflowY;
        origOverflowX = scrollWrapper.style.overflowX;
        origWidth = scrollWrapper.style.width;
        origMinWidth = scrollWrapper.style.minWidth;

        // Force full width expansion so no month is cut off on the right
        scrollWrapper.style.maxHeight = 'none';
        scrollWrapper.style.overflowY = 'visible';
        scrollWrapper.style.overflowX = 'visible';
        scrollWrapper.style.width = `${totalGanttWidth}px`;
        scrollWrapper.style.minWidth = `${totalGanttWidth}px`;
      }

      // Save original style of grid container
      let origGridWidth = '';
      let origGridMinWidth = '';
      if (gridEl) {
        origGridWidth = gridEl.style.width;
        origGridMinWidth = gridEl.style.minWidth;
        gridEl.style.width = `${totalGanttWidth}px`;
        gridEl.style.minWidth = `${totalGanttWidth}px`;
      }

      // Temporarily change sticky elements to static so they render inline in the grid/table
      const stickyEls = element.querySelectorAll('.sticky');
      const originalStickies: { el: HTMLElement; position: string }[] = [];
      stickyEls.forEach((el: any) => {
        originalStickies.push({ el, position: el.style.position });
        el.style.position = 'static';
      });

      // Wait a moment for layout reflow
      await new Promise(resolve => setTimeout(resolve, 150));

      // Capture canvas with html2canvas-pro
      const html2canvasFn = (html2canvas as any).default || html2canvas;
      const canvas = await html2canvasFn(element, {
        backgroundColor: '#0f172a',
        scale: 2, // high quality
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document) => {
          sanitizeClonedDocForPDF(clonedDoc);

          // Additional Gantt-specific enhancements in cloned DOM
          const clonedGanttSection = clonedDoc.getElementById('section-cronograma');
          if (clonedGanttSection) {
            clonedGanttSection.style.width = `${totalWidthWithPadding}px`;
            clonedGanttSection.style.minWidth = `${totalWidthWithPadding}px`;
          }

          const clonedScroll = clonedDoc.querySelector('.gantt-container') as HTMLElement;
          const clonedGrid = clonedDoc.querySelector('.gantt-grid') as HTMLElement;
          if (clonedScroll) {
            clonedScroll.style.width = `${totalGanttWidth}px`;
            clonedScroll.style.minWidth = `${totalGanttWidth}px`;
            clonedScroll.style.overflow = 'visible';
            clonedScroll.style.maxHeight = 'none';
          }
          if (clonedGrid) {
            clonedGrid.style.width = `${totalGanttWidth}px`;
            clonedGrid.style.minWidth = `${totalGanttWidth}px`;
            clonedGrid.style.overflow = 'visible';
          }

          // Ensure partida names in Gantt are unclipped and highly visible
          const nameCells = clonedDoc.querySelectorAll('.g-name');
          nameCells.forEach((node) => {
            const cell = node as HTMLElement;
            cell.style.whiteSpace = 'normal';
            cell.style.wordBreak = 'break-word';
            cell.style.overflow = 'visible';
            cell.style.color = '#f1f5f9';
            cell.style.fontSize = '11px';
          });
        }
      });

      // Restore original styles
      element.style.width = origElWidth;
      element.style.minWidth = origElMinWidth;

      if (scrollWrapper) {
        scrollWrapper.style.maxHeight = origMaxHeight;
        scrollWrapper.style.overflowY = origOverflowY;
        scrollWrapper.style.overflowX = origOverflowX;
        scrollWrapper.style.width = origWidth;
        scrollWrapper.style.minWidth = origMinWidth;
      }
      if (gridEl) {
        gridEl.style.width = origGridWidth;
        gridEl.style.minWidth = origGridMinWidth;
      }
      originalStickies.forEach(item => {
        item.el.style.position = item.position;
      });

      // Generate PDF: Width matches printable landscape page width (277mm), height flows across pages if needed
      const jsPDFClass = (jsPDF as any).jsPDF || (jsPDF as any).default || jsPDF;
      const pdf = new jsPDFClass('l', 'mm', 'a4');
      const margin = 10;
      const printableWidth = 297 - (margin * 2); // 277mm
      const printableHeight = 210 - (margin * 2); // 190mm

      const imgWidth = printableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      if (imgHeight <= printableHeight) {
        const yPos = margin + (printableHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= printableHeight;

        while (heightLeft > 0) {
          pdf.addPage();
          position = margin - (imgHeight - heightLeft);
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          heightLeft -= printableHeight;
        }
      }

      pdf.save('cronograma_Nogales.pdf');
    } catch (error) {
      console.error('Error al exportar cronograma a PDF:', error);
      alert('Error al exportar cronograma a PDF: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setExportingPDF(null);
    }
  };

  // Dynamic calculations: Totals and Max Week
  const calculations = useMemo(() => {
    let totalMateriales = 0;
    let totalManoObra = 0;
    let maxSemana = 0;

    partidas.forEach(p => {
      totalMateriales += p.mat;
      totalManoObra += p.mo;
      const endWeek = p.inicio + p.duracion - 1;
      if (endWeek > maxSemana) {
        maxSemana = endWeek;
      }
    });

    return {
      totalMateriales,
      totalManoObra,
      totalProyecto: totalMateriales + totalManoObra,
      maxSemana: maxSemana || 26 // default to 26 weeks if empty
    };
  }, [partidas]);

  // Compute sub-totals per Specialty & Sub-specialty for collapsible group rendering
  const groupTotals = useMemo(() => {
    const specialtyTotals: Record<string, { mat: number, mo: number, total: number }> = {};
    const subSpecialtyTotals: Record<string, { mat: number, mo: number, total: number }> = {};

    partidas.forEach(p => {
      const subKey = `${p.esp}-${p.subesp}`;
      const total = p.mat + p.mo;

      if (!specialtyTotals[p.esp]) {
        specialtyTotals[p.esp] = { mat: 0, mo: 0, total: 0 };
      }
      specialtyTotals[p.esp].mat += p.mat;
      specialtyTotals[p.esp].mo += p.mo;
      specialtyTotals[p.esp].total += total;

      if (!subSpecialtyTotals[subKey]) {
        subSpecialtyTotals[subKey] = { mat: 0, mo: 0, total: 0 };
      }
      subSpecialtyTotals[subKey].mat += p.mat;
      subSpecialtyTotals[subKey].mo += p.mo;
      subSpecialtyTotals[subKey].total += total;
    });

    return { specialtyTotals, subSpecialtyTotals };
  }, [partidas]);

  // Compute Weekly cash flow data
  const flujoSemanas = useMemo<FlujoSemana[]>(() => {
    const totalWeeks = calculations.maxSemana;
    const array: FlujoSemana[] = Array.from({ length: totalWeeks }, (_, i) => ({
      sem: i + 1,
      mat: 0,
      mo: 0,
      total: 0
    }));

    partidas.forEach(p => {
      if (p.duracion > 0 && p.inicio > 0) {
        const rateMat = p.mat / p.duracion;
        const rateMo = p.mo / p.duracion;
        for (let w = p.inicio; w < p.inicio + p.duracion; w++) {
          if (w <= totalWeeks) {
            array[w - 1].mat += rateMat;
            array[w - 1].mo += rateMo;
            array[w - 1].total += rateMat + rateMo;
          }
        }
      }
    });

    return array;
  }, [partidas, calculations.maxSemana]);

  // Unique lists of specialties for filtering
  const specialties = useMemo(() => {
    const list = new Set(partidas.map(p => p.esp));
    return Array.from(list);
  }, [partidas]);

  // Filtered list of budget items
  const filteredPartidasWithOriginalIndex = useMemo(() => {
    return partidas
      .map((p, originalIndex) => ({ ...p, originalIndex }))
      .filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.subesp.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'all' || p.esp === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
      });
  }, [partidas, searchTerm, selectedSpecialty]);

  // Grouped filtered items for rendering
  const groupedPartidas = useMemo(() => {
    const groups: Record<string, Record<string, typeof filteredPartidasWithOriginalIndex>> = {};
    
    filteredPartidasWithOriginalIndex.forEach(p => {
      if (!groups[p.esp]) {
        groups[p.esp] = {};
      }
      if (!groups[p.esp][p.subesp]) {
        groups[p.esp][p.subesp] = [];
      }
      groups[p.esp][p.subesp].push(p);
    });

    return groups;
  }, [filteredPartidasWithOriginalIndex]);

  // Reset budget back to defaults
  const handleResetToDefaults = () => {
    if (window.confirm('¿Está seguro de restablecer todos los valores al presupuesto inicial del proyecto? Perderá los cambios no guardados.')) {
      persistChanges(JSON.parse(JSON.stringify(defaultPartidas)));
    }
  };

  // Toggle visual group collapse
  const toggleGroupCollapse = (key: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper values for cash flow visual height metrics
  const maxWeeklyCashFlow = useMemo(() => {
    const maxVal = Math.max(...flujoSemanas.map(s => s.total), 1);
    return Math.ceil(maxVal / 1000) * 1000;
  }, [flujoSemanas]);

  // If not logged in and not in guest mode, show modern authentication screen
  if (!user && !isGuestMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Architectural subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
          <div className="mx-auto h-16 w-16 bg-slate-900 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-950/40 glow-active">
            <Wrench className="h-7 w-7 text-emerald-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight font-display">
            Remodelación Nogales
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
            Plataforma financiera inteligente para control de presupuestos, flujo de caja semanal y cronograma Gantt de obra.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-slate-900/80 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800/80 premium-glow">
            <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2.5 font-display">
              <Lock className="w-4 h-4 text-emerald-400" />
              {isSignUp ? 'Crear Cuenta de Obra' : 'Acceso al Proyecto'}
            </h3>

            {authError && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-medium flex gap-2.5 items-center">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="arquitecto@nogales.com"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/80 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Contraseña de Acceso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/80 transition-all pr-10 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {authLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : isSignUp ? (
                    'REGISTRAR CUENTA'
                  ) : (
                    'ENTRAR A LA CONSOLA'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError(null);
                }}
                className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors underline underline-offset-4 cursor-pointer"
              >
                {isSignUp ? '¿Ya tiene cuenta? Iniciar Sesión' : '¿No tiene cuenta? Regístrese aquí'}
              </button>

              <div className="w-full flex items-center my-1 text-slate-700">
                <div className="flex-1 border-t border-slate-800"></div>
                <span className="px-3 text-[9px] uppercase font-bold tracking-widest text-slate-600">O BIEN</span>
                <div className="flex-1 border-t border-slate-800"></div>
              </div>

              <button
                type="button"
                onClick={enterGuestMode}
                className="w-full bg-slate-950/40 hover:bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:border-slate-700 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400 glow-active" />
                Ingresar como Invitado (Modo Demo Offline)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Authenticated App Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header Area */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-4 py-3 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="h-10 px-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 glow-active" title="Open Arquitectos">
            <OpenArquitectosLogo size={28} />
          </div>
          <div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-emerald-400 font-black font-mono leading-none mb-1">
              www.openarquitectos.com
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-md md:text-lg font-bold tracking-tight font-display text-white flex-wrap">
                <span className="text-slate-400 font-medium">Presupuesto</span>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => {
                    setProjectTitle(e.target.value);
                    persistChanges(partidas, e.target.value);
                  }}
                  className="bg-slate-950/50 hover:bg-slate-950/90 focus:bg-slate-950 text-white font-extrabold border border-dashed border-slate-700 hover:border-slate-500 focus:border-emerald-500 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 transition-all text-xs md:text-sm max-w-[180px] sm:max-w-[240px] md:max-w-[320px]"
                  placeholder="Remodelación Nogales"
                  title="Haz clic para editar el nombre del proyecto"
                />
              </div>
              <span className="hidden md:inline-block px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider border border-emerald-500/20">
                PRO CONSOLE
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Control Financiero, Cronograma Gantt y Programación Semanal de Obra</p>
          </div>
        </div>

        {/* User Session & Saving indicator */}
        <div className="flex items-center justify-between md:justify-end gap-3.5 bg-slate-950/80 p-2 md:p-1.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-300 px-2 font-mono">
            <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold max-w-[140px] truncate">
              {isGuestMode ? 'Modo Local' : user?.email}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* AutoSave Badge */}
            {saveStatus === 'saving' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-lg animate-pulse font-mono">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                Sincronizando...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg font-mono">
                <CheckCircle className="w-2.5 h-2.5" />
                Sincronizado Supabase ✓
              </span>
            )}
            {saveStatus === 'local' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-lg font-mono">
                <Clock className="w-2.5 h-2.5" />
                Almacenamiento Local
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-lg font-mono">
                <AlertTriangle className="w-2.5 h-2.5" />
                Error de Enlace
              </span>
            )}

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition-colors text-xs flex items-center gap-1.5 font-bold cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Top Banner / Instructions */}
      {showTips && (
        <div className="bg-slate-900/80 border-b border-slate-800/80 py-3 px-4 md:px-8 text-xs text-slate-300 flex items-center justify-between gap-4 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <Info className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
            <p className="leading-relaxed">
              <strong>Instrucciones:</strong> Edita los valores de <strong className="text-emerald-400">Inicio</strong>, <strong className="text-emerald-400">Duración</strong> y <strong className="text-emerald-400">Costos (Mat. y M.O.)</strong> directamente haciendo click en las celdas del presupuesto. El cronograma de obra y flujo de caja consolidado se recalcularán en tiempo real.
            </p>
          </div>
          <button 
            onClick={() => setShowTips(false)}
            className="text-slate-500 hover:text-slate-300 transition-colors text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded hover:bg-slate-800"
          >
            Entendido
          </button>
        </div>
      )}

      {/* 3. Metrics Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 pt-6 md:px-8 max-w-[1800px] w-full mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-xl p-4.5 flex items-center justify-between shadow-lg hover:border-emerald-500/30 transition-all premium-border group">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold font-display">Presupuesto Consolidado</p>
            <h4 className="text-xl md:text-2xl font-black text-emerald-400 mt-1.5 font-mono tracking-tight">{fmtMoneda.format(calculations.totalProyecto)}</h4>
          </div>
          <div className="w-11 h-11 bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl flex items-center justify-center transition-colors group-hover:border-emerald-500/20">
            <DollarSign className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-xl p-4.5 flex items-center justify-between shadow-lg hover:border-rose-500/30 transition-all premium-border group">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold font-display">Inversión Materiales</p>
            <h4 className="text-lg md:text-xl font-black text-rose-400 mt-1.5 font-mono tracking-tight">{fmtMoneda.format(calculations.totalMateriales)}</h4>
          </div>
          <div className="w-11 h-11 bg-slate-950 text-rose-400 border border-slate-800 rounded-xl flex items-center justify-center transition-colors group-hover:border-rose-500/20">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-xl p-4.5 flex items-center justify-between shadow-lg hover:border-sky-500/30 transition-all premium-border group">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold font-display">Mano de Obra</p>
            <h4 className="text-lg md:text-xl font-black text-sky-400 mt-1.5 font-mono tracking-tight">{fmtMoneda.format(calculations.totalManoObra)}</h4>
          </div>
          <div className="w-11 h-11 bg-slate-950 text-sky-400 border border-slate-800 rounded-xl flex items-center justify-center transition-colors group-hover:border-sky-500/20">
            <Layers className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-xl p-4.5 flex items-center justify-between shadow-lg hover:border-amber-500/30 transition-all premium-border group">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold font-display">Duración Total Programada</p>
            <h4 className="text-lg md:text-xl font-black text-amber-400 mt-1.5 font-mono tracking-tight">{calculations.maxSemana} Semanas</h4>
          </div>
          <div className="w-11 h-11 bg-slate-950 text-amber-400 border border-slate-800 rounded-xl flex items-center justify-center transition-colors group-hover:border-amber-500/20">
            <CalendarDays className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* 4. Main Grid Section */}
      <main className="flex-1 px-4 py-6 md:px-8 max-w-[1800px] w-full mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: THE SPREADSHEET / TABLE */}
        <section id="section-presupuesto" className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-2xl space-y-4 premium-glow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 font-display text-white">
                <Layers className="w-5 h-5 text-emerald-400" />
                1. Matriz de Presupuesto Consolidado
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Control de costos y semanas de ejecución por ambientes y acabados</p>
            </div>
            
            <div className="flex flex-wrap gap-1.5" data-html2canvas-ignore="true">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Nueva Partida
              </button>

              <button
                onClick={exportPresupuestoPDF}
                disabled={exportingPDF !== null}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-bold border border-slate-800 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Exportar presupuesto a PDF"
              >
                {exportingPDF === 'presupuesto' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-rose-400" />
                    Exportar PDF
                  </>
                )}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-bold border border-slate-800 transition-all cursor-pointer"
                title="Importar presupuesto desde archivo CSV"
              >
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                Importar CSV
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportCSV} 
                accept=".csv" 
                className="hidden" 
              />

              <button
                onClick={handleResetToDefaults}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-bold border border-slate-800 hover:border-rose-900/30 transition-all cursor-pointer"
                title="Restablecer todos los valores al presupuesto inicial"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Search, Filter Specialty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-html2canvas-ignore="true">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, código o ambiente..."
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl py-2 px-3 pl-9 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/80 transition-all font-sans"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/80 transition-all cursor-pointer font-sans"
              >
                <option value="all">Todas las Especialidades</option>
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* BUDGET GRID / SPREADSHEET */}
          <div className="budget-table-container border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40 max-h-[750px] overflow-y-auto relative premium-border">
            <table className="w-full text-left border-collapse table-fixed min-w-[750px]">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800 sticky top-0 z-20 backdrop-blur-sm">
                  <th className="p-2.5 w-[10%] text-center">Código</th>
                  <th className="p-2.5 w-[32%]">Ambiente / Partida</th>
                  <th className="p-2.5 w-[10%] text-center">Inicio</th>
                  <th className="p-2.5 w-[10%] text-center">Duración</th>
                  <th className="p-2.5 w-[12%] text-right">Mat. (S/)</th>
                  <th className="p-2.5 w-[12%] text-right">M.O. (S/)</th>
                  <th className="p-2.5 w-[12%] text-right">Total (S/)</th>
                  <th className="p-2.5 w-[2%] text-center" data-html2canvas-ignore="true"></th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedPartidas).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-16 text-center text-slate-500 text-xs">
                      No se encontraron partidas para los criterios de búsqueda especificados.
                    </td>
                  </tr>
                ) : (
                  Object.entries(groupedPartidas).map(([espName, subGroups]) => {
                    const isEspCollapsed = collapsedGroups[espName];
                    const specTotals = groupTotals.specialtyTotals[espName] || { mat: 0, mo: 0, total: 0 };
                    return (
                      <React.Fragment key={espName}>
                        {/* Specialty Heading row */}
                        <tr className="bg-slate-900/95 border-t border-b border-slate-800 sticky top-[29px] z-10">
                          <td colSpan={8} className="px-3 py-1.5">
                            <button
                              type="button"
                              onClick={() => toggleGroupCollapse(espName)}
                              className="w-full text-left font-extrabold text-xs text-emerald-400 flex items-center justify-between hover:text-emerald-300 transition-colors py-1 cursor-pointer"
                            >
                              <span className="flex items-center gap-2 font-display">
                                {isEspCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                {espName}
                              </span>
                              
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">
                                  Suma: <span className="text-emerald-400">{fmtMoneda.format(specTotals.total)}</span>
                                </span>
                                <span className="text-[9px] text-slate-500 font-sans font-normal uppercase tracking-wider hidden sm:inline">
                                  ({isEspCollapsed ? 'expandir' : 'contraer'})
                                </span>
                              </div>
                            </button>
                          </td>
                        </tr>

                        {!isEspCollapsed && Object.entries(subGroups).map(([subEspName, items]) => {
                          const subGroupKey = `${espName}-${subEspName}`;
                          const isSubCollapsed = collapsedGroups[subGroupKey];
                          const subTotals = groupTotals.subSpecialtyTotals[subGroupKey] || { mat: 0, mo: 0, total: 0 };
                          return (
                            <React.Fragment key={subEspName}>
                              {/* Sub-specialty row */}
                              <tr className="bg-slate-950/60 border-b border-slate-800/60">
                                <td colSpan={8} className="px-5 py-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleGroupCollapse(subGroupKey)}
                                    className="w-full text-left font-bold text-[11px] text-sky-400 hover:text-sky-300 transition-colors flex items-center justify-between cursor-pointer"
                                  >
                                    <span className="flex items-center gap-1">
                                      {isSubCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      {subEspName}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 pr-4">
                                      Subtotal: <span className="text-sky-400 font-bold">{fmtMoneda.format(subTotals.total)}</span>
                                    </span>
                                  </button>
                                </td>
                              </tr>

                              {!isSubCollapsed && items.map((p) => {
                                const rowTotal = p.mat + p.mo;
                                return (
                                  <tr
                                    key={p.originalIndex}
                                    className="border-b border-slate-900/60 hover:bg-slate-800/30 text-xs transition-all duration-150 group"
                                  >
                                    {/* Code */}
                                    <td className="p-1">
                                      <input
                                        type="text"
                                        value={p.codigo}
                                        onChange={(e) => handleEditItem(p.originalIndex, 'codigo', e.target.value)}
                                        className="w-full bg-transparent border border-transparent hover:bg-slate-900/80 hover:border-slate-800 focus:bg-slate-950 focus:border-emerald-500 rounded px-1 py-1 text-center font-mono text-[11px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                                      />
                                    </td>
                                    {/* Name */}
                                    <td className="p-1">
                                      <input
                                        type="text"
                                        value={p.nombre}
                                        onChange={(e) => handleEditItem(p.originalIndex, 'nombre', e.target.value)}
                                        className="w-full bg-transparent border border-transparent hover:bg-slate-900/80 hover:border-slate-800 focus:bg-slate-950 focus:border-emerald-500 rounded px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans text-xs"
                                        title="Click para editar nombre"
                                      />
                                    </td>
                                    {/* Inicio */}
                                    <td className="p-1">
                                      <input
                                        type="number"
                                        min={1}
                                        value={p.inicio}
                                        onChange={(e) => handleEditItem(p.originalIndex, 'inicio', e.target.value)}
                                        className="w-full bg-transparent border border-transparent hover:bg-slate-900/80 hover:border-slate-800 focus:bg-slate-950 focus:border-emerald-500 rounded px-1 py-1 text-center font-mono text-[11px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                                      />
                                    </td>
                                    {/* Duración */}
                                    <td className="p-1">
                                      <input
                                        type="number"
                                        min={1}
                                        value={p.duracion}
                                        onChange={(e) => handleEditItem(p.originalIndex, 'duracion', e.target.value)}
                                        className="w-full bg-transparent border border-transparent hover:bg-slate-900/80 hover:border-slate-800 focus:bg-slate-950 focus:border-emerald-500 rounded px-1 py-1 text-center font-mono text-[11px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                                      />
                                    </td>
                                    {/* Mat. */}
                                    <td className="p-1">
                                      <input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={p.mat}
                                        onChange={(e) => handleEditItem(p.originalIndex, 'mat', e.target.value)}
                                        className="w-full bg-transparent border border-transparent hover:bg-slate-900/80 hover:border-slate-800 focus:bg-slate-950 focus:border-emerald-500 rounded px-2 py-1 text-right font-mono text-[11px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                                      />
                                    </td>
                                    {/* M.O. */}
                                    <td className="p-1">
                                      <input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={p.mo}
                                        onChange={(e) => handleEditItem(p.originalIndex, 'mo', e.target.value)}
                                        className="w-full bg-transparent border border-transparent hover:bg-slate-900/80 hover:border-slate-800 focus:bg-slate-950 focus:border-emerald-500 rounded px-2 py-1 text-right font-mono text-[11px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                                      />
                                    </td>
                                    {/* Total */}
                                    <td className="p-1 text-right font-bold font-mono text-[11px] text-emerald-400 pr-3 select-none">
                                      {fmtMoneda.format(rowTotal)}
                                    </td>
                                    {/* Actions */}
                                    <td className="p-1 text-center" data-html2canvas-ignore="true">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteItem(p.originalIndex)}
                                        className="p-1.5 bg-transparent hover:bg-rose-950/60 hover:text-rose-400 text-slate-600 rounded transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                                        title="Eliminar partida de obra"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
              <tfoot className="bg-slate-900 border-t-2 border-emerald-500/60 text-xs font-bold font-mono text-slate-100 sticky bottom-0 z-20 shadow-xl">
                <tr>
                  <td colSpan={4} className="p-2.5 text-right font-black uppercase tracking-wider text-emerald-400 font-display">
                    TOTAL PRESUPUESTO CONSOLIDADO:
                  </td>
                  <td className="p-2.5 text-right font-extrabold text-rose-400 font-mono">
                    {fmtMoneda.format(calculations.totalMateriales)}
                  </td>
                  <td className="p-2.5 text-right font-extrabold text-sky-400 font-mono">
                    {fmtMoneda.format(calculations.totalManoObra)}
                  </td>
                  <td className="p-2.5 text-right font-black text-emerald-400 font-mono text-xs pr-3">
                    {fmtMoneda.format(calculations.totalProyecto)}
                  </td>
                  <td data-html2canvas-ignore="true"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary totals footer block for Presupuesto section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-display">Total Materiales</span>
              <span className="text-sm md:text-base font-black text-rose-400 font-mono mt-0.5">{fmtMoneda.format(calculations.totalMateriales)}</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-display">Total Mano de Obra</span>
              <span className="text-sm md:text-base font-black text-sky-400 font-mono mt-0.5">{fmtMoneda.format(calculations.totalManoObra)}</span>
            </div>
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3 flex flex-col justify-center bg-emerald-500/5">
              <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold font-display">Presupuesto Consolidado</span>
              <span className="text-sm md:text-base font-black text-emerald-400 font-mono mt-0.5">{fmtMoneda.format(calculations.totalProyecto)}</span>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: INTERACTIVE VISUALIZATIONS */}
        <section className="space-y-6 sticky top-[80px]">
          
          {/* FLOW OF CASH WEEKLY CHART */}
          <div id="section-flujocaja" className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-2xl relative premium-glow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-md font-bold flex items-center gap-2 font-display text-white">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  2. Flujo de Caja Semanal
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Distribución monetaria planificada semana a semana</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportFlujoPDF}
                  disabled={exportingPDF !== null}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold border border-slate-800 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Exportar gráfico de flujo de caja a PDF"
                  data-html2canvas-ignore="true"
                >
                  {exportingPDF === 'flujo' ? (
                    <>
                      <RefreshCw className="w-3 h-3 text-rose-400 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 text-rose-400" />
                      PDF
                    </>
                  )}
                </button>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-1.5 rounded font-bold uppercase tracking-wider border border-emerald-500/20" data-html2canvas-ignore="true">
                  INTERACTIVO
                </span>
              </div>
            </div>

            {/* Pure SVG React Interactive Stacked Bar Chart */}
            <div className="relative pt-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {(() => {
                const colWidth = 65;
                const leftPadding = 80;
                const totalColWidth = 90;
                const rightPadding = 35;
                const chartWidth = leftPadding + flujoSemanas.length * colWidth + totalColWidth + rightPadding;
                const barWidth = 34;

                return (
                  <div className="cashflow-container overflow-x-auto custom-scrollbar pb-2 relative">
                    {/* Sticky Y-Axis Column (Fixed/Frozen) */}
                    <div className="sticky left-0 z-20 float-left h-0 pointer-events-none">
                      <div className="absolute left-0 top-0 w-[80px] h-[350px] bg-slate-950 border-r border-slate-800 flex flex-col justify-between pr-3 select-none">
                        <svg viewBox="0 0 80 350" className="w-[80px] h-[350px] block">
                          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                            const y = 30 + (1 - ratio) * 260;
                            const labelVal = maxWeeklyCashFlow * ratio;
                            return (
                              <text
                                key={idx}
                                x="68"
                                y={y + 4}
                                textAnchor="end"
                                className="text-[9.5px] fill-slate-400 font-mono font-extrabold"
                              >
                                {labelVal >= 1000 ? `${(labelVal / 1000).toFixed(0)}k` : labelVal.toFixed(0)}
                              </text>
                            );
                          })}
                        </svg>
                      </div>
                    </div>

                    {/* SVG Chart */}
                    <svg
                      viewBox={`0 0 ${chartWidth} 350`}
                      className="h-auto select-none block"
                      style={{ width: `${chartWidth}px`, minWidth: `${chartWidth}px` }}
                    >
                      <defs>
                        <linearGradient id="matGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="100%" stopColor="#be123c" />
                        </linearGradient>
                        <linearGradient id="moGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal guide lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                        const y = 30 + (1 - ratio) * 260;
                        return (
                          <g key={idx}>
                            <line
                              x1="80"
                              y1={y}
                              x2={chartWidth - 25}
                              y2={y}
                              stroke="#1e293b"
                              strokeDasharray="4 4"
                            />
                          </g>
                        );
                      })}

                      {/* Drawn Stacked Bars */}
                      {flujoSemanas.map((s, idx) => {
                        const x = leftPadding + idx * colWidth + (colWidth - barWidth) / 2;
                        const xText = leftPadding + idx * colWidth + colWidth / 2;
                        
                        // Heights based on maximum value
                        const matH = (s.mat / maxWeeklyCashFlow) * 260;
                        const moH = (s.mo / maxWeeklyCashFlow) * 260;

                        // Bar placement coordinates
                        const yMo = 290 - moH;
                        const yMat = yMo - matH;

                        return (
                          <g
                            key={s.sem}
                            className="cursor-pointer group"
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const svgRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                              if (rect && svgRect) {
                                setActiveTooltip({
                                  week: s.sem,
                                  mat: s.mat,
                                  mo: s.mo,
                                  total: s.total,
                                  x: rect.left - svgRect.left + rect.width / 2,
                                  y: rect.top - svgRect.top - 85
                                });
                              }
                            }}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            {/* Labor cost segment (green) */}
                            {s.mo > 0 && (
                              <rect
                                x={x}
                                y={yMo}
                                width={barWidth}
                                height={moH}
                                fill="url(#moGrad)"
                                rx="2"
                                className="transition-all duration-300 hover:brightness-125"
                              />
                            )}
                            
                            {/* Materials cost segment (red) */}
                            {s.mat > 0 && (
                              <rect
                                x={x}
                                y={yMat}
                                width={barWidth}
                                height={matH}
                                fill="url(#matGrad)"
                                rx="2"
                                className="transition-all duration-300 hover:brightness-125"
                              />
                            )}

                            {/* Hover highlight overlay */}
                            <rect
                              x={x - 4}
                              y="20"
                              width={barWidth + 8}
                              height="275"
                              fill="white"
                              fillOpacity="0"
                              className="group-hover:fill-opacity-5 transition-all"
                            />

                            {/* Weekly label */}
                            {flujoSemanas.length <= 30 || s.sem % 2 === 1 ? (
                              <text
                                x={xText}
                                y="312"
                                textAnchor="middle"
                                className="text-[9px] fill-slate-400 font-mono font-black"
                              >
                                S{s.sem}
                              </text>
                            ) : null}
                          </g>
                        );
                      })}

                      {/* Month labels and brackets under the week labels */}
                      {Array.from({ length: Math.ceil(flujoSemanas.length / 4) }).map((_, mesIdx) => {
                        const firstWeekIdx = mesIdx * 4;
                        const lastWeekIdx = Math.min((mesIdx + 1) * 4 - 1, flujoSemanas.length - 1);
                        
                        const xFirst = leftPadding + firstWeekIdx * colWidth;
                        const xLast = leftPadding + lastWeekIdx * colWidth;
                        
                        const xCenter = (xFirst + xLast + colWidth) / 2;

                        return (
                          <g key={mesIdx}>
                            {/* Subtle line bracket for Month */}
                            {xLast > xFirst && (
                              <path
                                d={`M ${xFirst + 6} 321 L ${xFirst + 6} 325 L ${xLast + colWidth - 6} 325 L ${xLast + colWidth - 6} 321`}
                                fill="none"
                                stroke="#334155"
                                strokeWidth="1"
                              />
                            )}
                            <text
                              x={xCenter}
                              y="337"
                              textAnchor="middle"
                              className="text-[9px] fill-emerald-400 font-sans font-extrabold tracking-wider"
                            >
                              Mes {mesIdx + 1}
                            </text>
                          </g>
                        );
                      })}

                      {/* Base Axis line */}
                      <line x1="80" y1="290" x2={chartWidth - 25} y2="290" stroke="#334155" strokeWidth="2" />
                    </svg>

                    {/* 3 Detail Rows Table Underneath */}
                    <div
                      className="mt-4 border border-slate-800/80 rounded-xl bg-slate-950/60 text-[9.5px] font-mono shadow-lg"
                      style={{ width: `${chartWidth}px`, minWidth: `${chartWidth}px` }}
                    >
                      <table className="w-full border-separate border-spacing-0">
                        <thead>
                          <tr className="bg-slate-900 text-slate-300 uppercase tracking-wider text-[9px]">
                            <th className="sticky left-0 bg-slate-900 z-20 p-2 text-left w-[80px] min-w-[80px] max-w-[80px] border-r border-b border-slate-800 font-extrabold select-none rounded-tl-xl text-slate-300">
                              Concepto
                            </th>
                            {flujoSemanas.map((s) => (
                              <th
                                key={s.sem}
                                className="p-2 text-center border-b border-r border-slate-800 font-black text-slate-300"
                                style={{ width: `${colWidth}px`, minWidth: `${colWidth}px` }}
                              >
                                S{s.sem}
                              </th>
                            ))}
                            <th
                              className="p-2 text-center border-b border-slate-800 font-black text-emerald-400 bg-slate-900/90 rounded-tr-xl"
                              style={{ width: `${totalColWidth}px`, minWidth: `${totalColWidth}px` }}
                            >
                              TOTAL
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-slate-900/30">
                            <td className="sticky left-0 bg-slate-950 z-20 p-2 text-left w-[80px] min-w-[80px] max-w-[80px] border-r border-b border-slate-800/60 font-extrabold text-sky-400">
                              M. Obra
                            </td>
                            {flujoSemanas.map((s, idx) => (
                              <td key={idx} className="p-1.5 text-center border-r border-b border-slate-800/40 text-sky-300 whitespace-nowrap font-medium">
                                {s.mo > 0 ? `S/${Math.round(s.mo).toLocaleString()}` : '—'}
                              </td>
                            ))}
                            <td className="p-1.5 text-center border-b border-slate-800/60 text-sky-400 font-black bg-slate-950/80 whitespace-nowrap">
                              {fmtMoneda.format(calculations.totalManoObra)}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-900/30">
                            <td className="sticky left-0 bg-slate-950 z-20 p-2 text-left w-[80px] min-w-[80px] max-w-[80px] border-r border-b border-slate-800/60 font-extrabold text-rose-400">
                              Materiales
                            </td>
                            {flujoSemanas.map((s, idx) => (
                              <td key={idx} className="p-1.5 text-center border-r border-b border-slate-800/40 text-rose-300 whitespace-nowrap font-medium">
                                {s.mat > 0 ? `S/${Math.round(s.mat).toLocaleString()}` : '—'}
                              </td>
                            ))}
                            <td className="p-1.5 text-center border-b border-slate-800/60 text-rose-400 font-black bg-slate-950/80 whitespace-nowrap">
                              {fmtMoneda.format(calculations.totalMateriales)}
                            </td>
                          </tr>
                          <tr className="bg-slate-900/50 font-bold hover:bg-slate-900/70">
                            <td className="sticky left-0 bg-slate-900 z-20 p-2 text-left w-[80px] min-w-[80px] max-w-[80px] border-r border-slate-800 text-amber-400 font-black rounded-bl-xl">
                              Total Sem.
                            </td>
                            {flujoSemanas.map((s, idx) => (
                              <td
                                key={idx}
                                className="p-1.5 text-center border-r border-slate-800 text-amber-300 font-extrabold whitespace-nowrap"
                              >
                                {s.total > 0 ? `S/${Math.round(s.total).toLocaleString()}` : '—'}
                              </td>
                            ))}
                            <td className="p-1.5 text-center text-emerald-400 font-black bg-slate-900 text-xs rounded-br-xl whitespace-nowrap">
                              {fmtMoneda.format(calculations.totalProyecto)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Float Interactive Tooltip Box - Follows hovered bar dynamically, stays within bounds */}
                    {activeTooltip && (
                      <div 
                        className="absolute bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl text-[11px] space-y-1 z-30 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
                        style={{
                          left: `${activeTooltip.x}px`,
                          top: `${Math.max(8, activeTooltip.y)}px`,
                          transform: 'translateX(-50%)',
                          minWidth: '160px'
                        }}
                      >
                        <p className="font-extrabold text-slate-100 border-b border-slate-800 pb-1 mb-1 text-center uppercase tracking-widest text-[10px] font-display">
                          Semana {activeTooltip.week}
                        </p>
                        <div className="flex justify-between gap-4 font-mono">
                          <span className="text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Materiales:
                          </span>
                          <span className="font-bold text-rose-400">{fmtMoneda.format(activeTooltip.mat)}</span>
                        </div>
                        <div className="flex justify-between gap-4 font-mono">
                          <span className="text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Mano Obra:
                          </span>
                          <span className="font-bold text-emerald-400">{fmtMoneda.format(activeTooltip.mo)}</span>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-slate-800 pt-1 mt-1 font-bold font-mono">
                          <span className="text-slate-200">Total:</span>
                          <span className="text-yellow-400">{fmtMoneda.format(activeTooltip.total)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Legends */}
            <div className="flex justify-center gap-6 mt-4 text-xs font-semibold text-slate-400 font-display">
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-rose-500 rounded"></span>
                Materiales
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-emerald-500 rounded"></span>
                Mano de Obra
              </span>
            </div>
          </div>

          {/* GANTT & CRITICAL PATH CHART */}
          <div id="section-cronograma" className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-2xl space-y-4 premium-glow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-bold flex items-center gap-2 font-display text-white">
                  <CalendarDays className="w-5 h-5 text-emerald-400" />
                  3. Cronograma de Gantt de Avance
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Avance y programación temporal de cada partida de obra</p>
              </div>
              <button
                onClick={exportGanttPDF}
                disabled={exportingPDF !== null}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-bold border border-slate-800 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Exportar cronograma de Gantt a PDF"
                data-html2canvas-ignore="true"
              >
                {exportingPDF === 'cronograma' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-rose-400" />
                    Exportar PDF
                  </>
                )}
              </button>
            </div>

            {/* SCROLLABLE GRID CONTAINER */}
            <div className="gantt-container border border-slate-800/80 rounded-xl overflow-x-auto overflow-y-auto max-h-[500px] bg-slate-950/40 premium-border">
              <div 
                className="gantt-grid min-w-[1200px]"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `60px 240px repeat(${calculations.maxSemana}, 45px)`
                }}
              >
                
                {/* HEADERS */}
                <div 
                  className="g-head g-head-corner sticky left-0 top-0 z-40 text-[10px] uppercase flex items-center justify-center bg-slate-800 text-slate-200 border-r border-b border-slate-950 font-black h-[50px] w-[60px]"
                  style={{ gridRow: '1 / 3', gridColumn: '1' }}
                >
                  Cód
                </div>

                <div 
                  className="g-head g-head-corner sticky left-[60px] top-0 z-40 text-[10px] uppercase flex items-center justify-start px-3.5 bg-slate-800 text-slate-200 border-r border-b border-slate-950 font-black h-[50px] w-[240px]"
                  style={{ gridRow: '1 / 3', gridColumn: '2' }}
                >
                  Partida
                </div>

                {/* Meses & Semanas Headers */}
                {Array.from({ length: Math.ceil(calculations.maxSemana / 4) }).map((_, mesIdx) => {
                  const semanasEnMes = Math.min(4, calculations.maxSemana - mesIdx * 4);
                  const colStart = 3 + mesIdx * 4;
                  const colEnd = colStart + semanasEnMes;

                  return (
                    <div
                      key={mesIdx}
                      className="g-head text-center text-[10px] uppercase font-black bg-emerald-950 border-b border-r border-slate-950 text-emerald-300 flex items-center justify-center py-1 sticky top-0 z-30"
                      style={{
                        gridColumn: `${colStart} / ${colEnd}`,
                        gridRow: '1',
                        height: '24px'
                      }}
                    >
                      Mes {mesIdx + 1}
                    </div>
                  );
                })}

                {/* Weeks row headers */}
                {Array.from({ length: calculations.maxSemana }).map((_, semIdx) => {
                  return (
                    <div
                      key={semIdx}
                      className="g-head text-center text-[9px] font-bold bg-slate-900 text-slate-400 border-b border-r border-slate-950 flex items-center justify-center py-1 sticky top-[24px] z-30"
                      style={{
                        gridColumn: `${3 + semIdx}`,
                        gridRow: '2',
                        height: '26px'
                      }}
                    >
                      Sem {semIdx + 1}
                    </div>
                  );
                })}

                {/* TASK ITEMS ROWS */}
                {partidas.map((p, pIdx) => {
                  const total = p.mat + p.mo;
                  if (total <= 0) return null;

                  const r = 3 + pIdx;
                  const inicioPartida = p.inicio;
                  const finPartida = p.inicio + p.duracion - 1;

                  return (
                    <React.Fragment key={pIdx}>
                      {/* Code column */}
                      <div
                        className="g-cell g-code sticky left-0 z-20 text-[10px] font-mono font-bold text-slate-400 bg-slate-900 border-b border-r border-slate-950 text-center flex items-center justify-center h-8"
                        style={{ gridRow: String(r), gridColumn: '1' }}
                      >
                        {p.codigo}
                      </div>

                      {/* Name column */}
                      <div
                        className="g-cell g-name sticky left-[60px] z-20 text-[10px] font-semibold text-slate-300 bg-slate-900 border-b border-r border-slate-950 truncate px-3 flex items-center justify-start h-8 hover:text-slate-100 transition-colors"
                        style={{ gridRow: String(r), gridColumn: '2' }}
                        title={p.nombre}
                      >
                        {p.nombre}
                      </div>

                      {/* Background lines for each week column */}
                      {Array.from({ length: calculations.maxSemana }).map((_, semIdx) => {
                        const semNum = semIdx + 1;
                        const isSelectedWeek = semNum >= inicioPartida && semNum <= finPartida;
                        return (
                          <div
                            key={semIdx}
                            className={`g-cell border-b border-r border-slate-950/40 h-8 ${isSelectedWeek ? 'bg-slate-800/10' : 'bg-slate-950/5'}`}
                            style={{
                              gridColumn: `${3 + semIdx}`,
                              gridRow: String(r)
                            }}
                          />
                        );
                      })}

                      {/* Continuous progress band representation */}
                      {p.duracion > 0 && (
                        <div
                          className="g-band h-6 my-1 self-center rounded-md overflow-hidden flex items-center border border-slate-950/20"
                          style={{
                            gridColumn: `${3 + inicioPartida - 1} / ${3 + finPartida}`,
                            gridRow: String(r),
                            zIndex: 10
                          }}
                        >
                          {Array.from({ length: p.duracion }).map((_, stepIdx) => {
                            const semActual = inicioPartida + stepIdx;
                            const semanasTranscurridas = stepIdx + 1;
                            const porcentaje = Math.round((semanasTranscurridas / p.duracion) * 100);

                            let bgClass = 'bg-emerald-600 hover:bg-emerald-500';
                            if (porcentaje >= 75) {
                              bgClass = 'bg-rose-600 hover:bg-rose-500';
                            } else if (porcentaje >= 50) {
                              bgClass = 'bg-amber-600 hover:bg-amber-500';
                            }

                            return (
                              <div
                                key={stepIdx}
                                className={`flex-1 h-full flex items-center justify-center text-[8px] font-mono font-bold text-white transition-all duration-150 cursor-pointer ${bgClass}`}
                                title={`Semana ${semActual}. Avance: ${porcentaje}%`}
                              >
                                {porcentaje}%
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

              </div>
            </div>

            {/* Gantt Legend */}
            <div className="flex flex-wrap gap-4 justify-center text-[10px] text-slate-400 pt-2 font-display">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-sm"></span>
                Etapa Inicial (&lt; 50% de la duración)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-600 rounded-sm"></span>
                Etapa Intermedia (50% a 74% de la duración)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-rose-600 rounded-sm"></span>
                Etapa Crítica / Final (75% a 100% de la duración)
              </span>
            </div>
          </div>
        </section>

      </main>

      {/* 5. ADD MANUAL PARTIDA MODAL OVERLAY */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4 animate-in zoom-in duration-150">
            <div>
              <h3 className="text-md font-extrabold text-slate-100 flex items-center gap-2 font-display">
                <Plus className="w-5 h-5 text-emerald-400" />
                Agregar Partida Manual
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-sans">Defina los detalles de la nueva partida de obra para insertarla en el presupuesto.</p>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Especialidad / Nivel
                </label>
                <select
                  value={newPartida.esp}
                  onChange={(e) => setNewPartida({ ...newPartida, esp: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  <option value="PRIMER NIVEL">PRIMER NIVEL</option>
                  <option value="SEGUNDO NIVEL">SEGUNDO NIVEL</option>
                  <option value="TERCER NIVEL">TERCER NIVEL</option>
                  <option value="PARTIDAS GENERALES">PARTIDAS GENERALES</option>
                  <option value="REFACCIÓN TECHOS">REFACCIÓN TECHOS</option>
                  <option value="REFUERZO METÁLICO">REFUERZO METÁLICO</option>
                  <option value="REFACCIÓN PISOS">REFACCIÓN PISOS</option>
                  <option value="CARPINTERÍA METAL">CARPINTERÍA METAL</option>
                  <option value="CARPINTERÍA MADERA">CARPINTERÍA MADERA</option>
                  <option value="PINTURA">PINTURA</option>
                  <option value="VIDRIOS / MANTTO">VIDRIOS / MANTTO</option>
                  <option value="JARDINERÍA">JARDINERÍA</option>
                  <option value="SC INSTALACIONES SANITARIAS">SC INSTALACIONES SANITARIAS</option>
                  <option value="SC INSTALACIONES ELECTRICAS">SC INSTALACIONES ELECTRICAS</option>
                  <option value="PARTIDAS ESPECIALES - AIRE ACONDICIONADO">PARTIDAS ESPECIALES - AIRE ACONDICIONADO</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Ambiente / Subgrupo
                </label>
                <input
                  type="text"
                  value={newPartida.subesp}
                  onChange={(e) => setNewPartida({ ...newPartida, subesp: e.target.value.toUpperCase() })}
                  placeholder="E.g., FACHADA, BAÑO, etc."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Código
                  </label>
                  <input
                    type="text"
                    value={newPartida.codigo}
                    onChange={(e) => setNewPartida({ ...newPartida, codigo: e.target.value })}
                    placeholder="E.g., 1.99"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 text-center font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Semana Inicio
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newPartida.inicio}
                    onChange={(e) => setNewPartida({ ...newPartida, inicio: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 text-center font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Duración (Sems)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newPartida.duracion}
                    onChange={(e) => setNewPartida({ ...newPartida, duracion: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 text-center font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Nombre de la Partida
                </label>
                <input
                  type="text"
                  value={newPartida.nombre}
                  onChange={(e) => setNewPartida({ ...newPartida, nombre: e.target.value })}
                  placeholder="E.g., Colocación de porcelanato"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Materiales (S/)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={newPartida.mat}
                    onChange={(e) => setNewPartida({ ...newPartida, mat: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Mano de Obra (S/)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={newPartida.mo}
                    onChange={(e) => setNewPartida({ ...newPartida, mo: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-emerald-950 cursor-pointer"
                >
                  Agregar Partida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Footer bar */}
      <footer className="bg-slate-900 border-t border-slate-800/80 text-[10px] text-slate-500 py-4 px-6 md:px-8 text-center mt-12 font-mono">
        <p>© 2026 Presupuesto Remodelación Nogales - Todos los derechos reservados. Sincronización determinista con Supabase.</p>
      </footer>
    </div>
  );
}
