# 🎓 סגירה · מודול-תלמידים (SchoolOS) — 4.9.2026

> **SSOT:** `knowledge/SPEC-STUDENTS-FULL-2026-09-04.md` · **הקובץ:** `new/dart-gen-bs/schoolos_students.dart` (מחלקה ציבורית `StudentsScreen`, const, ללא main)
> **מראה:** `buildsmart/app_flutter/lib/genesis/dart-gen-bs/schoolos_students.dart` · **בדיקה:** `buildsmart/app_flutter/test/genesis_students_test.dart` (5 מבחנים)
> נבנה **בדרך** (THE-WAY · הכרעה 23-ב/ג/ד): 8 גלים, כל אחד analyze ⇒ רנדר (build web + צילום Playwright / בדיקת-widget) ⇒ משטרה ⇒ commit+push.

## הדרך (איך נבנה — לא מה)
1. **מטרה:** *"לדעת מי כל תלמיד באמת — ולראות את מי-שנופל לפני שהוא נופל."* הליבה: ציון-סיכון מאוחד מכל האותות + הפעולה-הנכונה-עכשיו.
2. **7 פעולות-יסוד:** איתור · הערכת-מצב · חיבור-אותות-להכרעה · זיהוי-חריגה · הכרעה · ביצוע · אימות.
3. **חיפוש-מלא לפני בחירה:** 12 רשומות `search-record` באורקל-המאוחד (`machtzev/audit/search/2026-09-04-*.json`) — מאור + בנייה-חכמה + אינדקס.
4. **הרכבה:** כל חלקיק-תובנה = כמה אטומים (תצוגה⊕לוגיקה). 37 מנועי-לוגיקה (dart-maor) ⊕ 22 אטומי-תצוגה (dart-ui-bs).
5. **חיווט דרך שקעים:** today · db · roleDefs · פיגמנטים — מוזרקים (חוק-6). אין `DateTime.now` במנוע.
6. **אימות-מול-המטרה ברנדר:** 7 צילומי-רנדר (`machtzev/audit/goals/schoolos_students.png` = האחרון) + 5 בדיקות-widget. הרנדר/הבדיקה תפסו **6 באגים** שהקומפילציה פספסה (למטה).

## 🔴 דאטה-אמת (§20-ג) — סכמת-maor (`dart-maor/schema-fields.dart`)
| שדה-מפרט | מקור-אמת | | שדה-מפרט | מקור-אמת |
|---|---|---|---|---|
| ת״ז · לידה/גיל · מין · כיתה · רפואי · אישורי-מדיה · הערות | `Member.idNum/birth/gender/grade/health/mPhotos..mRecommend/notes` | | הורה+טלפון · כתובת · שפת-בית · מצב-משפחתי · סוציו-אקונומי · מסמכים · אחים | `Family.mother/father/phone/address/city/language/maritalStatus/tzedaka/discount/docs/members` |
| סטטוס · נוכחות · הצטרפות · היסטוריית-כיתות | `Enrollment.status/presents/absences/enrolledAt/renewedToId` | | מחנך/ת · חוגים | `Course.teacherId/cat/year` ⊕ `Teacher.name` |
| פניות · אישורי-טיולים/תרופות (דרך משימות) | `WorkTask{assignee,ref{kind,memberId,consent},due,doneAt}` | | ציר-זמן · אודיט · לוג-חשיפה | `OrgEvent.famId` · `AuditEntry{at,who,act,what}` |

**ללא-מקור באימפריה ⇒ מקום-שמור (אפס-זיוף):** ציונים · התנהגות · חברתי-רגשי · תמונה · אבחונים · תרופות · IEP · הסעה · ציוני-חוץ · חונך · תפקידים · הישגים · תעודות-קודמות · חוב-גבייה · PDF · הצפנה-במנוחה.
**קלט-מדיניות (לא נגזרת-מזויפת, כמו target/rate במלאי):** משקלי-האותות (40/15/15/15/10/5) · ספי-band (55/30) · minSample=5 · noteSilentDays=90.

## חוזה-הסיכון (הכרעה 23-ד: מחברים, לא בוחרים)
`signalDefs` = נוכחות (40, presents/absences ⊕ noshow) · מגמה (15, `trendFromScan` על יחסי-נוכחות חודשיים) · משפחתי (15, טלפון-חסר ⊕ סטטוס-משפחה ⊕ משימה-באיחור) · **ציונים (15) · התנהגות (10) · חברתי-רגשי (5) = מקום-שמור** — אות ללא-נתון שקט והמשקל מנורמל על הזמינים; כשרשומה נושאת `grades/behavior/social` האות מאיר לבד (מוכח בבדיקה: הזרקת grades ⇒ ממוצע-ציונים 60 ב-KPI). האות-המוביל ⇒ **הפעולה-הנכונה-עכשיו** (band ⊕ אות).

