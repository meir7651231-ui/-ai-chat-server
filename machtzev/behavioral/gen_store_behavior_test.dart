// בדיקת-התנהגות · AppStore (מוח-הריצה של אפליקציה-מחוללת) — מוכיח ש"מתקמפל"="עובד".
import 'package:flutter_test/flutter_test.dart';
import '_gen/ds_store.dart';

void main() {
  test('add מקצה מזהה יציב · byId מאחזר · count סופר', () {
    final s = AppStore();
    final id = s.add('e', {'שם': 'אבי'});
    expect(id, isNotEmpty);
    expect(s.byId('e', id)?['שם'], 'אבי');
    expect(s.count('e'), 1);
    expect(s.byId('e', id)?['__id'], id);
  });

  test('update משנה במקום · לא נוגע במזהה', () {
    final s = AppStore();
    final id = s.add('e', {'שם': 'א', 'עיר': 'חיפה'});
    s.update('e', id, {'שם': 'ב', '__id': 'זיוף'});
    expect(s.byId('e', id)?['שם'], 'ב');
    expect(s.byId('e', id)?['עיר'], 'חיפה');
    expect(s.byId('e', id)?['__id'], id); // המזהה מוגן
  });

  test('removeById מוחק · אחרים שורדים', () {
    final s = AppStore();
    final a = s.add('e', {'x': '1'});
    final b = s.add('e', {'x': '2'});
    s.removeById('e', a);
    expect(s.count('e'), 1);
    expect(s.byId('e', a), isNull);
    expect(s.byId('e', b)?['x'], '2');
  });

  test('sum/avg על שדה-מספרי (מנקה תווים לא-מספריים)', () {
    final s = AppStore();
    s.add('e', {'סכום': '1000'});
    s.add('e', {'סכום': '2,500'});
    s.add('e', {'סכום': '₪500'});
    expect(s.sum('e', 'סכום'), 4000.0);
    expect(s.avg('e', 'סכום'), closeTo(1333.33, 0.01));
  });

  test('referencing — קשר-הפוך לפי מזהה-יעד', () {
    final s = AppStore();
    final cls = s.add('כיתה', {'שם': 'א1'});
    s.add('תלמיד', {'שם': 'דנה', 'כיתה': cls});
    s.add('תלמיד', {'שם': 'רן', 'כיתה': cls});
    s.add('תלמיד', {'שם': 'יעל', 'כיתה': 'אחר'});
    expect(s.referencing('תלמיד', 'כיתה', cls).length, 2);
  });

  // ratchet · פאזה-0: referencing מודע-CSV — קשר-רבים (M2M) שומר רשימת-מזהים מופרדת-פסיק;
  // הקשר-ההפוך חייב לספור רשומה שה-id שלה נמצא *בתוך* הרשימה, לא רק בהתאמה-מלאה.
  // (הבאג: r[field]==id דלג על כל M2M ⇒ backRefs שלם אך מונה-אפס.)
  test('referencing מודע-CSV — קשר-רבים סופר חברוּת ברשימה', () {
    final s = AppStore();
    final m = s.add('מקצוע', {'שם': 'מתמטיקה'});
    final other = s.add('מקצוע', {'שם': 'אנגלית'});
    s.add('תלמיד', {'שם': 'דנה', 'מקצועות': '$m,$other'}); // רבים: שני מזהים
    s.add('תלמיד', {'שם': 'רן', 'מקצועות': '$other'});
    s.add('תלמיד', {'שם': 'גד', 'מקצועות': ' $m , $other '}); // רווחים סביב פסיק
    expect(s.referencing('תלמיד', 'מקצועות', m).length, 2); // דנה + גד
    expect(s.referencing('תלמיד', 'מקצועות', other).length, 3);
    // קשר-יחיד נשאר ביט-זהה: ערך-יחיד בלי פסיק
    final cls = s.add('כיתה', {'שם': 'א1'});
    s.add('נוכחות', {'כיתה': cls});
    expect(s.referencing('נוכחות', 'כיתה', cls).length, 1);
  });

  test('options/displayOf — מפתח-זר מזהה⇒שם-תצוגה', () {
    final s = AppStore();
    final id = s.add('לקוח', {'שם': 'חברת X', 'טלפון': '050'});
    expect(s.options('לקוח').first.key, id);
    expect(s.options('לקוח').first.value, 'חברת X');
    expect(s.displayOf('לקוח', id), 'חברת X');
    expect(s.displayOf('לקוח', 'לא-קיים'), ''); // יתום ⇒ ריק
  });

  test('advance ליניארי + חסום-בסוף · setStage קופץ לכל שלב', () {
    final s = AppStore();
    final id = s.add('e', {'x': '1', '__stage': '0'});
    expect(s.stageOf('e', id), 0);
    s.advance('e', id, 3);
    expect(s.stageOf('e', id), 1);
    s.advance('e', id, 3);
    s.advance('e', id, 3); // חסום ב-2 (האחרון)
    expect(s.stageOf('e', id), 2);
    s.setStage('e', id, 0); // קפיצה-אחורה (דחייה/חזרה)
    expect(s.stageOf('e', id), 0);
  });

  test('notifyListeners נורה על כל מוטציה', () {
    final s = AppStore();
    var n = 0;
    s.addListener(() => n++);
    final id = s.add('e', {'x': '1'});
    s.update('e', id, {'x': '2'});
    s.advance('e', id, 5);
    s.removeById('e', id);
    expect(n, 4);
  });
}
