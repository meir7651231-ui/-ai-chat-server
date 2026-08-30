/** 🤝 רתמת-התאומים — הרצת אטומי-JS חיים (כולל מטוהרים: שקעי-הדאטה נקראים מהעטיפה
 *  המצולמת בבדיקת-האטום — אמת-קרקע של סדר+ערכים). משרתת את האלתור ואת מנוע-הסינתזה. */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('../../', import.meta.url).pathname;

export async function buildTwinRegistry(fns) {
  const twins = new Map();
  for (const f of fns) {
    const base = path.basename(f.file).replace(/\.dart$/, '');
    const tp = path.join(ROOT, 'new/atoms', base + '.mjs');
    if (!fs.existsSync(tp)) continue;
    try {
      const m = await import('file://' + tp);
      if (typeof m[f.name] !== 'function') continue;
      let extra = [];
      if (m[f.name].length > 1) {
        try {
          const tt = fs.readFileSync(path.join(ROOT, 'new/atoms', base + '.test.mjs'), 'utf8');
          const wm = tt.match(new RegExp(`__pure_${f.name}\\(\\.\\.\\.a,\\s*\\.\\.\\.Array\\(Math\\.max\\([^)]*\\)\\)\\.fill\\(undefined\\),\\s*([^)]+)\\)`));
          if (wm) {
            for (const nm of wm[1].split(',').map(x => x.trim())) {
              const cm = tt.match(new RegExp(`const ${nm} = `));
              if (!cm) { extra = []; break; }
              const st2 = cm.index + cm[0].length;
              let d2 = 0, j2 = st2, q2 = null;
              for (; j2 < tt.length; j2++) {
                const ch = tt[j2];
                if (q2) { if (ch === '\\') j2++; else if (ch === q2) q2 = null; continue; }
                if (ch === "'" || ch === '"' || ch === '`') { q2 = ch; continue; }
                if ('([{'.includes(ch)) d2++;
                else if (')]}'.includes(ch)) d2--;
                else if (ch === ';' && d2 === 0) break;
              }
              extra.push(eval('(' + tt.slice(st2, j2) + ')'));
            }
          }
        } catch { extra = []; }
      }
      const fn0 = m[f.name];
      twins.set(f.name, extra.length ? (v) => fn0(v, ...extra) : fn0);
    } catch { }
  }
  return twins;
}
