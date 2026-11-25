const isDev = process.env.NODE_ENV === 'development';

/* Content Security Policy for the website (not /studio: Sanity Studio is a separate app with its own needs, kept
   behind Sanity login). Without nonces, so pages stay static and cached (Next.js CSP guide, "Without Nonces"):
   'unsafe-inline' scripts are needed for Next's inline bootstrap, so the policy's value is mainly in blocking
   third-party script/frame/connect origins, plugins, <base> hijacking, form hijacking and framing by other sites.
   Everything the site loads is same-origin except CMS images/videos from Sanity's CDN. */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "media-src 'self' blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  // Sanity API: only used by the click-to-edit overlay while an editor previews drafts
  "connect-src 'self' https://*.api.sanity.io wss://*.api.sanity.io",
  "frame-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // 'self' (not 'none'): the Studio's Presentation tool previews the site in an iframe on the same domain
  "frame-ancestors 'self'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Security advisories: `next build` prompts for an agent-run security upgrade when the installed version is affected
  experimental: { agentUpgrade: 'security' },
  // Lets a phone on the same Wi-Fi or hotspot (http://192.168.x.x / 172.20.10.x:3000) load the dev server's scripts; dev only.
  allowedDevOrigins: ['192.168.*.*', '172.*.*.*', '10.*.*.*', '*.local'],
  images: {
    // AVIF where the browser supports it, WebP otherwise, the original JPG as a last resort.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
  },
  // The Emirates Living Villa project was first published as /portfolio/seaside-villa
  async redirects() {
    return [{ source: '/portfolio/seaside-villa', destination: '/portfolio/emirates-living-villa', permanent: true }];
  },
  async headers() {
    return [
      {
        // Images and videos are replaced under the same name (see README), so browsers keep them for a week and then
        // check for a newer copy in the background rather than caching them forever.
        source: '/:dir(m|v)/:file*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // The site uses none of these browser features
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
          // Browsers only honour this over HTTPS. One year, without includeSubDomains/preload, so no other subdomain
          // (e.g. mail or DNS-verification records) is forced onto HTTPS; extend once the live domain is confirmed.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        ],
      },
      {
        // Every route except Sanity Studio (/studio and below)
        source: '/((?!studio(?:/|$)).*)',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ];
  },
};

export default nextConfig;
