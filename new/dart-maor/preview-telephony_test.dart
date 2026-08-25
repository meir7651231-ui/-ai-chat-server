// בדיקת-חוזה (רתמת-זהב) · previewTelephony — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/preview-telephony.test.mjs:
//   1) ולידציה-נכשלת ⇒ יציאה-מוקדמת · build/explain לא נקראים
//   2) ולידציה-עוברת ⇒ rows=3, explainCall×3 עם dow/hhmm/caller/opts כבחוזה
//   3) בחירת-DID: sim גובר על המספר-הראשון
//   4) built.ok ⇒ trust ממופה (3 שדות בלבד) + files + warnings=built
//   5) built.ok=false ⇒ trust=null · warnings נופל ל-v.warnings · files=null · trustReport לא נקרא
//   6) אפס-מספרים ⇒ did=''
// כלל DART-PORTING-RULES #8: השוואת-מבנה עמוקה (מפתח-מפתח / איבר-איבר), לא join.
// הרצה: dart run --enable-asserts new/dart-maor/preview-telephony_test.dart  ⇒ exit 0
import 'preview-telephony.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// השוואת-ערך עמוקה (Map/List/פרימיטיב) — מקבילה ל-JSON.stringify(a)===JSON.stringify(b),
/// אך עמידה-לסדר-מפתחות ומבחינה [''] מ-[] (כלל #8).
bool _eq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k)) return false;
      if (!_eq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_eq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

/// יומן רושם-קריאות — מקביל ל-log של mkSockets ב-JS.
class _Log {
  int build = 0;
  int trust = 0;
  Map<String, dynamic>? buildOpts;
  final List<Map<String, dynamic>> explain = [];
}

/// שקעים עם ברירת-מחדל זהה ל-mkSockets ב-JS; over מאפשר דריסה פר-בדיקה.
class _Sockets {
  final _Log log = _Log();
  late final dynamic Function(Map<String, dynamic>, String, String) telephonyToTenant;
  late final String Function() anchorToday;
  late final Map<String, dynamic> Function(dynamic) validateTenant;
  late final Map<String, dynamic> Function(dynamic, Map<String, dynamic>) buildTenant;
  late final Map<String, dynamic> Function(dynamic, Map<String, dynamic>, Map<String, dynamic>)
      explainCall;
  late final Map<String, dynamic> Function(dynamic) trustReport;

  _Sockets({
    Map<String, dynamic> Function(dynamic)? validateTenant,
    Map<String, dynamic> Function(dynamic, Map<String, dynamic>)? buildTenant,
  }) {
    telephonyToTenant =
        (tc, orgName, tenantId) => {'raw': true, 'orgName': orgName, 'tenantId': tenantId};
    anchorToday = () => '2026-08-24';
    this.validateTenant = validateTenant ??
        (raw) => {'ok': true, 'errors': [], 'warnings': ['vw'], 'tenant': {'t': 1}};
    this.buildTenant = buildTenant ??
        (raw, opts) {
          log.build++;
          log.buildOpts = opts;
          return {'ok': true, 'warnings': ['bw'], 'files': {'a.conf': 'x'}};
        };
    explainCall = (tenant, call, opts) {
      log.explain.add({'call': call, 'opts': opts});
      return {'summary': 'ס', 'outcome': 'תקין'};
    };
    trustReport = (built) {
      log.trust++;
      return {
        'grade': 'A',
        'score': 95,
        'ready': true,
        'failing': [
          {'label': 'l', 'detail': 'd', 'severity': 'warn', 'extra': 'זולג'}
        ],
      };
    };
  }
}

Map<String, dynamic> _call(Map<String, dynamic> tc, _Sockets m) => previewTelephony(
      tc,
      'ארגון',
      'ten1',
      m.telephonyToTenant,
      m.anchorToday,
      m.validateTenant,
      m.buildTenant,
      m.explainCall,
      m.trustReport,
    );

final tcBase = {
  'numbers': [
    {'kind': 'sim', 'e164': '+972501111111'}
  ]
};

void main() {
  var n = 0;

  // 1. ולידציה נכשלת — יציאה מוקדמת, buildTenant/explainCall לא נקראו.
  {
    final m = _Sockets(
        validateTenant: (raw) => {'ok': false, 'errors': ['אין DID'], 'warnings': ['w1']});
    final r = _call(tcBase, m);
    _ok(
        _eq(r, {
          'ok': false,
          'errors': ['אין DID'],
          'warnings': ['w1'],
          'rows': [],
          'trust': null,
          'files': null,
        }),
        '1: ולידציה-נכשלת ⇒ יציאה מוקדמת');
    n++;
    _ok(m.log.build == 0 && m.log.explain.isEmpty, '1ב: buildTenant/explainCall לא נקראו');
    n++;
  }

  // 2. ולידציה עוברת — 3 תרחישים עם opts ו-caller קבועים.
  {
    final m = _Sockets();
    final r = _call(tcBase, m);
    _ok(r['ok'] == true && (r['rows'] as List).length == 3, '2: rows=3');
    n++;
    final want = [
      [2, '10:00'],
      [2, '20:00'],
      [6, '11:00'],
    ];
    var okAll = true;
    for (var i = 0; i < m.log.explain.length; i++) {
      final e = m.log.explain[i];
      final c = e['call'] as Map;
      if (!(c['dow'] == want[i][0] &&
          c['hhmm'] == want[i][1] &&
          c['callerId'] == '050-1234567' &&
          _eq(e['opts'], {'anchorDate': '2026-08-24', 'calendarWindow': 400}))) {
        okAll = false;
      }
    }
    _ok(okAll && m.log.explain.length == 3, '2ב: תרחישים+opts+caller כבחוזה');
    n++;
  }

  // 3. בחירת-DID — sim גובר על הראשון.
  {
    final m = _Sockets();
    final tc = {
      'numbers': [
        {'kind': 'landline', 'e164': '+97221111111'},
        {'kind': 'sim', 'e164': '+972501111111'},
      ]
    };
    _call(tc, m);
    _ok(m.log.explain.every((e) => (e['call'] as Map)['did'] == '+972501111111'),
        '3: sim גובר על המספר הראשון');
    n++;
  }

  // 4. built.ok ⇒ trust ממופה (3 שדות בלבד) + files + warnings=built.
  {
    final m = _Sockets();
    final r = _call(tcBase, m);
    _ok(
        _eq(r['trust'], {
          'grade': 'A',
          'score': 95,
          'ready': true,
          'failing': [
            {'label': 'l', 'detail': 'd', 'severity': 'warn'}
          ],
        }),
        '4: trust ממופה בלי שדות-זולגים');
    n++;
    _ok(_eq(r['files'], {'a.conf': 'x'}) && _eq(r['warnings'], ['bw']),
        '4ב: files+warnings מ-buildTenant');
    n++;
  }

  // 5. built.ok=false ⇒ trust=null, נפילת-warnings ל-v.warnings, files=null.
  {
    final m = _Sockets(buildTenant: (raw, opts) => {'ok': false});
    final r = _call(tcBase, m);
    _ok(
        r['ok'] == true &&
            r['trust'] == null &&
            r['files'] == null &&
            _eq(r['warnings'], ['vw']),
        '5: build-נכשל ⇒ trust=null · warnings נופל ל-v.warnings');
    n++;
    _ok(m.log.trust == 0, '5ב: trustReport לא נקרא');
    n++;
  }

  // 6. בונוס-חוזה: בלי מספרים ⇒ did=''.
  {
    final m = _Sockets();
    _call({'numbers': []}, m);
    _ok(m.log.explain.every((e) => (e['call'] as Map)['did'] == ''),
        '6: אפס מספרים ⇒ did ריק');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(() {
    final m = _Sockets();
    final r = _call(tcBase, m);
    return r['ok'] == true;
  }(), 'assert-live guard');

  print('OK previewTelephony: $n asserts passed');
}
