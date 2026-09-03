// 🔬 pixel-forge-audit · features — טביעת-אצבע-CSS לאטום: אילו תכונות-"קשות" הוא משתמש בהן
// (background-clip:text · transform-3D · object-fit · clip-path · mask · conic-gradient …).
// הופך "diff 17%" ל-"diff 17% · חשוד: background-clip:text" ⇒ אבחון-שורש מיידי + כיוון-ל-self-heal.
import { parseStyle, PURE } from '../ds-forge.mjs';
import fs from 'node:fs';
import path from 'node:path';

// תכונה קשה ⇒ regex על ה-decl המצטבר של מחלקות-האטום. שם ⇒ קטגוריית-באג.
const HARD = [
  ['background-clip:text', /background-clip\s*:\s*text|-webkit-background-clip\s*:\s*text/i],
  ['transform-3d', /transform\s*:[^;}]*(rotate[xy]|perspective|rotate3d|translatez)/i],
  ['transform-2d', /transform\s*:[^;}]*(rotate|skew|matrix)/i],
  ['object-fit', /object-fit\s*:/i],
  ['clip-path', /clip-path\s*:/i],
  ['mask', /(-webkit-)?mask(-image)?\s*:/i],
  ['mix-blend', /mix-blend-mode\s*:|background-blend-mode\s*:/i],
  ['conic-gradient', /conic-gradient\(/i],
  ['radial-gradient', /radial-gradient\(/i],
  ['filter', /(?<!backdrop-)\bfilter\s*:/i],
  ['backdrop-filter', /backdrop-filter\s*:/i],
  ['aspect-ratio', /aspect-ratio\s*:/i],
  ['position-sticky', /position\s*:\s*sticky/i],
  ['bg-image-url', /background(-image)?\s*:[^;}]*url\(/i],
  ['img-tag', /<img\b/i],
  ['scroll-snap', /scroll-snap-/i],
  ['writing-mode', /writing-mode\s*:/i],
  ['grid-areas', /grid-template-areas\s*:/i],
  ['sticky-overlay', /position\s*:\s*absolute[^;}]*;[^}]*inset\s*:\s*(auto\s+)?0/i],
];

const cache = {};
function famCss(fam) {
  if (!(fam in cache)) { const h = fs.readFileSync(path.join(PURE, `${fam}-family.html`), 'utf8'); cache[fam] = (h.match(/<style>([\s\S]*?)<\/style>/) || ['', ''])[1]; }
  return cache[fam];
}

// אוסף את כל ה-decl-בלוקים של המחלקות/תגים שמופיעים ב-body + ה-inline-styles, ומחזיר קבוצת-תכונות-קשות.
export function fingerprint(fam, body) {
  const classes = new Set(); let m;
  const cre = /class="([^"]+)"/g; while ((m = cre.exec(body))) m[1].split(/\s+/).forEach(c => c && classes.add(c));
  const css = famCss(fam);
  // בלוקי-CSS שהסלקטור שלהם נוגע במחלקה מ-classes (קירוב — התאמת-שם-מחלקה בסלקטור).
  let scoped = body.match(/style="[^"]*"/g)?.join(';') || '';
  const rre = /([^{}]+)\{([^{}]*)\}/g; let r;
  while ((r = rre.exec(css))) { const sel = r[1]; if ([...classes].some(c => sel.includes('.' + c))) scoped += ';' + r[2]; }
  const feats = [];
  for (const [name, re] of HARD) if (re.test(scoped) || re.test(body)) feats.push(name);
  return feats;
}
