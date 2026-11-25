import Image from 'next/image';
import Link from 'next/link';
import CmsImage from './CmsImage';
import EmphasisTail from './EmphasisTail';
import { roomFilms, featureFilm } from '@/content/media';
// Arched images beside the process steps and the founder teaser share one column: about 80vw on phones, a third of the page on desktop
const ARCH_SIZES = '(max-width: 820px) 80vw, 34vw';
const CARD_SIZES = '(max-width: 820px) min(66vw, 360px), 330px';
const JOURNEY_SIZES = '(max-width: 600px) 72vw, min(380px, 30vw)';
// The room panel icons, in panel order (light, airflow, materials, living)
const PANEL_ICONS = [
  <svg key="0" className="ic" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true"><circle cx="20" cy="20" r="7"/><path d="M20 3v6M20 31v6M3 20h6M31 20h6M8 8l4.2 4.2M27.8 27.8 32 32M8 32l4.2-4.2M27.8 12.2 32 8"/></svg>,
  <svg key="1" className="ic" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true"><path d="M4 14h20a5 5 0 1 0-5-5M4 21h28a5 5 0 1 1-5 5M4 28h12"/></svg>,
  <svg key="2" className="ic" viewBox="0 0 70 104" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><use href="#sprig"/></svg>,
  <svg key="3" className="ic" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true"><path d="M5 5h30v30H5zM5 18h11M24 18h11M18 35V24"/><path d="M10 30c4-6 10-3 13-9s7-6 9-8" strokeDasharray="2 3"/></svg>,
];
const imgPos = (im) => (im.pos ? { objectPosition: im.pos } : undefined);

/* Markup for the home page scroll story. Element ids are used by lib/home-story.js.
   content: the editable copy and photos (Sanity, with content/home.js as fallback), prepared by app/page.js. */
