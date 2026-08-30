/** בדיקת-קצה · קופסת image-pick — כל התרחישים דרך הקופסה בלבד (חוזה: image-pick.contract.md).
 *  DoD: node image-pick.test.mjs ⇒ exit 0 (כל 10 דוגמאות-החוזה ירוקות + מגן-הכרעה). */
import { pickAndCompressImage, readFileAsDataUrl, MAX_UPLOAD_BYTES, MAX_EMBED_BYTES } from './image-pick.mjs';
const IMAGE_PICK_TERMS = {
  k1: "הקובץ אינו תמונה",
  k2: "התמונה גדולה מדי (מקסימום 8MB)",
  k3: "דפדפן אינו תומך בעיבוד תמונה",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
let f = 0;
const fail = (m) => { console.error('✗ ' + m); f = 1; };

// ── שקעי-IO מזויפים (דטרמיניסטיים) ──
const mkIo = (opts = {}) => {
  const calls = { read: 0, load: 0, canvas: 0, draw: null };
  const io = {
    readAsDataUrl: async (file) => { calls.read++; return `DATA:${file.type}:${file._w}x${file._h}`; },
    loadImage: async (src) => { calls.load++; const m = /:(\d+)x(\d+)$/.exec(src); return { width: +m[1], height: +m[2] }; },
    createCanvas: () => {
      calls.canvas++;
      const c = { width: 0, height: 0 };
      c.getContext = () => (opts.noCtx ? null : { drawImage: (img, x, y, w, h) => { calls.draw = { w, h }; } });
      c.toDataURL = (type, q) => `OUT|${c.width}x${c.height}|${type}|q=${q}`;
      return c;
    },
  };
  return { io, calls };
};
const imgFile = (w, h, size = 1000, type = 'image/png') => ({ type, size, _w: w, _h: h });

async function throws(fn, msg, label) {
  try { await fn(); fail(`${label}: לא נזרקה שגיאה`); }
  catch (e) { if (e.message !== msg) fail(`${label}: הודעה "${e.message}" ≠ "${msg}"`); }
}

// 1) לא-תמונה ⇒ שער-סוג, שום שקע לא נקרא
{ const { io, calls } = mkIo();
  await throws(() => pickAndCompressImage({ type: 'text/plain', size: 10 }, io), IMAGE_PICK_TERMS.k1, '1');
  if (calls.read || calls.load || calls.canvas) fail('1: שקע נקרא למרות שער-הסוג'); }

// 2) תמונה גדולה מדי
{ const { io } = mkIo();
  await throws(() => pickAndCompressImage(imgFile(10, 10, MAX_UPLOAD_BYTES + 1), io), IMAGE_PICK_TERMS.k2, '2'); }

// 3) 640×480 ⇒ 320×240, toDataURL(image/jpeg,0.72)
{ const { io, calls } = mkIo();
  const out = await pickAndCompressImage(imgFile(640, 480), io);
  if (out !== 'OUT|320x240|image/jpeg|q=0.72') fail(`3: פלט "${out}"`);
  if (calls.draw.w !== 320 || calls.draw.h !== 240) fail('3: drawImage לא קיבל 320×240');
  if (calls.read !== 1 || calls.load !== 1 || calls.canvas !== 1) fail('3: ספירת-שקעים'); }

// 4) 100×50 ⇒ אין הגדלה
{ const { io } = mkIo();
  const out = await pickAndCompressImage(imgFile(100, 50), io);
  if (out !== 'OUT|100x50|image/jpeg|q=0.72') fail(`4: פלט "${out}"`); }

// 5) עיגול 333×100 ⇒ 320×96
{ const { io } = mkIo();
  const out = await pickAndCompressImage(imgFile(333, 100), io);
  if (out !== 'OUT|320x96|image/jpeg|q=0.72') fail(`5: פלט "${out}"`); }

// 6) 0×0 ⇒ רצפת Math.max(1,…) ⇒ 1×1
{ const { io } = mkIo();
  const out = await pickAndCompressImage(imgFile(0, 0), io);
  if (out !== 'OUT|1x1|image/jpeg|q=0.72') fail(`6: פלט "${out}"`); }

// 7) getContext=null ⇒ שגיאת-דפדפן (אחרי width/height, לפני drawImage)
{ const { io, calls } = mkIo({ noCtx: true });
  await throws(() => pickAndCompressImage(imgFile(640, 480), io), IMAGE_PICK_TERMS.k3, '7');
  if (calls.draw !== null) fail('7: drawImage נקרא למרות ctx null'); }

// 8) readFileAsDataUrl: 3MB+1 ⇒ שער-גודל, השקע לא נקרא
{ const { io, calls } = mkIo();
  await throws(() => readFileAsDataUrl({ size: MAX_EMBED_BYTES + 1, type: 'application/pdf' }, io),
    'הקובץ גדול מדי להטמעה (מקסימום 3MB) — הוסיפו קישור במקום', '8');
  if (calls.read) fail('8: השקע נקרא למרות חריגת-הגודל'); }

// 9) readFileAsDataUrl: בדיוק התקרה ⇒ עובר, השקע נקרא פעם-אחת
{ const { io, calls } = mkIo();
  const out = await readFileAsDataUrl({ size: MAX_EMBED_BYTES, type: 'application/pdf', _w: 0, _h: 0 }, io);
  if (out !== 'DATA:application/pdf:0x0') fail(`9: פלט "${out}"`);
  if (calls.read !== 1) fail('9: השקע לא נקרא פעם-אחת בדיוק'); }

// 10) maxBytes מותאם ⇒ ההודעה נגזרת מ-maxBytes
{ const { io } = mkIo();
  await throws(() => readFileAsDataUrl({ size: 2000000, type: 'application/pdf' }, io, 1048576),
    'הקובץ גדול מדי להטמעה (מקסימום 1MB) — הוסיפו קישור במקום', '10'); }

/* 🛡 מגן-הכרעה: ההכרעות verbatim מהמקור + סדר-השערים חתום. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./image-pick.mjs', import.meta.url), 'utf8');
for (const lit of ['const MAX_PX = 320;', 'const QUALITY = 0.72;',
  "IMAGE_PICK_TERMS.k1", "IMAGE_PICK_TERMS.k2", "IMAGE_PICK_TERMS.k3",
  "'image/jpeg', QUALITY"])
  if (!src.includes(lit)) fail(`מגן: ההכרעה "${lit}" שונתה/נעלמה`);
// סדר: שער-סוג לפני שער-גודל לפני קריאה; null-check לפני drawImage
if (src.indexOf("startsWith('image/')") > src.indexOf('file.size > MAX_UPLOAD_BYTES')) fail('מגן: שער-הגודל לפני שער-הסוג');
if (src.indexOf('!ctx') > src.indexOf('ctx.drawImage')) fail('מגן: drawImage לפני null-check של ctx');

if (f) process.exit(1);
console.log('✓ קופסת image-pick: 10 דוגמאות-חוזה (כיווץ/עיגול/רצפה/שערים/הטמעה) + מגן-הכרעה — ירוק');
