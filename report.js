const fs = require('fs');
const d = require('docx');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, PageBreak,
  Header, Footer, PageNumber, LevelFormat, convertInchesToTwip,
} = d;

const FIGS = '/tmp/claude-0/-home-user-Reject-VAS/21f11d46-7d67-5d9f-8ce1-f77874d4a4f9/scratchpad/figs';
const OUT = '/home/user/Reject-VAS/output/Laporan_Penolakan_VAS_FKP_Ogos2026.docx';

const NAVY = '1F3864';
const INK = '262626';
const MUTED = '595959';
const RULE = 'B7C4D6';
const BAND = 'EAF1F8';

const CONTENT_W = 9026; // A4 (11906) less 1" margins both sides

// ---------------------------------------------------------------- helpers
const p = (text, o = {}) => new Paragraph({
  spacing: { after: o.after ?? 120, line: o.line ?? 280 },
  alignment: o.align,
  indent: o.indent,
  border: o.border,
  children: [new TextRun({
    text, font: 'Arial', size: o.size ?? 21, bold: o.bold, italics: o.italics,
    color: o.color ?? INK,
  })],
});

const rich = (runs, o = {}) => new Paragraph({
  spacing: { after: o.after ?? 120, line: 280 },
  alignment: o.align,
  children: runs.map(r => new TextRun({
    text: r.t, bold: r.b, italics: r.i, font: 'Arial', size: r.size ?? 21,
    color: r.color ?? INK,
  })),
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 340, after: 160 },
  children: [new TextRun({ text, font: 'Arial', size: 28, bold: true, color: NAVY })],
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 260, after: 120 },
  children: [new TextRun({ text, font: 'Arial', size: 23, bold: true, color: NAVY })],
});

const bullet = (text, level = 0) => new Paragraph({
  numbering: { reference: 'bullets', level },
  spacing: { after: 90, line: 280 },
  children: [new TextRun({ text, font: 'Arial', size: 21, color: INK })],
});

const fig = (file, widthIn, caption) => ([
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 140, after: 60 },
    children: [new ImageRun({
      type: 'png',
      data: fs.readFileSync(`${FIGS}/${file}`),
      transformation: { width: widthIn * 96, height: widthIn * 96 * imgRatio(file) },
    })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: caption, font: 'Arial', size: 18, italics: true, color: MUTED })],
  }),
]);

// png dimensions straight from the IHDR chunk, so figures keep their aspect ratio
function imgRatio(file) {
  const b = fs.readFileSync(`${FIGS}/${file}`);
  const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
  return h / w;
}

const cell = (text, o = {}) => new TableCell({
  width: { size: o.w, type: WidthType.DXA },
  shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
  margins: { top: 80, bottom: 80, left: 110, right: 110 },
  children: [new Paragraph({
    spacing: { after: 0, line: 260 },
    alignment: o.align,
    children: [new TextRun({
      text: String(text), font: 'Arial', size: o.size ?? 19,
      bold: o.bold, color: o.color ?? INK,
    })],
  })],
});

const table = (widths, headers, rows, aligns = []) => new Table({
  columnWidths: widths,
  width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  borders: ['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical']
    .reduce((acc, k) => (acc[k] = { style: BorderStyle.SINGLE, size: 4, color: RULE }, acc), {}),
  rows: [
    new TableRow({
      tableHeader: true,
      children: headers.map((t, i) => cell(t, {
        w: widths[i], fill: NAVY, bold: true, color: 'FFFFFF', align: aligns[i],
      })),
    }),
    ...rows.map((r, ri) => new TableRow({
      children: r.map((t, i) => cell(t, {
        w: widths[i], fill: ri % 2 ? BAND : undefined, align: aligns[i],
      })),
    })),
  ],
});

const R = AlignmentType.RIGHT;
const C = AlignmentType.CENTER;

// ---------------------------------------------------------------- content
const children = [];

