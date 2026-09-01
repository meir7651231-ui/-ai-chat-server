/**
 * מנוע-דאטה · gen-data-dart — ממיר אטומי-קבוע (JS const טהור) ל-Dart מכנית.
 * הכרעת-בעלים 26.8 ("תלך על הטוב ביותר" + "כמה מנועי"): שלב-2 = אטומי-דאטה,
 * ~90% מנוע. קורא את הערך-החי (import דינמי), פולט getter-Dart + בדיקת-זהב
 * שמשווה jsonEncode(Dart) ≡ JSON.stringify(JS) — ההוכחה החזקה-ביותר לנתון-טהור.
 *
 * שימוש:  node machtzev/purity/gen-data-dart.mjs <atom-name> [<atom-name> ...]
 * פלט:    new/dart-maor/<name>.dart + <name>_test.dart · מדפיס GO/SKIP פר-אטום.
 * SKIP:   אטום עם export שהוא פונקציה (לא-דאטה — שייך למסלול-הלוגיקה) או ערך
 *         לא-סריאליזבל (undefined/Symbol/BigInt).
 * ריצה:   הזהב עצמו מורץ ע"י המיין-לופ (dart run) — כאן רק חילול.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const REPO = new URL('../..', import.meta.url).pathname;

/** kebab-case → camelCase (שם-ה-getter, כמו tier-order⇒tierOrder). */
function camel(name) {
  return name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/** בורח מחרוזת ל-ליטרל-Dart בגרשיים-בודדים (\\ ' $ + בקרה). */
function dartStr(s) {
  let out = "'";
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (ch === '\\') out += '\\\\';
    else if (ch === "'") out += "\\'";
    else if (ch === '$') out += '\\$';
    else if (c === 0x0a) out += '\\n';
    else if (c === 0x0d) out += '\\r';
    else if (c === 0x09) out += '\\t';
    else if (c < 0x20) out += '\\u{' + c.toString(16) + '}';
    else out += ch; // עברית/יוניקוד — UTF-8 גולמי, כמו במקור
  }
  return out + "'";
}

/** ערך-JS סריאליזבל → ליטרל-Dart (const-בר). זורק על לא-סריאליזבל. */
function dartLit(v, indent) {
  const pad = '  '.repeat(indent);
  const pad1 = '  '.repeat(indent + 1);
  if (v === null) return 'null';
  const t = typeof v;
  if (t === 'string') return dartStr(v);
  if (t === 'boolean') return v ? 'true' : 'false';
  if (t === 'number') {
    if (!Number.isFinite(v)) throw new Error('לא-סריאליזבל: ' + v);
    // ‏String(v) = shortest-round-trip של JS; Dart מפרסר לאותו double.
    // שלם ⇒ ליטרל-int; אחרת ⇒ ליטרל-double כלשונו.
    return Number.isInteger(v) ? String(v) : String(v);
  }
  if (t === 'bigint' || t === 'symbol' || t === 'undefined' || t === 'function') {
    throw new Error('לא-סריאליזבל: ' + t);
  }
  if (Array.isArray(v)) {
    if (v.length === 0) return 'const []';
    const items = v.map((x) => pad1 + dartLit(x, indent + 1)).join(',\n');
    return 'const [\n' + items + ',\n' + pad + ']';
  }
  // אובייקט-רגיל ⇒ Map בסדר-הכנסה (LinkedHashMap ≡ סדר-מפתחות-JS)
  const keys = Object.keys(v);
  if (keys.length === 0) return 'const <String, dynamic>{}';
  const entries = keys.map((k) => pad1 + dartStr(k) + ': ' + dartLit(v[k], indent + 1)).join(',\n');
  return 'const {\n' + entries + ',\n' + pad + '}';
}

