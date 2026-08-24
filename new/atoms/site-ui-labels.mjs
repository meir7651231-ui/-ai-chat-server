/** 🧬 אטום-נתונים · SITE_UI_LABELS — תוויות-ממשק מובנות פר-שפה של האתר-הציבורי
 *  (כותרות-סעיף, כפתורים, כיוון-כתיבה) — לא-מהקונפיג, קבועות. ‏3 שפות: he/en/yi.
 *  חוזה: site-ui-labels.contract.md
 *  מוצא: maor/src/lib/publicSite.ts:13-34 (הקבוע SITE_UI; נקרא-כאן site-ui-labels
 *  כי השם site-ui שמור לחוט-הפותר). הצריכה דרך שקע-הנתונים של החוט site-ui. */
export const SITE_UI_LABELS = {
  he: {
    donate: 'לתרומה', contact: 'צור קשר', enter: 'כניסה למערכת', services: 'מה אנחנו עושים',
    story: 'הסיפור שמאחורי', news: 'כל חודש — מה חדש', gallery: 'רגעים', campaign: 'הקמפיין שלנו',
    raised: 'גויסו', goal: 'יעד', daysLeft: 'ימים נותרו', call: 'חייגו', whatsapp: 'וואטסאפ',
    email: 'מייל', poweredBy: 'מופעל על-ידי מאור', dir: 'rtl',
  },
  en: {
    donate: 'Donate', contact: 'Contact', enter: 'Staff login', services: 'What we do',
    story: 'Our story', news: 'This month', gallery: 'Moments', campaign: 'Our campaign',
    raised: 'Raised', goal: 'Goal', daysLeft: 'days left', call: 'Call', whatsapp: 'WhatsApp',
    email: 'Email', poweredBy: 'Powered by Maor', dir: 'ltr',
  },
  yi: {
    donate: 'שפּענדן', contact: 'פֿאַרבינדונג', enter: 'אַרײַנגאַנג', services: 'וואָס מיר טוען',
    story: 'אונדזער געשיכטע', news: 'דעם חודש', gallery: 'מאָמענטן', campaign: 'אונדזער קאַמפּיין',
    raised: 'געזאַמלט', goal: 'ציל', daysLeft: 'טעג געבליבן', call: 'רופֿט', whatsapp: 'וואַטסאַפּ',
    email: 'בליץ-פּאָסט', poweredBy: 'געטריבן דורך מאור', dir: 'rtl',
  },
};
