// בדיקת-חוזה · setEmployeeOverride — פורט Dart של new/atoms/set-employee-override.test.mjs
// הרצה: dart run --enable-asserts set-employee-override_test.dart
import 'dart:convert';
import 'set-employee-override.dart';

String _nrm(String e) => e.trim().toLowerCase();
String _j(dynamic v) => jsonEncode(v);

void main() {
  // 1) ארגון בלי מפה — המפתח מנורמל, {...undefined} תקף
  {
    final out = setEmployeeOverride({}, '  A@B.com ', {
      'modules': {'shop': false}
    }, _nrm);
    final mc = out['memberConfigs'] as Map;
    assert(mc.length == 1, 'חייב מפתח אחד בדיוק');
    assert(_j(mc['a@b.com']) == _j({'modules': {'shop': false}}),
        'הכרטיס חייב להיכתב תחת המייל המנורמל a@b.com');
  }

  // 2) החלפה מלאה — לא מיזוג
  {
    final org = {
      'memberConfigs': {
        'a@b.com': {'features': {'x': false}}
      }
    };
    final out = setEmployeeOverride(org, 'a@b.com', {
      'modules': {'shop': false}
    }, _nrm);
    final card = (out['memberConfigs'] as Map)['a@b.com'] as Map;
    assert(!card.containsKey('features'),
        'הכרטיס החדש חייב להחליף — features הישן אסור שישרוד (לא מיזוג)');
    assert((card['modules'] as Map)['shop'] == false, 'הכרטיס החדש חייב להיכתב');
  }

  // 3) שכנים נשמרים — בזהות-הפניה
  {
    final neighbor = {'weeklyGoal': 5};
    final org = {'memberConfigs': {'b@c.com': neighbor}};
    final out = setEmployeeOverride(org, 'a@b.com', {}, _nrm);
    final mc = out['memberConfigs'] as Map;
    assert(mc.length == 2, 'חייבים שני מפתחות — השכן + החדש');
    assert(identical(mc['b@c.com'], neighbor), 'כרטיס-השכן חייב לעבור בזהות-הפניה');
    assert(_j(mc['a@b.com']) == '{}', 'כרטיס ריק {} תקף — "רואה כמו הארגון"');
  }

  // 4) הכרטיס עובר בזהות-הפניה
  {
    final override = {'features': {'core.export': false}};
    final out = setEmployeeOverride({}, 'x@y.z', override, _nrm);
    assert(identical((out['memberConfigs'] as Map)['x@y.z'], override),
        'הכרטיס חייב לעבור בזהות-הפניה, לא עותק');
  }

  // 5) immutability — המפה המקורית לא משוכתבת
  {
    final orig = {
      'a@b.com': {'features': {'x': false}}
    };
    final org = {'memberConfigs': orig};
    final out = setEmployeeOverride(org, 'a@b.com', {
      'modules': {'shop': false}
    }, _nrm);
    assert(identical(org['memberConfigs'], orig) &&
        ((orig['a@b.com'] as Map)['features'] as Map)['x'] == false,
        'org.memberConfigs המקורי אסור שישתנה');
    assert(!identical(out['memberConfigs'], orig), 'חייבת לחזור מפה חדשה בהפניה');
  }

  // 6) 🔧 תיקון-הסגר — סדר-מפתחות-JS: אינדקס-מערך ממוין-מספרית קודם, אז השאר בסדר-הכנסה.
  {
    final org = {
      'memberConfigs': {'10': 'a', '2': 'b', 'z@x.com': 'c'}
    };
    final out = setEmployeeOverride(org, '1', 'd', _nrm);
    final mc = out['memberConfigs'] as Map;
    // JS: {2, 10, z@x.com} ⇒ אחרי הוספת '1' ⇒ {1, 2, 10, z@x.com}
    assert(mc.keys.toList().join(',') == '1,2,10,z@x.com',
        'סדר-מפתחות-JS: אינדקסים עולה קודם, אז שאר בסדר-הכנסה — קיבלנו ${mc.keys.toList()}');
    // 4294967295 (2^32−1) אינו אינדקס-מערך ⇒ נשאר עם מפתחות-המחרוזת בסדר-הכנסה
    final out2 = setEmployeeOverride(
        {'memberConfigs': {'4294967295': 'big', '5': 'x'}}, 'q', 'v', _nrm);
    assert((out2['memberConfigs'] as Map).keys.toList().join(',') ==
        '5,4294967295,q', 'הסף המדויק 2^32−2: 4294967295 אינו אינדקס');
  }

  print('✓ set-employee-override.dart: 6 בדיקות-חוזה (כולל סדר-מפתחות-JS) — ירוק');
}
