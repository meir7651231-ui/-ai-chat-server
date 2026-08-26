// 🧪 הוכחת-חוצה-שפות · חלוקה (SHOP7, Dart) — מריצה את distribution.dart על אותם
// קלטים/WANT כמו new/boxes/distribution.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart)
// על אותה קופסה: פלט זהה-ביט. מגני-המקור-JS (verbatim/import-only) = מקרה תלוי-JS ⇒ מדולגים.
import 'dart:convert';
import 'distribution.dart' as D;

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

// שקע smartFilter מזויף (זהה ל-fakeSmart של בדיקת-ה-JS):
//   (q, items, getTerms) => items.filter(it => getTerms(it).some(t => String(t).includes(q)))
dynamic fakeSmart(dynamic q, dynamic items, dynamic getTerms) => (items as List)
    .where((it) => (getTerms(it) as List).any((t) => t.toString().contains(q as String)))
    .toList();

void main() {
  // ── advanceStatus / statusLabel ──
  eq('advanceStatus pickup', D.advanceStatus('pickup'), 'enroute');
  eq('advanceStatus enroute', D.advanceStatus('enroute'), 'delivered');
  eq('advanceStatus delivered', D.advanceStatus('delivered'), 'delivered');
  eq('advanceStatus zzz', D.advanceStatus('zzz'), 'delivered'); // סטטוס לא-מוכר ⇒ delivered
  eq('statusLabel pickup', D.statusLabel('pickup'), 'איסוף');
  eq('statusLabel enroute', D.statusLabel('enroute'), 'בדרך');
  eq('statusLabel delivered', D.statusLabel('delivered'), 'נמסר');

  // ── מסד לדוגמה (זהה לבדיקת-ה-JS) ──
  final db = <String, dynamic>{
    'deliveries': [
      {'id': 'd1', 'dayId': 'day1', 'assignmentId': 'a1', 'volunteerId': 'v1', 'familyId': 'f1', 'status': 'pickup', 'note': 'קומה 3'},
      {'id': 'd2', 'dayId': 'day1', 'assignmentId': 'a2', 'volunteerId': 'v1', 'familyId': 'f2', 'status': 'delivered', 'note': ''},
      {'id': 'd3', 'dayId': 'day2', 'assignmentId': 'a3', 'volunteerId': 'v2', 'familyId': 'f1', 'status': 'enroute', 'note': ''},
    ],
    'shopAssignments': [
      {'id': 'a1', 'status': 'active'}, {'id': 'a2', 'status': 'active'},
      {'id': 'a4', 'status': 'active'}, {'id': 'a5', 'status': 'inactive'},
    ],
    'distributionDays': [
      {'id': 'day1', 'date': '2026-08-20', 'closed': false},
      {'id': 'day2', 'date': '2026-08-24', 'closed': false},
      {'id': 'day3', 'date': '2026-08-10', 'closed': true},
    ],
    'families': [
      {'id': 'f1', 'name': 'כהן', 'address': 'הרצל 5', 'city': 'ירושלים'},
      {'id': 'f2', 'name': 'לוי', 'address': '', 'city': ''}, // משפחה בלי כתובת
    ],
    'volunteers': [
      {'id': 'v1', 'name': 'משה', 'phone': '0501111111', 'area': 'צפון'},
      {'id': 'v2', 'name': 'שרה', 'phone': '0502222222'}, // בלי area
    ],
  };

  // ── deliveriesOfDay/Volunteer/Family ──
  eq('deliveriesOfDay day1', D.deliveriesOfDay(db, 'day1').length, 2);
  eq('deliveriesOfVolunteer v1', D.deliveriesOfVolunteer(db, 'v1').length, 2);
  eq('deliveriesOfVolunteer v1 day1', D.deliveriesOfVolunteer(db, 'v1', 'day1').length, 2);
  eq('deliveriesOfVolunteer v1 day2', D.deliveriesOfVolunteer(db, 'v1', 'day2').length, 0);
  eq('deliveriesOfFamily f1', D.deliveriesOfFamily(db, 'f1').length, 2);

  // ── eligibleAssignmentsForDay ──
  eq('eligibleAssignmentsForDay day1',
      D.eligibleAssignmentsForDay(db, 'day1').map((a) => a['id']).toList(), ['a4']);

  // ── progressOfDay (חיווט deliveriesOfDay) ──
  eq('progressOfDay day1', D.progressOfDay(db, 'day1'),
      {'total': 2, 'pickup': 1, 'enroute': 0, 'delivered': 1});

  // ── loadHint (חיווט deliveriesOfVolunteer) ──
  eq('loadHint v1 max1', D.loadHint(db, {'id': 'v1', 'maxDeliveries': 1}, 'day1'),
      {'count': 2, 'over': true});
  eq('loadHint v9 בלי-max', D.loadHint(db, {'id': 'v9'}, 'day1'),
      {'count': 0, 'over': false}); // אין maxDeliveries ⇒ over:false

  // ── pendingDeliveriesToday (יום-סגור לא-צף) ──
  final p = D.pendingDeliveriesToday(db, '2026-08-24').map((d) => d['id']).toList()..sort();
  eq('pendingDeliveriesToday', p, ['d1', 'd3']);

  // ── listLines (חיווט statusLabel) ──
  final rows = [
    {...db['deliveries'][0] as Map<String, dynamic>, 'familyName': 'כהן', 'volunteerName': 'משה', 'address': 'הרצל 5'},
    {...db['deliveries'][1] as Map<String, dynamic>, 'familyName': 'לוי', 'volunteerName': 'משה'},
  ];
  final out = D.listLines(rows);
  eq('listLines[0]', out[0], '🦺 משה (2 מסירות)');
  eq('listLines[1]', out[1], '  • כהן · איסוף · 📍 הרצל 5 · קומה 3');
  eq('listLines[2]', out[2], '  • לוי · נמסר'); // בלי כתובת/הערה ⇒ פורמט-בסיס

  // ── csvRows כותרת + termOf ──
  final bare = D.csvRows(db);
  eq('csvRows כותרת', bare[0], ['תאריך', 'משפחה', 'כתובת', 'מתנדב', 'סטטוס', 'הערה']);
  eq('csvRows שורה', bare[1], ['2026-08-20', 'כהן', 'הרצל 5, ירושלים', 'משה', 'איסוף', 'קומה 3']);
  final withCfg = D.csvRows(db, {'terms': {'entity.family': 'בית-אב'}});
  eq('csvRows termOf', withCfg[0][1], 'בית-אב'); // מונח-מותאם ⇒ termOf מחליף 'משפחה'
  eq('csvRows כתובת-ריקה', bare[2][2], ''); // משפחה בלי כתובת ⇒ תא ריק, לא ", "

  // ── volunteerRouteStops (משפחה בלי-כתובת מדולגת) ──
  eq('volunteerRouteStops day1 v1', D.volunteerRouteStops(db, 'day1', 'v1'), ['הרצל 5, ירושלים']);
  eq('volunteerRouteStops יום-ריק', D.volunteerRouteStops(db, 'day9', 'v1'), []);

  // ── סינון: smartFilter שקע-מוזרק ──
  var called = false;
  dynamic spy(dynamic q, dynamic items, dynamic getTerms) {
    called = true;
    return fakeSmart(q, items, getTerms);
  }

  called = false;
  ok('filterVolunteers ריק=זהות', identical(D.filterVolunteers(db['volunteers'], '', spy), db['volunteers']));
  ok('filterVolunteers ריק בלי-smartFilter', called == false);
  ok('filterVolunteers רווחים=זהות', identical(D.filterVolunteers(db['volunteers'], '  ', spy), db['volunteers']));
  ok('filterVolunteers רווחים בלי-smartFilter', called == false);
  eq('filterVolunteers שרה',
      (D.filterVolunteers(db['volunteers'], 'שרה', fakeSmart) as List).map((v) => v['id']).toList(), ['v2']);

  final drows = (db['deliveries'] as List)
      .map((d) => {...d as Map<String, dynamic>, 'familyName': d['familyId'] == 'f1' ? 'כהן' : 'לוי', 'volunteerName': 'משה'})
      .toList();
  ok('filterDeliveries ריק=זהות', identical(D.filterDeliveries(drows, '', fakeSmart), drows));
  eq('filterDeliveries איסוף',
      (D.filterDeliveries(drows, 'איסוף', fakeSmart) as List).map((r) => r['id']).toList(), ['d1']);

  if (fails > 0) {
    print('❌ קופסת-החלוקה (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('distribution dart proof failed');
  }
  print('✓ קופסת-החלוקה (SHOP7, Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
