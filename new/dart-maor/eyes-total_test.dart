// רתמת-זהב · eyes-total — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות; אם עובר, Dart≡JS).
import 'eyes-total.dart';

void main() {
  assert(eyesTotal({'names': []}) == 0, '✗ ריק ⇒ 0');
  assert(eyesTotal({'names': [{'eyes': 3}, {'eyes': 2}]}) == 5, '✗ 3+2 ⇒ 5');
  assert(eyesTotal({'names': [{'eyes': '4'}]}) == 4, "✗ '4' ⇒ 4 (כפייה-מספרית)");
  assert(eyesTotal({'names': [{}, {'eyes': 'שטויות'}, {'eyes': 2}]}) == 2, '✗ חסר/שבור ⇒ 2');
  assert(eyesTotal({'names': [{'eyes': 0.5}, {'eyes': 1.5}]}) == 2, '✗ שברים ⇒ 2');
  assert(eyesTotal({'names': [{'eyes': -1}, {'eyes': 5}]}) == 4, '✗ שלילי לא מסונן ⇒ 4');
  print('✓ eyes-total (Dart): 6 דוגמאות-חוזה — ירוק');
}
