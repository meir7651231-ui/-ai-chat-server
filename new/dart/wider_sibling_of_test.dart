// בדיקת-אטום · widerSiblingOf — מוכיחה בדיוק את wider_sibling_of.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/wider_sibling_of_test.dart ⇒ exit 0.
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'wider_sibling_of.dart';

// מחזיק-קלט טהור: sku · type · brand · cat · bore(m); bore=null ⇒ אין קוטר.
class _P {
  final String sku;
  final String? type;
  final String brand;
  final String cat;
  final double? bore;
  const _P(this.sku, this.type, this.brand, this.cat, this.bore);
}

_P? _run(_P p, List<_P> catalog) => widerSiblingOf<_P>(
      p,
      catalog: catalog,
      skuOf: (x) => x.sku,
      productTypeOf: (x) => x.type,
      brandOf: (x) => x.brand,
      categoryHeOf: (x) => x.cat,
      minBoreOf: (x) => x.bore,
    );

// מוצר-הבסיס: ברך, מותג X, קטגוריה C, קוטר-בקבוק 20mm.
const _p = _P('P', 'ברך', 'X', 'C', 0.020);

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  // #1 — קטלוג מלא: q8(25mm) ו-q9(32mm) שניהם רחבים ⇒ נבחר הקטן-שבשדרוגים 25mm.
  const full = [
    _P('P', 'ברך', 'X', 'C', 0.050), // sku זהה ⇒ מדולג (מקור:289)
    _P('q2', 'טי', 'X', 'C', 0.050), // type שונה ⇒ מדולג (מקור:290)
    _P('q3', 'ברך', 'Y', 'C', 0.050), // brand שונה ⇒ מדולג (מקור:291)
    _P('q4', 'ברך', 'X', 'D', 0.050), // cat שונה ⇒ מדולג (מקור:292)
    _P('q5', 'ברך', 'X', 'C', null), // אין קוטר ⇒ מדולג (מקור:303)
    _P('q6', 'ברך', 'X', 'C', 0.015), // צר מ-20 ⇒ מדולג (מקור:303 qMin<=myMin)
    _P('q7', 'ברך', 'X', 'C', 0.020), // שווה ל-20 ⇒ מדולג (<=)
    _P('q8', 'ברך', 'X', 'C', 0.025), // רחב ⇒ מועמד
    _P('q9', 'ברך', 'X', 'C', 0.032), // רחב-יותר ⇒ אך גדול מ-q8
  ];
  _eq(_run(_p, full)?.sku, 'q8', '1 smallest wider upgrade');
  n++;

  // #2 — למוצר-הבסיס אין קוטר (minBore null) ⇒ null (מקור:281).
  _eq(_run(const _P('P', 'ברך', 'X', 'C', null), full)?.sku, null, '2 base no bore');
  n++;

  // #3 — כל הקטלוג צר-או-שווה ⇒ null (אין רחב).
  const noneWider = [
    _P('a', 'ברך', 'X', 'C', 0.010),
    _P('b', 'ברך', 'X', 'C', 0.020),
  ];
  _eq(_run(_p, noneWider)?.sku, null, '3 none wider');
  n++;

  // #4 — מוצר רחב אך מותג-שונה ⇒ מסונן ⇒ null.
  const wrongBrand = [_P('w', 'ברך', 'Z', 'C', 0.050)];
  _eq(_run(_p, wrongBrand)?.sku, null, '4 wider but wrong brand');
  n++;

  // #5 — אותו sku אך רחב ⇒ מדולג (לא מציעים את-עצמו) ⇒ null.
  const selfWider = [_P('P', 'ברך', 'X', 'C', 0.099)];
  _eq(_run(_p, selfWider)?.sku, null, '5 same sku excluded');
  n++;

  // #6 — סדר-הופעה הפוך (32 לפני 25) ⇒ עדיין נבחר 25 (הקטן, מקור:304-307).
  const reversed = [
    _P('big', 'ברך', 'X', 'C', 0.032),
    _P('small', 'ברך', 'X', 'C', 0.025),
  ];
  _eq(_run(_p, reversed)?.sku, 'small', '6 order-independent smallest');
  n++;

  assert(_run(_p, full)?.sku == 'q8', 'assert-live');

  print('OK widerSiblingOf: $n asserts passed');
}
