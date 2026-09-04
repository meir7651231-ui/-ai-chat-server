# 📚 סגירה · מסך-חוגים ומערכת-שעות מלא (SchoolOS · COURSES) — 4.9.2026

> **מפרט (SSOT · "מה"):** `knowledge/SPEC-COURSES-FULL-2026-09-04.md` · **מגילת-הסשן:** `SCHOOLOS-ORCHESTRATION-2026-09-04.md`.
> נבנה **בדרך** (THE-WAY · הכרעה 23-ב/ג/ד) — 8 גלים; כל גל: `flutter analyze` (אפס-errors) ⇒ בדיקת-widget ⇒ רנדר-Playwright (Chromium, CanvasKit מקומי) ⇒ כרטיס-מטרה (`goal-card --refresh` + תמונה) ⇒ משטרה ירוקה ⇒ commit+push בשני הריפו.
> **קובץ יחיד:** `new/dart-gen-bs/schoolos_courses.dart` (1,721 שורות · `CoursesScreen` const · ללא main) · מראה: `buildsmart/app_flutter/lib/genesis/dart-gen-bs/` · בדיקה: `buildsmart/app_flutter/test/genesis_courses_test.dart` (10 בדיקות · 10/10 ירוק · 0 גלישות-RenderFlex).

## הדרך (איך נבנה — לא מה)
1. **מטרה:** *"שכל שיעור יקרה — עם מורה, בחדר, לתלמידים הנכונים, בזמן — ושאף שיבוץ לא יתנגש ואף מקום לא יתבזבז."* ⇒ ה-hero של המסך = **התנגשויות** (לא "מספר-חוגים").
2. **6 פעולות-יסוד:** איתור · הערכת-תפוסה · זיהוי-חריגה (התנגשות/ללא-מורה/ללא-חדר/מלא/מתחת-מינ׳) · הכרעה (דחיפות-מאוחדת) · ביצוע (שיבוץ/העלאה/הקצאה/ביטול/סיום/שכפול) · אימות (היסטוריה/גבייה/ייצוא).
3. **חיפוש-מלא לפני בחירה:** `new/dart-maor` (1,324) + `new/dart-ui-bs` (557) + האורקל `atom-index-full.json` (1,402). נמצא **מודול-חוגים שלם ממאור** — 51 מנועי-לוגיקה מחווטים (רשימה למטה), 18 אטומי-תצוגה.
4. **הרכבה תמיד** — כל חלקיק-תובנה = כמה אטומים (תצוגה⊕לוגיקה). דוגמאות: שיבוץ-תלמיד = `courseFitsMember⊕gradeFits⊕gradeIndex⊕gradeOrder⊕ageOf` (קדם) ⊕ `scheduleClashText` (התנגשות) ⊕ `enrollCount`/`maxStudents` (קיבולת) ⇒ enrolled/waitlisted/blocked · סנכרון-חגים = `hebParts⊕HOLIDAYS⊕upcomingHolidays⊕nextSessionDate` ⇒ ביטול-אוטו.
5. **חיווט-בשקעים, אפס-ציור-ביד:** `Table`/`Row`/`Wrap` = פריסה; כל ערך מגולם באטום-מדף. זהות (מיילים/טלפונים/תפקידים) מוזרקת ב-`roleDefs`/דאטה (חוק-6). **אין `DateTime.now`** — `today='2026-09-04'` ו-`nowAt` מוזרקים.
6. **אימות-מול-המטרה ברנדר:** 5 צילומים (`machtzev/audit/goals/schoolos_courses.png` = האחרון) + 7 בדיקות-widget שמוכיחות **ערכים מחושבים-ידנית ≡ מסך** (V6).
7. **באגים שהרנדר/הבדיקה תפסו והקומפילציה פספסה (8):** (א) ספירת-התנגשויות ידנית שגויה (6) — המנוע צדק (10 אירועים ⇒ 5 ייחודיים) · (ב) גלישת-StatusChip בתאי-גריד 112px ⇒ 150px+FittedBox · (ג) 9 טאבים בשורה גלשו ⇒ טאב לא-נגיש ⇒ 2 שורות+FittedBox · (ד) שבבי-עובדה ארוכים (roomInfoLabel) גלשו ⇒ MediaRow/FittedBox · (ה) ListView עצלה — אזורים מתחת ל-2400px לא נבנו בבדיקה ⇒ משטח 800×5200 · (ו) סגירת-גיליון בבדיקה דורשת pump-ריק+אנימציה · (ז) מפתח-ייחודיות של התנגשות-תלמיד (חוג×תלמיד ⇒ זוג-חוגים×תלמיד) · (ח) **גל 8ב:** ➕ חוג-חדש נולד בלי מפגשים ⇒ `nextSessionDate` (תזכורות/חגים) ו-`sessionsLabel` עשו `as int` על weekday=null ⇒ קריסת-build — נתפס רק בבדיקת-widget של הפעולה (חוב-§6), תוקן ב-`hasSessions` guard.

