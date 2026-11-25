# Baseline audit — 2026-11-25 16:40 — main @ 9779663

Lighthouse 13.6 against local production build (next start), simulated throttling. Live site returns 403 to headless Chrome (Hostinger bot protection).

```
page                                     perf  a11y  bp   seo  FCP   LCP   TBT  CLS    SI    KB    reqs  LCP el
contact-desktop                          100   96    100  100  0.24  0.24  0    0.000  0.24  633   48
contact-mobile                           100   96    100  100  0.91  0.91  1    0.000  0.91  599   34
founder-desktop                          98    96    100  100  0.24  1.13  0    0.000  0.24  835   54
founder-mobile                           80    96    100  100  0.91  5.35  1    0.000  0.91  806   40
home-desktop                             95    96    100  100  0.46  1.53  0    0.002  0.78  4659  65
home-mobile                              73    96    100  100  2.02  8.12  85   0.001  3.30  4460  50
journal-desktop                          95    96    100  100  0.25  1.54  0    0.000  0.25  862   54
journal-mobile                           80    96    100  100  0.90  5.42  0    0.000  0.90  761   41
portfolio-desktop                        100   96    100  100  0.24  0.24  0    0.000  0.24  942   62
portfolio-mobile                         82    96    100  100  0.90  5.04  0    0.000  0.90  949   44
portfolio_emirates-living-villa-desktop  98    96    100  100  0.24  1.06  0    0.000  0.28  808   53
portfolio_emirates-living-villa-mobile   100   96    100  100  0.90  0.90  0    0.000  0.90  683   39
services-desktop                         100   96    100  100  0.24  0.24  0    0.000  0.24  847   56
services-mobile                          100   96    100  100  0.91  0.91  3    0.000  0.91  858   42
```

Linkinator (live, recursive): 138 links, 0 broken.
JS per page: 19-20 requests, ~464 KB gzip / 1.36 MB raw; ~620 KB raw is Sanity Visual Editing + styled-components + motion (DraftModeTools imported by root layout).
Fonts: 8 woff2, 162 KB, none preloaded. CSS: 2 files, 17 KB gzip.
Live: HTML TTFB 0.10-0.20 s (ISR HIT); gzip preferred over br; /m/*.webp and /v/*.mp4 served with NO Cache-Control and CDN MISS; www and apex both 200 (no 301).
