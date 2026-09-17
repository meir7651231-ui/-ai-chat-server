#!/usr/bin/env node
// 🧠 behavior-plan — בורר-התנהגויות-לפי-ייעוד ל«בלגן» (GENMAX·G34 · הכרעת-בעלים 9.9: "אין אותם באטום? תעשה את זה").
//   הכרעה-21/22: המחולל לא כותב התנהגות ביד — הוא מצהיר **צורך** (צורת-דאטה במסך: מועד · אדם · כסף · טקסט-חופשי · יומן · תזכורת)
//   עם מילות-ייעוד + חתימה, והבורר מדרג את **כל** מנועי-הלוגיקה באינדקס-האמת (atom-index-full · לוגיקה) כמו auto-logic (G18):
//   חפיפת-ייעוד (כותרת-doc של המנוע, idf) + התאמת-חתימה (argc · טיפוסים · החזרה). צורך בלי מועמד = פסילה (שקע-חובה ריק), לא נפילה לקוד-ידני.
//   G34ב (הכרעת-בעלים 9.9 «הכי-טוב-לייעוד = מה שהמנוע עושה, לא מה שכתוב עליו»): אחרי החתימה — **הוכחה-בריצה**: דוגמאות (קלט ⇒ בדיקה) של פעולת-היסוד
//   רצות ב-Dart על כל המועמדים (קובץ-מוכיח ב-.prove/, ייבוא-עם-קידומת); נבחר מי שעובר את כולן; התיאור רק שובר-שוויון. אף מועמד לא עובר ⇒ הצורך לא נפתר.
//   הפלט: behavior-plan.json (need ⇒ pick · file · score · top3). balagan.mjs/app-shell.mjs קוראים את התוכנית ומייבאים את הנבחר.
//   --gate: (א) כל צורך נפתר; (ב) הנבחר מיובא ונקרא בפועל בקבצי-בלגן המחוללים; (ג) המתאמים ב-Dart דקים (הלבשת-מונחים בלבד, אין מימוש-מחדש).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalog } from './auto-logic.mjs';
import { proveCandidates, isPure, buildInterp, evalInterp, jsTwinRows, jsParity } from './logic-proof.mjs';
import * as R from '../root.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'behavior-plan.json');

