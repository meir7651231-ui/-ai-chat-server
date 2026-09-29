
/* ————— the running loop: endless, live, harvesting, shared ————— */
const $=(id)=>document.getElementById(id);
const fmt=(n)=>n.toLocaleString("en-US");
const C={ice:"#7D93E8",gold:"#FFC65C",mint:"#5CF2B6",coral:"#FF6F5B",faint:"#5A6390",ink:"#EEF1FF"};
const KEY="rings-harvest-v2", MAX_RINGS=9, MAX_MS=70000;
// כל דפדפן מגריל ממספר-התחלה משלו
let ME=null, SEED0=7; try{ ME=localStorage.getItem("rings-me"); if(!ME){ ME="b"+Math.floor(Math.random()*1e9); localStorage.setItem("rings-me",ME); } SEED0=1+(parseInt(ME.slice(1))%100000); }catch(e){ ME="b"+Math.floor(Math.random()*1e9); }
const E=makeEngine(SEED0);
let stream=[], taskNo=0, totalTried=0, totalHarvest=0, evSeen=0, freshTT=null;
let T=null, S=null, rings=[], busy=false, playing=true, winPath=null, winBorn=0, nextAt=0, sweepA=0, spent=0, lastTick=0, phase="idle";
const libList=()=>[...E.lib.values()];

function save(){ try{ localStorage.setItem(KEY, JSON.stringify({eng:E.state(), stream:stream.slice(-40), taskNo, totalTried, totalHarvest})); }catch(e){} }
function load(){ try{ const o=JSON.parse(localStorage.getItem(KEY)||"null"); if(!o) return false; E.restore(o.eng); stream=o.stream||[]; taskNo=o.taskNo||0; totalTried=o.totalTried||0; totalHarvest=o.totalHarvest||0; evSeen=E.events.length; return true; }catch(e){ return false; } }

/* ————— shared memory: one document per table, «bricks/t<tt>». Anything read is re-run before it is trusted. ————— */
let DB=null, dbLen=new Map(), claims={};
async function connectShared(){
  try{ DB=await claude.use("db"); }catch(e){ DB=null; } if(!DB) return;
  DB.collection("bricks").onSnapshot((snap)=>{ let n=0;
    for(const d of snap.docs){ const b=d.data(); if(!b||!Array.isArray(b.ops)) continue; const got=E.offer(b.ops, b.src==="server"?"server":"shared"); if(got){ n++; } const tt=E.ttOfOps(b.ops); if(tt!=null) dbLen.set("t"+tt, Math.min(dbLen.get("t"+tt)??1e9, b.ops.length)); }
    evSeen=E.events.length; pushAll();
    if(n){ renderShelf(); renderStats(); save(); cap(`<b>${n}</b> ${n===1?"טבלה הגיעה":"טבלאות הגיעו"} מהזיכרון המשותף (כל אחת הורצה ונבדקה לפני שנכנסה). ממופות עכשיו ${E.lib.size} מתוך 256.`,"win"); }
  }, ()=>{});
  DB.collection("claims").onSnapshot((snap)=>{ const m={}; for(const d of snap.docs){ const v=d.data(); if(v) m[d.id]=v; } claims=m; renderWho(); }, ()=>{});
  if(T) claim(T);
}
let pushing=false;
async function pushAll(){ if(!DB||pushing) return; pushing=true;
  try{ for(const b of libList()){ const id="t"+b.tt; if((dbLen.get(id)??1e9)<=b.ops.length) continue; dbLen.set(id,b.ops.length);
      await DB.doc("bricks/"+id).set({name:b.name,tt:b.tt,ops:b.ops,len:b.ops.length,src:b.src==="server"?"server":"browser",at:new Date().toISOString()}).catch(()=>dbLen.delete(id)); } }
  finally{ pushing=false; } }
function claim(t){ if(DB&&t) DB.doc("claims/t"+t.tt).set({by:ME,name:t.name,at:new Date().toISOString()}).catch(()=>{}); }
function unclaim(t){ if(DB&&t) DB.doc("claims/t"+t.tt).delete().catch(()=>{}); }
function renderWho(){ const others=Object.entries(claims).filter(([k,v])=>v.by!==ME&&Date.now()-Date.parse(v.at)<600000).map(([k,v])=>`${v.name}${v.by==="server"?" (שרת)":""}`);
  $("who").textContent=others.length?`במקביל עובדים על: ${others.join(" · ")}`:""; }
