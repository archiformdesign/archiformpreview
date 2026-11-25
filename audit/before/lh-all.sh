#!/bin/zsh
# Usage: lh-all.sh <base-url> <out-dir>
# Runs Lighthouse (all categories) mobile + desktop on every page.
BASE=$1; OUT=$2
mkdir -p "$OUT"
PAGES=(/ /founder /portfolio /services /journal /contact /portfolio/emirates-living-villa)
for p in $PAGES; do
  name=${${p#/}//\//_}; [ -z "$name" ] && name=home
  for ff in mobile desktop; do
    extra=(); [ $ff = desktop ] && extra=(--preset=desktop)
    npx lighthouse "$BASE$p" $extra --form-factor=$ff --output=json --output=html \
      --output-path="$OUT/lh-$name-$ff" --chrome-flags="--headless=new" --quiet >/dev/null 2>&1
    echo "done $name $ff"
  done
done
