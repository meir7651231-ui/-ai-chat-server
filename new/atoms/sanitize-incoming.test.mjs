import { sanitizeIncoming as __pure_sanitizeIncoming } from './sanitize-incoming.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_sanitizeIncoming_SANITIZE_INCOMING_T = {
  k1: "members",
  k2: "docs",
  k3: "payments",
  k4: "absences",
  k5: "donations",
  k6: "collections",
  k7: "scoreLog",
  k8: "components",
  k9: "redemptions",
  k10: "criterionIds",
  k11: "waits",
};
const sanitizeIncoming = (...a) => __pure_sanitizeIncoming(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_sanitizeIncoming_SANITIZE_INCOMING_T);
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
