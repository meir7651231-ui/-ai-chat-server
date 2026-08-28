import '../dart-data/is_directional_device-terms.dart' as td_is_directional_device;
import '../dart-data/directional_context-terms.dart';
// 📦 קופסת-חיבורים · bs-pipe (בנייה-חכמה · מנוע-הצנרת המלא: מסלול · לחץ · ערכה · תמחיר · תאימות · צ׳קליסט).
// מקור-האמת: buildsmart/app_flutter/lib/logic/{install_engine, pressure_drop, install_kit,
//   price_estimate}. מחווטת 38 אטומי-צנרת מ-../dart/ למנוע-שלם. אפס-import של קופסה-אחרת (חוק-2/3).
// שבעה אשכולות שמתחברים ללוח-האם המאוחד (board.dart):
//   (א) מסלול — Dijkstra בגרף-התאימות (findShortestPath) + חלופות-Yen + עלות-נתיב.
//   (ב) לחץ — estimatePressureDrop המחווטת ל-k/bore/minBore/friction/pow025/widerSibling.
//   (ג) ערכה+תמחיר — recommendedKitFor(Product) + estimatePrice.
//   (ד) תאימות — canConnect · failReason · connectionLabel · pipeDn.
//   (ה) פרדיקטים — flowRole · isPipe · isFitting · productSystems · suitableForTemp · material · maxTemp · lineIsSupply · manifoldOutlets.
//   (ו) צ׳קליסט — lineComplianceChecklist + reminders + galvanic + directional.
//   (ז) עוזרים — bomAddItem · kitAddItem · branchLabel · widerSiblingOf · swapMatesWithNeighbours.
//
// ── הכרעות-קופסה (חוק-3/8 · ידע-קופסה) ─────────────────────────────────────────
// 1) חוזה-הדאטה של הקופסה (סכום חוזי-האטומים = מפרט-ההזנה, NORTH-STAR): כל האטומים
//    דורשים שקעי-קטלוג (kVerifiedSpecs/catalog/canConnect/…). הקופסה מקבלת פעם-אחת
//    בבנאי `specs` (⇔ kVerifiedSpecs) + `catalog` (⇔ kCatalogProducts) ומזינה מהם את
//    **כל** השקעים הפנימיים. צורת-specs: {sku: {material, maxTempC?, ends:[{type,size}],
//    endSystems?:['supply'|'drainage'], compat?:[sku…]}}. צורת-catalog: [{sku, categoryHe,
//    nameHe, brand, productType?, connectionSizes?, connectionGender?, connectionMethod?, dims?}].
//    זהות/סוד אינם כאן (חוק-6) — רק דאטת-דומיין הנדסית.
// 2) גישור-אטום-לאטום (תפקיד-הקופסה המרכזי): findShortestPath קורא-לשכניו
//    canConnect/edgeCost/compatibleWith/usableConnector/systemsOf. חוט-לא-מייבא-חוט
//    (חוק-1) ⇒ **הקופסה מגשרת**: מעבירה את מתודות-האטומים כשקעים. כל טיפוסי-הצומת
//    (GraphNode/AltNode/CompatNode/EdgeNode/ConnPart…) הם מחזיקי-sku נפרדים פר-אטום;
//    הקופסה מאחדת ל-`PipeProduct` קנוני יחיד, ומתאמת פר-קריאה לפי sku דרך אינדקס-החיפוש.
// 3) שקע `usableConnector` (‏install_engine.dart:597, `_usableConnector`): לא קודם כאטום
//    נפרד ⇒ הקופסה מחווטת אותו מ-`flowRole`==connector (מוצר שהזרימה עוברת בו). הכרעת-קופסה.
// 4) type-adapter ל-KitItem: recommendedKitFor ו-recommendedKitForProduct מגדירים כל אחד
//    KitItem/KitKind/Severity נפרדים (זהי-צורה, verbatim מ-install_kit.dart:15-36). הקופסה
//    מייצאת את של recommendedKitFor כקנוני, ומתאמת את פלט-recommendedKitForProduct לפי .index
//    (סדר-הערכים זהה). מגן-סחף: הפרוף מאמת שוויון-אורך ה-enums.
// 5) `verifiedCompat` (can_connect · swap): שני-הצדדים בעלי spec ⇒ תוצאת-חברוּת ב-compat
//    (סימטרי); צד-אחד בלי spec ⇒ null ⇒ נפילה ל-name-inference (verbatim install_engine.dart:501-503).
// 6) `_bspInchToMm` (bore_meters) ו-`_branchLetters` (branch_label): דאטת-מקור-אמת יחידה
//    (pressure_drop.dart:85-88 · install_engine.dart:934) — מוחזקת כ-const-קופסה, מוזרקת לשקע.
import '../dart/find_shortest_path.dart' as fsp;
import '../dart/find_shortest_path_excluding.dart' as fspe;
import '../dart/find_alternative_paths.dart' as fap;
import '../dart/compatible_with.dart' as cw;
import '../dart/edge_cost.dart' as ec;
import '../dart/path_cost.dart' as pc;
import '../dart/estimate_pressure_drop.dart' as epd;
import '../dart/wider_sibling_of.dart' as wso;
import '../dart/swap_mates_with_neighbours.dart' as swp;
import '../dart/bore_meters.dart' as bm;
import '../dart/min_bore_of.dart' as mbo;
import '../dart/k_for_type.dart' as kft;
import '../dart/friction_factor.dart' as ff;
import '../dart/pow025.dart' as pw;
import '../dart/recommended_kit_for.dart' as rkf;
import '../dart/recommended_kit_for_product.dart' as rkfp;
import '../dart/estimate_price.dart' as ep;
import '../dart-data/pipe-prices.dart' as pd; // דאטה — מוזרקת ע"י הקופסה למנוע-התמחיר
import '../dart/can_connect.dart' as cc;
import '../dart/connection_fail_reason.dart' as cfr;
import '../dart-data/connection-fail-labels.dart' as cfl; // דאטה — תוויות-כשל מוזרקות
import '../dart/connection_method_label.dart' as cml;
import '../dart/pipe_connection_dn.dart' as pcd;
import '../dart/product_max_temp_c.dart' as pmt;
import '../dart/product_material.dart' as pmat;
import '../dart/product_suitable_for_temp.dart' as pst;
import '../dart/line_is_supply.dart' as lis;
import '../dart/is_fitting.dart' as isf;
import '../dart/is_pipe.dart' as ip;
import '../dart/flow_role.dart' as fr;
import '../dart/product_systems.dart' as ps;
import '../dart/manifold_outlets.dart' as mo;
import '../dart/line_compliance_checklist.dart' as lcc;
import '../dart/line_install_reminders.dart' as lir;
import '../dart/galvanically_dissimilar.dart' as gd;
import '../dart/is_directional_device.dart' as idd;
import '../dart/directional_context.dart' as dc;
import '../dart/install_add_item.dart' as iai;
import '../dart/kit_add_item.dart' as kai;
import '../dart/branch_label.dart' as bl;

