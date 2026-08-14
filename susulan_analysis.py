"""Analisis Bilangan Preskripsi Susulan (Ulangan) Q2 2025 - Q2 2026
dan kesannya ke atas peratus VAS.

Sumber: Google Sheet "Reject VAS" (tab data bulanan Rx Ulangan & VAS mengikut servis).
Output: jadual ringkasan CSV + rumusan dicetak ke stdout.
"""

import csv
import os

# ---------------------------------------------------------------------------
# Data bulanan: (tahun, bulan, lokasi, Rx Ulangan VAS, Rx Ulangan Bukan VAS)
# ---------------------------------------------------------------------------
MONTHLY = [
    # 2025 MB
    (2025, 1, "MB", 2107, 4984), (2025, 2, "MB", 2057, 4925),
    (2025, 3, "MB", 1805, 4255), (2025, 4, "MB", 1515, 5755),
    (2025, 5, "MB", 1519, 4468), (2025, 6, "MB", 1160, 4783),
    (2025, 7, "MB", 1557, 5447), (2025, 8, "MB", 1502, 5078),
    (2025, 9, "MB", 1809, 5560), (2025, 10, "MB", 1947, 6194),
    (2025, 11, "MB", 2404, 3703), (2025, 12, "MB", 2745, 3793),
    # 2025 PJ
    (2025, 1, "PJ", 3753, 3993), (2025, 2, "PJ", 4294, 5122),
    (2025, 3, "PJ", 6418, 4140), (2025, 4, "PJ", 5400, 3584),
    (2025, 5, "PJ", 5017, 4615), (2025, 6, "PJ", 4090, 3902),
    (2025, 7, "PJ", 4472, 4573), (2025, 8, "PJ", 3837, 4363),
    (2025, 9, "PJ", 4317, 4547), (2025, 10, "PJ", 5051, 5838),
    (2025, 11, "PJ", 4298, 2864), (2025, 12, "PJ", 4012, 3497),
    # 2026 MB
    (2026, 1, "MB", 3074, 3610), (2026, 2, "MB", 2765, 2473),
    (2026, 3, "MB", 2950, 3091), (2026, 4, "MB", 2830, 3842),
    (2026, 5, "MB", 3099, 3357), (2026, 6, "MB", 2386, 3931),
    # 2026 PJ
    (2026, 1, "PJ", 4918, 2686), (2026, 2, "PJ", 5138, 2389),
    (2026, 3, "PJ", 6001, 2333), (2026, 4, "PJ", 4566, 2531),
    (2026, 5, "PJ", 4431, 2032), (2026, 6, "PJ", 5393, 2620),
]

# Pecahan VAS mengikut servis: UMP, Locker, Esyms, IDTF, Pandu lalu
SERVICES = ["UMP", "Locker", "Esyms", "IDTF", "Pandu lalu"]
_svc_rows = [
    (2025, 1, "MB", 2052, 55, 0, 0, 0), (2025, 1, "PJ", 3589, 82, 0, 0, 0),
    (2025, 2, "MB", 2001, 56, 0, 0, 0), (2025, 2, "PJ", 4118, 88, 0, 0, 0),
    (2025, 3, "MB", 1741, 64, 0, 0, 0), (2025, 3, "PJ", 6322, 48, 0, 0, 0),
    (2025, 4, "MB", 1405, 81, 29, 0, 0), (2025, 4, "PJ", 5298, 51, 0, 0, 0),
    (2025, 5, "MB", 1288, 80, 151, 0, 0), (2025, 5, "PJ", 4885, 56, 10, 0, 0),
    (2025, 6, "MB", 906, 64, 186, 4, 0), (2025, 6, "PJ", 3709, 53, 136, 3, 0),
    (2025, 7, "MB", 1139, 78, 337, 3, 0), (2025, 7, "PJ", 4125, 53, 283, 11, 0),
    (2025, 8, "MB", 1185, 67, 248, 2, 0), (2025, 8, "PJ", 3462, 68, 298, 9, 0),
    (2025, 9, "MB", 1331, 57, 412, 2, 7), (2025, 9, "PJ", 3889, 69, 303, 13, 7),
    (2025, 10, "MB", 1488, 81, 308, 2, 68), (2025, 10, "PJ", 4638, 55, 313, 8, 37),
    (2025, 11, "MB", 1414, 80, 673, 4, 233), (2025, 11, "PJ", 4030, 63, 68, 11, 126),
    (2025, 12, "MB", 1691, 123, 391, 20, 520), (2025, 12, "PJ", 3381, 94, 93, 12, 420),
    (2026, 1, "MB", 1900, 123, 408, 33, 610), (2026, 1, "PJ", 4180, 129, 56, 14, 539),
    (2026, 2, "MB", 1777, 141, 208, 21, 618), (2026, 2, "PJ", 4356, 93, 32, 13, 644),
    (2026, 3, "MB", 1970, 117, 195, 23, 645), (2026, 3, "PJ", 5152, 148, 37, 13, 651),
    (2026, 4, "MB", 1922, 171, 137, 36, 564), (2026, 4, "PJ", 3721, 128, 23, 11, 683),
    (2026, 5, "MB", 2344, 126, 110, 53, 466), (2026, 5, "PJ", 3640, 165, 25, 8, 593),
    (2026, 6, "MB", 1663, 154, 96, 19, 454), (2026, 6, "PJ", 4537, 150, 23, 15, 668),
]
SERVICE = {(y, m, loc): dict(zip(SERVICES, vals)) for y, m, loc, *vals in _svc_rows}


