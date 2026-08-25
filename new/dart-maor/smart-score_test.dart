// בדיקת-חוזה (רתמת-זהב) · smartScore — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת אחד-לאחד את בדיקת-ה-JS new/atoms/smart-score.test.mjs: אותם שקעים
// (norm מנקה-טעמים/סופיות/פיסוק · dist לוונשטיין · expand תעתיקי-XL · score מדורג)
// ואותן 5 דוגמאות-חוזה. אם עובר ⇒ Dart≡JS.
// כלל-8 (השוואת-מערכים = אורך+איבר-איבר) מיושם בבדיקת-העזר של expand;
// תוצר-האטום עצמו הוא מספר ⇒ השוואת-ערך ישירה.
// הרצה: dart run --enable-asserts new/dart-maor/smart-score_test.dart  ⇒ exit 0, מדפיס OK
import 'smart-score.dart';

// — שקע norm: כמו ב-JS —
// String(t||'').toLowerCase().replace(/[֑-ׇ]/g,'').replace(סופיות).replace(פיסוק).trim()
final Map<String, String> _finals = {'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ'};

String _norm(dynamic t) {
  // JS: String(t||'') — falsy (null/'' בתרחישי-הבדיקה) ⇒ ''
  var s = (t == null || t == '') ? '' : t.toString();
  s = s.toLowerCase();
  s = s.replaceAll(RegExp(r'[֑-ׇ]'), ''); // ‏[֑-ׇ] — טעמים/ניקוד
  s = s.replaceAllMapped(RegExp(r'[ךםןףץ]'), (m) => _finals[m[0]]!);
  s = s.replaceAll(RegExp("['\"׳״\\-–._]"), '');
  return s.trim();
}

// — שקע dist: לוונשטיין שורה-מתגלגלת, השוואת יחידות-UTF-16 כמו a[i-1]===b[j-1] ב-JS —
int _dist(String a, String b) {
  final la = a.length, lb = b.length;
  if (la == 0) return lb; // if(!la)return lb
  if (lb == 0) return la;
  final dp = List<int>.generate(lb + 1, (j) => j);
  for (var i = 1; i <= la; i++) {
    var p = dp[0];
    dp[0] = i;
    for (var j = 1; j <= lb; j++) {
      final t = dp[j];
      var m = dp[j] + 1;
      if (dp[j - 1] + 1 < m) m = dp[j - 1] + 1;
      final sub = p + (a.codeUnitAt(i - 1) == b.codeUnitAt(j - 1) ? 0 : 1);
      if (sub < m) m = sub;
      dp[j] = m;
      p = t;
    }
  }
  return dp[lb];
}

// — טבלת-תעתיקים XL (סדר-הכנסה נשמר, כמו Object.entries) —
final Map<String, List<String>> _xl = {
  'כהן': ['cohen', 'kohen', 'коэн'],
};

// — שקע expand: כמו ב-JS, כולל דדופ-Set משמר-סדר —
List<dynamic> _expand(dynamic q, dynamic n) {
  final nq = n(q) as String;
  final out = <dynamic>[q];
  if (nq.isEmpty) return out; // if(!nq)return out
  _xl.forEach((h, al) {
    if (n(h) == nq) {
      out.addAll(al);
    } else if (al.any((a) => n(a) == nq)) {
      out.add(h);
    }
  });
  return out.toSet().toList(); // [...new Set(out)] — LinkedHashSet משמר סדר-הכנסה
}

// — שקע score: מדורג 100/80/62/52-4d כמו ב-JS —
num _score(dynamic q, dynamic t) {
  final nq = _norm(q), nt = _norm(t);
  if (nq.isEmpty || nt.isEmpty) return 0; // if(!nq||!nt)return 0
  if (nt == nq) return 100;
  if (nt.startsWith(nq)) return 80;
  if (nq.length >= 2 && nt.contains(nq)) return 62;
  final max = nt.length >= 6 ? 2 : 1;
  if (nq.length >= 3) {
    final d = _dist(nq, nt);
    if (d <= max) return 52 - d * 4;
  }
  return 0;
}

void _eq(num got, num want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

// כלל-8: השוואת-מערכים = אורך + איבר-איבר (לעולם לא join).
void _eqList(List<dynamic> got, List<dynamic> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: length ${got.length} != ${want.length} (got=$got want=$want)');
  }
  for (var i = 0; i < got.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label]: [$i] "${got[i]}" != "${want[i]}"');
    }
  }
}

void main() {
  var n = 0;

  // — חמש דוגמאות-החוזה verbatim (smart-score.test.mjs שורה 7) —
  final cases = <List<dynamic>>[
    ['כהן', ['כהן'], 100],
    ['דוד כהן', ['דוד', 'כהן'], 200],
    ['דוד xyz', ['דוד', 'כהן'], 0], // AND — מילה בלי התאמה ⇒ 0
    ['cohen', ['כהן'], 100], // תעתיק
    ['', ['כהן'], 0],
  ];
  for (final c in cases) {
    final q = c[0], terms = c[1], want = c[2] as num;
    final got = smartScore(q, terms, _norm, _expand, _score) as num;
    _eq(got, want, '"$q"');
    n++;
  }

  // — עיגון-שקעים (מוודא שהרתמה עצמה נאמנה ל-JS לפני שסומכים על 5 הדוגמאות) —
  _eq(_dist('כהן', 'כהנ'), 1, 'dist trailing'); n++;
  _eq(_score('כהן', 'כהן'), 100, 'score exact'); n++;
  _eq(_score('cohen', 'כהן'), 0, 'score latin-vs-hebrew (רק expand מגשר)'); n++;
  _eqList(_expand('cohen', _norm), ['cohen', 'כהן'], 'expand latin→hebrew'); n++;
  _eqList(_expand('כהן', _norm), ['כהן', 'cohen', 'kohen', 'коэн'], 'expand hebrew→all'); n++;
  _eqList(_expand('', _norm), [''], 'expand empty passthrough'); n++;

  // — קצוות-האטום עצמו (התנהגות-JS שנשמרה) —
  _eq(smartScore('  ', ['כהן'], _norm, _expand, _score) as num, 0, 'whitespace-only ⇒ 0'); n++;
  _eq(smartScore('כהן', <dynamic>[], _norm, _expand, _score) as num, 0, 'terms ריק ⇒ 0 (AND)'); n++;
  _eq(smartScore('דוד כהן', ['דוד כהן'], _norm, _expand, _score) as num, 142,
      'סכום-פר-מילה (80+62) גובר על ציון-הביטוי (100) — אומת מול אורקל-ה-JS'); n++;
  _eq(smartScore('KOHEN', ['כהן'], _norm, _expand, _score) as num, 100,
      'expand דרך norm — KOHEN⇒kohen⇒תעתיק-XL⇒כהן (כמו ב-JS)'); n++;
  _eq(smartScore('kxhen', ['כהן'], _norm, _expand, _score) as num, 0,
      'לא-ברשימת-XL ולא-תואם ⇒ 0'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(smartScore('כהן', ['כהן'], _norm, _expand, _score) == 100, 'assert-live guard');

  print('OK smartScore: $n asserts passed (5 דוגמאות-חוזה + עיגוני-שקעים + קצוות)');
}
