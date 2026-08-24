import { siteVocab } from './site-vocab.mjs';
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
