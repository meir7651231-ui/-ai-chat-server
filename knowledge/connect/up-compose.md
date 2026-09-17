# up-compose — צעד 8 לצרכים חיצוניים: חלקיק שהוכח ⇒ קוד Dart, לכל מטרה ולא רק לרשימה הקשיחה

הוראת-הבעלים: "תתן ובוא נראה" (20:30) ⇒ מטרה אחת דרך עשרת הצעדים; "לא קיים ≠ לא אפשרי" (20:55). ענף claude/up-connect-260917.
המטרה: "כל בוקר לדעת אילו תשלומי הורים באיחור מעל 30 יום, כמה הם חייבים בסך הכל, ולשלוח לכל אחד תזכורת בוואטסאפ עם הסכום". כל מספר עם פקודה; DART=/root/dart-sdk/bin/dart.

## מה נמדד לפני (השרשרת על המטרה)
| צעד | מנוע | תוצאה |
|---|---|---|
| 1 פסק | `node yeshiva/purpose.mjs "<מטרה>"` | 0 שקעי-חובה · 0 מקורות · 3 מתגים לא-הוכרעו (הישיבתי מוצא שדות רק דרך חבילות-ורטיקל ⇒ סכמה; למטרה אין מסמך) |
| 2 פירוק | `node gen/build.mjs goal.txt` (המחולל השני) | ספק שגוי: «ישות ולשלוח אחד תזכורת בוואטסאפ» ⇒ הוכיח norm-search/csv (לא רלוונטי). המפרקים מניחים «ישות עם שדות», לא מטרה |
| 2 פירוק (חוזה-הבעלים) | ידני: 6 חלקיקים עם דוגמאות (scratchpad/goal/goal-needs*.json) | אין מנוע שמפיק דוגמאות ממטרה — ובצדק (הכרעה 20-ג: דוגמה = חוזה, לא ממציאים) |
| 4 חיפוש | `node machtzev/search-record.mjs "daysSince days ימים מאז תאריך" --top 5` (וכו') | isoDaysAgo · daysBetweenDst · taskOverdue/isOverdue · campaignTotal/boqTotal · SendReportButton |
| 5-7 הוכחה-בריצה + בחירה + הרכבה | `node machtzev/generator/behavior-plan.mjs --needs goal-needs.json` (2:18) · `--needs goal-needs2.json` (1:40) | g1 `cockpitDaysSince(p0,now)` ✓ · g2 ∅ ⇒ עם שקע-ליטרל 30: **`cmpGtStr(now,addDaysIso(p0,30))`** ✓ (4 עצים שקולים · קלט-מבחין `"a"`) · g3 סינון-רשימה ∅ · g4 סכום-שדה ∅ (אין `sum*` במדף; רק boxTotal/grandTotal/subsidyTotal דומייניים) · g5 `pp(p1,p0)` ✓ חלש · g6 `addTo(w,addDyn(p0,p1))` ✓ חלש |
| 8 חיווט ⇒ Dart | behavior-compose | **פער**: קרא רק את NEEDS הקשיח של «בלגן» ⇒ לצרכים חיצוניים התכנית נשארה JSON |

## מה שודרג (מנועים קיימים)
1. **logic-proof.mjs — `treeDart(root, i, rel)`**: הרנדרר עץ⇒Dart שהיה סגור בתוך `proveFile` יוצא כפונקציה מיוצאת אחת (p·c·t·h·w·g·f·a — אותו מיפוי-שקעים). הרתמה קוראת לה — לא עותק שני. רגרסיה: `--needs g1` ⇒ אותו pick.
2. **behavior-compose.mjs — `--plan <plan.json> --out <file.dart>`**: לכל צורך מוכח פונקציה `bh<שם>`: חתימה מ-`need.params/ret` + שקעים כפרמטרים (`now` לשעון · `w` לעולם · שם-האדם לאדם), גוף = העץ דרך `treeDart`, ייבואים = קובצי-האטומים (`as cN`). **הידוק-טיפוס מהצנזוס**: פרמטר-צורך `num` שזורם ישירות לשקע `int`/`double` של האטום ⇒ החתימה מהודקת לטיפוס-האטום (לא המרה שקטה; נמדד: `pp(int,String)` מול `num` ⇒ שגיאת-קומפילציה). ובנוסף `<out>_proof.dart`: `main()` עם `assert` לכל דוגמה מהחוזה — הדוגמאות שהוכיחו את הבחירה מוכיחות גם את ההרכבה. צורך בלי pick ⇒ נרשם ∅ בכותרת, לא מומצא.

## אחרי
| פקודה | תוצאה |
|---|---|
| `node machtzev/generator/behavior-compose.mjs --plan goal-plan.json --out new/dart-gen-bs/gen_goal_payments.dart` | 4 התנהגויות (bhOverdueDays · bhOverdue30 · bhReminder · bhSendReminder) · ∅ 2 · 12 דוגמאות-הוכחה |
| `dart analyze new/dart-gen-bs/gen_goal_payments.dart` | No issues found |
| `dart run --enable-asserts new/dart-gen-bs/gen_goal_payments_proof.dart` | ✓ 12 דוגמאות · 4 התנהגויות |
| במראה-buildsmart (`flutter analyze`) | **No issues found** — אחרי כלל-המראה החדש (G48ב ב-ship.mjs: המראה עוקבת אחרי הייבואים של כל gen_*; לפני: 3 שגיאות-URI על op-cmp-gt-str · op-add-to · op-add-dyn שלא היו במראה) |

## מה נשאר (לא "לא אפשרי" — לא נעשה)
- **פסק ופירוק למטרה חופשית** (צעדים 1-2): purpose/tzinor/gen-sentence מניחים «ישות עם שדות». מטרה עם פעולות («לדעת», «לשלוח», «כל בוקר») — סוג-קלט שאין לו עוד תחביר. שדרוג המפרק, לא מנוע חדש.
- **שני חלקיקי-יסוד חסרים במדף**: «סכום של שדה על רשימה» (אין `sum*` כלל) ו«סינון לפי איחור» (עץ 3 צמתים + למבדה; `whereList`/`fieldOf` קיימים, ההרכבה לא נמצאה בתקרה). הראשון = חציבה/הכללה (צעד 3/7); השני = תקרת-עומק במתכנן.
- **צעד 10** — ההתנהגויות עדיין לא נצרכות ממסך מחולל (app-ds) — חיווט למסך.
