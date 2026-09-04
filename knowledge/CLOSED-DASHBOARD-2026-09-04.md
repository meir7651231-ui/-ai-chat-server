# 📊 סגירה · לוח-הנהלה מלא (SchoolOS · DASHBOARD) — 4.9.2026

> **המפרט (SSOT):** `knowledge/SPEC-DASHBOARD-FULL-2026-09-04.md` · **הקובץ:** `new/dart-gen-bs/schoolos_dashboard.dart` (מחלקה ציבורית `DashboardScreen`, 1,126 שורות) ·
> מראה: `buildsmart/app_flutter/lib/genesis/dart-gen-bs/` · בדיקת-widget: `buildsmart/app_flutter/test/genesis_dashboard_test.dart` (8 תרחישים) ·
> כרטיס-מטרה חתום + רנדר-אמת: `machtzev/audit/goals/schoolos_dashboard.{json,png}`.
> **גבול-חרוט שנשמר:** הלוח = נגזרת-טהורה. `DashInput` = חוזה-קלט (8 מודולים כשקעים) · אפס-כתיבה למודולים (רק state של הלוח: בוצע/נדחה/הואצל/הצמדה/יעדים/כללים/אודיט) · אפס-ייבוא של מסכי-מודולים · `today` מוזרק (אפס `Date.now`).

## הדרך (איך נבנה)
1. **מטרה:** *"תוך 30 שניות המנהל/ת יודע/ת: מה דורש-החלטה היום · מה בסיכון · מה מגמתי · מה הפעולה-הראשונה."*
2. **7 פעולות-יסוד:** איסוף · הערכה · דירוג · איתור · הכרעה+ביצוע · מגמה+תחזית · אימות+תדרוך.
3. **חיפוש-מלא (מאור 1,324 + בנייה-חכמה 557 + `new/dart` 281 + האורקל 1,402):** 164 מנועי-לוגיקה מועמדים נסרקו לפי אוצר-המילים של הלוח (dashboard/ops/portfolio/intel/teamIntel/cockpit/sla/goal/trend/holiday…), 90+ אטומי-תצוגה נקראו בחתימה. הכי-טוב-לייעוד בשתי-השכבות.
4. **הרכבה:** 28 מנועי-מאור ⊕ 1 מנוע-בנייה-חכמה (`band`) ⊕ 18 אטומי-תצוגה — כל חלקיק-תובנה = כמה אטומים; עובדה = BareStat/StatusChip.
5. **חיווט-בשקעים:** `DashInput{today, modules[], schoolHolidays, goals, lastYear, grades, staff}` · `onOpenModule(route)` = שקע-drill-down (הפעולה מבוצעת במודול-המקור).
6. **אימות-רנדר (Chromium headless · 800px · 13 צילומים · פונט-אימוג׳י מקומי במקום CDN חסום):** תפס **8 תיקונים שהקומפילציה פספסה** — ראה §אימות.
7. **באג → שורש:** State לא הגיב להחלפת-שקע-קלט (⇒ `didUpdateWidget`) — נתפס בבדיקת-widget.

## חיבור-מודלים בהחלטה (23-ד)
- **דחיפות** = `band(השפעה×(1+ותק/SLA))` ∨ **SLA-פרוץ** (`taskOverdue` ∨ ותק>SLA ⇒ 🔴) ∨ **חומרת-המודול** (`due`⇒🔴 · `risk`⇒≥🟠). השפעה = תלמידים + ₪/500 (שני-האותות יחד).
- **התנגשויות-מערכת** = חוגים + חדרים (סכום, לא בחירה) · **פניות-פתוחות** = הורים + תלמידים.
- **יום-חופש** = לוח-עברי (`holidayOf⊕hebParts⊕HOLIDAYS`) ∨ לוח-המוסד (`schoolHolidays`).
- **יעד-בסיכון** = תחזית-90 (שיפוע-מחצית מ-`trendFromScan`) מול יעד; **חריגה-סטטיסטית** = |x−ממוצע|>1.5σ (`grandTotal`+`dart:math`).

