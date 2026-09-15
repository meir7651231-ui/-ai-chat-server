/* build-index.mjs — עמוד הריכוז של כל המסכים שהועתקו במדידה.
   הרצה: node gen/looks/build-index.mjs                                       */
import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));

const S = [
 { d:'search', site:'Airbnb', comp:'שורת חיפוש מפולחת', screen:'חיפוש משפחות',
   num:['מוט 66 · רדיוס 100','מקטע r32 · כפתור 48','הסרגל כולו מאפיר כשמקטע פעיל'],
   dev:['נלקחה שורת החיפוש בלבד — רשת הכרטיסים הוסרה'] },
 { d:'buybox', site:'Amazon', comp:'קופסת ההחלטה', screen:'תיק משפחה',
   num:['מחיר 28/30 + אגורות 13','כפתורים r100 בגובה 32','#ffd814 · #ffa41c'],
   dev:['תג ההנחה #b12704 אינו מתבהר בכהה — נושא טקסט לבן'] },
 { d:'nochah', site:'Twitch', comp:'פס נוכחות', screen:'בית המדרש עכשיו',
   num:['שורה 45 · צמודות, אפס רווח','אווטאר 30 · נקודה #eb0400 בקוטר 8','מכווץ ל-60'],
   dev:['שלוש קבוצות במקום שתיים — למוסד יש אחריות משותפת'] },
 { d:'vaada', site:'Stack Overflow', comp:'תעלת פסיקה', screen:'ועדת הלוואות',
   num:['תעלה 57 נעולה','✓ 36×36 · #18864b','גוף משתנה: 121/121/121/159'],
   dev:['חצי ההצבעה הוסרו — אין קהל, ואין מצביעים על בקשה'] },
 { d:'hechzer', site:'GOV.UK', comp:'שחזור משגיאה', screen:'החזר כספי',
   num:['סיכום גבול 5px #ca3535','מיקוד צהוב #ffdd00 אומת חי','אפס רדיוס בכל 9 הרכיבים'],
   dev:['שלושת הכללים הם של האפיון, לא שלי'] },
 { d:'erech', site:'ויקיפדיה עברית', comp:'ערך ותיבת מידע', screen:'תיק משפחה כערך',
   num:['גוף 16/26 · גופן מערכת','תיבה 304 · #f9f9f9','14 הפניות · 7 מקורות'],
   dev:['הפסקה נקצצה ל-660: במקור 93 תווים בשורה, מעל טווח הקריאה'] },
 { d:'sulam', site:'WikiTree', comp:'סולם דורות', screen:'עץ האחריות',
   num:['כרטיס 237 · r6','רוחב יורד 290→237→210→196→178','שורות 4→2→1→1→1'],
   dev:['הגוון מסמן תחום ולא מין','44 משבצות מיושרות שורה-מול-שורה, 0 סטיות'] },
 { d:'tavla', site:'Atlassian', comp:'טבלה דינמית', screen:'אנשים · 912 רשומות',
   num:['שורה 48 · כותרת 653 12/16','אפס קו בין שורות','טעינה: 20% שקיפות'],
   dev:['מחיקה אסורה באפיון ⇒ סימון «עזב». המיקוד אחריו אומת'] },
 { d:'grafa', site:'Our World in Data', comp:'גרף קו', screen:'תקציב מול ביצוע',
   num:['רשת #dddddd מקווקו 4,4','קו אפס #999999 מלא','6 הילות מול 6 סדרות'],
   dev:['צבע התווית מחושב עד 4.5 — במקור לא נמדד'] },
 { d:'agora', site:'Stripe', comp:'תיעוד API', screen:'אובייקט החיוב',
   num:['שם שדה Source Code Pro 700 14/20','כל 13 הערכים שלמים','אגורות · נקודות בסיס'],
   dev:['הסחיפה נמדדה 0 — הרווח הוא בפריסה: 820 ₪ מול 1.80 ₪'] },
 { d:'tor', site:'Cal.com', comp:'בורר יום ושעה', screen:'תיאום קוויטל',
   num:['תא 59×59 · r8 · רווח 4','משבצת 36 · r10 · רווח 8','פנוי 500 · סגור 300'],
   dev:['12h/24h הוחלף בעברי/לועזי','יום השבוע נגזר מהמחסן, לא מהנחה'] },
 { d:'diyun', site:'Hacker News', comp:'שרשור תגובות', screen:'דיון ועדת הנחות',
   num:['הזחה 40 בכל רמה','אפס מסגרות ורקעים','37 קישורי ניווט, כולם תקפים'],
   dev:['12px⇒15/23 · כפתור 12⇒28','ההצנעה נגזרת מסמכות, לא מהצבעות'] },
 { d:'sefer', site:'ספריא', comp:'מקור ופירוש', screen:'ספר האפיון',
   num:['26.84/42.944 מול 22/35.2','יחס 1.22 בגודל ובשורה','אותה עמודה, רוחב 700'],
   dev:['לא הצלחתי לצלם את המקור נקי — שלושה ניסיונות'] },
];

