import { promptInstall as __pure_promptInstall } from './prompt-install.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_prompt_install_T = {
  k1: "accepted",
};
const promptInstall = (...a) => __pure_promptInstall(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_prompt_install_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const fake = (outcome) => {
  const calls = [];
  return {
    calls,
    d: {
      prompt: async () => { calls.push('prompt'); },
      userChoice: Promise.resolve({ outcome }).then((r) => { calls.push('choice'); return r; }),
    },
  };
};

// 1) בלי אירוע ⇒ false מיידי
ok((await promptInstall(null)) === false, 'null לא החזיר false');

// 2) המשתמש אישר ⇒ true
const a = fake('accepted');
ok((await promptInstall(a.d)) === true, 'accepted לא החזיר true');

// 3) המשתמש דחה ⇒ false
ok((await promptInstall(fake('dismissed').d)) === false, 'dismissed לא החזיר false');

// 4) outcome זר ⇒ false
ok((await promptInstall(fake('unknown').d)) === false, 'outcome זר החזיר true');

// 5) prompt נקרא בדיוק פעם אחת, לפני קריאת-הבחירה
ok(a.calls.filter((c) => c === 'prompt').length === 1, 'prompt לא נקרא בדיוק פעם אחת');
ok(a.calls[0] === 'prompt', 'prompt לא קדם ל-userChoice');

if (f) process.exit(1);
console.log('✓ prompt-install: 5 דוגמאות-חוזה — ירוק (ה-DOM נשאר בקופסה)');
