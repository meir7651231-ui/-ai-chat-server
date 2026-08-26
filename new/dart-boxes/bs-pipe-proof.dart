// 🧪 הוכחה · bs-pipe (בנייה-חכמה) — מנוע-הצנרת המלא דרך הקופסה, מקצה-לקצה.
// מזין specs+catalog פעם-אחת לבנאי, ומוכיח שכל שבעת האשכולות זורמים דרך הגישור-הקופסתי.
import 'bs-pipe.dart' as B;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

// ── קטלוג-הדגמה: מזהי-sku, קטגוריות-אמת, גדלי-חיבור ──
final List<Map<String, dynamic>> _catalog = [
  // מסלול רב-קפיצה: A(20)→B(20/25)→D(25)
  {'sku': 'A', 'categoryHe': 'מחברי NTM', 'nameHe': 'מחבר A', 'connectionSizes': ['20']},
  {'sku': 'B', 'categoryHe': 'מחברי HDPE', 'nameHe': 'מחבר B', 'connectionSizes': ['20', '25']},
  {'sku': 'D', 'categoryHe': 'ברזי מעבר', 'nameHe': 'ברז D', 'connectionSizes': ['25']},
  // מסלול-ישיר: P1(15)↔P2(15)
  {'sku': 'P1', 'categoryHe': 'מחברי HDPE', 'nameHe': 'צינור P1', 'connectionSizes': ['15']},
  {'sku': 'P2', 'categoryHe': 'מחברי HDPE', 'nameHe': 'צינור P2', 'connectionSizes': ['15']},
  // חלופות: A2(20/25,male)→{B2(20),C2(25)}→D2(20/25,male)
  {'sku': 'A2', 'categoryHe': 'ברזי מעבר', 'nameHe': 'ברז A2', 'connectionSizes': ['20', '25'], 'connectionGender': 'male'},
  {'sku': 'B2', 'categoryHe': 'מחברי HDPE', 'nameHe': 'מחבר B2', 'connectionSizes': ['20']},
  {'sku': 'C2', 'categoryHe': 'מחברי HDPE', 'nameHe': 'מחבר C2', 'connectionSizes': ['25']},
  {'sku': 'D2', 'categoryHe': 'ברזי מעבר', 'nameHe': 'ברז D2', 'connectionSizes': ['20', '25'], 'connectionGender': 'male'},
  // לחץ: NARROW(bore 10) ↔ WIDE(bore 20) — אותו סוג/מותג/קטגוריה
  {'sku': 'NARROW', 'categoryHe': 'צינורות PP', 'nameHe': 'צינור צר', 'brand': 'X', 'productType': 'צינור'},
  {'sku': 'WIDE', 'categoryHe': 'צינורות PP', 'nameHe': 'צינור רחב', 'brand': 'X', 'productType': 'צינור'},
];

// ── specs (⇔ kVerifiedSpecs) ──
final Map<String, dynamic> _specs = {
  'NARROW': {
    'material': 'HDPE', 'maxTempC': 60,
    'ends': [{'type': 'hdpeCompression', 'size': '10'}],
    'endSystems': ['supply'],
  },
  'WIDE': {
    'material': 'HDPE', 'maxTempC': 60,
    'ends': [{'type': 'hdpeCompression', 'size': '20'}],
    'endSystems': ['supply'],
  },
  // חיבור-תבריג לתווית + ערכה
  'K1': {'material': 'נחושת', 'ends': [{'type': 'bspMale', 'size': '1/2'}]},
  'K2': {'material': 'נחושת', 'ends': [{'type': 'bspFemale', 'size': '1/2'}]},
  // קטע-צינור משותף
  'PDA': {'material': 'HDPE', 'ends': [{'type': 'hdpeCompression', 'size': '32'}]},
  'PDB': {'material': 'HDPE', 'ends': [{'type': 'hdpeCompression', 'size': '32'}]},
  // מחלק 4-יציאות
  'MANIFOLD': {
    'material': 'פליז',
    'ends': [
      {'type': 'bspFemale', 'size': '1/2'},
      {'type': 'bspFemale', 'size': '1/2'},
      {'type': 'bspFemale', 'size': '1/2'},
      {'type': 'bspMale', 'size': '1'},
    ],
  },
  // swap: X,Z compat עם C
  'X': {'material': 'HDPE', 'ends': [{'type': 'hdpeCompression', 'size': '20'}], 'compat': ['C']},
  'Z': {'material': 'HDPE', 'ends': [{'type': 'hdpeCompression', 'size': '20'}], 'compat': ['C']},
  'C': {'material': 'HDPE', 'ends': [{'type': 'hdpeCompression', 'size': '20'}], 'compat': ['X', 'Z']},
  // קו-אספקה חם (compliance)
  'SUP-HOT': {'material': 'נחושת', 'ends': [{'type': 'copperPress', 'size': '20'}], 'endSystems': ['supply']},
  'DRAIN': {'material': 'PP', 'ends': [{'type': 'drainOpening', 'size': '40'}], 'endSystems': ['drainage']},
};

