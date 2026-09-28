# cegis.py — «ללמוד מטעויות»: מתחילים ממעט דוגמאות; תוכנית שנכשלת בבדיקה ⇒ הדוגמה שנכשלה נוספת ⇒ שואלים שוב.
#   «אין» על מעט דוגמאות = הוכחה שאין גם על כולן.
import sys, time, random
sys.argv = [sys.argv[0]]  # לא להריץ את החלק הראשי של smt.py
import importlib.util
spec = importlib.util.spec_from_file_location('smt', 'smt.py'); smt = importlib.util.module_from_spec(spec)
src = open('smt.py', encoding='utf8').read(); src = src[:src.index('GOALS = {')]
exec(compile(src, 'smt.py', 'exec'), smt.__dict__)
random.seed(9)
def gen_end(n, maxlen): return smt.ex_end(n, maxlen)
test = gen_end(300, 6)
# דוגמאות התחלה: רשימה ריקה, איבר אחד, שניים (שהלולאה תצטרך לחזור)
start = []
for ln in [0, 1, 2, 2]:
    m = [0] * 16; l = random.sample(range(8, 16), ln); smt.chain(m, l); start.append((m, l[-1] if l else 0))
for L in [10, 11, 12]:
    exs = list(start); t0 = time.time()
    while True:
        r, prog, dt = smt.solve(exs, 2, L, 36, timeout_s=3000)
        if r != 'sat':
            print(f'אורך {L}: ' + ('אין (הוכחה)' if r == 'unsat' else 'לא ידוע') + f' · {len(exs)} דוגמאות · {time.time()-t0:.0f}s', flush=True); break
        bad = next(((m, w) for m, w in test if (lambda o: o is None or o[2] != w)(smt.run(prog, m))), None)
        if bad is None:
            print(f'אורך {L}: יש תוכנית שעובדת על כל 300 · {time.time()-t0:.0f}s · {smt.show(prog)}', flush=True); sys.exit(0)
        exs.append(bad)
