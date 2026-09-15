/* build.mjs — פס-הנוכחות של בית המדרש, מועתק במדידה מפס-הערוצים-החיים של Twitch.
   כל ערך כאן נמדד מ-twitch.tv/directory/all חי היום, בשתי הערכות.
   הרצה: node gen/looks/nochah/build.mjs                                        */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, '..', 'app');
const raw = JSON.parse(readFileSync(join(here, '..', '..', 'mosad.data.json'), 'utf8'));
const SPEC = { roles: raw.roles.map(r => typeof r === 'string' ? r : r.name),
  depts: raw.departments.map(d => ({ n: d.n || d.name, e: (d.entities || []).map(e => ({ n: e.name, st: e.stages || [], fb: e.forbidden || [], mo: e.moment || '', f: (e.fields || []).map(f => [f.name, f.shape || '', f.required ? 1 : 0]) })) })) };
const src = readFileSync(join(app, 'src', '01-store.js'), 'utf8');

/* השעה נגזרת, לא נכתבת: 09:40 — סדר א׳ בעיצומו, הנהגים כבר סיימו איסוף,
   המשגיחים בין שחרית לסעודה. מצב מעורב אמיתי, לא מבוים.                     */
const NOW = 9 * 60 + 40;

const D = new Function('SPEC', 'NOW', src + `
  const t2m = t => +t.slice(0,2)*60 + +t.slice(3);
  const hhmm = m => String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
  build();
  const rows = DB.staff.map(s => {
    const nm = nameOf(s.personId);
    const c  = DB.classes.find(x => x.rebbe === s.id);
    const on = s.shifts.find(x => NOW >= t2m(x[0]) && NOW < t2m(x[1]));
    const next = s.shifts.map(x=>t2m(x[0])).filter(m => m > NOW).sort((a,b)=>a-b)[0];
    /* הגודל = כמה נפשות תחת אחריותו ברגע זה. נספר מהנתונים, לא נקבע ביד. */
    let size = null;
    if (on && c) size = DB.students.filter(st => st.classId === c.id && st.att[DB.todayIdx||0]).length;
    else if (on && s.role === 'נהג') { const r = DB.routes.find(r => r.driver === s.id);
      if (r) size = r.stops.reduce((a,x)=>a+x.riders.length,0); }

    return { id:s.id, nm, role:s.role, absent:s.absent,
      sub: s.sub ? nameOf(staff(s.sub).personId) : null,
      subFor: s.subFor ? nameOf(staff(s.subFor).personId) : null,
      where: c ? c.name : null, room: c ? c.room : null,
      doing: on ? on[2] : null, till: on ? on[1] : null,
      next: next != null ? hhmm(next) : null, size };
  });
  const shiurim = DB.classes.map(c => { const t = staff(c.rebbe);
    return { name:c.name, room:c.room, rebbe:nameOf(t.personId), role:t.role, absent:t.absent,
      sub: t.sub ? nameOf(staff(t.sub).personId) : null,
      n: DB.students.filter(s=>s.classId===c.id).length,
      here: DB.students.filter(s=>s.classId===c.id && s.att[0]).length };
  });
  return { rows, shiurim, staffN: DB.staff.length, studN: DB.students.length };
`)(SPEC, NOW);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const ini = n => n.split(' ').map(w => w[0]).join('').slice(0, 2);
const hhmm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');

/* סדר הפס — בדיוק של Twitch: שלוש קבוצות, החיים לפי גודל יורד.
   הגודל נשאר רק היכן שהוא אישי באמת: מגיד עם כיתה, נהג עם מסלול.
   אחריות משותפת (מטבח, אחזקה, משרד) אינה מספר — היא נוכחות בלבד. */
const live = D.rows.filter(r => r.doing && r.size != null).sort((a, b) => b.size - a.size);
const duty = D.rows.filter(r => r.doing && r.size == null);
const off  = D.rows.filter(r => !r.doing);

