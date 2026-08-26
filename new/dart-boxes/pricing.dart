// 📦 קופסת-חיבורים · תמחור (Dart) — מחווטת 6 אטומי-Dart. מקבילה ל-new/boxes/pricing.mjs.
// חוזה משותף: new/boxes/pricing.contract.md. מקור-האמת: maor/src/lib/pricing.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// שקעי-IO (localStorage) מוזרקים כפרמטרים פר-פלטפורמה (חוק-6); מילון-מחירי-ההרחבות
// ומפתח-האחסון = הכרעות-קופסה verbatim (חוק-5).
import 'dart:convert';
import '../dart-maor/default-prices.dart' as dp;
import '../dart-maor/size-labels.dart' as sl;
import '../dart-maor/normalize-prices.dart' as np;
import '../dart-maor/compute-quote.dart' as cq;
import '../dart-maor/shekel.dart' as sh;
import '../dart-maor/all-modules.dart' as am;

// ── שקעי-הכרעה (מילון-הקופסה — נתון-בעלים עריך, verbatim מהמקור) ───────────────
const Map<String, dynamic> _defaultIntegrationPrices = {
  'receipts': 60, 'payments': 90, 'whatsapp': 50, 'sms': 40, 'phone': 90, 'gcal': 30,
  'drive': 30, 'sheets': 40, 'maps': 40, 'esign': 60, 'ai': 120, 'campaign': 60,
};
const String _pricesLsKey = 'maor_prices';

// ── החיווט ──────────────────────────────────────────────────────────────────
final Map<String, dynamic> DEFAULT_PRICES = dp.defaultPrices(_defaultIntegrationPrices); // ignore: non_constant_identifier_names
Map<String, String> get sizeLabels => sl.sizeLabels;
String shekel(Object? n) => sh.shekel(n);

Map<String, dynamic> normalize(dynamic raw) =>
    np.normalizePrices(raw, am.allModules, DEFAULT_PRICES, _defaultIntegrationPrices);

Map<String, dynamic> quote(
  Map<String, dynamic> cfg,
  String size,
  Map<String, dynamic> prices,
  String Function(String) nameOf, [
  List<Map<String, dynamic>> addons = const [],
  String mode = 'subscription',
]) =>
    cq.computeQuote(cfg, size, prices, nameOf, am.allModules, addons, mode);

// ── שקעי-IO (localStorage — מוזרקים, לא ממומשים בקופסה) ───────────────────────
Map<String, dynamic> readPrices(String? Function(String) getItem) {
  try {
    final raw = getItem(_pricesLsKey);
    return raw != null && raw.isNotEmpty
        ? normalize(jsonDecode(raw))
        : Map<String, dynamic>.from(DEFAULT_PRICES);
  } catch (_) {
    return Map<String, dynamic>.from(DEFAULT_PRICES);
  }
}

void writePrices(void Function(String, String) setItem, Map<String, dynamic> p) {
  try {
    setItem(_pricesLsKey, jsonEncode(p));
  } catch (_) {
    /* localStorage חסום — המחירים יחזיקו עד רענון */
  }
}
