# חוזה · חוט pull-nedarim
**תפקיד:** משיכת-נדרים **בקליק** (ייעול 20.8) — קריאת POST ל-Function
‏`nedarimPull` עם **טוקן-הכניסה** של המשתמש (Authorization: Bearer) במקום
סוד-בדפדפן; השרת מאמת מייל-על/מנהל. מושך תורמים+עסקאות (`full=1` תמיד).
‏org נגזר מהתחום: שורש (cloudRoot) ⇒ 'root', אחרת ה-slug. זורק בכשל
(כתובת/התחברות/רשת/שרת) — הודעות בעברית.
**שקעים (חוק-1 — קריאות-החוץ ומצב-המודול הוזרקו כפרמטרים):**
- ‏auth — אימות-הענן (במקור: ‏requireAuth()); נדרש ‏auth.currentUser עם
  ‏getIdToken() ⇒ ‏Promise<string>.
- ‏scope — תחום-הארגון: ‏{ cloudRoot: boolean, slug: string } (במקור: מצב-מודול).
- ‏doFetch(url, init) ⇒ ‏Promise<Response-דמוי {ok, status, json()}> — חתימת-fetch.
  ברירת-מחדל: ‏fetch הגלובלי (סטנדרט-שפה — מותר). בבדיקות זיוף, אפס רשת.
**קלט:** ‏pullUrl (כתובת-הפונקציה מהקונפיג, https בלבד; נגזם) ·
‏opts ({reset?:boolean}) · השקעים. **פלט:** ‏Promise<{donors?,added?,pages?}>.
**דוגמאות מחייבות** (בכולן זיוף-רשת שמתעד את הבקשה):
1. ‏pullUrl='http://x.example/pull' (לא-https) ⇒ זריקה:
   'כתובת-משיכה לא-תקינה (חייבת https)' — לפני כל קריאת-חוץ.
2. ‏auth.currentUser=null ⇒ זריקה: 'נדרשת התחברות-ענן' — בלי fetch.
3. צורת-הבקשה: ‏pullUrl='  https://f.example/nedarimPull  ' (נגזם), טוקן 'tok-1',
   ‏scope={cloudRoot:false, slug:'demo'} ⇒ ‏POST לכתובת עם ‏org=demo & ‏full=1
   (בלי reset), כותרת ‏Authorization='Bearer tok-1'.
4. שורש: ‏scope={cloudRoot:true, slug:'demo'} ⇒ ‏org=root (ה-slug לא משומש).
5. ‏opts.reset=true ⇒ נוסף ‏reset=1 לשאילתה.
6. תשובה תקינה ‏{ok:true, donors:5, added:3, pages:2} ⇒ מוחזרת כלשונה.
7. כשל: ‏status=403 + גוף שאינו JSON (json() דוחה ⇒ ‏{}) ⇒ זריקה:
   'משיכה נכשלה (403)'; ואילו ‏{ok:false, error:'אין הרשאה'} (גם ב-status 200)
   ⇒ זריקה: 'אין הרשאה' (הודעת-השרת גוברת).
**מוצא:** maor/src/lib/cloud.ts:687-705 (‏pullNedarim). ‏requireAuth ⇒ שקע auth,
מצב-המודול scope ⇒ שקע, ‏fetch ⇒ שקע doFetch (חוק-1).
