#!/usr/bin/env node
/** מחצב · מנוע-פירוק-מסכים — קלט: קובץ-מסך Flutter ⇒ פלט: מניפסט-שכבות JSON.
 *  חוזה: SCREEN-DECOMP-CONTRACT.md. דטרמיניסטי, קריאה-בלבד, אפס-LLM.
 *  שכבות: 0-פיגמנטים · 1-מונחים · 2-אייקונים · 3-מועמדי-לוגיקה · 4/5-חוטי-תצוגה
 *  וסקציות (כולל קריאות/פעולות פר-widget) · 6-קומפוזר · 7-שקעי-לוח.
 *  שימוש: node screen-decomp.mjs <file.dart> [--json out.json] */
import fs from 'node:fs';
import { rminhu, had, pliga, lo } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
// ── מצב-חציבה על תיקייה (G64): מריץ את המנוע הזה על כל קובץ ומאחד את שכבה-8 ⇒ אטום-דאטה.
// self-invoke ולא מנוע-שני: אותה חציבה בדיוק, פעם לכל קובץ (יקום סגור).
if (process.argv[2] === '--carve-dir') {
  const { execFileSync } = await import('node:child_process');
  const os = await import('node:os');
  const oi = process.argv.indexOf('--out');
  const out = oi > 0 ? process.argv[oi + 1] : null;
  const dirs = process.argv.slice(3).filter((a, i) => !a.startsWith('--') && (oi < 0 || i + 3 !== oi + 1));
  const walk = (d) => { let o = []; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const q = d + '/' + e.name; if (e.isDirectory()) o = o.concat(walk(q)); else o.push(q); } return o; };
  const rows = []; const scanned = [];
  for (const d of dirs) {
    if (!fs.existsSync(d)) { scanned.push({ dir: d, files: 0, entities: 0, note: 'לא קיים' }); continue; }
    const files = walk(d).sort(); let n = 0;
    for (const f of files) {
      const tmp = os.tmpdir() + '/sd-' + process.pid + '.json';
      try { execFileSync(process.execPath, [process.argv[1], f, '--json', tmp], { stdio: 'ignore' }); } catch { continue; }
      let m; try { m = JSON.parse(fs.readFileSync(tmp, 'utf8')); } catch { continue; }
      for (const e of m.entities || []) { rows.push(e); n++; }
    }
    scanned.push({ dir: d, files: files.length, entities: n });
  }
  const data = {
    source: 'machtzev/carve/screen-decomp.mjs --carve-dir (שכבה 8)',
    note: 'ישות-עם-שקעים מהמסך, עם מוצא. he=null ⇒ מתג-לבעלים: המונח-העברי אינו מוצהר באף מקור ואינו מנוחש (§20-ג · L57).',
    scanned, entities: rows,
  };
  if (out) fs.writeFileSync(out, JSON.stringify(data, null, 1) + '\n');
  console.log(`🪨 חציבת-ישויות · ${rows.length} ישויות · ${rows.reduce((a, e) => a + e.fields.length, 0)} שקעים · מונח מוצהר ${rows.filter((e) => e.he).length}/${rows.length}`);
  for (const sc of scanned) console.log(`   ${sc.dir}: ${sc.files} קבצים ⇒ ${sc.entities} ישויות${sc.note ? ' (' + sc.note + ')' : ''}`);
  if (out) console.log(`   ⇒ ${out}`);
  process.exit(0);
}

const file = process.argv[2];
if (!file) { console.error('שימוש: screen-decomp.mjs <screen.dart>'); process.exit(1); }
const src = fs.readFileSync(file, 'utf8');
const lines = src.split('\n');

// ── עזרי-סריקה ──
const uniq = (a) => [...new Set(a)].sort();
const grab = (re, g = 0, flags = 'g') => { const out = []; let m; const r = new RegExp(re, flags); while ((m = r.exec(src))) out.push(m[g]); return out; };

