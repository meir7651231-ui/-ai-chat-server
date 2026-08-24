// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · isFitting — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:816-851 (36 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains, isPipe
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool isFitting(LipskeyCatalogProduct p) =>
    _fittingCats.contains(p.categoryHe) ||
    (companyCatalogActive && _fittingTypes.contains(p.productType));

const _pipeCats = {
  'צינורות אפורות', 'צינורות PP', 'צינורות', 'צינורות רב שכבתי',
  'צינורות גמישים', 'צינורות מקלחת',
};
bool _isPipe(LipskeyCatalogProduct p) => _pipeCats.contains(p.categoryHe);

/// Public: true when a product is sold by length (a pipe), so the BOM should
/// carry meters rather than a unit count.
bool isPipe(LipskeyCatalogProduct p) => _isPipe(p);

/// Edge cost for the path search. Primary term (10·parts) keeps the result a
/// fewest-parts path. A large penalty steers gap-filling through real fittings
/// instead of functional devices. Beyond that, two material-aware refinements
/// break ties toward installations a plumber would actually pick:
///
///   1. Material-transition penalty is weighted by FAMILY. Staying in the
///      same material (HDPE↔HDPE) is free; a drainage-family hop (PVC↔PP)
///      pays 1; a cross-family hop (brass↔HDPE) pays 4 — those are the
///      transitions a real installation tries to avoid because each one needs
///      a special adapter and a sealing detail (PTFE, hemp, dielectric…).
///
///   2. Direct-mate bonus. When two products attach via thread/press
///      (no pipe between them), the connection is "clean": no extra pipe to
///      buy, no clamp to torque. Pipe-bridged connections (compression on
///      compression of the same DN, where a pipe slides between the two)
///      incur an extra +2 cost so the search prefers thread-rich chains
///      whenever both options exist.
const _drainageFamily = {'PVC', 'PP', 'רב-שכבתי', 'ceramic'};

/// Smallest connector-bore on [p], in millimetres. Returns null when no end
/// has a parseable size (rare). Used by the edge cost so the BFS naturally
/// prefers paths through wider components — bottleneck-free by construction.
