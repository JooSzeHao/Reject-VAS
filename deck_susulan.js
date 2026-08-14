const pptxgen = require('pptxgenjs');
const OUT = '/home/user/Reject-VAS/output/Analisis_Preskripsi_Susulan_VAS.pptx';

// Teal Trust — sama seperti deck penolakan VAS
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

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Unit Farmasi Pesakit Luar';
pres.title = 'Analisis Bil Preskripsi Susulan & Kesannya ke atas VAS%';

function slideHead(s, num, title, kicker) {
  s.addShape(pres.ShapeType.ellipse, {
    x: 0.6, y: 0.42, w: 0.62, h: 0.62, fill: { color: TEAL },
  });
  s.addText(String(num), {
    x: 0.6, y: 0.42, w: 0.62, h: 0.62, align: 'center', valign: 'middle',
    fontFace: HEAD, fontSize: 22, bold: true, color: WHITE, margin: 0,
  });
  s.addText(title, {
    x: 1.42, y: 0.3, w: 11.2, h: 0.6, fontFace: HEAD, fontSize: 28, bold: true,
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

const QS = ['Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];

// ================================================================ 1 — title
{
  const s = pres.addSlide();
  s.background = { color: DEEP };

  s.addText('ANALISIS PRESKRIPSI SUSULAN (ULANGAN)', {
    x: 0.9, y: 0.9, w: 11.5, h: 0.34, fontFace: SANS, fontSize: 14, bold: true,
    color: SEA, charSpacing: 2.5, margin: 0,
  });
  s.addText('VAS% naik 14.5 mata —', {
    x: 0.9, y: 1.28, w: 11.5, h: 0.82, fontFace: HEAD, fontSize: 42, bold: true,
    color: WHITE, margin: 0,
  });
  s.addText('tetapi separuhnya bukan pertumbuhan', {
    x: 0.9, y: 2.08, w: 11.5, h: 0.82, fontFace: HEAD, fontSize: 42, bold: true,
    color: SEA, margin: 0,
  });
  s.addText('Q2 2025 – Q2 2026  •  FKP Melaka & Pusat Jantung  •  5 suku tahun, 221,662 preskripsi susulan', {
    x: 0.9, y: 3.0, w: 11.5, h: 0.34, fontFace: SANS, fontSize: 14, color: 'A9C6CB', margin: 0,
  });

  const stats = [
    { n: '−10.5%', l: 'penyusutan bil preskripsi\nsusulan (penyebut)', hl: true },
    { n: '40%', l: 'daripada kenaikan VAS%\ndatang dari penyebut sahaja' },
    { n: '97%', l: 'kesan penyebut di PJ —\nvolum VAS sebenarnya turun' },
  ];
  stats.forEach((st, i) => {
    const x = 0.9 + i * 3.93;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 3.95, w: 3.55, h: 2.25, rectRadius: 0.1,
      fill: { color: st.hl ? TEAL : '0F5563' }, line: { color: '17697A', width: 1 },
    });
    s.addText(st.n, {
      x: x + 0.3, y: 4.15, w: 2.95, h: 0.95, fontFace: HEAD, fontSize: 46, bold: true,
      color: st.hl ? WHITE : SEA, margin: 0, valign: 'middle',
    });
    s.addText(st.l, {
      x: x + 0.3, y: 5.15, w: 2.95, h: 0.85, fontFace: SANS, fontSize: 13,
      color: st.hl ? 'DFF1F3' : 'A9C6CB', margin: 0, lineSpacing: 17,
    });
  });

  s.addText('Sumber: data bulanan Rx Ulangan & VAS mengikut servis  |  Unit Farmasi Pesakit Luar', {
    x: 0.9, y: 6.6, w: 11.5, h: 0.3, fontFace: SANS, fontSize: 11, color: '6E9AA3', margin: 0,
  });
  s.addNotes('VAS% gabungan naik dari 40.82% ke 55.35%. Mesej utama: peratusan naik sebahagiannya kerana penyebut mengecil, bukan semata-mata kerana VAS berkembang.');
}

// ================================================================ 2 — denominator
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 1, 'Penyebut runtuh pada Q1 2026 dan tidak pulih',
    'Bil preskripsi susulan (gabungan MB + PJ) mengikut suku tahun');

  s.addChart(pres.ChartType.bar, [{
    name: 'Preskripsi susulan',
    labels: QS,
    values: [45808, 47062, 46346, 41428, 41018],
  }], {
    x: 0.55, y: 1.5, w: 7.6, h: 3.1,
    barDir: 'col', barGapWidthPct: 45,
    ...chartFrame,
    chartColors: [MINT, MINT, MINT, TEAL, TEAL],
    varyColors: true,
    dataLabelPosition: 'outEnd',
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 54000,
  });
  s.addText('Stabil ~46–47k sepanjang 2025, kemudian −10.6% dalam satu suku.', {
    x: 0.55, y: 4.62, w: 7.6, h: 0.3, fontFace: SANS, fontSize: 11, color: MUTED, margin: 0,
  });

  card(s, { x: 8.5, y: 1.5, w: 4.2, h: 3.1, fill: DEEP, line: DEEP });
  s.addText('−4,790', {
    x: 8.8, y: 1.7, w: 3.6, h: 0.8, fontFace: HEAD, fontSize: 40, bold: true, color: SEA,
    margin: 0, valign: 'middle',
  });
  s.addText('preskripsi susulan hilang dari penyebut antara Q2 2025 dan Q2 2026 — dan penyusutan itu berlaku sepenuhnya pada Bukan VAS.', {
    x: 8.8, y: 2.52, w: 3.6, h: 1.5, fontFace: SANS, fontSize: 14, color: 'DFF1F3',
    margin: 0, lineSpacing: 19,
  });

  const flows = [
    { t: 'VAS', a: '18,701', b: '22,705', d: '+4,004', tone: TEAL },
    { t: 'Bukan VAS', a: '27,107', b: '18,313', d: '−8,794', tone: AMBER },
  ];
  flows.forEach((f, i) => {
    const x = 0.55 + i * 4.0;
    card(s, { x, y: 5.05, w: 3.75, h: 1.55 });
    s.addText(f.t, {
      x: x + 0.28, y: 5.22, w: 3.2, h: 0.3, fontFace: SANS, fontSize: 12, bold: true,
      color: f.tone, charSpacing: 1.2, margin: 0,
    });
    s.addText(`${f.a}  →  ${f.b}`, {
      x: x + 0.28, y: 5.56, w: 3.2, h: 0.4, fontFace: SANS, fontSize: 15, color: BODY,
      margin: 0, valign: 'middle',
    });
    s.addText(f.d, {
      x: x + 0.28, y: 6.0, w: 3.2, h: 0.45, fontFace: HEAD, fontSize: 24, bold: true,
      color: f.tone, margin: 0, valign: 'middle',
    });
  });

  card(s, { x: 8.5, y: 5.05, w: 4.2, h: 1.55, fill: DEEP, line: AMBER });
  s.addText('Lebih separuh penurunan Bukan VAS tidak muncul semula sebagai VAS. Ini bukan sekadar peralihan saluran.', {
    x: 8.8, y: 5.25, w: 3.6, h: 1.15, fontFace: SANS, fontSize: 13.5, color: WHITE,
    margin: 0, lineSpacing: 18,
  });
  s.addNotes('Penyebut stabil sepanjang 2025 lalu jatuh mendadak Q1 2026. Bukan VAS turun 8,794 tetapi VAS naik hanya 4,004 — bakinya hilang dari pelaporan, bukan berpindah saluran.');
}

