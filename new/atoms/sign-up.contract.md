# חוזה · חוט sign-up
**תפקיד:** הרשמה עצמית לפלטפורמה (CLOUD2 ענן 3) — קורא
‏createUserWithEmailAndPassword(requireAuth(), email, password); הצלחה ⇒
שולח מייל-אימות **best-effort** (‏sendEmailVerification(cred.user) — דחייה
נבלעת, לא מפילה את ההרשמה; נחיל-אבטחה 17.8) ומחזיר את ‏cred.user.uid.
כשל ⇒ 4 קודי-SDK ידועים ממופים ל-Error עברי ספציפי; כל קוד אחר עובר
דרך שקע-התרגום ‏hebrewAuthError ונזרק.
**שקעים (חוק-1 — קריאות-שכן הוזרקו כפרמטרים):**
- ‏createUserWithEmailAndPassword(auth, email, password) ⇒ ‏Promise<{user}>
  — ה-SDK (Firebase Auth בקוד-המקור).
- ‏requireAuth() ⇒ auth — מופע-ה-Auth; זורק כשהענן לא אותחל.
- ‏sendEmailVerification(user) ⇒ Promise — שליחת מייל-האימות.
- ‏hebrewAuthError(e) ⇒ Error — תרגום קוד-שגיאה לא-ממופה לעברית.
**קלט:** ‏email · password (מחרוזות) + 4 השקעים. **פלט:** ‏Promise<string> — ה-uid.
**דוגמאות מחייבות:**
1. הצלחה: השקע נפתר ל-‏{user:{uid:'u1'}} ⇒ מוחזר 'u1', ו-‏sendEmailVerification
   נקרא **פעם אחת** עם אותו ‏user בדיוק.
2. מייל-אימות נכשל: ‏sendEmailVerification דוחה ⇒ עדיין מוחזר 'u1' — כשל-רך.
3. דחייה ‏{code:'auth/email-already-in-use'} ⇒ נזרק
   ‏Error('האימייל כבר רשום — נסו להתחבר או לאפס סיסמה').
4. ‏{code:'auth/weak-password'} ⇒ 'הסיסמה חלשה מדי — לפחות 6 תווים';
   ‏{code:'auth/invalid-email'} ⇒ 'כתובת האימייל אינה תקינה';
   ‏{code:'auth/operation-not-allowed'} ⇒ 'ההרשמה סגורה כרגע — פנו למנהל המערכת'.
5. קוד לא-ממופה ‏{code:'auth/whatever'} ⇒ נזרק **בדיוק** ה-Error של
   ‏hebrewAuthError, ואובייקט-הדחייה עבר אליו כמות-שהוא.
6. ענן לא אותחל: ‏requireAuth זורק (בלי ‏code) ⇒ המסלול מגיע ל-hebrewAuthError;
   שקע-היצירה לא נקרא כלל.
**מוצא:** maor/src/lib/cloud.ts:318-337 (‏signUp — "המשתמש מחובר אך לא רואה
כלום עד שהבעלים מאשר (שער החברות). שגיאות בעברית.").
