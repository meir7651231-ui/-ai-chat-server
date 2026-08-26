// 🧪 הוכחת-חוצה-שפות · donation-partition (Dart) — מריצה את donation-partition.dart על אותם
// קלטים/WANT כמו new/boxes/donation-partition.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart)
// על אותה קופסה: אותם קלטים ⇒ פלט זהה-ביט. מגני-ההכרעה של בדיקת-ה-JS (readFileSync על
// מקור-הקופסה + regex-imports) הם תלויי-ריצת-JS ⇒ מדולגים כאן (חוק: מקרה תלוי-JS ⇒ דלג).
import 'dart:convert';
import 'donation-partition.dart' as D;

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
  // 0) המפתח-המשותף
  eq('SHARED_PURPOSE_KEY', D.SHARED_PURPOSE_KEY, '_shared_');

  // 1) purposeKeyOf — trim · ריק ⇒ משותף · null ⇒ משותף · רווחים ⇒ משותף
  eq('purposeKeyOf trim', D.purposeKeyOf({'purpose': ' חינוך '}), 'חינוך');
  eq('purposeKeyOf ריק', D.purposeKeyOf({}), '_shared_');
  eq('purposeKeyOf רווחים', D.purposeKeyOf({'purpose': '   '}), '_shared_');
  eq('purposeKeyOf null', D.purposeKeyOf({'purpose': null}), '_shared_');

  // 2) donAllowedKeys — dedup + trim + סינון-ריק + המשותף בסוף; חיתוך ל-29
  eq('donAllowedKeys בסיס', D.donAllowedKeys(['a', 'a', '', ' b ']), ['a', 'b', '_shared_']);
  final big = D.donAllowedKeys([for (var i = 0; i < 40; i++) 'k$i']);
  ok('donAllowedKeys חיתוך-29+משותף', big.length == 30 && big[29] == '_shared_' && big[28] == 'k28');
  eq('donAllowedKeys ריק ⇒ רק המשותף', D.donAllowedKeys([]), ['_shared_']);

  // 3) explodeSupporter — id=rid, pkey מ-purpose; אין donations ⇒ []
  eq('explodeSupporter בסיס',
      D.explodeSupporter({
        'id': 's1',
        'donations': [
          {'rid': 'D-1', 'purpose': 'חינוך', 'date': '2024-01-01', 'amount': 100}
        ]
      }),
      [
        {
          'id': 'D-1',
          'supporterId': 's1',
          'pkey': 'חינוך',
          'donation': {'rid': 'D-1', 'purpose': 'חינוך', 'date': '2024-01-01', 'amount': 100}
        }
      ]);
  eq('explodeSupporter ללא donations', D.explodeSupporter({'id': 's2'}), []);
  // תרומה ללא-purpose ⇒ pkey משותף (החיווט: purposeKeyOf מזין)
  ok('explode ללא-ייעוד ⇒ משותף',
      D.explodeSupporter({
        'id': 's3',
        'donations': [
          {'rid': 'D-9'}
        ]
      })[0]['pkey'] ==
          '_shared_');

  // 4) reassembleDonations — סינון-supporterId + מיון תאריך-ואז-rid + hist נשמר
  eq(
      'reassembleDonations סינון+מיון+hist',
      D.reassembleDonations({
        'id': 's1',
        'name': 'כהן',
        'hist': [
          {'d': 'x'}
        ]
      }, [
        {
          'supporterId': 's1',
          'donation': {'rid': 'D-2', 'date': '2024-02-01'}
        },
        {
          'supporterId': 's1',
          'donation': {'rid': 'D-1', 'date': '2024-01-01'}
        },
        {
          'supporterId': 'sX',
          'donation': {'rid': 'D-9', 'date': '2024-03-01'}
        },
      ]),
      {
        'id': 's1',
        'name': 'כהן',
        'hist': [
          {'d': 'x'}
        ],
        'donations': [
          {'rid': 'D-1', 'date': '2024-01-01'},
          {'rid': 'D-2', 'date': '2024-02-01'},
        ],
      });
  // tie-break: אותו תאריך ⇒ מיון לפי rid
  final tie = D.reassembleDonations({'id': 's1'}, [
    {
      'supporterId': 's1',
      'donation': {'rid': 'D-2', 'date': '2024-01-01'}
    },
    {
      'supporterId': 's1',
      'donation': {'rid': 'D-1', 'date': '2024-01-01'}
    },
  ]);
  ok('reassemble tie-break rid',
      (tie['donations'] as List)[0]['rid'] == 'D-1' && (tie['donations'] as List)[1]['rid'] == 'D-2');

  // 5) donationPartitionDiff — set על שינוי/חדש, delete על הסרה
  final diff = D.donationPartitionDiff([
    {
      'id': 's1',
      'donations': [
        {'rid': 'D-1', 'purpose': 'a', 'amount': 100},
        {'rid': 'D-3', 'purpose': 'b'}
      ]
    }
  ], [
    {
      'id': 's1',
      'donations': [
        {'rid': 'D-1', 'purpose': 'a', 'amount': 200},
        {'rid': 'D-2', 'purpose': 'c'}
      ]
    }
  ]);
  eq('diff deletes', diff['deletes'], ['D-3']);
  final sets = diff['sets'] as List;
  ok(
      'diff sets (שינוי+חדש)',
      sets.length == 2 &&
          sets.any((d) => d['id'] == 'D-1' && d['donation']['amount'] == 200) &&
          sets.any((d) => d['id'] == 'D-2'));
  // ללא-שינוי ⇒ ריק (עדשה-עוינת: אותה רשימה בדיוק)
  final same = [
    {
      'id': 's1',
      'donations': [
        {'rid': 'D-1', 'purpose': 'a'}
      ]
    }
  ];
  eq('diff ללא-שינוי ⇒ ריק', D.donationPartitionDiff(same, same), {'sets': [], 'deletes': []});
  // תרומה שעברה תומך (supporterId שונה) ⇒ set (התוכן שונה)
  final moved = D.donationPartitionDiff([
    {
      'id': 's1',
      'donations': [
        {'rid': 'D-1', 'purpose': 'a'}
      ]
    }
  ], [
    {
      'id': 's2',
      'donations': [
        {'rid': 'D-1', 'purpose': 'a'}
      ]
    }
  ]);
  ok('diff מעבר-תומך ⇒ set',
      (moved['sets'] as List).length == 1 &&
          (moved['sets'] as List)[0]['supporterId'] == 's2' &&
          (moved['deletes'] as List).isEmpty);

  // 6) האינווריאנט-הקדוש: reassemble(sp, explode(sp)) ≡ sp (קבוצה+hist)
  final sp = <String, dynamic>{
    'id': 's7',
    'name': 'לוי',
    'hist': [
      {'d': '2024-01-01', 'a': 50}
    ],
    'donations': [
      {'rid': 'D-5', 'purpose': 'x', 'date': '2024-05-01'},
      {'rid': 'D-4', 'purpose': '', 'date': '2024-04-01'},
    ],
  };
  final round = D.reassembleDonations(sp, D.explodeSupporter(sp));
  final roundRids = (round['donations'] as List).map((d) => d['rid']).toSet();
  final spRids = (sp['donations'] as List).map((d) => d['rid']).toSet();
  eq('round-trip קבוצה', roundRids.toList()..sort(), spRids.toList()..sort());
  eq('round-trip hist לא-נגוע', round['hist'], sp['hist']);

  if (fails > 0) {
    print('❌ קופסת-donation-partition (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('donation-partition dart proof failed');
  }
  print('✓ קופסת-donation-partition (Dart): $n טענות — 6 דוגמאות-חוזה + round-trip · פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
