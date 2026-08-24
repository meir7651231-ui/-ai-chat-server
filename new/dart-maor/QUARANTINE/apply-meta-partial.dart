// ⚛️ אטום-Dart (דרגת-חוזה) · applyMetaPartial — מיזוג מסמך-meta מרוחק לתוך ה-DB.
// מוצא: maor/src/lib/cloud-merge.ts:106-141 · המקור: new/atoms/apply-meta-partial.mjs
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart-core). חוק-4 — התנהגות זהה-ביט למקור-ה-JS.
//
// שני דינים (חוזה apply-meta-partial.contract.md):
//   (א) שדות "הענן-מנצח" (orgName·orgSite·orgDonate·orgGoal·budget·usdRate·audit·
//       notif·reports·ui·attnDone) — ערך שהוגדר (לא-undefined) ושונה מהמקומי נכתב;
//       undefined מדולג. ההשוואה = JSON (שוויון-עמוק תלוי-סדר, כמו המקור).
//   (ב) מונים רק-עולים (seq·receiptSeq·donationSeq·shopReceiptSeq) — נכתבים רק
//       כשהערך המרוחק מספר-סופי גדול מהמקומי.
//   אפס-שינויים ⇒ מוחזר אותו db (identical). ה-db הנכנס לעולם לא משוכתב.
//
// הערות-המרה (מקור→Dart), חוק-4:
//   • JS `undefined` ⇒ Dart `null` (הקונבנציה): assign מדלג כש-v==null, כשם ש-JS
//     מדלג כש-v===undefined. אין ב-Dart טיפוס-undefined; ערך-שדה חסר בקלט = null.
//   • `JSON.stringify(a) !== JSON.stringify(b)` ⇒ `_jsonStr` — סריאליזציה קנונית
//     תלוית-סדר-הכנסה (Dart LinkedHashMap שומר סדר כמו object של JS). NaN/Infinity
//     ⇒ 'null' (כמו JSON.stringify); double שלם ⇒ ללא ".0" (3.0 ⇒ "3", כמו JS).
//   • `v > db[k]` כש-db[k] חסר: ב-JS `n > undefined` = false. ב-Dart db[k] חסר = null;
//     לכן משווים רק כאשר db[k] הוא num (אחרת דילוג = false), מקביל-התנהגות למקור.
//   • `typeof v === 'number' && Number.isFinite(v)` ⇒ `v is num && v.isFinite`
//     ('99' מחרוזת ⇒ לא num ⇒ דילוג; Infinity ⇒ num אך !isFinite ⇒ דילוג).

/// Merges a remote meta document into [db] (cloud-wins for org fields;
/// monotonic-up counters). Returns a new map on change, or the same [db]
/// reference (identical) when nothing changed. [db] is never mutated.
/// Verbatim behaviour of the JS source `applyMetaPartial`.
Map<String, Object?> applyMetaPartial(
  Map<String, Object?> db,
  Map<String, Object?> meta,
) {
  final next = Map<String, Object?>.from(db);
  var changed = false;

  // דין (א): הענן-מנצח. undefined(=null ב-Dart) מדולג; ערך שונה (JSON) נכתב.
  void assign(String k) {
    final v = meta[k];
    if (v == null) return; // JS: `if (v === undefined) return;`
    if (_jsonStr(db[k]) != _jsonStr(v)) {
      next[k] = v;
      changed = true;
    }
  }

  assign('orgName');
  assign('orgSite');
  assign('orgDonate');
  assign('orgGoal');
  assign('budget');
  assign('usdRate');
  assign('audit');
  assign('notif');
  assign('reports');
  assign('ui');
  assign('attnDone');

  // דין (ב): מונים — לעולם לא מקטינים (מונע התנגשות מזהים/מספרי-קבלה בין מכשירים).
  void bumpCounter(String k) {
    final v = meta[k];
    final dbv = db[k];
    if (v is num && v.isFinite && dbv is num && v > dbv) {
      next[k] = v;
      changed = true;
    }
  }

  bumpCounter('seq');
  bumpCounter('receiptSeq');
  bumpCounter('donationSeq');
  bumpCounter('shopReceiptSeq');

  return changed ? next : db;
}

/// סריאליזציית-JSON קנונית לצורך השוואת-שוויון בלבד (מקביל ל-JSON.stringify).
String _jsonStr(Object? v) {
  if (v == null) return 'null';
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) return _numStr(v);
  if (v is String) return _quote(v);
  if (v is List) {
    final sb = StringBuffer('[');
    for (var i = 0; i < v.length; i++) {
      if (i > 0) sb.write(',');
      sb.write(_jsonStr(v[i]));
    }
    sb.write(']');
    return sb.toString();
  }
  if (v is Map) {
    final sb = StringBuffer('{');
    var first = true;
    v.forEach((key, val) {
      if (!first) sb.write(',');
      first = false;
      sb.write(_quote(key.toString()));
      sb.write(':');
      sb.write(_jsonStr(val));
    });
    sb.write('}');
    return sb.toString();
  }
  return _quote(v.toString());
}

/// מספר בפורמט JSON.stringify: שלמים ללא ".0"; NaN/Infinity ⇒ 'null'.
String _numStr(num v) {
  if (v is int) return v.toString();
  final d = v.toDouble();
  if (d.isNaN || d.isInfinite) return 'null';
  if (d == d.truncateToDouble() && d.abs() < 1e21) {
    return d.toInt().toString();
  }
  return d.toString();
}

/// מחרוזת מצוטטת-JSON עם escaping תקני (תווים לא-ASCII נשמרים כמות-שהם).
String _quote(String s) {
  final sb = StringBuffer('"');
  for (final rune in s.runes) {
    switch (rune) {
      case 0x22:
        sb.write('\\"');
        break;
      case 0x5C:
        sb.write('\\\\');
        break;
      case 0x08:
        sb.write('\\b');
        break;
      case 0x0C:
        sb.write('\\f');
        break;
      case 0x0A:
        sb.write('\\n');
        break;
      case 0x0D:
        sb.write('\\r');
        break;
      case 0x09:
        sb.write('\\t');
        break;
      default:
        if (rune < 0x20) {
          sb.write('\\u');
          sb.write(rune.toRadixString(16).padLeft(4, '0'));
        } else {
          sb.write(String.fromCharCode(rune));
        }
    }
  }
  sb.write('"');
  return sb.toString();
}
