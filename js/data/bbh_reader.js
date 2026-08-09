// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_reader_data.mjs
// (sources: source/bbh/reader/corpus-pin.json, gate-map.json, selections.json
// + a fresh run of tools/import_oshb_reader.mjs against the pinned OSHB
// checkout — see that file's header. NOT a hand-authored source itself.)
//
// Phase 2 PR D curated Reader passages. Self-registers on
// window.BBH_READER as a CLASSIC (non-module) script — same idiom as
// js/data/bbh_vocab.js registering window.SETS and js/data/bbh_parsing.js
// registering window.BBH_PARSING — so it can be dropped into index.html's
// plain <script> tags without touching the ES-module import graph. NOT YET
// wired into index.html or sw.js precache as of PR D — that lands with the
// Reader UI in a later PR; this file existing unused on disk is expected
// at this stage.
//
// Shape: { schemaVersion, attribution, corpusPin: {tag, commit},
// passages: [{ id, ref, gateLesson, tier, tokens: [{t,l,s,m,g,pn,v}] }] }.
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
        "ref": "Gen 22:22",
        "gateLesson": 13,
        "tier": "strict",
        "tokens": [
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "כֶּ֣שֶׂד",
            "l": "3777",
            "s": "3777",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "חֲז֔וֹ",
            "l": "2375",
            "s": "2375",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "פִּלְדָּ֖שׁ",
            "l": "6394",
            "s": "6394",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "יִדְלָ֑ף",
            "l": "3044",
            "s": "3044",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֵ֖ת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "בְּתוּאֵֽל",
            "l": "1328 a",
            "s": "1328",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-25-14",
        "ref": "Gen 25:14",
        "gateLesson": 13,
        "tier": "strict",
        "tokens": [
          {
            "t": "וּ/מִשְׁמָ֥ע",
            "l": "c/4927",
            "s": "4927",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/דוּמָ֖ה",
            "l": "c/1746",
            "s": "1746",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "וּ/מַשָּֽׂא",
            "l": "c/4854",
            "s": "4854",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-25-15",
        "ref": "Gen 25:15",
        "gateLesson": 13,
        "tier": "strict",
        "tokens": [
          {
            "t": "חֲדַ֣ד",
            "l": "2301",
            "s": "2301",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/תֵימָ֔א",
            "l": "c/8485",
            "s": "8485",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "יְט֥וּר",
            "l": "3195",
            "s": "3195",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "נָפִ֖ישׁ",
            "l": "5305",
            "s": "5305",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וָ/קֵֽדְמָה",
            "l": "c/6929",
            "s": "6929",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-10-27",
        "ref": "Gen 10:27",
        "gateLesson": 13,
        "tier": "strict",
        "tokens": [
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "הֲדוֹרָ֥ם",
            "l": "1913 a",
            "s": "1913",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "אוּזָ֖ל",
            "l": "187",
            "s": "187",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "דִּקְלָֽה",
            "l": "1853",
            "s": "1853",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-10-16",
        "ref": "Gen 10:16",
        "gateLesson": 13,
        "tier": "guided",
        "tokens": [
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "הַ/יְבוּסִי֙",
            "l": "d/2983",
            "s": "2983",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": false,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "הָ֣/אֱמֹרִ֔י",
            "l": "d/567",
            "s": "567",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": false,
            "v": null
          },
          {
            "t": "וְ/אֵ֖ת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "הַ/גִּרְגָּשִֽׁי",
            "l": "d/1622",
            "s": "1622",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-10-17",
        "ref": "Gen 10:17",
        "gateLesson": 13,
        "tier": "guided",
        "tokens": [
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "הַֽ/חִוִּ֥י",
            "l": "d/2340",
            "s": "2340",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": false,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "הַֽ/עַרְקִ֖י",
            "l": "d/6208",
            "s": "6208",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": false,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "הַ/סִּינִֽי",
            "l": "d/5513",
            "s": "5513",
            "m": "HTd/Ngmsa",
            "g": 8,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-10-26",
        "ref": "Gen 10:26",
        "gateLesson": 16,
        "tier": "strict",
        "tokens": [
          {
            "t": "וְ/יָקְטָ֣ן",
            "l": "c/3355",
            "s": "3355",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "יָלַ֔ד",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "אַלְמוֹדָ֖ד",
            "l": "486",
            "s": "486",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "שָׁ֑לֶף",
            "l": "8026",
            "s": "8026",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "חֲצַרְמָ֖וֶת",
            "l": "2700",
            "s": "2700",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "יָֽרַח",
            "l": "3392",
            "s": "3392",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-16-14",
        "ref": "Gen 16:14",
        "gateLesson": 16,
        "tier": "strict",
        "tokens": [
          {
            "t": "עַל",
            "l": "5921 a",
            "s": "5921",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "כֵּן֙",
            "l": "3651 c",
            "s": "3651",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "קָרָ֣א",
            "l": "7121",
            "s": "7121",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 16
          },
          {
            "t": "לַ/בְּאֵ֔ר",
            "l": "l/875",
            "s": "875",
            "m": "HRd/Ncfsa",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "בְּאֵ֥ר",
            "l": "883+",
            "s": "883",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "לַחַ֖י",
            "l": "883+",
            "s": "883",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "רֹאִ֑י",
            "l": "883",
            "s": "883",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "הִנֵּ֥ה",
            "l": "2009",
            "s": "2009",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "בֵין",
            "l": "996",
            "s": "996",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "קָדֵ֖שׁ",
            "l": "6946",
            "s": "6946",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וּ/בֵ֥ין",
            "l": "c/996",
            "s": "996",
            "m": "HC/R",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "בָּֽרֶד",
            "l": "1260",
            "s": "1260",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-1-1",
        "ref": "Gen 1:1",
        "gateLesson": 16,
        "tier": "guided",
        "tokens": [
          {
            "t": "בְּ/רֵאשִׁ֖ית",
            "l": "b/7225",
            "s": "7225",
            "m": "HR/Ncfsa",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "בָּרָ֣א",
            "l": "1254 a",
            "s": "1254",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 24
          },
          {
            "t": "אֱלֹהִ֑ים",
            "l": "430",
            "s": "430",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 3
          },
          {
            "t": "אֵ֥ת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "הַ/שָּׁמַ֖יִם",
            "l": "d/8064",
            "s": "8064",
            "m": "HTd/Ncmpa",
            "g": 10,
            "pn": false,
            "v": 13
          },
          {
            "t": "וְ/אֵ֥ת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "הָ/אָֽרֶץ",
            "l": "d/776",
            "s": "776",
            "m": "HTd/Ncbsa",
            "g": 8,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-10-24",
        "ref": "Gen 10:24",
        "gateLesson": 16,
        "tier": "guided",
        "tokens": [
          {
            "t": "וְ/אַרְפַּכְשַׁ֖ד",
            "l": "c/775",
            "s": "775",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "יָלַ֣ד",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "שָׁ֑לַח",
            "l": "7974",
            "s": "7974",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/שֶׁ֖לַח",
            "l": "c/7974",
            "s": "7974",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "יָלַ֥ד",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "עֵֽבֶר",
            "l": "5677",
            "s": "5677",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-22-21",
        "ref": "Gen 22:21",
        "gateLesson": 22,
        "tier": "strict",
        "tokens": [
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "ע֥וּץ",
            "l": "5780",
            "s": "5780",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "בְּכֹר֖/וֹ",
            "l": "1060",
            "s": "1060",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "בּ֣וּז",
            "l": "938",
            "s": "938",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "אָחִ֑י/ו",
            "l": "251",
            "s": "251",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 10
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "קְמוּאֵ֖ל",
            "l": "7055",
            "s": "7055",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "אֲבִ֥י",
            "l": "1",
            "s": "1",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "אֲרָֽם",
            "l": "758",
            "s": "758",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-46-23",
        "ref": "Gen 46:23",
        "gateLesson": 20,
        "tier": "strict",
        "tokens": [
          {
            "t": "וּ/בְנֵי",
            "l": "c/1121 a",
            "s": "1121",
            "m": "HC/Ncmpc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "דָ֖ן",
            "l": "1835",
            "s": "1835",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "חֻשִֽׁים",
            "l": "2366 b",
            "s": "2366",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-35-24",
        "ref": "Gen 35:24",
        "gateLesson": 20,
        "tier": "strict",
        "tokens": [
          {
            "t": "בְּנֵ֣י",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "רָחֵ֔ל",
            "l": "7354",
            "s": "7354",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "יוֹסֵ֖ף",
            "l": "3130",
            "s": "3130",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וּ/בִנְיָמִֽן",
            "l": "c/1144",
            "s": "1144",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-10-3",
        "ref": "Gen 10:3",
        "gateLesson": 20,
        "tier": "strict",
        "tokens": [
          {
            "t": "וּ/בְנֵ֖י",
            "l": "c/1121 a",
            "s": "1121",
            "m": "HC/Ncmpc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "גֹּ֑מֶר",
            "l": "1586",
            "s": "1586",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "אַשְׁכֲּנַ֥ז",
            "l": "813",
            "s": "813",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/רִיפַ֖ת",
            "l": "c/7384 b",
            "s": "7384",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/תֹגַרְמָֽה",
            "l": "c/8425",
            "s": "8425",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-10-15",
        "ref": "Gen 10:15",
        "gateLesson": 22,
        "tier": "guided",
        "tokens": [
          {
            "t": "וּ/כְנַ֗עַן",
            "l": "c/3667 a",
            "s": "3667",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "יָלַ֛ד",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "צִידֹ֥ן",
            "l": "6721",
            "s": "6721",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "בְּכֹר֖/וֹ",
            "l": "1060",
            "s": "1060",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "חֵֽת",
            "l": "2845",
            "s": "2845",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-17-4",
        "ref": "Gen 17:4",
        "gateLesson": 22,
        "tier": "guided",
        "tokens": [
          {
            "t": "אֲנִ֕י",
            "l": "589",
            "s": "589",
            "m": "HPp1cs",
            "g": 5,
            "pn": false,
            "v": null
          },
          {
            "t": "הִנֵּ֥ה",
            "l": "2009",
            "s": "2009",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "בְרִיתִ֖/י",
            "l": "1285",
            "s": "1285",
            "m": "HNcfsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 7
          },
          {
            "t": "אִתָּ֑/ךְ",
            "l": "854",
            "s": "854",
            "m": "HR/Sp2fs",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "וְ/הָיִ֕יתָ",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqq2ms",
            "g": 16,
            "pn": false,
            "v": 16
          },
          {
            "t": "לְ/אַ֖ב",
            "l": "l/1",
            "s": "1",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "הֲמ֥וֹן",
            "l": "1995 a",
            "s": "1995",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": null
          },
          {
            "t": "גּוֹיִֽם",
            "l": "1471 a",
            "s": "1471",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-24-38",
        "ref": "Gen 24:38",
        "gateLesson": 23,
        "tier": "strict",
        "tokens": [
          {
            "t": "אִם",
            "l": "518 a",
            "s": "518",
            "m": "HC",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "לֹ֧א",
            "l": "3808",
            "s": "3808",
            "m": "HTn",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "בֵּית",
            "l": "1004 b",
            "s": "1004",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 8
          },
          {
            "t": "אָבִ֛/י",
            "l": "1",
            "s": "1",
            "m": "HNcmsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 7
          },
          {
            "t": "תֵּלֵ֖ךְ",
            "l": "3212",
            "s": "3212",
            "m": "HVqi2ms",
            "g": 23,
            "pn": false,
            "v": 16
          },
          {
            "t": "וְ/אֶל",
            "l": "c/413",
            "s": "413",
            "m": "HC/R",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "מִשְׁפַּחְתִּ֑/י",
            "l": "4940",
            "s": "4940",
            "m": "HNcfsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "וְ/לָקַחְתָּ֥",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqq2ms",
            "g": 16,
            "pn": false,
            "v": 16
          },
          {
            "t": "אִשָּׁ֖ה",
            "l": "802",
            "s": "802",
            "m": "HNcfsa",
            "g": 7,
            "pn": false,
            "v": 6
          },
          {
            "t": "לִ/בְנִֽ/י",
            "l": "l/1121 a",
            "s": "1121",
            "m": "HR/Ncmsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 7
          }
        ]
      },
      {
        "id": "reader-gen-24-4",
        "ref": "Gen 24:4",
        "gateLesson": 23,
        "tier": "guided",
        "tokens": [
          {
            "t": "כִּ֧י",
            "l": "3588 a",
            "s": "3588",
            "m": "HC",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "אַרְצִ֛/י",
            "l": "776",
            "s": "776",
            "m": "HNcbsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "וְ/אֶל",
            "l": "c/413",
            "s": "413",
            "m": "HC/R",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "מוֹלַדְתִּ֖/י",
            "l": "4138",
            "s": "4138",
            "m": "HNcfsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "תֵּלֵ֑ךְ",
            "l": "3212",
            "s": "3212",
            "m": "HVqi2ms",
            "g": 23,
            "pn": false,
            "v": 16
          },
          {
            "t": "וְ/לָקַחְתָּ֥",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqp2ms",
            "g": 16,
            "pn": false,
            "v": 16
          },
          {
            "t": "אִשָּׁ֖ה",
            "l": "802",
            "s": "802",
            "m": "HNcfsa",
            "g": 7,
            "pn": false,
            "v": 6
          },
          {
            "t": "לִ/בְנִ֥/י",
            "l": "l/1121 a",
            "s": "1121",
            "m": "HR/Ncmsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 7
          },
          {
            "t": "לְ/יִצְחָֽק",
            "l": "l/3327",
            "s": "3327",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-20-18",
        "ref": "Gen 20:18",
        "gateLesson": 25,
        "tier": "guided",
        "tokens": [
          {
            "t": "כִּֽי",
            "l": "3588 a",
            "s": "3588",
            "m": "HC",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "עָצֹ֤ר",
            "l": "6113",
            "s": "6113",
            "m": "HVqa",
            "g": 25,
            "pn": false,
            "v": null
          },
          {
            "t": "עָצַר֙",
            "l": "6113",
            "s": "6113",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null
          },
          {
            "t": "יְהוָ֔ה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "בְּעַ֥ד",
            "l": "1157",
            "s": "1157",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "כָּל",
            "l": "3605",
            "s": "3605",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 11
          },
          {
            "t": "רֶ֖חֶם",
            "l": "7358",
            "s": "7358",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null
          },
          {
            "t": "לְ/בֵ֣ית",
            "l": "l/1004 b",
            "s": "1004",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 8
          },
          {
            "t": "אֲבִימֶ֑לֶךְ",
            "l": "40",
            "s": "40",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "עַל",
            "l": "5921 a",
            "s": "5921",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "דְּבַ֥ר",
            "l": "1697",
            "s": "1697",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 5
          },
          {
            "t": "שָׂרָ֖ה",
            "l": "8283",
            "s": "8283",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "אֵ֥שֶׁת",
            "l": "802",
            "s": "802",
            "m": "HNcfsc",
            "g": 20,
            "pn": false,
            "v": 6
          },
          {
            "t": "אַבְרָהָֽם",
            "l": "85",
            "s": "85",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-24-1",
        "ref": "Gen 24:1",
        "gateLesson": 29,
        "tier": "strict",
        "tokens": [
          {
            "t": "וְ/אַבְרָהָ֣ם",
            "l": "c/85",
            "s": "85",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "זָקֵ֔ן",
            "l": "2204",
            "s": "2204",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 38
          },
          {
            "t": "בָּ֖א",
            "l": "935",
            "s": "935",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 26
          },
          {
            "t": "בַּ/יָּמִ֑ים",
            "l": "b/3117",
            "s": "3117",
            "m": "HRd/Ncmpa",
            "g": 13,
            "pn": false,
            "v": 13
          },
          {
            "t": "וַֽ/יהוָ֛ה",
            "l": "c/3068",
            "s": "3068",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "בֵּרַ֥ךְ",
            "l": "1288",
            "s": "1288",
            "m": "HVpp3ms",
            "g": 29,
            "pn": false,
            "v": 49
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "אַבְרָהָ֖ם",
            "l": "85",
            "s": "85",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "בַּ/כֹּֽל",
            "l": "b/3605",
            "s": "3605",
            "m": "HRd/Ncmsa",
            "g": 13,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-49-18",
        "ref": "Gen 49:18",
        "gateLesson": 29,
        "tier": "guided",
        "tokens": [
          {
            "t": "לִֽ/ישׁוּעָתְ/ךָ֖",
            "l": "l/3444",
            "s": "3444",
            "m": "HR/Ncfsc/Sp2ms",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "קִוִּ֥יתִי",
            "l": "6960 a",
            "s": "6960",
            "m": "HVpp1cs",
            "g": 29,
            "pn": false,
            "v": null
          },
          {
            "t": "יְהוָֽה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-49-5",
        "ref": "Gen 49:5",
        "gateLesson": 31,
        "tier": "guided",
        "tokens": [
          {
            "t": "שִׁמְע֥וֹן",
            "l": "8095",
            "s": "8095",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/לֵוִ֖י",
            "l": "c/3878",
            "s": "3878",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "אַחִ֑ים",
            "l": "251",
            "s": "251",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 10
          },
          {
            "t": "כְּלֵ֥י",
            "l": "3627",
            "s": "3627",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": null
          },
          {
            "t": "חָמָ֖ס",
            "l": "2555",
            "s": "2555",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null
          },
          {
            "t": "מְכֵרֹתֵי/הֶֽם",
            "l": "4380",
            "s": "4380",
            "m": "HNcfpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-36-25",
        "ref": "Gen 36:25",
        "gateLesson": 33,
        "tier": "strict",
        "tokens": [
          {
            "t": "וְ/אֵ֥לֶּה",
            "l": "c/428",
            "s": "428",
            "m": "HC/Pdxcp",
            "g": 33,
            "pn": false,
            "v": null
          },
          {
            "t": "בְנֵֽי",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "עֲנָ֖ה",
            "l": "6034",
            "s": "6034",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "דִּשֹׁ֑ן",
            "l": "1787",
            "s": "1787",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אָהֳלִיבָמָ֖ה",
            "l": "c/173",
            "s": "173",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "בַּת",
            "l": "1323",
            "s": "1323",
            "m": "HNcfsc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "עֲנָֽה",
            "l": "6034",
            "s": "6034",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-36-26",
        "ref": "Gen 36:26",
        "gateLesson": 33,
        "tier": "strict",
        "tokens": [
          {
            "t": "וְ/אֵ֖לֶּה",
            "l": "c/428",
            "s": "428",
            "m": "HC/Pdxcp",
            "g": 33,
            "pn": false,
            "v": null
          },
          {
            "t": "בְּנֵ֣י",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "דִישָׁ֑ן",
            "l": "1789",
            "s": "1789",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "חֶמְדָּ֥ן",
            "l": "2533",
            "s": "2533",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֶשְׁבָּ֖ן",
            "l": "c/790",
            "s": "790",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/יִתְרָ֥ן",
            "l": "c/3506",
            "s": "3506",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "וּ/כְרָֽן",
            "l": "c/3763",
            "s": "3763",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-36-27",
        "ref": "Gen 36:27",
        "gateLesson": 33,
        "tier": "strict",
        "tokens": [
          {
            "t": "אֵ֖לֶּה",
            "l": "428",
            "s": "428",
            "m": "HPdxcp",
            "g": 33,
            "pn": false,
            "v": null
          },
          {
            "t": "בְּנֵי",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "אֵ֑צֶר",
            "l": "687",
            "s": "687",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "בִּלְהָ֥ן",
            "l": "1092",
            "s": "1092",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/זַעֲוָ֖ן",
            "l": "c/2190",
            "s": "2190",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "וַ/עֲקָֽן",
            "l": "c/6130",
            "s": "6130",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-36-28",
        "ref": "Gen 36:28",
        "gateLesson": 33,
        "tier": "strict",
        "tokens": [
          {
            "t": "אֵ֥לֶּה",
            "l": "428",
            "s": "428",
            "m": "HPdxcp",
            "g": 33,
            "pn": false,
            "v": null
          },
          {
            "t": "בְנֵֽי",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "דִישָׁ֖ן",
            "l": "1789",
            "s": "1789",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "ע֥וּץ",
            "l": "5780",
            "s": "5780",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וַ/אֲרָֽן",
            "l": "c/765",
            "s": "765",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-10-20",
        "ref": "Gen 10:20",
        "gateLesson": 33,
        "tier": "guided",
        "tokens": [
          {
            "t": "אֵ֣לֶּה",
            "l": "428",
            "s": "428",
            "m": "HPdxcp",
            "g": 33,
            "pn": false,
            "v": null
          },
          {
            "t": "בְנֵי",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "חָ֔ם",
            "l": "2526",
            "s": "2526",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "לְ/מִשְׁפְּחֹתָ֖/ם",
            "l": "l/4940",
            "s": "4940",
            "m": "HR/Ncfpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": null
          },
          {
            "t": "לִ/לְשֹֽׁנֹתָ֑/ם",
            "l": "l/3956",
            "s": "3956",
            "m": "HR/Ncbpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": null
          },
          {
            "t": "בְּ/אַרְצֹתָ֖/ם",
            "l": "b/776",
            "s": "776",
            "m": "HR/Ncbpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": null
          },
          {
            "t": "בְּ/גוֹיֵ/הֶֽם",
            "l": "b/1471 a",
            "s": "1471",
            "m": "HR/Ncmpc/Sp3mp",
            "g": 31,
            "pn": false,
            "v": 32
          }
        ]
      },
      {
        "id": "reader-gen-36-9",
        "ref": "Gen 36:9",
        "gateLesson": 33,
        "tier": "guided",
        "tokens": [
          {
            "t": "וְ/אֵ֛לֶּה",
            "l": "c/428",
            "s": "428",
            "m": "HC/Pdxcp",
            "g": 33,
            "pn": false,
            "v": null
          },
          {
            "t": "תֹּלְד֥וֹת",
            "l": "8435",
            "s": "8435",
            "m": "HNcfpc",
            "g": 20,
            "pn": false,
            "v": null
          },
          {
            "t": "עֵשָׂ֖ו",
            "l": "6215",
            "s": "6215",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "אֲבִ֣י",
            "l": "1",
            "s": "1",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "אֱד֑וֹם",
            "l": "123",
            "s": "123",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "בְּ/הַ֖ר",
            "l": "b/2022",
            "s": "2022",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": null
          },
          {
            "t": "שֵׂעִֽיר",
            "l": "8165 a",
            "s": "8165",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-37-1",
        "ref": "Gen 37:1",
        "gateLesson": 35,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַ/יֵּ֣שֶׁב",
            "l": "c/3427",
            "s": "3427",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 16
          },
          {
            "t": "יַעֲקֹ֔ב",
            "l": "3290",
            "s": "3290",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "בְּ/אֶ֖רֶץ",
            "l": "b/776",
            "s": "776",
            "m": "HR/Ncbsc",
            "g": 20,
            "pn": false,
            "v": 9
          },
          {
            "t": "מְגוּרֵ֣י",
            "l": "4033",
            "s": "4033",
            "m": "HNcmpc",
            "g": 20,
            "pn": false,
            "v": null
          },
          {
            "t": "אָבִ֑י/ו",
            "l": "1",
            "s": "1",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 7
          },
          {
            "t": "בְּ/אֶ֖רֶץ",
            "l": "b/776",
            "s": "776",
            "m": "HR/Ncbsc",
            "g": 20,
            "pn": false,
            "v": 9
          },
          {
            "t": "כְּנָֽעַן",
            "l": "3667 a",
            "s": "3667",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-38-6",
        "ref": "Gen 38:6",
        "gateLesson": 35,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַ/יִּקַּ֧ח",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 16
          },
          {
            "t": "יְהוּדָ֛ה",
            "l": "3063",
            "s": "3063",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "אִשָּׁ֖ה",
            "l": "802",
            "s": "802",
            "m": "HNcfsa",
            "g": 7,
            "pn": false,
            "v": 6
          },
          {
            "t": "לְ/עֵ֣ר",
            "l": "l/6147",
            "s": "6147",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "בְּכוֹר֑/וֹ",
            "l": "1060",
            "s": "1060",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "וּ/שְׁמָ֖/הּ",
            "l": "c/8034",
            "s": "8034",
            "m": "HC/Ncmsc/Sp3fs",
            "g": 22,
            "pn": false,
            "v": 6
          },
          {
            "t": "תָּמָֽר",
            "l": "8559",
            "s": "8559",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-47-10",
        "ref": "Gen 47:10",
        "gateLesson": 35,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַ/יְבָ֥רֶךְ",
            "l": "c/1288",
            "s": "1288",
            "m": "HC/Vpw3ms",
            "g": 35,
            "pn": false,
            "v": 29
          },
          {
            "t": "יַעֲקֹ֖ב",
            "l": "3290",
            "s": "3290",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "פַּרְעֹ֑ה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וַ/יֵּצֵ֖א",
            "l": "c/3318",
            "s": "3318",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 22
          },
          {
            "t": "מִ/לִּ/פְנֵ֥י",
            "l": "m/l/6440",
            "s": "6440",
            "m": "HR/R/Ncbpc",
            "g": 20,
            "pn": false,
            "v": null
          },
          {
            "t": "פַרְעֹֽה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-26-6",
        "ref": "Gen 26:6",
        "gateLesson": 35,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַ/יֵּ֥שֶׁב",
            "l": "c/3427",
            "s": "3427",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 16
          },
          {
            "t": "יִצְחָ֖ק",
            "l": "3327",
            "s": "3327",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "בִּ/גְרָֽר",
            "l": "b/1642",
            "s": "1642",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-1-13",
        "ref": "Gen 1:13",
        "gateLesson": 35,
        "tier": "guided",
        "tokens": [
          {
            "t": "וַֽ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6
          },
          {
            "t": "עֶ֥רֶב",
            "l": "6153",
            "s": "6153",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null
          },
          {
            "t": "וַֽ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6
          },
          {
            "t": "בֹ֖קֶר",
            "l": "1242",
            "s": "1242",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null
          },
          {
            "t": "י֥וֹם",
            "l": "3117",
            "s": "3117",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": 21
          },
          {
            "t": "שְׁלִישִֽׁי",
            "l": "7992",
            "s": "7992",
            "m": "HAomsa",
            "g": 32,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-1-19",
        "ref": "Gen 1:19",
        "gateLesson": 35,
        "tier": "guided",
        "tokens": [
          {
            "t": "וַֽ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6
          },
          {
            "t": "עֶ֥רֶב",
            "l": "6153",
            "s": "6153",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null
          },
          {
            "t": "וַֽ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6
          },
          {
            "t": "בֹ֖קֶר",
            "l": "1242",
            "s": "1242",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null
          },
          {
            "t": "י֥וֹם",
            "l": "3117",
            "s": "3117",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": 21
          },
          {
            "t": "רְבִיעִֽי",
            "l": "7243",
            "s": "7243",
            "m": "HAomsa",
            "g": 32,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-50-12",
        "ref": "Gen 50:12",
        "gateLesson": 40,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַ/יַּעֲשׂ֥וּ",
            "l": "c/6213 a",
            "s": "6213",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": 15
          },
          {
            "t": "בָנָ֖י/ו",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmpc/Sp3ms",
            "g": 31,
            "pn": false,
            "v": 7
          },
          {
            "t": "ל֑/וֹ",
            "l": "l",
            "s": null,
            "m": "HR/Sp3ms",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "כֵּ֖ן",
            "l": "3651 c",
            "s": "3651",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "כַּ/אֲשֶׁ֥ר",
            "l": "k/834 d",
            "s": "834",
            "m": "HR/Tr",
            "g": 30,
            "pn": false,
            "v": null
          },
          {
            "t": "צִוָּֽ/ם",
            "l": "6680",
            "s": "6680",
            "m": "HVpp3ms/Sp3mp",
            "g": 40,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-38-2",
        "ref": "Gen 38:2",
        "gateLesson": 40,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַ/יַּרְא",
            "l": "c/7200",
            "s": "7200",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 30
          },
          {
            "t": "שָׁ֧ם",
            "l": "8033",
            "s": "8033",
            "m": "HD",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "יְהוּדָ֛ה",
            "l": "3063",
            "s": "3063",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "בַּת",
            "l": "1323",
            "s": "1323",
            "m": "HNcfsc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "אִ֥ישׁ",
            "l": "376",
            "s": "376",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": 6
          },
          {
            "t": "כְּנַעֲנִ֖י",
            "l": "3669 a",
            "s": "3669",
            "m": "HNgmsa",
            "g": 7,
            "pn": false,
            "v": null
          },
          {
            "t": "וּ/שְׁמ֣/וֹ",
            "l": "c/8034",
            "s": "8034",
            "m": "HC/Ncmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 6
          },
          {
            "t": "שׁ֑וּעַ",
            "l": "7770",
            "s": "7770",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וַ/יִּקָּחֶ֖/הָ",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqw3ms/Sp3fs",
            "g": 40,
            "pn": false,
            "v": 16
          },
          {
            "t": "וַ/יָּבֹ֥א",
            "l": "c/935",
            "s": "935",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 26
          },
          {
            "t": "אֵלֶֽי/הָ",
            "l": "413",
            "s": "413",
            "m": "HR/Sp3fs",
            "g": 22,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-44-6",
        "ref": "Gen 44:6",
        "gateLesson": 40,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַֽ/יַּשִּׂגֵ֑/ם",
            "l": "c/5381",
            "s": "5381",
            "m": "HC/Vhw3ms/Sp3mp",
            "g": 40,
            "pn": false,
            "v": null
          },
          {
            "t": "וַ/יְדַבֵּ֣ר",
            "l": "c/1696",
            "s": "1696",
            "m": "HC/Vpw3ms",
            "g": 35,
            "pn": false,
            "v": 15
          },
          {
            "t": "אֲלֵ/הֶ֔ם",
            "l": "413",
            "s": "413",
            "m": "HR/Sp3mp",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "הַ/דְּבָרִ֖ים",
            "l": "d/1697",
            "s": "1697",
            "m": "HTd/Ncmpa",
            "g": 10,
            "pn": false,
            "v": 5
          },
          {
            "t": "הָ/אֵֽלֶּה",
            "l": "d/428",
            "s": "428",
            "m": "HTd/Pdxcp",
            "g": 33,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-7-5",
        "ref": "Gen 7:5",
        "gateLesson": 40,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַ/יַּ֖עַשׂ",
            "l": "c/6213 a",
            "s": "6213",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 15
          },
          {
            "t": "נֹ֑חַ",
            "l": "5146",
            "s": "5146",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "כְּ/כֹ֥ל",
            "l": "k/3605",
            "s": "3605",
            "m": "HR/Ncmsa",
            "g": 13,
            "pn": false,
            "v": 11
          },
          {
            "t": "אֲשֶׁר",
            "l": "834 a",
            "s": "834",
            "m": "HTr",
            "g": 30,
            "pn": false,
            "v": null
          },
          {
            "t": "צִוָּ֖/הוּ",
            "l": "6680",
            "s": "6680",
            "m": "HVpp3ms/Sp3ms",
            "g": 40,
            "pn": false,
            "v": null
          },
          {
            "t": "יְהוָֽה",
            "l": "3068",
            "s": "3068",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-1-3",
        "ref": "Gen 1:3",
        "gateLesson": 39,
        "tier": "guided",
        "tokens": [
          {
            "t": "וַ/יֹּ֥אמֶר",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null
          },
          {
            "t": "אֱלֹהִ֖ים",
            "l": "430",
            "s": "430",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 3
          },
          {
            "t": "יְהִ֣י",
            "l": "1961",
            "s": "1961",
            "m": "HVqj3ms",
            "g": 39,
            "pn": false,
            "v": 6
          },
          {
            "t": "א֑וֹר",
            "l": "216",
            "s": "216",
            "m": "HNcbsa",
            "g": 7,
            "pn": false,
            "v": 24
          },
          {
            "t": "וַֽ/יְהִי",
            "l": "c/1961",
            "s": "1961",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 6
          },
          {
            "t": "אֽוֹר",
            "l": "216",
            "s": "216",
            "m": "HNcbsa",
            "g": 7,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-50-6",
        "ref": "Gen 50:6",
        "gateLesson": 40,
        "tier": "guided",
        "tokens": [
          {
            "t": "וַ/יֹּ֖אמֶר",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null
          },
          {
            "t": "פַּרְעֹ֑ה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "עֲלֵ֛ה",
            "l": "5927",
            "s": "5927",
            "m": "HVqv2ms",
            "g": 39,
            "pn": false,
            "v": 14
          },
          {
            "t": "וּ/קְבֹ֥ר",
            "l": "c/6912",
            "s": "6912",
            "m": "HC/Vqv2ms",
            "g": 39,
            "pn": false,
            "v": 49
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "אָבִ֖י/ךָ",
            "l": "1",
            "s": "1",
            "m": "HNcmsc/Sp2ms",
            "g": 22,
            "pn": false,
            "v": 7
          },
          {
            "t": "כַּ/אֲשֶׁ֥ר",
            "l": "k/834 d",
            "s": "834",
            "m": "HR/Tr",
            "g": 30,
            "pn": false,
            "v": null
          },
          {
            "t": "הִשְׁבִּיעֶֽ/ךָ",
            "l": "7650",
            "s": "7650",
            "m": "HVhp3ms/Sp2ms",
            "g": 40,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-32-14",
        "ref": "Gen 32:14",
        "gateLesson": 42,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַ/יָּ֥לֶן",
            "l": "c/3885 a",
            "s": "3885",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null
          },
          {
            "t": "שָׁ֖ם",
            "l": "8033",
            "s": "8033",
            "m": "HD",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "בַּ/לַּ֣יְלָה",
            "l": "b/3915",
            "s": "3915",
            "m": "HRd/Ncmsa",
            "g": 13,
            "pn": false,
            "v": 24
          },
          {
            "t": "הַ/ה֑וּא",
            "l": "d/1931",
            "s": "1931",
            "m": "HTd/Pp3ms",
            "g": 8,
            "pn": false,
            "v": null
          },
          {
            "t": "וַ/יִּקַּ֞ח",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 16
          },
          {
            "t": "מִן",
            "l": "4480 a",
            "s": "4480",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "הַ/בָּ֧א",
            "l": "d/935",
            "s": "935",
            "m": "HTd/Vqrmsa",
            "g": 42,
            "pn": false,
            "v": 26
          },
          {
            "t": "בְ/יָד֛/וֹ",
            "l": "b/3027",
            "s": "3027",
            "m": "HR/Ncbsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 10
          },
          {
            "t": "מִנְחָ֖ה",
            "l": "4503",
            "s": "4503",
            "m": "HNcfsa",
            "g": 7,
            "pn": false,
            "v": 36
          },
          {
            "t": "לְ/עֵשָׂ֥ו",
            "l": "l/6215",
            "s": "6215",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "אָחִֽי/ו",
            "l": "251",
            "s": "251",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 10
          }
        ]
      },
      {
        "id": "reader-gen-14-12",
        "ref": "Gen 14:12",
        "gateLesson": 42,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַ/יִּקְח֨וּ",
            "l": "c/3947",
            "s": "3947",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": 16
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "ל֧וֹט",
            "l": "3876",
            "s": "3876",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/אֶת",
            "l": "c/853",
            "s": "853",
            "m": "HC/To",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "רְכֻשׁ֛/וֹ",
            "l": "7399",
            "s": "7399",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "בֶּן",
            "l": "1121 a",
            "s": "1121",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "אֲחִ֥י",
            "l": "251",
            "s": "251",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 10
          },
          {
            "t": "אַבְרָ֖ם",
            "l": "87",
            "s": "87",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וַ/יֵּלֵ֑כוּ",
            "l": "c/3212",
            "s": "3212",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": 16
          },
          {
            "t": "וְ/ה֥וּא",
            "l": "c/1931",
            "s": "1931",
            "m": "HC/Pp3ms",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "יֹשֵׁ֖ב",
            "l": "3427",
            "s": "3427",
            "m": "HVqrmsa",
            "g": 42,
            "pn": false,
            "v": 16
          },
          {
            "t": "בִּ/סְדֹֽם",
            "l": "b/5467",
            "s": "5467",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-32-19",
        "ref": "Gen 32:19",
        "gateLesson": 42,
        "tier": "strict",
        "tokens": [
          {
            "t": "וְ/אָֽמַרְתָּ֙",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqq2ms",
            "g": 16,
            "pn": false,
            "v": null
          },
          {
            "t": "לְ/עַבְדְּ/ךָ֣",
            "l": "l/5650",
            "s": "5650",
            "m": "HR/Ncmsc/Sp2ms",
            "g": 22,
            "pn": false,
            "v": 11
          },
          {
            "t": "לְ/יַעֲקֹ֔ב",
            "l": "l/3290",
            "s": "3290",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "מִנְחָ֥ה",
            "l": "4503",
            "s": "4503",
            "m": "HNcfsa",
            "g": 7,
            "pn": false,
            "v": 36
          },
          {
            "t": "הִוא֙",
            "l": "1931",
            "s": "1931",
            "m": "HPp3fs",
            "g": 5,
            "pn": false,
            "v": null
          },
          {
            "t": "שְׁלוּחָ֔ה",
            "l": "7971",
            "s": "7971",
            "m": "HVqsfsa",
            "g": 42,
            "pn": false,
            "v": 15
          },
          {
            "t": "לַֽ/אדֹנִ֖/י",
            "l": "l/113",
            "s": "113",
            "m": "HR/Ncmsc/Sp1cs",
            "g": 22,
            "pn": false,
            "v": 3
          },
          {
            "t": "לְ/עֵשָׂ֑ו",
            "l": "l/6215",
            "s": "6215",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "וְ/הִנֵּ֥ה",
            "l": "c/2009",
            "s": "2009",
            "m": "HC/Tm",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "גַם",
            "l": "1571",
            "s": "1571",
            "m": "HD",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "ה֖וּא",
            "l": "1931",
            "s": "1931",
            "m": "HPp3ms",
            "g": 5,
            "pn": false,
            "v": null
          },
          {
            "t": "אַחֲרֵֽי/נוּ",
            "l": "310 a",
            "s": "310",
            "m": "HR/Sp1cp",
            "g": 22,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-41-28",
        "ref": "Gen 41:28",
        "gateLesson": 42,
        "tier": "strict",
        "tokens": [
          {
            "t": "ה֣וּא",
            "l": "1931",
            "s": "1931",
            "m": "HPp3ms",
            "g": 5,
            "pn": false,
            "v": null
          },
          {
            "t": "הַ/דָּבָ֔ר",
            "l": "d/1697",
            "s": "1697",
            "m": "HTd/Ncmsa",
            "g": 8,
            "pn": false,
            "v": 5
          },
          {
            "t": "אֲשֶׁ֥ר",
            "l": "834 a",
            "s": "834",
            "m": "HTr",
            "g": 30,
            "pn": false,
            "v": null
          },
          {
            "t": "דִּבַּ֖רְתִּי",
            "l": "1696",
            "s": "1696",
            "m": "HVpp1cs",
            "g": 29,
            "pn": false,
            "v": 15
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "פַּרְעֹ֑ה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "אֲשֶׁ֧ר",
            "l": "834 a",
            "s": "834",
            "m": "HTr",
            "g": 30,
            "pn": false,
            "v": null
          },
          {
            "t": "הָ/אֱלֹהִ֛ים",
            "l": "d/430",
            "s": "430",
            "m": "HTd/Ncmpa",
            "g": 10,
            "pn": false,
            "v": 3
          },
          {
            "t": "עֹשֶׂ֖ה",
            "l": "6213 a",
            "s": "6213",
            "m": "HVqrmsa",
            "g": 42,
            "pn": false,
            "v": 15
          },
          {
            "t": "הֶרְאָ֥ה",
            "l": "7200",
            "s": "7200",
            "m": "HVhp3ms",
            "g": 29,
            "pn": false,
            "v": null
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "פַּרְעֹֽה",
            "l": "6547",
            "s": "6547",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-37-19",
        "ref": "Gen 37:19",
        "gateLesson": 42,
        "tier": "guided",
        "tokens": [
          {
            "t": "וַ/יֹּאמְר֖וּ",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": null
          },
          {
            "t": "אִ֣ישׁ",
            "l": "376",
            "s": "376",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": 6
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "אָחִ֑י/ו",
            "l": "251",
            "s": "251",
            "m": "HNcmsc/Sp3ms",
            "g": 22,
            "pn": false,
            "v": 10
          },
          {
            "t": "הִנֵּ֗ה",
            "l": "2009",
            "s": "2009",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "בַּ֛עַל",
            "l": "1167",
            "s": "1167",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": null
          },
          {
            "t": "הַ/חֲלֹמ֥וֹת",
            "l": "d/2472",
            "s": "2472",
            "m": "HTd/Ncmpa",
            "g": 10,
            "pn": false,
            "v": null
          },
          {
            "t": "הַלָּזֶ֖ה",
            "l": "1976",
            "s": "1976",
            "m": "HPdxms",
            "g": 33,
            "pn": false,
            "v": null
          },
          {
            "t": "בָּֽא",
            "l": "935",
            "s": "935",
            "m": "HVqrmsa",
            "g": 42,
            "pn": false,
            "v": 26
          }
        ]
      },
      {
        "id": "reader-gen-34-31",
        "ref": "Gen 34:31",
        "gateLesson": 42,
        "tier": "guided",
        "tokens": [
          {
            "t": "וַ/יֹּאמְר֑וּ",
            "l": "c/559",
            "s": "559",
            "m": "HC/Vqw3mp",
            "g": 35,
            "pn": false,
            "v": null
          },
          {
            "t": "הַ/כְ/זוֹנָ֕ה",
            "l": "d/k/2181",
            "s": "2181",
            "m": "HTi/R/Vqrfsa",
            "g": 42,
            "pn": false,
            "v": null
          },
          {
            "t": "יַעֲשֶׂ֖ה",
            "l": "6213 a",
            "s": "6213",
            "m": "HVqi3ms",
            "g": 23,
            "pn": false,
            "v": 15
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "אֲחוֹתֵֽ/נוּ",
            "l": "269",
            "s": "269",
            "m": "HNcfsc/Sp1cp",
            "g": 22,
            "pn": false,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-19-36",
        "ref": "Gen 19:36",
        "gateLesson": 45,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַֽ/תַּהֲרֶ֛יןָ",
            "l": "c/2029",
            "s": "2029",
            "m": "HC/Vqw3fp",
            "g": 35,
            "pn": false,
            "v": null
          },
          {
            "t": "שְׁתֵּ֥י",
            "l": "8147",
            "s": "8147",
            "m": "HAcfdc",
            "g": 45,
            "pn": false,
            "v": 31
          },
          {
            "t": "בְנֽוֹת",
            "l": "1323",
            "s": "1323",
            "m": "HNcfpc",
            "g": 20,
            "pn": false,
            "v": 7
          },
          {
            "t": "ל֖וֹט",
            "l": "3876",
            "s": "3876",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "מֵ/אֲבִי/הֶֽן",
            "l": "m/1",
            "s": "1",
            "m": "HR/Ncmsc/Sp3fp",
            "g": 22,
            "pn": false,
            "v": 7
          }
        ]
      },
      {
        "id": "reader-gen-21-31",
        "ref": "Gen 21:31",
        "gateLesson": 45,
        "tier": "strict",
        "tokens": [
          {
            "t": "עַל",
            "l": "5921 a",
            "s": "5921",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "כֵּ֗ן",
            "l": "3651 c",
            "s": "3651",
            "m": "HTm",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "קָרָ֛א",
            "l": "7121",
            "s": "7121",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 16
          },
          {
            "t": "לַ/מָּק֥וֹם",
            "l": "l/4725",
            "s": "4725",
            "m": "HRd/Ncmsa",
            "g": 13,
            "pn": false,
            "v": 12
          },
          {
            "t": "הַ/ה֖וּא",
            "l": "d/1931",
            "s": "1931",
            "m": "HTd/Pp3ms",
            "g": 8,
            "pn": false,
            "v": null
          },
          {
            "t": "בְּאֵ֣ר",
            "l": "884+",
            "s": "884",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "שָׁ֑בַע",
            "l": "884",
            "s": "884",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "כִּ֛י",
            "l": "3588 a",
            "s": "3588",
            "m": "HC",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "שָׁ֥ם",
            "l": "8033",
            "s": "8033",
            "m": "HD",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "נִשְׁבְּע֖וּ",
            "l": "7650",
            "s": "7650",
            "m": "HVNp3cp",
            "g": 37,
            "pn": false,
            "v": null
          },
          {
            "t": "שְׁנֵי/הֶֽם",
            "l": "8147",
            "s": "8147",
            "m": "HAcmdc/Sp3mp",
            "g": 45,
            "pn": false,
            "v": 31
          }
        ]
      },
      {
        "id": "reader-gen-7-9",
        "ref": "Gen 7:9",
        "gateLesson": 45,
        "tier": "strict",
        "tokens": [
          {
            "t": "שְׁנַ֨יִם",
            "l": "8147",
            "s": "8147",
            "m": "HAcmda",
            "g": 45,
            "pn": false,
            "v": 31
          },
          {
            "t": "שְׁנַ֜יִם",
            "l": "8147",
            "s": "8147",
            "m": "HAcmda",
            "g": 45,
            "pn": false,
            "v": 31
          },
          {
            "t": "בָּ֧אוּ",
            "l": "935",
            "s": "935",
            "m": "HVqp3cp",
            "g": 19,
            "pn": false,
            "v": 26
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "נֹ֛חַ",
            "l": "5146",
            "s": "5146",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "הַ/תֵּבָ֖ה",
            "l": "d/8392",
            "s": "8392",
            "m": "HTd/Ncfsa",
            "g": 8,
            "pn": false,
            "v": null
          },
          {
            "t": "זָכָ֣ר",
            "l": "2145",
            "s": "2145",
            "m": "HAamsa",
            "g": 32,
            "pn": false,
            "v": 7
          },
          {
            "t": "וּ/נְקֵבָ֑ה",
            "l": "c/5347",
            "s": "5347",
            "m": "HC/Ncfsa",
            "g": 13,
            "pn": false,
            "v": 7
          },
          {
            "t": "כַּֽ/אֲשֶׁ֛ר",
            "l": "k/834 d",
            "s": "834",
            "m": "HR/Tr",
            "g": 30,
            "pn": false,
            "v": null
          },
          {
            "t": "צִוָּ֥ה",
            "l": "6680",
            "s": "6680",
            "m": "HVpp3ms",
            "g": 29,
            "pn": false,
            "v": 35
          },
          {
            "t": "אֱלֹהִ֖ים",
            "l": "430",
            "s": "430",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 3
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "נֹֽחַ",
            "l": "5146",
            "s": "5146",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-31-33",
        "ref": "Gen 31:33",
        "gateLesson": 45,
        "tier": "strict",
        "tokens": [
          {
            "t": "וַ/יָּבֹ֨א",
            "l": "c/935",
            "s": "935",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 26
          },
          {
            "t": "לָבָ֜ן",
            "l": "3837 a",
            "s": "3837",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "בְּ/אֹ֥הֶל",
            "l": "b/168",
            "s": "168",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 20
          },
          {
            "t": "יַעֲקֹ֣ב",
            "l": "3290",
            "s": "3290",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וּ/בְ/אֹ֣הֶל",
            "l": "c/b/168",
            "s": "168",
            "m": "HC/R/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 20
          },
          {
            "t": "לֵאָ֗ה",
            "l": "3812",
            "s": "3812",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וּ/בְ/אֹ֛הֶל",
            "l": "c/b/168",
            "s": "168",
            "m": "HC/R/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 20
          },
          {
            "t": "שְׁתֵּ֥י",
            "l": "8147",
            "s": "8147",
            "m": "HAcfdc",
            "g": 45,
            "pn": false,
            "v": 31
          },
          {
            "t": "הָ/אֲמָהֹ֖ת",
            "l": "d/519",
            "s": "519",
            "m": "HTd/Ncfpa",
            "g": 10,
            "pn": false,
            "v": null
          },
          {
            "t": "וְ/לֹ֣א",
            "l": "c/3808",
            "s": "3808",
            "m": "HC/Tn",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "מָצָ֑א",
            "l": "4672",
            "s": "4672",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": 22
          },
          {
            "t": "וַ/יֵּצֵא֙",
            "l": "c/3318",
            "s": "3318",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 22
          },
          {
            "t": "מֵ/אֹ֣הֶל",
            "l": "m/168",
            "s": "168",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 20
          },
          {
            "t": "לֵאָ֔ה",
            "l": "3812",
            "s": "3812",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "וַ/יָּבֹ֖א",
            "l": "c/935",
            "s": "935",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": 26
          },
          {
            "t": "בְּ/אֹ֥הֶל",
            "l": "b/168",
            "s": "168",
            "m": "HR/Ncmsc",
            "g": 20,
            "pn": false,
            "v": 20
          },
          {
            "t": "רָחֵֽל",
            "l": "7354",
            "s": "7354",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-22-23",
        "ref": "Gen 22:23",
        "gateLesson": 45,
        "tier": "guided",
        "tokens": [
          {
            "t": "וּ/בְתוּאֵ֖ל",
            "l": "c/1328 a",
            "s": "1328",
            "m": "HC/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "יָלַ֣ד",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3ms",
            "g": 16,
            "pn": false,
            "v": null
          },
          {
            "t": "אֶת",
            "l": "853",
            "s": "853",
            "m": "HTo",
            "g": 1,
            "pn": false,
            "v": null
          },
          {
            "t": "רִבְקָ֑ה",
            "l": "7259",
            "s": "7259",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "שְׁמֹנָ֥ה",
            "l": "8083",
            "s": "8083",
            "m": "HAcmsa",
            "g": 45,
            "pn": false,
            "v": null
          },
          {
            "t": "אֵ֨לֶּה֙",
            "l": "428",
            "s": "428",
            "m": "HPdxcp",
            "g": 33,
            "pn": false,
            "v": null
          },
          {
            "t": "יָלְדָ֣ה",
            "l": "3205",
            "s": "3205",
            "m": "HVqp3fs",
            "g": 16,
            "pn": false,
            "v": null
          },
          {
            "t": "מִלְכָּ֔ה",
            "l": "4435",
            "s": "4435",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          },
          {
            "t": "לְ/נָח֖וֹר",
            "l": "l/5152",
            "s": "5152",
            "m": "HR/Np",
            "g": 13,
            "pn": true,
            "v": null
          },
          {
            "t": "אֲחִ֥י",
            "l": "251",
            "s": "251",
            "m": "HNcmsc",
            "g": 20,
            "pn": false,
            "v": 10
          },
          {
            "t": "אַבְרָהָֽם",
            "l": "85",
            "s": "85",
            "m": "HNp",
            "g": 5,
            "pn": true,
            "v": null
          }
        ]
      },
      {
        "id": "reader-gen-42-17",
        "ref": "Gen 42:17",
        "gateLesson": 45,
        "tier": "guided",
        "tokens": [
          {
            "t": "וַ/יֶּאֱסֹ֥ף",
            "l": "c/622",
            "s": "622",
            "m": "HC/Vqw3ms",
            "g": 35,
            "pn": false,
            "v": null
          },
          {
            "t": "אֹתָ֛/ם",
            "l": "853",
            "s": "853",
            "m": "HTo/Sp3mp",
            "g": 22,
            "pn": false,
            "v": null
          },
          {
            "t": "אֶל",
            "l": "413",
            "s": "413",
            "m": "HR",
            "g": 13,
            "pn": false,
            "v": null
          },
          {
            "t": "מִשְׁמָ֖ר",
            "l": "4929",
            "s": "4929",
            "m": "HNcmsa",
            "g": 7,
            "pn": false,
            "v": null
          },
          {
            "t": "שְׁלֹ֥שֶׁת",
            "l": "7969",
            "s": "7969",
            "m": "HAcmsc",
            "g": 45,
            "pn": false,
            "v": null
          },
          {
            "t": "יָמִֽים",
            "l": "3117",
            "s": "3117",
            "m": "HNcmpa",
            "g": 10,
            "pn": false,
            "v": 21
          }
        ]
      }
    ]
  };
})();
