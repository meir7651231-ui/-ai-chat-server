// @anchor: owner
// who holds the line
function switchOwner(text){const t=text.replace(/[?!.,]/g,'').trim();
  if(owner!=='manager'){if(quietCmd(text))return true;if(taskCmd(text))return true;if(memoryCmd(text))return true;}
  /* simple rule: a sentence that starts with "ליבה" is for ליבה; one that starts with "מנהל" is for the manager */
  if(/^(היי |הי )?ליב[הא],?\s*(תחזור|תחזרי|חזור|חזרי)\s*$/.test(t)){return setOwner('liba');}
  if(owner==='manager'&&/^(תחזור|תחזרי|חזור|חזרי)$/.test(t)){return setOwner('liba');}
  if(owner==='manager'&&/^(היי |הי )?ליב[הא](?=\s|$)/.test(t)){owner='liba';ownerSince=Date.now();P.owner().set({owner:'liba',since:ownerSince}).catch(e=>{fail('P_DB_WRITE',e,'channel/owner');log('owner: '+(e.code||e));});return false;}
  if(/^(תעלה|העלה|תן ל|תעביר ל)\s*(את\s+)?ה?מנהל$/.test(t)||/^מנהל$/.test(t)){return setOwner('manager');}
  if(owner==='liba'&&/^(היי |הי )?מנהל(?=\s|$)/.test(t)){owner='manager';ownerSince=Date.now();P.owner().set({owner:'manager',since:ownerSince}).catch(e=>{fail('P_DB_WRITE',e,'channel/owner');log('owner: '+(e.code||e));});return false;}
  return false;}
async function setOwner(o){owner=o;ownerSince=Date.now();try{await P.owner().set({owner:o,since:ownerSince});}catch(e){fail('P_DB_WRITE',e,'channel/owner');log('owner: '+(e.code||e));}
  const msg=o==='liba'?'ליבה על הקו.':'המנהל על הקו. ליבה שותקת עד שתגיד ליבה תחזור.';bubble('li',msg);if(appMode)post('say',{text:msg,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(msg);return true;}
