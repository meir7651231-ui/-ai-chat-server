import { runNetCheck } from './run-net-check.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const mkSpy = () => {
  const calls = [];
  const checkOne = async (t, ms) => { calls.push([t, ms]); return { ...t, ok: true }; };
  return { calls, checkOne };
};
const a = { url: 'https://a' }, b = { url: 'https://b' }, c = { url: 'https://c' };

// 1+2) שלושה יעדים · ברירת-מחדל 8000 · ירי סינכרוני · סדר נשמר
{
  const { calls, checkOne } = mkSpy();
  const p = runNetCheck([a, b, c], undefined, checkOne);
  chk('2 שלוש הקריאות נורו סינכרונית (לפני await)', calls.length === 3);
  const out = await p;
  chk('1א ‏timeoutMs=8000 לכל קריאה', calls.every(([, ms]) => ms === 8000));
  chk('1ב תוצאות בסדר a,b,c',
    out.length === 3 && out[0].url === 'https://a' && out[1].url === 'https://b' &&
    out[2].url === 'https://c' && out.every((r) => r.ok === true));
}

// 3) timeout מפורש מושחל
{
  const { calls, checkOne } = mkSpy();
  await runNetCheck([a, b], 500, checkOne);
  chk('3 ‏timeoutMs=500 מושחל', calls.length === 2 && calls.every(([, ms]) => ms === 500));
}

// 4) ריק ⇒ [] בלי שום קריאה
{
  const { calls, checkOne } = mkSpy();
  const out = await runNetCheck([], undefined, checkOne);
  chk('4 ריק ⇒ [] ואפס קריאות', Array.isArray(out) && out.length === 0 && calls.length === 0);
}

// 5) דחייה מבעבעת (Promise.all)
{
  const checkOne = async (t) => { if (t === b) throw new Error('down'); return { ...t, ok: true }; };
  let err = null;
  try { await runNetCheck([a, b, c], undefined, checkOne); } catch (e) { err = e; }
  chk('5 דחייה מבעבעת בשגיאת-המקור', err && err.message === 'down');
}

if (f) process.exit(1);
console.log('✓ run-net-check: 5 דוגמאות-חוזה — ירוק');
