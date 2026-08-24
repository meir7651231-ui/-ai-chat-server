// ⚛️ אטום-Dart (דרגת-חוזה) · expFieldDefs — הגדרות-שדות (key+label) של "הדו"ח
// המותאם" לפי יעד: חוגים / אירועים / תומכות.
// מוצא: maor/src/lib/customExport.ts:36-126 · המקור: new/atoms/exp-field-defs.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (רק שפה/סטנדרט: dart:core). חוק-4 —
//        התנהגות זהה-ביט למקור-ה-JS (המקור קדוש). חמשת השכנים
//        featureOn/termOf/featLabel/itemLabel/unitLabel הוזרקו כשקעים (חוק-1/חוק-3).
//
// תפקיד: הדגל 'reports.custom.full' (חסר=פעיל) בוחר רשימה מלאה או מקוצרת; ביעד
//        תומכות שדות מעקב-הטיפול נוספים רק כשדגל 'supporters.ayin' דלוק. התוויות
//        עוברות דרך מילון-המונחים (termOf) והשקעים.
// קלט:  cfg · target∈{'courses','events','supporters'} + חמשת השקעים.
// פלט:  List<Map<String,String>> — כל איבר {'key':…, 'label':…}.
//
// הערות-המרה (מקור→Dart):
//  • אובייקט-JS {key, label} → Map<String,String> ‏({'key':…, 'label':…}). כל שדה
//    הוא זוג-מחרוזות בלבד ⇒ אין דו-משמעות-טיפוס.
//  • שרשור-מחרוזות `'א' + termOf(...)` → אותו `+` ב-Dart (String+String) זהה-ביט.
//  • `!full` → `!full` — full הוא bool מהשקע featureOn ⇒ truthiness-JS אינה מעורבת
//    (השקע מחזיר bool אמיתי, לא ערך-נפילה); אין צורך ב-_falsy. אין locale/פורמט/
//    getMonth/מיון/תאריך ⇒ אף אחד מ-7 מלכודות-ההמרה אינו רלוונטי כאן.
//  • מוטביליות: `defs` הוא var מקומי (final list עם push/add) — הרשימה משתנה,
//    ההצבעה קבועה; `full`/`ayinOn` הם final.
//  • שקעי-הקריאה-לשכן: פרמטרי-פונקציה — לא import (חוק-3).

/// Field definitions (key+label) for the "custom report", by target:
/// courses / events / supporters. Verbatim port of new/atoms/exp-field-defs.mjs.
/// The five neighbour calls are injected as sockets (Law 1/3).
List<Map<String, String>> expFieldDefs<C>(
  C cfg,
  String target,
  bool Function(C, String) featureOn,
  String Function(C, String, String) termOf,
  String Function(C) featLabel,
  String Function(C) itemLabel,
  String Function(C) unitLabel,
) {
  final full = featureOn(cfg, 'reports.custom.full');
  if (target == 'courses') {
    if (!full) {
      return [
        {'key': 'name', 'label': 'שם החוג'},
        {'key': 'teacher', 'label': 'מורה + טלפון'},
        {'key': 'model', 'label': 'מסלול ומחיר'},
        {'key': 'occ', 'label': 'תפוסה'},
        {'key': 'students', 'label': 'רשימת ' + termOf(cfg, 'entity.students', 'תלמידים')},
        {'key': 'pays', 'label': 'תשלומים בטווח'},
        {'key': 'abs', 'label': 'חיסורים בטווח'},
      ];
    }
    return [
      {'key': 'name', 'label': 'שם ה' + termOf(cfg, 'entity.course', 'חוג')},
      {'key': 'teacher', 'label': termOf(cfg, 'entity.teacher', 'מורה') + ' + טלפון'},
      {'key': 'grade', 'label': 'כיתות'},
      {'key': 'audience', 'label': 'קהל יעד'},
      {'key': 'room', 'label': termOf(cfg, 'entity.room', 'חדר')},
      {'key': 'schedule', 'label': 'יום ושעה'},
      {'key': 'model', 'label': 'מסלול ומחיר'},
      {'key': 'occ', 'label': 'תפוסה'},
      {'key': 'students', 'label': 'רשימת ' + termOf(cfg, 'entity.students', 'תלמידים')},
      {'key': 'studentsFull', 'label': termOf(cfg, 'entity.students', 'תלמידים') + ' + טלפון + יתרה'},
      {'key': 'pays', 'label': 'תשלומים בטווח'},
      {'key': 'revenue', 'label': 'סה"כ הכנסות'},
      {'key': 'abs', 'label': 'חיסורים בטווח'},
      {'key': 'notes', 'label': 'הערות'},
    ];
  }
  if (target == 'events') {
    return [
      {'key': 'title', 'label': 'כותרת'},
      {'key': 'type', 'label': 'סוג אירוע'},
      {'key': 'hdate', 'label': 'תאריך עברי'},
      {'key': 'gdate', 'label': 'תאריך לועזי'},
      {'key': 'time', 'label': 'שעה'},
      {'key': 'fam', 'label': termOf(cfg, 'entity.family', 'משפחה')},
      {'key': 'notes', 'label': 'הערות'},
      {'key': 'done', 'label': 'בוצע'},
    ];
  }
  final ayinOn = featureOn(cfg, 'supporters.ayin');
  if (!full) {
    final defs = <Map<String, String>>[
      {'key': 'name', 'label': 'שם'},
      {'key': 'phone', 'label': 'טלפון'},
      {'key': 'email', 'label': 'אימייל'},
      {'key': 'dons', 'label': termOf(cfg, 'entity.donations', 'תרומות') + ' בטווח (מספר + סכום)'},
    ];
    if (ayinOn) {
      defs.add({'key': 'stage', 'label': 'שלב ' + featLabel(cfg)});
      defs.add({'key': 'names', 'label': itemLabel(cfg) + ' + ' + unitLabel(cfg)});
      defs.add({'key': 'answers', 'label': 'תשובות/הערות בטווח'});
      defs.add({'key': 'next', 'label': 'תאריך יעד לקשר'});
    }
    return defs;
  }
  final defs = <Map<String, String>>[
    {'key': 'name', 'label': 'שם'},
    {'key': 'phone', 'label': 'טלפון'},
    {'key': 'email', 'label': 'אימייל'},
    {'key': 'address', 'label': 'כתובת'},
    {'key': 'city', 'label': 'עיר'},
    {'key': 'cat', 'label': 'קטגוריה'},
    {'key': 'forWho', 'label': 'עבור מי'},
    {'key': 'dons', 'label': termOf(cfg, 'entity.donations', 'תרומות') + ' בטווח (מספר + סכום)'},
    {'key': 'donsAll', 'label': 'סה"כ ' + termOf(cfg, 'entity.donations', 'תרומות') + ' (כל הזמן)'},
    {'key': 'tier', 'label': 'דירוג'},
  ];
  if (ayinOn) {
    defs.add({'key': 'stage', 'label': 'שלב ' + featLabel(cfg)});
    defs.add({'key': 'names', 'label': itemLabel(cfg) + ' + ' + unitLabel(cfg)});
    defs.add({'key': 'eyesTotal', 'label': 'סה"כ ' + unitLabel(cfg)});
    defs.add({'key': 'paid', 'label': 'שולם'});
    defs.add({'key': 'answers', 'label': 'תשובות/הערות בטווח'});
    defs.add({'key': 'next', 'label': 'תאריך יעד לקשר'});
  }
  defs.add({'key': 'notes', 'label': 'הערות'});
  return defs;
}
