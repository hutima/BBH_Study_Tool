// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_book_vocab.mjs
// (source: pinned OSHB checkout via source/bbh/reader/corpus-pin.json, pinned
// Strong's Hebrew Dictionary checkout via the same file's strongsPin,
// source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv for the
// 209-lesson-lemma exclusion set, source/bbh/reader/gate-map.json for the
// numeral-lemma exclusion list)
//
// Task #15 ("advanced vocab + vocab by book"): 8 per-book "advanced" decks
// (top 25 highest-frequency content lemmas per book, excluding the 209
// lesson-vocab cards, numerals, proper names, and gentilics) plus 1
// corpus-wide "Tanakh core" deck (top 50 across all 8 books combined).
// Own id namespace (bbh-bk-<book>-<strongs> / bbh-bk-core-<strongs>) so
// these never collide with js/data/bbh_vocab.js's bbh-l<NN>-<slug> ids.
// Card shape mirrors js/data/bbh_vocab.js: {id, g, e, translit, notes,
// required} — g/translit are the Strong's dictionary's own pointed
// headword (`lx`) romanized with tools/gen_bbh_parsing_data.mjs's
// romanizeForm(); e is a short modernized gloss from
// tools/gen_strongs_glosses.mjs's headGloss().
//
// Self-registers on window.BBH_BOOK_VOCAB (classic, non-module script —
// same idiom as bbh_vocab.js/bbh_parsing.js). js/app/main.js merges
// BBH_BOOK_VOCAB.decks into window.SETS under their own 'book-*' keys
// AFTER bbh_vocab.js has registered, guarded on BBH_BOOK_VOCAB being
// present (mixed-version safe).
//
// Never edit this file by hand — re-run the generator instead. Never edit
// source/bbh/ from here or anywhere else.
(function () {
  window.BBH_BOOK_VOCAB = {
    "schemaVersion": 1,
    "decks": [
      {
        "key": "book-gen",
        "label": "Genesis (advanced)",
        "type": "chapter",
        "cards": [
          {
            "id": "bbh-bk-gen-559",
            "g": "אָמַר",
            "e": "to say",
            "translit": "amar",
            "notes": "Genesis · 606x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-3205",
            "g": "יָלַד",
            "e": "to bear young",
            "translit": "yalad",
            "notes": "Genesis · 170x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-6440",
            "g": "פָּנִים",
            "e": "the face",
            "translit": "panim",
            "notes": "Genesis · 141x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-7200",
            "g": "רָאָה",
            "e": "to see",
            "translit": "ra'a",
            "notes": "Genesis · 141x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-7725",
            "g": "שׁוּב",
            "e": "to turn back",
            "translit": "shuv",
            "notes": "Genesis · 68x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-2416",
            "g": "חַי",
            "e": "alive",
            "translit": "chay",
            "notes": "Genesis · 66x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-3967",
            "g": "מֵאָה",
            "e": "a hundred",
            "translit": "me'a",
            "notes": "Genesis · 64x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-6629",
            "g": "צֹאן",
            "e": "a collective name for a flock",
            "translit": "tson",
            "notes": "Genesis · 63x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-2421",
            "g": "חָיָה",
            "e": "to live",
            "translit": "chaya",
            "notes": "Genesis · 56x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-6965",
            "g": "קוּם",
            "e": "to rise",
            "translit": "qum",
            "notes": "Genesis · 51x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-7704",
            "g": "שָׂדֶה",
            "e": "a field",
            "translit": "sade",
            "notes": "Genesis · 48x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-120",
            "g": "אָדָם",
            "e": "ruddy i.e. a human being",
            "translit": "adam",
            "notes": "Genesis · 47x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-7760",
            "g": "שׂוּם",
            "e": "to put",
            "translit": "sum",
            "notes": "Genesis · 46x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-441",
            "g": "אַלּוּף",
            "e": "familiar",
            "translit": "aluf",
            "notes": "Genesis · 43x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-2896",
            "g": "טוֹב",
            "e": "good",
            "translit": "tov",
            "notes": "Genesis · 41x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-3701",
            "g": "כֶּסֶף",
            "e": "silver",
            "translit": "kesef",
            "notes": "Genesis · 41x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-3381",
            "g": "יָרַד",
            "e": "to descend",
            "translit": "yarad",
            "notes": "Genesis · 39x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-5046",
            "g": "נָגַד",
            "e": "to front",
            "translit": "nagad",
            "notes": "Genesis · 36x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-7451",
            "g": "רַע",
            "e": "bad",
            "translit": "ra",
            "notes": "Genesis · 36x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-1320",
            "g": "בָּשָׂר",
            "e": "flesh",
            "translit": "basar",
            "notes": "Genesis · 33x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-2472",
            "g": "חֲלוֹם",
            "e": "a dream",
            "translit": "chalom",
            "notes": "Genesis · 33x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-6086",
            "g": "עֵץ",
            "e": "a tree",
            "translit": "ets",
            "notes": "Genesis · 30x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-7235",
            "g": "רָבָה",
            "e": "to increase",
            "translit": "rava",
            "notes": "Genesis · 29x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-4735",
            "g": "מִקְנֶה",
            "e": "something bought",
            "translit": "miqne",
            "notes": "Genesis · 28x in Genesis",
            "required": true
          },
          {
            "id": "bbh-bk-gen-8198",
            "g": "שִׁפְחָה",
            "e": "a female slave",
            "translit": "shifcha",
            "notes": "Genesis · 28x in Genesis",
            "required": true
          }
        ]
      },
      {
        "key": "book-ruth",
        "label": "Ruth (advanced)",
        "type": "chapter",
        "cards": [
          {
            "id": "bbh-bk-ruth-559",
            "g": "אָמַר",
            "e": "to say",
            "translit": "amar",
            "notes": "Ruth · 54x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-1350",
            "g": "גָּאַל",
            "e": "to be the next of kin",
            "translit": "ga'al",
            "notes": "Ruth · 21x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-7704",
            "g": "שָׂדֶה",
            "e": "a field",
            "translit": "sade",
            "notes": "Ruth · 16x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-7725",
            "g": "שׁוּב",
            "e": "to turn back",
            "translit": "shuv",
            "notes": "Ruth · 15x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-3205",
            "g": "יָלַד",
            "e": "to bear young",
            "translit": "yalad",
            "notes": "Ruth · 14x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-3950",
            "g": "לָקַט",
            "e": "to pick up",
            "translit": "laqat",
            "notes": "Ruth · 12x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-2545",
            "g": "חֲמוֹת",
            "e": "a mother-in-law",
            "translit": "chamot",
            "notes": "Ruth · 10x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-7901",
            "g": "שָׁכַב",
            "e": "to lie down",
            "translit": "shakhav",
            "notes": "Ruth · 8x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-7114",
            "g": "קָצַר",
            "e": "to dock off",
            "translit": "qatsar",
            "notes": "Ruth · 7x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-5046",
            "g": "נָגַד",
            "e": "to front",
            "translit": "nagad",
            "notes": "Ruth · 6x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-6965",
            "g": "קוּם",
            "e": "to rise",
            "translit": "qum",
            "notes": "Ruth · 6x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-7069",
            "g": "קָנָה",
            "e": "to erect",
            "translit": "qana",
            "notes": "Ruth · 6x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-8184",
            "g": "שְׂעֹרָה",
            "e": "barley",
            "translit": "se'ora",
            "notes": "Ruth · 6x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-1242",
            "g": "בֹּקֶר",
            "e": "dawn",
            "translit": "boqer",
            "notes": "Ruth · 4x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-1637",
            "g": "גֹּרֶן",
            "e": "a threshing-floor",
            "translit": "goren",
            "notes": "Ruth · 4x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-1692",
            "g": "דָּבַק",
            "e": "to impinge",
            "translit": "davaq",
            "notes": "Ruth · 4x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-3915",
            "g": "לַיִל",
            "e": "a twist",
            "translit": "layil",
            "notes": "Ruth · 4x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-4772",
            "g": "מַרְגְלָה",
            "e": "(plural for collective) a footpiece",
            "translit": "margela",
            "notes": "Ruth · 4x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-5800",
            "g": "עָזַב",
            "e": "to loosen",
            "translit": "azav",
            "notes": "Ruth · 4x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-7105",
            "g": "קָצִיר",
            "e": "severed",
            "translit": "qatsir",
            "notes": "Ruth · 4x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-8179",
            "g": "שַׁעַר",
            "e": "an opening",
            "translit": "sha'ar",
            "notes": "Ruth · 4x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-1540",
            "g": "גָּלָה",
            "e": "to denude",
            "translit": "gala",
            "notes": "Ruth · 3x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-2428",
            "g": "חַיִל",
            "e": "probably a force",
            "translit": "chayil",
            "notes": "Ruth · 3x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-2580",
            "g": "חֵן",
            "e": "graciousness",
            "translit": "chen",
            "notes": "Ruth · 3x in Ruth",
            "required": true
          },
          {
            "id": "bbh-bk-ruth-2617",
            "g": "חֵסֵד",
            "e": "kindness",
            "translit": "chesed",
            "notes": "Ruth · 3x in Ruth",
            "required": true
          }
        ]
      },
      {
        "key": "book-jonah",
        "label": "Jonah (advanced)",
        "type": "chapter",
        "cards": [
          {
            "id": "bbh-bk-jonah-559",
            "g": "אָמַר",
            "e": "to say",
            "translit": "amar",
            "notes": "Jonah · 22x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-7451",
            "g": "רַע",
            "e": "bad",
            "translit": "ra",
            "notes": "Jonah · 9x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-6965",
            "g": "קוּם",
            "e": "to rise",
            "translit": "qum",
            "notes": "Jonah · 6x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-7021",
            "g": "קִיקָיוֹן",
            "e": "the gourd",
            "translit": "qiqayon",
            "notes": "Jonah · 5x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-7725",
            "g": "שׁוּב",
            "e": "to turn back",
            "translit": "shuv",
            "notes": "Jonah · 5x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-6",
            "g": "אָבַד",
            "e": "to wander away",
            "translit": "avad",
            "notes": "Jonah · 4x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-2904",
            "g": "טוּל",
            "e": "to pitch over or reel",
            "translit": "tul",
            "notes": "Jonah · 4x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-3381",
            "g": "יָרַד",
            "e": "to descend",
            "translit": "yarad",
            "notes": "Jonah · 4x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-4487",
            "g": "מָנָה",
            "e": "to weigh out",
            "translit": "mana",
            "notes": "Jonah · 4x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-6440",
            "g": "פָּנִים",
            "e": "the face",
            "translit": "panim",
            "notes": "Jonah · 4x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-120",
            "g": "אָדָם",
            "e": "ruddy i.e. a human being",
            "translit": "adam",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-591",
            "g": "אֳנִיָּה",
            "e": "a ship",
            "translit": "oniya",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-929",
            "g": "בְּהֵמָה",
            "e": "a dumb beast",
            "translit": "behema",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-1486",
            "g": "גּוֹרָל",
            "e": "a pebble",
            "translit": "goral",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-1709",
            "g": "דָּג",
            "e": "a fish",
            "translit": "dag",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-2416",
            "g": "חַי",
            "e": "alive",
            "translit": "chay",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-3004",
            "g": "יַבָּשָׁה",
            "e": "dry ground",
            "translit": "yabbasha",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-3190",
            "g": "יָטַב",
            "e": "to be",
            "translit": "yatav",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-3915",
            "g": "לַיִל",
            "e": "a twist",
            "translit": "layil",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-5162",
            "g": "נָחַם",
            "e": "to sigh",
            "translit": "nacham",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          },
          {
            "id": "bbh-bk-jonah-8242",
            "g": "שַׂק",
            "e": "a mesh",
            "translit": "saq",
            "notes": "Jonah · 3x in Jonah",
            "required": true
          }
        ]
      },
      {
        "key": "book-exod",
        "label": "Exodus (advanced)",
        "type": "chapter",
        "cards": [
          {
            "id": "bbh-bk-exod-559",
            "g": "אָמַר",
            "e": "to say",
            "translit": "amar",
            "notes": "Exodus · 299x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-6440",
            "g": "פָּנִים",
            "e": "the face",
            "translit": "panim",
            "notes": "Exodus · 128x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-2091",
            "g": "זָהָב",
            "e": "gold",
            "translit": "zahav",
            "notes": "Exodus · 105x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-7200",
            "g": "רָאָה",
            "e": "to see",
            "translit": "ra'a",
            "notes": "Exodus · 92x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-6944",
            "g": "קֹדֶשׁ",
            "e": "a sacred place or thing",
            "translit": "qodesh",
            "notes": "Exodus · 70x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-520",
            "g": "אַמָּה",
            "e": "a mother",
            "translit": "amma",
            "notes": "Exodus · 59x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-4196",
            "g": "מִזְבֵּחַ",
            "e": "an altar",
            "translit": "mizbecha",
            "notes": "Exodus · 59x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-4908",
            "g": "מִשְׁכָּן",
            "e": "a residence",
            "translit": "mishkan",
            "notes": "Exodus · 58x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-134",
            "g": "אֶדֶן",
            "e": "a basis",
            "translit": "eden",
            "notes": "Exodus · 51x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-7760",
            "g": "שׂוּם",
            "e": "to put",
            "translit": "sum",
            "notes": "Exodus · 50x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-2022",
            "g": "הַר",
            "e": "a mountain or range of hills",
            "translit": "har",
            "notes": "Exodus · 48x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-7175",
            "g": "קֶרֶשׁ",
            "e": "a slab or plank",
            "translit": "qeresh",
            "notes": "Exodus · 48x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-3820",
            "g": "לֵב",
            "e": "the heart",
            "translit": "lev",
            "notes": "Exodus · 46x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-3407",
            "g": "יְרִיעָה",
            "e": "a hanging",
            "translit": "yeri'a",
            "notes": "Exodus · 44x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-3701",
            "g": "כֶּסֶף",
            "e": "silver",
            "translit": "kesef",
            "notes": "Exodus · 41x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-905",
            "g": "בַּד",
            "e": "separation",
            "translit": "bad",
            "notes": "Exodus · 40x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-2885",
            "g": "טַבַּעַת",
            "e": "a seal",
            "translit": "tabba'at",
            "notes": "Exodus · 40x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-5178",
            "g": "נְחֹשֶׁת",
            "e": "copper",
            "translit": "nechoshet",
            "notes": "Exodus · 39x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-5982",
            "g": "עַמּוּד",
            "e": "a column",
            "translit": "ammud",
            "notes": "Exodus · 39x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-4150",
            "g": "מוֹעֵד",
            "e": "an appointment",
            "translit": "mo'ed",
            "notes": "Exodus · 38x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-1242",
            "g": "בֹּקֶר",
            "e": "dawn",
            "translit": "boqer",
            "notes": "Exodus · 36x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-3627",
            "g": "כְּלִי",
            "e": "something prepared",
            "translit": "keli",
            "notes": "Exodus · 34x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-8504",
            "g": "תְּכֵלֶת",
            "e": "the cerulean mussel",
            "translit": "tekhelet",
            "notes": "Exodus · 34x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-68",
            "g": "אֶבֶן",
            "e": "a stone",
            "translit": "even",
            "notes": "Exodus · 33x in Exodus",
            "required": true
          },
          {
            "id": "bbh-bk-exod-8336",
            "g": "שֵׁשׁ",
            "e": "bleached stuff",
            "translit": "shesh",
            "notes": "Exodus · 33x in Exodus",
            "required": true
          }
        ]
      },
      {
        "key": "book-deut",
        "label": "Deuteronomy (advanced)",
        "type": "chapter",
        "cards": [
          {
            "id": "bbh-bk-deut-559",
            "g": "אָמַר",
            "e": "to say",
            "translit": "amar",
            "notes": "Deuteronomy · 142x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-6440",
            "g": "פָּנִים",
            "e": "the face",
            "translit": "panim",
            "notes": "Deuteronomy · 132x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-3423",
            "g": "יָרַשׁ",
            "e": "to occupy",
            "translit": "yarash",
            "notes": "Deuteronomy · 71x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-7200",
            "g": "רָאָה",
            "e": "to see",
            "translit": "ra'a",
            "notes": "Deuteronomy · 68x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-2022",
            "g": "הַר",
            "e": "a mountain or range of hills",
            "translit": "har",
            "notes": "Deuteronomy · 51x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-5674",
            "g": "עָבַר",
            "e": "to cross over",
            "translit": "avar",
            "notes": "Deuteronomy · 49x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-3824",
            "g": "לֵבָב",
            "e": "the heart",
            "translit": "levav",
            "notes": "Deuteronomy · 47x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-4687",
            "g": "מִצְוָה",
            "e": "a command",
            "translit": "mitsva",
            "notes": "Deuteronomy · 43x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-7130",
            "g": "קֶרֶב",
            "e": "the nearest part",
            "translit": "qerev",
            "notes": "Deuteronomy · 41x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-6965",
            "g": "קוּם",
            "e": "to rise",
            "translit": "qum",
            "notes": "Deuteronomy · 35x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-7451",
            "g": "רַע",
            "e": "bad",
            "translit": "ra",
            "notes": "Deuteronomy · 35x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-7725",
            "g": "שׁוּב",
            "e": "to turn back",
            "translit": "shuv",
            "notes": "Deuteronomy · 35x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-8179",
            "g": "שַׁעַר",
            "e": "an opening",
            "translit": "sha'ar",
            "notes": "Deuteronomy · 34x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-7650",
            "g": "שָׁבַע",
            "e": "to seven oneself",
            "translit": "shava",
            "notes": "Deuteronomy · 33x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-977",
            "g": "בָּחַר",
            "e": "to try",
            "translit": "bachar",
            "notes": "Deuteronomy · 31x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-8045",
            "g": "שָׁמַד",
            "e": "to desolate",
            "translit": "shamad",
            "notes": "Deuteronomy · 29x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-784",
            "g": "אֵשׁ",
            "e": "fire",
            "translit": "esh",
            "notes": "Deuteronomy · 28x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-2896",
            "g": "טוֹב",
            "e": "good",
            "translit": "tov",
            "notes": "Deuteronomy · 28x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-68",
            "g": "אֶבֶן",
            "e": "a stone",
            "translit": "even",
            "notes": "Deuteronomy · 25x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-312",
            "g": "אַחֵר",
            "e": "hinder",
            "translit": "acher",
            "notes": "Deuteronomy · 25x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-341",
            "g": "אֹיֵב",
            "e": "hating",
            "translit": "oyev",
            "notes": "Deuteronomy · 25x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-5159",
            "g": "נַחֲלָה",
            "e": "something inherited",
            "translit": "nachala",
            "notes": "Deuteronomy · 25x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-6",
            "g": "אָבַד",
            "e": "to wander away",
            "translit": "avad",
            "notes": "Deuteronomy · 24x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-5221",
            "g": "נָכָה",
            "e": "to strike",
            "translit": "nakha",
            "notes": "Deuteronomy · 24x in Deuteronomy",
            "required": true
          },
          {
            "id": "bbh-bk-deut-7760",
            "g": "שׂוּם",
            "e": "to put",
            "translit": "sum",
            "notes": "Deuteronomy · 24x in Deuteronomy",
            "required": true
          }
        ]
      },
      {
        "key": "book-judg",
        "label": "Judges (advanced)",
        "type": "chapter",
        "cards": [
          {
            "id": "bbh-bk-judg-559",
            "g": "אָמַר",
            "e": "to say",
            "translit": "amar",
            "notes": "Judges · 269x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-6440",
            "g": "פָּנִים",
            "e": "the face",
            "translit": "panim",
            "notes": "Judges · 46x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-7200",
            "g": "רָאָה",
            "e": "to see",
            "translit": "ra'a",
            "notes": "Judges · 44x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-6965",
            "g": "קוּם",
            "e": "to rise",
            "translit": "qum",
            "notes": "Judges · 42x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-2022",
            "g": "הַר",
            "e": "a mountain or range of hills",
            "translit": "har",
            "notes": "Judges · 35x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-505",
            "g": "אֶלֶף",
            "e": "hence",
            "translit": "elef",
            "notes": "Judges · 34x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-3967",
            "g": "מֵאָה",
            "e": "a hundred",
            "translit": "me'a",
            "notes": "Judges · 31x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-3381",
            "g": "יָרַד",
            "e": "to descend",
            "translit": "yarad",
            "notes": "Judges · 29x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-5221",
            "g": "נָכָה",
            "e": "to strike",
            "translit": "nakha",
            "notes": "Judges · 29x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-7725",
            "g": "שׁוּב",
            "e": "to turn back",
            "translit": "shuv",
            "notes": "Judges · 29x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-5046",
            "g": "נָגַד",
            "e": "to front",
            "translit": "nagad",
            "notes": "Judges · 28x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-3423",
            "g": "יָרַשׁ",
            "e": "to occupy",
            "translit": "yarash",
            "notes": "Judges · 27x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-4264",
            "g": "מַחֲנֶה",
            "e": "an encampment",
            "translit": "machane",
            "notes": "Judges · 27x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-2719",
            "g": "חֶרֶב",
            "e": "drought",
            "translit": "cherev",
            "notes": "Judges · 23x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-5674",
            "g": "עָבַר",
            "e": "to cross over",
            "translit": "avar",
            "notes": "Judges · 23x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-3467",
            "g": "יָשַׁע",
            "e": "to be open",
            "translit": "yasha",
            "notes": "Judges · 21x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-7760",
            "g": "שׂוּם",
            "e": "to put",
            "translit": "sum",
            "notes": "Judges · 21x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-4421",
            "g": "מִלְחָמָה",
            "e": "a battle",
            "translit": "milchama",
            "notes": "Judges · 20x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-1167",
            "g": "בַּעַל",
            "e": "a master",
            "translit": "ba'al",
            "notes": "Judges · 19x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-7451",
            "g": "רַע",
            "e": "bad",
            "translit": "ra",
            "notes": "Judges · 19x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-5493",
            "g": "סוּר",
            "e": "to turn off",
            "translit": "sur",
            "notes": "Judges · 16x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-7626",
            "g": "שֵׁבֶט",
            "e": "a scion",
            "translit": "shevet",
            "notes": "Judges · 16x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-631",
            "g": "אָסַר",
            "e": "to yoke or hitch",
            "translit": "asar",
            "notes": "Judges · 15x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-784",
            "g": "אֵשׁ",
            "e": "fire",
            "translit": "esh",
            "notes": "Judges · 15x in Judges",
            "required": true
          },
          {
            "id": "bbh-bk-judg-3548",
            "g": "כֹּהֵן",
            "e": "one officiating",
            "translit": "kohen",
            "notes": "Judges · 15x in Judges",
            "required": true
          }
        ]
      },
      {
        "key": "book-1sam",
        "label": "1 Samuel (advanced)",
        "type": "chapter",
        "cards": [
          {
            "id": "bbh-bk-1sam-559",
            "g": "אָמַר",
            "e": "to say",
            "translit": "amar",
            "notes": "1 Samuel · 422x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-6440",
            "g": "פָּנִים",
            "e": "the face",
            "translit": "panim",
            "notes": "1 Samuel · 98x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-7200",
            "g": "רָאָה",
            "e": "to see",
            "translit": "ra'a",
            "notes": "1 Samuel · 76x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-5221",
            "g": "נָכָה",
            "e": "to strike",
            "translit": "nakha",
            "notes": "1 Samuel · 53x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-5046",
            "g": "נָגַד",
            "e": "to front",
            "translit": "nagad",
            "notes": "1 Samuel · 52x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-6965",
            "g": "קוּם",
            "e": "to rise",
            "translit": "qum",
            "notes": "1 Samuel · 47x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-7725",
            "g": "שׁוּב",
            "e": "to turn back",
            "translit": "shuv",
            "notes": "1 Samuel · 45x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-3381",
            "g": "יָרַד",
            "e": "to descend",
            "translit": "yarad",
            "notes": "1 Samuel · 42x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-727",
            "g": "אָרוֹן",
            "e": "a box",
            "translit": "aron",
            "notes": "1 Samuel · 40x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-6030",
            "g": "עָנָה",
            "e": "to eye",
            "translit": "ana",
            "notes": "1 Samuel · 38x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-2896",
            "g": "טוֹב",
            "e": "good",
            "translit": "tov",
            "notes": "1 Samuel · 37x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-7760",
            "g": "שׂוּם",
            "e": "to put",
            "translit": "sum",
            "notes": "1 Samuel · 35x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-3627",
            "g": "כְּלִי",
            "e": "something prepared",
            "translit": "keli",
            "notes": "1 Samuel · 33x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-3548",
            "g": "כֹּהֵן",
            "e": "one officiating",
            "translit": "kohen",
            "notes": "1 Samuel · 32x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-4421",
            "g": "מִלְחָמָה",
            "e": "a battle",
            "translit": "milchama",
            "notes": "1 Samuel · 31x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-7451",
            "g": "רַע",
            "e": "bad",
            "translit": "ra",
            "notes": "1 Samuel · 31x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-7592",
            "g": "שָׁאַל",
            "e": "to inquire",
            "translit": "sha'al",
            "notes": "1 Samuel · 31x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-505",
            "g": "אֶלֶף",
            "e": "hence",
            "translit": "elef",
            "notes": "1 Samuel · 28x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-1245",
            "g": "בָּקַשׁ",
            "e": "to search out",
            "translit": "baqash",
            "notes": "1 Samuel · 26x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-2416",
            "g": "חַי",
            "e": "alive",
            "translit": "chay",
            "notes": "1 Samuel · 26x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-5674",
            "g": "עָבַר",
            "e": "to cross over",
            "translit": "avar",
            "notes": "1 Samuel · 26x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-2719",
            "g": "חֶרֶב",
            "e": "drought",
            "translit": "cherev",
            "notes": "1 Samuel · 24x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-3967",
            "g": "מֵאָה",
            "e": "a hundred",
            "translit": "me'a",
            "notes": "1 Samuel · 22x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-4264",
            "g": "מַחֲנֶה",
            "e": "an encampment",
            "translit": "machane",
            "notes": "1 Samuel · 22x in 1 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-1sam-5493",
            "g": "סוּר",
            "e": "to turn off",
            "translit": "sur",
            "notes": "1 Samuel · 22x in 1 Samuel",
            "required": true
          }
        ]
      },
      {
        "key": "book-2sam",
        "label": "2 Samuel (advanced)",
        "type": "chapter",
        "cards": [
          {
            "id": "bbh-bk-2sam-559",
            "g": "אָמַר",
            "e": "to say",
            "translit": "amar",
            "notes": "2 Samuel · 334x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-6440",
            "g": "פָּנִים",
            "e": "the face",
            "translit": "panim",
            "notes": "2 Samuel · 73x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-7725",
            "g": "שׁוּב",
            "e": "to turn back",
            "translit": "shuv",
            "notes": "2 Samuel · 53x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-5674",
            "g": "עָבַר",
            "e": "to cross over",
            "translit": "avar",
            "notes": "2 Samuel · 48x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-5221",
            "g": "נָכָה",
            "e": "to strike",
            "translit": "nakha",
            "notes": "2 Samuel · 47x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-7200",
            "g": "רָאָה",
            "e": "to see",
            "translit": "ra'a",
            "notes": "2 Samuel · 47x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-5046",
            "g": "נָגַד",
            "e": "to front",
            "translit": "nagad",
            "notes": "2 Samuel · 37x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-6965",
            "g": "קוּם",
            "e": "to rise",
            "translit": "qum",
            "notes": "2 Samuel · 37x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-4421",
            "g": "מִלְחָמָה",
            "e": "a battle",
            "translit": "milchama",
            "notes": "2 Samuel · 29x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-2896",
            "g": "טוֹב",
            "e": "good",
            "translit": "tov",
            "notes": "2 Samuel · 26x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-2416",
            "g": "חַי",
            "e": "alive",
            "translit": "chay",
            "notes": "2 Samuel · 24x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-727",
            "g": "אָרוֹן",
            "e": "a box",
            "translit": "aron",
            "notes": "2 Samuel · 21x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-7760",
            "g": "שׂוּם",
            "e": "to put",
            "translit": "sum",
            "notes": "2 Samuel · 21x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-505",
            "g": "אֶלֶף",
            "e": "hence",
            "translit": "elef",
            "notes": "2 Samuel · 19x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-3967",
            "g": "מֵאָה",
            "e": "a hundred",
            "translit": "me'a",
            "notes": "2 Samuel · 19x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-2388",
            "g": "חָזַק",
            "e": "to fasten upon",
            "translit": "chazaq",
            "notes": "2 Samuel · 18x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-3381",
            "g": "יָרַד",
            "e": "to descend",
            "translit": "yarad",
            "notes": "2 Samuel · 18x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-3820",
            "g": "לֵב",
            "e": "the heart",
            "translit": "lev",
            "notes": "2 Samuel · 18x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-7901",
            "g": "שָׁכַב",
            "e": "to lie down",
            "translit": "shakhav",
            "notes": "2 Samuel · 18x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-341",
            "g": "אֹיֵב",
            "e": "hating",
            "translit": "oyev",
            "notes": "2 Samuel · 16x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-1368",
            "g": "גִּבּוֹר",
            "e": "powerful",
            "translit": "gibbor",
            "notes": "2 Samuel · 16x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-5127",
            "g": "נוּס",
            "e": "to flit",
            "translit": "nus",
            "notes": "2 Samuel · 16x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-1058",
            "g": "בָּכָה",
            "e": "to weep",
            "translit": "bakha",
            "notes": "2 Samuel · 15x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-2719",
            "g": "חֶרֶב",
            "e": "drought",
            "translit": "cherev",
            "notes": "2 Samuel · 15x in 2 Samuel",
            "required": true
          },
          {
            "id": "bbh-bk-2sam-6635",
            "g": "צָבָא",
            "e": "a mass of persons",
            "translit": "tsava",
            "notes": "2 Samuel · 15x in 2 Samuel",
            "required": true
          }
        ]
      },
      {
        "key": "book-core",
        "label": "Tanakh core (advanced)",
        "type": "chapter",
        "cards": [
          {
            "id": "bbh-bk-core-559",
            "g": "אָמַר",
            "e": "to say",
            "translit": "amar",
            "notes": "Tanakh core · 2148x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-6440",
            "g": "פָּנִים",
            "e": "the face",
            "translit": "panim",
            "notes": "Tanakh core · 624x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-7200",
            "g": "רָאָה",
            "e": "to see",
            "translit": "ra'a",
            "notes": "Tanakh core · 472x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-7725",
            "g": "שׁוּב",
            "e": "to turn back",
            "translit": "shuv",
            "notes": "Tanakh core · 278x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-6965",
            "g": "קוּם",
            "e": "to rise",
            "translit": "qum",
            "notes": "Tanakh core · 244x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-3205",
            "g": "יָלַד",
            "e": "to bear young",
            "translit": "yalad",
            "notes": "Tanakh core · 235x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-7760",
            "g": "שׂוּם",
            "e": "to put",
            "translit": "sum",
            "notes": "Tanakh core · 198x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-5221",
            "g": "נָכָה",
            "e": "to strike",
            "translit": "nakha",
            "notes": "Tanakh core · 195x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-5674",
            "g": "עָבַר",
            "e": "to cross over",
            "translit": "avar",
            "notes": "Tanakh core · 189x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-2022",
            "g": "הַר",
            "e": "a mountain or range of hills",
            "translit": "har",
            "notes": "Tanakh core · 176x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-5046",
            "g": "נָגַד",
            "e": "to front",
            "translit": "nagad",
            "notes": "Tanakh core · 176x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-3967",
            "g": "מֵאָה",
            "e": "a hundred",
            "translit": "me'a",
            "notes": "Tanakh core · 168x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-3381",
            "g": "יָרַד",
            "e": "to descend",
            "translit": "yarad",
            "notes": "Tanakh core · 166x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-2896",
            "g": "טוֹב",
            "e": "good",
            "translit": "tov",
            "notes": "Tanakh core · 156x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-7451",
            "g": "רַע",
            "e": "bad",
            "translit": "ra",
            "notes": "Tanakh core · 154x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-2416",
            "g": "חַי",
            "e": "alive",
            "translit": "chay",
            "notes": "Tanakh core · 153x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-7704",
            "g": "שָׂדֶה",
            "e": "a field",
            "translit": "sade",
            "notes": "Tanakh core · 147x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-2091",
            "g": "זָהָב",
            "e": "gold",
            "translit": "zahav",
            "notes": "Tanakh core · 134x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-6629",
            "g": "צֹאן",
            "e": "a collective name for a flock",
            "translit": "tson",
            "notes": "Tanakh core · 121x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-3701",
            "g": "כֶּסֶף",
            "e": "silver",
            "translit": "kesef",
            "notes": "Tanakh core · 116x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-3820",
            "g": "לֵב",
            "e": "the heart",
            "translit": "lev",
            "notes": "Tanakh core · 114x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-3423",
            "g": "יָרַשׁ",
            "e": "to occupy",
            "translit": "yarash",
            "notes": "Tanakh core · 112x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-4421",
            "g": "מִלְחָמָה",
            "e": "a battle",
            "translit": "milchama",
            "notes": "Tanakh core · 105x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-4196",
            "g": "מִזְבֵּחַ",
            "e": "an altar",
            "translit": "mizbecha",
            "notes": "Tanakh core · 102x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-6310",
            "g": "פֶּה",
            "e": "the mouth",
            "translit": "pe",
            "notes": "Tanakh core · 102x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-6030",
            "g": "עָנָה",
            "e": "to eye",
            "translit": "ana",
            "notes": "Tanakh core · 101x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-505",
            "g": "אֶלֶף",
            "e": "hence",
            "translit": "elef",
            "notes": "Tanakh core · 100x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-1242",
            "g": "בֹּקֶר",
            "e": "dawn",
            "translit": "boqer",
            "notes": "Tanakh core · 100x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-6086",
            "g": "עֵץ",
            "e": "a tree",
            "translit": "ets",
            "notes": "Tanakh core · 98x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-727",
            "g": "אָרוֹן",
            "e": "a box",
            "translit": "aron",
            "notes": "Tanakh core · 97x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-8432",
            "g": "תָּוֶךְ",
            "e": "a bisection",
            "translit": "tavekh",
            "notes": "Tanakh core · 97x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-68",
            "g": "אֶבֶן",
            "e": "a stone",
            "translit": "even",
            "notes": "Tanakh core · 93x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-3627",
            "g": "כְּלִי",
            "e": "something prepared",
            "translit": "keli",
            "notes": "Tanakh core · 93x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-3915",
            "g": "לַיִל",
            "e": "a twist",
            "translit": "layil",
            "notes": "Tanakh core · 93x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-5493",
            "g": "סוּר",
            "e": "to turn off",
            "translit": "sur",
            "notes": "Tanakh core · 91x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-4264",
            "g": "מַחֲנֶה",
            "e": "an encampment",
            "translit": "machane",
            "notes": "Tanakh core · 90x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-3548",
            "g": "כֹּהֵן",
            "e": "one officiating",
            "translit": "kohen",
            "notes": "Tanakh core · 88x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-120",
            "g": "אָדָם",
            "e": "ruddy i.e. a human being",
            "translit": "adam",
            "notes": "Tanakh core · 87x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-2421",
            "g": "חָיָה",
            "e": "to live",
            "translit": "chaya",
            "notes": "Tanakh core · 87x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-4057",
            "g": "מִדְבָּר",
            "e": "a pasture",
            "translit": "midbar",
            "notes": "Tanakh core · 86x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-7592",
            "g": "שָׁאַל",
            "e": "to inquire",
            "translit": "sha'al",
            "notes": "Tanakh core · 85x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-2719",
            "g": "חֶרֶב",
            "e": "drought",
            "translit": "cherev",
            "notes": "Tanakh core · 84x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-3254",
            "g": "יָסַף",
            "e": "to add or augment",
            "translit": "yasaf",
            "notes": "Tanakh core · 84x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-8179",
            "g": "שַׁעַר",
            "e": "an opening",
            "translit": "sha'ar",
            "notes": "Tanakh core · 84x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-905",
            "g": "בַּד",
            "e": "separation",
            "translit": "bad",
            "notes": "Tanakh core · 83x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-7650",
            "g": "שָׁבַע",
            "e": "to seven oneself",
            "translit": "shava",
            "notes": "Tanakh core · 82x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-7901",
            "g": "שָׁכַב",
            "e": "to lie down",
            "translit": "shakhav",
            "notes": "Tanakh core · 82x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-8269",
            "g": "שַׂר",
            "e": "a head person",
            "translit": "sar",
            "notes": "Tanakh core · 81x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-6944",
            "g": "קֹדֶשׁ",
            "e": "a sacred place or thing",
            "translit": "qodesh",
            "notes": "Tanakh core · 79x in corpus",
            "required": true
          },
          {
            "id": "bbh-bk-core-341",
            "g": "אֹיֵב",
            "e": "hating",
            "translit": "oyev",
            "notes": "Tanakh core · 77x in corpus",
            "required": true
          }
        ]
      }
    ]
  };
})();
