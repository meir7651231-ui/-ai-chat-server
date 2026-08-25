// בדיקת-חוזה (רתמת-זהב) · mergeSupporterInto — מייבאת אך ורק את האטום-שלה (חוק-4).
// 7 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/merge-supporter-into.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/merge-supporter-into_test.dart  ⇒ exit 0
import 'merge-supporter-into.dart';

// שקע-mergeHist בסמנטיקת-maor המתועדת בחוזה (מקומי לבדיקה — מייבאת רק את האטום שלה):
// מפתח d|a|c, אידמפוטנטי — רשומה נכנסת שכבר קיימת לא מוכפלת.
List<dynamic> _mergeHist(dynamic existing, dynamic incoming) {
  String key(dynamic h) =>
      (h as Map)['d'].toString() + '|' + h['a'].toString() + '|' + (h['c'] ?? '₪').toString();
  final ex = existing as List;
  final seen = ex.map(key).toSet();
  return <dynamic>[...ex, ...(incoming as List).where((h) => !seen.contains(key(h)))];
}

const int photoMax = 5; // ערך-ההצבה של maor (photoGallery.ts:8)

Map<String, dynamic> sup(Map<String, dynamic> o) => <String, dynamic>{
      'id': 'x', 'name': '', 'phone': '', 'email': '', 'address': '', 'city': '',
      'idNum': '', 'cat': '', 'forWho': '', 'notes': '', 'donations': <dynamic>[],
      'count': 0, 'ils': 0, 'usd': 0, 'first': '', 'last': '', ...o,
    };

bool _listEq(dynamic a, dynamic b) {
  final la = a as List;
  final lb = b as List;
  if (la.length != lb.length) return false;
  for (var i = 0; i < la.length; i++) {
    if (la[i] != lb[i]) return false;
  }
  return true;
}

void main() {
  // דוגמה 1 — כסף: צבירה מחושבת-מחדש, מיון-תאריך
  {
    final keep = sup({
      'id': 'a', 'name': 'ראובן',
      'donations': [
        {'date': '2026-01-01', 'amount': 100, 'cur': '₪'}
      ],
      'count': 1, 'ils': 100, 'first': '2026-01-01', 'last': '2026-01-01',
    });
    final drop = sup({
      'id': 'b',
      'donations': [
        {'date': '2025-12-01', 'amount': 50, 'cur': '\$'}
      ],
      'count': 1, 'usd': 50,
    });
    final out = mergeSupporterInto(keep, drop, _mergeHist, photoMax);
    assert((out['donations'][0] as Map)['date'] == '2025-12-01' &&
        (out['donations'][1] as Map)['date'] == '2026-01-01'); // 1 מיון-תאריך
    assert(out['count'] == 2 && out['ils'] == 100 && out['usd'] == 50); // 1 צבירה
    assert(out['first'] == '2025-12-01' && out['last'] == '2026-01-01'); // 1 first/last
    assert((keep['donations'] as List).length == 1 && keep['ils'] == 100); // 1 לא-משנה-קלט
  }

  // דוגמה 2 — שדות-קשר: השומר גובר, ריק ⇒ של הנמחק
  {
    final out = mergeSupporterInto(
      sup({'phone': '', 'city': 'ירושלים'}),
      sup({'phone': '050-1112222', 'city': 'חיפה'}),
      _mergeHist, photoMax,
    );
    assert(out['phone'] == '050-1112222'); // 2 טלפון-מהנמחק
    assert(out['city'] == 'ירושלים'); // 2 עיר-השומר
  }

  // דוגמה 3 — הערות מובחנות
  {
    final same = mergeSupporterInto(
        sup({'notes': 'ותיק'}), sup({'notes': 'ותיק'}), _mergeHist, photoMax);
    assert(same['notes'] == 'ותיק'); // 3 בלי-כפל
    final two = mergeSupporterInto(
        sup({'notes': 'ותיק'}), sup({'notes': 'מהייבוא'}), _mergeHist, photoMax);
    assert(two['notes'] == 'ותיק · מהייבוא'); // 3 איחוד
  }

  // דוגמה 4 — hist דרך השקע האידמפוטנטי; ריק ⇒ אין מפתח
  {
    final h = {'d': '2026-01-01', 'a': 200};
    final out = mergeSupporterInto(
      sup({'hist': [h]}),
      sup({'hist': [{...h}]}),
      _mergeHist, photoMax,
    );
    assert((out['hist'] as List).length == 1); // 4 hist-ממוזג-פעם-אחת
    final none = mergeSupporterInto(sup({}), sup({}), _mergeHist, photoMax);
    assert(!none.containsKey('hist')); // 4 hist-ריק-לא-נכתב
  }

  // דוגמה 5 — photos: איחוד ייחודי, השומר קודם, תקרה
  {
    final out = mergeSupporterInto(
      sup({'photos': ['p1', 'p2']}),
      sup({'photos': ['p2', 'p3', 'p4', 'p5', 'p6']}),
      _mergeHist, photoMax,
    );
    assert(_listEq(out['photos'], ['p1', 'p2', 'p3', 'p4', 'p5'])); // 5 תקרה
    final none = mergeSupporterInto(sup({}), sup({}), _mergeHist, photoMax);
    assert(!none.containsKey('photos')); // 5 photos-ריק-לא-נכתב
  }

  // דוגמה 6 — nextNote מהנמחק כשריק; nextEventId של השומר בלבד
  {
    final out = mergeSupporterInto(
      sup({'nextNote': ''}),
      sup({'nextNote': 'להתקשר', 'nextEventId': 'ev9'}),
      _mergeHist, photoMax,
    );
    assert(out['nextNote'] == 'להתקשר'); // 6 nextNote
    assert(out['nextEventId'] == null); // 6 nextEventId-לא-עובר
  }

  // דוגמה 7 — hok מהנמחק; אפס-תרומות ⇒ צבירת-אפס ו-first/last ריקים
  {
    final out = mergeSupporterInto(sup({'first': ''}),
        sup({'hok': {'amount': 180, 'day': 1}}), _mergeHist, photoMax);
    assert(out['hok'] != null &&
        (out['hok'] as Map)['amount'] == 180 &&
        (out['hok'] as Map)['day'] == 1); // 7 hok
    assert(out['count'] == 0 &&
        out['ils'] == 0 &&
        out['usd'] == 0 &&
        out['first'] == '' &&
        out['last'] == ''); // 7 אפס-תרומות
  }

  print('✓ merge-supporter-into (Dart): 7 דוגמאות-חוזה — ירוק');
}
