import 'group-remap-on-removal.dart';

/// רתמת-זהב: אותן 5 דוגמאות-חוזה בדיוק מ-new/atoms/group-remap-on-removal.test.mjs.
/// השקע החוזי (מראה של courses/lib.ts groupLabelOf) — truthiness של JS: label
/// ריק/חסר ⇒ "קבוצה N" פוזיציוני (כלל-המרה #7: תנאי-מפורש במקום `||`).
String _groupLabelOf(dynamic s, int i) {
  final label = (s as Map)['label'];
  final falsy = label == null || label == '' || label == false;
  return falsy ? 'קבוצה ${i + 1}' : label as String;
}

void main() {
  final c = <List<dynamic>>[
    [
      [<String, dynamic>{}, <String, dynamic>{}, <String, dynamic>{}],
      0,
      'קבוצה 1',
      [
        ['קבוצה 2', 'קבוצה 1'],
        ['קבוצה 3', 'קבוצה 2']
      ],
      'הסרת הראשון ⇒ כל הבאים זזים',
    ],
    [
      [<String, dynamic>{}, <String, dynamic>{}, <String, dynamic>{}],
      2,
      'קבוצה 3',
      <List<String>>[],
      'הסרת האחרון ⇒ remap ריק',
    ],
    [
      [<String, dynamic>{}, <String, dynamic>{'label': 'בוגרים'}, <String, dynamic>{}],
      0,
      'קבוצה 1',
      [
        ['קבוצה 3', 'קבוצה 2']
      ],
      'label מפורש לא זז ולא נכנס ל-remap',
    ],
    [
      [<String, dynamic>{}],
      0,
      'קבוצה 1',
      <List<String>>[],
      'מפגש-יחיד',
    ],
    [
      [<String, dynamic>{'label': 'בוגרים'}, <String, dynamic>{}],
      0,
      'בוגרים',
      [
        ['קבוצה 2', 'קבוצה 1']
      ],
      'הסרת מפגש-מתויג ⇒ removed=התווית המפורשת',
    ],
  ];

  var f = 0;
  for (final row in c) {
    final sessions = row[0] as List;
    final idx = row[1] as int;
    final wantRemoved = row[2] as String;
    final wantPairs = (row[3] as List).cast<List>();
    final msg = row[4] as String;

    final got = groupRemapOnRemoval(sessions, idx, _groupLabelOf);
    final gotPairs = got.remap.entries.toList();

    var pairsOk = gotPairs.length == wantPairs.length;
    if (pairsOk) {
      for (var j = 0; j < gotPairs.length; j++) {
        if (gotPairs[j].key != wantPairs[j][0] ||
            gotPairs[j].value != wantPairs[j][1]) {
          pairsOk = false;
          break;
        }
      }
    }

    if (got.removed != wantRemoved || !pairsOk) {
      print('✗ $msg ⇒ removed=${got.removed}, remap=$gotPairs ≠ $wantRemoved, $wantPairs');
      f = 1;
    }
  }

  if (f != 0) throw StateError('group-remap-on-removal: סטייה מהמקור');
  print('✓ group-remap-on-removal: 5 דוגמאות-חוזה — ירוק (מזהי-קבוצה יציבים, #8/#9)');
}
