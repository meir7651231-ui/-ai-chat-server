# ✅ CLOSED · GENMAX · G17a–c — צעד-3 כמנוע מלא: בורר-אטום-לפי-ייעוד + ספק-מטרה (6.9.2026)

> **הכרעה-25** (בעלים, 6.9): "3 חייב להיות מנוע מלא, ואחד ו-2 אתה רושם" — המטרה ופעולות-היסוד נכתבות ע"י אדם; מהחיפוש-והבחירה ועד האתר המנוע לבד. עד היום צעד 3 היה **הצהרת-עור ידנית** (`skin` בכל ספק). מהיום: `auto-skin.mjs`.

## G17a · אותות-צורה במניפסט (ds-forge)
כל אטום-forge נושא `sig` שנחצב מה-CSS/DOM של Pure בזמן החישול (אפס מילון):
- `root`: תג · `decorated` (רקע/גבול/צל) · `interactive` (button/a/role/tabindex/aria) · `dir` (row/column/block)
- `slots[i]`: `fs` (font-size px) · `fw` (weight) · `inBtn` (החריץ בתוך `<button>`/`<a>`)
- `numEmph` = גודל-החריץ-המספרי-המקסימלי / גודל-הטקסט-המקסימלי (KPI: 2.73 · כותרת-עם-ספרה: 0.59)
- `svg` · `input` (type · placeholder · readonly · numPh · datePh) · `series`/`fills` (סדרות-rect ומילויים ב-svg)
- אטום-מצבים (theater): האותות מצטברים מכל הזרועות.

## G17b · `auto-skin.mjs` — הבורר
לכל אחד מ-27 תפקידי-העור: **דרישה-קשה** (`fits`, זהה ל-`resolveSkin`) ⇒ **ניקוד-ייעוד** (`score`) מאותות-הצורה: חיובי = הצורה מגשימה את התפקיד, שלילי = עודף/קישוט/דאטה-שאין-לנו (§20-ג). שובר-שוויון: סדר-המשפחות של התפקיד ⇒ שם (דטרמיניסטי). `toneMap` נגזר מטוקני-`tone-*` של האטום הנבחר. פלט: `auto-skin.json` (מחויב) · שער `autoskin` (≡ טרי + L73). `skin-golden.json` ו-`app-golden*.json` — **בלי הצהרת-עור**; מפתח `skin` = דריסה.

### הבחירה של המנוע מול ההצהרה-הידנית (G12–G15)
| תפקיד | המנוע בחר | ההצהרה הקודמת | top-3 (ניקוד) |
|---|---|---|---|
| kpi | `ForgeStatPlain` | ≡ | ForgeStatPlain:6.46 · ForgeRadialGaugeStatus:-0.5800000000000001 · ForgeSummaryStatStrip:-1.2000000000000002 |
| hero | `ForgeStatPlain` | ≡ | ForgeStatPlain:6.46 · ForgeRadialGaugeStatus:-0.5800000000000001 · ForgeSummaryStatStrip:-1.2000000000000002 |
| stat | `ForgeStatPlain` | ≡ | ForgeStatPlain:6.46 · ForgeRadialGaugeStatus:-0.5800000000000001 · ForgeSummaryStatStrip:-1.2000000000000002 |
| navTile | `ForgeGridHubCard` | `ForgeHubTile` | ForgeGridHubCard:7 · ForgeHubTile:7 · ForgeContactTile:5 |
| empty | `ForgeAnimatedEmpty` | `—` | ForgeAnimatedEmpty:2 · ForgeSearchEmptyState:2 · Forge10Atoms:-1 |
| button | `ForgeToneButton` | ≡ | ForgeToneButton:12 · ForgeActionButton:0 · ForgeAddTradeButton:0 |
| statusChip | `ForgeStatusChip` | ≡ | ForgeStatusChip:13 · ForgeStatusDotChip:11 · ForgeTintedBadgeRow:11 |
| banner | `ForgeToneBanner` | ≡ | ForgeToneBanner:13 · ForgeStatusChip:12 · ForgeSeverityChip:11 |
| emptyState | `ForgeAnimatedEmpty` | `ForgeSearchEmptyState` | ForgeAnimatedEmpty:2 · ForgeSearchEmptyState:2 · Forge10Atoms:-1 |
| mediaRow | `ForgeContactTile` | ≡ | ForgeContactTile:6 · Forge6Atoms:3 · ForgeAccordionSectionCard:3 |
| section | `ForgeTitledSection` | ≡ | ForgeTitledSection:11.333333333333332 · ForgeProfileCardHeader:9 · ForgeProfileHeaderRow:9 |
| frame | `ForgeStripPanelFrame` | ≡ | ForgeStripPanelFrame:-8 · ForgeBrandListRow:-8 · ForgeDatePills:-8 |
| segmented | `ForgeSegPickerSelection` | `ForgeSegmentedPillToggleSelection` | ForgeSegPickerSelection:3 · ForgeSegmentedPillToggleSelection:3 · ForgeUnitSegmentToggleSelection:3 |
| chip | `ForgeFacetChip` | ≡ | ForgeFacetChip:7 · ForgeMustChip:5 · ForgeSegPickerSelection:5 |
| meter | `ForgeLinearProgressStatus` | ≡ | ForgeLinearProgressStatus:0 · ForgeMeter:0 · ForgeLinearProgress:-8 |
| glass | `ForgeStripPanelFrame` | `ForgeGlassCard` | ForgeStripPanelFrame:0 · ForgeFlatCard:-2 · ForgeGlassCard:-2 |
| timeline | `ForgeNotifRow` | ≡ | ForgeNotifRow:5 · ForgeAccordionPanel:2 · ForgeBubbleStates:0 |
| field | `ForgeDsField` | ≡ | ForgeDsField:0 · ForgeField:0 · ForgeFieldRow:0 |
| enumField | `ForgeDsEnumField` | ≡ | ForgeDsEnumField:7 · ForgePremiumField:2 · ForgeDsField:0 |
| numberField | `ForgeDsNumberField` | ≡ | ForgeDsNumberField:6 · ForgeGlowSlider:6 · ForgeDsField:0 |
| dateField | `ForgeDsDateFieldInput` | ≡ | ForgeDsDateFieldInput:7 · ForgeDsEnumField:1 · ForgePremiumField:1 |
| search | `ForgeDsSearch` | ≡ | ForgeDsSearch:8 · ForgeInputBar:8 · ForgeReplyComposer:8 |
| pageHeader | `ForgeCenteredPageHeader` | ≡ | ForgeCenteredPageHeader:4 · ForgeDetailHeader:4 · ForgeSmartProjectHero:4 |
| table | `ForgeDataGrid` | ≡ | ForgeDataGrid:8 |
| bars | `ForgeBarChart` | ≡ | ForgeBarChart:4 · ForgeStackedBarGroup:2 · ForgeWaveformBars:2 |
| board | `ForgeKanbanBoard` | ≡ | ForgeKanbanBoard:6 |
| calendar | `ForgeEventCalendar` | ≡ | ForgeEventCalendar:0 |

