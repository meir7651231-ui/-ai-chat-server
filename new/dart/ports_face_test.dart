// בדיקת-אטום · portsFace — מייבא רק את האטום.
import 'ports_face.dart';

void main() {
  // east מול west = הפוכים ⇒ true.
  assert(portsFace(const Vec3(1, 0, 0), const Vec3(-1, 0, 0)));
  // north מול south ⇒ true.
  assert(portsFace(const Vec3(0, 1, 0), const Vec3(0, -1, 0)));
  // אותו כיוון (east מול east) ⇒ false.
  assert(!portsFace(const Vec3(1, 0, 0), const Vec3(1, 0, 0)));
  // אנכיים לא-הפוכים (east מול north) ⇒ false.
  assert(!portsFace(const Vec3(1, 0, 0), const Vec3(0, 1, 0)));
  // וקטור-45° לא-צירי ⇒ snapToGrid null ⇒ false.
  assert(!portsFace(const Vec3(0.707, 0.707, 0), const Vec3(-1, 0, 0)));
  // above מול below ⇒ true.
  assert(portsFace(const Vec3(0, 0, 1), const Vec3(0, 0, -1)));
  print('ports_face OK');
}
