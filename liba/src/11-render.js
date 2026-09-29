// @anchor: render
// the task list and the system map
const ST={queued:'בתור',running:'רץ',blocked:'תקוע',done:'נגמר'};
/* step 60: system map – one list: every session, what it does, who is stuck */
let sessionsList=[],mapOn=false;
function renderMap(){const el=$('map');if(!mapOn||!sessionsList.length){el.hidden=true;return;}el.hidden=false;
  const age=t=>{const m=Math.round((Date.now()-(t||0))/60000);return m<60?m+' דק׳':Math.round(m/60)+' שע׳';};
  el.innerHTML='<div class="t"><b>מפת המערכת · '+sessionsList.length+' סשנים</b></div>'+sessionsList.slice(0,20).map(x=>`<div class="t ${x.status==='running'?'running':x.status==='blocked'||x.status==='failed'?'blocked':x.status==='done'?'done':''}"><i></i><b>${esc(x.title||x.id)}</b><small>${esc(x.status||'')} · ${age(x.updatedAt)}</small></div>`).join('');}
function mapSummary(){if(!sessionsList.length)return 'אין לי עדיין מפה של הסשנים.';const r=sessionsList.filter(x=>x.status==='running'),b=sessionsList.filter(x=>x.status==='blocked'||x.status==='failed');return sessionsList.length+' סשנים. '+(r.length?r.length+' רצים: '+r.map(x=>x.title+(x.what?' – '+x.what:'')).join('; ')+'. ':'')+(b.length?b.length+' תקועים: '+b.map(x=>x.title).join(', ')+'.':'אין תקועים.');}
function renderTasks(list){const el=$('tasks');if(!list.length){el.hidden=true;post('tasks',{summary:'',n:0,running:0,blocked:0,done:0});return;}
  const pe=t=>(t.progress!=null?' '+Math.round(t.progress)+'%':'')+(t.eta?' · '+t.eta:'');
  el.hidden=false;el.innerHTML=list.slice(0,8).map(t=>`<div class="t ${esc(t.status||'')}"><i></i><b>${esc(t.title||t.id)}</b><small>${esc((ST[t.status]||t.status||'')+pe(t))}</small></div>`).join('');
  const c=k=>list.filter(t=>t.status===k).length;const parts=[];
  if(c('running'))parts.push(c('running')+' רצות: '+list.filter(t=>t.status==='running').map(t=>t.title+(t.progress!=null?', '+Math.round(t.progress)+' אחוז':'')+(t.eta?', עוד '+t.eta:'')).join('; '));
  if(c('blocked'))parts.push(c('blocked')+' תקועות ומחכות לך: '+list.filter(t=>t.status==='blocked').map(t=>t.title+(t.question?' – '+t.question:'')).join('; '));
  if(c('done'))parts.push(c('done')+' נגמרו: '+list.filter(t=>t.status==='done').map(t=>t.title).join(', '));
  if(c('queued'))parts.push(c('queued')+' בתור');
  post('tasks',{summary:parts.join('. ')||'אין משימות פתוחות',n:list.length,running:c('running'),blocked:c('blocked'),done:c('done')});}
