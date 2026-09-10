#!/usr/bin/env node
// ☁️ server — חבילת-השרת נגזרת מהספק (G57 · הכרעה-31: "תחבר אותו לשרת תתן למחולל את האפשרות").
//   הבעלים לא ביקש שרת לבלגן — הוא ביקש שלמחולל תהיה **האפשרות**. לכן:
//   אפליקציה שמצהירה `שרת: ענן` בספק ⇒ המנוע פולט את חבילת-השרת שלה מאותן ישויות
//   שמהן נגזרו המסכים. אפליקציה בלי ההצהרה ⇒ אין תיקייה, אין שינוי, ביט-זהה.
//
//   מודל-הנתונים (הכרעה-31ד — הענן הוא **העתק** של מגירת-המכשיר, לא מקורה):
//     users/{uid}/state/app     מגירת-האפליקציה כולה (אותו JSON של exportJson) + חותמת
//     users/{uid}/due/{id}      מועדים שהלקוח כבר חישב — השרת רק שולח בזמן (G58)
//     users/{uid}/inbox/{id}    קלט-נכנס מ-webhook (G61)
//   הלוגיקה **לא** משוכפלת לשרת: מנוע-התזכורות חי במקום אחד (הלקוח) וכותב מועדים;
//   השרת טיפש בכוונה. כפילות-מנוע היא חוב, לא ארכיטקטורה.
//
//   סודות: אף לא אחד בקוד (חוק-6). ה-runbook אומר לבעלים מה להזין ואיפה. שער `server` אוסר ליטרל-סוד.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const APPS = path.join(HERE, 'apps');
const SPECS = path.join(HERE, 'specs-ds');
const OUT = path.join(ROOT, 'server-gen');   // לא תחת new/ — `new/` הוא מדף-האטומים, וחבילת-שרת אינה אטום (וגם: תלויות-בדיקה לא נסרקות כחוטים)
const SL = JSON.parse(fs.readFileSync(path.join(HERE, 'spec-lang.data.json'), 'utf8'));
const rd = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');

const SERVER_RE = new RegExp('^\\s*' + SL.serverWord + '\\s*:\\s*(.+)$', 'm');

/// הצהרת-השרת של אפליקציה: `שרת: ענן` בספק ⇒ 'cloud'; אין ⇒ null.
export function serverOf(ns) {
  const m = rd(path.join(SPECS, ns + '.txt')).match(SERVER_RE);
  return m ? (SL.servers[m[1].trim()] || null) : null;
}

/// כל הישויות של האפליקציות שהוכרזו — משמות-האוספים בחוקים ובוולידציה.
function entitiesOf(nsList) {
  const out = [];
  for (const ns of nsList) {
    const f = path.join(APPS, ns + '.json');
    if (!fs.existsSync(f)) continue;
    for (const e of JSON.parse(rd(f)).entities || []) if (e.slug && !out.includes(e.slug)) out.push(e.slug);
  }
  return out.sort();
}

/// מפתחות-העל של המסמך נגזרים מ-`cloudJson` של החנות (ולא מ-`exportJson`) — הכללים לא
/// יכולים לסטות מהקוד, ו-`settings` (מפתחות-הלקוח) נדחה בשער עצמו, לא רק בנימוס-הלקוח.
function stateKeys() {
  const m = rd(path.join(ROOT, 'new/dart-ui-bs/ds/ds_store.dart')).match(/String cloudJson\(\) => jsonEncode\(\{([^}]*)\}\)/);
  if (!m) throw new Error('✗ server: לא נמצא cloudJson — אי-אפשר לגזור את מפתחות-המסמך');
  return [...m[1].matchAll(/'([^']+)':/g)].map((x) => x[1]);
}

