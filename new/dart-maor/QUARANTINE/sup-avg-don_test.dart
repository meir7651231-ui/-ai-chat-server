// בדיקת-חוזה (רתמת-זהב) · supAvgDon — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת אחד-לאחד את 6 דוגמאות-החוזה (sup-avg-don.contract.md) ואת בדיקת-ה-JS
// (new/atoms/sup-avg-don.test.mjs), עם שקעי-הבדיקה כמוגדר בחוזה:
//   supTotalIls = (sp, r) => (sp.ils || 0) + (sp.usd || 0) * r
//   supCount    = (sp)    => sp.count || 0
// המרה: מפתח-חסר ב-JS ⇒ undefined ⇒ ‏||0 ⇒ 0 — בשקע-הבדיקה מפתח-חסר במפה מטופל
//        ב-containsKey-אמת (חוק-2: לא ‎== null‎ עיוור, אם-כי כאן ||0 בולע את שניהם).
//        ‏rate=undefined (דוגמה 6) ⇒ אי-העברת הפרמטר האופציונלי (ערוץ-ברירת-המחדל).
// כישלון ⇒ StateError. הרצה:
//   dart run --enable-asserts new/dart-maor/sup-avg-don_test.dart  ⇒ OK
import 'sup-avg-don.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// שקעי-הבדיקה של החוזה — נאמנים ל-‎(sp.ils || 0) + (sp.usd || 0) * r‎ של ה-JS:
// ‏|| של JS על מספר ⇒ falsy=0/NaN ⇒ 0; מפתח-חסר ⇒ undefined (falsy) ⇒ 0.
num _orZero(Map sp, String k) {
  if (!sp.containsKey(k)) return 0; // undefined ⇒ falsy (חוק-2)
  final v = sp[k];
  if (v == null) return 0; // null ⇒ falsy
  final n = v as num;
  return (n == 0 || (n is double && n.isNaN)) ? 0 : n; // 0/-0/NaN ⇒ falsy
}

dynamic totIls(dynamic sp, dynamic r) =>
    _orZero(sp as Map, 'ils') + _orZero(sp, 'usd') * (r as num);
dynamic cnt(dynamic sp) => _orZero(sp as Map, 'count');

void main() {
  var n = 0;

  // 1) ממוצע בסיסי: 600/3 = 200
  _ok(
      supAvgDon([
            {'ils': 400, 'count': 2},
            {'ils': 200, 'count': 1},
          ], totIls, cnt, 3.7) ==
          200,
      'דוגמה 1: ≠ 200');
  n++;

  // 2) עיגול-מטה: round(333.33…) = 333
  _ok(
      supAvgDon([
            {'ils': 1000, 'count': 3},
          ], totIls, cnt, 3.7) ==
          333,
      'דוגמה 2: ≠ 333');
  n++;

  // 3) עיגול-מעלה: round(166.66…) = 167
  _ok(
      supAvgDon([
            {'ils': 500, 'count': 3},
          ], totIls, cnt, 3.7) ==
          167,
      'דוגמה 3: ≠ 167');
  n++;

  // 4) אפס תרומות ⇒ null (לא 0 ולא NaN — אין חלוקה-באפס)
  _ok(
      supAvgDon([
            {'ils': 0, 'count': 0},
            {'ils': 0, 'count': 0},
          ], totIls, cnt, 3.7) ==
          null,
      'דוגמה 4: ≠ null');
  n++;

  // 5) השער זורם לשקע: 100 + 100×4 = 500
  _ok(
      supAvgDon([
            {'ils': 100, 'usd': 100, 'count': 1},
          ], totIls, cnt, 4) ==
          500,
      'דוגמה 5: ≠ 500');
  n++;

  // 6) rate לא הועבר (undefined ב-JS ⇒ השמטת האופציונלי ב-Dart) ⇒ 3.7 ⇒ round(37)=37
  _ok(
      supAvgDon([
            {'ils': 0, 'usd': 10, 'count': 1},
          ], totIls, cnt) ==
          37,
      'דוגמה 6: ≠ 37');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      supAvgDon([
            {'ils': 400, 'count': 2},
          ], totIls, cnt) ==
          200,
      'assert-live guard');

  print('OK supAvgDon: $n contract examples passed');
}
