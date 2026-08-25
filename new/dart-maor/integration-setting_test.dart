// רתמת-זהב · integration-setting — דוגמאות-החוזה בדיוק כמו בדיקת-ה-JS.
// אם עובר: Dart ≡ JS (חוק-4). המר את הערכים ל-Dart (Map במקום object).
import 'integration-setting.dart';

void main() {
  // 1. trim על מחרוזת
  assert(integrationSetting({
        'integrations': {
          'payments': {'payUrl': '  https://pay.example  '}
        }
      }, 'payments', 'payUrl') ==
      'https://pay.example');

  // 2. אין integrations ⇒ ''
  assert(integrationSetting({}, 'payments', 'payUrl') == '');

  // 3. הרחבה ריקה ⇒ ''
  assert(integrationSetting({
        'integrations': {'payments': {}}
      }, 'payments', 'payUrl') ==
      '');

  // 4. לא-מחרוזת (מספר) ⇒ ''
  assert(integrationSetting({
        'integrations': {
          'payments': {'payUrl': 42}
        }
      }, 'payments', 'payUrl') ==
      '');

  // 5. בוליאני אינו מחרוזת ⇒ ''
  assert(integrationSetting({
        'integrations': {
          'whatsapp': {'enabled': true}
        }
      }, 'whatsapp', 'enabled') ==
      '');

  // 6. רווחים בלבד ⇒ '' (trim מצמצם לריק)
  assert(integrationSetting({
        'integrations': {
          'campaign': {'url': '   '}
        }
      }, 'campaign', 'url') ==
      '');

  print('✓ integration-setting: 6 דוגמאות-חוזה — Dart≡JS (מחרוזת-trim בלבד, אחרת ריק)');
}
