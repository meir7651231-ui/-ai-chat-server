import '../dart-data/wf_daily_rows-terms.dart' as td_wf_daily_rows;
// בדיקת-אטום · wfDailyRows
import 'wf_daily_rows.dart';

void main() {
  const cfg = OrgConfig();
  const today = '2026-08-27';

  final e1 = (
    name: 'א',
    phone: '050',
    wf: const WfCase(
      stage: WfStage.newq,
      lastTouch: today,
      nextTouch: 'מחר',
      note: 'הערה1',
      log: [
        WfLog(date: today, units: 3),
        WfLog(date: today, units: 2),
        WfLog(date: '2026-01-01', units: 99), // לא-היום — לא נספר
      ],
      names: [
        WfName(name: 'דלת', units: 2, done: true),
        WfName(name: 'חלון'),
      ],
    ),
  );
  // לא-נגע-היום → מדולג
  final e2 = (
    name: 'ג',
    phone: '052',
    wf: const WfCase(
      stage: WfStage.newq,
      lastTouch: '2026-01-01',
      nextTouch: '',
      note: '',
      log: [WfLog(date: '2026-01-01', units: 1)],
    ),
  );
  // wf==null → מדולג
  final e3 = (name: 'ד', phone: '053', wf: null);
  // נגע-היום ב-lastTouch, בלי log-היום → ענף unitsTotal (כאן 0 → '')
  final e4 = (
    name: 'ב',
    phone: '054',
    wf: const WfCase(
      stage: WfStage.done,
      lastTouch: today,
      nextTouch: 'אחר',
      note: 'הערה2',
    ),
  );

  final rows = wfDailyRows(
    cfg,
    [e1, e2, e3, e4],
    today,
    unitLabel: (_) => 'ק"ג',
    itemLabel: (_) => 'פריט',
    stageLabel: (_, s) => s.name,
    unitsTotal: (a) => a.names.length,
   term: (k)=>td_wf_daily_rows.kTerms[k]!);

  // כותרת + e1 + e4 (e2/e3 מדולגים)
  assert(rows.length == 3, 'rows=${rows.length}');

  // כותרת עם תוויות-שקע
  assert(rows[0][2] == 'ק"ג היום' && rows[0][4] == 'פריט', 'header=${rows[0]}');

  // e1: unitsToday = 3+2 = 5 ; namesLine עם ·units + ✓
  final r1 = rows[1];
  assert(r1[0] == 'א' && r1[2] == 5, 'r1 units=${r1[2]}');
  assert(r1[3] == 'newq', 'r1 stage=${r1[3]}');
  assert(r1[4] == 'דלת ·2 ✓ · חלון', 'r1 names=${r1[4]}');
  assert(r1[5] == 'מחר' && r1[6] == 'הערה1');

  // e4: אין log-היום, unitsTotal==0 → '' ; namesLine ריק
  final r4 = rows[2];
  assert(r4[0] == 'ב' && r4[2] == '' && r4[4] == '', 'r4=$r4');
  assert(r4[3] == 'done');

  print('wfDailyRows OK');
}
