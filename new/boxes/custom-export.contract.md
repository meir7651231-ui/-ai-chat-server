# חוזה · קופסת-חיבורים "דו"ח מותאם" (custom-export)
**תפקיד:** הקופסה של מסך "דו"ח מותאם" — יעד (חוגים/אירועים/תומכות) + טווח-תאריכים
+ שדות-נבחרים ⇒ שורות CSV (כותרת+נתונים). מקור-האמת: `maor/src/lib/customExport.ts`.
כל ההלחמות של המקור (config·ayin·hebrew·eventMeta·courses/lib·supporters/lib) —
מחווטות כאן במקום אחד, מאטומים בלבד.

## חשיפה (חתימות-המקור)
- `expFieldDefs(cfg, target)` ⇒ `[{key,label}]` — הגדרות-השדות ליעד
  (מקור: customExport.ts:36-121). ‏`reports.custom.full` חסר=פעיל ⇒ הרשימות
  המלאות (חוגים 14 · תומכות 10+7-עין); ‏false ⇒ המקוצרות (חוגים 7 · תומכות 4+4-עין).
  שדות-העין נכללים רק כש-`supporters.ayin` דלוק (customExport.ts:79,87,109).
- `overrideColumn(rows, colIdx, overrides)` ⇒ שורות עם עמודה דרוסה — כותרת
  (שורה 0) חסינה, אי-מוטציה, `colIdx<0` ⇒ כניסה-כיציאה (customExport.ts:127-135).
- `buildCustomExport(cfg, db, target, range, selectedKeys)` ⇒ `Cell[][]`
  (customExport.ts:159-322). ‏selectedKeys קובע גם סדר (לפי סדר-ה-defs, מסונן).
  אירועים עבריים-חוזרים (אזכרה/נישואין/הולדת) מורחבים על הטווח כשהוא חסום
  משני-הצדדים; תקרת CAP_DAYS=4000 (customExport.ts:252-254); חסם-תחתון
  `>= ev.date` נגד שורות-רפאים (customExport.ts:259).

## הכרעות-הקופסה (חיווט, לא אטום)
- `NAV_MODULE_KEYS` — תשעת מודולי-הניווט הניתנים-לכיבוי, verbatim
  ‏maor/src/lib/config.ts:20-30: families·courses·calendar·diary·supporters·
  reports·tzedaka·shop·shop7 (שקע-featureOn).
- `HEBREW_RECURRING` — ‏Set{memorial,anniversary,bday}, verbatim
  ‏maor/src/types/domain.ts:363-367.
- `scanHebYear` — סריקת-שנה-עברית (רצף-חודשים + has30) עם מטמון, verbatim
  ‏maor/src/lib/hebrew.ts:60-77 על אטום-hebParts (עוגנים: `hebYear - 3761`,
  ‏440 ימים). זהו חיווט-שכן של hebAnnualEq — לא אטום.
- `nowMs` — שקע-IO מוזרק אופציונלי (ברירת-מחדל: `Date.now()` בתוך אטום-supScore,
  כמו במקור supporters/lib.ts:151-171) — דרך `buildCustomExport(..., nowMs)`
  ארגומנט שישי אופציונלי; חסר ⇒ ביט-זהה למקור.

## דוגמאות מחייבות (מהמקור)
1. `expFieldDefs(cfg,'courses')` בקונפיג-ריק ⇒ 14 שדות, הראשון
   `{key:'name', label:'שם החוג'}` (termOf נופל ל'חוג' ⇒ 'שם החוג');
   עם `features:{'reports.custom.full':false}` ⇒ 7 שדות.
2. `expFieldDefs(cfg,'supporters')` בלי עין (`supporters.ayin:false`) ⇒ בלי
   stage/names/eyesTotal/paid/answers/next; עם עין (חסר=פעיל) ⇒ 17 שדות.
3. אזכרה שעוגנה ב-2024-03-24 (י"ד אדר-ב תשפ"ד) בטווח 2025-03-01..2025-03-31
   ⇒ שורה אחת ב-14/03/2025 (י"ד אדר תשפ"ה — דין-אדר); טווח שכולו לפני
   ‏ev.date ⇒ אפס שורות (חסם-רפאים).
4. תומכת בלי תרומות/תשובות/מגע בטווח — מדולגת (customExport.ts:291);
   ‏dons = `2 תרומות · ₪300 + $50`-סגנון; donsAll כולל hist (הכרעת-בעלים 9.8).
5. `overrideColumn(rows,1,{1:'X'})` — שורה 0 לא נדרסת; שורה 1 עמודה 1 = 'X';
   המערך-המקורי לא מוטציה.

## DoD (נכתב לפני הקוד — דיבר 12)
- `node new/boxes/custom-export.test.mjs` ⇒ exit 0, שורת ✓ אחת.
- `node /home/user/maor-system/machtzev/parity/custom-export.parity.mjs` ⇒ exit 0,
  שורת 🥇 עם מונה-השוואות; אפס-סטייה ישן≡חדש (deepStrictEqual) על קורפוס-LCG
  ‏seed=20260824, תאריכים קבועים ≤2025-06 (יציבות-סל-הטריות של supScore).
- `node machtzev/police.mjs --fast` ⇒ ירוק.
