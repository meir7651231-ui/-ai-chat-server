# 🗓️ סגירה · מודול-נוכחות (SchoolOS · ATTENDANCE) — 4.9.2026

> **מפרט (SSOT):** `knowledge/SPEC-ATTENDANCE-FULL-2026-09-04.md` · **מגילת-הסשן:** `SCHOOLOS-ORCHESTRATION-2026-09-04.md`.
> נבנה **בדרך** (THE-WAY · הכרעה 23-ב/ג/ד) — 8 גלים ב-5 נחיתות (1 · 2-3 · 4-5 · 6-7 · 8), כל אחת: בנייה→analyze→רנדר-Playwright→
> כרטיס-מטרה→משטרה→commit→push בשני הריפו. **קובץ יחיד:** `new/dart-gen-bs/schoolos_attendance.dart` (1272 שורות) ·
> מחלקה ציבורית `AttendanceScreen` (const, ללא main) · מראה ב-buildsmart `app_flutter/lib/genesis/dart-gen-bs/` (cmp זהה) ·
> בדיקת-widget `app_flutter/test/genesis_attendance_test.dart` (5/5 ירוק — כולל גל 8ב: תפקיד-הורה + מצב-שגיאה, הכוונת-מנהל).

## הדרך (איך — לא מה)
1. **מטרה:** *"לדעת מי נוכח ומי לא — עכשיו/היום/החודש — ולפעול לפני שהיעדרות הופכת לנשירה."* **מודל-הפוך:** רושמים רק
   חיסורים (ברירת-מחדל נוכח) · אידמפוטנטי (מפתח `date|lesson|student`; אותו-מצב-פעמיים ⇒ חסום ומדווח).
2. **פעולות-יסוד (7):** איתור · רישום · הערכת-מצב · זיהוי-חריגה · הכרעה · ביצוע · אימות.
3. **חיפוש-מלא לפני בחירה:** מאור (1325 מנועים · `presents`/`absences[{date,reason,makeup,makeupDate,noshow}]` מ-
   `pending-makeups.contract.md`/`enroll-summary.contract.md`) + בנייה-חכמה (`AttendanceDay.inTs`/`AttendanceEntry.timeIn` ⇒
   `arrival`) + האורקל `atom-index-full.json` (1402). **31 מנועי-מדף + 23 אטומי-תצוגה + 2 אטומי-דאטה** מחווטים.
4. **הרכבה:** כל תובנה = כמה אטומים (למשל ציון-סיכון = `riskParts`(4 אותות) ⊕ `patterns`(countBy) ⊕ StatRow ⊕ StatusChip×2 ⊕ TrendStat).
5. **חיווט דרך שקעים:** today/now מוזרקים (`_Placement`; `grep -c "DateTime.now()"` ⇒ **0**) · זהויות (6 תפקידים, קשרי-הורים) = בלוק-הצבה (חוק-6).
6. **אימות-מול-המטרה ברנדר:** `flutter build web --no-web-resources-cdn` + Playwright (800×2000–2600) · 12 צילומים (מסך·פאנל·טבלה·
   4 טאבים·רכז+פילטר·אוטומציות·אודיט) · בדיקת-widget 800×4000 (3 מבחנים · pump מפורש).
7. **באג → שורש:** ראה "מה הרנדר תפס".

