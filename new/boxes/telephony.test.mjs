/** בדיקת-קצה · קופסת telephony — מוכיחה את דוגמאות-החוזה דרך הקופסה בלבד.
 *  מותר לייבא את הקופסה-שלה בלבד (חוק-4). שקעי-המנוע = דמה רושמי-קריאות. */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import {
  emptyTelephonyConfig, toTenantId, telephonyToTenant,
  previewTelephony, nextClosure, explainOne,
} from './telephony.mjs';

let f = 0;
const check = (name, fn) => { try { fn(); } catch (e) { console.error(`✗ ${name}: ${e.message}`); f = 1; } };

// tc מלא (telephonyToTenant דורש officeDays/שעות/ext — כמו במקור); numbers מוזרק פר-בדיקה.
const fullTc = (numbers) => ({
  numbers, officeDays: [0, 1, 2, 3, 4], officeStart: '09:00', officeEnd: '17:00',
  officeExt: '101', managerExt: '201', vmBox: '100', city: '',
  kosherMode: false, hebrewCalendar: true, shabbat: true, fasts: false, zmanim: false, voicemail: true,
});

// ── דוגמה 1 · emptyTelephonyConfig ──
check('empty', () => {
  const c = emptyTelephonyConfig();
  assert.deepStrictEqual(c.officeDays, [0, 1, 2, 3, 4]);
  assert.strictEqual(c.officeStart, '09:00');
  assert.strictEqual(c.numbers[0].kind, 'sim');
  assert.strictEqual(c.hebrewCalendar, true);
  assert.strictEqual(c.zmanim, false);
});

// ── דוגמה 2 · toTenantId ──
check('tenant-id', () => {
  assert.strictEqual(toTenantId('My Org!!', 'x'), 'my-org');
  assert.strictEqual(toTenantId('default', 'חסד קהילה'), 'x--org');
  assert.strictEqual(toTenantId('ab', ''), 'ab-org');
});

// ── דוגמה 3 · telephonyToTenant ──
check('to-tenant', () => {
  const raw = telephonyToTenant({
    numbers: [
      { id: 'n1', e164: ' +9721 ', kind: 'sim' },
      { id: 'n2', e164: '', kind: 'virtual' },
    ],
    officeDays: [4, 0, 2], officeStart: '08', officeEnd: '16',
    officeExt: '1', managerExt: '2', vmBox: '3', city: '',
    kosherMode: false, hebrewCalendar: true, shabbat: true, fasts: false,
    zmanim: false, voicemail: true,
  }, '', 'ten');
  assert.strictEqual(raw.numbers.length, 1);           // n2 ריק-e164 סוננה
  assert.strictEqual(raw.numbers[0].e164, '+9721');    // trim
  assert.strictEqual(raw.numbers[0].gatewayChannel, 1);
  assert.strictEqual(raw.outbound.defaultNumberId, 'n1');
  assert.deepStrictEqual(raw.officeHours.days, [0, 2, 4]);
  assert.strictEqual(raw.orgName, 'ארגון');            // orgName ריק ⇒ 'ארגון'
  assert.ok(!('city' in raw));                          // city ריק ⇒ מושמט
});

// ── דוגמה 4 · previewTelephony · ולידציה-נכשלת ⇒ יציאה-מוקדמת ──
check('preview-fail-fast', () => {
  let buildCalls = 0;
  const io = {
    anchorToday: () => '2026-08-24',
    validateTenant: () => ({ ok: false, errors: ['e'], warnings: ['w'] }),
    buildTenant: () => { buildCalls++; return { ok: true }; },
    explainCall: () => ({ summary: '', outcome: '' }),
    trustReport: () => ({ grade: 'A', score: 0, ready: true, failing: [] }),
  };
  const r = previewTelephony(fullTc([{ id: 'n1', e164: '+9721', kind: 'sim' }]), 'org', 'ten', io);
  assert.deepStrictEqual(r, { ok: false, errors: ['e'], warnings: ['w'], rows: [], trust: null, files: null });
  assert.strictEqual(buildCalls, 0);                   // buildTenant לא נקרא
});

