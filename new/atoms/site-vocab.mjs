/** חוט · site-vocab — תוויות-פעולה של האתר-הציבורי תלויות-סוג-ארגון:
 *  מסחרי (בלי §46) ⇒ "צרו קשר"; עמותתי ⇒ "לתרומה" (+♡ בצ׳יפים).
 *  חוזה: site-vocab.contract.md
 *  חולץ כלשונו מ-maor/src/lib/publicSite.ts:153-176 — טהור, אפס שקעים. */
export function siteVocab(commercial, lang) {
  const en = lang === 'en';
  if (commercial) {
    return {
      heroCta: en ? 'Get in touch' : 'צרו קשר',
      navCta: en ? 'Contact' : 'צרו קשר',
      give: en ? 'Contact us' : 'צרו קשר',
      giveLabel: en ? 'Your request' : 'הפנייה שלך',
      commercial: true,
    };
  }
  return {
    heroCta: en ? 'Donate now' : 'לתרומה עכשיו',
    navCta: (en ? 'Donate' : 'לתרומה') + ' ♡',
    give: (en ? 'Donate' : 'לתרומה') + ' ♡',
    giveLabel: en ? 'Your gift' : 'התרומה שלך',
    commercial: false,
  };
}
