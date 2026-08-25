// בדיקת-חוזה (רתמת-זהב) · readOrgSecretsMeta — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/read-org-secrets-meta.test.mjs.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/read-org-secrets-meta_test.dart ⇒ exit 0
import 'read-org-secrets-meta.dart';

var _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ $msg');
    _f = 1;
  }
}

// snap מזויף עם exists()/data() — המקבילה ל-{ exists: () => …, data: () => … }.
class _Snap {
  final bool Function() _exists;
  final dynamic Function() _data;
  _Snap(this._exists, this._data);
  bool exists() => _exists();
  dynamic data() => _data();
}

// עדי-זהות ייחודיים (המקבילה ל-{__db:true}/{__ref:true}).
final Object _db = Object();
final Object _ref = Object();

// בונה fs רושם-קריאות סביב snap נתון (המקבילה ל-mkFs).
class _Mk {
  final docCalls = <List<Object?>>[];
  final getCalls = <Object?>[];
  late final Fs fs;
  _Mk(_Snap snap) {
    fs = Fs(
      db: _db,
      doc: (db, col, id) {
        docCalls.add([db, col, id]);
        return _ref;
      },
      getDoc: (r) async {
        getCalls.add(r);
        return snap;
      },
    );
  }
}

Future<void> main() async {
  // 1) עדות-נתיב
  final m1 = _Mk(_Snap(() => false, () => null));
  await readOrgSecretsMeta('kehila', m1.fs);
  _ok(
    m1.docCalls.length == 1 &&
        identical(m1.docCalls[0][0], _db) &&
        m1.docCalls[0][1] == 'orgSecretsMeta' &&
        m1.docCalls[0][2] == 'kehila' &&
        m1.getCalls.length == 1 &&
        identical(m1.getCalls[0], _ref),
    "1 doc(db,'orgSecretsMeta','kehila') פעם אחת + getDoc עם ההפניה",
  );

  // 2) לא קיים ⇒ {}
  final out2 =
      await readOrgSecretsMeta('s', _Mk(_Snap(() => false, () => {'smtpUrl': true})).fs);
  _ok(out2.isEmpty, '2 לא-קיים ⇒ {}');

  // 3) קיים ⇒ המסמך כמות-שהוא (אותה הפניה)
  final meta = <String, dynamic>{
    'smtpUrl': true,
    'smsApiKey': false,
    'updatedAt': '2026-08-04T05:00:00.000Z',
  };
  final out3 = await readOrgSecretsMeta('s', _Mk(_Snap(() => true, () => meta)).fs);
  _ok(
    identical(out3, meta) &&
        out3['smtpUrl'] == true &&
        out3['smsApiKey'] == false &&
        out3['updatedAt'] == '2026-08-04T05:00:00.000Z',
    '3 המסמך מוחזר כמות-שהוא',
  );

  // 4) getDoc נדחה ⇒ {} (נבלע)
  final out4 = await readOrgSecretsMeta(
    's',
    Fs(
      db: _db,
      doc: (db, col, id) => _ref,
      getDoc: (r) async => throw StateError('permission-denied'),
    ),
  );
  _ok(out4.isEmpty, '4 דחיית-getDoc נבלעת ⇒ {}');

  // 5) doc זורק סינכרונית ⇒ {} (נבלע)
  final out5 = await readOrgSecretsMeta(
    's',
    Fs(
      db: _db,
      doc: (db, col, id) => throw StateError('ענן לא אותחל'),
      getDoc: (r) async => null,
    ),
  );
  _ok(out5.isEmpty, '5 זריקה סינכרונית נבלעת ⇒ {}');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  final guard =
      await readOrgSecretsMeta('s', _Mk(_Snap(() => false, () => null)).fs);
  assert(guard.isEmpty, 'assert-live guard');

  if (_f != 0) {
    throw StateError('read-org-secrets-meta golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print('✓ read-org-secrets-meta: 5 דוגמאות-חוזה (שקעי-fs + failure-safe) — ירוק (Dart≡JS)');
}
