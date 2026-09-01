// 📦 קופסת-חיבורים · worktasks (Dart) — מחווטת 7 אטומי-Dart. מקבילה ל-new/boxes/worktasks.mjs.
// חוזה משותף: worktasks.contract.md · מקור-האמת: maor/src/lib/worktasks.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// החיווט (איזה-שכן מוזרק לכל חוט) חי כאן verbatim מהקופסה-שלה — לא באטומים (חוקי-החשמלאי).
// האטומים טהורים ומזריקים את שכניהם כשקעים; הקופסה בלבד מחליטה מי-שכן.
import '../dart-data-maor/task-identity-sockets.dart' as skb_ti;
import '../dart-data-maor/overdue-contact-task-drafts-sockets.dart' as skb_octd;
import '../dart-maor/task-identity.dart' as ti;
import '../dart-maor/open-tasks-for.dart' as otf;
import '../dart-maor/done-today-for.dart' as dtf;
import '../dart-maor/task-overdue.dart' as tov;
import '../dart-maor/task-stats-for.dart' as tsf;
import '../dart-maor/overdue-contact-task-drafts.dart' as octd;
import '../dart-maor/pri-labels.dart' as pl;

// ── שקעי-IO (מוזרקים בזמן-קריאה, לא ממומשים בקופסה) ──
//   todayIso : YYYY-MM-DD של "היום" — בא מלוח-האם (isoToday), לא Date.now.

// ── מתאמי-טיפוס לשקעים (Dart קשיח-טיפוס) ─────────────────────────────────────
// taskIdentity ב-Dart הוא `String Function(dynamic)`; done-today ו-contact-drafts
// מצפים ל-`String Function(Object?)` — מתאם דק מיישר את חתימת-השקע. open-tasks
// מקבל את `ti.taskIdentity` כלשונו (חתימת-dynamic זהה).
String _idObj(Object? e) => ti.taskIdentity(e, skb_ti.taskIdentity_T);

// ── החיווט (איזה-שכן מוזרק לכל חוט; זו *המשמעות*, והיא חיה כאן) ──
//   openTasksFor             ← taskIdentity
//   doneTodayFor             ← taskIdentity
//   taskStatsFor             ← taskIdentity · taskOverdue
//   overdueContactTaskDrafts ← taskIdentity

// ── ה-API הפומבי (ביט-זהה לחתימות worktasks.mjs) ─────────────────────────────
String identityOf(dynamic email) => ti.taskIdentity(email, skb_ti.taskIdentity_T);

List<Map<String, dynamic>> openTasks(List<Map<String, dynamic>> tasks, dynamic identity) =>
    otf.openTasksFor(tasks, identity, (e) => ti.taskIdentity(e, skb_ti.taskIdentity_T));

int doneToday(List<Map<String, dynamic>> tasks, dynamic identity, String todayIso) =>
    dtf.doneTodayFor(tasks, identity, todayIso, _idObj);

bool isOverdue(dynamic t, dynamic todayIso) => tov.taskOverdue(t, todayIso);

Map<String, dynamic> stats(dynamic tasks, dynamic identity, dynamic todayIso) =>
    (tsf.taskStatsFor(tasks, identity, todayIso, (e) => ti.taskIdentity(e, skb_ti.taskIdentity_T), tov.taskOverdue) as Map)
        .cast<String, dynamic>();

List<Map<String, dynamic>> contactDrafts(
  List<Map<String, dynamic>> supporters,
  List<Map<String, dynamic>> existing,
  dynamic assignee,
  String todayIso,
) =>
    octd.overdueContactTaskDrafts(supporters, existing, assignee, todayIso, _idObj, skb_octd.overdueContactTaskDrafts_T);

// תווית-עדיפות לתצוגה (מילון-הקופסה — נחשף כלשונו מהאטום-הקבוע).
// JS: `PRI_LABELS[pri]` — מפתחות-אובייקט הם מחרוזות, מספר מוקש ל-'1'/'2'/'3'.
Map<String, String> get PRI_LABELS => pl.priLabels; // ignore: non_constant_identifier_names
String? priLabel(dynamic pri) => pl.priLabels['$pri'];
