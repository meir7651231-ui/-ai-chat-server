// בדיקת-חוזה (רתמת-זהב) · mergeFamilyImport — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/merge-family-import.test.mjs:
// כל הקלטות ה-Golden הן [f="" , obj=<string>] ⇒ JSON.stringify(out). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/merge-family-import_test.dart  ⇒ exit 0
import 'merge-family-import.dart';

// JSON.stringify מינימלי (בלי dart:convert) — מספיק לפלטי-Map של האטום.
String _json(dynamic v) {
  if (v == null) return 'null';
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) return v.toString();
  if (v is String) return _str(v);
  if (v is Map) {
    final parts = <String>[];
    v.forEach((k, val) => parts.add('${_str(k.toString())}:${_json(val)}'));
    return '{${parts.join(',')}}';
  }
  throw StateError('unsupported json value: $v');
}

String _str(String s) {
  final b = StringBuffer('"');
  for (var i = 0; i < s.length; i++) {
    final ch = s[i];
    final code = s.codeUnitAt(i);
    if (ch == '"') {
      b.write('\\"');
    } else if (ch == '\\') {
      b.write('\\\\');
    } else if (code < 0x20) {
      b.write('\\u${code.toRadixString(16).padLeft(4, '0')}');
    } else {
      b.write(ch);
    }
  }
  b.write('"');
  return b.toString();
}

// [obj, wantJson] — f תמיד "" (כמו במקור).
const CASES = <List<String>>[
  ['', '{}'],
  ['אבג', '{"0":"א","1":"ב","2":"ג"}'],
  ['כהן לוי', '{"0":"כ","1":"ה","2":"ן","3":" ","4":"ל","5":"ו","6":"י"}'],
  ['abc', '{"0":"a","1":"b","2":"c"}'],
  ['a@b.com', '{"0":"a","1":"@","2":"b","3":".","4":"c","5":"o","6":"m"}'],
  ['2026-08-24',
      '{"0":"2","1":"0","2":"2","3":"6","4":"-","5":"0","6":"8","7":"-","8":"2","9":"4"}'],
  ['2026-08-24T12:00:00',
      '{"0":"2","1":"0","2":"2","3":"6","4":"-","5":"0","6":"8","7":"-","8":"2","9":"4","10":"T","11":"1","12":"2","13":":","14":"0","15":"0","16":":","17":"0","18":"0"}'],
  ['0501234567',
      '{"0":"0","1":"5","2":"0","3":"1","4":"2","5":"3","6":"4","7":"5","8":"6","9":"7"}'],
  ['03-1234567',
      '{"0":"0","1":"3","2":"-","3":"1","4":"2","5":"3","6":"4","7":"5","8":"6","9":"7"}'],
  ['https://x.co',
      '{"0":"h","1":"t","2":"t","3":"p","4":"s","5":":","6":"/","7":"/","8":"x","9":".","10":"c","11":"o"}'],
  ['שלום עולם',
      '{"0":"ש","1":"ל","2":"ו","3":"ם","4":" ","5":"ע","6":"ו","7":"ל","8":"ם"}'],
  ['12', '{"0":"1","1":"2"}'],
];

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;
  for (final c in CASES) {
    final obj = c[0];
    final want = c[1];
    final got = _json(mergeFamilyImport('', obj));
    _eq(got, want, 'obj="$obj"');
    n++;
  }

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_json(mergeFamilyImport('', 'ab')) == '{"0":"a","1":"b"}',
      'assert-live guard');

  print('OK mergeFamilyImport: $n הקלטות-Golden — ירוק');
}
