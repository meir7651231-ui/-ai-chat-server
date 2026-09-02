// 🔬 pixel-forge-audit · gen-orig — מצייר את כל אטומי-ה-Pure (המקור) ל-PNG דרך Playwright,
// וכותב אינדקס-אטומים ל-shots/index.json (עבור מחולל-ה-Dart והדיף). זהה-מסגור ל-FORGE (438/pad16/2x).
import fs from 'node:fs';
import path from 'node:path';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { allAtoms, frameOrig, SHOTS, key } from './lib.mjs';

const only = process.argv.slice(2).filter(a => !a.startsWith('-'));
const atoms = allAtoms().filter(a => !only.length || only.includes(a.family));
const origDir = path.join(SHOTS, 'orig'); fs.mkdirSync(origDir, { recursive: true });

fs.writeFileSync(path.join(SHOTS, 'index.json'), JSON.stringify(atoms.map(a => ({ family: a.family, slug: a.slug, cls: a.cls, name: a.name, seam: a.seam, theater: a.theater })), null, 2));

const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--disable-lcd-text', '--font-render-hinting=none'] });
let i = 0;
for (const a of atoms) {
  const p = await b.newPage({ viewport: { width: 560, height: 1400 }, deviceScaleFactor: 2 });
  try {
    await p.setContent(frameOrig(a.family, a.origBody), { waitUntil: 'load' });
    await p.waitForTimeout(400);
    await p.locator('.t-indigo').first().screenshot({ path: path.join(origDir, `${key(a)}.png`) });
  } catch (e) { console.error('MISS orig', key(a), e.message); }
  await p.close();
  if (++i % 25 === 0) console.log(`  orig ${i}/${atoms.length}`);
}
await b.close();
console.log(`✓ gen-orig: ${atoms.length} אטומי-מקור ⇒ ${origDir}`);
