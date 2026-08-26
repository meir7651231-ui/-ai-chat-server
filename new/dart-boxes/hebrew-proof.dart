// 🧪 הוכחת-חוצה-שפות · hebrew (Dart) — אותם קלטים/WANT כמו new/boxes/hebrew.test.mjs.
// מדולג (מקרה תלוי-JS): (1) holidayOf(new Date('zzz')) — אין "Invalid DateTime" ב-Dart,
//   והקופסה holidayOf מקבלת DateTime לא-null (ארטיפקט-ריצה של JS). hebParts(null) כן נבדק —
//   ‏null הוא הייצוג-ב-Dart של Invalid Date (כמתועד באטום heb-parts). (2) מגן-הכרעה readFileSync
//   + עוגני-מקור — מגן-מקור-JS (חוק-מקרה תלוי-JS); ההכרעות מובטחות ב-analyze + במנוע עצמו.
import 'dart:convert';
import 'hebrew.dart' as H;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

DateTime _noon(String iso) => DateTime.parse('${iso}T12:00:00');
({int day, String month, int? year}) _q(Map m) =>
    (day: m['day'] as int, month: m['month'] as String, year: m['year'] as int?);

void main() {
  // ── גימטריה ──
  ok('gem(15)==ט״ו', H.gem(15) == 'ט״ו');
  ok('gem(16)==ט״ז', H.gem(16) == 'ט״ז');
  ok('gem(786)==תשפ״ו', H.gem(786) == 'תשפ״ו');
  ok('gem(1)==א׳', H.gem(1) == 'א׳');
  ok('gem(-3)==""', H.gem(-3) == '');
  ok('gem(0)==""', H.gem(0) == '');
  ok('gem(NaN)==""', H.gem(double.nan) == '');
  ok('gem(5786)==פ״ו', H.gem(5786) == 'פ״ו'); // אין אות למאות>900 — כמו במקור
  ok('gemYear(5786)==תשפ״ו', H.gemYear(5786) == 'תשפ״ו');
  ok("gemYear('5786')==תשפ״ו", H.gemYear('5786') == 'תשפ״ו');

  // ── דין-אדר לנרמול ──
  ok("adarNorm('Adar II')==Adar", H.adarNorm('Adar II') == 'Adar');
  ok("adarNorm('Adar I')==Adar I", H.adarNorm('Adar I') == 'Adar I');
  ok("adarNorm('Elul')==Elul", H.adarNorm('Elul') == 'Elul');

  // ── פירוק תאריך (golden jsonEncode; day,month,year) ──
  ok('hebPartsOfIso(2026-08-24)',
      jsonEncode(H.hebPartsOfIso('2026-08-24')) == '{"day":11,"month":"Elul","year":5786}');
  ok('hebPartsOfIso(2026-08-24) פגיעת-מטמון',
      jsonEncode(H.hebPartsOfIso('2026-08-24')) == '{"day":11,"month":"Elul","year":5786}');
  // תאריך שבור ⇒ חלקים בטוחים. ‏null = הייצוג-ב-Dart של Invalid Date (new Date('zzz')).
  ok('hebParts(null)==בטוח',
      jsonEncode(H.hebParts(null)) == '{"day":0,"month":"","year":0}');

  // ── תאריך מלא ──
  ok('hebDateFull(2026-08-24)', H.hebDateFull('2026-08-24') == 'י״א אלול תשפ״ו');
  ok('hebDateFull("")==""', H.hebDateFull('') == '');
  ok('hebDateFull(junk)==""', H.hebDateFull('junk') == '');

  // ── שוויון-שנתי: כלל-ל' ──
  ok('כלל-ל\' תשפ״ו נופל',
      H.hebAnnualEq((day: 30, month: 'Heshvan'), (day: 1, month: 'Kislev', year: 5786)) == true);
  ok('כלל-ל\' תשפ״ה מלא',
      H.hebAnnualEq((day: 30, month: 'Heshvan'), (day: 1, month: 'Kislev', year: 5785)) == false);

  // ── שוויון-שנתי: דין-אדר ──
  final adarB84 = H.hebPartsOfIso('2024-03-24'); // י"ד אדר-ב' תשפ"ד (מעוברת)
  ok('adarB84 golden',
      jsonEncode(adarB84) == '{"day":14,"month":"Adar II","year":5784}');
  ok('עוגן-אדר-רגיל ⇒ אדר ב\'',
      H.hebAnnualEq((day: 14, month: 'Adar'), _q(adarB84)) == true);
  ok('עוגן-אדר-א\' ⇒ לא אדר ב\'',
      H.hebAnnualEq((day: 14, month: 'Adar I'), _q(adarB84)) == false);
  ok('שנה פשוטה בולעת כל עוגן-אדר',
      H.hebAnnualEq((day: 14, month: 'Adar II'), _q(H.hebPartsOfIso('2025-03-14'))) == true);
  ok('אחד אדר והשני לא',
      H.hebAnnualEq((day: 14, month: 'Elul'), _q(adarB84)) == false);

  // ── חגים ──
  ok("HOLIDAYS['Nisan 15']==פסח", H.HOLIDAYS['Nisan 15'] == 'פסח');
  ok('HOLIDAYS.length==33', H.HOLIDAYS.length == 33);
  ok('חנוכה 2025-12-15', H.holidayOf(_noon('2025-12-15')) == 'חנוכה');
  ok('חנוכה יום-ח\' (כסלו חסר) 2023-12-15', H.holidayOf(_noon('2023-12-15')) == 'חנוכה');
  ok('ג\' טבת (כסלו מלא) ⇒ null 2025-12-23', H.holidayOf(_noon('2025-12-23')) == null);
  ok('ט\' אב בשבת ⇒ נדחה (null) 2022-08-06', H.holidayOf(_noon('2022-08-06')) == null);
  ok('תשעה באב (נדחה) 2022-08-07', H.holidayOf(_noon('2022-08-07')) == 'תשעה באב (נדחה)');
  ok('ג\' תשרי בשבת ⇒ null 2024-10-05', H.holidayOf(_noon('2024-10-05')) == null);
  ok('צום גדליה (נדחה) 2024-10-06', H.holidayOf(_noon('2024-10-06')) == 'צום גדליה (נדחה)');
  ok('תענית אסתר (מוקדם) 2013-02-21', H.holidayOf(_noon('2013-02-21')) == 'תענית אסתר (מוקדם)');
  ok('י"ג אדר בשבת ⇒ null 2013-02-23', H.holidayOf(_noon('2013-02-23')) == null);
  ok('פסח 2026-04-02', H.holidayOf(_noon('2026-04-02')) == 'פסח');
  ok('יום רגיל ⇒ null 2026-08-24', H.holidayOf(_noon('2026-08-24')) == null);
  // מדולג: holidayOf(new Date('zzz')) — אין Invalid DateTime ב-Dart; הקופסה מקבלת DateTime לא-null.

  if (fails > 0) {
    print('❌ קופסת-hebrew (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('hebrew dart proof failed');
  }
  print('✓ קופסת-hebrew (Dart): $n טענות — גימטריה · פירוק · תאריך-מלא · כלל-ל\' · '
      'דין-אדר · 33 חגים + דיני-דחייה — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
