# חוזה · חוט lock-key
**תפקיד:** מפתח ה-localStorage של נעילת-ה-PIN בתחום הנוכחי. הבסיס קבוע: `'maor_lock'`.
**שקע:** nsLsKey (ממרחב-השמות מוזרק — חוט לא יודע איזה ארגון מוצב; במקור import מ-persist).
**קלט:** פונקציית-שקע `nsLsKey(base)⇒string`. **פלט:** מחרוזת-מפתח.
**דוגמאות מחייבות:** ‏nsLsKey=זהות (default, בלי slug) → `"maor_lock"` ·
‏nsLsKey=(b)⇒`${b}:demo` → `"maor_lock:demo"` · ‏nsLsKey=(b)⇒`${b}:or-rishon` → `"maor_lock:or-rishon"` ·
הבסיס המועבר לשקע הוא **תמיד** `'maor_lock'` בדיוק.
**מוצא:** maor/src/lib/lock.ts:40-43 (הכרעת בעלים 5.3: default ⇒ ביט-זהה `'maor_lock'`;
ארגון-פלטפורמה ⇒ `'maor_lock:{slug}'`). התוספת היחידה: שיקוע-nsLsKey.
