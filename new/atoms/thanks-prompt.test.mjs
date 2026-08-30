import { thanksPrompt as __pure_thanksPrompt } from './thanks-prompt.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_thanksPrompt_THANKS_PROMPT_T = {
  k1: "כתוב מכתב תודה קצר (4-6 שורות), חם ואישי, בעברית, מארגון \"",
  k2: "הארגון",
  k3: "לתורם/ת בשם \"",
  k4: "\" על תרומה של ",
  k5: "התרומה יועדה ל: ",
  k6: "סה\"כ תרומותיו/ה עד כה: ",
  k7: " — אפשר לרמוז לנאמנות בעדינות.",
  k8: "בלי הגזמות, בלי סופרלטיבים ריקים, בלי לציין סכומים מעבר לנאמר. לסיים בברכה חמה.",
  k9: "להחזיר את המכתב בלבד — בלי הקדמות.",
};
const thanksPrompt = (...a) => __pure_thanksPrompt(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_thanksPrompt_THANKS_PROMPT_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(a === b, msg + ` ⇒ ${JSON.stringify(a)}`);

// 1) מינימלי — 4 שורות בדיוק
const min = thanksPrompt({ orgName: 'מאור', supporterName: 'דנה לוי', lastAmount: '₪500' });
eq(min,
  'כתוב מכתב תודה קצר (4-6 שורות), חם ואישי, בעברית, מארגון "מאור"\n' +
  'לתורם/ת בשם "דנה לוי" על תרומה של ₪500.\n' +
  'בלי הגזמות, בלי סופרלטיבים ריקים, בלי לציין סכומים מעבר לנאמר. לסיים בברכה חמה.\n' +
  'להחזיר את המכתב בלבד — בלי הקדמות.',
  'הפרומפט-המינימלי סטה');
eq(min.split('\n').length, 4, 'מספר-שורות מינימלי שגוי');

// 2) מלא — 6 שורות; ייעוד + מצטבר במקומם
const full = thanksPrompt({
  orgName: 'מאור', supporterName: 'דנה לוי', lastAmount: '₪500',
  designation: 'אמץ חתן', totalSoFar: '₪2,000',
});
const lines = full.split('\n');
eq(lines.length, 6, 'מספר-שורות מלא שגוי');
eq(lines[2], 'התרומה יועדה ל: אמץ חתן.', 'שורת-הייעוד שגויה');
eq(lines[3], 'סה"כ תרומותיו/ה עד כה: ₪2,000 — אפשר לרמוז לנאמנות בעדינות.', 'שורת-המצטבר שגויה');

// 3) orgName ריק ⇒ 'הארגון'
ok(thanksPrompt({ orgName: '', supporterName: 'א', lastAmount: '₪1' })
  .split('\n')[0].endsWith('מארגון "הארגון"'), 'orgName ריק לא נפל ל"הארגון"');

// 4) רק totalSoFar ⇒ 5 שורות, בלי שורת-ייעוד
const half = thanksPrompt({ orgName: 'מאור', supporterName: 'א', lastAmount: '₪1', totalSoFar: '₪9' });
eq(half.split('\n').length, 5, 'מספר-שורות חלקי שגוי');
ok(!half.includes('התרומה יועדה'), 'שורת-ייעוד הופיעה שלא-כדין');

if (f) process.exit(1);
console.log('✓ thanks-prompt: 4 דוגמאות-חוזה — ירוק');
