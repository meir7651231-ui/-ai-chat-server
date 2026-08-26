// בדיקת-חוזה · isFitting — מייבאת אך ורק את האטום-שלה (חוק-4).
// DoD (דיבר-12): dart run --enable-asserts new/dart/is_fitting_test.dart ⇒ exit 0 + "OK isFitting".
import 'is_fitting.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  // ── סעיף-1: קטגוריה-מחבר ⇒ true (companyCatalogActive לא-רלוונטי) ──────────
  _eq(isFitting(const FittingPart('אביזרי נחושת')), true, '1 copper fittings'); n++;
  _eq(isFitting(const FittingPart('ברכיים')), true, '2 elbows');                n++;
  _eq(isFitting(const FittingPart('צינורות PP')), true, '3 PP pipes');          n++;
  _eq(isFitting(const FittingPart('אסלות וכיורים')), false, '4 fixture');       n++;
  _eq(isFitting(const FittingPart('חבקי תליה')), false, '5 structural');        n++;
  _eq(isFitting(const FittingPart('')), false, '6 empty');                      n++;

  // ── סעיף-2: name-fallback רק כשקטלוג-החברה פעיל ───────────────────────────
  // #7 — productType מחבר אך companyCatalogActive=false (ברירת-מחדל) ⇒ false.
  _eq(isFitting(const FittingPart('X', productType: 'מצמד')), false,
      '7 type-match but catalog OFF'); n++;
  // #8 — אותו קלט + companyCatalogActive=true ⇒ true (נופל על productType).
  _eq(isFitting(const FittingPart('X', productType: 'מצמד'),
          companyCatalogActive: true),
      true, '8 type-match catalog ON'); n++;
  // #9 — productType לא-מחבר (ברז) גם כשהדגל דלוק ⇒ false.
  _eq(isFitting(const FittingPart('X', productType: 'ברז'),
          companyCatalogActive: true),
      false, '9 functional type ON'); n++;
  // #10 — productType=null + דגל-דלוק ⇒ false (null∉_fittingTypes).
  _eq(isFitting(const FittingPart('X'), companyCatalogActive: true), false,
      '10 null type ON'); n++;

  assert(isFitting(const FittingPart('ברכיים')) == true, 'assert-live guard');
  assert(isFitting(const FittingPart('X', productType: 'מצמד')) == false,
      'assert-live guard: default catalog off');
  print('OK isFitting: $n asserts passed');
}
