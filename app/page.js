
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'ARCHIFORM | Temporarily Unavailable',
  description: 'ARCHIFORM Design Studio',
  path: '/',
});

export default function HomePage() {
  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483647,
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 300 230"
        role="img"
        aria-label="ARCHIFORM Design Studio"
        style={{ width: '180px', height: 'auto' }}
      >
        <path
          d="M75 125 V65 A55 55 0 0 1 185 65 V125 H160 V65 A30 30 0 0 0 100 65 V125 Z"
          fill="#D9D1BD"
        />

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
    </main>
  );
}