// חילוץ-גוף לפי איזון-סוגריים מהצהרת-מחלקה/פונקציה
function bodyOf(startIdx) {
  let i = src.indexOf('{', startIdx); if (i < 0) return ['', startIdx, startIdx];
  let d = 0, j = i;
  for (; j < src.length; j++) { if (src[j] === '{') d++; else if (src[j] === '}') { d--; if (!d) break; } }
  return [src.slice(i, j + 1), i, j];
}
const lineAt = (idx) => src.slice(0, idx).split('\n').length;

// ── שכבה 0 · פיגמנטים ──
const pigments = {
  tokens: uniq(grab('BsTokens\\.[A-Za-z0-9_]+')),
  themeSockets: uniq(grab('\\b(cfgRadius|Theme\\.of)\\b', 1)),
  fontSizes: uniq(grab('fontSize:\\s*([0-9.]+)', 1)).map(Number).sort((a, b) => a - b),
  fontWeights: uniq(grab('FontWeight\\.w?([0-9a-z]+)', 0)),
  opacities: uniq(grab('withOpacity\\(([^)]+)\\)', 1)),
  iconSizes: uniq(grab('Icon\\([^)]*size:\\s*([0-9.]+)', 1)).map(Number),
  roleRecord: /typedef\s+_?Pal|\(\{Color/.test(src), // חיווט-תפקידי-צבע (חוק-3)
};

// ── שכבה 1 · מונחים (מחרוזות עם עברית; אינטרפולציה ⇒ תבנית) ──
// קוד-בלבד + מודע-escapes (29.8): הערות אינן מונחים; \n בתוך מחרוזת אינו מסתור
const srcCode = src.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
const heStrings = uniq([...srcCode.matchAll(/'((?:[^'\\\n]|\\.)*[֐-׿](?:[^'\\\n]|\\.)*)'/g)].map(x => x[1]));

// ── שכבה 2 · אייקונים + גליפים ──
const icons = uniq(grab('Icons\\.[a-z_]+'));
const glyphs = uniq(grab('[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}]', 0, 'gu'));

// ── שכבות 4/5 · מחלקות-widget + גוף-כל-אחת ──
const widgetDecl = /class\s+(_?[A-Za-z0-9]+)\s+extends\s+(StatelessWidget|StatefulWidget|ConsumerWidget|ConsumerStatefulWidget)/g;
const widgets = []; let m;
while ((m = widgetDecl.exec(src))) {
  const [body] = bodyOf(m.index);
  // הסריקה על קוד-בלבד: הערות מוסרות (הערת-doc עם עברית-במרכאות ≠ דאטה; L1 29.8)
  const code = body.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
  const reads = uniq([...code.matchAll(/\b(?:watch|read)\(\s*([a-zA-Z0-9_]+Provider)/g)].map(x => x[1]));
  const writes = uniq([...code.matchAll(/([a-zA-Z0-9_]+Provider)(?:\.notifier)?\)\s*\.(?:state\s*=|add\(|set[A-Z])/g)].map(x => x[1]));
  const navs = uniq([
    ...[...code.matchAll(/=>\s*(?:const\s+)?([A-Z][A-Za-z0-9]+Screen)\(/g)].map(x => 'nav:' + x[1]),
    ...[...code.matchAll(/\b(open[A-Z][A-Za-z0-9]*|show[A-Z][A-Za-z0-9]*Sheet)\b/g)].map(x => 'call:' + x[1]),
  ]);
  // מודע-escapes: מחרוזת עם \n/\' לא מתחמקת מהסורק (הבאג שנתפס ע"י shelf-lift 29.8)
  const strs = uniq([...code.matchAll(/'((?:[^'\\\n]|\\.)*[֐-׿](?:[^'\\\n]|\\.)*)'/g), ...code.matchAll(/"((?:[^"\\\n]|\\.)*[֐-׿](?:[^"\\\n]|\\.)*)"/g)].map(x => x[1]));
  const hasToast = /toast|Toast/.test(code);
  const constData = [...code.matchAll(/const\s+\w*\s*=?\s*[\[{]/g)].length;
  widgets.push({
    name: m[1], kind: m[2], line: lineAt(m.index), loc: body.split('\n').length,
    pure: reads.length + writes.length + navs.length === 0 && !hasToast,
    dataClean: strs.length === 0,            // 🧼 אפס-דאטה-צרובה (מונחים/תוכן) — הכרעת-הבעלים "אטומים נקיים"
    reads, writes, actions: [...navs, ...(hasToast ? ['fx:toast'] : [])], strings: strs.length, constData,
  });
}

// ── שכבה 3 · מועמדי-לוגיקה (פונקציות/מחלקות שאינן widget, בלי BuildContext-ציור) ──
const logicCandidates = [];
const fnDecl = /(?:^|\n)(?:[A-Za-z_<>\[\]? ]+\s)?(_?[a-z][A-Za-z0-9]*)\s*\(([^)]*)\)\s*(?:=>|\{)/g;
while ((m = fnDecl.exec(src))) {
  const name = m[1];
  if (['if', 'for', 'while', 'switch', 'catch', 'build'].includes(name)) continue;
  const [body] = bodyOf(m.index + 1);
  const impure = /\b(watch|read)\(|Navigator|setState/.test(body);
  const mathy = /\bclamp\(|\bswitch\s*\(|[*\/+-]\s*[0-9.]|\?\s*[0-9.]/.test(body);
  if (!impure && mathy && body.length < 1200 && !/Widget|BuildContext ?[a-z]/.test(m[0] + body.slice(0, 80)))
    logicCandidates.push({ name, line: lineAt(m.index) });
}
// מחלקות-חישוב (לא-widget, שדות+getters מספריים)
for (const cm of src.matchAll(/class\s+(_?[A-Za-z0-9]+)\s*\{/g)) {
  const [body] = bodyOf(cm.index);
  if (/double\s+get|final\s+(?:int|double|bool)/.test(body) && !/extends|Widget/.test(src.slice(cm.index, cm.index + 80)))
    logicCandidates.push({ name: cm[1], line: lineAt(cm.index), kind: 'metrics-class' });
}

// ── שכבה 6 · קומפוזר: מיפוי-סקציות (switch section⇒widget) + מנוע-הסדר ──
const sectionMap = [...src.matchAll(/([A-Za-z]+)\.([a-zA-Z]+)\s*=>\s*(?:[a-zA-Z]+\s*\?\s*)?(?:const\s+)?\[?\s*_?([A-Z][A-Za-z0-9]+)\(\)/g)]
  .filter(x => x[3] !== 'SizedBox').map(x => ({ section: x[2], widget: '_' + x[3].replace(/^_/, '') }));
const composer = widgets.filter(w => /for\s*\(\s*final|visibleIds|\.map\(/.test(src.slice(src.indexOf('class ' + w.name), src.indexOf('class ' + w.name) + 3000)) && w.reads.length)
  .map(w => w.name);
const gates = uniq(grab('\\b(k[A-Z][A-Za-z]+|modOn\\([^)]+\\)|featOn\\([^)]+\\))\\b'));

// ── שכבה 7 · שקעי-לוח מצרפיים ──
// ── שכבה 8 · ישויות (G64) · מחלקת-שורה = ישות-עם-שקעים, עם מוצא ─────────────
// למה כאן ולא ב-atom-index/oracle: אלה אינדקסי-**אטומים** (ווידג׳ט/פונקציה), ושרשרת
// `classOf` אינה קוראת אותם כלל (נמדד: 0 הפניות). המקום של ישות-עם-שקעים הוא
// מנוע-פירוק-המסך, שכבר מפרק את המסך — ומכאן היא נכנסת לשרשרת דרך tzinor.
// **המונח-העברי אינו נחצב כאן.** הוא אינו מוצהר באף מקור (ורמינהו · 40 מקורות,
// כולם אתרי-חיווט), והסקתו מתדירות-מחרוזות היא ניחוש-לפי-מחרוזת — בדיוק משפחת
// הבאגים שהאינדקס נבנה כדי למנוע. ישות בלי מונח יוצאת כ-**מתג-לבעלים** (§20-ג · L57).
// ── 🔤 **שתי אוצרות-מילים לאותו שדה** — הפער ש-w-wall-130 מדד (18.9) ──────────
//  החציבה מצהירה את טיפוס-**Dart** (`int` · `String` · `bool`), והקושר-שקעים
//  שבמורד-הזרם (`yeshiva/purpose.mjs:TYPE_SHAPE`) קורא אוצר-**סכמה**
//  (`number` · `IsoDate` · `boolean` — כך `schema-fields.mjs` מצהיר).
//  ‏`/number/i.test('int')` = false, ולכן שקע-מספר של ישות-מסך **אינו נקשר לעולם**:
//  גם אם הבעלים היה נותן מונח-עברי לכל 29 הישויות, אף יחידה לא הייתה זזה משלב-1.
//  זו בדיוק מחלקת-התקלה של L56 («השוואת סטים משני אוצרות») ושל L110 («התאמה לפי
//  שם שזכרתי במקום לפי המקור המוצהר») — לא חֶסֶר-יכולת, חוסם.
//
//  הגשר **נגזר משני מקורות מוצהרים שכבר בריפו**, אפס טבלה-חדשה במנוע (L57):
//    • `machtzev/generator/entity.mjs:127`  TYPE_IN — טיפוס-אפיון ⇒ טיפוסי-Dart שהוא מקבל
//    • `machtzev/generator/sentence.mjs:79` T2      — טיפוס-אפיון ⇒ טיפוס-סכמה
//  ההיפוך: טיפוס-Dart ⇒ אילו טיפוסי-אפיון מקבלים אותו. **יחיד ⇒ נגזר**
//  (‏`int`/`double`/`num` ⇒ num ⇒ `number` · `DateTime` ⇒ date ⇒ `IsoDate`).
//  **כמה ⇒ אינו נגזר** (‏`String` מתקבל ע"י date·num·text·multiline — ארבעה):
//  בחירה ביניהם היא הכרעה-במנוע, ו-L114 אוסר אותה ⇒ `shape:null` עם הסיבה.
//  **אפס ⇒ אינו נגזר** (‏`bool` · `VoidCallback` · `Color` · `Widget`): אין להם
//  שורה ב-TYPE_IN. ‏`bool` ממשיך להיקשר כפי שנקשר תמיד — `TYPE_SHAPE.typeBool`
//  היא `/bool/i` והיא מתאימה למחרוזת `bool` כמות-שהיא; לא נגענו בזה, כי שינוי
//  שם-הטיפוס שם היה **מבטל** קשירה קיימת, וזו לא התקלה שנמדדה.
const TYPE_IN = { date: ['DateTime', 'String', 'Object'], num: ['num', 'int', 'double', 'Object', 'dynamic', 'String'], text: ['String', 'Object', 'dynamic'], multiline: ['String', 'Object'] };   // ⇐ machtzev/generator/entity.mjs:127
const T2 = { date: 'IsoDate', num: 'number', bool: 'boolean', text: 'string', multiline: 'string' };                                                                                                  // ⇐ machtzev/generator/sentence.mjs:79
/** טיפוס-Dart ⇒ `{shape, from}` באוצר-הסכמה. רב-משמעי/חסר-מקור ⇒ `shape:null` **עם הסיבה**. */
function shapeOfDart(dart) {
  const bare = String(dart).replace(/\?$/, '').trim();
  const specs = Object.keys(TYPE_IN).filter((k) => TYPE_IN[k].includes(bare));
  if (specs.length === 1) return { shape: T2[specs[0]] || null, from: `machtzev/generator/entity.mjs:127 TYPE_IN.${specs[0]} ∋ ${bare} ⇒ machtzev/generator/sentence.mjs:79 T2.${specs[0]}` };
  if (specs.length > 1) return { shape: null, from: `רב-משמעי: ${bare} מתקבל ע"י ${specs.length} טיפוסי-אפיון (${specs.join('/')}) — בחירה ביניהם היא הכרעה-במנוע (L114) ⇒ מתג` };
  return { shape: null, from: `אין ל-${bare} שורה ב-TYPE_IN (machtzev/generator/entity.mjs:127) — חסר-מקור, לא ניחוש (§20-ג)` };
}

const SKIP_CLS = /Tokens$|Composed$|^_/;
const entities = [];
for (const m of src.matchAll(/^class ([A-Za-z0-9_]+)\s*\{/gm)) {
  const cls = m[1]; if (SKIP_CLS.test(cls)) continue;
  const [body, bi] = bodyOf(m.index);
  const startLine = lineAt(m.index);
  const fields = [];
  for (const fm of body.matchAll(/\n\s*final\s+([A-Za-z0-9_<>,?\s]+?)\s+([a-zA-Z_][A-Za-z0-9_]*)\s*;/g)) {
    const dartT = fm[1].trim().replace(/\s+/g, ' ');
    const sh = shapeOfDart(dartT);
    fields.push({ name: fm[2], type: dartT, shape: sh.shape, shapeFrom: sh.from, line: lineAt(bi + fm.index + 1) });   // +1: fm.index מצביע על ה-\n שלפני השורה
  }
  if (!fields.length) continue;   // בלי שקעים אין ישות — לא נרשמת
  entities.push({ cls, line: startLine, src: `${file}:${startLine}`, fields,
    he: null, heFrom: 'none',
    ask: `מה השם העברי של ${cls} (${fields.map((f) => f.name).join(' · ')}) במסך ${file.split('/').pop()}?` });
}

const board = {
  reads: uniq(widgets.flatMap(w => w.reads)),
  writes: uniq(widgets.flatMap(w => w.writes)),
  navsAndCalls: uniq(widgets.flatMap(w => w.actions)),
};

// ── פלט ──
const manifest = { file, lines: lines.length, pigments, terms: heStrings, icons, glyphs, logicCandidates, widgets, sectionMap, composer, gates, board, entities };
const jsonOut = process.argv.indexOf('--json');
if (jsonOut > 0) fs.writeFileSync(process.argv[jsonOut + 1], JSON.stringify(manifest, null, 1));

const pure = widgets.filter(w => w.pure), sections = widgets.filter(w => !w.pure);
// 🕯️ ורמינהו על החציבה: «כמה אטומים נקיים יצאו מהמסך» נאמר עד כה כמונה, ומונה אינו פסק.
//    שלוש התוצאות כאן הן שלוש «אין» **שונות**, ומי שקורא מונה אחד לא רואה את ההבדל:
//    טהור-IO ו🧼נקי-מדאטה ⇒ חד שיעורא (אטום שניתן לקדם כמו-שהוא) · טהור-IO עם דאטה-צרובה
//    ⇒ פליגא, וזה חסר-**חיווט** (הדאטה צריכה לצאת לשקע), לא חסר-אטום · לא-טהור ⇒ לא שייך
//    (סקציה מחוברת, לא אטום — והיא בכוונה לא מקודמת). זה החיפוש שרואה מה שהמדף לא רואה (L113).
rminhu({ engine: 'screen-decomp', matter: `מסך ${file.split('/').pop()} ⇒ אטומים-לקידום`,
  searched: [`${widgets.length} מחלקות-widget ב-${lines.length} שורות`, 'מסנן-טוהר: reads/writes/navs/toast', 'מסנן-דאטה: מחרוזות-צרובות'],
  rulings: widgets.map((w) => (w.pure && w.dataClean
    ? had(w.name, `טהור-IO ונקי-מדאטה · ${w.loc} שורות — ניתן לקדם כמו-שהוא`)
    : w.pure
      ? pliga(w.name, `טהור-IO אך ${w.strings} מחרוזות צרובות בגוף — זה חסר-חיווט (הדאטה צריכה לצאת לשקע), לא חסר-אטום; קידום כמו-שהוא היה מנציח דאטה באטום (חוק-1)`)
      : lo(w.name, `אינו טהור — קורא:[${w.reads.join(',') || '—'}] פועל:[${[...w.writes.map((x) => 'set:' + x), ...w.actions].join(',') || '—'}]: סקציה-מחוברת, לא אטום`))) });
console.log(`🔬 פירוק-מסך · ${file.split('/').pop()} — ${lines.length} שורות`);
console.log(`  ש0 פיגמנטים: ${pigments.tokens.length} טוקנים · גפנים ${pigments.fontSizes.join('/')} · אטימויות ${pigments.opacities.length} · תפקידי-צבע=${pigments.roleRecord ? 'כן (חוק-3)' : 'לא'}`);
console.log(`  ש1 מונחים: ${heStrings.length} מחרוזות-עבריות`);
console.log(`  ש2 אייקונים: ${icons.length} + ${glyphs.length} גליפים`);
console.log(`  ש3 מועמדי-לוגיקה: ${logicCandidates.length} — ${logicCandidates.map(l => l.name).join(' · ')}`);
const clean = pure.filter(w => w.dataClean), dirty = pure.filter(w => !w.dataClean);
console.log(`  ש4 חוטי-תצוגה טהורי-IO: ${pure.length} · מהם 🧼 נקיים-מדאטה: ${clean.length} — ${clean.map(w => w.name).join(' · ')}`);
if (dirty.length) console.log(`     ⚠️ טהורי-IO אך עם דאטה-צרובה (${dirty.length}): ${dirty.map(w => w.name + '(' + w.strings + 'מח׳)').join(' · ')}`);
console.log(`  ש5 סקציות/מחוברים: ${sections.length}`);
for (const w of sections) console.log(`     ${w.name} (${w.loc}ש) ← קורא:[${w.reads.join(',')}] פועל:[${[...w.writes.map(x => 'set:' + x), ...w.actions].join(',')}]`);
console.log(`  ש6 קומפוזר: ${composer.join(',') || '—'} · מיפוי-סקציות: ${sectionMap.length} · שערים: ${gates.join(' · ')}`);
console.log(`  ש7 שקעי-לוח: ${board.reads.length} קריאות · ${board.writes.length} כתיבות · ${board.navsAndCalls.length} ניווטים/קריאות`);
console.log(`  ש8 ישויות: ${entities.length} מחלקות-שורה · ${entities.reduce((a, e) => a + e.fields.length, 0)} שקעים · מונח-עברי מוצהר: ${entities.filter((e) => e.he).length}/${entities.length} (השאר = מתגי-בעלים)`);
const shaped = entities.flatMap((e) => e.fields).filter((f) => f.shape);
console.log(`     צורת-סכמה נגזרה: ${shaped.length}/${entities.reduce((a, e) => a + e.fields.length, 0)} שקעים (${[...new Set(shaped.map((f) => f.type + '⇒' + f.shape))].join(' · ') || '—'}); השאר בלי מקור-מוצהר ⇒ טיפוס-Dart כמות-שהוא`);
for (const e of entities) console.log(`     ${e.cls} (${e.fields.length} שקעים) ${e.src}${e.he ? ' ⇒ ' + e.he : '  ⚑ ' + e.ask}`);
console.log(`  📊 סה"כ אטומים-מזוהים: ${pigments.tokens.length + heStrings.length + icons.length + glyphs.length + logicCandidates.length + widgets.length}`);
(await import('../../yeshiva/rminhu.mjs')).printNotes('screen-decomp');
