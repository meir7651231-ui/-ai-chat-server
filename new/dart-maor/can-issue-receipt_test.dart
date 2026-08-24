import 'can-issue-receipt.dart';

/// רתמת-זהב: אותן 5 דוגמאות-חוזה בדיוק מ-new/atoms/can-issue-receipt.test.mjs.
/// base = כל השדות false; כל דוגמה דורסת חלק מהשקעים.
void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  // 1) עבודה מקומית בלי ענן — מתיר
  ok(canIssueReceipt() == true, 'לא-מחובר ≠ true');
  // 2) עובד/ת מחובר/ת בלי סמכות — חסום
  ok(canIssueReceipt(cloudConnected: true) == false, 'עובד-מחובר ≠ false');
  // 3) מייל-על
  ok(canIssueReceipt(cloudConnected: true, superAdmin: true) == true,
      'מייל-על ≠ true');
  // 4) מנהל-ארגון
  ok(canIssueReceipt(cloudConnected: true, isManager: true) == true,
      'מנהל ≠ true');
  // 5) לקוח-שורש
  ok(canIssueReceipt(cloudConnected: true, cloudRoot: true) == true,
      'שורש ≠ true');

  if (f != 0) throw StateError('can-issue-receipt: סטייה מהמקור');
  print('✓ can-issue-receipt: 5 דוגמאות-חוזה — ירוק');
}
