// ⚛️ אטום-Dart (דרגת-חוזה) · roomInfoLabel — שורת-המידע על חדר
//    (משבצות · קיבולת · נגישות · ציוד).
// מוצא: maor/src/components/diary/lib.ts:291-304 · המקור: new/atoms/room-info-label.mjs
// חוזה: new/atoms/room-info-label.contract.md
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart-core). חוק-4 — התנהגות זהה-ביט
//    למקור-ה-JS. אפס שקעים (אין locale / לוח-עברי — שרשור-מחרוזות בלבד).
//
// הערות-המרה (DART-PORTING-RULES):
//  • truthiness (כלל 7): `room.eq || {}` / `room.slot || 60` / `room.cap ?` /
//    `room.access ?` / `.filter(([,v]) => v)` של JS ⇒ שקע `_truthy` מפורש
//    (false גם ל-0, '', NaN, null, false — כמו JS; slot=0 ⇒ ברירת-מחדל 60,
//    cap=0 ⇒ בלי קטע-קיבולת, בדיוק כדוגמה 3 בחוזה).
//  • `Object.entries(eq)` — סדר-JS: מפתחות-אינדקס-מערך (מחרוזות '0','1',…) ממוינים
//    עולה תחילה, אחר-כך שאר-המפתחות בסדר-הכנסה ⇒ `_jsOwnKeys` משחזר את הסדר
//    (מפתחות עבריים אינם אינדקסים ⇒ סדר-ההכנסה נשמר, כדוגמה 4: א, ב, ג).
//  • שרשור מספר-למחרוזת (`'…' + (room.slot || 60)`): JS מדפיס double שלם בלי
//    נקודה (45.0 ⇒ '45') ⇒ `_jsStr` מיישר את `toString` של Dart להתנהגות-JS.
//  • `eqOn.slice(0, 3)` הסלחן של JS ⇒ `take(3)` (בטוח גם כשיש פחות מ-3).

bool _falsy(dynamic v) =>
    v == null || v == false || v == 0 || v == '' || (v is num && v.isNaN);
bool _truthy(dynamic v) => !_falsy(v);

/// JS String(v) for concatenation: integral doubles print without a decimal point.
String _jsStr(dynamic v) {
  if (v is double) {
    if (v.isNaN) return 'NaN';
    if (v.isInfinite) return v > 0 ? 'Infinity' : '-Infinity';
    if (v == v.truncateToDouble() && v.abs() < 1e21) return v.toStringAsFixed(0);
  }
  return v.toString();
}

final _arrayIndexRe = RegExp(r'^(0|[1-9]\d*)$');

/// Own-key order of JS Object.entries: array-index-like string keys ascending
/// first, then the remaining keys in insertion order.
List<dynamic> _jsOwnKeys(Map m) {
  final idx = <String>[];
  final rest = <dynamic>[];
  for (final k in m.keys) {
    if (k is String && k.length <= 10 && _arrayIndexRe.hasMatch(k)) {
      final n = int.parse(k);
      if (n <= 4294967294) {
        idx.add(k);
        continue;
      }
    }
    rest.add(k);
  }
  idx.sort((a, b) => int.parse(a).compareTo(int.parse(b)));
  return [...idx, ...rest];
}

/// Room info line: slot length (default 60) · capacity · accessibility · up to
/// 3 enabled equipment keys. Verbatim behaviour of the JS `roomInfoLabel`.
String roomInfoLabel(dynamic room) {
  final eqRaw = room['eq'];
  final Map eq = _truthy(eqRaw) ? eqRaw as Map : const {};
  final eqOn = <dynamic>[];
  for (final k in _jsOwnKeys(eq)) {
    if (_truthy(eq[k])) eqOn.add(k);
  }
  final slot = room['slot'];
  final cap = room['cap'];
  return 'משבצות של ' +
      _jsStr(_truthy(slot) ? slot : 60) +
      ' דק׳' +
      (_truthy(cap) ? ' · עד ' + _jsStr(cap) + ' משתתפים' : '') +
      (_truthy(room['access']) ? ' · נגיש' : '') +
      (eqOn.isNotEmpty ? ' · ' + eqOn.take(3).map(_jsStr).join(', ') : '');
}