// ── טיפוסי-הנתונים שהאטומים פועלים עליהם — נחשפים דרך הקופסה (data-shapes) ──────
export '../dart/estimate_pressure_drop.dart'
    show PressureDropResult, FlowSuggestion, SuggestionKind;
export '../dart/recommended_kit_for.dart'
    show KitItem, KitKind, Severity; // הטיפוס-הקנוני (הכרעת-קופסה 4)
export '../dart/estimate_price.dart' show PriceEstimate;
export '../dart/line_compliance_checklist.dart' show LineCheck, CheckSeverity;
export '../dart/product_systems.dart' show WaterSystem;
export '../dart/flow_role.dart' show FlowRole;

// ── המוצר-הקנוני של הקופסה (הכרעת-קופסה 2): כל שדה שאטום כלשהו קורא, במקום-אחד ──
class PipeProduct {
  final String sku;
  final String categoryHe;
  final String nameHe;
  final String brand;
  final String? productType;
  final List<String> connectionSizes;
  final String? connectionGender;
  final String? connectionMethod;
  final Map<String, dynamic>? dims;
  const PipeProduct({
    required this.sku,
    this.categoryHe = '',
    this.nameHe = '',
    this.brand = '',
    this.productType,
    this.connectionSizes = const [],
    this.connectionGender,
    this.connectionMethod,
    this.dims,
  });
}

