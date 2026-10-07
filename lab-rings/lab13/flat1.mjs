import fs from 'fs'; import * as TZ from './tzoref.mjs'; import { flatten, compileDAG, countNodes, treeSize } from './tzoref-flat.mjs';
const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const blocks=new Map(sh.named.map(b=>[b.name,b])); const n=process.argv[2]; const b=blocks.get(n);
let t=Date.now(); const fl=flatten(b.expr,blocks); console.log('פריסה',Date.now()-t,'ms · עץ',treeSize(fl),'· שונים',countNodes(fl));
t=Date.now(); const p=compileDAG(fl,{ins:b.ins,out:2,blocks,placements:TZ.placements,rnd:false}); console.log('הידור',Date.now()-t,'ms',p?p.length:'נכשל'); process.exit(0);
