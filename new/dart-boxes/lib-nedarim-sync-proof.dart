// 🧪 הוכחת-חוצה-שפות · lib-nedarim-sync (Dart) — מריצה את lib-nedarim-sync.dart על
// אותם קלטים/WANT כמו new/boxes/lib-nedarim-sync.test.mjs. ירוק ⇒ מאור(JS)
// ובנייה-חכמה(Dart) על אותה קופסה: פלט זהה-ביט (jsonEncode).
//
// מדולג (חוק: מגני-מקור-JS/מקרה תלוי-JS): מגן-ההכרעה של ה-mjs קורא את קוד-המקור
// (readFileSync + regex verbatim על ה-JS, סדר-NAME_TITLES, איסור-ייבוא-קופסה) —
// זו בדיקה על טקסט-ה-JS, לא על התנהגות; אינה ניתנת/רלוונטית לתאום-ה-Dart ⇒ דולגה.
import 'dart:convert';
import 'lib-nedarim-sync.dart' as NED;

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

void main() {
  // דוגמה 1 · תווית-סליקה
  eq('providerClearer sola', NED.providerClearer('sola'), 'סולה');
  eq('providerClearer ריק', NED.providerClearer(''), 'נדרים');
  eq('providerClearer null', NED.providerClearer(null), 'נדרים');
  eq('CLEARING_PROVIDERS', NED.clearingProviders, ['נדרים', 'סולה']);

  // דוגמה 2 · מפתח-דדופ
  eq('chargeDedupKey txn', NED.chargeDedupKey({'txnId': 'T1'}), 'txn:T1');
  eq('chargeDedupKey ref', NED.chargeDedupKey({'reference': 'R1'}), 'ref:R1');
  eq('chargeDedupKey ריק', NED.chargeDedupKey(<String, dynamic>{}), '');

  // דוגמה 3 · chargeToHist (מטבע קידוד-נדרים '2'⇒$, ספק-סולה)
  eq(
    'chargeToHist',
    NED.chargeToHist({
      'amount': 50,
      'currency': '2',
      'd': '2026-03-05',
      'txnId': 'T7',
      'provider': 'sola',
    }),
    {'d': '2026-03-05', 'a': 50, 'c': r'$', 'clearer': 'סולה', 'txn': 'T7'},
  );

  // דוגמה 4 · planNedarimSync — יצירה + חיוב
  {
    final p = NED.planNedarimSync([], [
      {'toremId': '55', 'name': 'רחל בן צבי'}
    ], [
      {'amount': 100, 'toremId': '55', 'txnId': 'X1', 'd': '2026-01-10', 'id': 'c1'}
    ]);
    final s = p['summary'] as Map;
    final sups = p['supporters'] as List;
    eq('create newSupporters', s['newSupporters'], 1);
    eq('create chargesAdded', s['chargesAdded'], 1);
    eq('create ilsAdded', s['ilsAdded'], 100);
    eq('create id', (sups[0] as Map)['id'], 'sup-ned-55');
    eq('create hist[0].a', ((sups[0] as Map)['hist'] as List)[0]['a'], 100);
    eq('create handledChargeIds', p['handledChargeIds'], ['c1']);
  }

  // דוגמה 5 · שם חסין-סדר — התאמה לכרטיס קיים בסדר-מילים הפוך (לא כפול)
  {
    final existing = <Map<String, dynamic>>[
      {
        'id': 's1', 'name': 'רחל בן צבי', 'phone': '', 'email': '', 'idNum': '',
        'extId': '', 'city': '', 'count': 0, 'ils': 0, 'usd': 0, 'donations': <dynamic>[]
      }
    ];
    final p = NED.planNedarimSync(existing, [
      {'toremId': '77', 'name': 'בן צבי רחל'}
    ], []);
    final s = p['summary'] as Map;
    final sups = p['supporters'] as List;
    eq('nameOrder newSupporters', s['newSupporters'], 0);
    eq('nameOrder updatedSupporters', s['updatedSupporters'], 1);
    eq('nameOrder length', sups.length, 1);
    eq('nameOrder extId', (sups[0] as Map)['extId'], '77'); // extId מולא-אם-ריק
  }

  // דוגמה 6 · פאזה-מודעת-כסף — ביטול + זיכוי
  {
    final existing = <Map<String, dynamic>>[
      {
        'id': 's1', 'name': 'משה כהן', 'phone': '0501112233', 'email': '', 'idNum': '',
        'extId': '', 'city': '', 'count': 0, 'ils': 0, 'usd': 0, 'donations': <dynamic>[],
        'hist': <dynamic>[]
      }
    ];
    final p = NED.planNedarimSync(existing, [], [
      {'amount': 0, 'phone': '0501112233', 'txnId': 'Z0', 'id': 'z'}, // ביטול
      {'amount': -30, 'phone': '0501112233', 'txnId': 'Z1', 'd': '2026-02-02', 'id': 'r'} // זיכוי
    ]);
    final s = p['summary'] as Map;
    final sups = p['supporters'] as List;
    eq('money chargesNonPositive', s['chargesNonPositive'], 1);
    eq('money refundsApplied', s['refundsApplied'], 1);
    eq('money ilsAdded', s['ilsAdded'], -30);
    eq('money hist.length', ((sups[0] as Map)['hist'] as List).length, 1); // רק הזיכוי
  }

  // דוגמה 7 · דדופ-גלובלי C2 באצווה
  {
    final sups = <Map<String, dynamic>>[
      {'id': 'a', 'name': 'א', 'hist': <dynamic>[]},
      {'id': 'b', 'name': 'ב', 'hist': <dynamic>[]},
    ];
    final charge = <String, dynamic>{'amount': 40, 'txnId': 'DUP'};
    final r = NED.attachChargesBulk(sups, [
      {'supId': 'a', 'charge': charge},
      {'supId': 'b', 'charge': charge},
    ]);
    eq('attachChargesBulk C2 added', r['added'], 1); // אותו txn לא נרשם פעמיים
  }

  // קצה · attachOnly — שם-בלבד נשאר pending
  {
    final existing = <Map<String, dynamic>>[
      {
        'id': 's1', 'name': 'שרה לוי', 'phone': '', 'email': '', 'idNum': '',
        'extId': '', 'city': '', 'count': 0, 'ils': 0, 'usd': 0, 'donations': <dynamic>[],
        'hist': <dynamic>[]
      }
    ];
    final full = NED.planNedarimSync(existing, [], [
      {'amount': 20, 'name': 'שרה לוי', 'txnId': 'N1'}
    ]);
    eq('attachOnly full chargesAdded', (full['summary'] as Map)['chargesAdded'], 1);
    final only = NED.planNedarimSync(existing, [], [
      {'amount': 20, 'name': 'שרה לוי', 'txnId': 'N2'}
    ], {'attachOnly': true});
    eq('attachOnly chargesSkipped', (only['summary'] as Map)['chargesSkipped'], 1);
    eq('attachOnly chargesAdded', (only['summary'] as Map)['chargesAdded'], 0);
  }

  // קצה · detectRecurringHok — kevaId ⇒ ודאי; היום מוזרק (אין Date.now)
  {
    final sups = <Map<String, dynamic>>[
      {
        'id': 's1', 'name': 'דוד',
        'hist': [
          {'d': '2026-06-01', 'a': 100, 'c': '₪', 'clearer': 'נדרים', 'kevaId': 'K9'}
        ]
      }
    ];
    final r = NED.detectRecurringHok(sups, '2026-07-01');
    final hok = ((r['supporters'] as List)[0] as Map)['hok'] as Map;
    eq('detectRecurringHok detected', r['detected'], 1);
    eq('detectRecurringHok active', hok['active'], true);
    eq('detectRecurringHok kevaId', hok['kevaId'], 'K9');
  }

  // קצה · עברי/null/ריק — לא קורס
  {
    final empty = NED.planNedarimSync([], [], []);
    eq('edge supporters', (empty['supporters'] as List).length, 0);
    eq('edge chargesIn', (empty['summary'] as Map)['chargesIn'], 0);
    eq('edge strongMatch שם-בלבד', NED.strongMatchForCharge({'name': 'רק שם'}, []), null);
    eq('edge autoMatch ריק', NED.autoMatchCharges([], []), <dynamic>[]);
  }

  if (fails > 0) {
    print('❌ קופסת-lib-nedarim-sync (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('lib-nedarim-sync dart proof failed');
  }
  print('✓ קופסת-lib-nedarim-sync (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
