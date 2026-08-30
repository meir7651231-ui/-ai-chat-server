/** קופסת-חיבורים · ערכה — מחווטת תפקיד⇒פיגמנט. חוזה: theme.contract.md
 *  התפקידים חיים כאן (שקעים), לא באטומים. מצב-לילה = תוכנית-חיווט שנייה. */
import { PALETTE } from '../atoms/palette.mjs';
import { THEME_TERMS } from '../atoms/theme-terms.mjs';
import { WIRING } from '../atoms/theme-wiring.mjs';

// ── מיפוי תפקיד⇒פיגמנט חי כדאטה באטום theme-wiring (הכרעה 19) ──
export { WIRING };


/** מרכיב CSS מלא למצב נתון; overrides = כפתור-הצבע: { pigmentKey: ערך-חדש }. */
export function cssFor(mode, overrides = {}) {
  const plan = WIRING[mode];
  if (!plan) throw new Error(THEME_TERMS.k1 + mode);
  const pal = { ...PALETTE, ...overrides };
  const missing = Object.values(plan).filter(k => !(k in pal));
  if (missing.length) throw new Error(THEME_TERMS.k2 + missing.join(','));
  return THEME_TERMS.k47 + Object.entries(plan).map(([role, k]) => '  ' + role + ': ' + pal[k] + ';').join('\n') + '\n}';
}
