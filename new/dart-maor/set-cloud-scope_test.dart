// בדיקת-חוזה (רתמת-זהב) · setCloudScope — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/set-cloud-scope.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/set-cloud-scope_test.dart  ⇒ exit 0
import 'set-cloud-scope.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // — דוגמה 1: ארגון-פלטפורמה — ('kehila', false) ⇒ {kehila, false} —
  {
    final s = setCloudScope('kehila', false);
    _ok(s['slug'] == 'kehila' && s['cloudRoot'] == false,
        'ארגון-פלטפורמה: הערך אינו {kehila,false}');
    n++;
    // בדיוק slug+cloudRoot — אורך + איבר-איבר (כלל-8: לא join, השוואה מפורשת).
    final keys = s.keys.toList();
    _ok(keys.length == 2, 'האובייקט חייב להכיל בדיוק 2 מפתחות');
    _ok(keys[0] == 'slug' && keys[1] == 'cloudRoot',
        'המפתחות חייבים להיות slug,cloudRoot בסדר-ההכנסה');
    n++;
  }

  // — דוגמה 2: מצב-השורש הבטוח — ('default', true) ⇒ {default, true} —
  {
    final s = setCloudScope('default', true);
    _ok(s['slug'] == 'default' && s['cloudRoot'] == true,
        'מצב-השורש: הערך אינו {default,true}');
    n++;
  }

  // — דוגמה 3: שתי קריאות ⇒ אובייקטים נפרדים בהפניה, שווים בתוכן —
  {
    final a = setCloudScope('demo', true);
    final b = setCloudScope('demo', true);
    _ok(!identical(a, b), 'אותו אובייקט הוחזר פעמיים — מצב דולף בין קריאות');
    _ok(a['slug'] == b['slug'] && a['cloudRoot'] == b['cloudRoot'],
        'תוכן שתי הקריאות חייב להיות זהה');
    n++;
  }

  // — דוגמה 4: הערכים עוברים כמות-שהם (אפס נרמול) —
  {
    final s = setCloudScope('or-rishon', true);
    _ok(s['slug'] == 'or-rishon',
        'ה-slug שונה בדרך — האטום חייב להעביר כמות-שהוא');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(setCloudScope('x', false)['cloudRoot'] == false, 'assert-live guard');

  print('OK setCloudScope: $n בלוקים — 4 דוגמאות-חוזה ירוק (טהור; ההשמה = חיווט-קופסה)');
}
