#!/usr/bin/env node
// Validator for the BBH Phase 2 parsing source files:
// source/bbh/parsing/paradigms.json and source/bbh/parsing/lesson_gates.json.
// These are hand-maintained authoritative sources (never generated) — see
// tools/gen_bbh_parsing_data.mjs (Phase 2 PR B) for the generator that will
// consume them. This file mirrors the style of tools/validate_bbh_data.mjs.
//
// Enforces the schema + Hebrew-axis whitelist described in
// docs/bbh-conversion-plan.md "Phase 2 architecture decisions" (no
// tense/voice/mood/case; acceptedParses is always a non-empty array; every
// form carries exactly one of introducedLesson or appendixOnly:true).
// Designed to pass on the empty `paradigms: []` / `lessons: []` skeletons
// that ship before PR B lands real content, and to keep validating once
// they are populated.
//
// Exits nonzero (via process.exitCode) with a category-tagged message per
// violation found. Collects all violations across a run rather than
// stopping at the first, so a single invocation surfaces as much as
// possible. The introducedLesson/lesson_gates cross-check is reported
// separately as non-fatal — it does NOT affect the exit code.
//
// Usage: node tools/validate_bbh_parsing_data.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PARADIGMS_PATH = path.join(ROOT, 'source/bbh/parsing/paradigms.json');
const LESSON_GATES_PATH = path.join(ROOT, 'source/bbh/parsing/lesson_gates.json');

const TOTAL_LESSONS = 50;
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;
const HEBREW_RE = /[\u0590-\u05FF]/;
const APPENDIX_PAGE_RE = /^a-\d+$/;

const PARADIGM_CATEGORIES = new Set(['verb', 'noun', 'adjective', 'pronoun', 'particle', 'numeral']);
const FORM_POS = PARADIGM_CATEGORIES; // pos mirrors the same category set

const PERSON_VALUES = new Set(['1', '2', '3']);
const GENDER_VALUES = new Set(['masculine', 'feminine', 'common']);
const NUMBER_VALUES = new Set(['singular', 'plural', 'dual']);
const STATE_VALUES = new Set(['absolute', 'construct']);
const DEIXIS_VALUES = new Set(['near', 'far']);
const BINYAN_VALUES = new Set(['qal', 'nifal', 'piel', 'pual', 'hitpael', 'hifil', 'hofal']);
const CONJUGATION_VALUES = new Set([
  'perfect', 'imperfect', 'past-narrative', 'imperative', 'jussive',
  'infinitive', 'adverbial-infinitive', 'participle'
]);

// Parse-feature whitelist per pos (Phase 2 architecture decision 1: Hebrew
// axes only, no tense/voice/mood/case). `particle` is deliberately empty —
// a particle's acceptedParses entries must be bare `{}` objects.
const FEATURES_BY_POS = {
  verb: new Set(['binyan', 'conjugation', 'person', 'gender', 'number', 'suffix']),
  noun: new Set(['gender', 'number', 'state', 'suffix', 'definite']),
  adjective: new Set(['gender', 'number', 'state']),
  pronoun: new Set(['person', 'gender', 'number', 'deixis']),
  particle: new Set([]),
  numeral: new Set(['gender', 'number', 'state'])
};

// Hard-forbidden regardless of pos: Greek axes have no place in a Hebrew
// parse. Checked before (and independent of) the per-pos whitelist so a
// bad pos value can't accidentally let one of these slip through.
const FORBIDDEN_AXES = new Set(['tense', 'voice', 'mood', 'case']);

const failures = [];
const nonFatal = [];
function fail(category, message) {
  failures.push(`[${category}] ${message}`);
}
function note(message) {
  nonFatal.push(message);
}

function readJson(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    fail('parse', `${filePath} is not valid JSON: ${err.message}`);
    return null;
  }
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function validateSuffix(suffix, label) {
  if (suffix === null) return;
  if (!isPlainObject(suffix)) {
    fail('parse-suffix', `${label}.suffix must be null or an object, got ${JSON.stringify(suffix)}`);
    return;
  }
  const allowed = new Set(['person', 'gender', 'number']);
  for (const key of Object.keys(suffix)) {
    if (!allowed.has(key)) fail('parse-suffix', `${label}.suffix has unknown key "${key}"`);
  }
  if (!PERSON_VALUES.has(suffix.person)) {
    fail('parse-suffix', `${label}.suffix.person "${suffix.person}" not in {1,2,3}`);
  }
  if (!GENDER_VALUES.has(suffix.gender)) {
    fail('parse-suffix', `${label}.suffix.gender "${suffix.gender}" not in {masculine,feminine,common}`);
  }
  if (!NUMBER_VALUES.has(suffix.number)) {
    fail('parse-suffix', `${label}.suffix.number "${suffix.number}" not in {singular,plural,dual}`);
  }
}

