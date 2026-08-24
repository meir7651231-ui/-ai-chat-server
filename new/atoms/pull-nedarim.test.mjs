import { pullNedarim } from './pull-nedarim.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// זיוף-רשת: Response-דמוי לפי תסריט; jsonReject=גוף שאינו JSON
const fake = (script) => {
  const calls = [];
  const doFetch = async (url, init) => {
    calls.push({ url, init });
    return {
      ok: script.status === 200,
      status: script.status,
      json: async () => { if (script.jsonReject) throw new Error('bad json'); return script.body; },
    };
  };
  return { doFetch, calls };
};
const authWith = (token) => ({ currentUser: { getIdToken: async () => token } });
const expectThrow = async (p, wanted, label) => {
  try { await p; ok(false, label + ': לא נזרקה שגיאה'); }
  catch (e) { ok(e.message === wanted, label + ': "' + e.message + '" ≠ "' + wanted + '"'); }
};

// 1) לא-https ⇒ זריקה לפני כל קריאה
{
  const { doFetch, calls } = fake({ status: 200, body: { ok: true } });
  let tokenAsked = 0;
  const auth = { currentUser: { getIdToken: async () => { tokenAsked++; return 't'; } } };
  await expectThrow(pullNedarim('http://x.example/pull', {}, auth, { cloudRoot: false, slug: 'demo' }, doFetch), 'כתובת-משיכה לא-תקינה (חייבת https)', 'לא-https');
  ok(calls.length === 0 && tokenAsked === 0, 'לא-https: נעשו קריאות-חוץ');
}
// 2) בלי משתמש מחובר ⇒ זריקה בלי fetch
{
  const { doFetch, calls } = fake({ status: 200, body: { ok: true } });
  await expectThrow(pullNedarim('https://f.example/pull', {}, { currentUser: null }, { cloudRoot: false, slug: 'demo' }, doFetch), 'נדרשת התחברות-ענן', 'לא-מחובר');
  ok(calls.length === 0, 'לא-מחובר: fetch נקרא');
}
// 3) צורת-הבקשה: גזימה · org=slug · full=1 · בלי reset · Bearer
{
  const { doFetch, calls } = fake({ status: 200, body: { ok: true } });
  await pullNedarim('  https://f.example/nedarimPull  ', {}, authWith('tok-1'), { cloudRoot: false, slug: 'demo' }, doFetch);
  ok(calls.length === 1, 'מספר-קריאות ≠ 1');
  const u = new URL(calls[0].url);
  ok(u.origin + u.pathname === 'https://f.example/nedarimPull', 'הכתובת לא נגזמה/שגויה: ' + calls[0].url);
  ok(u.searchParams.get('org') === 'demo', 'org ≠ demo');
  ok(u.searchParams.get('full') === '1', 'full ≠ 1');
  ok(u.searchParams.get('reset') === null, 'reset נוסף בלי בקשה');
  ok(calls[0].init.method === 'POST', 'method ≠ POST');
  ok(calls[0].init.headers.Authorization === 'Bearer tok-1', 'Authorization ≠ Bearer tok-1');
}
// 4) שורש ⇒ org=root
{
  const { doFetch, calls } = fake({ status: 200, body: { ok: true } });
  await pullNedarim('https://f.example/pull', {}, authWith('t'), { cloudRoot: true, slug: 'demo' }, doFetch);
  ok(new URL(calls[0].url).searchParams.get('org') === 'root', 'שורש: org ≠ root');
}
// 5) opts.reset ⇒ reset=1
{
  const { doFetch, calls } = fake({ status: 200, body: { ok: true } });
  await pullNedarim('https://f.example/pull', { reset: true }, authWith('t'), { cloudRoot: false, slug: 'demo' }, doFetch);
  ok(new URL(calls[0].url).searchParams.get('reset') === '1', 'reset ≠ 1');
}
// 6) תשובה תקינה מוחזרת כלשונה
{
  const { doFetch } = fake({ status: 200, body: { ok: true, donors: 5, added: 3, pages: 2 } });
  const j = await pullNedarim('https://f.example/pull', {}, authWith('t'), { cloudRoot: false, slug: 'demo' }, doFetch);
  ok(j.donors === 5 && j.added === 3 && j.pages === 2, 'התשובה לא הוחזרה כלשונה');
}
// 7) כשלים: 403 בלי JSON ⇒ סטטוס; ok:false עם error ⇒ הודעת-השרת
await expectThrow(
  pullNedarim('https://f.example/pull', {}, authWith('t'), { cloudRoot: false, slug: 'demo' }, fake({ status: 403, jsonReject: true }).doFetch),
  'משיכה נכשלה (403)', '403-בלי-JSON');
await expectThrow(
  pullNedarim('https://f.example/pull', {}, authWith('t'), { cloudRoot: false, slug: 'demo' }, fake({ status: 200, body: { ok: false, error: 'אין הרשאה' } }).doFetch),
  'אין הרשאה', 'ok:false');
if (f) process.exit(1);
console.log('✓ pull-nedarim: 7 דוגמאות-חוזה — ירוק (זיוף-רשת, אפס קריאות אמיתיות)');
