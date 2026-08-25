// רתמת-זהב · meta-of — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות ביט-לביט).
// JS undefined ⇒ Dart null (שדה חסר ב-Map). '===' של הפניה ⇒ identical().
import 'meta-of.dart';

const metaKeys = [
  'orgName', 'orgSite', 'orgDonate', 'orgGoal', 'budget', 'usdRate', 'audit',
  'notif', 'reports', 'ui', 'seq', 'receiptSeq', 'donationSeq', 'shopReceiptSeq',
  'attnDone', 'savedAt',
];

void main() {
  final ui = {'theme': 'dark'};
  final audit = [
    {'t': '2026-08-24', 'a': 'add'}
  ];
  final db = <String, dynamic>{
    'v': 6,
    'orgName': 'מאור',
    'orgSite': 'https://x',
    'orgDonate': '',
    'orgGoal': 100000,
    'budget': 5000,
    'usdRate': 3.7,
    'audit': audit,
    'notif': <String, dynamic>{},
    'reports': <String, dynamic>{},
    'ui': ui,
    'seq': 42,
    'receiptSeq': 7,
    'donationSeq': 3,
    'shopReceiptSeq': 1,
    'attnDone': <String, dynamic>{},
    'savedAt': '2026-08-24T10:00:00',
    'supporters': [
      {'id': 's1'}
    ],
    'families': [
      {'id': 'f1'}
    ],
    'courses': [],
    'events': [],
  };

  // דוגמה 1 — ערכי-meta עוברים, ישויות לא
  {
    final out = metaOf(db);
    assert(out['orgName'] == 'מאור', '✗ 1 orgName');
    assert(
        out['seq'] == 42 &&
            out['receiptSeq'] == 7 &&
            out['donationSeq'] == 3 &&
            out['shopReceiptSeq'] == 1,
        '✗ 1 מונים');
    assert(out['usdRate'] == 3.7 && out['savedAt'] == '2026-08-24T10:00:00',
        '✗ 1 usdRate/savedAt');
    assert(
        !out.containsKey('supporters') &&
            !out.containsKey('families') &&
            !out.containsKey('courses'),
        '✗ 1 בלי-ישויות');
  }
  // דוגמה 2 — בדיוק 16 המפתחות, בסדר החוזה
  {
    final out = metaOf(db);
    assert(_listEq(out.keys.toList(), metaKeys), '✗ 2 סט-מפתחות');
  }
  // דוגמה 3 — v לא עובר
  {
    assert(!metaOf(db).containsKey('v'), '✗ 3 בלי-v');
  }
  // דוגמה 4 — שדה חסר ⇒ מפתח קיים עם null (undefined ב-JS)
  {
    final noBudget = Map<String, dynamic>.from(db)..remove('budget');
    final out = metaOf(noBudget);
    assert(out.containsKey('budget') && out['budget'] == null, '✗ 4 מפתח-קיים');
  }
  // דוגמה 5 — עומק בהפניה (הטלה, לא העתקה)
  {
    final out = metaOf(db);
    assert(identical(out['ui'], db['ui']) && identical(out['audit'], db['audit']),
        '✗ 5 ui-בהפניה');
  }

  print('✓ meta-of: 5 דוגמאות-חוזה — ירוק');
}

bool _listEq(List<Object?> a, List<Object?> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}
