
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'ARCHIFORM | Temporarily Unavailable',
  description: 'ARCHIFORM Design Studio is temporarily unavailable.',
  path: '/',
});

export default function HomePage() {
  return (
    <main className="fixed inset-0 z-[99999] flex min-h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 300 230"
          className="w-44 sm:w-52"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="ARCHIFORM Design Studio"
        >
          {/* Architectural arch */}
          <path
            d="M75 125 V65 A55 55 0 0 1 185 65 V125 H160 V65 A30 30 0 0 0 100 65 V125 Z"
            fill="#D9D1BD"
          />

          {/* Olive branch */}
          <path
            d="M165 125 Q175 75 220 35"
            fill="none"
            stroke="#777B51"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <g fill="#777B51">
            <ellipse cx="180" cy="99" rx="8" ry="17" transform="rotate(-48 180 99)" />
            <ellipse cx="195" cy="77" rx="8" ry="17" transform="rotate(48 195 77)" />
            <ellipse cx="204" cy="57" rx="7" ry="15" transform="rotate(-45 204 57)" />
            <ellipse cx="218" cy="39" rx="7" ry="14" transform="rotate(45 218 39)" />
            <ellipse cx="168" cy="119" rx="7" ry="14" transform="rotate(-55 168 119)" />
          </g>

          {/* Brand name */}
          <text
            x="150"
            y="170"
            textAnchor="middle"
            fill="#D9D1BD"
            fontFamily="Georgia, serif"
            fontSize="27"
            letterSpacing="3"
          >
            ARCHIFORM
          </text>

          {/* Descriptor */}
          <text
            x="150"
            y="192"
            textAnchor="middle"
            fill="#B8AE99"
            fontFamily="Arial, sans-serif"
            fontSize="10"
            letterSpacing="5"
          >
            DESIGN STUDIO
          </text>
        </svg>
      </div>
    </main>
  );
}
