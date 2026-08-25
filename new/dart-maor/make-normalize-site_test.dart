// רתמת-זהב · make-normalize-site — בדיוק דוגמאות-החוזה של בדיקת-ה-JS
// (new/atoms/make-normalize-site.test.mjs). עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts make-normalize-site_test.dart  (חייב exit 0)

import 'make-normalize-site.dart';

bool deepEq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

// שקע-https מינימלי תואם-חוזה (מקביל ל-safe של בדיקת-ה-JS).
String? safe(dynamic raw) {
  final t = (raw is String ? raw : '').trim();
  if (t.isEmpty) return null;
  try {
    final u = Uri.parse(t);
    return u.scheme == 'https' ? u.toString() : null;
  } catch (_) {
    return null;
  }
}

void main() {
  final ns = makeNormalizeSite(safe, ['he', 'en', 'yi']);

  // 1) זבל => null (=undefined)
  for (final junk in [null, 'str', 42, <dynamic>[]]) {
    assert(ns(junk) == null, 'junk: $junk');
  }

  // 2) https-בלבד
  final evil = ns({
    'donateUrl': 'javascript:alert(1)',
    'gallery': ['http://x.co/a.jpg', 'https://ok.co/b.jpg'],
  })!;
  assert(!evil.containsKey('donateUrl'), 'javascript: שרד!');
  assert(deepEq(evil['gallery'], ['https://ok.co/b.jpg']), 'gallery');

  // 3) תווי-בקרה נמחקים + תקרות + שדה-זר נזרק
  final s2 = ns({
    'icon': 'אב${String.fromCharCode(7)}ג',
    'tagline': 'א' * 300,
    'hackerField': 'x',
  })!;
  assert(s2['icon'] == 'אבג', 'תו-בקרה שרד');
  assert((s2['tagline'] as String).length == 200, 'תקרת-אורך');
  assert(!s2.containsKey('hackerField'), 'שדה-זר שרד');

  // 4) רב-לשוני: רק allowlist, ערך-ריק נזרק; אובייקט-ריק לא נכתב
  final s3 = ns({
    'tagline': {'he': 'שלום', 'xx': 'nope', 'en': '  '},
    'campaign': {'junk': 1},
  })!;
  assert(deepEq(s3['tagline'], {'he': 'שלום'}), 'tagline-map');
  assert(!s3.containsKey('campaign'), 'קמפיין-ריק נכתב');

  // 5) תקרות-כמות: services<=12; faq שלם-בלבד
  final s4 = ns({
    'services':
        List.generate(20, (i) => {'title': 'ש$i'}),
    'faq': [
      {'q': 'שאלה'},
      {'q': 'ש', 'a': 'ת'},
    ],
  })!;
  assert((s4['services'] as List).length == 12, 'services<=12');
  assert(deepEq(s4['faq'], [{'q': 'ש', 'a': 'ת'}]), 'faq שלם-בלבד');

  // 6) טלפון מנוקה; מייל בלי @ נזרק; וואטסאפ שורד
  final s5 = ns({
    'contact': {
      'phones': ['050-123x4567!', 'abc'],
      'email': 'not-an-email',
      'whatsapp': '+972 50 1234567',
    },
  })!;
  final contact = s5['contact'] as Map;
  assert(deepEq(contact['phones'], ['050-1234567']), 'phones');
  assert(!contact.containsKey('email'), 'מייל בלי @ שרד');
  assert(contact['whatsapp'] == '+972 50 1234567', 'whatsapp');

  print('OK make-normalize-site (Dart≡JS)');
}
