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

  // ratchet · פאזה-1ב: שלמות-קשר במחיקה — חסימה/מפל/ניתוק. אין-קשר-רשום ⇒ מחיקה-עיוורת.
  test('שלמות-קשר · חסימה חוסמת · מפל מוחק-שרשרת · ניתוק מנקה', () {
    final s = AppStore();
    s.registerRelation('תלמיד', 'כיתה', 'כיתה', 0);   // חסימה
    final k1 = s.add('כיתה', {'שם': 'א1'});
    s.add('תלמיד', {'שם': 'דנה', 'כיתה': k1});
    expect(s.removeById('כיתה', k1), isFalse);         // חסום — יש מצביע
    expect(s.byId('כיתה', k1), isNotNull);             // לא נמחק
    expect(s.inboundRefs('כיתה', k1), 1);

    final s2 = AppStore();
    s2.registerRelation('תלמיד', 'כיתה', 'כיתה', 1);  // מפל
    final k2 = s2.add('כיתה', {'שם': 'ב2'});
    s2.add('תלמיד', {'שם': 'רן', 'כיתה': k2});
    s2.add('תלמיד', {'שם': 'גל', 'כיתה': k2});
    expect(s2.removeById('כיתה', k2), isTrue);
    expect(s2.count('תלמיד'), 0);                       // הילדים נמחקו בשרשרת

    final s3 = AppStore();
    s3.registerRelation('תלמיד', 'כיתה', 'כיתה', 2);  // ניתוק
    final k3 = s3.add('כיתה', {'שם': 'ג3'});
    final t3 = s3.add('תלמיד', {'שם': 'יעל', 'כיתה': k3});
    expect(s3.removeById('כיתה', k3), isTrue);
    expect(s3.byId('תלמיד', t3)?['כיתה'], '');          // המפתח-הזר נוקה

    // מפל-רבים (M2M): מסיר-מהרשימה, לא מוחק-שורה
    final s4 = AppStore();
    s4.registerRelation('תלמיד', 'מקצועות', 'מקצוע', 1, multi: true);
    final m1 = s4.add('מקצוע', {'שם': 'מתמטיקה'});
    final m2 = s4.add('מקצוע', {'שם': 'אנגלית'});
    final t4 = s4.add('תלמיד', {'שם': 'עדי', 'מקצועות': '$m1,$m2'});
    expect(s4.removeById('מקצוע', m1), isTrue);
    expect(s4.count('תלמיד'), 1);                       // התלמיד שרד
    expect(s4.byId('תלמיד', t4)?['מקצועות'], m2);       // רק m1 הוסר מהרשימה
  });

  // ratchet · פאזה-2: שדה-צבירה (rollup) — sumRef/countRef/avgRef על רשומות-הבן.
  test('rollup · sumRef/countRef/avgRef על בני-הרשומה', () {
    final s = AppStore();
    final p = s.add('פרויקט', {'שם': 'בית'});
    final q = s.add('פרויקט', {'שם': 'גינה'});
    s.add('הוצאה', {'פרויקט': p, 'סכום': '1000'});
    s.add('הוצאה', {'פרויקט': p, 'סכום': '₪2,500'});
    s.add('הוצאה', {'פרויקט': q, 'סכום': '400'});
    expect(s.sumRef('הוצאה', 'פרויקט', p, 'סכום'), 3500.0);
    expect(s.countRef('הוצאה', 'פרויקט', p), 2);
    expect(s.avgRef('הוצאה', 'פרויקט', p, 'סכום'), 1750.0);
    expect(s.sumRef('הוצאה', 'פרויקט', q, 'סכום'), 400.0);
  });

  // ratchet · RLS: scoped מסנן שורות לפי actor (ריק ⇒ הכל) · distinctValues לבורר.
  test('RLS · scoped לפי actor (סינון-תצוגה) · distinctValues', () {
    final s = AppStore();
    s.add('תלמיד', {'שם': 'דנה', 'מורה': 'רבקה'});
    s.add('תלמיד', {'שם': 'רן', 'מורה': 'רבקה'});
    s.add('תלמיד', {'שם': 'גל', 'מורה': 'שרה'});
    expect(s.scoped('תלמיד', 'מורה').length, 3);   // actor ריק ⇒ הכל (ביט-זהה)
    s.setActor('רבקה');
    expect(s.scoped('תלמיד', 'מורה').length, 2);   // רק של רבקה
    expect(s.scoped('תלמיד', '').length, 3);        // שדה ריק ⇒ בלי-סינון
    expect(s.distinctValues('תלמיד', 'מורה'), ['רבקה', 'שרה']);
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
