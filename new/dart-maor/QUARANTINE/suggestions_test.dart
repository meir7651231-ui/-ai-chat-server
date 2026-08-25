import 'suggestions.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/suggestions.test.mjs.
/// השקעים דטרמיניסטיים כמו במקור (חוזה): ageAt-לוח-לועזי · termOf⇒fallback ·
/// upcomingHoliday קבוע/ריק · moduleOn ברירת-מחדל הכול-פעיל.

int f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    f = 1;
  }
}

// noon: JS new Date(iso.slice(0,10)+'T12:00:00') — צהריים מקומי; כשל ⇒ null.
DateTime? noon(dynamic iso) {
  try {
    return DateTime.parse('${(iso as String).substring(0, 10)}T12:00:00');
  } catch (_) {
    return null;
  }
}

dynamic ageAt(dynamic birth, dynamic todayIso) {
  // JS: if (!birth) return null — truthiness (null/'' ⇒ נסיגה).
  if (birth == null ||
      (birth is String && birth.isEmpty) ||
      birth == false ||
      (birth is num && (birth == 0 || birth.isNaN))) {
    return null;
  }
  final b = noon(birth), t = noon(todayIso);
  if (b == null || t == null) return null;
  var a = t.year - b.year;
  final md = t.month - b.month;
  if (md < 0 || (md == 0 && t.day < b.day)) a--;
  return a;
}

dynamic termOf(dynamic cfg, dynamic k, dynamic fb) => fb;
dynamic holPesach(dynamic todayIso, dynamic windowDays) =>
    <String, dynamic>{'name': 'פסח', 'inDays': 12, 'hebYear': 5786};
dynamic holNone(dynamic todayIso, dynamic windowDays) => null;

Map<String, dynamic> sockets(dynamic upcomingHoliday, [dynamic moduleOn]) =>
    <String, dynamic>{
      'termOf': termOf,
      'moduleOn': moduleOn ?? (dynamic c, dynamic m) => true,
      'upcomingHoliday': upcomingHoliday,
      'ageAt': ageAt,
    };

const today = '2026-08-24';

Map<String, dynamic> emptyDb() => <String, dynamic>{
      'families': <dynamic>[],
      'enrollments': <dynamic>[],
      'courses': <dynamic>[],
    };

dynamic findByKey(List<dynamic> out, String key) {
  for (final x in out) {
    if ((x as Map)['key'] == key) return x;
  }
  return null;
}

