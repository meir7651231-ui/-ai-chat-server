import { swarBuild } from './tzoref-swar.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { makeChecker, loadShelf, placements } from './tzoref.mjs'; import { partTables } from './tzoref-tables.mjs'; import fs from 'fs';
const G=goals(), CFG=JSON.parse(fs.readFileSync('tzoref-config.json','utf8')); const name='שלושה שווים?'; const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const sh=loadShelf();
const only=process.argv[2].split(','); const pieces=[]; for(const b of sh.named) if(only.includes(b.name)) pieces.push(...placements(b,4000)); console.log('שיבוצים',pieces.length);
// בדיקה ידנית: האם בכלל יש פתרון מהחלקים האלה? שווה(0,1)⇒4 · שווה(1,3)⇒5 · וגם(4,5)⇒2
const P=(n,I,o)=>pieces.find(p=>p.name===n&&p.ins.join()===I.join()&&p.out===o); const a=P('שונה (מספרים)',[0,1],4), b=P('שונה (מספרים)',[1,3],5), c=P('או (מספרים)',[4,5],6), d=P('אפס?',[6],2);
if(a&&b&&c&&d){ const prog=[...a.prog,...b.prog,...c.prog,...d.prog]; console.log('פתרון ידני באורך',prog.length,'עובר?',makeChecker(gen,300)(prog)); } else console.log('חסר שיבוץ',!!a,!!b,!!c,!!d);
for(const W of [150,1500,15000]){ const t=Date.now(); const r=swarBuild(gen,{pieces,widths:[W],ms:30000,check:makeChecker(gen,300),tables:partTables(sh.named.filter(b=>!b.bad)).filter(t=>t.name!==name),ins:g.ins,lab:CFG.LAB,sw:CFG.SW,maxLen:256,lab2:+process.env.LAB2||0});
  console.log('רוחב',W,'⇒',r?.prog?`נמצא (${r.prog.length}) · ${r.used} · «שניים» ${r.twos}`:'לא',((Date.now()-t)/1000).toFixed(1),'שנ׳'); if(r?.prog) break; }
