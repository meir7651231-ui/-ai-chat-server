// בדיקת-חוזה (רתמת-זהב) · pushDiff — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/push-diff.test.mjs
// (אותם קלטים→פלטים; ה-fake הגלובלי רושם open/set/delete/commit/meta חוצה-צברים).
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts new/dart-maor/push-diff_test.dart ⇒ exit 0
import 'push-diff.dart';

int _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    // ignore: avoid_print
    print('✗ $msg');
  }
}

/// שוויון-עמוק (מקביל ל-`JSON.stringify(a)===JSON.stringify(b)` של בדיקת-ה-JS).
bool _eq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_eq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_eq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

const DB = <String, dynamic>{'tag': 'db'};
String _scopedCol(String c) => 'orgs/demo/' + c;

// זיוף-Firestore: יומן-אירועים גלובלי (סדר set/delete/commit/meta חוצה-batches).
class Fake {
  final List<Map<String, dynamic>> log = [];
  int batchN = 0;
  late final PushDiffFs fs;
  Fake() {
    fs = PushDiffFs(
      doc: (db, col, id) => {'db': db, 'col': col, 'id': id},
      writeBatch: (db) {
        final n = ++batchN;
        log.add({'ev': 'open', 'n': n, 'db': db});
        return _FakeBatch(this, n);
      },
    );
  }
}

class _FakeBatch {
  final Fake f;
  final int n;
  _FakeBatch(this.f, this.n);
  void set(dynamic ref, dynamic body) =>
      f.log.add({'ev': 'set', 'n': n, 'ref': ref, 'body': body});
  void delete(dynamic ref) => f.log.add({'ev': 'delete', 'n': n, 'ref': ref});
  Future<void> commit() async => f.log.add({'ev': 'commit', 'n': n});
}

// שקעים שזורקים אם נקראו שלא-בצדק (מקביל ל-noEnc/noMeta).
dynamic _noEnc(dynamic p, dynamic dek) =>
    throw StateError('encryptDoc נקרא בלי dek');
Future<void> _noMeta(dynamic m, dynamic dek) async =>
    throw StateError('pushMeta נקרא בלי meta');

List<Map<String, dynamic>> _where(Fake fk, String ev) =>
    fk.log.where((e) => e['ev'] == ev).toList();
int _idx(Fake fk, bool Function(Map<String, dynamic>) p) =>
    fk.log.indexWhere(p);

