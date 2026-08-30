import '../dart-data-maor/cockpit-csv-rows-sockets.dart' as sk_cockpit_csv_rows;
// רתמת-זהב · cockpit-csv-rows — אותם קלטים/WANT של בדיקת-ה-JS (השוואת-JSON).
import 'dart:convert';
import 'cockpit-csv-rows.dart';

void main() {
  final q = {
    'tasks': [
      {'kind': 'call', 'name': 'אבי', 'phone': '050', 'reason': 'יעד'},
      {'kind': 'thanks', 'name': '', 'phone': '', 'reason': 'תרם ₪100 · היום'},
      {'kind': 'hok', 'name': 'דן', 'phone': '052', 'reason': 'הוק'},
    ],
    'total': 3,
  };
  const want =
      '[["קבוצה","שם","טלפון","סיבה"],["שיחה","אבי","050","יעד"],["תודה","","","תרם ₪100 · היום"],["הו״ק","דן","052","הוק"]]';
  final got = jsonEncode(cockpitCsvRows(q, sk_cockpit_csv_rows.cockpitCsvRows_T));
  assert(got == want, '✗ $got ≠ $want');
  print('✓ cockpit-csv-rows (Dart): 1 Golden — ירוק');
}
