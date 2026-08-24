# 📜 חוזה · קופסת-המשפחות (families.mjs)

מקור-אמת: `/home/user/maor-system/src/components/families/lib.ts` (עוגני-שורה למטה).
מחווטת 20 חוטים מ-`new/atoms`. שקע-IO יחיד: `now` (שעון). שקעים-חוצי-מודול שהפכו
אטומים: `term-of` (config.ts:119) · `iso-local` (date-util.ts:13).

## שקעים (הכרעות/IO)
- `now` — Date מוזרק ל-`ageOf`/`isoToday`; ברירת-מחדל `new Date()` (מקור lib.ts:19-21,30).
- `DEFAULT_CONFIG` בקופסה = `{}` — הכרעה מקומית; ביט-זהה ל-DEFAULT_CONFIG של המקור
  (config.ts:404-410 — בלי `terms` ⇒ `termOf` תמיד fallback).

## החוטים המחווטים · קלט → פלט → דוגמה

### `fmtDate(iso)` — עוגן lib.ts:12-17
ISO → `DD/MM/YYYY`; ריק/פגום → `'—'`.
- `fmtDate('2026-08-24')` → `'24/08/2026'` · `fmtDate('')` → `'—'` · `fmtDate('bad')` → `'—'`.

### `isoToday(now?)` — עוגן lib.ts:19-21 (→ date-util.ts:10,13)
"היום" מקומי YYYY-MM-DD.
- `isoToday(new Date('2026-08-24T12:00:00'))` → `'2026-08-24'`.

### `ageOf(birth, now?)` — עוגן lib.ts:24-35
גיל בשנים מלאות; ריק/לא-חוקי → `null`. פרסור ב-`T12:00:00` (צהריים מקומי).
- `ageOf('2000-01-15', new Date('2026-08-24T12:00:00'))` → `26`.
- `ageOf('2000-12-15', new Date('2026-08-24T12:00:00'))` → `25` (יום-הולדת עוד לא עבר).
- `ageOf('', now)` → `null` · `ageOf('not-a-date', now)` → `null`.

### `STATUS_META` — עוגן lib.ts:37-41
`{active:{label:'פעילה',bg:'#e4f5ea',c:'#12803c'}, pending:{…'ממתינה'…}, inactive:{…'לא פעילה'…}}`.

### `CRED_RED_THRESHOLD` — עוגן lib.ts:52
`500`.

### `CRED_HELP_TEXT` — עוגן lib.ts:55-58
מחרוזת-העזרה verbatim: `'נוכחות +5 · דיוק +2 …'`.

### `tierOf(score)` — עוגן lib.ts:61-66
דרגה לפי 950/800/500(=CRED_RED_THRESHOLD). הסף מולחם בקופסה (מקור נשען על קבוע-מודול).
- `tierOf(970).key` → `'titan'` · `tierOf(850).key` → `'lion'` · `tierOf(600).key` → `'pale'` · `tierOf(400).key` → `'red'` · `tierOf(500).key` → `'pale'` (סף כולל).

### `famEnrollments(db, fam)` — עוגן lib.ts:69-72
כל שיבוצי בני-המשפחה (כולל ended/wait), לפי `member.id ∈ fam.members`.

### `famLiveEnrollments(db, fam)` — עוגן lib.ts:79-81
שיבוצים "חיים" בלבד — מוציא `status==='ended'` ו-`status==='wait'`.

### `finderAxes(config)` — עוגן lib.ts:87-99
9 צירים בסדר קבוע; `cred`/`enrolled` דרך `termOf`.
- ציר-1 = `['city','עיר']`; ציר-5 = `['cred','אמינות']` (fallback ללא-מילון).

### `finderAxisValue(db, f, axis, config?)` — עוגן lib.ts:102-116
ערך-עברי של המשפחה בציר. `status`→STATUS_META.label · `cred`→tierOf(score??700).label ·
`kids`→'עם ילדים'/'בלי ילדים' · `enrolled`→'משתתפות ב…'/'לא משתתפות' · `sefach`→'קיים'/'חסר'.
- `marital` חסר → `'לא ידוע'` · ציר לא-מוכר → `''`.

### `finderMatches(db, locks)` — עוגן lib.ts:119-123
משפחות שכל נעילות-הגלגל (AND) מתקיימות בהן; `finderAxisValue` נקרא בלי config.

### `numMatch(q, n)` — עוגן lib.ts:129-138
`""`→true · `"3"`→n===3 · `"3+"`→n>=3 · `"2-4"`→2<=n<=4 · לא-מספרי→true.
- `numMatch('3',3)`→`true` · `numMatch('3+',2)`→`false` · `numMatch('2-4',4)`→`true` · `numMatch('abc',9)`→`true`.

### `famHistoryOf(db, fam, config?)` — עוגן lib.ts:154-196
ציר-היסטוריה נגזר (הצטרפות/אירועים/לוג-אמינות/מסמכים/שיבוצים/תשלומים/היעדרויות),
ממוין מהחדש-לישן (`localeCompare` יורד), חתוך ל-40. `config` חסר → `{}` (=DEFAULT_CONFIG).

### `MARITAL_OPTIONS` / `LANGUAGE_OPTIONS` / `OTHER` / `OTHER_LABEL` — עוגן lib.ts:199-202
`['נשואים','גרושים','אלמן/ה','פרודים']` · `['עברית','יידיש','רוסית','צרפתית','אנגלית']` ·
`'__other'` · `'אחר — הקלדה חופשית…'`.

### `chipStyle(bg, c)` — עוגן lib.ts:208-219
אובייקט-סגנון עם `background:bg, color:c` + קבועי-צ׳יפ (padding/borderRadius:999/…).

### `maritalChipStyle(status)` — עוגן lib.ts:228-231
צבע-שבב פר-מצב; מצב לא-מוכר → שבב-ניטרלי `['#eef1f5','#4a5568']`.
- `maritalChipStyle('נשואים').background` → `'#e6f4ea'` · `maritalChipStyle('???').background` → `'#eef1f5'`.

## הכרעות-חיווט (מגן-הכרעה בבדיקה)
1. `tierOf` מולחם עם `CRED_RED_THRESHOLD` (מקור: ארגומנט-יחיד + קבוע-מודול).
2. `finderAxisValue` מקבל אובייקט-שקעים `{termOf,tierOf,famLiveEnrollments,STATUS_META}`.
3. `famLiveEnrollments` מקבל `famEnrollments` מוזרק.
4. `DEFAULT_CONFIG = {}` בקופסה (לא ייבוא מ-maor).

## DoD
`node new/boxes/families.test.mjs` ⇒ exit 0 · `node .../parity/families.parity.mjs` ⇒ exit 0.
