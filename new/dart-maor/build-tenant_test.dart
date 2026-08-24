// בדיקת-חוזה (רתמת-זהב) · build-tenant — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/build-tenant.test.mjs
// (אותם קלטים→פלטים; הערכים הומרו ל-Dart). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/build-tenant_test.dart  ⇒ exit 0
// אפס import של dart:convert — ה-JSON נבנה ידנית מסדר-ההכנסה (מדמה JSON.stringify).
import 'build-tenant.dart';

// — סריאליזציה זהה ל-JSON.stringify עבור הדאטה הזה: String/bool/num/List/Map,
//   סדר-הכנסה נשמר, תווי-עברית כלשונם. —
String _stringify(dynamic v) {
  if (v == null) return 'null';
  if (v is String) {
    final esc = v.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    return '"$esc"';
  }
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) return v.toString();
  if (v is List) return '[${v.map(_stringify).join(',')}]';
  if (v is Map) {
    final parts = <String>[];
    v.forEach((k, val) => parts.add('${_stringify(k as String)}:${_stringify(val)}'));
    return '{${parts.join(',')}}';
  }
  throw StateError('unsupported type: ${v.runtimeType}');
}

void main() {
  // 1. אימות-נכשל ⇒ ok:false, אין files, generateConfig לא נקרא
  {
    var genCalls = 0;
    final r = buildTenant({}, {},
        (cfg) => <String, dynamic>{'ok': false, 'errors': ['E1'], 'warnings': ['W1']},
        (t, w, o) { genCalls++; return <String, dynamic>{}; },
        (b, r, m) => <String, dynamic>{});
    assert(r['ok'] == false && _stringify(r['errors']) == '["E1"]' && _stringify(r['warnings']) == '["W1"]',
        '1: פלט-כשל לא תואם: ${_stringify(r)}');
    assert(!r.containsKey('files') && !r.containsKey('manifest'), '1: כשל החזיר files/manifest');
    assert(genCalls == 0, '1: generateConfig נקרא בכשל ($genCalls)');
  }

  // 2. הצלחה מלאה עם genWarns
  {
    final r = buildTenant({}, {},
        (cfg) => <String, dynamic>{'ok': true, 'errors': [], 'warnings': ['W'], 'tenant': {'id': 't1'}},
        (t, w, o) => <String, dynamic>{'files': {'a.conf': 'x'}, 'manifest': {'n': 1}, 'warnings': ['G']},
        (b, r, m) => <String, dynamic>{});
    assert(r['ok'] == true && _stringify(r['errors']) == '[]' && _stringify(r['warnings']) == '["G"]',
        '2: ok/errors/warnings לא תואם: ${_stringify(r)}');
    assert(_stringify(r['files']) == '{"a.conf":"x"}' && _stringify(r['manifest']) == '{"n":1}' && (r['tenant'] as Map)['id'] == 't1',
        '2: files/manifest/tenant לא תואם: ${_stringify(r)}');
  }

  // 3. genWarns ריק (חסר) ⇒ נפילה לאזהרות-האימות
  {
    final r = buildTenant({}, {},
        (cfg) => <String, dynamic>{'ok': true, 'errors': [], 'warnings': ['W'], 'tenant': {}},
        (t, w, o) => <String, dynamic>{'files': {}, 'manifest': {}},
        (b, r, m) => <String, dynamic>{});
    assert(_stringify(r['warnings']) == '["W"]', '3: warnings ≠ ["W"]: ${_stringify(r['warnings'])}');
  }

  // 4. בלי layers ⇒ effectiveConfig לא נקרא, validateTenant מקבל את raw עצמו
  {
    var effCalls = 0;
    Map<String, dynamic>? seen;
    final raw = <String, dynamic>{'name': 'x'};
    buildTenant(raw, {},
        (c) { seen = c; return <String, dynamic>{'ok': false, 'errors': [], 'warnings': []}; },
        (t, w, o) => <String, dynamic>{},
        (b, r, m) { effCalls++; return <String, dynamic>{}; });
    assert(effCalls == 0, '4: effectiveConfig נקרא בלי layers ($effCalls)');
    assert(identical(seen, raw), '4: validateTenant לא קיבל את raw עצמו');
  }

  // 5. layers.base ⇒ מיזוג {...raw, features, terms}
  {
    List<dynamic>? effArgs;
    Map<String, dynamic>? seen;
    final raw = <String, dynamic>{'name': 'x'};
    buildTenant(raw, {'layers': {'base': {'b': 1}}},
        (c) { seen = c; return <String, dynamic>{'ok': false, 'errors': [], 'warnings': []}; },
        (t, w, o) => <String, dynamic>{},
        (base, r, member) { effArgs = [base, r, member]; return <String, dynamic>{'features': {'f': true}, 'terms': {'t': 'א'}}; });
    assert(effArgs != null && _stringify(effArgs![0]) == '{"b":1}' && identical(effArgs![1], raw) && effArgs![2] == null,
        '5: ארגומנטי effectiveConfig לא תואמים: ${_stringify(effArgs)}');
    assert(_stringify(seen) == '{"name":"x","features":{"f":true},"terms":{"t":"א"}}',
        '5: cfg ממוזג לא תואם: ${_stringify(seen)}');
  }

  // 6. member בלבד ⇒ effectiveConfig({}, raw, member)
  {
    List<dynamic>? effArgs;
    final raw = <String, dynamic>{'name': 'y'};
    final member = <String, dynamic>{'m': 1};
    buildTenant(raw, {'layers': {'member': member}},
        (c) => <String, dynamic>{'ok': false, 'errors': [], 'warnings': []},
        (t, w, o) => <String, dynamic>{},
        (base, r, mem) { effArgs = [base, r, mem]; return <String, dynamic>{'features': {}, 'terms': {}}; });
    assert(effArgs != null && _stringify(effArgs![0]) == '{}' && identical(effArgs![1], raw) && identical(effArgs![2], member),
        '6: member-בלבד לא מיזג נכון: ${_stringify(effArgs)}');
  }

  print('✓ build-tenant: 6 דוגמאות-חוזה — ירוק (3 שקעים מוזרקים, אפס import פנימי)');
}
