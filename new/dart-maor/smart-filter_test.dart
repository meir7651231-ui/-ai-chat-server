// בדיקת-חוזה (רתמת-זהב) · smartFilter — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת ביט-אחר-ביט את new/atoms/smart-filter.test.mjs + חמש דוגמאות-החוזה
// (smart-filter.contract.md): ריקה⇒הכול · limit=1⇒פריט-אחד · ציון-אפס-מסונן ·
// מיון-יורד · יציבות-בשוויון. השוואת-מערכים = אורך + איבר-איבר (כלל-8).
// הרצה: dart run --enable-asserts new/dart-maor/smart-filter_test.dart  ⇒ OK
import 'smart-filter.dart';

void _fail(String label, String msg) => throw StateError('FAIL [$label]: $msg');

/// כלל-8: לעולם לא join-והשוואה — אורך ואז איבר-איבר.
void _eqList(List got, List want, String label) {
  if (got.length != want.length) {
    _fail(label, 'length ${got.length} != ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      _fail(label, 'index $i: "${got[i]}" != "${want[i]}"');
    }
  }
}

void main() {
  var n = 0;

  // — שקעי-הבדיקה, תרגום ישיר של ה-JS —
  // const hasQ=(q)=>!!String(q||'').trim();
  bool hasQ(dynamic q) {
    final s = (q == null || q == '' || q == 0 || q == false) ? '' : q.toString();
    return s.trim().isNotEmpty;
  }

  // const scoreOf=(q,terms)=>terms.includes(q)?100:terms.some(t=>t.startsWith(q))?80:0;
  num scoreOf(dynamic q, dynamic terms) {
    final List ts = terms as List;
    if (ts.contains(q)) return 100;
    if (ts.any((t) => (t as String).startsWith(q as String))) return 80;
    return 0;
  }

  // const items=[{n:'א',t:['כהן']},{n:'ב',t:['כה-משהו']},{n:'ג',t:['לוי']},{n:'ד',t:['כהן']}];
  final items = [
    {'n': 'א', 't': ['כהן']},
    {'n': 'ב', 't': ['כה-משהו']},
    {'n': 'ג', 't': ['לוי']},
    {'n': 'ד', 't': ['כהן']},
  ];
  dynamic gt(dynamic x) => x['t'];

  List names(dynamic r) => [for (final x in (r as List)) x['n'] as String];

  // 1) שאילתה ריקה ⇒ הרשימה כמות-שהיא (כל 4, בסדר-המקור) — וגם עותק, לא אותו מופע.
  final all = smartFilter('', items, gt, hasQ, scoreOf);
  _eqList(names(all), ['א', 'ב', 'ג', 'ד'], 'ריקה⇒הכול');
  if (identical(all, items)) _fail('ריקה⇒עותק', 'slice חייב להחזיר מערך חדש');
  n++;

  // 2) limit=1 על שאילתה ריקה ⇒ פריט-אחד (הראשון).
  final one = smartFilter('', items, gt, hasQ, scoreOf, 1);
  _eqList(names(one), ['א'], 'limit=1');
  n++;

  // 3+4) 'כהן': ציון-אפס ('ג' לוי) מסונן; 'ב' (כה-משהו, לא-מתחיל-ב"כהן") מסונן;
  //      יציבות-בשוויון: א(100) לפני ד(100) — סדר-מקור נשמר.
  final r = smartFilter('כהן', items, gt, hasQ, scoreOf);
  final rn = names(r);
  if (rn.contains('ג')) _fail('ציון-אפס', 'ג לא סונן: $rn');
  _eqList(rn, ['א', 'ד'], 'יציבות/מיון');
  n++;
  n++;

  // 5) מיון-יורד: 100 לפני 80 גם כשה-80 קודם בסדר-המקור (שאילתה 'כה').
  final mixed = [
    {'n': 'x', 't': ['כהן']}, // startsWith('כה') ⇒ 80
    {'n': 'y', 't': ['כה']},  // includes ⇒ 100
  ];
  final desc = smartFilter('כה', mixed, gt, hasQ, scoreOf);
  _eqList(names(desc), ['y', 'x'], 'מיון-יורד');
  n++;

  // 6) limit חותך גם אחרי מיון (על מסלול-השאילתה).
  final cut = smartFilter('כהן', items, gt, hasQ, scoreOf, 1);
  _eqList(names(cut), ['א'], 'limit-אחרי-מיון');
  n++;

  // 7) שמירת-כלל-1: יציבות גם ב-≥32 איברים שווי-ציון (List.sort של Dart לא-יציב שם;
  //    ה-JS יציב — decorate-sort-undecorate חייב לשמר סדר-מקור).
  final big = [
    for (var i = 0; i < 40; i++) {'n': 'p$i', 't': ['כהן']}
  ];
  final bigOut = smartFilter('כהן', big, gt, hasQ, scoreOf);
  _eqList(names(bigOut), [for (var i = 0; i < 40; i++) 'p$i'], 'יציבות-40');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert((smartFilter('', items, gt, hasQ, scoreOf) as List).length == 4,
      'assert-live guard');

  print('OK smartFilter: $n בדיקות-חוזה — ירוק');
}
