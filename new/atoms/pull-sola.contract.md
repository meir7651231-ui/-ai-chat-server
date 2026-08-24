# חוזה · חוט pull-sola
**תפקיד:** משיכה-בקליק מסולה (21.8, חיווט-כמו-נדרים) — קריאת POST ל-Function
‏`solaPull` עם **טוקן-הכניסה** (Authorization: Bearer, בלי סוד בדפדפן);
ה-xKey יושב בכספת-הענן והפונקציה קוראת אותו בעצמה. ‏org: שורש ⇒ 'root',
אחרת ה-slug. **ייחוד מול נדרים:** בלי `full`; לקוח-השורש עם slug אמיתי
(≠'default') מוסיף ‏`vault=<slug>` — האוספים ב-root אבל הכספת (orgSecrets)
נכתבת תחת ה-slug, ו-vault מגשר כדי שהפונקציה תמצא את ה-xKey. זורק בכשל.
**שקעים (חוק-1 — קריאות-החוץ ומצב-המודול הוזרקו כפרמטרים):**
- ‏auth — אימות-הענן (במקור: ‏requireAuth()); נדרש ‏auth.currentUser עם
  ‏getIdToken() ⇒ ‏Promise<string>.
- ‏scope — תחום-הארגון: ‏{ cloudRoot: boolean, slug: string } (במקור: מצב-מודול).
- ‏doFetch(url, init) ⇒ ‏Promise<Response-דמוי {ok, status, json()}> — חתימת-fetch.
  ברירת-מחדל: ‏fetch הגלובלי (סטנדרט-שפה — מותר). בבדיקות זיוף, אפס רשת.
**קלט:** ‏pullUrl (https בלבד; נגזם) · ‏opts ({reset?:boolean}) · השקעים.
**פלט:** ‏Promise<{added?, scanned?, window?, debug?}>.
**דוגמאות מחייבות** (בכולן זיוף-רשת שמתעד את הבקשה):
1. ‏pullUrl='http://x.example/pull' ⇒ זריקה: 'כתובת-משיכה לא-תקינה (חייבת https)'
   — לפני כל קריאת-חוץ; ‏currentUser=null ⇒ 'נדרשת התחברות-ענן' בלי fetch.
2. צורת-הבקשה: ‏scope={cloudRoot:false, slug:'demo'}, טוקן 'tok-9' ⇒ ‏POST עם
   ‏org=demo, **בלי** ‏full ובלי ‏vault, כותרת ‏Authorization='Bearer tok-9'.
3. גשר-הכספת: ‏scope={cloudRoot:true, slug:'maor'} ⇒ ‏org=root **וגם** ‏vault=maor.
4. שורש בלי slug אמיתי: ‏scope={cloudRoot:true, slug:'default'} ⇒ ‏org=root,
   **בלי** ‏vault (וכך גם slug ריק).
5. ‏opts.reset=true ⇒ נוסף ‏reset=1.
6. תשובה תקינה ‏{ok:true, added:4, scanned:120, window:'30d'} ⇒ מוחזרת כלשונה.
7. כשל: ‏status=500 + json() דוחה ⇒ זריקה: 'משיכה נכשלה (500)'; ‏{ok:false,
   error:'xKey חסר'} ⇒ זריקה: 'xKey חסר'.
**מוצא:** maor/src/lib/cloud.ts:706-725 (‏pullSola). ‏requireAuth ⇒ שקע auth,
מצב-המודול scope ⇒ שקע, ‏fetch ⇒ שקע doFetch (חוק-1).
