// בדיקת-חוזה · colorForToken — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/color_for_token_test.dart
// שקעי-הבדיקה = ערכי-ה-SSOT האמיתיים (BsTokens, theme/tokens.dart@d3c57704:56-77)
// כ-int — כך המיפוי מאומת מול פיגמנטי-האמת בלי dart:ui.
import 'color_for_token.dart';

// BsTokens verbatim (tokens.dart@d3c57704) — דאטה-של-הבדיקה, לא של המנוע.
const int kBrand = 0xFFFF7A18;
const int kBrandDark = 0xFFE85F00;
const int kSuccess = 0xFF22C55E;
const int kDanger = 0xFFEF4444;
const int kWarnText = 0xFFB45309;
const int kInkLight = 0xFF1A1A1A;
const int kMutedLight = 0xFF666666;

int? _resolve(String? token) => colorForToken<int>(
      token,
      brand: kBrand,
      brandDark: kBrandDark,
      success: kSuccess,
      danger: kDanger,
      warnText: kWarnText,
      inkLight: kInkLight,
      mutedLight: kMutedLight,
    );

void _eq(int? got, int? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // 7 ה-tokens המוכרים — כל אחד לפיגמנט-האמת שלו (עוגנים :256-269).
  _eq(_resolve('brand'), kBrand, '1 brand');
  n++;
  _eq(_resolve('brandDark'), kBrandDark, '2 brandDark');
  n++;
  _eq(_resolve('success'), kSuccess, '3 success');
  n++;
  _eq(_resolve('danger'), kDanger, '4 danger');
  n++;
  _eq(_resolve('warn'), kWarnText, '5 warn⇒warnText (לא warnBright)');
  n++;
  _eq(_resolve('ink'), kInkLight, '6 ink⇒inkLight');
  n++;
  _eq(_resolve('muted'), kMutedLight, '7 muted⇒mutedLight');
  n++;

  // default ⇒ null (עוגן :270-271).
  _eq(_resolve(null), null, '8 null-token');
  n++;
  _eq(_resolve(''), null, '9 empty');
  n++;
  _eq(_resolve('#FF7A18'), null, '10 raw-hex never resolves');
  n++;
  _eq(_resolve('Brand'), null, '11 case-sensitive');
  n++;
  _eq(_resolve('warnText'), null, '12 field-name is not a token');
  n++;
  _eq(_resolve(' brand'), null, '13 no trimming');
  n++;

  assert(_resolve('brand') == kBrand, 'assert-live guard');

  print('OK colorForToken: $n asserts passed');
}
