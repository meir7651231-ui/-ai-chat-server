// gen/flutter.mjs — מסלול-התצוגה: אותו ספק ⇒ הדלת של המחצב (app-ds.mjs) ⇒ מודולי-Dart שמחווטים את אטומי-התצוגה (Flutter).
// רץ כתהליך נפרד (spawn, לא import). הפלט מופנה ל-gen/out/<slug>/flutter דרך GEN_OUT/GEN_DATA_OUT;
// שני קבצי-הצד שהדלת כותבת בתוך המחצב (apps/<ns>.json · particle-plan-<ns>.json) מועברים לכאן — עץ-המחצב נשאר ביט-זהה
// (נבדק לפני/אחרי ב-git status). קומפילציה (flutter build web) דורשת Flutter SDK ו-buildsmart — לא כאן; מדווח.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const APP_DS = path.join(ROOT, 'machtzev/generator/app-ds.mjs');

/** ספק-gen ⇒ ספק-ds: סמני-הצורה של gen ([תאריך] · [טלפון] · (a..b)) לא קיימים בדקדוק-ds — נופלים; {א|ב} ו-* נשארים */
export const toSpecDs = (specText) => specText.replace(/\[(תאריך|טלפון)\]/g, '').replace(/\(-?\d+\.\.-?\d+\)/g, '');

const dirty = () => new Set(spawnSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: ROOT, encoding: 'utf8' }).stdout.split('\n').filter(Boolean).map((l) => l.slice(3)));

export function buildFlutter(specText, slug) {
  if (!fs.existsSync(APP_DS)) return { ok: false, why: 'אין machtzev/generator/app-ds.mjs' };
  const out = path.join(HERE, 'out', slug, 'flutter'), data = path.join(out, 'data'), side = path.join(out, 'side');
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(data, { recursive: true }); fs.mkdirSync(side, { recursive: true });
  const specDs = toSpecDs(specText);
  fs.writeFileSync(path.join(out, 'spec-ds.txt'), specDs);
  const ns = 'gen' + slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  const before = dirty();
  const r = spawnSync(process.execPath, [APP_DS, '-f', path.join(out, 'spec-ds.txt'), '--name', ns], { cwd: ROOT, encoding: 'utf8', timeout: 300000, env: { ...process.env, GEN_OUT: out, GEN_DATA_OUT: data } });
  // כל קובץ שנולד מחוץ ל-gen/ בריצה הזו — מועבר לכאן (לא נמחק: הוא חלק מהתוצר)
  const moved = [];
  for (const p of dirty()) if (!before.has(p) && !p.startsWith('gen/')) { const src = path.join(ROOT, p); if (fs.existsSync(src)) { const dst = path.join(side, p.replace(/\//g, '__')); fs.renameSync(src, dst); moved.push(p); } }
  const after = [...dirty()].filter((p) => !before.has(p) && !p.startsWith('gen/'));
  const files = fs.existsSync(out) ? fs.readdirSync(out).filter((f) => f.endsWith('.dart')) : [];
  const atoms = new Set();
  for (const f of files) for (const m of fs.readFileSync(path.join(out, f), 'utf8').matchAll(/import '\.\.\/(dart-[\w-]+\/[^']+)'/g)) atoms.add(m[1]);
  const tail = (r.stdout || '').trim().split('\n').slice(-3).join('\n');
  return { ok: r.status === 0 && files.length > 0, specDs, ns, files, displayAtoms: [...atoms].sort(), moved, treeClean: after.length === 0, leftover: after, log: tail, err: r.status !== 0 ? (r.stderr || '').split('\n').slice(-5).join('\n') : '', compiled: false, compileNote: 'קומפילציה דורשת Flutter SDK + buildsmart/app_flutter — לא בסביבה הזו' };
}
