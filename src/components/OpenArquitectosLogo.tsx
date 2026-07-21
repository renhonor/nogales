import React from 'react';

interface LogoProps {
  className?: string;
  size?: number; // Target height in pixels
}

export const OpenArquitectosLogo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  // Calculated viewBox is 340 x 90 for high-fidelity rendering
  // The logo has a yellow architectural 'O' on the left, 'PEN' in yellow next to it,
  // and the wide 'ARQUITECTOS' in white below.
  return (
    <svg
      viewBox="0 0 340 90"
      className={className}
      style={{ height: `${size}px`, width: 'auto' }}
      aria-label="Open Arquitectos Logo"
    >
      <g transform="translate(5, 5)">
        {/* 1. ARCHITECTURAL DRAFTING SQUARE 'O' */}
        <g stroke="#F7C600" strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter">
          {/* Top Horizontal Line (extends left & right) */}
          <line x1="8" y1="18" x2="66" y2="18" />
          {/* Bottom Horizontal Line (extends left & right) */}
          <line x1="8" y1="52" x2="66" y2="52" />
          {/* Left Vertical Line (extends up & down) */}
          <line x1="16" y1="10" x2="16" y2="60" />
          {/* Right Vertical Line (extends up & down) */}
          <line x1="52" y1="10" x2="52" y2="60" />
        </g>

        {/* Small architectural inner details to resemble the structural layout lines */}
        <rect x="22" y="24" width="24" height="22" fill="none" stroke="#F7C600" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />

        {/* 2. THE LETTERS 'PEN' IN YELLOW */}
        {/* Customized paths for "P", "E", "N" to perfectly capture the technical drafting typography */}
        <g fill="#F7C600">
          {/* Letter 'P' */}
          <path d="M 76,18 H 96 C 101,18 105,21 105,26 C 105,31 101,34 96,34 H 83 V 52 H 76 Z M 83,28 H 95 C 96.5,28 98,27.5 98,26 C 98,24.5 96.5,24 95,24 H 83 Z" />
          
          {/* Letter 'E' with architectural serif extensions */}
          <path d="M 112,18 H 138 V 24 H 119 V 31 H 135 V 37 H 119 V 46 H 138 V 52 H 112 Z" />
          
          {/* Letter 'N' */}
          <path d="M 145,18 H 152 L 168,43 V 18 H 175 V 52 H 168 L 152,27 V 52 H 145 Z" />
        </g>

        {/* 3. 'ARQUITECTOS' IN GEOMETRIC WIDE WHITE LETTERS */}
        {/* Styled using a wide, clean, modern monospace-sans font that resembles architectural drawings */}
        <text
          x="3"
          y="80"
          fill="#FFFFFF"
          fontSize="22"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          letterSpacing="4"
          className="tracking-[0.16em] uppercase"
        >
          ARQUITECTOS
        </text>
      </g>
    </svg>
  );
};