// --- cover
children.push(
  new Paragraph({ spacing: { before: 1400, after: 0 }, children: [] }),
  p('LAPORAN ANALISIS MAKLUM BALAS', { align: AlignmentType.CENTER, size: 22, bold: true, color: MUTED, after: 60 }),
  p('Pesakit Yang Menolak Perkhidmatan', { align: AlignmentType.CENTER, size: 40, bold: true, color: NAVY, after: 40 }),
  p('Value Added Services (VAS)', { align: AlignmentType.CENTER, size: 40, bold: true, color: NAVY, after: 40 }),
  p('di Farmasi Klinik Pesakit Luar (FKP)', { align: AlignmentType.CENTER, size: 26, bold: true, color: NAVY, after: 320 }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 320 },
    border: { top: { style: BorderStyle.SINGLE, size: 8, color: NAVY } },
    children: [],
  }),
  p('Tempoh kutipan data:  16 Julai 2026 – 13 Ogos 2026', { align: AlignmentType.CENTER, size: 22, after: 60 }),
  p('Jumlah maklum balas dianalisis:  84 pesakit', { align: AlignmentType.CENTER, size: 22, after: 60 }),
  p('Sumber:  Borang Maklum Balas Pesakit Yang Menolak Perkhidmatan VAS di FKP', { align: AlignmentType.CENTER, size: 20, color: MUTED, after: 60 }),
  p('Tarikh laporan:  13 Ogos 2026', { align: AlignmentType.CENTER, size: 20, color: MUTED, after: 900 }),
  p('Disediakan oleh: Unit Farmasi Pesakit Luar', { align: AlignmentType.CENTER, size: 20, color: MUTED, after: 40 }),
  p('Dokumen sokongan: VAS_Rejection_Analysis_Clean_13Aug2026.xlsx', { align: AlignmentType.CENTER, size: 18, italics: true, color: MUTED }),
  new Paragraph({ children: [new PageBreak()] }),
);

// --- 1. Ringkasan eksekutif
children.push(
  h1('1.  Ringkasan Eksekutif'),
  p('Sebanyak 84 maklum balas pesakit yang menolak tawaran perkhidmatan Value Added Services (VAS) di Farmasi Klinik Pesakit Luar telah dikumpul antara 16 Julai hingga 13 Ogos 2026 dan dianalisis. Penemuan paling menonjol ialah penolakan VAS bukan disebabkan kegagalan atau kelemahan sistem, tetapi disebabkan tabiat dan corak temujanji pesakit.'),
  p('68 daripada 84 pesakit (81.0%) menolak kerana lebih suka kaedah biasa iaitu mengambil ubat sendiri di kaunter. Hanya seorang pesakit menyatakan kebimbangan terhadap kesilapan ubat, dan hanya seorang menyebut masalah waktu operasi Farmasi Pandu Lalu. Ini bermakna majoriti besar penolakan berpunca daripada faktor tingkah laku yang boleh dipengaruhi melalui pendekatan komunikasi dan penyelarasan bekalan ubat, bukannya pembaikan teknikal sistem VAS.'),
  p('Dua pemacu terbesar dalam kategori ini ialah keselesaan dengan kaedah sedia ada (33 sebutan, 39.3% pesakit) dan kekerapan temujanji hospital yang tinggi (27 sebutan, 32.1%). Pesakit yang mempunyai temujanji susulan (TCA) hampir setiap bulan melihat VAS sebagai satu langkah tambahan, kerana mereka tetap perlu hadir ke hospital.', { after: 200 }),
  p('Metrik utama', { bold: true, size: 22, after: 100 }),
  table(
    [5400, 1600, 2026],
    ['Metrik', 'Bilangan', 'Peratus'],
    [
      ['Jumlah maklum balas dianalisis', '84', '100.0%'],
      ['Pesakit hadir sendiri', '63', '75.0%'],
      ['Diwakili waris', '21', '25.0%'],
      ['Pesakit berumur 60 tahun ke atas (daripada 79 rekod berumur)', '50', '63.3%'],
      ['Kategori A — Lebih suka kaedah biasa & ambil sendiri', '68', '81.0%'],
      ['Kategori E — Halangan teknologi & celik digital', '7', '8.3%'],
      ['Kategori C — Isu ubat melalui pos (UMP)', '6', '7.1%'],
      ['Kategori B — Kebimbangan kesilapan ubat & konsultasi', '1', '1.2%'],
      ['Kategori D — Isu farmasi pandu lalu (FPL)', '1', '1.2%'],
      ['Rekod tanpa sebab direkodkan', '1', '1.2%'],
    ],
    [undefined, C, R],
  ),
  p('', { after: 120 }),
  p('Tiga jabatan menyumbang 56% daripada semua penolakan: Perubatan (Semua) 21 rekod, Orthopedic 14 rekod dan Oftalmologi 12 rekod. Intervensi yang disasarkan di tiga klinik ini akan memberi pulangan tertinggi.'),
  new Paragraph({ children: [new PageBreak()] }),
);

