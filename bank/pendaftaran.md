# Bank Soalan — Pendaftaran & Webconsole

Soalan berkaitan pendaftaran perkhidmatan, akses webconsole, masalah aplikasi atau sistem, kemas kini maklumat, dan halangan celik digital.

Setiap tiket direkod dalam format blok di bawah. Kekalkan format ini walaupun
menambah rekod secara manual — ia yang membolehkan carian `grep` berfungsi.
Awalan ID bagi fail ini ialah `REG`. Nombor bermula dari 0001 dan bertambah satu bagi setiap rekod baharu.

```markdown
## [REG-NNNN] TTTT-BB-HH — <soalan ringkas>
**Kategori:** REG · **Tag:** <tag, dipisah koma>
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

## [REG-0001] 2026-09-09 — Cuba daftar akaun, dimaklumkan akaun sudah wujud
**Kategori:** REG · **Tag:** akaun sedia ada, satu kad pengenalan satu akaun, terlupa kata laluan, set semula kata laluan
**Soalan pesakit:**
> Dimaklum sudah ada akaun.

**Jawapan:**
Salam sejahtera,

Untuk makluman, satu nombor kad pengenalan hanya boleh didaftarkan dengan satu akaun MyUbat sahaja.

Jika anda terlupa kata laluan, tekan "Terlupa Kata Laluan" di skrin log masuk dan masukkan alamat e-mel yang digunakan semasa pendaftaran. Kod pengesahan 6 digit akan dihantar ke e-mel tersebut untuk anda menetapkan kata laluan baharu.

Sekiranya masih tidak berjaya, sila hubungi Farmasi di talian 03-8947 5555 (samb. 1113).

Terima kasih.

**Rujukan:** knowledge/panduan-myubat.md (Pendaftaran akaun baharu; Terlupa kata laluan); knowledge/perkhidmatan-vas-hsis-serdang.md (talian pertanyaan). Peraturan satu kad pengenalan satu akaun disahkan oleh pegawai.
**Keyakinan:** Tinggi
**Nota pegawai:** Mulakan dengan "Untuk makluman, ...". Jangan ulang semula bahawa akaun pesakit sudah wujud — pesakit sendiri sudah menyatakannya.
**Status:** Dihantar

<!-- Belum diputuskan: bagi pesakit yang langsung tiada alamat e-mel, set semula kata
laluan tidak akan berfungsi. Manual MyUbat menyatakan mereka perlu terus mendapatkan
bantuan di kaunter farmasi KKM. Sahkan sama ada jawapan patut menyebut kes ini. -->
