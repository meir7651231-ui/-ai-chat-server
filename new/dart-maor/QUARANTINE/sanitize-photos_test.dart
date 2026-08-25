// בדיקת-חוזה (רתמת-זהב) · sanitizePhotos — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת ביט-אחר-ביט את new/atoms/sanitize-photos.test.mjs + שש דוגמאות-החוזה
// (sanitize-photos.contract.md). השוואת-מערכים = אורך + איבר-איבר (כלל-8 —
// לעולם לא join). כשל ⇒ StateError. אם עובר ⇒ Dart≡JS.
// הערת-המרה: ל-Dart אין undefined — מקרה-ה-undefined של ה-JS מיוצג כ-null
// (שני המסלולים נופלים באותו שער `Array.isArray(raw)` ⇒ []).
// הרצה: dart run --enable-asserts new/dart-maor/sanitize-photos_test.dart ⇒ exit 0
import 'sanitize-photos.dart';

// שקע-אימות מזויף לבדיקה: תחילית 'img:' (כמו במבחן-ה-JS).
bool _isImg(dynamic x) => x is String && x.startsWith('img:');

// כלל-8: השוואת-מערך = אורך + איבר-איבר; כשל ⇒ StateError.
void _eqList(List<dynamic> got, List<dynamic> want, String msg) {
  if (got.length != want.length) {
    throw StateError('FAIL: $msg — אורך ${got.length} ≠ ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError("FAIL: $msg — [$i] '${got[i]}' ≠ '${want[i]}'");
    }
  }
}

void main() {
  var n = 0;

  // 1) לא-מערך ⇒ [] (null · מחרוזת · מפה · null-כ-undefined).
  _eqList(sanitizePhotos(null, _isImg), [], 'null ≠ []');
  n++;
  _eqList(sanitizePhotos('img:a', _isImg), [], 'מחרוזת ≠ []');
  n++;
  _eqList(sanitizePhotos(<String, dynamic>{}, _isImg), [], 'אובייקט ≠ []');
  n++;
  dynamic undef; // undefined של ה-JS ⇒ null ב-Dart
  _eqList(sanitizePhotos(undef, _isImg), [], 'undefined ≠ []');
  n++;

  // 2) פסולי-שקע נזרקים, הסדר נשמר.
  _eqList(sanitizePhotos(['img:a', 'bad', 'img:b'], _isImg),
      ['img:a', 'img:b'], 'סינון-שקע/סדר');
  n++;

  // 3) תקרת-משקל מוזרקת: photoMaxLen=6 ⇒ אורך 5 עובר, אורך 7 נזרק.
  _eqList(sanitizePhotos(['img:a', 'img:abc'], _isImg, 6), ['img:a'],
      'photoMaxLen=6');
  n++;

  // 4) גבול-סגור: אורך == photoMaxLen עובר (<=).
  _eqList(sanitizePhotos(['img:ab'], _isImg, 6), ['img:ab'],
      'אורך=תקרה חייב לעבור');
  n++;

  // 5) תקרת-כמות: 7 תקינים ⇒ בדיוק 5 הראשונים, בסדרם.
  final seven = ['img:1', 'img:2', 'img:3', 'img:4', 'img:5', 'img:6', 'img:7'];
  _eqList(sanitizePhotos(seven, _isImg), seven.sublist(0, 5), '7 ⇒ 5 הראשונים');
  n++;

  // 6) ברירות-המחדל = ערכי-המוצא (460000 / 5).
  final big = 'img:${'x' * 459997}'; // אורך 460001 ⇒ נזרק
  final fit = 'img:${'x' * 459996}'; // אורך 460000 ⇒ עובר
  _eqList(sanitizePhotos([big, 'img:a'], _isImg), ['img:a'],
      '460001 לא נזרק בברירת-מחדל');
  n++;
  if (sanitizePhotos([fit], _isImg).length != 1) {
    throw StateError('FAIL: 460000 בדיוק חייב לעבור');
  }
  n++;

  print('OK sanitizePhotos: $n בדיקות-חוזה (שקעי isDataImage/תקרות) — ירוק');
}