// ── דאטת-מקור-אמת (הכרעת-קופסה 6) ──
const Map<String, int> _bspInchToMm = {
  '1/2': 15, '3/4': 20, '1': 25, '1-1/4': 32, '1-1/2': 40, '2': 50,
};
const List<String> _branchLetters = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
];
const Set<String> _knownEndTypes = {
  'hdpeCompression', 'pexPress', 'copperPress', 'bspMale', 'bspFemale',
  'drainOpening',
};

class PipeBox {
  final Map<String, dynamic> specs;
  final bool companyCatalogActive;

  final Map<String, PipeProduct> _bySku = {};
  final List<PipeProduct> _catalog = [];
  final List<cw.CompatNode> _compatCatalog = [];
  final Map<String, rkf.KitSpec> _kitSpecs = {};
  final Map<String, rkfp.KitSpec> _kitSpecsP = {};

  PipeBox({
    required this.specs,
    List<dynamic> catalog = const [],
    this.companyCatalogActive = false,
  }) {
    for (final e in catalog) {
      final p = _parse(e);
      _bySku[p.sku] = p;
      _catalog.add(p);
      _compatCatalog.add(cw.CompatNode(sku: p.sku, categoryHe: p.categoryHe));
    }
    for (final sku in specs.keys) {
      final mat = _material(sku);
      if (mat == null) continue;
      final ends = _ends(sku) ?? const [];
      _kitSpecs[sku] = rkf.KitSpec(
        material: mat,
        ends: [
          for (final r in ends)
            if (_knownEndTypes.contains(r['type']))
              rkf.KitEnd(rkf.EndType.values.byName(r['type']!), r['size']!),
        ],
      );
      _kitSpecsP[sku] = rkfp.KitSpec(
        material: mat,
        ends: [
          for (final r in ends)
            if (_knownEndTypes.contains(r['type']))
              rkfp.KitEnd(rkfp.EndType.values.byName(r['type']!), r['size']!),
        ],
      );
    }
  }

  // ── פרסור-קלט ──
  PipeProduct _parse(dynamic e) {
    final m = (e as Map).cast<String, dynamic>();
    return PipeProduct(
      sku: m['sku'] as String,
      categoryHe: (m['categoryHe'] as String?) ?? '',
      nameHe: (m['nameHe'] as String?) ?? '',
      brand: (m['brand'] as String?) ?? '',
      productType: m['productType'] as String?,
      connectionSizes:
          ((m['connectionSizes'] as List?)?.map((x) => x.toString()).toList()) ??
              const [],
      connectionGender: m['connectionGender'] as String?,
      connectionMethod: m['connectionMethod'] as String?,
      dims: (m['dims'] as Map?)?.cast<String, dynamic>(),
    );
  }

  // ── מחלצי-spec (השקעים הפנימיים · הכרעת-קופסה 1) ──
  Map<String, dynamic>? _specRaw(String sku) =>
      (specs[sku] as Map?)?.cast<String, dynamic>();
  bool _hasSpec(String sku) => _specRaw(sku) != null;
  String? _material(String sku) => _specRaw(sku)?['material'] as String?;
  double? _maxTempC(String sku) =>
      (_specRaw(sku)?['maxTempC'] as num?)?.toDouble();
  Set<String>? _endSystems(String sku) {
    final l = _specRaw(sku)?['endSystems'] as List?;
    return l?.map((x) => x.toString()).toSet();
  }

  Set<String> _compat(String sku) {
    final l = _specRaw(sku)?['compat'] as List?;
    return l?.map((x) => x.toString()).toSet() ?? const {};
  }

