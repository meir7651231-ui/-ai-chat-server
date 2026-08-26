// ⚛️ אטום-Dart · findTypeSiblings
// מוצא: buildsmart/app_flutter/lib/screens/lipskey_products_screen.dart:1972-1992
//        (‏findTypeSiblings; חוק-2 — verbatim, לא-משופר).
// טוהר: פונקציית top-level עצמאית, אפס import פנימי (רק dart:core — RegExp/Set/Map).
//
// שקע שהוזרק (חוק-1/3, דיבר-3):
//   • הקטלוג הגלובלי `resolvedCatalogProducts` (lipskey_products_screen.dart:1984)
//     ⇒ שקע-פרמטר `catalog` (required List<LipRow>). ברירת-המחדל בקוד-החי =
//     המקור-הפעיל של הקטלוג; כאן מוזרק מפורש.
//
// הטבעות verbatim (חוק-3 — מילון-הסיווג של הלוגיקה עצמה, לא קטלוג-הצבה):
//   • enum AttrKind (:1689) · isSizeToken (:1659-1673) · _attrKindFor (:1698-1708)
//     · _getCompoundType (:1916-1940) · _leadingType (:1963-1968).
//   • מילוני-אוצר-המילים kLipskeyModels/kLipskeyTypes/kLipskeySubtypes/kLipskeyColors
//     (data/lipskey_catalog.dart:363-488) + _kPprMaterials/_kColorModifiers.
//   • kPolyrollBrand = 'פולירול' (data/polyroll_catalog.dart:18) — טוקן-מותג
//     של הלוגיקה (מסווג ענף-PPR), לא סוד/זהות (חוק-6) ⇒ מוטבע.
//   • LipRow = מחזיק-קלט טהור מקומי (רק nameHe/brand/categoryHe שנקראים).
//
// קלט:  p        — LipRow (מוצר-העוגן).
//       catalog  — שקע: רשימת המוצרים לחיפוש-אחים.
// פלט:  List<LipRow> — נציג-יחיד לכל סוג-מורכב שונה באותה קטגוריה; [p] אם ≤1.

/// מחזיק-קלט טהור: רק שלושת השדות ש-findTypeSiblings/‏_getCompoundType/‏_leadingType קוראים.
class LipRow {
  final String nameHe;
  final String brand;
  final String categoryHe;
  const LipRow({
    required this.nameHe,
    this.brand = 'ליפסקי',
    this.categoryHe = '',
  });
}

/// טוקן-מותג פולירול (מסווג ענף-PPR) — verbatim מ-polyroll_catalog.dart:18.
const String kPolyrollBrand = 'פולירול';

// ─── מילוני-אוצר-מילים (verbatim · lipskey_catalog.dart:363-488) ──────────────
const List<String> kLipskeyModels = [
  'קיסר', 'דיור', 'פיטרה', 'רותם', 'תבור', 'קורל', 'הדר', 'פלורה', 'מלודי',
  'גרנדה', 'דולפין', 'טרפז', 'קונקורד', 'אוסלו', 'כרמל', 'אדיר', 'הרמון',
  'ספיר', 'ברקת', 'יהלום', 'טיטאן', 'טופז', 'כינרת', 'אקווה', 'איביזה',
  'גליל', 'בתא', 'פולו', 'סיגמא',
  // AQUATEC shower & bath models not previously listed
  'גל', 'הוואי', 'כנרת', 'תמר', 'לונה', 'נוגה', 'ויגה', 'אלפא', 'דלתא',
  'טולדו', 'טיטוניק', "אנג'ל", 'גאלרי',
  // שם מותג (soft-close seat brand)
  'טבור',
  // קודי חומר / מותג צינורות
  'NTM', 'PP-MD-ML', 'HDPE',
];

