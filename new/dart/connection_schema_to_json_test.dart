// בדיקת-אטום · connectionSchemaToJson — מוכיחה בדיוק את דוגמאות connection_schema_to_json.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/connection_schema_to_json_test.dart
//                ⇒ exit 0 + "OK connectionSchemaToJson: N asserts passed".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'connection_schema_to_json.dart';

// השוואה-עמוקה מקומית (Map/List לא משווים עמוק בברירת-מחדל; רתמת-בדיקה, לא אטום-שכן).
bool _deepEq(Object? a, Object? b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

// סדר-מפתחות = סדר-המקור (מפות-מילוליות ב-Dart משמרות סדר-הכנסה).
bool _keyOrder(Map<String, dynamic> m, List<String> expected) {
  final ks = m.keys.toList();
  if (ks.length != expected.length) return false;
  for (var i = 0; i < ks.length; i++) {
    if (ks[i] != expected[i]) return false;
  }
  return true;
}

var _n = 0;
void _ok(bool cond, String what) {
  assert(cond, 'FAIL: $what');
  _n++;
}

void main() {
  // ── #1 · ProductEnd (:157-158) — בדיוק 2 מפתחות ────────────────────────────
  final end1 = const ProductEnd(connectorTypeId: 'pex', sizeValue: '1/2');
  _ok(_deepEq(end1.toJson(), {'connectorTypeId': 'pex', 'sizeValue': '1/2'}),
      '#1 ProductEnd');
  _ok(_keyOrder(end1.toJson(), ['connectorTypeId', 'sizeValue']),
      '#1 ProductEnd key order');

  // ── #2 · ProductConnectorSpec ברירות-מחדל (:206-214) — 4 מפתחות, אפס-null ──
  final spec2 =
      const ProductConnectorSpec(productSku: 'P-1', tradeId: 'plumbing');
  _ok(
      _deepEq(spec2.toJson(), {
        'productSku': 'P-1',
        'tradeId': 'plumbing',
        'ends': <Map<String, dynamic>>[],
        'envelope': <String, num>{},
      }),
      '#2 spec defaults — ends/envelope נוכחים גם-כשריקים');
  _ok(_keyOrder(spec2.toJson(), ['productSku', 'tradeId', 'ends', 'envelope']),
      '#2 spec defaults key order (אופציונליים הושמטו)');

  // ── #3 · ProductConnectorSpec מלא — קינון ends דרך ProductEnd.toJson (:209) ─
  final spec3 = const ProductConnectorSpec(
    productSku: 'P-2',
    tradeId: 'plumbing',
    ends: [
      ProductEnd(connectorTypeId: 'pex', sizeValue: '1/2'),
      ProductEnd(connectorTypeId: 'cu', sizeValue: '3/4'),
    ],
    materialId: 'pex',
    ratingHe: 'PN10',
    envelope: {'maxTempC': 40},
    materialGroupId: 'plastic',
  );
  _ok(
      _deepEq(spec3.toJson(), {
        'productSku': 'P-2',
        'tradeId': 'plumbing',
        'ends': [
          {'connectorTypeId': 'pex', 'sizeValue': '1/2'},
          {'connectorTypeId': 'cu', 'sizeValue': '3/4'},
        ],
        'materialId': 'pex',
        'ratingHe': 'PN10',
        'envelope': {'maxTempC': 40},
        'materialGroupId': 'plastic',
      }),
      '#3 spec full — קינון + כל האופציונליים');
  _ok(
      _keyOrder(spec3.toJson(), [
        'productSku', 'tradeId', 'ends', 'materialId', 'ratingHe',
        'envelope', 'materialGroupId', // סדר-המקור :207-213
      ]),
      '#3 spec full key order');

  // ── #4 · CompatibilityRule ברירות-מחדל (:279-291) — בדיוק 7, enum ⇒ .name ──
  final rule4 = const CompatibilityRule(
    id: 'R1',
    tradeId: 'plumbing',
    aTypeId: 'pex',
    bTypeId: 'pex',
    sizeMatch: SizeMatch.exactSame,
    methodLabelHe: 'הברגה',
  );
  _ok(
      _deepEq(rule4.toJson(), {
        'id': 'R1',
        'tradeId': 'plumbing',
        'aTypeId': 'pex',
        'bTypeId': 'pex',
        'sizeMatch': 'exactSame',
        'methodLabelHe': 'הברגה',
        'onMismatch': 'warning', // ברירת-מחדל-המקור, תמיד-נוכח (:287)
      }),
      '#4 rule defaults');
  _ok(
      _keyOrder(rule4.toJson(), [
        'id', 'tradeId', 'aTypeId', 'bTypeId', 'sizeMatch',
        'methodLabelHe', 'onMismatch', // sizeTable-null הושמט (:286)
      ]),
      '#4 rule defaults key order');

  // ── #5 · CompatibilityRule מלא — sizeTable מקוננת + critical + חומרים ──────
  final rule5 = const CompatibilityRule(
    id: 'R2',
    tradeId: 'plumbing',
    aTypeId: 'dn',
    bTypeId: 'od',
    sizeMatch: SizeMatch.tableLookup,
    methodLabelHe: 'מעבר',
    sizeTable: [
      ['1/2', '3/4']
    ],
    onMismatch: RuleSeverity.critical,
    materialGroup: 'metal',
    incompatibleMaterialGroups: ['plastic'],
  );
  _ok(
      _deepEq(rule5.toJson(), {
        'id': 'R2',
        'tradeId': 'plumbing',
        'aTypeId': 'dn',
        'bTypeId': 'od',
        'sizeMatch': 'tableLookup',
        'methodLabelHe': 'מעבר',
        'sizeTable': [
          ['1/2', '3/4']
        ],
        'onMismatch': 'critical',
        'materialGroup': 'metal',
        'incompatibleMaterialGroups': ['plastic'],
      }),
      '#5 rule full');
  // סדר-המקור: sizeTable אחרי methodLabelHe ולפני onMismatch (:286-287).
  _ok(
      _keyOrder(rule5.toJson(), [
        'id', 'tradeId', 'aTypeId', 'bTypeId', 'sizeMatch', 'methodLabelHe',
        'sizeTable', 'onMismatch', 'materialGroup', 'incompatibleMaterialGroups',
      ]),
      '#5 rule full key order');
  // ‏anyToAny ⇒ 'anyToAny' (הערך השלישי של ה-enum מכוסה גם הוא).
  _ok(
      CompatibilityRule(
            id: 'R3',
            tradeId: 't',
            aTypeId: 'a',
            bTypeId: 'b',
            sizeMatch: SizeMatch.anyToAny,
            methodLabelHe: 'x',
          ).toJson()['sizeMatch'] ==
          'anyToAny',
      '#5b sizeMatch anyToAny ⇒ .name');

  // ── #6 · CompletionRule ברירות-מחדל (:356-367) — בדיוק 6, severity תמיד ────
  final comp6 = const CompletionRule(
    id: 'C1',
    tradeId: 'plumbing',
    whenInLineHasTypeId: 'boiler',
    requireTypeId: 'safety-valve',
    whyHe: 'חובה',
  );
  _ok(
      _deepEq(comp6.toJson(), {
        'id': 'C1',
        'tradeId': 'plumbing',
        'whenInLineHasTypeId': 'boiler',
        'requireTypeId': 'safety-valve',
        'whyHe': 'חובה',
        'severity': 'warning',
      }),
      '#6 completion defaults');
  _ok(
      _keyOrder(comp6.toJson(), [
        'id', 'tradeId', 'whenInLineHasTypeId', 'requireTypeId', 'whyHe',
        'severity',
      ]),
      '#6 completion defaults key order');

  // ── #7 · CompletionRule מלא — info + שני האופציונליים ──────────────────────
  final comp7 = const CompletionRule(
    id: 'C2',
    tradeId: 'plumbing',
    whenInLineHasTypeId: 'cu-pipe',
    requireTypeId: 'dielectric',
    whyHe: 'הפרדה גלוונית',
    severity: RuleSeverity.info,
    incompatibleMaterialGroups: ['iron'],
    requiredInterposerWhyHe: 'נתק דיאלקטרי',
  );
  _ok(
      _deepEq(comp7.toJson(), {
        'id': 'C2',
        'tradeId': 'plumbing',
        'whenInLineHasTypeId': 'cu-pipe',
        'requireTypeId': 'dielectric',
        'whyHe': 'הפרדה גלוונית',
        'severity': 'info',
        'incompatibleMaterialGroups': ['iron'],
        'requiredInterposerWhyHe': 'נתק דיאלקטרי',
      }),
      '#7 completion full');

  // ── #8 · אפס-mutation — קריאה-כפולה מחזירה מפה שוות-ערך ────────────────────
  _ok(_deepEq(spec3.toJson(), spec3.toJson()), '#8 idempotent, no mutation');

  print('OK connectionSchemaToJson: $_n asserts passed');
}
