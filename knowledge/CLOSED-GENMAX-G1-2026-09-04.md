# ✅ CLOSED · GENMAX · G1 — סנסוס-פעולות-היסוד (4.9.2026)

> שלב 1 של `PLAN-GENERATOR-MAX-2026-09-04.md` (ציר-2 "כיסוי-מדף מלא"). כלי: `machtzev/generator/op-census.mjs` · פלט: `ops-map.json` (SSOT) + `ops-census-report.md` · שער: `opcensus` (commit · baseline grow).

## מה נבנה
מיפוי **דטרמיניסטי, מצורת-הדאטה בלבד** (§20-ד — אפס מילת-דומיין בחוקים) של כל אטום לפעולת-יסוד (op):
- **תצוגה:** שקעי-הבנאי של המחלקה (`this.X`, חתוך למחלקה עצמה בקובץ-רב-מחלקות) ⇒ 21 חוקי-צורה מסודרים (rows+labels⇒table · stages+records⇒board · value+fraction⇒ratio · message+tone⇒alert · onTap+label⇒action …). שקעי-סגנון (tone/glyph/…Color/…Radius) = ראיה-לצורה, לא דאטה. **אין שקע-דאטה ואין child ⇒ `zero` = מזייף אוטומטי** (§20-ג).
- **לוגיקה:** צורת-החתימה מ-`logic-census.json` (ret ⇒ predicate/measure/aggregate/format/collection/lines/summary/selection/temporal/effect/transform; דגלים ho/temporal/listIn). שם-הפונקציה אינו ראיה.
- **דאטה:** סוג-קובץ (terms/sockets/strings/table).

## מספרים (פלט-השער, 4.9)
`✓ opcensus: 1958 אטומים ⇒ 38 ops · 0 לא-ממופים · zero 44 (תצוגה בלבד)` — תצוגה 562 · לוגיקה 848 · דאטה 548.
אוצר-ops (top): data:strings 349 · format 209 · container 165 · transform 138 · collection 138 · summary 124 · action 115 · predicate 99 · data:terms 85 · data:sockets 74 · text 67 · measure 67 · zero 44 · group 42 · data:table 40 · lines 33 · stat 30 · aggregate 23 · field 20 · fact 14 · identity 9 · selection 9 …
ספוט-צ׳ק מול הזהב: DsTable⇒table · StatRow⇒ratio · BareStat/KpiTile⇒stat · TrendStat⇒trend · DsBoard⇒board · FilterChipPill⇒filter · DsSearch⇒field · SoftButton/DsNavTile⇒action · TimelineItem⇒timeline · AlertBanner@premium⇒alert · EmptyState@premium⇒empty · StatusChip@premium⇒fact · GlassCard@premium⇒panel · payBal⇒measure · roleOf/holidayOf⇒format · trendFromScan⇒summary.

## ממצא-אמת (L50 · שער `oracle`)
האורקל מפתח לפי **שם-מחלקה**: 557 קבצי-תצוגה, 535 באינדקס, **22 בלי אטום**, 8 שמות כפולים בין מדפים (`AlertBanner`·`GlassCard`·`EmptyState`·`StatusChip` — דווקא גרסאות-`premium/` ש-SchoolOS מייבא). `op-census` משלים אותם כ-`Class@dir` (8 אטומים נוספו); התיקון-השורשי (זהות = מחלקה+קובץ) ב-`census/atom-index.mjs` — חוב פתוח, רשום.

## מה לא אומת (D3)
- **דיוק-הסיווג לא נמדד מול אמת-ידנית מלאה** — רק ספוט-צ׳ק של ~30 אטומים מהזהב. `container` (165) = צורות-לא-מוכרות; `transform` (138) = ret dynamic — סיווג גס. שניהם יעודנו ב-G2/G3 כשה-ops יקבלו שקעים-נדרשים.
- החוקים הם צורה-על-שמות-שקעים (rows/labels/onTap…): שמות-props של Flutter/DS — מבניים, לא דומייניים, אבל עדיין רשימה בקוד. מבחן-הקונכייה: אטום חדש עם שמות-שקע אחרים יפול ל-`container`, לא יזויף.
- לא הורץ `flutter`/רנדר — G1 הוא סנסוס, לא חילול.

## אימות
`node machtzev/generator/op-census.mjs --gate` ✓ · `police --fast` ✅ 23 ran · 0 failed · מרשם 30 (שער חדש `opcensus` רשום ב-gates.tsv/police.mjs/INDEX.md) · `truth --write` · `pins --write`.

## הבא (G2 · shape-ops)
סוג-שדה בסכמת-האמת (`schema-fields.dart`, 1,968 שדות) ⇒ רשימת-ops נדרשים; שער: 9 ישויות-הזהב ⇒ ops ⊇ 60 החלקיקים הרשומים ב-`compose-engine`. נקודת-החיבור למחולל: `render-ds.mjs:1008 _candidates` / `renderCompose:1047` (7 ASPECTS קשיחים ⇒ ops מ-`ops-map.json`).
