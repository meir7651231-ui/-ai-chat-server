// רתמת-זהב · time-cost-total — כל 6 דוגמאות-החוזה = בדיקת-ה-JS (זהות ביט-אחר-ביט).
// מייבאת אך ורק את האטום-שלה (חוק-4). כשל ⇒ StateError; סיום-ירוק ⇒ OK.
// הרצה: dart run --enable-asserts new/dart-maor/time-cost-total_test.dart  ⇒ exit 0
import 'time-cost-total.dart';

int _n = 0;
void _eq(num got, num want, String msg) {
  _n++;
  if (got != want) throw StateError('FAIL $msg ⇒ $got ≠ $want');
}

void main() {
  // 1) סכימה רגילה: 2×100 + 1.5×80 = 320
  _eq(
    timeCostTotal({
      'time': [
        {'hours': 2, 'rate': 100},
        {'hours': 1.5, 'rate': 80},
      ],
    }),
    320,
    'סכימה שגויה',
  );

  // 2) שעתון ריק ⇒ 0
  _eq(timeCostTotal({'time': []}), 0, 'ריק לא החזיר 0');

  // 3) בלי time בכלל ⇒ 0
  _eq(timeCostTotal({}), 0, 'חסר-time לא החזיר 0');

  // 4) שעות-כמחרוזת נכפות למספר
  _eq(
    timeCostTotal({
      'time': [
        {'hours': '3', 'rate': 50},
      ],
    }),
    150,
    'כפייה-מספרית נכשלה',
  );

  // 5) שעות לא-מספריות ⇒ 0 (‏+'abc' = NaN ⇒ ||0 ⇒ 0)
  _eq(
    timeCostTotal({
      'time': [
        {'hours': 'abc', 'rate': 100},
      ],
    }),
    0,
    'לא-מספר לא נפל ל-0',
  );

  // 6) בלי תעריף ⇒ 0 (rate חסר = undefined falsy ⇒ 0)
  _eq(
    timeCostTotal({
      'time': [
        {'hours': 4},
      ],
    }),
    0,
    'חסר-תעריף לא החזיר 0',
  );

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(timeCostTotal({}) == 0, 'assert-live guard');

  print('OK time-cost-total (Dart): $_n דוגמאות-חוזה — ירוק');
}
