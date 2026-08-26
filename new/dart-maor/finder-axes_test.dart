import '../dart-data-maor/finder-axes-terms.dart';
/// רתמת-זהב · finder-axes — 3 דוגמאות-החוזה בדיוק כמו new/atoms/finder-axes.test.mjs.
/// אם עובר: Dart ≡ JS (אותם קלטים → אותם פלטים).
import 'finder-axes.dart';

void main() {
  // 1) termOf של ברירות-מחדל ⇒ תוויות-המקור.
  String fb(Map<String, dynamic> _c, String _k, String fallback) => fallback;
  var a = finderAxes({}, fb, term: (k)=>kTerms[k]!);
  assert(a.length == 9, 'דוגמה 1: האורך ≠ 9');
  assert(a[0][0] == 'city' && a[0][1] == 'עיר', "דוגמה 1: [0] ≠ ['city','עיר']");
  assert(a[4][0] == 'cred' && a[4][1] == 'אמינות', "דוגמה 1: [4] ≠ ['cred','אמינות']");
  assert(a[6][0] == 'enrolled' && a[6][1] == 'חוגים', "דוגמה 1: [6] ≠ ['enrolled','חוגים']");
  assert(a[8][0] == 'lang' && a[8][1] == 'שפה', "דוגמה 1: [8] ≠ ['lang','שפה']");

  // 2) מילון שממפה nav.courses ⇒ רק תווית-enrolled מתחלפת.
  final dict = {'nav.courses': 'שיעורים'};
  String termOf(Map<String, dynamic> _c, String k, String fallback) =>
      dict[k] ?? fallback;
  a = finderAxes({}, termOf, term: (k)=>kTerms[k]!);
  assert(a[6][1] == 'שיעורים', "דוגמה 2: [6] לא קיבל 'שיעורים' מהמילון");
  assert(a[4][1] == 'אמינות', 'דוגמה 2: cred זז מברירת-המחדל');

  // 3) סדר-המפתחות המחייב.
  assert(
    a.map((x) => x[0]).join(',') ==
        'city,comm,marital,status,cred,kids,enrolled,sefach,lang',
    'דוגמה 3: סדר-הצירים השתנה',
  );

  print('✓ finder-axes (Dart): 3 דוגמאות-חוזה — ירוק');
}
