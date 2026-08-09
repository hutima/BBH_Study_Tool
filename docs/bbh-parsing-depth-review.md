# Parsing depth review: Hebrew module vs. the Greek original (`ad1547e`)

Reviewer: Fable (orchestrator), post-Phase-2, per user request. Evidence:
the Phase-0 behavioral inventory of `ad1547e`, the shipped Phase-2 modules
(`js/domain/parsing/*`, `js/ui/parsing.js`), and the verified inventory
(`source/bbh/parsing/paradigms.json`).

## 1. Feature-by-feature comparison

| Capability | Greek (`ad1547e`) | Hebrew (shipped) | Verdict |
|---|---|---|---|
| Dimension walk | one question per dimension, choices | same, gated pools | parity |
| Answer entry | ALSO free-form English text, regex-parsed (`parseAnswerDimensions`) | buttons only | **gap (deliberate)** — see §2.1 |
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

### 2.1 Free-form answer entry — recommend NOT restoring
The Greek regex parser graded typed English parses ("aor act ind 3 sg").
It was ~400 lines of fragile English-synonym regexes and a major source of
false negatives. The button walk grades the same knowledge with zero parse
ambiguity, and works far better on mobile (the user's priority). Decision:
keep buttons; note for a future desktop power-mode only.

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
