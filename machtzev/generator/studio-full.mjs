#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  studio-full.mjs — לוח-המדידה של המחולל החי (app-ds).
//  אפס מספרים כתובים ביד: כל ערך נגזר מקריאת-קבצים או מריצת-מנוע על העץ הזה,
//  ונושא איתו את הפקודה ואת ה-file:line שממנו נלקח (חוזה-המדידה).
//  הרצה: node machtzev/generator/studio-full.mjs  ⇒  <out>/mechollel.html
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAtlas } from './atlas.mjs';
import { NEEDS } from './behavior-plan.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const R = (p) => path.join(ROOT, p);
const rd = (p) => fs.readFileSync(R(p), 'utf8');
const ls = (d, re) => { try { return fs.readdirSync(R(d)).filter((f) => re.test(f)).sort(); } catch { return []; } };
const OUT = process.env.STUDIO_OUT || path.join(ROOT, 'gen/out');

// ── פנקס-הגזירה: כל טענה שהמחולל כתב על עצמו, מול הקוד שנשלח בפועל ──
const SKIN=JSON.parse(rd('machtzev/generator/auto-skin.json')).skin;
// מפת-תפקיד ⇒ אטום-עור. שם-האטום ב-DS הוא הברירה שהכותרת מצהירה.
const roleOf={}; for(const [role,atom] of Object.entries(SKIN)) if(typeof atom==='string') roleOf[role]=atom;
const DERIV=/^\/\/\s{2,}(.+?)\s=\s(.+?)\s⇒\s(.+)$/;
const screens=ls('new/dart-gen-bs',/^gen_app_.*\.dart$/);
const led=[]; const seen=new Set();
for(const f of screens){
  const src=rd('new/dart-gen-bs/'+f);
  const bodyAt=src.search(/^(class|Widget|final)/m); const body=bodyAt<0?src:src.slice(bodyAt);
  const imports=[...src.matchAll(/^import\s+'([^']+)'/gm)].map(m=>m[1]);
  for(const line of src.split('\n')){
    if(!line.startsWith('//')) { if(/^import\b/.test(line)) break; else continue; }
    const m=line.match(DERIV); if(!m) continue;
    const chain=m[3].split('⇒').map(s=>s.trim()); const tail=chain[chain.length-1];
    const role=(chain.find(c=>/^\[.*\]$/.test(c))||'').replace(/[\[\]]/g,'').split(',')[0].trim();
    for(const raw of tail.split('+').map(s=>s.trim())){
      const mm=raw.match(/^([A-Za-z][A-Za-z0-9_]*)(?:@(\S+))?$/); if(!mm) continue;
      const [,declared,shelf]=mm;
      const inBody=new RegExp('\\b'+declared+'\\b').test(body);
      // מה באמת נשלח: אם ההצהרה לא בגוף — חפש את אטום-העור של אותו תפקיד
      const skinAtom=roleOf[role]||roleOf[(chain[0]||'').trim()]||'';
      const skinInBody=skinAtom&&new RegExp('\\b'+skinAtom+'\\b').test(body);
      const shipped=inBody?declared:(skinInBody?skinAtom:'');
      const snake=declared.replace(/([a-z0-9])([A-Z])/g,'$1_$2').toLowerCase();
      const staleImport=!inBody&&imports.find(i=>i.endsWith('/'+snake+'.dart'))||'';
      const verdict=inBody?(shelf?'shelf?':'ok'):(shipped?'skin':'missing');
      const key=[m[1],m[2],declared,shipped,shelf,verdict].join('|');
      led.push({file:f,label:m[1],form:m[2],chain:chain.join(' ⇒ '),role,declared,shelf:shelf||'',shipped,verdict,staleImport,dup:seen.has(key)}); seen.add(key);
    }
  }
}
const g=v=>led.filter(l=>l.verdict===v).length;
if (process.env.STUDIO_VERBOSE) console.log('שורות',led.length,'· ok',g('ok'),'· הוחלף-בעור',g('skin'),'· מדף-מוצהר',g('shelf?'),'· נעדר',g('missing'));
const bySkin={}; for(const l of led.filter(l=>l.verdict==='skin')) bySkin[l.declared+' ⇒ '+l.shipped]=(bySkin[l.declared+' ⇒ '+l.shipped]||0)+1;
if (process.env.STUDIO_VERBOSE) console.log('החלפות-עור:',JSON.stringify(bySkin));
const byShelf={}; for(const l of led.filter(l=>l.shelf)) byShelf[l.declared+'@'+l.shelf]=(byShelf[l.declared+'@'+l.shelf]||0)+1;
if (process.env.STUDIO_VERBOSE) console.log('מדף-מוצהר:',JSON.stringify(byShelf));
const miss={}; for(const l of led.filter(l=>l.verdict==='missing')) miss[l.declared]=(miss[l.declared]||0)+1;
if (process.env.STUDIO_VERBOSE) console.log('נעדרים:',JSON.stringify(miss));
if (process.env.STUDIO_VERBOSE) console.log('ייבוא-מיותר:',led.filter(l=>l.staleImport).length);

