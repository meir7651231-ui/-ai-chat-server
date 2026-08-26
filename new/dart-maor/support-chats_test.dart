// בדיקת-חוזה (רתמת-זהב) · support-chats — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'support-chats.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(supportChats) != '"supportChats"') {
    throw StateError('FAIL supportChats: צילום-הערך סטה');
  }
  print('OK support-chats: 1 data-snapshot(s) passed');
}
