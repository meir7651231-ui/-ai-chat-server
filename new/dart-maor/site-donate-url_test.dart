// בדיקת-חוזה · site-donate-url — 7 דוגמאות-החוזה מהמקור + זריקה על config=null.
import 'site-donate-url.dart';

int f = 0;
void eq(dynamic a, dynamic b, String msg) {
  if (a != b) {
    print('✗ $msg ⇒ got=$a want=$b');
    f = 1;
  }
}

void main() {
  // 1) הישיר גובר
  eq(siteDonateUrl({'site': {'donateUrl': 'https://pay.me/x'}}),
      'https://pay.me/x', 'הישיר לא הוחזר');

  // 2) ריק אינו נחשב — נפילה ל-payUrl
  eq(siteDonateUrl({'site': {'donateUrl': ''}, 'integrations': {'payments': {'payUrl': 'https://p.io/q'}}}),
      'https://p.io/q', 'נפילה-ל-payUrl נכשלה');

  // 3) שניהם קיימים — הישיר מנצח
  eq(siteDonateUrl({'site': {'donateUrl': 'https://pay.me/x'}, 'integrations': {'payments': {'payUrl': 'https://p.io/q'}}}),
      'https://pay.me/x', 'עדיפות-הישיר נשברה');

  // 4) בלי site בכלל
  eq(siteDonateUrl({'integrations': {'payments': {'payUrl': 'https://p.io/q'}}}),
      'https://p.io/q', 'payUrl בלי site לא הוחזר');

  // 5) קונפיג ריק
  eq(siteDonateUrl({}), null, 'קונפיג ריק לא החזיר null');

  // 6) לא-מחרוזת נפסל בשתי התחנות
  eq(siteDonateUrl({'site': {'donateUrl': 5}, 'integrations': {'payments': {'payUrl': 7}}}),
      null, 'לא-מחרוזת לא נפסל');

  // 7) payments בלי payUrl
  eq(siteDonateUrl({'integrations': {'payments': {}}}), null, 'payments ריק לא החזיר null');

  // 8) 🔧 תיקון-ההסגר: config=null ⇒ זריקה (נאמנות-JS, לא ריכוך-ל-null)
  var threw = false;
  try {
    siteDonateUrl(null);
  } catch (_) {
    threw = true;
  }
  if (!threw) {
    print('✗ config=null לא זרק (ריכוך-יתר — הבאג שתוקן)');
    f = 1;
  }

  if (f != 0) throw StateError('site-donate-url: סטייה מהמקור');
  print('✓ site-donate-url: 7 דוגמאות-חוזה + זריקת-null — ירוק');
}
