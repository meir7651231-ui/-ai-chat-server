#TEMPLATE: decoder form. Lines starting '#E' are encoder-only, '#D' decoder-only (marker stripped).
#TEMPLATE: «expr» arguments are encoder-only (stripped with the preceding comma for the decoder).
import math
from operator import mul
from PIL import Image
W, H, OR, NC, T, LIM, LR, AR, RB = PARAMS
SW = W + 6
NN = (H + 3) * SW
SH = [16 - 8 * c for c in OR]
CO = [-1] * NN
V = [[0] * NN for _ in OR]
G = V[0]
E = [[[0] * NN for _ in range(n)] for n in (10, 18, 18)]
NW = [[0.0] * 8 for _ in OR]
R = [[0] * NN for _ in OR]
MSK = (1 << 22) - 1
TP = [0.5] * (MSK + 1)
TN = [0] * (MSK + 1)
MW = {}
CF = [min(1, 0.4 + 0.15 * k) for k in range(300)]
AP = {}
exp = math.exp
log = math.log
D1 = {}
D2 = {}
HB = {}
OFF = [0] * NN
MD = [0] * NN
OF2 = [0] * NN
S1 = SW
S2 = 2 * SW
TM = [-1, -2] + [k - S1 for k in range(-2, 3)] + [-S2 - 1, -S2, -S2 + 1]
T7 = TM[:7]
W16 = [-1, -2, -3] + [k - S1 for k in range(-3, 4)] + [k - S2 for k in range(-2, 3)] + [-3 * S1]
QT = [e if e < 3 else min(15, int(log(e, 1.5))) for e in range(4000)]
q = lambda e: QT[min(int(e), 3999)]
cl = lambda z: max(-3, min(3, z))
D = RB ** 7
A = [0, RB ** 8 - 1, 0]
#DIT = iter(DG)
#Dfor _ in range(8): A[2] = A[2] * RB + next(IT, 0)
def B(hs, nd, mk, m2, «y»):
    ix = [(h + nd * 0x9E3779B1) & MSK for h in hs]
    st = [log(TP[k] / (1 - TP[k])) * CF[TN[k]] for k in ix] + [0.3]
    n = len(st)
    wv = MW.get(mk) or MW.setdefault(mk, [0.1] * n + [0])
    w2 = MW.get(m2) or MW.setdefault(m2, [0.1] * n + [0])
    d1 = max(-20, min(20, sum(map(mul, wv, st))))
    d2 = max(-20, min(20, sum(map(mul, w2, st))))
    p1 = 1 / (1 + exp(-d1))
    p2 = 1 / (1 + exp(-d2))
    dt = (d1 + d2) / 2
    sx = max(0, min(31.999, (dt + 8) * 2))
    lo = int(sx)
    fw = sx - lo
    ab = AP.get(mk) or AP.setdefault(mk, [1 / (1 + exp(8 - k / 2)) for k in range(33)])
    p = max(1, min(65535, int((1 / (1 + exp(-dt)) + ab[lo] * (1 - fw) + ab[lo + 1] * fw) / 2 * 65536)))
    xm = A[0] + ((A[1] - A[0]) * p >> 16)
#D    y = A[2] <= xm
    if y:
        A[1] = xm
    else:
        A[0] = xm + 1
    while A[0] // D == A[1] // D:
#E        OUT.append(A[0] // D)
#D        A[2] = A[2] % D * RB + next(IT, 0)
        A[0] = A[0] % D * RB
        A[1] = A[1] % D * RB + RB - 1
    a = (y - p1) * LR * (1 + 3 / (1 + wv[n] / 16))
    b = (y - p2) * LR * (1 + 3 / (1 + w2[n] / 16))
    wv[:n] = [w + a * z for w, z in zip(wv, st)]
    w2[:n] = [w + b * z for w, z in zip(w2, st)]
    wv[n] += 1
    w2[n] += 1
    ab[lo] += (y - ab[lo]) * AR * (1 - fw)
    ab[lo + 1] += (y - ab[lo + 1]) * AR * fw
    for k in ix:
        c = TN[k]
        TP[k] = max(0.0001, min(0.9999, TP[k] + (y - TP[k]) / (c + 1.5)))
        if c < LIM:
            TN[k] = c + 1
    return y
