/** אטום-קבוע · template-defs — הגדרות תבניות-ההודעה (מפתח·תווית·משתנים·נוסח-ברירת-מחדל).
 *  הנוסחים זהים-ביט לנוסחים ההיסטוריים (ratchet במקור). חוזה: template-defs.contract.md
 *  חולץ כלשונו מ-maor/src/lib/templates.ts:19-53. */
export const TEMPLATE_DEFS = [
  {
    key: 'wa.delivery',
    label: '🚚 הודעת-מסירה (חלוקה)',
    vars: ['name', 'org'],
    def: 'שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚',
  },
  {
    key: 'wa.payment',
    label: '💳 תזכורת-תשלום (חוגים)',
    vars: ['org', 'what', 'amount'],
    def: 'שלום, תזכורת ידידותית מ{org}: יתרה לתשלום עבור {what} — ₪{amount}. תודה רבה!',
  },
  {
    key: 'wa.birthday',
    label: '🎂 ברכת יום-הולדת',
    vars: ['first', 'org'],
    def: 'מזל טוב ל{first} ליום ההולדת! 🎂 באהבה, {org}',
  },
  {
    // חייגן-מונחה (20.8) — "לא ענה? שלח וואטסאפ" בקמפיין-שיחות; עריך באשף כמו השאר
    key: 'wa.dialer',
    label: '📞 הודעת-חייגן (לא ענה)',
    vars: ['name', 'org'],
    def: 'שלום {name}, ניסינו להשיג אתכם מ{org} ולא הצלחנו — נשמח שתחזרו אלינו 🙏',
  },
  {
    // קישור-תשלום מהחייגן (20.8) — שליחת עמוד-התרומה בוואטסאפ תוך-שיחה (payments)
    key: 'wa.paylink',
    label: '💳 שליחת קישור-תשלום',
    vars: ['name', 'org', 'link'],
    def: 'שלום {name}, תודה על השיחה! לתרומה מקוונת ל{org}: {link} 🙏',
  },
];
