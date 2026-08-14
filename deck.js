const pptxgen = require('pptxgenjs');
const OUT = '/home/user/Reject-VAS/output/Analisis_Penolakan_VAS_FKP.pptx';

// Teal Trust — clinical, not generic blue
const DEEP = '083F49';   // dark slide ground
const TEAL = '028090';   // dominant
const SEA = '00A896';    // supporting
const MINT = '9AD9DA';   // de-emphasised bars
const AMBER = 'E08A3C';  // sharp accent, used sparingly
const INK = '10262B';
const BODY = '3E5A61';
const MUTED = '7C9198';
const CARD = 'F1F7F8';
const WHITE = 'FFFFFF';

const HEAD = 'Cambria';
const SANS = 'Calibri';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';   // 13.3 x 7.5
pres.author = 'Unit Farmasi Pesakit Luar';
pres.title = 'Analisis Penolakan Perkhidmatan VAS di FKP';

const W = 13.3, H = 7.5;

// motif: a numbered teal disc that opens every content slide
function slideHead(s, num, title, kicker) {
  s.addShape(pres.ShapeType.ellipse, {
    x: 0.6, y: 0.42, w: 0.62, h: 0.62, fill: { color: TEAL },
  });
  s.addText(String(num), {
    x: 0.6, y: 0.42, w: 0.62, h: 0.62, align: 'center', valign: 'middle',
    fontFace: HEAD, fontSize: 22, bold: true, color: WHITE, margin: 0,
  });
  s.addText(title, {
    x: 1.42, y: 0.3, w: 11.2, h: 0.6, fontFace: HEAD, fontSize: 30, bold: true,
    color: INK, margin: 0, valign: 'middle',
  });
  if (kicker) {
    s.addText(kicker, {
      x: 1.42, y: 0.92, w: 11.2, h: 0.34, fontFace: SANS, fontSize: 14,
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

// ================================================================ 1 — title
{
  const s = pres.addSlide();
  s.background = { color: DEEP };

  s.addText('ANALISIS MAKLUM BALAS PESAKIT', {
    x: 0.9, y: 0.95, w: 11.5, h: 0.34, fontFace: SANS, fontSize: 14, bold: true,
    color: SEA, charSpacing: 2.5, margin: 0,
  });
  s.addText('Mengapa pesakit menolak', {
    x: 0.9, y: 1.34, w: 11.5, h: 0.82, fontFace: HEAD, fontSize: 44, bold: true,
    color: WHITE, margin: 0,
  });
  s.addText('perkhidmatan VAS di FKP?', {
    x: 0.9, y: 2.16, w: 11.5, h: 0.82, fontFace: HEAD, fontSize: 44, bold: true,
    color: SEA, margin: 0,
  });
  s.addText('84 maklum balas pesakit  •  16 Julai – 13 Ogos 2026  •  Farmasi Klinik Pesakit Luar', {
    x: 0.9, y: 3.08, w: 11.5, h: 0.34, fontFace: SANS, fontSize: 14, color: 'A9C6CB', margin: 0,
  });

  const stats = [
    { n: '81%', l: 'menolak kerana lebih suka\nkaedah biasa di kaunter', hl: true },
    { n: '63%', l: 'berumur 60 tahun ke atas\n(50 daripada 79 rekod berumur)' },
    { n: '1', l: 'rekod sahaja menyebut\nkebimbangan kesilapan ubat' },
  ];
  stats.forEach((st, i) => {
    const x = 0.9 + i * 3.93;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 4.0, w: 3.55, h: 2.2, rectRadius: 0.1,
      fill: { color: st.hl ? TEAL : '0F5563' }, line: { color: '17697A', width: 1 },
    });
    s.addText(st.n, {
      x: x + 0.3, y: 4.2, w: 2.95, h: 0.95, fontFace: HEAD, fontSize: 50, bold: true,
      color: st.hl ? WHITE : SEA, margin: 0, valign: 'middle',
    });
    s.addText(st.l, {
      x: x + 0.3, y: 5.18, w: 2.95, h: 0.85, fontFace: SANS, fontSize: 13,
      color: st.hl ? 'DFF1F3' : 'A9C6CB', margin: 0, lineSpacing: 17,
    });
  });

  s.addText('Analisis & interpretasi data borang maklum balas  |  Unit Farmasi Pesakit Luar', {
    x: 0.9, y: 6.6, w: 11.5, h: 0.3, fontFace: SANS, fontSize: 11, color: '6E9AA3', margin: 0,
  });
  s.addNotes('84 rekod bersih daripada borang maklum balas, tempoh empat minggu. Fokus pembentangan: analisis dan interpretasi sebab penolakan.');
}

// ================================================================ 2 — categories
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 1, 'Satu kategori menguasai keseluruhan penolakan',
    'Taburan 84 maklum balas mengikut kategori sebab penolakan');

  s.addChart(pres.ChartType.bar, [{
    name: 'Pesakit',
    labels: ['A) Lebih suka kaedah biasa\n& ambil sendiri', 'E) Halangan teknologi\n& celik digital',
      'C) Isu ubat melalui pos', 'B) Bimbang kesilapan ubat', 'D) Isu farmasi pandu lalu'],
    values: [68, 7, 6, 1, 1],
  }], {
    x: 0.6, y: 1.45, w: 7.7, h: 4.35,
    barDir: 'bar', barGapWidthPct: 55,
    ...chartFrame,
    chartColors: [TEAL],
    dataLabelPosition: 'outEnd',
    valAxisMaxVal: 80, valAxisHidden: true,
    catAxisLabelFontSize: 11,
  });

  s.addText('1 rekod tambahan tidak mempunyai sebab yang direkodkan.', {
    x: 0.6, y: 5.85, w: 7.7, h: 0.3, fontFace: SANS, fontSize: 10, italic: true, color: MUTED, margin: 0,
  });

  card(s, { x: 8.65, y: 1.45, w: 4.05, h: 2.55, fill: DEEP, line: DEEP });
  s.addText('68 / 84', {
    x: 8.95, y: 1.62, w: 3.45, h: 0.8, fontFace: HEAD, fontSize: 40, bold: true, color: SEA, margin: 0, valign: 'middle',
  });
  s.addText('pesakit menolak semata-mata kerana lebih selesa mengambil ubat sendiri di kaunter — bukan kerana VAS bermasalah.', {
    x: 8.95, y: 2.45, w: 3.45, h: 1.4, fontFace: SANS, fontSize: 14, color: 'DFF1F3', margin: 0, lineSpacing: 19,
  });

  card(s, { x: 8.65, y: 4.2, w: 4.05, h: 1.9 });
  s.addText('Interpretasi', {
    x: 8.95, y: 4.38, w: 3.45, h: 0.3, fontFace: SANS, fontSize: 12, bold: true, color: TEAL,
    charSpacing: 1.2, margin: 0,
  });
  s.addText('Kebimbangan keselamatan ubat hampir tiada (1.2%). Halangan sebenar ialah tabiat dan kemudahan, bukan kepercayaan terhadap perkhidmatan.', {
    x: 8.95, y: 4.72, w: 3.45, h: 1.25, fontFace: SANS, fontSize: 13, color: BODY, margin: 0, lineSpacing: 18,
  });
  s.addNotes('Kategori A menguasai 81%. Empat kategori lain bersama-sama kurang 18%. Tafsiran penting: usaha meyakinkan pesakit tentang keselamatan ubat tidak menyasarkan halangan sebenar.');
}

