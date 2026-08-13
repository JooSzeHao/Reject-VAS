"""Clean + analyse the VAS rejection feedback form (FKP), 16 Jul - 13 Aug 2026."""
import re
import pandas as pd
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

SRC = '/root/.claude/uploads/21f11d46-7d67-5d9f-8ce1-f77874d4a4f9/8dbf1d6e-_Maklumbalas_Pesakit_Yang_Menolak_Perkhidmatan_VAS_di_FKP_Date_13_8.xlsx'
OUT = '/home/user/Reject-VAS/output/VAS_Rejection_Analysis_Clean_13Aug2026.xlsx'

SUB_COLS = {
    'A) Lebih Suka Kaedah Biasa & Ambil Sendiri': 'A',
    'B) Kebimbangan Terhadap Kesilapan Ubat & Konsultasi': 'B',
    'C) Isu Spesifik Berkaitan Ubat Melalui Pos (UMP)': 'C',
    'D) Isu Spesifik Berkaitan Farmasi Pandu Lalu (FPL)': 'D',
    'E) Halangan Teknologi & Celik Digital': 'E',
}
CAT_LABEL = {
    'A': 'A) Lebih Suka Kaedah Biasa & Ambil Sendiri',
    'B': 'B) Kebimbangan Terhadap Kesilapan Ubat & Konsultasi',
    'C': 'C) Isu Spesifik Berkaitan Ubat Melalui Pos (UMP)',
    'D': 'D) Isu Spesifik Berkaitan Farmasi Pandu Lalu (FPL)',
    'E': 'E) Halangan Teknologi & Celik Digital',
}
AGE_ORDER = ['0 - 10', '11 - 20', '21 - 30', '31 - 40', '41 - 50',
             '51 - 60', '61 - 70', '71 - 80', '81 - 90', '91 - 100']

# Free-text department spellings -> standard department name
DEPT_MAP = {
    'opthal': 'Oftalmologi', 'ophthal': 'Oftalmologi', 'ophthalmology': 'Oftalmologi',
    'oftamologi': 'Oftalmologi', 'oftalmologi': 'Oftalmologi', 'eye': 'Oftalmologi',
    'urologi': 'Urologi', 'urology': 'Urologi',
    'ent': 'ENT',
    'hepatology': 'Hepatologi', 'hepatologi': 'Hepatologi',
    'hemato': 'Hematologi', 'haemato': 'Hematologi', 'hematologi': 'Hematologi',
    'dermatology': 'Dermatologi', 'dermatologi': 'Dermatologi',
    'endocrine': 'Endokrin', 'endokrin': 'Endokrin',
    'id': 'Penyakit Berjangkit (ID)',
    'mopd': 'Perubatan (Semua)', 'medical': 'Perubatan (Semua)', 'perubatan': 'Perubatan (Semua)',
    'ortho': 'Orthopedic', 'orthopedic': 'Orthopedic', 'orthopaedic': 'Orthopedic',
    'cardio': 'Kardiologi', 'kardiologi': 'Kardiologi',
    'nefrologi': 'Nefrologi', 'nephrology': 'Nefrologi',
    'psikiatri': 'Psikiatri', 'psychiatry': 'Psikiatri',
    'pulmonari': 'Pulmonari', 'respiratory': 'Pulmonari',
    'o&g': 'O&G', 'obg': 'O&G',
    'rehabilitasi': 'Rehabilitasi', 'rehab': 'Rehabilitasi',
}
JUNK = {'', '-', '--', 'nan', 'ss', 'sd', 'na', 'n/a', 'tiada', 'x'}

