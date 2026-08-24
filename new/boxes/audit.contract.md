# 📦 חוזה-קופסה · audit — ביקורת-תקינות-הנתונים (lib-audit)

מקור-האמת: `maor-system/src/lib/audit.ts` (החלוץ קדוש — L4). הקופסה מחווטת את
חמשת החוטים של הקובץ לפי גרף-הקריאות ב-`box-drafts/lib-audit.box-draft.md`.

## DoD (נכתב לפני הקוד — דיבר 12)
- `node new/boxes/audit.test.mjs` ⇒ exit 0 (מדפיס ✓)
- `node /home/user/maor-system/machtzev/parity/audit.parity.mjs` ⇒ exit 0 — ישן≡חדש
  על קורפוס-LCG ‏seed=20260824, אפס-סטייה, בלי Date.now (שעון קבוע 2026-08-24T12:00).

## חשיפות

### `AUDIT_CATEGORIES` — עוגן: audit.ts:45-54
8 קטגוריות בסדר-המקור: `['כפילות','ת"ז','טלפון','אימייל','כתובת','לוגיקה','ילדים','קשר']`.

### `AUDIT_CAT_COLORS` — עוגן: audit.ts:34-43
מילון קטגוריה ⇒ `[רקע, דיו]`. דוגמה: `AUDIT_CAT_COLORS['כפילות'] ≡ ['#fdeaea','#b91c1c']`,
‏`AUDIT_CAT_COLORS['קשר'] ≡ ['#f6ead1','#9a6414']`.

### `phoneIssue(p)` — עוגן: audit.ts:60-68
תיאור-הבעיה או `null` אם תקין. סדר-הדינים הוא דין-המקור:
| קלט | פלט |
|---|---|
| `undefined` · `''` · `'-'` | `null` (audit.ts:62) |
| `'050-1234567'` (10 ספרות, פותח 0) | `null` (audit.ts:63) |
| `'03-5551234'` (9 ספרות, פותח 0) | `null` |
| `'12345678'` (8 ספרות) | `'כנראה חסרה ספרת 0 מובילה: 12345678'` (audit.ts:64) |
| `'123456'` (6 ספרות) | `'קצר מדי: 123456'` (audit.ts:65) |
| `'972501234567'` (12, פותח 9) | `'לא מתחיל ב-0: 972501234567'` (audit.ts:66) |
| `'05012345678'` (11, פותח 0) | `'אורך חריג (11 ספרות): 05012345678'` (audit.ts:67) |

### `runAudit(db, todayIso = '', extra = true, config?, now = new Date())` — עוגן: audit.ts:78-219
מחזירה מערך ממצאים `{cat, title, famId? | spId?}` לא-ממוין (הקיבוץ בתצוגה).
- **חיווט-שכנים (audit.ts:9-12):** `termOf` (config.ts:119-126) · `normName` =
  ‏`normSearch`+הסרת-רווחים (validate.ts:65-67; ‏normSearch: validate.ts:51-59) ·
  ‏`validIsraeliId` (validate.ts:4-17) · `supporterAggregates` (supporterAgg.ts:27-42,
  ‏donations-בלבד) · `ageOf` (families/lib.ts:24-35) · `phoneIssue` הפנימי.
- **שקע-שעון:** `now` מוזרק ומוזרם ל-`ageOf` בלבד (families/lib.ts:30 — במקור
  ‏`new Date()` בתוך הפונקציה; ברירת-המחדל בקופסה נאמנה לזה וניתנת-להזרקה).
- **ברירות-מחדל (הכרעות בקופסה = חתימת-המקור audit.ts:78):** `todayIso=''` ⇒ בדיקת
  "עבר יעד הקשר" מדולגת (audit.ts:202); `extra=true` ⇒ ביקורת-מורחבת דלוקה;
  ‏`extra=false` ⇒ גם יעד-קשר וגם תרומת-אפס כבויות (audit.ts:202-207).
- **config:** בלי config ⇒ המונחים = fallback ‏(audit.ts:80). עם
  `{terms:{'nav.families':'לקוחות'}}` ⇒ "טלפון … משותף ל-2 לקוחות: …" (audit.ts:113).
- **חסינות לנתונים פגומים (audit.ts:82-83):** `runAudit({})` ⇒ `[]`;
  ‏`members` שאינו מערך ⇒ מדולג; `donations` שאינו מערך ⇒ מדולג — אפס קריסה.

דוגמאות מספריות (מוכחות בבדיקה):
1. שתי משפחות עם `phone:'0501234567'` ⇒ ממצא `כפילות`:
   `'טלפון 0501234567 משותף ל-2 משפחות: א, ב'` ‏(audit.ts:113).
2. `fatherId:'123456789'` (ספרת-ביקורת שגויה: סכום-לוהן 47) ⇒ ממצא `ת"ז`;
   ‏`fatherId:'123456782'` (סכום 40) ⇒ אין ממצא (validate.ts:4-17).
3. ילד/ה עם `birth:'1990-01-01'` מול `now=2026-08-24` ⇒ גיל 36 ⇒
   `'… גיל חריג ל… (36)'` ‏(audit.ts:154-155). ‏`birth:'bad-date'` ⇒ ‏ageOf=null ⇒ אין ממצא-גיל.
4. תומך עם `ils:100, count:1` אבל `donations=[{amount:50}]` ⇒ ממצא `לוגיקה`
   "לא תואם את פירוט ה…" (סטייה>0.5, ‏audit.ts:190-200).
5. `nextDate:'2026-01-01'` ‏+ `todayIso:'2026-08-24'` ‏+ `extra:true` ⇒ ממצא `קשר`
   `'עבר יעד הקשר של "…" (2026-01-01)'`; עם `todayIso:''` — אין (audit.ts:202-203).
6. `donations=[{amount:0, rid:'D-7'}]` ‏+ `extra:true` ⇒ `'תרומה בסכום 0 אצל "…" (D-7)'`
   ‏(audit.ts:204-207).

### `auditReportLines(orgName, issues, nowLabel)` — עוגן: audit.ts:222-226
`nowLabel` = מחרוזת-שעה מוזרקת (הקורא AuditSection.tsx:44 מזרים
`new Date().toLocaleString('he-IL')` — שקע-IO, לא מימוש-הקופסה). דוגמה:
`auditReportLines('', [{cat:'טלפון', title:'X'}], '24.8.2026')` ⇒
`['דוח תקינות נתונים — מאור החסד', 'הופק: 24.8.2026', '', '[טלפון] X']`
(ברירת-שם-הארגון `'מאור החסד'` חיה באטום, כלשון audit.ts:223).

## 🛡 מגן-הכרעה (בבדיקה, דפוס theme.test)
הבדיקה קוראת את מקור-הקופסה ומאשרת verbatim: `todayIso = ''` · `extra = true` ·
`now = new Date()` · תפר-הנרמול `normNameWire(t, normSearch)` · הזרמת-השעון
`ageOf: (birth) => ageOf(birth, now)` · ייבוא מ-`../atoms/` בלבד.
