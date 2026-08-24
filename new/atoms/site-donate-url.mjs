/** חוט · site-donate-url — קישור-התרומה האפקטיבי של עמוד-השיווק:
 *  ‏site.donateUrl הישיר, ואם אין — ‏integrations.payments.payUrl; אחרת null.
 *  חוזה: site-donate-url.contract.md
 *  חולץ כלשונו מ-maor/src/lib/publicSite.ts:247-254 — טהור, אפס שקעים. */
export function siteDonateUrl(config) {
  const direct = config.site?.donateUrl;
  if (typeof direct === 'string' && direct)
    return direct;
  const pay = config.integrations?.payments;
  const payUrl = pay && typeof pay.payUrl === 'string' ? pay.payUrl : '';
  return payUrl || null;
}
