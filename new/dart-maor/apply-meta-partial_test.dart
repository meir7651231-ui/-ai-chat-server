// בדיקת-חוזה (רתמת-זהב) · applyMetaPartial — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/apply-meta-partial.test.mjs.
// המרה: === של JS ⇒ identical ב-Dart · undefined ⇒ null (השדה חסר בקלט).
// הרצה: dart run --enable-asserts new/dart-maor/apply-meta-partial_test.dart ⇒ exit 0
import 'apply-meta-partial.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) הענן-מנצח + immutability
  var db = <String, Object?>{'orgName': 'א', 'seq': 5};
  var out = applyMetaPartial(db, {'orgName': 'ב'});
  _ok(out['orgName'] == 'ב' && out['seq'] == 5, 'orgName לא עודכן מהענן');
  n++;
  _ok(!identical(out, db) && db['orgName'] == 'א', 'ה-db הנכנס שוכתב');
  n++;

  // 2) undefined מדולג (השדה חסר בקלט), שדה מוגדר נכתב
  out = applyMetaPartial(
    {'orgName': 'א', 'usdRate': 3.5, 'seq': 0},
    {'usdRate': 3.7}, // orgName חסר = undefined
  );
  _ok(out['orgName'] == 'א' && out['usdRate'] == 3.7,
      'undefined לא דולג / usdRate לא עודכן');
  n++;

  // 3) מונה יורד ⇒ no-op (אותה רפרנס)
  db = {'seq': 10};
  _ok(identical(applyMetaPartial(db, {'seq': 7}), db), 'מונה ירד — אסור');
  n++;

  // 4) כל מונה נשפט לעצמו
  out = applyMetaPartial(
    {'seq': 10, 'receiptSeq': 3},
    {'seq': 12, 'receiptSeq': 2},
  );
  _ok(out['seq'] == 12 && out['receiptSeq'] == 3,
      'המונים לא נשפטו כל-אחד לעצמו');
  n++;

  // 5) מונה לא-מספרי / אינסופי ⇒ מדולג
  db = {'donationSeq': 4};
  _ok(identical(applyMetaPartial(db, {'donationSeq': '99'}), db),
      "מחרוזת '99' טיפסה על מונה");
  n++;
  _ok(identical(applyMetaPartial(db, {'donationSeq': double.infinity}), db),
      'Infinity טיפס על מונה');
  n++;

  // 6) שוויון-עמוק ⇒ אותה רפרנס
  db = {
    'ui': {'a': 1},
    'seq': 0,
  };
  _ok(
      identical(
          applyMetaPartial(db, {
            'ui': {'a': 1},
          }),
          db),
      'ערך שווה-ערך נחשב שינוי');
  n++;

  // 7) meta ריק ⇒ אותה רפרנס
  db = {'orgName': 'א', 'seq': 1};
  _ok(identical(applyMetaPartial(db, {}), db), 'meta ריק החזיר db חדש');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(applyMetaPartial(db, {}), db), 'assert-live guard');

  print('OK applyMetaPartial: $n asserts passed');
}
