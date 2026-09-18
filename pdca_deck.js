const pptxgen = require('pptxgenjs');
const OUT = '/home/user/Reject-VAS/output/PDCA_Peningkatan_VAS_HSIS.pptx';

// Teal Trust — palet sama seperti deck penolakan VAS & preskripsi susulan
const DEEP = '083F49';
const TEAL = '028090';
const SEA = '00A896';
const MINT = '9AD9DA';
const AMBER = 'E08A3C';
const INK = '10262B';
const BODY = '3E5A61';
const MUTED = '7C9198';
const CARD = 'F1F7F8';
const WHITE = 'FFFFFF';

const HEAD = 'Cambria';
const SANS = 'Calibri';

const PHASE = { P: TEAL, D: SEA, C: AMBER, A: DEEP };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Unit Farmasi Pesakit Luar, HSIS';
pres.title = 'Pusingan PDCA — Peningkatan Peratus VAS';

function slideHead(s, phase, label, title, kicker) {
  const tone = PHASE[phase];
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 0.36, w: 1.62, h: 0.72, rectRadius: 0.1, fill: { color: tone },
  });
  s.addText(phase, {
    x: 0.72, y: 0.36, w: 0.4, h: 0.72, align: 'center', valign: 'middle',
    fontFace: HEAD, fontSize: 28, bold: true, color: WHITE, margin: 0,
  });
  s.addText(label, {
    x: 1.12, y: 0.36, w: 1.02, h: 0.72, align: 'left', valign: 'middle',
    fontFace: SANS, fontSize: 11, bold: true, color: 'CDECEC', charSpacing: 1, margin: 0,
  });
  s.addText(title, {
    x: 2.45, y: 0.28, w: 10.3, h: 0.56, fontFace: HEAD, fontSize: 26, bold: true,
    color: INK, margin: 0, valign: 'middle',
  });
  if (kicker) {
    s.addText(kicker, {
      x: 2.45, y: 0.86, w: 10.3, h: 0.32, fontFace: SANS, fontSize: 13,
      color: MUTED, margin: 0, valign: 'middle',
    });
  }
}

function card(s, o) {
  s.addShape(pres.ShapeType.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.09,
    fill: { color: o.fill || CARD },
    line: { color: o.line || (o.fill ? o.fill : 'DCE9EB'), width: 1 },
  });
}

function footer(s, txt) {
  s.addText(txt, {
    x: 0.6, y: 6.94, w: 12.1, h: 0.28, fontFace: SANS, fontSize: 10, color: MUTED, margin: 0,
  });
}

const chartFrame = {
  showLegend: false,
  catAxisLabelColor: BODY, catAxisLabelFontFace: SANS, catAxisLabelFontSize: 12,
  valAxisLabelColor: MUTED, valAxisLabelFontFace: SANS, valAxisLabelFontSize: 11,
  catGridLine: { style: 'none' },
  valGridLine: { color: 'E3EDEF', size: 1 },
  catAxisLineShow: false, valAxisLineShow: false,
  showValue: true,
  dataLabelColor: BODY, dataLabelFontFace: SANS, dataLabelFontSize: 12, dataLabelFontBold: true,
  chartColors: [TEAL],
};

const QS = ['Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];

// ================================================================ 1 — tajuk
{
  const s = pres.addSlide();
  s.background = { color: DEEP };

  s.addText('KITARAN PENAMBAHBAIKAN KUALITI  •  PLAN – DO – CHECK – ACT', {
    x: 0.9, y: 0.82, w: 11.5, h: 0.34, fontFace: SANS, fontSize: 13, bold: true,
    color: SEA, charSpacing: 2.5, margin: 0,
  });
  s.addText('Meningkatkan peratus VAS', {
    x: 0.9, y: 1.2, w: 11.5, h: 0.8, fontFace: HEAD, fontSize: 40, bold: true,
    color: WHITE, margin: 0,
  });
  s.addText('daripada 40.8% kepada sasaran 65%', {
    x: 0.9, y: 1.98, w: 11.5, h: 0.8, fontFace: HEAD, fontSize: 40, bold: true,
    color: SEA, margin: 0,
  });
  s.addText('Farmasi Klinik Pesakit Luar, Hospital Sultan Idris Shah  •  Pusingan 1: Q2 2025 – Q2 2026  •  MB + PJ', {
    x: 0.9, y: 2.9, w: 11.5, h: 0.34, fontFace: SANS, fontSize: 14, color: 'A9C6CB', margin: 0,
  });

  const stats = [
    { n: '55.35%', l: 'VAS% gabungan Q2 2026\n(asas Q2 2025: 40.82%)', hl: true },
    { n: '+14.53', l: 'mata peratus dicapai\ndalam empat suku tahun' },
    { n: '9.65', l: 'mata lagi ke sasaran 65%\n= +3,957 Rx VAS sesuku' },
  ];
  stats.forEach((st, i) => {
    const x = 0.9 + i * 3.93;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 3.85, w: 3.55, h: 2.25, rectRadius: 0.1,
      fill: { color: st.hl ? TEAL : '0F5563' }, line: { color: '17697A', width: 1 },
    });
    s.addText(st.n, {
      x: x + 0.3, y: 4.05, w: 2.95, h: 0.95, fontFace: HEAD, fontSize: 44, bold: true,
      color: st.hl ? WHITE : SEA, margin: 0, valign: 'middle',
    });
    s.addText(st.l, {
      x: x + 0.3, y: 5.05, w: 2.95, h: 0.85, fontFace: SANS, fontSize: 13,
      color: st.hl ? 'DFF1F3' : 'A9C6CB', margin: 0, lineSpacing: 17,
    });
  });

  s.addText('Sumber: data bulanan Rx Ulangan & VAS mengikut servis; borang maklum balas pesakit menolak VAS (16 Jul – 13 Ogos 2026, n=84)', {
    x: 0.9, y: 6.5, w: 11.5, h: 0.3, fontFace: SANS, fontSize: 11, color: '6E9AA3', margin: 0,
  });
  s.addNotes('Deck ini menyusun usaha kami sebagai satu pusingan PDCA lengkap dan menetapkan pusingan kedua untuk menutup jurang 9.65 mata ke sasaran 65% yang ditetapkan Pengurusan Hospital.');
}

