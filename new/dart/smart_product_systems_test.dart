// בדיקת-חוזה · smartProductSystems — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/smart_product_systems_test.dart
import 'smart_product_systems.dart';

/// רשומת-קטלוג מינימלית לבדיקה (sku + מערכות) — לא טיפוס-שכן.
class _P {
  final String sku;
  final Set<String> systems;
  const _P(this.sku, this.systems);
}

// קטלוג-הדוגמאות מהחוזה: A→{supply} · B→{drainage} · A-כפול→{drainage} (לעולם לא נבחר).
const _catalog = [
  _P('A', {'supply'}),
  _P('B', {'drainage'}),
  _P('A', {'drainage'}),
];

Set<String> _run(Iterable<String?> brandSkus, [List<_P> catalog = _catalog]) =>
    smartProductSystems<_P, String>(
      brandSkus,
      allProducts: catalog,
      skuOf: (p) => p.sku,
      divisionSystemsOf: (p) => p.systems,
    );

void _eq(Set<String> got, Set<String> want, String label) {
  final same = got.length == want.length && got.containsAll(want);
  if (!same) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  // חוזה #1 — אין מותגים ⇒ ריק (מקור:102).
  _eq(_run([]), {}, '1 empty brands'); n++;

  // חוזה #2 — כל ה-sku-ים null ⇒ דילוג, ריק (מקור:104-105).
  _eq(_run([null, null]), {}, '2 all-null skus'); n++;

  // חוזה #3 — sku ללא-התאמה ⇒ ריק (unresolvable ⇒ system-agnostic).
  _eq(_run(['X']), {}, '3 no catalog match'); n++;

  // חוזה #4 — ההתאמה-הראשונה מנצחת (break, מקור:110): לא drainage של ה-A-הכפול.
  _eq(_run(['A']), {'supply'}, '4 first match wins'); n++;

  // חוזה #5 — איחוד על-פני מותגים (מקור:108 addAll).
  _eq(_run(['A', 'B']), {'supply', 'drainage'}, '5 union'); n++;

  // חוזה #6 — מעורב: null מדולג + התאמה + אין-התאמה.
  _eq(_run([null, 'B', 'X']), {'drainage'}, '6 mixed'); n++;

  // חוזה #7 — כפילות-מותג ⇒ הקבוצה בולעת.
  _eq(_run(['A', 'A']), {'supply'}, '7 duplicate brand sku'); n++;

  // קצה — קטלוג ריק ⇒ ריק תמיד.
  _eq(_run(['A', 'B'], []), {}, '8 empty catalog'); n++;

  // קצה — מוצר-תואם עם קבוצת-מערכות ריקה ⇒ תורם כלום אך עדיין break
  // (המוצר-הכפול שאחריו לא נסרק): A ראשון ריק ⇒ תוצאה ריקה.
  _eq(
    _run(['A'], const [_P('A', {}), _P('A', {'drainage'})]),
    {},
    '9 empty-systems match still breaks',
  ); n++;

  assert(_run(['A']).contains('supply'), 'assert-live guard');
  print('OK smartProductSystems: $n asserts passed');
}
