// מדגם-10 מתוך ה-73: לכל מילת-∅ — «אינה בשום מקור» או «במקור ואינה מגיעה»?
import fs from 'node:fs';
const ROOT = process.env.GEN_ROOT || process.cwd();   // הרץ מתוך שורש-הריפו, או GEN_ROOT=<path>
const OUT = process.env.PROBE_OUT || (process.env.HOME ? process.env.HOME + '/.cache/w-wall-130' : '/tmp/w-wall-130');
fs.mkdirSync(OUT, { recursive: true });
const T = await import(ROOT + '/machtzev/generator/tzinor.mjs');
const o = JSON.parse(fs.readFileSync(OUT + '/probe1.json','utf8'));
// מדגם דטרמיניסטי: 10 הראשונות בסדר-הסריקה, פר-מקור (א/ב/ג/ד) לפי היחס
const bySrc = {}; for (const u of o) (bySrc[u.src] ||= []).push(u);
const pick = [];
for (const [s, arr] of Object.entries(bySrc)) pick.push(...arr.slice(0, Math.max(1, Math.round(arr.length / o.length * 10))));
const sample = pick.slice(0, 10);
const verdict = (w) => {
  let all = []; try { all = T.candidatesFor(w); } catch { all = []; }
  if (!all.length) return { v: 'אינה בשום מקור', d: 'candidatesFor ⇒ 0 מועמדים בכל ארבעת מקורות-השרשרת' };
  const real = all.filter(x => x.cls && x.strict !== false && (x.fields||[]).length);
  if (real.length) return { v: 'במקור · הישיבה פסקה', d: `${real.length} מועמדי-אמת (${real.map(x=>x.cls).join('/')}) — soleClassOf ⇒ ${JSON.stringify(T.soleClassOf(w))}` };
  const noCls = all.filter(x => !x.cls);
  if (noCls.length) return { v: 'במקור · ואינה מגיעה', d: `מונח ${noCls.map(x=>x.key).join('/')} מוצהר, אך ${noCls[0].via}` };
  const loose = all.filter(x => x.strict === false);
  if (loose.length) return { v: 'במקור · התאמה רופפת (נדחתה בכוונה)', d: `${loose.map(x=>x.cls).join('/')} · strict=false` };
  return { v: 'במקור · מועמד בלי שקעים', d: all.map(x=>x.cls).join('/') };
};
const tally = {};
for (const u of sample) {
  const words = [...new Set(u.claims.filter(c=>!c.ents.length).flatMap(c=>c.nil))];
  console.log(`\n── ${u.id}  (${u.at})  · ${words.length} מילות-∅`);
  for (const w of words.slice(0, 40)) { const r = verdict(w); tally[r.v] = (tally[r.v]||0)+1; console.log(`   ${w.padEnd(14)} ${r.v}  — ${r.d.slice(0,140)}`); }
}
console.log('\n══ סיכום-המדגם:', JSON.stringify(tally));
