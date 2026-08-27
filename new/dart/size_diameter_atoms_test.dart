// בדיקת-אטום · sizeDiameterAtoms
import 'size_diameter_atoms.dart';

void main() {
  // פיצול × → שני קטרים
  final a = sizeDiameterAtoms('16×1/2"');
  assert(a.length == 2 && a[0] == '16' && a[1] == '1/2"', 'a=$a');

  // chunk יחיד (i==0) — נשמר כמו-שהוא
  assert(sizeDiameterAtoms('DN50').join('|') == 'DN50');

  // זנב-מספרי אחרי chunk ראשון → אטום-אורך ס"מ
  final b = sizeDiameterAtoms('DN50 200');
  assert(b.length == 2 && b[0] == 'DN50' && b[1] == '200 ס"מ', 'b=$b');

  // x לטיני מפצל בדיוק כמו × + dedup דרך Set
  assert(sizeDiameterAtoms('50x50').join('|') == '50', 'dedup');

  // נרמול ½ → /2 ב-chunk ראשון
  assert(sizeDiameterAtoms('1½"').join('|') == '1/2"');

  print('sizeDiameterAtoms OK');
}
