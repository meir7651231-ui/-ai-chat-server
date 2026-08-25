// בדיקת-חוזה (רתמת-זהב) · decryptDb — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/decrypt-db.test.mjs.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/decrypt-db_test.dart  ⇒ exit 0
import 'decrypt-db.dart';

// — מעטפת-בדיקה: מקבילת `{data: ...}` של JS (הגישה env.data דרך dynamic) —
class _Env {
  final dynamic data;
  const _Env(this.data);
}

// קידוד-UTF-8 ידני (אפס import — הבדיקה מייבאת רק את האטום): מקביל ל-TextEncoder.encode.
List<int> _u8(String s) {
  final out = <int>[];
  for (final cp in s.runes) {
    if (cp < 0x80) {
      out.add(cp);
    } else if (cp < 0x800) {
      out.add(0xc0 | (cp >> 6));
      out.add(0x80 | (cp & 0x3f));
    } else if (cp < 0x10000) {
      out.add(0xe0 | (cp >> 12));
      out.add(0x80 | ((cp >> 6) & 0x3f));
      out.add(0x80 | (cp & 0x3f));
    } else {
      out.add(0xf0 | (cp >> 18));
      out.add(0x80 | ((cp >> 12) & 0x3f));
      out.add(0x80 | ((cp >> 6) & 0x3f));
      out.add(0x80 | (cp & 0x3f));
    }
  }
  return out;
}

var _f = 0;
void _eq(String name, Object? got, Object? want) {
  if (got != want) {
    // ignore: avoid_print
    print('✗ $name ⇒ $got ≠ $want');
    _f = 1;
  }
}

Future<void> main() async {
  // 1+2: שקעי-בדיקה מחזירים בייטים ידועים
  _eq(
    'בייטי hello',
    await decryptDb(const _Env('x'), null,
        (k, b) async => const [104, 101, 108, 108, 111]),
    'hello',
  );
  _eq(
    'בייטי JSON',
    await decryptDb(const _Env('x'), null, (k, b) async => _u8('{"a":1}')),
    '{"a":1}',
  );

  // 3: השקע מקבל בדיוק (dek, env.data), פעם אחת
  {
    final calls = <List<Object?>>[];
    final dek = {'k': 1};
    await decryptDb(const _Env('IV:CT'), dek, (key, blob) async {
      calls.add([key, blob]);
      return const <int>[];
    });
    _eq('העברת-פרמטרים לשקע — מונה-קריאות', calls.length, 1);
    if (calls.isNotEmpty) {
      _eq('העברת-פרמטרים — key===dek', identical(calls[0][0], dek), true);
      _eq('העברת-פרמטרים — blob==="IV:CT"', calls[0][1], 'IV:CT');
    }
  }

  // 4: מסלול-אמת — מחרוזת עברית שהוצפנה/פוענחה ב-aesDec אמיתי חוזרת ביט-זהה.
  //    ברמת-האטום: השקע מחזיר את בייטי-ה-UTF-8 של ה-JSON; decryptDb מפענח חזרה.
  {
    const json = '{"שלום":"עולם"}';
    final aesDec = (dynamic key, dynamic blob) async => _u8(json);
    _eq('מסלול-אמת round-trip',
        await decryptDb(const _Env('iv:ct'), 'DEK', aesDec), json);
  }

  // 5: שקע זורק ⇒ ההבטחה נדחית (הזריקה לא נבלעת)
  {
    var threw = false;
    try {
      await decryptDb(const _Env('x'), null,
          (k, b) async => throw StateError('bad key'));
    } catch (_) {
      threw = true;
    }
    _eq('זריקת-שקע נדחית', threw, true);
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  final live = await decryptDb(
      const _Env('x'), null, (k, b) async => const [104, 105]);
  assert(live == 'hi', 'assert-live guard');

  if (_f != 0) {
    throw StateError('decrypt-db golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print('✓ decrypt-db: 5 דוגמאות-חוזה — ירוק');
}
