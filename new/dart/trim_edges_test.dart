// בדיקת-אטום · trimEdges — מייבא רק את האטום.
import 'trim_edges.dart';

void main() {
  // פיסוק-קצה נגזם.
  assert(trimEdges('מס.') == 'מס');
  assert(trimEdges('*עם') == 'עם');
  // פיסוק-פנימי נשמר.
  assert(trimEdges('ח.פ') == 'ח.פ');
  assert(trimEdges('ש״ת') == 'ש״ת');
  // שני-קצוות.
  assert(trimEdges('#ברז"') == 'ברז');
  // כולה-פיסוק ⇒ ריק.
  assert(trimEdges('.*#') == '');
  // ריק ⇒ ריק.
  assert(trimEdges('') == '');
  // ללא-פיסוק-קצה ⇒ אותו-מופע (זהות).
  const s = 'צינור';
  assert(identical(trimEdges(s), s));
  print('trim_edges OK');
}
