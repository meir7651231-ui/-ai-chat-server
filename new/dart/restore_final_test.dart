import '../dart-data/restore_final.dart';
// בדיקת-אטום · restoreFinal — מייבא רק את האטום.
import 'restore_final.dart';

void main() {
  // אטמ → אטם (מ→ם).
  assert(restoreFinal('אטמ', finalForm: kFinalForm) == 'אטם');
  // צינור עם צ בסוף → ץ.
  assert(restoreFinal('חוצ', finalForm: kFinalForm) == 'חוץ');
  // אות שאינה במפה ⇒ ללא-שינוי.
  assert(restoreFinal('ברז', finalForm: kFinalForm) == 'ברז');
  // ריק ⇒ ריק.
  assert(restoreFinal('', finalForm: kFinalForm) == '');
  // אות בודדת שבמפה.
  assert(restoreFinal('נ', finalForm: kFinalForm) == 'ן');
  print('restore_final OK');
}
