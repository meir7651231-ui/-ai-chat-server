import { migrateSupportersToKeyed as __pure_migrateSupportersToKeyed } from './migrate-supporters-to-keyed.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_migrate_supporters_to_keyed_T = {
  k1: "supporters",
  k2: "events",
  k3: 400,
};
const migrateSupportersToKeyed = (...a) => __pure_migrateSupportersToKeyed(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_migrate_supporters_to_keyed_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const DB = { __db: true };
const SHARED = '_shared_';

/** io מזויף רושם-קריאות; encryptDoc עוטף במעטפה מסומנת. */
function mkIo() {
  const log = { batches: [], mapCalls: 0, encCalls: [], docSkeyMaps: [] };
  const io = {
    requireDb: () => DB,
    supKeyMapOf: (sups) => { log.mapCalls++; const m = new Map(sups.map((s) => [s.id, (s.forWho || '').trim() || SHARED])); log.map = m; return m; },
    supKeyOf: (sp) => (sp.forWho || '').trim() || SHARED,
    docSkey: (col, data, m) => { log.docSkeyMaps.push(m); return data.spId ? (m.get(data.spId) ?? SHARED) : SHARED; },
    toPlain: (x) => ({ ...x, __plain: true }),
    encryptDoc: async (plain, dek) => { log.encCalls.push([plain, dek]); return { env: 'enc', of: plain.id }; },
    scopedCol: (c) => 'orgs/test/' + c,
    doc: (db, col, id) => ({ db, col, id }),
    writeBatch: (db) => {
      const b = { db, sets: [], commits: 0, set(ref, data) { this.sets.push({ ref, data }); }, async commit() { this.commits++; } };
      log.batches.push(b);
      return b;
    },
  };
  return { io, log };
}

// 1+2) תומך+אירוע בלי dek — צבר אחד, שני set, skey נכון, encryptDoc לא נקרא, מוחזר 2
{
  const { io, log } = mkIo();
  const sp = { id: 's1', forWho: 'דנה', name: 'תומך' };
  const ev = { id: 'e1', spId: 's1', title: 'שיחה' };
  const n = await migrateSupportersToKeyed([sp], [ev], null, io);
  const b = log.batches[0];
  chk('1 צבר אחד, שני set, commit אחד, מוחזר 2',
    n === 2 && log.batches.length === 1 && b.sets.length === 2 && b.commits === 1);
  chk('1 מסמך-תומך: נתיב + skey + תוכן-plain',
    b.sets[0].ref.db === DB && b.sets[0].ref.col === 'orgs/test/supporters' && b.sets[0].ref.id === 's1' &&
    b.sets[0].data.skey === 'דנה' && b.sets[0].data.name === 'תומך' && b.sets[0].data.__plain === true);
  chk('1 מסמך-אירוע: נתיב + skey מהמפה',
    b.sets[1].ref.col === 'orgs/test/events' && b.sets[1].ref.id === 'e1' &&
    b.sets[1].data.skey === 'דנה' && b.sets[1].data.title === 'שיחה');
  chk('2 בלי dek — encryptDoc לא נקרא', log.encCalls.length === 0);
}

// 3) עם dek — encryptDoc פעם-לכל-מסמך על toPlain, והמסמך = skey + מעטפה בלבד
{
  const { io, log } = mkIo();
  const DEK = { __dek: true };
  const sp = { id: 's1', forWho: '', name: 'תומך' };
  const ev = { id: 'e1', spId: '', title: 'כללי' };
  await migrateSupportersToKeyed([sp], [ev], DEK, io);
  const b = log.batches[0];
  chk('3 encryptDoc נקרא פעמיים עם (plain, dek)',
    log.encCalls.length === 2 &&
    log.encCalls.every(([p, d]) => p.__plain === true && d === DEK));
  chk('3 המסמך = skey + מעטפה, בלי שדות-plain',
    b.sets[0].data.skey === SHARED && b.sets[0].data.env === 'enc' &&
    b.sets[0].data.name === undefined &&
    b.sets[1].data.skey === SHARED && b.sets[1].data.of === 'e1' &&
    b.sets[1].data.title === undefined);
}

// 4) המפה נבנית פעם אחת ומועברת ל-docSkey
{
  const { io, log } = mkIo();
  const sups = [{ id: 's1', forWho: 'א' }, { id: 's2', forWho: 'ב' }];
  const evs = [{ id: 'e1', spId: 's2' }, { id: 'e2', spId: 's1' }, { id: 'e3' }];
  await migrateSupportersToKeyed(sups, evs, null, io);
  chk('4 supKeyMapOf פעם אחת; אותה מפה בכל docSkey',
    log.mapCalls === 1 && log.docSkeyMaps.length === 3 &&
    log.docSkeyMaps.every((m) => m === log.map));
  const b = log.batches[0];
  chk('4 skey לאירועים: מקושר=מפתח-התומך, ללא-קישור=משותף',
    b.sets[2].data.skey === 'ב' && b.sets[3].data.skey === 'א' && b.sets[4].data.skey === SHARED);
}

// 5) צברי-400: 300 תומכים + 101 אירועים = 401 ⇒ שני צברים (400+1), מוחזר 401
{
  const { io, log } = mkIo();
  const sups = Array.from({ length: 300 }, (_, i) => ({ id: 's' + i, forWho: '' }));
  const evs = Array.from({ length: 101 }, (_, i) => ({ id: 'e' + i }));
  const n = await migrateSupportersToKeyed(sups, evs, null, io);
  chk('5 שני צברים 400+1, commit לכל אחד, מוחזר 401',
    n === 401 && log.batches.length === 2 &&
    log.batches[0].sets.length === 400 && log.batches[0].commits === 1 &&
    log.batches[1].sets.length === 1 && log.batches[1].commits === 1);
}

// 6) ריק-ריק ⇒ אפס צברים, מוחזר 0
{
  const { io, log } = mkIo();
  const n = await migrateSupportersToKeyed([], [], null, io);
  chk('6 ריק: אפס writeBatch, מוחזר 0', n === 0 && log.batches.length === 0);
}

if (f) process.exit(1);
console.log('✓ migrate-supporters-to-keyed: 6 דוגמאות-חוזה (שקעי-io) — ירוק');