def quarter(month):
    return (month - 1) // 3 + 1


QUARTERS = [(2025, 2), (2025, 3), (2025, 4), (2026, 1), (2026, 2)]
QLABEL = {q: f"Q{q[1]} {q[0]}" for q in QUARTERS}


def agg(locs):
    """Agregat suku tahunan untuk senarai lokasi."""
    out = {q: {"vas": 0, "nonvas": 0, "svc": dict.fromkeys(SERVICES, 0)} for q in QUARTERS}
    for y, m, loc, vas, nonvas in MONTHLY:
        key = (y, quarter(m))
        if key in out and loc in locs:
            out[key]["vas"] += vas
            out[key]["nonvas"] += nonvas
            for s, v in SERVICE[(y, m, loc)].items():
                out[key]["svc"][s] += v
    for q in QUARTERS:
        d = out[q]
        d["total"] = d["vas"] + d["nonvas"]
        d["pct"] = 100.0 * d["vas"] / d["total"] if d["total"] else 0.0
    return out


def decompose(a, b):
    """Pecahan perubahan VAS% antara dua suku: kesan pengangka vs penyebut.

    p = V/D.  dp = (V1-V0)/D0 + V1*(D0-D1)/(D0*D1)  -- tepat, tanpa baki.
    """
    v0, d0 = a["vas"], a["total"]
    v1, d1 = b["vas"], b["total"]
    return 100.0 * (v1 - v0) / d0, 100.0 * v1 * (d0 - d1) / (d0 * d1)


def pct(x):
    return f"{x:.2f}%"


def sgn(x, dp=0):
    return f"{x:+,.{dp}f}"


