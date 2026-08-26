// בדיקת-חוזה golden · assistantIntentPrompt — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/assistant_intent_prompt_test.dart
import 'assistant_intent_prompt.dart';

// שקע-הבדיקה: promptSafeText מדומה = קיצוץ ל-maxLen (מייצג את החוזה: טקסט-בטוח באורך חסום).
String _safe(String t, {required int maxLen}) =>
    t.length > maxLen ? t.substring(0, maxLen) : t;

void main() {
  var n = 0;
  const cats = ['ברזים', 'צנרת'];
  const recipes = [(key: 'kitPipe', name: 'ערכת צנרת'), (key: 'kitTap', name: 'ערכת ברז')];

  // — היסטוריה ריקה: אין בלוק "השיחה עד כה" —
  final p1 = assistantIntentPrompt(
    const [],
    'שלום',
    historyWindow: 2,
    categories: cats,
    recipes: recipes,
    promptSafeText: _safe,
  );
  if (p1.contains('השיחה עד כה')) throw StateError('FAIL 1: has history block');
  if (!p1.contains('המשתמש כתב: "שלום".')) throw StateError('FAIL 1b: no user line');
  if (!p1.contains('kitPipe=ערכת צנרת')) throw StateError('FAIL 1c: no recipe line');
  if (!p1.contains('ברזים\nצנרת')) throw StateError('FAIL 1d: no cats');
  n++;

  // — היסטוריה בתוך החלון: user/עוזר ממופים —
  final p2 = assistantIntentPrompt(
    const [
      IntentTurn(user: true, text: 'א'),
      IntentTurn(user: false, text: 'ב'),
    ],
    'ג',
    historyWindow: 5,
    categories: cats,
    recipes: recipes,
    promptSafeText: _safe,
  );
  if (!p2.contains('השיחה עד כה:')) throw StateError('FAIL 2: no history header');
  if (!p2.contains('משתמש: א')) throw StateError('FAIL 2b');
  if (!p2.contains('עוזר: ב')) throw StateError('FAIL 2c');
  n++;

  // — חלון חותך: 3 תורים, window=1 ⇒ רק האחרון מוצג —
  final p3 = assistantIntentPrompt(
    const [
      IntentTurn(user: true, text: 'ראשון'),
      IntentTurn(user: false, text: 'אמצע'),
      IntentTurn(user: true, text: 'אחרון'),
    ],
    'q',
    historyWindow: 1,
    categories: cats,
    recipes: recipes,
    promptSafeText: _safe,
  );
  if (p3.contains('ראשון') || p3.contains('אמצע')) {
    throw StateError('FAIL 3: window did not trim');
  }
  if (!p3.contains('משתמש: אחרון')) throw StateError('FAIL 3b: last missing');
  n++;

  // — promptSafeText מופעל: טקסט ארוך נחתך ל-600 —
  final long = 'x' * 700;
  final p4 = assistantIntentPrompt(
    const [],
    long,
    historyWindow: 2,
    categories: cats,
    recipes: recipes,
    promptSafeText: _safe,
  );
  if (p4.contains('x' * 601)) throw StateError('FAIL 4: not trimmed to 600');
  if (!p4.contains('x' * 600)) throw StateError('FAIL 4b: 600 missing');
  n++;

  // — טקסט-קבוע תמיד נוכח —
  if (!p1.contains('{"action":"...","key":"...","say":"..."}')) {
    throw StateError('FAIL 5: format line missing');
  }
  n++;

  assert(assistantIntentPrompt(const [], 'x', historyWindow: 1,
      categories: cats, recipes: recipes, promptSafeText: _safe).isNotEmpty,
      'assert-live');
  print('OK assistantIntentPrompt: $n asserts passed');
}
