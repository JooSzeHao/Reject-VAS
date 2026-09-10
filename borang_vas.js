const {Document,Packer,Paragraph,TextRun,HeadingLevel,AlignmentType,Table,TableRow,TableCell,WidthType,BorderStyle,ShadingType,Header,Footer,PageNumber,LevelFormat} = require('docx');
const fs=require('fs');

const W=9360; // A4 usable width dxa (approx, 1" margins)
const NB={top:{style:BorderStyle.NONE,size:0},bottom:{style:BorderStyle.NONE,size:0},left:{style:BorderStyle.NONE,size:0},right:{style:BorderStyle.NONE,size:0}};
const line=(sz=6)=>({top:{style:BorderStyle.SINGLE,size:sz,color:"808080"},bottom:{style:BorderStyle.SINGLE,size:sz,color:"808080"},left:{style:BorderStyle.SINGLE,size:sz,color:"808080"},right:{style:BorderStyle.SINGLE,size:sz,color:"808080"}});

const p=(txt,o={})=>new Paragraph({spacing:{after:o.after??100,before:o.before??0},alignment:o.align,indent:o.indent,border:o.border,
  children:[new TextRun({text:txt,bold:o.bold,italics:o.italics,size:o.size??20,color:o.color,allCaps:o.caps})]});
const bi=(ms,en,o={})=>new Paragraph({spacing:{after:o.after??120},indent:o.indent,children:[
  new TextRun({text:ms,size:o.size??20,bold:o.bold}),
  new TextRun({text:"  "+en,size:(o.size??20)-1,italics:true,color:"555555"})]});

// section heading bar
const bar=(n,ms,en)=>new Table({columnWidths:[W],width:{size:W,type:WidthType.DXA},borders:NB,rows:[new TableRow({children:[new TableCell({
  width:{size:W,type:WidthType.DXA},borders:NB,shading:{type:ShadingType.CLEAR,fill:"1F3864",color:"auto"},
  margins:{top:60,bottom:60,left:120,right:120},
  children:[new Paragraph({spacing:{after:0},children:[
    new TextRun({text:`BAHAGIAN ${n}: ${ms}`,bold:true,size:20,color:"FFFFFF"}),
    new TextRun({text:`  / ${en}`,size:18,color:"D9E2F3",italics:true})]})]})]})]});

// field grid rows: [labelMs, labelEn, spanWholeRow?]
const fieldCell=(ms,en,w)=>new TableCell({width:{size:w,type:WidthType.DXA},borders:line(),margins:{top:80,bottom:200,left:120,right:120},
  children:[new Paragraph({spacing:{after:0},children:[new TextRun({text:ms,size:17,bold:true}),new TextRun({text:" / "+en,size:15,italics:true,color:"555555"})]})]});
const grid=(rows)=>new Table({columnWidths:[W/2,W/2],width:{size:W,type:WidthType.DXA},borders:line(),
  rows:rows.map(r=>new TableRow({children:r.length===1?[Object.assign(fieldCell(r[0][0],r[0][1],W),{})]:r.map(c=>fieldCell(c[0],c[1],W/2))}))});

// checkbox line
const cb=(ms,en)=>new Paragraph({spacing:{after:80},indent:{left:280},children:[
  new TextRun({text:"❑  ",size:22}),new TextRun({text:ms,size:19}),
  ...(en?[new TextRun({text:"  ("+en+")",size:17,italics:true,color:"555555"})]:[])]});

const sigCell=(roleMs,roleEn,idLabel)=>new TableCell({width:{size:W/2,type:WidthType.DXA},borders:NB,margins:{right:180,top:0,bottom:0},children:[
  new Paragraph({spacing:{before:600,after:40},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"000000"}},children:[new TextRun({text:"",size:18})]}),
  new Paragraph({spacing:{after:0},children:[new TextRun({text:roleMs,size:17,bold:true})]}),
  new Paragraph({spacing:{after:100},children:[new TextRun({text:roleEn,size:15,italics:true,color:"555555"})]}),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"Nama / Name: ______________________________",size:16})]}),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:idLabel,size:16})]}),
  new Paragraph({spacing:{after:200},children:[new TextRun({text:"Tarikh / Date: ______________________________",size:16})]})]});