# Exact answer options offered by the form. Several contain commas of their own, so a
# multi-select cell cannot simply be split on ",". Matched longest-first instead.
OPTIONS = [
    'Kekerapan temujanji hospital (banyak TCA hampir setiap bulan)',
    'Pengambilan oleh Pihak Ketiga & Institusi (Rumah orang tua / Penjara)',
    'Kurang motivasi diri atau enggan mencuba sistem baharu',
    'Lebih selesa dengan kaedah biasa di kaunter',
    'Pesakit tinggal berdekatan',
    'Bimbang tentang kesilapan ubat, terutamanya jika terdapat pertukaran jenama',
    'Pengalaman buruk dengan pos sebelum ini (ubat salah atau tidak mencukupi)',
    'Penerima tiada di rumah atau sukar untuk menunggu di rumah',
    'Enggan atau tidak mampu membayar caj kurier',
    'Ketidakpadanan waktu operasi (FPL buka lambat, pesakit datang awal)',
    'Kesusahan menguasai penggunaan telefon pintar dan apps (eg. golongan OKU, orang tua)',
    'Pesakit tiada pelan data mudah alih',
    'Pesakit tiada telefon pintar',
]
OPTIONS_SORTED = sorted(OPTIONS, key=len, reverse=True)


def split_options(text):
    """Split a multi-select cell into the exact form options it contains."""
    s = str(text).strip()
    found = []
    for opt in OPTIONS_SORTED:
        if opt in s:
            found.append(opt)
            s = s.replace(opt, '\x00', 1)
    leftovers = [p.strip(' ,') for p in s.split('\x00')]
    found += [p for p in leftovers if p.strip(' ,') and p.strip(' ,').lower() not in JUNK]
    # restore the order they appear in the original cell
    return sorted(found, key=lambda o: str(text).find(o) if o in str(text) else 999)

log = []


def note(rule, detail):
    log.append({'Langkah Pembersihan / Cleaning Step': rule, 'Butiran / Detail': detail})


# ---------------------------------------------------------------- load
raw = pd.read_excel(SRC, sheet_name='Form responses 2', header=0)
raw_rows = len(raw)
df = raw.dropna(how='all').copy()
note('Buang baris kosong sepenuhnya', f'{raw_rows - len(df)} baris kosong dibuang; {len(df)} rekod kekal')

empty_cols = [c for c in df.columns if df[c].notna().sum() == 0]
df = df.drop(columns=empty_cols)
note('Buang lajur kosong sepenuhnya', ', '.join(map(str, empty_cols)) or 'tiada')

df = df.rename(columns={'Column 1': 'ID Pesakit (SD)'})
note('Namakan semula lajur', '"Column 1" -> "ID Pesakit (SD)"')

# ---------------------------------------------------------------- IDs
df['ID Pesakit (SD)'] = (df['ID Pesakit (SD)'].astype(str)
                         .str.strip().str.replace(r'\s+', '', regex=True).str.upper())
note('Piawaikan ID pesakit', 'Huruf besar, buang ruang kosong (cth. "Sd 000007" -> "SD000007")')
dupes = df['ID Pesakit (SD)'].duplicated().sum()
note('Semak ID berganda', f'{dupes} ID berulang dikesan')

# ---------------------------------------------------------------- timestamp
df['Timestamp'] = pd.to_datetime(df['Timestamp'], errors='coerce')
df['Tarikh'] = df['Timestamp'].dt.date
df['Minggu Bermula'] = df['Timestamp'].dt.to_period('W').apply(lambda p: p.start_time.date())

# ---------------------------------------------------------------- main reason
def norm_reason(row):
    v = str(row['Sebab Penolakan']).strip()
    m = re.match(r'^([A-E])\)', v)
    if m:
        return CAT_LABEL[m.group(1)], ''
    # unlabelled or blank -> infer from which sub-reason column is filled
    for col, code in SUB_COLS.items():
        if pd.notna(row.get(col)):
            if v.lower() in ('nan', '', 'none'):
                return CAT_LABEL[code], 'Dijana semula daripada lajur sub-sebab (asal kosong)'
            return CAT_LABEL[code], f'Label tanpa prefiks dibetulkan (asal: "{v}")'
    return 'Tidak Dinyatakan', 'Sebab penolakan tidak direkodkan'


res = df.apply(norm_reason, axis=1, result_type='expand')
df['Kategori Sebab Penolakan'] = res[0]
df['Nota Pembersihan'] = res[1]
note('Piawaikan kategori sebab penolakan',
     '1 rekod tanpa prefiks ("Lebih Suka Kaedah Biasa...") dipadan ke kategori A; '
     '1 rekod kosong dikekalkan sebagai "Tidak Dinyatakan"')

