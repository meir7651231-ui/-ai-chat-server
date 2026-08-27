import 'project_to_screen.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  // מטריצת-יחידה column-major.
  const id = Mat4(<double>[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  // נקודת-מרכז (0,0,0): NDC=(0,0,0), w=1 ⇒ מרכז-המסך.
  final p = projectToScreen(id, id, const Vec3(0, 0, 0), 100, 100);
  _eq(p.x, 50.0, '1');
  n++;
  _eq(p.y, 50.0, '2');
  n++;
  _eq(p.w, 1.0, '3');
  n++;
  _eq(p.visible, true, '4');
  n++;
  print('✓ projectToScreen: $n');
}
