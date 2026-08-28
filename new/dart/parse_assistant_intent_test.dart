// בדיקת-חוזה · parseAssistantIntent — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/parse_assistant_intent_test.dart
// השקעים מוזרקים כמראות-זעירות של האחים (הקבוצה-הסגורה בבדיקה = דגימת-אמת).
import 'parse_assistant_intent.dart';

// ── שקעי-בדיקה: מראות-זעירות של שלושת-האחים ─────────────────────────────────
AssistantAction? fakeActionFromString(String s) {
  switch (s) {
    case 'answer':
      return AssistantAction.answer;
    case 'findProduct':
      return AssistantAction.findProduct;
    case 'summarizeOrders':
      return AssistantAction.summarizeOrders;
    case 'checkBudget':
      return AssistantAction.checkBudget;
    case 'addToCart':
      return AssistantAction.addToCart;
    default:
      return null;
  }
}

const _cats = ['ברזי מטבח', 'מערכות אמבטיה'];
String? fakeMatchCategory(String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null;
  for (final c in _cats) {
    if (r == c) return c;
  }
  String? best;
  for (final c in _cats) {
    if (r.contains(c) && (best == null || c.length > best.length)) best = c;
  }
  return best;
}

const _keys = ['faucet', 'kitchenFaucet'];
String? fakeMatchRecipeKey(String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null;
  for (final k in _keys) {
    if (r == k) return k;
  }
  String? best;
  for (final k in _keys) {
    if (r.contains(k) && (best == null || k.length > best.length)) best = k;
  }
  return best;
}

AssistantIntent parse(String raw) => parseAssistantIntent(
      raw,
      actionFromString: fakeActionFromString,
      matchCategory: fakeMatchCategory,
      matchRecipeKey: fakeMatchRecipeKey,
    );

void _eq(
    AssistantIntent got, AssistantAction action, String key, String say,
    String label) {
  if (got.action != action || got.key != key || got.say != say) {
    throw StateError(
        'FAIL [$label]: got=(${got.action},"${got.key}","${got.say}") '
        'want=($action,"$key","$say")');
  }
}

void main() {
  var n = 0;

  // — 1-3: לא-JSON ⇒ answer(text-מקוצץ) —
  _eq(parse('שלום, מה שלומך?'), AssistantAction.answer, '', 'שלום, מה שלומך?',
      '1 plain prose'); n++;
  _eq(parse('  טקסט עם רווחים  '), AssistantAction.answer, '', 'טקסט עם רווחים',
      '2 trim'); n++;
  _eq(parse('סוגר} לפני {פותח'), AssistantAction.answer, '', 'סוגר} לפני {פותח',
      '3 end<=start'); n++;

  // — 4-6: JSON תקין, פעולות ללא-מפתח (key='' תמיד) —
  _eq(parse('{"action":"answer","key":"","say":"שלום!"}'),
      AssistantAction.answer, '', 'שלום!', '4 answer action'); n++;
  _eq(parse('{"action":"checkBudget","say":" נשאר 500 "}'),
      AssistantAction.checkBudget, '', 'נשאר 500', '5 checkBudget + say trim'); n++;
  _eq(parse('בטח! {"action":"summarizeOrders","say":"הנה"} תודה'),
      AssistantAction.summarizeOrders, '', 'הנה', '6 prose-wrapped JSON'); n++;

  // — 7-8: פעולה-זרה ⇒ answer (say אם יש, אחרת הטקסט) —
  _eq(parse('{"action":"deleteAll","say":"מוחק"}'),
      AssistantAction.answer, '', 'מוחק', '7 unknown action carries say'); n++;
  _eq(parse('{"action":"deleteAll"}'),
      AssistantAction.answer, '', '{"action":"deleteAll"}',
      '8 unknown action, empty say -> whole text'); n++;

  // — 9-11: findProduct — שער-הקבוצה-הסגורה —
  _eq(parse('{"action":"findProduct","key":"ברזי מטבח","say":"מצאתי"}'),
      AssistantAction.findProduct, 'ברזי מטבח', 'מצאתי', '9 valid category'); n++;
  _eq(parse('{"action":"findProduct","key":"זבל"}'),
      AssistantAction.answer, '', 'לא הבנתי איזה מוצר — נסה לתאר אחרת.',
      '10 bad category, empty say -> source fallback line'); n++;
  _eq(parse('{"action":"findProduct","key":"זבל","say":"אולי ברז?"}'),
      AssistantAction.answer, '', 'אולי ברז?', '11 bad category carries say'); n++;

  // — 12-13: addToCart — שער-הקבוצה-הסגורה —
  _eq(parse('{"action":"addToCart","key":"kitchenFaucet","say":"מוסיף"}'),
      AssistantAction.addToCart, 'kitchenFaucet', 'מוסיף', '12 valid recipe'); n++;
  _eq(parse('{"action":"addToCart","key":"זבל"}'),
      AssistantAction.answer, '', 'לא הבנתי איזו ערכה — נסה לתאר אחרת.',
      '13 bad recipe, empty say -> source fallback line'); n++;

  // — 14-15: עמידות — JSON פגום ⇒ catch; action לא-String ⇒ '' ⇒ null —
  _eq(parse('{"action":"checkBudget","broken'),
      AssistantAction.answer, '', '{"action":"checkBudget","broken',
      '14 malformed JSON -> catch -> answer'); n++;
  _eq(parse('{"action":42,"say":"מס"}'),
      AssistantAction.answer, '', 'מס', '15 non-string action -> answer(say)'); n++;

  // — 16: המפתח המוחזר הוא המקורקע (מוכל-ארוך), לא הגולמי —
  _eq(parse('{"action":"addToCart","key":"ערכת kitchenFaucet בבקשה"}'),
      AssistantAction.addToCart, 'kitchenFaucet', '',
      '16 grounded key (longest contained), not raw'); n++;

  // — 17: קצה — מחרוזת ריקה ⇒ answer('') —
  _eq(parse(''), AssistantAction.answer, '', '', '17 empty raw'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(parse('{"action":"checkBudget","say":"x"}').action ==
      AssistantAction.checkBudget, 'assert-live guard');

  print('OK parseAssistantIntent: $n asserts passed');
}
