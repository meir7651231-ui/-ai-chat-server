// בדיקת-חוזה (רתמת-זהב) · planNedarimSync — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/plan-nedarim-sync.test.mjs
// (אותם קלטים→פלטים; אותם שקעי-ייחוס נאמנים-למקור). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/plan-nedarim-sync_test.dart ⇒ exit 0
import 'dart:math';
import 'plan-nedarim-sync.dart';

int _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    print('✗ $msg');
  }
}

// ── שקעי-שפה מקומיים (מחקים JS) ──
bool _falsy(dynamic v) =>
    v == null || v == false || v == 0 || v == '' || (v is num && v.isNaN);
bool _truthy(dynamic v) => !_falsy(v);
dynamic _or(List<dynamic> xs) {
  for (final x in xs) {
    if (_truthy(x)) return x;
  }
  return xs.isEmpty ? null : xs.last;
}

/// מחקה `Number(s)` של JS: ריק/רווח ⇒ 0, מספרי ⇒ ערך, אחרת ⇒ NaN.
num _jsNumber(String s) {
  final t = s.trim();
  if (t.isEmpty) return 0;
  return num.tryParse(t) ?? double.nan;
}

/// מחקה `str.slice(0,10)` של JS (בטוח לאורך-קצר).
String _slice10(String s) => s.length >= 10 ? s.substring(0, 10) : s;

// ── שקעי-ייחוס נאמנים למקור (maor: nedarimSync.ts + dedup.ts + validate.ts) ──
String normPhone(dynamic s) {
  var d = (s?.toString() ?? '').replaceAll(RegExp(r'\D'), '');
  if (d.isNotEmpty && RegExp(r'^(\d)\1+$').hasMatch(d)) return '';
  d = d.replaceFirst(RegExp(r'^00'), '');
  if (d.startsWith('972')) d = '0' + d.substring(3);
  return d.replaceFirst(RegExp(r'^0{2,}'), '0');
}

String normId(dynamic s) {
  final d = (s?.toString() ?? '').replaceAll(RegExp(r'\D'), '');
  if (d.isEmpty || RegExp(r'^0+$').hasMatch(d)) return '';
  if (d.replaceFirst(RegExp(r'^0+'), '').length < 4) return '';
  return d.length >= 5 ? d : '';
}

String normSearch(dynamic t) {
  final s = _truthy(t) ? t.toString() : '';
  // מחלקת-התווים המקורית: /['"׳״\-–._]/g
  return s
      .toLowerCase()
      .replaceAll(RegExp("['\"׳״\\-–._]"), '')
      .trim();
}

String nameSortKey(dynamic t) {
  final parts =
      normSearch(t).split(RegExp(r'\s+')).where((x) => x.isNotEmpty).toList();
  parts.sort();
  return parts.join(' ');
}

List<String> keysOf(Map<String, dynamic> o) {
  final ks = <String>[];
  final ext = (o['extId'] ?? '').toString().trim();
  if (ext.isNotEmpty) ks.add('ext:' + ext);
  final id = normId(_or([o['idNum'], o['zeout']]));
  if (id.isNotEmpty) ks.add('id:' + id);
  for (final p in [o['phone'], o['phone2'], o['phone3']]) {
    final ph = normPhone(_or([p, '']));
    if (ph.length >= 7) ks.add('ph:' + ph);
  }
  final em = (o['email'] ?? '').toString().trim().toLowerCase();
  if (em.isNotEmpty) ks.add('em:' + em);
  final n = normSearch(o['name']);
  final c = normSearch(o['city']);
  if (n.isNotEmpty && c.isNotEmpty) ks.add('nc:' + n + '|' + c);
  return ks;
}

String curOf(Map<String, dynamic> c) {
  final raw = (_truthy(c['currency']) ? c['currency'].toString() : '').trim();
  final isUsd = raw == r'$' ||
      raw == '2' ||
      RegExp(r'usd|\$|דולר', caseSensitive: false).hasMatch(raw);
  return isUsd ? r'$' : '₪';
}

Map<String, dynamic> chargeToHist(Map<String, dynamic> c) {
  final dRaw = _or([c['d'], _slice10(_truthy(c['at']) ? c['at'].toString() : ''), ''])
      .toString()
      .trim();
  final h = <String, dynamic>{
    'd': dRaw,
    'a': c['amount'],
    'c': curOf(c),
    'clearer': 'נדרים',
  };
  final txn = (c['txnId'] ?? '').toString().trim();
  final ref = (c['reference'] ?? '').toString().trim();
  final keva = (c['kevaId'] ?? '').toString().trim();
  if (txn.isNotEmpty) h['txn'] = txn;
  if (ref.isNotEmpty) h['ref'] = ref;
  if (keva.isNotEmpty) h['kevaId'] = keva;
  return h;
}

String chargeDedupKey(Map<String, dynamic> c) {
  final txn = (c['txnId'] ?? '').toString().trim();
  if (txn.isNotEmpty) return 'txn:' + txn;
  final ref = (c['reference'] ?? '').toString().trim();
  return ref.isNotEmpty ? 'ref:' + ref : '';
}

