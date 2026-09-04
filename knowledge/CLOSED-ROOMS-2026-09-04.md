# 🏫 סגירה · מסך-חדרים ויומן-מרחבים (SchoolOS · ROOMS) — 4.9.2026

> **מפרט (SSOT):** `knowledge/SPEC-ROOMS-FULL-2026-09-04.md` · **מגילת-הסשן:** `knowledge/SCHOOLOS-ORCHESTRATION-2026-09-04.md`.
> נבנה **בדרך** (THE-WAY · הכרעה 23-ב/ג/ד) — 8 גלים, כל אחד: בנייה → analyze (אפס-errors) → רנדר-אמת → משטרה ירוקה → commit+push בשני הריפו.
> קובץ יחיד: `new/dart-gen-bs/schoolos_rooms.dart` · מחלקה ציבורית `RoomsScreen` (const, ללא main) · מראה ל-buildsmart `app_flutter/lib/genesis/dart-gen-bs/` · בדיקת-widget `app_flutter/test/genesis_rooms_test.dart` (7 בדיקות).

## הדרך (איך נבנה)
1. **מטרה (ליבה):** *"שכל מרחב ינוצל נכון — אף חדר לא כפול-תפוס, אף שיעור לא בלי-חדר, אף ציוד לא נעלם — ורואים את השבוע של הבניין במבט-אחד."*
2. **6 פעולות-יסוד:** איתור (חדר/משבצת) · הערכת-מצב (תפוס-עכשיו · ניצולת) · זיהוי-חריגה (כפל-תפיסה · תקלה · חסימה · לא-מנוצל · ציוד-חסר) · הכרעה (חדר-חלופי · אישור) · ביצוע (הזמן · העבר · בטל · תקלה · חסימה) · אימות (היסטוריה · אודיט · ייצוא).
3. **חיפוש-מלא לפני בחירה** — מאור (`new/dart-maor`) **וגם** בנייה-חכמה (`new/dart`) **וגם** האורקל (`atom-index-full.json`, 1402). הממצא המכריע: **למאור יומן-חדרים שלם** (`diary/lib.ts` ⇒ `buildSlots` · `roomsNow` · `weeklyRoomSessions` · `blockReason` · `inactiveRoomCourses` · `roomInfoLabel`) — כל "אין" שנבדק התבדה.
4. **הרכבה תמיד** — כל חלקיק-תובנה = כמה אטומים (תצוגה⊕לוגיקה); עובדה = אטום-יחיד (BareStat/StatusChip).
5. **חיווט בשקעים** — `today`/`now` מוזרקים (אפס `Date.now`/`DateTime.now` במנוע) · זהות = `roleDefs` (חוק-6) · צבע = פיגמנט מוזרק.
6. **אימות-מול-המטרה ברנדר** — build-web + Playwright-core על Chromium מקומי (ממתין להסרת-splash = פריים-ראשון) + 6 בדיקות-widget ב-buildsmart (800×2400, pump מפורש). הרנדר/הבדיקות תפסו 4 באגים שהקומפילציה פספסה (ראה §אימות).
7. **באג → שורש בבייטים** (אודיט לפי `roomId` ולא לפי שם · בורר-יום גולש ⇒ `dayLetters` · טאבים/תפקידים מחוץ-למסך ⇒ גלילה).