// ================================================================ 2 — gambaran kitaran
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 'P', 'DO CHECK ACT', 'Satu pusingan penuh, diringkaskan',
    'Apa yang dirancang, dilaksana, disemak dan diputuskan sepanjang Q2 2025 – Q2 2026');

  const quads = [
    {
      x: 0.6, y: 1.45, tone: TEAL, k: 'PLAN', t: 'Rancang',
      lines: [
        'VAS% asas 40.82% (Q2 2025) jauh di bawah sasaran 65%',
        'Punca hipotesis: saluran terlalu bergantung pada UMP (93.5%)',
        'Sasaran SMART ditetapkan mengikut lokasi, bukan agregat',
      ],
    },
    {
      x: 6.85, y: 1.45, tone: SEA, k: 'DO', t: 'Laksana',
      lines: [
        'Pelbagaikan saluran: eSyms, IDTF, Locker, Farmasi Pandu Lalu',
        'Promosi di kaunter + risalah pesakit (pokok keputusan)',
        'Borang maklum balas penolakan diperkenalkan Julai 2026',
      ],
    },
    {
      x: 0.6, y: 4.15, tone: AMBER, k: 'CHECK', t: 'Semak',
      lines: [
        'VAS% naik ke 55.35% — +14.53 mata',
        'MB pertumbuhan tulen (+98.3% volum); PJ sebahagian besar kesan penyebut',
        '84 penolakan direkod: 81% kerana tabiat, bukan kegagalan sistem',
      ],
    },
    {
      x: 6.85, y: 4.15, tone: DEEP, k: 'ACT', t: 'Tindak',
      lines: [
        'Kekalkan & piawaikan Pandu Lalu dan promosi kaunter',
        'Ubah: sasarkan warga emas, waris dan padanan bekalan dengan TCA',
        'Pusingan 2 (Q3 – Q4 2026): fokus MB, sasaran 65%',
      ],
    },
  ];

  quads.forEach((q) => {
    card(s, { x: q.x, y: q.y, w: 5.85, h: 2.5 });
    s.addShape(pres.ShapeType.rect, { x: q.x, y: q.y, w: 5.85, h: 0.07, fill: { color: q.tone } });
    s.addText([
      { text: q.k, options: { fontFace: SANS, fontSize: 12, bold: true, color: q.tone, charSpacing: 1.6 } },
      { text: '   ' + q.t, options: { fontFace: HEAD, fontSize: 17, bold: true, color: INK } },
    ], { x: q.x + 0.3, y: q.y + 0.2, w: 5.25, h: 0.38, margin: 0, valign: 'middle' });
    q.lines.forEach((ln, i) => {
      s.addText(ln, {
        x: q.x + 0.3, y: q.y + 0.72 + i * 0.56, w: 5.25, h: 0.52, fontFace: SANS, fontSize: 12.5,
        color: BODY, margin: 0, valign: 'middle', bullet: { characterCode: '25AA' }, lineSpacing: 16,
      });
    });
  });

  footer(s, 'Pusingan 1 dilaporkan di sini; pusingan 2 dicadangkan pada slaid akhir.');
  s.addNotes('Slaid pandangan keseluruhan — setiap kuadran dihuraikan pada slaid berikutnya.');
}

