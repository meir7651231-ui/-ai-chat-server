// 📦 קופסת-חיבורים · photo-gallery (גלריית-תמונות) — מחווטת 7 אטומי-Dart.
// מקבילה ל-new/boxes/photo-gallery.mjs. חוזה משותף: new/boxes/photo-gallery.contract.md.
// מקור-האמת: maor/src/lib/photoGallery.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// ⚠️ גבול-פלטפורמה (חוק-6): הקטנת-התמונה עצמה (canvas/DOM) היא שקע-IO של לוח-האם —
//   לא כאן; הקופסה טהורה. מה שמוכח כאן = תקרות · יחס-ממדים · אימות · חיטוי, זהי-ביט חוצה-שפות.
//
// דבקי-החיווט (הזרקת-התקרות לשקעים) = ידע-קופסה (חוק-5), לא אטומים. התקרות חיות כאן
// כתוכנית-חיווט; לנתק/לשנות תקרה = לגעת בקופסה בלבד, לא באטומים.
import '../dart-maor/photo-max.dart' as pmax;
import '../dart-maor/photo-max-dim.dart' as pmdim;
import '../dart-maor/photo-max-len.dart' as pmlen;
import '../dart-maor/can-add-photo.dart' as cap;
import '../dart-maor/is-data-image.dart' as idi;
import '../dart-maor/fit-dimensions.dart' as fd;
import '../dart-maor/sanitize-photos.dart' as sp;

// ── שקעי-הכרעה (מילון הקופסה — ערכי-המוצא מ-photoGallery.ts; re-export כמו ה-mjs) ──
const int PHOTO_MAX = pmax.photoMax; // ignore: constant_identifier_names
const int PHOTO_MAX_DIM = pmdim.photoMaxDim; // ignore: constant_identifier_names
const int PHOTO_MAX_LEN = pmlen.photoMaxLen; // ignore: constant_identifier_names

// ── החיווט ────────────────────────────────────────────────────────────────

/// האם ניתן להוסיף עוד תמונה (מתחת לתקרת-הכמות PHOTO_MAX).
/// גישור-טיפוס: JS `current` (מערך/undefined) → `List<Object?>?` של האטום.
bool canAddPhoto(dynamic current) =>
    cap.canAddPhoto(current as List<Object?>?, PHOTO_MAX);

/// מחרוזת היא תמונת-data תקינה (png/jpe?g/webp/gif; בלי svg). re-export של האטום.
bool isDataImage(dynamic s) => idi.isDataImage(s);

/// ממדי-יעד אחרי הקטנה — שימור-יחס, בלי הגדלה. הכרעת-הקופסה: הצלע-המרבית
/// ברירת-מחדל = PHOTO_MAX_DIM (המקור מזין 800 מהקומפוננטה).
/// הפלט `{w, h}` של JS ⇒ `Map<String, int>` (כמו fit-dimensions האטומי).
Map<String, int> fitDimensions(num w, num h, [num max = PHOTO_MAX_DIM]) =>
    fd.fitDimensions(w, h, max);

/// שער-חיטוי לפני התמדה — רק תמונות-data תקינות מתחת לתקרת-המשקל, עד תקרת-הכמות.
/// מחווט: isDataImage (בודק-פורמט) · PHOTO_MAX_LEN (תקרת-משקל) · PHOTO_MAX (תקרת-כמות).
List<dynamic> sanitizePhotos(dynamic raw) =>
    sp.sanitizePhotos(raw, idi.isDataImage, PHOTO_MAX_LEN, PHOTO_MAX);
