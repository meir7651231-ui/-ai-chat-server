import 'stock_merkaz.dart';

// מימוש-אמת לשקע tail — העתק verbatim מהמקור (_tail).
int tail(String sku, int n) {
  final s = sku.length <= n ? sku : sku.substring(sku.length - n);
  return int.tryParse(s) ?? 0;
}

void main() {
  // הכותרת: SKU=118220 ⇒ 3 (הכרעת-דמו, מעקף החישוב).
  assert(stockMerkaz(kC1HeadlineSku, tail: tail) == 3);
  // '000045' ⇒ tail(2)=45 ⇒ 1 + 45%7 = 1+3 = 4.
  assert(stockMerkaz('000045', tail: tail) == 4);
  // '77' ⇒ tail(2)=77 ⇒ 1 + 77%7 = 1+0 = 1.
  assert(stockMerkaz('77', tail: tail) == 1);
  // לא-נומרי ⇒ tail=0 ⇒ 1 + 0 = 1.
  assert(stockMerkaz('abc', tail: tail) == 1);
  print('stockMerkaz OK');
}