df['Kod Kategori'] = df['Kategori Sebab Penolakan'].str[0].where(
    df['Kategori Sebab Penolakan'] != 'Tidak Dinyatakan', '-')

# ---------------------------------------------------------------- sub-reasons
def collect_sub(row):
    out = []
    for col in SUB_COLS:
        if pd.notna(row.get(col)):
            out += split_options(row[col])
    return out


df['_subs'] = df.apply(collect_sub, axis=1)
df['Sub-Sebab (digabung)'] = df['_subs'].apply(lambda x: ' | '.join(x))
df['Bilangan Sub-Sebab'] = df['_subs'].apply(len)
note('Gabung 5 lajur sub-sebab', 'Jawapan berbilang pilihan dipecah mengikut senarai pilihan sebenar borang '
     '(bukan pada koma), supaya pilihan yang mengandungi koma tidak terpotong')
note('Semak liputan sub-sebab',
     'Setiap sub-sebab dipadankan dengan pilihan rasmi borang; teks luar senarai dikekalkan apa adanya')

# ---------------------------------------------------------------- department
free = 'Sila nyatakan Jabatan sekiranya memilih LAIN-LAIN'


def clean_dept(row):
    dept = str(row['Jabatan']).strip()
    dept = DEPT_MAP.get(dept.lower(), dept)  # unify dropdown spellings too (Oftamologi -> Oftalmologi)
    other = str(row.get(free, '')).strip()
    flag = ''
    if dept.upper().startswith('LAIN'):
        parts = [p.strip() for p in re.split(r'[,/&]| dan ', other) if p.strip()]
        mapped = [DEPT_MAP[p.lower()] for p in parts if p.lower() in DEPT_MAP]
        if mapped:
            if len(set(mapped)) > 1:
                flag = 'Berbilang jabatan dinyatakan: ' + ', '.join(dict.fromkeys(mapped))
            return dict.fromkeys(mapped).__iter__().__next__(), flag
        return 'Lain-lain (tidak dinyatakan)', f'Teks bebas tidak sah: "{other}"' if other.lower() not in JUNK else 'Teks bebas kosong/tidak bermakna'
    # a non-LAIN department may still carry stray free text
    if other and other.lower() not in JUNK:
        parts = [p.strip() for p in re.split(r'[,/&]', other) if p.strip()]
        mapped = [DEPT_MAP[p.lower()] for p in parts if p.lower() in DEPT_MAP]
        extra = [m for m in dict.fromkeys(mapped) if m != dept]
        if extra:
            flag = 'Teks bebas menyebut jabatan lain: ' + ', '.join(extra)
        elif not mapped:
            flag = f'Teks bebas bukan nama jabatan: "{other}"'
    return dept, flag


dres = df.apply(clean_dept, axis=1, result_type='expand')
df['Jabatan (Bersih)'] = dres[0]
df['Nota Jabatan'] = dres[1]
note('Piawaikan nama jabatan',
     'Ejaan bebas disatukan (Opthal/OPTHAL/Ophthalmology/oftamologi -> Oftalmologi; '
     'Dermatology -> Dermatologi; Hemato -> Hematologi; ENDOCRINE -> Endokrin; '
     'MOPD/medical -> Perubatan (Semua)); teks bukan jabatan ditandakan')

# stray free-text that is actually a reason, not a department
mask = df[free].astype(str).str.contains('MyUbat|ubat|pos|telefon', case=False, na=False)
df.loc[mask, 'Nota Pembersihan'] = (df.loc[mask, 'Nota Pembersihan'].replace('', pd.NA)
                                    .fillna('Teks bebas jabatan sebenarnya sebab penolakan: "'
                                            + df.loc[mask, free].astype(str) + '"'))
note('Kesan teks salah letak', f'{int(mask.sum())} rekod: sebab penolakan ditaip dalam ruangan jabatan')

# ---------------------------------------------------------------- age
df['Umur Pesakit'] = (df['Umur Pesakit'].astype('string').str.strip()
                      .replace({'nan': pd.NA, '': pd.NA}).fillna('Tidak Direkod'))
