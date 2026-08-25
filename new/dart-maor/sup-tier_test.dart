// בדיקת-חוזה (רתמת-זהב) · supTier — מייבאת אך ורק את האטום-שלה (חוק-4).
// כל 12 הקלטות-ה-Golden זהות ביט-אחר-ביט למקור new/atoms/sup-tier.test.mjs
// (ולחוזה sup-tier.contract.md): אותם קלטים ⇒ אותן מחרוזות-JSON בדיוק.
// ההשוואה = סריאליזציה שקולת-JSON.stringify מול המחרוזת-המוקלטת כלשונה
// (סדר-מפתחות = סדר-הכנסה — כלל-14; אין מערכים בפלט ⇒ כלל-8 לא-ישים,
// וההשוואה המחרוזתית ממילא קשיחה מגבול-איבר).
// הרצה: dart run --enable-asserts new/dart-maor/sup-tier_test.dart ⇒ OK
import 'sup-tier.dart';

// סריאליזציה שקולת-JSON.stringify לדאטה הזה: Map של String⇒String,
// סדר-הכנסה נשמר, עברית נשארת כלשונה (כמו JSON.stringify).
String _stringify(Map<String, String> m) {
  final parts = <String>[];
  m.forEach((k, v) {
    final ek = k.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    final ev = v.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    parts.add('"$ek":"$ev"');
  });
  return '{${parts.join(',')}}';
}

void main() {
  // [קלט, פלט-מוקלט] — הועתק אחד-לאחד מ-sup-tier.test.mjs (הקלטים שם
  // מקודדי-JSON למחרוזות ⇒ כאן מחרוזות-Dart ישירות).
  const dormant =
      '{"label":"רדומה","bg":"#eceae2","c":"#8b8474","dot":"#a8a29e"}';
  const gold = '{"label":"זהב","bg":"#fdf3dd","c":"#9a6414","dot":"#f3c76b"}';
  final cases = <List<String>>[
    ['', dormant],
    ['אבג', dormant],
    ['כהן לוי', dormant],
    ['abc', dormant],
    ['a@b.com', dormant],
    ['2026-08-24', dormant],
    ['2026-08-24T12:00:00', dormant],
    ['0501234567', gold], // ToNumber("0501234567")=501234567 ≥ 800 ⇒ זהב (כלל-15)
    ['03-1234567', dormant],
    ['https://x.co', dormant],
    ['שלום עולם', dormant],
    ['12', dormant],
  ];

  var f = 0;
  for (final row in cases) {
    final got = _stringify(supTier(row[0]));
    if (got != row[1]) {
      print('✗ "${row[0]}" ⇒ $got ≠ ${row[1]}');
      f = 1;
    }
  }
  if (f != 0) throw StateError('sup-tier: סטייה מהקלטות-ה-Golden');
  print('✓ sup-tier: ${cases.length} הקלטות-Golden — ירוק');
  print('OK');
}
