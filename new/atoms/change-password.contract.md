# חוזה · חוט change-password
**תפקיד:** שינוי-סיסמה למשתמש מחובר — אימות-מחדש עם הסיסמה הנוכחית (דרישת
Firebase ל-recent-login) ואז החלפה. שגיאות בעברית; הסשן נשאר מחובר. אסינכרוני;
כל מגע-הענן עובר דרך השקעים — האטום עצמו הוא הסדר + מיפוי-השגיאות בלבד.
**שקעים (חוק-1 — קריאות-Firebase הוזרקו כפרמטרים; חיווטן האמיתי בקופסה):**
- ‏getUser() ⇒ המשתמש המחובר או null (במקור: ‏requireAuth().currentUser).
- ‏reauth(u, currentPass) ⇒ Promise — אימות-מחדש (במקור:
  ‏reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, currentPass))).
  כישלון ⇒ דחייה עם ‏{code:'auth/...'}.
- ‏update(u, nextPass) ⇒ Promise — החלפת-הסיסמה (במקור: ‏updatePassword).
- ‏hebrewAuthError(e) ⇒ ‏Error בעברית לקוד לא-ממופה (השכן מ-cloud.ts — חוט נפרד).
**קלט:** currentPass · nextPass · 4 השקעים. **פלט:** ‏Promise<void>; כישלון ⇒ זריקת ‏Error בעברית.
**דוגמאות מחייבות:**
1. ‏getUser() ⇒ null ⇒ זריקה: 'אין משתמש מחובר — התחברו ונסו שוב';
   ‏reauth/update לא נקראו כלל.
2. משתמש בלי email ‏({email:''}) ⇒ אותה זריקה כמו 1.
3. ‏reauth נדחה עם ‏code='auth/wrong-password' ⇒ זריקה: 'הסיסמה הנוכחית שגויה'
   (אותו דין ל-'auth/invalid-credential' ו-'auth/invalid-login-credentials'); ‏update לא נקרא.
4. ‏reauth נדחה עם קוד אחר (למשל 'auth/too-many-requests') ⇒ נזרק בדיוק מה
   ש-hebrewAuthError(e) החזיר (השקע קיבל את השגיאה המקורית).
5. ‏update נדחה עם ‏code='auth/weak-password' ⇒ זריקה:
   'הסיסמה החדשה חלשה מדי — לפחות 6 תווים'.
6. ‏update נדחה עם קוד אחר (למשל 'auth/network-request-failed') ⇒ תוצאת
   ‏hebrewAuthError(e).
7. הצלחה: ‏reauth נקרא עם ‏(u,'old1') ואז ‏update עם ‏(u,'new123'), בסדר הזה;
   ההבטחה נפתרת (undefined).
**מוצא:** maor/src/lib/cloud.ts:362-383 (‏changePassword). חולץ כלשונו; קריאות
Firebase-Auth ומיפוי-השגיאות-הכללי (hebrewAuthError) הוזרקו כשקעים. זהות/סודות
אינם באטום (חוק-6) — הסיסמאות עוברות כפרמטרים בלבד.
