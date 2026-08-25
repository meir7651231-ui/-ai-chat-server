// בדיקת to-csv — כל דוגמאות-החוזה + בדיקת-ה-JS (to-csv.test.mjs), זהה-ביט.
import 'to-csv.dart';

void check(bool cond, String msg) {
  if (!cond) throw StateError('✗ $msg');
}

void main() {
  // שקע-זהות כמו ב-JS: id=(x)=>String(x)
  String id(dynamic x) => x.toString();

  // חוזה + JS: בסיסי — [["א","ב"],["1","2"]] ⇒ "﻿א,ב\n1,2"
  final basic = toCsv([
    ['א', 'ב'],
    ['1', '2'],
  ], id);
  check(basic == '\u{FEFF}א,ב\n1,2', 'בסיסי');

  // חוזה + JS: ריק — [] ⇒ "﻿" (BOM בלבד)
  check(toCsv([], id) == '\u{FEFF}', 'ריק');

  // JS: הפלט תמיד מתחיל ב-BOM
  check((toCsv([
    ['x']
  ], id) as String).startsWith('\u{FEFF}'), 'BOM');

  // איבר-איבר: פיצול הפלט הבסיסי לשורות — אורך + איבר-איבר
  final lines = (basic as String).substring(1).split('\n');
  check(lines.length == 2, 'אורך-שורות');
  final expected = ['א,ב', '1,2'];
  for (var i = 0; i < expected.length; i++) {
    check(lines[i] == expected[i], 'שורה-$i');
  }

  print('OK');
}
