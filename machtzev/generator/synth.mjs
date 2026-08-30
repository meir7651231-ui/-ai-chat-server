#!/usr/bin/env node
/** 🧪 מחצב · מנוע-הסינתזה (הכרעת-בעלים: "תביא יכולות שאין — והוא יהיה חייב לחבר
 *  כמה-וכמה אטומים כדי להגיע ליכולת"): הזמנת-יכולת = תיאור + דוגמאות קלט⇒פלט.
 *  המנוע מחפש לבדו הרכבה (שרשרת עד עומק-4) של אטומים חיים שמוכיחה את כל הדוגמאות —
 *  מונחה חוש-המשמעות (קוהרנטיות-תיאור) ואז רוחב. הצלחה ⇒ spec למחולל; כישלון ⇒ דוח כן.
 *  קבצים: machtzev/generator/capabilities/<שם>.txt — שורה 1 תיאור; אחריה 'קלט => פלט'. */
import fs from 'node:fs';
import path from 'node:path';
import { buildAtlas } from './atlas.mjs';
import { buildTwinRegistry } from './twins.mjs';
const HERE = new URL('.', import.meta.url).pathname;
const CAPS = path.join(HERE, 'capabilities');
const SPECS = path.join(HERE, 'specs');

const atlas = buildAtlas();
const norm = (w) => w.replace(/^ה(?=..)/, '');
const pool = [];
{
  const seen = new Set();
  for (const f of atlas.functions) {
    if (f.params.length !== 1 || seen.has(f.name) || !f.he.length) continue;
    seen.add(f.name); pool.push(f);
  }
}
const twins = await buildTwinRegistry(pool);

function synthesize(desc, examples) {
  const dwords = new Set((desc.match(/[֐-׿]+/g) || []).map(norm));
  const cohere = (f) => f.he.reduce((n, w) => n + (dwords.has(norm(w)) ? 1 : 0), 0);
  const fns = pool.filter(f => twins.has(f.name)).sort((a, b) => cohere(b) - cohere(a));
  const inputs = examples.map(e => e.in);
  const want = examples.map(e => e.out);
  const sig = (v) => JSON.stringify(v);
  const seenV = new Set([sig(inputs)]);
  let frontier = [{ vals: inputs, path: [] }];
  for (let depth = 1; depth <= 4; depth++) {
    const next = [];
    for (const st of frontier) {
      for (const f of fns) {
        let outs;
        try { outs = st.vals.map(v => twins.get(f.name)(v)); } catch { continue; }
        if (outs.some(o => o === undefined || o === null)) continue;
        const oStr = outs.map(o => typeof o === 'string' ? o : (o instanceof Date ? o : String(o)));
        if (oStr.every((o, i) => String(o) === String(want[i]))) return [...st.path, f.name];
        if (oStr.some(o => typeof o === 'string' && (o.length > 200 || o === ''))) continue;
        const s2 = sig(oStr.map(String));
        if (seenV.has(s2)) continue;
        seenV.add(s2);
        if (next.length < 4000) next.push({ vals: outs, path: [...st.path, f.name] });
      }
    }
    frontier = next;
    if (!frontier.length) break;
  }
  return null;
}

let made = 0;
if (fs.existsSync(CAPS)) for (const cf of fs.readdirSync(CAPS).filter(x => x.endsWith('.txt'))) {
  const lines = fs.readFileSync(path.join(CAPS, cf), 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
  const desc = lines[0];
  const examples = lines.slice(1).map(l => l.split(/=>|⇒/)).filter(p => p.length === 2).map(([a, b]) => ({ in: a.trim(), out: b.trim() }));
  if (!examples.length) continue;
  const chain = synthesize(desc, examples);
  const slug = 'cap' + cf.replace(/\.txt$/, '').replace(/[^a-z0-9]/g, '');
  if (!chain) { console.log(`🧪 ${cf}: לא נמצאה הרכבה (עומק≤4) — כישלון כן`); continue; }
  const fnsBy = new Map(pool.map(f => [f.name, f]));
  const spec = [
    `${desc}:`,
    `הירו 🧪 ${desc} | יכולת שהוזמנה ולא היתה קיימת - הרכבתי אותה לבד מ-${chain.length} אטומים והוכחתי על ${examples.length} דוגמאות`,
    `אטום ChipWrap ${desc}: ${examples.map(e => e.in).join(' / ')}`,
    ...chain.map(n => `  חישוב ${(fnsBy.get(n)?.he || [n]).join(' ')} (${n})`),
    `באנר ההרכבה שמצאתי: ${chain.join(' ⟵ ')} - כל הדוגמאות עברו`,
  ].join('\n');
  fs.writeFileSync(path.join(SPECS, slug + '.txt'), spec + '\n');
  console.log(`🧪 ${cf}: ✅ הרכבה נמצאה — ${chain.join(' ∘ ')} ⇒ specs/${slug}.txt`);
  made++;
}
console.log(`🧪 סינתזה: ${made} יכולות-מוזמנות הורכבו`);
