// רתמת-זהב · ics-feed-url — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות; אותם קלטים→פלטים).
import 'ics-feed-url.dart';

void main() {
  // 1 בסיס
  assert(
      icsFeedUrl('my-proj', 'demo', 'abc123') ==
          'https://us-central1-my-proj.cloudfunctions.net/icsFeed?org=demo&key=abc123',
      '✗ 1 בסיס');
  // 2 רווח-ב-slug ⇒ %20
  assert(
      icsFeedUrl('p', 'a b', 't') ==
          'https://us-central1-p.cloudfunctions.net/icsFeed?org=a%20b&key=t',
      '✗ 2 רווח-ב-slug');
  // 3 slug-עברי ⇒ UTF-8 hex-גדול
  assert(
      icsFeedUrl('p', 'ארגון', 't') ==
          'https://us-central1-p.cloudfunctions.net/icsFeed?org=%D7%90%D7%A8%D7%92%D7%95%D7%9F&key=t',
      '✗ 3 slug-עברי');
  // 4 token-כמו-שהוא (לא מקודד)
  assert(
      icsFeedUrl('p', 's', 'a1b2c3d4').endsWith('&key=a1b2c3d4'),
      '✗ 4 token-כמו-שהוא');
  print('✓ ics-feed-url (Dart): 4 דוגמאות-חוזה — ירוק');
}
