// בדיקת-חוזה (רתמת-זהב) · template-defs — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'template-defs.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(templateDefs) != '[{"key":"wa.delivery","label":"🚚 הודעת-מסירה (חלוקה)","vars":["name","org"],"def":"שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚"},{"key":"wa.payment","label":"💳 תזכורת-תשלום (חוגים)","vars":["org","what","amount"],"def":"שלום, תזכורת ידידותית מ{org}: יתרה לתשלום עבור {what} — ₪{amount}. תודה רבה!"},{"key":"wa.birthday","label":"🎂 ברכת יום-הולדת","vars":["first","org"],"def":"מזל טוב ל{first} ליום ההולדת! 🎂 באהבה, {org}"},{"key":"wa.dialer","label":"📞 הודעת-חייגן (לא ענה)","vars":["name","org"],"def":"שלום {name}, ניסינו להשיג אתכם מ{org} ולא הצלחנו — נשמח שתחזרו אלינו 🙏"},{"key":"wa.paylink","label":"💳 שליחת קישור-תשלום","vars":["name","org","link"],"def":"שלום {name}, תודה על השיחה! לתרומה מקוונת ל{org}: {link} 🙏"}]') {
    throw StateError('FAIL templateDefs: צילום-הערך סטה');
  }
  print('OK template-defs: 1 data-snapshot(s) passed');
}
