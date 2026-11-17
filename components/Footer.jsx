import Image from 'next/image';
import { site } from '@/content/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="siteFoot" className="foot">
      <span>
        © {year} {site.name} · {site.address.city}
        <br />{site.tagline}
      </span>
      <span className="c">
        <Image src="/m/mark.webp" alt="" width={192} height={159} sizes="64px" />
      </span>
      {/* Each contact as a small label above its value, side by side (stacked and centred on phones) */}
      <div className="foot-links">
        {site.instagram ? (
          <div className="foot-item">
            <span className="k">Instagram</span>
            <a href={`https://www.instagram.com/${site.instagram}/`} target="_blank" rel="noopener noreferrer">
              @{site.instagram}<span className="sr"> on Instagram (opens in a new tab)</span>
            </a>
          </div>
        ) : null}
        <div className="foot-item">
          <span className="k">Email</span>
          <a className="sel" href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
    </footer>
  );
}