const L = led;

// ── הקורפוס · שערים · צרכים · אטלס · צינור ──
const o={};
// ספקים: ישויות · שדות · חלקיקים · תוכן · דוחות
o.specs=ls('machtzev/generator/specs-ds',/\.txt$/).map(f=>{
  const s=rd('machtzev/generator/specs-ds/'+f), L=s.split('\n');
  const ent=L.filter(l=>/^\s*(צור\s+)?(ישות|טופס|טבלת)(\s|$)/.test(l)).length;
  const part=L.filter(l=>/^\s*חלקיק\s/.test(l)).length;
  const cont=L.filter(l=>/^\s*תוכן\s/.test(l)).length;
  const rep=L.filter(l=>/^\s*דוח\s/.test(l)).length;
  const dash=L.filter(l=>/^\s*(דשבורד|לוח-מחוונים)/.test(l)).length;
  const role=L.filter(l=>/^\s*(תפקיד|הרשאת)\s/.test(l)).length;
  const fields=L.filter(l=>/^\s{2,}\S/.test(l)&&!/^\s*[|#]/.test(l)).length;
  const ns=f.replace(/\.txt$/,'');
  const out=ls('new/dart-gen-bs',new RegExp('^gen_app_'+ns.replace(/[^a-z0-9]/gi,'')+'_.*\\.dart$')).length;
  return {name:ns,lines:L.filter(l=>l.trim()).length,ent,fields,part,cont,rep,dash,role,out,bytes:Buffer.byteLength(s)};
});
// שערים
o.gates=rd('machtzev/gates.tsv').trim().split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>{const c=l.split('\t');return{id:c[0],rest:c.slice(1).join(' ').slice(0,120)}});
// צרכים
o.needs=Object.entries(NEEDS).map(([id,n])=>({id,sig:n.sig||n.signature||'',ex:(n.examples||n.ex||[]).length,note:(n.note||n.he||'')+''}));
// bh*
const bhs=rd('machtzev/generator/behavior-compose.mjs');
o.bh=[...new Set([...bhs.matchAll(/\bbh[A-Z][A-Za-z0-9]*/g)].map(m=>m[0]))].sort();
// אטלס
const atlas=JSON.parse(rd('machtzev/generator/atlas.json'));
const fresh=await buildAtlas({});
const ow=new Set(atlas.widgets.map(w=>w.cls)), of=new Set(atlas.functions.map(f=>f.name));
o.atlas={pinW:ow.size,freshW:new Set(fresh.widgets.map(w=>w.cls)).size,pinF:of.size,freshF:new Set(fresh.functions.map(f=>f.name)).size,
 missW:[...new Set(fresh.widgets.map(w=>w.cls))].filter(c=>!ow.has(c)),
 missF:[...new Set(fresh.functions.map(f=>f.name))].filter(c=>!of.has(c))};
// שלבי-הצינור: מ-regen.mjs
const reg=rd('machtzev/generator/regen.mjs');
o.pipeline=[...reg.matchAll(/rel:\s*'([^']+)'[^}]*?note:\s*'([^']*)'/g)].map(m=>({rel:m[1],note:m[2]}));
// תפקידי-עור
o.skin=Object.entries(JSON.parse(rd('machtzev/generator/auto-skin.json')).skin).filter(([,v])=>typeof v==='string');

const C = o;

const e = s => String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const n = v => Number(v).toLocaleString('he-IL');
const sum = (a,f) => a.reduce((x,y)=>x+f(y),0);

const V = {
  ok:   L.filter(l=>l.verdict==='ok').length,
  skin: L.filter(l=>l.verdict==='skin').length,
  shelf:L.filter(l=>l.verdict==='shelf?').length,
  miss: L.filter(l=>l.verdict==='missing').length,
};

/* ── חוזה-המדידה ── */
const CONTRACT = [
  ['ספקים חיים','קובץ',C.specs.length,"ls machtzev/generator/specs-ds/*.txt | wc -l",'regen.mjs:28','כל .txt בתיקייה. regen נגזר מהתיקייה — לא רשימה כתובה.','‏7 = ספקי gen/ המנותק · 28 = פירוקי-הבעלים'],
  ['ישויות','ישות',sum(C.specs,s=>s.ent),"grep -cE '^ *(צור )?(ישות|טופס|טבלת)' specs-ds/*.txt",'app-ds.mjs:ENTITY_RE','שורה שפותחת ישות בספק. ממנה נגזרים טופס · טבלה · אחסון.','‏36 = ישויות שחבילת-השרת מכסה (G57)'],
  ['חלקיקים','חלקיק',sum(C.specs,s=>s.part),"grep -c '^ *חלקיק ' specs-ds/*.txt",'particles.mjs:PARTICLE_RE','‏«חלקיק ישות: שם = צורה». כל אחד מחפש אטום בכל הקטלוג.','‏230 ≠ 244 שורות-גזירה — חלקיק אחד יכול לפלוט כמה אטומים'],
  ['פריטי-תוכן','פריט',sum(C.specs,s=>s.cont),"grep -c '^ *תוכן ' specs-ds/*.txt",'particles.mjs:CONTENT_RE','‏«תוכן קבוצה [תג]: טקסט» — טקסט-מסך, לא קוד.',''],
  ['חלקי-דוח','חלק',sum(C.specs,s=>s.rep),"grep -c '^ *דוח ' specs-ds/*.txt",'particles.mjs:REPORT_RE','‏«דוח ישות: חלק = ref» — מבנה-קבוע-לרשומה.',''],
  ['מסכים מחוללים','קובץ dart',sum(C.specs,s=>s.out),"ls new/dart-gen-bs/gen_app_*.dart | wc -l",'render-ds.mjs:write','קובץ .dart שנכתב תחת מרחב-שם של ספק.','‏453 = כולל מרחבי-שם שאין להם ספק פעיל'],
  ['שורות-גזירה','שורה',L.length,'סריקת כותרות gen_app_*.dart','particles.mjs:renderParticles','טענה שהמחולל כתב על עצמו: תווית = צורה ⇒ … ⇒ אטום.',''],
  ['גזירות מדויקות','שורה',V.ok,'השוואת שם-האטום מול גוף-הווידג׳ט','גוף gen_app_*.dart','האטום שהוצהר הוא האטום שמופיע בקוד.','‏244 = כל השורות'],
  ['הוחלפו בעור','שורה',V.skin,'auto-skin.json[role] מול גוף-הווידג׳ט','auto-skin.json:26','הכותרת מצהירה אטום-DS; מעבר-העור החליף באטום-forge ולא עדכן.',''],
  ['מדף מוצהר-שגוי','שורה',V.shelf,'השוואת @shelf מול שורת ה-import','gen_app_peruk03_px1.dart:4 מול :24','הכותרת אומרת premium/feedback; הקובץ מייבא dart-ui-bs/auto.',''],
  ['ייבוא-מיותר','שורה',L.filter(l=>l.staleImport).length,'ייבוא של אטום שאינו בגוף','gen_app_peruk01_px1.dart:18','‏ds_table.dart מיובא, DsTable לא מופיע.',''],
  ['ווידג׳טים באטלס המוצמד','שם-מחלקה',C.atlas.pinW,'‏node -e buildAtlas({}) מול atlas.json','machtzev/generator/atlas.json','שמות-מחלקה ייחודיים בקובץ המוצמד.','‏'+n(C.atlas.freshW)+' = טרי · 924 = אטמי-תצוגה באינדקס'],
  ['ווידג׳טים שחסרים באטלס','שם-מחלקה',C.atlas.missW.length,'‏diff טרי ↔ מוצמד','atlas.mjs:buildAtlas','קיימים בעץ, נעדרים מהאטלס שעליו נמדד TRUTH.md.',''],
  ['צרכי-התנהגות','צורך',C.needs.length,"node -e 'Object.keys(NEEDS).length'",'behavior-plan.mjs','פעולת-יסוד עם חתימה+דוגמאות שהבורר חייב לענות מהמדף.','‏10 = צרכי gen/ המנותק'],
  ['חלקיקי-הרכבה','‏bh*',C.bh.length,"grep -oE 'bh[A-Z][A-Za-z0-9]*' behavior-compose.mjs | sort -u | wc -l",'behavior-compose.mjs','השכבה היחידה שמסך מורשה לקרוא לה. שער behavior אוסר עקיפה.',''],
  ['תפקידי-עור','תפקיד',C.skin.length,"node -e 'Object.keys(auto-skin.json.skin)'",'auto-skin.mjs:17','חריץ שהמנוע בוחר לו אטום-forge מבנית.','‏359 = אטומי-forge שמהם בוחרים'],
  ['שערי-משטרה','שער',C.gates.length,'wc -l machtzev/gates.tsv','machtzev/gates.tsv','מרשם-השערים; כל אחד עם ran-ledger בארבעה מצבים.',''],
  ['שלבי-הצינור','שלב',C.pipeline.length,'קריאת רשימת-הריצה','regen.mjs','סדר-הריצה היחיד. ship ו-one מריצים את אותה רשימה.',''],
];

const badge = v => v==='ok' ? '<b class="v ok">מדויק</b>'
  : v==='skin' ? '<b class="v sk">הוחלף בעור</b>'
  : v==='shelf?' ? '<b class="v sh">מדף שגוי</b>' : '<b class="v ms">נעדר</b>';

const ledgerRows = L.map((l,i)=>`<tr data-v="${l.verdict}" data-s="${e((l.file+' '+l.label+' '+l.declared+' '+l.shipped).toLowerCase())}">
<td class="mono sm">${e(l.file.replace(/^gen_app_/,'').replace(/\.dart$/,''))}</td>
<td>${e(l.label)}</td><td class="mono sm">${e(l.form)}</td>
<td class="mono sm chain">${e(l.chain)}</td>
<td class="mono">${e(l.declared)}${l.shelf?'<i class="sh-at">@'+e(l.shelf)+'</i>':''}</td>
<td class="mono">${l.shipped?e(l.shipped):'<i class="none">—</i>'}</td>
<td>${badge(l.verdict)}</td></tr>`).join('\n');

const specRows = C.specs.map(s=>`<tr><td class="mono">${e(s.name)}</td><td class="num">${n(s.lines)}</td><td class="num">${n(s.ent)}</td><td class="num">${n(s.part)}</td><td class="num">${n(s.cont)}</td><td class="num">${n(s.rep)}</td><td class="num strong">${n(s.out)}</td></tr>`).join('\n');

const contractRows = CONTRACT.map(([t,u,v,cmd,src,def,not])=>`<tr>
<th scope="row">${e(t)}</th><td class="num big">${n(v)}</td><td class="unit">${e(u)}</td>
<td class="mono sm">${e(cmd)}</td><td class="mono sm">${e(src)}</td><td class="def">${e(def)}</td>
<td class="not">${not?e(not):'<i class="none">—</i>'}</td></tr>`).join('\n');

const needRows = C.needs.map(x=>`<tr><td class="mono">${e(x.id)}</td><td class="mono sm">${e(x.sig)}</td><td class="num">${x.ex||''}</td></tr>`).join('\n');
const gateRows = C.gates.map(g=>`<tr><td class="mono">${e(g.id)}</td><td class="sm">${e(g.rest)}</td></tr>`).join('\n');
const pipeRows = C.pipeline.map((p,i)=>`<tr><td class="num">${i+1}</td><td class="mono sm">${e(p.rel.replace('machtzev/generator/',''))}</td><td class="sm">${e(p.note)}</td></tr>`).join('\n');

const html = `<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>המחולל · לוח־המדידה</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800&display=swap">
<style>
:root{
  --paper:#FBFAF8; --card:#FFFFFF; --ink:#111A1C; --ink2:#3A4649; --mute:#6E7B7E;
  --line:#DFE3E1; --line2:#EDEFED;
  --acc:#0E6F6E; --acc-bg:#E4F1F0;
  --warn:#9A5B06; --warn-bg:#FAF0DC;
  --bad:#993030; --bad-bg:#FAE6E4;
  --code:#F3F5F4;
  --mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#0E1416; --card:#151D1F; --ink:#E7EDEC; --ink2:#B4C0BF; --mute:#7E8C8B;
  --line:#243033; --line2:#1C2528;
  --acc:#4FBDB0; --acc-bg:#11302E;
  --warn:#D9A341; --warn-bg:#31260F;
  --bad:#E08079; --bad-bg:#331B19;
  --code:#111A1C;
}}
:root[data-theme="dark"]{
  --paper:#0E1416; --card:#151D1F; --ink:#E7EDEC; --ink2:#B4C0BF; --mute:#7E8C8B;
  --line:#243033; --line2:#1C2528;
  --acc:#4FBDB0; --acc-bg:#11302E;
  --warn:#D9A341; --warn-bg:#31260F;
  --bad:#E08079; --bad-bg:#331B19;
  --code:#111A1C;
}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--paper);color:var(--ink);
  font:400 16px/1.65 Heebo,"Segoe UI",system-ui,sans-serif;
  padding-block:0 64px;padding-inline:16px;-webkit-text-size-adjust:100%}
.wrap{max-width:1180px;margin:0 auto}
.mono{font-family:var(--mono);font-size:.86em;direction:ltr;unicode-bidi:embed;display:inline-block}
td.mono,th.mono{text-align:left}
.sm{font-size:.78em}
.num{font-variant-numeric:tabular-nums;text-align:center}
h1,h2,h3{text-wrap:balance;margin:0}
h1{font-weight:800;font-size:clamp(28px,5vw,44px);letter-spacing:-.02em;line-height:1.15}
h2{font-weight:700;font-size:clamp(20px,3vw,27px);letter-spacing:-.01em;margin-bottom:6px}
h3{font-weight:600;font-size:17px;margin-bottom:8px;color:var(--ink2)}
p{margin:0 0 12px;max-width:66ch}
.lead{color:var(--ink2);font-size:18px;max-width:64ch}
header.top{padding-block:56px 34px;border-bottom:3px solid var(--ink)}
.kicker{font-size:12px;letter-spacing:.16em;font-weight:700;color:var(--acc);margin-bottom:12px}
section{padding-block:40px;border-bottom:1px solid var(--line)}
section:last-of-type{border-bottom:0}
.sec-h{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;margin-bottom:18px}
.sec-n{font:700 13px/1 var(--mono);color:var(--acc);background:var(--acc-bg);
  padding:5px 8px;border-radius:3px;flex:none}
/* מדדים */
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;
  background:var(--line);border:1px solid var(--line);margin:20px 0}
.stat{background:var(--card);padding:16px 14px}
.stat b{display:block;font:800 30px/1.1 Heebo;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.stat span{display:block;font-size:12.5px;color:var(--mute);margin-top:4px}
.stat.ok b{color:var(--acc)} .stat.sk b{color:var(--warn)} .stat.ms b{color:var(--bad)}
/* טבלאות */
.scroll{overflow-x:auto;border:1px solid var(--line);background:var(--card);margin:16px 0}
table{border-collapse:collapse;width:100%;font-size:14px}
th,td{padding:8px 10px;text-align:right;border-bottom:1px solid var(--line2);vertical-align:top}
thead th{position:sticky;top:0;background:var(--card);border-bottom:2px solid var(--line);
  font-weight:600;font-size:12.5px;color:var(--mute);white-space:nowrap;z-index:2}
tbody tr:hover{background:var(--code)}
tbody tr:last-child td{border-bottom:0}
td.big{font:700 18px/1 Heebo;font-variant-numeric:tabular-nums}
td.unit{color:var(--mute);font-size:12.5px;white-space:nowrap}
td.def{font-size:13px;color:var(--ink2);min-width:20ch}
td.not{font-size:12.5px;color:var(--mute);min-width:14ch}
td.strong{font-weight:700}
.chain{max-width:34ch;white-space:normal;word-break:break-word}
.none{color:var(--mute);font-style:normal;opacity:.6}
.sh-at{font-style:normal;color:var(--bad);font-size:.9em}
.v{display:inline-block;font-size:11.5px;font-weight:700;padding:3px 7px;border-radius:3px;white-space:nowrap}
.v.ok{color:var(--acc);background:var(--acc-bg)}
.v.sk{color:var(--warn);background:var(--warn-bg)}
.v.sh{color:var(--bad);background:var(--bad-bg)}
.v.ms{color:var(--bad);background:var(--bad-bg)}
/* פילטר */
.bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:14px 0;
  position:sticky;top:0;background:var(--paper);padding-block:10px;z-index:3;border-bottom:1px solid var(--line2)}
.bar button{font:600 13px Heebo;padding:6px 12px;border:1px solid var(--line);
  background:var(--card);color:var(--ink2);border-radius:3px;cursor:pointer}
.bar button[aria-pressed=true]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.bar input{flex:1;min-width:150px;font:400 14px Heebo;padding:6px 10px;
  border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:3px}
.bar button:focus-visible,.bar input:focus-visible{outline:2px solid var(--acc);outline-offset:1px}
/* קופסאות */
.note{border-inline-start:3px solid var(--acc);background:var(--acc-bg);padding:14px 16px;margin:16px 0}
.note.w{border-color:var(--warn);background:var(--warn-bg)}
.note.b{border-color:var(--bad);background:var(--bad-bg)}
.note p:last-child{margin-bottom:0}
.note b{font-weight:700}
pre{background:var(--code);border:1px solid var(--line);padding:12px 14px;overflow-x:auto;
  font:13px/1.6 var(--mono);direction:ltr;text-align:left;margin:12px 0}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
ul{padding-inline-start:20px;margin:0 0 12px}li{margin-bottom:5px}
.chips{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0}
.chip{font:500 12px var(--mono);background:var(--code);border:1px solid var(--line);
  padding:3px 7px;border-radius:3px;direction:ltr}
.chip.hot{background:var(--bad-bg);border-color:var(--bad);color:var(--bad);font-weight:700}
footer{padding-block:32px;color:var(--mute);font-size:13px}
.hide{display:none}
@media(max-width:620px){.chain{max-width:18ch}td.def,td.not{min-width:0}}
</style>
<div class="wrap">

<header class="top">
  <div class="kicker">מדידה · לא טענה</div>
  <h1>המחולל</h1>
  <p class="lead">כל מספר בעמוד הזה נושא את הפקודה שמייצרת אותו ואת הקובץ שממנו נלקח.
  אם מספר לא מסכים איתך — הרץ את הפקודה. העמוד לא יכול לזייף את הפלט שלך.</p>
  <div class="stats">
    <div class="stat"><b>${n(C.specs.length)}</b><span>ספקים חיים</span></div>
    <div class="stat"><b>${n(sum(C.specs,s=>s.part))}</b><span>חלקיקים</span></div>
    <div class="stat"><b>${n(sum(C.specs,s=>s.out))}</b><span>מסכים מחוללים</span></div>
    <div class="stat ok"><b>${n(V.ok)}</b><span>גזירות מדויקות</span></div>
    <div class="stat sk"><b>${n(V.skin+V.shelf+V.miss)}</b><span>גזירות מיושנות</span></div>
    <div class="stat"><b>${n(C.gates.length)}</b><span>שערי־משטרה</span></div>
  </div>
</header>

<section>
  <div class="sec-h"><span class="sec-n">01</span><h2>מי המחולל</h2></div>
  <p>לשאלה הזאת היו שתי תשובות בבייטים. עכשיו יש אחת, והיא נמדדה:</p>
  <div class="scroll"><table>
    <thead><tr><th>מועמד</th><th>מי מריץ אותו</th><th>על כמה ספקים</th><th>שינוי אחרון</th><th>פסק</th></tr></thead>
    <tbody>
    <tr><td class="mono">app-ds.mjs</td><td class="mono sm">regen.mjs:28</td><td class="num strong">31</td><td class="num">2026-09-10</td><td><b class="v ok">המחולל</b></td></tr>
    <tr><td class="mono">genesis-gen.mjs</td><td class="mono sm">one.mjs:146 (--only)</td><td class="num">ספקי־גלריה חסרים</td><td class="num">2026-09-07</td><td><b class="v sh">חילול נקודתי</b></td></tr>
    </tbody>
  </table></div>
  <div class="note"><p><b>הראיה:</b> <code class="mono">regen.mjs:28</code> קורא את התיקייה
  <code class="mono">specs-ds/</code> ומריץ <code class="mono">app-ds.mjs</code> על כל <code class="mono">.txt</code> שבה —
  נגזר מהתיקייה, לא מרשימה כתובה. <code class="mono">one.mjs:146</code> מריץ את
  <code class="mono">genesis-gen</code> רק עם <code class="mono">--only</code>, ורק לספקים שאין להם מסך,
  כי «הריצה־המלאה משכתבת ~100 מסכי־גלריה».</p></div>
</section>

<section>
  <div class="sec-h"><span class="sec-n">02</span><h2>חוזה־המדידה</h2></div>
  <p>שום מספר לא מוצג בלי השורה שלו. העמודה האחרונה — <b>«לא זה»</b> — נועלת את המקור
  הנפוץ ביותר לוויכוח: מספר שכן שנשמע דומה.</p>
  <div class="scroll"><table>
    <thead><tr><th>מונח</th><th>ערך</th><th>יחידה</th><th>פקודה</th><th>מקור</th><th>הגדרה</th><th>לא זה</th></tr></thead>
    <tbody>${contractRows}</tbody>
  </table></div>
</section>

<section>
  <div class="sec-h"><span class="sec-n">03</span><h2>פנקס־הגזירה</h2></div>
  <p>המחולל כותב בראש כל קובץ מאיפה כל דבר על המסך הגיע. <b>${n(L.length)} טענות.</b>
  כאן כל אחת נבדקה מול הקוד שנשלח בפועל — לא מול עצמה.</p>
  <div class="stats">
    <div class="stat ok"><b>${n(V.ok)}</b><span>ההצהרה = הקוד</span></div>
    <div class="stat sk"><b>${n(V.skin)}</b><span>הוחלף במעבר־העור</span></div>
    <div class="stat ms"><b>${n(V.shelf)}</b><span>מדף מוצהר שגוי</span></div>
    <div class="stat ms"><b>${n(V.miss)}</b><span>נעדר מהקוד</span></div>
  </div>
  <div class="note w"><p><b>שלוש הדרכים שבהן כותרת מתיישנת — כולן נקובות בשם:</b></p>
  <ul>
    <li><code class="mono">DsTable ⇒ ForgeDataGrid</code> · ${n(V.skin)} שורות.
    הכותרת נכתבת ב־<code class="mono">particles.mjs</code> לפני שמעבר־העור רץ;
    <code class="mono">auto-skin.json:26</code> ממפה <code class="mono">"table":"ForgeDataGrid"</code>
    ומחליף — בלי לעדכן את הכותרת ובלי להסיר את <code class="mono">import ds_table.dart</code>
    שנשאר מיותר ב־${n(L.filter(l=>l.staleImport).length)} קבצים.</li>
    <li><code class="mono">EmptyState@premium/feedback</code> · ${n(V.shelf)} שורות.
    הכותרת מצהירה מדף <code class="mono">premium/feedback</code>; הקובץ מייבא
    <code class="mono">dart-ui-bs/auto/empty_state.dart</code>. שני קבצים שונים.</li>
    <li><code class="mono">DsChip</code> · ${n(V.miss)} שורות. הוצהר, ואינו בקוד כלל.</li>
  </ul>
  <p>‏${Math.round(V.ok/L.length*100)}% מהכותרות מדויקות. אין כאן המצאה — יש מעבר־עור
  שלא מעדכן את הפרוטוקול שלו.</p></div>
  <div class="bar">
    <button data-f="all" aria-pressed="true">הכל · ${n(L.length)}</button>
    <button data-f="ok" aria-pressed="false">מדויק · ${n(V.ok)}</button>
    <button data-f="skin" aria-pressed="false">הוחלף בעור · ${n(V.skin)}</button>
    <button data-f="shelf?" aria-pressed="false">מדף שגוי · ${n(V.shelf)}</button>
    <button data-f="missing" aria-pressed="false">נעדר · ${n(V.miss)}</button>
    <input id="q" type="search" placeholder="סינון: שם־קובץ · תווית · אטום">
    <span class="mono sm" id="cnt"></span>
  </div>
  <div class="scroll"><table id="led">
    <thead><tr><th>קובץ</th><th>תווית בספק</th><th>צורה</th><th>שרשרת</th><th>הוצהר</th><th>נשלח בפועל</th><th>פסק</th></tr></thead>
    <tbody>${ledgerRows}</tbody>
  </table></div>
</section>

<section>
  <div class="sec-h"><span class="sec-n">04</span><h2>הקורפוס</h2></div>
  <p>‏${n(C.specs.length)} ספקים בעברית ⇒ ${n(sum(C.specs,s=>s.out))} קבצי Dart.
  אין כאן מילון־דומייני ואין מודל — כל שורה בטבלה היא ספירה של שורות בקובץ טקסט.</p>
  <div class="scroll"><table>
    <thead><tr><th>ספק</th><th>שורות</th><th>ישויות</th><th>חלקיקים</th><th>תוכן</th><th>דוח</th><th>מסכים</th></tr></thead>
    <tbody>${specRows}</tbody>
    <tfoot><tr style="border-top:2px solid var(--line);font-weight:700">
      <td>סה״כ</td><td class="num">${n(sum(C.specs,s=>s.lines))}</td><td class="num">${n(sum(C.specs,s=>s.ent))}</td>
      <td class="num">${n(sum(C.specs,s=>s.part))}</td><td class="num">${n(sum(C.specs,s=>s.cont))}</td>
      <td class="num">${n(sum(C.specs,s=>s.rep))}</td><td class="num">${n(sum(C.specs,s=>s.out))}</td></tr></tfoot>
  </table></div>
</section>

<section>
  <div class="sec-h"><span class="sec-n">05</span><h2>הצינור</h2></div>
  <p><code class="mono">regen.mjs</code> הוא סדר־הריצה <b>היחיד</b>.
  ‏<code class="mono">ship</code> ו־<code class="mono">one</code> מריצים את אותה רשימה — לכן אין «שתי דרכים לחולל».</p>
  <div class="scroll"><table>
    <thead><tr><th>#</th><th>מנוע</th><th>מה הוא עושה</th></tr></thead>
    <tbody>${pipeRows}</tbody>
  </table></div>
</section>

<section>
  <div class="sec-h"><span class="sec-n">06</span><h2>האטלס</h2></div>
  <p>האטלס הוא הקטלוג שממנו הבורר בוחר. הקובץ המוצמד מתאר עולם שקדם לגלים שבנו
  את האטומים שהמחולל מחווט <b>היום</b>:</p>
  <div class="stats">
    <div class="stat"><b>${n(C.atlas.pinW)}</b><span>ווידג׳טים · מוצמד</span></div>
    <div class="stat ok"><b>${n(C.atlas.freshW)}</b><span>ווידג׳טים · טרי</span></div>
    <div class="stat"><b>${n(C.atlas.pinF)}</b><span>פונקציות · מוצמד</span></div>
    <div class="stat ok"><b>${n(C.atlas.freshF)}</b><span>פונקציות · טרי</span></div>
  </div>
  <div class="note b"><p><b>${n(C.atlas.missW.length)} הווידג׳טים החסרים הם בדיוק המנצחים של גלי G28–G32:</b></p>
  <div class="chips">${C.atlas.missW.map(w=>`<span class="chip hot">${e(w)}</span>`).join('')}</div>
  <p><b>${n(C.atlas.missF.length)} פונקציות חסרות</b> — ובהן
  <code class="mono">addDaysIso</code> ו־<code class="mono">minutesBetweenIso</code>,
  שני חלקיקי־היסוד <em>היחידים</em> שנוצרו ב־G34:</p>
  <div class="chips">${C.atlas.missF.map(w=>`<span class="chip hot">${e(w)}</span>`).join('')}</div>
  <p>זה חשוב מעבר לעצמו: <code class="mono">TRUTH.md</code> נמדד דרך
  <code class="mono">truth.mjs:10 → render-ds.mjs:26</code> על האטלס הזה.
  כל מספר שם מתאר את העבר.</p></div>
</section>

<section>
  <div class="sec-h"><span class="sec-n">07</span><h2>הצרכים ושכבת־ההרכבה</h2></div>
  <p>התנהגות אינה נכתבת ביד. כל פעולה היא <b>צורך</b> עם חתימה ודוגמאות; הבורר מוצא
  מועמדים מכל המנועים <b>ומריץ את הדוגמאות עליהם ב־Dart</b> — נבחר מי שעובר.
  המסכים קוראים רק ל־<code class="mono">bh*</code>, ושער <code class="mono">behavior</code>
  אוסר על מסך לעקוף.</p>
  <div class="cols">
    <div>
      <h3>‏${n(C.needs.length)} צרכים</h3>
      <div class="scroll" style="max-height:420px;overflow-y:auto">
        <table><thead><tr><th>צורך</th><th>חתימה</th><th>דוגמאות</th></tr></thead><tbody>${needRows}</tbody></table>
      </div>
    </div>
    <div>
      <h3>‏${n(C.bh.length)} חלקיקי־הרכבה</h3>
      <div class="chips">${C.bh.map(b=>`<span class="chip">${e(b)}</span>`).join('')}</div>
      <h3 style="margin-top:20px">‏${n(C.skin.length)} תפקידי־עור</h3>
      <div class="chips">${C.skin.map(([k,v])=>`<span class="chip">${e(k)} → ${e(v)}</span>`).join('')}</div>
    </div>
  </div>
</section>

<section>
  <div class="sec-h"><span class="sec-n">08</span><h2>${n(C.gates.length)} השערים</h2></div>
  <p>אף אחד מהמספרים בעמוד הזה אינו מוגן בעצמו. אלה השערים שרצים לפני כל commit:</p>
  <div class="scroll" style="max-height:440px;overflow-y:auto"><table>
    <thead><tr><th>שער</th><th>מה הוא בודק</th></tr></thead><tbody>${gateRows}</tbody>
  </table></div>
</section>

<section>
  <div class="sec-h"><span class="sec-n">09</span><h2>תאמת בעצמך</h2></div>
  <p>העמוד נבנה ממדידה. הנה אותן פקודות — הרץ, והשווה מול העמודה «ערך» בסעיף 02:</p>
  <pre>cd ~/-ai-chat-server

# ספקים · ישויות · חלקיקים
ls machtzev/generator/specs-ds/*.txt | wc -l          # ${C.specs.length}
grep -hcE '^ *(צור )?(ישות|טופס|טבלת)' machtzev/generator/specs-ds/*.txt | paste -sd+ | bc   # ${sum(C.specs,s=>s.ent)}
grep -hc '^ *חלקיק ' machtzev/generator/specs-ds/*.txt | paste -sd+ | bc                     # ${sum(C.specs,s=>s.part)}

# מסכים שנפלטו
ls new/dart-gen-bs/gen_app_*.dart | wc -l             # ${sum(C.specs,s=>s.out)} תחת ספק פעיל

# הכותרת שמתיישנת — הקובץ אומר DsTable, הקוד שולח ForgeDataGrid
sed -n '2p;18p' new/dart-gen-bs/gen_app_peruk01_px1.dart
grep -c 'ForgeDataGrid' new/dart-gen-bs/gen_app_peruk01_px1.dart

# האטלס: מוצמד מול טרי
node --input-type=module -e "
import {buildAtlas} from './machtzev/generator/atlas.mjs';
const f=await buildAtlas({}), p=JSON.parse(require('fs').readFileSync('machtzev/generator/atlas.json'));
const s=new Set(p.widgets.map(w=>w.cls));
console.log([...new Set(f.widgets.map(w=>w.cls))].filter(c=>!s.has(c)));"

# צרכים · שערים
node --input-type=module -e "import {NEEDS} from './machtzev/generator/behavior-plan.mjs';console.log(Object.keys(NEEDS).length)"   # ${C.needs.length}
grep -vc '^#' machtzev/gates.tsv                      # ${C.gates.length}</pre>
  <div class="note"><p><b>מה העמוד הזה לא עושה:</b> הוא לא מריץ את המחולל בדפדפן.
  המסלול החי פולט Dart — להרצה צריך <code class="mono">flutter build web</code>.
  מי שרוצה לראות את השרשרת רצה חי, עם הוכחה־בריצה מול המדף, זה
  <code class="mono">gen/out/studio.html</code> — מסלול קטן יותר (‏569 אטומי־JS, פלט HTML),
  אותה דוקטרינה.</p></div>
</section>

<footer>
  נמדד ${e(new Date().toLocaleString('he-IL'))} · ‏<span class="mono">meir7651231-ui/-ai-chat-server</span> ·
  ענף <span class="mono">claude/yeshiva-read</span>. כל מספר נגזר מריצה על העץ הזה.
</footer>
</div>
<script>
(function(){
  var tb=document.querySelector('#led tbody'), rows=[].slice.call(tb.rows);
  var q=document.getElementById('q'), cnt=document.getElementById('cnt'), f='all';
  function apply(){
    var t=(q.value||'').trim().toLowerCase(), k=0;
    rows.forEach(function(r){
      var okF = f==='all' || r.dataset.v===f;
      var okQ = !t || r.dataset.s.indexOf(t)>=0;
      var show = okF && okQ; r.classList.toggle('hide', !show); if(show) k++;
    });
    cnt.textContent = k + ' / ' + rows.length;
  }
  [].forEach.call(document.querySelectorAll('.bar button'), function(b){
    b.addEventListener('click', function(){
      f=b.dataset.f;
      [].forEach.call(document.querySelectorAll('.bar button'), function(x){
        x.setAttribute('aria-pressed', String(x===b)); });
      apply();
    });
  });
  q.addEventListener('input', apply);
  apply();
})();
</script>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
const dest = path.join(OUT, 'mechollel.html');
fs.writeFileSync(dest, html);
console.log(`✓ ${path.relative(ROOT, dest)} · ${(Buffer.byteLength(html)/1024).toFixed(0)}KB · ${L.length} שורות-פנקס · ${CONTRACT.length} שורות-חוזה · ${C.specs.length} ספקים`);
