import '../dart-data-maor/needs-care-tzedaka-terms.dart' as td_needs_care_tzedaka;
// 🏅 רתמת-זהב · needsCare — הרצה בפועל של דוגמאות-החוזה מ-needs-care-tzedaka.test.mjs.
// אותם קלטים→פלטים בדיוק כמו בדיקת-ה-JS. ירוק (exit 0 עם --enable-asserts) ⇒ Dart ≡ JS.
// הרצה: dart run --enable-asserts new/dart-maor/needs-care-tzedaka_test.dart

import 'needs-care-tzedaka.dart';

const String TODAY = '2026-08-24';

// שקע-פורמט דטרמיניסטי — תאום ל-isoOf של בדיקת-ה-JS (getFullYear/getMonth+1/getDate).
String isoOf(DateTime d) {
  String p(int n) => n.toString().padLeft(2, '0');
  return '${d.year}-${p(d.month)}-${p(d.day)}';
}

final Map<String, dynamic> base = {
  'termOf': (cfg, key, fb) => fb,
  'staleBoxes': (a, b) => [],
  'lastCollectionIso': (b) => '',
  'coordinatorBoxes': (boxes, cid) =>
      boxes.where((b) => b['coordId'] == cid).toList(),
  'isoOf': isoOf,
};

final Map<String, dynamic> emptyDb = {
  'tzBoxes': [],
  'tzCoordinators': [],
  'tzCampaigns': [],
};

void main() {
  // 1) קופה מוזנחת עם ריקון-אחרון
  {
    final b = {'id': 'b1', 'num': 3};
    final db = {...emptyDb, 'tzBoxes': [b]};
    final out = needsCare(db, TODAY, null, {
      ...base,
      'staleBoxes': (a, x) => [b],
      'lastCollectionIso': (x) => '2026-01-01',
    }, term: (k)=>td_needs_care_tzedaka.kTerms[k]!);
    assert(
        out.length == 1 &&
            out[0]['kind'] == 'stale' &&
            out[0]['id'] == 'b1' &&
            out[0]['label'] == 'קופה 3 לא רוקנה מזמן' &&
            out[0]['hint'] == 'ריקון אחרון: 2026-01-01',
        'דוגמה 1 (stale): ' + out.toString());
  }

  // 2) מעולם-לא-רוקנה — עם since ובלי
  {
    final b = {'id': 'b2', 'num': 5, 'since': '2025-05-01'};
    final out = needsCare({...emptyDb, 'tzBoxes': [b]}, TODAY, null,
        {...base, 'staleBoxes': (a, x) => [b]}, term: (k)=>td_needs_care_tzedaka.kTerms[k]!);
    assert(out[0]['hint'] == 'מעולם לא רוקנה (מאז 2025-05-01)',
        'דוגמה 2א: ' + out[0]['hint']);
    final b2 = {'id': 'b3', 'num': 6};
    final out2 = needsCare({...emptyDb, 'tzBoxes': [b2]}, TODAY, null,
        {...base, 'staleBoxes': (a, x) => [b2]}, term: (k)=>td_needs_care_tzedaka.kTerms[k]!);
    assert(out2[0]['hint'] == 'מעולם לא רוקנה (מאז —)',
        'דוגמה 2ב: ' + out2[0]['hint']);
  }

  // 3) קופה אבודה
  {
    final db = {
      ...emptyDb,
      'tzBoxes': [{'id': 'b7', 'num': 7, 'status': 'lost'}]
    };
    final out = needsCare(db, TODAY, null, base, term: (k)=>td_needs_care_tzedaka.kTerms[k]!);
    assert(
        out.length == 1 &&
            out[0]['kind'] == 'lost' &&
            out[0]['label'] == 'קופה 7 מסומנת כאבודה' &&
            out[0]['hint'] == 'לברר או להוציא משימוש',
        'דוגמה 3 (lost): ' + out.toString());
  }

  // 4) רכז לא-פעיל עם 2 קופות-בבתים; עם 0 ⇒ כלום
  {
    final db = {
      ...emptyDb,
      'tzBoxes': [
        {'id': 'x1', 'num': 1, 'coordId': 'c1', 'status': 'home'},
        {'id': 'x2', 'num': 2, 'coordId': 'c1', 'status': 'home'},
        {'id': 'x3', 'num': 3, 'coordId': 'c1', 'status': 'office'},
      ],
      'tzCoordinators': [{'id': 'c1', 'name': 'ראובן', 'active': false}],
    };
    final out = needsCare(db, TODAY, null, base, term: (k)=>td_needs_care_tzedaka.kTerms[k]!);
    assert(
        out.length == 1 &&
            out[0]['kind'] == 'inactiveCoord' &&
            out[0]['id'] == 'c1' &&
            out[0]['label'] == 'ראובן אינו פעיל אך עדיין עם 2 קופות בבתים' &&
            out[0]['hint'] == 'להעביר לרכז אחר או להחזיר למשרד',
        'דוגמה 4א (inactiveCoord): ' + out.toString());
    final dbNone = {...db, 'tzBoxes': []};
    assert(needsCare(dbNone, TODAY, null, base, term: (k)=>td_needs_care_tzedaka.kTerms[k]!).isEmpty,
        'דוגמה 4ב: רכז בלי קופות-בבתים פלט התרעה');
  }

  // 5) מבצע מסתיים בתוך 14 יום; מעבר-לחלון או לא-פעיל ⇒ כלום
  {
    Map<String, dynamic> mk(String end, [bool active = true]) => {
          ...emptyDb,
          'tzCampaigns': [
            {'id': 'p1', 'name': 'אלול', 'active': active, 'end': end}
          ]
        };
    final out = needsCare(mk('2026-09-01'), TODAY, null, base, term: (k)=>td_needs_care_tzedaka.kTerms[k]!);
    assert(
        out.length == 1 &&
            out[0]['kind'] == 'campaignEnding' &&
            out[0]['label'] == 'המבצע "אלול" מסתיים ב-2026-09-01' &&
            out[0]['hint'] == 'לסכם ולסגור',
        'דוגמה 5א (campaignEnding): ' + out.toString());
    assert(needsCare(mk('2026-09-20'), TODAY, null, base, term: (k)=>td_needs_care_tzedaka.kTerms[k]!).isEmpty,
        'דוגמה 5ב: מעבר-לחלון נפלט');
    assert(needsCare(mk('2026-09-01', false), TODAY, null, base, term: (k)=>td_needs_care_tzedaka.kTerms[k]!).isEmpty,
        'דוגמה 5ג: לא-פעיל נפלט');
  }

  // 6) המונח מוזרם דרך termOf כשיש config
  {
    final b = {'id': 'b1', 'num': 3};
    final out = needsCare({...emptyDb, 'tzBoxes': [b]}, TODAY, {'terms': {}}, {
      ...base,
      'staleBoxes': (a, x) => [b],
      'termOf': (cfg, key, fb) => 'קופסה',
    }, term: (k)=>td_needs_care_tzedaka.kTerms[k]!);
    assert(out[0]['label'] == 'קופסה 3 לא רוקנה מזמן',
        'דוגמה 6 (termOf): ' + out[0]['label']);
  }

  print('✓ needs-care-tzedaka (Dart): 6 דוגמאות-חוזה — ירוק');
}
