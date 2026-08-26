// 📦 קופסת-חיבורים · telephony (Dart) — מחווטת 6 אטומי-Dart. מקבילה ל-new/boxes/telephony.mjs.
// חוזה משותף: new/boxes/telephony.contract.md. אותם 6 חוטים, אותה הכרעת-חיווט חיה-בקופסה.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותו fixture ⇒ אותו JSON.
// אף אטום לא מייבא אטום (חוק-1/2); כל הכריכה — כולל מתאמי-הטיפוס ל-Dart — חיה כאן בלבד.
//
// ההכרעה החיה (כמו ב-JS): החוט telephonyToTenant (בבעלות הקופסה) מוזרק לשקע-ההמרה של
// preview/explain. שאר השקעים (מנוע-הטלפוניה + anchorToday התלוי-Date) נשארים מוזרקים
// ע"י הצרכן דרך אובייקט io (כאן Map<String,dynamic>).
import '../dart-maor/empty-telephony-config.dart' as etc;
import '../dart-maor/to-tenant-id.dart' as tti;
import '../dart-maor/telephony-to-tenant.dart' as t2t;
import '../dart-maor/preview-telephony.dart' as pt;
import '../dart-maor/next-closure.dart' as nc;
import '../dart-maor/explain-one.dart' as eo;

// ── החשיפה: חוטים טהורים (בלי שקע) עוברים כלשונם ──
Map<String, dynamic> emptyTelephonyConfig() => etc.emptyTelephonyConfig();
dynamic toTenantId(dynamic slug, dynamic orgName) => tti.toTenantId(slug, orgName);
Map<String, dynamic> telephonyToTenant(
        dynamic tc, dynamic orgName, dynamic tenantId) =>
    t2t.telephonyToTenant(tc, orgName, tenantId);

// ── מתאם-טיפוס: שקע-ההמרה של preview דורש חתימה טיפוסית קשיחה; הקופסה עוטפת
//    את חוט-telephonyToTenant-שלה לתוכו (ההכרעה החיה). ──
dynamic _t2tSocket(Map<String, dynamic> tc, String orgName, String tenantId) =>
    t2t.telephonyToTenant(tc, orgName, tenantId);

// ── החיווט (ההכרעות החיות בקופסה) ──

/// תצוגה-מקדימה חיה. io = {anchorToday, validateTenant, buildTenant, explainCall, trustReport}.
/// הקופסה מספקת את החוט-שלה telephonyToTenant לשקע; שאר השקעים מוזרקים דרך io.
Map<String, dynamic> previewTelephony(
    Map<String, dynamic> tc, String orgName, String tenantId, Map<String, dynamic> io) {
  return pt.previewTelephony(
    tc, orgName, tenantId,
    _t2tSocket, // ← חוט-הקופסה ממלא את שקע-ההמרה
    io['anchorToday'] as String Function(),
    io['validateTenant'] as Map<String, dynamic> Function(dynamic),
    io['buildTenant'] as Map<String, dynamic> Function(dynamic, Map<String, dynamic>),
    io['explainCall'] as Map<String, dynamic> Function(
        dynamic, Map<String, dynamic>, Map<String, dynamic>),
    io['trustReport'] as Map<String, dynamic> Function(dynamic),
  );
}

/// תיאור-שיחה יחיד. io = {anchorToday, validateTenant, explainCall}.
/// שקעי-explainOne דינמיים במקור ⇒ חוט-הקופסה ושקעי-io מוזרקים כמו-שהם.
Map<String, dynamic> explainOne(
    dynamic tc, dynamic orgName, dynamic tenantId, dynamic call, Map<String, dynamic> io) {
  return eo.explainOne(
    tc, orgName, tenantId, call,
    telephonyToTenant, // ← אותו חוט-הקופסה לשקע-ההמרה
    io['validateTenant'],
    io['explainCall'],
    io['anchorToday'],
  );
}

/// הסגירה ההלכתית הבאה (ווידג'ט-בית). io = {hebrewClosedWindows, CITIES}.
Map<String, dynamic>? nextClosure(
    Map<String, dynamic> config, String todayIso, Map<String, dynamic> io) {
  return nc.nextClosure(
    config, todayIso,
    io['hebrewClosedWindows']
        as List Function(String, int, Map<String, dynamic>, Map<String, dynamic>),
    io['CITIES'] as Map<String, dynamic>,
  );
}
