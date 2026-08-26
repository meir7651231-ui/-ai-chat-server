// 🧬 המחולל · משפט-עברית ⇒ פיצ׳ר מורכב.
// קודקוד-הפירמידה: אטום → קופסה → לוח-אם → מסך → **מחולל**.
// קלט: משפט-עברית חופשי ("אני צריך לנהל תורמים ולתכנן צנרת").
// פלט: תצורה (אילו יכולות להדליק) + מסכים (מה לרנדר) — הרכבה מלאה, אפס-קוד-חדש.
//
// המחולל אינו מייצר קוד — הוא **מרכיב מהקטלוג הקיים**: מתאים את המשפט ליכולות
// (board.capabilityCatalog), מדליק אותן דרך board.configFor (חוגה גרנולרית —
// כל תערובת), ובוחר את המסכים הזמינים דרך screens.screensFor. שלושת השלבים
// טהורים ודטרמיניסטיים.
//
// טוהר: אפס IO, אפס store, אפס Date.now — נגזרת טהורה של המשפט + הקטלוגים.
import 'board.dart';
import 'screens.dart';

/// מילון-הכוונה: מונחי-עברית ⇒ יכולת. חסר-במילון ⇒ לא-נדלק (שמרני).
/// כל יכולת = רשימת-מילות-מפתח שמצביעות עליה. ריבוי-שמות מותר (נרדפות).
const Map<String, List<String>> kCapabilityKeywords = {
  // מאור
  'supporters.cockpit': ['תורם', 'תורמים', 'תרומה', 'תרומות', 'קבלה', 'קבלות', 'תומכים', 'crm', 'לקוח', 'לקוחות'],
  'families': ['משפחה', 'משפחות', 'נזקק', 'נזקקים', 'סיוע'],
  'diary': ['יומן', 'חדר', 'חדרים', 'שיבוץ', 'לוח-חדרים'],
  'reports': ['דוח', 'דוחות', 'מבט-הנהלה', 'הנהלה', 'סטטיסטיקה'],
  'audit': ['ביקורת', 'לוג', 'תיעוד-פעולות', 'audit'],
  'wa': ['וואטסאפ', 'whatsapp', 'הודעה', 'הודעות'],
  'hebrew': ['לוח-עברי', 'עברי', 'תאריך-עברי', 'פרשה', 'חג', 'זמנים'],
  // בנייה-חכמה
  'bs.pipe': ['צנרת', 'אינסטלציה', 'חיבור', 'חיבורים', 'מסלול', 'לחץ', 'ברז', 'צינור', 'התקנה', 'אמבטיה', 'מטבח'],
  'bs.fuzzy': ['חיפוש-מטושטש', 'התאמה', 'כפילויות', 'דדופ'],
  'bs.workflow': ['הזמנה', 'הזמנות', 'שלב', 'שלבים', 'משפך', 'סטטוס', 'מנהל'],
  'bs.actions': ['פעולה', 'פעולות', 'פקודה', 'קטלוג-פעולות'],
  'bs.assistant': ['עוזר', 'עוזר-חכם', 'ai', 'בינה', 'שאלה'],
  'bs.projects': ['פרויקט', 'פרויקטים', 'חשבונית', 'חשבוניות', 'הצעת-מחיר', 'קבלן'],
  'bs.studio': ['סטודיו', 'עיצוב', 'דיגיטל', 'אפליקציה'],
  'bs.security': ['הרשאה', 'הרשאות', 'אבטחה', 'תפקיד'],
  'bs.config': ['הגדרה', 'הגדרות', 'תבנית', 'כלל', 'קונפיג'],
};

/// תוצאת-ההרכבה של המחולל.
class FeatureAssembly {
  final String sentence;

  /// היכולות שהותאמו מהמשפט (⊆ capabilityCatalog).
  final List<String> capabilities;

  /// התצורה שמדליקה בדיוק אותן (board.configFor).
  final Map<String, dynamic> config;

  /// המסכים שהורכבו — מה שהשלד ירנדר.
  final List<ScreenManifest> screens;

  const FeatureAssembly({
    required this.sentence,
    required this.capabilities,
    required this.config,
    required this.screens,
  });

  bool get isEmpty => capabilities.isEmpty;
}

/// נירמול-קל של מילה עברית להשוואה: הסרת גרשיים/מקף-מוביל, אותיות-סופיות נשמרות.
String _norm(String w) => w.replaceAll(RegExp('["״׳\'’]'), '').trim();

/// התאמת-יכולות מהמשפט: לכל יכולת, אם אחת ממילות-המפתח שלה מופיעה במשפט ⇒ נדלקת.
/// דטרמיניסטי, שומר על סדר-הקטלוג (יציבות-פלט).
List<String> matchCapabilities(String sentence) {
  final words = sentence
      .toLowerCase()
      .split(RegExp(r'[\s,.;:!?()\[\]/\\-]+'))
      .map(_norm)
      .where((w) => w.isNotEmpty)
      .toSet();
  final hit = <String>[];
  for (final cap in Board.capabilityCatalog) {
    final keys = kCapabilityKeywords[cap] ?? const [];
    if (keys.any((k) => words.contains(_norm(k.toLowerCase())))) hit.add(cap);
  }
  return hit;
}

/// 🧬 המחולל: משפט-עברית ⇒ הרכבה מלאה (יכולות + תצורה + מסכים).
/// [add]/[remove] = כוונון-ידני מעל ההתאמה האוטומטית (חוגה גרנולרית).
FeatureAssembly generate(String sentence, {Iterable<String> add = const [], Iterable<String> remove = const []}) {
  final caps = {...matchCapabilities(sentence), ...add}..removeAll(remove);
  final ordered = Board.capabilityCatalog.where(caps.contains).toList();
  final config = Board.configFor(ordered, slug: 'generated');
  final screens = screensFor(ordered);
  return FeatureAssembly(
    sentence: sentence,
    capabilities: ordered,
    config: config,
    screens: screens,
  );
}
