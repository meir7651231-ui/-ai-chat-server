// בדיקת-חוזה (רתמת-זהב) · readIcsFeedToken — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS
// new/atoms/read-ics-feed-token.test.mjs. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/read-ics-feed-token_test.dart ⇒ exit 0
import 'read-ics-feed-token.dart';

// — שקע-snap מזויף: exists()/data() כמו ב-JS-test —
class _Snap {
  final bool Function() _exists;
  final Map<String, dynamic>? Function() _data;
  _Snap(this._exists, this._data);
  bool exists() => _exists();
  Map<String, dynamic>? data() => _data();
}

// — מפעל-שקעים רושם-קריאות (מקבילי-ביט ל-mkFs של ה-JS) —
final Object _db = Object();
final Object _ref = Object();

class _Fs {
  final List<List<dynamic>> docCalls = [];
  final List<dynamic> getCalls = [];
  final _Snap _snap;
  _Fs(this._snap);

  dynamic doc(dynamic db, String col, String id) {
    docCalls.add([db, col, id]);
    return _ref;
  }

  Future<dynamic> getDoc(dynamic r) async {
    getCalls.add(r);
    return _snap;
  }
}

var _f = 0;
void _chk(String name, bool cond) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ $name');
    _f = 1;
  }
}

Future<void> main() async {
  // 1) עדות-נתיב: doc(db,'icsFeeds','kehila') פעם אחת + getDoc עם ההפניה
  {
    final m = _Fs(_Snap(() => false, () => null));
    await readIcsFeedToken('kehila', _db, m.doc, m.getDoc);
    _chk(
      "1 doc(db,'icsFeeds','kehila') פעם אחת + getDoc עם ההפניה",
      m.docCalls.length == 1 &&
          identical(m.docCalls[0][0], _db) &&
          m.docCalls[0][1] == 'icsFeeds' &&
          m.docCalls[0][2] == 'kehila' &&
          m.getCalls.length == 1 &&
          identical(m.getCalls[0], _ref),
    );
  }

  // 2) מסמך לא קיים ⇒ null (גם אם data() היה מחזיר token)
  {
    final m = _Fs(_Snap(() => false, () => {'token': 'x'}));
    final r = await readIcsFeedToken('s', _db, m.doc, m.getDoc);
    _chk('2 לא-קיים ⇒ null', r == null);
  }

  // 3) token תקין ⇒ מוחזר
  {
    final m = _Fs(_Snap(
        () => true, () => {'token': 'a1b2c3d4', 'ics': 'BEGIN:VCALENDAR…'}));
    final r = await readIcsFeedToken('s', _db, m.doc, m.getDoc);
    _chk("3 token 'a1b2c3d4' מוחזר", r == 'a1b2c3d4');
  }

  // 4) token ריק ⇒ null
  {
    final m = _Fs(_Snap(() => true, () => {'token': ''}));
    final r = await readIcsFeedToken('s', _db, m.doc, m.getDoc);
    _chk('4 token ריק ⇒ null', r == null);
  }

  // 5) token לא-מחרוזת ⇒ null
  {
    final m = _Fs(_Snap(() => true, () => {'token': 42}));
    final r = await readIcsFeedToken('s', _db, m.doc, m.getDoc);
    _chk('5 token=42 ⇒ null', r == null);
  }

  // 6) getDoc נדחה ⇒ השגיאה מבעבעת החוצה
  {
    var e6 = '';
    try {
      await readIcsFeedToken(
        's',
        _db,
        (db, col, id) => _ref,
        (r) async => throw StateError('permission-denied'),
      );
    } catch (e) {
      e6 = (e as StateError).message;
    }
    _chk('6 שגיאת-ענן מבעבעת', e6 == 'permission-denied');
  }

  if (_f != 0) {
    // ignore: avoid_print
    print('read-ics-feed-token: כשל ברתמת-הזהב');
    throw StateError('golden-harness-failed');
  }
  // ignore: avoid_print
  print('✓ read-ics-feed-token: 6 דוגמאות-חוזה (שקעי-fs + ולידציית-token) — ירוק');
}