// --- 2. Latar belakang
children.push(
  h1('2.  Latar Belakang dan Objektif'),
  p('Perkhidmatan Value Added Services (VAS) diperkenalkan bagi mengurangkan masa menunggu pesakit di kaunter farmasi dan mengurangkan kesesakan di Farmasi Klinik Pesakit Luar. Antara kaedah yang ditawarkan ialah Ubat Melalui Pos (UMP), Farmasi Pandu Lalu (FPL) dan pendaftaran melalui aplikasi MyUbat.'),
  p('Walaupun perkhidmatan ini ditawarkan secara aktif di kaunter, sebahagian pesakit tetap memilih kaedah pengambilan ubat secara konvensional. Borang maklum balas ini diwujudkan bagi merekodkan sebab sebenar penolakan tersebut supaya strategi promosi dan penambahbaikan perkhidmatan dapat dirancang berdasarkan bukti, bukan andaian.'),
  h2('Objektif laporan'),
  bullet('Mengenal pasti sebab utama pesakit menolak tawaran perkhidmatan VAS di FKP.'),
  bullet('Menentukan kumpulan pesakit dan jabatan yang paling kerap menolak, bagi tujuan penyasaran intervensi.'),
  bullet('Membezakan antara penolakan berasaskan tabiat, halangan teknologi, dan masalah pelaksanaan perkhidmatan.'),
  bullet('Mencadangkan tindakan penambahbaikan yang boleh dilaksanakan serta penambahbaikan kualiti borang maklum balas.'),

  h1('3.  Metodologi'),
  h2('3.1  Pengumpulan data'),
  p('Data dikumpul melalui borang dalam talian yang diisi oleh anggota farmasi semasa pesakit menolak tawaran VAS di kaunter FKP. Borang merekodkan ID pesakit (SD), status individu yang hadir (pesakit sendiri atau waris), kumpulan umur, jabatan rujukan, kategori sebab penolakan, dan sub-sebab terperinci mengikut kategori.'),
  p('Sebab penolakan disusun dalam lima kategori utama (A hingga E). Bagi setiap kategori, pesakit boleh memilih lebih daripada satu sub-sebab. Oleh itu jumlah sebutan sub-sebab (89 sebutan bagi Kategori A) melebihi bilangan pesakit dalam kategori tersebut (68 pesakit).'),
  h2('3.2  Pembersihan data'),
  p('Data mentah mengandungi 84 rekod. Langkah pembersihan berikut dilaksanakan sebelum analisis, dan setiap langkah didokumenkan dalam helaian "11. Log Pembersihan" pada fail Excel yang disertakan:'),
  bullet('Lima lajur yang kosong sepenuhnya dibuang (Nama Pesakit, Sebab Penolakan [Row 2], Sebab Penolakan [Row 3], Column 9, Nama Dispenser).'),
  bullet('ID pesakit dipiawaikan kepada huruf besar tanpa ruang kosong; tiada ID berulang dikesan.'),
  bullet('Satu label kategori yang tertinggal awalan ("Lebih Suka Kaedah Biasa & Ambil Sendiri") dipadankan semula kepada Kategori A.'),
  bullet('Ejaan jabatan yang tidak seragam disatukan — contohnya Opthal, OPTHAL, Ophthalmology, oftamologi dan Oftalmologi digabungkan menjadi satu jabatan (12 rekod, sebelum ini terpecah kepada 8 dan 4).'),
  bullet('Jawapan berbilang pilihan dipecahkan mengikut senarai pilihan sebenar borang, bukan pada tanda koma, kerana tiga pilihan mengandungi koma dalam ayatnya sendiri dan akan terpotong jika dipecah secara automatik.'),
  bullet('Rekod dengan maklumat tidak lengkap atau meragukan ditandakan tetapi tidak dipadam, bagi mengekalkan ketelusan data asal.'),

  new Paragraph({ children: [new PageBreak()] }),
);

