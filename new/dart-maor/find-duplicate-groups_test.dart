// רתמת-זהב · Dart≡JS — בדיוק דוגמאות-החוזה מ-new/atoms/find-duplicate-groups.test.mjs.
import 'find-duplicate-groups.dart';

// שוואת-עומק: אורך + איבר-איבר (חוק-8 DART-PORTING — לא join).
bool deepEq(List<List<String>> a, List<List<String>> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i].length != b[i].length) return false;
    for (var j = 0; j < a[i].length; j++) {
      if (a[i][j] != b[i][j]) return false;
    }
  }
  return true;
}

void eq(List<List<String>> got, List<List<String>> want, String msg) {
  if (!deepEq(got, want)) {
    throw StateError('✗ $msg ⇒ $got');
  }
}

// שקעים מזויפים לפי החוזה
List<String> phonesOf(dynamic fam) =>
    (fam['phones'] as List?)?.cast<String>() ?? <String>[];
String nameCityKey(dynamic fam) => (fam['nk'] as String?) ?? '';

List<List<String>> run(List<dynamic> fams) =>
    findDuplicateGroups(fams, phonesOf, nameCityKey);

void main() {
  // 1) טלפון משותף
  eq(
    run([
      {'id': 'a', 'phones': ['0501111111']},
      {'id': 'b', 'phones': ['0501111111']},
    ]),
    [['a', 'b']],
    'קיבוץ-טלפון שגוי',
  );

  // 2) שם+עיר משותפים
  eq(
    run([
      {'id': 'a', 'nk': 'כהן|צפת'},
      {'id': 'b', 'nk': 'כהן|צפת'},
    ]),
    [['a', 'b']],
    'קיבוץ-שם+עיר שגוי',
  );

  // 3) טרנזיטיביות: a~b בטלפון, b~c בשם+עיר ⇒ קבוצה אחת
  eq(
    run([
      {'id': 'a', 'phones': ['0501111111']},
      {'id': 'b', 'phones': ['0501111111'], 'nk': 'לוי|חיפה'},
      {'id': 'c', 'nk': 'לוי|חיפה'},
    ]),
    [['a', 'b', 'c']],
    'טרנזיטיביות נשברה',
  );

  // 4) בודדות לא מוחזרות
  eq(
    run([
      {'id': 'a', 'phones': ['0501111111']},
      {'id': 'b', 'phones': ['0501111111']},
      {'id': 'c', 'phones': ['0529999999']},
    ]),
    [['a', 'b']],
    'בודדת חדרה לקבוצות',
  );

  // 5) nk ריק לא מקבץ
  eq(
    run([
      {'id': 'a', 'nk': ''},
      {'id': 'b', 'nk': ''},
    ]),
    [],
    'nk ריק קיבץ בטעות',
  );

  // 6) שני זוגות נפרדים ⇒ שתי קבוצות
  eq(
    run([
      {'id': 'a', 'phones': ['0501111111']},
      {'id': 'b', 'phones': ['0501111111']},
      {'id': 'c', 'nk': 'מזרחי|לוד'},
      {'id': 'd', 'nk': 'מזרחי|לוד'},
    ]),
    [['a', 'b'], ['c', 'd']],
    'זוגות נפרדים התערבבו',
  );

  // 7) ריק ⇒ ריק
  eq(run([]), [], 'ריק לא החזיר []');

  print('✓ find-duplicate-groups: 7 דוגמאות-חוזה — ירוק');
}