// ================================================================ 3 — two kinds of barrier
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 2, 'Dalam kategori itu, dua jenis halangan berbeza',
    'Empat sub-sebab teratas mewakili 88 daripada 104 sebutan keseluruhan');

  s.addChart(pres.ChartType.bar, [{
    name: 'Sebutan',
    labels: ['Lebih selesa dengan\nkaedah biasa di kaunter', 'Kekerapan temujanji\n(TCA hampir setiap bulan)',
      'Kurang motivasi mencuba\nsistem baharu', 'Pesakit tinggal\nberdekatan hospital'],
    values: [33, 27, 14, 14],
  }], {
    x: 0.6, y: 1.5, w: 6.5, h: 3.5,
    barDir: 'bar', barGapWidthPct: 50,
    ...chartFrame,
    chartColors: [TEAL, AMBER, TEAL, AMBER],
    varyColors: true,
    dataLabelPosition: 'outEnd',
    valAxisMaxVal: 40, valAxisHidden: true,
    catAxisLabelFontSize: 11,
  });
  s.addText('Bilangan sebutan; pesakit boleh memilih lebih daripada satu sub-sebab.', {
    x: 0.6, y: 5.05, w: 6.5, h: 0.3, fontFace: SANS, fontSize: 10, italic: true, color: MUTED, margin: 0,
  });

  const boxes = [
    {
      x: 7.35, tone: TEAL, tag: 'HALANGAN TABIAT', n: '47 sebutan',
      t: 'Keselesaan dengan kaedah sedia ada dan keengganan mencuba sistem baharu. Pesakit tidak pernah menguji VAS — penolakan berlaku sebelum sebarang pengalaman.',
    },
    {
      x: 7.35, tone: AMBER, tag: 'HALANGAN STRUKTUR', n: '41 sebutan',
      t: 'Pesakit tetap perlu hadir ke hospital setiap bulan, atau tinggal berdekatan. VAS tidak mengurangkan kunjungan mereka, jadi tiada faedah yang nyata.',
    },
  ];
  boxes.forEach((b, i) => {
    const y = 1.5 + i * 2.42;
    card(s, { x: b.x, y, w: 5.35, h: 2.16 });
    s.addShape(pres.ShapeType.ellipse, { x: b.x + 0.3, y: y + 0.3, w: 0.3, h: 0.3, fill: { color: b.tone } });
    s.addText(b.tag, {
      x: b.x + 0.72, y: y + 0.28, w: 2.6, h: 0.34, fontFace: SANS, fontSize: 12, bold: true,
      color: b.tone, charSpacing: 1.2, margin: 0, valign: 'middle',
    });
    s.addText(b.n, {
      x: b.x + 3.3, y: y + 0.28, w: 1.75, h: 0.34, fontFace: HEAD, fontSize: 17, bold: true,
      color: INK, align: 'right', margin: 0, valign: 'middle',
    });
    s.addText(b.t, {
      x: b.x + 0.3, y: y + 0.76, w: 4.75, h: 1.25, fontFace: SANS, fontSize: 13.5,
      color: BODY, margin: 0, lineSpacing: 19,
    });
  });

  s.addText('Kedua-duanya tergolong dalam Kategori A, tetapi memerlukan tafsiran yang berbeza sama sekali.', {
    x: 7.35, y: 6.34, w: 5.35, h: 0.52, fontFace: SANS, fontSize: 13, italic: true, color: TEAL, margin: 0,
  });
  s.addNotes('Pemecahan sub-sebab mendedahkan dua halangan berbeza dalam kategori yang sama: tabiat (boleh berubah melalui pendedahan) dan struktur (tidak berubah selagi corak temujanji kekal).');
}

