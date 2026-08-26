import 'dart:convert';
import 'strip-audit-meta.dart';

// הקלטות-Golden verbatim מ-new/atoms/strip-audit-meta.test.mjs:
// כל קלט = מחרוזת-JSON שמפורסרת ומוזנת ל-stripAuditMeta; הפלט = JSON.stringify.
const _golden = <List<String>>[
  ['{"amount":100}', '{"amount":100}'],
  ['{"payments":[{"amount":100},{"amount":50}]}',
      '{"payments":[{"amount":100},{"amount":50}]}'],
  ['{"name":"כהן","phone":"0501234567"}',
      '{"name":"כהן","phone":"0501234567"}'],
  ['[{"amount":100}]', '[{"amount":100}]'],
  ['["2026-08-24"]', '["2026-08-24"]'],
  ['[]', '[]'],
  ['["א","ב"]', '["א","ב"]'],
  ['{}', '{}'],
];

// ratchet-הסגר (FIXES.md · "סף-אינדקס מדויק"): "4294967295"=2^32−1 אינו array-index
// ⇒ נשאר בסדר-הכנסה, לא מוין-מספרית. "2" כן array-index ⇒ קודם. audit מוסר.
const _ratchet = <List<String>>[
  ['{"4294967295":1,"b":2,"2":3,"audit":9}', '{"2":3,"4294967295":1,"b":2}'],
  ['{"10":1,"2":2,"audit":9,"x":3}', '{"2":2,"10":1,"x":3}'],
  // audit קיים ⇒ העתק בלי audit; המקור אינו משתנה (זהות-רפרנס רק בהיעדר-audit).
  ['{"audit":{"by":"x"},"amount":5}', '{"amount":5}'],
];

void main() {
  var fail = 0;
  for (final row in [..._golden, ..._ratchet]) {
    final got = jsonEncode(stripAuditMeta(jsonDecode(row[0])));
    if (got != row[1]) {
      fail = 1;
      // ignore: avoid_print
      print('✗ ${row[0]} ⇒ $got ≠ ${row[1]}');
    }
  }

  // זהות-רפרנס: בהיעדר 'audit' מוחזר אותו אובייקט עצמו (כמו ב-JS).
  final same = <String, dynamic>{'amount': 100};
  assert(identical(stripAuditMeta(same), same), 'no-audit ⇒ same reference');
  final arr = <dynamic>[1, 2];
  assert(identical(stripAuditMeta(arr), arr), 'List ⇒ same reference');
  // אי-מוטציה של המקור כשיש audit.
  final src = <String, dynamic>{'audit': 1, 'x': 2};
  stripAuditMeta(src);
  assert(src.containsKey('audit'), 'source must not be mutated');

  if (fail != 0) throw StateError('strip-audit-meta: הסגר עדיין אדום');
  // ignore: avoid_print
  print('✓ strip-audit-meta: ${_golden.length} golden + ${_ratchet.length} ratchet — ירוק');
}
