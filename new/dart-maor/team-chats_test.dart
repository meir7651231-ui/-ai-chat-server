// בדיקת-חוזה (רתמת-זהב) · team-chats — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'team-chats.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(teamChats) != '"teamChats"') {
    throw StateError('FAIL teamChats: צילום-הערך סטה');
  }
  print('OK team-chats: 1 data-snapshot(s) passed');
}
