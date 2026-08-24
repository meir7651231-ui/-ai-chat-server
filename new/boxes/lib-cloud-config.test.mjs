/** בדיקת-קצה: קופסת lib-cloud-config דרך הקופסה בלבד (חוק-4) — 35 חוטים מחווטים +
 *  מגן-הכרעה. שקעי-Firestore מזויפים רושמי-קריאות (בלי firebase אמיתי).
 *  DoD (דיבר 12): node lib-cloud-config.test.mjs ⇒ exit 0. */
import * as C from './lib-cloud-config.mjs';
import { readFileSync } from 'node:fs';
let f = 0;
const chk = (m, cond) => { if (!cond) { console.error('✗ ' + m); f = 1; } };

// ── מפעל-ענן מזויף: כל פעולה רושמת (path כמערך-ארגומנטים) ──
const DB = { __db: true };
const mkCloud = (snap = undefined, docsList = []) => {
  const log = { doc: [], collection: [], setDoc: [], addDoc: [], deleteDoc: [], updateDoc: [], getDoc: 0, getDocs: 0, onSnapshot: [] };
  const cloud = {
    db: DB,
    doc: (...a) => { log.doc.push(a.slice(1)); return { __ref: 'doc', path: a.slice(1) }; },
    collection: (...a) => { log.collection.push(a.slice(1)); return { __ref: 'col', path: a.slice(1) }; },
    setDoc: async (ref, data, opts) => { log.setDoc.push({ ref, data, opts }); },
    addDoc: async (ref, data) => { log.addDoc.push({ ref, data }); },
    deleteDoc: async (ref) => { log.deleteDoc.push(ref); },
    updateDoc: async (ref, ...rest) => { log.updateDoc.push({ ref, rest }); },
    getDoc: async () => { log.getDoc++; return { exists: () => snap !== undefined, data: () => snap }; },
    getDocs: async () => { log.getDocs++; return { docs: docsList }; },
    onSnapshot: (ref, next, err) => { log.onSnapshot.push({ ref, next, err }); return () => 'unsub'; },
    query: (colRef, ...clauses) => ({ __ref: 'query', colRef, clauses }),
    where: (field, op, val) => ({ __where: [field, op, val] }),
    arrayUnion: (...v) => ({ __arrayUnion: v }),
    arrayRemove: (...v) => ({ __arrayRemove: v }),
    deleteField: () => ({ __deleteField: true }),
    FieldPath: class { constructor(...seg) { this.__fieldPath = seg; } },
    increment: (n) => ({ __increment: n }),
  };
  return { cloud, log };
};

// ── קבועים ──
chk('PLATFORM_ORGS', C.PLATFORM_ORGS === 'platformOrgs');
chk('PLATFORM_REQUESTS', C.PLATFORM_REQUESTS === 'platformRequests');
chk('PLATFORM_LEADS', C.PLATFORM_LEADS === 'platformLeads');
chk('SUPPORT_CHATS', C.SUPPORT_CHATS === 'supportChats');
chk('TEAM_CHATS', C.TEAM_CHATS === 'teamChats');
chk('ORG_SECRET_KEYS', JSON.stringify(C.ORG_SECRET_KEYS) === JSON.stringify(['yemotToken', 'nedarimMosad', 'nedarimApiPass', 'smsApiKey', 'smtpUrl', 'solaXKey']));

