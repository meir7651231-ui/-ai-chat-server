// 🧪 הוכחת-חוצה-שפות · שורות-הייצוא (Dart) — אותם קלטים/WANT כמו new/boxes/export-rows.test.mjs.
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה: משפחות 13ע · תומכות 7ע · אירועים 9ע
// (מיון/עברי/termOf), פלט זהי-ביט.
// הערה: 3 "מגני-ההכרעה" של בדיקת-ה-JS (שורות 57-67) קוראים את מקור-ה-mjs עצמו
//   (readFileSync + regex על טקסט-הקובץ) — תלויי-מקור-JS ולא התנהגות חוצה-שפות,
//   ולכן מדולגים כאן (חוק המקרה-תלוי-ריצת-JS).
import 'dart:convert';
import 'export-rows.dart' as X;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

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
  // ── משפחות · 13 עמודות + דין-אלמן (exportRows.ts:33-44) ──
  {
    final rows = X.familiesImportFormatRows({
      'families': [
        {
          'name': 'כהן', 'fatherId': '1', 'phone': '050', 'mother': 'שרה',
          'motherId': '2', 'phone2': '02', 'city': 'צפת', 'address': 'רח 1',
          'maritalStatus': 'אלמן', 'community': 'חסידי', 'notes': 'הערה'
        },
        {'name': 'לוי', 'maritalStatus': 'אלמנה'},
        {'name': 'פרץ'},
      ]
    });
    eq('משפחות: כותרת', rows[0], [
      'שם', 'ת"ז אב', 'טלפון', 'שם האם', 'ת"ז אם', 'טלפון 2', 'עיר', 'כתובת',
      '', 'אלמן', 'קהילה', '', 'הערות'
    ]);
    ok('משפחות: אלמן ⇒ עמודה 9', rows[1][9] == 'אלמן');
    // ⚠️ המקור: includes('אלמן') בנו״ן-סופית — 'אלמנה' (נ-רגילה) לא נתפס (נשמר כלשונו)
    ok('משפחות: אלמנה ⇒ ריק', rows[2][9] == '');
    ok('משפחות: maritalStatus חסר ⇒ ריק', rows[3][9] == '');
    ok('משפחות: 4 שורות', rows.length == 4);
  }

  // ── תומכות · 7 עמודות (exportRows.ts:47-53) ──
  {
    final rows = X.supportersImportFormatRows({
      'supporters': [
        {
          'name': 'רוזן', 'phone': '054', 'email': 'a@b', 'idNum': '9',
          'address': 'תל חי', 'cat': 'קבע', 'forWho': 'עילוי'
        },
      ]
    });
    eq('תומכות: כותרת',
        rows[0], ['שם', 'טלפון', 'אימייל', 'ת"ז', 'כתובת', 'קטגוריה', 'עבור']);
    eq('תומכות: שורה', rows[1], ['רוזן', '054', 'a@b', '9', 'תל חי', 'קבע', 'עילוי']);
  }

  // ── אירועים · 9 עמודות, מיון, עברי/לועזי, עדיפות, termOf (exportRows.ts:56-76) ──
  final db = {
    'families': [
      {'id': 'f1', 'name': 'כהן'}
    ],
    'events': [
      {
        'title': 'ב', 'type': 'call', 'date': '2026-08-24', 'time': '10:00',
        'famId': 'f1', 'priority': 'red', 'notes': 'נ', 'done': true
      },
      {
        'title': 'א', 'type': 'custom', 'customType': 'ברית', 'date': '',
        'famId': 'zz', 'priority': 'x', 'done': false
      },
    ],
  };

  {
    final rows = X.eventsCsvRows(db);
    eq('אירועים: כותרת "משפחה"', rows[0], [
      'כותרת', 'סוג אירוע', 'תאריך עברי', 'תאריך לועזי', 'שעה', 'משפחה',
      'עדיפות', 'הערות', 'בוצע'
    ]);
    // מיון: date='' ראשון (localeCompare עולה)
    eq('אירועים: שורת-הריק ראשונה',
        rows[1], ['א', 'ברית', '', '', '', '', 'x', '', 'לא']);
    eq('אירועים: שורת-כהן', rows[2],
        ['ב', 'טלפון', 'י״א אלול תשפ״ו', '24/08/2026', '10:00', 'כהן', 'דחוף (אדום)', 'נ', 'כן']);
  }

  // ── termOf דורס את הכותרת ──
  ok('אירועים: termOf דורס',
      X.eventsCsvRows(db, {'terms': {'entity.family': 'בית אב'}})[0][5] == 'בית אב');
  // דריסת-רווחים = אין דריסה
  ok('אירועים: דריסת-רווחים ⇒ ברירת-מחדל',
      X.eventsCsvRows(db, {'terms': {'entity.family': '  '}})[0][5] == 'משפחה');

  // ── אדר תשפ״ו ──
  {
    final rows = X.eventsCsvRows({
      'families': [],
      'events': [
        {'title': 'פ', 'type': 'org', 'date': '2026-03-03', 'priority': 'green', 'done': false}
      ]
    });
    ok('אירועים: אדר תשפ״ו', rows[1][2] == 'י״ד אדר תשפ״ו');
    ok('אירועים: type=org ⇒ אירוע', rows[1][1] == 'אירוע');
    ok('אירועים: priority=green', rows[1][6] == 'רגיל (ירוק)');
  }

  if (fails > 0) {
    print('❌ קופסת שורות-הייצוא (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('export-rows dart proof failed');
  }
  print('✓ קופסת שורות-הייצוא (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
