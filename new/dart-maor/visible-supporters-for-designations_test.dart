// בדיקת-חוזה (רתמת-זהב) · visibleSupportersForDesignations — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 דוגמאות-החוזה (Golden) זהות ביט-אחר-ביט למקור new/atoms/visible-supporters-for-designations.test.mjs:
// supporters ∈ {"", "אבג", "כהן לוי", "abc"} × allowed ∈ {"", 0, 1} — כולן נופלות בגארד
// `!allowed || !allowed.length` (‏'' /0 כוזבים; ל-1 אין length ⇒ undefined ⇒ כוזב) ומחזירות
// את supporters כמות-שהוא. בנוסף בדיקות-פונקציונליות שחושבו ידנית מהרצת-JS מנטלית
// (מערכים = אורך + איבר-איבר, לעולם לא join של אמון-עיוור).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/visible-supporters-for-designations_test.dart ⇒ exit 0
import 'visible-supporters-for-designations.dart';

void _fail(String label, String got, String want) {
  throw StateError('FAIL [$label]:\n got =$got\n want=$want');
}

void main() {
  var n = 0;

  // ——— 12 הקלטות-ה-Golden: allowed כוזב/בלי-length ⇒ אותו ערך (אותה רפרנס) ———
  const sups = <String>['', 'אבג', 'כהן לוי', 'abc'];
  const allowedVals = <dynamic>['', 0, 1];
  for (final s in sups) {
    for (final a in allowedVals) {
      final got = visibleSupportersForDesignations(s, a);
      if (!identical(got, s)) {
        _fail('Golden "$s" × $a', '$got', s);
      }
      n++;
    }
  }

  // ——— פונקציונלי 1: סינון תורמים + סינון תרומות (JS: filter+map+spread) ———
  final supporters = <dynamic>[
    <String, dynamic>{
      'name': 'a',
      'forWho': ' חתן ',
      'donations': <dynamic>[
        <String, dynamic>{'purpose': 'חתן', 'ils': 10},
        <String, dynamic>{'purpose': '', 'ils': 20},
        <String, dynamic>{'purpose': 'כללי', 'ils': 30},
        <String, dynamic>{'ils': 40}, // purpose חסר ⇒ '' ⇒ נשאר
      ],
    },
    <String, dynamic>{'name': 'b', 'forWho': '', 'donations': <dynamic>[]},
    <String, dynamic>{'name': 'c'}, // forWho חסר ⇒ '' ⇒ מוסתר
    <String, dynamic>{'name': 'd', 'forWho': 'כללי'}, // לא ברשימה ⇒ מוסתר
  ];
  final r1 = visibleSupportersForDesignations(supporters, <dynamic>['חתן ']) as List;
  if (r1.length != 1) _fail('פונקציונלי-1 אורך', '${r1.length}', '1');
  n++;
  final a0 = r1[0] as Map;
  if (a0['name'] != 'a') _fail('פונקציונלי-1 שם', '${a0['name']}', 'a');
  n++;
  final d0 = a0['donations'] as List;
  if (d0.length != 3) _fail('פונקציונלי-1 תרומות אורך', '${d0.length}', '3');
  n++;
  final wantIls = <int>[10, 20, 40];
  for (var i = 0; i < wantIls.length; i++) {
    if ((d0[i] as Map)['ils'] != wantIls[i]) {
      _fail('פונקציונלי-1 תרומה[$i]', '${(d0[i] as Map)['ils']}', '${wantIls[i]}');
    }
    n++;
  }
  // עותק-רדוד: המקור לא שונה (ל-a המקורי עדיין 4 תרומות).
  if (((supporters[0] as Map)['donations'] as List).length != 4) {
    _fail('פונקציונלי-1 אי-מוטציה', 'שונה', '4 תרומות במקור');
  }
  n++;

  // ——— פונקציונלי 2: allowed=[] (רשימה-ריקה, length=0 כוזב) ⇒ אותה רפרנס ———
  final r2 = visibleSupportersForDesignations(supporters, <dynamic>[]);
  if (!identical(r2, supporters)) _fail('allowed=[]', 'עותק', 'אותה רפרנס');
  n++;

  // ——— פונקציונלי 3: allowed=null ⇒ אותה רפרנס ———
  final r3 = visibleSupportersForDesignations(supporters, null);
  if (!identical(r3, supporters)) _fail('allowed=null', 'עותק', 'אותה רפרנס');
  n++;

  // ——— פונקציונלי 4: donations חסר ⇒ נולד [] בעותק (spread מוסיף מפתח) ———
  final r4 = visibleSupportersForDesignations(
    <dynamic>[
      <String, dynamic>{'name': 'e', 'forWho': 'כלה'},
    ],
    <dynamic>['כלה'],
  ) as List;
  final e0 = r4[0] as Map;
  if (!e0.containsKey('donations') || (e0['donations'] as List).isNotEmpty) {
    _fail('donations חסר', '${e0['donations']}', '[]');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    identical(visibleSupportersForDesignations('אבג', 0), 'אבג'),
    'assert-live guard',
  );

  print('OK visibleSupportersForDesignations: $n asserts passed');
}
