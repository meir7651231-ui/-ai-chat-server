"""dictlz.py - the 'dictionary + lzma' program builder (generic, pixels only).

Finds repeated structure and lays the remainder out for the stdlib's strongest compressor:
  * palette        : if the image has <= 256 colours, pixels become 1-byte indices (+ palette)
  * tile dictionary: the image is cut into BxB tiles; a tile identical to an EARLIER tile (anywhere,
                     not only aligned to the previous one) is replaced by a reference (placement list)
  * remainder      : pixels of non-duplicate tiles, after a colour transform (G, R-G, B-G or plain)
                     and a spatial predictor (none / left / up / avg / paeth / med) chosen by trial;
                     stored interleaved or planar, compressed with raw LZMA2 (lc/lp/pb tried)
The smallest combination is kept. The emitted program rebuilds the image in raster order.
"""
import lzma, itertools
import numpy as np

AL = [c for c in range(1, 128) if c not in (13, 34, 92)]
TT = "bytes((i-1-(i>13)-(i>34)-(i>92))%256 for i in range(256))"


def b124(b):
    # bytes -> base-124 digit string (divide & conquer for speed)
    n = int.from_bytes(b, 'big')
    def rec(n, k):          # exactly k digits
        if k <= 64:
            out = []
            for _ in range(k):
                n, r = divmod(n, 124); out.append(r)
            return out[::-1]
        h = k // 2
        hi, lo = divmod(n, 124 ** h)
        return rec(hi, k - h) + rec(lo, h)
    k = 1
    while 124 ** k <= n:
        k *= 2
    d = rec(n, k)
    while len(d) > 1 and d[0] == 0:
        d.pop(0)
    return ''.join(chr(AL[x]) for x in d)


def lz(b, lc, lp, pb):
    f = [{'id': lzma.FILTER_LZMA2, 'preset': 9 | lzma.PRESET_EXTREME, 'lc': lc, 'lp': lp, 'pb': pb, 'nice_len': 273}]
    return lzma.compress(b, format=lzma.FORMAT_RAW, filters=f)


def predict(a, mode):
    # a: HxWxC int array; returns prediction from causal neighbours (in the full image)
    L = np.zeros_like(a); L[:, 1:] = a[:, :-1]
    U = np.zeros_like(a); U[1:] = a[:-1]
    UL = np.zeros_like(a); UL[1:, 1:] = a[:-1, :-1]
    if mode == 0: return np.zeros_like(a)
    if mode == 1: return L
    if mode == 2: return U
    if mode == 3: return (L + U) >> 1
    if mode == 4:
        p = L + U - UL; pa = abs(p - L); pb = abs(p - U); pc = abs(p - UL)
        return np.where((pa <= pb) & (pa <= pc), L, np.where(pb <= pc, U, UL))
    mx = np.maximum(L, U); mn = np.minimum(L, U)
    return np.where(UL >= mx, mn, np.where(UL <= mn, mx, L + U - UL))


DEC = r'''
import lzma
from PIL import Image
def f(l):
 if len(l)<99:
  n=0
  for c in l:n=n*124+c
  return n
 h=len(l)//2;return f(l[:h])*124**(len(l)-h)+f(l[h:])
z=lzma.decompress(f(S.encode().translate(%(TT)s)).to_bytes(%(NB)d,'big'),lzma.FORMAT_RAW,None,[{'id':lzma.FILTER_LZMA2,'lc':%(lc)d,'lp':%(lp)d,'pb':%(pb)d}])
W,H,C,B,M,X,PL,NT,NP=%(hdr)r
t=z[:NT*4];r=z[NT*4:]
src={t[4*k]<<8|t[4*k+1]:t[4*k+2]<<8|t[4*k+3] for k in range(NT)}
R=[0]*(W*H*C)
TW=(W+B-1)//B if B else 1
N=W*H-NP
if PL:r=[r[c*N+k] for k in range(N) for c in range(C)]
p=0
for y in range(H):
 for x in range(W):
  if B and (y//B)*TW+x//B in src:
   s=src[(y//B)*TW+x//B];o=(((s//TW)*B+y%%B)*W+(s%%TW)*B+x%%B)*C
   for c in range(C):R[(y*W+x)*C+c]=R[o+c]
   continue
  for c in range(C):
   i=(y*W+x)*C+c
   L=R[i-C] if x else 0;U=R[i-W*C] if y else 0;Q=R[i-W*C-C] if x and y else 0
   if M==0:P=0
   elif M==1:P=L
   elif M==2:P=U
   elif M==3:P=(L+U)>>1
   elif M==4:
    e=L+U-Q;a=abs(e-L);b=abs(e-U);g=abs(e-Q);P=L if a<=b and a<=g else(U if b<=g else Q)
   else:P=min(L,U) if Q>=max(L,U) else(max(L,U) if Q<=min(L,U) else L+U-Q)
   R[i]=(r[p]+P)&255;p+=1
if X:
 for i in range(0,W*H*3,3):g=R[i+1];R[i]=(R[i]+g)&255;R[i+2]=(R[i+2]+g)&255
if C==1:pal=%(pal)r;R=[b for v in R for b in pal[3*v:3*v+3]]
Image.frombytes('RGB',(W,H),bytes(R)).save(OUT)
'''