**22/27 זהה.** הפערים: תאומים-מבניים (GridHubCard≡HubTile · AnimatedEmpty≡SearchEmptyState · SegPicker≡SegmentedPill — אותו ניקוד) או עודף-חריץ שהמנוע מעניש בצדק (GlassCard נושא eyebrow "GLASS" ⇒ StripPanelFrame טהור יותר).

## מדדים (ship --no-commit)
analyze 0 · 156/156 · שערים retarget/skingolden/appgen ✓ · `autoskin` ✓ (27 תפקידים · 359 אטומים · toneMap 3) · הבית-הספר ו-3 האפליקציות נבנים מהבחירה-האוטומטית.

## G17c · ספק-מטרה — אדם כותב צעדים 1–2, המנוע ממשיך מצעד 3
**הפורמט** (`app-golden-4.json`, "Yeshiva"):
```json
{ "name": "Yeshiva", "goal": "…", "aliases": {"entity.student": "Member"},
  "modules": [ { "sentence": "בני משפחה לפי גיל", "goal": "לראות את מי-שנופל לפני שהוא נופל", "ops": ["איתור", "חריגה", "סיכון", "קשר-הורה"] }, … ] }
```
- **צעד 1 (אדם):** `goal` — לאפליקציה ולכל מודול. נרשם בכותרת-הקוד, לא משפיע על הבחירה (אין LLM).
- **צעד 2 (אדם):** `ops` — פעולות-היסוד. **אוצר-המילים = קטלוג-החלקיקים של הזהב** (`PARTICLE_NAMES`, 60 חלקיקים: איתור · חריגה · סיכון · יתרה · הוראת-קבע · ייצוא · גריד-שבועי · התנגשות · חסימה …) — לא מילון-מנוע. פעולה שאינה בקטלוג של המודול-שנבחר ⇒ שגיאה שמונה את הזמינות ("חיפוש-לפני-אין").
- **צעד 3+ (מנוע):** משפט ⇒ ישות ⇒ מודול-זהב לפי צורה ⇒ `particlesForOps` ⇒ **הרכבה-מינימלית** של החלקיקים האלה בלבד (`assemble(mode:'minimal')` — מצב-compose לא מצמצם כי `build` גורר הכל) ⇒ הסבה ⇒ עור-אוטומטי ⇒ רכזת ⇒ בדיקה מחוללת ⇒ אתר. קובץ-המודול מקבל תג `_p<hash>` (צמצום) + `_sk<hash>` (עור).
- **בדיקה מחוללת מודעת-צמצום:** בדיקת-העמודה-השמורה (G5h) נכתבת רק כשהמודול מרנדר טבלה — מודול שצומצם בלי "טבלה" לא נבחן עליה.

| מודול מצומצם | שורות | המודול המלא |
|---|---|---|
| `gen_retarget_donation_from_fee_p27d7fd_skeda887.dart` | 1342 | 1585 |
| `gen_retarget_member_from_stu_p515873_skeda887.dart` | 1214 | 1411 |
| `gen_retarget_room_from_rm_pb3f005_skeda887.dart` | 1164 | 1349 |
| `gen_retarget_teacher_from_stu_p09f962_skeda887.dart` | 760 | 1419 |

**מדדים (ship --no-commit):** analyze 0 · **165/165** (18 קבצי genesis_*, +9 של Yeshiva) · שערים ✓ · 4 אפליקציות (Kehila 6 · Studio 6 · Tzedaka 7 · Yeshiva 4) · 23 מודולים · 16 ישויות.

## מה נשאר
- **G16 (בעלים):** מגמת-KPI (היסטוריה) · policy-config.
- **הבא במנוע:** חלקיקים חוצי-מודולים בספק (מודול אחד שמרכיב חלקיקים משני מודולי-זהב — G4b קיים במנוע, חסר בספק) · מנוע-הלוגיקה בבחירה-לפי-ייעוד (היום הלוגיקה באה עם החלקיק; בחירה בין מנועי-maor שקולים לפי צורת-חתימה = המדרגה הבאה של §20-א).
