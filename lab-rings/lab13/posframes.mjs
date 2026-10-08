// מסגרות «מקום» לרשימות — שלד שכתבנו; מה שנכנס לחריצים — המכונה בוחרת מהמדף לפי הדוגמאות:
//   A. סינון-לפי-מקום: הולכים על הרשימה עם מונה-מקום (מההתחלה, או מהסוף), ולכל איבר מריצים תנאי-מספר על המקום (לא על הערך).
//      «קח 3 ראשונים» = השאר רק מקום ש[מקום: 0,1,2] · «בלי האחרון» = הוצא מקום-מהסוף ש[אפס?] · «כל איבר שני» = השאר מקום ש[זוגי?].
//   B. על-כל-זנב: לכל איבר — מריצים כלי-רשימה מהמדף על מה שבא אחריו (הזנב). «קצוות לסירוגין» = [הפוך רשימה] על כל זנב.
//   C. סובב-אל: כלי רשימה⇒מספר מהמדף בוחר איבר, והרשימה מסובבת כך שהוא ראשון. «סיבוב שמאלה» = סובב אל [השני ברשימה].
// תאים: 3 = «חוליה» (הכתובת שבה כתוב האיבר הנוכחי), 4 = האיבר, 5 = מונה/ערך, 6 = עזר. מצב המסגרת נשמר במחסנית סביב כלי מהמדף.
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
// שומר-תאים: כלי בחריץ שנוגע בתאי-המסגרת או בתאי-הרשימה (1, 8..15) — התאים האלה נשמרים במחסנית סביבו. «לאן מהמחסנית» ⇒ כולם.
const LISTC=[1,8,9,10,11,12,13,14,15]; export const guardCells=(p,frame=[])=>{ const u=usedC(p), any=p.some(x=>x[0]==='WHERE@'); return [...new Set([...frame,...LISTC])].sort((a,b)=>a-b).filter(c=>any||u.has(c)); };
// הרכבה עם תוויות (כמו ב-filtcomp): 'שם' = תווית, ['J','שם'] = קפוץ-אם-לא-אפס, {code} = כלי מהמדף שמוזז למקומו
export function assemble(parts){ const out=[], lab={}, fix=[]; for(const x of parts){ if(typeof x==='string'){ lab[x]=out.length; continue; } if(x.code){ out.push(...shift(x.code,out.length)); continue; } if(x[0]==='J'){ fix.push([out.length,x[1]]); out.push(null,['JUMP']); continue; } out.push(x); }
  for(const [i,l] of fix){ if(lab[l]==null) throw new Error('תווית חסרה '+l); out[i]=['WHERE',lab[l],'code']; } return out; }
const T=(c)=>[['WHERE',c],['GO'],['TAKE']], P=(c)=>[['WHERE',c],['GO'],['PUT']];
const AT=(c)=>[...T(c),['WHERE@'],['GO']];               // P ⇐ mem[c]  (לך לכתובת שבתא)
const PUSH15=[...T(4),['TAKE'],['CALC'],['TAKE'],['CALC']];   // לא-וגם(לא x, x) = 15 תמיד
const PUSH1=[...PUSH15,['SHR'],['SHR'],['SHR']], PUSH0=[...PUSH15,...PUSH15,['CALC']];
const GOTO=(l)=>[...PUSH15,['J',l]];
// קפוץ אם תא a ≠ תא b  (XOR מלא-וגם: t=לא-וגם(a,b); לא-וגם(לא-וגם(a,t), לא-וגם(b,t)))
const JNE=(a,b,l)=>[...T(a),...T(b),['CALC'],...P(6),...T(a),...T(6),['CALC'],...T(b),...T(6),['CALC'],['CALC'],['J',l]];
const Z={code:[['WHERE',0],['GO']]};

// A. סינון-לפי-מקום. cond: קורא תא 0 (המקום), עונה בתא 2. remove: תשובה ≠0 ⇒ הוצא (אחרת: ⇒ השאר). fromEnd: המקום נספר מהסוף (האחרון = 0).
export function posFilterFrame(cond,remove,fromEnd=false){ const save=guardCells(cond,[3,4,5]); const pre=save.flatMap(c=>T(c)), post=[...save].reverse().flatMap(c=>P(c));
  const STEP=[...T(5),...(fromEnd?PUSH15:PUSH1),['ADD'],...P(5)];
  const init=fromEnd?[...PUSH15,...P(5),...T(1),...P(4),'LEN',...T(4),['J','LENB'],...GOTO('LEND'),
      'LENB',...T(5),...PUSH1,['ADD'],...P(5),...AT(4),['TAKE'],...P(4),...GOTO('LEN'),'LEND']   // מונה = האורך פחות 1
    :[...PUSH0,...P(5)];
  return assemble([...init, ...PUSH1,...P(3),
    'LOOP', ...AT(3),['TAKE'],...P(4), ...T(4),['J','BODY'], ...GOTO('EXIT'),
    'BODY', ...pre, ...T(5),...P(0), Z, {code:cond}, ...post, ...T(2),['J',remove?'UNLINK':'ADV'], ...GOTO(remove?'ADV':'UNLINK'),
    'ADV', ...T(4),...P(3), ...STEP, ...GOTO('LOOP'),
    'UNLINK', ...AT(4),['TAKE'], ...AT(3),['PUT'], ...STEP, ...GOTO('LOOP'),
    'EXIT']); }

