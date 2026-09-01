#!/usr/bin/env node
/** מפעל · מנוע-הקידום-האוטומטי — בלי נחיל, בלי טוקנים:
 *  קבוע ⇒ חוזה-צילום + בדיקת-שוויון-עמוק (אוטומטי מלא).
 *  פונקציה-טהורה ⇒ חוזה-אפיון (Golden): מריצים את הקוד-החלוץ על סל-קלטים,
 *  מקליטים פלטים דטרמיניסטיים — ההקלטה היא החוזה והבדיקה.
 *  מה שלא ניתן-לאפיון (צריך שקעים/קלט-מורכב) — נשאר לנחיל. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const ROOT = new URL('../..', import.meta.url).pathname;
const Q = ROOT + 'quarry/', A = ROOT + 'new/atoms/';
const EXCLUDE = new Set(JSON.parse(fs.readFileSync(process.argv[2] || '/dev/null', 'utf8').toString() || '[]'));
const POOL = ['123456782', '039217369', {amount: 100}, {payments: [{amount: 100}, {amount: 50}]}, {name: 'כהן', phone: '0501234567'}, [{amount: 100}], ['2026-08-24'], 3.14, 1000, 2026, '', 'אבג', 'כהן לוי', 'abc', 'a@b.com', '2026-08-24', '2026-08-24T12:00:00', '0501234567', '03-1234567', 'https://x.co', 'שלום עולם', '12', 0, 1, 2, 5, 15, 100, 786, 5786, -3, 0.5, null, undefined, true, false, [], ['א', 'ב'], {}];
const ser = (v) => { try { const s = JSON.stringify(v); return (s && s.length <= 400) ? s : null; } catch { return null; } };
let promoted = 0, residue = 0, skipped = 0;
const why = {}; const R = (k, f) => { why[k] = (why[k] || []).concat(f).slice(0, 3); residue++; };
const taken = new Set(fs.readdirSync(A).map(f => f.replace(/\..*$/, '')));

for (const file of fs.readdirSync(Q).filter(x => x.endsWith('.mjs'))) {
  if (EXCLUDE.has(file)) { skipped++; continue; }
  const kebab = file.split('@')[0].replace(/_/g, '-');
  if (taken.has(kebab)) { skipped++; continue; }
  const txt = fs.readFileSync(Q + file, 'utf8');
  if (/^import |^export \{[^}]*\} from/m.test(txt)) { R('re-export', file); continue; } // תלות ⇒ נחיל
  let mod;
  try { mod = await import(pathToFileURL(path.join(Q, file)).href); } catch (e) { R('import:' + String(e.message).slice(0, 40), file); continue; }
  const names = Object.keys(mod);
  if (!names.length) { R('no-exports', file); continue; }
  const provenance = (txt.match(/מוצא: ([^\n]+)/) || ['', '?'])[1];

  const consts = [], fns = [];
  for (const n of names) (typeof mod[n] === 'function' ? fns : consts).push(n);

  // ── קבועים: צילום ──
  if (fns.length === 0 && consts.length) {
    const snaps = {};
    let ok = true;
    for (const n of consts) { const s = ser(mod[n]); if (s == null) { ok = false; break; } snaps[n] = s; }
    if (!ok) { R('const-unserializable', file); continue; }
    fs.writeFileSync(A + kebab + '.mjs', `/** אטום-קבוע · ${kebab} — קודם אוטומטית (צילום-ערך). חוזה: ${kebab}.contract.md */\n` + txt.replace(/^\/\*\*[\s\S]*?\*\/\n/, ''));
    fs.writeFileSync(A + kebab + '.contract.md',
`# חוזה · אטום-קבוע ${kebab}\n**תפקיד:** ערך-מערכת קבוע. **התחייבות:** הערך זהה-ביט לצילום שבבדיקה.\n**ערכים:** ${consts.join(', ')}. **מוצא:** ${provenance} · קודם במנוע-האוטומטי (צילום).\n`);
    fs.writeFileSync(A + kebab + '.test.mjs',
`import * as m from './${kebab}.mjs';\nconst SNAP = ${JSON.stringify(snaps)};\nlet f = 0;\nfor (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }\nif (f) process.exit(1); console.log('✓ ${kebab}: צילום-ערך תואם — ירוק');\n`);
    taken.add(kebab); promoted++; fs.unlinkSync(Q + file); continue;
  }

  // ── פונקציות: אפיון-Golden ──
  if (fns.length === 1 && consts.length === 0) {
    const fn = mod[fns[0]];
    if (fn.constructor.name === 'AsyncFunction' || fn.length > 2) { R('fn-shape:' + fn.length, file); continue; }
    if (fn.length === 0) {
      let r1, r2; try { r1 = fn(); r2 = fn(); } catch (e) { R('getter-throw', file); continue; }
      if (r1 && typeof r1.then === 'function') { r1.catch(()=>{}); R('getter-async', file); continue; }
      const s1 = ser(r1);
      if (s1 == null || s1 !== ser(r2)) { R('getter-nondet', file); continue; }
      fs.writeFileSync(A + kebab + '.mjs', `/** חוט · ${kebab} — קודם אוטומטית (צילום-גטר). חוזה: ${kebab}.contract.md */\n` + txt.replace(/^\/\*\*[\s\S]*?\*\/\n/, ''));
      fs.writeFileSync(A + kebab + '.contract.md', `# חוזה-צילום · ${kebab}\n**שיטה:** גטר-ללא-קלט, הורץ פעמיים — פלט זהה-ביט.\n**פלט:** ${s1.slice(0,200).replace(/\n/g,' ')}\n**מוצא:** ${provenance} · מנוע-אוטומטי.\n`);
      fs.writeFileSync(A + kebab + '.test.mjs', `import { ${fns[0]} } from './${kebab}.mjs';\nif (JSON.stringify(${fns[0]}()) !== ${JSON.stringify(s1)}) { console.error('✗ סטה'); process.exit(1); }\nconsole.log('✓ ${kebab}: צילום-גטר — ירוק');\n`);
      taken.add(kebab); promoted++; fs.unlinkSync(Q + file); continue;
    }
    const cases = [];
    const argSets = fn.length === 1 ? POOL.map(a => [a]) : POOL.slice(0, 14).flatMap(a => POOL.slice(0, 14).map(b => [a, b]));
    for (const args of argSets) {
      let r1, r2;
      try { r1 = fn(...args); r2 = fn(...args); } catch { continue; }
      if (r1 && typeof r1.then === 'function') { r1.catch(()=>{}); continue; }
      if (r1 instanceof Promise) { cases.length = 0; break; }
      const s1 = ser(r1), s2 = ser(r2);
      if (s1 == null || s1 !== s2) continue; // לא-דטרמיניסטי/לא-בר-הקלטה
      cases.push([args.map(a => a === undefined ? '"__undef__"' : ser(a) ?? '"__skip__"'), s1]);
      if (cases.length >= 12) break;
    }
    const distinct = new Set(cases.map(c => c[1]));
    if (cases.length < 4 || distinct.size < 2) { R('golden-thin:' + cases.length + '/' + distinct.size, file); continue; }
    fs.writeFileSync(A + kebab + '.mjs', `/** חוט · ${kebab} — קודם אוטומטית (אפיון-Golden). חוזה: ${kebab}.contract.md */\n` + txt.replace(/^\/\*\*[\s\S]*?\*\/\n/, ''));
    fs.writeFileSync(A + kebab + '.contract.md',
`# חוזה-אפיון · חוט ${kebab}\n**שיטה:** Golden — ${cases.length} זוגות קלט⇒פלט הוקלטו מהרצת קוד-המקור עצמו (דטרמיניסטי, הורץ פעמיים).\n**התחייבות:** הפלט זהה-ביט להקלטה לכל קלט מוקלט.\n**פונקציה:** ${fns[0]} (${fn.length} ארגומנטים). **מוצא:** ${provenance} · קודם במנוע-האוטומטי.\n\n| קלט | פלט |\n|---|---|\n${cases.slice(0, 8).map(([a, o]) => '| ' + a.join(', ').replace(/\|/g, '\\|') + ' | ' + o.replace(/\|/g, '\\|') + ' |').join('\n')}\n`);
    fs.writeFileSync(A + kebab + '.test.mjs',
`import { ${fns[0]} } from './${kebab}.mjs';\nconst CASES = ${JSON.stringify(cases)};\nconst de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);\nlet f = 0;\nfor (const [args, want] of CASES) { const got = JSON.stringify(${fns[0]}(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }\nif (f) process.exit(1); console.log('✓ ${kebab}: ' + CASES.length + ' הקלטות-Golden — ירוק');\n`);
    taken.add(kebab); promoted++; fs.unlinkSync(Q + file); continue;
  }
  // מרובה-יצוא: צילום כל הקבועים + אפיון כל הפונקציות הסינכרוניות (הכול-או-כלום)
  {
    const snaps = {}; let ok = true;
    for (const n of consts) { const s = ser(mod[n]); if (s == null) { ok = false; break; } snaps[n] = s; }
    const fnCases = {};
    if (ok) for (const n of fns) {
      const fn = mod[n];
      if (fn.constructor.name === 'AsyncFunction' || fn.length > 2) { ok = false; break; }
      const sets = fn.length === 0 ? [[]] : fn.length === 1 ? POOL.map(a => [a]) : POOL.slice(0, 12).flatMap(a => POOL.slice(0, 12).map(b => [a, b]));
      const cs = [];
      for (const args of sets) {
        let r1, r2; try { r1 = fn(...args); r2 = fn(...args); } catch { continue; }
        if (r1 && typeof r1.then === 'function') { r1.catch(()=>{}); cs.length = 0; break; }
        const s1 = ser(r1); if (s1 == null || s1 !== ser(r2)) continue;
        cs.push([args.map(a => a === undefined ? '"__undef__"' : ser(a) ?? '"__skip__"'), s1]);
        if (cs.length >= 8) break;
      }
      if (cs.length < (fn.length === 0 ? 1 : 3)) { ok = false; break; }
      fnCases[n] = cs;
    }
    if (ok && (consts.length + fns.length) > 0) {
      fs.writeFileSync(A + kebab + '.mjs', `/** אטום · ${kebab} — קודם אוטומטית (צילום+אפיון מרובה-יצוא). חוזה: ${kebab}.contract.md */\n` + txt.replace(/^\/\*\*[\s\S]*?\*\/\n/, ''));
      fs.writeFileSync(A + kebab + '.contract.md', `# חוזה-אפיון · ${kebab}\n**שיטה:** צילום ${consts.length} קבועים + אפיון-Golden ${fns.length} פונקציות מהרצת-המקור.\n**מוצא:** ${provenance} · מנוע-אוטומטי.\n`);
      let t = `import * as m from './${kebab}.mjs';\nlet f = 0;\nconst SNAP = ${JSON.stringify(snaps)};\nfor (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ קבוע ' + k); f = 1; }\nconst de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);\nconst FN = ${JSON.stringify(fnCases)};\nfor (const [n, cs] of Object.entries(FN)) for (const [args, want] of cs) if (JSON.stringify(m[n](...args.map(de))) !== want) { console.error('✗ ' + n + '(' + args + ')'); f = 1; }\nif (f) process.exit(1); console.log('✓ ${kebab}: צילום+אפיון — ירוק');\n`;
      fs.writeFileSync(A + kebab + '.test.mjs', t);
      taken.add(kebab); promoted++; fs.unlinkSync(Q + file); continue;
    }
  }
  R('mixed-exports', file);
}
console.log(JSON.stringify(Object.fromEntries(Object.entries(why).map(([k,v])=>[k+' ('+v.length+'+)',v[0]])),null,1));
console.log(`מנוע-הקידום-האוטומטי: ‏${promoted} קודמו · ${residue} שאריות-לנחיל · ${skipped} דולגו`);