// ================================================================ 3 — decomposition
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 2, 'Dua lokasi, dua cerita yang bertentangan',
    'Pecahan perubahan VAS% Q2 2025 → Q2 2026 kepada kesan pengangka dan penyebut');

  const cols = [
    {
      x: 0.6, tone: TEAL, tag: 'MB — PERTUMBUHAN TULEN',
      pctFrom: '21.84%', pctTo: '42.76%', delta: '+20.92 mata',
      rows: [
        ['Penyebut (susulan)', '19,200 → 19,445', '+1.3%'],
        ['Pengangka (VAS)', '4,194 → 8,315', '+98.3%'],
        ['Kesan pengangka', '', '+21.46 mata'],
        ['Kesan penyebut', '', '−0.55 mata'],
      ],
      note: 'Volum VAS berganda pada asas pesakit yang hampir tidak berubah. Kenaikan ini betul-betul diperoleh.',
    },
    {
      x: 6.85, tone: AMBER, tag: 'PJ — KESAN PENYEBUT',
      pctFrom: '54.52%', pctTo: '66.70%', delta: '+12.18 mata',
      rows: [
        ['Penyebut (susulan)', '26,608 → 21,573', '−18.9%'],
        ['Pengangka (VAS)', '14,507 → 14,390', '−0.8%'],
        ['Kesan pengangka', '', '−0.44 mata'],
        ['Kesan penyebut', '', '+12.62 mata'],
      ],
      note: 'Volum VAS sebenarnya menurun. Hampir keseluruhan kenaikan 12 mata ialah artifak aritmetik.',
    },
  ];

  cols.forEach((c) => {
    card(s, { x: c.x, y: 1.45, w: 5.85, h: 4.15 });
    s.addShape(pres.ShapeType.rect, { x: c.x, y: 1.45, w: 5.85, h: 0.07, fill: { color: c.tone } });
    s.addText(c.tag, {
      x: c.x + 0.3, y: 1.66, w: 5.25, h: 0.32, fontFace: SANS, fontSize: 12.5, bold: true,
      color: c.tone, charSpacing: 1.2, margin: 0, valign: 'middle',
    });
    s.addText([
      { text: c.pctFrom, options: { fontFace: HEAD, fontSize: 24, color: MUTED } },
      { text: '   →   ', options: { fontFace: SANS, fontSize: 18, color: MUTED } },
      { text: c.pctTo, options: { fontFace: HEAD, fontSize: 32, bold: true, color: INK } },
      { text: '   ' + c.delta, options: { fontFace: SANS, fontSize: 14, bold: true, color: c.tone } },
    ], {
      x: c.x + 0.3, y: 2.04, w: 5.25, h: 0.62, margin: 0, valign: 'middle',
    });

    c.rows.forEach((r, i) => {
      const y = 2.82 + i * 0.5;
      const strong = i >= 2;
      s.addText(r[0], {
        x: c.x + 0.3, y, w: 2.5, h: 0.42, fontFace: SANS, fontSize: 13,
        bold: strong, color: strong ? INK : BODY, margin: 0, valign: 'middle',
      });
      s.addText(r[1], {
        x: c.x + 2.8, y, w: 1.75, h: 0.42, fontFace: SANS, fontSize: 12.5, color: MUTED,
        margin: 0, valign: 'middle',
      });
      s.addText(r[2], {
        x: c.x + 4.5, y, w: 1.05, h: 0.42, fontFace: SANS, fontSize: 13,
        bold: true, color: strong ? c.tone : BODY, align: 'right', margin: 0, valign: 'middle',
      });
      if (i === 1) {
        s.addShape(pres.ShapeType.line, {
          x: c.x + 0.3, y: y + 0.46, w: 5.25, h: 0, line: { color: 'DCE9EB', width: 1 },
        });
      }
    });

    s.addText(c.note, {
      x: c.x + 0.3, y: 4.86, w: 5.25, h: 0.6, fontFace: SANS, fontSize: 13, italic: true,
      color: BODY, margin: 0, lineSpacing: 18,
    });
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 5.82, w: 12.1, h: 1.05, rectRadius: 0.09,
    fill: { color: DEEP }, line: { color: DEEP, width: 1 },
  });
  s.addText([
    { text: 'Ujian kepekaan:  ', options: { fontFace: SANS, fontSize: 15, bold: true, color: SEA } },
    { text: 'jika penyebut kekal pada paras Q2 2025 (45,808), VAS% gabungan Q2 2026 ialah 49.57% — bukan 55.35%. Beza 5.79 mata itu datang daripada penyebut yang mengecil, bukan perkhidmatan yang berkembang.',
      options: { fontFace: SANS, fontSize: 14.5, color: WHITE } },
  ], {
    x: 0.9, y: 5.98, w: 11.5, h: 0.75, margin: 0, valign: 'middle', lineSpacing: 20,
  });
  s.addNotes('Penguraian tepat: dp = (N1-N0)/D0 + N1(D0-D1)/(D0*D1). MB dan PJ mesti dilaporkan berasingan — mencampurkannya menyembunyikan hakikat bahawa volum VAS PJ mendatar.');
}

