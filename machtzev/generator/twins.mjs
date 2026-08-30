/** 🤝 רתמת-התאומים — הרצת אטומי-JS חיים (כולל מטוהרים: שקעי-הדאטה נקראים מהעטיפה
 *  המצולמת בבדיקת-האטום — אמת-קרקע של סדר+ערכים). משרתת את האלתור ואת מנוע-הסינתזה.
 *
 *  🌾 קוצר-הפיקסצ'רים (מבצע-המאה, פאזה 1): מנוע רב-פרמטרי שאין לו עטיפת-שקעים נקצר
 *  מקריאת-העבודה הראשונה בבדיקה שלו — זנב-הארגומנטים (אחרי הראשון) מוערך מתוך קבועי-הבדיקה
 *  ונרשם. זנב JSON-י פשוט (פרימיטיבים/רשימות) מסומן simple ⇒ המחולל והשער רשאים לפלוט
 *  אותו כליטרל-Dart במסך (שוויון JS⇄Dart נשמר); זנב מורכב משרת הרצת-JS בלבד. */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('../../', import.meta.url).pathname;

/** מטא-הזנבות של הקציר האחרון: fnName ⇒ { tail:any[], simple:boolean } */
export const twinMeta = new Map();

/** ערך-JS ⇒ ליטרל-Dart (רק לזנבות simple). top=true מוסיף const לאוספים. */
export const dartLit = (v, top = true) => {
  if (v === null) return 'null';
  if (typeof v === 'string') return "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'double.nan';
  if (typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return (top ? 'const ' : '') + '[' + v.map(x => dartLit(x, false)).join(', ') + ']';
  return (top ? 'const ' : '') + '{' + Object.entries(v).map(([k, x]) => dartLit(k, false) + ': ' + dartLit(x, false)).join(', ') + '}';
};

const jsonable = (v) => {
  try { const s = JSON.stringify(v); return s !== undefined && s.length <= 2000 && JSON.stringify(JSON.parse(s)) === s; } catch { return false; }
};
const prim = (v) => v === null || ['string', 'number', 'boolean'].includes(typeof v);
const simpleVal = (v) => prim(v)
  || (Array.isArray(v) && v.length <= 60 && v.every(prim))
  || (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length <= 60 && Object.values(v).every(prim));

// חיתוך-מאוזן: מ-start עד סוגר-הסיום התואם (start מצביע אחרי הפותח)
const balanced = (s, start, open = '(', close = ')') => {
  let d = 1, q = null;
  for (let j = start; j < s.length; j++) {
    const ch = s[j];
    if (q) { if (ch === '\\') j++; else if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { q = ch; continue; }
    if (ch === open || '([{'.includes(ch)) d++;
    else if (ch === close || ')]}'.includes(ch)) { d--; if (d === 0) return j; }
  }
  return -1;
};
const splitTop = (s) => {
  const out = []; let d = 0, q = null, cur = '';
  for (let j = 0; j < s.length; j++) {
    const ch = s[j];
    if (q) { cur += ch; if (ch === '\\') { cur += s[j + 1] ?? ''; j++; } else if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { q = ch; cur += ch; continue; }
    if ('([{'.includes(ch)) d++;
    if (')]}'.includes(ch)) d--;
    if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

// הקשר-הבדיקה: כל הצהרות-const ברמת-הקובץ מוערכות בסדרן (מה שנכשל — מדולג)
const buildCtx = (tt) => {
  const ctx = Object.create(null);
  const re = /(?:^|\n)\s*const\s+([A-Za-z_$][\w$]*)\s*=\s*/g;
  let m;
  while ((m = re.exec(tt))) {
    const st = m.index + m[0].length;
    let d = 0, j = st, q = null;
    for (; j < tt.length; j++) {
      const ch = tt[j];
      if (q) { if (ch === '\\') j++; else if (ch === q) q = null; continue; }
      if (ch === "'" || ch === '"' || ch === '`') { q = ch; continue; }
      if ('([{'.includes(ch)) d++;
      else if (')]}'.includes(ch)) d--;
      else if (ch === ';' && d === 0) break;
    }
    try { ctx[m[1]] = Function('ctx', 'with(ctx){ return (' + tt.slice(st, j) + '); }')(ctx); } catch { }
  }
  return ctx;
};
const evalIn = (expr, ctx) => Function('ctx', 'with(ctx){ return (' + expr + '); }')(ctx);

export async function buildTwinRegistry(fns) {
  const twins = new Map();
  twinMeta.clear();
  for (const f of fns) {
    const base = path.basename(f.file).replace(/\.dart$/, '');
    const tp = path.join(ROOT, 'new/atoms', base + '.mjs');
    if (!fs.existsSync(tp)) continue;
    try {
      const m = await import('file://' + tp);
      if (typeof m[f.name] !== 'function') continue;
      const fn0 = m[f.name];
      let tt = '';
      try { tt = fs.readFileSync(path.join(ROOT, 'new/atoms', base + '.test.mjs'), 'utf8'); } catch { }
      let extra = null;                                             // שקעי-עטיפה (מטוהרים) — קדימות ראשונה
      if (fn0.length > 1 && tt) {
        const wm = tt.match(new RegExp(`__pure_${f.name}\\(\\.\\.\\.a,\\s*\\.\\.\\.Array\\(Math\\.max\\([^)]*\\)\\)\\.fill\\(undefined\\),\\s*([^)]+)\\)`));
        if (wm) {
          const vals = [];
          let ok = true;
          for (const nm of wm[1].split(',').map(x => x.trim())) {
            const cm = tt.match(new RegExp(`const ${nm} = `));
            if (!cm) { ok = false; break; }
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
            try { vals.push(eval('(' + tt.slice(st2, j2) + ')')); } catch { ok = false; break; }
          }
          if (ok) extra = vals;
        }
      }
      // 🌾 קציר-פיקסצ'רים: אין עטיפה והמנוע רב-פרמטרי ⇒ קריאת-העבודה הראשונה בבדיקה
      if (extra === null && fn0.length > 1 && tt) {
        const clean = tt.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
        const callRe = new RegExp(`(?<![\\w.$])${f.name}\\(`, 'g');
        let ctx = null, cm2;
        while ((cm2 = callRe.exec(clean))) {
          const end = balanced(clean, cm2.index + cm2[0].length);
          if (end < 0) continue;
          const args = splitTop(clean.slice(cm2.index + cm2[0].length, end));
          if (args.length !== fn0.length || args.some(a2 => a2.startsWith('...'))) continue;
          if (ctx === null) ctx = buildCtx(clean);
          const tail = [];
          let ok2 = true;
          for (const ax of args.slice(1)) {
            try { const v = evalIn(ax, ctx); if (!jsonable(v)) { ok2 = false; break; } tail.push(v); } catch { ok2 = false; break; }
          }
          if (!ok2) continue;
          extra = tail;
          twinMeta.set(f.name, { tail, simple: tail.every(simpleVal) });
          break;
        }
      } else if (extra !== null && extra.length && jsonable(extra)) {
        twinMeta.set(f.name, { tail: extra, simple: extra.every(simpleVal) });
      }
      if (fn0.length > 1 && extra === null) continue;               // רב-פרמטרי שלא נקצר — לא נרשם (כנות)
      const tail = extra || [];
      twins.set(f.name, tail.length ? (v) => fn0(v, ...tail) : fn0);
    } catch { }
  }
  // ידע-הזנבות נשמר לקריאה סינכרונית (המחולל קורא בלי לייבא 1,100 מודולים)
  try {
    const out = {};
    for (const [n, meta] of twinMeta) out[n] = meta;
    fs.writeFileSync(path.join(ROOT, 'machtzev/generator/knowledge/twin-tails.json'), JSON.stringify(out, null, 1));
  } catch { }
  return twins;
}
