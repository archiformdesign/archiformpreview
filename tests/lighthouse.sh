#!/bin/sh
# Lighthouse (performance, accessibility, best practices, SEO) for every page, phone and desktop, then a summary table.
#   npm run audit                      local production build (runs `next start` on port 3100 if nothing is there yet)
#   BASE_URL=https://... npm run audit another server. Note: Hostinger's bot protection answers headless Chrome with
#                                      403, so the live site cannot be audited this way; use https://pagespeed.web.dev
#   OUT=audit/after npm run audit      where the reports go (default audit/latest)
BASE=${BASE_URL:-http://localhost:3100}
OUT=${OUT:-audit/latest}
mkdir -p "$OUT"
STARTED=""
if [ -z "$BASE_URL" ] && ! curl -s -o /dev/null "$BASE"; then
  npx next start -p 3100 >/dev/null 2>&1 & STARTED=$!
  until curl -s -o /dev/null "$BASE"; do sleep 1; done
fi
for p in / /founder /portfolio /services /journal /contact /portfolio/emirates-living-villa; do
  name=$(echo "$p" | sed 's#^/##; s#/#_#g'); [ -z "$name" ] && name=home
  for ff in mobile desktop; do
    if [ $ff = desktop ]; then preset="--preset=desktop"; else preset=""; fi
    rm -f "$OUT/lh-$name-$ff.report.json"
    for attempt in 1 2; do   # Chrome occasionally fails to start a run; one retry
      npx --yes lighthouse@13.6.0 "$BASE$p" $preset --form-factor=$ff --output=json --output=html \
        --output-path="$OUT/lh-$name-$ff" --chrome-flags="--headless=new" --quiet >/dev/null 2>&1
      [ -s "$OUT/lh-$name-$ff.report.json" ] && break
    done
    echo "lighthouse: $name $ff"
  done
done
[ -n "$STARTED" ] && kill "$STARTED"
node tests/lighthouse-summary.mjs "$OUT"
