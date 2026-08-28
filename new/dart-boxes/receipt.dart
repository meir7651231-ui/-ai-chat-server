import '../dart-data-maor/gematria-terms.dart' as td_gematria;
// 📦 קופסת-חיבורים · receipt (Dart) — מחווטת 12 אטומי-Dart. מקבילה ל-new/boxes/receipt.mjs.
// חוזה משותף: new/boxes/receipt.contract.md · מקור-האמת (L4): maor/src/lib/receipt.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// דבקי-החיווט (hebDateFull/hebrewLocaleDate/featureOn/NAV_MODULE_KEYS + מתאמי-שקע) =
// ידע-קופסה (חוק-5), לא אטומים. קופסה מייבאת אך-ורק אטומים; קופסה לא מייבאת קופסה.
//
// ── ההכרעות שחיות כאן (חיווט, לא אטום) — כמו במקור-ה-JS ──
// · hebDateFull — שכן-מודול (lib/hebrew) מחווט מאטומים-בריאים בפנים (gem/gemYear/hebParts).
// · hebrewLocaleDate — עוזר-פנימי לא-מיוצא במקור: צהריים-מקומי (T12:00:00) ⇒ he-IL (d.m.yyyy);
//   תאריך-שבור ⇒ ה-ISO כמות-שהוא. חי כאן כתפר-חיווט.
// · NAV_MODULE_KEYS — תשעת מודולי-הניווט — שקע-מילון של feature-on.
// · BOM · שם-קובץ `receipt-${rid}.txt` · השהיות revoke=5000/frame=60000 · שער-ההרשאה לפני התוכן.
// · שקע-שכן amountInWords (⚠️ Diber 9 — עולם-שבור): ברירת-מחדל זורקת בבירור (רק ענף-§46 קורא לו);
//   לוח-האם מזריק את שכן hebrew-number. כשהאטומים יתוקנו — יוחלף בחיווט-אטומים כאן.
//
// io מודל מופשט (ReceiptIo/RcptEl) — מקביל לאובייקט-ה-io המוזרק ב-JS (document/Blob/URL/setTimeout):
// המקור-ה-JS מחווט DOM-של-דפדפן; ב-Dart אין DOM ⇒ io מופשט (חוק-3, שקע-מוזרק). הפלט-הטהור
// (receiptLines/receiptHtml/receiptFmtOf/receiptVerifyCode) הוא הליבה הזהה-ביט בין שתי המערכות.
import '../dart-maor/receipt-verify-code.dart' as rvc;
import '../dart-maor/receipt-lines.dart' as rl;
import '../dart-maor/receipt-html.dart' as rh;
import '../dart-maor/receipt-fmt-of.dart' as rfo;
import '../dart-maor/deliver-receipt.dart' as dr;
import '../dart-maor/heb-date-full.dart' as hdf;
import '../dart-maor/feature-on.dart' as fo;
import '../dart-maor/module-on.dart' as mo;
import '../dart-maor/gematria.dart' as gm;
import '../dart-maor/gem-year.dart' as gy;
import '../dart-maor/heb-parts.dart' as hp;
import '../dart-maor/guard-export.dart' as ge;

// ── io מופשט: מקביל לאובייקט-ה-io המוזרק ב-JS ─────────────────────────────────
/// חלון-iframe (contentWindow) — focus/print; ב-fake נשאר null (onload לא מופעל).
abstract class RcptWin {
  void focus();
  void print();
}

/// אלמנט-DOM מופשט שהקופסה יוצרת (a / iframe) — property-bag שהקופסה כותבת אליו,
/// בדיוק כמו האובייקט הפשוט שמחזיר io.document.createElement ב-JS.
class RcptEl {
  final String tag;
  final Map<String, String> style = {};
  String href = '';
  String download = '';
  String srcdoc = '';
  void Function()? onload;
  RcptWin? contentWindow;
  RcptEl(this.tag);
  void setAttribute(String k, String v) {}
  void click() {}
  void remove() {}
}

/// עולם-הצד-של-הדפדפן המוזרק (document/Blob/URL/setTimeout + שער-היציאה).
abstract class ReceiptIo {
  bool get exportBlocked;
  void Function()? get exportNotify;
  Object blob(List<String> parts, String type); // new io.Blob([text], {type})
  RcptEl createElement(String tag); // io.document.createElement
  void appendBody(RcptEl el); // io.document.body.appendChild
  String createObjectURL(Object blob); // io.URL.createObjectURL
  void revokeObjectURL(String href); // io.URL.revokeObjectURL
  void setTimeout(void Function() fn, int ms); // io.setTimeout
}

// ── חיווט: תאריך-עברי-מלא (gem/gemYear/hebParts שוקעו לתוך heb-date-full) ──────
String _gemYear(String y) => gy.gemYear(y, gm.gem);
String _hebDateFull(dynamic iso) =>
    hdf.hebDateFull(iso as String?, gm.gem, _gemYear, hp.hebParts);

// ── חיווט: הלועזי של קבלה — צהריים-מקומי, he-IL / d.m.yyyy (receipt.ts:59-62) ──
String _hebrewLocaleDate(dynamic iso) {
  final s = iso.toString();
  final head = s.length >= 10 ? s.substring(0, 10) : s; // slice(0,10)
  final m = RegExp(r'^(\d{4})-(\d{2})-(\d{2})$').firstMatch(head);
  if (m == null) return s; // isNaN ⇒ ה-ISO הגולמי כמות-שהוא
  final mo = int.parse(m.group(2)!);
  final d = int.parse(m.group(3)!);
  if (mo < 1 || mo > 12 || d < 1) return s;
  // DateTime מגלגל גלישת-יום בדיוק כמו new Date של V8 (כלל-4).
  final dt = DateTime(int.parse(m.group(1)!), mo, d, 12);
  return '${dt.day}.${dt.month}.${dt.year}';
}

