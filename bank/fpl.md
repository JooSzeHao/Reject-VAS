# Bank Soalan — Farmasi Pandu Lalu (FPL)

Soalan berkaitan Farmasi Pandu Lalu: cara tempahan, lokasi, waktu operasi, proses pengambilan, dan pengambilan oleh wakil.

Setiap tiket direkod dalam format blok di bawah. Kekalkan format ini walaupun
menambah rekod secara manual — ia yang membolehkan carian `grep` berfungsi.
Awalan ID bagi fail ini ialah `FPL`. Nombor bermula dari 0001 dan bertambah satu bagi setiap rekod baharu.

```markdown
## [FPL-NNNN] TTTT-BB-HH — <soalan ringkas>
**Kategori:** FPL · **Tag:** <tag, dipisah koma>
**Soalan pesakit:**
> <teks pesakit, maklumat peribadi ditapis>

**Jawapan:**
<jawapan akhir penuh>

**Rujukan:** <knowledge/fail.md, atau ID tiket lama, atau "Tiada">
**Keyakinan:** <Tinggi | Sederhana | Rendah>
**Nota pegawai:** <pindaan yang diminta pegawai, atau "Tiada">
**Status:** <Dihantar | Perlu semakan farmasis>
```

---

<!-- Rekod bermula di bawah. Rekod baharu ditambah di hujung fail. -->
