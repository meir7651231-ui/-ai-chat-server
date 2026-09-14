// gen/inventory.mjs — המלאי המלא (§21: תת-ספירה = אזעקה). סופר, לא מעריך. Node בלבד (קריאת-דיסק).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readShelf } from './shelf.mjs';
import { readDartShelf, hasDart } from './prove-dart.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function inventory() {
  const shelf = readShelf();
  const atomsDir = path.join(ROOT, 'new/atoms');
  const jsFiles = fs.readdirSync(atomsDir).filter((f) => f.endsWith('.mjs') && !f.endsWith('.test.mjs')).length;
  const fns = shelf.filter((a) => a.kind === 'fn').length, consts = shelf.filter((a) => a.kind === 'const').length;
  const tFromData = shelf.filter((a) => a.tSource && /-(strings|data)$/.test(a.tSource)).length;
  const dartOnly = readDartShelf().length;
  const idx = path.join(ROOT, 'machtzev/generator/atom-index-full.json');
  const all = fs.existsSync(idx) ? JSON.parse(fs.readFileSync(idx, 'utf8')) : [];
  const display = all.filter((x) => x.layer === 'display').length;
  const dartTwins = all.filter((x) => x.layer === 'logic' && x.file.startsWith('dart-maor/')).length;
  return {
    rows: [
      { layer: 'JS · פונקציות טהורות (new/atoms)', count: fns, connected: 'הוכחה-בריצה בדפדפן ובמסוף; מוטבעות באפליקציה', state: 'on' },
      { layer: 'JS · אטומי-דאטה/קבועים (-strings · -data)', count: consts, connected: `${tFromData} מהם הם הקבועים (T) של הפונקציות — נטענים מהם ישירות`, state: 'on' },
      { layer: 'JS · אסינכרוניים / ריבוי-ייצוא', count: jsFiles - fns - consts, connected: 'כתיבה ל-db/fs עם שקעים — לא רצים בלי חיבור; לא מחוברים', state: 'off' },
      { layer: 'Dart · לוגיקה שרק ב-Dart (new/dart · dart-boxes)', count: dartOnly, connected: hasDart() ? 'הוכחה-בריצה ב-Dart במסוף (תוצאות ארוזות בסטודיו); לא ניתן להטביע ב-HTML' : 'אין Dart בסביבה — לא הוכחו', state: hasDart() ? 'on' : 'off' },
      { layer: 'Dart · תאומי ה-JS (dart-maor)', count: dartTwins, connected: 'אותם אטומים כמו ה-JS, מומרים — מחוברים דרך צורת ה-JS', state: 'on' },
      { layer: 'Dart · תצוגה (Flutter widgets)', count: display, connected: 'מסלול-Flutter: `node gen/build.mjs <ספק> --flutter` ⇒ מודולי-Dart דרך הדלת של המחצב, האטומים נבחרים לפי צורה (במסוף; הסטודיו בונה HTML). קומפילציה = Flutter SDK + buildsmart, לא כאן', state: 'on' },
    ],
  };
}