// ================================================================ 3 — PLAN
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 'P', 'PLAN', 'Pernyataan masalah dan sasaran',
    'Asas Q2 2025 dan jurang sebenar yang perlu ditutup');

  card(s, { x: 0.6, y: 1.4, w: 5.85, h: 2.35, fill: DEEP, line: DEEP });
  s.addText('PERNYATAAN MASALAH', {
    x: 0.9, y: 1.6, w: 5.25, h: 0.3, fontFace: SANS, fontSize: 11.5, bold: true,
    color: SEA, charSpacing: 1.4, margin: 0,
  });
  s.addText('Pada Q2 2025, hanya 18,701 daripada 45,808 preskripsi susulan (40.82%) disalurkan melalui VAS. Bakinya 27,107 preskripsi kekal diambil di kaunter — menambah kesesakan, masa menunggu dan beban kerja FKP.', {
    x: 0.9, y: 1.98, w: 5.25, h: 1.6, fontFace: SANS, fontSize: 14, color: 'DFF1F3',
    margin: 0, lineSpacing: 20,
  });

  card(s, { x: 6.85, y: 1.4, w: 5.85, h: 2.35 });
  s.addText('OBJEKTIF (SMART)', {
    x: 7.15, y: 1.6, w: 5.25, h: 0.3, fontFace: SANS, fontSize: 11.5, bold: true,
    color: TEAL, charSpacing: 1.4, margin: 0,
  });
  s.addText([
    { text: 'Meningkatkan peratus preskripsi susulan yang disalurkan melalui VAS daripada ', options: { fontFace: SANS, fontSize: 14, color: BODY } },
    { text: '40.82% (Q2 2025) ', options: { fontFace: SANS, fontSize: 14, bold: true, color: INK } },
    { text: 'kepada ', options: { fontFace: SANS, fontSize: 14, color: BODY } },
    { text: '65% ', options: { fontFace: SANS, fontSize: 14, bold: true, color: TEAL } },
    { text: 'bagi kedua-dua lokasi MB dan PJ, diukur setiap suku tahun daripada data bulanan Rx Ulangan.', options: { fontFace: SANS, fontSize: 14, color: BODY } },
  ], { x: 7.15, y: 1.98, w: 5.25, h: 1.6, margin: 0, lineSpacing: 20 });

  const base = [
    { k: 'MB', d: '19,200', v: '4,194', p: '21.84%', gap: 'jurang 43.2 mata', tone: AMBER },
    { k: 'PJ', d: '26,608', v: '14,507', p: '54.52%', gap: 'jurang 10.5 mata', tone: TEAL },
    { k: 'GABUNGAN', d: '45,808', v: '18,701', p: '40.82%', gap: 'jurang 24.2 mata', tone: DEEP },
  ];
  s.addText('ASAS Q2 2025 MENGIKUT LOKASI', {
    x: 0.6, y: 3.95, w: 6, h: 0.3, fontFace: SANS, fontSize: 11.5, bold: true,
    color: MUTED, charSpacing: 1.4, margin: 0,
  });
  base.forEach((b, i) => {
    const y = 4.35 + i * 0.85;
    card(s, { x: 0.6, y, w: 12.1, h: 0.72 });
    s.addText(b.k, {
      x: 0.9, y, w: 2.0, h: 0.72, fontFace: SANS, fontSize: 14, bold: true, color: b.tone,
      margin: 0, valign: 'middle',
    });
    s.addText(`Preskripsi susulan  ${b.d}`, {
      x: 2.9, y, w: 3.2, h: 0.72, fontFace: SANS, fontSize: 13, color: BODY, margin: 0, valign: 'middle',
    });
    s.addText(`Melalui VAS  ${b.v}`, {
      x: 6.1, y, w: 2.8, h: 0.72, fontFace: SANS, fontSize: 13, color: BODY, margin: 0, valign: 'middle',
    });
    s.addText(b.p, {
      x: 8.9, y, w: 1.6, h: 0.72, fontFace: HEAD, fontSize: 20, bold: true, color: INK,
      margin: 0, valign: 'middle', align: 'right',
    });
    s.addText(b.gap, {
      x: 10.6, y, w: 1.85, h: 0.72, fontFace: SANS, fontSize: 12.5, color: b.tone,
      margin: 0, valign: 'middle', align: 'right',
    });
  });

  footer(s, 'Sasaran 65% ditetapkan oleh Pengurusan Hospital sebagai sasaran semasa.');
  s.addNotes('Jurang sebenar terletak di MB. PJ sudah hampir dengan sasaran pada peringkat asas lagi.');
}

// ================================================================ 4 — PLAN punca
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 'P', 'PLAN', 'Punca yang dikenal pasti dan strategi tindakan',
    'Empat punca utama, setiap satu dipadankan dengan satu intervensi');

  const rows = [
    {
      c: 'Saluran terlalu sempit', d: 'Q2 2025: 93.5% VAS melalui UMP sahaja. Pesakit yang tidak selesa dengan pos tiada pilihan lain.',
      a: 'Buka saluran alternatif: eSyms, IDTF, Locker dan Farmasi Pandu Lalu.',
    },
    {
      c: 'Kesedaran pesakit rendah', d: 'Pesakit tidak tahu VAS wujud atau bagaimana mendaftar; penerangan bergantung sepenuhnya pada masa kaunter.',
      a: 'Risalah pesakit (pokok keputusan) + promosi berstruktur semasa menunggu.',
    },
    {
      c: 'Halangan digital', d: 'Pendaftaran memerlukan telefon pintar dan aplikasi — menyukarkan warga emas dan OKU.',
      a: 'Bantuan pendaftaran di kaunter; laluan tanpa telefon pintar melalui waris.',
    },
    {
      c: 'Tiada data suara pesakit', d: 'Sebab sebenar penolakan tidak pernah direkod, jadi intervensi dibuat atas andaian.',
      a: 'Borang maklum balas penolakan VAS diperkenalkan di FKP (Julai 2026).',
    },
  ];

  s.addText('PUNCA', { x: 0.85, y: 1.42, w: 3.2, h: 0.3, fontFace: SANS, fontSize: 11, bold: true, color: MUTED, charSpacing: 1.4, margin: 0 });
  s.addText('BUKTI / HURAIAN', { x: 4.3, y: 1.42, w: 4.4, h: 0.3, fontFace: SANS, fontSize: 11, bold: true, color: MUTED, charSpacing: 1.4, margin: 0 });
  s.addText('STRATEGI TINDAKAN', { x: 8.95, y: 1.42, w: 3.6, h: 0.3, fontFace: SANS, fontSize: 11, bold: true, color: MUTED, charSpacing: 1.4, margin: 0 });

  rows.forEach((r, i) => {
    const y = 1.8 + i * 1.26;
    card(s, { x: 0.6, y, w: 12.1, h: 1.12 });
    s.addShape(pres.ShapeType.rect, { x: 0.6, y, w: 0.07, h: 1.12, fill: { color: TEAL } });
    s.addText(r.c, {
      x: 0.85, y, w: 3.3, h: 1.12, fontFace: SANS, fontSize: 14, bold: true, color: INK,
      margin: 0, valign: 'middle', lineSpacing: 18,
    });
    s.addText(r.d, {
      x: 4.3, y, w: 4.5, h: 1.12, fontFace: SANS, fontSize: 12.5, color: BODY,
      margin: 0, valign: 'middle', lineSpacing: 17,
    });
    s.addText(r.a, {
      x: 8.95, y, w: 3.65, h: 1.12, fontFace: SANS, fontSize: 12.5, color: TEAL,
      margin: 0, valign: 'middle', lineSpacing: 17,
    });
  });

  footer(s, 'Punca ke-4 adalah pembetulan kaedah: pusingan pertama bermula tanpa data punca sebenar.');
  s.addNotes('Akui secara terbuka: tiga intervensi pertama dirancang atas hipotesis. Data suara pesakit hanya diperoleh pada penghujung pusingan dan kini memacu pusingan kedua.');
}

