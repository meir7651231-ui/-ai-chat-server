#!/usr/bin/env node
// gen/studio.mjs — אורז את המחולל לדף אחד שרץ בדפדפן: המדף (מקור כל אטום-פונקציה + T + n), הצרכים,
// ולב-המחולל (אותם קבצים שרצים ב-Node, מודבקים בלי import/export). אתה כותב ספק — ההוכחות רצות אצלך.
//   node gen/studio.mjs  ⇒ gen/out/studio.html
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readShelf } from './shelf.mjs';
import { LIVE_CSS, LIVE_FONTS } from './live.mjs';
import { loadLang } from './lang.mjs';
import { readDartShelf, proveDart, hasDart } from './prove-dart.mjs';
import { inventory } from './inventory.mjs';
import { SKIN_CSS as _SKIN, FONTS as _FONTS, BIDI_SHAPES as _BIDI } from './skin.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8');
const strip = (src) => src.replace(/^import\s[^\n]*\n/gm, '').replace(/^export\s+(default\s+)?/gm, '');
// גשר-דפדפן: skin.mjs הוא מודול-Node (fs · import.meta) ולכן אינו נארז; שלושת הערכים ש-render.mjs מייבא ממנו נצרבים כאן.
const SKIN_PRELUDE = `// ══ skin (צרוב)\nconst SKIN_CSS = () => ${JSON.stringify(_SKIN())};\nconst FONTS = ${JSON.stringify(_FONTS)};\nconst BIDI_SHAPES = ${JSON.stringify(_BIDI)};`;
const CORE = [SKIN_PRELUDE].concat(['spec.mjs', 'sentence.mjs', 'prove.mjs', 'plan.mjs', 'render.mjs', 'live.mjs', 'engine.mjs'].map((f) => `// ══ ${f}\n${strip(read(f))}`)).join('\n\n');
const NEEDS = JSON.parse(read('needs.data.json')).needs;
const shelf = readShelf().filter((a) => a.kind === 'fn').map(({ test, params, ...a }) => a);
const example = read('specs/gemach.txt').trim();
const exampleSentence = read('specs/gemach-sentence.txt').trim();
const LANG = loadLang();
// הוכחות-Dart נארזות מראש: הצרכים קבועים, לכן התוצאה זהה לכל ספק. בדפדפן אין Dart — מוצגת התוצאה מהמסוף.
const dartShelf = hasDart() ? readDartShelf() : [];
const DART_PROOFS = {};
for (const need of NEEDS) if (dartShelf.length) { const d = proveDart(need, dartShelf); DART_PROOFS[need.id] = { tried: d.tried, proven: d.proven.map((a) => ({ name: a.name, fn: a.fn, file: a.file, params: a.params, ret: a.ret })), failed: d.failed, note: d.note || '' }; }
const INVENTORY = inventory();
const safe = (s) => s.replace(/<\/script/gi, '<\\/script').replace(/\uFFFD/g, '\\uFFFD'); // תו-ההחלפה שבאטום decode-csv-buffer נשאר כמובן, בכתיב-בריחה

