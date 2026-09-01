// בדיקת-חוזה · pick-look — סיגנל⇒מראה · אין-סיגנל⇒null · דילוג-הערות.
import { pickLook } from './pick-look.mjs';
import assert from 'node:assert';

const looks = { _note: 'הערה', 'כהה': 'dark', 'לילה': 'dark' };

assert.strictEqual(pickLook('מסך כהה: כפתור', looks), 'dark', 'סיגנל⇒dark');
assert.strictEqual(pickLook('מסך לילה', looks), 'dark', 'מילה נרדפת');
assert.strictEqual(pickLook('מסך: כפתור, שדה', looks), null, 'אין-סיגנל⇒null');
assert.strictEqual(pickLook('', looks), null, 'ריק⇒null');
assert.strictEqual(pickLook('כהה', null), null, 'אין-מילון⇒null');
// מפתח שמתחיל ב-_ מדולג גם כשהטקסט מכיל אותו מילולית
assert.strictEqual(pickLook('foo _note bar', looks), null, 'מפתח-_ מדולג');

console.log('OK pick-look — סיגנל⇒מראה · אין-סיגנל⇒null · דילוג-הערות');
