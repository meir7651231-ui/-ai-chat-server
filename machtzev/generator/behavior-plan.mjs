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
import { proveCandidates, isPure } from './logic-proof.mjs';
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

export function plan({ prove = true } = {}) {
  const { rows, idf } = catalog();
  const out = {};
  const needsIds = Object.keys(NEEDS);
  // מועמדים לפי חתימה — רק אטומים טהורים (אפס import; חוק-1) שניתן להריץ בבידוד
  const candsOf = (need) => rows.filter((c) => sigOk(c, need)).filter((c) => isPure(c.file));
  // הוכחה-בריצה: קובץ-מוכיח לכל צורך — כל המועמדים מיובאים עם קידומת, כל דוגמה נבדקת; פלט = "i:j:1/0"
  const proofs = {};
  if (prove) { for (const id of needsIds) { const need = NEEDS[id]; const cands = candsOf(need); if (!cands.length || !need.examples) continue; proofs[id] = proveCandidates(id, cands, need.examples, need.imports || []); }
  } else if (fs.existsSync(OUT)) { const saved = JSON.parse(fs.readFileSync(OUT, 'utf8')); for (const id of needsIds) if (saved[id] && saved[id].proof) proofs[id] = saved[id].proof; }
  for (const id of needsIds) {
    const need = NEEDS[id]; const demand = bag(heTok(need.demand));
    const score = (c) => { let s = 0; for (const t of c.titleTok) if (demand.has(t)) s += 2 * idf(t); for (const t of c.bodyTok) if (demand.has(t) && !c.titleTok.has(t)) s += idf(t); return s + agree(c, need); };
    const pf = proofs[id] || {};
    const cands = candsOf(need).map((c) => ({ id: c.id, file: c.file, score: +score(c).toFixed(2), exact: c.params.every((p, i) => norm(p) === norm(need.params[i])) && norm(c.ret) === norm(need.ret), proven: pf[c.id] ? pf[c.id].ok === pf[c.id].total : false, ok: pf[c.id] ? pf[c.id].ok : 0 }))
      .sort((x, y) => (y.proven - x.proven) || (y.ok - x.ok) || (y.score - x.score) || (x.exact === y.exact ? (x.id < y.id ? -1 : 1) : x.exact ? -1 : 1));
    const top = cands[0] || null; const ok = top && (pf.error ? top.score > 0 : top.proven);
    out[id] = { shape: need.shape, pick: ok ? top.id : null, file: ok ? top.file : null, score: top ? top.score : 0, proven: !!(top && top.proven), candidates: cands.length, top3: cands.slice(0, 3).map((c) => `${c.id}:${c.ok}/${need.examples ? need.examples.length : 0}${c.proven ? '✓' : ''}:${c.score}`), proof: pf };
  }
  return out;
}
export function readPlan() { return JSON.parse(fs.readFileSync(OUT, 'utf8')); }
/** למחולל: השם+הקובץ של הנבחר לצורך; צורך לא-פתור ⇒ זריקה (שקע-חובה ריק = פסילה, הכרעה-20ג) */
export function pick(id) { const p = readPlan()[id]; if (!p || !p.pick) throw new Error(`behavior-plan: אין אטום לצורך ${id} — פסילה (לא כותבים ביד)`); return { name: p.pick, file: p.file }; }

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
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
      const imp = new RegExp(`^import '\\.\\./${p.file.replace(/[.\/]/g, '\\$&')}'(?: as \\w+)?;`, 'm');   // G49 · קופסאות מיובאות בקידומת (as bxN)
      if (!imp.test(bh)) fails.push(`${id}: ${p.pick} לא מיובא בשכבת-ההרכבה`); else if (!new RegExp(`\\b${p.pick}\\(`).test(bh.replace(/^import .*$/gm, ''))) fails.push(`${id}: ${p.pick} מיובא בשכבת-ההרכבה אך לא נקרא`);
      for (const [f, s] of Object.entries(src)) { if (f === BH || /^gen_app_[a-z0-9_]+\.dart$/.test(f)) continue; /* אפליקציות-הזהב ואפליקציות-הספק (app-from-sentences · app-ds) מחווטות ע"י auto-logic/wireLogic — לא דרך שכבת-ההרכבה */ if (imp.test(s)) fails.push(`${f}: מייבא חלקיק ישירות (${p.pick}) — הרכבה רק ב-${BH} (ה)`); else if (new RegExp(`\\b${p.pick}\\(`).test(s.replace(/^import .*$/gm, ''))) fails.push(`${f}: קורא לחלקיק ${p.pick} ישירות — דרך bh* בלבד (ה)`); } }
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
  console.log(`✓ behavior: ${ok}/${n} צרכים ⇒ חלקיקים נבחרו-בהוכחה-בריצה (${Object.values(P).filter((p) => p.proven).length} מוכחים) מ-${catalog().rows.length} מנועים` + (gate ? ' · מיובאים+נקראים · מתאמים דקים' : ' · behavior-plan.json'));
}
