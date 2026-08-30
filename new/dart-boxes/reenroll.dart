import '../dart-data-maor/enroll-summary-sockets.dart' as skb_enroll_summary;
import '../dart-data-maor/student-history-text-terms.dart' as td_student_history_text;
import '../dart-data-maor/reenroll-list-text-terms.dart';
// 📦 קופסת-חיבורים · reenroll — רישום-לשנה-הבאה (courses.reenroll). מחווטת 16 אטומי-Dart.
// מקבילה ל-new/boxes/reenroll.mjs · חוזה: reenroll.contract.md · מקור-האמת (L4):
// maor/src/components/courses/reenroll-lib.ts. זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart)
// מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט. קופסה מייבאת אך-ורק אטומים; קופסה לא קופסה.
//
// ── ההכרעות שחיות כאן (חיווט, לא אטום) — כמו במקור-ה-JS (reenroll.mjs) ──
// · atNoon — פרסור לצהריים-מקומי (T12:00:00) בלי היסט-UTC. שקע-שכן, לא אטום.
// · toIso — החזרה ל-ISO עם padStart(2,'0'). שקע-שכן, לא אטום.
// · findMember — סריקת families.members (המופע-הראשון זוכה); family = f.name || ''.
// · קסקדת-הכספים: paidOf ⇒ payBal ⇒ enrollSummary — סדר-ההזרקה הוא *המשמעות*, חי כאן.
import '../dart-maor/academic-year-label.dart' as ayl;
import '../dart-maor/next-year-dates.dart' as nyd;
import '../dart-maor/renew-of.dart' as ro;
import '../dart-maor/is-renewed.dart' as ir;
import '../dart-maor/enroll-summary.dart' as es;
import '../dart-maor/build-reenroll-rows.dart' as brr;
import '../dart-maor/reenroll-counts.dart' as rc;
import '../dart-maor/renew-targets.dart' as rt;
import '../dart-maor/fresh-next-year-enrollment.dart' as fnye;
import '../dart-maor/next-year-course-draft.dart' as nycd;
import '../dart-maor/student-history.dart' as sh;
import '../dart-maor/student-history-text.dart' as sht;
import '../dart-maor/reenroll-csv-rows.dart' as rcr;
import '../dart-maor/reenroll-list-text.dart' as rlt;
import '../dart-maor/pay-bal.dart' as pb;
import '../dart-maor/paid-of.dart' as po;

// ── הכרעות-הקופסה: מוסכמת-התאריכים (חיה כאן, לא בחוטים) ────────────────────────
// מקור: reenroll.mjs — atNoon פורס לצהריים-מקומי; toIso מחזיר ל-ISO מרופד.
// DateTime.parse על מחרוזת בלי אזור ⇒ מקומי, בדיוק כמו new Date('..T12:00:00') ב-JS (כלל-4).
DateTime _atNoon(String iso) => DateTime.parse('${iso}T12:00:00');
String _toIso(DateTime d) {
  final y = d.year.toString();
  final m = d.month.toString().padLeft(2, '0');
  final dd = d.day.toString().padLeft(2, '0');
  return '$y-$m-$dd';
}

// ── truthiness נאמן-JS ל-`f.name || ''` בהכרעת-findMember ──────────────────────
bool _truthy(Object? v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is String) return v.isNotEmpty;
  if (v is num) return v != 0 && !v.isNaN;
  return true;
}

// ── הכרעת-הקופסה: איתור בן/בת-משפחה (חיה כאן) ─────────────────────────────────
// מקור: reenroll.mjs findMember — סריקת families.members, המופע-הראשון זוכה,
// שם-משפחה = f.name || ''. שקע-השכן של buildReenrollRows (חוק-1 — לא נכנס לאטום).
Map<String, Object?> _findMember(Map<String, Object?> db, Object? memberId) {
  final families = (db['families'] as List).cast<Map<String, Object?>>();
  for (final f in families) {
    final members = (f['members'] as List).cast<Map<String, Object?>>();
    for (final m in members) {
      if (m['id'] == memberId) {
        final name = f['name'];
        return {'member': m, 'family': _truthy(name) ? name : ''};
      }
    }
  }
  return {'member': null, 'family': ''};
}