String histDedupKey(Map<String, dynamic> h) {
  final txn = (h['txn'] ?? '').toString().trim();
  if (txn.isNotEmpty) return 'txn:' + txn;
  final ref = (h['ref'] ?? '').toString().trim();
  return ref.isNotEmpty ? 'ref:' + ref : '';
}

Map<String, dynamic> withNedarimHok(Map<String, dynamic> sp, Map<String, dynamic> c) {
  final amt = c['amount'];
  if (!(amt is num && amt > 0)) return sp;
  final keva = (c['kevaId'] ?? '').toString().trim();
  if (keva.isEmpty) return sp;
  final hok = sp['hok'];
  if (hok != null && _falsy((hok as Map)['kevaId'])) return sp; // הו"ק ידני — לא דורסים
  final cd = _slice10(_or([c['d'], c['at'], '']).toString());
  final dayStr = cd.length >= 10 ? cd.substring(8, 10) : (cd.length > 8 ? cd.substring(8) : '');
  final day = _jsNumber(dayStr);
  final okDay = day.isFinite && day >= 1;
  return {
    ...sp,
    'hok': {
      'amount': amt,
      'cur': curOf(c),
      'day': okDay ? min(28, day) : 1,
      'method': 'card',
      'active': true,
      'startedAt': cd,
      'kevaId': keva,
    },
  };
}

String _u(dynamic v) => v == null ? 'undefined' : v.toString();

Map<String, dynamic> supFromDonor(Map<String, dynamic> d) => {
      'id': 'sup-ned-' + _u(d['toremId']),
      'name': _or([d['name'], '']).toString().trim(),
      'phone': _or([d['phone'], d['phone2'], d['phone3'], '']).toString().trim(),
      'email': _or([d['email'], '']).toString().trim(),
      'address': _or([d['address'], '']).toString().trim(),
      'city': '',
      'idNum': _truthy(normId(d['zeout']))
          ? d['zeout'].toString().replaceAll(RegExp(r'\D'), '')
          : '',
      'extId': d['toremId'],
      'cat': '',
      'forWho': '',
      'notes': '',
      'count': 0,
      'ils': 0,
      'usd': 0,
      'first': '',
      'last': '',
      'nextDate': '',
      'donations': [],
    };

Map<String, dynamic> supFromCharge(Map<String, dynamic> c, int seq) {
  final anon = !_truthy(c['toremId']) && nameSortKey(_or([c['name'], ''])).isEmpty;
  final id = _truthy(c['toremId'])
      ? 'sup-ned-' + c['toremId'].toString()
      : anon
          ? 'sup-ned-unassigned'
          : 'sup-ned-txn-' + _or([c['txnId'], seq.toString()]).toString();
  final sp = <String, dynamic>{
    'id': id,
    'name': _or([
      c['name'],
      anon ? 'תרומות נדרים ללא שיוך' : 'תורם נדרים'
    ]).toString().trim(),
    'phone': _or([c['phone'], '']).toString().trim(),
    'email': _or([c['email'], '']).toString().trim(),
    'address': '',
    'city': '',
    'idNum': _truthy(normId(c['zeout']))
        ? c['zeout'].toString().replaceAll(RegExp(r'\D'), '')
        : '',
    'cat': _or([c['category'], '']).toString().trim(),
    'forWho': '',
    'notes': '',
    'count': 0,
    'ils': 0,
    'usd': 0,
    'first': '',
    'last': '',
    'nextDate': '',
    'donations': [],
  };
  if (_truthy(c['toremId'])) sp['extId'] = c['toremId'];
  return sp;
}

Map<String, dynamic> _run(
  List<Map<String, dynamic>> existing,
  List<Map<String, dynamic>> donors,
  List<Map<String, dynamic>> charges,
  Map<String, dynamic> opts,
) =>
    planNedarimSync(existing, donors, charges, opts, nameSortKey, keysOf, normId,
        supFromDonor, supFromCharge, histDedupKey, chargeDedupKey, chargeToHist,
        withNedarimHok, curOf);

