// 🏅 רתמת-זהב · bs-workflow — מריצה את ה-API-הפומבי של הקופסה על הקלטים/golden
// מבדיקות-האטומים (new/dart/*_test.dart), ומוודאת ספירת-טענות + StateError על אי-התאמה.
// הרצה: <dart> run --enable-asserts new/dart-boxes/bs-workflow-proof.dart
import 'bs-workflow.dart';

int _n = 0;

void _eqB(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
  _n++;
}

void _eqI(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
  _n++;
}

void _eqS(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
  _n++;
}

void _eqStage(WfStage? got, WfStage? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
  _n++;
}

// שקעי-בדיקה (verbatim מבדיקות-האטומים) ─────────────────────────────────────────
String _fallbackOnly(Object? cfg, String key, String fallback) => fallback;
String _echo(Object? cfg, String key, String fallback) => 'K:$key|F:$fallback';
num _fv(String field, int order, DateTime now) => order;

const _named = WfName(id: 'a', name: 'x');
const _withUnits = WfName(id: 'b', name: 'y', units: 3);
WfName _u(int? units) => WfName(id: 'i', name: 'n', units: units);

void main() {
  const cfg = <String, String>{};

  // ── wfActionVisible (8, מ-wf_action_visible_test) ──
  _eqB(wfActionVisible(const WfCase(stage: WfStage.done, names: [_named])), false, 'av1 done');
  _eqB(wfActionVisible(const WfCase(stage: WfStage.intake)), false, 'av2 intake empty');
  _eqB(wfActionVisible(const WfCase(stage: WfStage.intake, names: [_named])), true, 'av3 intake named');
  _eqB(wfActionVisible(const WfCase(stage: WfStage.ready)), false, 'av4 ready empty');
  _eqB(wfActionVisible(const WfCase(stage: WfStage.ready, names: [_named])), false, 'av5 ready no units');
  _eqB(wfActionVisible(const WfCase(stage: WfStage.ready, names: [_named, _withUnits])), true, 'av6 ready units');
  _eqB(wfActionVisible(const WfCase(stage: WfStage.prep)), true, 'av7 prep');
  _eqB(wfActionVisible(const WfCase(stage: WfStage.dispatch)), true, 'av8 dispatch');

  // ── wfActive (7, מ-wf_active_test) ──
  _eqB(wfActive(null), false, 'ac1 null');
  _eqB(wfActive(const WfCase()), false, 'ac2 default inactive');
  _eqB(wfActive(const WfCase(stage: WfStage.prep)), true, 'ac3 not-intake');
  _eqB(wfActive(const WfCase(names: [WfName(id: 'a', name: 'x')])), true, 'ac4 names');
  _eqB(wfActive(const WfCase(lastTouch: '2026-08-01')), true, 'ac5 lastTouch');
  _eqB(wfActive(const WfCase(log: [WfLog(date: '2026-08-01', units: 1)])), true, 'ac6 log');
  _eqB(wfActive(const WfCase(stage: WfStage.done)), true, 'ac7 done');

  // ── wfUnitsTotal (6, מ-wf_units_total_test) ──
  _eqI(wfUnitsTotal(const WfCase()), 0, 'ut1 default empty');
  _eqI(wfUnitsTotal(WfCase(names: [_u(3)])), 3, 'ut2 single');
  _eqI(wfUnitsTotal(WfCase(names: [_u(3), _u(5)])), 8, 'ut3 sum');
  _eqI(wfUnitsTotal(WfCase(names: [_u(3), _u(null), _u(5)])), 8, 'ut4 null=0');
  _eqI(wfUnitsTotal(WfCase(names: [_u(null), _u(null)])), 0, 'ut5 all null');
  _eqI(wfUnitsTotal(WfCase(names: [_u(0), _u(0), _u(7)])), 7, 'ut6 zeros+seven');

  // ── wfStageKey (5 + exhaustive-unique, מ-wf_stage_key_test) ──
  _eqS(wfStageKey(WfStage.intake), 'intake', 'sk1');
  _eqS(wfStageKey(WfStage.prep), 'prep', 'sk2');
  _eqS(wfStageKey(WfStage.ready), 'ready', 'sk3');
  _eqS(wfStageKey(WfStage.dispatch), 'dispatch', 'sk4');
  _eqS(wfStageKey(WfStage.done), 'done', 'sk5');
  final seen = <String>{};
  for (final s in WfStage.values) {
    final k = wfStageKey(s);
    if (k.isEmpty) throw StateError('FAIL sk-exhaustive: empty key for $s');
    if (!seen.add(k)) throw StateError('FAIL sk-exhaustive: duplicate key "$k"');
    _n++;
  }

  // ── wfStageFromKey (9, מ-wf_stage_from_key_test) ──
  _eqStage(wfStageFromKey('intake'), WfStage.intake, 'sfk1');
  _eqStage(wfStageFromKey('prep'), WfStage.prep, 'sfk2');
  _eqStage(wfStageFromKey('ready'), WfStage.ready, 'sfk3');
  _eqStage(wfStageFromKey('dispatch'), WfStage.dispatch, 'sfk4');
  _eqStage(wfStageFromKey('done'), WfStage.done, 'sfk5');
  _eqStage(wfStageFromKey(''), null, 'sfk6 empty');
  _eqStage(wfStageFromKey('INTAKE'), null, 'sfk7 uppercase');
  _eqStage(wfStageFromKey(' intake'), null, 'sfk8 leading ws');
  _eqStage(wfStageFromKey('foo'), null, 'sfk9 unknown');

  // round-trip key↔stage (הופכיות)
  for (final s in WfStage.values) {
    _eqStage(wfStageFromKey(wfStageKey(s)), s, 'rt ${s.name}');
  }

  // ── wfNextStage (5 + chain, מ-wf_next_stage_test) ──
  _eqStage(wfNextStage(WfStage.intake), WfStage.prep, 'ns1');
  _eqStage(wfNextStage(WfStage.prep), WfStage.ready, 'ns2');
  _eqStage(wfNextStage(WfStage.ready), WfStage.dispatch, 'ns3');
  _eqStage(wfNextStage(WfStage.dispatch), WfStage.done, 'ns4');
  _eqStage(wfNextStage(WfStage.done), null, 'ns5');
  WfStage? cur = WfStage.intake;
  var steps = 0;
  while (cur != null) {
    final nx = wfNextStage(cur);
    if (nx == null) break;
    cur = nx;
    steps++;
    if (steps > 10) throw StateError('FAIL ns-chain: did not terminate');
  }
  if (steps != 4) throw StateError('FAIL ns-chain: expected 4 got $steps');
  if (cur != WfStage.done) throw StateError('FAIL ns-chain: ended at $cur');
  _n++;

  // ── wfStageLabel (6, מ-wf_stage_label_test) ──
  _eqS(wfStageLabel(cfg, WfStage.intake, termOf: _echo), 'K:workflow.stage.intake|F:חדש', 'sl1 echo');
  _eqS(wfStageLabel(cfg, WfStage.prep, termOf: _echo), 'K:workflow.stage.prep|F:בהכנה', 'sl2 echo');
  _eqS(wfStageLabel(cfg, WfStage.dispatch, termOf: _echo), 'K:workflow.stage.dispatch|F:מסירה', 'sl3 echo');
  _eqS(wfStageLabel(cfg, WfStage.ready, termOf: _fallbackOnly), 'מוכן', 'sl4 fallback');
  _eqS(wfStageLabel(cfg, WfStage.done, termOf: _fallbackOnly), 'הושלם', 'sl5 fallback');
  _eqS(wfStageLabel(cfg, WfStage.intake, termOf: (c, k, f) => 'X'), 'X', 'sl6 org term');

  // ── wfAdvanceLabel (6, מ-wf_advance_label_test; wfStageLabel מחווט-פנימית עם fallback) ──
  _eqS(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.intake), termOf: _fallbackOnly), 'בהכנה ←', 'al1 intake');
  _eqS(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.prep), termOf: _fallbackOnly), '✓ אישור — בהכנה', 'al2 prep');
  _eqS(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.ready), termOf: _fallbackOnly), 'מסירה ←', 'al3 ready');
  _eqS(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.dispatch, dispatchPushed: false), termOf: _fallbackOnly),
      '📞 דחיפה ללוח', 'al4 dispatch not pushed');
  _eqS(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.dispatch, dispatchPushed: true), termOf: _fallbackOnly),
      '✓ הושלם', 'al5 dispatch pushed');
  _eqS(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.done), termOf: _fallbackOnly), '', 'al6 done empty');

  // ── triggerLabelHe (6, מ-trigger_label_he_test) ──
  const triggers = [
    (id: 'order:new', labelHe: 'הזמנה חדשה'),
    (id: 'order:open', labelHe: 'הזמנה פתוחה'),
  ];
  _eqS(triggerLabelHe('order:new', triggers: triggers), 'הזמנה חדשה', 'tl1 hit-first');
  _eqS(triggerLabelHe('order:open', triggers: triggers), 'הזמנה פתוחה', 'tl2 hit-second');
  _eqS(triggerLabelHe('order:zzz', triggers: triggers), 'order:zzz', 'tl3 miss->id');
  _eqS(triggerLabelHe('', triggers: triggers), '', 'tl4 empty->empty');
  _eqS(triggerLabelHe('anything', triggers: const []), 'anything', 'tl5 empty-list->id');
  const dup = [(id: 'dup', labelHe: 'ראשון'), (id: 'dup', labelHe: 'שני')];
  _eqS(triggerLabelHe('dup', triggers: dup), 'ראשון', 'tl6 first-match-wins');

  // ── conditionMatches (9, מ-condition_matches_test) ──
  final now = DateTime.utc(2026, 1, 1);
  _eqB(conditionMatches((field: 'sum', op: '>', value: 5), 10, now, fieldValue: _fv), true, 'cm1 gt-true');
  _eqB(conditionMatches((field: 'sum', op: '>=', value: 10), 10, now, fieldValue: _fv), true, 'cm2 ge-eq');
  _eqB(conditionMatches((field: 'sum', op: '<', value: 5), 10, now, fieldValue: _fv), false, 'cm3 lt-false');
  _eqB(conditionMatches((field: 'sum', op: '<=', value: 5), 5, now, fieldValue: _fv), true, 'cm4 le-eq');
  _eqB(conditionMatches((field: 'sum', op: '=', value: 5), 5, now, fieldValue: _fv), true, 'cm5 eq-true');
  _eqB(conditionMatches((field: 'sum', op: '=', value: 6), 5, now, fieldValue: _fv), false, 'cm6 eq-false');
  _eqB(conditionMatches((field: 'sum', op: '!=', value: 5), 10, now, fieldValue: _fv), false, 'cm7 unknown-op');
  _eqB(conditionMatches((field: 'sum', op: '', value: 5), 10, now, fieldValue: _fv), false, 'cm8 empty-op');
  final passed = conditionMatches(
    (field: 'ageDays', op: '>', value: 0),
    3,
    DateTime.utc(2026, 5, 5),
    fieldValue: (f, o, t) {
      if (f != 'ageDays' || o != 3) throw StateError('slot args wrong');
      return o.toDouble();
    },
  );
  if (!passed) throw StateError('FAIL [cm9 slot-passthrough]');
  _n++;

  // ── שער-חי (assert) ──
  assert(wfActionVisible(const WfCase(stage: WfStage.done)) == false, 'assert-live guard');
  assert(wfNextStage(WfStage.done) == null, 'assert-live guard');

  print('OK bs-workflow: $_n asserts passed (10 atoms wired)');
}