## בנוי-מול-יעד (כנה)
| סעיף-מפרט | יעד | ✅ בנוי | מקום-שמור | ❌ | הערות |
|---|---|---|---|---|---|
| 5 אזורים | 5 | 5 | 0 | 0 | פס-עליון · KPI · טריאז׳/טבלה · כרטיס · 9 טאבים |
| KPI | 10 | 9 | 1 | 0 | ממוצע-ציונים = '—' עד נתון |
| עמודות-רשימה | 18 | 16 | 2 | 0 | `columnDefs`: תמונה · ממוצע-ציונים מאירים כשמגיע נתון |
| שדות-מתקדמים | 16 | 9 | 7 | 0 | שמור: הסעה · תעודות · אבחונים · תרופות · IEP · חונך · תפקידים/הישגים (מוצהרים בטאבים) |
| כפתורי-פעולה | 15 | 15 | 0 | 0 | + סגירת-פנייה · מחיקה (מנהל/ת) · בצע מעבר-שנה |
| ייצוא PDF | 1 | 0 | 1 | 0 | אין מנוע-PDF במדף; CSV מלא (BOM + חסימת-הזרקה) |
| פילטרים/חיפוש | 14 | 13 | 1 | 0 | ציונים<סף = '—' עד נתון; טקסט: שם·מס׳·כיתה·מחנך·הורה·טלפון·ישוב |
| כרטיס תלמיד-נבחר | 12 | 11 | 1 | 0 | ציונים-לפי-מקצוע = שקע; תמונה = `PremiumAvatar.image` |
| טאבים | 9 | 9 | 0 | 0 | חברתי-רגשי/התנהגות מכילים שקעים מוצהרים |
| מצבים-מיוחדים | 9 | 9 | 0 | 0 | שגיאה = ייבוא-כושל (מסלול-אמת) · פרטיות-נעולה · כפילות · ייבוא-בתהליך |
| הרשאות | 8 | 7 | 1 | 0 | 6 תפקידים + לוג-חשיפה ✅ · הצפנה-במנוחה = תפר-ההתמדה |
| אוטומציות | 11 | 11 | 0 | 0 | קפיצת-סיכון · כפולים+מיזוג · ימי-הולדת · אישורים · אחים · ללא-הערה-90 · דוח · percentile · מעבר-שנה |
| אינטגרציות | 6 | 4 | 2 | 0 | ציונים⇒סיכון · גבייה⇒דגל-חוב = שקעים; מונים חשופים ב-`StudentsScreen.counters` |
| ציוני-חוץ (רשימת-השמורים) | 1 | 0 | 1 | 0 | ת״ז ותיק-רפואי מהרשימה — **בנויים** (מוגנים) |
| **סה״כ** | **135** | **118** | **17** | **0** | תואם-מפרט 118/135 · מקום-שמור 17 · ❌ 0 |

## באגים שנתפסו ברנדר/בבדיקה (לא בקומפילציה) — THE-WAY §6
1. רשומת-המתנה (`wait`) נספרה כפעילה ⇒ סטטוס 'ממתין/ה' לארכיון. 2. אות-נוכחות על 3 מפגשים = 40 נק׳ מחיסור-אחד ⇒ `minSample=5`.
3. `BareStat` (Expanded) ב-Column ⇒ קריסת-layout ⇒ Row. 4. תוויות ארוכות בגיליון ≤640px (Material) ⇒ תוויות קצרות.
5. רשימות-seed הוסקו `Map<String,Object>` ⇒ TypeError במיזוג-כפולים ⇒ טיפוס מפורש. 6. שקע-db מתחלף בלי `didUpdateWidget` ⇒ דאטה ישנה.

## מקור-האמת של האטומים
- **לוגיקה (dart-maor, 37):** ageOf · gradeOrder · gradeIndex · clampScale · grandTotal · countBy · trendFromScan · enrollSummary · monthKey · taskOverdue · cockpitDaysSince · formatIsraeliPhone · fmtDate · nameSortKey · normSearch · presentsInMonth · studentHistory · academicYearLabel · waLink · waDigits · telHref · parseCsv · smartFilter · smartScore · finderMatches · numMatch · normPhone · roleOf · canGrantedAction · findDuplicateGroups · mergeFamilies · normName · cockpitAtRisk · supScoreBins · toCsv · csvEscape · exportAllowed.
- **תצוגה (dart-ui-bs, 22):** DsScaffold · DsSection · DsSearch · DsTable · DsField · DsEnumField · BareStat · StatHero · GradientCard · GlassCard · SoftButton · SegmentedSwitch · AlertBanner · StatusChip · EmptyState · MediaRow · StatRow · TimelineItem · ExpandableTile · PremiumAvatar · GaugeMeter · NeonBars · FilterChipPill · CircularProgressIndicator (מסגרת).
- **מזייפים שנדחו:** StatBlock · LinearProgress · RadialGauge · BarChart · Sparkline · DataGrid · TimelineFlow · ShimmerSkeleton · TrendStat (אחוז, לא ימים/מגמת-נוכחות בפורמט-הנכון — הוחלף ב-BareStat). `cockpitAtRisk` מדלג על "מי שמעולם-לא" ⇒ הורכב ∪ ללא-הערה-מתוארכת.

## מה לא אומת / גבולות
- הרנדרים צולמו ב-800×1200 (משטח-GL תוכנתי בסנדבוקס נכשל ב-2400); אמוג׳י = קופסאות (פונט-סנדבוקס, CDN חסום) — טקסט ומספרים אומתו בעין מול הדאטה.
- התמדה (pushAuditRing/encryptDoc/Firestore) לא מחוברת — פנקסים בזיכרון; `reset()` משחזר seed. ייבוא = הדבקת-CSV (אין file-picker בסנדבוקס).
- `percentile` בשכבה של <2 תלמידים מחזיר 50 (מוצהר). דוח-יועץ/מעבר-שנה/כרטיס-הדפסה = טקסט (SelectableText), לא PDF.
- ניווט-ביתי ורישום-חלקיקים במנוע = של המנהל (לא נגעתי ב-`schoolos.dart`/`compose-engine.mjs`).

## אימות
`flutter analyze --no-fatal-infos lib/genesis/dart-gen-bs/schoolos_students.dart` ⇒ No issues found · `flutter test test/genesis_students_test.dart` ⇒ 5/5 ·
`police --fast` ירוק בכל commit (22 ran · 0 yellow) · `pre-push` משטרה-מלאה ירוקה (29 ran) · כרטיס-מטרה חתום (`machtzev/audit/goals/schoolos_students.json`).