// ================================================================ 5 — DO
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 'D', 'DO', 'Apa yang benar-benar dilaksanakan, dan bila',
    'Tarikh pengenalan dikesan daripada rekod transaksi bulanan mengikut servis');

  const tl = [
    { m: 'Apr 2025', t: 'eSyms dibuka', d: 'Transaksi pertama di MB (29 Rx). Saluran e-dagang farmasi.' },
    { m: 'Jun 2025', t: 'IDTF bermula', d: 'Pengambilan di fasiliti kesihatan berdekatan rumah pesakit.' },
    { m: 'Sep 2025', t: 'Farmasi Pandu Lalu dilancarkan', d: '7 Rx di MB dan PJ pada bulan pertama — perintis.' },
    { m: 'Nov–Dis 2025', t: 'Pandu Lalu ditingkatkan', d: 'Melonjak ke 359 lalu 940 Rx sebulan; Locker turut dikembangkan.' },
    { m: 'Jul 2026', t: 'Borang maklum balas penolakan', d: 'Setiap penolakan VAS di FKP direkod bersama sebab dan demografi.' },
    { m: 'Ogos 2026', t: 'Risalah pesakit diedarkan', d: 'Risalah pokok keputusan A4 dua muka, BM, dengan kod QR MyUBAT.' },
  ];

  tl.forEach((e, i) => {
    const y = 1.45 + i * 0.88;
    s.addShape(pres.ShapeType.ellipse, { x: 2.52, y: y + 0.26, w: 0.2, h: 0.2, fill: { color: SEA } });
    if (i < tl.length - 1) {
      s.addShape(pres.ShapeType.line, {
        x: 2.62, y: y + 0.46, w: 0, h: 0.68, line: { color: 'CFE4E6', width: 2 },
      });
    }
    s.addText(e.m, {
      x: 0.6, y, w: 1.8, h: 0.72, fontFace: SANS, fontSize: 13, bold: true, color: MUTED,
      align: 'right', margin: 0, valign: 'middle',
    });
    card(s, { x: 2.95, y, w: 9.75, h: 0.72 });
    s.addText(e.t, {
      x: 3.2, y, w: 3.5, h: 0.72, fontFace: SANS, fontSize: 14, bold: true, color: INK,
      margin: 0, valign: 'middle',
    });
    s.addText(e.d, {
      x: 6.8, y, w: 5.7, h: 0.72, fontFace: SANS, fontSize: 12.5, color: BODY,
      margin: 0, valign: 'middle',
    });
  });

  footer(s, 'Semua intervensi dijalankan serentak dengan operasi biasa, tanpa penambahan perjawatan.');
  s.addNotes('Susunan ini penting: pertumbuhan VAS% yang paling ketara (Q4 2025 – Q1 2026) berlaku selepas Pandu Lalu ditingkatkan.');
}

// ================================================================ 6 — CHECK hasil
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 'C', 'CHECK', 'Hasil: VAS% naik 14.5 mata, sasaran belum dicapai',
    'VAS% gabungan mengikut suku tahun berbanding sasaran 65%');

  s.addChart([
    {
      type: pres.ChartType.bar,
      data: [{ name: 'VAS%', labels: QS, values: [40.82, 37.17, 44.14, 59.97, 55.35] }],
      options: { barDir: 'col', barGapWidthPct: 50, chartColors: [MINT, MINT, MINT, TEAL, TEAL], varyColors: true, dataLabelPosition: 'outEnd' },
    },
    {
      type: pres.ChartType.line,
      data: [{ name: 'Sasaran 65%', labels: QS, values: [65, 65, 65, 65, 65] }],
      options: { chartColors: [AMBER], lineSize: 2, lineDash: 'dash', showValue: false, lineDataSymbol: 'none' },
    },
  ], {
    x: 0.55, y: 1.45, w: 8.0, h: 3.5,
    ...chartFrame,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 78,
  });
  s.addText('Garis putus-putus jingga = sasaran 65%.  Kejatuhan Q3 2025 berlaku sebelum Pandu Lalu dilancarkan.', {
    x: 0.55, y: 4.98, w: 8.0, h: 0.3, fontFace: SANS, fontSize: 11, color: MUTED, margin: 0,
  });

  const kp = [
    { n: '40.82% → 55.35%', l: 'VAS% gabungan, Q2 2025 → Q2 2026', tone: SEA },
    { n: '+4,004', l: 'preskripsi tambahan melalui VAS sesuku', tone: SEA },
    { n: '−8,794', l: 'preskripsi Bukan VAS di kaunter — beban FKP turun', tone: SEA },
  ];
  kp.forEach((k, i) => {
    const y = 1.45 + i * 1.2;
    card(s, { x: 8.85, y, w: 3.85, h: 1.05, fill: DEEP, line: DEEP });
    s.addText(k.n, {
      x: 9.1, y: y + 0.08, w: 3.35, h: 0.5, fontFace: HEAD, fontSize: 21, bold: true,
      color: k.tone, margin: 0, valign: 'middle',
    });
    s.addText(k.l, {
      x: 9.1, y: y + 0.56, w: 3.35, h: 0.42, fontFace: SANS, fontSize: 12, color: 'DFF1F3',
      margin: 0, valign: 'middle', lineSpacing: 15,
    });
  });

  card(s, { x: 0.55, y: 5.42, w: 12.15, h: 1.3, fill: CARD, line: AMBER });
  s.addText([
    { text: 'Status berbanding sasaran:  ', options: { fontFace: SANS, fontSize: 15, bold: true, color: AMBER } },
    { text: 'PJ sudah melepasi sasaran (66.70%). MB pada 42.76% masih 22.2 mata di bawah. Secara gabungan kami 9.65 mata di bawah 65% — bersamaan 3,957 preskripsi VAS tambahan setiap suku, atau lebih kurang 1,319 sebulan.',
      options: { fontFace: SANS, fontSize: 14, color: BODY } },
  ], { x: 0.85, y: 5.58, w: 11.55, h: 1.0, margin: 0, valign: 'middle', lineSpacing: 19 });

  footer(s, 'VAS% = Rx Ulangan melalui VAS ÷ jumlah Rx Ulangan, mengikut suku tahun.');
  s.addNotes('Mesej jujur: kemajuan besar, sasaran belum dicapai, dan jurang itu hampir keseluruhannya di MB.');
}

