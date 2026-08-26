// בדיקת-חוזה · allowedValues — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/allowed_values_test.dart
import 'allowed_values.dart';

// טיפוס-השכן המבני (verbatim מהאטום): רשומת-מתאר עם שדה allowedValues יחיד.
typedef _Desc = ({Map<String, Iterable<String>> allowedValues});

// שקע-הבדיקה: אוסף-מתארים כמפה + מאתר-פשוט (currying של findDescriptor(_descriptors, id)).
final Map<String, _Desc> _m = {
  'door': (allowedValues: {
    'color': ['red', 'blue', 'red'], // כפילות מכוונת ⇒ dedup
    'size': <String>[], // רשימה-ריקה
  }),
};
_Desc? _find(Map<String, _Desc> m, String id) => m[id];

// השוואת-קבוצות: גודל + הכלה דו-כיוונית (Set סדר-לא-מובטח).
void _eqSet(Set<String> got, Set<String> want, String label) {
  final ok = got.length == want.length &&
      got.containsAll(want) &&
      want.containsAll(got);
  if (!ok) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — 1 · נמצא + propKey קיים + כפילות ⇒ dedup —
  _eqSet(
    allowedValues('door', 'color', descriptors: _m, findDescriptor: _find),
    {'red', 'blue'},
    '1 found+present+dedup',
  );
  n++;

  // — 2 · נמצא + propKey קיים + רשימה-ריקה ⇒ Set ריק —
  _eqSet(
    allowedValues('door', 'size', descriptors: _m, findDescriptor: _find),
    <String>{},
    '2 found+empty-list',
  );
  n++;

  // — 3 · נמצא + propKey חסר במפה ⇒ [propKey]==null ⇒ ריק —
  _eqSet(
    allowedValues('door', 'weight', descriptors: _m, findDescriptor: _find),
    <String>{},
    '3 found+missing-prop',
  );
  n++;

  // — 4 · לא-נמצא (find מחזיר null) ⇒ ?. מקצר ⇒ ריק —
  _eqSet(
    allowedValues('window', 'color', descriptors: _m, findDescriptor: _find),
    <String>{},
    '4 not-found',
  );
  n++;

  // — 5 · שקע שמחזיר null תמיד ⇒ ענף-ה-null המפורש —
  _eqSet(
    allowedValues('door', 'color',
        descriptors: _m, findDescriptor: (_, __) => null),
    <String>{},
    '5 socket-null-branch',
  );
  n++;

  // — 6 · עדשה-עוינת: id ריק / propKey ריק ⇒ עדיין דרך אותו נתיב, לא-נמצא ⇒ ריק —
  _eqSet(
    allowedValues('', '', descriptors: _m, findDescriptor: _find),
    <String>{},
    '6 empty-keys',
  );
  n++;

  // — 7 · הפלט הוא Set אמיתי: ערך-בודד + נאמנות-תוכן מדויקת —
  final single = <String, _Desc>{
    'x': (allowedValues: {'p': ['only']}),
  };
  _eqSet(
    allowedValues('x', 'p', descriptors: single, findDescriptor: _find),
    {'only'},
    '7 single-value',
  );
  n++;

  // — 8 · הענף-הריק מחזיר קבוצה שהיא באמת ריקה (isEmpty), לא null —
  final r = allowedValues('nope', 'p', descriptors: _m, findDescriptor: _find);
  if (r.isEmpty != true) {
    throw StateError('FAIL [8 isEmpty]: expected empty set, got $r');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    allowedValues('door', 'color', descriptors: _m, findDescriptor: _find)
        .contains('blue'),
    'assert-live guard',
  );

  print('OK allowedValues: $n asserts passed');
}
