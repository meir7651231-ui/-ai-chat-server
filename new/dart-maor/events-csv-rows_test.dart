// רתמת-זהב · events-csv-rows — דוגמאות-החוזה בדיוק כמו בדיקת-ה-JS (Dart≡JS).
import 'dart:convert';
import 'events-csv-rows.dart';

// מימושי-שקע לבדיקה — נאמנים למקור:
dynamic termOf(dynamic c, String k, String fb) {
  if (c == null) return fb;
  final terms = c['terms'];
  if (terms == null) return fb;
  final v = terms[k];
  return _falsyT(v) ? fb : v;
}

bool _falsyT(dynamic v) {
  if (v == null) return true;
  if (v is bool) return !v;
  if (v is num) return v == 0 || v.isNaN;
  if (v is String) return v.isEmpty;
  return false;
}

String hebDateFull(dynamic iso) => 'ע($iso)';

final evMeta = {
  'call': {'label': 'טלפון'},
  'org': {'label': 'אירוע'},
  'custom': {'label': 'אירוע'},
};

final db = {
  'events': [
    {'title': 'ברית', 'type': 'custom', 'customType': 'ברית מילה', 'date': '2026-09-01', 'time': '19:00', 'famId': 'f1', 'priority': 'red', 'done': false},
    {'title': 'שיחה', 'type': 'call', 'date': '2026-08-20', 'priority': 'green', 'done': true},
  ],
  'families': [{'id': 'f1', 'name': 'כהן'}],
};

int f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    f = 1;
  }
}

void eq(dynamic a, dynamic b, String msg) {
  ok(jsonEncode(a) == jsonEncode(b), '$msg: ${jsonEncode(a)}');
}

void main() {
  final R = eventsCsvRows(db, null, termOf, hebDateFull, evMeta);
  ok(R.length == 3, 'אורך ${R.length} ≠ 3');
  eq(R[0], ['כותרת', 'סוג אירוע', 'תאריך עברי', 'תאריך לועזי', 'שעה', 'משפחה', 'עדיפות', 'הערות', 'בוצע'], 'כותרת');
  eq(R[1], ['שיחה', 'טלפון', 'ע(2026-08-20)', '20/08/2026', '', '', 'רגיל (ירוק)', '', 'כן'], 'שורה-1 (מיון הפך סדר)');
  eq(R[2], ['ברית', 'ברית מילה', 'ע(2026-09-01)', '01/09/2026', '19:00', 'כהן', 'דחוף (אדום)', '', 'לא'], 'שורה-2');

  // עם config — המונח מהשקע:
  final R2 = eventsCsvRows(db, {'terms': {'entity.family': 'בית-אב'}}, termOf, hebDateFull, evMeta);
  ok(R2[0][5] == 'בית-אב', 'כותרת-משפחה עם config: ${R2[0][5]}');

  // בלי-תאריך + עדיפות לא-מוכרת:
  final R3 = eventsCsvRows({'events': [{'title': 'x', 'type': 'org', 'priority': 'x', 'date': '', 'done': false}], 'families': []}, null, termOf, hebDateFull, evMeta);
  eq(R3[1], ['x', 'אירוע', '', '', '', '', 'x', '', 'לא'], 'אירוע ריק-תאריך');

  if (f != 0) {
    print('FAIL');
    throw StateError('rows mismatch');
  }
  print('✓ events-csv-rows: כל דוגמאות-החוזה — ירוק');
}
