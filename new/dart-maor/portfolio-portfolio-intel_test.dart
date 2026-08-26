// רתמת-זהב · portfolio-portfolio-intel — פלט מקודד JSON נאמן-JS מול WANT המדויק
// מ-new/atoms/portfolio-portfolio-intel.test.mjs. שקעים-inline = פורט ביט-אחר-ביט של שקעי-בדיקת-ה-JS.
import 'portfolio-portfolio-intel.dart';

const int _msDay = 86400000;
int _round(num x) => (x + 0.5).floor();

num _dayDiff(dynamic iso, String today) {
  if (iso == null || iso == '') return double.infinity;
  final a = DateTime.tryParse('${(iso as String).substring(0, 10)}T12:00:00');
  final b = DateTime.tryParse('${today.substring(0, 10)}T12:00:00');
  if (a == null || b == null) return double.infinity;
  return ((b.millisecondsSinceEpoch - a.millisecondsSinceEpoch) / _msDay).floor();
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
    final num v = (((cur == null || cur == '') ? '₪' : cur) == r'$')
        ? (amount as num) * rate
        : (amount as num);
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

num _churnFromScan(Map scan, String today) {
  if ((scan['count'] as num) == 0 || scan['last'] == null || scan['last'] == '') return 0;
  final num ds = _dayDiff(scan['last'], today);
  final num span = (scan['first'] != null && scan['first'] != '' && scan['first'] != scan['last']) ? _dayDiff(scan['first'], scan['last'] as String) : 0;
  final num cad = ((scan['count'] as num) >= 2 && span > 0) ? span / ((scan['count'] as num) - 1) : 365;
  final num e = (cad * 1.5) > 30 ? cad * 1.5 : 30;
  final int rounded = _round(ds / e * 50);
  return rounded < 0 ? 0 : (rounded > 100 ? 100 : rounded);
}

Map<String, dynamic>? _forecastFromScan(Map scan, String today) {
  if ((scan['count'] as num) == 0 || scan['last'] == null || scan['last'] == '') return null;
  final int avg = _round((scan['ils'] as num) / (scan['count'] as num));
  final num span = (scan['first'] != null && scan['first'] != '' && scan['first'] != scan['last']) ? _dayDiff(scan['first'], scan['last'] as String) : 0;
  final num cad = ((scan['count'] as num) >= 2 && span > 0) ? span / ((scan['count'] as num) - 1) : 365;
  final lastMs = DateTime.parse('${(scan['last'] as String).substring(0, 10)}T12:00:00').millisecondsSinceEpoch;
  final double tms = lastMs.toDouble() + cad * 86400000;
  final int clipped = tms.truncateToDouble().toInt();
  final due = DateTime.fromMillisecondsSinceEpoch(clipped);
  final dueIso = due.toUtc().toIso8601String().substring(0, 10);
  final num ds = _dayDiff(scan['last'], today);
  final num over = cad > 0 ? ((ds / cad - 1) > 0 ? ds / cad - 1 : 0) : 0;
  final int rc = _round(30 + (scan['count'] as num) * 7 - over * 25);
  final int cmin = rc < 92 ? rc : 92;
  final int conf = cmin > 15 ? cmin : 15;
  return {'amount': avg, 'dueIso': dueIso, 'confidence': conf};
}

Map<String, dynamic> _supTier(num sc) => sc >= 800 ? {'label': 'זהב'} : (sc >= 600 ? {'label': 'כסף'} : (sc >= 400 ? {'label': 'ארד'} : {'label': 'רדומה'}));

// —— מקודד JSON נאמן-JS ——
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
      '{"count":3,"giftCount":4,"ltv":7650,"avgGift":1913,"retention12m":100,"atRiskCount":0,"atRiskMoney":0,"concentrationTopN":100,"topN":10,"forecast30":0,"forecast90":0,"scoreBins":[0,0,0,0,1,0,0,0,1,0],"tierCounts":{"זהב":1,"ארד":1}}';
  final got = _enc(portfolioIntel(
    s,
    t,
    rate: 3.7,
    topN: 10,
    donorScan: _donorScan,
    dayDiff: _dayDiff,
    rfmFromScan: _rfmFromScan,
    churnFromScan: _churnFromScan,
    forecastFromScan: _forecastFromScan,
    supTier: _supTier,
  ));
  if (got != want) {
    throw StateError('✗ portfolio-portfolio-intel\n$got\n≠\n$want');
  }
  print('✓ portfolio-portfolio-intel (Dart): Golden — ירוק');
}
