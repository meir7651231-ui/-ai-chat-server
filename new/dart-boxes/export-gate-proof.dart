// 🧪 הוכחת-חוצה-שפות · שער-יציאת-המידע (Dart) — מריצה את export-gate.dart על אותם
// קלטים בדיוק כמו new/boxes/export-gate.test.mjs, ומוודאת פלט זהה-ביט (jsonEncode).
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה עם אותה הכרעה.
//
// מדולג במכוון (חוק-מגן-מקור): בלוק "🛡 מגן-הכרעה" בבדיקת-ה-JS קורא readFileSync
// על export-gate.mjs ובודק verbatim-strings בקוד-המקור של קופסת-ה-JS — זה מגן-מקור
// של JS, לא התנהגות-חוצה-שפות, ולכן אינו מיוצג כאן.
import 'dart:convert';
import 'export-gate.dart' as B;

int fails = 0;
int n = 0;
void chk(String name, Object? got, Object? want) {
  n++;
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  }
}

// מרגל-התרעה: מונה-קריאות (מקבילת spyMake ב-JS — s.calls).
class Spy {
  int calls = 0;
  void fire() => calls++;
}

void main() {
  // 1) לידה-מותרת (הכרעת-הקופסה: blocked=false, notify=null)
  final g = B.createExportGate();
  chk('שער-טרי: exportAllowed', g.exportAllowed(), true);
  chk('שער-טרי: guardExport', g.guardExport(), true);

  // 2) חסימה עם התרעה — guard מריץ בדיוק-פעם-אחת-לקריאה; allowed שקט
  final spy = Spy();
  g.setExportBlocked(true, spy.fire);
  chk('חסום: exportAllowed', g.exportAllowed(), false);
  chk('exportAllowed שקט (spy=0)', spy.calls, 0);
  chk('חסום: guardExport', g.guardExport(), false);
  chk('guard ראשון: spy=1', spy.calls, 1);
  g.guardExport();
  chk('guard שני: spy=2', spy.calls, 2);

  // 3) שחרור — שניהם true, ה-spy קפוא
  g.setExportBlocked(false);
  chk('שוחרר: exportAllowed', g.exportAllowed(), true);
  chk('שוחרר: guardExport', g.guardExport(), true);
  chk('שוחרר: spy קפוא=2', spy.calls, 2);

  // 4) חסימה בלי התרעה — לא קורס
  g.setExportBlocked(true);
  bool? r;
  try {
    r = g.guardExport();
  } catch (_) {
    chk('חסום-בלי-toast: קרס', 'CRASH', 'no-crash');
  }
  chk('חסום-בלי-toast: false', r, false);

  // 5) החלפת-התרעה + מחיקת-התרעה (set מחליף את שני חלקי-המצב יחד)
  final spy1 = Spy(), spy2 = Spy();
  g.setExportBlocked(true, spy1.fire);
  g.setExportBlocked(true, spy2.fire);
  g.guardExport();
  chk('החלפה: spy1=0', spy1.calls, 0);
  chk('החלפה: spy2=1', spy2.calls, 1);
  g.setExportBlocked(true); // בלי onBlocked ⇒ מחיקת ההתרעה הקודמת (Dart: היעדר-ארגומנט=null)
  g.guardExport();
  chk('מחיקה: spy2 קפוא=1', spy2.calls, 1);

  // 6) שני מופעים בלתי-תלויים — המצב לא דולף
  final a = B.createExportGate(), b = B.createExportGate();
  a.setExportBlocked(true);
  chk('מופע-a: חסום', a.exportAllowed(), false);
  chk('מופע-b: לא דלף', b.exportAllowed(), true);

  // 7) המופע-היחיד + פונקציות-המודול בחתימות-המקור
  B.setExportBlocked(false); // איפוס המופע-היחיד (מבחנים קודמים לא נגעו בו, אך מפורש)
  chk('מודול-טרי: exportAllowed', B.exportAllowed(), true);
  final spyM = Spy();
  B.setExportBlocked(true, spyM.fire);
  chk('מודול: guardExport false', B.guardExport(), false);
  chk('מודול: spyM=1', spyM.calls, 1);
  chk('gate = אותו מופע', B.gate.exportAllowed(), false);
  B.setExportBlocked(false);
  chk('מודול: שחרור', B.guardExport(), true);

  if (fails > 0) {
    print('❌ קופסת שער-יציאת-המידע (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('export-gate dart proof failed');
  }
  print('✓ קופסת שער-יציאת-המידע (Dart): $n בדיקות — לידה-מותרת · חסימה+toast פעם-לקריאה · '
      'שחרור · החלפת/מחיקת-התרעה · בידוד-מופעים · חתימות-המקור — פלט זהה-ביט ל-JS · '
      'שתי המערכות על אותה קופסה');
}
