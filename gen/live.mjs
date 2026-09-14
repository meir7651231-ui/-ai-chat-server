// gen/live.mjs — דף-הלייב של המחולל: מה נכנס (ספק), מה נגזר (צרכים), מה הוכח (ריצה), מה הורכב (אטומים), ומה יצא (האפליקציה רצה בפנים).
import { esc } from './render.mjs';
import fs from 'node:fs';

const j = (v) => esc(JSON.stringify(v, (k, x) => (x && x.$fn ? `ƒ ${x.$fn}` : x)));

export function renderLive(r, appHtml) {
  const shapes = { text: 'טקסט', number: 'מספר', date: 'תאריך', phone: 'טלפון', enum: 'ערך-מנוי' };
  const entities = r.entities.map((e) => `<div class="ent"><h4>${esc(e.name)}</h4><table><tr><th>שדה</th><th>צורה</th><th>חובה</th></tr>${e.fields.map((f) => `<tr><td>${esc(f.name)}</td><td><code>${shapes[f.shape]}${f.shape === 'enum' ? ' {' + esc(f.values.join('|')) + '}' : f.shape === 'number' ? ` ${f.min}..${f.max}` : ''}</code></td><td>${f.required ? 'כן' : ''}</td></tr>`).join('')}</table></div>`).join('');
  const proofs = r.proofs.map((p) => `<details class="proof ${p.chosen ? 'ok' : 'none'}" ${p.chosen ? '' : 'open'}>
<summary><span class="dot"></span><b>${esc(p.need)}</b> — ${esc(p.label)} <span class="mute">⇐ ${esc(p.usedBy.join(' · '))}</span>
<span class="tally">נוסו ${p.tried} · עברו ${p.proven.length}${p.chosen ? ` · נבחר <code>${esc(p.chosen)}</code>` : ' · <em>אין אטום מוכח</em>'} · ${p.ms}ms</span></summary>
<div class="ex"><h5>הדוגמאות המחייבות (כל מועמד חייב לעבור את כולן בריצה)</h5><table>${p.examples.map((x) => `<tr><td><code>${j(x.args)}</code></td><td>⇒</td><td><code>${j(x.want)}</code></td></tr>`).join('')}</table></div>
<div class="ex"><h5>מי עבר</h5>${p.proven.length ? `<ol>${p.proven.map((a) => `<li><code>${esc(a.name)}</code> <span class="mute">(${a.n} ארג׳) ${esc(a.role)}</span></li>`).join('')}</ol><p class="mute">הראשון נבחר: הכי פחות ארגומנטים, ואז סדר-אלפבית — שבירת-שוויון דטרמיניסטית, לא שיפוט.</p>` : '<p>אף אטום במדף לא החזיר את הפלט המבוקש בכל הדוגמאות. המחולל לא כותב קוד במקום — הצורך מוצג באפליקציה כ«אין אטום מוכח».</p>'}</div>
<div class="ex"><h5>למה נפלו</h5><p>${Object.entries(p.failedBy).map(([k, v]) => `<span class="pill">${esc(k)} ${v}</span>`).join(' ')}</p></div>
</details>`).join('');
  const atoms = r.atoms.map((a) => `<details><summary><code>${esc(a.name)}</code> <span class="mute">${esc(a.role)}</span> <span class="mute">· ${esc(a.file)}</span></summary><pre>${esc(fs.readFileSync(a.file.startsWith('/') ? a.file : new URL('../' + a.file, import.meta.url), 'utf8'))}</pre></details>`).join('');
  const planRows = r.plan.map((p) => `<tr><td>${esc(p.label)}</td><td>${p.kind === 'kpi' ? 'מדד' : p.kind === 'search' ? 'חיפוש' : 'עמודה'}</td><td><code>${esc(p.needId)}</code></td><td>${r.proofs.find((x) => x.need === p.needId)?.chosen ? `<code>${esc(r.proofs.find((x) => x.need === p.needId).chosen)}</code>` : '<em>אין</em>'}</td></tr>`).join('');

  return `<title>${esc(r.app)} · המחולל</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap">
<style>
:root{--bg:#f4f3ee;--ink:#1b1a17;--mute:#6f6a5f;--line:#d7d2c6;--card:#fbfaf7;--acc:#1f5f5b;--ok:#2d7a3a;--none:#a33d1a;--code:#eeece5}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#141518;--ink:#ebe8e0;--mute:#a09b8f;--line:#2f3238;--card:#1c1e22;--acc:#62c2ba;--ok:#6fcf7c;--none:#f08a5b;--code:#101114}}
:root[data-theme=dark]{--bg:#141518;--ink:#ebe8e0;--mute:#a09b8f;--line:#2f3238;--card:#1c1e22;--acc:#62c2ba;--ok:#6fcf7c;--none:#f08a5b;--code:#101114}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 Heebo,Arial,sans-serif;direction:rtl;padding-block:20px;padding-inline:20px}
code,pre{font-family:"JetBrains Mono",Consolas,monospace;font-size:12.5px}code{background:var(--code);padding:1px 5px;border-radius:3px}pre{background:var(--code);padding:10px;border-radius:5px;overflow-x:auto;direction:ltr;text-align:left;max-height:340px}
h1{font-size:26px;margin:0}h2{font-size:18px;margin:0 0 10px;display:flex;gap:10px;align-items:baseline}h2 .n{font-size:13px;color:var(--mute);font-weight:400}h4,h5{margin:6px 0}
.wrap{max-width:1180px;margin:0 auto}.head{display:flex;flex-wrap:wrap;gap:10px 24px;align-items:baseline;justify-content:space-between;margin-bottom:18px}.head .mute{font-size:13px}
.mute{color:var(--mute)}.step{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 16px;margin:12px 0}
table{border-collapse:collapse}td,th{padding:4px 8px;border-bottom:1px solid var(--line);text-align:right;vertical-align:top}th{color:var(--mute);font-weight:500;font-size:13px}
.ents{display:flex;flex-wrap:wrap;gap:16px}.ent{min-width:260px}
details.proof{border-top:1px solid var(--line);padding:8px 0}details.proof summary{cursor:pointer;display:flex;flex-wrap:wrap;gap:8px;align-items:baseline}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--ok);flex:none;position:relative;top:1px}details.none .dot{background:var(--none)}
.tally{margin-inline-start:auto;font-size:13px;color:var(--mute)}.ex{padding:6px 18px 4px}.pill{display:inline-block;background:var(--code);border-radius:99px;padding:0 9px;font-size:12.5px;margin:2px}
.frame{border:1px solid var(--line);border-radius:8px;overflow:hidden;background:#fff}iframe{width:100%;height:720px;border:0;display:block}
.spec pre{direction:rtl;text-align:right;font-family:Heebo,Arial,sans-serif;font-size:14px}
.stat{display:flex;flex-wrap:wrap;gap:12px}.stat div{background:var(--code);border-radius:6px;padding:8px 14px}.stat b{display:block;font-size:20px;font-variant-numeric:tabular-nums}
@media (max-width:600px){iframe{height:560px}}
</style>
<div class="wrap">
<div class="head"><div><h1>${esc(r.app)}</h1><div class="mute">המחולל הטהור · ספק ⇒ צרכים מצורה ⇒ הוכחה-בריצה מול המדף ⇒ הרכבה · אפס מודל</div></div>
<div class="stat"><div><b>${r.meta.shelf}</b>אטומים במדף</div><div><b>${r.proofs.reduce((a, p) => a + p.tried, 0)}</b>ריצות-הוכחה</div><div><b>${r.atoms.length}</b>אטומים הורכבו</div><div><b>${r.unproven.length}</b>צרכים בלי הוכחה</div><div><b>${r.meta.ms}</b>ms</div></div></div>

<section class="step spec"><h2>1 · הספק <span class="n">מה שנכתב בעברית — הקלט היחיד</span></h2><pre>${esc(r.spec.trim())}</pre>
<div class="ents">${entities}</div></section>

<section class="step"><h2>2 · צרכים שנגזרו מצורת-השדות <span class="n">אין מילון: מספר ⇒ תצוגת-כסף וסכימה · תאריך ⇒ תצוגה וימים · טלפון ⇒ עיצוב · טקסט ⇒ חיפוש · ערך-מנוי ⇒ ספירה</span></h2>
<table><tr><th>מקור בספק</th><th>שימוש</th><th>צורך</th><th>אטום שנבחר</th></tr>${planRows}</table></section>

<section class="step"><h2>3 · הוכחה-בריצה <span class="n">כל צורך הורץ מול כל ${r.meta.fns} אטומי-הפונקציה במדף (${r.meta.shelf - r.meta.fns} הנותרים הם קבועים); עובר רק מי שהחזיר בדיוק את הפלט בכל הדוגמאות</span></h2>${proofs}</section>

<section class="step"><h2>4 · האטומים שהוטבעו באפליקציה <span class="n">כלשונם מהמדף, אפס שינוי</span></h2>${atoms || '<p class="mute">אין</p>'}</section>

<section class="step"><h2>5 · האפליקציה <span class="n">רצה כאן; הנתונים נשמרים בדפדפן שלך</span></h2>
<div class="frame"><iframe title="${esc(r.app)}" srcdoc="${esc(appHtml)}"></iframe></div></section>
<p class="mute">קובץ-הפלט: <code>gen/out/${esc(r.meta.slug)}/app.html</code> · הדוח: <code>report.json</code> · היומן: <code>log.md</code> · הרצה: <code>node gen/build.mjs gen/specs/${esc(r.meta.slug)}.txt</code></p>
</div>`;
}
