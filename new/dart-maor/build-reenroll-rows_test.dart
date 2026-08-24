// בדיקת-חוזה (רתמת-זהב) · buildReenrollRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/build-reenroll-rows.test.mjs.
// שקעים נאמנים למקור (reenroll-lib.ts): isRenewed=!!renewedToId · renewOf=renew??'' ·
// enrollSummary={presents:len} · findMember=חיפוש-בן-משפחה.
// הרצה: dart run --enable-asserts new/dart-maor/build-reenroll-rows_test.dart ⇒ exit 0
import 'build-reenroll-rows.dart';

// --- שקעי-הבדיקה ---
bool isRenewed(Map<String, Object?> e) {
  final v = e['renewedToId'];
  return v != null && v != '' && v != false;
}

String renewOf(Map<String, Object?> e) => (e['renew'] ?? '') as String;

Object? enrollSummary(Map<String, Object?> e) =>
    {'presents': ((e['presents'] as List?) ?? const []).length};

Map<String, Object?> findMember(Map<String, Object?> db, Object? id) {
  for (final f in (db['families'] as List)) {
    final fam = f as Map<String, Object?>;
    for (final x in (fam['members'] as List)) {
      final m = x as Map<String, Object?>;
      if (m['id'] == id) {
        return {'member': m, 'family': (fam['name'] ?? '') as String};
      }
    }
  }
  return {'member': null, 'family': ''};
}

bool _deepEq(Object? a, Object? b) {
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  return a == b;
}

int _f = 0;
void eq(String name, Object? got, Object? want) {
  if (!_deepEq(got, want)) {
    print('✗ דוגמה $name:\n  $got\n≠ $want');
    _f = 1;
  }
}

List<Map<String, Object?>> _rows(
        Map<String, Object?> db, Map<String, Object?>? filter) =>
    buildReenrollRows(db, filter,
        isRenewed: isRenewed,
        renewOf: renewOf,
        enrollSummary: enrollSummary,
        findMember: findMember);

Object? _id(Map<String, Object?> r) => (r['e'] as Map)['id'];

void main() {
  final db = <String, Object?>{
    'families': [
      {'name': 'כהן', 'members': [{'id': 'm1', 'first': 'אבי'}, {'id': 'm2', 'first': 'גילה'}]},
      {'name': 'לוי', 'members': [{'id': 'm3', 'first': 'בני'}]},
    ],
    'courses': [{'id': 'c1', 'name': 'ציור'}, {'id': 'c2', 'name': 'שחייה'}],
    'enrollments': [
      {'id': 'e1', 'courseId': 'c1', 'memberId': 'm1', 'renew': 'yes'},
      {'id': 'e2', 'courseId': 'c1', 'memberId': 'm2', 'renew': ''},
      {'id': 'e3', 'courseId': 'c2', 'memberId': 'm3', 'renew': 'no', 'renewedToId': 'x9'},
      {'id': 'e4', 'courseId': 'c2', 'memberId': 'm404'},
    ],
  };

  // 1 · בלי פילטר — 4 שורות, מיון עברי (member חסר ⇒ '' ראשון)
  final all = _rows(db, {});
  eq('1', all.map((r) => r['memberName']).toList(), ['', 'אבי', 'בני', 'גילה']);
  // 2 · צמצום לחוג c1
  eq('2', _rows(db, {'courseId': 'c1'}).map(_id).toList(), ['e1', 'e2']);
  // 3 · טרם-הוחלט — e4 (בלי renew) + e2
  eq('3', (_rows(db, {'decision': 'undecided'}).map(_id).toList()..sort((a, b) => (a as String).compareTo(b as String))), ['e2', 'e4']);
  // 4 · בלי מי-שכבר-נרשם — e3 נשמט
  eq('4', _rows(db, {'includeRenewed': false}).length, 3);
  // 5 · חיפוש רב-מילתי + חיפוש בשם-משפחה
  eq('5a', _rows(db, {'q': 'אבי ציור'}).map(_id).toList(), ['e1']);
  eq('5b', (_rows(db, {'q': 'כהן'}).map(_id).toList()..sort((a, b) => (a as String).compareTo(b as String))), ['e1', 'e2']);
  // 6 · צורת-השורה של e1
  final r1 = all.firstWhere((r) => _id(r) == 'e1');
  eq('6', [r1['memberName'], r1['familyName'], r1['courseName'], r1['decision'], r1['renewed'], r1['summary']],
      ['אבי', 'כהן', 'ציור', 'yes', false, {'presents': 0}]);

  if (_f != 0) throw StateError('build-reenroll-rows: דוגמאות-חוזה נכשלו');
  print('✓ build-reenroll-rows: 7 בדיקות מ-6 דוגמאות-חוזה — ירוק');
}