// ── דוגמה 5 · previewTelephony · ולידציה-עוברת ⇒ 3 תרחישים + opts קבוע ──
check('preview-pass', () => {
  const seen = [];
  const io = {
    anchorToday: () => '2026-08-24',
    validateTenant: (raw) => ({ ok: true, errors: [], warnings: [], tenant: raw }),
    buildTenant: () => ({ ok: true, warnings: ['bw'], files: { 'a.conf': 'x' } }),
    explainCall: (tenant, call, opts) => { seen.push({ call, opts }); return { summary: 's', outcome: 'o' }; },
    trustReport: () => ({ grade: 'B', score: 80, ready: true, failing: [{ label: 'l', detail: 'd', severity: 'warn', extra: 'זולג' }] }),
  };
  const r = previewTelephony(fullTc([{ id: 'n1', e164: '+972501111111', kind: 'sim' }]), 'org', 'ten', io);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.rows.length, 3);
  assert.strictEqual(seen.length, 3);
  seen.forEach((s) => {
    assert.strictEqual(s.opts.anchorDate, '2026-08-24');
    assert.strictEqual(s.opts.calendarWindow, 400);
    assert.strictEqual(s.call.callerId, '050-1234567');
    assert.strictEqual(s.call.did, '+972501111111');
  });
  assert.deepStrictEqual(seen.map((s) => [s.call.dow, s.call.hhmm]), [[2, '10:00'], [2, '20:00'], [6, '11:00']]);
  // trust ממופה ל-4 שדות בלבד (extra מסונן)
  assert.deepStrictEqual(r.trust, { grade: 'B', score: 80, ready: true, failing: [{ label: 'l', detail: 'd', severity: 'warn' }] });
  assert.deepStrictEqual(r.warnings, ['bw']);
  assert.deepStrictEqual(r.files, { 'a.conf': 'x' });
});

// ── בחירת-DID: sim גובר על המספר-הראשון ──
check('preview-did-sim-wins', () => {
  const seen = [];
  const io = {
    anchorToday: () => '2026-08-24',
    validateTenant: (raw) => ({ ok: true, errors: [], warnings: [], tenant: raw }),
    buildTenant: () => ({ ok: false, warnings: [] }),
    explainCall: (t, call) => { seen.push(call.did); return { summary: '', outcome: '' }; },
    trustReport: () => ({ grade: 'F', score: 0, ready: false, failing: [] }),
  };
  const r = previewTelephony(
    fullTc([{ id: 'n0', e164: '+97221111111', kind: 'landline' }, { id: 'n1', e164: '+972501111111', kind: 'sim' }]),
    'org', 'ten', io);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.trust, null);                   // built.ok=false ⇒ trust=null
  assert.ok(seen.every((d) => d === '+972501111111'));
});

// ── דוגמה 6 · nextClosure · בלי telephony ⇒ null, השקע לא נקרא ──
check('closure-no-tel', () => {
  let calls = 0;
  const io = { hebrewClosedWindows: () => { calls++; return []; }, CITIES: {} };
  assert.strictEqual(nextClosure({}, '2026-08-24', io), null);
  assert.strictEqual(calls, 0);
});

// ── דוגמה 7 · nextClosure · מיפוי + עיר ──
check('closure-map', () => {
  let seenArgs = null;
  const io = {
    hebrewClosedWindows: (from, days, tenant, opt) => { seenArgs = [from, days, tenant, opt]; return [{ reason: 'שבת', kind: 'shabbat', startIso: 'a', startTime: '18:42', endIso: 'b', endTime: '19:53', days: 1 }]; },
    CITIES: { telaviv: { he: 'תל אביב' }, jerusalem: { he: 'ירושלים' } },
  };
  const r = nextClosure({ telephony: { city: 'telaviv' } }, '2026-08-24', io);
  assert.deepStrictEqual(r, { reason: 'שבת', kind: 'shabbat', startIso: 'a', candle: '18:42', endIso: 'b', tzeis: '19:53', cityHe: 'תל אביב' });
  assert.deepStrictEqual(seenArgs, ['2026-08-24', 10, { city: 'telaviv', timezone: 'Asia/Jerusalem' }, {}]);
});

