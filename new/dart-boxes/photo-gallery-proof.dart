// 🧪 הוכחת-חוצה-שפות · photo-gallery (גלריית-תמונות) — אותם קלטים/WANT כמו
// new/boxes/photo-gallery.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה:
// תקרות · canAddPhoto · isDataImage · fitDimensions · sanitizePhotos זהי-ביט.
// הערה: 3 "מגני-החיווט" של בדיקת-ה-JS קוראים את מקור-ה-mjs עצמו (readFileSync+regex) —
//   אלה תלויי-מקור-JS ולא התנהגות חוצה-שפות, ולכן מדולגים כאן (חוק המקרה-תלוי-ריצה-JS).
import 'dart:convert';
import 'photo-gallery.dart' as P;

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

void main() {
  // ── תקרות ──
  eq('PHOTO_MAX', P.PHOTO_MAX, 5);
  eq('PHOTO_MAX_DIM', P.PHOTO_MAX_DIM, 800);
  eq('PHOTO_MAX_LEN', P.PHOTO_MAX_LEN, 460000);

  // ── canAddPhoto ──
  eq('canAddPhoto מתחת-לתקרה', P.canAddPhoto(['a', 'b']), true);
  eq('canAddPhoto בתקרה', P.canAddPhoto(['a', 'b', 'c', 'd', 'e']), false);
  eq('canAddPhoto undefined→null', P.canAddPhoto(null), true);
  eq('canAddPhoto ריק', P.canAddPhoto([]), true);

  // ── isDataImage ──
  eq('png', P.isDataImage('data:image/png;base64,AAA'), true);
  eq('jpeg', P.isDataImage('data:image/jpeg;base64,x'), true);
  eq('jpg (jpe?g)', P.isDataImage('data:image/jpg;base64,x'), true);
  eq('webp', P.isDataImage('data:image/webp;base64,x'), true);
  eq('gif', P.isDataImage('data:image/gif;base64,x'), true);
  eq('svg חסום — XSS', P.isDataImage('data:image/svg+xml;base64,AAA'), false);
  eq('http לא-data', P.isDataImage('http://x/a.png'), false);
  eq('null', P.isDataImage(null), false);
  eq('מספר', P.isDataImage(123), false);
  eq('undefined→null', P.isDataImage(null), false);

  // ── fitDimensions ──
  eq('הקטנה ברירת-800', P.fitDimensions(1600, 800), {'w': 800, 'h': 400});
  eq('לא-מגדיל', P.fitDimensions(400, 200, 800), {'w': 400, 'h': 200});
  eq('רוחב-0 ⇒ 0,0', P.fitDimensions(0, 100, 800), {'w': 0, 'h': 0});
  eq('שלילי ⇒ 0,0', P.fitDimensions(-5, 100, 800), {'w': 0, 'h': 0});
  eq('רצפת Math.max(1,round)', P.fitDimensions(3, 1, 2), {'w': 2, 'h': 1});
  eq('קטנה נשמרת', P.fitDimensions(1, 1, 800), {'w': 1, 'h': 1});

  // ── sanitizePhotos ──
  const ok = 'data:image/png;base64,AAA';
  eq('לא-מחרוזת (not-array)', P.sanitizePhotos('not-array'), []);
  eq('null ⇒ []', P.sanitizePhotos(null), []);
  eq('פריטים לא-תקינים ⇒ []', P.sanitizePhotos([1, 'x', null]), []);
  eq('סינון bad באמצע', P.sanitizePhotos([ok, 'bad', ok]), [ok, ok]);
  final heavy = 'data:image/png;base64,' + 'A' * P.PHOTO_MAX_LEN; // > 460000 סה"כ
  eq('מסוננת במשקל', P.sanitizePhotos([heavy]), []);
  final seven = List.generate(7, (_) => ok);
  eq('חיתוך ל-5', P.sanitizePhotos(seven).length, P.PHOTO_MAX);
  eq('עברית/קלט-שבור לא מפיל',
      P.sanitizePhotos(['תמונה', {'x': 1}, null]), []);

  if (fails > 0) {
    print('❌ קופסת גלריית-תמונות (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('photo-gallery dart proof failed');
  }
  print('✓ קופסת גלריית-תמונות (Dart): $n דוגמאות-חוזה '
      '(תקרות · canAddPhoto · isDataImage · fitDimensions · sanitizePhotos) — '
      'פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