/* השורה. הנקודה והמספר נעולים לעמודה — זה כל הרעיון של הפס. */
const railRow = (r) => {
  const on = !!r.doing;
  const sub = on ? (r.where || r.doing) : (r.absent ? 'ב' + r.absent : r.next ? 'הבא ב־' + r.next : 'סיים להיום');
  /* הטקסט הנסתר 1×1 — העין מקבלת נקודה, קורא-המסך מקבל משפט. כמו במקור. */
  const say = on
    ? `פעיל · ${esc(r.doing)}${r.size != null ? ` · ${r.size} נפשות` : ''} · עד ${r.till}`
    : (r.absent ? `לא פעיל · ב${r.absent}${r.sub ? ` · מחליף: ${esc(r.sub)}` : ''}` : 'לא פעיל');
  return `<a class="rw${on ? '' : ' off'}" href="#">
  <span class="av" aria-hidden="true">${esc(ini(r.nm))}</span>
  <span class="tx"><b>${esc(r.nm)}</b><em>${esc(sub)}</em></span>
  <span class="st">${on ? '<i class="dot" aria-hidden="true"></i>' : ''}<span class="hid">${say}</span>${on && r.size != null ? `<bdi class="num">${r.size}</bdi>` : `<span class="num mut" aria-hidden="true">${r.absent ? '—' : '·'}</span>`}</span>
</a>`;
};

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>בית המדרש עכשיו</title>
<meta name="description" content="פס-נוכחות חי לצוות המוסד, מועתק במדידה מפס-הערוצים-החיים של Twitch.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ===== נמדד מ-twitch.tv/directory/all · ערכה בהירה ===== */
 --bg:#f7f7f8;--pane:#ffffff;--ink:#0e0e10;--mut:#3b3b44;
 --live:#eb0400;            /* הנקודה ותג ה-LIVE — אותו אדום בדיוק */
 --brand:#9147ff;           /* לא זז בין הערכות. נמדד בשתיהן. */
 --hair:#e5e5e8;--hov:#efeff1;
 --railW:240px;--rowH:45px;--av:30px;--dot:8px;
 --fs:14px;--lh:19.6px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 /* ===== נמדד מאותו עמוד עם colorScheme:dark ===== */
 --bg:#0e0e10;--pane:#18181b;--ink:#efeff1;--mut:#d3d3d9;
 --hair:#2f2f35;--hov:#26262c}}
