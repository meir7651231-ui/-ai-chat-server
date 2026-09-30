// step voice-form: a recurring report filled by voice, end to end - numbers in words, a wrong number, back, a person, a
// wrong choice, a date, a skipped optional field, the app "closed" in the middle and resumed with nothing lost, the
// read-back, a correction, the close into a form-emit task, last values remembered. Counts its failures and exits
// non-zero on any. Run: node tests/form.e2e.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-form-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__form && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const hello = caps => p.evaluate(c => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: c, wall: Date.now() }); }, caps);
  await f.evaluate(() => { bookTickAt = Date.now() + 1e12; });
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.36.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(40); } };
  const say = async (t, re) => { await speak(400); heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); for (let i = 0; i < 30 && !heard.some(h => !re || re.test(h)); i++) await speak(200); await speak(300); return heard.join(' | '); };
  // 1. numbers in words
  const HN = [['שלוש מאות ארבעים ושתיים', 342], ['אלף מאתיים', 1200], ['שלושת אלפים וחמש מאות', 3500], ['עשרים ואחת', 21], ['אחת עשרה', 11], ['שתים עשרה', 12], ['שנים עשר', 12],
    ['מאה', 100], ['57', 57], ['1,250', 1250], ['חמש וחצי', 5.5], ['שבע', 7], ['אלפיים ושלוש מאות', 2300], ['מאה עשרים ושמונה', 128], ['כלום', null], ['הרבה', null]];
  const hn = await f.evaluate(c => c.map(([t]) => window.__form.hebNum(t)), HN);
  const bad = HN.filter((c, i) => hn[i] !== c[1]);
  ok(!bad.length, `hebNum: ${HN.length - bad.length}/${HN.length}` + (bad.length ? ' - ' + bad.map(c => c[0] + '→' + hn[HN.indexOf(c)]).join(', ') : ''));
  await f.evaluate(() => window.__h.set('book/forms/items/f1', { title: 'דוח נוכחות', feeds: ['דוח נוכחות'], fields: [
    { key: 'present', label: 'כמה נוכחים', type: 'number', required: true }, { key: 'absent', label: 'כמה חסרים', type: 'number', required: true },
    { key: 'teacher', label: 'מי הר"מ התורן', type: 'person', required: true }, { key: 'state', label: 'מצב המבנה', type: 'choice', options: ['תקין', 'צריך תיקון'], required: true },
    { key: 'date', label: 'לאיזה תאריך', type: 'date', required: true }, { key: 'note', label: 'הערה', type: 'text', required: false }] }));
  // 2. unknown form
  let s = await say('תמלאי את טופס החלל', /לא מצאתי/);
  ok(/לא מצאתי טופס בשם טופס החלל/.test(s), 'an unknown form: said');
  // 3. start
  s = await say('תמלאי את דוח הנוכחות', /כמה נוכחים\?/);
  ok(/דוח נוכחות: 6 שאלות/.test(s) && /כמה נוכחים\?/.test(s), 'start: how many questions, the first one: ' + s.slice(0, 90));
  // 4. a number in words
  s = await say('שלוש מאות ארבעים ושתיים', /כמה חסרים\?/);
  let run = async () => (await f.evaluate(() => window.__h.all('book/runs/items')))[0];
  ok((await run()).values.present === 342 && /כמה חסרים\?/.test(s), 'a number in words: 342, written at once');
  // 5. a wrong number
  s = await say('הרבה מאוד', /לא שמעתי מספר/);
  ok(/לא שמעתי מספר\. כמה חסרים\?/.test(s), 'not a number: asked again');
  s = await say('שבע', /מי הר"מ התורן\?/);
  // 6. back
  s = await say('תחזור שאלה אחורה', /כמה חסרים\?/);
  ok(/כמה חסרים\?/.test(s), 'back one question');
  s = await say('שמונה', /מי הר"מ התורן\?/);
  ok((await run()).values.absent === 8, 'the corrected answer replaces the old one: 8');
  // 7. a person
  s = await say('הרב כהן', /מצב המבנה\?/);
  // 8. a wrong choice
  s = await say('נהדר', /אחת מ: תקין, צריך תיקון/);
  ok(/אחת מ: תקין, צריך תיקון\. מצב המבנה\?/.test(s), 'not one of the choices: the choices are said');
  s = await say('צריך תיקון', /לאיזה תאריך\?/);
  // 9. the app closes in the middle
  await f.evaluate(() => { formCur = null; });
  s = await say('תמשיך את הדוח', /לאיזה תאריך\?/);
  ok(/ממשיכה את דוח נוכחות - 4 מתוך 6 כבר נענו/.test(s) && /לאיזה תאריך\?/.test(s), 'resumed after the app closed: nothing lost: ' + s.slice(0, 90));
  // 10. a date
  s = await say('היום', /הערה\?/);
  ok((await run()).values.date === (await f.evaluate(() => trDay(Date.now()))), 'a date: today');
  // 11. skip the optional one
  s = await say('דלג', /קראתי:/);
  ok(/קראתי: כמה נוכחים 342, כמה חסרים 8, מי הר"מ התורן הרב כהן\. נכון\?/.test(s), 'the read-back: every number and name: ' + (heard.find(h => /קראתי/.test(h)) || '').slice(0, 120));
  // 12. a correction from the read-back
  s = await say('לא', /איזה שדה לתקן\?/);
  s = await say('כמה נוכחים', /כמה נוכחים\?/);
  s = await say('שלוש מאות ארבעים ושלוש', /קראתי:/);
  ok(/כמה נוכחים 343/.test(s), 'corrected, read back again');
  // 13. the close
  s = await say('נכון', /נסגר/);
  const r = await run(), emit = await f.evaluate(() => window.__h.all('tasks').filter(t => t.kind === 'form-emit')), form = await f.evaluate(() => window.__h.get('book/forms/items/f1'));
  ok(r.state === 'done' && r.doneAt > 0 && emit.length === 1 && emit[0].values.present === 343 && emit[0].values.teacher === 'הרב כהן' && emit[0].values.note === '', 'closed: the run done, one form-emit task with the values');
  ok(form.fields[0].lastValue === 343 && form.fields[2].lastValue === 'הרב כהן', 'the last values are remembered for next time');
  s = await say('תמלאי את דוח הנוכחות', /כמה נוכחים\?/);
  ok(/כמה נוכחים\? בפעם הקודמת: 343/.test(s), 'next time: the last value is said');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
