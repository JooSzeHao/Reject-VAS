/* Rajah PDCA sebagai satu slaid: gelang ialah imej tetap (dijana oleh
 * `python3 pdca_diagram.py gelang`), manakala setiap perkataan ialah kotak
 * teks berasingan yang boleh diedit dalam Google Slides / PowerPoint.
 *
 * Imej gelang dilukis dalam julat +/-0.90 unit data dan diletakkan sebagai
 * segi empat sama bersisi S inci, jadi 1 unit data = S/1.8 inci. Semua
 * kedudukan teks dikira daripada skala itu supaya label sentiasa jatuh di
 * tengah jalur gelang walaupun saiz S diubah.
 */
const pptxgen = require('pptxgenjs');

const RING = '/home/user/Reject-VAS/output/pdca_gelang.png';
const OUT = '/home/user/Reject-VAS/output/PDCA_VAS_Kitaran_Slaid.pptx';

const DEEP = '083F49';
const TEAL = '028090';
const SEA = '00A896';
const MINT = '9AD9DA';
const AMBER = 'E08A3C';
const INK = '10262B';
const BODY = '3E5A61';
const MUTED = '7C9198';
const WHITE = 'FFFFFF';
const HEAD = 'Cambria';
const SANS = 'Calibri';

const CX = 6.667, CY = 4.0;      // pusat kitaran, inci
const S = 5.2;                    // sisi imej gelang, inci
const U = S / 1.8;                // 1 unit data = U inci
const R_MID = 0.63 * U;           // jejari tengah jalur (0.46–0.80 unit)
const R_LABEL = R_MID + 0.02;

const rad = (d) => (d * Math.PI) / 180;
const px = (r, a) => CX + r * Math.cos(rad(a));
const py = (r, a) => CY - r * Math.sin(rad(a));   // y slaid ke bawah

const PHASES = [
  { key: 'PLAN', word: 'Rancang', color: TEAL, mid: 45,
    items: ['Asas 36.8%', 'Sasaran 65%', 'Hipotesis: terlalu bergantung UMP'],
    bx: 9.45, by: 1.05, align: 'left' },
  { key: 'DO', word: 'Laksana', color: SEA, mid: 315,
    items: ['Pelbagaikan servis', 'eSyms · FPL · IDTF', 'Tambah lokar ubat'],
    bx: 9.45, by: 4.85, align: 'left' },
  { key: 'CHECK', word: 'Semak', color: AMBER, mid: 225,
    items: ['VAS% naik ke 54.3%', 'Kajian penolakan VAS', 'Kelemahan dikenal pasti'],
    bx: 0.30, by: 4.85, align: 'right' },
  { key: 'ACT', word: 'Tindak', color: DEEP, mid: 135,
    items: ['Kekalkan promosi & servis sedia ada', 'Projek inovasi servis baharu',
            'Borang pengesahan penolakan'],
    bx: 0.30, by: 1.05, align: 'right' },
];

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Unit Farmasi Pesakit Luar, HSIS';
pres.title = 'Kitaran PDCA — Peningkatan VAS%';

const s = pres.addSlide();
s.background = { color: WHITE };

s.addText('KITARAN PDCA', {
  x: 0, y: 0.34, w: 13.333, h: 0.45, align: 'center',
  fontFace: HEAD, fontSize: 24, bold: true, color: INK, margin: 0,
});

s.addImage({ path: RING, x: CX - S / 2, y: CY - S / 2, w: S, h: S });

// label fasa, di dalam jalur gelang
PHASES.forEach((p) => {
  const x = px(R_LABEL, p.mid), y = py(R_LABEL, p.mid);
  s.addText(p.key, {
    x: x - 0.8, y: y - 0.31, w: 1.6, h: 0.36, align: 'center', valign: 'middle',
    fontFace: HEAD, fontSize: 18, bold: true, color: WHITE, margin: 0,
  });
  s.addText(p.word, {
    x: x - 0.8, y: y + 0.07, w: 1.6, h: 0.28, align: 'center', valign: 'middle',
    fontFace: SANS, fontSize: 11, color: WHITE, margin: 0,
  });
});

// tujuan utama, di atas cakera tengah
const centre = [
  ['MENINGKATKAN', 3.24, 0.26, SANS, 12, true, MINT],
  ['VAS%', 3.51, 0.64, HEAD, 36, true, WHITE],
  ['36.8%  →  65%', 4.16, 0.36, SANS, 16, true, SEA],
  ['sasaran hospital', 4.54, 0.28, SANS, 11, false, MUTED],
];
centre.forEach(([txt, y, h, face, size, bold, color]) => {
  s.addText(txt, {
    x: CX - 1.0, y, w: 2.0, h, align: 'center', valign: 'middle',
    fontFace: face, fontSize: size, bold, color, margin: 0,
    charSpacing: txt === 'MENINGKATKAN' ? 1 : 0,
  });
});

// blok butiran + palang warna
PHASES.forEach((p) => {
  const w = 3.6, h = 1.5;
  s.addText(p.items.join('\n'), {
    x: p.bx, y: p.by, w, h, align: p.align, valign: 'middle',
    fontFace: SANS, fontSize: 14, color: BODY, margin: 0, lineSpacing: 30,
  });
  const barX = p.align === 'left' ? p.bx - 0.16 : p.bx + w + 0.11;
  s.addShape(pres.ShapeType.roundRect, {
    x: barX, y: p.by + 0.22, w: 0.05, h: h - 0.44, rectRadius: 0.025,
    fill: { color: p.color }, line: { type: 'none' },
  });
});

s.addText('Farmasi Klinik Pesakit Luar, HSIS  ·  Okt 2025 – Jun 2026', {
  x: 0, y: 6.82, w: 13.333, h: 0.32, align: 'center',
  fontFace: SANS, fontSize: 11, color: MUTED, margin: 0,
});

pres.writeFile({ fileName: OUT }).then(() => console.log('Ditulis:', OUT));
