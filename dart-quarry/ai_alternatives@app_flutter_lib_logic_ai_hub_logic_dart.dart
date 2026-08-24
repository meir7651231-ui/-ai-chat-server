// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · aiAlternatives — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/ai_hub_logic.dart:202-345 (144 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): indexWhere, cheaperAlternativeBrand, cheaperAlternativesAcrossCatalog, compareTo, sublist, contains, where
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<AiAlt> aiAlternatives() {
  final out = <AiAlt>[];
  final seen = <String>{};

  // 1) The real helper over priced catalog products (reuses cheaperAlternativeBrand).
  for (final pb in kHomeProductBrands) {
    final sp = _pricedSmartProduct(pb);
    final recI = sp.brands.indexWhere((b) => b.rec);
    final rec = sp.brands[recI >= 0 ? recI : 0];
    final alt = cheaperAlternativeBrand(sp, recI >= 0 ? recI : 0);
    if (alt == null || rec.price == null) continue;
    if (!seen.add(pb.product)) continue;
    out.add(AiAlt(
      cat: pb.product,
      fromName: rec.name,
      fromPrice: rec.price!,
      toName: alt.name,
      toPrice: alt.price,
    ));
  }

  // 2) Merge the home sheet's own cross-catalog scan (same data, sorted) for
  //    any product not already covered.
  for (final CheaperAlt a in cheaperAlternativesAcrossCatalog()) {
    if (!seen.add(a.product)) continue;
    out.add(AiAlt(
      cat: a.product,
      fromName: a.recName,
      fromPrice: a.recPrice,
      toName: a.altName,
      toPrice: a.altPrice,
    ));
  }

  out.sort((a, b) => b.save.compareTo(a.save));
  return out.length > 5 ? out.sublist(0, 5) : out;
}

// ─── 67. THREE-WAY MATCHING — proto docs @21308-21312 ─────────────────────────
class ThreeWayDoc {
  const ThreeWayDoc({
    required this.id,
    required this.order,
    required this.delivery,
    required this.invoice,
  });

  final String id;
  final int order;
  final int delivery;
  final int invoice;

  bool get match => order == delivery && delivery == invoice;
}

const List<ThreeWayDoc> kThreeWayDocs = [
  ThreeWayDoc(id: 'BS-1041', order: 8400, delivery: 8400, invoice: 8400),
  ThreeWayDoc(id: 'BS-1042', order: 5200, delivery: 5200, invoice: 5460),
  ThreeWayDoc(id: 'BS-1039', order: 3100, delivery: 2900, invoice: 3100),
];

// ─── 68. WEATHER AUTOMATION — proto fc @21338-21343 ───────────────────────────
class WeatherDay {
  const WeatherDay({
    required this.day,
    required this.ic,
    required this.temp,
    required this.note,
  });

  final String day;
  final String ic;
  final String temp;
  final String note;

  bool get warn => note.contains('⚠️');
}

const List<WeatherDay> kWeather = [
  WeatherDay(day: 'היום', ic: '☀️', temp: '28°', note: 'מזג אוויר אידיאלי ליציקות'),
  WeatherDay(day: 'מחר', ic: '⛅', temp: '24°', note: 'מתאים לעבודות גמר'),
  WeatherDay(day: 'יום ג׳', ic: '🌧️', temp: '17°', note: '⚠️ גשם — לדחות יציקות בטון'),
  WeatherDay(day: 'יום ד׳', ic: '🌧️', temp: '16°', note: '⚠️ גשם — עבודות פנים בלבד'),
];

// ─── 69. EQUIPMENT WEAR — proto gear @21361-21366 ─────────────────────────────
class GearWear {
  const GearWear({
    required this.name,
    required this.hours,
    required this.life,
    required this.ic,
  });

  final String name;
  final int hours;
  final int life;
  final String ic;

  int get pct => (hours / life * 100).round();
  bool get worn => pct >= 85;
}

const List<GearWear> kGear = [
  GearWear(name: 'מערבל בטון', hours: 420, life: 500, ic: '🛢️'),
  GearWear(name: 'פטיש חשמלי', hours: 180, life: 600, ic: '🔨'),
  GearWear(name: 'גנרטור 5kW', hours: 880, life: 900, ic: '⚡'),
  GearWear(name: 'מסור דיסק', hours: 95, life: 400, ic: '⚙️'),
];

// ─── 70. SMART ANALYTICS — proto insights @21387-21391 ────────────────────────
class Insight {
  const Insight({required this.ic, required this.title, required this.sub});

  final String ic;
  final String title;
  final String sub;
}

/// Proto demo seed — kept ONLY as the verbatim reference (the `t3_ghi` guard
/// still pins its length). The hub no longer RENDERS this: 📊 Analytics חכם now
/// COMPUTES its insights from the live orders engine + budget + the real
/// cheaper-alternatives scan via [computeAnalyticsInsights]. Not wired to UI.
const List<Insight> kInsights = [
  Insight(ic: '📈', title: 'הרכש עלה ב-12% החודש', sub: 'בעיקר בקטגוריית גמר'),
  Insight(ic: '⏱️', title: 'זמן אספקה ממוצע: 2.4 שעות', sub: 'שיפור של 18% מהחודש שעבר'),
  Insight(ic: '💰', title: 'חיסכון אפשרי: ₪3,200', sub: 'מעבר לספקים זולים יותר'),
  Insight(ic: '⚠️', title: '3 הזמנות חרגו מ-SLA', sub: 'מומלץ לבדוק את ספק הצפון'),
];

/// 🟢 REAL — smart-analytics insights computed from in-app data, NOT a model.
///
/// Folds the LIVE shared orders engine ([orders] = `ordersEngineProvider`)
/// together with the budget seeds and the real cheaper-alternatives scan
/// ([aiAlternatives], itself a fold over the catalog price tiers). Every line is
/// a deterministic aggregate — no invented numbers, no language model:
///   • 📦 total orders + Σ spend       — `orders.length`, `Σ o.sum`.
///   • 💵 average order value          — `round(Σ spend / orders.length)`.
///   • 🚚 open vs delivered            — `where(isOpen).length` / total.
///   • 💰 possible savings             — `Σ aiAlternatives().save` (real catalog
///                                       recommended-vs-cheaper deltas).
///   • 📊 budget utilization           — `round(kBudgetSpent/kBudgetTotal*100)`
///                                       + remaining `kBudgetTotal-kBudgetSpent`.
/// Stable order; with the seed-only engine every number is reproducible.
