// בדיקת-אטום · configOpsToJson — מוכיחה בדיוק את דוגמאות config_ops_to_json.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/config_ops_to_json_test.dart ⇒ exit 0 + "configOpsToJson OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4). השקע toJson כאן = רתמת-בדיקה מקומית
// שמדמה את השכן configOpToJson (config_op.dart:67-72) — לא אטום-שכן.
import 'config_ops_to_json.dart';

// השוואת-רשימת-מפות עמוקה (records/מפות לא משווים עמוק בברירת-מחדל).
bool _listMapEq(List<Map<String, dynamic>> a, List<Map<String, dynamic>> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    final x = a[i], y = b[i];
    if (x.length != y.length) return false;
    for (final e in y.entries) {
      if (x[e.key] != e.value) return false;
    }
  }
  return true;
}

// שקע-הבדיקה: זהות עטופה — מבודד את חוזה-האצווה (מיפוי+סדר+1:1) מהפר-איבר.
List<Map<String, dynamic>> _to(List<int> ops) =>
    configOpsToJson<int>(ops, toJson: (op) => {'v': op});

void main() {
  // #1 — רשימה-ריקה ⇒ פלט-ריק (:111).
  assert(_listMapEq(_to([]), []));

  // #2 — איבר-יחיד עובר toJson (:111).
  assert(_listMapEq(_to([10]), [
    {'v': 10}
  ]));

  // #3 — סדר-נשמר, 1:1 (:110-111).
  assert(_listMapEq(_to([1, 2, 3]), [
    {'v': 1},
    {'v': 2},
    {'v': 3}
  ]));

  // #4 — סדר-הקלט (לא ממויין) (:111).
  assert(_listMapEq(_to([3, 1, 2]), [
    {'v': 3},
    {'v': 1},
    {'v': 2}
  ]));

  // #5 — כפילים נשמרים, אין dedup (:111).
  assert(_listMapEq(_to([7, 7]), [
    {'v': 7},
    {'v': 7}
  ]));

  // אורך-הפלט ≡ אורך-הקלט (1:1, :110).
  assert(_to([1, 2, 3, 4, 5]).length == 5);

  // #6 — נאמנות-סוקט: המעטפת (schemaVersion + op) חיה-בשקע (config_op.dart:67-72).
  final r6 = configOpsToJson<String>(
    ['x', 'y'],
    toJson: (op) => {'schemaVersion': 1, 'op': op},
  );
  assert(_listMapEq(r6, [
    {'schemaVersion': 1, 'op': 'x'},
    {'schemaVersion': 1, 'op': 'y'}
  ]));

  print('configOpsToJson OK — 6/6 contract examples proven');
}
