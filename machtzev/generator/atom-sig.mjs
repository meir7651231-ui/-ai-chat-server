// 📐 atom-sig — אותות-הצורה של אטומי-Dart (הכרעת-בעלים 23.9 «יש לך את המנועים» ⇒ «תחבר»).
//   auto-skin מודד «הכי-טוב-לייעוד» מאותות-צורה (L83) — עד כאן רק ל-359 אטומי-forge, כי ds-forge חוצב אותם מה-CSS.
//   572 אטומי dart-ui-bs נשארו «לא-מדודים» (ציון 0 בפסק). כאן אותם אותות נחצבים מה-Dart עצמו, בחיבור של שני מנועים קיימים:
//     · atlas (buildAtlas): השקעים וטיפוסיהם — מי חריץ-מספר, מי טקסט, מי פעולה, מי רשימה, מי ילד
//     · screen-decomp (שכבה-0 פיגמנטים): fontSize/FontWeight מהקוד — כאן פר-חריץ: ה-Text(<שקע>…) שמצייר את השקע ועיצובו
//   הפלט = רשומה באותה צורה של forge-manifest (fieldSlots · fieldDemo · sig{root,svg,input,slots,numEmph} · child · bare · control · actions · items · columns · values),
//   כך ש-fits/score של auto-skin רצים עליה כמות-שהם. אפס שם-אטום, אפס מילון (§20-ד): רק טיפוסי-שקעים, צורות-שמות-שקעים (SOCK של particles) וקוד.
//   משפחה: רק כשתיקיית-האטום נושאת שם-משפחה של forge (premium/dataviz · premium/feedback); אחרת null ⇒ תפקידים שדורשים משפחה אינם נמדדים (לא נפסלים).
//   ברירות-מחדל מוצהרות: Text בלי fontSize ⇒ 14, בלי fontWeight ⇒ 400 (ברירות-המחדל של Flutter).
//   שימוש: node machtzev/generator/atom-sig.mjs [--write] [--cls X]   · API: atomSigs() ⇒ Map<cls, record> · sigOfDart(widget, src)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAtlas } from './atlas.mjs';
const GEN = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(GEN, '../..');
const S = { value: /^(value|val|amount|total|count|num)$/, label: /^(label|title|caption|name|text)$/, tap: /^(onTap|onPressed)$/, labels: /^(labels|cols|columns|headers)$/, fraction: /^(fraction|pct|percent|progress)$/, selected: /^(selected|activeIndex|index)$/, onSelect: /^(onSelect|onChanged)$/ };
const NUM_T = /^(int|double|num)$/;
const FAMILIES = new Set(['action', 'card', 'chat', 'composite', 'dataviz', 'feedback', 'header', 'input', 'list', 'media', 'motion', 'nav', 'selection', 'spatial', 'status', 'temporal', 'text']);

