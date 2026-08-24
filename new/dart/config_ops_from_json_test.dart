// בדיקת-אטום · configOpsFromJson — מוכיחה בדיוק את דוגמאות config_ops_from_json.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/config_ops_from_json_test.dart ⇒ exit 0 + "configOpsFromJson OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4). שקע-השכן מדומה כאן — לא אטום-שכן (configOpFromJson).
import 'config_ops_from_json.dart';

// שקע-פענוח-האיבר: מזקק את configOpFromJson(e) — String ⇒ op-מוכר, אחר/null ⇒ נופל.
String? _from(Object? e) => e is String ? 'op:$e' : null;

List<String> _run(Object? raw) => configOpsFromJson<String>(raw, fromJson: _from);

void main() {
  // #1 — null (אינו List) ⇒ [] (config_op.dart:117).
  assert(_run(null).isEmpty);
  // #2 — String (אינו List) ⇒ [].
  assert(_run('hi').isEmpty);
  // #3 — Map (אינו List) ⇒ [].
  assert(_run({'a': 1}).isEmpty);
  // #4 — num (אינו List) ⇒ [].
  assert(_run(42).isEmpty);
  // #5 — רשימה ריקה ⇒ [].
  assert(_run(<Object?>[]).isEmpty);
  // #6 — כל האיברים מוכרים ⇒ סדר משתמר.
  assert(_listEq(_run(['x', 'y']), ['op:x', 'op:y']));
  // #7 — null באמצע נופל, השאר נשמר בסדר.
  assert(_listEq(_run(['x', null, 'z']), ['op:x', 'op:z']));
  // #8 — כולם non-String ⇒ [].
  assert(_run([1, 2, 3]).isEmpty);
  // #9 — איבר-לא-מוכר (5) נופל, השאר נשמר.
  assert(_listEq(_run(['x', 5, 'z']), ['op:x', 'op:z']));
  // #10 — כפילים נשמרים (אין דדופ).
  assert(_listEq(_run(['a', 'a']), ['op:a', 'op:a']));
  // #11 — כולם null ⇒ [] (לא null).
  assert(_run([null, null]).isEmpty);

  print('configOpsFromJson OK — 11/11 contract examples proven');
}

bool _listEq(List<String> a, List<String> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}
