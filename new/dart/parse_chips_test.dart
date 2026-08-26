// בדיקת-חוזה · parseChips — מייבאת אך ורק את האטום-שלה (חוק-4).
// המנוע נבדק עם **מילוני-סיווג מוזרקים זעירים** (תת-קבוצה של המקור) — מוכיח מנגנון,
// לא ערכי-קטלוג. הטענה "הדאטה מוחלפת ⇒ הפלט משתנה" מוכיחה שהמילונים מוזרקים, לא צרובים.
// הרצה: dart run --enable-asserts new/dart/parse_chips_test.dart
import 'parse_chips.dart';

// ─── מילוני-סיווג זעירים מוזרקים (תת-קבוצת-מקור מספיקה לדוגמאות) ───────────────
const _chipTypes = {'ברך', 'צינור'};
const _compoundTypes = {'מיכל הדחה'};
const _level1 = <String>{};
const _level2 = {'45°'};
const _level3 = {'ספיר'};
const _level4 = {'פ.פ'};
const _material = {'PPR'};
const _units = {'מ"מ'};
const _l1c = <String>{};
const _l2c = {'אספקת מים'};
const _l3c = <String>{};
const _l4c = <String>{};

ChipPath _pc(String nameHe, {Set<String>? chipTypes}) => parseChips(
      nameHe,
      chipTypes: chipTypes ?? _chipTypes,
      compoundTypes: _compoundTypes,
      level1Connection: _level1,
      level2Shape: _level2,
      level3Feature: _level3,
      level4Thread: _level4,
      chipMaterial: _material,
      chipUnits: _units,
      l1Compounds: _l1c,
      l2Compounds: _l2c,
      l3Compounds: _l3c,
      l4Compounds: _l4c,
    );

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
  final p = _pc(nameHe);
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

  // דוגמה 1 — ברך 45° פ.פ 160: '45°' חסום מ-size (צורה), '160' ⇒ מידה.
  n += _check('1', 'ברך 45° פ.פ 160',
      type: 'ברך', l2: ['45°'], l4: ['פ.פ'], l5: '160');

  // דוגמה 2 — compound l2 'אספקת מים' + יחידה נספחת ל-l5.
  n += _check('2', 'צינור אספקת מים 20 מ"מ',
      type: 'צינור', l2: ['אספקת מים'], l5: '20 מ"מ');

  // דוגמה 3 — סוג-מורכב 'מיכל הדחה' כ-type יחיד + פיצ'ר.
  n += _check('3', 'מיכל הדחה ספיר',
      type: 'מיכל הדחה', l3: ['ספיר']);

  // דוגמה 4 — חומר PPR מושמט מהנתיב.
  n += _check('4', 'צינור PPR 20', type: 'צינור', l5: '20');

  // דוגמה 5 — טוקן לא-מוכר ⇒ leftover.
  n += _check('5', 'ברך זמבורי 50',
      type: 'ברך', l5: '50', leftover: ['זמבורי']);

  // — נגזרות path + levelLabelOf על דוגמה 1 (מנגנון-הטיפוס, בלתי-תלוי-מילון) —
  final p1 = _pc('ברך 45° פ.פ 160');
  _eqList(p1.path, ['45°', 'פ.פ', '160'], 'path.1'); n++;
  _eqStr(p1.levelLabelOf(0), 'צורה', 'label.0'); n++;
  _eqStr(p1.levelLabelOf(1), 'תבריג', 'label.1'); n++;
  _eqStr(p1.levelLabelOf(2), 'מידה', 'label.2'); n++;
  _eqStr(p1.levelLabelOf(-1), '', 'label.neg'); n++;
  _eqStr(p1.levelLabelOf(3), '', 'label.oob'); n++;

  // — הדאטה מוחלפת ⇒ הפלט משתנה: chipTypes ריק ⇒ 'ברך' אינו-type ⇒ leftover. —
  final swapped = _pc('ברך זמבורי 50', chipTypes: const {});
  _eqStr(swapped.type, null, 'swap.type-null'); n++;
  _eqList(swapped.leftover, ['ברך', 'זמבורי'], 'swap.leftover'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_pc('ברך').type == 'ברך', 'assert-live guard');

  print('OK parseChips: $n asserts passed (מנוע-נקי · מילונים מוזרקים)');
}
