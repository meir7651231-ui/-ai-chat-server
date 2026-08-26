// בדיקת-חוזה · studioScopePrompt — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/studio_scope_prompt_test.dart
import 'studio_scope_prompt.dart';

const _instr =
    'בחר token אחד בלבד מהרשימה הסגורה שמתאר את טווח-העריכה, או השב '
    'AMBIGUOUS אם הבקשה אינה חד-משמעית. החזר שורה אחת: ה-token בלבד.';

// בונה את הפלט-הצפוי מ-writeln-סמנטיקה (כל שורה + '\n').
String _expected(List<String> tokenLines, String singlePrefix, String safe) {
  final b = StringBuffer();
  b.writeln('טווחי-עריכה זמינים (token = תיאור):');
  for (final l in tokenLines) {
    b.writeln(l);
  }
  b.writeln('$singlePrefix<id> = אלמנט בודד (id אמיתי מהרישום)');
  b.writeln();
  b.writeln('בקשת המנהל: "$safe".');
  b.writeln(_instr);
  return b.toString();
}

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n--got--\n$got\n--want--\n$want');
  }
}

void main() {
  var n = 0;

  // — golden: safeText חותך רווחים, טוקנים ממוינים, תיאורים עבריים —
  final got1 = studioScopePrompt(
    'ערוך את הכפתור  ',
    safeText: (u) => u.trim(),
    scopeTokens: () => {'scope:all', 'scope:screen:home'},
    scopeTokenHe: (t) =>
        const {'scope:all': 'הכול', 'scope:screen:home': 'מסך הבית'}[t] ?? t,
    singlePrefix: 'scope:single:',
  );
  _eq(
    got1,
    _expected(
      const ['scope:all = הכול', 'scope:screen:home = מסך הבית'],
      'scope:single:',
      'ערוך את הכפתור',
    ),
    '1 golden',
  );
  n++;

  // — מיון: קלט לא-ממוין ⇒ פלט ממוין עולה —
  final got2 = studioScopePrompt(
    'x',
    safeText: (u) => u,
    scopeTokens: () => {'zeta', 'alpha'},
    scopeTokenHe: (t) => t,
    singlePrefix: 'S:',
  );
  _eq(
    got2,
    _expected(const ['alpha = alpha', 'zeta = zeta'], 'S:', 'x'),
    '2 sorted',
  );
  n++;

  // — קבוצת-טוקן-יחיד —
  final got3 = studioScopePrompt(
    'רק זה',
    safeText: (u) => u,
    scopeTokens: () => {'only'},
    scopeTokenHe: (t) => 'תיאור',
    singlePrefix: 'p:',
  );
  _eq(got3, _expected(const ['only = תיאור'], 'p:', 'רק זה'), '3 single-token'); n++;

  // assert חי
  assert(studioScopePrompt('a',
          safeText: (u) => u,
          scopeTokens: () => {'t'},
          scopeTokenHe: (t) => t,
          singlePrefix: 'x:')
      .contains('בקשת המנהל: "a".'), 'assert-live guard');

  print('OK studioScopePrompt: $n asserts passed');
}
