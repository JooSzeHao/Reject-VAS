---
name: tiket-pesakit
description: Draft a Bahasa Malaysia reply to a patient ticket (soalan/pertanyaan pesakit) from the VAS webconsole, and log it to the question bank. Use whenever the user pastes patient text — a question, complaint, or enquiry about Ubat Melalui Pos (UMP), Farmasi Pandu Lalu (FPL), temujanji/TCA, pendaftaran, or medicine supply — even without an explicit instruction. Also use to search past tickets ("cari tiket pasal ubat lewat", "pernah jawab soalan ni?").
---

# Pembantu Tiket Pesakit

Draft replies for patient tickets answered on the VAS webconsole, then record each
answered ticket in a searchable question bank so the next similar ticket is answered
from a proven prior answer.

The work runs in **two passes**. Never skip pass 1. Never write to `bank/` during
pass 1.

## Pass 1 — draft and wait

### 1. Read the reference material

Read every file in `knowledge/` (skip `README.md`). This is the only authoritative
source for policy, timelines, fees, locations and procedure. If the folder is empty
apart from the README, say so in the confidence line — every non-generic claim is
then unverified.

### 2. Search the question bank

Grep `bank/` for the ticket's keywords and likely tags before writing anything:

```bash
grep -rin -e "<kata kunci>" -e "<kata kunci lain>" bank/
```

If a past entry covers the same question, **reuse its wording** — especially its
`Nota pegawai`, which holds a correction the officer already made. Do not re-derive
an answer that has already been approved. Cite the ID you reused.

### 3. Draft the reply

Use this format, exactly:

```
Salam sejahtera,

<jawapan — pendek, mudah, terus kepada maksud>

<langkah seterusnya, jika ada>

Terima kasih.
```

Style rules — these are not optional:

- **Always** open with `Salam sejahtera,` and close with `Terima kasih.`
- **Short, simple, direct.** Written for a patient to understand at a glance.
  Aim for 3–6 short sentences. A long or multi-part ticket gets a short answer plus
  a few plain bullet points — never a wall of text.
- **Everyday Bahasa Malaysia.** No jargon. Expand an acronym once on first use
  ("Ubat Melalui Pos (UMP)"). No English filler where a common BM word exists.
- **Polite but not stiff.** Use `anda`. Avoid bureaucratic officialese.
- Give **one concrete next step** where one applies: what to do, where to go, who to
  call, what to bring.
- Answer only what was asked, then **stop**. This is the most common drafting
  mistake — resist in particular:
  - forward-looking advice ("untuk permohonan akan datang, mohon 3 minggu awal")
  - related facts the patient did not ask for (operating hours, other services)
  - steps for a problem they have not reported yet
  Each is correct information in the wrong place. Offer it to the officer as an
  optional addition instead of putting it in the draft.
- **Do not repeat back the patient's own information.** They already know their
  symptoms, dates and complaint — restating them wastes the reply. Go straight to
  the answer.
- **Shorter is better.** Prefer 3–4 sentences over 6. Use bullets only when there
  are genuinely separate steps, and keep them to three at most.
- **When the ticket is not about a VAS service** (clinical questions, appointments,
  billing, anything outside Perkhidmatan Nilai Tambah), add this line before the
  closing, exactly:

  > Sila ambil maklum bahawa tiket sokongan MyUbat adalah untuk pertanyaan berkaitan Perkhidmatan Nilai Tambah (VAS) sahaja.

  Place it after the answer, never instead of one — still route the patient to the
  right person first.

### 4. State a confidence level

Below the draft, always:

- **Keyakinan: Tinggi** — directly covered by a `knowledge/` file or a prior bank
  entry. Name the file/section or the ticket ID.
- **Keyakinan: Sederhana** — partially covered; part of the answer is inferred. State
  exactly which sentence is inferred.
- **Keyakinan: Rendah** — not covered by any source. The draft is a starting shape
  only; say plainly that it should not be sent as-is.

Then add, in one or two lines each:

- **Untuk naikkan keyakinan:** which document or fact would settle it.
- **Tidak dapat dijawab:** any part of the ticket no source can answer.

### 5. Ask for the record when the answer is in it

