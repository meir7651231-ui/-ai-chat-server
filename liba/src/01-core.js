// @anchor: core
// DOM handles, the two capability handles, status line
const $=id=>document.getElementById(id);
const app=$('app'),H=$('h'),SUB=$('sub'),KIND=$('kind'),OPTS=$('opts'),HEARD=$('heard'),LOG=$('log');
let db=null,comments=null,AC=null,ringTimer=null,cur=null,lastRung=null,wakeLock=null,rec=null,armed=false;
const log=t=>{LOG.textContent=t;};
const setSt=(t,c='')=>{$('stt').textContent=t;$('st').className='st '+c;};
