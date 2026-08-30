/** קופסת-חיבורים · בחירת-תמונה + כיווץ-thumbnail + הטמעת-קובץ.
 *  חוזה: image-pick.contract.md · מקור-אמת: maor/src/lib/imagePick.ts.
 *  מחווטת את חוטי המקור למקום-אחד; ההכרעות (MAX_PX/QUALITY/סדר/מילון-שגיאות)
 *  חיות כאן (חוק-5). שקעי-IO אמיתיים (FileReader/Image/canvas של הדפדפן) =
 *  פרמטרים-מוזרקים בזמן-הצבה, לא מימוש בקופסה (חוק-1/6). */
import { MAX_UPLOAD_BYTES } from '../atoms/max-upload-bytes.mjs';
import { MAX_EMBED_BYTES } from '../atoms/max-embed-bytes.mjs';
import { readFileAsDataUrl as __pure_readFileAsDataUrl } from '../atoms/read-file-as-data-url.mjs';
import { READ_FILE_AS_DATA_URL_T as __d_read_file_as_data_url_T } from '../atoms/read-file-as-data-url-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const readFileAsDataUrlAtom = (...a) => __pure_readFileAsDataUrl(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_read_file_as_data_url_T);
import { IMAGE_PICK_TERMS } from '../atoms/image-pick-terms.mjs';

// ── הכרעות-הקופסה (חיות כאן, לא בחוטים) ──
// למה כיווץ: הנתונים local-first ב-localStorage (~5MB למסמך) — thumbnail ~15-30KB
// נוסע עם הסנכרון/גיבוי בלי לפוצץ את התקרה (imagePick.ts:1-10).
const MAX_PX = 320;   // צלע-ארוכה מרבית ל-thumbnail (imagePick.ts:11)
const QUALITY = 0.72; // איכות-JPEG (imagePick.ts:12)
const ERR_NOT_IMAGE = IMAGE_PICK_TERMS.k1;                 // imagePick.ts:16
const ERR_TOO_BIG = IMAGE_PICK_TERMS.k2;      // imagePick.ts:17
const ERR_NO_CANVAS = IMAGE_PICK_TERMS.k3;       // imagePick.ts:27

export { MAX_UPLOAD_BYTES, MAX_EMBED_BYTES };

// ── חיווט pickAndCompressImage ──
// הסדר הוא *המשמעות*: שער-סוג ⇒ שער-גודל ⇒ קריאה ⇒ פענוח ⇒ סקייל ⇒ כיווץ-canvas.
// שקעים (io): readAsDataUrl(file)⇒Promise<string> · loadImage(src)⇒Promise<{width,height}>
//   · createCanvas()⇒{width,height,getContext(t),toDataURL(type,q)} (במקור: document.createElement).
export async function pickAndCompressImage(file, io) {
  const { readAsDataUrl, loadImage, createCanvas } = io;
  // פרוטוקול-חיצוני: משפחת-MIME של הדפדפן
  if (!file.type.startsWith('image/')) throw new Error(ERR_NOT_IMAGE);
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(ERR_TOO_BIG);
  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_PX / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = createCanvas();
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error(ERR_NO_CANVAS);
  ctx.drawImage(img, 0, 0, w, h);
  // פרוטוקול-חיצוני: MIME-יעד לדחיסה
  return canvas.toDataURL('image/jpeg', QUALITY);
}

// ── חיווט readFileAsDataUrl (מסמך לא-תמונה) ──
// שער-הגודל חי בחוט read-file-as-data-url; הקופסה מזריקה את הקורא (io.readAsDataUrl).
export function readFileAsDataUrl(file, io, maxBytes = MAX_EMBED_BYTES) {
  return readFileAsDataUrlAtom(file, io.readAsDataUrl, maxBytes);
}
