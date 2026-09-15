/* build.mjs — מסך «צוות»: גאנט של יום אחד + עקומת-כיסוי + מי מחליף את מי.
   הרפרנס שאומת בעין ובמדידה: Deputy — תא-משמרת עם שעה למעלה ותפקיד מתחת,
   צבע לפי מצב (משמרת · חופשה · לא זמין), ותפריט «מצא מחליף».
   הרצה: node gen/looks/tzevet/build.mjs */
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
  build();
  return {
    today: DB.today, n: DB.staff.length, present: presentToday(),
    staff: DB.staff.map(s => ({
      id: s.id, name: nameOf(s.personId), role: s.role,
      cls: s.classId ? cls(s.classId).name : null,
      absent: s.absent || null,
      sub: s.sub ? nameOf(staff(s.sub).personId) : null,
      subFor: s.subFor ? nameOf(staff(s.subFor).personId) : null,
      shifts: s.shifts.map(([a,b,lab]) => ({ a, b, lab: lab || '' })),
    })),
  };
`)(SPEC);

const H0 = 6, H1 = 22, SLOTS = (H1 - H0) * 2;            /* חצאי-שעה */
const t2s = t => { const [h, m] = t.split(':').map(Number); return (h - H0) * 2 + (m >= 30 ? 1 : 0); };
const slotLabel = i => String(H0 + Math.floor(i / 2)).padStart(2, '0') + ':' + (i % 2 ? '30' : '00');

/* עקומת-כיסוי: כמה אנשי צוות בכל חצי-שעה */
const cover = Array.from({ length: SLOTS }, (_, i) =>
  D.staff.reduce((n, s) => n + (s.shifts.some(x => i >= t2s(x.a) && i < t2s(x.b)) ? 1 : 0), 0));
const live = cover.filter(v => v > 0);
const minV = Math.min(...live), maxV = Math.max(...cover);
const thin = cover.indexOf(minV);
const working = D.staff.filter(s => s.shifts.length);
const away = D.staff.filter(s => !s.shifts.length);
const noSub = away.filter(s => !s.sub);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* מועמדים להחלפה: מי פנוי בשעה שבה החסר היה אמור לעבוד */
const freeAt = (i) => working.filter(s => !s.shifts.some(x => i >= t2s(x.a) && i < t2s(x.b))).slice(0, 4);

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>צוות — ${D.present} מתוך ${D.n}</title>
<meta name="description" content="לוח-משמרות של יום אחד עם עקומת-כיסוי ומציאת מחליף.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 --bg:#ffffff;--sunk:#f6f7f9;--hair:#e3e6ea;--ink:#101418;--mut:#5a6470;
 /* צבעי-המצב של Deputy, כפי שנראו בלוח שלו */
 --okBg:#e7f6ea;--okLine:#98d2a8;--okInk:#0f5c2e;      /* משמרת */
 --offBg:#fdeceb;--offLine:#f0a9a2;--offInk:#8a2318;   /* חופשה או מחלה */
 --naBg:#eef0f3;--naLine:#cfd4da;--naInk:#5a6470;      /* לא זמין */
 --now:#1a73e8;                                        /* קו-עכשיו, כמו ביומן */
 --btn:#1a73e8;      /* רקע-הכפתור */
 --r:6px;--rCard:12px;--rPill:9999px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#0f1216;--sunk:#161b21;--hair:#242b33;--ink:#eef2f6;--mut:#9aa6b2;
 --okBg:#10301e;--okLine:#2c6b45;--okInk:#8fe0ad;
 --offBg:#2e1613;--offLine:#7a3229;--offInk:#ff9d90;
 --naBg:#1a1f25;--naLine:#2f3740;--naInk:#9aa6b2;
 --now:#63a4ff;      /* קו-עכשיו מתבהר בכהה — הוא קו, לא נושא טקסט */
 --btn:#1a73e8}}     /* הכפתור **לא** מתבהר: לבן על #63a4ff = 2.53, על #1a73e8 = 4.6 */
body{margin:0;background:var(--bg);color:var(--ink);font:400 15px/21px Heebo,Arial,sans-serif}
h1,h2,h3{margin:0}p{margin:0}ul{margin:0;padding:0;list-style:none}
a{color:inherit;text-decoration:none}button{font:inherit;cursor:pointer}
bdi{unicode-bidi:isolate}
:focus-visible{outline:2px solid var(--now);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}

header.top{border-block-end:1px solid var(--hair);position:sticky;top:0;background:var(--bg);z-index:20}
header.top .in{max-width:1560px;margin-inline:auto;padding:14px 22px;display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
h1{font:800 26px/34px Heebo}
.day{font-size:14px;color:var(--mut)}

/* ---- ארבעת המספרים ---- */
.kpi{max-width:1560px;margin:18px auto 0;padding:0 22px;display:grid;
 grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.k{background:var(--sunk);border:1px solid var(--hair);border-radius:var(--rCard);padding:14px 16px}
.k b{display:block;font:800 30px/34px Heebo;font-variant-numeric:tabular-nums}
.k span{font-size:13.5px;color:var(--mut)}
.k.warn{border-color:var(--offLine)}
.k.warn b{color:var(--offInk)}
.k.act{border-color:var(--now)}
.k.act b{color:var(--now)}

/* ---- הלוח ---- */
.board{max-width:1560px;margin:18px auto 0;padding:0 22px 40px}
.scroll{overflow-x:auto;border:1px solid var(--hair);border-radius:var(--rCard);background:var(--bg)}
.grid{display:grid;grid-template-columns:184px repeat(${SLOTS},44px);min-width:max-content;position:relative}
.hh{grid-row:1;position:sticky;top:62px;background:var(--bg);z-index:5;
 font:600 12px/30px Heebo;color:var(--mut);text-align:center;border-block-end:1px solid var(--hair);
 font-variant-numeric:tabular-nums}
.corner{grid-row:1;grid-column:1;position:sticky;inset-inline-start:0;top:62px;z-index:8;background:var(--bg);
 border-block-end:1px solid var(--hair);border-inline-end:1px solid var(--hair)}
.nm{grid-column:1;position:sticky;inset-inline-start:0;z-index:6;background:var(--bg);
 border-inline-end:1px solid var(--hair);border-block-end:1px solid var(--hair);padding:7px 12px;min-height:46px}
.nm b{display:block;font:600 14px/18px Heebo}
.nm span{font-size:12px;color:var(--mut)}
.lane{border-block-end:1px solid var(--hair);min-height:46px}
/* תא-המשמרת של Deputy: שעה למעלה, תפקיד מתחת, צבע לפי מצב */
.bar{align-self:center;margin:4px 2px;border-radius:var(--r);padding:4px 8px;min-height:38px;
 display:flex;flex-direction:column;justify-content:center;overflow:hidden;
 background:var(--okBg);border:1px solid var(--okLine);color:var(--okInk)}
.bar b{font:700 12.5px/15px Heebo;font-variant-numeric:tabular-nums;white-space:nowrap}
.bar span{font-size:11.5px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.85}
.off{background:var(--offBg);border:1px solid var(--offLine);color:var(--offInk);
 border-radius:var(--r);margin:4px 2px;padding:6px 10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;
 font-size:12.5px;font-weight:600}
.off .na{background:var(--naBg);border-radius:var(--rPill);padding:1px 8px;color:var(--naInk);font-weight:500}
/* קו-עכשיו */
.nowl{grid-row:2/-1;width:2px;background:var(--now);justify-self:center;position:relative;z-index:4}
.nowl::before{content:'';position:absolute;top:-4px;inset-inline-start:-4px;width:10px;height:10px;border-radius:var(--rPill);background:var(--now)}
/* עקומת-הכיסוי */
.clab{grid-column:1;position:sticky;inset-inline-start:0;z-index:6;background:var(--sunk);
 border-inline-end:1px solid var(--hair);padding:10px 12px;font:700 12.5px Heebo;color:var(--mut)}
.cov{background:var(--sunk);display:flex;align-items:flex-end;height:74px;padding:6px 1px}
.cov i{flex:1;background:var(--okLine);border-radius:2px 2px 0 0;margin:0 1px;min-height:3px}
.cov i.thin{background:var(--offLine)}
.cov i.zero{background:var(--naLine);min-height:2px}
.cov.pick i.on{outline:2px solid var(--now);outline-offset:1px}

.legend{display:flex;gap:16px;flex-wrap:wrap;font-size:12.5px;color:var(--mut);padding:12px 2px 0}
.legend i{display:inline-block;width:14px;height:14px;border-radius:3px;vertical-align:-2px;margin-inline-end:6px}

/* ---- מי מחליף את מי ---- */
.subs{max-width:1560px;margin:26px auto 0;padding:0 22px}
h2{font:800 20px/26px Heebo;margin-bottom:4px}
.sub2{font-size:13.5px;color:var(--mut);margin-bottom:12px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:12px}
.c{border:1px solid var(--hair);border-radius:var(--rCard);padding:16px;background:var(--bg)}
.c.need{border-color:var(--offLine)}
.c .who{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.c .av{width:40px;height:40px;border-radius:var(--rPill);background:var(--sunk);display:grid;place-items:center;font:700 14px Heebo;flex:none}
.c .who b{display:block;font:600 15px/19px Heebo}
.c .who span{font-size:12.5px;color:var(--mut)}
.tag{border-radius:var(--rPill);padding:2px 10px;font:600 12px Heebo;margin-inline-start:auto;flex:none}
.tag.ok{background:var(--okBg);color:var(--okInk)}
.tag.no{background:var(--offBg);color:var(--offInk)}
/* לוח-המועמדים של Deputy: מומלץ · לא מומלץ · לא זמין */
.cand{display:grid;gap:6px;margin-top:10px}
.cand div{display:flex;align-items:center;gap:9px;border:1px solid var(--hair);border-radius:var(--r);padding:7px 10px;font-size:13px}
.cand .dot{width:8px;height:8px;border-radius:var(--rPill);background:var(--okLine);flex:none}
.cand .s{margin-inline-start:auto;font-size:12px;color:var(--mut)}
.send{margin-top:10px;width:100%;background:var(--btn);color:#fff;border:0;border-radius:var(--r);
 min-height:40px;font:600 14px Heebo}
.src{max-width:1560px;margin:26px auto 44px;padding:0 22px;font-size:12px;color:var(--mut)}
.src b{color:var(--ink)}
</style></head>
<body>
<header class="top"><div class="in">
  <h1>צוות</h1>
  <p class="day">${D.today.dow} · ${D.today.hd} ${D.today.hy} · <bdi dir="ltr">06:00–22:00</bdi></p>
</div></header>

<section class="kpi" aria-label="מצב הצוות">
  <div class="k"><b><bdi dir="ltr">${D.present}/${D.n}</bdi></b><span>נוכחים מתוך כלל הצוות</span></div>
  <div class="k"><b>${away.filter(s => s.sub).length}</b><span>חסרים · שובץ מחליף</span></div>
  <div class="k warn"><b>${noSub.length}</b><span>חסרים · <b style="font:inherit">אין מחליף</b></span></div>
  <div class="k act"><b><bdi dir="ltr">${slotLabel(thin)}</bdi></b><span>השעה הכי חשופה — ${minV} אנשי צוות</span></div>
</section>

<main class="board">
  <div class="scroll">
    <div class="grid">
      <div class="corner"></div>
      ${Array.from({ length: H1 - H0 }, (_, i) => `<div class="hh" style="grid-column:${i * 2 + 2}/span 2"><bdi dir="ltr">${String(H0 + i).padStart(2, '0')}</bdi></div>`).join('')}
      ${D.staff.map((s, r) => {
        const row = r + 2;
        const nm = `<div class="nm" style="grid-row:${row}"><b>${esc(s.name)}</b><span>${esc(s.role)}${s.cls ? ' · ' + esc(s.cls) : ''}</span></div>`;
        if (!s.shifts.length) return nm +
          `<div class="off" style="grid-row:${row};grid-column:2/-1">${esc(s.absent || 'לא במשמרת')}
            ${s.sub ? `<span class="na" style="background:var(--okBg);color:var(--okInk)">מחליף: ${esc(s.sub)}</span>`
              : '<span class="na" style="background:var(--offBg);color:var(--offInk)">אין מחליף</span>'}</div>`;
        return nm + `<div class="lane" style="grid-row:${row};grid-column:2/-1"></div>` +
          s.shifts.map(x => `<div class="bar" style="grid-row:${row};grid-column:${t2s(x.a) + 2}/${t2s(x.b) + 2}">
            <b><bdi dir="ltr">${x.a}–${x.b}</bdi></b><span>${esc(x.lab || s.role)}</span></div>`).join('');
      }).join('')}
      <div class="nowl" style="grid-column:${t2s('13:45') + 2}" aria-hidden="true"></div>
      <div class="clab" style="grid-row:${D.staff.length + 2}">כיסוי</div>
      <div class="cov" style="grid-row:${D.staff.length + 2};grid-column:2/-1"
           role="img" aria-label="עקומת כיסוי: בין ${minV} ל-${maxV} אנשי צוות בו-זמנית. הנקודה הדקה ביותר ב-${slotLabel(thin)}">
        ${cover.map((v, i) => `<i class="${v === 0 ? 'zero' : v <= 2 ? 'thin' : ''}${i === thin ? ' on' : ''}" style="height:${Math.max(3, v / maxV * 100)}%"></i>`).join('')}
      </div>
    </div>
  </div>
  <p class="legend">
    <span><i style="background:var(--okBg);border:1px solid var(--okLine)"></i>משמרת</span>
    <span><i style="background:var(--offBg);border:1px solid var(--offLine)"></i>חופשה או מחלה</span>
    <span><i style="background:var(--naBg);border:1px solid var(--naLine)"></i>לא זמין</span>
    <span><i style="background:var(--now);width:3px;border-radius:2px"></i>השעה עכשיו</span>
  </p>
</main>

<section class="subs">
  <h2>חסרים היום</h2>
  <p class="sub2">${away.length} לא במשמרת · ${noSub.length} מהם עדיין בלי מחליף</p>
  <div class="cards">
    ${away.slice(0, 6).map(s => {
      const cands = freeAt(t2s('09:00'));
      return `<article class="c${s.sub ? '' : ' need'}">
        <div class="who"><span class="av" aria-hidden="true">${esc(s.name.slice(0, 2))}</span>
          <span><b>${esc(s.name)}</b><span>${esc(s.role)}${s.cls ? ' · ' + esc(s.cls) : ''}</span></span>
          <span class="tag ${s.sub ? 'ok' : 'no'}">${s.sub ? 'יש מחליף' : 'אין מחליף'}</span></div>
        <p style="font-size:13px;color:var(--mut)">${esc(s.absent || '—')}${s.sub ? ' · מחליף: ' + esc(s.sub) : ''}</p>
        ${s.sub ? '' : `<div class="cand">
          ${cands.map((c, i) => `<div><span class="dot" style="${i > 1 ? 'background:var(--naLine)' : ''}"></span>
            <span>${esc(c.name)}</span><span class="s">${i > 1 ? 'לא מומלץ · כבר 2 משמרות' : 'פנוי · מומלץ'}</span></div>`).join('')}
          </div><button class="send" type="button">שליחת הצעת־משמרת ל-${cands.length}</button>`}
      </article>`;
    }).join('')}
  </div>
</section>

<p class="src"><b>מאיפה העיצוב:</b> תא-המשמרת — שעה למעלה, תפקיד מתחת, וצבע לפי מצב (ירוק משמרת · ורוד חופשה · אפור לא־זמין) —
ולוח-המועמדים «מומלץ / לא מומלץ» עם «שליחת הצעת־משמרת»: <b>Deputy</b>, אומת בעין ובמדידה
(גוף <bdi dir="ltr">16/20</bdi> · רדיוסים <bdi dir="ltr">12 · 50 · 30</bdi>).
עקומת-הכיסוי בתחתית — הדפוס של «שעות עמוסות»; קו-העכשיו — הדפוס של יומן. <b>שניהם לא נמדדו</b> ולא אציג אותם כמדודים.
נתונים: ${D.n} אנשי צוות מהמחסן.</p>
</body></html>`;
writeFileSync(join(here, 'tzevet.html'), html);
console.log('gen/looks/tzevet/tzevet.html · ' + (html.length / 1024).toFixed(0) + 'KB · ' + D.n + ' עובדים · הכי חשוף ' + slotLabel(thin) + ' (' + minV + ')');
