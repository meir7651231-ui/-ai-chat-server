// בדיקת-חוזה (רתמת-זהב) · sessionsOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sessions-of.test.mjs:
//   1) מערך לא-ריק ⇒ מוחזר הוא-עצמו (זהות-הפניה, === ⇒ identical), כסדרו
//   2) sessions=[] ⇒ נפילה למפגש-יחיד {day:5,time:'09:15',label:''}
//   3) sessions חסר ⇒ אותה נפילה ({day:0,time:'20:00',label:''})
//   4) מפגש-יחיד במערך ⇒ המערך גובר (לא fallback), אותה הפניה
//   5) בנפילה — weekday=0 אינו נבלע כ-falsy, time='' עובר כמות-שהוא
// השוואת-מערכים = אורך + איבר-איבר (כלל-8). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sessions-of_test.dart ⇒ OK
import 'sessions-of.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) מערך לא-ריק ⇒ מוחזר הוא-עצמו (זהות-הפניה), כסדרו — אורך + איבר-איבר (כלל-8).
  {
    final sessions = [
      {'day': 2, 'time': '16:30', 'label': 'קבוצה א׳'},
      {'day': 4, 'time': '17:00', 'label': 'קבוצה ב׳'},
    ];
    final out = sessionsOf({'weekday': 1, 'time': '10:00', 'sessions': sessions});
    _ok(identical(out, sessions), 'מערך-מפגשים קיים חייב לחזור בזהות-הפניה, לא עותק'); n++;
    _ok(out.length == 2, 'אורך המערך השתבש'); n++;
    _ok(out[0]['day'] == 2 && out[0]['time'] == '16:30' && out[0]['label'] == 'קבוצה א׳',
        'איבר 0 השתבש'); n++;
    _ok(out[1]['day'] == 4 && out[1]['time'] == '17:00' && out[1]['label'] == 'קבוצה ב׳',
        'איבר 1 השתבש'); n++;
  }

  // 2) sessions=[] ⇒ נפילה למפגש-יחיד מהשדות הראשיים.
  {
    final out = sessionsOf({'weekday': 5, 'time': '09:15', 'sessions': []});
    _ok(out.length == 1, 'מערך-ריק חייב ליפול למפגש-יחיד'); n++;
    _ok(out[0]['day'] == 5 && out[0]['time'] == '09:15' && out[0]['label'] == '',
        'המפגש-הנבנה אינו {day:5,time:09:15,label:""}'); n++;
  }

  // 3) sessions חסר ⇒ אותה נפילה.
  {
    final out = sessionsOf({'weekday': 0, 'time': '20:00'});
    _ok(out.length == 1, 'sessions חסר: לא נפל למפגש-יחיד'); n++;
    _ok(out[0]['day'] == 0 && out[0]['time'] == '20:00' && out[0]['label'] == '',
        'sessions חסר: הנפילה לא נבנתה נכון'); n++;
  }

  // 4) מפגש-יחיד במערך ⇒ המערך גובר (לא fallback), אותה הפניה.
  {
    final sessions = [
      {'day': 3, 'time': '18:00', 'label': ''},
    ];
    final out = sessionsOf({'weekday': 9, 'time': 'XX', 'sessions': sessions});
    _ok(identical(out, sessions), 'מערך באורך 1 חייב לחזור כמות-שהוא, לא להיבנות מחדש'); n++;
    _ok(out.length == 1 && out[0]['day'] == 3 && out[0]['time'] == '18:00' && out[0]['label'] == '',
        'תוכן מערך-היחיד השתבש'); n++;
  }

  // 5) בנפילה — weekday=0 (ראשון) אינו נבלע כ-falsy, time='' עובר כמות-שהוא.
  {
    final out = sessionsOf({'weekday': 0, 'time': '', 'sessions': null});
    _ok(out.length == 1, 'sessions=null: לא נפל למפגש-יחיד'); n++;
    _ok(out[0]['day'] == 0, 'weekday=0 (יום ראשון) נבלע — חייב לעבור כמות-שהוא'); n++;
    _ok(out[0]['time'] == '', "time ריק חייב לעבור '' — לא להיות מומצא"); n++;
    _ok(out[0]['label'] == '', "label בנפילה חייב להיות ''"); n++;
  }

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(sessionsOf({'weekday': 1, 'time': 'x'}).length == 1, 'assert-live guard');

  print('OK sessionsOf: $n asserts passed');
}
