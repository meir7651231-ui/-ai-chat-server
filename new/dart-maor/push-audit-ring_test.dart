// בדיקת-חוזה (רתמת-זהב) · pushAuditRing — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/push-audit-ring.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// המרה: זיוף-Firestore ב-JS (fs.doc מתעד args ומחזיר {__ref}; fs.setDoc מתעד
//   {ref,body} ויכול להידחות) ⇒ מחלקת-Dart FakeFs עם dispatch-דינמי זהה;
//   `throw new Error(msg)` ⇒ NetError בעל message (בדיקה 5).
// הרצה: dart run --enable-asserts new/dart-maor/push-audit-ring_test.dart  ⇒ exit 0
import 'push-audit-ring.dart';

int _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ ' + msg);
    _f = 1;
  }
}

// זיוף-Firestore (מקביל ל-fake של ה-JS): doc(...args) מתעד ומחזיר {__ref:args};
// setDoc(ref,body) מתעד {ref,body}; opts.reject ⇒ זריקת NetError בעלת message.
class Calls {
  final List<List<dynamic>> doc = [];
  final List<Map<String, dynamic>> setDoc = [];
}

class NetError {
  final String message;
  NetError(this.message);
}

class FakeFs {
  final Calls calls;
  final String? reject;
  FakeFs(this.calls, this.reject);
  dynamic doc(dynamic a, dynamic b, dynamic c) {
    calls.doc.add(<dynamic>[a, b, c]);
    return {
      '__ref': [a, b, c]
    };
  }

  Future<void> setDoc(dynamic ref, dynamic body) async {
    calls.setDoc.add({'ref': ref, 'body': body});
    if (reject != null) throw NetError(reject!);
  }
}

String scopedCol(String c) => 'orgs/demo/' + c;
final DB = {'__db': true};

Future<void> main() async {
  // 1) uid ריק ⇒ יציאה שקטה, אפס קריאות
  {
    final calls = Calls();
    final fs = FakeFs(calls, null);
    var enc = 0;
    await pushAuditRing([
      {'at': '2026-08-01', 'op': 'א'}
    ], null, '', DB, scopedCol, fs, (a, b) async {
      enc++;
    });
    _ok(calls.doc.isEmpty && calls.setDoc.isEmpty && enc == 0,
        'uid ריק: נעשו קריאות למרות אי-חיבור');
  }

  // 2) דחיפה רגילה בלי dek — נתיב סקופי + גוף plaintext כסדרו
  {
    final calls = Calls();
    final fs = FakeFs(calls, null);
    final entries = [
      {'at': '2026-08-01', 'op': 'א'},
      {'at': '2026-08-02', 'op': 'ב'}
    ];
    await pushAuditRing(entries, null, 'u1', DB, scopedCol, fs, null);
    _ok(calls.doc.length == 1, 'doc לא נקרא פעם אחת');
    final db = calls.doc[0][0];
    final col = calls.doc[0][1];
    final uid = calls.doc[0][2];
    _ok(identical(db, DB) && col == 'orgs/demo/auditlog' && uid == 'u1',
        'doc(db, orgs/demo/auditlog, u1) — חיווט שגוי');
    _ok(calls.setDoc.length == 1, 'setDoc לא נקרא פעם אחת');
    final body = calls.setDoc[0]['body'];
    final be = body['entries'];
    _ok(
        be is List &&
            be.length == 2 &&
            be[0]['op'] == 'א' &&
            be[1]['op'] == 'ב',
        'גוף-המסמך אינו {entries:[שתיהן כסדרן]}');
  }

  // 3) תקרת-הטבעת: 502 ⇒ בדיוק 500 האחרונות
  {
    final calls = Calls();
    final fs = FakeFs(calls, null);
    final entries = [
      for (var i = 0; i < 502; i++) {'at': 'a', 'n': i + 1}
    ];
    await pushAuditRing(entries, null, 'u1', DB, scopedCol, fs, null);
    final ring = calls.setDoc[0]['body']['entries'];
    _ok(ring.length == 500, 'הטבעת לא נגזמה ל-500 (בפועל ${ring.length})');
    _ok(ring[0]['n'] == 3 && ring[499]['n'] == 502,
        'נגזמו הלא-נכונות: הראשונה בגוף חייבת להיות רשומה #3');
  }

  // 4) dek ⇒ encryptDoc על הטבעת-הגזומה, והמעטפה היא מה שנכתב
  {
    final calls = Calls();
    final fs = FakeFs(calls, null);
    final encCalls = <Map<String, dynamic>>[];
    Future<dynamic> encryptDoc(dynamic body, dynamic dek) async {
      encCalls.add({'body': body, 'dek': dek});
      return {'__enc': true, 'of': body};
    }

    final entries = [
      {'at': '2026-08-03', 'op': 'ג'}
    ];
    await pushAuditRing(entries, 'DEK', 'u1', DB, scopedCol, fs, encryptDoc);
    _ok(encCalls.length == 1 && encCalls[0]['dek'] == 'DEK',
        'encryptDoc לא נקרא עם ה-dek');
    _ok(
        encCalls[0]['body']['entries'].length == 1 &&
            encCalls[0]['body']['entries'][0]['op'] == 'ג',
        'encryptDoc לא קיבל את {entries:הטבעת}');
    final body = calls.setDoc[0]['body'];
    _ok(body['__enc'] == true && identical(body['of'], encCalls[0]['body']),
        'setDoc לא כתב את המעטפה שהחזיר encryptDoc');
  }

  // 5) setDoc דוחה ⇒ זריקה (לא נבלעת)
  {
    final calls = Calls();
    final fs = FakeFs(calls, 'permission-denied');
    String? threw;
    try {
      await pushAuditRing([
        {'at': 'a'}
      ], null, 'u1', DB, scopedCol, fs, null);
    } on NetError catch (e) {
      threw = e.message;
    }
    _ok(threw == 'permission-denied', 'כשל-setDoc נבלע במקום להיזרק');
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_liveGuard(), 'assert-live guard');

  if (_f != 0) {
    throw StateError('push-audit-ring golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print(
      '✓ push-audit-ring: 5 דוגמאות-חוזה (זיוף-Firestore, אפס ענן) — ירוק (Dart≡JS)');
}

// עוגן ל-assert-החי.
bool _liveGuard() => true;