  List<Map<String, String>>? _ends(String sku) {
    final l = _specRaw(sku)?['ends'] as List?;
    if (l == null) return null;
    return l.map((x) {
      final m = (x as Map).cast<String, dynamic>();
      return {'type': m['type'] as String, 'size': m['size'].toString()};
    }).toList();
  }

  PipeProduct _resolve(String sku, Map<String, PipeProduct> idx) =>
      idx[sku] ?? _bySku[sku] ?? PipeProduct(sku: sku);

  // ── שקע verifiedCompat (הכרעת-קופסה 5) ──
  bool? _verifiedCompat(String a, String b) => (_hasSpec(a) && _hasSpec(b))
      ? (_compat(a).contains(b) || _compat(b).contains(a))
      : null;

  cc.ConnPart _connPart(PipeProduct p) => cc.ConnPart(
        sku: p.sku,
        connectionSizes: p.connectionSizes,
        connectionGender: p.connectionGender,
        connectionMethod: p.connectionMethod,
      );

  bool _canConnectSku(String a, String b, Map<String, PipeProduct> idx) =>
      cc.canConnect(_connPart(_resolve(a, idx)), _connPart(_resolve(b, idx)),
          verifiedCompat: _verifiedCompat);

  // ── שקעי edge_cost ──
  ec.SpecView? _ecSpec(String sku) {
    final mat = _material(sku);
    if (mat == null) return null;
    final e = _ends(sku) ?? const [];
    return ec.SpecView(
      material: mat,
      ends: [for (final r in e) ec.EndPart(r['type']!, r['size']!)],
    );
  }

  List<bm.ConnectorEnd>? _boreEnds(String sku) {
    final e = _ends(sku);
    if (e == null) return null;
    return [
      for (final r in e)
        if (_knownEndTypes.contains(r['type']))
          bm.ConnectorEnd(bm.EndType.values.byName(r['type']!), r['size']!),
    ];
  }

  double? _minBoreMeters(String sku) => mbo.minBoreOf<String, bm.ConnectorEnd>(
        sku,
        endsOf: _boreEnds,
        boreOf: (e) => bm.boreMeters(e, bspInchToMm: _bspInchToMm),
      );

  double? _minBoreMm(String sku) {
    final m = _minBoreMeters(sku);
    return m == null ? null : m * 1000;
  }

  int _edgeCostSku(String a, String b, Map<String, PipeProduct> idx) {
    final pa = _resolve(a, idx), pb = _resolve(b, idx);
    return ec.edgeCost(
      ec.EdgeNode(sku: pa.sku, categoryHe: pa.categoryHe),
      ec.EdgeNode(sku: pb.sku, categoryHe: pb.categoryHe),
      verifiedSpec: _ecSpec,
      minBoreMm: _minBoreMm,
      isFitting: (cat) =>
          isf.isFitting(isf.FittingPart(cat), companyCatalogActive: companyCatalogActive),
    );
  }

  // ── שקעי find_shortest_path ──
  Set<String> _systemsStr(String sku, Map<String, PipeProduct> idx) =>
      productSystems(_resolve(sku, idx))
          .map((w) => w == ps.WaterSystem.supply ? 'supply' : 'drainage')
          .toSet();

  List<String> _neighborSkus(String sku, int tempC, Map<String, PipeProduct> idx) {
    final anchor =
        cw.CompatNode(sku: sku, categoryHe: _resolve(sku, idx).categoryHe);
    final res = cw.compatibleWith(
      anchor,
      catalog: _compatCatalog,
      canConnect: (a, b) => _canConnectSku(a.sku, b.sku, idx),
      suitableForTemp: (p, t) => pst.productSuitableForTemp<cw.CompatNode>(
          p, t, maxTempCOf: (x) => _maxTempC(x.sku)),
      tempC: tempC,
    );
    return res.map((c) => c.sku).toList();
  }

  bool _usable(String sku, Map<String, PipeProduct> idx) =>
      flowRole(_resolve(sku, idx)) == fr.FlowRole.connector;

