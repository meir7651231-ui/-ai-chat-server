// רתמת-זהב · nedarim-candidate-supporters-for-charge — קלט+WANT זהים ל-new/atoms/*.test.mjs.
// שקעים = doubles מקומיים (גופם מ-new/dart-maor/norm-*.dart; nameSortKey=nsk 1-ארג׳ כמו ה-JS).
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts nedarim-candidate-supporters-for-charge_test.dart ⇒ exit 0.
import 'nedarim-candidate-supporters-for-charge.dart';

// --- doubles (גוף מ-norm-id.dart / norm-phone.dart / norm-search.dart) ---
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

String _nsk(dynamic t) {
  final toks =
      _normSearch(t).split(RegExp(r'\s+')).where((w) => w.isNotEmpty).toList();
  toks.sort();
  return toks.join(' ');
}

bool _deepEq(dynamic a, dynamic b) {
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
  final chName = {'name': 'דנה לוי', 'amount': 70, 'txnId': 'TX4'};

  final got = [
    candidateSupportersForCharge(ch1, s,
            normId: _normId, normPhone: _normPhone, normSearch: _normSearch, nameSortKey: _nsk)
        .map((x) => x['id'])
        .toList(),
    candidateSupportersForCharge(chName, s,
            normId: _normId, normPhone: _normPhone, normSearch: _normSearch, nameSortKey: _nsk)
        .map((x) => x['id'])
        .toList(),
  ];
  final want = [
    ['a'],
    ['b'],
  ];
  assert(_deepEq(got, want), '✗ nedarim-candidate-supporters-for-charge\n$got\n≠\n$want');
  print('✓ nedarim-candidate-supporters-for-charge (Dart): Golden — ירוק');
}
