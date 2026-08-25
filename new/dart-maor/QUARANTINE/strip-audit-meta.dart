// ⚛️ אטום-Dart (דרגת-חוזה) · stripAuditMeta — הסרת מטא-ביקורת
// מוצא: maor/src/lib/supporterPartition.ts:82-88 · תורגם TS→JS מכונה.
//        המקור: new/atoms/strip-audit-meta.mjs —
//        `if (!('audit' in meta)) return meta; const rest = {...meta}; delete rest.audit; return rest;`
// טוהר: פונקציית top-level עצמאית, אפס import (רק שפה/סטנדרט).
//
// תפקיד: מסיר את מפתח-הביקורת 'audit' מאובייקט-מטא לפני שמירה/השוואה.
// קלט:  meta — dynamic: Map (אובייקט-JS) או List (מערך-JS; ל-'in' על מערך אין
//        מפתח 'audit' ⇒ עובר כמו-שהוא). קלטים אחרים לא מוקלטים בחוזה.
// פלט:  אם אין מפתח 'audit' ⇒ **אותו אובייקט עצמו** (זהות-רפרנס, כמו ב-JS);
//        אחרת ⇒ Map חדש = העתק-רדוד בלי 'audit' (המקור לא משתנה).
//
// הערות-המרה (מקור→Dart):
// - חוק-2: ‏`'audit' in meta` של JS = בדיקת-קיום-מפתח, תופס גם audit:null/undefined
//   מפורשים ⇒ ‏`containsKey('audit')`, לעולם לא ‏`meta['audit'] == null`.
// - חוק-14: ‏`{...meta}` של JS מעתיק מפתחות בסדר-האנומרציה של JS — מפתחות
//   דמויי-שלם-קנוני ("0","2","10") ממוינים מספרית-קודם, השאר בסדר-הכנסה.
//   ‏Dart Map = סדר-הכנסה בלבד ⇒ עוזר ‏_jsOrderedKeys משחזר את הסדר.
// - מערך-JS: ‏`'audit' in []` = false ⇒ מוחזר כמו-שהוא (זהות). ב-Dart: ‏List ⇒ meta.

/// Removes the `'audit'` key from a meta object. Key absent ⇒ the very same
/// object is returned (reference identity, like the JS source); key present ⇒
/// a fresh shallow copy without `'audit'`, in JS enumeration order.
/// Verbatim behaviour of new/atoms/strip-audit-meta.mjs.
dynamic stripAuditMeta(dynamic meta) {
  if (meta is! Map) return meta; // מערך/אחר: אין מפתח 'audit' ⇒ עובר כמו-שהוא
  if (!meta.containsKey('audit')) return meta;
  final rest = <dynamic, dynamic>{};
  for (final k in _jsOrderedKeys(meta)) {
    rest[k] = meta[k];
  }
  rest.remove('audit');
  return rest;
}

/// חוק-14: מפתח דמוי-שלם-קנוני של JS (canonical numeric string, ‏0..2^53-1,
/// בלי אפסים-מובילים) — ממוין מספרית לפני שאר-המפתחות באנומרציה.
bool _isJsIntegerKey(dynamic k) {
  if (k is! String || k.isEmpty) return false;
  if (k == '0') return true;
  if (k.codeUnitAt(0) == 0x30) return false; // אפס-מוביל ⇒ לא-קנוני
  final n = int.tryParse(k);
  if (n == null || n < 0 || n > 9007199254740991) return false;
  return k == n.toString();
}

/// סדר-מפתחות-JS: שלמים-קנוניים ממוינים-מספרית קודם, השאר בסדר-הכנסה (חוק-14).
List<dynamic> _jsOrderedKeys(Map m) {
  final ints = <String>[];
  final rest = <dynamic>[];
  for (final k in m.keys) {
    if (_isJsIntegerKey(k)) {
      ints.add(k as String);
    } else {
      rest.add(k);
    }
  }
  ints.sort((a, b) => int.parse(a).compareTo(int.parse(b)));
  return <dynamic>[...ints, ...rest];
}
