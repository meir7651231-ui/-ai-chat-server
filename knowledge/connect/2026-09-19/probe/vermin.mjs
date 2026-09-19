// ורמינהו על ארבעת ה«אין» של גל w-ivrit-kasha — לפנקס של הישיבה, לא לפרוזה.
process.env.YESHIVA_LEDGER_CAP = '500000';
import fs from 'node:fs';
const G = '../../../../machtzev/generator/';
const { rminhu, pliga, lo, reported } = await import('../../../../yeshiva/rminhu.mjs');
const SPL = JSON.parse(fs.readFileSync(G+'spec-lang.data.json','utf8'));
const NLL = JSON.parse(fs.readFileSync(G+'nl-lang.data.json','utf8'));
const LEX = JSON.parse(fs.readFileSync(G+'knowledge/lexicon.json','utf8'));
const has = (arr, w) => (arr||[]).some(x => String(x).includes(w) || w.includes(String(x)));
const SPL_KEYS = Object.keys(SPL).filter(k=>!k.startsWith('_'));

// ─ 1 · «למעלה מ» — יש לו בית בדאטה?
rminhu({ engine: 'w-ivrit-kasha', always: true,
  matter: 'מילת-השוואה «למעלה מ» — האם מוצהרת באיזשהו מקור-דאטה שהמחולל קורא?',
  searched: ['spec-lang.amountAbove','spec-lang.amountBelow','spec-lang.rangeWords','nl-lang (כל המפתחות)','generator/capability.mjs:15 REL[0].re'],
  rulings: [
    { src: 'machtzev/generator/spec-lang.data.json:amountAbove', verdict: 'פליגא',
      why: `מצהיר ${JSON.stringify(SPL.amountAbove)} — «מעל» ו«יותר מ» כן, «למעלה מ» ${has(SPL.amountAbove,'למעלה')?'כן':'לא'}; זה המקור הנכון אך הרשימה בו חסרה, ולכן הפער הוא בדאטה ולא במנוע` },
    { src: 'machtzev/generator/spec-lang.data.json:amountBelow', verdict: 'לא שייך',
      why: `מצהיר ${JSON.stringify(SPL.amountBelow)} — צד-המטה של ההשוואה; «למעלה מ» אינו שייך לצד הזה בכלל` },
    { src: 'machtzev/generator/nl-lang.data.json', verdict: 'לא שייך',
      why: `מפתחותיו (${Object.keys(NLL).filter(k=>!k.startsWith('_')).join(',')}) הם פיגום-שפה וסימני-שדה — אין בו מפתח-השוואה כלל` },
    { src: 'machtzev/generator/capability.mjs:15 (REL[0].re)', verdict: 'חד שיעורא',
      why: 'הרגקס בקוד כולל «למעלה\\s*מ» וגם «חורג» — כלומר המילה **מובנת** בריפו, אך בתוך מנוע ולא בדאטה; מדוד: detectAlertClause("כאשר המלאי למעלה מ-5") ⇒ op ">" בעוד goalPsak על אותו משפט ⇒ cmp ∅' },
  ] });

// ─ 2 · STOP של read.mjs — יש לו בית בדאטה?
const STOPW = ['את','של','על','עם','או','אם','כי','לא','כן','זה','זו','יש','אין','מה','מי','גם','רק','כל','עוד','כבר','בלי','עד','מול','ועד','ולא','הוא','היא','הם','לפי','בין','אחרי','לפני','מתי','איך','למה','אז','אבל'];
const inLead = STOPW.filter(w=>(NLL.leadins||[]).includes(w));
rminhu({ engine: 'w-ivrit-kasha', always: true,
  matter: `רשימת-העצירה STOP (yeshiva/read.mjs:19 · ${STOPW.length} מילים עבריות בקוד) — יש לה מקור-דאטה?`,
  searched: ['nl-lang.leadins','nl-lang.fieldMarks','nl-lang.listConj','nl-lang.eachWords','spec-lang (58 מפתחות)','knowledge/lexicon.json','generator/retrieve-screen.mjs:16'],
  rulings: [
    { src: 'machtzev/generator/nl-lang.data.json:leadins', verdict: 'פליגא',
      why: `מכיל ${inLead.length} מתוך ${STOPW.length} מילות-STOP (${inLead.join('/')}) — חופף חלקית ולכן אינו הבית: העברה אליו הייתה משנה גם את פיגום-ה-NL, ו-${STOPW.length-inLead.length} מילים נשארות בלי מקור` },
    { src: 'machtzev/generator/spec-lang.data.json', verdict: 'לא שייך',
      why: `כל ${SPL_KEYS.length} מפתחותיו הם דקדוק-אפיון (סימני-מקטע · רמזי-טיפוס · מילות-חלקיק) — אין בו מפתח למילות-עצירה של טקסט-חופשי` },
    { src: 'machtzev/generator/knowledge/lexicon.json', verdict: 'לא שייך',
      why: `${Object.keys(LEX).filter(k=>!k.startsWith('_')).length} מילות-חלק ⇒ תפקיד-צורני (button/textfield/…) — זהו לקסיקון-רכיבים, לא לקסיקון-דקדוק; מילת-עצירה אין לה תפקיד-רכיב` },
    { src: 'machtzev/generator/retrieve-screen.mjs:16', verdict: 'פליגא',
      why: 'רשימת-עצירה **שנייה** בקוד (20 מילים, חופפת חלקית ושונה בנוסח: «צריכ»/«גמ» מנורמלות) — שני מקורות לאותו דבר הם שתי אמיתות (L111), ולכן אינה בית אלא ראיה נוספת לפער' },
  ] });

