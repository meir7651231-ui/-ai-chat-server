// 🧪 הוכחת-המחולל · משפט-עברית ⇒ הרכבה. מוכיח את שלושת השלבים מקצה-לקצה:
//   התאמת-יכולות · תצורה (configFor) · מסכים (screensFor).
import 'generator.dart';
import 'screens.dart';

int n = 0, fails = 0;
void ok(String name, bool c) { if (!c) { print('✗ $name'); fails++; } else { n++; } }

void main() {
  // #1 — משפט-תורמים מדליק את הקוקפיט + מסך-הקוקפיט.
  final a = generate('אני צריך לנהל תורמים ולהוציא קבלות');
  ok('תורמים ⇒ supporters.cockpit', a.capabilities.contains('supporters.cockpit'));
  ok('תורמים ⇒ config דולק', a.config['features']['supporters.cockpit'] == true);
  ok('תורמים ⇒ מסך-קוקפיט', a.screens.any((s) => s.id == 'cockpit'));
  ok('תורמים ⇒ לא-מדליק צנרת', a.config['features']['bs.pipe'] == false);

  // #2 — משפט-צנרת מדליק את מנוע-הצנרת + מתכנן-הצנרת.
  final b = generate('צריך לתכנן מסלול חיבור צנרת לאמבטיה');
  ok('צנרת ⇒ bs.pipe', b.capabilities.contains('bs.pipe'));
  ok('צנרת ⇒ מסך מתכנן-הצנרת', b.screens.any((s) => s.id == 'pipe-planner'));

  // #3 — מיזוג חוצה-דומיין: משפט אחד מדליק מאור+בנייה-חכמה יחד ⇒ מסך-המיזוג.
  final c = generate('לנהל לקוחות ולהפיק חשבוניות לפרויקט');
  ok('מיזוג ⇒ supporters.cockpit', c.capabilities.contains('supporters.cockpit'));
  ok('מיזוג ⇒ bs.projects', c.capabilities.contains('bs.projects'));
  ok('מיזוג ⇒ מסך crm-invoices (חוצה-דומיין)', c.screens.any((s) => s.id == 'crm-invoices'));

  // #4 — כוונון-ידני: add/remove מעל ההתאמה (חוגה גרנולרית).
  final d = generate('תורמים', add: ['hebrew'], remove: ['supporters.cockpit']);
  ok('remove מכבה למרות ההתאמה', !d.capabilities.contains('supporters.cockpit'));
  ok('add מדליק ידנית', d.capabilities.contains('hebrew'));

  // #5 — משפט-ריק / ללא-התאמה ⇒ הרכבה-ריקה, אפס-מסכים (שמרני).
  final e = generate('שלום עולם בלי מילות מפתח');
  ok('ללא-התאמה ⇒ ריק', e.isEmpty);
  ok('ללא-התאמה ⇒ אפס מסכים', e.screens.isEmpty);

  // #6 — יציבות-סדר: הפלט תמיד בסדר-הקטלוג, לא בסדר-המשפט.
  final f = generate('צנרת ואז תורמים');
  final idxSup = f.capabilities.indexOf('supporters.cockpit');
  final idxPipe = f.capabilities.indexOf('bs.pipe');
  ok('סדר-קטלוג יציב (מאור לפני בנייה-חכמה)', idxSup >= 0 && idxPipe >= 0 && idxSup < idxPipe);

  // #7 — מסך דורש-כמה-יכולות מופיע רק כששתיהן דולקות.
  final g = generate('לקוחות בלבד'); // supporters.cockpit לבד, בלי bs.projects
  ok('דרישה-חלקית ⇒ אין מסך-מיזוג', !g.screens.any((s) => s.id == 'crm-invoices'));

  // #8 — screensFor ישיר: הצבה מלאה ⇒ כל המסכים שדרישותיהם מולאו.
  final all = screensFor(['supporters.cockpit', 'families', 'diary', 'bs.pipe', 'bs.workflow']);
  ok('הצבה-רחבה ⇒ ריבוי-מסכים', all.length >= 5);

  if (fails > 0) { print('❌ המחולל: $fails כשלים'); throw StateError('generator proof failed'); }
  print('✓ המחולל (משפט⇒יכולות⇒תצורה⇒מסכים): $n טענות — קודקוד-הפירמידה מוכח');
}
