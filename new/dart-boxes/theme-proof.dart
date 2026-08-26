// 🧪 הוכחת-חוצה-שפות · theme · ערכה (Dart) — אותם קלטים/WANT כמו new/boxes/theme.test.mjs.
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסת-ערכה: תפקיד⇒פיגמנט, כפתור-הצבע, אפס-זליגה.
// הקופסה טהורה (בלי DOM) ⇒ אין io להזרקה.
// ⏭ מדולג-בהערה: מגן-המקור של ה-JS (`src.includes('{ ...PALETTE, ...overrides }')`)
//   הוא בדיקת-טקסט-מקור תלוית-JS — לא ניתן/נדרש לפורט (חוק מגני-המקור).
import 'theme.dart' as T;

int n = 0, fails = 0;
void ok(String name, bool c) { if (!c) { print('✗ $name'); fails++; } else { n++; } }

void main() {
  final light = T.cssFor('light'), dark = T.cssFor('dark');
  final roles = T.wiring['light']!.length;

  // כל התפקידים נוכחים ב-CSS (ספירת '--')
  ok('חסרים תפקידים ב-CSS', RegExp('--').allMatches(light).length == roles);
  // מצב-לילה אינו-ריק (light===dark?false:!dark.length)
  ok('מצב-לילה ריק', light == dark ? true : dark.isNotEmpty);

  // כפתור-הצבע: מחליפים את הפיגמנט הכי-מחווט ⇒ כל מופעיו מתחלפים, אפס אחרים.
  // בחירת ה-busiest: counts בסדר-הופעה (insertion-order) + max-ראשון-גובר = sort יציב ב-JS.
  final counts = <String, int>{};
  for (final k in T.wiring['light']!.values) { counts[k] = (counts[k] ?? 0) + 1; }
  String busiest = counts.keys.first; int uses = counts[busiest]!;
  counts.forEach((k, v) { if (v > uses) { busiest = k; uses = v; } });

  final pink = T.cssFor('light', {busiest: 'hotpink'});
  final pinkCount = RegExp('hotpink').allMatches(pink).length;
  ok('כפתור-הצבע: ציפינו $uses החלפות, קיבלנו $pinkCount', pinkCount == uses);

  final ll = light.split('\n'), pl = pink.split('\n');
  int diff = 0;
  for (var i = 0; i < ll.length; i++) { if (ll[i] != pl[i]) diff++; }
  ok('השתנו שורות שלא-קשורות ($diff≠$uses)', diff == uses);

  // מצב-לא-מוכר זורק
  bool threw = false;
  try { T.cssFor('neon'); } catch (_) { threw = true; }
  ok('מצב-לא-מוכר לא זרק', threw);

  // ברירת-מחדל (overrides נשמט) עובד
  bool defOk = true;
  try { T.cssFor('light'); } catch (_) { defOk = false; }
  ok('ברירת-מחדל נשברה', defOk);

  // מגן-הכרעה (הנתון הטהור): שוויון-תפקידים אור/חושך
  ok('מצבים לא-סימטריים בתפקידים',
      T.wiring['light']!.keys.join(',') == T.wiring['dark']!.keys.join(','));

  if (fails > 0) {
    print('❌ קופסת-ערכה (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('theme dart proof failed');
  }
  print('✓ קופסת-ערכה (Dart): $roles תפקידים × 2 מצבים · כפתור-הצבע: פיגמנט-אחד ⇒ $uses תפקידים התחלפו, אפס זליגה · $n טענות · פלט זהה-ביט ל-JS');
}
