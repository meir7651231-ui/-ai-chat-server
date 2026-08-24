# חוזה · קופסת-חיבורים "dedup"
**תפקיד:** זיהוי כפילויות ומיזוגן — משפחות ותורמים — בשמירה מלאה של נתונים
(אפס-אובדן; כסף/rid לעולם לא נמחקים). מקור-האמת: `maor/src/lib/dedup.ts`.

**חיווט (כל התלות כאן, לא בחוטים):**
- glue module-private (verbatim מהמקור, מוזרק לחוטים): `phonesOf` (dedup.ts:34-36) ·
  `nameCityKey` (dedup.ts:27-31) · `supNameCityKey` (dedup.ts:262-266) ·
  `dedupById` (dedup.ts:88-97) · מילון `NAME_TITLES` (validate.ts:73-80).
- `nameSortKey` = name-sort-key ← `normSearch`(אטום) + `NAME_TITLES`(מילון-קופסה).
- `findDuplicateGroups(families)` ← `phonesOf,nameCityKey` (dedup.ts:42).
- `mergeFamilies(keeper,losers)` ← `{normPhone,dedupById}` (dedup.ts:109).
- `mergeFamiliesByFields(fams,pick,edit)` ← `{mergeFamilies,dupFieldValue,dupFields:DUP_FIELDS}` (dedup.ts:224).
- `findSupporterDupGroups(sups)` ← `{normPhone,normId,supNameCityKey,nameSortKey}` (dedup.ts:286).
- `mergeSupporterInto(keep,drop)` ← `mergeHist,PHOTO_MAX(=5)` (dedup.ts:342, photoGallery PHOTO_MAX).
- `mergeSupportersGroup(keeper,losers)` ← `mergeSupporterInto` (dedup.ts:388).
- `mergeSupportersByFields(sups,pick,edit)` ← `{mergeSupportersGroup,supDupFieldValue,SUP_DUP_FIELDS}` (dedup.ts:430).

**חשיפה (חתימות ביט-זהות למקור):** `normPhone` · `normId` · `DUP_FIELDS` ·
`SUP_DUP_FIELDS` · `dupFieldValue` · `supDupFieldValue` · `findDuplicateGroups` ·
`mergeFamilies` · `mergeFamiliesByFields` · `findSupporterDupGroups` ·
`mergeSupporterInto` · `mergeSupportersGroup` · `mergeSupportersByFields`.

**דוגמאות מספריות מחייבות (מקריאת-הקוד):**
1. `normPhone('+972-50-123-4567')` ⇒ `'0501234567'` (972→0, dedup.ts:19). `normPhone('0000000000')` ⇒ `''` (מציין-מקום, dedup.ts:17).
2. `normId('00000012345')` ⇒ `'00000012345'` (≥4 ספרות-משמעותיות; dedup.ts:277-278). `normId('000000020')` ⇒ `''` (<4 משמעותיות). `normId('123')` ⇒ `''` (<5 ספרות).
3. `findDuplicateGroups([{id:'a',name:'כהן',city:'ירושלים'},{id:'b',name:'כהן',city:'ירושלים'},{id:'c',name:'לוי',city:'בני ברק'}])` ⇒ `[['a','b']]` (שם+עיר זהים; c לבד ⇒ מסונן, גודל<2).
4. `findDuplicateGroups([{id:'a',phone:'0501112222'},{id:'b',phone:'972501112222'}])` ⇒ `[['a','b']]` (טלפון מנורמל משותף, dedup.ts:66-70).
5. `mergeFamilies({id:'k',name:'כהן',phone:'0501112222',status:'pending',kidsHome:2},[{id:'l',name:'כהן',email:'x@y.z',status:'active',kidsHome:5}])`: השומר שומר `id='k'`; `email='x@y.z'` (מולא מהריק); `status='active'` (הגבוה); `kidsHome=5` (max); `notes` מכיל `'| מוזג: כהן'` (dedup.ts:142-145,164).
6. `dupFieldValue([{name:''},{name:'לוי'}],{key:'name',get:f=>f.name||''},{},{})` ⇒ `'לוי'` (ראשונה-עם-ערך, idx=1). עם `edit={name:'כהן'}` ⇒ `'כהן'` (edit גובר). עם `pick={name:0}` ⇒ `''` (pick גובר על ראשונה-עם-ערך).
7. `findSupporterDupGroups([{id:'a',idNum:'123456789'},{id:'b',idNum:'123456789',name:'שונה'}])` ⇒ `[['a','b']]` (ת"ז מפתח-חזק, dedup.ts:321).
8. `mergeSupporterInto({id:'k',donations:[{date:'2024-01-01',amount:100,cur:'₪'}],city:''},{id:'d',donations:[{date:'2024-02-01',amount:50,cur:'₪'}],city:'חיפה'})`: `donations.length=2` (ממוזג+ממויין); `ils=150`; `city='חיפה'` (מולא מהריק); `count=2`; `first='2024-01-01'`, `last='2024-02-01'`.
9. `mergeSupportersGroup(A,[B,C])` = קיפול `mergeSupporterInto` — קבוצת-3 בקריאה-אחת, אפס איבוד-כסף (dedup.ts:389).

**הבטחה:** dedup טהור לגמרי (אין DOM/localStorage/fetch/ענן — אין שקע-IO).
ניתוק כל חוט מהקופסה לא נוגע באף חוט אחר.
