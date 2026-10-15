// bricks.mjs - generic machine idioms for the compiler (Track B). No task knowledge: list walking, the stack as an output queue,
// relinking, list save/restore. Built only from greedylib bricks (moves, constants, compare, load/store through a cell).
import { T_, P_, MV, SET, INC, DEC, GOTO, JLT, JNE, JEQ, LOADAT, STOREAT, CONST, P15 } from '../greedylib.mjs';
export { T_, P_, MV, SET, INC, DEC, GOTO, JLT, JNE, JEQ, LOADAT, STOREAT, CONST, P15 };
let UID = 0; export const lab = (s) => `${s}_${++UID}`;
export const LISTC = [1, 8, 9, 10, 11, 12, 13, 14, 15];
export const PUSHK = (k) => [['WHERE', 0], ['GO'], ...CONST[k & 15]];
export const JNZ = (c, l) => [...T_(c), ['J', l]];
export const JZ = (c, l) => { const s = lab('jz'); return [...T_(c), ['J', s], ...GOTO(l), s]; };
export const NEXT = (X) => [...T_(X), ['WHERE@'], ['GO'], ['TAKE'], ...P_(X)];          // X ⇐ mem[X]
// pop the stack into cells 15..8,1 / push 1,8..15 : the list (head + all link cells) saved around destructive code
export const SAVEL = () => LISTC.flatMap((c) => T_(c));
export const RESTL = () => [...LISTC].reverse().flatMap((c) => P_(c));
// RELINK: the stack holds [.., 0, e1, .., ek] (ek on top) ⇒ chain e1→..→ek at cell 1 (sentinel 0 consumed). Cells E, NX scratch.
export function RELINK(E, NX) { const L = lab('rl'), D = lab('rd');
  return [...SET(NX, 0), L, ...P_(E), ...JZ(E, D), ...STOREAT(E, NX), ...MV(E, NX), ...GOTO(L), D, ...MV(NX, 1)]; }
// CANON: every cell 8..15 that is not on the chain ⇐ 0 (the memory a fresh example has). Order and links unchanged.
export function CANON(X, E, NX) { const L = lab('cn'), D = lab('cd');
  return [...PUSHK(0), ...MV(1, X), L, ...JZ(X, D), ...T_(X), ...NEXT(X), ...GOTO(L), D, ...[8, 9, 10, 11, 12, 13, 14, 15].flatMap((c) => SET(c, 0)), ...RELINK(E, NX)]; }
// scan: for each element (X = value = its cell), I = index (if I given), PRV = previous element (0 first), NXT = next element (0 last)
//   body(ctx) ⇒ code; ctx.cont = label of the step to the next element; ctx.brk = label after the loop
export function scan({ X, I = null, PRV = null, NXT = null, H = 1 }, body) { const L = lab('sc'), C = lab('sn'), D = lab('sd');
  const pre = [...MV(H, X), ...(I != null ? SET(I, 0) : []), ...(PRV != null ? SET(PRV, 0) : [])];
  const top = [L, ...JZ(X, D), ...(NXT != null ? [...T_(X), ['WHERE@'], ['GO'], ['TAKE'], ...P_(NXT)] : [])];
  const step = [C, ...(PRV != null ? MV(X, PRV) : []), ...NEXT(X), ...(I != null ? INC(I) : []), ...GOTO(L), D];
  return [...pre, ...top, ...body({ cont: C, brk: D }), ...step]; }
// walk to index J from the head: X ⇐ element at J (0 if J ≥ length). CNT scratch.
export function walkTo(J, X, CNT, H = 1) { const L = lab('wt'), D = lab('wd'), B = lab('wb');
  return [...MV(H, X), ...MV(J, CNT), L, ...JZ(CNT, D), ...JZ(X, D), ...NEXT(X), ...DEC(CNT), ...GOTO(L), D]; }
// count the chain: N ⇐ length
export function countN(N, X, H = 1) { return [...SET(N, 0), ...scan({ X, H }, () => INC(N))]; }
// in-place pointer reversal of the chain at H (cells S, CUR, NXT scratch)
export function chainRev(H, S, CUR, NX) { const L = lab('cr'), B = lab('cb'), E = lab('ce');
  return [...SET(S, 0), ...MV(H, CUR), L, ...T_(CUR), ['J', B], ...GOTO(E), B, ...LOADAT(CUR, NX), ...STOREAT(CUR, S), ...MV(CUR, S), ...MV(NX, CUR), ...GOTO(L), E, ...MV(S, H)]; }
