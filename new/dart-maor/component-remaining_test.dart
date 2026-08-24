import 'component-remaining.dart';

/// רתמת-זהב: אותן 7 דוגמאות-חוזה בדיוק מ-new/atoms/component-remaining.test.mjs.
/// R/A מדגמנים את אובייקטי-המקור; live = השקע שמסנן voidedAt (כמו-במקור).

class R {
  final String componentId;
  final String? voidedAt;
  R(this.componentId, [this.voidedAt]);
}

class A {
  final String productId;
  final List<R> redemptions;
  A(this.productId, this.redemptions);
}

List<dynamic> live(dynamic a) =>
    (a as A).redemptions.where((r) => r.voidedAt == null).toList();

void main() {
  var f = 0;
  void chk(int n, num? got, num? want) {
    if (got != want) {
      print('✗ דוגמה $n: $got ≠ $want');
      f = 1;
    }
  }

  chk(1, componentRemaining('c1', 'p1', [A('p1', [R('c1')])], null, live), null);
  chk(2, componentRemaining('c1', 'p1', [A('p1', [R('c1')]), A('p1', [R('c1')])], 5, live), 3);
  chk(3, componentRemaining('c1', 'p1', [A('p2', [R('c1')])], 5, live), 5);
  chk(4, componentRemaining('c1', 'p1', [A('p1', [R('c2'), R('c2')])], 5, live), 5);
  chk(5, componentRemaining('c1', 'p1', [A('p1', [R('c1'), R('c1'), R('c1')])], 1, live), 0);
  chk(6, componentRemaining('c1', 'p1', [A('p1', [R('c1'), R('c1', '2026-08-01')])], 2, live), 1);
  chk(7, componentRemaining('c1', 'p1', [], 0, live), 0);

  if (f != 0) throw StateError('component-remaining: סטייה מהמקור');
  print('✓ component-remaining: 7 דוגמאות-חוזה — ירוק');
}
