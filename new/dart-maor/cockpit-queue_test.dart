// רתמת-זהב · cockpit-queue — אותם קלטים/WANT של בדיקת-ה-JS. שקעים = doubles מקומיים
// המשחזרים בדיוק את test-doubles של ה-JS (calls/thanks/hokTasks; בלי import-אח — חוק-1).
import 'dart:convert';
import 'cockpit-queue.dart';

num _daysSince(String iso, String today) {
  const m = 86400000;
  if (iso.isEmpty) return double.infinity;
  final t = DateTime.tryParse('${iso}T12:00:00');
  final n = DateTime.tryParse('${today}T12:00:00');
  if (t == null || n == null) return double.infinity;
  return ((n.millisecondsSinceEpoch - t.millisecondsSinceEpoch) / m).floor();
}

int _supCount(Map sp) => (sp['donations'] as List).length;
String _supLast(Map sp) => (sp['_last'] ?? '') as String;
num _supIls(Map sp) => (sp['_ils'] ?? 0) as num;
num _supUsd(Map sp) => (sp['_usd'] ?? 0) as num;

String _grp(num n) {
  final abs = n < 0 ? -n : n;
  final intPart = abs is int
      ? abs.toString()
      : (abs == abs.truncateToDouble() ? abs.toInt().toString() : abs.toString());
  final buf = StringBuffer();
  final len = intPart.length;
  for (var i = 0; i < len; i++) {
    if (i > 0 && (len - i) % 3 == 0) buf.write(',');
    buf.write(intPart[i]);
  }
  return (n < 0 ? '-' : '') + buf.toString();
}

String _numStr(num n) => (n is int || n == n.truncateToDouble()) ? n.toInt().toString() : n.toString();

List _atRisk(List sups, String today, [int silent = 60]) {
  final f = <Map>[];
  for (final x in sups) {
    final sp = x as Map;
    if (!(_supCount(sp) > 0 && _supLast(sp).isNotEmpty)) continue;
    final nd = sp['nextDate'];
    if (nd != null && nd != '') continue;
    if (_daysSince(_supLast(sp), today) >= silent) f.add(sp);
  }
  final order = List<int>.generate(f.length, (i) => i);
  order.sort((x, y) {
    final c = _daysSince(_supLast(f[y]), today).compareTo(_daysSince(_supLast(f[x]), today));
    return c != 0 ? c : x.compareTo(y);
  });
  return [for (final i in order) f[i]];
}

String _valueTag(Map sp, num rate) {
  final ils = _supIls(sp) + _supUsd(sp) * rate;
  if (ils >= 5000) return 'תורם/ת מרכזי/ת';
  if (ils >= 1000) return 'תורם/ת מהותי/ת';
  return 'תורם/ת';
}

List _calls(List sups, String today, [num rate = 3.7, int silent = 60]) {
  final tasks = <Map<String, dynamic>>[];
  final seen = <Object?>{};
  for (final x in sups) {
    final sp = x as Map;
    final nd = sp['nextDate'];
    if (nd == null || nd == '' || (nd as String).compareTo(today) > 0) continue;
    final late = _daysSince(nd, today);
    tasks.add({'id': 'call:' + sp['id'].toString(), 'kind': 'call', 'supId': sp['id'], 'name': sp['name'], 'phone': (sp['phone'] == null || sp['phone'] == '') ? '' : sp['phone'], 'email': (sp['email'] == null || sp['email'] == '') ? '' : sp['email'], 'reason': late <= 0 ? 'יעד-קשר להיום' : 'יעד-קשר עבר לפני ' + _numStr(late) + ' יום', 'severity': 'due', 'sort': 1000000 + late});
    seen.add(sp['id']);
  }
  for (final x in _atRisk(sups, today, silent)) {
    final sp = x as Map;
    if (seen.contains(sp['id'])) continue;
    final sil = _daysSince(_supLast(sp), today);
    tasks.add({'id': 'call:' + sp['id'].toString(), 'kind': 'call', 'supId': sp['id'], 'name': sp['name'], 'phone': (sp['phone'] == null || sp['phone'] == '') ? '' : sp['phone'], 'email': (sp['email'] == null || sp['email'] == '') ? '' : sp['email'], 'reason': _valueTag(sp, rate) + ' · שקט/ה ' + _numStr(sil) + ' יום', 'severity': 'risk', 'sort': sil});
    seen.add(sp['id']);
  }
  final order = List<int>.generate(tasks.length, (i) => i);
  order.sort((x, y) {
    final c = (tasks[y]['sort'] as num).compareTo(tasks[x]['sort'] as num);
    return c != 0 ? c : x.compareTo(y);
  });
  return [for (final i in order) tasks[i]];
}

