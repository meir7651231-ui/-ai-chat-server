// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · productSystems — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:447-478 (32 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Set<WaterSystem> productSystems(LipskeyCatalogProduct p) {
  final c = p.categoryHe;
  if (_supplyCats.contains(c)) return {WaterSystem.supply};
  if (_drainCats.contains(c)) return {WaterSystem.drainage};
  if (_fixtureCats.contains(c) || _structuralCats.contains(c)) return _allSystems;
  // Ambiguous category → split by context using the product's own ends.
  final ends = kVerifiedSpecs[p.sku]?.endSystems;
  return (ends == null || ends.isEmpty) ? _allSystems : ends;
}

/// A product's role in a flow path.
/// * connector — pipes, fittings, nipples, adapters, valves, gaskets: flow
///   passes through them, so they may be auto-inserted as mid-line connectors.
/// * fixture — toilets, sinks, bathing systems: terminal devices that may only
///   sit at a line endpoint (an anchor), never as a pass-through connector.
/// * accessory — hangers, clamps, anchors, tools, seats, grab bars: not part of
///   the flow path at all, never a connector.
enum FlowRole { connector, fixture, accessory }

/// Individual non-flow products that live inside otherwise-flow categories
/// (e.g. thermal insulation under hot-water, a hanger under shower accessories,
/// a garden spray gun under garden equipment). Each name confirms it carries no
/// flow connection, so it must never be treated as a connector.
const _accessorySkus = {
  'HW-INSUL', 'HW-CLIP', 'HW-SEALANT',          // בידוד / חבק / איטום PTFE
  '77000026', '77000027', '77980000', '77980001', // אקדחי מים/אצבע לגינה (קצה)
  '77701185',                                    // מתלה מתכוונן
  '77772604', '77772605',                        // סטי הידוק לברז פרח
  '777M1802', '777M1807',                        // מנגנוני הדחה (פנים-קבועה)
  '777A5034', '77772410', '77772412', '77772415', // דיורי פיה (קצה)
};

