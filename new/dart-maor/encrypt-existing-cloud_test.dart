// בדיקת-חוזה (רתמת-זהב) · encryptExistingCloud — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/encrypt-existing-cloud.test.mjs.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/encrypt-existing-cloud_test.dart  ⇒ exit 0
import 'encrypt-existing-cloud.dart';

var _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ $msg');
    _f = 1;
  }
}

Future<void> main() async {
  final Map<String, dynamic> db = {
    'supporters': [
      {'id': 's1'}
    ],
    'families': <dynamic>[]
  };
  final dek = {'key': true};
  final diff = {'sets': <dynamic>[], 'deletes': <dynamic>[], 'meta': null};
  final keyMap = {'s1': 'k'};

  // 1+2: כל שקע נקרא פעם-אחת, עם הרפרנסים המדויקים
  {
    final full = <Object?>[];
    final sup = <Object?>[];
    final push = <List<Object?>>[];
    await encryptExistingCloud(
      db,
      dek,
      (d, k, m) async {
        push.add([d, k, m]);
      },
      (d) {
        full.add(d);
        return diff;
      },
      (s) {
        sup.add(s);
        return keyMap;
      },
    );
    _ok(full.length == 1 && identical(full[0], db),
        'fullDbDiff: פעם-אחת עם db עצמו');
    _ok(sup.length == 1 && identical(sup[0], db['supporters']),
        'supKeyMapOf: פעם-אחת עם db.supporters');
    _ok(
      push.length == 1 &&
          identical(push[0][0], diff) &&
          identical(push[0][1], dek) &&
          identical(push[0][2], keyMap),
      'pushDiff: פעם-אחת עם (diff, dek, keyMap) באותה רפרנס',
    );
  }

  // 3: await אמיתי — הדגל דלוק כשהאטום חוזר
  {
    var done = false;
    await encryptExistingCloud(
      db,
      dek,
      (d, k, m) async {
        await Future<void>.delayed(const Duration(milliseconds: 10));
        done = true;
      },
      (d) => diff,
      (s) => keyMap,
    );
    _ok(done, 'האטום חזר לפני ש-pushDiff סיים');
  }

  // 4: דחיית pushDiff מתפשטת
  {
    var threw = false;
    try {
      await encryptExistingCloud(
        db,
        dek,
        (d, k, m) async => throw StateError('כשל-רשת'),
        (d) => diff,
        (s) => keyMap,
      );
    } catch (_) {
      threw = true;
    }
    _ok(threw, 'דחיית-pushDiff נבלעה');
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  {
    var guardThrew = false;
    try {
      await encryptExistingCloud(
        db,
        dek,
        (d, k, m) async => throw StateError('rej'),
        (d) => diff,
        (s) => keyMap,
      );
    } catch (_) {
      guardThrew = true;
    }
    assert(guardThrew, 'assert-live guard');
  }

  if (_f != 0) {
    throw StateError('encrypt-existing-cloud golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print('✓ encrypt-existing-cloud: 4 דוגמאות-חוזה — ירוק (Dart≡JS)');
}
