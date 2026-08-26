// בדיקת-חוזה · lineComplianceChecklist — מייבאת אך ורק את האטום-שלה (חוק-4).
// DoD (דיבר-12): dart run --enable-asserts new/dart/line_compliance_checklist_test.dart ⇒ exit 0.
import 'line_compliance_checklist.dart';

// שקעי-הבדיקה: materialOf (מקור:61,242) ו-isSupplySku (=lineIsSupply, מקור:75-76,282).
String? _matOf(String sku) => _mats[sku];
bool _supOf(String sku) => _supply.contains(sku);

Map<String, String> _mats = {};
Set<String> _supply = {};

List<LineCheck> _run(List<ChainPart> chain, int tempC, Set<String> acc) =>
    lineComplianceChecklist(chain, tempC, acc,
        materialOf: _matOf, isSupplySku: _supOf);

// עזר: מוצא פריט לפי-תווית (או null).
LineCheck? _byLabel(List<LineCheck> l, String label) {
  for (final c in l) {
    if (c.label == label) return c;
  }
  return null;
}

// עזר: מוצא פריט לפי-קידומת-תווית (לבדיקות-כיוון עם שם דינמי).
LineCheck? _byPrefix(List<LineCheck> l, String prefix) {
  for (final c in l) {
    if (c.label.startsWith(prefix)) return c;
  }
  return null;
}

