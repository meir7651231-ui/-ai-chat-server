import '../dart-data/plumbing_connector_types-terms.dart' as td_plumbing_connector_types;
// בדיקת-חוזה · plumbingConnectorTypes — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/plumbing_connector_types_test.dart
import 'plumbing_connector_types.dart';

void _eq(Object? got, Object? want, String label) {
  if ('$got' != '$want') {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

ConnectorType _byId(List<ConnectorType> ts, String id) =>
    ts.firstWhere((t) => t.id == id, orElse: () => throw StateError('FAIL: id $id missing'));

void main() {
  var n = 0;

  // ‏1 — קלט ריק ⇒ עדיין 6 רשומות (אחת פר-EndType), כולן sizeValues=[], ממוינות לפי id.
  final empty = plumbingConnectorTypes(const [], term: (k)=>td_plumbing_connector_types.kTerms[k]!);
  _eq(empty.length, 6, '1 six types on empty input'); n++;
  _eq(empty.map((t) => t.id).toList(), [
    'plumbing.conn.bspFemale',
    'plumbing.conn.bspMale',
    'plumbing.conn.copperPress',
    'plumbing.conn.drainOpening',
    'plumbing.conn.hdpeCompression',
    'plumbing.conn.pexPress',
  ], '1b sorted by id (:298)'); n++;
  for (final t in empty) {
    _eq(t.sizeValues, <String>[], '1c empty sizes (${t.id})');
    _eq(t.tradeId, 'plumbing', '1d tradeId (${t.id})');
  }
  n++;

  // ‏2 — נבדלות + מיון: כפילות נבלעת ב-Set (:284-287), toList()..sort() (:295).
  final ts = plumbingConnectorTypes(const [
    ConnectorEnd(EndType.pexPress, '25'),
    ConnectorEnd(EndType.pexPress, '16'),
    ConnectorEnd(EndType.pexPress, '25'),
    ConnectorEnd(EndType.bspMale, '1/2'),
  ], term: (k)=>td_plumbing_connector_types.kTerms[k]!);
  _eq(_byId(ts, 'plumbing.conn.pexPress').sizeValues, ['16', '25'], '2 distinct+sorted'); n++;
  _eq(_byId(ts, 'plumbing.conn.bspMale').sizeValues, ['1/2'], '2b bsp size'); n++;
  _eq(_byId(ts, 'plumbing.conn.copperPress').sizeValues, <String>[], '2c untouched type stays empty'); n++;

  // ‏3 — מיון-מחרוזות לקסיקוגרפי (לא מספרי): '110' < '16' < '63' (קצה-אמת מהמקור).
  final hd = plumbingConnectorTypes(const [
    ConnectorEnd(EndType.hdpeCompression, '63'),
    ConnectorEnd(EndType.hdpeCompression, '110'),
    ConnectorEnd(EndType.hdpeCompression, '16'),
  ], term: (k)=>td_plumbing_connector_types.kTerms[k]!);
  _eq(_byId(hd, 'plumbing.conn.hdpeCompression').sizeValues, ['110', '16', '63'],
      '3 lexicographic string sort'); n++;

  // ‏4 — systemId נגזר ממיפוי-המערכת המאומת (lipskey_verified_connections.dart:70-77).
  _eq(_byId(empty, 'plumbing.conn.hdpeCompression').systemId, 'plumbing.sys.drainage', '4 hdpe⇒drainage'); n++;
  _eq(_byId(empty, 'plumbing.conn.drainOpening').systemId, 'plumbing.sys.drainage', '4b drain⇒drainage'); n++;
  _eq(_byId(empty, 'plumbing.conn.bspMale').systemId, 'plumbing.sys.supply', '4c bspMale⇒supply'); n++;
  _eq(_byId(empty, 'plumbing.conn.bspFemale').systemId, 'plumbing.sys.supply', '4d bspFemale⇒supply'); n++;
  _eq(_byId(empty, 'plumbing.conn.pexPress').systemId, 'plumbing.sys.supply', '4e pex⇒supply'); n++;
  _eq(_byId(empty, 'plumbing.conn.copperPress').systemId, 'plumbing.sys.supply', '4f copper⇒supply'); n++;

  // ‏5 — תוויות nameHe — verbatim מהמקור (:272-279).
  _eq(_byId(empty, 'plumbing.conn.hdpeCompression').nameHe, 'הידוק HDPE', '5 nameHe hdpe'); n++;
  _eq(_byId(empty, 'plumbing.conn.pexPress').nameHe, 'PEX פרס', '5b nameHe pex'); n++;
  _eq(_byId(empty, 'plumbing.conn.copperPress').nameHe, 'נחושת פרס', '5c nameHe copper'); n++;
  _eq(_byId(empty, 'plumbing.conn.bspMale').nameHe, 'תבריג זכר (BSP)', '5d nameHe bspMale'); n++;
  _eq(_byId(empty, 'plumbing.conn.bspFemale').nameHe, 'תבריג נקבה (BSP)', '5e nameHe bspFemale'); n++;
  _eq(_byId(empty, 'plumbing.conn.drainOpening').nameHe, 'פתח ניקוז', '5f nameHe drain'); n++;

  // ‏6 — דטרמיניזם: שתי קריאות עם אותו קלט ⇒ אותו פלט (הבטחת-המקור :36-37).
  final again = plumbingConnectorTypes(const [
    ConnectorEnd(EndType.pexPress, '25'),
    ConnectorEnd(EndType.pexPress, '16'),
    ConnectorEnd(EndType.pexPress, '25'),
    ConnectorEnd(EndType.bspMale, '1/2'),
  ], term: (k)=>td_plumbing_connector_types.kTerms[k]!);
  _eq(again.map((t) => '${t.id}|${t.sizeValues}').toList(),
      ts.map((t) => '${t.id}|${t.sizeValues}').toList(), '6 deterministic'); n++;

  assert(empty.length == 6, 'assert-live guard');

  print('OK plumbingConnectorTypes: $n asserts passed (שקע-קצוות מוזרק · זהה-ביט למקור)');
}