  List<fsp.GraphNode>? _fsp(
          String f, String t, int md, int tc, Map<String, PipeProduct> idx) =>
      fsp.findShortestPath(
        fsp.GraphNode(sku: f),
        fsp.GraphNode(sku: t),
        maxDepth: md,
        tempC: tc,
        systemsOf: (n) => _systemsStr(n.sku, idx),
        canConnect: (a, b) => _canConnectSku(a.sku, b.sku, idx),
        neighbors: (tail, tt) =>
            _neighborSkus(tail.sku, tt, idx).map((s) => fsp.GraphNode(sku: s)).toList(),
        usableConnector: (n) => _usable(n.sku, idx),
        edgeCost: (a, b) => _edgeCostSku(a.sku, b.sku, idx),
      );

  List<fspe.GraphNode>? _fspe(String f, String t, int md, int tc,
          Set<(String, String)> blocked, Map<String, PipeProduct> idx) =>
      fspe.findShortestPathExcluding(
        fspe.GraphNode(sku: f),
        fspe.GraphNode(sku: t),
        maxDepth: md,
        tempC: tc,
        blocked: blocked,
        systemsOf: (n) => _systemsStr(n.sku, idx),
        canConnect: (a, b) => _canConnectSku(a.sku, b.sku, idx),
        neighbors: (tail, tt) =>
            _neighborSkus(tail.sku, tt, idx).map((s) => fspe.GraphNode(sku: s)).toList(),
        usableConnector: (n) => _usable(n.sku, idx),
        edgeCost: (a, b) => _edgeCostSku(a.sku, b.sku, idx),
      );

  // ═══ אשכול א׳ · מסלול ═══════════════════════════════════════════════════════

  /// המסלול הזול-ביותר בגרף-התאימות בין [from] ל-[to] (Dijkstra · Dijkstra: 10·חלקים +
  /// מעברי-חומר), או null כשאין מסלול תוך [maxDepth].
  List<PipeProduct>? planShortestPath(
    PipeProduct from,
    PipeProduct to, {
    int maxDepth = 6,
    int tempC = 20,
  }) {
    final idx = {..._bySku, from.sku: from, to.sku: to};
    final path = _fsp(from.sku, to.sku, maxDepth, tempC, idx);
    return path?.map((n) => _resolve(n.sku, idx)).toList();
  }

  /// עד [k] מסלולים חלופיים שונים (Yen), ממוינים לפי-מחיר.
  List<List<PipeProduct>> alternativePaths(
    PipeProduct from,
    PipeProduct to, {
    int k = 3,
    int maxDepth = 6,
    int tempC = 20,
  }) {
    final idx = {..._bySku, from.sku: from, to.sku: to};
    final res = fap.findAlternativePaths(
      fap.AltNode(sku: from.sku),
      fap.AltNode(sku: to.sku),
      k: k,
      maxDepth: maxDepth,
      tempC: tempC,
      shortestPath: (f, t, md, tc) =>
          _fsp(f.sku, t.sku, md, tc, idx)?.map((n) => fap.AltNode(sku: n.sku)).toList(),
      shortestPathExcluding: (f, t, md, tc, blocked) => _fspe(f.sku, t.sku, md, tc, blocked, idx)
          ?.map((n) => fap.AltNode(sku: n.sku))
          .toList(),
      pathCost: (path) => pc.pathCost<fap.AltNode>(path,
          edgeCost: (a, b) => _edgeCostSku(a.sku, b.sku, idx)),
    );
    return res.map((p) => p.map((n) => _resolve(n.sku, idx)).toList()).toList();
  }

  // ═══ אשכול ב׳ · לחץ ═════════════════════════════════════════════════════════

  /// ירידת-לחץ הידראולית של שרשרת [chain] — ΔP · ΣK · קוטר-מינימלי · מוצר-הבקבוק +
  /// הצעות-פעולה. מחווטת k/minBore/bore/friction/pow025/widerSibling פנימית.
  epd.PressureDropResult<PipeProduct> pressureDrop(
    List<PipeProduct> chain, {
    double pipeLengthMeters = 5.0,
    double flowRateLPS = 0.3,
    double verticalRiseMeters = 0.0,
  }) =>
      epd.estimatePressureDrop<PipeProduct>(
        chain,
        pipeLengthMeters: pipeLengthMeters,
        flowRateLPS: flowRateLPS,
        verticalRiseMeters: verticalRiseMeters,
        skuOf: (p) => p.sku,
        nameHeOf: (p) => p.nameHe,
        kOf: (p) => kft.kForType(p.productType),
        minBoreOf: (p) => _minBoreMeters(p.sku),
        widerSiblingOf: (p) => widerSiblingOf(p),
        frictionFactor: (re) => ff.frictionFactor(re, pow025: pw.pow025),
      );

