/** קופסת-חיבורים · ייבוא-אנשי-קשר (vCard/.vcf). חוזה: vcard-import.contract.md
 *  מחווטת את גרף-הקריאות של maor/src/lib/vcardImport.ts — המקום היחיד שבו החוטים
 *  נפגשים (חוקי-החשמלאי, LAW.md). ההכרעות (סדר-שדות, מילון-תוויות, כלל-ריכוך-QP)
 *  חיות כאן; שכני-המקור (unfold/split/decode/label/join/digits) הם חיווט-מקומי. */
import { parseVcards as __pure_parseVcards } from '../atoms/parse-vcards.mjs';
import { PARSE_VCARDS_T as __d_parseVcards_PARSE_VCARDS_T } from '../atoms/parse-vcards-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _parseVcards = (...a) => __pure_parseVcards(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_parseVcards_PARSE_VCARDS_T);
import { isJunkContact as _isJunkContact } from '../atoms/is-junk-contact.mjs';
import { importableContacts as _importableContacts } from '../atoms/importable-contacts.mjs';
import { contactToRow as _contactToRow } from '../atoms/contact-to-row.mjs';
import { VCARD_IMPORT_TERMS } from '../atoms/vcard-import-terms.mjs';

// ── פער-אטום מדווח (חוזה §⚠️): האטום decode-quoted-printable.mjs שבור (HEX2 לא-מוגדר,
//    השמטת vcardImport.ts:33 בתרגום-המכונה). אסור לי לשנות אטומים ⇒ פענוח-ה-QP חי כאן
//    כחיווט source-exact, ליד שכניו. הפער דווח לבעל-האטום. ──

// ── שכני-המקור (חיווט-מקומי — יחידות-מקור שאינן אטומים) ──
const HEX2 = /^[0-9A-Fa-f]{2}$/; // ⇐ vcardImport.ts:33 (הקבוע שהאטום השמיט)

/** פענוח QUOTED-PRINTABLE → UTF-8. כל `=XX` הוא בית; שאר ASCII כמות-שהוא. (מקור:39-57) */
function decodeQuotedPrintable(s) {
  const bytes = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '=' && i + 2 < s.length && HEX2.test(s.slice(i + 1, i + 3))) {
      bytes.push(parseInt(s.slice(i + 1, i + 3), 16));
      i += 2;
    } else {
      const cp = s.charCodeAt(i);
      bytes.push(cp <= 0xff ? cp : 0x3f /* '?' */);
    }
  }
  try {
    return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
  } catch {
    return s;
  }
}

/** איחוד שורות פיזיות → לוגיות: קיפול-vCard רגיל + ריכוך-QP רך (רק בשדה QP). (מקור:65-87) */
function unfoldLines(text) {
  const raw = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const out = [];
  let qpActive = false;
  for (const line of raw) {
    if (out.length && (line.startsWith(' ') || line.startsWith('\t'))) {
      out[out.length - 1] += line.slice(1);
      if (!out[out.length - 1].endsWith('=')) qpActive = false;
      continue;
    }
    if (out.length && qpActive && out[out.length - 1].endsWith('=')) {
      out[out.length - 1] = out[out.length - 1].slice(0, -1) + line;
      if (!out[out.length - 1].endsWith('=')) qpActive = false;
      continue;
    }
    out.push(line);
    qpActive = /ENCODING=QUOTED-PRINTABLE/i.test(line) && line.endsWith('=');
  }
  return out;
}

/** פיצול "NAME;PARAM;PARAM:VALUE" ל-{name,params[],value}. ה-`:` הראשון מפריד. (מקור:90-99) */
function splitProperty(line) {
  const colon = line.indexOf(':');
  if (colon < 0) return null;
  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const segs = head.split(';');
  const name = (segs.shift() || '').trim().toUpperCase();
  if (!name) return null;
  return { name, params: segs, value };
}

const hasParam = (params, token) => params.some((p) => p.toUpperCase().includes(token));

/** ערך-שדה מפוענח לפי הפרמטרים (QP אם צוין; אחרת גלמי). (מקור:105-107) */
function decodeValue(value, params) {
  return hasParam(params, 'QUOTED-PRINTABLE') ? decodeQuotedPrintable(value) : value;
}

// מילון-תוויות-הטלפון — הכרעה חיה-בקופסה (מקור:109-117).
const PHONE_LABELS = {
  CELL: VCARD_IMPORT_TERMS.k1,
  HOME: VCARD_IMPORT_TERMS.k2,
  WORK: VCARD_IMPORT_TERMS.k3,
  FAX: VCARD_IMPORT_TERMS.k4,
  MAIN: VCARD_IMPORT_TERMS.k5,
  VOICE: '',
  PREF: '',
};

/** תווית-טלפון קריאה: X-CUSTOM(…עברית…) מפוענח, אחרת מיפוי CELL/HOME/… (מקור:120-137) */
function phoneLabel(params) {
  for (const p of params) {
    const up = p.toUpperCase();
    if (up.startsWith('X-CUSTOM')) {
      const inner = p.slice(p.indexOf('(') + 1, p.lastIndexOf(')'));
      const parts = inner.split(',');
      const last = parts[parts.length - 1] || '';
      const decoded = /=[0-9A-Fa-f]{2}/.test(last) ? decodeQuotedPrintable(last) : last;
      if (decoded.trim()) return decoded.trim();
    }
  }
  for (const p of params) {
    const key = p.toUpperCase().trim();
    if (key in PHONE_LABELS && PHONE_LABELS[key]) return PHONE_LABELS[key];
  }
  return '';
}

/** ADR מובנה (po;ext;street;city;region;postal;country) → מחרוזת נקייה. (מקור:140-147) */
function joinAddress(value, params) {
  const decoded = decodeValue(value, params);
  return decoded
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(', ');
}

/** ספרות בלבד ממספר-טלפון (לזיהוי מספרי-זבל קצרים). (מקור:223) */
const digitsOnly = (s) => (s || '').replace(/\D/g, '');

// ── החיווט: הזרקת השקעים לאטומים לפי גרף-המקור ──
const wiredParseVcards = (text) =>
  _parseVcards(text, unfoldLines, splitProperty, decodeValue, phoneLabel, joinAddress);
const wiredIsJunk = (c) => _isJunkContact(c, digitsOnly);
const wiredImportable = (text) =>
  _importableContacts(text, wiredParseVcards, wiredIsJunk);

// ── החשיפה ──
export const parseVcards = wiredParseVcards;
export const isJunkContact = wiredIsJunk;
export const importableContacts = wiredImportable;
export const contactToRow = (c) => _contactToRow(c);
export { decodeQuotedPrintable };
