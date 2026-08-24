// בדיקת-חוזה (רתמת-זהב) · explodeSupporter — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/explode-supporter.test.mjs
// (אותם קלטים→פלטים; השקע pk = (d)=>((d.purpose??'').trim()||'_shared_')):
//   1) {id:'s1'}                              ⇒ []
//   2) {id:'s1',donations:[d7]}               ⇒ [{id:'D-7',supporterId:'s1',pkey:'חתן',donation:d7}]
//   3) {donations:[{rid:'D-8',amount:50}]}    ⇒ pkey='_shared_'  (ייעוד-ריק)
//   4) donation === d7                        (זהות-הפניה, identical)
//   5) donations=[D-9,D-2]                    ⇒ ['D-9','D-2']    (סדר-מקור, אפס מיון)
//   6) {hist:[...],donations:[d7]}            ⇒ בדיוק 4 שדות id/supporterId/pkey/donation
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/explode-supporter_test.dart  ⇒ exit 0
import 'explode-supporter.dart';

// שקע-הבדיקה — מקביל ל-pk = (d)=>((d.purpose??'').trim()||'_shared_') במקור-ה-JS.
String _pk(Map<String, dynamic> d) {
  final p = ((d['purpose'] as String?) ?? '').trim();
  return p.isEmpty ? '_shared_' : p;
}

void _fail(String m) => throw StateError('FAIL: ' + m);

void main() {
  var n = 0;

  // 1) בלי donations ⇒ [].
  final r1 = explodeSupporter(<String, dynamic>{'id': 's1'}, _pk);
  if (r1.isNotEmpty) _fail('תומך בלי donations לא החזיר []');
  n++;

  // 2) מסמך מלא.
  final d7 = <String, dynamic>{'rid': 'D-7', 'amount': 100, 'purpose': 'חתן'};
  final r2 = explodeSupporter(<String, dynamic>{'id': 's1', 'donations': [d7]}, _pk);
  if (r2.length != 1) _fail('מסמך D-7: אורך שגוי (${r2.length})');
  if (r2[0]['id'] != 'D-7' ||
      r2[0]['supporterId'] != 's1' ||
      r2[0]['pkey'] != 'חתן') {
    _fail('מסמך D-7 שגוי');
  }
  if (!identical(r2[0]['donation'], d7)) _fail('מסמך D-7: donation אינו זהות-הפניה');
  n++;

  // 3) ייעוד ריק ⇒ משותף.
  final r3 = explodeSupporter(<String, dynamic>{
    'id': 's1',
    'donations': [
      <String, dynamic>{'rid': 'D-8', 'amount': 50},
    ],
  }, _pk);
  if (r3[0]['pkey'] != '_shared_') _fail('ייעוד-ריק לא הפך _shared_');
  n++;

  // 4) ביט-זהה — זהות-הפניה.
  final r4 = explodeSupporter(<String, dynamic>{'id': 's1', 'donations': [d7]}, _pk);
  if (!identical(r4[0]['donation'], d7)) {
    _fail('התרומה הועתקה במקום להישמר בזהות-הפניה');
  }
  n++;

  // 5) סדר-המקור נשמר, אפס מיון.
  final r5 = explodeSupporter(<String, dynamic>{
    'id': 's1',
    'donations': [
      <String, dynamic>{'rid': 'D-9', 'date': '2026-03-01'},
      <String, dynamic>{'rid': 'D-2', 'date': '2026-01-01'},
    ],
  }, _pk);
  if (r5.map((x) => x['id']).join('|') != 'D-9|D-2') _fail('הסדר שונה/מוין');
  n++;

  // 6) hist לא דולף + בדיוק 4 שדות.
  final r6 = explodeSupporter(<String, dynamic>{
    'id': 's1',
    'hist': [
      <String, dynamic>{'ils': 200},
    ],
    'donations': [d7],
  }, _pk);
  for (final x in r6) {
    final keys = x.keys.toList()..sort();
    if (keys.join(',') != 'donation,id,pkey,supporterId') {
      _fail('שדה זר (hist?) דלף למסמך: ${keys.join(',')}');
    }
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    explodeSupporter(<String, dynamic>{'id': 's1', 'donations': [d7]}, _pk)[0]['pkey'] ==
        'חתן',
    'assert-live guard',
  );

  print('OK explodeSupporter: $n asserts passed');
}