function validateParse(parse, pos, formLabel, idx) {
  const label = `${formLabel}.acceptedParses[${idx}]`;
  if (!isPlainObject(parse)) {
    fail('parse-shape', `${label} is not an object`);
    return;
  }
  const keys = Object.keys(parse);
  for (const key of keys) {
    if (FORBIDDEN_AXES.has(key)) {
      fail('forbidden-axis', `${label} contains forbidden Greek-axis key "${key}" (Hebrew axes only)`);
    }
  }
  const allowed = FEATURES_BY_POS[pos];
  if (allowed) {
    for (const key of keys) {
      if (FORBIDDEN_AXES.has(key)) continue; // already reported above
      if (!allowed.has(key)) fail('parse-unknown-key', `${label} has unknown key "${key}" for pos "${pos}"`);
    }
  }
  if ('binyan' in parse && !BINYAN_VALUES.has(parse.binyan)) {
    fail('parse-value', `${label}.binyan "${parse.binyan}" not in whitelist`);
  }
  if ('conjugation' in parse && !CONJUGATION_VALUES.has(parse.conjugation)) {
    fail('parse-value', `${label}.conjugation "${parse.conjugation}" not in whitelist`);
  }
  if ('person' in parse && !PERSON_VALUES.has(parse.person)) {
    fail('parse-value', `${label}.person "${parse.person}" not in {1,2,3}`);
  }
  if ('gender' in parse && !GENDER_VALUES.has(parse.gender)) {
    fail('parse-value', `${label}.gender "${parse.gender}" not in {masculine,feminine,common}`);
  }
  if ('number' in parse && !NUMBER_VALUES.has(parse.number)) {
    fail('parse-value', `${label}.number "${parse.number}" not in {singular,plural,dual}`);
  }
  if ('state' in parse && !STATE_VALUES.has(parse.state)) {
    fail('parse-value', `${label}.state "${parse.state}" not in {absolute,construct}`);
  }
  if ('deixis' in parse && !DEIXIS_VALUES.has(parse.deixis)) {
    fail('parse-value', `${label}.deixis "${parse.deixis}" not in {near,far}`);
  }
  if ('definite' in parse && typeof parse.definite !== 'boolean') {
    fail('parse-value', `${label}.definite must be a boolean, got ${JSON.stringify(parse.definite)}`);
  }
  if ('suffix' in parse) validateSuffix(parse.suffix, label);
}

function validateSource(source, label) {
  if (!isPlainObject(source)) {
    fail('source-shape', `${label}.source is not an object`);
    return;
  }
  const hasLesson = 'lesson' in source;
  const hasAppendix = 'appendix' in source;
  if (hasLesson === hasAppendix) {
    fail('source-shape', `${label}.source must have exactly one of {lesson,page} or {appendix,page}`);
    return;
  }
  if (hasLesson) {
    if (!Number.isInteger(source.lesson) || source.lesson < 1 || source.lesson > TOTAL_LESSONS) {
      fail('source-shape', `${label}.source.lesson "${source.lesson}" not an integer in 1..${TOTAL_LESSONS}`);
    }
    if (!Number.isInteger(source.page)) {
      fail('source-shape', `${label}.source.page must be an integer for a lesson source, got ${JSON.stringify(source.page)}`);
    }
  } else {
    if (!['A', 'B', 'C'].includes(source.appendix)) {
      fail('source-shape', `${label}.source.appendix "${source.appendix}" not one of A/B/C`);
    }
    if (typeof source.page !== 'string' || !APPENDIX_PAGE_RE.test(source.page)) {
      fail('source-shape', `${label}.source.page "${source.page}" does not match ^a-\\d+$`);
    }
  }
}