const List<String> kLipskeyTypes = [
  'מיכל הדחה', 'ראש מקלחת', 'אל חזור', 'מחסום', 'סיפון', 'מאסף', 'קולט',
  'מסעף', 'הסתעפות', 'מצמד', 'מחבר', 'מופה', 'ניפל', 'רקורד', 'בושינג',
  'ברך', 'זווית', 'צינור', 'צנרת', 'מכסה', 'רשת', 'מושב', 'אטם', 'פקק',
  'אום', 'מאריך', 'חבק', 'אומגה', 'עוגן', 'מזלף', 'מקלח', 'זרוע', 'מחלק',
  'ארון', 'ידית', 'מוט', 'קולב', 'מחזיק', 'סבונייה', 'ברז', 'אביק', 'תעלה',
  'מצוף', 'שעון', 'מקטין', 'משחרר', 'דוד', 'פיה', 'מסנן', 'משפך', 'ונטיל',
  'כובע', 'הגבהה', 'מערכת', 'מצרות', 'גרונג', 'רוזטה', 'פלנגה', 'תפס',
  'דרך', 'גמיש', 'שרשרת', 'וסת', 'ברז גן', 'מצרה', 'מנגנון', 'זקיף', 'סט',
  'זקף',
  // Added (catch products that previously had no productType):
  'מקשר', 'כפה', 'טי', 'פיית',
  // PPR (Polyroll) types not already covered above:
  'מתאם', 'רוכב', 'צווארון', 'סעפת', 'שרוול',
  // Multi-word compound types (matched as substring before single-word search):
  'מוט מגבת', 'מערכת אמבטיה', 'מחזיק מגבת',
  'מושב אסלה', 'חבק תליה', 'מחבר כפול', 'מקשר הברגה',
  'ברז מעבר', 'ברז ניל', 'ברז מהקיר', 'ברז אמבטיה', 'ברז דלי',
  'מצרות תבריג', 'חזור כלפה', 'חזור קפיצי', 'מערכת שטיפה',
  'פיה לברז', 'מזלף קומפלט', 'מאריך חרוט', 'מאריך לברז',
  'זווית חיצונית', 'זווית פנימית',
  'פקק שטוח', 'מערכת פינוק', 'מקלח יד', 'זרוע דוש',
  'צינור לביוב', 'צינור רב', 'נקודת מים',
];

