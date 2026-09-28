import fs from 'node:fs';
import { variants, assemble } from './pieces.mjs';
import { makeTask } from './tasks.mjs';
const vs = variants(JSON.parse(fs.readFileSync('lib2.json', 'utf8')).filter((m) => !m.name.startsWith('סוף') && !m.name.startsWith('חפש')));
const V = (label) => vs.find((v) => v.label === label) || (() => { throw new Error('missing ' + label); })();
const ps = [V('קבוע 1(0→5)'), { kind: 'דלג קדימה', jump: true, cell: 5, skip: 2 }, V('חיבור מספרים(2,5→2)'), V('קח מהכתובת שבתא(1→1)'), { kind: 'קפוץ אחורה', jump: true, cell: 1, to: 2 }];
const { g, ok } = makeTask('אורך רשימה'); console.log('a 5-piece solution exists in the space?', ok(assemble(ps)), '·', assemble(ps).length, 'steps');
