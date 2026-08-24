import { sitePalette } from './site-palette.mjs';
let f = 0;
const err = (m) => { console.error('✗ ' + m); f = 1; };
// שקע-נתונים: פלטת-נפילה (במקור CORAL_PALETTE; לבדיקת-הזהות מספיק אובייקט-עד)
const FB = { c1: '#EC9C9C', c2: '#D97F7F' };
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want))
    err(`${name}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`);
};
// דוגמה 1: כחול — משפחה מלאה
eq("'#3B82F6'", sitePalette('#3B82F6', FB), {
  c1: '#8db3f2', c2: '#4b8af1', c3: '#0d5ee3', word: '#6299f3', ink: '#212730',
  paper: '#fafbfd', cream: '#eef2f9', blush: '#f1f5fc', marquee: '#d9e2f2',
  rgb1: '141,179,242', rgb2: '75,138,241', inkRgb: '33,39,48',
});
// דוגמה 2: hex מקוצר #f00 נפרש ל-6 ספרות
{
  const p = sitePalette('#f00', FB);
  if (p.c2 !== '#f14b4b') err(`'#f00'.c2 = ${p.c2} ≠ #f14b4b`);
  if (p.rgb2 !== '241,75,75') err(`'#f00'.rgb2 = ${p.rgb2} ≠ 241,75,75`);
}
// דוגמה 3: אפור (רוויה 0) — נחסם מלמטה ל-0.42 סביב hue 0 (נאמן-למקור)
{
  const p = sitePalette('#888888', FB);
  if (p.c2 !== '#c77575') err(`'#888888'.c2 = ${p.c2} ≠ #c77575`);
  if (p.ink !== '#302121') err(`'#888888'.ink = ${p.ink} ≠ #302121`);
}
// דוגמאות 4–6: נפילה ביט-זהה (אותה הפניה)
if (sitePalette(undefined, FB) !== FB) err('undefined לא החזיר את פלטת-הנפילה עצמה');
if (sitePalette('xyz', FB) !== FB) err("'xyz' לא החזיר את פלטת-הנפילה עצמה");
if (sitePalette('   ', FB) !== FB) err("'   ' לא החזיר את פלטת-הנפילה עצמה");
if (f) process.exit(1);
console.log('✓ site-palette: 6 דוגמאות-חוזה — ירוק');
