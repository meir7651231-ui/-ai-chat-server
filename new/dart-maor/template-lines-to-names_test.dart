// בדיקת-חוזה ל-template-lines-to-names.dart — 5 דוגמאות-החוזה (זהות ל-
// template-lines-to-names.test.mjs) + ratchet תיקון-ההסגר.
//
// ההסגר: הרתמה השוותה פלט דרך JSON.stringify. `_jsNumJson` של-הסוכן המיר
// double-שלם ל-int רק כשקטן מ-int64; לערך eyes/rate בטווח [9.2e18,1e21) —
// שגדול מ-int64-max (9223372036854775807) — נפל ל-toString עם ".0"/מדעי ⇒
// "9300000000000000000.0" במקום JS "9300000000000000000". התיקון: סידור
// מספרים דרך `_jsStr` המאומת (חוק-12 · shortest-round-trip, בלי ".0").
// ‏ratchet מוכיח: 9.3e18 (‏>int64) ⇒ המחרוזת = "9300000000000000000".
import 'template-lines-to-names.dart';

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    _f = 1;
  }
}

const int _pow2_53 = 9007199254740992; // 2^53

// חוק-12 · String(num) של JS = shortest-round-trip. שלם-בטוח ⇒ בלי ".0";
// טווח [2^53,1e21) שלם ⇒ עשרוני-מלא; ‏≥1e21 ⇒ מעריכי; ‏-0 ⇒ '0'.
String _jsStr(num n) {
  if (n is int) return n.toString();
  final d = n as double;
  if (d.isNaN) return 'NaN';
  if (d == double.infinity) return 'Infinity';
  if (d == double.negativeInfinity) return '-Infinity';
  if (d == 0) return '0'; // כולל -0.0
  final neg = d < 0;
  final ad = neg ? -d : d;
  String body;
  if (ad == ad.truncateToDouble() && ad < 1e21) {
    body = ad < _pow2_53 ? ad.toInt().toString() : ad.toStringAsFixed(0);
  } else {
    body = ad.toString();
  }
  return neg ? '-$body' : body;
}

// JSON.stringify נאמן-JS על פלט-האטום: סדר-מפתחות = סדר-הכנסה; מספרים דרך _jsStr.
String _stringify(dynamic v) {
  if (v == null) return 'null';
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) return _jsStr(v);
  if (v is String) return '"$v"';
  if (v is List) return '[${v.map(_stringify).join(',')}]';
  if (v is Map) {
    final parts = <String>[];
    v.forEach((k, val) => parts.add('"$k":${_stringify(val)}'));
    return '{${parts.join(',')}}';
  }
  throw StateError('unstringifiable: $v');
}

String nid(int i) => 'id$i';

void main() {
  // 1) שורה מלאה: trim + eyes + done:false + rate
  final r1 = templateLinesToNames([
    {'name': ' צבע ', 'qty': 3, 'rate': 120},
  ], nid);
  ok(
    _stringify(r1) ==
        '[{"id":"id0","name":"צבע","eyes":3,"done":false,"rate":120}]',
    'דוגמה 1: שורה מלאה שגויה — ${_stringify(r1)}',
  );

  // 2) rate לא-חיובי ⇒ אין מפתח rate
  final r2 = templateLinesToNames([
    {'name': 'א', 'qty': 1, 'rate': 0},
    {'name': 'ב', 'qty': 1, 'rate': -5},
  ], nid);
  ok(
    !(r2[0] as Map).containsKey('rate') && !(r2[1] as Map).containsKey('rate'),
    'דוגמה 2: rate לא-חיובי נכנס',
  );

  // 3) ריקי-שם מסולקים
  final r3 = templateLinesToNames([
    {'name': '  ', 'qty': 1, 'rate': 9},
    {'name': '', 'qty': 2, 'rate': 9},
  ], nid);
  ok(r3.isEmpty, 'דוגמה 3: ריק-שם לא סולק');

  // 4) qty שבור ⇒ 0; מחרוזת-מספר ⇒ מספר
  final r4 = templateLinesToNames([
    {'name': 'א', 'qty': 'ab', 'rate': 0},
    {'name': 'ב', 'rate': 0}, // qty חסר ⇒ +undefined=NaN ⇒ 0
    {'name': 'ג', 'qty': '4', 'rate': 0},
  ], nid);
  ok(
    r4[0]['eyes'] == 0 && r4[1]['eyes'] == 0 && r4[2]['eyes'] == 4,
    'דוגמה 4: המרת-qty שגויה',
  );

  // 5) מזהים לפי מקום-אחרי-סינון
  final r5 = templateLinesToNames([
    {'name': '', 'qty': 1, 'rate': 0},
    {'name': 'א', 'qty': 1, 'rate': 0},
    {'name': 'ב', 'qty': 1, 'rate': 0},
  ], nid);
  ok(
    r5.length == 2 && r5[0]['id'] == 'id0' && r5[1]['id'] == 'id1',
    'דוגמה 5: הריק צרך מזהה',
  );

  // ── ratchet תיקון-ההסגר (חוק-12/17) ──────────────────────────────────────
  // ‏qty=9.3e18 (double-שלם, גדול מ-int64-max) ⇒ eyes=9.3e18. JS מסדר
  // "9300000000000000000". הקוד-השבור (_jsNumJson · int-רק-<int64) היה נופל
  // ל-toString ⇒ "9300000000000000000.0". התיקון (_jsStr) ⇒ תואם-JS.
  final rBig = templateLinesToNames([
    {'name': 'x', 'qty': 9.3e18, 'rate': 0},
  ], nid);
  ok(rBig[0]['eyes'] is double, 'ratchet: eyes במרחב-float64 (double)');
  ok(
    _stringify(rBig) == '[{"id":"id0","name":"x","eyes":9300000000000000000,"done":false}]',
    'ratchet: eyes בטווח [9.2e18,1e21) ⇒ "9300000000000000000" (בלי ".0"/מדעי) — בפועל ${_stringify(rBig)}',
  );
  // הוכחת-הבאג: הסידור-השבור היה מוסיף ".0".
  ok(_jsStr(9.3e18) == '9300000000000000000', 'ratchet: _jsStr(9.3e18) = ...000, לא ...000.0');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    _stringify(templateLinesToNames(<dynamic>[], nid)) == '[]',
    'assert-live guard',
  );

  if (_f != 0) {
    throw StateError('template-lines-to-names: בדיקות נכשלו');
  }
  print('✓ template-lines-to-names: 5 דוגמאות-חוזה + ratchet חוק-12/17 — ירוק');
}
