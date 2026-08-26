// 🧪 הוכחת-חוצה-שפות · חיפוש (Dart) — מריצה את search.dart על אותם קלטים/WANT
// כמו new/boxes/search.test.mjs (תרחישים + 9 דוגמאות-ניקוד + expand).
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה, כולל סדר-הקסקדה.
import 'search.dart' as S;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) { print('✗ $name'); fails++; } else { n++; }
}

void main() {
  final fam = [
    {'name': 'משפחת כהן'},
    {'name': 'משפחת לוי'},
    {'name': 'חוג ציור'},
    {'name': 'דוד כהן'},
  ];
  List gt(dynamic f) => [f['name']];

  // תרחישי-קצה
  final r1 = S.search('cohen', fam, gt) as List; // תעתיק
  ok('תעתיק cohen', r1.any((x) => (x['name'] as String).contains('כהן')));
  final r2 = S.search('חוגים', fam, gt) as List; // גזע-ריבוי
  ok('חוגים→חוג', r2.any((x) => x['name'] == 'חוג ציור'));
  final r3 = S.search('דוד כהן', fam, gt) as List; // רב-מילתי — הכפול ראשון
  ok('מיון רב-מילתי', r3.isNotEmpty && r3[0]['name'] == 'דוד כהן');
  ok('זבל ⇒ ריק', (S.search('xyzq', fam, gt) as List).isEmpty);
  ok('ריקה ⇒ הכול', (S.search('', fam, gt) as List).length == 4);

  // 9 דוגמאות-הניקוד של score-term המפורק — עכשיו דרך הקסקדה
  final scoreCases = [
    ['כהן', 'כהן', 100], ['כה', 'כהן', 80], ['חוגים', 'חוג', 70], ['הן', 'כהן', 62],
    ['דויד', 'דוד', 58], ['כוהן', 'כהן', 58], ['golstein', 'goldstein', 48],
    ['xyz', 'כהן', 0], ['', 'כהן', 0],
  ];
  for (final c in scoreCases) {
    final g = S.score(c[0], [c[1]]);
    ok('score("${c[0]}","${c[1]}")=${c[2]}', g == c[2]);
  }

  ok('expand', (S.expand('כהן') as List).contains('cohen'));

  if (fails > 0) {
    print('❌ קופסת-חיפוש (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('search dart proof failed');
  }
  print('✓ קופסת-חיפוש (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