const doc=new Document({
  numbering:{config:[{reference:"ack",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.START,
    style:{paragraph:{indent:{left:400,hanging:280}}}}]}]},
  sections:[{properties:{page:{margin:{top:1080,bottom:900,left:1080,right:1080}}},
  headers:{default:new Header({children:[
    p("KEMENTERIAN KESIHATAN MALAYSIA",{align:AlignmentType.CENTER,bold:true,size:16,after:0,color:"808080"}),
    p("[NAMA HOSPITAL / JABATAN FARMASI]",{align:AlignmentType.CENTER,size:16,after:60,color:"808080"})]})},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[
    new TextRun({text:"Borang VAS-01 (Pin. 2026)  •  Simpan salinan asal dalam rekod farmasi pesakit  •  Halaman ",size:14,color:"808080"}),
    new TextRun({children:[PageNumber.CURRENT],size:14,color:"808080"}),
    new TextRun({text:" / ",size:14,color:"808080"}),
    new TextRun({children:[PageNumber.TOTAL_PAGES],size:14,color:"808080"})]})]})},
  children:[
  p("BORANG PENGESAHAN PENOLAKAN PERKHIDMATAN NILAI DITAMBAH (VAS)",{align:AlignmentType.CENTER,bold:true,size:26,after:40}),
  p("Value Added Services (VAS) Declination Consent Form",{align:AlignmentType.CENTER,italics:true,size:20,color:"555555",after:60}),
  p("Bagi Preskripsi Ulangan / Susulan  •  For Repeat / Follow-up Prescriptions",{align:AlignmentType.CENTER,size:18,after:200,color:"1F3864"}),

  new Table({columnWidths:[W],width:{size:W,type:WidthType.DXA},borders:line(),rows:[new TableRow({children:[new TableCell({
    width:{size:W,type:WidthType.DXA},borders:line(),shading:{type:ShadingType.CLEAR,fill:"F2F2F2",color:"auto"},
    margins:{top:120,bottom:120,left:160,right:160},children:[
    bi("Selaras dengan dasar hospital, preskripsi ulangan tidak lagi dikutip di kaunter farmasi pesakit luar. Ubat susulan akan dibekalkan melalui salah satu Perkhidmatan Nilai Ditambah (VAS) yang disediakan.",
       "In line with hospital policy, repeat prescriptions are no longer collected over the outpatient pharmacy counter. Follow-up medicines are supplied through one of the available Value Added Services (VAS).",{after:100}),
    bi("Borang ini hanya perlu diisi jika pesakit memilih untuk TIDAK menggunakan mana-mana perkhidmatan VAS. Pengisian borang ini adalah secara sukarela dan tidak akan menjejaskan rawatan pesakit.",
       "This form is completed only if the patient chooses NOT to use any VAS. Completion is voluntary and will not affect the patient's treatment.",{after:0,bold:false})]})]})]}),
  p("",{after:160}),

  bar("A","MAKLUMAT PESAKIT","Patient Information"),
  p("",{after:60}),
  grid([[["Nama Pesakit","Patient Name"],["No. Kad Pengenalan","IC / Passport No."]],
        [["No. Pendaftaran (RN)","Registration No."],["Umur / Jantina","Age / Sex"]],
        [["No. Telefon","Contact No."],["Jabatan / Klinik Pengendali","Referring Clinic"]],
        [["Alamat Surat-Menyurat","Mailing Address"],["Tarikh Temujanji Susulan (TCA)","Next Appointment Date"]]]),
  p("",{after:160}),

  bar("B","PERKHIDMATAN VAS YANG TELAH DITERANGKAN","VAS Options Explained to Patient"),
  bi("Saya mengesahkan bahawa pilihan berikut telah diterangkan kepada saya oleh anggota farmasi:",
     "I confirm the following options were explained to me by pharmacy staff:",{after:80}),
  cb("Ubat Melalui Pos (UMP)","Medicines by Post"),
  cb("Farmasi Pandu Lalu (FPL)","Drive-Through Pharmacy"),
  cb("Pendispensan Ubat di Lokasi Bersama / Lokar Ubat","Off-site dispensing / Medicine Locker"),
  cb("Sistem Pendispensan Ubat Bersepadu / Aplikasi MyUbat","Integrated dispensing system / MyUbat app"),
  cb("Pengambilan oleh wakil atau ahli keluarga","Collection by an appointed representative"),
  cb("Lain-lain (nyatakan): ______________________________________","Others (specify)"),
  p("",{after:160}),

  bar("C","SEBAB PENOLAKAN","Reason for Declining"),
  bi("Tandakan sebab utama (boleh pilih lebih daripada satu):","Tick the main reason(s) — more than one may apply:",{after:80}),
  p("A) Lebih suka kaedah biasa & ambil sendiri  /  Prefers the usual counter method",{bold:true,size:19,after:40,indent:{left:120}}),
  cb("Lebih selesa dengan kaedah biasa di kaunter",""),
  cb("Pesakit tinggal berdekatan hospital",""),
  cb("Kekerapan temujanji hospital (TCA hampir setiap bulan)",""),
  cb("Pengambilan oleh pihak ketiga / institusi (rumah orang tua, penjara)",""),
  p("B) Kebimbangan terhadap kesilapan ubat & konsultasi  /  Concerns over medication error & counselling",{bold:true,size:19,after:40,before:80,indent:{left:120}}),
  cb("Bimbang tentang kesilapan ubat, terutamanya jika terdapat pertukaran jenama",""),
  cb("Ingin berjumpa ahli farmasi secara bersemuka",""),
  p("C) Isu berkaitan Ubat Melalui Pos (UMP)  /  Postal delivery issues",{bold:true,size:19,after:40,before:80,indent:{left:120}}),
  cb("Pengalaman buruk dengan pos sebelum ini (ubat salah atau tidak mencukupi)",""),
  cb("Penerima tiada di rumah atau sukar menunggu di rumah",""),
  cb("Enggan atau tidak mampu membayar caj kurier",""),
  p("D) Isu berkaitan Farmasi Pandu Lalu (FPL)  /  Drive-through issues",{bold:true,size:19,after:40,before:80,indent:{left:120}}),
  cb("Ketidakpadanan waktu operasi (FPL buka lambat, pesakit datang awal)",""),
  cb("Tiada kenderaan sendiri",""),
  p("E) Halangan teknologi & celik digital  /  Technology & digital literacy barriers",{bold:true,size:19,after:40,before:80,indent:{left:120}}),
  cb("Kesusahan menguasai penggunaan telefon pintar dan aplikasi (cth. OKU, warga emas)",""),
  cb("Pesakit tiada telefon pintar",""),
  cb("Pesakit tiada pelan data mudah alih",""),
  p("Lain-lain / Others: ______________________________________________________________",{size:19,after:60,before:120,indent:{left:280}}),
  p("_________________________________________________________________________________",{size:19,after:160,indent:{left:280}}),

  bar("D","PENGAKUAN PESAKIT","Patient Declaration"),
  bi("Saya, yang bertandatangan di bawah, dengan ini mengaku bahawa:","I, the undersigned, hereby declare that:",{after:100}),
  ...[["Perkhidmatan Nilai Ditambah (VAS) yang disediakan oleh hospital, termasuk cara pendaftaran dan cara ubat dibekalkan, telah diterangkan kepada saya dalam bahasa yang saya fahami.",
      "The VAS available at this hospital, including how to register and how medicines are supplied, were explained to me in a language I understand."],
     ["Saya telah diberi peluang untuk bertanya dan segala pertanyaan saya telah dijawab dengan memuaskan.",
      "I was given the opportunity to ask questions and my questions were answered satisfactorily."],
     ["Atas kerelaan sendiri, saya memilih untuk TIDAK menggunakan mana-mana perkhidmatan VAS bagi preskripsi ulangan saya pada masa ini.",
      "Of my own free will, I choose NOT to use any VAS for my repeat prescription at this time."],
     ["Saya memahami bahawa preskripsi ulangan tidak dikutip di kaunter farmasi pesakit luar, dan saya bertanggungjawab sepenuhnya untuk mendapatkan bekalan ubat susulan saya melalui pengaturan yang dipersetujui bersama anggota farmasi.",
      "I understand that repeat prescriptions are not collected at the outpatient pharmacy counter, and that I am fully responsible for obtaining my follow-up supply through the arrangement agreed with pharmacy staff."],
     ["Saya memahami risiko yang mungkin timbul daripada keputusan ini, termasuk kelewatan atau terputusnya bekalan ubat sekiranya saya tidak hadir seperti yang diaturkan.",
      "I understand the possible risks of this decision, including delay or interruption of my medicine supply if I do not attend as arranged."],
     ["Keputusan ini tidak menjejaskan hak saya untuk mendapatkan rawatan, dan saya boleh menarik semula penolakan ini serta mendaftar untuk VAS pada bila-bila masa.",
      "This decision does not affect my right to treatment, and I may withdraw this declination and enrol in VAS at any time."],
     ["Saya bersetuju maklumat dalam borang ini digunakan bagi tujuan rekod perubatan, pemantauan kualiti dan penambahbaikan perkhidmatan, selaras dengan peruntukan perlindungan data yang berkuat kuasa.",
      "I consent to the information in this form being used for medical records, quality monitoring and service improvement, in accordance with applicable data protection provisions."]]
    .map(([ms,en])=>new Paragraph({numbering:{reference:"ack",level:0},spacing:{after:120},children:[
      new TextRun({text:ms,size:19}),new TextRun({text:"  "+en,size:17,italics:true,color:"555555"})]})),
  p("",{after:120}),

  bar("E","TANDATANGAN","Signatures"),
  p("",{after:60}),
  new Table({columnWidths:[W/2,W/2],width:{size:W,type:WidthType.DXA},borders:NB,rows:[
    new TableRow({children:[sigCell("Pesakit","Patient","No. K/P / IC No.: __________________________"),sigCell("Wakil / Penjaga (jika berkenaan)","Representative / Guardian (if applicable)","No. K/P / IC No.: __________________________")]}),
    new TableRow({children:[sigCell("Anggota Farmasi (Saksi)","Pharmacy Staff (Witness)","Jawatan & Cop Rasmi / Post & Official Stamp: ______"),sigCell("Ahli Farmasi Bertanggungjawab","Pharmacist in Charge","No. Pendaftaran MPS / Cop Rasmi: ____________")]})]}),
  p("Hubungan wakil dengan pesakit / Relationship of representative to patient: ______________________________",{size:17,after:40}),
  p("Sebab pesakit tidak dapat menandatangani sendiri / Reason patient is unable to sign: __________________________",{size:17,after:200}),

  new Table({columnWidths:[W],width:{size:W,type:WidthType.DXA},borders:line(),rows:[new TableRow({children:[new TableCell({
    width:{size:W,type:WidthType.DXA},borders:line(),shading:{type:ShadingType.CLEAR,fill:"FFF2CC",color:"auto"},
    margins:{top:120,bottom:120,left:160,right:160},children:[
    p("KEGUNAAN JABATAN FARMASI SAHAJA / FOR PHARMACY USE ONLY",{bold:true,size:18,after:100}),
    p("Cara bekalan ubat yang dipersetujui / Agreed supply arrangement: _____________________________________",{size:17,after:60}),
    p("Kod sebab (A/B/C/D/E): ________    Dimasukkan ke pangkalan data VAS pada / Entered into VAS database on: ____________",{size:17,after:60}),
    p("Dirujuk semula untuk kaunseling VAS / Re-referred for VAS counselling:  ❑ Ya / Yes   ❑ Tidak / No",{size:17,after:0})]})]})]}),
  ]}]});

Packer.toBuffer(doc).then(b=>fs.writeFileSync("Borang_Penolakan_VAS.docx",b));
