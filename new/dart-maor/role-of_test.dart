// בדיקת-חוזה · roleOf — פורט של new/atoms/role-of.test.mjs + ratchet-הסגר (כלל-13 · İ).
import 'role-of.dart';

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    // ignore: avoid_print
    print('✗ $msg');
  }
}

void main() {
  final c = {
    'adminEmails': [' Admin@X.com '],
    'roles': {
      'teachers': {' Tea@X.com ': 't1', 'b@y.com': 't2'},
    },
  };

  // 1 — admin: ניקוי רישיות+רווחים בצד-הקונפיג
  ok(roleOf(c, 'admin@x.com') == 'admin', 'דוגמה 1');
  // 2 — teacher: ניקוי גם בצד-הקלט
  ok(roleOf(c, '  TEA@x.COM ') == 'teacher', 'דוגמה 2');
  // 3 — teacher רגיל
  ok(roleOf(c, 'b@y.com') == 'teacher', 'דוגמה 3');
  // 4 — לא מוכר ⇒ staff
  ok(roleOf(c, 'zar@z.com') == 'staff', 'דוגמה 4');
  // 5 — מייל ריק/חסר ⇒ staff לפני הכול
  ok(roleOf(c, '') == 'staff', 'דוגמה 5a');
  ok(roleOf(c, null) == 'staff', 'דוגמה 5b');
  // 6 — admin מנצח teacher
  final c2 = {
    'adminEmails': ['x@x.com'],
    'roles': {
      'teachers': {'x@x.com': 't9'},
    },
  };
  ok(roleOf(c2, 'x@x.com') == 'admin', 'דוגמה 6');
  // 7 — קונפיג ריק ⇒ staff, בלי נפילה
  ok(roleOf({}, 'a@b.com') == 'staff', 'דוגמה 7');

  // 8 — ratchet-הסגר (כלל-13): אימייל-אדמין עם İ (U+0130).
  //     ‏JS ‏"İ".toLowerCase() ⇒ "i̇" (2 יחידות) — הקונפיג נשמר עם İ.
  //     הקלט הרגיל "istanbul@x.com" מ-lowercase נאמן-JS חייב להתאים לקונפיג "İstanbul@x.com".
  final cTr = {
    'adminEmails': ['İstanbul@x.com'], // İstanbul@x.com
  };
  // צד-הקלט: המשתמש מקליד באותיות-קטנות → "i̇stanbul@x.com" (כמו JS על İ).
  ok(roleOf(cTr, 'i̇stanbul@x.com') == 'admin', 'הסגר: İ ⇒ i+dot נאמן-JS');
  // וגם הקלט עם İ גדולה עצמה ⇒ שני הצדדים עוברים אותו _jsLower ⇒ admin.
  ok(roleOf(cTr, 'İstanbul@x.com') == 'admin', 'הסגר: İ↔İ');

  if (_f != 0) {
    throw StateError('role-of: כשל-חוזה');
  }
  // ignore: avoid_print
  print('✓ role-of: 10 בדיקות-חוזה (כולל ratchet İ) — ירוק');
}
