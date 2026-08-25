// בדיקת-חוזה (רתמת-זהב) · sanitizeIncoming — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sanitize-incoming.test.mjs
// (אותם קלטים→פלטים, כולל בדיקות זהות-הפניה). השוואת-מערכים = אורך+איבר-איבר (כלל-8).
// הרצה: dart run --enable-asserts new/dart-maor/sanitize-incoming_test.dart ⇒ exit 0
import 'sanitize-incoming.dart';

int _f = 0;

void _chk(String name, bool cond) {
  if (!cond) {
    _f = 1;
    print('✗ $name');
  }
}

/// מערך-ריק: List באורך 0 — אורך + (אין איברים להשוות) לפי כלל-8.
bool _isEmptyList(Object? v) => v is List && v.length == 0;

void main() {
  // 1) families בלי שדות-רשימה ⇒ שניהם מושלמים; המקור לא שונה
  {
    final item = <String, dynamic>{'id': 'f1'};
    final out = sanitizeIncoming('families', item);
    _chk(
        '1 members+docs הושלמו כ-[] בעותק חדש',
        !identical(out, item) &&
            out['id'] == 'f1' &&
            _isEmptyList(out['members']) &&
            _isEmptyList(out['docs']) &&
            !item.containsKey('members'));
  }

  // 2) שדה תקין נשמר בהפניה; שדה שבור מוחלף
  {
    final members = <dynamic>[
      {'id': 'm1'}
    ];
    final out = sanitizeIncoming(
        'families', {'id': 'f1', 'members': members, 'docs': 'שבור'});
    _chk(
        '2 ‏members נשמר, docs הוחלף ב-[]',
        identical(out['members'], members) && _isEmptyList(out['docs']));
  }

  // 3) אוסף שאינו בטבלה ⇒ אותה הפניה
  {
    final item = <String, dynamic>{'id': 'r1'};
    _chk('3 ‏rooms מוחזר כמות-שהוא',
        identical(sanitizeIncoming('rooms', item), item));
  }

  // 4) הכל תקין ⇒ אותה הפניה (אין שכפול)
  {
    final item = <String, dynamic>{'id': 's1', 'donations': <dynamic>[]};
    _chk('4 ‏supporters תקין — זהות-הפניה',
        identical(sanitizeIncoming('supporters', item), item));
  }

  // 5) shopAssignments עם null ⇒ שני השדות מערכים
  {
    final out =
        sanitizeIncoming('shopAssignments', {'id': 'a1', 'redemptions': null});
    _chk(
        '5 ‏redemptions+criterionIds ⇒ []',
        _isEmptyList(out['redemptions']) && _isEmptyList(out['criterionIds']));
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_f == 0, 'sanitize-incoming contract examples must be green');

  if (_f != 0) {
    throw StateError('sanitize-incoming: דוגמאות-חוזה נכשלו');
  }
  print('✓ sanitize-incoming: 5 דוגמאות-חוזה — ירוק');
  print('OK');
}
