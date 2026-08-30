import { parseXlsxSheet as __pure_parseXlsxSheet } from './parse-xlsx-sheet.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_parseXlsxSheet_PARSE_XLSX_SHEET_T = {
  k1: "xl/sharedStrings.xml",
  k2: "inlineStr",
};
const parseXlsxSheet = (...a) => __pure_parseXlsxSheet(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_parseXlsxSheet_PARSE_XLSX_SHEET_T);

// ── שקעים: unzipSync/strFromU8 סטאבים (מגישים XML מוכן); השאר כחוזיהם ──
const unzipSync = (bytes) => {
  if (bytes === 'BAD') throw new Error('not a zip');
  return bytes; // ה"בתים" בבדיקה = מפת-הקבצים עצמה
};
const strFromU8 = (s) => s; // הקבצים כבר מחרוזות
const unescapeXml = (s) => s
  .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&amp;/g, '&');
const readSharedStrings = (xml) => {
  const out = [];
  const siRe = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = siRe.exec(xml))) {
    const tRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let t; let s = '';
    while ((t = tRe.exec(m[1]))) s += t[1];
    out.push(unescapeXml(s));
  }
  return out;
};
const colRefToIndex = (ref) => {
  const m = /^([A-Z]+)/.exec(ref);
  if (!m) return 0;
  let n = 0;
  for (const ch of m[1]) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
};
const parse = (bytes) => parseXlsxSheet(bytes, unzipSync, strFromU8, readSharedStrings, colRefToIndex, unescapeXml);

const files = {
  'xl/sharedStrings.xml': '<sst><si><t>שם</t></si></sst>',
  'xl/worksheets/sheet1.xml':
    '<worksheet><sheetData>' +
    '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="C1" t="inlineStr"><is><t>אבי</t><t> כהן</t></is></c></row>' +
    '<row r="2"><c r="A2"><v>42</v></c><c r="B2"><v>a &amp; b</v></c></row>' +
    '</sheetData></worksheet>',
  'xl/worksheets/sheet2.xml':
    '<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>גיליון-שני</t></is></c></row></sheetData></worksheet>',
};

let f = 0;
// 1: unzip נכשל ⇒ []
if (parse('BAD').length !== 0) { console.error('✗ 1 נכשל-רך'); f = 1; }
// 2: אין גיליון ⇒ []
if (parse({ 'xl/sharedStrings.xml': '<sst/>' }).length !== 0) { console.error('✗ 2 אין-גיליון'); f = 1; }
const rows = parse(files);
// 3: shared string
if (rows[0][0] !== 'שם') { console.error('✗ 3 sharedStrings', rows[0]); f = 1; }
// 4: inlineStr משורשר
if (rows[0][2] !== 'אבי כהן') { console.error('✗ 4 inlineStr', rows[0]); f = 1; }
// 5: ריפוד-פער לפי r="C1"
if (rows[0].length !== 3 || rows[0][1] !== '') { console.error('✗ 5 ריפוד', rows[0]); f = 1; }
// 6: sheet1 נבחר (לא 'גיליון-שני')
if (rows.some((r) => r.includes('גיליון-שני'))) { console.error('✗ 6 בחירת-גיליון'); f = 1; }
// 7: ערך גולמי כמחרוזת + unescape
if (rows[1][0] !== '42' || rows[1][1] !== 'a & b') { console.error('✗ 7 גולמי/unescape', rows[1]); f = 1; }
if (f) process.exit(1);
console.log('✓ parse-xlsx-sheet: 7 דוגמאות-חוזה — ירוק');