## בנוי-מול-יעד (כנה)
| סעיף-מפרט | פריטים | ✅ | מקום-שמור | ❌ | הרכבה |
|---|---|---|---|---|---|
| 5 אזורים | 5 | 5 | 0 | 0 | SegmentedSwitch(מבט·טווח·טאבים) ⊕ DsSearch ⊕ SoftButton ⊕ GradientCard ⊕ DsSection ⊕ GlassCard-sheet |
| KPI-12 | 12 | 12 | 0 | 0 | חוזה-`kpiDefs` ⊕ BareStat×12 ⊕ StatHero ⊕ StatRow(cockpitProgress); מודול-לא-חי ⇒ '—' |
| תור · 12 עמודות | 12 | 12 | 0 | 0 | חוזה-`columnDefs` ⊕ DsTable · טריאז׳ DsSection×4 ⊕ MediaRow ⊕ StatusChip (+3 עמודות-שמורות: שכבה·הוקצה-ע״י·הוסלם-ל) |
| שדות-מתקדמים | 9 | 6 | 3 (benchmark · דוח-למשרד · תקציב-מול-ביצוע) | 0 | כללים+SLA (sheet עריך) · יעדים (StatRow) · שנה-שעברה (BareStat×3) · שכבות (NeonBars⊕z) · תחזית 30/90 |
| כפתורי-פעולה | 12 | 12 | (PDF · דוח-למשרד = תת-פריטים שמורים) | 0 | בצע(drill) · דחה(3 סיבות) · האצל(staff) · בוצע · שלח-תדרוך(bulkMailRecipients⊕cockpitWorkListText) · דוחות(3) · CSV(toCsv) · יעד± · כללים · פתח-מודול · הצמד · הדפס |
| פילטרים/חיפוש | 9 | 9 | 0 | 0 | finderMatches (6 צירים · AND) ⊕ FilterChipPill ⊕ countBy(מונים) · smartFilter⊕smartScore⊕normSearch · dateInRange |
| פאנל משימה-נבחרת | 7 | 7 | 0 | 0 | MediaRow ⊕ BareStat×4 ⊕ StatusChip(הקשר) ⊕ AlertBanner(השפעה-אם-לא) ⊕ SoftButton ⊕ TimelineItem(היסטוריה) |
| טאבים | 9 | 9 | 0 | 0 | תדרוך · KPI · מגמות(TrendStat⊕NeonBars-פער-מיעד) · השוואות · יעדים · דוחות · התרעות · ועד · אודיט |
| מצבים-מיוחדים | 9 | 9 | 0 | 0 | יום-חופש · 🎉 · אזעקה(≥3🔴) · נתון-לא-זמין(StatusChip) · טעינה(CircularProgressIndicator) · שגיאה-במודול(AlertBanner, הלוח ממשיך) · יעד-חריג · SLA-פרוץ · תקופה-ללא-דאטה(EmptyState) |
| הרשאות | 5 | 5 | 0 | 0 | roleOf⊕canGrantedAction · ועד = מונים-בלבד (אפס שמות) · כספים = גבייה-בלבד |
| אוטומציות | 9 | 6 | 3 (תדרוך-05:00 · דוח-חודשי-אוטו · אמנת-סמכות — כולן שקע-מתזמן/הכרעת-בעלים; הטקסט/הנמענים מוכנים) | 0 | דירוג-דינמי · SLA⇒העלאה · קפיצת-מגמה(weeklyPct) · יעד-בסיכון · חריגת-שכבות · ניקוי-בוצע-במודול · סנכרון-לוח(upcomingHolidays) |
| אינטגרציות | 8 | 8 | 0 | 0 | כל מודול = Map בחוזה; כל משימה נושאת `link` חזרה למודול |
| **סה״כ** | **106** | **99** | **7** | **0** | |

