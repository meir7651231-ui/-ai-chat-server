import { decodeCsvBuffer } from './decode-csv-buffer.mjs';
const B = (arr) => Uint8Array.from(arr).buffer;
const utf16leNoBom = (s) => { const a = []; for (const ch of s) { const c = ch.charCodeAt(0); a.push(c & 0xff, c >> 8); } return B(a); };
const C = [
  ['BOM utf-16le', B([0xff, 0xfe, 0xd0, 0x05]), 'א'],
  ['BOM utf-16be', B([0xfe, 0xff, 0x05, 0xd0]), 'א'],
  ['utf-16le בלי BOM (גדוש-NUL)', utf16leNoBom('abc,def'), 'abc,def'],
  ['utf-8 עברי תקין', new TextEncoder().encode('שלום,עולם').buffer, 'שלום,עולם'],
  ['windows-1255 (utf-8 שבור)', B([0xe0, 0xe1]), 'אב'],
  ['ריק', B([]), ''],
];
let f = 0;
for (const [name, buf, want] of C) {
  const got = decodeCsvBuffer(buf);
  if (got !== want) { console.error(`✗ ${name} ⇒ ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ decode-csv-buffer: 6 דוגמאות-חוזה — ירוק');
