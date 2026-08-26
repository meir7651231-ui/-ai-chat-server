// רתמת-זהב · intel-donor-intel — אותם קלטים→פלטים של בדיקת-ה-JS (Golden). אם עובר ⇒ Dart≡JS.
// חמשת-השקעים = closures מקומיים המשחזרים את ה-doubles של ה-JS (חוק-1: אפס import-אח).
// דורש שעון-UTC (forecast). השוואה עמוקה מספרית (num==): 565.0==565 וכו'.
import 'intel-donor-intel.dart';

num _dayDiff(String iso, String today) {
  const msDay = 86400000;
  if (iso.isEmpty) return double.infinity;
  final a = DateTime.tryParse(
      '${iso.length < 10 ? iso : iso.substring(0, 10)}T12:00:00');
  final b = DateTime.tryParse(
      '${today.length < 10 ? today : today.substring(0, 10)}T12:00:00');
  if (a == null || b == null) return double.infinity;
  return ((b.millisecondsSinceEpoch - a.millisecondsSinceEpoch) / msDay).floor();
}

int _jsRound(num x) => (x + 0.5).floor();

int _monthsBefore(String iso, String today) {
  final y = iso.length >= 4 ? (int.tryParse(iso.substring(0, 4)) ?? 0) : 0;
  final m = iso.length >= 7 ? (int.tryParse(iso.substring(5, 7)) ?? 0) : 0;
  final ty = today.length >= 4 ? (int.tryParse(today.substring(0, 4)) ?? 0) : 0;
  final tm = today.length >= 7 ? (int.tryParse(today.substring(5, 7)) ?? 0) : 0;
  if (y == 0 || m == 0 || ty == 0 || tm == 0) return -1;
  return ty * 12 + tm - (y * 12 + m);
}

Map<String, dynamic> _donorScan(
    Map<String, dynamic> sp, String today, num rate, int months) {
  final monthly = List<num>.filled(months, 0);
  int count = 0;
  num ils = 0;
  String first = '', last = '';
  void take(dynamic date, dynamic amount, dynamic cur) {
    if (date == null || date == '') return;
    count++;
    final curEff = (cur == null || cur == '') ? '₪' : cur;
    final num v = curEff == '\$' ? (amount as num) * rate : (amount as num);
    ils += v;
    final ds = date as String;
    if (first.isEmpty || ds.compareTo(first) < 0) first = ds;
    if (last.isEmpty || ds.compareTo(last) > 0) last = ds;
    final mb = _monthsBefore(ds, today);
    if (mb >= 0 && mb < months) monthly[months - 1 - mb] += v;
  }

  final dons = sp['donations'] as List;
  for (final d in dons) {
    take((d as Map)['date'], d['amount'], d['cur']);
  }
  final hist = sp['hist'];
  if (hist != null) {
    for (final e in hist as List) {
      take((e as Map)['d'], e['a'], e['c']);
    }
  }
  return {'count': count, 'ils': ils, 'first': first, 'last': last, 'monthly': monthly};
}

Map<String, dynamic> _rfmFromScan(Map<String, dynamic> scan, String today) {
  int rS(num d) => d <= 30
      ? 350
      : d <= 90
          ? 280
          : d <= 180
              ? 200
              : d <= 365
                  ? 120
                  : 40;
  int fS(num c) => c >= 10
      ? 300
      : c >= 5
          ? 230
          : c >= 3
              ? 160
              : c >= 2
                  ? 100
                  : 50;
  int mS(num t) => t >= 5000
      ? 350
      : t >= 2000
          ? 280
          : t >= 1000
              ? 210
              : t >= 500
                  ? 140
                  : t >= 100
                      ? 80
                      : 40;
  final last = scan['last'];
  final num days =
      (last != null && last != '') ? _dayDiff(last as String, today) : 99999;
  final r = rS(days), f = fS(scan['count'] as num), m = mS(scan['ils'] as num);
  return {
    'r': r,
    'f': f,
    'm': m,
    'score': r + f + m,
    'rPct': _jsRound(r / 350 * 100),
    'fPct': _jsRound(f / 300 * 100),
    'mPct': _jsRound(m / 350 * 100),
  };
}

