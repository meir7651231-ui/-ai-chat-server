// רתמת-זהב · maps-search-url — דוגמאות-החוזה של בדיקת-ה-JS, ביט-אחר-ביט.
// אם עובר ⇒ Dart ≡ JS (new/atoms/maps-search-url.test.mjs).
import 'maps-search-url.dart';

void main() {
  // ("הרצל 10","תל אביב")
  assert(mapsSearchUrl('הרצל 10', 'תל אביב') ==
      'https://www.google.com/maps/search/?api=1&query=%D7%94%D7%A8%D7%A6%D7%9C%2010%2C%20%D7%AA%D7%9C%20%D7%90%D7%91%D7%99%D7%91');
  // ("Main St 5")
  assert(mapsSearchUrl('Main St 5') ==
      'https://www.google.com/maps/search/?api=1&query=Main%20St%205');
  // (""," ")
  assert(mapsSearchUrl('', ' ') == null);
  // ("a|b","עיר")
  assert(mapsSearchUrl('a|b', 'עיר') ==
      'https://www.google.com/maps/search/?api=1&query=a%20b%2C%20%D7%A2%D7%99%D7%A8');

  print('✓ maps-search-url (Dart): 4 דוגמאות-חוזה — ירוק');
}
