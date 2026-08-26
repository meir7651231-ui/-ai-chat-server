// 🧪 הוכחת-חוצה-שפות · templates — אותם קלטים/WANT כמו new/boxes/templates.test.mjs.
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה: מילון·מפתחות-נגזרים·דריסה/ברירת-מחדל
//   /משתנים — פלט זהה-ביט.
// הערה: 2 "מגני-ההכרעה" של בדיקת-ה-JS (regex על מקור-ה-mjs — עוגני-חיווט + ייבוא-אטומי-בלבד)
//   תלויי-מקור-JS ולא התנהגות חוצה-שפות, ולכן מדולגים כאן (חוק המקרה-תלוי-ריצה-JS).
import 'dart:convert';
import 'templates.dart' as T;

int checks = 0, fails = 0;
void eq(Object? got, Object? want, String tag) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $tag: $g ≠ $w');
    fails++;
  } else {
    checks++;
  }
}

void main() {
  // מילון: 5 תבניות, לכל אחת key·label·vars·def
  eq(T.TEMPLATE_DEFS.length, 5, 'גודל-המילון');
  for (final d in T.TEMPLATE_DEFS) {
    final ok = (d['key'] != null && d['key'] != '') &&
        (d['label'] != null && d['label'] != '') &&
        (d['vars'] is List) &&
        (d['def'] is String);
    eq(ok, true, 'תבנית שבורה: ${d['key']}');
  }
  // מפתחות נגזרים, בסדר-ההגדרה (חוזה + templates.ts:54)
  eq(T.TEMPLATE_KEYS.join('|'), 'wa.delivery|wa.payment|wa.birthday|wa.dialer|wa.paylink',
      'TEMPLATE_KEYS');

  // דוגמה 1 — ברירת-מחדל
  eq(T.renderTemplate(null, 'wa.delivery', {'name': 'דנה', 'org': 'מאור החסד'}),
      'שלום דנה, משלוח ממאור החסד בדרך אליכם היום 🚚', 'דוגמה 1');
  // דוגמה 2 — דריסת-ארגון גוברת
  eq(
      T.renderTemplate({
        'templates': {'wa.delivery': 'היי {name} מ{org}!'}
      }, 'wa.delivery', {'name': 'דנה', 'org': 'מאור החסד'}),
      'היי דנה ממאור החסד!',
      'דוגמה 2');
  // דוגמה 3 — דריסת רווחים-בלבד ⇒ ברירת-המחדל
  eq(
      T.renderTemplate({
        'templates': {'wa.delivery': '   '}
      }, 'wa.delivery', {'name': 'דנה', 'org': 'מאור החסד'}),
      'שלום דנה, משלוח ממאור החסד בדרך אליכם היום 🚚',
      'דוגמה 3');
  // דוגמה 4 — מפתח לא-מוכר ⇒ ''; ובדריסה — הדריסה מרונדרת
  eq(T.renderTemplate(null, 'wa.nope', {'name': 'דנה'}), '', 'דוגמה 4א');
  eq(
      T.renderTemplate({
        'templates': {'wa.nope': 'חופשי {name}'}
      }, 'wa.nope', {'name': 'דנה'}),
      'חופשי דנה',
      'דוגמה 4ב');
  // דוגמה 5 — משתנה לא-סופק נשאר {כפי-שהוא}
  eq(T.renderTemplate(null, 'wa.birthday', {'org': 'מאור'}),
      'מזל טוב ל{first} ליום ההולדת! 🎂 באהבה, מאור', 'דוגמה 5');
  // דוגמה 6 — תבנית-התשלום המלאה
  eq(T.renderTemplate(null, 'wa.payment', {'org': 'מאור', 'what': 'חוג ציור', 'amount': '120'}),
      'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור חוג ציור — ₪120. תודה רבה!', 'דוגמה 6');
  // דוגמה 7 — cfg=null / templates:null ⇒ כ-undefined
  eq(T.renderTemplate(null, 'wa.dialer', {'name': 'א', 'org': 'ב'}),
      'שלום א, ניסינו להשיג אתכם מב ולא הצלחנו — נשמח שתחזרו אלינו 🙏', 'דוגמה 7א');
  eq(
      T.renderTemplate({'templates': null}, 'wa.paylink', {'name': 'א', 'org': 'ב', 'link': 'L'}),
      'שלום א, תודה על השיחה! לתרומה מקוונת לב: L 🙏',
      'דוגמה 7ב');
  // קצוות: vars ריק ⇒ הנוסח כלשונו · משתנה-עודף לא מזיק
  eq(T.renderTemplate(null, 'wa.delivery', {}),
      'שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚', 'vars-ריק');
  eq(T.renderTemplate(null, 'wa.birthday', {'first': 'רות', 'org': 'מאור', 'extra': 'X'}),
      'מזל טוב לרות ליום ההולדת! 🎂 באהבה, מאור', 'משתנה-עודף');

  if (fails > 0) {
    print('❌ קופסת-תבניות (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('templates dart proof failed');
  }
  print('✓ קופסת-תבניות (Dart): $checks בדיקות — מילון×5, מפתחות-נגזרים, '
      'דריסה/ברירת-מחדל/משתנים — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
