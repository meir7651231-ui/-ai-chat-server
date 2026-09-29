// @anchor: core
// DOM handles, the two capability handles, status line
const $=id=>document.getElementById(id);
const app=$('app'),H=$('h'),SUB=$('sub'),KIND=$('kind'),OPTS=$('opts'),HEARD=$('heard'),LOG=$('log');
let db=null,comments=null,AC=null,ringTimer=null,cur=null,lastRung=null,wakeLock=null,rec=null;
const log=t=>{LOG.textContent=t;};
const setSt=(t,c='')=>{$('stt').textContent=t;$('st').className='st '+c;};
/* one state machine, one table (core-machine): the moves come from protocol/protocol.json, the same table the
   bubble is generated from. OFFLINE until the page is armed; SPEAKING and SENDING are what "busy" used to be.
   A move the table does not allow is a fault (P_STATE_ILLEGAL) and still happens - the phone is never broken
   to prove a point. Every move lands in a 200-entry log and is told to the bubble. */
let state=PROTO.initial,illegalMoves=0;const stateLog=[];
const canMove=(a,b)=>a===b||(PROTO.moves[a]||[]).indexOf(b)>=0;
function transition(to,why){const from=state;if(from===to)return;const ok=canMove(from,to);
  if(!ok){illegalMoves++;fail('P_STATE_ILLEGAL',null,from+'>'+to);}
  state=to;stateLog.push({t:Date.now(),from:from,to:to,why:why||'',ok:ok});while(stateLog.length>200)stateLog.shift();
  if(appMode)post(PROTO.toApp.state,{state:to});}
const isArmed=()=>state!=='OFFLINE',isBusy=()=>state==='SPEAKING'||state==='SENDING';
const arm=why=>{if(state==='OFFLINE')transition('IDLE',why);};
