// רתמת-זהב · component-redeemed-now — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// מייבאת אך ורק את האטום-שלה (חוק-4). המר ל-Dart: object-literal→Map · undefined→null ·
// JSON.stringify-של-קריאות ⇒ בדיקת-אורך/שוויון/identical על רשומות-הקריאה.
// הרצה: dart run --enable-asserts new/dart-maor/component-redeemed-now_test.dart ⇒ exit 0
import 'component-redeemed-now.dart';

/// שקעים-מזויפים עם רישום-קריאות — מקביל ל-mk(kind, allowed) של בדיקת-ה-JS.
class _Mock {
  int itemOf = 0;
  final List<List<Object?>> redeemed = [];
  final String kind;
  final List<String> allowed;
  _Mock(this.kind, this.allowed);

  Map itemOfFn(Object? d, Object? c) {
    itemOf++;
    return {'kind': kind, 'allowed': allowed};
  }

  bool holidayAllowedFn(Object? item, Object? name) =>
      ((item as Map)['allowed'] as List? ?? const []).contains(name);

  // (as, cid, [holiday]) — קריאה בת-2 ⇒ holiday=null (=undefined של JS)
  Object? Function(Object?, Object?, [Object?]) redeemedFn(Object? ret) =>
      (Object? as, Object? cid, [Object? holiday]) {
        redeemed.add([cid, holiday]);
        return ret;
      };
}

void main() {
  final db = <String, Object?>{};
  final a = {'id': 'as1'};
  final comp = {'id': 'c1'};
  final pesach = {'iso': '2026-04-02', 'name': 'פסח'};
  final sukkot = {'iso': '2026-09-26', 'name': 'סוכות'};

  // 1 — בלי holidays: נתיב היסטורי, itemOf לא נקרא, מופע-חג=null
  var s = _Mock('holidayGift', ['פסח']);
  var r = componentRedeemedNow(
      db, a, comp, null, s.itemOfFn, s.holidayAllowedFn, s.redeemedFn(true));
  assert(
      r == true &&
          s.itemOf == 0 &&
          s.redeemed.length == 1 &&
          s.redeemed[0][0] == 'c1' &&
          s.redeemed[0][1] == null,
      '✗ דוגמה 1: ${s.itemOf}/${s.redeemed}');

  // 2 — קופון: נתיב היסטורי גם עם holidays
  s = _Mock('coupon', []);
  r = componentRedeemedNow(db, a, comp, [pesach], s.itemOfFn, s.holidayAllowedFn,
      s.redeemedFn(false));
  assert(
      r == false &&
          s.redeemed.length == 1 &&
          s.redeemed[0][0] == 'c1' &&
          s.redeemed[0][1] == null,
      '✗ דוגמה 2: ${s.redeemed}');

  // 3 — מתנת-חג עם חג מותר: נבחן מול מופע-החג
  s = _Mock('holidayGift', ['פסח']);
  r = componentRedeemedNow(db, a, comp, [pesach], s.itemOfFn, s.holidayAllowedFn,
      s.redeemedFn(true));
  assert(
      r == true &&
          s.redeemed.length == 1 &&
          s.redeemed[0][0] == 'c1' &&
          identical(s.redeemed[0][1], pesach),
      '✗ דוגמה 3: ${s.redeemed}');

  // 4 — מתנת-חג בלי חג מותר: נתיב היסטורי
  s = _Mock('holidayGift', <String>[]);
  r = componentRedeemedNow(db, a, comp, [pesach, sukkot], s.itemOfFn,
      s.holidayAllowedFn, s.redeemedFn(false));
  assert(
      r == false &&
          s.redeemed.length == 1 &&
          s.redeemed[0][0] == 'c1' &&
          s.redeemed[0][1] == null,
      '✗ דוגמה 4: ${s.redeemed}');

  // 5 — הראשון המותר ברשימה (סוכות לא-מותר, פסח מותר) ⇒ פסח
  s = _Mock('holidayGift', ['פסח']);
  r = componentRedeemedNow(db, a, comp, [sukkot, pesach], s.itemOfFn,
      s.holidayAllowedFn, s.redeemedFn(true));
  assert(
      r == true &&
          s.redeemed.length == 1 &&
          s.redeemed[0][0] == 'c1' &&
          identical(s.redeemed[0][1], pesach),
      '✗ דוגמה 5: ${s.redeemed}');

  // 6 — הכרעת-המימוש בשקע: false לחג ⇒ false
  s = _Mock('holidayGift', ['פסח']);
  r = componentRedeemedNow(db, a, comp, [pesach], s.itemOfFn, s.holidayAllowedFn,
      s.redeemedFn(false));
  assert(r == false, '✗ דוגמה 6: $r');

  print('✓ component-redeemed-now (Dart): 6 דוגמאות-חוזה — ירוק');
}
