import 'match_rule_op.dart';

// מימוש-אמת לשקע matchClosed — verbatim מהמקור (_matchClosed).
String? matchClosed(Set<String> closed, String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null;
  for (final k in closed) {
    if (r == k) return k;
  }
  String? best;
  for (final k in closed) {
    if (k.isNotEmpty &&
        r.contains(k) &&
        (best == null || k.length > best.length)) {
      best = k;
    }
  }
  return best;
}

void main() {
  // exact — '>' לא מוצל ע"י '>='.
  assert(matchRuleOp('>', matchClosed: matchClosed) == '>');
  assert(matchRuleOp('>=', matchClosed: matchClosed) == '>=');
  // longest-contained: המחרוזת מכילה '>=' (ארוך מ-'>').
  assert(matchRuleOp('ageDays >= 3', matchClosed: matchClosed) == '>=');
  // ריק / לא-קיים ⇒ null.
  assert(matchRuleOp('   ', matchClosed: matchClosed) == null);
  assert(matchRuleOp('בלה', matchClosed: matchClosed) == null);
  print('matchRuleOp OK');
}
