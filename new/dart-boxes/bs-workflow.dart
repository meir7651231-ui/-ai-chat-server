import '../dart-data/wf_stage_label-data.dart' as tdb_wfl;
import '../dart-data/wf_advance_label-terms.dart';
// 📦 קופסת-חיבורים · bs-workflow (בנייה-חכמה) — מנוע-ה-workflow של הסטודיו (משפך-שלבים + כללי-סטודיו).
// חוזה: מקור-האמת buildsmart/app_flutter/lib/logic/workflow_engine.dart + logic/studio/rules_model.dart.
// זו קופסת-בנייה-חכמה שנייה (אחרי bs-matching) — מחווטת 10 אטומי-wf/rules מ-../dart/.
//
// ── פער-הייצוג (כמו dedup: רשומה↔Map) — כאן: מודל-פזור↔מודל-מאוחד ─────────────────
// שמונה מהאטומים נושאים כל אחד עותק-inline verbatim של enum `WfStage` + מחלקות
// `WfName`/`WfLog`/`WfCase` (דיבר-1: טיפוס-שכן ⇒ הטבעה). תחת import-מוקדם כל עותק
// הוא טיפוס-נבדל ב-Dart. **הכרעת-קופסה:** הקופסה מחזיקה מודל-קנוני יחיד (WfStage/
// WfName/WfLog/WfCase למטה) וגושרת אותו לכל עותק-אטום דרך מתאמים (‏_xCase/_xStage).
// גשר-השלבים = מיפוי-לפי-index: כל העותקים verbatim באותו סדר (intake·prep·ready·
// dispatch·done) ⇒ `X.WfStage.values[s.index]` הוא זהות-סמנטית (חוק-4, נשמר-מקור).
import '../dart/wf_action_visible.dart' as av;
import '../dart/wf_active.dart' as ac;
import '../dart/wf_advance_label.dart' as al;
import '../dart/wf_next_stage.dart' as ns;
import '../dart/wf_stage_from_key.dart' as sfk;
import '../dart/wf_stage_key.dart' as sk;
import '../dart/wf_stage_label.dart' as sl;
import '../dart/wf_units_total.dart' as ut;
import '../dart/trigger_label_he.dart' as tlh;
import '../dart/condition_matches.dart' as cm;

// ── המודל-הקנוני (הכרעת-קופסה — מאחד את שמונה עותקי-ה-inline) ─────────────────────
/// חמשת שלבי ה-workflow. סדר verbatim (זהה בכל עותקי-האטום — עוגן גשר-ה-index).
enum WfStage { intake, prep, ready, dispatch, done }

/// פריט-שורה במקרה-workflow. verbatim.
class WfName {
  const WfName({required this.id, required this.name, this.units, this.done = false});
  final String id;
  final String name;
  final int? units;
  final bool done;
}

/// רשומת-לוג במקרה. verbatim.
class WfLog {
  const WfLog({required this.date, required this.units, this.name});
  final String date;
  final int units;
  final String? name;
}

/// מקרה-workflow יחיד — immutable. verbatim.
class WfCase {
  const WfCase({
    this.stage = WfStage.intake,
    this.note = '',
    this.dispatchPushed = false,
    this.nextTouch = '',
    this.nextTouchTime = '',
    this.lastTouch = '',
    this.names = const [],
    this.log = const [],
  });
  final WfStage stage;
  final String note;
  final bool dispatchPushed;
  final String nextTouch;
  final String nextTouchTime;
  final String lastTouch;
  final List<WfName> names;
  final List<WfLog> log;
}

// ── מתאמי-הגשר: מודל-קנוני → עותק-אטום פר-namespace (פער-הייצוג) ──────────────────
// שלב-קנוני ⇒ שלב-אטום (מיפוי-index, שקוף-סמנטית). וההיפוך חזרה לקנוני.
WfStage _back(int i) => WfStage.values[i];

av.WfCase _avCase(WfCase a) => av.WfCase(
      stage: av.WfStage.values[a.stage.index],
      note: a.note,
      dispatchPushed: a.dispatchPushed,
      nextTouch: a.nextTouch,
      nextTouchTime: a.nextTouchTime,
      lastTouch: a.lastTouch,
      names: [for (final n in a.names) av.WfName(id: n.id, name: n.name, units: n.units, done: n.done)],
      log: [for (final l in a.log) av.WfLog(date: l.date, units: l.units, name: l.name)],
    );

ac.WfCase _acCase(WfCase a) => ac.WfCase(
      stage: ac.WfStage.values[a.stage.index],
      note: a.note,
      dispatchPushed: a.dispatchPushed,
      nextTouch: a.nextTouch,
      nextTouchTime: a.nextTouchTime,
      lastTouch: a.lastTouch,
      names: [for (final n in a.names) ac.WfName(id: n.id, name: n.name, units: n.units, done: n.done)],
      log: [for (final l in a.log) ac.WfLog(date: l.date, units: l.units, name: l.name)],
    );

