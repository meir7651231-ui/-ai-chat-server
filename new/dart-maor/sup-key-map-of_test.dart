// בדיקת-חוזה (רתמת-זהב) · supKeyMapOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-key-map-of.test.mjs
// (אותם קלטים→פלטים; שקע-האמת: (sp)=>((sp.forWho??'').trim()||'_shared_')):
//   1) [{id:'a',forWho:'ישיבה'},{id:'b',forWho:''}] ⇒ size 2 · a⇒'ישיבה' · b⇒'_shared_'
//   2) [{id:'c',forWho:'  כולל  '}]                 ⇒ c⇒'כולל' (ה-trim מהשקע)
//   3) []                                           ⇒ Map ריקה (size 0)
//   4) כפל-id: [{id:'x',forWho:'א'},{id:'x',forWho:'ב'}] ⇒ size 1 · x⇒'ב' (האחרון גובר)
//   5) עיוורון-לשקע: שקע (sp)=>sp.id+'!' · [{id:'z'}] ⇒ z⇒'z!'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sup-key-map-of_test.dart  ⇒ exit 0
import 'sup-key-map-of.dart';

// שקע-האמת כבחוזה — מקביל ל-((sp.forWho ?? '').trim() || '_shared_') במקור-ה-JS.
// הקלטים בדוגמאות הם ASCII/עברית + רווחים רגילים בלבד ⇒ String.trim של Dart
// שקול כאן ל-trim של JS (חוק-16 רלוונטי רק ל-NEL/U+180E שאינם בקלטי-החוזה);
// ה-|| של JS על מחרוזת ⇒ ריקה=falsy ⇒ isEmpty ב-Dart.
dynamic _supKeyOf(dynamic sp) {
  final t = (((sp as Map)['forWho'] ?? '') as String).trim();
  return t.isEmpty ? '_shared_' : t;
}

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=[$got] want=[$want]');
  }
}

void main() {
  var n = 0;

  // 1) ייעוד ⇒ המפתח; ריק ⇒ '_shared_'.
  {
    final m = supKeyMapOf([
      {'id': 'a', 'forWho': 'ישיבה'},
      {'id': 'b', 'forWho': ''},
    ], _supKeyOf);
    _eq(m.length, 2, 'שתי תומכות ⇒ מפה בגודל 2');
    _eq(m['a'], 'ישיבה', "a ⇒ 'ישיבה'");
    _eq(m['b'], '_shared_', "b ריק ⇒ '_shared_'");
  }
  n++;

  // 2) חיטוי-trim מגיע מהשקע.
  {
    final m = supKeyMapOf([
      {'id': 'c', 'forWho': '  כולל  '},
    ], _supKeyOf);
    _eq(m['c'], 'כולל', 'רווחים מחוטאים דרך השקע');
  }
  n++;

  // 3) רשימה ריקה ⇒ מפה ריקה.
  _eq(supKeyMapOf([], _supKeyOf).length, 0, '[] ⇒ Map ריקה');
  n++;

  // 4) כפל-id ⇒ האחרון גובר (סמנטיקת-Map).
  {
    final m = supKeyMapOf([
      {'id': 'x', 'forWho': 'א'},
      {'id': 'x', 'forWho': 'ב'},
    ], _supKeyOf);
    _eq(m.length, 1, 'id כפול ⇒ מפה בגודל 1');
    _eq(m['x'], 'ב', 'id כפול ⇒ הערך האחרון');
  }
  n++;

  // 5) עיוורון-לשקע — הערכים מהשקע בלבד (טוהר חוק-5).
  {
    final m = supKeyMapOf([
      {'id': 'z'},
    ], (sp) => '${(sp as Map)['id']}!');
    _eq(m['z'], 'z!', 'שקע חלופי ⇒ ערכיו כמות-שהם');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    supKeyMapOf([
          {'id': 'a', 'forWho': 'ישיבה'},
        ], _supKeyOf)['a'] ==
        'ישיבה',
    'assert-live guard',
  );

  print('OK supKeyMapOf: $n contract examples passed');
}
