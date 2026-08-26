import 'wa-payment-text.dart';

// שקעי-אמת מקומיים כהתנהגות maor (הבדיקה מפעילה רק את האטום שלה):
// renderTemplate — lib/templates.ts:57-66 עם ברירת-המחדל של 'wa.payment'
const _defs = {
  'wa.payment':
      'שלום, תזכורת ידידותית מ{org}: יתרה לתשלום עבור {what} — ₪{amount}. תודה רבה!'
};

String renderTemplate(dynamic cfg, String key, Map<dynamic, dynamic> vars) {
  final def = _defs[key] ?? '';
  dynamic tpl;
  if (cfg is Map) {
    final tmpls = cfg['templates'];
    if (tmpls is Map) tpl = tmpls[key];
  }
  var t = (tpl is String ? tpl : '').trim();
  if (t.isEmpty) t = def;
  vars.forEach((k, v) {
    t = t.split('{$k}').join('$v');
  });
  return t;
}

// orgOf — wa.ts:47-49
String orgOf(dynamic orgName) {
  final s = (orgName as String).trim();
  return s.isEmpty ? 'העמותה' : s;
}

const _lrm = '‎'; // U+200E LRM — קידומת he-IL לשלילי

void main() {
  final cases = <List<dynamic>>[
    // 6 דוגמאות-החוזה (verbatim ממקור-האמת .mjs)
    ['מאור החסד', 'חוג ציור', 350, null,
      'שלום, תזכורת ידידותית ממאור החסד: יתרה לתשלום עבור חוג ציור — ₪350. תודה רבה!'],
    ['מאור החסד', 'כרטיסייה', 1234.6, null,
      'שלום, תזכורת ידידותית ממאור החסד: יתרה לתשלום עבור כרטיסייה — ₪1,235. תודה רבה!'],
    ['', 'חוג ציור', 80, null,
      'שלום, תזכורת ידידותית מהעמותה: יתרה לתשלום עבור חוג ציור — ₪80. תודה רבה!'],
    ['מאור', 'שחייה', 12500, null,
      'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור שחייה — ₪12,500. תודה רבה!'],
    ['מאור', 'ציור', 90, {'templates': {'wa.payment': '{what}: {amount} ({org})'}},
      'ציור: 90 (מאור)'],
    ['מאור', 'ציור', 90, {'templates': {'wa.payment': '  '}},
      'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור ציור — ₪90. תודה רבה!'],
    // ratchet-הסגר: סכום שלילי-אלפים ⇒ he-IL עם קידומת LRM (הבאג שנתפס באימות-העוין)
    ['מאור', 'חוב', -1000, null,
      'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור חוב — ₪${_lrm}-1,000. תודה רבה!'],
    // ratchet-הסגר: Math.round(-0.5) ⇒ -0 ⇒ '‎-0' (שימור אפס-שלילי)
    ['מאור', 'חוב', -0.5, null,
      'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור חוב — ₪${_lrm}-0. תודה רבה!'],
  ];

  var fail = 0;
  for (final c in cases) {
    final got = waPaymentText(c[0], c[1], c[2], c[3], renderTemplate, orgOf);
    final want = c[4];
    if (got != want) {
      fail = 1;
      print('✗ (${c[0]},${c[1]},${c[2]}) ⇒ $got ≠ $want');
    }
  }
  assert(fail == 0, 'wa-payment-text: יש כישלון-חוזה');
  if (fail != 0) throw StateError('wa-payment-text FAILED');
  print('✓ wa-payment-text: 6 דוגמאות-חוזה + 2 ratchet-הסגר — ירוק');
}
