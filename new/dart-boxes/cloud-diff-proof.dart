// 🧪 הוכחת-חוצה-שפות · cloud-diff (Dart) — מריצה את cloud-diff.dart על אותם
// קלטים/WANT כמו new/boxes/cloud-diff.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart)
// על אותה קופסה: 11 חוטים · נתיבים+diffDb+fullDbDiff+metaOf+strip+emptyDiff · פלט זהה-ביט.
//
// דילוגים מתועדים (חוקי-המשימה):
//  • "מגן-ההכרעה" בסוף cloud-diff.test.mjs (readFileSync + regex על טקסט-ה-.mjs:
//    META_KEYS סדר · מחרוזת-sameJson) — מגן-מקור-JS על טקסט-JS, לא ניתן-להעברה
//    ל-Dart ולא נוגע בהתנהגות ⇒ מדולג. (ההכרעות עצמן מחווטות ומוכחות דרך diffDb.)
//  • אין מקרה תלוי-ריצת-JS.
import 'dart:convert';
import 'cloud-diff.dart' as C;

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

// עוזר: DB עם כל 23 האוספים ריקים + שדות-meta נתונים (מקביל ל-mkDb ב-JS).
Map<String, dynamic> mkDb([Map<String, dynamic> over = const {}]) {
  final db = <String, dynamic>{};
  for (final c in C.entityCollections) {
    db[c] = <dynamic>[];
  }
  db.addAll(over);
  return db;
}

void main() {
  // 1) נתיבים · cloudRoot=true (לקוח-חי, ביט-זהה)
  ok('1 colPath שורש', C.colPath('acme', true, 'families') == 'families');
  ok('1 metaPath שורש', C.metaPath('x', true) == 'meta/org');
  ok('1 envPath שורש', C.envPath('x', true) == '_enc/envelope');
  ok('1 donationsPath שורש', C.donationsPath('x', true) == 'donations');

  // 2) נתיבים · cloudRoot=false (פר-ארגון)
  ok('2 colPath פר-ארגון', C.colPath('acme', false, 'families') == 'orgs/acme/families');
  ok('2 metaPath פר-ארגון', C.metaPath('acme', false) == 'orgs/acme/meta/org');
  ok('2 envPath פר-ארגון', C.envPath('acme', false) == 'orgs/acme/_enc/envelope');
  ok('2 donationsPath פר-ארגון', C.donationsPath('acme', false) == 'orgs/acme/donations');

  // 3) diffDb — sets/deletes/meta
  final prev = mkDb({
    'families': [
      {'id': 'f1', 'name': 'כהן'},
      {'id': 'f2', 'name': 'לוי'}
    ],
    'seq': 5,
    'savedAt': 't1'
  });
  final next = mkDb({
    'families': [
      {'id': 'f1', 'name': 'כהן-לוי'},
      {'id': 'f3', 'name': 'ברק'}
    ],
    'seq': 6,
    'savedAt': 't2'
  });
  final d = C.diffDb(prev, next);
  eq('3 sets', d['sets'], [
    {'col': 'families', 'id': 'f1', 'data': {'id': 'f1', 'name': 'כהן-לוי'}},
    {'col': 'families', 'id': 'f3', 'data': {'id': 'f3', 'name': 'ברק'}},
  ]);
  eq('3 deletes', d['deletes'], [{'col': 'families', 'id': 'f2'}]);
  ok('3 meta ≠ metaOf(next)',
      d['meta'] != null && d['meta']['seq'] == 6 && jsonEncode(d['meta']) == jsonEncode(C.metaOf(next)));

  // 4) דילוג-רפרנס + אפס-רעש (savedAt מחוץ ל-META_KEYS)
  final same = C.diffDb(prev, prev);
  ok('4 אותו-DB לא ריק',
      (same['sets'] as List).isEmpty && (same['deletes'] as List).isEmpty && same['meta'] == null);
  final onlySaved =
      C.diffDb(prev, mkDb({'families': prev['families'], 'seq': 5, 'savedAt': 't9'}));
  ok('4 savedAt-בלבד הפיק meta (רעש)', onlySaved['meta'] == null);

  // 5) fullDbDiff — meta נבנה תמיד, deletes ריק
  final full = C.fullDbDiff(mkDb({
    'families': [{'id': 'f1'}],
    'seq': 3,
    'savedAt': 't'
  }));
  eq('5 sets', full['sets'], [{'col': 'families', 'id': 'f1', 'data': {'id': 'f1'}}]);
  ok('5 deletes/meta', (full['deletes'] as List).isEmpty && full['meta'] != null);

  // 6) emptyDiff
  ok('6 ריק ⇒ true', C.emptyDiff({'sets': <dynamic>[], 'deletes': <dynamic>[], 'meta': null}) == true);
  ok('6 לא-ריק ⇒ false',
      C.emptyDiff({'sets': [<String, dynamic>{}], 'deletes': <dynamic>[], 'meta': null}) == false);

  // 7) stripSupporterDonations — רק supporters מנוקה, אפס מוטציה
  final inDiff = <String, dynamic>{
    'sets': [
      {'col': 'supporters', 'id': 's1', 'data': {'id': 's1', 'donations': [{'rid': 1}]}},
      {'col': 'families', 'id': 'f1', 'data': {'id': 'f1', 'donations': [9]}},
    ],
    'deletes': <dynamic>[],
    'meta': null
  };
  final stripped = C.stripSupporterDonations(inDiff);
  eq('7 תרומות-תומך רוקנו', (stripped['sets'] as List)[0]['data']['donations'], <dynamic>[]);
  eq('7 משפחה לא-שונתה', (stripped['sets'] as List)[1]['data']['donations'], [9]);
  ok('7 אפס-מוטציה על המקור',
      (inDiff['sets'] as List)[0]['data']['donations'].length == 1);

  // 8) metaOf — 16 מפתחות, foo מסונן, savedAt כלול
  final m = C.metaOf(mkDb({'orgName': 'מאור', 'seq': 3, 'savedAt': 't', 'foo': 'התעלם'}));
  ok('8 metaOf מסנן foo / כולל savedAt+orgName',
      !m.containsKey('foo') && m['orgName'] == 'מאור' && m.containsKey('savedAt'));

  // 9) DONATIONS_COL אינו ב-ENTITY_COLLECTIONS (מסלול-B נפרד)
  ok('9 donations לא דלף ל-ENTITY_COLLECTIONS', !C.entityCollections.contains(C.donationsCol));

  if (fails > 0) {
    print('❌ קופסת-cloud-diff (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('cloud-diff dart proof failed');
  }
  print('✓ קופסת-cloud-diff (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
