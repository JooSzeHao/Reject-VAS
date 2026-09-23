#!/usr/bin/env python3
"""
Builds the version E pamphlet in every language from one set of strings.

Layout is identical across languages; only the copy, the font stack and a few
metrics change. Tamil needs more line height than Malay or Chinese, and Chinese
needs none of the two-line wrapping the other two do, so each language carries
its own pre-wrapped lines.
"""
import os
import re
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'output')
CHROME = os.environ.get('CHROME', '/opt/pw-browsers/chromium-1194/chrome-linux/chrome')

# ---------------------------------------------------------------- tree render
L_X, L_W = 4, 322
R_X, R_W = 386, 310
SPINE = 165
STRIP = 34


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def tree(nodes, marker, gap=50, qlh=25, llh=19):
    def qh(n):
        return 26 + qlh * n + 22

    def lh(n):
        return STRIP + llh * n + 20

    parts = []
    for n in nodes:
        if 'end' in n:
            parts.append(('end', n['end'], lh(len(n['end'][1]))))
        else:
            parts.append(('row', n, max(qh(len(n['q'])), lh(len(n['leaf'][1])))))
    total = sum(p[2] for p in parts) + gap * (len(parts) - 1)

    out, y, num = [], 0, 0
    for i, (kind, a, h) in enumerate(parts):
        if kind == 'row':
            num += 1
            n = a
            out.append(f'<rect class="qbox" x="{L_X}" y="{y}" width="{L_W}" height="{h}"/>')
            qstart = y + (h - qlh * len(n['q'])) // 2 + 19
            out.append(f'<circle class="disc" cx="{L_X+28}" cy="{qstart-7}" r="15"/>')
            out.append(f'<text class="dnum" x="{L_X+28}" y="{qstart}" text-anchor="middle">{num}</text>')
            for j, line in enumerate(n['q']):
                out.append(f'<text class="qt" x="{L_X+52}" y="{qstart+j*qlh}">{esc(line)}</text>')

            mid = y + h // 2
            out.append(f'<line class="edge" x1="{L_X+L_W}" y1="{mid}" x2="380" y2="{mid}" '
                       f'marker-end="url(#{marker})"/>')
            out.append(f'<text class="elabel" x="353" y="{mid-11}" text-anchor="middle">{esc(n["yes"])}</text>')

            title, lines = n['leaf'][0], n['leaf'][1]
            suffix = n['leaf'][2] if len(n['leaf']) > 2 else None
            out.append(f'<rect class="lbox" x="{R_X}" y="{y}" width="{R_W}" height="{h}"/>')
            out.append(f'<rect class="strip" x="{R_X}" y="{y}" width="{R_W}" height="{STRIP}"/>')
            sfx = f'<tspan class="lsfx"> {esc(suffix)}</tspan>' if suffix else ''
            out.append(f'<text class="lt" x="{R_X+16}" y="{y+24}">{esc(title)}{sfx}</text>')
            lstart = y + STRIP + (h - STRIP - llh * len(lines)) // 2 + 15
            for j, line in enumerate(lines):
                out.append(f'<text class="ln" x="{R_X+16}" y="{lstart+j*llh}">{esc(line)}</text>')
        else:
            title, lines = a
            w = R_X + R_W - L_X
            out.append(f'<rect class="lbox" x="{L_X}" y="{y}" width="{w}" height="{h}"/>')
            out.append(f'<rect class="strip" x="{L_X}" y="{y}" width="{w}" height="{STRIP}"/>')
            out.append(f'<text class="lt" x="{L_X+16}" y="{y+24}">{esc(title)}</text>')
            lstart = y + STRIP + (h - STRIP - llh * len(lines)) // 2 + 15
            for j, line in enumerate(lines):
                out.append(f'<text class="ln" x="{L_X+16}" y="{lstart+j*llh}">{esc(line)}</text>')

        y += h
        if i < len(parts) - 1:
            out.append(f'<line class="edge" x1="{SPINE}" y1="{y}" x2="{SPINE}" y2="{y+gap-4}" '
                       f'marker-end="url(#{marker})"/>')
            out.append(f'<text class="elabel" x="180" y="{y+gap//2+5}">{esc(nodes[i]["no"])}</text>')
            y += gap

    defs = (f'<defs><marker id="{marker}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
            f'markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" '
            f'fill="#000"/></marker></defs>')
    return (f'<svg class="tree" viewBox="0 0 700 {total+4}" role="img">\n'
            f'    {defs}\n    ' + '\n    '.join(out) + '\n  </svg>')


