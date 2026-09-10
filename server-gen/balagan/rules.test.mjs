// ☁️ חולל ע"י server.mjs (G57) — חוקי-הגישה מוכחים מול אמולטור, לא מוצהרים. אל תערוך ידנית.
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'node:fs';

const KNOWN = ["app_calendar_ent1","app_peruk01_ent1"];
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
await assertFails(getDoc(doc(a, 'users/a/secret/google'))); ok.push('טוקן-הרענון חסום גם לבעליו');
await assertFails(setDoc(doc(a, 'users/a/secret/google'), { refresh: 'x' })); ok.push('הלקוח לא כותב טוקן-רענון');

await env.cleanup();
console.log('✓ כללי-הגישה: ' + ok.length + '/15 · ' + ok.join(' · '));
if (ok.length !== 15) process.exit(1);
