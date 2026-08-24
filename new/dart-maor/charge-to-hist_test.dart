// בדיקת-חוזה (רתמת-זהב) · chargeToHist — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/charge-to-hist.test.mjs:
//   שקעים-מיני כמתועד: curOf ⇒ '$'/'₪' · providerClearer ⇒ 'סולה' (Sola)/'נדרים'.
//   1) עסקה מלאה — כל השדות עוברים + הקלט לא-הופר (8 מפתחות, d ללא-שינוי).
//   2) d חסר ⇒ נגזר מ-at (slice 0..10).
//   3) עסקה מינימלית — d/a/c/clearer בלבד, אפס מפתחות אופציונליים.
//   4) provider Sola ⇒ 'סולה' דרך השקע.
//   5) רווחים-בלבד נעדר; גזימה (' T2 ' ⇒ 'T2').
//   6) d קודם ל-at.
// המרה: JSON.stringify(order-sensitive) ⇒ mapEq (אורך+מפתחות+ערכים); `in` ⇒ containsKey.
// הרצה: dart run --enable-asserts new/dart-maor/charge-to-hist_test.dart  ⇒ exit 0
import 'charge-to-hist.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

bool _mapEq(Map a, Map b) {
  if (a.length != b.length) return false;
  for (final k in a.keys) {
    if (!b.containsKey(k) || a[k] != b[k]) return false;
  }
  return true;
}

// שקעים-מיני, זהים למקור-ה-JS.
String _curOf(Map<String, dynamic> c) =>
    ((c['currency'] == null ? '' : c['currency'].toString()).trim() == r'$')
        ? r'$'
        : '₪';
String _providerClearer(dynamic p) =>
    RegExp('sola', caseSensitive: false).hasMatch(p == null ? '' : p.toString())
        ? 'סולה'
        : 'נדרים';

void main() {
  var n = 0;

  // 1) עסקה מלאה — כל השדות עוברים.
  {
    final src = <String, dynamic>{
      'd': '2026-08-01',
      'amount': 180,
      'currency': '₪',
      'reference': 'R1',
      'txnId': 'T1',
      'receipt': 'K5',
      'last4': '1234',
      'kevaId': 'KV7',
    };
    final h = chargeToHist(src, _curOf, _providerClearer);
    _ok(
        _mapEq(h, {
          'd': '2026-08-01',
          'a': 180,
          'c': '₪',
          'clearer': 'נדרים',
          'ref': 'R1',
          'txn': 'T1',
          'receipt': 'K5',
          'last4': '1234',
          'kevaId': 'KV7',
        }),
        'עסקה מלאה שגויה: $h');
    n++;
    _ok(src['d'] == '2026-08-01' && src.length == 8, 'הקלט שונה — הופר הטוהר');
    n++;
  }

  // 2) d חסר ⇒ נגזר מ-at.
  _ok(
      chargeToHist(
              {'at': '2026-08-24T10:30:00', 'amount': 50}, _curOf, _providerClearer)['d'] ==
          '2026-08-24',
      'd לא נגזר מ-at');
  n++;

  // 3) עסקה מינימלית — אפס מפתחות אופציונליים.
  {
    final h =
        chargeToHist({'amount': 50, 'currency': r'$'}, _curOf, _providerClearer);
    _ok(_mapEq(h, {'d': '', 'a': 50, 'c': r'$', 'clearer': 'נדרים'}),
        'מינימלית: מפתחות עודפים/חסרים — $h');
    n++;
    _ok(
        !h.containsKey('ref') &&
            !h.containsKey('txn') &&
            !h.containsKey('receipt') &&
            !h.containsKey('last4') &&
            !h.containsKey('kevaId'),
        'מפתח אופציונלי ריק נכנס');
    n++;
  }

  // 4) provider Sola ⇒ סולה.
  _ok(
      chargeToHist({'amount': 1, 'provider': 'Sola'}, _curOf, _providerClearer)['clearer'] ==
          'סולה',
      'סולה לא זוהתה');
  n++;

  // 5) רווחים-בלבד נעדר; גזימה.
  {
    final h = chargeToHist(
        {'amount': 1, 'reference': '   ', 'txnId': ' T2 '}, _curOf, _providerClearer);
    _ok(!h.containsKey('ref') && h['txn'] == 'T2', 'רווחים-בלבד/גזימה שגויים');
    n++;
  }

  // 6) d קודם ל-at.
  _ok(
      chargeToHist({'d': '2026-01-05', 'at': '2026-08-24T10:30:00', 'amount': 1},
              _curOf, _providerClearer)['d'] ==
          '2026-01-05',
      'd לא קודם ל-at');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(chargeToHist({'amount': 1}, _curOf, _providerClearer)['clearer'] == 'נדרים',
      'assert-live guard');

  print('OK chargeToHist: $n asserts passed');
}
