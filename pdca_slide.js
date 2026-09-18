/* Rajah PDCA sebagai satu slaid boleh sunting (bentuk asli, bukan imej).
 * Setiap segmen ialah bentuk "pie", mata panah ialah segi tiga, dan semua
 * teks ialah kotak teks — boleh diedit terus dalam Google Slides / PowerPoint.
 * pptxgenjs menulis <a:avLst/> kosong untuk bentuk pie, jadi setiap segmen
 * menjadi bulatan penuh. Selepas fail ditulis, skrip ini membuka semula zip
 * pptx dan menyuntik sudut mula/tamat setiap pie — satu sumber sudut sahaja.
 */
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const JSZip = require('jszip');
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

const CX = 6.667, CY = 4.0;            // pusat kitaran
const R_OUT = 2.30, R_GAP = 1.10, R_CENTRE = 0.95;
const R_MID = (R_GAP + R_OUT) / 2;
const HEADLEN = 12;                    // darjah, anjakan mata panah
const R_LABEL = (1.10 + 2.30) / 2 + 0.05;   // jejari label fasa

const rad = (d) => (d * Math.PI) / 180;
const px = (r, a) => CX + r * Math.cos(rad(a));
const py = (r, a) => CY - r * Math.sin(rad(a));   // y slaid ke bawah

// a1 = hujung arah jam (tempat mata panah), a2 = pangkal. Sudut matematik.
const PHASES = [
  { key: 'PLAN', word: 'Rancang', color: TEAL, a1: 10, a2: 80,
    items: ['Asas 36.8%', 'Sasaran 65%', 'Hipotesis: terlalu bergantung UMP'],
    bx: 9.25, by: 1.05, align: 'left' },
  { key: 'DO', word: 'Laksana', color: SEA, a1: 280, a2: 350,
    items: ['Pelbagaikan servis', 'eSyms · FPL · IDTF', 'Tambah lokar ubat'],
    bx: 9.25, by: 4.85, align: 'left' },
  { key: 'CHECK', word: 'Semak', color: AMBER, a1: 190, a2: 260,
    items: ['VAS% naik ke 54.3%', 'Kajian penolakan VAS', 'Kelemahan dikenal pasti'],
    bx: 0.35, by: 4.85, align: 'right' },
  { key: 'ACT', word: 'Tindak', color: DEEP, a1: 100, a2: 170,
    items: ['Kekalkan promosi & servis sedia ada', 'Projek inovasi servis baharu',
            'Borang pengesahan penolakan'],
    bx: 0.35, by: 1.05, align: 'right' },
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

// --- segmen pie (sudut disuntik kemudian, ikut susunan penambahan) ---
PHASES.forEach((p) => {
  s.addShape(pres.ShapeType.pie, {
    x: CX - R_OUT, y: CY - R_OUT, w: R_OUT * 2, h: R_OUT * 2,
    fill: { color: p.color }, line: { type: 'none' },
  });
});

// --- lubang tengah + cakera tujuan ---
s.addShape(pres.ShapeType.ellipse, {
  x: CX - R_GAP, y: CY - R_GAP, w: R_GAP * 2, h: R_GAP * 2,
  fill: { color: WHITE }, line: { type: 'none' },
});
s.addShape(pres.ShapeType.ellipse, {
  x: CX - R_CENTRE, y: CY - R_CENTRE, w: R_CENTRE * 2, h: R_CENTRE * 2,
  fill: { color: DEEP }, line: { type: 'none' },
});

// --- mata panah ---
PHASES.forEach((p) => {
  const a = p.a1 - HEADLEN / 2;
  const w = 0.86, h = 0.6;
  s.addShape(pres.ShapeType.triangle, {
    x: px(R_MID, a) - w / 2, y: py(R_MID, a) - h / 2, w, h,
    fill: { color: p.color }, line: { type: 'none' }, rotate: (180 - a + 360) % 360,
  });
});

// --- label fasa di dalam gelang ---
PHASES.forEach((p) => {
  const a = (p.a1 + p.a2) / 2;
  const x = px(R_LABEL, a), y = py(R_LABEL, a);
  s.addText(p.key, {
    x: x - 0.75, y: y - 0.39, w: 1.5, h: 0.46, align: 'center', valign: 'middle',
    fontFace: HEAD, fontSize: 20, bold: true, color: WHITE, margin: 0,
  });
  s.addText(p.word, {
    x: x - 0.75, y: y + 0.08, w: 1.5, h: 0.34, align: 'center', valign: 'middle',
    fontFace: SANS, fontSize: 12, color: WHITE, margin: 0,
  });
});

// --- teks tengah: tujuan utama ---
s.addText('MENINGKATKAN', {
  x: CX - 1.0, y: CY - 0.78, w: 2.0, h: 0.3, align: 'center', valign: 'middle',
  fontFace: SANS, fontSize: 12, bold: true, color: MINT, charSpacing: 1, margin: 0,
});
s.addText('VAS%', {
  x: CX - 1.0, y: CY - 0.52, w: 2.0, h: 0.66, align: 'center', valign: 'middle',
  fontFace: HEAD, fontSize: 36, bold: true, color: WHITE, margin: 0,
});
s.addText('36.8%  →  65%', {
  x: CX - 1.0, y: CY + 0.14, w: 2.0, h: 0.36, align: 'center', valign: 'middle',
  fontFace: SANS, fontSize: 16, bold: true, color: SEA, margin: 0,
});
s.addText('sasaran hospital', {
  x: CX - 1.0, y: CY + 0.48, w: 2.0, h: 0.28, align: 'center', valign: 'middle',
  fontFace: SANS, fontSize: 11, color: MUTED, margin: 0,
});

// --- blok butiran + palang warna ---
PHASES.forEach((p) => {
  const w = 3.75, h = 1.5;
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

// Sudut DrawingML diukur ikut arah jam dari pukul 3 (paksi-y ke bawah),
// jadi sudut matematik a dipetakan kepada 360 - a.
const EMPTY = '<a:prstGeom prst="pie"><a:avLst></a:avLst></a:prstGeom>';
const avLst = (start, end) =>
  '<a:prstGeom prst="pie"><a:avLst>' +
  `<a:gd name="adj1" fmla="val ${Math.round(start * 60000)}"/>` +
  `<a:gd name="adj2" fmla="val ${Math.round(end * 60000)}"/>` +
  '</a:avLst></a:prstGeom>';

pres.writeFile({ fileName: OUT })
  .then(() => JSZip.loadAsync(fs.readFileSync(OUT)))
  .then(async (zip) => {
    const path = 'ppt/slides/slide1.xml';
    let xml = await zip.file(path).async('string');
    const found = xml.split(EMPTY).length - 1;
    if (found !== PHASES.length) {
      throw new Error(`Dijangka ${PHASES.length} pie kosong, jumpa ${found}`);
    }
    PHASES.forEach((p) => {
      xml = xml.replace(EMPTY, avLst(360 - p.a2, 360 - p.a1));
    });
    zip.file(path, xml);
    const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    fs.writeFileSync(OUT, buf);
    console.log('Ditulis:', OUT);
    console.log('Sudut pie:', PHASES.map((p) => `${p.key} ${360 - p.a2}-${360 - p.a1}`).join(', '));
  });