  /// האח ה"רחב-הקטן-ביותר-שעדיין-עוזר" של [p] (אותו סוג/מותג/קטגוריה, קוטר גדול-יותר).
  PipeProduct? widerSiblingOf(PipeProduct p) => wso.widerSiblingOf<PipeProduct>(
        p,
        catalog: _catalog,
        skuOf: (x) => x.sku,
        productTypeOf: (x) => x.productType,
        brandOf: (x) => x.brand,
        categoryHeOf: (x) => x.categoryHe,
        minBoreOf: (x) => _minBoreMeters(x.sku),
      );

  /// האם [candidate] עדיין מתחבר לשני שכני [chain] של [idx] — לאימות החלפת-בקבוק.
  bool swapMatesWithNeighbours(
          List<PipeProduct> chain, int idx, PipeProduct candidate) =>
      swp.swapMatesWithNeighbours<PipeProduct>(
        chain,
        idx,
        candidate,
        skuOf: (x) => x.sku,
        specExists: _hasSpec,
        compatible: (a, b) => _verifiedCompat(a, b) ?? false,
      );

  // ═══ אשכול ג׳ · ערכה + תמחיר ════════════════════════════════════════════════

  /// ערכת-כלים/איטום מנוקה-כפילויות לכל הצמדים-הסמוכים בשרשרת [chain].
  List<rkf.KitItem> kitForChain(List<PipeProduct> chain) => rkf.recommendedKitFor(
        chain.map((p) => rkf.ChainProduct(p.sku)).toList(),
        verifiedSpecs: _kitSpecs,
      );

  /// ערכת-התקנה מומלצת למוצר-יחיד [p] (מותאמת ל-KitItem הקנוני · הכרעת-קופסה 4).
  List<rkf.KitItem> kitForProduct(PipeProduct p) => rkfp
          .recommendedKitForProduct(
        rkfp.KitProduct(
            sku: p.sku, brand: p.brand, dims: p.dims, categoryHe: p.categoryHe),
        verifiedSpecs: _kitSpecsP,
      )
          .map((i) => rkf.KitItem(
                kind: rkf.KitKind.values[i.kind.index],
                label: i.label,
                reason: i.reason,
                severity: rkf.Severity.values[i.severity.index],
              ))
          .toList();

  /// אומדן-מחיר מקורב (₪) לרשימת-מוצרים לפי-קטגוריה.
  ep.PriceEstimate priceEstimate(List<PipeProduct> items) =>
      ep.estimatePrice<PipeProduct>(items,
          categoryHe: (p) => p.categoryHe,
          priceTable: pd.kPipeCategoryPriceIls, // דאטה מוזרקת (dart-data/)
          fallbackIls: pd.kPipeFallbackIls);

  // ═══ אשכול ד׳ · תאימות ══════════════════════════════════════════════════════

  /// האם שני המוצרים יכולים להתחבר.
  bool canConnectPair(PipeProduct a, PipeProduct b) =>
      cc.canConnect(_connPart(a), _connPart(b), verifiedCompat: _verifiedCompat);

  /// הסבר-עברית מדוע שני המוצרים אינם יכולים להתחבר.
  String failReason(PipeProduct a, PipeProduct b) => cfr.connectionFailReason(
        cfr.InferPart(
            sku: a.sku,
            connectionSizes: a.connectionSizes,
            connectionGender: a.connectionGender,
            connectionMethod: a.connectionMethod),
        cfr.InferPart(
            sku: b.sku,
            connectionSizes: b.connectionSizes,
            connectionGender: b.connectionGender,
            connectionMethod: b.connectionMethod),
        verifiedOf: _cfrVerified,
        labels: cfl.kConnectionFailLabelsHe, // דאטה מוזרקת (dart-data/)
      );

