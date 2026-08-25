// רתמת-זהב · guide-foot — assert = דוגמת-החוזה של בדיקת-ה-JS (צילום-ערך, זהה).
// בדיקת-ה-JS: JSON.stringify(GUIDE_FOOT) === הצילום ⇒ הערך חייב להיות מילה-במילה.
import 'guide-foot.dart';

void main() {
  const expected =
      'המדריך המלא והמפורט נמצא בקובץ "מדריך למשתמש" — מסך-מסך וכפתור-כפתור.';
  assert(guideFoot == expected, '✗ guideFoot סטה מהצילום ⇒ $guideFoot');
  print('✓ guide-foot (Dart): צילום-ערך תואם — ירוק');
}
