// רתמת-זהב · portfolio-active-by-month — פלט מקודד JSON נאמן-JS מול WANT המדויק
// מ-new/atoms/portfolio-active-by-month.test.mjs. שקע-inline (donorScan) = פורט ביט-אחר-ביט.
import 'portfolio-active-by-month.dart';

int _monthsBefore(String iso, String today) {
  final y = int.tryParse(iso.substring(0, 4)) ?? 0;
  final m = int.tryParse(iso.substring(5, 7)) ?? 0;
  final ty = int.tryParse(today.substring(0, 4)) ?? 0;
  final tm = int.tryParse(today.substring(5, 7)) ?? 0;
  if (y == 0 || m == 0 || ty == 0 || tm == 0) return -1;
  return ty * 12 + tm - (y * 12 + m);
}

Map<String, dynamic> _donorScan(dynamic sp, String today, num rate, int months) {
  final monthly = List<num>.filled(months, 0);
  int count = 0;
  num ils = 0;
  String first = '', last = '';
  void take(dynamic date, dynamic amount, dynamic cur) {
    if (date == null || date == '') return;
    count++;
    final num v = (((cur == null || cur == '') ? '₪' : cur) == r'$') ? (amount as num) * rate : (amount as num);
    ils += v;
    if (first == '' || (date as String).compareTo(first) < 0) first = date;
    if (last == '' || (date as String).compareTo(last) > 0) last = date;
    final mb = _monthsBefore(date as String, today);
    if (mb >= 0 && mb < months) monthly[months - 1 - mb] += v;
  }

  for (final d in (sp['donations'] as List)) {
    take(d['date'], d['amount'], d['cur']);
  }
  if (sp['hist'] != null) {
    for (final h in (sp['hist'] as List)) take(h['d'], h['a'], h['c']);
  }
  return {'count': count, 'ils': ils, 'first': first, 'last': last, 'monthly': monthly};
}

String _encIntList(List<int> v) => '[${v.join(',')}]';

void main() {
  const t = '2026-08-26';
  final s = <Map<String, dynamic>>[
    {'id': 'a', 'name': 'A', 'donations': [{'date': '2026-08-10', 'amount': 3000, 'cur': '₪'}, {'date': '2026-02-10', 'amount': 2500, 'cur': '₪'}, {'date': '2025-08-10', 'amount': 2000, 'cur': '₪'}], 'hist': []},
    {'id': 'b', 'name': 'B', 'donations': [{'date': '2026-07-01', 'amount': 150, 'cur': '₪'}], 'hist': []},
    {'id': 'c', 'name': 'C', 'donations': [], 'hist': []},
  ];
  const want = '[0,0,0,0,0,1,0,0,0,0,1,1]';
  final got = _encIntList(activeByMonth(s, t, months: 12, rate: 3.7, donorScan: _donorScan));
  if (got != want) {
    throw StateError('✗ portfolio-active-by-month\n$got\n≠\n$want');
  }
  print('✓ portfolio-active-by-month (Dart): Golden — ירוק');
}
