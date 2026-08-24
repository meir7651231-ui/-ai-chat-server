# חוזה · חוט reset-password
**תפקיד:** שליחת מייל איפוס-סיסמה — עוטף את קריאת-הענן במיפוי-שגיאות לעברית.
אסינכרוני; כל מגע-הענן עובר דרך השקעים — האטום עצמו הוא הסדר + מיפוי-השגיאות בלבד.
**שקעים (חוק-1 — קריאות-Firebase הוזרקו כפרמטרים; חיווטן האמיתי בקופסה):**
- ‏requireAuth() ⇒ אובייקט-Auth מאותחל; זורק ‏Error בעברית כשהענן לא אותחל
  (השכן מ-cloud.ts:262).
- ‏sendReset(auth, email) ⇒ Promise — שליחת המייל (במקור:
  ‏sendPasswordResetEmail של Firebase). כישלון ⇒ דחייה עם ‏{code:'auth/...'}.
- ‏hebrewAuthError(e) ⇒ ‏Error בעברית לקוד לא-ממופה (השכן מ-cloud.ts — חוט נפרד).
**קלט:** email · 3 השקעים. **פלט:** ‏Promise<void>; כישלון ⇒ זריקת ‏Error בעברית.
**דוגמאות מחייבות:**
1. הצלחה: ‏sendReset נקרא בדיוק פעם-אחת עם ‏(תוצאת-requireAuth, 'a@b.com');
   ההבטחה נפתרת (undefined).
2. ‏sendReset נדחה עם ‏code='auth/user-not-found' ⇒ זריקה:
   'לא נמצא משתמש עם האימייל הזה'.
3. ‏sendReset נדחה עם ‏code='auth/invalid-email' ⇒ זריקה:
   'כתובת האימייל אינה תקינה'.
4. ‏sendReset נדחה עם קוד אחר (למשל 'auth/too-many-requests') ⇒ נזרק בדיוק מה
   ש-hebrewAuthError(e) החזיר (השקע קיבל את השגיאה המקורית).
5. ‏sendReset נדחה בלי code כלל ‏(new Error('boom')) ⇒ ‏code נגזר '' ⇒ תוצאת
   ‏hebrewAuthError (לא נפילה על undefined).
6. ‏requireAuth זורק (הענן לא אותחל) — הזריקה בתוך ה-try ⇒ נתפסת וממופה דרך
   ‏hebrewAuthError; ‏sendReset לא נקרא כלל.
**מוצא:** maor/src/lib/cloud.ts:347-356 (‏resetPassword). חולץ כלשונו; קריאות
Firebase-Auth ומיפוי-השגיאות-הכללי הוזרקו כשקעים. זהות/סודות אינם באטום
(חוק-6) — האימייל עובר כפרמטר בלבד.
