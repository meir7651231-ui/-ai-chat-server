# 📐 TRUTH — מקור-האמת-האחד (מחולל · נגזר-מהבייטים · אל תערוך ידנית)
> כל מספר כאן נמדד ע"י `node machtzev/truth.mjs` מהקוד עצמו. **אסור לצטט מספר-ענף שלא מכאן.**
> `--gate` נכשל אם הקובץ הזה סטה מהמדידה החיה. ריענון: `node machtzev/truth.mjs --write`.

## 3 השכבות של §21 (תצוגה · לוגיקה · דאטה)
- **🔢 סה"כ אטומים מאונדקסים (תצוגה+לוגיקה):** 1881
- **🏁 זהב-מורכב-מחדש (GENMAX·G4 · render-module compose):** 9/9 מודולים · 87/87 בדיקות
- **🔎 פלטי-מחולל שרונדרו-בפועל (GENMAX·G5b · gen-verify):** 246/283 מסכים רונדרו-בפועל · 64 אטומי-תצוגה על המסך
- **🔌 מחווטים-למחולל בפועל:** 108 (5.7%) · 1773 מפורקים-אך-לא-מחווטים
- **  ↳ מול כשירים-לחיווט (eligible):** 108/1849 (5.8%) · כשירים: תצוגה 892 (תפר≠zero ∧ לא-מזייף) + לוגיקה 957 (חתימה נקראת; wireable-כשדה-מחושב 115)
- **  ↳ נגישים-לבוררים-הנוכחיים (reach · auto-skin ∪ auto-logic ∪ cover(ops-map) ∪ קופסאות):** 1849/1849 (100.0%) · תצוגה 892 · לוגיקה 957
- **  ↳ ממופים-לפעולת-יסוד (G1 ops-map · תצוגה+לוגיקה, כולל לא-באורקל):** 1889/1889
- **  ↳ לא-כשירים-במכוון (§20-ג · אין-שקע-דאטה/מזייף — נספרים, לא נעלמים):** 32 תצוגה: AuroraBg · BarcodeReticle · Dot · DotGridBg · DotsLoader · ForgedChat · ForgedComposite · ForgedFeedback · ForgedHeader · ForgedInput · ForgedList · ForgedMotion · ForgedNav · ForgedSelection · ForgedSpatial · ForgedStatus · ForgedTemporal · ForgedText · GlowBg · Grip · LipskeyProductSheetDivider · LiveDot · MeshBg · OrbitSpinner · SelectionBand · SheetHandle · SkeletonBlock · SkeletonCard · StatusDot · ThumbPlaceholder · Typing · WaveBg
- **  ↳ כשירים-שאף-בורר-לא-רואה (הפער האמיתי):** 0 — אין
- **  ↳ חיווט-תצוגה (נבחרו: DS-selectVaried ∪ auto-skin):** 68/924 (7.4%)
- **  ↳ חיווט-לוגיקה (נבחרו: MAP_ENGINES ∪ auto-logic):** 40/957 (4.2%)
- **תצוגה · atom-index (widgets · הכרעה C):** 924
- **  ↳ seam:** {"fields":498,"collection":213,"series":188,"zero":25}
- **  ↳ נגישים-בהרכבה (selectVaried×400):** 45
- **  ↳ פר-היבט:** {"kpi":16,"board":1,"nav":21,"tbl":1,"trend":2,"prog":2,"card":2}
- **לוגיקה · logic-census:** 957
- **  ↳ wireable:** 115
- **  ↳ מחוברים-למחולל (MAP_ENGINES):** 10
- **דאטה · new/dart-data-maor:** 548
- **מקור-JS · new/atoms:** 1160
- **המרה · new/dart-maor:** 667

## מבנה הענף
- **machtzev/ שורש (.mjs):** 57
- **machtzev/ תת-תיקיות:** 14
- **generator/ קנוני:** 52
- **generator/legacy/:** 5
- **knowledge/ פעיל:** 112
- **knowledge/archive/:** 12
- **שערי-משטרה (gates.tsv):** 54
- **שערי-משטרה (police gate()):** 54

## אזהרת-אמת (הלקח שנקנה ביוקר)
"סידור-הענף" = פריסת-קבצים. "כמה/מה-מחובר" = **מדידה חוצת-3-שכבות**. אל תסיק תקרה משכבה-אחת.
המחולל מחובר: נבחרו-בפועל תצוגה=68 · לוגיקה=40 · נגישים-לבוררים 1849/1849 · ממופים-לפעולה 1889/1889. "נבחר" ≠ "נגיש": בורר בוחר אחד לתפקיד (L91) — מה שלא נבחר עדיין נגיש למשפט הבא.
