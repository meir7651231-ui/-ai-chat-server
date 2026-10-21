# model.py - the residual coder shared by the engine (encoder) and the generated program (decoder).
#
# The model is written once (TEMPLATE) and specialised by make_src(mode, opts):
#   '#E' lines exist only in the encoder, '#D' lines only in the decoder,
#   '#SP' lines only when the smooth (least-squares plane) predictor is enabled,
#   '#PR' lines only when drawing primitives (rectangles / repeated rows) are used,
#   'Y(expr)' arguments are the true bit (known to the encoder only) and vanish in the decoder,
#   $K $LIM $LR $TTH $TL are numeric parameters baked into the generated program.
#
# Per pixel (raster order):
#   1. primitive pixels (rectangles / repeated rows) are copied, not coded            #PR
#   2. "match" stage: is the pixel equal to candidate k?  candidates = W, best repeated
#      patch (template match), N, exact-context match, NE, NW, WW, NN, NEE, NNE, 2nd patch
#   3. otherwise the channel with most local spread is coded first (residual vs. patch
#      prediction or MED), then the other two from the colour line through the local
#      darkest/brightest neighbours (two-colour blend model).
# Every binary decision is coded with a logistic mix (2 weight sets) of adaptive context
# probabilities, an APM stage, and a 32-bit binary arithmetic coder (integer-only maths).

