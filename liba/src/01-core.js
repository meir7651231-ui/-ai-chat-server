// @anchor: core
// DOM handles, the two capability handles, status line
const $=id=>document.getElementById(id);
const app=$('app'),H=$('h'),SUB=$('sub'),KIND=$('kind'),OPTS=$('opts'),HEARD=$('heard'),LOG=$('log');
let db=null,comments=null,AC=null,ringTimer=null,cur=null,lastRung=null,wakeLock=null,rec=null;
const log=t=>{LOG.textContent=t;};
const setSt=(t,c='')=>{$('stt').textContent=t;$('st').className='st '+c;};
/* one state instead of two booleans (page-kernel). OFF until the page is armed; SPEAKING and SENDING are
   what "busy" used to mean. Every change goes through transition() and lands in a 200-entry log. */
let state='OFF';const stateLog=[];
function transition(to,why){const from=state;if(from===to)return;state=to;stateLog.push({t:Date.now(),from:from,to:to,why:why||''});while(stateLog.length>200)stateLog.shift();}
const isArmed=()=>state!=='OFF',isBusy=()=>state==='SPEAKING'||state==='SENDING';
const arm=why=>{if(state==='OFF')transition('IDLE',why);};
