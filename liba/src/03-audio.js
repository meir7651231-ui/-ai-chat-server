// @anchor: audio
// tones and the ring

/* ---- audio ---- */
function audioInit(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){fail('P_AUDIO',e);}}
function beep(f,d,v=.2,type='sine'){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d);}
function ringOnce(){beep(880,.18,.25);setTimeout(()=>beep(1175,.18,.25),200);setTimeout(()=>beep(880,.18,.25),400);setTimeout(()=>beep(1175,.35,.25),600);if(navigator.vibrate)navigator.vibrate([300,150,300]);}
function ringStart(){ringStop();ringOnce();ringTimer=setInterval(ringOnce,2200);setTimeout(ringStop,45000);}
function ringStop(){if(ringTimer){clearInterval(ringTimer);ringTimer=null;}}
