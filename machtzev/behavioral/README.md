# 🏅 רתמת-זהב · בדיקות-התנהגות (golden)

מוכיח ש**"מתקמפל" = "עובד"** על אפליקציה-מחוללת — הפער שבין `flutter analyze`
(מבנה) לבין התנהגות-אמת (שמירה→טבלה, נוסחה מחשבת, מסע מתקדם).

**הרצה:** `node machtzev/behavioral/run.mjs` (מזריק ל-buildsmart ומריץ `flutter test`).

- `gen_store_behavior_test.dart` — מוח-הריצה `AppStore`: מזהה · byId · update · removeById ·
  sum/avg · referencing(קשר-הפוך) · options/displayOf(מפתח-זר) · advance/setStage · notify. (12/12)
- `gen_widget_behavior_test.dart` — לולאת דפוס-המסך: הקלדה→שמירה→הרשומה מופיעה בטבלה. (1/1)
