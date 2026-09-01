// בדיקת חוט · weighted-quote — כל 5 דוגמאות-החוזה + בדיקת-ה-JS (weighted-quote.test.mjs).
import 'weighted-quote.dart';

void chk(String name, bool cond) {
  if (!cond) throw StateError('✗ ' + name);
}

// השוואת-מערך = אורך + איבר-איבר (חוק-8; לעולם לא join).
bool listEq(List a, List b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

// השוואת-תוצאה: בדיוק 3 מפתחות בסדר-JS + ערכים (מקביל ל-JSON.stringify בבדיקת-ה-JS).
bool quoteEq(Map<String, dynamic> r, num lessons, num perLesson, num total) {
  return listEq(r.keys.toList(), ['lessons', 'perLesson', 'total']) &&
      r['lessons'] == lessons &&
      r['perLesson'] == perLesson &&
      r['total'] == total;
}

void main() {
  // 1) העברת-ארגומנטים מדויקת לשני השקעים
  final c = {'id': 'course1', 'lessonPrice': 80};
  final priceCalls = <List>[];
  final termCalls = <List>[];
  weightedQuote(
    c,
    {'freq': 1, 'unit': 'week', 'term': 'monthly', 'months': 3, 'tier': '2'},
    (a, b) {
      priceCalls.add([a, b]);
      return 80;
    },
    (a, b, cc, d) {
      termCalls.add([a, b, cc, d]);
      return 1;
    },
  );
  chk(
      '1 ארגומנטים לשקעים',
      priceCalls.length == 1 &&
          identical(priceCalls[0][0], c) &&
          priceCalls[0][1] == '2' &&
          termCalls.length == 1 &&
          listEq(termCalls[0], [1, 'week', 'monthly', 3]));

  // 2) raw=13/3, perLesson=80 ⇒ lessons=4.5 · total=347
  chk('2 שבועי-לחודש 80₪ ⇒ 4.5 שיעורים · 347₪',
      quoteEq(weightedQuote(c, {'tier': ''}, (a, b) => 80, (a, b, cc, d) => 13 / 3), 4.5, 80, 347));

  // 3) raw=1, perLesson=100 ⇒ 1 · 100
  chk('3 חד-פעמי ⇒ {1,100,100}',
      quoteEq(weightedQuote(c, {'tier': ''}, (a, b) => 100, (a, b, cc, d) => 1), 1, 100, 100));

  // 4) raw=26/3, perLesson=45 ⇒ lessons=8.5 · total=390 (עיגול על ה-raw)
  chk('4 פעמיים-בשבוע 45₪ ⇒ 8.5 · 390',
      quoteEq(weightedQuote(c, {'tier': '1'}, (a, b) => 45, (a, b, cc, d) => 26 / 3), 8.5, 45, 390));

  // 5) raw=0 ⇒ אפס שיעורים, אפס סכום
  chk('5 תדירות-אפס ⇒ {0,200,0}',
      quoteEq(weightedQuote(c, {'tier': ''}, (a, b) => 200, (a, b, cc, d) => 0), 0, 200, 0));

  print('OK — weighted-quote: 5 דוגמאות-חוזה (ארגומנטים+עיגול-חצי/שקל+אפס) — ירוק');
}