// ── חיווט: חוזה-הדגלים — תשעת מודולי-הניווט + moduleOn שוקעו לתוך feature-on ──
const List<String> _navModuleKeys = [
  'families', 'courses', 'calendar', 'diary', 'supporters', 'reports', 'tzedaka', 'shop', 'shop7'
];
bool _featureOn(dynamic cfg, String key) =>
    fo.featureOn(cfg as Map<String, dynamic>, key, _navModuleKeys, mo.moduleOn);

// ── מתאם-שקע: receiptVerifyCode של receipt-lines (dynamic→טיפוסי-האטום) ────────
String _rvc(dynamic rid, dynamic amount, dynamic cur, dynamic date) =>
    rvc.receiptVerifyCode(rid.toString(), amount as num, cur as String?, date.toString());

// ── שקע-שכן amountInWords: ברירת-מחדל זורקת (רק ענף-§46 קורא לו; ראה כותרת) ────
String _amountInWordsMissing(dynamic amount, dynamic sym) => throw StateError(
    'receipt: שקע amountInWords לא סופק — אטום amount-in-words שבור (integerInWords/agorotPhrase) '
    'ו-agorot-phrase חסר; לוח-האם מזריק את שכן hebrew-number.');

// ── הכרעות-המסירה (receipt.ts:150-219) ────────────────────────────────────────
const String _bom = '﻿';
const int _revokeMs = 5000;
const int _frameMs = 60000;

// ── חיווט: שער-היציאה (guard-export atom; המצב מוזרק ב-io מלוח-האם) ────────────
bool _guardExport(ReceiptIo io) => ge.guardExport(io.exportBlocked, io.exportNotify);

// ── החשיפה: החוטים הטהורים ────────────────────────────────────────────────────
/// קוד-אימות FNV-1a לקבלה (XXX-XXX).
String receiptVerifyCode(String rid, num amount, String? currency, String date) =>
    rvc.receiptVerifyCode(rid, amount, currency, date);

/// שורות-הקבלה (טהור) — §46 / רגילה / אישור-חנות S-. amountInWords = שקע-שכן (ראה כותרת).
List<String> receiptLines(Map<String, dynamic> o,
        [String Function(dynamic amount, dynamic sym)? amountInWords]) =>
    rl.receiptLines(
        o, _hebDateFull, amountInWords ?? _amountInWordsMissing, _rvc, _hebrewLocaleDate);

/// הקבלה כ-HTML מוכן-להדפסה (טהור — מחרוזת בלבד); receiptLines מקור-האמת היחיד לתוכן.
String receiptHtml(Map<String, dynamic> o,
        [String Function(dynamic amount, dynamic sym)? amountInWords]) =>
    rh.receiptHtml(o, (x) => receiptLines(x, amountInWords));

/// הפורמט-האפקטיבי למסירה: הבחירה השמורה, רק כשדגל core.receipt.pdf דלוק.
dynamic receiptFmtOf(dynamic config, Map ui) => rfo.receiptFmtOf(config, ui, _featureOn);

// ── החשיפה: החוטים הלא-טהורים (io מוזרק) ──────────────────────────────────────
/// הורדת-קבלה כקובץ-טקסט (BOM + שורות ריקות מסוננות). שער-ההרשאה קודם לתוכן.
void downloadReceipt(Map<String, dynamic> o, ReceiptIo io,
    [String Function(dynamic amount, dynamic sym)? amountInWords]) {
  if (!_guardExport(io)) return; // 🔐 שער יציאת-מידע
  final text = _bom + receiptLines(o, amountInWords).where((x) => x != '').join('\n');
  final blob = io.blob([text], 'text/plain;charset=utf-8');
  final a = io.createElement('a');
  a.href = io.createObjectURL(blob);
  a.download = 'receipt-${o['rid']}.txt';
  a.click();
  io.setTimeout(() => io.revokeObjectURL(a.href), _revokeMs);
}

/// הדפסה/PDF דרך iframe נסתר (לא window.open — חוסמי-חלונות). שער-ההרשאה קודם.
void printReceipt(Map<String, dynamic> o, ReceiptIo io,
    [String Function(dynamic amount, dynamic sym)? amountInWords]) {
  if (!_guardExport(io)) return; // 🔐 שער יציאת-מידע
  final frame = io.createElement('iframe');
  frame.style['position'] = 'fixed';
  frame.style['insetInlineEnd'] = '-9999px';
  frame.style['width'] = '0';
  frame.style['height'] = '0';
  frame.setAttribute('aria-hidden', 'true');
  frame.srcdoc = receiptHtml(o, amountInWords);
  frame.onload = () {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } finally {
      io.setTimeout(() => frame.remove(), _frameMs);
    }
  };
  io.appendBody(frame);
}

/// מסירה לפי בחירת-הלקוח: 'pdf' ⇒ הדפסה; אחרת ⇒ קובץ-טקסט.
void deliverReceipt(Map<String, dynamic> o, dynamic fmt, ReceiptIo io,
    [String Function(dynamic amount, dynamic sym)? amountInWords]) {
  dr.deliverReceipt(
      o,
      fmt,
      (x) => printReceipt(x as Map<String, dynamic>, io, amountInWords),
      (x) => downloadReceipt(x as Map<String, dynamic>, io, amountInWords));
}
