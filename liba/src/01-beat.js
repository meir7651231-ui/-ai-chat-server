// @anchor: beat
// one beat for every periodic job on the page (duty-governor): one timer, asleep until the next job is due
/* Step duty-governor, page side. Twelve setInterval chains each woke the page on its own schedule. every(name, ms, fn)
   puts a job in one table; a single timeout sleeps until the earliest job is due, runs what is due, and sleeps again -
   the periods are the same, the page wakes once where it woke many times. A job that throws or rejects is a P_BEAT
   fault with its name, and the others still run. beatK stretches every period when the phone asks for a slower gear. */
const beatRows=[];let beatTimer=null,beatAt=0,beatK=1;
function every(name,ms,fn){beatRows.push({name:name,ms:ms,fn:fn,last:Date.now()});beatArm();}
function beatNext(now){let t=Infinity;for(const r of beatRows)t=Math.min(t,r.last+r.ms*beatK);return Math.max(now+250,t);}
function beatArm(){const now=Date.now(),at=beatNext(now);if(beatTimer&&at>=beatAt)return;if(beatTimer)clearTimeout(beatTimer);beatAt=at;beatTimer=setTimeout(beatRun,at-now);}
function beatRun(){beatTimer=null;const now=Date.now();
  for(const r of beatRows){if(now-r.last<r.ms*beatK)continue;r.last=now;
    try{const p=r.fn();if(p&&typeof p.catch==='function')p.catch(e=>fail('P_BEAT',e,r.name));}catch(e){fail('P_BEAT',e,r.name);}}
  beatArm();}
function beatGear(k){beatK=Math.max(1,+k||1);if(beatTimer){clearTimeout(beatTimer);beatTimer=null;}beatArm();}
window.__beat={rows:()=>beatRows.map(r=>({name:r.name,ms:r.ms})),gear:beatGear};
