// 🏅 רתמת-זהב · bs-config-proof — מריצה את golden האטומים דרך ה-API של הקופסה.
// כל טענה נכשלת ⇒ StateError. הצינור מוכח מקצה-לקצה: round-trip config-ops עם
// האוצר-הלכיד של הקופסה, תבניות מאותה פלטה, ומנוע-כללים מאותו אוצר-שדות.
// הרצה: dart run --enable-asserts new/dart-boxes/bs-config-proof.dart
import 'bs-config.dart';

int _n = 0;
void _check(bool ok, String label) {
  if (!ok) throw StateError('FAIL [$label]');
  _n++;
}

void _eqS(String? got, String? want, String label) =>
    _check(got == want, '$label: got="$got" want="$want"');

void _eqN(num got, num want, String label) =>
    _check(got == want, '$label: got=$got want=$want');

bool _eqSet(Set<String> a, Set<String> b) =>
    a.length == b.length && a.containsAll(b);

bool _listMapEq(List<Map<String, dynamic>> a, List<Map<String, dynamic>> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    final x = a[i], y = b[i];
    if (x.length != y.length) return false;
    for (final e in y.entries) {
      if (x[e.key] != e.value) return false;
    }
  }
  return true;
}

void main() {
  // ═══ אשכול א׳ · פעולות-הקונפיג — round-trip + שוויון-ערך ═══

  // toJson — כל וריאנט פולט את התג הנכון (config_op.dart:67-111).
  _check(_listMapEq(configOpsToJson([]), []), 'to empty');
  _check(
      _listMapEq(configOpsToJson([const SetText('a', 'hi')]), [
        {'op': 'setText', 'id': 'a', 'text': 'hi'}
      ]),
      'to setText');
  _check(
      _listMapEq(configOpsToJson([const SetOrder('m', 3)]), [
        {'op': 'setOrder', 'id': 'm', 'order': 3}
      ]),
      'to setOrder');

  // round-trip: 6 הווריאנטים ⇒ JSON ⇒ חזרה ⇒ שוויון-ערך דרך configOpEquals.
  final ops = <ConfigOp>[
    const SetText('t', 'שלום'),
    const SetEmoji('e', '🔧'),
    const SetHidden('h', true),
    const SetOrder('o', 7),
    SetStyle('s', const CfgStyle({'color': 'brand', 'weight': 2})),
    SetAction('c', const CfgAction({'kind': 'noop'})),
  ];
  final json = configOpsToJson(ops);
  final back = configOpsFromJson(json);
  _check(back.length == 6, 'roundtrip length 6');
  for (var i = 0; i < ops.length; i++) {
    _check(configOpEquals(ops[i], back[i]), 'roundtrip[$i] equal');
  }
  // סדר-נשמר, 1:1.
  _check(back[0] is SetText && back[5] is SetAction, 'roundtrip order preserved');

  // payload מקונן משוחזר לשוויון-ערך (CfgStyle/CfgAction ==), לא identity.
  _check(configOpEquals(ops[4], SetStyle('s', const CfgStyle({'color': 'brand', 'weight': 2}))),
      'style value-eq');
  _check(!configOpEquals(ops[4], SetStyle('s', const CfgStyle({'color': 'ink', 'weight': 2}))),
      'style value differs');

  // configOpEquals — id/וריאנט/payload edge-cases (config_op_equals golden).
  _check(configOpEquals(const SetText('a', 'x'), const SetText('a', 'x')), 'eq same');
  _check(!configOpEquals(const SetText('a', 'x'), const SetText('b', 'x')), 'eq id differs');
  _check(!configOpEquals(const SetText('a', 'x'), const SetEmoji('a', 'x')), 'eq variant differs');
  _check(configOpEquals(const SetText('a', null), const SetText('a', null)), 'eq null==null');
  _check(!configOpEquals(const SetText('a', null), const SetText('a', 'x')), 'eq null vs value');
  _check(!configOpEquals(const SetOrder('m', 3), const SetStyle('m', CfgStyle({}))),
      'eq variant beats id');

  // configOpFromJson — degrade-never-throw (config_op_from_json golden).
  _check(configOpFromJson(null) == null, 'from null→null');
  _check(configOpFromJson('hi') == null, 'from string→null');
  _check(configOpFromJson(<String, Object?>{}) == null, 'from empty→null (no id)');
  _check(configOpFromJson({'id': '', 'op': 'setText'}) == null, 'from blank-id→null');
  _check(configOpFromJson({'id': 5, 'op': 'setText'}) == null, 'from non-string-id→null');
  _check(configOpFromJson({'id': 'a', 'op': 'setOrder', 'order': 3.9}) is SetOrder,
      'from order truncates');
  _eqN((configOpFromJson({'id': 'a', 'op': 'setOrder', 'order': 3.9}) as SetOrder).order!, 3,
      'from order 3.9→3');
  _check(configOpFromJson({'id': 'a', 'op': 'setHidden', 'hidden': 'yes'}) is SetHidden,
      'from hidden non-bool builds');
  _check((configOpFromJson({'id': 'a', 'op': 'setHidden', 'hidden': 'yes'}) as SetHidden).hidden == null,
      'from hidden non-bool→null payload');
  _check(configOpFromJson({'id': 'a', 'op': 'unknown'}) == null, 'from unknown-tag→null');
  _check(configOpFromJson({'id': 'a', 'op': 'addComponent'}) == null, 'from legacy-tag→null');

  // configOpsFromJson — batch degrade (config_ops_from_json golden).
  _check(configOpsFromJson('hi').isEmpty, 'ops from non-list→[]');
  _check(configOpsFromJson([{'id': 'a', 'op': 'setText', 'text': 'x'}, null, {'op': 'unknown'}]).length == 1,
      'ops drops null+unknown, keeps valid');

  // setStyle מנרמל מפתחות-לא-String (config_op_from_json #17: {7:'x'}→{'7':'x'}).
  final s17 = configOpFromJson({'id': 'a', 'op': 'setStyle', 'style': {7: 'x'}});
  _check(s17 is SetStyle && s17.style!.props['7'] == 'x', 'setStyle key-normalized');

  // ═══ אשכול ב׳ · תבניות-הרכיבים — אותה פלטה לשתי הבדיקות ═══

  _eqS(templateFor(ComponentType.button)?.he, 'כפתור', 'tf button');
  _eqS(templateFor(ComponentType.input)?.he, 'שדה-קלט', 'tf input');
  _check(templateFor(ComponentType.button, palette: const []) == null, 'tf empty→null');

  _eqS(templateForName('button')?.he, 'כפתור', 'tfn button');
  _eqS(templateForName('  text  ')?.he, 'טקסט', 'tfn trim');
  _check(templateForName('') == null, 'tfn blank→null');
  _check(templateForName('   ') == null, 'tfn whitespace→null');
  _check(templateForName('zzz') == null, 'tfn miss→null');

  // לכידות: templateForName(enum.name) ⇒ אותה תבנית כמו templateFor(enum).
  _check(templateForName('image')?.he == templateFor(ComponentType.image)?.he,
      'palette coherent (name==enum)');

  // ═══ אשכול ג׳ · מנוע-הכללים — אוצר-שדות אחד ═══

  // fieldValue — גיל/סכום/פריטים/נפילה (field_value golden).
  final now = DateTime(2026, 8, 26, 12, 0);
  final order = RuleOrder(createdAt: DateTime(2026, 8, 16, 12, 0), sum: 540, items: 3);
  _eqN(fieldValue(kFieldAgeDays, order, now), 10, 'fv age 10d');
  _eqN(fieldValue(kFieldSum, order, now), 540, 'fv sum');
  _eqN(fieldValue(kFieldItems, order, now), 3, 'fv items');
  _eqN(fieldValue('unknown', order, now), 0, 'fv fallthrough→0');
  _eqN(fieldValue(kFieldAgeDays, const RuleOrder(), now), 0, 'fv null-created→0');

  // fieldLabelHe — אוצר-הקופסה ⇒ תווית; לא-מוכר ⇒ גולמי.
  _eqS(fieldLabelHe(kFieldSum), 'סכום', 'flh sum');
  _eqS(fieldLabelHe(kFieldAgeDays), 'גיל בימים', 'flh ageDays');
  _eqS(fieldLabelHe('nope'), 'nope', 'flh unknown→raw');

  // ruleActionIsMutating — אוצר-הקופסה.
  _check(ruleActionIsMutating('setStatus'), 'raim setStatus mutates');
  _check(!ruleActionIsMutating('notify'), 'raim notify not-mutating');
  _check(!ruleActionIsMutating('ghost'), 'raim unknown→false');

  // ruleSummaryHe — חיווט-פנימי: fieldId נפתר דרך fieldLabelHe; op דרך אוצר-הקופסה.
  _eqS(
    ruleSummaryHe(
      triggerLabel: 'הזמנה חדשה',
      fieldId: kFieldSum,
      opRaw: 'gte',
      value: 500,
      actionLabel: 'שלח מייל',
    ),
    'הזמנה חדשה · סכום ≥ 500 · שלח מייל',
    'rsh numeric gte (field resolved internally)',
  );
  _eqS(
    ruleSummaryHe(
      triggerLabel: 'ט',
      fieldId: 'unmapped',
      opRaw: 'weird',
      value: true,
      actionLabel: 'א',
    ),
    'ט · unmapped weird true · א',
    'rsh unknown field+op fall through',
  );

  // allowedValues — dedup / חסר-prop / לא-נמצא ⇒ ריק (allowed_values golden).
  final descs = <String, FieldDescriptor>{
    'door': (allowedValues: {
      'color': ['red', 'blue', 'red'],
      'size': <String>[],
    }),
  };
  _check(_eqSet(allowedValues('door', 'color', descriptors: descs), {'red', 'blue'}),
      'av dedup');
  _check(allowedValues('door', 'size', descriptors: descs).isEmpty, 'av empty-list');
  _check(allowedValues('door', 'weight', descriptors: descs).isEmpty, 'av missing-prop');
  _check(allowedValues('window', 'color', descriptors: descs).isEmpty, 'av not-found');

  print('OK bs-config: $_n asserts passed (11 atoms wired, round-trip + 3 clusters proven)');
}
