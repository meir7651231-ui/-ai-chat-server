// @anchor: people
// people: who is דני - one card per person, found through Hebrew prefixes and nicknames
/* Step people. memory/people/items/<slug(name)>: {name, aliases[], relation, sens, lastMentioned, firstSeen}.
   resolve(text) finds the people a sentence talks about - "לדני", "של דני", "ודני" and a nickname Meir taught all find
   the same card. A card is never merged silently: "תאחד את X עם Y" asks first, and the merged card keeps the other
   in merged[] for 30 days. A person card is sensitive (1), and the brief gives facts about a person in the sentence a
   boost. */
const PEOPLE={
  cache:null,at:0,
  async all(){if(this.cache&&Date.now()-this.at<30000)return this.cache;const r=await coldGet(P.people(),null,500);this.cache=r.docs.map(d=>Object.assign({key:d.id},d.data()||{})).filter(x=>x.state!=='tomb');this.at=Date.now();return this.cache;},
  names(p){return [p.name].concat(p.aliases||[]).map(n=>memWords(n).join(' ')).filter(Boolean);},
  async resolve(text){const w=' '+memWords(text).join(' ')+' ';const all=await this.all();return all.filter(p=>this.names(p).some(n=>w.indexOf(' '+n+' ')>=0));},
  async find(name){const n=memWords(name).join(' ');return (await this.all()).find(p=>this.names(p).indexOf(n)>=0)||null;},
  async upsert(name,fields){const ex=await this.find(name);const k=ex?ex.key:slug(name),now=Date.now();
    const doc=Object.assign({name:ex?ex.name:name.trim(),aliases:ex&&ex.aliases||[],sens:1,firstSeen:ex&&ex.firstSeen||now,lastMentioned:now,state:'live'},ex||{},fields||{},{updatedAt:now});delete doc.key;
    await P.person(k).set(doc);this.cache=null;return Object.assign({key:k},doc);},
};
let lastPerson=null;
function peopleAdd(rest,m){const name=rest.trim(),rel=m.rel.replace(/^(הוא|היא) /,'').trim();
  PEOPLE.upsert(name,{relation:rel}).then(p=>{lastPerson=p;MEM.put({subject:name,predicate:'הוא',value:rel,kind:'person',conf:0.9,raw:name+' '+m.rel},{type:'said'}).catch(()=>{});
    sayLocal('רשמתי: '+p.name+' '+m.rel.split(' ')[0]+' '+rel+'.');}).catch(e=>{fail('P_DB_WRITE',e,'people');sayLocal('לא הצלחתי לרשום.');});return true;}
function peopleWho(rest){if(!rest.trim())return false;peopleWhoA(rest).catch(e=>fail('P_DB_READ',e,'people'));return true;}
async function peopleWhoA(rest){const q=rest.trim();const ps=await PEOPLE.resolve(q).catch(()=>[]);
  if(!ps.length){sayLocal('אני לא מכירה את '+q+'. תגיד למשל "'+q+' הוא השכן".');return true;}
  const p=ps[0];lastPerson=p;P.person(p.key).update({lastMentioned:Date.now()}).catch(()=>{});
  const facts=(await MEM.query(p.name).catch(()=>[])).filter(f=>!(f.subject===p.name&&f.predicate==='הוא')).slice(0,3).map(f=>f.raw||f.value);
  sayLocal(p.name+(p.relation?' הוא '+p.relation:'')+((p.aliases||[]).length?', קוראים לו גם '+p.aliases.join(', '):'')+'.'+(facts.length?' עוד: '+facts.join('; ')+'.':''));return true;}
function peopleAlias(rest){if(!rest.trim())return false;peopleAliasA(rest).catch(e=>fail('P_DB_WRITE',e,'people'));return true;}
async function peopleAliasA(rest){const a=rest.trim();if(!lastPerson){sayLocal('על מי? תגיד קודם מי זה.');return true;}
  const other=await PEOPLE.find(a);if(other&&other.key!==lastPerson.key){sayLocal(a+' כבר שם של '+other.name+'. תגיד תאחד את '+lastPerson.name+' עם '+other.name+' אם זה אותו אדם.');return true;}
  const al=[...new Set((lastPerson.aliases||[]).concat([a]))];await P.person(lastPerson.key).update({aliases:al,updatedAt:Date.now()});lastPerson.aliases=al;PEOPLE.cache=null;
  sayLocal('בסדר, '+lastPerson.name+' זה גם '+a+'.');return true;}
function peopleMerge(rest){if(rest.split(' עם ').length!==2)return false;peopleMergeA(rest).catch(e=>fail('P_DB_WRITE',e,'people'));return true;}
async function peopleMergeA(rest){const m=rest.split(' עם ');const a=await PEOPLE.find(m[0]),b=await PEOPLE.find(m[1]);
  if(!a||!b||a.key===b.key){sayLocal('לא מצאתי שני אנשים שונים בשמות האלה.');return true;}
  const al=[...new Set((a.aliases||[]).concat([b.name],b.aliases||[]))];await P.person(a.key).update({aliases:al,relation:a.relation||b.relation,merged:[{key:b.key,name:b.name,at:Date.now()}],updatedAt:Date.now()});
  await P.person(b.key).update({state:'tomb',tombAt:Date.now(),mergedInto:a.key});PEOPLE.cache=null;sayLocal('איחדתי: '+b.name+' הוא '+a.name+'. אם טעיתי, זה עוד שמור שלושים יום.');return true;}
window.__people=PEOPLE;
/* a person fact said any other way ("תזכור שהרואה חשבון הוא משה") also makes the card: when the subject is a role
   ("הרואה חשבון"), the value is the name */
function peopleFromFact(f){if(f.kind!=='person'||f.predicate!=='הוא')return null;const role=/^ה/.test(f.subject)&&f.value.split(' ').length<=2;
  const name=role?f.value:f.subject,rel=role?f.subject:f.value;if(name.split(' ').length>3)return null;return PEOPLE.upsert(name,{relation:rel}).then(p=>{lastPerson=p;return p;});}
