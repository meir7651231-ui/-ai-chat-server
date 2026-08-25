// רתמת-זהב · org-join-link — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
import 'org-join-link.dart';

void main() {
  assert(
      orgJoinLink('https://x.org', '/', 'maor', 'ab12cd34') ==
          'https://x.org/?org=maor&join=ab12cd34',
      '✗ קישור עם basePath /');
  assert(
      orgJoinLink('https://x.org', '', 'maor', 'ab12cd34') ==
          'https://x.org?org=maor&join=ab12cd34',
      '✗ basePath ריק');
  assert(
      orgJoinLink('https://meir.github.io', '/maor-system/', 'demo', 'z9') ==
          'https://meir.github.io/maor-system/?org=demo&join=z9',
      '✗ basePath של gh-pages');
  assert(orgJoinLink('', '', '', '') == '?org=&join=', '✗ הכול ריק ⇒ שלד-הקישור');
  print('✓ org-join-link (Dart): 4 דוגמאות-חוזה — ירוק');
}
