import { spotlightBox } from './spotlight-box.mjs';
let f = 0;
const eq = (a, b, msg) => {
  const ja = JSON.stringify(a), jb = JSON.stringify(b);
  if (ja !== jb) { console.error(`✗ ${msg} ⇒ ${ja} ≠ ${jb}`); f = 1; }
};

// 1) ריפוד 10 לכל כיוון
eq(spotlightBox({ left: 100, top: 50, width: 200, height: 80 }, 1000, 600),
   { left: 90, top: 40, width: 220, height: 100 }, 'ריפוד בסיסי שגוי');

// 2) צמוד-לפינה — left/top לא יורדים מ-0
eq(spotlightBox({ left: 5, top: 3, width: 50, height: 40 }, 1000, 600),
   { left: 0, top: 0, width: 70, height: 60 }, 'הצמדה לפינה שגויה');

// 3) גולש מהקצה — נחתך לגבול ה-viewport
eq(spotlightBox({ left: 950, top: 580, width: 60, height: 40 }, 1000, 600),
   { left: 940, top: 570, width: 60, height: 30 }, 'חיתוך לגבול שגוי');

// 4) מלבן חסר / מידות 0 ⇒ null
eq(spotlightBox(null, 1000, 600), null, 'null לא החזיר null');
eq(spotlightBox({ left: 10, top: 10, width: 0, height: 40 }, 1000, 600), null, 'רוחב-0 לא החזיר null');

// 5) pad=0 ⇒ ביט-זהה
eq(spotlightBox({ left: 20, top: 30, width: 40, height: 50 }, 1000, 600, 0),
   { left: 20, top: 30, width: 40, height: 50 }, 'pad=0 שינה את המלבן');

if (f) process.exit(1);
console.log('✓ spotlight-box: 5 דוגמאות-חוזה — ירוק');