const bodyOf = (src, i) => { let j = src.indexOf('(', i); if (j < 0) return ''; let d = 0, k = j; for (; k < src.length; k++) { if (src[k] === '(') d++; else if (src[k] === ')') { d--; if (!d) break; } } return src.slice(j + 1, k); };
const stripC = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
// עיצוב-החריץ: ה-Text(...) הראשון שהארגומנט הראשון שלו מפנה לשקע (label · widget.label · '$label' · label.toString())
function slotStyle(code, sock) {
  const re = /\bText\(/g; let m;
  while ((m = re.exec(code))) {
    const args = bodyOf(code, m.index + 4); const first = args.split(',')[0].trim();
    if (!new RegExp(`(^|[^\\w.])(widget\\.)?${sock}\\b`).test(first) && !new RegExp(`\\$\\{?${sock}\\b`).test(first)) continue;
    const fs = args.match(/fontSize:\s*([0-9.]+)/), fw = args.match(/FontWeight\.(w(\d{3})|bold|normal)/);
    return { fs: fs ? +fs[1] : 14, fw: fw ? (fw[2] ? +fw[2] : fw[1] === 'bold' ? 700 : 400) : 400, inBtn: false };
  }
  return null;
}
export function sigOfDart(w, src) {
  const code = stripC(src);
  const types = [...w.types].filter(([n]) => !/^(key)$/.test(n));
  const isNumSock = ([n, t]) => NUM_T.test(t.replace(/\?$/, '')) || (t.replace(/\?$/, '') === 'String' && S.value.test(n));
  const isTxtSock = ([n, t]) => t.replace(/\?$/, '') === 'String' && !S.value.test(n);
  // חריץ = שקע שהקוד מצייר ב-Text (מספר או טקסט), או שקע-String בצורת תווית/ערך/משנה גם בלי Text ישיר; int של פרמטר (tone/index/size) שאינו מצויר אינו חריץ
  const drawn = new Map(types.map(([n]) => [n, slotStyle(code, n)]));
  const slots = types.filter((x) => (isNumSock(x) || isTxtSock(x)) && (drawn.get(x[0]) || (x[1].replace(/\?$/, '') === 'String' && (S.value.test(x[0]) || S.label.test(x[0]) || /^(sub|subtitle|desc|body|note|message)$/.test(x[0])))));
  const fieldDemo = slots.map((x) => (isNumSock(x) ? '0' : 'Label'));
  const sigSlots = slots.map(([n]) => drawn.get(n) || { fs: 14, fw: 400, inBtn: false, defaulted: true });
  const numFs = slots.map((x, i) => (isNumSock(x) ? sigSlots[i].fs : 0)), txtFs = slots.map((x, i) => (isNumSock(x) ? 0 : sigSlots[i].fs));
  const numEmph = Math.max(0, ...numFs) && Math.max(0, ...txtFs) ? +(Math.max(...numFs) / Math.max(...txtFs)).toFixed(2) : 0;
  // שורש: הביטוי המוחזר הראשון ב-build
  const bi = code.search(/Widget build\(BuildContext context\)/); const build = bi >= 0 ? code.slice(bi) : code;
  const ret = build.match(/return\s+(?:const\s+)?([A-Z]\w*)\(/) || build.match(/=>\s*(?:const\s+)?([A-Z]\w*)\(/); const rootCls = ret ? ret[1] : null;
  const rootArgs = ret ? bodyOf(build, build.indexOf(ret[0]) + ret[0].length - 1) : '';
  const top = rootArgs.replace(/\((?:[^()]|\([^()]*\))*\)/g, '()');   // ארגומנטים ברמה-הראשונה בלבד
  const decorated = /\bdecoration:/.test(top) || /^(Card|DecoratedBox|Material)$/.test(rootCls || '') || (/^Container$/.test(rootCls || '') && /\bcolor:/.test(top));
  const btnRoot = /Button$|^InkWell$|^GestureDetector$/.test(rootCls || '');
  const interactive = btnRoot || types.some(([n]) => S.tap.test(n));
  const dirM = build.match(/\b(Row|Column)\(/); const dir = dirM ? (dirM[1] === 'Row' ? 'row' : 'column') : 'block';
  const svg = /\b(Icon\(|CustomPaint\(|Icons\.)/.test(build);
  const control = /\bTextField\(|\bTextFormField\(/.test(code);
  const input = control ? { ph: /hintText:/.test(code), numPh: /keyboardType:\s*(const\s+)?TextInputType\.number/.test(code), readonly: /readOnly:\s*true/.test(code), datePh: false } : null;
  const actions = types.filter(([, t]) => /VoidCallback|void Function\(\)/.test(t)).length;
  const child = types.some(([, t]) => /^(Widget|List<Widget>)\??$/.test(t));
  const bare = types.some(([n, t]) => n === 'bare' && /^bool/.test(t));
  const lists = types.filter(([n, t]) => /^List</.test(t) && !/^List<(double|num|int)>/.test(t) && !S.labels.test(n));
  const items = lists.length ? { slots: lists.some(([, t]) => /^List<List</.test(t)) ? 2 : 1, demo: 0, selectable: types.some(([n]) => S.onSelect.test(n)), selected: types.some(([n]) => S.selected.test(n)), cells: lists.some(([, t]) => /^List<List</.test(t)) ? 1 : 0, variants: null } : null;
  const columns = types.filter(([n, t]) => S.labels.test(n) && /^List<String>/.test(t)).length;
  const values = types.filter(([n, t]) => /^List<(double|num|int)>/.test(t) || S.fraction.test(n)).length;
  const famDir = w.file.split('/').slice(0, -1).find((d) => FAMILIES.has(d)) || null;
  return { family: famDir, cls: w.cls, file: w.file, seam: null, states: false, stateIds: null, fieldSlots: slots.length, fieldDemo, sig: { root: { tag: btnRoot ? 'button' : 'div', decorated, interactive, dir }, svg, input, series: 0, fills: 0, slots: sigSlots, numEmph }, child, bare, control, actions, items, columns, values, from: 'atom-sig (Dart)' };
}
let MAP = null;
export function atomSigs() {
  if (MAP) return MAP; MAP = new Map();
  for (const w of buildAtlas().widgets) { const f = path.join(ROOT, 'new', w.shelf === 'new/dart-ui-bs' ? 'dart-ui-bs/' + w.file : w.file); if (!fs.existsSync(f)) continue; try { MAP.set(w.cls, sigOfDart(w, fs.readFileSync(f, 'utf8'))); } catch {} }
  return MAP;
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const m = atomSigs(); const arr = [...m.values()];
  const ci = process.argv.indexOf('--cls'); if (ci > 0) { console.log(JSON.stringify(m.get(process.argv[ci + 1]), null, 1)); process.exit(0); }
  if (process.argv.includes('--write')) fs.writeFileSync(path.join(GEN, 'atom-sig.json'), JSON.stringify(arr, null, 1) + '\n');
  const kpi = arr.filter((a) => a.sig.numEmph >= 1.4).length, dflt = arr.filter((a) => a.sig.slots.some((s) => s.defaulted)).length;
  console.log(`📐 atom-sig: ${arr.length} אטומי-Dart נמדדו · עם חריץ-מספר ${arr.filter((a) => a.fieldDemo.includes('0')).length} · הדגשת-מספר ≥1.4: ${kpi} · חריצים בברירת-מחדל (Text בלי עיצוב-שקע): ${dflt} · משפחה ידועה ${arr.filter((a) => a.family).length}`);
}
