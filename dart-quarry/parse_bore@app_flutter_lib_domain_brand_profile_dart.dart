// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · parseBore — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/brand_profile.dart:292-434 (143 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toString, allMatches, tryParse, group, toList, specEnvelopeFor, engineeringSpecFor
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  double? parseBore(Map<String, dynamic>? dims) {
    final key = boreDimsKey;
    if (key == null) return null;
    final raw = dims?[key]?.toString();
    switch (boreParse) {
      case BoreParseStrategy.diRangeMax:
        // di is a tolerance range like "13.6–14.7" — take the max bore (14.7).
        final nums = raw == null
            ? const <double>[]
            : kDiRangeNumberPattern
                .allMatches(raw)
                .map((m) => double.tryParse(m.group(0)!))
                .whereType<double>()
                .toList();
        return nums.isEmpty ? null : nums.reduce((a, b) => a > b ? a : b);
      case BoreParseStrategy.dnDirect:
        return raw == null ? null : double.tryParse(raw);
      case BoreParseStrategy.none:
        return null;
    }
  }

  /// G1 — the full specless engineering snapshot from [dims], byte-matching
  /// `engineeringSpecFor`'s brand branches (related_info.dart:500-538). Null
  /// when the brand has no envelope (the site's else). The record shape is
  /// exactly the site's return type, so a parity test can compare
  /// `profile.specEnvelopeFor(p.dims) == engineeringSpecFor(p)` for specless
  /// brand products.
  ({
    String material,
    String? pressureRating,
    double maxTempC,
    String waterSystem,
    String endsSummary,
    double? minBoreMm,
  })? specEnvelopeFor(Map<String, dynamic>? dims) {
    final env = specEnvelope;
    if (env == null) return null;
    final matKey = env.materialDimsKey;
    final pnKey = env.pressureDimsKey;
    final pn = pnKey == null ? null : dims?[pnKey];
    return (
      // Polyroll: (dims?['חומר'] as String?) ?? 'PPR' — same cast semantics.
      material: (matKey == null ? null : dims?[matKey] as String?) ??
          env.materialFallbackHe,
      pressureRating: pn == null ? null : 'PN$pn',
      maxTempC: env.maxTempC,
      waterSystem: env.waterSystemHe,
      endsSummary: env.endsSummaryHe,
      minBoreMm: parseBore(dims),
    );
  }
}

/// פולירול — PPR pressure supply (socket fusion).
const BrandProfile kPolyrollProfile = BrandProfile(
  brandId: 'polyroll',
  brandKey: kPolyrollBrandKey,
  specEnvelope: BrandSpecEnvelope(
    maxTempC: 90,
    waterSystemHe: 'הזנה — חמים וקרים',
    endsSummaryHe: 'ריתוך (socket fusion)',
    materialFallbackHe: 'PPR',
    materialDimsKey: kPolyrollMaterialDimsKey,
    pressureDimsKey: kPolyrollPnDimsKey,
  ),
  boreParse: BoreParseStrategy.diRangeMax,
  boreDimsKey: kPolyrollDiDimsKey,
  imageDir: 'polyroll',
  finderEmoji: '🚰',
  finderLabelHe: 'אספקת מים',
  systemHint: {WaterSystem.supply},
  kitStrategy: KitStrategy.pprSocketFusion,
  kitCountFromRecommendedWhenSpecless: true,
  kitPanelShowsPprWeldPlan: true,
  specStrips: [
    BrandStripDef(
      kind: 'info',
      emoji: 'ℹ️',
      label: 'מידע כללי',
      value: 'צנרת PPR · יתרונות',
      tintArgb: 0xFF3B82F6,
    ),
    BrandStripDef(
      kind: 'hygiene',
      emoji: '🧼',
      label: 'חיטוי וניקוי',
      value: 'בור חלק · ללא אבנית',
      tintArgb: 0xFF06B6D4,
    ),
  ],
);

/// חוליות — SmartLock PP gravity drainage (snap-fit).
const BrandProfile kHuliotProfile = BrandProfile(
  brandId: 'huliot',
  brandKey: kHuliotBrandKey,
  specEnvelope: BrandSpecEnvelope(
    maxTempC: 95,
    waterSystemHe: 'דלוחין (שפכים)',
    endsSummaryHe: 'נעילת שיניים ראטצ\'ט + אטם TPE',
    materialFallbackHe: 'PP רב-שכבתי (PPMD)',
  ),
  boreParse: BoreParseStrategy.dnDirect,
  boreDimsKey: kHuliotDnDimsKey,
  imageDir: 'huliot_smartlock',
  finderEmoji: '🟢',
  finderLabelHe: 'דלוחין SmartLock',
  systemHint: {WaterSystem.drainage},
  kitStrategy: KitStrategy.smartLockSnapFit,
  kitCountFromRecommendedWhenSpecless: true,
  specStrips: [
    BrandStripDef(
      kind: 'info',
      emoji: 'ℹ️',
      label: 'מידע כללי',
      value: 'SmartLock™ · דלוחין PP · 32-63 מ"מ',
      tintArgb: 0xFF14764A,
    ),
  ],
);

/// ליפסקי — the else-branch behavior of every ladder (also what any unmapped
/// brand string, e.g. the AQUATEC rows, gets today).
const BrandProfile kLipskeyProfile = BrandProfile(
  brandId: 'lipskey',
  brandKey: kLipskeyBrandKey,
  imageDir: 'lipskey',
  systemHint: {WaterSystem.drainage},
  kitStrategy: KitStrategy.endsDerived,
);

/// All authored profiles, keyed by the EXACT brand strings the if-ladders test.
const Map<String, BrandProfile> kBrandProfiles = {
  kPolyrollBrandKey: kPolyrollProfile,
  kHuliotBrandKey: kHuliotProfile,
  kLipskeyBrandKey: kLipskeyProfile,
};

/// The profile for [brandName], or the Lipskey default — replicating every
/// ladder's else-branch: any brand string that isn't 'פולירול'/'חוליות'
/// (including null and the catalog's AQUATEC rows) behaves exactly like
/// ליפסקי at all five sites today.
