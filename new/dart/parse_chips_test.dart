// בדיקת-חוזה · parseChips — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/parse_chips_test.dart
import 'parse_chips.dart';

void _eqStr(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void _eqList(List<String> got, List<String> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: len got=${got.length} want=${want.length} · $got vs $want');
  }
  for (var k = 0; k < got.length; k++) {
    if (got[k] != want[k]) {
      throw StateError('FAIL [$label][$k]: got=${got[k]} want=${want[k]}');
    }
  }
}

int _check(
  String name,
  String nameHe, {
  String? type,
  List<String> l1 = const [],
  List<String> l2 = const [],
  List<String> l3 = const [],
  List<String> l4 = const [],
  String? l5,
  List<String> leftover = const [],
}) {
  final p = parseChips(nameHe);
  _eqStr(p.type, type, '$name.type');
  _eqList(p.level1, l1, '$name.l1');
  _eqList(p.level2, l2, '$name.l2');
  _eqList(p.level3, l3, '$name.l3');
  _eqList(p.level4, l4, '$name.l4');
  _eqStr(p.level5, l5, '$name.l5');
  _eqList(p.leftover, leftover, '$name.leftover');
  return 1;
}

void main() {
  var n = 0;

  // דוגמה 1 — ברך 45° פ.פ 160: '45°' חסום מ-size (צורה), '160' ⇒ מידה. (:257-264)
  n += _check('1', 'ברך 45° פ.פ 160',
      type: 'ברך', l2: ['45°'], l4: ['פ.פ'], l5: '160');

  // דוגמה 2 — compound l2 'אספקת מים' + יחידה נספחת ל-l5. (:293,269-273)
  n += _check('2', 'צינור אספקת מים 20 מ"מ',
      type: 'צינור', l2: ['אספקת מים'], l5: '20 מ"מ');

  // דוגמה 3 — סוג-מורכב 'מיכל הדחה' כ-type יחיד + פיצ'ר. (:238-251)
  n += _check('3', 'מיכל הדחה ספיר',
      type: 'מיכל הדחה', l3: ['ספיר']);

  // דוגמה 4 — חומר PPR מושמט מהנתיב. (:234)
  n += _check('4', 'צינור PPR 20', type: 'צינור', l5: '20');

  // דוגמה 5 — טוקן לא-מוכר ⇒ leftover. (:302)
  n += _check('5', 'ברך זמבורי 50',
      type: 'ברך', l5: '50', leftover: ['זמבורי']);

  // — נגזרות path + levelLabelOf על דוגמה 1 (:172-173,180-193) —
  final p1 = parseChips('ברך 45° פ.פ 160');
  _eqList(p1.path, ['45°', 'פ.פ', '160'], 'path.1'); n++;
  _eqStr(p1.levelLabelOf(0), 'צורה', 'label.0'); n++;
  _eqStr(p1.levelLabelOf(1), 'תבריג', 'label.1'); n++;
  _eqStr(p1.levelLabelOf(2), 'מידה', 'label.2'); n++;
  _eqStr(p1.levelLabelOf(-1), '', 'label.neg'); n++;
  _eqStr(p1.levelLabelOf(3), '', 'label.oob'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(parseChips('פקק').type == 'פקק', 'assert-live guard');

  print('OK parseChips: $n asserts passed');
}