const List<String> kLipskeySubtypes = [
  'אמריקאי', 'נסתר', 'גלוי', 'כפול', 'יחיד', 'מתכוונן', 'גמיש', 'קשיח',
  'מרובע', 'עגול', 'פינתי', 'קיר', 'רצפה', 'נירוסטה', 'תחתון', 'עליון',
  'אנכי', 'אופקי', 'משולב', 'מוגבה', 'נמוך',
  'קצרה', 'ארוכה', 'קצר', 'ארוך',
  // יעד / שימוש
  'למטבח', 'לאמבטיה', 'למקלחת', 'לכיור', 'לגינה', 'לביוב',
  'לסיפון', 'לאסלה', 'למדיח', 'למזגן', 'לנכים', 'לאגנית',
  'לברז', 'למחסום', 'למחלק', 'לצינור', 'לתבריג', 'לשעון',
  'לסוללה', 'למושב', 'למיכל', 'למטהר', 'למגבת', 'לגן', 'להכנסה',
  'למאסף', 'למכונת', 'למקטין',
  // הברגה וכיוון
  'הברגה', 'תבריג', 'חיצונית', 'פנימית', 'חיצוני', 'פנימי',
  // התקנה וסגנון
  'תליה', 'מתלה', 'תלויה', 'מונח', 'מונחת', 'מהקיר', 'צמודה', 'סמויה',
  'קבוע', 'קבועה', 'מוטמן',
  // חומר
  'בידוד', 'בודד', 'מתכת', 'פלסטיק', 'פליז', 'תרמופלסטי', 'תרמופלסטיים',
  'מנירוסטה', 'שכבתי',
  // סוג תפקוד
  'כדורי', 'קפיצי', 'הידראולי', 'אוטומטי', 'טלסקופי', 'טלסקופית',
  'מצבים', 'כיווני', 'צדדי', 'אלכסוני', 'שרשורי', 'ספירלה',
  'דו כיווני', 'דו צדדי',
  'רב', 'כבד', 'תקני', 'מפואר', 'מפוארת', 'מפאורת',
  'פלוס', 'פינוק', 'מעדן', 'משופר', 'תכליתי', 'איטלקי', 'מפואר',
  // צורה
  'עגולה', 'מרובעת', 'מלבנית', 'שטוח', 'שטוחה', 'חרוט', 'קשת',
  'גבוהה', 'גבוה', 'נמוכה', 'אחד', 'זוג', 'כפולה',
  // חיבור / זרימה
  'מעבר', 'מעבר', 'מפצל', 'מחבר', 'סעף', 'אוגן', 'בנד', 'חיבור',
  'זרימה', 'ניקוז', 'שטף', 'שטיפה', 'מילוי', 'מלוי',
  // שימוש ספציפי
  'כביסה', 'אסלה', 'מושבי', 'רחצה', 'דוש', 'ג׳קוזי', 'מטבח', 'אמבטיה',
  'ביוב', 'ניקוז', 'כלים', 'מגבת', 'נייר', 'קומקום', 'אקדח', 'דלי',
  'גשם', 'נחש', 'ברבור', 'סוללה',
  // אביזרים / כולל
  'קומפלט', 'כולל', 'אומים', 'אטמים', 'ברגים', 'חלקים', 'ערכה',
  'התקנה', 'אחיזה', 'הידוק', 'תיקון',
  // שונות
  'צד', 'מהקיר', 'יציאות', 'יציאה', 'כניסה', 'כניסות', 'הכנסה',
  'אורך', 'חתך', 'מטר', 'יד', 'עילי', 'אחורי', 'מיני', 'מסוט',
  'תעלת', 'מונבלוק', 'אקסנטר', 'טרפלקס', 'נפילה', 'עצמי',
  'מתיזן', 'מגולון', 'פח', 'קונוס', 'רחבה', 'אוויר', 'מקס',
  'פתוח', 'סגור', 'פתיחה', 'קלה', 'שקוף', 'זכוכית', 'בקבוק',
  'מנגית', 'נוזלי', 'גלי', 'קרים', 'כרמי', 'ניל', 'אקסנטר',
  'מברשת', 'טבעת', 'כפתור', 'אצבע', 'סיבוב', 'חצי',
  'אוניברסלית', 'זמני', 'משוריין', 'יצוקה', 'אלחוזר', 'מצמצם',
  'סניטריים', 'תרמוסטיים', 'תרמוסט', 'מתאים', 'מגבת',
  // נוספות
  'מים', 'נקודת', 'כלפה', 'תיקני', 'פקס', 'עליונה', 'מוהיר',
  'ריקורד', 'חיתוכי', 'טנת', 'לתיקון', 'לאביק', 'לכוס', 'לחורים',
  'לשטף', 'שירשורי', 'רחיצה', 'מפתחות', 'מפתח', 'בורג',
  'חדש', 'שני', 'קיימים', 'אביזרי', 'למוצרים', 'מי', 'אויר',
  'לבנה', 'שרוול', 'גלילית', 'גנדלים', 'שקית',
  'אפשרות', 'מכונת',
  // חיבור / סגנון
  'פ.פ', 'ח.פ', 'פ.ח', 'ח.ח', 'פרח', 'ראש', 'נשלף', 'לחץ',
  // צירופים דו-מילוניים — subtype compounds
  'הברגה חיצונית', 'הברגה פנימית',
  'תבריג כפול', 'תבריג צד',
  'מעבר כדורי',
  'צד אחד',
  'תעלת ניקוז', 'ניקוז למקלחת',
  'רב שכבתי', 'כבד תקני',
  'למחסום רצפה', 'כניסה למדיח', 'לברז ניל',
  // PPR (Polyroll) connection / subtype terms:
  'לריתוך', 'מחוזק', 'פייזר', 'משושה',
  'מיזוג אוויר', // AC blue-pipe line — render as ONE chip (not מיזוג + אוויר)
  // PPR connection/form/welding terms — were rendering as green "linkable" words.
  'פנים', 'חוץ', 'פנים/חוץ', 'מצרה', 'חשמלי', 'שקע', 'תקע', 'סמוי', 'ישר',
  'פרפר', 'בין', 'אוגנים', 'אספקת', 'לנקודת',
  // PPR welding-tool descriptors (kPprTools names):
  'תותב', 'ריתוך', 'מקדח', 'מזוודת', 'פלטת', 'מכונת', 'מברגה', 'פיגורות',
  'שולחני', 'קטנה', 'גדולה', 'לקטרים', 'חורים', 'לעבודה', 'בגובה',
  'לצינורות', 'לרוכבים', 'מ"מ',
];

const List<String> kLipskeyColors = [
  'לבן', 'שחור מט', 'שחור', 'פרגמון', 'אפור', 'ניקל מוברש', 'ניקל',
  'גרפיטי', 'זהב מוברש', 'זהב', 'נחושת', 'כרום',
  'אפורה', 'כחול', 'אדום',
];

// ─── טוקני-סיווג + נגזרות (verbatim · lipskey_products_screen.dart) ───────────
enum AttrKind { size, color, colorMod, model, subtype, type, material, pressure, sdr, maker }

const _kPprMaterials = {'PPR', 'PPRCT'};
const _kColorModifiers = {'מוברש', 'מט'};

