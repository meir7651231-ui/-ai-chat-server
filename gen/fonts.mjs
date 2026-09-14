#!/usr/bin/env node
// gen/fonts.mjs — הגופן נוסע עם הקובץ, לא מ-CDN.
// למה: L69 (גופן-CDN באתר-מנותק ⇒ טקסט נעלם) · G52 (12,583ms מתוך 13,838ms היו בקשת-גופן) ·
// ובשוק הזה הרשתות מסוננות (משו"ב עצמו מארח את הגופן אצלו, font-src 'self').
// הגופן: Heebo (OFL-1.1). נבחר כי ספרותיו רוחב-שווה כברירת-מחדל (נמדד: כל עשר הספרות 1151/2048),
// כלומר עמודות-כסף מיושרות בלי font-feature-settings, ומשקל-משתנה 100..900 בקובץ אחד.
// בנייה (פעם אחת, לא בכל פליטה): node gen/fonts.mjs --build [נתיב-ל-Heebo.ttf]
//   ⇒ gen/fonts/heebo-subset.woff2 (תת-קבוצה: לטינית · עברית · ניקוד · ₪ · סימני-פיסוק)
// שימוש: fontFaceCss() מחזיר @font-face עם base64, כדי שהקובץ-היחיד יהיה באמת יחיד.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const FONT_FILE = path.join(HERE, 'fonts', 'heebo-subset.woff2');
export const UNICODES = 'U+0020-007E,U+00A0,U+05B0-05F4,U+200E-200F,U+2010-2011,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+20AA,U+20AC,U+2039-203A,U+FB1D-FB4F';

export function hasFont() { return fs.existsSync(FONT_FILE); }

// @font-face מוטבע. אין קובץ ⇒ מחרוזת ריקה והעמוד נופל לערימת-הגופנים (Arial) — נאמר, לא מוסתר.
export function fontFaceCss() {
  if (!hasFont()) return '';
  const b64 = fs.readFileSync(FONT_FILE).toString('base64');
  return `/* Heebo · SIL Open Font License 1.1 (gen/fonts/OFL.txt) · תת-קבוצה: לטינית+עברית+₪ · משקל-משתנה 100..900 */
@font-face{font-family:Heebo;src:url(data:font/woff2;base64,${b64}) format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
`;
}

if (process.argv[1] && process.argv[1].endsWith('fonts.mjs') && process.argv.includes('--build')) {
  const src = process.argv[process.argv.indexOf('--build') + 1] || '/home/user/meir7651231-ui/buildsmart/app_flutter/assets/fonts/Heebo.ttf';
  if (!fs.existsSync(src)) { console.error(`✗ אין קובץ-מקור: ${src}`); process.exit(1); }
  fs.mkdirSync(path.dirname(FONT_FILE), { recursive: true });
  execFileSync('python3', ['-m', 'fontTools.subset', src, `--unicodes=${UNICODES}`, '--layout-features=*', '--flavor=woff2', `--output-file=${FONT_FILE}`], { stdio: 'inherit' });
  const before = fs.statSync(src).size, after = fs.statSync(FONT_FILE).size;
  console.log(`✓ גופן: ${path.basename(src)} ${before}B ⇒ ${path.basename(FONT_FILE)} ${after}B (base64 בעמוד: ~${Math.round(after * 4 / 3)}B) · אפס מארח חיצוני`);
}