TEMPLATE = r'''
def run(W, H, BG, KN, REP, A, ST=None):
    from operator import sub
    Wp = W + 4
    NT = (H + 2) * Wp + 2
    CH = R, G, B = [BG >> 16] * NT, [BG >> 8 & 255] * NT, [BG & 255] * NT
    C = [BG] * NT
    Y_ = [(BG >> 16) + 2 * (BG >> 8 & 255) + (BG & 255)] * NT
    M = [0] * NT
    E = [0] * NT
    AP = {}
    WT = {}
    P = [32768] * (33 << 16)
    NC = [0] * (33 << 16)
    RT = [655360 // (n * 10 + 16) for n in range($LIM + 1)]
    t = (1, 2, 3, 6, 10, 16, 27, 45, 73, 120, 194, 310, 488, 747, 1101, 1546, 2047, 2549, 2994, 3348, 3607, 3785, 3901, 3975, 4024, 4050, 4068, 4079, 4085, 4089, 4092, 4093, 4094)
    SQ = [(t[(d >> 7) + 16] * (128 - (d & 127)) + t[(d >> 7) + 17] * (d & 127) + 64) >> 7 for d in range(-2047, 2048)]
    STR = []
    for d in range(-2047, 2048):
        STR += [d] * (SQ[d + 2047] + 1 - len(STR))
    STR += [2047] * (4096 - len(STR))
    x1 = 0; x2 = 0xffffffff
    out = []  #E
    x = int.from_bytes(A[:4], 'big'); pos = 4  #D
    A += bytes(8)  #D
    def bit(cx, ws, ws2, y=0):
        nonlocal x1, x2, x, pos  #D
        nonlocal x1, x2  #E
        w = WT.get(ws) or WT.setdefault(ws, [22000] * len(cx))
        w2 = WT.get(ws2) or WT.setdefault(ws2, [22000] * len(cx))
        s = [STR[P[c] >> 4] for c in cx]
        d = d2 = 0
        for a, b, c in zip(w, w2, s): d += a * c; d2 += b * c
        d >>= 16; d2 >>= 16
        p1 = SQ[min(max(d, -2047), 2047) + 2047]
        p2 = SQ[min(max(d2, -2047), 2047) + 2047]
        p = SQ[min(max((d + d2) >> 1, -2047), 2047) + 2047]
        ap = AP.get(ws) or AP.setdefault(ws, [SQ[min(max((j - 16) * 128, -2047), 2047) + 2047] * 16 for j in range(33)])
        z = STR[p] + 2048
        lo = z >> 7; z &= 127
        pf = min(max((p + 3 * ((ap[lo] * (128 - z) + ap[lo + 1] * z) >> 11)) >> 2, 1), 4095)
        xm = x1 + ((x2 - x1) >> 12) * pf
        y = 1 if x <= xm else 0  #D
        if ST is not None: ST['cost'][ST['tag']] += LG[pf if y else 4096 - pf]  #E
        if y: x2 = xm
        else: x1 = xm + 1
        while not (x1 ^ x2) & 0xff000000:
            out.append(x2 >> 24)  #E
            x1 = x1 << 8 & 0xffffffff; x2 = x2 << 8 & 0xffffffff | 255
            x = x << 8 & 0xffffffff | A[pos]; pos += 1  #D
        e1 = ((y << 12) - p1) * $LR; e2 = ((y << 12) - p2) * $LR
        for j in range(len(s)):
            w[j] += s[j] * e1 >> 14; w2[j] += s[j] * e2 >> 14
        if z < 64: ap[lo] += ((y << 16) - ap[lo]) >> 6
        else: ap[lo + 1] += ((y << 16) - ap[lo + 1]) >> 6
        for c in cx:
            n = NC[c]
            P[c] += ((y << 16) - P[c]) * RT[n] >> 16
            if n < $LIM: NC[c] = n + 1
        return y
    QD = [8 + sum(d > t for t in (0, 1, 2, 4, 7, 12, 20, 40)) for d in range(601)]
    QD += [16 - q for q in QD[:0:-1]]
    QA = [sum(a > t for t in (0, 1, 2, 3, 5, 8, 12, 18, 27, 40, 60, 90, 140)) for a in range(2048)]
    def qtd(d):
        return sum(d > t for t in (0, 4, 10, 20, 40, 80, 160, 320, 640, 1280, 2560))
    def med(a, b, c):
        return min(a, b) if c >= max(a, b) else (max(a, b) if c <= min(a, b) else a + b - c)
    def cl(v):
        return 0 if v < 0 else (255 if v > 255 else v)
    def res(cb, base, ws, w2, nz, e=0):
        def cx(st):
            return [(base + j) << 16 | ((c << 5 | st) & 65535) for j, c in enumerate(cb)]
        if not nz and bit(cx(0), ws, w2, Y(e == 0)): return 0
        s = bit(cx(1), ws + 1, w2 + 1, Y(e > 0))
        m = abs(e) - 1  #E
        j = 0
        while j < 5 and bit(cx(2 + j), ws + 2 + j, w2 + 2 + j, Y(m > j)): j += 1
        if j == 5:
            r = m - 5  #E
            nb = 0
            while bit(cx(7 + min(nb, 7)), ws + 7 + min(nb, 7), w2 + 7 + min(nb, 7), Y(r >= (2 << nb) - 1)): nb += 1
            off = r - (1 << nb) + 1  #E
            o = 0
            for k in range(nb - 1, -1, -1):
                q = 15 + min(k, 7) + 8 * (k == nb - 1)
                o = o * 2 + bit(cx(q), ws + q, w2 + 15, Y(off >> k & 1))
            j = 4 + (1 << nb) + o
        return j + 1 if s else -j - 1
    def tmcol(be, rgc):
        pc, rg = be
        v = 0
        for c in (0, 1, 2):
            pv = pc >> 16 - 8 * c & 255
            glo, ghi = rg[c]; clo, chi = rgc[c]
            v = v * 256 + cl(clo + ((pv - glo) * (chi - clo) * 2 + ghi - glo) // (2 * (ghi - glo)) if ghi > glo else pv - glo + clo)
        return v
    MM = {}
    WIN2 = [dy * Wp + dx for dy in (-3, -2, -1) for dx in range(-4, 5)] + [-4, -3, -2, -1]
    TL = $TL
    TMI = [{} for _ in TL]
    toffs = (-1, -Wp, -Wp - 1, -Wp + 1, -2, -2 * Wp, -Wp - 2, -Wp + 2, -2 * Wp - 1, -2 * Wp + 1, -3, -3 * Wp, -2 * Wp - 2, -2 * Wp + 2)
    twts = (4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1)
    SW = [(o * Wp + q, w) for o, q, w in ((-2, -2, -683), (-2, -1, -496), (-2, 0, -310), (-2, 1, -124), (-2, 2, 62), (-1, -2, 248), (-1, -1, 435), (-1, 0, 621), (-1, 1, 807), (-1, 2, 993), (0, -2, 1179), (0, -1, 1365))]  #SP
    for y in range(H):
        row = (y + 2) * Wp + 2
        rs = REP.get(y)  #PR
        for xx in range(W):
            i = row + xx
            v = A[y * W + xx]  #E
            isedge = 0  #PR
            kv = KN[i]  #PR
            if rs is not None or kv:  #PR
                v = C[(rs + 2) * Wp + 2 + xx] if rs is not None else kv - 1  #PR
                if ST is not None: ST['primitive'] += 1  #PR #E
                px = [v >> 16, v >> 8 & 255, v & 255]  #PR
                M[i] = E[i] = 0  #PR
            else:  #PR
#BEGIN
                px = [v >> 16, v >> 8 & 255, v & 255]  #E
                iN = i - Wp
                nbc = [C[j] for j in (i - 1, iN, iN + 1, iN - 1, i - 2, iN - Wp, iN + 2, iN - Wp + 1)]
                cw, cn, cne, cnw, cww, cnn, cnee, cnne = nbc
                eqp = (cw == cn) | (cw == cnw) << 1 | (cn == cne) << 2 | (cn == cnw) << 3 | (cw == cww) << 4 | (cn == cnn) << 5
                key = tuple(nbc)
                mmc, mcnt = MM.get(key, (-1, 0))
                tv = [Y_[i + o] for o in toffs]
                tmc = tmc2 = -1; tmd = tmd2 = 99999
                isedge = max(tv[:6]) - min(tv[:6]) >= $TTH
                if isedge:
                    lo2 = min(tv); sc = max(tv) - lo2
                    ft = [(t - lo2) * 256 // sc for t in tv]
                    fw = [a * b for a, b in zip(ft, twts)]
                    tks = [tuple([t * q >> 8 for t in ft[:n]]) for n, q, cp in TL]
                    for tk, TI in zip(tks, TMI):
                        lst = TI.get(tk)
                        if lst:
                            for be_ in lst:
                                d = sum(map(abs, map(sub, be_[0], fw)))
                                if d < tmd:
                                    if tmd < 99999 and be[0] != be_[1]: tmd2 = tmd; be2 = be
                                    tmd = d; be = be_[1:]
                                elif d < tmd2 and be_[1] != be[0]: tmd2 = d; be2 = be_[1:]
                            if tmd <= $TMS: break
                    rgc = []
                    for ch in CH:
                        vs = [ch[i + o] for o in toffs]
                        rgc.append((min(vs), max(vs)))
                    if tmd < 99999: tmc = tmcol(be, rgc)
                    if tmd2 < 99999: tmc2 = tmcol(be2, rgc)
                cands = []
                for c in (cw, tmc, cn, mmc, cne, cnw, cww, cnn, cnee, cnne, tmc2):
                    if c >= 0 and c not in cands: cands.append(c)
                cands = cands[:$K]
                mctx = M[i - 1] + 3 * M[iN] + 9 * M[iN + 1] + 27 * M[iN - 1]
                qa = QA[sum(abs(ch[i - 1] - ch[iN - 1]) + abs(ch[iN] - ch[iN - 1]) + abs(ch[iN] - ch[iN + 1]) for ch in CH) >> 1]
                sp = [sum(ch[i + o] * w for o, w in SW) for ch in CH]  #SP
                nc = len(cands)
                mq = min(mcnt, 3) if mmc >= 0 else 0
                qt = qtd(tmd)
                qt2 = qtd(tmd2) << 2 | min(abs(tmd2 - tmd) >> 6, 3)
                pms = [(med(ch[i - 1], ch[iN], ch[iN - 1]), ch[i - 1] + ch[iN] - ch[iN - 1]) for ch in CH]
                hit = -1
                skp = nc >= $SKN and qa <= $SKA  #SK
                if skp: cands = []  #SK
                if ST is not None: ST['tag'] = 'match'  #E
                for k, c in enumerate(cands):
                    sm = 0
                    for j, cc in enumerate(nbc):
                        if cc == c: sm |= 1 << j
                    pt = 0
                    for ci in (0, 1, 2):
                        q = c >> 16 - 8 * ci & 255
                        pm, pg = pms[ci]
                        pt = pt * 9 + (q >= pm) + (q > pm) + 3 * ((q >= pg) + (q > pg))
                    cx = [k << 8 | sm, 65536 | k << 8 | eqp, 131072 | k << 8 | mctx, 196608 | k << 8 | nc << 4 | qa,
                          262144 | k << 8 | (c == mmc) << 7 | (mmc >= 0) << 6 | mq << 4 | nc,
                          327680 | k << 10 | (sm & 15) << 6 | E[i - 1] << 3 | E[iN],
                          393216 | k << 8 | (c == tmc) << 7 | (tmc >= 0) << 6 | qt,
                          458752 | k << 8 | (c == tmc2) << 7 | (c == tmc) << 6 | qt2,
                          524288 | k << 10 | pt]
                    cx.append(589824 | k << 12 | min(max(abs((c >> 16 << 12) - sp[0]), abs(((c >> 8 & 255) << 12) - sp[1]), abs(((c & 255) << 12) - sp[2])) >> 10, 40) * 16 + qa)  #SP
                    if bit(cx, k * 8 + min(nc, 4), 300000 + k * 100 + (eqp & 15), Y(v == c)):
                        hit = k
                        break
                if hit >= 0:
                    if ST is not None: ST['copy-neighbour' if cands[hit] in nbc else ('patch-match' if cands[hit] in (tmc, tmc2) else 'context-match')] += 1  #E
                    v = cands[hit]
                    px = [v >> 16, v >> 8 & 255, v & 255]
                    M[i] = 1 if hit else 0
                    E[i] = 0
                else:
                    px = [0, 0, 0]  #D
                    M[i] = 2
                    win = (i - 1, iN, iN - 1, iN + 1, i - 2, iN - Wp, iN - 2, iN + 2, iN - Wp - 1, iN - Wp + 1)
                    first = 1; bs = -1
                    for c in (1, 0, 2):
                        vals = [CH[c][j] for j in win]
                        if max(vals) - min(vals) > bs: bs = max(vals) - min(vals); first = c
                    order = [first] + [c for c in (1, 0, 2) if c != first]
                    ch = CH[first]
                    a_ = ch[i - 1]; b_ = ch[iN]; c0 = ch[iN - 1]; d_ = ch[iN + 1]; ww = ch[i - 2]; nn = ch[iN - Wp]; nne = ch[iN - Wp + 1]
                    p0 = pmed = med(a_, b_, c0)
                    sh8 = 16 - 8 * first
                    tm0 = tmc >> sh8 & 255 if tmc >= 0 else -1
                    if tm0 >= 0: p0 = tm0
                    cb = [qa * 3 + min(E[i - 1], 2), QD[a_ - p0] * 17 + QD[b_ - p0], QD[d_ - p0] * 17 + QD[cl(a_ + b_ - c0) - p0],
                          QD[cl(2 * b_ - nn) - p0] * 17 + QD[cl(2 * a_ - ww) - p0], QD[cl(b_ + d_ - nne) - p0] * 17 + QD[((a_ + d_ + 1) >> 1) - p0],
                          (QD[(mmc >> sh8 & 255) - p0] if mmc >= 0 else 17) * 4 + mq, qt * 17 + QD[pmed - p0],
                          (QD[(tmc2 >> sh8 & 255) - p0] if tmc2 >= 0 else 17) * 12 + qt2 // 4]
                    cb.append(min(max((sp[first] - (p0 << 12) + 26624) >> 10, 0), 25) * 16 + qa)  #SP
                    e0 = px[first] - p0  #E
                    if ST is not None: ST['residual'] += 1; ST['residual-patch-pred'] += tm0 >= 0; ST['tag'] = 'first'  #E
                    e0 = res(cb, 10, 10000 + 100 * (first == 1), 100000 + 100 * qt, 0, Y(e0))  #NSK
                    e0 = res(cb, 10, 10000 + 100 * (first == 1) + 50000 * skp, 100000 + 100 * qt + 500000 * skp, 0, Y(e0))  #SK
                    v0 = px[first] = p0 + e0
                    E[i] = 0 if e0 == 0 else (1 if abs(e0) <= 2 else (2 if abs(e0) <= 8 else 3))
                    jlo = min(win, key=lambda j: ch[j]); jhi = max(win, key=lambda j: ch[j])
                    dg = ch[jhi] - ch[jlo]
                    jnn = min(win, key=lambda j: abs(ch[j] - v0))
                    win2 = [i + o for o in WIN2]
                    jlo2 = min(win2, key=lambda j: ch[j]); jhi2 = max(win2, key=lambda j: ch[j])
                    dg2 = ch[jhi2] - ch[jlo2]
                    q0 = QD[e0]
                    ep = 0
                    for idx in (0, 1):
                        c2 = order[idx + 1]
                        cc = CH[c2]
                        p1 = cl(med(cc[i - 1], cc[iN], cc[iN - 1]) + v0 - pmed)
                        pc = p1; fq = 0
                        if dg >= 3:
                            num = den = 0
                            for kc in order[:idx + 1]:
                                dd = CH[kc][jhi] - CH[kc][jlo]
                                num += (px[kc] - CH[kc][jlo]) * dd; den += dd * dd
                            dc = cc[jhi] - cc[jlo]
                            pc = cl(cc[jlo] + (num * dc * 2 + den) // (2 * den))
                            fq = (num * dc * 16) // den - (pc - cc[jlo]) * 16
                            fq = (min(max(fq, -8), 8) + 9) * 9 + min(abs(dc) * 4 // dg, 8)
                        pnn = cl(cc[jnn] + v0 - ch[jnn])
                        pc2 = pc
                        if dg2 >= 3:
                            num = den = 0
                            for kc in order[:idx + 1]:
                                dd = CH[kc][jhi2] - CH[kc][jlo2]
                                num += (px[kc] - CH[kc][jlo2]) * dd; den += dd * dd
                            pc2 = cl(cc[jlo2] + (num * (cc[jhi2] - cc[jlo2]) * 2 + den) // (2 * den))
                        sc = 16 - 8 * c2
                        if tmc >= 0: ptm = cl((tmc >> sc & 255) + ((v0 - tm0) * (cc[jhi] - cc[jlo]) // dg if dg >= 3 else v0 - tm0))
                        cb = [qa * 3 + idx, QD[cc[i - 1] - pc] * 17 + QD[cc[iN] - pc], QD[p1 - pc] * 17 + QD[pnn - pc],
                              (QD[ptm - pc] if tmc >= 0 else 17) * 12 + qt,
                              q0 * 17 + (QD[min(dg, 40)] if idx == 0 else QD[ep]),
                              QD[cc[iN + 1] - pc] * 17 + E[i - 1] * 4 + E[iN],
                              (QD[(mmc >> sc & 255) - pc] if mmc >= 0 else 17) * 4 + mq, fq * 3 + idx, QD[pc2 - pc] * 8 + min(dg2 // 32, 7)]
                        cb.append(min(max((sp[c2] - (pc << 12) + 26624) >> 10, 0), 25) * 17 + q0)  #SP
                        nz = 0
                        if idx:
                            s1 = 16 - 8 * first; s2 = 16 - 8 * order[1]
                            for c in cands:
                                if c >> s1 & 255 == px[first] and c >> s2 & 255 == px[order[1]] and c >> sc & 255 == pc: nz = 1
                        ec = px[c2] - pc  #E
                        if ST is not None: ST['tag'] = 'second'  #E
                        ep = res(cb, 21, 30000 + 100 * idx + 200 * (first == 1), 200000 + 1000 * idx + 100 * qa, nz, Y(ec))  #NSK
                        ep = res(cb, 21, 30000 + 100 * idx + 200 * (first == 1) + 50000 * skp, 200000 + 1000 * idx + 100 * qa + 500000 * skp, nz, Y(ec))  #SK
                        px[c2] = pc + ep
                    v = px[0] << 16 | px[1] << 8 | px[2]
                MM[key] = (v, mcnt + 1 if mmc == v else 0)
#END
            R[i], G[i], B[i] = px; C[i] = v
            Y_[i] = px[0] + 2 * px[1] + px[2]
            if isedge:
                for tk, TI, (n, q, cp) in zip(tks, TMI, TL):
                    lst = TI.setdefault(tk, [])
                    lst.append((fw, v, rgc))
                    if len(lst) > cp: del lst[0]
    for _ in range(4):  #E
        out.append(x1 >> 24); x1 = x1 << 8 & 0xffffffff  #E
    return bytes(out)  #E
    return C  #D
'''


