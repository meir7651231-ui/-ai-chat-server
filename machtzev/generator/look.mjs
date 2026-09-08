// 🎨 look — מצב-המראה של הריצה (GENMAX·G28 · הכרעה-28). מודול-זעיר בלי תלויות כדי ש-render-ds ו-particles יקראו אותו בלי מעגל.
//   'dark' (ברירת-מחדל) ⇒ ביט-זהה לכל מה שהיה (חוק-7) · 'paper' ⇒ עור-הנייר של «בלגן»: PureScope(skins.paper · t-balagan · fontSets.heebo)
//   בשורש, כרום-DS דרך DsLook, אפס-אמוג׳י כאייקון (גליף-מוביל בקבוע נחתך — L98), ואטום שלא לובש עור (צבע-קשיח) נפסל בחיפוש-הפתוח.
import fs from 'node:fs';
import path from 'node:path';
import * as R from '../root.mjs';

let LOOK = 'dark';
export const setLook = (l) => { LOOK = l || 'dark'; };
export const getLook = () => LOOK;
export const isPaper = () => LOOK === 'paper';
const GLYPH_RE = /^(?:[\p{Extended_Pictographic}☀-➿⬀-⯿\u{1F000}-\u{1FAFF}][️‍]?)+\s*/u;
export const stripGlyph = (s) => String(s).replace(GLYPH_RE, '');

// אטום "לובש-עור" = forge (כל צבע דרך DsSeam) או כרום-DS (DsLook) — או קובץ בלי צבע-קשיח. צבע-קשיח (חוץ משקוף) ⇒ לא-לובש ⇒ בנייר נפסל.
// צבע-קשיח = ליטרל שאינו שקוף: Color(0x…) · Colors.x · Color.fromARGB/RGBO (DsTokens/DsLook/skin.* = טוקנים, לא ליטרל)
export const HARD_COLOR = /Color\(0x(?!00000000)[0-9A-Fa-f]{8}\)|Colors\.(?!transparent\b)[a-z]|Color\.from(?:ARGB|RGBO)\(|BsTokens\.(?:brand|brandDark|danger|dangerDark|success)\b/;   // BsTokens.brand/סמנטי = פלטת-הלגאסי הקבועה (כתום), לא חריץ; inkLight/mutedLight/space = נייטרלים
const CACHE = new Map();
export function skinWired(file) {
  if (!file) return true;
  const f = file.startsWith('dart-') ? file : 'dart-ui-bs/' + file;   // atlas: 'premium/x.dart' · 'ds/ds.dart' = תחת dart-ui-bs/
  if (/^dart-ui-bs\/ds\//.test(f)) return true;   // כרום-DS = DsLook (הליטרלים שבו הם ענף-הכהה) · forge נבדק בפועל (8 אטומים עם ליטרל-מותאם נשארו)
  if (CACHE.has(f)) return CACHE.get(f);
  const p = path.join(R.ROOT, 'new', f);
  const src = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  const ok = !HARD_COLOR.test(src);
  CACHE.set(file, ok); return ok;
}
