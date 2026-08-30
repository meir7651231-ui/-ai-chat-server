/** חוט · fold-ics-line — קיפול-שורת-ICS ל-≤75 אוקטטים (RFC 5545). חוזה: fold-ics-line.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ics.ts:40-58; ‏TextEncoder = סטנדרט (מותר בחוק-1). */

export function foldIcsLine(line) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const enc = new TextEncoder();

  const out = [];
  let cur = '';
  let curBytes = 0;
  let limit = 75; // השורה הראשונה; שורות-המשך: 74 + רווח מוביל
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (curBytes + b > limit) {
      out.push(cur);
      cur = ' ' + ch;
      curBytes = 1 + b;
      limit = 75;
    } else {
      cur += ch;
      curBytes += b;
    }
  }
  if (cur) out.push(cur);
  return out.length ? out : [''];
}