List _thanks(List sups, String today, [int win = 3]) {
  Map? ld(Map sp) {
    Map? b;
    for (final dd in (sp['donations'] as List)) {
      final d = dd as Map;
      if (d['date'] == null || d['date'] == '') continue;
      if (b == null || (d['date'] as String).compareTo(b!['date'] as String) > 0) {
        b = {'date': d['date'], 'amount': d['amount'], 'cur': (d['cur'] == null || d['cur'] == '') ? '₪' : d['cur']};
      }
    }
    for (final hh in ((sp['hist'] ?? const []) as List)) {
      final h = hh as Map;
      if (h['d'] == null || h['d'] == '') continue;
      if (b == null || (h['d'] as String).compareTo(b!['date'] as String) > 0) {
        b = {'date': h['d'], 'amount': h['a'], 'cur': (h['c'] == null || h['c'] == '') ? '₪' : h['c']};
      }
    }
    return b;
  }

  final tasks = <Map<String, dynamic>>[];
  for (final x in sups) {
    final sp = x as Map;
    final last = ld(sp);
    if (last == null) continue;
    final ago = _daysSince(last['date'] as String, today);
    if (ago < 0 || ago > win) continue;
    final money = last['cur'] == '\$' ? '\$' + _grp(last['amount'] as num) : '₪' + _grp(last['amount'] as num);
    tasks.add({'id': 'thanks:' + sp['id'].toString(), 'kind': 'thanks', 'supId': sp['id'], 'name': sp['name'], 'phone': (sp['phone'] == null || sp['phone'] == '') ? '' : sp['phone'], 'email': (sp['email'] == null || sp['email'] == '') ? '' : sp['email'], 'reason': 'תרם/ה ' + money + ' · ' + (ago <= 0 ? 'היום' : 'לפני ' + _numStr(ago) + ' יום'), 'severity': 'warm', 'sort': win - ago});
  }
  final order = List<int>.generate(tasks.length, (i) => i);
  order.sort((x, y) {
    final c = (tasks[y]['sort'] as num).compareTo(tasks[x]['sort'] as num);
    return c != 0 ? c : x.compareTo(y);
  });
  return [for (final i in order) tasks[i]];
}

List _hokTasks(List sups, String today) {
  return sups.where((s) => (s as Map)['hok'] != null).map((s) {
    final sp = s as Map;
    final hok = sp['hok'] as Map;
    final money = hok['cur'] == '\$' ? '\$' + _grp(hok['amount'] as num) : '₪' + _grp(hok['amount'] as num);
    final day = hok['day'];
    final dayVal = (day == null || day == 0) ? 0 : (day as num);
    return <String, dynamic>{'id': 'hok:' + sp['id'].toString(), 'kind': 'hok', 'supId': sp['id'], 'name': sp['name'], 'phone': (sp['phone'] == null || sp['phone'] == '') ? '' : sp['phone'], 'email': (sp['email'] == null || sp['email'] == '') ? '' : sp['email'], 'reason': 'הו״ק ' + money + ' · יום ' + _numStr(day as num) + ' — טרם נרשם החודש', 'severity': 'due', 'sort': 100 - dayVal};
  }).toList();
}

void main() {
  const today = '2026-08-26';
  final s = [
    {'id': '1', 'name': 'אבי כהן', 'phone': '050', 'email': 'a@x.com', 'nextDate': '2026-08-20', 'donations': [{'date': '2026-08-24', 'amount': 100, 'cur': '₪'}], 'hist': [], '_ils': 100, '_usd': 0, '_last': '2026-08-24'},
    {'id': '2', 'name': 'דנה לוי', 'phone': '052', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-01-10', 'amount': 50, 'cur': '₪'}], 'hist': [], '_ils': 50, '_usd': 0, '_last': '2026-01-10'},
    {'id': '3', 'name': 'משה', 'phone': '', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-08-25', 'amount': 300, 'cur': '\$'}], 'hist': [], '_ils': 0, '_usd': 300, '_last': '2026-08-25', 'hok': {'amount': 200, 'cur': '₪', 'day': 5}},
    {'id': '4', 'name': 'רות', 'phone': '054', 'email': '', 'nextDate': '', 'donations': [], 'hist': [], '_ils': 0, '_usd': 0, '_last': ''},
  ];
  const want =
      '{"calls":[{"id":"call:1","kind":"call","supId":"1","name":"אבי כהן","phone":"050","email":"a@x.com","reason":"יעד-קשר עבר לפני 6 יום","severity":"due","sort":1000006},{"id":"call:2","kind":"call","supId":"2","name":"דנה לוי","phone":"052","email":"","reason":"תורם/ת · שקט/ה 228 יום","severity":"risk","sort":228}],"thanks":[{"id":"thanks:3","kind":"thanks","supId":"3","name":"משה","phone":"","email":"","reason":"תרם/ה \$300 · לפני 1 יום","severity":"warm","sort":2},{"id":"thanks:1","kind":"thanks","supId":"1","name":"אבי כהן","phone":"050","email":"a@x.com","reason":"תרם/ה ₪100 · לפני 2 יום","severity":"warm","sort":1}],"hok":[{"id":"hok:3","kind":"hok","supId":"3","name":"משה","phone":"","email":"","reason":"הו״ק ₪200 · יום 5 — טרם נרשם החודש","severity":"due","sort":95}],"tasks":[{"id":"call:1","kind":"call","supId":"1","name":"אבי כהן","phone":"050","email":"a@x.com","reason":"יעד-קשר עבר לפני 6 יום","severity":"due","sort":1000006},{"id":"call:2","kind":"call","supId":"2","name":"דנה לוי","phone":"052","email":"","reason":"תורם/ת · שקט/ה 228 יום","severity":"risk","sort":228},{"id":"thanks:3","kind":"thanks","supId":"3","name":"משה","phone":"","email":"","reason":"תרם/ה \$300 · לפני 1 יום","severity":"warm","sort":2},{"id":"thanks:1","kind":"thanks","supId":"1","name":"אבי כהן","phone":"050","email":"a@x.com","reason":"תרם/ה ₪100 · לפני 2 יום","severity":"warm","sort":1},{"id":"hok:3","kind":"hok","supId":"3","name":"משה","phone":"","email":"","reason":"הו״ק ₪200 · יום 5 — טרם נרשם החודש","severity":"due","sort":95}],"total":5}';
  final got = jsonEncode(cockpitQueue(s, today, 3.7, _calls, _thanks, _hokTasks));
  assert(got == want, '✗ cockpit-queue\n$got\n≠\n$want');
  print('✓ cockpit-queue (Dart): Golden — ירוק');
}
