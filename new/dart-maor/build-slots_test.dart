// בדיקת-חוזה (רתמת-זהב) · buildSlots — מייבאת אך ורק את האטום-שלה (חוק-4).
// 9 הבדיקות מ-5 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/build-slots.test.mjs
// (אותם קלטים→פלטים). השקעים נאמנים למקור (diary/lib.ts + courses/lib.ts + config.ts):
//   timeToMin('HH:MM')⇒דקות/NaN · minToHM⇒'HH:MM' · sessionsOf · courseOnDate · termOf.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/build-slots_test.dart  ⇒ exit 0
import 'build-slots.dart';

String _pad2(num n) => n.toInt().toString().padLeft(2, '0');

// timeToMin: /^(\d{1,2}):(\d{2})$/ על String(t||'').trim() ⇒ דקות-מחצות, אחרת NaN.
num _timeToMin(dynamic t) {
  final s = (t ?? '').toString().trim();
  final m = RegExp(r'^(\d{1,2}):(\d{2})$').firstMatch(s);
  return m == null
      ? double.nan
      : int.parse(m.group(1)!) * 60 + int.parse(m.group(2)!);
}

// minToHM: pad2(floor(min/60)) + ':' + pad2(min%60).
String _minToHM(dynamic min) {
  final m = min as num;
  return _pad2((m / 60).floor()) + ':' + _pad2(m % 60);
}

// sessionsOf: c.sessions אם קיים ולא-ריק, אחרת מפגש-יחיד מ-weekday/time.
List<dynamic> _sessionsOf(dynamic c) {
  final cm = c as Map;
  final s = cm['sessions'];
  if (s is List && s.isNotEmpty) return s;
  return [
    {'day': cm['weekday'], 'time': cm['time'], 'label': ''}
  ];
}

// courseOnDate: (!c.start || iso>=c.start) && (!c.end || iso<=c.end) — השוואת-מחרוזות ISO.
bool _courseOnDate(dynamic c, dynamic iso) {
  final cm = c as Map;
  final start = cm['start'];
  final end = cm['end'];
  final startOk = !_true(start) || iso.toString().compareTo(start.toString()) >= 0;
  final endOk = !_true(end) || iso.toString().compareTo(end.toString()) <= 0;
  return startOk && endOk;
}

// termOf: cfg?.terms?.[key] אם מחרוזת לא-ריקה, אחרת fb.
String _termOf(dynamic cfg, dynamic key, dynamic fb) {
  final terms = (cfg is Map) ? cfg['terms'] : null;
  final v = (terms is Map) ? terms[key] : null;
  return (v is String && v.trim().isNotEmpty) ? v.trim() : fb.toString();
}

bool _true(dynamic v) => v != null && v != false && v != '' && v != 0;

int _f = 0;
void _eqList(String n, List got, List want) {
  if (!_deepEq(got, want)) {
    // ignore: avoid_print
    print('✗ דוגמה ' + n + ': ' + got.toString() + ' ≠ ' + want.toString());
    _f = 1;
  }
}

void _eq(String n, dynamic got, dynamic want) {
  if (got != want) {
    // ignore: avoid_print
    print('✗ דוגמה ' + n + ': ' + got.toString() + ' ≠ ' + want.toString());
    _f = 1;
  }
}

bool _deepEq(dynamic a, dynamic b) {
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

void main() {
  const iso = '2026-08-24'; // יום שני, wd=1
  final db = <String, dynamic>{
    'courses': [
      {
        'id': 'c1',
        'name': 'ציור',
        'roomId': 'r1',
        'sessions': [
          {'day': 1, 'time': '10:00', 'label': ''}
        ]
      },
      {
        'id': 'c2',
        'name': 'שחייה',
        'roomId': 'r1',
        'sessions': [
          {'day': 1, 'time': '21:30', 'label': ''}
        ]
      },
    ],
    'events': [
      {'id': 'ev1', 'title': 'פגישה', 'roomId': 'r1', 'date': iso, 'time': '11:15', 'done': false}
    ],
  };
  final r1 = <String, dynamic>{'id': 'r1', 'from': '09:00', 'to': '12:00', 'slot': 60};

  List<Map<String, dynamic>> run(
    Map<String, dynamic> d,
    Map<String, dynamic> room,
    dynamic blocked,
    Map<String, dynamic> cfg, [
    bool? cleaningOn,
  ]) =>
      cleaningOn == null
          ? buildSlots(d, room, iso, blocked, cfg, _timeToMin, _minToHM,
              _sessionsOf, _courseOnDate, _termOf)
          : buildSlots(d, room, iso, blocked, cfg, _timeToMin, _minToHM,
              _sessionsOf, _courseOnDate, _termOf, cleaningOn);

  // 1 · חדר עם חוג + אירוע + מפגש-מחוץ-לשעות
  final a = run(db, r1, null, {});
  _eqList('1-keys', a.map((s) => s['key']).toList(),
      ['free09:00', 'crs|10:00|c1|0', 'ev|11:00|ev1', 'out|c2|0']);
  _eqList('1-labels', a.map((s) => s['label']).toList(),
      ['פנוי', 'חוג: ציור', 'אירוע: פגישה', 'חוג: שחייה · מחוץ לשעות הפעילות של החדר']);
  _eqList('1-times', [a[1]['bg'], a[2]['time'], a[3]['time'], a[3]['outOfHours'], a[3]['kind']],
      ['#fdf1d4', '11:15', '21:30', true, 'course']);

  // 2 · חסימה — רק הפנוי הופך חסום
  final b = run(db, r1, 'שבת', {});
  _eqList('2', [b[0]['key'], b[0]['kind'], b[0]['label'], b[1]['key'], b[2]['key']],
      ['blk09:00', 'blocked', 'חסום — שבת', 'crs|10:00|c1|0', 'ev|11:00|ev1']);

  // 3 · ניקיון-יומי 15:00 + כיבוי הדגל
  final r2 = <String, dynamic>{'id': 'r2', 'from': '14:00', 'to': '16:00', 'slot': 60};
  final c = run(db, r2, null, {});
  _eqList('3a', c.map((s) => [s['kind'], s['time']]).toList(),
      [['free', '14:00'], ['cleaning', '15:00']]);
  _eq('3a-label', c[1]['label'], 'ניקיון יומי (15:00–16:00)');
  _eqList('3b', run(db, r2, null, {}, false).map((s) => s['kind']).toList(),
      ['free', 'free']);

  // 4 · ברירות-מחדל לשעות/צעד לא-תקינים — 08:00–20:00/60
  final d = run(<String, dynamic>{'courses': [], 'events': []},
      {'id': 'r3', 'from': '', 'to': '', 'slot': 0}, null, {});
  _eqList('4', [d.length, d[0]['time'], d[7]['kind'],
        d.where((s) => s['kind'] == 'free').length],
      [12, '08:00', 'cleaning', 11]);

  // 5 · מונח דרך termOf
  final e = run(db, r1, null, {
    'terms': {'entity.course': 'שיעור'}
  });
  _eq('5', e[1]['label'], 'שיעור: ציור');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(a.length == 4, 'assert-live guard');

  if (_f != 0) throw StateError('build-slots: דוגמת-חוזה נכשלה');
  // ignore: avoid_print
  print('✓ build-slots: 9 בדיקות מ-5 דוגמאות-חוזה — ירוק');
}
