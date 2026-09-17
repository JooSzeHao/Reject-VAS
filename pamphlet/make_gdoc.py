#!/usr/bin/env python3
"""
Builds the version D pamphlet as a .docx whose decision trees are real tables,
so every word stays editable once the file is converted to a Google Doc.
Run:  python3 pamphlet/make_gdoc.py
"""
import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

HERE = os.path.dirname(os.path.abspath(__file__))
QR = os.path.join(HERE, 'qr_myubat.png')
OUT = os.path.join(HERE, '..', 'output', 'Risalah_VAS_D_PokokKeputusan.docx')

BLACK = RGBColor(0, 0, 0)
GREY = RGBColor(0x33, 0x33, 0x33)


# ----------------------------------------------------------------- xml helpers
# Word validates the child order of tblPr and tcPr. Appending is not enough:
# an out-of-order tblBorders makes the file unopenable, so insert by schema.
TBL_PR_SEQ = ['tblStyle', 'tblpPr', 'tblOverlap', 'bidiVisual', 'tblStyleRowBandSize',
              'tblStyleColBandSize', 'tblW', 'jc', 'tblCellSpacing', 'tblInd',
              'tblBorders', 'shd', 'tblLayout', 'tblCellMar', 'tblLook']
TC_PR_SEQ = ['cnfStyle', 'tcW', 'gridSpan', 'hMerge', 'vMerge', 'tcBorders', 'shd',
             'noWrap', 'tcMar', 'textDirection', 'tcFitText', 'vAlign', 'hideMark']


def put(pr, el, seq):
    """Insert el into pr at the position the schema requires."""
    name = el.tag.split('}')[1]
    rank = seq.index(name)
    for child in pr:
        child_name = child.tag.split('}')[1]
        if child_name in seq and seq.index(child_name) > rank:
            child.addprevious(el)
            return
    pr.append(el)


def set_borders(obj, edges, sz=12, color='000000', space=0):
    """Apply borders to a cell or a table. `edges` maps edge name -> True."""
    is_table = hasattr(obj, 'rows')
    pr = obj._tbl.tblPr if is_table else obj._tc.get_or_add_tcPr()
    tag = 'w:tblBorders' if is_table else 'w:tcBorders'
    seq = TBL_PR_SEQ if is_table else TC_PR_SEQ
    existing = pr.find(qn(tag))
    if existing is not None:
        pr.remove(existing)
    borders = OxmlElement(tag)
    for edge in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        el = OxmlElement(f'w:{edge}')
        if edges.get(edge):
            el.set(qn('w:val'), 'single')
            el.set(qn('w:sz'), str(sz))
            el.set(qn('w:space'), str(space))
            el.set(qn('w:color'), color)
        else:
            el.set(qn('w:val'), 'nil')
        borders.append(el)
    put(pr, borders, seq)


def shade(cell, fill='000000'):
    el = OxmlElement('w:shd')
    el.set(qn('w:val'), 'clear')
    el.set(qn('w:fill'), fill)
    put(cell._tc.get_or_add_tcPr(), el, TC_PR_SEQ)


def cell_margins(cell, top=80, bottom=80, left=110, right=110):
    pr = cell._tc.get_or_add_tcPr()
    existing = pr.find(qn('w:tcMar'))
    if existing is not None:
        pr.remove(existing)
    mar = OxmlElement('w:tcMar')
    for name, val in (('top', top), ('left', left), ('bottom', bottom), ('right', right)):
        el = OxmlElement(f'w:{name}')
        el.set(qn('w:w'), str(val))
        el.set(qn('w:type'), 'dxa')
        mar.append(el)
    put(pr, mar, TC_PR_SEQ)


def widths(table, cm_list):
    table.autofit = False
    for row in table.rows:
        for i, w in enumerate(cm_list):
            row.cells[i].width = Cm(w)


# ----------------------------------------------------------------- text helpers
def style_par(par, before=0, after=0, line=None, align=None):
    pf = par.paragraph_format
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    if line:
        pf.line_spacing = line
    if align is not None:
        par.alignment = align
    return par


