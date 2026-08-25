// רתמת-זהב · paid-in-range — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart≡JS. הקלטים/פלטים הועתקו verbatim מ-new/atoms/paid-in-range.test.mjs.
// הבדיקה מייבאת אך ורק את האטום שלה (חוק-4); שקע inRange משוכפל מבדיקת-ה-JS.
import 'paid-in-range.dart';

// שקע-הטווח כהתנהגות-המקור (inRange של reports/lib), שעתוק-אמת של ה-ir בבדיקת-ה-JS:
//   if (!iso) return false; if (r.from && iso < r.from) return false;
//   if (r.to && iso > r.to) return false; return true;
bool _ir(Object? iso, Map<String, dynamic> r) {
  if (iso == null) return false; // !iso
  final String s = iso as String;
  if (s.isEmpty) return false; // מחרוזת-ריקה = falsy של JS
  final Object? from = r['from'];
  if (from is String && from.isNotEmpty && s.compareTo(from) < 0) return false;
  final Object? to = r['to'];
  if (to is String && to.isNotEmpty && s.compareTo(to) > 0) return false;
  return true;
}

void main() {
  final jan = <String, dynamic>{'from': '2026-01-01', 'to': '2026-01-31'};

  // 1) רק תשלום-ינואר
  final e1 = <String, dynamic>{
    'payments': [
      {'date': '2026-01-10', 'amount': 100},
      {'date': '2026-02-10', 'amount': 50},
    ],
  };
  assert(paidInRange(e1, jan, _ir) == 100, 'דוגמה 1');

  // 2) טווח פתוח ⇒ הכול
  assert(paidInRange(e1, <String, dynamic>{}, _ir) == 150, 'דוגמה 2');

  // 3) גבולות סגורים משני הקצוות
  final e3 = <String, dynamic>{
    'payments': [
      {'date': '2026-01-01', 'amount': 10},
      {'date': '2026-01-31', 'amount': 20},
    ],
  };
  assert(paidInRange(e3, jan, _ir) == 30, 'דוגמה 3');

  // 4) בלי payments / ריק ⇒ 0
  assert(paidInRange(<String, dynamic>{}, jan, _ir) == 0, 'דוגמה 4א: e ריק');
  assert(paidInRange(<String, dynamic>{'payments': []}, jan, _ir) == 0, 'דוגמה 4ב: מערך ריק');

  // 5) מגן-מספר: NaN ומחרוזת ⇒ 0
  final e5 = <String, dynamic>{
    'payments': [
      {'date': '2026-01-10', 'amount': double.nan},
      {'date': '2026-01-11', 'amount': '80'},
      {'date': '2026-01-12', 'amount': 25},
    ],
  };
  assert(paidInRange(e5, jan, _ir) == 25, 'דוגמה 5');

  // 6) תשלום בלי תאריך מסונן ע"י השקע
  assert(
    paidInRange(<String, dynamic>{
      'payments': [
        {'date': '', 'amount': 40},
      ],
    }, jan, _ir) == 0,
    'דוגמה 6',
  );

  print('✓ paid-in-range: 6 דוגמאות-חוזה — Dart≡JS ירוק');
}