// ── חיווט-פנימי: קסקדת-הכספים — סדר-ההזרקה הוא המשמעות וחי כאן ──────────────────
// paidOf ⇒ payBal ⇒ enrollSummary. (paidOf: num Function(Map?) מוזרק ישירות לשני השקעים.)
num _wiredPayBal(Map<String, dynamic> e) => pb.payBal(e, po.paidOf);

// ── מתאמי-שקע לאטום buildReenrollRows (Dart קשיח-טיפוס) ───────────────────────
// renewOf מחזיר Object (e['renew'] ?? '') — השקע דורש String ⇒ מתאם מפורש.
String _renewOfStr(Map<String, Object?> e) => ro.renewOf(e) as String;

// ── ה-API הפומבי (מראה את החשיפה של reenroll-lib.ts / reenroll.mjs) ────────────

/// פסים-טהורים (אפס שקעים) — מועברים כלשונם.
Object renewOf(Map<String, dynamic> e) => ro.renewOf(e);
bool isRenewed(Map<String, dynamic> e) => ir.isRenewed(e);
Map<String, int> reenrollCounts(dynamic rows) => rc.reenrollCounts(rows);
List<Map> renewTargets(List<Map> rows) => rt.renewTargets(rows);
Map<String, Object?> freshNextYearEnrollment(
        Map<String, Object?> src, String targetCourseId, String newId, String todayIso,
        [Object? groupOverride]) =>
    fnye.freshNextYearEnrollment(src, targetCourseId, newId, todayIso, groupOverride);
String studentHistoryText(List<dynamic> entries) => sht.studentHistoryText(entries, term: (k)=>td_student_history_text.kTerms[k]!);
List<List<String>> reenrollCsvRows(List<Map<String, Object?>> rows) => rcr.reenrollCsvRows(rows);
String reenrollListText(List<Map<String, dynamic>> rows) => rlt.reenrollListText(rows, term: (k)=>kTerms[k]!);

// ── מחווטים — השקעים (atNoon/toIso/payBal/paidOf/findMember) הולחמו פנימית ──────

/// תווית שנה"ל — atNoon מוזרק פנימית.
String academicYearLabel(String startIso) => ayl.academicYearLabel(startIso, _atNoon);

/// הזזת תאריכי-חוג שנה קדימה — atNoon+toIso מוזרקים פנימית.
Map<String, String> nextYearDates(String start, String end) =>
    nyd.nextYearDates(start, end, _atNoon, _toIso);

/// סיכום-עבר פר-שיבוץ — קסקדת-הכספים (payBal⇒paidOf) הולחמה פנימית.
Map<String, dynamic> enrollSummary(Map<String, dynamic> e) =>
    es.enrollSummary(e, _wiredPayBal, po.paidOf, skb_enroll_summary.enrollSummary_T);

/// שורות מסך-הרישום — ארבעת השקעים (isRenewed·renewOf·enrollSummary·findMember) מחווטים.
List<Map<String, Object?>> buildReenrollRows(Map<String, Object?> db,
        [Map<String, Object?>? filter]) =>
    brr.buildReenrollRows(db, filter,
        isRenewed: isRenewed,
        renewOf: _renewOfStr,
        enrollSummary: enrollSummary,
        findMember: _findMember);

/// טיוטת-חוג לשנה הבאה — nextYearDates+academicYearLabel (המחווטים) מוזרקים.
Map<String, Object?> nextYearCourseDraft(Map<String, Object?> src, Object? newId) =>
    nycd.nextYearCourseDraft(
        src,
        newId,
        (start, end) => nextYearDates(start as String, end as String),
        (start) => academicYearLabel(start as String));

/// היסטוריית-תלמיד/ה — academicYearLabel+enrollSummary (המחווטים) מוזרקים.
List<Map<String, Object?>> studentHistory(Map<String, Object?> db, Object? memberId) =>
    sh.studentHistory(
        db, memberId, (start) => academicYearLabel(start as String), enrollSummary);
