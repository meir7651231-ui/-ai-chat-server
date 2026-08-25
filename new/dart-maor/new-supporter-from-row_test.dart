// בדיקת-חוזה (רתמת-זהב) · newSupporterFromRow — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/new-supporter-from-row.test.mjs
// (אותם קלטים→פלטים; שקעי-הבדיקה: fixPhone מוסיף '0' בראש; mergeHist=שרשור):
//   1) שורה בסיסית ⇒ חיתוך, שקע-טלפון, איפוסים, בלי מפתח hist.
//   2) hist=[{d:'2026-01-01',ils:100}] ⇒ hist === mergeHist([], hist).
//   3) hist=[] ⇒ אין מפתח hist (ריק ≠ קיים).
//   4) כל שדות-הטקסט רווחים-בלבד ⇒ מחרוזות ריקות; המונים מאופסים.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/new-supporter-from-row_test.dart  ⇒ exit 0
import 'new-supporter-from-row.dart';

// שקעי-הבדיקה — מקבילים למקור-ה-JS:
//   const fixPhone = (s) => (s ? '0' + s : s);   // truthy מחרוזת ⇒ '0'+s, אחרת s ('' ⇒ '')
//   const mergeHist = (a, b) => [...a, ...b];
String _fixPhone(String s) => s.isNotEmpty ? '0' + s : s;
List _mergeHist(List a, List b) => [...a, ...b];

// row(over) — מקביל למפעל-השורה של המקור.
Map<String, dynamic> _row([Map<String, dynamic> over = const {}]) => {
      'name': ' דוד לוי ',
      'phone': ' 501234567 ',
      'email': 'a@b.c',
      'idNum': '12345',
      'address': 'חיפה',
      'cat': 'ידיד',
      'forWho': 'ישיבה',
      ...over,
    };

void main() {
  var n = 0;

  // 1) שורה בסיסית — חיתוך, שקע-טלפון, איפוסים, בלי hist.
  {
    final out = newSupporterFromRow('s1', _row(), _fixPhone, _mergeHist);
    assert(out['id'] == 's1', 'דוגמה 1: id');
    assert(out['name'] == 'דוד לוי', 'דוגמה 1: name=${out['name']}');
    assert(out['phone'] == '0501234567', 'דוגמה 1: phone=${out['phone']}');
    assert(out['email'] == 'a@b.c', 'דוגמה 1: email');
    assert(out['idNum'] == '12345', 'דוגמה 1: idNum');
    assert(out['address'] == 'חיפה', 'דוגמה 1: address');
    assert(out['cat'] == 'ידיד', 'דוגמה 1: cat');
    assert(out['forWho'] == 'ישיבה', 'דוגמה 1: forWho');
    assert(out['notes'] == '' && out['count'] == 0 && out['ils'] == 0 && out['usd'] == 0,
        'דוגמה 1: איפוסים-מונים');
    assert(out['first'] == '' && out['last'] == '' && out['nextDate'] == '',
        'דוגמה 1: איפוסי-תאריך');
    assert(out['donations'] is List && (out['donations'] as List).isEmpty,
        'דוגמה 1: donations=[]');
    assert(!out.containsKey('hist'), 'דוגמה 1: מפתח hist קיים בלי row.hist');
    n++;
  }

  // 2) hist קיים ⇒ דרך mergeHist על בסיס ריק.
  {
    final h = [
      {'d': '2026-01-01', 'ils': 100}
    ];
    final out = newSupporterFromRow('s2', _row({'hist': h}), _fixPhone, _mergeHist);
    final hist = out['hist'] as List;
    assert(hist.length == 1, 'דוגמה 2: אורך hist=${hist.length}');
    final e = hist[0] as Map;
    assert(e['d'] == '2026-01-01' && e['ils'] == 100, 'דוגמה 2: hist=$hist');
    n++;
  }

  // 3) hist ריק ⇒ אין מפתח כלל (ריק ≠ קיים).
  {
    final out = newSupporterFromRow('s3', _row({'hist': []}), _fixPhone, _mergeHist);
    assert(!out.containsKey('hist'), 'דוגמה 3: hist=[] יצר מפתח');
    n++;
  }

  // 4) רווחים-בלבד ⇒ מחרוזות ריקות; המונים מאופסים.
  {
    final out = newSupporterFromRow(
      's4',
      _row({
        'name': '  ',
        'phone': '  ',
        'email': ' ',
        'idNum': ' ',
        'address': ' ',
        'cat': ' ',
        'forWho': ' ',
      }),
      _fixPhone,
      _mergeHist,
    );
    assert(out['name'] == '', 'דוגמה 4: name ריק');
    assert(out['phone'] == _fixPhone(''), 'דוגמה 4: phone=fixPhone("")');
    assert(out['email'] == '' && out['idNum'] == '' && out['address'] == '' &&
        out['cat'] == '' && out['forWho'] == '', 'דוגמה 4: שדות ריקים');
    assert(out['count'] == 0, 'דוגמה 4: count מאופס');
    n++;
  }

  print('✓ new-supporter-from-row: $n דוגמאות-חוזה — Dart≡JS ירוק');
}
