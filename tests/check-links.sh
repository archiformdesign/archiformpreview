#!/bin/sh
# Broken links and missing assets, crawling every page of the site (external links are not followed).
#   npm run check:links                       the live site
#   BASE_URL=http://localhost:3100 npm run check:links   a local `npm start` (port 3100)
BASE=${BASE_URL:-https://archiformdesign.me}
npx --yes linkinator@8.1.0 "$BASE" --recurse --skip "^(?!$(echo "$BASE" | sed 's/[.]/\\./g'))"
