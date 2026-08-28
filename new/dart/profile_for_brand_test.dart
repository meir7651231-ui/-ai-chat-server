// בדיקת-חוזה · profileForBrand — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/profile_for_brand_test.dart
import 'profile_for_brand.dart';

// משקף את מבנה-המקור: kBrandProfiles (brand_profile.dart:425-429) + kLipskeyProfile (:416-422).
const Map<String, String> _profiles = {
  'פולירול': 'P',
  'חוליות': 'H',
  'ליפסקי': 'L',
};
const String _fallback = 'L';

void main() {
  var n = 0;

  // [1-2] מפתחות-סולם מדויקים ⇒ הפרופיל שלהם.
  final r1 = profileForBrand<String>('פולירול', profiles: _profiles, fallback: _fallback);
  if (r1 != 'P') throw StateError('FAIL [1 polyroll]: $r1'); n++;
  final r2 = profileForBrand<String>('חוליות', profiles: _profiles, fallback: _fallback);
  if (r2 != 'H') throw StateError('FAIL [2 huliot]: $r2'); n++;

  // [3] 'ליפסקי' הוא מפתח קיים במפה — מוחזר דרך ה-lookup, לא דרך ה-??.
  final r3 = profileForBrand<String>('ליפסקי', profiles: _profiles, fallback: 'OTHER');
  if (r3 != 'L') throw StateError('FAIL [3 lipskey-as-key]: $r3'); n++;

  // [4] null ⇒ fallback (המקור: brandName הוא String? — :435).
  final r4 = profileForBrand<String>(null, profiles: _profiles, fallback: _fallback);
  if (r4 != 'L') throw StateError('FAIL [4 null]: $r4'); n++;

  // [5] מותג לא-ממופה (AQUATEC — :433) ⇒ fallback.
  final r5 = profileForBrand<String>('AQUATEC', profiles: _profiles, fallback: _fallback);
  if (r5 != 'L') throw StateError('FAIL [5 aquatec]: $r5'); n++;

  // [6] מחרוזת ריקה ⇒ fallback.
  final r6 = profileForBrand<String>('', profiles: _profiles, fallback: _fallback);
  if (r6 != 'L') throw StateError('FAIL [6 empty]: $r6'); n++;

  // [7] אפס-נרמול: רווח מוביל אינו מפתח ⇒ fallback (המקור לא עושה trim).
  final r7 = profileForBrand<String>(' פולירול', profiles: _profiles, fallback: _fallback);
  if (r7 != 'L') throw StateError('FAIL [7 no-trim]: $r7'); n++;

  // [8] מפה ריקה ⇒ תמיד fallback; לעולם לא זורק.
  final r8 = profileForBrand<String>('פולירול', profiles: const {}, fallback: _fallback);
  if (r8 != 'L') throw StateError('FAIL [8 empty-map]: $r8'); n++;

  assert(
      profileForBrand<String>('חוליות', profiles: _profiles, fallback: _fallback) == 'H',
      'assert-live guard');

  print('OK profileForBrand: $n asserts passed');
}
