import { genRecoveryKey as __pure_genRecoveryKey } from './gen-recovery-key.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_genRecoveryKey_GEN_RECOVERY_KEY_T = {
  k1: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
};
const genRecoveryKey = (...a) => __pure_genRecoveryKey(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_genRecoveryKey_GEN_RECOVERY_KEY_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) בייטים 0..23 — מיפוי-האלפבית המדויק (בלי I,O,0,1)
const calls = [];
const seq = (n) => { calls.push(n); return Uint8Array.from({ length: n }, (_, i) => i); };
const k1 = genRecoveryKey(seq);
ok(k1 === 'ABCD-EFGH-JKLM-NPQR-STUV-WXYZ', `בייטים 0..23 ⇒ ${k1}`);
// 2) 24 אפסים
const k2 = genRecoveryKey((n) => new Uint8Array(n));
ok(k2 === 'AAAA-AAAA-AAAA-AAAA-AAAA-AAAA', `אפסים ⇒ ${k2}`);
// 3) ‏255 ⇒ '9' (מודולו 32) · ‏32 ⇒ 'A' (גלגול)
const k3 = genRecoveryKey((n) => new Uint8Array(n).fill(255));
ok(k3 === '9999-9999-9999-9999-9999-9999', `255-ים ⇒ ${k3}`);
const k4 = genRecoveryKey((n) => new Uint8Array(n).fill(32));
ok(k4 === 'AAAA-AAAA-AAAA-AAAA-AAAA-AAAA', `32-ים ⇒ ${k4}`);
// 4) צורה: אורך 29 · 6 קבוצות של 4 · בלי I/O/0/1 · rand(24) פעם אחת
ok(k1.length === 29, `אורך ⇒ ${k1.length}`);
ok(k1.split('-').length === 6 && k1.split('-').every((g) => g.length === 4), 'לא 6 קבוצות של 4');
ok(!/[IO01]/.test(k1 + k2 + k3), 'תו מבלבל (I/O/0/1) הופיע');
ok(calls.length === 1 && calls[0] === 24, 'rand לא נקרא בדיוק פעם אחת עם 24');
if (f) process.exit(1);
console.log('✓ gen-recovery-key: 4 דוגמאות-חוזה (8 בדיקות) — ירוק');
