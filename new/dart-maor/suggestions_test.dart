// בדיקת-חוזה · suggestions.dart — 6 דוגמאות-חוזה מ-suggestions.test.mjs
// + נסיגת-הסגר: purchased בטווח [2^53,1e21) ⇒ אין ".0" במפתח (בעיית-הרג'קס).
import 'suggestions.dart';

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    _f = 1;
  }
}

// שקעי-בדיקה דטרמיניסטיים (חוזה) — נאמנים ל-.mjs
DateTime _noon(String iso) => DateTime.parse(iso.substring(0, 10) + 'T12:00:00');
dynamic ageAt(dynamic birth, dynamic todayIso) {
  if (!_ok(birth)) return null;
  final b = _noon(birth as String), t = _noon(todayIso as String);
  var a = t.year - b.year;
  final md = t.month - b.month;
  if (md < 0 || (md == 0 && t.day < b.day)) a--;
  return a;
}

bool _ok(dynamic v) => v != null && v != false && v != '' && v != 0;

dynamic termOf(dynamic cfg, dynamic k, dynamic fb) => fb;
dynamic holPesach(dynamic iso, dynamic days) =>
    {'name': 'פסח', 'inDays': 12, 'hebYear': 5786};
dynamic holNone(dynamic iso, dynamic days) => null;

Map<String, dynamic> sockets(dynamic Function(dynamic, dynamic) upcomingHoliday,
    [dynamic Function(dynamic, dynamic)? moduleOn]) {
  return {
    'termOf': termOf,
    'moduleOn': moduleOn ?? (dynamic c, dynamic m) => true,
    'upcomingHoliday': upcomingHoliday,
    'ageAt': ageAt,
  };
}

const TODAY = '2026-08-24';
Map<String, dynamic> emptyDb() =>
    {'families': [], 'enrollments': [], 'courses': []};

