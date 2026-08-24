// 🥇 רתמת-זהב · computeQuote — חמש דוגמאות-החוזה של compute-quote.test.mjs verbatim.
// עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts compute-quote_test.dart (חייב exit 0).
import 'compute-quote.dart';

void main() {
  const ALL = ['families', 'courses', 'supporters'];
  String nameOf(String m) =>
      {'families': 'משפחות', 'courses': 'חוגים', 'supporters': 'תורמים'}[m] ??
      m;
  final P = <String, dynamic>{
    'base': 290,
    'modules': {'families': 0, 'courses': 120, 'supporters': 180},
    'integrations': {'whatsapp': 50},
    'sizeMult': {'small': 1, 'medium': 1.6},
    'setup': 1500,
    'enterprise': {'oneTime': 55000, 'annualMaintenance': 9000},
  };

  // 1) courses כבוי · small · בלי addons
  final q1 = computeQuote({
    'modules': {'courses': false}
  }, 'small', P, nameOf, ALL);
  final l1 = q1['lines'] as List;
  assert(l1.length == 1 && l1[0]['key'] == 'supporters' && l1[0]['price'] == 180,
      '1: lines != [supporters@180]');
  final inc1 = q1['included'] as List;
  assert(inc1.length == 1 && inc1[0]['key'] == 'families',
      '1: included != [families@0]');
  assert(q1['modulesSubtotal'] == 180, '1: subtotal != 180');
  assert(q1['monthly'] == 470, '1: monthly != 470 (got ${q1['monthly']})');
  assert(
      q1['firstPayment'] == 1970 &&
          q1['yearly'] == 5640 &&
          q1['yearlyDiscounted'] == 4700,
      '1: payments wrong');

  // 2) הכל דלוק · medium · addon וואטסאפ
  final q2 = computeQuote({}, 'medium', P, nameOf, ALL, [
    {'key': 'whatsapp', 'label': 'וואטסאפ'}
  ]);
  final l2 = q2['lines'] as List;
  assert(l2.map((l) => l['key']).join(',') == 'courses,supporters,whatsapp',
      '2: line order wrong');
  assert(l2[2]['kind'] == 'integration' && l2[2]['price'] == 50,
      '2: whatsapp != integration@50');
  assert(q2['modulesSubtotal'] == 350 && q2['sizeMult'] == 1.6,
      '2: subtotal/mult wrong');
  assert(
      q2['monthly'] == 1024 &&
          q2['firstPayment'] == 2524 &&
          q2['yearlyDiscounted'] == 10240,
      '2: monthly != 1024 (got ${q2['monthly']})');

  // 3) גודל לא-מוכר ⇒ מכפיל 1
  final q3 = computeQuote({}, 'huge', P, nameOf, ALL);
  assert(q3['sizeMult'] == 1 && q3['monthly'] == 590,
      '3: multiplier fallback wrong (monthly=${q3['monthly']})');

  // 4) הרחבה בלי מחיר ⇒ לא ב-lines
  final q4 = computeQuote({
    'modules': {'courses': false, 'supporters': false}
  }, 'small', P, nameOf, ALL, [
    {'key': 'zzz', 'label': '?'}
  ]);
  assert((q4['lines'] as List).isEmpty, '4: zero-price addon entered lines');

  // 5) enterprise + בלי setup
  final P5 = Map<String, dynamic>.from(P)..remove('setup');
  final q5 =
      computeQuote({}, 'small', P5, nameOf, ALL, const [], 'enterprise');
  assert(q5['setup'] == 0 && q5['firstPayment'] == q5['monthly'],
      '5: missing setup != 0');
  assert(
      q5['mode'] == 'enterprise' &&
          q5['enterpriseOneTime'] == 55000 &&
          q5['enterpriseAnnual'] == 9000,
      '5: enterprise passthrough wrong');

  print('✓ compute-quote (Dart): 5 דוגמאות-חוזה — ירוק');
}
