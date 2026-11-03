#!/usr/bin/env bash
# Builds the prototype as static files in out/ for GitHub Pages.
# Route handlers (src/app/api) need a server, so they are left out of this build;
# the screens fall back to their sample data when /api is missing.
set -euo pipefail
cd "$(dirname "$0")/.."
stash="$(mktemp -d)"
restore() { [ -d "$stash/api" ] && rm -rf src/app/api && mv "$stash/api" src/app/api; rm -rf "$stash"; }
trap restore EXIT
[ -d src/app/api ] && mv src/app/api "$stash/api"
rm -rf .next out
STATIC_EXPORT=1 npx next build
echo "${PAGES_DOMAIN:-karizai.shub.ir}" > out/CNAME
touch out/.nojekyll
# The home page only sends visitors to /chat/; a tiny page does that before any script loads.
cat > out/index.html <<'HTML'
<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>کاریز</title>
<meta http-equiv="refresh" content="0;url=/chat/"><script>location.replace("/chat/")</script>
<link rel="prefetch" href="/chat/"></head><body></body></html>
HTML
