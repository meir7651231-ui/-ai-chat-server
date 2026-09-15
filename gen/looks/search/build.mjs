/* build.mjs — העתקה של שורת-החיפוש המפוצלת של Airbnb, למוסד.
   כל מספר כאן נמדד מהאתר החי היום (רוחב · גובה · רדיוס · צל · משקל-גופן).
   הרצה: node gen/looks/search/build.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, '..', 'app');
const raw = JSON.parse(readFileSync(join(here, '..', '..', 'mosad.data.json'), 'utf8'));
const SPEC = { roles: raw.roles.map(r => typeof r === 'string' ? r : r.name),
  depts: raw.departments.map(d => ({ n: d.name, e: (d.entities || []).map(e => ({ n: e.name, st: e.stages || [], fb: e.forbidden || [], mo: e.moment || '', f: (e.fields || []).map(f => [f.name, f.shape || '', f.required ? 1 : 0]) })) })) };
const src = readFileSync(join(app, 'src', '01-store.js'), 'utf8');
const D = new Function('SPEC', src + `
  const sortBy=(a,f,d=1)=>[...a].sort((x,y)=>(f(x)>f(y)?1:f(x)<f(y)?-1:0)*d);
  build();
  return {
    year: DB.tariff.year, people: DB.people.length, families: DB.families.length,
    depts: SPEC.depts.map(d => ({ n: d.n, e: d.e.length })),
    fam: sortBy(DB.families, f=>-balance(f)).slice(0,40).map(f=>({
      name:f.name, city:f.city, kids:f.kids.length, bal:balance(f), hok:f.hok,
      init:f.name.replace('משפחת ','').slice(0,2) })),
    staff: DB.staff.slice(0,20).map(s=>({ name:nameOf(s.personId), role:s.role,
      init:nameOf(s.personId).slice(0,2) })),
  };
`)(SPEC);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const nis = n => '₪' + Math.round(n).toLocaleString('en-US');
const PERIODS = [['היום','מה קרה מאז הבוקר'],['השבוע','שבעת הימים האחרונים'],['החודש','מתחילת החודש'],
  ['תשפ״ז','כל שנת הלימודים'],['תשפ״ו','השנה שעברה'],['הכל','מאז הקמת המוסד']];

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>חיפוש בכל המוסד</title>
<meta name="description" content="שורת-חיפוש מפוצלת: מי · מתי · איזה אגף. העתקה מדודה של הרכיב של Airbnb.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ---- כל גוון וכל מידה כאן נמדדו מ-airbnb.com היום ---- */
 --bg:#ffffff;--ink:#222222;--mut:#6c6c6c;--dim:#c1c1c1;--hair:#dddddd;--grey:#ebebeb;--sunk:#f7f7f7;
 --acc:#e11d48;                       /* כפתור-החיפוש — אצלנו, כי הוורוד שלהם הוא המותג שלהם */
 --barH:66px;--barR:100px;--segR:32px;--btn:48px;
 --shBar:0 0 0 1px rgb(0 0 0/.02),0 3px 12px rgb(0 0 0/.1);
 --shSeg:0 3px 12px rgb(0 0 0/.1),0 1px 2px rgb(0 0 0/.08);
 --shPanel:0 3px 12px rgb(0 0 0/.1),0 1px 2px rgb(0 0 0/.08);
 --fs:14px;--lh:20px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#151517;--ink:#f0f0f0;--mut:#a0a0a5;--dim:#5c5c62;--hair:#2e2e33;--grey:#1e1e22;--sunk:#1a1a1e;
 --shBar:0 0 0 1px rgb(255 255 255/.06),0 3px 12px rgb(0 0 0/.5);
 --shSeg:0 3px 12px rgb(0 0 0/.55),0 1px 2px rgb(0 0 0/.4);
 --shPanel:0 3px 12px rgb(0 0 0/.55),0 1px 2px rgb(0 0 0/.4)}}
body{margin:0;background:var(--bg);color:var(--ink);font:400 var(--fs)/var(--lh) Heebo,Arial,sans-serif}
h1,h2,h3{margin:0}p{margin:0}ul{margin:0;padding:0;list-style:none}button{font:inherit;cursor:pointer}
bdi{unicode-bidi:isolate}
:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}

