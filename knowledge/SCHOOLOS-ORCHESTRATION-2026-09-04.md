# 🏗️ SchoolOS · מגילת-סשן-הבנאי (הכרעת-בעלים 4.9.2026 — "האפיון אצל המנהל, השאר אצל הסשנים")
> **אתה סשן-בנאי** של מודול-אחד ב-SchoolOS. המנהל (סשן-האורקסטרציה) כתב לך **מפרט-מקסימום** = *מה*.
> **אתה עושה את *איך*** — הדרך (THE-WAY) במלואה, לבד, בלי לשאול, עד DONE. **אין קיצורים, נקודה.**

## 0. קרא לפני שנוגע בקוד (בסדר הזה — חובה)
1. `machtzev/VERIFY-LAWS.md` — טענה=בייטים · ספור-אל-תעריך · האינדקס=אורקל · אמור-מה-לא-בדקת.
2. `LAW.md` — 7 חוקים + **הכרעה 23-ב/ג/ד** (הרכבה-רקורסיבית · שילוב-מכמה-אטומים · מקסום=חיבור-מודלים · חיפוש-לפני-"אין").
3. `machtzev/THE-WAY.md` — 7 הצעדים.
4. `knowledge/CLOSED-INVENTORY-2026-09-03.md` + `knowledge/COMPOSE-INVENTORY-2026-09-03.md` — **הזהב.** מסך-המלאי הוא הסטנדרט: כך נראית יכולת שנבנתה בדרך. `new/dart-gen-bs/schoolos.dart` = הקוד-הדוגמה (מבנה `_InvData` לוגיקה-טהורה + State; `columnDefs`/`metaFields` = מקום-שמור; `curOf` פנקס-התאמות).
5. **המפרט שלך** `knowledge/SPEC-<MODULE>-FULL-2026-09-04.md` — ה-SSOT. כל סעיף בו = או ✅ בנוי, או **מקום-שמור** (חוזה-דאטה), או ❌ עם *סיבת-§20-ג* מפורשת. אין "שכחתי".

## 1. הדרך — לא לדלג על צעד
1. **מטרה** — `מטרת-המסך` שבמפרט; חדד לליבה (ערך/תוצאה, לא צורה).
2. **פעולות-יסוד** — פרק ל-5–7 פעולות (איתור·הערכה·חריגה·הכרעה·ביצוע·אימות…). לא לאזורי-המפרט.
3. **חיפוש-מלא לפני בחירה** — `new/dart-maor/` (1324 מנועי-לוגיקה) + `new/dart-ui-bs/` (557 אטומי-תצוגה) + `machtzev/generator/atom-index-full.json` (1402, האורקל). מאור **וגם** בנייה-חכמה. **"אין אטום" = "לא-חיפשת".** לכל פעולה: הכי-טוב-לייעוד **בשתי-השכבות** (תצוגה+לוגיקה).
4. **הרכבה** — חלקיק-תובנה = **כמה** אטומים (תצוגה⊕לוגיקה), לעולם לא אטום-יחיד. עובדה (תווית+ערך) = אטום-יחיד לגיטימי. **מודלים מרובים ⇒ מחברים בהחלטה**, לא בוחרים.
5. **חיווט דרך שקעים** — אפס-ציור-ביד (Container/Text כתחליף-ליכולת = כשל). זהות/קשר/סודות = מוזרקים (חוק-6). אין `Date.now` במנוע (הזרק today).
6. **אימות-מול-המטרה ברנדר** — `flutter build web` + צילום-Playwright (ראה `scratchpad`-דוגמאות בהיסטוריה) **או** בדיקת-widget ב-buildsmart. "מתקמפל" ≠ מאומת. הרנדר תפס במלאי 3 באגים שהקומפילציה פספסה.
7. **באג → שורש בבייטים.**

**מזייפים אסורים** (מציגים ערך בלי שקע-דאטה): `stat_block` `linear_progress` `radial_gauge` `bar_chart` `sparkline` `DataGrid` `timeline_flow` `ShimmerSkeleton`. תחליפים-אמת: BareStat · StatRow · NeonBars · DsTable · TimelineItem · CircularProgressIndicator.
**מקום-שמור (חוק-7):** שדה/מצב/יכולת חסר-נתון = שקע בחוזה-דאטה (כמו `columnDefs`) — מאיר כשיגיע נתון. **לא מזייפים, לא משמיטים.** דמו-דאטה = ריאליסטית, רק שדות עם מקור-אמת.

