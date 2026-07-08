import React from "react";

/* Each course gets a distinctive gold/black illustrated badge instead of a
   generic stock photo — keeps the brand consistent and avoids using
   real people's photos without rights. */

const wrap = (children, gradientId, from, to) => (
  <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
      <pattern id={`grid-${gradientId}`} width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M24 0H0V24" fill="none" stroke="rgba(217,166,46,0.12)" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="400" height="240" fill={`url(#${gradientId})`} />
    <rect width="400" height="240" fill={`url(#grid-${gradientId})`} />
    <rect x="0" y="0" width="14" height="240" fill="#D9A62E" opacity="0.9" />
    {children}
  </svg>
);

export function NeboshArt() {
  return wrap(
    <g transform="translate(150,40)">
      <circle cx="50" cy="90" r="72" fill="none" stroke="#D9A62E" strokeWidth="3" opacity="0.5" />
      <path d="M10 55 a40 40 0 0 1 80 0 v14 h-80z" fill="#F2C94C" />
      <rect x="0" y="69" width="100" height="10" rx="5" fill="#D9A62E" />
      <path d="M20 130 h60 l14 46 h-88z" fill="#C9D2DC" />
      <path d="M20 130 h30 v46 h-44z" fill="#8B94A3" />
      <path d="M30 150 l14 14 28 -32" fill="none" stroke="#050608" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </g>,
    "g1",
    "#171A20",
    "#0B0D10"
  );
}

export function IoshArt() {
  return wrap(
    <g transform="translate(140,30)">
      <rect x="10" y="18" width="100" height="150" rx="14" fill="#171A20" stroke="#D9A62E" strokeWidth="3" />
      <rect x="34" y="4" width="52" height="26" rx="8" fill="#D9A62E" />
      <line x1="28" y1="60" x2="92" y2="60" stroke="#C9D2DC" strokeWidth="5" strokeLinecap="round" />
      <line x1="28" y1="82" x2="92" y2="82" stroke="#C9D2DC" strokeWidth="5" strokeLinecap="round" />
      <line x1="28" y1="104" x2="70" y2="104" stroke="#C9D2DC" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="140" r="26" fill="#F2C94C" />
      <path d="M48 140 l9 9 18 -20" fill="none" stroke="#0B0D10" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </g>,
    "g2",
    "#14171C",
    "#0A0B0E"
  );
}

export function OshaArt() {
  return wrap(
    <g transform="translate(130,30)">
      <path d="M60 0 L120 24 V90 C120 140 90 168 60 180 C30 168 0 140 0 90 V24 Z" fill="#171A20" stroke="#D9A62E" strokeWidth="3" />
      <path d="M60 16 L104 34 V90 C104 128 82 150 60 160 C38 150 16 128 16 90 V34 Z" fill="#0B0D10" />
      <path d="M40 92 l16 18 34 -40" fill="none" stroke="#F2C94C" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </g>,
    "g3",
    "#171A20",
    "#0D0F13"
  );
}

export function IsoArt() {
  return wrap(
    <g transform="translate(120,30)">
      <circle cx="70" cy="90" r="82" fill="none" stroke="#D9A62E" strokeWidth="3" opacity="0.6" />
      <circle cx="70" cy="90" r="58" fill="#171A20" stroke="#F2C94C" strokeWidth="3" />
      <g stroke="#D9A62E" strokeWidth="4" strokeLinecap="round">
        <line x1="70" y1="28" x2="70" y2="16" />
        <line x1="70" y1="152" x2="70" y2="164" />
        <line x1="8" y1="90" x2="20" y2="90" />
        <line x1="120" y1="90" x2="132" y2="90" />
        <line x1="28" y1="48" x2="20" y2="40" />
        <line x1="112" y1="132" x2="120" y2="140" />
        <line x1="28" y1="132" x2="20" y2="140" />
        <line x1="112" y1="48" x2="120" y2="40" />
      </g>
      <circle cx="70" cy="90" r="24" fill="#F2C94C" />
      <circle cx="70" cy="90" r="24" fill="none" stroke="#0B0D10" strokeWidth="3" />
    </g>,
    "g4",
    "#14171C",
    "#0A0B0E"
  );
}

export function OtherCertArt() {
  return wrap(
    <g transform="translate(150,45)">
      <rect x="6" y="6" width="88" height="112" rx="10" fill="#171A20" stroke="#D9A62E" strokeWidth="3" strokeDasharray="6 5" />
      <line x1="24" y1="34" x2="76" y2="34" stroke="#C9D2DC" strokeWidth="5" strokeLinecap="round" />
      <line x1="24" y1="54" x2="76" y2="54" stroke="#C9D2DC" strokeWidth="5" strokeLinecap="round" />
      <line x1="24" y1="74" x2="58" y2="74" stroke="#C9D2DC" strokeWidth="5" strokeLinecap="round" />
      <circle cx="50" cy="100" r="4" fill="#F2C94C" />
      <text x="50" y="106" textAnchor="middle" fontSize="26" fontWeight="900" fill="#F2C94C">
        ؟
      </text>
    </g>,
    "g5",
    "#171A20",
    "#0B0D10"
  );
}

export const ART_BY_CODE = {
  NEBOSH: NeboshArt,
  IOSH: IoshArt,
  OSHA: OshaArt,
  ISO45001: IsoArt,
  OTHER: OtherCertArt,
};

export function CourseArt({ code, className = "" }) {
  const Cmp = ART_BY_CODE[code] || OtherCertArt;
  return (
    <div className={className}>
      <Cmp />
    </div>
  );
}

/* large hero illustration for the landing page */
export function HeroArt() {
  return (
    <svg viewBox="0 0 600 500" className="h-full w-full">
      <defs>
        <linearGradient id="hero-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#171A20" />
          <stop offset="100%" stopColor="#050608" />
        </linearGradient>
        <radialGradient id="hero-glow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(217,166,46,0.35)" />
          <stop offset="100%" stopColor="rgba(217,166,46,0)" />
        </radialGradient>
      </defs>
      <rect width="600" height="500" fill="url(#hero-g)" rx="28" />
      <rect width="600" height="500" fill="url(#hero-glow)" rx="28" />
      {/* shield */}
      <g transform="translate(175,70)">
        <path
          d="M125 0 L250 45 V180 C250 300 180 360 125 390 C70 360 0 300 0 180 V45 Z"
          fill="#0B0D10"
          stroke="#D9A62E"
          strokeWidth="4"
        />
        <path
          d="M125 30 L220 62 V180 C220 270 170 320 125 345 C80 320 30 270 30 180 V62 Z"
          fill="none"
          stroke="#F2C94C"
          strokeWidth="2.5"
          opacity="0.6"
        />
        {/* hard hat */}
        <g transform="translate(50,60)">
          <path d="M10 60 a40 40 0 0 1 80 0 v14 h-80z" fill="#F2C94C" />
          <rect x="0" y="72" width="100" height="10" rx="5" fill="#D9A62E" />
        </g>
        {/* check */}
        <path d="M65 230 l35 38 68 -80" fill="none" stroke="#D9A62E" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* hazard corner */}
      <g opacity="0.5">
        <rect x="0" y="460" width="600" height="40" className="hazard-stripe" />
      </g>
    </svg>
  );
}
