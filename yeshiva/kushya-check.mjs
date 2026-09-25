#!/usr/bin/env node
// ⚖️⇒🔎 בדיקת מרכז-הקושיות (הכרעת-בעלים 25.9): קושיה ממהלך-חיפוש שמודפסת בלי שחיפוש רץ = אדום.
//   (1) על קורפוס-זעיר: «אין לי אלא» ⇒ corpus חיפש ומצא את הכלל · «כגון» ⇒ חיפש · (2) בלי קורפוס ⇒ noSource מוצהר, לא שקט
//   (3) מחפש רשום שלא רץ ואין סיבה ⇒ unsearched תופס. exit 1 על כל כשל.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import * as KU from './kushya.mjs'; import * as KS from './kushya-sources.mjs';
KS.registerAll(KU);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kush-')); const out = fs.mkdtempSync(path.join(os.tmpdir(), 'kusho-'));
fs.writeFileSync(path.join(dir, 'a.md'), 'נקודות איסוף: 3 ילדים ב-40 דקות → תגבור מתנדבות.\n4 אוטובוסים מאחרים → שחרור שאטלים.\n');
fs.writeFileSync(path.join(dir, 'b.md'), 'ילד שלא נאסף עד 01:00 → משטרה.\n5 ילדים אבודים → תגבור נקודה.\n');
const K = [{ kind: 'אין לי אלא', text: 'מה שנאמר מכסה רק…' }, { kind: 'רש"י', text: 'כגון: תן דוגמה' }, { kind: 'ותסברא', text: 'המסקנה סבירה?' }];
const fails = [];
const a = await KU.answerAll(K, { answers: { __corpus: dir, __docEnts: ['נקודה'], __subjects: ['ילדים'] }, outDir: out, notes: [] });
if (!a[0].searched.includes('corpus') || !(a[0].found || []).some((f) => f.rules > 0)) fails.push('«אין לי אלא» לא הפעיל חיפוש בתרחישים / לא מצא את הכלל');
if (!a[1].searched.includes('corpus')) fails.push('«כגון» (בראש-הטקסט) לא הפעיל חיפוש');
if (a[2].why !== 'noSearcher') fails.push('מהלך בלי מחפש חייב להיות מוצהר noSearcher');
const b = await KU.answerAll(K.slice(0, 1), { answers: {}, outDir: out, notes: [] });
if (b[0].why !== 'noSource') fails.push('בלי קורפוס — חייב noSource מוצהר (לא שקט)');
if (KU.unsearched([{ kind: 'x', searched: [], why: null }]).length !== 1) fails.push('unsearched לא תופס קושיה שלא חיפשה');
if (KU.unsearched([...a, ...b]).length) fails.push(`קושיות בלי חיפוש: ${KU.unsearched([...a, ...b]).map((x) => x.kind).join(', ')}`);
fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(out, { recursive: true, force: true });
if (fails.length) { for (const f of fails) console.error('🚨 kushya: ' + f); process.exit(1); }
console.log(`✓ kushya: ${KU.searchers().length} מקורות רשומים (${KU.searchers().map((s) => s.name).join(' · ')}) · כל קושיית-חיפוש חיפשה או הצהירה למה לא`);
