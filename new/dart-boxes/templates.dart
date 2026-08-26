// 📦 קופסת-חיבורים · templates (תבניות-ההודעה) — מחווטת 3 אטומי-Dart.
// מקבילה ל-new/boxes/templates.mjs. חוזה משותף: new/boxes/templates.contract.md.
// מקור-האמת: maor/src/lib/templates.ts:19-67.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// הכרעות-החיווט (זהות ל-mjs):
//  1) מילון-התבניות היחיד = TEMPLATE_DEFS (הנוסחים ההיסטוריים ביט-זהה; templates.ts:19-52).
//     סדר-ההגדרה קובע את סדר-המפתחות ואת סדר-ההצגה.
//  2) רשימת-המפתחות נגזרת מהמילון דרך templateKeys — לעולם לא מוקלדת-ידנית (templates.ts:54).
//  3) רינדור: אותו מילון מוזרק לשקע-defs של renderTemplate האטומי (templates.ts:57-66).
//
// ⚠️ גבול-פלטפורמה (חוק-6): הקופסה טהורה — טעינת-הקונפיג (localStorage/ענן) ושליחת-ההודעה
//   (wa.me) הם שקעי-IO של לוח-האם, לא כאן. מה שמוכח = הרינדור, חוצה-שפות זהה-ביט.
import '../dart-maor/template-defs.dart' as td;
import '../dart-maor/template-keys.dart' as tk;
import '../dart-maor/render-template.dart' as rt;

// ── חשיפה 1: מילון-התבניות (re-export של האטום; templates.ts:19-52) ──────────
// ignore: non_constant_identifier_names
List<dynamic> get TEMPLATE_DEFS => td.templateDefs;

// ── חשיפה 2: רשימת-המפתחות הנגזרת (templateKeys(TEMPLATE_DEFS); templates.ts:54) ─
// ignore: non_constant_identifier_names
final List<dynamic> TEMPLATE_KEYS = tk.templateKeys(td.templateDefs);

// ── מילוי-שקע-defs לרינדור: המילון מוצמצם ל-{key, def} — renderTemplate האטומי
//   קורא רק 'key' ו-'def'. זו דאטת-החיווט (חוק-5), בדיוק כמו ב-wa.dart/templates.mjs.
final List<Map<String, String>> _defs = [
  for (final d in td.templateDefs)
    {'key': d['key'] as String, 'def': d['def'] as String},
];

/// חשיפה 3: רינדור תבנית-הודעה. דריסת-הארגון (cfg['templates'][key]) גוברת;
/// ריק/רווחים ⇒ ברירת-המחדל; משתנה לא-מוכר נשאר {כפי-שהוא}.
/// גישור-טיפוס: cfg(dynamic)→Map<String,dynamic>? · vars-ערכים→String (כמו ה-join ב-JS).
String renderTemplate(dynamic cfg, String key, Map<String, dynamic> vars) {
  final Map<String, dynamic>? c =
      cfg == null ? null : (cfg as Map).cast<String, dynamic>();
  final sv = <String, String>{};
  vars.forEach((k, v) => sv[k] = v is String ? v : '$v');
  return rt.renderTemplate(c, key, sv, _defs);
}
