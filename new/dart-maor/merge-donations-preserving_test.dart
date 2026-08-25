// רתמת-זהב · merge-donations-preserving — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS
// (new/atoms/merge-donations-preserving.test.mjs, אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// === של JS על הפניה ⇒ identical(); JSON.stringify-eq ⇒ השוואת-עומק מבנית.
// הרצה: dart run --enable-asserts new/dart-maor/merge-donations-preserving_test.dart ⇒ exit 0
import 'merge-donations-preserving.dart';

// השוואת-עומק (מדמה JSON.stringify-eq של בדיקת-ה-JS): מפות לפי מפתחות, רשימות לפי-סדר.
bool _deepEq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

void main() {
  // 1) אוסף שאינו supporters ⇒ incoming עצמו (אותה הפניה)
  {
    final inc = <String, dynamic>{'donations': [], 'count': 9};
    assert(
      identical(mergeDonationsPreserving('families', {'count': 99}, inc), inc),
      '✗ col זר לא הוחזר כמות-שהוא',
    );
  }

  // 2) שימור תרומה מקומית-בלבד + מונים max
  {
    final local = <String, dynamic>{
      'donations': [
        {'rid': 'R-1', 'ils': 100},
        {'rid': 'R-2', 'ils': 50},
      ],
      'count': 2,
      'ils': 150,
      'usd': 0,
    };
    final inc = <String, dynamic>{
      'donations': [
        {'rid': 'R-1', 'ils': 100},
      ],
      'count': 1,
      'ils': 100,
      'usd': 0,
    };
    assert(
      _deepEq(mergeDonationsPreserving('supporters', local, inc), {
        'donations': [
          {'rid': 'R-1', 'ils': 100},
          {'rid': 'R-2', 'ils': 50},
        ],
        'count': 2,
        'ils': 150,
        'usd': 0,
      }),
      '✗ שימור-מקומית/מוני-max שגוי',
    );
  }

  // 3) זהים ⇒ אותה הפניה
  {
    final inc = <String, dynamic>{
      'donations': [
        {'rid': 'R-1'},
      ],
      'count': 1,
      'ils': 100,
    };
    final local = <String, dynamic>{
      'donations': [
        {'rid': 'R-1'},
      ],
      'count': 1,
      'ils': 100,
    };
    assert(
      identical(mergeDonationsPreserving('supporters', local, inc), inc),
      '✗ זהים לא הוחזרו באותה הפניה',
    );
  }

  // 4) תרומה מקומית בלי rid אינה משתמרת ⇒ אותה הפניה
  {
    final inc = <String, dynamic>{'donations': [], 'count': 0, 'ils': 0};
    assert(
      identical(
        mergeDonationsPreserving('supporters', {
          'donations': [
            {'ils': 5},
          ],
          'count': 0,
          'ils': 0,
        }, inc),
        inc,
      ),
      '✗ תרומה בלי rid שומרה בטעות',
    );
  }

  // 5) מונים רק עולים גם בלי תרומות-לשימור
  {
    final local = <String, dynamic>{
      'donations': [],
      'count': 3,
      'ils': 0,
      'usd': 0,
    };
    final inc = <String, dynamic>{
      'donations': [
        {'rid': 'R-9'},
      ],
      'count': 1,
      'ils': 0,
      'usd': 0,
    };
    assert(
      _deepEq(mergeDonationsPreserving('supporters', local, inc), {
        'donations': [
          {'rid': 'R-9'},
        ],
        'count': 3,
        'ils': 0,
        'usd': 0,
      }),
      '✗ מונה מקומי גבוה לא שרד',
    );
  }

  // 6) מונה לא-מספרי ⇒ 0
  {
    final out = mergeDonationsPreserving(
      'supporters',
      {'donations': [], 'count': 2},
      {'donations': [], 'count': '7'},
    );
    assert(out['count'] == 2, '✗ מחרוזת-מונה לא אופסה ⇒ ${out['count']}');
  }

  // 7) עריכת-ענן על rid משותף מנצחת
  {
    final local = <String, dynamic>{
      'donations': [
        {'rid': 'R-1', 'ils': 100},
      ],
      'count': 1,
      'ils': 120,
      'usd': 0,
    };
    final inc = <String, dynamic>{
      'donations': [
        {'rid': 'R-1', 'ils': 120},
      ],
      'count': 1,
      'ils': 120,
      'usd': 0,
    };
    final out = mergeDonationsPreserving('supporters', local, inc);
    assert(
      _deepEq(out['donations'], [
        {'rid': 'R-1', 'ils': 120},
      ]),
      '✗ גרסת-הענן על rid משותף לא ניצחה',
    );
  }

  // ignore: avoid_print
  print('✓ merge-donations-preserving: 7 דוגמאות-חוזה — ירוק');
}
