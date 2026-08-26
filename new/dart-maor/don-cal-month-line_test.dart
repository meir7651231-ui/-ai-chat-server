import '../dart-data-maor/don-cal-month-line-terms.dart';
// בדיקת-חוזה (רתמת-זהב) · donCalMonthLine — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/don-cal-month-line.test.mjs
// (אותם קלטים→פלטים). השקע inMonth = inAug ('2026-08'*); השקע termOf = cfg.terms[k] ?? fb.
//   1) []                                          ⇒ 'אין תרומות מתועדות בחודש זה'
//   2) [₪100(08-05), $50(08-10)]                    ⇒ '2 תרומות החודש · ₪100 + $50'
//   3) [₪1234(08-05)]                               ⇒ '1 תרומות החודש · ₪1,234'
//   4) [$200(08-01)]                                ⇒ '1 תרומות החודש · $200'
//   5) [0/''(08-02)]                                ⇒ '1 תרומות החודש · סכומים מהקובץ ההיסטורי'
//   6) [₪100(07-05)] (מחוץ-לחודש)                    ⇒ 'אין תרומות מתועדות בחודש זה'
//   7) [] + config{terms:{entity.donations:נדבות}}  ⇒ 'אין נדבות מתועדות בחודש זה'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/don-cal-month-line_test.dart  ⇒ exit 0
import 'don-cal-month-line.dart';

// שקע inMonth — מקביל ל-inAug = (iso)=> typeof iso==='string' && iso.startsWith('2026-08').
bool _inAug(dynamic iso) => iso is String && iso.startsWith('2026-08');

// שקע termOf — מקביל ל-(cfg,k,fb)=> cfg.terms?.[k] ?? fb.
String _termOf(Map cfg, String k, String fb) {
  final terms = cfg['terms'];
  if (terms is Map && terms[k] != null) return terms[k] as String;
  return fb;
}

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =[$got]\n want=[$want]');
  }
}

void main() {
  var n = 0;

  // 1) ריק (בלי config ⇒ השקע termOf לא נקרא).
  _eq(donCalMonthLine([], _inAug, null, null, term: (k)=>kTerms[k]!),
      'אין תרומות מתועדות בחודש זה', 'ריק');
  n++;

  // 2) שני מטבעות.
  _eq(
    donCalMonthLine([
      {'date': '2026-08-05', 'amount': 100, 'cur': '₪'},
      {'date': '2026-08-10', 'amount': 50, 'cur': '\$'},
    ], _inAug, null, null, term: (k)=>kTerms[k]!),
    '2 תרומות החודש · ₪100 + \$50',
    '₪+\$',
  );
  n++;

  // 3) מפריד-אלפים he-IL.
  _eq(
    donCalMonthLine([
      {'date': '2026-08-05', 'amount': 1234, 'cur': '₪'},
    ], _inAug, null, null, term: (k)=>kTerms[k]!),
    '1 תרומות החודש · ₪1,234',
    'אלפים',
  );
  n++;

  // 4) דולר בלבד.
  _eq(
    donCalMonthLine([
      {'date': '2026-08-01', 'amount': 200, 'cur': '\$'},
    ], _inAug, null, null, term: (k)=>kTerms[k]!),
    '1 תרומות החודש · \$200',
    '\$בלבד',
  );
  n++;

  // 5) שורות בלי-סכום (קובץ היסטורי).
  _eq(
    donCalMonthLine([
      {'date': '2026-08-02', 'amount': 0, 'cur': ''},
    ], _inAug, null, null, term: (k)=>kTerms[k]!),
    '1 תרומות החודש · סכומים מהקובץ ההיסטורי',
    'היסטורי',
  );
  n++;

  // 6) מחוץ לחודש.
  _eq(
    donCalMonthLine([
      {'date': '2026-07-05', 'amount': 100, 'cur': '₪'},
    ], _inAug, null, null, term: (k)=>kTerms[k]!),
    'אין תרומות מתועדות בחודש זה',
    'מחוץ',
  );
  n++;

  // 7) מונח ארגוני דרך שקע-termOf.
  _eq(
    donCalMonthLine([], _inAug, {
      'terms': {'entity.donations': 'נדבות'},
    }, _termOf, term: (k)=>kTerms[k]!),
    'אין נדבות מתועדות בחודש זה',
    'termOf',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    donCalMonthLine([
          {'date': '2026-08-05', 'amount': 1234, 'cur': '₪'},
        ], _inAug, null, null, term: (k)=>kTerms[k]!) ==
        '1 תרומות החודש · ₪1,234',
    'assert-live guard',
  );

  print('OK donCalMonthLine: $n asserts passed');
}
