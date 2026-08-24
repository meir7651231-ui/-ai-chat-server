# חוזה · חוט encrypt-existing-cloud
**תפקיד:** מיגרציית-הצפנה חד-פעמית של ענן קיים: כתיבה-מחדש של **כל**
הנתונים (ישויות + meta) מוצפנים, דרך נתיב-ה-push הקיים והבדוק — ה-DB
המלא כ-diff, עם ה-DEK, ועם מפת-skey (אכיפת-נתונים: אם דלוקה, גם המיגרציה
שומרת skey על אוספים-נאכפים). פעולת-בעלים (כפתור, אחרי גיבוי) — לא אוטומטית.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏fullDbDiff(db) ⇒ diff — ה-DB המלא כ-diff (במקור: שכן ב-cloud-diff.ts).
- ‏supKeyMapOf(supporters) ⇒ מפת-skey (במקור: שכן באותו קובץ).
- ‏pushDiff(diff, dek, keyMap) ⇒ ‏Promise<void> — הדחיפה לחוט (הצפנת כל
  set ל-{enc,iv} קורית בתוכו). האטום ממתין (await) לסיומו.
**קלט:** db (עם ‏supporters) · dek ‏(CryptoKey) · השקעים pushDiff·fullDbDiff·supKeyMapOf.
**פלט:** ‏Promise<void>.
**דוגמאות מחייבות:**
1. ‏fullDbDiff נקרא בדיוק פעם-אחת עם ‏db עצמו (אותה רפרנס); ‏supKeyMapOf
   נקרא בדיוק פעם-אחת עם ‏db.supporters (אותה רפרנס).
2. ‏pushDiff נקרא בדיוק פעם-אחת עם ‏(תוצאת-fullDbDiff, dek, תוצאת-supKeyMapOf) —
   שלושתן באותה רפרנס.
3. ההבטחה נפתרת רק אחרי ש-pushDiff סיים (await אמיתי — דגל שנדלק בתוך
   ‏pushDiff אסינכרוני נראה דלוק אחרי שהאטום חזר).
4. ‏pushDiff שנדחה ‏(כשל-רשת) ⇒ ההבטחה של האטום נדחית (הזריקה לא נבלעת).
**מוצא:** maor/src/lib/cloud.ts:481-489 (‏encryptExistingCloud — "מיגרציית-
הצפנה חד-פעמית… דרך נתיב ה-push הקיים והבדוק"). שלושת השכנים הפכו לשקעים.
