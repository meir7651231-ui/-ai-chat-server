// בדיקת-חוזה (רתמת-זהב) · site-ui-labels — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'site-ui-labels.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(siteUiLabels) != '{"he":{"donate":"לתרומה","contact":"צור קשר","enter":"כניסה למערכת","services":"מה אנחנו עושים","story":"הסיפור שמאחורי","news":"כל חודש — מה חדש","gallery":"רגעים","campaign":"הקמפיין שלנו","raised":"גויסו","goal":"יעד","daysLeft":"ימים נותרו","call":"חייגו","whatsapp":"וואטסאפ","email":"מייל","poweredBy":"מופעל על-ידי מאור","dir":"rtl"},"en":{"donate":"Donate","contact":"Contact","enter":"Staff login","services":"What we do","story":"Our story","news":"This month","gallery":"Moments","campaign":"Our campaign","raised":"Raised","goal":"Goal","daysLeft":"days left","call":"Call","whatsapp":"WhatsApp","email":"Email","poweredBy":"Powered by Maor","dir":"ltr"},"yi":{"donate":"שפּענדן","contact":"פֿאַרבינדונג","enter":"אַרײַנגאַנג","services":"וואָס מיר טוען","story":"אונדזער געשיכטע","news":"דעם חודש","gallery":"מאָמענטן","campaign":"אונדזער קאַמפּיין","raised":"געזאַמלט","goal":"ציל","daysLeft":"טעג געבליבן","call":"רופֿט","whatsapp":"וואַטסאַפּ","email":"בליץ-פּאָסט","poweredBy":"געטריבן דורך מאור","dir":"rtl"}}') {
    throw StateError('FAIL siteUiLabels: צילום-הערך סטה');
  }
  print('OK site-ui-labels: 1 data-snapshot(s) passed');
}
