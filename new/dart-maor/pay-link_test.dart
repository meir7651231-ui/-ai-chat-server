// רתמת-זהב · pay-link — 7 דוגמאות-החוזה זהות לבדיקת-ה-JS (new/atoms/pay-link.test.mjs).
// אם עובר: Dart ≡ JS. הרצה: dart run --enable-asserts pay-link_test.dart
import 'pay-link.dart';

// שקע safeHttpsUrl כחוזה safe-https-url: https בלבד, שבור/ריק ⇒ null.
String? safeHttpsUrl(String raw) {
  final t = raw.trim();
  if (t.isEmpty) return null;
  Uri u;
  try {
    u = Uri.parse(t);
  } catch (_) {
    return null;
  }
  if (!u.hasScheme || u.host.isEmpty) return null;
  return u.scheme == 'https' ? u.toString() : null;
}

void main() {
  // 1 · לא-https ⇒ null
  assert(payLink('http://pay.example.com/x', 100, '', safeHttpsUrl) == null);
  // 2 · גנרי
  assert(payLink('https://pay.example.com/give', 100, 'דוד', safeHttpsUrl) ==
      'https://pay.example.com/give?amount=100&name=%D7%93%D7%95%D7%93');
  // 3 · עיגול ל-2 ספרות
  assert(payLink('https://pay.example.com/give', 99.999, '', safeHttpsUrl) ==
      'https://pay.example.com/give?amount=100');
  // 4 · סכום-0 = בלי פרמטרים
  assert(payLink('https://pay.example.com/give', 0, '', safeHttpsUrl) ==
      'https://pay.example.com/give');
  // 5 · תבנית
  assert(payLink('https://x.com/pay/{amount}/{name}', 250, 'רות', safeHttpsUrl) ==
      'https://x.com/pay/250/%D7%A8%D7%95%D7%AA');
  // 6 · נדרים-פלוס (Amount/ClientName)
  assert(payLink('https://www.matara.pro/nedarimplus/online/?mosad=123', 180,
          'לוי', safeHttpsUrl) ==
      'https://www.matara.pro/nedarimplus/online/?mosad=123&Amount=180&ClientName=%D7%9C%D7%95%D7%99');
  // 7 · תבנית עם סכום-0 (שדה מוחלף בריק)
  assert(payLink('https://x.com/pay/{amount}', 0, '', safeHttpsUrl) ==
      'https://x.com/pay/');
  print('✓ pay-link (Dart): 7 דוגמאות-חוזה — ירוק · Dart ≡ JS');
}
