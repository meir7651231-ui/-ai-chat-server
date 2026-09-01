import '../dart-data-maor/norm-search-sockets.dart' as skb_ns;
import '../dart-data-maor/rule-plural-terms.dart';
// 📦 קופסת-חיבורים · חיפוש (Dart) — מחווטת 11 אטומי-Dart. מקבילה ל-new/boxes/search.mjs.
// חוזה משותף: new/boxes/search.contract.md. הקסקדה (סדר-הכללים) = *המשמעות*, וחיה כאן
// בלבד (הכרעת-בעלים, LAW חוק-5) — שינוי-דירוג = סידור-שורות, אפס נגיעה בכללים.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
import '../dart-maor/levenshtein.dart' as lv;
import '../dart-maor/norm-search.dart' as ns;
import '../dart-maor/xlat.dart' as xl;
import '../dart-data-maor/xlat.dart'; // דאטה — טבלת-התעתיקים מוזרקת למנוע
import '../dart-maor/rule-exact.dart' as re;
import '../dart-maor/rule-prefix.dart' as rp;
import '../dart-maor/rule-plural.dart' as rpl;
import '../dart-maor/rule-contains.dart' as rc;
import '../dart-maor/rule-skeleton.dart' as rs;
import '../dart-maor/rule-typo.dart' as rt;
import '../dart-maor/smart-score.dart' as ss;
import '../dart-maor/smart-filter.dart' as sf;

// ── החיווט · הקסקדה (הסדר הזה הוא *המשמעות*, חי כאן — לא בחוטים) ───────────────
final List<int? Function(String, String)> _cascade = [
  (nq, nt) => re.ruleExact(nq, nt) as int?,
  (nq, nt) => rp.rulePrefix(nq, nt),
  (nq, nt) => rpl.rulePlural(nq, nt, term: (k)=>kTerms[k]!),
  (nq, nt) => rc.ruleContains(nq, nt),
  (nq, nt) => rs.ruleSkeleton(nq, nt) as int?,
  (nq, nt) => rt.ruleTypo(nq, nt, lv.levenshtein) as int?,
];

int _wiredScore(dynamic q, dynamic term) {
  final nq = ns.normSearch(q, skb_ns.normSearch_T), nt = ns.normSearch(term, skb_ns.normSearch_T);
  if (nq.isEmpty || nt.isEmpty) return 0;
  for (final rule in _cascade) {
    final s = rule(nq, nt);
    if (s != null) return s;
  }
  return 0;
}

List<dynamic> _wiredExpand(dynamic q, [dynamic norm]) => xl.expandQuery(q, norm ?? _norm1, xlatTable: kXlatTable);
String _norm1(dynamic t) => ns.normSearch(t, skb_ns.normSearch_T);
dynamic _wiredSmart(dynamic q, dynamic terms) =>
    ss.smartScore(q, terms, _norm1, _wiredExpand, _wiredScore);

// ── החשיפה ──────────────────────────────────────────────────────────────────
dynamic score(dynamic q, dynamic terms) => _wiredSmart(q, terms);
dynamic expand(dynamic q) => _wiredExpand(q);
dynamic search(dynamic q, dynamic items, dynamic getTerms, [dynamic limit]) {
  hasQuery(dynamic x) => ns.normSearch(x, skb_ns.normSearch_T).isNotEmpty;
  // limit חסר ⇒ לא מעבירים (מכבד את סנטינל-ה-_undefined של האטום; null≠undefined ב-JS).
  return limit == null
      ? sf.smartFilter(q, items, getTerms, hasQuery, _wiredSmart)
      : sf.smartFilter(q, items, getTerms, hasQuery, _wiredSmart, limit);
}
