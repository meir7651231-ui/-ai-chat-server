// 🔨 forge-wire — חיווט-חריצים לאטומי-forge (הכרעת-בעלים 23.9 «תתחיל לחבר» · חיבור 1: אותות-הצורה של auto-skin אל הפסק).
//   הפער שנמדד: אטום-forge מדוד (forge-manifest · L83) מחזיק חריץ-רשימה `fields` ולא שקעים-בשם (label/value), ולכן
//   wireAtom לא ממלא בו כלום ⇒ הישיבה פוסלת אותו «חובה בלי שדה» עוד לפני שנמדד. כאן החריצים מתמלאים לפי **צורת-החריץ**
//   במניפסט (fieldDemo: חריץ-מספר / חריץ-טקסט — צורה, לא שם ולא מילון): חריץ-המספר ⇐ הערך · חריצי-הטקסט בסדרם ⇐ תווית, משנה.
//   חריץ בלי דאטה ⇐ '' (האטום מסתיר; אין תוכן-דמו בייצור — §20-ג). items ⇐ שורות · values ⇐ שבר · columns/bare/… ⇐ wireAtom.
//   forgeCands(op, role): המועמדים המדודים — אטומי-forge של אותה פעולה ב-ops-map + שלושת-הראשונים-לתפקיד של auto-skin.json —
//   מצטרפים לחיפוש; הישיבה (atom-psak) פוסקת ביניהם לפי אות-הצורה. נייר בלבד; כהה = ביט-זהה (חוק-7).
//   🕯️ הבית הנכון של החיווט הזה הוא particles.wireAtom והבית של המועמדים הוא cover — שניהם נעוצים; עד מספר-בעלים הם כאן.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPaper } from './look.mjs';
import { OPFAM } from './cover.mjs';
const GEN = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(GEN, '../..');
let MAN = null, MAP = null, SKIN = null;
const manifest = () => (MAN ||= new Map(JSON.parse(fs.readFileSync(path.join(ROOT, 'new/dart-forge-bs/forge-manifest.json'), 'utf8')).atoms.map((a) => [a.cls, a])));
const opsMap = () => (MAP ||= JSON.parse(fs.readFileSync(path.join(GEN, 'ops-map.json'), 'utf8')));
const autoSkin = () => (SKIN ||= JSON.parse(fs.readFileSync(path.join(GEN, 'auto-skin.json'), 'utf8')));
const isNum = (t) => /^[\d,.%₪$+\-–]+$/.test(String(t).trim());   // אותה צורת-חריץ כמו auto-skin.fits
// גוון-DS (ds.dart: 0 רגיל · 1 ok · 2 danger · 3 warn) ⇒ וריאנט-הפריט של האטום לפי שם-הטוקן (אותן 4 צורות כמו auto-skin.toneCoverage)
const TONE_RE = [/^tone-(info|neutral|accent|primary)$/, /^tone-(ok|success|good)$/, /^tone-(err|error|danger|bad)$/, /^tone-(warn|warning)$/];
const variantOf = (a, tone) => { const v = (a.items && a.items.variants) || []; const re = TONE_RE[tone]; const i = re ? v.findIndex((x) => re.test(x)) : -1; return i; };

/** המועמדים המדודים לפעולה/תפקיד (נייר בלבד). */
export function forgeCands(op, role = null) {
  if (!isPaper()) return [];
  const fam = OPFAM[op] || op;
  const byOp = opsMap().filter((a) => a.layer === 'display' && a.op === fam && /^Forge/.test(a.id) && a.sockets.includes('fields')).map((a) => a.id);
  const byRole = role && autoSkin().top3 && autoSkin().top3[role] ? autoSkin().top3[role].map((x) => x.split(':')[0]) : [];
  return [...new Set([...byRole, ...byOp])];
}

