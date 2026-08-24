# חוזה · חוט revert-patch
**תפקיד:** בניית patch לחזרת תיק-"מעקב-טיפול" (ayin) לשלב קודם — תמיד ‏{stage};
כשחוזרים אל לפני שלב-המסירה ('answer') מתווסף ‏answerPushed:false (ביטול דגל
הדחיפה). חזרה ל-'answer' עצמו או ל-'done' לא נוגעת בדגל.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏stageIndex(stage) ⇒ מספר — מיקום השלב בסדר-השלבים הקבוע
  ‏['new','lead','eyes','answer','done'] (0..4; לא-מוכר ⇒ 0). השכן מאותו
  ‏lib/ayin. האטום קורא לו פעמיים (לשלב הנתון ול-'answer').
**קלט:** ‏stage — מחרוזת-שלב · השקע stageIndex. **פלט:** אובייקט-patch.
**דוגמאות מחייבות (עם stageIndex אמיתי לפי הסדר לעיל):**
1. ‏revertPatch('new') ⇒ ‏{stage:'new', answerPushed:false}.
2. ‏revertPatch('lead') ⇒ ‏{stage:'lead', answerPushed:false}.
3. ‏revertPatch('eyes') ⇒ ‏{stage:'eyes', answerPushed:false}.
4. ‏revertPatch('answer') ⇒ ‏{stage:'answer'} — בלי מפתח answerPushed כלל.
5. ‏revertPatch('done') ⇒ ‏{stage:'done'} — בלי מפתח answerPushed כלל.
**מוצא:** maor/src/lib/ayin.ts:62-68 (‏revertPatch; "חזרה לפני שלב המסירה
מבטלת את דגל הדחיפה"). ‏stageIndex (שם: 50-54, מעל AYIN_STAGES) הוזרק כשקע (חוק-1).
