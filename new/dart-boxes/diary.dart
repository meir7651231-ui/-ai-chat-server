import '../dart-data-maor/group-label-of-terms.dart' as td_group_label_of;
import '../dart-data-maor/absence-reason-chips-terms.dart' as td_absence_reason_chips;
import '../dart-data-maor/plan-word-terms.dart';
// 📦 קופסת-חיבורים · diary (יומן-חדרים · Dart) — מחווטת אטומי-Dart בלבד.
// מקבילה זהת-ביט ל-new/boxes/diary.mjs. חוזה משותף: diary.contract.md · מקור-האמת (L4):
// maor-system/src/components/diary/lib.ts. זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart)
// מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// ⚠️ קופסה מחווטת-אטומים-בלבד (חוקי-החשמלאי): כל ההכרעות (מילון-תוויות, ברירות-מחדל,
//   העוזר-הפרטי courseOnDate, וריאנטי-היומן של planLabelOf/enrollStatusMeta) חיות כאן.
//   כל שכן-שוקע (hebParts/HOLIDAYS/sessionsOf/termOf/planWord) מוזרק לאטום כפרמטר (חוק-1/חוק-3).
//
// הערות-פורט (מקור→Dart):
//  · block-reason כולל את **דין-תשעה-באב-הנדחה** (ט' באב בשבת ⇒ הצום בי' באב ראשון) —
//    האטום block-reason.dart מיישם אותו verbatim; הקופסה רק מחווטת hebParts+HOLIDAYS.
//  · חתימות-שקע רחבות: hebParts מוקלד record ({day,month,year}) מול Map<String,Object>
//    של האטום ⇒ מתאם-טיפוס _hebPartsRec; termOf/sessionsOf/timeToMin החוזרים dynamic
//    עטופים למתאמים מוקלדים לחתימות-הסוקטים של האטומים.
import '../dart-maor/fmt-date.dart' as fd;
import '../dart-maor/iso-local.dart' as il;
import '../dart-maor/iso-today.dart' as it;
import '../dart-maor/week-day-names.dart' as wdn;
import '../dart-maor/pad2.dart' as p2;
import '../dart-maor/time-to-min.dart' as ttm;
import '../dart-maor/min-to-hm.dart' as mh;
import '../dart-maor/group-label-of.dart' as glo;
import '../dart-maor/absence-reason-chips.dart' as arc;
import '../dart-maor/makeup-eligibility.dart' as me;
import '../dart-maor/block-reason.dart' as br;
import '../dart-maor/build-slots.dart' as bs;
import '../dart-maor/enrollments-for-session.dart' as efs;
import '../dart-maor/weekly-room-sessions.dart' as wrs;
import '../dart-maor/inactive-room-courses.dart' as irc;
import '../dart-maor/chip-style.dart' as cs;
import '../dart-maor/room-info-label.dart' as ril;
// שכני-החיווט (מוזרקים לאטומים כשקע — חוק-1):
import '../dart-maor/heb-parts.dart' as hp;
import '../dart-maor/holidays.dart' as hd;
import '../dart-maor/sessions-of.dart' as so;
import '../dart-maor/term-of.dart' as tof;
import '../dart-maor/plan-word.dart' as pw;

// ── מתאמי-שקע (חוק-1): החתימות הרחבות של האטומים מגושרות לחתימות-הסוקטים ──
// hebParts מוקלד record לחתימת block-reason (Map<String,Object>⇒{day,month,year}).
({int day, String month, int year}) _hebPartsRec(DateTime d) {
  final m = hp.hebParts(d);
  return (day: m['day'] as int, month: m['month'] as String, year: m['year'] as int);
}

// termOf(dynamic)→dynamic ⇒ String לחתימת-הסוקטים (build-slots · inactive-room-courses).
String _termOf(dynamic cfg, dynamic key, dynamic fb) => tof.termOf(cfg, key, fb) as String;

// sessionsOf(dynamic)→dynamic ⇒ List לחתימת-הסוקטים (build-slots · weekly-room · enrollments).
List<dynamic> _sessionsOf(dynamic c) => so.sessionsOf(c) as List;

// timeToMin(dynamic)→dynamic ⇒ num לחתימת build-slots (NaN=double.nan עדיין num).
num _timeToMinSock(dynamic t) => ttm.timeToMin(t) as num;

// minToHM(int) → String Function(dynamic) לחתימת build-slots (t=num בתחום שלמי-הדקות).
String _minToHMSlot(dynamic min) => mh.minToHM((min as num).toInt(), p2.pad2);

// העוזר-הפרטי courseOnDate (מקור: lib.ts:130-132) — טווח-פעילות חוג בתאריך.
// חי כאן כי הוא חיווט-פנימי של buildSlots, לא אטום-חשוף. JS `||`/השוואת-מחרוזת:
bool _falsy(dynamic v) =>
    v == null || v == false || v == 0 || v == '' || (v is num && v.isNaN);