/** טיפוס-Dart של הערך (להצהרת-ה-getter). */
function dartType(v) {
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'double';
  if (typeof v === 'string') return 'String';
  if (typeof v === 'boolean') return 'bool';
  if (Array.isArray(v)) {
    const el = v.every((x) => typeof x === 'string') ? 'String'
      : v.every((x) => typeof x === 'number' && Number.isInteger(x)) ? 'int'
      : v.every((x) => Array.isArray(x)) ? 'List<dynamic>'
      : 'dynamic';
    return 'List<' + el + '>';
  }
  if (v && typeof v === 'object') {
    const vals = Object.values(v);
    const vt = vals.every((x) => typeof x === 'string') ? 'String' : 'dynamic';
    return 'Map<String, ' + vt + '>';
  }
  return 'dynamic';
}

async function convert(name) {
  const src = REPO + 'new/atoms/' + name + '.mjs';
  const mod = await import(pathToFileURL(src).href);
  const exps = Object.entries(mod).filter(([k]) => k !== 'default');
  // כל export חייב להיות דאטה (לא פונקציה)
  for (const [k, val] of exps) {
    if (typeof val === 'function') return { name, status: 'SKIP', why: 'export פונקציה: ' + k };
  }
  if (!exps.length) return { name, status: 'SKIP', why: 'אין export' };

  const getters = [];
  const testAsserts = [];
  for (const [k, val] of exps) {
    let lit, typ, json;
    try {
      lit = dartLit(val, 3);
      typ = dartType(val);
      json = JSON.stringify(val);
    } catch (e) {
      return { name, status: 'SKIP', why: e.message + ' (' + k + ')' };
    }
    const g = camel(k.toLowerCase() === k ? k : k.toLowerCase()); // KEVA_CONST⇒kevaConst
    const gname = camel(k.replace(/_/g, '-').toLowerCase());
    getters.push(
      '/// Verbatim data port of `' + k + '` from new/atoms/' + name + '.mjs.\n' +
      typ + ' get ' + gname + ' => ' + lit + ';');
    testAsserts.push({ gname, json });
  }

  const dartDoc =
    '// ⚛️ אטום-Dart-דאטה (דרגת-חוזה) · ' + name + ' — קודם מכנית ע"י gen-data-dart.mjs.\n' +
    '// מקור: new/atoms/' + name + '.mjs (אטום-קבוע, צילום-ערך). טוהר: getter top-level,\n' +
    '// אפס import (רק dart:core). חוק-4 — ערך זהה-ביט למקור-ה-JS.\n' +
    '// ההמרה: ‏JS-const ⇒ ‏Dart-const (ליטרל שומר-סדר, LinkedHashMap≡סדר-מפתחות-JS).\n\n' +
    getters.join('\n\n') + '\n';

  const importLine = testAsserts.length ? "import 'dart:convert';\nimport '" + name + ".dart';\n" : '';
  const body = testAsserts.map((a, i) =>
    "  // ‏" + (i + 1) + ") צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).\n" +
    '  if (jsonEncode(' + a.gname + ') != ' + dartStr(a.json) + ') {\n' +
    "    throw StateError('FAIL " + a.gname + ": צילום-הערך סטה');\n" +
    '  }').join('\n');
  const dartTest =
    '// בדיקת-חוזה (רתמת-זהב) · ' + name + ' — צילום-ערך jsonEncode≡JSON.stringify.\n' +
    '// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK\n' +
    importLine + '\nvoid main() {\n' + body + '\n  print(' +
    dartStr('OK ' + name + ': ' + testAsserts.length + ' data-snapshot(s) passed') + ');\n}\n';

  writeFileSync(REPO + 'new/dart-maor/' + name + '.dart', dartDoc);
  writeFileSync(REPO + 'new/dart-maor/' + name + '_test.dart', dartTest);
  return { name, status: 'GO', exps: exps.length };
}

const names = process.argv.slice(2);
if (!names.length) { console.error('usage: node gen-data-dart.mjs <atom>...'); process.exit(2); }
let go = 0, skip = 0;
for (const n of names) {
  try {
    const r = await convert(n);
    if (r.status === 'GO') { go++; console.log('GO   ' + n + ' (' + r.exps + ' export)'); }
    else { skip++; console.log('SKIP ' + n + ' — ' + r.why); }
  } catch (e) {
    skip++; console.log('SKIP ' + n + ' — שגיאה: ' + e.message);
  }
}
console.log('---\nGO ' + go + ' · SKIP ' + skip);