Future<void> main() async {
  // 1) set+delete, dek=null, אכיפה כבויה, בלי meta — toPlain מנקה undefined ומנתק הפניה
  {
    final fk = Fake();
    // note:null = ערך-undefined של JS (null≠undefined; toPlain מפיל אותו).
    final data = {'name': 'לוי', 'amount': 250, 'note': null};
    await pushDiff(
      {
        'sets': [
          {'col': 'families', 'id': 'f1', 'data': data}
        ],
        'deletes': [
          {'col': 'rooms', 'id': 'r9'}
        ]
      },
      null,
      <dynamic, dynamic>{},
      DB,
      _scopedCol,
      fk.fs,
      _noEnc,
      _noMeta,
    );
    final sets = _where(fk, 'set');
    final dels = _where(fk, 'delete');
    final commits = _where(fk, 'commit');
    _ok(sets.length == 1 && dels.length == 1 && commits.length == 1,
        'דוגמה 1: מספר set/delete/commit שגוי');
    _ok(_eq(sets[0]['ref'], {'db': DB, 'col': 'orgs/demo/families', 'id': 'f1'}),
        'דוגמה 1: הפניית-set שגויה');
    final body = sets[0]['body'] as Map;
    _ok(_eq(body, {'name': 'לוי', 'amount': 250}) && !body.containsKey('note'),
        'דוגמה 1: toPlain לא ניקה undefined');
    _ok(!identical(body, data), 'דוגמה 1: ההפניה לא נותקה (toPlain)');
    _ok(_eq(dels[0]['ref'], {'db': DB, 'col': 'orgs/demo/rooms', 'id': 'r9'}),
        'דוגמה 1: הפניית-delete שגויה');
  }

  // 2) הצפנה — encryptDoc מקבל עותק-נקי, הגוף = המעטפה בלבד
  {
    final fk = Fake();
    final encCalls = <Map<String, dynamic>>[];
    dynamic encryptDoc(dynamic p, dynamic dek) async {
      encCalls.add({'p': p, 'dek': dek});
      return {'env': 'enc', 'of': p, 'iv': 'IV'};
    }

    await pushDiff(
      {
        'sets': [
          {
            'col': 'families',
            'id': 'f1',
            'data': {'name': 'לוי', 'amount': 250, 'note': null}
          }
        ],
        'deletes': []
      },
      'DEK',
      <dynamic, dynamic>{},
      DB,
      _scopedCol,
      fk.fs,
      encryptDoc,
      _noMeta,
    );
    _ok(
        encCalls.length == 1 &&
            encCalls[0]['dek'] == 'DEK' &&
            _eq(encCalls[0]['p'], {'name': 'לוי', 'amount': 250}),
        'דוגמה 2: encryptDoc לא קיבל את העותק-הנקי + ה-dek');
    final body = _where(fk, 'set')[0]['body'];
    _ok(
        _eq(body, {
          'env': 'enc',
          'of': {'name': 'לוי', 'amount': 250},
          'iv': 'IV'
        }),
        'דוגמה 2: הגוף ≠ המעטפה בלבד');
  }

  // 3) אכיפה + skey — רק אוסף-נאכף; docSkey מקבל את data הגולמי ואת המפה
  {
    final fk = Fake();
    final skeyCalls = <Map<String, dynamic>>[];
    final map = <dynamic, dynamic>{'sp1': 'K1'};
    final sup = SupEnforce(
      enforceOn: true,
      keyedCols: const ['supporters', 'events'],
      docSkey: (col, data, m) {
        skeyCalls.add({'col': col, 'data': data, 'm': m});
        return col + '#' + (data['forWho'] as String);
      },
    );
    final raw = {'forWho': 'sp1', 'amount': 100};
    await pushDiff(
      {
        'sets': [
          {'col': 'supporters', 'id': 's1', 'data': raw},
          {
            'col': 'rooms',
            'id': 'r1',
            'data': {'name': 'חדר'}
          }
        ],
        'deletes': []
      },
      null,
      map,
      DB,
      _scopedCol,
      fk.fs,
      _noEnc,
      _noMeta,
      sup,
    );
    final sets = _where(fk, 'set');
    final b0 = sets[0]['body'] as Map;
    _ok(_eq(b0, {'skey': 'supporters#sp1', 'forWho': 'sp1', 'amount': 100}),
        'דוגמה 3: גוף-נאכף שגוי');
    _ok(b0.keys.first == 'skey', 'דוגמה 3: skey אינו השדה הראשון');
    _ok(
        skeyCalls.length == 1 &&
            identical(skeyCalls[0]['data'], raw) &&
            identical(skeyCalls[0]['m'], map),
        'דוגמה 3: docSkey לא קיבל את data הגולמי + supKeyBySpId');
    _ok(!(sets[1]['body'] as Map).containsKey('skey'),
        'דוגמה 3: skey דלף לאוסף לא-נאכף');
  }

  // 4) חיתוך-אצווה: 401 פעולות ⇒ 400+1, commit ראשון לפני batch שני
  {
    final fk = Fake();
    final sets = List.generate(
        401,
        (i) => {
              'col': 'families',
              'id': 'f$i',
              'data': {'n': i}
            });
    await pushDiff(
      {'sets': sets, 'deletes': []},
      null,
      <dynamic, dynamic>{},
      DB,
      _scopedCol,
      fk.fs,
      _noEnc,
      _noMeta,
    );
    final b1 =
        fk.log.where((e) => e['ev'] == 'set' && e['n'] == 1).length;
    final b2 =
        fk.log.where((e) => e['ev'] == 'set' && e['n'] == 2).length;
    _ok(b1 == 400 && b2 == 1, 'דוגמה 4: חיתוך $b1+$b2 ≠ 400+1');
    _ok(_where(fk, 'commit').length == 2, 'דוגמה 4: מספר commits ≠ 2');
    _ok(
        _idx(fk, (e) => e['ev'] == 'commit' && e['n'] == 1) <
            _idx(fk, (e) => e['ev'] == 'open' && e['n'] == 2),
        'דוגמה 4: ה-batch השני נפתח לפני ה-commit הראשון');
  }

  // 5) meta בלי אכיפה — pushMeta אחרי ה-commit האחרון, בלי קילוף
  {
    final fk = Fake();
    final metaCalls = <Map<String, dynamic>>[];
    Future<void> pushMeta(dynamic m, dynamic dek) async {
      metaCalls.add({'m': m, 'dek': dek});
      fk.log.add({'ev': 'meta'});
    }

    await pushDiff(
      {
        'sets': [
          {
            'col': 'families',
            'id': 'f1',
            'data': {'a': 1}
          }
        ],
        'deletes': [],
        'meta': {'seq': 12, 'receiptSeq': 7}
      },
      null,
      <dynamic, dynamic>{},
      DB,
      _scopedCol,
      fk.fs,
      _noEnc,
      pushMeta,
    );
    _ok(
        metaCalls.length == 1 &&
            _eq(metaCalls[0]['m'], {'seq': 12, 'receiptSeq': 7}) &&
            metaCalls[0]['dek'] == null,
        'דוגמה 5: pushMeta לא קיבל את ה-meta כלשונו + ה-dek');
    _ok(
        _idx(fk, (e) => e['ev'] == 'meta') >
            _idx(fk, (e) => e['ev'] == 'commit'),
        'דוגמה 5: ה-meta נכתב לפני ה-commit האחרון');
  }

  // 6) meta עם אכיפה — stripAuditMeta מקלף את הלוג
  {
    final fk = Fake();
    final metaCalls = <dynamic>[];
    final sup = SupEnforce(
      enforceOn: true,
      keyedCols: const [],
      stripAuditMeta: (m) => {'seq': m['seq']},
    );
    await pushDiff(
      {
        'sets': [],
        'deletes': [],
        'meta': {
          'seq': 12,
          'auditlog': [
            {'op': 'x'}
          ]
        }
      },
      null,
      <dynamic, dynamic>{},
      DB,
      _scopedCol,
      fk.fs,
      _noEnc,
      (m, dek) async => metaCalls.add(m),
      sup,
    );
    _ok(metaCalls.length == 1 && _eq(metaCalls[0], {'seq': 12}),
        'דוגמה 6: הלוג לא קולף מה-meta');
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  {
    final fk = Fake();
    await pushDiff(
      {'sets': [], 'deletes': []},
      null,
      <dynamic, dynamic>{},
      DB,
      _scopedCol,
      fk.fs,
      _noEnc,
      _noMeta,
    );
    assert(fk.log.isEmpty, 'assert-live guard: אצווה-ריקה = אפס יומן');
  }

  if (_f != 0) {
    throw StateError('push-diff golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print('✓ push-diff: 6 דוגמאות-חוזה (שקעי-io) — ירוק');
}
