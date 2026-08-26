// בדיקת-חוזה golden · classifyScope — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/classify_scope_test.dart
import 'classify_scope.dart';

// שקע-הבדיקה: matchId מדמה את matchElementId האמיתי — trim, ריק→null, exact-קודם,
// אחרת ה-key הכי-ארוך המוכל ב-reply (מדלג על key ריק). זה החוזה שהאטום נשען עליו.
String? _match(Iterable<String> ids, String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null;
  for (final k in ids) {
    if (k == r) return k;
  }
  String? best;
  for (final k in ids) {
    if (k.isEmpty) continue;
    if (r.contains(k) && (best == null || k.length > best.length)) best = k;
  }
  return best;
}

const _tokens = ['scope:all', 'scope:screen:home', 'scope:screen:cart'];
const _ids = ['btn_save', 'btn_cancel', 'lbl_title'];
const _prefix = 'scope:single:';

String? _run(String reply) => classifyScope(
      reply,
      scopeTokens: _tokens,
      registryIds: _ids,
      scopeSinglePrefix: _prefix,
      matchId: _match,
    );

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  // reply ריק ⇒ null (fail-closed)
  _eq(_run('   '), null, '1 blank'); n++;
  // token מדויק ⇒ מוחזר כמות-שהוא
  _eq(_run('scope:all'), 'scope:all', '2 exact broadcast'); n++;
  // token מוכל בפרוזה ⇒ נתפס
  _eq(_run('בבקשה scope:screen:home את המסך'), 'scope:screen:home', '3 contained token'); n++;
  // scope:single על id-אמת ⇒ prefix+id
  _eq(_run('scope:single:btn_save'), 'scope:single:btn_save', '4 single real'); n++;
  // scope:single עם id לא-אמת ⇒ null (לא מזייף id)
  _eq(_run('scope:single:ghost'), null, '5 single unknown'); n++;
  // פרוזה בלי token ובלי prefix ⇒ null
  _eq(_run('install the sink please'), null, '6 prose'); n++;
  // רווחים סביב token ⇒ trim ואז exact
  _eq(_run('  scope:all  '), 'scope:all', '7 trim exact'); n++;
  // token-רחב מנצח לפני בדיקת single (הקדימות במקור)
  _eq(_run('scope:screen:cart'), 'scope:screen:cart', '8 screen token'); n++;
  assert(_run('scope:all') == 'scope:all', 'assert-live');
  print('OK classifyScope: $n asserts passed');
}
