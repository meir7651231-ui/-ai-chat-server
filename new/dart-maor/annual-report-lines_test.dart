// בדיקת-חוזה (רתמת-זהב) · annualReportLines — מייבאת אך ורק את האטום-שלה (חוק-4).
// 13 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/annual-report-lines.test.mjs
// (אותם קלטים→פלטים). השקעים נאמנים למקור (annualReport.ts):
//   donationsOfYear = סינון-שנה לפי date + מיון · money = (cur==='$'?'$':'₪') + amount.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/annual-report-lines_test.dart  ⇒ exit 0
import 'annual-report-lines.dart';

// שקע-הבדיקה donationsOfYear — מקביל למקור: filter(d => (d.date||'').startsWith(year+'-'))
// .sort((a,b) => a.date.localeCompare(b.date)). המיון על מחרוזות-ISO = compareTo לקסיקוגרפי.
List<dynamic> _donationsOfYear(dynamic donations, dynamic year) {
  final list = (donations as List)
      .where((d) => (((d as Map)['date']?.toString()) ?? '').startsWith(year.toString() + '-'))
      .toList();
  list.sort((a, b) =>
      (a as Map)['date'].toString().compareTo((b as Map)['date'].toString()));
  return list;
}

// שקע-הבדיקה money — (cur === '$' ? '$' : '₪') + amount.toLocaleString('he-IL').
// כל הסכומים בדוגמאות < 1000 ⇒ toString זהה-ביט ל-toLocaleString('he-IL').
String _money(dynamic amount, [dynamic cur]) =>
    (cur == '\$' ? '\$' : '₪') + amount.toString();

int _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ ' + msg);
    _f = 1;
  }
}

void main() {
  final donations = <Map<String, dynamic>>[
    {'date': '2026-03-01', 'amount': 180, 'rid': 'D-7'},
    {'date': '2026-01-15', 'amount': 100, 'cur': '\$'},
    {'date': '2025-12-31', 'amount': 999},
  ];

  final L = annualReportLines(
    {
      'orgName': 'מאור',
      'orgTaxId': '580123456',
      'supporterName': 'דוד לוי',
      'payerId': '012345678',
      'year': '2026',
      'donations': donations,
      'site': 'maor.org',
    },
    _donationsOfYear,
    _money,
  );

  _ok(L.length == 20, 'אורך ' + L.length.toString() + ' ≠ 20');
  _ok(L[0] == '=' * 46, "[0] ≠ 46 סימני '='");
  _ok(L[1] == '        דוח תרומות שנתי — שנת 2026', '[1] כותרת: ' + L[1]);
  _ok(L[5] == 'מס׳ עמותה/מלכ"ר: 580123456', '[5]: ' + L[5]);
  _ok(L[6] == 'התורם/ת: דוד לוי · ת"ז 012345678', '[6]: ' + L[6]);
  _ok(L[9] == '2026-01-15          \$100', '[9]: ' + L[9]);
  _ok(L[10] == '2026-03-01          ₪180  קבלה D-7', '[10]: ' + L[10]);
  _ok(L[12] == 'סה"כ 2 תרומות בשנת 2026', '[12]: ' + L[12]);
  _ok(L[13] == 'סה"כ בשקלים: ₪180', '[13]: ' + L[13]);
  _ok(L[14] == 'סה"כ בדולרים: \$100', '[14]: ' + L[14]);
  _ok(L[19] == 'maor.org', '[19]: ' + L[19]);

  // אפס-תרומות, בלי taxId/site:
  final E = annualReportLines(
    {'orgName': 'מאור', 'supporterName': 'רות', 'year': '2027', 'donations': donations},
    _donationsOfYear,
    _money,
  );
  _ok(E.contains('אין תרומות רשומות בשנת 2027.'), 'חסרה שורת אין-תרומות');
  _ok(!E.any((l) => l.contains('סעיף 46')), 'בלי taxId ⇒ בלי פסקת-§46');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(L.length == 20, 'assert-live guard');

  if (_f != 0) throw StateError('annual-report-lines: דוגמת-חוזה נכשלה');
  // ignore: avoid_print
  print('✓ annual-report-lines: 13 דוגמאות-חוזה — ירוק');
}