.top{border-block-end:1px solid var(--hair);padding:16px 24px 26px;position:relative;z-index:30;background:var(--bg)}
.brand{max-width:1240px;margin:0 auto 18px;display:flex;align-items:center;gap:12px}
.brand b{font:800 20px Heebo;color:var(--acc)}
.brand span{font-size:13px;color:var(--mut);margin-inline-start:auto}
h1{font:600 15px/20px Heebo;position:absolute;inset:auto;clip-path:inset(50%);width:1px;height:1px;overflow:hidden}

/* ================= הרכיב המועתק ================= */
.bar{max-width:850px;margin:0 auto;position:relative;height:var(--barH);
 background:var(--bg);border-radius:var(--barR);box-shadow:var(--shBar);
 display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;transition:background .2s}
/* כשמקטע פעיל — כל הסרגל מכהה, וזה בדיוק מה שהם עושים */
.bar.on{background:var(--grey)}
.seg{position:relative;height:var(--barH);border:0;background:none;border-radius:var(--segR);
 text-align:start;padding:0 26px;display:grid;align-content:center;gap:2px;color:inherit;
 transition:background .15s,box-shadow .15s}
.bar.on .seg:hover{background:rgb(0 0 0/.06)}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .bar.on .seg:hover{background:rgb(255 255 255/.06)}}
.seg.act{background:var(--bg);box-shadow:var(--shSeg)}
.seg b{font:500 var(--fs)/18px Heebo}              /* התווית — נמדד 500 14/18 */
.seg span{font:400 var(--fs)/18px Heebo;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.seg.act span{color:var(--ink)}
/* הקווים הדקים בין המקטעים — נעלמים ליד המקטע הפעיל */
.seg+.seg::before{content:'';position:absolute;inset-inline-end:0;top:14px;bottom:14px;width:1px;background:var(--hair)}
.seg.act::before,.seg.act+.seg::before{display:none}
.go{position:absolute;inset-inline-end:8px;top:9px;height:var(--btn);min-width:var(--btn);
 border:0;border-radius:50px;background:var(--acc);color:#fff;display:flex;align-items:center;gap:8px;
 padding:0 14px;font:600 var(--fs) Heebo;transition:padding .2s}
.go .t{display:none}
.bar.on .go{padding:0 20px}
.bar.on .go .t{display:inline}

/* הלוח הנפתח */
.panel{position:absolute;top:calc(var(--barH) + 12px);background:var(--bg);border-radius:var(--segR);
 box-shadow:var(--shPanel);padding:16px;width:min(420px,92vw);max-height:420px;overflow:auto;display:none;z-index:40}
.panel.open{display:block}
.panel h2{font:600 13px/18px Heebo;color:var(--mut);padding:2px 8px 10px}
.panel input{width:100%;border:1px solid var(--hair);border-radius:12px;background:var(--sunk);
 color:inherit;font:inherit;padding:11px 14px;margin-bottom:10px;outline:0}
.panel input:focus{border-color:var(--ink)}
.opt{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:12px;align-items:center;
 width:100%;border:0;background:none;color:inherit;border-radius:12px;padding:8px;text-align:start}
.opt:hover{background:var(--sunk)}
.opt .ic{width:48px;height:48px;border-radius:12px;background:var(--sunk);border:1px solid var(--hair);
 display:grid;place-items:center;font:600 15px Heebo}
.opt b{display:block;font:500 15px/19px Heebo}
.opt span{display:block;font-size:13px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.opt .m{font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap}
.none{padding:14px 8px;color:var(--mut);font-size:13.5px}

.veil{position:fixed;inset:0;z-index:25;display:none}
.veil.open{display:block}

/* תוצאות — שורות פשוטות, בלי שום דבר מ-Airbnb.
   מהאתר נלקחה **שורת-החיפוש בלבד**. */
.res{max-width:820px;margin:34px auto 60px;padding:0 24px}
.res h2{font:600 20px/26px Heebo;margin-bottom:2px}
.res p.s{font-size:13.5px;color:var(--mut);margin-bottom:14px}
.rows{display:grid;gap:0}
.row{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:14px;align-items:center;
 padding:12px 4px;border-block-end:1px solid var(--hair)}
.row .av{width:40px;height:40px;border-radius:50px;background:var(--sunk);border:1px solid var(--hair);
 display:grid;place-items:center;font:600 14px Heebo;color:var(--mut)}
.row b{display:block;font:500 15px/19px Heebo}
.row span{display:block;font-size:13px;color:var(--mut)}
.row .m{font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap}
.src{max-width:1240px;margin:0 auto 50px;padding:0 24px;font-size:12px;color:var(--mut)}
.src b{color:var(--ink)}
</style></head>
<body>
<h1>חיפוש בכל המוסד</h1>
<header class="top">
  <div class="brand"><b>מוסד</b><span><bdi dir="ltr">${D.people}</bdi> רשומות · ${D.depts.length} אגפים · ${D.year}</span></div>

  <div class="bar" id="bar">
    <button class="seg" type="button" data-seg="who" id="s-who">
      <b>מי?</b><span id="v-who">שם משפחה, ילד או עובד</span></button>
    <button class="seg" type="button" data-seg="when" id="s-when">
      <b>מתי?</b><span id="v-when">כל תקופה</span></button>
    <button class="seg" type="button" data-seg="dept" id="s-dept">
      <b>איזה אגף?</b><span id="v-dept">כל האגפים</span></button>
    <button class="go" type="button" id="go"><span aria-hidden="true">⌕</span><span class="t">חיפוש</span></button>

    <div class="panel" id="p-who" style="inset-inline-start:0">
      <h2>מי</h2>
      <input id="q" type="search" placeholder="הקלד שם…" autocomplete="off" aria-label="חיפוש שם">
      <div id="who-list"></div>
    </div>
    <div class="panel" id="p-when" style="inset-inline-start:50%;transform:translateX(50%)">
      <h2>מתי</h2>
      ${PERIODS.map(([t, s]) => `<button class="opt" type="button" data-pick="when" data-val="${esc(t)}">
        <span class="ic" aria-hidden="true">📅</span><span><b>${esc(t)}</b><span>${esc(s)}</span></span></button>`).join('')}
    </div>
    <div class="panel" id="p-dept" style="inset-inline-end:0">
      <h2>אגף</h2>
      <button class="opt" type="button" data-pick="dept" data-val="כל האגפים">
        <span class="ic" aria-hidden="true">★</span><span><b>כל האגפים</b><span>חיפוש רוחבי בכל המוסד</span></span></button>
      ${D.depts.map(d => `<button class="opt" type="button" data-pick="dept" data-val="${esc(d.n)}">
        <span class="ic" aria-hidden="true">${esc(d.n.slice(0, 1))}</span>
        <span><b>${esc(d.n)}</b><span><bdi dir="ltr">${d.e}</bdi> סוגי רשומות</span></span></button>`).join('')}
    </div>
  </div>
</header>
<div class="veil" id="veil"></div>

<section class="res">
  <h2 id="rh">‏${D.families} משפחות במוסד</h2>
  <p class="s" id="rs">ממוינות לפי יתרה פתוחה · ${D.year}</p>
  <div class="rows" id="rows"></div>
</section>

<p class="src"><b>מהאתר נלקחה שורת-החיפוש בלבד.</b> אלה הערכים שנמדדו ממנה ב-airbnb.com:
הגלולה <bdi dir="ltr">850×66 · רדיוס 100</bdi> · המקטע הפעיל <bdi dir="ltr">278×66 · רדיוס 32</bdi>
עם מסגרת <bdi dir="ltr">1px #dddddd</bdi> · הסרגל מכהה ל-<bdi dir="ltr">#ebebeb</bdi> כשמקטע פעיל ·
הצללים <bdi dir="ltr">0 3px 12px rgb(0 0 0/.1)</bdi> ו-<bdi dir="ltr">0 1px 2px rgb(0 0 0/.08)</bdi> ·
התווית <bdi dir="ltr">500 14/18</bdi> · כפתור <bdi dir="ltr">48×48</bdi> שמתרחב.
<br><b>מה שלא נלקח:</b> הכרטיסים, הדירוגים, תיבות-התמונה, צ׳יפי-הסינון והוורוד שלהם — כל אלה נשארו אצלם.
התוצאות כאן הן שורות פשוטות של המוסד. נתונים: ${D.families} משפחות מהמחסן.</p>

<script>
const FAM = ${JSON.stringify(D.fam)}, STAFF = ${JSON.stringify(D.staff)};
const nis = n => '₪' + Math.round(n).toLocaleString('en-US');
const $ = i => document.getElementById(i);
const bar = $('bar'), veil = $('veil');
let open = null;
const pick = { who: null, when: null, dept: null };

const close = () => { document.querySelectorAll('.panel').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.seg').forEach(s => s.classList.remove('act'));
  bar.classList.remove('on'); veil.classList.remove('open'); open = null; };

const show = (k) => {
  if (open === k) return close();
  close();
  $('s-' + k).classList.add('act'); $('p-' + k).classList.add('open');
  bar.classList.add('on'); veil.classList.add('open'); open = k;
  if (k === 'who') { paintWho(''); setTimeout(() => $('q').focus(), 40); }
};

const paintWho = (q) => {
  const t = q.trim();
  const f = FAM.filter(x => !t || x.name.includes(t) || x.city.includes(t)).slice(0, 8);
  const s = STAFF.filter(x => !t || x.name.includes(t) || x.role.includes(t)).slice(0, 4);
  const row = (ic, b, sub, m, val) =>
    '<button class="opt" type="button" data-pick="who" data-val="' + val + '"><span class="ic" aria-hidden="true">' + ic + '</span>' +
    '<span><b>' + b + '</b><span>' + sub + '</span></span>' + (m ? '<span class="m">' + m + '</span>' : '') + '</button>';
  const html = f.map(x => row(x.init, x.name, x.city + ' · ' + x.kids + ' ילדים', nis(x.bal), x.name)).join('') +
    s.map(x => row(x.init, x.name, x.role, '', x.name)).join('');
  $('who-list').innerHTML = html || '<p class="none">אין תוצאה.</p>';
};

const paintRes = () => {
  const t = (pick.who || '').trim();
  const list = FAM.filter(x => !t || x.name.includes(t) || x.city.includes(t));
  $('rh').textContent = list.length + (t ? ' תוצאות עבור «' + t + '»' : ' משפחות במוסד');
  $('rs').textContent = [pick.dept || 'כל האגפים', pick.when || 'כל תקופה'].join(' · ');
  $('rows').innerHTML = list.slice(0, 10).map(x =>
    '<div class="row"><span class="av" aria-hidden="true">' + x.init + '</span>' +
    '<span><b>' + x.name + '</b><span>' + x.city + ' · ' + x.kids + ' ילדים' +
      (x.hok ? ' · הוראת קבע' : '') + '</span></span>' +
    '<span class="m">' + nis(x.bal) + '</span></div>').join('');
};

document.addEventListener('click', e => {
  const seg = e.target.closest('[data-seg]');
  if (seg) { e.stopPropagation(); return show(seg.dataset.seg); }
  const opt = e.target.closest('[data-pick]');
  if (opt) { const k = opt.dataset.pick; pick[k] = opt.dataset.val;
    $('v-' + k).textContent = opt.dataset.val; close(); paintRes(); return; }
  if (e.target === veil) return close();
  if (!e.target.closest('.panel')) close();
});
$('q').addEventListener('input', e => paintWho(e.target.value));
$('q').addEventListener('click', e => e.stopPropagation());
$('go').addEventListener('click', e => { e.stopPropagation(); if (open) { close(); } paintRes(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
paintRes();
</script>
</body></html>`;
writeFileSync(join(here, 'search.html'), html);
console.log('gen/looks/search/search.html · ' + (html.length / 1024).toFixed(0) + 'KB');