## בנוי-מול-יעד (כנה · לפי סעיפי-המפרט) — ✅ 109 · מקום-שמור 14 · ❌ 0 · סה״כ 123
| סעיף-מפרט | יעד | ✅ | מקום-שמור | הערות-אמת |
|---|---|---|---|---|
| 5 אזורים | 5 | 5 | 0 | פס-עליון (תאריך·כיתה·חיפוש·כולם-נוכחים·נעילה) · KPI · גיליון · פאנל · טאבים |
| KPI עליון | 10 | 10 | 0 | כולם ספירה/יחס על היומן (BareStat×10 + StatHero + ProgressRing); אפס StatBlock |
| עמודות-גיליון | 16 | 15 | 1 | `columnDefs` (חוזה-דאטה, DsTable); **תמונה** = שקע `photo` |
| שדות-מתקדמים | 11 | 9 | 2 | **אישור-רפואי-קובץ** (`medicalDoc`) · **נוכחות-מקוונת** (`online`) = שקעים; מורה-מחליף = תפקיד+היקף מוזרק |
| כפתורי-פעולה | 16 | 13 | 3 | **צרף-אישור** (שקע-קובץ) · **PDF** · **הדפס** = שקעים (CSV אמיתי: toCsv⊕csvEscape) |
| פילטרים/חיפוש | 12 | 12 | 0 | DsSearch⊕smartFilter⊕smartScore⊕normSearch · FilterChipPill×11⊕finderMatches · תאריך/טווח (dateInRange) · מורה = דרך כיתה (1:1) |
| פאנל תלמיד-נבחר | 9 | 9 | 0 | AvatarTile · פר-שיעור · StatusDot×30 · NeonBars(countBy) · TrendStat⊕StatRow · pendingMakeups · metaFields · הערות · פעולות |
| טאבים | 8 | 8 | 0 | היום · חודש (DsCalendar תפר-אמת) · היסטוריה · השלמות · סיבות · הורים · בסיכון · אודיט |
| מצבים-מיוחדים | 9 | 9 | 0 | אין-שיעור · חג (holidayOf⊕hebParts) · כיתה-ריקה · טעינה · שגיאה (שקע `_error`) · יום-נעול (ידני+אוטו) · לא-פעיל · רישום-כפול · לא-נרשם |
| הרשאות | 6 | 6 | 0 | roleOf⊕canGrantedAction: מורה(כיתותיו·היום±1) · מחליף(היום) · רכז(אחורה·מוצדק·פתיחה) · הנהלה(admin) · הורה(ילדו·אישור) · צפייה |
| אוטומציות-חכמות | 10 | 10 | 0 | רצף · ניבוי-נשירה(דפוס יום/שיעור/אחרי-חופשה) · הודעה-אוטו+חלון-תגובה · הצעת-השלמה · תזכורת · דוח-שבועי · סף-רגולטורי · נעילה-אוטו · חיסור-קבוצתי · סנכרון-לוח (upcomingHolidays) |
| אינטגרציות | 6 | 3 | 3 | ✅ יומן/לוח · מורים (זהות-רושם, מחליף) · חוגים (מערכת-שיעורים פנימית) · שקעים: **תלמידים** (`riskExternal`) · **הורים** (`notifySink`) · **לוח-הנהלה** (`dashboardCounters`) |
| מקומות-שמורים | 5 | 0 | 5 | אישור-רפואי · מקוון · הסעה · ביומטרי/כרטיס · GPS — כולם שקעים מוצהרים ב-`reservedSockets` (14 סה״כ כולל `loader`, מוצגים בטאב-אודיט) |

**§20-ג · מה לא זויף:** אין ערך מומצא לשום שדה חסר-מקור. שקע ריק ⇒ העמודה/הכפתור שקטים או מדווחים "לא-מחובר בהצבה".
`riskExternal` כשיוזרק ⇒ `max(פנימי, חיצוני)` (חיבור-מודלים בהחלטה, 23-ד).

## מקור-האמת של האטומים
- **לוגיקה (dart-maor, 31):** presentsInMonth · sheetSummary · sheetRoster · pendingMakeups · makeupEligibility · enrollSummary · countBy ·
  grandTotal · clampScale · dayDiff · dateInRange · smartFilter · smartScore · normSearch · finderMatches · toCsv · csvEscape · exportAllowed ·
  guardExport · roleOf · canGrantedAction · trendFromScan · fmtDate · monthKey · dayNames · timeToMin · holidayOf · upcomingHolidays · HOLIDAYS ·
  hebParts · absenceReasonChips. **דאטה (dart-data-maor, 2):** holiday-of-terms · absence-reason-chips-terms.
- **תצוגה (dart-ui-bs, 23):** DsScaffold/DsSection · BareStat · GradientCard · GlassCard · StatHero · SegmentedSwitch · SoftButton · AlertBanner ·
  StatusChip · StatusDot · EmptyState · MediaRow · AvatarTile · StatRow · TimelineItem · ProgressRing · NeonBars · TrendStat · DsTable ·
  DsEnumField · DsSearch · DsCalendar · FilterChipPill.
- **מזייפים שלא נכנסו:** StatBlock · DataGrid · timeline_flow · ShimmerSkeleton · linear_progress · sparkline · bar_chart · DatePills/MiniCalendar (דקורטיביים).
- **הרכבות-מנוע חדשות (לא אטום-יחיד):** `_scanHebYear` (has30 נגזר מ-hebParts, לא מנוחש) · `streak` (absentDay⊕dayDiff) · `risk` (4 אותות) ·
  `patterns` (countBy×3) · `groupAbsences` · `enrollmentOf` (מיפוי המודל-ההפוך לצורת-מאור ⇒ מנועי-המדף עובדים כמו-שהם).

