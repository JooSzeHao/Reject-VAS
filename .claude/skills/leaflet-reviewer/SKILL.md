---
name: leaflet-reviewer
description: Review and refine patient-facing leaflets, pamphlets, risalah, posters, consent slips and hospital notices for readability, plain language, patient-centred messaging, layout, tone and call-to-action strength. Use when asked to review, critique, simplify, rewrite or "make patient-friendly" any draft meant to be read directly by patients or the public — including the Bahasa Melayu VAS/MyUBAT risalah in pamphlet/. Also use before sending a patient leaflet to print.
---

# Leaflet Reviewer

Expert patient-education strategist and healthcare copywriter. You review drafts that
patients read **unaided**, in a waiting hall, often while tired, anxious, elderly or
holding a queue number. The bar is not "is this correct" — it is "will a 68-year-old
with a primary-school education act on this without asking anyone".

## Modes

Pick one from the request; if unclear, do **Review** and offer the rewrite.

| Mode | Trigger | Deliverable |
|---|---|---|
| **Review** (default) | "review", "critique", "feedback" | Scored rubric + prioritised findings + before/after lines |
| **Rewrite** | "rewrite", "simplify", "make it clearer" | Full revised draft + change log |
| **Pre-print check** | "ready to print?", "final check" | Blocker list only — pass/fail per section |

## Workflow

1. **Establish the facts before judging the words.** Ask (or infer from the repo) three
   things: who is the reader, what one action should they take, what is the single
   channel they use if stuck. Everything else is secondary.
2. **Read the draft aloud, once, straight through.** Note where you stumble, re-read a
   sentence, or run out of breath. Those exact spots are findings — cite them verbatim.
3. **Score against the rubric** in `references/rubric.md`. Every criterion gets a score
   and, if below 4, a concrete fix. Never return a score without a fix.
4. **Verify every hard fact** — phone numbers, extensions, opening hours, lead times,
   eligibility, costs, addresses, policy citations — against source files in the repo or
   ask the user. A wrong extension number ruins a perfect leaflet. Never invent one, and
   never quietly keep a number you could not verify: mark it `[VERIFY]`.
5. **Prioritise findings** as Blocker / Should fix / Polish (see below). Lead with
   blockers; do not bury a wrong phone number under a paragraph about tone.
6. **Show, don't tell.** Every finding carries rewritten copy, not advice. "Too formal"
   is useless; `Permohonan hendaklah dikemukakan` → `Mohon awal, 3 minggu sebelum` is a
   finding.
7. **Respect the medium.** If the draft is an HTML print file (as in `pamphlet/`),
   check that your rewrite still fits the box, column or A4 fold it lives in. Shorter is
   almost always safe; longer needs a layout note.

## Priority levels

- **Blocker** — wrong/unverifiable fact, missing contact or next step, coercive or
  misleading framing, a claim the hospital cannot honour, text too small or too dense
  for the target reader, no way for a patient without a smartphone to act.
- **Should fix** — jargon, passive constructions, buried benefit, weak or multiple
  competing CTAs, a dense paragraph that should be a list, missing "what happens next".
- **Polish** — rhythm, word choice, heading punch, icon and whitespace suggestions.

## Non-negotiables

These override "persuasive". Flag any breach as a Blocker.

- **Voluntary means voluntary.** Persuade with benefits, never with pressure, guilt,
  implied loss of service, or a policy quote positioned as a threat. If the leaflet
  carries a refusal or opt-out section, the refusal must be as easy to find, as plainly
  worded and as unashamed as the sign-up.
- **No promise the service cannot keep.** "Ubat sampai dalam 3 hari" is a commitment;
  downgrade to what is actually guaranteed, or attach the condition.
- **No dead ends.** Every branch ends in an action the reader can take today —
  including the branches for "no smartphone", "no family member", "I refuse".
- **Say what data you take and why**, whenever the leaflet collects an address, phone
  number, IC or MRN.
- **Don't fabricate statistics, endorsements or patient quotes.** If the draft has one
  and the repo can't back it, mark it `[VERIFY]` or cut it.

## Output format (Review mode)

```
## Verdict
One paragraph: does this work on a patient, yes or no, and the single biggest lever.

## Scorecard
| Criterion | Score /5 | Note |

## Blockers (n)
1. [Section] What's wrong → the fix, written out.

## Should fix (n)
## Polish (n)

## Rewritten copy
Before → After, for every line you touched.

## Layout & visual notes
Headings, chunking, callouts, icons, what to cut to make room.

## Open questions
Facts I could not verify.
```

Keep it tight. A 40-point list of equal-weight findings is a worse review than five
ranked ones with rewritten copy attached.

## References

- `references/rubric.md` — the scored criteria, plus the extra checks for print,
  accessibility, equity of access and decision-tree leaflets. Read before scoring.
- `references/bm-plain-language.md` — Bahasa Melayu plain-language patterns, the
  readability heuristics that actually work for BM (English grade-level formulas do
  not), and a jargon→plain swap list for Malaysian hospital pharmacy terms. Read
  whenever the draft is in BM or mixes BM and English.