# ---------------------------------------------------------------- content
# "ms" mirrors the approved Malay sheet and is the reference the other two
# translate. Tree lines are pre-wrapped per language: the SVG cannot reflow.
LANGS = {
 'ms': {
  'file': 'Risalah_VAS_E_BM', 'title': 'Risalah & Borang VAS',
  'font': '"Arial","Helvetica",sans-serif', 'qlh': 25, 'llh': 19,
  'q_size': 23, 'l_size': 20, 'ln_size': 17, 'sfx_size': 15,
  'h1': ['Ambil ubat susulan', 'tanpa beratur.'],
  'sub': 'Perkhidmatan Nilai Tambah Farmasi (VAS)',
  'tel': ('Tel', 'samb. 1113'), 'qrcap': ['Imbas untuk muat', 'turun aplikasi'],
  'secA': 'Perkhidmatan mana untuk saya?',
  'secB': 'Bagaimana saya mendaftar?',
  'yes': 'YA', 'no': 'TIDAK',
  't1': [(['Mahu ubat dihantar', 'ke rumah?'], 'UBAT MELALUI POS', '(UMP)',
          ['Hantar ke alamat pilihan anda', 'dengan caj kurier minimum.']),
         (['Anda datang', 'dengan kereta?'], 'FARMASI PANDU LALU', '(FPL)',
          ['Ambil ubat tanpa turun', 'dari kereta.']),
         (['Mahu ambil pada', 'bila-bila masa?'], 'LOKAR UBAT', '(LOCKER4U)',
          ['Buka 24 jam — ambil ubat', 'ikut masa anda.'])],
  'end1': ('TANYA STAF KAMI', ['Kami cadangkan pilihan yang paling sesuai untuk anda.']),
  't2': [(['Ada telefon pintar?'], 'DAFTAR SENDIRI', None,
          ['Imbas QR di muka hadapan.']),
         (['Ada waris menolong?'], 'WARIS DAFTARKAN', None,
          ['Anak boleh mohon untuk anda.'])],
  'end2': ('STAF DAFTARKAN DI KAUNTER', ['Beritahu staf. Lebih kurang 5 minit sahaja.']),
  'hours_lbl': 'Waktu Pandu Lalu',
  'hours': 'Isnin&ndash;Khamis 12.00 tgh &ndash; 7.00 ptg &nbsp;&middot;&nbsp; Jumaat 2.45 &ndash; 7.00 ptg &nbsp;&middot;&nbsp; Sabtu 9.00 pagi &ndash; 1.00 tgh',
  'note_h': 'Temujanji hampir setiap bulan?',
  'note_b': 'Beritahu kami &mdash; ubat beberapa klinik boleh dibekalkan bersama, supaya kunjungan anda betul-betul berkurang.',
  'foot': 'Muka 1 daripada 2 &middot; sila terbalikkan',
  'dec_h': 'C &nbsp;&middot;&nbsp; Keputusan anda &mdash; tandakan satu',
  'ticks': [('YA &mdash; tolong daftarkan saya.', 'Staf daftarkan sekarang. Lebih kurang 5 minit sahaja.'),
            ('YA &mdash; saya daftar sendiri.', 'Imbas QR di muka hadapan.'),
            ('SAYA BERMINAT &mdash; nak baca dahulu.', 'Minta <i>Panduan Lengkap MyUBAT</i>.'),
            ('BELUM &mdash; saya kekal ambil di kaunter.', 'Lengkapkan bahagian di bawah.')],
  'form_h': 'Bahagian Pengesahan',
  'form_only': 'Isi HANYA jika anda menanda &ldquo;BELUM&rdquo;.',
  'fields': ['Nama Pesakit', 'No. Pendaftaran (MRN)', 'Jabatan'],
  'decl': 'Saya dengan ini memilih untuk <b>TIDAK</b> menggunakan mana-mana perkhidmatan VAS yang ditawarkan.',
  'decl_ms': None,
  'sig': ['Tandatangan Pesakit / Wakil', 'Disaksikan oleh (Kakitangan Farmasi)'],
  'nd': ('Nama', 'Tarikh'),
 },

 'zh': {
  'file': 'Risalah_VAS_E_CN', 'title': 'VAS 服务与拒绝表格',
  'font': '"Noto Sans CJK SC","Arial",sans-serif', 'qlh': 27, 'llh': 21,
  'q_size': 22, 'l_size': 19, 'ln_size': 16, 'sfx_size': 14,
  'h1': ['领取续配药物，', '无需排队。'],
  'sub': '药剂增值服务（VAS）',
  'tel': ('电话', '分机 1113'), 'qrcap': ['扫描下载', 'MyUBAT 应用'],
  'secA': '哪一项服务适合我？',
  'secB': '我该如何注册？',
  'yes': '是', 'no': '否',
  't1': [(['想把药物寄到家里吗？'], '邮寄药物', '(UMP)',
          ['寄到您指定的地址，', '只收最低快递费。']),
         (['您开车来吗？'], '免下车药房', '(FPL)',
          ['无需下车即可领药。']),
         (['想随时来领药吗？'], '药物储物柜', '(LOCKER4U)',
          ['24 小时开放，', '随您方便领取。'])],
  'end1': ('请询问我们的职员', ['我们会为您推荐最合适的选择。']),
  't2': [(['有智能手机吗？'], '自行注册', None, ['扫描封面的二维码。']),
         (['有家属可以帮忙吗？'], '家属代为注册', None, ['子女可代您申请。'])],
  'end2': ('柜台职员代您注册', ['告诉职员即可，大约 5 分钟。']),
  'hours_lbl': '免下车药房时间',
  'hours': '周一至周四 中午 12.00 &ndash; 晚上 7.00 &nbsp;&middot;&nbsp; 周五 下午 2.45 &ndash; 晚上 7.00 &nbsp;&middot;&nbsp; 周六 上午 9.00 &ndash; 中午 1.00',
  'note_h': '几乎每个月都要复诊？',
  'note_b': '请告诉我们 &mdash; 多个专科的药物或可一次过配给，真正减少您来院的次数。',
  'foot': '第 1 页，共 2 页 &middot; 请翻至背面',
  'dec_h': 'C &nbsp;&middot;&nbsp; 您的决定 &mdash; 请选一项',
  'ticks': [('是 &mdash; 请替我注册。', '职员现在就替您办理，大约 5 分钟。'),
            ('是 &mdash; 我自己注册。', '扫描封面的二维码。'),
            ('有兴趣 &mdash; 想先了解。', '向职员索取《MyUBAT 完整指南》。'),
            ('暂时不要 &mdash; 我照旧到柜台领药。', '请填写下方的确认部分。')],
  'form_h': '确认部分',
  'form_only': '只有选择「暂时不要」时才需填写。',
  'fields': ['病人姓名', '登记号码（MRN）', '科别'],
  'decl': '本人在此选择<b>不</b>使用任何所提供的 VAS 服务。',
  'decl_ms': 'Saya dengan ini memilih untuk TIDAK menggunakan mana-mana perkhidmatan VAS yang ditawarkan.',
  'sig': ['病人／代表签名', '见证人（药剂部职员）'],
  'nd': ('姓名', '日期'),
 },

 'ta': {
  'file': 'Risalah_VAS_E_TA', 'title': 'VAS சேவை மற்றும் மறுப்புப் படிவம்',
  'font': '"Noto Sans Tamil","Arial",sans-serif', 'qlh': 27, 'llh': 21,
  'gap1': 42, 'gap2': 32,
  'q_size': 19, 'l_size': 17, 'ln_size': 14.5, 'sfx_size': 13,
  'h1': ['மருந்து வாங்க இனி', 'வரிசையில் நிற்க வேண்டாம்.'],
  'sub': 'மருந்தக கூடுதல் மதிப்புச் சேவை (VAS)',
  'tel': ('தொலைபேசி', 'நீட்டிப்பு 1113'),
  'qrcap': ['செயலியைப் பதிவிறக்க', 'ஸ்கேன் செய்யவும்'],
  'secA': 'எந்தச் சேவை எனக்கு ஏற்றது?',
  'secB': 'நான் எப்படிப் பதிவு செய்வது?',
  'yes': 'ஆம்', 'no': 'இல்லை',
  't1': [(['மருந்து வீட்டுக்கு', 'வேண்டுமா?'], 'அஞ்சல் வழி மருந்து', '(UMP)',
          ['நீங்கள் குறிப்பிடும் முகவரிக்கு', 'அனுப்பப்படும். குறைந்தபட்ச', 'கூரியர் கட்டணம்.']),
         (['நீங்கள் காரில்', 'வருகிறீர்களா?'], 'வாகன மருந்தகம்', '(FPL)',
          ['காரிலிருந்து இறங்காமல்', 'மருந்து பெறலாம்.']),
         (['எந்த நேரத்திலும்', 'பெற வேண்டுமா?'], 'மருந்து லாக்கர்', '(LOCKER4U)',
          ['24 மணி நேரமும் திறந்திருக்கும்.', 'உங்கள் வசதிக்கேற்பப் பெறலாம்.'])],
  'end1': ('எங்கள் ஊழியரிடம் கேளுங்கள்',
           ['உங்களுக்கு ஏற்ற சிறந்த வழியை நாங்கள் பரிந்துரைப்போம்.']),
  't2': [(['ஸ்மார்ட்ஃபோன்', 'உள்ளதா?'], 'நீங்களே பதிவு செய்யுங்கள்', None,
          ['முன் பக்க QR-ஐ', 'ஸ்கேன் செய்யவும்.']),
         (['உதவ உறவினர்', 'உள்ளாரா?'], 'உறவினர் பதிவு செய்யலாம்', None,
          ['பிள்ளைகள் உங்களுக்காக', 'விண்ணப்பிக்கலாம்.'])],
  'end2': ('ஊழியர் மருந்தகத்தில் பதிவு செய்வார்',
           ['ஊழியரிடம் சொல்லுங்கள். சுமார் 5 நிமிடங்கள் மட்டுமே.']),
  'hours_lbl': 'வாகன மருந்தக நேரம்',
  'hours': 'திங்கள்&ndash;வியாழன் பிற்பகல் 12.00 &ndash; மாலை 7.00 &nbsp;&middot;&nbsp; வெள்ளி 2.45 &ndash; 7.00 &nbsp;&middot;&nbsp; சனி காலை 9.00 &ndash; பிற்பகல் 1.00',
  'note_h': 'கிட்டத்தட்ட ஒவ்வொரு மாதமும் சந்திப்பு உள்ளதா?',
  'note_b': 'எங்களிடம் சொல்லுங்கள் &mdash; பல கிளினிக்குகளின் மருந்துகளை ஒரே முறையில் வழங்க முடியும். உங்கள் வருகைகள் உண்மையிலேயே குறையும்.',
  'foot': 'பக்கம் 1 / 2 &middot; மறுபக்கம் பார்க்கவும்',
  'dec_h': 'C &nbsp;&middot;&nbsp; உங்கள் முடிவு &mdash; ஒன்றைத் தேர்வு செய்க',
  'ticks': [('ஆம் &mdash; எனக்குப் பதிவு செய்யுங்கள்.', 'ஊழியர் இப்போதே பதிவு செய்வார். சுமார் 5 நிமிடங்கள்.'),
            ('ஆம் &mdash; நானே பதிவு செய்கிறேன்.', 'முன் பக்க QR-ஐ ஸ்கேன் செய்யவும்.'),
            ('ஆர்வம் உள்ளது &mdash; முதலில் படிக்கிறேன்.', 'MyUBAT முழு வழிகாட்டியைக் கேளுங்கள்.'),
            ('இப்போது வேண்டாம் &mdash; மருந்தகத்தில் பெறுவேன்.', 'கீழே உள்ள பகுதியை நிரப்பவும்.')],
  'form_h': 'உறுதிப்படுத்தல் பகுதி',
  'form_only': '&ldquo;இப்போது வேண்டாம்&rdquo; எனத் தேர்வு செய்தால் மட்டும் நிரப்பவும்.',
  'fields': ['நோயாளியின் பெயர்', 'பதிவு எண் (MRN)', 'துறை'],
  'decl': 'வழங்கப்படும் எந்த VAS சேவையையும் பயன்படுத்த <b>வேண்டாம்</b> என நான் இதன்மூலம் தேர்வு செய்கிறேன்.',
  'decl_ms': 'Saya dengan ini memilih untuk TIDAK menggunakan mana-mana perkhidmatan VAS yang ditawarkan.',
  'sig': ['நோயாளி / பிரதிநிதி கையொப்பம்', 'சாட்சி (மருந்தக ஊழியர்)'],
  'nd': ('பெயர்', 'தேதி'),
 },
}


