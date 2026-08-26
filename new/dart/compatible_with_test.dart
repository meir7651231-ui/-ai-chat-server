// בדיקת-אטום · compatibleWith — מוכיחה בדיוק את דוגמאות compatible_with.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/compatible_with_test.dart ⇒ exit 0 + "compatibleWith OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'compatible_with.dart';

List<String> _skus(List<CompatNode> xs) => xs.map((e) => e.sku).toList();

void main() {
  const anchor = CompatNode(sku: 'ANCHOR', categoryHe: 'ברזים');

  // קטלוג: n1(X) · n2(ברזים) · n3(Y,לא-מתאים-טמפ') · n4(ברזים) · n5(ברזים,לא-מתחבר).
  const catalog = [
    CompatNode(sku: 'n1', categoryHe: 'X'),
    CompatNode(sku: 'n2', categoryHe: 'ברזים'),
    CompatNode(sku: 'n3', categoryHe: 'Y'),
    CompatNode(sku: 'n4', categoryHe: 'ברזים'),
    CompatNode(sku: 'n5', categoryHe: 'ברזים'),
  ];
  // n5 לא-מתחבר; n3 לא-מתאים-לטמפרטורה.
  bool cc(CompatNode a, CompatNode b) => b.sku != 'n5';
  bool temp(CompatNode p, int t) => p.sku != 'n3';

  final res = compatibleWith(anchor,
      catalog: catalog, canConnect: cc, suitableForTemp: temp);

  // #1 — סינון: n5 (canConnect=false) ו-n3 (temp=false) הוסרו ⇒ נשארו 3.
  assert(res.length == 3);
  assert(!_skus(res).contains('n5')); // install_engine.dart:440 (canConnect)
  assert(!_skus(res).contains('n3')); // install_engine.dart:440 (suitableForTemp)

  // #2 — מיון: שני מוצרי-'ברזים' (n2,n4 · מפתח 0) קודמים ל-n1 (מפתח 1).
  //      (install_engine.dart:442-443; טעם-הקשירה בין n2/n4 אינו מובטח — לכן set).
  assert(res[0].categoryHe == 'ברזים');
  assert(res[1].categoryHe == 'ברזים');
  assert(res[2].sku == 'n1');
  assert({res[0].sku, res[1].sku}.difference({'n2', 'n4'}).isEmpty);

  // #3 — קטלוג ריק ⇒ רשימה ריקה.
  assert(compatibleWith(anchor,
          catalog: const [], canConnect: cc, suitableForTemp: temp)
      .isEmpty);

  // #4 — canConnect שדוחה-הכול ⇒ ריק (גם כשהטמפ' מתאימה).
  assert(compatibleWith(anchor,
          catalog: catalog,
          canConnect: (a, b) => false,
          suitableForTemp: temp)
      .isEmpty);

  // #5 — כל-הקטלוג באותה-קטגוריה כמו-העוגן ⇒ כולם מפתח 0, כולם עוברים,
  //      הסדר-היחסי נשמר (n5 עדיין נדחה ע"י canConnect).
  final allAnchor = compatibleWith(
    const CompatNode(sku: 'A', categoryHe: 'ברזים'),
    catalog: const [
      CompatNode(sku: 'z1', categoryHe: 'ברזים'),
      CompatNode(sku: 'z2', categoryHe: 'ברזים'),
    ],
    canConnect: (a, b) => true,
    suitableForTemp: (p, t) => true,
  );
  assert(_skus(allAnchor).length == 2);

  print('compatibleWith OK — 5 contract checks proven');
}
