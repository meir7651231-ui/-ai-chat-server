// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · completion — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/connection_resolver.dart:320-390 (71 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  List<CompletionIssue> completion(List<ProductConnectorSpec> line) {
    final presentGroups = <String>{
      for (final spec in line)
        if (spec.materialGroupId != null) spec.materialGroupId!,
    };
    final issues = <CompletionIssue>[];
    for (final rule in completionRules) {
      // (1) MATERIAL shape.
      final groups = rule.incompatibleMaterialGroups;
      if (groups != null && groups.isNotEmpty) {
        final hit = <String>{
          for (final g in groups)
            if (presentGroups.contains(g)) g,
        };
        if (hit.length >= 2) {
          issues.add(
            CompletionIssue(
              rule: rule,
              whyHe: rule.requiredInterposerWhyHe ?? rule.whyHe,
              severity: rule.severity,
              offendingSkus: [
                for (final spec in line)
                  if (spec.materialGroupId != null &&
                      hit.contains(spec.materialGroupId))
                    spec.productSku,
              ],
            ),
          );
        }
      }
      // (2) TYPE shape.
      if (rule.whenInLineHasTypeId.isNotEmpty) {
        final triggerSkus = <String>[
          for (final spec in line)
            if (spec.ends.any(
              (e) => e.connectorTypeId == rule.whenInLineHasTypeId,
            ))
              spec.productSku,
        ];
        if (triggerSkus.isNotEmpty) {
          final hasRequired = line.any(
            (spec) => spec.ends.any(
              (e) => e.connectorTypeId == rule.requireTypeId,
            ),
          );
          if (!hasRequired) {
            issues.add(
              CompletionIssue(
                rule: rule,
                whyHe: rule.whyHe,
                severity: rule.severity,
                offendingSkus: triggerSkus,
              ),
            );
          }
        }
      }
    }
    return issues;
  }

  /// Does the [line] stay inside ONE authored system? (Plan addition B.)
  ///
  /// Each end's `connectorTypeId` maps to its [ConnectorType.systemId] via
  /// the constructor's [connectorTypes]; ends are visited in line order
  /// (specs in order, each spec's ends in order). Ends whose type is unknown
  /// or carries a null systemId are ignored. If more than one distinct
  /// non-null systemId appears, the line is incoherent: `offendingSku` is the
  /// FIRST sku (line order) carrying an end whose system differs from the
  /// first-seen system, and `offendingSystem` is that differing systemId's
  /// [SystemDef] (null when absent from [systems] — still incoherent).
