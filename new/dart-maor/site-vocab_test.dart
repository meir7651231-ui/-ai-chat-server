// רתמת-זהב · site-vocab — כל דוגמאות-החוזה + בדיקת-ה-JS (site-vocab.test.mjs), זהות.
// השוואת-מפה = מפתחות (אורך + איבר-איבר, בסדר-הכנסה כמו JSON.stringify) + ערכים — כלל-8.
import 'site-vocab.dart';

void _eqMap(String label, dynamic got, Map<String, dynamic> want) {
  final g = got as Map;
  final gKeys = g.keys.toList();
  final wKeys = want.keys.toList();
  if (gKeys.length != wKeys.length) {
    throw StateError('✗ $label: מספר-מפתחות ${gKeys.length} ≠ ${wKeys.length}');
  }
  for (var i = 0; i < wKeys.length; i++) {
    if (gKeys[i] != wKeys[i]) {
      throw StateError('✗ $label: מפתח[$i] ${gKeys[i]} ≠ ${wKeys[i]}');
    }
    final k = wKeys[i];
    if (g[k] != want[k]) {
      throw StateError("✗ $label: '$k' ⇒ ${g[k]} ≠ ${want[k]}");
    }
  }
}

void main() {
  // דוגמאות-חוזה 1–4 (זהות לבדיקת-ה-JS):
  _eqMap("(false,'he')", siteVocab(false, 'he'), {
    'heroCta': 'לתרומה עכשיו',
    'navCta': 'לתרומה ♡',
    'give': 'לתרומה ♡',
    'giveLabel': 'התרומה שלך',
    'commercial': false,
  });
  _eqMap("(false,'en')", siteVocab(false, 'en'), {
    'heroCta': 'Donate now',
    'navCta': 'Donate ♡',
    'give': 'Donate ♡',
    'giveLabel': 'Your gift',
    'commercial': false,
  });
  _eqMap("(true,'he')", siteVocab(true, 'he'), {
    'heroCta': 'צרו קשר',
    'navCta': 'צרו קשר',
    'give': 'צרו קשר',
    'giveLabel': 'הפנייה שלך',
    'commercial': true,
  });
  _eqMap("(true,'en')", siteVocab(true, 'en'), {
    'heroCta': 'Get in touch',
    'navCta': 'Contact',
    'give': 'Contact us',
    'giveLabel': 'Your request',
    'commercial': true,
  });
  // דוגמה 5: יידיש נופלת לעברית — זהה-ביט ל-(false,'he').
  final he = siteVocab(false, 'he') as Map;
  _eqMap("(false,'yi')≡(false,'he')", siteVocab(false, 'yi'),
      he.map((k, v) => MapEntry(k as String, v)));
  print('OK');
  print('✓ site-vocab (Dart): 5 דוגמאות-חוזה — ירוק');
}
