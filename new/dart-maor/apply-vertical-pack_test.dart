// בדיקת-חוזה (רתמת-זהב) · applyVerticalPack — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/apply-vertical-pack.test.mjs:
//   1) packId לא-מוכר ⇒ no-op (אותה הפניה, identical) ·
//   2) חבילה מלאה — זהות מוחלפת, שאר הקונפיג שורד, בלי accentCustom ·
//   3) חבילה עמותתית — theme שורד, זהות-חזותית מוסרת, features={} ·
//   4) צבע-ידני (accentCustom) שורד ·
//   5) עותקים חדשים — terms/modules/features לא אותן הפניות של החבילה.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/apply-vertical-pack_test.dart  ⇒ exit 0
import 'apply-vertical-pack.dart';

// P/N — אותן חבילות של בדיקת-ה-JS (הערכים מומרים ל-Dart):
final P = <String, dynamic>{
  'id': 'digital',
  'terms': <String, dynamic>{'nav.ayin': 'פרויקטים'},
  'modules': <String, dynamic>{'shop': false},
  'features': <String, dynamic>{'a.b': true},
  'theme': 'tsohar',
  'icon': '💻',
  'accent': '#7c3aed',
  'motion': 'snappy',
};
final N = <String, dynamic>{
  'id': 'chesed',
  'terms': <String, dynamic>{},
  'modules': <String, dynamic>{},
};

bool _deepEq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k)) return false;
      if (!_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

void _check(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  // 1) packId לא-מוכר ⇒ no-op (אותה הפניה)
  final cfg1 = <String, dynamic>{'orgName': 'א'};
  _check(identical(applyVerticalPack(cfg1, 'ghost', [P]), cfg1),
      'packId לא-מוכר לא החזיר את אותו קונפיג');

  // 2) חבילה מלאה — זהות מוחלפת, שאר הקונפיג שורד
  final cfg2 = <String, dynamic>{
    'orgName': 'א',
    'slug': 'x',
    'emoji': '🕯',
    'motion': 'calm',
    'accent': '#000',
  };
  final o2 = applyVerticalPack(cfg2, 'digital', [P]);
  _check(
      _deepEq(o2, <String, dynamic>{
        'orgName': 'א',
        'slug': 'x',
        'emoji': '💻',
        'motion': 'snappy',
        'accent': '#7c3aed',
        'terms': <String, dynamic>{'nav.ayin': 'פרויקטים'},
        'modules': <String, dynamic>{'shop': false},
        'features': <String, dynamic>{'a.b': true},
        'theme': 'tsohar',
      }),
      'חבילה מלאה: הפלט שגוי ⇒ $o2');
  _check(!o2.containsKey('accentCustom'), 'accentCustom הופיע בלי צבע-ידני');

  // 3) חבילה עמותתית — theme שורד, זהות-חזותית מוסרת, features={}
  final o3 = applyVerticalPack(
      <String, dynamic>{
        'theme': 'or-rishon',
        'emoji': '🕯',
        'motion': 'calm',
        'accent': '#000',
      },
      'chesed',
      [N]);
  _check(o3['theme'] == 'or-rishon', 'theme נדרס בלי שהחבילה מגדירה');
  _check(
      !o3.containsKey('emoji') &&
          !o3.containsKey('motion') &&
          !o3.containsKey('accent') &&
          !o3.containsKey('accentCustom'),
      'זהות-חזותית לא הוסרה בחבילה עמותתית');
  _check(_deepEq(o3['features'], <String, dynamic>{}),
      'features חסר בחבילה לא הפך {}');

  // 4) צבע-ידני שורד
  final o4 = applyVerticalPack(
      <String, dynamic>{'accent': '#123456', 'accentCustom': true},
      'digital',
      [P]);
  _check(o4['accent'] == '#123456' && o4['accentCustom'] == true,
      'הצבע-הידני לא שרד');

  // 5) עותקים חדשים — לא אותן הפניות של החבילה
  _check(
      !identical(o2['terms'], P['terms']) &&
          !identical(o2['modules'], P['modules']) &&
          !identical(o2['features'], P['features']),
      'terms/modules/features לא הועתקו — שינוי יזלוג לחבילה');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(applyVerticalPack(cfg1, 'ghost', [P]), cfg1),
      'assert-live guard');

  print('OK applyVerticalPack: 5 דוגמאות-חוזה — ירוק');
}
