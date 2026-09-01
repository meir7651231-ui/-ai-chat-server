// בדיקת-אטום · trimEdges — מייבא רק את האטום.
import '../dart-data/trim_edges-data.dart' as td_trim_edges;
import 'trim_edges.dart';

void main() {
  // פיסוק-קצה נגזם.
  assert(trimEdges('מס.', edge: td_trim_edges.edge) == 'מס');
  assert(trimEdges('*עם', edge: td_trim_edges.edge) == 'עם');
  // פיסוק-פנימי נשמר.
  assert(trimEdges('ח.פ', edge: td_trim_edges.edge) == 'ח.פ');
  assert(trimEdges('ש״ת', edge: td_trim_edges.edge) == 'ש״ת');
  // שני-קצוות.
  assert(trimEdges('#ברז"', edge: td_trim_edges.edge) == 'ברז');
  // כולה-פיסוק ⇒ ריק.
  assert(trimEdges('.*#', edge: td_trim_edges.edge) == '');
  // ריק ⇒ ריק.
  assert(trimEdges('', edge: td_trim_edges.edge) == '');
  // ללא-פיסוק-קצה ⇒ אותו-מופע (זהות).
  const s = 'צינור';
  assert(identical(trimEdges(s, edge: td_trim_edges.edge), s));
  print('trim_edges OK');
}
