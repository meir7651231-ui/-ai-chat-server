// בדיקת-אטום · restoreFinal — מייבא רק את האטום.
import 'restore_final.dart';

void main() {
  // אטמ → אטם (מ→ם).
  assert(restoreFinal('אטמ') == 'אטם');
  // צינור עם צ בסוף → ץ.
  assert(restoreFinal('חוצ') == 'חוץ');
  // אות שאינה במפה ⇒ ללא-שינוי.
  assert(restoreFinal('ברז') == 'ברז');
  // ריק ⇒ ריק.
  assert(restoreFinal('') == '');
  // אות בודדת שבמפה.
  assert(restoreFinal('נ') == 'ן');
  print('restore_final OK');
}