void main() {
  // 1) הצעת-חג — 2 משפחות פעילות, בלי config
  {
    final db = {
      ...emptyDb(),
      'families': [
        {'id': 'f1', 'name': 'כהן', 'status': 'active', 'members': []},
        {'id': 'f2', 'name': 'לוי', 'status': 'active', 'members': []},
      ],
    };
    final out = suggestions(db, TODAY, null, sockets(holPesach));
    ok(out.length == 1, 'דוגמה 1: מספר-הצעות ≠ 1');
    final s = out[0] as Map;
    ok(s['key'] == 'sug:holiday:פסח:5786', 'דוגמה 1: key שגוי — ${s['key']}');
    ok(s['emoji'] == '🎁' && s['act'] == 'shop', 'דוגמה 1: emoji/act שגויים');
    ok(s['title'] == 'מתנת-חג · פסח בעוד 12 ימים',
        'דוגמה 1: title שגוי — ${s['title']}');
    ok((s['detail'] as String).startsWith('2 משפחות'),
        'דוגמה 1: detail לא מתחיל ב"2 משפחות" — ${s['detail']}');
  }
  // 2) ערכת בית-ספר — גיל 6 וגם גיל 5
  {
    final db = {
      ...emptyDb(),
      'families': [
        {
          'id': 'f1',
          'name': 'כהן',
          'status': 'active',
          'members': [
            {'id': 'm1', 'first': 'יוסי', 'birth': '2020-03-01'},
            {'id': 'm2', 'first': 'דנה', 'birth': '2021-03-01'},
            {'id': 'p1', 'first': 'אבא', 'birth': '1990-01-01', 'isParent': true},
          ],
        }
      ],
    };
    final out = suggestions(db, TODAY, null, sockets(holNone));
    ok(out.length == 2, 'דוגמה 2: מספר-הצעות ≠ 2 (גיל 5 וגם 6)');
    final s6 = _find(out, (x) => (x as Map)['key'] == 'sug:school:m1:6');
    final s5 = _find(out, (x) => (x as Map)['key'] == 'sug:school:m2:5');
    ok(s6 != null &&
        (s6 as Map)['emoji'] == '🎒' &&
        s6['famId'] == 'f1' &&
        s6['act'] == 'families', 'דוגמה 2: הצעת-גיל-6 שגויה');
    ok(s5 != null, 'דוגמה 2: גיל 5 לא הציף');
  }
  // 3) ערכת תינוק — גיל 0; הורה בגיל 0 לא מציף
  {
    final db = {
      ...emptyDb(),
      'families': [
        {
          'id': 'f1',
          'name': 'לוי',
          'status': 'active',
          'members': [
            {'id': 'b1', 'first': 'נועם', 'birth': '2026-05-01'},
            {'id': 'p1', 'first': 'הורה', 'birth': '2026-05-01', 'isParent': true},
          ],
        }
      ],
    };
    final out = suggestions(db, TODAY, null, sockets(holNone));
    ok(out.length == 1, 'דוגמה 3: מספר-הצעות ≠ 1 (isParent לא דולג?)');
    final s = out[0] as Map;
    ok(s['key'] == 'sug:baby:b1' &&
        s['emoji'] == '👶' &&
        s['act'] == 'families', 'דוגמה 3: הצעת-תינוק שגויה');
  }
  // 4) חידוש-כרטיסייה — נותרו 2 / נגמרה / נותרו 3
  {
    final fam = {
      'id': 'f1',
      'name': 'כהן',
      'status': 'active',
      'members': [
        {'id': 'm1', 'first': 'יוסי', 'birth': '2010-01-01'}
      ],
    };
    final course = {'id': 'c1', 'name': 'שחייה'};
    Map<String, dynamic> enr(int used) => {
          'id': 'e1',
          'plan': 'punch',
          'status': 'active',
          'purchased': 10,
          'used': used,
          'courseId': 'c1',
          'memberId': 'm1',
        };
    Map<String, dynamic> db(int used) => {
          'families': [fam],
          'courses': [course],
          'enrollments': [enr(used)],
        };
    final out2 = suggestions(db(8), TODAY, null, sockets(holNone));
    ok(out2.length == 1 && (out2[0] as Map)['key'] == 'sug:renew:e1:10',
        'דוגמה 4: key-חידוש שגוי');
    ok((out2[0] as Map)['detail'] == 'נותרו 2 ניקובים' &&
        (out2[0] as Map)['courseId'] == 'c1' &&
        (out2[0] as Map)['famId'] == 'f1', 'דוגמה 4: פרטי-חידוש שגויים');
    final out0 = suggestions(db(10), TODAY, null, sockets(holNone));
    ok(out0.length == 1 && (out0[0] as Map)['detail'] == 'הכרטיסייה נגמרה',
        'דוגמה 4: "הכרטיסייה נגמרה" חסר');
    final out3 = suggestions(db(7), TODAY, null, sockets(holNone));
    ok(out3.length == 0, 'דוגמה 4: נותרו 3 — לא הייתה אמורה לעלות הצעה');
  }
  // 5) גידור-מודולים — shop כבוי ⇒ אין חג; courses כבוי ⇒ אין חידוש
  {
    final cfg = {'slug': 't'};
    final db = {
      'families': [
        {
          'id': 'f1',
          'name': 'כהן',
          'status': 'active',
          'members': [
            {'id': 'm1', 'first': 'יוסי', 'birth': '2010-01-01'}
          ],
        }
      ],
      'courses': [
        {'id': 'c1', 'name': 'שחייה'}
      ],
      'enrollments': [
        {
          'id': 'e1',
          'plan': 'punch',
          'status': 'active',
          'purchased': 10,
          'used': 9,
          'courseId': 'c1',
          'memberId': 'm1'
        }
      ],
    };
    final noShop = suggestions(
        db, TODAY, cfg, sockets(holPesach, (c, m) => m != 'shop'));
    ok(!noShop.any((x) => (x as Map)['act'] == 'shop') &&
        noShop.any((x) => (x as Map)['act'] == 'courses'),
        'דוגמה 5: shop כבוי לא גודר');
    final noCourses = suggestions(
        db, TODAY, cfg, sockets(holPesach, (c, m) => m != 'courses'));
    ok(!noCourses.any((x) => (x as Map)['act'] == 'courses') &&
        noCourses.any((x) => (x as Map)['act'] == 'shop'),
        'דוגמה 5: courses כבוי לא גודר');
  }
  // 6) משפחה לא-פעילה — לא מציפה, ואין הצעת-חג בלי משפחות פעילות
  {
    final db = {
      ...emptyDb(),
      'families': [
        {
          'id': 'f1',
          'name': 'סגור',
          'status': 'closed',
          'members': [
            {'id': 'm1', 'first': 'ילד', 'birth': '2020-03-01'}
          ],
        }
      ],
    };
    final out = suggestions(db, TODAY, null, sockets(holPesach));
    ok(out.length == 0, 'דוגמה 6: משפחה סגורה הציפה הצעות');
  }
  // 7) נסיגת-הסגר — purchased בטווח [2^53,1e21): המפתח ללא ".0"
  //    JS: String(9007199254740994) === '9007199254740994' (בלי ".0").
  {
    final fam = {
      'id': 'f1',
      'name': 'כהן',
      'status': 'active',
      'members': [
        {'id': 'm1', 'first': 'יוסי', 'birth': '2010-01-01'}
      ],
    };
    final db = {
      'families': [fam],
      'courses': [
        {'id': 'c1', 'name': 'שחייה'}
      ],
      // purchased-used = 1 ⇒ ההצעה עולה; purchased ענק ⇒ מבחן-הפורמט
      'enrollments': [
        {
          'id': 'e1',
          'plan': 'punch',
          'status': 'active',
          'purchased': 9007199254740994.0,
          'used': 9007199254740993.0,
          'courseId': 'c1',
          'memberId': 'm1'
        }
      ],
    };
    final out = suggestions(db, TODAY, null, sockets(holNone));
    ok(out.length == 1, 'דוגמה 7: הצעת-חידוש לא עלתה');
    ok((out[0] as Map)['key'] == 'sug:renew:e1:9007199254740994',
        'דוגמה 7: key עם ".0" — הרג\'קס-הישן. קיבלנו ${(out[0] as Map)['key']}');
  }

  if (_f != 0) throw StateError('בדיקות-חוזה נכשלו');
  print('✓ suggestions.dart: 7 דוגמאות-חוזה (6 + נסיגת-הסגר .0) — ירוק');
}

// עזר-בדיקה מקומי (find על List)
dynamic _find(List list, bool Function(dynamic) pred) {
  for (final x in list) {
    if (pred(x)) return x;
  }
  return null;
}
