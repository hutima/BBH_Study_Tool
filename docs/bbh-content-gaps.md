# BBH Reference Page — Content Gaps

This is an honest inventory of paradigms and reference material for
`pages/memorization.html`. Most of the original gaps below have since been
closed by `js/data/bbh_reference_extra.js` (42 alphabet/vowel/paradigm
sections, generated from `source/bbh/alphabet.json`,
`source/bbh/vowels.json`, and `source/bbh/parsing/paradigms.json` — see the
"Extended reference" section on the Reference page). Each closed gap below
says exactly where its content now lives. The reference page still quotes
its sources verbatim and never invents, completes, or "fixes" a Hebrew form
that a source doesn't itself print in full — what's left open (bottom of
this file) is content nobody has yet transcribed/verified from the physical
textbook.

For each entry: what was missing, why, and (for closed ones) where it now
lives; (for open ones) exactly what would need to be checked against the
textbook (Cook & Holmstedt, *Beginning Biblical Hebrew: A Grammar and
Illustrated Reader*, Baker Academic) to fill it in.

## Closed gaps

### 1. Full alphabet chart with letter names — CLOSED

Now on the Reference page's Extended reference → **Alphabet** group
(`alphabet-chart` section, 23 rows: letter, final form, Hebrew/English name,
sound, begadkefat/guttural flags) and in the Lesson 0 · Alphabet practice
deck (`js/ui/alphabet.js` / `js/data/bbh_alphabet.js`), both sourced from
`source/bbh/alphabet.json` (Lesson 1, pp. 22–23).

### 2. Vowel-sign chart as a table — CLOSED

Now on the Reference page's Extended reference → **Vowels** group
(`vowel-chart` section, 12 rows: sign, Hebrew/English name, sound class,
length, sound, mater) plus 4 sheva-rule footnotes, sourced from
`source/bbh/vowels.json` (Lessons 2–3, pp. 26, 29).

### 3. Full Qal Imperfect conjugation of a strong verb — CLOSED

Now on the Reference page's Extended reference → **Verbs** group
(`verb-qal-imperfect` section, שמר, 8 rows) plus the related
`verb-qal-perfect`, `verb-qal-participle`, `verb-qal-imperative`,
`verb-qal-jussive`, `verb-qal-infinitive`, and
`verb-qal-adverbial-infinitive` sections, sourced from
`source/bbh/parsing/paradigms.json` (Lessons 16–42).

### 4. Full Qal Perfect plural forms — CLOSED

Now part of the `verb-qal-perfect` section (Extended reference → Verbs),
which prints the full singular + plural Qal Perfect of שמר (and the parallel
`verb-haya-perfect` section for the irregular הָיָה).

### 5. Binyan paradigm tables (Piel/Hifil, Nifal/Hitpael) — CLOSED (as
recognition-form tables, not full conjugations)

The Reference page's Extended reference → Verbs group has
`verb-piel-recognition`, `verb-hifil-recognition`, `verb-nifal-recognition`,
and `verb-hitpael-recognition` sections (Perfect/Imperfect/Imperative
recognition forms per binyan, as the textbook itself prints them — recognition
traits, not full paradigm tables, because that is what Lessons 29/37 print).
The two forms Pual is attested with anywhere in the book are in the
appendix-only `verb-pual-appendix` section. Parsing mode's domain data
(`source/bbh/parsing/paradigms.json`) also drives drillable recognition of
all seven binyanim. A **full conjugated paradigm table** per derived binyan
(every PGN cell filled in) is not printed anywhere in the source and remains
unverified — see "Still open" below if that's ever wanted.

### 6. Construct-form (סְמִיכוּת) tables — CLOSED

Now on the Reference page's Extended reference → **Nouns** group
(`noun-bound-construct` section: absolute vs. construct by gender/number,
Lesson 20, p. 64), plus the irregular-noun construct forms in
`noun-irregular`, `noun-irregular-bayit`, `noun-irregular-ir`,
`noun-irregular-yom`, and the segolate paradigm in `noun-segolate`.

### 7. Attached-pronoun suffix paradigms (on nouns and prepositions) — CLOSED

Noun-host suffix sets are in `noun-attached-sg` / `noun-attached-pl`
(Extended reference → Nouns, Lessons 22/31). The preposition-host suffix
sets (אֶל, עַל, עַד, תַּחַת, כְּמוֹ/כְּ, מִן, the direct object marker
אֵת/אוֹת, and לְ of possession) are in the `particle-prep-attached-*`,
`particle-object-marker`, and `particle-l-possession` sections — the
preposition ones are appendix-only (Appendix B), so they render collapsed
inside the Reference page's "Appendix forms" group; לְ of possession is a
main-lesson item (Lessons 9/17) and renders in the open Pronouns group.

### 8. Numerals table — CLOSED

Now on the Reference page's Extended reference → **Numerals** group:
`numeral-cardinal-1-10`, `numeral-ordinal-1-10`, `numeral-11-19`,
`numeral-tens`, and `numeral-hundreds` sections, sourced from
`source/bbh/parsing/paradigms.json` (Lessons 29/45).

## Still open

- **Full conjugated paradigm tables for the derived binyanim** (every
  PGN cell of Piel/Pual/Hifil/Hofal/Nifal/Hitpael filled in, not just the
  recognition-form set the textbook itself prints) — would need
  verification against a fuller paradigm appendix than the book provides;
  not attempted, see gap 5 above.
- **Weak-verb (final-guttural, hollow, etc.) conjugation tables** — the
  textbook's own guttural/weak-root notes are woven through individual
  lessons rather than collected into paradigm tables; nothing here has been
  transcribed or verified yet. This is also listed as deferred drill content
  in `CLAUDE.md`.
- **Anything else not yet cross-checked against the physical textbook.** The
  content that *is* on the Reference page (both the original paradigm
  section and the 42 Extended reference sections) has been transcribed from
  `source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md`,
  `source/bbh/alphabet.json`, `source/bbh/vowels.json`, and
  `source/bbh/parsing/paradigms.json` — treat any paradigm not present in
  one of those source files as unverified until someone checks it against
  the book and adds it there (never by hand-editing the generated
  `js/data/*.js` files — see the data-regeneration rule in `CLAUDE.md`).