# ---------------------------------------------------------------- page render
def nodes_for(rows, L):
    return [{'q': q, 'yes': L['yes'], 'no': L['no'],
             'leaf': (title, body, sfx) if sfx else (title, body)}
            for q, title, sfx, body in rows]


def render(code, L, qr, logo):
    t1 = tree(nodes_for(L['t1'], L) + [{'end': L['end1'], 'yes': L['yes'], 'no': L['no']}],
              f'a{code}', gap=L.get('gap1', 50), qlh=L['qlh'], llh=L['llh'])
    t2 = tree(nodes_for(L['t2'], L) + [{'end': L['end2'], 'yes': L['yes'], 'no': L['no']}],
              f'b{code}', gap=L.get('gap2', 40), qlh=L['qlh'], llh=L['llh'])

    ticks = ''
    for i, (title, sub) in enumerate(L['ticks']):
        if i == 2:
            ticks += '      <div class="split"></div>\n'
        ticks += ('      <div class="tick"><div class="box"></div>\n'
                  f'        <div><span class="ttl">{title}</span>'
                  f'<span class="sub">{sub}</span></div></div>\n')

    wide = ' style="flex:2"'
    flds = ''.join(
        '      <div class="fld"' + (wide if i == 0 else '') + '>'
        '<div class="lab">' + f + '</div><div class="line"></div></div>\n'
        for i, f in enumerate(L['fields']))

    decl_ms = (f'\n      <div class="declms">{L["decl_ms"]}</div>' if L['decl_ms'] else '')
    nm, dt = L['nd']

    return f'''<!doctype html>
<html lang="{code}">
<head><meta charset="utf-8"><title>{L['title']}</title>
<style>
  @page {{ size: A4; margin: 13mm 13mm 9mm 13mm; }}
  * {{ box-sizing: border-box; }}
  html, body {{ margin: 0; padding: 0; }}
  body {{ font-family: {L['font']}; color: #000; font-size: 11pt; line-height: 1.34;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  .page {{ page-break-after: always; }}
  .page:last-child {{ page-break-after: auto; }}

  .head {{ display: flex; align-items: flex-start; gap: 8mm; }}
  .head .words {{ flex: 1 1 auto; }}
  .kicker {{ font-size: 8.4pt; letter-spacing: .18em; text-transform: uppercase; margin: 0 0 4mm 0; }}
  h1 {{ font-size: {L['q_size']+4}pt; line-height: 1.08; margin: 0 0 3mm 0; }}
  .head .sub {{ margin: 0; font-size: 11.4pt; }}
  .head .tel {{ margin: 2.4mm 0 0 0; font-size: 10pt; }}
  .brand {{ flex: 0 0 auto; width: 27mm; text-align: center; }}
  .brand .mark {{ display: flex; align-items: center; justify-content: center; gap: 1.6mm; margin-bottom: 2mm; }}
  .brand .mark img {{ width: 7.4mm; height: 7.4mm; display: block; }}
  .brand .mark b {{ font-size: 11.5pt; font-family: Arial, sans-serif; }}
  .brand img.qr {{ width: 24mm; height: 24mm; display: block; margin: 0 auto; }}
  .brand .cap {{ font-size: 7.8pt; margin-top: 1mm; line-height: 1.25; }}
  .rule {{ border-top: 3.5pt solid #000; margin: 4.5mm 0 0 0; }}

  .sec {{ display: flex; align-items: baseline; gap: 3mm; margin: 6mm 0 0 0; }}
  .sec .n {{ font-size: 10pt; font-weight: bold; letter-spacing: .1em; font-family: Arial, sans-serif; }}
  .sec h2 {{ font-size: 15pt; margin: 0; }}
  .sec + .hair {{ border-top: 1pt solid #000; margin-top: 2mm; }}
  .tree {{ width: 100%; display: block; margin-top: 4mm; }}

  .hours {{ margin-top: 4mm; border-top: 1pt solid #000; border-bottom: 1pt solid #000;
           padding: 2.2mm 0; font-size: 10.2pt; }}
  .callout {{ margin-top: 5mm; border-left: 4mm solid #000; padding: 0 0 0 4mm; font-size: 11pt; }}
  .callout b {{ display: block; font-size: 11.6pt; margin-bottom: 1mm; }}

  .decide {{ border: 3pt solid #000; padding: 4mm 4.5mm; margin-top: 5mm; }}
  .decide h3 {{ margin: 0 0 3.4mm 0; font-size: 12.4pt; }}
  .tick {{ display: flex; align-items: flex-start; margin-bottom: 2.6mm; }}
  .tick:last-child {{ margin-bottom: 0; }}
  .box {{ flex: 0 0 auto; width: 7.4mm; height: 7.4mm; border: 2pt solid #000; margin-right: 4mm; }}
  .tick .ttl {{ display: block; font-size: 12.2pt; font-weight: bold; }}
  .tick .sub {{ font-size: 10.4pt; color: #222; }}
  .split {{ border-top: 1pt solid #000; margin: 2.6mm 0 2.6mm 11.4mm; }}

  .form {{ border: 3pt solid #000; padding: 3.6mm 4.5mm; margin-top: 4mm; }}
  .form h3 {{ margin: 0 0 1.4mm 0; font-size: 12.4pt; }}
  .form .only {{ font-size: 10.6pt; font-weight: bold; margin: 0 0 4mm 0; }}
  .frow {{ display: flex; gap: 6mm; margin-bottom: 3.2mm; }}
  .fld {{ flex: 1 1 auto; }}
  .fld .lab {{ font-size: 9pt; letter-spacing: .04em; margin-bottom: .8mm; }}
  .fld .line {{ border-bottom: 1.25pt solid #000; height: 6mm; }}
  .decl {{ font-size: 11pt; border-top: 1.5pt solid #000; padding: 2.4mm 0 0 0; margin: 0; }}
  .declms {{ font-size: 8.6pt; color: #333; font-family: Arial, sans-serif;
            border-bottom: 1.5pt solid #000; padding: 0 0 2.4mm 0; margin: 1mm 0 3.6mm 0; }}
  .decl.solo {{ border-bottom: 1.5pt solid #000; padding-bottom: 2.4mm; margin-bottom: 3.6mm; }}
  .sig {{ display: flex; gap: 9mm; }}
  .sig .col {{ flex: 1 1 50%; }}
  .sig .sline {{ border-bottom: 1.25pt solid #000; height: 9.5mm; }}
  .sig .who {{ font-size: 9.6pt; font-weight: bold; margin-top: 1.4mm; }}
  .sig .nd {{ font-size: 8.8pt; margin-top: 1.4mm; line-height: 1.75; }}
  .foot {{ margin-top: 2.6mm; font-size: 8.2pt; color: #444; text-align: center; }}

  .tree text {{ font-family: {L['font']}; fill: #000; }}
  .tree .qbox {{ fill: #fff; stroke: #000; stroke-width: 2.5; }}
  .tree .lbox {{ fill: #fff; stroke: #000; stroke-width: 3; }}
  .tree .strip, .tree .disc {{ fill: #000; }}
  .tree .dnum {{ font-size: 18px; font-weight: bold; fill: #fff; font-family: Arial, sans-serif; }}
  .tree .qt {{ font-size: {L['q_size']}px; font-weight: bold; }}
  .tree .lt {{ font-size: {L['l_size']}px; font-weight: bold; fill: #fff; }}
  .tree .lsfx {{ font-size: {L['sfx_size']}px; font-weight: bold; fill: #fff; }}
  .tree .ln {{ font-size: {L['ln_size']}px; }}
  .tree .edge {{ stroke: #000; stroke-width: 2.5; fill: none; }}
  .tree .elabel {{ font-size: 16px; font-weight: bold; }}
</style></head>
<body>

<div class="page">
  <div class="head">
    <div class="words">
      <p class="kicker">Jabatan Farmasi &middot; Hospital Sultan Idris Shah, Serdang</p>
      <h1>{'<br>'.join(L['h1'])}</h1>
      <p class="sub">{L['sub']}</p>
      <p class="tel">{L['tel'][0]} <b>03-8947 5555</b> &nbsp;{L['tel'][1]}</p>
    </div>
    <div class="brand">
      <div class="mark"><img src="{logo}" alt="MyUBAT"><b>MyUBAT</b></div>
      <img class="qr" src="{qr}" alt="QR MyUBAT">
      <div class="cap">{'<br>'.join(L['qrcap'])}</div>
    </div>
  </div>
  <div class="rule"></div>

  <div class="sec"><span class="n">A</span><h2>{L['secA']}</h2></div>
  <div class="hair"></div>
  {t1}

  <div class="hours"><b>{L['hours_lbl']}</b> &nbsp;{L['hours']}</div>

  <div class="callout">
    <b>{L['note_h']}</b>
    {L['note_b']}
  </div>

  <div class="foot">{L['foot']}</div>
</div>

<div class="page">
  <div class="sec" style="margin-top:0"><span class="n">B</span><h2>{L['secB']}</h2></div>
  <div class="hair"></div>
  {t2}

  <div class="decide">
    <h3>{L['dec_h']}</h3>
{ticks}  </div>

  <div class="form">
    <h3>{L['form_h']}</h3>
    <p class="only">{L['form_only']}</p>
    <div class="frow">
{flds}    </div>
      <div class="decl{'' if L['decl_ms'] else ' solo'}">{L['decl']}</div>{decl_ms}
    <div class="sig">
      <div class="col"><div class="sline"></div>
        <div class="who">{L['sig'][0]}</div>
        <div class="nd">{nm}: &nbsp;_____________________ &nbsp;&nbsp; {dt}: &nbsp;___________</div></div>
      <div class="col"><div class="sline"></div>
        <div class="who">{L['sig'][1]}</div>
        <div class="nd">{nm}: &nbsp;_____________________ &nbsp;&nbsp; {dt}: &nbsp;___________</div></div>
    </div>
  </div>
</div>

</body></html>
'''


def main():
    src = open(os.path.join(HERE, 'risalah_vas_e_pokok.html')).read()
    qr = re.search(r'src="(data:image/svg\+xml;base64,[^"]+)" alt="Kod QR', src).group(1)
    logo = re.search(r'src="(data:image/svg\+xml;base64,[^"]+)" alt="MyUBAT"', src).group(1)
    for code, L in LANGS.items():
        if code == 'ms':
            continue   # signed off; built from risalah_vas_e_pokok.html
        html_path = os.path.join(HERE, f'gen_{code}.html')
        open(html_path, 'w').write(render(code, L, qr, logo))
        subprocess.run([CHROME, '--headless', '--disable-gpu', '--no-sandbox',
                        '--no-pdf-header-footer',
                        f'--print-to-pdf={os.path.join(OUT, L["file"] + ".pdf")}',
                        html_path], capture_output=True)
        print('built', L['file'])


if __name__ == '__main__':
    main()
