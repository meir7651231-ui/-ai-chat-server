// בדיקת-צילום · smtp-account-state — ביט-אחר-ביט.
import { SMTP_STATE } from './smtp-account-state.mjs';
import assert from 'node:assert';
assert.deepStrictEqual(SMTP_STATE, { empty: 'empty', error: 'error', ok: 'ok' });
console.log('OK smtp-account-state');