const claimedElse=(tt)=>{ const c=claims["t"+tt]; return !!(c&&c.by!==ME&&Date.now()-Date.parse(c.at)<600000); };
/* canvas */
const cv=$("cv"), ctx=cv.getContext("2d"); let W=0,H=0,DPR=1;
function resize(){ const r=$("stage").getBoundingClientRect(); DPR=Math.min(2,window.devicePixelRatio||1); W=r.width; H=r.height; cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR); ctx.setTransform(DPR,0,0,DPR,0,0); layout(); }
new ResizeObserver(resize).observe($("stage"));
const sprites={};
function sprite(color,r){ const key=color+r; if(sprites[key]) return sprites[key]; const d=Math.ceil(r*6); const c=document.createElement("canvas"); c.width=c.height=d*2; const g=c.getContext("2d");
  const grd=g.createRadialGradient(d,d,0,d,d,d); grd.addColorStop(0,color); grd.addColorStop(.18,color); grd.addColorStop(.32,color+"88"); grd.addColorStop(1,color+"00");
  g.fillStyle=grd; g.fillRect(0,0,d*2,d*2); sprites[key]={c,d}; return sprites[key]; }
const cx=()=>W/2, cy=()=>H*0.5+(W<640?10:18);
function Rmax(){ return Math.min(W*0.5,H*0.5)-(W<640?30:64); }
function radius(i){ const n=Math.max(rings.length+(busy?1:0),4); const r0=Math.max(26,Rmax()*0.11); return r0+(i+1)*(Rmax()-r0)/n; }
const SHOW=80;
function layout(){ rings.forEach((r,i)=>{ const rad=radius(i); r.show.forEach((nd,j)=>{ const a=(j/r.show.length)*Math.PI*2-Math.PI/2+i*0.37; nd._t={x:Math.cos(a)*rad,y:Math.sin(a)*rad}; }); }); }
const ease=(t)=>1-Math.pow(1-Math.min(1,Math.max(0,t)),3);
function draw(now){
  ctx.clearRect(0,0,W,H); ctx.save(); ctx.translate(cx(),cy()); const R=Rmax();
  ctx.strokeStyle="rgba(160,178,255,.05)"; ctx.lineWidth=1;
  for(let k=0;k<24;k++){ const a=k/24*Math.PI*2; ctx.beginPath(); ctx.moveTo(Math.cos(a)*R*0.12,Math.sin(a)*R*0.12); ctx.lineTo(Math.cos(a)*(R+26),Math.sin(a)*(R+26)); ctx.stroke(); }
  const n=Math.max(rings.length+(busy?1:0),4);
  for(let i=0;i<n;i++){ const live=i<rings.length, cur=busy&&i===rings.length, rad=radius(i); const grow=live?ease((now-rings[i].born)/700):1;
    ctx.beginPath(); ctx.arc(0,0,rad*(live?(0.85+0.15*grow):1),0,Math.PI*2);
    ctx.strokeStyle=cur?"rgba(255,198,92,.45)":live?"rgba(160,178,255,.22)":"rgba(160,178,255,.07)"; ctx.setLineDash(live||cur?[]:[2,6]); ctx.lineWidth=cur?1.4:1; ctx.stroke(); }
  ctx.setLineDash([]);
  if(busy&&S){ if(playing) sweepA+=0.045; const rad=radius(rings.length);
    if(ctx.createConicGradient){ const g=ctx.createConicGradient(sweepA,0,0); g.addColorStop(0,"rgba(255,198,92,.28)"); g.addColorStop(.08,"rgba(255,198,92,0)"); g.addColorStop(1,"rgba(255,198,92,0)"); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,rad,0,Math.PI*2); ctx.fill(); }
    ctx.strokeStyle="rgba(255,198,92,.8)"; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(sweepA)*rad,Math.sin(sweepA)*rad); ctx.stroke();
    ctx.strokeStyle=C.gold; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(0,0,rad,-Math.PI/2,-Math.PI/2+Math.PI*2*S.progress); ctx.stroke(); }
  ctx.lineWidth=.7;
  rings.forEach((r)=>{ r.show.forEach((nd,j)=>{ const e=ease((now-r.born-j*6)/620); const p=nd.parent; const px=p._x??0, py=p._y??0;
    nd._x=px+(nd._t.x-px)*e; nd._y=py+(nd._t.y-py)*e; ctx.strokeStyle=`rgba(125,147,232,${0.18*e})`; ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(nd._x,nd._y); ctx.stroke(); }); });
  ctx.globalCompositeOperation="lighter";
  rings.forEach((r)=>{ r.show.forEach((nd)=>{ const col=nd.ok===r.N?C.mint:nd.ok>0?C.gold:C.ice; const sz=nd.ok===r.N?4.2:nd.ok>0?2.6:2; const sp=sprite(col,sz);
    ctx.globalAlpha=nd.ok>0?1:.55; ctx.drawImage(sp.c,nd._x-sp.d,nd._y-sp.d); }); });
  ctx.globalAlpha=1;
  if(winPath){ const L=winPath; const t=(now-winBorn)/(300*L.length); const upto=Math.max(0,t*L.length); ctx.lineCap="round"; ctx.lineJoin="round";
    for(const [w,a] of [[10,.12],[5,.3],[2.4,1]]){ ctx.strokeStyle=`rgba(255,111,91,${a})`; ctx.lineWidth=w; ctx.beginPath(); ctx.moveTo(0,0); let px=0,py=0;
      L.forEach((nd,k)=>{ if(k>upto) return; const f=Math.min(1,upto-k); ctx.lineTo(px+(nd._x-px)*f,py+(nd._y-py)*f); px=nd._x; py=nd._y; }); ctx.stroke(); }
    L.forEach((nd,k)=>{ if(k<upto){ const sp=sprite(C.coral,5); ctx.drawImage(sp.c,nd._x-sp.d,nd._y-sp.d); } });
    if(t>=1){ const last=L[L.length-1]; const ph=((now-winBorn)/900)%1; ctx.globalCompositeOperation="source-over"; ctx.strokeStyle=`rgba(92,242,182,${1-ph})`; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(last._x,last._y,8+ph*26,0,Math.PI*2); ctx.stroke(); } }
  ctx.globalCompositeOperation="source-over";
  ctx.font="500 10.5px 'JetBrains Mono', monospace"; ctx.fillStyle=C.faint; ctx.textAlign="center";
  for(let i=0;i<rings.length;i++) ctx.fillText(String(i+1),0,-radius(i)-6);
  const pulse=busy?(Math.sin(now/140)+1)/2:0; const core=sprite(busy?C.gold:C.ink,5+pulse*1.5); ctx.globalCompositeOperation="lighter"; ctx.drawImage(core.c,-core.d,-core.d); ctx.globalCompositeOperation="source-over";
  ctx.restore();
}