  cfr.VerifiedView? _cfrVerified(String sku) {
    final mat = _material(sku);
    if (mat == null) return null;
    final e = _ends(sku) ?? const [];
    return cfr.VerifiedView(
      material: mat,
      ends: [for (final r in e) cfr.VerifiedEnd(r['type']!, r['size']!)],
    );
  }

  /// שם-שיטת-החיבור הפיזית בין שני מוצרים, או '' כשלא-ניתן-לגזור.
  String connectionLabel(PipeProduct a, PipeProduct b) =>
      cml.connectionMethodLabel<PipeProduct>(a, b, endsOf: (p) => _cmlEnds(p.sku));

  List<cml.ConnEnd>? _cmlEnds(String sku) {
    if (!_hasSpec(sku)) return null;
    final e = _ends(sku) ?? const [];
    return [
      for (final r in e)
        if (_knownEndTypes.contains(r['type']))
          cml.ConnEnd(cml.EndType.values.byName(r['type']!), r['size']!),
    ];
  }

  /// גודל-ה-DN של קטע-הצינור המשותף בין שני מוצרים, או null (חיבור-ישיר/אי-התאמה).
  String? pipeDn(PipeProduct a, PipeProduct b) =>
      pcd.pipeConnectionDn<PipeProduct>(a, b, endsOf: (p) => _pcdEnds(p.sku));

  List<pcd.ConnEnd>? _pcdEnds(String sku) {
    if (!_hasSpec(sku)) return null;
    final e = _ends(sku) ?? const [];
    return [
      for (final r in e)
        if (_knownEndTypes.contains(r['type']))
          pcd.ConnEnd(pcd.EndType.values.byName(r['type']!), r['size']!),
    ];
  }

  // ═══ אשכול ה׳ · פרדיקטים ════════════════════════════════════════════════════

  /// תפקיד המוצר בנתיב-זרימה: connector / fixture / accessory.
  fr.FlowRole flowRole(PipeProduct p) => fr.flowRole(p.sku, p.categoryHe);

  /// האם המוצר הוא צינור (נמכר לפי-מטר).
  bool isPipe(PipeProduct p) => ip.isPipe(p.categoryHe);

  /// האם המוצר הוא אביזר-מחבר (fitting).
  bool isFitting(PipeProduct p) => isf.isFitting(
      isf.FittingPart(p.categoryHe, productType: p.productType),
      companyCatalogActive: companyCatalogActive);

  /// קבוצת-מערכות-המים שהמוצר משתייך אליהן (אספקה/ניקוז).
  Set<ps.WaterSystem> productSystems(PipeProduct p) =>
      ps.productSystems(p.categoryHe, endSystemsOf: () => _psEndSystems(p.sku));

  Set<ps.WaterSystem>? _psEndSystems(String sku) =>
      _endSystems(sku)?.map((s) => ps.WaterSystem.values.byName(s)).toSet();

  /// האם חומר-המוצר יכול לשרת קו בטמפרטורה [tempC]. לא-ידוע ⇒ true.
  bool suitableForTemp(PipeProduct p, int tempC) =>
      pst.productSuitableForTemp<PipeProduct>(p, tempC,
          maxTempCOf: (x) => _maxTempC(x.sku));

  /// תווית-החומר של המוצר, או null כשאין spec מאומת.
  String? productMaterial(PipeProduct p) => pmat.productMaterial<PipeProduct, String>(
      p, specOf: (x) => _material(x.sku), materialOf: (m) => m);

  /// הטמפרטורה המרבית של חומר-המוצר, או null כשאין spec מאומת.
  double? productMaxTempC(PipeProduct p) => pmt.productMaxTempC<PipeProduct, double>(
      p, specOf: (x) => _maxTempC(x.sku), maxTempCOf: (t) => t);