const rulesFor = (entities, keys) => `rules_version = '2';
// ☁️ חולל ע"י server.mjs (G57 · הכרעה-31) — אל תערוך ידנית.
//   כלל אחד: אדם רואה וכותב **רק** את תת-העץ שלו. אין קריאה חוצה-משתמשים, בשום נתיב.
//   רשימת-הישויות נגזרת מהספקים — ישות שלא הוכרזה נדחית, כדי שדליפת-מפתח לא תהפוך
//   את המגירה למחסן זר.
service cloud.firestore {
  match /databases/{db}/documents {
    function mine(uid) { return request.auth != null && request.auth.uid == uid; }
    function known() { return [${entities.map((e) => `'${e}'`).join(', ')}]; }
    function stateOk(d) {
      return d.keys().hasOnly([${keys.map((k) => `'${k}'`).join(', ')}, 'at'])
        && (!('rec' in d) || d.rec.keys().hasOnly(known()));
    }
    match /users/{uid}/state/app {
      allow read: if mine(uid);
      allow write: if mine(uid) && stateOk(request.resource.data);
    }
    match /users/{uid}/due/{id} {
      allow read, write: if mine(uid);   // הלקוח מחשב מועדים; הפונקציה קוראת כ-admin ומסמנת
    }
    match /users/{uid}/push/{token} {
      allow read, write: if mine(uid);   // טוקן-מכשיר: מזהה מכשיר, לא אדם
    }
    match /users/{uid}/inbox/{id} {
      allow read, write: if mine(uid);   // כתיבה מבחוץ עוברת בפונקציה (admin), לא בכללים
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`;

const ACTIVATE = (app, entities) => `# הפעלת-השרת של «${app}» — צעדי-הבעלים

הקוד כאן **מחולל**. אף סוד אינו בו ואינו יכול להיות בו (חוק-6).
עד שתריץ את הצעדים האלה, האפליקציה עובדת בדיוק כמו היום: הכל על המכשיר, אפס רשת.

## מה זה נותן
- **סנכרון בין מכשירים** — אותה מגירה בטלפון ובמחשב.
- **התראה כשהאפליקציה סגורה** (אחרי G58).
- **יומן ומייל דו-כיווניים** (אחרי G60) — כי רענון-הטוקן דורש סוד שחייב לשבת בשרת.

## מה נשאר אצלך
1. פרויקט Firebase (חינם עד ההיקף של פונקציות; פונקציות דורשות Blaze).
2. \`firebase login\` ואז \`firebase use <project>\` בתיקייה הזאת.
3. \`firebase deploy --only firestore:rules\` — פרסום כללי-הגישה.
4. באפליקציה: «נושאים» ⇒ «חיבורים» ⇒ «ענן» ⇒ הדבק את קונפיג-האתר ⇒ מייל+סיסמה ⇒ «התחבר».
   אותו חשבון במכשיר השני, וזהו. הקונפיג נשמר **במכשיר**, כמו כל מפתח.

## התראה כשהאפליקציה סגורה (G59)
5. ‏Firebase ⇒ Project settings ⇒ **Cloud Messaging** ⇒ Web Push certificates ⇒ **Generate key pair**.
   העתק את המפתח הציבורי (מתחיל באות B) והדבק באפליקציה בשדה «מפתח VAPID», ואז «הפעל התראות במכשיר הזה».
6. תוכנית **Blaze** (פונקציות דורשות אותה) ואז \`firebase deploy --only functions\`.
   הפונקציה pushDue רצה כל 15 דקות, שולחת את מה שהגיע זמנו ומסמנת.

**איך זה עובד, בשורה:** הלקוח מחשב מועדים וכותב אותם ל-users/{uid}/due;
השרת רק שולח. אין מנוע-תזכורות שני שיסטה מהראשון (הכרעה-31ב).
טוקן שפג נמחק אוטומטית, כדי שהתור לא יתמלא במכשירים שכבר לא קיימים.

## מה נבדק כאן, בלי פרויקט
\`npm test\` מריץ את כללי-הגישה מול **אמולטור-Firestore** מקומי:
אדם קורא את שלו · לא קורא של אחר · ישות לא-מוכרת נדחית.

## הישויות שהוכרזו (${entities.length})
${entities.map((e) => '- `' + e + '`').join('\n')}
`;

