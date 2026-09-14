#!/usr/bin/env node
// gen/site.mjs — מפלט-Flutter של המחולל (out/<slug>/flutter) לאתר רץ. הבית: פרויקט-Flutter של buildsmart (BUILDSMART), Flutter SDK (FLUTTER).
//   1. מראה: new/dart-* של המחצב ⇒ <buildsmart>/lib/genesis (כמו ship.mjs, בלי לגעת בריפו המחצב)
//   2. קבצי-האפליקציה של המחולל ⇒ dart-gen-bs · תוכן ⇒ dart-data-bs/auto
//   3. flutter build web -t gen_app_<ns>_main.dart ⇒ out/<slug>/site (index.html בלי <base>, כדי שירוץ מכל נתיב; בלי קבצי-symbols)
// Node בלבד. אין Flutter/buildsmart ⇒ מדווח, לא נכשל בשקט.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
export const FLUTTER = process.env.FLUTTER || ['/home/user/flutter/bin/flutter'].find((p) => fs.existsSync(p)) || 'flutter';
export const BUILDSMART = process.env.BUILDSMART || ['/home/user/buildsmart/app_flutter', '/home/user/meir7651231-ui/buildsmart/app_flutter'].find((p) => fs.existsSync(path.join(p, 'pubspec.yaml'))) || '';
export const hasFlutter = () => { try { return spawnSync(FLUTTER, ['--version'], { encoding: 'utf8' }).status === 0; } catch { return false; } };

export function buildSite(slug, ns, { log = () => {} } = {}) {
  if (!BUILDSMART) return { ok: false, why: 'אין פרויקט-Flutter (BUILDSMART): buildsmart/app_flutter' };
  if (!hasFlutter()) return { ok: false, why: `אין Flutter SDK (${FLUTTER})` };
  const gen = path.join(HERE, 'out', slug, 'flutter');
  const entry = `gen_app_${ns}_main.dart`;
  if (!fs.existsSync(path.join(gen, entry))) return { ok: false, why: `אין ${entry} — הרץ קודם build עם --flutter` };
  const LIB = path.join(BUILDSMART, 'lib/genesis');
  const t0 = Date.now();
  log('מראה ⇒ ' + LIB);
  for (const d of ['dart-forge-bs', 'dart-gen-bs', 'dart-ui-bs', 'dart-maor', 'dart-boxes', 'dart-data-bs', 'dart-data-maor', 'dart', 'dart-screens-bs', 'dart-boards-bs', 'dart-data']) {   // כל שכבות-ה-Dart של המדף (main של buildsmart בלי lib/genesis)
    const s = path.join(ROOT, 'new', d); if (!fs.existsSync(s)) continue;
    fs.mkdirSync(path.join(LIB, d), { recursive: true }); fs.cpSync(s, path.join(LIB, d), { recursive: true });
  }
  for (const f of fs.readdirSync(gen)) if (f.endsWith('.dart')) fs.copyFileSync(path.join(gen, f), path.join(LIB, 'dart-gen-bs', f));
  const data = path.join(gen, 'data'); fs.mkdirSync(path.join(LIB, 'dart-data-bs/auto'), { recursive: true });
  if (fs.existsSync(data)) for (const f of fs.readdirSync(data)) if (f.endsWith('.dart')) fs.copyFileSync(path.join(data, f), path.join(LIB, 'dart-data-bs/auto', f));
  const env = { ...process.env, PATH: `${path.dirname(FLUTTER)}:${process.env.PATH}` };
  if (!fs.existsSync(path.join(BUILDSMART, '.dart_tool/package_config.json'))) { log('pub get'); const pg = spawnSync(FLUTTER, ['pub', 'get'], { cwd: BUILDSMART, env, encoding: 'utf8', timeout: 900000 }); if (pg.status !== 0) return { ok: false, why: 'pub get נכשל: ' + (pg.stderr || pg.stdout).slice(-800) }; }
  const outDir = `build/gen-${slug}`;
  log(`flutter build web -t ${entry}`);
  const r = spawnSync(FLUTTER, ['build', 'web', '--release', '--no-web-resources-cdn', '--no-wasm-dry-run', '--base-href', `/${slug}/`, '-t', `lib/genesis/dart-gen-bs/${entry}`, '-o', outDir], { cwd: BUILDSMART, env, encoding: 'utf8', timeout: 1500000, maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) return { ok: false, why: 'flutter build web נכשל', err: (r.stderr || r.stdout || '').split('\n').filter((l) => /rror|Error/.test(l)).slice(0, 8).join('\n') };
  const site = path.join(HERE, 'out', slug, 'site');
  fs.rmSync(site, { recursive: true, force: true });
  fs.cpSync(path.join(BUILDSMART, outDir), site, { recursive: true, filter: (s) => !/\.symbols$/.test(s) && !/\/NOTICES$/.test(s) });
  const idx = path.join(site, 'index.html');
  fs.writeFileSync(idx, fs.readFileSync(idx, 'utf8').replace(/<base href="[^"]*">\s*/, ''));   // בלי base ⇒ נתיבים יחסיים ⇒ רץ מכל תיקייה/קישור
  const files = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else files.push(path.relative(site, p)); } })(site);
  const bytes = files.reduce((a, f) => a + fs.statSync(path.join(site, f)).size, 0);
  return { ok: true, site: path.relative(ROOT, site), entry, files: files.length, bytes, ms: Date.now() - t0 };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const slug = process.argv[2]; if (!slug) { console.error('שימוש: node gen/site.mjs <slug>'); process.exit(2); }
  const rep = JSON.parse(fs.readFileSync(path.join(HERE, 'out', slug, 'report.json'), 'utf8'));
  const ns = rep.flutter?.ns; if (!ns) { console.error('אין flutter.ns בדוח — הרץ build עם --flutter'); process.exit(2); }
  const r = buildSite(slug, ns, { log: (s) => console.log('  ' + s) });
  console.log(r.ok ? `✓ אתר: ${r.site} · ${r.files} קבצים · ${(r.bytes / 1024 / 1024).toFixed(1)}MB · ${(r.ms / 1000).toFixed(0)}s` : `✗ ${r.why}\n${r.err || ''}`);
  process.exit(r.ok ? 0 : 1);
}
