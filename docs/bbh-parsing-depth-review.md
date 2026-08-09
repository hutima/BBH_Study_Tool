# Parsing depth review: Hebrew module vs. the Greek original (`ad1547e`)

Reviewer: Fable (orchestrator), post-Phase-2, per user request. Evidence:
the Phase-0 behavioral inventory of `ad1547e`, the shipped Phase-2 modules
(`js/domain/parsing/*`, `js/ui/parsing.js`), and the verified inventory
(`source/bbh/parsing/paradigms.json`).

## 1. Feature-by-feature comparison

| Capability | Greek (`ad1547e`) | Hebrew (shipped) | Verdict |
|---|---|---|---|
| Dimension walk | one question per dimension, choices | same, gated pools | parity |
| Answer normalization | canonical answer strings regex-parsed into dims (`parseAnswerDimensions` — CORRECTION: parsed the card's own data, never user input) | structured `acceptedParses`, no normalizer needed | **Hebrew richer** |
| Per-dimension-VALUE pool filters | `dimValueFilters` scoping the pool (e.g. aorist-only) | grading toggles only — **regression**, closed by §2.4 | **gap** |
| Reverse drill | lookup walk picking a form from parse | Build the Form + all-that-apply + 6 choices | **Hebrew richer** |
| Ambiguity | syncretism special-cases hard-coded | `acceptedParses` arrays, data-driven | **Hebrew richer** |
| Known rule | 2/2 recent window | same, toggle-safe recompute | parity |
| Pool scoping | focused / shuffle / custom / exclude-known / chapter gate | same + appendix toggle + Mixed direction | parity+ |
| Post-answer teaching | mistake notes, aspect hints (Greek-bound) | source ref, recognition note, ambiguity note, contrast panel | parity (different, sourced) |
| Analytics | accuracy trend, per-paradigm, per-dimension, form status | same set | parity |
| Cross-lesson same-lexeme practice | none (paradigms were lemma-siloed) | none yet | **both lack — §2.2 closes it** |
| Pedagogical redirects (`PARSING_INCOMPATIBLE_LEMMAS`) | stem-recall redirects for odd lemmas | not needed (inventory is curated) | n/a |

Net: the Hebrew module meets or exceeds the Greek one everywhere except
free-form answer entry; its data model (acceptedParses, per-form gates,
provenance) is categorically stronger than the Greek regex approach.

## 2. Gaps worth closing

### 2.1 (withdrawn after independent critique)
The original §2.1 argued against restoring "free-form typed answers" — a
feature the Greek app never actually had (its regex parser normalized the
card's own canonical answer string, not user input). Row corrected above;
no decision needed.

### 2.2 Root journeys — recommended, data is ready
8 roots already span 2+ paradigms; שמר spans 11 paradigms / L16→L42
(perfect → imperfect → infinitives → past narrative → nifal recognition →
imperative/jussive → verb+suffix → participles), קבץ spans the Piel/Hitpael
system, מלך the Hifil system, היה the irregular line, כבד the stative line.
Design ("Root journey" practice scope):
- New scope alongside Focused/Shuffle/Custom: **Root** with a root picker
  (only roots having ≥2 in-gate paradigms are listed, with "n forms · Lm–Ln"
  captions).
- Pool = all in-gate forms sharing the root; ordering = journey order
  (introducedLesson ascending, then canonical conjugation order) instead of
  the usual unseen-first ordering, so the learner walks the root through
  the verbal system; exclude-known still applies.
- Summary gains a one-line journey map: the root's conjugation stations
  with the current form's station highlighted and locked stations (beyond
  the lesson gate) shown dimmed — makes gate progression visible.
- Domain change: `buildDrillPool` accepts `rootFilter` (additive optional
  param); `orderDrillPool` accepts an optional `mode: 'journey'`.

### 2.3 Mobile information architecture — recommended
Current panel = one long stack of controls; on a phone it scrolls several
screens before the card. Redesign (regroup + collapse, no rewrite):
1. **Primary bar** (always visible, one row, wraps to two on narrow):
   lesson select · scope segmented control (Focused ▾ | Root ▾ | Shuffle |
   Custom ▾ — the ▾ items open their picker as a bottom-sheet-style
   overlay on small screens, inline dropdown on wide) · direction
   segmented (Parse | Build | Mixed).
2. **"More options" `<details>`** (collapsed by default on all sizes):
   exclude-known, appendix forms, dimension toggles, reset/clear actions.
3. Touch targets ≥44px; choice buttons grid-wrap with larger tap areas;
   the step-walk choice grid becomes the visual anchor directly under the
   Hebrew form.
4. Persisted collapse state in `runtime.parsing.optionsOpen` (bool).
No behavior changes — same handlers, regrouped markup + CSS.

## 3. Out of scope (unchanged deferrals)
Weak-verb conjugation drills (appendix-only display stands), syntax/
discourse drills, free-form entry (2.1).

## 4. Implementation plan (PR G)
1. domain: `rootFilter` + journey ordering (+ tests: root pool gating,
   journey order stability, exclude-known interaction).
2. UI: scope segmented control + root picker + journey map line; options
   regroup per §2.3; CSS for mobile breakpoints.
3. Cache bump `?v=7`; smoke additions (root scope end-to-end at two gates;
   mobile-viewport render assertions; options collapse persistence).

## 5. Amendments from the independent Opus critique (adopted in full)

1. **Root scope honesty:** only 123/429 forms carry roots (all verbs); 6
   qualifying roots with appendix off; zero before L23. Root scope renders
   disabled below its first material ("unlocks at Lesson 23"), labeled
   "Root journey (verbs)". Recognition-family paradigms are INCLUDED
   (they carry full acceptedParses; excluding them would delete 3 of 6
   roots).
2. **Journey mechanics:** deterministic order = (introducedLesson asc,
   paradigm index asc, form index asc) — no PRNG in journey mode. New
   cursor `runtime.parsing.journeyIndex` advances on Next, resets on
   root/lesson change; journey IGNORES exclude-known for membership and
   instead starts at the first not-known station. A separate "Drill this
   root" action gives weakest-first within the root (existing ordering +
   rootFilter).
3. **`rootFilter` is its own first branch** in buildDrillPool (full
   cumulative gated pool, then root filter; mutually exclusive with
   focus/custom/shuffle). Optional params extend EXISTING exports only.
4. **New "By feature" scope** (`dimValueFilter`, e.g. all imperatives /
   all Piel forms / all construct nouns) — restores the Greek
   `dimValueFilters` capability, works for the 306 root-less forms and
   for lessons 1-22 where Root is empty. Values sourced from
   `availableDimensionValues` over the gated pool only.
5. **Mobile prerequisite:** split `render()` so answer-path handlers
   re-render only the drill area; the options panel re-renders only from
   scope/option handlers. `<details>` open state written via ontoggle
   without re-render (also fixes the custom-group collapse discard).
   Bottom sheet CUT — inline native `<select>` pickers appear under the
   scope control when their mode is active; scope control reuses
   `.theme-switcher` styling.
6. **State:** keep `shuffleAll`/`customSetOn` booleans as stored truth
   (derive the control's mode); add `rootFilter: null`,
   `dimValueFilter: null`, `journeyIndex: 0`, `optionsOpen: false` in ALL
   THREE sync points (runtime.js default, sanitizeParsingState with
   clamping, main.js mixed-version guard); clear rootFilter at render
   when <2 in-gate paradigms qualify; PROGRESS_EXPORT_VERSION stays 6
   (additive keys + defaulting sanitizer — do not bump reflexively).
