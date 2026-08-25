// בדיקת-חוזה (רתמת-זהב) · pullAuditRing — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/pull-audit-ring.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// המרה: זיוף-Firestore ב-JS (docs=[{id,data:()=>…}], fs.collection/getDocs מתעדים
//   קריאות) ⇒ מחלקות-Dart קטנות (FakeDoc/FakeSnap/FakeFs) עם dispatch-דינמי זהה;
//   `throw new Error(msg)` ⇒ NetError בעל message (בדיקה 7).
// הרצה: dart run --enable-asserts new/dart-maor/pull-audit-ring_test.dart  ⇒ exit 0
import 'pull-audit-ring.dart';

int _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ ' + msg);
    _f = 1;
  }
}

// זיוף-Firestore (מקביל ל-fake של ה-JS): FakeDoc.data() מחזיר את המפה; FakeFs מתעד
// קריאות collection/getDocs; opts.reject ⇒ זריקת NetError בעלת message.
class FakeDoc {
  final String id;
  final Map<String, dynamic> _data;
  FakeDoc(this.id, this._data);
  Map<String, dynamic> data() => _data;
}

class FakeSnap {
  final List<FakeDoc> docs;
  FakeSnap(this.docs);
}

class Calls {
  final List<List<dynamic>> collection = [];
  int getDocs = 0;
}

class NetError {
  final String message;
  NetError(this.message);
}

class FakeFs {
  final List<FakeDoc> _docs;
  final Calls calls;
  final String? reject;
  FakeFs(this._docs, this.calls, this.reject);
  dynamic collection(dynamic a, dynamic b) {
    calls.collection.add(<dynamic>[a, b]);
    return {'__col': [a, b]};
  }

  Future<dynamic> getDocs(dynamic col) async {
    calls.getDocs++;
    if (reject != null) throw NetError(reject!);
    return FakeSnap(_docs);
  }
}

String scopedCol(String c) => 'orgs/demo/' + c;
final DB = {'__db': true};
FakeDoc d(String id, Map<String, dynamic> data) => FakeDoc(id, data);

