// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · plumbingCompatRules — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/seeds/plumbing_trade_seed.dart:328-384 (57 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): compareTo, plumbingCompletionRules, buildPlumbingSeed, plumbingTrade, plumbingCategories, plumbingProducts, plumbingAccessories, plumbingFixtures, plumbingConnectorTypes, plumbingSystems, plumbingProductSpecs
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<CompatibilityRule> plumbingCompatRules() {
  const pairs = <(EndType, EndType, String)>[
    (EndType.bspMale, EndType.bspFemale, 'תבריג + PTFE'),
    (EndType.pexPress, EndType.pexPress, 'Press / טבעת כיווץ'),
    (EndType.copperPress, EndType.copperPress, 'Press / O-ring'),
    (EndType.drainOpening, EndType.drainOpening, 'כיסוי ניקוז'),
    (EndType.hdpeCompression, EndType.hdpeCompression, 'אום הידוק (compression)'),
  ];
  return <CompatibilityRule>[
    for (final (a, b, label) in pairs)
      CompatibilityRule(
        id: '$kPlumbingTradeId.rule.${a.name}__${b.name}',
        tradeId: kPlumbingTradeId,
        aTypeId: _connTypeId(a),
        bTypeId: _connTypeId(b),
        sizeMatch: SizeMatch.exactSame,
        methodLabelHe: label,
        onMismatch: RuleSeverity.critical,
      ),
  ]..sort((a, b) => a.id.compareTo(b.id));
}

/// The single galvanic completion rule. whenInLineHasTypeId/requireTypeId are ''
/// on purpose — galvanic corrosion is MATERIAL-based, not connector-type-
/// triggered; the resolver (step 40) reads [incompatibleMaterialGroups] (the two
/// dissimilar metal groups) rather than a type trigger.
List<CompletionRule> plumbingCompletionRules() => <CompletionRule>[
      CompletionRule(
        id: '$kPlumbingTradeId.completion.galvanic',
        tradeId: kPlumbingTradeId,
        whenInLineHasTypeId: '',
        requireTypeId: '',
        whyHe:
            'מתכות לא-דומות (נחושת/פליז ↔ פלדה/נירוסטה) באותו קו דורשות מתאם דיאלקטרי למניעת קורוזיה גלוונית',
        incompatibleMaterialGroups: ['copper-group', 'iron-group'],
        requiredInterposerWhyHe:
            'מתאם דיאלקטרי (ניתוק גלווני בין קבוצות-מתכת לא-דומות)',
        severity: RuleSeverity.critical,
      ),
    ];

/// Build the full plumbing [TradesDoc] from the live consts — deterministic, so two
/// calls are equal. The authored connection model (connector types / systems /
/// product specs / compat + completion rules) is seeded from the 891 VerifiedSpecs.
TradesDoc buildPlumbingSeed() => TradesDoc(
      trades: [plumbingTrade()],
      categories: plumbingCategories(),
      products: plumbingProducts(),
      accessories: plumbingAccessories(),
      fixtures: plumbingFixtures(),
      connectorTypes: plumbingConnectorTypes(),
      systems: plumbingSystems(),
      productSpecs: plumbingProductSpecs(),
      compatRules: plumbingCompatRules(),
      completionRules: plumbingCompletionRules(),
    );