## 8 הגלים
| # | יכולת | הרכבה (הכי-טוב-לייעוד, מהמדף) | שכבות |
|---|---|---|---|
| 1 | דאטה-אמת + KPI-10 | `roomsNow`⊕`weeklyRoomSessions`⊕`buildSlots`⊕`blockReason`⊕`inactiveRoomCourses`⊕`countBy` · `StatHero`⊕`BareStat`×10 (אפס-StatBlock) | תצוגה+לוגיקה |
| 2 | יומן יום/שבוע/רשימה | `SegmentedSwitch`(יום, `dayLetters`) ⊕ `buildSlots`(פר-חדר) ⊕ `TintedTag`×רשת ⊕ `conflictsOf`(⚠) · שבוע = `dayCell`×6 (`startOfWeekSunday`⊕`isoLocal`) · `DsTable` מונחה-`columnDefs` | תצוגה+לוגיקה |
| 3 | פאנל-חדר + 8 טאבים + 14 פעולות | `GlassCard`⊕`MediaRow`⊕`roomInfoLabel`⊕`BareStat`×4⊕`StatRow`⊕`SegmentedSwitch`(8)⊕`TimelineItem`⊕`StatusChip`⊕`SoftButton`⊕`DsField` · חדר-חלופי = `altRooms` (קיבולת⊕ציוד⊕פנוי⊕קרבה) | תצוגה+לוגיקה+state |
| 4 | איתור + חריגה (11 צירים) | `DsSearch`⊕`smartFilter`⊕`smartScore`⊕`normSearch` · `FilterChipPill`⊕`finderMatches` (AND) | תצוגה+לוגיקה |
| 5 | 6 תפקידים + 10 מצבים | `roleOf`⊕`canGrantedAction` (admin/teacher/staff+features) · `AlertBanner`/`EmptyState`/`CircularProgressIndicator` | תצוגה+לוגיקה |
| 6 | 9 אוטומציות | `conflictsOf`⊕`altRooms`⊕`autoRelocate`⊕`notifyUsers` · `upcomingHolidays`⊕`HOLIDAYS`⊕`hebParts` · `dayDiff` · `autoApprove` · `NeonBars`(ניצולת-להנהלה, ערכי-אמת) | לוגיקה+תצוגה |
| 7 | מקום-שמור + ייצוא | `reservedFields`/`columnDefs` (חוזה-דאטה) · `toCsv`⊕`csvEscape`⊕`exportAllowed`⊕`guardExport` · `buildIcs`⊕`icsEscape`⊕`foldIcsLine` | חוזה-דאטה+לוגיקה |
| 8 | בדיקת-widget + דוח-סגירה | 7 בדיקות (KPI · גריד/שבוע/רשימה · איתור+סינון · מרכז-פעולה+תפקידים · ייצוא+מקום-שמור · פאנל+אודיט · **תקלה⇒העבר-אוטו**) | אימות |

## 🔴 דאטה-אמת (§20-ג · אפס-זיוף) — מקורות-השדות
| ישות | שדות | מקור file:line |
|---|---|---|
| Room | id·name·active·slot·cap·location·from·to·access·notes·eq{k:bool} | מאור `schema-fields.dart:928-996` |
| Course (תפיסה-חוזרת) | id·name·teacherId·roomId·start·end·sessions[{day,time}]·maxStudents·cat | מאור `:364-594` |
| OrgEvent (תפיסה חד-פעמית) | id·title·date·time·type·roomId·priority·done·notes | מאור `:1000-1074` |
| סטטוס-אישור-הזמנה | proposed(ממתין) · pending(מאושר) · rejected · cancelled | בנייה-חכמה `state/tasks_engine.dart:74` (TaskItem.status) |
| Fault (תקלה) | id·name·detail·status·severity(חמור/בינוני/קל)·createdBy·days | בנייה-חכמה `state/tasks_engine.dart:70-112` + `defects_sheet.dart:57` (kind='defect') |
| קלט-תכנון | needsEq (ציוד-נדרש-לשיעור) · utilFloor=30% · checkEveryDays=180 · policy (rooms.autoApprove) | כמו target/rate/lead במלאי — לא נגזרת-מזויפת |
| **ללא-מקור ⇒ מקום-שמור** | type · owner · lastCheck · updatedAt · features · eqStock · photo · floorMap · sensor · smartLock | חוזה `reservedFields`/`columnDefs` — מאיר כשיגיע נתון, אפס-שינוי-קוד |