B.PipeProduct _p(String sku,
        {String cat = '',
        String name = '',
        String brand = '',
        String? type,
        List<String> sizes = const [],
        String? gender}) =>
    B.PipeProduct(
        sku: sku,
        categoryHe: cat,
        nameHe: name,
        brand: brand,
        productType: type,
        connectionSizes: sizes,
        connectionGender: gender);

void main() {
  final box = B.PipeBox(specs: _specs, catalog: _catalog);

  // ═══ אשכול א׳ · מסלול ═══
  final a = _p('A', cat: 'מחברי NTM', sizes: ['20']);
  final d = _p('D', cat: 'ברזי מעבר', sizes: ['25']);
  final path = box.planShortestPath(a, d);
  ok('planShortestPath מוצא מסלול A→B→D', path != null && path.length == 3);
  ok('planShortestPath — קפיצת-הביניים היא B',
      path != null && path.length == 3 && path[1].sku == 'B');
  ok('planShortestPath — הקצוות A,D',
      path != null && path.first.sku == 'A' && path.last.sku == 'D');

  final p1 = _p('P1', cat: 'מחברי HDPE', sizes: ['15']);
  final p2 = _p('P2', cat: 'מחברי HDPE', sizes: ['15']);
  final direct = box.planShortestPath(p1, p2);
  ok('planShortestPath חיבור-ישיר ⇒ [P1,P2]',
      direct != null && direct.length == 2 && direct.last.sku == 'P2');

  final a2 = _p('A2', cat: 'ברזי מעבר', sizes: ['20', '25'], gender: 'male');
  final d2 = _p('D2', cat: 'ברזי מעבר', sizes: ['20', '25'], gender: 'male');
  final alts = box.alternativePaths(a2, d2, k: 2);
  ok('alternativePaths מחזיר 2 מסלולים שונים', alts.length == 2);
  ok('alternativePaths — כל מסלול באורך 3',
      alts.every((p) => p.length == 3));
  ok('alternativePaths — הביניים שונה בין המסלולים',
      alts.length == 2 && alts[0][1].sku != alts[1][1].sku);

  // ═══ אשכול ב׳ · לחץ ═══
  final narrow = _p('NARROW', cat: 'צינורות PP', name: 'צינור צר', brand: 'X', type: 'צינור');
  final wide = _p('WIDE', cat: 'צינורות PP', name: 'צינור רחב', brand: 'X', type: 'צינור');
  final pd = box.pressureDrop([narrow], flowRateLPS: 0.3);
  ok('pressureDrop — הבקבוק הוא NARROW', pd.bottleneckSku == 'NARROW');
  ok('pressureDrop — minBoreMm ≈ 10', (pd.minBoreMm - 10).abs() < 1e-6);
  ok('pressureDrop — ΔP חיובי', pd.dropBar > 0);
  ok('pressureDrop — הצעת-החלפה לצוואר-בקבוק',
      pd.suggestions.any((s) => s.actionKind == B.SuggestionKind.swap));

  // K-sum מדויק: ברך(0.9)+מצמד(0.1)=1.0 (ללא spec ⇒ bore-fallback)
  final elbow = _p('E1', cat: 'ברכיים', type: 'ברך');
  final coupler = _p('E2', cat: 'מצמדים וצינורות', type: 'מצמד');
  final pdK = box.pressureDrop([elbow, coupler]);
  ok('pressureDrop — ΣK = 0.9+0.1 = 1.0', (pdK.totalK - 1.0).abs() < 1e-9);

  ok('widerSiblingOf(NARROW) = WIDE', box.widerSiblingOf(narrow)?.sku == 'WIDE');
  ok('widerSiblingOf(WIDE) = null (אין רחב-יותר)', box.widerSiblingOf(wide) == null);

  // swap: candidate C מתחבר לשכני [X,Y,Z]
  final cx = _p('X'), cy = _p('Y'), cz = _p('Z'), cand = _p('C');
  ok('swapMatesWithNeighbours — C מתחבר ל-X,Z',
      box.swapMatesWithNeighbours([cx, cy, cz], 1, cand));
  ok('swapMatesWithNeighbours — מועמד ללא-spec ⇒ false',
      !box.swapMatesWithNeighbours([cx, cy, cz], 1, _p('NOSPEC')));

  // ═══ אשכול ג׳ · ערכה + תמחיר ═══
  final k1 = _p('K1', cat: 'אביזרי תבריג', name: 'ניפל');
  final k2 = _p('K2', cat: 'אביזרי תבריג', name: 'מופה');
  final kit = box.kitForChain([k1, k2]);
  ok('kitForChain — חיבור-תבריג ⇒ סרט-טפלון',
      kit.any((i) => i.label.contains('טפלון')));
  ok('kitForChain — מפתח שוודי לחיבור',
      kit.any((i) => i.label.contains('מפתח שוודי')));

  final ppr = _p('PPR-1', cat: 'צינורות PP', brand: 'פולירול');
  final kitP = box.kitForProduct(ppr);
  ok('kitForProduct(פולירול) ⇒ 6 פריטי-ריתוך-PPR', kitP.length == 6);
  ok('kitForProduct — הפריט הראשון מצמד-PPR',
      kitP.isNotEmpty && kitP.first.label.contains('מצמד PPR'));
  ok('kitForProduct — KitItem קנוני (severityHe נגיש)',
      kitP.every((i) => i.severityHe.isNotEmpty));

  final price = box.priceEstimate([
    _p('F', cat: 'ברזי כיור'),
    _p('T', cat: 'אביזרי תבריג'),
  ]);
  ok('priceEstimate — 280+15 = 295 ₪', price.totalILS == 295);
  ok('priceEstimate — 2 פריטים · ביטחון-גבוה',
      price.itemCount == 2 && !price.lowConfidence);

  // ═══ אשכול ד׳ · תאימות ═══
  ok('canConnectPair(A,B) ⇒ true',
      box.canConnectPair(_p('A', sizes: ['20']), _p('B', sizes: ['20', '25'])));
  ok('canConnectPair(A,D) ⇒ false (גודל שונה)',
      !box.canConnectPair(_p('A', sizes: ['20']), _p('D', sizes: ['25'])));
  ok('failReason(A,D) ⇒ "גודל שונה"',
      box.failReason(_p('A', sizes: ['20']), _p('D', sizes: ['25'])).contains('גודל שונה'));

  ok('connectionLabel(K1,K2) ⇒ "תבריג + PTFE"',
      box.connectionLabel(_p('K1'), _p('K2')) == 'תבריג + PTFE');
  ok('pipeDn(PDA,PDB) ⇒ "32"',
      box.pipeDn(_p('PDA'), _p('PDB')) == '32');

  // ═══ אשכול ה׳ · פרדיקטים ═══
  ok('flowRole(צינורות PP) = connector',
      box.flowRole(_p('x', cat: 'צינורות PP')) == B.FlowRole.connector);
  ok('flowRole(אסלות וכיורים) = fixture',
      box.flowRole(_p('x', cat: 'אסלות וכיורים')) == B.FlowRole.fixture);
  ok('flowRole(HW-INSUL) = accessory',
      box.flowRole(_p('HW-INSUL', cat: 'צינורות PP')) == B.FlowRole.accessory);
  ok('isPipe(צינורות PP) ⇒ true', box.isPipe(_p('x', cat: 'צינורות PP')));
  ok('isPipe(ברזי מעבר) ⇒ false', !box.isPipe(_p('x', cat: 'ברזי מעבר')));
  ok('isFitting(מחברי HDPE) ⇒ true', box.isFitting(_p('x', cat: 'מחברי HDPE')));
  ok('isFitting(ברזי כיור) ⇒ false', !box.isFitting(_p('x', cat: 'ברזי כיור')));
  ok('productSystems(מחברי HDPE) = {supply}',
      box.productSystems(_p('x', cat: 'מחברי HDPE')).contains(B.WaterSystem.supply));
  ok('productSystems(צינורות PP) = {drainage}',
      box.productSystems(_p('x', cat: 'צינורות PP')).contains(B.WaterSystem.drainage));
  ok('suitableForTemp(NARROW@40) ⇒ true', box.suitableForTemp(narrow, 40));
  ok('suitableForTemp(NARROW@80) ⇒ false (max 60)', !box.suitableForTemp(narrow, 80));
  ok('suitableForTemp(ללא-spec) ⇒ true', box.suitableForTemp(_p('NOSPEC'), 200));
  ok('productMaterial(NARROW) = HDPE', box.productMaterial(narrow) == 'HDPE');
  ok('productMaterial(ללא-spec) = null', box.productMaterial(_p('NOSPEC')) == null);
  ok('productMaxTempC(NARROW) = 60', box.productMaxTempC(narrow) == 60.0);
  ok('lineIsSupply([SUP-HOT]) ⇒ true', box.lineIsSupply([_p('SUP-HOT')]));
  ok('lineIsSupply([DRAIN]) ⇒ false', !box.lineIsSupply([_p('DRAIN')]));
  ok('manifoldOutlets(MANIFOLD) = 3', box.manifoldOutlets(_p('MANIFOLD')) == 3);
  ok('manifoldOutlets(NARROW) = 0 (‏<3 קצוות)', box.manifoldOutlets(narrow) == 0);

  // ═══ אשכול ו׳ · צ׳קליסט ═══
  final checks = box.compliance([_p('SUP-HOT', cat: 'מחברי NTM')], 70);
  ok('compliance — קו-אספקה-חם מפיק בדיקות', checks.isNotEmpty);
  ok('compliance — דורש שסתום-פורק-לחץ (PRV)',
      checks.any((c) => c.label.contains('PRV') && !c.satisfied));
  ok('installReminders ⇒ 2 תזכורות',
      box.installReminders().length == 2 &&
          box.installReminders().contains('שיפוע לקטע אופקי ארוך'));
  ok('galvanicallyDissimilar([נחושת,פלדה]) ⇒ true',
      box.galvanicallyDissimilar(['נחושת', 'פלדה']));
  ok('galvanicallyDissimilar([נחושת,פליז]) ⇒ false (אותה-קבוצה)',
      !box.galvanicallyDissimilar(['נחושת', 'פליז']));
  ok('isDirectionalDevice(קטגוריה "אל חזור") ⇒ true',
      box.isDirectionalDevice(_p('x', cat: 'אל חזור')));
  ok('isDirectionalDevice(שם "שסתום אל-חזור") ⇒ true',
      box.isDirectionalDevice(_p('x', name: 'שסתום אל-חזור')));
  ok('isDirectionalDevice(רגיל) ⇒ false',
      !box.isDirectionalDevice(_p('x', cat: 'מחברי HDPE', name: 'מחבר')));
  ok('directionalContext(["a","b","c"],1) ⇒ בין',
      box.directionalContext(['a', 'b', 'c'], 1) == 'בין "a" ל-"c"');

  // ═══ אשכול ז׳ · עוזרים ═══
  ok('branchLabel(0) = "ענף א"', box.branchLabel(0) == 'ענף א');
  ok('branchLabel(10) = "ענף 11" (מעבר-אלפבית)', box.branchLabel(10) == 'ענף 11');

  final items = <B.PipeProduct>[];
  final qty = <String, int>{};
  final zones = <String, List<String>>{};
  box.bomAddItem(_p('W'), zone: 'ענף א', skuOf: (p) => p.sku, items: items, qty: qty, zones: zones);
  box.bomAddItem(_p('W'), zone: 'ענף א', skuOf: (p) => p.sku, items: items, qty: qty, zones: zones);
  ok('bomAddItem — dedup פריט (item 1) + מונה (qty 2)',
      items.length == 1 && qty['W'] == 2 && zones['ענף א']!.length == 1);

  final out = <String, String>{};
  box.kitAddItem(out, 'k', 'first');
  box.kitAddItem(out, 'k', 'second');
  ok('kitAddItem — first-write-wins', out['k'] == 'first');

  ok('productBySku(NARROW) מהקטלוג', box.productBySku('NARROW')?.nameHe == 'צינור צר');

  // ── מגן-סחף (הכרעת-קופסה 4): שוויון-אורך enums של KitItem ──
  ok('drift — KitKind אורך זהה בין שני-האטומים',
      box.kitKindCount == box.kitKindCountProduct);
  ok('drift — Severity אורך זהה בין שני-האטומים',
      box.severityCount == box.severityCountProduct);

  if (fails > 0) {
    print('❌ bs-pipe: $fails אי-התאמות');
    throw StateError('bs-pipe proof failed');
  }
  print('✓ קופסת-bs-pipe (בנייה-חכמה): $n טענות — '
      'מסלול · לחץ · ערכה · תמחיר · תאימות · צ׳קליסט · עוזרים');
}