// ── nextClosure · עיר לא-מוכרת/חסרה ⇒ נפילת-ירושלים ──
check('closure-fallback', () => {
  const win = [{ reason: 'r', kind: 'k', startIso: 's', startTime: 't1', endIso: 'e', endTime: 't2', days: 1 }];
  const CITIES = { jerusalem: { he: 'ירושלים' } };
  const rNone = nextClosure({ telephony: {} }, '2026-08-24', { hebrewClosedWindows: () => win, CITIES });
  assert.strictEqual(rNone.cityHe, 'ירושלים');
  const rBad = nextClosure({ telephony: { city: 'nowhere' } }, '2026-08-24', { hebrewClosedWindows: () => win, CITIES });
  assert.strictEqual(rBad.cityHe, 'ירושלים');
  // חלון ריק ⇒ null
  assert.strictEqual(nextClosure({ telephony: { city: 'telaviv' } }, '2026-08-24', { hebrewClosedWindows: () => [], CITIES }), null);
});

// ── דוגמה 8 · explainOne · ולידציה-נכשלת ⇒ סיכום-שגיאה ──
check('explain-fail', () => {
  const io = {
    anchorToday: () => '2026-08-24',
    validateTenant: () => ({ ok: false, errors: ['אין DID'] }),
    explainCall: () => { throw new Error('לא-אמור-להיקרא'); },
  };
  const r = explainOne(fullTc([]), 'org', 'ten', { dow: 2, hhmm: '10:00' }, io);
  assert.deepStrictEqual(r, { summary: '⚠️ תצורה לא-תקינה: אין DID', outcome: 'invalid', reason: '' });
});

// ── explainOne · ולידציה-עוברת ⇒ explainCall עם opts קבוע ──
check('explain-pass', () => {
  let seenOpts = null;
  const io = {
    anchorToday: () => '2026-08-24',
    validateTenant: (raw) => ({ ok: true, errors: [], tenant: raw }),
    explainCall: (tenant, call, opts) => { seenOpts = opts; return { summary: 's', outcome: 'o', reason: 'r' }; },
  };
  const r = explainOne(fullTc([{ id: 'n1', e164: '+9721', kind: 'sim' }]), 'org', 'ten', { dow: 3, hhmm: '09:00' }, io);
  assert.deepStrictEqual(r, { summary: 's', outcome: 'o', reason: 'r' });
  assert.deepStrictEqual(seenOpts, { anchorDate: '2026-08-24', calendarWindow: 400 });
});

/* 🛡 מגן-הכרעה: הבדיקה קוראת את מקור-הקופסה ומאשרת את הכרעת-החיווט verbatim —
 *  ש-telephonyToTenant (חוט-הקופסה) מוזרק לשקע-ההמרה של preview + explain, ושהחוטים
 *  הטהורים עוברים כלשונם. (דפוס theme.test — הכרעה חיה-בקופסה, לא-בחוט.) */
const src = readFileSync(new URL('./telephony.mjs', import.meta.url), 'utf8');
check('guard-reexport', () => {
  assert.ok(src.includes('export { emptyTelephonyConfig, toTenantId, telephonyToTenant };'), 'חשיפת-חוטים-טהורים שונתה');
});
check('guard-wire-preview', () => {
  // בין קריאת previewTelephonyAtom לסוגר — telephonyToTenant ממלא את שקע-ההמרה.
  const seg = src.slice(src.indexOf('previewTelephonyAtom('), src.indexOf(');', src.indexOf('previewTelephonyAtom(')));
  assert.ok(seg.includes('telephonyToTenant'), 'preview: שקע-ההמרה אינו חוט-הקופסה');
});
check('guard-wire-explain', () => {
  const seg = src.slice(src.indexOf('explainOneAtom('), src.indexOf(');', src.indexOf('explainOneAtom(')));
  assert.ok(seg.includes('telephonyToTenant'), 'explain: שקע-ההמרה אינו חוט-הקופסה');
});

if (f) process.exit(1);
console.log('✓ קופסת-טלפוניה: 6 חוטים · preview/explain fail-fast + 3-תרחישים + opts-קבוע · closure-מיפוי+נפילת-ירושלים · מגן-חיווט — ירוק');
