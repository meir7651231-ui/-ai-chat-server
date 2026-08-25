// בדיקת-חוזה (רתמת-זהב) · startCampaign — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת ביט-אחר-ביט את 5 דוגמאות-החוזה מ-new/atoms/start-campaign.test.mjs
// (שהן גם הדוגמאות-המחייבות של start-campaign.contract.md).
// השוואת-מערכים = אורך + איבר-איבר (כלל-8) — לעולם לא join.
// ‏undefined של JS ⇒ null ב-Dart (שניהם falsy ומסוננים — אותה תוצאה).
// הרצה: dart run --enable-asserts new/dart-maor/start-campaign_test.dart ⇒ OK
import 'start-campaign.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// כלל-8: השוואת-רשימה = אורך + איבר-איבר.
void _eqList(dynamic got, List want, String msg) {
  _ok(got is List, '$msg: לא רשימה (${got.runtimeType})');
  final g = got as List;
  _ok(g.length == want.length, '$msg: אורך ${g.length} ≠ ${want.length}');
  for (var i = 0; i < want.length; i++) {
    _ok(g[i] == want[i], '$msg: איבר-$i ‏${g[i]} ≠ ${want[i]}');
  }
}

// השוואת מכונת-המצב המלאה: 5 מפתחות בדיוק, שדה-שדה.
void _eqCampaign(dynamic got, Map want, String msg) {
  _ok(got is Map, '$msg: לא Map');
  final g = got as Map;
  _ok(g.length == 5, '$msg: מספר-מפתחות ${g.length} ≠ 5');
  _ok(g.containsKey('name') && g['name'] == want['name'], '$msg: name');
  _ok(g.containsKey('startedAt') && g['startedAt'] == want['startedAt'],
      '$msg: startedAt');
  _eqList(g['queue'], want['queue'] as List, '$msg: queue');
  _ok(g.containsKey('total') && g['total'] == want['total'], '$msg: total');
  _eqList(g['log'], want['log'] as List, '$msg: log');
}

void main() {
  var n = 0;

  // 1) דדופ + סינון-ריק, סדר נשמר — הכפול 'a' והריק '' סוננו.
  _eqCampaign(
      startCampaign('חורף', ['a', 'b', 'a', '', 'c'], '2026-08-24'),
      {
        'name': 'חורף',
        'startedAt': '2026-08-24',
        'queue': ['a', 'b', 'c'],
        'total': 3,
        'log': [],
      },
      'דוגמה-1');
  n++;

  // 2) רשימה ריקה ⇒ queue:[] · total:0 · log:[].
  _eqCampaign(
      startCampaign('ריק', [], '2026-01-01'),
      {
        'name': 'ריק',
        'startedAt': '2026-01-01',
        'queue': [],
        'total': 0,
        'log': [],
      },
      'דוגמה-2');
  n++;

  // 3) סדר-ההזנה הוא סדר-החיוג — אין מיון.
  _eqList((startCampaign('סדר', ['c', 'a', 'b'], '2026-08-24') as Map)['queue'],
      ['c', 'a', 'b'], 'דוגמה-3');
  n++;

  // 4) כל falsy מסונן (!id) — ‏null/undefined (⇒null ב-Dart) מסוננים.
  _eqList(
      (startCampaign('falsy', [null, null, 'x'], '2026-08-24') as Map)['queue'],
      ['x'],
      'דוגמה-4');
  n++;

  // 5) הכל-כפול ⇒ אחד; total קפוא = queue.length.
  final c5 = startCampaign('הכל-כפול', ['z', 'z', 'z'], '2026-08-24') as Map;
  _eqList(c5['queue'], ['z'], 'דוגמה-5: queue');
  _ok(c5['total'] == 1, 'דוגמה-5: total ${c5['total']} ≠ 1');
  n++;

  // חיזוקי-קצה נאמני-JS (מעבר לחוזה, באותה רוח):
  // falsy נוספים — 0 / false / NaN מסוננים כמו ב-!id של JS.
  _eqList(
      (startCampaign('קצה', [0, false, double.nan, 'y'], '2026-08-24')
          as Map)['queue'],
      ['y'],
      'קצה-falsy');
  n++;
  // log הוא מערך טרי בכל קריאה (לא רפרנס משותף).
  final l1 = (startCampaign('א', ['q'], '2026-08-24') as Map)['log'];
  final l2 = (startCampaign('ב', ['q'], '2026-08-24') as Map)['log'];
  _ok(!identical(l1, l2), 'log משותף בין קריאות');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      ((startCampaign('חי', ['a'], '2026-08-24') as Map)['total'] == 1),
      'assert-live guard');

  print('OK startCampaign: $n contract checks passed');
}