function validateParadigms(doc) {
  const paradigmIds = new Set();
  const formsById = new Map(); // formId -> {form, paradigmId}

  if (doc.schemaVersion !== 1) {
    fail('schema-version', `paradigms.json schemaVersion is ${JSON.stringify(doc.schemaVersion)}, expected 1`);
  }
  if (!Array.isArray(doc.paradigms)) {
    fail('shape', 'paradigms.json: "paradigms" is not an array');
    return { paradigmIds, formsById, paradigmCount: 0 };
  }

  for (const paradigm of doc.paradigms) {
    const pid = paradigm && paradigm.id;
    if (typeof pid !== 'string' || !ID_RE.test(pid)) {
      fail('paradigm-id', `paradigm id "${pid}" does not match ^[a-z0-9][a-z0-9-]*$`);
    } else if (paradigmIds.has(pid)) {
      fail('paradigm-id', `duplicate paradigm id "${pid}"`);
    } else {
      paradigmIds.add(pid);
    }
    if (!PARADIGM_CATEGORIES.has(paradigm.category)) {
      fail('paradigm-category', `paradigm "${pid}": category "${paradigm.category}" not in whitelist`);
    }
    if (typeof paradigm.label !== 'string' || paradigm.label.trim() === '') {
      fail('paradigm-label', `paradigm "${pid}": label is empty`);
    }
    if (!Array.isArray(paradigm.forms)) {
      fail('paradigm-shape', `paradigm "${pid}": "forms" is not an array`);
      continue;
    }

    for (const form of paradigm.forms) {
      const fid = form && form.id;
      let idOk = false;
      if (typeof fid !== 'string' || !ID_RE.test(fid)) {
        fail('form-id', `paradigm "${pid}": form id "${fid}" does not match ^[a-z0-9][a-z0-9-]*$`);
      } else if (formsById.has(fid)) {
        fail('form-id', `duplicate form id "${fid}" (paradigm "${pid}")`);
      } else {
        idOk = true;
      }
      const label = idOk ? fid : `paradigm "${pid}" <unidentified form>`;

      if (typeof form.display !== 'string' || form.display.trim() === '') {
        fail('form-display', `${label}: display is empty`);
      } else if (!HEBREW_RE.test(form.display)) {
        fail('form-display', `${label}: display "${form.display}" contains no Hebrew codepoint (U+0590-U+05FF)`);
      }

      if (!FORM_POS.has(form.pos)) {
        fail('form-pos', `${label}: pos "${form.pos}" not in whitelist`);
      }

      const hasLesson = Number.isInteger(form.introducedLesson);
      const hasAppendix = form.appendixOnly === true;
      if (hasLesson && hasAppendix) {
        fail('form-gate', `${label}: has both introducedLesson and appendixOnly:true (exactly one required)`);
      } else if (hasLesson) {
        if (form.introducedLesson < 1 || form.introducedLesson > TOTAL_LESSONS) {
          fail('form-gate', `${label}: introducedLesson ${form.introducedLesson} not in 1..${TOTAL_LESSONS}`);
        }
      } else if (!hasAppendix) {
        fail('form-gate', `${label}: neither a valid introducedLesson (1..${TOTAL_LESSONS}) nor appendixOnly:true is present`);
      }

      validateSource(form.source, label);

      if (!Array.isArray(form.acceptedParses) || form.acceptedParses.length === 0) {
        fail('form-parses', `${label}: acceptedParses must be a non-empty array`);
      } else {
        form.acceptedParses.forEach((parse, idx) => validateParse(parse, form.pos, label, idx));
      }

      if (idOk) formsById.set(fid, { form, paradigmId: pid });
    }
  }

  return { paradigmIds, formsById, paradigmCount: doc.paradigms.length };
}

