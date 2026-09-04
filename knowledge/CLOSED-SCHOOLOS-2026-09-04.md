# 🏫 סגירה · SchoolOS — אפליקציה אחת מחווטת מקצה-לקצה (4.9.2026)

> **הכרעת-בעלים:** "תסיים את הבית-ספר … בסשנים משלהם … עד שהכל בנוי ללא עצירות" + "אפליקציה מלאה עובדת מחווטת מקצה לקצה לפי הדרך".
> המנהל כתב 8 מפרטי-מקסימום (`SPEC-*-FULL`), 8 סשני-בנאי בנו מודול-לכל-אחד בדרך (THE-WAY), המנהל חיווט (כותב-יחיד) ואימת בבייטים.
> מגילת-התהליך: `SCHOOLOS-ORCHESTRATION-2026-09-04.md` (§7 פרק-המנהל) · לקח-התהליך: `machtzev/LEARNINGS.md` L48.

## מה בנוי (בייטים · שני הריפו · ענף `claude/hei-rxv1v1`)
| מסך | קובץ (גנסיס `new/dart-gen-bs/`) | דוח-סגירה | תואם-מפרט | בדיקות-widget (buildsmart) | DONE-מאומת-מנהל |
|---|---|---|---|---|---|
| 📦 מלאי | `schoolos.dart` (`_Inventory`) | CLOSED-INVENTORY-2026-09-03 | 11 גלים | inventory_states 1 | ✅ (3.9) |
| 📊 לוח-הנהלה | `schoolos_dashboard.dart` | CLOSED-DASHBOARD | טבלה כנה | 8 | ✅ |
| 🎓 תלמידים | `schoolos_students.dart` | CLOSED-STUDENTS | 118/135 · שמור 17 · ❌0 | 11 (כולל 6 §6) | ✅ |
| 👪 הורים | `schoolos_parents.dart` | CLOSED-PARENTS | 108/119 · שמור 10 · ❌1 (=חיווט-המנהל) | 13 | ✅ |
| 🚪 חדרים | `schoolos_rooms.dart` | CLOSED-ROOMS | 100/116 · שמור 16 · ❌0 | 7 (כולל autoRelocate) | ✅ |
| 📋 נוכחות | `schoolos_attendance.dart` | CLOSED-ATTENDANCE | 109/123 · שמור 14 · ❌0 | 5 (חוב-§6 נסגר) | ✅ |
| 💳 גבייה | `schoolos_fees.dart` | CLOSED-FEES | 101/113 | 10 (חוב-§6 נסגר) | ✅ |
| 📚 חוגים/מערכת | `schoolos_courses.dart` | CLOSED-COURSES | 119/133 · שמור 14 · ❌0 | 7 | ✅ |
| 👩‍🏫 מורים | `schoolos_teachers.dart` | CLOSED-TEACHERS (82a24c8c, אחרי הערה 12:52Z) | 104/121 · שמור 17 · ❌0 | 18 | ✅ |

**החיווט (המנהל):** `_Home` ⇒ 9 `DsNavTile` ⇒ `Navigator.push` לכל מסך; `_Students` הדק הוחלף ב-`StudentsScreen`; KPI ביתי מומצא (`'1,248'`) הוחלף בעובדת-אמת (9 מסכים מחוברים — לקח M4 goal-proof-af3c91).
**אימות-קצה-לקצה (THE-WAY §6, לא "מתקמפל"):** `genesis_schoolos_nav_test.dart` — בית⇒מסך⇒חזרה ל-9/9 מסכים, אפס-חריגות-רנדר; תפס טעות-בודק (V5: `.first` פגע ב-KPI). `flutter analyze lib/genesis/dart-gen-bs` = **No issues** · **84/84** בדיקות-genesis · police --fast ירוק · כרטיס-מטרה `machtzev/audit/goals/schoolos.*` עם golden-render 800×1400 של הבית המחווט.

## מה **לא** נסגר (D3 · אמור-מה-לא-בדקת)
- ~~CLOSED-TEACHERS~~ — נחת 13:05Z (104/121 · ❌0 · 18/18 אצל המנהל) ⇒ **9/9 מסכים DONE-מאומת-מנהל**.
- **רישום חלקיקי-8-המודולים ב-`compose-engine.mjs`** — ראצ׳ט-מוצהר שלא בוצע במסגרת-הזמן (ה-`--gate` compose-determinism נשאר על 25 חלקיקי-המלאי). זה חוב-הדרך הפתוח הבא.
- **חיבורי-בין-מודולים** (dashboard⇐נתוני-מודולים חיים · attendance⇐riskExternal מתלמידים · rooms⇐חוגים חיים): כל מודול מקבל אותם כשקעי-חוזה (מקום-שמור, חוק-7) — עדיין דמו-דאטה בצורת-מאור, לא מוזרם בין המסכים.
- רנדר-דפדפן (`flutter build web` + Playwright) של הבית-המחווט לא צולם — אומת ב-golden-render של widget-test (אמוג׳י=ריבועים בסנדבוקס).

## עלות/מכסה (L48)
8 בנאים × ~$30–54 (Fable, 470–590K הקשר) · מסיים-מורים Sonnet $0.22 (ללא ריפו — נכשל) · הצי כולו קפא 04:10→06:30Z על מכסת-5-שעות; 13:00Z איפוס-7-ימים.
