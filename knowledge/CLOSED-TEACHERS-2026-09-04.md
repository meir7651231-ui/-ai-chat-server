# 👩‍🏫 סגירה · מסך-מורים-וצוות-מלא (SchoolOS) — 4.9.2026

> **מפרט (SSOT):** `knowledge/SPEC-TEACHERS-FULL-2026-09-04.md` · **הדרך:** `machtzev/THE-WAY.md` (הכרעה 23-ב/ג/ד) ·
> **קובץ:** `new/dart-gen-bs/schoolos_teachers.dart` (1151 שורות · מחלקה ציבורית `TeachersScreen` const, ללא main) ·
> **מראה:** `buildsmart/app_flutter/lib/genesis/dart-gen-bs/` · **בדיקת-widget:** `buildsmart/app_flutter/test/genesis_teachers_test.dart` (18/18).
> **סטנדרט:** מסך-המלאי (`CLOSED-INVENTORY-2026-09-03.md`). 8 גלים, כל אחד: בנייה→analyze→רנדר→משטרה→commit→push.

## הדרך (איך נבנה)
1. **מטרה:** *"שכל מורה יהיה במקום הנכון עם עומס נכון — ושהמנהל/ת יראה מי-עמוס-מדי, מי-חסר ומי-צריך-תמיכה לפני שזה פוגע בתלמידים."* ליבה: אף שיעור בלי מורה · עומס מול חוזה · מי צריך תמיכה — בזמן לפעול.
2. **6 פעולות-יסוד:** איתור · הערכת-עומס · זיהוי-חריגה (היעדרות⇒שיעור-ללא-מורה · הכשרה/חוזה פגים · דפוס-היעדרות) · הכרעה (מחליף-מוצע · דחיפות-מאוחדת) · ביצוע · אימות.
3. **חיפוש-מלא לפני בחירה:** `machtzev/search-record.mjs` ×3 (רשומות ב-`machtzev/audit/search/2026-09-04-*`) על האורקל-המאוחד (1402 תצוגה + 848 לוגיקה) + ls של `dart-maor`/`dart-ui-bs`/`dart` (בנייה-חכמה). מועמדים שנבדקו ונדחו: `buildCourseDailyRows` (שורות-נוכחות-פר-חוג, לא מערכת-מורה) · `enrollmentsForSession` (תלמידים-במפגש) · `cockpitWorkListText` (טקסט-תורים) · `locationToAvailability` (מלאי, לא זמינות-אדם) · `weeklyRoomSessions` (פר-חדר, לא פר-מורה — הורכב במקום: coursesOfTeacher⊕sessionsOf⊕grandTotal) · `teamIntel*` (אטומי-דאטה של קופסת-הודעות-צוות: RECENT_LIMIT/מחרוזות — אין מנוע-לוגיקה ליכולת-צוות-מורים) · `DsSelect`/`DsMultiSelect` (קשורים ל-appStore) · `SegPicker`/`ChipCloud`/`AnimatedTabs` (בולעים מצב).
4. **הרכבה — לעולם לא אטום-יחיד לתובנה:** 28 מנועי-לוגיקה ⊕ 20 אטומי-תצוגה ⊕ 1 אטום-דאטה (ראה מקור-האמת למטה).
5. **חיווט דרך שקעים:** today מוזרק (`'2026-09-03'`, אפס `DateTime.now` במנוע) · פיגמנטים מוזרקים (BareStat/FilterChipPill) · זהות=עקרונות אטומים `p:*` (חוק-6, לא מיילים) · `roster`/`initialMode`/`initialPanel`/`initialTab` = שקעי-הזרקה לתצוגה/בדיקה.
6. **אימות-מול-המטרה ברנדר:** צילום-Chromium (`flutter build web` + headless) לגלים 1–2 ורנדר-Skia עם פונט-Heebo אמיתי (widget-test ⇒ PNG) לגלים 3–7 (Chromium-headless נתקע על בקשות-TLS חיצוניות). **4 באגים שהקומפילציה פספסה ונתפסו ברנדר/בדיקה:**
   - `scheduleClashText` בודק התנגשות-שבועית ⇒ פסל מחליפים לסלוט-יומי (ת"ז: מועמד תקין נדחה) ⇒ מבט-חוג מצומצם-לסלוט מוזרק למנוע להחלפה-ליום; הבדיקה-המלאה נשמרה להקצאה-קבועה.
   - `SegmentedSwitch`=Row: 5 טאבים גלשו 78px בגיליון ⇒ 3 שורות×3 · 6 תפקידים גלשו 121px ⇒ 2 שורות×3.
   - `balanceFor` הציע להעביר 5 שיעורים למורה עם חוזה 8 ש׳ (⇒150%) ⇒ תנאי-קיבולת למקבל (שעות+מפגשים ≤ חוזה); ההצעה נעלמה בכנות.
   - שעות-שבועיות חושבו 45-דקות/60 ⇒ כולם "בתת-עומס" ⇒ מוסכמת-חינוך: שעה-שבועית = שיעור.
7. **שורש בבייטים** — כל תיקון בשכבה הנכונה (חיווט/הזרקה), אפס נגיעה באטומים.

## 8 הגלים
| # | יכולת | הרכבה (הכי-טוב-לייעוד, מהמדף) |
|---|---|---|
| 1 | דאטה-אמת + KPI-10 + טריאז' | סכמת Teacher/Course (מאור schema-fields) + WorkerCert/AttendanceDay (בנייה-חכמה) · StatHero⊕BareStat×10 · coursesOfTeacher⊕sessionsOf⊕grandTotal (ש״ש) · volunteerLoadHint⊕clampScale (עומס) · certExpiryStatus · dayDiff⊕presentsInMonth (חוזה/היעדרויות-החודש) · trendFromScan (דפוס) · ageOf (ותק) · countBy (תפקידים) · sev מאוחד ⇒ DsSection×5 |
| 2 | טבלה-חוזה + לוח-החלפות-היום + מחליף-מוצע | DsTable⊕columnDefs (16 · מקום-שמור) · DsBoard (stages+records+onMove) · candidates = זמין∧מקצוע∧availableAt[timeToMin]∧scheduleClashText(סלוט)==null, מדורג מועדף→עומס · taskOverdue |
| 3 | כרטיס-מורה-נבחר · 9 טאבים · 14 פעולות | GlassCard⊕PremiumAvatar⊕StatRow⊕BareStat⊕SegmentedSwitch×3 · מערכת=DsTable⊕sessionsOf⊕timeToMin⊕minToHM · היעדרויות=NeonBars⊕trendFromScan⊕TimelineItem⊕absenceReasonChips⊕kTerms · הכשרות=certExpiryStatus⊕StatusChip · balanceFor=clashOf(שבוע)⊕availableAt⊕קיבולת · ייצוא=toCsv⊕csvEscape⊕exportAllowed |
| 4 | איתור + חריגה (סגירת-קיצור 23-ג) | DsSearch⊕smartFilter⊕smartScore⊕normSearch · FilterChipPill⊕finderMatches (6 צירים) · SegmentedSwitch (תפקיד·סטטוס) · צ׳יפי מקצוע/כיתה (countBy) · מורה-חדש · CSV-נראה |
| 5 | מצבים + הרשאות | roleOf⊕teacherIdOf⊕canGrantedAction (6 תפקידים) · RLS עמודות/הערות/פעולות/רשומות · טעינה (CircularProgressIndicator) · שגיאה (AlertBanner) · אין-צוות/ללא-תוצאות (EmptyState) |
| 6 | אוטומציות (9) | AlertBanner ⊕ syncUncovered · candidates · load · certExpiryStatus · dayDiff · trendFromScan · balanceFor · sessionsOf (תזכורת-יומית למורה) · השוואת-כיתות=מקום-שמור |
| 7 | מקום-שמור (חוק-7) | columnDefs⊕metaFields⊕reservedSlots (12) · ExpandableTile-פנקס · `slotLit` מאיר לבד כשמפתח מוזרק |
| 8 | בדיקת-widget + סגירה | 18 בדיקות: 3 מבטים · 9 טאבים · חריגה (עומס>סף) · איתור ("אנגלית") · הרשאות (מורה=עצמו) · טעינה · לולאת-הכרעה (5⇒4) · פנקס (12) |

## ✅ בנוי-מול-יעד (כנה · כל סעיף-מפרט)
| סעיף | M | ✅ | מקום-שמור | ❌ | הערות |
|---|---|---|---|---|---|
| 5 אזורים | 5 | 5 | 0 | 0 | פס-עליון · KPI · רשימה (חכם/טבלה) · כרטיס (גיליון) · טאבים |
| KPI | 10 | 10 | 0 | 0 | כולם מנועי-מדף/שדות-אמת (אפס StatBlock) |
| עמודות-ליבה | 16 | 12 | 4 | 0 | שמור: תמונה · דירוג-נוכחות-כיתותיו · קשר (חוק-6) · עדכון |
| שדות-מתקדמים | 14 | 10 | 4 | 0 | שמור: הערכות-עמיתים · משוב-תלמידים · שכר (מוגן-כספים) · תיק-אישי |
| כפתורי-פעולה | 14 | 12 | 2 | 0 | שמור: שלח-הודעה (contact מוזרק) · PDF (מנוע-הצבה; CSV חי) · ערוך=תפקיד · צרף-מסמך=רשומה (אחסון שמור) |
| פילטרים/חיפוש | 11 | 11 | 0 | 0 | finderMatches AND + smartFilter |
| כרטיס מורה-נבחר | 11 | 10 | 1 | 0 | שמור: ביצועי-כיתות (classPerf) |
| טאבים | 9 | 8 | 1 | 0 | שמור: ביצועים |
| מצבים-מיוחדים | 9 | 8 | 1 | 0 | שגיאה: המצב בנוי, הטריגר (fetch) = הצבה |
| הרשאות | 6 | 6 | 0 | 0 | עקרונות אטומים p:* (חוק-6) |
| אוטומציות | 9 | 8 | 1 | 0 | שמור: השוואת-ביצועי-כיתות |
| אינטגרציות | 7 | 4 | 3 | 0 | ✅ חוגים (Course) · נוכחות (AttendanceDay·מחליף) · חדרים (roomId) · לוח-הנהלה (מחלקה ציבורית) · שמור: תלמידים (classPerf) · הורים (מי-הקשר) · גבייה (salary) |
| **סה״כ** | **121** | **104** | **17** | **0** | |

## הכרעות-אמת (§20-ג · אפס-זיוף — מה לא נבנה ולמה)
- **זהות/קשר/שכר/בנק** (Teacher.phone/email/idNum/address/payRate/bank*) — **לעולם לא בקובץ** (חוק-6): שקעים `contact`/`salary` מאירים רק בהזרקה; שמות-הדמו בדויים, `roster` מוזרק בהצבה.
- **ביצועי-כיתות / דירוג-נוכחות / השוואה-למנהל** — אין מקור-אמת לנוכחות-כיתה/ציונים באימפריה ⇒ `classPerf`/`classAttendance` שמורים; `trendFromScan`+`NeonBars` מחווטים ומאירים כשהנתון יגיע.
- **תמונה · הערכות-עמיתים · משוב-תלמידים · תיק-אישי · אחסון-מסמכים · PDF · fetch** — מקום-שמור (12 שקעים בפנקס). **לא זויף דבר.**
- **מזייפים שנמנעו:** StatBlock · linear_progress · radial_gauge · bar_chart · sparkline · DataGrid · timeline_flow · ShimmerSkeleton.

## מקור-האמת של האטומים
- **לוגיקה (28):** courses-of-teacher · sessions-of · time-to-min · min-to-hm · grand-total · volunteer-load-hint · clamp-scale · schedule-clash-text · week-day-names · cert_expiry_status · intel-day-diff · presents-in-month · age-of · fmt-date · intel-trend-from-scan · task-overdue · count-by · role-of · teacher-id-of · can-granted-action · smart-filter · smart-score · norm-search · finder-matches · to-csv · csv-escape · export-allowed · absence-reason-chips
- **דאטה (1):** absence-reason-chips-terms
- **תצוגה (20):** ds · ds_search · ds_table · ds_board · gradient_card · glass_card · stat_hero · bare_stat · stat_row · media_row · timeline_item · expandable_tile · neon_bars · status_chip · alert_banner · empty_state · soft_button · segmented_switch · premium_avatar · filter_chip_pill
- **סכמות-אמת:** Teacher/Course/Db — `new/dart-maor/schema-fields.dart:360-470, 813-921, 2740` · WorkerCert — `buildsmart/app_flutter/lib/state/worker_certs.dart:25-72` · AttendanceDay — `state/worker_attendance.dart:30`.

## מה לא אומת (D3)
- הרנדר בדפדפן-אמיתי לגלים 3–7 (הוחלף ברנדר-Skia דטרמיניסטי + 18 בדיקות-widget; Chromium-headless נתקע על TLS חיצוני בסנדבוקס).
- אמוג'י ברנדר = בוקסות (אין פונט-אמוג'י בסנדבוקס; בפרודקשן מרונדר).
- `DsTable` רחב גולל אופקית — לא נבדק במסך-צר מ-800.
- הדאטה = דמו ריאליסטי (8 מורים · 21 חוגים · 3 החלפות-seed); בהצבה מוזרם מהזנת-הלקוח.

## אימות
`flutter analyze --no-fatal-infos lib/genesis` — No issues · `flutter test test/genesis_teachers_test.dart` — 18/18 · `police.mjs` — pre-commit ירוק (goal-proof · secrets · no-fakers · truth) · pre-push משטרה-מלאה ירוקה · goal-card חתום עם רנדר לכל גל.
