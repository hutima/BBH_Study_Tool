// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_reader_data.mjs
// (sources: source/bbh/reader/corpus-pin.json, gate-map.json, selections.json
// + a fresh run of tools/import_oshb_reader.mjs against the pinned OSHB
// checkout — see that file's header. NOT a hand-authored source itself.)
//
// Phase 2 PR D curated Reader passages. Self-registers on
// window.BBH_READER as a CLASSIC (non-module) script — same idiom as
// js/data/bbh_vocab.js registering window.SETS and js/data/bbh_parsing.js
// registering window.BBH_PARSING — so it can be dropped into index.html's
// plain <script> tags without touching the ES-module import graph. Wired
// into index.html's <script> tags and sw.js's precache list.
//
// Shape: { schemaVersion, attribution, corpusPin: {tag, commit},
// passages: [{ id, book, ref, gateLesson, tier, challengeNote?, wooden,
// woodenStatus, tokens: [{t,l,s,m,g,pn,gent?,v,gl,lx}] }] }. `book` is the
// OSIS book code (Gen, Ruth, Jonah, Exod, Deut, Judg, 1Sam, 2Sam) — added
// by the multi-book Reader expansion; `challengeNote` is present only on
// tier:"challenge" passages. `wooden`/`woodenStatus`, `gent`, and the
// token-level `gl`/`lx` fields were added in task 13a (Strong's glosses +
// wooden translations + gentilic/compound-token matcher fixes) — see
// buildToken()/buildPassage() below and tools/gen_strongs_glosses.mjs.
// Token field meanings are documented above buildToken() in
// tools/gen_bbh_reader_data.mjs. `t` (display) is preserved byte-for-byte
// from the Westminster Leningrad Codex text as distributed by OSHB — never
// NFC-normalized or otherwise mutated anywhere in this pipeline.
//
// Never edit this file by hand — re-run the generator instead. Never edit
// source/bbh/reader/*.json from here or anywhere else.
(function () {
  window.BBH_READER = {
    "schemaVersion": 1,
    "attribution": "Hebrew text and morphology from the Open Scriptures Hebrew Bible Project (https://github.com/openscriptures/morphhb), OSHB version 2.2. Lemma and morphology data licensed under CC BY 4.0.",
    "corpusPin": {
      "tag": "v.2.2",
      "commit": "6a5db284c715c18b239422e57bb89684e6a19f00"
    },
    "passages": [
      {
        "id": "reader-gen-22-22",
        "book": "Gen",
        "ref": "Gen 22:22",
        "gateLesson": 13,
        "tier": "strict",
        "wooden": "and Kesed, and Chazo, and Pildash, and Jidlaph, and Bethuel.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "כֶּ֣שֶׂד",
            "l": "3777",
            "s": "3777",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Kesed",
            "lx": "כֶּשֶׂד"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "חֲז֔וֹ",
            "l": "2375",
            "s": "2375",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Chazo",
            "lx": "חֲזוֹ"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "פִּלְדָּ֖שׁ",
            "l": "6394",
            "s": "6394",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Pildash",
            "lx": "פִּלְדָּשׁ"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "יִדְלָ֑ף",
            "l": "3044",
            "s": "3044",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jidlaph",
            "lx": "יִדְלָף"
          },
          {
            "t": "וְ/אֵ֖ת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "בְּתוּאֵֽל",
            "l": "1328 a",
            "s": "1328",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Bethuel",
            "lx": "בְּתוּאֵל"
          }
        ]
      },
      {
        "id": "reader-gen-25-14",
        "book": "Gen",
        "ref": "Gen 25:14",
        "gateLesson": 13,
        "tier": "strict",
        "wooden": "and Mishma, and Dumah, and Massa,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וּ/מִשְׁמָ֥ע",
            "l": "c/4927",
            "s": "4927",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Mishma",
            "lx": "מִשְׁמָע"
          },
          {
            "t": "וְ/דוּמָ֖ה",
            "l": "c/1746",
            "s": "1746",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Dumah",
            "lx": "דּוּמָה"
          },
          {
            "t": "וּ/מַשָּֽׂא",
            "l": "c/4854",
            "s": "4854",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Massa",
            "lx": "מַשָּׂא"
          }
        ]
      },
      {
        "id": "reader-gen-25-15",
        "book": "Gen",
        "ref": "Gen 25:15",
        "gateLesson": 13,
        "tier": "strict",
        "wooden": "Chadad, and Tema, Jetur, Naphish, and Kedemah.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "חֲדַ֣ד",
            "l": "2301",
            "s": "2301",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Chadad",
            "lx": "חֲדַד"
          },
          {
            "t": "וְ/תֵימָ֔א",
            "l": "c/8485",
            "s": "8485",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Tema",
            "lx": "תֵּימָא"
          },
          {
            "t": "יְט֥וּר",
            "l": "3195",
            "s": "3195",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jetur",
            "lx": "יְטוּר"
          },
          {
            "t": "נָפִ֖ישׁ",
            "l": "5305",
            "s": "5305",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Naphish",
            "lx": "נָפִישׁ"
          },
          {
            "t": "וָ/קֵֽדְמָה",
            "l": "c/6929",
            "s": "6929",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Kedemah",
            "lx": "קֵדְמָה"
          }
        ]
      },
      {
        "id": "reader-gen-10-27",
        "book": "Gen",
        "ref": "Gen 10:27",
        "gateLesson": 13,
        "tier": "strict",
        "wooden": "and Hadoram, and Uzal, and Diklah,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הֲדוֹרָ֥ם",
            "l": "1913 a",
            "s": "1913",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Hadoram",
            "lx": "הֲדוֹרָם"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "אוּזָ֖ל",
            "l": "187",
            "s": "187",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Uzal",
            "lx": "אוּזָל"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "דִּקְלָֽה",
            "l": "1853",
            "s": "1853",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Diklah",
            "lx": "דִּקְלָה"
          }
        ]
      },
      {
        "id": "reader-gen-10-16",
        "book": "Gen",
        "ref": "Gen 10:16",
        "gateLesson": 13,
        "tier": "strict",
        "wooden": "and the Jebusite, and the Amorite, and the Girgashite,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הַ/יְבוּסִי֙",
            "l": "d/2983",
            "s": "2983",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": true,
            "v": 8,
            "gl": "a Jebusite or inhabitant of Jebus",
            "lx": "יְבוּסִי",
            "gent": true
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הָ֣/אֱמֹרִ֔י",
            "l": "d/567",
            "s": "567",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": true,
            "v": 8,
            "gl": "an Emorite",
            "lx": "אֱמֹרִי",
            "gent": true
          },
          {
            "t": "וְ/אֵ֖ת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הַ/גִּרְגָּשִֽׁי",
            "l": "d/1622",
            "s": "1622",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": true,
            "v": 8,
            "gl": "a Girgashite",
            "lx": "גִּרְגָּשִׁי",
            "gent": true
          }
        ]
      },
      {
        "id": "reader-gen-10-17",
        "book": "Gen",
        "ref": "Gen 10:17",
        "gateLesson": 13,
        "tier": "strict",
        "wooden": "and the Hivite, and the Arkite, and the Sinite,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הַֽ/חִוִּ֥י",
            "l": "d/2340",
            "s": "2340",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": true,
            "v": null,
            "gl": "a Chivvite",
            "lx": "חִוִּי",
            "gent": true
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הַֽ/עַרְקִ֖י",
            "l": "d/6208",
            "s": "6208",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": true,
            "v": null,
            "gl": "an Arkite or inhabitant of Erek",
            "lx": "עַרְקִי",
            "gent": true
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הַ/סִּינִֽי",
            "l": "d/5513",
            "s": "5513",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": true,
            "v": 8,
            "gl": "a Sinite",
            "lx": "סִינִי",
            "gent": true
          }
        ]
      },
      {
        "id": "reader-gen-10-26",
        "book": "Gen",
        "ref": "Gen 10:26",
        "gateLesson": 16,
        "tier": "strict",
        "wooden": "And Joktan fathered Almodad, and Sheleph, and Chatsarmaveth, and Jerach,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/יָקְטָ֣ן",
            "l": "c/3355",
            "s": "3355",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Joktan",
            "lx": "יׇקְטָן"
          },
          {
            "t": "יָלַ֔ד",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null,
            "gl": "to bear young",
            "lx": "יָלַד"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "אַלְמוֹדָ֖ד",
            "l": "486",
            "s": "486",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Almodad",
            "lx": "אַלְמוֹדָד"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "שָׁ֑לֶף",
            "l": "8026",
            "s": "8026",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Sheleph",
            "lx": "שֶׁלֶף"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "חֲצַרְמָ֖וֶת",
            "l": "2700",
            "s": "2700",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Chatsarmaveth",
            "lx": "חֲצַרְמָוֶת"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "יָֽרַח",
            "l": "3392",
            "s": "3392",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jerach",
            "lx": "יֶרַח"
          }
        ]
      },
      {
        "id": "reader-gen-16-14",
        "book": "Gen",
        "ref": "Gen 16:14",
        "gateLesson": 16,
        "tier": "strict",
        "wooden": "Therefore he called the well Beer-Lachai-Roi; behold, between Kadesh and between Bered.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "עַל",
            "l": "5921 a",
            "s": "5921",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 13,
            "gl": "above",
            "lx": "עַל"
          },
          {
            "t": "כֵּן֙",
            "l": "3651 c",
            "s": "3651",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "set upright",
            "lx": "כֵּן"
          },
          {
            "t": "קָרָ֣א",
            "l": "7121",
            "s": "7121",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 16,
            "gl": "to call out to",
            "lx": "קָרָא"
          },
          {
            "t": "לַ/בְּאֵ֔ר",
            "l": "l/875",
            "s": "875",
            "m": "HRd/Ncfsa",
            "g": 13,
            "pn": false,
            "v": null,
            "gl": "a pit",
            "lx": "בְּאֵר"
          },
          {
            "t": "בְּאֵ֥ר",
            "l": "883+",
            "s": "883",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Beer-Lachai-Roi",
            "lx": "בְּאֵר לַחַי רֹאִי"
          },
          {
            "t": "לַחַ֖י",
            "l": "883+",
            "s": "883",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Beer-Lachai-Roi",
            "lx": "בְּאֵר לַחַי רֹאִי"
          },
          {
            "t": "רֹאִ֑י",
            "l": "883",
            "s": "883",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Beer-Lachai-Roi",
            "lx": "בְּאֵר לַחַי רֹאִי"
          },
          {
            "t": "הִנֵּ֥ה",
            "l": "2009",
            "s": "2009",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": 22,
            "gl": "lo!",
            "lx": "הִנֵּה"
          },
          {
            "t": "בֵין",
            "l": "996",
            "s": "996",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 26,
            "gl": "between",
            "lx": "בֵּין"
          },
          {
            "t": "קָדֵ֖שׁ",
            "l": "6946",
            "s": "6946",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Kadesh",
            "lx": "קָדֵשׁ"
          },
          {
            "t": "וּ/בֵ֥ין",
            "l": "c/996",
            "s": "996",
            "m": "HC/R",
            "g": 13,
            "pn": false,
            "v": 26,
            "gl": "between",
            "lx": "בֵּין"
          },
          {
            "t": "בָּֽרֶד",
            "l": "1260",
            "s": "1260",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Bered",
            "lx": "בֶּרֶד"
          }
        ]
      },
      {
        "id": "reader-gen-1-1",
        "book": "Gen",
        "ref": "Gen 1:1",
        "gateLesson": 16,
        "tier": "strict",
        "wooden": "In beginning, God created the heavens and the earth.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "בְּ/רֵאשִׁ֖ית",
            "l": "b/7225",
            "s": "7225",
            "m": "HR/Ncfsa",
            "g": 13,
            "pn": false,
            "v": null,
            "gl": "the first",
            "lx": "רֵאשִׁית"
          },
          {
            "t": "בָּרָ֣א",
            "l": "1254 a",
            "s": "1254",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 24,
            "gl": "(absolutely) to create",
            "lx": "בָּרָא"
          },
          {
            "t": "אֱלֹהִ֑ים",
            "l": "430",
            "s": "430",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 3,
            "gl": "gods in the ordinary sense",
            "lx": "אֱלֹהִים"
          },
          {
            "t": "אֵ֥ת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הַ/שָּׁמַ֖יִם",
            "l": "d/8064",
            "s": "8064",
            "m": "HTd/Ncmpa",
            "g": 10,
            "pn": false,
            "v": 13,
            "gl": "the sky",
            "lx": "שָׁמַיִם"
          },
          {
            "t": "וְ/אֵ֥ת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הָ/אָֽרֶץ",
            "l": "d/776",
            "s": "776",
            "m": "HTd/Ncbsa",
            "g": 8,
            "pn": false,
            "v": 9,
            "gl": "the earth",
            "lx": "אֶרֶץ"
          }
        ]
      },
      {
        "id": "reader-gen-10-24",
        "book": "Gen",
        "ref": "Gen 10:24",
        "gateLesson": 16,
        "tier": "guided",
        "wooden": "And Arpakshad fathered Shelach, and Shelach fathered Eber.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אַרְפַּכְשַׁ֖ד",
            "l": "c/775",
            "s": "775",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Arpakshad",
            "lx": "אַרְפַּכְשַׁד"
          },
          {
            "t": "יָלַ֣ד",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null,
            "gl": "to bear young",
            "lx": "יָלַד"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "שָׁ֑לַח",
            "l": "7974",
            "s": "7974",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Shelach",
            "lx": "שֶׁלַח"
          },
          {
            "t": "וְ/שֶׁ֖לַח",
            "l": "c/7974",
            "s": "7974",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Shelach",
            "lx": "שֶׁלַח"
          },
          {
            "t": "יָלַ֥ד",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null,
            "gl": "to bear young",
            "lx": "יָלַד"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "עֵֽבֶר",
            "l": "5677",
            "s": "5677",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Eber",
            "lx": "עֵבֵר"
          }
        ]
      },
      {
        "id": "reader-gen-22-21",
        "book": "Gen",
        "ref": "Gen 22:21",
        "gateLesson": 22,
        "tier": "strict",
        "wooden": "Uz his firstborn, and Buz his brother, and Kemuel father of Aram.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "ע֥וּץ",
            "l": "5780",
            "s": "5780",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Uts",
            "lx": "עוּץ"
          },
          {
            "t": "בְּכֹר֖/וֹ",
            "l": "1060",
            "s": "1060",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": null,
            "gl": "firstborn",
            "lx": "בְּכוֹר"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "בּ֣וּז",
            "l": "938",
            "s": "938",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Buz",
            "lx": "בּוּז"
          },
          {
            "t": "אָחִ֑י/ו",
            "l": "251",
            "s": "251",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 10,
            "gl": "a brother",
            "lx": "אָח"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "קְמוּאֵ֖ל",
            "l": "7055",
            "s": "7055",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Kemuel",
            "lx": "קְמוּאֵל"
          },
          {
            "t": "אֲבִ֥י",
            "l": "1",
            "s": "1",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "father",
            "lx": "אָב"
          },
          {
            "t": "אֲרָֽם",
            "l": "758",
            "s": "758",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Aram or Syria",
            "lx": "אֲרָם"
          }
        ]
      },
      {
        "id": "reader-gen-46-23",
        "book": "Gen",
        "ref": "Gen 46:23",
        "gateLesson": 20,
        "tier": "strict",
        "wooden": "And the sons of Dan: Chushim.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וּ/בְנֵי",
            "l": "c/1121 a",
            "s": "1121",
            "m": "HC/Ncmpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "דָ֖ן",
            "l": "1835",
            "s": "1835",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Dan",
            "lx": "דָּן"
          },
          {
            "t": "חֻשִֽׁים",
            "l": "2366 b",
            "s": "2366",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Chushim",
            "lx": "חוּשִׁים"
          }
        ]
      },
      {
        "id": "reader-gen-35-24",
        "book": "Gen",
        "ref": "Gen 35:24",
        "gateLesson": 20,
        "tier": "strict",
        "wooden": "The sons of Rachel: Joseph and Binyamin.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "בְּנֵ֣י",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "רָחֵ֔ל",
            "l": "7354",
            "s": "7354",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Rachel",
            "lx": "רָחֵל"
          },
          {
            "t": "יוֹסֵ֖ף",
            "l": "3130",
            "s": "3130",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Joseph",
            "lx": "יוֹסֵף"
          },
          {
            "t": "וּ/בִנְיָמִֽן",
            "l": "c/1144",
            "s": "1144",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Binjamin",
            "lx": "בִּנְיָמִין"
          }
        ]
      },
      {
        "id": "reader-gen-10-3",
        "book": "Gen",
        "ref": "Gen 10:3",
        "gateLesson": 20,
        "tier": "strict",
        "wooden": "And the sons of Gomer: Ashkenaz, and Riphath, and Togarmah.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וּ/בְנֵ֖י",
            "l": "c/1121 a",
            "s": "1121",
            "m": "HC/Ncmpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "גֹּ֑מֶר",
            "l": "1586",
            "s": "1586",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Gomer",
            "lx": "גֹּמֶר"
          },
          {
            "t": "אַשְׁכֲּנַ֥ז",
            "l": "813",
            "s": "813",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Ashkenaz",
            "lx": "אַשְׁכְּנַז"
          },
          {
            "t": "וְ/רִיפַ֖ת",
            "l": "c/7384 b",
            "s": "7384",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Riphath",
            "lx": "רִיפַת"
          },
          {
            "t": "וְ/תֹגַרְמָֽה",
            "l": "c/8425",
            "s": "8425",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Togarmah",
            "lx": "תּוֹגַרְמָה"
          }
        ]
      },
      {
        "id": "reader-gen-10-15",
        "book": "Gen",
        "ref": "Gen 10:15",
        "gateLesson": 22,
        "tier": "guided",
        "wooden": "And Kenaan fathered Tsidon his firstborn, and Cheth,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וּ/כְנַ֗עַן",
            "l": "c/3667 a",
            "s": "3667",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Kenaan",
            "lx": "כְּנַעַן"
          },
          {
            "t": "יָלַ֛ד",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null,
            "gl": "to bear young",
            "lx": "יָלַד"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "צִידֹ֥ן",
            "l": "6721",
            "s": "6721",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Tsidon",
            "lx": "צִידוֹן"
          },
          {
            "t": "בְּכֹר֖/וֹ",
            "l": "1060",
            "s": "1060",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": null,
            "gl": "firstborn",
            "lx": "בְּכוֹר"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "חֵֽת",
            "l": "2845",
            "s": "2845",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Cheth",
            "lx": "חֵת"
          }
        ]
      },
      {
        "id": "reader-gen-17-4",
        "book": "Gen",
        "ref": "Gen 17:4",
        "gateLesson": 22,
        "tier": "guided",
        "wooden": "As for me, behold, my covenant is with you, and you shall become father of a multitude of nations.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "אֲנִ֕י",
            "l": "589",
            "s": "589",
            "m": "HPp1cs",
            "g": 5,
            "pn": false,
            "v": 5,
            "gl": "I",
            "lx": "אֲנִי"
          },
          {
            "t": "הִנֵּ֥ה",
            "l": "2009",
            "s": "2009",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": 22,
            "gl": "lo!",
            "lx": "הִנֵּה"
          },
          {
            "t": "בְרִיתִ֖/י",
            "l": "1285",
            "s": "1285",
            "m": "HNcfsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 7,
            "gl": "a compact",
            "lx": "בְּרִית"
          },
          {
            "t": "אִתָּ֑/ךְ",
            "l": "854",
            "s": "854",
            "m": "HR/Sp2fs",
            "g": 22,
            "pn": false,
            "v": 5,
            "gl": "nearness",
            "lx": "אֵת"
          },
          {
            "t": "וְ/הָיִ֕יתָ",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqq2ms",
            "g": 16,
            "pn": false,
            "v": 16,
            "gl": "to exist",
            "lx": "הָיָה"
          },
          {
            "t": "לְ/אַ֖ב",
            "l": "l/1",
            "s": "1",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "father",
            "lx": "אָב"
          },
          {
            "t": "הֲמ֥וֹן",
            "l": "1995 a",
            "s": "1995",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": null,
            "gl": "a noise",
            "lx": "הָמוֹן"
          },
          {
            "t": "גּוֹיִֽם",
            "l": "1471 a",
            "s": "1471",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": null,
            "gl": "a foreign nation",
            "lx": "גּוֹי"
          }
        ]
      },
      {
        "id": "reader-gen-24-38",
        "book": "Gen",
        "ref": "Gen 24:38",
        "gateLesson": 23,
        "tier": "strict",
        "wooden": "If not, to the house of my father you shall go, and to my clan, and you shall take a woman for my son.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "אִם",
            "l": "518 a",
            "s": "518",
            "m": "HC",
            "g": 13,
            "pn": false,
            "v": 7,
            "gl": "used very widely as demonstrative",
            "lx": "אִם"
          },
          {
            "t": "לֹ֧א",
            "l": "3808",
            "s": "3808",
            "m": "HTn",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "not",
            "lx": "לֹא"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "בֵּית",
            "l": "1004 b",
            "s": "1004",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 8,
            "gl": "a house",
            "lx": "בַּיִת"
          },
          {
            "t": "אָבִ֛/י",
            "l": "1",
            "s": "1",
            "m": "HNcmsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 7,
            "gl": "father",
            "lx": "אָב"
          },
          {
            "t": "תֵּלֵ֖ךְ",
            "l": "3212",
            "s": "3212",
            "m": "HVqi2ms",
            "g": 23,
            "pn": false,
            "v": 16,
            "gl": "to walk",
            "lx": "יָלַךְ"
          },
          {
            "t": "וְ/אֶל",
            "l": "c/413",
            "s": "413",
            "m": "HC/R",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "מִשְׁפַּחְתִּ֑/י",
            "l": "4940",
            "s": "4940",
            "m": "HNcfsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": null,
            "gl": "a family",
            "lx": "מִשְׁפָּחָה"
          },
          {
            "t": "וְ/לָקַחְתָּ֥",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqq2ms",
            "g": 16,
            "pn": false,
            "v": 16,
            "gl": "to take",
            "lx": "לָקַח"
          },
          {
            "t": "אִשָּׁ֖ה",
            "l": "802",
            "s": "802",
            "m": "HNcfsa",
            "g": 7,
            "pn": false,
            "v": 6,
            "gl": "a woman",
            "lx": "אִשָּׁה"
          },
          {
            "t": "לִ/בְנִֽ/י",
            "l": "l/1121 a",
            "s": "1121",
            "m": "HR/Ncmsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          }
        ]
      },
      {
        "id": "reader-gen-24-4",
        "book": "Gen",
        "ref": "Gen 24:4",
        "gateLesson": 23,
        "tier": "strict",
        "wooden": "For to my land and to my birthplace you shall go, and you shall take a woman for my son, for Yitschak.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "כִּ֧י",
            "l": "3588 a",
            "s": "3588",
            "m": "HC",
            "g": 13,
            "pn": false,
            "v": 30,
            "gl": "for, that, because, when",
            "lx": "כִּי"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "אַרְצִ֛/י",
            "l": "776",
            "s": "776",
            "m": "HNcbsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 9,
            "gl": "the earth",
            "lx": "אֶרֶץ"
          },
          {
            "t": "וְ/אֶל",
            "l": "c/413",
            "s": "413",
            "m": "HC/R",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "מוֹלַדְתִּ֖/י",
            "l": "4138",
            "s": "4138",
            "m": "HNcfsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": null,
            "gl": "nativity",
            "lx": "מוֹלֶדֶת"
          },
          {
            "t": "תֵּלֵ֑ךְ",
            "l": "3212",
            "s": "3212",
            "m": "HVqi2ms",
            "g": 23,
            "pn": false,
            "v": 16,
            "gl": "to walk",
            "lx": "יָלַךְ"
          },
          {
            "t": "וְ/לָקַחְתָּ֥",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqp2ms",
            "g": 16,
            "pn": false,
            "v": 16,
            "gl": "to take",
            "lx": "לָקַח"
          },
          {
            "t": "אִשָּׁ֖ה",
            "l": "802",
            "s": "802",
            "m": "HNcfsa",
            "g": 7,
            "pn": false,
            "v": 6,
            "gl": "a woman",
            "lx": "אִשָּׁה"
          },
          {
            "t": "לִ/בְנִ֥/י",
            "l": "l/1121 a",
            "s": "1121",
            "m": "HR/Ncmsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "לְ/יִצְחָֽק",
            "l": "l/3327",
            "s": "3327",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Jitschak",
            "lx": "יִצְחָק"
          }
        ]
      },
      {
        "id": "reader-gen-20-18",
        "book": "Gen",
        "ref": "Gen 20:18",
        "gateLesson": 25,
        "tier": "guided",
        "wooden": "For closing, YHWH had closed every womb belonging to the house of Abimelek, on account of the word of Sarah, wife of Abraham.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "כִּֽי",
            "l": "3588 a",
            "s": "3588",
            "m": "HC",
            "g": 13,
            "pn": false,
            "v": null,
            "gl": "for, that, because, when",
            "lx": "כִּי"
          },
          {
            "t": "עָצֹ֤ר",
            "l": "6113",
            "s": "6113",
            "m": "HVqa",
            "g": 25,
            "pn": false,
            "v": null,
            "gl": "to inclose",
            "lx": "עָצָר"
          },
          {
            "t": "עָצַר֙",
            "l": "6113",
            "s": "6113",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null,
            "gl": "to inclose",
            "lx": "עָצָר"
          },
          {
            "t": "יְהוָ֔ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "בְּעַ֥ד",
            "l": "1157",
            "s": "1157",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null,
            "gl": "in up to or over against",
            "lx": "בְּעַד"
          },
          {
            "t": "כָּל",
            "l": "3605",
            "s": "3605",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 11,
            "gl": "the whole",
            "lx": "כֹּל"
          },
          {
            "t": "רֶ֖חֶם",
            "l": "7358",
            "s": "7358",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null,
            "gl": "the womb",
            "lx": "רֶחֶם"
          },
          {
            "t": "לְ/בֵ֣ית",
            "l": "l/1004 b",
            "s": "1004",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 8,
            "gl": "a house",
            "lx": "בַּיִת"
          },
          {
            "t": "אֲבִימֶ֑לֶךְ",
            "l": "40",
            "s": "40",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Abimelek",
            "lx": "אֲבִימֶלֶךְ"
          },
          {
            "t": "עַל",
            "l": "5921 a",
            "s": "5921",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 13,
            "gl": "above",
            "lx": "עַל"
          },
          {
            "t": "דְּבַ֥ר",
            "l": "1697",
            "s": "1697",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 5,
            "gl": "a word",
            "lx": "דָּבָר"
          },
          {
            "t": "שָׂרָ֖ה",
            "l": "8283",
            "s": "8283",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Sarah",
            "lx": "שָׂרָה"
          },
          {
            "t": "אֵ֥שֶׁת",
            "l": "802",
            "s": "802",
            "m": "HNcfsc",
            "g": 20,
            "pn": false,
            "v": 6,
            "gl": "a woman",
            "lx": "אִשָּׁה"
          },
          {
            "t": "אַבְרָהָֽם",
            "l": "85",
            "s": "85",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Abraham",
            "lx": "אַבְרָהָם"
          }
        ]
      },
      {
        "id": "reader-gen-24-1",
        "book": "Gen",
        "ref": "Gen 24:1",
        "gateLesson": 29,
        "tier": "strict",
        "wooden": "And Abraham was old, come into days, and YHWH had blessed Abraham in everything.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אַבְרָהָ֣ם",
            "l": "c/85",
            "s": "85",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Abraham",
            "lx": "אַבְרָהָם"
          },
          {
            "t": "זָקֵ֔ן",
            "l": "2204",
            "s": "2204",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 38,
            "gl": "to be old",
            "lx": "זָקֵן"
          },
          {
            "t": "בָּ֖א",
            "l": "935",
            "s": "935",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          },
          {
            "t": "בַּ/יָּמִ֑ים",
            "l": "b/3117",
            "s": "3117",
            "m": "HRd/Ncmpa",
            "g": 13,
            "pn": false,
            "v": 13,
            "gl": "a day",
            "lx": "יוֹם"
          },
          {
            "t": "וַֽ/יהוָ֛ה",
            "l": "c/3068",
            "s": "3068",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "בֵּרַ֥ךְ",
            "l": "1288",
            "s": "1288",
            "m": "HVpp3ms",
            "g": 29,
            "pn": false,
            "v": 49,
            "gl": "to kneel",
            "lx": "בָרַךְ"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "אַבְרָהָ֖ם",
            "l": "85",
            "s": "85",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Abraham",
            "lx": "אַבְרָהָם"
          },
          {
            "t": "בַּ/כֹּֽל",
            "l": "b/3605",
            "s": "3605",
            "m": "HRd/Ncmsa",
            "g": 13,
            "pn": false,
            "v": null,
            "gl": "the whole",
            "lx": "כֹּל"
          }
        ]
      },
      {
        "id": "reader-gen-49-18",
        "book": "Gen",
        "ref": "Gen 49:18",
        "gateLesson": 29,
        "tier": "guided",
        "wooden": "For your salvation I have waited, YHWH.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "לִֽ/ישׁוּעָתְ/ךָ֖",
            "l": "l/3444",
            "s": "3444",
            "m": "HR/Ncfsc/Sp2ms",
            "g": 22,
            "pn": false,
            "v": null,
            "gl": "something saved",
            "lx": "יְשׁוּעָה"
          },
          {
            "t": "קִוִּ֥יתִי",
            "l": "6960 a",
            "s": "6960",
            "m": "HVpp1cs",
            "g": 29,
            "pn": false,
            "v": null,
            "gl": "to bind together",
            "lx": "קָוָה"
          },
          {
            "t": "יְהוָֽה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          }
        ]
      },
      {
        "id": "reader-gen-49-5",
        "book": "Gen",
        "ref": "Gen 49:5",
        "gateLesson": 31,
        "tier": "guided",
        "wooden": "Shimon and Levi are brothers; weapons of violence are their swords.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "שִׁמְע֥וֹן",
            "l": "8095",
            "s": "8095",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Shimon",
            "lx": "שִׁמְעוֹן"
          },
          {
            "t": "וְ/לֵוִ֖י",
            "l": "c/3878",
            "s": "3878",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Levi",
            "lx": "לֵוִי"
          },
          {
            "t": "אַחִ֑ים",
            "l": "251",
            "s": "251",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 10,
            "gl": "a brother",
            "lx": "אָח"
          },
          {
            "t": "כְּלֵ֥י",
            "l": "3627",
            "s": "3627",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": null,
            "gl": "something prepared",
            "lx": "כְּלִי"
          },
          {
            "t": "חָמָ֖ס",
            "l": "2555",
            "s": "2555",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null,
            "gl": "violence",
            "lx": "חָמָס"
          },
          {
            "t": "מְכֵרֹתֵי/הֶֽם",
            "l": "4380",
            "s": "4380",
            "m": "HNcfpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": null,
            "gl": "a sword",
            "lx": "מְכֵרָה"
          }
        ]
      },
      {
        "id": "reader-gen-36-25",
        "book": "Gen",
        "ref": "Gen 36:25",
        "gateLesson": 33,
        "tier": "strict",
        "wooden": "And these are the sons of Anah: Dishon; and Oholibamah daughter of Anah.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אֵ֥לֶּה",
            "l": "c/428",
            "s": "428",
            "m": "HC/Pdxcp",
            "g": 33,
            "pn": false,
            "v": 33,
            "gl": "these or those",
            "lx": "אֵלֶּה"
          },
          {
            "t": "בְנֵֽי",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "עֲנָ֖ה",
            "l": "6034",
            "s": "6034",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Anah",
            "lx": "עֲנָה"
          },
          {
            "t": "דִּשֹׁ֑ן",
            "l": "1787",
            "s": "1787",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Dishon",
            "lx": "דִּישׁוֹן"
          },
          {
            "t": "וְ/אָהֳלִיבָמָ֖ה",
            "l": "c/173",
            "s": "173",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Oholibamah",
            "lx": "אׇהֳלִיבָמָה"
          },
          {
            "t": "בַּת",
            "l": "1323",
            "s": "1323",
            "m": "HNcfsc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a daughter",
            "lx": "בַּת"
          },
          {
            "t": "עֲנָֽה",
            "l": "6034",
            "s": "6034",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Anah",
            "lx": "עֲנָה"
          }
        ]
      },
      {
        "id": "reader-gen-36-26",
        "book": "Gen",
        "ref": "Gen 36:26",
        "gateLesson": 33,
        "tier": "strict",
        "wooden": "And these are the sons of Dishan: Chemdan, and Eshban, and Jithran, and Keran.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אֵ֖לֶּה",
            "l": "c/428",
            "s": "428",
            "m": "HC/Pdxcp",
            "g": 33,
            "pn": false,
            "v": 33,
            "gl": "these or those",
            "lx": "אֵלֶּה"
          },
          {
            "t": "בְּנֵ֣י",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "דִישָׁ֑ן",
            "l": "1789",
            "s": "1789",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Dishan",
            "lx": "דִּישָׁן"
          },
          {
            "t": "חֶמְדָּ֥ן",
            "l": "2533",
            "s": "2533",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Chemdan",
            "lx": "חֶמְדָּן"
          },
          {
            "t": "וְ/אֶשְׁבָּ֖ן",
            "l": "c/790",
            "s": "790",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Eshban",
            "lx": "אֶשְׁבָּן"
          },
          {
            "t": "וְ/יִתְרָ֥ן",
            "l": "c/3506",
            "s": "3506",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Jithran",
            "lx": "יִתְרָן"
          },
          {
            "t": "וּ/כְרָֽן",
            "l": "c/3763",
            "s": "3763",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Keran",
            "lx": "כְּרָן"
          }
        ]
      },
      {
        "id": "reader-gen-36-27",
        "book": "Gen",
        "ref": "Gen 36:27",
        "gateLesson": 33,
        "tier": "strict",
        "wooden": "These are the sons of Etser: Bilhan, and Zaavan, and Akan.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "אֵ֖לֶּה",
            "l": "428",
            "s": "428",
            "m": "HPdxcp",
            "g": 33,
            "pn": false,
            "v": 33,
            "gl": "these or those",
            "lx": "אֵלֶּה"
          },
          {
            "t": "בְּנֵי",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "אֵ֑צֶר",
            "l": "687",
            "s": "687",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Etser",
            "lx": "אֶצֶר"
          },
          {
            "t": "בִּלְהָ֥ן",
            "l": "1092",
            "s": "1092",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Bilhan",
            "lx": "בִּלְהָן"
          },
          {
            "t": "וְ/זַעֲוָ֖ן",
            "l": "c/2190",
            "s": "2190",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Zaavan",
            "lx": "זַעֲוָן"
          },
          {
            "t": "וַ/עֲקָֽן",
            "l": "c/6130",
            "s": "6130",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Akan",
            "lx": "עָקָן"
          }
        ]
      },
      {
        "id": "reader-gen-36-28",
        "book": "Gen",
        "ref": "Gen 36:28",
        "gateLesson": 33,
        "tier": "strict",
        "wooden": "These are the sons of Dishan: Uz and Aran.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "אֵ֥לֶּה",
            "l": "428",
            "s": "428",
            "m": "HPdxcp",
            "g": 33,
            "pn": false,
            "v": 33,
            "gl": "these or those",
            "lx": "אֵלֶּה"
          },
          {
            "t": "בְנֵֽי",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "דִישָׁ֖ן",
            "l": "1789",
            "s": "1789",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Dishan",
            "lx": "דִּישָׁן"
          },
          {
            "t": "ע֥וּץ",
            "l": "5780",
            "s": "5780",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Uts",
            "lx": "עוּץ"
          },
          {
            "t": "וַ/אֲרָֽן",
            "l": "c/765",
            "s": "765",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Aran",
            "lx": "אֲרָן"
          }
        ]
      },
      {
        "id": "reader-gen-10-20",
        "book": "Gen",
        "ref": "Gen 10:20",
        "gateLesson": 33,
        "tier": "guided",
        "wooden": "These are the sons of Cham, according to their clans, according to their tongues, in their lands, in their nations.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "אֵ֣לֶּה",
            "l": "428",
            "s": "428",
            "m": "HPdxcp",
            "g": 33,
            "pn": false,
            "v": 33,
            "gl": "these or those",
            "lx": "אֵלֶּה"
          },
          {
            "t": "בְנֵי",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "חָ֔ם",
            "l": "2526",
            "s": "2526",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Cham",
            "lx": "חָם"
          },
          {
            "t": "לְ/מִשְׁפְּחֹתָ֖/ם",
            "l": "l/4940",
            "s": "4940",
            "m": "HR/Ncfpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": null,
            "gl": "a family",
            "lx": "מִשְׁפָּחָה"
          },
          {
            "t": "לִ/לְשֹֽׁנֹתָ֑/ם",
            "l": "l/3956",
            "s": "3956",
            "m": "HR/Ncbpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": null,
            "gl": "the tongue",
            "lx": "לָשׁוֹן"
          },
          {
            "t": "בְּ/אַרְצֹתָ֖/ם",
            "l": "b/776",
            "s": "776",
            "m": "HR/Ncbpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": 9,
            "gl": "the earth",
            "lx": "אֶרֶץ"
          },
          {
            "t": "בְּ/גוֹיֵ/הֶֽם",
            "l": "b/1471 a",
            "s": "1471",
            "m": "HR/Ncmpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": 32,
            "gl": "a foreign nation",
            "lx": "גּוֹי"
          }
        ]
      },
      {
        "id": "reader-gen-36-9",
        "book": "Gen",
        "ref": "Gen 36:9",
        "gateLesson": 33,
        "tier": "guided",
        "wooden": "And these are the generations of Esav, father of Edom, in the hill country of Seir.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אֵ֛לֶּה",
            "l": "c/428",
            "s": "428",
            "m": "HC/Pdxcp",
            "g": 33,
            "pn": false,
            "v": 33,
            "gl": "these or those",
            "lx": "אֵלֶּה"
          },
          {
            "t": "תֹּלְד֥וֹת",
            "l": "8435",
            "s": "8435",
            "m": "HNcfpc",
            "g": 20,
            "pn": false,
            "v": null,
            "gl": "(plural only) descent",
            "lx": "תּוֹלְדָה"
          },
          {
            "t": "עֵשָׂ֖ו",
            "l": "6215",
            "s": "6215",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Esav",
            "lx": "עֵשָׂו"
          },
          {
            "t": "אֲבִ֣י",
            "l": "1",
            "s": "1",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "father",
            "lx": "אָב"
          },
          {
            "t": "אֱד֑וֹם",
            "l": "123",
            "s": "123",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Edom",
            "lx": "אֱדֹם"
          },
          {
            "t": "בְּ/הַ֖ר",
            "l": "b/2022",
            "s": "2022",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": null,
            "gl": "a mountain or range of hills",
            "lx": "הַר"
          },
          {
            "t": "שֵׂעִֽיר",
            "l": "8165 a",
            "s": "8165",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Seir",
            "lx": "שֵׂעִיר"
          }
        ]
      },
      {
        "id": "reader-gen-37-1",
        "book": "Gen",
        "ref": "Gen 37:1",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And Jaakob dwelt in the land of his father's sojournings, in the land of Kenaan.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יֵּ֣שֶׁב",
            "l": "c/3427",
            "s": "3427",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 16,
            "gl": "to sit down",
            "lx": "יָשַׁב"
          },
          {
            "t": "יַעֲקֹ֔ב",
            "l": "3290",
            "s": "3290",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jaakob",
            "lx": "יַעֲקֹב"
          },
          {
            "t": "בְּ/אֶ֖רֶץ",
            "l": "b/776",
            "s": "776",
            "m": "HR/Ncbsc",
            "g": 20,
            "pn": false,
            "v": 9,
            "gl": "the earth",
            "lx": "אֶרֶץ"
          },
          {
            "t": "מְגוּרֵ֣י",
            "l": "4033",
            "s": "4033",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": null,
            "gl": "a temporary abode",
            "lx": "מָגוּר"
          },
          {
            "t": "אָבִ֑י/ו",
            "l": "1",
            "s": "1",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 7,
            "gl": "father",
            "lx": "אָב"
          },
          {
            "t": "בְּ/אֶ֖רֶץ",
            "l": "b/776",
            "s": "776",
            "m": "HR/Ncbsc",
            "g": 20,
            "pn": false,
            "v": 9,
            "gl": "the earth",
            "lx": "אֶרֶץ"
          },
          {
            "t": "כְּנָֽעַן",
            "l": "3667 a",
            "s": "3667",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Kenaan",
            "lx": "כְּנַעַן"
          }
        ]
      },
      {
        "id": "reader-gen-38-6",
        "book": "Gen",
        "ref": "Gen 38:6",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And Jehudah took a woman for Er his firstborn, and her name was Tamar.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יִּקַּ֧ח",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 16,
            "gl": "to take",
            "lx": "לָקַח"
          },
          {
            "t": "יְהוּדָ֛ה",
            "l": "3063",
            "s": "3063",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehudah",
            "lx": "יְהוּדָה"
          },
          {
            "t": "אִשָּׁ֖ה",
            "l": "802",
            "s": "802",
            "m": "HNcfsa",
            "g": 7,
            "pn": false,
            "v": 6,
            "gl": "a woman",
            "lx": "אִשָּׁה"
          },
          {
            "t": "לְ/עֵ֣ר",
            "l": "l/6147",
            "s": "6147",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Er",
            "lx": "עֵר"
          },
          {
            "t": "בְּכוֹר֑/וֹ",
            "l": "1060",
            "s": "1060",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": null,
            "gl": "firstborn",
            "lx": "בְּכוֹר"
          },
          {
            "t": "וּ/שְׁמָ֖/הּ",
            "l": "c/8034",
            "s": "8034",
            "m": "HC/Ncmsc/Sp3fs",
            "g": 22,
            "pn": false,
            "v": 6,
            "gl": "an appellation",
            "lx": "שֵׁם"
          },
          {
            "t": "תָּמָֽר",
            "l": "8559",
            "s": "8559",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Tamar",
            "lx": "תָּמָר"
          }
        ]
      },
      {
        "id": "reader-gen-47-10",
        "book": "Gen",
        "ref": "Gen 47:10",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And Jaakob blessed Paroh, and he went out from before the face of Paroh.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יְבָ֥רֶךְ",
            "l": "c/1288",
            "s": "1288",
            "m": "HC/Vpw3ms",
            "g": 35,
            "pn": false,
            "v": 29,
            "gl": "to kneel",
            "lx": "בָרַךְ"
          },
          {
            "t": "יַעֲקֹ֖ב",
            "l": "3290",
            "s": "3290",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jaakob",
            "lx": "יַעֲקֹב"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "פַּרְעֹ֑ה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Paroh",
            "lx": "פַּרְעֹה"
          },
          {
            "t": "וַ/יֵּצֵ֖א",
            "l": "c/3318",
            "s": "3318",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 22,
            "gl": "to go",
            "lx": "יָצָא"
          },
          {
            "t": "מִ/לִּ/פְנֵ֥י",
            "l": "m/l/6440",
            "s": "6440",
            "m": "HR/R/Ncbpc",
            "g": 20,
            "pn": false,
            "v": null,
            "gl": "the face",
            "lx": "פָּנִים"
          },
          {
            "t": "פַרְעֹֽה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Paroh",
            "lx": "פַּרְעֹה"
          }
        ]
      },
      {
        "id": "reader-gen-26-6",
        "book": "Gen",
        "ref": "Gen 26:6",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And Yitschak dwelt in Gerar.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יֵּ֥שֶׁב",
            "l": "c/3427",
            "s": "3427",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 16,
            "gl": "to sit down",
            "lx": "יָשַׁב"
          },
          {
            "t": "יִצְחָ֖ק",
            "l": "3327",
            "s": "3327",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jitschak",
            "lx": "יִצְחָק"
          },
          {
            "t": "בִּ/גְרָֽר",
            "l": "b/1642",
            "s": "1642",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Gerar",
            "lx": "גְּרָר"
          }
        ]
      },
      {
        "id": "reader-gen-1-13",
        "book": "Gen",
        "ref": "Gen 1:13",
        "gateLesson": 35,
        "tier": "guided",
        "wooden": "And there was evening, and there was morning, a third day.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַֽ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6,
            "gl": "to exist",
            "lx": "הָיָה"
          },
          {
            "t": "עֶ֥רֶב",
            "l": "6153",
            "s": "6153",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null,
            "gl": "dusk",
            "lx": "עֶרֶב"
          },
          {
            "t": "וַֽ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6,
            "gl": "to exist",
            "lx": "הָיָה"
          },
          {
            "t": "בֹ֖קֶר",
            "l": "1242",
            "s": "1242",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null,
            "gl": "dawn",
            "lx": "בֹּקֶר"
          },
          {
            "t": "י֥וֹם",
            "l": "3117",
            "s": "3117",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": 21,
            "gl": "a day",
            "lx": "יוֹם"
          },
          {
            "t": "שְׁלִישִֽׁי",
            "l": "7992",
            "s": "7992",
            "m": "HAomsa",
            "g": 32,
            "pn": false,
            "v": null,
            "gl": "third",
            "lx": "שְׁלִישִׁי"
          }
        ]
      },
      {
        "id": "reader-gen-1-19",
        "book": "Gen",
        "ref": "Gen 1:19",
        "gateLesson": 35,
        "tier": "guided",
        "wooden": "And there was evening, and there was morning, a fourth day.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַֽ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6,
            "gl": "to exist",
            "lx": "הָיָה"
          },
          {
            "t": "עֶ֥רֶב",
            "l": "6153",
            "s": "6153",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null,
            "gl": "dusk",
            "lx": "עֶרֶב"
          },
          {
            "t": "וַֽ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6,
            "gl": "to exist",
            "lx": "הָיָה"
          },
          {
            "t": "בֹ֖קֶר",
            "l": "1242",
            "s": "1242",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null,
            "gl": "dawn",
            "lx": "בֹּקֶר"
          },
          {
            "t": "י֥וֹם",
            "l": "3117",
            "s": "3117",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": 21,
            "gl": "a day",
            "lx": "יוֹם"
          },
          {
            "t": "רְבִיעִֽי",
            "l": "7243",
            "s": "7243",
            "m": "HAomsa",
            "g": 32,
            "pn": false,
            "v": null,
            "gl": "fourth",
            "lx": "רְבִיעִי"
          }
        ]
      },
      {
        "id": "reader-gen-50-12",
        "book": "Gen",
        "ref": "Gen 50:12",
        "gateLesson": 40,
        "tier": "strict",
        "wooden": "And his sons did for him thus, just as he had commanded them.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יַּעֲשׂ֥וּ",
            "l": "c/6213 a",
            "s": "6213",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": 15,
            "gl": "to do or make",
            "lx": "עָשָׂה"
          },
          {
            "t": "בָנָ֖י/ו",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc/Sp3ms",
            "g": 31,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "ל֑/וֹ",
            "l": "l",
            "s": null,
            "m": "HR/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 13,
            "gl": null,
            "lx": null
          },
          {
            "t": "כֵּ֖ן",
            "l": "3651 c",
            "s": "3651",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "set upright",
            "lx": "כֵּן"
          },
          {
            "t": "כַּ/אֲשֶׁ֥ר",
            "l": "k/834 d",
            "s": "834",
            "m": "HR/Tr",
            "g": 30,
            "pn": false,
            "v": 13,
            "gl": "who",
            "lx": "אֲשֶׁר"
          },
          {
            "t": "צִוָּֽ/ם",
            "l": "6680",
            "s": "6680",
            "m": "HVpp3ms/Sp3mp",
            "g": 40,
            "pn": false,
            "v": 35,
            "gl": "(intensively) to constitute",
            "lx": "צָוָה"
          }
        ]
      },
      {
        "id": "reader-gen-38-2",
        "book": "Gen",
        "ref": "Gen 38:2",
        "gateLesson": 40,
        "tier": "strict",
        "wooden": "And Jehudah saw there a daughter of a Kenaanite man, and his name was Shua, and he took her, and he came to her.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יַּרְא",
            "l": "c/7200",
            "s": "7200",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 30,
            "gl": "to see",
            "lx": "רָאָה"
          },
          {
            "t": "שָׁ֧ם",
            "l": "8033",
            "s": "8033",
            "m": "HD",
            "g": 1,
            "pn": false,
            "v": 6,
            "gl": "there",
            "lx": "שָׁם"
          },
          {
            "t": "יְהוּדָ֛ה",
            "l": "3063",
            "s": "3063",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehudah",
            "lx": "יְהוּדָה"
          },
          {
            "t": "בַּת",
            "l": "1323",
            "s": "1323",
            "m": "HNcfsc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a daughter",
            "lx": "בַּת"
          },
          {
            "t": "אִ֥ישׁ",
            "l": "376",
            "s": "376",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": 6,
            "gl": "a man as an individual or a male person",
            "lx": "אִישׁ"
          },
          {
            "t": "כְּנַעֲנִ֖י",
            "l": "3669 a",
            "s": "3669",
            "m": "HNgmsa",
            "g": 7,
            "pn": true,
            "v": null,
            "gl": "a Kenaanite or inhabitant of Kenaan",
            "lx": "כְּנַעַנִי",
            "gent": true
          },
          {
            "t": "וּ/שְׁמ֣/וֹ",
            "l": "c/8034",
            "s": "8034",
            "m": "HC/Ncmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 6,
            "gl": "an appellation",
            "lx": "שֵׁם"
          },
          {
            "t": "שׁ֑וּעַ",
            "l": "7770",
            "s": "7770",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Shua",
            "lx": "שׁוּעַ"
          },
          {
            "t": "וַ/יִּקָּחֶ֖/הָ",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqw3ms/Sp3fs",
            "g": 40,
            "pn": false,
            "v": 16,
            "gl": "to take",
            "lx": "לָקַח"
          },
          {
            "t": "וַ/יָּבֹ֥א",
            "l": "c/935",
            "s": "935",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          },
          {
            "t": "אֵלֶֽי/הָ",
            "l": "413",
            "s": "413",
            "m": "HR/Sp3fs",
            "g": 22,
            "pn": false,
            "v": 8,
            "gl": "near",
            "lx": "אֵל"
          }
        ]
      },
      {
        "id": "reader-gen-44-6",
        "book": "Gen",
        "ref": "Gen 44:6",
        "gateLesson": 40,
        "tier": "strict",
        "wooden": "And he overtook them, and he spoke to them these words.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַֽ/יַּשִּׂגֵ֑/ם",
            "l": "c/5381",
            "s": "5381",
            "m": "HC/Vhw3ms/Sp3mp",
            "g": 40,
            "pn": false,
            "v": null,
            "gl": "to reach",
            "lx": "נָשַׂג"
          },
          {
            "t": "וַ/יְדַבֵּ֣ר",
            "l": "c/1696",
            "s": "1696",
            "m": "HC/Vpw3ms",
            "g": 35,
            "pn": false,
            "v": 15,
            "gl": "to arrange",
            "lx": "דָבַר"
          },
          {
            "t": "אֲלֵ/הֶ֔ם",
            "l": "413",
            "s": "413",
            "m": "HR/Sp3mp",
            "g": 22,
            "pn": false,
            "v": 11,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הַ/דְּבָרִ֖ים",
            "l": "d/1697",
            "s": "1697",
            "m": "HTd/Ncmpa",
            "g": 10,
            "pn": false,
            "v": 5,
            "gl": "a word",
            "lx": "דָּבָר"
          },
          {
            "t": "הָ/אֵֽלֶּה",
            "l": "d/428",
            "s": "428",
            "m": "HTd/Pdxcp",
            "g": 33,
            "pn": false,
            "v": 8,
            "gl": "these or those",
            "lx": "אֵלֶּה"
          }
        ]
      },
      {
        "id": "reader-gen-7-5",
        "book": "Gen",
        "ref": "Gen 7:5",
        "gateLesson": 40,
        "tier": "strict",
        "wooden": "And Noach did according to all that YHWH had commanded him.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יַּ֖עַשׂ",
            "l": "c/6213 a",
            "s": "6213",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 15,
            "gl": "to do or make",
            "lx": "עָשָׂה"
          },
          {
            "t": "נֹ֑חַ",
            "l": "5146",
            "s": "5146",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Noach",
            "lx": "נֹחַ"
          },
          {
            "t": "כְּ/כֹ֥ל",
            "l": "k/3605",
            "s": "3605",
            "m": "HR/Ncmsa",
            "g": 13,
            "pn": false,
            "v": 11,
            "gl": "the whole",
            "lx": "כֹּל"
          },
          {
            "t": "אֲשֶׁר",
            "l": "834 a",
            "s": "834",
            "m": "HTr",
            "g": 30,
            "pn": false,
            "v": 30,
            "gl": "who",
            "lx": "אֲשֶׁר"
          },
          {
            "t": "צִוָּ֖/הוּ",
            "l": "6680",
            "s": "6680",
            "m": "HVpp3ms/Sp3ms",
            "g": 40,
            "pn": false,
            "v": 35,
            "gl": "(intensively) to constitute",
            "lx": "צָוָה"
          },
          {
            "t": "יְהוָֽה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          }
        ]
      },
      {
        "id": "reader-gen-1-3",
        "book": "Gen",
        "ref": "Gen 1:3",
        "gateLesson": 39,
        "tier": "guided",
        "wooden": "And God said, 'Let light be,' and light was.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יֹּ֥אמֶר",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          },
          {
            "t": "אֱלֹהִ֖ים",
            "l": "430",
            "s": "430",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 3,
            "gl": "gods in the ordinary sense",
            "lx": "אֱלֹהִים"
          },
          {
            "t": "יְהִ֣י",
            "l": "1961",
            "s": "1961",
            "m": "HVqj3ms",
            "g": 39,
            "pn": false,
            "v": 6,
            "gl": "to exist",
            "lx": "הָיָה"
          },
          {
            "t": "א֑וֹר",
            "l": "216",
            "s": "216",
            "m": "HNcbsa",
            "g": 7,
            "pn": false,
            "v": 24,
            "gl": "illumination",
            "lx": "אוֹר"
          },
          {
            "t": "וַֽ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6,
            "gl": "to exist",
            "lx": "הָיָה"
          },
          {
            "t": "אֽוֹר",
            "l": "216",
            "s": "216",
            "m": "HNcbsa",
            "g": 7,
            "pn": false,
            "v": null,
            "gl": "illumination",
            "lx": "אוֹר"
          }
        ]
      },
      {
        "id": "reader-gen-50-6",
        "book": "Gen",
        "ref": "Gen 50:6",
        "gateLesson": 40,
        "tier": "guided",
        "wooden": "And Paroh said, 'Go up and bury your father, just as he made you swear.'",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יֹּ֖אמֶר",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          },
          {
            "t": "פַּרְעֹ֑ה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Paroh",
            "lx": "פַּרְעֹה"
          },
          {
            "t": "עֲלֵ֛ה",
            "l": "5927",
            "s": "5927",
            "m": "HVqv2ms",
            "g": 39,
            "pn": false,
            "v": 14,
            "gl": "to ascend",
            "lx": "עָלָה"
          },
          {
            "t": "וּ/קְבֹ֥ר",
            "l": "c/6912",
            "s": "6912",
            "m": "HC/Vqv2ms",
            "g": 39,
            "pn": false,
            "v": 49,
            "gl": "to inter",
            "lx": "קָבַר"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "אָבִ֖י/ךָ",
            "l": "1",
            "s": "1",
            "m": "HNcmsc/Sp2ms",
            "g": 22,
            "pn": false,
            "v": 7,
            "gl": "father",
            "lx": "אָב"
          },
          {
            "t": "כַּ/אֲשֶׁ֥ר",
            "l": "k/834 d",
            "s": "834",
            "m": "HR/Tr",
            "g": 30,
            "pn": false,
            "v": 13,
            "gl": "who",
            "lx": "אֲשֶׁר"
          },
          {
            "t": "הִשְׁבִּיעֶֽ/ךָ",
            "l": "7650",
            "s": "7650",
            "m": "HVhp3ms/Sp2ms",
            "g": 40,
            "pn": false,
            "v": null,
            "gl": "to seven oneself",
            "lx": "שָׁבַע"
          }
        ]
      },
      {
        "id": "reader-gen-32-14",
        "book": "Gen",
        "ref": "Gen 32:14",
        "gateLesson": 42,
        "tier": "strict",
        "wooden": "And he lodged there that night, and he took from what had come into his hand a gift for Esav his brother.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יָּ֥לֶן",
            "l": "c/3885 a",
            "s": "3885",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to stop",
            "lx": "לוּן"
          },
          {
            "t": "שָׁ֖ם",
            "l": "8033",
            "s": "8033",
            "m": "HD",
            "g": 1,
            "pn": false,
            "v": 6,
            "gl": "there",
            "lx": "שָׁם"
          },
          {
            "t": "בַּ/לַּ֣יְלָה",
            "l": "b/3915",
            "s": "3915",
            "m": "HRd/Ncmsa",
            "g": 13,
            "pn": false,
            "v": 24,
            "gl": "a twist",
            "lx": "לַיִל"
          },
          {
            "t": "הַ/ה֑וּא",
            "l": "d/1931",
            "s": "1931",
            "m": "HTd/Pp3ms",
            "g": 8,
            "pn": false,
            "v": 5,
            "gl": "he",
            "lx": "הוּא"
          },
          {
            "t": "וַ/יִּקַּ֞ח",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 16,
            "gl": "to take",
            "lx": "לָקַח"
          },
          {
            "t": "מִן",
            "l": "4480 a",
            "s": "4480",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 13,
            "gl": "a part of",
            "lx": "מִן"
          },
          {
            "t": "הַ/בָּ֧א",
            "l": "d/935",
            "s": "935",
            "m": "HTd/Vqrmsa",
            "g": 42,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          },
          {
            "t": "בְ/יָד֛/וֹ",
            "l": "b/3027",
            "s": "3027",
            "m": "HR/Ncbsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 10,
            "gl": "a hand",
            "lx": "יָד"
          },
          {
            "t": "מִנְחָ֖ה",
            "l": "4503",
            "s": "4503",
            "m": "HNcfsa",
            "g": 7,
            "pn": false,
            "v": 36,
            "gl": "a donation",
            "lx": "מִנְחָה"
          },
          {
            "t": "לְ/עֵשָׂ֥ו",
            "l": "l/6215",
            "s": "6215",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Esav",
            "lx": "עֵשָׂו"
          },
          {
            "t": "אָחִֽי/ו",
            "l": "251",
            "s": "251",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 10,
            "gl": "a brother",
            "lx": "אָח"
          }
        ]
      },
      {
        "id": "reader-gen-14-12",
        "book": "Gen",
        "ref": "Gen 14:12",
        "gateLesson": 42,
        "tier": "strict",
        "wooden": "And they took Lot and his property, son of the brother of Abram, and they went, and he was dwelling in Sedom.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יִּקְח֨וּ",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": 16,
            "gl": "to take",
            "lx": "לָקַח"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "ל֧וֹט",
            "l": "3876",
            "s": "3876",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Lot",
            "lx": "לוֹט"
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "רְכֻשׁ֛/וֹ",
            "l": "7399",
            "s": "7399",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": null,
            "gl": "property",
            "lx": "רְכוּשׁ"
          },
          {
            "t": "בֶּן",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "אֲחִ֥י",
            "l": "251",
            "s": "251",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 10,
            "gl": "a brother",
            "lx": "אָח"
          },
          {
            "t": "אַבְרָ֖ם",
            "l": "87",
            "s": "87",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Abram",
            "lx": "אַבְרָם"
          },
          {
            "t": "וַ/יֵּלֵ֑כוּ",
            "l": "c/3212",
            "s": "3212",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": 16,
            "gl": "to walk",
            "lx": "יָלַךְ"
          },
          {
            "t": "וְ/ה֥וּא",
            "l": "c/1931",
            "s": "1931",
            "m": "HC/Pp3ms",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "he",
            "lx": "הוּא"
          },
          {
            "t": "יֹשֵׁ֖ב",
            "l": "3427",
            "s": "3427",
            "m": "HVqrmsa",
            "g": 42,
            "pn": false,
            "v": 16,
            "gl": "to sit down",
            "lx": "יָשַׁב"
          },
          {
            "t": "בִּ/סְדֹֽם",
            "l": "b/5467",
            "s": "5467",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Sedom",
            "lx": "סְדֹם"
          }
        ]
      },
      {
        "id": "reader-gen-32-19",
        "book": "Gen",
        "ref": "Gen 32:19",
        "gateLesson": 42,
        "tier": "strict",
        "wooden": "And you shall say, 'To your servant, to Jaakob'; it is a gift sent to my lord, to Esav; and behold, also he is behind us.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אָֽמַרְתָּ֙",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqq2ms",
            "g": 16,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          },
          {
            "t": "לְ/עַבְדְּ/ךָ֣",
            "l": "l/5650",
            "s": "5650",
            "m": "HR/Ncmsc/Sp2ms",
            "g": 22,
            "pn": false,
            "v": 11,
            "gl": "a servant",
            "lx": "עֶבֶד"
          },
          {
            "t": "לְ/יַעֲקֹ֔ב",
            "l": "l/3290",
            "s": "3290",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Jaakob",
            "lx": "יַעֲקֹב"
          },
          {
            "t": "מִנְחָ֥ה",
            "l": "4503",
            "s": "4503",
            "m": "HNcfsa",
            "g": 7,
            "pn": false,
            "v": 36,
            "gl": "a donation",
            "lx": "מִנְחָה"
          },
          {
            "t": "הִוא֙",
            "l": "1931",
            "s": "1931",
            "m": "HPp3fs",
            "g": 5,
            "pn": false,
            "v": 5,
            "gl": "he",
            "lx": "הוּא"
          },
          {
            "t": "שְׁלוּחָ֔ה",
            "l": "7971",
            "s": "7971",
            "m": "HVqsfsa",
            "g": 42,
            "pn": false,
            "v": 15,
            "gl": "to send away",
            "lx": "שָׁלַח"
          },
          {
            "t": "לַֽ/אדֹנִ֖/י",
            "l": "l/113",
            "s": "113",
            "m": "HR/Ncmsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 3,
            "gl": "sovereign",
            "lx": "אָדוֹן"
          },
          {
            "t": "לְ/עֵשָׂ֑ו",
            "l": "l/6215",
            "s": "6215",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Esav",
            "lx": "עֵשָׂו"
          },
          {
            "t": "וְ/הִנֵּ֥ה",
            "l": "c/2009",
            "s": "2009",
            "m": "HC/Tm",
            "g": 13,
            "pn": false,
            "v": 22,
            "gl": "lo!",
            "lx": "הִנֵּה"
          },
          {
            "t": "גַם",
            "l": "1571",
            "s": "1571",
            "m": "HD",
            "g": 1,
            "pn": false,
            "v": 28,
            "gl": "assemblage",
            "lx": "גַּם"
          },
          {
            "t": "ה֖וּא",
            "l": "1931",
            "s": "1931",
            "m": "HPp3ms",
            "g": 5,
            "pn": false,
            "v": 5,
            "gl": "he",
            "lx": "הוּא"
          },
          {
            "t": "אַחֲרֵֽי/נוּ",
            "l": "310 a",
            "s": "310",
            "m": "HR/Sp1cp",
            "g": 22,
            "pn": false,
            "v": null,
            "gl": "the hind part",
            "lx": "אַחַר"
          }
        ]
      },
      {
        "id": "reader-gen-41-28",
        "book": "Gen",
        "ref": "Gen 41:28",
        "gateLesson": 42,
        "tier": "strict",
        "wooden": "It is the word that I spoke to Paroh: what God is doing he has shown to Paroh.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "ה֣וּא",
            "l": "1931",
            "s": "1931",
            "m": "HPp3ms",
            "g": 5,
            "pn": false,
            "v": 5,
            "gl": "he",
            "lx": "הוּא"
          },
          {
            "t": "הַ/דָּבָ֔ר",
            "l": "d/1697",
            "s": "1697",
            "m": "HTd/Ncmsa",
            "g": 8,
            "pn": false,
            "v": 5,
            "gl": "a word",
            "lx": "דָּבָר"
          },
          {
            "t": "אֲשֶׁ֥ר",
            "l": "834 a",
            "s": "834",
            "m": "HTr",
            "g": 30,
            "pn": false,
            "v": 30,
            "gl": "who",
            "lx": "אֲשֶׁר"
          },
          {
            "t": "דִּבַּ֖רְתִּי",
            "l": "1696",
            "s": "1696",
            "m": "HVpp1cs",
            "g": 29,
            "pn": false,
            "v": 15,
            "gl": "to arrange",
            "lx": "דָבַר"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "פַּרְעֹ֑ה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Paroh",
            "lx": "פַּרְעֹה"
          },
          {
            "t": "אֲשֶׁ֧ר",
            "l": "834 a",
            "s": "834",
            "m": "HTr",
            "g": 30,
            "pn": false,
            "v": 30,
            "gl": "who",
            "lx": "אֲשֶׁר"
          },
          {
            "t": "הָ/אֱלֹהִ֛ים",
            "l": "d/430",
            "s": "430",
            "m": "HTd/Ncmpa",
            "g": 10,
            "pn": false,
            "v": 3,
            "gl": "gods in the ordinary sense",
            "lx": "אֱלֹהִים"
          },
          {
            "t": "עֹשֶׂ֖ה",
            "l": "6213 a",
            "s": "6213",
            "m": "HVqrmsa",
            "g": 42,
            "pn": false,
            "v": 15,
            "gl": "to do or make",
            "lx": "עָשָׂה"
          },
          {
            "t": "הֶרְאָ֥ה",
            "l": "7200",
            "s": "7200",
            "m": "HVhp3ms",
            "g": 29,
            "pn": false,
            "v": null,
            "gl": "to see",
            "lx": "רָאָה"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "פַּרְעֹֽה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Paroh",
            "lx": "פַּרְעֹה"
          }
        ]
      },
      {
        "id": "reader-gen-37-19",
        "book": "Gen",
        "ref": "Gen 37:19",
        "gateLesson": 42,
        "tier": "guided",
        "wooden": "And they said, each man to his brother, 'Behold, this master of dreams is coming.'",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יֹּאמְר֖וּ",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          },
          {
            "t": "אִ֣ישׁ",
            "l": "376",
            "s": "376",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": 6,
            "gl": "a man as an individual or a male person",
            "lx": "אִישׁ"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "אָחִ֑י/ו",
            "l": "251",
            "s": "251",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 10,
            "gl": "a brother",
            "lx": "אָח"
          },
          {
            "t": "הִנֵּ֗ה",
            "l": "2009",
            "s": "2009",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": 22,
            "gl": "lo!",
            "lx": "הִנֵּה"
          },
          {
            "t": "בַּ֛עַל",
            "l": "1167",
            "s": "1167",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": null,
            "gl": "a master",
            "lx": "בַּעַל"
          },
          {
            "t": "הַ/חֲלֹמ֥וֹת",
            "l": "d/2472",
            "s": "2472",
            "m": "HTd/Ncmpa",
            "g": 10,
            "pn": false,
            "v": null,
            "gl": "a dream",
            "lx": "חֲלוֹם"
          },
          {
            "t": "הַלָּזֶ֖ה",
            "l": "1976",
            "s": "1976",
            "m": "HPdxms",
            "g": 33,
            "pn": false,
            "v": null,
            "gl": "this very",
            "lx": "הַלָּזֶה"
          },
          {
            "t": "בָּֽא",
            "l": "935",
            "s": "935",
            "m": "HVqrmsa",
            "g": 42,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          }
        ]
      },
      {
        "id": "reader-gen-34-31",
        "book": "Gen",
        "ref": "Gen 34:31",
        "gateLesson": 42,
        "tier": "guided",
        "wooden": "And they said, 'Like a prostitute should he treat our sister?'",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יֹּאמְר֑וּ",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          },
          {
            "t": "הַ/כְ/זוֹנָ֕ה",
            "l": "d/k/2181",
            "s": "2181",
            "m": "HTi/R/Vqrfsa",
            "g": 42,
            "pn": false,
            "v": null,
            "gl": "to commit adultery",
            "lx": "זָנָה"
          },
          {
            "t": "יַעֲשֶׂ֖ה",
            "l": "6213 a",
            "s": "6213",
            "m": "HVqi3ms",
            "g": 23,
            "pn": false,
            "v": 15,
            "gl": "to do or make",
            "lx": "עָשָׂה"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "אֲחוֹתֵֽ/נוּ",
            "l": "269",
            "s": "269",
            "m": "HNcfsc/Sp1cp",
            "g": 22,
            "pn": false,
            "v": null,
            "gl": "a sister",
            "lx": "אָחוֹת"
          }
        ]
      },
      {
        "id": "reader-gen-19-36",
        "book": "Gen",
        "ref": "Gen 19:36",
        "gateLesson": 45,
        "tier": "strict",
        "wooden": "And the two daughters of Lot conceived by their father.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַֽ/תַּהֲרֶ֛יןָ",
            "l": "c/2029",
            "s": "2029",
            "m": "HC/Vqw3fp",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to be",
            "lx": "הָרָה"
          },
          {
            "t": "שְׁתֵּ֥י",
            "l": "8147",
            "s": "8147",
            "m": "HAcfdc",
            "g": 45,
            "pn": false,
            "v": 31,
            "gl": "two",
            "lx": "שְׁנַיִם"
          },
          {
            "t": "בְנֽוֹת",
            "l": "1323",
            "s": "1323",
            "m": "HNcfpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a daughter",
            "lx": "בַּת"
          },
          {
            "t": "ל֖וֹט",
            "l": "3876",
            "s": "3876",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Lot",
            "lx": "לוֹט"
          },
          {
            "t": "מֵ/אֲבִי/הֶֽן",
            "l": "m/1",
            "s": "1",
            "m": "HR/Ncmsc/Sp3fp",
            "g": 22,
            "pn": false,
            "v": 7,
            "gl": "father",
            "lx": "אָב"
          }
        ]
      },
      {
        "id": "reader-gen-21-31",
        "book": "Gen",
        "ref": "Gen 21:31",
        "gateLesson": 45,
        "tier": "strict",
        "wooden": "Therefore he called that place Beer-Sheba, for there the two of them swore.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "עַל",
            "l": "5921 a",
            "s": "5921",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 13,
            "gl": "above",
            "lx": "עַל"
          },
          {
            "t": "כֵּ֗ן",
            "l": "3651 c",
            "s": "3651",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "set upright",
            "lx": "כֵּן"
          },
          {
            "t": "קָרָ֛א",
            "l": "7121",
            "s": "7121",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 16,
            "gl": "to call out to",
            "lx": "קָרָא"
          },
          {
            "t": "לַ/מָּק֥וֹם",
            "l": "l/4725",
            "s": "4725",
            "m": "HRd/Ncmsa",
            "g": 13,
            "pn": false,
            "v": 12,
            "gl": "a standing",
            "lx": "מָקוֹם"
          },
          {
            "t": "הַ/ה֖וּא",
            "l": "d/1931",
            "s": "1931",
            "m": "HTd/Pp3ms",
            "g": 8,
            "pn": false,
            "v": 5,
            "gl": "he",
            "lx": "הוּא"
          },
          {
            "t": "בְּאֵ֣ר",
            "l": "884+",
            "s": "884",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Beer-Sheba",
            "lx": "בְּאֵר שֶׁבַע"
          },
          {
            "t": "שָׁ֑בַע",
            "l": "884",
            "s": "884",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Beer-Sheba",
            "lx": "בְּאֵר שֶׁבַע"
          },
          {
            "t": "כִּ֛י",
            "l": "3588 a",
            "s": "3588",
            "m": "HC",
            "g": 13,
            "pn": false,
            "v": 30,
            "gl": "for, that, because, when",
            "lx": "כִּי"
          },
          {
            "t": "שָׁ֥ם",
            "l": "8033",
            "s": "8033",
            "m": "HD",
            "g": 1,
            "pn": false,
            "v": 6,
            "gl": "there",
            "lx": "שָׁם"
          },
          {
            "t": "נִשְׁבְּע֖וּ",
            "l": "7650",
            "s": "7650",
            "m": "HVNp3cp",
            "g": 37,
            "pn": false,
            "v": null,
            "gl": "to seven oneself",
            "lx": "שָׁבַע"
          },
          {
            "t": "שְׁנֵי/הֶֽם",
            "l": "8147",
            "s": "8147",
            "m": "HAcmdc/Sp3mp",
            "g": 45,
            "pn": false,
            "v": 31,
            "gl": "two",
            "lx": "שְׁנַיִם"
          }
        ]
      },
      {
        "id": "reader-gen-7-9",
        "book": "Gen",
        "ref": "Gen 7:9",
        "gateLesson": 45,
        "tier": "strict",
        "wooden": "Two by two they came to Noach, into the ark, male and female, just as God had commanded Noach.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "שְׁנַ֨יִם",
            "l": "8147",
            "s": "8147",
            "m": "HAcmda",
            "g": 45,
            "pn": false,
            "v": 31,
            "gl": "two",
            "lx": "שְׁנַיִם"
          },
          {
            "t": "שְׁנַ֜יִם",
            "l": "8147",
            "s": "8147",
            "m": "HAcmda",
            "g": 45,
            "pn": false,
            "v": 31,
            "gl": "two",
            "lx": "שְׁנַיִם"
          },
          {
            "t": "בָּ֧אוּ",
            "l": "935",
            "s": "935",
            "m": "HVqp3cp",
            "g": 19,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "נֹ֛חַ",
            "l": "5146",
            "s": "5146",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Noach",
            "lx": "נֹחַ"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "הַ/תֵּבָ֖ה",
            "l": "d/8392",
            "s": "8392",
            "m": "HTd/Ncfsa",
            "g": 8,
            "pn": false,
            "v": null,
            "gl": "a box",
            "lx": "תֵּבָה"
          },
          {
            "t": "זָכָ֣ר",
            "l": "2145",
            "s": "2145",
            "m": "HAamsa",
            "g": 32,
            "pn": false,
            "v": 7,
            "gl": "remembered",
            "lx": "זָכָר"
          },
          {
            "t": "וּ/נְקֵבָ֑ה",
            "l": "c/5347",
            "s": "5347",
            "m": "HC/Ncfsa",
            "g": 13,
            "pn": false,
            "v": 7,
            "gl": "female",
            "lx": "נְקֵבָה"
          },
          {
            "t": "כַּֽ/אֲשֶׁ֛ר",
            "l": "k/834 d",
            "s": "834",
            "m": "HR/Tr",
            "g": 30,
            "pn": false,
            "v": 30,
            "gl": "who",
            "lx": "אֲשֶׁר"
          },
          {
            "t": "צִוָּ֥ה",
            "l": "6680",
            "s": "6680",
            "m": "HVpp3ms",
            "g": 29,
            "pn": false,
            "v": 35,
            "gl": "(intensively) to constitute",
            "lx": "צָוָה"
          },
          {
            "t": "אֱלֹהִ֖ים",
            "l": "430",
            "s": "430",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 3,
            "gl": "gods in the ordinary sense",
            "lx": "אֱלֹהִים"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "נֹֽחַ",
            "l": "5146",
            "s": "5146",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Noach",
            "lx": "נֹחַ"
          }
        ]
      },
      {
        "id": "reader-gen-31-33",
        "book": "Gen",
        "ref": "Gen 31:33",
        "gateLesson": 45,
        "tier": "strict",
        "wooden": "And Laban went into the tent of Jaakob, and into the tent of Leah, and into the tent of the two maidservants, and he did not find; and he went out from the tent of Leah, and he went into the tent of Rachel.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יָּבֹ֨א",
            "l": "c/935",
            "s": "935",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          },
          {
            "t": "לָבָ֜ן",
            "l": "3837 a",
            "s": "3837",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Laban",
            "lx": "לָבָן"
          },
          {
            "t": "בְּ/אֹ֥הֶל",
            "l": "b/168",
            "s": "168",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 20,
            "gl": "a tent",
            "lx": "אֹהֶל"
          },
          {
            "t": "יַעֲקֹ֣ב",
            "l": "3290",
            "s": "3290",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jaakob",
            "lx": "יַעֲקֹב"
          },
          {
            "t": "וּ/בְ/אֹ֣הֶל",
            "l": "c/b/168",
            "s": "168",
            "m": "HC/R/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 20,
            "gl": "a tent",
            "lx": "אֹהֶל"
          },
          {
            "t": "לֵאָ֗ה",
            "l": "3812",
            "s": "3812",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Leah",
            "lx": "לֵאָה"
          },
          {
            "t": "וּ/בְ/אֹ֛הֶל",
            "l": "c/b/168",
            "s": "168",
            "m": "HC/R/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 20,
            "gl": "a tent",
            "lx": "אֹהֶל"
          },
          {
            "t": "שְׁתֵּ֥י",
            "l": "8147",
            "s": "8147",
            "m": "HAcfdc",
            "g": 45,
            "pn": false,
            "v": 31,
            "gl": "two",
            "lx": "שְׁנַיִם"
          },
          {
            "t": "הָ/אֲמָהֹ֖ת",
            "l": "d/519",
            "s": "519",
            "m": "HTd/Ncfpa",
            "g": 10,
            "pn": false,
            "v": null,
            "gl": "a maidservant or female slave",
            "lx": "אָמָה"
          },
          {
            "t": "וְ/לֹ֣א",
            "l": "c/3808",
            "s": "3808",
            "m": "HC/Tn",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "not",
            "lx": "לֹא"
          },
          {
            "t": "מָצָ֑א",
            "l": "4672",
            "s": "4672",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 22,
            "gl": "to come forth to",
            "lx": "מָצָא"
          },
          {
            "t": "וַ/יֵּצֵא֙",
            "l": "c/3318",
            "s": "3318",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 22,
            "gl": "to go",
            "lx": "יָצָא"
          },
          {
            "t": "מֵ/אֹ֣הֶל",
            "l": "m/168",
            "s": "168",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 20,
            "gl": "a tent",
            "lx": "אֹהֶל"
          },
          {
            "t": "לֵאָ֔ה",
            "l": "3812",
            "s": "3812",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Leah",
            "lx": "לֵאָה"
          },
          {
            "t": "וַ/יָּבֹ֖א",
            "l": "c/935",
            "s": "935",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          },
          {
            "t": "בְּ/אֹ֥הֶל",
            "l": "b/168",
            "s": "168",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 20,
            "gl": "a tent",
            "lx": "אֹהֶל"
          },
          {
            "t": "רָחֵֽל",
            "l": "7354",
            "s": "7354",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Rachel",
            "lx": "רָחֵל"
          }
        ]
      },
      {
        "id": "reader-gen-22-23",
        "book": "Gen",
        "ref": "Gen 22:23",
        "gateLesson": 45,
        "tier": "guided",
        "wooden": "And Bethuel fathered Rivkah; these eight Milkah bore to Nachor, brother of Abraham.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וּ/בְתוּאֵ֖ל",
            "l": "c/1328 a",
            "s": "1328",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Bethuel",
            "lx": "בְּתוּאֵל"
          },
          {
            "t": "יָלַ֣ד",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null,
            "gl": "to bear young",
            "lx": "יָלַד"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "רִבְקָ֑ה",
            "l": "7259",
            "s": "7259",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Ribkah",
            "lx": "רִבְקָה"
          },
          {
            "t": "שְׁמֹנָ֥ה",
            "l": "8083",
            "s": "8083",
            "m": "HAcmsa",
            "g": 45,
            "pn": false,
            "v": null,
            "gl": "a cardinal number",
            "lx": "שְׁמֹנֶה"
          },
          {
            "t": "אֵ֨לֶּה֙",
            "l": "428",
            "s": "428",
            "m": "HPdxcp",
            "g": 33,
            "pn": false,
            "v": 33,
            "gl": "these or those",
            "lx": "אֵלֶּה"
          },
          {
            "t": "יָלְדָ֣ה",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3fs",
            "g": 16,
            "pn": false,
            "v": null,
            "gl": "to bear young",
            "lx": "יָלַד"
          },
          {
            "t": "מִלְכָּ֔ה",
            "l": "4435",
            "s": "4435",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Milcah",
            "lx": "מִלְכָּה"
          },
          {
            "t": "לְ/נָח֖וֹר",
            "l": "l/5152",
            "s": "5152",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Nochor",
            "lx": "נָחוֹר"
          },
          {
            "t": "אֲחִ֥י",
            "l": "251",
            "s": "251",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 10,
            "gl": "a brother",
            "lx": "אָח"
          },
          {
            "t": "אַבְרָהָֽם",
            "l": "85",
            "s": "85",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Abraham",
            "lx": "אַבְרָהָם"
          }
        ]
      },
      {
        "id": "reader-gen-42-17",
        "book": "Gen",
        "ref": "Gen 42:17",
        "gateLesson": 45,
        "tier": "guided",
        "wooden": "And he gathered them into custody three days.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יֶּאֱסֹ֥ף",
            "l": "c/622",
            "s": "622",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to gather for any purpose",
            "lx": "אָסַף"
          },
          {
            "t": "אֹתָ֛/ם",
            "l": "853",
            "s": "853",
            "m": "HTo/Sp3mp",
            "g": 22,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "מִשְׁמָ֖ר",
            "l": "4929",
            "s": "4929",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null,
            "gl": "a guard",
            "lx": "מִשְׁמָר"
          },
          {
            "t": "שְׁלֹ֥שֶׁת",
            "l": "7969",
            "s": "7969",
            "m": "HAcmsc",
            "g": 45,
            "pn": false,
            "v": null,
            "gl": "three",
            "lx": "שָׁלוֹשׁ"
          },
          {
            "t": "יָמִֽים",
            "l": "3117",
            "s": "3117",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 21,
            "gl": "a day",
            "lx": "יוֹם"
          }
        ]
      },
      {
        "id": "reader-deut-3-15",
        "book": "Deut",
        "ref": "Deut 3:15",
        "gateLesson": 16,
        "tier": "strict",
        "wooden": "And to Makir I gave the Gilad.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וּ/לְ/מָכִ֖יר",
            "l": "c/l/4353",
            "s": "4353",
            "m": "HC/R/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Makir",
            "lx": "מָכִיר"
          },
          {
            "t": "נָתַ֥תִּי",
            "l": "5414",
            "s": "5414",
            "m": "HVqp1cs",
            "g": 16,
            "pn": false,
            "v": 17,
            "gl": "to give",
            "lx": "נָתַן"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הַ/גִּלְעָֽד",
            "l": "d/1568",
            "s": "1568",
            "m": "HTd/Np",
            "g": 8,
            "pn": true,
            "v": 8,
            "gl": "Gilad",
            "lx": "גִּלְעָד"
          }
        ]
      },
      {
        "id": "reader-deut-5-17",
        "book": "Deut",
        "ref": "Deut 5:17",
        "gateLesson": 23,
        "tier": "strict",
        "wooden": "You shall not murder.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "לֹ֖א",
            "l": "3808",
            "s": "3808",
            "m": "HTn",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "not",
            "lx": "לֹא"
          },
          {
            "t": "תִּרְצָֽח",
            "l": "7523",
            "s": "7523",
            "m": "HVqi2ms",
            "g": 23,
            "pn": false,
            "v": null,
            "gl": "to dash in pieces",
            "lx": "רָצַח"
          }
        ]
      },
      {
        "id": "reader-deut-5-18",
        "book": "Deut",
        "ref": "Deut 5:18",
        "gateLesson": 23,
        "tier": "strict",
        "wooden": "And you shall not commit adultery.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/לֹ֖א",
            "l": "c/3808",
            "s": "3808",
            "m": "HC/Tn",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "not",
            "lx": "לֹא"
          },
          {
            "t": "תִּנְאָֽף",
            "l": "5003",
            "s": "5003",
            "m": "HVqi2ms",
            "g": 23,
            "pn": false,
            "v": null,
            "gl": "to commit adultery",
            "lx": "נָאַף"
          }
        ]
      },
      {
        "id": "reader-deut-5-19",
        "book": "Deut",
        "ref": "Deut 5:19",
        "gateLesson": 23,
        "tier": "strict",
        "wooden": "And you shall not steal.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/לֹ֖א",
            "l": "c/3808",
            "s": "3808",
            "m": "HC/Tn",
            "g": 13,
            "pn": false,
            "v": 5,
            "gl": "not",
            "lx": "לֹא"
          },
          {
            "t": "תִּגְנֹֽב",
            "l": "1589",
            "s": "1589",
            "m": "HVqi2ms",
            "g": 23,
            "pn": false,
            "v": null,
            "gl": "to thieve",
            "lx": "גָּנַב"
          }
        ]
      },
      {
        "id": "reader-deut-6-4",
        "book": "Deut",
        "ref": "Deut 6:4",
        "gateLesson": 45,
        "tier": "strict",
        "wooden": "Hear, Israel: YHWH our God, YHWH one.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "שְׁמַ֖ע",
            "l": "8085",
            "s": "8085",
            "m": "HVqv2ms",
            "g": 39,
            "pn": false,
            "v": 16,
            "gl": "to hear intelligently",
            "lx": "שָׁמַע"
          },
          {
            "t": "יִשְׂרָאֵ֑ל",
            "l": "3478",
            "s": "3478",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jisrael",
            "lx": "יִשְׂרָאֵל"
          },
          {
            "t": "יְהוָ֥ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "אֱלֹהֵ֖י/נוּ",
            "l": "430",
            "s": "430",
            "m": "HNcmpc/Sp1cp",
            "g": 31,
            "pn": false,
            "v": 3,
            "gl": "gods in the ordinary sense",
            "lx": "אֱלֹהִים"
          },
          {
            "t": "יְהוָ֥ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "אֶחָֽד",
            "l": "259",
            "s": "259",
            "m": "HAcmsa",
            "g": 45,
            "pn": false,
            "v": null,
            "gl": "united",
            "lx": "אֶחָד"
          }
        ]
      },
      {
        "id": "reader-exod-6-17",
        "book": "Exod",
        "ref": "Exod 6:17",
        "gateLesson": 31,
        "tier": "strict",
        "wooden": "The sons of Gereshon: Libni and Shimi, according to their clans.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "בְּנֵ֥י",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "גֵרְשׁ֛וֹן",
            "l": "1648",
            "s": "1648",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Gereshon or Gereshom",
            "lx": "גֵּרְשׁוֹן"
          },
          {
            "t": "לִבְנִ֥י",
            "l": "3845",
            "s": "3845",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Libni",
            "lx": "לִבְנִי"
          },
          {
            "t": "וְ/שִׁמְעִ֖י",
            "l": "c/8096",
            "s": "8096",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Shimi",
            "lx": "שִׁמְעִי"
          },
          {
            "t": "לְ/מִשְׁפְּחֹתָֽ/ם",
            "l": "l/4940",
            "s": "4940",
            "m": "HR/Ncfpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": null,
            "gl": "a family",
            "lx": "מִשְׁפָּחָה"
          }
        ]
      },
      {
        "id": "reader-1sam-30-28",
        "book": "1Sam",
        "ref": "1Sam 30:28",
        "gateLesson": 30,
        "tier": "strict",
        "wooden": "and to those who were in Aroer, and to those who were in Siphmoth, and to those who were in Eshtemoa,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/לַ/אֲשֶׁ֧ר",
            "l": "c/l/834 a",
            "s": "834",
            "m": "HC/R/Tr",
            "g": 30,
            "pn": false,
            "v": 13,
            "gl": "who",
            "lx": "אֲשֶׁר"
          },
          {
            "t": "בַּ/עֲרֹעֵ֛ר",
            "l": "b/6177",
            "s": "6177",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Aroer",
            "lx": "עֲרוֹעֵר"
          },
          {
            "t": "וְ/לַ/אֲשֶׁ֥ר",
            "l": "c/l/834 a",
            "s": "834",
            "m": "HC/R/Tr",
            "g": 30,
            "pn": false,
            "v": 13,
            "gl": "who",
            "lx": "אֲשֶׁר"
          },
          {
            "t": "בְּ/שִֽׂפְמ֖וֹת",
            "l": "b/8224",
            "s": "8224",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Siphmoth",
            "lx": "שִׂפְמוֹת"
          },
          {
            "t": "וְ/לַ/אֲשֶׁ֥ר",
            "l": "c/l/834 a",
            "s": "834",
            "m": "HC/R/Tr",
            "g": 30,
            "pn": false,
            "v": 13,
            "gl": "who",
            "lx": "אֲשֶׁר"
          },
          {
            "t": "בְּ/אֶשְׁתְּמֹֽעַ",
            "l": "b/851",
            "s": "851",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Eshtemoa or Eshtemoh",
            "lx": "אֶשְׁתְּמֹעַ"
          }
        ]
      },
      {
        "id": "reader-ruth-1-3",
        "book": "Ruth",
        "ref": "Ruth 1:3",
        "gateLesson": 45,
        "tier": "strict",
        "wooden": "And Elimelek, husband of Naomi, died, and she was left, she and her two sons.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יָּ֥מָת",
            "l": "c/4191",
            "s": "4191",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 30,
            "gl": "to die",
            "lx": "מוּת"
          },
          {
            "t": "אֱלִימֶ֖לֶךְ",
            "l": "458",
            "s": "458",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Elimelek",
            "lx": "אֱלִימֶלֶךְ"
          },
          {
            "t": "אִ֣ישׁ",
            "l": "376",
            "s": "376",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 6,
            "gl": "a man as an individual or a male person",
            "lx": "אִישׁ"
          },
          {
            "t": "נָעֳמִ֑י",
            "l": "5281",
            "s": "5281",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Noomi",
            "lx": "נׇעֳמִי"
          },
          {
            "t": "וַ/תִּשָּׁאֵ֥ר",
            "l": "c/7604",
            "s": "7604",
            "m": "HC/VNw3fs",
            "g": 37,
            "pn": false,
            "v": null,
            "gl": "to swell up",
            "lx": "שָׁאַר"
          },
          {
            "t": "הִ֖יא",
            "l": "1931",
            "s": "1931",
            "m": "HPp3fs",
            "g": 5,
            "pn": false,
            "v": 5,
            "gl": "he",
            "lx": "הוּא"
          },
          {
            "t": "וּ/שְׁנֵ֥י",
            "l": "c/8147",
            "s": "8147",
            "m": "HC/Acmdc",
            "g": 45,
            "pn": false,
            "v": 31,
            "gl": "two",
            "lx": "שְׁנַיִם"
          },
          {
            "t": "בָנֶֽי/הָ",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc/Sp3fs",
            "g": 31,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          }
        ]
      },
      {
        "id": "reader-ruth-1-10",
        "book": "Ruth",
        "ref": "Ruth 1:10",
        "gateLesson": 35,
        "tier": "guided",
        "wooden": "And they said to her, 'For with you we will return to your people.'",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/תֹּאמַ֖רְנָה",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3fp",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          },
          {
            "t": "לָּ֑/הּ",
            "l": "l",
            "s": null,
            "m": "HR/Sp3fs",
            "g": 22,
            "pn": false,
            "v": 8,
            "gl": null,
            "lx": null
          },
          {
            "t": "כִּי",
            "l": "3588 a",
            "s": "3588",
            "m": "HC",
            "g": 13,
            "pn": false,
            "v": 30,
            "gl": "for, that, because, when",
            "lx": "כִּי"
          },
          {
            "t": "אִתָּ֥/ךְ",
            "l": "854",
            "s": "854",
            "m": "HR/Sp2fs",
            "g": 22,
            "pn": false,
            "v": 5,
            "gl": "nearness",
            "lx": "אֵת"
          },
          {
            "t": "נָשׁ֖וּב",
            "l": "7725",
            "s": "7725",
            "m": "HVqi1cp",
            "g": 27,
            "pn": false,
            "v": null,
            "gl": "to turn back",
            "lx": "שׁוּב"
          },
          {
            "t": "לְ/עַמֵּֽ/ךְ",
            "l": "l/5971 a",
            "s": "5971",
            "m": "HR/Ncmsc/Sp2fs",
            "g": 22,
            "pn": false,
            "v": 15,
            "gl": "a people",
            "lx": "עַם"
          }
        ]
      },
      {
        "id": "reader-jonah-1-1",
        "book": "Jonah",
        "ref": "Jonah 1:1",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And the word of YHWH was to Jonah son of Amittai, saying,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַֽ/יְהִי֙",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6,
            "gl": "to exist",
            "lx": "הָיָה"
          },
          {
            "t": "דְּבַר",
            "l": "1697",
            "s": "1697",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 5,
            "gl": "a word",
            "lx": "דָּבָר"
          },
          {
            "t": "יְהוָ֔ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "יוֹנָ֥ה",
            "l": "3124",
            "s": "3124",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jonah",
            "lx": "יוֹנָה"
          },
          {
            "t": "בֶן",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "אֲמִתַּ֖י",
            "l": "573",
            "s": "573",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Amittai",
            "lx": "אֲמִתַּי"
          },
          {
            "t": "לֵ/אמֹֽר",
            "l": "l/559",
            "s": "559",
            "m": "HR/Vqc",
            "g": 24,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          }
        ]
      },
      {
        "id": "reader-jonah-4-4",
        "book": "Jonah",
        "ref": "Jonah 4:4",
        "gateLesson": 35,
        "tier": "guided",
        "wooden": "And YHWH said, 'Does it burn well for you?'",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יֹּ֣אמֶר",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          },
          {
            "t": "יְהוָ֔ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "הַ/הֵיטֵ֖ב",
            "l": "d/3190",
            "s": "3190",
            "m": "HTi/Vha",
            "g": 29,
            "pn": false,
            "v": null,
            "gl": "to be",
            "lx": "יָטַב"
          },
          {
            "t": "חָ֥רָה",
            "l": "2734",
            "s": "2734",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 36,
            "gl": "to glow or grow warm",
            "lx": "חָרָה"
          },
          {
            "t": "לָֽ/ךְ",
            "l": "l",
            "s": null,
            "m": "HR/Sp2fs",
            "g": 22,
            "pn": false,
            "v": null,
            "gl": null,
            "lx": null
          }
        ]
      },
      {
        "id": "reader-exod-13-1",
        "book": "Exod",
        "ref": "Exod 13:1",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And YHWH spoke to Mosheh, saying,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יְדַבֵּ֥ר",
            "l": "c/1696",
            "s": "1696",
            "m": "HC/Vpw3ms",
            "g": 35,
            "pn": false,
            "v": 15,
            "gl": "to arrange",
            "lx": "דָבַר"
          },
          {
            "t": "יְהוָ֖ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "מֹשֶׁ֥ה",
            "l": "4872",
            "s": "4872",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Mosheh",
            "lx": "מֹשֶׁה"
          },
          {
            "t": "לֵּ/אמֹֽר",
            "l": "l/559",
            "s": "559",
            "m": "HR/Vqc",
            "g": 24,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          }
        ]
      },
      {
        "id": "reader-exod-14-1",
        "book": "Exod",
        "ref": "Exod 14:1",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And YHWH spoke to Mosheh, saying,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יְדַבֵּ֥ר",
            "l": "c/1696",
            "s": "1696",
            "m": "HC/Vpw3ms",
            "g": 35,
            "pn": false,
            "v": 15,
            "gl": "to arrange",
            "lx": "דָבַר"
          },
          {
            "t": "יְהֹוָ֖ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "מֹשֶׁ֥ה",
            "l": "4872",
            "s": "4872",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Mosheh",
            "lx": "מֹשֶׁה"
          },
          {
            "t": "לֵּ/אמֹֽר",
            "l": "l/559",
            "s": "559",
            "m": "HR/Vqc",
            "g": 24,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          }
        ]
      },
      {
        "id": "reader-exod-16-30",
        "book": "Exod",
        "ref": "Exod 16:30",
        "gateLesson": 35,
        "tier": "guided",
        "wooden": "And the people rested on the seventh day.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יִּשְׁבְּת֥וּ",
            "l": "c/7673 a",
            "s": "7673",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to repose",
            "lx": "שָׁבַת"
          },
          {
            "t": "הָ/עָ֖ם",
            "l": "d/5971 a",
            "s": "5971",
            "m": "HTd/Ncmsa",
            "g": 8,
            "pn": false,
            "v": 13,
            "gl": "a people",
            "lx": "עַם"
          },
          {
            "t": "בַּ/יּ֥וֹם",
            "l": "b/3117",
            "s": "3117",
            "m": "HRd/Ncmsa",
            "g": 13,
            "pn": false,
            "v": 21,
            "gl": "a day",
            "lx": "יוֹם"
          },
          {
            "t": "הַ/שְּׁבִעִֽי",
            "l": "d/7637",
            "s": "7637",
            "m": "HTd/Aomsa",
            "g": 32,
            "pn": false,
            "v": null,
            "gl": "seventh",
            "lx": "שְׁבִיעִי"
          }
        ]
      },
      {
        "id": "reader-deut-2-17",
        "book": "Deut",
        "ref": "Deut 2:17",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And YHWH spoke to me, saying,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יְדַבֵּ֥ר",
            "l": "c/1696",
            "s": "1696",
            "m": "HC/Vpw3ms",
            "g": 35,
            "pn": false,
            "v": 15,
            "gl": "to arrange",
            "lx": "דָבַר"
          },
          {
            "t": "יְהוָ֖ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "אֵלַ֥/י",
            "l": "413",
            "s": "413",
            "m": "HR/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "לֵ/אמֹֽר",
            "l": "l/559",
            "s": "559",
            "m": "HR/Vqc",
            "g": 24,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          }
        ]
      },
      {
        "id": "reader-deut-3-29",
        "book": "Deut",
        "ref": "Deut 3:29",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And we dwelt in the valley opposite Beth-Peor.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/נֵּ֣שֶׁב",
            "l": "c/3427",
            "s": "3427",
            "m": "HC/Vqw1cp",
            "g": 35,
            "pn": false,
            "v": 16,
            "gl": "to sit down",
            "lx": "יָשַׁב"
          },
          {
            "t": "בַּ/גָּ֔יְא",
            "l": "b/1516",
            "s": "1516",
            "m": "HRd/Ncbsa",
            "g": 13,
            "pn": false,
            "v": null,
            "gl": "a gorge",
            "lx": "גַּיְא"
          },
          {
            "t": "מ֖וּל",
            "l": "4136",
            "s": "4136",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null,
            "gl": "abrupt",
            "lx": "מוּל"
          },
          {
            "t": "בֵּ֥ית",
            "l": "1047+",
            "s": "1047",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Beth-Peor",
            "lx": "בֵּית פְּעוֹר"
          },
          {
            "t": "פְּעֽוֹר",
            "l": "1047",
            "s": "1047",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Beth-Peor",
            "lx": "בֵּית פְּעוֹר"
          }
        ]
      },
      {
        "id": "reader-deut-25-4",
        "book": "Deut",
        "ref": "Deut 25:4",
        "gateLesson": 40,
        "tier": "guided",
        "wooden": "You shall not muzzle an ox in its threshing.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "לֹא",
            "l": "3808",
            "s": "3808",
            "m": "HTn",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "not",
            "lx": "לֹא"
          },
          {
            "t": "תַחְסֹ֥ם",
            "l": "2629",
            "s": "2629",
            "m": "HVqi2ms",
            "g": 23,
            "pn": false,
            "v": null,
            "gl": "to muzzle",
            "lx": "חָסַם"
          },
          {
            "t": "שׁ֖וֹר",
            "l": "7794",
            "s": "7794",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null,
            "gl": "a bullock",
            "lx": "שׁוֹר"
          },
          {
            "t": "בְּ/דִישֽׁ/וֹ",
            "l": "b/1758",
            "s": "1758",
            "m": "HR/Vqc/Sp3ms",
            "g": 40,
            "pn": false,
            "v": null,
            "gl": "to trample or thresh",
            "lx": "דּוּשׁ"
          }
        ]
      },
      {
        "id": "reader-judg-10-5",
        "book": "Judg",
        "ref": "Judg 10:5",
        "gateLesson": 37,
        "tier": "strict",
        "wooden": "And Jair died, and he was buried in Kamon.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יָּ֣מָת",
            "l": "c/4191",
            "s": "4191",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 30,
            "gl": "to die",
            "lx": "מוּת"
          },
          {
            "t": "יָאִ֔יר",
            "l": "2971",
            "s": "2971",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jair",
            "lx": "יָאִיר"
          },
          {
            "t": "וַ/יִּקָּבֵ֖ר",
            "l": "c/6912",
            "s": "6912",
            "m": "HC/VNw3ms",
            "g": 37,
            "pn": false,
            "v": null,
            "gl": "to inter",
            "lx": "קָבַר"
          },
          {
            "t": "בְּ/קָמֽוֹן",
            "l": "b/7056",
            "s": "7056",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Kamon",
            "lx": "קָמוֹן"
          }
        ]
      },
      {
        "id": "reader-judg-12-10",
        "book": "Judg",
        "ref": "Judg 12:10",
        "gateLesson": 37,
        "tier": "strict",
        "wooden": "And Ibtsan died, and he was buried in Beth-Lechem.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יָּ֣מָת",
            "l": "c/4191",
            "s": "4191",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 30,
            "gl": "to die",
            "lx": "מוּת"
          },
          {
            "t": "אִבְצָ֔ן",
            "l": "78",
            "s": "78",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Ibtsan",
            "lx": "אִבְצָן"
          },
          {
            "t": "וַ/יִּקָּבֵ֖ר",
            "l": "c/6912",
            "s": "6912",
            "m": "HC/VNw3ms",
            "g": 37,
            "pn": false,
            "v": null,
            "gl": "to inter",
            "lx": "קָבַר"
          },
          {
            "t": "בְּ/בֵ֥ית",
            "l": "b/1035+",
            "s": "1035",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": 13,
            "gl": "Beth-Lechem",
            "lx": "בֵּית לֶחֶם"
          },
          {
            "t": "לָֽחֶם",
            "l": "1035",
            "s": "1035",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Beth-Lechem",
            "lx": "בֵּית לֶחֶם"
          }
        ]
      },
      {
        "id": "reader-judg-14-7",
        "book": "Judg",
        "ref": "Judg 14:7",
        "gateLesson": 35,
        "tier": "guided",
        "wooden": "And he went down, and he spoke to the woman, and she was right in the eyes of Shimshon.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יֵּ֖רֶד",
            "l": "c/3381",
            "s": "3381",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to descend",
            "lx": "יָרַד"
          },
          {
            "t": "וַ/יְדַבֵּ֣ר",
            "l": "c/1696",
            "s": "1696",
            "m": "HC/Vpw3ms",
            "g": 35,
            "pn": false,
            "v": 15,
            "gl": "to arrange",
            "lx": "דָבַר"
          },
          {
            "t": "לָ/אִשָּׁ֑ה",
            "l": "l/802",
            "s": "802",
            "m": "HRd/Ncfsa",
            "g": 13,
            "pn": false,
            "v": 6,
            "gl": "a woman",
            "lx": "אִשָּׁה"
          },
          {
            "t": "וַ/תִּישַׁ֖ר",
            "l": "c/3474",
            "s": "3474",
            "m": "HC/Vqw3fs",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to be straight or even",
            "lx": "יָשַׁר"
          },
          {
            "t": "בְּ/עֵינֵ֥י",
            "l": "b/5869 a",
            "s": "5869",
            "m": "HR/Ncbdc",
            "g": 20,
            "pn": false,
            "v": 10,
            "gl": "an eye",
            "lx": "עַיִן"
          },
          {
            "t": "שִׁמְשֽׁוֹן",
            "l": "8123",
            "s": "8123",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Shimshon",
            "lx": "שִׁמְשׁוֹן"
          }
        ]
      },
      {
        "id": "reader-1sam-15-10",
        "book": "1Sam",
        "ref": "1Sam 15:10",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And the word of YHWH was to Shemuel, saying,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַֽ/יְהִי֙",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6,
            "gl": "to exist",
            "lx": "הָיָה"
          },
          {
            "t": "דְּבַר",
            "l": "1697",
            "s": "1697",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 5,
            "gl": "a word",
            "lx": "דָּבָר"
          },
          {
            "t": "יְהוָ֔ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "שְׁמוּאֵ֖ל",
            "l": "8050",
            "s": "8050",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Shemuel",
            "lx": "שְׁמוּאֵל"
          },
          {
            "t": "לֵ/אמֹֽר",
            "l": "l/559",
            "s": "559",
            "m": "HR/Vqc",
            "g": 24,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          }
        ]
      },
      {
        "id": "reader-1sam-10-17",
        "book": "1Sam",
        "ref": "1Sam 10:17",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And Shemuel summoned the people to YHWH at the Mitspah.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יַּצְעֵ֤ק",
            "l": "c/6817",
            "s": "6817",
            "m": "HC/Vhw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to shriek",
            "lx": "צָעַק"
          },
          {
            "t": "שְׁמוּאֵל֙",
            "l": "8050",
            "s": "8050",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Shemuel",
            "lx": "שְׁמוּאֵל"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "הָ/עָ֔ם",
            "l": "d/5971 a",
            "s": "5971",
            "m": "HTd/Ncmsa",
            "g": 8,
            "pn": false,
            "v": 13,
            "gl": "a people",
            "lx": "עַם"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "יְהוָ֖ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          },
          {
            "t": "הַ/מִּצְפָּֽה",
            "l": "d/4709",
            "s": "4709",
            "m": "HTd/Np",
            "g": 8,
            "pn": true,
            "v": 8,
            "gl": "Mitspah",
            "lx": "מִצְפָּה"
          }
        ]
      },
      {
        "id": "reader-1sam-10-13",
        "book": "1Sam",
        "ref": "1Sam 10:13",
        "gateLesson": 37,
        "tier": "guided",
        "wooden": "And he finished from prophesying, and he came to the high place.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יְכַל֙",
            "l": "c/3615",
            "s": "3615",
            "m": "HC/Vpw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to end",
            "lx": "כָּלָה"
          },
          {
            "t": "מֵֽ/הִתְנַבּ֔וֹת",
            "l": "m/5012",
            "s": "5012",
            "m": "HR/Vtc",
            "g": 37,
            "pn": false,
            "v": null,
            "gl": "to prophesy",
            "lx": "נָבָא"
          },
          {
            "t": "וַ/יָּבֹ֖א",
            "l": "c/935",
            "s": "935",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          },
          {
            "t": "הַ/בָּמָֽה",
            "l": "d/1116",
            "s": "1116",
            "m": "HTd/Ncfsa",
            "g": 8,
            "pn": false,
            "v": null,
            "gl": "an elevation",
            "lx": "בָּמָה"
          }
        ]
      },
      {
        "id": "reader-2sam-17-26",
        "book": "2Sam",
        "ref": "2Sam 17:26",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And Israel and Abshalom camped in the land of the Gilad.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יִּ֤חַן",
            "l": "c/2583",
            "s": "2583",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to incline",
            "lx": "חָנָה"
          },
          {
            "t": "יִשְׂרָאֵל֙",
            "l": "3478",
            "s": "3478",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jisrael",
            "lx": "יִשְׂרָאֵל"
          },
          {
            "t": "וְ/אַבְשָׁלֹ֔ם",
            "l": "c/53",
            "s": "53",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Abshalom",
            "lx": "אֲבִישָׁלוֹם"
          },
          {
            "t": "אֶ֖רֶץ",
            "l": "776",
            "s": "776",
            "m": "HNcbsc",
            "g": 20,
            "pn": false,
            "v": 9,
            "gl": "the earth",
            "lx": "אֶרֶץ"
          },
          {
            "t": "הַ/גִּלְעָֽד",
            "l": "d/1568",
            "s": "1568",
            "m": "HTd/Np",
            "g": 8,
            "pn": true,
            "v": 8,
            "gl": "Gilad",
            "lx": "גִּלְעָד"
          }
        ]
      },
      {
        "id": "reader-2sam-24-19",
        "book": "2Sam",
        "ref": "2Sam 24:19",
        "gateLesson": 35,
        "tier": "strict",
        "wooden": "And David went up according to the word of Gad, just as YHWH had commanded.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יַּ֤עַל",
            "l": "c/5927",
            "s": "5927",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to ascend",
            "lx": "עָלָה"
          },
          {
            "t": "דָּוִד֙",
            "l": "1732",
            "s": "1732",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "David",
            "lx": "דָּוִד"
          },
          {
            "t": "כִּ/דְבַר",
            "l": "k/1697",
            "s": "1697",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 5,
            "gl": "a word",
            "lx": "דָּבָר"
          },
          {
            "t": "גָּ֔ד",
            "l": "1410",
            "s": "1410",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Gad",
            "lx": "גָּד"
          },
          {
            "t": "כַּ/אֲשֶׁ֖ר",
            "l": "k/834 d",
            "s": "834",
            "m": "HR/Tr",
            "g": 30,
            "pn": false,
            "v": 13,
            "gl": "who",
            "lx": "אֲשֶׁר"
          },
          {
            "t": "צִוָּ֥ה",
            "l": "6680",
            "s": "6680",
            "m": "HVpp3ms",
            "g": 29,
            "pn": false,
            "v": 35,
            "gl": "(intensively) to constitute",
            "lx": "צָוָה"
          },
          {
            "t": "יְהוָֽה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jehovah",
            "lx": "יְהֹוָה"
          }
        ]
      },
      {
        "id": "reader-2sam-5-18",
        "book": "2Sam",
        "ref": "2Sam 5:18",
        "gateLesson": 37,
        "tier": "guided",
        "wooden": "And the Philistines came, and they spread out in the valley of Rephaim.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וּ/פְלִשְׁתִּ֖ים",
            "l": "c/6430",
            "s": "6430",
            "m": "HC/Ngmpa",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "a Pelishtite or inhabitant of Pelesheth",
            "lx": "פְּלִשְׁתִּי",
            "gent": true
          },
          {
            "t": "בָּ֑אוּ",
            "l": "935",
            "s": "935",
            "m": "HVqp3cp",
            "g": 19,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          },
          {
            "t": "וַ/יִּנָּטְשׁ֖וּ",
            "l": "c/5203",
            "s": "5203",
            "m": "HC/VNw3mp",
            "g": 37,
            "pn": false,
            "v": null,
            "gl": "to pound",
            "lx": "נָטַשׁ"
          },
          {
            "t": "בְּ/עֵ֥מֶק",
            "l": "b/6010",
            "s": "6010",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": null,
            "gl": "a vale",
            "lx": "עֵמֶק"
          },
          {
            "t": "רְפָאִֽים",
            "l": "7497 b",
            "s": "7497",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "a giant",
            "lx": "רָפָא"
          }
        ]
      },
      {
        "id": "reader-ch-gen-26-23",
        "book": "Gen",
        "ref": "Gen 26:23",
        "gateLesson": 13,
        "tier": "challenge",
        "challengeNote": "Contains 1 Past Narrative (wayyiqtol) form — introduced in Lesson 35.",
        "wooden": "And he went up from there to Beer-Sheba.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יַּ֥עַל",
            "l": "c/5927",
            "s": "5927",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to ascend",
            "lx": "עָלָה"
          },
          {
            "t": "מִ/שָּׁ֖ם",
            "l": "m/8033",
            "s": "8033",
            "m": "HR/D",
            "g": 13,
            "pn": false,
            "v": 6,
            "gl": "there",
            "lx": "שָׁם"
          },
          {
            "t": "בְּאֵ֥ר",
            "l": "884+",
            "s": "884",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Beer-Sheba",
            "lx": "בְּאֵר שֶׁבַע"
          },
          {
            "t": "שָֽׁבַע",
            "l": "884",
            "s": "884",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Beer-Sheba",
            "lx": "בְּאֵר שֶׁבַע"
          }
        ]
      },
      {
        "id": "reader-ch-1sam-21-1",
        "book": "1Sam",
        "ref": "1Sam 21:1",
        "gateLesson": 16,
        "tier": "challenge",
        "challengeNote": "Contains 2 Past Narrative (wayyiqtol) forms — introduced in Lesson 35.",
        "wooden": "And he rose and went, and Jehonathan came to the city.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יָּ֖קָם",
            "l": "c/6965 b",
            "s": "6965",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to rise",
            "lx": "קוּם"
          },
          {
            "t": "וַ/יֵּלַ֑ךְ",
            "l": "c/3212",
            "s": "3212",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 16,
            "gl": "to walk",
            "lx": "יָלַךְ"
          },
          {
            "t": "וִ/יהוֹנָתָ֖ן",
            "l": "c/3083",
            "s": "3083",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Jehonathan",
            "lx": "יְהוֹנָתָן"
          },
          {
            "t": "בָּ֥א",
            "l": "935",
            "s": "935",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          },
          {
            "t": "הָ/עִֽיר",
            "l": "d/5892 b",
            "s": "5892",
            "m": "HTd/Ncfsa",
            "g": 8,
            "pn": false,
            "v": null,
            "gl": "a city",
            "lx": "עִיר"
          }
        ]
      },
      {
        "id": "reader-ch-gen-24-34",
        "book": "Gen",
        "ref": "Gen 24:34",
        "gateLesson": 20,
        "tier": "challenge",
        "challengeNote": "Contains 1 Past Narrative (wayyiqtol) form — introduced in Lesson 35.",
        "wooden": "And he said, 'Servant of Abraham am I.'",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יֹּאמַ֑ר",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          },
          {
            "t": "עֶ֥בֶד",
            "l": "5650",
            "s": "5650",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 11,
            "gl": "a servant",
            "lx": "עֶבֶד"
          },
          {
            "t": "אַבְרָהָ֖ם",
            "l": "85",
            "s": "85",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Abraham",
            "lx": "אַבְרָהָם"
          },
          {
            "t": "אָנֹֽכִי",
            "l": "595",
            "s": "595",
            "m": "HPp1cs",
            "g": 5,
            "pn": false,
            "v": null,
            "gl": "I",
            "lx": "אָנֹכִי"
          }
        ]
      },
      {
        "id": "reader-ch-gen-23-12",
        "book": "Gen",
        "ref": "Gen 23:12",
        "gateLesson": 20,
        "tier": "challenge",
        "challengeNote": "Contains 1 Hitpael wayyiqtol form (וַיִּשְׁתַּחוּ, \"and he bowed down\") — the Nifal/Hitpael stem floor introduced in Lesson 37.",
        "wooden": "And Abraham bowed down before the people of the land.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יִּשְׁתַּ֨חוּ֙",
            "l": "c/7812",
            "s": "7812",
            "m": "HC/Vtw3ms",
            "g": 37,
            "pn": false,
            "v": null,
            "gl": "to depress",
            "lx": "שָׁחָה"
          },
          {
            "t": "אַבְרָהָ֔ם",
            "l": "85",
            "s": "85",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Abraham",
            "lx": "אַבְרָהָם"
          },
          {
            "t": "לִ/פְנֵ֖י",
            "l": "l/6440",
            "s": "6440",
            "m": "HR/Ncbpc",
            "g": 20,
            "pn": false,
            "v": null,
            "gl": "the face",
            "lx": "פָּנִים"
          },
          {
            "t": "עַ֥ם",
            "l": "5971 a",
            "s": "5971",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 13,
            "gl": "a people",
            "lx": "עַם"
          },
          {
            "t": "הָ/אָֽרֶץ",
            "l": "d/776",
            "s": "776",
            "m": "HTd/Ncbsa",
            "g": 8,
            "pn": false,
            "v": 9,
            "gl": "the earth",
            "lx": "אֶרֶץ"
          }
        ]
      },
      {
        "id": "reader-ch-gen-8-15",
        "book": "Gen",
        "ref": "Gen 8:15",
        "gateLesson": 24,
        "tier": "challenge",
        "challengeNote": "Contains 1 Piel Past-Narrative (wayyiqtol) form — introduced in Lesson 35.",
        "wooden": "And God spoke to Noach, saying,",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וַ/יְדַבֵּ֥ר",
            "l": "c/1696",
            "s": "1696",
            "m": "HC/Vpw3ms",
            "g": 35,
            "pn": false,
            "v": 15,
            "gl": "to arrange",
            "lx": "דָבַר"
          },
          {
            "t": "אֱלֹהִ֖ים",
            "l": "430",
            "s": "430",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 3,
            "gl": "gods in the ordinary sense",
            "lx": "אֱלֹהִים"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "נֹ֥חַ",
            "l": "5146",
            "s": "5146",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Noach",
            "lx": "נֹחַ"
          },
          {
            "t": "לֵ/אמֹֽר",
            "l": "l/559",
            "s": "559",
            "m": "HR/Vqc",
            "g": 24,
            "pn": false,
            "v": null,
            "gl": "to say",
            "lx": "אָמַר"
          }
        ]
      },
      {
        "id": "reader-ch-exod-6-11",
        "book": "Exod",
        "ref": "Exod 6:11",
        "gateLesson": 29,
        "tier": "challenge",
        "challengeNote": "Contains 2 Imperative forms (בֹּא \"go!\", דַבֵּר \"speak!\") — the Imperative introduced in Lesson 39.",
        "wooden": "Go, speak to Paroh, king of Mitsrayim, that he send away the sons of Israel from his land.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "בֹּ֣א",
            "l": "935",
            "s": "935",
            "m": "HVqv2ms",
            "g": 39,
            "pn": false,
            "v": 26,
            "gl": "to go or come",
            "lx": "בּוֹא"
          },
          {
            "t": "דַבֵּ֔ר",
            "l": "1696",
            "s": "1696",
            "m": "HVpv2ms",
            "g": 39,
            "pn": false,
            "v": 5,
            "gl": "to arrange",
            "lx": "דָבַר"
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": 42,
            "gl": "near",
            "lx": "אֵל"
          },
          {
            "t": "פַּרְעֹ֖ה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Paroh",
            "lx": "פַּרְעֹה"
          },
          {
            "t": "מֶ֣לֶךְ",
            "l": "4428",
            "s": "4428",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 9,
            "gl": "a king",
            "lx": "מֶלֶךְ"
          },
          {
            "t": "מִצְרָ֑יִם",
            "l": "4714",
            "s": "4714",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Mitsrajim",
            "lx": "מִצְרַיִם"
          },
          {
            "t": "וִֽ/ישַׁלַּ֥ח",
            "l": "c/7971",
            "s": "7971",
            "m": "HC/Vpi3ms",
            "g": 29,
            "pn": false,
            "v": 15,
            "gl": "to send away",
            "lx": "שָׁלַח"
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": 5,
            "gl": "self",
            "lx": "אֵת"
          },
          {
            "t": "בְּנֵֽי",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7,
            "gl": "a son",
            "lx": "בֵּן"
          },
          {
            "t": "יִשְׂרָאֵ֖ל",
            "l": "3478",
            "s": "3478",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Jisrael",
            "lx": "יִשְׂרָאֵל"
          },
          {
            "t": "מֵ/אַרְצֽ/וֹ",
            "l": "m/776",
            "s": "776",
            "m": "HR/Ncbsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 9,
            "gl": "the earth",
            "lx": "אֶרֶץ"
          }
        ]
      },
      {
        "id": "reader-ch-1sam-17-14",
        "book": "1Sam",
        "ref": "1Sam 17:14",
        "gateLesson": 32,
        "tier": "challenge",
        "challengeNote": "Contains 1 numeral form (שְׁלֹשָׁה \"three\") — Numerals introduced in Lesson 45.",
        "wooden": "And David, he was the small one, and the three great ones went after Shaul.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/דָוִ֖ד",
            "l": "c/1732",
            "s": "1732",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "David",
            "lx": "דָּוִד"
          },
          {
            "t": "ה֣וּא",
            "l": "1931",
            "s": "1931",
            "m": "HPp3ms",
            "g": 5,
            "pn": false,
            "v": 5,
            "gl": "he",
            "lx": "הוּא"
          },
          {
            "t": "הַ/קָּטָ֑ן",
            "l": "d/6996 a",
            "s": "6996",
            "m": "HTd/Aamsa",
            "g": 32,
            "pn": false,
            "v": 32,
            "gl": "abbreviated",
            "lx": "קָטָן"
          },
          {
            "t": "וּ/שְׁלֹשָׁה֙",
            "l": "c/7969",
            "s": "7969",
            "m": "HC/Acmsa",
            "g": 45,
            "pn": false,
            "v": null,
            "gl": "three",
            "lx": "שָׁלוֹשׁ"
          },
          {
            "t": "הַ/גְּדֹלִ֔ים",
            "l": "d/1419 a",
            "s": "1419",
            "m": "HTd/Aampa",
            "g": 32,
            "pn": false,
            "v": 32,
            "gl": "great",
            "lx": "גָּדוֹל"
          },
          {
            "t": "הָלְכ֖וּ",
            "l": "1980",
            "s": "1980",
            "m": "HVqp3cp",
            "g": 19,
            "pn": false,
            "v": 16,
            "gl": "to walk",
            "lx": "הָלַךְ"
          },
          {
            "t": "אַחֲרֵ֥י",
            "l": "310 a",
            "s": "310",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null,
            "gl": "the hind part",
            "lx": "אַחַר"
          },
          {
            "t": "שָׁאֽוּל",
            "l": "7586",
            "s": "7586",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Shaul",
            "lx": "שָׁאוּל"
          }
        ]
      },
      {
        "id": "reader-ch-2sam-13-38",
        "book": "2Sam",
        "ref": "2Sam 13:38",
        "gateLesson": 35,
        "tier": "challenge",
        "challengeNote": "Contains 1 numeral form (שָׁלֹשׁ \"three\") — Numerals introduced in Lesson 45.",
        "wooden": "And Abshalom fled, and he went to Geshur, and he was there three years.",
        "woodenStatus": "draft",
        "tokens": [
          {
            "t": "וְ/אַבְשָׁל֥וֹם",
            "l": "c/53",
            "s": "53",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null,
            "gl": "Abshalom",
            "lx": "אֲבִישָׁלוֹם"
          },
          {
            "t": "בָּרַ֖ח",
            "l": "1272",
            "s": "1272",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 39,
            "gl": "to bolt",
            "lx": "בָּרַח"
          },
          {
            "t": "וַ/יֵּ֣לֶךְ",
            "l": "c/3212",
            "s": "3212",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 16,
            "gl": "to walk",
            "lx": "יָלַךְ"
          },
          {
            "t": "גְּשׁ֑וּר",
            "l": "1650",
            "s": "1650",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null,
            "gl": "Geshur",
            "lx": "גְּשׁוּר"
          },
          {
            "t": "וַ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6,
            "gl": "to exist",
            "lx": "הָיָה"
          },
          {
            "t": "שָׁ֖ם",
            "l": "8033",
            "s": "8033",
            "m": "HD",
            "g": 1,
            "pn": false,
            "v": 6,
            "gl": "there",
            "lx": "שָׁם"
          },
          {
            "t": "שָׁלֹ֥שׁ",
            "l": "7969",
            "s": "7969",
            "m": "HAcfsa",
            "g": 45,
            "pn": false,
            "v": null,
            "gl": "three",
            "lx": "שָׁלוֹשׁ"
          },
          {
            "t": "שָׁנִֽים",
            "l": "8141",
            "s": "8141",
            "m": "HNcfpa",
            "g": 10,
            "pn": false,
            "v": null,
            "gl": "a year",
            "lx": "שָׁנֶה"
          }
        ]
      }
    ]
  };
})();
