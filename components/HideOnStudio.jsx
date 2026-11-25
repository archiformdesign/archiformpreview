'use client';

import { usePathname } from 'next/navigation';

// Sanity Studio (/studio) is a full-screen app of its own, so the site's header and footer stay out of it.
export default function HideOnStudio({ children }) {
  const pathname = usePathname() ?? '';
  return pathname === '/studio' || pathname.startsWith('/studio/') ? null : children;
}
