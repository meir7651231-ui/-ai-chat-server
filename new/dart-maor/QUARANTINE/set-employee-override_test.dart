// בדיקת-חוזה (רתמת-זהב) · setEmployeeOverride — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/set-employee-override.test.mjs:
//   1) org={} + '  A@B.com ' + {modules:{shop:false}} ⇒ מפתח יחיד מנורמל 'a@b.com' ({...undefined} תקף)
//   2) החלפה מלאה — הכרטיס החדש מחליף, features הישן לא שורד (לא מיזוג)
//   3) שכנים נשמרים בזהות-הפניה + כרטיס ריק {} תקף ("רואה כמו הארגון")
//   4) הכרטיס עובר בזהות-הפניה (identical), לא עותק
//   5) immutability — org.memberConfigs המקורי לא שוכתב; חוזרת מפה חדשה בהפניה
// nrm = (e) => e.trim().toLowerCase() — שקע-הנירמול, זהה למקור.
// כלל-2 (null≠undefined): "features הישן אסור שישרוד" נבדק ב-!containsKey (לא ==null).
// הרצה: dart run --enable-asserts new/dart-maor/set-employee-override_test.dart ⇒ exit 0
import 'set-employee-override.dart';

String _nrm(String e) => e.trim().toLowerCase();

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) ארגון בלי מפה — המפתח מנורמל, {...undefined} תקף.
  {
    final out = setEmployeeOverride(
        {}, '  A@B.com ', {'modules': {'shop': false}}, _nrm);
    final map = out['memberConfigs'] as Map;
    _ok(map.keys.length == 1, 'חייב מפתח אחד בדיוק');
    final card = map['a@b.com'] as Map;
    _ok(card.keys.length == 1 && card.containsKey('modules'),
        'הכרטיס חייב להיכתב תחת המייל המנורמל a@b.com');
    final mods = card['modules'] as Map;
    _ok(mods.keys.length == 1 && mods['shop'] == false,
        'תוכן-הכרטיס חייב להיות {modules:{shop:false}} בדיוק');
    n++;
  }

  // 2) החלפה מלאה — לא מיזוג.
  {
    final org = {
      'memberConfigs': {
        'a@b.com': {'features': {'x': false}}
      }
    };
    final out = setEmployeeOverride(
        org, 'a@b.com', {'modules': {'shop': false}}, _nrm);
    final card = (out['memberConfigs'] as Map)['a@b.com'] as Map;
    _ok(!card.containsKey('features'),
        'הכרטיס החדש חייב להחליף — features הישן אסור שישרוד (לא מיזוג)');
    _ok((card['modules'] as Map)['shop'] == false, 'הכרטיס החדש חייב להיכתב');
    n++;
  }

  // 3) שכנים נשמרים — בזהות-הפניה; כרטיס ריק {} תקף.
  {
    final neighbor = {'weeklyGoal': 5};
    final org = {
      'memberConfigs': {'b@c.com': neighbor}
    };
    final out = setEmployeeOverride(org, 'a@b.com', <String, dynamic>{}, _nrm);
    final map = out['memberConfigs'] as Map;
    _ok(map.keys.length == 2, 'חייבים שני מפתחות — השכן + החדש');
    _ok(identical(map['b@c.com'], neighbor),
        'כרטיס-השכן חייב לעבור בזהות-הפניה');
    _ok((map['a@b.com'] as Map).isEmpty,
        'כרטיס ריק {} תקף — "רואה כמו הארגון"');
    n++;
  }

  // 4) הכרטיס עובר בזהות-הפניה.
  {
    final override = {'features': {'core.export': false}};
    final out = setEmployeeOverride({}, 'x@y.z', override, _nrm);
    _ok(identical((out['memberConfigs'] as Map)['x@y.z'], override),
        'הכרטיס חייב לעבור בזהות-הפניה, לא עותק');
    n++;
  }

  // 5) immutability — המפה המקורית לא משוכתבת.
  {
    final orig = {
      'a@b.com': {'features': {'x': false}}
    };
    final org = {'memberConfigs': orig};
    final out = setEmployeeOverride(
        org, 'a@b.com', {'modules': {'shop': false}}, _nrm);
    _ok(
        identical(org['memberConfigs'], orig) &&
            ((orig['a@b.com'] as Map)['features'] as Map)['x'] == false,
        'org.memberConfigs המקורי אסור שישתנה');
    _ok(!identical(out['memberConfigs'], orig), 'חייבת לחזור מפה חדשה בהפניה');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      ((setEmployeeOverride({}, 'z@Z.z', <String, dynamic>{}, _nrm)
              ['memberConfigs'] as Map)['z@z.z'] as Map)
          .isEmpty,
      'assert-live guard');

  print('OK setEmployeeOverride: $n contract examples passed');
}
