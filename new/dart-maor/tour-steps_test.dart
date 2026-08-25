// בדיקת חוט tour-steps — כל 4 דוגמאות-החוזה + בדיקת-ה-JS (tour-steps.test.mjs).
// מערכים: אורך + איבר-איבר. כשל ⇒ StateError.
import 'tour-steps.dart';

void main() {
  final steps = <dynamic>[
    {'view': 'home', 'caption': '👋 פתיחה'},
    {
      'view': 'families',
      'module': 'families',
      'caption': '🎡 מאתר המשפחות — גלגל',
      'anchorText': 'סינון מורחב',
    },
    {
      'view': 'courses',
      'module': 'courses',
      'caption': '🎡 מאתר החוגים',
      'anchorText': 'מצא חוג',
    },
    {
      'view': 'courses',
      'module': 'courses',
      'caption': 'חיזוי חוגים: רק תואמים',
    },
  ];
  dynamic allOn(dynamic m) => true;
  dynamic termOf(dynamic cfg, dynamic k, dynamic fb) {
    final terms = cfg is Map ? cfg['terms'] : null;
    final v = terms is Map ? terms[k] : null;
    return (v == null || v == '' || v == false || (v is num && (v == 0 || v.isNaN)))
        ? fb
        : v;
  }

  void ck(String name, bool cond) {
    if (!cond) throw StateError('✗ ' + name);
  }

  // 1. הכול-דלוק, בלי config — 4 צעדים, זהות-אובייקט נשמרת (אפס-העתקה)
  final r1 = tourSteps(steps, allOn, termOf);
  ck('בלי-config: 4 צעדים', r1.length == 4);
  for (var i = 0; i < r1.length; i++) {
    ck('בלי-config: זהות-אובייקט [$i]', identical(r1[i], steps[i]));
  }

  // 2. courses כבוי — נשארים 2 (בית + משפחות)
  final r2 = tourSteps(steps, (dynamic m) => m != 'courses', termOf);
  ck('סינון-מודול: 2 צעדים', r2.length == 2);
  ck('סינון-מודול: [0]=home', r2[0]['view'] == 'home');
  ck('סינון-מודול: [1]=families', r2[1]['view'] == 'families');
  ck('סינון-מודול: [0] זהות', identical(r2[0], steps[0]));
  ck('סינון-מודול: [1] זהות', identical(r2[1], steps[1]));

  // 3. מיתוג דרך termOf: nav.courses='סדנאות', entity.course='סדנה'
  final cfg = {
    'terms': {'nav.courses': 'סדנאות', 'entity.course': 'סדנה'},
  };
  final r3 = tourSteps(steps, allOn, termOf, cfg);
  ck('מיתוג: 4 צעדים', r3.length == 4);
  ck('מיתוג caption', r3[2]['caption'] == '🎡 מאתר הסדנאות');
  ck('מיתוג anchorText', r3[2]['anchorText'] == 'מצא סדנה');
  ck('מיתוג חיזוי', r3[3]['caption'] == 'חיזוי סדנאות: רק תואמים');
  ck('מיתוג: view נשמר בהעתקה', r3[2]['view'] == 'courses');
  ck('מיתוג: module נשמר בהעתקה', r3[2]['module'] == 'courses');

  // 4. מונח חסר (nav.families) — נפילה ל-fallback, הנוסח המקורי + זהות
  ck('fallback משפחות', r3[1]['caption'] == '🎡 מאתר המשפחות — גלגל');
  ck('fallback: זהות-אובייקט (אפס-שינוי)', identical(r3[1], steps[1]));
  ck('fallback: גם הבית זהה-זהות', identical(r3[0], steps[0]));

  // המקור לא שונה (אין מוטציה על steps)
  ck('אפס-מוטציה: caption מקורי', steps[2]['caption'] == '🎡 מאתר החוגים');
  ck('אפס-מוטציה: anchorText מקורי', steps[2]['anchorText'] == 'מצא חוג');

  print('OK');
}
