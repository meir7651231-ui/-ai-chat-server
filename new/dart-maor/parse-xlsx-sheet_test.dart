// 🏅 רתמת-זהב · parseXlsxSheet — 7 דוגמאות-החוזה של בדיקת-ה-JS, ביט-אחר-ביט.
// אם עובר (exit 0) ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts parse-xlsx-sheet_test.dart
import 'parse-xlsx-sheet.dart';

// ── שקעים: unzipSync/strFromU8 סטאבים (מגישים XML מוכן); השאר כחוזיהם ──
Map<String, dynamic> unzipSync(dynamic bytes) {
  if (bytes == 'BAD') throw Exception('not a zip');
  return (bytes as Map).cast<String, dynamic>(); // ה"בתים" בבדיקה = מפת-הקבצים עצמה
}

String strFromU8(dynamic s) => s as String; // הקבצים כבר מחרוזות

String unescapeXml(String s) => s
    .replaceAllMapped(RegExp(r'&#x([0-9a-fA-F]+);'),
        (m) => String.fromCharCode(int.parse(m.group(1)!, radix: 16)))
    .replaceAllMapped(
        RegExp(r'&#(\d+);'), (m) => String.fromCharCode(int.parse(m.group(1)!)))
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');

List<String> readSharedStrings(String xml) {
  final out = <String>[];
  final siRe = RegExp(r'<si>([\s\S]*?)</si>');
  for (final m in siRe.allMatches(xml)) {
    final tRe = RegExp(r'<t[^>]*>([\s\S]*?)</t>');
    var s = '';
    for (final t in tRe.allMatches(m.group(1)!)) {
      s += t.group(1)!;
    }
    out.add(unescapeXml(s));
  }
  return out;
}

int colRefToIndex(String ref) {
  final m = RegExp(r'^([A-Z]+)').firstMatch(ref);
  if (m == null) return 0;
  var n = 0;
  for (final ch in m.group(1)!.codeUnits) {
    n = n * 26 + (ch - 64);
  }
  return n - 1;
}

List<List<String>> parse(dynamic bytes) => parseXlsxSheet(
    bytes, unzipSync, strFromU8, readSharedStrings, colRefToIndex, unescapeXml);

final files = <String, dynamic>{
  'xl/sharedStrings.xml': '<sst><si><t>שם</t></si></sst>',
  'xl/worksheets/sheet1.xml': '<worksheet><sheetData>'
      '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="C1" t="inlineStr"><is><t>אבי</t><t> כהן</t></is></c></row>'
      '<row r="2"><c r="A2"><v>42</v></c><c r="B2"><v>a &amp; b</v></c></row>'
      '</sheetData></worksheet>',
  'xl/worksheets/sheet2.xml':
      '<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>גיליון-שני</t></is></c></row></sheetData></worksheet>',
};

void main() {
  // 1: unzip נכשל ⇒ []
  assert(parse('BAD').length == 0, '✗ 1 נכשל-רך');
  // 2: אין גיליון ⇒ []
  assert(parse(<String, dynamic>{'xl/sharedStrings.xml': '<sst/>'}).length == 0,
      '✗ 2 אין-גיליון');
  final rows = parse(files);
  // 3: shared string
  assert(rows[0][0] == 'שם', '✗ 3 sharedStrings');
  // 4: inlineStr משורשר
  assert(rows[0][2] == 'אבי כהן', '✗ 4 inlineStr');
  // 5: ריפוד-פער לפי r="C1"
  assert(rows[0].length == 3 && rows[0][1] == '', '✗ 5 ריפוד');
  // 6: sheet1 נבחר (לא 'גיליון-שני')
  assert(!rows.any((r) => r.contains('גיליון-שני')), '✗ 6 בחירת-גיליון');
  // 7: ערך גולמי כמחרוזת + unescape
  assert(rows[1][0] == '42' && rows[1][1] == 'a & b', '✗ 7 גולמי/unescape');
  print('✓ parse-xlsx-sheet (Dart): 7 דוגמאות-חוזה — ירוק');
}
