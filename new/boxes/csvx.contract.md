# חוזה · קופסת-חיבורים "csvx" (lib-csvx)

**תפקיד:** קופסת עזרי-ה-CSV המשותפים — ייצוא (בריחת-תא + הגנת-הזרקה + BOM),
הורדת-קובץ מגודרת-שער, פענוח-קידוד, פענוח-CSV אמיתי, וקליטת-תאריכים מאקסל.
מקור-האמת: `maor/src/lib/csvx.ts`. כל ההלחמות של המקור (csvEscape·toCsv·
downloadCsv·decodeCsvBuffer·readCsvFileText·parseCsv·parseAnyDate + השכן
guardExport מ-exportGate) — מחווטות כאן במקום אחד, מאטומים בלבד (חוק-2/3).

## חשיפה (חתימות-המקור, ממשק lib/csvx.ts אחד-לאחד — L4)
- `csvEscape(x)` ⇒ תא-CSV מוגן (מקור: csvx.ts:12-19). תו-נוסחה מוביל (`= + - @`
  טאב/CR) ⇒ גרש-מוביל; פסיק/גרש/שורה ⇒ ציטוט עם הכפלת-גרשיים.
- `toCsv(rows)` ⇒ מחרוזת CSV+BOM (מקור: csvx.ts:22-24). **החיווט:** `escape`
  שוקע ל-csvEscape (השכן-המיוצא של המקור, csvx.ts:23) — הקופסה מלחימה.
- `downloadCsv(filename, rows, io)` ⇒ הורדת-קובץ, אחרי שער-יציאה (מקור:
  csvx.ts:27-34). ⚠️ לא-טהור: שקעי-DOM/מודול מוזרקים ב-`io` (ר' למטה).
- `decodeCsvBuffer(buf)` ⇒ טקסט (מקור: csvx.ts:43-58). ‏BOM של UTF-16
  (FF FE / FE FF) ⇒ UTF-16LE/BE; בלי-BOM אך NUL-כבד (>1/5 מ-400 בייט) ⇒
  UTF-16LE; אחרת UTF-8, ואם יש תו-החלפה (�) ⇒ ניסיון windows-1255.
- `readCsvFileText(file)` ⇒ Promise<טקסט> (מקור: csvx.ts:64-66). **החיווט:**
  `decodeCsvBuffer` שוקע (csvx.ts:65) — הקופסה מלחימה.
- `parseCsv(text)` ⇒ `string[][]` (מקור: csvx.ts:72-114). שדות-מצוטטים,
  גרשיים-כפולים, פסיק/שורה בתוך-שדה, CRLF; שורה-ראשונה עם יותר טאבים
  מפסיקים ⇒ מפריד TSV; שורות ריקות-לגמרי מדולגות.
- `parseAnyDate(v)` ⇒ ISO ‏(YYYY-MM-DD) או `''` (מקור: csvx.ts:121-159).
  ISO כמו-שהוא (עם אימות-קיום); D/M/Y (מפרידי `. / -`, שנה דו-ספרתית בציר
  דינמי); מספר-סידורי-אקסל בן 5 ספרות (בסיס 30/12/1899).

## הכרעות-הקופסה (חיווט-הצבה, verbatim מ-maor/src/lib/csvx.ts)
- `CSV_MIME = 'text/csv;charset=utf-8'` — סוג-ה-Blob בהורדה (csvx.ts:30).
- `REVOKE_MS = 5000` — חלון-שחרור ה-object-URL אחרי ה-click (csvx.ts:33).
- ‏`toCsv` מחווט `escape=csvEscape`; ‏`readCsvFileText` מחווט `decodeCsvBuffer`.
- ‏Blob = סטנדרט-שפה (גלובלי) — לא שקע (כמו lib-ics).

## שקע-IO של downloadCsv (io) — מוזרק, לא ממומש (חוק-1/6)
- `blocked` ⇒ boolean — יציאת-מידע חסומה (App→setExportBlocked; csvx.ts:28).
- `notify` ⇒ `(()=>void)|null` — התרעת-סירוב; מורצת רק כשחסום.
- `createElement` ⇒ `(tag)=>el` (document.createElement).
- `createObjectURL` ⇒ `(blob)=>url` (URL.createObjectURL).
- `revokeObjectURL` ⇒ `(url)=>void` (URL.revokeObjectURL).
- `setTimeout` ⇒ `(fn,ms)=>void` (window.setTimeout).

## דוגמאות מחייבות (מהמקור — הבדיקה מוכיחה בדיוק אותן)
1. `csvEscape('=HACK')` ⇒ `"'=HACK"` (גרש-מוביל, בלי ציטוט) ·
   `csvEscape('עם,פסיק')` ⇒ `'"עם,פסיק"'` · `csvEscape('a"b')` ⇒ `'"a""b"'` ·
   `csvEscape(null)` ⇒ `''`.
2. `toCsv([['א','ב'],['=x','2']])` ⇒ `"﻿א,ב\n'=x,2"` (BOM + escape מחווט) ·
   `toCsv([])` ⇒ `"﻿"`.
3. `parseCsv('a,b\r\n"c,d",e\n')` ⇒ `[['a','b'],['c,d','e']]` ·
   `parseCsv('x\ty\nz\tw')` ⇒ `[['x','y'],['z','w']]` (TSV-אוטו) ·
   `parseCsv('\n\n')` ⇒ `[]` (שורות-ריקות מדולגות).
4. `parseAnyDate('2015-06-31')` ⇒ `''` (יוני בן 30) ·
   `parseAnyDate('31/12/2024')` ⇒ `'2024-12-31'` · `parseAnyDate('5.3.2024')` ⇒
   `'2024-03-05'` · `parseAnyDate('44927')` ⇒ `'2023-01-01'` (סידורי-אקסל) ·
   `parseAnyDate('')` ⇒ `''`.
5. `decodeCsvBuffer` על בייטי BOM ‏FF FE + `'hi'`-UTF16LE ⇒ `'hi'` ·
   `readCsvFileText({arrayBuffer:async()=>buf})` ⇒ אותו טקסט (decode מחווט).
6. `downloadCsv('f.csv', rows, io)` — כש-`blocked:true` ⇒ `notify` מורץ ואפס
   נגיעת-DOM; כשמותר ⇒ Blob בסוג CSV_MIME עם תוכן `toCsv(rows)`, `a.download`
   מקבל את השם, `click` נקרא, ו-`setTimeout(revoke, 5000)`.

## DoD (נכתב לפני הקוד — דיבר 12)
- `node new/boxes/csvx.test.mjs` ⇒ exit 0, שורת ✓ אחת (כולל מגן-הכרעה).
- `node /home/user/maor-system/machtzev/parity/csvx.parity.mjs` ⇒ exit 0,
  שורת 🥇 עם מונה-השוואות; אפס-סטייה ישן≡חדש על קורפוס-LCG seed=20260824
  (csvEscape·toCsv·parseCsv·parseAnyDate·decodeCsvBuffer·readCsvFileText;
  downloadCsv=גבול-IO, לא ברתמה — כמו names-export).
- `node machtzev/police.mjs --fast` ⇒ ירוק.
