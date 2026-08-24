/** בדיקת-קצה · קופסת vcard-import — דרך הקופסה בלבד. חוזה: vcard-import.contract.md
 *  DoD: node new/boxes/vcard-import.test.mjs ⇒ exit 0. */
import { readFileSync } from 'node:fs';
import assert from 'node:assert';
import { parseVcards, isJunkContact, importableContacts, contactToRow, decodeQuotedPrintable }
  from './vcard-import.mjs';

let f = 0;
const eq = (got, want, msg) => { try { assert.deepStrictEqual(got, want); } catch { console.error('✗ ' + msg + ' ⇒ ' + JSON.stringify(got)); f = 1; } };

// 1) QP — עברית אמיתית (עדשה-עוינת: המקור מטפל, האטום-הישן זרק HEX2)
eq(decodeQuotedPrintable('=D7=A7=D7=99=D7=A8'), 'קיר', 'QP קיר');
eq(decodeQuotedPrintable('Abc 123'), 'Abc 123', 'QP ascii');

// 2) קובץ בן 3 כרטיסים (דוגמת-החוזה §3)
const vcf = [
  'BEGIN:VCARD', 'VERSION:2.1',
  'N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:=D7=9B=D7=94=D7=9F;=D7=9E=D7=90=D7=99=D7=A8;;;',
  'FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:=D7=9E=D7=90=D7=99=D7=A8 =D7=9B=D7=94=D7=9F',
  'TEL;CELL:050-1234567', 'TEL;HOME:03-9998888',
  'EMAIL:maor@example.com', 'ORG;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:=D7=97=D7=A1=D7=93;',
  'TITLE:Manager', 'ADR;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:;;=D7=A8=D7=97=D7=95=D7=91 1;=D7=AA=D7=9C =D7=90=D7=91=D7=99=D7=91;;;',
  'NOTE:hello', 'END:VCARD',
  'BEGIN:VCARD', 'FN:Junk', 'TEL:100', 'END:VCARD',
  'BEGIN:VCARD', 'TEL:0501112222', 'END:VCARD',
].join('\r\n');

const parsed = parseVcards(vcf);
eq(parsed.length, 3, 'parsed count');
eq(parsed[0], {
  fullName: 'מאיר כהן', family: 'כהן', given: 'מאיר',
  phones: [{ value: '050-1234567', label: 'נייד' }, { value: '03-9998888', label: 'בית' }],
  emails: ['maor@example.com'], org: 'חסד', title: 'Manager',
  address: 'רחוב 1, תל אביב', note: 'hello',
}, 'c0');
eq(isJunkContact(parsed[1]), true, 'c1 junk (טלפון 100)');
eq(isJunkContact(parsed[2]), true, 'c2 junk (בלי-שם)');
eq(importableContacts(vcf).length, 1, 'importable count');
eq(contactToRow(parsed[0]), {
  name: 'מאיר כהן', phone: '050-1234567', phone2: '03-9998888',
  email: 'maor@example.com', address: 'רחוב 1, תל אביב', notes: '🏢 חסד · Manager · hello',
}, 'row0');

// 3) תווית-טלפון עברית מותאמת (X-CUSTOM QP)
const vcf2 = ['BEGIN:VCARD', 'FN:Test',
  'TEL;X-CUSTOM(CHARSET=UTF-8,ENCODING=QUOTED-PRINTABLE,=D7=A0=D7=99=D7=99=D7=93):0509999999',
  'END:VCARD'].join('\n');
eq(parseVcards(vcf2)[0].phones, [{ value: '0509999999', label: 'נייד' }], 'custom hebrew label');

// 4) קלט-קצה — ריק/null (עדשה-עוינת)
eq(parseVcards(''), [], 'empty');
eq(parseVcards(null), [], 'null');
eq(importableContacts(''), [], 'importable empty');

// 5) 🛡 מגן-הכרעה — הכרעות-החיווט verbatim במקור-הקופסה
const src = readFileSync(new URL('./vcard-import.mjs', import.meta.url), 'utf8');
const guard = (needle, msg) => { if (!src.includes(needle)) { console.error('✗ מגן: ' + msg); f = 1; } };
guard('const HEX2 = /^[0-9A-Fa-f]{2}$/', 'רגקס HEX2 (פער-האטום)');
guard("CELL: 'נייד'", 'מילון-תוויות CELL→נייד');
guard("VOICE: '',", 'מילון-תוויות VOICE→ריק');
guard("PREF: '',", 'מילון-תוויות PREF→ריק');
guard('_parseVcards(text, unfoldLines, splitProperty, decodeValue, phoneLabel, joinAddress)', 'הזרקת-5-שקעים');
guard('_isJunkContact(c, digitsOnly)', 'הזרקת-שקע-digitsOnly');

if (f) process.exit(1);
console.log('✓ קופסת-vcard-import: QP-עברית + 3-כרטיסים (זבל/בלי-שם) + תווית-מותאמת + קצה-ריק/null + מגן-הכרעה — ירוק');
