# חוזה · חוט deliver-receipt
**תפקיד:** מברז מסירת-קבלה לפי בחירת-הלקוח (‏db.ui.receiptFmt, הכרעת-בעלים 9.8
"שיציג בתור כפתור מה הלקוח בוחר"): ‏fmt==='pdf' (השוואה קפדנית) ⇒ שקע-ההדפסה
(חלון-הדפסה ⇒ שמירה כ-PDF); **כל ערך אחר** — 'txt', ‏undefined, חסר — ⇒
שקע-ההורדה (קובץ-הטקסט ההיסטורי, ביט-זהה להיום). החוט לא נוגע ב-DOM ולא
בודק דגלים — גידור ‏core.receipt.pdf הוא אחריות ‏receiptFmtOf שבחיווט.
**שקעים (חוק-1 — קריאות-שכן הוזרקו כפרמטרים; במקור מאותו receipt.ts):**
- ‏printReceipt(o) — הדפסה דרך iframe נסתר (תופעת-לוואי; הערך המוחזר נזרק).
- ‏downloadReceipt(o) — הורדת קובץ-טקסט (תופעת-לוואי; הערך המוחזר נזרק).
**קלט:** ‏o (ReceiptInfo — מועבר כמות-שהוא, לא נבחן) · ‏fmt ('txt'|'pdf'|
undefined) · שני השקעים. **פלט:** ‏undefined (פעולה בלבד).
**דוגמאות מחייבות** (שקעים מזויפים סופרי-קריאות; ‏o={rid:'R-7',ils:180}):
1. ‏fmt='pdf' ⇒ ‏printReceipt נקרא בדיוק פעם אחת עם בדיוק o (זהות-הפניה);
   ‏downloadReceipt — 0 קריאות.
2. ‏fmt='txt' ⇒ ‏downloadReceipt פעם אחת עם o; ‏printReceipt — 0.
3. ‏fmt=undefined (חסר) ⇒ ‏downloadReceipt פעם אחת עם o — ברירת-המחדל
   ההיסטורית.
4. השוואה קפדנית: ‏fmt='PDF' (רישיות שונה) ⇒ ‏downloadReceipt, לא הדפסה.
5. הערך המוחזר בכל המסלולים הוא ‏undefined.
**מוצא:** maor/src/lib/receipt.ts:225-233 (‏deliverReceipt — בורר 📄/🖨,
‏5.5d). השכנים printReceipt/downloadReceipt הפכו לשקעים (חוק-1).