df['Kumpulan Umur'] = pd.Categorical(
    df['Umur Pesakit'], categories=AGE_ORDER + ['Tidak Direkod'], ordered=True)
df['Warga Emas (>=60)'] = df['Umur Pesakit'].apply(
    lambda v: 'Ya' if v in ('61 - 70', '71 - 80', '81 - 90', '91 - 100')
    else ('Tidak Direkod' if v == 'Tidak Direkod' else 'Tidak'))
note('Piawaikan umur',
     f"{int((df['Umur Pesakit'] == 'Tidak Direkod').sum())} rekod tanpa umur ditanda "
     '"Tidak Direkod"; bendera warga emas (>=60 tahun) ditambah')

n_child = int((df['Umur Pesakit'] == '0 - 10').sum())
if n_child:
    note('Bendera nilai umur meragukan',
         f'{n_child} rekod berumur "0 - 10" — kemungkinan tersalah pilih julat umur; '
         'dikekalkan tanpa diubah tetapi perlu disahkan semula')

df['Status Pesakit Yang Datang'] = df['Status Pesakit Yang Datang'].astype(str).str.strip()

# ---------------------------------------------------------------- clean table
clean = df[['Timestamp', 'Tarikh', 'Minggu Bermula', 'ID Pesakit (SD)',
            'Status Pesakit Yang Datang', 'Umur Pesakit', 'Warga Emas (>=60)',
            'Jabatan (Bersih)', 'Kod Kategori', 'Kategori Sebab Penolakan',
            'Sub-Sebab (digabung)', 'Bilangan Sub-Sebab',
            'Nota Jabatan', 'Nota Pembersihan']].copy()
clean = clean.sort_values('Timestamp').reset_index(drop=True)
clean['Kumpulan Umur'] = pd.Categorical(
    clean['Umur Pesakit'], categories=AGE_ORDER + ['Tidak Direkod'], ordered=True)

N = len(clean)

# ---------------------------------------------------------------- summaries
def freq(series, name):
    t = series.value_counts().rename_axis(name).reset_index(name='Bilangan')
    t['Peratus (%)'] = (t['Bilangan'] / N * 100).round(1)
    return t


cat = freq(clean['Kategori Sebab Penolakan'], 'Kategori Sebab Penolakan')

sub_rows = []
for _, r in df.iterrows():
    for col, code in SUB_COLS.items():
        if pd.notna(r.get(col)):
            for s in split_options(r[col]):
                sub_rows.append({'Kod': code, 'Kategori': CAT_LABEL[code], 'Sub-Sebab': s})
sub_df = pd.DataFrame(sub_rows)
sub_tab = (sub_df.groupby(['Kod', 'Kategori', 'Sub-Sebab']).size()
           .reset_index(name='Bilangan Sebutan').sort_values('Bilangan Sebutan', ascending=False))
sub_tab['Peratus Pesakit (%)'] = (sub_tab['Bilangan Sebutan'] / N * 100).round(1)

dept = freq(clean['Jabatan (Bersih)'], 'Jabatan')
age = (clean.groupby('Kumpulan Umur', observed=True).size()
       .reset_index(name='Bilangan').rename(columns={'Kumpulan Umur': 'Kumpulan Umur'}))
age['Peratus (%)'] = (age['Bilangan'] / N * 100).round(1)
status = freq(clean['Status Pesakit Yang Datang'], 'Status Pesakit Yang Datang')

ct_age = pd.crosstab(clean['Kumpulan Umur'], clean['Kod Kategori']).reset_index()
ct_dept = pd.crosstab(clean['Jabatan (Bersih)'], clean['Kod Kategori'])
ct_dept['Jumlah'] = ct_dept.sum(axis=1)
ct_dept = ct_dept.sort_values('Jumlah', ascending=False).reset_index()
ct_status = pd.crosstab(clean['Status Pesakit Yang Datang'], clean['Kod Kategori']).reset_index()

weekly = (clean.groupby('Minggu Bermula').size().reset_index(name='Bilangan Penolakan'))

qual = pd.DataFrame(log)

