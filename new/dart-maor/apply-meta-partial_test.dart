// בדיקת-חוזה · applyMetaPartial. הרצה:
//   dart run --enable-asserts apply-meta-partial_test.dart
// קונבנציית-המרה: JS-undefined ⇒ מפתח-חסר במפה; JS-null ⇒ מפתח-קיים עם null.
import 'apply-meta-partial.dart';

var _fail = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    _fail = 1;
    // ignore: avoid_print
    print('✗ $msg');
  }
}

void main() {
  // 1) הענן-מנצח + immutability
  var db = <String, Object?>{'orgName': 'א', 'seq': 5};
  var out = applyMetaPartial(db, {'orgName': 'ב'});
  ok(out['orgName'] == 'ב' && out['seq'] == 5, 'orgName לא עודכן מהענן');
  ok(!identical(out, db) && db['orgName'] == 'א', 'ה-db הנכנס שוכתב');

  // 2) undefined(=מפתח-חסר) מדולג, שדה מוגדר נכתב
  out = applyMetaPartial(
    {'orgName': 'א', 'usdRate': 3.5, 'seq': 0},
    {'usdRate': 3.7}, // orgName חסר = JS undefined
  );
  ok(out['orgName'] == 'א' && out['usdRate'] == 3.7,
      'undefined לא דולג / usdRate לא עודכן');

  // 3) מונה יורד ⇒ no-op (אותה רפרנס)
  db = {'seq': 10};
  ok(identical(applyMetaPartial(db, {'seq': 7}), db), 'מונה ירד — אסור');

  // 4) כל מונה נשפט לעצמו
  out = applyMetaPartial(
      {'seq': 10, 'receiptSeq': 3}, {'seq': 12, 'receiptSeq': 2});
  ok(out['seq'] == 12 && out['receiptSeq'] == 3,
      'המונים לא נשפטו כל-אחד לעצמו');

  // 5) מונה לא-מספרי / אינסופי ⇒ מדולג
  db = {'donationSeq': 4};
  ok(identical(applyMetaPartial(db, {'donationSeq': '99'}), db),
      "מחרוזת '99' טיפסה על מונה");
  ok(identical(applyMetaPartial(db, {'donationSeq': double.infinity}), db),
      'Infinity טיפס על מונה');

  // 6) שוויון-עמוק ⇒ אותה רפרנס
  db = {
    'ui': {'a': 1},
    'seq': 0
  };
  ok(
      identical(
          applyMetaPartial(db, {
            'ui': {'a': 1}
          }),
          db),
      'ערך שווה-ערך נחשב שינוי');

  // 7) meta ריק ⇒ אותה רפרנס
  db = {'orgName': 'א', 'seq': 1};
  ok(identical(applyMetaPartial(db, {}), db), 'meta ריק החזיר db חדש');

  // ── תפיסות-האימות-העוין (null↔undefined) ──

  // 8) null-מפורש ⇒ ניקוי-שדה (JS: JSON.stringify(null)='null' ≠ '"א"')
  db = {'orgName': 'א', 'seq': 0};
  out = applyMetaPartial(db, {'orgName': null});
  ok(!identical(out, db) && out.containsKey('orgName') && out['orgName'] == null,
      'null-מפורש לא ניקה שדה (בלבל עם undefined)');

  // 9) null-מפורש ומפתח-db חסר ⇒ מוקצה null + changed (JS: undefined ≠ 'null')
  db = {'seq': 0};
  out = applyMetaPartial(db, {'orgName': null});
  ok(!identical(out, db) && out.containsKey('orgName') && out['orgName'] == null,
      'null על מפתח-db-חסר לא הוקצה (מיפוי-גורף חסר⇒null)');

  // 10) db קיים-null + meta null ⇒ שוויון ⇒ אותה רפרנס
  db = {'orgName': null, 'seq': 0};
  ok(identical(applyMetaPartial(db, {'orgName': null}), db),
      'null==null נחשב שינוי');

  // 11) db קיים-null + meta ערך ⇒ מוקצה
  db = {'orgName': null, 'seq': 0};
  out = applyMetaPartial(db, {'orgName': 'ג'});
  ok(!identical(out, db) && out['orgName'] == 'ג', 'null→ערך לא הוקצה');

  // 12) שדה חסר ב-meta לגמרי ⇒ לא נוגעים גם אם db קיים-null
  db = {'orgName': null, 'seq': 3};
  ok(identical(applyMetaPartial(db, {}), db), 'meta ריק שינה db עם null');

  // 13) double שלם ⇒ ללא ".0" בהשוואת-JSON (usdRate 3.0 == int 3)
  db = {'usdRate': 3, 'seq': 0};
  ok(identical(applyMetaPartial(db, {'usdRate': 3.0}), db),
      '3.0 מול 3 נחשב שינוי');

  if (_fail == 0) {
    // ignore: avoid_print
    print('✓ apply-meta-partial: 13 דוגמאות-חוזה — ירוק');
  }
  assert(_fail == 0, 'בדיקות-חוזה נכשלו');
}
