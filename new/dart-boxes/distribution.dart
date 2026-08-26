import '../dart-data-maor/deliveries-csv-rows-terms.dart';
// 📦 קופסת-חיבורים · חלוקה (SHOP7, Dart) — מחווטת 12 אטומי-Dart. מקבילה ל-new/boxes/distribution.mjs.
// חוזה משותף: new/boxes/distribution.contract.md · מקור-האמת: maor/src/components/shop7/lib.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// מילון-התוויות + בוררי-השדות + קיצור-השאילתה-הריקה = ידע-קופסה (LAW חוק-5), לא אטומים.
// smartFilter = שקע-מוזרק (חוט מודול-החיפוש). מתאמי-טיפוס מגשרים על Dart קשיח-טיפוס.
import '../dart-maor/advance-status.dart' as advst;
import '../dart-maor/deliveries-of-day.dart' as dod;
import '../dart-maor/deliveries-of-volunteer.dart' as dov;
import '../dart-maor/eligible-assignments-for-day.dart' as eafd;
import '../dart-maor/day-progress.dart' as dp;
import '../dart-maor/volunteer-load-hint.dart' as vlh;
import '../dart-maor/deliveries-of-family.dart' as dof;
import '../dart-maor/pending-deliveries-today.dart' as pdt;
import '../dart-maor/delivery-list-lines.dart' as dll;
import '../dart-maor/deliveries-csv-rows.dart' as dcr;
import '../dart-maor/volunteer-route-stops.dart' as vrs;
import '../dart-maor/term-of.dart' as to;

// ── מילון-התוויות (הכרעה — חי בקופסה, verbatim מ-shop7/lib.ts:20-22) ──────────
// pickup→איסוף · enroute→בדרך · delivered→נמסר. המפה היא *המשמעות*; החוטים
// (delivery-list-lines/deliveries-csv-rows/filter) מקבלים אותה כשקע-פונקציה statusLabel.
const Map<String, String> _statusLabel = {'pickup': 'איסוף', 'enroute': 'בדרך', 'delivered': 'נמסר'};
String statusLabel(dynamic status) => status == 'pickup'
    ? _statusLabel['pickup']!
    : status == 'enroute'
        ? _statusLabel['enroute']!
        : _statusLabel['delivered']!;

// ── שקעי-סינון (הכרעה — בוררי-השדות חיים בקופסה, verbatim מ-shop7/lib.ts:149-163) ──
List<dynamic> _volTerms(dynamic v) => [v['name'], v['phone'], v['area'] ?? ''];
List<dynamic> _deliveryTerms(dynamic r) => [r['familyName'], r['volunteerName'], statusLabel(r['status'])];

// ── מתאמי-טיפוס לשקעי-האטומים (Dart קשיח-טיפוס) ──────────────────────────────
List _dodSock(Map<String, dynamic> db, String dayId) => dod.deliveriesOfDay(db, dayId);
List<dynamic> _dovSock(dynamic db, dynamic volId, dynamic dayId) =>
    dov.deliveriesOfVolunteer(db as Map<String, dynamic>, volId, dayId);
String _termOfSock(dynamic config, String key, String fallback) => to.termOf(config, key, fallback) as String;

// ── החשיפה (re-export אטומים ביט-זהה לחתימות) ────────────────────────────────
String advanceStatus(String status) => advst.advanceStatus(status);
List<dynamic> deliveriesOfDay(Map<String, dynamic> db, dynamic dayId) => dod.deliveriesOfDay(db, dayId);
List<Map<String, dynamic>> deliveriesOfVolunteer(Map<String, dynamic> db, dynamic volId, [dynamic dayId]) =>
    dov.deliveriesOfVolunteer(db, volId, dayId);
List eligibleAssignmentsForDay(Map db, dynamic dayId) => eafd.eligibleAssignmentsForDay(db, dayId);
List<Map<String, dynamic>> deliveriesOfFamily(Map<String, dynamic> db, String famId) =>
    dof.deliveriesOfFamily(db, famId);
List<Map<String, dynamic>> pendingDeliveriesToday(Map<String, dynamic> db, String todayIso) =>
    pdt.pendingDeliveriesToday(db, todayIso);
List<String> volunteerRouteStops(dynamic db, dynamic dayId, dynamic volunteerId) =>
    vrs.volunteerRouteStops(db, dayId, volunteerId);

/// מד-התקדמות ליום — deliveriesOfDay מחווט פנימית (שקע-שכן).
Map<String, int> progressOfDay(Map<String, dynamic> db, dynamic dayId) =>
    dp.dayProgress(db, dayId as String, _dodSock);

/// רמז-קיבולת למתנדב — deliveriesOfVolunteer מחווט פנימית (שקע-שכן).
Map<String, dynamic> loadHint(dynamic db, dynamic vol, dynamic dayId) =>
    vlh.volunteerLoadHint(db, vol, dayId, _dovSock);

/// שורות-תדפיס יום-חלוקה — statusLabel (מילון-הקופסה) מחווט פנימית.
List<String> listLines(List<dynamic> rows) => dll.deliveryListLines(rows.cast<Map<String, dynamic>>(), statusLabel);

/// שורות-CSV של מסירות — termOf (אטום) + statusLabel (מילון-הקופסה) מחווטים פנימית.
List<List<String>> csvRows(Map<String, dynamic> db, [dynamic config]) =>
    dcr.deliveriesCsvRows(db, config, _termOfSock, statusLabel, term: (k)=>kTerms[k]!);

/// סינון מתנדבים — smartFilter הוא שקע-מוזרק (חוט מודול-החיפוש); בורר-השדות חי בקופסה.
dynamic filterVolunteers(dynamic vols, dynamic q, Function smartFilter) {
  if ((q as String).trim().isEmpty) return vols;
  return smartFilter(q, vols, _volTerms);
}

/// סינון מסירות — smartFilter שקע-מוזרק; בורר-השדות + statusLabel חיים בקופסה.
dynamic filterDeliveries(dynamic rows, dynamic q, Function smartFilter) {
  if ((q as String).trim().isEmpty) return rows;
  return smartFilter(q, rows, _deliveryTerms);
}
