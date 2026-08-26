// 🏅 רתמת-זהב · bs-projects — מריצה את ה-API-הפומבי של הקופסה על הקלטים/golden
// מבדיקות-האטומים (new/dart/*_test.dart), ומוודאת ספירת-טענות + StateError על אי-התאמה.
// הרצה: <dart> run --enable-asserts new/dart-boxes/bs-projects-proof.dart
import 'bs-projects.dart';

int _n = 0;

void _eqI(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
  _n++;
}

void _eqS(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
  _n++;
}

void _eqB(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
  _n++;
}

void _true(bool c, String label) {
  if (!c) throw StateError('FAIL [$label]');
  _n++;
}

void _eqD(double? got, double? want, String label) {
  final ok = (got == null && want == null) ||
      (got != null && want != null && (got - want).abs() < 1e-12);
  if (!ok) throw StateError('FAIL [$label]: got=$got want=$want');
  _n++;
}

void _eqKind(CriticalKind? got, CriticalKind? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
  _n++;
}

void _eqMatch(SizeMatch got, SizeMatch want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
  _n++;
}

void main() {
  // ════ A · חשבונית ומע"מ ════
  // invoiceTitle (מ-invoice_title_test) ──
  _eqS(invoiceTitle('ORD-1', receipt: true), 'קבלה — ORD-1', 'A/it 1 receipt');
  _eqS(invoiceTitle('ORD-1', receipt: false), 'חשבונית — ORD-1', 'A/it 2 invoice');
  _eqS(invoiceTitle('42', receipt: true), 'קבלה — 42', 'A/it 3');
  _eqS(invoiceTitle('', receipt: false), 'חשבונית — ', 'A/it 4 empty id');

  // invoiceVatOf (מ-invoice_vat_of_test; שיעור-הקופסה 0.18 ⇒ מריצים רק goldens של 0.18) ──
  _eqI(invoiceVatOf(118), 18, 'A/vat 1');
  _eqI(invoiceVatOf(1180), 180, 'A/vat 2');
  _eqI(invoiceVatOf(59), 9, 'A/vat 3');
  _eqI(invoiceVatOf(100), 15, 'A/vat 4 round-up');
  _eqI(invoiceVatOf(0), 0, 'A/vat 6 zero');
  _eqI(invoiceVatOf(1), 0, 'A/vat 7 tiny');

  // ════ B · אשראי-קבלן ודירוג ════
  // contractorCredit (מ-contractor_credit_test; SDK 3.5.4 goldens) ──
  _eqI(contractorCredit(''), 30000, 'B/cc 1 empty');
  _eqI(contractorCredit('a'), 32800, 'B/cc 2 a');
  _eqI(contractorCredit('אבי'), 119600, 'B/cc 3 avi');
  _eqI(contractorCredit('דוד לוי'), 33900, 'B/cc 4 david-levi');
  // אינווריאנטות-מקור: טווח + עיגול-100 + אידמפוטנטיות ──
  for (final s in ['', 'a', 'אבי', 'דוד לוי', 'קבלן ראשי בע"מ', 'zzzz', '12345']) {
    final v = contractorCredit(s);
    _true(v >= 30000 && v <= 120000, 'B/cc range "$s"');
    _true(v % 100 == 0, 'B/cc round100 "$s"');
    _eqI(contractorCredit(s), v, 'B/cc idempotent "$s"');
  }

  // band (מ-band_test) ──
  _eqI(band(100, 90, 50), 2, 'B/band 1 above high');
  _eqI(band(90, 90, 50), 2, 'B/band 2 == high');
  _eqI(band(89, 90, 50), 1, 'B/band 3 just below high');
  _eqI(band(50, 90, 50), 1, 'B/band 4 == mid');
  _eqI(band(49, 90, 50), 0, 'B/band 5 below mid');
  _eqI(band(5, 5, 5), 2, 'B/band 7 high==mid hit');
  _eqI(band(-1, 0, -5), 1, 'B/band 9 negative mid');

  // contractorCreditTier (חיווט-אח: contractorCredit → band, ספי-הקופסה 90000/60000) ──
  // '' ⇒ 30000 < 60000 ⇒ רמה 0 · 'אבי' ⇒ 119600 ≥ 90000 ⇒ רמה 2.
  _eqI(contractorCreditTier(''), 0, 'B/tier empty ⇒ 0');
  _eqI(contractorCreditTier('אבי'), 2, 'B/tier avi ⇒ 2');
  for (final s in ['', 'a', 'אבי', 'דוד לוי', 'zzzz', '12345']) {
    final t = contractorCreditTier(s);
    _true(t == 0 || t == 1 || t == 2, 'B/tier range "$s" -> $t');
    final c = contractorCredit(s);
    final want = c >= 90000 ? 2 : (c >= 60000 ? 1 : 0);
    _eqI(t, want, 'B/tier consistent-with-band "$s"');
  }

  // ════ C · הנדסת-תאימות ════
  // boreMeters (מ-bore_meters_test; טבלת-BSP הקנונית של הקופסה) ──
  _eqD(boreMeters(const ConnectorEnd(EndType.hdpeCompression, '32')), 0.032, 'C/bm 1 hdpe 32');
  _eqD(boreMeters(const ConnectorEnd(EndType.drainOpening, '50')), 0.050, 'C/bm 2 drain 50');
  _eqD(boreMeters(const ConnectorEnd(EndType.pexPress, '16')), 0.016, 'C/bm 3 pex 16');
  _eqD(boreMeters(const ConnectorEnd(EndType.copperPress, '22')), 0.022, 'C/bm 4 copper 22');
  _eqD(boreMeters(const ConnectorEnd(EndType.bspMale, '1/2"')), 0.015, 'C/bm 5 bsp 1/2');
  _eqD(boreMeters(const ConnectorEnd(EndType.bspFemale, '3/4"')), 0.020, 'C/bm 6 bsp 3/4');
  _eqD(boreMeters(const ConnectorEnd(EndType.bspMale, '1')), 0.025, 'C/bm 7 bsp 1 no-quote');
  _eqD(boreMeters(const ConnectorEnd(EndType.bspMale, '2-1/2"')), 0.065, 'C/bm 8 bsp 2-1/2');
  _eqD(boreMeters(const ConnectorEnd(EndType.bspFemale, '2')), 0.050, 'C/bm 12 bsp 2');
  _eqD(boreMeters(const ConnectorEnd(EndType.bspMale, ' 1/2" ')), 0.015, 'C/bm trim+quote');
  _eqD(boreMeters(const ConnectorEnd(EndType.hdpeCompression, '0')), 0.0, 'C/bm 9 dn zero');
  _eqD(boreMeters(const ConnectorEnd(EndType.hdpeCompression, '1/2')), null, 'C/bm 10 dn non-int');
  _eqD(boreMeters(const ConnectorEnd(EndType.bspMale, '5/8"')), null, 'C/bm 11 not-in-map');
  _eqD(boreMeters(const ConnectorEnd(EndType.hdpeCompression, '-5')), -0.005, 'C/bm dn negative');

  // compliance (מ-compliance_test; מסירת-דרך אל השקע) ──
  final r1 = ['ok'];
  final out1 = compliance<String, String>(60,
      items: ['a', 'b'], checklist: (items, tempC, acc) => r1);
  _true(identical(out1, r1), 'C/cmp 1 return identical');
  var seenItems = <String>[];
  var seenTemp = -1;
  Set<String> seenAcc = {};
  compliance<String, String>(60, items: ['a', 'b'], checklist: (items, tempC, acc) {
    seenItems = items;
    seenTemp = tempC;
    seenAcc = acc;
    return ['x'];
  });
  _true(seenItems.length == 2 && seenItems[0] == 'a' && seenItems[1] == 'b', 'C/cmp items verbatim');
  _eqI(seenTemp, 60, 'C/cmp tempC passed');
  _true(seenAcc.isEmpty, 'C/cmp default accessories {}');
  compliance<String, String>(60,
      items: ['a'], checklist: (i, t, a) {
    seenAcc = a;
    return ['x'];
  }, accessories: {'HW-INSUL'});
  _true(seenAcc.length == 1 && seenAcc.contains('HW-INSUL'), 'C/cmp explicit accessories');
  final out5 = compliance<int, int>(75, items: [1], checklist: (i, t, a) => [10, 20, 30]);
  _true(out5.length == 3 && out5[0] == 10 && out5[2] == 30, 'C/cmp result unfiltered');

  // criticalOpen (מ-critical_open_test; שקע-ה-compliance מחווט לאטום-האח) ──
  // ה-checklist מפיק רשומות ({satisfied,critical}); הקופסה מזרימה דרך compliance⇒criticalOpen.
  int co(List<ComplianceRow> rows,
      {int temp = 60, Set<String> acc = const {}}) =>
      criticalOpen<int>(temp,
          items: const [0], accessories: acc, checklist: (i, t, a) => rows);
  _eqI(co(const [
    (satisfied: false, critical: true),
    (satisfied: true, critical: true),
    (satisfied: false, critical: false),
  ]), 1, 'C/co 1 one-open');
  _eqI(co(const []), 0, 'C/co 2 empty');
  _eqI(co(const [
    (satisfied: true, critical: true),
    (satisfied: true, critical: true),
  ]), 0, 'C/co 3 all-satisfied');
  _eqI(co(const [
    (satisfied: false, critical: true),
    (satisfied: false, critical: true),
    (satisfied: false, critical: false),
  ]), 2, 'C/co 4 two-open');
  _eqI(co(const [
    (satisfied: false, critical: false),
    (satisfied: false, critical: false),
  ]), 0, 'C/co 5 none-critical');
  // מעבר-שקע: tempC/accessories מגיעים דרך compliance⇒checklist ──
  final okco = criticalOpen<int>(85, items: const [0], accessories: {'insulation'},
      checklist: (i, t, a) {
    if (t != 85 || !a.contains('insulation')) throw StateError('slot args wrong');
    return const [(satisfied: false, critical: true)];
  });
  _eqI(okco, 1, 'C/co 6 slot-passthrough');

  // criticalBusinessKind (מ-critical_business_kind_test) ──
  _eqKind(criticalBusinessKind(id: 'confirmOrderBtn', labelHe: 'כפתור'),
      CriticalKind.confirmOrder, 'C/cbk 1 id-confirmorder');
  _eqKind(criticalBusinessKind(id: 'x', labelHe: 'אשר הזמנה'),
      CriticalKind.confirmOrder, 'C/cbk 2 label-confirm');
  _eqKind(criticalBusinessKind(id: 'approveOrder', labelHe: ''),
      CriticalKind.confirmOrder, 'C/cbk 3 approveorder');
  _eqKind(criticalBusinessKind(id: 'priceField', labelHe: ''),
      CriticalKind.price, 'C/cbk 4 id-price');
  _eqKind(criticalBusinessKind(id: 'x', labelHe: 'מחיר מוצר'),
      CriticalKind.price, 'C/cbk 5 label-price');
  _eqKind(criticalBusinessKind(id: 'navbar', labelHe: 'ניווט'), null, 'C/cbk 6 none');
  _eqKind(criticalBusinessKind(id: 'priceConfirmOrder', labelHe: ''),
      CriticalKind.confirmOrder, 'C/cbk 7 precedence');
  _eqKind(criticalBusinessKind(id: 'PRICE', labelHe: ''),
      CriticalKind.price, 'C/cbk 8 lowercase');

  // ════ D · סכמת-חיבורים ════
  // sizeMatchFrom (מ-size_match_from_test) ──
  _eqMatch(sizeMatchFrom('exactSame'), SizeMatch.exactSame, 'D/smf 1');
  _eqMatch(sizeMatchFrom('anyToAny'), SizeMatch.anyToAny, 'D/smf 2');
  _eqMatch(sizeMatchFrom('tableLookup'), SizeMatch.tableLookup, 'D/smf 3');
  _eqMatch(sizeMatchFrom(null), SizeMatch.exactSame, 'D/smf 4 null');
  _eqMatch(sizeMatchFrom(''), SizeMatch.exactSame, 'D/smf 5 empty');
  _eqMatch(sizeMatchFrom('ExactSame'), SizeMatch.exactSame, 'D/smf 6 wrong-case');
  _eqMatch(sizeMatchFrom('tableLookup '), SizeMatch.exactSame, 'D/smf 8 trailing-space');
  _eqMatch(sizeMatchFrom('foo'), SizeMatch.exactSame, 'D/smf 9 unknown');
  _eqMatch(sizeMatchFrom(5), SizeMatch.exactSame, 'D/smf 10 int');
  _eqMatch(sizeMatchFrom(true), SizeMatch.exactSame, 'D/smf 11 bool');

  // sizeTableEq (מ-size_table_eq_test) ──
  _eqB(sizeTableEq(null, null), true, 'D/ste 1 null==null');
  _eqB(sizeTableEq(null, [["1"]]), false, 'D/ste 2 null vs data');
  _eqB(sizeTableEq([["1"]], null), false, 'D/ste 3 data vs null');
  _eqB(sizeTableEq([], []), true, 'D/ste 4 empty==empty');
  _eqB(sizeTableEq([["1"]], []), false, 'D/ste 5 len 1 vs 0');
  _eqB(sizeTableEq([["a", "b"], ["c"]], [["a", "b"], ["c"]]), true, 'D/ste 6 equal');
  _eqB(sizeTableEq([["a"]], [["b"]]), false, 'D/ste 7 row differs');
  _eqB(sizeTableEq([["a", "b"]], [["a"]]), false, 'D/ste 8 row-len differs');
  _eqB(sizeTableEq([[]], [[]]), true, 'D/ste e1 empty-rows');
  _eqB(sizeTableEq([["a", "b"]], [["b", "a"]]), false, 'D/ste e2 order matters');
  _eqB(sizeTableEq([["a"]], [["b"]], rowEq: (x, y) => true), true, 'D/ste s1 injected rowEq');

  // sizeTableHash (מ-size_table_hash_test; יחסים — seed פר-איזולט) ──
  _eqI(sizeTableHash(null), 0, 'D/sth 1 null ⇒ 0');
  _true(sizeTableHash(const [['1/2', '3/4']]) == sizeTableHash(const [['1/2', '3/4']]),
      'D/sth 2 determinism');
  _true(sizeTableHash(const [['1/2', '3/4']]) != sizeTableHash(const [['3/4', '1/2']]),
      'D/sth 4 inner-order');
  _true(sizeTableHash(const [['1/2', '3/4']]) != sizeTableHash(const [['1/2'], ['3/4']]),
      'D/sth 5 row-structure');
  _true(sizeTableHash(const []) == sizeTableHash(const []), 'D/sth 6 empty stable');

  // ── שער-חי (assert) ──
  assert(invoiceVatOf(118) == 18, 'assert-live guard');
  assert(contractorCreditTier('') == 0, 'assert-live guard');
  assert(sizeMatchFrom('anyToAny') == SizeMatch.anyToAny, 'assert-live guard');

  print('OK bs-projects: $_n asserts passed (11 atoms wired)');
}
