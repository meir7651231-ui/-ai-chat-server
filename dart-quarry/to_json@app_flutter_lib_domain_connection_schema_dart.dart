// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · toJson — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/connection_schema.dart:157-394 (238 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): hash, fromJson, toList, listEquals, mapEquals, hashAll
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  Map<String, dynamic> toJson() =>
      {'connectorTypeId': connectorTypeId, 'sizeValue': sizeValue};

  @override
  bool operator ==(Object other) =>
      other is ProductEnd &&
      other.connectorTypeId == connectorTypeId &&
      other.sizeValue == sizeValue;

  @override
  int get hashCode => Object.hash(connectorTypeId, sizeValue);
}

@immutable
class ProductConnectorSpec {
  const ProductConnectorSpec({
    required this.productSku,
    required this.tradeId,
    this.ends = const [],
    this.materialId,
    this.ratingHe,
    this.envelope = const {},
    this.materialGroupId, // R1-3 (derived galvanic group)
  });

  factory ProductConnectorSpec.fromJson(Map<String, dynamic> j) =>
      ProductConnectorSpec(
        productSku: _str(j['productSku']),
        tradeId: _str(j['tradeId']),
        ends: j['ends'] is List
            ? (j['ends'] as List)
                .whereType<Map<dynamic, dynamic>>()
                .map((e) => ProductEnd.fromJson(e.cast<String, dynamic>()))
                .toList()
            : const [],
        materialId: _strOrNull(j['materialId']),
        ratingHe: _strOrNull(j['ratingHe']),
        envelope: _numMap(j['envelope']),
        materialGroupId: _strOrNull(j['materialGroupId']),
      );

  final String productSku;
  final String tradeId;
  final List<ProductEnd> ends;
  final String? materialId;
  final String? ratingHe;
  final Map<String, num> envelope; // trade-defined keys: {maxTempC:40}|{maxAmp:16}
  final String? materialGroupId;

  Map<String, dynamic> toJson() => {
        'productSku': productSku,
        'tradeId': tradeId,
        'ends': ends.map((e) => e.toJson()).toList(),
        if (materialId != null) 'materialId': materialId,
        if (ratingHe != null) 'ratingHe': ratingHe,
        'envelope': envelope,
        if (materialGroupId != null) 'materialGroupId': materialGroupId,
      };

  @override
  bool operator ==(Object other) =>
      other is ProductConnectorSpec &&
      other.productSku == productSku &&
      other.tradeId == tradeId &&
      listEquals(other.ends, ends) &&
      other.materialId == materialId &&
      other.ratingHe == ratingHe &&
      mapEquals(other.envelope, envelope) &&
      other.materialGroupId == materialGroupId;

  @override
  int get hashCode => Object.hash(
        productSku,
        tradeId,
        Object.hashAll(ends),
        materialId,
        ratingHe,
        Object.hashAll(envelope.keys),
        materialGroupId,
      );
}

@immutable
class CompatibilityRule {
  const CompatibilityRule({
    required this.id,
    required this.tradeId,
    required this.aTypeId,
    required this.bTypeId,
    required this.sizeMatch,
    required this.methodLabelHe,
    this.sizeTable, // for tableLookup: allowed [aSize, bSize] pairs
    this.onMismatch = RuleSeverity.warning,
    this.materialGroup, // R1-3
    this.incompatibleMaterialGroups, // R1-3
  });

  factory CompatibilityRule.fromJson(Map<String, dynamic> j) => CompatibilityRule(
        id: _str(j['id']),
        tradeId: _str(j['tradeId']),
        aTypeId: _str(j['aTypeId']),
        bTypeId: _str(j['bTypeId']),
        sizeMatch: _sizeMatchFrom(j['sizeMatch']),
        methodLabelHe: _str(j['methodLabelHe']),
        sizeTable: _sizeTable(j['sizeTable']),
        onMismatch: _ruleSeverityFrom(j['onMismatch']),
        materialGroup: _strOrNull(j['materialGroup']),
        incompatibleMaterialGroups:
            _strListOrNull(j['incompatibleMaterialGroups']),
      );