## מקור-האמת של האטומים
- **לוגיקה (dart-maor, 28):** cockpitQueue · cockpitProgress · cockpitWorkListText · cockpitCsvRows · dayDiff · taskOverdue · trendFromScan · dateInRange · rangeLabel · fmtDate · countBy · grandTotal · shekel · smartFilter · smartScore · normSearch · finderMatches · toCsv · csvEscape · exportAllowed · roleOf · canGrantedAction · bulkMailRecipients · normEmail · holidayOf · hebParts · HOLIDAYS · upcomingHolidays.
- **לוגיקה (dart · בנייה-חכמה, 1):** band.
- **תצוגה (dart-ui-bs, 18):** DsScaffold/DsSection · DsSearch · DsTable · BareStat · StatHero · GradientCard · GlassCard · MediaRow · StatRow · TimelineItem · NeonBars · TrendStat · SegmentedSwitch · SoftButton · AlertBanner · StatusChip · EmptyState · FilterChipPill.
- **מזייפים שנדחו (§20-ג):** StatBlock · linear_progress · radial_gauge · bar_chart · sparkline · DataGrid · timeline_flow · ShimmerSkeleton — אפס שימוש (שער no-fakers ירוק).
- **מנועים שנסרקו ונדחו כלא-מתאימים-לייעוד:** forecastFromScan (קדנציית-תרומות, לא סדרת-אחוזים) · portfolioIntel/tierTrendCounts (RFM-תורמים) · digestLines (מונחי-BuildSmart) · scheduleTasks (CPM) · isoDaysAgo (Date.now — אסור במנוע).

## הכרעות-אמת (§20-ג · מה לא בנוי ולמה)
- **7 מקומות-שמורים** (חוק-7, `_DashData.reserved` + טבלה למעלה): benchmark · דוח-למשרד · תקציב-מול-ביצוע · אמנת-סמכות · PDF · תדרוך-05:00 · דוח-חודשי-אוטו — כולם ללא מקור-אמת/שקע-שרת; מאירים כשיגיע נתון/מתזמן.
- **דמו-דאטה:** רק שדות שמופיעים בשורת-KPI של כל מפרט-מודול (SPEC-<M>-FULL §KPI) · מלאי: 3 דורשי-הזמנה = `_InvData.sev` על פעילים (schoolos.dart). שני מודולים-מדגימים (ספרייה לא-מופעל · הסעות בשגיאה) מציגים את מצבי "נתון-לא-זמין"/"שגיאה-במודול-אחד".
- **חיפוש-חוצה:** מחפש בכל משימות-המודולים (חוצה-מודולים); חיפוש ברשומות-גולמיות (תלמיד/חשבונית) = שקע-חיפוש של כל מודול (שמור).

## אימות
- `flutter analyze --no-fatal-infos lib/genesis` — **0 errors** · `flutter test test/genesis_dashboard_test.dart` — **8/8 ירוק** (KPI/תור · פאנל+בוצע · איתור+חריגה · יום-חופש(ר״ה 12.9.2026 מהלוח-העברי)+ועד+טעינה · 5 טאבים · דחה/האצל/אודיט · כללים/טבלה/CSV · כספים/שבוע/🎉).
- `police --fast` ירוק · pre-push **משטרה מלאה ירוקה (29/29)** · שער goal-proof ירוק (כרטיס+תמונה).
- **רנדר-אמת (Chromium · 13 צילומים):** תפס 8 תיקונים — (1) תווית-טווח "04/09–04/09" ⇒ "היום" · (2) צ׳יפי-סוג באנגלית ⇒ `kindLabels` · (3) פס-9-טאבים חתוך ⇒ ללא אימוג׳י, נכנס ב-800px · (4) `→`/`⇒`/`↓` חסרים בפונט ⇒ מפרידים-טקסט · (5) NeonBars על אחוזים 90–94 מנורמל-למקסימום = שטוח ⇒ **פער-מיעד פר-חודש** (החלטה, לא צורה) · (6) hero-ועד הראה 0 מול "16 משימות" ⇒ מבט-סיכום רואה מונים של הכל · (7) תוויות-חודש "ח׳-N" ⇒ "לפני N ח׳/החודש" · (8) צ׳יפ-סינון "בוצע" התנגש עם כפתור-השורה ⇒ "בוצעו".
- **מה לא אומת:** שליחת-מייל בפועל (שקע-שרת) · drill-down אמיתי בין מסכים (המנהל מחבר ניווט) · הורדת-CSV בדפדפן (סנדבוקס חוסם; מוצג SelectableText) · חץ-המגמה בתוך TrendStat (אטום-מדף; בסנדבוקס בלי פונט-חצים).
