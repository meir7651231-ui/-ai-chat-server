// רתמת-זהב · pin-needs-rehash — בדיוק דוגמאות-החוזה של בדיקת-ה-JS (undefined→null).
import 'pin-needs-rehash.dart';

void main() {
  assert(pinNeedsRehash('abc123') == true);
  assert(pinNeedsRehash('v2:salt:digest') == false);
  assert(pinNeedsRehash('') == false);
  assert(pinNeedsRehash(null) == false); // undefined ב-JS
  assert(pinNeedsRehash('v2') == true);
  print('✓ pin-needs-rehash: 5 דוגמאות-חוזה — ירוק');
}
