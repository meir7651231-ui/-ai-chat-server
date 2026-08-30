// ── engine/lib.mjs — עזרי-סריקה טהורים (אפס-דאטה, אפס-תלות בפרויקט) ──
// חולצו מ-machtzev/assemble/lift-lib.mjs + generator/twins.mjs verbatim.
// זה כל מה שהמנוע צריך מעבר לספריית-התקן של Node.

/** סורק-Dart מודע-מחרוזות-ואינטרפולציה: קורא ל-onChar(mode,char,idx) לכל תו.
 *  mode: 0=קוד · 1='…' · 2="…" · 3=הערה. תומך ב-${…} מקונן וב-raw-strings. */
export function dartScan(src, from, onChar) {
  let mode = 0;
  let raw = false; const rawStack = [];
  const modeStack = []; const interpDepth = [];
  let d = 0;
  for (let j = from; j < src.length; j++) {
    const c = src[j];
    if (mode) {
      if (!raw && c === '\\') { onChar(mode, c, j); j++; if (j < src.length) onChar(mode, src[j], j); continue; }
      if (!raw && c === '$' && src[j + 1] === '{') { modeStack.push(mode); rawStack.push(raw); raw = false; mode = 0; onChar(1, c, j); j++; onChar(1, src[j], j); d++; interpDepth.push(d); continue; }
      if ((mode === 1 && c === "'") || (mode === 2 && c === '"')) { const m0 = mode; mode = 0; raw = false; onChar(m0, c, j); continue; }
      onChar(mode, c, j); continue;
    }
    if (c === '/' && src[j + 1] === '/') { while (j < src.length && src[j] !== '\n') { onChar(3, src[j], j); j++; } if (j < src.length) onChar(0, '\n', j); continue; }
    if (c === '/' && src[j + 1] === '*') { onChar(3, c, j); j++; onChar(3, '*', j); j++; while (j < src.length - 1 && !(src[j] === '*' && src[j + 1] === '/')) { onChar(3, src[j], j); j++; } onChar(3, '*', j); j++; if (j < src.length) onChar(3, '/', j); continue; }
    if (c === "'") { mode = 1; raw = /r$/.test(src.slice(Math.max(0, j - 1), j)) && !/[\w$]r$/.test(src.slice(Math.max(0, j - 2), j)); onChar(1, c, j); continue; }
    if (c === '"') { mode = 2; raw = /r$/.test(src.slice(Math.max(0, j - 1), j)) && !/[\w$]r$/.test(src.slice(Math.max(0, j - 2), j)); onChar(2, c, j); continue; }
    if (c === '{') { d++; onChar(0, c, j); continue; }
    if (c === '}') {
      d--;
      if (interpDepth.length && d === interpDepth[interpDepth.length - 1] - 1) { interpDepth.pop(); mode = modeStack.pop(); raw = rawStack.pop(); onChar(1, c, j); continue; }
      onChar(0, c, j);
      if (onChar.stopAtZero && d <= 0) return j;
      continue;
    }
    onChar(0, c, j);
  }
  return -1;
}

/** חילוץ-גוף מאוזן-סוגריים מ-startIdx (verbatim, מודע-מחרוזות). */
export function classBody(src, startIdx) {
  const i = src.indexOf('{', startIdx); if (i < 0) return null;
  const fn = () => {}; fn.stopAtZero = true;
  const j = dartScan(src, i, fn);
  if (j < 0) return null;
  return src.slice(startIdx, j + 1);
}

/** הסרת-הערות (בלוק + שורה) — לסריקת-מבנה בלבד. */
export const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter(l => !l.trim().startsWith('//')).join('\n');

/** PascalCase/camelCase ⇒ snake_case (לשמות-קבועים בפלט). */
export const snake = (n) => n.replace(/^_/, '').replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

/** ערך-JS ⇒ ליטרל-Dart (מחרוזת/מספר/בוליאני/מערך/מפה). */
export const dartLit = (v, top = true) => {
  if (v === null) return 'null';
  if (typeof v === 'string') return "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'double.nan';
  if (typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return (top ? 'const ' : '') + '[' + v.map(x => dartLit(x, false)).join(', ') + ']';
  return (top ? 'const ' : '') + '{' + Object.entries(v).map(([k, x]) => dartLit(k, false) + ': ' + dartLit(x, false)).join(', ') + '}';
};
