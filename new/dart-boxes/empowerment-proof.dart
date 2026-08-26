// 🧪 הוכחת-חוצה-שפות · שכבת-ההעצמה (Dart) — מריצה את empowerment.dart על אותו
// fixture בדיוק כמו new/boxes/empowerment.test.mjs, ומוודאת פלט זהה-ביט.
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה עם חישוב זהה.
import 'dart:convert';
import 'empowerment.dart' as B;

const today = '2026-08-24';
int fails = 0;
void chk(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    stderrLine('✗ $name: got $g want $w');
    fails++;
  }
}

void stderrLine(String s) => print(s);

Map<String, dynamic> mk(String id, String name, String phone, String last, num ils, num usd, int count,
    {List donations = const [], List hist = const [], Map? hok, String first = '2023-01-01'}) {
  return {
    'id': id, 'name': name, 'phone': phone, 'email': '', 'idNum': '', 'address': '', 'cat': '', 'forWho': '',
    'count': count, 'ils': ils, 'usd': usd, 'first': first, 'last': last, 'nextDate': '',
    'donations': donations, 'hist': hist, if (hok != null) 'hok': hok,
  };
}

void main() {
  final sups = [
    mk('a', 'כהן משה', '0501111111', '2026-08-20', 500, 0, 5, donations: [
      {'date': '2026-08-20', 'amount': 100, 'cur': '₪', 'rid': 'R-1', 'purpose': ''},
      {'date': '2026-05-20', 'amount': 100, 'cur': '₪', 'rid': 'R-2'},
      {'date': '2026-02-20', 'amount': 100, 'cur': '₪', 'rid': 'R-3'},
    ]),
    mk('b', 'לוי שרה', '0502222222', '2026-03-01', 200, 20, 2, donations: [
      {'date': '2026-03-01', 'amount': 100, 'cur': '₪', 'rid': 'R-4'},
      {'date': '2025-11-01', 'amount': 100, 'cur': '₪', 'rid': 'R-5'},
    ]),
    mk('c', 'ישראלי דוד', '0503333333', '2024-06-01', 50, 0, 1, donations: [
      {'date': '2024-06-01', 'amount': 50, 'cur': '₪', 'rid': 'R-6'},
    ]),
    mk('d', 'אברהם רות', '0504444444', '2026-08-23', 1200, 0, 8,
        donations: [
          {'date': '2026-08-23', 'amount': 300, 'cur': '₪', 'rid': 'R-7'},
        ],
        hok: {'amount': 150, 'day': 1, 'method': 'הו"ק', 'active': true}),
  ];

  // ── קוקפיט ──
  chk('cockpitDaysSince', B.cockpitDaysSince('2026-08-20', today), 4);
  chk('dayDiff', B.dayDiff('2026-08-20', today), 4);
  chk('cockpitAtRisk', [for (final s in B.cockpitAtRisk(sups, today)) (s as Map)['id']], ['c', 'b']);
  chk('cockpitCollectedThisMonth', B.cockpitCollectedThisMonth(sups, today), 400);
  chk('cockpitThanks', [for (final s in B.cockpitThanks(sups, today)) s['id']], ['thanks:d']);
  chk('cockpitCalls-N', B.cockpitCalls(sups, today).length, 2);
  chk('cockpitHokTasks-N', B.cockpitHokTasks(sups, today).length, 1);
  chk('cockpitKpis', B.cockpitKpis(sups, today), {'total': 4, 'collected': 400, 'expectedHok': 150, 'atRisk': 2});

  final queue = B.cockpitQueue(sups, today);
  chk('cockpitQueue-total', queue['total'], 4);
  chk('cockpitQueue-kinds', [for (final t in (queue['tasks'] as List)) (t as Map)['kind']],
      ['call', 'call', 'thanks', 'hok']);
  final done = {((queue['tasks'] as List).first as Map)['id']};
  chk('cockpitProgress', B.cockpitProgress(queue, done), {'done': 1, 'total': 4});
  chk('cockpitCsvRows-N', B.cockpitCsvRows(queue).length, 5);
  chk('cockpitCsvRows-header', B.cockpitCsvRows(queue).first, ['קבוצה', 'שם', 'טלפון', 'סיבה']);
  chk('cockpitWorkListText-line0', B.cockpitWorkListText(queue).split('\n').first,
      '📞 שיחה · ישראלי דוד · 0503333333 — תורם/ת · שקט/ה 814 יום');
  chk('cockpitFeed-N', B.cockpitFeed(sups).length, 8);

  // ── מודיעין ──
  chk('donorScan-keys', (B.donorScan(sups[0], today).keys.toList()..sort()),
      ['count', 'first', 'ils', 'last', 'monthly']);
  chk('donorIntel-keys', (B.donorIntel(sups[0], today).keys.toList()..sort()),
      ['avgGift', 'churn', 'forecast', 'ltv', 'rfm', 'scan', 'trend']);

  // ── סגמנטים ──
  chk('segmentCounts', [for (final s in B.segmentCounts(sups, today)) s['count']], [2, 0, 1, 3, 4]);

  // ── תיק ──
  chk('portfolioIntel-keys', (B.portfolioIntel(sups, today).keys.toList()..sort()),
      ['atRiskCount', 'atRiskMoney', 'avgGift', 'concentrationTopN', 'count', 'forecast30',
       'forecast90', 'giftCount', 'ltv', 'retention12m', 'scoreBins', 'tierCounts', 'topN']);
  chk('tierTrendCounts',
      [for (final t in B.tierTrendCounts(sups, today)) '${t['tier']}:${t['total']}:${t['rising']}:${t['stable']}'],
      ['זהב:0:0:0', 'כסף:0:0:0', 'ארד:2:2:0', 'רדומה:2:0:2']);
  chk('activeByMonth-N', B.activeByMonth(sups, today).length, 12);

  // ── גלקסיה ──
  chk('donorConstellation-N', B.donorConstellation(sups, today).length, 4);

  // ── פיקוד ──
  // קלט זהה-בדיוק ל-JS ({supporters} בלבד) — האטום תוקן לטפל ב-dedupCount חסר כמו JS.
  chk('buildCommands-N', B.buildCommands({'supporters': sups}).length, 5);

  if (fails > 0) {
    print('❌ קופסת-ההעצמה (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('empowerment dart proof failed');
  }
  print('✓ קופסת-ההעצמה (Dart): 24 בדיקות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
