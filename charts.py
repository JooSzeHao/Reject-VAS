"""Charts for the VAS rejection report. Single-series magnitude bars, blue sequential hue."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pandas as pd
import textwrap

SRC = '/home/user/Reject-VAS/output/VAS_Rejection_Analysis_Clean_13Aug2026.xlsx'
OUTDIR = '/tmp/claude-0/-home-user-Reject-VAS/21f11d46-7d67-5d9f-8ce1-f77874d4a4f9/scratchpad/figs'

SERIES = '#2a78d6'
SERIES_MUTED = '#9ec5f4'
SURFACE = '#fcfcfb'
INK = '#0b0b0b'
SECOND = '#52514e'
MUTED = '#898781'
GRID = '#e1e0d9'
BASELINE = '#c3c2b7'

plt.rcParams.update({
    'font.family': 'DejaVu Sans', 'font.size': 9,
    'figure.facecolor': SURFACE, 'axes.facecolor': SURFACE,
    'text.color': INK, 'axes.labelcolor': SECOND,
    'xtick.color': MUTED, 'ytick.color': SECOND,
    'axes.edgecolor': BASELINE,
})

import os
os.makedirs(OUTDIR, exist_ok=True)

N = 84


def barh(labels, values, fname, height, wrap=46, colors=None, xlabel='Bilangan pesakit'):
    fig, ax = plt.subplots(figsize=(7.0, height), dpi=200)
    y = range(len(labels))
    cols = colors or [SERIES] * len(labels)
    ax.barh(list(y), values, color=cols, height=0.62, zorder=3)
    ax.set_yticks(list(y))
    ax.set_yticklabels(['\n'.join(textwrap.wrap(l, wrap)) for l in labels], fontsize=8.5)
    ax.invert_yaxis()
    ax.set_xlabel(xlabel, fontsize=8.5)
    ax.xaxis.grid(True, color=GRID, linewidth=0.7, zorder=0)
    ax.set_axisbelow(True)
    for s in ('top', 'right', 'left'):
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(BASELINE)
    ax.tick_params(length=0)
    span = max(values)
    ax.set_xlim(0, span * 1.30)
    for i, v in zip(y, values):
        ax.text(v + span * 0.015, i, f'{v}  ({v / N * 100:.1f}%)',
                va='center', fontsize=8.5, color=SECOND)
    fig.tight_layout()
    fig.savefig(f'{OUTDIR}/{fname}', facecolor=SURFACE)
    plt.close(fig)


# 1 — main categories
cat = pd.read_excel(SRC, sheet_name='2. Sebab Utama', header=2)
cat = cat.sort_values('Bilangan', ascending=False)
barh(cat['Kategori Sebab Penolakan'].tolist(), cat['Bilangan'].tolist(),
     'fig1_kategori.png', 3.0, wrap=38)

# 2 — sub-reasons
sub = pd.read_excel(SRC, sheet_name='3. Sub-Sebab Terperinci', header=2)
sub = sub.sort_values('Bilangan Sebutan', ascending=False)
barh(sub['Sub-Sebab'].tolist(), sub['Bilangan Sebutan'].tolist(),
     'fig2_subsebab.png', 6.4, wrap=52, xlabel='Bilangan sebutan (pesakit boleh pilih lebih daripada satu)')

# 3 — departments
dept = pd.read_excel(SRC, sheet_name='4. Jabatan', header=2)
barh(dept['Jabatan'].tolist(), dept['Bilangan'].tolist(), 'fig3_jabatan.png', 4.4, wrap=30)

# 4 — age bands, 60+ emphasised
age = pd.read_excel(SRC, sheet_name='5. Umur', header=2).dropna(subset=['Bilangan'])
age = age[age['Kumpulan Umur'].astype(str).str.match(r'\d|Tidak')]
labels = age['Kumpulan Umur'].astype(str).tolist()
vals = age['Bilangan'].astype(int).tolist()
senior = {'61 - 70', '71 - 80', '81 - 90', '91 - 100'}
cols = [SERIES if l in senior else SERIES_MUTED for l in labels]

fig, ax = plt.subplots(figsize=(7.0, 3.1), dpi=200)
ax.bar(range(len(labels)), vals, color=cols, width=0.64, zorder=3)
ax.set_xticks(range(len(labels)))
ax.set_xticklabels([l.replace('Tidak Direkod', 'Tidak\nDirekod') for l in labels], fontsize=8.5)
ax.set_ylabel('Bilangan pesakit', fontsize=8.5)
ax.yaxis.grid(True, color=GRID, linewidth=0.7, zorder=0)
ax.set_axisbelow(True)
for s in ('top', 'right', 'left'):
    ax.spines[s].set_visible(False)
ax.spines['bottom'].set_color(BASELINE)
ax.tick_params(length=0)
ax.set_ylim(0, max(vals) * 1.2)
for i, v in enumerate(vals):
    ax.text(i, v + max(vals) * 0.03, str(v), ha='center', fontsize=8.5, color=SECOND)
ax.text(0.02, 0.93, 'Biru gelap = 60 tahun ke atas (50 pesakit)', transform=ax.transAxes,
        ha='left', fontsize=8.5, color=SECOND)
fig.tight_layout()
fig.savefig(f'{OUTDIR}/fig4_umur.png', facecolor=SURFACE)
plt.close(fig)

print('figures written to', OUTDIR)
