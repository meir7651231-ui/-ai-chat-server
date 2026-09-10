// mirror.mjs <genesis-root> <app_flutter> — replicates ship.mjs step 2 (mirror) without git
import fs from 'node:fs'; import path from 'node:path';
const ROOT = process.argv[2], APP = process.argv[3]; const LIB = path.join(APP, 'lib/genesis');
const GEN = path.join(ROOT, 'new/dart-gen-bs'), DS = path.join(ROOT, 'new/dart-ui-bs/ds'), FORGE = path.join(ROOT, 'new/dart-forge-bs');
const rmTree = (d, keep) => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { rmTree(p, keep); if (!fs.readdirSync(p).length) fs.rmdirSync(p); } else if (!keep.includes(e.name)) fs.unlinkSync(p); } };
rmTree(path.join(LIB, 'dart-forge-bs'), ['HANDOFF-FORGE.md']); fs.cpSync(FORGE, path.join(LIB, 'dart-forge-bs'), { recursive: true });
const genDst = path.join(LIB, 'dart-gen-bs'); fs.mkdirSync(genDst, { recursive: true });
for (const f of fs.readdirSync(genDst)) if (/^gen_.*\.dart$/.test(f) && !fs.existsSync(path.join(GEN, f))) fs.unlinkSync(path.join(genDst, f));
for (const f of fs.readdirSync(GEN)) if (/^gen_.*\.dart$/.test(f)) fs.copyFileSync(path.join(GEN, f), path.join(genDst, f));
for (const f of fs.readdirSync(DS)) if (f.endsWith('.dart')) fs.copyFileSync(path.join(DS, f), path.join(LIB, 'dart-ui-bs/ds', f));
const syncExisting = (s, d, re = /\.dart$/) => { if (!fs.existsSync(d) || !fs.existsSync(s)) return; for (const f of fs.readdirSync(d)) if (re.test(f) && fs.existsSync(path.join(s, f))) fs.copyFileSync(path.join(s, f), path.join(d, f)); };
syncExisting(path.join(ROOT, 'new/dart-ui-bs'), path.join(LIB, 'dart-ui-bs'));
syncExisting(path.join(ROOT, 'new/dart-data-bs/auto'), path.join(LIB, 'dart-data-bs/auto'), /^gen_.*_content\.dart$/);
{ const s = path.join(ROOT, 'new/dart-data-bs/auto'), d = path.join(LIB, 'dart-data-bs/auto'); for (const f of fs.readdirSync(d)) if (/^gen_(app|balagan)_.*_content\.dart$/.test(f) && !fs.existsSync(path.join(s, f))) fs.unlinkSync(path.join(d, f)); for (const f of fs.readdirSync(s)) if (/^gen_(app|balagan)_.*_content\.dart$/.test(f)) fs.copyFileSync(path.join(s, f), path.join(d, f)); }
const DMIR = path.join(LIB, 'dart-maor'); if (fs.existsSync(DMIR)) for (const f of fs.readdirSync(DMIR)) if (f.endsWith('.dart') && fs.existsSync(path.join(ROOT, 'new/dart-maor', f))) fs.copyFileSync(path.join(ROOT, 'new/dart-maor', f), path.join(DMIR, f));
{ const gb = path.join(GEN, 'gen_behaviors.dart'); if (fs.existsSync(gb)) { const boxes = [...fs.readFileSync(gb, 'utf8').matchAll(/^import '\.\.\/(dart-boxes\/[^']+)'(?: as \w+)?;/gm)].map((m) => m[1]); for (const rel of boxes) { const src = path.join(ROOT, 'new', rel), dst = path.join(LIB, rel); if (fs.existsSync(src)) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); } } } }   // G48: boxes imported by gen_behaviors
console.log('mirrored', ROOT, '⇒', LIB);