/* ————— flow ————— */
function startTask(){
  taskNo++; const tt=E.nextTarget(x=>x%2===0, taskNo, claimedElse) ?? E.nextTarget(null, taskNo, claimedElse);
  if(tt==null){ phase="idle"; cap(`<b>כל 256 הטבלאות ממופות.</b> כל פונקציה של שלושה קלטים נמצאת במדף, בדרך הקצרה ביותר שנמצאה עד עכשיו.`,"win"); nextAt=performance.now()+60000; return; }
  T={tt,name:E.nameOf(tt),rule:E.ruleOf(tt),tries:(E.backoff.get(tt)||{tries:0}).tries}; claim(T);
  S=new E.Search(tt); rings=[]; winPath=null; busy=false; spent=0; phase="search";
  $("tname").textContent=T.name; $("trule").textContent=T.rule; $("rno").textContent="00";
  const tr=$("ttry"); if(T.tries){ tr.hidden=false; tr.textContent=`ניסיון ${T.tries+1} · עם ${E.lib.size} טבלאות ממופות`; } else tr.hidden=true;
  ["cTried","cMerged","cBroke","cKept"].forEach(k=>$(k).textContent="0");
  $("tokn").textContent=`${S.tokens.length} אפשרויות לכל צעד`;
  cap(`משימה ${fmt(taskNo)}: <b>${T.name}</b> — הטבלה החסרה הכי קרובה למה שכבר יודעים. בדרך, כל תוכנית שתיבדק תיבדק גם «מה היא בעצם מחשבת».`);
  ribbon(null); lamps(null); renderStream(); renderShelf(); renderStats();
  nextAt=performance.now()+400;
}
function advance(){ busy=true; $("rno").textContent=String(rings.length+1).padStart(2,"0"); layout(); cap(`מחפש בעיגול ${rings.length+1}: כל תוכנית שנשארה, ועוד פעולה אחת מתוך ${S.tokens.length}. כל אחת נבדקת גם «מה היא מחשבת».`); }
function harvestNews(){ const ev=E.events.slice(evSeen); evSeen=E.events.length; const mine=ev.filter(e=>e.src==="harvest"); if(mine.length){ totalHarvest+=mine.length; freshTT=mine[mine.length-1].tt; renderShelf(); renderStats(); pushAll(); save(); } return mine; }
function ringDone(r,now){
  busy=false; r.born=now; r.show=r.kept.slice(0,SHOW); totalTried+=r.tried;
  if(r.best){ const list=[]; let x=r.best; while(x&&x.id!==0){ list.unshift(x); x=x.parent; }
    rings.forEach((rr,i)=>{ const need=list[i]; if(need&&!rr.show.includes(need)) rr.show.push(need); }); if(!r.show.includes(r.best)) r.show.push(r.best); winPath=list; winBorn=now+700; }
  rings.push(r); layout();
  $("cTried").textContent=fmt(r.tried); $("cMerged").textContent=fmt(r.merged); $("cBroke").textContent=fmt(r.broke); $("cKept").textContent=fmt(r.kept.length);
  const top=r.best||r.kept[0]; ribbon(top); lamps(top);
  const got=harvestNews(); const hv=got.length?` בדרך נקצרו <b>${got.length}</b> ${got.length===1?"טבלה":"טבלאות"} ${got.some(g=>g.better)?"(חלקן בדרך קצרה מהקודמת) ":""}— ממופות ${E.lib.size}/256.`:"";
  if(r.best){ const b=E.offer([["W",0],["GO"],...r.best.ops],"browser"); evSeen=E.events.length; stream.push({name:T.name,ok:true,ring:r.ring,h:r.harvested}); phase="won"; unclaim(T);
    setTimeout(()=>fly(T.name), 700+300*winPath.length); pushAll();
    cap(`<b>נמצא בעיגול ${r.ring}.</b> ${r.best.prog.length} צעדים, עובר את 16 הדוגמאות ועוד 240 בדיקה.${hv}`,"win");
    nextAt=now+pace()+300*winPath.length+1600; save();
  } else if(r.ring>=MAX_RINGS || spent>MAX_MS){ const tries=E.failed(T.tt,taskNo); stream.push({name:T.name,ok:false,tries,h:r.harvested}); phase="lost"; unclaim(T);
    cap(`<b>«${T.name}» לא נמצאה עד עיגול ${r.ring}.</b>${hv||" "} היא תחזור אחרי שהמדף יגדל.`,"fail"); renderStats(); save(); nextAt=now+pace()+1400;
  } else { cap(`עיגול ${r.ring}: <b>${fmt(r.tried)}</b> נבדקו · ${fmt(r.merged)} כפולות אוחדו. הכי קרובה: ${top?top.ok:0} מתוך 16.${hv}`, got.length?"win":undefined); nextAt=now+pace(); }
}
function pace(){ return 2600/ +$("speed").value; }
function loop(now){
  const dt=lastTick?now-lastTick:0; lastTick=now;
  if(playing){
    if(busy&&S){ spent+=dt; const res=S.step(12); liveCounters(); if(res) ringDone(res,now); else if(E.events.length>evSeen) harvestNews(); }
    else if(now>=nextAt){ if(phase==="search") advance(); else startTask(); }
  }
  draw(now); requestAnimationFrame(loop);
}
function liveCounters(){ $("cTried").textContent=fmt(S.tried); $("cMerged").textContent=fmt(S.merged); $("cBroke").textContent=fmt(S.broke); $("cKept").textContent=fmt(S.outer.length); }

