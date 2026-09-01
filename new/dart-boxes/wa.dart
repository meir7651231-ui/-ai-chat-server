// 📦 קופסת-חיבורים · wa (וואטסאפ) — מחווטת 7 אטומי-Dart. מקבילה ל-new/boxes/wa.mjs.
// חוזה משותף: new/boxes/wa.contract.md. מקור-האמת: maor/src/lib/wa.ts + lib/templates.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// דבקי-החיווט (orgOf/נפילת-שם · wiredRender/הזרקת-TEMPLATE_DEFS) = ידע-קופסה (חוק-5),
// לא אטומים. הנוסחים עצמם (TEMPLATE_DEFS) הם דאטת-חיווט המוזרקת לשקע-defs של
// renderTemplate — בדיוק כמו ב-wa.mjs.
//
// ⚠️ גבול-פלטפורמה (חוק-6): הקופסה טהורה לגמרי — פתיחת-הקישור בדפדפן/אפליקציה = שקע
//   של לוח-האם, לא כאן. מה שמוכח כאן = בניית-הספרות/הקישור/הנוסחים, חוצה-שפות זהה-ביט.
import '../dart-data-maor/wa-delivery-text-sockets.dart' as skb_wa_delivery_text;
import '../dart-maor/wa-digits.dart' as dig;
import '../dart-maor/wa-link.dart' as lnk;
import '../dart-maor/wa-delivery-text.dart' as del;
import '../dart-maor/wa-payment-text.dart' as pay;
import '../dart-maor/wa-birthday-text.dart' as bd;
import '../dart-maor/render-template.dart' as rt;
import '../dart-maor/template-defs.dart' as td;

// ── מילון-הקופסה (הכרעות — נוסח-המקור verbatim) ─────────────────────────────
// הכרעה 1: שם-ארגון ריק/רווחים ⇒ 'העמותה' (wa.ts:47-49).
const String ORG_FALLBACK = 'העמותה';

// ── מילוי-שקע: נוסחי-ברירת-המחדל = TEMPLATE_DEFS (templates.ts:19-52) מוצמצמים ל-key/def.
//   renderTemplate האטומי קורא רק 'key' ו-'def' — זו דאטת-החיווט (חוק-5).
final List<Map<String, String>> _defs = [
  for (final d in td.templateDefs)
    {'key': d['key'] as String, 'def': d['def'] as String},
];

// ── עוזר: trim נאמן-ל-JS (String.prototype.trim = קבוצת-ES; חוק-16) ──────────
// U+0085 (NEL) ו-U+180E נשארים בכוונה — Dart.trim היה גוזם אותם.
const Set<int> _esWsCodes = {
  0x0009, 0x000A, 0x000B, 0x000C, 0x000D, 0x0020, 0x00A0, 0x1680,
  0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007,
  0x2008, 0x2009, 0x200A, 0x2028, 0x2029, 0x202F, 0x205F, 0x3000,
  0xFEFF,
};
String _jsTrim(String s) {
  var start = 0, end = s.length;
  while (start < end && _esWsCodes.contains(s.codeUnitAt(start))) start++;
  while (end > start && _esWsCodes.contains(s.codeUnitAt(end - 1))) end--;
  return s.substring(start, end);
}

// ── החיווט ──────────────────────────────────────────────────────────────────
// orgOf היה helper פנימי ב-wa.ts:47-49 — התפקיד (נפילת-שם) חי בקופסה, לא באטום (חוק-5).
// JS: `orgName.trim() || ORG_FALLBACK` — trim ריק (falsy) ⇒ הנפילה.
dynamic _orgOf(dynamic orgName) {
  final t = _jsTrim(orgName as String);
  return t.isEmpty ? ORG_FALLBACK : t;
}

// הכרעה 2: wiredRender = (cfg,key,vars) => renderTemplate(cfg,key,vars,TEMPLATE_DEFS).
// חתימה תואמת בדיוק לשקע-הפונקציה של wa-birthday-text.dart:
//   `dynamic Function(dynamic, String, Map<String, dynamic>)`.
// גישור-טיפוס: cfg(dynamic)→Map<String,dynamic>? · vars(dynamic-ערכים)→Map<String,String>
//   (renderTemplate האטומי דורש Map<String,String>; ב-JS ה-join מקודד-מחרוזת ממילא).
dynamic _wiredRender(dynamic cfg, String key, Map<String, dynamic> vars) {
  final Map<String, dynamic>? c =
      cfg == null ? null : (cfg as Map).cast<String, dynamic>();
  final sv = <String, String>{};
  vars.forEach((k, v) => sv[k] = v is String ? v : '$v');
  return rt.renderTemplate(c, key, sv, _defs);
}

// ── החשיפה (הממשק של lib/wa.ts, אחד-לאחד — L4) ──────────────────────────────
/// ספרות-בינלאומי מטלפון שמור: '050-123-4567' → '972501234567'; לא-תקין ⇒ null.
dynamic waDigits(dynamic phone) => dig.waDigits(phone);

/// קישור פתיחת-שיחה: https://wa.me/<digits>[?text=…]. בלי מספר תקין ⇒ null.
dynamic waLink(dynamic phone, [dynamic text = '']) =>
    lnk.waLink(phone, text, dig.waDigits);

/// הודעת-מסירה (חלוקה): נשלחת למשפחה כשהמשלוח יוצא/בדרך.
dynamic waDeliveryText(dynamic orgName, dynamic famName, [dynamic cfg]) =>
    del.waDeliveryText(orgName, famName, cfg, _wiredRender, _orgOf, skb_wa_delivery_text.waDeliveryText_T);

/// תזכורת-תשלום ידידותית (חוגים): שם-הפריט + היתרה (₪, מעוגל, he-IL).
dynamic waPaymentText(dynamic orgName, dynamic what, dynamic balance,
        [dynamic cfg]) =>
    pay.waPaymentText(orgName, what, balance, cfg, _wiredRender, _orgOf);

/// ברכת יום-הולדת לחוגג/ת.
dynamic waBirthdayText(dynamic orgName, dynamic firstName, [dynamic cfg]) =>
    bd.waBirthdayText(orgName, firstName, cfg, _wiredRender, _orgOf);
