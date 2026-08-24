// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · plumbingFixtures — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/seeds/plumbing_trade_seed.dart:204-270 (67 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toList, compareTo, plumbingSystems
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<SmartFixture> plumbingFixtures() {
  final smartKeyMap = _smartKeyToId();
  return kSmartProducts
      .map(
        (sp) => SmartFixture(
          id: '$kPlumbingTradeId.fixture.${sp.key}',
          tradeId: kPlumbingTradeId,
          categoryId: smartKeyMap[sp.key] ?? kUncategorizedCategoryId,
          nameHe: sp.name,
          emoji: sp.emoji,
          diagramTitleHe: sp.diagramTitle,
          brandRefs: sp.brands
              .map(
                (b) => SmartBrandRef(
                  name: b.name,
                  tag: b.tag,
                  rec: b.rec,
                  sku: b.sku,
                  imageAsset: b.imageAsset,
                  price: b.price,
                ),
              )
              .toList(),
          accessoryRuleIds: [
            for (var i = 0; i < sp.acc.length; i++)
              '$kPlumbingTradeId.acc.${sp.key}.$i',
          ],
          stages: sp.stages
              .map(
                (s) => InstallStage(
                  emoji: s.emoji,
                  labelHe: s.label,
                  subHe: s.sub,
                  isFinal: s.isFinal,
                  matchTokens: s.match,
                ),
              )
              .toList(),
        ),
      )
      .toList()
    ..sort((a, b) => a.id.compareTo(b.id));
}

// ── step 37 — the authored connection model (seeded from the VerifiedSpecs) ────

/// The two plumbing systems (supply / drainage), sorted by id. These mirror
/// [WaterSystem]; the resolver pins a line to exactly one.
List<SystemDef> plumbingSystems() => <SystemDef>[
      SystemDef(
        id: '$kPlumbingTradeId.sys.supply',
        tradeId: kPlumbingTradeId,
        nameHe: 'אספקה',
        color: 0xFF2196F3,
      ),
      SystemDef(
        id: '$kPlumbingTradeId.sys.drainage',
        tradeId: kPlumbingTradeId,
        nameHe: 'ניקוז',
        color: 0xFF9E9E9E,
      ),
    ]..sort((a, b) => a.id.compareTo(b.id));

/// One [ConnectorType] per [EndType], sorted by id. `sizeValues` is the sorted,
/// distinct set of sizes seen for that end-type across ALL [kVerifiedSpecs].
/// `nameHe` is a NEW descriptive label (the physics never reads it). `systemId`
/// is derived from the verified [ConnectorEnd.system] mapping.