## 8 הגלים (commits)
| # | יכולת | הרכבה (הכי-טוב-לייעוד, מהמדף) | commit גנסיס |
|---|---|---|---|
| 1 | דאטה-אמת (סכמת מאור) + KPI-10 | `enrollCount⊕waitlistFor⊕scheduleClashText⊕payBal⊕paidOf⊕trendFromScan⊕dayDiff⊕inactiveRoomCourses⊕grandTotal⊕shekel` · `StatHero⊕BareStat×9⊕GradientCard` | b3348f7 |
| 2 | גריד ימים×שעות · רשימה (columnDefs 18) · פר-מורה · פר-חדר | `Table⊕StatusChip⊕FittedBox` · `minToHM⊕timeToMin⊕sessionsOf⊕dayNames` · `DsTable` · `coursesOfTeacher` · `weeklyRoomSessions⊕clampScale⊕StatRow` (ניצולת) | 5038214 |
| 3 | פאנל חוג-נבחר · 9 טאבים · 16 פעולות | `GlassCard⊕SegmentedSwitch×2⊕MediaRow⊕StatRow⊕TimelineItem⊕SoftButton⊕AlertBanner⊕DsField⊕DsNumberField` · `courseFitsMember⊕gradeFits⊕gradeIndex⊕gradeOrder⊕ageOf` · `enrollSummary⊕enrollmentPaidStatus⊕enrollStatusMeta⊕presentsInMonth` · `nextSessionDate` · `duplicateCourse⊕nextYearCourseDraft⊕nextYearDates⊕academicYearLabel⊕defaultCourseDates` · `waLink⊕waDigits` · `roomInfoLabel` | 8f12dcf |
| 4 | איתור + חריגה + טריאז׳ | `DsSearch⊕smartFilter⊕smartScore⊕normSearch` · `FilterChipPill⊕finderMatches` (13 צירים · AND) · `countBy` · `DsSection` פר-דחיפות | 31133e9 |
| 5 | מצבים-מיוחדים (10) + הרשאות (6 תפקידים) | `roleOf⊕canGrantedAction⊕teacherIdOf` · `SegmentedSwitch` (בורר-תפקיד) · `CircularProgressIndicator` (טעינה) · `EmptyState`×4 · הרשמה-עצמית (wait=אישור-רכז) | f2c5b7d* |
| 6 | אוטומציות (11) | `hebParts⊕HOLIDAYS⊕upcomingHolidays⊕nextSessionDate` (חג⇒ביטול-אוטו) · חדר/מורה-חלופי (`_sameSlot` על `sessionsOf⊕timeToMin`) · `dayDiff` (מתחת-מינ׳ X ימים) · המתנה-עם-מקום · תזכורות-48h · אות-ביקוש · ניצולת (`weeklyRoomSessions`) · `AlertBanner⊕SoftButton⊕BareStat×3` | f2c5b7d* |
| 7 | מקום-שמור + ייצוא | `columnDefs` (קוד) · `metaFields` (11 שדות-מתקדמים) · `enrollMetaFields` (מלגה) · `toCsv⊕csvEscape⊕exportAllowed` · `icsEscape` (iCal) · PDF=מקום-שמור | f2c5b7d* |
| 8 | בדיקת-widget (7) + דוח-סגירה | `genesis_courses_test.dart` · מסמך זה | 5a7466b→1fb9e94 |
| 8ב | **חוב-§6 = אפס** (הכוונת-מנהל 12:15Z): 3 בדיקות-widget לכל פעולה שנבדקה "בקוד בלבד" — שבץ·הזמן·העלה·העבר(חסימה⇒יעד-אחר)·בטל-שיעור·מורה-מחליף·ערוך-קיבולת⇒העלאה-אוטו·9 טאבים·הקצה-מורה(חסימה)·הקצה-חדר(פותר/נחסם)·שלח-הודעה(waLink)·חומרים·הדפס·חוג-חדש⇒הקצה⇒בטל-חוג·שכפל-חוג⇒התנגשות⇒סיים-חוג·שכפל-סמסטר·שבוע-הבא | (זה) |

\* **סטייה מוצהרת:** גלים 5–7 נבנו ואומתו בנפרד (analyze+בדיקה+רנדר לכל אחד) אך **נדחפו ב-commit אחד** — עלות-push של ~10 דקות (משטרה-מלאה ב-pre-push × 4–5 התנגשויות-ref עם 7 סשנים-מקבילים) לכל commit. אפס-ויתור על אימות; רק צמצום-commits.