al.WfCase _alCase(WfCase a) => al.WfCase(
      stage: al.WfStage.values[a.stage.index],
      note: a.note,
      dispatchPushed: a.dispatchPushed,
      nextTouch: a.nextTouch,
      nextTouchTime: a.nextTouchTime,
      lastTouch: a.lastTouch,
      names: [for (final n in a.names) al.WfName(id: n.id, name: n.name, units: n.units, done: n.done)],
      log: [for (final l in a.log) al.WfLog(date: l.date, units: l.units, name: l.name)],
    );

ut.WfCase _utCase(WfCase a) => ut.WfCase(
      stage: ut.WfStage.values[a.stage.index],
      note: a.note,
      dispatchPushed: a.dispatchPushed,
      nextTouch: a.nextTouch,
      nextTouchTime: a.nextTouchTime,
      lastTouch: a.lastTouch,
      names: [for (final n in a.names) ut.WfName(id: n.id, name: n.name, units: n.units, done: n.done)],
      log: [for (final l in a.log) ut.WfLog(date: l.date, units: l.units, name: l.name)],
    );

// ── ה-API הפומבי (מודל-קנוני; ביט-זהה לחתימות-המקור) ─────────────────────────────

/// האם כפתור-הקידום גלוי בשלב הנוכחי (ה-guard).
bool wfActionVisible(WfCase a) => av.wfActionVisible(_avCase(a));

/// "פעיל" — מוצג בלוח ברגע שקרתה אינטראקציה כלשהי.
bool wfActive(WfCase? a) => ac.wfActive(a == null ? null : _acCase(a));

/// כמות מצטברת של כל השמות (units==null נספר כ-0).
int wfUnitsTotal(WfCase a) => ut.wfUnitsTotal(_utCase(a));

/// מפתח-המחרוזת הקבוע של שלב.
String wfStageKey(WfStage s) => sk.wfStageKey(sk.WfStage.values[s.index]);

/// המרת-מפתח→שלב. null עבור מפתח לא-מוכר (הופכי ל-wfStageKey).
WfStage? wfStageFromKey(String k) {
  final r = sfk.wfStageFromKey(k);
  return r == null ? null : _back(r.index);
}

/// השלב הבא ברצף, או null בשלב האחרון (done).
WfStage? wfNextStage(WfStage s) {
  final r = ns.wfNextStage(ns.WfStage.values[s.index]);
  return r == null ? null : _back(r.index);
}

/// תווית-שלב ניתנת-לשם (מונח-ארגון אם קיים, אחרת fallback ניטרלי).
/// שקע-`wfStageKey` מחווט לאח-הקופסה (קריאה-לאטום-שכן, חוק-3).
String wfStageLabel<C>(
  C cfg,
  WfStage s, {
  required String Function(C cfg, String key, String fallback) termOf,
}) =>
    sl.wfStageLabel<C>(
      cfg,
      sl.WfStage.values[s.index],
      kStageFallback: tdb_wfl.kStageFallback,
      termOf: termOf,
      wfStageKey: (sl.WfStage x) => wfStageKey(_back(x.index)),
    );

/// תווית-כפתור-הקידום פר-שלב. שקע-`wfStageLabel` מחווט לאח-הקופסה (חוק-3):
/// wfAdvanceLabel → wfStageLabel → (termOf-שקע + wfStageKey-אח). done ⇒ '' (אין כפתור).
String wfAdvanceLabel<C>(
  C cfg,
  WfCase a, {
  required String Function(C cfg, String key, String fallback) termOf,
}) =>
    al.wfAdvanceLabel<C>(
      cfg,
      _alCase(a),
      wfStageLabel: (C c, al.WfStage s) => wfStageLabel(c, _back(s.index), termOf: termOf),
     term: (k)=>kTerms[k]!);

/// תווית-עברית ל-id של טריגר/שדה-תנאי, או ה-id הגולמי כשאין.
/// שקע-`triggers` = ידע-הקשר שנעדר מהמקור ⇒ נשאר פרמטר (הצרכן/קופסת-אב מזריקה).
String triggerLabelHe(
  String id, {
  required List<({String id, String labelHe})> triggers,
}) =>
    tlh.triggerLabelHe(id, triggers: triggers);

/// הערכת תנאי-כלל בודד מול הזמנה (>, >=, <, <=, = ; אחר ⇒ false).
/// שקע-`fieldValue` = מיצוי-הערך-המספרי (האח _fieldValue) ⇒ נשאר פרמטר (חוק-3).
bool conditionMatches<T>(
  ({String field, String op, num value}) c,
  T order,
  DateTime now, {
  required num Function(String field, T order, DateTime now) fieldValue,
}) =>
    cm.conditionMatches<T>(c, order, now, fieldValue: fieldValue);
