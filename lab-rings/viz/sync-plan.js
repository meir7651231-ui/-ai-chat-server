// מה לשלוח לזיכרון המשותף: רק טבלאות שאין עליהן מסמך עדיין (קיים — לא דורסים בלי גרסה)
const fs=require('fs'), path=require('path'); const dir=process.argv[2], out=process.argv[3];
const have=new Set(fs.readdirSync(dir).map(f=>f.replace('.json','')));
const writes=[]; for(const f of fs.readdirSync(process.argv[4]||'outbox2')){ const id=f.replace('.json',''); if(have.has(id)) continue;
  writes.push({op:'set',collection:'bricks',doc_id:id,file_path:path.resolve((process.argv[4]||'outbox2')+'/'+f)}); }
for(let i=0;i*50<writes.length;i++) fs.writeFileSync(out.replace('.json','-'+(i+1)+'.json'),JSON.stringify(writes.slice(i*50,i*50+50)));
console.log(writes.length,'to send in',Math.ceil(writes.length/50),'batches');
