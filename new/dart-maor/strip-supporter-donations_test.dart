// 🥇 רתמת-זהב · stripSupporterDonations — 6 דוגמאות-החוזה של בדיקת-ה-JS, ביט-אחר-ביט.
// המקור: new/atoms/strip-supporter-donations.test.mjs (ה-checks = מקור-האמת).
// השוואת-מערכים/מפות = אורך + איבר-איבר (כלל-8, בלי join); מפות גם בסדר-מפתחות —
// שקילות ל-JSON.stringify של הבדיקה המקורית. זהות-רפרנס = identical().
// כשל ⇒ StateError. הרצה: dart run --enable-asserts strip-supporter-donations_test.dart
import 'strip-supporter-donations.dart';

void chk(String n, bool ok) {
  if (!ok) throw StateError('✗ $n');
}

/// שקילות-עומק בסדר: List = אורך + איבר-איבר (כלל-8); Map = רשימת-מפתחות זהה-בסדר
/// + ערכים — בדיוק מה ש-JSON.stringify-equality של בדיקת-ה-JS בודקת.
bool eq(dynamic a, dynamic b) {
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!eq(a[i], b[i])) return false;
    }
    return true;
  }
  if (a is Map && b is Map) {
    final ka = a.keys.toList();
    final kb = b.keys.toList();
    if (ka.length != kb.length) return false;
    for (var i = 0; i < ka.length; i++) {
      if (ka[i] != kb[i]) return false;
      if (!eq(a[ka[i]], b[kb[i]])) return false;
    }
    return true;
  }
  return a == b;
}

void main() {
  // 1. ריקון donations בתומך, שאר-השדות נשמרים
  final d1 = {
    'sets': [
      {
        'col': 'supporters',
        'id': 's1',
        'data': {
          'name': 'ראובן',
          'donations': [
            {'amount': 100}
          ]
        }
      }
    ],
    'deletes': <dynamic>[]
  };
  final r1 = stripSupporterDonations(d1);
  chk(
      'דוגמה-1',
      eq((r1['sets'] as List)[0]['data'],
          {'name': 'ראובן', 'donations': <dynamic>[]}));

  // 2. אוסף אחר — ללא-שינוי (זהה-רפרנס)
  final d2 = {
    'sets': [
      {
        'col': 'families',
        'id': 'f1',
        'data': {
          'donations': [1, 2]
        }
      }
    ]
  };
  final r2 = stripSupporterDonations(d2);
  chk(
      'דוגמה-2',
      identical((r2['sets'] as List)[0], (d2['sets'] as List)[0]) &&
          eq((r2['sets'] as List)[0]['data']['donations'], [1, 2]));

  // 3. data:null — לא נוגעים
  final d3 = {
    'sets': [
      {'col': 'supporters', 'id': 's2', 'data': null}
    ]
  };
  chk(
      'דוגמה-3',
      identical((stripSupporterDonations(d3)['sets'] as List)[0],
          (d3['sets'] as List)[0]));

  // 4. שדות-אחים עוברים זהה-רפרנס
  final meta = {'orgName': 'א'};
  final d4 = {
    'sets': <dynamic>[],
    'deletes': ['x'],
    'meta': meta
  };
  final r4 = stripSupporterDonations(d4);
  chk('דוגמה-4',
      identical(r4['deletes'], d4['deletes']) && identical(r4['meta'], meta));

  // 5. אי-מוטציה של המקור
  chk(
      'דוגמה-5',
      eq((d1['sets'] as List)[0]['data']['donations'], [
        {'amount': 100}
      ]));

  // 6. תומך בלי donations — המפתח נוסף ריק
  final d6 = {
    'sets': [
      {
        'col': 'supporters',
        'id': 's3',
        'data': {'name': 'לאה'}
      }
    ]
  };
  chk(
      'דוגמה-6',
      eq((stripSupporterDonations(d6)['sets'] as List)[0]['data'],
          {'name': 'לאה', 'donations': <dynamic>[]}));

  print('OK — strip-supporter-donations (Dart): 6 דוגמאות-חוזה — ירוק');
}
