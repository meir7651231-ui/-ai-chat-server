/** מחצב · lib-ts — פותר-typescript אחד לכל הכלים (c1 של PROTOCOL §12).
 *  סדר: machtzev/node_modules (vendored, package.json) ⇒ מאור-השכן (מורשת) ⇒ אין.
 *  L34: כלי חסר אינו הפרת-חוק — requireTs() יוצא exit 2 עם `tool=typescript`,
 *  לא קורס (exit 1 = אדום-כוזב). police.mjs (c2) ממיין 2 כ-yellow:tool. */
import { createRequire } from 'node:module';
const tryReq = (base) => { try { return createRequire(base)('typescript'); } catch { return null; } };
export const ts = tryReq(import.meta.url) ?? tryReq('/home/user/maor-system/');
export function requireTs() {
  if (ts) return ts;
  console.error('🟡 YELLOW tool=typescript — חסר. התקן: npm ci --prefix machtzev (L34: אין-כלי ≠ כשל)');
  process.exit(2);
}
