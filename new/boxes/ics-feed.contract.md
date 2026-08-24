# חוזה · קופסת-חיבורים "פיד-יומן חי" (ics-feed)
**תפקיד:** מנוי-יומן חי (הרחבת gcal, 9.8) — במקום קובץ-ICS חד-פעמי, המערכת
מפרסמת כתובת-מנוי שגוגל/אאוטלוק מושכים ממנה עדכונים. הקופסה מחווטת את 4 חוטי
‏maor/src/lib/icsFeed.ts לחיווט גלוי אחד; publishIcsFeed קרא במקור לשלושת
השכנים (readIcsFeedToken · mintFeedToken · setDoc) — כאן הקריאה-לשכן היא חיווט-קופסה
מפורש, לא import-פנימי (חוק-2/3).

**חשיפה (ממשק lib/icsFeed.ts אחד-לאחד — L4):**
- `mintFeedToken()` ⇒ string — token אקראי 32-hex (crypto; icsFeed.ts:17-21).
- `icsFeedUrl(projectId, slug, token)` ⇒ string — כתובת-המנוי הציבורית (icsFeed.ts:44-46).
- `readIcsFeedToken(slug, cloud)` ⇒ Promise<string|null> — ה-token הקיים של הפיד (icsFeed.ts:24-28).
- `publishIcsFeed(slug, ics, opts?, cloud)` ⇒ Promise<string> — פרסום/רענון (icsFeed.ts:34-41).

**שקעי-IO (לוח-האם — לא ממומשים בקופסה):** `cloud` = אובייקט-Firestore מוזרק:
- `cloud.db` — ידית מסד-הענן (במקור `cloudDb()`).
- `cloud.doc(db, col, id)` · `cloud.getDoc(ref)` · `cloud.setDoc(ref, data)`.
- `cloud.nowIso?()` — חותם-זמן אופציונלי; חסר ⇒ ברירת-מחדל של האטום `new Date().toISOString()`.
ההגשה בפועל (getDoc/setDoc/ה-firebase) חיה בלוח-האם; הקופסה טהורה (חוק-6).

**הכרעות-חיווט (חיות בקופסה, לא באטום):**
- שם-האוסף `ICS_FEEDS = 'icsFeeds'` (icsFeed.ts:11 verbatim) — מחווט לנתיב-הכתיבה `setDoc(doc(db,'icsFeeds',slug),…)`.
- publishIcsFeed.readToken מחווט **לאותו** חוט readIcsFeedToken (icsFeed.ts:38 — publish משתמש-מחדש בקריאה).

**דוגמאות מחייבות** (בכולן חותם-זמן קבוע `nowIso=()=>'2026-08-24T10:00:00.000Z'`):
1. `mintFeedToken()` ⇒ 32 תווי-hex תואמי `/^[0-9a-f]{32}$/`.
2. `icsFeedUrl('proj-1','ke hila','abc')` ⇒
   `'https://us-central1-proj-1.cloudfunctions.net/icsFeed?org=ke%20hila&key=abc'`
   (encodeURIComponent על slug בלבד — הרווח ⇒ `%20`; ה-token לא מקודד).
3. `readIcsFeedToken('kehila', cloud)` עם snap `data()={token:'a1b2c3d4'}`, `exists()=true`
   ⇒ `'a1b2c3d4'`; ה-doc נקרא עם `(db,'icsFeeds','kehila')`.
4. `readIcsFeedToken('x', cloud)` כשהמסמך לא-קיים ⇒ `null`; token ריק/לא-מחרוזת ⇒ `null`.
5. `publishIcsFeed('org1','BEGIN:VCALENDAR',undefined,cloud)` כשקיים token 'tok-old'
   ⇒ 'tok-old'; mint לא נקרא; `setDoc` קיבל `(doc(db,'icsFeeds','org1'),
   {token:'tok-old', ics:'BEGIN:VCALENDAR', updatedAt:'2026-08-24T10:00:00.000Z'})`.
6. אין token קיים ⇒ mint מנפיק חדש (32-hex) והוא הנכתב/המוחזר.
7. `opts={rotate:true}` ⇒ readToken **לא** נקרא (getDoc לא נקרא); mint מנפיק חדש גם כשקיים token.
8. `ics` באורך 900,001 בתי-ascii ⇒ זריקה 'לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה';
   `setDoc` לא נקרא. גבול 900,000 בדיוק ⇒ עובר.

**מוצא:** maor/src/lib/icsFeed.ts (‏4 export-ים; ‏cloudDb/doc/getDoc/setDoc = שקעים,
חוק-1; ה-token חי במסמך-הפיד בלבד — לא בקונפיג/גיבויים/localStorage).
