// בדיקת-חוזה · endPair — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/end_pair_test.dart
// הדוגמאות = דוגמאות-החוזה 1-13 (end_pair.contract.md), מהתנהגות-המקור
// connection_resolver.dart:239-302 (ענף align-main ≡ whats-happening-LyY9G).
import 'end_pair.dart';

/// מימוש-המקור של שקע-הנירמול (connection_resolver.dart:31, verbatim).
String _normSize(String s) => s.replaceAll('"', '').trim();

ProductEnd _e(String type, String size) =>
    ProductEnd(connectorTypeId: type, sizeValue: size);

void _check(
  ConnectResult r, {
  required bool mates,
  required String label,
  RuleSeverity? severity,
  CompatibilityRule? rule,
  required String name,
}) {
  if (r.mates != mates ||
      r.methodLabelHe != label ||
      r.severity != severity ||
      !identical(r.rule, rule)) {
    throw StateError('FAIL [$name]: got(mates=${r.mates},label=${r.methodLabelHe},'
        'sev=${r.severity},rule=${r.rule?.id}) '
        'want(mates=$mates,label=$label,sev=$severity,rule=${rule?.id})');
  }
}

void main() {
  var n = 0;
  ConnectResult run(ProductEnd a, ProductEnd b, List<CompatibilityRule> rules) =>
      endPair(a, b, rules: rules, normalizeSize: _normSize);

  // 1. forward + exactSame; נירמול-`"` בקצה ('1/2' == '1/2"').
  const r1 = CompatibilityRule(
      id: 'R1', aTypeId: 'pex', bTypeId: 'pex',
      sizeMatch: SizeMatch.exactSame, methodLabelHe: 'הברגה');
  _check(run(_e('pex', '1/2'), _e('pex', '1/2"'), const [r1]),
      mates: true, label: 'הברגה', rule: r1, name: '1 forward exactSame+norm');
  n++;

  // 2. reverse: חוקה (pex,cu), קצוות (cu,pex).
  const r2 = CompatibilityRule(
      id: 'R2', aTypeId: 'pex', bTypeId: 'cu',
      sizeMatch: SizeMatch.exactSame, methodLabelHe: 'לחיצה');
  _check(run(_e('cu', '3/4'), _e('pex', '3/4'), const [r2]),
      mates: true, label: 'לחיצה', rule: r2, name: '2 reverse match');
  n++;

  // 3. אף חוקה לא מכסה את זוג-הטיפוסים ⇒ _noRule (severity:null, rule:null).
  _check(run(_e('pvc', '1/2'), _e('pex', '1/2'), const [r2]),
      mates: false, label: '', name: '3 no-rule');
  n++;

  // 4. size-miss יחיד ⇒ severity=onMismatch של החוקה, rule=החוקה.
  const r4 = CompatibilityRule(
      id: 'R4', aTypeId: 'pex', bTypeId: 'pex',
      sizeMatch: SizeMatch.exactSame, methodLabelHe: 'הברגה',
      onMismatch: RuleSeverity.critical);
  _check(run(_e('pex', '1/2'), _e('pex', '3/4'), const [r4]),
      mates: false, label: '', severity: RuleSeverity.critical, rule: r4,
      name: '4 size-miss severity');
  n++;

  // 5. miss אינו עוצר את הסריקה — חוקה מאוחרת (anyToAny) מחברת.
  const r5 = CompatibilityRule(
      id: 'R5', aTypeId: 'pex', bTypeId: 'pex',
      sizeMatch: SizeMatch.anyToAny, methodLabelHe: 'מצמד');
  _check(run(_e('pex', '1/2'), _e('pex', '3/4'), const [r4, r5]),
      mates: true, label: 'מצמד', rule: r5, name: '5 scan continues past miss');
  n++;

  // 6. שני misses ⇒ ה-**ראשון** מעצב את הכישלון (??=).
  const r6 = CompatibilityRule(
      id: 'R6', aTypeId: 'pex', bTypeId: 'pex',
      sizeMatch: SizeMatch.exactSame, methodLabelHe: 'x',
      onMismatch: RuleSeverity.info);
  const r6a = CompatibilityRule(
      id: 'R6a', aTypeId: 'pex', bTypeId: 'pex',
      sizeMatch: SizeMatch.exactSame, methodLabelHe: 'y',
      onMismatch: RuleSeverity.warning);
  _check(run(_e('pex', '1/2'), _e('pex', '3/4'), const [r6a, r6]),
      mates: false, label: '', severity: RuleSeverity.warning, rule: r6a,
      name: '6 first miss wins');
  n++;

  // 7. tableLookup forward + נירמול-`"` בקצה מול תא-הטבלה.
  const r7 = CompatibilityRule(
      id: 'R7', aTypeId: 'dn', bTypeId: 'od',
      sizeMatch: SizeMatch.tableLookup, methodLabelHe: 'מעבר',
      sizeTable: [['1/2', '3/4']]);
  _check(run(_e('dn', '1/2'), _e('od', '3/4"'), const [r7]),
      mates: true, label: 'מעבר', rule: r7, name: '7 tableLookup forward+norm');
  n++;

  // 8. tableLookup reverse ⇒ מחפשים [endB, endA] (הצד שמגלם aTypeId = עמודה 0).
  _check(run(_e('od', '3/4'), _e('dn', '1/2'), const [r7]),
      mates: true, label: 'מעבר', rule: r7, name: '8 tableLookup reverse');
  n++;

  // 9. הטבלה אינה סימטרית — forward עם עמודות הפוכות ⇒ miss (warning ברירת-מחדל).
  _check(run(_e('dn', '3/4'), _e('od', '1/2'), const [r7]),
      mates: false, label: '', severity: RuleSeverity.warning, rule: r7,
      name: '9 table orientation asymmetric');
  n++;

  // 10. tableLookup עם sizeTable:null ⇒ לעולם לא מתאים ⇒ size-miss.
  const r10 = CompatibilityRule(
      id: 'R10', aTypeId: 'dn', bTypeId: 'od',
      sizeMatch: SizeMatch.tableLookup, methodLabelHe: 'מעבר');
  _check(run(_e('dn', '1/2'), _e('od', '1/2'), const [r10]),
      mates: false, label: '', severity: RuleSeverity.warning, rule: r10,
      name: '10 null table never matches');
  n++;

  // 11. שורת-טבלה קצרה מ-2 (debris) מדולגת; השורה התקינה מחברת.
  const r11 = CompatibilityRule(
      id: 'R11', aTypeId: 'dn', bTypeId: 'od',
      sizeMatch: SizeMatch.tableLookup, methodLabelHe: 'מעבר',
      sizeTable: [['1/2'], ['1/2', '1/2']]);
  _check(run(_e('dn', '1/2'), _e('od', '1/2'), const [r11]),
      mates: true, label: 'מעבר', rule: r11, name: '11 short row skipped');
  n++;

  // 12. rules ריק ⇒ _noRule.
  _check(run(_e('pex', '1/2'), _e('pex', '1/2'), const []),
      mates: false, label: '', name: '12 empty rules');
  n++;

  // 13. שתי חוקות מחברות ⇒ הראשונה-בסדר-הרשימה מנצחת (authored order).
  const r13a = CompatibilityRule(
      id: 'R13a', aTypeId: 'pex', bTypeId: 'pex',
      sizeMatch: SizeMatch.anyToAny, methodLabelHe: 'ראשונה');
  const r13b = CompatibilityRule(
      id: 'R13b', aTypeId: 'pex', bTypeId: 'pex',
      sizeMatch: SizeMatch.anyToAny, methodLabelHe: 'שנייה');
  _check(run(_e('pex', '1'), _e('pex', '2'), const [r13a, r13b]),
      mates: true, label: 'ראשונה', rule: r13a, name: '13 list order wins');
  n++;

  // מנגנון-השקע: normalizeSize מוזרק — נירמול-זהות הופך את דוגמה-1 ל-miss
  // (מוכיח שהנירמול אינו צרוב במנוע).
  final ident = endPair(_e('pex', '1/2'), _e('pex', '1/2"'),
      rules: const [r1], normalizeSize: (s) => s);
  if (ident.mates != false || ident.severity != RuleSeverity.warning) {
    throw StateError('FAIL [14 socket proof]: got mates=${ident.mates}');
  }
  n++;

  assert(run(_e('pex', '1/2'), _e('pex', '1/2'), const [r1]).mates,
      'assert-live guard');

  print('OK endPair: $n asserts passed (1+2 · טיפוסים-מוטבעים + שקעי rules/normalizeSize)');
}
