import 'collapse_key_of.dart';

// stub-אמת: מפתח-קיפול = קיפול רווחים ל-רווח-יחיד ואז lowercase.
String collapseKey(String p) => p.replaceAll(RegExp(r'\s+'), ' ').trim().toLowerCase();

void main() {
  assert(collapseKeyOf('  Ball   Valve ', collapseKey: collapseKey) == 'ball valve');
  assert(collapseKeyOf('ABC', collapseKey: collapseKey) == 'abc');
  // מעביר-דרך: המזהה חוזר כפי-שהשקע מחזיר.
  assert(collapseKeyOf<int>(42, collapseKey: (n) => 'k$n') == 'k42');
  print('collapseKeyOf OK');
}
