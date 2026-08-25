// זהב · is-valid-pin — assert-ים = בדיוק דוגמאות-החוזה של is-valid-pin.test.mjs (JS≡Dart).
// הערכים הומרו לערכי-Dart ילידיים (המקבילים ל-JSON.parse של קלטי-ה-Golden).
import 'is-valid-pin.dart';

void main() {
  assert(isValidPin('123456782') == false); // 9 ספרות
  assert(isValidPin('039217369') == false); // 9 ספרות
  assert(isValidPin({'amount': 100}) == false); // מפה
  assert(isValidPin({'payments': [{'amount': 100}, {'amount': 50}]}) == false);
  assert(isValidPin({'name': 'כהן', 'phone': '0501234567'}) == false);
  assert(isValidPin([{'amount': 100}]) == false); // מערך-מפות
  assert(isValidPin(['2026-08-24']) == false); // מקפים
  assert(isValidPin(3.14) == false); // נקודה
  assert(isValidPin(1000) == true); // 4 ספרות
  assert(isValidPin(2026) == true); // 4 ספרות
  assert(isValidPin('') == false); // ריק
  assert(isValidPin('אבג') == false); // לא-ספרות
  print('✓ is-valid-pin: 12 הקלטות-Golden — Dart≡JS ירוק');
}