// ================================================================ 7 — CHECK saluran
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 'C', 'CHECK', 'Kepelbagaian saluran berkesan — tetapi belum seimbang',
    'Pecahan VAS mengikut servis, Q2 2025 → Q2 2026 (gabungan MB + PJ)');

  s.addChart(pres.ChartType.bar, [
    { name: 'Q2 2025', labels: ['UMP', 'Pandu Lalu', 'Locker', 'eSyms', 'IDTF'], values: [17491, 0, 385, 512, 7] },
    { name: 'Q2 2026', labels: ['UMP', 'Pandu Lalu', 'Locker', 'eSyms', 'IDTF'], values: [17827, 3428, 894, 414, 142] },
  ], {
    x: 0.55, y: 1.45, w: 7.7, h: 3.9,
    barDir: 'col', barGapWidthPct: 40,
    ...chartFrame,
    chartColors: [MINT, TEAL],
    showLegend: true, legendPos: 't', legendColor: BODY, legendFontFace: SANS, legendFontSize: 12,
    dataLabelPosition: 'outEnd', dataLabelFontSize: 10,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 21000,
  });

  const notes = [
    { t: 'Pandu Lalu: 0 → 3,428', d: 'Daripada tiada kepada 15.1% jumlah VAS dalam tempoh 10 bulan — penyumbang tunggal terbesar kepada pertumbuhan.', tone: SEA },
    { t: 'UMP: 93.5% → 78.5%', d: 'Kebergantungan berkurang, namun volum mutlak hampir mendatar (+336 sahaja).', tone: TEAL },
    { t: 'eSyms menyusut', d: '512 → 414. Saluran ini tidak mendapat tempat dan perlu dinilai semula.', tone: AMBER },
  ];
  notes.forEach((n, i) => {
    const y = 1.45 + i * 1.34;
    card(s, { x: 8.55, y, w: 4.15, h: 1.2 });
    s.addShape(pres.ShapeType.rect, { x: 8.55, y, w: 4.15, h: 0.06, fill: { color: n.tone } });
    s.addText(n.t, {
      x: 8.8, y: y + 0.14, w: 3.65, h: 0.34, fontFace: SANS, fontSize: 13.5, bold: true,
      color: INK, margin: 0, valign: 'middle',
    });
    s.addText(n.d, {
      x: 8.8, y: y + 0.48, w: 3.65, h: 0.66, fontFace: SANS, fontSize: 12, color: BODY,
      margin: 0, lineSpacing: 15,
    });
  });

  card(s, { x: 0.55, y: 5.55, w: 12.15, h: 1.15, fill: DEEP, line: DEEP });
  s.addText([
    { text: 'Risiko:  ', options: { fontFace: SANS, fontSize: 15, bold: true, color: AMBER } },
    { text: 'keseluruhan pertumbuhan bergantung pada satu servis baharu. Jika Pandu Lalu tergendala (cuaca, perjawatan, ruang letak kereta), VAS% akan jatuh semula ke paras 2025 dalam satu suku tahun.',
      options: { fontFace: SANS, fontSize: 14, color: WHITE } },
  ], { x: 0.85, y: 5.7, w: 11.55, h: 0.85, margin: 0, valign: 'middle', lineSpacing: 19 });

  footer(s, 'Nilai Q2 2025 bagi Pandu Lalu ialah sifar kerana servis belum wujud.');
  s.addNotes('Kepelbagaian ialah kejayaan sebenar pusingan ini, tetapi kepekatan risiko pada Pandu Lalu perlu diurus dalam pusingan 2.');
}