// ================================================================ 4 — service mix
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideHead(s, 3, 'Seluruh pertumbuhan VAS datang dari satu servis baharu',
    'Pecahan preskripsi VAS mengikut servis, Q2 2025 berbanding Q2 2026 (gabungan)');

  s.addChart(pres.ChartType.bar, [
    { name: 'Q2 2025', labels: ['UMP', 'Pandu Lalu', 'Locker', 'Esyms', 'IDTF'], values: [17491, 0, 385, 512, 7] },
    { name: 'Q2 2026', labels: ['UMP', 'Pandu Lalu', 'Locker', 'Esyms', 'IDTF'], values: [17827, 3428, 894, 414, 142] },
  ], {
    x: 0.55, y: 1.5, w: 7.6, h: 3.9,
    barDir: 'bar', barGapWidthPct: 40,
    ...chartFrame,
    chartColors: [MINT, TEAL],
    showLegend: true, legendPos: 'b', legendColor: BODY, legendFontFace: SANS, legendFontSize: 12,
    dataLabelPosition: 'outEnd', dataLabelFontSize: 11,
    valAxisHidden: true, valAxisMaxVal: 21000,
  });

  card(s, { x: 8.5, y: 1.5, w: 4.2, h: 1.95, fill: DEEP, line: DEEP });
  s.addText('0 → 3,428', {
    x: 8.8, y: 1.68, w: 3.6, h: 0.62, fontFace: HEAD, fontSize: 32, bold: true, color: SEA,
    margin: 0, valign: 'middle',
  });
  s.addText('Pandu Lalu, dilancar Sep 2025, kini 15.1% daripada semua preskripsi VAS.', {
    x: 8.8, y: 2.34, w: 3.6, h: 0.95, fontFace: SANS, fontSize: 13.5, color: 'DFF1F3',
    margin: 0, lineSpacing: 18,
  });

  card(s, { x: 8.5, y: 3.6, w: 4.2, h: 1.8 });
  s.addText('UMP mendatar', {
    x: 8.8, y: 3.78, w: 3.6, h: 0.3, fontFace: SANS, fontSize: 12.5, bold: true, color: TEAL,
    charSpacing: 1.2, margin: 0,
  });
  s.addText('+336 preskripsi sahaja (+1.9%) dalam setahun, dan bahagiannya jatuh dari 93.5% ke 78.5%. Esyms merosot (−98).', {
    x: 8.8, y: 4.12, w: 3.6, h: 1.15, fontFace: SANS, fontSize: 13, color: BODY,
    margin: 0, lineSpacing: 18,
  });

  s.addText('Tanpa Pandu Lalu, VAS gabungan hampir tidak berkembang langsung — pertumbuhan +4,004 preskripsi terdiri daripada +3,428 Pandu Lalu.', {
    x: 0.55, y: 5.72, w: 12.15, h: 0.5, fontFace: SANS, fontSize: 14, italic: true, color: TEAL,
    margin: 0, valign: 'middle',
  });
  s.addText('Nota data: 8 daripada 36 baris bulanan (kesemuanya PJ 2025) tidak sepadan antara jumlah servis dan lajur Rx Ulangan VAS, jurang −12 hingga −189. Data 2026 sepadan tepat.', {
    x: 0.55, y: 6.28, w: 12.15, h: 0.6, fontFace: SANS, fontSize: 10.5, color: MUTED,
    margin: 0, lineSpacing: 14,
  });
  s.addNotes('Pandu Lalu ialah satu-satunya enjin pertumbuhan. UMP sebagai tulang belakang perkhidmatan telah mendatar. Ketergantungan pada satu servis baharu adalah risiko jika ia tepu.');
}

