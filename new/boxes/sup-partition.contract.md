# חוזה · קופסת-חיבורים "אכיפת-הרשאה · פירוק-תומכים"
**מקור-האמת:** `maor/src/lib/supporterPartition.ts` (L4 — החוזה מתכופף למקור).
**תפקיד:** שכבה טהורה שאוכפת ייעוד-פר-תורם (`forWho`) בשכבת-הנתונים — מזריקה
`skey` plaintext למסמך-הענן (מחוץ למעטפה) ש-Rules ו-`where` יכולות לבחון, ומקלפת
אותו בחזרה במשיכה. כבוי ⇒ ביט-זהה להיום.

**החיווט (הכרעות חיות בקופסה):** ארבעת האטומים מוזרקי-השקעים (חוק-1) מחוברים כאן:
`supKeyOf`/`supAllowedKeys` מקבלים את המפתח-המשותף `SHARED_SUP_KEY`; `docSkey`/
`supKeyMapOf` מקבלים את `supKeyOf` המחווט (הקשור-כבר-ל-shared) כשכן-גוזר.

## חשיפה + דוגמאות מחייבות (עוגני-שורה למקור)

### `SHARED_SUP_KEY` (מקור:23)
קבוע `'_shared_'` — תומך ללא-ייעוד = משותף.

### `supKeyOf(sp)` ⇒ string (מקור:26-29)
`forWho` מחוטא (trim); ריק/רווחים/חסר ⇒ המשותף.
- `supKeyOf({ forWho: 'רפואה' })` ⇒ `'רפואה'`
- `supKeyOf({ forWho: '  חינוך  ' })` ⇒ `'חינוך'`
- `supKeyOf({ forWho: '   ' })` ⇒ `'_shared_'`
- `supKeyOf({})` ⇒ `'_shared_'`  · `supKeyOf({ forWho: null })` ⇒ `'_shared_'`

### `SUP_KEYED_COLS` (מקור:35)
`['supporters', 'events']` — האוספים הנאכפים פר-skey.

### `docSkey(col, data, supKeyBySpId)` ⇒ string (מקור:42-49)
`supporters` ⇒ forWho שלו · `events` ⇒ מפתח-התומך-המקושר דרך המפה (ללא-תומך =
משותף) · אוסף לא-נאכף ⇒ `''` (הקורא לא יזריק skey).
- `docSkey('supporters', { forWho: 'חינוך' }, m)` ⇒ `'חינוך'`
- `docSkey('events', { spId: 's1' }, new Map([['s1','רפואה']]))` ⇒ `'רפואה'`
- `docSkey('events', { spId: 'sX' }, new Map())` ⇒ `'_shared_'` (spId לא-במפה)
- `docSkey('events', {}, m)` ⇒ `'_shared_'` (בלי spId)
- `docSkey('events', { spId: 123 }, m)` ⇒ `'_shared_'` (spId לא-מחרוזת)
- `docSkey('families', { forWho: 'x' }, m)` ⇒ `''` (לא-נאכף)

### `supKeyMapOf(supporters)` ⇒ Map<id,skey> (מקור:52-54)
- `supKeyMapOf([{ id:'s1', forWho:'רפואה' }, { id:'s2', forWho:'' }])`
  ⇒ `Map{ 's1'→'רפואה', 's2'→'_shared_' }`

### `supAllowedKeys(allowed)` ⇒ string[] (מקור:61-64)
מנוקה (trim), ללא-כפילויות, ללא-ריקים, חתוך ל-29, + המשותף בסוף. סדר-הקלט נשמר.
- `supAllowedKeys(['רפואה','חינוך','רפואה','  '])` ⇒ `['רפואה','חינוך','_shared_']`
- `supAllowedKeys([])` ⇒ `['_shared_']`
- 40 ייעודים ⇒ אורך 30 (29 + משותף).

### `stripSupKey(data)` ⇒ Omit<data,'skey'> (מקור:70-75)
- `stripSupKey({ a:1, skey:'x' })` ⇒ `{ a:1 }`
- `stripSupKey({ a:1 })` ⇒ אותה הפניה (אין skey ⇒ בלי עותק).

### `stripAuditMeta(meta)` ⇒ Omit<meta,'audit'> (מקור:82-87)
- `stripAuditMeta({ m:1, audit:[...] })` ⇒ `{ m:1 }`
- `stripAuditMeta({ m:1 })` ⇒ אותה הפניה.

**שקעי-IO (לא ממומשים כאן):** אין. השכבה טהורה — הענן/Rules/where הם חיווט של
מסלול-הסנכרון (פאזות 2–4 במקור), מחוץ לקופסה.