// ================================================================ 4 — who
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 3, 'Siapa yang menolak, dan di klinik mana',
    'Profil umur, jabatan dan status kehadiran pesakit yang menolak');

  s.addChart(pres.ChartType.bar, [{
    name: 'Pesakit',
    labels: ['0–10', '31–40', '41–50', '51–60', '61–70', '71–80', '81–90', '91–100', 'Tiada\nrekod'],
    values: [2, 2, 5, 20, 20, 26, 2, 2, 5],
  }], {
    x: 0.55, y: 1.5, w: 7.5, h: 3.05,
    barDir: 'col', barGapWidthPct: 45,
    ...chartFrame,
    chartColors: [MINT, MINT, MINT, MINT, TEAL, TEAL, TEAL, TEAL, MINT],
    varyColors: true,
    dataLabelPosition: 'outEnd',
    valAxisHidden: true, valAxisMaxVal: 31,
    catAxisLabelFontSize: 11,
  });
  s.addText('Warna gelap = 60 tahun ke atas (50 pesakit, 63.3% daripada rekod berumur)', {
    x: 0.55, y: 4.58, w: 7.5, h: 0.3, fontFace: SANS, fontSize: 11, color: MUTED, margin: 0,
  });

  card(s, { x: 8.4, y: 1.5, w: 4.3, h: 3.05 });
  s.addText('Tiga klinik = 56% penolakan', {
    x: 8.7, y: 1.68, w: 3.7, h: 0.34, fontFace: SANS, fontSize: 13, bold: true, color: TEAL, margin: 0,
  });
  [['Perubatan (Semua)', 21], ['Orthopedic', 14], ['Oftalmologi', 12]].forEach((r, i) => {
    const y = 2.16 + i * 0.6;
    s.addText(r[0], {
      x: 8.7, y, w: 2.7, h: 0.4, fontFace: SANS, fontSize: 14, color: BODY, margin: 0, valign: 'middle',
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: 11.42, y: y + 0.05, w: 0.98, h: 0.3, rectRadius: 0.05, fill: { color: TEAL },
    });
    s.addText(String(r[1]), {
      x: 11.42, y: y + 0.05, w: 0.98, h: 0.3, fontFace: SANS, fontSize: 13, bold: true,
      color: WHITE, align: 'center', valign: 'middle', margin: 0,
    });
  });
  s.addText('Ketiga-tiganya klinik dengan jumlah temujanji susulan yang tinggi.', {
    x: 8.7, y: 3.96, w: 3.7, h: 0.45, fontFace: SANS, fontSize: 12, italic: true, color: MUTED,
    margin: 0, lineSpacing: 16,
  });

  const tiles = [
    { n: '25%', t: 'maklum balas diwakili waris (21 rekod)' },
    { n: '18', t: 'daripada 21 rekod waris tergolong dalam Kategori A' },
    { n: '5 / 7', t: 'kes halangan teknologi berumur 61 tahun ke atas' },
  ];
  tiles.forEach((t, i) => {
    const x = 0.55 + i * 4.13;
    card(s, { x, y: 5.12, w: 3.83, h: 1.5 });
    s.addText(t.n, {
      x: x + 0.28, y: 5.28, w: 3.3, h: 0.55, fontFace: HEAD, fontSize: 30, bold: true,
      color: TEAL, margin: 0, valign: 'middle',
    });
    s.addText(t.t, {
      x: x + 0.28, y: 5.87, w: 3.3, h: 0.62, fontFace: SANS, fontSize: 13, color: BODY,
      margin: 0, lineSpacing: 17,
    });
  });
  s.addNotes('Penolakan tertumpu pada warga emas dan klinik dengan temujanji susulan kerap. Waris hadir dalam satu perempat kes — saluran yang berkait rapat dengan halangan teknologi warga emas.');
}