// ================================================================ 8 — CHECK kritikal
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 'C', 'CHECK', 'Berapa banyak kenaikan ini benar-benar kami peroleh?',
    'Penguraian perubahan VAS% kepada kesan pengangka (volum VAS) dan kesan penyebut (bil preskripsi susulan)');

  const cols = [
    {
      x: 0.6, tone: TEAL, tag: 'MB — PERTUMBUHAN TULEN',
      pct: '21.84% → 42.76%', delta: '+20.92 mata',
      rows: [['Volum VAS', '4,194 → 8,315', '+98.3%'], ['Penyebut', '19,200 → 19,445', '+1.3%'],
             ['Kesan pengangka', '', '+21.46 mata'], ['Kesan penyebut', '', '−0.55 mata']],
      note: 'Volum VAS berganda pada asas pesakit yang hampir tidak berubah. Intervensi berkesan.',
    },
    {
      x: 6.85, tone: AMBER, tag: 'PJ — SEBAHAGIAN BESAR ARITMETIK',
      pct: '54.52% → 66.70%', delta: '+12.18 mata',
      rows: [['Volum VAS', '14,507 → 14,390', '−0.8%'], ['Penyebut', '26,608 → 21,573', '−18.9%'],
             ['Kesan pengangka', '', '−0.44 mata'], ['Kesan penyebut', '', '+12.62 mata']],
      note: '97% kenaikan datang daripada penyebut yang mengecil. Volum VAS sebenarnya menurun sedikit.',
    },
  ];

  cols.forEach((c) => {
    card(s, { x: c.x, y: 1.4, w: 5.85, h: 3.75 });
    s.addShape(pres.ShapeType.rect, { x: c.x, y: 1.4, w: 5.85, h: 0.07, fill: { color: c.tone } });
    s.addText(c.tag, {
      x: c.x + 0.3, y: 1.6, w: 5.25, h: 0.32, fontFace: SANS, fontSize: 12, bold: true,
      color: c.tone, charSpacing: 1.2, margin: 0, valign: 'middle',
    });
    s.addText([
      { text: c.pct, options: { fontFace: HEAD, fontSize: 24, bold: true, color: INK } },
      { text: '   ' + c.delta, options: { fontFace: SANS, fontSize: 14, bold: true, color: c.tone } },
    ], { x: c.x + 0.3, y: 1.96, w: 5.25, h: 0.55, margin: 0, valign: 'middle' });

    c.rows.forEach((r, i) => {
      const y = 2.62 + i * 0.47;
      const strong = i >= 2;
      s.addText(r[0], {
        x: c.x + 0.3, y, w: 2.35, h: 0.42, fontFace: SANS, fontSize: 13,
        bold: strong, color: strong ? INK : BODY, margin: 0, valign: 'middle',
      });
      s.addText(r[1], {
        x: c.x + 2.7, y, w: 1.5, h: 0.42, fontFace: SANS, fontSize: 12.5, color: MUTED,
        margin: 0, valign: 'middle',
      });
      s.addText(r[2], {
        x: c.x + 4.2, y, w: 1.35, h: 0.42, fontFace: SANS, fontSize: 13, bold: true,
        color: strong ? c.tone : BODY, align: 'right', margin: 0, valign: 'middle',
      });
      if (i === 1) {
        s.addShape(pres.ShapeType.line, { x: c.x + 0.3, y: y + 0.44, w: 5.25, h: 0, line: { color: 'DCE9EB', width: 1 } });
      }
    });

    s.addText(c.note, {
      x: c.x + 0.3, y: 4.5, w: 5.25, h: 0.55, fontFace: SANS, fontSize: 12.5, italic: true,
      color: BODY, margin: 0, lineSpacing: 17,
    });
  });

  card(s, { x: 0.6, y: 5.35, w: 12.1, h: 1.35, fill: DEEP, line: AMBER });
  s.addText([
    { text: 'Ujian kepekaan:  ', options: { fontFace: SANS, fontSize: 15, bold: true, color: SEA } },
    { text: 'jika penyebut kekal pada paras Q2 2025 (45,808), VAS% gabungan Q2 2026 ialah 49.57% dan bukan 55.35%. Bermakna 5.79 daripada 14.53 mata kenaikan datang daripada penyebut yang mengecil. Jurang sebenar ke sasaran 65% lebih besar daripada yang dipaparkan angka agregat.',
      options: { fontFace: SANS, fontSize: 14, color: WHITE } },
  ], { x: 0.9, y: 5.52, w: 11.5, h: 1.0, margin: 0, valign: 'middle', lineSpacing: 19 });

  footer(s, 'Penguraian tepat: Δp = (N₁−N₀)/D₀ + N₁(D₀−D₁)/(D₀·D₁).  Nota data: 8 daripada 36 baris bulanan 2025 (kesemuanya PJ) tidak sepadan antara jumlah servis dan lajur Rx VAS.');
  s.addNotes('Ini bahagian paling penting dalam Check. Melaporkan +14.53 mata tanpa penguraian ini akan mengelirukan Pengurusan.');
}