  /// האם הקו נושא מים בלחץ (אספקה) — לפחות מוצר-אחד בעל קצה-אספקה.
  bool lineIsSupply(List<PipeProduct> items) => lis.lineIsSupply<PipeProduct>(
      items, endSystemsOf: (p) => _lisEndSystems(p.sku));

  Set<lis.WaterSystem>? _lisEndSystems(String sku) =>
      _endSystems(sku)?.map((s) => lis.WaterSystem.values.byName(s)).toSet();

  /// מספר-המוצאים הזהים של מחלק, או 0 כשאינו מחלק.
  int manifoldOutlets(PipeProduct p) => mo.manifoldOutlets<PipeProduct>(p,
      endSizesOf: (x) => _ends(x.sku)?.map((r) => r['size']!).toList());

  // ═══ אשכול ו׳ · צ׳קליסט ═════════════════════════════════════════════════════

  /// פריטי-הצ׳קליסט הפעילים לקו הזה — רכיבי-בטיחות/עמידות שקו-חם/אספקה מחייב.
  List<lcc.LineCheck> compliance(
    List<PipeProduct> chain,
    int tempC, {
    Set<String> accessories = const {},
  }) =>
      lcc.lineComplianceChecklist(
        chain
            .map((p) => lcc.ChainPart(p.sku, p.categoryHe,
                productType: p.productType, nameHe: p.nameHe))
            .toList(),
        tempC,
        accessories,
        materialOf: _material,
        isSupplySku: (sku) => _endSystems(sku)?.contains('supply') ?? false,
      );

  /// תזכורות-שטח מייעצות (שיפוע · נקודת-גישה).
  List<String> installReminders() => lir.lineInstallReminders();

  /// האם יש חצייה בין קבוצת-נחושת לקבוצת-ברזל (דורש רקורד-דיאלקטרי).
  bool galvanicallyDissimilar(Iterable<String> mats) =>
      gd.galvanicallyDissimilar(mats);

  /// האם המוצר הוא התקן חד-כיווני (שסתום אל-חזור).
  bool isDirectionalDevice(PipeProduct p) => idd.isDirectionalDevice(
      idd.DevicePart(categoryHe: p.categoryHe, nameHe: p.nameHe), term: (k)=>td_is_directional_device.kTerms[k]!);

  /// ניסוח-מיקום של התקן חד-כיווני באינדקס [i] לפי-שכניו ([names]=שמות-השרשרת).
  String directionalContext(List<String> names, int i) =>
      dc.directionalContext(names, i, term: (k)=>kTerms[k]!);

  // ═══ אשכול ז׳ · עוזרים ══════════════════════════════════════════════════════

  /// תווית-אזור-ענף עברית לאינדקס [i] ('ענף א׳', 'ענף ב׳', …).
  String branchLabel(int i) => bl.branchLabel(i, letters: _branchLetters);

  /// מוסיף יחידה של [p] ל-BOM: [items] (dedup לפי-sku) · [qty] (מונה) · [zones] (אזור→sku-ים).
  void bomAddItem<T>(
    T p, {
    String? zone,
    required String Function(T) skuOf,
    required List<T> items,
    required Map<String, int> qty,
    required Map<String, List<String>> zones,
  }) =>
      iai.installAddItem<T>(p,
          zone: zone, skuOf: skuOf, items: items, qty: qty, zones: zones);

  /// מכניס [item] תחת [key] ל-[out] רק בפעם-הראשונה (first-write-wins dedup).
  void kitAddItem<V>(Map<String, V> out, String key, V item) =>
      kai.kitAddItem<V>(out, key, item);

  /// מוצר-קטלוג לפי-sku (או null).
  PipeProduct? productBySku(String sku) => _bySku[sku];

  // ── מגני-סחף לטיפוס-האדפטר (הכרעת-קופסה 4) — נצרכים ע"י הפרוף ──
  int get kitKindCount => rkf.KitKind.values.length;
  int get kitKindCountProduct => rkfp.KitKind.values.length;
  int get severityCount => rkf.Severity.values.length;
  int get severityCountProduct => rkfp.Severity.values.length;
}
