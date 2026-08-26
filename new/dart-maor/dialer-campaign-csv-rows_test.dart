// רתמת-זהב · dialer-campaign-csv-rows — קלט+WANT זהים ל-new/atoms/dialer-campaign-csv-rows.test.mjs.
// nameOf = double מקומי (id⇒'שם'+id). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts dialer-campaign-csv-rows_test.dart ⇒ exit 0.
import 'dialer-campaign-csv-rows.dart';

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
  final camp = <String, dynamic>{
    'name': 'C',
    'startedAt': '2026-08-26',
    'total': 3,
    'queue': ['3', '1'],
    'log': [
      {'id': '1', 'outcome': 'noanswer', 'at': '2026-08-26T10:00'},
      {'id': '2', 'outcome': 'donated', 'at': '2026-08-26T10:05', 'note': 'תרם 100'},
      {'id': '1', 'outcome': 'noanswer', 'at': '2026-08-26T10:10'},
    ],
  };
  Object? nameOf(Object? id) => 'שם$id';
  final want = [
    ['שם', 'תוצאה', 'הערה', 'מתי'],
    ['שם1', 'לא ענה', '', '2026-08-26T10:00'],
    ['שם2', 'תרם/ה', 'תרם 100', '2026-08-26T10:05'],
    ['שם1', 'לא ענה', '', '2026-08-26T10:10'],
  ];
  final got = campaignCsvRows(camp, nameOf);
  assert(_deepEq(got, want), '✗ dialer-campaign-csv-rows\n$got\n≠\n$want');
  print('✓ dialer-campaign-csv-rows (Dart): Golden — ירוק');
}
