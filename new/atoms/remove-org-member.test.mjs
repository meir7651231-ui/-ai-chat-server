import { removeOrgMember } from './remove-org-member.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

const mkFs = () => {
  const calls = { doc: [], updateDoc: [], arrayRemove: [] };
  const DB = { tag: 'db' };
  const REF = { tag: 'ref' };
  const SENTINEL = { tag: 'arrayRemove-sentinel' };
  return {
    calls, DB, REF, SENTINEL,
    fs: {
      db: DB,
      doc: (...a) => { calls.doc.push(a); return REF; },
      updateDoc: (...a) => { calls.updateDoc.push(a); return Promise.resolve(); },
      arrayRemove: (...a) => { calls.arrayRemove.push(a); return SENTINEL; },
    },
  };
};

// 1) שתי וריאציות: גולמי-אחרי-trim ואז מנורמל; doc עם (db,'platformOrgs',slug)
{
  const m = mkFs();
  await removeOrgMember('kehila', '  Anat.Levi@Gmail.com ', m.fs);
  ok(m.calls.doc.length === 1, 'doc לא נקרא פעם אחת');
  eq(m.calls.doc[0], [m.DB, 'platformOrgs', 'kehila'], 'ארגומנטי-doc שגויים');
  ok(m.calls.arrayRemove.length === 1, 'arrayRemove לא נקרא פעם אחת');
  eq(m.calls.arrayRemove[0], ['Anat.Levi@Gmail.com', 'anat.levi@gmail.com'], 'וריאציות-ההסרה שגויות');
}

// 2) מייל כבר-מנורמל ⇒ ארגומנט יחיד (Set מאחד)
{
  const m = mkFs();
  await removeOrgMember('kehila', 'a@b.com', m.fs);
  eq(m.calls.arrayRemove[0], ['a@b.com'], 'כפילות-וריאציה לא אוחדה');
}

// 3) updateDoc פעם אחת: (REF, {members: SENTINEL})
{
  const m = mkFs();
  await removeOrgMember('org1', 'x@y.com', m.fs);
  ok(m.calls.updateDoc.length === 1, 'updateDoc לא נקרא פעם אחת');
  ok(m.calls.updateDoc[0][0] === m.REF, 'updateDoc לא קיבל את הפניית-doc');
  const data = m.calls.updateDoc[0][1];
  eq(Object.keys(data), ['members'], 'מפתחות-העדכון שגויים');
  ok(data.members === m.SENTINEL, 'ערך members אינו הסנטינל של arrayRemove');
}

// 4) הערך המוחזר undefined
{
  const m = mkFs();
  const r = await removeOrgMember('org1', 'x@y.com', m.fs);
  ok(r === undefined, 'הפלט אינו undefined');
}

// 5) דחיית updateDoc מבעבעת החוצה
{
  const m = mkFs();
  m.fs.updateDoc = () => Promise.reject(new Error('offline'));
  let threw = '';
  try { await removeOrgMember('org1', 'x@y.com', m.fs); } catch (e) { threw = e.message; }
  ok(threw === 'offline', 'שגיאת-הענן נבלעה');
}

if (f) process.exit(1);
console.log('✓ remove-org-member: 5 דוגמאות-חוזה — ירוק');
