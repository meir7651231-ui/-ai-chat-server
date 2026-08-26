// 🧪 הוכחה · bs-matching (בנייה-חכמה) — התאמה-מטושטשת דרך הקופסה.
import 'bs-matching.dart' as B;

int n = 0, fails = 0;
void ok(String name, bool c) { if (!c) { print('✗ $name'); fails++; } else { n++; } }

void main() {
  // fuzzyScore: התאמה-מדויקת/תת-מחרוזת ⇒ 0; טעות-אחת באורך≥4 ⇒ מותר
  ok('score exact/prefix ⇒ 0', B.fuzzyScore('abc', 'abcdef') == 0);
  ok('fuzzyMatch זהה', B.fuzzyMatch('shalom', 'shalom'));
  ok('fuzzyMatch טעות-אחת (אורך≥4)', B.fuzzyMatch('shalom', 'shalim'));
  ok('fuzzyMatch תת-מחרוזת', B.fuzzyMatch('sha', 'shalom'));
  ok('fuzzyMatch רחוק ⇒ false', !B.fuzzyMatch('shalom', 'xyzqrt'));
  ok('fuzzyNameMatch', B.fuzzyNameMatch('כהן', 'כהן'));
  ok('fuzzyScore רחוק ⇒ -1 (אי-התאמה)', B.fuzzyScore('shalom', 'xyzqrt') == -1);
  ok('fuzzyScore טעות-אחת ⇒ 1', B.fuzzyScore('shalom', 'shalim') == 1);

  if (fails > 0) { print('❌ bs-matching: $fails אי-התאמות'); throw StateError('bs-matching proof failed'); }
  print('✓ קופסת-bs-matching (בנייה-חכמה): $n טענות — התאמה-מטושטשת Damerau-Levenshtein');
}
