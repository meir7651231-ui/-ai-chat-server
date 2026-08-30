/** חוט · site-donate-url — קישור-התרומה האפקטיבי של עמוד-השיווק:
 *  ‏site.donateUrl הישיר, ואם אין — ‏integrations.payments.payUrl; אחרת null.
 *  חוזה: site-donate-url.contract.md
 *  חולץ כלשונו מ-maor/src/lib/publicSite.ts:247-254 — טהור, אפס שקעים. */
export function siteDonateUrl(config, T) {
  const direct = config.site?.donateUrl;
  if (typeof direct === T.k1 && direct)
    return direct;
  const pay = config.integrations?.payments;
  const payUrl = pay && typeof pay.payUrl === T.k1 ? pay.payUrl : '';
  return payUrl || null;
}
