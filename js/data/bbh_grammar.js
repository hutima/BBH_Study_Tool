// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_grammar_data.mjs
// (source: source/bbh/grammar/questions.json)
//
// Phase 2 PR C lesson-gated Grammar Quiz question bank. Self-registers on
// window.BBH_GRAMMAR as a CLASSIC (non-module) script — same idiom as
// js/data/bbh_vocab.js registering window.SETS and js/data/bbh_parsing.js
// registering window.BBH_PARSING — so it can be dropped into index.html's
// plain <script> tags without touching the ES-module import graph. NOT YET
// wired into index.html or sw.js precache as of PR C — that lands with the
// Grammar Quiz UI in a later PR; this file existing unused on disk (and
// possibly with an empty questions array, before the bank is populated) is
// expected at this stage.
//
// Shape: { schemaVersion, questions: [...] }. Every question carries every
// field from source/bbh/grammar/questions.json unchanged — see that file's
// header notes / docs/bbh-conversion-plan.md "Phase 2 architecture
// decisions" for the question-object schema. Questions are sorted by
// (introducedLesson, id).
//
// Never edit this file by hand — re-run the generator instead. Never edit
// source/bbh/grammar/questions.json from here or anywhere else.
(function () {
  window.BBH_GRAMMAR = {
    "schemaVersion": 1,
    "questions": []
  };
})();
