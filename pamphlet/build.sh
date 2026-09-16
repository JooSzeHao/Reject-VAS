#!/usr/bin/env bash
# Renders every pamphlet version to a print-ready A4 PDF (2 sides, mono).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../output"
CHROME="${CHROME:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}"

render() {  # render <source.html> <target.pdf>
  "$CHROME" --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
    --print-to-pdf="$OUT/$2" "$HERE/$1"
}

render risalah_vas_pengenalan.html  Risalah_Pengenalan_VAS_HSIS.pdf   # A - editorial
render risalah_vas_b_cetakbesar.html Risalah_VAS_B_CetakBesar.pdf     # B - large print
render risalah_vas_c_langkah.html    Risalah_VAS_C_Langkah.pdf        # C - three steps
render risalah_vas_d_pokok.html      Risalah_VAS_D_PokokKeputusan.pdf # D - decision tree
render risalah_vas_e_pokok.html      Risalah_VAS_E_PokokKeputusan.pdf # E - no FAQ, refined
