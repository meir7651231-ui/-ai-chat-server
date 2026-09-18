import fs from 'node:fs';
const ROOT = process.env.GEN_ROOT || process.cwd();   // הרץ מתוך שורש-הריפו, או GEN_ROOT=<path>
const OUT = process.env.PROBE_OUT || (process.env.HOME ? process.env.HOME + '/.cache/w-wall-130' : '/tmp/w-wall-130');
fs.mkdirSync(OUT, { recursive: true });
const T = await import(ROOT + '/machtzev/generator/tzinor.mjs');
const o = JSON.parse(fs.readFileSync(OUT + '/probe1.json','utf8'));
const words = [...new Set(o.flatMap(u=>u.claims).flatMap(c=>c.nil))];
console.log('distinct ∅ words:', words.length);
const buckets = { 'אין מועמד כלל':[], 'מועמד בלי מחלקה':[], 'מועמד רופף (strict=false)':[], 'מועמד בלי שקעים':[], 'מועמד-אמת (לא אמור להיות כאן)':[] };
for (const w of words) {
  let all=[]; try { all = T.candidatesFor(w); } catch(e){ all=[]; }
  if (!all.length) { buckets['אין מועמד כלל'].push(w); continue; }
  const real = all.filter(x=>x.cls && x.strict!==false && (x.fields||[]).length);
  if (real.length) { buckets['מועמד-אמת (לא אמור להיות כאן)'].push(w+' ⇒ '+real.map(r=>r.cls).join('/')); continue; }
  const noCls = all.filter(x=>!x.cls), loose = all.filter(x=>x.cls&&x.strict===false), noSlot = all.filter(x=>x.cls&&x.strict!==false&&!(x.fields||[]).length);
  if (noSlot.length) buckets['מועמד בלי שקעים'].push(w+' ⇒ '+noSlot.map(r=>r.cls).join('/'));
  else if (loose.length) buckets['מועמד רופף (strict=false)'].push(w+' ⇒ '+loose.map(r=>r.cls).join('/'));
  else buckets['מועמד בלי מחלקה'].push(w+' ⇒ '+noCls.map(r=>r.key||'?').join('/'));
}
for (const [k,v] of Object.entries(buckets)) console.log(`${String(v.length).padStart(5)} | ${k}`);
fs.writeFileSync(OUT + '/probe2.json', JSON.stringify(buckets,null,1));
for (const [k,v] of Object.entries(buckets)) if(k!=='אין מועמד כלל'&&v.length) console.log('\n== '+k+' ==\n'+v.slice(0,25).join('\n'));