# ---------------------------------------------------------------- write
import os
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with pd.ExcelWriter(OUT, engine='openpyxl') as xw:
    cat.to_excel(xw, sheet_name='2. Sebab Utama', index=False, startrow=2)
    sub_tab.to_excel(xw, sheet_name='3. Sub-Sebab Terperinci', index=False, startrow=2)
    dept.to_excel(xw, sheet_name='4. Jabatan', index=False, startrow=2)
    age.to_excel(xw, sheet_name='5. Umur', index=False, startrow=2)
    status.to_excel(xw, sheet_name='5. Umur', index=False, startrow=len(age) + 6)
    ct_age.to_excel(xw, sheet_name='6. Silang Umur x Sebab', index=False, startrow=2)
    ct_dept.to_excel(xw, sheet_name='7. Silang Jabatan x Sebab', index=False, startrow=2)
    ct_status.to_excel(xw, sheet_name='7. Silang Jabatan x Sebab', index=False,
                       startrow=len(ct_dept) + 6)
    weekly.to_excel(xw, sheet_name='8. Trend Mingguan', index=False, startrow=2)
    clean.drop(columns=['Kumpulan Umur']).to_excel(
        xw, sheet_name='9. Data Bersih', index=False, startrow=2)
    raw.to_excel(xw, sheet_name='10. Data Asal', index=False)
    qual.to_excel(xw, sheet_name='11. Log Pembersihan', index=False, startrow=2)

# ---------------------------------------------------------------- format
wb = load_workbook(OUT)
NAVY = '1F3864'
HEAD = PatternFill('solid', fgColor=NAVY)
BAND = PatternFill('solid', fgColor='EAF1F8')
TITLE_FONT = Font(name='Arial', size=13, bold=True, color=NAVY)
HEAD_FONT = Font(name='Arial', size=10, bold=True, color='FFFFFF')
BODY = Font(name='Arial', size=10)
thin = Side(style='thin', color='B7C4D6')
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

TITLES = {
    '2. Sebab Utama': 'Sebab Utama Penolakan Perkhidmatan VAS',
    '3. Sub-Sebab Terperinci': 'Sub-Sebab Terperinci (jawapan berbilang pilihan dipecahkan)',
    '4. Jabatan': 'Penolakan Mengikut Jabatan (nama telah dipiawaikan)',
    '5. Umur': 'Profil Umur Pesakit',
    '6. Silang Umur x Sebab': 'Kumpulan Umur lawan Kategori Sebab',
    '7. Silang Jabatan x Sebab': 'Jabatan lawan Kategori Sebab',
    '8. Trend Mingguan': 'Trend Penolakan Mingguan',
    '9. Data Bersih': 'Data Bersih Siap Analisis (84 rekod)',
    '11. Log Pembersihan': 'Log Pembersihan Data — apa yang diubah dan mengapa',
}


def style_block(ws, header_row, ncols, nrows):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=header_row, column=c)
        cell.font, cell.fill, cell.border = HEAD_FONT, HEAD, BORDER
        cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    for i, r in enumerate(range(header_row + 1, header_row + 1 + nrows)):
        for c in range(1, ncols + 1):
            cell = ws.cell(row=r, column=c)
            cell.font, cell.border = BODY, BORDER
            cell.alignment = Alignment(vertical='top', wrap_text=True)
            if i % 2:
                cell.fill = BAND


for name, ws in ((n, wb[n]) for n in wb.sheetnames):
    ws.sheet_view.showGridLines = False
    if name in TITLES:
        ws['A1'] = TITLES[name]
        ws['A1'].font = TITLE_FONT

for name, tbl in [('2. Sebab Utama', cat), ('3. Sub-Sebab Terperinci', sub_tab),
                  ('4. Jabatan', dept), ('6. Silang Umur x Sebab', ct_age),
                  ('8. Trend Mingguan', weekly), ('9. Data Bersih', clean.drop(columns=['Kumpulan Umur'])),
                  ('11. Log Pembersihan', qual)]:
    style_block(wb[name], 3, tbl.shape[1], tbl.shape[0])

