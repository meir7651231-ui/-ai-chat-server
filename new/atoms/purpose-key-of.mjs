/** חוט · purpose-key-of — מפתח-הפיצול של תרומה: purpose מחוטא; ריק ⇒ '_shared_'.
 *  חוזה: purpose-key-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/donationPartition.ts:24-33 (תורגם TS→JS); טהור,
 *  אפס שקעים. מפתח-הפיצול = purpose (הרשאה-פר-עובד), לא designation (SHOP9). */
export const makeSHARED_PURPOSE_KEY = (T) => (T.k1);

export function purposeKeyOf(d, T) {
  const p = (d.purpose ?? '').trim();
  return p || makeSHARED_PURPOSE_KEY(T);
}
