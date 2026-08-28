import '../dart-data-maor/segments-segment-counts-terms.dart' as td_segments_segment_counts;
// רתמת-זהב · segments-segment-counts — הפלט מקודד ב-JSON נאמן-JS ומושווה ל-WANT המדויק
// מ-new/atoms/segments-segment-counts.test.mjs (זהות: אותם קלטים→אותו JSON.stringify).
// שקעים-inline מבונים = העתק ביט-אחר-ביט של שקעי-בדיקת-ה-JS (daysSince/supX/atRisk).
import 'segments-segment-counts.dart';

num _daysSince(dynamic iso, String today) {
  const m = 86400000;
  if (iso == null || iso == '') return double.infinity;
  final t = DateTime.tryParse('${iso}T12:00:00');
  final n = DateTime.tryParse('${today}T12:00:00');
  if (t == null || n == null) return double.infinity;
  return ((n.millisecondsSinceEpoch - t.millisecondsSinceEpoch) / m).floor();
}

int _supCount(dynamic sp) => (sp['donations'] as List).length;
dynamic _supLast(dynamic sp) => sp['_last'];
num _supIls(dynamic sp) => (sp['_ils'] as num?) ?? 0;
num _supUsd(dynamic sp) => (sp['_usd'] as num?) ?? 0;

List _atRisk(List sups, String today, [int silent = 60]) {
  final out = sups.where((sp) {
    final hg = _supCount(sp) > 0 && _supLast(sp) != null && _supLast(sp) != '';
    if (!hg) return false;
    if (sp['nextDate'] != null && sp['nextDate'] != '') return false;
    return _daysSince(_supLast(sp), today) >= silent;
  }).toList();
  out.sort((a, b) => (_daysSince(_supLast(b), today) - _daysSince(_supLast(a), today)).sign.toInt());
  return out;
}

// —— מקודד JSON נאמן-JS (מספר שלם-ערך בלי ".0"; שבר = shortest-round-trip של Dart = V8) ——
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
    {'id': '1', 'name': 'א', 'email': 'a@x', 'hok': {'active': true}, '_ils': 6000, '_usd': 0, '_last': '2026-06-01', 'donations': [{'date': '2026-06-01'}]},
    {'id': '2', 'name': 'ב', 'email': '', '_ils': 100, '_usd': 0, '_last': '2025-01-01', 'donations': [{'date': '2025-01-01'}]},
    {'id': '3', 'name': 'ג', 'email': 'c@x', '_ils': 0, '_usd': 0, '_last': '', 'donations': []},
  ];
  const want =
      '[{"key":"atrisk","label":"בסיכון נטישה","dot":"#b45309","count":2},{"key":"goldsilent","label":"זהב · שקטים 60+ יום","dot":"#a05008","count":1},{"key":"hok","label":"הו״ק פעילות","dot":"#2e7d32","count":1},{"key":"gave12m","label":"תרמו ב-12 החודשים","dot":"#1d4ed8","count":1},{"key":"noemail","label":"ללא אימייל","dot":"#8a8172","count":1}]';
  final got = _enc(segmentCounts(
    s,
    t,
    rate: 3.7,
    cockpitAtRisk: _atRisk,
    supIls: _supIls,
    supUsd: _supUsd,
    supLast: _supLast,
    daysSince: _daysSince,
   term: (k)=>td_segments_segment_counts.kTerms[k]!));
  if (got != want) {
    throw StateError('✗ segments-segment-counts\n$got\n≠\n$want');
  }
  print('✓ segments-segment-counts (Dart): Golden — ירוק');
}
