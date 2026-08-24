/** חוט · parse-vcards — פענוח קובץ vCard שלם → רשימת אנשי-קשר (סדר-הקובץ).
 *  חוזה: parse-vcards.contract.md · שקעים: unfoldLines, splitProperty,
 *  decodeValue, phoneLabel, joinAddress (שכני-הקובץ שוקעו — חוק-1).
 *  חולץ כלשונו מ-maor/src/lib/vcardImport.ts:153-228. */
export function parseVcards(text, unfoldLines, splitProperty, decodeValue, phoneLabel, joinAddress) {
  const lines = unfoldLines(text || '');
  const out = [];
  let cur = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^BEGIN:VCARD$/i.test(trimmed)) {
      cur = { fullName: '', family: '', given: '', phones: [], emails: [], org: '', title: '', address: '', note: '' };
      continue;
    }
    if (/^END:VCARD$/i.test(trimmed)) {
      if (cur) {
        if (!cur.fullName) {
          cur.fullName = [cur.given, cur.family].filter(Boolean).join(' ').trim();
        }
        out.push(cur);
      }
      cur = null;
      continue;
    }
    if (!cur) continue;
    const prop = splitProperty(line);
    if (!prop) continue;
    const { name, params, value } = prop;
    switch (name) {
      case 'FN':
        cur.fullName = decodeValue(value, params).trim();
        break;
      case 'N': {
        const decoded = decodeValue(value, params);
        const segs = decoded.split(';');
        cur.family = (segs[0] || '').trim();
        cur.given = (segs[1] || '').trim();
        break;
      }
      case 'TEL': {
        const v = value.trim();
        if (v) cur.phones.push({ value: v, label: phoneLabel(params) });
        break;
      }
      case 'EMAIL': {
        const v = decodeValue(value, params).trim();
        if (v) cur.emails.push(v);
        break;
      }
      case 'ORG': {
        const v = decodeValue(value, params).replace(/;+$/, '').trim();
        if (v && v.toLowerCase() !== 'null') cur.org = v;
        break;
      }
      case 'TITLE':
        cur.title = decodeValue(value, params).trim();
        break;
      case 'ADR':
        cur.address = joinAddress(value, params);
        break;
      case 'NOTE':
        cur.note = decodeValue(value, params).trim();
        break;
      default:
        break; // PHOTO/URL/X-* וכו' — מדולגים
    }
  }
  return out;
}
