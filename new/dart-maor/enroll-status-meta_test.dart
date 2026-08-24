// בדיקת-חוזה (רתמת-זהב) · enrollStatusMeta — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/enroll-status-meta.test.mjs
// (אותם קלטים→פלטים; הערכים הומרו ל-Dart). אם עובר ⇒ Dart≡JS.
//   1) {status:'paused'} ⇒ {label:'מוקפא',         bg:'#fdf1d4', c:'#9a6414'}
//   2) {status:'ended'}  ⇒ {label:'הסתיים',        bg:'#eceae2', c:'#8b8474'}
//   3) {status:'wait'}   ⇒ {label:'רשימת-המתנה ⏳', bg:'#e7edf5', c:'#3a5a86'}
//   4) {status:'active'} ⇒ {label:'פעיל',          bg:'#e4f5ea', c:'#12803c'}
//   5) {}  (בלי status)  ⇒ {label:'פעיל',          bg:'#e4f5ea', c:'#12803c'}
// הרצה: dart run --enable-asserts new/dart-maor/enroll-status-meta_test.dart  ⇒ exit 0
import 'enroll-status-meta.dart';

void _eq(Map<String, String> got, Map<String, String> want, String label) {
  final g = '${got['label']}|${got['bg']}|${got['c']}';
  final w = '${want['label']}|${want['bg']}|${want['c']}';
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =$g\n want=$w');
  }
}

void main() {
  var n = 0;

  // 1) מוקפא
  _eq(
    enrollStatusMeta({'status': 'paused'}),
    {'label': 'מוקפא', 'bg': '#fdf1d4', 'c': '#9a6414'},
    'מוקפא',
  );
  n++;

  // 2) הסתיים
  _eq(
    enrollStatusMeta({'status': 'ended'}),
    {'label': 'הסתיים', 'bg': '#eceae2', 'c': '#8b8474'},
    'הסתיים',
  );
  n++;

  // 3) רשימת-המתנה — תווית משלה (הבאג ההיסטורי: נפל ל"פעיל")
  _eq(
    enrollStatusMeta({'status': 'wait'}),
    {'label': 'רשימת-המתנה ⏳', 'bg': '#e7edf5', 'c': '#3a5a86'},
    'רשימת-המתנה',
  );
  n++;

  // 4) active מפורש ⇒ פעיל
  _eq(
    enrollStatusMeta({'status': 'active'}),
    {'label': 'פעיל', 'bg': '#e4f5ea', 'c': '#12803c'},
    'פעיל',
  );
  n++;

  // 5) חסר-סטטוס ⇒ ברירת-מחדל פעיל (מפתח-חסר ⇒ null ⇒ נופל לסוף, כמו undefined ב-JS)
  _eq(
    enrollStatusMeta({}),
    {'label': 'פעיל', 'bg': '#e4f5ea', 'c': '#12803c'},
    'חסר-סטטוס ⇒ פעיל',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    enrollStatusMeta({'status': 'wait'})['label'] == 'רשימת-המתנה ⏳',
    'assert-live guard',
  );

  print('OK enrollStatusMeta: $n asserts passed — 5 דוגמאות-חוזה ירוק');
}
