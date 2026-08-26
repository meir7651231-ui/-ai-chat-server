// בדיקת-אטום · swapMatesWithNeighbours — מוכיחה בדיוק את swap_mates_with_neighbours.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/swap_mates_with_neighbours_test.dart ⇒ exit 0.
// מייבאת אך-ורק את האטום-שלה (חוק-4). P=String (skuOf=זהות) — שרשרת-ה-sku ישירות.
import 'swap_mates_with_neighbours.dart';

// שקע specExists: אלו ה-sku-ים בעלי spec-מאומת.
const _withSpec = {'CAND', 'L', 'R', 'BAD'};
bool _specExists(String sku) => _withSpec.contains(sku);

// שקע compatible: תואם תמיד, אלא אם מעורב 'BAD' (זוג בלתי-תואם מפורש).
bool _compatible(String a, String b) => a != 'BAD' && b != 'BAD';

bool _run(List<String> chain, int idx, String cand) =>
    swapMatesWithNeighbours<String>(
      chain,
      idx,
      cand,
      skuOf: (s) => s,
      specExists: _specExists,
      compatible: _compatible,
    );

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  // #1 — למועמד אין spec ⇒ false מיידי (מקור:257-258), בלי בדיקת-שכנים.
  _eq(_run(['L', 'MID', 'R'], 1, 'NOSPEC'), false, '1 candidate no-spec');
  n++;

  // #2 — מועמד עם spec, שני שכנים (L,R) קיימים ותואמים ⇒ true.
  _eq(_run(['L', 'MID', 'R'], 1, 'CAND'), true, '2 both neighbours compat');
  n++;

  // #3 — שכן-שמאל ללא spec ⇒ מדולג (continue, מקור:262); ימין תואם ⇒ true.
  _eq(_run(['NOSPEC', 'MID', 'R'], 1, 'CAND'), true, '3 no-spec neighbour skipped');
  n++;

  // #4 — שכן-שמאל 'BAD' (spec קיים) בלתי-תואם ⇒ false (מקור:263).
  _eq(_run(['BAD', 'MID', 'R'], 1, 'CAND'), false, '4 incompatible neighbour');
  n++;

  // #5 — idx בקצה-שמאל (idx-1=-1 מדולג, מקור:260); ימין תואם ⇒ true.
  _eq(_run(['SLOT', 'R'], 0, 'CAND'), true, '5 left edge, right compat');
  n++;

  // #6 — idx בקצה-ימין (idx+1=len מדולג); שמאל 'BAD' בלתי-תואם ⇒ false.
  _eq(_run(['BAD', 'SLOT'], 1, 'CAND'), false, '6 right edge, left incompat');
  n++;

  // #7 — שרשרת בת-איבר-אחד, אין שכנים בטווח ⇒ true (המועמד עם spec).
  _eq(_run(['SLOT'], 0, 'CAND'), true, '7 single element, no neighbours');
  n++;

  assert(_run(['L', 'MID', 'R'], 1, 'CAND'), 'assert-live');

  print('OK swapMatesWithNeighbours: $n asserts passed');
}
