/** בדיקת-קצה · קופסת csvx — דרך הקופסה בלבד (חוק-4; מייבאת רק את הקופסה-שלה).
 *  ה-DoD נכתב לפני הקוד ב-csvx.contract.md §"דוגמאות מחייבות" — כאן ההוכחה. */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import {
  csvEscape, toCsv, decodeCsvBuffer, readCsvFileText, parseCsv, parseAnyDate, downloadCsv,
} from './csvx.mjs';

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => { try { assert.deepStrictEqual(a, b); } catch { console.error(`✗ ${msg}: got ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); f = 1; } };

// 1) csvEscape — הזרקה + ציטוט + null (דוגמה 1)
eq(csvEscape('=HACK'), "'=HACK", 'csvEscape הזרקה');
eq(csvEscape('+972'), "'+972", 'csvEscape פלוס');
eq(csvEscape('@x'), "'@x", 'csvEscape שטרודל');
eq(csvEscape('עם,פסיק'), '"עם,פסיק"', 'csvEscape פסיק');
eq(csvEscape('a"b'), '"a""b"', 'csvEscape גרש');
eq(csvEscape('שתי\nשורות'), '"שתי\nשורות"', 'csvEscape שורה');
eq(csvEscape(null), '', 'csvEscape null');
eq(csvEscape(0), '0', 'csvEscape אפס');

// 2) toCsv — BOM + escape מחווט (דוגמה 2)
eq(toCsv([['א', 'ב'], ['=x', '2']]), '﻿א,ב\n\'=x,2', 'toCsv BOM+escape');
eq(toCsv([]), '﻿', 'toCsv ריק');

// 3) parseCsv — שדות-מצוטטים/CRLF/TSV/שורות-ריקות (דוגמה 3)
eq(parseCsv('a,b\r\n"c,d",e\n'), [['a', 'b'], ['c,d', 'e']], 'parseCsv ציטוט+CRLF');
eq(parseCsv('x\ty\nz\tw'), [['x', 'y'], ['z', 'w']], 'parseCsv TSV-אוטו');
eq(parseCsv('\n\n'), [], 'parseCsv שורות-ריקות');
eq(parseCsv('﻿hi,שלום'), [['hi', 'שלום']], 'parseCsv BOM-מקדים מוסר');
eq(parseCsv('"line\nbreak",z'), [['line\nbreak', 'z']], 'parseCsv שורה-בתוך-שדה');
eq(parseCsv('"he said ""hi"""'), [['he said "hi"']], 'parseCsv גרש-כפול');

// 4) parseAnyDate — ISO/DMY/אקסל/ריק (דוגמה 4)
eq(parseAnyDate('2015-06-31'), '', 'parseAnyDate ISO-בלתי-אפשרי');
eq(parseAnyDate('2024-12-31'), '2024-12-31', 'parseAnyDate ISO-תקין');
eq(parseAnyDate('31/12/2024'), '2024-12-31', 'parseAnyDate DMY-לוכסן');
eq(parseAnyDate('5.3.2024'), '2024-03-05', 'parseAnyDate DMY-נקודה');
eq(parseAnyDate('44927'), '2023-01-01', 'parseAnyDate אקסל-סידורי');
eq(parseAnyDate(''), '', 'parseAnyDate ריק');
eq(parseAnyDate('לא-תאריך'), '', 'parseAnyDate זבל');
eq(parseAnyDate('  '), '', 'parseAnyDate רווחים');

// 5) decodeCsvBuffer + readCsvFileText — קידודים (דוגמה 5)
const u16le = (s) => { const b = new Uint8Array(2 + s.length * 2); b[0] = 0xff; b[1] = 0xfe; for (let i = 0; i < s.length; i++) { b[2 + i * 2] = s.charCodeAt(i) & 0xff; b[3 + i * 2] = s.charCodeAt(i) >> 8; } return b.buffer; };
const u8bom = (s) => { const body = new TextEncoder().encode(s); const b = new Uint8Array(3 + body.length); b.set([0xef, 0xbb, 0xbf]); b.set(body, 3); return b.buffer; };
eq(decodeCsvBuffer(u16le('hi')), 'hi', 'decode UTF-16LE BOM');
eq(decodeCsvBuffer(u8bom('שלום')).replace(/^﻿/, ''), 'שלום', 'decode UTF-8 BOM');
eq(decodeCsvBuffer(new TextEncoder().encode('plain,csv').buffer), 'plain,csv', 'decode UTF-8 רגיל');
const bufWide = u16le('שלום');
const txt = await readCsvFileText({ arrayBuffer: async () => bufWide });
eq(txt, 'שלום', 'readCsvFileText decode-מחווט');

// 6) downloadCsv — שער + DOM מוזרק (דוגמה 6)
{ // חסום ⇒ notify מורץ, אפס נגיעת-DOM
  let notified = 0, touched = 0;
  downloadCsv('x.csv', [['a']], {
    blocked: true, notify: () => notified++,
    createElement: () => { touched++; return {}; },
    createObjectURL: () => { touched++; return 'blob:'; },
    revokeObjectURL: () => { touched++; }, setTimeout: () => { touched++; },
  });
  ok(notified === 1 && touched === 0, 'downloadCsv חסום: notify=1 ואפס-DOM');
}
{ // מותר ⇒ Blob(CSV_MIME, toCsv), download-שם, click, setTimeout(_,5000)
  let capturedBlob = null, clicked = 0, ms = -1;
  const el = { click: () => { clicked++; } };
  downloadCsv('report.csv', [['=x', 'ב']], {
    blocked: false, notify: null,
    createElement: (tag) => { assert.strictEqual(tag, 'a'); return el; },
    createObjectURL: (blob) => { capturedBlob = blob; return 'blob:u'; },
    revokeObjectURL: () => {}, setTimeout: (_fn, m) => { ms = m; },
  });
  ok(capturedBlob && capturedBlob.type === 'text/csv;charset=utf-8', 'downloadCsv mime=CSV+BOM');
  ok(el.download === 'report.csv', 'downloadCsv שם-קובץ');
  ok(el.href === 'blob:u', 'downloadCsv href=object-url');
  ok(clicked === 1, 'downloadCsv click נקרא');
  ok(ms === 5000, 'downloadCsv setTimeout=5000');
  // התוכן שנשלח ל-Blob = toCsv(rows) המחווט (BOM + escape) — decode עם ignoreBOM
  // כי Blob.text() בולע את ה-U+FEFF המוביל.
  const raw = new TextDecoder('utf-8', { ignoreBOM: true }).decode(await capturedBlob.arrayBuffer());
  eq(raw, '﻿\'=x,ב', 'downloadCsv תוכן=toCsv מחווט (BOM+escape)');
}

/* 🛡 מגן-הכרעה: הבדיקה קוראת את מקור-הקופסה ומאשרת הכרעות verbatim (דפוס theme.test). */
const src = readFileSync(new URL('./csvx.mjs', import.meta.url), 'utf8');
ok(src.includes("const CSV_MIME = 'text/csv;charset=utf-8';"), 'מגן: CSV_MIME verbatim (csvx.ts:30)');
ok(src.includes('const REVOKE_MS = 5000;'), 'מגן: REVOKE_MS=5000 (csvx.ts:33)');
ok(src.includes('toCsvAtom(rows, csvEscape)'), 'מגן: toCsv מחווט escape=csvEscape');
ok(src.includes('readCsvFileTextAtom(file, decodeCsvBuffer)'), 'מגן: readCsvFileText מחווט decodeCsvBuffer');
ok(src.includes('if (!guardExport(blocked, notify)) return'), 'מגן: שער-יציאה לפני DOM');
ok(/setTimeout\(\(\) => revokeObjectURL\(a\.href\), REVOKE_MS\)/.test(src), 'מגן: שחרור-URL אחרי click');

if (f) process.exit(1);
console.log('✓ קופסת-csvx: 7 חוטים מחווטים — escape/BOM/CRLF/TSV/קידודים/תאריכים/שער-הורדה + מגן-הכרעה');
