// 🧪 הוכחת-חוצה-שפות · dialer (Dart) — מריצה את dialer.dart על אותם קלטים/WANT
// כמו new/boxes/dialer.test.mjs (10 דוגמאות-החוזה + קצוות). ירוק ⇒ מאור(JS)
// ובנייה-חכמה(Dart) על אותה קופסת-חייגן: אותם קלטים ⇒ אותו פלט (jsonEncode).
import 'dart:convert';
import 'dialer.dart' as D;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  } else {
    n++;
  }
}

void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

const ISO = '2026-01-01';

void main() {
  // 1) דדופ + סינון-falsy, סדר נשמר
  final c1 = D.startCampaign('קיץ', ['a', '', 'a', 'b'], ISO);
  eq('1 startCampaign queue דדופ', c1['queue'], ['a', 'b']);
  ok('1 total/startedAt/log',
      c1['total'] == 2 && c1['startedAt'] == ISO && (c1['log'] as List).isEmpty);
  eq('1b currentId חזית', D.currentId(c1), 'a');

  // 2) לא-סופי ⇒ requeue לסוף, בלי note
  final c2 = D.applyOutcome(c1, 'noanswer', '', ISO);
  eq('2 noanswer לסוף', c2['queue'], ['b', 'a']);
  final l2 = (c2['log'] as List)[0] as Map;
  ok('2b log בלי note',
      l2['id'] == 'a' && l2['outcome'] == 'noanswer' && l2['at'] == ISO && !l2.containsKey('note'));

  // 3) סופי ⇒ הסרה, עם note (trim)
  final c3 = D.applyOutcome(c1, 'donated', '  תרם 100  ', ISO);
  eq('3 donated הסרה', c3['queue'], ['b']);
  eq('3b note trim', ((c3['log'] as List)[0] as Map)['note'], 'תרם 100');

  // 4) queue ריק ⇒ no-op (אותו object)
  final empty = {'name': 'x', 'startedAt': ISO, 'queue': [], 'total': 0, 'log': []};
  ok('4 no-op זהות', identical(D.applyOutcome(empty, 'donated', 'z', ISO), empty));
  ok('4b currentId null', D.currentId(empty) == null);

  // 5) progress — לא-ענה פר-אדם (ייחודי), לא פר-ניסיון
  final camp5 = {
    'name': 'p', 'startedAt': ISO, 'total': 2, 'queue': ['a'],
    'log': [
      {'id': 'a', 'outcome': 'noanswer', 'at': ISO},
      {'id': 'a', 'outcome': 'noanswer', 'at': ISO},
      {'id': 'b', 'outcome': 'refused', 'at': ISO}
    ],
  };
  final p5 = D.progress(camp5);
  ok('5 remaining/finalized', p5['remaining'] == 1 && p5['finalized'] == 1);
  eq('5b noanswer פר-אדם=1 (לא 2)', (p5['counts'] as Map)['noanswer'], 1);
  eq('5c refused=1', (p5['counts'] as Map)['refused'], 1);
  eq('5d total', p5['total'], 2);

  // 6) undoLast אחרי noanswer ⇒ חזרה לחזית, מוסר מסוף-התור
  final u = D.undoLast(c2); // c2.queue=['b','a'], log=[na(a)]
  ok('6 undo noanswer חזית+הסרה-מהסוף',
      jsonEncode(u['queue']) == '["a","b"]' && (u['log'] as List).isEmpty);
  final u3 = D.undoLast(c3); // queue=['b'], log=[donated(a)]
  ok('6b undo סופי חזית',
      jsonEncode(u3['queue']) == '["a","b"]' && (u3['log'] as List).isEmpty);
  ok('6c undo בלי-יומן no-op', identical(D.undoLast(empty), empty));

  // 7) appendCall — טבעת, skip לא-נרשם
  final a7 = D.appendCall(null, 'donated', ISO);
  eq('7 appendCall ראשון', a7, [
    {'at': ISO, 'outcome': 'donated'}
  ]);
  ok('7b skip לא-נרשם (אותו מערך)', identical(D.appendCall(a7, 'skip', ISO), a7));

  // 8) 201 שיחות ⇒ 200 (טבעת), הראשונה נשמטת
  List<Map<String, String>>? ring;
  for (var i = 0; i < 201; i++) {
    ring = D.appendCall(ring, 'noanswer', 'd$i');
  }
  ok('8 טבעת 200', ring!.length == D.CALL_LOG_CAP && ring.length == 200);
  eq('8b הראשונה (d0) נשמטה', ring[0]['at'], 'd1');
  eq('8c popCall', D.popCall(ring.sublist(0, 1)), []);
  ok('8d popCall null', D.popCall(null) == null);

  // 9) callStats
  final s9 = D.callStats([
    {'at': ISO, 'outcome': 'noanswer'},
    {'at': '2026-02-02', 'outcome': 'donated'}
  ]);
  ok('9 callStats', s9['total'] == 2 && s9['last'] == '2026-02-02' && s9['noanswer'] == 1);
  final s9e = D.callStats(null);
  ok('9b callStats null', s9e['total'] == 0 && s9e['last'] == '' && s9e['noanswer'] == 0);

  // 10) campaignCsvRows — כותרת + תוויות מ-OUTCOME_LABELS
  final rows = D.campaignCsvRows(camp5, (id) => 'שם-$id');
  eq('10 כותרת', rows[0], ['שם', 'תוצאה', 'הערה', 'מתי']);
  ok('10b תווית refused=סירב/ה', rows[3][0] == 'שם-b' && rows[3][1] == 'סירב/ה');
  ok('10c תווית+הערה-ריקה', rows[1][1] == 'לא ענה' && rows[1][2] == '');

  // קבועים חשופים
  eq('const REQUEUE', D.REQUEUE_OUTCOMES, ['noanswer', 'skip']);
  eq('const TERMINAL', D.TERMINAL_OUTCOMES, ['donated', 'refused', 'callback', 'done']);
  ok('const LABELS', D.OUTCOME_LABELS['donated'] == 'תרם/ה' && D.OUTCOME_LABELS['skip'] == 'דילוג');

  // עדשה-עוינת: קלט-קצה שהמקור מטפל בו
  ok('edge queue-ריק currentId', D.currentId({'queue': [], 'log': []}) == null);
  ok('edge note רק-רווחים ⇒ אין note',
      !((D.applyOutcome({'queue': ['a'], 'total': 1, 'log': [], 'name': 'e', 'startedAt': ISO},
              'noanswer', '   ', ISO)['log'] as List)[0] as Map)
          .containsKey('note'));
  ok('edge isDone', D.isDone({'queue': []}) == true && D.isDone({'queue': ['x']}) == false);

  // הערה: מגני-המקור של dialer.test.mjs (readFileSync על dialer.mjs — חתימת-החיווט
  // verbatim) הם תלויי-מקור-JS ⇒ מדולגים כאן (החוזה החוצה-לשוני הוא התנהגות, לא טקסט-מקור).

  if (fails > 0) {
    print('❌ קופסת-dialer (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('dialer dart proof failed');
  }
  print('✓ קופסת-החייגן (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