void main() {
  // דוגמה 1 — תורם תואם-extId ⇒ העשרה (מילוי-ריק בלבד)
  {
    final r = _run(
      [{'id': 's1', 'name': 'דוד כהן', 'extId': 'T1', 'phone': '', 'email': ''}],
      [{'toremId': 'T1', 'name': 'דוד כהן', 'phone': '0501234567', 'email': 'a@b.c'}],
      [],
      {},
    );
    final s = r['summary'] as Map;
    final sup = r['supporters'] as List;
    _ok(s['updatedSupporters'] == 1, '1: updatedSupporters=1 ⇐ ${s['updatedSupporters']}');
    _ok(s['newSupporters'] == 0, '1: newSupporters=0');
    _ok(sup[0]['phone'] == '0501234567', '1: phone מולא ⇐ ${sup[0]['phone']}');
    _ok((r['updatedNames'] as List).join(',') == 'דוד כהן', '1: updatedNames');
  }
  // דוגמה 2 — תורם בלי-התאמה ⇒ כרטיס חדש דטרמיניסטי
  {
    final r = _run([], [{'toremId': 'T2', 'name': 'שרה לוי'}], [], {});
    final s = r['summary'] as Map;
    final sup = r['supporters'] as List;
    _ok(s['newSupporters'] == 1, '2: newSupporters=1');
    _ok(sup[0]['id'] == 'sup-ned-T2', '2: id=sup-ned-T2 ⇐ ${sup[0]['id']}');
    _ok((r['newNames'] as List).join(',') == 'שרה לוי', '2: newNames');
  }
  // דוגמה 3 — קישור-לפי-שם חסין-סדר (ת"ז-אפסים אינה מפתח)
  {
    final r = _run(
      [{'id': 's1', 'name': 'כהן דוד'}],
      [{'toremId': 'T9', 'name': 'דוד כהן', 'zeout': '000000000'}],
      [],
      {},
    );
    final s = r['summary'] as Map;
    final sup = r['supporters'] as List;
    _ok(s['updatedSupporters'] == 1 && s['newSupporters'] == 0, '3: התאמה-לפי-שם');
    _ok(sup[0]['extId'] == 'T9', '3: extId נקבע ⇐ ${sup[0]['extId']}');
  }
  // דוגמה 4 — דדופ-עסקה לפי txn ⇒ handled בלי כפל
  {
    final r = _run(
      [{'id': 's1', 'name': 'דוד כהן', 'extId': 'T1',
        'hist': [{'d': '2026-01-01', 'a': 100, 'c': '₪', 'txn': '99'}]}],
      [],
      [{'id': 'c1', 'amount': 100, 'toremId': 'T1', 'txnId': '99'}],
      {},
    );
    final s = r['summary'] as Map;
    final sup = r['supporters'] as List;
    _ok(s['chargesDup'] == 1 && s['chargesAdded'] == 0, '4: chargesDup=1, added=0');
    _ok(s['ilsAdded'] == 0, '4: ilsAdded=0');
    _ok((r['handledChargeIds'] as List).join(',') == 'c1', '4: handled=[c1]');
    _ok((sup[0]['hist'] as List).length == 1, '4: hist באורך 1');
  }
  // דוגמה 5 — זיכוי מקושר-בשם ⇒ שורת-hist שלילית, בלי הו"ק, נטו שלילי
  {
    final r = _run(
      [{'id': 's1', 'name': 'דוד כהן'}],
      [],
      [{'id': 'c2', 'amount': -50, 'name': 'כהן דוד', 'd': '2026-02-01'}],
      {},
    );
    final s = r['summary'] as Map;
    final sup = r['supporters'] as List;
    _ok(s['refundsApplied'] == 1, '5: refundsApplied=1');
    _ok(s['ilsAdded'] == -50, '5: ilsAdded=-50 ⇐ ${s['ilsAdded']}');
    _ok(s['chargesNoTxn'] == 1, '5: chargesNoTxn=1 (אין txn/ref)');
    _ok((sup[0]['hist'] as List).length == 1 && (sup[0]['hist'] as List)[0]['a'] == -50,
        '5: שורת-hist a=-50');
    _ok(!_truthy(sup[0]['hok']), '5: אין hok מזיכוי');
  }
  // דוגמה 6 — attachOnly: אין-התאמה ⇒ pending (לא כרטיס, לא handled)
  {
    final r = _run([], [], [{'id': 'c3', 'amount': 80, 'name': 'חדש לגמרי'}],
        {'attachOnly': true});
    final s = r['summary'] as Map;
    _ok(s['chargesSkipped'] == 1, '6: chargesSkipped=1');
    _ok(s['newSupporters'] == 0 && (r['supporters'] as List).isEmpty, '6: אפס כרטיסים');
    _ok((r['handledChargeIds'] as List).isEmpty, '6: לא מסומן handled');
  }
  // דוגמה 7 — עסקת-הו"ק יוצרת כרטיס + ממלאת משבצת-הו"ק
  {
    final r = _run([], [], [
      {'id': 'c4', 'amount': 200, 'toremId': 'T3', 'name': 'משה',
       'txnId': '500', 'kevaId': 'K1', 'd': '2026-03-10'}
    ], {});
    final s = r['summary'] as Map;
    final sup = r['supporters'] as List;
    _ok(s['newSupporters'] == 1, '7: newSupporters=1');
    _ok(sup[0]['id'] == 'sup-ned-T3', '7: id=sup-ned-T3');
    _ok(s['chargesAdded'] == 1 && s['recurring'] == 1, '7: added=1, recurring=1');
    _ok(s['ilsAdded'] == 200, '7: ilsAdded=200');
    _ok(sup[0]['hok'] != null && sup[0]['hok']['kevaId'] == 'K1', '7: hok.kevaId=K1');
    _ok((r['handledChargeIds'] as List).join(',') == 'c4', '7: handled=[c4]');
  }

  if (_f != 0) {
    print('✗ plan-nedarim-sync: כשל');
    throw StateError('golden failed');
  }
  print('✓ plan-nedarim-sync: 7 דוגמאות-חוזה — ירוק (Dart≡JS)');
}
