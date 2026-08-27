// בדיקת-אטום · decodeValue
import 'decode_value.dart';

void main() {
  assert(decodeValue({'nullValue': null}) == null);
  assert(decodeValue({'booleanValue': true}) == true);

  // integerValue (מחרוזת) → int
  assert(decodeValue({'integerValue': '42'}) == 42);
  // integerValue לא-תקין → 0 (fallback)
  assert(decodeValue({'integerValue': 'x'}) == 0);

  assert(decodeValue({'doubleValue': 3}) == 3.0); // num→double
  assert(decodeValue({'stringValue': 'hi'}) == 'hi');

  // timestamp → DateTime
  final ts = decodeValue({'timestampValue': '2026-01-02T03:04:05.000Z'});
  assert(ts is DateTime && (ts).toUtc().year == 2026);

  // array רקורסיבי
  final arr = decodeValue({
    'arrayValue': {
      'values': [
        {'integerValue': '1'},
        {'stringValue': 'x'},
      ],
    },
  }) as List;
  assert(arr.length == 2 && arr[0] == 1 && arr[1] == 'x');

  // map דרך decodeFields
  final m = decodeValue({
    'mapValue': {
      'fields': {
        'a': {'integerValue': '7'},
      },
    },
  }) as Map;
  assert(m['a'] == 7);

  // סוג לא-מוכר → null
  assert(decodeValue({'geoPointValue': {}}) == null);

  print('decodeValue OK');
}
