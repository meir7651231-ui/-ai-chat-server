import '../dart-data/audit_rows-terms.dart' as td_audit_rows;
// בדיקת-חוזה (golden-אפיון) · auditRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/audit_rows_test.dart  ⇒ exit 0
//
// השקע normName = מימוש-אמת (זהה לפורט maor/name-matches): הסרת-ניקוד-עברי →
//   פיסוק ["'.,-()] לרווח → כיווץ-רווחים → trim → lowercase. הזרקתו קובעת אילו
//   שמות/מק"טים "זהים אחרי-נרמול" ⇒ הגולדנים נגזרים מלוגיקת-האטום על-גביו.
import 'audit_rows.dart';

// שקע-הבדיקה — פורט מילה-במילה מ-normName (name-matches.test.mjs / הקוד-החי):
final _niqqud = RegExp('[֑-ׇ]');
final _punct = RegExp(r"""["'.,\-()]""");
final _ws = RegExp(r'\s+');
String _normName(String s) => s
    .replaceAll(_niqqud, '')
    .replaceAll(_punct, ' ')
    .replaceAll(_ws, ' ')
    .trim()
    .toLowerCase();

void _eqI(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void _eqS(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

QualityReport _run(List<QualityRow> rows) =>
    auditRows(rows, normName: _normName, term: (k)=>td_audit_rows.kTerms[k]!);

void main() {
  var n = 0;

  // — 1. רשימה ריקה ⇒ אפס אזהרות, scanned=0 —
  final r1 = _run(const []);
  _eqI(r1.scanned, 0, '1a empty scanned');
  _eqI(r1.warnings.length, 0, '1b empty warnings');
  n += 2;

  // — 2. שורה יחידה תקינה ⇒ אין אזהרה (נרשמת בלבד) —
  final r2 = _run(const [QualityRow(line: 1, name: 'ישראל', key: 'A1')]);
  _eqI(r2.scanned, 1, '2a single scanned');
  _eqI(r2.warnings.length, 0, '2b single warnings');
  n += 2;

  // — 3. שם-כפול (נרמול-רווחים) מק"ט שונה ⇒ dup-name יחיד, מפנה לשורה-1 —
  //   name2="ישראל  כהן" (רווח-כפול) ⇒ נורמל "ישראל כהן" = שורה-1; המסר נושא את
  //   ה-name הגולמי (עם הרווח-הכפול). מק"טים A1/B2 שונים ⇒ אין near-key.
  final r3 = _run(const [
    QualityRow(line: 1, name: 'ישראל כהן', key: 'A1'),
    QualityRow(line: 2, name: 'ישראל  כהן', key: 'B2'),
  ]);
  _eqI(r3.scanned, 2, '3a scanned');
  _eqI(r3.warnings.length, 1, '3b one warning');
  _eqS(r3.warnings[0].kind, 'dup-name', '3c kind');
  _eqI(r3.warnings[0].line, 2, '3d line');
  _eqS(r3.warnings[0].message,
      'פריט 2 — שם זהה לפריט 1 (מק"ט שונה): "ישראל  כהן"', '3e message');
  n += 5;

  // — 4. מק"ט-כמעט-זהה (מקף מול רווח, רישיות) ⇒ near-key, מפנה לשורה-5 —
  //   "AB-100" ⇒ "ab 100"  ·  "ab 100" ⇒ "ab 100"  (שווים). שמות שונים ⇒ אין dup-name.
  final r4 = _run(const [
    QualityRow(line: 5, name: 'מוצר א', key: 'AB-100'),
    QualityRow(line: 6, name: 'מוצר ב', key: 'ab 100'),
  ]);
  _eqI(r4.warnings.length, 1, '4a one warning');
  _eqS(r4.warnings[0].kind, 'near-key', '4b kind');
  _eqI(r4.warnings[0].line, 6, '4c line');
  _eqS(r4.warnings[0].message,
      'פריט 6 — מק"ט שונה רק ברישיות/רווח מפריט 5', '4d message');
  n += 4;

  // — 5. שם-ריק-אחרי-נרמול מדולג (שומר firstByName נקי) ⇒ אין dup-name —
  //   שני שמות ריקים (""/"   ") לא מייצרים אזהרה, אף שהנורמל שווה (ריק). מק"טים שונים.
  final r5 = _run(const [
    QualityRow(line: 1, name: '', key: 'K1'),
    QualityRow(line: 2, name: '   ', key: 'K2'),
  ]);
  _eqI(r5.scanned, 2, '5a scanned');
  _eqI(r5.warnings.length, 0, '5b empty-name skipped');
  n += 2;

  // — 6. שורה שכופלת גם שם וגם מק"ט ⇒ שתי אזהרות, dup-name לפני near-key (סדר-הגוף) —
  //   name "פריט"=="פריט" · key "SKU-1"⇒"sku 1" == "sku 1".
  final r6 = _run(const [
    QualityRow(line: 1, name: 'פריט', key: 'SKU-1'),
    QualityRow(line: 2, name: 'פריט', key: 'sku 1'),
  ]);
  _eqI(r6.scanned, 2, '6a scanned');
  _eqI(r6.warnings.length, 2, '6b two warnings');
  _eqS(r6.warnings[0].kind, 'dup-name', '6c first=dup-name');
  _eqS(r6.warnings[1].kind, 'near-key', '6d second=near-key');
  _eqI(r6.warnings[0].line, 2, '6e dup line');
  _eqI(r6.warnings[1].line, 2, '6f near line');
  n += 6;

  // — 7. שלוש-הופעות: הכל מפנה ל-first (שורה-1), לא לקודמת ⇒ המפה נרשמת רק פעם —
  final r7 = _run(const [
    QualityRow(line: 1, name: 'X', key: '1'),
    QualityRow(line: 2, name: 'X', key: '2'),
    QualityRow(line: 3, name: 'X', key: '3'),
  ]);
  _eqI(r7.warnings.length, 2, '7a two dup warnings');
  _eqS(r7.warnings[0].message,
      'פריט 2 — שם זהה לפריט 1 (מק"ט שונה): "X"', '7b line2→1');
  _eqS(r7.warnings[1].message,
      'פריט 3 — שם זהה לפריט 1 (מק"ט שונה): "X"', '7c line3→1 (not→2)');
  n += 3;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    _run(const [
          QualityRow(line: 1, name: 'A', key: 'k'),
          QualityRow(line: 2, name: 'A', key: 'k'),
        ]).warnings.length ==
        2,
    'assert-live guard',
  );

  print('OK auditRows: $n asserts passed');
}
