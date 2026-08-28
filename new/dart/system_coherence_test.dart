// בדיקת-חוזה golden · systemCoherence — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/system_coherence_test.dart
import 'system_coherence.dart';

const _cts = [
  ConnectorType(id: 'hot', systemId: 'sys.supply'),
  ConnectorType(id: 'cold', systemId: 'sys.supply'),
  ConnectorType(id: 'drain', systemId: 'sys.drain'),
  ConnectorType(id: 'loose'), // systemId == null — מדולג
];
const _sys = [
  SystemDef(id: 'sys.supply', nameHe: 'אספקה'),
  SystemDef(id: 'sys.drain', nameHe: 'ניקוז'),
];

const _p1 = ProductConnectorSpec(
    productSku: 'P1', ends: [ConnectorEnd(connectorTypeId: 'hot')]);
const _p2 = ProductConnectorSpec(
    productSku: 'P2', ends: [ConnectorEnd(connectorTypeId: 'cold')]);
const _p3 = ProductConnectorSpec(
    productSku: 'P3', ends: [ConnectorEnd(connectorTypeId: 'drain')]);
const _px = ProductConnectorSpec(
    productSku: 'PX', ends: [ConnectorEnd(connectorTypeId: 'xx')]);
const _pl = ProductConnectorSpec(
    productSku: 'PL', ends: [ConnectorEnd(connectorTypeId: 'loose')]);

void main() {
  var n = 0;

  // 1) קו ריק ⇒ קוהרנטי, nulls (עוגן connection_resolver.dart:408)
  final r1 = systemCoherence(const [], connectorTypes: _cts, systems: _sys);
  if (!r1.coherent || r1.offendingSystem != null || r1.offendingSku != null) {
    throw StateError('FAIL 1 ${r1.coherent}');
  }
  n++;

  // 2) שני קצוות באותה מערכת (hot+cold ⇒ sys.supply) ⇒ קוהרנטי
  if (!systemCoherence(const [_p1, _p2], connectorTypes: _cts, systems: _sys)
      .coherent) {
    throw StateError('FAIL 2');
  }
  n++;

  // 3) שתי מערכות ⇒ לא-קוהרנטי · sku=P3 · system=sys.drain (עוגן 399-404)
  final r3 =
      systemCoherence(const [_p1, _p3], connectorTypes: _cts, systems: _sys);
  if (r3.coherent) throw StateError('FAIL 3 coherent');
  if (r3.offendingSku != 'P3') throw StateError('FAIL 3 sku ${r3.offendingSku}');
  if (r3.offendingSystem?.id != 'sys.drain' ||
      r3.offendingSystem?.nameHe != 'ניקוז') {
    throw StateError('FAIL 3 system ${r3.offendingSystem?.id}');
  }
  n++;

  // 4) type לא-מוכר (xx) מדולג ⇒ קוהרנטי (עוגן 395-396)
  if (!systemCoherence(const [_p1, _px, _p2],
          connectorTypes: _cts, systems: _sys)
      .coherent) {
    throw StateError('FAIL 4');
  }
  n++;

  // 5) type מוכר עם systemId==null (loose) מדולג ⇒ קוהרנטי
  if (!systemCoherence(const [_p1, _pl], connectorTypes: _cts, systems: _sys)
      .coherent) {
    throw StateError('FAIL 5');
  }
  n++;

  // 6) המערכת השונה איננה ב-systems ⇒ offendingSystem=null, עדיין לא-קוהרנטי (עוגן 137-139, 402)
  final r6 = systemCoherence(const [_p1, _p3],
      connectorTypes: _cts, systems: const [SystemDef(id: 'sys.supply')]);
  if (r6.coherent) throw StateError('FAIL 6 coherent');
  if (r6.offendingSystem != null) throw StateError('FAIL 6 system');
  if (r6.offendingSku != 'P3') throw StateError('FAIL 6 sku ${r6.offendingSku}');
  n++;

  // 7) spec יחיד עם קצוות משתי מערכות ⇒ לא-קוהרנטי, sku=אותו-spec
  final r7 = systemCoherence(
    const [
      ProductConnectorSpec(productSku: 'PM', ends: [
        ConnectorEnd(connectorTypeId: 'hot'),
        ConnectorEnd(connectorTypeId: 'drain'),
      ]),
    ],
    connectorTypes: _cts,
    systems: _sys,
  );
  if (r7.coherent ||
      r7.offendingSku != 'PM' ||
      r7.offendingSystem?.id != 'sys.drain') {
    throw StateError('FAIL 7 ${r7.offendingSku}/${r7.offendingSystem?.id}');
  }
  n++;

  // 8) ה-sku הפוגע = הראשון-הסוטה מהמערכת הראשונה-שנראתה; system = השונה, לא הראשונה
  final r8 =
      systemCoherence(const [_p3, _p1], connectorTypes: _cts, systems: _sys);
  if (r8.coherent ||
      r8.offendingSku != 'P1' ||
      r8.offendingSystem?.id != 'sys.supply') {
    throw StateError('FAIL 8 ${r8.offendingSku}/${r8.offendingSystem?.id}');
  }
  n++;

  // 9) כפילות-id ב-connectorTypes ⇒ האחרון-מנצח (map-literal, עוגן 186-190):
  //    hot ממופה-מחדש ל-sys.drain ⇒ hot+drain באותה מערכת ⇒ קוהרנטי
  final r9 = systemCoherence(
    const [_p1, _p3],
    connectorTypes: [..._cts, const ConnectorType(id: 'hot', systemId: 'sys.drain')],
    systems: _sys,
  );
  if (!r9.coherent) throw StateError('FAIL 9');
  n++;

  // 10) רק קצוות מדולגים (לא-מוכר + null-system) ⇒ קוהרנטי
  if (!systemCoherence(const [_px, _pl], connectorTypes: _cts, systems: _sys)
      .coherent) {
    throw StateError('FAIL 10');
  }
  n++;

  assert(
      !systemCoherence(const [_p1, _p3], connectorTypes: _cts, systems: _sys)
          .coherent,
      'assert-live');
  print('OK systemCoherence: $n asserts passed');
}
