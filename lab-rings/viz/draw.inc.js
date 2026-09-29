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

