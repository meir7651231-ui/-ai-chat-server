// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · invoiceVatOf — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/invoice.dart:19-44 (26 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): buildInvoiceRows, formatNis
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int invoiceVatOf(int grossTotal) =>
    grossTotal - (grossTotal / (1 + kVatRate)).round();

/// שורות-ההדפסה לחשבונית/קבלה מ-[order]. פריטי-השורה מידעיים; הסה"כ הסמכותי
/// הוא order.sum (מה שחויב) עם מע"מ כחלק המחולץ-לאחור.
List<({String label, String value})> buildInvoiceRows(Order order) {
  final rows = <({String label, String value})>[
    (label: 'מספר הזמנה', value: order.id),
    (label: 'לקוח', value: order.who),
  ];
  if (order.site.isNotEmpty) {
    rows.add((label: 'אתר', value: order.site));
  }
  for (final l in order.lines) {
    final head = l.emoji.isEmpty ? l.name : '${l.emoji} ${l.name}';
    rows.add((label: '$head × ${l.qty}', value: formatNis(l.price)));
  }
  rows.add((label: 'סה"כ לתשלום (כולל מע"מ)', value: formatNis(order.sum)));
  rows.add((
    label: 'מזה מע"מ ${(kVatRate * 100).round()}%',
    value: formatNis(invoiceVatOf(order.sum)),
  ));
  return rows;
}

/// כותרת-המסמך לחשבונית (receipt=false) או קבלה (receipt=true) של הזמנה.
