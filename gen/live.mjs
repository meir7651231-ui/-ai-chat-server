// gen/live.mjs — דף-הלייב של המחולל: מה נכנס (ספק), מה נגזר (צרכים), מה הוכח (ריצה), מה הורכב (אטומים), ומה יצא (האפליקציה רצה בפנים).
import { SKIN_CSS, FONTS } from './skin.mjs';
import { esc } from './render.mjs';

const j = (v) => esc(JSON.stringify(v, (k, x) => (x && x.$fn ? `ƒ ${x.$fn}` : x)));

export function renderLiveBody(r, appHtml) {
  const shapes = { text: 'טקסט', number: 'מספר', date: 'תאריך', phone: 'טלפון', enum: 'ערך-מנוי', id: 'מזהה', formula: 'נוסחה', count: 'כמות' };
  const entities = r.entities.map((e) => `<div class="ent"><h4>${esc(e.name)}</h4><table><tr><th>שדה</th><th>צורה</th><th>חובה</th></tr>${e.fields.map((f) => `<tr><td>${esc(f.name)}</td><td><code>${f.ref ? 'קשר ⇒ ' + esc(f.ref) : f.shape === 'formula' ? '= ' + esc(f.formula) : shapes[f.shape]}${f.shape === 'enum' ? ' {' + esc(f.values.join('|')) + '}' : f.shape === 'number' ? ` ${f.min}..${f.max}` : ''}</code></td><td>${f.required ? 'כן' : ''}</td></tr>`).join('')}${e.stages && e.stages.length ? `<tr><td>שלבים</td><td colspan="2"><code>${esc(e.stages.join(' → '))}</code></td></tr>` : ''}${e.guards && e.guards.length ? `<tr><td>מעברים</td><td colspan="2">${e.guards.map((g) => `<code>${esc(g.stage)} ⇐ ${esc(g.cond)}</code>`).join(' ')}</td></tr>` : ''}${e.forbidden && e.forbidden.length ? `<tr><td>אסור</td><td colspan="2">${e.forbidden.map((x) => `<code>${esc(x)}</code>`).join(' ')}</td></tr>` : ''}${e.moment ? `<tr><td>הרגע</td><td colspan="2">${esc(e.moment)}</td></tr>` : ''}${e.screens && e.screens.length ? `<tr><td>מסך</td><td colspan="2">${esc(e.screens.join(', '))}</td></tr>` : ''}${e.fix ? `<tr><td>תיקון</td><td colspan="2">${esc(e.fix.who)}${e.fix.days ? ' עד ' + e.fix.days + ' ימים' : ''}</td></tr>` : ''}</table></div>`).join('') + ((r.roles || []).length ? `<div class="ent"><h4>תפקידים</h4><table><tr><th>תפקיד</th><th>רואה</th></tr>${r.roles.map((x) => `<tr><td>${esc(x.name)}</td><td>${x.all ? 'הכל' : esc(x.ents.join(', '))}</td></tr>`).join('')}</table></div>` : '');
  const proofs = r.proofs.map((p) => `<details class="proof ${p.chosen ? 'ok' : 'none'}" ${p.chosen ? '' : 'open'}>
<summary><span class="dot"></span><b>${esc(p.need)}</b> — ${esc(p.label)} <span class="mute">⇐ ${esc(p.usedBy.join(' · '))}</span>
<span class="tally">JS: נוסו ${p.tried} · עברו ${p.proven.length}${p.chosen ? ` · נבחר <code>${esc(p.chosen)}</code>` : ' · <em>אין אטום מוכח</em>'}${p.dart ? ` · Dart-בלבד: נוסו ${p.dart.tried} · עברו ${p.dart.proven.length}` : ''} · ${p.ms}ms</span></summary>
<div class="ex"><h5>הדוגמאות המחייבות (כל מועמד חייב לעבור את כולן בריצה)</h5><table>${p.examples.map((x) => `<tr><td><code>${j(x.args)}</code></td><td>⇒</td><td><code>${j(x.want)}</code></td></tr>`).join('')}</table></div>
<div class="ex"><h5>מי עבר</h5>${p.proven.length ? `<ol>${p.proven.map((a) => `<li><code>${esc(a.name)}</code> <span class="mute">(${a.n} ארג׳) ${esc(a.role)}${a.tSource && /-(strings|data)$/.test(a.tSource) ? ` · קבועים מאטום-הדאטה <code>${esc(a.tSource)}</code>` : ''}</span></li>`).join('')}</ol><p class="mute">הראשון נבחר: הכי פחות ארגומנטים, ואז סדר-אלפבית — שבירת-שוויון דטרמיניסטית, לא שיפוט.</p>` : '<p>אף אטום במדף לא החזיר את הפלט המבוקש בכל הדוגמאות. המחולל לא כותב קוד במקום — הצורך מוצג באפליקציה כ«אין אטום מוכח».</p>'}</div>
<div class="ex"><h5>למה נפלו (JS)</h5><p>${Object.entries(p.failedBy).map(([k, v]) => `<span class="pill">${esc(k)} ${v}</span>`).join(' ')}</p></div>
${p.dart ? `<div class="ex"><h5>שכבת-Dart — אטומים שקיימים רק ב-Dart, אותן דוגמאות, הורצו ב-Dart</h5>${p.dart.proven.length ? `<ol>${p.dart.proven.map((a) => `<li><code>${esc(a.name)}</code> <span class="mute">${esc((a.params || []).join(', '))} ⇒ ${esc(a.ret || '')} · ${esc(a.file)}</span></li>`).join('')}</ol><p class="mute">עבר את ההוכחה. לא ניתן להטביע ב-HTML (זה Dart) — זמין למסלול-Flutter.</p>` : '<p class="mute">אף אטום-Dart-בלבד לא עבר.</p>'}<p>${Object.entries(p.dart.failedBy).map(([k, v]) => `<span class="pill">${esc(k)} ${v}</span>`).join(' ')}</p>${p.dart.note ? `<p class="mute">${esc(p.dart.note)}</p>` : ''}</div>` : ''}
</details>`).join('');
  const atoms = r.atoms.map((a) => `<details><summary><code>${esc(a.name)}</code> <span class="mute">${esc(a.role)}</span> <span class="mute">· ${esc(a.file)}</span></summary><pre>${esc(a.src)}</pre></details>`).join('');
  const planRows = r.plan.map((p) => `<tr><td>${esc(p.label)}</td><td>${p.kind === 'kpi' ? 'מדד' : p.kind === 'search' ? 'חיפוש' : 'עמודה'}</td><td><code>${esc(p.needId)}</code></td><td>${r.proofs.find((x) => x.need === p.needId)?.chosen ? `<code>${esc(r.proofs.find((x) => x.need === p.needId).chosen)}</code>` : '<em>אין</em>'}</td></tr>`).join('');

  return `<div class="head"><div><h1>${esc(r.app)}</h1><div class="mute">המחולל הטהור · ספק ⇒ צרכים מצורה ⇒ הוכחה-בריצה מול המדף ⇒ הרכבה · אפס מודל</div></div>
<div class="stat"><div><b>${r.meta.shelf}</b>אטומי-JS במדף</div>${r.meta.dart ? `<div><b>${r.meta.dart}</b>אטומי-Dart-בלבד</div>` : ''}<div><b>${r.proofs.reduce((a, p) => a + p.tried, 0)}</b>ריצות-הוכחה</div><div><b>${r.atoms.length}</b>אטומים הורכבו</div><div><b>${r.unproven.length}</b>צרכים בלי הוכחה</div><div><b>${r.meta.ms}</b>ms</div></div></div>

${r.sentence ? `<section class="step spec"><h2>1 · המשפט שלך <span class="n">כמו שנכתב</span></h2><pre>${esc(r.sentence.text.trim())}</pre></section>
<section class="step spec"><h2>1½ · הבנתי כך <span class="n">מבנה בלבד — רבים=ישות, יחיד=שדה, סמן «יש/עם», רמזי-צורה מדאטה. אם טעיתי — תקן את הספק המדויק</span></h2><pre>${esc(r.spec.trim())}</pre>
${r.sentence.notes.length ? `<ul class="notes">${r.sentence.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : '<p class="mute">בלי הנחות — כל ישות קיבלה את השדות שנאמרו.</p>'}
<div class="bar"><button class="ghost" data-copy-spec="${esc(r.spec)}">פתח את הספק המדויק לעריכה</button></div>` : `<section class="step spec"><h2>1 · הספק <span class="n">מה שנכתב בעברית — הקלט היחיד</span></h2><pre>${esc(r.spec.trim())}</pre>`}
<div class="ents">${entities}</div></section>

${r.inventory ? `<section class="step"><h2>המלאי המלא <span class="n">כל שכבה בריפו, מה מחובר ואיך — ספירה, לא הערכה</span></h2>
<table><tr><th></th><th>שכבה</th><th>כמות</th><th>חיבור</th></tr>${r.inventory.rows.map((row) => `<tr><td>${row.state === 'on' ? '<span class="dot"></span>' : '<span class="dot off"></span>'}</td><td>${esc(row.layer)}</td><td class="num">${row.count}</td><td>${esc(row.connected)}</td></tr>`).join('')}</table></section>` : ''}
<section class="step"><h2>2 · צרכים שנגזרו מצורת-השדות <span class="n">אין מילון: מספר ⇒ תצוגת-כסף וסכימה · תאריך ⇒ תצוגה וימים · טלפון ⇒ עיצוב · טקסט ⇒ חיפוש · ערך-מנוי ⇒ ספירה</span></h2>
<table><tr><th>מקור בספק</th><th>שימוש</th><th>צורך</th><th>אטום שנבחר</th></tr>${planRows}</table></section>

<section class="step"><h2>3 · הוכחה-בריצה <span class="n">כל צורך הורץ מול כל ${r.meta.fns} אטומי-הפונקציה במדף (${r.meta.shelf - r.meta.fns} הנותרים הם קבועים); עובר רק מי שהחזיר בדיוק את הפלט בכל הדוגמאות</span></h2>${proofs}</section>

<section class="step"><h2>4 · האטומים שהוטבעו באפליקציה <span class="n">כלשונם מהמדף, אפס שינוי</span></h2>${atoms || '<p class="mute">אין</p>'}</section>

${r.flutter ? `<section class="step"><h2>4½ · מסלול-Flutter — אטומי-התצוגה <span class="n">אותו ספק דרך הדלת של המחצב (app-ds) ⇒ מודולי-Dart</span></h2>
${r.flutter.ok ? `<p>${r.flutter.files.length} קבצי-Dart · <b>${r.flutter.displayAtoms.length}</b> אטומי-תצוגה מחווטים · עץ-המחצב ${r.flutter.treeClean ? 'נשאר נקי' : 'לא נקי'}</p><p>${r.flutter.displayAtoms.map((a) => `<code>${esc(a)}</code>`).join(' ')}</p><p class="mute">${esc(r.flutter.compileNote)}</p>` : `<p class="notes">נכשל: ${esc(r.flutter.why || r.flutter.err)}</p>`}</section>` : ''}
<section class="step"><h2>5 · האפליקציה <span class="n">רצה כאן; הנתונים נשמרים בדפדפן שלך</span></h2>
<div class="frame"><iframe title="${esc(r.app)}" srcdoc="${esc(appHtml)}"></iframe></div></section>
<p class="mute">קובץ-הפלט: <code>gen/out/${esc(r.meta.slug)}/app.html</code> · הדוח: <code>report.json</code> · היומן: <code>log.md</code> · הרצה: <code>node gen/build.mjs gen/specs/${esc(r.meta.slug)}.txt</code></p>
`;
}

export const LIVE_CSS = SKIN_CSS() + `body{padding-block:var(--s5);padding-inline:var(--s5)}
h1{font-size:calc(var(--t-screen) + var(--s1))}
pre{direction:ltr;text-align:left;max-height:calc(var(--s7) * 7);white-space:pre}
h4,h5{margin:var(--s2) 0}
.head{display:flex;flex-wrap:wrap;gap:var(--s3) var(--s5);align-items:baseline;justify-content:space-between;margin-bottom:var(--s4)}
.head .mute{font-size:var(--t-meta)}
.ents{display:flex;flex-wrap:wrap;gap:var(--s4)}.ent{min-width:calc(var(--s1) * 65)}
details.proof summary{display:flex;flex-wrap:wrap;gap:var(--s2);align-items:baseline}
.dot{display:inline-block;width:var(--s3);height:var(--s3);border-radius:var(--r-pill);background:var(--ok);flex:none;position:relative;top:1px}
details.none .dot,.dot.off{background:var(--none)}
td.num{text-align:left}
.tally{margin-inline-start:auto;font-size:var(--t-meta);color:var(--mute)}
.ex{padding:var(--s2) var(--s4) var(--s1)}
.frame{border:1px solid var(--line);border-radius:var(--r-md);overflow:hidden;background:var(--card)}
iframe{width:100%;height:calc(var(--s7) * 15);border:0;display:block}
.spec pre{direction:rtl;text-align:right;font-family:var(--font-he);font-size:var(--t-dense);white-space:pre-wrap}
.notes{margin:var(--s2) 0;padding-inline-start:var(--s4);color:var(--none)}.notes li{margin:var(--s1) 0}
.stat{display:flex;flex-wrap:wrap;gap:var(--s3)}
.stat div{background:var(--code);border-radius:var(--r-sm);padding:var(--s2) var(--s3)}
.stat b{display:block;font-size:var(--t-screen);font-variant-numeric:tabular-nums}
@media (max-width:600px){iframe{height:calc(var(--s7) * 11)}}
`;
export const LIVE_FONTS = FONTS;

export function renderLive(r, appHtml) {
  return `<title>${esc(r.app)} · המחולל</title>\n${LIVE_FONTS}\n<style>\n${LIVE_CSS}</style>\n<div class="wrap" dir="rtl" lang="he">\n${renderLiveBody(r, appHtml)}</div>`;
}

