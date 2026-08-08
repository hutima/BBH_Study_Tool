// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_parsing_data.mjs
// (source: source/bbh/parsing/paradigms.json, source/bbh/parsing/lesson_gates.json)
//
// Phase 2 PR B lesson-gated Parsing/Build inventory. Self-registers on
// window.BBH_PARSING as a CLASSIC (non-module) script — same idiom as
// js/data/bbh_vocab.js registering window.SETS — so it can be dropped into
// index.html's plain <script> tags without touching the ES-module import
// graph. NOT YET wired into index.html or sw.js precache as of PR B — that
// lands with the Parse/Build UI in a later PR; this file existing unused
// on disk is expected at this stage.
//
// Shape: { schemaVersion, paradigms: [...], lessonGates: [...] }. Every
// form under paradigms[].forms carries every field from
// source/bbh/parsing/paradigms.json unchanged, plus a generated `compare`
// field (the pointed `display` with vowel points/cantillation stripped —
// see js/utils/hebrewText.js#stripHebrewPoints) for point-insensitive
// answer comparison. `lessonGates` mirrors source/bbh/parsing/
// lesson_gates.json's `lessons` array unchanged.
//
// Never edit this file by hand — re-run the generator instead. Never edit
// source/bbh/parsing/*.json from here or anywhere else.
(function () {
  window.BBH_PARSING = {
    "schemaVersion": 1,
    "paradigms": [],
    "lessonGates": []
  };
})();
