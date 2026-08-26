// רתמת-זהב · nedarim-strong-match-for-charge — קלט+WANT זהים ל-new/atoms/*.test.mjs.
// שקעים = doubles מקומיים (גוף מ-norm-*.dart). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts nedarim-strong-match-for-charge_test.dart ⇒ exit 0.
import 'nedarim-strong-match-for-charge.dart';

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

void main() {
  final s = <Map<String, dynamic>>[
    {'id': 'a', 'name': 'אבי כהן', 'extId': 'T100', 'idNum': '', 'phone': '0501234567', 'email': 'avi@x.com', 'city': 'ירושלים', 'hist': []},
    {'id': 'b', 'name': 'דנה לוי', 'extId': '', 'idNum': '123456782', 'phone': '0529876543', 'email': '', 'city': '', 'hist': []},
    {'id': 'c', 'name': 'משה', 'extId': '', 'idNum': '', 'phone': '', 'email': '', 'city': '', 'hist': []},
  ];
  final ch1 = {'toremId': 'T100', 'amount': 100, 'txnId': 'TX1', 'd': '2026-08-10', 'currency': '₪'};
  final ch3 = {'name': 'לא ידוע פלוני', 'amount': 50, 'txnId': 'TX3'};

  final m1 = strongMatchForCharge(ch1, s, normId: _normId, normPhone: _normPhone, normSearch: _normSearch) as Map<String, dynamic>?;
  final m3 = strongMatchForCharge(ch3, s, normId: _normId, normPhone: _normPhone, normSearch: _normSearch) as Map<String, dynamic>?;
  final got = [m1 == null ? null : m1['id'], m3 == null ? null : m3['id']];
  const want = ['a', null];
  assert(got[0] == want[0] && got[1] == want[1],
      '✗ nedarim-strong-match-for-charge\n$got\n≠\n$want');
  print('✓ nedarim-strong-match-for-charge (Dart): Golden — ירוק');
}
