/** חוט · phone-issue — אבחון תקינות מספר-טלפון (null=תקין).
 *  חוזה: phone-issue.contract.md · טהור, אפס-שקעים.
 *  חולץ כלשונו מ-maor/src/lib/audit.ts (כולל העוזר-הפרטי digits). */

export function phoneIssue(p, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const digits = (x) => (x || '').replace(/\D/g, '');

  if (!p || p === '-') return null;
  const d = digits(p);
  if ((d.length === 9 || d.length === T.k6) && d[0] === '0') return null;
  if (d.length === 8) return T.k1 + p;
  if (d.length < 7) return T.k2 + p;
  if (d[0] !== '0') return T.k3 + p;
  return T.k4 + d.length + T.k5 + p;
}
