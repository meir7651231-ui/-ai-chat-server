/** 🪨 טיוטת-חוט (דרגת-מחצבה) · siteVocab — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/publicSite.ts:153-176 (24 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): siteVocab
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
/**
 * פותר טקסט רב-לשוני לשפה מבוקשת: מחרוזת ⇒ כמות-שהיא; מפה ⇒ השפה, ואם ריקה
 * ⇒ נפילה לעברית, ואז לערך הראשון הקיים. undefined/ריק ⇒ ''.
 */
