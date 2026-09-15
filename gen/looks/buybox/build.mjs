/* build.mjs — קופסת-ההחלטה לתיק-משפחה, מועתקת מקופסת-הקנייה של Amazon.
   כל ערך נמדד מעמוד-מוצר חי היום. הרצה: node gen/looks/buybox/build.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, '..', 'app');
const raw = JSON.parse(readFileSync(join(here, '..', '..', 'mosad.data.json'), 'utf8'));
const SPEC = { roles: raw.roles.map(r => typeof r === 'string' ? r : r.name),
  depts: raw.departments.map(d => ({ n: d.n || d.name, e: (d.entities || []).map(e => ({ n: e.name, st: e.stages || [], fb: e.forbidden || [], mo: e.moment || '', f: (e.fields || []).map(f => [f.name, f.shape || '', f.required ? 1 : 0]) })) })) };
const src = readFileSync(join(app, 'src', '01-store.js'), 'utf8');
const D = new Function('SPEC', src + `
  const sortBy=(a,f,d=1)=>[...a].sort((x,y)=>(f(x)>f(y)?1:f(x)<f(y)?-1:0)*d);
  build();
  const f = sortBy(DB.families.filter(x=>balance(x)>0), x=>-balance(x))[0];
  return { year: DB.tariff.year, tariff: DB.tariff, today: DB.today,
    fam: { name:f.name, city:f.city, head:nameOf(f.head), spouse:nameOf(f.spouse), phone:f.phone,
      kids:f.kids.length, disc:f.discount, hok:f.hok, paid:f.paid,
      due:discounted(f), bal:balance(f), init:f.name.replace('משפחת ','').slice(0,2),
      kidList:f.kids.map(k=>{const s=stu(k);return {name:nameOf(s.personId), cls:cls(s.classId).name,
        att:s.att.filter(Boolean).length};}) },
    pays: DB.payments.filter(p=>p.familyId===f.id).slice(0,4).map(p=>({m:p.method,a:p.amount,ago:p.ago})) };
`)(SPEC);

const F = D.fam;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const money = n => Math.round(n).toLocaleString('en-US');
/* פיצול-המחיר של Amazon: המספר גדול, האגורות קטנות ומורמות */
const split = n => { const w = Math.floor(n), c = Math.round((n - w) * 100); return [money(w), String(c).padStart(2,'0')]; };
const [balW, balC] = split(F.bal);
const PLANS = [1, 3, 6, 10];

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>תיק משפחה — קופסת ההחלטה</title>
<meta name="description" content="קופסת-ההחלטה של תיק-המשפחה, מועתקת במדידה מקופסת-הקנייה של Amazon.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ---- נמדד מעמוד-מוצר חי ב-amazon.com ---- */
 --bg:#ffffff;--ink:#0f1111;--mut:#565959;--hair:#d5d9d9;--sunk:#f7fafa;
 --link:#007185;--ok:#0b7b3c;--bad:#b12704;
 --dealBg:#b12704;         /* תג-ההנחה — נשאר כהה גם בכהה: לבן עליו 8.6 */
 --y:#ffd814;--o:#ffa41c;                /* Add to cart · Buy Now */
 --r:8px;--rPill:100px;--fs:14px;--lh:20px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#141a1f;--ink:#eceff1;--mut:#a3adb4;--hair:#2c353c;--sunk:#1a2228;
 --link:#5bbfd0;--ok:#4ec27e;--bad:#ff8a73;
 --dealBg:#b12704}}        /* לא מתבהר — הוא נושא טקסט לבן */
body{margin:0;background:var(--bg);color:var(--ink);font:400 var(--fs)/var(--lh) Heebo,Arial,sans-serif}
h1,h2,h3{margin:0}p{margin:0}ul{margin:0;padding:0;list-style:none}
a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
button{font:inherit;cursor:pointer}bdi{unicode-bidi:isolate}
:focus-visible{outline:2px solid var(--link);outline-offset:2px}

.crumb{max-width:1400px;margin:0 auto;padding:14px 22px 0;font-size:12.5px;color:var(--mut)}
.wrap{max-width:1400px;margin:0 auto;padding:14px 22px 60px;display:grid;
 grid-template-columns:320px minmax(0,1fr) 300px;gap:26px;align-items:start}
