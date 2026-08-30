/** אטום-דאטה · heb-cal-data — כל הקבועים והשמות של הלוח העברי-לועזי במקום אחד.
 *  כאן — ורק כאן — גרה המשמעות: העוגן ("בריאה"), קבועי-המולד, כללי-הדחייה, השמות.
 *  המנגנונים (cycle-hit · lin-cycles · cycle-carry · step-postpone · span-correction · pick-name)
 *  עיוורים לחלוטין; קופסת-החיווט heb-cal-box מצמידה אותם לדאטה הזו — ושם נולד "לוח עברי".
 *  הערכים זהים ביט-אחר-ביט לאלגוריתם Dershowitz–Reingold שבתאום-ה-Dart heb-month-he.dart.
 *  חוזה: heb-cal-data.contract.md */
export function hebCalData() { return {
  anchor: -1373427,                                    // יום א׳-תשרי שנת א׳ על ציר-הימים הרציף
  approx: { a: 98496, b: 35975351 },                   // קירוב-תחתון שנה מתוך יום-רציף
  leap: { a: 7, b: 1, m: 19, t: 7 },                   // דין-העיבור במחזור י"ט
  months: { a: 235, b: 234, c: 19 },                   // חודשי-ירח שחלפו עד שנה
  carry: { base: 29, p0: 12084, q: 13753, parts: 25920 }, // המולד: יום־בסיס + חלקים (תתקל"ט)
  postpone: { m: 3, k: 7, t: 3 },                      // דחיית ראש-השנה
  span: { hi: 356, lo: 382 },                          // תיקון אורך-שנה (שלמה/חסרה)
  yearLens: { longMid: [355, 385], shortMid: [353, 383] }, // חשוון-מלא / כסלו-חסר
  shortMonths: [2, 4, 6, 10, 13],                      // חודשים קבועי-29
  flexLong: 8, flexShort: 9, leapFlex: 12,             // חשוון · כסלו · אדר
  monthsInLeap: 13, monthsInPlain: 12,
  shortLen: 29, longLen: 30,
  nisan: 1, tishrei: 7,
  names: ['ניסן', 'אייר', 'סיוון', 'תמוז', 'אב', 'אלול', 'תשרי', 'חשוון', 'כסלו', 'טבת', 'שבט', 'אדר', 'אדר ב׳'],
  leapName12: 'אדר א׳',
  greg: { yearDays: 365, c4: 4, c100: 100, c400: 400, mA: 367, mB: 362, mC: 12, leapAdj: -1, plainAdj: -2 },
}; }
export const HEB_CAL = hebCalData();
