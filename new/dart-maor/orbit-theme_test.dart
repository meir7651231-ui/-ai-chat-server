/// רתמת-זהב · orbit-theme — בדיוק דוגמאות-החוזה של new/atoms/orbit-theme.test.mjs.
/// עובר ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts orbit-theme_test.dart
import 'orbit-theme.dart';

void main() {
  // מימוש-שקע לבדיקה: ערכת-נפילה מדומה — מוכיחה שהחוט מחזיר אותה כמות-שהיא (identical).
  final fb = <String, dynamic>{
    'vars': <String, String>{'--o-accent': '#000000'},
    'scene': 'Aurora',
  };

  // accent חסר/לא-תקין ⇒ הנפילה באותה הפניה
  assert(identical(orbitTheme(null, fb), fb), 'null ⇒ fallback (identical)');
  assert(identical(orbitTheme('#12345', fb), fb),
      "'#12345' (5 ספרות) ⇒ fallback (identical)");

  // '#e91e63' — ערכי-זהב מהקלטת קוד-המקור
  final pink = orbitTheme('#e91e63', fb);
  final pinkVars = pink['vars'] as Map<String, String>;
  assert(pinkVars['--o-accent'] == '#e91e63',
      'e91e63 --o-accent: ${pinkVars['--o-accent']}');
  assert(pinkVars['--o-accent-rgb'] == '233,30,99',
      'e91e63 --o-accent-rgb: ${pinkVars['--o-accent-rgb']}');
  assert(pinkVars['--o-g1'] == '#31111c', 'e91e63 --o-g1: ${pinkVars['--o-g1']}');
  assert(pinkVars['--o-a1'] == 'rgba(233,30,99,0.30)',
      'e91e63 --o-a1: ${pinkVars['--o-a1']}');
  assert(pinkVars['--o-btn-text'] == '#ffffff',
      'e91e63 --o-btn-text: ${pinkVars['--o-btn-text']}');
  assert(pink['scene'] == 'Aurora', 'e91e63 scene: ${pink['scene']}');

  // '#ff9800' — גוון חם: Ember + קרקע מוסטת + טקסט-כפתור כהה
  final orange = orbitTheme('#ff9800', fb);
  final orangeVars = orange['vars'] as Map<String, String>;
  assert(orange['scene'] == 'Ember', 'ff9800 scene: ${orange['scene']}');
  assert(orangeVars['--o-g1'] == '#321e11',
      'ff9800 --o-g1 (קרקע מוסטת): ${orangeVars['--o-g1']}');
  assert(orangeVars['--o-btn-text'] == '#2a1710',
      'ff9800 --o-btn-text (בהיר ⇒ כהה): ${orangeVars['--o-btn-text']}');

  // '#ffffff' — בהיר-מאוד ⇒ Ice
  final white = orbitTheme('#ffffff', fb);
  final whiteVars = white['vars'] as Map<String, String>;
  assert(white['scene'] == 'Ice', 'ffffff scene: ${white['scene']}');
  assert(whiteVars['--o-accent-rgb'] == '255,255,255',
      'ffffff --o-accent-rgb: ${whiteVars['--o-accent-rgb']}');

  // בלי '#' — עדיין תקין
  final noHash = orbitTheme('6ea8fe', fb);
  final noHashVars = noHash['vars'] as Map<String, String>;
  assert(noHashVars['--o-accent'] == '#6ea8fe',
      "'6ea8fe' בלי # תקין: ${noHashVars['--o-accent']}");
  assert(noHash['scene'] == 'Aurora', "'6ea8fe' scene: ${noHash['scene']}");

  // רווחים מסביב — trim
  final trimmed = orbitTheme(' #e91e63 ', fb);
  final trimmedVars = trimmed['vars'] as Map<String, String>;
  assert(trimmedVars['--o-accent'] == '#e91e63', 'trim לרווחים');

  print('✓ orbit-theme (Dart): 16 דוגמאות-חוזה — ירוק');
}