def run(par, text, size=11, bold=False, italic=False, color=BLACK, caps=False, spacing=None):
    r = par.add_run(text.upper() if caps else text)
    r.font.name = 'Arial'
    r.font.size = Pt(size)
    r.bold = bold
    r.italic = italic
    r.font.color.rgb = color
    r._element.rPr.rFonts.set(qn('w:eastAsia'), 'Arial')
    return r


def cell_text(cell, lines, clear=True):
    """lines = list of dicts: {t, size, bold, color, after, before}"""
    if clear:
        cell.text = ''
    first = cell.paragraphs[0]
    for i, spec in enumerate(lines):
        par = first if i == 0 else cell.add_paragraph()
        style_par(par, before=spec.get('before', 0), after=spec.get('after', 0), line=1.15)
        run(par, spec['t'], size=spec.get('size', 11), bold=spec.get('bold', False),
            color=spec.get('color', BLACK), caps=spec.get('caps', False),
            spacing=spec.get('spacing'))


# ----------------------------------------------------------------- building blocks
def heading_bar(doc, text, lead=None):
    par = style_par(doc.add_paragraph(), before=10, after=2)
    run(par, text, size=12.5, bold=True, caps=True, spacing=10)
    pbdr = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), '16')
    bottom.set(qn('w:space'), '3')
    bottom.set(qn('w:color'), '000000')
    pbdr.append(bottom)
    par._p.get_or_add_pPr().append(pbdr)
    if lead:
        lp = style_par(doc.add_paragraph(), before=4, after=4)
        run(lp, lead, size=9.5, color=GREY)


def note_box(doc, bold_lead, body):
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.LEFT
    set_borders(t, {'top': 1, 'left': 1, 'bottom': 1, 'right': 1}, sz=16)
    c = t.cell(0, 0)
    cell_margins(c, 110, 110, 140, 140)
    c.text = ''
    par = style_par(c.paragraphs[0], line=1.2)
    run(par, bold_lead + ' ', size=10, bold=True)
    run(par, body, size=10)
    style_par(doc.add_paragraph(), after=0).paragraph_format.space_after = Pt(6)
    return t


def tree(doc, nodes, col_cm=(7.4, 1.5, 8.6)):
    """nodes = list of dicts:
       {'q': (label, question)}  or  {'leaf': (title, [notes]), 'full': bool}
       Question rows are followed by a 'TIDAK' connector row automatically."""
    rows = len(nodes) * 2 - 1
    t = doc.add_table(rows=rows, cols=3)
    t.alignment = WD_TABLE_ALIGNMENT.LEFT
    set_borders(t, {}, sz=0)
    widths(t, list(col_cm))

    for i, node in enumerate(nodes):
        r = t.rows[i * 2]
        qc, mc, lc = r.cells[0], r.cells[1], r.cells[2]

        if 'q' in node:
            label, question, leaf_title, leaf_notes = node['q']
            set_borders(qc, {'top': 1, 'left': 1, 'bottom': 1, 'right': 1}, sz=18)
            for c in (qc, mc, lc):
                cell_margins(c, 120, 120, 150, 150)
            cell_text(qc, [
                {'t': label, 'size': 9, 'color': GREY, 'after': 3, 'spacing': 12},
                {'t': question, 'size': 12.5, 'bold': True},
            ])
            mp = style_par(mc.paragraphs[0], before=14, align=WD_ALIGN_PARAGRAPH.CENTER)
            run(mp, 'YA →', size=10.5, bold=True)
            set_borders(lc, {'top': 1, 'left': 1, 'bottom': 1, 'right': 1}, sz=24)
            cell_text(lc, [{'t': leaf_title, 'size': 13, 'bold': True, 'after': 3}] +
                          [{'t': n, 'size': 10, 'after': 1} for n in leaf_notes])
        else:
            title, notes = node['leaf']
            qc.merge(lc)
            merged = t.rows[i * 2].cells[0]
            set_borders(merged, {'top': 1, 'left': 1, 'bottom': 1, 'right': 1}, sz=24)
            cell_margins(merged, 120, 120, 150, 150)
            cell_text(merged, [{'t': title, 'size': 13, 'bold': True, 'after': 3}] +
                              [{'t': n, 'size': 10, 'after': 1} for n in notes])

        # connector row
        if i * 2 + 1 < rows:
            cr = t.rows[i * 2 + 1]
            for c in cr.cells:
                cell_margins(c, 40, 40, 150, 150)
            cp = style_par(cr.cells[0].paragraphs[0], before=2, after=2)
            run(cp, '↓  TIDAK', size=10.5, bold=True)
    return t


