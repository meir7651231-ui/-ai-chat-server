// בדיקת-צילום · parse-xlsx-sheet-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PARSE_XLSX_SHEET_T } from './parse-xlsx-sheet-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PARSE_XLSX_SHEET_T), "{\"k1\":\"xl/sharedStrings.xml\",\"k2\":\"inlineStr\"}");
console.log('OK parse-xlsx-sheet-strings');
