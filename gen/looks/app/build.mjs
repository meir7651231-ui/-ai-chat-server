/* build.mjs — מרכיב את האפליקציה לקובץ אחד: mosad.html
   מקורות: האפיון (gen/mosad.data.json) · src/*.js לפי סדר · css/*.css (מתוחם פר-מסך).
   הרצה: node gen/looks/app/build.mjs                                            */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/* ---- 1. האפיון: 12 אגפים · 181 ישויות · 1,232 שדות ⇒ צורה רזה לדפדפן ---- */
const raw = JSON.parse(readFileSync(join(here, '..', '..', 'mosad.data.json'), 'utf8'));
const SPEC = {
  roles: raw.roles.map(r => typeof r === 'string' ? r : r.name),
  depts: raw.departments.map(d => ({
    n: d.name,
    e: (d.entities || []).map(e => ({
      n: e.name, st: e.stages || [], fb: e.forbidden || [], mo: e.moment || '',
      f: (e.fields || []).map(f => [f.name, f.shape || '', f.required ? 1 : 0]),
    })),
  })),
};

/* ---- 2. CSS: כל מסך מתוחם ל-[data-v=<id>] כדי ששמות-מחלקות לא יתנגשו ---- */
function scope(css, id) {
  const out = [];
  let i = 0, at = 0;
  while (i < css.length) {
    const brace = css.indexOf('{', i);
    if (brace < 0) { out.push(css.slice(i)); break; }
    let head = css.slice(i, brace);
    /* דילוג על הערות בתחילת הכותרת */
    const clean = head.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (clean.startsWith('@')) {                       /* @media / @supports — נכנסים פנימה */
      if (/^@(media|supports|layer)/.test(clean)) { out.push(head + '{'); at++; i = brace + 1; continue; }
      /* @keyframes / @font-face — מעתיקים את הבלוק כמו שהוא */
      const end = matchEnd(css, brace);
      out.push(css.slice(i, end + 1)); i = end + 1; continue;
    }
    if (clean === '') {                                 /* סוגר של @media */
      out.push(head + '{'); i = brace + 1; continue;
    }
    const sel = clean.split(',').map(s => {
      s = s.trim();
      if (!s) return s;
      if (s === 'body' || s === 'html' || s === ':root') return `#app[data-v=${id}]`;
      return `#app[data-v=${id}] ${s}`;
    }).join(',');
    out.push(head.replace(clean, sel) + '{');
    const end = matchEnd(css, brace);
    out.push(css.slice(brace + 1, end + 1));
    i = end + 1;
  }
  return out.join('');
}
function matchEnd(s, open) {
  let d = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '{') d++;
    else if (s[i] === '}') { d--; if (!d) return i; }
  }
  return s.length - 1;
}

const cssFiles = readdirSync(join(here, 'css')).filter(f => f.endsWith('.css')).sort();
let CSS = '';
for (const f of cssFiles) {
  const body = readFileSync(join(here, 'css', f), 'utf8');
  CSS += f.startsWith('_') ? body : `\n/* ===== ${f} ===== */\n` + scope(body, f.replace('.css', '')) + '\n';
}

/* ---- 3. JS: הקבצים לפי סדר מספרי, בלי חבילות ובלי ייבוא ---- */
const jsFiles = readdirSync(join(here, 'src')).filter(f => f.endsWith('.js')).sort();
const JS = jsFiles.map(f => `\n/* ===== ${f} ===== */\n` + readFileSync(join(here, 'src', f), 'utf8')).join('\n');

const html = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>מוסד — מערכת הניהול</title>
<meta name="description" content="מערכת ניהול למוסד: 12 אגפים, מחסן נתונים אחד, והאפיון עצמו בתוך המסכים.">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&family=Frank+Ruhl+Libre:wght@500;700;900&family=Suez+One&display=swap">
<style>
${CSS}
</style>
</head>
<body>
<script>
const SPEC = ${JSON.stringify(SPEC)};
${JS}
</script>
</body>
</html>
`;
writeFileSync(join(here, 'mosad.html'), html);
const kb = (n) => (n / 1024).toFixed(0) + 'KB';
console.log(`mosad.html · ${kb(html.length)} · ${jsFiles.length} קבצי-קוד · ${cssFiles.length} גיליונות · ` +
  `${SPEC.depts.length} אגפים · ${SPEC.depts.reduce((a, d) => a + d.e.length, 0)} ישויות · ` +
  `${SPEC.depts.reduce((a, d) => a + d.e.reduce((b, e) => b + e.f.length, 0), 0)} שדות`);
