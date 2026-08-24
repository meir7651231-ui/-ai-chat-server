import 'can-granted-action.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/can-granted-action.test.mjs.
/// אם עובר — Dart ≡ JS.
bool _never(Map<String, dynamic> config, String email) =>
    throw StateError('השקע נקרא');
bool _admin(Map<String, dynamic> config, String email) => true;
bool _notAdmin(Map<String, dynamic> config, String email) => false;

void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  // 1) מנהל ⇒ true, קיצור-חישוב — השקע לא נקרא
  ok(canGrantedAction({}, 'a@b.c', true, 'x.del', _never) == true,
      'מנהל ≠ true / השקע נקרא');
  // 2) אדמין דרך השקע
  ok(canGrantedAction({}, 'a@b.c', false, 'x.del', _admin) == true,
      'אדמין ≠ true');
  // 3) הדלקה-פר-עובד
  ok(
      canGrantedAction({
            'features': {'x.del': true}
          }, 'w@b.c', false, 'x.del', _notAdmin) ==
          true,
      'דגל-true ≠ true');
  // 4) מחרוזת 'true' לא נחשבת
  ok(
      canGrantedAction({
            'features': {'x.del': 'true'}
          }, 'w@b.c', false, 'x.del', _notAdmin) ==
          false,
      "מחרוזת-'true' עברה");
  // 5) features חסר
  ok(canGrantedAction({}, 'w@b.c', false, 'x.del', _notAdmin) == false,
      'features-חסר ≠ false');
  // 6) דגל false
  ok(
      canGrantedAction({
            'features': {'x.del': false}
          }, 'w@b.c', false, 'x.del', _notAdmin) ==
          false,
      'דגל-false ≠ false');

  if (f != 0) throw StateError('can-granted-action: סטייה מהמקור');
  print('✓ can-granted-action: 6 דוגמאות-חוזה — ירוק');
}