def spacer(doc, pts=6):
    style_par(doc.add_paragraph(), after=pts)


# ----------------------------------------------------------------- document
doc = Document()

st = doc.styles['Normal']
st.font.name = 'Arial'
st.font.size = Pt(11)
st.element.rPr.rFonts.set(qn('w:eastAsia'), 'Arial')
st.paragraph_format.space_after = Pt(0)
st.paragraph_format.line_spacing = 1.2

sec = doc.sections[0]
sec.top_margin = Cm(1.2)
sec.bottom_margin = Cm(1.0)
sec.left_margin = Cm(1.3)
sec.right_margin = Cm(1.3)

# ---------------- masthead
head = doc.add_table(rows=1, cols=2)
set_borders(head, {}, sz=0)
widths(head, [13.4, 4.1])
left, right = head.cell(0, 0), head.cell(0, 1)
cell_margins(left, 0, 0, 0, 120)
cell_margins(right, 0, 0, 120, 0)

left.text = ''
p = style_par(left.paragraphs[0], after=5)
run(p, 'Jabatan Farmasi · Hospital Sultan Idris Shah, Serdang', size=9, caps=True, spacing=14)
p = style_par(left.add_paragraph(), after=3)
run(p, 'Ambil ubat susulan', size=23, bold=True)
p = style_par(left.add_paragraph(), after=5)
run(p, 'tanpa beratur.', size=23, bold=True)
p = style_par(left.add_paragraph(), after=0)
run(p, 'Perkhidmatan Nilai Tambah Farmasi (VAS)', size=11)

right.text = ''
p = style_par(right.paragraphs[0], after=3, align=WD_ALIGN_PARAGRAPH.CENTER)
run(p, 'MyUBAT', size=11.5, bold=True)
p = style_par(right.add_paragraph(), after=2, align=WD_ALIGN_PARAGRAPH.CENTER)
p.add_run().add_picture(QR, width=Cm(2.6))
p = style_par(right.add_paragraph(), after=0, align=WD_ALIGN_PARAGRAPH.CENTER)
run(p, 'Imbas untuk muat turun aplikasi', size=8, color=GREY)

rule = style_par(doc.add_paragraph(), before=2, after=2)
pbdr = OxmlElement('w:pBdr')
b = OxmlElement('w:bottom')
b.set(qn('w:val'), 'single'); b.set(qn('w:sz'), '20')
b.set(qn('w:space'), '1'); b.set(qn('w:color'), '000000')
pbdr.append(b)
rule._p.get_or_add_pPr().append(pbdr)

# ---------------- tree 1
heading_bar(doc, 'Perkhidmatan mana untuk saya?',
            'Mula di soalan 1. Jawab YA atau TIDAK, dan ikut turun sehingga anda sampai ke kotak tebal.')
spacer(doc, 4)
tree(doc, [
    {'q': ('SOALAN 1', 'Mahu ubat dihantar terus ke rumah?',
           'UBAT MELALUI POS',
           ['Dihantar ke alamat pilihan.', 'Mohon 3–4 minggu awal.'])},
    {'q': ('SOALAN 2', 'Anda datang ke hospital dengan kereta?',
           'FARMASI PANDU LALU',
           ['Ambil dari dalam kereta.', '12.00 t.hari – 7.00 ptg (Isnin – Jumaat).'])},
    {'q': ('SOALAN 3', 'Mahu ambil bila-bila masa — termasuk malam dan hujung minggu?',
           'LOCKER4U',
           ['Lokar Farmasi Klinik Pakar 1. Buka 24 jam.', 'Ambil dalam tempoh 3 hari.'])},
    {'leaf': ('TANYA STAF KAMI', ['Kami cadangkan pilihan yang paling sesuai untuk anda.'])},
])

