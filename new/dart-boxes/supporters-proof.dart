// 🧪 הוכחת-חוצה-שפות · תומכים (Dart) — מריצה את supporters.dart על אותם קלטים/WANT
// כמו new/boxes/supporters.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה.
// מגני-המקור (fs-regex) של בדיקת-ה-JS מדולגים — הם JS-ספציפיים (חוק: מקרה תלוי-JS).
import 'dart:convert';
import 'supporters.dart' as B;

const String FIXED = '2026-08-24';
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

// אגרגט-מספרי: JS deepStrictEqual = שוויון-מספרי (337.0 == 337). Dart num-equality מקביל.
void num_(String name, Object? got, num want) {
  if (got is num && got == want) {
    n++;
  } else {
    print('✗ $name: got $got want $want');
    fails++;
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
  final sp = <String, dynamic>{
    'id': 's1', 'name': 'כהן משה', 'phone': '0501234567', 'email': '', 'idNum': '',
    'address': '', 'cat': '', 'forWho': '', 'count': 2, 'ils': 100, 'usd': 10,
    'first': '2024-01-01', 'last': '2026-08-01', 'nextDate': '',
    'donations': [
      {'date': '2026-08-01', 'amount': 50, 'cur': '₪', 'rid': 'R-1', 'purpose': ''},
      {'date': '2026-07-01', 'amount': 50, 'cur': '₪', 'rid': 'R-2'},
    ],
    'hist': [{'d': '2026-06-01', 'a': 200, 'c': '₪', 'clearer': 'נדרים'}],
  };

  // ── אגרגטים (כולל היסטוריה, הכרעת 9.8) ──
  num_('supIls', B.supIls(sp), 300);
  num_('supUsd', B.supUsd(sp), 10);
  num_('supCount', B.supCount(sp), 3);
  eq('supLast', B.supLast(sp), '2026-08-01');
  num_('supTotalIls', B.supTotalIls(sp), 337); // 300 + 10*3.7
  eq('totalLabel', B.totalLabel(sp), '₪300 + \$10');
  eq('totalLabel-empty', B.totalLabel({'ils': 0, 'usd': 0}), '—');

  // ── פורמט ──
  eq('fmtDate', B.fmtDate('2026-08-01'), '01/08/2026');
  eq('fmtDate-broken', B.fmtDate(''), '—');
  eq('normName', B.normName('בן דוד'), 'בנדוד');
  eq('fixPhone', B.fixPhone('0501234567'), '050-1234567');

  // ── דרגות ──
  eq('supTier-gold', B.supTier(850), {'label': 'זהב', 'bg': '#fdf3dd', 'c': '#9a6414', 'dot': '#f3c76b'});
  eq('supTier-dormant', B.supTier(100)['label'], 'רדומה');
  eq('TIER_ORDER', B.tierOrder, ['זהב', 'כסף', 'ארד', 'רדומה']);
  eq('SUP_NAME_KEYS', B.supNameKeys, ['שם', 'תורם']);
  eq('HOK_CAT', B.hokCat, 'הו"ק');

  // ── אירועי-תרומה ──
  eq('supDonEvents', B.supDonEvents(sp).map((e) => e['src']).toList(),
      ['קבלה R-1', 'קבלה R-2', 'תרומה · נדרים']);

  // ── ראוּת פר-ייעוד (הכשל שהאטום-הקבוצתי לא ידע לבד — נפתר בחיווט-הקופסה) ──
  ok('vis-visible', B.supporterVisibleForDesignations({'forWho': 'עבודה'}, ['עבודה']) == true);
  ok('vis-hidden-noforwho', B.supporterVisibleForDesignations({'forWho': ''}, ['עבודה']) == false);
  ok('vis-all', B.supporterVisibleForDesignations({'forWho': ''}, null) == true);
  eq('visList', B.visibleSupportersForDesignations(
      [{'forWho': 'עבודה', 'donations': []}, {'forWho': 'אחר', 'donations': []}], ['עבודה'])
      .map((s) => s['forWho']).toList(), ['עבודה']);
  eq('allPurposes', B.allDonationPurposes([{'forWho': 'ב', 'donations': [{'purpose': 'א'}]}]), ['א', 'ב']);

  // ── ייבוא ──
  eq('excelSerial', B.excelSerialToIso(45900), '2025-08-31');
  eq('excelSerial-bad', B.excelSerialToIso(-1), '');
  eq('parseCsv', B.parseSupporterCsv('שם,טלפון\nלוי,0521111111')[0]['name'], 'לוי');
  final plan = B.planSupporterImport(
      [{'name': 'לוי', 'phone': '', 'email': '', 'idNum': '', 'address': '', 'cat': '', 'forWho': ''}],
      [{'id': 'x', 'name': 'לוי'}]);
  num_('planImport-update', (plan['updates'] as List).length, 1);
  num_('planImport-noinsert', (plan['inserts'] as List).length, 0);
  num_('mergeHist-idempotent',
      B.mergeHist([{'d': '2026-01-01', 'a': 10, 'c': '₪'}], [{'d': '2026-01-01', 'a': 10, 'c': '₪'}]).length, 1);
  eq('newFromRow', B.newSupporterFromRow('n1',
      {'name': 'x', 'phone': '0501234567', 'email': '', 'idNum': '', 'address': '', 'cat': '', 'forWho': ''})['phone'],
      '050-1234567');

  // ── תיק-מעקב (clockIso לא נקרא כי eyes='') ──
  var seq = 0;
  String clockNever() => throw StateError('clock must not fire on eyes=""');
  final withAyin = B.applyAyinNames(
      <String, dynamic>{'ayin': null}, ['אבי', 'אבי'], () => 'id${++seq}', clockNever);
  eq('applyAyin-dedup',
      ((withAyin['ayin'] as Map)['names'] as List).map((nm) => (nm as Map)['name']).toList(), ['אבי']);

  // ── הו"ק ──
  eq('hokMethodLabel', B.hokMethodLabel('bank'), 'הו"ק בנקאית');
  final hokSp = <String, dynamic>{
    'hok': {'active': true, 'amount': 100, 'cur': '₪', 'day': 5}, 'donations': [], 'hist': []
  };
  ok('hokActive', B.hokEffectivelyActive(hokSp, FIXED) == true);
  ok('hokRecorded-no', B.hokRecordedThisMonth(hokSp, FIXED) == false);
  num_('hokDue', B.hokDue([hokSp], FIXED).length, 1);
  num_('hokMonthlyTotal', B.hokMonthlyTotal([hokSp], 3.7, FIXED), 100);

  // ── שקע-שעון (isoToday מוזרק, לא ממומש) ──
  eq('isoToday-injected', B.isoToday(() => FIXED), FIXED);

  if (fails > 0) {
    print('❌ קופסת-התומכים (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('supporters dart proof failed');
  }
  print('✓ קופסת-התומכים (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