const run = async () => {
  // fetchOrgCloudConfig — קיים ⇒ data; נתיב
  {
    const { cloud, log } = mkCloud({ config: {}, members: ['a@b.co'] });
    const r = await C.fetchOrgCloudConfig('kehila', cloud);
    chk('fetchOrgCloudConfig data', JSON.stringify(r) === JSON.stringify({ config: {}, members: ['a@b.co'] }));
    chk('fetchOrgCloudConfig path', JSON.stringify(log.doc[0]) === JSON.stringify(['platformOrgs', 'kehila']) && log.getDoc === 1);
  }
  // fetchOrgCloudConfig — לא-קיים ⇒ null
  {
    const { cloud } = mkCloud(undefined);
    chk('fetchOrgCloudConfig null', (await C.fetchOrgCloudConfig('x', cloud)) === null);
  }
  // watchOrgCloudConfig
  {
    const { cloud, log } = mkCloud();
    const seen = [];
    const un = C.watchOrgCloudConfig('org', (d) => seen.push(d), cloud);
    chk('watchOrgCloudConfig path', JSON.stringify(log.doc[0]) === JSON.stringify(['platformOrgs', 'org']));
    log.onSnapshot[0].next({ exists: () => true, data: () => ({ v: 1 }) });
    log.onSnapshot[0].next({ exists: () => false });
    chk('watchOrgCloudConfig cb', JSON.stringify(seen) === JSON.stringify([{ v: 1 }, null]));
    let quiet = true; try { log.onSnapshot[0].err(new Error('x')); } catch { quiet = false; }
    chk('watchOrgCloudConfig error שקט', quiet && typeof un === 'function');
  }
  // writeOrgCloudDoc — merge + עיקור-JSON
  {
    const { cloud, log } = mkCloud();
    await C.writeOrgCloudDoc('org', { a: 1, b: undefined }, cloud);
    chk('writeOrgCloudDoc merge', log.setDoc[0].opts.merge === true && JSON.stringify(log.setDoc[0].data) === JSON.stringify({ a: 1 }));
    chk('writeOrgCloudDoc path', JSON.stringify(log.doc[0]) === JSON.stringify(['platformOrgs', 'org']));
  }
  // writeOrgCloudConfig — עוטף {config}
  {
    const { cloud, log } = mkCloud();
    await C.writeOrgCloudConfig('x', { theme: 'a' }, cloud);
    chk('writeOrgCloudConfig wrap', JSON.stringify(log.setDoc[0].data) === JSON.stringify({ config: { theme: 'a' } }) && log.setDoc[0].opts.merge === true);
    chk('writeOrgCloudConfig path', JSON.stringify(log.doc[0]) === JSON.stringify(['platformOrgs', 'x']));
  }
  // writeOrgSecrets — trim/מחיקה/סינון
  {
    const { cloud, log } = mkCloud();
    await C.writeOrgSecrets('o', { smtpUrl: ' u ', smsApiKey: '' }, cloud);
    chk('writeOrgSecrets values', log.setDoc[0].data.smtpUrl === 'u' && !!log.setDoc[0].data.smsApiKey.__deleteField);
    chk('writeOrgSecrets meta', log.setDoc[1].data.smtpUrl === true && log.setDoc[1].data.smsApiKey === false && typeof log.setDoc[1].data.updatedAt === 'string');
    chk('writeOrgSecrets paths', JSON.stringify(log.doc[0]) === JSON.stringify(['orgSecrets', 'o']) && JSON.stringify(log.doc[1]) === JSON.stringify(['orgSecretsMeta', 'o']));
  }
  // writeOrgSecrets — מפתח מחוץ-לרשימה ⇒ בלי כתיבה
  {
    const { cloud, log } = mkCloud();
    await C.writeOrgSecrets('o', { unknownKey: 'x' }, cloud);
    chk('writeOrgSecrets סינון-allowlist', log.setDoc.length === 0);
  }
  // readOrgSecretsMeta — קיים / שגיאה
  {
    const { cloud } = mkCloud({ smtpUrl: true });
    chk('readOrgSecretsMeta', JSON.stringify(await C.readOrgSecretsMeta('o', cloud)) === JSON.stringify({ smtpUrl: true }));
    const bad = mkCloud().cloud; bad.getDoc = async () => { throw new Error('denied'); };
    chk('readOrgSecretsMeta שגיאה⇒{}', JSON.stringify(await C.readOrgSecretsMeta('o', bad)) === '{}');
  }
  // deleteOrgRequest / writeOrgRequest / fetchOrgRequests
  {
    const { cloud, log } = mkCloud();
    await C.deleteOrgRequest('u1', cloud);
    chk('deleteOrgRequest path', JSON.stringify(log.doc[0]) === JSON.stringify(['platformRequests', 'u1']) && log.deleteDoc.length === 1);
    await C.writeOrgRequest('u2', { orgName: 'א', x: undefined }, cloud);
    chk('writeOrgRequest full', JSON.stringify(log.setDoc[0].data) === JSON.stringify({ orgName: 'א' }) && log.setDoc[0].opts === undefined);
  }
  {
    const { cloud, log } = mkCloud(undefined, [{ id: 'r1', data: () => ({ orgName: 'א' }) }, { id: 'r2', data: () => ({ orgName: 'ב' }) }]);
    const r = await C.fetchOrgRequests(cloud);
    chk('fetchOrgRequests uid', JSON.stringify(r) === JSON.stringify([{ uid: 'r1', orgName: 'א' }, { uid: 'r2', orgName: 'ב' }]));
    chk('fetchOrgRequests col', JSON.stringify(log.collection[0]) === JSON.stringify(['platformRequests']));
  }
  // findMemberOrgSlugs — מנורמל + query + ריק
  {
    const { cloud, log } = mkCloud(undefined, [{ id: 'o1' }, { id: 'o2' }]);
    const r = await C.findMemberOrgSlugs(' A@B.CO ', cloud);
    chk('findMemberOrgSlugs ids', JSON.stringify(r) === JSON.stringify(['o1', 'o2']));
    chk('findMemberOrgSlugs col', JSON.stringify(log.collection[0]) === JSON.stringify(['platformOrgs']));
    chk('findMemberOrgSlugs empty', JSON.stringify(await C.findMemberOrgSlugs('   ', cloud)) === '[]');
  }
  // fetchAllOrgs
  {
    const { cloud } = mkCloud(undefined, [{ id: 's1', data: () => ({ orgName: 'א' }) }]);
    chk('fetchAllOrgs slug', JSON.stringify(await C.fetchAllOrgs(cloud)) === JSON.stringify([{ slug: 's1', orgName: 'א' }]));
  }
  // join requests
  {
    const { cloud, log } = mkCloud(undefined, [{ id: 'j1', data: () => ({ email: 'e@o.co' }) }]);
    await C.writeOrgJoinRequest('org', 'u1', { email: 'e@o.co' }, cloud);
    chk('writeOrgJoinRequest path', JSON.stringify(log.doc[0]) === JSON.stringify(['platformOrgs', 'org', 'joinRequests', 'u1']));
    const r = await C.fetchOrgJoinRequests('org', cloud);
    chk('fetchOrgJoinRequests', JSON.stringify(r) === JSON.stringify([{ uid: 'j1', email: 'e@o.co' }]));
    await C.deleteOrgJoinRequest('org', 'u1', cloud);
    chk('deleteOrgJoinRequest path', log.deleteDoc.length === 1 && JSON.stringify(log.doc[log.doc.length - 1]) === JSON.stringify(['platformOrgs', 'org', 'joinRequests', 'u1']));
  }
  // member config / members
  {
    const { cloud, log } = mkCloud();
    await C.deleteOrgMemberConfig('org', 'e@o.co', cloud);
    chk('deleteOrgMemberConfig FieldPath+deleteField', JSON.stringify(log.updateDoc[0].rest[0].__fieldPath) === JSON.stringify(['memberConfigs', 'e@o.co']) && !!log.updateDoc[0].rest[1].__deleteField);
    await C.clearEmployeeField('org', 'e@o.co', 'weeklyGoal', cloud);
    chk('clearEmployeeField FieldPath', JSON.stringify(log.updateDoc[1].rest[0].__fieldPath) === JSON.stringify(['memberConfigs', 'e@o.co', 'weeklyGoal']));
    await C.addOrgMember('org', ' E@O.CO ', cloud);
    chk('addOrgMember arrayUnion+norm', JSON.stringify(log.updateDoc[2].rest[0].members.__arrayUnion) === JSON.stringify(['e@o.co']));
    await C.removeOrgMember('org', ' E@O.co ', cloud);
    chk('removeOrgMember variants', JSON.stringify(log.updateDoc[3].rest[0].members.__arrayRemove) === JSON.stringify(['E@O.co', 'e@o.co']));
  }
  // deleteOrgCompletely — מונה + מצבת
  {
    const { cloud, log } = mkCloud(undefined, [{ ref: 'd1' }, { ref: 'd2' }]);
    const n = await C.deleteOrgCompletely('org', ['families'], cloud);
    chk('deleteOrgCompletely מונה>0', typeof n === 'number' && n > 0);
    const last = log.setDoc[log.setDoc.length - 1];
    chk('deleteOrgCompletely מצבת', last.data.deleted === true && typeof last.data.deletedAt === 'string');
    chk('deleteOrgCompletely מצבת-path', JSON.stringify(log.doc[log.doc.length - 1]) === JSON.stringify(['platformOrgs', 'org']));
  }
  // leads
  {
    const { cloud, log } = mkCloud(undefined, [{ id: 'l1', data: () => ({ phone: '05' }) }]);
    await C.writeOrgLead({ phone: '05', x: undefined }, cloud);
    chk('writeOrgLead addDoc', JSON.stringify(log.collection[0]) === JSON.stringify(['platformLeads']) && JSON.stringify(log.addDoc[0].data) === JSON.stringify({ phone: '05' }));
    chk('fetchOrgLeads id', JSON.stringify(await C.fetchOrgLeads(cloud)) === JSON.stringify([{ id: 'l1', phone: '05' }]));
  }
  // support chat send
  {
    const { cloud, log } = mkCloud();
    await C.sendSupportMessage('u1', { email: 'e@o.co', orgName: 'א' }, '  שלום  ', cloud);
    chk('sendSupportMessage clean', log.addDoc[0].data.from === 'user' && log.addDoc[0].data.text === 'שלום');
    chk('sendSupportMessage meta', log.setDoc[0].data.unreadAdmin.__increment === 1 && log.setDoc[0].data.lastFrom === 'user' && log.setDoc[0].opts.merge === true);
    chk('sendSupportMessage col', JSON.stringify(log.collection[0]) === JSON.stringify(['supportChats', 'u1', 'messages']));
    // ריק אחרי-ניקוי ⇒ בלי כתיבה
    const empty = mkCloud();
    await C.sendSupportMessage('u1', {}, '   ', empty.cloud);
    chk('sendSupportMessage ריק⇒return', empty.log.addDoc.length === 0 && empty.log.setDoc.length === 0);
  }
  // support reply
  {
    const { cloud, log } = mkCloud();
    await C.sendSupportReply('u1', 'היי', cloud);
    chk('sendSupportReply admin', log.addDoc[0].data.from === 'admin' && log.setDoc[0].data.unreadUser.__increment === 1);
  }
  // watchers
  {
    const { cloud, log } = mkCloud();
    const seen = [];
    C.watchSupportMessages('u1', (m) => seen.push(m), cloud);
    chk('watchSupportMessages col', JSON.stringify(log.collection[0]) === JSON.stringify(['supportChats', 'u1', 'messages']));
    log.onSnapshot[0].next({ docs: [{ id: 'm1', data: () => ({ text: 'a' }) }] });
    chk('watchSupportMessages בלי-id', JSON.stringify(seen[0]) === JSON.stringify([{ text: 'a' }]));
  }
  {
    const { cloud, log } = mkCloud();
    const seen = [];
    C.watchSupportThreadMeta('u1', (t) => seen.push(t), cloud);
    log.onSnapshot[0].next({ exists: () => true, data: () => ({ unreadAdmin: 2 }) });
    log.onSnapshot[0].next({ exists: () => false });
    chk('watchSupportThreadMeta', JSON.stringify(seen) === JSON.stringify([{ unreadAdmin: 2 }, null]));
  }
  {
    const { cloud, log } = mkCloud();
    const seen = [];
    C.watchAllSupportThreads((t) => seen.push(t), cloud);
    chk('watchAllSupportThreads col', JSON.stringify(log.collection[0]) === JSON.stringify(['supportChats']));
    log.onSnapshot[0].next({ docs: [{ id: 'u1', data: () => ({ lastText: 'a' }) }] });
    chk('watchAllSupportThreads uid נחשף', JSON.stringify(seen[0]) === JSON.stringify([{ uid: 'u1', lastText: 'a' }]));
  }
  // markSupportRead — שדה לפי-צד
  {
    const { cloud, log } = mkCloud();
    await C.markSupportRead('u1', 'admin', cloud);
    chk('markSupportRead admin', JSON.stringify(log.setDoc[0].data) === JSON.stringify({ unreadAdmin: 0 }));
    await C.markSupportRead('u1', 'user', cloud);
    chk('markSupportRead user', JSON.stringify(log.setDoc[1].data) === JSON.stringify({ unreadUser: 0 }));
  }
  // team chat
  {
    const { cloud, log } = mkCloud();
    await C.sendTeamMessage('org', 's@o.co', 'דנה', ' שלום ', cloud);
    chk('sendTeamMessage', log.addDoc[0].data.text === 'שלום' && log.addDoc[0].data.name === 'דנה' && JSON.stringify(log.collection[0]) === JSON.stringify(['teamChats', 'org', 'messages']));
    const seen = [];
    C.watchTeamMessages('org', (m) => seen.push(m), cloud);
    log.onSnapshot[0].next({ docs: [{ id: 't1', data: () => ({ text: 'x' }) }] });
    chk('watchTeamMessages בלי-id', JSON.stringify(seen[0]) === JSON.stringify([{ text: 'x' }]));
  }

  /* 🛡 מגן-הכרעה — קורא את מקור-הקופסה ומאשר הכרעות-חיווט verbatim (דפוס theme.test) */
  const src = readFileSync(new URL('./lib-cloud-config.mjs', import.meta.url), 'utf8');
  chk('מגן: תקרת-ניקוי SUPPORT_MSG_MAX מוזרקת', /sanitizeSupportTextAtom\(raw,\s*SUPPORT_MSG_MAX\)/.test(src));
  chk('מגן: writeOrgSecrets מזריק ORG_SECRET_KEYS', /writeOrgSecretsAtom\(slug,\s*patch,\s*ORG_SECRET_KEYS,\s*cloud\)/.test(src));
  chk('מגן: writeOrgCloudConfig מחווט ל-writeOrgCloudDocAtom', /writeOrgCloudConfigAtom\(slug,\s*config,\s*\(s,\s*data\)\s*=>\s*writeOrgCloudDocAtom\(s,\s*data,\s*cloud\)/.test(src));
  chk('מגן: אפס import-קופסה (חוק-2)', !/from '\.\.\/boxes\//.test(src) && !/from '\.\/[^']*\.mjs'/.test(src));

  if (f) process.exit(1);
  console.log('✓ קופסת-lib-cloud-config: 35 חוטים מחווטים · נתיבי-ענן/merge/increment/FieldPath/מצבת/צ׳אט — קצה ומגן-הכרעה ירוקים');
};

run();
