import { buildTenant } from './build-tenant.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const J = JSON.stringify;

// 1. אימות-נכשל ⇒ ok:false, אין files, generateConfig לא נקרא
{
  let genCalls = 0;
  const r = buildTenant({}, {}, () => ({ ok: false, errors: ['E1'], warnings: ['W1'] }),
    () => { genCalls++; return {}; }, () => ({}));
  ok(r.ok === false && J(r.errors) === '["E1"]' && J(r.warnings) === '["W1"]', '1: פלט-כשל לא תואם: ' + J(r));
  ok(!('files' in r) && !('manifest' in r), '1: כשל החזיר files/manifest');
  ok(genCalls === 0, '1: generateConfig נקרא בכשל (' + genCalls + ')');
}
// 2. הצלחה מלאה עם genWarns
{
  const r = buildTenant({}, {},
    () => ({ ok: true, errors: [], warnings: ['W'], tenant: { id: 't1' } }),
    () => ({ files: { 'a.conf': 'x' }, manifest: { n: 1 }, warnings: ['G'] }), () => ({}));
  ok(r.ok === true && J(r.errors) === '[]' && J(r.warnings) === '["G"]', '2: ok/errors/warnings לא תואם: ' + J(r));
  ok(J(r.files) === '{"a.conf":"x"}' && J(r.manifest) === '{"n":1}' && r.tenant.id === 't1', '2: files/manifest/tenant לא תואם: ' + J(r));
}
// 3. genWarns ריק ⇒ נפילה לאזהרות-האימות
{
  const r = buildTenant({}, {},
    () => ({ ok: true, errors: [], warnings: ['W'], tenant: {} }),
    () => ({ files: {}, manifest: {} }), () => ({}));
  ok(J(r.warnings) === '["W"]', '3: warnings ≠ ["W"]: ' + J(r.warnings));
}
// 4. בלי layers ⇒ effectiveConfig לא נקרא, validateTenant מקבל את raw עצמו
{
  let effCalls = 0, seen = null;
  const raw = { name: 'x' };
  buildTenant(raw, {},
    (c) => { seen = c; return { ok: false, errors: [], warnings: [] }; },
    () => ({}), () => { effCalls++; return {}; });
  ok(effCalls === 0, '4: effectiveConfig נקרא בלי layers (' + effCalls + ')');
  ok(seen === raw, '4: validateTenant לא קיבל את raw עצמו');
}
// 5. layers.base ⇒ מיזוג {...raw, features, terms}
{
  let effArgs = null, seen = null;
  const raw = { name: 'x' };
  buildTenant(raw, { layers: { base: { b: 1 } } },
    (c) => { seen = c; return { ok: false, errors: [], warnings: [] }; },
    () => ({}),
    (base, r, member) => { effArgs = [base, r, member]; return { features: { f: true }, terms: { t: 'א' } }; });
  ok(effArgs && J(effArgs[0]) === '{"b":1}' && effArgs[1] === raw && effArgs[2] === null, '5: ארגומנטי effectiveConfig לא תואמים: ' + J(effArgs));
  ok(J(seen) === '{"name":"x","features":{"f":true},"terms":{"t":"א"}}', '5: cfg ממוזג לא תואם: ' + J(seen));
}
// 6. member בלבד ⇒ effectiveConfig({}, raw, member)
{
  let effArgs = null;
  const raw = { name: 'y' }, member = { m: 1 };
  buildTenant(raw, { layers: { member } },
    () => ({ ok: false, errors: [], warnings: [] }), () => ({}),
    (base, r, mem) => { effArgs = [base, r, mem]; return { features: {}, terms: {} }; });
  ok(effArgs && J(effArgs[0]) === '{}' && effArgs[1] === raw && effArgs[2] === member, '6: member-בלבד לא מיזג נכון: ' + J(effArgs));
}
if (f) process.exit(1);
console.log('✓ build-tenant: 6 דוגמאות-חוזה — ירוק (3 שקעים מוזרקים, אפס import פנימי)');
