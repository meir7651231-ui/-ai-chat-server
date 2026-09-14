#!/usr/bin/env node
// gen/index-page.mjs — עמוד-שער ל-gh-pages/gen: רשימת האפליקציות שנבנו (מתוך public/<slug>/report.json) + הסטודיו. אפס דאטה ביד.
import fs from 'node:fs';
import path from 'node:path';
const dir = process.argv[2] || 'public';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const apps = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory() && fs.existsSync(path.join(dir, e.name, 'report.json')))
  .map((e) => ({ slug: e.name, r: JSON.parse(fs.readFileSync(path.join(dir, e.name, 'report.json'), 'utf8')), site: fs.existsSync(path.join(dir, e.name, 'index.html')) }));
console.log(`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>המחולל</title>
<style>body{font:16px/1.6 Heebo,Arial,sans-serif;max-width:860px;margin:0 auto;padding:24px 16px;color:#1b1a17;background:#f4f3ee}h1{margin:0 0 4px}.m{color:#6f6a5f}table{border-collapse:collapse;width:100%;margin-top:16px}td,th{padding:8px;border-bottom:1px solid #d7d2c6;text-align:right;vertical-align:top}a{color:#1f5f5b}code{background:#eeece5;padding:1px 5px;border-radius:3px;font-size:13px}</style></head><body>
<h1>המחולל</h1><div class="m">משפט בעברית ⇒ ספק ⇒ הוכחה-בריצה מול המדף ⇒ אפליקציה. אפס בינה. <a href="studio.html">הסטודיו (HTML, בדפדפן)</a> · להוסיף אפליקציה: קובץ ב-<code>gen/specs/</code> או Actions ⇒ gen ⇒ Run workflow</div>
<table><tr><th>אפליקציה</th><th>המשפט / הספק</th><th>אטומים</th><th>אתר-Flutter</th><th>הריצה</th></tr>
${apps.map(({ slug, r, site }) => `<tr><td><b>${esc(r.app)}</b><br><code>${esc(slug)}</code></td><td>${esc((r.sentence ? r.sentence.text : r.spec).trim().slice(0, 220))}</td><td>${r.atoms.length} מוכחים${r.flutter ? ` · ${r.flutter.displayAtoms.length} תצוגה` : ''}</td><td>${site ? `<a href="${esc(slug)}/">פתח</a>` : '—'}</td><td><a href="${esc(slug)}/live.html">live</a> · <a href="${esc(slug)}/log.md">log</a></td></tr>`).join('\n')}
</table></body></html>`);