export default function HomeMarkup({ content: c }) {
  const featured = c.featured;
  return (
    <>
      {/* The walk-in film's poster is the largest thing on the first screen, but lib/home-story.js only attaches it once the
          scripts run (phones and portrait tablets get the portrait cut). These hints (React moves them into <head>) let the
          browser fetch the right one with the HTML; the media queries match the script's choice. */}
      <link rel="preload" as="image" href={roomFilms[0].mposter} media="(orientation: portrait) and (max-width: 1100px)" fetchPriority="high" />
      <link rel="preload" as="image" href={roomFilms[0].poster} media="not all and (orientation: portrait) and (max-width: 1100px)" fetchPriority="high" />
      <div className="loader" id="loader" aria-hidden="true">
        <img className="ld-logo" id="ldLogo" src="/m/logo-dark.webp" alt="" width="520" height="352" fetchPriority="high" />
        <div className="meta"><span>Dubai · 25.20° N, 55.27° E</span><span id="ldPct">000</span></div>
      </div>
      <div id="vp" aria-hidden="true"></div>
      <main id="home">
        <section className="stage" id="stage" aria-label="Designed with intention, built around better living">
          <h1 className="sr">Designed with intention, built around better living. Interior design in Dubai by ARCHIFORM.</h1>
          <div className="vis" id="heroVis">
            <div className="wall" id="wall" aria-hidden="true">
              {/* Phones and tablets (the same 1100px break as lib/home-story.js) keep the original, shorter olive trees */}
              <picture><source media="(max-width: 1100px)" srcSet="/m/entry-wide-v5.webp" /><img className="entry" id="entryImg" src="/m/entry-wide-v6.webp" alt="" width="4000" height="1800" fetchPriority="high" /></picture>
            </div>
            <div className="view" id="view">
              <div className="scene" id="scene">
                <img className="skybg" id="skybg" src="/m/sky-dusk.jpg" alt="" width="1200" height="675" />
                <div className="sunglow"></div>
                <div className="dusk" id="dusk"></div>
                {/* Holistic design: a 3D garden on a travertine podium. Each cut-out stands at its own depth (--x, --z, --w in units of --u) */}
                <div className="land" id="land" aria-hidden="true">
                  <div className="lean" id="lean">
                    <div className="rig" id="rig">
                      <div className="pod">
                        <i><b style={{'--x': 0, '--z': .04, '--sw': 1.34, '--sh': .14}} /><b className="lt" style={{'--x': -.2, '--z': .1, '--sw': .5, '--sh': .18}} /><b style={{'--x': -.66, '--z': -.16, '--sw': .3}} /><b style={{'--x': .68, '--z': -.1, '--sw': .3}} /><b style={{'--x': -.5, '--z': .02, '--sw': .44, '--sh': .1}} /><b style={{'--x': .52, '--z': .02, '--sw': .46, '--sh': .1}} /></i>
                        <i style={{'--d': 2}} />
                      </div>
                      {/* Wide enough that its ends never show: it stands behind the house, so perspective draws it smaller than its width */}
                      <div className="ly haze" style={{'--x': 0, '--z': -.45, '--w': 7, '--y': -.02}}><span /></div>
                      <div className="ly glow" style={{'--x': -.05, '--z': -.04, '--w': 1.7}}><span /></div>
                      {/* An old olive either side of the house, standing just in front of its corners to frame it. lib/home-story.js keeps the diagram labels off them */}
                      <div className="ly sway olive l" style={{'--x': -.5, '--z': .02, '--w': .4}}><span><img data-src="/m/hol/olive-tree.webp" data-msrc="/m/hol/olive-tree-m.webp" alt="" width="776" height="860" fetchPriority="low" /></span></div>
                      <div className="ly sway olive r" style={{'--x': .52, '--z': .02, '--w': .42}}><img data-src="/m/hol/olive-tree.webp" data-msrc="/m/hol/olive-tree-m.webp" alt="" width="776" height="860" fetchPriority="low" /></div>
                      <div className="ly hs" id="hsLy" style={{'--x': 0, '--z': 0, '--w': 1.2}}><img data-src="/m/hol/house-v4.webp" data-msrc="/m/hol/house-v4-m.webp" alt="" width="2728" height="1000" fetchPriority="low" /><span className="hsh" aria-hidden="true" /><span className="hmk" aria-hidden="true"><i data-k="sun" style={{left: '38.5%', top: '5%'}} /><i data-k="air" style={{left: '59.4%', top: '33%'}} /><i data-k="water" style={{left: '55%', top: '95%'}} /><i data-k="green" style={{left: '33%', top: '93%'}} /><i data-k="people" style={{left: '38%', top: '30%'}} /></span></div>
                      <div className="ly bed" style={{'--x': -.36, '--z': .08, '--w': .4, '--y': -.008}}><img data-src="/m/hol/grass.webp" data-msrc="/m/hol/grass-m.webp" alt="" width="1400" height="407" fetchPriority="low" /></div>
                      <div className="ly bed" style={{'--x': .37, '--z': .06, '--w': .4, '--y': -.008}}><img data-src="/m/hol/shrubs.webp" data-msrc="/m/hol/shrubs-m.webp" alt="" width="1400" height="419" fetchPriority="low" /></div>
                      {/* A potted olive either side of the front door, standing at the foot of its pilasters */}
                      <div className="ly pot" style={{'--x': -.074, '--z': .02, '--w': .04, '--y': .03}}><img data-src="/m/hol/olive-pot.webp" data-msrc="/m/hol/olive-pot-m.webp" alt="" width="318" height="640" fetchPriority="low" /></div>
                      <div className="ly pot" style={{'--x': .05, '--z': .02, '--w': .04, '--y': .03}}><img data-src="/m/hol/olive-pot.webp" data-msrc="/m/hol/olive-pot-m.webp" alt="" width="318" height="640" fetchPriority="low" /></div>
                      {/* Phones only: the feature cards in a row above the roof (desktop shows the labelled diagram, #holDiag, instead) */}
                      <div className="ly hc" style={{'--x': 0, '--z': .04, '--w': .96, '--y': .62}}>
                        <div className="hcard"><span className="ic"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="7"/><path d="M20 3v6M20 31v6M3 20h6M31 20h6M8 8l4.2 4.2M27.8 27.8 32 32M8 32l4.2-4.2M27.8 12.2 32 8"/></svg></span><span className="nm">Sun &amp;<br />shade</span></div>
                        <div className="hcard"><span className="ic"><svg viewBox="0 0 40 40"><path d="M4 14h20a5 5 0 1 0-5-5M4 21h28a5 5 0 1 1-5 5M4 28h12"/></svg></span><span className="nm">Fresh<br />air</span></div>
                        <div className="hcard"><span className="ic"><svg viewBox="0 0 40 40"><path d="M20 5c6 8.5 10 14 10 20a10 10 0 0 1-20 0c0-6 4-11.5 10-20z"/><path d="M15 26a5 5 0 0 0 5 5"/></svg></span><span className="nm">Cool<br />water</span></div>
                        <div className="hcard"><span className="ic"><svg viewBox="0 0 70 104"><use href="#sprig"/></svg></span><span className="nm">Living<br />green</span></div>
                        <div className="hcard"><span className="ic"><svg viewBox="0 0 40 40"><circle cx="14" cy="13" r="5"/><circle cx="27" cy="15" r="4"/><path d="M5 35c0-7 4-12 9-12s9 5 9 12M20 35c1-6 4-10 7-10s7 4 7 10"/></svg></span><span className="nm">The people<br />inside</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hol" id="holText">
                  <p className="lbl">{c.holisticLabel}</p>
                  <h2 className="h2"><EmphasisTail text={c.holisticHeading} tail="as One." /></h2>
                  <p className="body">{c.holisticText}</p>
                </div>
                {/* Holistic design as a diagram: each point is labelled clear of the house and the text, with a leader line to the
                    part of the house it describes. lib/home-story.js draws the lines to the markers in the house layer (.hmk). */}
                <div className="hdg" id="holDiag">
                  <svg className="hdg-lines" aria-hidden="true"><line pathLength="1" /><circle r="3.5" /><line pathLength="1" /><circle r="3.5" /><line pathLength="1" /><circle r="3.5" /><line pathLength="1" /><circle r="3.5" /><line pathLength="1" /><circle r="3.5" /></svg>
                  <ul className="hdg-pts" aria-label="What we design for">
                    <li className="hdg-pt l" data-k="green"><span className="ic" aria-hidden="true"><svg viewBox="0 0 70 104"><use href="#sprig"/></svg></span><span><b>Living green</b><em>Planting woven into every view</em></span></li>
                    <li className="hdg-pt l" data-k="sun"><span className="ic" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="7"/><path d="M20 3v6M20 31v6M3 20h6M31 20h6M8 8l4.2 4.2M27.8 27.8 32 32M8 32l4.2-4.2M27.8 12.2 32 8"/></svg></span><span><b>Sun &amp; shade</b><em>Windows and shading designed to control sunlight</em></span></li>
                    <li className="hdg-pt l" data-k="people"><span className="ic" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="14" cy="13" r="5"/><circle cx="27" cy="15" r="4"/><path d="M5 35c0-7 4-12 9-12s9 5 9 12M20 35c1-6 4-10 7-10s7 4 7 10"/></svg></span><span><b>The people inside</b><em>Rooms shaped around daily life</em></span></li>
                    <li className="hdg-pt r" data-k="water"><span className="ic" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M20 5c6 8.5 10 14 10 20a10 10 0 0 1-20 0c0-6 4-11.5 10-20z"/><path d="M15 26a5 5 0 0 0 5 5"/></svg></span><span><b>Cool water</b><em>Water features and plants that help cool the surrounding air</em></span></li>
                    <li className="hdg-pt r" data-k="air"><span className="ic" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M4 14h20a5 5 0 1 0-5-5M4 21h28a5 5 0 1 1-5 5M4 28h12"/></svg></span><span><b>Fresh air</b><em>Openings placed for cross-breezes</em></span></li>
                  </ul>
                </div>
              </div>
              <div className="reelclip" id="reelclip">
                <div className="reel" id="reel">
                <video data-clip="0" muted playsInline preload="none" aria-hidden="true"></video>
                {/* The walk-in film (i 0) gets its poster from an inline script in app/page.js before React hydrates, hence suppressHydrationWarning */}
                {roomFilms.map((f, i) => (
                  <video key={f.id} data-clip={i + 1} data-src={f.src} data-msrc={f.msrc} data-poster={f.poster} data-mposter={f.mposter} data-mfps={f.mfps} muted loop={f.loop} playsInline preload={i ? 'none' : 'auto'} aria-label={f.label} suppressHydrationWarning={i === 0}></video>
                ))}
                </div>
              </div>
              <svg className="inshade" aria-hidden="true"><defs><filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="12"/></filter></defs><path id="shPath" fill="none" stroke="rgba(52,40,28,.4)" strokeWidth="34" filter="url(#sh)"/></svg>
            </div>
            <div className="dim" id="dim" aria-hidden="true"></div>
            <div className="portal" id="portal" aria-hidden="true">
              <svg className="bez" id="bez"></svg>
              <div className="doors" id="doors"><div className="glow" id="dglow"></div><div className="leaf l" id="leafL"></div><div className="leaf r" id="leafR"></div></div>
            </div>

            <p className="hh a" id="hhA" aria-hidden="true">Designed with<br />{' '}intention.</p>
            <p className="hh b" id="hhB" aria-hidden="true"><em>Built around</em><br />{' '}better living.</p>
            <div className="hb" id="hb">
              <hr />
              <p>{c.heroIntro}</p>
            </div>
            <ul className="hv lbl" id="hv" aria-label="What we design for">{c.heroValues.map((v, i) => <li key={i}>{v}</li>)}</ul>

            <div className="scroll-cue" id="cue" aria-hidden="true"><span>Scroll to enter</span><i /></div>

            <div className="say" id="sayH">
              <p className="lbl">{c.walkInLabel}</p>
              <p className="disp">{c.walkInHeading}</p>
              <p className="it">{c.walkInText}</p>
            </div>
          </div>
          <div className="hl-panels" id="hlPanels">
            {c.panels.map((panel, i) => (
              <div className="pane" key={i}>
                {PANEL_ICONS[i]}
                <h3>{panel.title}</h3>
                <p className="it">{panel.text}</p>
              </div>
            ))}
          </div>
          <ol className="hl-index" id="hlIndex" aria-hidden="true">{c.panels.map((panel, i) => <li key={i} className={i === 0 ? 'on' : undefined}>{panel.title}</li>)}</ol>
        </section>

        <section className="dt" id="dt" aria-labelledby="dtTitle">
          <div className="dt-in">
            <div className="dt-head">
              <p className="lbl rule">{c.detailsLabel}</p>
              <h2 className="h2" id="dtTitle"><EmphasisTail text={c.detailsHeading} tail="Healthy?" /></h2>
              <p className="body">{c.detailsText}</p>
            </div>
            <div className="cards" id="cards">
              {c.detailCards.map((card, i) => (
                <article className="card" key={i}><div className="ph"><CmsImage src={card.image.src} alt={card.image.alt} width={card.image.w} height={card.image.h} sizes={CARD_SIZES} style={imgPos(card.image)} /></div><h3>{card.title}</h3>{card.subtitle ? <p>{card.subtitle}</p> : null}{card.points.length ? <ul>{card.points.map((pt, j) => <li key={j}>{pt}</li>)}</ul> : null}</article>
              ))}
            </div>
          </div>
        </section>

        <section className="hl-intro featured-intro" aria-labelledby="fxTitle">
          <p className="lbl rule" id="fxTitle">Featured project</p>
        </section>

        <section className="stage stage2" id="fstage" aria-label={`${featured.name}, featured project`}>
          <div className="vis">
            <div className="fvid" id="fvid"><video id="vFeat" data-src={featureFilm.src} data-msrc={featureFilm.msrc} data-poster={featureFilm.poster} muted playsInline preload="none" aria-label={featureFilm.label}></video><div className="fshade" id="fshade"></div></div>
            <div className="say" id="sayA" aria-hidden="true">
              <p className="lbl">Fresh air</p>
              <p className="disp">It begins with the air you breathe.</p>
            </div>
            <div className="say" id="sayB" aria-hidden="true">
              <p className="disp">Now the breeze is part of everyday life.</p>
              <p className="it">Soft daylight, carried into every room.</p>
            </div>

            <div className="feat" id="feat">
              <p className="lbl rule">Featured project</p>
              <h2>{featured.name}</h2>
              <p className="sub">{c.featuredSubtitle}</p>
              <p className="body">{c.featuredText}</p>
              <dl>
                <div><dt>Location</dt><dd>{featured.location}</dd></div>
                <div><dt>Type</dt><dd>{featured.type}</dd></div>
                <div><dt>Services</dt><dd>{featured.did}</dd></div>
              </dl>
              <div className="acts">
                <Link className="btn" href="/portfolio">View portfolio <svg width="26" height="10" aria-hidden="true"><use href="#arrow"/></svg></Link>
                <Link className="go" href={`/portfolio/${featured.slug}`}>View the project <svg width="26" height="10" aria-hidden="true"><use href="#arrow"/></svg></Link>
              </div>
            </div>
            <p className="it feat-q" id="featQ" style={{position: 'absolute', right: 'var(--side)', bottom: 'calc(30px + env(safe-area-inset-bottom,0px))', color: 'var(--paper)', fontSize: 'clamp(22px,2vw,28px)', textShadow: '0 2px 20px rgba(62,49,34,.45)'}}>“{c.featuredQuote}”</p>
          </div>
        </section>

        <section className="home-process" id="homeProcess" aria-labelledby="processTitle">
          <div className="process-layout">
            <div className="process-media" aria-hidden="true">
              <div className="process-visual">
                <div className="process-frame"><Image src="/m/process-visit.webp" alt="" width={860} height={860} sizes={ARCH_SIZES} /></div>
                <div className="process-frame"><Image src="/m/process-materials.webp" alt="" width={860} height={860} sizes={ARCH_SIZES} /></div>
                <div className="process-frame"><Image src="/m/kitchen.jpg" alt="" width={1086} height={1448} sizes={ARCH_SIZES} /></div>
                <div className="process-frame"><Image src="/m/bed.jpg" alt="" width={852} height={1280} sizes={ARCH_SIZES} /></div>
                <div className="process-founder"><CmsImage className="process-founder-portrait" src={c.founderImage.src} alt="" width={c.founderImage.w} height={c.founderImage.h} sizes={ARCH_SIZES} style={imgPos(c.founderImage)} /></div>
              </div>
            </div>
            <div className="process-copy">
              <div className="process-heading">
                <h2 className="h2" id="processTitle">{c.processHeading}</h2>
              </div>
              <div className="process-window">
                <ol className="process-steps">
                  {c.processSteps.map((step, i) => (
                    <li key={i}><span className="lbl">{String(i + 1).padStart(2, '0')}</span><h3 className="h2">{step.title}</h3><p className="body">{step.text}</p></li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="fd" id="fdTeaser" aria-labelledby="fdName">
          <div className="ph"><CmsImage src={c.founderImage.src} alt={c.founderImage.alt} width={c.founderImage.w} height={c.founderImage.h} sizes={ARCH_SIZES} style={imgPos(c.founderImage)} /></div>
          <div className="tx">
            <p className="lbl rule">{c.founderLabel}</p>
            <h2 className="disp" id="fdName">{c.founderHeading}</h2>
            <p className="body">{c.founderText}</p>
            <p className="it">“{c.founderQuote}”</p>
            <p className="lbl">{c.founderSignature}</p>
            <Link className="go" href="/founder" style={{alignSelf: 'flex-start'}}>MEET THE FOUNDER <svg width="26" height="10" aria-hidden="true"><use href="#arrow"/></svg></Link>
          </div>
        </section>

        {/* The journey: three pictures in one line, held on screen while they come up from left to right (lib/home-story.js) */}
        <section className="jr3" id="journey" aria-labelledby="jrTitle">
          <h2 className="h2 jr3-h" id="jrTitle"><EmphasisTail text={c.journeyHeading} tail="Transformation." /></h2>
          <div className="jr3-in">
            {c.journey.map((j, i) => (
              <figure className="jr3-f" key={i}>
                <div className="ph"><CmsImage src={j.image.src} alt={j.image.alt} width={j.image.w} height={j.image.h} sizes={JOURNEY_SIZES} style={imgPos(j.image)} /></div>
                <figcaption className="lbl"><span>{'0' + (i + 1)}</span>{j.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <div className="wordmark-band" id="wordmark" aria-hidden="true"><p className="wordmark">ARCHIFORM</p></div>

        <section id="closeSec" aria-labelledby="closeTitle">
          <div className="close">
            <div className="a">
              <p className="lbl rule">{c.closeLabel}</p>
              <h2 className="disp" id="closeTitle">{c.closeHeading}</h2>
            </div>
            <div className="b">
              {c.closeParagraphs.map((para, i) => <p className="body" key={i}>{para}</p>)}
              <Link className="go talk" href="/contact">{c.closeCta} <svg width="26" height="10" aria-hidden="true"><use href="#arrow"/></svg></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
