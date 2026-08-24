// בדיקת-חוזה (רתמת-זהב) · intakeLog — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/intake-log.test.mjs:
//   1) [a(08-01,120), b(08-20,80)]  ⇒ rows [b·"שמיכה", a·"סל מזון"], totalCost 200
//   2) itemId 'iX' לא-בקטלוג         ⇒ itemName "—" (העלות 50 כן נספרת)
//   3) תרומה-בעין z(cost=0)           ⇒ ביומן, totalCost 120 (לא גדל)
//   4) שוויון-תאריך s1,s2            ⇒ סדר-ההזנה נשמר (מיון יציב)
//   5) shopIntakes=[]                ⇒ rows [], totalCost 0
// המרה: === של JS (שימור-רפרנס-intake) ⇒ identical ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/intake-log_test.dart  ⇒ exit 0
import 'intake-log.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final items = [
    {'id': 'i1', 'name': 'סל מזון'},
    {'id': 'i2', 'name': 'שמיכה'},
  ];

  // 1) מיון תאריך-יורד + שמות + סה"כ.
  final a = {'itemId': 'i1', 'date': '2026-08-01', 'cost': 120};
  final b = {'itemId': 'i2', 'date': '2026-08-20', 'cost': 80};
  final r1 = intakeLog({'shopIntakes': [a, b], 'shopItems': items});
  final rows1 = r1['rows'] as List;
  _ok(rows1.length == 2, 'ד1: אורך-שורות'); n++;
  _ok(identical((rows1[0] as Map)['intake'], b), 'ד1: שורה-ראשונה = b (חדש-ראשון)'); n++;
  _ok((rows1[0] as Map)['itemName'] == 'שמיכה', 'ד1: itemName b'); n++;
  _ok(identical((rows1[1] as Map)['intake'], a), 'ד1: שורה-שנייה = a'); n++;
  _ok((rows1[1] as Map)['itemName'] == 'סל מזון', 'ד1: itemName a'); n++;
  _ok(r1['totalCost'] == 200, 'ד1: totalCost=200'); n++;

  // 2) פריט לא-קיים ⇒ "—" (העלות נספרת).
  final x = {'itemId': 'iX', 'date': '2026-08-10', 'cost': 50};
  final r2 = intakeLog({'shopIntakes': [x], 'shopItems': items});
  final rows2 = r2['rows'] as List;
  _ok(rows2.length == 1, 'ד2: אורך'); n++;
  _ok(identical((rows2[0] as Map)['intake'], x), 'ד2: intake'); n++;
  _ok((rows2[0] as Map)['itemName'] == '—', 'ד2: itemName="—"'); n++;
  _ok(r2['totalCost'] == 50, 'ד2: totalCost=50'); n++;

  // 3) תרומה-בעין cost=0 — ביומן, לא בסכום.
  final z = {'itemId': 'i2', 'date': '2026-08-05', 'cost': 0};
  final r3 = intakeLog({'shopIntakes': [a, z], 'shopItems': items});
  final rows3 = r3['rows'] as List;
  _ok(identical((rows3[0] as Map)['intake'], z), 'ד3: z חדש-ראשון (08-05>08-01)'); n++;
  _ok((rows3[0] as Map)['itemName'] == 'שמיכה', 'ד3: itemName z'); n++;
  _ok(identical((rows3[1] as Map)['intake'], a), 'ד3: a שנייה'); n++;
  _ok((rows3[1] as Map)['itemName'] == 'סל מזון', 'ד3: itemName a'); n++;
  _ok(r3['totalCost'] == 120, 'ד3: totalCost=120 (0 לא מוסיף)'); n++;

  // 4) שוויון-תאריך ⇒ סדר-ההזנה (מיון יציב).
  final s1 = {'itemId': 'i1', 'date': '2026-08-15', 'cost': 10};
  final s2 = {'itemId': 'i2', 'date': '2026-08-15', 'cost': 20};
  final r4 = intakeLog({'shopIntakes': [s1, s2], 'shopItems': items});
  final rows4 = r4['rows'] as List;
  _ok(identical((rows4[0] as Map)['intake'], s1), 'ד4: s1 ראשון (מיון יציב)'); n++;
  _ok(identical((rows4[1] as Map)['intake'], s2), 'ד4: s2 שני (מיון יציב)'); n++;

  // 5) ריק.
  final r5 = intakeLog({'shopIntakes': [], 'shopItems': items});
  _ok((r5['rows'] as List).isEmpty, 'ד5: rows ריק'); n++;
  _ok(r5['totalCost'] == 0, 'ד5: totalCost=0'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(intakeLog({'shopIntakes': [], 'shopItems': items})['totalCost'] == 0,
      'assert-live guard');

  print('OK intakeLog: $n asserts passed');
}
