// רתמת-זהב · nedarim-auto-match-charges — קלט+WANT זהים ל-new/atoms/*.test.mjs.
// שקעים = doubles מקומיים (גוף מ-norm-*.dart). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts nedarim-auto-match-charges_test.dart ⇒ exit 0.
import 'nedarim-auto-match-charges.dart';

String _normId(String? s) {
  final d = (s ?? '').replaceAll(RegExp(r'\D'), '');
  if (d.isEmpty || RegExp(r'^0+$').hasMatch(d)) return '';
  if (d.replaceFirst(RegExp(r'^0+'), '').length < 4) return '';
  return d.length >= 5 ? d : '';
}

String _normPhone(String? s) {
  var d = (s ?? '').replaceAll(RegExp(r'\D'), '');
  if (RegExp(r'^(\d)\1+$').hasMatch(d)) return '';
  d = d.replaceFirst(RegExp(r'^00'), '');
  if (d.startsWith('972')) d = '0' + d.substring(3);
  return d.replaceFirst(RegExp(r'^0{2,}'), '0');
}

String _normSearch(dynamic t) {
  const finals = {'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ'};
  return (t ?? '')
      .toString()
      .toLowerCase()
      .replaceAll(RegExp(r'[֑-ׇ]'), '')
      .replaceAllMapped(RegExp(r'[ךםןףץ]'), (m) => finals[m[0]]!)
      .replaceAll(RegExp('[\'"׳״\\-–._]'), '')
      .trim();
}

bool _deepEq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
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

void main() {
  final s = <Map<String, dynamic>>[
    {'id': 'a', 'name': 'אבי כהן', 'extId': 'T100', 'idNum': '', 'phone': '0501234567', 'email': 'avi@x.com', 'city': 'ירושלים', 'hist': []},
    {'id': 'b', 'name': 'דנה לוי', 'extId': '', 'idNum': '123456782', 'phone': '0529876543', 'email': '', 'city': '', 'hist': []},
    {'id': 'c', 'name': 'משה', 'extId': '', 'idNum': '', 'phone': '', 'email': '', 'city': '', 'hist': []},
  ];
  final ch1 = {'toremId': 'T100', 'amount': 100, 'txnId': 'TX1', 'd': '2026-08-10', 'currency': '₪'};
  final ch2 = {'phone': '0529876543', 'amount': 200, 'txnId': 'TX2', 'd': '2026-08-11'};
  final ch3 = {'name': 'לא ידוע פלוני', 'amount': 50, 'txnId': 'TX3'};

  final got = autoMatchCharges([ch1, ch2, ch3], s,
          normId: _normId, normPhone: _normPhone, normSearch: _normSearch)
      .map((x) => {'supId': x['supId'], 'txn': (x['charge'] as Map)['txnId']})
      .toList();
  final want = [
    {'supId': 'a', 'txn': 'TX1'},
    {'supId': 'b', 'txn': 'TX2'},
  ];
  assert(_deepEq(got, want), '✗ nedarim-auto-match-charges\n$got\n≠\n$want');
  print('✓ nedarim-auto-match-charges (Dart): Golden — ירוק');
}