// ================================================================ 9 — CHECK suara pesakit
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 'C', 'CHECK', 'Mengapa jurang kekal: suara 84 pesakit yang menolak',
    'Borang maklum balas penolakan VAS di FKP, 16 Julai – 13 Ogos 2026');

  s.addChart(pres.ChartType.bar, [{
    name: 'Bilangan sebutan',
    labels: ['Lebih selesa\nkaedah biasa', 'Banyak TCA\nhampir tiap bulan', 'Kurang motivasi\ncuba sistem baharu',
             'Tinggal\nberdekatan', 'Tiada telefon\npintar', 'Penerima tiada\ndi rumah'],
    values: [33, 27, 14, 14, 4, 3],
  }], {
    x: 0.55, y: 1.5, w: 7.7, h: 3.6,
    barDir: 'col', barGapWidthPct: 45,
    ...chartFrame,
    chartColors: [TEAL, TEAL, SEA, SEA, MINT, MINT],
    varyColors: true,
    dataLabelPosition: 'outEnd',
    catAxisLabelFontSize: 10,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 40,
  });
  s.addText('81% penolakan tergolong dalam kategori A — keutamaan dan tabiat peribadi, bukan kegagalan perkhidmatan.', {
    x: 0.55, y: 5.16, w: 7.7, h: 0.3, fontFace: SANS, fontSize: 11, color: MUTED, margin: 0,
  });

  const facts = [
    { n: '55', l: 'daripada 84 pesakit berumur 60 tahun ke atas — penolakan tertumpu pada warga emas' },
    { n: '25%', l: 'diwakili waris, dan 18 daripada 21 waris menolak atas sebab keselesaan' },
    { n: '32%', l: 'menyebut kekerapan TCA — masalah padanan bekalan ubat, bukan masalah VAS' },
    { n: '1.2%', l: 'sahaja menolak kerana bimbang kesilapan ubat — keyakinan bukan isu utama' },
  ];
  facts.forEach((f, i) => {
    const y = 1.5 + i * 1.02;
    card(s, { x: 8.55, y, w: 4.15, h: 0.88 });
    s.addText(f.n, {
      x: 8.8, y, w: 1.05, h: 0.88, fontFace: HEAD, fontSize: 22, bold: true, color: TEAL,
      margin: 0, valign: 'middle',
    });
    s.addText(f.l, {
      x: 9.9, y, w: 2.6, h: 0.88, fontFace: SANS, fontSize: 11.5, color: BODY,
      margin: 0, valign: 'middle', lineSpacing: 14,
    });
  });

  card(s, { x: 0.55, y: 5.6, w: 12.15, h: 1.1, fill: CARD, line: TEAL });
  s.addText([
    { text: 'Implikasi kepada pusingan seterusnya:  ', options: { fontFace: SANS, fontSize: 14.5, bold: true, color: TEAL } },
    { text: 'menambah saluran baharu tidak lagi memberi pulangan besar. Jurang yang tinggal ialah jurang pujukan — menukar tabiat warga emas dan waris, serta menyelaraskan bekalan ubat dengan tarikh TCA.',
      options: { fontFace: SANS, fontSize: 13.5, color: BODY } },
  ], { x: 0.85, y: 5.74, w: 11.55, h: 0.82, margin: 0, valign: 'middle', lineSpacing: 18 });

  footer(s, 'Had kajian: n=84 dalam tempoh 4 minggu di FKP sahaja; bukan sampel rawak dan tidak mewakili semua penolakan sepanjang tahun.');
  s.addNotes('Jawapan berbilang pilihan, jadi jumlah sebutan melebihi 84.');
}

// ================================================================ 10 — ACT
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 'A', 'ACT', 'Keputusan: kekalkan, ubah suai, hentikan',
    'Setiap keputusan dirujuk kepada bukti dalam fasa Check');

  const groups = [
    {
      x: 0.6, tone: SEA, k: 'KEKALKAN & PIAWAIKAN',
      items: ['Farmasi Pandu Lalu — pemacu tunggal terbesar pertumbuhan (0 → 3,428 Rx)',
              'Promosi berstruktur di kaunter FKP semasa pesakit menunggu',
              'Borang maklum balas penolakan — jadikan rekod tetap, bukan kajian sekali'],
    },
    {
      x: 4.75, tone: AMBER, k: 'UBAH SUAI',
      items: ['Sasarkan warga emas & waris secara khusus — 55/84 penolak berumur ≥60',
              'Selaraskan bekalan ubat dengan tarikh TCA (bekalan 3–6 bulan)',
              'Laluan pendaftaran tanpa telefon pintar, dibantu di kaunter',
              'Laporkan VAS% MB dan PJ berasingan, bukan agregat sahaja'],
    },
    {
      x: 8.9, tone: MUTED, k: 'NILAI SEMULA / HENTIKAN',
      items: ['eSyms — volum menyusut (512 → 414) walaupun dipromosi',
              'Kempen kesedaran umum tanpa sasaran — 81% penolakan bukan kerana tidak tahu',
              'Bergantung pada VAS% agregat sebagai ukuran kejayaan tunggal'],
    },
  ];

  groups.forEach((g) => {
    card(s, { x: g.x, y: 1.4, w: 3.95, h: 4.05 });
    s.addShape(pres.ShapeType.rect, { x: g.x, y: 1.4, w: 3.95, h: 0.07, fill: { color: g.tone } });
    s.addText(g.k, {
      x: g.x + 0.25, y: 1.6, w: 3.45, h: 0.34, fontFace: SANS, fontSize: 11.5, bold: true,
      color: g.tone, charSpacing: 1.2, margin: 0, valign: 'middle',
    });
    g.items.forEach((it, i) => {
      s.addText(it, {
        x: g.x + 0.25, y: 2.02 + i * 0.82, w: 3.45, h: 0.78, fontFace: SANS, fontSize: 12,
        color: BODY, margin: 0, valign: 'top', bullet: { characterCode: '25AA' }, lineSpacing: 15,
      });
    });
  });

  card(s, { x: 0.6, y: 5.65, w: 12.1, h: 1.05, fill: DEEP, line: DEEP });
  s.addText([
    { text: 'Pembetulan kaedah:  ', options: { fontFace: SANS, fontSize: 14.5, bold: true, color: SEA } },
    { text: 'ketidaksepadanan data 2025 di PJ (8 daripada 36 baris bulanan) perlu disahkan dengan rekod PF sebelum sebarang laporan prestasi seterusnya dikeluarkan.',
      options: { fontFace: SANS, fontSize: 13.5, color: WHITE } },
  ], { x: 0.9, y: 5.8, w: 11.5, h: 0.78, margin: 0, valign: 'middle', lineSpacing: 18 });

  footer(s, 'Keputusan dicadangkan untuk pengesahan Ketua Jabatan Farmasi.');
  s.addNotes('Fasa Act mesti menghentikan sesuatu, bukan hanya menambah. eSyms dan kempen umum tanpa sasaran ialah calon penghentian.');
}