:root[data-theme=dark]{
 --bg:#0e0e10;--pane:#18181b;--ink:#efeff1;--mut:#d3d3d9;
 --hair:#2f2f35;--hov:#26262c}
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 var(--fs)/var(--lh) Heebo,Inter,Arial,sans-serif}
h1,h2{margin:0}p{margin:0}a{color:inherit;text-decoration:none}
button{font:inherit;cursor:pointer;color:inherit}
bdi{unicode-bidi:isolate}
:focus-visible{outline:2px solid var(--brand);outline-offset:-2px}
/* 1×1 — בדיוק המידה שנמדדה במקור */
.hid{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* ---------- הסרגל העליון: גובה 50, כפתור-גלולה 81×32 ---------- */
.top{height:50px;background:var(--pane);border-bottom:1px solid var(--hair);
 display:flex;align-items:center;gap:14px;padding:0 12px;position:sticky;top:env(safe-area-inset-top,0px);z-index:9}
.logo{width:26px;height:26px;border-radius:6px;background:var(--brand);flex:none}
.top h1{font:700 15px/1 Heebo}
.clock{margin-inline-start:auto;font:600 var(--fs)/var(--lh) Heebo;color:var(--mut)}
.cta{background:var(--brand);color:#fff;border:0;border-radius:9000px;
 height:32px;padding:0 16px;font:600 var(--fs)/1 Heebo}

.shell{display:flex;align-items:flex-start;min-height:calc(100dvh - 50px)}

/* ---------- הפס. רוחב 240, שורות 45 צמודות, בלי מסגרת ובלי רדיוס ---------- */
.rail{width:var(--railW);flex:none;background:var(--pane);border-inline-start:1px solid var(--hair);
 position:sticky;top:calc(50px + env(safe-area-inset-top,0px));align-self:flex-start;
 max-height:calc(100dvh - 50px);overflow:auto;padding-bottom:12px}
.rail.mini{--railW:60px}
.rhead{display:flex;align-items:center;height:44px;padding:0 12px;gap:6px}
.rhead b{font:600 var(--fs)/var(--lh) Heebo;flex:1;white-space:nowrap}
.fold{background:0;border:0;padding:4px;border-radius:4px;line-height:0}
.fold:hover{background:var(--hov)}
.fold svg{width:18px;height:18px;fill:var(--ink)}
.rail.mini .rhead b,.rail.mini .tx,.rail.mini .num{display:none}
.rail.mini .fold svg{transform:scaleX(-1)}
.rail.mini .rw{justify-content:center;padding:5px 0}
.rail.mini .st{position:absolute;inset-inline-start:8px;top:6px}

.rw{display:flex;align-items:center;height:var(--rowH);padding:5px 8px;position:relative}
.rw:hover{background:var(--hov)}
.av{width:var(--av);height:var(--av);border-radius:9000px;flex:none;
 background:var(--brand);color:#fff;display:grid;place-items:center;
 font:600 12px/1 Heebo;letter-spacing:.2px}
.rw.off .av{background:var(--hair);color:var(--mut)}
.tx{flex:1;min-width:0;padding-inline-start:8px}
.tx b{display:block;font:600 var(--fs)/15.4px Heebo;
 overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tx em{display:block;font:400 var(--fs)/var(--lh) Heebo;color:var(--mut);font-style:normal;
 overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rw.off .tx b{color:var(--mut)}
/* המצב והגודל — שתי עמודות נפרדות. זה מה שמאפשר לסרוק. */
.st{display:flex;align-items:center;gap:5px;flex:none}
.dot{width:var(--dot);height:var(--dot);border-radius:9000px;background:var(--live);display:block}
.num{font:400 var(--fs)/var(--lh) Heebo;font-variant-numeric:tabular-nums;min-width:38px;text-align:start}
.num.mut{color:var(--mut)}
.gap{height:1px;background:var(--hair);margin:8px 12px}
.gap+.rw{margin-top:0}
.rlbl{padding:6px 12px 2px;font:600 12px/16.8px Heebo;color:var(--mut)}
.rail.mini .rlbl,.rail.mini .gap{display:none}

/* ---------- הלוח. שקט בכוונה — הפס הוא הרכיב, לא הוא. ---------- */
.main{flex:1;min-width:0;padding:22px 24px 60px}
.main h2{font:700 26px/1.25 Heebo}
.lede{color:var(--mut);margin-top:6px;max-width:62ch}
.bar{display:flex;gap:18px;flex-wrap:wrap;margin:18px 0 6px;
 padding-bottom:14px;border-bottom:1px solid var(--hair)}
.kpi b{display:block;font:700 22px/1.2 Heebo;font-variant-numeric:tabular-nums}
.kpi i{font:400 13px/18px Heebo;font-style:normal;color:var(--mut)}
.tag{display:inline-flex;align-items:center;gap:4px;background:var(--live);color:#fff;
 border-radius:4px;padding:1px 5px;font:600 12px/16.8px Heebo}
ul{margin:0;padding:0;list-style:none}
.li{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;
 gap:10px;padding:11px 2px;border-bottom:1px solid var(--hair)}
.li .a{min-width:0}
.li .a b{font:600 15px/20px Heebo}
.li .a em{font-style:normal;color:var(--mut);display:block;font-size:13px;line-height:18px}
.li .b{display:flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}
.li .b .of{color:var(--mut)}
.li .b i{width:var(--dot);height:var(--dot);border-radius:9000px;background:var(--live);display:block}
.li.dim .b i{background:var(--hair)}
.li.dim .a b{color:var(--mut)}
.note{margin-top:22px;color:var(--mut);font-size:13px;line-height:20px;max-width:70ch}
@media(max-width:860px){
 .shell{flex-direction:column}
 .rail{width:100%;position:static;max-height:none;border-inline-start:0;border-bottom:1px solid var(--hair)}
 .main{padding:18px 16px 50px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body>

<header class="top">
 <span class="logo" aria-hidden="true"></span>
 <h1>מוסדות — בית המדרש</h1>
 <span class="clock">היום · <bdi>${hhmm(NOW)}</bdi></span>
 <button class="cta" type="button">דוח נוכחות</button>
</header>

<div class="shell">
 <aside class="rail" id="rail" aria-label="מי פעיל עכשיו">
  <div class="rhead">
   <b>פעילים עכשיו</b>
   <button class="fold" id="fold" type="button" aria-expanded="true" aria-controls="rail" title="כיווץ הפס">
    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13 4v12h2V4h-2zM3 10l6 5V5l-6 5z"/></svg>
    <span class="hid">כיווץ פס הנוכחות</span>
   </button>
  </div>
  <p class="rlbl">מחזיקים נפשות · ${live.length}</p>
  ${live.map(railRow).join('\n')}
  <div class="gap" role="presentation"></div>
  <p class="rlbl">בסדר, באחריות משותפת · ${duty.length}</p>
  ${duty.map(railRow).join('\n')}
  <div class="gap" role="presentation"></div>
  <p class="rlbl">לא בסדר כעת · ${off.length}</p>
  ${off.map(railRow).join('\n')}
 </aside>

 <main class="main">
  <h2>בית המדרש עכשיו</h2>
  <p class="lede">שעה <bdi>${hhmm(NOW)}</bdi> — סדר א׳ בעיצומו. הפס שמימין מראה מי מחזיק כרגע אחריות על נפשות, וכמה. הוא נגזר מלוח המשמרות ומהנוכחות בפועל, לא נכתב ביד.</p>

  <div class="bar">
   <div class="kpi"><b><span class="tag">חי</span> ${live.length + duty.length}</b><i>אנשי צוות בסדר כרגע מתוך ${D.staffN}</i></div>
   <div class="kpi"><b>${D.shiurim.reduce((a, s) => a + s.here, 0)}</b><i>תלמידים נוכחים מתוך ${D.studN}</i></div>
   <div class="kpi"><b>${D.shiurim.filter(s => !s.absent).length}/${D.shiurim.length}</b><i>שיעורים עם מגיד במקום</i></div>
  </div>

  <ul>
  ${D.shiurim.map(s => `<li class="li${s.absent ? ' dim' : ''}">
   <span class="a"><b>${esc(s.name)}</b><em>${esc(s.room)} · ${esc(s.role)} ${esc(s.rebbe)}${s.absent ? ` — ב${esc(s.absent)}${s.sub ? `, במקומו ${esc(s.sub)}` : ', ללא מחליף'}` : ''}</em></span>
   <span class="b"><i aria-hidden="true"></i><bdi>${s.here}</bdi><span class="of">/ ${s.n}</span></span>
  </li>`).join('\n')}
  </ul>

  <p class="note">הפס מועתק במדידה מפס־הערוצים־החיים של Twitch: שורה בגובה 45 בלי רווח ביניהן, אווטאר 30 עגול, שם ב־600/14/15.4, עיסוק ב־14/19.6 באפור, ונקודה אדומה <bdi>#eb0400</bdi> בקוטר 8 נעולה לעמודה משלה לצד המספר. גם הטקסט הנסתר בגודל 1×1 לקורא־מסך הועתק — במקור העין מקבלת נקודה ומספר, וקורא־המסך מקבל משפט מלא.</p>
 </main>
</div>

<script>
(function(){
 var r=document.getElementById('rail'),f=document.getElementById('fold');
 f.addEventListener('click',function(){
  var mini=r.classList.toggle('mini');
  f.setAttribute('aria-expanded',String(!mini));
  f.title=mini?'פתיחת הפס':'כיווץ הפס';
 });
})();
</script>
</body></html>`;

writeFileSync(join(here, 'nochah.html'), html);
console.log('nochah.html · מחזיקי-נפשות ' + live.length + ' · משותף ' + duty.length + ' · כבויים ' + off.length + ' · שיעורים ' + D.shiurim.length);