## טבלת בנוי-מול-מפרט (כנה) — **תואם 100/116 · מקום-שמור 16 · ❌ 0**
| סעיף-מפרט | פריטים | ✅ | מקום-שמור | ❌ | הערות |
|---|---|---|---|---|---|
| 5 אזורים | 5 | 5 | 0 | 0 | פס-עליון (יום/שבוע · בניין · חיפוש · הזמן · תקלה) · KPI · יומן/רשימה · פאנל · טאבים |
| KPI עליון | 10 | 10 | 0 | 0 | כולם מנועי-מדף/שדות-אמת; hero = התנגשויות (המטרה: 0) |
| עמודות-רשימה | 16 | 12 | 4 | 0 | סוג · אחראי · תאריך-בדיקה · עדכון = שקעי-`columnDefs` (שקטים בלי נתון) |
| שדות-מתקדמים | 12 | 6 | 6 | 0 | ✅ שעות · חוקי-חסימה · מדיניות · חוזרת · חד-פעמית · קישור-לחוג/אירוע · מ"ש: ציוד-מפורט-כמות(eqStock⇐מלאי) · תכונות(חלונות/הצללה) · תמונה · מפה · חיישנים · נעילה-חכמה |
| כפתורי-פעולה | 14 | 14 | 0 | 0 | הודעה = תיבת-יוצא (ערוץ-שליחה = שקע-הצבה) · הדפסה = תצוגת-הדפסה (מדפסת = שקע-פלטפורמה) |
| פילטרים/חיפוש | 11 | 10 | 1 | 0 | סוג = צ׳יפים מאירים כשחדר נושא `type` |
| פאנל חדר-נבחר | 9 | 8 | 1 | 0 | ניצולת ✅ (StatRow+%) · **מגמה** = מ"ש (דורש היסטוריית-שבועות) |
| טאבים פנימיים | 8 | 8 | 0 | 0 | היום · שבוע · תפיסות · ציוד · תקלות · אחזקה · היסטוריה · אודיט |
| מצבים-מיוחדים | 10 | 9 | 1 | 0 | שגיאה = מצב-שמור (`_error`, מאיר כש-fetch נכשל) |
| הרשאות | 6 | 6 | 0 | 0 | roleOf⊕canGrantedAction · 6 זהויות-דמו מוזרקות |
| אוטומציות | 9 | 8 | 1 | 0 | תזכורת-בדיקה-תקופתית: המנוע (`checkDue`=dayDiff>180) בנוי; הדאטה (lastCheck) = מ"ש ⇒ "אין נתון ל-7 חדרים" |
| אינטגרציות | 6 | 4 | 2 | 0 | ✅ חוגים · מורים · לוח-מוסדי(חגים) · אחזקה(defects) · מ"ש: מלאי(eqStock) · לוח-הנהלה (המנהל מחבר ניווט/חלקיקים) |
| **סה"כ** | **116** | **100** | **16** | **0** | |

## מקור-האמת של האטומים
- **לוגיקה (dart-maor):** buildSlots · roomsNow · weeklyRoomSessions · blockReason · inactiveRoomCourses · roomInfoLabel · timeToMin · minToHM · pad2 · sessionsOf · termOf · hebParts · HOLIDAYS · upcomingHolidays · isoLocal · countBy · dayNames · dayLetters · dayDiff · smartFilter · smartScore · normSearch · finderMatches · roleOf · canGrantedAction · toCsv · csvEscape · exportAllowed · guardExport · buildIcs · icsEscape · foldIcsLine.
- **לוגיקה (dart · בנייה-חכמה):** startOfWeekSunday.
- **דאטה (dart-data-maor):** BLOCK_REASON_T · FULL_HOLIDAYS · BUILD_SLOTS_T · INACTIVE_ROOM_COURSES_T · ROOM_INFO_LABEL_T · NORM_SEARCH_T · day-letters kTerms.
- **תצוגה (dart-ui-bs):** DsScaffold · DsSection · DsSearch · DsTable · DsField · BareStat · StatHero · GradientCard · GlassCard · MediaRow · StatRow · TimelineItem · StatusChip · SoftButton · SegmentedSwitch · AlertBanner · EmptyState · TintedTag · FilterChipPill · NeonBars · CircularProgressIndicator (מסגרת).
- **מזייפים שנדחו (§20-ג):** StatBlock · HeatGrid/GanttBar (seed) · MiniCalendar (today=תא-17) · DataGrid · timeline_flow · ShimmerSkeleton · bar_chart.
- **הרכבות-חדשות (23-ג):** `conflictsOf` (מרווחים חוג⊕אירוע — buildSlots מסתיר אירוע-מול-חוג) · `altRooms` (קיבולת⊕ציוד⊕פנוי⊕קרבה⇒דירוג) · `autoRelocate` (AND על כל מפגשי-השיעור) · `dayCell` (תפוס/סך⊕התנגשויות⊕חסימה) · `utilPct` (weeklyRoomSessions ÷ קיבולת-משבצות).

