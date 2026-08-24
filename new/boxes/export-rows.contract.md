# חוזה · קופסת-חיבורים "שורות-הייצוא" (lib-exportRows)
**מקור-האמת (L4):** ‏maor/src/lib/exportRows.ts — שלושת יצרני-השורות ל-CSV:
- ‏familiesImportFormatRows — ‏exportRows.ts:33-44 (13 עמודות פורמט-הייבוא)
- ‏supportersImportFormatRows — ‏exportRows.ts:47-53 (7 עמודות SupporterImport)
- ‏eventsCsvRows — ‏exportRows.ts:56-76 (9 עמודות, ממוין לפי תאריך; עוזרי-הקובץ
  ‏PRIORITY_LABEL ‏15-19 + ‏fmtD ‏21-25 שוכנו בתוך חוט-האירועים)
שקעי-המקור של האירועים: ‏termOf (config.ts:119-126) · hebDateFull (hebrew.ts:156-161,
על gem/gemYear/hebParts) · EV_META (eventMeta.ts:7-16).

**חיווט הקופסה (ההכרעות חיות כאן, לא בחוטים):**
1. שרשרת-התאריך-העברי: ‏hebDateFull מולחם ל-gem + gemYear(·,gem) + hebParts —
   סדר-השקעים ‎(iso, gem, gemYear, hebParts)‎ כבמקור hebrew.ts:160.
2. מילון-התוויות של סוגי-האירועים = האטום EV_META (מקור-אמת-יחיד, eventMeta.ts).
3. המונח 'משפחה' עובר termOf('entity.family') רק כשיש config — כבמקור (שורה 57).
4. שני יצרני פורמט-הייבוא מוגשים כמות-שהם (חוטים ללא-שקעים).

**חשיפה:**
- ‏familiesImportFormatRows(db) ⇒ Cell[][]
- ‏supportersImportFormatRows(db) ⇒ Cell[][]
- ‏eventsCsvRows(db, config?) ⇒ Cell[][] — ‏config אופציונלי כבמקור.
ההורדה עצמה (toCsv/downloadCsv — DOM) אינה בקופסה — זה שער-הייצוא/לוח-האם.

**דוגמאות מחייבות (מספריות, מקריאת-הקוד):**
- משפחות: כותרת = ‎['שם','ת"ז אב','טלפון','שם האם','ת"ז אם','טלפון 2','עיר','כתובת','','אלמן','קהילה','','הערות']‎;
  ‏maritalStatus='אלמן' ⇒ עמודה 10 = 'אלמן' (includes, שורה 40); ⚠️ 'אלמנה' ⇒ ''
  — ‏includes('אלמן') עם נו״ן-סופית אינו תופס 'אלמנ…' (התנהגות-המקור, נשמרת כלשונה).
- תומכות: כותרת = ‎['שם','טלפון','אימייל','ת"ז','כתובת','קטגוריה','עבור']‎.
- אירועים: ‏date='2026-08-24' ⇒ עברי 'י״א אלול תשפ״ו', לועזי '24/08/2026';
  ‏date='' ⇒ עברי '' ולועזי '' (fmtD על ריק, שורה 22);
  ‏priority='red' ⇒ 'דחוף (אדום)'; ‏priority לא-מוכר 'x' ⇒ 'x' (שורה 70);
  ‏type='call' בלי customType ⇒ 'טלפון'; ‏customType='ברית' ⇒ 'ברית' (שורה 65);
  ‏done=true ⇒ 'כן', אחרת 'לא'; ‏famId שלא נמצא ⇒ '' (שורה 69);
  מיון עולה לפי date עם localeCompare, ריק ראשון (שורה 61);
  ‏config עם terms['entity.family']='בית אב' ⇒ כותרת עמודה 6 'בית אב';
  בלי config ⇒ 'משפחה'.

**DoD (נכתב לפני הקוד — דיבר 12):**
- `node new/boxes/export-rows.test.mjs` ⇒ exit 0 + '✓'
- `node /home/user/maor-system/machtzev/parity/export-rows.parity.mjs` ⇒ exit 0
  ‏+ '🥇 … ישן≡חדש על N השוואות' (טרנספילציה-חיה של המקור, LCG seed=20260824, אפס-סטייה)