// ================================================================ 5 — interpretation
{
  const s = pres.addSlide();
  s.background = { color: DEEP };

  s.addText('Interpretasi & implikasi', {
    x: 0.75, y: 0.5, w: 8, h: 0.55, fontFace: HEAD, fontSize: 32, bold: true, color: WHITE, margin: 0,
  });
  s.addText('Sasaran negeri ≥25% dicapai dengan selesa — tetapi angka itu bukan ukuran prestasi yang bersih', {
    x: 0.75, y: 1.06, w: 11.8, h: 0.34, fontFace: SANS, fontSize: 14, color: '9FC4CA', margin: 0,
  });

  const cols = [
    {
      tag: 'YANG BENAR-BENAR BAIK', n: 'MB', pct: '+98.3% volum VAS',
      t: 'Melaka menggandakan volum VAS pada asas pesakit yang stabil. Ini model yang patut direplikasi — kenaikan 20.9 mata hampir keseluruhannya kesan pengangka.',
      hl: true,
    },
    {
      tag: 'YANG PERLU DISIASAT', n: 'PJ', pct: '−5,035 penyebut',
      t: 'Volum VAS mendatar sementara 5,035 preskripsi susulan hilang dari pelaporan dalam setahun. Sahkan dengan PF 5.2 sebelum trend ini dibawa ke laporan rasmi.',
    },
    {
      tag: 'RISIKO TERSEMBUNYI', n: '1', pct: 'servis penggerak',
      t: 'Jika penyebut pulih ke paras 2025, VAS% PJ akan jatuh semula tanpa sebarang perubahan prestasi. Pertumbuhan juga bergantung sepenuhnya pada Pandu Lalu.',
    },
  ];
  cols.forEach((c, i) => {
    const x = 0.75 + i * 4.03;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 1.72, w: 3.75, h: 3.3, rectRadius: 0.1,
      fill: { color: c.hl ? TEAL : '0F5563' }, line: { color: '17697A', width: 1 },
    });
    s.addText(c.tag, {
      x: x + 0.3, y: 1.94, w: 3.15, h: 0.3, fontFace: SANS, fontSize: 11.5, bold: true,
      color: c.hl ? 'CFEDF0' : SEA, charSpacing: 1.2, margin: 0, valign: 'middle',
    });
    s.addText(c.n, {
      x: x + 0.3, y: 2.3, w: 3.15, h: 0.7, fontFace: HEAD, fontSize: 38, bold: true,
      color: WHITE, margin: 0, valign: 'middle',
    });
    s.addText(c.pct, {
      x: x + 0.3, y: 2.98, w: 3.15, h: 0.3, fontFace: SANS, fontSize: 13,
      color: c.hl ? 'CFEDF0' : '9FC4CA', margin: 0,
    });
    s.addText(c.t, {
      x: x + 0.3, y: 3.36, w: 3.15, h: 1.5, fontFace: SANS, fontSize: 13,
      color: c.hl ? 'EAF7F8' : 'C9DEE2', margin: 0, lineSpacing: 18,
    });
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: 0.75, y: 5.28, w: 11.8, h: 1.1, rectRadius: 0.09,
    fill: { color: '0F5563' }, line: { color: AMBER, width: 1.5 },
  });
  s.addText([
    { text: 'Cadangan pelaporan:  ', options: { fontFace: SANS, fontSize: 15, bold: true, color: AMBER } },
    { text: 'laporkan volum VAS mutlak bersama peratusan, dan asingkan MB daripada PJ. Peratusan sahaja menyembunyikan hakikat bahawa volum VAS PJ menurun sementara peratusannya naik 12 mata.',
      options: { fontFace: SANS, fontSize: 14.5, color: WHITE } },
  ], {
    x: 1.05, y: 5.44, w: 11.2, h: 0.78, margin: 0, valign: 'middle', lineSpacing: 20,
  });

  s.addText('Asas: 5 suku tahun (Q2 2025 – Q2 2026), 221,662 preskripsi susulan. Penyebut perlu naik ke 90,820 (2.2× paras semasa) sebelum VAS% jatuh di bawah sasaran 25%.', {
    x: 0.75, y: 6.6, w: 11.8, h: 0.4, fontFace: SANS, fontSize: 10.5, color: '6E9AA3',
    margin: 0, lineSpacing: 14,
  });
  s.addNotes('Tiga mesej: MB ialah kejayaan sebenar, penyusutan penyebut PJ perlu disahkan dengan PF 5.2, dan pergantungan pada Pandu Lalu adalah risiko. Sasaran 25% tidak berisiko.');
}

pres.writeFile({ fileName: OUT }).then(() => console.log('written', OUT));
