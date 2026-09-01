#!/usr/bin/env node
/** מנוע-פירוק-התצוגה — הופך את גלריית-Pure לאטומים מפורקים ורשומים (bytes-not-prose, לא נחיל).
 *  קורא כל machtzev/pure/*-family.html, מחלץ כל אטום-תצוגה (.nm = קנוני/חתימה · .chip = יורש)
 *  עם סוג-ה-seam, ופולט שלישיית-אטום מפורקת ל-new/atoms:
 *    pure-<family>-shelf.mjs  (export const · דאטה-ליטרלית · אפס-import — חוק-1/חוק-אטום)
 *    pure-<family>-shelf.contract.md · pure-<family>-shelf.test.mjs (מיובא-עצמי, ירוק)
 *  + מניפסט machtzev/generator/knowledge/pure-shelf.json (סה״כ + פר-משפחה — למחולל ולראווה).
 *  דטרמיניסטי · ניתן-להרצה-חוזרת (regen ביט-זהה) · עובר contract/wiring/purity + pure-lint.
 *  שימוש: node machtzev/pure/pure-decompose.mjs [--check]   (--check: אפס-כתיבה, נכשל אם לא-עדכני) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const ATOMS = path.join(ROOT, 'new/atoms');
const KNOW = path.join(ROOT, 'machtzev/generator/knowledge');
const CHECK = process.argv.includes('--check');

// תוכן-פלייסהולדר (§0) ותוויות-מצב — לא שמות-אטום
const SKIP = new Set(['Label', 'Value', 'Meta', 'Action', 'Option', 'Title', 'Add', 'LIVE', 'ON', 'OFF',
  'info', 'warn', 'ok', 'err', 'Live', 'New', 'More', 'See all', 'Edit', 'Skip', 'Today']);
const KINDS = ['canonical', 'signature', 'inherit'];
const clean = s => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
const isName = s => s && s.length > 1 && /[A-Za-z]/.test(s) && !SKIP.has(s) && !/^[\d.,%+\-·/ ]+$/.test(s);

function parse(html) {
  const nm = [...html.matchAll(/<span class="nm">([^<]+)<\/span>/g)].map(m => clean(m[1]));
  const seam = [...html.matchAll(/<span class="seam[^"]*">([^<]+)<\/span>/g)].map(m => clean(m[1]).toLowerCase().split(/\s/)[0]);
  const chip = [...html.matchAll(/<span class="chip">([^<]+)<\/span>/g)].map(m => clean(m[1]));
  const seen = new Set(), atoms = [];
  nm.forEach((raw, i) => {
    const parts = raw.split('·').map(x => x.trim());
    const name = parts[0];
    if (!isName(name) || seen.has(name)) return;
    seen.add(name);
    const note = parts.slice(1).join(' · ');
    atoms.push({ name, note, kind: /canonical/i.test(note) ? 'canonical' : 'signature', seam: seam[i] || 'fields' });
  });
  chip.forEach(c => { if (isName(c) && !seen.has(c)) { seen.add(c); atoms.push({ name: c, kind: 'inherit' }); } });
  return atoms;
}

const CONSTOF = fam => 'PURE_' + fam.toUpperCase().replace(/-/g, '_') + '_SHELF';
const mjsOf = (fam, data) =>
  `/** אטום-דאטה · ${fam}-shelf — פירוק משפחת-Pure "${fam}" לאטומי-תצוגה רשומים (שכבת-הפירוק).\n` +
  ` *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import\n` +
  ` *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י\n` +
  ` *  machtzev/pure/pure-decompose.mjs ממקור-האמת ${data.source} (אל תערוך ידנית — regen). */\n` +
  `export const ${CONSTOF(fam)} = ${JSON.stringify(data, null, 1)};\n`;

const contractOf = (fam, data) =>
  `# חוזה · אטום ${fam}-shelf (פירוק משפחת-Pure "${fam}")\n\n` +
  `**תפקיד:** רישום-האטומים המפורקים של משפחת-Pure **${fam}** — כל אטום-תצוגה שהוצג בגלריה\n` +
  `(${data.source}) כדאטה טהורה שהמחולל מונה ולובש. **אפס ידע-מראה באטום** (חוק-5): כאן רק\n` +
  `שם + סוג (${KINDS.join('/')}) + סוג-ה-seam; המראה מוזרק בקופסה דרך pure-look/pure-resolve (חוק-6).\n\n` +
  `**מבנה:** \`{ family, source, count, atoms:[{name, note?, kind, seam?}] }\`\n` +
  `- **קנוני/חתימה** — הגיעו מ-\`.nm\` (האטום המוצג + וריאנטיו).\n` +
  `- **יורש** — הגיעו מ-\`.chip\` (אותה תבנית, נבדל בדאטה — §3 canonical+inherit).\n\n` +
  `**התחייבויות:** ${data.count} אטומים · שמות ייחודיים ולא-ריקים · kind מ-allowlist · אפס-import\n` +
  `(חוק-1) · אפס תוכן-דומיין/₪ (§0) · regen ביט-זהה ממקור-האמת (אחרת \`--check\` אדום).\n\n` +
  `**מוצא:** ${data.source} · **מנוע:** machtzev/pure/pure-decompose.mjs · **שער:** pure-lint + police.\n`;

