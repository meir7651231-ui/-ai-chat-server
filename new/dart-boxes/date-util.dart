// 📦 קופסת-חיבורים · כלי-התאריך (Dart) — מחווטת 4 אטומי-Dart. מקבילה ל-new/boxes/date-util.mjs.
// חוזה משותף: new/boxes/date-util.contract.md. מקור-האמת: maor/src/lib/date-util.ts.
// שקע-IO יחיד: שעון-המכונה — isoToday מקבל now מוזרק (ברירת-מחדל DateTime.now(),
// נאמן-למקור). השעון חי בקופסה (חוק-6), לעולם לא באטום.
import '../dart-maor/iso-local.dart' as il;
import '../dart-maor/iso-today.dart' as it;
import '../dart-maor/iso-days-ago.dart' as ida;
import '../dart-maor/date-in-range.dart' as dir;

// ── החיווט: השכן isoLocal מוזרק לשקעי-הפירמוט (חוק-1) ──
String isoLocal(DateTime d) => il.isoLocal(d);
String isoToday([DateTime? now]) => it.isoToday(il.isoLocal, now ?? DateTime.now());
String isoDaysAgo(int days) => ida.isoDaysAgo(days, il.isoLocal);
bool dateInRange(String iso, [String? fromIso, String? toIso]) => dir.dateInRange(iso, fromIso, toIso);
