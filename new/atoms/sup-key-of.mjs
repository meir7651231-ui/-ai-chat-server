/** חוט · sup-key-of — מפתח-הפירוק של תומך (forWho מחוטא; ריק ⇒ משותף).
 *  חוזה: sup-key-of.contract.md · חולץ כלשונו מ-maor/src/lib/supporterPartition.ts:26-34;
 *  הקבוע-השכן SHARED_SUP_KEY הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function supKeyOf(sp, sharedSupKey) {
  const f = (sp.forWho ?? '').trim();
  return f || sharedSupKey;
}
