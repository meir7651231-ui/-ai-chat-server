// בדיקת-אטום · quoteTextFor — מוכיחה בדיוק את דוגמאות quote_text_for.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/quote_text_for_test.dart ⇒ exit 0 + "quoteTextFor OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'quote_text_for.dart';

void main() {
  final sp = const QuoteProduct(name: 'סיפון', brands: [
    QuoteBrand(name: 'מותג-א', price: 100, rec: true),
    QuoteBrand(name: 'מותג-ב', price: 200),
  ]);
  String link(int i) => 'LINK$i';

  // #1 — cost מלא (accessories>0, labour=0) ⇒ מוצר+אביזרים+סה"כ, בלי עבודה.
  assert(quoteTextFor(sp, 0,
          lineCostEstimate: (i) =>
              (product: 50, accessories: 20, labour: 0, total: 70),
          deepLink: link) ==
      'הצעת מחיר — סיפון\nמותג: מותג-א\nמוצר: ~₪50\nאביזרים: ~₪20\n'
          'סה"כ משוער: ~₪70\n🔗 LINK0\n— נוצר ב-BuildSmart');

  // #2 — brandIndex=-1 מחוץ-לטווח ⇒ recBrand (idx=0); cost=null ⇒ b.price.
  assert(quoteTextFor(sp, -1, deepLink: link) ==
      'הצעת מחיר — סיפון\nמותג: מותג-א\nמחיר: ~₪100\n🔗 LINK0\n— נוצר ב-BuildSmart');

  // #3 — accessories=0 מדלג, labour>0 נכתב.
  assert(quoteTextFor(sp, 0,
          lineCostEstimate: (i) =>
              (product: 50, accessories: 0, labour: 30, total: 80),
          deepLink: link) ==
      'הצעת מחיר — סיפון\nמותג: מותג-א\nמוצר: ~₪50\nעבודה (משוער): ~₪30\n'
          'סה"כ משוער: ~₪80\n🔗 LINK0\n— נוצר ב-BuildSmart');

  // #4 — cost=null וגם price=null ⇒ אין שורת-מחיר כלל.
  final spNoPrice = const QuoteProduct(name: 'סיפון', brands: [
    QuoteBrand(name: 'ב-ללא-מחיר', rec: true),
  ]);
  assert(quoteTextFor(spNoPrice, 0, deepLink: link) ==
      'הצעת מחיר — סיפון\nמותג: ב-ללא-מחיר\n🔗 LINK0\n— נוצר ב-BuildSmart');

  // #5 — brandName socket ⇒ שורת-סיום מותאמת.
  assert(quoteTextFor(sp, -1, deepLink: link, brandName: 'BuildMax') ==
      'הצעת מחיר — סיפון\nמותג: מותג-א\nמחיר: ~₪100\n🔗 LINK0\n— נוצר ב-BuildMax');

  print('quoteTextFor OK — 5/5 contract examples proven');
}
