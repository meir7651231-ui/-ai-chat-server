import '../dart-data/estimate_pressure_drop-terms.dart' as td_estimate_pressure_drop;
// בדיקת-אטום · estimatePressureDrop — מוכיחה בדיוק את estimate_pressure_drop.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/estimate_pressure_drop_test.dart ⇒ exit 0.
// מייבאת אך-ורק את האטום-שלה (חוק-4). השקעים מחווטים מקומית — פונקציית-החיכוך מגלמת
// verbatim את _frictionFactor+_pow025+_sqrt (Newton, 5 איטרציות) מהמקור, כדי שהמספרים יתלכדו.
import 'estimate_pressure_drop.dart';

// ── שקע frictionFactor: verbatim מ-pressure_drop.dart:317-339 ────────────────
double _sqrt(double x) {
  var r = x / 2;
  for (var i = 0; i < 5; i++) {
    r = 0.5 * (r + x / r);
  }
  return r;
}

double _pow025(double x) {
  final s = x > 0 ? x : 1e-9;
  return _sqrt(_sqrt(s));
}

double _frictionFactor(double reynolds) {
  if (reynolds < 100) return 0.64;
  if (reynolds < 2300) return 64.0 / reynolds;
  return 0.316 / _pow025(reynolds);
}

// ── מחזיק-קלט טהור לבדיקה: sku · nameHe · k · bore(m) ────────────────────────
class _P {
  final String sku;
  final String name;
  final double k;
  final double? bore; // מטרים; null = אין קוטר-ניתן-לפענוח
  const _P(this.sku, this.name, this.k, this.bore);
}

// אח-רחב קבוע שהשקע widerSiblingOf מחזיר (לכל בקבוק) — כדי שמחרוזת-הפתרון ידועה.
const _wider = _P('W', 'ברך רחבה', 0.1, 0.032);

PressureDropResult<_P> _run(
  List<_P> chain, {
  double flow = 0.3,
  double rise = 0.0,
  double len = 5.0,
}) {
  return estimatePressureDrop<_P>(
    chain,
    flowRateLPS: flow,
    verticalRiseMeters: rise,
    pipeLengthMeters: len,
    skuOf: (p) => p.sku,
    nameHeOf: (p) => p.name,
    kOf: (p) => p.k,
    minBoreOf: (p) => p.bore,
    widerSiblingOf: (p) => _wider,
    frictionFactor: _frictionFactor,
   term: (k)=>td_estimate_pressure_drop.kTerms[k]!);
}

