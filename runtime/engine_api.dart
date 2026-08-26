// 🌉 גשר-המנוע · חושף את האטומים האמיתיים ל-JS (רנטיים-web).
// מקמפל דרך `dart compile js` — הקוד שרץ בדפדפן הוא **בדיוק** האטומים שפורקו,
// אפס שכתוב. גבול-פרימיטיבים: engineCall(fn, argsJson) → resultJson.
// הדאטה מוזרקת מבחוץ (הלקוח) — המנועים נשארים נקיים (אפס-דאטה).
import 'dart:convert';
import 'dart:js' as js;

import '../new/dart/can_connect.dart';
import '../new/dart/estimate_price.dart';
import '../new/dart/invoice_vat_of.dart' as inv;

Object? _dispatch(String fn, Map<String, dynamic> a) {
  switch (fn) {
    // 🔧 בנייה-חכמה · האם שני מוצרים מתחברים (can_connect האמיתי)
    case 'canConnect':
      final r = canConnect(
        ConnPart(
            sku: a['a']['sku'],
            connectionSizes: List<String>.from(a['a']['sizes'] ?? const [])),
        ConnPart(
            sku: a['b']['sku'],
            connectionSizes: List<String>.from(a['b']['sizes'] ?? const [])),
      );
      return {'ok': r};

    // 🔧 בנייה-חכמה · אמדן-מחיר (estimate_price האמיתי; טבלה+fallback מוזרקים ע"י הלקוח)
    case 'estimatePrice':
      final cats = List<String>.from(a['cats'] ?? const []);
      final table = Map<String, int>.from(
          (a['table'] as Map).map((k, v) => MapEntry(k as String, (v as num).toInt())));
      final e = estimatePrice<String>(cats,
          categoryHe: (c) => c,
          priceTable: table,
          fallbackIls: (a['fallback'] as num).toInt());
      return {'total': e.totalILS, 'count': e.itemCount, 'low': e.lowConfidence};

    // 🧾 בנייה-חכמה · מע"מ (invoice_vat_of האמיתי; השיעור מוזרק — דאטה של הלקוח)
    case 'invoiceVat':
      return {
        'vat': inv.invoiceVatOf((a['gross'] as num).toInt(),
            vatRate: (a['rate'] as num?)?.toDouble() ?? 0.17)
      };
  }
  return {'error': 'unknown fn: $fn'};
}

void main() {
  js.context['engineCall'] = js.allowInterop((String fn, String argsJson) {
    try {
      final a = argsJson.isEmpty
          ? <String, dynamic>{}
          : jsonDecode(argsJson) as Map<String, dynamic>;
      return jsonEncode(_dispatch(fn, a));
    } catch (e) {
      return jsonEncode({'error': e.toString()});
    }
  });
  // סימון-מוכנות לרנטיים
  if (js.context.hasProperty('__engineReady')) {
    js.context.callMethod('__engineReady', const []);
  }
}