const testOf = (fam, data) =>
  `// בדיקת-פירוק · ${fam}-shelf — מבנה + ייחודיות + allowlist + צילום-מונה (מוטציה ⇒ אדום, L36).\n` +
  `import { ${CONSTOF(fam)} as S } from './pure-${fam}-shelf.mjs';\n` +
  `import assert from 'node:assert';\n\n` +
  `assert.deepStrictEqual(Object.keys(S), ['family', 'source', 'count', 'atoms'], 'מפתחות-על');\n` +
  `assert.strictEqual(S.family, ${JSON.stringify(fam)}, 'שם-משפחה');\n` +
  `assert.ok(Array.isArray(S.atoms) && S.atoms.length === ${data.count}, 'צילום-מונה ${data.count}');\n` +
  `assert.strictEqual(S.count, S.atoms.length, 'count תואם');\n` +
  `const KINDS = ${JSON.stringify(KINDS)};\n` +
  `for (const a of S.atoms) {\n` +
  `  assert.ok(typeof a.name === 'string' && a.name.length > 1, 'שם תקין: ' + a.name);\n` +
  `  assert.ok(KINDS.includes(a.kind), 'kind ב-allowlist: ' + a.kind);\n` +
  `  assert.ok(!/[₪€]/.test(a.name), 'אפס-מטבע: ' + a.name);\n` +
  `}\n` +
  `assert.strictEqual(new Set(S.atoms.map(a => a.name)).size, S.atoms.length, 'שמות ייחודיים');\n` +
  `console.log('OK ${fam}-shelf — ' + S.atoms.length + ' אטומים מפורקים (' +\n` +
  `  S.atoms.filter(a => a.kind !== 'inherit').length + ' קנוני/חתימה · ' +\n` +
  `  S.atoms.filter(a => a.kind === 'inherit').length + ' יורש)');\n`;

const families = fs.readdirSync(HERE).filter(f => /-family\.html$/.test(f)).map(f => f.replace('-family.html', '')).sort();
const manifest = { families: {}, total: 0, generatedBy: 'machtzev/pure/pure-decompose.mjs' };
let wrote = 0, stale = 0;
const put = (p, content) => {
  const cur = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  if (cur === content) return;
  if (CHECK) { stale++; console.error(`✗ לא-עדכני: ${path.relative(ROOT, p)}`); return; }
  fs.writeFileSync(p, content); wrote++;
};

for (const fam of families) {
  const html = fs.readFileSync(path.join(HERE, `${fam}-family.html`), 'utf8');
  const atoms = parse(html);
  const data = { family: fam, source: `machtzev/pure/${fam}-family.html`, count: atoms.length, atoms };
  put(path.join(ATOMS, `pure-${fam}-shelf.mjs`), mjsOf(fam, data));
  put(path.join(ATOMS, `pure-${fam}-shelf.contract.md`), contractOf(fam, data));
  put(path.join(ATOMS, `pure-${fam}-shelf.test.mjs`), testOf(fam, data));
  manifest.families[fam] = { count: atoms.length, canonical: atoms.filter(a => a.kind !== 'inherit').length, inherit: atoms.filter(a => a.kind === 'inherit').length };
  manifest.total += atoms.length;
}
put(path.join(KNOW, 'pure-shelf.json'), JSON.stringify(manifest, null, 2) + '\n');

if (CHECK) {
  console.log(stale ? `✗ pure-decompose: ${stale} קבצים לא-עדכניים — הרץ ללא --check` : `✓ pure-decompose: כל התוצרים עדכניים · ${manifest.total} אטומים · ${families.length} משפחות`);
  process.exit(stale ? 1 : 0);
}
console.log(`✓ pure-decompose: ${families.length} משפחות · ${manifest.total} אטומים מפורקים · ${wrote} קבצים נכתבו/עודכנו`);
for (const [f, m] of Object.entries(manifest.families)) console.log(`   ${f}: ${m.count} (${m.canonical} קנוני/חתימה · ${m.inherit} יורש)`);
