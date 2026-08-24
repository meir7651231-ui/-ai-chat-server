# חוזה · קופסת-חיבורים "גלריית-תמונות"
**מקור-האמת:** `maor/src/lib/photoGallery.ts` (עוגני-שורה למטה).
עזרי-הטוהר של גלריית-תמונות-התורם (data:URI מקומי, מגודר `supporters.photos`),
מחווטים כאן כמקום-אחד לפי גרף-הקריאות של המקור.

**חשיפה:**
- `PHOTO_MAX` = 5 · `PHOTO_MAX_DIM` = 800 · `PHOTO_MAX_LEN` = 460000 (מקור: 8·10·12).
- `canAddPhoto(current)` ⇒ boolean — מחווט לתקרת-הכמות (מקור: 15-17).
- `isDataImage(s)` ⇒ boolean — פורמט png/jpe?g/webp/gif בלבד, **בלי svg** (מקור: 20-22).
- `fitDimensions(w, h, max = PHOTO_MAX_DIM)` ⇒ `{ w, h }` — שימור-יחס, בלי הגדלה (מקור: 28-32).
- `sanitizePhotos(raw)` ⇒ `string[]` — שער-חיטוי לפני התמדה (מקור: 38-41).

**שקע-IO (לא בקופסה):** הקטנת-הבייטים עצמה (canvas/DOM) חיה בקומפוננטה — הקופסה
מספקת רק את החישוב הטהור `fitDimensions`. אין localStorage/fetch/ענן במודול-המקור.

**הכרעות-הקופסה (חיות בחיווט, לא באטומים):**
- תקרות מוזרקות מהאטומים (PHOTO_MAX/PHOTO_MAX_LEN) ל-canAddPhoto·sanitizePhotos.
- ברירת-`max` של `fitDimensions` = `PHOTO_MAX_DIM` (במקור הצלע מוזנת מהקומפוננטה=800).

**דוגמאות מחייבות (מספריות, מ-קריאת-המקור):**
- `canAddPhoto(['a','b'])` ⇒ true · `canAddPhoto(['a','b','c','d','e'])` ⇒ false ·
  `canAddPhoto(undefined)` ⇒ true (0<5).
- `isDataImage('data:image/png;base64,AAA')` ⇒ true ·
  `isDataImage('data:image/svg+xml;base64,AAA')` ⇒ false (svg חסום) ·
  `isDataImage('data:image/jpeg;base64,x')` ⇒ true (jpe?g) ·
  `isDataImage(null)` ⇒ false · `isDataImage(123)` ⇒ false.
- `fitDimensions(1600, 800)` ⇒ `{ w:800, h:400 }` (max ברירת-מחדל 800) ·
  `fitDimensions(400, 200, 800)` ⇒ `{ w:400, h:200 }` (לא מגדיל) ·
  `fitDimensions(0, 100, 800)` ⇒ `{ w:0, h:0 }` · `fitDimensions(3, 1, 2)` ⇒ `{ w:2, h:1 }`
  (Math.max(1,round)).
- `sanitizePhotos('not-array')` ⇒ `[]` · `sanitizePhotos([1,'x',null])` ⇒ `[]`
  (שום data-image) · תמונה חוקית שאורכה > 460000 ⇒ מסוננת ·
  ‏7 תמונות-data חוקיות ⇒ 5 (חיתוך ל-PHOTO_MAX).

**מגן-הכרעה:** הבדיקה קוראת את מקור-הקופסה ומאשרת verbatim שהתקרות מוזרקות ל-canAddPhoto
ול-sanitizePhotos ושברירת-`fitDimensions` היא `PHOTO_MAX_DIM`.
