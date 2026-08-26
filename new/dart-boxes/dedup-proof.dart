// 🧪 הוכחת-חוצה-שפות · dedup (Dart) — מריצה את dedup.dart על אותם קלטים/WANT
// כמו new/boxes/dedup.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה.
import 'dart:convert';
import 'dedup.dart' as D;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  } else {
    n++;
  }
}
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void main() {
  // 1) normPhone
  eq('normPhone 972→0', D.normPhone('+972-50-123-4567'), '0501234567');
  eq('normPhone מציין-מקום', D.normPhone('0000000000'), '');
  eq('normPhone 00972', D.normPhone('00972501234567'), '0501234567');
  // 2) normId
  eq('normId מרופד', D.normId('00000012345'), '00000012345');
  eq('normId נדרים', D.normId('000000020'), '');
  eq('normId קצר', D.normId('123'), '');
  eq('normId אפסים', D.normId('000000000'), '');
  // 3) findDuplicateGroups
  eq('fdg שם+עיר', D.findDuplicateGroups([
    {'id': 'a', 'name': 'כהן', 'city': 'ירושלים'},
    {'id': 'b', 'name': 'כהן', 'city': 'ירושלים'},
    {'id': 'c', 'name': 'לוי', 'city': 'בני ברק'},
  ]), [['a', 'b']]);
  eq('fdg טלפון', D.findDuplicateGroups([
    {'id': 'a', 'phone': '0501112222'},
    {'id': 'b', 'phone': '972501112222'},
  ]), [['a', 'b']]);
  eq('fdg שם-ללא-עיר', D.findDuplicateGroups([{'id': 'a', 'name': 'כהן'}, {'id': 'b', 'name': 'כהן'}]), []);
  eq('fdg ריק', D.findDuplicateGroups([]), []);
  // 5) mergeFamilies
  final mfr = D.mergeFamilies(
    {'id': 'k', 'name': 'כהן', 'phone': '0501112222', 'status': 'pending', 'kidsHome': 2},
    [{'id': 'l', 'name': 'כהן', 'email': 'x@y.z', 'status': 'active', 'kidsHome': 5}],
  );
  eq('mergeFamilies id', mfr['id'], 'k');
  eq('mergeFamilies email', mfr['email'], 'x@y.z');
  eq('mergeFamilies status', mfr['status'], 'active');
  eq('mergeFamilies kidsHome=max', mfr['kidsHome'], 5);
  ok('mergeFamilies סמן-מיזוג', (mfr['notes'] as String).contains('| מוזג: כהן'));
  // 6) dupFieldValue
  final nameDef = {'key': 'name', 'get': (dynamic f) => (f['name'] ?? '') as String};
  eq('dupFieldValue ראשונה', D.dupFieldValue([{'name': ''}, {'name': 'לוי'}], nameDef, {}, {}), 'לוי');
  eq('dupFieldValue edit', D.dupFieldValue([{'name': ''}, {'name': 'לוי'}], nameDef, {}, {'name': 'כהן'}), 'כהן');
  eq('dupFieldValue pick', D.dupFieldValue([{'name': ''}, {'name': 'לוי'}], nameDef, {'name': 0}, {}), '');
  // DUP_FIELDS / SUP_DUP_FIELDS
  eq('DUP_FIELDS 18', D.DUP_FIELDS.length, 18);
  eq('DUP_FIELDS[0].label', D.DUP_FIELDS[0].label, 'שם משפחה');
  eq('SUP_DUP_FIELDS 9', D.SUP_DUP_FIELDS.length, 9);
  // mergeFamiliesByFields
  final mfbfr = D.mergeFamiliesByFields([
    {'id': 'k', 'name': 'כהן', 'city': 'ירושלים', 'status': 'active', 'kidsHome': 1},
    {'id': 'l', 'name': 'כ.', 'city': 'ירושלים', 'status': 'pending', 'kidsHome': 3},
  ], {'name': 1}, {});
  eq('mfbf pick-שדה', mfbfr['name'], 'כ.');
  eq('mfbf בסיס=fams[0]', mfbfr['id'], 'k');
  // 7) findSupporterDupGroups
  eq('fsdg ת"ז', D.findSupporterDupGroups([
    {'id': 'a', 'idNum': '123456789'},
    {'id': 'b', 'idNum': '123456789', 'name': 'שונה'},
  ]), [['a', 'b']]);
  eq('fsdg שם-חסין-סדר', D.findSupporterDupGroups([
    {'id': 'a', 'name': 'בן צבי רחל'},
    {'id': 'b', 'name': 'רחל בן צבי'},
  ]), [['a', 'b']]);
  eq('fsdg שם-בודד', D.findSupporterDupGroups([{'id': 'a', 'name': 'רחל'}, {'id': 'b', 'name': 'רחל'}]), []);
  // 8) mergeSupporterInto
  final msir = D.mergeSupporterInto(
    {'id': 'k', 'donations': [{'date': '2024-01-01', 'amount': 100, 'cur': '₪'}], 'city': ''},
    {'id': 'd', 'donations': [{'date': '2024-02-01', 'amount': 50, 'cur': '₪'}], 'city': 'חיפה'},
  );
  eq('msi תרומות', (msir['donations'] as List).length, 2);
  eq('msi ils', msir['ils'], 150);
  eq('msi city', msir['city'], 'חיפה');
  eq('msi count', msir['count'], 2);
  eq('msi first', msir['first'], '2024-01-01');
  eq('msi last', msir['last'], '2024-02-01');
  // 9) mergeSupportersGroup
  final msgr = D.mergeSupportersGroup(
    {'id': 'k', 'donations': [{'date': '2024-01-01', 'amount': 100, 'cur': '₪'}]},
    [
      {'id': 'b', 'donations': [{'date': '2024-02-01', 'amount': 50, 'cur': '₪'}]},
      {'id': 'c', 'donations': [{'date': '2024-03-01', 'amount': 25, 'cur': '₪'}]},
    ],
  );
  eq('msg ils', msgr['ils'], 175);
  eq('msg donations', (msgr['donations'] as List).length, 3);
  // supDupFieldValue + mergeSupportersByFields
  final sDef = {'key': 'name', 'get': (dynamic s) => (s['name'] ?? '') as String};
  eq('supDupFieldValue', D.supDupFieldValue([{'name': ''}, {'name': 'דוד'}], sDef, {}, {}), 'דוד');
  final msbfr = D.mergeSupportersByFields([
    {'id': 'k', 'name': 'דוד', 'donations': [{'date': '2024-01-01', 'amount': 10, 'cur': '₪'}]},
    {'id': 'd', 'name': 'ד.', 'donations': [{'date': '2024-02-01', 'amount': 20, 'cur': '₪'}]},
  ], {'name': 1}, {});
  eq('msbf pick-שדה', msbfr['name'], 'ד.');
  eq('msbf כסף-נשמר', msbfr['ils'], 30);

  if (fails > 0) {
    print('❌ קופסת-dedup (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('dedup dart proof failed');
  }
  print('✓ קופסת-dedup (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
