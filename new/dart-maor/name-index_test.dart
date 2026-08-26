// בדיקת-חוזה ל-nameIndex — פורט של new/atoms/name-index.test.mjs (5 דוגמאות)
// + דוגמת-הסגר: הבחנת null↔undefined במפתח (כלל-2, האבחון ב-QUARANTINE/FIXES.md).
import 'name-index.dart';

int _f = 0;
void chk(String name, bool cond) {
  if (!cond) {
    _f = 1;
    print('✗ $name');
  }
}

const DB = {'__db': true};

void main() {
  // 1+2+3) מיפוי, זהות-הפניה, קריאה-אחת עם ה-db
  {
    final m1 = {'id': 'm1', 'name': 'דנה'};
    final m2 = {'id': 'm2', 'name': 'יוסי'};
    final calls = [];
    final Map map = nameIndex(DB, (db) {
      calls.add(db);
      return [m1, m2];
    });
    chk(
        '1 מפה בגודל 2 עם שני החברים',
        map.length == 2 &&
            map['m1']['name'] == 'דנה' &&
            map['m2']['name'] == 'יוסי');
    chk('2 זהות-הפניה (לא עותק)',
        identical(map['m1'], m1) && identical(map['m2'], m2));
    chk('3 השקע נקרא פעם אחת עם ה-db',
        calls.length == 1 && identical(calls[0], DB));
  }

  // 4) רשימה ריקה ⇒ מפה ריקה
  {
    final Map map = nameIndex(DB, (db) => []);
    chk('4 מפה ריקה', map.isEmpty && map['m1'] == null);
  }

  // 5) מזהה כפול — האחרון מנצח
  {
    final Map map = nameIndex(DB, (db) => [
          {'id': 'm1', 'v': 1},
          {'id': 'm1', 'v': 2}
        ]);
    chk('5 כפול: האחרון מנצח', map.length == 1 && map['m1']['v'] == 2);
  }

  // 6) הסגר (כלל-2): id:null-מפורש מול id-חסר — JS Map מבחין ⇒ שתי רשומות.
  {
    final withNull = {'id': null, 'v': 'null-id'};
    final withoutId = {'v': 'no-id'};
    final Map map = nameIndex(DB, (db) => [withNull, withoutId]);
    chk('6 null↔undefined: שתי רשומות נבדלות (רשומה לא אובדת)',
        map.length == 2);
    chk('6a הרשומה עם id:null נשמרת תחת מפתח-null',
        identical(map[null], withNull));
  }

  if (_f == 1) {
    throw StateError('name-index: כשל בדוגמאות-החוזה');
  }
  print('✓ name-index: 5 דוגמאות-חוזה + הסגר null↔undefined — ירוק');
}
