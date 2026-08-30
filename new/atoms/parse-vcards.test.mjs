import { parseVcards as __pure_parseVcards } from './parse-vcards.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_parseVcards_PARSE_VCARDS_T = {
  k1: "TEL",
  k2: "EMAIL",
  k3: "ORG",
  k4: "null",
  k5: "TITLE",
  k6: "ADR",
  k7: "NOTE",
};
const parseVcards = (...a) => __pure_parseVcards(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_parseVcards_PARSE_VCARDS_T);

// ── שקעים מינימליים כחוזיהם (בלי QP — קלטי-הבדיקה נקיים) ──
const unfoldLines = (text) => text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
const splitProperty = (line) => {
  const colon = line.indexOf(':');
  if (colon < 0) return null;
  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const segs = head.split(';');
  const name = (segs.shift() || '').trim().toUpperCase();
  if (!name) return null;
  return { name, params: segs, value };
};
const decodeValue = (value) => value;
const phoneLabel = (params) => (params.some((p) => p.toUpperCase().includes('CELL')) ? 'נייד' : '');
const joinAddress = (value) => value.split(';').map((s) => s.trim()).filter(Boolean).join(', ');
const parse = (text) => parseVcards(text, unfoldLines, splitProperty, decodeValue, phoneLabel, joinAddress);

let f = 0;
// 1: שני כרטיסים בסדר-הקובץ
const two = parse('BEGIN:VCARD\nFN:אבי כהן\nEND:VCARD\nBEGIN:VCARD\nFN:שרה לוי\nEND:VCARD\n');
if (two.length !== 2 || two[0].fullName !== 'אבי כהן' || two[1].fullName !== 'שרה לוי') { console.error('✗ 1 שני כרטיסים', two); f = 1; }
// 2: בלי FN — הרכבה מ-N (פרטי ואז משפחה)
const n = parse('BEGIN:VCARD\nN:לוי;דוד;;;\nEND:VCARD')[0];
if (!n || n.fullName !== 'דוד לוי' || n.family !== 'לוי' || n.given !== 'דוד') { console.error('✗ 2 הרכבת-שם מ-N', n); f = 1; }
// 3: טלפון עם תווית מהשקע
const tel = parse('BEGIN:VCARD\nFN:א\nTEL;CELL:050-1234567\nEND:VCARD')[0];
if (tel.phones.length !== 1 || tel.phones[0].value !== '050-1234567' || tel.phones[0].label !== 'נייד') { console.error('✗ 3 טלפון+תווית', tel.phones); f = 1; }
// 4: ORG 'null' מסונן · ; סופיים נחתכים
if (parse('BEGIN:VCARD\nFN:א\nORG:null\nEND:VCARD')[0].org !== '') { console.error('✗ 4א ORG null'); f = 1; }
if (parse('BEGIN:VCARD\nFN:א\nORG:מאור;;\nEND:VCARD')[0].org !== 'מאור') { console.error('✗ 4ב ORG ; סופיים'); f = 1; }
// 5: כתובת דרך joinAddress
if (parse('BEGIN:VCARD\nFN:א\nADR;HOME:;;הרצל 5;תל אביב;;;\nEND:VCARD')[0].address !== 'הרצל 5, תל אביב') { console.error('✗ 5 כתובת'); f = 1; }
// 6: VERSION/PHOTO/URL ושורות-חוץ מדולגים
const skip = parse('X-JUNK:1\nBEGIN:VCARD\nVERSION:3.0\nFN:א\nPHOTO:base64data\nURL:https://x\nEND:VCARD');
if (skip.length !== 1 || skip[0].fullName !== 'א' || skip[0].note !== '' || skip[0].org !== '') { console.error('✗ 6 דילוגים', skip); f = 1; }
// 7: קלט ריק ⇒ [] · כרטיס ריק נדחף (בלי סינון-זבל כאן)
if (parse('').length !== 0) { console.error('✗ 7א ריק'); f = 1; }
const empty = parse('BEGIN:VCARD\nEND:VCARD');
if (empty.length !== 1 || empty[0].fullName !== '' || empty[0].phones.length !== 0) { console.error('✗ 7ב כרטיס-ריק נדחף', empty); f = 1; }
if (f) process.exit(1);
console.log('✓ parse-vcards: 7 דוגמאות-חוזה — ירוק');
