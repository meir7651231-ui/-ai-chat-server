/** חוט · decode-csv-buffer — זיהוי-קידוד ופענוח בייטי-CSV לטקסט. חוזה: decode-csv-buffer.contract.md
 *  חולץ כלשונו מ-maor/src/lib/csvx.ts:43-63 (עצמאי — סטנדרט-שפה בלבד). */
export function decodeCsvBuffer(buf, T) {
  const bytes = new Uint8Array(buf);
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder(T.k1).decode(buf);
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder(T.k2).decode(buf);
  const probe = bytes.subarray(0, 400);
  let nuls = 0;
  for (const b of probe) if (b === 0) nuls++;
  if (probe.length > 8 && nuls > probe.length / 5) return new TextDecoder(T.k1).decode(buf);
  const utf8 = new TextDecoder(T.k3).decode(buf);
  if (!utf8.includes('�')) return utf8;
  try {
    return new TextDecoder(T.k4).decode(buf);
  } catch {
    return utf8;
  }
}
