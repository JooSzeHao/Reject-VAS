#!/usr/bin/env bash
# Renders the introductory VAS pamphlet to a print-ready A4 PDF (2 sides).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
CHROME="${CHROME:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}"
"$CHROME" --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
  --print-to-pdf="$HERE/../output/Risalah_Pengenalan_VAS_HSIS.pdf" \
  "$HERE/risalah_vas_pengenalan.html"
