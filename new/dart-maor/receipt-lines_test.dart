// בדיקת-חוזה (רתמת-זהב) · receiptLines — מייבאת אך ורק את האטום-שלה (חוק-4).
// 27 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/receipt-lines.test.mjs
// (אותם קלטים→פלטים; הערכים הומרו ל-Dart). השקעים נאמנים למקור.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/receipt-lines_test.dart  ⇒ exit 0
import 'receipt-lines.dart';

// שקע-הבדיקה hebDateFull — כמקור: isNaN(new Date(iso.slice(0,10)+'T12:00:00')) ? '' : 'י"ב באב התשפ"ו'.
bool _validIso(String raw) {
  final m = RegExp(r'^(\d{4})-(\d{2})-(\d{2})').firstMatch(raw);
  if (m == null) return false;
  final mo = int.parse(m.group(2)!);
  final d = int.parse(m.group(3)!);
  return mo >= 1 && mo <= 12 && d >= 1 && d <= 31;
}

String _hebDateFull(dynamic iso) => _validIso(iso.toString()) ? 'י"ב באב התשפ"ו' : '';
String _amountInWords(dynamic amount, dynamic sym) => 'מאה ושמונים שקלים חדשים';
String _verifyCode(dynamic rid, dynamic amount, dynamic cur, dynamic date) => 'AAA-BBB';
String _hebrewLocaleDate(dynamic iso) => '1.9.2026';

int _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ ' + msg);
    _f = 1;
  }
}

void main() {
  // דוגמה 1 — קבלת-§46:
  final A = receiptLines(
    {
      'rid': 'D-0007',
      'amount': 1234,
      'date': '2026-08-05',
      'payer': 'דוד לוי',
      'forWhat': 'תרומה כללית',
      'taxReceipt': true,
      'orgName': 'מאור',
      'orgTaxId': '580123456',
      'payerId': '012345678',
      'method': 'מזומן',
      'signatory': 'הרב כהן',
      'site': 'maor.org',
      'verify': true,
    },
    _hebDateFull,
    _amountInWords,
    _verifyCode,
    _hebrewLocaleDate,
  );
  _ok(A.length == 23, '§46 אורך ' + A.length.toString() + ' ≠ 23');
  _ok(A[0] == 'מקור', '§46 [0]: ' + A[0]);
  _ok(A[1] == 'מאור', '§46 [1]: ' + A[1]);
  _ok(A[2] == 'מס׳ עמותה/מלכ"ר: 580123456', '§46 [2]: ' + A[2]);
  _ok(A[4] == 'קבלה על תרומה — לפי סעיף 46 לפקודת מס הכנסה', '§46 [4]: ' + A[4]);
  _ok(A[5] == 'קבלה מס׳: D-0007', '§46 [5]: ' + A[5]);
  _ok(A[6] == 'קוד-אימות: AAA-BBB', '§46 [6]: ' + A[6]);
  _ok(A[7] == 'תאריך: י"ב באב התשפ"ו · 5.8.2026', '§46 [7]: ' + A[7]);
  _ok(A[10] == 'ת"ז / ח"פ: 012345678', '§46 [10]: ' + A[10]);
  _ok(A[11] == 'סכום: ₪1,234', '§46 [11]: ' + A[11]);
  _ok(A[12] == 'במילים: מאה ושמונים שקלים חדשים', '§46 [12]: ' + A[12]);
  _ok(A[20] == 'הרב כהן  ______________________', '§46 [20]: ' + A[20]);
  _ok(A[22] == 'אתר: maor.org', '§46 [22]: ' + A[22]);

  // דוגמה 2 — קבלה רגילה עם סיכום-עסקה:
  final B = receiptLines(
    {
      'rid': 'R-0042',
      'amount': 400,
      'date': '2026-08-05',
      'payer': 'רות',
      'forWhat': 'כרטיסייה',
      'copy': true,
      'summary': {'totalDue': 1000, 'paidSoFar': 400, 'balance': 600, 'nextDate': '2026-09-01'},
    },
    _hebDateFull,
    _amountInWords,
    _verifyCode,
    _hebrewLocaleDate,
  );
  _ok(B.length == 12, 'רגילה אורך ' + B.length.toString() + ' ≠ 12');
  _ok(B[0] == 'העתק נאמן למקור', 'רגילה [0]: ' + B[0]);
  _ok(B[1] == 'קבלה — מאור החסד', 'רגילה [1]: ' + B[1]);
  _ok(B[2] == 'קבלה מס׳: R-0042', 'רגילה [2]: ' + B[2]);
  _ok(B[5] == 'סכום: ₪400', 'רגילה [5]: ' + B[5]);
  _ok(B[6] == '', 'רגילה [6] (בלי method): "' + B[6] + '"');
  _ok(B[8] == 'סה"כ עסקה: ₪1000 · שולם עד כה: ₪400 · יתרה: ₪600', 'רגילה [8]: ' + B[8]);
  _ok(B[9] == 'תשלום הבא: י"ב באב התשפ"ו · 1.9.2026', 'רגילה [9]: ' + B[9]);
  _ok(B[10] == '', 'רגילה [10] (בלי site): "' + B[10] + '"');
  _ok(B[11] == 'תודה על תמיכתכם', 'רגילה [11]: ' + B[11]);

  // דוגמה 3 — אישור-חנות S- בלי סימון:
  final C = receiptLines(
    {
      'rid': 'S-0003',
      'amount': 20,
      'date': '2026-08-05',
      'payer': 'משפחת כהן',
      'forWhat': 'מימוש קופון',
      'mark': false,
      'currency': '₪',
    },
    _hebDateFull,
    _amountInWords,
    _verifyCode,
    _hebrewLocaleDate,
  );
  _ok(C[0] == 'אישור תשלום — מאור החסד', 'S- [0]: ' + C[0]);
  _ok(C[1] == 'אישור מס׳: S-0003', 'S- [1]: ' + C[1]);
  _ok(C[4] == 'סכום: ₪20', 'S- [4]: ' + C[4]);
  _ok(C[C.length - 1] == 'תודה על תמיכתכם', 'S- אחרונה: ' + C[C.length - 1]);
  _ok(!C.contains('מקור'), 'S- mark:false ⇒ אין שורת-מקור');

  // דוגמה 4 — תאריך שבור:
  final D = receiptLines(
    {'rid': 'R-1', 'amount': 5, 'date': 'שטויות', 'payer': 'א', 'forWhat': 'ב'},
    _hebDateFull,
    _amountInWords,
    _verifyCode,
    _hebrewLocaleDate,
  );
  _ok(D.contains('תאריך: שטויות'),
      'תאריך-שבור: ' + D.firstWhere((l) => l.startsWith('תאריך'), orElse: () => '<none>'));

  if (_f != 0) {
    throw StateError('receipt-lines: אדום');
  }
  // ignore: avoid_print
  print('✓ receipt-lines: 27 דוגמאות-חוזה — ירוק');
}