## ✅ בנוי-מול-יעד (כנה · לפי סעיפי-המפרט)
| סעיף במפרט | יעד | ✅ בנוי | מקום-שמור | ❌ | הערות |
|---|---|---|---|---|---|
| 5 האזורים | 5 | 5 | 0 | 0 | פס-עליון (שבוע/סמסטר/תצוגה×4/חיפוש/חוג-חדש/שכפל-סמסטר/ייצוא/הדפס) · KPI · גריד∨רשימה · פאנל · טאבים |
| KPI עליון | 10 | 10 | 0 | 0 | מתחת-מינ׳ = **חיבור-מודלים** (23-ד): `minStudents` (מקום-שמור, אין במאור) ∨ נקודת-איזון `⌈(payRate+room.rate)/lessonPrice⌉` — רק כשכל השדות באותה יחידה (perLesson); אחרת '—' |
| רשימת-חוגים · עמודות | 18 | 17 | 1 | 0 | `קוד` — אין ב-Course של מאור ⇒ עמודה שקטה שמאירה כשמגיע `code`. משך=Room.slot · תדירות=sessions/שבוע · סטטוס=נגזרת-תאריכים |
| שדות-מתקדמים | 17 | 6 | 11 | 0 | ✅ דרישות-קדם (gender/age/grade) · שכבות-יעד · מורה-מחליף · תת-קבוצות (session.label) · תאריכי-ביטול-יחידים · חומרי-לימוד (CourseFile). **מקום-שמור** (metaFields, מאירים כשיגיע נתון): ציוד-נדרש · מלגה · מקוון · תבנית · התחלה/סיום-בפועל · תעודה · מדיניות-ביטול · סילבוס · הקלטות · ציונים |
| כפתורי-פעולה | 17 | 17 | 0 | 0 | כולם + ⛔ בטל-חוג. שלח-הודעה = קישורי-WhatsApp (`waLink`) פר-משפחה; הדפס/ייצוא = תצוגה-מקדימה (הורדה/הדפסה חסומות בסנדבוקס; PDF = מקום-שמור לשער-פלטפורמה) |
| פילטרים/חיפוש | 14 | 14 | 0 | 0 | 8 צ׳יפי-מצב + 6 צירי-ממד (תחום·מורה·חדר·יום·שעה·שכבה) + סמסטר (SegmentedSwitch) + טקסט (DsSearch) — AND בין צירים |
| פאנל חוג-נבחר | 9 | 9 | 0 | 0 | נוכחות-החוג = יחס נוכח/(נוכח+נעדר) פר-נרשם ולחוג; **מגמה-לאורך-זמן** דורשת היסטוריית-שיעורים ⇒ חלקי (מסומן) |
| טאבים פנימיים | 9 | 9 | 0 | 0 | סקירה·נרשמים·המתנה·מערכת·נוכחות·גבייה·חומרים·היסטוריה·אודיט |
| מצבים-מיוחדים | 10 | 9 | 1 | 0 | ✅ אין-חוגים · סמסטר-לא-מוגדר (ריק/שדה-ריק) · התנגשות-חוסמת · מלא⇒המתנה · מתחת-מינ׳ · ללא-מורה · ללא-חדר · טעינה · הסתיים/בוטל. **שגיאה** = AlertBanner מחווט (`_error`), מאיר כש-fetch ייכשל |
| הרשאות | 6 | 6 | 0 | 0 | רכז(admin)·מורה(roles.teachers⇒החוגים-שלי)·מזכירות·הנהלה·הורה(המערכת-שלי+הרשמה-עצמית)·צפייה — `canGrantedAction` פר-מפתח |
| אוטומציות | 11 | 11 | 0 | 0 | תחזית-ביקוש = אות-נוכחי (מלא/ממתינים/מגמה-עולה); **היסטוריה רב-סמסטרית** = מקום-שמור (מסומן בבאנר) |
| אינטגרציות | 7 | 6 | 1 | 0 | נוכחות/מורים/חדרים/תלמידים/גבייה/הורים — ברמת-הדאטה (Db ממאור). **לוח-הנהלה**: getters ציבוריים-במסך מוכנים; החיבור = המנהל |
| **סה״כ** | **133** | **119** | **14** | **0** | |

