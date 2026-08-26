// 📦 קופסת-חיבורים · lib-ics (מנוע ICS · RFC 5545) — מחווטת 4 אטומי-Dart.
// מקבילה ל-new/boxes/lib-ics.mjs · חוזה משותף: new/boxes/lib-ics.contract.md.
// מקור-האמת (L4): maor/src/lib/ics.ts. זו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart)
// מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט (זהה-ביט).
//
// ההלחמות-לשעבר (icsEscape · foldIcsLine · buildIcs · downloadIcs שכולם ישבו
// יחד ב-ics.ts) — כאן חיווט גלוי אחד מאטומים בלבד (חוק-2/3): הקופסה מחווטת
// אטומים, קופסה לא מייבאת קופסה. buildIcs מקבל את שני שכניו (icsEscape·foldIcsLine)
// כשקעים ומחווט אותם לחוט — בדיוק כמו במקור-ה-JS.
//
// downloadIcs (⚠️ לא-טהור): שער-יציאה (guardExport) + נגיעת-DOM. ב-JS ה-io מזריק
// document/URL/setTimeout; ב-Dart אין DOM ⇒ io מופשט (IcsIo, חוק-3 · שקע-מוזרק) —
// שום ידית-DOM/מצב-מודול נצרב בקופסה (חוק-1/6). Blob = שקע ב-io (אין Blob גלובלי
// ב-dart-core; ב-JS הוא סטנדרט-שפה גלובלי).
import '../dart-maor/ics-escape.dart' as esc;
import '../dart-maor/fold-ics-line.dart' as fold;
import '../dart-maor/build-ics.dart' as bi;
import '../dart-maor/guard-export.dart' as ge;

// ── מילון-הקופסה (הכרעות-הצבה · verbatim מ-maor/src/lib/ics.ts:132-139) ──────
// mime יומן, בלי BOM (בניגוד ל-CSV — יומנים לא אוהבים BOM). — ics.ts:132,136
const String _calMime = 'text/calendar;charset=utf-8';
// חלון-שחרור ה-object-URL אחרי ה-click. — ics.ts:139
const int _revokeMs = 5000;

// ── io מופשט: מקביל לאובייקט-ה-io המוזרק ב-JS ({blocked,notify,createElement,
//    createObjectURL,revokeObjectURL,setTimeout} + Blob) ───────────────────────
/// אלמנט-DOM מופשט שהקופסה יוצרת (a) — property-bag שהקופסה כותבת אליו, בדיוק כמו
/// האובייקט הפשוט שמחזיר io.createElement ב-JS. click() ⇒ onClick (מקביל ל-el.click()).
class IcsEl {
  final String tag;
  String href = '';
  String download = '';
  void Function()? onClick;
  IcsEl(this.tag);
  void click() => onClick?.call();
}

/// עולם-הצד-של-הדפדפן המוזרק (מקביל לאובייקט-ה-io ב-JS): שער-היציאה (blocked/notify
/// שנקבעו במקור ב-setExportBlocked) + document/URL/setTimeout + Blob.
abstract class IcsIo {
  bool get exportBlocked; // io.blocked
  void Function()? get exportNotify; // io.notify (רק בחסימה)
  Object blob(List<String> parts, String type); // new Blob([text], {type})
  IcsEl createElement(String tag); // io.createElement
  String createObjectURL(Object blob); // io.createObjectURL
  void revokeObjectURL(String href); // io.revokeObjectURL
  void setTimeout(void Function() fn, int ms); // io.setTimeout
}

// ── החשיפה (ממשק lib/ics.ts אחד-לאחד — L4) ──────────────────────────────────

/// escaping לפי RFC 5545 (\\ ; , \n). שקע ics-escape ישירות.
String icsEscape(String? s) => esc.icsEscape(s);

/// קיפול-שורה ל-≤75 אוקטטים (בטוח-UTF8). שקע fold-ics-line ישירות.
List<String> foldIcsLine(String line) => fold.foldIcsLine(line);

/// בניית קובץ ICS שלם. now מוזרק (DTSTAMP) — טהור ודטרמיניסטי.
/// החיווט: שני שכני-המקור המיוצאים (icsEscape · foldIcsLine) שוקעו לחוט build-ics.
/// מתאם-טיפוס: icsEscape הוא String Function(String?); build-ics מבקש String Function(String)
/// ⇒ נעטף ב-`(s) => esc.icsEscape(s)`.
String buildIcs(List<Map<String, String?>> occurrences, String calName, DateTime now) =>
    bi.buildIcs(occurrences, calName, now, (s) => esc.icsEscape(s), fold.foldIcsLine);

/// הורדת קובץ ICS. שער-יציאת-מידע (guardExport) לפני כל נגיעת-DOM — נקודת-החנק של
/// core.export (המקור: `if (!guardExport()) return`). שקעי-ה-IO מוזרקים ב-io.
/// אין BOM · mime מהמילון · חלון-שחרור _revokeMs. חיווט זהה-ביט למקור-ה-JS.
void downloadIcs(String filename, String text, IcsIo io) {
  if (!ge.guardExport(io.exportBlocked, io.exportNotify)) return; // 🔐 שער יציאת-מידע (core.export)
  final a = io.createElement('a');
  a.href = io.createObjectURL(io.blob([text], _calMime));
  a.download = filename;
  a.click();
  io.setTimeout(() => io.revokeObjectURL(a.href), _revokeMs);
}
