// טעינת המכונה ב-C (WebAssembly) — אותו ממשק כמו machine3f: הקצאה פשוטה בזיכרון שלה
import fs from 'fs'; import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
const url=new URL('./machine3c.wasm',import.meta.url);
const { instance }=await WebAssembly.instantiate(fs.readFileSync(url),{}); export const W=instance.exports;
export const H=new Int32Array(W.memory.buffer);
{ const a=W.addt()>>2, s=W.shrt()>>2; for(let x=0;x<16;x++){ H[s+x]=shr4(x); for(let y=0;y<16;y++) H[a+x*16+y]=add4(x,y); } }
let top=(W.__heap_base.value+15)&~15; const LIMIT=W.memory.buffer.byteLength;
export function alloc(ints){ const p=top; top+=ints*4; top=(top+15)&~15; if(top>LIMIT) return -1; return p; }
export const MEMO=W.memo()>>2;
