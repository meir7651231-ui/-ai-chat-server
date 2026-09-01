/** חוט · pick-look — בחירת מזהה-מראה ממשפט לפי מילון-סיגנלים (שכבה E · בחירת-המחולל).
 *  שקעים בלבד: המילון מוזרק (חוק-1). מפתח שמתחיל ב-'_' = הערה, מדולג.
 *  משפט בלי סיגנל ⇒ null ⇒ הקופסה נופלת לברירת-המחדל (פלט ביט-זהה). חוזה: pick-look.contract.md */
export function pickLook(text, looks) {
  if (!text || !looks) return null;
  for (const word in looks) {
    if (word[0] !== '_' && text.includes(word)) return looks[word];
  }
  return null;
}
