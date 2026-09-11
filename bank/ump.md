# Bank Soalan — Ubat Melalui Pos (UMP)

Soalan berkaitan penghantaran ubat melalui pos: status penghantaran, kelewatan, penjejakan bungkusan, ubat salah atau tidak mencukupi, dan kelayakan perkhidmatan.

Setiap tiket direkod dalam format blok di bawah. Kekalkan format ini walaupun
menambah rekod secara manual — ia yang membolehkan carian `grep` berfungsi.
Awalan ID bagi fail ini ialah `UMP`. Nombor bermula dari 0001 dan bertambah satu bagi setiap rekod baharu.

```markdown
## [UMP-NNNN] TTTT-BB-HH — <soalan ringkas>
**Kategori:** UMP · **Tag:** <tag, dipisah koma>
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

## [UMP-0001] 2026-09-11 — Bila akan dapat bekalan ubat seterusnya
**Kategori:** UMP · **Tag:** tarikh bekalan, status penghantaran, pos laju, nombor penjejakan
**Soalan pesakit:**
> Salam Tuan/Puan, bolehkah saya tahu bila saya akan mendapat bekalan ubat seterusnya?

**Jawapan:**
Salam sejahtera,

Bekalan ubat anda yang seterusnya ditetapkan pada 16/9/2026, dan bungkusan akan diserahkan kepada Pos Laju hari ini.

Nombor penjejakan akan dipaparkan dalam aplikasi MyUbat setelah ubat diposkan.

Terima kasih.

**Rujukan:** knowledge/perkhidmatan-vas-hsis-serdang.md (UMP — nombor penjejakan dipaparkan dalam MyUbat setelah ubat diposkan). Tarikh 16/9/2026 dan status penyerahan bungkusan disahkan oleh pegawai daripada rekod sistem.
**Keyakinan:** Tinggi
**Nota pegawai:** Tarikh bekalan dan status bungkusan diambil daripada rekod sistem. Bagi soalan "bila dapat ubat", semak rekod dahulu dan berikan tarikh sebenar — jangan hanya mengarahkan pesakit menyemak aplikasi sendiri.
**Status:** Dihantar

## [UMP-0002] 2026-09-11 — Aduan: menyangka bekalan ubat dibatalkan selepas permohonan lewat
**Kategori:** UMP · **Tag:** permohonan lewat, permohonan tidak diterima, ambil di kaunter, aduan, salah faham
**Soalan pesakit:**
> Ada waktu kita terlupa, tapi tidak sepatutnya terus dibatalkan bekalan ubat. Ada ini cara hospital kerajaan mengendalinya? Apa rakyat tidak penting untuk mengundi?

**Jawapan:**
Salam sejahtera,

Bekalan ubat anda tidak dibatalkan. Permohonan Ubat Melalui Pos (UMP) tidak diterima kerana dihantar lewat.

Anda masih boleh mendapatkan ubat tersebut dengan mengambilnya sendiri di kaunter farmasi.

Terima kasih.

**Rujukan:** knowledge/perkhidmatan-vas-hsis-serdang.md (UMP — mohon selewatnya 3 minggu sebelum ubat habis). Sebab penolakan dan hak mengambil di kaunter disahkan oleh pegawai.
**Keyakinan:** Tinggi
**Nota pegawai:** Guna ayat ringkas "Permohonan UMP tidak diterima" — jangan berbelit dengan "yang tidak dapat diteruskan hanyalah...".
Nasihat tempoh 3 minggu untuk permohonan akan datang dibuang — pesakit tidak
bertanya mengenainya. Berhenti selepas menjawab apa yang ditanya.
**Status:** Dihantar

<!-- Corak untuk tiket beremosi: pesakit menyangka BEKALAN UBAT dibatalkan, sedangkan
yang ditolak hanyalah permohonan VAS. Betulkan salah faham itu dahulu, kemudian
nyatakan pilihan mengambil di kaunter. Kenyataan berbaur politik dalam tiket tidak
dijawab — pegawai tidak membantah pendekatan ini. Tiada ayat simpati dibuka; sahkan
jika gaya rumah memerlukannya. -->
