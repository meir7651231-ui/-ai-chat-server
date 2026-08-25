// בדיקת-חוזה (רתמת-זהב) · siteLangs — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור new/atoms/site-langs.test.mjs
// (knownLangs = ['he','en','yi'] — שקע-הנתונים SITE_LANGS מ-types/config):
//   1) {langs:['en','he']}      ⇒ ['en','he']  — הסדר של הקונפיג נשמר
//   2) {langs:['he','he','en']} ⇒ ['he','en']  — כפולים מוסרים (ראשון מנצח)
//   3) {langs:['fr','en']}      ⇒ ['en']       — לא-מוכרת מסוננת
//   4) {langs:['fr']}           ⇒ ['he']       — הכול סונן ⇒ ברירת-מחדל
//   5) {langs:[]}               ⇒ ['he']       — רשימה ריקה
//   6) undefined                ⇒ ['he']       — אין site
//   7) {}                       ⇒ ['he']       — site בלי langs
// השוואת-מערכים: אורך + איבר-איבר (כלל-8 — לעולם לא join). כשל ⇒ StateError.
// הרצה: dart run --enable-asserts new/dart-maor/site-langs_test.dart ⇒ OK
import 'site-langs.dart';

void _eqList(String name, dynamic got, List<dynamic> want) {
  if (got is! List) {
    throw StateError('✗ $name: התוצאה אינה List אלא ${got.runtimeType}');
  }
  if (got.length != want.length) {
    throw StateError('✗ $name: אורך ${got.length} ≠ ${want.length} ($got ≠ $want)');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError("✗ $name: [$i] '${got[i]}' ≠ '${want[i]}' ($got ≠ $want)");
    }
  }
}

void main() {
  // שקע-נתונים: SITE_LANGS (ערכי-אמת מ-maor/src/types/config.ts:65)
  final known = <dynamic>['he', 'en', 'yi'];

  final cases = <List<dynamic>>[
    // [site, want] — אחד-לאחד מול C במקור-ה-JS.
    [
      {'langs': ['en', 'he']},
      ['en', 'he'],
    ], // הסדר של הקונפיג נשמר
    [
      {'langs': ['he', 'he', 'en']},
      ['he', 'en'],
    ], // כפולים מוסרים
    [
      {'langs': ['fr', 'en']},
      ['en'],
    ], // לא-מוכרת מסוננת
    [
      {'langs': ['fr']},
      ['he'],
    ], // הכול סונן ⇒ ברירת-מחדל
    [
      {'langs': <dynamic>[]},
      ['he'],
    ], // רשימה ריקה
    [null, ['he']], // אין site (undefined ב-JS ⇒ null ב-Dart)
    [<String, dynamic>{}, ['he']], // site בלי langs
  ];

  var n = 0;
  for (final c in cases) {
    final site = c[0];
    final want = c[1] as List<dynamic>;
    final got = siteLangs(site, known);
    _eqList('דוגמה ${n + 1} (site=$site)', got, want);
    n++;
  }

  print('OK siteLangs: $n דוגמאות-חוזה — ירוק');
}
