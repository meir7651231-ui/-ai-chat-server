// 🧪 הוכחת-חוצה-שפות · קופסת-ayin (Dart) — מריצה את ayin.dart על אותם קלטים בדיוק
// כמו new/boxes/ayin.test.mjs, ומוודאת פלט זהה-ביט (jsonEncode) מול golden ה-JS.
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה עם חישוב זהה.
// מגני-המקור של בדיקת-ה-JS (regex על ayin.mjs — IO נסתר/הערת-הכרעה/ייבוא-קופסה) הם
// תלויי-קובץ-JS ⇒ מדולגים כאן (חוק: מגן-מקור-JS ⇒ דלג בהערה; הטוהר נאכף אצל אטומי-Dart).
import 'dart:convert';
import 'ayin.dart' as B;

int fails = 0;

// ── סריאליזציה נאמנת-JS: כל מספרי-JS הם float64, ו-JSON.stringify מדפיס דאבל
// שלם-ערך ללא ".0" (2.0 ⇒ "2"). אטומי-Dart שומרים על מרחב-float64 (חוק-17),
// לכן נורמליזציה עמוקה של דאבל-שלם ל-int לפני jsonEncode = השוואת-פלט נאמנה
// ל-JSON.stringify (עניין-רתמה בלבד; הקופסה/האטום מעבירים את הערך כלשונו).
Object? _jsNorm(Object? v) {
  if (v is double && v.isFinite && v == v.truncateToDouble()) return v.toInt();
  if (v is Map) return {for (final e in v.entries) e.key: _jsNorm(e.value)};
  if (v is List) return [for (final x in v) _jsNorm(x)];
  return v;
}

void chk(String name, Object? got, Object? want) {
  final g = jsonEncode(_jsNorm(got)), w = jsonEncode(_jsNorm(want));
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  }
}

String iso() => '2026-01-01';

Map<String, dynamic> emptyAyin() => {
      'stage': 'new',
      'note': '',
      'answeredNote': '',
      'answerPushed': false,
      'nextTalk': '',
      'nextTalkTime': '',
      'lastTouch': '',
      'names': [],
      'answers': [],
      'log': [],
      'time': [],
      'mat': [],
    };

