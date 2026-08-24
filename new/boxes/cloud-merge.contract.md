# חוזה · קופסה cloud-merge

**תפקיד:** קופסת-החיבורים של צד-הקבלה בסנכרון-הענן — מחווטת 4 חוטים טהורים
(ללא firebase/DOM) שמחילים שינוי מרוחק על ה-DB המקומי: בלי לדלוף, בלי לשכפל,
בלי לקרוס על מסמך מרוחק פגום.

**מוצא:** maor/src/lib/cloud-merge.ts (צד-הקבלה הטהור). החוטים:
- `sanitizeIncoming` — maor/src/lib/cloud-merge.ts:32-49 (LIST_FIELDS:18-30).
- `mergeDonationsPreserving` — maor/src/lib/cloud-merge.ts:51-71.
- `applyEntityPartial` (חוט 6-ארגומנטים) — maor/src/lib/cloud-merge.ts:73-104.
- `applyMetaPartial` — maor/src/lib/cloud-merge.ts:106-141.
- `ENTITY_COLLECTIONS` — maor/src/lib/cloud-diff.ts (מיובא בשורה 7 של המקור).

## החיווט (ההכרעה החיה בקופסה)
במקור, `applyEntityPartial` קורא ל-3 שכנים ישירות: `ENTITY_COLLECTIONS`,
`sanitizeIncoming`, `mergeDonationsPreserving`. בחוט הם הוזרקו כפרמטרים (חוק-1).
**הקופסה מחווטת אותם חזרה** (cloud-merge.mjs:20-21):
`applyEntityPartial(db,col,docs)` = `applyEntityPartialAtom(db,col,docs, ENTITY_COLLECTIONS, sanitizeIncoming, mergeDonationsPreserving)`.
זו המשמעות; ניתוק-חוט = הסרת-פרמטר, אפס נגיעה באטומים.

## החשיפה (הפלט הציבורי)
`sanitizeIncoming(col,item)` · `mergeDonationsPreserving(col,local,incoming)` ·
`applyEntityPartial(db,col,docs)` (3-ארגומנטים, מחווט) · `applyMetaPartial(db,meta)`.

## שקעי-IO
אין. המקור טהור לחלוטין; `db` · `docs` · `meta` מוזרקים ע"י הקורא (cloudSync.ts).

## דוגמאות מחייבות

### sanitizeIncoming(col, item)
- s1. `sanitizeIncoming('ghosts',{a:1})` ⇒ `{a:1}` (אוסף לא-מוכר ⇒ זהות, אותה רפרנס).
- s2. `sanitizeIncoming('supporters',{id:'x'})` ⇒ `{id:'x',donations:[]}` (שדה-רשימה חסר ⇒ []).
- s3. `sanitizeIncoming('families',{members:5,docs:['d']})` ⇒ `{members:[],docs:['d']}`
  (members לא-מערך ⇒ []; docs מערך ⇒ נשמר).

### mergeDonationsPreserving(col, local, incoming)
- m1. `col='families'` ⇒ מחזיר את `incoming` כמות-שהוא (לא-תומכים לא-מושפעים).
- m2. תומך · local.donations=[{rid:'A'}], incoming.donations=[{rid:'B'}] ⇒
  `donations=[{rid:'B'},{rid:'A'}]` (התרומה המקומית-בלבד נשמרת, נכנס-תחילה).
- m3. תומך · local.count=5, incoming.count=3, אין תרומה-מקומית-בלבד ⇒
  `count=5` (מונה רק-עולה, max); ils/usd באותו דין.
- m4. תומך · local⊆incoming (אין מקומי-בלבד, מונים לא-גדלו) ⇒ מחזיר `incoming` כמות-שהוא.

### applyEntityPartial(db, col, docs) — מחווט
- e1. `col='ghosts'` (לא ב-ENTITY_COLLECTIONS) ⇒ הפלט `===db` (no-op).
- e2. `db.rooms=[{id:'a',n:1}]` · `docs=[{id:'b',data:{n:2},deleted:false}]` ⇒
  `rooms=[{n:2,id:'b'},{id:'a',n:1}]` (חדש לראש, id מושתל). rooms אינו ב-LIST_FIELDS
  ⇒ החיזוק=זהות, כדי להראות את סדר-ה-upsert נקי.
- e3. `db.rooms=[{id:'a',n:1},{id:'b',n:2}]` · `docs=[{id:'a',data:{},deleted:true}]` ⇒
  `rooms=[{id:'b',n:2}]` (מחוק יצא).
- e4. `db.supporters=[{id:'s',donations:[{rid:'A'}],count:5}]` ·
  `docs=[{id:'s',data:{donations:[{rid:'B'}],count:3},deleted:false}]` ⇒
  supporters[0].donations=`[{rid:'B'},{rid:'A'}]`, count=5 (חיווט-החיזוק+המיזוג פעיל).
- e5. `docs=[{id:'a',data:{id:'a',n:1},deleted:false}]` על `db.rooms=[{id:'a',n:1}]` ⇒
  הפלט `===db` (ביט-זהה ⇒ אותה רפרנס).
- e6. `db.families=[]` · `docs=[{id:'g',data:{name:'כהן'},deleted:false}]` ⇒
  `families=[{name:'כהן',id:'g',members:[],docs:[]}]` — החיזוק המחווט (sanitizeIncoming)
  מזריק את שדות-הרשימה של families, בדיוק כמו המקור.

### applyMetaPartial(db, meta)
- p1. `applyMetaPartial({seq:5},{seq:3})` ⇒ הפלט `===db` (מונה לא-קטן, אין שינוי).
- p2. `applyMetaPartial({seq:5},{seq:9})` ⇒ `{seq:9}` (מונה עולה).
- p3. `applyMetaPartial({orgName:'א'},{orgName:'ב'})` ⇒ `{orgName:'ב'}` (הענן-מנצח).
- p4. `applyMetaPartial({orgName:'א'},{orgName:undefined})` ⇒ הפלט `===db` (undefined מדולג).
