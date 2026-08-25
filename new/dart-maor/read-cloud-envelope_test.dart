// בדיקת-חוזה (רתמת-זהב) · readCloudEnvelope — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/read-cloud-envelope.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
//   1) עדות-נתיב: doc(db, scopedEnv()) ו-getDoc עם ההפניה שהוחזרה מ-doc.
//   2) מסמך לא-קיים ⇒ null.
//   3) מעטפה תקינה ($enc===2) ⇒ מוחזרת כמות-שהיא (identical).
//   4) פורמט זר ($enc===1) ⇒ null.
//   5) data() לא-אובייקט (null) ⇒ null.
//   6) getDoc זורק ⇒ null (failure-safe, לא מחלחל).
// המרה: === של JS ⇒ identical ב-Dart. הזיוף-Firestore = מחלקות-עזר בבדיקה בלבד
//        (האטום נשאר טהור — dynamic duck-typing כמו במקור).
// הרצה: dart run --enable-asserts new/dart-maor/read-cloud-envelope_test.dart ⇒ exit 0
import 'read-cloud-envelope.dart';

int _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ ' + msg);
    _f = 1;
  }
}

// זיוף-snap: exists()/data() כמו במקור.
class _Snap {
  final bool _exists;
  final Object? _data;
  _Snap(this._exists, [this._data]);
  bool exists() => _exists;
  Object? data() => _data;
}

// סמן-זריקה: getDoc יזרוק כשמוזן.
class _Err {
  final String msg;
  _Err(this.msg);
}

// זיוף-Firestore: doc מחזיר אסימון-הפניה ומתעד; getDoc מתעד ומחזיר snap / זורק.
class _Fs {
  final List<Map<String, Object?>> docCalls = [];
  final List<Object?> getDocCalls = [];
  final Object? _snapOrThrow;
  _Fs(this._snapOrThrow);
  Object? doc(Object? db, String path) {
    docCalls.add({'db': db, 'path': path});
    return <String, Object?>{'ref': path};
  }
  Future<Object?> getDoc(Object? ref) async {
    getDocCalls.add(ref);
    final t = _snapOrThrow;
    if (t is _Err) throw StateError(t.msg);
    return t;
  }
}

Future<void> main() async {
  final DB = <String, Object?>{'tag': 'db'};
  String scopedEnv() => 'orgs/demo/_enc/envelope';

  // 1) עדות-נתיב: doc(db, scopedEnv()) ו-getDoc עם ההפניה שהוחזרה
  {
    final fs = _Fs(_Snap(false));
    await readCloudEnvelope(DB, scopedEnv, fs);
    _ok(
        fs.docCalls.length == 1 &&
            identical(fs.docCalls[0]['db'], DB) &&
            fs.docCalls[0]['path'] == 'orgs/demo/_enc/envelope',
        'דוגמה 1: doc לא נקרא עם (db, הנתיב-הסקופי)');
    _ok(
        fs.getDocCalls.length == 1 &&
            (fs.getDocCalls[0] as Map)['ref'] == 'orgs/demo/_enc/envelope',
        'דוגמה 1: getDoc לא קיבל את הפניית-doc');
  }

  // 2) המסמך לא קיים ⇒ null
  {
    final fs = _Fs(_Snap(false));
    _ok((await readCloudEnvelope(DB, scopedEnv, fs)) == null,
        'דוגמה 2: לא-קיים ≠ null');
  }

  // 3) מעטפה תקינה ($enc===2) ⇒ מוחזרת עצמה (identical)
  {
    final env = <String, Object?>{r'$enc': 2, 'wrapPin': 'W1', 'salt': 'S'};
    final fs = _Fs(_Snap(true, env));
    _ok(identical(await readCloudEnvelope(DB, scopedEnv, fs), env),
        'דוגמה 3: מעטפה תקינה לא הוחזרה כמות-שהיא');
  }

  // 4) פורמט זר ($enc===1) ⇒ null
  {
    final fs = _Fs(_Snap(true, <String, Object?>{r'$enc': 1, 'wrap': 'X'}));
    _ok((await readCloudEnvelope(DB, scopedEnv, fs)) == null,
        'דוגמה 4: פורמט זר לא נדחה');
  }

  // 5) data() לא-אובייקט (null) ⇒ null
  {
    final fs = _Fs(_Snap(true, null));
    _ok((await readCloudEnvelope(DB, scopedEnv, fs)) == null,
        'דוגמה 5: data()=null לא הוחזר null');
  }

  // 6) getDoc זורק ⇒ null (failure-safe, לא מחלחל)
  {
    final fs = _Fs(_Err('permission-denied'));
    Object? out;
    try {
      out = await readCloudEnvelope(DB, scopedEnv, fs);
    } catch (_) {
      _ok(false, 'דוגמה 6: השגיאה חלחלה במקום null');
    }
    _ok(out == null, 'דוגמה 6: כשל-ענן ≠ null');
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  final envG = <String, Object?>{r'$enc': 2};
  assert(
      identical(await readCloudEnvelope(DB, scopedEnv, _Fs(_Snap(true, envG))),
          envG),
      'assert-live guard');

  if (_f != 0) {
    throw StateError('read-cloud-envelope: דוגמת-חוזה נכשלה');
  }
  // ignore: avoid_print
  print('✓ read-cloud-envelope: 6 דוגמאות-חוזה (נתיב/קיום/ולידציה/failure-safe) — ירוק');
}
