// 🧪 הוכחת-חוצה-שפות · קופסת telephony (Dart) — מריצה את telephony.dart על אותם
// קלטים בדיוק כמו new/boxes/telephony.test.mjs, ומוודאת פלט זהה-ביט (jsonEncode).
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה עם חישוב זהה.
// (מגני-החיווט guard-* של בדיקת-ה-JS נשענים על מחרוזת-מקור-ה-JS ⇒ מדולגים כאן —
//  תלויי-ריצת-JS בלבד, לא שקילות-פלט.)
import 'dart:convert';
import 'telephony.dart' as B;

const today = '2026-08-24';
int fails = 0;
void chk(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  }
}

// tc מלא (telephonyToTenant דורש officeDays/שעות/ext — כמו במקור); numbers מוזרק פר-בדיקה.
Map<String, dynamic> fullTc(List numbers) => <String, dynamic>{
      'numbers': numbers, 'officeDays': [0, 1, 2, 3, 4],
      'officeStart': '09:00', 'officeEnd': '17:00',
      'officeExt': '101', 'managerExt': '201', 'vmBox': '100', 'city': '',
      'kosherMode': false, 'hebrewCalendar': true, 'shabbat': true,
      'fasts': false, 'zmanim': false, 'voicemail': true,
    };

void main() {
  // ── דוגמה 1 · emptyTelephonyConfig ──
  final c = B.emptyTelephonyConfig();
  chk('empty.officeDays', c['officeDays'], [0, 1, 2, 3, 4]);
  chk('empty.officeStart', c['officeStart'], '09:00');
  chk('empty.numbers0.kind', (c['numbers'] as List)[0]['kind'], 'sim');
  chk('empty.hebrewCalendar', c['hebrewCalendar'], true);
  chk('empty.zmanim', c['zmanim'], false);

  // ── דוגמה 2 · toTenantId ──
  chk('tid.1', B.toTenantId('My Org!!', 'x'), 'my-org');
  chk('tid.2', B.toTenantId('default', 'חסד קהילה'), 'x--org');
  chk('tid.3', B.toTenantId('ab', ''), 'ab-org');

  // ── דוגמה 3 · telephonyToTenant ──
  final raw = B.telephonyToTenant(<String, dynamic>{
    'numbers': [
      {'id': 'n1', 'e164': ' +9721 ', 'kind': 'sim'},
      {'id': 'n2', 'e164': '', 'kind': 'virtual'},
    ],
    'officeDays': [4, 0, 2], 'officeStart': '08', 'officeEnd': '16',
    'officeExt': '1', 'managerExt': '2', 'vmBox': '3', 'city': '',
    'kosherMode': false, 'hebrewCalendar': true, 'shabbat': true,
    'fasts': false, 'zmanim': false, 'voicemail': true,
  }, '', 'ten');
  chk('t2t.numbers.len', (raw['numbers'] as List).length, 1); // n2 ריק-e164 סוננה
  chk('t2t.e164', raw['numbers'][0]['e164'], '+9721'); // trim
  chk('t2t.gw', raw['numbers'][0]['gatewayChannel'], 1);
  chk('t2t.default', raw['outbound']['defaultNumberId'], 'n1');
  chk('t2t.days', raw['officeHours']['days'], [0, 2, 4]);
  chk('t2t.orgName', raw['orgName'], 'ארגון'); // orgName ריק ⇒ 'ארגון'
  chk('t2t.no-city', raw.containsKey('city'), false); // city ריק ⇒ מושמט

  // ── דוגמה 4 · previewTelephony · ולידציה-נכשלת ⇒ יציאה-מוקדמת ──
  {
    var buildCalls = 0;
    final io = <String, dynamic>{
      'anchorToday': () => '2026-08-24',
      'validateTenant': (dynamic _) =>
          <String, dynamic>{'ok': false, 'errors': ['e'], 'warnings': ['w']},
      'buildTenant': (dynamic _, Map<String, dynamic> __) {
        buildCalls++;
        return <String, dynamic>{'ok': true};
      },
      'explainCall': (dynamic _, Map<String, dynamic> __, Map<String, dynamic> ___) =>
          <String, dynamic>{'summary': '', 'outcome': ''},
      'trustReport': (dynamic _) =>
          <String, dynamic>{'grade': 'A', 'score': 0, 'ready': true, 'failing': []},
    };
    final r = B.previewTelephony(
        fullTc([{'id': 'n1', 'e164': '+9721', 'kind': 'sim'}]), 'org', 'ten', io);
    chk('pff.result', r, {
      'ok': false, 'errors': ['e'], 'warnings': ['w'],
      'rows': [], 'trust': null, 'files': null,
    });
    chk('pff.buildCalls', buildCalls, 0); // buildTenant לא נקרא
  }

  // ── דוגמה 5 · previewTelephony · ולידציה-עוברת ⇒ 3 תרחישים + opts קבוע ──
  {
    final seen = <Map<String, dynamic>>[];
    final io = <String, dynamic>{
      'anchorToday': () => '2026-08-24',
      'validateTenant': (dynamic raw) => <String, dynamic>{
            'ok': true, 'errors': [], 'warnings': [], 'tenant': raw,
          },
      'buildTenant': (dynamic _, Map<String, dynamic> __) => <String, dynamic>{
            'ok': true, 'warnings': ['bw'], 'files': {'a.conf': 'x'},
          },
      'explainCall': (dynamic _, Map<String, dynamic> call, Map<String, dynamic> opts) {
        seen.add(<String, dynamic>{'call': call, 'opts': opts});
        return <String, dynamic>{'summary': 's', 'outcome': 'o'};
      },
      'trustReport': (dynamic _) => <String, dynamic>{
            'grade': 'B', 'score': 80, 'ready': true,
            'failing': [
              {'label': 'l', 'detail': 'd', 'severity': 'warn', 'extra': 'זולג'}
            ],
          },
    };
    final r = B.previewTelephony(
        fullTc([{'id': 'n1', 'e164': '+972501111111', 'kind': 'sim'}]), 'org', 'ten', io);
    chk('pp.ok', r['ok'], true);
    chk('pp.rows.len', (r['rows'] as List).length, 3);
    chk('pp.seen.len', seen.length, 3);
    // opts קבוע + callerId/did זהים בכל התרחישים
    chk('pp.opts', [
      for (final s in seen)
        [s['opts']['anchorDate'], s['opts']['calendarWindow'], s['call']['callerId'], s['call']['did']]
    ], [
      for (var i = 0; i < 3; i++) ['2026-08-24', 400, '050-1234567', '+972501111111']
    ]);
    chk('pp.dows', [for (final s in seen) [s['call']['dow'], s['call']['hhmm']]],
        [[2, '10:00'], [2, '20:00'], [6, '11:00']]);
    // trust ממופה ל-4 שדות בלבד (extra מסונן)
    chk('pp.trust', r['trust'], {
      'grade': 'B', 'score': 80, 'ready': true,
      'failing': [{'label': 'l', 'detail': 'd', 'severity': 'warn'}],
    });
    chk('pp.warnings', r['warnings'], ['bw']);
    chk('pp.files', r['files'], {'a.conf': 'x'});
  }

  // ── בחירת-DID: sim גובר על המספר-הראשון ──
  {
    final seenDids = <dynamic>[];
    final io = <String, dynamic>{
      'anchorToday': () => '2026-08-24',
      'validateTenant': (dynamic raw) => <String, dynamic>{
            'ok': true, 'errors': [], 'warnings': [], 'tenant': raw,
          },
      'buildTenant': (dynamic _, Map<String, dynamic> __) =>
          <String, dynamic>{'ok': false, 'warnings': []},
      'explainCall': (dynamic _, Map<String, dynamic> call, Map<String, dynamic> __) {
        seenDids.add(call['did']);
        return <String, dynamic>{'summary': '', 'outcome': ''};
      },
      'trustReport': (dynamic _) =>
          <String, dynamic>{'grade': 'F', 'score': 0, 'ready': false, 'failing': []},
    };
    final r = B.previewTelephony(
        fullTc([
          {'id': 'n0', 'e164': '+97221111111', 'kind': 'landline'},
          {'id': 'n1', 'e164': '+972501111111', 'kind': 'sim'},
        ]),
        'org', 'ten', io);
    chk('pdsw.ok', r['ok'], true);
    chk('pdsw.trust', r['trust'], null); // built.ok=false ⇒ trust=null
    chk('pdsw.dids', seenDids.every((d) => d == '+972501111111'), true);
  }

  // ── דוגמה 6 · nextClosure · בלי telephony ⇒ null, השקע לא נקרא ──
  {
    var calls = 0;
    final io = <String, dynamic>{
      'hebrewClosedWindows':
          (String _, int __, Map<String, dynamic> ___, Map<String, dynamic> ____) {
        calls++;
        return [];
      },
      'CITIES': <String, dynamic>{},
    };
    chk('cnt.null', B.nextClosure(<String, dynamic>{}, '2026-08-24', io), null);
    chk('cnt.calls', calls, 0);
  }

  // ── דוגמה 7 · nextClosure · מיפוי + עיר ──
  {
    List<dynamic>? seenArgs;
    final io = <String, dynamic>{
      'hebrewClosedWindows':
          (String from, int days, Map<String, dynamic> tenant, Map<String, dynamic> opt) {
        seenArgs = [from, days, tenant, opt];
        return [
          <String, dynamic>{
            'reason': 'שבת', 'kind': 'shabbat', 'startIso': 'a', 'startTime': '18:42',
            'endIso': 'b', 'endTime': '19:53', 'days': 1,
          }
        ];
      },
      'CITIES': <String, dynamic>{
        'telaviv': {'he': 'תל אביב'},
        'jerusalem': {'he': 'ירושלים'},
      },
    };
    final r = B.nextClosure(
        <String, dynamic>{'telephony': {'city': 'telaviv'}}, '2026-08-24', io);
    chk('cm.result', r, {
      'reason': 'שבת', 'kind': 'shabbat', 'startIso': 'a', 'candle': '18:42',
      'endIso': 'b', 'tzeis': '19:53', 'cityHe': 'תל אביב',
    });
    chk('cm.args', seenArgs,
        ['2026-08-24', 10, {'city': 'telaviv', 'timezone': 'Asia/Jerusalem'}, {}]);
  }

  // ── nextClosure · עיר לא-מוכרת/חסרה ⇒ נפילת-ירושלים ; חלון ריק ⇒ null ──
  {
    final win = [
      <String, dynamic>{
        'reason': 'r', 'kind': 'k', 'startIso': 's', 'startTime': 't1',
        'endIso': 'e', 'endTime': 't2', 'days': 1,
      }
    ];
    final CITIES = <String, dynamic>{'jerusalem': {'he': 'ירושלים'}};
    final ioWin = <String, dynamic>{
      'hebrewClosedWindows':
          (String _, int __, Map<String, dynamic> ___, Map<String, dynamic> ____) => win,
      'CITIES': CITIES,
    };
    final rNone =
        B.nextClosure(<String, dynamic>{'telephony': {}}, '2026-08-24', ioWin);
    chk('cf.none', rNone!['cityHe'], 'ירושלים');
    final rBad = B.nextClosure(
        <String, dynamic>{'telephony': {'city': 'nowhere'}}, '2026-08-24', ioWin);
    chk('cf.bad', rBad!['cityHe'], 'ירושלים');
    final ioEmpty = <String, dynamic>{
      'hebrewClosedWindows':
          (String _, int __, Map<String, dynamic> ___, Map<String, dynamic> ____) => [],
      'CITIES': CITIES,
    };
    chk('cf.empty',
        B.nextClosure(<String, dynamic>{'telephony': {'city': 'telaviv'}}, '2026-08-24', ioEmpty),
        null);
  }

  // ── דוגמה 8 · explainOne · ולידציה-נכשלת ⇒ סיכום-שגיאה ──
  {
    final io = <String, dynamic>{
      'anchorToday': () => '2026-08-24',
      'validateTenant': (dynamic _) =>
          <String, dynamic>{'ok': false, 'errors': ['אין DID']},
      'explainCall': (dynamic _, dynamic __, dynamic ___) {
        throw StateError('לא-אמור-להיקרא');
      },
    };
    final r = B.explainOne(
        fullTc([]), 'org', 'ten', {'dow': 2, 'hhmm': '10:00'}, io);
    chk('ef.result', r,
        {'summary': '⚠️ תצורה לא-תקינה: אין DID', 'outcome': 'invalid', 'reason': ''});
  }

  // ── explainOne · ולידציה-עוברת ⇒ explainCall עם opts קבוע ──
  {
    Map<String, dynamic>? seenOpts;
    final io = <String, dynamic>{
      'anchorToday': () => '2026-08-24',
      'validateTenant': (dynamic raw) =>
          <String, dynamic>{'ok': true, 'errors': [], 'tenant': raw},
      'explainCall': (dynamic tenant, dynamic call, dynamic opts) {
        seenOpts = opts as Map<String, dynamic>;
        return <String, dynamic>{'summary': 's', 'outcome': 'o', 'reason': 'r'};
      },
    };
    final r = B.explainOne(
        fullTc([{'id': 'n1', 'e164': '+9721', 'kind': 'sim'}]),
        'org', 'ten', {'dow': 3, 'hhmm': '09:00'}, io);
    chk('ep.result', r, {'summary': 's', 'outcome': 'o', 'reason': 'r'});
    chk('ep.opts', seenOpts, {'anchorDate': '2026-08-24', 'calendarWindow': 400});
  }

  if (fails > 0) {
    print('❌ קופסת-טלפוניה (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('telephony dart proof failed');
  }
  print('✓ קופסת-טלפוניה (Dart): 38 בדיקות — פלט זהה-ביט ל-JS · '
      '6 חוטים · preview/explain fail-fast + 3-תרחישים + opts-קבוע · '
      'closure-מיפוי+נפילת-ירושלים · שתי המערכות על אותה קופסה');
}