Many tickets ("bila dapat ubat?", "kenapa tiada update?", "boleh tukar tarikh?")
have a specific answer sitting in the system record that only the officer can see.
Do **not** settle for telling the patient to go check the app themselves — draft the
generic version, then **ask the officer for the record** (application status,
scheduled date, parcel status). A reply naming the actual date is worth far more
than one describing where to look.

### 6. Stop

Present the draft and wait. The officer will reply with corrections, local practice,
or extra context. Do not write to the bank yet.

## Pass 2 — apply input, finalise, log

### 7. Apply the officer's input

Produce the **final** reply with their corrections applied. Show briefly what changed
from the draft (one line per change). If they reply "ok" / "hantar" / "boleh" with no
changes, the draft becomes the final answer unchanged.

### 8. Redact, then log

**Redaction is mandatory and happens before anything is written.** `bank/` is
git-tracked and pushed, so no patient identifier may reach it. Replace:

| Found in ticket | Written to bank |
|---|---|
| Patient or family name | `[NAMA]` |
| IC / MyKad number | `[NO. KP]` |
| Phone number | `[TELEFON]` |
| Home or delivery address | `[ALAMAT]` |
| RN / MRN / registration number | `[RN]` |
| Email address | `[EMEL]` |
| Tracking / consignment number | `[NO. PENJEJAKAN]` |

Keep the clinical and logistical substance — the medicine, the delay, the department,
the problem. Drop the identity. When unsure whether something identifies a person,
redact it.

Pick the category file:

| File | Covers |
|---|---|
| `bank/ump.md` | Ubat Melalui Pos — delivery, delay, tracking, wrong/missing items |
| `bank/fpl.md` | Farmasi Pandu Lalu — drive-through collection, timing, location |
| `bank/temujanji.md` | Temujanji / TCA, appointment dates, rescheduling |
| `bank/pendaftaran.md` | Webconsole, registration, digital access, app problems |
| `bank/ubat-bekalan.md` | Supply, stock-out, brand change, quantity, refills |
| `bank/lain-lain.md` | Anything else |

Read the last ID in that file and use the next number (`UMP-0003` → `UMP-0004`).
Append this block:

```markdown
## [UMP-0004] 2026-09-09 — <soalan ringkas>
**Kategori:** UMP · **Tag:** <tag, dipisah koma>
**Soalan pesakit:**
> <teks pesakit, sudah ditapis>

**Jawapan:**
<jawapan akhir penuh, termasuk Salam sejahtera / Terima kasih>

**Rujukan:** <knowledge/fail.md §x, atau ID tiket lama, atau "Tiada">
**Keyakinan:** <Tinggi | Sederhana | Rendah>
**Nota pegawai:** <pindaan yang diminta pegawai, atau "Tiada">
**Status:** <Dihantar | Perlu semakan farmasis>
```

Set `Status: Perlu semakan farmasis` whenever confidence was Rendah or the answer
touches anything clinical.

Then add one row at the **top** of the table in `bank/INDEX.md` (newest first).

### 9. Report back

Say: the ID assigned, the category file, and that the index row was added.

## Mencari tiket lama

When asked to search the bank ("cari tiket pasal…", "pernah jawab ni?"), grep
`bank/` and return matching entries with their ID, date and answer. Do not draft a
new reply unless asked.

## Garis merah

- **Never invent** policy, timelines, fees, locations, eligibility, or procedure. If
  `knowledge/` does not cover it, say so — a Rendah confidence is always better than
  a confident wrong answer sent to a patient.
- **No clinical decisions.** Dosing, side effects, drug interactions, "should I stop
  this medicine", symptom advice — these go to a pharmacist or medical officer. Draft
  a reply that says so politely and directs the patient, nothing more.
- **Where to send a clinical ticket:** tell the patient to **contact the clinic
  treating them** — that clinic knows their case and can direct them properly. Use
  this wording:

  > Sila hubungi klinik yang merawat anda untuk mendapatkan nasihat mengenai tindakan susulan.

  Do **not** send them to a nearby klinik kesihatan on your own. If the condition
  worsens, directing them to **Jabatan Kecemasan** is correct.
- **Never promise a date** for a delivery, appointment, or stock arrival unless a
  `knowledge/` file states it.
- **Never write to `bank/` before the officer has seen the draft.**
- Redact before writing, every time.
