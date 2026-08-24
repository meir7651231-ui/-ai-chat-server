# חוזה · קופסת-חיבורים "donation-partition"
**תפקיד:** שכבת-פיצול-תרומות (מסלול-B) — פירוק `Supporter.donations[]` למסמכי-ענן
פר-ייעוד (`purpose`, מסנן-ההרשאה-פר-עובד), הרכבתם-חזרה דטרמיניסטית, ו-diff
ברמת-אוסף לצד-הדחיפה. הכול טהור. מקור-האמת: `maor/src/lib/donationPartition.ts`.

**מפתח-הפיצול = `purpose`** (הרשאה-פר-עובד; ריק ⇒ משותף), **לא** `designation`
(תג-אימוץ SHOP9) — donationPartition.ts:8-9.

**חיווט (כל התלות כאן, לא בחוטים):**
- `SHARED_PURPOSE_KEY` = `'_shared_'` (shared-purpose-key ← donationPartition.ts:21).
- `purposeKeyOf(d)` — אטום עצמאי (purpose-key-of ← donationPartition.ts:24-27).
- `donAllowedKeys(allowed)` ← `_donAllowedKeys(allowed, SHARED_PURPOSE_KEY)`
  (המפתח-המשותף מוזרק כשקע; don-allowed-keys ← donationPartition.ts:34-37).
- `explodeSupporter(sp)` ← `_explodeSupporter(sp, purposeKeyOf)`
  (השכן purposeKeyOf מוזרק; explode-supporter ← donationPartition.ts:56-63).
- `reassembleDonations(base, docs)` — אטום עצמאי, כולל המיון-הפרטי `byDateThenRid`
  (reassemble-donations ← donationPartition.ts:70-87).
- `donationPartitionDiff(prev, next)` ← `_donationPartitionDiff(prev, next, explodeSupporter)`
  (explodeSupporter המחווט מוזרק; donation-partition-diff ← donationPartition.ts:103-119).

**חשיפה (חתימות ביט-זהות למקור):** `SHARED_PURPOSE_KEY` · `purposeKeyOf` ·
`donAllowedKeys` · `explodeSupporter` · `reassembleDonations` · `donationPartitionDiff`.
(הטיפוסים `DonationDoc`/`DonationCloudDiff` הם type-only ב-TS — אין להם ריצה.)

**דוגמאות מספריות מחייבות (מקריאת-הקוד):**
1. `purposeKeyOf({ purpose: ' חינוך ' })` ⇒ `'חינוך'` (trim; :25). `purposeKeyOf({})` ⇒ `'_shared_'` (ריק ⇒ משותף; :26). `purposeKeyOf({ purpose: '   ' })` ⇒ `'_shared_'`.
2. `donAllowedKeys(['a', 'a', '', ' b '])` ⇒ `['a', 'b', '_shared_']` (dedup + trim + סינון-ריק + המשותף; :35-36). ל-40 ייעודים ⇒ 29 חתוכים + המשותף = 30 (מגבלת-in של Firestore; :35).
3. `explodeSupporter({ id: 's1', donations: [{ rid: 'D-1', purpose: 'חינוך', date: '2024-01-01', amount: 100 }] })` ⇒ `[{ id: 'D-1', supporterId: 's1', pkey: 'חינוך', donation: { rid:'D-1', purpose:'חינוך', date:'2024-01-01', amount:100 } }]` (id=rid; :57-62). `explodeSupporter({ id: 's2' })` ⇒ `[]` (אין donations ⇒ `?? []`; :57).
4. `reassembleDonations({ id: 's1', name: 'כהן', hist: [{ d: 'x' }] }, [ { supporterId:'s1', donation:{ rid:'D-2', date:'2024-02-01' } }, { supporterId:'s1', donation:{ rid:'D-1', date:'2024-01-01' } }, { supporterId:'sX', donation:{ rid:'D-9', date:'2024-03-01' } } ])` ⇒ `{ id:'s1', name:'כהן', hist:[{ d:'x' }], donations:[{ rid:'D-1', date:'2024-01-01' }, { rid:'D-2', date:'2024-02-01' }] }` — מסונן ל-supporterId=='s1' (sX נופל), ממויין תאריך-ואז-rid, hist נשמר (:82-86).
5. `donationPartitionDiff([{ id:'s1', donations:[{ rid:'D-1', purpose:'a', amount:100 }, { rid:'D-3', purpose:'b' }] }], [{ id:'s1', donations:[{ rid:'D-1', purpose:'a', amount:200 }, { rid:'D-2', purpose:'c' }] }])` ⇒ `sets` מכיל את D-1 (amount השתנה) ואת D-2 (חדש), `deletes` = `['D-3']` (הוסר; :112-117). `donationPartitionDiff(x, x)` (ללא שינוי) ⇒ `{ sets: [], deletes: [] }`.

**אינווריאנט-קדוש:** `reassemble(base, explode(sp))` שקול-פונקציונלית ל-sp כאשר
`base` = sp — אותה קבוצת-תרומות (ממוינת דטרמיניסטית), `hist` לא-נגוע
(donationPartition.ts:11-13). מגן-הכרעה בבדיקה נועל: המפתח-המשותף מוזרק
ל-donAllowedKeys, purposeKeyOf מזין את explode, ו-explode המחווט מזין את diff.

**הבטחה:** donationPartition טהור לגמרי (אין DOM/localStorage/fetch/ענן — אין שקע-IO).
ניתוק כל חוט מהקופסה לא נוגע באף חוט אחר.