spacer(doc, 8)
note_box(doc, 'Temujanji hampir setiap bulan?',
         'Beritahu kami. Kami semak sama ada bekalan ubat anda boleh dipanjangkan, '
         'supaya kunjungan anda betul-betul berkurang.')
note_box(doc, 'Mohon sebelum ubat habis.',
         'Sekurang-kurangnya 3 hingga 4 minggu awal bagi pos. Setiap permohonan '
         'disemak dalam 3 hingga 5 hari bekerja.')

p = style_par(doc.add_paragraph(), before=6, align=WD_ALIGN_PARAGRAPH.CENTER)
run(p, 'Muka 1 daripada 2 · sila terbalikkan', size=8.5, color=GREY)

doc.add_page_break()

# ---------------- tree 2
heading_bar(doc, 'Bagaimana saya mendaftar?', 'Ikut cara yang sama.')
spacer(doc, 4)
tree(doc, [
    {'q': ('SOALAN 1', 'Anda ada telefon pintar?',
           'DAFTAR SENDIRI', ['Imbas kod QR di muka hadapan.'])},
    {'q': ('SOALAN 2', 'Ada waris yang boleh tolong?',
           'WARIS DAFTARKAN', ['Anak boleh mohon bagi pihak anda.'])},
    {'leaf': ('STAF DAFTARKAN DI KAUNTER',
              ['Beritahu staf hari ini — lebih kurang 5 minit sahaja.'])},
])

# ---------------- FAQ (two-column table, still fully editable)
spacer(doc, 6)
heading_bar(doc, 'Soalan lazim')
spacer(doc, 4)

FAQ = [
    ('“Kalau saya tak suka, boleh berhenti?”',
     'Boleh, bila-bila masa. Tiada ikatan — anda kembali ke kaunter seperti biasa.'),
    ('“Semua ubat boleh?”',
     'Kebanyakan ubat susulan boleh. Ubat sejuk dan ubat kawalan perlu diambil di kaunter — staf akan maklumkan.'),
    ('“Bimbang ubat salah atau tak cukup.”',
     'Setiap bekalan disemak ahli farmasi sebelum dihantar. Ada masalah, kami betulkan tanpa kos.'),
    ('“Mahal ke bayar pos?”',
     'Ubat tetap percuma. Hanya caj kurier minimum. Lokar dan Pandu Lalu tiada caj langsung.'),
    ('“Macam mana saya tahu ubat dah dipos?”',
     'Nombor jejak dipaparkan dalam aplikasi MyUBAT sebaik ubat dihantar.'),
    ('“Kalau saya tiada di rumah?”',
     'Hantar ke alamat lain, atau pilih Lokar 24 jam.'),
    ('“Boleh orang lain ambil untuk saya?”',
     'Boleh. Bawa No. Rujukan MyUBAT dan kad pengenalan.'),
    ('“Saya nak jumpa ahli farmasi.”',
     'Kaunseling tetap ada — semasa temujanji anda atau melalui telefon.'),
]
half = (len(FAQ) + 1) // 2
ft = doc.add_table(rows=1, cols=2)
set_borders(ft, {}, sz=0)
widths(ft, [8.6, 8.6])
for col, chunk in enumerate((FAQ[:half], FAQ[half:])):
    c = ft.cell(0, col)
    cell_margins(c, 0, 0, 0 if col == 0 else 160, 160 if col == 0 else 0)
    c.text = ''
    for i, (q, a) in enumerate(chunk):
        par = c.paragraphs[0] if i == 0 else c.add_paragraph()
        style_par(par, before=0 if i == 0 else 5, after=1, line=1.15)
        run(par, q, size=10.2, bold=True)
        ap = c.add_paragraph()
        style_par(ap, after=0, line=1.15)
        run(ap, a, size=10)