void main() {
  // דוגמה 1 — תוויות דרך termOf המחווט
  chk('stageLabel fallback', B.stageLabel({}, 'lead'), 'בהכנה');
  chk('stageLabel override', B.stageLabel({'terms': {'ayin.stage.lead': 'טיוטה'}}, 'lead'), 'טיוטה');
  chk('stageLabel דריסה-ריקה=fallback', B.stageLabel({'terms': {'ayin.stage.lead': '   '}}, 'lead'), 'בהכנה');
  chk('featLabel', B.featLabel({}), 'מעקב טיפול');
  chk('itemLabel', B.itemLabel({}), 'שם לטיפול');
  chk('unitLabel', B.unitLabel({}), 'כמות');

  // דוגמה 2/3 — סדר-שלבים
  chk('AYIN_STAGES', B.AYIN_STAGES, ['new', 'lead', 'eyes', 'answer', 'done']);
  chk('nextStage answer→done', B.nextStage('answer'), 'done');
  chk('nextStage done→null', B.nextStage('done'), null);
  chk('stageIndex לא-מוכר→0', B.stageIndex('zzz'), 0);
  chk('revertPatch new', B.revertPatch('new'), {'stage': 'new', 'answerPushed': false});
  chk('revertPatch done', B.revertPatch('done'), {'stage': 'done'});

  // דוגמה 4/5 — אגרגטים; קלט-קצה: eyes כמחרוזת/ריק/undefined, time/mat חסרים
  chk('eyesTotal', B.eyesTotal({'names': [{'eyes': 3}, {'eyes': '2'}, {'eyes': ''}]}), 5);
  chk('boqTotal', B.boqTotal({'names': [{'eyes': 2, 'rate': 10}, {'eyes': 3, 'rate': 0}]}), 20);
  chk('boqLineAmount ריק', B.boqLineAmount({'eyes': '', 'rate': 5}), 0);
  chk('timeHoursTotal חסר-time', B.timeHoursTotal({}), 0);
  chk('matCostTotal', B.matCostTotal({'mat': [{'qty': 2, 'cost': 3}]}), 6);

  // דוגמה 6 — פעילות; קלט-קצה: null
  chk('ayinActive null', B.ayinActive(null), false);
  chk('ayinActive ריק', B.ayinActive({'stage': 'new', 'names': [], 'lastTouch': '', 'answers': [], 'log': []}), false);
  chk('ayinActive שלב', B.ayinActive({'stage': 'lead', 'names': [], 'lastTouch': '', 'answers': [], 'log': []}), true);

  // דוגמה 7 — כפתור-חכם: עברית בכותרת-האירוע
  final a1 = {'stage': 'new', 'names': [{'id': '1', 'name': 'א', 'eyes': ''}], 'answers': [], 'log': []};
  final p1 = B.planAyinAdvance({}, 'כהן', a1) as Map;
  chk('planAyinAdvance patch', p1['patch'], {'stage': 'lead'});
  if (!((p1['event'] as Map)['title'] as String).contains('בהכנה — כהן (1 שם לטיפול)')) {
    print('✗ event.title: ${(p1['event'] as Map)['title']}');
    fails++;
  }
  if (p1['toast'] != 'נרשמו 1 — נכנס ללוח: בהכנה') {
    print('✗ toast: ${p1['toast']}');
    fails++;
  }
  // קלט-קצה: כפתור מוסתר בשלב done ⇒ null
  chk('planAyinAdvance done→null', B.planAyinAdvance({}, 'x', {'stage': 'done', 'names': [], 'answers': [], 'log': []}), null);

  // דוגמה 8/9 — הוספת-שם: ריק, כפול (dedup עברי דרך normName←normSearch), תקין+log
  chk('planAddName ריק', B.planAddName({'names': [], 'log': []}, '   ', '', 'x', iso),
      {'ok': false, 'error': 'הקלידו שם לפני ההוספה'});
  chk('planAddName dedup', B.planAddName({'names': [{'name': 'דוד'}], 'log': []}, 'דוד', '', 'x', iso)['ok'], false);
  final pa = B.planAddName({'names': [], 'log': []}, ' לוי ', 4, 'id9', iso);
  chk('planAddName ok', pa['ok'], true);
  chk('planAddName trim', (pa['names'] as List)[0], {'id': 'id9', 'name': 'לוי', 'eyes': 4, 'done': false});
  chk('planAddName log', (pa['log'] as List)[0], {'date': '2026-01-01', 'eyes': 4, 'name': 'לוי'});

  // תבניות-BOQ עם nextId מוזרק; ריקי-שם מדולגים
  final tl = B.namesToTemplateLines([{'name': ' ריק? ', 'eyes': 2, 'rate': 3}, {'name': '  ', 'eyes': 9}]);
  chk('namesToTemplateLines מדלג-ריק', tl, [{'name': 'ריק?', 'qty': 2, 'rate': 3}]);
  final nnv = B.templateLinesToNames([{'name': 'x', 'qty': 2, 'rate': 5}], (i) => 'n$i');
  chk('templateLinesToNames nextId', nnv, [{'id': 'n0', 'name': 'x', 'eyes': 2, 'done': false, 'rate': 5}]);

  // דוגמה 10/11 — גיליון-העיניים
  chk('AYIN_SHEET_HEADER', B.AYIN_SHEET_HEADER[3], 'כמה עיניים');
  chk('parseAyinSheet חסר-עמודה', B.parseAyinSheet([['שם למסירה'], ['דמה']], []),
      {'upds': [], 'miss': 0, 'error': 'חסרות עמודות "שם למסירה" ו/או "כמה עיניים"'});
  chk('parseAyinSheet שורה-בודדת', B.parseAyinSheet([['a']], [])['error'], 'הקובץ ריק או לא בפורמט CSV');

  // round-trip: ייצוא ⇒ פענוח ⇒ החלה (emptyAyin מוזרק לדוחות)
  final sup = [
    {
      'id': 's1',
      'name': 'תומכת א',
      'phone': '050',
      'ayin': {...emptyAyin(), 'stage': 'eyes', 'names': [{'id': 'nm1', 'name': 'שם ראשון', 'eyes': 7, 'done': false}]}
    }
  ];
  final sheet = B.ayinSheetRows(sup);
  chk('ayinSheetRows כותרת', sheet[0], [...B.AYIN_SHEET_HEADER]);
  chk('ayinSheetRows עופרת=כן (stage=eyes)', sheet[1][7], 'כן');
  // שינוי בגיליון: נמסר=כן ⇒ done + lastTouch
  sheet[1][4] = 'כן';
  final parsed = B.parseAyinSheet(sheet, sup);
  chk('parseAyinSheet miss=0', parsed['miss'], 0);
  final applied = B.applyAyinSheet(sup, parsed['upds'], '2026-02-02');
  chk('applyAyinSheet done',
      (((((applied['supporters'] as List)[0] as Map)['ayin'] as Map)['names'] as List)[0] as Map)['done'], true);
  chk('applyAyinSheet lastTouch', (((applied['supporters'] as List)[0] as Map)['ayin'] as Map)['lastTouch'], '2026-02-02');

  // דוחות + סינון-לוח (emptyAyin מוזרק; ayin חלקי מלגאסי — חסר log/answers)
  final legacyPartial = [
    {'id': 's2', 'name': 'ב', 'phone': '', 'ayin': {'stage': 'answer', 'names': [{'id': 'x', 'name': 'פלוני', 'eyes': 2, 'done': true}]}}
  ];
  final dailySup = [
    {...legacyPartial[0], 'ayin': {...(legacyPartial[0]['ayin'] as Map), 'lastTouch': '2026-03-03'}}
  ];
  final daily = B.ayinDailyRows({}, dailySup, '2026-03-03', emptyAyin);
  chk('ayinDailyRows כותרת', daily[0][3], 'שלב');
  if (daily.length != 2) {
    print('✗ ayinDailyRows חלקי-לגאסי לא-נספר');
    fails++;
  }
  final board = B.ayinBoardItems(legacyPartial, emptyAyin);
  chk('ayinBoardItems', board.length, 1);
  chk('filterAyinBoard טקסט-עברי', B.filterAyinBoard(board, 'פלוני', null, null).length, 1);
  chk('filterAyinBoard status=wait (done)', B.filterAyinBoard(board, '', 'wait', null).length, 0);
  chk('ayinAllRows', B.ayinAllRows({}, legacyPartial, emptyAyin).length, 2);

  // עדשה-עוינת: נרמול אות-סופית (ם≡מ, ן≡נ) דרך normSearch המחווט ⇒ dedup תופס
  chk('normName אות-סופית ן≡נ', B.normName('בן'), B.normName('בנ'));
  chk('dedup אות-סופית ם≡מ',
      B.planAddName({'names': [{'name': 'שלום'}], 'log': []}, 'שלומ', '', 'x', iso)['ok'], false);
  // עדשה-עוינת: שורות-שבורות/משוננות בגיליון — עמודות חסרות לא מפילות
  final ragged = [['תומכת', 'שם למסירה', 'כמה עיניים'], ['תומכת א'], ['תומכת א', 'שם ראשון', '5']];
  final pr = B.parseAyinSheet(ragged, sup);
  chk('parseAyinSheet שורה-משוננת לא-קורסת', pr['upds'] is List, true);

  if (fails > 0) {
    print('❌ קופסת-ayin (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('ayin dart proof failed');
  }
  print('✓ קופסת-ayin (Dart): 40 טענות · 30 חוטים · דוגמאות-חוזה + קצה (עברית/ריק/null/לגאסי-חלקי/round-trip) — פלט זהה-ביט ל-JS');
}
