// Classic <script> (not a module) — see index.html script order.
//
// This used to carry a large set of Greek part-of-speech / headword-
// formatting heuristics (transliteration, declension detection, multi-case
// preposition tagging, etc.). None of that applies to Hebrew, so this file
// is now a small shim: it keeps only the generic, language-agnostic id
// helper that other modules still call defensively via
// `typeof window.stableCardKey === 'function'`.

function stripDiacritics(text) {
  return (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Stable identifier derived from a headword: strips combining diacritics so
// cosmetic pointing/accent fixes don't orphan progress, while a substantive
// change to the word still produces a new key. The generated BBH vocab
// carries its own explicit `card.id` (see js/data/bbh_vocab.js), so this is
// only a fallback for any card that doesn't.
function stableCardKey(text) {
  return stripDiacritics(text || '')
    .replace(/[\s,·.]+/g, '_')
    .toLowerCase();
}

// Generic legacy-id migration helper: maps each card's older
// `<set>-<slug>` id to its current `<set>-<idx>-<slug>` id. Doesn't assume
// anything language-specific — kept for js/state/migrations.js, which reads
// it defensively and no-ops if it's undefined.
function buildLegacyStableIdMap() {
  const map = new Map();
  Object.keys(window.SETS || {}).forEach(rawKey => {
    const set = window.SETS[rawKey];
    if (!set || !Array.isArray(set.cards)) return;
    set.cards.forEach((card, idx) => {
      const legacyId = `${rawKey}-${stableCardKey(card.g)}`;
      const currentId = `${rawKey}-${idx}-${stableCardKey(card.g)}`;
      const existing = map.get(legacyId) || [];
      existing.push(currentId);
      map.set(legacyId, existing);
    });
  });
  return map;
}

Object.assign(window, {
  stableCardKey,
  buildLegacyStableIdMap
});
