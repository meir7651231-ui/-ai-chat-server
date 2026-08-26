// רתמת-זהב · segments-match-segment — פלט מקודד JSON נאמן-JS מול WANT המדויק
// מ-new/atoms/segments-match-segment.test.mjs (זהות: אותם קלטים→אותו JSON.stringify).
import 'segments-match-segment.dart';

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

String _encList(List<bool> v) => '[${v.map((b) => b ? 'true' : 'false').join(',')}]';

void main() {
  const t = '2026-08-26';
  final s = <Map<String, dynamic>>[
    {'id': '1', 'name': 'א', 'email': 'a@x', 'hok': {'active': true}, '_ils': 6000, '_usd': 0, '_last': '2026-06-01', 'donations': [{'date': '2026-06-01'}]},
    {'id': '2', 'name': 'ב', 'email': '', '_ils': 100, '_usd': 0, '_last': '2025-01-01', 'donations': [{'date': '2025-01-01'}]},
    {'id': '3', 'name': 'ג', 'email': 'c@x', '_ils': 0, '_usd': 0, '_last': '', 'donations': []},
  ];
  deps(dynamic sp, String key) => matchSegment(
        sp,
        key,
        s,
        t,
        rate: 3.7,
        cockpitAtRisk: _atRisk,
        supIls: _supIls,
        supUsd: _supUsd,
        supLast: _supLast,
        daysSince: _daysSince,
      );
  const want = '[true,true,false]';
  final got = _encList([
    deps(s[0], 'goldsilent'),
    deps(s[1], 'atrisk'),
    deps(s[0], 'noemail'),
  ]);
  if (got != want) {
    throw StateError('✗ segments-match-segment\n$got\n≠\n$want');
  }
  print('✓ segments-match-segment (Dart): Golden — ירוק');
}
