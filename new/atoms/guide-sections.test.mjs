import { GUIDE_SECTIONS } from './guide-sections.mjs';
let f = 0;
const check = (msg, cond) => {
  if (!cond) {
    console.error(`✗ ${msg}`);
    f = 1;
  }
};
// 1. תשע שורות בדיוק
check('9 שורות בדיוק', GUIDE_SECTIONS.length === 9);
// 2. ראשונה: בית, בלי module/term
const first = GUIDE_SECTIONS[0];
check("ראשונה 'בית' בלי module/term", first.title === 'בית' && !('module' in first) && !('term' in first));
// 3. אחרונה: הגדרות, בלי module
check("אחרונה 'הגדרות' בלי module", GUIDE_SECTIONS[8].title === 'הגדרות' && !('module' in GUIDE_SECTIONS[8]));
// 4. בדיוק 2 שורות families — 'משפחות' (term) + 'כרטיס משפחה' (בלי term)
const fams = GUIDE_SECTIONS.filter((s) => s.module === 'families');
check('בדיוק 2 שורות families', fams.length === 2);
check("'משפחות' עם term='nav.families'", fams[0].title === 'משפחות' && fams[0].term === 'nav.families');
check("'כרטיס משפחה' בלי term", fams[1].title === 'כרטיס משפחה' && !('term' in fams[1]));
// 5. ‏7 עם module · 6 עם term · העמודות המבודדות
check('7 שורות עם module', GUIDE_SECTIONS.filter((s) => s.module).length === 7);
check('6 שורות עם term', GUIDE_SECTIONS.filter((s) => s.term).length === 6);
check('קופות צדקה = nav.tzedaka', GUIDE_SECTIONS.find((s) => s.module === 'tzedaka')?.term === 'nav.tzedaka');
check('חנות = nav.shop', GUIDE_SECTIONS.find((s) => s.module === 'shop')?.term === 'nav.shop');
// צילום-ערך (ratchet — נוסח-הלגאסי זהה-ביט): גיבוב פשוט של ה-JSON
const json = JSON.stringify(GUIDE_SECTIONS);
check('צילום: אורך-JSON יציב', json.length === 1140);
check(
  "צילום: נוסח-הלגאסי בשורת-הבית",
  GUIDE_SECTIONS[0].text === 'תקציר הבוקר, "דורש טיפול" (המשימות שלך), חדרים חיים וגרפים.',
);
if (f) process.exit(1);
console.log('✓ guide-sections: 5 דוגמאות-חוזה + צילום-ערך — ירוק');
