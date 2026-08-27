// בדיקת-אטום · encodeValue
import 'encode_value.dart';

void main() {
  assert(encodeValue(null)['nullValue'] == null &&
      encodeValue(null).containsKey('nullValue'));
  assert(encodeValue(true)['booleanValue'] == true);

  // int → integerValue כמחרוזת (חוזה ה-API)
  assert(encodeValue(42)['integerValue'] == '42');
  assert(encodeValue(3.5)['doubleValue'] == 3.5);
  assert(encodeValue('hi')['stringValue'] == 'hi');

  // DateTime → ISO8601 ב-UTC
  final dt = DateTime.utc(2026, 1, 2, 3, 4, 5);
  assert(encodeValue(dt)['timestampValue'] == '2026-01-02T03:04:05.000Z');

  // List → arrayValue.values ממופה רקורסיבית
  final arr = encodeValue([1, 'x']);
  final vals = (arr['arrayValue'] as Map)['values'] as List;
  assert(vals.length == 2 && (vals[0] as Map)['integerValue'] == '1');
  assert((vals[1] as Map)['stringValue'] == 'x');

  // Map → mapValue.fields דרך encodeFields
  final mv = encodeValue({'a': 7});
  final fields = (mv['mapValue'] as Map)['fields'] as Map;
  assert((fields['a'] as Map)['integerValue'] == '7');

  // סוג לא-נתמך → מחרוזת fallback
  assert(encodeValue(Object()).containsKey('stringValue'));

  print('encodeValue OK');
}