void _near(double got, double want, String label) {
  if ((got - want).abs() >= 1e-9) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void _eq(Object? got, Object? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  // ── S1 — קו-תקין: chain 2 מוצרים בקו, K=0.95, בקבוק 20mm, זרימה 0.3 ──────
  final s1 = _run(const [
    _P('A', 'ברך', 0.9, 0.020),
    _P('B', 'ברז', 0.05, 0.025),
  ]);
  _near(s1.totalK, 0.95, 'S1.totalK');
  n++;
  _near(s1.minBoreMm, 20.0, 'S1.minBoreMm');
  n++;
  _near(s1.dropBar, 0.024454720795368902, 'S1.dropBar');
  n++;
  _eq(s1.bottleneckSku, 'A', 'S1.bottleneckSku');
  n++;
  _eq(s1.suggestions.length, 1, 'S1.len');
  n++;
  _eq(s1.suggestions[0].actionKind, SuggestionKind.ok, 'S1.ok');
  n++;
  _eq(s1.warnings.isEmpty, true, 'S1.warnings-empty');
  n++;
  _eq(s1.exceedsBudget, false, 'S1.exceedsBudget');
  n++;

  // ── S2 — צוואר-בקבוק 10mm ⇒ הצעת-החלפה יחידה (dropBar 0.53 < 1) ──────────
  final s2 = _run(const [
    _P('A', 'ברך צרה', 0.9, 0.010),
    _P('B', 'מצמד', 0.1, 0.032),
  ]);
  _near(s2.totalK, 1.0, 'S2.totalK');
  n++;
  _near(s2.minBoreMm, 10.0, 'S2.minBoreMm');
  n++;
  _near(s2.dropBar, 0.5313159905807183, 'S2.dropBar');
  n++;
  _eq(s2.suggestions.length, 1, 'S2.len');
  n++;
  _eq(s2.suggestions[0].actionKind, SuggestionKind.swap, 'S2.swap');
  n++;
  _eq(s2.suggestions[0].problem,
      'צוואר-בקבוק — קוטר 10mm צר מדי לזרימה 0.3 L/s', 'S2.problem');
  n++;
  _eq(s2.suggestions[0].solution, 'החלף את "ברך צרה" ב-"ברך רחבה"',
      'S2.solution');
  n++;
  _eq(s2.suggestions[0].replaceProduct?.sku, 'A', 'S2.replace');
  n++;

  // ── S3 — SKU חוצה-קו (HW-SAMPLE) מודר: לא נספר ב-K ולא הופך לבקבוק ───────
  final s3 = _run(const [
    _P('HW-SAMPLE', 'ברז דגימה', 0.9, 0.004), // 4mm — צר-קיצוני, חוצה-קו
    _P('B', 'מצמד', 0.1, 0.020),
  ]);
  _near(s3.totalK, 0.1, 'S3.totalK-excludes-offline'); // רק B
  n++;
  _near(s3.minBoreMm, 20.0, 'S3.minBore-not-4mm'); // ה-4mm לא בקבוק
  n++;
  _eq(s3.bottleneckSku, 'B', 'S3.bottleneck-B');
  n++;
  _near(s3.dropBar, 0.020579185512192594, 'S3.dropBar');
  n++;
  _eq(s3.suggestions[0].actionKind, SuggestionKind.ok, 'S3.ok');
  n++;

  // ── S4 — עלייה אנכית 12מ׳: static דוחף dropBar>1 ⇒ תקציב + עלייה ────────
  final s4 = _run(const [_P('A', 'ברך', 0.9, 0.020)], rise: 12.0);
  _near(s4.dropBar, 1.2014267481316527, 'S4.dropBar');
  n++;
  _eq(s4.exceedsBudget, true, 'S4.exceedsBudget');
  n++;
  _eq(s4.suggestions.length, 2, 'S4.len');
  n++;
  _eq(s4.suggestions[0].actionKind, SuggestionKind.add, 'S4.budget-add');
  n++;
  _eq(s4.suggestions[0].addProductSku, 'HW-PUMP-40', 'S4.pump');
  n++;
  _eq(s4.suggestions[1].problem,
      'עלייה אנכית 12 מ׳ — 1.2 בר אובדים על הגובה', 'S4.tall-problem');
  n++;
  _eq(s4.suggestions[1].addProductSku, 'HW-PUMP-40', 'S4.tall-pump');
  n++;

  // ── S5 — זרימה לאמינרית (Re<2300, בקבוק 160mm, זרימה 0.2) ⇒ הצעת-הקטנה ──
  final s5 = _run(const [_P('A', 'ברך רחבה מאוד', 0.9, 0.160)], flow: 0.2);
  _near(s5.minBoreMm, 160.0, 'S5.minBoreMm');
  n++;
  _eq(s5.suggestions.length, 1, 'S5.len');
  n++;
  _eq(s5.suggestions[0].actionKind, SuggestionKind.swap, 'S5.swap');
  n++;
  _eq(
      s5.suggestions[0].problem,
      'זרימה לאמינרית (Re=1592) — הקוטר גדול מהנדרש, מבזבז חומר',
      'S5.laminar-problem');
  n++;
  _eq(s5.suggestions[0].replaceProduct?.sku, 'A', 'S5.replace');
  n++;

  // ── toString ביט-זהה למקור: תווית-הבקבוק דרך skuOf ──────────────────────
  _eq(
      s1.toString(),
      'ΔP = 0.02 bar  (K=0.95, L=5.0m, minBore=20.0mm, bottleneck=A)',
      'S1.toString');
  n++;

  assert(s2.suggestions[0].actionKind == SuggestionKind.swap, 'assert-live');

  print('OK estimatePressureDrop: $n asserts passed');
}
