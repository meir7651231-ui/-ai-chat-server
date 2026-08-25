// ⚛️ אטום-Dart (דרגת-חוזה) · sanitizePhotos — שער-חיטוי לגלריית-תמונות.
// מוצא: maor/src/lib/photoGallery.ts:38-41 · המקור: new/atoms/sanitize-photos.mjs.
// טוהר: פונקציה top-level עצמאית, אפס import (רק שפה/סטנדרט: dart:core).
// חוק-4 — התנהגות זהה-ביט למקור-ה-JS (המקור קדוש).
//
// תפקיד: סינון מערך מתקבל-מבחוץ לתמונות-data תקינות מתחת לתקרת-משקל,
//         עד תקרת-כמות. לא-מערך ⇒ []. הסדר נשמר; מוחזר מערך חדש (לא-משנה-מקור).
// שקעים (חוק-1 — השכנים הוזרקו): isDataImage (חובה, בלי ברירת-מחדל) ·
//         photoMaxLen (ברירת-מחדל 460000 = PHOTO_MAX_LEN) · photoMax (5 = PHOTO_MAX).
//
// הערות-המרה (מקור→Dart):
//  • `raw.filter(...)` → `where(...)` — שניהם משמרי-סדר; ההערכה עצלה זהה-תוצאה.
//  • `x.length <= photoMaxLen`: ב-JS גישת `.length` לערך בלי המאפיין מחזירה
//    undefined, ו-`undefined <= n` ⇒ false (נזרק בשקט). ב-Dart dynamic-dispatch
//    היה זורק NoSuchMethodError ⇒ עוזר _lenOf: אורך ל-String/List, אחרת null,
//    ו-null ⇒ false — משקף את קצה-ה-JS בלי לזרוק.
//  • `.slice(0, photoMax)`: slice של JS סלחן — end גדול-מהאורך נחתך לאורך,
//    end שלילי נספר-מהסוף (max(len+end,0)), שבר נחתך-לכיוון-אפס (ToInteger).
//    sublist/take של Dart זורקים/שונים ⇒ עוזר _jsSlice0 שמחקה slice(0,end)
//    אחד-לאחד (כלל-5 ברוח: לעולם לא substring/sublist גולמי על גבולות-JS).
//  • truthiness אינו רלוונטי כאן — התנאים בוליאניים מפורשים (כלל-7 נשמר).

/// עוזר: אורך-בסגנון-JS — String/List מחזירים אורך, כל השאר null (≙ undefined).
num? _lenOf(dynamic x) {
  if (x is String) return x.length;
  if (x is List) return x.length;
  return null;
}

/// עוזר: Array.prototype.slice(0, end) של JS על רשימה — סלחן לגבולות.
List<dynamic> _jsSlice0(List<dynamic> list, dynamic end) {
  final len = list.length;
  num e;
  if (end is num) {
    e = end.isNaN ? 0 : end;
  } else {
    e = 0; // ToIntegerOrInfinity(undefined/לא-מספר במבחני-המוצא) ⇒ 0
  }
  // חיתוך-לכיוון-אפס (ToInteger), ואז נירמול שלילי/חריגה כמו slice.
  var ei = e.isFinite ? e.truncate() : (e.isNegative ? -len : len);
  if (ei < 0) ei = (len + ei) < 0 ? 0 : (len + ei);
  if (ei > len) ei = len;
  return list.sublist(0, ei);
}

/// Verbatim port of new/atoms/sanitize-photos.mjs (`sanitizePhotos`).
/// שער-חיטוי: רק פריטים שעוברים את שקע-האימות וגם length <= photoMaxLen,
/// חתוך ל-photoMax הראשונים. לא-מערך ⇒ [].
List<dynamic> sanitizePhotos(dynamic raw, dynamic isDataImage,
    [dynamic photoMaxLen = 460000, dynamic photoMax = 5]) {
  if (raw is! List) return [];
  final kept = raw.where((x) {
    if (isDataImage(x) != true) return false; // && קצר-חשמלי כמו במקור
    final len = _lenOf(x);
    if (len == null) return false; // JS: undefined <= n ⇒ false
    return photoMaxLen is num ? len <= photoMaxLen : false;
  }).toList();
  return _jsSlice0(kept, photoMax);
}
