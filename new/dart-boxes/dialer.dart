import '../dart-data-maor/campaign-csv-rows-terms.dart';
// 📦 קופסת-חיבורים · dialer (Dart) — מחווטת 14 אטומי-Dart. מקבילה ל-new/boxes/dialer.mjs.
// חוזה משותף: new/boxes/dialer.contract.md. מקור-האמת: maor/src/lib/dialer.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// זה המקום היחיד שבו 14 החוטים נפגשים (חוק-החשמלאי, LAW.md): קבועי-השכן
// (REQUEUE_OUTCOMES/OUTCOME_LABELS/CALL_LOG_CAP) + השכן currentId מחווטים כאן,
// ושקעי-ה-IO (iso/nameOf) נשארים פרמטרים-מוזרקים של הצרכן — בדיוק כמו ב-JS.
import '../dart-maor/requeue-outcomes.dart' as ro;
import '../dart-maor/terminal-outcomes.dart' as to_;
import '../dart-maor/outcome-labels.dart' as ol;
import '../dart-maor/start-campaign.dart' as sca;
import '../dart-maor/current-id.dart' as ci;
import '../dart-maor/apply-outcome.dart' as ao;
import '../dart-maor/progress.dart' as pr;
import '../dart-maor/is-done.dart' as idn;
import '../dart-maor/undo-last.dart' as ul;
import '../dart-maor/call-log-cap.dart' as clc;
import '../dart-maor/append-call.dart' as ac;
import '../dart-maor/pop-call.dart' as pc;
import '../dart-maor/call-stats.dart' as cs;
import '../dart-maor/campaign-csv-rows.dart' as ccr;

// ── חשיפת-הקבועים (חלק מפני-המודול במקור; getterי-האטום ⇒ שדות-קופסה) ─────────
final List<String> REQUEUE_OUTCOMES = ro.requeueOutcomes; // ignore: non_constant_identifier_names
final List<String> TERMINAL_OUTCOMES = to_.terminalOutcomes; // ignore: non_constant_identifier_names
final Map<String, String> OUTCOME_LABELS = ol.outcomeLabels; // ignore: non_constant_identifier_names
const int CALL_LOG_CAP = clc.CALL_LOG_CAP; // ignore: constant_identifier_names

// ── החיווט (ההכרעות החיות בקופסה) ─────────────────────────────────────────────
// קבועי-השכן מוזרקים כאן — הצרכן לא רואה אותם. שקעי-IO (iso/nameOf) נשארים.
// מתאמי-טיפוס: Dart קשיח-טיפוס מול ה-JS הגמיש — החתימות מיישרות את פערי-הייצוג.

/// פתיחת קמפיין-חיוג — דדופ+סינון-falsy, הסדר נשמר. iso = שקע-IO מוזרק.
Map startCampaign(dynamic name, dynamic ids, dynamic iso) =>
    sca.startCampaign(name, ids, iso) as Map;

/// חזית תור-הקמפיין או null.
Object? currentId(Map c) => ci.currentId(c);

/// החלת תוצאת-שיחה — currentId+REQUEUE_OUTCOMES מחווטים; iso/note = שקעי-הצרכן.
Map applyOutcome(Map c, Object? outcome, String? note, Object? iso) =>
    ao.applyOutcome(c, outcome, note, iso, ci.currentId, REQUEUE_OUTCOMES);

/// מדד-התקדמות — REQUEUE_OUTCOMES מחווט.
Map<String, dynamic> progress(Map c) => pr.progress(c, REQUEUE_OUTCOMES);

/// האם הקמפיין הסתיים (תור ריק).
bool isDone(Map c) => idn.isDone(c);

/// ביטול הסיווג-האחרון — REQUEUE_OUTCOMES מחווט.
dynamic undoLast(dynamic c) => ul.undoLast(c, REQUEUE_OUTCOMES);

/// הוספת רישום-שיחה ליומן-טבעת — CALL_LOG_CAP מחווט; iso = שקע-הצרכן.
List<Map<String, String>>? appendCall(
        List<Map<String, String>>? calls, String outcome, String iso) =>
    ac.appendCall(calls, outcome, iso, CALL_LOG_CAP);

/// הסרת הרישום-האחרון מיומן-השיחות.
dynamic popCall(dynamic calls) => pc.popCall(calls);

/// סיכום יומן-שיחות (סה"כ · אחרון · לא-ענה).
Map<String, dynamic> callStats(dynamic calls) => cs.callStats(calls);

/// שורות-CSV לסיכום קמפיין — OUTCOME_LABELS מחווט; nameOf = שקע-הצרכן.
List<List<String>> campaignCsvRows(
        Map<String, dynamic> c, String Function(dynamic) nameOf) =>
    ccr.campaignCsvRows(c, nameOf, OUTCOME_LABELS, term: (k)=>kTerms[k]!);
