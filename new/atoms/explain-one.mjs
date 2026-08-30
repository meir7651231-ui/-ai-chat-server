/** חוט · explain-one — תיאור-שיחה יחיד: קונפיג-טלפוניה ⇒ tenant ⇒ אימות ⇒ סימולציה. חוזה: explain-one.contract.md
 *  חולץ כלשונו מ-maor/src/components/telephony/lib.ts:199-206; השכנים
 *  telephonyToTenant / validateTenant / explainCall / anchorToday הוזרקו כשקעים (חוק-1). */
export function explainOne(tc, orgName, tenantId, call, telephonyToTenant, validateTenant, explainCall, anchorToday, T) {
  const raw = telephonyToTenant(tc, orgName, tenantId);
  const v = validateTenant(raw);
  if (!v.ok) return { summary: T.k1 + v.errors.join(' · '), outcome: T.k2, reason: '' };
  const e = explainCall(v.tenant, call, { anchorDate: anchorToday(), calendarWindow: T.k3 });
  return { summary: e.summary, outcome: e.outcome, reason: e.reason };
}
