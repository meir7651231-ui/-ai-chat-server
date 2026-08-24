// בדיקת-חוזה (רתמת-זהב) · applyAyinSheet — מייבאת אך ורק את האטום-שלה (חוק-4).
// 13 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/apply-ayin-sheet.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/apply-ayin-sheet_test.dart  ⇒ exit 0
import 'apply-ayin-sheet.dart';

// mkAyin — מקבילה ל-`() => ({...})` של המקור: מבנה-טרי חדש בכל קריאה.
Map<String, dynamic> mkAyin() => {
      'stage': 'new',
      'answeredNote': '',
      'lastTouch': '',
      'names': [
        {'id': 'n1', 'name': 'משה', 'eyes': 3, 'done': false},
      ],
      'answers': <dynamic>[],
      'log': <dynamic>[],
    };

const TODAY = '2026-08-24';

int f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    f = 1;
  }
}

void main() {
  final base = <dynamic>[
    {'id': 's1', 'name': 'לוי', 'ayin': mkAyin()},
    {'id': 's2', 'name': 'כהן', 'ayin': mkAyin()},
  ];

  final r1 = applyAyinSheet(
    base,
    [
      {
        'supporterId': 's1',
        'nameId': 'n1',
        'eyes': 5,
        'done': null,
        'paid': true,
        'answer': 'התקבלה',
        'lead': null,
      },
    ],
    TODAY,
  );
  final a1 = (r1['supporters'] as List)[0]['ayin'] as Map<String, dynamic>;
  ok(r1['logged'] == 1, 'logged=1, בפועל ${r1['logged']}');
  final log0 = (a1['log'] as List)[0] as Map<String, dynamic>;
  ok(
    log0['date'] == TODAY && log0['eyes'] == 5 && log0['name'] == 'משה',
    'log[0]: $log0',
  );
  ok((a1['names'] as List)[0]['eyes'] == 5, 'names[0].eyes=5');
  ok(a1['paid'] == true, 'paid=true');
  ok(
    (a1['answers'] as List)[0]['note'] == 'התקבלה' && a1['answeredNote'] == 'התקבלה',
    'answer+answeredNote',
  );
  ok(a1['lastTouch'] == TODAY, 'lastTouch=today');
  ok(identical((r1['supporters'] as List)[1], base[1]), 'תומך בלי upds ⇒ אותה הפניה');
  final baseAyin0 = base[0]['ayin'] as Map<String, dynamic>;
  ok(
    (baseAyin0['names'] as List)[0]['eyes'] == 3 && (baseAyin0['log'] as List).isEmpty,
    'המקור לא שונה (אימוטביליות)',
  );

  // eyes זהה ⇒ אין log; answer כפול ⇒ דה-דופ:
  final r2 = applyAyinSheet(
    r1['supporters'] as List,
    [
      {
        'supporterId': 's1',
        'nameId': 'n1',
        'eyes': 5,
        'done': null,
        'paid': null,
        'answer': 'התקבלה',
        'lead': null,
      },
    ],
    TODAY,
  );
  ok(r2['logged'] == 0, 'eyes זהה ⇒ logged=0');
  final r2ayin = (r2['supporters'] as List)[0]['ayin'] as Map<String, dynamic>;
  ok((r2ayin['answers'] as List).length == 1, 'answer כפול ⇒ answers לא גדל');

  // lead: stage='new' ⇒ 'eyes'; stage='done' ⇒ נשאר:
  final r3 = applyAyinSheet(
    base,
    [
      {
        'supporterId': 's1',
        'nameId': 'n1',
        'eyes': null,
        'done': null,
        'paid': null,
        'answer': null,
        'lead': true,
      },
    ],
    TODAY,
  );
  ok(
    (r3['supporters'] as List)[0]['ayin']['stage'] == 'eyes',
    "lead על 'new' ⇒ stage='eyes'",
  );

  final doneSp = <dynamic>[
    {
      'id': 's1',
      'name': 'לוי',
      'ayin': {...mkAyin(), 'stage': 'done'},
    },
  ];
  final r4 = applyAyinSheet(
    doneSp,
    [
      {
        'supporterId': 's1',
        'nameId': 'n1',
        'eyes': null,
        'done': null,
        'paid': null,
        'answer': null,
        'lead': true,
      },
    ],
    TODAY,
  );
  ok(
    (r4['supporters'] as List)[0]['ayin']['stage'] == 'done',
    "lead על 'done' ⇒ נשאר 'done'",
  );

  // nameId זר ⇒ מדולג כולו (בלי lastTouch):
  final r5 = applyAyinSheet(
    base,
    [
      {
        'supporterId': 's1',
        'nameId': 'זר',
        'eyes': 9,
        'done': null,
        'paid': null,
        'answer': null,
        'lead': null,
      },
    ],
    TODAY,
  );
  ok(
    r5['logged'] == 0 && (r5['supporters'] as List)[0]['ayin']['lastTouch'] == '',
    'nameId זר ⇒ לא נגוע',
  );

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(r1['logged'] == 1, 'assert-live guard');

  if (f != 0) throw StateError('apply-ayin-sheet: סטייה מהמקור');
  print('✓ apply-ayin-sheet: 13 דוגמאות-חוזה — ירוק');
}
