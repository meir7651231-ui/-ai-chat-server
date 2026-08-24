// בדיקת-חוזה (רתמת-זהב) · guideSections — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/guide-sections-of.test.mjs:
//   1. בלי config, הכול פעיל ⇒ [S1,S2,S3] מילה-במילה + זהות-אובייקט (identical).
//   2. courses כבוי ⇒ [S1,S2] (S3 נשמט; S1 בלי module נשאר).
//   3. entity.family='לקוח' ⇒ כותרת S2 = 'כרטיס לקוח'.
//   4. entity.course='סדנה', entity.teacher='מדריכה' ⇒ טקסט S3 מתורגם.
//   5. entity.rooms='אולמות' ⇒ טקסט S1 = 'תקציר הבוקר, אולמות חיים וגרפים.'.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/guide-sections-of_test.dart  ⇒ exit 0
import 'guide-sections-of.dart';

// מימושי-שקע לבדיקה — נאמנים למקור-ה-JS:
// swap = (s, from, to) => s.split(from).join(to)
String swap(String s, String from, String to) => s.split(from).join(to);

// termOf = (cfg, k, fb) => (cfg.terms && cfg.terms[k]) || fb
String termOf(Map<String, dynamic> cfg, String k, String fb) {
  final terms = cfg['terms'] as Map<String, dynamic>?;
  final v = terms == null ? null : terms[k];
  return (v is String && v.isNotEmpty) ? v : fb;
}

void _check(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  // סעיפי-הדוגמה מהחוזה
  final S1 = <String, dynamic>{
    'title': 'בית',
    'text': 'תקציר הבוקר, חדרים חיים וגרפים.'
  };
  final S2 = <String, dynamic>{
    'module': 'families',
    'title': 'כרטיס משפחה',
    'text': 'ניקוב ✓, 📜 היסטוריה.'
  };
  final S3 = <String, dynamic>{
    'module': 'courses',
    'term': 'nav.courses',
    'title': 'קורסים',
    'text': 'בתוך חוג: שיבוץ, ⬇ תדפיס למורה.'
  };
  final sections = [S1, S2, S3];
  bool allOn(String m) => true;

  // 1. בלי config — מילה-במילה + זהות-אובייקט (ratchet הלגאסי)
  final r1 = guideSections(allOn, null, sections, termOf, swap);
  _check(r1.length == 3, 'בלי config ⇒ 3 שורות');
  _check(identical(r1[0], S1) && identical(r1[1], S2) && identical(r1[2], S3),
      'שורה שלא השתנתה ⇒ אותה זהות (identical)');
  _check(
      r1[0]['text'] == 'תקציר הבוקר, חדרים חיים וגרפים.' &&
          r1[2]['text'] == 'בתוך חוג: שיבוץ, ⬇ תדפיס למורה.',
      'מילה-במילה');

  // 2. מודול כבוי מסונן; שורה בלי module נשארת
  final r2 = guideSections((m) => m != 'courses', null, sections, termOf, swap);
  _check(r2.length == 2 && identical(r2[0], S1) && identical(r2[1], S2),
      'courses כבוי ⇒ [S1,S2]');

  // 3. כותרת 'כרטיס משפחה' עוברת מונח
  final r3 = guideSections(allOn, {
    'terms': {'entity.family': 'לקוח'}
  }, sections, termOf, swap);
  _check(r3[1]['title'] == 'כרטיס לקוח', "entity.family='לקוח' ⇒ 'כרטיס לקוח'");

  // 4. החלפות-גוף: 'בתוך חוג' + 'תדפיס למורה'
  final r4 = guideSections(allOn, {
    'terms': {'entity.course': 'סדנה', 'entity.teacher': 'מדריכה'}
  }, sections, termOf, swap);
  _check(r4[2]['text'] == 'בתוך סדנה: שיבוץ, ⬇ תדפיס למדריכה.',
      "קורס='סדנה', מורה='מדריכה' ⇒ גוף S3 מתורגם");

  // 5. 'חדרים חיים' עובר entity.rooms
  final r5 = guideSections(allOn, {
    'terms': {'entity.rooms': 'אולמות'}
  }, sections, termOf, swap);
  _check(r5[0]['text'] == 'תקציר הבוקר, אולמות חיים וגרפים.',
      "rooms='אולמות' ⇒ 'אולמות חיים'");

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(guideSections(allOn, null, sections, termOf, swap)[0], S1),
      'assert-live guard');

  print('OK guideSections: 5 דוגמאות-חוזה — ירוק (סינון-מודולים + מונחים פר-עסק)');
}
