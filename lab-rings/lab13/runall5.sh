#!/bin/bash
# סבב שלישי: עד שהמנוע אומר «סיימתי» — כל לבנה רצה עד שני מחזורים שלמים בלי שיפור (לכל היותר 40 דקות ללבנה).
cd "$(dirname "$0")"
for n in "ספור גדולים מ-X" "חפש ברשימה" "הקטן ברשימה" "גדול מ-" "מיין רשימה" "קטן מ-" "מינימום" "מקסימום" "אורך רשימה (לולאה + ספירה)" "שווה (מספרים)" "הגדול ברשימה" "הפוך רשימה" "סכום רשימה" "חיסור" "ועוד 2" "ועוד 1" "שונה (מספרים)"; do
  f="lm5-$(echo "$n" | tr ' ()' '___').json"
  echo "=== $n ==="; node loopmin3.mjs "$n" "$f" 0.67
done
# מכניסים למדף, בודקים, שומרים
node -e '
const fs=require("fs"); const sh=JSON.parse(fs.readFileSync("shelf3.json")); let a=0,b=0;
for(const x of sh.named){ const f="lm5-"+x.name.replace(/[ ()]/g,"_")+".json"; if(!fs.existsSync(f)) continue; const p=JSON.parse(fs.readFileSync(f)); a+=x.prog.length; if(p.length<x.prog.length){ console.log("מדף:",x.name,x.prog.length,"→",p.length); x.prog=p; x.by=(x.by||"")+" · סבב 4 (מכונה קפדנית)"; } b+=x.prog.length; }
console.log("סך הלבנים בסבב:",a,"→",b); fs.writeFileSync("shelf3.json",JSON.stringify(sh));'
node audit3s.mjs
echo "=== הכל נגמר ==="