const escRaw = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
/* הסולמית היא תו ניטרלי, וב-RTL היא נודדת לקצה הלא-נכון של קוד-הצבע.
   כל אסימון לטיני/מספרי נעטף ב-bdi עם כיוון מפורש.                    */
const esc = (s) => escRaw(s)
  .replace(/#[0-9a-fA-F]{3,8}\b/g, m => `<bdi dir="ltr">${m}</bdi>`)
  .replace(/\b\d+(?:\.\d+)?(?:px|%|KB)?\/\d+(?:\.\d+)?(?:px)?\b/g, m => `<bdi dir="ltr">${m}</bdi>`)
  .replace(/\b\d+×\d+\b/g, m => `<bdi dir="ltr">${m}</bdi>`)
  .replace(/\b(?:12h|24h|r\d+|\d+px)\b/g, m => `<bdi dir="ltr">${m}</bdi>`);
const kb = (d) => { const f = join(here, d, d + '.html');
  return existsSync(f) ? Math.round(statSync(f).size / 1024) : 0; };

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>שלושה עשר מסכים</title>
<meta name="description" content="שלושה עשר רכיבים שהועתקו במדידה מאתרים חיים, והותאמו למוסד.">
<style>
/* אין קישור לגופן — הממצא מוויקיפדיה העברית, מיושם. */
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 --bg:#fbfbfa;--pane:#ffffff;--ink:#1b1c1e;--mut:#5f6368;--hair:#e3e3e0;
 --acc:#1f5f3f;--warn:#8a4b1f;--col:1120px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#121314;--pane:#1a1c1e;--ink:#e9eaec;--mut:#a2a6ad;--hair:#2c2f33;
 --acc:#6cc394;--warn:#e0a26a}}
:root[data-theme=dark]{
 --bg:#121314;--pane:#1a1c1e;--ink:#e9eaec;--mut:#a2a6ad;--hair:#2c2f33;
 --acc:#6cc394;--warn:#e0a26a}
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 16px/25px system-ui,sans-serif}
h1,h2,h3{margin:0}p{margin:0}bdi{unicode-bidi:isolate}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--acc);outline-offset:3px;border-radius:6px}

.wrap{max-width:var(--col);margin:0 auto;padding:40px 22px 80px}
h1{font:600 34px/44px system-ui,sans-serif}
.lede{color:var(--mut);margin-top:10px;max-width:70ch}
.tot{display:flex;gap:26px;flex-wrap:wrap;margin:22px 0 0;padding:16px 0;
 border-block:1px solid var(--hair)}
.tot div b{display:block;font:600 24px/30px system-ui,sans-serif;
 font-variant-numeric:tabular-nums}
.tot div span{color:var(--mut);font-size:14px}
.ok{color:var(--acc)}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));
 gap:16px;margin-top:26px}
.card{background:var(--pane);border:1px solid var(--hair);border-radius:10px;
 padding:16px 18px 15px;display:flex;flex-direction:column;gap:9px}
