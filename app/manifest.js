import { site } from '@/content/site';

// Web app manifest (/manifest.webmanifest): the name, colours and icon a phone uses when the site is added to its home screen
export default function manifest() {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: '/',
    display: 'browser',
    background_color: '#ECE3E2',
    theme_color: '#ECE3E2',
    icons: [
      { src: '/m/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/m/favicon.png', sizes: '256x256', type: 'image/png' },
    ],
  };
}
