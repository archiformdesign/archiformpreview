import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Temporarily Unavailable',
  description: 'ARCHIFORM Design Studio is currently undergoing maintenance.',
  path: '/',
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F3F0E8] text-[#40382F] flex items-center justify-center px-6">
      <section className="max-w-2xl text-center">
        <p className="text-xs tracking-[0.35em] uppercase text-[#85866B] mb-8">
          ARCHIFORM · Dubai
        </p>

        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
          We’ll be back soon.
        </h1>

        <p className="text-base md:text-lg leading-relaxed text-[#756D62] max-w-lg mx-auto">
          Our website is currently undergoing maintenance as we make a few
          improvements. We appreciate your patience and look forward to
          welcoming you back soon.
        </p>

        <div className="w-12 h-px bg-[#85866B] mx-auto my-10" />

        <p className="text-xs tracking-[0.2em] uppercase text-[#85866B]">
          Architecture · Interiors · Thoughtful Living
        </p>
      </section>
    </main>
  );
}