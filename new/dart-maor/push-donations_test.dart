// בדיקת-חוזה (רתמת-זהב) · pushDonations — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות בדיוק למקור-ה-JS new/atoms/push-donations.test.mjs
// (אותם קלטים→פלטים): (1) set יחיד dek=null · (2) delete · (3) הצפנה pkey-מחוץ-למעטפה ·
// (4) חיתוך 401⇒400+1 עם commit-לפני-batch-שני · (5) diff ריק ⇒ אפס batches. אם עובר ⇒ Dart≡JS.
// זיוף-Firestore: יומן-אירועים גלובלי (open/set/delete/commit + n של האצווה) — כמו mkFs ב-JS.
// השוואת-גוף/הפניה סדר-מפתחות-רגיש (מחקה JSON.stringify של המקור; כלל-המרה 8 — איבר-איבר).
// הרצה: dart run --enable-asserts new/dart-maor/push-donations_test.dart  ⇒ exit 0
import 'push-donations.dart';

// ---- זיוף-Firestore (מקביל ל-mkFs ב-JS) ----
class _Fake {
  final List<Map> log = [];
  int batchN = 0;
  Map doc(dynamic db, dynamic col, dynamic id) => {'db': db, 'col': col, 'id': id};
  _Batch writeBatch(dynamic db) {
    final n = ++batchN;
    log.add({'ev': 'open', 'n': n, 'db': db});
    return _Batch(this, n);
  }
}

class _Batch {
  final _Fake f;
  final int n;
  _Batch(this.f, this.n);
  void set(dynamic ref, dynamic body) =>
      f.log.add({'ev': 'set', 'n': n, 'ref': ref, 'body': body});
  void delete(dynamic ref) => f.log.add({'ev': 'delete', 'n': n, 'ref': ref});
  Future<void> commit() async => f.log.add({'ev': 'commit', 'n': n});
}

// deepEq סדר-מפתחות-רגיש — מחקה JSON.stringify (Map: אותם מפתחות באותו סדר + ערכים).
bool _deepEq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    final ka = a.keys.toList(), kb = b.keys.toList();
    if (ka.length != kb.length) return false;
    for (var i = 0; i < ka.length; i++) {
      if (ka[i] != kb[i]) return false;
      if (!_deepEq(a[ka[i]], b[kb[i]])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ $msg');
    _f = 1;
  }
}

