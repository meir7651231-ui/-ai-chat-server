// בדיקת-Golden · wheel-index-under-pointer — שיקוף 1:1 של wheel-index-under-pointer.test.mjs
// כל 12 הקלטות-החוזה; השוואה דרך ייצוג-JSON (חוק 12: NaN⇒null, שלם בלי ".0").
import 'wheel-index-under-pointer.dart';

/// JSON.stringify של JS על תוצאת-האטום: NaN ⇒ "null"; מספר שלם סופי ⇒ בלי ".0".
String jsonStr(dynamic v) {
  if (v is double && v.isNaN) return 'null';
  if (v is num) {
    final d = v.toDouble();
    if (d.isFinite && d == d.truncateToDouble() && d.abs() < 1e21) {
      return d.truncate().toString();
    }
    return d.toString();
  }
  return '$v';
}

void main() {
  // [rot, n] ⇒ פלט-JSON מוקלט (זהה-ביט ל-CASES שב-.test.mjs)
  final cases = <List<dynamic>>[
    [['', ''], '0'],
    [['', 'אבג'], 'null'],
    [['', 'כהן לוי'], 'null'],
    [['', 'abc'], 'null'],
    [['', 'a@b.com'], 'null'],
    [['', '2026-08-24'], 'null'],
    [['', '2026-08-24T12:00:00'], 'null'],
    [['', '0501234567'], '0'],
    [['', '03-1234567'], 'null'],
    [['', 'https://x.co'], 'null'],
    [['', 'שלום עולם'], 'null'],
    [['', '12'], '0'],
  ];

  var failed = 0;
  for (final c in cases) {
    final args = c[0] as List<dynamic>;
    final want = c[1] as String;
    final got = jsonStr(wheelIndexUnderPointer(args[0], args[1]));
    if (got != want) {
      print('✗ $args ⇒ $got ≠ $want');
      failed++;
    }
  }
  if (failed > 0) {
    throw StateError('wheel-index-under-pointer: $failed/${cases.length} נכשלו');
  }
  print('✓ wheel-index-under-pointer: ${cases.length} הקלטות-Golden — ירוק');
  print('OK');
}
