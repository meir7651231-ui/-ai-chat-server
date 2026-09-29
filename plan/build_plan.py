import json, html

p = json.load(open('plan100.json'))
ms = p['milestones']
opening = p['opening']
dropped = p.get('dropped') or []

# number the steps 1..100 and slim the payload
data = []
n = 0
for mi, m in enumerate(ms, 1):
    steps = []
    for s in m['steps']:
        n += 1
        steps.append({
            'n': n, 'id': s['id'], 't': s['title'], 'w': s['why'], 'b': s['what'],
            'm': s['monstrous'], 'x': s['measure'], 'd': s['depends'], 'r': s['risk'],
            'l': s.get('lens', ''),
        })
    data.append({'i': mi, 't': m['title'], 'g': m['goal'], 'x': m['exit'], 's': steps})

payload = json.dumps({'milestones': data, 'opening': opening, 'dropped': dropped},
                     ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')

CSS = """
:root{
  --paper:#F2F3F7;--surface:#FFFFFF;--sunk:#E9EBF2;--line:#DBDEE9;--line-2:#C2C7D8;
  --ink:#12131A;--muted:#545A70;--faint:#7E849B;
  --accent:#5B3FD9;--fire:#A8501C;--ok:#146B4A;--doing:#1B5AA0;
  color-scheme:light dark;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#090A10;--surface:#131620;--sunk:#0E1017;--line:#212537;--line-2:#2E3348;
  --ink:#ECEEF6;--muted:#969CB4;--faint:#767C94;
  --accent:#A78CFF;--fire:#E2975F;--ok:#5CC89B;--doing:#79ADFF;
}}
:root[data-theme="dark"]{
  --paper:#090A10;--surface:#131620;--sunk:#0E1017;--line:#212537;--line-2:#2E3348;
  --ink:#ECEEF6;--muted:#969CB4;--faint:#767C94;
  --accent:#A78CFF;--fire:#E2975F;--ok:#5CC89B;--doing:#79ADFF;
}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);direction:rtl;
  font-family:Heebo,"Segoe UI",Arial,sans-serif;font-weight:300;line-height:1.6;
  padding:0 16px;padding-block:22px 64px}
.wrap{max-width:860px;margin:0 auto}
.mono{font-family:"JetBrains Mono",ui-monospace,monospace}

header{display:flex;flex-direction:column;gap:10px;margin-bottom:18px}
.eyebrow{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.16em;color:var(--fire)}
h1{font-family:"Frank Ruhl Libre",Georgia,serif;font-weight:800;margin:0;
  font-size:clamp(32px,9vw,52px);line-height:1.02;letter-spacing:-.015em;text-wrap:balance}
.lede{margin:0;color:var(--muted);font-size:15.5px;max-width:64ch}
.stats{display:flex;flex-wrap:wrap;gap:7px;margin-top:2px}
.stat{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.04em;
  color:var(--muted);background:var(--sunk);border:1px solid var(--line);border-radius:999px;padding:5px 11px}

.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--paper);
  padding:10px 0 12px;border-bottom:1px solid var(--line);margin-bottom:18px}
.track{height:8px;border-radius:999px;background:var(--sunk);border:1px solid var(--line);overflow:hidden;display:flex}
.track i{display:block;height:100%}
.track i.done{background:var(--ok)}.track i.doing{background:var(--doing)}
.barrow{display:flex;gap:8px;align-items:center;margin-top:9px;flex-wrap:wrap}
.barrow .count{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11.5px;color:var(--muted);white-space:nowrap}
input[type=search]{flex:1;min-width:130px;font:300 14px Heebo,Arial,sans-serif;color:var(--ink);
  background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:8px 14px;outline:none}
input[type=search]:focus-visible{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 22%,transparent)}
.chips{display:flex;gap:6px}
.chip{font:400 12.5px Heebo,Arial,sans-serif;background:var(--surface);border:1px solid var(--line);
  color:var(--muted);border-radius:999px;padding:7px 12px;cursor:pointer}
.chip[aria-pressed="true"]{background:var(--ink);color:var(--paper);border-color:var(--ink)}

.ms{margin-top:30px}
.ms>h2{font-family:"Frank Ruhl Libre",Georgia,serif;font-weight:800;font-size:23px;margin:0;
  display:flex;gap:11px;align-items:baseline;text-wrap:balance}
.ms>h2 b{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:13px;font-weight:500;color:var(--fire);flex:none}
.goal{margin:7px 0 0;color:var(--muted);font-size:14.5px;max-width:64ch}
.exit{margin:8px 0 14px;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11.5px;
  color:var(--faint);border-inline-start:2px solid var(--line-2);padding-inline-start:10px;line-height:1.7}

.steps{display:flex;flex-direction:column;gap:8px}
.step{background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.step.done{opacity:.66}
.head{display:grid;grid-template-columns:40px 1fr auto;gap:10px;align-items:center;padding:11px 12px}
.num{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:12px;color:var(--faint);
  background:var(--sunk);border:1px solid var(--line);border-radius:8px;height:28px;
  display:flex;align-items:center;justify-content:center}
.name{font-size:15.5px;font-weight:500;text-align:start;background:none;border:0;color:var(--ink);
  font-family:inherit;cursor:pointer;padding:0;line-height:1.35}
.st{font:500 11.5px "JetBrains Mono",monospace;border-radius:999px;padding:6px 10px;cursor:pointer;
  border:1px solid var(--line-2);background:var(--sunk);color:var(--muted);white-space:nowrap}
.st.doing{border-color:var(--doing);color:var(--doing)}
.st.done{border-color:var(--ok);color:var(--ok)}
.step.done .num{border-color:var(--ok);color:var(--ok)}
.body{display:none;padding:0 12px 14px;border-top:1px solid var(--line)}
.step.open .body{display:block}
.f{margin:12px 0 0}
.f b{display:block;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:10.5px;
  letter-spacing:.1em;color:var(--fire);font-weight:500;margin-bottom:3px}
.f p{margin:0;font-size:14.5px;line-height:1.65}
.f.measure p{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:12.5px;line-height:1.8;color:var(--ink)}
.f code,.f p code{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:.92em;
  background:var(--sunk);border:1px solid var(--line);border-radius:5px;padding:1px 4px;
  direction:ltr;unicode-bidi:isolate;text-align:left;overflow-wrap:anywhere}
.exit,.f.measure p{unicode-bidi:plaintext}
.lens{margin-top:12px;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:10.5px;color:var(--faint)}

.note{margin-top:34px;border-top:1px solid var(--line);padding-top:16px;color:var(--muted);font-size:13.5px;max-width:66ch}
.note h3{font-family:"Frank Ruhl Libre",Georgia,serif;font-size:17px;margin:0 0 6px;color:var(--ink)}
.empty{color:var(--muted);font-size:14px;padding:14px 2px}
[hidden]{display:none!important}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@media(min-width:680px){.head{grid-template-columns:46px 1fr auto}}
"""

JS = r"""
const D=JSON.parse(document.getElementById('data').textContent);
const CY={open:'doing',doing:'done',done:'open'};
const LBL={open:'לא התחיל',doing:'בעבודה',done:'נגמר'};
let ST={},live=false,dbns=null,filter='all',q='';

const root=document.getElementById('plan');
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function code(s){return esc(s).replace(/`([^`]{1,120})`/g,'<code>$1</code>')}

function build(){
  root.innerHTML='';
  D.milestones.forEach(m=>{
    const sec=document.createElement('section');sec.className='ms';sec.dataset.ms=m.i;
    sec.innerHTML='<h2><b>'+String(m.i).padStart(2,'0')+'</b><span>'+esc(m.t)+'</span></h2>'+
      '<p class="goal">'+esc(m.g)+'</p><p class="exit">מדד יציאה · '+esc(m.x)+'</p>'+
      '<div class="steps"></div>';
    const box=sec.querySelector('.steps');
    m.s.forEach(s=>{
      const el=document.createElement('article');el.className='step';el.dataset.id=s.id;
      el.dataset.hay=(s.t+' '+s.w+' '+s.b+' '+s.m+' '+s.x+' '+s.l).toLowerCase();
      el.innerHTML='<div class="head"><span class="num">'+s.n+'</span>'+
        '<button class="name" aria-expanded="false">'+esc(s.t)+'</button>'+
        '<button class="st" data-st>'+LBL.open+'</button></div>'+
        '<div class="body">'+
        '<div class="f"><b>למה</b><p>'+code(s.w)+'</p></div>'+
        '<div class="f"><b>מה נבנה</b><p>'+code(s.b)+'</p></div>'+
        '<div class="f"><b>למה זה מפלצתי</b><p>'+code(s.m)+'</p></div>'+
        '<div class="f measure"><b>מדד יציאה</b><p>'+code(s.x)+'</p></div>'+
        '<div class="f"><b>תלוי ב</b><p>'+code(s.d)+'</p></div>'+
        '<div class="f"><b>סיכון</b><p>'+code(s.r)+'</p></div>'+
        '<div class="lens">עדשה: '+esc(s.l)+' · מזהה: '+esc(s.id)+'</div></div>';
      el.querySelector('.name').addEventListener('click',()=>{
        const o=el.classList.toggle('open');
        el.querySelector('.name').setAttribute('aria-expanded',o?'true':'false');
      });
      el.querySelector('[data-st]').addEventListener('click',()=>cycle(s.id));
      box.appendChild(el);
    });
    root.appendChild(sec);
  });
  paint();
}

function paint(){
  let done=0,doing=0,shown=0;
  document.querySelectorAll('.step').forEach(el=>{
    const st=ST[el.dataset.id]||'open';
    const b=el.querySelector('[data-st]');
    b.className='st '+(st==='open'?'':st);b.textContent=LBL[st];
    b.disabled=!live;b.style.cursor=live?'pointer':'default';
    el.classList.toggle('done',st==='done');
    if(st==='done')done++;if(st==='doing')doing++;
    const okF=filter==='all'||(filter==='open'&&st!=='done')||(filter==='done'&&st==='done')||(filter==='doing'&&st==='doing');
    const okQ=!q||el.dataset.hay.indexOf(q)>=0;
    el.hidden=!(okF&&okQ);
    if(!el.hidden)shown++;
  });
  document.querySelectorAll('.ms').forEach(sec=>{
    sec.hidden=!sec.querySelector('.step:not([hidden])');
  });
  document.getElementById('empty').hidden=shown>0;
  document.getElementById('fdone').style.width=(done)+'%';
  document.getElementById('fdoing').style.width=(doing)+'%';
  document.getElementById('cnt').textContent=done+' נגמרו · '+doing+' בעבודה · '+(100-done-doing)+' לפנינו';
}

async function cycle(id){
  if(!live||!dbns)return;
  const next=CY[ST[id]||'open'];
  const prev=ST[id];ST[id]=next;paint();
  try{await dbns.doc('plan/v2/steps/'+id).set({status:next,at:Date.now()});}
  catch(e){ST[id]=prev;paint();
    const n=document.getElementById('cnt');const t=n.textContent;
    n.textContent='לא נשמר: '+(e&&e.code?e.code:'שגיאה');setTimeout(()=>{n.textContent=t;},2500);}
}

document.getElementById('q').addEventListener('input',e=>{q=e.target.value.trim().toLowerCase();paint();});
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
  filter=c.dataset.f;
  document.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===c?'true':'false'));
  paint();
}));

build();

(async()=>{
  try{
    const db=await claude.use('db');
    if(!db)return;
    dbns=db;live=true;
    db.collection('plan/v2/steps').onSnapshot(snap=>{
      const next={};
      (snap.docs||[]).forEach(d=>{const v=d.data&&d.data();if(v&&v.status)next[d.id]=v.status;});
      ST=next;paint();
    },()=>{});
    paint();
  }catch(e){}
})();
"""

parts = []
parts.append('<title>מאה צעדים מפלצתיים</title>')
parts.append('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;800&family=Heebo:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap">')
parts.append('<style>' + CSS + '</style>')
parts.append('<div class="wrap">')
parts.append('<header>')
parts.append('<div class="eyebrow">תוכנית ליבה · סבב שני</div>')
parts.append('<h1>מאה צעדים מפלצתיים</h1>')
parts.append('<p class="lede">' + html.escape(opening) + '</p>')
parts.append('<div class="stats">'
             '<span class="stat">100 צעדים</span>'
             '<span class="stat">11 אבני דרך</span>'
             '<span class="stat">171 הצעות שרדו שיפוט</span>'
             '<span class="stat">71 הוסרו</span>'
             '<span class="stat">86 סוכנים</span>'
             '</div>')
parts.append('</header>')
parts.append('<div class="bar">'
             '<div class="track"><i class="done" id="fdone" style="width:0"></i><i class="doing" id="fdoing" style="width:0"></i></div>'
             '<div class="barrow">'
             '<span class="count" id="cnt">0 נגמרו · 0 בעבודה · 100 לפנינו</span>'
             '<input id="q" type="search" placeholder="חיפוש בצעדים…" aria-label="חיפוש בצעדים">'
             '<div class="chips">'
             '<button class="chip" data-f="all" aria-pressed="true">הכול</button>'
             '<button class="chip" data-f="open" aria-pressed="false">פתוח</button>'
             '<button class="chip" data-f="doing" aria-pressed="false">בעבודה</button>'
             '<button class="chip" data-f="done" aria-pressed="false">נגמר</button>'
             '</div></div></div>')
parts.append('<div id="plan"></div>')
parts.append('<p class="empty" id="empty" hidden>אין צעד שמתאים לחיפוש הזה.</p>')
parts.append('<div class="note"><h3>איך התוכנית הזאת נבנתה</h3>'
             '<p>ארבעה סוכנים קראו את הקוד החי — אלף חמש מאות וחמישים ושבע שורות קוטלין, הדף בן ארבעים ושניים הקילובייט, הבדיקות ושרשרת השילוח. '
             'אחריהם שתים עשרה עדשות ייצרו מאה שישים ושמונה הצעות, ושלושה שופטים אדוורסריים עברו על כל אצווה: אחד מודד מפלצתיות והורג כברירת מחדל, '
             'אחד היתכנות על המערכת הקיימת, ואחד ערך למאיר עצמו. ביקורת שלמות פתחה סבב נוסף על שמונה פערים. '
             'מאה שבעים ואחת הצעות שרדו, שבעים ואחת הוסרו — רובן כפילויות — ומאה סודרו לפי תלויות לאבני דרך. '
             'כל צעד נושא מדד יציאה עם מספר, כדי שאי אפשר יהיה לומר "נגמר" בלי להוכיח.</p>'
             '<p>הסטטוס של כל צעד נשמר בערוץ עצמו, כך שאפשר לסמן כאן ולשאול את ליבה בקול "מה הסטטוס של התוכנית".</p>'
             '</div>')
parts.append('</div>')
parts.append('<script id="data" type="application/json">' + payload + '</script>')
parts.append('<script>' + JS + '</script>')

open('liba-plan100.html', 'w').write('\n'.join(parts))
print('bytes:', len('\n'.join(parts)))
