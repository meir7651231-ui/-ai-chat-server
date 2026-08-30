/** חוט · site-vocab — תוויות-פעולה של האתר-הציבורי תלויות-סוג-ארגון:
 *  מסחרי (בלי §46) ⇒ "צרו קשר"; עמותתי ⇒ "לתרומה" (+♡ בצ׳יפים).
 *  חוזה: site-vocab.contract.md
 *  חולץ כלשונו מ-maor/src/lib/publicSite.ts:153-176 — טהור, אפס שקעים. */
export function siteVocab(commercial, lang, T) {
  const en = lang === 'en';
  if (commercial) {
    return {
      heroCta: en ? T.k1 : T.k2,
      navCta: en ? T.k3 : T.k2,
      give: en ? T.k4 : T.k2,
      giveLabel: en ? T.k5 : T.k6,
      commercial: true,
    };
  }
  return {
    heroCta: en ? T.k7 : T.k8,
    navCta: (en ? T.k9 : T.k10) + ' ♡',
    give: (en ? T.k9 : T.k10) + ' ♡',
    giveLabel: en ? T.k11 : T.k12,
    commercial: false,
  };
}