.card:hover{border-color:var(--acc)}
.hd{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.hd b{font:600 17px/24px system-ui,sans-serif}
.hd .src{color:var(--mut);font-size:13.5px;margin-inline-start:auto;white-space:nowrap}
.comp{color:var(--mut);font-size:14px;line-height:21px}
ul{margin:0;padding:0;list-style:none;font-size:13.5px;line-height:20px}
ul li{padding-inline-start:13px;position:relative;color:var(--mut)}
ul li:before{content:"";position:absolute;inset-inline-start:0;top:8px;
 width:5px;height:5px;border-radius:50%;background:var(--hair)}
ul.dev li:before{background:var(--warn)}
ul.dev li{color:var(--ink)}
.ft{margin-top:auto;padding-top:9px;border-top:1px solid var(--hair);
 display:flex;justify-content:space-between;align-items:baseline;
 font-size:13px;color:var(--mut)}
.ft .go{color:var(--acc);font-weight:600}

.note{margin-top:34px;padding-top:20px;border-top:1px solid var(--hair);
 color:var(--mut);font-size:14.5px;line-height:23px;max-width:78ch}
.note b{color:var(--ink)}
.note p+p{margin-top:12px}
@media(max-width:560px){h1{font:600 26px/34px system-ui,sans-serif}}
</style></head><body>
<div class="wrap">

<h1>שלושה עשר מסכים</h1>
<p class="lede">כל אחד מהם לקח רכיב אחד מאתר חי אחד, <b>במדידה ולא בהערכה</b>, והתאים אותו למוסד. כל מספר בעמודים נגזר מן המחסן; כל סטייה מן המקור מסומנת.</p>

<div class="tot">
 <div><b>13</b><span>מסכים</span></div>
 <div><b>13</b><span>אתרים שנמדדו</span></div>
 <div><b class="ok">0</b><span>כשלי ניגודיות · שתי ערכות</span></div>
 <div><b class="ok">0</b><span>גלישה ב-360/390/768</span></div>
 <div><b class="ok">0</b><span>שגיאות קונסולה</span></div>
 <div><b>45</b><span>עמודים נסרקו · 26 נטענו</span></div>
</div>

<div class="grid">
${S.map(x => `<a class="card" href="${x.d}/${x.d}.html">
 <div class="hd"><b>${escRaw(x.screen)}</b><span class="src"><bdi>${escRaw(x.site)}</bdi></span></div>
 <p class="comp">${escRaw(x.comp)}</p>
 <ul>${x.num.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
 ${x.dev.length ? `<ul class="dev">${x.dev.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
 <p class="ft"><span><bdi dir="ltr">${x.d}.html</bdi> · <bdi>${kb(x.d)}KB</bdi></span><span class="go">פתיחה ←</span></p>
</a>`).join('\n')}
</div>

<div class="note">
 <p><b>איך זה נבנה.</b> לכל אתר: טעינה מלאה בדפדפן אמיתי, פסילה אוטומטית של עמוד שהוא חומת-הרשמה או DOM ריק, מדידה של הרכיב מה-DOM החי, בנייה, ואז ביקורת שמשווה את התוצאה למספרים שנמדדו. הנקודות הכתומות בכל כרטיס הן <b>סטיות מכוונות</b> — מקום שבו לא העתקתי, ומדוע.</p>
 <p><b>מה שלא הצליח.</b> כל זכות ו-gov.il חסומים מאחורי Cloudflare. GitHub, eBay, Zillow, OpenTable, Archive.org ו-OpenStreetMap לא נטענו. את פס-הזמן של יוטיוב לא ניתן לצלם — אין קודקים לווידאו בדפדפן הזה. את ספריא לא הצלחתי לצלם נקי בשלושה ניסיונות, ורק המדידה ניצלה. עמודי ההזמנה של Calendly החזירו 404, ולכן נמדד Cal.com במקומו.</p>
 <p><b>שלושה ממצאים על עברית.</b> האתר היחיד בסבב שנבנה לעברית — ויקיפדיה — הוא היחיד שאינו טוען גופן כלל. ספריא מציב עברית <b>גדולה ב-22%</b> מלטינית, ובדיוק אותו יחס ברווח-השורה. ובציר-זמן בגרף העברית אינה שונה: הזמן זורם שמאל→ימין, כמו בכל העיתונות הכלכלית בישראל.</p>
 <p><b>וממצא אחד על המערכת עצמה.</b> האפיון מחזיק <b>317 איסורים</b>. הקוד חוסם <b>4</b>, מציג <b>10</b>, ו-<b>303</b> קיימים בנייר בלבד. הרשימה המלאה, מסומנת שורה-שורה, נמצאת ב«ספר האפיון».</p>
</div>

</div></body></html>`;

writeFileSync(join(here, 'index.html'), html);
console.log('index.html · ' + S.length + ' מסכים · ' +
  S.reduce((a, x) => a + kb(x.d), 0) + 'KB בסך הכול');
