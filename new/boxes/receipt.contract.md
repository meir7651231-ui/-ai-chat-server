# חוזה · קופסת-חיבורים "receipt"
**מקור-האמת (L4):** `maor/src/lib/receipt.ts` — כל טענה מעוגנת `receipt.ts:שורה`.
**תפקיד:** מסירת-קבלה שלמה — התוכן הטהור (שורות/HTML/קוד-אימות/פורמט) + נתיבי-המסירה
הלא-טהורים (הורדת-טקסט/הדפסת-PDF). כל מה שהיה מולחם ב-lib/receipt.ts מחווט כאן:
7 חוטי-קבלה + השכנים (heb-date-full, amount-in-words, feature-on, guard-export)
מיובאים כאטומים ומחווטים בקופסה; קופסה לא מייבאת קופסה (LAW.md).

## חשיפה
- `receiptVerifyCode(rid, amount, currency, date)` ⇒ `'XXX-XXX'` (FNV-1a; receipt.ts:75-84).
- `receiptLines(o)` ⇒ `string[]` — §46 / רגילה / אישור-חנות `S-` (receipt.ts:86-148). השכנים
  hebDateFull/amountInWords/receiptVerifyCode/hebrewLocaleDate מחווטים בפנים (לא פרמטרים).
- `receiptHtml(o)` ⇒ מחרוזת-HTML מוכנת-להדפסה, `receiptLines` מקור-האמת היחיד לתוכן (receipt.ts:175-194).
- `receiptFmtOf(config, ui)` ⇒ `'txt'|'pdf'|undefined` — הבחירה השמורה `ui.receiptFmt` רק
  כשדגל `core.receipt.pdf` דלוק; כבוי ⇒ `undefined` (receipt.ts:234-236).
- `downloadReceipt(o, io)` — שער-הרשאה ⇒ קובץ-טקסט (BOM + שורות ריקות מסוננות + join '\n',
  שם `receipt-${rid}.txt`, revoke אחרי 5000ms) (receipt.ts:150-161).
- `printReceipt(o, io)` — שער-הרשאה ⇒ iframe-נסתר עם `receiptHtml`, focus+print, remove אחרי 60000ms (receipt.ts:201-219).
- `deliverReceipt(o, fmt, io)` — `'pdf'` ⇒ printReceipt, אחרת ⇒ downloadReceipt (receipt.ts:225-228).

## שקעי-IO (מוזרקים, לא מימוש — הקופסה טהורה בייבוא)
`io` = { `document`, `Blob`, `URL`, `setTimeout`, `exportBlocked?`, `exportNotify?` }.
ה-DOM/הדפדפן זורמים דרך io בזמן-ריצה; `exportBlocked/exportNotify` = מצב שער-היציאה
(exportGate.ts state) שנקבע בלוח-האם. שער חסום (`exportBlocked` אמת) ⇒ `exportNotify?.()` ו-return בלי מסירה (guard-export atom; receipt.ts:151,202).

## הכרעות-קופסה (חיווט, לא אטום)
- `hebrewLocaleDate` — עוזר-פנימי לא-מיוצא במקור (receipt.ts:59-62): `T12:00:00`⇒he-IL; שבור⇒ISO.
- `NAV_MODULE_KEYS` = 9 מודולי-הניווט (config.ts:20-30) — שקע-מילון של feature-on.
- קבועי-המסירה: `BOM='﻿'` · `receipt-${rid}.txt` · revoke 5000 · frame 60000.

## דוגמאות מחייבות (שקעי-הבדיקה קבועים)
1. **§46 מלאה** (verify+כל-השדות): `receiptLines` ⇒ אורך 23 · `[0]='מקור'` ·
   `[4]='קבלה על תרומה — לפי סעיף 46 לפקודת מס הכנסה'` · `[11]` מתחיל `'סכום: ₪'` +
   `toLocaleString` (1234⇒'1,234') · `[12]='במילים: '` + amountInWords.
2. **רגילה עם סיכום-עסקה** copy=true: `[0]='העתק נאמן למקור'` · `[1]='קבלה — מאור החסד'`
   (orgName ריק⇒ברירת-מחדל) · שורת `'סה"כ עסקה: ₪1000 · שולם עד כה: ₪400 · יתרה: ₪600'` ·
   שורה אחרונה `'תודה על תמיכתכם'`.
3. **אישור-חנות S-** mark=false: `[0]='אישור תשלום — מאור החסד'` (בלי שורת-'מקור') ·
   `[1]='אישור מס׳: S-0003'`.
4. **תאריך-שבור** (hebDateFull⇒''): שורת-התאריך `'תאריך: שטויות'` (בלי עברי/he-IL).
5. **receiptVerifyCode** דטרמיניסטי: אותו קלט ⇒ אותו `'XXX-XXX'` (3+3, מקף אמצעי).
6. **receiptHtml**: מכיל `<!doctype html>`, `dir="rtl"`, ושורת-`<div class="mark">` = השורה
   הראשונה של receiptLines; שם-תורם עם `<` בורח ל-`&lt;` (esc).
7. **receiptFmtOf**: דגל דלוק+`ui.receiptFmt='pdf'` ⇒ `'pdf'`; דגל כבוי (`features['core.receipt.pdf']===false`) ⇒ `undefined`.
8. **downloadReceipt** io מזויף: `a.download==='receipt-D-1.txt'`, התוכן מתחיל `'﻿'`; שער-חסום ⇒ אפס createElement.
9. **deliverReceipt** 'pdf' ⇒ קורא printReceipt (iframe), 'txt'/חסר ⇒ downloadReceipt (anchor).
