import '../dart-data-maor/guide-sections-of-terms.dart';
// 📦 קופסת-חיבורים · המדריך המהיר 📖 (Dart) — מחווטת אטומי-Dart. מקבילה ל-new/boxes/guide.mjs.
// חוזה משותף: new/boxes/guide.contract.md. מקור-האמת: maor/src/lib/guide.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// ההכרעות (swap · מילון-RECIPE_SWAPS · הסדר-הוא-המשמעות) חיות כאן בלבד (LAW חוק-5) —
// verbatim מ-guide.mjs, לא אטומים. הקבועים והחוטים מוזרקים כשקעים (חוק-1).
import '../dart-maor/guide-intro-label.dart' as gil;
import '../dart-maor/guide-intro.dart' as gin;
import '../dart-maor/guide-sections.dart' as gsc; // הקבוע (getter guideSections)
import '../dart-maor/guide-recipes-label.dart' as grl;
import '../dart-maor/guide-recipes.dart' as grc;
import '../dart-maor/guide-foot.dart' as gf;
import '../dart-maor/guide-sections-of.dart' as gso; // הפונקציה (guideSections)
import '../dart-maor/term-of.dart' as tof;

// ── החיווט ──
// swap — הכרעת-הקופסה (guide.ts:91-93): החלפת תת-מחרוזת גלובלית בלי regex.
// מוזרק כשקע לחוט guide-sections-of (החוט הצהיר עליו, הקופסה מספקת).
String _swap(String s, String from, String to) => s.split(from).join(to);

// מתאם-טיפוס: term-of מחזיר dynamic (תמיד String) — החוט guide-sections-of דורש
// String Function(Map<String,dynamic>, String, String). התוצאה תמיד String ⇒ cast בטוח.
String _termOf(Map<String, dynamic> config, String key, String fallback) =>
    tof.termOf(config, key, fallback) as String;

// מילון-ההחלפות של "המתכונים המהירים" (guide.ts:124-132) — הכרעת-הקופסה.
// הסדר הוא *המשמעות* (כל החלפה רצה על תוצאת קודמתה) — סידור-מחדש = שינוי-מוצר.
// שורה: [from, קידומת, מפתח-termOf, fallback, סיפא] ⇒ ההחלפה = קידומת+T(מפתח,fallback)+סיפא.
const List<List<String>> _recipeSwaps = [
  ['ליד השיבוץ', 'ליד ה', 'entity.enrollment', 'שיבוץ', ''],
  ['כדי שיבוץ', 'כדי ', 'entity.enrollment', 'שיבוץ', ''],
  ['משפחה חדשה', '', 'entity.family', 'משפחה', ' חדשה'],
  ['חוג מתאים', '', 'entity.course', 'חוג', ' מתאים'],
  ['מצא חוג', 'מצא ', 'entity.course', 'חוג', ''],
  ['החוג', 'ה', 'entity.course', 'חוג', ''],
  ['למורה', 'ל', 'entity.teacher', 'מורה', ''],
  ['← ＋ תרומה', '← ＋ ', 'entity.donation', 'תרומה', ''],
  ['תרומה ←', '', 'entity.donation', 'תרומה', ' ←'],
];

// ── החשיפה: קבועים (שמות-ה-API כמו במקור-ה-JS; מוזנים מהאטומים lowerCamel) ──
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
final String GUIDE_INTRO_LABEL = gil.guideIntroLabel;
final String GUIDE_INTRO = gin.guideIntro;
List<Map<String, dynamic>> get GUIDE_SECTIONS => gsc.guideSections;
final String GUIDE_RECIPES_LABEL = grl.guideRecipesLabel;
final String GUIDE_RECIPES = grc.guideRecipes;
final String GUIDE_FOOT = gf.guideFoot;

/// סינון-ותרגום שורות-המדריך (guide.ts:101-115). שקעים: isModuleOn (מצב-הארגון),
/// config (מילון-white-label; null/חסר = נוסח-לגאסי מילה-במילה).
List<Map<String, dynamic>> guideSections(
  bool Function(String module) isModuleOn, [
  Map<String, dynamic>? config,
]) =>
    gso.guideSections(isModuleOn, config, gsc.guideSections, _termOf, _swap, term: (k)=>kTerms[k]!);

/// "המתכונים המהירים" ממותג-מחדש (guide.ts:121-134); בלי config = GUIDE_RECIPES מילה-במילה.
String guideRecipes([Map<String, dynamic>? config]) {
  // config != null ⇔ JS truthiness של אובייקט ({} truthy, undefined/null falsy).
  String t(String k, String fb) => config != null ? tof.termOf(config, k, fb) as String : fb;
  var r = grc.guideRecipes;
  for (final row in _recipeSwaps) {
    r = _swap(r, row[0], row[1] + t(row[2], row[3]) + row[4]);
  }
  return r;
}
