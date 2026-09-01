import '../dart-data-maor/org-cal-entries-sockets.dart' as sk_org_cal_entries;
import 'org-cal-entries.dart';

// רתמת-זהב: אותם קלטים→פלטים של new/atoms/org-cal-entries.test.mjs. Dart≡JS.

// מימוש-שקע לבדיקה: אירוע-תרומה אחד ל-s1 בלבד, [] לכל השאר.
List<Map<String, dynamic>> supDonEvents(Map<String, dynamic> sp) =>
    sp['id'] == 's1'
        ? [
            {'date': '2026-01-05', 'amount': 100, 'cur': '₪', 'src': 'תרומה'}
          ]
        : [];

bool mapEq(Map<String, dynamic> a, Map<String, dynamic> b) {
  if (a.length != b.length) return false;
  for (final k in a.keys) {
    if (!b.containsKey(k)) return false;
    if (a[k] != b[k]) return false;
  }
  return true;
}

void main() {
  // תומכת עם אירוע-תרומה בלבד — name+spId מוצמדים
  final sp1 = {'id': 's1', 'name': 'רות'};
  final r1 = orgCalEntries([sp1], supDonEvents, sk_org_cal_entries.orgCalEntries_T);
  assert(r1.length == 1 &&
      mapEq(r1[0], {
        'date': '2026-01-05',
        'amount': 100,
        'cur': '₪',
        'src': 'תרומה',
        'name': 'רות',
        'spId': 's1'
      }));

  // תומכת עם ayin מלא — 3 שורות בסדר: 🧿, 📞, 🔁
  final sp2 = {
    'id': 's2',
    'name': 'דנה',
    'ayin': {
      'log': [
        {'date': '2026-02-01', 'eyes': 'ה.כ', 'name': 'רות'}
      ],
      'answers': [
        {'date': '2026-03-01', 'note': 'יחזור'}
      ],
      'nextTalk': '2026-04-01',
    },
  };
  final r2 = orgCalEntries([sp2], supDonEvents, sk_org_cal_entries.orgCalEntries_T);
  assert(r2.length == 3);
  assert(r2[0]['src'] == '🧿 ה.כ — רות' && r2[0]['date'] == '2026-02-01');
  assert(r2[1]['src'] == '📞 תשובה: יחזור' && r2[1]['date'] == '2026-03-01');
  assert(r2[2]['src'] == '🔁 לדבר שוב' && r2[2]['date'] == '2026-04-01');
  assert(r2.every((e) =>
      e['amount'] == 0 &&
      e['cur'] == '' &&
      e['name'] == 'דנה' &&
      e['spId'] == 's2'));

  // רישום-עיניים בלי name — בלי מקף
  final sp3 = {
    'id': 's3',
    'name': 'לאה',
    'ayin': {
      'log': [
        {'date': '2026-02-02', 'eyes': 'ב.ל'}
      ]
    }
  };
  final r3 = orgCalEntries([sp3], supDonEvents, sk_org_cal_entries.orgCalEntries_T);
  assert(r3.length == 1 && r3[0]['src'] == '🧿 ב.ל');

  // רישום עם date ריק — מסונן
  final sp4 = {
    'id': 's4',
    'name': 'שרה',
    'ayin': {
      'log': [
        {'date': '', 'eyes': 'ג.ד'}
      ]
    }
  };
  assert(orgCalEntries([sp4], supDonEvents, sk_org_cal_entries.orgCalEntries_T).isEmpty);

  // ריקים
  assert(orgCalEntries([], supDonEvents, sk_org_cal_entries.orgCalEntries_T).isEmpty);
  assert(orgCalEntries([
        {'id': 's5', 'name': 'חנה'}
      ], supDonEvents, sk_org_cal_entries.orgCalEntries_T).isEmpty);

  print('✓ org-cal-entries: 10 דוגמאות-חוזה — ירוק');
}
