// בדיקת-צילום · integration-prices — ביט-אחר-ביט.
import { DEFAULT_INTEGRATION_PRICES } from './integration-prices.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DEFAULT_INTEGRATION_PRICES), "{\"receipts\":60,\"payments\":90,\"whatsapp\":50,\"sms\":40,\"phone\":90,\"gcal\":30,\"drive\":30,\"sheets\":40,\"maps\":40,\"esign\":60,\"ai\":120,\"campaign\":60}");
console.log('OK integration-prices');
