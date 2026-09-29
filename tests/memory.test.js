// step mem-core: facts, not notes. Eighteen checks - the parser, one document per fact, a correction kept visible,
// Hebrew prefixes in a query, forget as a tomb, a migration that loses nothing, the voice commands, the janitor.
// Run: node tests/memory.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-mem-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__mem && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  let fails = 0, n = 0; const ok = (c, m) => { n++; console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  // seed the old stores before the migration runs (it waits 15 s after load)
  await f.evaluate(() => { window.__h.set('memory/notes/items/a1', { text: 'הרופאה של הילדים היא דוקטור כהן', ts: 1 }); window.__h.set('memory/notes/items/a2', { text: 'לקנות מתנה לאמא', ts: 2 }); window.__h.set('memory/prefs/items/p1', { text: 'לא להתקשר אחרי עשר בלילה', ts: 3 }); });
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.27.0', pv: 1, caps: ['spoke'], wall: Date.now() })); await p.waitForTimeout(400);
  const M = (fn, ...a) => f.evaluate(fn, ...a);
  // 1-4 the parser
  const p1 = await M(() => window.__mem.parse('שהרואה חשבון הוא דני'));
  ok(p1.subject === 'הרואה חשבון' && p1.predicate === 'הוא' && p1.value === 'דני' && p1.kind === 'person', 'parse: "X הוא Y" is a triple, a role makes it a person: ' + JSON.stringify(p1));
  const p2 = await M(() => window.__mem.parse('יש לי שלושה ילדים'));
  ok(p2.subject === 'אני' && p2.value === 'שלושה ילדים' && p2.kind === 'fact', 'parse: "יש לי X"');
  const p3 = await M(() => window.__mem.parse('דני מתגייס באוגוסט'));
  ok(p3.kind === 'event' && p3.subject === 'דני' && p3.value === 'באוגוסט', 'parse: an event');
  const p4 = await M(() => window.__mem.parse('לקנות חלב מחר בבוקר'));
  ok(p4.kind === 'note' && p4.conf === 0.3 && p4.raw === 'לקנות חלב מחר בבוקר', 'parse: what it does not understand is a note - raw kept, confidence 0.3, never a wrong triple');
  // 5-6 one document per fact; a correction keeps the old value
  const five = await M(async () => { for (let i = 0; i < 200; i++) await window.__mem.put(window.__mem.parse('הרואה חשבון הוא דני')); return window.__h.all('memory/facts/items').filter(x => /דני/.test(x.value)).map(x => x.uses); });
  ok(five.length === 1 && five[0] === 200, 'the same fact 200 times is one document, used 200 times: ' + JSON.stringify(five));
  const six = await M(async () => { const r = await window.__mem.put(window.__mem.parse('הרואה חשבון הוא משה')); const d = window.__h.all('memory/facts/items').find(x => x.subject === 'הרואה חשבון'); return { r, v: d.value, prev: d.prev && d.prev.value }; });
  ok(six.r.replaced && six.v === 'משה' && six.prev === 'דני', 'a correction replaces the value and keeps the old one visible: ' + JSON.stringify(six));
  // 7-8 query, with Hebrew prefixes, fast
  const q7 = await M(async () => (await window.__mem.query('למשה')).map(x => x.value));
  ok(q7.includes('משה'), 'query: "למשה" finds "משה" (Hebrew prefixes are ignored)');
  const q8 = await M(async () => { for (let i = 0; i < 1000; i++) window.__h.docs.set('memory/facts/items/bulk' + i, { subject: 'פריט ' + i, predicate: 'הוא', value: 'ערך ' + i, raw: 'פריט ' + i, state: 'live', updatedAt: i }); const t = performance.now(); const r = await window.__mem.query('פריט 777'); return { ms: Math.round(performance.now() - t), n: r.length }; });
  ok(q8.n >= 1 && q8.ms < 200, 'query over 1,000 facts (the contract caps facts at 600): ' + JSON.stringify(q8));
  await M(() => { for (const k of [...window.__h.docs.keys()]) if (/bulk\d+$/.test(k)) window.__h.docs.delete(k); });
  // 9 forget is a tomb
  const f9 = await M(async () => { await window.__mem.put(window.__mem.parse('דני מתגייס באוגוסט')); await window.__mem.forget('מתגייס'); const d = window.__h.all('memory/facts/items').find(x => x.predicate === 'מתגייס'); return { state: d && d.state, found: (await window.__mem.query('מתגייס')).length }; });
  ok(f9.state === 'tomb' && f9.found === 0, 'forget: a tomb - gone from answers, still recoverable for 30 days: ' + JSON.stringify(f9));
  // 10-11 the migration: nothing lost, and only once
  await p.waitForTimeout(15500);
  const m10 = await M(() => ({ meta: window.__h.get('memory/meta'), notes: window.__h.all('memory/notes/items').map(x => x.state), prefs: window.__h.all('memory/prefs/items').map(x => x.state), facts: window.__h.all('memory/facts/items').filter(x => x.source && x.source.type === 'migrated').map(x => x.raw) }));
  ok(m10.meta && m10.meta.schema === 2 && m10.meta.found === 3 && m10.meta.moved === 3 && m10.facts.length === 3, 'migrate: 3 found = 3 moved = 3 facts, 0 lost: ' + JSON.stringify({ meta: m10.meta && { found: m10.meta.found, moved: m10.meta.moved }, facts: m10.facts.length }));
  ok(m10.notes.every(s => s === 'tomb') && m10.prefs.every(s => s === 'tomb'), 'migrate: the old notes and prefs stay behind as tombs for 30 days');
  const m11 = await M(() => window.__mem.migrate());
  ok(m11 && m11.skipped, 'migrate: a second run does nothing');
  // 12-16 by voice
  const said = async t => { await p.evaluate(() => { window.msgs = []; }); await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await p.waitForTimeout(2300); const m = await p.evaluate(() => window.msgs.slice()); for (const x of m) if (x.liba === 'say' && x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); return m.filter(x => x.liba === 'say').map(x => x.text).join(' | '); };
  const v12 = await said('תזכור שהשכן החדש הוא יוסי'), v12b = await said('תזכור שהשכן החדש הוא יוסי');
  ok(/זכרתי: שהשכן החדש הוא יוסי/.test(v12) && /כבר זכרתי/.test(v12b), 'voice: "תזכור" stores, and the second time says it already knew: ' + v12b);
  const v13 = await said('מה את זוכרת על יוסי');
  ok(/על יוסי אני יודעת: שהשכן החדש הוא יוסי/.test(v13), '"מה את זוכרת על X": ' + v13);
  const v14a = await said('תשכח את יוסי'), v14 = await said('כן');
  ok(/כן או לא/.test(v14a) && /שכחתי 1 דבר על יוסי/.test(v14) && /שלושים יום/.test(v14), '"תשכח" asks, then says it can still be undone: ' + v14);
  const v15 = await said('מה אתה זוכר');
  ok(/אני זוכרת/.test(v15) && /הרופאה של הילדים/.test(v15) && !/יוסי/.test(v15), '"מה אתה זוכר" lists live facts, not the forgotten one: ' + v15.slice(0, 120));
  const v16 = await said('אל תשאל אותי על ארוחת ערב');
  const pref = await M(() => window.__h.all('memory/facts/items').find(x => x.kind === 'pref' && /ארוחת ערב/.test(x.value)));
  ok(/העדפה קבועה/.test(v16) && pref && pref.conf === 0.9, 'a preference is a fact of kind pref');
  // 17 sensitivity
  const s17 = await M(() => window.__h.all('memory/facts/items').find(x => x.subject === 'הרואה חשבון'));
  ok(s17 && s17.sens === 1, 'a fact about a person is marked sensitive (1) by default');
  // 18 the janitor clears tombs after 30 days (folded first)
  const j18 = await M(async () => { const r = await window.__janitor.sweep(Date.now() + 31 * 864e5); return { tombs: window.__h.all('memory/facts/items').filter(x => x.state === 'tomb').length, folded: [...window.__h.docs.keys()].some(k => /^fold\/facts-/.test(k)) }; });
  ok(j18.tombs === 0 && j18.folded, 'janitor: tombs older than 30 days are folded, then cleared: ' + JSON.stringify(j18));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו מתוך ${n}` : `\nכל ${n} הבדיקות עברו`); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
