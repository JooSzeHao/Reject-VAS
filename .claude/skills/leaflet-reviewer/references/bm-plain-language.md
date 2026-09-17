# Bahasa Melayu plain language for patient leaflets

Flesch–Kincaid, SMOG and similar formulas are calibrated on English syllable and word
statistics. Do **not** report a US grade level for a BM draft. Use these proxies instead.

## BM readability heuristics

Flag a sentence when any of these is true:

1. **Length** — over 15 words. Over 20 words is a Should fix, always.
2. **Affix stacking** — more than two heavily affixed words in one sentence
   (`meng-…-kan`, `di-…-kan`, `ke-…-an`, `per-…-an`, `mem-per-…-kan`). These are the
   BM equivalent of nominalised English and are the main driver of "kaku" official prose.
3. **Passive drift** — `di-` verb with no visible actor where an active line would do.
   `Borang hendaklah dikemukakan` → `Serahkan borang kepada staf`.
4. **Bureaucratic connectors** — `hendaklah`, `adalah`, `berkenaan`, `tersebut`,
   `sehubungan itu`, `mana-mana`, `di samping itu`, `bagi tujuan`. Each is a rewrite prompt.
5. **Noun-stacked phrases** — three or more nouns in a row
   (`permohonan pendaftaran perkhidmatan bekalan ubat`). Break into a verb phrase.
6. **Unfamiliar loanwords** where a common word exists: `mengemukakan` → `hantar`,
   `memaklumkan` → `beritahu`, `sekiranya` → `kalau` / `jika`.
7. **Untranslated English clinical term** with no BM gloss, or the reverse — a formal BM
   coinage where patients only know the English word. Use the word patients say, then
   the formal term in brackets once, if it must appear at all.

Aim for: ≤ 15 words per sentence, ≤ 2 affixed words per sentence, active voice,
second person `anda`, one instruction per line.

## Register

- **Use** `anda`, `kami`, `sila`, `boleh`, `kalau`, `beritahu`, `ambil`, `mohon`.
- **Avoid** `pihak`, `hendaklah`, `adalah dimaklumkan`, `tuan/puan` in body copy,
  `mana-mana pihak`, `seperti yang tersebut di atas`.
- Keep the honorific for the signature block and the header, not for instructions.

## Jargon → plain swaps (Malaysian hospital pharmacy)

| Draft term | Patient-facing replacement |
|---|---|
| Perkhidmatan Nilai Tambah (VAS) | Cara mudah ambil ubat susulan *(expand on first use, then use the plain phrase)* |
| Preskripsi ulangan / bekalan susulan | Ubat sambungan / ubat bulan berikutnya |
| Ubat Melalui Pos (UMP) | Ubat dihantar ke rumah |
| Farmasi Pandu Lalu (FPL) | Ambil ubat dari dalam kereta |
| Lokar Ubat / Locker4U | Ambil ubat dari lokar, bila-bila masa |
| Temujanji / janji temu | Tarikh anda datang ke hospital |
| Mengemukakan permohonan | Mohon / daftar |
| Dimaklumkan bahawa | *(cut entirely; state the fact)* |
| Tertakluk kepada syarat | Syarat: … *(then state the actual condition)* |
| No. Pendaftaran (MRN) | Nombor pesakit (dalam kad/slip anda) |
| Waris | Anak, pasangan atau sesiapa yang tolong anda |
| Bekalan ubat akan dibekalkan | Kami hantar ubat anda |
| Tempoh pemprosesan | Berapa lama |

Keep the official acronym exactly once, where the patient must recognise it on a sign,
a counter, or the app — then drop back to plain words for the rest of the leaflet.

## Numbers, time and money

- Write times the way people say them: `12.00 tgh – 7.00 ptg`, not `1200–1900 jam`.
- Give lead times as an action, not a duration: `Mohon 3 minggu sebelum tarikh ubat habis`.
- State cost explicitly even when free — `Percuma` beats silence, which patients read
  as "probably charged".
- Days: spell out the range (`Isnin – Khamis`), and always say what happens on the days
  not listed.

## Bilingual and multilingual drafts

- Never interleave BM and English in the same sentence unless the English term is the
  one on the physical signage or app button.
- If both languages are needed, keep them in parallel blocks with identical structure,
  not alternating paragraphs — patients read one column, not both.
- Check that a translated CTA is still a verb in the target language.

## Local address conventions

- `Hospital Sultan Idris Shah, Serdang` — full name first use, `HSIS` after.
- Always pair a phone number with its extension on the same line, and say the hours
  the line is answered. An unanswered number is worse than no number.
