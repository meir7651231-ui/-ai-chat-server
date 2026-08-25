// רתמת-זהב · org-link — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות: אותם קלטים→פלטים).
import 'org-link.dart';

void main() {
  // 1) שורש רגיל
  assert(orgLink('https://maor.app', '/', 'demo') == 'https://maor.app/?org=demo', 'דוגמה 1');
  // 2) basePath של GitHub Pages
  assert(
    orgLink('https://x.github.io', '/maor-system/', 'or-rishon') ==
        'https://x.github.io/maor-system/?org=or-rishon',
    'דוגמה 2',
  );
  // 3) localhost
  assert(orgLink('http://localhost:5173', '/', 'test-org') == 'http://localhost:5173/?org=test-org', 'דוגמה 3');
  // 4) אפס-נירמול — שרשור בלבד
  assert(orgLink('', '', 'a') == '?org=a', 'דוגמה 4');
  // 5) עיוור לריק (חוק-5)
  assert(orgLink('https://maor.app', '', '') == 'https://maor.app?org=', 'דוגמה 5');
  print('✓ org-link (Dart): 5 דוגמאות-חוזה — ירוק');
}