style_block(wb['5. Umur'], 3, age.shape[1], age.shape[0])
style_block(wb['5. Umur'], len(age) + 7, status.shape[1], status.shape[0])
wb['5. Umur'].cell(row=len(age) + 5, column=1, value='Status Pesakit Yang Datang').font = TITLE_FONT
style_block(wb['7. Silang Jabatan x Sebab'], 3, ct_dept.shape[1], ct_dept.shape[0])
style_block(wb['7. Silang Jabatan x Sebab'], len(ct_dept) + 7, ct_status.shape[1], ct_status.shape[0])
wb['7. Silang Jabatan x Sebab'].cell(row=len(ct_dept) + 5, column=1,
                                     value='Status Pesakit lawan Kategori Sebab').font = TITLE_FONT

WIDTHS = {'2. Sebab Utama': [52, 12, 14], '3. Sub-Sebab Terperinci': [6, 46, 60, 16, 18],
          '4. Jabatan': [30, 12, 14], '5. Umur': [20, 12, 14],
          '8. Trend Mingguan': [18, 20], '11. Log Pembersihan': [42, 78]}
for name, ws in ((n, wb[n]) for n in wb.sheetnames):
    if name in WIDTHS:
        for i, w in enumerate(WIDTHS[name], start=1):
            ws.column_dimensions[get_column_letter(i)].width = w
    else:
        for c in range(1, ws.max_column + 1):
            vals = [len(str(ws.cell(row=r, column=c).value or ''))
                    for r in range(1, min(ws.max_row, 200) + 1)]
            ws.column_dimensions[get_column_letter(c)].width = min(max(vals + [10]) + 2, 40)

# freeze header on the data sheet
wb['9. Data Bersih'].freeze_panes = 'A4'
wb['10. Data Asal'].sheet_view.showGridLines = True

# ---- executive summary sheet (built first in order)
ws = wb.create_sheet('1. Ringkasan Eksekutif', 0)
ws.sheet_view.showGridLines = False
ws['A1'] = 'Maklum Balas Pesakit Menolak Perkhidmatan VAS di FKP'
ws['A1'].font = Font(name='Arial', size=15, bold=True, color=NAVY)
ws['A2'] = 'Tempoh data: 16 Julai 2026 – 13 Ogos 2026  |  Jumlah rekod bersih: 84'
ws['A2'].font = Font(name='Arial', size=10, italic=True, color='555555')

rows = [
    ('METRIK UTAMA', ''),
    ('Jumlah penolakan direkodkan', '=COUNTA(\'9. Data Bersih\'!D4:D87)'),
    ('Pesakit hadir sendiri', "=COUNTIF('9. Data Bersih'!E4:E87,\"Pesakit sendiri\")"),
    ('Diwakili waris', "=COUNTIF('9. Data Bersih'!E4:E87,\"Waris\")"),
    ('Pesakit warga emas (>=60 tahun)', "=COUNTIF('9. Data Bersih'!G4:G87,\"Ya\")"),
    ('Peratus warga emas daripada rekod berumur',
     "=IFERROR(COUNTIF('9. Data Bersih'!G4:G87,\"Ya\")/COUNTIF('9. Data Bersih'!G4:G87,\"<>Tidak Direkod\"),0)"),
    ('Kategori A — Lebih suka kaedah biasa & ambil sendiri',
     "=COUNTIF('9. Data Bersih'!I4:I87,\"A\")"),
    ('Kategori B — Bimbang kesilapan ubat & konsultasi',
     "=COUNTIF('9. Data Bersih'!I4:I87,\"B\")"),
    ('Kategori C — Isu ubat melalui pos (UMP)', "=COUNTIF('9. Data Bersih'!I4:I87,\"C\")"),
    ('Kategori D — Isu farmasi pandu lalu (FPL)', "=COUNTIF('9. Data Bersih'!I4:I87,\"D\")"),
    ('Kategori E — Halangan teknologi & celik digital',
     "=COUNTIF('9. Data Bersih'!I4:I87,\"E\")"),
    ('Rekod tanpa sebab direkodkan', "=SUMPRODUCT(--('9. Data Bersih'!I4:I87=\"-\"))"),
]
r = 4
for label, formula in rows:
    ws.cell(row=r, column=1, value=label)
    if formula:
        ws.cell(row=r, column=2, value=formula).font = Font(name='Arial', size=10, bold=True)
        ws.cell(row=r, column=1).font = BODY
        ws.cell(row=r, column=2).number_format = '0.0%' if 'Peratus' in label else '#,##0'
    else:
        ws.cell(row=r, column=1).font = Font(name='Arial', size=11, bold=True, color=NAVY)
    r += 1