def main():
    views = {"MB": agg({"MB"}), "PJ": agg({"PJ"}), "GABUNGAN": agg({"MB", "PJ"})}
    rows = []

    for name, data in views.items():
        print(f"\n{'=' * 80}\n{name}\n{'=' * 80}")
        print(f"{'Suku':<9}{'Susulan (D)':>13}{'VAS (N)':>10}{'Bukan VAS':>11}"
              f"{'VAS%':>9}{'D QoQ':>9}{'N QoQ':>9}")
        prev = None
        for q in QUARTERS:
            d = data[q]
            dq = f"{100.0 * (d['total'] / prev['total'] - 1):+.1f}%" if prev else ""
            nq = f"{100.0 * (d['vas'] / prev['vas'] - 1):+.1f}%" if prev else ""
            print(f"{QLABEL[q]:<9}{d['total']:>13,}{d['vas']:>10,}{d['nonvas']:>11,}"
                  f"{pct(d['pct']):>9}{dq:>9}{nq:>9}")
            rows.append({
                "Skop": name, "Suku": QLABEL[q], "Rx_Susulan": d["total"],
                "Rx_VAS": d["vas"], "Rx_Bukan_VAS": d["nonvas"],
                "VAS_pct": round(d["pct"], 2),
                **{f"VAS_{s}": d["svc"][s] for s in SERVICES},
            })
            prev = d

        a, b = data[(2025, 2)], data[(2026, 2)]
        num, den = decompose(a, b)
        print(f"\n  Q2 2025 -> Q2 2026: VAS% {pct(a['pct'])} -> {pct(b['pct'])} "
              f"({sgn(b['pct'] - a['pct'], 2)} mata peratus)")
        print(f"    Penyebut (susulan) : {a['total']:>7,} -> {b['total']:>7,}  "
              f"({sgn(b['total'] - a['total'])}, {100.0 * (b['total'] / a['total'] - 1):+.1f}%)")
        print(f"    Pengangka (VAS)    : {a['vas']:>7,} -> {b['vas']:>7,}  "
              f"({sgn(b['vas'] - a['vas'])}, {100.0 * (b['vas'] / a['vas'] - 1):+.1f}%)")
        print(f"    Bukan VAS          : {a['nonvas']:>7,} -> {b['nonvas']:>7,}  "
              f"({sgn(b['nonvas'] - a['nonvas'])}, {100.0 * (b['nonvas'] / a['nonvas'] - 1):+.1f}%)")
        print(f"    Pecahan kesan      : pengangka {sgn(num, 2)} mata | "
              f"penyebut {sgn(den, 2)} mata (jumlah {sgn(num + den, 2)})")
        if num or den:
            print(f"    Sumbangan penyusutan penyebut: "
                  f"{100.0 * abs(den) / (abs(num) + abs(den)):.0f}% daripada perubahan")

        print("\n    VAS mengikut servis (Q2 2025 -> Q2 2026):")
        for s in SERVICES:
            v0, v1 = a["svc"][s], b["svc"][s]
            sh0 = 100.0 * v0 / a["vas"] if a["vas"] else 0
            sh1 = 100.0 * v1 / b["vas"] if b["vas"] else 0
            print(f"      {s:<11}{v0:>7,} ({sh0:5.1f}%) -> {v1:>7,} ({sh1:5.1f}%)   {sgn(v1 - v0)}")

    print(f"\n{'=' * 80}\nSEMAKAN INTEGRITI DATA (jumlah servis vs lajur Rx Ulangan VAS)\n{'=' * 80}")
    worst = []
    for y, m, loc, vas, _ in MONTHLY:
        svc = sum(SERVICE[(y, m, loc)].values())
        if svc != vas:
            worst.append((abs(svc - vas), y, m, loc, svc, vas))
    worst.sort(reverse=True)
    print(f"  {len(worst)} daripada {len(MONTHLY)} baris bulanan tidak sepadan.")
    for _, y, m, loc, svc, vas in worst[:8]:
        print(f"    {loc} {m:>2}/{y}: servis {svc:>6,} vs VAS {vas:>6,}  ({sgn(svc - vas)})")

    print(f"\n{'=' * 80}\nUJIAN KEPEKAAN (GABUNGAN)\n{'=' * 80}")
    g = views["GABUNGAN"]
    a, b = g[(2025, 2)], g[(2026, 2)]
    hyp = 100.0 * b["vas"] / a["total"]
    print(f"  VAS% sebenar Q2 2026                                : {pct(b['pct'])}")
    print(f"  Jika penyebut kekal pada paras Q2 2025 ({a['total']:,})      : {pct(hyp)}")
    print(f"  Beza disebabkan penyusutan penyebut semata-mata     : {sgn(b['pct'] - hyp, 2)} mata")
    print(f"  Penyebut maksimum agar VAS Q2 2026 kekal >=25%      : {b['vas'] / 0.25:,.0f} "
          f"(sebenar {b['total']:,})")

    os.makedirs("output", exist_ok=True)
    path = "output/susulan_vas_ringkasan.csv"
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"\nCSV ditulis: {path}")


if __name__ == "__main__":
    main()