// B. על-כל-זנב: tool = כלי רשימה⇒רשימה (בטוח-לשרשרת). fromHead: מתחילים מהזנב שאחרי הראשון; אחרת — גם על כל הרשימה בהתחלה.
export function suffixMapFrame(tool,fromHead=true){ return assemble([
    ...(fromHead?[...T(1),...P(3), ...T(3),['J','LOOP'], ...GOTO('EXIT')]:[...PUSH1,...P(3)]),
    'LOOP', ...AT(3),['TAKE'],['J','BODY'], ...GOTO('EXIT'),
    'BODY', ...T(3), ...T(1), ...AT(3),['TAKE'],...P(1), Z, {code:tool},     // במחסנית: [חוליה, ראש]; הזנב הופך לרשימה
    ...T(1),...P(0),...P(1),...P(3), ...T(0),...AT(3),['PUT'],              // mem[חוליה] ⇐ ראש-הזנב-החדש; הראש המקורי חוזר
    ...T(0),...P(3), ...GOTO('LOOP'),
    'EXIT']); }

// C. סובב-אל: pick = כלי רשימה⇒מספר (בטוח-לשרשרת), התשובה בתא 2 = האיבר שיהיה ראשון. לא ברשימה / כבר ראשון ⇒ בלי שינוי.
export function rotateToFrame(pick){ return assemble([ Z, {code:pick}, ...T(2),...P(5),
    ...T(1),['J','H'], ...GOTO('EXIT'),
    'H', ...JNE(1,5,'S'), ...GOTO('EXIT'),
    'S', ...T(1),...P(3),
    'FIND', ...AT(3),['TAKE'],...P(4), ...T(4),['J','N1'], ...GOTO('EXIT'),
    'N1', ...JNE(4,5,'NX'), ...GOTO('LAST'),
    'NX', ...T(4),...P(3), ...GOTO('FIND'),
    'LAST', ...AT(4),['TAKE'],['J','LN'], ...GOTO('DONE'),
    'LN', ...AT(4),['TAKE'],...P(4), ...GOTO('LAST'),
    'DONE', ...T(1),...AT(4),['PUT'], ...T(5),...P(1), ...PUSH0,...AT(3),['PUT'],
    'EXIT']); }

// ניקוי: תאי 8..15 שאינם ברשימה ⇐ 0 (כמו בקלט רגיל). לכל c מ-8 עד 15 הולכים על הרשימה; לא נמצא ⇒ mem[c]=0. (תאים 0,2,6)
export function cleanNonList(){ return assemble([ ...PUSH15,['SHR'],...P(2), ...T(2),...T(2),['CALC'],...P(2),
    'OUT', ...T(1),...P(0),
    'IN', ...T(0),['J','NZ'], ...GOTO('NF'),
    'NZ', ...JNE(0,2,'NQ'), ...GOTO('FD'),
    'NQ', ...AT(0),['TAKE'],...P(0), ...GOTO('IN'),
    'NF', ...PUSH0, ...AT(2),['PUT'],
    'FD', ...T(2),...PUSH1,['ADD'],...P(2), ...T(2),['J','OUT'] ]); }

// D. «אם»: pick = כלי רשימה⇒מספר (בטוח-לשרשרת); op = פעולה חד-מקומית (קוראת תא 0, עונה בתא 2) או null; tool = צעד רשימה⇒רשימה.
//    neg: מריצים את הצעד כשהתשובה = 0 (במקום ≠0).
export function ifFrame(pick,op,tool,neg=false){ const sv=op?guardCells(op):[]; return assemble([ Z, {code:pick}, ...(op?[...T(2),...P(0),...sv.flatMap(c=>T(c)),Z,{code:op},...[...sv].reverse().flatMap(c=>P(c))]:[]),
    ...T(2),['J',neg?'END':'THEN'], ...GOTO(neg?'THEN':'END'),
    'THEN', Z, {code:tool},
    'END' ]); }