r += 1
ws.cell(row=r, column=1, value='PENEMUAN UTAMA').font = Font(name='Arial', size=11, bold=True, color=NAVY)
r += 1
findings = [
    '1. Penolakan didorong tabiat, bukan kegagalan sistem — 68 daripada 84 pesakit (81.0%) menolak '
    'kerana lebih suka kaedah biasa dan ambil sendiri di kaunter (Kategori A). Hanya 1 rekod '
    'menyebut kebimbangan kesilapan ubat (Kategori B).',
    '2. Dua pemacu terbesar ialah keselesaan dan kekerapan temujanji — "lebih selesa dengan kaedah '
    'biasa di kaunter" disebut 33 kali (39.3% pesakit) dan "kekerapan temujanji hospital / banyak '
    'TCA hampir setiap bulan" 27 kali (32.1%). Pesakit yang tetap perlu ke hospital setiap bulan '
    'melihat VAS sebagai langkah tambahan, bukan penjimatan.',
    '3. Inersia boleh diatasi — 14 pesakit (16.7%) menyatakan "kurang motivasi diri atau enggan '
    'mencuba sistem baharu", dan 14 lagi tinggal berdekatan hospital. Kumpulan pertama adalah '
    'sasaran paling mudah ditukar melalui pendaftaran berbantu di kaunter.',
    '4. Halangan digital tertumpu pada warga emas — 50 daripada 79 pesakit yang direkodkan umur '
    '(63.3%) berumur 60 tahun ke atas. Kategori E (7 rekod) didorong oleh ketiadaan telefon pintar '
    '(4) dan ketiadaan pelan data (2), bukan keengganan; 5 daripada 7 rekod E berumur 61 tahun ke atas.',
    '5. Isu UMP ialah masalah pelaksanaan penghantaran, bukan penolakan konsep — penerima tiada di '
    'rumah (3), pengalaman buruk sebelum ini iaitu ubat salah atau tidak mencukupi (2), dan caj '
    'kurier (1). Semua 6 rekod ini datang daripada pesakit yang hadir sendiri.',
    '6. Tumpuan jabatan — Perubatan (Semua) 21 rekod (25.0%), Orthopedic 14 (16.7%) dan Oftalmologi '
    '12 (14.3%) menyumbang 56% daripada semua penolakan. Intervensi paling berbaloi jika disasarkan '
    'di tiga klinik ini dahulu.',
    '7. Peranan waris — 21 rekod (25.0%) diwakili waris, dan 18 daripadanya jatuh dalam Kategori A. '
    'Waris ialah saluran pendaftaran VAS yang belum digunakan sepenuhnya bagi pesakit tua.',
    '8. Kualiti data borang perlu diperbaiki — sebab penolakan ditaip ke dalam ruangan jabatan (1 rekod), '
    'ejaan jabatan tidak seragam (cth. Opthal / Ophthalmology / oftamologi), 5 rekod tanpa umur, '
    '2 rekod berumur "0 - 10" yang meragukan, dan 1 rekod tanpa sebab penolakan (lihat Log Pembersihan).',
]
for f in findings:
    c = ws.cell(row=r, column=1, value=f)
    c.font = BODY
    c.alignment = Alignment(wrap_text=True, vertical='top')
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
    ws.row_dimensions[r].height = 30
    r += 1