for y in range(H):
    for x in range(W):
        i = (y + 3) * SW + x + 3
#E        vt = TRUTH[i]
#E        ST['px'] += 1
        cs = set()
        for jj in (i - 1, i - S1, i - S1 - 1, i - S1 + 1, i - 2):
            for o in (OFF[jj], OF2[jj]):
                if o:
                    cs.add(o)
        ka = tuple([G[i + t] >> 5 for t in T7])
        kb = tuple([(G[i + t] + 16) >> 5 for t in T7])
        kc = (0, G[i - 1] >> 4, G[i - S1] >> 4, G[i - S1 + 1] >> 4, G[i - S1 - 1] >> 4)
        for kk in (ka, kb, kc):
            for o in HB.get(kk, ()):
                cs.add(i - o)
        bo = b2 = 0
        bd = bd2 = 99999
        for o in cs:
            if bd2 == 0:
                break
            d = 0
            for t in TM:
                d += abs(G[i + t] - G[i - o + t])
                if d >= bd2:
                    break
            if d < bd:
                bd2, b2, bd, bo = bd, bo, d, o
            elif d < bd2:
                bd2, b2 = d, o
        mi = i - bo if bo else i - 1
        m2 = i - b2 if b2 else mi
        qbd = q(bd) if bo else 16
        cw = CO[i - 1]
        cn = CO[i - S1]
        cnw = CO[i - S1 - 1]
        cne = CO[i - S1 + 1]
        vb4 = (cw == CO[i - 1 - bo]) * 8 + (cn == CO[i - S1 - bo]) * 4 + (cne == CO[i - S1 + 1 - bo]) * 2 + (cnw == CO[i - S1 - 1 - bo]) if bo else 16
        k2 = (cw, cn, cnw, cne)
        k1 = k2 + (CO[i - 2], CO[i - 3], CO[i - S1 - 2], CO[i - S1 + 2], CO[i - S2 - 1], CO[i - S2], CO[i - S2 + 1])
        e1 = D1.get(k1, -1)
        e2 = D2.get(k2, -1)
        em = CO[mi] if bo else -1
        nd = len(set(k2))
        fd = 0
        md = 1
        mx3 = (MD[i - 1], MD[i - S1], MD[i - S1 + 1])
        if e1 >= 0:
            ag = (e1 == em) * 2 + (e1 == e2)
            fd = B([hash((ag, nd)), hash((e1, ag > 0)), hash((cw, cn, ag)), hash((ag, cw == cn, cn == cne, cw == cnw)), hash((ag, min(qbd, 8), 11)), hash((ag, vb4, 12)), hash((ag, mx3, 13))], 0, ag * 8 + min(nd, 7), 7000000 + vb4 * 16 + min(qbd, 15), «vt == e1»)
#E            ST['d1_tried'] += 1
#E            ST['d1_hit'] += fd
            if fd:
                for j in range(3):
                    V[j][i] = e1 >> SH[j] & 255
        cc = []
        for cv in (em, e2, e1, cw, cn):
            if cv >= 0 and cv not in cc:
                cc.append(cv)
        for j in range(3):
            Vj = V[j]
            sh = SH[j]
