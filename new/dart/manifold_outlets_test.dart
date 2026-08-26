// בדיקת-חוזה · manifoldOutlets — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/manifold_outlets_test.dart
import 'manifold_outlets.dart';

class _Prod {
  final String sku;
  const _Prod(this.sku);
}

// sku → גדלי-הקצוות, או חסר (⇒ null, כמו kVerifiedSpecs[sku]==null → מקור:1250).
const Map<String, List<String>> _sizes = {
  'M4': ['1', '1/2', '1/2', '1/2'],       // מחלק 4-מוצאים ½"
  'M2': ['32', '32'],                     // 2 קצוות בלבד (<3) ⇒ 0
  'DISTINCT': ['1', '1/2', '3/4'],        // 3 קצוות שונים ⇒ maxc=1 ⇒ 0
  'M2b': ['1', '1/2', '1/2'],             // 3 קצוות, זוג ½" ⇒ 2
  'M4b': ['1/2', '1/2', '1/2', '1/2', '1'], // 5 קצוות, ארבע ½" ⇒ 4
  // 'RAW' — חסר ⇒ null ⇒ 0.
};

List<String>? _sizesOf(_Prod p) => _sizes[p.sku];

int _o(String sku) => manifoldOutlets(_Prod(sku), endSizesOf: _sizesOf);

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(_o('M4'), 3, '1 four ends, three ½" ⇒ 3');       n++;
  _eq(_o('M2'), 0, '2 <3 ends ⇒ 0');                   n++;
  _eq(_o('DISTINCT'), 0, '3 all distinct ⇒ 0');        n++;
  _eq(_o('M2b'), 2, '4 pair of ½" ⇒ 2');               n++;
  _eq(_o('M4b'), 4, '5 four ½" of five ⇒ 4');          n++;
  _eq(_o('RAW'), 0, '6 no spec ⇒ 0');                  n++;

  assert(_o('M4') == 3, 'assert-live guard');
  print('OK manifoldOutlets: $n asserts passed');
}
