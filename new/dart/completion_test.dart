// בדיקת-חוזה golden · completion — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/completion_test.dart
import 'completion.dart';

CompletionRule _matRule({String? interposer}) => CompletionRule(
      whyHe: 'חומרים לא-תואמים',
      requiredInterposerWhyHe: interposer,
      severity: 'error',
      incompatibleMaterialGroups: const ['copper', 'pex'],
    );
final _typeRule = const CompletionRule(
  whyHe: 'חסר מערבל',
  severity: 'warn',
  whenInLineHasTypeId: 'hot',
  requireTypeId: 'mixer',
);

const _spec1 = ProductConnectorSpec(
    productSku: 'P1', materialGroupId: 'copper', ends: [ConnectorEnd(connectorTypeId: 'hot')]);
const _spec2 = ProductConnectorSpec(productSku: 'P2', materialGroupId: 'pex');
const _spec4 = ProductConnectorSpec(
    productSku: 'P4', ends: [ConnectorEnd(connectorTypeId: 'mixer')]);

void main() {
  var n = 0;

  // 1) MATERIAL: 2 קבוצות בלתי-תואמות נוכחות ⇒ issue; whyHe=requiredInterposerWhyHe; offendingSkus=[P1,P2]
  final r1 = completion(const [_spec1, _spec2], rules: [_matRule(interposer: 'נדרש מתאם')]);
  if (r1.length != 1) throw StateError('FAIL 1 len ${r1.length}');
  if (r1[0].whyHe != 'נדרש מתאם') throw StateError('FAIL 1 whyHe ${r1[0].whyHe}');
  if (r1[0].severity != 'error') throw StateError('FAIL 1 sev');
  if (r1[0].offendingSkus.join(',') != 'P1,P2') throw StateError('FAIL 1 skus ${r1[0].offendingSkus}');
  n++;

  // 2) MATERIAL: קבוצה אחת בלבד ⇒ hit<2 ⇒ אין issue
  final r2 = completion(const [_spec1], rules: [_matRule(interposer: 'x')]);
  if (r2.isNotEmpty) throw StateError('FAIL 2 ${r2.length}');
  n++;

  // 3) MATERIAL fallback: requiredInterposerWhyHe==null ⇒ whyHe=rule.whyHe
  final r3 = completion(const [_spec1, _spec2], rules: [_matRule()]);
  if (r3[0].whyHe != 'חומרים לא-תואמים') throw StateError('FAIL 3 ${r3[0].whyHe}');
  n++;

  // 4) TYPE: type-מפעיל נוכח (hot) והנדרש (mixer) חסר ⇒ issue, offendingSkus=[P1]
  final r4 = completion(const [_spec1], rules: [_typeRule]);
  if (r4.length != 1 || r4[0].whyHe != 'חסר מערבל') throw StateError('FAIL 4 ${r4.length}');
  if (r4[0].offendingSkus.join(',') != 'P1') throw StateError('FAIL 4 skus ${r4[0].offendingSkus}');
  if (r4[0].severity != 'warn') throw StateError('FAIL 4 sev');
  n++;

  // 5) TYPE: הנדרש נוכח (mixer ב-P4) ⇒ אין issue
  final r5 = completion(const [_spec1, _spec4], rules: [_typeRule]);
  if (r5.isNotEmpty) throw StateError('FAIL 5 ${r5.length}');
  n++;

  // 6) שני חוקים ⇒ שני issues (material + type)
  final r6 = completion(const [_spec1, _spec2], rules: [_matRule(interposer: 'm'), _typeRule]);
  if (r6.length != 2) throw StateError('FAIL 6 ${r6.length}');
  n++;

  // 7) incompatibleMaterialGroups ריק ⇒ isNotEmpty=false ⇒ מדולג
  final r7 = completion(const [_spec1, _spec2], rules: const [
    CompletionRule(whyHe: 'w', severity: 's', incompatibleMaterialGroups: [])
  ]);
  if (r7.isNotEmpty) throw StateError('FAIL 7 ${r7.length}');
  n++;

  // 8) קו ריק ⇒ אין issues
  if (completion(const [], rules: [_matRule(interposer: 'm'), _typeRule]).isNotEmpty) {
    throw StateError('FAIL 8');
  }
  n++;

  assert(completion(const [_spec1, _spec2], rules: [_matRule(interposer: 'm')]).length == 1,
      'assert-live');
  print('OK completion: $n asserts passed');
}
