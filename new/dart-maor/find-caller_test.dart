// בדיקת-חוזה (רתמת-זהב) · findCaller — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/find-caller.test.mjs
// (אותם קלטים→פלטים). phoneKey-מזויף לפי חוזה החוט המשותף.
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts find-caller_test.dart ⇒ exit 0.
import 'find-caller.dart';

// phoneKey-מזויף: ספרות בלבד, ניכוי 00/972 ואפסים מובילים — כמו ה-JS.
String phoneKey(String raw) {
  var d = raw.replaceAll(RegExp(r'\D'), '');
  if (d.isEmpty) return '';
  if (d.startsWith('00')) d = d.substring(2);
  if (d.startsWith('972')) d = d.substring(3);
  return d.replaceFirst(RegExp(r'^0+'), '');
}

bool _deepEq(Object? a, Object? b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false; // תופס famId עודף/חסר
    for (final k in a.keys) {
      if (!b.containsKey(k)) return false;
      if (!_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  return a == b;
}

void _eq(Object? got, Object? want, String msg) {
  if (!_deepEq(got, want)) {
    throw StateError('FAIL: $msg ⇒ $got');
  }
}

void main() {
  var n = 0;

  final db = <String, Object?>{
    'families': [
      {'id': 'f1', 'name': 'כהן', 'phone': '0501234567', 'phone2': ''},
      {
        'id': 'f2',
        'name': 'לוי',
        'phone': '0468880009',
        'members': [
          {'id': 'm1', 'first': 'דוד', 'phone': '0529990001'}
        ],
      },
    ],
    'supporters': [
      {'id': 's0', 'name': 'כפול', 'phone': '0501234567'}, // אותו מספר כמו f1
      {'id': 's1', 'name': 'רוזן', 'phone': '0537770002'},
    ],
    'volunteers': [
      {'id': 'v1', 'name': 'גל', 'phone': '0546660003'}
    ],
    'tzCoordinators': [
      {'id': 'c1', 'name': 'רות', 'phone': '0585550004'}
    ],
  };

  // 1) משפחה — נרמול בינ"ל
  _eq(
    findCaller(db, '+972 50-123-4567', phoneKey),
    {
      'kind': 'family',
      'name': 'כהן',
      'phone': '0501234567',
      'id': 'f1',
      'view': 'families',
      'famId': 'f1',
    },
    'התאמת-משפחה שגויה',
  );
  n++;

  // 2) בן-משפחה — name = first · שם-המשפחה
  _eq(
    findCaller(db, '052-999-0001', phoneKey),
    {
      'kind': 'member',
      'name': 'דוד · לוי',
      'phone': '0529990001',
      'id': 'm1',
      'view': 'families',
      'famId': 'f2',
    },
    'התאמת-בן-משפחה שגויה',
  );
  n++;

  // 3) עדיפות: משפחה לפני תורם באותו מספר
  _eq((findCaller(db, '0501234567', phoneKey))?['kind'], 'family',
      'העדיפות משפחה-לפני-תורם נשברה');
  n++;

  // 4) תורם ⇒ supporters, בלי famId
  _eq(
    findCaller(db, '0537770002', phoneKey),
    {
      'kind': 'supporter',
      'name': 'רוזן',
      'phone': '0537770002',
      'id': 's1',
      'view': 'supporters',
    },
    'התאמת-תורם שגויה',
  );
  n++;

  // 5) מתנדב ⇒ shop7 · רכז ⇒ tzedaka
  _eq((findCaller(db, '0546660003', phoneKey))?['view'], 'shop7',
      'מתנדב לא ניתב ל-shop7');
  n++;
  _eq((findCaller(db, '0585550004', phoneKey))?['view'], 'tzedaka',
      'רכז לא ניתב ל-tzedaka');
  n++;

  // 6) מפתח קצר (<6) ⇒ null גם כשמספר זהה שמור
  final dbShort = <String, Object?>{
    'families': [
      {'id': 'f9', 'name': 'קצר', 'phone': '12345'}
    ],
    'supporters': [],
  };
  _eq(findCaller(dbShort, '12345', phoneKey), null, 'מספר-קצר לא החזיר null');
  n++;

  // 7) בלי volunteers/tzCoordinators + לא-מוכר ⇒ null בלי קריסה
  _eq(
    findCaller(
        <String, Object?>{'families': [], 'supporters': []}, '0500000009', phoneKey),
    null,
    'מערכים-חסרים הפילו/החזירו-ערך',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(findCaller(db, '0501234567', phoneKey)?['kind'] == 'family',
      'assert-live guard');

  print('OK findCaller: $n asserts passed');
}