// ─ 3 · שלילה במילת-השוואה
rminhu({ engine: 'w-ivrit-kasha', always: true,
  matter: 'שלילה בביטוי-השוואה («לא יותר מ-5») — יש מקור שמצהיר אותה?',
  searched: ['spec-lang (58 מפתחות)','nl-lang','yeshiva/read.mjs:STOP','generator/capability.mjs REL'],
  rulings: [
    { src: 'machtzev/generator/spec-lang.data.json (58 מפתחות)', verdict: 'לא שייך',
      why: `אין מפתח-שלילה באף אחד מ-${SPL_KEYS.length} המפתחות (amountAbove/amountBelow/rangeWords הם צדדים, לא שלילה) — ולכן אין מה לקרוא` },
    { src: 'yeshiva/purpose.mjs:307 (head.trim().endsWith(x))', verdict: 'פליגא',
      why: 'המבחן הוא endsWith על הרישא, ולכן «לא יותר מ-» **מסתיים** ב«יותר מ-» ונקרא כ«מעל» — לא רק שאינו מבין שלילה, הוא הופך את המשמעות בשקט; מדוד: goalPsak("…לא יותר מ-5 יחידות") ⇒ cmp=מעל' },
    { src: 'machtzev/generator/capability.mjs:15-16 (REL)', verdict: 'פליגא',
      why: 'שני הרגקסים בודקים נוכחות-מילה ללא הקשר-שלילה; «לא נמוך מ» היה נקרא «<» — אותה מחלקת-תקלה, מנוע שני, ולכן אינו מקור-פתרון אלא עותק-של-הבעיה' },
  ] });

// ─ 4 · פועל-מטרה בצורה נטויה
rminhu({ engine: 'w-ivrit-kasha', always: true,
  matter: 'פועל-מטרה שאינו שם-פועל («שלח» · «שולחת» · «נשלח») — יש מקור-דאטה שמצהיר צורות-פועל?',
  searched: ['spec-lang.createVerbs','spec-lang.pAct','spec-lang.pastSuffix/pastMinLen','knowledge/lexicon.json','nl-lang.leadins'],
  rulings: [
    { src: 'machtzev/generator/spec-lang.data.json:createVerbs', verdict: 'פליגא',
      why: `מצהיר ${JSON.stringify(SPL.createVerbs)} — ארבעה ציוויים אמיתיים, אך הם נקראים רק ב-entity.mjs:61 וב-hamtzaa.mjs:131; yeshiva/purpose.isGoalVerb אינו קורא אותם כלל, ולכן הבית קיים והדייר לא נכנס` },
    { src: 'machtzev/generator/spec-lang.data.json:pastSuffix/pastMinLen', verdict: 'פליגא',
      why: `מצהיר "${SPL.pastSuffix}"/${SPL.pastMinLen} = מבחן-לשון-עבר מבני; נקרא רק ב-balagan.mjs:396 (Dart), ולא בשלב-ה-NL — מקור קיים, צרכן אחד בלבד` },
    { src: 'machtzev/generator/spec-lang.data.json:pAct', verdict: 'לא שייך',
      why: `${JSON.stringify(SPL.pAct)} — מילת-**צורת**-חלקיק (כותרת-מקטע), לא צורת-פועל; אינה עונה על נטיית-פועל בכלל` },
    { src: 'machtzev/generator/knowledge/lexicon.json', verdict: 'לא שייך',
      why: 'מילת-חלק ⇒ תפקיד-רכיב (button/switch/…); אין בו אף צורת-פועל נטויה, ולכן אינו מקור לזיהוי פועל בטקסט-חופשי' },
    { src: 'machtzev/generator/nl-lang.data.json:leadins', verdict: 'פליגא',
      why: 'כולל צורות-פועל נטויות («שמנהלת»/«שמכיל»/«רוצה») אך מצהיר אותן כ**פיגום שיש להתעלם ממנו**, ההפך מתביעה — שימוש בו כמקור-פועל היה הופך את משמעותו' },
  ] });

console.log('ledger:', JSON.stringify(reported()));
