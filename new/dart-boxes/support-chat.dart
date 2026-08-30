// 📦 קופסת-חיבורים · support-chat (Dart) — מחווטת 9 אטומי-Dart. מקבילה ל-new/boxes/support-chat.mjs.
// חוזה משותף: new/boxes/support-chat.contract.md · מקור-האמת (L4): maor/src/lib/supportChat.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// דבקי-החיווט (הזרקת-התקרה · הזרקת-sanitize ל-sendable · סדר-מיון-השיחות) = ידע-קופסה
// (חוק-5), לא אטומים. קופסה מייבאת אך-ורק אטומים; קופסה לא מייבאת קופסה.
//
// ── ההכרעות שחיות כאן (חיווט, לא אטום) — כמו במקור-ה-JS ──
// · תקרת-האורך = הכרעת-קופסה: האטום sanitize מקבל שקע supportMsgMax, הקופסה מזריקה
//   את SUPPORT_MSG_MAX (מקור:36-38).
// · isSendable מקבל את ה-sanitize המחווט (השכן module-private במקור:41-43 — חוק-3).
// · sortSupportThreads — סדר-הקסקדה חי כאן (LAW תיקון-5): "לא-נקרא-לתמיכה" ראשון, ואז
//   lastAt יורד. supportUnread הוא אטום מוזרק. verbatim מ-supportChat.ts:104-115. האטום
//   sort-support-threads.dart קיים אך אינו מחווט כאן — הסדר שייך לקופסה (זהה למבנה-ה-JS).
//
// מתאמי-טיפוס: ה-JS גמיש-טיפוסים; ב-Dart-הקשיח הקופסה מיישרת את פלט-האטומים (dynamic⇒String/num).
import '../dart-data-maor/support-day-label-sockets.dart' as skb_support_day_label;
import '../dart-maor/support-msg-max.dart' as smm;
import '../dart-maor/sanitize-support-text.dart' as sst;
import '../dart-maor/is-sendable-support-text.dart' as iss;
import '../dart-maor/sort-support-msgs.dart' as ssm;
import '../dart-maor/support-msg-time.dart' as smt;
import '../dart-maor/support-day-label.dart' as sdl;
import '../dart-maor/support-preview.dart' as spv;
import '../dart-maor/support-unread.dart' as sur;
import '../dart-maor/sort-team-msgs.dart' as stm;

// ── דבקי-החיווט (הזרקות-שקע — ידע-קופסה, חוק-5) ──────────────────────────────
// תקרת-האורך מוזרקת מהקופסה (מקור-ה-JS: `(raw) => _sanitizeSupportText(raw, SUPPORT_MSG_MAX)`).
String sanitizeSupportText(dynamic raw) => sst.sanitizeSupportText(raw, smm.supportMsgMax) as String;
// isSendable מקבל את ה-sanitize המחווט כשקע (מקור-ה-JS: `(raw) => _isSendable(raw, sanitizeSupportText)`).
bool isSendableSupportText(dynamic raw) =>
    iss.isSendableSupportText(raw, (Object? r) => sanitizeSupportText(r));

// גישת-שדה נאמנת-JS למיון-השיחות (דבק-קופסה): Map ⇒ ערך (חסר ⇒ null ≡ undefined);
// null-איבר ⇒ זריקה (TypeError ב-JS: "Cannot read properties of null").
dynamic _prop(dynamic o, String key) {
  if (o == null) throw StateError("TypeError: Cannot read properties of null (reading '$key')");
  if (o is Map) return o[key];
  return null;
}

// מיון רשימת-השיחות — ההכרעה (סדר-הקסקדה) חיה כאן. verbatim מ-supportChat.ts:104-115.
// יציבות-JS משוחזרת ב-decorate-sort-undecorate (Dart List.sort לא-יציב ל-≥32 — אינדקס
// מקורי כשובר-שוויון ⇒ סדר-הכנסה, זהה ל-Array.sort של V8).
// 🛡 מגן-ההכרעה שבבדיקת-ה-JS (readFileSync + regex על מקור-הקופסה) הוא מגן-מקור-JS ⇒
//    מדולג כאן (חוק: מגן-מקור-JS/מקרה-תלוי-JS ⇒ דלג בהערה).
List<dynamic> sortSupportThreads(dynamic threads) {
  final list = <dynamic>[...(threads as Iterable)];
  final idx = List<int>.generate(list.length, (i) => i);
  idx.sort((ia, ib) {
    final a = list[ia], b = list[ib];
    final ua = supportUnread(a, 'admin');
    final ub = supportUnread(b, 'admin');
    if ((ua > 0) != (ub > 0)) return ua > 0 ? -1 : 1; // לא-נקרא ראשון
    final la = (_prop(a, 'lastAt') ?? '') as String;
    final lb = (_prop(b, 'lastAt') ?? '') as String;
    final c = la.compareTo(lb); // חדש ראשון: la < lb ? 1 : la > lb ? -1 : 0
    final r = c < 0 ? 1 : (c > 0 ? -1 : 0);
    return r != 0 ? r : ia - ib; // שובר-שוויון = סדר-מקורי (יציבות-JS)
  });
  return [for (final i in idx) list[i]];
}

// ── ה-API הפומבי (ביט-זהה לחתימות supportChat.ts) ────────────────────────────
int get supportMsgMax => smm.supportMsgMax;
List<dynamic> sortSupportMsgs(dynamic msgs) => ssm.sortSupportMsgs(msgs);
String supportMsgTime(dynamic at) => smt.supportMsgTime(at) as String;
String supportDayLabel(dynamic at, dynamic todayIso) => sdl.supportDayLabel(at, todayIso, skb_support_day_label.supportDayLabel_T) as String;
String supportPreview(dynamic text, [dynamic max = 40]) => spv.supportPreview(text, max) as String;
num supportUnread(dynamic thread, dynamic side) => sur.supportUnread(thread, side) as num;
List<dynamic> sortTeamMsgs(dynamic msgs) => stm.sortTeamMsgs(msgs);
