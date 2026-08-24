import { sanitizeIncoming } from './sanitize-incoming.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// 1) families בלי שדות-רשימה ⇒ שניהם מושלמים; המקור לא שונה
{
  const item = { id: 'f1' };
  const out = sanitizeIncoming('families', item);
  chk('1 members+docs הושלמו כ-[] בעותק חדש',
    out !== item && out.id === 'f1' &&
    Array.isArray(out.members) && out.members.length === 0 &&
    Array.isArray(out.docs) && out.docs.length === 0 &&
    !('members' in item));
}

// 2) שדה תקין נשמר בהפניה; שדה שבור מוחלף
{
  const members = [{ id: 'm1' }];
  const out = sanitizeIncoming('families', { id: 'f1', members, docs: 'שבור' });
  chk('2 ‏members נשמר, docs הוחלף ב-[]',
    out.members === members && Array.isArray(out.docs) && out.docs.length === 0);
}

// 3) אוסף שאינו בטבלה ⇒ אותה הפניה
{
  const item = { id: 'r1' };
  chk('3 ‏rooms מוחזר כמות-שהוא', sanitizeIncoming('rooms', item) === item);
}

// 4) הכל תקין ⇒ אותה הפניה (אין שכפול)
{
  const item = { id: 's1', donations: [] };
  chk('4 ‏supporters תקין — זהות-הפניה', sanitizeIncoming('supporters', item) === item);
}

// 5) shopAssignments עם null ⇒ שני השדות מערכים
{
  const out = sanitizeIncoming('shopAssignments', { id: 'a1', redemptions: null });
  chk('5 ‏redemptions+criterionIds ⇒ []',
    Array.isArray(out.redemptions) && out.redemptions.length === 0 &&
    Array.isArray(out.criterionIds) && out.criterionIds.length === 0);
}

if (f) process.exit(1);
console.log('✓ sanitize-incoming: 5 דוגמאות-חוזה — ירוק');