const html = `<title>סטודיו המחולל</title>
${LIVE_FONTS}
<style>
${LIVE_CSS}
textarea{width:100%;min-height:160px;font:15px/1.6 Heebo,Arial,sans-serif;color:var(--ink);background:var(--code);border:1px solid var(--line);border-radius:6px;padding:10px 12px;direction:rtl;resize:vertical}
.bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}
.err{color:var(--none);white-space:pre-wrap;margin-top:8px}.grammar{font-size:13px;color:var(--mute);line-height:1.8}.grammar code{font-size:12px}
.empty{color:var(--mute);padding:10px 0}
</style>
<div class="wrap" dir="rtl" lang="he">
<div class="head"><div><h1>סטודיו המחולל</h1><div class="mute">כותבים ספק בעברית · המחולל רץ כאן בדפדפן: צרכים מצורה ⇒ הוכחה-בריצה מול המדף ⇒ אפליקציה · אפס מודל, אפס שרת</div></div>
<div class="stat"><div><b id="s-shelf">${shelf.length}</b>אטומי-JS</div><div><b>${dartShelf.length}</b>אטומי-Dart-בלבד</div><div><b>${INVENTORY.rows.reduce((a, r) => a + r.count, 0)}</b>סה"כ במלאי</div><div><b id="s-needs">${NEEDS.length}</b>צרכים ידועים</div></div></div>

<section class="step"><h2>0 · מה לבנות <span class="n">תיבה ריקה. כתוב במילים שלך. Ctrl+Enter = בנה</span></h2>
<textarea id="spec" placeholder="למשל: מעקב הוצאות: לכל הוצאה יש תיאור, סכום, תאריך וקטגוריה (אוכל, רכב, בית, אחר)
או: אפליקציה לחנות ספרים עם ספרים שיש להם כותרת, מחיר ומצב: חדש/משומש
או ספק מדויק שמתחיל ב«אפליקציה:»"></textarea>
<div class="bar"><button id="build">בנה</button><button class="ghost" id="ex">דוגמה במשפט</button><button class="ghost" id="ex2">דוגמה כספק מדויק</button><button class="ghost" id="clear">נקה</button><span class="mute" id="status"></span></div>
<div class="err" id="err" hidden></div>
<details class="grammar"><summary>דקדוק-הספק (כל מה שהמחולל מבין — אין יותר)</summary>
<div><b>משפט רגיל:</b> «X עם א, ב, ג» — פריט ברבים = ישות, ביחיד = שדה. «לכל X יש א, ב» = ישות X עם השדות. רשימת-ערכים בסוגריים או בלוכסן ⇒ ערך-מנוי. מילים כמו תאריך/סכום/טלפון ⇒ הצורה המתאימה (מדאטה). מה שלא הובן נכתב ב«הבנתי כך» — לא מנחשים בשקט.<br><b>ספק מדויק:</b> <code>אפליקציה: שם</code> — שורה ראשונה.<br><code>ישות X עם א, ב, ג</code> — שדות מופרדים בפסיק. צורת שדה נקבעת רק מסמן: <code>*</code> חובה · <code>(0..N)</code> מספר · <code>{א|ב}</code> ערך-מנוי · <code>[תאריך]</code> · <code>[טלפון]</code> · בלי סמן = טקסט.<br>
<code>לוח בקרה עם סכום(ישות.שדה), מונה(ישות.שדה)</code> — מדדים. סכום על שדה-מספר, מונה על ערך-מנוי.<br>
מה נגזר אוטומטית: מספר ⇒ תצוגת-שקלים · תאריך ⇒ תצוגה + ימים-מאז · טלפון ⇒ עיצוב · טקסט ⇒ חיפוש · ערך-מנוי ⇒ ספירה. כל אחד רק אם אטום במדף מוכיח אותו בריצה.</div></details>
</section>
<div id="out"><p class="empty">עדיין לא נבנה כלום. כתוב ספק ולחץ «בנה».</p></div>
</div>
<script>
${safe(CORE)}

// ══ הסטודיו
const NEEDS = ${safe(JSON.stringify(NEEDS))};
const SHELF = ${safe(JSON.stringify(shelf))};
const EXAMPLE = ${safe(JSON.stringify(example))};
const EXAMPLE_SENTENCE = ${safe(JSON.stringify(exampleSentence))};
const LANG = ${safe(JSON.stringify(LANG))};
const DART_PROOFS = ${safe(JSON.stringify(DART_PROOFS))};
const DART_COUNT = ${dartShelf.length};
const INVENTORY = ${safe(JSON.stringify(INVENTORY))};
const $ = (id) => document.getElementById(id);
const KEY = 'gen-studio:spec';
try { const s = localStorage.getItem(KEY); if (s) $('spec').value = s; } catch {}
$('ex').onclick = () => { $('spec').value = EXAMPLE_SENTENCE; run(); };
$('ex2').onclick = () => { $('spec').value = EXAMPLE; run(); };
document.body.addEventListener('click', (e) => { const b = e.target.closest('[data-copy-spec]'); if (!b) return; $('spec').value = b.dataset.copySpec; $('spec').scrollIntoView({ behavior: 'smooth', block: 'start' }); $('spec').focus(); });
$('clear').onclick = () => { $('spec').value = ''; $('out').innerHTML = '<p class="empty">עדיין לא נבנה כלום. כתוב ספק ולחץ «בנה».</p>'; $('err').hidden = true; try { localStorage.removeItem(KEY); } catch {} };
$('build').onclick = run;
$('spec').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) run(); });
async function run() {
  const specText = $('spec').value;
  try { localStorage.setItem(KEY, specText); } catch {}
  $('err').hidden = true;
  if (!specText.trim()) { $('err').textContent = 'הספק ריק.'; $('err').hidden = false; return; }
  $('status').textContent = 'בונה…';
  const slug = 'studio';
  try {
    const { report, app } = await runGenerator({ text: specText, slug, shelf: SHELF, NEEDS, LANG, dartProver: (need) => DART_PROOFS[need.id] || null, dartCount: DART_COUNT, inventory: INVENTORY, now: () => performance.now(),
      onStep: (s) => { if (s.step === 'proof') $('status').textContent = 'הוכחה: ' + s.proof.need + ' — נוסו ' + s.proof.tried + ', עברו ' + s.proof.proven.length; } });
    report.meta.ms = Math.round(report.meta.ms);
    $('out').innerHTML = renderLiveBody(report, app);
    $('status').textContent = 'נבנה ב-' + report.meta.ms + 'ms · ' + report.atoms.length + ' אטומים מוכחים' + (report.unproven.length ? ' · ' + report.unproven.length + ' צרכים בלי הוכחה' : '');
    $('out').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    $('status').textContent = '';
    $('err').textContent = 'הספק לא התקבל: ' + e.message;
    $('err').hidden = false;
  }
}
</script>`;
fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });
fs.writeFileSync(path.join(HERE, 'out', 'studio.html'), html);
console.log(`✓ gen/out/studio.html · ${(html.length / 1024 / 1024).toFixed(2)}MB · ${shelf.length} אטומי-פונקציה · ${NEEDS.length} צרכים`);
