// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _sizeTableHash — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/connection_schema.dart:60-129 (70 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): hashAll, fromJson, toJson, listEquals, hash
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int _sizeTableHash(List<List<String>>? t) =>
    t == null ? 0 : Object.hashAll(t.map(Object.hashAll));

@immutable
class ConnectorType {
  const ConnectorType({
    required this.id,
    required this.tradeId,
    required this.nameHe,
    this.sizeValues = const [],
    this.systemId,
  });

  factory ConnectorType.fromJson(Map<String, dynamic> j) => ConnectorType(
        id: _str(j['id']),
        tradeId: _str(j['tradeId']),
        nameHe: _str(j['nameHe']),
        sizeValues: _strList(j['sizeValues']),
        systemId: _strOrNull(j['systemId']),
      );

  final String id;
  final String tradeId;
  final String nameHe;
  final List<String> sizeValues;
  final String? systemId;

  Map<String, dynamic> toJson() => {
        'id': id,
        'tradeId': tradeId,
        'nameHe': nameHe,
        'sizeValues': sizeValues,
        if (systemId != null) 'systemId': systemId,
      };

  @override
  bool operator ==(Object other) =>
      other is ConnectorType &&
      other.id == id &&
      other.tradeId == tradeId &&
      other.nameHe == nameHe &&
      listEquals(other.sizeValues, sizeValues) &&
      other.systemId == systemId;

  @override
  int get hashCode =>
      Object.hash(id, tradeId, nameHe, Object.hashAll(sizeValues), systemId);
}

@immutable
class SystemDef {
  const SystemDef({
    required this.id,
    required this.tradeId,
    required this.nameHe,
    required this.color,
  });

  factory SystemDef.fromJson(Map<String, dynamic> j) => SystemDef(
        id: _str(j['id']),
        tradeId: _str(j['tradeId']),
        nameHe: _str(j['nameHe']),
        color: _int(j['color']),
      );

  final String id;
  final String tradeId;
  final String nameHe;
  final int color;

