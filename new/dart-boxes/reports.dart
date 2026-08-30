// 📦 קופסת-חיבורים · reports (Dart) — מחווטת 12 אטומי-Dart. מקבילה ל-new/boxes/reports.mjs.
// חוזה משותף: new/boxes/reports.contract.md · מקור-האמת (L4): maor/src/components/reports/lib.ts (13 חוטים).
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// מייבאת אך-ורק אטומים (חוק-2). שכנים חוצי-מודול ו-new Date()/DateTime.now() = שקעים מוזרקים (חוק-3/6).
// ההכרעות (סדר-הקסקדה, מילון-התוויות, טיפול-הקצה של fmtDate) חיות כאן, לא באטומים.
//
// ── מתאמי-טיפוס (ידע-קופסה — חוק-5): פער-הייצוג רשומה↔Map ───────────────────────
// · אטום in-range מקבל רשומה `({String? from, String? to})`; המקור-ה-JS וכל שאר
//   החוטים עובדים על אובייקט-JS (⇒ Map). הקופסה מגשרת: Map ⇒ record לפני-האטום.
// · אטום paid-in-range מזריק שקע-inRange בחתימת `bool Function(Object?, Map<String,dynamic>)`;
//   הקופסה מספקת מתאם `_inRangeMap` שקורא לאטום in-range עם ה-record.
import '../dart-data-maor/range-label-sockets.dart' as skb_range_label;
import '../dart-maor/fmt-date.dart' as fdc;
import '../dart-maor/in-range.dart' as ir;
import '../dart-maor/range-label.dart' as rl;
import '../dart-maor/paid-of.dart' as po;
import '../dart-maor/round2.dart' as r2;
import '../dart-maor/paid-in-range.dart' as pir;
import '../dart-maor/balance-of.dart' as bo;
import '../dart-maor/month-key.dart' as mk;
import '../dart-maor/month-label.dart' as ml;
import '../dart-maor/name-index.dart' as nix;
import '../dart-maor/status-label.dart' as sl;
import '../dart-maor/count-by.dart' as cb;

// ── שקע-הזמן (חוק-6): "היום" = isoLocal(now); ה-now האמיתי מוזרק, לא DateTime.now() באטום ──
String isoToday(String Function(DateTime) isoLocal, [DateTime? now]) => isoLocal(now ?? DateTime.now());

// ── הכרעת-מסך-הדוחות (מקור reports/lib.ts:18-23): ריק=>'' · שבור=>iso כמו-שהוא ──
//    (שונה מאטום fmt-date שמחזיר '—'; הליבה DD/MM/YYYY נלקחת מהאטום.)
String fmtDate(String? iso) {
  if (iso == null || iso.isEmpty) return ''; // JS `if (!iso) return ''`
  final head = iso.length >= 10 ? iso.substring(0, 10) : iso; // slice(0,10) בטוח (כלל-5)
  final parts = head.split('-');
  final y = parts.isNotEmpty ? parts[0] : null; // JS destructuring [y,m,d]: איבר-חסר ⇒ undefined
  final m = parts.length > 1 ? parts[1] : null;
  final d = parts.length > 2 ? parts[2] : null;
  if (y == null || y.isEmpty || m == null || m.isEmpty || d == null || d.isEmpty) return iso; // שבור ⇒ ה-ISO כמו-שהוא (לא '—')
  return fdc.fmtDate(iso); // הליבה DD/MM/YYYY מהאטום
}

// ── מתאם-טיפוס: Map {from,to} ⇒ record של אטום in-range ─────────────────────────
bool _inRangeMap(Object? iso, Map<String, dynamic> r) =>
    ir.inRange(iso as String?, (from: r['from'] as String?, to: r['to'] as String?));

// ── חיווט ישיר (האטום זהה-ביט למקור) ──
/// האם תאריך-ISO בתוך טווח {from,to} — מתאם Map⇒record לאטום.
bool inRange(String? iso, Map r) =>
    ir.inRange(iso, (from: r['from'] as String?, to: r['to'] as String?));

/// סכום-ששולם על שיבוץ (מגן-NaN).
num paidOf(Map? e) => po.paidOf(e);

/// עיגול כסף לשתי ספרות.
dynamic round2(dynamic x) => r2.round2(x);

/// מפתח-חודש "YYYY-MM" מ-ISO.
String monthKey(String iso) => mk.monthKey(iso);

/// תווית חודש MM/YYYY ממפתח.
dynamic monthLabel(dynamic key) => ml.monthLabel(key);

/// מילון-תוויות-סטטוס בעברית (verbatim מהאטום).
Map<String, String> get statusLabel => sl.statusLabel;

/// ספירה לפי מפתח — ממוין מהגדול לקטן.
List<List<Object>> countBy(List<dynamic> items, String Function(dynamic) key) => cb.countBy(items, key);

// ── חיווט-שכנים (חוק-3): השכן מוזרק פנימה בקופסה ──
/// תווית עברית לטווח-תאריכים — fmtDate של הקופסה מוזרק כשקע.
String rangeLabel(Map r) => rl.rangeLabel(r, fmtDate, skb_range_label.rangeLabel_T);

/// סכום-ששולם-בטווח — inRange מוזרק כשקע (דרך מתאם ה-record).
num paidInRange(Map<String, dynamic> e, Map<String, dynamic> r) => pir.paidInRange(e, r, _inRangeMap);

/// יתרת-חוב לא-שלילית — paidOf מוזרק כשקע.
num balanceOf(Map<String, Object?> e) => bo.balanceOf(e, (x) => po.paidOf(x));

/// אינדקס בני-משפחה לפי מזהה (Map id⇒member) — allMembers מוזרק כשקע.
dynamic nameIndex(dynamic db, dynamic allMembers) => nix.nameIndex(db, allMembers);
