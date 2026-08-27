// בדיקת-אטום · dnNumber — מייבא רק את האטום.
import 'dn_number.dart';

void main() {
  assert(dnNumber('DN15') == 15);
  assert(dnNumber('DN110') == 110);
  // מיון-עולה: DN15 < DN110.
  assert(dnNumber('DN15') < dnNumber('DN110'));
  // עשרוני → חלק-שלם.
  assert(dnNumber('DN110.5') == 110);
  // ללא-מספר ⇒ אחרון.
  assert(dnNumber('צינור') == 1 << 30);
  print('dn_number OK');
}