// הצרכים: מזהה ⇒ {shape (צורת-הדאטה), demand (מילות-הייעוד מצד המסך), params, ret}
export const NEEDS = {
  // הכרעת-בעלים 9.9: "אין לא-קיים או חלקי — המחולל מרכיב חלקיקים לייעוד". כל צורך = פעולת-יסוד אחת; ההתנהגות (דחייה · תזכורת · תווית-תאריך · לשון-עבר…) = דבק שמרכיב אותן.
  'week.start':         { shape: 'מועד',       demand: 'תחילת השבוע ראשון חצות תאריך', params: ['DateTime'], ret: 'DateTime', forbid: '\\.weekday\\b', examples: [['DateTime(2026, 9, 8)', 'r == DateTime(2026, 9, 6)'], ['DateTime(2026, 9, 13)', 'r == DateTime(2026, 9, 13)'], ['DateTime(2026, 9, 12)', 'r == DateTime(2026, 9, 6)']] },
  'iso.addDays':        { shape: 'מועד',       demand: 'הוספת ימים לתאריך ISO קדימה אחורה גלגול', params: ['String', 'int'], ret: 'String', forbid: 'Duration\\(days', examples: [["'2026-09-08', 1", "r == '2026-09-09'"], ["'2026-09-30', 1", "r == '2026-10-01'"], ["'2026-09-08', -8", "r == '2026-08-31'"]] },
    'iso.daysSince':      { shape: 'מועד',       demand: 'ימים בין ISO ליום ייחוס', params: ['String', 'String'], ret: 'num', forbid: '\\.inDays\\b', examples: [["'2026-09-05', '2026-09-08'", 'r == 3'], ["'2026-09-09', '2026-09-08'", 'r == -1'], ["'2026-09-08', '2026-09-08'", 'r == 0']] },
  'iso.inRange':        { shape: 'מועד',       demand: 'תאריך ISO בתוך טווח גבולות כוללים לפני אחרי', params: ['String?', '( String? from, String? to ) r'], ret: 'bool', examples: [["'2026-09-09', (from: '2026-09-08', to: null)", 'r == true'], ["'2026-09-07', (from: '2026-09-08', to: null)", 'r == false'], ["'2026-09-08', (from: '2026-09-08', to: '2026-09-08')", 'r == true']] },
    'task.overdue':       { shape: 'מועד',       demand: 'האם משימה באיחור due לפני היום פתוחה', params: ['dynamic', 'dynamic'], ret: 'bool', forbid: 'isBefore\\(today\\) \\? today', examples: [["{'due': '2026-09-01'}, '2026-09-08'", 'r == true'], ["{'due': '2026-09-20'}, '2026-09-08'", 'r == false'], ["{'due': '2026-09-08'}, '2026-09-08'", 'r == false']] },
  'time.toMin':         { shape: 'שעה',        demand: 'HH:MM לדקות מחצות שעה', params: ['dynamic'], ret: 'dynamic', examples: [["'15:03'", 'r == 903'], ["'00:30'", 'r == 30']] },
  'time.minutesBetween':{ shape: 'יומן',       demand: 'דקות בין שני זמנים ISO לפני', params: ['String', 'String'], ret: 'int', forbid: '\\.inMinutes|\\.inHours', examples: [["'2026-09-08T09:55', '2026-09-08T10:00'", 'r == 5'], ["'2026-09-07T23:00', '2026-09-08T10:00'", 'r == 660']] },
    'text.normSearch':    { shape: 'טקסט-חופשי', demand: 'נרמול טקסט לחיפוש אותיות סופיות', params: ['dynamic', 'Map<String, String> T'], ret: 'String', forbid: "ך\\$'\\), 'כ'", examples: [["'שלום', {'k1': 'כ', 'k2': 'מ', 'k3': 'נ', 'k4': 'פ', 'k5': 'צ'}", "r == 'שלומ'"], ["'ארנונה', {'k1': 'כ', 'k2': 'מ', 'k3': 'נ', 'k4': 'פ', 'k5': 'צ'}", "r == 'ארנונה'"], ["'ABC', {'k1': 'כ', 'k2': 'מ', 'k3': 'נ', 'k4': 'פ', 'k5': 'צ'}", "r == 'abc'"], ["'אב גד', {'k1': 'כ', 'k2': 'מ', 'k3': 'נ', 'k4': 'פ', 'k5': 'צ'}", "r == 'אב גד'"]] },
  'name.norm':          { shape: 'אדם',        demand: 'נרמול שם אדם בלי רווחים חיפוש', params: ['dynamic', 'String Function(dynamic) normSearch'], ret: 'String', examples: [["'רות לוי', (t) => t.toString().toLowerCase()", "r == 'רותלוי'"], ["' אבי  כהן ', (t) => t.toString()", "r == 'אביכהן'"]] },
  'phone.digits':       { shape: 'חיפוש',      demand: 'נרמול טלפון ספרות בלבד מקפים 972', params: ['String?'], ret: 'String', examples: [["'052-1234567'", "r == '0521234567'"], ["'1,250'", "r == '1250'"], ["'+972-52-1234567'", "r == '0521234567'"]] },
    'count.by':           { shape: 'רשומות',     demand: 'ספירה לפי מפתח מונה קבוצה', params: ['List<dynamic>', 'String Function(dynamic) key'], ret: 'List<List<Object>>', examples: [["[{'s': 'a'}, {'s': 'a'}, {'s': 'b'}], (x) => (x as Map)['s'].toString()", "r.toString() == '[[a, 2], [b, 1]]'"]] },
  'prefix.rule':        { shape: 'חיפוש',      demand: 'כלל ניקוד קידומת מתחיל ב', params: ['String', 'String'], ret: 'int?', forbid: "startsWith\\(w \\+ ' '\\)", examples: [["'איפה ', 'איפה הפיקדון'", 'r != null'], ["'חפש ', 'איפה הפיקדון'", 'r == null'], ["'הפיקדון', 'איפה הפיקדון'", 'r == null']] },
  'money.fmt':          { shape: 'כסף',        demand: 'מפריד אלפים ₪ מספר שלם עיגול', params: ['num'], ret: 'String', forbid: "replaceAllMapped\\(RegExp\\(r'\\\\B|\\(s\\.length - i\\) % 3 == 0", examples: [['9840', "r.replaceAll('₪', '').trim() == '9,840'"], ['1650', "r.replaceAll('₪', '').trim() == '1,650'"], ['999', "r.replaceAll('₪', '').trim() == '999'"]] },
  // ── G35 · מקבץ ב׳-קב…קה: חיפוש-סלחן מדורג · כפולים לפי דמיון-שם · תאריך-עברי · תזכורות-מרוכזות ──
  'search.exact':       { shape: 'חיפוש',      demand: 'כלל ניקוד התאמה מוחלטת חיפוש', params: ['String', 'String'], ret: 'num?', examples: [["'ארנונה', 'ארנונה'", 'r == 100'], ["'ארנונה', 'לשלם ארנונה'", 'r == null']] },
  'search.contains':    { shape: 'חיפוש',      demand: 'כלל ניקוד מכיל חיפוש', params: ['String', 'String'], ret: 'int?', examples: [["'ארנונה', 'לשלם ארנונה'", 'r != null'], ["'x', 'לשלם'", 'r == null'], ["'ארנונה', 'גנן'", 'r == null']] },
  'text.distance':      { shape: 'חיפוש',      demand: 'מרחק עריכה בין מחרוזות שגיאת הקלדה חילוף אותיות', params: ['String', 'String'], ret: 'int', examples: [["'ארנונה', 'ארנונא'", 'r == 1'], ["'abcd', 'abdc'", 'r == 1'], ["'a', 'a'", 'r == 0'], ["'', 'abc'", 'r == 3']] },
  'name.matches':       { shape: 'אדם',        demand: 'האם שני שמות אותו אדם שם פרטי משפחה סדר', params: ['String', 'String', 'String Function(String) normName'], ret: 'bool', examples: [["'דנה לוי', 'לוי דנה', (s) => s", 'r == true'], ["'דנה לוי', 'דנה כהן', (s) => s", 'r == false'], ["'רות', 'רות', (s) => s", 'r == true'], ["'', 'רות', (s) => s", 'r == false']] },
  'heb.parts':          { shape: 'מועד',       demand: 'רכיבי התאריך העברי יום חודש שנה לוח עברי', params: ['DateTime?'], ret: 'Map<String, Object>', examples: [['DateTime(2026, 9, 8)', "r['day'] == 26 && r['year'] == 5786"], ['null', "r['day'] == 0"]] },
  'heb.gem':            { shape: 'מועד',       demand: 'גימטריה מספר לאותיות עבריות', params: ['num', 'List<String> U', 'List<String> T', 'List<String> H', 'Map<String, dynamic> T2'], ret: 'String', imports: ['dart-data-maor/gematria-sockets.dart'], examples: [['26, gematria_U, gematria_T, gematria_H, gematria_T2', "r == 'כ״ו'"], ['15, gematria_U, gematria_T, gematria_H, gematria_T2', "r == 'ט״ו'"]] },
  'phone.key':          { shape: 'חיפוש',      demand: 'מפתח טלפון קנוני ספרות בלי 972 בלי אפס מוביל', params: ['String?'], ret: 'String', examples: [["'052-123-4567'", "r == '521234567'"], ["'+972521234567'", "r == '521234567'"], ["''", "r == ''"], ["'00972-50-1112233'", "r == '501112233'"]] },
  'dup.groups':         { shape: 'חיפוש',      demand: 'קבוצות כפולים לפי טלפון משותף או מפתח שם רכיבי קשירות', params: ['List<dynamic>', 'List<String> Function(dynamic)', 'String Function(dynamic)'], ret: 'List<List<String>>', examples: [["[{'id': 'a', 'phones': ['521']}, {'id': 'b', 'phones': ['521']}, {'id': 'c', 'phones': <String>[]}], (f) => (f['phones'] as List).cast<String>(), (f) => ''", "(r as List<List<String>>).any((g) => g.contains('a') && g.contains('b')) && !(r as List<List<String>>).any((g) => g.contains('c'))"], ["[{'id': 'a', 'n': 'x'}, {'id': 'b', 'n': 'x'}, {'id': 'c', 'n': 'y'}], (f) => <String>[], (f) => f['n'] as String", "r.length == 1 && r.first.contains('a') && r.first.contains('b')"], ["<Map<String, dynamic>>[], (f) => <String>[], (f) => ''", "r.isEmpty"]] },
  'iso.monthKey':       { shape: 'מועד',       demand: 'מפתח חודש מתאריך ISO שנה חודש', params: ['String'], ret: 'String', examples: [["'2026-09-08'", "r == '2026-09'"], ["'2026-09'", "r == '2026-09'"], ["'2026-10-01'", "r == '2026-10'"]] },
  'ics.escape':         { shape: 'ייצוא',      demand: 'בריחת תווים iCalendar RFC5545 פסיק נקודה-פסיק שורה', params: ['String?'], ret: 'String', examples: [["'a,b;c'", "r == 'a\\\\,b\\\\;c'"], ["null", "r == ''"], ["'x\\ny'", "r == 'x\\\\ny'"]] },
  'ics.fold':           { shape: 'ייצוא',      demand: 'קיפול שורת ICS 75 אוקטטים RFC5545', params: ['String'], ret: 'List<String>', examples: [["'SUMMARY:abc'", "r.length == 1 && r.first == 'SUMMARY:abc'"], ["'X:' + ('a' * 100)", "r.length == 2 && r[1].startsWith(' ')"]] },
  'ics.build':          { shape: 'ייצוא',      demand: 'בניית קובץ ICS שלם RFC5545 מרשימת מופעים תאריך שעה כותרת', params: ['List<Map<String, String?>>', 'String', 'DateTime', 'String Function(String) icsEscape', 'List<String> Function(String) foldIcsLine'], ret: 'String', imports: ['dart-maor/ics-escape.dart', 'dart-maor/fold-ics-line.dart'], examples: [["[{'uid': 'u1', 'date': '2026-09-15', 'title': 'ארנונה'}], 'בלגן', DateTime(2026, 9, 8, 10), (s) => icsEscape(s), (l) => foldIcsLine(l)", "r.contains('BEGIN:VCALENDAR') && r.contains('DTSTART;VALUE=DATE:20260915') && r.contains('SUMMARY:ארנונה') && r.contains('END:VCALENDAR')"], ["[{'uid': 'u2', 'date': '2026-09-15', 'time': '16:30', 'title': 'חוג'}], 'בלגן', DateTime(2026, 9, 8, 10), (s) => icsEscape(s), (l) => foldIcsLine(l)", "r.contains('DTSTART:20260915T163000') && r.contains('DTEND:20260915T173000')"]] },
  'csv.escape':         { shape: 'ייצוא',      demand: 'הגנת תא CSV ציטוט פסיק מרכאות חסימת נוסחה', params: ['Object?'], ret: 'String', examples: [["'a,b'", "r == '\"a,b\"'"], ["'=1+1'", "r == \"'=1+1\""], ["null", "r == ''"], ["'x'", "r == 'x'"]] },
  'csv.build':          { shape: 'ייצוא',      demand: 'שורות לטקסט CSV עם BOM ושקע בריחה', params: ['dynamic', 'dynamic'], ret: 'dynamic', imports: ['dart-maor/csv-escape.dart'], examples: [["[['a', 'b'], ['1', 'x,y']], (v) => csvEscape(v)", "(r as String).endsWith('a,b\\n1,\"x,y\"')"], ["<List<String>>[], (v) => csvEscape(v)", "(r as String).length == 1"]] },
  'csv.parse':          { shape: 'ייבוא',      demand: 'פרסור טקסט CSV לשורות תאים מרכאות פסיקים', params: ['String'], ret: 'List<List<String>>', examples: [["'a,b\\n1,\"x,y\"'", "r.length == 2 && r[1][1] == 'x,y' && r[0][0] == 'a'"], ["''", "r.isEmpty || (r.length == 1 && r[0].join('').isEmpty)"]] },
  'vcard.rows':         { shape: 'ייבוא',      demand: 'טקסט vCard VCF אנשי קשר שורות שם טלפון בניכוי זבל', params: ['String?'], ret: 'List<Map<String, String>>', examples: [["'BEGIN:VCARD\\nFN:אבי כהן\\nTEL;CELL:050-1234567\\nEND:VCARD\\n'", "r.length == 1 && r[0]['name'] == 'אבי כהן' && r[0]['phone'] == '050-1234567'"], ["'BEGIN:VCARD\\nFN:רות לוי\\nTEL:03-5551234\\nTEL:052-1112233\\nEND:VCARD\\nBEGIN:VCARD\\nFN:x\\nEND:VCARD\\n'", "r.isNotEmpty && r[0]['name'] == 'רות לוי' && r[0]['phone2'] == '052-1112233'"], ["''", "r.isEmpty"]] },
  'heb.holidayOn':      { shape: 'מועד',       demand: 'חג או צום בתאריך ISO לוח עברי שם', params: ['String'], ret: 'String?', examples: [["'2026-04-02'", "r == 'פסח'"], ["'2026-08-24'", "r == null"]] },
  'heb.holidaysAhead':  { shape: 'מועד',       demand: 'החגים הקרובים בטווח ימים מתאריך ISO רשימה iso שם', params: ['String', 'int'], ret: 'List<Map<String, dynamic>>', examples: [["'2026-09-08', 10", "r.any((h) => h['iso'] == '2026-09-12')"], ["'2026-08-20', 3", "r.isEmpty"]] },
  'heb.inputToIso':     { shape: 'מועד',       demand: 'תאריך עברי קלט יום חודש עברי שנה ⇒ ISO לועזי', params: ['int', 'String', 'int?'], ret: 'String?', examples: [["15, 'אלול', 5786", "r == '2026-08-28'"], ["15, 'זזז', 5786", "r == null"]] },
  'heb.partsOfIso':     { shape: 'מועד',       demand: 'רכיבי תאריך עברי יום חודש שנה מ ISO', params: ['String'], ret: 'Map<String, Object>', examples: [["'2026-09-08'", "(r['day'] as num) == 26 && r['month'] == 'Elul' && (r['year'] as num) == 5786"]] },
  'heb.toIsoEn':        { shape: 'מועד',       demand: 'תאריך עברי יום חודש אנגלי שנה ⇒ ISO', params: ['int', 'String', 'int'], ret: 'String?', examples: [["23, 'Av', 5786", "r == '2026-08-06'"], ["31, 'Av', 5786", "r == null"]] },
  'phone.format':       { shape: 'חיפוש',      demand: 'עיצוב טלפון ישראלי מקפים תצוגה', params: ['dynamic'], ret: 'String', examples: [["'0501234567'", "r.startsWith('050') && r.contains('-')"], ["''", "r is String"]] },
  'stat.mode':          { shape: 'חיפוש',      demand: 'הערך השכיח ביותר ברשימת מספרים mode', params: ['List<num>'], ret: 'num', examples: [["[350, 350, 400]", "r == 350"], ["[400, 350, 350]", "r == 350"], ["<num>[]", "r == 1"]] },
  'iso.monthsAgo':      { shape: 'מועד',       demand: 'כמה חודשים בין תאריך ISO להיום', params: ['String', 'String'], ret: 'int', examples: [["'2026-06-08', '2026-09-08'", "r == 3"], ["'2026-09-01', '2026-09-30'", "r == 0"], ["'2025-11-01', '2026-01-15'", "r == 2"]] },
  'a11y.clamp':         { shape: 'תצוגה',      demand: 'הצמדת ערך זום גודל טקסט לגבולות', params: ['dynamic', 'num', 'num'], ret: 'num', examples: [["1.9, 0.8, 1.6", "r == 1.6"], ["'x', 0.8, 1.6", "r == 1"], ["1.0, 0.8, 1.6", "r == 1.0"]] },
  'a11y.step':          { shape: 'תצוגה',      demand: 'צעד זום אחד למעלה למטה עיגול לעשירית', params: ['num', 'num', 'dynamic', 'dynamic'], ret: 'num', examples: [["1.0, 1, (v) => v, 0.1", "r == 1.1"], ["1.5, -1, (v) => v, 0.1", "r == 1.4"]] },
  'iso.monthDay':       { shape: 'מועד',       demand: 'יום בחודש מתאריך ISO לחיוב חודשי עד 28', params: ['String'], ret: 'num', examples: [["'2026-09-15'", "r == 15"], ["'2026-09-30'", "r == 28"], ["''", "r == 1"]] },
  'heb.gemYear':        { shape: 'מועד',       demand: 'שנה עברית בגימטריה אלפים', params: ['Object?', 'String Function(num) gem'], ret: 'String', imports: ['dart-data-maor/gematria-sockets.dart', 'dart-maor/gematria.dart'], examples: [["'5786', (n) => gem(n, gematria_U, gematria_T, gematria_H, gematria_T2)", "r == 'תשפ״ו'"]] },
  // ── הכרעה-20ב · צורך-בדיקה של השרשור: אף אטום-יחיד לא עובר את שלוש הדוגמאות (עיצוב לבד לא מזהה מציין-מקום; נרמול לבד לא מעצב) ──
  'phone.fmtSafe':      { shape: 'חיפוש',      demand: 'טלפון עיצוב מקפים תצוגה מציין-מקום אפסים ספרה חוזרת ריק נרמול', params: ['String?'], ret: 'String', examples: [["'0521234567'", "r == '052-1234567'"], ["'0000000000'", "r == ''"], ["'00972521234567'", "r == '052-1234567'"]] },
  'heb.dateFull':       { shape: 'מועד',       demand: 'תאריך עברי מלא מ ISO יום חודש שנה גימטריה', params: ['String?', 'String Function(num n) gem', 'String Function(String y) gemYear', 'Map<String, Object> Function(DateTime d) hebParts', 'List<String>'], ret: 'String', imports: ['dart-data-maor/gematria-sockets.dart', 'dart-maor/gematria.dart', 'dart-maor/gem-year.dart', 'dart-maor/heb-parts.dart', 'dart-data-maor/heb-month-he-sockets.dart'], examples: [["'2026-09-08', (n) => gem(n, gematria_U, gematria_T, gematria_H, gematria_T2), (y) => gemYear(y, (n) => gem(n, gematria_U, gematria_T, gematria_H, gematria_T2)), hebParts, hebMonthHe_monthNames", "r == 'כ״ו אלול תשפ״ו'"], ["'', (n) => gem(n, gematria_U, gematria_T, gematria_H, gematria_T2), (y) => y, hebParts, hebMonthHe_monthNames", "r == ''"]] },
};
const heTok = (s) => [...String(s).matchAll(/[֐-׿][֐-׿"'\-״]{1,}/g)].map((m) => m[0].replace(/^["'\-]+|["'\-]+$/g, '')).filter((t) => t.length >= 2);
const parts = (t) => t.split(/[-\/·]/).filter((x) => x.length >= 2).map((x) => (x.length > 3 && /^[הובלמשכ]/.test(x) ? x.slice(1) : x));
const bag = (tokens) => new Set(tokens.flatMap((t) => [t, ...parts(t)]));
// G36 · השוואת-טיפוסים, לא שמות: הקטלוג שומר חלק מהפרמטרים עם שם (`List<String> U` · `String Function(num) gem`) — השם נקלף לפני ההשוואה (לקח G35: `gem` נראה "לא קיים")
const TYPE_WORDS = /^(String|num|int|double|bool|dynamic|Object|DateTime|void|List|Map|Set|Iterable|Function)$/;
const stripName = (t) => { const m = String(t || '').trim().match(/^(.*?)\s+([A-Za-z_]\w*)$/); if (!m) return String(t || ''); return (/[>)?\]]$/.test(m[1]) || TYPE_WORDS.test(m[1])) ? m[1] : String(t || ''); };
const norm = (t) => stripName(String(t || 'dynamic')).replace(/\s+/g, '').replace(/\?$/, '');
const sigOk = (c, need) => c.argc === need.params.length && c.params.every((p, i) => { const a = norm(p), b = norm(need.params[i]); return a === b || a === 'dynamic'; }) && (norm(c.ret) === norm(need.ret) || norm(c.ret) === 'dynamic');
const agree = (c, need) => { let n = 0; c.params.forEach((p, i) => { if (norm(p) !== 'dynamic' && norm(p) === norm(need.params[i])) n++; }); if (norm(c.ret) !== 'dynamic' && norm(c.ret) === norm(need.ret)) n++; return n; };
// ── up-chain3 · «אין-יחיד ⇒ שלב כמה עד שהמטרה מושגת» (§20-ב · הכללת השרשור מ-B(A(args)) לעץ-הרכבה) ──
// אחדת-מספרים int/double/num — **רק בשכבת-העצים** (normT); sigOk/norm של היחידים לא נוגעים ⇒ אפס-רגרסיה בקבוצות-המועמדים היחידים.
const NUMT = /^(int|double|num)$/;
const normT = (t) => { const s = norm(t); return NUMT.test(s) ? 'num' : s; };
// עץ-ההרכבה מייבא אטומים באצוות — קובץ שאינו מתקמפל-לבד (‏`part`/`part of` — ספרייה שמצפה לחלק חיצוני) מרעיל אצווה שלמה
// (שגיאה בקובץ-המיובא, לא בשורת-הגוף ⇒ אין מיפוי-לתא ⇒ פר-מועמד). מסונן **רק משכבת-העצים** (לא מ-candsOf ⇒ אפס-רגרסיה ביחידים).
const STANDALONE = new Map();
const compilableStandalone = (file) => { if (STANDALONE.has(file)) return STANDALONE.get(file); let ok = false; try { ok = !/^\s*part\s+(?:of\b|['"])/m.test(fs.readFileSync(path.join(R.NEW, file), 'utf8')); } catch {} STANDALONE.set(file, ok); return ok; };
const tmatchT = (a, b) => { const x = normT(a), y = normT(b); return x === y || x === 'dynamic' || y === 'dynamic'; };
// up-fnsocket · שני סוגי-צומת נוספים: {k:'c',dart,type} = שקע-דאטה מהצורך (ליטרל, למשל שם-שדה) · {k:'f',id,file,m,args} = **שקע-פונקציה**:
//   חלקיק שנתקע לפרמטר מטיפוס-פונקציה כלמבדה `(x0..x_{m-1}) => g(x0.., <args-קבועים>)` — אותו עיקרון של שקע-ערך, על סוג-שקע נוסף (חוק-3 של המחצב).
// up-sockets · צמתים נוספים (הכרעת-בעלים "כולם במכה אחת"): {k:'t'} שקע-זמן (now מהסביבה) · {k:'h',name,type} שקע-אדם (ערך מאדם; חסר ⇒ ∅ לא 0) ·
//   {k:'w'} שקע-עולם (יומן-אפקטים מוזרק — אפקט מוכח דרך מה שנכתב בו) · {k:'g',pred,body} שומר-סף (פרדיקט שחוסם אפקט) · reuse: פרמטר פעמיים (גרף, לא עץ) ·
//   entity: שקע-סכמה (שמות-שדות מ-shape-ops.json, לא מהיד) · routine: שקע-רוטינה (מטא-דאטה לקופסה, לא מוכח בריצה).
const exprId = (v) => v.k === 'p' ? `p${v.i}` : v.k === 'c' ? v.dart : v.k === 't' ? 'now' : v.k === 'h' ? `?${v.name}` : v.k === 'w' ? 'w' : v.k === 'g' ? `if(${exprId(v.pred)}){${exprId(v.body)}}` : v.k === 'f' ? `λ${v.id}(${Array.from({ length: v.m }, (_, j) => '_').concat(v.args.map(exprId)).join(',')})` : `${v.id}(${v.args.map(exprId).join(',')})`;   // מזהה-עץ קנוני: whereList(p0,λfieldIsNull(_,'owner'))
const treeAtoms = (v) => (v.k === 'p' || v.k === 'c' || v.k === 't' || v.k === 'h' || v.k === 'w') ? [] : v.k === 'g' ? [...treeAtoms(v.pred), ...treeAtoms(v.body)] : [v, ...v.args.flatMap(treeAtoms)];
const SHAPE_OPS = (() => { try { return JSON.parse(fs.readFileSync(path.join(HERE, 'shape-ops.json'), 'utf8')).entities; } catch { return []; } })();
const schemaKeys = (entity) => { const e = SHAPE_OPS.find((x) => x.entity === entity); return e ? e.perField.map((f) => ({ dart: `'${f.field}'`, type: 'String', field: f.field })) : []; };   // שקע-סכמה
const leafKinds = (v) => v.k === 'a' || v.k === 'f' ? v.args.flatMap(leafKinds) : v.k === 'g' ? [...leafKinds(v.pred), ...leafKinds(v.body)] : [v.k];
const FNT = /^(.+?)\s+Function\((.*)\)$/;   // 'bool Function(dynamic)' ⇒ {ret:'bool', params:['dynamic']}
const parseFnT = (t) => { const m = stripName(String(t || '')).replace(/\?$/, '').trim().match(FNT); return m ? { ret: m[1].trim(), params: m[2].trim() ? m[2].split(',').map((x) => x.trim().split(/\s+/)[0]) : [] } : null; };   // stripName מקלף שם-פרמטר בלי למחוק רווחים (norm היה נותן 'boolFunction(dynamic)')
// עץ = B(A(p0..p_{n-1})) — שורש-אונרי על אטום-שצורך-את-כל-הפרמטרים-בסדר ⇒ נשמר בצורת-שרשרת-מדור (id 'B∘A', שדה chain) לתאימות-לאחור מלאה
const isLegacyChain = (root, P) => root.k === 'a' && root.args.length === 1 && root.args[0].k === 'a' && root.args[0].args.length === P.length && root.args[0].args.every((a, i) => a.k === 'p' && a.i === i);
const toCandidate = (root, P, nodes, isVoid = false) => {
  const sumArgc = treeAtoms(root).reduce((s, n) => s + n.args.filter((a) => a.k !== 'c').length, 0);
  if (root.k === 'g') return { id: exprId(root), file: treeAtoms(root)[0].file, chain: null, tree: root, argc: P.length, nodes, sumArgc, root, isVoid: true };   // ליטרל-שקע אינו ארגומנט-מחושב
  if (isLegacyChain(root, P)) { const B = root, A = root.args[0]; return { id: `${B.id}∘${A.id}`, file: A.file, chain: [{ id: A.id, file: A.file }, { id: B.id, file: B.file }], tree: null, nodes, sumArgc, root }; }
  return { id: exprId(root), file: treeAtoms(root)[0].file, chain: null, tree: root, argc: P.length, nodes, sumArgc, root, isVoid };
};
// מונה עצים בעלי בדיוק exactNodes צמתים-אטום, שצורכים את **כל** פרמטרי-הצורך פעם-אחת-משמאל-לימין ומחזירים את טיפוס-ההחזרה — מועמדות-לפי-טיפוס בלבד (בלי מילים)
function enumTrees(pureRows, need, exactNodes, cap, partial = false) {   // partial: מותר לצרוך תת-קבוצה של הפרמטרים (לשומר-סף: pred+body יחד מכסים)
  const P = need.params, T = need.ret; const isVoid = normT(T) === 'void';
  const usable = pureRows.filter((c) => c.argc >= 1 && normT(c.ret) !== 'void');
  const effects = pureRows.filter((c) => c.argc >= 1 && normT(c.ret) === 'void');   // שורשי-אפקט (צורך-void עם שקע-עולם)
  const byRet = new Map(); for (const c of usable) { const k = normT(c.ret); if (!byRet.has(k)) byRet.set(k, []); byRet.get(k).push(c); }
  const atomsByRet = (want) => { const w = normT(want); return w === 'dynamic' ? usable : (byRet.get(w) || []).concat(byRet.get('dynamic') || []); };
  const results = []; const seen = new Set(); let overflow = false;
  const CONSTS = [...(need.consts || []).map((c) => typeof c === 'string' ? { dart: c, type: /^'/.test(c) ? 'String' : /^-?\d/.test(c) ? 'num' : /^(true|false)$/.test(c) ? 'bool' : 'dynamic' } : c), ...(need.entity ? schemaKeys(need.entity) : [])];   // שקע-סכמה: שמות-השדות של הישות
  // שקע-פונקציה: want='R Function(A..)' ⇒ כל חלקיק g עם ret~R ו-m הפרמטרים הראשונים ~A..; השאר (אם יש) נקשרים משקעי-הדאטה של הצורך לפי טיפוס. צומת אחד.
  function* innerPlugs(want) {   // תקע-מקונן: חלקיק שכל פרמטריו הם פרמטרי-הלמבדה (m) — ללא ליטרלים, ללא קינון-נוסף
    const ft = parseFnT(want); if (!ft) return;
    for (const g of usable) { const m = ft.params.length; if (g.argc !== m || !tmatchT(g.ret, ft.ret)) continue; if (!ft.params.every((t, j) => tmatchT(g.params[j], t))) continue; yield { k: 'f', id: g.id, file: g.file, m, args: [] }; }
  }
  function* lambdas(want) {
    const ft = parseFnT(want); if (!ft) return;
    for (const g of usable) {
      const m = ft.params.length; if (g.argc < m || !tmatchT(g.ret, ft.ret)) continue;
      if (!ft.params.every((t, j) => tmatchT(g.params[j], t))) continue;
      const rest = g.params.slice(m);
      // פרמטר-נותר מטיפוס-פונקציה ⇒ תקע-מקונן (חלקיק-יחיד, בלי המשך-קינון); אחרת ליטרל-שקע מהצורך
      const opts = rest.map((t) => parseFnT(t) ? [...innerPlugs(t)] : CONSTS.filter((c) => tmatchT(c.type, t)).map((c) => ({ k: 'c', dart: c.dart, type: c.type })));
      if (opts.some((o) => !o.length)) continue;
      const combos = opts.reduce((acc, o) => acc.flatMap((a) => o.map((c) => [...a, c])), [[]]);
      for (const args of combos) yield { k: 'f', id: g.id, file: g.file, m, args };
    }
  }
  function* gen(want, cursor, budget) {
    if (cursor < P.length && tmatchT(P[cursor], want)) yield { value: { k: 'p', i: cursor }, cursor: cursor + 1, used: 0 };
    if (need.reuse) for (let i = 0; i < cursor; i++) if (tmatchT(P[i], want)) yield { value: { k: 'p', i }, cursor, used: 0 };   // שימוש-חוזר: פרמטר שכבר נצרך (גרף)
    if (need.clock && tmatchT(need.clock.type || 'String', want)) yield { value: { k: 't' }, cursor, used: 0 };   // שקע-זמן
    for (const h of need.human || []) if (tmatchT(h.type, want)) yield { value: { k: 'h', name: h.name, type: h.type }, cursor, used: 0 };   // שקע-אדם
    if (need.world && tmatchT(need.world.type, want)) yield { value: { k: 'w' }, cursor, used: 0 };   // שקע-עולם
    if (parseFnT(want)) { if (budget >= 1) for (const f of lambdas(want)) yield { value: f, cursor, used: 1 }; return; }   // פרמטר-פונקציה: רק תקע-למבדה (לא ערך)
    if (budget >= 1) for (const C of atomsByRet(want)) yield* fill(C, 0, cursor, budget - 1, [], 0);
  }
  function* fill(C, ai, cursor, budgetRemain, acc, usedAcc) {
    if (ai === C.argc) { yield { value: { k: 'a', id: C.id, file: C.file, args: acc }, cursor, used: 1 + usedAcc }; return; }
    for (const sub of gen(C.params[ai], cursor, budgetRemain)) yield* fill(C, ai + 1, sub.cursor, budgetRemain - sub.used, [...acc, sub.value], usedAcc + sub.used);
  }
  const rootGen = isVoid ? (function* () { for (const E of effects) yield* fill(E, 0, 0, exactNodes - 1, [], 0); })() : gen(T, 0, exactNodes);   // צורך-void: השורש הוא אפקט
  for (const r of rootGen) {
    if ((!partial && r.cursor !== P.length) || r.used !== exactNodes) continue;
    const id = exprId(r.value); if (seen.has(id)) continue; seen.add(id);
    results.push(toCandidate(r.value, P, exactNodes, isVoid));
    if (results.length >= cap) { overflow = true; break; }
  }
  return { results, overflow };
}


// ══════════════════════════════════════════════════════════════════════════════
// up-values · חיפוש-מונחה-ערכים («המנוע יודע מה הוא מחפש»): synth.mjs נותן את העיקרון (חזית של ערכי-ביניים, dedup לפי ערך,
//   זכייה כשהערכים שווים לתשובה) · behavior-plan נותן עצים-רב-ארגומנטיים ואת כל השקעים · logic-proof (values) נותן את הערכים ב-Dart.
//   קדימה: כל חלקיק רץ על ערכי-הדוגמאות פעם אחת (אצווה) ⇒ ערכי-ביניים; שתי הבעות עם אותם ערכים = אותו דבר (נשארת הזולה).
//   אחורה: טיפוס-ביניים שאינו יכול להגיע לטיפוס-התשובה בצעדים שנותרו — נזרק (reach). ההוכחה = אותה ריצה. אפס מילים.
// ══════════════════════════════════════════════════════════════════════════════
const SEP = String.fromCharCode(1);
const cvOf = (d) => { const s = String(d).trim(); if (/^'.*'$/.test(s)) return s.slice(1, -1).replace(/\\'/g, "'"); if (/^-?\d+(\.\d+)?$/.test(s)) return +s; if (s === 'true') return true; if (s === 'false') return false; if (s === 'null') return null; return s; };   // ליטרל-Dart ⇒ ערך לפרשן
export function valueSearch(need, pureRows, ENV, proveFn, { maxDepth = 3, capLevel = +(process.env.BP_CAPV || 20000) } = {}) {   // up-crosslang · 4000 גזר את lengthList(whereList(p0,λ…)) ב-countNoOwner (9,781 ביטויים בעומק-2); ההערכה ברתמה-המקומפלת זולה ⇒ 20000
  const P = need.params, R = need.ret; const isVoid = normT(R) === 'void';
  const usable = pureRows.filter((c) => c.argc >= 1 && normT(c.ret) !== 'void');
  const effects = isVoid ? pureRows.filter((c) => c.argc >= 1 && normT(c.ret) === 'void') : [];
  const requiredKinds = [...(need.clock ? ['t'] : []), ...((need.human || []).length ? ['h'] : []), ...(need.world ? ['w'] : [])];   // שקעים מוצהרים ⇒ העץ המנצח חייב להשתמש בהם
  const CONSTS = [...(need.consts || []).map((c) => typeof c === 'string' ? { dart: c, type: /^'/.test(c) ? 'String' : /^-?\d/.test(c) ? 'num' : /^(true|false)$/.test(c) ? 'bool' : 'dynamic' } : c), ...(need.entity ? schemaKeys(need.entity) : [])];
  // עלים: פרמטרים · ליטרלים/סכמה · זמן · אדם · עולם
  const leaves = [...P.map((t, i) => ({ node: { k: 'p', i }, type: t, nodes: 0, cost: 0, ps: [i] })),
    ...CONSTS.map((c) => ({ node: { k: 'c', dart: c.dart, type: c.type, cv: cvOf(c.dart) }, type: c.type, nodes: 0, cost: 0, ps: [] })),
    ...(need.clock ? [{ node: { k: 't' }, type: need.clock.type || 'String', nodes: 0, cost: 0, ps: [] }] : []),
    ...(need.human || []).map((h) => ({ node: { k: 'h', name: h.name, type: h.type }, type: h.type, nodes: 0, cost: 0, ps: [] })),
    ...(need.world ? [{ node: { k: 'w' }, type: need.world.type, nodes: 0, cost: 0, ps: [] }] : [])];
  // תקעי-למבדה לפרמטר-פונקציה (שקע-פונקציה): חלקיק-יחיד + ליטרלים/תקע-מקונן לפרמטרים הנותרים
  const plugMemo = new Map(); const PLUG_CAP = +(process.env.BP_PLUGS || 1500); const PLUG_PER = 40;   // תקרה גלובלית + תקרה פר-חלקיק (שקע-סכמה: 17 מפתחות × חלקיק)
  const plugsFor = (want) => { if (plugMemo.has(want)) return plugMemo.get(want); const ft = parseFnT(want); if (!ft) return []; const out = [];
    const inner = (w2) => { const f2 = parseFnT(w2); if (!f2) return []; return usable.filter((g) => g.argc === f2.params.length && tmatchT(g.ret, f2.ret) && f2.params.every((t, j) => tmatchT(g.params[j], t))).map((g) => ({ k: 'f', id: g.id, file: g.file, m: g.argc, args: [] })); };
    for (const g of usable) { const m = ft.params.length; if (g.argc < m || !tmatchT(g.ret, ft.ret) || !ft.params.every((t, j) => tmatchT(g.params[j], t))) continue;
      const opts = g.params.slice(m).map((t) => parseFnT(t) ? inner(t) : CONSTS.filter((c) => tmatchT(c.type, t)).map((c) => ({ k: 'c', dart: c.dart, type: c.type, cv: cvOf(c.dart) })));
      if (opts.some((o) => !o.length)) continue;
      let pc = [[]]; for (const o of opts) { const nx = []; for (const a of pc) { for (const c of o.slice(0, 60)) { nx.push([...a, c]); if (nx.length >= 200) break; } if (nx.length >= 200) break; } pc = nx; }   // מכפלה חסומה — לא flatMap על מאות×מאות
      let per = 0; for (const args of pc) { out.push({ node: { k: 'f', id: g.id, file: g.file, m, args }, type: want, nodes: 1, cost: 0, ps: [] }); if (++per >= PLUG_PER) break; } if (out.length > PLUG_CAP * 4) break; }
    out.sort((a, b) => (exprId(a.node) < exprId(b.node) ? -1 : 1)); const capped = out.slice(0, PLUG_CAP); plugMemo.set(want, capped); return capped; };
  // הישג-לאחור: אילו טיפוסים מגיעים לטיפוס-התשובה ב-k צעדים (dynamic מגיע לכל דבר)
  const reach = [new Set([normT(R)])]; for (let k = 1; k <= maxDepth; k++) { const s = new Set(reach[k - 1]); for (const g of usable) if (s.has(normT(g.ret)) || s.has('dynamic')) for (const t of g.params) s.add(normT(t)); reach.push(s); }
  const canReach = (type, left) => left >= 0 && (normT(type) === 'dynamic' || reach[Math.min(left, maxDepth)].has(normT(type)) || reach[Math.min(left, maxDepth)].has('dynamic'));
  // סדר-מבני (אפס מילים): כיסוי-פרמטרים גדול קודם (הצורך חייב לצרוך את כולם) ⇒ טיפוס-שורש שמתאים לתשובה ⇒ פחות צמתים ⇒ עלות ⇒ id
  const cov = (x) => (x.ps || []).length; const hitsR = (x) => normT(x.type) === normT(R) ? 0 : tmatchT(x.type, R) ? 1 : 2;   // התאמה מדויקת לטיפוס-התשובה לפני dynamic
  const idOf = (x) => x.id || (x.id = exprId(x.node));
  const byCost = (a, b) => (cov(b) - cov(a)) || (hitsR(a) - hitsR(b)) || (a.nodes - b.nodes) || (a.cost - b.cost) || (idOf(a) < idOf(b) ? -1 : 1);
  let pool = leaves.slice(); let fresh = leaves.slice(); const seenSig = new Set(); const proof = {}; let evaluated = 0; const allCands = []; const effectExprs = [];   // effectExprs: עצי-אפקט שהוערכו (לשומר-סף)
  const hide = need.hideDart || []; const jsRows = need.crossLang === false ? [] : jsTwinRows(hide, { params: need.params, ret: need.ret });   // שקע חוצה-שפה: תאומי-JS מומרים (רק כאלה שאין להם תאום-Dart); hideDart = מצב-בדיקה
  if (hide.length) { const hs = new Set(hide); for (let i = usable.length - 1; i >= 0; i--) if (hs.has(usable[i].id)) usable.splice(i, 1); }
  const interp = buildInterp(need.__id || 'need', pureRows, need.examples, ENV, need.imports || [], jsRows);   // לקמפל פעם אחת: כל המדף + תאומי-JS + הדוגמאות + הפרשן
  const jsOk = (interp.rows || []).filter((r) => r.x === 'js'); const jsIds = new Set(jsOk.map((r) => r.id));
  usable.push(...jsOk.filter((r) => r.argc >= 1 && normT(r.ret) !== 'void'));
  const DBG0 = !!process.env.BP_DEBUG; if (DBG0) console.error('[values] interp', interp.error ? 'ERROR ' + interp.error : `compiled ${((interp.compileMs || 0) / 1000).toFixed(1)}s`);
  const DBG = !!process.env.BP_DEBUG; const dbg = (...a) => { if (DBG) console.error('[values]', ...a); };
  dbg('start', need.__id, 'usable', usable.length, 'leaves', leaves.length);
  for (let depth = 1; depth <= maxDepth; depth++) {
    const exprs = []; const roots = isVoid ? [...usable, ...effects] : usable; dbg('depth', depth, 'pool', pool.length, 'fresh', fresh.length);
    for (const g of roots) {
      const left = maxDepth - depth; if (normT(g.ret) !== 'void' && !canReach(g.ret, left) && !tmatchT(g.ret, R)) continue;
      const slots = g.params.map((t) => parseFnT(t) ? plugsFor(t) : pool.filter((x) => tmatchT(x.type, t) && x.nodes + 1 <= maxDepth).slice(0, 1000));   // pool ממוין (כיסוי⇒עלות) ⇒ 1000 הראשונים; ההערכה זולה, הדדופ-לפי-ערך עושה את העבודה
      if (slots.some((s) => !s.length)) continue;
      // צירופים: לפחות ארגומנט אחד מהשכבה הטרייה (חוץ מעומק-1), סך-צמתים ≤ maxDepth; תקרה פר-חלקיק דטרמיניסטית
      const COMBO_CAP = +(process.env.BP_COMBOS || 2000); const PROD = 20000;
      // צירופים הוגנים-לעלות: מכפלה מלאה כשקטנה, אחרת כל שקע מקבל את N הזולים כך שהמכפלה ≤ PROD; ממוינים לפי עלות-כוללת ⇒ COMBO_CAP
      let prod = slots.reduce((n, s) => n * s.length, 1); let sl = slots;
      if (prod > PROD) { const n = Math.max(2, Math.floor(Math.pow(PROD, 1 / slots.length))); sl = slots.map((s) => s.slice(0, n)); }
      let combos = [[]]; for (const s of sl) combos = combos.flatMap((a) => s.map((x) => [...a, x]));
      const ccov = (c) => new Set(c.flatMap((x) => x.ps || [])).size; const ccost = (c) => c.reduce((n, x) => n + x.cost + x.nodes, 0);
      combos.sort((a, b) => (ccov(b) - ccov(a)) || (ccost(a) - ccost(b))); if (combos.length > COMBO_CAP) combos.length = COMBO_CAP;   // כיסוי-פרמטרים קודם, אחר-כך עלות
      for (const args of combos) { const nodes = 1 + args.reduce((n, x) => n + x.nodes, 0); if (nodes > maxDepth) continue;
        if (depth > 1 && !args.some((x) => fresh.includes(x))) continue; if (depth === 1 && args.some((x) => x.nodes > 0 && x.node.k !== 'f')) continue;
        const ps = [...new Set(args.flatMap((x) => x.ps))]; const node = { k: 'a', id: g.id, file: g.file, args: args.map((x) => x.node) };
        exprs.push({ node, type: g.ret, nodes, cost: args.filter((x) => x.node.k !== 'c').length + args.reduce((n, x) => n + x.cost, 0), ps, isVoid: normT(g.ret) === 'void' });
        if (exprs.length > capLevel * 3) { exprs.sort(byCost); exprs.length = capLevel; } } }   // גיזום-ביניים (id מחושב פעם אחת): לא מחזיקים מיליוני ביטויים בזיכרון
    dbg('exprs', exprs.length); exprs.sort(byCost); const level = exprs.slice(0, capLevel); dbg('level', level.length);
    const cands = level.map((e) => ({ id: idOf(e), file: treeAtoms(e.node)[0].file, chain: null, tree: e.node, argc: P.length, nodes: e.nodes, sumArgc: e.cost, root: e.node, isVoid: e.isVoid }));
    let res = {}; if (!interp.error) { const ev = evalInterp(interp, cands.map((c) => ({ id: c.id, tree: c.tree, void: c.isVoid })), need.examples.length); if (ev.error) { if (DBG0) console.error('[values] eval error', ev.error); } else res = ev; }
    if (interp.error || !Object.keys(res).length) { const VB = 120; for (let b = 0; b < cands.length; b += VB) Object.assign(res, proveFn(`${need.__id || 'need'}__v${depth}_b${b / VB}`, cands.slice(b, b + VB), need.examples, need.imports || [], { ...ENV, values: true })); }   // נפילה-לאחור: אצוות של 120
    evaluated += cands.length; for (const [k, v] of Object.entries(res)) proof[k] = { ok: v.ok, total: v.total, unknown: v.unknown || 0 }; dbg('evaluated', cands.length, 'results', Object.keys(res).length);   // ערכי-הביניים משמשים רק לשכבה הזו (זיכרון)
    const wins = []; fresh = [];
    for (let i = 0; i < level.length; i++) { const e = level[i], r = res[cands[i].id]; if (!r) continue;
      const covers = e.ps.length === P.length;
      const usesAll = requiredKinds.every((k) => leafKinds(e.node).includes(k));
      if (r.ok === r.total && covers && usesAll && (isVoid ? e.isVoid : tmatchT(e.type, R))) {   // צורך-אפקט: רק עץ שהשורש שלו אפקט; שקע מוצהר חייב להיות בשימוש
        const jsNodes = treeAtoms(e.node).filter((n) => jsIds.has(n.id)); let parity = null;
        if (jsNodes.length) {   // שקע חוצה-שפה: שקילות-על-הדוגמאות מול ה-JS (רק כשארגומנטי-הצומת הם פרמטרים/ליטרלים — אחרת לא-מאומת ⇒ לא מנצח)
          const direct = jsNodes.length === 1 && jsNodes[0] === e.node && e.node.args.every((a) => a.k === 'p' || a.k === 'c');
          parity = direct ? jsParity(jsOk.find((q) => q.id === jsNodes[0].id), need.examples.map((ex) => ex[0]), r.vals || []) : { ok: false, checked: 0, mismatches: ['unverified: js node not at root with direct args'] };
          if (!parity.ok) { proof[cands[i].id] = { ...proof[cands[i].id], parity }; continue; }
        }
        wins.push({ ...cands[i], parity, vals: r.vals, crossLang: jsNodes.map((n) => n.id) }); }
      if ((r.unknown || 0) === r.total) continue;   // כל התאים ∅ ⇒ אין ערך חי (ok=0 עם ערכים = חי, רק לא התשובה)
      if (!r.vals || r.vals.every((v) => v === null)) continue;
      const sig = normT(e.type) + '|' + r.vals.map((v) => String(v)).join(SEP); if (seenSig.has(sig)) continue; seenSig.add(sig);   // אותם ערכים = אותו דבר; נשארת הזולה
      if (e.isVoid) { effectExprs.push({ ...e, r }); continue; } if (!canReach(e.type, maxDepth - depth - 1) && !tmatchT(e.type, R)) continue;
      const item = { ...e, sig }; pool.push(item); fresh.push(item); }
    pool.sort(byCost);
    // שומר-סף (need.guard, צורך-אפקט): pred = ערך-בול מהמאגר (הוערך) · body = עץ-אפקט שהוערך ⇒ {k:'g'} ; יחד מכסים את כל הפרמטרים; הפרשן מריץ body רק כש-pred אמת
    if (isVoid && need.guard && effectExprs.length) {
      const preds = pool.filter((x) => normT(x.type) === 'bool' && x.nodes >= 0).slice(0, 300); const bodies = effectExprs.slice().sort(byCost).slice(0, 300);
      const gs = []; for (const pr of preds) for (const bd of bodies) { const ps = [...new Set([...(pr.ps || []), ...(bd.ps || [])])]; if (ps.length !== P.length) continue; const node = { k: 'g', pred: pr.node, body: bd.node }; gs.push({ node, type: 'void', nodes: pr.nodes + bd.nodes, cost: pr.cost + bd.cost, ps, isVoid: true }); }
      gs.sort(byCost); const glevel = gs.slice(0, capLevel);
      const gc = glevel.map((e) => ({ id: idOf(e), file: treeAtoms(e.node)[0].file, chain: null, tree: e.node, argc: P.length, nodes: e.nodes, sumArgc: e.cost, root: e.node, isVoid: true }));
      if (gc.length) { const gr = interp.error ? {} : evalInterp(interp, gc.map((c) => ({ id: c.id, tree: c.tree, void: true })), need.examples.length); if (!gr.error) { evaluated += gc.length; for (const [k, v] of Object.entries(gr)) proof[k] = { ok: v.ok, total: v.total, unknown: v.unknown || 0 }; for (let i = 0; i < gc.length; i++) { const v = gr[gc[i].id]; if (v && v.ok === v.total) wins.push(gc[i]); } dbg('guards', gc.length, 'wins', wins.length); } }
    }
    if (wins.length) { wins.sort((a, b) => (a.nodes - b.nodes) || (a.sumArgc - b.sumArgc) || (a.id < b.id ? -1 : 1)); return { pick: wins[0], wins, proof, evaluated, depth, cands: wins, overflow: exprs.length > capLevel }; }   // מחזירים רק את העצים שעברו (זיכרון)
    if (!fresh.length) break;
  }
  return { pick: null, wins: [], proof, evaluated, depth: maxDepth, cands: [], overflow: false };
}

export function plan({ prove = true, needs = NEEDS, earlyExit = false, values = false } = {}) {   // values: חיפוש-מונחה-ערכים (צרכים חיצוניים); NEEDS: ללא שינוי   // earlyExit (צרכים חיצוניים): עוצרים את ההוכחה באצווה הראשונה שבה מועמד עבר-הכל (סדר דטרמיניסטי: sumArgc ⇒ id); NEEDS הקשיחים: תמיד ממצה (אפס-שינוי)   // needs: ברירת-המחדל = NEEDS הקשיח; planNeeds מזין צרכים חיצוניים על אותו מנגנון בדיוק
  const { rows, idf } = catalog();
  const out = {};
  const needsIds = Object.keys(needs);
  // מועמדים לפי חתימה — רק אטומים טהורים (אפס import; חוק-1) שניתן להריץ בבידוד
  const candsOf = (need) => rows.filter((c) => sigOk(c, need)).filter((c) => isPure(c.file));
  // הוכחה-בריצה: קובץ-מוכיח לכל צורך — כל המועמדים מיובאים עם קידומת, כל דוגמה נבדקת; פלט = "i:j:1/0"
  const proofs = {};
  // הכרעה-20ב/§20-ב · «אין-יחיד ⇒ שלב כמה»: נדלק **רק** כשאף מועמד-יחיד לא עובר. עץ-הרכבה של עד 3 צמתים, מועמדות-לפי-טיפוס בלבד
  // (בלי CHAIN_K · בלי ניקוד-מילים) — **כל** עצי-עומק-2 עוברים להוכחה-בריצה באצוות; עומק-3 רק אם עומק-2 לא הניב מעבר-מלא, בתקרה דטרמיניסטית.
  const chainsOf = {};
  const pureRows = rows.filter((c) => isPure(c.file) && compilableStandalone(c.file));   // עצים בלבד: אטומים טהורים **ומתקמפלים-לבד**
  const rowById = new Map(rows.map((r) => [r.id, r]));
  const BATCH = 120;   // אצוות-הוכחה: 120 מועמדים לקובץ-Dart כדי לא להתפוצץ בקומפילציה (המשטרה מודדת זמן בפלט)
  let ENV = {};   // up-sockets · סביבת-ההוכחה של הצורך הנוכחי: clock/human/world ⇒ המוכיח מצהיר now/<אדם>/w לכל דוגמה
  const byCost = (arr) => arr.slice().sort((a, b) => ((a.sumArgc ?? a.argc ?? 0) - (b.sumArgc ?? b.argc ?? 0)) || (a.id < b.id ? -1 : 1));
  const proveBatched = (id, cands, examples, imports) => { const out = {}; for (let i = 0; i < cands.length; i += BATCH) { Object.assign(out, proveCandidates(`${id}__b${i / BATCH}`, cands.slice(i, i + BATCH), examples, imports, ENV)); if (earlyExit && Object.values(out).some((r) => r && r.ok === r.total)) break; } return out; };
  const CAP2 = 100000, CAP3 = +(process.env.BP_CAP3 || 2000);   // BP_CAP3: תקרת-עומק-3 ניתנת-לכיוונון (מדידה), ברירת-מחדל ללא שינוי   // עומק≤2: הכל (בפועל אלפים אחרי חסם-הסדר); עומק-3: תקרה דטרמיניסטית 2000
  const fullPass = (m) => Object.values(m).some((r) => r && r.ok === r.total);
  if (prove) { for (const id of needsIds) { const need = needs[id]; if (!need.examples) continue;
      ENV = { clock: need.clock || null, human: need.human || [], world: need.world || null };
      const hideS = new Set(need.hideDart || []); const cands = candsOf(need).filter((c) => !hideS.has(c.id));   // hideDart (מצב-בדיקה של השקע חוצה-השפה) חל גם על היחידים
      if (cands.length) proofs[id] = proveBatched(id, cands, need.examples, need.imports || []);
      const pf0 = proofs[id] || {}; if (fullPass(pf0)) continue;   // יחיד עבר ⇒ אין שרשור (יחיד תמיד גובר)
      if (values) {   // up-values · חיפוש-מונחה-ערכים במקום מניית-כל-העצים (גם שומר-סף)
        const vs = valueSearch({ ...need, __id: id }, pureRows, ENV, proveCandidates);
        proofs[id] = { ...pf0, ...vs.proof };
        chainsOf[id] = { admissible: vs.evaluated, depth: vs.depth, overflow: vs.overflow, values: true, cands: Object.fromEntries(vs.cands.map((c) => [c.id, { chain: null, tree: c.tree, nodes: c.nodes, sumArgc: c.sumArgc, score: 0, parity: c.parity || null, crossLang: c.crossLang || [] }])) };
        continue;
      }
      const cap2 = need.reuse ? Math.min(CAP2, 5000) : CAP2;   // שימוש-חוזר מנפח את המרחב (כל שקע-num יכול לקבל p0) ⇒ תקרה דטרמיניסטית
      const d2 = enumTrees(pureRows, need, 2, cap2);   // כל עצי-עומק-2 הקבילים-לפי-טיפוס
      const isVoidNeed = normT(need.ret) === 'void';
      if (isVoidNeed && need.world) d2.results = [...enumTrees(pureRows, need, 1, CAP2).results, ...d2.results];   // צורך-אפקט: גם אפקט-יחיד(פרמטרים, w) הוא עץ (אין לו יחיד-בחתימה כי w אינו פרמטר)
      if (isVoidNeed && need.guard) {   // שומר-סף: pred (בול על תת-קבוצת-פרמטרים) × body (אפקט) — יחד מכסים את כל הפרמטרים; תקרה דטרמיניסטית
        const boolNeed = { ...need, ret: 'bool', world: null, guard: false };
        const preds = [...enumTrees(pureRows, boolNeed, 1, CAP2, true).results, ...enumTrees(pureRows, boolNeed, 2, CAP2, true).results].sort((a, b) => (a.sumArgc - b.sumArgc) || (a.id < b.id ? -1 : 1)).slice(0, 60);
        const bodies = [...enumTrees(pureRows, { ...need, guard: false }, 1, CAP2, true).results, ...enumTrees(pureRows, { ...need, guard: false }, 2, CAP2, true).results].sort((a, b) => (a.sumArgc - b.sumArgc) || (a.id < b.id ? -1 : 1)).slice(0, 60);
        const usedP = (root) => new Set(leafKinds(root).length ? JSON.stringify(root).match(/"k":"p","i":(\d+)/g)?.map((m) => +m.match(/\d+$/)[0]) || [] : []);
        const gs = []; for (const pr of preds) for (const bd of bodies) { const u = new Set([...usedP(pr.root), ...usedP(bd.root)]); if (u.size !== need.params.length) continue; gs.push(toCandidate({ k: 'g', pred: pr.root, body: bd.root }, need.params, pr.nodes + bd.nodes, true)); }
        d2.results = [...d2.results, ...gs];
      }
      d2.results = byCost(d2.results);   // סדר-הוכחה דטרמיניסטי: זול ⇒ יקר (earlyExit עוצר בזול-ביותר שעובר)
      let treeCands = d2.results, depthUsed = 2, overflow = d2.overflow;
      let cp = treeCands.length ? proveBatched(`${id}__d2`, treeCands, need.examples, need.imports || []) : {};
      if (!fullPass(cp)) {   // up-fnsocket · עומק-3 **מבני** קודם: שורש-אונרי מעל עץ-עומק-2 (§20-ב «שלב כמה עד שהמטרה מושגת» — מה שהושג נעטף), memo לפי טיפוס-הפרמטר
        const unary = pureRows.filter((u) => u.argc === 1 && normT(u.ret) !== 'void' && tmatchT(u.ret, need.ret) && compilableStandalone(u.file));
        const subMemo = new Map(); const wraps = []; const seenW = new Set(d2.results.map((c) => c.id));
        for (const U of unary) { const key = normT(U.params[0]); if (!subMemo.has(key)) subMemo.set(key, enumTrees(pureRows, { ...need, ret: U.params[0] }, 2, CAP2).results); for (const sub of subMemo.get(key)) { const c = toCandidate({ k: 'a', id: U.id, file: U.file, args: [sub.root] }, need.params, 3); if (!seenW.has(c.id)) { seenW.add(c.id); wraps.push(c); } } }
        const wrapsSorted = wraps.sort((a, b) => (a.sumArgc - b.sumArgc) || (a.id < b.id ? -1 : 1)).slice(0, CAP3);
        if (wrapsSorted.length) { const cw = proveBatched(`${id}__d3w`, wrapsSorted, need.examples, need.imports || []); treeCands = [...treeCands, ...wrapsSorted]; cp = { ...cp, ...cw }; depthUsed = 3; }
      }
      if (!fullPass(cp)) {   // עומק-3 רק אם עומק-2 לא הניב מעבר-מלא — תקרה דטרמיניסטית: argc-כולל עולה ⇒ id לקסיקוגרפי, עד CAP3
        const d3 = enumTrees(pureRows, need, 3, CAP3 * 8);
        const sorted = d3.results.sort((a, b) => (a.sumArgc - b.sumArgc) || (a.id < b.id ? -1 : 1)).slice(0, CAP3);
        const cp3 = sorted.length ? proveBatched(`${id}__d3`, sorted, need.examples, need.imports || []) : {};
        treeCands = [...treeCands, ...sorted]; cp = { ...cp, ...cp3 }; depthUsed = 3; overflow = overflow || d3.overflow || d3.results.length > CAP3;
      }
      proofs[id] = { ...pf0, ...cp };
      chainsOf[id] = { admissible: d2.results.length, depth: depthUsed, overflow, cands: Object.fromEntries(treeCands.map((c) => [c.id, { chain: c.chain, tree: c.tree, nodes: c.nodes, sumArgc: c.sumArgc }])) };
    }
  } else if (fs.existsSync(OUT)) { const saved = JSON.parse(fs.readFileSync(OUT, 'utf8')); for (const id of needsIds) { if (saved[id] && saved[id].proof) proofs[id] = saved[id].proof; if (saved[id] && saved[id].chains) chainsOf[id] = saved[id].chains; } }
  for (const id of needsIds) {
    const need = needs[id], P = need.params; const demand = bag(heTok(need.demand));
    const nodeScore = (c) => { let s = 0; if (!c) return 0; for (const t of c.titleTok) if (demand.has(t)) s += 2 * idf(t); for (const t of c.bodyTok) if (demand.has(t) && !c.titleTok.has(t)) s += idf(t); return s; };
    const singleScore = (c) => nodeScore(c) + agree(c, need);
    const compScore = (c) => (c.chain ? c.chain : treeAtoms(c.tree)).reduce((s, n) => s + nodeScore(rowById.get(n.id)), 0);   // ניקוד-עץ = סכום-ניקוד-הצמתים (בלי agree — כמו שרשרת-מדור); שובר-שוויון-מבני-מוחלט בלבד
    const pf = proofs[id] || {};
    const singles = candsOf(need).map((c) => ({ id: c.id, file: c.file, chain: null, tree: null, nodes: 1, sumArgc: c.argc, score: +singleScore(c).toFixed(2), exact: c.params.every((p, i) => norm(p) === norm(need.params[i])) && norm(c.ret) === norm(need.ret), proven: pf[c.id] ? pf[c.id].ok === pf[c.id].total : false, ok: pf[c.id] ? pf[c.id].ok : 0 }));
    // עצים (כולל שרשראות-מדור): יחיד-מוכח תמיד גובר; עץ נכנס רק דרך ההוכחה. תאימות-לאחור: cands שמורים ישנים = {chain,score} בלבד
    const comps = chainsOf[id] ? Object.entries(chainsOf[id].cands).map(([cid, c]) => { const nodes = c.nodes ?? (c.tree ? treeAtoms(c.tree).length : (c.chain ? c.chain.length : 1)); const sumArgc = c.sumArgc ?? (c.chain ? P.length + 1 : 0); const file = c.chain ? c.chain[0].file : (c.tree ? treeAtoms(c.tree)[0].file : null); return { parity: c.parity || null, crossLang: c.crossLang || [], id: cid, file, chain: c.chain || null, tree: c.tree || null, nodes, sumArgc, score: c.score ?? +compScore(c).toFixed(2), exact: false, proven: pf[cid] ? pf[cid].ok === pf[cid].total : false, ok: pf[cid] ? pf[cid].ok : 0 }; }) : [];
    // הכרעה (כלל-3): מוכח > (ok) > יחיד-לפני-עץ > **פחות-צמתים** > **argc-כולל קטן** > score (שובר-שוויון-מבני-מוחלט · אפס-רגרסיה) > exact > id לקסיקוגרפי
    const cands = [...singles, ...comps]
      .sort((x, y) => (y.proven - x.proven) || (y.ok - x.ok) || ((x.chain || x.tree ? 1 : 0) - (y.chain || y.tree ? 1 : 0)) || (x.nodes - y.nodes) || (x.sumArgc - y.sumArgc) || (y.score - x.score) || (x.exact === y.exact ? (x.id < y.id ? -1 : 1) : x.exact ? -1 : 1));
    const top = cands[0] || null; const ok = top && (pf.error ? top.score > 0 : top.proven);
    // שקע-ספק: מועמד שכל תאיו ok/∅ (אף כישלון) = ספק, לא כשל — מדווח, לא נבחר (§20-ג)
    const doubt = Object.entries(pf).filter(([k, v]) => v && v.unknown > 0 && v.ok + v.unknown === v.total).map(([k]) => k).slice(0, 5);
    const socketsUsed = ok && top.tree ? [...new Set(leafKinds(top.tree))].filter((k) => k !== 'p').map((k) => ({ c: 'literal', t: 'clock', h: 'human', w: 'world' })[k] || k).concat(top.tree.k === 'g' ? ['guard'] : []).concat(top.crossLang && top.crossLang.length ? ['cross-language'] : []) : [];
    out[id] = { shape: need.shape, routine: need.routine || null, doubt, sockets: socketsUsed, parity: ok && top.parity ? top.parity : null, crossLang: ok && top.crossLang ? top.crossLang : [], pick: ok ? top.id : null, file: ok ? top.file : null, chain: ok && top.chain ? top.chain : null, tree: ok && top.tree ? top.tree : null, nodes: top ? top.nodes : 0, score: top ? top.score : 0, proven: !!(top && top.proven), candidates: singles.length, chainsAdmissible: chainsOf[id] ? chainsOf[id].admissible : 0, treeDepth: chainsOf[id] ? chainsOf[id].depth : 0, treeOverflow: chainsOf[id] ? !!chainsOf[id].overflow : false, top3: cands.slice(0, 3).map((c) => `${c.id}:${c.ok}/${need.examples ? need.examples.length : 0}${c.proven ? '✓' : ''}:n${c.nodes}:a${c.sumArgc}:${c.score}`), proof: pf, chains: chainsOf[id] || null };
  }
  return out;
}
/** צרכים-חיצוניים (JSON) על אותו plan() בדיוק — בלי לגעת ב-NEEDS הקשיח וב-behavior-plan.json. משמש --needs ואת סשני-החיבור. */
export function planNeeds(needsObj, { prove = true, earlyExit = true, values = true } = {}) { return plan({ prove, needs: needsObj, earlyExit, values }); }   // צרכים חיצוניים: מונחה-ערכים כברירת-מחדל (--blind מחזיר למניית-עצים)   // צרכים חיצוניים: earlyExit כברירת-מחדל (--exhaustive מבטל)
export function readPlan() { return JSON.parse(fs.readFileSync(OUT, 'utf8')); }
/** למחולל: השם+הקובץ של הנבחר לצורך; צורך לא-פתור ⇒ זריקה (שקע-חובה ריק = פסילה, הכרעה-20ג) */
export function pick(id) { const p = readPlan()[id]; if (!p || !p.pick) throw new Error(`behavior-plan: אין אטום לצורך ${id} — פסילה (לא כותבים ביד)`); return { name: p.pick, file: p.file, chain: p.chain || null }; }

// ── «כל מנוע יכול לנוע קדימה ואחורה» · הכיוון-ההפוך (up-backward) ──
//   בהינתן f:(A…)⇒B — מי בקטלוג מקבל B ומחזיר A (או חלק מ-A): מועמדים לכיוון-ההפוך, מסוננים ב-sigOk ומוכחים-בריצה כשיש דוגמאות.
//   אותו עיקרון של combine-screens (הכיוון-ההפוך של screen-decomp) — כאן על חתימת-אטום, לא על מסך.
/** חתימת f מהקטלוג (963 אטומי-לוגיקה) */
export function forwardSigOf(atomId, rows = catalog().rows) {
  const f = rows.find((r) => r.id === atomId);
  if (!f) throw new Error(`backward: אטום ${atomId} לא נמצא בקטלוג-הלוגיקה`);
  return { id: f.id, file: f.file, params: f.params, ret: f.ret, argc: f.argc };
}
// אחדת-מספרים לכיוון-ההפוך (int/double/num מתאחדים) — ההיפוך פחות דורש-דיוק-טיפוסי מהחיפוש-קדימה (num⇐→int: cockpitDaysSince⁻¹=addDaysIso)
const numFam = (t) => (/^(int|double|num)$/.test(t) ? 'num' : t);
const normNum = (t) => numFam(norm(t));
const sigOkBack = (c, need) => c.argc === need.params.length
  && c.params.every((p, i) => { const a = normNum(p), b = normNum(need.params[i]); return a === b || a === 'dynamic' || b === 'dynamic'; })
  && (normNum(c.ret) === normNum(need.ret) || normNum(c.ret) === 'dynamic' || normNum(need.ret) === 'dynamic');
const sigExact = (c, need) => c.argc === need.params.length && c.params.every((p, i) => norm(p) === norm(need.params[i])) && norm(c.ret) === norm(need.ret);
/** הצרכים-ההפוכים: (א) strict = params=[ret], ret=param[i]; (ב) invert (§20-ב) = היפוך-פוזיציוני ששומר שאר-הפרמטרים */
export function backwardNeeds(sig) {
  const P = sig.params.slice(), B = sig.ret; const seen = new Set(); const out = [];
  const add = (n) => { const k = JSON.stringify([n.params, n.ret]); if (seen.has(k)) return; seen.add(k); out.push(n); };
  P.forEach((a, i) => add({ kind: 'strict', target: i, params: [B], ret: a }));                       // params=[ret של f], ret=params[i]
  P.forEach((a, i) => { const params = P.slice(); params[i] = B; add({ kind: 'invert', target: i, params, ret: a }); });   // פותר-עבור-A[i] בהינתן השאר+התוצאה
  return out;
}
/** חיפוש-הפוך מלא: חתימה ⇒ צרכים ⇒ סינון-קטלוג ⇒ (אופציונלי) הוכחה-בריצה */
export function backwardSearch(atomId, { examples = null, imports = [], rows = null } = {}) {
  rows = rows || catalog().rows;
  const sig = forwardSigOf(atomId, rows);
  const needs = backwardNeeds(sig);
  const byId = new Map();   // (ג) מסנן את כל הקטלוג ב-sigOk (עם אחדת-מספרים) — מועמד תואם-חתימה לאיזה מהצרכים
  for (const need of needs) for (const c of rows) { if (c.id === atomId || !sigOkBack(c, need)) continue;
    const exact = sigExact(c, need); const tag = need.kind + '#' + need.target;
    const prev = byId.get(c.id);
    if (!prev) byId.set(c.id, { id: c.id, file: c.file, params: c.params, ret: c.ret, argc: c.argc, needs: [tag], exact });
    else { if (!prev.needs.includes(tag)) prev.needs.push(tag); prev.exact = prev.exact || exact; } }
  const cands = [...byId.values()];
  // (ד) הוכחה-בריצה כשיש דוגמאות — proveCandidates מריץ ב-Dart; מועמד שאריתו≠הדוגמה לא-מתקמפל⇒0 (הריצה מכריעה, לא הדירוג)
  let proof = {};
  if (examples && examples.length) { const pure = cands.filter((c) => isPure(c.file)).map((c) => ({ id: c.id, file: c.file })); if (pure.length) proof = proveCandidates('backward__' + atomId, pure, examples, imports); }
  const total = examples ? examples.length : 0;
  const candidates = cands.map((c) => ({ id: c.id, file: c.file, exact: c.exact, proven: proof[c.id] ? proof[c.id].ok === proof[c.id].total : false, ok: proof[c.id] ? proof[c.id].ok : 0, total, needs: c.needs }))
    .sort((x, y) => (y.proven - x.proven) || (y.ok - x.ok) || (y.exact - x.exact) || (x.id < y.id ? -1 : 1));
  return { atom: atomId, forwardSig: `(${sig.params.join(', ')}) ⇒ ${sig.ret}`, file: sig.file, backwardNeed: needs.map((n) => `[${n.kind}#${n.target}] (${n.params.join(', ')}) ⇒ ${n.ret}`), backwardNeeds: needs, candidateCount: candidates.length, provenCount: candidates.filter((c) => c.proven).length, candidates };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain && process.argv.includes('--backward')) {
  const at = process.argv[process.argv.indexOf('--backward') + 1];
  if (!at || at.startsWith('--')) { console.error('usage: behavior-plan.mjs --backward <atomId> [--examples <json>] [--imports <json>]'); process.exit(2); }
  const opt = (k) => { const j = process.argv.indexOf(k); return j >= 0 ? process.argv[j + 1] : null; };
  const examples = opt('--examples') ? JSON.parse(opt('--examples')) : null;
  const imports = opt('--imports') ? JSON.parse(opt('--imports')) : [];
  console.log(JSON.stringify(backwardSearch(at, { examples, imports }), null, 1));
  process.exit(0);
}
if (isMain) {
  // --needs <path.json>: הרצת plan() על צרכים חיצוניים (אפס שינוי בברירת-המחדל · לא נוגע ב-behavior-plan.json). פלט: --out <path> או stdout.
  const ni = process.argv.indexOf('--needs');
  if (ni >= 0) {
    const needsPath = process.argv[ni + 1];
    if (!needsPath) { console.error('--needs דורש נתיב ל-JSON'); process.exit(2); }
    const needsObj = JSON.parse(fs.readFileSync(needsPath, 'utf8'));
    const P = planNeeds(needsObj, { prove: true, earlyExit: !process.argv.includes('--exhaustive'), values: !process.argv.includes('--blind') });
    const oi = process.argv.indexOf('--out');
    const json = JSON.stringify(P, null, 1) + '\n';
    if (oi >= 0 && process.argv[oi + 1]) fs.writeFileSync(process.argv[oi + 1], json); else process.stdout.write(json);
    process.exit(0);
  }
  const gate = process.argv.includes('--gate');
  const P = plan({ prove: !gate });   // --gate: בלי ריצה מחדש (התוכנית השמורה = ההוכחה); כתיבה = הוכחה-בריצה
  if (!gate) { fs.writeFileSync(OUT, JSON.stringify(P, null, 1) + '\n'); }
  const fails = [];
  for (const [id, p] of Object.entries(P)) if (!p.pick) fails.push(`צורך בלי אטום: ${id} (${p.candidates} מועמדים בחתימה)`);
  if (gate) {
    // (ב) הנבחר מיובא ונקרא בפועל · (ג) מתאמים דקים
    const GEN = R.outDir(); const files = fs.readdirSync(GEN).filter((f) => /^gen_(balagan_|app_|behaviors)/.test(f) && f.endsWith('.dart'));
    const src = Object.fromEntries(files.map((f) => [f, fs.readFileSync(path.join(GEN, f), 'utf8')]));
    const all = Object.values(src).join('\n');
    const saved = fs.existsSync(OUT) ? readPlan() : {};
    const BH = 'gen_behaviors.dart'; const bh = src[BH] || ''; if (!bh) fails.push('אין שכבת-הרכבה gen_behaviors.dart (behavior-compose)');
    for (const [id, p] of Object.entries(P)) { if (!p.pick) continue; if (!saved[id] || saved[id].pick !== p.pick) fails.push(`התוכנית השמורה ≠ הבחירה החיה: ${id} (${saved[id] && saved[id].pick} ≠ ${p.pick}) — הרץ בלי --gate`);
      for (const part of (p.chain || [{ id: p.pick, file: p.file }])) {   // הכרעה-20ב · שרשרת = כל חלק מיובא ונקרא
      const imp = new RegExp(`^import '\\.\\./${part.file.replace(/[.\/]/g, '\\$&')}'(?: as \\w+)?;`, 'm');   // G49 · קופסאות מיובאות בקידומת (as bxN)
      if (!imp.test(bh)) fails.push(`${id}: ${part.id} לא מיובא בשכבת-ההרכבה`); else if (!new RegExp(`\\b${part.id}\\(`).test(bh.replace(/^import .*$/gm, ''))) fails.push(`${id}: ${part.id} מיובא בשכבת-ההרכבה אך לא נקרא`);
      for (const [f, s] of Object.entries(src)) { if (f === BH || /^gen_app_[a-z0-9_]+\.dart$/.test(f)) continue; /* אפליקציות-הזהב ואפליקציות-הספק (app-from-sentences · app-ds) מחווטות ע"י auto-logic/wireLogic — לא דרך שכבת-ההרכבה */ if (imp.test(s)) fails.push(`${f}: מייבא חלקיק ישירות (${part.id}) — הרכבה רק ב-${BH} (ה)`); else if (new RegExp(`\\b${part.id}\\(`).test(s.replace(/^import .*$/gm, ''))) fails.push(`${f}: קורא לחלקיק ${part.id} ישירות — דרך bh* בלבד (ה)`); } } }
    // (ו) הכרעה-20ב · מנגנון-השרשור מוכח-בבייטים: צורך-הבדיקה נפתר ב**שרשרת** (לא ביחיד — אחרת הצורך אינו צורך-שרשרת והבדיקה ריקה) ושני חלקיה אטומים אמיתיים מהמדף
    { const q = P['phone.fmtSafe']; if (!q || !q.pick) fails.push('הכרעה-20ב: צורך-השרשור phone.fmtSafe לא נפתר'); else if (!q.chain) fails.push(`הכרעה-20ב: phone.fmtSafe נפתר ביחיד (${q.pick}) — הצורך אינו צורך-שרשרת, הבדיקה ריקה`); else if (!q.chain.every((x) => fs.existsSync(path.join(R.NEW, x.file)))) fails.push('הכרעה-20ב: חלק-שרשרת לא קיים במדף'); }
    // (ג) חלקיק-קיים ⇒ הפרימיטיב שלו אסור בדבק המחולל (הכרעה-20ב: מרכיבים חלקיקים, לא ממציאים מחדש)
    for (const [id, need] of Object.entries(NEEDS)) { if (!need.forbid) continue; const re = new RegExp(need.forbid); for (const [f, s] of Object.entries(src)) { const m = s.split('\n').findIndex((l) => re.test(l)); if (m >= 0) fails.push(`${f}:${m + 1}: פרימיטיב במקום החלקיק ${P[id].pick} (${id})`); } }
    // (ד) כפילות-בכניסה: אטום שנוסף ב-G34 עם חתימה זהה + ≥2 מילות-ייעוד משותפות לאטום ותיק = מימוש-מחדש
    { const { rows } = catalog(); const mine = rows.filter((r) => /G34/.test(r.title) || /G34/.test((fs.existsSync(path.join(R.NEW, r.file)) ? fs.readFileSync(path.join(R.NEW, r.file), 'utf8') : '').split('\n').slice(0, 3).join(' '))); for (const a of mine) for (const b of rows) { if (a === b || /G34/.test(b.title)) continue; if (a.argc !== b.argc || !a.params.every((p, i) => norm(p) === norm(b.params[i])) || norm(a.ret) !== norm(b.ret)) continue; const shared = [...a.titleTok].filter((t) => b.titleTok.has(t) && t.length >= 3); if (shared.length >= 2) fails.push(`כפילות-בכניסה: ${a.id} ≈ ${b.id} (חתימה זהה · ${shared.join(',')})`); } }
    // (ה) מתאמים ארוכים = חשד
    const ADAPTERS = ['balaganDayLabel', 'balaganAgo', 'balaganFmtMoney', 'balaganPlanStart', 'balaganSearchQuery', 'balaganBackupAge', 'balaganBackupDue', 'balaganOpenCount'];
    for (const [f, s] of Object.entries(src)) for (const a of ADAPTERS) { const m = s.match(new RegExp(`^[A-Za-z<>?, ]+ ${a}\\([^\\n]*`, 'm')); if (m && m[0].length > 900) fails.push(`${f}: ${a} ארוך מדי למתאם (${m[0].length} תווים) — מימוש-מחדש?`); }
  }
  const n = Object.keys(P).length, ok = Object.values(P).filter((p) => p.pick).length;
  if (fails.length) { console.log(`🔴 behavior: ${fails.length} כשלים\n  ` + fails.slice(0, 12).join('\n  ')); process.exit(1); }
  const ch = Object.values(P).filter((p) => p.chain).length;
  console.log(`✓ behavior: ${ok}/${n} צרכים ⇒ חלקיקים נבחרו-בהוכחה-בריצה (${Object.values(P).filter((p) => p.proven).length} מוכחים · ${ch} בשרשרת — הכרעה-20ב) מ-${catalog().rows.length} מנועים` + (gate ? ' · מיובאים+נקראים · מתאמים דקים' : ' · behavior-plan.json'));
}
