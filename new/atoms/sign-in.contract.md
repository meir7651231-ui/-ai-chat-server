# חוזה · חוט sign-in
**תפקיד:** כניסה באימייל+סיסמה — קורא ‏signInWithEmailAndPassword(requireAuth(),
email, password) וממתין; הצלחה ⇒ resolve בלי ערך. **כל** כשל — דחיית-הכניסה
או זריקת requireAuth (ענן לא אותחל) — נתפס, מתורגם דרך ‏hebrewAuthError(e)
ונזרק כ-Error עברי. אין ערך-חוזר.
**שקעים (חוק-1 — קריאות-שכן הוזרקו כפרמטרים):**
- ‏signInWithEmailAndPassword(auth, email, password) ⇒ Promise — ה-SDK
  (Firebase Auth בקוד-המקור).
- ‏requireAuth() ⇒ auth — מופע-ה-Auth המאותחל; זורק Error עברי כשהענן לא
  אותחל (בקוד-המקור: 'הענן לא אותחל — פנו למנהל המערכת').
- ‏hebrewAuthError(e) ⇒ Error — ממפה קוד-שגיאת-SDK להודעה עברית.
**קלט:** ‏email · password (מחרוזות) + 3 השקעים. **פלט:** ‏Promise<void>.
**דוגמאות מחייבות:**
1. הצלחה: שקע-הכניסה resolve ⇒ ‏signIn נפתר ל-undefined, והשקע נקרא
   **פעם אחת** עם ‏(תוצאת-requireAuth, 'a@b.com', 'secret1') — בסדר הזה.
2. כשל-כניסה: השקע דוחה ‏{code:'auth/wrong-password'} ⇒ נזרק **בדיוק**
   ה-Error ש-‏hebrewAuthError החזיר עבור אותו אובייקט (הדחייה עוברת אליו כמות-שהיא).
3. ענן לא אותחל: ‏requireAuth זורק ‏Error('הענן לא אותחל') ⇒ הזריקה נתפסת
   ועוברת גם היא דרך ‏hebrewAuthError — שקע-הכניסה לא נקרא כלל.
4. אין בליעה: לעולם לא נפתר בשקט על כשל — כל מסלול-כשל מסתיים בזריקה.
**מוצא:** maor/src/lib/cloud.ts:306-317 (‏signIn — "כניסה באימייל+סיסמה —
זורק Error עם הודעה בעברית. אין הרשמה עצמית.").
