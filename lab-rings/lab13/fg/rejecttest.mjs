// fg/rejecttest.mjs - time of the stage 'דקדוק' on tasks that earlier (cheaper) stages already solve.
// usage: node fg/rejecttest.mjs <out.jsonl> <bench.jsonl ...>   (rows with ok + a stage before 'דקדוק')
import fs from 'fs';
import { grammarStage } from './stage.mjs';
const EARLY = new Set(['צירוף-זוג', 'בחירה-במקום', 'מצב-רחב', 'שרשרת', 'קיפול+מיפוי', 'רצף-כלים', 'סינון', 'סינון+תנאי-נלמד', 'רצף-מקום', 'אם-רשימה', 'מסגרות-סריקה']);
const [out, ...files] = process.argv.slice(2);
const rows = files.flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l))).filter((r) => r.ok && EARLY.has(r.stage) && r.src && (r.kind === 'list2num' || r.kind === 'list2list'));
const done = new Set(fs.existsSync(out) ? fs.readFileSync(out, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l).name) : []);
for (const r of rows) {
  if (done.has(r.name)) continue;
  const t = Date.now(); const x = await grammarStage({ name: r.name, kind: r.kind, src: r.src }, { ms: 60000 });
  const row = { name: r.name, kind: r.kind, stage: r.stage, sec: (Date.now() - t) / 1000, ast: !!x.ast, tag: x.ptag || '' };
  fs.appendFileSync(out, JSON.stringify(row) + '\n'); console.log(row.sec.toFixed(2) + 's', row.ast ? 'AST' : '---', r.kind, r.stage, r.name);
}
