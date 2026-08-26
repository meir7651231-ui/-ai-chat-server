// בדיקת-אטום · projectQuoteText — מוכיחה בדיוק את דוגמאות project_quote_text.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/project_quote_text_test.dart ⇒ exit 0 + "projectQuoteText OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'project_quote_text.dart';

void main() {
  final items = const [
    QuoteLineItem(location: 'מטבח', brandName: 'מותג-א', sku: 'S1', qty: 2),
    QuoteLineItem(location: 'אמבטיה', brandName: 'מותג-ב', sku: 'S2', qty: 1),
  ];
  int? price(String sku) => sku == 'S1' ? 100 : null;

  // #1 — S1=100×2=200 · S2=null⇒0 · total=200.
  assert(projectQuoteText('דירה 4', items, unitPriceOf: price) ==
      'הצעת מחיר — פרויקט "דירה 4"\n• מטבח: מותג-א ×2 — ~₪200\n'
          '• אמבטיה: מותג-ב ×1 — ~₪0\nסה"כ משוער: ~₪200\n— נוצר ב-BuildSmart');

  // #2 — items ריק ⇒ total=0, כותרת+סה"כ+חתימה בלבד.
  assert(projectQuoteText('ריק', const []) ==
      'הצעת מחיר — פרויקט "ריק"\nסה"כ משוער: ~₪0\n— נוצר ב-BuildSmart');

  // #3 — sku ללא-מחיר (null) · qty=3 ⇒ sub=0.
  assert(projectQuoteText('פ', const [
        QuoteLineItem(location: 'גינה', brandName: 'מ', sku: 'X', qty: 3),
      ]) ==
      'הצעת מחיר — פרויקט "פ"\n• גינה: מ ×3 — ~₪0\nסה"כ משוער: ~₪0\n— נוצר ב-BuildSmart');

  // #4 — brandName socket ⇒ שורת-סיום מותאמת.
  assert(projectQuoteText('ריק', const [], brandName: 'BuildMax') ==
      'הצעת מחיר — פרויקט "ריק"\nסה"כ משוער: ~₪0\n— נוצר ב-BuildMax');

  print('projectQuoteText OK — 4/4 contract examples proven');
}
