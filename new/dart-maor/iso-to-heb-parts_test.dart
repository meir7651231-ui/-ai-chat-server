// 🥇 רתמת-זהב · isoToHebParts — Dart≡JS. דוגמאות-החוזה בדיוק מ-new/atoms/iso-to-heb-parts.test.mjs.
// אותם קלטים→פלטים. השקעים = stub שמחזיר בדיוק מה ש-Intl('en-u-ca-hebrew') החזיר במקור
// (כלל-פורט 11: לוח-עברי הוא שקע — לא ממומש-מחדש; הזרקה זהה בשתי השפות ⇒ אימות-לוגיקת-האטום).
// הרצה: dart run --enable-asserts new/dart-maor/iso-to-heb-parts_test.dart ⇒ exit 0.
import 'iso-to-heb-parts.dart';

String _p2(int n) => n.toString().padLeft(2, '0');

// שקע hebParts — טבלת-האמת של Intl לתאריכי-החוזה (זהה לפלט הבדיקה ב-JS).
Map<String, dynamic> hebParts(DateTime d) {
  final key = '${d.year.toString().padLeft(4, '0')}-${_p2(d.month)}-${_p2(d.day)}';
  const table = {
    '2026-08-06': {'day': 23, 'month': 'Av', 'year': 5786},
    '2026-09-12': {'day': 1, 'month': 'Tishri', 'year': 5787}, // ראש-השנה
    '2025-03-14': {'day': 14, 'month': 'Adar', 'year': 5785},
  };
  final v = table[key];
  if (v == null) return {'day': 0, 'month': '', 'year': 0};
  return Map<String, dynamic>.from(v);
}

const _HE = {
  'Tishri': 'תשרי', 'Heshvan': 'חשוון', 'Kislev': 'כסלו', 'Tevet': 'טבת',
  'Shevat': 'שבט', 'Adar': 'אדר', 'Adar I': 'אדר א׳', 'Adar II': 'אדר ב׳',
  'Nisan': 'ניסן', 'Iyar': 'אייר', 'Sivan': 'סיוון', 'Tamuz': 'תמוז',
  'Av': 'אב', 'Elul': 'אלול',
};
String monthHeOf(String en) => _HE[en] ?? '';

bool _eq(Map<String, dynamic>? g, Map<String, dynamic>? w) {
  if (g == null || w == null) return g == null && w == null;
  return g['day'] == w['day'] && g['monthHe'] == w['monthHe'] && g['year'] == w['year'];
}

void main() {
  final cases = <List<dynamic>>[
    ['2026-08-06', {'day': 23, 'monthHe': 'אב', 'year': 5786}],
    ['2026-09-12', {'day': 1, 'monthHe': 'תשרי', 'year': 5787}], // ראש-השנה
    ['2025-03-14', {'day': 14, 'monthHe': 'אדר', 'year': 5785}],
    ['שטויות', null],
    ['2026-8-6', null], // בלי ריפוד — נכשל ב-regex
    ['9999-99-99', null], // עובר-regex אך תאריך לא-חוקי
  ];
  for (final c in cases) {
    final a = c[0] as String;
    final w = c[1] as Map<String, dynamic>?;
    final g = isoToHebParts(a, hebParts, monthHeOf);
    assert(_eq(g, w), '✗ $a ⇒ $g ≠ $w');
  }
  // חודש שהשקע לא מכיר (monthHeOf ⇒ '') ⇒ null
  assert(isoToHebParts('2026-08-06', hebParts, (_) => '') == null,
      '✗ חודש-לא-מוכר — ציפינו null');

  print('✓ iso-to-heb-parts (Dart): 7 דוגמאות-חוזה — ירוק');
}
