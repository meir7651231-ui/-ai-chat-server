// בדיקת-חוזה · propKeysFor — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/prop_keys_for_test.dart
import 'prop_keys_for.dart';

// טיפוס-השכן המבני (verbatim מהאטום): מתאר עם שדה editableProps יחיד, איבר עם name.
typedef _Desc = ({Iterable<({String name})> editableProps});

// שקע-הבדיקה: אוסף-מתארים כמפה + מאתר-פשוט (currying של findDescriptor(_descriptors, id)).
final Map<String, _Desc> _m = {
  'door': (editableProps: [
    (name: 'color'),
    (name: 'size'),
    (name: 'color'), // כפילות מכוונת ⇒ dedup (סמנטיקת Set)
  ]),
  'label': (editableProps: <({String name})>[]), // רשימה-ריקה
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

  // — 1 · נמצא + מאפיינים + כפילות ⇒ שמות מדויקים, dedup —
  _eqSet(
    propKeysFor('door', descriptors: _m, findDescriptor: _find),
    {'color', 'size'},
    '1 found+dedup',
  );
  n++;

  // — 2 · נמצא + editableProps ריק ⇒ קבוצה-ריקה —
  _eqSet(
    propKeysFor('label', descriptors: _m, findDescriptor: _find),
    <String>{},
    '2 found+empty-props',
  );
  n++;

  // — 3 · לא-נמצא (find מחזיר null) ⇒ fail-closed (R1-2) ⇒ ריק —
  _eqSet(
    propKeysFor('window', descriptors: _m, findDescriptor: _find),
    <String>{},
    '3 not-found',
  );
  n++;

  // — 4 · שקע שמחזיר null תמיד ⇒ ענף-ה-null המפורש —
  _eqSet(
    propKeysFor('door', descriptors: _m, findDescriptor: (_, __) => null),
    <String>{},
    '4 socket-null-branch',
  );
  n++;

  // — 5 · עדשה-עוינת: id ריק ⇒ אותו נתיב, לא-נמצא ⇒ ריק (אין guard מיוחד) —
  _eqSet(
    propKeysFor('', descriptors: _m, findDescriptor: _find),
    <String>{},
    '5 empty-id',
  );
  n++;

  // — 6 · מאפיין-בודד: נאמנות-תוכן מדויקת —
  final single = <String, _Desc>{
    'x': (editableProps: [(name: 'only')]),
  };
  _eqSet(
    propKeysFor('x', descriptors: single, findDescriptor: _find),
    {'only'},
    '6 single-prop',
  );
  n++;

  // — 7 · הענף-הריק מחזיר קבוצה שבאמת ריקה (isEmpty), לא null —
  final r = propKeysFor('nope', descriptors: _m, findDescriptor: _find);
  if (r.isEmpty != true) {
    throw StateError('FAIL [7 isEmpty]: expected empty set, got $r');
  }
  n++;

  // — 8 · גנריות <D>: descriptors מסוג אחר (List) עם מאתר מתאים —
  final list = <_Desc>[
    (editableProps: [(name: 'w'), (name: 'h')]),
  ];
  _eqSet(
    propKeysFor<List<_Desc>>('0',
        descriptors: list,
        findDescriptor: (l, id) =>
            (int.tryParse(id) != null && int.parse(id) < l.length)
                ? l[int.parse(id)]
                : null),
    {'w', 'h'},
    '8 generic-D-list',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    propKeysFor('door', descriptors: _m, findDescriptor: _find)
        .contains('size'),
    'assert-live guard',
  );

  print('OK propKeysFor: $n asserts passed');
}
