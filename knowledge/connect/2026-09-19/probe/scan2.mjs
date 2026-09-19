// מיפוי · גרסה 2: מסירה הערות (// ו-/* */) לפני הסריקה, ומדווחת רק ליטרלים/רגקסים בעמדת-הכרעה
import fs from 'node:fs'; import path from 'node:path';
const HE=/[א-ת]/;
const files=[]; (function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git','legacy','archive'].includes(e.name))continue;const p=path.join(d,e.name);e.isDirectory()?w(p):/\.mjs$/.test(e.name)&&files.push(p);}})(process.argv[2]);
// מסיר הערות תוך שמירה על מספרי-שורה
function decomment(src){
  let out=''; let i=0; const n=src.length; let st='code';
  while(i<n){ const c=src[i], d=src[i+1];
    if(st==='code'){
      if(c==='/'&&d==='/'){st='line'; out+='  '; i+=2; continue;}
      if(c==='/'&&d==='*'){st='blk'; out+='  '; i+=2; continue;}
      if(c==='"'||c==="'"||c==='`'){st=c; out+=c; i++; continue;}
      if(c==='/'){ // אולי regex — נשמור כמו-שהוא
        out+=c; i++; continue; }
      out+=c; i++; continue;
    }
    if(st==='line'){ if(c==='\n'){st='code'; out+='\n';} else out+=' '; i++; continue; }
    if(st==='blk'){ if(c==='*'&&d==='/'){st='code'; out+='  '; i+=2;} else {out+=(c==='\n'?'\n':' '); i++;} continue; }
    // בתוך מחרוזת
    if(c==='\\'){ out+=c+(src[i+1]||''); i+=2; continue; }
    out+=c; if(c===st) st='code'; i++; continue;
  }
  return out;
}
const DEC=[[/===\s*$/,'==='],[/!==\s*$/,'!=='],[/\.includes\(\s*$/,'.includes('],[/\.has\(\s*$/,'.has('],[/\.startsWith\(\s*$/,'.startsWith('],[/\.endsWith\(\s*$/,'.endsWith('],[/\.test\(\s*$/,'.test('],[/\.match\(\s*$/,'.match('],[/\.split\(\s*$/,'.split('],[/\.indexOf\(\s*$/,'.indexOf(']];
const rows=[];
for(const f of files){
  const clean=decomment(fs.readFileSync(f,'utf8'));
  clean.split('\n').forEach((line,i)=>{
    if(!HE.test(line))return;
    // מערך/סט של ליטרלים עבריים
    const arr=[...line.matchAll(/(?:new Set\(\s*)?\[[^\[\]]*\]/g)].filter(m=>HE.test(m[0])&&(m[0].match(/['"][^'"]*[א-ת][^'"]*['"]/g)||[]).length>=2);
    for(const m of arr) rows.push({f,line:i+1,op:'רשימה',lit:m[0].slice(0,140),text:line.trim().slice(0,170)});
    for(const m of line.matchAll(/(['"])((?:(?!\1)[^\\]|\\.)*)\1/g)){
      if(!HE.test(m[2]))continue; const before=line.slice(0,m.index);
      for(const [re,name] of DEC) if(re.test(before)){rows.push({f,line:i+1,op:name,lit:m[2],text:line.trim().slice(0,170)});break;}
    }
    for(const m of line.matchAll(/\/((?:[^/\\\n\s]|\\.)(?:[^/\\\n]|\\.)*)\/[gimsuy]*/g)){
      if(!HE.test(m[1]))continue; rows.push({f,line:i+1,op:'regex',lit:m[0].slice(0,120),text:line.trim().slice(0,170)});
    }
  });
}
console.log(JSON.stringify(rows));
