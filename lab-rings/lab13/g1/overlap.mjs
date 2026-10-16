// behavioural overlap of the held-out tasks with suites 2..6 (same kind, same outputs on 3000 machine lists; list2num & 15)
import fs from 'fs';
import { allLists } from '../fg/search.mjs';
const S = process.argv[2]; const ALL = allLists(); const pick = []; for (let q = 0; q < ALL.length; q += 37) pick.push(ALL[q]);
const H = ['heldout/g1held.json', 'heldout2/g1held2.json'].flatMap((f) => JSON.parse(fs.readFileSync(new URL('./' + f, import.meta.url), 'utf8')).tasks);
const sig = (t) => { const f = new Function('return (' + t.src + ')')(); return pick.map((l) => { let y; try { y = f([...l]); } catch { y = 'ERR'; } if (t.kind === 'list2num' && typeof y === 'number') y &= 15; return JSON.stringify(y); }).join('|'); };
const suites = {}; for (const s of ['suite2', 'suite3', 'suite4', 'suite5', 'suite6']) for (const f of fs.readdirSync(S + '/' + s).filter((f) => f.endsWith('.json'))) for (const t of JSON.parse(fs.readFileSync(S + '/' + s + '/' + f, 'utf8')).tasks) if (t.kind !== 'num') (suites[t.kind + sig(t)] ||= []).push(s + ':' + t.name);
let n6 = 0, n25 = 0; for (const t of H) { const m = suites[t.kind + sig(t)]; if (m) { console.log(t.name, '==', m.join(', ')); if (m.some((x) => x.startsWith('suite6'))) n6++; else n25++; } }
console.log(`held-out ${H.length}: behaviourally equal to a suite6 task: ${n6}; equal to a suite2-5 task only: ${n25}`);