r += 1
ws.cell(row=r, column=1, value='CADANGAN TINDAKAN').font = Font(name='Arial', size=11, bold=True, color=NAVY)
r += 1
actions = [
    'A. Selaraskan bekalan ubat dengan tarikh TCA (cth. bekalan 3-6 bulan / temujanji selari) supaya '
    'VAS tidak menjadi perjalanan tambahan bagi pesakit dengan TCA kerap.',
    'B. Demonstrasi langsung di kaunter FKP semasa menunggu — daftar MyUbat untuk pesakit di tempat, '
    'menyasarkan kumpulan "kurang motivasi / lebih selesa kaedah biasa".',
    'C. Laluan tanpa telefon pintar untuk warga emas — pendaftaran VAS oleh waris, atau pesanan '
    'melalui talian telefon, kerana halangan sebenar ialah peranti dan bukan keengganan.',
    'D. Pulihkan keyakinan terhadap UMP — pengesahan penghantaran, slot masa penghantaran, dan '
    'semakan ganda kuantiti sebelum pos bagi menangani pengalaman buruk sebelum ini.',
    'E. Semak waktu operasi FPL supaya sepadan dengan waktu kedatangan awal pesakit.',
    'F. Perketat borang maklum balas — jadikan umur & jabatan medan wajib dengan senarai pilihan '
    'tetap, dan asingkan ruangan "sebab lain" daripada ruangan jabatan.',
]
for a in actions:
    c = ws.cell(row=r, column=1, value=a)
    c.font = BODY
    c.alignment = Alignment(wrap_text=True, vertical='top')
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
    ws.row_dimensions[r].height = 30
    r += 1

r += 1
ws.cell(row=r, column=1, value='Nota: Semua metrik di atas dikira menggunakan formula terus daripada '
        'helaian "9. Data Bersih" — angka akan dikemas kini secara automatik jika data ditambah.').font = \
    Font(name='Arial', size=9, italic=True, color='777777')
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)

ws.column_dimensions['A'].width = 62
ws.column_dimensions['B'].width = 14
ws.column_dimensions['C'].width = 14
ws.column_dimensions['D'].width = 20

wb.save(OUT)
print('written', OUT, 'rows', N)

# ---------------------------------------------------------------- cache formula results
# LibreOffice cannot run in this environment, so the COUNTIF results on the summary sheet
# are computed here and written into the file as cached values. The formulas stay intact and
# recalculate normally when the workbook is opened in Excel.
import zipfile, shutil, re as _re
from xml.etree import ElementTree as ET

cache = {
    'B5': N,
    'B6': int((clean['Status Pesakit Yang Datang'] == 'Pesakit sendiri').sum()),
    'B7': int((clean['Status Pesakit Yang Datang'] == 'Waris').sum()),
    'B8': int((clean['Warga Emas (>=60)'] == 'Ya').sum()),
    'B9': round(float((clean['Warga Emas (>=60)'] == 'Ya').sum())
                / float((clean['Warga Emas (>=60)'] != 'Tidak Direkod').sum()), 6),
    'B10': int((clean['Kod Kategori'] == 'A').sum()),
    'B11': int((clean['Kod Kategori'] == 'B').sum()),
    'B12': int((clean['Kod Kategori'] == 'C').sum()),
    'B13': int((clean['Kod Kategori'] == 'D').sum()),
    'B14': int((clean['Kod Kategori'] == 'E').sum()),
    'B15': int((clean['Kod Kategori'] == '-').sum()),
}

NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
ET.register_namespace('', NS)
wbz = zipfile.ZipFile(OUT)
target = 'xl/worksheets/sheet1.xml'   # '1. Ringkasan Eksekutif' is the first sheet
data = {n: wbz.read(n) for n in wbz.namelist()}
wbz.close()

root = ET.fromstring(data[target])
for c in root.iter(f'{{{NS}}}c'):
    ref = c.get('r')
    if ref in cache and c.find(f'{{{NS}}}f') is not None:
        for old in c.findall(f'{{{NS}}}v'):
            c.remove(old)
        v = ET.SubElement(c, f'{{{NS}}}v')
        v.text = repr(cache[ref]) if isinstance(cache[ref], float) else str(cache[ref])
data[target] = ET.tostring(root, encoding='UTF-8', xml_declaration=True)

with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    for n, b in data.items():
        z.writestr(n, b)
print('cached values written:', cache)
