// ⚛️ אטום-Dart · findAttrSiblings
// מוצא: buildsmart/app_flutter/lib/screens/lipskey_products_screen.dart:1839-1910
//        (‏findAttrSiblings; חוק-2 — verbatim, לא-משופר).
// טוהר: פונקציית top-level עצמאית, אפס import פנימי (רק dart:core — RegExp/Set).
//
// שקע שהוזרק (חוק-1/3, דיבר-3):
//   • הקטלוג הגלובלי `resolvedCatalogProducts` (:1850,1872,1888,1902) ⇒ שקע-פרמטר
//     `catalog` (required List<LipRow>). ברירת-המחדל בקוד-החי = המקור-הפעיל של
//     הקטלוג (v2-aware); כאן מוזרק מפורש.
//
// הטבעות verbatim (חוק-3 — מילון-הסיווג של הלוגיקה עצמה, לא קטלוג-הצבה):
//   • enum AttrKind (:1689) · isSizeToken (:1659-1673) · _attrKindFor (:1698-1708)
//     · _stripWordsOfKind (:1728-1763) · _getCompoundType (:1916-1940)
//     · עוזרי-היצרן _makerOf/_nominalBore/_makerSignature (:1821-1837).
//   • מילוני-אוצר-המילים kLipskeyModels/kLipskeyTypes/kLipskeySubtypes/kLipskeyColors
//     (lipskey_catalog.dart:363-488) + _kPprMaterials/_kColorModifiers + הנגזרות
//     _kColorWords/_kModelWords/_kSubtypeWords (:1777-1789).
//   • kPolyrollBrand = 'פולירול' (polyroll_catalog.dart:18) — טוקן-מותג של הלוגיקה
//     (מסווג ענף-PPR/יצרן), לא סוד/זהות (חוק-6) ⇒ מוטבע.
//   • LipRow = מחזיק-קלט טהור מקומי (רק nameHe/brand/categoryHe/dims שנקראים).
//
// הערה: הפרמטר `word` נשמר verbatim מהחתימה המקורית אך **אינו-נקרא** בגוף
//   (:1839-1910) — קלט-רפאים; הסיווג נגזר מ-`kind`.
//
// קלט:  p        — LipRow (מוצר-העוגן).
//       word     — String (רפאים, verbatim מהחתימה; לא-נקרא).
//       kind     — AttrKind (הממד שעבורו מחפשים אחים).
//       catalog  — שקע: רשימת המוצרים לחיפוש-אחים.
// פלט:  List<LipRow> — אחי-הממד; [p] כשאין חלופה אמיתית.

/// מחזיק-קלט טהור: רק השדות ש-findAttrSiblings + עוזריו קוראים.
class LipRow {
  final String nameHe;
  final String brand;
  final String categoryHe;
  final Map<String, dynamic>? dims;
  const LipRow({
    required this.nameHe,
    this.brand = 'ליפסקי',
    this.categoryHe = '',
    this.dims,
  });
}

/// טוקן-מותג פולירול (מסווג ענף-PPR/יצרן) — verbatim מ-polyroll_catalog.dart:18.
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
final _kColorWords = <String>{
  for (final v in kLipskeyColors) ...v.split(RegExp(r'\s+')).where((w) => w.length >= 2),
};
final _kModelWords = <String>{
  for (final v in kLipskeyModels) ...v.split(RegExp(r'\s+')).where((w) => w.length >= 2),
};
final _kSubtypeWords = <String>{
  for (final v in kLipskeySubtypes) ...v.split(RegExp(r'\s+')).where((w) => w.length >= 2),
};

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