## 2. בעלות-קבצים (דיסjoint — אפס-התנגשויות; L5)
| מודול | מפרט | **הקובץ היחיד שלך** | מחלקה ציבורית |
|---|---|---|---|
| תלמידים | SPEC-STUDENTS-FULL | `new/dart-gen-bs/schoolos_students.dart` | `StudentsScreen` |
| נוכחות | SPEC-ATTENDANCE-FULL | `new/dart-gen-bs/schoolos_attendance.dart` | `AttendanceScreen` |
| חוגים/מערכת | SPEC-COURSES-FULL | `new/dart-gen-bs/schoolos_courses.dart` | `CoursesScreen` |
| מורים | SPEC-TEACHERS-FULL | `new/dart-gen-bs/schoolos_teachers.dart` | `TeachersScreen` |
| חדרים | SPEC-ROOMS-FULL | `new/dart-gen-bs/schoolos_rooms.dart` | `RoomsScreen` |
| גבייה | SPEC-FEES-FULL | `new/dart-gen-bs/schoolos_fees.dart` | `FeesScreen` |
| הורים | SPEC-PARENTS-FULL | `new/dart-gen-bs/schoolos_parents.dart` | `ParentsScreen` |
| לוח-הנהלה | SPEC-DASHBOARD-FULL | `new/dart-gen-bs/schoolos_dashboard.dart` | `DashboardScreen` |
- הקובץ **יושב לצד** `schoolos.dart` ⇒ אותם imports יחסיים (`../dart-ui-bs/...`, `../dart-maor/...`). חשוף **מחלקה ציבורית אחת** (`const XScreen()`), ללא `main()`.
- **אסור לגעת ב:** `schoolos.dart` · `machtzev/compose-engine.mjs` · `machtzev/pins.sha256` · `TRUTH.md` · `CLAUDE.md` · `LAW.md` · קבצי-מודולים-אחרים. **המנהל** מחבר ניווט-ביתי ורושם חלקיקים במנוע. (אם המשטרה דורשת `truth.mjs --write`/`pins-check --write` אחרי rebase — מותר, זה שוטר, לא עריכה.)
- **בדיקת-widget** (רצוי): `/home/user/buildsmart/app_flutter/test/genesis_<module>_test.dart` — משטח 800×2400, `pump` מפורש (לא `pumpAndSettle`, אטומים מונפשים).

## 3. הריפו והענף (שני הריפו, אותו ענף)
```bash
export PATH="/home/user/flutter/bin:$PATH"
git fetch origin claude/hei-rxv1v1 && git checkout claude/hei-rxv1v1 && git pull --rebase origin claude/hei-rxv1v1
cd /home/user/buildsmart && git fetch origin claude/hei-rxv1v1 && git checkout claude/hei-rxv1v1 && git pull --rebase origin claude/hei-rxv1v1
```
**מראה:** אחרי כל גל — `cp new/dart-gen-bs/schoolos_<m>.dart /home/user/buildsmart/app_flutter/lib/genesis/dart-gen-bs/` ⇒ `cd /home/user/buildsmart/app_flutter && flutter analyze --no-fatal-infos lib/genesis` (**אפס errors**) ⇒ commit+push גם ב-buildsmart.

## 4. משמעת-git (סשנים מקבילים דוחפים לאותו ענף — זה נורמלי)
- לפני **כל** commit: `node machtzev/police.mjs --fast` ירוק (pre-commit אוכף; אם `[truth]`/`[pins]` אדום אחרי rebase ⇒ `node machtzev/truth.mjs --write && node machtzev/pins-check.mjs --write` ואז commit).
- לפני **כל** push: `git fetch origin claude/hei-rxv1v1 && git rebase origin/claude/hei-rxv1v1` (התנגשות בקובץ-שלך לא אמורה לקרות — הוא רק שלך).
- push **בלי pipe**: `git push -u origin claude/hei-rxv1v1; echo EXIT=$?` — `| tail` מסתיר דחייה. נדחה ⇒ fetch+rebase+push שוב (עד 4 ניסיונות).
- הודעת-commit: `גל N · <מודול> · <מה> — <הרכבה>` בעברית + הפוטר שההרנס שלך מכתיב (Co-Authored-By + Claude-Session).
- commit+push **אחרי כל גל**, לא בסוף. אין עבודה לא-שמורה.

## 5. גלים (כמו במלאי — כל גל: בנייה→אנלייז→רנדר→משטרה→commit→push)
1 דאטה-אמת + KPI · 2 רשימה/גריד/גיליון מרכזי · 3 פאנל-נבחר + פעולות · 4 איתור+חריגה (חיפוש/פילטרים — **מנועי-מדף**, לא `.contains`) · 5 מצבים+הרשאות · 6 אוטומציות · 7 מקום-שמור לכל עמודה/מצב חסר-נתון · 8 בדיקת-widget + דוח-סגירה.

## 6. אוטונומיה וסיום
- **לא שואלים את האדם.** לולאה ירוקה+push. עוצרים רק על באג-אמת שלא נפתר ב-3 ניסיונות (אז מתעדים ב-`knowledge/BLOCKED-<MODULE>.md` וממשיכים לגלים אחרים).
- **DONE** = כל סעיף במפרט ✅/מקום-שמור/❌-עם-סיבה · `knowledge/CLOSED-<MODULE>-2026-09-04.md` (טבלת בנוי-מול-יעד **כנה**, מקורות-האטומים, מה-לא-אומת) · שני הריפו pushed (ref 0/0).
- ההודעה האחרונה שלך, מילה-במילה: `DONE <MODULE> · genesis <sha> · buildsmart <sha> · תואם-מפרט N/M · מקום-שמור K · ❌ J`.
