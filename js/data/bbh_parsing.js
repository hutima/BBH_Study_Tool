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
// source/bbh/parsing/paradigms.json unchanged, plus two generated fields:
// `compare` (the pointed `display` with vowel points/cantillation stripped
// — see js/utils/hebrewText.js#stripHebrewPoints) for point-insensitive
// answer comparison, and `translit` (task #17 — a deterministic, rule-
// based romanization of `display`; see romanizeForm() in
// tools/gen_bbh_parsing_data.mjs for the full rule set and its documented
// limitations). `lessonGates` mirrors source/bbh/parsing/
// lesson_gates.json's `lessons` array unchanged.
//
// Never edit this file by hand — re-run the generator instead. Never edit
// source/bbh/parsing/*.json from here or anywhere else.
(function () {
  window.BBH_PARSING = {
    "schemaVersion": 1,
    "paradigms": [
      {
        "id": "pron-subject",
        "category": "pronoun",
        "label": "Independent subject pronouns",
        "introducedLesson": 5,
        "source": {
          "lesson": 5,
          "page": 32
        },
        "forms": [
          {
            "id": "pron-subject-3ms",
            "display": "הוּא",
            "lemma": "הוּא",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 5,
            "acceptedParses": [
              {
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 5,
              "page": 32
            },
            "compare": "הוא",
            "translit": "hu"
          },
          {
            "id": "pron-subject-3fs",
            "display": "הִיא",
            "lemma": "הִיא",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 5,
            "acceptedParses": [
              {
                "person": "3",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 5,
              "page": 32
            },
            "compare": "היא",
            "translit": "hi"
          },
          {
            "id": "pron-subject-2ms",
            "display": "אַתָּה",
            "lemma": "אַתָּה",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 5,
            "acceptedParses": [
              {
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 5,
              "page": 32
            },
            "compare": "אתה",
            "translit": "atta"
          },
          {
            "id": "pron-subject-2fs",
            "display": "אַתְּ",
            "lemma": "אַתְּ",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 5,
            "acceptedParses": [
              {
                "person": "2",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 5,
              "page": 32
            },
            "compare": "את",
            "translit": "at"
          },
          {
            "id": "pron-subject-1cs",
            "display": "אֲנִי",
            "lemma": "אֲנִי",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 5,
            "acceptedParses": [
              {
                "person": "1",
                "gender": "common",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 5,
              "page": 32
            },
            "compare": "אני",
            "translit": "ani"
          },
          {
            "id": "pron-subject-3mp",
            "display": "הֵם",
            "lemma": "הֵם",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 11,
            "acceptedParses": [
              {
                "person": "3",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 11,
              "page": 44
            },
            "compare": "הם",
            "translit": "hem"
          },
          {
            "id": "pron-subject-3fp",
            "display": "הֵן",
            "lemma": "הֵן",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 11,
            "acceptedParses": [
              {
                "person": "3",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 11,
              "page": 44
            },
            "compare": "הן",
            "translit": "hen"
          },
          {
            "id": "pron-subject-2mp",
            "display": "אַתֶּם",
            "lemma": "אַתֶּם",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 11,
            "acceptedParses": [
              {
                "person": "2",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 11,
              "page": 44
            },
            "compare": "אתם",
            "translit": "attem"
          },
          {
            "id": "pron-subject-2fp",
            "display": "אַתֶּן",
            "lemma": "אַתֶּן",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 11,
            "acceptedParses": [
              {
                "person": "2",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 11,
              "page": 44
            },
            "compare": "אתן",
            "translit": "atten"
          },
          {
            "id": "pron-subject-1cp",
            "display": "אֲנַחְנוּ",
            "lemma": "אֲנַחְנוּ",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 11,
            "acceptedParses": [
              {
                "person": "1",
                "gender": "common",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 11,
              "page": 44
            },
            "compare": "אנחנו",
            "translit": "anachnu"
          },
          {
            "id": "pron-subject-1cs-alt",
            "display": "אָנֹכִי",
            "lemma": "אָנֹכִי",
            "root": null,
            "pos": "pronoun",
            "acceptedParses": [
              {
                "person": "1",
                "gender": "common",
                "number": "singular"
              }
            ],
            "note": "alternate 'I'; appendix pairs it with אֲנִי but only אֲנִי appears in the L5 lesson chart",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "introducedLesson": 5,
            "compare": "אנכי",
            "translit": "anokhi"
          },
          {
            "id": "pron-subject-3mp-alt",
            "display": "הֵמָּה",
            "lemma": "הֵמָּה",
            "root": null,
            "pos": "pronoun",
            "acceptedParses": [
              {
                "person": "3",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": "longer alt. 3mp form; identical spelling to far-demonstrative plural (pron-demonstrative-far-mp)",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "introducedLesson": 11,
            "compare": "המה",
            "translit": "hemma"
          },
          {
            "id": "pron-subject-3fp-alt",
            "display": "הֵנָּה",
            "lemma": "הֵנָּה",
            "root": null,
            "pos": "pronoun",
            "acceptedParses": [
              {
                "person": "3",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": "longer alt. 3fp form; identical spelling to far-demonstrative plural (pron-demonstrative-far-fp)",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "introducedLesson": 11,
            "compare": "הנה",
            "translit": "henna"
          }
        ]
      },
      {
        "id": "particle-interrogative-words",
        "category": "particle",
        "label": "Question words (interrogatives)",
        "introducedLesson": 6,
        "source": {
          "lesson": 14,
          "page": 51
        },
        "forms": [
          {
            "id": "particle-interrogative-mi",
            "display": "מִי",
            "lemma": "מִי",
            "root": null,
            "pos": "particle",
            "introducedLesson": 6,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "who?",
            "ambiguityNote": null,
            "source": {
              "lesson": 6,
              "page": 34
            },
            "compare": "מי",
            "translit": "mi"
          },
          {
            "id": "particle-interrogative-mah",
            "display": "מָה",
            "lemma": "מָה",
            "root": null,
            "pos": "particle",
            "introducedLesson": 8,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "what?",
            "ambiguityNote": null,
            "source": {
              "lesson": 8,
              "page": 38
            },
            "compare": "מה",
            "translit": "ma"
          },
          {
            "id": "particle-interrogative-lammah",
            "display": "לָמָּה",
            "lemma": "לָמָּה",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "why?",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "למה",
            "translit": "lamma"
          },
          {
            "id": "particle-interrogative-maddua",
            "display": "מַדּוּעַ",
            "lemma": "מַדּוּעַ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "why? (alternate)",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "מדוע",
            "translit": "maddua"
          },
          {
            "id": "particle-interrogative-bammeh",
            "display": "בַּמֶּה",
            "lemma": "בַּמֶּה",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "how? (with preposition ב)",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "במה",
            "translit": "bamme"
          },
          {
            "id": "particle-interrogative-eykh",
            "display": "אֵיךְ",
            "lemma": "אֵיךְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "how? (alternate)",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "איך",
            "translit": "ekh"
          },
          {
            "id": "particle-interrogative-kammah",
            "display": "כַּמָּה",
            "lemma": "כַּמָּה",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "how much/how many?",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "כמה",
            "translit": "kamma"
          },
          {
            "id": "particle-interrogative-matay",
            "display": "מָתַי",
            "lemma": "מָתַי",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "when?",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "מתי",
            "translit": "matay"
          },
          {
            "id": "particle-interrogative-ey",
            "display": "אֵי",
            "lemma": "אֵי",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "where? (short form)",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "אי",
            "translit": "e"
          },
          {
            "id": "particle-interrogative-ayyeh",
            "display": "אַיֵּה",
            "lemma": "אַיֵּה",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "where? (alternate)",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "איה",
            "translit": "aye"
          },
          {
            "id": "particle-interrogative-eyfoh",
            "display": "אֵיפֹה",
            "lemma": "אֵיפֹה",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "where? (alternate)",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "איפה",
            "translit": "efo"
          },
          {
            "id": "particle-interrogative-meayin",
            "display": "מֵאַיִן",
            "lemma": "מֵאַיִן",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "from where?",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "מאין",
            "translit": "me'ayin"
          },
          {
            "id": "particle-interrogative-an",
            "display": "אָן",
            "lemma": "אָן",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "where?/to where? (short form)",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "אן",
            "translit": "an"
          },
          {
            "id": "particle-interrogative-anah",
            "display": "אָנָה",
            "lemma": "אָנָה",
            "root": null,
            "pos": "particle",
            "introducedLesson": 14,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "where?/to where? (alternate)",
            "ambiguityNote": null,
            "source": {
              "lesson": 14,
              "page": 51
            },
            "compare": "אנה",
            "translit": "ana"
          }
        ]
      },
      {
        "id": "noun-endings",
        "category": "noun",
        "label": "Noun gender/number/dual endings (סוּס/סוּסָה pattern)",
        "introducedLesson": 7,
        "source": {
          "lesson": 7,
          "page": 36
        },
        "forms": [
          {
            "id": "noun-endings-m-sg",
            "display": "סוּס",
            "lemma": "סוּס",
            "root": null,
            "pos": "noun",
            "introducedLesson": 7,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "stallion; masculine singular has no inflectional ending",
            "ambiguityNote": null,
            "source": {
              "lesson": 7,
              "page": 36
            },
            "compare": "סוס",
            "translit": "sus"
          },
          {
            "id": "noun-endings-f-sg",
            "display": "סוּסָה",
            "lemma": "סוּסָה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 7,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "mare; ־ָה feminine singular ending",
            "ambiguityNote": null,
            "source": {
              "lesson": 7,
              "page": 36
            },
            "compare": "סוסה",
            "translit": "susa"
          },
          {
            "id": "noun-endings-m-pl",
            "display": "סוּסִים",
            "lemma": "סוּס",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "stallions",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "סוסים",
            "translit": "susim"
          },
          {
            "id": "noun-endings-f-pl",
            "display": "סוּסוֹת",
            "lemma": "סוּסָה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "mares",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "סוסות",
            "translit": "susot"
          },
          {
            "id": "noun-endings-m-dual",
            "display": "סוּסַיִם",
            "lemma": "סוּס",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "dual",
                "state": "absolute"
              }
            ],
            "note": "dual ־ַיִם; used for naturally-paired items",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "סוסים",
            "translit": "susayim"
          },
          {
            "id": "noun-endings-f-dual",
            "display": "סוּסָתַיִם",
            "lemma": "סוּסָה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "dual",
                "state": "absolute"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "סוסתים",
            "translit": "susatayim"
          }
        ]
      },
      {
        "id": "noun-irregular",
        "category": "noun",
        "label": "Frequent irregular nouns: absolute and construct, singular and plural",
        "introducedLesson": 7,
        "source": {
          "lesson": 7,
          "page": 37
        },
        "forms": [
          {
            "id": "noun-irregular-av-abs-sg",
            "display": "אָב",
            "lemma": "אָב",
            "root": null,
            "pos": "noun",
            "introducedLesson": 7,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "father",
            "ambiguityNote": null,
            "source": {
              "lesson": 7,
              "page": 37
            },
            "compare": "אב",
            "translit": "av"
          },
          {
            "id": "noun-irregular-av-abs-pl",
            "display": "אָבוֹת",
            "lemma": "אָב",
            "root": null,
            "pos": "noun",
            "introducedLesson": 7,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "fathers",
            "ambiguityNote": null,
            "source": {
              "lesson": 7,
              "page": 37
            },
            "compare": "אבות",
            "translit": "avot"
          },
          {
            "id": "noun-irregular-av-cst-sg",
            "display": "אֲבִי",
            "lemma": "אָב",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "construct sg.; appendix also lists a variant אַב",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "compare": "אבי",
            "translit": "avi"
          },
          {
            "id": "noun-irregular-av-cst-pl",
            "display": "אֲבוֹת",
            "lemma": "אָב",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "compare": "אבות",
            "translit": "avot"
          },
          {
            "id": "noun-irregular-ach-abs-sg",
            "display": "אָח",
            "lemma": "אָח",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "brother",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 42
            },
            "compare": "אח",
            "translit": "ach"
          },
          {
            "id": "noun-irregular-ach-abs-pl",
            "display": "אַחִים",
            "lemma": "אָח",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "brothers",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 42
            },
            "compare": "אחים",
            "translit": "achim"
          },
          {
            "id": "noun-irregular-ach-cst-sg",
            "display": "אֲחִי",
            "lemma": "אָח",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "compare": "אחי",
            "translit": "achi"
          },
          {
            "id": "noun-irregular-ach-cst-pl",
            "display": "אֲחֵי",
            "lemma": "אָח",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "compare": "אחי",
            "translit": "ache"
          },
          {
            "id": "noun-irregular-achot-abs-sg",
            "display": "אָחוֹת",
            "lemma": "אָחוֹת",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "sister",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 42
            },
            "compare": "אחות",
            "translit": "achot"
          },
          {
            "id": "noun-irregular-achot-abs-pl",
            "display": "אַחְיוֹת",
            "lemma": "אָחוֹת",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "sisters",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 42
            },
            "compare": "אחיות",
            "translit": "achot"
          },
          {
            "id": "noun-irregular-achot-cst-sg",
            "display": "אֲחוֹת",
            "lemma": "אָחוֹת",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "compare": "אחות",
            "translit": "achot"
          },
          {
            "id": "noun-irregular-achot-cst-pl",
            "display": "אַחְיוֹת",
            "lemma": "אָחוֹת",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": "appendix prints this identical in spelling to the absolute plural",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "compare": "אחיות",
            "translit": "achot"
          },
          {
            "id": "noun-irregular-ish-abs-sg",
            "display": "אִישׁ",
            "lemma": "אִישׁ",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "man",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "איש",
            "translit": "ish"
          },
          {
            "id": "noun-irregular-ish-abs-pl",
            "display": "אֲנָשִׁים",
            "lemma": "אִישׁ",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "men; suppletive plural",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "אנשים",
            "translit": "anashim"
          },
          {
            "id": "noun-irregular-ish-cst-sg",
            "display": "אִישׁ",
            "lemma": "אִישׁ",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "construct sg. identical in spelling to absolute",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "compare": "איש",
            "translit": "ish"
          },
          {
            "id": "noun-irregular-ish-cst-pl",
            "display": "אַנְשֵׁי",
            "lemma": "אִישׁ",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "compare": "אנשי",
            "translit": "anshe"
          },
          {
            "id": "noun-irregular-isha-abs-sg",
            "display": "אִשָּׁה",
            "lemma": "אִשָּׁה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "woman",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "אשה",
            "translit": "isha"
          },
          {
            "id": "noun-irregular-isha-abs-pl",
            "display": "נָשִׁים",
            "lemma": "אִשָּׁה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "women; suppletive plural",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "נשים",
            "translit": "nashim"
          },
          {
            "id": "noun-irregular-isha-cst-sg",
            "display": "אֵשֶׁת",
            "lemma": "אִשָּׁה",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "compare": "אשת",
            "translit": "eshet"
          },
          {
            "id": "noun-irregular-isha-cst-pl",
            "display": "נְשֵׁי",
            "lemma": "אִשָּׁה",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "compare": "נשי",
            "translit": "neshe"
          },
          {
            "id": "noun-irregular-ben-abs-sg",
            "display": "בֵּן",
            "lemma": "בֵּן",
            "root": null,
            "pos": "noun",
            "introducedLesson": 7,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "son",
            "ambiguityNote": null,
            "source": {
              "lesson": 7,
              "page": 37
            },
            "compare": "בן",
            "translit": "ben"
          },
          {
            "id": "noun-irregular-ben-abs-pl",
            "display": "בָּנִים",
            "lemma": "בֵּן",
            "root": null,
            "pos": "noun",
            "introducedLesson": 7,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "sons",
            "ambiguityNote": null,
            "source": {
              "lesson": 7,
              "page": 37
            },
            "compare": "בנים",
            "translit": "banim"
          },
          {
            "id": "noun-irregular-ben-cst-sg",
            "display": "בֶּן",
            "lemma": "בֵּן",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "compare": "בן",
            "translit": "ben"
          },
          {
            "id": "noun-irregular-ben-cst-pl",
            "display": "בְּנֵי",
            "lemma": "בֵּן",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "compare": "בני",
            "translit": "bene"
          },
          {
            "id": "noun-irregular-bat-abs-sg",
            "display": "בַּת",
            "lemma": "בַּת",
            "root": null,
            "pos": "noun",
            "introducedLesson": 7,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "daughter",
            "ambiguityNote": null,
            "source": {
              "lesson": 7,
              "page": 37
            },
            "compare": "בת",
            "translit": "bat"
          },
          {
            "id": "noun-irregular-bat-abs-pl",
            "display": "בָּנוֹת",
            "lemma": "בַּת",
            "root": null,
            "pos": "noun",
            "introducedLesson": 7,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "daughters",
            "ambiguityNote": null,
            "source": {
              "lesson": 7,
              "page": 37
            },
            "compare": "בנות",
            "translit": "banot"
          },
          {
            "id": "noun-irregular-bat-cst-sg",
            "display": "בַּת",
            "lemma": "בַּת",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "construct sg. identical in spelling to absolute",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "compare": "בת",
            "translit": "bat"
          },
          {
            "id": "noun-irregular-bat-cst-pl",
            "display": "בְּנוֹת",
            "lemma": "בַּת",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "compare": "בנות",
            "translit": "benot"
          },
          {
            "id": "noun-irregular-rosh-abs-sg",
            "display": "רֹאשׁ",
            "lemma": "רֹאשׁ",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "head",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 42
            },
            "compare": "ראש",
            "translit": "rosh"
          },
          {
            "id": "noun-irregular-rosh-abs-pl",
            "display": "רָאשִׁים",
            "lemma": "רֹאשׁ",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "heads",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 42
            },
            "compare": "ראשים",
            "translit": "rashim"
          },
          {
            "id": "noun-irregular-rosh-cst-sg",
            "display": "רֹאשׁ",
            "lemma": "רֹאשׁ",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "construct sg. identical in spelling to absolute",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "compare": "ראש",
            "translit": "rosh"
          },
          {
            "id": "noun-irregular-rosh-cst-pl",
            "display": "רָאשֵׁי",
            "lemma": "רֹאשׁ",
            "root": null,
            "pos": "noun",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "compare": "ראשי",
            "translit": "rashe"
          }
        ]
      },
      {
        "id": "noun-irregular-bayit",
        "category": "noun",
        "label": "בַּיִת 'house' (irregular absolute/construct, sg/pl)",
        "introducedLesson": 8,
        "source": {
          "lesson": 8,
          "page": 38
        },
        "note": "Absolute sg/pl gated to the lesson vocab entry (printed as 'ABS (PL)'); construct forms are appendixOnly (Appendix B.2), no lesson prints them for this noun.",
        "forms": [
          {
            "id": "noun-irregular-bayit-abs-sg",
            "display": "בַּיִת",
            "lemma": "בַּיִת",
            "root": null,
            "pos": "noun",
            "introducedLesson": 8,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 8,
              "page": 38
            },
            "compare": "בית",
            "translit": "bayit"
          },
          {
            "id": "noun-irregular-bayit-cons-sg",
            "display": "בֵּית",
            "lemma": "בַּיִת",
            "root": null,
            "pos": "noun",
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "ambiguityNote": null,
            "appendixOnly": true,
            "compare": "בית",
            "translit": "bet"
          },
          {
            "id": "noun-irregular-bayit-abs-pl",
            "display": "בָּתִּים",
            "lemma": "בַּיִת",
            "root": null,
            "pos": "noun",
            "introducedLesson": 8,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 8,
              "page": 38
            },
            "compare": "בתים",
            "translit": "battim"
          },
          {
            "id": "noun-irregular-bayit-cons-pl",
            "display": "בָּתֵּי",
            "lemma": "בַּיִת",
            "root": null,
            "pos": "noun",
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-11"
            },
            "appendixOnly": true,
            "compare": "בתי",
            "translit": "batte"
          }
        ]
      },
      {
        "id": "particle-l-possession",
        "category": "particle",
        "label": "ל of possession + attached pronoun",
        "introducedLesson": 9,
        "source": {
          "lesson": 9,
          "page": 39
        },
        "forms": [
          {
            "id": "particle-l-possession-3ms",
            "display": "לוֹ",
            "lemma": "לְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 9,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "'belongs to him/it'",
            "ambiguityNote": null,
            "source": {
              "lesson": 9,
              "page": 39
            },
            "compare": "לו",
            "translit": "lo"
          },
          {
            "id": "particle-l-possession-3fs",
            "display": "לָהּ",
            "lemma": "לְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 9,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 9,
              "page": 39
            },
            "compare": "לה",
            "translit": "lah"
          },
          {
            "id": "particle-l-possession-2ms",
            "display": "לְךָ",
            "lemma": "לְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 9,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 9,
              "page": 39
            },
            "compare": "לך",
            "translit": "lekha"
          },
          {
            "id": "particle-l-possession-2fs",
            "display": "לָךְ",
            "lemma": "לְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 9,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 9,
              "page": 39
            },
            "compare": "לך",
            "translit": "lakh"
          },
          {
            "id": "particle-l-possession-1cs",
            "display": "לִי",
            "lemma": "לְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 9,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 9,
              "page": 39
            },
            "compare": "לי",
            "translit": "li"
          },
          {
            "id": "particle-l-possession-3mp",
            "display": "לָהֶם",
            "lemma": "לְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 17,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 17,
              "page": 58
            },
            "compare": "להם",
            "translit": "lahem"
          },
          {
            "id": "particle-l-possession-3fp",
            "display": "לָהֶן",
            "lemma": "לְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 17,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 17,
              "page": 58
            },
            "compare": "להן",
            "translit": "lahen"
          },
          {
            "id": "particle-l-possession-2mp",
            "display": "לָכֶם",
            "lemma": "לְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 17,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 17,
              "page": 58
            },
            "compare": "לכם",
            "translit": "lakhem"
          },
          {
            "id": "particle-l-possession-2fp",
            "display": "לָכֶן",
            "lemma": "לְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 17,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 17,
              "page": 58
            },
            "compare": "לכן",
            "translit": "lakhen"
          },
          {
            "id": "particle-l-possession-1cp",
            "display": "לָנוּ",
            "lemma": "לְ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 17,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 17,
              "page": 58
            },
            "compare": "לנו",
            "translit": "lanu"
          }
        ]
      },
      {
        "id": "noun-dual-bodyparts",
        "category": "noun",
        "label": "Paired body parts: singular vs. dual (all feminine)",
        "introducedLesson": 10,
        "source": {
          "lesson": 10,
          "page": 41
        },
        "forms": [
          {
            "id": "noun-dual-bodyparts-yad-sg",
            "display": "יָד",
            "lemma": "יָד",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "hand; lacks overt feminine marking, must be memorized",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "יד",
            "translit": "yad"
          },
          {
            "id": "noun-dual-bodyparts-yad-dual",
            "display": "יָדַיִם",
            "lemma": "יָד",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "dual",
                "state": "absolute"
              }
            ],
            "note": "hands",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "ידים",
            "translit": "yadayim"
          },
          {
            "id": "noun-dual-bodyparts-ozen-sg",
            "display": "אֹזֶן",
            "lemma": "אֹזֶן",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "ear",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "אזן",
            "translit": "ozen"
          },
          {
            "id": "noun-dual-bodyparts-ozen-dual",
            "display": "אָזְנַיִם",
            "lemma": "אֹזֶן",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "dual",
                "state": "absolute"
              }
            ],
            "note": "ears",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "אזנים",
            "translit": "aznayim"
          },
          {
            "id": "noun-dual-bodyparts-regel-sg",
            "display": "רֶגֶל",
            "lemma": "רֶגֶל",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "foot",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "רגל",
            "translit": "regel"
          },
          {
            "id": "noun-dual-bodyparts-regel-dual",
            "display": "רַגְלַיִם",
            "lemma": "רֶגֶל",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "dual",
                "state": "absolute"
              }
            ],
            "note": "feet",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "רגלים",
            "translit": "raglayim"
          },
          {
            "id": "noun-dual-bodyparts-ayin-sg",
            "display": "עַיִן",
            "lemma": "עַיִן",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "eye",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "עין",
            "translit": "ayin"
          },
          {
            "id": "noun-dual-bodyparts-ayin-dual",
            "display": "עֵינַיִם",
            "lemma": "עַיִן",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "dual",
                "state": "absolute"
              }
            ],
            "note": "eyes",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "עינים",
            "translit": "enayim"
          },
          {
            "id": "noun-dual-bodyparts-naal-sg",
            "display": "נַעַל",
            "lemma": "נַעַל",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "sandal",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "נעל",
            "translit": "na'al"
          },
          {
            "id": "noun-dual-bodyparts-naal-dual",
            "display": "נַעֲלַיִם",
            "lemma": "נַעַל",
            "root": null,
            "pos": "noun",
            "introducedLesson": 10,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "dual",
                "state": "absolute"
              }
            ],
            "note": "sandals",
            "ambiguityNote": null,
            "source": {
              "lesson": 10,
              "page": 41
            },
            "compare": "נעלים",
            "translit": "na'alayim"
          }
        ]
      },
      {
        "id": "noun-irregular-ir",
        "category": "noun",
        "label": "עִיר 'city' (irregular absolute/construct, sg/pl)",
        "introducedLesson": 11,
        "source": {
          "lesson": 11,
          "page": 44
        },
        "note": "Absolute sg/pl gated to the lesson vocab entry (printed as 'ABS (PL)'); construct forms are appendixOnly (Appendix B.2), no lesson prints them for this noun.",
        "forms": [
          {
            "id": "noun-irregular-ir-abs-sg",
            "display": "עִיר",
            "lemma": "עִיר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 11,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 11,
              "page": 44
            },
            "compare": "עיר",
            "translit": "ir"
          },
          {
            "id": "noun-irregular-ir-cons-sg",
            "display": "עִיר",
            "lemma": "עִיר",
            "root": null,
            "pos": "noun",
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "ambiguityNote": "Construct singular is spelled identically to the absolute singular; disambiguate by whether the noun heads a construct phrase (followed by another noun/def. article target).",
            "appendixOnly": true,
            "compare": "עיר",
            "translit": "ir"
          },
          {
            "id": "noun-irregular-ir-abs-pl",
            "display": "עָרִים",
            "lemma": "עִיר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 11,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 11,
              "page": 44
            },
            "compare": "ערים",
            "translit": "arim"
          },
          {
            "id": "noun-irregular-ir-cons-pl",
            "display": "עָרֵי",
            "lemma": "עִיר",
            "root": null,
            "pos": "noun",
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "appendixOnly": true,
            "compare": "ערי",
            "translit": "are"
          }
        ]
      },
      {
        "id": "particle-yesh-ayin",
        "category": "particle",
        "label": "Existential particles יֵשׁ / אֵין",
        "introducedLesson": 12,
        "source": {
          "lesson": 12,
          "page": 46
        },
        "forms": [
          {
            "id": "particle-yesh-ayin-yesh",
            "display": "יֵשׁ",
            "lemma": "יֵשׁ",
            "root": null,
            "pos": "particle",
            "introducedLesson": 12,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "existential copula 'is/are, there is/are'",
            "ambiguityNote": null,
            "source": {
              "lesson": 12,
              "page": 46
            },
            "compare": "יש",
            "translit": "yesh"
          },
          {
            "id": "particle-yesh-ayin-ayin",
            "display": "אֵין",
            "lemma": "אֵין",
            "root": null,
            "pos": "particle",
            "introducedLesson": 12,
            "acceptedParses": [
              {
                "suffix": null
              }
            ],
            "note": "negative existential copula 'is/are not, there is/are not'",
            "ambiguityNote": null,
            "source": {
              "lesson": 12,
              "page": 46
            },
            "compare": "אין",
            "translit": "en"
          }
        ]
      },
      {
        "id": "verb-haya-perfect",
        "category": "verb",
        "label": "Qal Perfect of היה (irregular \"to be\")",
        "introducedLesson": 16,
        "source": {
          "lesson": 16,
          "page": 55
        },
        "forms": [
          {
            "id": "verb-haya-perfect-3ms",
            "display": "הָיָה",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 16,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "be/become/happen; irregular, taught alongside שמר as the frequent exception",
            "ambiguityNote": null,
            "source": {
              "lesson": 16,
              "page": 55
            },
            "compare": "היה",
            "translit": "haya"
          },
          {
            "id": "verb-haya-perfect-3fs",
            "display": "הָיְתָה",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 16,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 16,
              "page": 55
            },
            "compare": "היתה",
            "translit": "hayta"
          },
          {
            "id": "verb-haya-perfect-2ms",
            "display": "הָיִיתָ",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 16,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 16,
              "page": 55
            },
            "compare": "היית",
            "translit": "hayita"
          },
          {
            "id": "verb-haya-perfect-2fs",
            "display": "הָיִית",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 16,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "2",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 16,
              "page": 55
            },
            "compare": "היית",
            "translit": "hayit"
          },
          {
            "id": "verb-haya-perfect-1cs",
            "display": "הָיִיתִי",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 16,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "1",
                "gender": "common",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 16,
              "page": 55
            },
            "compare": "הייתי",
            "translit": "hayiti"
          },
          {
            "id": "verb-haya-perfect-3cp",
            "display": "הָיוּ",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 19,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "common",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 19,
              "page": 62
            },
            "compare": "היו",
            "translit": "hayu"
          },
          {
            "id": "verb-haya-perfect-2mp",
            "display": "הֱיִיתֶם",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 19,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "2",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 19,
              "page": 62
            },
            "compare": "הייתם",
            "translit": "heyitem"
          },
          {
            "id": "verb-haya-perfect-2fp",
            "display": "הֱיִיתֶן",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 19,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "2",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 19,
              "page": 62
            },
            "compare": "הייתן",
            "translit": "heyiten"
          },
          {
            "id": "verb-haya-perfect-1cp",
            "display": "הָיִינוּ",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 19,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "1",
                "gender": "common",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 19,
              "page": 62
            },
            "compare": "היינו",
            "translit": "hayinu"
          }
        ]
      },
      {
        "id": "verb-qal-perfect",
        "category": "verb",
        "label": "Qal Perfect (שמר)",
        "introducedLesson": 16,
        "source": {
          "lesson": 16,
          "page": 55
        },
        "forms": [
          {
            "id": "verb-qal-perfect-3ms",
            "display": "שָׁמַר",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 16,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "guard; no person/gender/number suffix (bare 3ms form)",
            "ambiguityNote": null,
            "source": {
              "lesson": 16,
              "page": 55
            },
            "compare": "שמר",
            "translit": "shamar"
          },
          {
            "id": "verb-qal-perfect-3fs",
            "display": "שָׁמְרָה",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 16,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 16,
              "page": 55
            },
            "compare": "שמרה",
            "translit": "shamra"
          },
          {
            "id": "verb-qal-perfect-2ms",
            "display": "שָׁמַרְתָּ",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 16,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 16,
              "page": 55
            },
            "compare": "שמרת",
            "translit": "shamarta"
          },
          {
            "id": "verb-qal-perfect-2fs",
            "display": "שָׁמַרְתְּ",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 16,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "2",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 16,
              "page": 55
            },
            "compare": "שמרת",
            "translit": "shamart"
          },
          {
            "id": "verb-qal-perfect-1cs",
            "display": "שָׁמַרְתִּי",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 16,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "1",
                "gender": "common",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 16,
              "page": 55
            },
            "compare": "שמרתי",
            "translit": "shamarti"
          },
          {
            "id": "verb-qal-perfect-3cp",
            "display": "שָׁמְרוּ",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 19,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "common",
                "number": "plural"
              }
            ],
            "note": "3cp is common gender (no masc/fem split in Perfect plural 3rd person)",
            "ambiguityNote": null,
            "source": {
              "lesson": 19,
              "page": 62
            },
            "compare": "שמרו",
            "translit": "shamru"
          },
          {
            "id": "verb-qal-perfect-2mp",
            "display": "שְׁמַרְתֶּם",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 19,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "2",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 19,
              "page": 62
            },
            "compare": "שמרתם",
            "translit": "shemartem"
          },
          {
            "id": "verb-qal-perfect-2fp",
            "display": "שְׁמַרְתֶּן",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 19,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "2",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 19,
              "page": 62
            },
            "compare": "שמרתן",
            "translit": "shemarten"
          },
          {
            "id": "verb-qal-perfect-1cp",
            "display": "שָׁמַרְנוּ",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 19,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "1",
                "gender": "common",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 19,
              "page": 62
            },
            "compare": "שמרנו",
            "translit": "shamarnu"
          }
        ]
      },
      {
        "id": "noun-bound-construct",
        "category": "noun",
        "label": "Bound (construct/נסמך) vs. absolute (סומך) noun state",
        "introducedLesson": 20,
        "source": {
          "lesson": 20,
          "page": 64
        },
        "forms": [
          {
            "id": "noun-bound-construct-m-abs-sg",
            "display": "דָּבָר",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 20,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "word",
            "ambiguityNote": null,
            "source": {
              "lesson": 20,
              "page": 64
            },
            "compare": "דבר",
            "translit": "davar"
          },
          {
            "id": "noun-bound-construct-m-cst-sg",
            "display": "דְּבַר",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 20,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "word of",
            "ambiguityNote": null,
            "source": {
              "lesson": 20,
              "page": 64
            },
            "compare": "דבר",
            "translit": "devar"
          },
          {
            "id": "noun-bound-construct-m-abs-pl",
            "display": "דְּבָרִים",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 20,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "words",
            "ambiguityNote": null,
            "source": {
              "lesson": 20,
              "page": 64
            },
            "compare": "דברים",
            "translit": "devarim"
          },
          {
            "id": "noun-bound-construct-m-cst-pl",
            "display": "דִּבְרֵי",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 20,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": "words of",
            "ambiguityNote": null,
            "source": {
              "lesson": 20,
              "page": 64
            },
            "compare": "דברי",
            "translit": "divre"
          },
          {
            "id": "noun-bound-construct-f-abs-sg",
            "display": "אֲדָמָה",
            "lemma": "אֲדָמָה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 20,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "ground",
            "ambiguityNote": null,
            "source": {
              "lesson": 20,
              "page": 64
            },
            "compare": "אדמה",
            "translit": "adama"
          },
          {
            "id": "noun-bound-construct-f-cst-sg",
            "display": "אַדְמַת",
            "lemma": "אֲדָמָה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 20,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "ground of",
            "ambiguityNote": null,
            "source": {
              "lesson": 20,
              "page": 64
            },
            "compare": "אדמת",
            "translit": "admat"
          },
          {
            "id": "noun-bound-construct-f-abs-pl",
            "display": "אֲדָמוֹת",
            "lemma": "אֲדָמָה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 20,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "grounds",
            "ambiguityNote": null,
            "source": {
              "lesson": 20,
              "page": 64
            },
            "compare": "אדמות",
            "translit": "adamot"
          },
          {
            "id": "noun-bound-construct-f-cst-pl",
            "display": "אַדְמוֹת",
            "lemma": "אֲדָמָה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 20,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": "construct plural looks identical in the printed chart to the absolute plural for this noun",
            "ambiguityNote": null,
            "source": {
              "lesson": 20,
              "page": 64
            },
            "compare": "אדמות",
            "translit": "admot"
          }
        ]
      },
      {
        "id": "noun-irregular-yom",
        "category": "noun",
        "label": "יוֹם 'day' (irregular absolute/construct, sg/pl)",
        "introducedLesson": 21,
        "source": {
          "lesson": 21,
          "page": 67
        },
        "note": "Absolute sg/pl gated to the lesson vocab entry (printed as 'ABS (PL)'); construct forms are appendixOnly (Appendix B.2), no lesson prints them for this noun.",
        "forms": [
          {
            "id": "noun-irregular-yom-abs-sg",
            "display": "יוֹם",
            "lemma": "יוֹם",
            "root": null,
            "pos": "noun",
            "introducedLesson": 21,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 21,
              "page": 67
            },
            "compare": "יום",
            "translit": "yom"
          },
          {
            "id": "noun-irregular-yom-cons-sg",
            "display": "יוֹם",
            "lemma": "יוֹם",
            "root": null,
            "pos": "noun",
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "ambiguityNote": "Construct singular is spelled identically to the absolute singular; disambiguate by whether the noun heads a construct phrase (followed by another noun/def. article target).",
            "appendixOnly": true,
            "compare": "יום",
            "translit": "yom"
          },
          {
            "id": "noun-irregular-yom-abs-pl",
            "display": "יָמִים",
            "lemma": "יוֹם",
            "root": null,
            "pos": "noun",
            "introducedLesson": 21,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 21,
              "page": 67
            },
            "compare": "ימים",
            "translit": "yamim"
          },
          {
            "id": "noun-irregular-yom-cons-pl",
            "display": "יְמֵי",
            "lemma": "יוֹם",
            "root": null,
            "pos": "noun",
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-12"
            },
            "appendixOnly": true,
            "compare": "ימי",
            "translit": "yeme"
          }
        ]
      },
      {
        "id": "noun-attached-pl",
        "category": "noun",
        "label": "Noun + attached pronoun, on a plural-noun host (bracketed forms)",
        "introducedLesson": 22,
        "source": {
          "lesson": 31,
          "page": 91
        },
        "forms": [
          {
            "id": "noun-attached-pl-3ms",
            "display": "דְּבָרָיו",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 22,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "his words",
            "ambiguityNote": null,
            "source": {
              "lesson": 22,
              "page": 69
            },
            "compare": "דבריו",
            "translit": "devarayv"
          },
          {
            "id": "noun-attached-pl-3fs",
            "display": "דְּבָרֶיהָ",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "her words",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דבריה",
            "translit": "devareha"
          },
          {
            "id": "noun-attached-pl-2ms",
            "display": "דְּבָרֶיךָ",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "your (ms) words",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דבריך",
            "translit": "devarekha"
          },
          {
            "id": "noun-attached-pl-2fs",
            "display": "דְּבָרַיִךְ",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "your (fs) words",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דבריך",
            "translit": "devarayikh"
          },
          {
            "id": "noun-attached-pl-1cs",
            "display": "דְּבָרַי",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "my words",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דברי",
            "translit": "devaray"
          },
          {
            "id": "noun-attached-pl-3mp",
            "display": "דִּבְרֵיהֶם",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                },
                "definite": true
              }
            ],
            "note": "their words",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דבריהם",
            "translit": "divrehem"
          },
          {
            "id": "noun-attached-pl-3fp",
            "display": "דִּבְרֵיהֶן",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                },
                "definite": true
              }
            ],
            "note": "their words",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דבריהן",
            "translit": "divrehen"
          },
          {
            "id": "noun-attached-pl-2mp",
            "display": "דִּבְרֵיכֶם",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                },
                "definite": true
              }
            ],
            "note": "your (mp) words",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דבריכם",
            "translit": "divrekhem"
          },
          {
            "id": "noun-attached-pl-2fp",
            "display": "דִּבְרֵיכֶן",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                },
                "definite": true
              }
            ],
            "note": "your (fp) words",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דבריכן",
            "translit": "divrekhen"
          },
          {
            "id": "noun-attached-pl-1cp",
            "display": "דִּבְרֵינוּ",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                },
                "definite": true
              }
            ],
            "note": "our words",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דברינו",
            "translit": "divrenu"
          },
          {
            "id": "noun-attached-pl-3ms-fem-host",
            "display": "תּוֹרוֹתָיו",
            "lemma": "תּוֹרָה",
            "root": null,
            "pos": "noun",
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "construct",
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "his teachings/laws; feminine-host equivalent, only seen printed in the appendix chart",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "introducedLesson": 31,
            "compare": "תורותיו",
            "translit": "torotayv"
          }
        ]
      },
      {
        "id": "noun-attached-sg",
        "category": "noun",
        "label": "Noun + attached pronoun, singular-referent set, on a singular-noun host",
        "introducedLesson": 22,
        "source": {
          "lesson": 22,
          "page": 68
        },
        "forms": [
          {
            "id": "noun-attached-sg-3ms",
            "display": "דְּבָרוֹ",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 22,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "his word",
            "ambiguityNote": null,
            "source": {
              "lesson": 22,
              "page": 69
            },
            "compare": "דברו",
            "translit": "devaro"
          },
          {
            "id": "noun-attached-sg-3fs",
            "display": "דְּבָרָהּ",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 22,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "her word",
            "ambiguityNote": null,
            "source": {
              "lesson": 22,
              "page": 68
            },
            "compare": "דברה",
            "translit": "devarah"
          },
          {
            "id": "noun-attached-sg-2ms",
            "display": "דְּבָרְךָ",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 22,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "your (ms) word",
            "ambiguityNote": null,
            "source": {
              "lesson": 22,
              "page": 68
            },
            "compare": "דברך",
            "translit": "devarkha"
          },
          {
            "id": "noun-attached-sg-2fs",
            "display": "דְּבָרֵךְ",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 22,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "your (fs) word",
            "ambiguityNote": null,
            "source": {
              "lesson": 22,
              "page": 68
            },
            "compare": "דברך",
            "translit": "devarekh"
          },
          {
            "id": "noun-attached-sg-1cs",
            "display": "דְּבָרִי",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 22,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "my word",
            "ambiguityNote": null,
            "source": {
              "lesson": 22,
              "page": 68
            },
            "compare": "דברי",
            "translit": "devari"
          },
          {
            "id": "noun-attached-sg-3mp",
            "display": "דְּבָרָם",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                },
                "definite": true
              }
            ],
            "note": "their word",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דברם",
            "translit": "devaram"
          },
          {
            "id": "noun-attached-sg-3fp",
            "display": "דְּבָרָן",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                },
                "definite": true
              }
            ],
            "note": "their word",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דברן",
            "translit": "devaran"
          },
          {
            "id": "noun-attached-sg-2mp",
            "display": "דְּבַרְכֶם",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                },
                "definite": true
              }
            ],
            "note": "your (mp) word",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דברכם",
            "translit": "devarkhem"
          },
          {
            "id": "noun-attached-sg-2fp",
            "display": "דְּבַרְכֶן",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                },
                "definite": true
              }
            ],
            "note": "your (fp) word",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דברכן",
            "translit": "devarkhen"
          },
          {
            "id": "noun-attached-sg-1cp",
            "display": "דְּבָרֵנוּ",
            "lemma": "דָּבָר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 31,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                },
                "definite": true
              }
            ],
            "note": "our word",
            "ambiguityNote": null,
            "source": {
              "lesson": 31,
              "page": 91
            },
            "compare": "דברנו",
            "translit": "devarenu"
          },
          {
            "id": "noun-attached-sg-3ms-fem-host",
            "display": "תּוֹרָתוֹ",
            "lemma": "תּוֹרָה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 22,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct",
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                },
                "definite": true
              }
            ],
            "note": "his teaching/law; illustrates that feminine ־ָה nouns take suffixes on the ־ת (נסמך) stem",
            "ambiguityNote": null,
            "source": {
              "lesson": 22,
              "page": 68
            },
            "compare": "תורתו",
            "translit": "torato"
          }
        ]
      },
      {
        "id": "verb-qal-imperfect",
        "category": "verb",
        "label": "Qal Imperfect (שמר)",
        "introducedLesson": 23,
        "source": {
          "lesson": 23,
          "page": 71
        },
        "forms": [
          {
            "id": "verb-qal-imperfect-3ms",
            "display": "יִשְׁמֹר",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 23,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he will guard; prefix conjugation",
            "ambiguityNote": null,
            "source": {
              "lesson": 23,
              "page": 71
            },
            "compare": "ישמר",
            "translit": "yishmor"
          },
          {
            "id": "verb-qal-imperfect-2ms-3fs",
            "display": "תִּשְׁמֹר",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 23,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              },
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "identical written form for \"you (ms) will guard\" and \"she will guard\"",
            "ambiguityNote": "Book prints both 2ms and 3fs as תִּשְׁמֹר with no morphological distinction; disambiguated only by subject (explicit pronoun/noun) or discourse context.",
            "source": {
              "lesson": 23,
              "page": 71
            },
            "compare": "תשמר",
            "translit": "tishmor"
          },
          {
            "id": "verb-qal-imperfect-2fs",
            "display": "תִּשְׁמְרִי",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 23,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "2",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 23,
              "page": 71
            },
            "compare": "תשמרי",
            "translit": "tishmeri"
          },
          {
            "id": "verb-qal-imperfect-1cs",
            "display": "אֶשְׁמֹר",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 23,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "1",
                "gender": "common",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 23,
              "page": 71
            },
            "compare": "אשמר",
            "translit": "eshmor"
          },
          {
            "id": "verb-qal-imperfect-3mp",
            "display": "יִשְׁמְרוּ",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 27,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 27,
              "page": 81
            },
            "compare": "ישמרו",
            "translit": "yishmeru"
          },
          {
            "id": "verb-qal-imperfect-2mp",
            "display": "תִּשְׁמְרוּ",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 27,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "2",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 27,
              "page": 81
            },
            "compare": "תשמרו",
            "translit": "tishmeru"
          },
          {
            "id": "verb-qal-imperfect-3fp-2fp",
            "display": "תִּשְׁמֹרְנָה",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 27,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "feminine",
                "number": "plural"
              },
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "2",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": "identical written form for \"they (fp) will guard\" and \"you (fp) will guard\"",
            "ambiguityNote": "Book prints both 3fp and 2fp as תִּשְׁמֹרְנָה with no morphological distinction; disambiguated only by subject/context.",
            "source": {
              "lesson": 27,
              "page": 81
            },
            "compare": "תשמרנה",
            "translit": "tishmorna"
          },
          {
            "id": "verb-qal-imperfect-1cp",
            "display": "נִשְׁמֹר",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 27,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "1",
                "gender": "common",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 27,
              "page": 81
            },
            "compare": "נשמר",
            "translit": "nishmor"
          }
        ]
      },
      {
        "id": "verb-qal-infinitive",
        "category": "verb",
        "label": "Qal Infinitive (construct)",
        "introducedLesson": 24,
        "source": {
          "lesson": 24,
          "page": 74
        },
        "forms": [
          {
            "id": "verb-qal-infinitive-base",
            "display": "שְׁמֹר",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 24,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "infinitive"
              }
            ],
            "note": "not inflected for person/gender/number; may take an attached pronoun as subject or object depending on context",
            "ambiguityNote": null,
            "source": {
              "lesson": 24,
              "page": 74
            },
            "compare": "שמר",
            "translit": "shemor"
          }
        ]
      },
      {
        "id": "verb-qal-adverbial-infinitive",
        "category": "verb",
        "label": "Qal Adverbial Infinitive (absolute)",
        "introducedLesson": 25,
        "source": {
          "lesson": 25,
          "page": 77
        },
        "forms": [
          {
            "id": "verb-qal-adverbial-infinitive-base",
            "display": "שָׁמוֹר",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 25,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "adverbial-infinitive"
              }
            ],
            "note": "not inflected; distinct spelling (holem-vav) from the construct infinitive שְׁמֹר; paired with a finite verb of the same root/binyan for modal emphasis",
            "ambiguityNote": null,
            "source": {
              "lesson": 25,
              "page": 77
            },
            "compare": "שמור",
            "translit": "shamor"
          }
        ]
      },
      {
        "id": "verb-haya-imperfect",
        "category": "verb",
        "label": "Qal Imperfect of היה (irregular \"to be\")",
        "introducedLesson": 28,
        "source": {
          "lesson": 28,
          "page": 83
        },
        "forms": [
          {
            "id": "verb-haya-imperfect-3ms",
            "display": "יִהְיֶה",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 28,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he will be",
            "ambiguityNote": null,
            "source": {
              "lesson": 28,
              "page": 83
            },
            "compare": "יהיה",
            "translit": "yihye"
          },
          {
            "id": "verb-haya-imperfect-2ms-3fs",
            "display": "תִּהְיֶה",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 28,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              },
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "same 2ms/3fs syncretism as regular Qal Imperfect",
            "ambiguityNote": "Book prints both 2ms and 3fs as תִּהְיֶה; disambiguated only by subject/context.",
            "source": {
              "lesson": 28,
              "page": 83
            },
            "compare": "תהיה",
            "translit": "tihye"
          },
          {
            "id": "verb-haya-imperfect-2fs",
            "display": "תִּהְיִי",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 28,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "2",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 28,
              "page": 83
            },
            "compare": "תהיי",
            "translit": "tihyi"
          },
          {
            "id": "verb-haya-imperfect-1cs",
            "display": "אֶהְיֶה",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 28,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "1",
                "gender": "common",
                "number": "singular"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 28,
              "page": 83
            },
            "compare": "אהיה",
            "translit": "ehye"
          },
          {
            "id": "verb-haya-imperfect-3mp",
            "display": "יִהְיוּ",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 28,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 28,
              "page": 83
            },
            "compare": "יהיו",
            "translit": "yihu"
          },
          {
            "id": "verb-haya-imperfect-2mp",
            "display": "תִּהְיוּ",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 28,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "2",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 28,
              "page": 83
            },
            "compare": "תהיו",
            "translit": "tihu"
          },
          {
            "id": "verb-haya-imperfect-3fp-2fp",
            "display": "תִּהְיֶינָה",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 28,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "feminine",
                "number": "plural"
              },
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "2",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": "same 3fp/2fp syncretism as regular Qal Imperfect",
            "ambiguityNote": "Book prints both 3fp and 2fp as תִּהְיֶינָה; disambiguated only by subject/context.",
            "source": {
              "lesson": 28,
              "page": 83
            },
            "compare": "תהיינה",
            "translit": "tihyena"
          },
          {
            "id": "verb-haya-imperfect-1cp",
            "display": "נִהְיֶה",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 28,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "1",
                "gender": "common",
                "number": "plural"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 28,
              "page": 83
            },
            "compare": "נהיה",
            "translit": "nihye"
          }
        ]
      },
      {
        "id": "numeral-cardinal-1-10",
        "category": "numeral",
        "label": "Cardinal numbers 1-10",
        "introducedLesson": 29,
        "source": {
          "lesson": 45,
          "page": 125
        },
        "forms": [
          {
            "id": "numeral-cardinal-1-10-1-f",
            "display": "אַחַת",
            "lemma": "אַחַת",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              },
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "one (f); modifies feminine nouns as an adjective, agrees in gender",
            "ambiguityNote": "Absolute and construct spelled identically.",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "אחת",
            "translit": "achat"
          },
          {
            "id": "numeral-cardinal-1-10-1-m",
            "display": "אֶחָד",
            "lemma": "אֶחָד",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              },
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "one (m)",
            "ambiguityNote": null,
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "אחד",
            "translit": "echad"
          },
          {
            "id": "numeral-cardinal-1-10-1-m-cst",
            "display": "אַחַד",
            "lemma": "אֶחָד",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "Construct (bound) form of one, masculine.",
            "ambiguityNote": null,
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "אחד",
            "translit": "achad"
          },
          {
            "id": "numeral-cardinal-1-10-2-f-abs",
            "display": "שְׁתַּיִם",
            "lemma": "שְׁתַּיִם",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "dual",
                "state": "absolute"
              }
            ],
            "note": "two (f) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שתים",
            "translit": "shettayim"
          },
          {
            "id": "numeral-cardinal-1-10-2-f-cstr",
            "display": "שְׁתֵּי",
            "lemma": "שְׁתַּיִם",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "dual",
                "state": "construct"
              }
            ],
            "note": "two (f) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שתי",
            "translit": "shette"
          },
          {
            "id": "numeral-cardinal-1-10-2-m-abs",
            "display": "שְׁנַיִם",
            "lemma": "שְׁנַיִם",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "dual",
                "state": "absolute"
              }
            ],
            "note": "two (m) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שנים",
            "translit": "shenayim"
          },
          {
            "id": "numeral-cardinal-1-10-2-m-cstr",
            "display": "שְׁנֵי",
            "lemma": "שְׁנַיִם",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "dual",
                "state": "construct"
              }
            ],
            "note": "two (m) construct; 2-10 are nouns usable in apposition or construct with the counted noun",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שני",
            "translit": "shene"
          },
          {
            "id": "numeral-cardinal-1-10-3-f-abs",
            "display": "שָׁלֹשׁ",
            "lemma": "שָׁלֹשׁ",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "three (f) absolute; 3-10 take the opposite gender form from the noun they modify",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שלש",
            "translit": "shalosh"
          },
          {
            "id": "numeral-cardinal-1-10-3-f-cstr",
            "display": "שְׁלֹשׁ",
            "lemma": "שָׁלֹשׁ",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "three (f) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שלש",
            "translit": "shelosh"
          },
          {
            "id": "numeral-cardinal-1-10-3-m-abs",
            "display": "שְׁלֹשָׁה",
            "lemma": "שְׁלֹשָׁה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "three (m) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שלשה",
            "translit": "shelosha"
          },
          {
            "id": "numeral-cardinal-1-10-3-m-cstr",
            "display": "שְׁלֹשֶׁת",
            "lemma": "שְׁלֹשָׁה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "three (m) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שלשת",
            "translit": "sheloshet"
          },
          {
            "id": "numeral-cardinal-1-10-4-f",
            "display": "אַרְבַּע",
            "lemma": "אַרְבַּע",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              },
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "four (f)",
            "ambiguityNote": "Absolute and construct spelled identically.",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "ארבע",
            "translit": "arba"
          },
          {
            "id": "numeral-cardinal-1-10-4-m-abs",
            "display": "אַרְבָּעָה",
            "lemma": "אַרְבָּעָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "four (m) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "ארבעה",
            "translit": "arba'a"
          },
          {
            "id": "numeral-cardinal-1-10-4-m-cstr",
            "display": "אַרְבַּעַת",
            "lemma": "אַרְבָּעָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "four (m) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "ארבעת",
            "translit": "arba'at"
          },
          {
            "id": "numeral-cardinal-1-10-5-f-abs",
            "display": "חָמֵשׁ",
            "lemma": "חָמֵשׁ",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "five (f) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "חמש",
            "translit": "chamesh"
          },
          {
            "id": "numeral-cardinal-1-10-5-f-cstr",
            "display": "חֲמֵשׁ",
            "lemma": "חָמֵשׁ",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "five (f) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "חמש",
            "translit": "chamesh"
          },
          {
            "id": "numeral-cardinal-1-10-5-m-abs",
            "display": "חֲמִשָּׁה",
            "lemma": "חֲמִשָּׁה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "five (m) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "חמשה",
            "translit": "chamisha"
          },
          {
            "id": "numeral-cardinal-1-10-5-m-cstr",
            "display": "חֲמֵשֶׁת",
            "lemma": "חֲמִשָּׁה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "five (m) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "חמשת",
            "translit": "chameshet"
          },
          {
            "id": "numeral-cardinal-1-10-6-f",
            "display": "שֵׁשׁ",
            "lemma": "שֵׁשׁ",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              },
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "six (f)",
            "ambiguityNote": "Absolute and construct spelled identically.",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שש",
            "translit": "shesh"
          },
          {
            "id": "numeral-cardinal-1-10-6-m-abs",
            "display": "שִׁשָּׁה",
            "lemma": "שִׁשָּׁה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "six (m) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "ששה",
            "translit": "shisha"
          },
          {
            "id": "numeral-cardinal-1-10-6-m-cstr",
            "display": "שֵׁשֶׁת",
            "lemma": "שִׁשָּׁה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "six (m) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "ששת",
            "translit": "sheshet"
          },
          {
            "id": "numeral-cardinal-1-10-7-f-abs",
            "display": "שֶׁבַע",
            "lemma": "שֶׁבַע",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "seven (f) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שבע",
            "translit": "sheva"
          },
          {
            "id": "numeral-cardinal-1-10-7-f-cstr",
            "display": "שְׁבַע",
            "lemma": "שֶׁבַע",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "seven (f) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שבע",
            "translit": "sheva"
          },
          {
            "id": "numeral-cardinal-1-10-7-m-abs",
            "display": "שִׁבְעָה",
            "lemma": "שִׁבְעָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "seven (m) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שבעה",
            "translit": "shiv'a"
          },
          {
            "id": "numeral-cardinal-1-10-7-m-cstr",
            "display": "שִׁבְעַת",
            "lemma": "שִׁבְעָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "seven (m) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שבעת",
            "translit": "shiv'at"
          },
          {
            "id": "numeral-cardinal-1-10-8-f",
            "display": "שְׁמֹנֶה",
            "lemma": "שְׁמֹנֶה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              },
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "eight (f)",
            "ambiguityNote": "Absolute and construct spelled identically.",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שמנה",
            "translit": "shemone"
          },
          {
            "id": "numeral-cardinal-1-10-8-m-abs",
            "display": "שְׁמֹנָה",
            "lemma": "שְׁמֹנָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "eight (m) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שמנה",
            "translit": "shemona"
          },
          {
            "id": "numeral-cardinal-1-10-8-m-cstr",
            "display": "שְׁמֹנַת",
            "lemma": "שְׁמֹנָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "eight (m) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שמנת",
            "translit": "shemonat"
          },
          {
            "id": "numeral-cardinal-1-10-9-f-abs",
            "display": "תֵּשַׁע",
            "lemma": "תֵּשַׁע",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "nine (f) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "תשע",
            "translit": "tesha"
          },
          {
            "id": "numeral-cardinal-1-10-9-f-cstr",
            "display": "תְּשַׁע",
            "lemma": "תֵּשַׁע",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "nine (f) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "תשע",
            "translit": "tesha"
          },
          {
            "id": "numeral-cardinal-1-10-9-m-abs",
            "display": "תִּשְׁעָה",
            "lemma": "תִּשְׁעָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "nine (m) absolute",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "תשעה",
            "translit": "tish'a"
          },
          {
            "id": "numeral-cardinal-1-10-9-m-cstr",
            "display": "תִּשְׁעַת",
            "lemma": "תִּשְׁעָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "nine (m) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "תשעת",
            "translit": "tish'at"
          },
          {
            "id": "numeral-cardinal-1-10-10-f",
            "display": "עֶשֶׂר",
            "lemma": "עֶשֶׂר",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              },
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "ten (f); first printed as vocab in L29, formalized in the L45 numerals table",
            "ambiguityNote": "Absolute and construct spelled identically.",
            "source": {
              "lesson": 29,
              "page": 86
            },
            "compare": "עשר",
            "translit": "eser"
          },
          {
            "id": "numeral-cardinal-1-10-10-m-abs",
            "display": "עֲשָׂרָה",
            "lemma": "עֲשָׂרָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "ten (m) absolute; first printed as vocab in L29",
            "source": {
              "lesson": 29,
              "page": 86
            },
            "compare": "עשרה",
            "translit": "asara"
          },
          {
            "id": "numeral-cardinal-1-10-10-m-cstr",
            "display": "עֲשֶׂרֶת",
            "lemma": "עֲשָׂרָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "ten (m) construct",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "עשרת",
            "translit": "aseret"
          }
        ]
      },
      {
        "id": "verb-hifil-jussive",
        "category": "verb",
        "label": "Hifil Jussive vs. Imperfect",
        "introducedLesson": 29,
        "source": {
          "lesson": 39,
          "page": 109
        },
        "forms": [
          {
            "id": "verb-hifil-jussive-3ms-mlk",
            "display": "יַמְלֵךְ",
            "lemma": "הִמְלִיךְ",
            "root": "מלך",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "jussive",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "let him make (someone) king; 2nd/3rd-person Hifil Jussives can differ in the 2nd-syllable vowel from the Imperfect",
            "source": {
              "lesson": 39,
              "page": 109
            },
            "compare": "ימלך",
            "translit": "yamlekh"
          },
          {
            "id": "verb-hifil-impf-3ms-mlk",
            "display": "יַמְלִיךְ",
            "lemma": "הִמְלִיךְ",
            "root": "מלך",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he will make (someone) king (printed as contrast with the Jussive)",
            "source": {
              "lesson": 39,
              "page": 109
            },
            "compare": "ימליך",
            "translit": "yamlikh"
          },
          {
            "id": "verb-hifil-impf-3ms-pqd-appendix",
            "display": "יַפְקִיד",
            "lemma": "הִפְקִיד",
            "root": "פקד",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "additional model-root exemplar of the Hifil Imperfect pattern, from Appendix C.1b",
            "source": {
              "appendix": "C",
              "page": "a-18"
            },
            "compare": "יפקיד",
            "translit": "yafqid"
          }
        ]
      },
      {
        "id": "verb-hifil-recognition",
        "category": "verb",
        "label": "Hifil recognition forms (Perfect/Imperfect/Imperative)",
        "introducedLesson": 29,
        "source": {
          "lesson": 29,
          "page": 85
        },
        "forms": [
          {
            "id": "verb-hifil-recognition-perf-3ms-shlk",
            "display": "הִשְׁלִיךְ",
            "lemma": "הִשְׁלִיךְ",
            "root": "שלך",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he threw X; root not used in Qal or Piel",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "השליך",
            "translit": "hishlikh"
          },
          {
            "id": "verb-hifil-recognition-impf-3ms-shlk",
            "display": "יַשְׁלִיךְ",
            "lemma": "הִשְׁלִיךְ",
            "root": "שלך",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he will throw X",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "ישליך",
            "translit": "yashlikh"
          },
          {
            "id": "verb-hifil-recognition-impv-2ms-shlk",
            "display": "הַשְׁלֵךְ",
            "lemma": "הִשְׁלִיךְ",
            "root": "שלך",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "throw X! (footnote points to appendix C for a full Piel/Hifil paradigm)",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "השלך",
            "translit": "hashlekh"
          },
          {
            "id": "verb-hifil-recognition-perf-3ms-mlk",
            "display": "הִמְלִיךְ",
            "lemma": "הִמְלִיךְ",
            "root": "מלך",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he made (someone) king; cf. Qal מָלַךְ 'he was king'",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "המליך",
            "translit": "himlikh"
          },
          {
            "id": "verb-hifil-recognition-perf-3ms-kbd",
            "display": "הִכְבִּיד",
            "lemma": "הִכְבִּיד",
            "root": "כבד",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he made [someone] honored/heavy",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "הכביד",
            "translit": "hikhbid"
          },
          {
            "id": "verb-hifil-recognition-perf-3ms-shkm",
            "display": "הִשְׁכִּים",
            "lemma": "הִשְׁכִּים",
            "root": "שכם",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he rose early [in the morning]; root not used in Qal or Piel",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "השכים",
            "translit": "hishkim"
          },
          {
            "id": "verb-hifil-recognition-perf-3ms-tzlch",
            "display": "הִצְלִיחַ",
            "lemma": "הִצְלִיחַ",
            "root": "צלח",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "make successful, show experience",
            "source": {
              "lesson": 29,
              "page": 86
            },
            "compare": "הצליח",
            "translit": "hitslicha"
          },
          {
            "id": "verb-hifil-recognition-perf-3ms-shb",
            "display": "הִשְׁבִּיעַ",
            "lemma": "הִשְׁבִּיעַ",
            "root": "שבע",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "cause to swear an oath",
            "source": {
              "lesson": 29,
              "page": 86
            },
            "compare": "השביע",
            "translit": "hishbia"
          },
          {
            "id": "verb-hifil-recognition-perf-3ms-shcht",
            "display": "הִשְׁחִית",
            "lemma": "הִשְׁחִית",
            "root": "שחת",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "spoil, destroy (III-Weak root)",
            "source": {
              "lesson": 29,
              "page": 86
            },
            "compare": "השחית",
            "translit": "hishchit"
          },
          {
            "id": "verb-hifil-recognition-perf-3ms-bdl",
            "display": "הִבְדִּיל",
            "lemma": "הִבְדִּיל",
            "root": "בדל",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "divide, separate (new vocab in L42, reinforces Hifil recognition)",
            "source": {
              "lesson": 42,
              "page": 117
            },
            "compare": "הבדיל",
            "translit": "hivdil"
          }
        ]
      },
      {
        "id": "verb-piel-recognition",
        "category": "verb",
        "label": "Piel recognition forms (Perfect/Imperfect 3ms)",
        "introducedLesson": 29,
        "source": {
          "lesson": 29,
          "page": 85
        },
        "forms": [
          {
            "id": "verb-piel-recognition-perf-3ms-qbts",
            "display": "קִבֵּץ",
            "lemma": "קִבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "gather; dagesh in R2 marks Piel",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "קבץ",
            "translit": "qibbets"
          },
          {
            "id": "verb-piel-recognition-impf-3ms-qbts",
            "display": "יְקַבֵּץ",
            "lemma": "קִבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he will gather",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "יקבץ",
            "translit": "yeqabbets"
          },
          {
            "id": "verb-piel-recognition-perf-3ms-kbd",
            "display": "כִּבֵּד",
            "lemma": "כִּבֵּד",
            "root": "כבד",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he considered [someone] honored; cf. Qal כָּבֵד 'he was heavy'",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "כבד",
            "translit": "kibbed"
          },
          {
            "id": "verb-piel-recognition-perf-3ms-dbr",
            "display": "דִּבֶּר",
            "lemma": "דִּבֶּר",
            "root": "דבר",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he spoke; root not used in Qal",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "דבר",
            "translit": "dibber"
          },
          {
            "id": "verb-piel-recognition-perf-3ms-tswh",
            "display": "צִוָּה",
            "lemma": "צִוָּה",
            "root": "צוה",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he commanded; root not used in Qal",
            "source": {
              "lesson": 29,
              "page": 85
            },
            "compare": "צוה",
            "translit": "tsiva"
          },
          {
            "id": "verb-piel-recognition-perf-3ms-brk",
            "display": "בֵּרַךְ",
            "lemma": "בֵּרַךְ",
            "root": "ברך",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "bless; ר blocks the dagesh so no visible R2 doubling Textbook prints alternate spellings בֵּרֵךְ/בֵּרַךְ (tsere/patach).",
            "source": {
              "lesson": 29,
              "page": 86
            },
            "compare": "ברך",
            "translit": "berakh"
          },
          {
            "id": "verb-piel-recognition-perf-3ms-klh",
            "display": "כִּלָּה",
            "lemma": "כִּלָּה",
            "root": "כלה",
            "pos": "verb",
            "introducedLesson": 29,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "complete, finish (III-He root)",
            "source": {
              "lesson": 29,
              "page": 86
            },
            "compare": "כלה",
            "translit": "kila"
          }
        ]
      },
      {
        "id": "adjective-inflection",
        "category": "adjective",
        "label": "Adjective inflection: absolute/construct x masculine/feminine x singular/plural",
        "introducedLesson": 32,
        "source": {
          "lesson": 32,
          "page": 93
        },
        "forms": [
          {
            "id": "adjective-inflection-m-abs-sg",
            "display": "גָּדוֹל",
            "lemma": "גָּדוֹל",
            "root": null,
            "pos": "adjective",
            "introducedLesson": 32,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "great, big",
            "ambiguityNote": null,
            "source": {
              "lesson": 32,
              "page": 93
            },
            "compare": "גדול",
            "translit": "gadol"
          },
          {
            "id": "adjective-inflection-m-cst-sg",
            "display": "גְּדוֹל",
            "lemma": "גָּדוֹל",
            "root": null,
            "pos": "adjective",
            "introducedLesson": 32,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 32,
              "page": 93
            },
            "compare": "גדול",
            "translit": "gedol"
          },
          {
            "id": "adjective-inflection-m-abs-pl",
            "display": "גְּדוֹלִים",
            "lemma": "גָּדוֹל",
            "root": null,
            "pos": "adjective",
            "introducedLesson": 32,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 32,
              "page": 93
            },
            "compare": "גדולים",
            "translit": "gedolim"
          },
          {
            "id": "adjective-inflection-m-cst-pl",
            "display": "גְּדֹלֵי",
            "lemma": "גָּדוֹל",
            "root": null,
            "pos": "adjective",
            "introducedLesson": 32,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 32,
              "page": 93
            },
            "compare": "גדלי",
            "translit": "gedole"
          },
          {
            "id": "adjective-inflection-f-abs-sg",
            "display": "גְּדוֹלָה",
            "lemma": "גְּדוֹלָה",
            "root": null,
            "pos": "adjective",
            "introducedLesson": 32,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 32,
              "page": 93
            },
            "compare": "גדולה",
            "translit": "gedola"
          },
          {
            "id": "adjective-inflection-f-cst-sg",
            "display": "גְּדֹלַת",
            "lemma": "גְּדוֹלָה",
            "root": null,
            "pos": "adjective",
            "introducedLesson": 32,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 32,
              "page": 93
            },
            "compare": "גדלת",
            "translit": "gedolat"
          },
          {
            "id": "adjective-inflection-f-abs-pl",
            "display": "גְּדוֹלוֹת",
            "lemma": "גְּדוֹלָה",
            "root": null,
            "pos": "adjective",
            "introducedLesson": 32,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "lesson": 32,
              "page": 93
            },
            "compare": "גדולות",
            "translit": "gedolot"
          },
          {
            "id": "adjective-inflection-f-cst-pl",
            "display": "גְּדֹלוֹת",
            "lemma": "גְּדוֹלָה",
            "root": null,
            "pos": "adjective",
            "introducedLesson": 32,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "construct"
              }
            ],
            "note": "differs from the absolute plural only by a plene/defective vav; verify against source",
            "ambiguityNote": null,
            "source": {
              "lesson": 32,
              "page": 93
            },
            "compare": "גדלות",
            "translit": "gedolot"
          }
        ]
      },
      {
        "id": "pron-demonstrative",
        "category": "pronoun",
        "label": "Demonstrative pronouns: near/far x gender x number",
        "introducedLesson": 33,
        "source": {
          "lesson": 33,
          "page": 96
        },
        "forms": [
          {
            "id": "pron-demonstrative-near-ms",
            "display": "זֶה",
            "lemma": "זֶה",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 33,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "deixis": "near"
              }
            ],
            "note": "this",
            "ambiguityNote": null,
            "source": {
              "lesson": 33,
              "page": 96
            },
            "compare": "זה",
            "translit": "ze"
          },
          {
            "id": "pron-demonstrative-near-fs",
            "display": "זֹאת",
            "lemma": "זֹאת",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 33,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "deixis": "near"
              }
            ],
            "note": "this",
            "ambiguityNote": null,
            "source": {
              "lesson": 33,
              "page": 96
            },
            "compare": "זאת",
            "translit": "zot"
          },
          {
            "id": "pron-demonstrative-near-cp",
            "display": "אֵלֶּה",
            "lemma": "אֵלֶּה",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 33,
            "acceptedParses": [
              {
                "gender": "common",
                "number": "plural",
                "deixis": "near"
              }
            ],
            "note": "these; one common-gender plural form",
            "ambiguityNote": null,
            "source": {
              "lesson": 33,
              "page": 96
            },
            "compare": "אלה",
            "translit": "ele"
          },
          {
            "id": "pron-demonstrative-far-ms",
            "display": "הוּא",
            "lemma": "הוּא",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 33,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "deixis": "far"
              }
            ],
            "note": "that; identical to the 3ms independent pronoun (pron-subject-3ms)",
            "ambiguityNote": "same spelling as the 3ms subject pronoun; context (predicate position vs. modifying/substituting a noun) distinguishes the demonstrative use",
            "source": {
              "lesson": 33,
              "page": 96
            },
            "compare": "הוא",
            "translit": "hu"
          },
          {
            "id": "pron-demonstrative-far-fs",
            "display": "הִיא",
            "lemma": "הִיא",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 33,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "deixis": "far"
              }
            ],
            "note": "that; identical to the 3fs independent pronoun",
            "ambiguityNote": "same spelling as the 3fs subject pronoun; context distinguishes the demonstrative use",
            "source": {
              "lesson": 33,
              "page": 96
            },
            "compare": "היא",
            "translit": "hi"
          },
          {
            "id": "pron-demonstrative-far-mp",
            "display": "הֵמָּה",
            "lemma": "הֵמָּה",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 33,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "deixis": "far"
              }
            ],
            "note": "those",
            "ambiguityNote": null,
            "source": {
              "lesson": 33,
              "page": 96
            },
            "compare": "המה",
            "translit": "hemma"
          },
          {
            "id": "pron-demonstrative-far-fp",
            "display": "הֵנָּה",
            "lemma": "הֵנָּה",
            "root": null,
            "pos": "pronoun",
            "introducedLesson": 33,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "deixis": "far"
              }
            ],
            "note": "those",
            "ambiguityNote": null,
            "source": {
              "lesson": 33,
              "page": 96
            },
            "compare": "הנה",
            "translit": "henna"
          }
        ]
      },
      {
        "id": "noun-segolate",
        "category": "noun",
        "label": "Segolate noun pattern: first-syllable stress in the singular",
        "introducedLesson": 34,
        "source": {
          "lesson": 34,
          "page": 98
        },
        "forms": [
          {
            "id": "noun-segolate-melekh-sg",
            "display": "מֶלֶךְ",
            "lemma": "מֶלֶךְ",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "king",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "מלך",
            "translit": "melekh"
          },
          {
            "id": "noun-segolate-boker-sg",
            "display": "בֹּקֶר",
            "lemma": "בֹּקֶר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "morning",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "בקר",
            "translit": "boqer"
          },
          {
            "id": "noun-segolate-naar-sg",
            "display": "נַעַר",
            "lemma": "נַעַר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "young man",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "נער",
            "translit": "na'ar"
          },
          {
            "id": "noun-segolate-erets-sg",
            "display": "אֶרֶץ",
            "lemma": "אֶרֶץ",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "land",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "ארץ",
            "translit": "erets"
          },
          {
            "id": "noun-segolate-eved-sg",
            "display": "עֶבֶד",
            "lemma": "עֶבֶד",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "servant",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "עבד",
            "translit": "eved"
          },
          {
            "id": "noun-segolate-nefesh-sg",
            "display": "נֶפֶשׁ",
            "lemma": "נֶפֶשׁ",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "life, self",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "נפש",
            "translit": "nefesh"
          },
          {
            "id": "noun-segolate-malka-sg",
            "display": "מַלְכָּה",
            "lemma": "מַלְכָּה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "queen; fem. ־ָה ending shifts stress to the final syllable, unlike the plain segolate pattern",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "מלכה",
            "translit": "malka"
          },
          {
            "id": "noun-segolate-naara-sg",
            "display": "נַעֲרָה",
            "lemma": "נַעֲרָה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "young woman; same final-stress note as מַלְכָּה",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "נערה",
            "translit": "na'ara"
          },
          {
            "id": "noun-segolate-melekh-pl",
            "display": "מְלָכִים",
            "lemma": "מֶלֶךְ",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "kings",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "מלכים",
            "translit": "melakhim"
          },
          {
            "id": "noun-segolate-malka-pl",
            "display": "מְלָכוֹת",
            "lemma": "מַלְכָּה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "queens",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "מלכות",
            "translit": "melakhot"
          },
          {
            "id": "noun-segolate-naar-pl",
            "display": "נְעָרִים",
            "lemma": "נַעַר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "young men",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "נערים",
            "translit": "ne'arim"
          },
          {
            "id": "noun-segolate-naara-pl",
            "display": "נְעָרוֹת",
            "lemma": "נַעֲרָה",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "young women",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "נערות",
            "translit": "ne'arot"
          },
          {
            "id": "noun-segolate-eved-pl",
            "display": "עֲבָדִים",
            "lemma": "עֶבֶד",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "servants",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "עבדים",
            "translit": "avadim"
          },
          {
            "id": "noun-segolate-boker-pl",
            "display": "בְּקָרִים",
            "lemma": "בֹּקֶר",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "mornings",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "בקרים",
            "translit": "beqarim"
          },
          {
            "id": "noun-segolate-erets-pl",
            "display": "אֲרָצוֹת",
            "lemma": "אֶרֶץ",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "lands",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "ארצות",
            "translit": "aratsot"
          },
          {
            "id": "noun-segolate-nefesh-pl",
            "display": "נְפָשׁוֹת",
            "lemma": "נֶפֶשׁ",
            "root": null,
            "pos": "noun",
            "introducedLesson": 34,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural",
                "state": "absolute"
              }
            ],
            "note": "lives, souls",
            "ambiguityNote": null,
            "source": {
              "lesson": 34,
              "page": 98
            },
            "compare": "נפשות",
            "translit": "nefashot"
          }
        ]
      },
      {
        "id": "verb-past-narrative",
        "category": "verb",
        "label": "Past Narrative (Qal, שמר/היה)",
        "introducedLesson": 35,
        "source": {
          "lesson": 35,
          "page": 100
        },
        "forms": [
          {
            "id": "verb-past-narrative-3ms",
            "display": "וַיִּשְׁמֹר",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 35,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "past-narrative",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he guarded; vav-conjunction + dagesh forte distinguishes from Imperfect יִשְׁמֹר; triggers Verb-Subject word order",
            "ambiguityNote": null,
            "source": {
              "lesson": 35,
              "page": 100
            },
            "compare": "וישמר",
            "translit": "vayishmor"
          },
          {
            "id": "verb-past-narrative-1cs",
            "display": "וָאֶשְׁמֹר",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 35,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "past-narrative",
                "person": "1",
                "gender": "common",
                "number": "singular"
              }
            ],
            "note": "I guarded; dagesh is regularly absent in 1cs Past Narrative forms",
            "ambiguityNote": null,
            "source": {
              "lesson": 35,
              "page": 100
            },
            "compare": "ואשמר",
            "translit": "va'eshmor"
          },
          {
            "id": "verb-past-narrative-3ms-haya",
            "display": "וַיְהִי",
            "lemma": "הָיָה",
            "root": "היה",
            "pos": "verb",
            "introducedLesson": 36,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "past-narrative",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "extremely frequent; means \"was/became/came\" or simply marks the start of a narrative episode (often left untranslated as \"and it was\")",
            "ambiguityNote": null,
            "source": {
              "lesson": 36,
              "page": 102
            },
            "compare": "ויהי",
            "translit": "vayhi"
          }
        ]
      },
      {
        "id": "verb-hitpael-recognition",
        "category": "verb",
        "label": "Hitpael recognition forms (Perfect/Imperfect/Imperative)",
        "introducedLesson": 37,
        "source": {
          "lesson": 37,
          "page": 104
        },
        "forms": [
          {
            "id": "verb-hitpael-recognition-perf-3ms-qbts",
            "display": "הִתְקַבֵּץ",
            "lemma": "הִתְקַבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 37,
            "acceptedParses": [
              {
                "binyan": "hitpael",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he gathered together [with others]; הִת prefix, dagesh in R2",
            "ambiguityNote": "Spelled identically to the 2ms Imperative הִתְקַבֵּץ; context (subject vs. command) distinguishes.",
            "source": {
              "lesson": 37,
              "page": 104
            },
            "compare": "התקבץ",
            "translit": "hitqabbets"
          },
          {
            "id": "verb-hitpael-recognition-impv-2ms-qbts",
            "display": "הִתְקַבֵּץ",
            "lemma": "הִתְקַבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 37,
            "acceptedParses": [
              {
                "binyan": "hitpael",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "gather together [with others]!",
            "ambiguityNote": "Spelled identically to the 3ms Perfect; context distinguishes.",
            "source": {
              "lesson": 37,
              "page": 104
            },
            "compare": "התקבץ",
            "translit": "hitqabbets"
          },
          {
            "id": "verb-hitpael-recognition-impf-3ms-qbts",
            "display": "יִתְקַבֵּץ",
            "lemma": "הִתְקַבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 37,
            "acceptedParses": [
              {
                "binyan": "hitpael",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he will gather together [with others]; ת follows inflectional prefix",
            "source": {
              "lesson": 37,
              "page": 104
            },
            "compare": "יתקבץ",
            "translit": "yitqabbets"
          }
        ]
      },
      {
        "id": "verb-nifal-recognition",
        "category": "verb",
        "label": "Nifal recognition forms (Perfect/Imperfect/Imperative)",
        "introducedLesson": 37,
        "source": {
          "lesson": 37,
          "page": 104
        },
        "forms": [
          {
            "id": "verb-nifal-recognition-perf-3ms-shmr",
            "display": "נִשְׁמַר",
            "lemma": "נִשְׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 37,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he/it was guarded; נ prefix marks Nifal Perfect",
            "source": {
              "lesson": 37,
              "page": 104
            },
            "compare": "נשמר",
            "translit": "nishmar"
          },
          {
            "id": "verb-nifal-recognition-impf-3ms-shmr",
            "display": "יִשָּׁמֵר",
            "lemma": "נִשְׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 37,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he/it will be guarded; dagesh in R1 + hireq under prefix",
            "source": {
              "lesson": 37,
              "page": 104
            },
            "compare": "ישמר",
            "translit": "yishamer"
          },
          {
            "id": "verb-nifal-recognition-impv-2ms-shmr",
            "display": "הִשָּׁמֵר",
            "lemma": "נִשְׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 37,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "be guarded! (reflexive sense)",
            "source": {
              "lesson": 37,
              "page": 104
            },
            "compare": "השמר",
            "translit": "hishamer"
          },
          {
            "id": "verb-nifal-recognition-perf-3ms-rah",
            "display": "נִרְאָה",
            "lemma": "נִרְאָה",
            "root": "ראה",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "show oneself, appear (new vocab in L42)",
            "source": {
              "lesson": 42,
              "page": 117
            },
            "compare": "נראה",
            "translit": "nir'a"
          }
        ]
      },
      {
        "id": "verb-qal-stative",
        "category": "verb",
        "label": "Qal Stative Perfect/Imperfect (3ms sample forms)",
        "introducedLesson": 38,
        "source": {
          "lesson": 38,
          "page": 106
        },
        "forms": [
          {
            "id": "verb-qal-stative-perf-3ms-kaved",
            "display": "כָּבֵד",
            "lemma": "כָּבֵד",
            "root": "כבד",
            "pos": "verb",
            "introducedLesson": 38,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he is/was heavy; stative verbs use a different Perfect vowel pattern than dynamic שָׁמַר; this 3ms Perfect form is identical to the ms adjective כָּבֵד \"heavy\"",
            "ambiguityNote": null,
            "source": {
              "lesson": 38,
              "page": 106
            },
            "compare": "כבד",
            "translit": "kaved"
          },
          {
            "id": "verb-qal-stative-perf-3ms-qaton",
            "display": "קָטֹן",
            "lemma": "קָטֹן",
            "root": "קטן",
            "pos": "verb",
            "introducedLesson": 38,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he is/was small; second stative vowel-pattern variant shown alongside כָּבֵד",
            "ambiguityNote": null,
            "source": {
              "lesson": 38,
              "page": 106
            },
            "compare": "קטן",
            "translit": "qaton"
          },
          {
            "id": "verb-qal-stative-impf-3ms-kaved",
            "display": "יִכְבַּד",
            "lemma": "כָּבֵד",
            "root": "כבד",
            "pos": "verb",
            "introducedLesson": 38,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he will be heavy; stative Imperfect vowel pattern, contrast dynamic יִשְׁמֹר",
            "ambiguityNote": null,
            "source": {
              "lesson": 38,
              "page": 106
            },
            "compare": "יכבד",
            "translit": "yikhbad"
          },
          {
            "id": "verb-qal-stative-impf-3ms-qaton",
            "display": "יִקְטַן",
            "lemma": "קָטֹן",
            "root": "קטן",
            "pos": "verb",
            "introducedLesson": 38,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he will be small",
            "ambiguityNote": null,
            "source": {
              "lesson": 38,
              "page": 106
            },
            "compare": "יקטן",
            "translit": "yiqtan"
          }
        ]
      },
      {
        "id": "verb-hifil-imperative",
        "category": "verb",
        "label": "Hifil Imperative (reign, מלך)",
        "introducedLesson": 39,
        "source": {
          "lesson": 39,
          "page": 110
        },
        "forms": [
          {
            "id": "verb-hifil-imperative-2ms",
            "display": "הַמְלֵךְ",
            "lemma": "הִמְלִיךְ",
            "root": "מלך",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "המלך",
            "translit": "hamlekh"
          },
          {
            "id": "verb-hifil-imperative-2fs",
            "display": "הַמְלִיכִי",
            "lemma": "הִמְלִיךְ",
            "root": "מלך",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "imperative",
                "person": "2",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "המליכי",
            "translit": "hamlikhi"
          },
          {
            "id": "verb-hifil-imperative-2mp",
            "display": "הַמְלִיכוּ",
            "lemma": "הִמְלִיךְ",
            "root": "מלך",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "המליכו",
            "translit": "hamlikhu"
          },
          {
            "id": "verb-hifil-imperative-2fp",
            "display": "הַמְלֵכְנָה",
            "lemma": "הִמְלִיךְ",
            "root": "מלך",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "imperative",
                "person": "2",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "המלכנה",
            "translit": "hamlekhna"
          }
        ]
      },
      {
        "id": "verb-hitpael-imperative",
        "category": "verb",
        "label": "Hitpael Imperative (gather, קבץ)",
        "introducedLesson": 39,
        "source": {
          "lesson": 39,
          "page": 110
        },
        "forms": [
          {
            "id": "verb-hitpael-imperative-2ms",
            "display": "הִתְקַבֵּץ",
            "lemma": "הִתְקַבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "hitpael",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "התקבץ",
            "translit": "hitqabbets"
          },
          {
            "id": "verb-hitpael-imperative-2fs",
            "display": "הִתְקַבְּצִי",
            "lemma": "הִתְקַבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "hitpael",
                "conjugation": "imperative",
                "person": "2",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "התקבצי",
            "translit": "hitqabbtsi"
          },
          {
            "id": "verb-hitpael-imperative-2mp",
            "display": "הִתְקַבְּצוּ",
            "lemma": "הִתְקַבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "hitpael",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "התקבצו",
            "translit": "hitqabbtsu"
          },
          {
            "id": "verb-hitpael-imperative-2fp",
            "display": "הִתְקַבֵּצְנָה",
            "lemma": "הִתְקַבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "hitpael",
                "conjugation": "imperative",
                "person": "2",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "התקבצנה",
            "translit": "hitqabbetsna"
          }
        ]
      },
      {
        "id": "verb-nifal-imperative",
        "category": "verb",
        "label": "Nifal Imperative (guard, שמר)",
        "introducedLesson": 39,
        "source": {
          "lesson": 39,
          "page": 110
        },
        "forms": [
          {
            "id": "verb-nifal-imperative-2ms",
            "display": "הִשָּׁמֵר",
            "lemma": "נִשְׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "השמר",
            "translit": "hishamer"
          },
          {
            "id": "verb-nifal-imperative-2fs",
            "display": "הִשָּׁמְרִי",
            "lemma": "נִשְׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "imperative",
                "person": "2",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "השמרי",
            "translit": "hishamri"
          },
          {
            "id": "verb-nifal-imperative-2mp",
            "display": "הִשָּׁמְרוּ",
            "lemma": "נִשְׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "השמרו",
            "translit": "hishamru"
          },
          {
            "id": "verb-nifal-imperative-2fp",
            "display": "הִשָּׁמַרְנָה",
            "lemma": "נִשְׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "imperative",
                "person": "2",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "השמרנה",
            "translit": "hishamarna"
          }
        ]
      },
      {
        "id": "verb-piel-imperative",
        "category": "verb",
        "label": "Piel Imperative (gather, קבץ)",
        "introducedLesson": 39,
        "source": {
          "lesson": 39,
          "page": 110
        },
        "forms": [
          {
            "id": "verb-piel-imperative-2ms",
            "display": "קַבֵּץ",
            "lemma": "קִבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "קבץ",
            "translit": "qabbets"
          },
          {
            "id": "verb-piel-imperative-2fs",
            "display": "קַבְּצִי",
            "lemma": "קִבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "imperative",
                "person": "2",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "קבצי",
            "translit": "qabbtsi"
          },
          {
            "id": "verb-piel-imperative-2mp",
            "display": "קַבְּצוּ",
            "lemma": "קִבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "קבצו",
            "translit": "qabbtsu"
          },
          {
            "id": "verb-piel-imperative-2fp",
            "display": "קַבֵּצְנָה",
            "lemma": "קִבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "imperative",
                "person": "2",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": null,
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "קבצנה",
            "translit": "qabbetsna"
          }
        ]
      },
      {
        "id": "verb-qal-imperative",
        "category": "verb",
        "label": "Qal Imperative (guard, שמר)",
        "introducedLesson": 39,
        "source": {
          "lesson": 39,
          "page": 110
        },
        "forms": [
          {
            "id": "verb-qal-imperative-2ms",
            "display": "שְׁמֹר",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "guard! (ms)",
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "שמר",
            "translit": "shemor"
          },
          {
            "id": "verb-qal-imperative-2fs",
            "display": "שִׁמְרִי",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperative",
                "person": "2",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "guard! (fs)",
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "שמרי",
            "translit": "shimri"
          },
          {
            "id": "verb-qal-imperative-2mp",
            "display": "שִׁמְרוּ",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperative",
                "person": "2",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": "guard! (mp)",
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "שמרו",
            "translit": "shimru"
          },
          {
            "id": "verb-qal-imperative-2fp",
            "display": "שְׁמֹרְנָה",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperative",
                "person": "2",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": "guard! (fp)",
            "source": {
              "lesson": 39,
              "page": 110
            },
            "compare": "שמרנה",
            "translit": "shemorna"
          }
        ]
      },
      {
        "id": "verb-qal-jussive",
        "category": "verb",
        "label": "Qal Jussive / Cohortative",
        "introducedLesson": 39,
        "source": {
          "lesson": 39,
          "page": 109
        },
        "forms": [
          {
            "id": "verb-qal-jussive-coh-1cs-shmr",
            "display": "אֶשְׁמְרָה",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "jussive",
                "person": "1",
                "gender": "common",
                "number": "singular"
              }
            ],
            "note": "let me/I shall guard (Cohortative); 1st-person Jussives add ה- in all binyanim",
            "source": {
              "lesson": 39,
              "page": 109
            },
            "compare": "אשמרה",
            "translit": "eshmera"
          },
          {
            "id": "verb-qal-jussive-coh-1cp-shmr",
            "display": "נִשְׁמְרָה",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "jussive",
                "person": "1",
                "gender": "common",
                "number": "plural"
              }
            ],
            "note": "let us/we shall guard (Cohortative)",
            "source": {
              "lesson": 39,
              "page": 109
            },
            "compare": "נשמרה",
            "translit": "nishmera"
          },
          {
            "id": "verb-qal-jussive-3ms-qum",
            "display": "יָקֹם",
            "lemma": "קוּם",
            "root": "קום",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "jussive",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "let him stand up; hollow root shortens the theme vowel in the Jussive",
            "source": {
              "lesson": 39,
              "page": 109
            },
            "compare": "יקם",
            "translit": "yaqom"
          },
          {
            "id": "verb-qal-impf-3ms-qum",
            "display": "יָקוּם",
            "lemma": "קוּם",
            "root": "קום",
            "pos": "verb",
            "introducedLesson": 39,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "he will stand up (Imperfect, printed as contrast with the Jussive)",
            "source": {
              "lesson": 39,
              "page": 109
            },
            "compare": "יקום",
            "translit": "yaqum"
          }
        ]
      },
      {
        "id": "verb-attached-object-suffixes",
        "category": "particle",
        "label": "Attached pronoun object suffixes on verbs",
        "introducedLesson": 40,
        "source": {
          "lesson": 40,
          "page": 112
        },
        "forms": [
          {
            "id": "verb-attached-object-suffixes-3ms",
            "display": "הוּ- / וֹ-",
            "lemma": null,
            "root": null,
            "pos": "particle",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "him; two allomorphs depending on preceding consonant/vowel",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "הו- / ו-",
            "translit": "hu / vo"
          },
          {
            "id": "verb-attached-object-suffixes-3mp",
            "display": "ם-",
            "lemma": null,
            "root": null,
            "pos": "particle",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "them (m)",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "ם-",
            "translit": "m"
          },
          {
            "id": "verb-attached-object-suffixes-3fp",
            "display": "ן-",
            "lemma": null,
            "root": null,
            "pos": "particle",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "them (f)",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "ן-",
            "translit": "n"
          },
          {
            "id": "verb-attached-object-suffixes-2ms",
            "display": "ךָ-",
            "lemma": null,
            "root": null,
            "pos": "particle",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "you (ms)",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "ך-",
            "translit": "kha"
          },
          {
            "id": "verb-attached-object-suffixes-2fs",
            "display": "ךְ-",
            "lemma": null,
            "root": null,
            "pos": "particle",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "you (fs)",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "ך-",
            "translit": "khe"
          },
          {
            "id": "verb-attached-object-suffixes-2mp",
            "display": "כֶם-",
            "lemma": null,
            "root": null,
            "pos": "particle",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "you (mp)",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "כם-",
            "translit": "khem"
          },
          {
            "id": "verb-attached-object-suffixes-2fp",
            "display": "כֶן-",
            "lemma": null,
            "root": null,
            "pos": "particle",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "you (fp)",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "כן-",
            "translit": "khen"
          },
          {
            "id": "verb-attached-object-suffixes-1cs",
            "display": "נִי-",
            "lemma": null,
            "root": null,
            "pos": "particle",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                }
              }
            ],
            "note": "me",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "ני-",
            "translit": "ni"
          },
          {
            "id": "verb-attached-object-suffixes-1cp",
            "display": "נוּ-",
            "lemma": null,
            "root": null,
            "pos": "particle",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                }
              }
            ],
            "note": "us",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "נו-",
            "translit": "nu"
          }
        ]
      },
      {
        "id": "verb-attached-qal-example",
        "category": "verb",
        "label": "Qal verb + attached object pronoun (example forms)",
        "introducedLesson": 40,
        "source": {
          "lesson": 40,
          "page": 112
        },
        "forms": [
          {
            "id": "verb-attached-qal-example-perf-3ms-3ms-shmr",
            "display": "שָׁמְרוֹ",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "perfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular",
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "= שָׁמַר אוֹתוֹ 'he guarded him'; Perfect+suffix uses an a-class linking vowel",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "שמרו",
            "translit": "shamro"
          },
          {
            "id": "verb-attached-qal-example-impf-3ms-3ms-shmr-a",
            "display": "יִשְׁמְרֵהוּ",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular",
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "= יִשְׁמֹר אוֹתוֹ 'he will guard him' (variant 1)",
            "ambiguityNote": "Two variant spellings printed for the same meaning; Imperfect+suffix uses an i-class linking vowel.",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "ישמרהו",
            "translit": "yishmerehu"
          },
          {
            "id": "verb-attached-qal-example-impf-3ms-3ms-shmr-b",
            "display": "יִשְׁמְרֶנּוּ",
            "lemma": "שָׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 40,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "imperfect",
                "person": "3",
                "gender": "masculine",
                "number": "singular",
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "= יִשְׁמֹר אוֹתוֹ 'he will guard him' (variant 2, energic-nun form)",
            "ambiguityNote": "Two variant spellings printed for the same meaning.",
            "source": {
              "lesson": 40,
              "page": 112
            },
            "compare": "ישמרנו",
            "translit": "yishmerennu"
          }
        ]
      },
      {
        "id": "verb-hifil-participle",
        "category": "verb",
        "label": "Hifil Participle (ms recognition)",
        "introducedLesson": 42,
        "source": {
          "lesson": 42,
          "page": 116
        },
        "forms": [
          {
            "id": "verb-hifil-participle-ms-mlk",
            "display": "מַמְלִיךְ",
            "lemma": "הִמְלִיךְ",
            "root": "מלך",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "ms participle; מ prefix, same vowel pattern as 3ms Imperfect יַמְלִיךְ",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "ממליך",
            "translit": "mamlikh"
          },
          {
            "id": "verb-hifil-participle-ms-pqd-appendix",
            "display": "מַפְקִיד",
            "lemma": "הִפְקִיד",
            "root": "פקד",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "additional model-root exemplar, from Appendix C.1b",
            "source": {
              "appendix": "C",
              "page": "a-18"
            },
            "compare": "מפקיד",
            "translit": "mafqid"
          }
        ]
      },
      {
        "id": "verb-hitpael-participle",
        "category": "verb",
        "label": "Hitpael Participle (ms recognition)",
        "introducedLesson": 42,
        "source": {
          "lesson": 42,
          "page": 116
        },
        "forms": [
          {
            "id": "verb-hitpael-participle-ms-qbts",
            "display": "מִתְקַבֵּץ",
            "lemma": "הִתְקַבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "hitpael",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "ms participle; מ prefix, same vowel pattern as 3ms Imperfect יִתְקַבֵּץ",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "מתקבץ",
            "translit": "mitqabbets"
          }
        ]
      },
      {
        "id": "verb-nifal-participle",
        "category": "verb",
        "label": "Nifal Participle (ms recognition)",
        "introducedLesson": 42,
        "source": {
          "lesson": 42,
          "page": 116
        },
        "forms": [
          {
            "id": "verb-nifal-participle-ms-shmr",
            "display": "נִשְׁמָר",
            "lemma": "נִשְׁמַר",
            "root": "שמר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "ms participle; קמץ in 2nd syllable vs. patach in the 3ms Perfect נִשְׁמַר",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "נשמר",
            "translit": "nishmar"
          }
        ]
      },
      {
        "id": "verb-piel-participle",
        "category": "verb",
        "label": "Piel Participle (ms recognition)",
        "introducedLesson": 42,
        "source": {
          "lesson": 42,
          "page": 116
        },
        "forms": [
          {
            "id": "verb-piel-participle-ms-qbts",
            "display": "מְקַבֵּץ",
            "lemma": "קִבֵּץ",
            "root": "קבץ",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "ms participle; מ prefix, same vowel pattern as 3ms Imperfect יְקַבֵּץ",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "מקבץ",
            "translit": "meqabbets"
          },
          {
            "id": "verb-piel-participle-ms-pqd-appendix",
            "display": "מְפַקֵּד",
            "lemma": "פִּקֵּד",
            "root": "פקד",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "additional model-root exemplar, from Appendix C.1b",
            "source": {
              "appendix": "C",
              "page": "a-17"
            },
            "compare": "מפקד",
            "translit": "mefaqed"
          }
        ]
      },
      {
        "id": "verb-qal-participle",
        "category": "verb",
        "label": "Qal Active and Passive Participle",
        "introducedLesson": 42,
        "source": {
          "lesson": 42,
          "page": 116
        },
        "forms": [
          {
            "id": "verb-qal-participle-act-ms-abs",
            "display": "אֹמֵר",
            "lemma": "אָמַר",
            "root": "אמר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "active participle 'saying'; absolute state (table also gives a construct column, not encodable as a verb feature here)",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "אמר",
            "translit": "omer"
          },
          {
            "id": "verb-qal-participle-act-ms-cstr",
            "display": "אֹמַר",
            "lemma": "אָמַר",
            "root": "אמר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "active participle, construct-state form (נִסְמָךְ column)",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "אמר",
            "translit": "omar"
          },
          {
            "id": "verb-qal-participle-act-fs-abs",
            "display": "אֹמֶרֶת / אֹמְרָה",
            "lemma": "אָמַר",
            "root": "אמר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "two legitimate fs absolute participle forms",
            "ambiguityNote": "Both forms printed side by side as equally valid fs participle spellings.",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "אמרת / אמרה",
            "translit": "omeret / omra"
          },
          {
            "id": "verb-qal-participle-act-fs-cstr",
            "display": "אֹמֶרֶת / אֹמְרַת",
            "lemma": "אָמַר",
            "root": "אמר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "two fs construct-state participle forms",
            "ambiguityNote": "Both forms printed side by side.",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "אמרת / אמרת",
            "translit": "omeret / omrat"
          },
          {
            "id": "verb-qal-participle-act-mp-abs",
            "display": "אֹמְרִים",
            "lemma": "אָמַר",
            "root": "אמר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": "mp absolute",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "אמרים",
            "translit": "omrim"
          },
          {
            "id": "verb-qal-participle-act-mp-cstr",
            "display": "אֹמְרֵי",
            "lemma": "אָמַר",
            "root": "אמר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": "mp construct",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "אמרי",
            "translit": "omre"
          },
          {
            "id": "verb-qal-participle-act-fp",
            "display": "אֹמְרוֹת",
            "lemma": "אָמַר",
            "root": "אמר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": "fp; absolute and construct are spelled the same",
            "source": {
              "lesson": 42,
              "page": 116
            },
            "compare": "אמרות",
            "translit": "omrot"
          },
          {
            "id": "verb-qal-participle-pass-ms-abscstr",
            "display": "אָרוּר",
            "lemma": "אָרוּר",
            "root": "ארר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "passive participle 'cursed'; absolute and construct spelled the same for ms",
            "source": {
              "lesson": 42,
              "page": 117
            },
            "compare": "ארור",
            "translit": "arur"
          },
          {
            "id": "verb-qal-participle-pass-fs-abs",
            "display": "אֲרוּרָה",
            "lemma": "אָרוּר",
            "root": "ארר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "fs absolute passive participle",
            "source": {
              "lesson": 42,
              "page": 117
            },
            "compare": "ארורה",
            "translit": "arura"
          },
          {
            "id": "verb-qal-participle-pass-fs-cstr",
            "display": "אֲרוּרַת",
            "lemma": "אָרוּר",
            "root": "ארר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "fs construct passive participle",
            "source": {
              "lesson": 42,
              "page": 117
            },
            "compare": "ארורת",
            "translit": "arurat"
          },
          {
            "id": "verb-qal-participle-pass-mp-abs",
            "display": "אֲרוּרִים",
            "lemma": "אָרוּר",
            "root": "ארר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": "mp absolute",
            "source": {
              "lesson": 42,
              "page": 117
            },
            "compare": "ארורים",
            "translit": "arurim"
          },
          {
            "id": "verb-qal-participle-pass-mp-cstr",
            "display": "אֲרוּרֵי",
            "lemma": "אָרוּר",
            "root": "ארר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": "mp construct",
            "source": {
              "lesson": 42,
              "page": 117
            },
            "compare": "ארורי",
            "translit": "arure"
          },
          {
            "id": "verb-qal-participle-pass-fp",
            "display": "אֲרוּרוֹת",
            "lemma": "אָרוּר",
            "root": "ארר",
            "pos": "verb",
            "introducedLesson": 42,
            "acceptedParses": [
              {
                "binyan": "qal",
                "conjugation": "participle",
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": "fp; absolute and construct spelled the same",
            "source": {
              "lesson": 42,
              "page": 117
            },
            "compare": "ארורות",
            "translit": "arurot"
          }
        ]
      },
      {
        "id": "numeral-11-19",
        "category": "numeral",
        "label": "Teens (11-19) and their formation",
        "introducedLesson": 45,
        "source": {
          "lesson": 45,
          "page": 126
        },
        "forms": [
          {
            "id": "numeral-11-19-11-a",
            "display": "אַחַד עָשָׂר",
            "lemma": "אַחַד עָשָׂר",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "eleven, form 1 of 2 alternates (units digit + עָשָׂר/עֶשְׂרֵה, agreeing in gender with the noun)",
            "ambiguityNote": "Book gives two alternate forms for 11 and 12.",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "אחד עשר",
            "translit": "achad asar"
          },
          {
            "id": "numeral-11-19-11-b",
            "display": "עַשְׁתֵּי עָשָׂר",
            "lemma": "עַשְׁתֵּי עָשָׂר",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "eleven, alternate form 2",
            "ambiguityNote": "Book gives two alternate forms for 11 and 12.",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "עשתי עשר",
            "translit": "ashte asar"
          },
          {
            "id": "numeral-11-19-12-a",
            "display": "שְׁנֵים עָשָׂר",
            "lemma": "שְׁנֵים עָשָׂר",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "twelve, form 1 (matches the standalone 'twelve' vocab entry שְׁנֵים עָשָׂר on p.126)",
            "ambiguityNote": "Book gives two alternate forms for 11 and 12.",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "שנים עשר",
            "translit": "shenem asar"
          },
          {
            "id": "numeral-11-19-12-b",
            "display": "שְׁנֵי עָשָׂר",
            "lemma": "שְׁנֵי עָשָׂר",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "twelve, alternate form 2",
            "ambiguityNote": "Book gives two alternate forms for 11 and 12.",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "שני עשר",
            "translit": "shene asar"
          }
        ]
      },
      {
        "id": "numeral-hundreds",
        "category": "numeral",
        "label": "Hundreds (100/200/300 and the base forms of 100)",
        "introducedLesson": 45,
        "source": {
          "lesson": 45,
          "page": 126
        },
        "forms": [
          {
            "id": "numeral-hundreds-100-fs-abs",
            "display": "מֵאָה",
            "lemma": "מֵאָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "absolute"
              }
            ],
            "note": "hundred, fs absolute base form",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "מאה",
            "translit": "me'a"
          },
          {
            "id": "numeral-hundreds-100-fs-cstr",
            "display": "מְאַת",
            "lemma": "מֵאָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular",
                "state": "construct"
              }
            ],
            "note": "hundred, fs construct base form (book labels this 'FS NIS' = construct)",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "מאת",
            "translit": "me'at"
          },
          {
            "id": "numeral-hundreds-100-p",
            "display": "מֵאוֹת",
            "lemma": "מֵאָה",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": "hundreds, plural base form used in 300+",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "מאות",
            "translit": "meot"
          },
          {
            "id": "numeral-hundreds-200",
            "display": "מָאתַיִם",
            "lemma": "מָאתַיִם",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "dual"
              }
            ],
            "note": "two hundred, dual form of מֵאָה",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "מאתים",
            "translit": "matayim"
          },
          {
            "id": "numeral-hundreds-300",
            "display": "שְׁלֹשׁ־מֵאוֹת",
            "lemma": "שְׁלֹשׁ־מֵאוֹת",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "plural"
              }
            ],
            "note": "three hundred = cardinal 3 (f) + plural מֵאוֹת, 'and so forth' for higher hundreds",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "שלש־מאות",
            "translit": "shelosh-meot"
          }
        ]
      },
      {
        "id": "numeral-ordinal-1-10",
        "category": "numeral",
        "label": "Ordinal numbers 1st-10th",
        "introducedLesson": 45,
        "source": {
          "lesson": 45,
          "page": 125
        },
        "forms": [
          {
            "id": "numeral-ordinal-1-10-1-m",
            "display": "רִאשׁוֹן",
            "lemma": "רִאשׁוֹן",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "1st (m)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "ראשון",
            "translit": "rishon"
          },
          {
            "id": "numeral-ordinal-1-10-1-f",
            "display": "רִאשׁוֹנָה",
            "lemma": "רִאשׁוֹן",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "1st (f)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "ראשונה",
            "translit": "rishona"
          },
          {
            "id": "numeral-ordinal-1-10-2-m",
            "display": "שֵׁנִי",
            "lemma": "שֵׁנִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "2nd (m)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שני",
            "translit": "sheni"
          },
          {
            "id": "numeral-ordinal-1-10-2-f",
            "display": "שֵׁנִית",
            "lemma": "שֵׁנִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "2nd (f)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שנית",
            "translit": "shenit"
          },
          {
            "id": "numeral-ordinal-1-10-3-m",
            "display": "שְׁלִישִׁי",
            "lemma": "שְׁלִישִׁי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "3rd (m)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שלישי",
            "translit": "shelishi"
          },
          {
            "id": "numeral-ordinal-1-10-3-f",
            "display": "שְׁלִישִׁית",
            "lemma": "שְׁלִישִׁי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "3rd (f)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שלישית",
            "translit": "shelishit"
          },
          {
            "id": "numeral-ordinal-1-10-4-m",
            "display": "רְבִיעִי",
            "lemma": "רְבִיעִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "4th (m)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "רביעי",
            "translit": "revi'i"
          },
          {
            "id": "numeral-ordinal-1-10-4-f",
            "display": "רְבִיעִית",
            "lemma": "רְבִיעִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "4th (f)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "רביעית",
            "translit": "revi'it"
          },
          {
            "id": "numeral-ordinal-1-10-5-m",
            "display": "חֲמִישִׁי",
            "lemma": "חֲמִישִׁי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "5th (m)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "חמישי",
            "translit": "chamishi"
          },
          {
            "id": "numeral-ordinal-1-10-5-f",
            "display": "חֲמִישִׁית",
            "lemma": "חֲמִישִׁי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "5th (f)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "חמישית",
            "translit": "chamishit"
          },
          {
            "id": "numeral-ordinal-1-10-6-m",
            "display": "שִׁשִּׁי",
            "lemma": "שִׁשִּׁי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "6th (m)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "ששי",
            "translit": "shishi"
          },
          {
            "id": "numeral-ordinal-1-10-6-f",
            "display": "שִׁשִּׁית",
            "lemma": "שִׁשִּׁי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "6th (f)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "ששית",
            "translit": "shishit"
          },
          {
            "id": "numeral-ordinal-1-10-7-m",
            "display": "שְׁבִיעִי",
            "lemma": "שְׁבִיעִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "7th (m)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שביעי",
            "translit": "shevi'i"
          },
          {
            "id": "numeral-ordinal-1-10-7-f",
            "display": "שְׁבִיעִית",
            "lemma": "שְׁבִיעִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "7th (f)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שביעית",
            "translit": "shevi'it"
          },
          {
            "id": "numeral-ordinal-1-10-8-m",
            "display": "שְׁמִינִי",
            "lemma": "שְׁמִינִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "8th (m)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שמיני",
            "translit": "shemini"
          },
          {
            "id": "numeral-ordinal-1-10-8-f",
            "display": "שְׁמִינִית",
            "lemma": "שְׁמִינִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "8th (f)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "שמינית",
            "translit": "sheminit"
          },
          {
            "id": "numeral-ordinal-1-10-9-m",
            "display": "תְּשִׁיעִי",
            "lemma": "תְּשִׁיעִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "9th (m)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "תשיעי",
            "translit": "teshi'i"
          },
          {
            "id": "numeral-ordinal-1-10-9-f",
            "display": "תְּשִׁיעִית",
            "lemma": "תְּשִׁיעִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "9th (f)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "תשיעית",
            "translit": "teshi'it"
          },
          {
            "id": "numeral-ordinal-1-10-10-m",
            "display": "עֲשִׂירִי",
            "lemma": "עֲשִׂירִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "10th (m)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "עשירי",
            "translit": "asiri"
          },
          {
            "id": "numeral-ordinal-1-10-10-f",
            "display": "עֲשִׂירִית",
            "lemma": "עֲשִׂירִי",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "gender": "feminine",
                "number": "singular"
              }
            ],
            "note": "10th (f)",
            "source": {
              "lesson": 45,
              "page": 125
            },
            "compare": "עשירית",
            "translit": "asirit"
          }
        ]
      },
      {
        "id": "numeral-tens",
        "category": "numeral",
        "label": "Tens (multiples of 10, printed examples)",
        "introducedLesson": 45,
        "source": {
          "lesson": 45,
          "page": 126
        },
        "forms": [
          {
            "id": "numeral-tens-20",
            "display": "עֶשְׂרִים",
            "lemma": "עֶשְׂרִים",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "number": "plural"
              }
            ],
            "note": "twenty; tens are formed as the plural of the corresponding units digit (2=20)",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "עשרים",
            "translit": "esrim"
          },
          {
            "id": "numeral-tens-31",
            "display": "שְׁלוֹשִׁים וְאֶחָד",
            "lemma": "שְׁלוֹשִׁים וְאֶחָד",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "number": "plural"
              }
            ],
            "note": "thirty-one; single integers conjoined to the tens with וְ",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "שלושים ואחד",
            "translit": "sheloshim ve'echad"
          },
          {
            "id": "numeral-tens-45",
            "display": "אַרְבָּעִים וְחָמֵשׁ",
            "lemma": "אַרְבָּעִים וְחָמֵשׁ",
            "root": null,
            "pos": "numeral",
            "introducedLesson": 45,
            "acceptedParses": [
              {
                "number": "plural"
              }
            ],
            "note": "forty-five",
            "source": {
              "lesson": 45,
              "page": 126
            },
            "compare": "ארבעים וחמש",
            "translit": "arba'im vechamesh"
          }
        ]
      },
      {
        "id": "particle-object-marker",
        "category": "particle",
        "label": "Direct object marker אֵת/אוֹת with attached pronouns",
        "source": {
          "appendix": "B",
          "page": "a-13"
        },
        "note": "All forms appendixOnly: no lesson in the TOC prints this suffix paradigm as a table (see uncertainties re: possible L31 tie).",
        "forms": [
          {
            "id": "particle-object-marker-sfx3ms",
            "display": "אוֹתוֹ",
            "lemma": "אֵת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "direct-object marker אֵת/אֶת with attached pronoun (accusative 'him/her/you/me/etc.')",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "אותו",
            "translit": "oto"
          },
          {
            "id": "particle-object-marker-sfx3fs",
            "display": "אֹתָהּ",
            "lemma": "אֵת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "direct-object marker אֵת/אֶת with attached pronoun (accusative 'him/her/you/me/etc.')",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "אתה",
            "translit": "otah"
          },
          {
            "id": "particle-object-marker-sfx2ms",
            "display": "אֹתְךָ",
            "lemma": "אֵת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "direct-object marker אֵת/אֶת with attached pronoun (accusative 'him/her/you/me/etc.')",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "אתך",
            "translit": "otkha"
          },
          {
            "id": "particle-object-marker-sfx2fs",
            "display": "אֹתָךְ",
            "lemma": "אֵת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "direct-object marker אֵת/אֶת with attached pronoun (accusative 'him/her/you/me/etc.')",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "אתך",
            "translit": "otakh"
          },
          {
            "id": "particle-object-marker-sfx1cs",
            "display": "אֹתִי",
            "lemma": "אֵת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                }
              }
            ],
            "note": "direct-object marker אֵת/אֶת with attached pronoun (accusative 'him/her/you/me/etc.')",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "אתי",
            "translit": "oti"
          },
          {
            "id": "particle-object-marker-sfx3mp",
            "display": "אוֹתָם",
            "lemma": "אֵת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "direct-object marker אֵת/אֶת with attached pronoun (accusative 'him/her/you/me/etc.')",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אותם",
            "translit": "otam"
          },
          {
            "id": "particle-object-marker-sfx3fp",
            "display": "אֶתְהֶן",
            "lemma": "אֵת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "direct-object marker אֵת/אֶת with attached pronoun (accusative 'him/her/you/me/etc.')",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אתהן",
            "translit": "ethen"
          },
          {
            "id": "particle-object-marker-sfx2mp",
            "display": "אֶתְכֶם",
            "lemma": "אֵת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "direct-object marker אֵת/אֶת with attached pronoun (accusative 'him/her/you/me/etc.')",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אתכם",
            "translit": "etkhem"
          },
          {
            "id": "particle-object-marker-sfx2fp",
            "display": "אֶתְכֶן",
            "lemma": "אֵת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "direct-object marker אֵת/אֶת with attached pronoun (accusative 'him/her/you/me/etc.')",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אתכן",
            "translit": "etkhen"
          },
          {
            "id": "particle-object-marker-sfx1cp",
            "display": "אוֹתָנוּ",
            "lemma": "אֵת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                }
              }
            ],
            "note": "direct-object marker אֵת/אֶת with attached pronoun (accusative 'him/her/you/me/etc.')",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אותנו",
            "translit": "otanu"
          }
        ]
      },
      {
        "id": "particle-prep-attached-ad",
        "category": "particle",
        "label": "Preposition עַד ('until/as far as') with attached pronouns",
        "source": {
          "appendix": "B",
          "page": "a-14"
        },
        "note": "appendixOnly: no lesson in the TOC prints this suffix paradigm as a table; L22 (p.68) only notes in prose that these prepositions take the plural-noun suffix set.",
        "forms": [
          {
            "id": "particle-prep-attached-ad-sfx3ms",
            "display": "עָדָיו",
            "lemma": "עַד",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'until/as far as' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עדיו",
            "translit": "adayv"
          },
          {
            "id": "particle-prep-attached-ad-sfx3fs",
            "display": "עָדֶיהָ",
            "lemma": "עַד",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'until/as far as' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עדיה",
            "translit": "adeha"
          },
          {
            "id": "particle-prep-attached-ad-sfx2ms",
            "display": "עָדֶיךָ",
            "lemma": "עַד",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'until/as far as' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עדיך",
            "translit": "adekha"
          },
          {
            "id": "particle-prep-attached-ad-sfx2fs",
            "display": "עָדַיִךְ",
            "lemma": "עַד",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'until/as far as' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עדיך",
            "translit": "adayikh"
          },
          {
            "id": "particle-prep-attached-ad-sfx1cs",
            "display": "עָדַי",
            "lemma": "עַד",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'until/as far as' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עדי",
            "translit": "aday"
          },
          {
            "id": "particle-prep-attached-ad-sfx3mp",
            "display": "עֲדֵיהֶם",
            "lemma": "עַד",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'until/as far as' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עדיהם",
            "translit": "adehem"
          },
          {
            "id": "particle-prep-attached-ad-sfx3fp",
            "display": "עֲדֵיהֶן",
            "lemma": "עַד",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'until/as far as' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עדיהן",
            "translit": "adehen"
          },
          {
            "id": "particle-prep-attached-ad-sfx2mp",
            "display": "עֲדֵיכֶם",
            "lemma": "עַד",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'until/as far as' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עדיכם",
            "translit": "adekhem"
          },
          {
            "id": "particle-prep-attached-ad-sfx2fp",
            "display": "עֲדֵיכֶן",
            "lemma": "עַד",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'until/as far as' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עדיכן",
            "translit": "adekhen"
          },
          {
            "id": "particle-prep-attached-ad-sfx1cp",
            "display": "עָדֵינוּ",
            "lemma": "עַד",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'until/as far as' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עדינו",
            "translit": "adenu"
          }
        ]
      },
      {
        "id": "particle-prep-attached-al",
        "category": "particle",
        "label": "Preposition עַל ('upon/on') with attached pronouns",
        "source": {
          "appendix": "B",
          "page": "a-14"
        },
        "note": "appendixOnly: no lesson in the TOC prints this suffix paradigm as a table; L22 (p.68) only notes in prose that these prepositions take the plural-noun suffix set.",
        "forms": [
          {
            "id": "particle-prep-attached-al-sfx3ms",
            "display": "עָלָיו",
            "lemma": "עַל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'upon/on' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עליו",
            "translit": "alayv"
          },
          {
            "id": "particle-prep-attached-al-sfx3fs",
            "display": "עָלֶיהָ",
            "lemma": "עַל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'upon/on' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עליה",
            "translit": "aleha"
          },
          {
            "id": "particle-prep-attached-al-sfx2ms",
            "display": "עָלֶיךָ",
            "lemma": "עַל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'upon/on' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עליך",
            "translit": "alekha"
          },
          {
            "id": "particle-prep-attached-al-sfx2fs",
            "display": "עָלַיִךְ",
            "lemma": "עַל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'upon/on' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עליך",
            "translit": "alayikh"
          },
          {
            "id": "particle-prep-attached-al-sfx1cs",
            "display": "עָלַי",
            "lemma": "עַל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'upon/on' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עלי",
            "translit": "alay"
          },
          {
            "id": "particle-prep-attached-al-sfx3mp",
            "display": "עֲלֵיהֶם",
            "lemma": "עַל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'upon/on' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עליהם",
            "translit": "alehem"
          },
          {
            "id": "particle-prep-attached-al-sfx3fp",
            "display": "עֲלֵיהֶן",
            "lemma": "עַל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'upon/on' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עליהן",
            "translit": "alehen"
          },
          {
            "id": "particle-prep-attached-al-sfx2mp",
            "display": "עֲלֵיכֶם",
            "lemma": "עַל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'upon/on' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עליכם",
            "translit": "alekhem"
          },
          {
            "id": "particle-prep-attached-al-sfx2fp",
            "display": "עֲלֵיכֶן",
            "lemma": "עַל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'upon/on' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עליכן",
            "translit": "alekhen"
          },
          {
            "id": "particle-prep-attached-al-sfx1cp",
            "display": "עָלֵינוּ",
            "lemma": "עַל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'upon/on' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "עלינו",
            "translit": "alenu"
          }
        ]
      },
      {
        "id": "particle-prep-attached-el",
        "category": "particle",
        "label": "Preposition אֶל ('to/toward') with attached pronouns",
        "source": {
          "appendix": "B",
          "page": "a-14"
        },
        "note": "appendixOnly: no lesson in the TOC prints this suffix paradigm as a table; L22 (p.68) only notes in prose that these prepositions take the plural-noun suffix set.",
        "forms": [
          {
            "id": "particle-prep-attached-el-sfx3ms",
            "display": "אֵלָיו",
            "lemma": "אֶל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'to/toward' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אליו",
            "translit": "elayv"
          },
          {
            "id": "particle-prep-attached-el-sfx3fs",
            "display": "אֵלֶיהָ",
            "lemma": "אֶל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'to/toward' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אליה",
            "translit": "eleha"
          },
          {
            "id": "particle-prep-attached-el-sfx2ms",
            "display": "אֵלֶיךָ",
            "lemma": "אֶל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'to/toward' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אליך",
            "translit": "elekha"
          },
          {
            "id": "particle-prep-attached-el-sfx2fs",
            "display": "אֵלַיִךְ",
            "lemma": "אֶל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'to/toward' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אליך",
            "translit": "elayikh"
          },
          {
            "id": "particle-prep-attached-el-sfx1cs",
            "display": "אֵלַי",
            "lemma": "אֶל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'to/toward' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אלי",
            "translit": "elay"
          },
          {
            "id": "particle-prep-attached-el-sfx3mp",
            "display": "אֲלֵיהֶם",
            "lemma": "אֶל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'to/toward' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אליהם",
            "translit": "alehem"
          },
          {
            "id": "particle-prep-attached-el-sfx3fp",
            "display": "אֲלֵיהֶן",
            "lemma": "אֶל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'to/toward' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אליהן",
            "translit": "alehen"
          },
          {
            "id": "particle-prep-attached-el-sfx2mp",
            "display": "אֲלֵיכֶם",
            "lemma": "אֶל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'to/toward' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אליכם",
            "translit": "alekhem"
          },
          {
            "id": "particle-prep-attached-el-sfx2fp",
            "display": "אֲלֵיכֶן",
            "lemma": "אֶל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'to/toward' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אליכן",
            "translit": "alekhen"
          },
          {
            "id": "particle-prep-attached-el-sfx1cp",
            "display": "אֵלֵינוּ",
            "lemma": "אֶל",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'to/toward' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "אלינו",
            "translit": "elenu"
          }
        ]
      },
      {
        "id": "particle-prep-attached-kmo",
        "category": "particle",
        "label": "כְּמוֹ/כְּ (like, as) + attached pronoun",
        "source": {
          "appendix": "B",
          "page": "a-13"
        },
        "forms": [
          {
            "id": "particle-prep-attached-kmo-3ms",
            "display": "כָּמֹהוּ",
            "lemma": "כְּמוֹ",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "like him/it",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "כמהו",
            "translit": "kamohu"
          },
          {
            "id": "particle-prep-attached-kmo-3fs",
            "display": "כָּמוֹהָ",
            "lemma": "כְּמוֹ",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "כמוה",
            "translit": "kamoha"
          },
          {
            "id": "particle-prep-attached-kmo-2ms",
            "display": "כָּמוֹךָ",
            "lemma": "כְּמוֹ",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "כמוך",
            "translit": "kamokha"
          },
          {
            "id": "particle-prep-attached-kmo-2fs",
            "display": "כָּמוֹךְ",
            "lemma": "כְּמוֹ",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "כמוך",
            "translit": "kamokh"
          },
          {
            "id": "particle-prep-attached-kmo-1cs",
            "display": "כָּמוֹנִי",
            "lemma": "כְּמוֹ",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "כמוני",
            "translit": "kamoni"
          },
          {
            "id": "particle-prep-attached-kmo-3mp",
            "display": "כָּהֶם",
            "lemma": "כְּמוֹ",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "כהם",
            "translit": "kahem"
          },
          {
            "id": "particle-prep-attached-kmo-3fp",
            "display": "כָּהֶן",
            "lemma": "כְּמוֹ",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "כהן",
            "translit": "kahen"
          },
          {
            "id": "particle-prep-attached-kmo-2mp",
            "display": "כָּכֶם",
            "lemma": "כְּמוֹ",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "ככם",
            "translit": "kakhem"
          },
          {
            "id": "particle-prep-attached-kmo-2fp",
            "display": "כָּכֶן",
            "lemma": "כְּמוֹ",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "ככן",
            "translit": "kakhen"
          },
          {
            "id": "particle-prep-attached-kmo-1cp",
            "display": "כָּמוֹנוּ",
            "lemma": "כְּמוֹ",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "כמונו",
            "translit": "kamonu"
          }
        ]
      },
      {
        "id": "particle-prep-attached-mn",
        "category": "particle",
        "label": "מִן (from, than) + attached pronoun",
        "source": {
          "appendix": "B",
          "page": "a-13"
        },
        "forms": [
          {
            "id": "particle-prep-attached-mn-3ms",
            "display": "מִמֶּנּוּ",
            "lemma": "מִן",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "from him/it",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "ממנו",
            "translit": "mimmennu"
          },
          {
            "id": "particle-prep-attached-mn-3fs",
            "display": "מִמֶּנָּה",
            "lemma": "מִן",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "ממנה",
            "translit": "mimmenna"
          },
          {
            "id": "particle-prep-attached-mn-2ms",
            "display": "מִמְּךָ",
            "lemma": "מִן",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "ממך",
            "translit": "mimmkha"
          },
          {
            "id": "particle-prep-attached-mn-2fs",
            "display": "מִמֵּךְ",
            "lemma": "מִן",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "ממך",
            "translit": "mimmekh"
          },
          {
            "id": "particle-prep-attached-mn-1cs",
            "display": "מִמֶּנִּי",
            "lemma": "מִן",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-13"
            },
            "compare": "ממני",
            "translit": "mimmenni"
          },
          {
            "id": "particle-prep-attached-mn-3mp",
            "display": "מֵהֶם",
            "lemma": "מִן",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "מהם",
            "translit": "mehem"
          },
          {
            "id": "particle-prep-attached-mn-3fp",
            "display": "מֵהֶן",
            "lemma": "מִן",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "מהן",
            "translit": "mehen"
          },
          {
            "id": "particle-prep-attached-mn-2mp",
            "display": "מִכֶּם",
            "lemma": "מִן",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "מכם",
            "translit": "mikkem"
          },
          {
            "id": "particle-prep-attached-mn-2fp",
            "display": "מִכֶּן",
            "lemma": "מִן",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": null,
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "מכן",
            "translit": "mikken"
          },
          {
            "id": "particle-prep-attached-mn-1cp",
            "display": "מִמֶּנּוּ",
            "lemma": "מִן",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                }
              },
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "from us",
            "ambiguityNote": "printed identically to the 3ms form 'from him'; only the surrounding context distinguishes 'from us' from 'from him'",
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "ממנו",
            "translit": "mimmennu"
          }
        ]
      },
      {
        "id": "particle-prep-attached-tachat",
        "category": "particle",
        "label": "Preposition תַּחַת ('under') with attached pronouns",
        "source": {
          "appendix": "B",
          "page": "a-14"
        },
        "note": "appendixOnly: no lesson in the TOC prints this suffix paradigm as a table; L22 (p.68) only notes in prose that these prepositions take the plural-noun suffix set.",
        "forms": [
          {
            "id": "particle-prep-attached-tachat-sfx3ms",
            "display": "תַּחְתָּיו",
            "lemma": "תַּחַת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'under' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "תחתיו",
            "translit": "tachtayv"
          },
          {
            "id": "particle-prep-attached-tachat-sfx3fs",
            "display": "תַּחְתֶּיהָ",
            "lemma": "תַּחַת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'under' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "תחתיה",
            "translit": "tachteha"
          },
          {
            "id": "particle-prep-attached-tachat-sfx2ms",
            "display": "תַּחְתֶּיךָ",
            "lemma": "תַּחַת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'under' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "תחתיך",
            "translit": "tachtekha"
          },
          {
            "id": "particle-prep-attached-tachat-sfx2fs",
            "display": "תַּחְתַּיִךְ",
            "lemma": "תַּחַת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'under' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "תחתיך",
            "translit": "tachtayikh"
          },
          {
            "id": "particle-prep-attached-tachat-sfx1cs",
            "display": "תַּחְתַּי",
            "lemma": "תַּחַת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                }
              }
            ],
            "note": "preposition 'under' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "תחתי",
            "translit": "tachtay"
          },
          {
            "id": "particle-prep-attached-tachat-sfx3mp",
            "display": "תַּחְתֵּיהֶם",
            "lemma": "תַּחַת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'under' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "תחתיהם",
            "translit": "tachtehem"
          },
          {
            "id": "particle-prep-attached-tachat-sfx3fp",
            "display": "תַּחְתֵּיהֶן",
            "lemma": "תַּחַת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "3",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'under' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "תחתיהן",
            "translit": "tachtehen"
          },
          {
            "id": "particle-prep-attached-tachat-sfx2mp",
            "display": "תַּחְתֵּיכֶם",
            "lemma": "תַּחַת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "masculine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'under' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "תחתיכם",
            "translit": "tachtekhem"
          },
          {
            "id": "particle-prep-attached-tachat-sfx2fp",
            "display": "תַּחְתֵּיכֶן",
            "lemma": "תַּחַת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "2",
                  "gender": "feminine",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'under' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "תחתיכן",
            "translit": "tachtekhen"
          },
          {
            "id": "particle-prep-attached-tachat-sfx1cp",
            "display": "תַּחְתֵּינוּ",
            "lemma": "תַּחַת",
            "root": null,
            "pos": "particle",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "plural"
                }
              }
            ],
            "note": "preposition 'under' with attached pronoun",
            "ambiguityNote": null,
            "source": {
              "appendix": "B",
              "page": "a-14"
            },
            "compare": "תחתינו",
            "translit": "tachtenu"
          }
        ]
      },
      {
        "id": "verb-hifil-pastnarrative-appendix",
        "category": "verb",
        "label": "Hifil Past Narrative / defective Imperfect spelling examples",
        "source": {
          "appendix": "C",
          "page": "a-18"
        },
        "forms": [
          {
            "id": "verb-hifil-pastnarrative-appendix-3mp-shcht",
            "display": "וַיַּשְׁחִתוּ",
            "lemma": "הִשְׁחִית",
            "root": "שחת",
            "pos": "verb",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "past-narrative",
                "person": "3",
                "gender": "masculine",
                "number": "plural"
              }
            ],
            "note": "'they destroyed' (2 Sam 11:1); cited under the Imperfect bullet to show defective (no-yod) theme-vowel spelling",
            "source": {
              "appendix": "C",
              "page": "a-18"
            },
            "compare": "וישחתו",
            "translit": "vayashchitu"
          },
          {
            "id": "verb-hifil-pastnarrative-appendix-3ms-shmd",
            "display": "וַיַּשְׁמֵד",
            "lemma": "הִשְׁמִיד",
            "root": "שמד",
            "pos": "verb",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "binyan": "hifil",
                "conjugation": "past-narrative",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "'Jehu destroyed [the Baal]' (2 Kings 10:28); Past Narrative theme vowel is segol-class instead of the Imperfect's hireq-yod",
            "source": {
              "appendix": "C",
              "page": "a-18"
            },
            "compare": "וישמד",
            "translit": "vayashmed"
          }
        ]
      },
      {
        "id": "verb-nifal-infinitive-appendix",
        "category": "verb",
        "label": "Nifal Adverbial Infinitive (model root פקד)",
        "source": {
          "appendix": "C",
          "page": "a-17"
        },
        "forms": [
          {
            "id": "verb-nifal-infinitive-appendix-advinf-a",
            "display": "נִפְקֹד",
            "lemma": "נִפְקַד",
            "root": "פקד",
            "pos": "verb",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "adverbial-infinitive"
              }
            ],
            "note": "one of two printed Nifal Adverbial Infinitive forms; not taught with concrete forms in L37 itself",
            "ambiguityNote": "Two forms printed as equally valid.",
            "source": {
              "appendix": "C",
              "page": "a-17"
            },
            "compare": "נפקד",
            "translit": "nifqod"
          },
          {
            "id": "verb-nifal-infinitive-appendix-advinf-b",
            "display": "הִפָּקֵד",
            "lemma": "נִפְקַד",
            "root": "פקד",
            "pos": "verb",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "binyan": "nifal",
                "conjugation": "adverbial-infinitive"
              }
            ],
            "note": "second printed Nifal Adverbial Infinitive form",
            "ambiguityNote": "Two forms printed as equally valid.",
            "source": {
              "appendix": "C",
              "page": "a-17"
            },
            "compare": "הפקד",
            "translit": "hippaqed"
          }
        ]
      },
      {
        "id": "verb-piel-pastnarrative-appendix",
        "category": "verb",
        "label": "Piel Past Narrative — dagesh-drop example",
        "source": {
          "appendix": "C",
          "page": "a-17"
        },
        "forms": [
          {
            "id": "verb-piel-pastnarrative-appendix-3ms-dbr",
            "display": "וַיְדַבֵּר",
            "lemma": "דִּבֶּר",
            "root": "דבר",
            "pos": "verb",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "binyan": "piel",
                "conjugation": "past-narrative",
                "person": "3",
                "gender": "masculine",
                "number": "singular"
              }
            ],
            "note": "'YHWH spoke' (Num 1:1); illustrates the ' prefix dropping its dagesh before certain consonants (sqinmlevi)",
            "source": {
              "appendix": "C",
              "page": "a-17"
            },
            "compare": "וידבר",
            "translit": "vaydabber"
          }
        ]
      },
      {
        "id": "verb-pual-appendix",
        "category": "verb",
        "label": "Pual — the only two attested forms printed in the book",
        "source": {
          "appendix": "C",
          "page": "a-17"
        },
        "forms": [
          {
            "id": "verb-pual-appendix-inf-1cs-ana",
            "display": "עֻנּוֹתִי",
            "lemma": "עֻנָּה",
            "root": "ענה",
            "pos": "verb",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "binyan": "pual",
                "conjugation": "infinitive",
                "suffix": {
                  "person": "1",
                  "gender": "common",
                  "number": "singular"
                }
              }
            ],
            "note": "sole printed Pual Infinitive citation (Ps 132:1); appendix says Imperative and 1st-person Jussive never occur in Pual",
            "source": {
              "appendix": "C",
              "page": "a-17"
            },
            "compare": "ענותי",
            "translit": "unnoti"
          },
          {
            "id": "verb-pual-appendix-advinf-gnb",
            "display": "גֻּנַּב",
            "lemma": "גֻּנַּב",
            "root": "גנב",
            "pos": "verb",
            "appendixOnly": true,
            "acceptedParses": [
              {
                "binyan": "pual",
                "conjugation": "adverbial-infinitive"
              }
            ],
            "note": "sole printed Pual Adverbial Infinitive citation (Gen 40:15)",
            "source": {
              "appendix": "C",
              "page": "a-17"
            },
            "compare": "גנב",
            "translit": "gunnav"
          }
        ]
      }
    ],
    "lessonGates": [
      {
        "lesson": 5,
        "introduces": [
          {
            "summary": "Independent subject pronouns, singular set (3ms/3fs/2ms/2fs/1cs).",
            "paradigmIds": [
              "pron-subject"
            ],
            "source": {
              "lesson": 5,
              "page": 32
            }
          }
        ]
      },
      {
        "lesson": 7,
        "introduces": [
          {
            "summary": "Nouns build from a triconsonantal root; fem. singular usually ends ־ה/־ת; masc. singular has no ending. Several common nouns (father/son/daughter) are irregular and must be memorized.",
            "paradigmIds": [
              "noun-endings",
              "noun-irregular"
            ],
            "source": {
              "lesson": 7,
              "page": 36
            }
          }
        ]
      },
      {
        "lesson": 8,
        "introduces": [
          {
            "summary": "Definite article (ה + דגש חזק) and interrogative ה (marks yes/no questions) are the same letter with different function/vocalization; no drillable form inventory is printed.",
            "paradigmIds": [],
            "source": {
              "lesson": 8,
              "page": 38
            }
          }
        ]
      },
      {
        "lesson": 9,
        "introduces": [
          {
            "summary": "ל + attached pronoun expresses possession in a copular clause ('X belongs to Y'); singular-referent forms.",
            "paradigmIds": [
              "particle-l-possession"
            ],
            "source": {
              "lesson": 9,
              "page": 39
            }
          }
        ]
      },
      {
        "lesson": 10,
        "introduces": [
          {
            "summary": "Plural (־ים/־ות) and dual (־ַיִם) noun endings; naturally-paired body parts use the dual and are feminine; more irregular nouns (brother/sister/head).",
            "paradigmIds": [
              "noun-endings",
              "noun-dual-bodyparts",
              "noun-irregular"
            ],
            "source": {
              "lesson": 10,
              "page": 41
            }
          }
        ]
      },
      {
        "lesson": 11,
        "introduces": [
          {
            "summary": "Independent pronoun set completed with the plural persons (3mp/3fp/2mp/2fp/1cp).",
            "paradigmIds": [
              "pron-subject"
            ],
            "source": {
              "lesson": 11,
              "page": 44
            }
          }
        ]
      },
      {
        "lesson": 12,
        "introduces": [
          {
            "summary": "Existential copulas יֵשׁ (is/are) and אֵין (isn't/aren't); examples in the lesson show them combined with attached prepositions (e.g. יֶשׁ־לִי) only inside example sentences, not as a printed suffix inventory.",
            "paradigmIds": [
              "particle-yesh-ayin"
            ],
            "source": {
              "lesson": 12,
              "page": 46
            }
          }
        ]
      },
      {
        "lesson": 13,
        "introduces": [
          {
            "summary": "Conjunction ו and prepositions ב/כ/ל/מן attach directly to the following word (or connect via maqqef); the lesson states the rule but prints no attached-pronoun inventory itself — that only appears in Appendix B.5c.",
            "paradigmIds": [
              "particle-prep-attached-mn",
              "particle-prep-attached-kmo"
            ],
            "source": {
              "lesson": 13,
              "page": 48
            }
          }
        ]
      },
      {
        "lesson": 14,
        "introduces": [
          {
            "summary": "Full inventory table of question words (דִּבְרֵי שְׁאֵלָה): who/what/why/how/how-much/when/where/from-where/to-where; מִי and מָה are cross-referenced as already taught at L6/L8, the rest are new.",
            "paradigmIds": [
              "particle-interrogative-words"
            ],
            "source": {
              "lesson": 14,
              "page": 51
            }
          }
        ]
      },
      {
        "lesson": 15,
        "introduces": [
          {
            "summary": "Introduces triconsonantal root (שרש) and binyan (בנין) concept; overview of 7 primary binyanim and the Perfect/Imperfect aspect distinction. Conceptual gate only, no drillable forms.",
            "paradigmIds": [],
            "source": {
              "lesson": 15,
              "page": 53
            }
          }
        ]
      },
      {
        "lesson": 16,
        "introduces": [
          {
            "summary": "Qal Perfect singular paradigm (3ms-1cs) introduced with paradigm verb שמר; irregular היה Perfect singular given alongside for comparison.",
            "paradigmIds": [
              "verb-qal-perfect",
              "verb-haya-perfect"
            ],
            "source": {
              "lesson": 16,
              "page": 55
            }
          }
        ]
      },
      {
        "lesson": 17,
        "introduces": [
          {
            "summary": "Plural-referent forms of ל-of-possession (their/your-pl/our), completing the set from L9.",
            "paradigmIds": [
              "particle-l-possession"
            ],
            "source": {
              "lesson": 17,
              "page": 58
            }
          }
        ]
      },
      {
        "lesson": 19,
        "introduces": [
          {
            "summary": "Qal Perfect plural forms (3cp, 2mp, 2fp, 1cp) added for שמר and היה, completing the Perfect paradigm.",
            "paradigmIds": [
              "verb-qal-perfect",
              "verb-haya-perfect"
            ],
            "source": {
              "lesson": 19,
              "page": 62
            }
          }
        ]
      },
      {
        "lesson": 20,
        "introduces": [
          {
            "summary": "Bound (construct/נסמך) vs. absolute (סומך) noun state expresses 'of'-relationships; a construct noun cannot itself take the definite article.",
            "paradigmIds": [
              "noun-bound-construct"
            ],
            "source": {
              "lesson": 20,
              "page": 64
            }
          }
        ]
      },
      {
        "lesson": 21,
        "introduces": [
          {
            "summary": "Irreal (non-real) use of the Perfect: marks conditional/purpose/result clauses, instructions/commands, and habitual events, typically via Verb-Subject word order and a vav-prefix. Interpretive/semantic gate only, no new forms.",
            "paradigmIds": [],
            "source": {
              "lesson": 21,
              "page": 66
            }
          }
        ]
      },
      {
        "lesson": 22,
        "introduces": [
          {
            "summary": "Pronouns attach directly to nouns (and to prepositions) to mark possession and make the noun definite; singular-referent set, with distinct forms depending on whether the host noun is singular or plural.",
            "paradigmIds": [
              "noun-attached-sg",
              "noun-attached-pl"
            ],
            "source": {
              "lesson": 22,
              "page": 68
            }
          }
        ]
      },
      {
        "lesson": 23,
        "introduces": [
          {
            "summary": "Qal Imperfect singular paradigm introduced with שמר, including the 2ms/3fs written-form syncretism (תִּשְׁמֹר).",
            "paradigmIds": [
              "verb-qal-imperfect"
            ],
            "source": {
              "lesson": 23,
              "page": 71
            }
          }
        ]
      },
      {
        "lesson": 24,
        "introduces": [
          {
            "summary": "The (construct) Infinitive: one uninflected form per binyan; Qal example שְׁמֹר; functions as clause subject/object or purpose-result, may take an attached pronoun.",
            "paradigmIds": [
              "verb-qal-infinitive"
            ],
            "source": {
              "lesson": 24,
              "page": 74
            }
          }
        ]
      },
      {
        "lesson": 25,
        "introduces": [
          {
            "summary": "The Adverbial Infinitive (infinitive absolute): pairs with a finite verb of the same root/binyan for modal emphasis (doubt, necessity, possibility); Qal example שָׁמוֹר.",
            "paradigmIds": [
              "verb-qal-adverbial-infinitive"
            ],
            "source": {
              "lesson": 25,
              "page": 77
            }
          }
        ]
      },
      {
        "lesson": 26,
        "introduces": [
          {
            "summary": "Direct objects are either a bare noun or a preposition+noun (memorize per verb); e.g. נגע 'touch' takes a ב-phrase as its object. No inventoried forms are printed here; the direct-object marker אֵת/אֶת itself was already vocab at L15.",
            "paradigmIds": [],
            "source": {
              "lesson": 26,
              "page": 79
            }
          }
        ]
      },
      {
        "lesson": 27,
        "introduces": [
          {
            "summary": "Qal Imperfect plural forms complete the paradigm for שמר, including the 3fp/2fp written-form syncretism (תִּשְׁמֹרְנָה).",
            "paradigmIds": [
              "verb-qal-imperfect"
            ],
            "source": {
              "lesson": 27,
              "page": 81
            }
          }
        ]
      },
      {
        "lesson": 28,
        "introduces": [
          {
            "summary": "Full Qal Imperfect paradigm of irregular היה (singular and plural), parallel in structure to the L23/27 שמר paradigm, including the same syncretisms.",
            "paradigmIds": [
              "verb-haya-imperfect"
            ],
            "source": {
              "lesson": 28,
              "page": 83
            }
          }
        ]
      },
      {
        "lesson": 29,
        "introduces": [
          {
            "summary": "Piel marked by dagesh in R2 (blocked by gutturals/ר); Hifil marked by ה prefix + i-class theme vowel; meanings often idiosyncratic per root.",
            "paradigmIds": [
              "verb-piel-recognition",
              "verb-hifil-recognition"
            ],
            "source": {
              "lesson": 29,
              "page": 85
            }
          }
        ]
      },
      {
        "lesson": 31,
        "introduces": [
          {
            "summary": "Plural-referent attached pronouns (their/your-pl/our) complete the set from L22, on both singular- and plural-noun hosts.",
            "paradigmIds": [
              "noun-attached-sg",
              "noun-attached-pl"
            ],
            "source": {
              "lesson": 31,
              "page": 91
            }
          }
        ]
      },
      {
        "lesson": 32,
        "introduces": [
          {
            "summary": "Adjectives inflect like nouns (gender/number, absolute/construct); Hebrew has no comparative/superlative endings — context, מן, or a סמיכות phrase expresses these.",
            "paradigmIds": [
              "adjective-inflection"
            ],
            "source": {
              "lesson": 32,
              "page": 93
            }
          }
        ]
      },
      {
        "lesson": 33,
        "introduces": [
          {
            "summary": "Near demonstratives (זה/זאת/אלה) are dedicated forms; far demonstratives reuse the 3rd-person independent pronouns (sg.) plus dedicated הֵמָּה/הֵנָּה (pl.).",
            "paradigmIds": [
              "pron-demonstrative"
            ],
            "source": {
              "lesson": 33,
              "page": 96
            }
          }
        ]
      },
      {
        "lesson": 34,
        "introduces": [
          {
            "summary": "Segolate nouns stress the first syllable in the singular (unless a fem. ending shifts stress to the final syllable); their plurals follow regular patterns.",
            "paradigmIds": [
              "noun-segolate"
            ],
            "source": {
              "lesson": 34,
              "page": 98
            }
          }
        ]
      },
      {
        "lesson": 35,
        "introduces": [
          {
            "summary": "Past Narrative conjugation: archaic narrative-past verb form distinguished from the Imperfect by a vav-conjunction plus dagesh forte prefix (absent in 1cs and in Piel-type roots); triggers Verb-Subject word order.",
            "paradigmIds": [
              "verb-past-narrative"
            ],
            "source": {
              "lesson": 35,
              "page": 100
            }
          }
        ]
      },
      {
        "lesson": 36,
        "introduces": [
          {
            "summary": "וַיְהִי, the extremely frequent 3ms Past Narrative of היה: means \"was/became/came\" or simply marks the opening of a narrative episode.",
            "paradigmIds": [
              "verb-past-narrative"
            ],
            "source": {
              "lesson": 36,
              "page": 102
            }
          }
        ]
      },
      {
        "lesson": 37,
        "introduces": [
          {
            "summary": "Nifal marked by נ prefix (Perfect/Participle) or dagesh+hireq prefix (Imperfect/Imperative); Hitpael marked by התּ/ת prefix + dagesh in R2; meanings often idiosyncratic.",
            "paradigmIds": [
              "verb-nifal-recognition",
              "verb-hitpael-recognition"
            ],
            "source": {
              "lesson": 37,
              "page": 104
            }
          }
        ]
      },
      {
        "lesson": 38,
        "introduces": [
          {
            "summary": "Dynamic vs. stative verb classification: stative Qal verbs use distinct Perfect/Imperfect vowel patterns, rarely form participles, and share their Perfect 3ms form with the corresponding adjective.",
            "paradigmIds": [
              "verb-qal-stative"
            ],
            "source": {
              "lesson": 38,
              "page": 106
            }
          },
          {
            "summary": "Dynamic vs. stative Qal verbs differ in vowel pattern (שָׁמַר vs. כָּבֵד); stative 3ms Perfect doubles as the ms adjective. Not this agent's binyan/volitive scope, no forms captured here.",
            "paradigmIds": [],
            "source": {
              "lesson": 38,
              "page": 106
            }
          }
        ]
      },
      {
        "lesson": 39,
        "introduces": [
          {
            "summary": "Jussive = Imperfect shape; 1st-person (Cohortative) adds ה-, 2nd/3rd can shorten the theme vowel; negated with אַל never לֹא. Imperative = Jussive minus prefix, 2nd person only, never negated.",
            "paradigmIds": [
              "verb-qal-jussive",
              "verb-hifil-jussive",
              "verb-qal-imperative",
              "verb-nifal-imperative",
              "verb-piel-imperative",
              "verb-hitpael-imperative",
              "verb-hifil-imperative"
            ],
            "source": {
              "lesson": 39,
              "page": 109
            }
          }
        ]
      },
      {
        "lesson": 40,
        "introduces": [
          {
            "summary": "Object pronouns attach directly to verbs (Perfect uses a-class linking vowel, Imperfect/Imperative/Past-Narrative use i-class); summary suffix chart, full paradigm in Appendix C.2.",
            "paradigmIds": [
              "verb-attached-object-suffixes",
              "verb-attached-qal-example"
            ],
            "source": {
              "lesson": 40,
              "page": 112
            }
          }
        ]
      },
      {
        "lesson": 42,
        "introduces": [
          {
            "summary": "Participles are binyan-specific adjectives: Qal Active/Passive decline like adjectives with a distinct pattern; other binyanim's participles use a מ prefix and mirror the Imperfect vowel pattern.",
            "paradigmIds": [
              "verb-qal-participle",
              "verb-nifal-participle",
              "verb-piel-participle",
              "verb-hitpael-participle",
              "verb-hifil-participle"
            ],
            "source": {
              "lesson": 42,
              "page": 116
            }
          }
        ]
      },
      {
        "lesson": 44,
        "introduces": [
          {
            "summary": "Pure consolidation chart of the whole verbal system (Real: Perfect/Past-Narrative/Imperfect; Irreal: Irreal-Perfect/Irreal-Imperfect/Jussive/Imperative) plus a semantic-overlap Venn diagram; reuses שָׁמַר/יִשְׁמֹר forms already gated earlier. No new forms per the hard 'gate only' rule for this lesson.",
            "paradigmIds": [],
            "source": {
              "lesson": 44,
              "page": 122
            }
          }
        ]
      },
      {
        "lesson": 45,
        "introduces": [
          {
            "summary": "Numerals: cardinals (1 = adjective; 2-10 = nouns, opposite gender from the modified noun, absolute/construct) and ordinals (1st-10th, m/f only, no state distinction); teens, tens, and hundreds formation.",
            "paradigmIds": [
              "numeral-cardinal-1-10",
              "numeral-ordinal-1-10",
              "numeral-11-19",
              "numeral-tens",
              "numeral-hundreds"
            ],
            "source": {
              "lesson": 45,
              "page": 125
            }
          }
        ]
      }
    ]
  };
})();
