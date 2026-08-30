// בדיקת-צילום · shop7-status-labels — ביט-אחר-ביט.
import { STATUS_LABEL } from './shop7-status-labels.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(STATUS_LABEL), "{\"pickup\":\"\u05d0\u05d9\u05e1\u05d5\u05e3\",\"enroute\":\"\u05d1\u05d3\u05e8\u05da\",\"delivered\":\"\u05e0\u05de\u05e1\u05e8\"}");
console.log('OK shop7-status-labels');
