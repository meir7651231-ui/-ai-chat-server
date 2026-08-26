// בדיקת-חוזה · auditTrail / renderAuditTrail — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/audit_trail_test.dart
import 'audit_trail.dart';

// שקע-הבדיקה: רינדור-מייצג המשחזר את פורמט אטום-האח audit_line ('⛔ '+e).
// (שקוף-לתוכן — auditTrail עצמו אינו יודע דבר על הפורמט.)
String _line(String e) => '⛔ $e';

void _eqStr(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void _eqList(List<String> got, List<String> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: len got=${got.length} want=${want.length}');
  }
  for (var i = 0; i < got.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label #$i]: got="${got[i]}" want="${want[i]}"');
    }
  }
}

void main() {
  var n = 0;

  // — auditTrail: שורה לכל אלמנט, סדר נשמר —
  _eqList(auditTrail(['a', 'b'], auditLine: _line), ['⛔ a', '⛔ b'], '1 two'); n++;
  _eqList(auditTrail(<String>[], auditLine: _line), <String>[], '2 empty->[]'); n++;
  _eqList(auditTrail(['solo'], auditLine: _line), ['⛔ solo'], '3 single'); n++;
  _eqList(auditTrail(['x', 'y', 'z'], auditLine: _line),
      ['⛔ x', '⛔ y', '⛔ z'], '4 three ordered'); n++;

  // — renderAuditTrail: join('\n') נקי —
  _eqStr(renderAuditTrail(['a', 'b'], auditLine: _line), '⛔ a\n⛔ b', '5 render two'); n++;
  _eqStr(renderAuditTrail(<String>[], auditLine: _line), '', '6 render empty->""'); n++;
  _eqStr(renderAuditTrail(['solo'], auditLine: _line), '⛔ solo', '7 render single (no \\n)'); n++;
  _eqStr(renderAuditTrail(['x', 'y', 'z'], auditLine: _line),
      '⛔ x\n⛔ y\n⛔ z', '8 render three'); n++;

  // — אינווריאנט 1:1: אורך-הפלט == blocked.length —
  final big = List.generate(50, (i) => 'e$i');
  _eqStr('${auditTrail(big, auditLine: _line).length}', '50', '9 len==input'); n++;

  // — שקיפות-לרינדר: שקע-זהות מוכיח שהאטום אינו נוגע בתוכן —
  _eqList(auditTrail(['keep · me'], auditLine: (e) => e),
      ['keep · me'], '10 identity renderer verbatim'); n++;

  // — שימור-סדר תחת רינדר-אינדקס (לא-ממוין) —
  _eqStr(renderAuditTrail(['b', 'a', 'c'], auditLine: (e) => e),
      'b\na\nc', '11 order preserved (not sorted)'); n++;

  // — גנריות: אלמנט לא-מחרוזת (int) דרך שקע-הרינדר —
  _eqStr(renderAuditTrail<int>([1, 2, 3], auditLine: (e) => 'n=$e'),
      'n=1\nn=2\nn=3', '12 generic int elements'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(renderAuditTrail(['a'], auditLine: _line) == '⛔ a', 'assert-live guard');

  print('OK auditTrail/renderAuditTrail: $n asserts passed');
}
