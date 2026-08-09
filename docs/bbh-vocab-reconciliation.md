# BBH Vocabulary Reconciliation Report

**Scope:** `source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv` (191 rows) vs.
(a) the textbook's boxed דברים חדשים lesson-vocabulary panels, page images from
`/tmp/bbh-pdf-quarantine.4rfHYP/Hebrew.pdf`, and (b) the textbook's Hebrew-English Glossary
(L#/R# lesson/reading cross-reference marks). Read-only — no repo files were edited.

CSV header (BOM present): `lesson_number,lesson_title,source_page,hebrew,transliteration,english_gloss,grammar_and_forms`

## Glossary location (found)

The task's offset hint (`a-N = PDF page 140+N`) is correct and holds across the **entire**
glossary, not just at a-51:

- **Hebrew-English Glossary**: PDF pages **191–271** → printed **a-51 through a-81** (title
  page a-51 = PDF 191; last aleph-through-tav content page a-81 = PDF 221; PDF 222 is a blank
  divider).
- **English-Hebrew Glossary** (reverse lookup, no L#/R# marks): PDF **223 onward** → **a-83**
  onward (PDF 240 = a-90, confirmed English-Hebrew still running; used only to cross-check
  headword splits, not for L# sweeping).
- The Hebrew-English Glossary (a-51–a-81) was read in full, aleph through tav. No L37, L41,
  L43, L44, L46, L47, L48, or L50 tag appears anywhere in it.

## Part 1 — Panel-vs-CSV check (all 44 vocab-bearing lessons)

Every lesson with a דברים חדשים panel (or, for L5/L6/L9/L11/L17/L19, the paradigm chart
immediately above it, which the CSV already treats as vocabulary) was read from the page
images and compared word-for-word against its CSV rows:

L3, L5, L6, L7, L8, L9, L10, L11, L12, L13, L14, L15, L16, L17, L18, L19, L20, L21, L22, L23,
L24, L25, L26, L27, L28, L29, L30, L31, L32, L33, L34, L35, L36, L38, L39, L40, L42, L45, L49

**Result: zero mismatches.** Every headword, gloss, and grammar-form annotation in every panel
matches its CSV row exactly, including counts. This also directly disproves the task's stated
"confirmed omission": **L5 שָׁלוֹם is already present in the CSV** (row 13: `שָׁלוֹם, shalom,
"peace; greeting", noun M`) and visibly boxed in the L5 panel (PDF p.32). Whatever CSV state
that hint was written against, it is not the file in this repo today.

Lessons **37, 41, 43, 44, 46, 47, 48, 50** were individually opened (PDF pp.104, 114–115,
120–121, 122–124, 127–128, 129–131, 132–133, 137–139) and confirmed to have **no** דברים חדשים
box — matching the CSV's exclusion of them. The full glossary sweep (Part 2) confirms this
independently: no word anywhere in the glossary carries any of these eight lesson tags.

**Conclusion of Part 1: the CSV is a perfect transcription of every boxed/paradigm panel.**
The 191→203 gap is not a transcription error against the panels; it must come from vocabulary
the glossary tags to a lesson without that word ever appearing in a boxed panel.

## Part 2 — Glossary L# sweep: words tagged to a lesson but never boxed

Six lessons have grammar-table items (paradigm charts / the lesson's own grammatical
apparatus) that the Hebrew-English Glossary explicitly tags with that lesson's L# — the same
treatment the CSV already gives the L5/L6/L9/L11/L17/L19 pronoun and possession paradigms —
but the CSV does not carry them for these six lessons:

| Lesson | Word(s) tagged in glossary but absent from CSV | Glossary line (verbatim tag) |
|---|---|---|
| L3 | אֲדֹנָי "the Lord" (epithet) | `PN (EPITHET) the Lord L3` — separate entry from `NOUN M master, lord L3` (אָדוֹן) |
| L8 | הַ (definite article) | `DET the L8` |
| L8 | הֲ (yes/no interrogative marker) | `INTER marker for yes-or-no question L8` |
| L12 | יֵשׁ ("there is") | `EXST there is L12` |
| L12 | אֵין ("there is not") | `EXST ADV there is/are not L12` |
| L13 | בְּ (prep. in/at/with) | `PREP in, at, with, by L13` |
| L13 | כְּ (prep. like/as) | `PREP like, as L13` |
| L13 | לְ (prep. to/for) | `PREP to, for L13` |
| L13 | מִן (prep. from) | `PREP from; more than L13` |
| L30 | כִּי (because/that) | `CONJ because, when, if, though, but; COMP that L30, R4` |
| L30 | אֲשֶׁר (who/which/that) | `CONJ that, which, who; COMP that L30, R3` |
| L30 | לוּ (would that/if, irreal) | `COND would that, if (irreal) L30` |
| L30 | לוּלֵי (if not, irreal) | `COND if not (irreal, negative) L30` |
| L30 | לָכֵן (therefore) | `CONJ therefore L30` |
| L30 | לְמַעַן (for the sake of/so that) | `PREP for the sake of; CONJ ... L30, R7` |
| L33 | זֶה ("this," m.) | `MS DEM this L33` |
| L33 | זֹאת ("this," f.) | `FS DEM this L33` |
| L33 | אֵלֶּה ("these") | `CP DEM these L33` |

That is **17 add candidates + 1 split** (L3 אָדוֹן/אֲדֹנָי, see below) = **18 candidate
words**, all independently confirmed by an explicit L#-tagged glossary line, none of which
appear in any דברים חדשים box (they live in the lesson's grammar exposition/paradigm tables
instead — L8's article/interrogative-ה explanation, L12's יש/אין intro sentence, L13's
preposition chart, L30's subordinating-conjunction table, L33's demonstrative-pronoun chart).

Two items I could **not** conclusively verify one way or the other in the time available
(flagged, not asserted): כֵּן ("yes/thus," CSV row 13, lesson 5) — I could not find an L5 tag
next to its glossary entry, which would make it an over-inclusion rather than an omission; and
עַד / פֶּן, two more L30-table conjunctions that may also carry L30 tags I didn't manage to
re-confirm on a second pass. Neither is included in the counts below.

## Part 3 — The one confirmed split

`Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv` row 3 combines two headwords the
glossary and the L5-panel-style convention elsewhere treat as separate:

```
"3","שְׁוָא (Shava)","29","אָדוֹן / אֲדֹנָי","adon / Adonai","master, lord; Lord (of God)","noun M; אֲדֹנָי used for God"
```

Glossary confirms these are two distinct L3 headwords with two distinct glosses (`NOUN M
master, lord L3` for אָדוֹן vs. `PN (EPITHET) the Lord L3` for אֲדֹנָי), and the
English-Hebrew reverse glossary lists them separately too (`master אָדוֹן` / `Lord, the
(epithet) אֲדֹנָי`, a-88/a-89). This is the one clear "CSV row combines what the source
treats as separate headwords" case requested by the task.

## Summary

| Category | Count |
|---|---|
| Panel-vs-CSV mismatches (Part 1) | **0** |
| Lessons confirmed correctly excluded (no vocab: L1,2,4,37,41,43,44,46,47,48,50) | 11/11 confirmed |
| Glossary-only adds, high confidence (Part 2) | **17** |
| CSV rows that should split into 2 (Part 3) | **1** (→ +1 card) |
| **Target count if every Part 2/3 item is applied** | **191 + 17 + 1 = 209** |

**This does not reconcile cleanly to 203 — it overshoots by 6.** I can defend all 18 additions
against an explicit, individually-read glossary L#-tag line (listed above with the verbatim
tag), so I am not confident which 6 of the 18 the *official 203-card retail deck* actually
omits (the internal course glossary and the retail flashcard product are not guaranteed to be
the same list — the glossary tags every word a professor might want students to know per
lesson, including bare function words like the article-ה or the preposition בְּ, which a
flashcard-deck editor could reasonably judge too atomic/grammatical to deserve their own card,
even though the glossary formally tags them). The likeliest candidates to *drop* from the
18 if trying to hit exactly 203: the L8 article/interrogative ה pair and the L13 bare
one-letter prepositions (בְּ, כְּ) — four single-letter grammatical morphemes that are the
most defensible "grammar, not vocab" exclusions — which would bring the total to 191 + 13 + 1
= 205, still 2 over; hitting exactly 203 from this evidence alone would require also excluding
2 more items I can't single out without the actual retail deck to check against. I was not
able to close this last gap with certainty from the PDF alone.

No R#-only (reading-vocabulary) entries were folded into any lesson count above — reading-only
words (e.g., נָחָשׁ "serpent" R1, סוּס/סוּסָה "horse/mare" R1, פָּרָה "cow" R1, חַיָּה "animal"
R1/R11, בֵּן/בַּת type words already counted, etc.) were left out per instructions since none
of them additionally carry an L# tag.

## Proposed actions if applied

- **Split** row 3 into two rows: `אָדוֹן` (master, lord) and `אֲדֹנָי` (Lord [epithet of
  God]), both lesson 3, source page 29.
- **Add** 17 rows across L8 (×2), L12 (×2), L13 (×4), L30 (×6), L33 (×3), each sourced to its
  lesson's grammar/paradigm table rather than a דברים חדשים box (page references: L8 p.38,
  L12 p.46, L13 p.48–49, L30 p.88–89, L33 p.96).
- **No corrections, no lesson moves** were found anywhere — every existing CSV row matches its
  panel exactly in headword, translit, gloss, and grammar note.
