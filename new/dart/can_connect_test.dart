// בדיקת-אטום · canConnect — מוכיחה בדיוק את דוגמאות can_connect.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/can_connect_test.dart ⇒ exit 0 + "canConnect OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'can_connect.dart';

void main() {
  // #1 — sku זהה ⇒ false (install_engine.dart:499), גם אם היה מתחבר אחרת.
  assert(canConnect(
        const ConnPart(sku: 'X', connectionSizes: ['20']),
        const ConnPart(sku: 'X', connectionSizes: ['20']),
      ) ==
      false);

  // #2 — שקע-מאומת=true ⇒ true verbatim, בלי בדיקת-גדלים (sizes ריקים).
  assert(canConnect(
        const ConnPart(sku: 'A'),
        const ConnPart(sku: 'B'),
        verifiedCompat: (_, __) => true,
      ) ==
      true);

  // #3 — שקע-מאומת=false ⇒ false verbatim, גם כשהגדלים חופפים.
  assert(canConnect(
        const ConnPart(sku: 'A', connectionSizes: ['20']),
        const ConnPart(sku: 'B', connectionSizes: ['20']),
        verifiedCompat: (_, __) => false,
      ) ==
      false);

  // #4 — name-inference: חפיפת-גדלים, בלי מין/שיטה ⇒ true.
  assert(canConnect(
        const ConnPart(sku: 'A', connectionSizes: ['20']),
        const ConnPart(sku: 'B', connectionSizes: ['20']),
      ) ==
      true);

  // #5 — צד עם גדלים-ריקים ⇒ false.
  assert(canConnect(
        const ConnPart(sku: 'A', connectionSizes: []),
        const ConnPart(sku: 'B', connectionSizes: ['20']),
      ) ==
      false);

  // #6 — גדלים זרים (אין חיתוך) ⇒ false.
  assert(canConnect(
        const ConnPart(sku: 'A', connectionSizes: ['20']),
        const ConnPart(sku: 'B', connectionSizes: ['25']),
      ) ==
      false);

  // #7 — שני המינים 'male' ⇒ חסימה ⇒ false.
  assert(canConnect(
        const ConnPart(sku: 'A', connectionSizes: ['20'], connectionGender: 'male'),
        const ConnPart(sku: 'B', connectionSizes: ['20'], connectionGender: 'male'),
      ) ==
      false);

  // #8 — מין בצד-אחד בלבד ⇒ מותר ⇒ true (חפיפת-הגדלים היא השומר).
  assert(canConnect(
        const ConnPart(sku: 'A', connectionSizes: ['20'], connectionGender: 'male'),
        const ConnPart(sku: 'B', connectionSizes: ['20']),
      ) ==
      true);

  // #9 — שתי שיטות מפורשות ושונות ⇒ false.
  assert(canConnect(
        const ConnPart(sku: 'A', connectionSizes: ['20'], connectionMethod: 'thread'),
        const ConnPart(sku: 'B', connectionSizes: ['20'], connectionMethod: 'glue'),
      ) ==
      false);

  // #10 — שיטה בצד-אחד בלבד ⇒ מותר ⇒ true.
  assert(canConnect(
        const ConnPart(sku: 'A', connectionSizes: ['20'], connectionMethod: 'thread'),
        const ConnPart(sku: 'B', connectionSizes: ['20']),
      ) ==
      true);

  print('canConnect OK — 10/10 contract examples proven');
}
