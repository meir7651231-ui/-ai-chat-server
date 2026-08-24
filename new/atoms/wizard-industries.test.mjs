import { wizardIndustries } from './wizard-industries.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const studio = {
  id: 'studio', emoji: '🏢', label: 'סטודיו דיגיטל + בנייה',
  sub: 'פרויקטים · לקוחות · ספקים — משולב', theme: 'kehila', accent: '#0ea5e9',
};
const orRishon = { id: 'or-rishon', emoji: '🕯️', label: 'עמותת חסד', sub: 'משפחות · תרומות · קבלות', modules: { shop: false } };

// 1) קילוף שדות-עודפים — בדיוק ארבעה שדות
chk('1 קילוף לארבעה שדות',
  eq(wizardIndustries([studio]), [{
    id: 'studio', emoji: '🏢', label: 'סטודיו דיגיטל + בנייה',
    sub: 'פרויקטים · לקוחות · ספקים — משולב',
  }]));

// 2) סדר נשמר
const two = wizardIndustries([orRishon, studio]);
chk('2 סדר-החבילות נשמר', two.length === 2 && two[0].id === 'or-rishon' && two[1].id === 'studio');

// 3) מערך ריק
chk('3 ריק ⇒ ריק', eq(wizardIndustries([]), []));

// 4) טוהר: הקלט לא משתנה, הפלט אובייקטים חדשים
const out = wizardIndustries([studio]);
out[0].label = 'שונה';
chk('4 טוהר', studio.theme === 'kehila' && studio.label === 'סטודיו דיגיטל + בנייה' && out[0] !== studio);

if (f) process.exit(1);
console.log('✓ wizard-industries: 4 דוגמאות-חוזה (קילוף+סדר+ריק+טוהר) — ירוק');
