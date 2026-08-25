// בדיקת-חוזה (רתמת-זהב) · modelMeta — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/model-meta.test.mjs:
//   1) {model:'punch', size:10} ⇒ {label:'כרטיסייה · 10 ניקובים', bg:'#fdf1d4', c:'#9a6414'}
//   2) {model:'half_year'}      ⇒ {label:'מנוי חצי-שנתי', bg:'#e7edf5', c:'#3a5a86'}
//   3) {model:'year'}           ⇒ {label:'מנוי שנתי', bg:'#efe7f3', c:'#7c3aed'}
//   4) {model:'monthly'}        ⇒ {label:'מנוי חודשי', bg:'#e4f5ea', c:'#12803c'} (ברירת-מחדל)
//   5) {model:undefined}        ⇒ אותה ברירת-מחדל (כל לא-מוכר נופל לשם)
//   6) punch size=1 ⇒ label='כרטיסייה · 1 ניקובים' (שיבוץ ישיר, בלי דין-יחיד)
// השוואת-Map = מספר-מפתחות + מפתח-מפתח (רוח כלל-8: אין join/JSON — גבולות מפורשים).
// אם עובר ⇒ Dart≡JS. כשל ⇒ StateError.
// הרצה: dart run --enable-asserts new/dart-maor/model-meta_test.dart  ⇒ OK
import 'model-meta.dart';

/// כלל-8 (מוסב ל-Map): אותם מפתחות בדיוק + ערך-ערך בהשוואה ישירה.
void _eqMap(String name, Map<String, dynamic> got, Map<String, dynamic> want) {
  if (got.length != want.length) {
    throw StateError('$name: מספר-מפתחות ${got.length} ≠ ${want.length} · got=$got');
  }
  for (final k in want.keys) {
    if (!got.containsKey(k)) throw StateError('$name: חסר מפתח "$k" · got=$got');
    if (got[k] != want[k]) {
      throw StateError('$name: [$k] "${got[k]}" ≠ "${want[k]}"');
    }
  }
}

void main() {
  var n = 0;

  // 1) כרטיסייה — size משובץ.
  _eqMap('1 punch size=10', modelMeta({'model': 'punch', 'size': 10}),
      {'label': 'כרטיסייה · 10 ניקובים', 'bg': '#fdf1d4', 'c': '#9a6414'});
  n++;

  // 2) חצי-שנתי.
  _eqMap('2 half_year', modelMeta({'model': 'half_year'}),
      {'label': 'מנוי חצי-שנתי', 'bg': '#e7edf5', 'c': '#3a5a86'});
  n++;

  // 3) שנתי.
  _eqMap('3 year', modelMeta({'model': 'year'}),
      {'label': 'מנוי שנתי', 'bg': '#efe7f3', 'c': '#7c3aed'});
  n++;

  // 4) חודשי — ענף ברירת-המחדל.
  _eqMap('4 monthly ברירת-מחדל', modelMeta({'model': 'monthly'}),
      {'label': 'מנוי חודשי', 'bg': '#e4f5ea', 'c': '#12803c'});
  n++;

  // 5) model לא-מוכר/חסר — אותה ברירת-מחדל. (ב-JS: {model:undefined};
  //    ב-Dart: null מפורש — שניהם אינם 'punch'/'half_year'/'year' ⇒ אותו ענף.)
  _eqMap('5 model חסר ⇒ חודשי', modelMeta({'model': null}),
      {'label': 'מנוי חודשי', 'bg': '#e4f5ea', 'c': '#12803c'});
  n++;

  // 6) punch size=1 — שיבוץ ישיר בלי דין-יחיד.
  final six = modelMeta({'model': 'punch', 'size': 1});
  if (six['label'] != 'כרטיסייה · 1 ניקובים') {
    throw StateError('6 punch size=1: label "${six['label']}" ≠ "כרטיסייה · 1 ניקובים"');
  }
  n++;

  // תוספת-נאמנות (חוק-2, מעבר לחוזה): punch בלי size ⇒ 'undefined' כמו ב-JS;
  // punch עם size:null ⇒ 'null'. מוודא שהבחנת חסר/null לא נשברת.
  if (modelMeta({'model': 'punch'})['label'] != 'כרטיסייה · undefined ניקובים') {
    throw StateError('7 punch בלי size: ציפינו undefined-בשיבוץ כמו JS');
  }
  n++;
  if (modelMeta({'model': 'punch', 'size': null})['label'] != 'כרטיסייה · null ניקובים') {
    throw StateError('8 punch size=null: ציפינו null-בשיבוץ כמו JS');
  }
  n++;

  print('OK modelMeta: $n asserts passed');
}