bool _courseOnDate(dynamic c, dynamic iso) {
  final start = (c as Map)['start'];
  final end = c['end'];
  final startOk = _falsy(start) || (iso as String).compareTo(start as String) >= 0;
  final endOk = _falsy(end) || (iso as String).compareTo(end as String) <= 0;
  return startOk && endOk;
}

// ── חוטים טהורים — חשיפה ישירה (אפס שקע) ──
String fmtDate(String? iso) => fd.fmtDate(iso);
List<String> get DAY_NAMES => wdn.dayNames; // ignore: non_constant_identifier_names
String pad2(dynamic n) => p2.pad2(n);
dynamic timeToMin(dynamic t) => ttm.timeToMin(t);
String groupLabelOf(dynamic ss, int i) => glo.groupLabelOf(ss as Map, i, term: (k)=>td_group_label_of.kTerms[k]!);
List<String> get ABSENCE_REASON_CHIPS => arc.absenceReasonChips(term: (k)=>td_absence_reason_chips.kTerms[k]!); // ignore: non_constant_identifier_names
Map<String, bool> makeupEligibility(String kind, bool justified, num? rawHrs) =>
    me.makeupEligibility(kind, justified, rawHrs);
Map<String, dynamic> chipStyle(String bg, String c) => cs.chipStyle(bg, c);
String roomInfoLabel(dynamic room) => ril.roomInfoLabel(room);

// ── חיווט-פנימי: שכן-שוקע (חוק-1) ──
String localIso(DateTime d) => il.isoLocal(d); // diary localIso(d) ≡ isoLocal(d)
String isoToday([DateTime? now]) => it.isoToday(il.isoLocal, now);
String minToHM(int min) => mh.minToHM(min, p2.pad2);
String? blockReason(DateTime d, [bool blockingOn = true]) =>
    br.blockReason(d, _hebPartsRec, hd.HOLIDAYS, blockingOn);
num weeklyRoomSessions(Map<String, dynamic> db, dynamic roomId, String iso) =>
    wrs.weeklyRoomSessions(db, roomId, iso, _sessionsOf);
List<Map<String, dynamic>> inactiveRoomCourses(
        Map<String, dynamic> db, String iso, dynamic config) =>
    irc.inactiveRoomCourses(db, iso, config, _termOf);
List<Map<String, dynamic>> enrollmentsForSession(
        Map<String, dynamic> db, Map<String, dynamic> c, int sessionIndex) =>
    efs.enrollmentsForSession(db, c, sessionIndex, _sessionsOf, groupLabelOf);

// ── הכרעת-קופסה: buildSlots — חמשת השכנים מוזרקים כשקעים (מקור: lib.ts:139-227) ──
List<Map<String, dynamic>> buildSlots(Map<String, dynamic> db, Map<String, dynamic> room,
        String iso, dynamic blocked, Map<String, dynamic> config,
        [bool cleaningOn = true]) =>
    bs.buildSlots(db, room, iso, blocked, config, _timeToMinSock, _minToHMSlot,
        _sessionsOf, _courseOnDate, _termOf, cleaningOn);

// ── הכרעת-קופסה: וריאנט-היומן של planLabelOf (מקור: lib.ts:261-266) ──
// שונה מוריאנט-הקורסים (atom plan-label-of): יתרת-כרטיסייה purchased-used, בלי status/חוב.
String planLabelOf(Map<String, dynamic> e) {
  if (e['plan'] == 'punch') {
    final rem = (e['purchased'] as num) - (e['used'] as num); // Math.max(0, purchased-used)
    final bal = rem < 0 ? 0 : rem;
    return 'כרטיסייה · יתרה $bal/${e['purchased']}';
  }
  return pw.planWord(e['plan'] as String, term: (k)=>kTerms[k]!);
}

// ── הכרעת-קופסה: וריאנט-היומן של enrollStatusMeta (מקור: lib.ts:268-275) ──
// מילון-תוויות; ברירת-מחדל **null** (שונה מוריאנט-הקורסים שמחזיר {label:'פעיל'…}).
Map<String, String>? enrollStatusMeta(Map<String, dynamic> e) {
  if (e['status'] == 'paused') return {'label': 'מוקפא', 'bg': '#fdf1d4', 'c': '#9a6414'};
  if (e['status'] == 'ended') return {'label': 'הסתיים', 'bg': '#eceae2', 'c': '#8b8474'};
  if (e['status'] == 'wait') return {'label': 'רשימת-המתנה ⏳', 'bg': '#e7edf5', 'c': '#3a5a86'};
  return null;
}