/* ————— panels ————— */
function cap(html,kind){ const c=$("cap"); c.innerHTML=html; c.className="caption"+(kind?" "+kind:""); }
function ribbon(node){ const b=$("best"); b.innerHTML=""; $("plen").textContent=node?`${node.prog.length} צעדים · ${node.ok}/16`:"";
  if(!node){ b.innerHTML='<span class="none">עוד אין.</span>'; return; }
  node.prog.forEach((t,i)=>{ if(i) b.insertAdjacentHTML("beforeend",'<span class="arr">‹</span>'); const s=document.createElement("span"); s.className="tk"+(t.brick?" bk":""); s.textContent=t.name; s.style.animationDelay=(i*40)+"ms"; b.appendChild(s); }); }
function lamps(node){ const L=$("lamps"); L.innerHTML=""; if(!S) return;
  S.ex.forEach((e,i)=>{ const got=node?node.out[i]:"·"; const ok=node&&got===e.want;
    L.insertAdjacentHTML("beforeend",`<div class="lp ${node?(ok?"ok":"no"):""}" title="א=${e.a} ב=${e.b} ג=${e.c}"><div class="bulb" style="transition-delay:${i*25}ms">${got}</div><div class="w">${e.want}</div></div>`); }); }
function renderShelf(){ $("atoms").innerHTML=E.ATOMS.map(a=>`<span class="at">${a.name}</span>`).join("");
  // מפת 256 הטבלאות: כל משבצת טבלה; צבועה = ממופה
  const map=$("map"); if(map){ let h=""; for(let tt=0;tt<256;tt++){ const b=E.lib.get(tt); const cls=b?(tt===freshTT?"cell on fresh":"cell on"):(T&&T.tt===tt?"cell cur":"cell"); h+=`<i class="${cls}" title="${E.nameOf(tt)}${b?` · ${b.len} פעולות`:""}"></i>`; } map.innerHTML=h; }
  const s=$("shelf"); const named=libList().filter(b=>!b.name.startsWith("טבלה")).sort((a,b)=>a.len-b.len);
  s.innerHTML=named.map(b=>`<div class="brick" data-n="${b.name}"><div class="a">${b.name}</div><div class="b">${b.len} פעולות${b.src==="server"?" · מהשרת":b.src==="shared"?" · משותף":b.src==="harvest"?" · נקצר":""}</div></div>`).join("") || '<span class="none">עוד אין.</span>'; }