## אפס-זיוף (§20-ג) — מה לא הומצא
- **סכמה = רק שדות-אמת** מ-`new/dart-maor/schema-fields.dart` (צילום `domain.ts`): Course (39 שדות) · Enrollment (26) · Room (12) · Teacher (19) · Member · Family · CourseSession · CourseFile · Payment · Absence.
- `Course.size` — סמנטיקה לא-מוכחת (נבדק: רק `wizard-step-error` בודק truthiness) ⇒ **לא בשימוש**, לא הונח.
- **מינימום-לפתיחה** אינו שדה במאור ⇒ לא זויף: מקום-שמור + נקודת-איזון מחושבת רק כשיש `perLesson+lessonPrice+payRate+rate`.
- **מזייפים שנדחו:** StatBlock · linear_progress · radial_gauge · bar_chart · sparkline · DataGrid · timeline_flow · ShimmerSkeleton — **0 ייבואים/שימושים** (`grep` על `X(` = 0; השמות מופיעים רק בהערות "לא X המזייף").
- דמו-דאטה ריאליסטית (8 חוגים · 4 מורים · 4 חדרים · 8 משפחות/11 תלמידים · 25 הרשמות) — כל שדה עם מקור-אמת; הזהויות מזויפות-בכוונה (`@school`, `05X-000000N`).

## מקור-האמת של האטומים
- **לוגיקה (dart-maor · 51):** enrollCount · waitlistFor · sessionsOf · scheduleClashText · timeToMin · minToHM · payBal · paidOf · trendFromScan · dayDiff · inactiveRoomCourses · grandTotal · shekel · dayNames · semesterOptions · coursesOfTeacher · weeklyRoomSessions · clampScale · courseFitsMember · gradeFits · gradeIndex · gradeOrder · ageOf · enrollSummary · enrollmentPaidStatus · enrollStatusMeta · presentsInMonth · nextSessionDate · duplicateCourse · nextYearCourseDraft · nextYearDates · academicYearLabel · defaultCourseDates · waLink · waDigits · roomInfoLabel · smartFilter · smartScore · normSearch · finderMatches · countBy · roleOf · canGrantedAction · teacherIdOf · hebParts · HOLIDAYS · upcomingHolidays · toCsv · csvEscape · exportAllowed · icsEscape.
- **תצוגה (dart-ui-bs · 18):** DsScaffold/DsSection/DsTokens · BareStat · GradientCard · StatHero · MediaRow · StatusChip · EmptyState · SegmentedSwitch · StatRow · DsTable · DsSearch · FilterChipPill · DsField · DsNumberField · GlassCard · SoftButton · AlertBanner · TimelineItem.
- **מסגרת (פריסה בלבד):** Table · Row/Column/Wrap · FittedBox · InkWell · SingleChildScrollView · DraggableScrollableSheet · CircularProgressIndicator · SelectableText.

## אימות
- `flutter analyze --no-fatal-infos lib/genesis/dart-gen-bs/schoolos_courses.dart` ⇒ **No issues found!**
- `flutter test test/genesis_courses_test.dart` ⇒ **10/10 passed · 0 RenderFlex overflow** (גל 1 KPI ≡ חישוב-ידני · גל 2 גריד/טבלה/ניצולת · גל 3 המתנה-חסומה/העלאה-אוטו/קדם · גל 4 איתור/צירים/טריאז׳ · גל 5 הרשאות/מצבים · גל 6 חג⇒ביטול/חלופות/ביקוש · גל 7 CSV/iCal/PDF · גל 8ב ×3: כל 17+ הפעולות + 9 הטאבים + חוג-חדש/שכפול/סיום/ביטול/שבוע-הבא). **חוב-§6 = 0:** אין יכולת שנבדקה בקוד/קומפילציה בלבד.
- `police --fast` (pre-commit) ירוק בכל commit · `police` מלאה (pre-push, 29 שערים) ירוקה בכל push · `goal-proof` ✓ (כרטיס-מטרה חתום + תמונה לכל commit).
- **מה לא אומת / מחוץ-לסנדבוקס:** (א) פונטים/אמוג׳י ברנדר-הסנדבוקס = בוקסות (CDN חסום; זהה למלאי) · (ב) הפאנל (bottom-sheet) אומת בבדיקות-widget (7 מתוך 10), לא בצילום · (ג) שלח-הודעה/ייצוא/הדפסה = תצוגות-מקדימות מאומתות-בבדיקה (הקישור/הטקסט/השורות); ה-launch/download/print עצמם חסומים בסנדבוקס · (ד) מצב-שגיאה (`_error`) = מקום-שמור מחווט, אין fetch שיכשיל אותו ⇒ לא-מופעל · (ה) חיבור-לניווט-הביתי בוצע ע"י המנהל (buildsmart 670fdbb, בדיקת-ניווט 9/9); רישום-חלקיקים במנוע = המנהל.