@media(max-width:1080px){.wrap{grid-template-columns:260px minmax(0,1fr)}.buy{grid-column:1/-1}}
@media(max-width:700px){.wrap{grid-template-columns:1fr}}

/* ---- עמודה ימנית: מי זו המשפחה ---- */
.who .big{aspect-ratio:1;border:1px solid var(--hair);border-radius:var(--r);background:var(--sunk);
 display:grid;place-items:center;font:700 74px Heebo;color:var(--mut)}
.who .thumbs{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.who .thumbs span{width:56px;height:56px;border:1px solid var(--hair);border-radius:var(--r);background:var(--sunk);
 display:grid;place-items:center;font:600 13px Heebo;color:var(--mut)}
.who .thumbs span.on{border-color:var(--link);box-shadow:0 0 0 1px var(--link)}

/* ---- עמודה אמצעית ---- */
h1{font:400 24px/32px Heebo}
.store{font-size:var(--fs);margin:4px 0 6px}
.rate{display:flex;align-items:center;gap:8px;font-size:var(--fs);padding-bottom:10px;border-block-end:1px solid var(--hair)}
.rate .st{color:#de7921;letter-spacing:1px}
.pill{display:inline-block;background:var(--ink);color:var(--bg);border-radius:4px;padding:2px 8px;font:700 12px Heebo;margin:10px 0 6px}
.bought{font-size:var(--fs);color:var(--mut);padding-bottom:12px;border-block-end:1px solid var(--hair)}
.deal{display:inline-block;background:var(--dealBg);color:#fff;border-radius:3px;padding:3px 9px;font:700 12.5px Heebo;margin:12px 0 8px}
/* המחיר בפיצול של Amazon — נמדד 28 / 13 */
.price{display:flex;align-items:flex-start;gap:3px;direction:ltr;justify-content:flex-end}
.price .sym{font:400 13px Heebo;padding-top:5px}
.price .w{font:400 28px/30px Heebo}
.price .c{font:400 13px Heebo;padding-top:5px}
.was{font-size:12.5px;color:var(--mut);margin-top:2px}
.was s{text-decoration:line-through}
.note{font-size:var(--fs);color:var(--link);margin:10px 0}
.lab{font-size:var(--fs);font-weight:700;margin:16px 0 8px}
.lab span{font-weight:400}
/* שורת-הווריאציות של Amazon: אריח עם מחיר מתחת */
.vars{display:flex;gap:8px;flex-wrap:wrap}
.vars button{border:1px solid var(--hair);border-radius:var(--r);background:none;color:inherit;
 padding:8px 10px;min-width:86px;text-align:center;line-height:1.35}
.vars button.on{border-color:var(--link);box-shadow:0 0 0 1px var(--link)}
.vars b{display:block;font:600 13px Heebo}
.vars i{display:block;font:400 12.5px Heebo;font-style:normal;color:var(--mut);font-variant-numeric:tabular-nums}
.qty{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.qty button{border:1px solid var(--hair);border-radius:var(--r);background:none;color:inherit;
 min-width:44px;padding:7px 0;font:400 14px Heebo}
.qty button.on{border-color:var(--link);box-shadow:0 0 0 1px var(--link)}
.facts{margin-top:22px;border-block-start:1px solid var(--hair);padding-top:14px}
.facts h2{font:700 16px Heebo;margin-bottom:8px}
.facts dl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 14px;font-size:var(--fs)}
.facts dt{color:var(--mut)}
.facts dd{margin:0;font-weight:600}

/* ================= קופסת-ההחלטה ================= */
.buy{position:sticky;top:16px;display:grid;gap:12px}
.box{border:1px solid var(--hair);border-radius:var(--r);padding:14px;background:var(--bg)}
.box .t{font:700 16px Heebo;margin-bottom:8px}
.box .price{justify-content:flex-end}
.deliv{font-size:var(--fs);margin-top:10px}
.deliv b{font-weight:700}
.deliv .cut{color:var(--ok);font-weight:700}
.where{display:flex;gap:6px;align-items:center;font-size:var(--fs);color:var(--link);margin-top:8px}
/* «In Stock» — נמדד #0b7b3c · 18px */
.stock{color:var(--ok);font:400 18px/24px Heebo;margin:12px 0 10px}
.stock.no{color:var(--bad)}
.sel{width:100%;border:1px solid var(--hair);border-radius:var(--r);background:var(--sunk);
 color:inherit;font:inherit;padding:7px 10px;margin-bottom:10px}
/* הכפתורים — נמדדו #ffd814 · #ffa41c · רדיוס 100 · גובה 32 */
.b1,.b2{display:block;width:100%;border:1px solid;border-radius:var(--rPill);min-height:32px;
 font:400 var(--fs) Heebo;color:#0f1111;margin-bottom:8px}
.b1{background:var(--y);border-color:var(--y)}
.b2{background:var(--o);border-color:var(--o)}
.b1:hover{background:#f7ca00}.b2:hover{background:#fa8900}
.meta{display:grid;grid-template-columns:auto minmax(0,1fr);gap:3px 12px;font-size:12.5px;margin-top:10px}
.meta dt{color:var(--mut)}.meta dd{margin:0}
.box.plain{font-size:13px;color:var(--mut)}
.box.plain b{color:var(--ink);font-size:var(--fs)}

.src{max-width:1400px;margin:0 auto 50px;padding:0 22px;font-size:12px;color:var(--mut)}
.src b{color:var(--ink)}
</style></head>
<body>
<p class="crumb">אנשים ‹ משפחות ‹ ${esc(F.city)} ‹ <b>${esc(F.name)}</b></p>

<div class="wrap">
  <aside class="who">
    <div class="big" aria-hidden="true">${esc(F.init)}</div>
    <div class="thumbs">
      <span class="on">תיק</span>
      ${F.kidList.map(k => `<span>${esc(k.name.slice(0, 2))}</span>`).join('')}
      <span>₪</span>
    </div>
  </aside>

  <main>
    <h1>${esc(F.name)}</h1>
    <p class="store"><a href="#">כל המשפחות מ${esc(F.city)}</a></p>
    <p class="rate"><span class="st" aria-hidden="true">★★★★☆</span>
      <span>${F.kids} ילדים במוסד</span>
      <a href="#">היסטוריית תשלומים (${D.pays.length})</a></p>

    <span class="pill">בפיגור</span>
    <p class="bought"><b>${D.pays.length} תשלומים</b> נרשמו בשנה האחרונה</p>

    ${F.disc ? `<span class="deal">הנחה ${F.disc}%</span>` : ''}
    <div class="price"><span class="sym">₪</span><span class="w">${balW}</span><span class="c">${balC}</span></div>
    <p class="was">חויב: <bdi dir="ltr">₪${money(F.due)}</bdi> · שולם: <bdi dir="ltr">₪${money(F.paid)}</bdi></p>
    <p class="note">תעריף לילד <bdi dir="ltr">₪${money(D.tariff.tuition)}</bdi> · הסעות <bdi dir="ltr">₪${money(D.tariff.bus)}</bdi> · ספרים <bdi dir="ltr">₪${money(D.tariff.books)}</bdi></p>

    <p class="lab">פריסת תשלומים: <span id="planTxt">${PLANS[0]} תשלומים</span></p>
    <div class="vars" id="vars">
      ${PLANS.map((n, i) => `<button type="button" class="${i === 0 ? 'on' : ''}" data-n="${n}">
        <b>${n === 1 ? 'תשלום אחד' : n + ' תשלומים'}</b>
        <i><bdi dir="ltr">₪${money(F.bal / n)}</bdi></i></button>`).join('')}
    </div>

    <p class="lab">מספר הילדים בחיוב: <span>${F.kids}</span></p>
    <div class="qty">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="${n === F.kids ? 'on' : ''}">${n}</button>`).join('')}</div>

    <div class="facts">
      <h2>פרטי התיק</h2>
      <dl>
        <dt>אב</dt><dd>${esc(F.head)}</dd>
        <dt>אם</dt><dd>${esc(F.spouse)}</dd>
        <dt>טלפון</dt><dd><bdi dir="ltr">${esc(F.phone)}</bdi></dd>
        <dt>עיר</dt><dd>${esc(F.city)}</dd>
        <dt>ילדים</dt><dd>${F.kidList.map(k => esc(k.name) + ' · ' + esc(k.cls)).join(' | ')}</dd>
      </dl>
    </div>
  </main>

  <aside class="buy">
    <section class="box">
      <p class="t">יתרה פתוחה</p>
      <div class="price"><span class="sym">₪</span><span class="w">${balW}</span><span class="c">${balC}</span></div>

      <p class="deliv"><b>החיוב הבא: א׳ בחשוון</b><br>
        אם משלמים עד <b>כ״ה בתשרי</b> — <span class="cut">ההנחה נשמרת</span></p>
      <p class="where"><span aria-hidden="true">📍</span>${esc(F.city)} · ${F.kids} ילדים במוסד</p>

      <p class="stock${F.hok ? '' : ' no'}">${F.hok ? 'הוראת קבע פעילה' : 'אין הוראת קבע'}</p>

      <label class="sr" for="amt">סכום</label>
      <select class="sel" id="amt">
        <option>סכום: <bdi dir="ltr">₪${money(F.bal)}</bdi> — הכל</option>
        <option>סכום: <bdi dir="ltr">₪${money(F.bal / 3)}</bdi> — שליש</option>
        <option>סכום: <bdi dir="ltr">₪1,000</bdi></option>
      </select>

      <button class="b1" type="button">רישום תשלום</button>
      <button class="b2" type="button">שליחת תזכורת</button>

      <dl class="meta">
        <dt>אחראי</dt><dd>מזכירות</dd>
        <dt>זיכוי</dt><dd><a href="#">עד 30 יום</a></dd>
        <dt>שנה</dt><dd>${esc(D.year)}</dd>
      </dl>
    </section>

    <section class="box plain">
      <b>${F.kids} ילדים במוסד</b>
      <p style="margin-top:6px">${F.kidList.map(k => esc(k.name) + ' — ' + esc(k.cls) + ' · נוכחות ' + k.att + '/5').join('<br>')}</p>
    </section>
  </aside>
</div>

<p class="src"><b>מה הועתק, ומאיפה:</b> קופסת-הקנייה של Amazon — מסגרת <bdi dir="ltr">1px #d5d9d9</bdi> ורדיוס <bdi dir="ltr">8</bdi> ·
המחיר בפיצול <bdi dir="ltr">28px</bdi> למספר ו-<bdi dir="ltr">13px</bdi> לאגורות ·
<bdi dir="ltr">«In Stock»</bdi> ב-<bdi dir="ltr">#0b7b3c · 18px</bdi> ⇒ כאן «הוראת קבע» ·
שני הכפתורים <bdi dir="ltr">#ffd814</bdi> ו-<bdi dir="ltr">#ffa41c</bdi>, רדיוס <bdi dir="ltr">100</bdi>, גובה <bdi dir="ltr">32</bdi> ·
שורת-הווריאציות עם מחיר מתחת לכל אריח ⇒ כאן פריסת-תשלומים · שורת-הכמות ⇒ מספר הילדים ·
הגוף <bdi dir="ltr">14/20</bdi> והדיו <bdi dir="ltr">#0f1111</bdi>. <b>הכל נמדד מעמוד-מוצר חי היום.</b>
נתונים: ${esc(F.name)} מהמחסן.</p>
<span class="sr" id="sr"></span>
<style>.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}</style>
<script>
const BAL = ${F.bal};
const money = n => '₪' + Math.round(n).toLocaleString('en-US');
document.getElementById('vars').addEventListener('click', e => {
  const b = e.target.closest('[data-n]'); if (!b) return;
  document.querySelectorAll('#vars button').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  const n = +b.dataset.n;
  document.getElementById('planTxt').textContent = n === 1 ? 'תשלום אחד' : n + ' תשלומים';
  document.getElementById('amt').options[1].textContent = 'סכום: ' + money(BAL / n) + ' — מנה אחת';
});
document.querySelector('.qty').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  document.querySelectorAll('.qty button').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
});
</script>
</body></html>`;
writeFileSync(join(here, 'buybox.html'), html);
console.log('gen/looks/buybox/buybox.html · ' + (html.length / 1024).toFixed(0) + 'KB · ' + F.name + ' · ₪' + money(F.bal));
