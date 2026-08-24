// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _endPair — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/connection_resolver.dart:239-319 (81 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): normalizeSize
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  ConnectResult _endPair(ProductEnd endA, ProductEnd endB) {
    CompatibilityRule? firstSizeMiss;
    for (final rule in rules) {
      final forward = rule.aTypeId == endA.connectorTypeId &&
          rule.bTypeId == endB.connectorTypeId;
      final reverse = !forward &&
          rule.aTypeId == endB.connectorTypeId &&
          rule.bTypeId == endA.connectorTypeId;
      if (!forward && !reverse) continue;
      if (_sizeOk(rule, endA, endB, forward: forward)) {
        return ConnectResult(
          mates: true,
          methodLabelHe: rule.methodLabelHe,
          rule: rule,
        );
      }
      firstSizeMiss ??= rule;
    }
    if (firstSizeMiss != null) {
      return ConnectResult(
        mates: false,
        methodLabelHe: '',
        severity: firstSizeMiss.onMismatch,
        rule: firstSizeMiss,
      );
    }
    return _noRule;
  }

  /// Size check per `rule.sizeMatch`, all comparisons via [normalizeSize].
  ///
  /// ORIENTATION RULE for [SizeMatch.tableLookup]: `rule.sizeTable` rows are
  /// `[aSize, bSize]` pairs in the rule's STATED `(aTypeId, bTypeId)`
  /// orientation — whichever end plays `aTypeId` supplies column 0. So in
  /// forward orientation we look up `[endA.size, endB.size]`; when the rule
  /// matched in REVERSE orientation we look up `[endB.size, endA.size]`
  /// accordingly. Rows shorter than 2 cells (tolerant-decoder debris) are
  /// skipped; a null table under tableLookup never matches.
  bool _sizeOk(
    CompatibilityRule rule,
    ProductEnd endA,
    ProductEnd endB, {
    required bool forward,
  }) {
    switch (rule.sizeMatch) {
      case SizeMatch.exactSame:
        return normalizeSize(endA.sizeValue) == normalizeSize(endB.sizeValue);
      case SizeMatch.anyToAny:
        return true;
      case SizeMatch.tableLookup:
        final table = rule.sizeTable;
        if (table == null) return false;
        final aSide = normalizeSize(forward ? endA.sizeValue : endB.sizeValue);
        final bSide = normalizeSize(forward ? endB.sizeValue : endA.sizeValue);
        for (final row in table) {
          if (row.length < 2) continue;
          if (normalizeSize(row[0]) == aSide &&
              normalizeSize(row[1]) == bSide) {
            return true;
          }
        }
        return false;
    }
  }

  /// Evaluates every [CompletionRule] against the [line], in rule list order;
  /// offending skus are reported in line order. A rule carries one (or, in
  /// principle, both) of two shapes — each shape that fires appends its own
  /// issue, MATERIAL first, then TYPE (deterministic):
  ///
  /// 1. MATERIAL shape (`incompatibleMaterialGroups` non-null/non-empty —
  ///    the plumbing seed's galvanic rule, which has EMPTY type fields):
  ///    collect the line's non-null `materialGroupId` set; when ≥2 DISTINCT
  ///    groups of the rule's listed groups are present together, the rule
  ///    fires. `offendingSkus` = the skus carrying those present groups;
  ///    `whyHe` = `requiredInterposerWhyHe ?? whyHe`.
  /// 2. TYPE shape (`whenInLineHasTypeId` non-empty): when any end in the
  ///    line has the trigger type AND no end has `requireTypeId` (checked
  ///    literally — an authored empty `requireTypeId` matches no end, so the
  ///    trigger alone fires the rule), the rule fires. `offendingSkus` = the
  ///    skus carrying the trigger type; `whyHe` = `whyHe`.