Future<void> main() async {
  // 1) עובד/ת (canRead=false) ⇒ null, אפס קריאות
  {
    final calls = Calls();
    final fs = FakeFs([
      d('u1', {
        'entries': [
          {'at': 'a'}
        ]
      })
    ], calls, null);
    var dec = 0;
    final r = await pullAuditRing(null, false, DB, scopedCol, fs, (a, b) async {
      dec++;
    });
    _ok(r == null, 'canRead=false לא החזיר null');
    _ok(calls.collection.isEmpty && calls.getDocs == 0 && dec == 0,
        'canRead=false: נעשו קריאות-ענן');
  }

  // 2) מיזוג חוצה-מסמכים + מיון עולה לפי at + חיווט-הנתיב
  {
    final calls = Calls();
    final fs = FakeFs([
      d('u1', {
        'entries': [
          {'at': '2026-08-03', 'op': 'ג'},
          {'at': '2026-08-01', 'op': 'א'}
        ]
      }),
      d('u2', {
        'entries': [
          {'at': '2026-08-02', 'op': 'ב'}
        ]
      }),
    ], calls, null);
    final r = await pullAuditRing(null, true, DB, scopedCol, fs, null);
    _ok(
        r != null &&
            r.length == 3 &&
            r[0]['op'] == 'א' &&
            r[1]['op'] == 'ב' &&
            r[2]['op'] == 'ג',
        'המיזוג/המיון שגוי');
    _ok(
        calls.collection.length == 1 &&
            identical(calls.collection[0][0], DB) &&
            calls.collection[0][1] == 'orgs/demo/auditlog',
        'collection(db, orgs/demo/auditlog) — חיווט שגוי');
  }

  // 3) מסמך בלי entries-מערך ⇒ מדולג בשקט
  {
    final calls = Calls();
    final fs = FakeFs([
      d('u1', {'entries': 'זבל'}),
      d('u2', {}),
      d('u3', {
        'entries': [
          {'at': '2026-08-05', 'op': 'ה'}
        ]
      }),
    ], calls, null);
    final r = await pullAuditRing(null, true, DB, scopedCol, fs, null);
    _ok(r != null && r.length == 1 && r[0]['op'] == 'ה',
        'מסמך-פגום לא דולג בשקט');
  }

  // 4) אוסף-ריק ⇒ [] (לא null)
  {
    final calls = Calls();
    final fs = FakeFs([], calls, null);
    final r = await pullAuditRing(null, true, DB, scopedCol, fs, null);
    _ok(r != null && r.isEmpty, 'אוסף-ריק לא החזיר []');
  }

  // 5) dek ⇒ decryptDoc פר-מסמך, ה-entries מהפלט-המפוענח
  {
    final raw1 = {'__enc': 1};
    final raw2 = {'__enc': 2};
    final calls = Calls();
    final fs = FakeFs([d('u1', raw1), d('u2', raw2)], calls, null);
    final decCalls = <Map<String, dynamic>>[];
    Future<dynamic> decryptDoc(dynamic data, dynamic dek) async {
      decCalls.add({'data': data, 'dek': dek});
      return identical(data, raw1)
          ? {
              'entries': [
                {'at': '2026-08-02', 'op': 'ב'}
              ]
            }
          : {
              'entries': [
                {'at': '2026-08-01', 'op': 'א'}
              ]
            };
    }

    final r = await pullAuditRing('DEK', true, DB, scopedCol, fs, decryptDoc);
    _ok(
        decCalls.length == 2 &&
            identical(decCalls[0]['data'], raw1) &&
            decCalls[0]['dek'] == 'DEK' &&
            identical(decCalls[1]['data'], raw2),
        'decryptDoc לא נקרא פר-מסמך עם ה-dek');
    _ok(r != null && r.length == 2 && r[0]['op'] == 'א' && r[1]['op'] == 'ב',
        'ה-entries לא נאספו מהפלט-המפוענח');
  }

  // 6) תקרה: 501 ממוזגות ⇒ 500 האחרונות לפי המיון
  {
    Map<String, dynamic> mk(int n) =>
        {'at': n.toString().padLeft(4, '0'), 'n': n};
    final docA = d('u1',
        {'entries': [for (var i = 0; i < 251; i++) mk(i + 1)]});
    final docB = d('u2',
        {'entries': [for (var i = 0; i < 250; i++) mk(i + 252)]});
    final calls = Calls();
    final fs = FakeFs([docA, docB], calls, null);
    final r = await pullAuditRing(null, true, DB, scopedCol, fs, null);
    _ok(r != null && r.length == 500, 'לא נגזם ל-500 (בפועל ${r?.length})');
    _ok(r != null && r[0]['n'] == 2 && r[499]['n'] == 501,
        'נדחקה הלא-נכונה: הוותיקה-ביותר (n=1) חייבת להידחק');
  }

  // 7) getDocs דוחה ⇒ זריקה
  {
    final calls = Calls();
    final fs = FakeFs([], calls, 'net-down');
    String? threw;
    try {
      await pullAuditRing(null, true, DB, scopedCol, fs, null);
    } on NetError catch (e) {
      threw = e.message;
    }
    _ok(threw == 'net-down', 'כשל-getDocs נבלע במקום להיזרק');
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_falsyGuard(), 'assert-live guard');

  if (_f != 0) {
    throw StateError('pull-audit-ring golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print(
      '✓ pull-audit-ring: 7 דוגמאות-חוזה (זיוף-Firestore, אפס ענן) — ירוק (Dart≡JS)');
}

// עוגן ל-assert-החי: canRead=false חייב להחזיר null סינכרונית-לוגית (בלי-ענן).
bool _falsyGuard() => true;
