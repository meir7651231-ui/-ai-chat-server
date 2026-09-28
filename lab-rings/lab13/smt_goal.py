# smt_goal.py — הדלת של המנוע אל הפותר: JSON נכנס (דוגמאות) ⇒ הקצר ביותר (או «לא נמצא עד L») יוצא.
#   «ללמוד מטעויות»: מתחילים מ-4 דוגמאות; תוכנית שנכשלת ⇒ הדוגמה שנכשלה נוספת.
import sys, json, time
src = open('smt.py', encoding='utf8').read(); src = src[:src.index('random.seed(5)')]
G = {}; exec(compile(src, 'smt.py', 'exec'), G)
req = json.load(sys.stdin)
exs = [(e['mem'], e['want'], e.get('out', req['out'])) for e in req['examples']]
deadline = time.time() + req.get('budget', 240)
def fails(prog):
    for e in exs:
        m = G['run'](prog, e[0])
        if m is None or m[e[2]] != e[1]: return e
    return None
proven = 0
for L in range(1, req.get('maxL', 16) + 1):
    cur = exs[:4]
    while True:
        left = deadline - time.time()
        if left < 2: print(json.dumps({'len': None, 'proven': proven})); sys.exit(0)
        r, prog, dt = G['solve'](cur, req['out'], L, req.get('T', 40), timeout_s=max(1, int(left)))
        if r == 'unsat': proven = L; break
        if r != 'sat': print(json.dumps({'len': None, 'proven': proven})); sys.exit(0)
        bad = fails(prog)
        if bad is None: print(json.dumps({'len': L, 'proven': L - 1, 'prog': prog})); sys.exit(0)
        cur.append(bad)
print(json.dumps({'len': None, 'proven': proven}))
