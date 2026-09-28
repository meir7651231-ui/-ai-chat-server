import math, random, time
random.seed(3)
OPS = ['+1', '×2', '−1']
MAXSTEP = 20
def apply(v, a): return v + 1 if a == 0 else v * 2 if a == 1 else v - 1
def feats(v, t, s):
    return [v / 32, t / 32, (t - v) / 32, 1.0 if t >= 2 * v else 0.0, 1.0 if t % 2 == 0 else 0.0, s / MAXSTEP,
            1.0 if (t - v) == 1 else 0.0, 1.0 if t == 2 * v else 0.0, 1.0, 1.0 if t > v else 0.0, 1.0 if t < v else 0.0]
NI, NH, NO = 11, 24, 3
W1 = [[random.gauss(0, 0.5) for _ in range(NI)] for _ in range(NH)]
W2 = [[random.gauss(0, 0.5) for _ in range(NH)] for _ in range(NO)]
def forward(x):
    h = [math.tanh(sum(w * xi for w, xi in zip(row, x))) for row in W1]
    z = [sum(w * hi for w, hi in zip(row, h)) for row in W2]
    m = max(z); e = [math.exp(zi - m) for zi in z]; S = sum(e)
    return h, [ei / S for ei in e]
def episode(t, greedy=False):
    v, traj = 1, []
    for s in range(MAXSTEP):
        x = feats(v, t, MAXSTEP - s); h, p = forward(x)
        a = max(range(NO), key=lambda i: p[i]) if greedy else random.choices(range(NO), p)[0]
        traj.append((x, h, p, a)); v = apply(v, a)
        if v == t or v > 64 or v < 0: break
    return traj, v == t
train = [t for t in range(2, 41) if t % 5 != 0]; test = [t for t in range(2, 41) if t % 5 == 0]
lr, base = 0.02, 0.0
t0 = time.time()
for it in range(1, 40001):
    t = random.choice(train)
    traj, ok = episode(t)
    R = (1.0 - 0.03 * len(traj)) if ok else 0.0
    base = 0.99 * base + 0.01 * R
    adv = R - base
    for x, h, p, a in traj:
        g = [(1.0 if i == a else 0.0) - p[i] for i in range(NO)]          # d log p / dz
        gh = [sum(g[o] * W2[o][j] for o in range(NO)) * (1 - h[j] ** 2) for j in range(NH)]
        for o in range(NO):
            for j in range(NH): W2[o][j] += lr * adv * g[o] * h[j]
        for j in range(NH):
            for i in range(NI): W1[j][i] += lr * adv * gh[j] * x[i]
    if it % 6000 == 0 or it in (1, 500, 2000):
        tr = sum(episode(t, True)[1] for t in train) / len(train); te = sum(episode(t, True)[1] for t in test) / len(test)
        L = [len(episode(t, True)[0]) for t in test if episode(t, True)[1]]
        print(it, f'train {tr:.0%} test {te:.0%}', 'avg len test', sum(L)/max(1,len(L)), f'{time.time()-t0:.0f}s')
for t in range(2, 41):
    traj, ok = episode(t, True)
    v = 1; prog = []
    for x, h, p, a in traj: prog.append(OPS[a]); v = apply(v, a)
    if not ok: print('נכשל', t, ' '.join(prog), '->', v)
