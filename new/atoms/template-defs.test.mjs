import { TEMPLATE_DEFS } from './template-defs.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

// 1) חמש תבניות בדיוק
eq(TEMPLATE_DEFS.length, 5, 'מספר-התבניות שגוי');

// 2) הודעת-המסירה — נוסח זהה-ביט להיסטורי
eq(TEMPLATE_DEFS[0].key, 'wa.delivery', 'מפתח ראשון שגוי');
eq(TEMPLATE_DEFS[0].def, 'שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚', 'נוסח-מסירה סטה');

// 3) משתני תזכורת-התשלום
eq(TEMPLATE_DEFS[1].vars, ['org', 'what', 'amount'], 'משתני-תשלום שגויים');

// 4) קישור-התשלום — הרשומה כולה
eq(TEMPLATE_DEFS[4], {
  key: 'wa.paylink',
  label: '💳 שליחת קישור-תשלום',
  vars: ['name', 'org', 'link'],
  def: 'שלום {name}, תודה על השיחה! לתרומה מקוונת ל{org}: {link} 🙏',
}, 'רשומת-paylink סטתה');

// צילום-ערך מלא — סטייה בכל ביט מדליקה אדום
const SNAP = '[{"key":"wa.delivery","label":"🚚 הודעת-מסירה (חלוקה)","vars":["name","org"],"def":"שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚"},{"key":"wa.payment","label":"💳 תזכורת-תשלום (חוגים)","vars":["org","what","amount"],"def":"שלום, תזכורת ידידותית מ{org}: יתרה לתשלום עבור {what} — ₪{amount}. תודה רבה!"},{"key":"wa.birthday","label":"🎂 ברכת יום-הולדת","vars":["first","org"],"def":"מזל טוב ל{first} ליום ההולדת! 🎂 באהבה, {org}"},{"key":"wa.dialer","label":"📞 הודעת-חייגן (לא ענה)","vars":["name","org"],"def":"שלום {name}, ניסינו להשיג אתכם מ{org} ולא הצלחנו — נשמח שתחזרו אלינו 🙏"},{"key":"wa.paylink","label":"💳 שליחת קישור-תשלום","vars":["name","org","link"],"def":"שלום {name}, תודה על השיחה! לתרומה מקוונת ל{org}: {link} 🙏"}]';
ok(JSON.stringify(TEMPLATE_DEFS) === SNAP, 'הצילום-המלא סטה');

if (f) process.exit(1);
console.log('✓ template-defs: 4 דוגמאות-חוזה + צילום — ירוק');
