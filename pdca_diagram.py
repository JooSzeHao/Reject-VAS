"""Rajah kitaran PDCA untuk usaha peningkatan VAS% — output PNG.

Gelang empat segmen berputar mengikut arah jam (Plan -> Do -> Check -> Act),
tujuan utama di tengah kitaran, teks diringkaskan kepada label pendek sahaja.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Wedge, Circle, Polygon
import numpy as np

OUT = '/home/user/Reject-VAS/output/PDCA_VAS_Kitaran.png'

# Teal Trust — palet sama seperti deck
DEEP = '#083F49'
TEAL = '#028090'
SEA = '#00A896'
MINT = '#9AD9DA'
AMBER = '#E08A3C'
INK = '#10262B'
BODY = '#3E5A61'
MUTED = '#7C9198'
WHITE = '#FFFFFF'

R_IN, R_OUT = 0.46, 0.80
R_MID = (R_IN + R_OUT) / 2
R_CENTRE = 0.40
HEAD = 14          # darjah, panjang mata anak panah
TX = 1.10          # kedudukan mendatar blok teks

# Arah jam: Plan (atas kanan) -> Do (bawah kanan) -> Check (bawah kiri) -> Act (atas kiri).
# Wedge dilukis lawan jam dari a1 ke a2; hujung arah jam ialah a1, tempat mata panah.
PHASES = [
    dict(key='PLAN', word='Rancang', color=TEAL, a1=8, a2=82,
         items=['Asas 40.8%', 'Sasaran 65%', 'Hipotesis: terlalu bergantung UMP'],
         tx=TX, ty=0.68, ha='left'),
    dict(key='DO', word='Laksana', color=SEA, a1=278, a2=352,
         items=['Pelbagaikan servis', 'eSyms · FPL · IDTF'],
         tx=TX, ty=-0.68, ha='left'),
    dict(key='CHECK', word='Semak', color=AMBER, a1=188, a2=262,
         items=['VAS% naik ke 55.35%', 'Kajian penolakan VAS', 'Kelemahan dikenal pasti'],
         tx=-TX, ty=-0.68, ha='right'),
    dict(key='ACT', word='Tindak', color=DEEP, a1=98, a2=172,
         items=['Kekalkan promosi', 'Kekalkan servis sedia ada'],
         tx=-TX, ty=0.68, ha='right'),
]

fig, ax = plt.subplots(figsize=(15.5, 9.5), dpi=200)
fig.patch.set_facecolor(WHITE)
ax.set_xlim(-2.2, 2.2)
ax.set_ylim(-1.35, 1.35)
ax.set_aspect('equal')
ax.axis('off')


def arrow_head(theta_deg, color):
    """Mata anak panah pada hujung segmen, menghala mengikut arah jam."""
    tip = np.radians(theta_deg - HEAD)
    base = np.radians(theta_deg)
    pts = [(R_MID * np.cos(tip), R_MID * np.sin(tip)),
           ((R_OUT + 0.03) * np.cos(base), (R_OUT + 0.03) * np.sin(base)),
           ((R_IN - 0.03) * np.cos(base), (R_IN - 0.03) * np.sin(base))]
    ax.add_patch(Polygon(pts, closed=True, facecolor=color, edgecolor='none', zorder=3))


for p in PHASES:
    ax.add_patch(Wedge((0, 0), R_OUT, p['a1'], p['a2'], width=R_OUT - R_IN,
                       facecolor=p['color'], edgecolor='none', zorder=2))
    arrow_head(p['a1'], p['color'])

    mid = np.radians((p['a1'] + p['a2']) / 2)
    r_lab = R_MID + 0.015
    cx, cy = r_lab * np.cos(mid), r_lab * np.sin(mid)
    ax.text(cx, cy + 0.042, p['key'], ha='center', va='center', color=WHITE,
            fontsize=20, fontweight='bold', zorder=4)
    ax.text(cx, cy - 0.068, p['word'], ha='center', va='center', color=WHITE,
            fontsize=12.5, alpha=0.9, zorder=4)

    step, n = 0.185, len(p['items'])
    top = p['ty'] + step * (n - 1) / 2
    for i, it in enumerate(p['items']):
        ax.text(p['tx'], top - i * step, it, ha=p['ha'], va='center',
                color=BODY, fontsize=14.5)
    bar_x = p['tx'] - 0.07 if p['ha'] == 'left' else p['tx'] + 0.07
    half = step * (n - 1) / 2 + 0.055
    ax.plot([bar_x, bar_x], [p['ty'] - half, p['ty'] + half], color=p['color'],
            lw=3.5, solid_capstyle='round', zorder=1)

# tujuan utama di tengah kitaran
ax.add_patch(Circle((0, 0), R_CENTRE, facecolor=DEEP, edgecolor='none', zorder=5))
ax.text(0, 0.162, 'MENINGKATKAN', ha='center', va='center', color=MINT,
        fontsize=12.5, fontweight='bold', zorder=6)
ax.text(0, 0.038, 'VAS%', ha='center', va='center', color=WHITE,
        fontsize=38, fontweight='bold', zorder=6)
ax.text(0, -0.108, '40.8%  →  65%', ha='center', va='center', color=SEA,
        fontsize=17, fontweight='bold', zorder=6)
ax.text(0, -0.222, 'sasaran hospital', ha='center', va='center', color=MUTED,
        fontsize=11, zorder=6)

ax.text(0, 1.25, 'KITARAN PDCA', ha='center', va='center', color=INK,
        fontsize=16, fontweight='bold')
ax.text(0, -1.25, 'Farmasi Klinik Pesakit Luar, HSIS  ·  Q2 2025 – Q2 2026',
        ha='center', va='center', color=MUTED, fontsize=11)

fig.savefig(OUT, dpi=200, facecolor=WHITE, bbox_inches='tight', pad_inches=0.3)
print('Ditulis:', OUT)
