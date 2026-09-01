/** אטום-דאטה · guide-recipe-swaps — מילון-ההחלפות של "המתכונים המהירים" (guide.ts:124-132).
 *  הסדר הוא המשמעות (כל החלפה על תוצאת קודמתה). שורה: [from, קידומת, מפתח-termOf, fallback, סיפא]. */
export const RECIPE_SWAPS = [
  ['ליד השיבוץ', 'ליד ה', 'entity.enrollment', 'שיבוץ', ''],
  ['כדי שיבוץ', 'כדי ', 'entity.enrollment', 'שיבוץ', ''],
  ['משפחה חדשה', '', 'entity.family', 'משפחה', ' חדשה'],
  ['חוג מתאים', '', 'entity.course', 'חוג', ' מתאים'],
  ['מצא חוג', 'מצא ', 'entity.course', 'חוג', ''],
  ['החוג', 'ה', 'entity.course', 'חוג', ''],
  ['למורה', 'ל', 'entity.teacher', 'מורה', ''],
  ['← ＋ תרומה', '← ＋ ', 'entity.donation', 'תרומה', ''],
  ['תרומה ←', '', 'entity.donation', 'תרומה', ' ←'],
];
