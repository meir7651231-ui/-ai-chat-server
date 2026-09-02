// 🔬 pixel-forge-audit · lib — מקור-אמת יחיד לחציבת-אטומים + מסגור-ORIG.
// מייבא את אותה חציבת-תאים מ-ds-forge כדי שה-ORIG יתמסגר בדיוק כמו ה-FORGE (438px · pad16 · #08080A).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cells, theaterStates, pascal, snake, PURE, familiesOf } from '../ds-forge.mjs';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const FONTS = path.join(HERE, 'fonts');
export const SHOTS = path.join(HERE, 'shots');
export const FRAME_W = 438, FRAME_PAD = 16, CANVAS = '#08080A';
export { familiesOf };

// @font-face לכל הפונטים המקומיים (file://) — זהה למה שה-FontLoader טוען בצד-Dart.
export const faces = `<style>
@font-face{font-family:'Fraunces';font-weight:600;src:url('file://${FONTS}/Fraunces-600.ttf')}
@font-face{font-family:'Fraunces';font-weight:700;src:url('file://${FONTS}/Fraunces-700.ttf')}
@font-face{font-family:'Frank Ruhl Libre';font-weight:700;src:url('file://${FONTS}/FrankRuhlLibre-700.ttf')}
@font-face{font-family:'Space Grotesk';font-weight:400;src:url('file://${FONTS}/SpaceGrotesk-400.ttf')}
@font-face{font-family:'Space Grotesk';font-weight:600;src:url('file://${FONTS}/SpaceGrotesk-600.ttf')}
@font-face{font-family:'Space Grotesk';font-weight:700;src:url('file://${FONTS}/SpaceGrotesk-700.ttf')}
@font-face{font-family:'Heebo';font-weight:400;src:url('file://${FONTS}/Heebo-Regular.ttf')}
@font-face{font-family:'Heebo';font-weight:600;src:url('file://${FONTS}/Heebo-SemiBold.ttf')}
@font-face{font-family:'Heebo';font-weight:700;src:url('file://${FONTS}/Heebo-Bold.ttf')}
@font-face{font-family:'JetBrains Mono';font-weight:400;src:url('file://${FONTS}/JetBrainsMono-Regular.ttf')}
@font-face{font-family:'JetBrains Mono';font-weight:700;src:url('file://${FONTS}/JetBrainsMono-Bold.ttf')}
</style>`;

const cache = {};
function familyHtml(fam) {
  if (!cache[fam]) cache[fam] = fs.readFileSync(path.join(PURE, `${fam}-family.html`), 'utf8');
  return cache[fam];
}

// כל האטומים של משפחה, בדדופ זהה ל-ds-forge (seen על שם-המחלקה). לתאטרון ⇒ מצב-ראשון (מה שה-FORGE מצייר).
export function atomsOf(fam) {
  const html = familyHtml(fam);
  const list = cells(html);
  const seen = new Set(), out = [];
  for (const c of list) {
    const cls = 'Forge' + pascal(c.name);
    if (seen.has(cls)) continue; seen.add(cls);
    const th = theaterStates(c.body);
    out.push({ family: fam, slug: snake(c.name), cls, name: c.name, seam: c.seam, theater: !!th, origBody: th ? th[0].html : c.body });
  }
  return out;
}

// כל האטומים בכל המשפחות (סדר יציב).
export function allAtoms() {
  return familiesOf().flatMap(atomsOf);
}

// דף-HTML ממוסגר ל-ORIG של אטום — style+defs של המשפחה, מסגרת 438/pad16/#08080A, RTL, theme t-indigo.
export function frameOrig(fam, origBody) {
  const html = familyHtml(fam);
  const style = (html.match(/<style>[\s\S]*?<\/style>/) || [''])[0];
  const defs = (html.match(/<defs>[\s\S]*?<\/defs>/g) || []).join('');
  return `<!doctype html><meta charset="utf-8">${faces}${style}
<body style="margin:0;padding:0;background:#000"><div class="t-indigo" dir="rtl" style="width:${FRAME_W}px;background:${CANVAS};padding:${FRAME_PAD}px;box-sizing:border-box"><svg width="0" height="0" style="position:absolute">${defs}</svg>${origBody}</div></body>`;
}

export const key = a => `${a.family}__${a.slug}`;
