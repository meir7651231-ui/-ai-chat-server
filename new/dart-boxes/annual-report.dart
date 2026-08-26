import '../dart-data-maor/annual-all-lines-terms.dart';
// 📦 קופסת-חיבורים · דוח-שנתי-לתורם (Dart) — מחווטת 5 אטומי-Dart. מקבילה ל-new/boxes/annual-report.mjs.
// חוזה משותף: new/boxes/annual-report.contract.md. מקור-האמת (L4): maor/src/lib/annualReport.ts
// (5 חוטים) + exportGate.ts (השער). אותם 5 חוטים, אותו סדר-הצתה (שער-לפני-DOM), אותן ברירות.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותו fixture ⇒ אותו JSON.
// אף אטום לא מייבא אטום (חוק-1/2); כל הכריכה — כולל מתאמי-טיפוס ל-Dart — חיה כאן בלבד.
import '../dart-maor/donation-years.dart' as dy;
import '../dart-maor/donations-of-year.dart' as doy;
import '../dart-maor/annual-report-lines.dart' as arl;
import '../dart-maor/annual-all-lines.dart' as aal;
import '../dart-maor/guard-export.dart' as ge;

// ── שקע-פורמט (הכרעת-הקופסה): ₪ ברירת-מחדל / $, ללא-עיגול, he-IL ──────────────
//   במקור money — עוזר פרטי ב-annualReport.ts:41-43 (לא-מיוצא ⇒ לא-אטום):
//     (cur === '$' ? '$' : '₪') + amount.toLocaleString('he-IL')
//   ‏Dart-core בלי Intl (חוק-1) ⇒ מחקים את toLocaleString('he-IL'): קיבוץ-אלפים בפסיק,
//   נקודה עשרונית, ללא-עיגול. הדומיין = סכומים שלמים ⇒ הנתיב-השלם קדוש; שבר נשמר עד 3 ספרות.
String _localeHeIL(num amount) {
  final neg = amount < 0;
  final abs = neg ? -amount : amount;
  final whole = abs.truncate();
  final digits = whole.toString();
  final sb = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) sb.write(',');
    sb.write(digits[i]);
  }
  var s = sb.toString();
  if (abs != abs.truncateToDouble()) {
    final f = (abs - whole).toStringAsFixed(3).substring(1).replaceFirst(RegExp(r'0+$'), '');
    if (f != '.') s += f;
  }
  return neg ? '-$s' : s;
}

/// money-sink: currency symbol + he-IL grouped amount. Box decision (verbatim of
/// the private `money` helper in annualReport.ts); matches the JS atom socket
/// `String Function(dynamic amount, [dynamic cur])`.
String money(dynamic amount, [dynamic cur]) =>
    (cur == '\$' ? '\$' : '₪') + _localeHeIL(amount as num);

// ── שקע-הורדה (הכרעת-הקופסה): BOM לעברית ב-Notepad + חיבור-'\n' (annualReport.ts:112) ──
const String bom = '﻿';

// ── מתאם-טיפוס: השקע donationsOfYear שהאטומים דורשים (dynamic-loose) ──────────
List<dynamic> _ofYearSocket(dynamic donations, dynamic year) =>
    doy.donationsOfYear((donations as List).cast<Map<String, dynamic>>(), year as String);

// ── החיווט: reportLines מחווט את donationsOfYear+money (זהה ל-wiredReportLines ב-JS) ──
List<String> reportLines(Map<String, dynamic> inp) =>
    arl.annualReportLines(inp, _ofYearSocket, money);

// ── החשיפה (אותו API כמו הקופסה ב-JS) ────────────────────────────────────────
List<String> years(List<Map<String, dynamic>> donations) => dy.donationYears(donations);

List<Map<String, dynamic>> ofYear(List<Map<String, dynamic>> donations, String year) =>
    doy.donationsOfYear(donations, year);

List<String> allLines(
  String orgName,
  String? orgTaxId,
  String year,
  List<Map<String, dynamic>> supporters, [
  dynamic site,
]) =>
    aal.annualAllLines(orgName, orgTaxId, year, supporters, site, _ofYearSocket, reportLines, term: (k)=>kTerms[k]!);

String reportText(List<String> lines) => bom + lines.join('\n');

// ── ההורדה: שער-הייצוא קודם (annualReport.ts:110), אז DOM מוזרק (חוק-3/6) ──────
//   io = Map של שקעי-IO (מקביל לאובייקט-ה-io ב-JS): blocked · notify · createAnchor ·
//   makeBlobUrl · revokeUrl · schedule. העוגן = Map<String,dynamic> עם 'click'/'href'/'download'.
bool downloadAnnualReport(Map<String, dynamic> req, Map<String, dynamic> io) {
  if (!ge.guardExport(io['blocked'] as bool, io['notify'] as void Function()?)) {
    return false; // 🔐 core.export כבוי בכרטיס-העובד
  }
  final a = (io['createAnchor'] as Map<String, dynamic> Function())();
  a['href'] = (io['makeBlobUrl'] as String Function(String, String))(
    reportText((req['lines'] as List).cast<String>()),
    'text/plain;charset=utf-8',
  );
  a['download'] = req['filename'];
  (a['click'] as void Function())();
  (io['schedule'] as void Function(void Function(), int))(
    () => (io['revokeUrl'] as void Function(String))(a['href'] as String),
    5000,
  );
  return true;
}