def _args_Y(src, keep):
    out = []; i = 0
    while True:
        j = src.find(', Y(', i)
        if j < 0:
            out.append(src[i:]); break
        out.append(src[i:j])
        k = j + 4; depth = 1; st = k
        while depth:
            if src[k] == '(': depth += 1
            elif src[k] == ')': depth -= 1
            k += 1
        if keep: out.append(', ' + src[st:k - 1])
        i = k
    return ''.join(out)


def make_src(mode, opts):
    """mode: 'enc' or 'dec'; opts: dict K, LIM, LR, TTH, TL, SP (bool), PR (bool)."""
    sk = opts.get('SKN', 99) < 99
    tags = {'#E': mode == 'enc', '#D': mode == 'dec', '#SP': bool(opts['SP']), '#PR': bool(opts['PR']), '#NSK': not sk, '#SK': sk}
    lines = []
    for ln in TEMPLATE.split('\n'):
        s = ln.rstrip()
        drop = False
        while True:
            for t, on in tags.items():
                if s.endswith(t):
                    if not on: drop = True
                    s = s[:-len(t)].rstrip()
                    break
            else:
                break
        if drop:
            continue
        lines.append(s)
    src = '\n'.join(lines)
    out = []; inside = False
    for ln in src.split('\n'):
        if ln == '#BEGIN': inside = True; continue
        if ln == '#END': inside = False; continue
        out.append(ln[4:] if inside and not opts['PR'] else ln)
    src = '\n'.join(out)
    if not opts['SP']:
        src = src.replace('(32 << 16)', '(31 << 16)')
    for k in ('LIM', 'LR', 'TTH', 'TL', 'K', 'SKN', 'SKA', 'TMS'):
        if k in opts: src = src.replace('$' + k, repr(opts[k]).replace(' ', ''))
    if mode == 'dec':
        src = _args_Y(src, False)
        src = src.replace('def bit(cx, ws, ws2, y=0):', 'def bit(cx, ws, ws2):')
        src = src.replace('def res(cb, base, ws, w2, nz, e=0):', 'def res(cb, base, ws, w2, nz):')
        src = src.replace('def run(W, H, BG, KN, REP, A, ST=None):', 'def run(W, H, BG, KN, REP, A):')
        if not opts['PR']:
            src = src.replace('def run(W, H, BG, KN, REP, A):', 'def run(W, H, BG, A):')
    else:
        src = _args_Y(src, True)
        src = src.replace('    out = []\n', '    out = []\n    import math\n    LG = [0] + [-math.log2(k / 4096) / 8 for k in range(1, 4097)]\n', 1)
    return src
