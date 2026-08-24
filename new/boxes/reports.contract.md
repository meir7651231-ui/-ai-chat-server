# חוזה · קופסת-חיבורים reports (מסך-הדוחות)

**מקור-אמת (L4):** `maor-system/src/components/reports/lib.ts` — 13 חוטים טהורים.
הקופסה מחווטת אטומים מ-`new/atoms` בלבד לפי גרף-הקריאות של המקור; כל שקע-IO
(שכן חוצה-מודול / `new Date()`) מוזרק כפרמטר מתועד, לא ממומש.

## חוטים חשופים (13) — עוגני-שורה למקור

### isoToday(isoLocal, now?) -> string  · מקור: reports/lib.ts:13-15
"היום" כ-ISO מקומי. המקור מחזיר `isoTodayLocal()` (date-util:9-11 = `isoLocal(new Date())`).
שקע: `isoLocal` (Date=>"YYYY-MM-DD", date-util:17-20) + `now` (ברירת-מחדל `new Date()` — שקע-הזמן).
- `isoToday(isoLocal, new Date(2026,7,24,12,0,0))` -> `"2026-08-24"`

### fmtDate(iso) -> string  · מקור: reports/lib.ts:18-23
תצוגת DD/MM/YYYY. **הכרעת-מסך-הדוחות (חיה בקופסה):** קלט-ריק=>`''` · פורמט-שבור=>
מוחזר-כמו-שהוא (`iso`, בלי "undefined/undefined") — שונה מאטום `fmt-date` (שמחזיר `'—'`,
ואיחד 4 מודולים אחרים ולא את reports). הליבה DD/MM/YYYY מהאטום.
- `"2026-08-24"` -> `"24/08/2026"` · `"2026-08-24T12:00:00"` -> `"24/08/2026"`
- `""` -> `""` · `"שטויות"` -> `"שטויות"` · `"2026-08"` -> `"2026-08"`

### inRange(iso, {from,to}) -> boolean  · מקור: reports/lib.ts:25-30
תאריך בתוך טווח (השוואה לקסיקוגרפית, גבולות כוללים; גבול ריק=פתוח; iso ריק=>false).
- `inRange("2026-05-01", {from:"2026-01-01", to:"2026-12-31"})` -> `true`
- `inRange("2025-12-31", {from:"2026-01-01", to:""})` -> `false`
- `inRange("", {from:"",to:""})` -> `false`

### rangeLabel({from,to}) -> string  · מקור: reports/lib.ts:32-36
תווית עברית לטווח; שקע fmtDate = fmtDate של הקופסה (מוזרק, חוק-3).
- `{from:"",to:""}` -> `"כל התאריכים"`
- `{from:"2026-01-01",to:"2026-03-01"}` -> `"01/01/2026 – 01/03/2026"`
- `{from:"2026-01-01",to:""}` -> `"מ-01/01/2026"` · `{from:"",to:"2026-03-01"}` -> `"עד 01/03/2026"`

### paidOf(e) -> number  · מקור: reports/lib.ts:39-41
סה"כ ששולם בשיבוץ; סכומים לא-סופיים (NaN/Infinity) מדולגים; `payments` חסר=>0.
- `paidOf({payments:[{amount:100},{amount:50}]})` -> `150`
- `paidOf({payments:[{amount:100},{amount:NaN}]})` -> `100` · `paidOf({})` -> `0`

### round2(x) -> number  · מקור: reports/lib.ts:44
עיגול לשתי ספרות. `round2(0.1+0.2)` -> `0.3` · `round2(1.005)` -> `1` (float, כמו המקור).

### paidInRange(e, r) -> number  · מקור: reports/lib.ts:47-52
ששולם בתוך טווח; שקע inRange מוזרק. סכומים לא-סופיים מדולגים.
- `paidInRange({payments:[{amount:100,date:"2026-02-01"},{amount:50,date:"2025-01-01"}]}, {from:"2026-01-01",to:""})` -> `100`

### balanceOf(e) -> number  · מקור: reports/lib.ts:54-56
יתרת-חוב = max(0, totalDue - paidOf); שקע paidOf מוזרק.
- `balanceOf({totalDue:200, payments:[{amount:50}]})` -> `150`
- `balanceOf({totalDue:100, payments:[{amount:300}]})` -> `0` · `balanceOf({})` -> `0`

### monthKey(iso) -> string  · מקור: reports/lib.ts:59-61
`iso.slice(0,7)`. `"2026-08-24"` -> `"2026-08"`.

### monthLabel(key) -> string  · מקור: reports/lib.ts:64-67
`"2026-08"` -> `"08/2026"`.

### nameIndex(db, allMembers) -> Map<id,member>  · מקור: reports/lib.ts:70-75
Map מזהה=>בן-משפחה; שקע allMembers (useApp:3579-3585, db=>[{...m,famId,famName}]) מוזרק.
- `db={families:[{id:'f',name:'כהן',members:[{id:'m1'}]}]}` -> `Map{'m1'=>{id:'m1',famId:'f',famName:'כהן'}}`

### STATUS_LABEL -> Record  · מקור: reports/lib.ts:77-81
`{active:'פעילה', pending:'ממתינה', inactive:'לא פעילה'}` (verbatim מהאטום).

### countBy(items, key) -> [string,number][]  · מקור: reports/lib.ts:84-91
ספירה לפי מפתח, ממוין יורד לפי כמות.
- `countBy([{s:'a'},{s:'a'},{s:'b'}], x=>x.s)` -> `[['a',2],['b',1]]`

## שקעי-IO מוזרקים (חוק-3/6)
- `isoLocal(date)` — Date=>"YYYY-MM-DD" (date-util:17-20). `now` — שקע-הזמן (ברירת `new Date()`).
- `allMembers(db)` — שיטוח db.families לבני-משפחה (useApp:3579).

## מגן-הכרעה
`reports.test.mjs` קורא את מקור-הקופסה ב-fs ומאשר verbatim: (1) הכרעת-fmtDate
(`return ''`/`return iso`, לא `'—'`); (2) STATUS_LABEL בעברית; (3) הקסקדה של סדר-הבדיקות.
