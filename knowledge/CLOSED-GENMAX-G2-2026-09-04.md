# ✅ CLOSED · GENMAX · G2 — סכמה ⇒ פעולות-יסוד (4.9.2026)

> שלב 2 של `PLAN-GENERATOR-MAX-2026-09-04.md` (ציר-1 "סכמה ⇒ ops"). כלי: `machtzev/generator/shape-ops.mjs` · פלט: `shape-ops.json` + `shape-ops-report.md` · fixture: `golden-modules.json` (מודול-זהב ⇒ ישויות-הסכמה) · שער: `shapeops` (commit · baseline grow).

## מה נבנה
מסכמת-האמת (`new/atoms/schema-fields.mjs` — **54 ישויות · 492 שדות · 100 טיפוסים**) נגזרת לכל ישות רשימת-ops **מצורת-הטיפוס בלבד** (§20-ד):
- שדה: `Id`⇒identity/relation · `Id[]`⇒relation-many · `number`⇒measure/aggregate/stat · `boolean`⇒flag/partition · `IsoDate`⇒temporal/calendar/expiry/holidayGuard · `TimeHM`/`Weekday`⇒slot/weekly · enum (`'a'|'b'` או Enum-בשם)⇒partition/lifecycle/workflow/filter · `Sub[]`⇒collection/table/log · `Record<>`⇒flags · `string`⇒text.
- **רמז-צורה יחיד על שם-שדה, מוצהר:** `phone/tel/mail/email/wa` ⇒ `channel` (חוק-6: הערך מוזרק). זו אותה מדיניות כמו `entity.mjs` (רמזי-טיפוס ב-`spec-lang.data.json`), לא מילון-דומייני.
- צירופים: ≥2 תאריכים או תאריך+שעה ⇒ range/**clash** · מספר+תאריך ⇒ trend/**balance** · תת-ישויות ⇒ roster/makeups · ערוץ ⇒ contact/broadcast · מכונת-מצבים ⇒ triage/pipeline · FK ⇒ details/load · תאריך+דגל ⇒ certs · מדד+חלוקה ⇒ risk/enrollment · אוסף ⇒ import/attendance.
- ישות תמיד מקבלת גם 9 ops-קבועים: table · search · filter · form · panel · export · perm · states · kpi.

## שער-הזהב (פלט `shapeops`, 4.9)
`✓ shapeops: 54 ישויות · 492 שדות ⇒ כיסוי-זהב 58/60` — 60 חלקיקי `compose-engine` (25 מלאי + 35 SchoolOS) מול ops שנגזרו מישויות-המודול:
| מודול | חלקיקים | נגזרים | חסר |
|---|---|---|---|
| מלאי | 25 | 24 | `movements:log` — WarehouseItem/ShopItem ללא מערך-תת-ישות; יומן-הקליטות הוא ישות (ShopIntake) ולא שדה |
| תלמידים 6 · נוכחות 5 · חוגים 4 · מורים 4 · חדרים 4 · גבייה 4 · לוח 4 | 31 | 31 | — |
| הורים | 4 | 3 | `par.details` — ExpandableTile-הסכמות: אין שדה-צורה שמכתיב "פירוט-מתקפל" |

**כנות על ה-97%:** 21 מ-58 החלקיקים מכוסים ע"י 9 ה-ops-הקבועים-לישות (search/filter/table/export/perm/states/form/panel/kpi) — "קל-להשגה"; **37 נגזרים מטיפוסי-שדות** — זה הערך של G2. השער בודק **קיום-op** ברמת-מודול, לא שהאטום-הנבחר נכון — זה G3/G4.

## מה לא אומת (D3)
- `golden-modules.json` (מודול⇒ישויות) נכתב ביד — fixture-בדיקה, לא לוגיקת-מנוע; מבחן-הקונכייה: ישות חדשה ⇒ ops בלי שינוי-קוד.
- `KIND_TO_OPS` (סוג-הרכבה ב-compose-engine ⇒ op-משפחה) = טבלת-שקילות מבנית, 34 שורות; אם סוג חדש ייווסף למנוע — צריך שורה. יאוחד ב-G3 כשה-ops יקבלו שקעים-נדרשים.
- אין רנדר/flutter — G2 הוא נגזרת-סכמה.
- `Db`/`UiPrefs`/`SecurityCfg` (ישויות-קונפיג) מקבלות ops כמו ישות-עסקית — סינון "ישות-קונפיג" יידרש ב-G4 (מבני: ישות בלי `id`).

## אימות
`shape-ops.mjs --gate` ✓ · `police --fast` ✅ **24 ran · 0 failed · מרשם 31** (שערים חדשים `opcensus`+`shapeops`) · `truth --write` · `pins --write` · הכרעה-24 ב-`DECISIONS.md`.

## הבא (G3 · set-cover)
כל op מצהיר שקעים-נדרשים (למשל `table`: rows+labels · `clash`: slots+range) · כל אטום (מ-`ops-map.json`) מצהיר שקעים-שהוא-ממלא · פתרון-כיסוי מינימלי דטרמיניסטי ⇒ "אין-יחיד ⇒ משלב כמה" כאלגוריתם. שער: ההרכבות של הזהב (autoRelocate · conflictsOf · streak · risk-4-אותות) מתקבלות מהמנוע.