bool isSizeToken(String w) {
  if (RegExp(r'^DN', caseSensitive: false).hasMatch(w)) return true;
  // A leading Ø (diameter symbol) is a noise prefix on inch sizes —
  // strip it and re-test so `Ø1/2"` is recognised the same as `1/2"`.
  final stripped = w.startsWith('Ø') ? w.substring(1) : w;
  // numbers, fractions, ratios, inch marks, degrees, with × / x / X /
  // - separators (capital X appears in PPR product names like `160X25X1/2"`).
  // A leading bare fraction glyph counts as numeric too, so `½"` (no leading
  // digit) is recognised the same as `parseSizeTokens` does — keeping the two
  // tokenizers in agreement (no chip the finder surfaces that the card's
  // word-classifier would treat as a plain link).
  return RegExp(r'^[\d¼½¾⅛⅜⅝⅞]+([./×xX\-"׳״⅛¼½¾⅜⅝⅞°]+[\d"׳״°]*)*[\"׳״°]?$')
          .hasMatch(stripped) &&
      RegExp(r'[\d¼½¾⅛⅜⅝⅞]').hasMatch(stripped);
}

AttrKind? _attrKindFor(String word) {
  if (isSizeToken(word)) return AttrKind.size;
  if (_kPprMaterials.contains(word)) return AttrKind.material;
  if (RegExp(r'^PN\d').hasMatch(word)) return AttrKind.pressure;
  if (RegExp(r'^SDR', caseSensitive: false).hasMatch(word)) return AttrKind.sdr;
  if (_kColorModifiers.contains(word)) return AttrKind.colorMod;
  if (kLipskeyColors.contains(word)) return AttrKind.color;
  if (kLipskeyModels.contains(word)) return AttrKind.model;
  if (kLipskeySubtypes.contains(word)) return AttrKind.subtype;
  return null;
}

String _getCompoundType(LipRow p) {
  final name = p.nameHe;
  final words = name.split(RegExp(r'\s+'));

  // Multi-word types — longest match first.
  final multiWord = kLipskeyTypes.where((t) => t.contains(' ')).toList()
    ..sort((a, b) => b.length.compareTo(a.length));
  for (final t in multiWord) {
    if (name.contains(t)) return t;
  }

  // Single-word types + optional trailing qualifier.
  for (final typeWord in kLipskeyTypes) {
    if (typeWord.contains(' ')) continue;
    final idx = words.indexOf(typeWord);
    if (idx < 0) continue;
    if (idx + 1 >= words.length) return typeWord;
    final next = words[idx + 1];
    if (_attrKindFor(next) != null) return typeWord;
    if (_kColorModifiers.contains(next)) return typeWord;
    if (next.length > 2 && (next.startsWith('ל') || next.startsWith('ב'))) return typeWord;
    return '$typeWord $next';
  }
  return '';
}

String _leadingType(LipRow p) {
  for (final w in p.nameHe.split(RegExp(r'\s+'))) {
    if (kLipskeyTypes.contains(w)) return w;
  }
  return _getCompoundType(p);
}

/// Type siblings: one representative per distinct compound type in the same
/// category. Type is the top-level dimension — no frame restriction needed.
/// (verbatim · lipskey_products_screen.dart:1972-1992; `resolvedCatalogProducts`⇒`catalog`.)
List<LipRow> findTypeSiblings(LipRow p, {required List<LipRow> catalog}) {
  final compound = _getCompoundType(p);
  if (compound.isEmpty) return [p];
  // Same category only — no cross-product (pipe→valve→drill). For PPR, key by
  // the LEADING type word (not _getCompoundType, which matches whichever
  // kLipskeyTypes word comes first in list-order and so fragments e.g. "מתאם …
  // רקורד" into fake types). This keeps real splits (collar↔flange) but collapses
  // duplicates.
  final ppr = p.brand == kPolyrollBrand;
  String keyOf(LipRow q) => ppr ? _leadingType(q) : _getCompoundType(q);
  final byCompound = <String, LipRow>{};
  byCompound[keyOf(p)] = p;
  for (final q in catalog) {
    if (q.categoryHe != p.categoryHe) continue;
    final qc = keyOf(q);
    if (qc.isEmpty) continue;
    if (!byCompound.containsKey(qc)) byCompound[qc] = q;
  }
  if (byCompound.length <= 1) return [p];
  return byCompound.values.toList();
}
