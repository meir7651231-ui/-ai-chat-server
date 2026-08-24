import { writeOrgLead } from './write-org-lead.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const colRef = { __col: true };
const colCalls = [];
const addCalls = [];
const fs = {
  db,
  collection: (...args) => { colCalls.push(args); return colRef; },
  addDoc: async (...args) => { addCalls.push(args); return { id: 'AUTO1' }; },
};

// 1) עדות-נתיב: collection(db,'platformLeads') — אוסף-שורש
const lead1 = { contactName: 'דוד', phone: '0521112223', preferredTime: 'ערב' };
const out = await writeOrgLead(lead1, fs);
chk('1 collection(db,platformLeads) פעם אחת + addDoc(colRef)',
  colCalls.length === 1 && colCalls[0][0] === db &&
  JSON.stringify(colCalls[0].slice(1)) === JSON.stringify(['platformLeads']) &&
  addCalls.length === 1 && addCalls[0][0] === colRef);

// 2) deep-equal אך !== (עיקור-JSON)
chk('2 הנכתב deep-equal ל-lead אך לא אותה הפניה',
  JSON.stringify(addCalls[0][1]) === JSON.stringify(lead1) && addCalls[0][1] !== lead1);

// 3) עיקור-undefined
await writeOrgLead({ phone: '0501234567', notes: undefined }, fs);
chk('3 undefined מעוקר — {phone} בלבד',
  JSON.stringify(addCalls[1][1]) === JSON.stringify({ phone: '0501234567' }) &&
  !('notes' in addCalls[1][1]));

// 4) מחזיר undefined גם כש-addDoc מחזיר הפניה
chk('4 מחזיר undefined (הפניית-addDoc לא מוחזרת)', out === undefined);

// 5) reject מבעבע
let bubbled = '';
try {
  await writeOrgLead({}, { ...fs, addDoc: async () => { throw new Error('unavailable'); } });
} catch (e) { bubbled = e.message; }
chk('5 שגיאה מבעבעת', bubbled === 'unavailable');

if (f) process.exit(1);
console.log('✓ write-org-lead: 5 דוגמאות-חוזה (addDoc מזהה-אוטומטי לאוסף-שורש) — ירוק');
