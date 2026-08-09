// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_data.mjs (source: source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md)
// Set metadata — lesson titles, lesson-to-range mapping, and session range
// groupings (BBH). ES module: see js/ui/selectors.js, js/domain/deck/ordering.js.

export const CHAPTER_TITLES = {
  "1": "The Consonants",
  "2": "The Vowels",
  "3": "שְׁוָא (Shava)",
  "4": "דָּגֵשׁ (Dagesh)",
  "5": "Subject Pronouns: Singular",
  "6": "Copular Clauses",
  "7": "Nouns: Singular",
  "8": "The Article הַ and the Interrogative הֲ",
  "9": "לְ of Possession: Singular",
  "10": "Nouns: Plural and Dual",
  "11": "Subject Pronouns: Plural",
  "12": "יֵשׁ and אֵין",
  "13": "Conjunction וְ and Prepositions בְּ, כְּ, לְ, and מִן",
  "14": "שְׁאֵלוֹת (Questions)",
  "15": "Verbs: A Preview",
  "16": "קַל Perfect Conjugation: Singular",
  "17": "לְ of Possession: Plural",
  "18": "Word Order",
  "19": "קַל Perfect Conjugation: Plural",
  "20": "סְמִיכוּת (Bound Nouns)",
  "21": "The Irreal Use of the Perfect Conjugation",
  "22": "Attached Pronouns: Singular",
  "23": "קַל Imperfect Conjugation: Singular",
  "24": "The Infinitive",
  "25": "The Adverbial Infinitive",
  "26": "Objects",
  "27": "קַל Imperfect Conjugation: Plural",
  "28": "קַל Imperfect Conjugation of הָיָה",
  "29": "בִּנְיָנִים: פִּעֵל וְהִפְעִיל",
  "30": "Main and Subordinate Clauses",
  "31": "Attached Pronouns: Plural",
  "32": "Adjectives",
  "33": "Demonstrative Pronouns",
  "34": "סְגֹלֶת Noun Pattern",
  "35": "Past Narrative Conjugation",
  "36": "וַיְהִי",
  "37": "בִּנְיָנִים: נִפְעַל וְהִתְפַּעֵל",
  "38": "Dynamic and Stative Verbs",
  "39": "Jussives and Imperatives",
  "40": "Attached Pronouns with Verbs",
  "41": "Word Order with Topic and Focus",
  "42": "Participles",
  "43": "The Foreground and Background of Narrative",
  "44": "The Verbal System: A Summary",
  "45": "Numerals",
  "46": "Topic",
  "47": "Accents",
  "48": "Complements and Adjuncts",
  "49": "Case Relations",
  "50": "Lexical Semantics"
};

// Alias — CHAPTER_TITLES keeps its legacy name for importers; LESSON_TITLES
// is the same data under its natural BBH name.
export const LESSON_TITLES = CHAPTER_TITLES;

// Range presets for the lesson selector: five 10-lesson decade blocks, "all",
// plus 13 "Unit" reading-block presets (the textbook's own illustrated-
// Reading breakpoints) as a second preset group — 19 keys total.
export const SESSION_WEEK_META = {
  "rng1": {
    "label": "Lessons 1–10",
    "lessons": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10
    ]
  },
  "rng2": {
    "label": "Lessons 11–20",
    "lessons": [
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20
    ]
  },
  "rng3": {
    "label": "Lessons 21–30",
    "lessons": [
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30
    ]
  },
  "rng4": {
    "label": "Lessons 31–40",
    "lessons": [
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40
    ]
  },
  "rng5": {
    "label": "Lessons 41–50",
    "lessons": [
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50
    ]
  },
  "all": {
    "label": "All Lessons",
    "lessons": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50
    ]
  },
  "unit1": {
    "label": "Unit 1 (L1–9)",
    "lessons": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ]
  },
  "unit2": {
    "label": "Unit 2 (L10–14)",
    "lessons": [
      10,
      11,
      12,
      13,
      14
    ]
  },
  "unit3": {
    "label": "Unit 3 (L15–18)",
    "lessons": [
      15,
      16,
      17,
      18
    ]
  },
  "unit4": {
    "label": "Unit 4 (L19–22)",
    "lessons": [
      19,
      20,
      21,
      22
    ]
  },
  "unit5": {
    "label": "Unit 5 (L23–26)",
    "lessons": [
      23,
      24,
      25,
      26
    ]
  },
  "unit6": {
    "label": "Unit 6 (L27–30)",
    "lessons": [
      27,
      28,
      29,
      30
    ]
  },
  "unit7": {
    "label": "Unit 7 (L31–34)",
    "lessons": [
      31,
      32,
      33,
      34
    ]
  },
  "unit8": {
    "label": "Unit 8 (L35–38)",
    "lessons": [
      35,
      36,
      37,
      38
    ]
  },
  "unit9": {
    "label": "Unit 9 (L39–41)",
    "lessons": [
      39,
      40,
      41
    ]
  },
  "unit10": {
    "label": "Unit 10 (L42–44)",
    "lessons": [
      42,
      43,
      44
    ]
  },
  "unit11": {
    "label": "Unit 11 (L45–46)",
    "lessons": [
      45,
      46
    ]
  },
  "unit12": {
    "label": "Unit 12 (L47–48)",
    "lessons": [
      47,
      48
    ]
  },
  "unit13": {
    "label": "Unit 13 (L49–50)",
    "lessons": [
      49,
      50
    ]
  }
};

// Lesson number -> range index (1..5), derived from SESSION_WEEK_META rng1..rng5.
export const CHAPTER_TO_WEEK = {
  "1": 1,
  "2": 1,
  "3": 1,
  "4": 1,
  "5": 1,
  "6": 1,
  "7": 1,
  "8": 1,
  "9": 1,
  "10": 1,
  "11": 2,
  "12": 2,
  "13": 2,
  "14": 2,
  "15": 2,
  "16": 2,
  "17": 2,
  "18": 2,
  "19": 2,
  "20": 2,
  "21": 3,
  "22": 3,
  "23": 3,
  "24": 3,
  "25": 3,
  "26": 3,
  "27": 3,
  "28": 3,
  "29": 3,
  "30": 3,
  "31": 4,
  "32": 4,
  "33": 4,
  "34": 4,
  "35": 4,
  "36": 4,
  "37": 4,
  "38": 4,
  "39": 4,
  "40": 4,
  "41": 5,
  "42": 5,
  "43": 5,
  "44": 5,
  "45": 5,
  "46": 5,
  "47": 5,
  "48": 5,
  "49": 5,
  "50": 5
};

// First (lowest) lesson number of each range — the inverse of CHAPTER_TO_WEEK.
export const WEEK_FIRST_CHAPTER = {
  "1": 1,
  "2": 11,
  "3": 21,
  "4": 31,
  "5": 41
};