/** חיווט: אטום עם חריץ-`fields` ⇒ לפי צורת-החריץ; אחרת wireAtom כרגיל. */
export function wireForge(cls, ctx, { widgetOf, wireAtom, sigOf = null }) {
  const w = widgetOf(cls);
  const a = w && w.types.has('fields') && isPaper() ? (manifest().get(cls) || (sigOf ? sigOf(cls) : null)) : null;
  if (!a) return wireAtom(cls, ctx);
  const base = wireAtom(cls, { ...ctx, must: [] }) || (w.shelf === 'synth' ? { cls, file: w.file, call: `${cls}()`, filled: [], sockets: [...w.types.keys()].filter((n) => !/^(key|child)$/.test(n)).length } : null); if (!base) return null;   // בדיקות-הסף של wireAtom (לובש-עור · bare) — נשארות שם; אטום-מסונתז (לא באטלס) = לובש-עור מבנייה
  const demo = a.fieldDemo || [];
  let own = a.items && a.items.slots ? Math.max(0, a.fieldSlots - a.items.demo * a.items.slots) : a.fieldSlots;   // חריצים-עצמיים (פריטים ⇐ items)
  if (a.columns && base.filled.includes('columns') && own === a.columns) own = 0;   // החריצים-העצמיים הם כותרות-העמודות, ו-columns כבר ממלא אותן ⇒ לא לטעון שמולאו
  const fields = Array.from({ length: a.fieldSlots }, () => "''");
  const filled = [...base.filled, 'fields'];
  const valNum = !!ctx.value && ctx.value.isNum !== false;   // ערך שצורתו מספר ⇒ חריץ-המספר; ערך-טקסט (שם/תאריך) ⇒ חריץ-טקסט, אחרי התווית
  const texts0 = [['label', ctx.label], ...(ctx.value && !valNum ? [['value', ctx.value.str]] : []), ['sub', ctx.sub], ['message', ctx.message && ctx.message !== ctx.label ? ctx.message : null]].filter(([, e]) => e);
  const need = ctx.need || [];   // מה שהמטרה דורשת נכנס לחריצים ראשון (התראה: message לפני label) — סדר-המטרה, לא סדר-קבוע
  const texts = [...texts0.filter(([k]) => need.includes(k)).sort((a, b) => need.indexOf(a[0]) - need.indexOf(b[0])), ...texts0.filter(([k]) => !need.includes(k))];
  let numDone = !valNum;
  for (let i = 0; i < own; i++) {
    if (isNum(demo[i])) { if (!numDone) { fields[i] = ctx.value.str; filled.push('value'); numDone = true; } }
    else if (texts.length) { const [k, e] = texts.shift(); fields[i] = e; filled.push(k); }
  }
  const extra = [`fields: [${fields.join(', ')}]`];
  if (a.items && a.items.slots && w.types.has('items') && !base.filled.includes('items')) {
    const wantRows = !need.length || need.some((k) => k === 'rows' || k === 'items');   // המטרה מבקשת שורות/פריטים ⇒ רשימה; אחרת (התראה: message) הפריט-היחיד מהטקסטים
    if (ctx.rows && wantRows) { extra.push(`items: ${ctx.rows}`); filled.push('rows'); }
    else if (ctx.items && wantRows) { extra.push(`items: [for (final s in ${ctx.items}) [s]]`); filled.push('items'); }
    else {   // אטום-פריטים בלי רשימה במקור ⇒ פריט אחד, חריציו לפי צורת-חריצי-הפריט הראשון בדמו (מספר/טקסט)
      const item = [];
      for (let j = 0; j < a.items.slots; j++) { const d = demo[own + j]; if (isNum(d)) { if (!numDone) { item.push(ctx.value.str); filled.push('value'); numDone = true; } else item.push("''"); } else if (texts.length) { const [k, e] = texts.shift(); item.push(e); filled.push(k); } else item.push("''"); }
      if (item.some((e) => e !== "''")) { extra.push(`items: [[${item.join(', ')}]]`); filled.push('items'); }
    }
  }
  if (a.values >= 1 && w.types.has('values') && ctx.fraction) { extra.push(`values: [${ctx.fraction}]`); filled.push('fraction'); }
  if (w.types.has('variants') && ctx.tone != null && extra.some((e) => e.startsWith('items: [['))) { const vi = variantOf(a, ctx.tone); if (vi >= 0) { extra.push(`variants: [${vi}]`); filled.push('tone'); } }
  if (w.types.has('onAction') && ctx.nav && !base.filled.includes('onAction')) { extra.push(`onAction: (_) => (${ctx.nav})()`); filled.push('onAction'); }   // הקשה ⇒ הניווט של המטרה (חור-הפעולה של ds-forge)
  else if (ctx.nav && !ctx.onSelect && extra.some((e) => e.startsWith('items: [[')) && w.types.has('onSelect') && !base.filled.includes('onSelect')) { extra.push(`onSelect: (_) => (${ctx.nav})()`); filled.push('onSelect'); }   // פריט-יחיד: הקשה על הפריט = הניווט
  else if (ctx.nav && extra.some((e) => e.startsWith('items: [[')) && w.types.has('onCell') && !base.filled.includes('onCell')) { extra.push(`onCell: (_, __) => (${ctx.nav})()`); filled.push('onCell'); }
  for (const m of ctx.must || []) if (!filled.includes(m)) return null;   // שקע-נדרש-מהקורא (G26)
  const baseArgs = base.call.slice(base.call.indexOf('(') + 1, base.call.lastIndexOf(')')).trim();
  return { ...base, call: `${cls}(${[baseArgs, ...extra].filter(Boolean).join(', ')})`, filled };
}