const PKG = (app) => JSON.stringify({
  name: `server-${app}`,
  private: true,
  type: 'module',
  scripts: { test: 'node rules.test.mjs' },
  devDependencies: { '@firebase/rules-unit-testing': '^3.0.4', firebase: '^10.14.1' },
}, null, 2) + '\n';

// G59 · הפונקציה היחידה, וטיפשה בכוונה (הכרעה-31ב): היא לא מחשבת מתי להזכיר —
//   הלקוח כתב מועדים, והיא רק שולחת את מה שהגיע זמנו ומסמנת. כך אין שני מנועים שיסטו.
const FUNCTIONS_INDEX = `// ☁️ חולל ע"י server.mjs (G59 · הכרעה-31) — אל תערוך ידנית.
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();
const db = getFirestore();

/// כל 15 דקות: מועדים שהגיע זמנם ועוד לא נשלחו ⇒ דחיפה לכל מכשיר של אותו אדם.
/// טוקן שפג (unregistered) נמחק — אחרת התור מתמלא במכשירים שכבר לא קיימים.
exports.pushDue = onSchedule({ schedule: 'every 15 minutes', timeZone: 'Asia/Jerusalem', region: 'europe-west1' }, async () => {
  const now = new Date().toISOString();
  const snap = await db.collectionGroup('due').where('at', '<=', now).where('sent', '==', null).limit(500).get();
  for (const doc of snap.docs) {
    const uid = doc.ref.path.split('/')[1];
    const d = doc.data() || {};
    const toks = await db.collection('users/' + uid + '/push').get();
    if (toks.empty) { await doc.ref.set({ sent: now, note: 'no-device' }, { merge: true }); continue; }
    const message = {
      notification: { title: d.title || '', body: d.body || '' },
      data: { rid: String(d.rid || '') },
      tokens: toks.docs.map((t) => t.id),
    };
    try {
      const res = await getMessaging().sendEachForMulticast(message);
      res.responses.forEach((r, i) => {
        if (r.success) return;
        const code = (r.error && r.error.code) || '';
        if (code.includes('registration-token-not-registered') || code.includes('invalid-argument')) {
          db.doc('users/' + uid + '/push/' + toks.docs[i].id).delete().catch(() => {});
        }
      });
      await doc.ref.set({ sent: now, ok: res.successCount }, { merge: true });
    } catch (e) {
      await doc.ref.set({ tried: FieldValue.increment(1) }, { merge: true });   // כשל ⇒ ניסיון-חוזר בסבב הבא, לא בליעה
    }
  }
});
`;

const FUNCTIONS_PKG = JSON.stringify({
  name: 'functions',
  private: true,
  engines: { node: '22' },
  main: 'index.js',
  dependencies: { 'firebase-admin': '^13.0.0', 'firebase-functions': '^6.1.0' },
}, null, 2) + '\n';

const FIREBASE_JSON = JSON.stringify({
  firestore: { rules: 'firestore.rules' },
  functions: [{ source: 'functions' }],
  emulators: { firestore: { port: 8181, host: '127.0.0.1' }, ui: { enabled: false }, singleProjectMode: true },
}, null, 2) + '\n';

