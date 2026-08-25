// בדיקת-חוזה (רתמת-זהב) · createCloudKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/create-cloud-key.test.mjs.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/create-cloud-key_test.dart  ⇒ exit 0
import 'create-cloud-key.dart';

String _msgOf(Object e) => (e as dynamic).message.toString();

var _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ $msg');
    _f = 1;
  }
}

Future<void> main() async {
  // 1–3 — מסלול מוצלח + פרוטוקול-הקריאות (מקבילי-ביט ל-JS-test)
  final encCalls = <List<Object?>>[];
  final openCalls = <List<Object?>>[];
  Future<dynamic> encryptDb(String j, dynamic p, dynamic r) async {
    encCalls.add([j, p, r]);
    return {'v': 2, 'p': p, 'r': r, 'j': j};
  }

  Future<dynamic> openDek(dynamic env, dynamic s, String via) async {
    openCalls.add([env, s, via]);
    return 'DEK:$s';
  }

  final out = await createCloudKey('סוד7', 'REC-42', encryptDb, openDek);
  _ok(
    out['dek'] == 'DEK:סוד7' &&
        out['env']['v'] == 2 &&
        out['env']['p'] == 'סוד7' &&
        out['env']['r'] == 'REC-42' &&
        out['env']['j'] == '',
    '1 env+dek',
  );
  _ok(
    encCalls.length == 1 &&
        encCalls[0][0] == '' &&
        encCalls[0][1] == 'סוד7' &&
        encCalls[0][2] == 'REC-42',
    "2 encryptDb פעם אחת עם json=''",
  );
  _ok(
    openCalls.length == 1 &&
        identical(openCalls[0][0], out['env']) &&
        openCalls[0][1] == 'סוד7' &&
        openCalls[0][2] == 'pass',
    "3 openDek(env, password, 'pass')",
  );

  // 4 — openDek⇒null זורק
  String threw = '';
  try {
    await createCloudKey(
      'x',
      'y',
      (j, p, r) async => <String, dynamic>{},
      (env, s, via) async => null,
    );
  } catch (e) {
    threw = _msgOf(e);
  }
  _ok(threw == 'יצירת מפתח-הצפנה נכשלה', '4 null ⇒ זריקה');

  // 5 — שגיאת encryptDb מבעבעת
  String bubbled = '';
  try {
    await createCloudKey(
      'x',
      'y',
      (j, p, r) async => throw StateError('boom'),
      (env, s, via) async => 'd',
    );
  } catch (e) {
    bubbled = _msgOf(e);
  }
  _ok(bubbled == 'boom', '5 בעבוע');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  var guardThrew = false;
  try {
    await createCloudKey('x', 'y', (j, p, r) async => <String, dynamic>{},
        (env, s, via) async => null);
  } catch (_) {
    guardThrew = true;
  }
  assert(guardThrew, 'assert-live guard');

  if (_f != 0) {
    throw StateError('create-cloud-key golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print('✓ create-cloud-key: 5 דוגמאות-חוזה (שקעי encryptDb/openDek) — ירוק (Dart≡JS)');
}
