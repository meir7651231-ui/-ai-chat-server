// בדיקת-חוזה (רתמת-זהב) · matchAll — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/match-all.test.mjs:
//   1) 2 תשלומים (100,200) · 2 פלנים (100,200)      ⇒ 2 התאמות (p1,p2)
//   2) 2 תשלומים זהים (100,100) · 2 פלנים (100,100)  ⇒ 2 התאמות בפלנים שונים (p1,p3)
//   3) 2 תשלומים זהים (100,100) · פלן-יחיד (100)      ⇒ התאמה-אחת (הפלן לא נתפס פעמיים)
//   4) תשלום ללא-סכום-תואם (999) · פלן (100)          ⇒ 0 התאמות (מדולג)
// השקע-הדמה זהה למקור: התאמה-לפי-סכום, מחזיר את הפלן-הפתוח הראשון.
// המרה: JS `if (m)` ⇒ Dart `m != null`. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/match-all_test.dart  ⇒ exit 0
import 'match-all.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// שקע-דמה מתועד-בחוזה: שיוך-יחיד לפי-סכום, מחזיר את הפלן-הפתוח הראשון (מקומי לבדיקה).
Map<String, dynamic>? matcher(
  Map<String, dynamic> inc,
  List<Map<String, dynamic>> open,
) {
  for (final o in open) {
    if ((o['plan'] as Map)['amount'] == inc['amount']) {
      return {...o, 'incomingId': inc['id'], 'confidence': 100};
    }
  }
  return null;
}

Map<String, dynamic> ref(Object id, int amount) => {
      'entityId': 'e$id',
      'plan': {'id': id, 'amount': amount},
    };
Map<String, dynamic> inc(Object id, int amount) => {'id': id, 'amount': amount};

List<Object?> planIds(List<Map<String, dynamic>> out) =>
    out.map((o) => (o['plan'] as Map)['id']).toList();

void main() {
  var n = 0;

  // 1) 2 תשלומים · 2 פלנים → 2 התאמות (p1, p2).
  var out = matchAll(
    [inc('i1', 100), inc('i2', 200)],
    [ref('p1', 100), ref('p2', 200)],
    matcher,
  );
  _ok(out.length == 2, '2×2: אורך=${out.length}'); n++;
  _ok((out[0]['plan'] as Map)['id'] == 'p1', '2×2: [0]≠p1 (${planIds(out)})'); n++;
  _ok((out[1]['plan'] as Map)['id'] == 'p2', '2×2: [1]≠p2 (${planIds(out)})'); n++;

  // 2) 2 תשלומים זהים · 2 פלנים זהים → 2 התאמות בפלנים שונים (אנטי-כפילות בוחרת את הבא).
  out = matchAll(
    [inc('i1', 100), inc('i2', 100)],
    [ref('p1', 100), ref('p3', 100)],
    matcher,
  );
  _ok(out.length == 2, '2זהים×2: אורך=${out.length}'); n++;
  _ok((out[0]['plan'] as Map)['id'] == 'p1', '2זהים×2: [0]≠p1 (${planIds(out)})'); n++;
  _ok((out[1]['plan'] as Map)['id'] == 'p3', '2זהים×2: [1]≠p3 (${planIds(out)})'); n++;

  // 3) 2 תשלומים זהים · פלן-יחיד → התאמה-אחת (הפלן לא נתפס פעמיים).
  out = matchAll(
    [inc('i1', 100), inc('i2', 100)],
    [ref('p1', 100)],
    matcher,
  );
  _ok(out.length == 1, '2זהים×1: אורך=${out.length}'); n++;
  _ok((out[0]['plan'] as Map)['id'] == 'p1', '2זהים×1: [0]≠p1 (${planIds(out)})'); n++;

  // 4) תשלום ללא-סכום-תואם → 0 התאמות (מדולג).
  out = matchAll(
    [inc('i1', 999)],
    [ref('p1', 100)],
    matcher,
  );
  _ok(out.length == 0, 'ללא-תאום: אורך=${out.length}'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(matchAll([inc('i1', 100), inc('i2', 100)], [ref('p1', 100)], matcher).length == 1,
      'assert-live guard');

  print('OK matchAll: $n asserts passed');
}
