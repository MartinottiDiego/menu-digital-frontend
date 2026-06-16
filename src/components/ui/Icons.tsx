/* MIINUTA. CARNES — set de iconos (SVG inline, currentColor).
   Portado 1:1 del diseño de Claude Design. */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

export const Icon = {
  // ---- brand / category line icons ----
  steak: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 9.5C5 6.4 8 4 12 4c4.6 0 8 3.1 8 7 0 4.1-3.7 6.7-8.4 5.9C7.8 16.2 5 13.2 5 9.5Z" />
      <circle cx="10" cy="10.2" r="2.3" />
    </svg>
  ),
  mila: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <ellipse cx="12" cy="12" rx="9" ry="6.2" />
      <path d="M7 9.6l1.2 1.2M10 8.8l1.2 1.2M13 8.8l1.2 1.2M16 9.6l1.2 1.2M8 13l1.2 1.2M11 13.6l1.2 1.2M14.4 13.4l1.2 1.2" />
    </svg>
  ),
  snow: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
      <path d="M12 5.4l-2 2M12 5.4l2 2M12 18.6l-2-2M12 18.6l2-2M5.4 12l2-2M5.4 12l2 2M18.6 12l-2-2M18.6 12l-2 2" />
    </svg>
  ),
  truck: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 6.5h10.5v9.5H2zM12.5 9.5H17l3.5 3v3.5h-8z" />
      <circle cx="6.5" cy="18" r="1.9" />
      <circle cx="16.5" cy="18" r="1.9" />
    </svg>
  ),
  cleaver: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 4h10.5a2 2 0 012 2v6.5H6a2 2 0 01-2-2V4z" />
      <path d="M16.5 9.5H20a1 1 0 011 1v.5a1 1 0 01-1 1h-3.5M9 16v4M13 16v4" />
    </svg>
  ),
  // ---- UI icons ----
  cart: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2.5 3h2l2.2 11.5a1.5 1.5 0 001.5 1.2h8.4a1.5 1.5 0 001.5-1.2L20 7H6" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </svg>
  ),
  user: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20a7.2 7.2 0 0114.4 0" />
    </svg>
  ),
  search: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  ),
  sliders: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="9" cy="6" r="2" fill="#1c130b" />
      <circle cx="15" cy="12" r="2" fill="#1c130b" />
      <circle cx="8" cy="18" r="2" fill="#1c130b" />
    </svg>
  ),
  menu: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  ),
  chevLeft: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  ),
  arrowRight: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  plus: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  minus: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14" />
    </svg>
  ),
  trash: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13M10 11v6M14 11v6" />
    </svg>
  ),
  whatsapp: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...p}>
      <path d="M12 2a9.9 9.9 0 00-8.5 15l-1.3 4.8 4.9-1.3A9.9 9.9 0 1012 2zm0 1.8a8.1 8.1 0 016.9 12.4l-.2.3.8 2.9-3-.8-.3.2A8.1 8.1 0 1112 3.8zm-3 4c-.2 0-.5 0-.7.4-.3.3-1 1-1 2.4s1 2.8 1.2 3 2 3.1 4.9 4.3c2.4 1 2.9.8 3.4.8.5-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.2-1.3l-.7-.4c-.4-.2-2-1-2.3-1.1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1a6.6 6.6 0 01-2-1.2 7.4 7.4 0 01-1.3-1.7c-.2-.4 0-.5.1-.7l.5-.6.4-.6c.1-.2 0-.4 0-.6L10 8.2c-.2-.4-.4-.4-.6-.4z" />
    </svg>
  ),
  bag: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </svg>
  ),
  mapPin: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...p}>
      <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5z" />
    </svg>
  ),
  home: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3.5 11L12 4l8.5 7M5.5 9.5V20h13V9.5" />
    </svg>
  ),
  grid: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 10h16M10 10v10" />
    </svg>
  ),
  check: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 12l5 5 11-11" />
    </svg>
  ),
  phone: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 3h3l1.5 5-2 1.5a12 12 0 005 5l1.5-2 5 1.5v3a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" />
    </svg>
  ),
  mail: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  ),
  clock: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  instagram: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  star: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...p}>
      <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5-5.9-3.3-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" />
    </svg>
  ),
  flame: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3c1.5 3-1.5 4.5-1.5 7a3 3 0 003 3c2 0 3.2-1.6 3-3.8 1.8 1.5 2.5 3.6 2.5 5.3A7 7 0 015 14.5C5 10 9 8 12 3z" />
    </svg>
  ),
  dollar: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v18M16 7c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" />
    </svg>
  ),
  clipboard: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3.2A1.2 1.2 0 0110.2 2h3.6A1.2 1.2 0 0115 3.2V4M8.5 10h7M8.5 14h7M8.5 18h4" />
    </svg>
  ),
  trending: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 16l5-5 4 4 8-9" />
      <path d="M16 6h4v4" />
    </svg>
  ),
  box: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
    </svg>
  ),
  bell: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6zM9.5 19a2.5 2.5 0 005 0" />
    </svg>
  ),
  settings: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a7.8 7.8 0 000-3l1.6-1.3-1.6-2.7-2 .8a7.6 7.6 0 00-2.6-1.5L14.4 2H9.6l-.4 2.3a7.6 7.6 0 00-2.6 1.5l-2-.8L3 7.7l1.6 1.3a7.8 7.8 0 000 3L3 13.3l1.6 2.7 2-.8a7.6 7.6 0 002.6 1.5l.4 2.3h4.8l.4-2.3a7.6 7.6 0 002.6-1.5l2 .8 1.6-2.7z" />
    </svg>
  ),
  pencil: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
      <path d="M13 5l3 3" />
    </svg>
  ),
  logout: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8M16 8l4 4-4 4M9 12h11" />
    </svg>
  ),
  storefront: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 10v9h16v-9M3 5h18l1 4a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0z" />
      <path d="M9.5 19v-4h5v4" />
    </svg>
  ),
  creditCard: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 9.5h18M6.5 14.5h4" />
    </svg>
  ),
  lock: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 018 0v2.5M12 14.5v2.5" />
    </svg>
  ),
  calendar: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  ),
  cash: (p: P) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 9v6M18 9v6" />
    </svg>
  ),
} as const;

export type IconName = keyof typeof Icon;