#E            v = vt >> sh & 255
            a = Vj[i - 1]
            b = Vj[i - S1]
            c = Vj[i - S1 - 1]
            d = Vj[i - S1 + 1]
            mv = Vj[mi]
            pr = [a, b, a + b - c, (a + d) / 2, d, b + d - Vj[i - S2 + 1], 2 * a - Vj[i - 2], 2 * b - Vj[i - S2], mv]
            if j:
                U = V[j - 1]
                u = U[i]
                uw = U[i - 1]
                un = U[i - S1]
                unw = U[i - S1 - 1]
                une = U[i - S1 + 1]
                pr += [a + u - uw, b + u - un, c + u - unw, d + u - une, a + b - c + u - uw - un + unw, mv + u - U[mi]]
                bp = 0
                bdd = 0
                nb = ((uw, a), (un, b), (unw, c), (une, d))
                for s in range(4):
                    for t in range(s + 1, 4):
                        dd = abs(nb[s][0] - nb[t][0])
                        if dd > bdd:
                            bdd = dd
                            bp = (s, t)
                if bp:
                    ua, va = nb[bp[0]]
                    ub, vb = nb[bp[1]]
                    pr.append(min(255, max(0, va + (vb - va) * (u - ua) / (ub - ua))))
                else:
                    pr.append(a)
                g0 = G[i]
                sw = su = sv = suu = suv = 0.0
                for t in W16:
                    gu = G[i + t]
                    w = 1.0 / (abs(gu - g0) + 2.0)
                    vv = Vj[i + t]
                    sw += w
                    su += w * gu
                    sv += w * vv
                    suu += w * gu * gu
                    suv += w * gu * vv
                um = su / sw
                vm = sv / sw
                var = suu / sw - um * um
                pls = vm + ((suv / sw - um * vm) / var if var > 1e-6 else 1.0) * (g0 - um)
                pr.append(min(255.0, max(0.0, pls)))
            b0 = (a + b) / 2
            fx = [a - b0, b - b0, c - b0, d - b0, Vj[i - 2] - b0, Vj[i - S2] - b0, Vj[i - S2 + 1] - b0, (pls if j else mv) - b0]
            nw = NW[j]
            pn = b0
            for k in range(8):
                pn += nw[k] * fx[k]
            pr.append(min(255.0, max(0.0, pn)))
            Ej = E[j]
            if not fd:
                ers = [Ek[i - 1] + Ek[i - S1] + Ek[i - S1 - 1] + Ek[i - S1 + 1] for Ek in Ej]
                sw = 0.0
                sp = 0.0
                ers[8] = (ers[8] + bd * 0.25) / 2
                for k in range(len(pr)):
                    w = 1.0 / (ers[k] * ers[k] + 0.5)
                    sw += w
                    sp += w * pr[k]
                pf = sp / sw
                Pp = max(0, min(255, int(pf + 0.5)))
                qe = q(min(ers))
                Rj = R[j]
                rp = R[j - 1][i] if j else 99
                X = []
                rk = 0
                yb = 0
                for cv in cc:
                    if rk >= NC:
                        break
                    if any(cv >> SH[k] & 255 != V[k][i] for k in range(j)):
                        continue
                    cvj = cv >> sh & 255
                    if cvj in X:
                        continue
                    ag = (cv == em) * 8 + (cv == e2) * 4 + (cv == e1) * 2 + (cv == cw)
                    dv = cvj - Pp
                    dv = dv if abs(dv) < 6 else 6 + (dv > 0)
                    if B([hash((j, rk, ag, vb4, min(qbd, 9), 21)), hash((j, ag, dv, qe, 22)), hash((j, ag, cvj, 23)), hash((j, ag, a == cvj, b == cvj, c == cvj, d == cvj, 24)), hash((j, rk, ag, rp, 25)), hash((j, ag, nd, cw == cn, 26)), hash((j, rk, ag, mx3, 27))], 0, 5000000 + (j * 16 + ag) * 4 + rk, 6000000 + ((j * 20 + vb4) * 17 + min(qbd, 16)) * 4 + rk, «v == cvj»):
#E                        ST['cand_hit%d' % j] += 1
                        yb = 1
                        if j == 0:
                            md = 2 + (ag & 12) // 4
                        v = cvj
                        break
                    X.append(cvj)
                    rk += 1
                if not yb:
