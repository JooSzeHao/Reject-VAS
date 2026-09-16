#!/usr/bin/env python3
"""
Tree renderer for version E.

Two changes from version D, both aimed at making the page read faster:
numbered discs replace the "SOALAN 1" labels, and each outcome gets a solid
black title strip instead of a thin left tab, so the answers carry the weight.
"""

L_X, L_W = 4, 322
R_X, R_W = 386, 310
SPINE = 165
GAP = 50
STRIP = 34            # height of the black title strip


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def _q_height(n):
    return 26 + 25 * n + 22


def _l_height(n):
    return STRIP + 19 * n + 20


def tree(nodes, marker, gap=GAP):
    parts = []
    for n in nodes:
        if 'end' in n:
            parts.append(('end', n['end'], _l_height(len(n['end'][1]))))
        else:
            parts.append(('row', n, max(_q_height(len(n['q'])), _l_height(len(n['leaf'][1])))))
    total = sum(p[2] for p in parts) + gap * (len(parts) - 1)

    out, y, num = [], 0, 0
    for i, (kind, a, h) in enumerate(parts):
        if kind == 'row':
            num += 1
            n = a
            out.append(f'<rect class="qbox" x="{L_X}" y="{y}" width="{L_W}" height="{h}"/>')
            # centre the question block so a tall neighbouring outcome does not
            # leave the question stranded at the top of its box
            qstart = y + (h - 25 * len(n['q'])) // 2 + 19
            out.append(f'<circle class="disc" cx="{L_X+28}" cy="{qstart-7}" r="15"/>')
            out.append(f'<text class="dnum" x="{L_X+28}" y="{qstart}" text-anchor="middle">{num}</text>')
            for j, line in enumerate(n['q']):
                out.append(f'<text class="qt" x="{L_X+52}" y="{qstart+j*25}">{esc(line)}</text>')

            mid = y + h // 2
            out.append(f'<line class="edge" x1="{L_X+L_W}" y1="{mid}" x2="380" y2="{mid}" '
                       f'marker-end="url(#{marker})"/>')
            out.append(f'<text class="elabel" x="353" y="{mid-11}" text-anchor="middle">YA</text>')

            title, lines = n['leaf'][0], n['leaf'][1]
            suffix = n['leaf'][2] if len(n['leaf']) > 2 else None
            out.append(f'<rect class="lbox" x="{R_X}" y="{y}" width="{R_W}" height="{h}"/>')
            out.append(f'<rect class="strip" x="{R_X}" y="{y}" width="{R_W}" height="{STRIP}"/>')
            sfx = f'<tspan class="lsfx"> {esc(suffix)}</tspan>' if suffix else ''
            out.append(f'<text class="lt" x="{R_X+16}" y="{y+24}">{esc(title)}{sfx}</text>')
            for j, line in enumerate(lines):
                out.append(f'<text class="ln" x="{R_X+16}" y="{y+STRIP+22+j*19}">{esc(line)}</text>')
        else:
            title, lines = a
            w = R_X + R_W - L_X
            out.append(f'<rect class="lbox" x="{L_X}" y="{y}" width="{w}" height="{h}"/>')
            out.append(f'<rect class="strip" x="{L_X}" y="{y}" width="{w}" height="{STRIP}"/>')
            out.append(f'<text class="lt" x="{L_X+16}" y="{y+24}">{esc(title)}</text>')
            for j, line in enumerate(lines):
                out.append(f'<text class="ln" x="{L_X+16}" y="{y+STRIP+22+j*19}">{esc(line)}</text>')

        y += h
        if i < len(parts) - 1:
            out.append(f'<line class="edge" x1="{SPINE}" y1="{y}" x2="{SPINE}" y2="{y+gap-4}" '
                       f'marker-end="url(#{marker})"/>')
            out.append(f'<text class="elabel" x="180" y="{y+gap//2+5}">TIDAK</text>')
            y += gap

    defs = (f'<defs><marker id="{marker}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
            f'markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" '
            f'fill="#000"/></marker></defs>')
    return (f'<svg class="tree" viewBox="0 0 700 {total+4}" role="img" aria-label="Pokok keputusan">\n'
            f'    {defs}\n    ' + '\n    '.join(out) + '\n  </svg>')


SERVIS = tree([
    {'q': ['Mahu ubat dihantar', 'terus ke rumah?'],
     'leaf': ('UBAT MELALUI POS',
              ['Dihantar ke alamat pilihan.',
               'Mohon sekurang-kurangnya',
               '3 minggu awal.'], '(UMP)')},
    {'q': ['Anda datang ke', 'hospital dengan kereta?'],
     'leaf': ('FARMASI PANDU LALU',
              ['Ambil dari dalam kereta.',
               'Isnin – Khamis:  12.00 tgh – 7.00 ptg',
               'Jumaat:  2.45 ptg – 7.00 ptg',
               'Sabtu:  9.00 pagi – 1.00 tgh'], '(FPL)')},
    {'q': ['Mahu ambil bila-bila', 'masa — termasuk malam', 'dan hujung minggu?'],
     'leaf': ('LOCKER4U', ['Buka 24 jam. Ambil dalam 3 hari.'])},
    {'end': ('TANYA STAF KAMI',
             ['Kami cadangkan pilihan yang paling sesuai untuk anda.'])},
], 'ae')

DAFTAR = tree([
    {'q': ['Anda ada telefon', 'pintar?'],
     'leaf': ('DAFTAR SENDIRI', ['Imbas kod QR di muka hadapan.'])},
    {'q': ['Ada waris yang', 'boleh tolong?'],
     'leaf': ('WARIS DAFTARKAN', ['Anak boleh mohon bagi pihak anda.'])},
    {'end': ('STAF DAFTARKAN DI KAUNTER',
             ['Beritahu staf hari ini — lebih kurang 5 minit sahaja.'])},
], 'ae2', gap=32)