  final String id;
  final String tradeId;
  final String aTypeId; // documented order: [a, b]; sizeTable rows are [aSize, bSize]
  final String bTypeId;
  final SizeMatch sizeMatch;
  final List<List<String>>? sizeTable;
  final String methodLabelHe;
  final RuleSeverity onMismatch;
  final String? materialGroup;
  final List<String>? incompatibleMaterialGroups;

  Map<String, dynamic> toJson() => {
        'id': id,
        'tradeId': tradeId,
        'aTypeId': aTypeId,
        'bTypeId': bTypeId,
        'sizeMatch': sizeMatch.name,
        'methodLabelHe': methodLabelHe,
        if (sizeTable != null) 'sizeTable': sizeTable,
        'onMismatch': onMismatch.name,
        if (materialGroup != null) 'materialGroup': materialGroup,
        if (incompatibleMaterialGroups != null)
          'incompatibleMaterialGroups': incompatibleMaterialGroups,
      };

  @override
  bool operator ==(Object other) =>
      other is CompatibilityRule &&
      other.id == id &&
      other.tradeId == tradeId &&
      other.aTypeId == aTypeId &&
      other.bTypeId == bTypeId &&
      other.sizeMatch == sizeMatch &&
      _sizeTableEq(other.sizeTable, sizeTable) &&
      other.methodLabelHe == methodLabelHe &&
      other.onMismatch == onMismatch &&
      other.materialGroup == materialGroup &&
      listEquals(other.incompatibleMaterialGroups, incompatibleMaterialGroups);

  @override
  int get hashCode => Object.hash(
        id,
        tradeId,
        aTypeId,
        bTypeId,
        sizeMatch,
        _sizeTableHash(sizeTable),
        methodLabelHe,
        onMismatch,
        materialGroup,
        Object.hashAll(incompatibleMaterialGroups ?? const []),
      );
}

@immutable
class CompletionRule {
  const CompletionRule({
    required this.id,
    required this.tradeId,
    required this.whenInLineHasTypeId,
    required this.requireTypeId,
    required this.whyHe,
    this.severity = RuleSeverity.warning,
    this.incompatibleMaterialGroups, // R1-3
    this.requiredInterposerWhyHe, // R1-3
  });

  factory CompletionRule.fromJson(Map<String, dynamic> j) => CompletionRule(
        id: _str(j['id']),
        tradeId: _str(j['tradeId']),
        whenInLineHasTypeId: _str(j['whenInLineHasTypeId']),
        requireTypeId: _str(j['requireTypeId']),
        whyHe: _str(j['whyHe']),
        severity: _ruleSeverityFrom(j['severity']),
        incompatibleMaterialGroups:
            _strListOrNull(j['incompatibleMaterialGroups']),
        requiredInterposerWhyHe: _strOrNull(j['requiredInterposerWhyHe']),
      );

  final String id;
  final String tradeId;
  final String whenInLineHasTypeId; // trigger
  final String requireTypeId;
  final String whyHe;
  final RuleSeverity severity;
  final List<String>? incompatibleMaterialGroups;
  final String? requiredInterposerWhyHe;

  Map<String, dynamic> toJson() => {
        'id': id,
        'tradeId': tradeId,
        'whenInLineHasTypeId': whenInLineHasTypeId,
        'requireTypeId': requireTypeId,
        'whyHe': whyHe,
        'severity': severity.name,
        if (incompatibleMaterialGroups != null)
          'incompatibleMaterialGroups': incompatibleMaterialGroups,
        if (requiredInterposerWhyHe != null)
          'requiredInterposerWhyHe': requiredInterposerWhyHe,
      };

  @override
  bool operator ==(Object other) =>
      other is CompletionRule &&
      other.id == id &&
      other.tradeId == tradeId &&
      other.whenInLineHasTypeId == whenInLineHasTypeId &&
      other.requireTypeId == requireTypeId &&
      other.whyHe == whyHe &&
      other.severity == severity &&
      listEquals(
          other.incompatibleMaterialGroups, incompatibleMaterialGroups) &&
      other.requiredInterposerWhyHe == requiredInterposerWhyHe;

  @override
  int get hashCode => Object.hash(
        id,
        tradeId,
        whenInLineHasTypeId,
        requireTypeId,
        whyHe,
        severity,
        Object.hashAll(incompatibleMaterialGroups ?? const []),
        requiredInterposerWhyHe,
      );
}

