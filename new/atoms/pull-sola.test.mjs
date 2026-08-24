import { pullSola } from './pull-sola.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
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

// 1) שערי-הכניסה: לא-https · לא-מחובר — בלי קריאות-חוץ
{
  const { doFetch, calls } = fake({ status: 200, body: { ok: true } });
  await expectThrow(pullSola('http://x.example/pull', {}, authWith('t'), { cloudRoot: false, slug: 'demo' }, doFetch), 'כתובת-משיכה לא-תקינה (חייבת https)', 'לא-https');
  await expectThrow(pullSola('https://f.example/pull', {}, { currentUser: null }, { cloudRoot: false, slug: 'demo' }, doFetch), 'נדרשת התחברות-ענן', 'לא-מחובר');
  ok(calls.length === 0, 'שערי-הכניסה: fetch נקרא');
}
// 2) צורת-הבקשה: org=slug · בלי full · בלי vault · Bearer
{
  const { doFetch, calls } = fake({ status: 200, body: { ok: true } });
  await pullSola('https://f.example/solaPull', {}, authWith('tok-9'), { cloudRoot: false, slug: 'demo' }, doFetch);
  const u = new URL(calls[0].url);
  ok(u.searchParams.get('org') === 'demo', 'org ≠ demo');
  ok(u.searchParams.get('full') === null, 'full נוסף — ייחוד-סולה הופר');
  ok(u.searchParams.get('vault') === null, 'vault נוסף ללקוח לא-שורש');
  ok(calls[0].init.method === 'POST' && calls[0].init.headers.Authorization === 'Bearer tok-9', 'POST/Bearer שגוי');
}
// 3) גשר-הכספת: שורש עם slug אמיתי ⇒ org=root + vault=slug
{
  const { doFetch, calls } = fake({ status: 200, body: { ok: true } });
  await pullSola('https://f.example/solaPull', {}, authWith('t'), { cloudRoot: true, slug: 'maor' }, doFetch);
  const u = new URL(calls[0].url);
  ok(u.searchParams.get('org') === 'root' && u.searchParams.get('vault') === 'maor', 'גשר-הכספת שגוי: org=' + u.searchParams.get('org') + ' vault=' + u.searchParams.get('vault'));
}
// 4) שורש עם slug='default' (וגם ריק) ⇒ בלי vault
{
  const a = fake({ status: 200, body: { ok: true } });
  await pullSola('https://f.example/p', {}, authWith('t'), { cloudRoot: true, slug: 'default' }, a.doFetch);
  ok(new URL(a.calls[0].url).searchParams.get('vault') === null, "slug='default': vault נוסף");
  const b = fake({ status: 200, body: { ok: true } });
  await pullSola('https://f.example/p', {}, authWith('t'), { cloudRoot: true, slug: '' }, b.doFetch);
  ok(new URL(b.calls[0].url).searchParams.get('vault') === null, 'slug ריק: vault נוסף');
}
// 5) opts.reset ⇒ reset=1
{
  const { doFetch, calls } = fake({ status: 200, body: { ok: true } });
  await pullSola('https://f.example/p', { reset: true }, authWith('t'), { cloudRoot: false, slug: 'demo' }, doFetch);
  ok(new URL(calls[0].url).searchParams.get('reset') === '1', 'reset ≠ 1');
}
// 6) תשובה תקינה מוחזרת כלשונה
{
  const { doFetch } = fake({ status: 200, body: { ok: true, added: 4, scanned: 120, window: '30d' } });
  const j = await pullSola('https://f.example/p', {}, authWith('t'), { cloudRoot: false, slug: 'demo' }, doFetch);
  ok(j.added === 4 && j.scanned === 120 && j.window === '30d', 'התשובה לא הוחזרה כלשונה');
}
// 7) כשלים: 500 בלי JSON ⇒ סטטוס; ok:false עם error ⇒ הודעת-השרת
await expectThrow(
  pullSola('https://f.example/p', {}, authWith('t'), { cloudRoot: false, slug: 'demo' }, fake({ status: 500, jsonReject: true }).doFetch),
  'משיכה נכשלה (500)', '500-בלי-JSON');
await expectThrow(
  pullSola('https://f.example/p', {}, authWith('t'), { cloudRoot: false, slug: 'demo' }, fake({ status: 200, body: { ok: false, error: 'xKey חסר' } }).doFetch),
  'xKey חסר', 'ok:false');
if (f) process.exit(1);
console.log('✓ pull-sola: 7 דוגמאות-חוזה — ירוק (זיוף-רשת, אפס קריאות אמיתיות)');