void main() {
  // 1) הצעת-חג — 2 משפחות פעילות, בלי config
  {
    final db = emptyDb()
      ..['families'] = <dynamic>[
        <String, dynamic>{'id': 'f1', 'name': 'כהן', 'status': 'active', 'members': <dynamic>[]},
        <String, dynamic>{'id': 'f2', 'name': 'לוי', 'status': 'active', 'members': <dynamic>[]},
      ];
    final out = suggestions(db, today, null, sockets(holPesach));
    ok(out.length == 1, 'דוגמה 1: מספר-הצעות ≠ 1');
    final s = out[0] as Map;
    ok(s['key'] == 'sug:holiday:פסח:5786', 'דוגמה 1: key שגוי — ${s['key']}');
    ok(s['emoji'] == '🎁' && s['act'] == 'shop', 'דוגמה 1: emoji/act שגויים');
    ok(s['title'] == 'מתנת-חג · פסח בעוד 12 ימים', 'דוגמה 1: title שגוי — ${s['title']}');
    ok((s['detail'] as String).startsWith('2 משפחות'),
        'דוגמה 1: detail לא מתחיל ב"2 משפחות" — ${s['detail']}');
  }
  // 2) ערכת בית-ספר — גיל 6 וגם גיל 5 (השוואת-רשימה: אורך + איבר-איבר, כלל-8)
  {
    final db = emptyDb()
      ..['families'] = <dynamic>[
        <String, dynamic>{
          'id': 'f1',
          'name': 'כהן',
          'status': 'active',
          'members': <dynamic>[
            <String, dynamic>{'id': 'm1', 'first': 'יוסי', 'birth': '2020-03-01'}, // גיל 6 ב-24.8.2026
            <String, dynamic>{'id': 'm2', 'first': 'דנה', 'birth': '2021-03-01'}, // גיל 5
            <String, dynamic>{'id': 'p1', 'first': 'אבא', 'birth': '1990-01-01', 'isParent': true},
          ],
        },
      ];
    final out = suggestions(db, today, null, sockets(holNone));
    ok(out.length == 2, 'דוגמה 2: מספר-הצעות ≠ 2 (גיל 5 וגם 6)');
    final s6 = findByKey(out, 'sug:school:m1:6');
    final s5 = findByKey(out, 'sug:school:m2:5');
    ok(
        s6 != null &&
            (s6 as Map)['emoji'] == '🎒' &&
            s6['famId'] == 'f1' &&
            s6['act'] == 'families',
        'דוגמה 2: הצעת-גיל-6 שגויה');
    ok(s5 != null, 'דוגמה 2: גיל 5 לא הציף');
  }
  // 3) ערכת תינוק — גיל 0; הורה בגיל 0 לא מציף
  {
    final db = emptyDb()
      ..['families'] = <dynamic>[
        <String, dynamic>{
          'id': 'f1',
          'name': 'לוי',
          'status': 'active',
          'members': <dynamic>[
            <String, dynamic>{'id': 'b1', 'first': 'נועם', 'birth': '2026-05-01'},
            <String, dynamic>{'id': 'p1', 'first': 'הורה', 'birth': '2026-05-01', 'isParent': true},
          ],
        },
      ];
    final out = suggestions(db, today, null, sockets(holNone));
    ok(out.length == 1, 'דוגמה 3: מספר-הצעות ≠ 1 (isParent לא דולג?)');
    final s = out.isEmpty ? <String, dynamic>{} : out[0] as Map;
    ok(s['key'] == 'sug:baby:b1' && s['emoji'] == '👶' && s['act'] == 'families',
        'דוגמה 3: הצעת-תינוק שגויה');
  }
  // 4) חידוש-כרטיסייה — נותרו 2 / נגמרה / נותרו 3
  {
    final fam = <String, dynamic>{
      'id': 'f1',
      'name': 'כהן',
      'status': 'active',
      'members': <dynamic>[
        <String, dynamic>{'id': 'm1', 'first': 'יוסי', 'birth': '2010-01-01'},
      ],
    };
    final course = <String, dynamic>{'id': 'c1', 'name': 'שחייה'};
    Map<String, dynamic> enr(int used) => <String, dynamic>{
          'id': 'e1',
          'plan': 'punch',
          'status': 'active',
          'purchased': 10,
          'used': used,
          'courseId': 'c1',
          'memberId': 'm1',
        };
    Map<String, dynamic> db(int used) => <String, dynamic>{
          'families': <dynamic>[fam],
          'courses': <dynamic>[course],
          'enrollments': <dynamic>[enr(used)],
        };
    final out2 = suggestions(db(8), today, null, sockets(holNone));
    ok(out2.length == 1 && (out2[0] as Map)['key'] == 'sug:renew:e1:10',
        'דוגמה 4: key-חידוש שגוי');
    ok(
        out2.isNotEmpty &&
            (out2[0] as Map)['detail'] == 'נותרו 2 ניקובים' &&
            (out2[0] as Map)['courseId'] == 'c1' &&
            (out2[0] as Map)['famId'] == 'f1',
        'דוגמה 4: פרטי-חידוש שגויים');
    final out0 = suggestions(db(10), today, null, sockets(holNone));
    ok(out0.length == 1 && (out0[0] as Map)['detail'] == 'הכרטיסייה נגמרה',
        'דוגמה 4: "הכרטיסייה נגמרה" חסר');
    final out3 = suggestions(db(7), today, null, sockets(holNone));
    ok(out3.length == 0, 'דוגמה 4: נותרו 3 — לא הייתה אמורה לעלות הצעה');
  }
  // 5) גידור-מודולים — shop כבוי ⇒ אין חג; courses כבוי ⇒ אין חידוש
  {
    final cfg = <String, dynamic>{'slug': 't'};
    final db = <String, dynamic>{
      'families': <dynamic>[
        <String, dynamic>{
          'id': 'f1',
          'name': 'כהן',
          'status': 'active',
          'members': <dynamic>[
            <String, dynamic>{'id': 'm1', 'first': 'יוסי', 'birth': '2010-01-01'},
          ],
        },
      ],
      'courses': <dynamic>[
        <String, dynamic>{'id': 'c1', 'name': 'שחייה'},
      ],
      'enrollments': <dynamic>[
        <String, dynamic>{
          'id': 'e1',
          'plan': 'punch',
          'status': 'active',
          'purchased': 10,
          'used': 9,
          'courseId': 'c1',
          'memberId': 'm1',
        },
      ],
    };
    final noShop = suggestions(
        db, today, cfg, sockets(holPesach, (dynamic c, dynamic m) => m != 'shop'));
    ok(
        !noShop.any((x) => (x as Map)['act'] == 'shop') &&
            noShop.any((x) => (x as Map)['act'] == 'courses'),
        'דוגמה 5: shop כבוי לא גודר');
    final noCourses = suggestions(
        db, today, cfg, sockets(holPesach, (dynamic c, dynamic m) => m != 'courses'));
    ok(
        !noCourses.any((x) => (x as Map)['act'] == 'courses') &&
            noCourses.any((x) => (x as Map)['act'] == 'shop'),
        'דוגמה 5: courses כבוי לא גודר');
  }
  // 6) משפחה לא-פעילה — לא מציפה, ואין הצעת-חג בלי משפחות פעילות
  {
    final db = emptyDb()
      ..['families'] = <dynamic>[
        <String, dynamic>{
          'id': 'f1',
          'name': 'סגור',
          'status': 'closed',
          'members': <dynamic>[
            <String, dynamic>{'id': 'm1', 'first': 'ילד', 'birth': '2020-03-01'},
          ],
        },
      ];
    final out = suggestions(db, today, null, sockets(holPesach));
    ok(out.length == 0, 'דוגמה 6: משפחה סגורה הציפה הצעות');
  }

  if (f != 0) throw StateError('suggestions: סטייה מהמקור');
  print('OK suggestions: 6 דוגמאות-חוזה — ירוק');
}