Future<void> main() async {
  final db = {'tag': 'db'};
  String scopedDonations() => 'orgs/demo/donations';

  // 1) set יחיד, dek=null — batch יחיד, גוף {pkey, supporterId, ...donation}
  {
    final fake = _Fake();
    await pushDonations(
      {
        'sets': [
          {
            'id': 'R-7',
            'supporterId': 'sp1',
            'pkey': 'P1',
            'donation': {'amount': 180, 'date': '2026-01-05'}
          }
        ],
        'deletes': []
      },
      null,
      db,
      scopedDonations,
      fake,
      (p, dek) async => throw StateError('encryptDoc נקרא בלי dek'),
    );
    final sets = fake.log.where((e) => e['ev'] == 'set').toList();
    final commits = fake.log.where((e) => e['ev'] == 'commit').toList();
    ok(sets.length == 1 && commits.length == 1, 'דוגמה 1: מספר set/commit שגוי');
    ok(_deepEq(sets[0]['ref'], {'db': db, 'col': 'orgs/demo/donations', 'id': 'R-7'}),
        'דוגמה 1: הפניית-doc שגויה');
    ok(
        _deepEq(sets[0]['body'],
            {'pkey': 'P1', 'supporterId': 'sp1', 'amount': 180, 'date': '2026-01-05'}),
        'דוגמה 1: גוף-המסמך שגוי');
    ok((sets[0]['body'] as Map).keys.first == 'pkey', 'דוגמה 1: pkey אינו השדה הראשון');
  }

  // 2) delete
  {
    final fake = _Fake();
    await pushDonations(
        {'sets': [], 'deletes': ['R-9']}, null, db, scopedDonations, fake, null);
    final dels = fake.log.where((e) => e['ev'] == 'delete').toList();
    ok(
        dels.length == 1 &&
            _deepEq(dels[0]['ref'], {'db': db, 'col': 'orgs/demo/donations', 'id': 'R-9'}),
        'דוגמה 2: delete שגוי');
  }

  // 3) הצפנה — pkey מחוץ למעטפה, encryptDoc בלי pkey
  {
    final fake = _Fake();
    final encCalls = <Map>[];
    // enc = p.toString() דטרמיניסטי (מקביל ל-JSON.stringify של המקור — עקבי בין שני הצדדים).
    Future<Map> encryptDoc(Map p, dynamic dek) async {
      encCalls.add({'p': p, 'dek': dek});
      return {'enc': p.toString(), 'iv': 'IV'};
    }

    await pushDonations(
      {
        'sets': [
          {
            'id': 'R-7',
            'supporterId': 'sp1',
            'pkey': 'P1',
            'donation': {'amount': 180, 'date': '2026-01-05'}
          }
        ],
        'deletes': []
      },
      'DEK',
      db,
      scopedDonations,
      fake,
      encryptDoc,
    );
    ok(encCalls.length == 1 && encCalls[0]['dek'] == 'DEK',
        'דוגמה 3: encryptDoc לא נקרא עם ה-dek');
    ok(
        _deepEq(encCalls[0]['p'],
            {'supporterId': 'sp1', 'amount': 180, 'date': '2026-01-05'}),
        'דוגמה 3: pkey דלף לתוך המעטפה');
    final body = fake.log.firstWhere((e) => e['ev'] == 'set')['body'] as Map;
    final expectedInner = {'supporterId': 'sp1', 'amount': 180, 'date': '2026-01-05'};
    ok(
        _deepEq(body, {'pkey': 'P1', 'enc': expectedInner.toString(), 'iv': 'IV'}),
        'דוגמה 3: הגוף המוצפן שגוי (pkey חייב להישאר plaintext מחוץ למעטפה)');
  }

  // 4) חיתוך-אצווה: 401 sets ⇒ 400+1, commit ראשון לפני batch שני
  {
    final fake = _Fake();
    final sets = List.generate(
        401,
        (i) => {
              'id': 'R-$i',
              'supporterId': 'sp',
              'pkey': 'P',
              'donation': {'amount': i}
            });
    await pushDonations(
        {'sets': sets, 'deletes': []}, null, db, scopedDonations, fake, null);
    final b1 = fake.log.where((e) => e['ev'] == 'set' && e['n'] == 1).length;
    final b2 = fake.log.where((e) => e['ev'] == 'set' && e['n'] == 2).length;
    ok(b1 == 400 && b2 == 1, 'דוגמה 4: חיתוך $b1+$b2 ≠ 400+1');
    ok(fake.log.where((e) => e['ev'] == 'commit').length == 2, 'דוגמה 4: מספר commits ≠ 2');
    final iCommit1 =
        fake.log.indexWhere((e) => e['ev'] == 'commit' && e['n'] == 1);
    final iOpen2 = fake.log.indexWhere((e) => e['ev'] == 'open' && e['n'] == 2);
    ok(iCommit1 < iOpen2, 'דוגמה 4: ה-batch השני נפתח לפני commit הראשון');
  }

  // 5) diff ריק ⇒ אפס batches
  {
    final fake = _Fake();
    await pushDonations(
        {'sets': [], 'deletes': []}, null, db, scopedDonations, fake, null);
    ok(fake.log.isEmpty, 'דוגמה 5: diff ריק פתח batch');
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_f == 0, 'רתמת-הזהב אדומה — ראה ✗ למעלה');
  if (_f != 0) throw StateError('FAIL push-donations golden harness');
  print('OK pushDonations: כל 5 דוגמאות-החוזה עברו — Dart≡JS');
}
