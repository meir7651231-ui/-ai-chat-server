// ⚛️ אטום-Dart (דרגת-חוזה) · sortSupportMsgs — מיון הודעות-תמיכה לפי at
// מוצא: maor/src/lib/supportChat.ts:46-50 · המקור: new/atoms/sort-support-msgs.mjs —
//        `export function sortSupportMsgs(msgs) {
//           return [...msgs].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
//         }`
// טוהר: פונקציות top-level עצמאיות, אפס import של אטום אחר (עוזרים מקומיים בקידומת _).
//
// תפקיד: עותק ממוין (לא-הרסני) של הודעות לפי שדה-הזמן at (השוואת-JS: מחרוזות
//        לקסיקוגרפית code-unit, אחרת מספרית).
//
// הערות-המרה (חוק-4 — התנהגות זהת-ביט ל-JS, כולל קצוות):
// • ‏JS `[...msgs]` הוא iterable-spread: מחרוזת ⇒ נקודות-קוד (code points, לא
//   יחידות-UTF-16!); מערך ⇒ עותק-רדוד. ‏Dart: String אינו Iterable ⇒ עוזר ‏_spread
//   שמפרק מחרוזת ל-runes (זוגות-פונדקאים נשמרים כתו-אחד, כמו איטרטור-המחרוזת של JS).
//   הקלטות-ה-Golden של החוזה הן בדיוק המקרה הזה — קלט-מחרוזת ⇒ מערך-תווים בסדר-המקור.
// • ‏`a.at` על תו-מחרוזת ב-JS הוא **מתודת** String.prototype.at (לא property-ערך);
//   השוואת שתי פונקציות עם `<`/`>` עוברת ToPrimitive ⇒ אותה מחרוזת
//   "function at() { [native code] }" בשני-הצדדים ⇒ שתיהן false ⇒ comparator 0.
//   ‏_jsProp משקף זאת: Map ⇒ הערך (או undefined-סנטינל כשהמפתח חסר — כלל-2:
//   containsKey, לא ‎==null‎); String/List ⇒ מחרוזת-המתודה (ל-V8); אחרת undefined.
// • ‏undefined בהשוואה יחסית ⇒ ToNumber ⇒ NaN ⇒ שתי ההשוואות false ⇒ 0 (לא זריקה).
// • כלל-1 (מיון-יציב): ‏List.sort של Dart אינו יציב ל-≥32 איברים; JS יציב.
//   ⇒ decorate-sort-undecorate עם אינדקס-מקור כשובר-שוויון. בהקלטות-ה-Golden
//   ה-comparator מחזיר תמיד 0 ⇒ היציבות היא כל-ההתנהגות — סדר-המקור נשמר.
// • כלל-10: ‏ToNumber דרך ‏num.tryParse (JS ‏Number('')‎=0, רווחים נגזמים, כשל=NaN —
//   לא זריקה); כלל-16 (truthiness) לא רלוונטי — אין תנאי-truthiness במקור.

/// undefined-של-JS — סנטינל נבדל מ-null (כלל-2).
class _Undef {
  const _Undef();
}

const _undef = _Undef();

/// מחרוזת-ה-ToPrimitive של המתודה at ב-V8 (מה ש-`"x".at` הופך אליו בהשוואה יחסית).
const _atMethodStr = 'function at() { [native code] }';

/// גישת-property נאמנת-JS ל-`x.at`.
dynamic _jsProp(dynamic x, String key) {
  if (x is Map) return x.containsKey(key) ? x[key] : _undef;
  // ל-String ול-Array יש מתודת ‎.at‎ ב-JS המודרני ⇒ ToPrimitive שלה בהשוואה.
  if (x is String || x is List) return _atMethodStr;
  return _undef;
}

/// ‏ToNumber של JS (המקרים הרלוונטיים): undefined⇒NaN · null⇒0 · bool⇒0/1 ·
/// מחרוזת⇒parse-גזום (''⇒0, כשל⇒NaN) · num⇒עצמו · אחר⇒NaN.
double _toNum(dynamic v) {
  if (v is _Undef) return double.nan;
  if (v == null) return 0;
  if (v is bool) return v ? 1 : 0;
  if (v is num) return v.toDouble();
  if (v is String) {
    final t = v.trim();
    if (t.isEmpty) return 0;
    return num.tryParse(t)?.toDouble() ?? double.nan;
  }
  return double.nan;
}

/// השוואה יחסית של JS (`<`): שתי מחרוזות ⇒ לקסיקוגרפית code-unit; אחרת ToNumber
/// (NaN בכל צד ⇒ false).
bool _jsLt(dynamic a, dynamic b) {
  if (a is String && b is String) return a.compareTo(b) < 0;
  final na = _toNum(a), nb = _toNum(b);
  if (na.isNaN || nb.isNaN) return false;
  return na < nb;
}

/// כמו ‎_jsLt‎ עבור `>`.
bool _jsGt(dynamic a, dynamic b) {
  if (a is String && b is String) return a.compareTo(b) > 0;
  final na = _toNum(a), nb = _toNum(b);
  if (na.isNaN || nb.isNaN) return false;
  return na > nb;
}

/// ‏iterable-spread של JS: מחרוזת ⇒ רשימת נקודות-קוד כתווים; Iterable ⇒ עותק-רדוד.
List<dynamic> _spread(dynamic msgs) {
  if (msgs is String) {
    return msgs.runes.map((r) => String.fromCharCode(r)).toList();
  }
  if (msgs is Iterable) return List<dynamic>.from(msgs);
  throw StateError('sortSupportMsgs: msgs is not iterable (JS TypeError)');
}

/// עותק ממוין של msgs לפי `.at`, בהתנהגות-JS זהת-ביט (כולל spread-מחרוזת,
/// ‏comparator-אפס על תווים, ומיון יציב). המקור: new/atoms/sort-support-msgs.mjs.
dynamic sortSupportMsgs(dynamic msgs) {
  final list = _spread(msgs);
  // decorate-sort-undecorate — אינדקס-מקור כשובר-שוויון (כלל-1: יציבות-JS).
  final idx = List<int>.generate(list.length, (i) => i);
  idx.sort((i, j) {
    final a = _jsProp(list[i], 'at');
    final b = _jsProp(list[j], 'at');
    final c = _jsLt(a, b) ? -1 : (_jsGt(a, b) ? 1 : 0);
    return c != 0 ? c : i.compareTo(j);
  });
  return [for (final i in idx) list[i]];
}