function renderStream(){ const el=$("stream"); const items=stream.slice(-30).map(e=>`<div class="ev ${e.ok?"ok":"no"}"><span class="a">${e.name}</span><span class="b">${e.ok?`עיגול ${e.ring}`:`ניסיון ${e.tries}`}${e.h?` · +${e.h} נקצרו`:""}</span></div>`);
  if(T&&phase==="search") items.push(`<div class="ev now"><span class="a">${T.name}</span><span class="b">מחפש עכשיו</span></div>`); el.innerHTML=items.join(""); el.scrollLeft=-el.scrollWidth; }
function renderStats(){ $("sLearned").textContent=`${E.lib.size}/256`; $("sTask").textContent=fmt(taskNo); $("sWait").textContent=fmt(totalHarvest); $("sTried").textContent=totalTried>=1e6?(totalTried/1e6).toFixed(1)+"M":fmt(totalTried); }
function fly(name){
  const last=winPath&&winPath[winPath.length-1]; const st=$("stage").getBoundingClientRect(); renderShelf(); renderStream(); renderStats();
  const target=document.querySelector(`.brick[data-n="${CSS.escape(name)}"]`)||$("map"); if(!target||matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const from={x:st.left+cx()+(last?last._x:0), y:st.top+cy()+(last?last._y:0)}; const tr=target.getBoundingClientRect(); if(tr.bottom<0||tr.top>innerHeight+400) return;
  const f=document.createElement("div"); f.className="flyer"; f.textContent=name; document.body.appendChild(f);
  const fr=f.getBoundingClientRect(); f.style.left=(from.x-fr.width/2)+"px"; f.style.top=(from.y-fr.height/2)+"px";
  const dx=tr.left-from.x+fr.width/2, dy=tr.top-from.y+fr.height/2;
  f.animate([{transform:"translate(0,0) scale(.4)",opacity:0},{transform:"translate(0,-20px) scale(1.1)",opacity:1,offset:.2},{transform:`translate(${dx}px,${dy}px) scale(1)`,opacity:1}],{duration:1100,easing:"cubic-bezier(.5,0,.2,1)"}).onfinish=()=>f.remove();
}

/* ————— controls ————— */
const PLAY='<path d="M8 5v14l11-7z"/>', PAUSE='<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';
function setPlaying(p){ playing=p; $("runIcon").innerHTML=p?PAUSE:PLAY; $("runTxt").textContent=p?"עצור":"המשך"; $("live").classList.toggle("off",!p); $("live").lastChild.textContent=p?"חי":"עצור"; }
$("run").addEventListener("click",()=>setPlaying(!playing));
let wipeArmed=false;
$("wipe").addEventListener("click",()=>{ if(!wipeArmed){ wipeArmed=true; $("wipe").textContent="בטוח? לחץ שוב"; setTimeout(()=>{ wipeArmed=false; $("wipe").textContent="התחל מאפס"; },3000); return; }
  try{ localStorage.removeItem(KEY); }catch(e){} location.reload(); });
const resumed=load(); resize(); renderShelf(); renderStats(); connectShared();
cap(`${resumed?"ממשיך מאיפה שעצר. ":""}ממופות ${E.lib.size} מתוך 256 טבלאות. מתחבר לזיכרון המשותף…`);
phase="idle"; nextAt=performance.now()+(resumed?1500:1200); requestAnimationFrame(loop);