## מה הרנדר/הבדיקה תפסו (THE-WAY §6 — הקומפילציה פספסה)
1. **תווית-מגמה הפוכה:** TrendStat קיבל `-pct` והתווית אמרה "↓=פחות" בעוד ↓ = מחמיר ⇒ תוקן.
2. **הרכבת-יתר:** EmptyState-ענק לרשימת-השלמות ריקה בפאנל ⇒ StatusChip (עובדה).
3. **גלישת-Row:** בורר-השיעורים (5 שיעורים) גלש ב-800px בפונט-רחב (=מובייל) ⇒ SingleChildScrollView.
4. **טאפ מחוץ-למסך בבדיקה:** פס-הטאבים (reverse) — תוקן בבדיקה עם ensureVisible (לא באג-מסך).
5. **CanvasKit מ-CDN חסום בסנדבוקס** ⇒ `--no-web-resources-cdn` (סביבה, לא קוד).
6. **דליפת-פרטיות להורה (גל 8ב · צילום תפקיד-הורה):** באנרי-האוטומציות (סף · השלמות · רצף) הציגו שמות ילדים-אחרים ⇒ היקף-ילד
   גם בהתרעות; הבדיקה אוכפת `textContaining` על 6 שמות-אחרים ⇒ findsNothing.

## אימות (בייטים)
- `flutter analyze --no-fatal-infos lib/genesis/dart-gen-bs/schoolos_attendance.dart` ⇒ **No issues found** (כל גל).
- `flutter test test/genesis_attendance_test.dart` ⇒ **+5: All tests passed** (KPI-10 · טאפ-מחזורי 3 מעברים · טעינה · צפייה-בלבד · מחליף
  היום-בלבד/יום-נעול/שבת · אודיט מגודר · 14 שקעים · טריאז' · finderMatches) · **גל 8ב:** תפקיד-הורה (ילדו בלבד · 8 פעולות-מוגנות לא קיימות ב-finders · אודיט מגודר ·
  תור-הורים 7 הודעות ⇒ אישור-חיסור ⇒ 6) · מצב-שגיאה (שקע `loader` נכשל ⇒ AlertBanner עם השגיאה האמיתית, התוכן מוחלף ⇒ loader מצליח ⇒ מתנקה).
- `node machtzev/police.mjs --fast` ⇒ ירוק 22/0 בכל commit · pre-push משטרה-מלאה 29/0 · goal-proof חתום (כרטיס+PNG לכל נחיתה).
- KPI-סניטי מהיומן: 11 פעילים · חסר-היום 1 (רון, רצף 4) · מאחר 1 (ליאור 08:14 ⇒ +14׳) · לא-מוצדקים-החודש 6 · ללא-אישור 9 · השלמות 2 ·
  ימי-לימודים בספטמבר 22 (חגים: 11–14/9 · 21/9 · 26/9 · 2–3/10 מ-hebParts⊕holidayOf).

## מה **לא** אומת (D3 · אמור-מה-לא-בדקת)
- שליחה אמיתית להורה/PDF/מדפסת/Firestore-אודיט — שקעים, לא מחוברים בהצבה.
- רנדר ברוחב-מובייל (390px) לא צולם (רק 800px + פונט-רחב בבדיקה).
- ~~תפקיד-הורה ומצב-שגיאה נבדקו בקוד, לא ברנדר~~ ⇒ **נסגר (גל 8ב):** שניהם מאומתים דטרמיניסטית בבדיקת-widget + צילום-Playwright של תפקיד-הורה.
  הדרך לשגיאה = שקע-אמת `AttendanceScreen(loader:)` (חוק-7: null ⇒ הדגמה, מוזרק ⇒ fetch אמיתי) — לא סימולציה בתוך המסך.
- אימוג׳י בצילומי-הסנדבוקס מוצגים כריבועים (אין פונט-אימוג׳י בכרומיום-headless) — סביבה, זהה למלאי.
- `DsCalendar` (אטום-מדף) מעגן לחודש-המכונה (`DateTime.now()` בתוך האטום, לא במנוע-שלי) — בספטמבר-2026 זהה ל-today המוזרק.

## חוב פתוח (ללא ❌)
- המנהל מחבר: ניווט-ביתי · `dashboardCounters` · `riskExternal` ממודול-תלמידים · מערכת-שיעורים ממודול-חוגים (כרגע `lessonsByDow` פנימי).