num _churnFromScan(Map<String, dynamic> scan, String today) {
  final last = scan['last'];
  if (scan['count'] == 0 || last == null || last == '') return 0;
  final num ds = _dayDiff(last as String, today);
  final first = scan['first'];
  final num span = (first != null && first != '' && first != last)
      ? _dayDiff(first as String, last)
      : 0;
  final int count = scan['count'] as int;
  final num cad = (count >= 2 && span > 0) ? span / (count - 1) : 365;
  final num exp = cad * 1.5 > 30 ? cad * 1.5 : 30;
  final num ratio = ds / exp;
  final v = _jsRound(ratio * 50);
  return v < 0 ? 0 : (v > 100 ? 100 : v);
}

Map<String, dynamic>? _forecastFromScan(Map<String, dynamic> scan, String today) {
  const msDay = 86400000;
  final last = scan['last'];
  if (scan['count'] == 0 || last == null || last == '') return null;
  final num ils = scan['ils'] as num;
  final int count = scan['count'] as int;
  final avg = _jsRound(ils / count);
  final first = scan['first'];
  final num span = (first != null && first != '' && first != last)
      ? _dayDiff(first as String, last as String)
      : 0;
  final num cad = (count >= 2 && span > 0) ? span / (count - 1) : 365;
  final ls = last as String;
  final lastMs =
      DateTime.parse('${ls.length < 10 ? ls : ls.substring(0, 10)}T12:00:00')
          .millisecondsSinceEpoch;
  final num dueMs = lastMs + cad * msDay;
  final due = DateTime.fromMillisecondsSinceEpoch(dueMs.toInt(), isUtc: true);
  final dueIso = '${due.year.toString().padLeft(4, '0')}-'
      '${due.month.toString().padLeft(2, '0')}-'
      '${due.day.toString().padLeft(2, '0')}';
  final num ds = _dayDiff(ls, today);
  final num over = cad > 0 ? (ds / cad - 1 > 0 ? ds / cad - 1 : 0) : 0;
  final v = _jsRound(30 + count * 7 - over * 25);
  final conf = v < 15 ? 15 : (v > 92 ? 92 : v);
  return {'amount': avg, 'dueIso': dueIso, 'confidence': conf};
}

Map<String, dynamic> _trendFromScan(Map<String, dynamic> scan) {
  final mo = scan['monthly'] as List;
  final n = mo.length, h = n ~/ 2;
  num o = 0, w = 0;
  for (var i = 0; i < h; i++) o += mo[i] as num;
  for (var i = n - h; i < n; i++) w += mo[i] as num;
  if (o == 0 && w == 0) return {'dir': 'flat', 'pct': 0};
  final int pct = o == 0 ? 100 : _jsRound((w - o) / o * 100);
  return {
    'dir': pct > 8
        ? 'up'
        : pct < -8
            ? 'down'
            : 'flat',
    'pct': pct,
  };
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
  if (a is num && b is num) return a == b;
  return a == b;
}

void main() {
  const t = '2026-08-26';
  final sp = <String, dynamic>{
    'donations': [
      {'date': '2026-08-10', 'amount': 200, 'cur': '₪'},
      {'date': '2026-05-10', 'amount': 100, 'cur': '₪'},
      {'date': '2025-11-10', 'amount': 50, 'cur': '\$'},
    ],
    'hist': [
      {'d': '2025-08-10', 'a': 80, 'c': '₪'},
    ],
  };
  final got = donorIntel(
    sp,
    t,
    rate: 3.7,
    months: 12,
    donorScan: _donorScan,
    rfmFromScan: _rfmFromScan,
    churnFromScan: _churnFromScan,
    forecastFromScan: _forecastFromScan,
    trendFromScan: _trendFromScan,
  );
  final want = <String, dynamic>{
    'scan': {
      'count': 4,
      'ils': 565,
      'first': '2025-08-10',
      'last': '2026-08-10',
      'monthly': [0, 0, 185, 0, 0, 0, 0, 0, 100, 0, 0, 200],
    },
    'rfm': {
      'r': 350,
      'f': 160,
      'm': 140,
      'score': 650,
      'rPct': 100,
      'fPct': 53,
      'mPct': 40,
    },
    'churn': 4,
    'forecast': {'amount': 141, 'dueIso': '2026-12-10', 'confidence': 58},
    'trend': {'dir': 'up', 'pct': 62},
    'ltv': 565,
    'avgGift': 141,
  };
  assert(_deepEq(got, want), '✗ intel-donor-intel ⇒ $got ≠ $want');
  print('✓ intel-donor-intel (Dart): Golden — ירוק');
}
