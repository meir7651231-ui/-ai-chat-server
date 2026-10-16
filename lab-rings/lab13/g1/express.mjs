// Expressiveness check of the frozen G1 productions: for each G1 production, >= 5 different non-suite6 tasks (JS reference
// functions) and a G1 AST that uses the production; the AST is evaluated by fg/grammar.mjs on EVERY valid list (all 109601
// lists of distinct values 8..15, length 0..8) and must equal the reference (list2num: & 15, as the machine's oracle).
// Sources: held-out tasks of g1/heldout/g1held.json (AST found by the machine run runs/G1-H when it used the production,
// else written by hand here) and tasks marked NEW (written after the freeze, also in g1/heldout2/g1held2.json).
// usage: node g1/express.mjs   -> prints one line per (production, task) and a per-production count
import fs from 'fs';
import { parse, compile, glob, show } from '../fg/grammar.mjs';
import { allLists } from '../fg/search.mjs';
const H = new Map(JSON.parse(fs.readFileSync(new URL('./heldout/g1held.json', import.meta.url), 'utf8')).tasks.map((t) => [t.name, t]));
const N2 = JSON.parse(fs.readFileSync(new URL('./heldout2/g1held2.json', import.meta.url), 'utf8')).tasks;
const NEW = new Map(N2.map((t) => [t.name, t]));
const FOUND = new Map(); try { for (const l of fs.readFileSync(new URL('../runs/G1-H-found.jsonl', import.meta.url), 'utf8').split('\n').filter(Boolean)) { const r = JSON.parse(l); FOUND.set(r.name, r.prog); } } catch {}
const X = (name, ast) => ({ name, ast });
const plan = {
  'agg.mean': ['ממוצע האי-זוגיים', 'ממוצע הרשימה', 'ממוצע ארבעת הראשונים', 'ממוצע מעל עשר', 'ממוצע ההפרשים', 'ממוצע במקומות הזוגיים'],
  'e.dev': ['עד הממוצע', 'הראשון מעל הממוצע', 'האחרון מתחת לממוצע', X('כמה מעל הממוצע המדויק', 'agg.len(l.filter(l.id,e.lt(e.c0,e.dev)))'), X('כמה מתחת לממוצע המדויק', 'agg.len(l.filter(l.id,e.lt(e.dev,e.c0)))')],
  'e.adev': ['מקום הרחוק מהממוצע', 'הקרוב לממוצע', 'בלי הרחוק מהממוצע', 'הרחוק מהממוצע', X('מיון לפי מרחק מהממוצע', 'l.sortBy(l.id,e.adev)')],
  'l.stackPops': ['שליפה כשהעליון גדול', 'שליפה כשהבא רחוק', 'שליפה כשהעליון קטן מ-12', 'השני שיוצא מהמחסנית', 'שליפה כשהבא זוגי', X('שליפה בזוגיות שווה', 'l.stackPops(l.id,p.eq(p.mod(p.a,p.c2),p.mod(p.b,p.c2)))')],
  'l.heapPush': ['ערימת מינימום', 'ערימה של האי-זוגיים', 'העלה האחרון בערימת מינימום', 'ילדי השורש בערימת מקסימום', X('ערימה לפי שארית ארבע', 'l.heapPush(l.id,p.lt(p.mod(p.a,p.c4),p.mod(p.b,p.c4)))')],
  'l.groupBy': ['קיבוץ לפי שארית שלוש', 'קיבוץ לפי שארית ארבע', X('קיבוץ לפי זוגיות', 'l.groupBy(l.id,e.mod(e.x,e.c2))'), X('קיבוץ לפי רבעים', 'l.groupBy(l.id,e.half(e.half(e.x)))'), X('האחרון אחרי קיבוץ זוגיות', 'agg.last(l.groupBy(l.id,e.mod(e.x,e.c2)))')],
  'e.tdep': ['גובה העץ מהסוף', 'עומק האחרון בעץ', 'השורש וילדיו', 'מיון לפי עומק יורד', 'סכום העומקים', X('כמה בעומק שתיים', 'agg.len(l.filter(l.id,e.eq(e.tdep(e.x),e.c2)))')],
  'l.knockout': ['נוקאאוט: הקטן מנצח', 'סגן האלוף', 'הודחו בסיבוב הראשון', X('נוקאאוט לפי שארית ארבע', 'l.knockout(l.id,p.le(p.mod(p.b,p.c4),p.mod(p.a,p.c4)))'), X('האלוף הזוגי', 'agg.last(l.knockout(l.id,p.or(p.eq(p.mod(p.a,p.c2),p.c0),p.eq(p.mod(p.b,p.c2),p.c1))))')],
  'l.takeUntilK': ['עד הזוגי השני', 'עד השלישי מעל 11', 'עד העלייה השנייה', 'עד השני שמעל הראשון', X('מקום הקטן מ-12 השני', 'agg.len(l.takeUntilK(l.id,e.ltK(e.x,k12),k2))')],
  'l.dropUntilK': ['מהגדול מ-10 השני', 'מהקטן מ-13 השלישי', 'מהעלייה השנייה', 'מהשני שמעל הראשון', X('מהאי-זוגי השני', 'l.dropUntilK(l.id,e.eqK(e.mod(e.x,e.c2),k1),k2)')],
  'g.cntWin3': ['שלישיות כבדות', 'קפיצה גדולה אחת', 'קפיצה ואז צעד קטן', X('פסגות', 'g.cntWin3(t.peak(p.lt(p.a,p.b)))'), X('עמקים', 'g.cntWin3(t.peak(p.lt(p.b,p.a)))'), X('שלישיות עולות', 'g.cntWin3(t.chain(p.lt(p.a,p.b)))'), X('זוגיות מתחלפת בשלישייה', 'g.cntWin3(t.chain(p.ne(p.mod(p.a,p.c2),p.mod(p.b,p.c2))))')],
  't.flip': ['קפיצה גדולה אחת', X('זוגיות כמו שכן אחד', 'g.cntWin3(t.flip(p.eq(p.mod(p.a,p.c2),p.mod(p.b,p.c2))))'), X('סכומי שכנים חוצים 24', 'g.cntWin3(t.flip(p.ltK(p.add(p.a,p.b),k24)))'), X('שלישיות לא מונוטוניות', 'g.cap15(g.cntTriples(t.flip(p.lt(p.a,p.b))))'), X('שכן אחד מאותה רביעייה', 'g.cntWin3(t.flip(p.eq(p.half(p.half(p.a)),p.half(p.half(p.b)))))')],
  't.peak': ['קפיצה ואז צעד קטן', X('פסגות', 'g.cntWin3(t.peak(p.lt(p.a,p.b)))'), X('עמקים', 'g.cntWin3(t.peak(p.lt(p.b,p.a)))'), X('שלישיות הר', 'g.cap15(g.cntTriples(t.peak(p.lt(p.a,p.b))))'), X('סוף זוג באותה זוגיות', 'g.cntWin3(t.peak(p.eq(p.mod(p.a,p.c2),p.mod(p.b,p.c2))))')],
  'p.di': ['זוגות רחוקים עוקבים', 'זוגות על האלכסון היורד', X('זוגות קרובים באותה זוגיות', 'g.cntPairs(p.and(p.lt(p.di,p.c3),p.eq(p.mod(p.a,p.c2),p.mod(p.b,p.c2))))'), X('זוגות במרחק אי-זוגי יורדים', 'g.cap15(g.cntPairs(p.and(p.lt(p.b,p.a),p.eq(p.mod(p.di,p.c2),p.c1))))'), X('זוגות במרחק שתיים עולים', 'g.cntPairs(p.and(p.eq(p.di,p.c2),p.lt(p.a,p.b)))')],
};
const ALL = allLists(); const G = ALL.map(glob);
const eq = (a, b) => (Array.isArray(a) ? Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]) : a === b);
let bad = 0; const summary = [];
for (const [prod, items] of Object.entries(plan)) {
  let ok = 0, n = 0;
  for (const it of items) {
    const name = typeof it === 'string' ? it : it.name; const t = H.get(name) || NEW.get(name); const src = t ? 'held-out' + (NEW.has(name) && !H.has(name) ? '2(NEW)' : '') : '?';
    const prog = typeof it === 'string' ? FOUND.get(name) : it.ast; n++;
    if (!t || !prog) { console.log(`MISSING ${prod} ${name}`); bad++; continue; }
    if (!prog.includes(prod)) { console.log(`NOT-USING ${prod} ${name} ${prog}`); bad++; continue; }
    const f = new Function('return (' + t.src + ')')(); const run = compile(parse(prog), []);
    let mism = null;
    for (let q = 0; q < ALL.length && !mism; q++) { const l = ALL[q]; let w = f([...l]); if (t.kind === 'list2num') w &= 15; let g; try { g = run(l, G[q]); } catch (e) { g = 'ERR ' + e.message; } if (t.kind === 'list2num' && typeof g === 'number') g &= 15; if (!eq(w, g)) mism = { l, want: w, got: g }; }
    if (mism) { bad++; console.log(`WRONG ${prod} ${name} ${prog} on ${JSON.stringify(mism)}`); } else { ok++; console.log(`OK ${prod} | ${name} | ${t.kind} | ${src} | ${prog}`); }
  }
  summary.push(`${prod}: ${ok}/${n} tasks expressed exactly`);
}
console.log('\n' + summary.join('\n') + `\nproblems: ${bad}`);
