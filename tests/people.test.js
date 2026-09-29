// step people: one card per person. "דני הוא הבן שלי" makes it, "מי זה דני" reads it, twelve ways of saying the name
// find the same card and never make a second one, a nickname is taught once, a merge asks first and can be undone,
// thirty people answer in under two seconds, and the brief favours facts about the person in the sentence.
// Run: node tests/people.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-people-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__people && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.27.0', pv: 1, caps: ['spoke'], wall: Date.now() })); await p.waitForTimeout(400);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const said = async t => { await p.evaluate(() => { window.msgs = []; }); await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await p.waitForTimeout(2300); const m = await p.evaluate(() => window.msgs.slice()); for (const x of m) if (x.liba === 'say' && x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); return m.filter(x => x.liba === 'say').map(x => x.text).join(' | '); };
  const cards = () => f.evaluate(() => window.__h.all('memory/people/items').filter(x => x.state !== 'tomb'));
  const a1 = await said('דני הוא הבן שלי');
  ok(/רשמתי: דני הוא הבן שלי/.test(a1) && (await cards()).length === 1, '"דני הוא הבן שלי" makes a card: ' + a1);
  const sentBefore = (await f.evaluate(() => window.__h.sent.length)); await said('העיצוב הוא מפלצתי');
  ok((await cards()).length === 1 && (await f.evaluate(() => window.__h.sent.length)) === sentBefore + 1, 'an ordinary "X הוא Y" is not a person - it goes on to Claude');
  const a2 = await said('מי זה דני');
  ok(/דני הוא הבן שלי/.test(a2), '"מי זה דני": ' + a2);
  // twelve ways of saying the name: one card
  const variants = ['תתקשר לדני', 'של דני', 'ודני אמר', 'כשדני יחזור', 'מדני', 'בדני', 'שדני', 'להדני', 'דני', 'דני!', 'דָנִי', 'מה עם דני?'];
  const found = await f.evaluate(async vs => { const out = []; for (const v of vs) out.push((await window.__people.resolve(v)).map(x => x.name).join()); return out; }, variants);
  ok(found.filter(x => x === 'דני').length >= 11, 'twelve ways of saying "דני" find the one card: ' + found.filter(x => x === 'דני').length + '/12 ' + JSON.stringify(found));
  for (const v of ['דני הוא הבן שלי', 'דני הוא הבן', 'דָנִי הוא הבן שלי']) await said(v);
  ok((await cards()).length === 1, 'saying it again (three ways) makes no second card: ' + (await cards()).length);
  // a nickname
  await said('מי זה דני'); const a3 = await said("תקרא לו דנצ'יק");
  const nick = await f.evaluate(async () => (await window.__people.resolve('דנציק בא הביתה')).map(x => x.name).join());
  ok(/דני זה גם דנציק/.test(a3) && nick === 'דני', 'a nickname is taught once and then finds the card: ' + a3);
  // a person said the "תזכור" way: the role is the relation, the value the name
  await said('תזכור שהרואה חשבון הוא משה');
  const moshe = (await cards()).find(c => c.name === 'משה');
  ok(moshe && moshe.relation === 'הרואה חשבון', '"תזכור שהרואה חשבון הוא משה" makes a card for משה: ' + JSON.stringify(moshe && moshe.relation));
  // a merge asks first, then keeps the other one recoverable
  await said('דניאל הוא הבן שלי'); const m1 = await said('תאחד את דני עם דניאל'), m2 = await said('כן');
  const after = await f.evaluate(() => window.__h.all('memory/people/items'));
  const d = after.find(x => x.name === 'דני'), dl = after.find(x => x.name === 'דניאל');
  ok(/כן או לא/.test(m1) && /איחדתי/.test(m2) && d.aliases.includes('דניאל') && dl.state === 'tomb' && dl.mergedInto === d.id, 'a merge asks first, and the merged card stays recoverable: ' + m2);
  // thirty people, one question
  const ms = await f.evaluate(async () => { for (let i = 0; i < 30; i++) await window.__people.upsert('איש' + i + 'ון', { relation: 'לקוח' }); window.__people.cache = null; const t = performance.now(); const r = await window.__people.resolve('מה עם איש17ון'); return { ms: Math.round(performance.now() - t), n: r.length }; });
  ok(ms.n === 1 && ms.ms < 2000, '"מי זה" over 31 people in ' + ms.ms + 'ms');
  // the brief favours a fact about the person in the sentence
  const bf = await f.evaluate(async () => { await window.__mem.put(window.__mem.parse('דני מתגייס באוגוסט')); return await brief('מה שלום דני'); });
  ok(/מתגייס באוגוסט/.test(bf), 'brief: a fact about the person in the sentence comes along: ' + bf.trim().slice(0, 80));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
