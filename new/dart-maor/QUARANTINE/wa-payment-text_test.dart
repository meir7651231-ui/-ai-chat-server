/// בדיקת חוט · wa-payment-text — כל 6 דוגמאות-החוזה (= בדיקת-ה-JS
/// new/atoms/wa-payment-text.test.mjs) עם שקעי-אמת כהתנהגות maor.
import 'wa-payment-text.dart';

// renderTemplate — lib/templates.ts:57-66 עם ברירת-המחדל של 'wa.payment':
// דריסת-ארגון cfg?.templates?.[key] מקוצצת; ריקה-אחרי-טרים ⇒ ברירת-המחדל;
// החלפת {var} טקסטואלית (split/join).
const Map<String, String> _defs = {
  'wa.payment':
      'שלום, תזכורת ידידותית מ{org}: יתרה לתשלום עבור {what} — ₪{amount}. תודה רבה!'
};

String renderTemplate(dynamic cfg, dynamic key, dynamic vars) {
  final def = _defs[key] ?? '';
  final ovRaw = (cfg is Map && cfg['templates'] is Map)
      ? (cfg['templates'][key] ?? '')
      : '';
  var t = ovRaw.toString().trim();
  if (t.isEmpty) t = def;
  (vars as Map).forEach((k, v) {
    t = t.split('{$k}').join(v.toString());
  });
  return t;
}

// orgOf — wa.ts:47-49: orgName.trim() ריק ⇒ 'העמותה'.
String orgOf(dynamic orgName) {
  final t = (orgName as String).trim();
  return t.isEmpty ? 'העמותה' : t;
}

void check(String label, dynamic got, dynamic want) {
  if (got != want) {
    throw StateError('✗ $label ⇒ $got ≠ $want');
  }
}

void main() {
  final cases = <List<dynamic>>[
    // [orgName, what, balance, cfg, expected]
    [
      'מאור החסד', 'חוג ציור', 350, null,
      'שלום, תזכורת ידידותית ממאור החסד: יתרה לתשלום עבור חוג ציור — ₪350. תודה רבה!'
    ],
    [
      'מאור החסד', 'כרטיסייה', 1234.6, null,
      'שלום, תזכורת ידידותית ממאור החסד: יתרה לתשלום עבור כרטיסייה — ₪1,235. תודה רבה!'
    ],
    [
      '', 'חוג ציור', 80, null,
      'שלום, תזכורת ידידותית מהעמותה: יתרה לתשלום עבור חוג ציור — ₪80. תודה רבה!'
    ],
    [
      'מאור', 'שחייה', 12500, null,
      'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור שחייה — ₪12,500. תודה רבה!'
    ],
    [
      'מאור', 'ציור', 90,
      {
        'templates': {'wa.payment': '{what}: {amount} ({org})'}
      },
      'ציור: 90 (מאור)'
    ],
    [
      'מאור', 'ציור', 90,
      {
        'templates': {'wa.payment': '  '}
      },
      'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור ציור — ₪90. תודה רבה!'
    ],
  ];

  for (final c in cases) {
    final got = waPaymentText(c[0], c[1], c[2], c[3], renderTemplate, orgOf);
    check('(${c[0]},${c[1]},${c[2]})', got, c[4]);
  }

  // עיגול-חצי כלפי +∞ (Math.round של JS) + מפריד-אלפים משתקפים ב-amount:
  check(
    'round-half-up 1234.5',
    waPaymentText('מאור', 'ציור', 1234.5,
        {'templates': {'wa.payment': '{amount}'}}, renderTemplate, orgOf),
    '1,235',
  );

  print('OK — wa-payment-text: 6 דוגמאות-חוזה + עיגול — ירוק');
}
