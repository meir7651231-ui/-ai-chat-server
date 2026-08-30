import { siteVocab as __pure_siteVocab } from './site-vocab.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_siteVocab_SITE_VOCAB_T = {
  k1: "Get in touch",
  k2: "צרו קשר",
  k3: "Contact",
  k4: "Contact us",
  k5: "Your request",
  k6: "הפנייה שלך",
  k7: "Donate now",
  k8: "לתרומה עכשיו",
  k9: "Donate",
  k10: "לתרומה",
  k11: "Your gift",
  k12: "התרומה שלך",
};
const siteVocab = (...a) => __pure_siteVocab(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_siteVocab_SITE_VOCAB_T);
const C = [
  [false, 'he', { heroCta: 'לתרומה עכשיו', navCta: 'לתרומה ♡', give: 'לתרומה ♡', giveLabel: 'התרומה שלך', commercial: false }],
  [false, 'en', { heroCta: 'Donate now', navCta: 'Donate ♡', give: 'Donate ♡', giveLabel: 'Your gift', commercial: false }],
  [true, 'he', { heroCta: 'צרו קשר', navCta: 'צרו קשר', give: 'צרו קשר', giveLabel: 'הפנייה שלך', commercial: true }],
  [true, 'en', { heroCta: 'Get in touch', navCta: 'Contact', give: 'Contact us', giveLabel: 'Your request', commercial: true }],
];
let f = 0;
for (const [commercial, lang, w] of C) {
  const g = siteVocab(commercial, lang);
  if (JSON.stringify(g) !== JSON.stringify(w)) {
    console.error(`✗ (${commercial},'${lang}') ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);
    f = 1;
  }
}
// דוגמה 5: יידיש נופלת לעברית — זהה-ביט ל-(false,'he')
if (JSON.stringify(siteVocab(false, 'yi')) !== JSON.stringify(siteVocab(false, 'he'))) {
  console.error("✗ (false,'yi') אינו זהה ל-(false,'he')");
  f = 1;
}
if (f) process.exit(1);
console.log('✓ site-vocab: 5 דוגמאות-חוזה — ירוק');
