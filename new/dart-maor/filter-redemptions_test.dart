// 🏅 רתמת-זהב · filterRedemptions — 5 דוגמאות-החוזה, זהות ביט-אחר-ביט לבדיקת-ה-JS
// (new/atoms/filter-redemptions.test.mjs). עובר ⇒ Dart ≡ JS (חוק-4).
// הרצה: dart run --enable-asserts new/dart-maor/filter-redemptions_test.dart ⇒ exit 0.
import 'filter-redemptions.dart';

void main() {
  // dateInRange-מזויף בהתאם לחוזה החוט המשותף: טווח כוללני, קצה ריק=פתוח.
  // (JS: (!fromIso || iso >= fromIso) && (!toIso || iso <= toIso); ISO ⇒ השוואה לקסיקוגרפית.)
  bool dateInRange(dynamic iso, String fromIso, String toIso) {
    final s = iso as String;
    return (fromIso.isEmpty || s.compareTo(fromIso) >= 0) &&
        (toIso.isEmpty || s.compareTo(toIso) <= 0);
  }

  final r1 = <String, dynamic>{'id': 'r1', 'date': '2026-01-01'};
  final r2 = <String, dynamic>{'id': 'r2', 'date': '2026-02-15', 'voidedAt': '2026-02-16'};
  final r3 = <String, dynamic>{'id': 'r3', 'date': '2026-03-01'};
  final a = <String, dynamic>{'redemptions': <dynamic>[r1, r2, r3]};

  List<dynamic> ids(List<dynamic> out) =>
      out.map((r) => (r as Map)['id']).toList();

  bool listEq(List<dynamic> x, List<dynamic> y) {
    if (x.length != y.length) return false;
    for (var i = 0; i < x.length; i++) {
      if (x[i] != y[i]) return false;
    }
    return true;
  }

  // 1) טווח פתוח + includeVoided=true ⇒ הכול
  assert(
      listEq(ids(filterRedemptions(a, '', '', true, dateInRange)),
          ['r1', 'r2', 'r3']),
      'טווח פתוח כולל-מבוטל שגוי');

  // 2) includeVoided=false ⇒ המבוטל בחוץ
  assert(
      listEq(ids(filterRedemptions(a, '', '', false, dateInRange)),
          ['r1', 'r3']),
      'המבוטל לא הוחרג');

  // 3) קצה עליון כוללני
  assert(
      listEq(
          ids(filterRedemptions(
              a, '2026-02-01', '2026-03-01', true, dateInRange)),
          ['r2', 'r3']),
      'קצה עליון לא כוללני');

  // 4) טווח יום-אחד כוללני משני הקצוות
  assert(
      listEq(
          ids(filterRedemptions(
              a, '2026-01-01', '2026-01-01', false, dateInRange)),
          ['r1']),
      'טווח יום-אחד שגוי');

  // 5) ריק ⇒ ריק
  assert(
      listEq(
          filterRedemptions(<String, dynamic>{'redemptions': <dynamic>[]}, '',
              '', true, dateInRange),
          <dynamic>[]),
      'ריק לא החזיר []');

  print('✓ filter-redemptions (Dart): 5 דוגמאות-חוזה — ירוק · Dart ≡ JS');
}
