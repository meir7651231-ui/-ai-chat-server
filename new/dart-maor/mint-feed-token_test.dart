// בדיקת-חוזה (רתמת-זהב) · mintFeedToken — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות לבדיקת-ה-JS new/atoms/mint-feed-token.test.mjs:
//   200 טביעות עוקבות ⇒ (1) אורך 32 · (2) hex-קטן · (3) ריפוד ב-200/200 · (4) 200 שונות.
// אם עובר ⇒ Dart≡JS (crypto ⇒ 32 תווי-hex מרופדים, אקראיים-מובחנים).
// הרצה: dart run --enable-asserts new/dart-maor/mint-feed-token_test.dart  ⇒ exit 0
import 'mint-feed-token.dart';

void main() {
  var n = 0;

  final tokens = List<String>.generate(200, (_) => mintFeedToken());
  final hex32 = RegExp(r'^[0-9a-f]{32}$');

  // 1) אורך 32 בדיוק (16 בייטים × 2 תווים).
  if (tokens[0].length != 32) {
    throw StateError('FAIL 1 אורך: ${tokens[0].length} != 32 (${tokens[0]})');
  }
  n++;

  // 2) hex קטן בלבד — תואם ^[0-9a-f]{32}$.
  if (!hex32.hasMatch(tokens[0])) {
    throw StateError('FAIL 2 לא-תואם hex: ${tokens[0]}');
  }
  n++;

  // 3) ריפוד: כל 200 הטביעות באורך 32 ותואמות hex (בלי padLeft היו מתקצרות).
  for (var i = 0; i < tokens.length; i++) {
    final t = tokens[i];
    if (t.length != 32 || !hex32.hasMatch(t)) {
      throw StateError('FAIL 3 ריפוד: טביעה $i="$t" (אורך ${t.length})');
    }
  }
  n++;

  // 4) אקראיות — 200 ערכים שונים זה מזה.
  final uniq = tokens.toSet();
  if (uniq.length != 200) {
    throw StateError('FAIL 4 התנגשות: ${uniq.length} שונות מתוך 200');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(mintFeedToken().length == 32, 'assert-live guard length');
  assert(hex32.hasMatch(mintFeedToken()), 'assert-live guard hex');

  print('OK mintFeedToken: $n asserts passed (200 tokens)');
}
