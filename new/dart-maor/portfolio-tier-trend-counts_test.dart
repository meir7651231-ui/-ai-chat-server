import '../dart-data-maor/portfolio-tier-trend-counts-terms.dart' as td_portfolio_tier_trend_counts;
// רתמת-זהב · portfolio-tier-trend-counts — פלט מקודד JSON נאמן-JS מול WANT המדויק
// מ-new/atoms/portfolio-tier-trend-counts.test.mjs. שקעים-inline = פורט ביט-אחר-ביט של שקעי-ה-JS.
import 'portfolio-tier-trend-counts.dart';

int _round(num x) => (x + 0.5).floor();

num _dayDiff(dynamic iso, String today) {
  const msDay = 86400000;
  if (iso == null || iso == '') return double.infinity;
  final a = DateTime.tryParse('${(iso as String).substring(0, 10)}T12:00:00');
  final b = DateTime.tryParse('${today.substring(0, 10)}T12:00:00');
  if (a == null || b == null) return double.infinity;
  return ((b.millisecondsSinceEpoch - a.millisecondsSinceEpoch) / msDay).floor();
}

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

Map<String, dynamic> _rfmFromScan(Map scan, String today) {
  int rS(num d) => d <= 30 ? 350 : (d <= 90 ? 280 : (d <= 180 ? 200 : (d <= 365 ? 120 : 40)));
  int fS(num c) => c >= 10 ? 300 : (c >= 5 ? 230 : (c >= 3 ? 160 : (c >= 2 ? 100 : 50)));
  int mS(num t) => t >= 5000 ? 350 : (t >= 2000 ? 280 : (t >= 1000 ? 210 : (t >= 500 ? 140 : (t >= 100 ? 80 : 40))));
  final num days = (scan['last'] != null && scan['last'] != '') ? _dayDiff(scan['last'], today) : 99999;
  final r = rS(days), f = fS(scan['count'] as num), m = mS(scan['ils'] as num);
  return {'r': r, 'f': f, 'm': m, 'score': r + f + m, 'rPct': _round(r / 350 * 100), 'fPct': _round(f / 300 * 100), 'mPct': _round(m / 350 * 100)};
}

Map<String, dynamic> _trendFromScan(Map scan) {
  final mo = scan['monthly'] as List;
  final n = mo.length;
  final h = (n / 2).floor();
  num o = 0, w = 0;
  for (int i = 0; i < h; i++) {
    o += mo[i] as num;
  }
  for (int i = n - h; i < n; i++) {
    w += mo[i] as num;
  }
  if (o == 0 && w == 0) return {'dir': 'flat', 'pct': 0};
  final int pct = o == 0 ? 100 : _round((w - o) / o * 100);
  return {'dir': pct > 8 ? 'up' : (pct < -8 ? 'down' : 'flat'), 'pct': pct};
}

Map<String, dynamic> _supTier(num sc) => sc >= 800 ? {'label': 'זהב'} : (sc >= 600 ? {'label': 'כסף'} : (sc >= 400 ? {'label': 'ארד'} : {'label': 'רדומה'}));

String _enc(dynamic v) {
  if (v == null) return 'null';
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) return _numStr(v);
  if (v is String) return _strStr(v);
  if (v is List) return '[${v.map(_enc).join(',')}]';
  if (v is Map) {
    return '{${v.entries.map((e) => '${_strStr(e.key.toString())}:${_enc(e.value)}').join(',')}}';
  }
  throw StateError('unencodable: $v');
}

String _numStr(num n) {
  if (n is int) return n.toString();
  final d = n as double;
  if (d.isNaN) return 'NaN';
  if (d.isInfinite) return d.isNegative ? '-Infinity' : 'Infinity';
  if (d == d.truncateToDouble() && d.abs() < 1e21) return d.toInt().toString();
  return d.toString();
}

String _strStr(String s) {
  final b = StringBuffer('"');
  for (final r in s.runes) {
    if (r == 0x22) {
      b.write('\\"');
    } else if (r == 0x5C) {
      b.write('\\\\');
    } else if (r == 0x0A) {
      b.write('\\n');
    } else if (r == 0x0D) {
      b.write('\\r');
    } else if (r == 0x09) {
      b.write('\\t');
    } else if (r == 0x08) {
      b.write('\\b');
    } else if (r == 0x0C) {
      b.write('\\f');
    } else if (r < 0x20) {
      b.write('\\u${r.toRadixString(16).padLeft(4, '0')}');
    } else {
      b.writeCharCode(r);
    }
  }
  b.write('"');
  return b.toString();
}

void main() {
  const t = '2026-08-26';
  final s = <Map<String, dynamic>>[
    {'id': 'a', 'name': 'A', 'donations': [{'date': '2026-08-10', 'amount': 3000, 'cur': '₪'}, {'date': '2026-02-10', 'amount': 2500, 'cur': '₪'}, {'date': '2025-08-10', 'amount': 2000, 'cur': '₪'}], 'hist': []},
    {'id': 'b', 'name': 'B', 'donations': [{'date': '2026-07-01', 'amount': 150, 'cur': '₪'}], 'hist': []},
    {'id': 'c', 'name': 'C', 'donations': [], 'hist': []},
  ];
  const want =
      '[{"tier":"זהב","total":1,"rising":1,"falling":0,"stable":0},{"tier":"כסף","total":0,"rising":0,"falling":0,"stable":0},{"tier":"ארד","total":1,"rising":1,"falling":0,"stable":0},{"tier":"רדומה","total":0,"rising":0,"falling":0,"stable":0}]';
  final got = _enc(tierTrendCounts(
    s,
    t,
    rate: 3.7,
    donorScan: _donorScan,
    rfmFromScan: _rfmFromScan,
    trendFromScan: _trendFromScan,
    supTier: _supTier,
   term: (k)=>td_portfolio_tier_trend_counts.kTerms[k]!));
  if (got != want) {
    throw StateError('✗ portfolio-tier-trend-counts\n$got\n≠\n$want');
  }
  print('✓ portfolio-tier-trend-counts (Dart): Golden — ירוק');
}
