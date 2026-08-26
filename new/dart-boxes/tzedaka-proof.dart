// 🧪 הוכחת-חוצה-שפות · tzedaka (Dart) — מריצה את tzedaka.dart על אותם קלטים/WANT
// כמו new/boxes/tzedaka.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה.
// שקעי-המנוע (smartFilter/buildMonthGrid) = doubles דטרמיניסטיים, זהים לרתמת-ה-JS.
// מגני-ההכרעה של ה-JS (fs על מקור-הקופסה) הם תלויי-JS ⇒ מדולגים (חוק-דיווח).
import 'dart:convert';
import 'tzedaka.dart' as D;

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

// ── שקעי-מנוע (doubles דטרמיניסטיים; המנוע האמיתי נבדק ברתמות search/calendar) ──
// smartFilter: q ריק ⇒ הכל; אחרת התאמת-תת-מחרוזת על אחד המונחים.
dynamic smartFilter(dynamic q, dynamic items, dynamic getTerms) {
  if (q == null || q == '') return (items as List).toList();
  return (items as List)
      .where((it) =>
          (getTerms(it) as List).any((t) => t.toString().contains(q as String)))
      .toList();
}

// buildMonthGrid: זקיף-האצלה — מחזיר את הארגומנטים כדי לאמת wrapper דק.
dynamic gridSpy(Object? e, Object? a, Object? h) => {
      'delegated': [e, a, h]
    };

List<dynamic> _ids(dynamic list) =>
    (list as List).map((b) => (b as Map)['id']).toList();

