# smt.py — שואלים את הפותר Z3: «האם קיימת תוכנית באורך L שנותנת את כל התוצאות?» — כולל «לך לשורה».
#   «לא» (unsat) = הוכחה שאין תוכנית באורך הזה. «כן» = הוא נותן את התוכנית, ואנחנו מריצים אותה לבדיקה.
#   המכונה בדיוק כמו machine2.mjs: לאן k · לאן@ · לך · לך-לשורה (אם לא-אפס) · קח · שים · חשב(NAND) · מספרים 0..15 · מחסנית עד 4.
import sys, time, random
from z3 import *
OPS = ['WHERE', 'WHERE@', 'GO', 'JUMP', 'TAKE', 'PUT', 'CALC', 'ADD']
NAME = {'WHERE': 'לאן', 'WHERE@': 'לאן@', 'GO': 'לך', 'JUMP': 'לך-לשורה', 'TAKE': 'קח', 'PUT': 'שים', 'CALC': 'חשב', 'ADD': 'חשב+'}
B4 = lambda v: BitVecVal(v, 4)

def solve(examples, out, L, T, timeout_s=600):
    s = Solver(); s.set('timeout', timeout_s * 1000)
    op = [BitVec(f'op{i}', 3) for i in range(L)]; arg = [BitVec(f'arg{i}', 4) for i in range(L)]
    for i in range(L): s.add(ULT(op[i], 8))
    for e_i, ex in enumerate(examples):
        mem0, want = ex[0], ex[1]; eout = ex[2] if len(ex) > 2 else out
        pc = BitVecVal(0, 5); A = B4(0); P = B4(0); sp = BitVecVal(0, 3); st = [B4(0)] * 4; mem = [B4(v) for v in mem0]; err = BoolVal(False)
        for t in range(T):
            halted = UGE(pc, L)
            o = BitVecVal(0, 3); a = B4(0)
            for i in range(L): o = If(pc == i, op[i], o); a = If(pc == i, arg[i], a)
            top = B4(0)
            for d in range(4): top = If(sp == d + 1, st[d], top)
            sec = B4(0)
            for d in range(4): sec = If(sp == d + 2, st[d], sec)
            mP = B4(0)
            for c in range(16): mP = If(P == c, mem[c], mP)
            isop = lambda name: And(Not(halted), o == OPS.index(name))
            # מצב חדש
            nA = If(isop('WHERE'), a, If(isop('WHERE@'), top, A))
            nP = If(isop('GO'), A, P)
            jump_taken = And(isop('JUMP'), top != 0)
            npc = If(halted, pc, If(jump_taken, ZeroExt(1, A), pc + 1))
            nsp = If(isop('TAKE'), sp + 1, If(Or(isop('WHERE@'), isop('JUMP'), isop('PUT')), sp - 1, If(Or(isop('CALC'), isop('ADD')), sp - 1, sp)))
            nand = ~(sec & top)
            nst = []
            for d in range(4):
                v = st[d]
                v = If(And(isop('TAKE'), sp == d), mP, v)
                v = If(And(isop('CALC'), sp == d + 2), nand, v)
                v = If(And(isop('ADD'), sp == d + 2), sec + top, v)
                nst.append(v)
            nmem = [If(And(isop('PUT'), P == c), top, mem[c]) for c in range(16)]
            err = Or(err, And(isop('TAKE'), sp == 4), And(Or(isop('WHERE@'), isop('JUMP'), isop('PUT')), sp == 0), And(Or(isop('CALC'), isop('ADD')), ULT(sp, 2)))
            pc, A, P, sp, st, mem = npc, nA, nP, nsp, nst, nmem
        s.add(Not(err), UGE(pc, L), mem[eout] == want)
    t0 = time.time(); r = s.check(); dt = time.time() - t0
    if r == sat:
        m = s.model(); prog = [(OPS[m.eval(op[i]).as_long()], m.eval(arg[i]).as_long()) for i in range(L)]
        return 'sat', prog, dt
    return str(r), None, dt

def run(prog, mem0, max_steps=600):
    mem = list(mem0); A = P = pc = 0; st = []; steps = 0
    while pc < len(prog):
        steps += 1
        if steps > max_steps: return None
        o, k = prog[pc]; pc += 1
        if o == 'WHERE': A = k
        elif o == 'WHERE@':
            if not st: return None
            A = st.pop() % 16
        elif o == 'GO': P = A
        elif o == 'JUMP':
            if not st: return None
            if st.pop() != 0: pc = A
        elif o == 'TAKE':
            if len(st) >= 4: return None
            st.append(mem[P])
        elif o == 'PUT':
            if not st: return None
            mem[P] = st.pop()
        elif o == 'ADD':
            if len(st) < 2: return None
            b = st.pop(); a = st.pop(); st.append((a + b) & 15)
        else:
            if len(st) < 2: return None
            b = st.pop(); a = st.pop(); st.append(~(a & b) & 15)
    return mem

def show(prog): return ' '.join(NAME[o] + (str(k) if o == 'WHERE' else '') for o, k in prog)

random.seed(5)
def chain(m, l):
    m[1] = l[0] if l else 0
    for i, a in enumerate(l): m[a] = l[i + 1] if i + 1 < len(l) else 0
    return m
def ex_skip(n):
    out = []
    for _ in range(n):
        m = [0] * 16; m[0] = random.choice([0, random.randint(1, 15)]); m[1] = random.randint(1, 15); out.append((m, 0 if m[0] else m[1]))
    return out
def ex_if(n):
    out = []
    for _ in range(n):
        m = [0] * 16; m[0] = random.choice([0, random.randint(1, 15)]); m[1] = random.randint(1, 15); m[3] = random.randint(1, 15); out.append((m, m[1] if m[0] else m[3]))
    return out
def ex_step(n):
    out = []
    for _ in range(n):
        m = [0] * 16; l = random.sample(range(8, 16), random.randint(0, 3)); chain(m, l); out.append((m, l[0] if l else 0))
    return out
def ex_end(n, maxlen):
    out = []
    for _ in range(n):
        m = [0] * 16; l = random.sample(range(8, 16), random.randint(0, maxlen)); chain(m, l); out.append((m, l[-1] if l else 0))
    return out

GOALS = {
  'דלג אם לא-אפס': (ex_skip, 9, 'st'),
  'אם': (ex_if, 17, 'st'),
  'צעד ברשימה': (ex_step, 6, 'st'),
  'סוף רשימה (לולאה)': (lambda n: ex_end(n, 3), 12, 'loop'),
}
which = sys.argv[1:] or list(GOALS)
for name in which:
    gen, found, kind = GOALS[name]
    test = gen(200)
    print(f'── {name} · המנוע מצא {found}', flush=True)
    for L in range(1, found + 1):
        exs = gen(10)
        T = L if kind == 'st' else 40
        r, prog, dt = solve(exs, 2, L, T, timeout_s=900)
        if r == 'sat':
            ok = sum(1 for m, w in test if (lambda o: o is not None and o[2] == w)(run(prog, m)))
            print(f'   אורך {L}: יש תוכנית ({dt:.0f}s) · על 200 דוגמאות חדשות: {ok}/200 · {show(prog)}', flush=True)
            if ok == 200: print(f'   ⇒ הקצר ביותר: {L}' + (' (הוכח: אין קצר יותר)' if True else ''), flush=True); break
        elif r == 'unsat':
            print(f'   אורך {L}: אין (הוכחה) · {dt:.1f}s', flush=True)
        else:
            print(f'   אורך {L}: לא ידוע (הפותר לא הספיק) · {dt:.0f}s', flush=True); break