void _eqi(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void _has(List<LineCheck> l, String label, bool sat, CheckSeverity sev,
    String tag) {
  final c = _byLabel(l, label);
  if (c == null) throw StateError('FAIL [$tag]: missing "$label"');
  if (c.satisfied != sat) {
    throw StateError('FAIL [$tag]: "$label" satisfied=${c.satisfied} want=$sat');
  }
  if (c.severity != sev) {
    throw StateError('FAIL [$tag]: "$label" sev=${c.severity} want=$sev');
  }
}

void _absent(List<LineCheck> l, String label, String tag) {
  if (_byLabel(l, label) != null) {
    throw StateError('FAIL [$tag]: "$label" must be absent');
  }
}

void main() {
  var n = 0;

  // ── תרחיש 1: קו-אספקה קר עם ברז-ניתוק יחיד ─────────────────────────────
  _mats = {};
  _supply = {'HW-BALL-1'};
  var r = _run([const ChainPart('HW-BALL-1', 'ברזי מעבר')], 20, {});
  _eqi(r.length, 3, '1 cold supply: len=3'); n++;
  _has(r, 'ברז ניתוק לתחזוקה', true, CheckSeverity.critical, '1 isolation'); n++;
  _has(r, 'חבקים/תמיכת צנרת', false, CheckSeverity.info, '1 clip'); n++;
  _has(r, 'איטום מעברים (Press/PTFE/O-ring)', false, CheckSeverity.info, '1 seal'); n++;

  // ── תרחיש 2: קו-אספקה חם עם מחלק, בלי חלקי-בטיחות ──────────────────────
  _mats = {};
  _supply = {'HW-BALL-1'};
  r = _run([
    const ChainPart('HW-BALL-1', 'ברזי מעבר'),
    const ChainPart('HW-MANIFOLD-4', 'מחלקים', productType: 'מחלק'),
  ], 60, {});
  _eqi(r.length, 7, '2 hot supply+manifold: len=7'); n++;
  _has(r, 'ברז ניתוק לתחזוקה', true, CheckSeverity.critical, '2 isolation'); n++;
  _has(r, 'שסתום פורק לחץ (PRV)', false, CheckSeverity.critical, '2 prv'); n++;
  _has(r, 'כלי התפשטות (Bladder Tank)', false, CheckSeverity.critical, '2 btank'); n++;
  _has(r, 'ברז ערבוב נגד כוויה (TMTV)', false, CheckSeverity.critical, '2 tmtv'); n++;
  _has(r, 'בידוד תרמי', false, CheckSeverity.warning, '2 insul'); n++;

  // ── תרחיש 3: לולאת-סחרור (recirc) קרה, 3 ברזי-ניתוק ────────────────────
  _mats = {};
  _supply = {'HW-BALL-1'};
  r = _run([
    const ChainPart('HW-BALL-1', 'ברזי מעבר'),
    const ChainPart('HW-BALL-15', 'ברזי מעבר'),
    const ChainPart('HW-BALL-40', 'ברזי מעבר'),
    const ChainPart('HW-PUMP-25', 'מנגנונים'),
  ], 20, {});
  _eqi(r.length, 7, '3 recirc: len=7'); n++;
  _has(r, 'ברז ניתוק ×3 (כניסת דוד + אחרי משאבה + מניפולד)', true,
      CheckSeverity.critical, '3 iso×3'); n++;
  _has(r, 'שסתום אל-חזור', false, CheckSeverity.critical, '3 check'); n++;
  _has(r, 'מפוח אוויר', false, CheckSeverity.warning, '3 airvent'); n++;
  _has(r, 'נקודת דגימת מים (לגיונלה)', false, CheckSeverity.warning, '3 sample'); n++;

  // ── תרחיש 4: קו-ניקוז (לא-אספקה) — אין ברז-ניתוק ──────────────────────
  _mats = {};
  _supply = {};
  r = _run([const ChainPart('DRAIN-1', 'סיפונים')], 20, {});
  _eqi(r.length, 2, '4 drainage: only clip+seal'); n++;
  _absent(r, 'ברז ניתוק לתחזוקה', '4 no-isolation'); n++;

  // ── תרחיש 5: אביזרים מאושרים (acc) בקו-חם ──────────────────────────────
  _mats = {};
  _supply = {};
  r = _run([const ChainPart('DRAIN-1', 'סיפונים')], 60,
      {'HW-CLIP', 'HW-SEALANT', 'HW-INSUL'});
  _has(r, 'בידוד תרמי', true, CheckSeverity.warning, '5 insul-sat'); n++;
  _has(r, 'חבקים/תמיכת צנרת', true, CheckSeverity.info, '5 clip-sat'); n++;
  _has(r, 'איטום מעברים (Press/PTFE/O-ring)', true, CheckSeverity.info, '5 seal-sat'); n++;

  // ── תרחיש 6: נחושת+פליז = **אותה קבוצה גלוונית** ⇒ אין רקורד (תיקון-main) ─
  // ‏main:158-164 — נחושת/פליז שתיהן קבוצת-נחושת; ללא קבוצת-ברזל ⇒ dissimilar=false.
  _mats = {'CU': 'נחושת', 'BR': 'פליז'};
  _supply = {};
  r = _run([
    const ChainPart('CU', 'אביזרי נחושת'),
    const ChainPart('BR', 'ברזי מעבר'),
  ], 20, {});
  _absent(r, 'רקורד דיאלקטרי', '6 same-group ⇒ no dielectric'); n++;

  // ── תרחיש 6b: נחושת+פלדה = קבוצות-שונות ⇒ רקורד דיאלקטרי present ─────────
  _mats = {'CU': 'נחושת', 'ST': 'פלדה'};
  _supply = {};
  r = _run([
    const ChainPart('CU', 'אביזרי נחושת'),
    const ChainPart('ST', 'ברזי מעבר'),
  ], 20, {});
  _has(r, 'רקורד דיאלקטרי', false, CheckSeverity.critical, '6b dielectric-present'); n++;

  // ── תרחיש 7: PEX ⇒ מפצה-התפשטות ───────────────────────────────────────
  _mats = {'PX': 'PEX'};
  _supply = {};
  r = _run([const ChainPart('PX', 'מחברי NTM')], 20, {});
  _has(r, 'מפצה התפשטות PEX', false, CheckSeverity.warning, '7 pex-exp'); n++;

  // ── תרחיש 8: ברז-גן על קו-אספקה ⇒ שובר-ואקום (חדש ב-main:298-302) ──────
  _mats = {};
  _supply = {'HW-BALL-1'};
  r = _run([
    const ChainPart('HW-BALL-1', 'ברזי מעבר'),
    const ChainPart('GARDEN-1', 'ברזי גן'),
  ], 20, {});
  _has(r, 'שובר-ואקום למניעת זרימה-חוזרת', false, CheckSeverity.warning,
      '8 vacuum-breaker'); n++;
  // ברז-גן ללא-אספקה ⇒ אין שובר-ואקום (התנאי isSupply && hasGardenOutlet).
  _supply = {};
  r = _run([const ChainPart('GARDEN-1', 'ברזי גן')], 20, {});
  _absent(r, 'שובר-ואקום למניעת זרימה-חוזרת', '8b no-supply ⇒ no vacuum-breaker'); n++;

  // ── תרחיש 9: שסתום חד-כיווני (categoryHe='אל חזור') ⇒ בדיקת-כיוון (חדש :307-312) ─
  _mats = {};
  _supply = {'HW-BALL-1'};
  r = _run([
    const ChainPart('HW-BALL-1', 'ברזי מעבר', nameHe: 'ברז כדורי'),
    const ChainPart('CHK-1', 'אל חזור', nameHe: 'שסתום אלחזור 1"'),
    const ChainPart('HW-PUMP-40', 'מנגנונים', nameHe: 'משאבה'),
  ], 20, {});
  final dir = _byPrefix(r, 'כיוון התקנה:');
  if (dir == null) throw StateError('FAIL 9: missing directional check');
  if (dir.severity != CheckSeverity.warning) {
    throw StateError('FAIL 9: directional sev=${dir.severity}');
  }
  if (dir.label != 'כיוון התקנה: שסתום אלחזור 1"') {
    throw StateError('FAIL 9: label="${dir.label}"');
  }
  // ה-context ממקם בין השכנים (main:184).
  if (!dir.why.contains('בין "ברז כדורי" ל-"משאבה"')) {
    throw StateError('FAIL 9: why="${dir.why}"');
  }
  n++;

  // ── תרחיש 9b: זיהוי-כיוון לפי-שם (nameHe מכיל 'אל-חזור') גם ללא-קטגוריה ──
  _mats = {};
  _supply = {};
  r = _run([const ChainPart('X', 'אביזרי נחושת', nameHe: 'שסתום אל-חזור נחושת')],
      20, {});
  if (_byPrefix(r, 'כיוון התקנה:') == null) {
    throw StateError('FAIL 9b: name-based directional not detected');
  }
  n++;

  assert(_run([const ChainPart('DRAIN-1', 'סיפונים')], 20, {}).length == 2,
      'assert-live guard');
  print('OK lineComplianceChecklist: $n asserts passed');
}