String _stripWordsOfKind(String name, AttrKind kind) {
  var result = name;
  // Strip multi-word subtype/color entries first (e.g. "דו כיווני", "ניקל מוברש").
  if (kind == AttrKind.subtype) {
    for (final s in kLipskeySubtypes) {
      if (s.contains(' ')) result = result.replaceAll(s, ' ');
    }
  } else if (kind == AttrKind.color) {
    for (final c in kLipskeyColors) {
      if (c.contains(' ')) result = result.replaceAll(c, ' ');
    }
  }
  final Set<String> wordSet = switch (kind) {
    AttrKind.color => _kColorWords,
    AttrKind.colorMod => _kColorModifiers,
    AttrKind.model => _kModelWords,
    AttrKind.subtype => _kSubtypeWords,
    AttrKind.size => const {},
    AttrKind.type => <String>{for (final v in kLipskeyTypes) v},
    AttrKind.material => _kPprMaterials,
    AttrKind.pressure => const {},
    AttrKind.sdr => const {},
    AttrKind.maker => const {},
  };
  return result
      .split(RegExp(r'\s+'))
      .where((w) =>
          w.isNotEmpty &&
          (kind == AttrKind.size
              ? !isSizeToken(w)
              : (kind == AttrKind.pressure || kind == AttrKind.sdr)
                  ? _attrKindFor(w) != kind
                  : !wordSet.contains(w)))
      .join(' ')
      .trim();
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

/// Stored in dims (not the name), so the maker chip is synthetic.
String _makerOf(LipRow p) =>
    (p.dims?['יצרן'] as String?)?.trim() ?? '';

/// Nominal bore (dn) used to match the same product across manufacturers.
String _nominalBore(LipRow p) {
  final d = p.dims;
  final raw = (d?['dn נומינלי'] ?? d?['קוטר חיצוני'] ?? d?['de קוטר חיצוני'])
      ?.toString();
  final src = raw ?? p.nameHe;
  return RegExp(r'\d+(?:\.\d+)?').firstMatch(src)?.group(0) ?? '';
}

/// Spec signature identical for the same product from different manufacturers,
/// so the maker picker pairs e.g. the Heliroma and Aquatherm faser 20×2.8.
String _makerSignature(LipRow p) =>
    '${p.categoryHe}|${_getCompoundType(p)}|${_nominalBore(p)}'
    '|${p.dims?['PN'] ?? ''}|${p.dims?['SDR'] ?? ''}';

/// Find sibling products for a given attribute kind.
/// (verbatim · lipskey_products_screen.dart:1839-1910; `resolvedCatalogProducts`⇒`catalog`.)
List<LipRow> findAttrSiblings(
  LipRow p,
  String word,
  AttrKind kind, {
  required List<LipRow> catalog,
}) {
  // Manufacturer: same spec from a different maker (cross-line, cross-category).
  if (kind == AttrKind.maker) {
    final sig = _makerSignature(p);
    final seen = <String>{};
    final res = <LipRow>[];
    // stage-3.1 — follows the ACTIVE catalog source (v2-aware).
    for (final q in catalog) {
      if (q.brand != kPolyrollBrand || _makerSignature(q) != sig) continue;
      final m = _makerOf(q);
      if (m.isEmpty || !seen.add(m)) continue;
      res.add(q);
    }
    return res.length <= 1 ? [p] : res;
  }
  // PPR: every chip is a pickable dimension. Scope = whole brand within the
  // same product type, so the picker offers the real alternatives — material
  // (PPR/PPRCT), line/subtype (פייזר ↔ אספקת מים), size, etc. — even across the
  // separate per-line categories.
  if (p.brand == kPolyrollBrand) {
    final pType = _getCompoundType(p);
    // Size is a within-line dimension: a faser pipe's size variants are the
    // other faser sizes — never another line's (drainage 160/200…). Restrict
    // it to the same category so the picker isn't flooded with every pipe
    // size in the brand. Material/subtype stay cross-line so the picker can
    // still switch PPR↔PPRCT or faser↔supply.
    final sameLineOnly = kind == AttrKind.size;
    final seen = <String>{};
    final res = <LipRow>[];
    for (final q in catalog) {
      if (q.brand != kPolyrollBrand || _getCompoundType(q) != pType) continue;
      if (sameLineOnly && q.categoryHe != p.categoryHe) continue;
      final v = q.nameHe
          .split(RegExp(r'\s+'))
          .where((w) => _attrKindFor(w) == kind)
          .join(' ');
      if (v.isEmpty || !seen.add(v)) continue;
      res.add(q);
    }
    return res.length <= 1 ? [p] : res;
  }
  if (kind == AttrKind.model) {
    // Category-wide: one representative per distinct model word.
    final seen = <String>{};
    final result = <LipRow>[];
    for (final q in catalog) {
      if (q.categoryHe != p.categoryHe) continue;
      final modelWord = q.nameHe
          .split(RegExp(r'\s+'))
          .firstWhere((w) => _attrKindFor(w) == AttrKind.model,
              orElse: () => '');
      if (modelWord.isEmpty) continue;
      if (seen.add(modelWord)) result.add(q);
    }
    return result.length <= 1 ? [p] : result;
  }

  final pFrame = _stripWordsOfKind(p.nameHe, kind);
  if (pFrame.length < 2) return [p];
  return catalog.where((q) {
    if (q.categoryHe != p.categoryHe) return false;
    if (_stripWordsOfKind(q.nameHe, kind) != pFrame) return false;
    if (kind == AttrKind.colorMod) return true;
    return q.nameHe
        .split(RegExp(r'\s+'))
        .any((w) => _attrKindFor(w) == kind);
  }).toList();
}
