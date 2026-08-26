// 🧪 הוכחת-חוצה-שפות · דוח-שנתי-לתורם (Dart) — מריצה את annual-report.dart על אותו
// fixture בדיוק כמו new/boxes/annual-report.test.mjs, ומוודאת פלט זהה-ביט (jsonEncode).
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה עם חישוב זהה.
// הערה: מגן-ההכרעה שבסוף בדיקת-ה-JS (readFileSync + regex על מקור-ה-mjs) הוא מקרה
// תלוי-JS-ריצה על טקסט-המקור — לא ניתן-נשיאה ל-Dart ⇒ מדולג במכוון (חוק-דילוג).
import 'dart:convert';
import 'annual-report.dart' as B;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  } else {
    n++;
  }
}

void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void main() {
  final donations = <Map<String, dynamic>>[
    {'date': '2026-03-01', 'amount': 180, 'rid': 'D-7'},
    {'date': '2026-01-15', 'amount': 100, 'cur': '\$'},
    {'date': '2025-12-31', 'amount': 999},
  ];
  final inp = <String, dynamic>{
    'orgName': 'מאור',
    'orgTaxId': '580123456',
    'supporterName': 'דוד לוי',
    'payerId': '012345678',
    'year': '2026',
    'site': 'maor.org',
    'donations': donations,
  };

  // ── years: יורד, רק YYYY תקין ──
  eq('years יורד', B.years(donations).join(','), '2026,2025');
  eq(
    'years מסנן תאריך-שבור/ריק/עברי',
    B.years(<Map<String, dynamic>>[
      {'date': ''},
      {'date': 'שבור'},
      {'date': '2024-01-01'},
    ]).join(','),
    '2024',
  );

  // ── ofYear: מיון-עולה, הדולרית ראשונה, 2025 מסוננת ──
  final rows = B.ofYear(donations, '2026');
  eq('ofYear אורך', rows.length, 2);
  eq('ofYear[0].date', rows[0]['date'], '2026-01-15');
  eq('ofYear[1].date', rows[1]['date'], '2026-03-01');

  // ── reportLines: החוזה (money+ofYear מחווטים) ──
  final l = B.reportLines(inp);
  eq('reportLines אורך', l.length, 20);
  eq('reportLines [9] דולר-padStart', l[9], '2026-01-15          \$100');
  eq('reportLines [10] שקל+קבלה', l[10], '2026-03-01          ₪180  קבלה D-7');
  eq('reportLines סה"כ ₪', l[13], 'סה"כ בשקלים: ₪180');
  eq('reportLines סה"כ \$', l[14], 'סה"כ בדולרים: \$100');
  ok(
    'reportLines §46',
    l.contains('לארגון אישור מוסד ציבורי לעניין תרומות לפי סעיף 46 לפקודת מס הכנסה.'),
  );

  // ── קצה: אפס-תרומות + בלי taxId ⇒ בלי §46 ──
  final empty = B.reportLines(<String, dynamic>{
    'orgName': 'מאור',
    'supporterName': 'ריק',
    'year': '2027',
    'donations': donations,
  });
  ok('reportLines אפס-תרומות', empty.contains('אין תרומות רשומות בשנת 2027.'));
  ok('reportLines §46 לא-דלף בלי taxId', !empty.any((x) => x.contains('סעיף 46')));

  // ── allLines: מקטע-יחיד בלי מפריד; אפס-מתאימים ──
  final one = B.allLines('מאור', null, '2026', <Map<String, dynamic>>[
    {
      'name': 'א',
      'donations': [
        {'date': '2026-05-01', 'amount': 50},
      ],
    },
  ]);
  ok('allLines בלי מפריד-עמוד על תורם-יחיד', !one.contains('\f'));
  final none = B.allLines('מאור', null, '2024', <Map<String, dynamic>>[
    {'name': 'א', 'donations': donations},
  ]);
  eq('allLines אפס-מתאימים', none.join(''), 'אין תורמים עם תרומות בשנת 2024.');

  // ── reportText: BOM + '\n' ──
  eq('reportText BOM/newline', B.reportText(['a', 'b']), '﻿a\nb');

  // ── downloadAnnualReport: שער-חסום ⇒ false בלי DOM ──
  var created = 0;
  final blockedIo = <String, dynamic>{
    'blocked': true,
    'notify': null,
    'createAnchor': () {
      created++;
      return <String, dynamic>{};
    },
    'makeBlobUrl': (String t, String type) => '',
    'revokeUrl': (String u) {},
    'schedule': (void Function() fn, int ms) {},
  };
  eq('download חסום ⇒ false', B.downloadAnnualReport({'filename': 'r.txt', 'lines': ['x']}, blockedIo), false);
  eq('download חסום לא-נגע ב-DOM', created, 0);

  // ── download מותר ⇒ true, download=filename, click פעם-אחת, schedule(fn,5000) ──
  var clicks = 0, sched = 0, schedMs = 0;
  final a = <String, dynamic>{'click': () => clicks++};
  final okIo = <String, dynamic>{
    'blocked': false,
    'notify': null,
    'createAnchor': () => a,
    'makeBlobUrl': (String t, String type) => 'blob:${t.length}',
    'revokeUrl': (String u) {},
    'schedule': (void Function() fn, int ms) {
      sched++;
      schedMs = ms;
    },
  };
  eq(
    'download מותר ⇒ true',
    B.downloadAnnualReport({'filename': 'r.txt', 'lines': ['שלום', 'עולם']}, okIo),
    true,
  );
  eq('download filename', a['download'], 'r.txt');
  ok('download href מ-makeBlobUrl', (a['href'] as String).startsWith('blob:'));
  eq('download click פעם-אחת', clicks, 1);
  eq('download schedule פעם-אחת', sched, 1);
  eq('download schedule ms', schedMs, 5000);

  if (fails > 0) {
    print('❌ קופסת-דוח-שנתי (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('annual-report dart proof failed');
  }
  print('✓ קופסת-דוח-שנתי (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
