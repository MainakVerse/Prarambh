import type { SVGProps } from "react";

/** Minimal stroke-icon set shared by the dashboard shell. Zero external icon dependency. */
export type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps, path: React.ReactNode) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {path}
    </svg>
  );
}

export const Icon = {
  flag: (p: IconProps) => base(p, <><path d="M5 3v18" /><path d="M5 4h11l-2 4 2 4H5" /></>),
  scale: (p: IconProps) => base(p, <><path d="M12 3v18" /><path d="M5 8l-3 6a4 4 0 0 0 8 0l-3-6z" /><path d="M19 8l-3 6a4 4 0 0 0 8 0l-3-6z" /><path d="M5 8h14" /><path d="M9 21h6" /></>),
  clipboard: (p: IconProps) => base(p, <><rect x="6" y="4" width="12" height="17" rx="2" /><rect x="9" y="2" width="6" height="4" rx="1" /><path d="M9 11h6M9 15h6" /></>),
  calendar: (p: IconProps) => base(p, <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
  compass: (p: IconProps) => base(p, <><circle cx="12" cy="12" r="9" /><path d="M15 9l-2 6-4 2 2-6 4-2z" /></>),
  code: (p: IconProps) => base(p, <><path d="M8 8l-4 4 4 4M16 8l4 4-4 4" /></>),
  checkSquare: (p: IconProps) => base(p, <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 12l3 3 5-6" /></>),
  truck: (p: IconProps) => base(p, <><rect x="2" y="7" width="12" height="9" rx="1" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="6.5" cy="18" r="1.6" /><circle cx="16.5" cy="18" r="1.6" /></>),
  graduationCap: (p: IconProps) => base(p, <><path d="M2 9l10-4 10 4-10 4-10-4z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></>),
  rocket: (p: IconProps) => base(p, <><path d="M12 2c3 2 5 6 5 10-1 1-2 2-5 2s-4-1-5-2c0-4 2-8 5-10z" /><path d="M9 15l-3 5 5-2M15 15l3 5-5-2" /></>),
  server: (p: IconProps) => base(p, <><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01" /></>),
  activity: (p: IconProps) => base(p, <path d="M3 12h4l2 8 4-16 2 8h6" />),
  archive: (p: IconProps) => base(p, <><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></>),
  folder: (p: IconProps) => base(p, <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" />),
  users: (p: IconProps) => base(p, <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" /><circle cx="18" cy="9" r="2.6" /><path d="M15.5 14a5.2 5.2 0 0 1 5.8 6" /></>),
  settings: (p: IconProps) => base(p, <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9c.2.6.7 1.1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></>),
  chevronDown: (p: IconProps) => base(p, <path d="M6 9l6 6 6-6" />),
  chevronRight: (p: IconProps) => base(p, <path d="M9 6l6 6-6 6" />),
  search: (p: IconProps) => base(p, <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>),
  bell: (p: IconProps) => base(p, <><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" /></>),
  sparkles: (p: IconProps) => base(p, <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z" /></>),
  menu: (p: IconProps) => base(p, <path d="M3 6h18M3 12h18M3 18h18" />),
  x: (p: IconProps) => base(p, <path d="M5 5l14 14M19 5L5 19" />),
  warning: (p: IconProps) => base(p, <><path d="M12 3l10 18H2L12 3z" /><path d="M12 10v4M12 17h.01" /></>),
  lock: (p: IconProps) => base(p, <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>),
  checkCircle: (p: IconProps) => base(p, <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>),
  clock: (p: IconProps) => base(p, <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>),
  download: (p: IconProps) => base(p, <><path d="M12 3v12" /><path d="M7 11l5 5 5-5" /><path d="M5 21h14" /></>),
  refresh: (p: IconProps) => base(p, <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>),
  filter: (p: IconProps) => base(p, <path d="M4 5h16l-6 8v6l-4-2v-4z" />),
  plus: (p: IconProps) => base(p, <path d="M12 5v14M5 12h14" />),
  grid: (p: IconProps) => base(p, <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></>),
  message: (p: IconProps) => base(p, <path d="M4 4h16v12H8l-4 4V4z" />),
  chevronUpDown: (p: IconProps) => base(p, <><path d="M8 9l4-4 4 4" /><path d="M8 15l4 4 4-4" /></>),
} as const;

export type IconKey = keyof typeof Icon;
