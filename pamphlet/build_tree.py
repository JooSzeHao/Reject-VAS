#!/usr/bin/env python3
"""Emits the staircase decision-tree SVGs used by version D."""

L_X, L_W = 4, 322      # question column
R_X, R_W = 386, 310    # outcome column
SPINE = 165            # vertical connector
GAP = 34               # connector length


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def tree(nodes, marker):
    out, y = [], 0
    parts = []
    for n in nodes:
        if 'end' in n:
            title, lines = n['end']
            h = 40 + 18 * len(lines) + 12
            parts.append(('end', title, lines, h))
        else:
            qh = 30 + 22 * len(n['q']) + 12
            lh = 40 + 18 * len(n['leaf'][1]) + 12
            parts.append(('row', n, None, max(qh, lh)))
    total = sum(p[3] for p in parts) + GAP * (len(parts) - 1)

    for i, (kind, a, b, h) in enumerate(parts):
        if kind == 'row':
            n = a
            out.append(f'<rect class="qbox" x="{L_X}" y="{y}" width="{L_W}" height="{h}"/>')
            out.append(f'<text class="ql" x="{L_X+16}" y="{y+24}">{esc(n["label"])}</text>')
            for j, line in enumerate(n['q']):
                out.append(f'<text class="qt" x="{L_X+16}" y="{y+52+j*22}">{esc(line)}</text>')

            mid = y + h // 2
            out.append(f'<line class="edge" x1="{L_X+L_W}" y1="{mid}" x2="380" y2="{mid}" '
                       f'marker-end="url(#{marker})"/>')
            out.append(f'<text class="elabel" x="353" y="{mid-10}" text-anchor="middle">YA</text>')

            title, lines, suffix = n['leaf'][0], n['leaf'][1], n['leaf'][2] if len(n['leaf']) > 2 else None
            out.append(f'<rect class="lbox" x="{R_X}" y="{y}" width="{R_W}" height="{h}"/>')
            out.append(f'<rect class="tab" x="{R_X}" y="{y}" width="11" height="{h}"/>')
            sfx = f'<tspan class="lsfx"> {esc(suffix)}</tspan>' if suffix else ''
            out.append(f'<text class="lt" x="{R_X+24}" y="{y+34}">{esc(title)}{sfx}</text>')
            for j, line in enumerate(lines):
                out.append(f'<text class="ln" x="{R_X+24}" y="{y+58+j*18}">{esc(line)}</text>')
        else:
            title, lines = a, b
            out.append(f'<rect class="lbox" x="{L_X}" y="{y}" width="{R_X+R_W-L_X}" height="{h}"/>')
            out.append(f'<rect class="tab" x="{L_X}" y="{y}" width="11" height="{h}"/>')
            out.append(f'<text class="lt" x="{L_X+24}" y="{y+34}">{esc(title)}</text>')
            for j, line in enumerate(lines):
                out.append(f'<text class="ln" x="{L_X+24}" y="{y+58+j*18}">{esc(line)}</text>')

        y += h
        if i < len(parts) - 1:
            out.append(f'<line class="edge" x1="{SPINE}" y1="{y}" x2="{SPINE}" y2="{y+GAP-4}" '
                       f'marker-end="url(#{marker})"/>')
            out.append(f'<text class="elabel" x="177" y="{y+GAP//2+4}">TIDAK</text>')
            y += GAP

    defs = (f'<defs><marker id="{marker}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
            f'markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" '
            f'fill="#000"/></marker></defs>')
    body = '\n    '.join(out)
    return (f'<svg class="tree" viewBox="0 0 700 {total+4}" role="img" aria-label="Pokok keputusan">\n'
            f'    {defs}\n    {body}\n  </svg>')


SERVIS = tree([
    {'label': 'SOALAN 1',
     'q': ['Mahu ubat dihantar', 'terus ke rumah?'],
     'leaf': ('UBAT MELALUI POS',
              ['Dihantar ke alamat pilihan.',
               'Mohon sekurang-kurangnya 3 minggu awal.'], '(UMP)')},
    {'label': 'SOALAN 2',
     'q': ['Anda datang ke', 'hospital dengan kereta?'],
     'leaf': ('FARMASI PANDU LALU',
              ['Ambil dari dalam kereta.',
               'Isnin – Khamis:  12.00 tgh – 7.00 ptg',
               'Jumaat:  2.45 ptg – 7.00 ptg',
               'Sabtu:  9.00 pagi – 1.00 tgh'], '(FPL)')},
    {'label': 'SOALAN 3',
     'q': ['Mahu ambil bila-bila', 'masa — termasuk malam', 'dan hujung minggu?'],
     'leaf': ('LOCKER4U', ['Buka 24 jam. Ambil dalam 3 hari.'])},
    {'end': ('TANYA STAF KAMI',
             ['Kami cadangkan pilihan yang paling sesuai untuk anda.'])},
], 'ar')

DAFTAR = tree([
    {'label': 'SOALAN 1',
     'q': ['Anda ada telefon pintar?'],
     'leaf': ('DAFTAR SENDIRI', ['Imbas kod QR di muka hadapan.'])},
    {'label': 'SOALAN 2',
     'q': ['Ada waris yang boleh tolong?'],
     'leaf': ('WARIS DAFTARKAN', ['Anak boleh mohon bagi pihak anda.'])},
    {'end': ('STAF DAFTARKAN DI KAUNTER',
             ['Beritahu staf hari ini — lebih kurang 5 minit sahaja.'])},
], 'ar2')

if __name__ == '__main__':
    print(SERVIS[:200])
