# חוזה · חוט receipt-fmt-of
**תפקיד:** הפורמט האפקטיבי למסירת-קבלה (הכרעת-בעלים 9.8 ‏5.5d — "שיציג בתור
כפתור מה הלקוח בוחר"): הבחירה השמורה של הארגון (‏ui.receiptFmt: ‏'txt'/'pdf')
**רק כשדגל-הפיצ׳ר ‏core.receipt.pdf דלוק** — כיבוי הדגל מחזיר את הארגון
לקובץ-טקסט גם אם נבחר PDF (מתג-חירום). ‏undefined = "אין בחירה אפקטיבית"
(הקורא ‏deliverReceipt נופל ל-txt — ביט-זהה להיסטורי).
**שקעים (חוק-1 — קריאת-השכן הוזרקה כפרמטר):**
- ‏featureOn(config, key) ⇒ ‏boolean — מנוע-הדגלים (במקור: ‏lib/config;
  חוזה-הדגלים: מפתח חסר = פעיל, רק false מכבה — החוכמה הזו אצל השקע).
**קלט:** ‏config · ‏ui (עם ‏receiptFmt אופציונלי) · ‏featureOn.
**פלט:** ‏'txt' | 'pdf' | undefined.
**דוגמאות מחייבות:**
1. עדות-שאילתה: ‏featureOn מזויף רושם-קריאות ⇒ נקרא בדיוק פעם אחת עם
   ‏(config עצמו, ‏'core.receipt.pdf').
2. דגל דלוק (‏featureOn⇒true) + ‏ui={receiptFmt:'pdf'} ⇒ ‏'pdf'.
3. דגל דלוק + ‏ui={receiptFmt:'txt'} ⇒ ‏'txt'.
4. דגל דלוק + ‏ui={} (אין בחירה שמורה) ⇒ ‏undefined.
5. מתג-חירום: דגל כבוי (‏featureOn⇒false) + ‏ui={receiptFmt:'pdf'} ⇒
   ‏undefined — הבחירה השמורה לא נמחקת, רק לא-אפקטיבית.
**מוצא:** maor/src/lib/receipt.ts:234-237 (‏receiptFmtOf). חולץ כלשונו; השכן
‏featureOn הפך לשקע (חוק-1).
