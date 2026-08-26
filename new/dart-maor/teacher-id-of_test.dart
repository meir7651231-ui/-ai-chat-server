import 'teacher-id-of.dart';

void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('FAIL: $msg');
      f = 1;
    }
  }

  final cfg = {
    'roles': {
      'teachers': {' Rivka@X.co ': 't1', 'sara@x.co': 't2'}
    }
  };

  // 1) dirty map key normalized
  ok(teacherIdOf(cfg, 'rivka@x.co') == 't1', 'ex1');
  // 2) probed email normalized
  ok(teacherIdOf(cfg, ' SARA@X.CO ') == 't2', 'ex2');
  // 3) no mapping -> null
  ok(teacherIdOf(cfg, 'nobody@x.co') == null, 'ex3');
  // 4) no email -> null
  ok(teacherIdOf(cfg, '') == null, 'ex4a');
  ok(teacherIdOf(cfg, null) == null, 'ex4b');
  // 5) no roles.teachers -> null
  ok(teacherIdOf({}, 'sara@x.co') == null, 'ex5');

  // adversarial (rule-16/13):
  // U+0085 (NEL): JS trim does NOT strip -> email keeps NEL -> no match -> null.
  // Dart raw .trim() WOULD strip it and wrongly return 't1'.
  ok(teacherIdOf(cfg, '\u{0085}rivka@x.co') == null, 'nel-should-not-trim');
  // U+00A0 (NBSP): part of ES-WS -> stripped -> matches.
  ok(teacherIdOf(cfg, '\u{00A0}rivka@x.co\u{00A0}') == 't1', 'nbsp-trims');
  // U+0130 (dotted capital I) full-mapping lower -> 'i' + U+0307.
  ok(teacherIdOf({
        'roles': {
          'teachers': {'\u{0069}\u{0307}x@y.co': 'tt'}
        }
      }, '\u{0130}X@Y.CO') == 'tt', 'dotted-i-full-lower');

  if (f != 0) {
    throw StateError('teacher-id-of: failed');
  }
  print('OK teacher-id-of: contract + adversarial green');
}