// --- 4. Profil
children.push(
  h1('4.  Profil Pesakit Yang Menolak'),
  h2('4.1  Umur'),
  p('Profil umur menunjukkan penolakan VAS tertumpu pada golongan pertengahan umur dan warga emas. Sebanyak 50 daripada 79 pesakit yang direkodkan umur (63.3%) berumur 60 tahun ke atas, dengan kumpulan 71–80 tahun sebagai yang tertinggi (26 pesakit).'),
  ...fig('fig4_umur.png', 6.4, 'Rajah 1: Taburan kumpulan umur pesakit yang menolak VAS (n=84; 5 rekod tanpa umur)'),
  h2('4.2  Status kehadiran'),
  p('Sebanyak 63 rekod (75.0%) melibatkan pesakit yang hadir sendiri, manakala 21 rekod (25.0%) diwakili oleh waris. Daripada 21 rekod yang diwakili waris, 18 tergolong dalam Kategori A. Ini menunjukkan waris merupakan saluran pendaftaran VAS yang masih belum digunakan sepenuhnya, terutamanya bagi pesakit warga emas yang tidak mempunyai telefon pintar.'),
  h2('4.3  Jabatan'),
  p('Perubatan (Semua), Orthopedic dan Oftalmologi menyumbang 47 daripada 84 rekod (56.0%). Ketiga-tiga klinik ini merupakan klinik dengan jumlah pesakit susulan yang tinggi, sejajar dengan penemuan bahawa kekerapan temujanji merupakan pemacu utama penolakan.'),
  ...fig('fig3_jabatan.png', 6.2, 'Rajah 2: Bilangan penolakan mengikut jabatan (selepas nama jabatan dipiawaikan)'),
  new Paragraph({ children: [new PageBreak()] }),
);

