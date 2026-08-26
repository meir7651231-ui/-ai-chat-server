import '../dart-data/directional_context-terms.dart';
// בדיקת-חוזה · directionalContext — מייבאת אך ורק את האטום-שלה (חוק-4).
// DoD (דיבר-12): dart run --enable-asserts new/dart/directional_context_test.dart ⇒ exit 0.
import 'directional_context.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(directionalContext(['ברז', 'שסתום', 'משאבה'], 1, term: (k)=>kTerms[k]!),
      'בין "ברז" ל-"משאבה"', '1 between'); n++;
  _eq(directionalContext(['שסתום', 'משאבה'], 0, term: (k)=>kTerms[k]!),
      'בכניסת הקו (לפני "משאבה")', '2 head'); n++;
  _eq(directionalContext(['ברז', 'שסתום'], 1, term: (k)=>kTerms[k]!),
      'ביציאת הקו (אחרי "ברז")', '3 tail'); n++;
  _eq(directionalContext(['שסתום'], 0, term: (k)=>kTerms[k]!), 'בקו', '4 lone'); n++;

  assert(directionalContext(['שסתום'], 0, term: (k)=>kTerms[k]!) == 'בקו', 'assert-live guard');
  print('OK directionalContext: $n asserts passed');
}