// ================================================================ 5 — interpretation
{
  const s = pres.addSlide();
  s.background = { color: DEEP };

  s.addText('Interpretasi', {
    x: 0.75, y: 0.5, w: 6, h: 0.55, fontFace: HEAD, fontSize: 32, bold: true, color: WHITE, margin: 0,
  });
  s.addText('Tiga masalah berbeza — dan satu yang hampir tidak wujud', {
    x: 0.75, y: 1.06, w: 11.8, h: 0.34, fontFace: SANS, fontSize: 14, color: '9FC4CA', margin: 0,
  });

  const cols = [
    {
      tag: 'MASALAH NILAI', n: '68', pct: '81.0%',
      t: 'VAS tidak menawarkan faedah yang jelas kepada pesakit yang tetap perlu ke hospital atau tinggal berdekatan. Penolakan adalah keputusan rasional, bukan salah faham.',
      hl: true,
    },
    {
      tag: 'MASALAH PERANTI', n: '7', pct: '8.3%',
      t: 'Enam daripada tujuh kes berpunca daripada ketiadaan telefon pintar atau pelan data. Hanya satu menyebut kesukaran menguasai aplikasi — jadi ini bukan masalah sikap.',
    },
    {
      tag: 'MASALAH PELAKSANAAN', n: '6', pct: '7.1%',
      t: 'Isu ubat melalui pos berkaitan penghantaran, bukan konsep: penerima tiada di rumah, ubat salah atau tidak cukup, dan caj kurier.',
    },
  ];
  cols.forEach((c, i) => {
    const x = 0.75 + i * 4.03;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 1.72, w: 3.75, h: 3.35, rectRadius: 0.1,
      fill: { color: c.hl ? TEAL : '0F5563' }, line: { color: '17697A', width: 1 },
    });
    s.addText(c.tag, {
      x: x + 0.3, y: 1.95, w: 3.15, h: 0.3, fontFace: SANS, fontSize: 12, bold: true,
      color: c.hl ? 'CFEDF0' : SEA, charSpacing: 1.2, margin: 0, valign: 'middle',
    });
    s.addText([
      { text: c.n, options: { fontFace: HEAD, fontSize: 40, bold: true, color: WHITE } },
      { text: '  ' + c.pct, options: { fontFace: SANS, fontSize: 15, color: c.hl ? 'CFEDF0' : '9FC4CA' } },
    ], {
      x: x + 0.3, y: 2.32, w: 3.15, h: 0.75, margin: 0, valign: 'middle',
    });
    s.addText('pesakit', {
      x: x + 0.3, y: 3.02, w: 3.15, h: 0.26, fontFace: SANS, fontSize: 12,
      color: c.hl ? 'CFEDF0' : '9FC4CA', margin: 0,
    });
    s.addText(c.t, {
      x: x + 0.3, y: 3.4, w: 3.15, h: 1.5, fontFace: SANS, fontSize: 13,
      color: c.hl ? 'EAF7F8' : 'C9DEE2', margin: 0, lineSpacing: 18,
    });
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: 0.75, y: 5.32, w: 11.8, h: 1.05, rectRadius: 0.09,
    fill: { color: '0F5563' }, line: { color: AMBER, width: 1.5 },
  });
  s.addText([
    { text: 'Masalah kepercayaan:  ', options: { fontFace: SANS, fontSize: 15, bold: true, color: AMBER } },
    { text: '1 rekod sahaja (1.2%) menyebut kebimbangan kesilapan ubat. Penerimaan VAS tersekat pada nilai dan akses, bukan pada keyakinan pesakit terhadap perkhidmatan.',
      options: { fontFace: SANS, fontSize: 15, color: WHITE } },
  ], {
    x: 1.05, y: 5.48, w: 11.2, h: 0.75, margin: 0, valign: 'middle', lineSpacing: 20,
  });

  s.addText('Asas: 84 maklum balas, 16 Julai – 13 Ogos 2026. Kadar penolakan sebenar tidak dapat dikira kerana jumlah pesakit yang ditawarkan VAS tidak direkodkan.', {
    x: 0.75, y: 6.62, w: 11.8, h: 0.4, fontFace: SANS, fontSize: 10.5, color: '6E9AA3', margin: 0, lineSpacing: 14,
  });
  s.addNotes('Tiga masalah berbeza memerlukan tafsiran berbeza. Yang paling penting: masalah kepercayaan hampir tidak wujud dalam data ini. Batasan: data merekod penolakan sahaja, tanpa denominator tawaran.');
}

pres.writeFile({ fileName: OUT }).then(() => console.log('written', OUT));