function validateLessonGates(doc, paradigmIds, paradigmsPopulated) {
  const entries = []; // {lesson, paradigmIds: Set}

  if (doc.schemaVersion !== 1) {
    fail('schema-version', `lesson_gates.json schemaVersion is ${JSON.stringify(doc.schemaVersion)}, expected 1`);
  }
  if (!Array.isArray(doc.lessons)) {
    fail('shape', 'lesson_gates.json: "lessons" is not an array');
    return { entries, lessonCount: 0 };
  }

  let prevLesson = 0;
  const seenLessons = new Set();
  for (const entry of doc.lessons) {
    const lesson = entry && entry.lesson;
    let lessonOk = false;
    if (!Number.isInteger(lesson) || lesson < 1 || lesson > TOTAL_LESSONS) {
      fail('gate-lesson', `lesson_gates entry: lesson "${lesson}" not an integer in 1..${TOTAL_LESSONS}`);
    } else if (seenLessons.has(lesson)) {
      fail('gate-lesson', `lesson_gates: duplicate lesson ${lesson}`);
    } else if (lesson <= prevLesson) {
      fail('gate-lesson-order', `lesson_gates: lesson ${lesson} is not ascending after ${prevLesson}`);
    } else {
      lessonOk = true;
      seenLessons.add(lesson);
      prevLesson = lesson;
    }

    if (!Array.isArray(entry.introduces)) {
      fail('gate-shape', `lesson_gates entry (lesson ${lesson}): "introduces" is not an array`);
      continue;
    }

    const pidsThisLesson = new Set();
    entry.introduces.forEach((item, idx) => {
      const ctx = `lesson_gates[lesson=${lesson}].introduces[${idx}]`;
      if (typeof item.summary !== 'string' || item.summary.trim() === '') {
        fail('gate-summary', `${ctx}: summary is empty`);
      }
      if (!Array.isArray(item.paradigmIds)) {
        fail('gate-paradigm-ids', `${ctx}: paradigmIds is not an array`);
      } else {
        for (const paradigmId of item.paradigmIds) {
          if (typeof paradigmId !== 'string') {
            fail('gate-paradigm-ids', `${ctx}: paradigmId ${JSON.stringify(paradigmId)} is not a string`);
            continue;
          }
          pidsThisLesson.add(paradigmId);
          if (paradigmsPopulated && !paradigmIds.has(paradigmId)) {
            fail('gate-paradigm-ref', `${ctx}: paradigmId "${paradigmId}" not found in paradigms.json`);
          }
        }
      }
      validateSource(item.source, ctx);
    });

    if (lessonOk) entries.push({ lesson, paradigmIds: pidsThisLesson });
  }

  return { entries, lessonCount: doc.lessons.length };
}

function crossCheckIntroducedLesson(formsById, gateEntries) {
  // Earliest lesson_gates lesson that lists each paradigm id.
  const earliestLessonForParadigm = new Map();
  for (const { lesson, paradigmIds } of gateEntries) {
    for (const pid of paradigmIds) {
      const prev = earliestLessonForParadigm.get(pid);
      if (prev === undefined || lesson < prev) earliestLessonForParadigm.set(pid, lesson);
    }
  }

  for (const [formId, { form, paradigmId }] of formsById) {
    if (!Number.isInteger(form.introducedLesson)) continue;
    const earliest = earliestLessonForParadigm.get(paradigmId);
    if (earliest !== undefined && form.introducedLesson < earliest) {
      note(
        `cross-check: form "${formId}" (paradigm "${paradigmId}") has introducedLesson=${form.introducedLesson}, ` +
        `earlier than lesson_gates' earliest listing of that paradigm (lesson ${earliest})`
      );
    }
  }
}

function main() {
  const paradigmsDoc = readJson(PARADIGMS_PATH);
  const gatesDoc = readJson(LESSON_GATES_PATH);

  if (!paradigmsDoc || !gatesDoc) {
    console.error(`FAIL — ${failures.length} issue(s):\n`);
    for (const f of failures) console.error(`  ${f}`);
    process.exitCode = 1;
    return;
  }

  const { paradigmIds, formsById, paradigmCount } = validateParadigms(paradigmsDoc);
  const paradigmsPopulated = paradigmCount > 0;
  const { entries: gateEntries, lessonCount } = validateLessonGates(gatesDoc, paradigmIds, paradigmsPopulated);

  crossCheckIntroducedLesson(formsById, gateEntries);

  if (nonFatal.length) {
    console.log(`${nonFatal.length} non-fatal cross-check finding(s):`);
    for (const n of nonFatal) console.log(`  ~ ${n}`);
  }

  if (failures.length) {
    console.error(`FAIL — ${failures.length} issue(s):\n`);
    for (const f of failures) console.error(`  ${f}`);
    process.exitCode = 1;
  } else {
    console.log(
      `OK — parsing data checks passed (${paradigmCount} paradigm(s), ` +
      `${formsById.size} form(s), ${lessonCount} lesson_gates entry(ies)).`
    );
  }
}

main();