const RULES_TEST = (entities, keys) => `// ☁️ חולל ע"י server.mjs (G57) — חוקי-הגישה מוכחים מול אמולטור, לא מוצהרים. אל תערוך ידנית.
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'node:fs';

const KNOWN = ${JSON.stringify(entities.slice(0, 2))};
const env = await initializeTestEnvironment({
  projectId: 'demo-server-gen',
  firestore: { rules: fs.readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8181 },
});
const state = (rec) => ({ rec, log: [], at: '2026-09-10' });
const ok = [];
const a = env.authenticatedContext('a').firestore();
const b = env.authenticatedContext('b').firestore();
const anon = env.unauthenticatedContext().firestore();

await assertSucceeds(setDoc(doc(a, 'users/a/state/app'), state({ [KNOWN[0]]: [{ id: '1' }] }))); ok.push('בעל-המגירה כותב');
await assertSucceeds(getDoc(doc(a, 'users/a/state/app'))); ok.push('בעל-המגירה קורא');
await assertFails(getDoc(doc(b, 'users/a/state/app'))); ok.push('אדם אחר לא קורא');
await assertFails(setDoc(doc(b, 'users/a/state/app'), state({}))); ok.push('אדם אחר לא כותב');
await assertFails(getDoc(doc(anon, 'users/a/state/app'))); ok.push('אנונימי לא קורא');
await assertFails(setDoc(doc(a, 'users/a/state/app'), state({ not_declared_ent: [] }))); ok.push('ישות לא-מוכרת נדחית');
await assertFails(setDoc(doc(a, 'users/a/state/app'), { rec: {}, secret: 1 })); ok.push('שדה זר נדחה');
await assertFails(setDoc(doc(a, 'users/a/state/app'), { rec: {}, settings: { 'ai.key': 'sk-x' } })); ok.push('מפתחות-הלקוח נדחים');
await assertFails(setDoc(doc(a, 'other/x'), { a: 1 })); ok.push('נתיב מחוץ למגירה נדחה');
await assertSucceeds(setDoc(doc(a, 'users/a/push/tok1'), { at: '2026-09-10' })); ok.push('טוקן-מכשיר נכתב');
await assertFails(setDoc(doc(b, 'users/a/push/tok1'), { at: 'x' })); ok.push('טוקן של אחר נדחה');
await assertSucceeds(setDoc(doc(a, 'users/a/due/d1'), { at: '2026-09-11T08:00', title: 'ארנונה' })); ok.push('מועד נכתב');
await assertFails(getDoc(doc(b, 'users/a/due/d1'))); ok.push('מועד של אחר לא נקרא');

await env.cleanup();
console.log('✓ כללי-הגישה: ' + ok.length + '/13 · ' + ok.join(' · '));
if (ok.length !== 13) process.exit(1);
`;

// ── CLI ───────────────────────────────────────────────────────────────────────
export function emitServer(app, nsList) {
  const entities = entitiesOf(nsList);
  if (!entities.length) throw new Error(`✗ server: אין ישויות ל-${app}`);
  const dir = path.join(OUT, app);
  fs.mkdirSync(dir, { recursive: true });
  const keys = stateKeys();
  fs.writeFileSync(path.join(dir, 'firestore.rules'), rulesFor(entities, keys));
  fs.writeFileSync(path.join(dir, 'firebase.json'), FIREBASE_JSON);
  fs.writeFileSync(path.join(dir, 'package.json'), PKG(app));
  fs.writeFileSync(path.join(dir, 'rules.test.mjs'), RULES_TEST(entities, keys));
  fs.writeFileSync(path.join(dir, 'ACTIVATE.md'), ACTIVATE(app, entities));
  fs.mkdirSync(path.join(dir, 'functions'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'functions/index.js'), FUNCTIONS_INDEX);
  fs.writeFileSync(path.join(dir, 'functions/package.json'), FUNCTIONS_PKG);
  fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules/\npackage-lock.json\nfirebase-debug.log\nfunctions/node_modules/\nfunctions/package-lock.json\n');   // תלויות-בדיקה אינן תוצר-מנוע
  return { dir, entities };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const idx = JSON.parse(rd(path.join(HERE, 'balagan-index.json')) || '{}');
  const nsList = (idx.modules || []).map((m) => m.ns);
  const declared = serverOf('tasks') || serverOf('calendar');   // שכבת-הבסיס מצהירה עבור «בלגן»
  if (!declared) { console.log('☁️  server: אין הצהרת-שרת בספקים — לא נפלט כלום (ביט-זהה)'); process.exit(0); }
  const r = emitServer('balagan', nsList.length ? nsList : ['tasks', 'calendar']);
  console.log(`☁️  server: «בלגן» ⇒ ${path.relative(ROOT, r.dir)} · ${r.entities.length} ישויות · חוקים+בדיקת-אמולטור+רנבוק · אפס סודות`);
}