# ---------------- decision box
spacer(doc, 8)
dt = doc.add_table(rows=1, cols=1)
set_borders(dt, {'top': 1, 'left': 1, 'bottom': 1, 'right': 1}, sz=20)
dc = dt.cell(0, 0)
cell_margins(dc, 140, 140, 170, 170)
dc.text = ''
p = style_par(dc.paragraphs[0], after=6)
run(p, 'Keputusan anda hari ini — tandakan satu', size=12.5, bold=True, caps=True, spacing=10)

CHOICES = [
    ('YA — saya daftar sendiri.', 'Imbas kod QR di muka hadapan dan daftar MyUBAT.'),
    ('YA — tolong daftarkan saya.', 'Staf akan bantu daftar di kaunter sekarang. Lebih kurang 5 minit.'),
    ('SAYA BERMINAT — nak baca dahulu.', 'Minta Panduan Lengkap MyUBAT daripada staf.'),
    ('BELUM — saya kekal ambil di kaunter.', 'Tiada masalah. Tawaran ini kekal terbuka.'),
]
for i, (title, sub) in enumerate(CHOICES):
    p = style_par(dc.add_paragraph(), before=0 if i == 0 else 5, after=1)
    run(p, '☐  ', size=15)
    run(p, title, size=11.2, bold=True)
    p = style_par(dc.add_paragraph(), after=0)
    p.paragraph_format.left_indent = Cm(0.85)
    run(p, sub, size=9.8, color=GREY)

# ---------------- contact
spacer(doc, 8)
ct = doc.add_table(rows=1, cols=1)
set_borders(ct, {'top': 1}, sz=24)
cc = ct.cell(0, 0)
cell_margins(cc, 140, 0, 0, 0)
cc.text = ''
p = style_par(cc.paragraphs[0], after=3)
run(p, '03-8947 5555   samb. 1113', size=16.5, bold=True)
p = style_par(cc.add_paragraph(), after=0)
run(p, 'Jabatan Farmasi, Hospital Sultan Idris Shah, Serdang · atau menu '
       '“Meja Bantuan” dalam aplikasi MyUBAT.', size=10)

p = style_par(doc.add_paragraph(), before=6, align=WD_ALIGN_PARAGRAPH.CENTER)
run(p, 'Muka 2 daripada 2', size=8.5, color=GREY)

doc.save(OUT)
print('wrote', os.path.normpath(OUT))


# ----------------------------------------------------------------- slim the file
# python-docx ships a large default template. The document uses only direct
# formatting (no named styles), so the bulky parts can go - which keeps the
# upload small enough to hand to Drive in one piece.
import re
import shutil
import zipfile

MINIMAL_STYLES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr>
<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/>
<w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="ms-MY"/>
</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr>
<w:spacing w:after="0" w:line="276" w:lineRule="auto"/>
</w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal">
<w:name w:val="Normal"/><w:qFormat/>
</w:style>
<w:style w:type="table" w:default="1" w:styleId="TableNormal">
<w:name w:val="Normal Table"/><w:semiHidden/><w:unhideWhenUsed/>
<w:tblPr><w:tblInd w:w="0" w:type="dxa"/>
<w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/>
<w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar>
</w:tblPr></w:style>
</w:styles>'''

DROP = {'word/stylesWithEffects.xml', 'word/numbering.xml', 'docProps/thumbnail.jpeg'}

def slim(path):
    tmp = path + '.tmp'
    with zipfile.ZipFile(path) as zin, \
         zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zout:
        for item in zin.infolist():
            if item.filename in DROP:
                continue
            data = zin.read(item.filename)
            if item.filename == 'word/styles.xml':
                data = MINIMAL_STYLES.encode('utf-8')
            elif item.filename in ('[Content_Types].xml', 'word/_rels/document.xml.rels',
                                   '_rels/.rels'):
                text = data.decode('utf-8')
                for gone in ('stylesWithEffects', 'numbering', 'thumbnail'):
                    text = re.sub(r'<(?:Override|Relationship)\b[^>]*' + gone + r'[^>]*/>',
                                  '', text)
                data = text.encode('utf-8')
            zout.writestr(item, data)
    shutil.move(tmp, path)
    print('slimmed to', os.path.getsize(path), 'bytes')


slim(OUT)