void main() {
  // ── קבועים ──
  eq('TZ_SCORE_RULES', D.TZ_SCORE_RULES,
      {'emptyPts': 10, 'ilsPerPoint': 50, 'streakDays': 60, 'streakPts': 5});
  eq('TZ_STALE_DAYS', D.TZ_STALE_DAYS, 90);
  eq('DAY_NAMES', D.DAY_NAMES,
      ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']);
  ok('DAY_NAMES כולל שבת (מקור calLib, 7)',
      D.DAY_NAMES.length == 7 && D.DAY_NAMES[6] == 'שבת');

  // ── lastCollectionIso ──
  eq(
      'lastCollectionIso max',
      D.lastCollectionIso({
        'collections': [
          {'date': '2026-07-01'},
          {'date': '2026-08-01'},
          {'date': '2026-06-15'}
        ]
      }),
      '2026-08-01');
  eq('lastCollectionIso ריק', D.lastCollectionIso({'collections': []}), '');

  // ── collectionScoreDelta ──
  final emptyBox = {'collections': []};
  eq('delta ריק/120', D.collectionScoreDelta(emptyBox, '2026-08-01', 120), 12);
  eq(
      'delta רצף/17',
      D.collectionScoreDelta(
          {'collections': [{'date': '2026-07-01'}]}, '2026-08-01', 100),
      17);
  eq(
      'delta מחוץ-לרצף/12',
      D.collectionScoreDelta(
          {'collections': [{'date': '2026-01-01'}]}, '2026-08-01', 100),
      12);
  eq(
      'delta ימים-שליליים/12',
      D.collectionScoreDelta(
          {'collections': [{'date': '2026-08-10'}]}, '2026-08-01', 100),
      12);
  eq(
      'delta rules-מותאם/5',
      D.collectionScoreDelta(emptyBox, '2026-08-01', 55,
          {'emptyPts': 0, 'ilsPerPoint': 10, 'streakDays': 30, 'streakPts': 3}),
      5);

  // ── סכומים (עדשה-עוינת: NaN מדולג) ──
  eq(
      'boxTotal NaN',
      D.boxTotal({
        'collections': [
          {'amount': 100},
          {'amount': 50},
          {'amount': double.nan}
        ]
      }),
      150);
  final boxes = <Map<String, dynamic>>[
    {
      'id': 'b1', 'num': '1', 'coordinatorId': 'c1', 'status': 'home',
      'since': '2026-01-01', 'famId': 'f1',
      'collections': [
        {'date': '2026-06-15', 'amount': 100, 'campaignId': 'p1'},
        {'date': '2026-07-10', 'amount': 50}
      ]
    },
    {
      'id': 'b2', 'num': '2', 'coordinatorId': 'c1', 'status': 'office',
      'since': '2026-01-01', 'famId': '',
      'collections': [
        {'date': '2026-08-01', 'amount': 40, 'campaignId': 'p1'}
      ]
    },
    {
      'id': 'b3', 'num': '3', 'coordinatorId': 'c2', 'status': 'home',
      'since': '2026-01-01', 'famId': 'f2',
      'collections': [
        {'date': '2026-08-20', 'amount': 300}
      ]
    },
  ];
  eq('coordinatorBoxes c1',
      D.coordinatorBoxes(boxes, 'c1').map((b) => b['id']).toList(), ['b1', 'b2']);
  eq('coordinatorTotal c1', D.coordinatorTotal(boxes, 'c1'), 190);
  eq('grandTotal', D.grandTotal(boxes), 490);
  eq('campaignTotal p1', D.campaignTotal(boxes, 'p1'), 140);
  eq('campaignTotal ריק', D.campaignTotal(boxes, 'nope'), 0);

  // ── staleBoxes (רק home, סף ברירת-מחדל 90) ──
  eq('staleBoxes 90', _ids(D.staleBoxes(boxes, '2026-08-24')), []);
  eq('staleBoxes 30', _ids(D.staleBoxes(boxes, '2026-08-24', 30)), ['b1']);
  final oldBox = <Map<String, dynamic>>[
    {
      'id': 'x', 'num': '9', 'coordinatorId': 'c1', 'status': 'home',
      'since': '2025-01-01', 'famId': 'f1',
      'collections': [
        {'date': '2026-01-01', 'amount': 10}
      ]
    }
  ];
  eq('staleBoxes ישן', _ids(D.staleBoxes(oldBox, '2026-08-24')), ['x']);
  eq(
      'staleBoxes office מדולג',
      _ids(D.staleBoxes([
        {...oldBox[0], 'status': 'office'}
      ], '2026-08-24')),
      []);

  // ── needsCare (סדר + מונח; config חסר ⇒ 'קופה') ──
  final db1 = <String, dynamic>{
    'families': [
      {'id': 'f1', 'name': 'כהן', 'address': 'הרצל 1', 'city': 'ירושלים', 'phone': '050'},
      {'id': 'f2', 'name': 'לוי'}
    ],
    'tzBoxes': [
      {
        'id': 'x', 'num': '9', 'coordinatorId': 'c1', 'status': 'home',
        'since': '2025-01-01', 'famId': 'f1',
        'collections': [
          {'date': '2026-01-01', 'amount': 10}
        ]
      },
      {
        'id': 'l', 'num': '7', 'coordinatorId': 'c1', 'status': 'lost',
        'since': '2026-01-01', 'famId': 'f2', 'collections': []
      },
    ],
    'tzCoordinators': [
      {'id': 'c1', 'name': 'שרה', 'active': false, 'score': 0}
    ],
    'tzCampaigns': [
      {'id': 'p1', 'name': 'פסח', 'active': true, 'end': '2026-08-30', 'goal': 1000}
    ],
  };
  final care = D.needsCare(db1, '2026-08-24');
  eq('needsCare kinds בסדר', care.map((x) => x['kind']).toList(),
      ['stale', 'lost', 'inactiveCoord', 'campaignEnding']);
  eq('needsCare stale label', care[0]['label'], 'קופה 9 לא רוקנה מזמן');
  eq('needsCare lost label', care[1]['label'], 'קופה 7 מסומנת כאבודה');
  eq('needsCare inactiveCoord', care[2]['label'],
      'שרה אינו פעיל אך עדיין עם 1 קופות בבתים');
  eq('needsCare campaignEnding', care[3]['label'],
      'המבצע "פסח" מסתיים ב-2026-08-30');
  final care2 = D.needsCare(db1, '2026-08-24', {
    'terms': {'entity.tzBox': 'קופסת-צדקה'}
  });
  eq('needsCare termOf', care2[0]['label'], 'קופסת-צדקה 9 לא רוקנה מזמן');

  // ── leaderboard (רק פעילים, score↓ ואז total↓) ──
  final coords = <Map<String, dynamic>>[
    {'id': 'c1', 'name': 'שרה', 'active': true, 'score': 20},
    {'id': 'c2', 'name': 'רבקה', 'active': true, 'score': 30},
    {'id': 'c3', 'name': 'לאה', 'active': false, 'score': 99},
  ];
  final lb = D.leaderboard(coords, boxes);
  eq('leaderboard מיון', lb.map((r) => (r['coordinator'] as Map)['id']).toList(),
      ['c2', 'c1']);
  eq('leaderboard boxCount',
      lb.firstWhere((r) => (r['coordinator'] as Map)['id'] == 'c1')['boxCount'], 2);

  // ── campaignProgress ──
  eq('campaignProgress 25', D.campaignProgress({'id': 'p1', 'goal': 1000}, boxes),
      {'sum': 140, 'goal': 1000, 'pct': 14});
  eq('campaignProgress קטום', D.campaignProgress({'id': 'p1', 'goal': 100}, boxes),
      {'sum': 140, 'goal': 100, 'pct': 100});
  eq('campaignProgress ללא-יעד', D.campaignProgress({'id': 'p1'}, boxes),
      {'sum': 140, 'goal': 0, 'pct': 0});

  // ── filterCoordinators (smartFilter מוזרק; q='' ⇒ הכל, בודקים מיון) ──
  eq(
      'filterCoords name',
      D
          .filterCoordinators(coords, boxes, '', false, 'name', smartFilter)
          .map((c) => (c as Map)['id'])
          .toList(),
      ['c3', 'c2', 'c1']);
  eq(
      'filterCoords onlyActive+score',
      D
          .filterCoordinators(coords, boxes, '', true, 'score', smartFilter)
          .map((c) => (c as Map)['id'])
          .toList(),
      ['c2', 'c1']);
  eq(
      'filterCoords stale',
      D
          .filterCoordinators(coords, boxes, '', true, 'stale', smartFilter)
          .map((c) => (c as Map)['id'])
          .toList(),
      ['c1', 'c2']);
  eq(
      'filterCoords q-עברית',
      D
          .filterCoordinators(coords, boxes, 'רבקה', false, 'name', smartFilter)
          .map((c) => (c as Map)['id'])
          .toList(),
      ['c2']);

  // ── boxesOverview ──
  final ovDb = <String, dynamic>{
    'tzBoxes': boxes,
    'tzCoordinators': coords,
    'families': db1['families']
  };
  final ov = D.boxesOverview(ovDb, '', '', 'num', smartFilter);
  eq(
      'boxesOverview שורות',
      ov
          .map((r) =>
              [r['box']['id'], r['coordName'], r['famName'], r['last'], r['total']])
          .toList(),
      [
        ['b1', 'שרה', 'כהן', '2026-07-10', 150],
        ['b2', 'שרה', '', '2026-08-01', 40],
        ['b3', 'רבקה', 'לוי', '2026-08-20', 300]
      ]);
  eq(
      'boxesOverview status home',
      D
          .boxesOverview(ovDb, '', 'home', 'num', smartFilter)
          .map((r) => r['box']['id'])
          .toList(),
      ['b1', 'b3']);
  eq(
      'boxesOverview sort total',
      D
          .boxesOverview(ovDb, '', '', 'total', smartFilter)
          .map((r) => r['box']['id'])
          .toList(),
      ['b3', 'b1', 'b2']);

  // ── filterCollections (טווח כוללני; קצה ריק=פתוח) ──
  final boxC = <String, dynamic>{
    'collections': [
      {'date': '2026-06-15', 'amount': 1, 'campaignId': 'p1'},
      {'date': '2026-07-10', 'amount': 2},
      {'date': '2026-08-01', 'amount': 3, 'campaignId': 'p2'}
    ]
  };
  eq(
      'filterCollections טווח',
      D
          .filterCollections(boxC, '2026-07-01', '2026-07-31', '')
          .map((c) => c['date'])
          .toList(),
      ['2026-07-10']);
  eq('filterCollections פתוח',
      D.filterCollections(boxC, '', '', '').length, 3);
  eq(
      'filterCollections מבצע',
      D.filterCollections(boxC, '', '', 'p2').map((c) => c['date']).toList(),
      ['2026-08-01']);

  // ── coordinatorPrintLines ──
  final pl = D.coordinatorPrintLines(db1, 'c1');
  eq('print כותרת', pl[0], 'רשימת קופות — שרה');
  eq('print קו', pl[1], '=' * 30);
  ok(
      'print קופת-home',
      pl.any((l) =>
          l.startsWith('#9') &&
          l.contains('משפחת כהן') &&
          l.contains('הרצל 1, ירושלים')));
  eq('print רכז-ריק', D.coordinatorPrintLines(db1, 'zzz'),
      ['רשימת קופות — ', '=' * 30, 'אין קופות פעילות']);

  // ── collectionsCsvRows ──
  final csv = D.collectionsCsvRows(db1);
  eq('csv כותרת', csv[0], ['תאריך', 'רכז', 'קופה', 'משפחה', 'סכום', 'מבצע']);
  eq('csv שורה', csv[1], ['2026-01-01', 'שרה', '#9', 'כהן', 10, '']);
  eq(
      'csv termOf family',
      D.collectionsCsvRows(db1, {
        'terms': {'entity.family': 'בית-אב'}
      })[0][3],
      'בית-אב');

  // ── buildTzGrid (wrapper דק — האצלה מלאה למנוע-הלוח) ──
  final evs = [
    {'date': '2026-08-24'}
  ];
  eq('buildTzGrid האצלה', D.buildTzGrid(evs, '2026-08-24', false, gridSpy), {
    'delegated': [evs, '2026-08-24', false]
  });
  eq('buildTzGrid heb', D.buildTzGrid([], '2026-01-01', true, gridSpy), {
    'delegated': [[], '2026-01-01', true]
  });

  if (fails > 0) {
    throw StateError('קופסת tzedaka (Dart): $fails טענות נכשלו');
  }
  print(
      '✓ קופסת tzedaka (Dart): $n טענות — 19 חוטים דרך הקופסה + עדשה-עוינת (ריק/NaN/עברית/status/טווח) — ירוק');
}