## אימות
- `flutter analyze --no-fatal-infos lib/genesis/dart-gen-bs/schoolos_rooms.dart` — **No issues found** (כל גל).
- `flutter test test/genesis_rooms_test.dart` — **7/7 passed**. הבדיקות מפעילות את המנגנון (V6): ערכים חושבו ביד מהדאטה-הדטרמיניסטית (7 חדרים · 2 התנגשויות · 1 תפוס ב-10:15 · 3 תקלות · 10 פריטים דורשי-פעולה ⇒ 9 אחרי אישור).
- **באגים שנתפסו ברנדר/בדיקה (לא בקומפילציה):** (1) בורר-יום 6×"ראשון 30" גלש 121px ⇒ `dayLetters`+גלילה · (2) אודיט סונן לפי שם ⇒ `closeFault` לא נרשם ⇒ `roomId` מפורש · (3) טאב/תפקיד 8/6 מחוץ-למסך ⇒ `ensureVisible` · (4) `.first` על 'כיתה 101' תפס באנר-התנגשות ולא תא-גריד ⇒ סלקטור 'כיתה 101 ›' · (5) **טעות-בודק (V5)** ב-autoRelocate: חישבתי-ביד 20 מפגשים/8 נשארים; המנוע צדק — השיעורים מתחילים 1.9 ⇒ `_onDate` מוציא א׳–ב׳ ⇒ 12 מושפעות, 5 שיעורים עוברים לאולם-ספורט, 4 נשארות (היסטוריה י׳-2: 34>32+מקרן · אנגלית י׳-2: ג׳08/ה׳08 תפוסים).
- **`autoRelocate` אומת דטרמיניסטית (בדיקה 7):** לחיצה על '🚚 העבר-אוטו' בכיתה-204 התקולה ⇒ הבאנר יורד 12⇒4 · פאנל אולם-ספורט: טאב-תפיסות מציג את השיעורים שהועברו · טאב-אודיט 5×'העברת-שיעור' · אודיט כיתה-204: הודעה למשתמשי-החדר "5 תפיסות הועברו".
- **רנדר-אמת:** `machtzev/audit/goals/schoolos_rooms.png` (800×2400) — Chromium מקומי; gstatic חסום ⇒ CanvasKit מקומי + 404 מיידי לפונטי-Noto.
- **משטרה:** `police --fast` ירוקה בכל commit (23 ran · 0 failed) · pre-push משטרה-מלאה ירוקה (29 ran).

## מה **לא** אומת (D3 · אמור מה-לא-בדקת)
- שליחת-הודעה בפועל (SMS/WA/מייל) — הערוץ = שקע-הצבה; אומתה תיבת-היוצא + האודיט בלבד.
- הדפסה פיזית — אומתה תצוגת-ההדפסה (טקסט-נקי של buildSlots).
- הורדת קובץ CSV/iCal — בסנדבוקס ההורדה חסומה; אומת התוכן (BOM · כותרות · VCALENDAR/VEVENT/SUMMARY/LOCATION) בתצוגה.
- אמוג׳י ברנדר-headless מופיעים כריבועים (אין פונט-אמוג׳י בסנדבוקס) — לא באג-קוד.
- חוגים/אירועים מגיעים כדמו-דאטה בצורת-מאור; חיבור-חי למודולי COURSES/TEACHERS/INVENTORY = חיווט-המנהל (לא בקובץ-זה, לפי בעלות-הקבצים).
