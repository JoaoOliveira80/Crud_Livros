import type { SVGProps } from "react";

const paths: Record<string, React.ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  library: <><path d="M4 19.5V4.7a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0 0 4h12"/><path d="M8 7h7M8 11h6"/></>,
  chart: <><path d="M4 20V11M10 20V4M16 20v-8M22 20v-5"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .3 1.8l.1.1-2.9 2.9-.1-.1a1.65 1.65 0 0 0-1.8-.3l-.1.1V21H9v-1.5a1.65 1.65 0 0 0-1.8-.3l-.1.1-2.9-2.9.1-.1A1.65 1.65 0 0 0 4.6 15H3v-6h1.6a1.65 1.65 0 0 0-.3-1.8l-.1-.1 2.9-2.9.1.1A1.65 1.65 0 0 0 9 4.6V3h6v1.6a1.65 1.65 0 0 0 1.8-.3l.1-.1 2.9 2.9-.1.1A1.65 1.65 0 0 0 19.4 9H21v6z"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  search: <><circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 5 5"/></>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
  arrowUp: <path d="m7 14 5-5 5 5"/>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
  book: <><path d="M12 7.5C9.5 5.8 6.2 5.5 3 6v14c3.2-.5 6.5-.2 9 1.5 2.5-1.7 5.8-2 9-1.5V6c-3.2-.5-6.5-.2-9 1.5ZM12 7.5V21"/></>,
  check: <path d="m5 12 5 5L20 7"/>,
  close: <path d="M18 6 6 18M6 6l12 12"/>,
  edit: <><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4Z"/></>,
  trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6M10 10v7m4-7v7"/></>,
  upload: <><path d="M12 16V3m-5 5 5-5 5 5M4 17v4h16v-4"/></>,
  download: <><path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/></>,
  sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8ZM20 17l.8 2.2L23 20l-2.2.8L20 23l-.8-2.2L17 20l2.2-.8Z"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  moon: <path d="M20.8 14A9 9 0 0 1 10 3.2 9 9 0 1 0 20.8 14Z"/>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  filter: <><path d="M4 7h16M7 12h10M10 17h4"/></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/></>,
  refresh: <><path d="M3 12a9 9 0 0 1 15.4-6.4L21 8M21 3v5h-5M21 12A9 9 0 0 1 5.6 18.4L3 16m0 5v-5h5"/></>,
  external: <><path d="M14 3h7v7m0-7-10 10"/><path d="M20 13v7H4V4h7"/></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
};

export function Icon({name, size=20, ...props}: SVGProps<SVGSVGElement> & {name: keyof typeof paths; size?: number}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