LZP = ((0, 0, 0), (4, 0, 0))


def build(img, tiles=(0, 8), log=None):
    W, H = img.size
    rgb = np.asarray(img.convert('RGB')).astype(np.int32)
    cols, inv = np.unique((rgb[:, :, 0] << 16) | (rgb[:, :, 1] << 8) | rgb[:, :, 2], return_inverse=True)
    variants = []
    if len(cols) <= 256:
        # palette ordered by luminance-ish to keep index deltas small
        order = np.argsort(cols)
        rank = np.empty_like(order); rank[order] = np.arange(len(order))
        idx = rank[inv.reshape(H, W)][:, :, None]
        pal = []
        for c in cols[order]:
            pal += [int(c >> 16), int(c >> 8 & 255), int(c & 255)]
        variants.append(('pal', idx, 1, pal))
    variants.append(('rgb', rgb, 3, []))
    best = None
    for name, A, C, pal in variants:
        for B in tiles:
            # tile dictionary
            src = {}
            if B:
                TW = (W + B - 1) // B; TH = (H + B - 1) // B
                seen = {}
                for ty in range(TH):
                    for tx in range(TW):
                        blk = A[ty * B:(ty + 1) * B, tx * B:(tx + 1) * B]
                        if blk.shape[0] < B or blk.shape[1] < B:
                            continue
                        key = blk.tobytes()
                        k = ty * TW + tx
                        if key in seen:
                            src[k] = seen[key]
                        else:
                            seen[key] = k
                if len(src) * 4 > 65535 * 4 or TW * TH > 65535:
                    src = {}
            mask = np.ones((H, W), bool)
            if src:
                TW = (W + B - 1) // B
                for k in src:
                    ty, tx = divmod(k, TW); mask[ty * B:(ty + 1) * B, tx * B:(tx + 1) * B] = False
            tbl = b''.join(bytes([k >> 8, k & 255, s >> 8, s & 255]) for k, s in sorted(src.items()))
            for X in ((0, 1) if C == 3 else (0,)):
                for M in (0, 1, 2, 4, 5):
                    P = predict(A, M)
                    res = (A - P) & 255
                    if X:
                        g = res[:, :, 1:2]
                        # decorrelate residuals: R-G, B-G of the residual (decoder undoes on values, so do it on values)
                    if X:
                        Av = A.copy(); Av[:, :, 0] = (A[:, :, 0] - A[:, :, 1]) & 255; Av[:, :, 2] = (A[:, :, 2] - A[:, :, 1]) & 255
                        P = predict(Av, M); res = (Av - P) & 255
                    sel = res[mask].astype(np.uint8)
                    for PL in ((0, 1) if C == 3 else (0,)):
                        stream = sel.tobytes() if not PL else sel.T.tobytes()
                        for lc, lp, pb in LZP:
                            z = lz(tbl + stream, lc, lp, pb)
                            cand = (len(z), name, B, X, M, PL, lc, lp, pb, z, C, pal, len(src), int((~mask).sum()))
                            if best is None or cand[0] < best[0]:
                                best = cand
                    if log: log('  lz %s B=%d X=%d M=%d -> best so far %d' % (name, B, X, M, best[0]))
    n, name, B, X, M, PL, lc, lp, pb, z, C, pal, NT, NPX = best
    hdr = (W, H, C, B, M, X, PL, NT, NPX)
    code = DEC % dict(TT=TT, NB=len(z), lc=lc, lp=lp, pb=pb, hdr=hdr, pal=pal)
    data = b124(z)
    prog = 'S="""' + data + '"""' + code
    info = dict(method='dict+lzma', palette=(name == 'pal'), tile=B, dup_tiles=NT, colour_transform=bool(X),
                predictor=['none', 'left', 'up', 'avg', 'paeth', 'med'][M], planar=bool(PL), lzma=(lc, lp, pb),
                lzma_bytes=len(z), data_bytes=len(data) + 8, code_bytes=len(prog) - len(data) - 8)
    return prog, info
