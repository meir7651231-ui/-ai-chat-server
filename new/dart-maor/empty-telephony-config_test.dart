import '../dart-data-maor/empty-telephony-config-terms.dart' as td_empty_telephony_config;
// רתמת-זהב · empty-telephony-config — Dart≡JS. אותם קלטים→פלטים כמו בדיקת-ה-JS.
// דוגמת-החוזה: הגטר מוחזר פעמיים, פלט זהה-ביט לצילום.
import 'empty-telephony-config.dart';

void main() {
  final a = emptyTelephonyConfig(term: (k)=>td_empty_telephony_config.kTerms[k]!);
  final b = emptyTelephonyConfig(term: (k)=>td_empty_telephony_config.kTerms[k]!);

  // צילום-הגטר: כל שדה בדיוק כמו במחרוזת-ה-JSON של בדיקת-ה-JS.
  final numbers = a['numbers'] as List;
  assert(numbers.length == 1);
  final n0 = numbers[0] as Map;
  assert(n0['id'] == 'n1');
  assert(n0['e164'] == '');
  assert(n0['label'] == 'קו ראשי');
  assert(n0['kind'] == 'sim');

  final days = a['officeDays'] as List;
  assert(days.length == 5);
  assert(days[0] == 0 && days[1] == 1 && days[2] == 2 && days[3] == 3 && days[4] == 4);

  assert(a['officeStart'] == '09:00');
  assert(a['officeEnd'] == '17:00');
  assert(a['officeExt'] == '101');
  assert(a['managerExt'] == '201');
  assert(a['vmBox'] == '100');
  assert(a['city'] == '');
  assert(a['kosherMode'] == false);
  assert(a['hebrewCalendar'] == true);
  assert(a['zmanim'] == false);
  assert(a['shabbat'] == true);
  assert(a['fasts'] == false);
  assert(a['voicemail'] == true);

  // סדר-המפתחות זהה לסדר-ההוספה של המקור (JSON.stringify משמר).
  assert(a.keys.join(',') ==
      'numbers,officeDays,officeStart,officeEnd,officeExt,managerExt,vmBox,city,'
          'kosherMode,hebrewCalendar,zmanim,shabbat,fasts,voicemail');
  assert(n0.keys.join(',') == 'id,e164,label,kind');

  // גטר טהור: שתי קריאות ⇒ פלט זהה-ביט (לא אותה הפניה).
  assert(!identical(a, b));
  assert(a.keys.join(',') == b.keys.join(','));

  print('✓ empty-telephony-config (Dart): צילום-גטר — ירוק · Dart≡JS');
}