#E                    ST['resid%d' % j] += 1
#E                    ST['match_used%d' % j] += bo > 0
                    mr = pr[14] if j else mv
                    m2v = Vj[m2] + (u - U[m2] if j else 0)
                    x0 = X[0] - Pp if X else 99
                    x0 = x0 if abs(x0) < 5 else 5 + (x0 > 0)
                    hs = [hash((j, qe, 1)), hash((j, qe, cl(rp), 2)), hash((j, cl(Rj[i - 1]), cl(Rj[i - S1]), qe > 4, 3)),
                          hash((j, a, b, c, d, rp, 4)), hash((j, Pp, 5)), hash((j, qe, int((pf - Pp) * 4 + 2), cl(a - Pp), cl(b - Pp), 6)),
                          hash((j, mr - Pp if abs(mr - Pp) < 12 else 12 + (mr > Pp), min(qbd, 9), 7)),
                          hash((j, x0, len(X), qe, 10)), hash((j, max(-6, min(6, m2v - Pp)), max(-6, min(6, mr - Pp)), 14)), hash((j, a > Pp, b > Pp, c > Pp, d > Pp, Vj[i - 2] > Pp, Vj[i - S2] > Pp, qe > 3, 32))]
                    if j:
                        dl = int(pls + 0.5) - Pp
                        dl = dl if abs(dl) < 8 else 8 + (dl > 0)
                        hs += [hash((j, dl, qe > 3, 8)), hash((j, dl, int((pls - int(pls)) * 4), cl(rp), 9))]
                    mc = (j * 16 + qe) * 200 + 1000000
                    m3 = (j * 17 + min(qbd, 16)) * 200 + 3000000
#E                    r_ = v - Pp
#E                    m_ = abs(r_)
#E                    z1_ = m_ - T
                    r = 0
                    if Pp in X or not B(hs, 0, mc, m3, «r_ == 0»):
                        s = B(hs, 1, mc + 1, m3 + 1, «r_ > 0») if 0 < Pp < 255 else Pp == 0
                        L = 255 - Pp if s else Pp
                        sg = 32 if s else 48
                        k = 1
                        while 1:
                            if k >= L:
                                m = L
                                break
                            if k > T:
                                nb = 1
                                mx = (L - T).bit_length()
                                while nb < mx and B(hs, 64 + nb, mc + 64 + nb, m3 + 64 + nb, «z1_.bit_length() > nb»):
                                    nb += 1
                                z = 1
                                for t in range(nb - 2, -1, -1):
                                    z = z * 2 + B(hs, 96 + nb * 8 + t, mc + 96 + nb * 8 + t, m3 + 96 + nb * 8 + t, «z1_ >> t & 1»)
                                m = T + z
                                break
                            if (Pp + k if s else Pp - k) not in X:
                                if not B(hs, sg + k, mc + sg + k, m3 + sg + k, «m_ > k»):
                                    m = k
                                    break
                            k += 1
                        r = m if s else -m
                    v = Pp + r
#E                    assert v == vt >> sh & 255
                Rj[i] = v - Pp
                Vj[i] = v
            else:
                v = Vj[i]
                R[j][i] = 0
            for k in range(len(pr)):
                Ej[k][i] = abs(v - pr[k])
            en = (v - pn) * 0.03 / (sum(z * z for z in fx) + 16)
            for k in range(8):
                nw[k] += en * fx[k]
        vt = V[SH.index(16)][i] << 16 | V[SH.index(8)][i] << 8 | V[SH.index(0)][i]
#E        assert vt == TRUTH[i]
        D1[k1] = D2[k2] = CO[i] = vt
        if bo and CO[i - bo] != vt:
            for o in cs:
                if CO[i - o] == vt:
                    b2 = bo
                    bo = o
                    break
        OFF[i] = bo
        MD[i] = 6 if fd else md
        OF2[i] = b2
        for kk in (ka, kb, kc):
            l = HB.setdefault(kk, [])
            l.insert(0, i)
            if len(l) > 64:
                l.pop()
#Efor n in range(1, 9):
#E    m = RB ** (8 - n)
#E    v = -(-A[0] // m) * m
#E    if v <= A[1]:
#E        break
#Efor _ in range(8):
#E    OUT.append(v // D)
#E    v = v % D * RB
#DImage.frombytes('RGB', (W, H), bytes(b for y in range(H) for x in range(W) for b in CO[(y + 3) * SW + x + 3].to_bytes(3, 'big'))).save(OUT)
