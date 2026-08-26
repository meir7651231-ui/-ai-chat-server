// 📦 קופסת-חיבורים · חשבון-המייל (smtp-url · Dart) — מחווטת 3 אטומי-Dart.
// מקבילה ל-new/boxes/smtp-url.mjs. חוזה משותף: new/boxes/smtp-url.contract.md.
// מקור-האמת: maor/src/lib/smtpUrl.ts + החיווט בטופס OrgSecretsSection.tsx.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// שקעי-IO (writeOrgSecrets · toast · שדות-הטופס) = לוח-האם; הקופסה טהורה.
import '../dart-maor/smtp-hosts.dart' as sh;
import '../dart-maor/smtp-host-for.dart' as shf;
import '../dart-maor/compose-smtp-url.dart' as csu;

// ── מילון-הקופסה (נוסח-המקור verbatim — OrgSecretsSection.tsx:66-67) ──────────
const String MSG_MISSING_FIELDS = 'מייל: מלאו גם כתובת וגם סיסמת-אפליקציה';
const String MSG_UNKNOWN_PROVIDER = 'מייל: הספק לא מוכר — מלאו את שדה שרת-היציאה (host:port)';

// ── מתאם-טיפוס: String(v ?? '') של JS (null/undefined ⇒ '') ───────────────────
String _jsStr(dynamic v) => v == null ? '' : v.toString();

/// דומייני-הספקים המוכרים — לרמז-UI ("ספק מוכר ⇒ אין צורך בשדה-שרת").
/// Object.keys(SMTP_HOSTS) — סדר-ההכנסה נשמר (const map literal ≡ סדר-מפתחות-JS).
final List<String> KNOWN_SMTP_DOMAINS = sh.smtpHosts.keys.toList(); // ignore: non_constant_identifier_names

/// זיהוי-חי בזמן-הקלדה (המקור: knownHost, שורה 45). '' = ספק לא-מוכר.
String detectSmtpHost(dynamic email) => shf.smtpHostFor(_jsStr(email)) as String;

/// ── החיווט ──
/// מייל+סיסמה (+שרת-ידני לספק לא-מוכר) ⇒ רשומת-חשבון אחת:
///   {state:'empty'}                 — שני השדות ריקים: אין מה לשמור (שער-הדילוג)
///   {state:'error', message}        — נוסח-המקור, לפי קיום-שרת
///   {state:'ok', url, host, known}  — url = מה שנשמר כ-patch.smtpUrl
Map<String, dynamic> buildSmtpAccount({dynamic email, dynamic password, dynamic manualHost}) {
  final em = _jsStr(email);
  final pw = _jsStr(password);
  final mh = _jsStr(manualHost);
  if (em.trim().isEmpty && pw.trim().isEmpty) return {'state': 'empty'};
  final knownHost = shf.smtpHostFor(em) as String; // הכרעה 2: ספק-מוכר גובר על השדה-הידני
  // knownHost || mh — '' של JS falsy ⇒ mh; אחרת knownHost.
  final hostSel = knownHost.isNotEmpty ? knownHost : mh;
  final url = csu.composeSmtpUrl(em, pw, hostSel);
  if (url == null) {
    // הכרעה 3: הבורר בין ההודעות = קיום-שרת לא-מקוצץ (knownHost || mh), כמו במקור
    final hasHost = knownHost.isNotEmpty || mh.isNotEmpty;
    return {'state': 'error', 'message': hasHost ? MSG_MISSING_FIELDS : MSG_UNKNOWN_PROVIDER};
  }
  return {'state': 'ok', 'url': url, 'host': hostSel.trim(), 'known': knownHost.isNotEmpty};
}
