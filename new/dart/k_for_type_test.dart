// בדיקת-חוזה · kForType — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/k_for_type_test.dart
import 'k_for_type.dart';
import '../dart-data/k_for_type-data.dart' as kd;

void _eq(double got, double want, String label) {
  if ((got - want).abs() >= 1e-12) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — טבלת-המקור (verbatim) —
  _eq(kForType('ברך', table: kd.kKFactors), 0.9, '1 elbow');            n++;
  _eq(kForType('זווית', table: kd.kKFactors), 0.9, '2 elbow alias');    n++;
  _eq(kForType('טי', table: kd.kKFactors), 1.5, '3 tee');               n++;
  _eq(kForType('מקשר', table: kd.kKFactors), 0.1, '4 coupling');        n++;
  _eq(kForType('ניפל', table: kd.kKFactors), 0.05, '5 extension');      n++;
  _eq(kForType('בושינג', table: kd.kKFactors), 0.2, '6 reducer');       n++;
  _eq(kForType('ברז גן', table: kd.kKFactors), 0.05, '7 garden valve'); n++;
  _eq(kForType('אל חזור', table: kd.kKFactors), 2.0, '8 check valve');  n++;
  _eq(kForType('מסנן', table: kd.kKFactors), 5.0, '9 strainer');        n++;
  _eq(kForType('מקטין', table: kd.kKFactors), 10.0, '10 prv');          n++;
  _eq(kForType('משחרר', table: kd.kKFactors), 0.0, '11 air vent');      n++;
  _eq(kForType('פקק', table: kd.kKFactors), 0.0, '12 cap terminal');    n++;

  // — עדשה-עוינת (CURRICULUM #6): null / ריק / רווח-נוסף / לא-מוכר ⇒ default 0.3 —
  _eq(kForType(null, table: kd.kKFactors), 0.3, '13 null ⇒ default');   n++;
  _eq(kForType('', table: kd.kKFactors), 0.3, '14 empty ⇒ default');    n++;
  _eq(kForType('ברז ', table: kd.kKFactors), 0.3, '15 trailing-space ⇒ default'); n++;
  _eq(kForType('צינור', table: kd.kKFactors), 0.3, '16 unknown ⇒ default');       n++;

  // — כל שאר ה-alias-ים בכל case (נאמנות-מקור מלאה) —
  _eq(kForType('מסעף', table: kd.kKFactors), 1.5, 'tee alias מסעף');    n++;
  _eq(kForType('הסתעפות', table: kd.kKFactors), 1.5, 'tee alias הסתעפות'); n++;
  _eq(kForType('מצמד', table: kd.kKFactors), 0.1, 'coupling מצמד');     n++;
  _eq(kForType('מחבר', table: kd.kKFactors), 0.1, 'coupling מחבר');     n++;
  _eq(kForType('מופה', table: kd.kKFactors), 0.1, 'coupling מופה');     n++;
  _eq(kForType('רקורד', table: kd.kKFactors), 0.1, 'coupling רקורד');   n++;
  _eq(kForType('מאריך', table: kd.kKFactors), 0.05, 'extension מאריך'); n++;
  _eq(kForType('ברז', table: kd.kKFactors), 0.05, 'ball valve ברז');    n++;
  _eq(kForType('מצוף', table: kd.kKFactors), 4.0, 'float valve');       n++;
  _eq(kForType('כפה', table: kd.kKFactors), 0.0, 'terminal כפה');       n++;
  _eq(kForType('אטם', table: kd.kKFactors), 0.0, 'terminal אטם');       n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(kForType('ברך', table: kd.kKFactors) == 0.9, 'assert-live guard');

  print('OK kForType: $n asserts passed');
}
