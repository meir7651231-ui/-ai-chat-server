import 'set-export-blocked.dart';

/// רתמת-זהב: אותן 5 דוגמאות-חוזה בדיוק מ-new/atoms/set-export-blocked.test.mjs.
void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  // 1) חסימה עם התרעה — עוברת בזהות-הפניה ואינה נקראת
  {
    var calls = 0;
    void spy() {
      calls++;
    }

    final out = setExportBlocked(true, spy);
    ok(out['blocked'] == true, 'blocked=true חייב להישמר');
    ok(identical(out['notify'], spy),
        'ההתרעה חייבת לעבור בזהות-הפניה — אותה פונקציה בדיוק');
    ok(calls == 0, 'האטום אסור שיקרא להתרעה — הקריאה שייכת ל-guardExport');
  }
  // 2) לא-חסום בלי התרעה ⇒ notify=null (‏undefined של JS = היעדר-ארגומנט ב-Dart)
  {
    final out = setExportBlocked(false);
    ok(out['blocked'] == false && out['notify'] == null,
        'התרעה חסרה חייבת להתנרמל ל-null');
  }
  // 3) חסימה בלי toast תקפה
  {
    final out = setExportBlocked(true);
    ok(out['blocked'] == true && out['notify'] == null,
        'חסימה בלי התרעה: {blocked:true, notify:null}');
  }
  // 4) null נשאר null (?? null)
  {
    final out = setExportBlocked(false, null);
    ok(out['notify'] == null, 'onBlocked=null חייב להישאר null');
  }
  // 5) שתי קריאות זהות ⇒ הפניות שונות, תוכן שווה, בדיוק שני מפתחות
  {
    final a = setExportBlocked(true);
    final b = setExportBlocked(true);
    ok(!identical(a, b), 'אותו אובייקט הוחזר פעמיים — מצב דולף בין קריאות');
    ok(a['blocked'] == b['blocked'] && a['notify'] == b['notify'],
        'תוכן שתי הקריאות חייב להיות זהה');
    ok(a.keys.length == 2, 'הפלט חייב להכיל בדיוק blocked+notify');
    // כלל-8: השוואת אוסף-המפתחות = אורך + איבר-איבר (לא join)
    final ks = a.keys.toList();
    ok(ks.length == 2 && ks[0] == 'blocked' && ks[1] == 'notify',
        'סדר-המפתחות חייב להיות blocked ואז notify (כמו JS)');
  }
  if (f != 0) throw StateError('set-export-blocked: סטייה מהמקור');
  print('✓ set-export-blocked: 5 דוגמאות-חוזה — ירוק (טהור; ההשמה = חיווט-קופסה)');
}