// --- 5. Penemuan
children.push(
  h1('5.  Penemuan Utama'),
  h2('5.1  Kategori sebab penolakan'),
  p('Taburan kategori sangat tidak seimbang. Kategori A menguasai 81.0% daripada semua penolakan, manakala empat kategori lain bersama-sama menyumbang kurang daripada 18%.'),
  ...fig('fig1_kategori.png', 6.4, 'Rajah 3: Kategori sebab penolakan VAS (n=84)'),
  p('Implikasi penting: kebimbangan terhadap keselamatan ubat — yang sering diandaikan sebagai halangan utama penerimaan VAS — hampir tidak wujud dalam data ini (1 rekod sahaja, 1.2%). Usaha promosi tidak perlu tertumpu pada meyakinkan pesakit tentang keselamatan ubat, sebaliknya perlu menangani faktor kemudahan dan tabiat.'),

  h2('5.2  Sub-sebab terperinci'),
  p('Pemecahan kepada sub-sebab memberikan gambaran yang jauh lebih berguna untuk perancangan tindakan berbanding kategori utama sahaja.'),
  ...fig('fig2_subsebab.png', 6.4, 'Rajah 4: Sub-sebab penolakan mengikut bilangan sebutan (pesakit boleh memilih lebih daripada satu sub-sebab)'),
  p('Empat sub-sebab teratas kesemuanya berada dalam Kategori A dan bersama-sama mewakili 88 daripada 104 sebutan keseluruhan (84.6%):', { after: 100 }),
  table(
    [4600, 1500, 1500, 1426],
    ['Sub-sebab', 'Kategori', 'Sebutan', '% pesakit'],
    [
      ['Lebih selesa dengan kaedah biasa di kaunter', 'A', '33', '39.3%'],
      ['Kekerapan temujanji hospital (banyak TCA hampir setiap bulan)', 'A', '27', '32.1%'],
      ['Kurang motivasi diri atau enggan mencuba sistem baharu', 'A', '14', '16.7%'],
      ['Pesakit tinggal berdekatan', 'A', '14', '16.7%'],
      ['Pesakit tiada telefon pintar', 'E', '4', '4.8%'],
      ['Penerima tiada di rumah atau sukar menunggu di rumah', 'C', '3', '3.6%'],
      ['Pesakit tiada pelan data mudah alih', 'E', '2', '2.4%'],
      ['Pengalaman buruk dengan pos sebelum ini (ubat salah / tidak cukup)', 'C', '2', '2.4%'],
      ['Pengambilan oleh pihak ketiga & institusi', 'A', '1', '1.2%'],
      ['Bimbang kesilapan ubat, terutamanya jika bertukar jenama', 'B', '1', '1.2%'],
      ['Enggan atau tidak mampu membayar caj kurier', 'C', '1', '1.2%'],
      ['Kesusahan menguasai telefon pintar dan aplikasi (OKU, warga emas)', 'E', '1', '1.2%'],
      ['Ketidakpadanan waktu operasi FPL (buka lambat, pesakit datang awal)', 'D', '1', '1.2%'],
    ],
    [undefined, C, R, R],
  ),
  p('', { after: 160 }),
  p('Perhatikan perbezaan sifat antara sub-sebab ini. "Lebih selesa dengan kaedah biasa" dan "kurang motivasi mencuba sistem baharu" adalah halangan tabiat yang boleh diatasi melalui pendedahan dan bantuan pendaftaran di tempat. Sebaliknya, "kekerapan temujanji hospital" adalah halangan struktur — selagi pesakit perlu hadir ke hospital setiap bulan, VAS tidak menawarkan penjimatan yang bermakna kepada mereka.'),

  h2('5.3  Analisis silang: umur dan kategori sebab'),
  p('Kategori E (halangan teknologi) hampir keseluruhannya melibatkan pesakit warga emas. Lima daripada tujuh rekod Kategori E berumur 61 tahun ke atas, dan puncanya ialah ketiadaan peranti — bukan keengganan menggunakan perkhidmatan.', { after: 100 }),
  table(
    [2400, 1000, 1000, 1000, 1000, 1000, 1626],
    ['Kumpulan umur', 'A', 'B', 'C', 'D', 'E', 'Jumlah'],
    [
      ['0 – 10', '2', '0', '0', '0', '0', '2'],
      ['31 – 40', '2', '0', '0', '0', '0', '2'],
      ['41 – 50', '4', '0', '0', '0', '1', '5'],
      ['51 – 60', '17', '0', '2', '1', '0', '20'],
      ['61 – 70', '18', '0', '1', '0', '1', '20'],
      ['71 – 80', '19', '1', '2', '0', '4', '26'],
      ['81 – 90', '2', '0', '0', '0', '0', '2'],
      ['91 – 100', '2', '0', '0', '0', '0', '2'],
      ['Tidak direkod', '2', '0', '1', '0', '1', '5'],
    ],
    [undefined, C, C, C, C, C, C],
  ),
  p('', { after: 160 }),
  p('Nota: dua rekod dalam kumpulan umur 0–10 tahun berkemungkinan tersalah pilih julat umur semasa mengisi borang, dan perlu disahkan semula.', { size: 19, italics: true, color: MUTED }),

  h2('5.4  Analisis silang: jabatan dan kategori sebab'),
  p('Isu ubat melalui pos (Kategori C) tertumpu pada Orthopedic (3 rekod) dan Urologi (2 rekod), manakala halangan teknologi (Kategori E) tersebar merata di seluruh jabatan. Semua enam rekod Kategori C datang daripada pesakit yang hadir sendiri.', { after: 100 }),
  table(
    [2600, 1000, 1000, 1000, 1000, 1000, 1426],
    ['Jabatan', 'A', 'B', 'C', 'D', 'E', 'Jumlah'],
    [
      ['Perubatan (Semua)', '18', '0', '1', '1', '1', '21'],
      ['Orthopedic', '9', '0', '3', '0', '1', '14'],
      ['Oftalmologi', '11', '1', '0', '0', '0', '12'],
      ['Nefrologi', '7', '0', '0', '0', '1', '8'],
      ['Urologi', '6', '0', '2', '0', '0', '8'],
      ['ENT', '5', '0', '0', '0', '1', '6'],
      ['Pulmonari', '3', '0', '0', '0', '1', '4'],
      ['Psikiatri', '2', '0', '0', '0', '1', '3'],
      ['Dermatologi', '2', '0', '0', '0', '0', '2'],
      ['Hepatologi', '2', '0', '0', '0', '0', '2'],
      ['O&G', '1', '0', '0', '0', '1', '2'],
      ['Hematologi', '1', '0', '0', '0', '0', '1'],
      ['Rehabilitasi', '1', '0', '0', '0', '0', '1'],
    ],
    [undefined, C, C, C, C, C, C],
  ),
  p('', { after: 160 }),
  p('Nota: satu rekod Orthopedic tidak mempunyai sebab penolakan yang direkodkan, menyebabkan jumlah baris tersebut tidak sepadan dengan hasil tambah lajur A hingga E.', { size: 19, italics: true, color: MUTED }),
  new Paragraph({ children: [new PageBreak()] }),
);

