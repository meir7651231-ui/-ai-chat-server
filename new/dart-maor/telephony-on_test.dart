import 'telephony-on.dart';

int f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    f = 1;
  }
}

void main() {
  // 1) enabled:true ⇒ דלוק
  ok(telephonyOn({'telephony': {'enabled': true}}) == true,
      'דוגמה 1: enabled:true לא דלוק');
  // 2) enabled:false ⇒ כבוי
  ok(telephonyOn({'telephony': {'enabled': false}}) == false,
      'דוגמה 2: enabled:false דלוק');
  // 3) חסר telephony ⇒ כבוי (opt-in)
  ok(telephonyOn(<String, dynamic>{}) == false, 'דוגמה 3: חסר-telephony דלוק');
  // 4) telephony בלי enabled ⇒ כבוי
  ok(telephonyOn({'telephony': <String, dynamic>{}}) == false,
      'דוגמה 4: בלי-enabled דלוק');
  // 5) מחרוזת 'true' ⇒ כבוי (=== מחמיר)
  ok(telephonyOn({'telephony': {'enabled': 'true'}}) == false,
      "דוגמה 5: 'true' מחרוזת דלוק");
  if (f != 0) {
    throw StateError('telephony-on: בדיקות נכשלו');
  }
  print('✓ telephony-on: 5 דוגמאות-חוזה — ירוק');
  print('OK');
}
