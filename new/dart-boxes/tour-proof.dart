// 🧪 הוכחת-חוצה-שפות · הסיור-המודרך (Dart) — מריצה את tour.dart על אותם קלטים/WANT
// כמו new/boxes/tour.test.mjs (תסריט · סינון-מודולים · מיתוג termOf · ניווט · spotlight).
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה, כולל סדר-התסריט וזהות-הצעדים.
import 'dart:convert';
import 'tour.dart' as T;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void main() {
  // 1) קבועי-התסריט — מילה-במילה מהלגאסי
  ok('כפתור-העצירה', T.TOUR_STOP_LABEL == '■ עצירת הדמיה (Esc)');
  ok('תסריט 14 צעדים', T.TOUR_STEPS.length == 14);
  ok('הצעד הראשון',
      T.TOUR_STEPS[0]['caption'] == '👋 הדמיה מלאה — המערכת מדגימה את עצמה, על הנתונים האמיתיים');

  // 2) הכול-דלוק, בלי config ⇒ 14, זהות-אובייקט נשמרת (אפס-העתקה)
  // (isModuleOn נקרא עם ארגומנט יחיד באטום ⇒ סגורות חד-ארגומנטיות, בשונה מ-()=>true של JS.)
  final all = T.steps((m) => true);
  ok('הכול-דלוק 14', all.length == 14);
  ok('בלי config: זהות-הצעדים',
      List.generate(all.length, (i) => i).every((i) => identical(all[i], T.TOUR_STEPS[i])));

  // 3) courses כבוי ⇒ שני צעדי-החוגים נושרים
  final noCourses = T.steps((m) => m != 'courses');
  ok('courses-כבוי 12', noCourses.length == 12);
  ok('צעד-חוגים נושר', !noCourses.any((s) => s['module'] == 'courses'));

  // 4) הכול-כבוי ⇒ רק צעדים בלי module (home×5 + settings)
  final none = T.steps((m) => false);
  ok('הכול-כבוי 6', none.length == 6);
  ok('צעד-ממודל נושר', !none.any((s) => s['module'] != null));

  // 5) מיתוג-מחדש דרך termOf + נפילה-ל-fallback עם שימור-זהות
  final cfg = {
    'terms': {'nav.courses': 'סדנאות', 'entity.course': 'סדנה'}
  };
  final branded = T.steps((m) => true, cfg);
  ok('מיתוג מאתר', branded[6]['caption'] == '🎡 מאתר הסדנאות');
  ok('מיתוג עוגן', branded[6]['anchorText'] == 'מצא סדנה');
  ok('מיתוג חיזוי', branded[7]['caption'] == 'חיזוי סדנאות: רק תואמי גיל ומגדר');
  ok('fallback משפחות', branded[3]['caption'] == '🎡 מאתר המשפחות — גלגל בתוך הדף');
  ok('צעד לא-ממותג שומר זהות', identical(branded[3], T.TOUR_STEPS[3]));

  // 6) דריסה רווחים-בלבד = אין-דריסה (term-of) ⇒ זהות נשמרת
  final blank = T.steps((m) => true, {
    'terms': {'nav.courses': '   '}
  });
  ok('דריסת-רווחים שומרת זהות', identical(blank[6], T.TOUR_STEPS[6]));
  ok('config ריק ⇒ fallback', (T.steps((m) => true, {})[6])['caption'] == '🎡 מאתר החוגים');

  // 7) ניווט
  ok('advance(0,+1,14)=1', T.advance(0, 1, 14) == 1);
  ok('advance(0,-1,14)=0', T.advance(0, -1, 14) == 0);
  ok('advance(13,+1,14)=null', T.advance(13, 1, 14) == null);
  ok('advance(3,-1,14)=2', T.advance(3, -1, 14) == 2);
  ok('advance תסריט-ריק=null', T.advance(0, 1, 0) == null);

  // 8) גאומטריית ה-spotlight
  ok('rect=null ⇒ null', T.spotlight(null, 100, 100) == null);
  ok('מידות-0 ⇒ null',
      T.spotlight({'left': 5, 'top': 5, 'width': 0, 'height': 20}, 100, 100) == null);
  final box = T.spotlight({'left': 5, 'top': 5, 'width': 50, 'height': 20}, 100, 100);
  ok('spotlight בסיסי',
      jsonEncode(box) == jsonEncode({'left': 0, 'top': 0, 'width': 70, 'height': 40}));
  final pad0 = T.spotlight({'left': 5, 'top': 5, 'width': 50, 'height': 20}, 100, 100, 0);
  ok('pad=0 = המלבן עצמו',
      jsonEncode(pad0) == jsonEncode({'left': 5, 'top': 5, 'width': 50, 'height': 20}));
  final clamped = T.spotlight({'left': 90, 'top': 90, 'width': 30, 'height': 30}, 100, 100);
  ok('spotlight צמוד-viewport',
      clamped['left'] + clamped['width'] <= 100 && clamped['top'] + clamped['height'] <= 100);

  // 🛡 מגני-מקור-JS (readFileSync + regex על .mjs) ⇒ מדולגים (זרים ל-Dart, בדיקת-מקור-JS).

  if (fails > 0) {
    print('❌ קופסת-הסיור (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('tour dart proof failed');
  }
  print('✓ קופסת-הסיור (Dart): $n טענות — תסריט 14 · סינון 14/12/6 · מיתוג termOf + זהות · ניווט · spotlight צמוד-viewport · שתי המערכות על אותה קופסה');
}
