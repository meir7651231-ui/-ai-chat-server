// רתמת-זהב · apply-config — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// JS undefined ⇒ Dart null (שדה חסר ב-Map). שקעי-ריגול מקומיים לבדיקה.
import 'apply-config.dart';

void main() {
  // 1) קונפיג מלא — כל שדה מגיע לשקע הנכון
  var themeCalls = <List<dynamic>>[];
  var favCalls = <List<dynamic>>[];
  void t(dynamic a, dynamic b, dynamic c) => themeCalls.add([a, b, c]);
  void v(dynamic e) => favCalls.add([e]);

  applyConfig(
    {'theme': 'tsohar', 'accent': '#7c3aed', 'motion': 'calm', 'emoji': '💜'},
    t,
    v,
  );
  assert(themeCalls.length == 1, '✗ applyTheme לא נקרא פעם-אחת');
  assert(
    themeCalls[0][0] == 'tsohar' &&
        themeCalls[0][1] == '#7c3aed' &&
        themeCalls[0][2] == 'calm',
    '✗ ארגומנטי-הערכה שגויים',
  );
  assert(favCalls.length == 1 && favCalls[0][0] == '💜',
      '✗ applyFavicon לא קיבל את האימוג\'י');

  // 2) קונפיג ריק — השקעים נקראים עם null (undefined ב-JS)
  themeCalls = <List<dynamic>>[];
  favCalls = <List<dynamic>>[];
  applyConfig({}, t, v);
  assert(themeCalls.length == 1 && themeCalls[0].every((a) => a == null),
      '✗ קונפיג ריק: applyTheme לא נקרא עם null');
  assert(favCalls.length == 1 && favCalls[0][0] == null,
      '✗ קונפיג ריק: applyFavicon לא נקרא עם null');

  // 3) שדות חלקיים לא מסוננים
  themeCalls = <List<dynamic>>[];
  favCalls = <List<dynamic>>[];
  applyConfig({'theme': 'or-rishon'}, t, v);
  assert(
    themeCalls[0][0] == 'or-rishon' &&
        themeCalls[0][1] == null &&
        themeCalls[0][2] == null,
    '✗ שדה חלקי לא הועבר כמו-שהוא',
  );
  assert(favCalls[0][0] == null, '✗ emoji חסר היה אמור להגיע null');

  // 4) סדר-קריאה: קודם ערכה, אחר-כך אייקון
  final order = <String>[];
  applyConfig({}, (a, b, c) => order.add('theme'), (e) => order.add('favicon'));
  assert(order.length == 2 && order[0] == 'theme' && order[1] == 'favicon',
      '✗ סדר-הקריאה שגוי');

  print('✓ apply-config (Dart): 4 דוגמאות-חוזה — ירוק');
}