// --- 6. Perbincangan
children.push(
  h1('6.  Perbincangan'),
  h2('6.1  Penolakan adalah masalah nilai, bukan masalah kepercayaan'),
  p('Data menunjukkan pesakit tidak menolak VAS kerana meragui keselamatan atau ketepatan perkhidmatan. Mereka menolak kerana VAS tidak menawarkan faedah yang jelas kepada keadaan mereka. Bagi pesakit yang tinggal berdekatan hospital atau yang mempunyai temujanji bulanan, perjalanan ke hospital tetap berlaku, jadi menghantar ubat ke rumah tidak menjimatkan masa atau kos mereka.'),
  p('Ini bermakna mesej promosi berbentuk "VAS selamat dan dipercayai" tidak menyasarkan halangan sebenar. Mesej yang lebih tepat ialah menunjukkan penjimatan masa menunggu yang khusus kepada situasi pesakit tersebut, atau menyelaraskan bekalan ubat supaya bilangan kunjungan pesakit benar-benar berkurang.'),
  h2('6.2  Halangan digital adalah masalah peranti, bukan sikap'),
  p('Daripada tujuh rekod Kategori E, enam berkaitan secara langsung dengan ketiadaan telefon pintar atau pelan data. Hanya satu rekod menyebut kesukaran menguasai aplikasi. Sebahagian besar pesakit dalam kategori ini berumur 61 tahun ke atas. Justeru, latihan penggunaan aplikasi sahaja tidak akan menyelesaikan masalah ini — pesakit memerlukan laluan pendaftaran yang tidak bergantung kepada telefon pintar mereka sendiri.'),
  p('Memandangkan 25.0% maklum balas melibatkan waris yang hadir bagi pihak pesakit, pendaftaran VAS melalui akaun waris merupakan penyelesaian paling praktikal dan boleh dilaksanakan segera tanpa kos tambahan.'),
  h2('6.3  Isu UMP adalah masalah pelaksanaan penghantaran'),
  p('Enam rekod Kategori C menunjukkan corak yang konsisten: masalah bukan pada konsep penghantaran, tetapi pada pelaksanaannya — penerima tiada di rumah (3), pengalaman buruk sebelum ini iaitu ubat salah atau tidak mencukupi (2), dan caj kurier (1). Bilangan ini kecil, namun kesan reputasinya besar kerana pesakit yang pernah mengalami masalah penghantaran cenderung menolak perkhidmatan buat selama-lamanya dan memberitahu pesakit lain.'),
  h2('6.4  Isu FPL'),
  p('Hanya satu rekod menyebut Farmasi Pandu Lalu, iaitu ketidakpadanan waktu operasi (FPL dibuka lewat berbanding waktu kedatangan pesakit). Walaupun bilangannya kecil, isu ini mudah diperbaiki dan sepatutnya disemak kerana ia melibatkan penyelarasan waktu operasi sahaja.'),

  h1('7.  Cadangan Tindakan'),
  p('Cadangan disusun mengikut keutamaan berdasarkan bilangan pesakit yang akan terkesan.', { after: 140 }),
  table(
    [700, 3800, 2200, 2326],
    ['Bil.', 'Cadangan tindakan', 'Sasaran kumpulan', 'Petunjuk kejayaan'],
    [
      ['1', 'Selaraskan bekalan ubat dengan tarikh TCA — pertimbangkan bekalan 3 hingga 6 bulan atau penyelarasan tarikh temujanji pelbagai klinik supaya bilangan kunjungan berkurang.', '27 pesakit (32.1%) dengan TCA kerap', 'Pengurangan bilangan kunjungan farmasi bagi pesakit TCA bulanan'],
      ['2', 'Demonstrasi dan pendaftaran berbantu di kaunter FKP semasa pesakit menunggu — anggota membantu memuat turun dan mendaftar MyUbat di tempat.', '47 pesakit (56.0%) dalam kumpulan keselesaan dan kurang motivasi', 'Bilangan pendaftaran MyUbat baharu setiap bulan di kaunter'],
      ['3', 'Wujudkan laluan pendaftaran tanpa telefon pintar — pendaftaran melalui waris atau melalui talian telefon farmasi.', '7 pesakit Kategori E dan 21 rekod diwakili waris', 'Bilangan pendaftaran VAS melalui waris'],
      ['4', 'Perkukuh proses UMP — pengesahan penghantaran melalui SMS, slot masa penghantaran, dan semakan ganda kuantiti sebelum pos.', '6 pesakit Kategori C', 'Sifar aduan ubat salah atau tidak mencukupi'],
      ['5', 'Semak waktu operasi FPL supaya sepadan dengan waktu kedatangan awal pesakit.', 'Pesakit FPL', 'Waktu operasi FPL diselaraskan'],
      ['6', 'Sasarkan promosi di tiga klinik berkeutamaan: Perubatan (Semua), Orthopedic dan Oftalmologi.', '47 pesakit (56.0%) daripada tiga klinik', 'Kadar penerimaan VAS di tiga klinik tersebut'],
      ['7', 'Perketat reka bentuk borang maklum balas — jadikan umur dan jabatan medan wajib dengan senarai pilihan tetap, dan asingkan ruangan "sebab lain" daripada ruangan jabatan.', 'Anggota farmasi yang mengisi borang', 'Sifar rekod tidak lengkap pada pusingan seterusnya'],
    ],
    [C],
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// --- 8. Batasan
children.push(
  h1('8.  Batasan Kajian dan Kualiti Data'),
  p('Penemuan laporan ini perlu ditafsir dengan mengambil kira batasan berikut:'),
  bullet('Saiz sampel kecil (84 rekod) dan meliputi tempoh empat minggu sahaja, jadi keputusan tidak semestinya mewakili keseluruhan populasi pesakit FKP sepanjang tahun.'),
  bullet('Data merekodkan hanya pesakit yang menolak. Tanpa jumlah pesakit yang ditawarkan VAS dalam tempoh yang sama, kadar penolakan sebenar (peratus penolakan daripada jumlah tawaran) tidak dapat dikira. Ini adalah maklumat paling penting yang perlu ditambah pada pusingan pengumpulan seterusnya.'),
  bullet('Sebab penolakan dicatat oleh anggota farmasi berdasarkan pilihan yang tersedia dalam borang, jadi terdapat kemungkinan tafsiran anggota mempengaruhi kategori yang dipilih.'),
  bullet('Lima rekod tidak mempunyai maklumat umur, dan dua rekod mencatatkan umur "0 – 10 tahun" yang berkemungkinan tersalah pilih.'),
  bullet('Satu rekod tidak mempunyai sebab penolakan, dan satu rekod mencatatkan sebab penolakan di dalam ruangan jabatan ("Pemastautin tetap (IC) merah tidak dapat guna MyUbat") — perkara ini menunjukkan borang memerlukan ruangan khusus untuk sebab di luar senarai pilihan.'),
  bullet('Analisis sub-sebab dikira berdasarkan bilangan sebutan. Kerana pesakit boleh memilih lebih daripada satu sub-sebab, jumlah sebutan melebihi bilangan pesakit dan peratusan yang ditunjukkan merujuk kepada peratus pesakit yang menyebut sub-sebab tersebut.'),

  h1('9.  Kesimpulan'),
  p('Penolakan perkhidmatan VAS di FKP didorong oleh tabiat pesakit dan struktur temujanji hospital, bukan oleh kekurangan kepercayaan terhadap perkhidmatan. Lapan daripada sepuluh pesakit menolak semata-mata kerana lebih selesa mengambil ubat sendiri di kaunter, dan sebahagian besar daripada mereka tetap perlu hadir ke hospital untuk temujanji susulan.'),
  p('Oleh itu, strategi peningkatan penerimaan VAS perlu bergerak daripada pendekatan promosi umum kepada dua tindakan yang lebih spesifik: pertama, menyelaraskan bekalan ubat dan temujanji supaya VAS benar-benar mengurangkan kunjungan pesakit; dan kedua, membantu pesakit mendaftar di tempat semasa mereka menunggu, termasuk melalui waris bagi pesakit warga emas yang tiada telefon pintar.'),
  p('Pengumpulan data perlu diteruskan dengan borang yang diperkemas, dan yang paling penting, dengan merekodkan juga jumlah pesakit yang ditawarkan VAS supaya kadar penolakan sebenar dapat dipantau dari semasa ke semasa.'),

  h1('Lampiran'),
  p('Analisis penuh disertakan dalam fail VAS_Rejection_Analysis_Clean_13Aug2026.xlsx yang mengandungi helaian berikut:', { after: 100 }),
  bullet('Ringkasan Eksekutif — metrik utama dalam bentuk formula langsung daripada data bersih.'),
  bullet('Sebab Utama dan Sub-Sebab Terperinci — jadual kekerapan penuh.'),
  bullet('Jabatan, Umur dan Status Pesakit — taburan profil responden.'),
  bullet('Jadual silang Umur × Sebab dan Jabatan × Sebab.'),
  bullet('Trend Mingguan — bilangan penolakan mengikut minggu.'),
  bullet('Data Bersih — 84 rekod siap analisis, termasuk lajur nota bagi rekod yang ditandakan.'),
  bullet('Data Asal — data mentah tanpa sebarang perubahan, untuk rujukan dan pengesahan.'),
  bullet('Log Pembersihan — senarai penuh setiap langkah pembersihan yang dilaksanakan.'),
);

// ---------------------------------------------------------------- document
const doc = new Document({
  creator: 'Unit Farmasi Pesakit Luar',
  title: 'Laporan Analisis Penolakan Perkhidmatan VAS di FKP',
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.18) } } } },
        { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.6), hanging: convertInchesToTwip(0.18) } } } },
      ],
    }],
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE } },
          children: [new TextRun({
            text: 'Laporan Analisis Penolakan Perkhidmatan VAS di FKP  |  16 Julai – 13 Ogos 2026',
            font: 'Arial', size: 16, color: MUTED,
          })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: ['Muka surat ', PageNumber.CURRENT, ' daripada ', PageNumber.TOTAL_PAGES],
            font: 'Arial', size: 16, color: MUTED })],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync(OUT, b);
  console.log('written', OUT, b.length, 'bytes');
});