// ================================================================ 11 — pusingan 2
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 'A', 'PLAN 2', 'Pusingan kedua: Q3 – Q4 2026',
    'Menutup jurang 9.65 mata ke sasaran 65% — tumpuan sepenuhnya di MB');

  card(s, { x: 0.6, y: 1.4, w: 3.9, h: 1.5, fill: DEEP, line: DEEP });
  s.addText('+3,957', {
    x: 0.9, y: 1.55, w: 3.3, h: 0.66, fontFace: HEAD, fontSize: 34, bold: true, color: SEA,
    margin: 0, valign: 'middle',
  });
  s.addText('preskripsi VAS tambahan sesuku (≈1,319 sebulan) untuk mencapai 65%', {
    x: 0.9, y: 2.2, w: 3.3, h: 0.6, fontFace: SANS, fontSize: 12, color: 'DFF1F3',
    margin: 0, lineSpacing: 15,
  });

  card(s, { x: 4.75, y: 1.4, w: 3.9, h: 1.5 });
  s.addText('42.76% → 63%', {
    x: 5.05, y: 1.55, w: 3.3, h: 0.66, fontFace: HEAD, fontSize: 28, bold: true, color: AMBER,
    margin: 0, valign: 'middle',
  });
  s.addText('VAS% MB yang diperlukan jika volum PJ kekal — MB memikul hampir keseluruhan jurang', {
    x: 5.05, y: 2.22, w: 3.3, h: 0.66, fontFace: SANS, fontSize: 12, color: BODY,
    margin: 0, lineSpacing: 15,
  });

  card(s, { x: 8.9, y: 1.4, w: 3.8, h: 1.5 });
  s.addText('+98.3%', {
    x: 9.2, y: 1.55, w: 3.2, h: 0.66, fontFace: HEAD, fontSize: 30, bold: true, color: TEAL,
    margin: 0, valign: 'middle',
  });
  s.addText('pertumbuhan volum VAS MB dalam 12 bulan lalu — kadar ini perlu dikekalkan, bukan dipecut', {
    x: 9.2, y: 2.22, w: 3.2, h: 0.66, fontFace: SANS, fontSize: 12, color: BODY,
    margin: 0, lineSpacing: 15,
  });

  const plan = [
    ['Padanan bekalan ubat dengan TCA bagi pesakit ≥60 tahun', 'Pegawai Farmasi FKP + klinik pakar', 'Q3 2026', 'Bil. Rx bekalan ≥3 bulan'],
    ['Kaunter bantuan pendaftaran VAS (tanpa telefon pintar)', 'PRP / Penolong Pegawai Farmasi', 'Q3 2026', 'Bil. pendaftaran dibantu sebulan'],
    ['Sasaran khusus waris pesakit warga emas', 'Pegawai Farmasi FKP', 'Q3 2026', '% waris menerima VAS'],
    ['Perluas kapasiti Farmasi Pandu Lalu di MB', 'Ketua Unit FKP', 'Q3 – Q4 2026', 'Rx Pandu Lalu sebulan di MB'],
    ['Sahkan integriti data 2025 PJ dengan rekod PF', 'Unit Maklumat Farmasi', 'Q3 2026', 'Baris tidak sepadan = 0'],
    ['Lapor VAS% MB dan PJ berasingan setiap bulan', 'Ketua Unit FKP', 'Bulanan', 'Laporan bulanan dikeluarkan'],
  ];

  s.addText('TINDAKAN', { x: 0.85, y: 3.06, w: 5, h: 0.28, fontFace: SANS, fontSize: 10.5, bold: true, color: MUTED, charSpacing: 1.3, margin: 0 });
  s.addText('TANGGUNGJAWAB', { x: 6.1, y: 3.06, w: 3, h: 0.28, fontFace: SANS, fontSize: 10.5, bold: true, color: MUTED, charSpacing: 1.3, margin: 0 });
  s.addText('TEMPOH', { x: 9.2, y: 3.06, w: 1.5, h: 0.28, fontFace: SANS, fontSize: 10.5, bold: true, color: MUTED, charSpacing: 1.3, margin: 0 });
  s.addText('PETUNJUK', { x: 10.75, y: 3.06, w: 2, h: 0.28, fontFace: SANS, fontSize: 10.5, bold: true, color: MUTED, charSpacing: 1.3, margin: 0 });

  plan.forEach((p, i) => {
    const y = 3.38 + i * 0.6;
    card(s, { x: 0.6, y, w: 12.1, h: 0.52 });
    s.addText(p[0], { x: 0.85, y, w: 5.15, h: 0.52, fontFace: SANS, fontSize: 12, bold: true, color: INK, margin: 0, valign: 'middle' });
    s.addText(p[1], { x: 6.1, y, w: 3.0, h: 0.52, fontFace: SANS, fontSize: 11.5, color: BODY, margin: 0, valign: 'middle' });
    s.addText(p[2], { x: 9.2, y, w: 1.5, h: 0.52, fontFace: SANS, fontSize: 11.5, color: TEAL, bold: true, margin: 0, valign: 'middle' });
    s.addText(p[3], { x: 10.75, y, w: 1.9, h: 0.52, fontFace: SANS, fontSize: 11, color: MUTED, margin: 0, valign: 'middle' });
  });

  footer(s, 'Semakan pusingan 2: Januari 2027, menggunakan kaedah penguraian yang sama supaya kenaikan sebenar dapat dibezakan daripada kesan penyebut.');
  s.addNotes('Pusingan PDCA berikutnya bermula di sini. Sasaran 65% kekal; kaedah pengukuran diperketat.');
}

pres.writeFile({ fileName: OUT }).then(() => console.log('Ditulis:', OUT));
