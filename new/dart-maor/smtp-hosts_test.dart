// בדיקת-חוזה (רתמת-זהב) · smtp-hosts — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'smtp-hosts.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(smtpHosts) != '{"gmail.com":"smtp.gmail.com:465","googlemail.com":"smtp.gmail.com:465","outlook.com":"smtp-mail.outlook.com:587","hotmail.com":"smtp-mail.outlook.com:587","yahoo.com":"smtp.mail.yahoo.com:465","walla.co.il":"out.walla.co.il:465"}') {
    throw StateError('FAIL smtpHosts: צילום-הערך סטה');
  }
  print('OK smtp-hosts: 1 data-snapshot(s) passed');
}
