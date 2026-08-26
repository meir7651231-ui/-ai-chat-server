// 🧪 הוכחת-חוצה-שפות · diary (יומן-חדרים · Dart) — מריצה את diary.dart על אותם
// קלטים/WANT כמו new/boxes/diary.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה.
// הערת-פורט: new Date(y, m0, d) של ה-JS הוא month 0-מבוסס (7=אוגוסט) ⇒ DateTime(y, m0+1, d).
import 'dart:convert';
import 'diary.dart' as D;

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

void main() {
  // fmtDate
  eq('fmtDate תקין', D.fmtDate('2026-08-24'), '24/08/2026');
  eq('fmtDate ריק', D.fmtDate(''), '—');
  eq('fmtDate שבור', D.fmtDate('bad'), '—');
  // localIso / isoToday (JS new Date(2026,7,24,12,0) = Aug 24 ⇒ DateTime(2026,8,24,12,0))
  eq('localIso', D.localIso(DateTime(2026, 8, 24, 12, 0)), '2026-08-24');
  eq('isoToday עם now מוזרק', D.isoToday(DateTime(2026, 8, 24, 12, 0)), '2026-08-24');
  // DAY_NAMES — 7 ימים כולל שבת
  eq('DAY_NAMES אורך', D.DAY_NAMES.length, 7);
  eq('DAY_NAMES שבת', D.DAY_NAMES[6], 'שבת');
  // pad2 / timeToMin / minToHM
  eq('pad2', D.pad2(5), '05');
  eq('timeToMin', D.timeToMin('09:30'), 570);
  ok('timeToMin שבור→NaN', (D.timeToMin('bad') as num).isNaN);
  eq('timeToMin trim', D.timeToMin(' 8:05 '), 485);
  eq('minToHM', D.minToHM(570), '09:30');
  eq('minToHM 0', D.minToHM(0), '00:00');
  // groupLabelOf
  eq('groupLabelOf ריק', D.groupLabelOf({'label': ''}, 0), 'קבוצה 1');
  eq('groupLabelOf label', D.groupLabelOf({'label': 'א'}, 3), 'א');
  // ABSENCE_REASON_CHIPS
  eq('chips[0]', D.ABSENCE_REASON_CHIPS[0], 'מחלה');
  eq('chips אורך', D.ABSENCE_REASON_CHIPS.length, 5);
  // makeupEligibility
  eq('noshow לעולם לא-זכאי', D.makeupEligibility('noshow', true, 999),
      {'eligible': false, 'dropsPunch': true});
  eq('ביטול-מוקדם ≥48', D.makeupEligibility('cancel', false, 48),
      {'eligible': true, 'dropsPunch': false});
  eq('ביטול מאוחר', D.makeupEligibility('cancel', false, 10),
      {'eligible': false, 'dropsPunch': true});
  eq('מוצדק', D.makeupEligibility('cancel', true, null),
      {'eligible': true, 'dropsPunch': false});
  // blockReason (JS months 0-based ⇒ +1)
  eq('שבת', D.blockReason(DateTime(2026, 8, 22, 12)), 'שבת');
  eq('שישי', D.blockReason(DateTime(2026, 8, 21, 12)), 'יום שישי (שעתיים לפני שבת)');
  eq('ט׳ באב נדחה (ראשון)', D.blockReason(DateTime(2022, 8, 7, 12)), 'תשעה באב (נדחה)');
  eq('דגל-חסימה כבוי', D.blockReason(DateTime(2026, 8, 22, 12), false), null);
  // planLabelOf — וריאנט-יומן
  eq('planLabelOf punch', D.planLabelOf({'plan': 'punch', 'purchased': 10, 'used': 3}),
      'כרטיסייה · יתרה 7/10');
  eq('planLabelOf punch לא-שלילי', D.planLabelOf({'plan': 'punch', 'purchased': 5, 'used': 8}),
      'כרטיסייה · יתרה 0/5');
  eq('planLabelOf month', D.planLabelOf({'plan': 'month'}), 'מנוי חודשי');
  // enrollStatusMeta — וריאנט-יומן (null default)
  eq('wait', D.enrollStatusMeta({'status': 'wait'}),
      {'label': 'רשימת-המתנה ⏳', 'bg': '#e7edf5', 'c': '#3a5a86'});
  eq('paused', D.enrollStatusMeta({'status': 'paused'}),
      {'label': 'מוקפא', 'bg': '#fdf1d4', 'c': '#9a6414'});
  eq('active→null (וריאנט-יומן)', D.enrollStatusMeta({'status': 'active'}), null);
  // chipStyle / roomInfoLabel
  eq('chipStyle bg', D.chipStyle('#fff', '#000')['background'], '#fff');
  eq('chipStyle radius', D.chipStyle('#fff', '#000')['borderRadius'], 999);
  eq(
      'roomInfoLabel מלא',
      D.roomInfoLabel({'slot': 45, 'cap': 12, 'access': true, 'eq': {'מקרן': true}}),
      'משבצות של 45 דק׳ · עד 12 משתתפים · נגיש · מקרן');
  eq('roomInfoLabel ברירת-מחדל', D.roomInfoLabel({'slot': 0}), 'משבצות של 60 דק׳');

  // buildSlots / enrollmentsForSession / weeklyRoomSessions / inactiveRoomCourses — תרחיש-קצה מלא
  final cfg = <String, dynamic>{'terms': <String, dynamic>{}};
  final room = <String, dynamic>{'id': 'r1', 'from': '09:00', 'to': '11:00', 'slot': 60, 'active': true};
  final course = <String, dynamic>{
    'id': 'c1', 'roomId': 'r1', 'name': 'ציור', 'weekday': 1, 'time': '09:00',
    'start': '', 'end': '', 'sessions': <dynamic>[]
  };
  final db = <String, dynamic>{
    'courses': [course], 'events': <dynamic>[], 'rooms': [room],
    'enrollments': [<String, dynamic>{'courseId': 'c1', 'group': ''}]
  };
  const mon = '2026-08-24'; // יום שני
  final slots = D.buildSlots(db, room, mon, null, cfg, false);
  ok('buildSlots משבץ חוג',
      slots.any((s) => s['kind'] == 'course' && (s['label'] as String).contains('ציור')));
  ok('buildSlots ללא ניקיון (דגל כבוי)', slots.every((s) => s['kind'] != 'cleaning'));
  final withClean =
      D.buildSlots(db, {...room, 'from': '14:00', 'to': '17:00'}, mon, null, cfg, true);
  ok('buildSlots ניקיון 15:00', withClean.any((s) => s['kind'] == 'cleaning'));
  eq('enrollmentsForSession מפגש-יחיד', D.enrollmentsForSession(db, course, 0).length, 1);
  eq('weeklyRoomSessions', D.weeklyRoomSessions(db, 'r1', mon), 1);
  eq(
      'inactiveRoomCourses חדר-לא-פעיל',
      D.inactiveRoomCourses(<String, dynamic>{
        'courses': [course],
        'rooms': [<String, dynamic>{'id': 'r1', 'active': false, 'name': 'אולם'}]
      }, mon, cfg),
      [<String, dynamic>{'course': course, 'roomName': 'אולם'}]);

  // 🛡 מגן-הכרעה (readFileSync + regex על diary.mjs) = מגן-מקור JS-תלוי ⇒ מדולג בפורט-Dart
  //    (החוזה נאכף כאן דרך הפלט הזהה-ביט; אין קובץ-מקור-JS לסרוק ב-Dart).

  if (fails > 0) {
    print('❌ קופסת-יומן (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('diary dart proof failed');
  }
  print('✓ קופסת-יומן (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
