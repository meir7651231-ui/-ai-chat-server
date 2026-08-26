// בדיקת-חוזה ל-time-cost-total.dart — 6 דוגמאות מקבילות ל-time-cost-total.test.mjs
// + בדיקת-רגרסיה להסגר (NEL U+0085 שגזם ב-Dart אך NaN ב-JS).
import 'time-cost-total.dart';

int _f = 0;
void _eq(num got, num exp, String msg) {
  if (got != exp) {
    print('✗ $msg ⇒ got=$got exp=$exp');
    _f = 1;
  }
}

void main() {
  // 1) סכימה רגילה: 2×100 + 1.5×80 = 320
  _eq(timeCostTotal({'time': [{'hours': 2, 'rate': 100}, {'hours': 1.5, 'rate': 80}]}), 320, 'סכימה');
  // 2) שעתון ריק ⇒ 0
  _eq(timeCostTotal({'time': []}), 0, 'ריק');
  // 3) בלי time בכלל ⇒ 0
  _eq(timeCostTotal({}), 0, 'חסר-time');
  // 4) שעות-כמחרוזת נכפות למספר
  _eq(timeCostTotal({'time': [{'hours': '3', 'rate': 50}]}), 150, 'כפייה-מספרית');
  // 5) שעות לא-מספריות ⇒ 0
  _eq(timeCostTotal({'time': [{'hours': 'abc', 'rate': 100}]}), 0, 'לא-מספר⇒0');
  // 6) בלי תעריף ⇒ 0
  _eq(timeCostTotal({'time': [{'hours': 4}]}), 0, 'חסר-תעריף⇒0');

  // 7) רגרסיית-הסגר: NEL אינו רווח-ES ⇒ Number('3')=NaN⇒0 (לא 3×50).
  _eq(timeCostTotal({'time': [{'hours': '3', 'rate': 50}]}), 0, 'NEL⇒NaN⇒0');
  // 8) רווח-ES רגיל כן נגזם ⇒ 3×50=150
  _eq(timeCostTotal({'time': [{'hours': ' 3 ', 'rate': 50}]}), 150, 'רווח-ES נגזם');

  if (_f != 0) throw StateError('time-cost-total: כשל');
  print('✓ time-cost-total: 8 בדיקות — ירוק');
}
