import 'names-to-template-lines.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/names-to-template-lines.test.mjs.
/// אם עובר — Dart ≡ JS (התנהגות זהה-ביט למקור).

bool _lineEq(Map<String, dynamic> a, Map<String, dynamic> b) =>
    a['name'] == b['name'] && a['qty'] == b['qty'] && a['rate'] == b['rate'];

bool _eq(List<Map<String, dynamic>> a, List<Map<String, dynamic>> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (!_lineEq(a[i], b[i])) return false;
  }
  return true;
}

void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  // 1) חיתוך-רווחים + מספור eyes
  ok(
    _eq(
      namesToTemplateLines([{'name': ' דוד ', 'eyes': '3', 'rate': 5}]),
      [{'name': 'דוד', 'qty': 3, 'rate': 5}],
    ),
    'חיתוך+מספור נכשלו',
  );

  // 2) שם-רווחים בלבד ⇒ נופל
  ok(
    _eq(
      namesToTemplateLines([{'name': '  ', 'eyes': '2', 'rate': 9}]),
      [],
    ),
    'שם-ריק לא סונן',
  );

  // 3) eyes לא-מספרי ⇒ 0; rate חסר ⇒ 0
  ok(
    _eq(
      namesToTemplateLines([{'name': 'לוי', 'eyes': 'abc'}]),
      [{'name': 'לוי', 'qty': 0, 'rate': 0}],
    ),
    'נפילת NaN/חסר ל-0 נכשלה',
  );

  // 4) מספר עובר כמו-שהוא
  ok(
    _eq(
      namesToTemplateLines([{'name': 'כהן', 'eyes': 2.5, 'rate': 0}]),
      [{'name': 'כהן', 'qty': 2.5, 'rate': 0}],
    ),
    'מספר-עשרוני לא עבר',
  );

  // 5) ריק ⇒ ריק · eyes='' ⇒ qty 0
  ok(_eq(namesToTemplateLines([]), []), 'מערך ריק');
  ok(
    _eq(
      namesToTemplateLines([{'name': 'א', 'eyes': '', 'rate': 7}]),
      [{'name': 'א', 'qty': 0, 'rate': 7}],
    ),
    "eyes='' לא נפל ל-0",
  );

  if (f != 0) throw StateError('names-to-template-lines: סטייה מהמקור');
  print('✓ names-to-template-lines: 6 דוגמאות-חוזה — ירוק');
}
