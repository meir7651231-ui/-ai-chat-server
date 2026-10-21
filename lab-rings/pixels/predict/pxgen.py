"""pxgen.py -- decoder half of the "predict" engine: turns a pxenc digit stream into a standalone
Python program (Pillow + stdlib only).  The decoder below is the bit-exact mirror of pxenc.c.

Layout of a generated program:
    import lzma
    D=b'''<base-124 digits: lzma-compressed decoder code, then the arithmetic-coded residuals>'''
    x=0; for c in D[:n]: x=x*124+digit(c)        # bignum -> compressed decoder source
    exec(lzma.decompress(...))                    # defines F(D,W,H) -> RGB bytes
    Image.frombytes('RGB',(W,H),bytes(F(D[n:],W,H))).save(OUT)
Digits 0..123 are written as the ASCII bytes 1..127 minus CR(13), quote(39) and backslash(92),
so the literal survives text-mode reading (universal newlines) and needs no escapes.
"""
import lzma

# Python expressions of the context values (index = context id in pxenc.c; same order => same hash)
CTXPY = {
 0: 'qa',
 1: '(Q[Wv-pr]+8)*16+Q[Nv-pr]+8+256*((Q[NE-pr]+8)*16+Q[NW-pr]+8)',
 2: 'Wv+K*Nv',
 3: 'Wv+K*(Nv+K*(NW+K*NE))',
 4: '(Q[eg]+8)*16+qa+256*((Q[WW-Wv]+8)*16+Q[NN-Nv]+8)',
 5: 'v0+K*(Wv+K*G[pos-1]) if c else pr',
 6: 'Wv+K*(WW+K*(Nv+K*NN))',
 7: 'v0+K*(Nv+K*G[pos-PW]) if c else Wv-NW+K*(Nv-NW)',
 8: 'pr*16+Q[Wv-Nv]',
 9: 'Nv+K*(NE+K*NNE)',
 10: 'eg+K*qa if c else L[NE-pr]+K*L[NW-pr]',
 11: '(eg+K*er_ if c>1 else eg+K*(Wv-pr)) if c else Nv+K*NN',
 12: 'L[eW]+128*(L[eN]+128*(L[eNW]+128*L[eNE]))',
 13: 'Wv+K*(Nv+K*(NE+K*eg))',
 14: '(L[p[mp]-pr]+64)*32+min(ml,15)+1 if mp else 0',
 15: 'Wv+K*(NW+K*NWW)',
 16: 'L[Wv-pr]+K*L[Nv-pr]',
 17: 'L[eW]+K*L[eN]',
 18: 'Nv+K*(NE+K*(NEE+K*NNE))',
 19: 'pr*16+qa',
 20: 'Wv+Nv+K*(NE-NW)',
 21: 'C[NE-Nv]+9*C[NEE-NE]+81*C[Nv-NW]+729*C[NW-NWW]+6561*C[Wv-NW]+59049*C[WW-NWW]',
 22: 'C[NE-Nv]+9*C[Nv-NW]+81*C[Wv-NW]+729*C[NN-Nv]+6561*C[NNE-NE]+59049*C[NNW-NW]',
 23: 'C[NE-Nv]+9*C[NEE-NE]+81*C[Nv-NW]+729*C[Wv-NW]+6561*C[Wv-pr]+59049*C[eg]',
 24: 'C[NE-Nv]+9*C[NEE-NE]+81*C[Nv-NW]+729*C[NW-NWW]+6561*C[Wv-NW]+59049*C[WW-NWW]+531441*(C[NN-Nv]+9*C[NNE-NE]+81*C[NNW-NW]+729*C[Wv-WW])',
 25: 'L[2*Nv-NN-pr]+K*L[2*Wv-WW-pr]',
 26: 'L[Nv+NE-NNE-pr]+K*L[Wv+NE-Nv-pr]',
 27: 'L[Nv+NW-NNW-pr]+K*L[Wv+NW-NWW-pr]',
 28: 'L[NE-pr]+K*L[NEE-pr]',
 29: 'lo-pr+K*(hi-pr)',
 30: '(lo-pr>>2)+K*((hi-pr>>2)+K*qa)',
 31: 'R(Wv)+8*(R(Nv)+8*(R(NW)+8*(R(NE)+8*(R(NN)+8*(R(WW)+8*(qr+8*R(pr)))))))',
 32: 'R(NWW)+8*(R(NW)+8*(R(Nv)+8*(R(NE)+8*(R(NEE)+8*(R(Wv)+8*(qr+8*R(pr)))))))',
 33: 'R(Wv)+8*(R(Nv)+8*(R(NW)+8*(R(NE)+8*(R(NNE)+8*(R(NNW)+8*qr)))))',
 34: 'ud+256*(Q[eg]+8)',
 35: 'ud+256*(S[Wv-pr]*27+S[Nv-pr]*9+S[NW-pr]*3+S[NE-pr])',
 36: 'lf',
 37: 'lf*16+Q[eg]+8',
 38: 'l2*16+Q[eg]+8',
 39: 'l2*1024+lf',
 40: 'al',
 41: 'al*16+Q[eg]+8',
 42: 'min(zn,15)*2+uz',
}
# mixer-gate expressions (pxenc.c MSEL ids); 5 = match state h
MSELPY = {
 0: 'c*16+qa',
 1: 'c*16+Q[eg]+8',
 2: 'c*16+(eW==0)+2*(eN==0)+4*(eNW==0)+8*(eNE==0)',
 3: 'c*64+(Q[eg]+8)*4+(eW==0)+2*(eN==0)',
 4: 'c*256+(Q[Wv-pr]+8)*16+Q[Nv-pr]+8',
 5: 'h',
}

TEMPLATE = r'''from operator import mul,add,rshift
from itertools import repeat
def F(D,W,H):
 D=[c-1-(c>13)-(c>39)-(c>92)for c in D]+[0]*99999
 t=[1,2,3,6,10,16,27,45,73,120,194,310,488,747,1101,1546,2047,2549,2994,3348,3607,3785,3901,3975,4024,4050,4068,4079,4085,4089,4092,4093,4094]
 SQ=[(t[(d>>7)+16]*(128-(d&127))+t[(d>>7)+17]*(d&127)+64)>>7 for d in range(-2047,2048)]
 ST=[];v=-2047
 for p in range(4096):
  while v<2047 and SQ[v+2047]<p:v+=1
  ST+=[v]
 R=[131072//(2*n+3)for n in range(32)];X=[min(n+1,@LIM@)for n in range(32)]
 U=[[(p+((b-p)*R[n]>>16))<<5|X[n]for p in range(65536)for n in range(32)]for b in(0,65536)]
 T=[1048576]*(@TS@);MW={};FW={};AP={};R9=repeat(9);R14=repeat(14)
 A0=[SQ[min(max(j*128-2048,-2047),2047)+2047]*16 for j in range(33)]
 def f(v,a):
  a=abs(a);r=(a>0)+(a>2)+(a>6)+(a>14)+(a>30)+(a>62);return -r if v<0 else r
 Q=[f(i,i)for i in range(2048)]+[f(-1,i-2048)for i in range(2048)]
 L=[min(i,32)for i in range(2048)]+[max(i-2048,-32)for i in range(2048)]
 C=[i+4 if i<3 else 7+(i>8)for i in range(2048)]+[1-(i<-8)if i<-2 else i+4 for i in range(-2048,0)]
 S=[0]+[2]*2047+[1]*2048
 QA=[(a>0)+(a>2)+(a>5)+(a>9)+(a>15)+(a>24)+(a>39)+(a>63)+(a>99)for a in range(4096)]
 B=124;BOT=B**3;Z=[B**4,D[0]*BOT+D[1]*B*B+D[2]*B+D[3],4]
 hb=[];ks=[]
 def cb(n,m):
  ix=list(map((n*2654435761&1048575).__add__,hb));v=list(map(T.__getitem__,ix));s=list(map(ST.__getitem__,map(rshift,v,R9)));s+=[256];ws=[];pk=[];sk=[]
  for k in ks:
   k+=m;w=MW.get(k)
   if w is None:w=MW[k]=[@WI@]*len(s)
   ws+=[w];d=sum(map(mul,w,s))>>16
   if d>2047:d=2047
   elif d<-2047:d=-2047
   p=SQ[d+2047];pk+=[p];sk+=[ST[p]]
  sk+=[256];w=FW.get(m)
  if w is None:w=FW[m]=[32768]*len(sk)
  d=sum(map(mul,w,sk))>>16
  if d>2047:d=2047
  elif d<-2047:d=-2047
  pf=SQ[d+2047];u=ST[pf]+2048;lo=u>>7;wt=u&127;Y=[]
  for y in(ap+m,aq+m):
   A=AP.get(y)
   if A is None:A=AP[y]=A0[:]
   Y+=[A]
  A,V=Y;p=(pf*@A1@+((A[lo]*(128-wt)+A[lo+1]*wt>>11)+(V[lo]*(128-wt)+V[lo+1]*wt>>11)+1>>1)*@A2@+2)>>2
  if p<1:p=1
  elif p>4095:p=4095
  r,x,i=Z;b=r*p>>12
  if x<b:bit=1;r=b
  else:bit=0;x-=b;r-=b
  while r<BOT:x=x*B+D[i];i+=1;r*=B
  Z[:]=r,x,i;g=65535*bit
  for A in Y:A[lo]+=(g-A[lo])*(128-wt)>>13;A[lo+1]+=(g-A[lo+1])*wt>>13
  b=bit<<12;e=(b-pf)*@LRF@;w[:]=map(add,w,map(rshift,map(mul,sk,repeat(e)),R14))
  for w,p in zip(ws,pk):
   e=b-p
   if e>=@ETH@ or e<=-@ETH@:w[:]=map(add,w,map(rshift,map(mul,s,repeat(e*@LR@)),R14))
  any(map(T.__setitem__,ix,map(U[bit].__getitem__,v)))
  return bit
 PW=W+4;N=PW*(H+2);P=[[0]*N for _ in range(3)];E=[[0]*N for _ in range(3)];G=P[0];O=bytearray();K=1024;M=0x9E3779B97F4A7C15
 pk=[0]*N;mt={};mp=ml=zn=0
 for y in range(H):
  for x in range(W):
   o=(y+2)*PW+x+2;eg=er_=v0=0
@MATCHLOOK@   f_=pk[o-1];uz=0
   if f_==pk[o-PW]==pk[o-PW-1]==pk[o-PW+1]:
    uz=1;q=(pk[o-PW+2]==f_)+2*(pk[o-2*PW]==f_)+4*(pk[o-2*PW+1]==f_)+8*(pk[o-2*PW+2]==f_)+16*(pk[o-2]==f_)+32*(pk[o-2*PW-1]==f_)+64*(pk[o-PW-2]==f_);r=min(zn,15);m=1+(pk[mp]==f_)+2*min(ml,15)if mp else 0
    hb[:]=[((f_+16777216*r)*256+3)*M>>20&@TMASK@,((q+128*r)*256+7)*M>>20&@TMASK@,((m+64*q)*256+11)*M>>20&@TMASK@,((f_+16777216*q)*256+15)*M>>20&@TMASK@,((f_+16777216*(m+64*r))*256+19)*M>>20&@TMASK@]
    ks[:]=[@ZSEL@];ap=r*64;aq=4096+(1000+r)*64
    if cb(7000,60):
     for p in P:p[o]=p[o-1]
     zn+=1;uz=2
   if uz<2:
    for c in range(3):
     p=P[c];Wv=p[o-1];Nv=p[o-PW];NW=p[o-PW-1];NE=p[o-PW+1];WW=p[o-2];NN=p[o-2*PW];NNE=p[o-2*PW+1];NWW=p[o-PW-2];NEE=p[o-PW+2];NNW=p[o-2*PW-1]
     a,b,z=Wv,Nv,NW
     if a<b:a,b=b,a
     pr=dm=b if z>=a else a if z<=b else a+b-z;lf=l2=al=0
     if c:
      gx=-1;gn=999
      for i in(o-1,o-PW,o-PW-1,o-PW+1):
       g=G[i]
       if g>gx:gx=g;cx=p[i]+g
       if g<gn:gn=g;cn=p[i]+g
      hx,hn,dx,dn=gx,gn,cx,cn
      for i in(o-2,o-2*PW,o-PW-2,o-PW+2):
       g=G[i]
       if g>hx:hx=g;dx=p[i]+g
       if g<hn:hn=g;dn=p[i]+g
      a,b,z=Wv+G[o-1],Nv+G[o-PW],NW+G[o-PW-1]
      if a<b:a,b=b,a
      pr=om=(b if z>=a else a if z<=b else a+b-z)-v0;d=gx-gn
      if d>=@LT@:t=((v0-gn)*(cx-cn)*16+d//2)//d;pr=cn+(t+8>>4);pr=(0 if pr<0 else 255 if pr>255 else pr)-v0;lf=1+(t+8&15)+16*(Q[cx-cn]+8)+256*((d>3)+(d>7)+(d>15)+(d>31))
      al=1+(L[om-pr]+40)*128+L[dm-pr]+40;d=hx-hn
      if d>=@LT@:t=((v0-hn)*(dx-dn)*16+d//2)//d;t=dn+(t+8>>4);l2=1+L[(0 if t<0 else 255 if t>255 else t)-v0-pr]+64
     qa=QA[abs(Wv-NW)+abs(Nv-NW)+abs(Nv-NE)]
@EXTRA@     hb[:]=[(v*256+j*4+c)*M>>20&@TMASK@ for j,v in enumerate((@CTX@))]
     h=c*130+((L[p[mp]-pr]+32)*2+(ml>2)+1 if mp else 0);ks[:]=[@MSEL@];ap=(c*16+qa)*64;aq=4096+h*64
     if cb(0,0):e=0
     else:
      s=cb(1,1);u=s*16;n=0
      while cb(2+n+u,2+n+u):n+=1
      e=1
      for d in range(n):e=e*2+cb(64+s*4096+n*256+(e if d<1 else 128+d*4+(e&3)),34+n+s*10)
      if s:e=-e
     v=pr+e;p[o]=v;E[c][o]=e
     if c==0:eg=e;v0=v
     er_=e
    zn=0
   g=G[o];r=P[1][o]+g;b=P[2][o]+g;O+=bytes((r,g,b))
   pk[o]=v=r<<16|g<<8|b
@MATCHUPD@ return O
'''

ALPH = [c for c in range(1, 128) if c not in (13, 39, 92)]   # 124 symbols

def encode_digits(digits):
    return bytes(ALPH[d] for d in digits)

def to_digits(bs):
    x = int.from_bytes(bs, 'big'); out = []
    while x: x, r = divmod(x, 124); out.append(r)
    return out[::-1]

def gen_code(W, H, cfg):
    """decoder source specialised to cfg (only the enabled contexts / mixer gates are emitted)"""
    cm = cfg['CM']; ms = cfg['MS']
    ctxs = [i for i in range(64) if cm >> i & 1]
    assert all(i in CTXPY for i in ctxs), "context without Python mirror"
    sels = [i for i in range(6) if ms >> i & 1]
    MR = cfg['MR']; TB = cfg['TB']
    need_R = any(i in ctxs for i in (31, 32, 33))
    need_lohi = need_R or any(i in ctxs for i in (29, 30))
    need_ud = any(i in ctxs for i in (34, 35))
    need_e = any(i in ctxs for i in (12, 17)) or 2 in sels or 3 in sels
    extra = ""
    if need_e:
        extra += "     e=E[c];eW=e[o-1];eN=e[o-PW];eNW=e[o-PW-1];eNE=e[o-PW+1]\n"
    if need_lohi:
        extra += "     lo=min(Wv,Nv,NW,NE,NN,WW,NEE);hi=max(Wv,Nv,NW,NE,NN,WW,NEE);rg=hi-lo or 1\n"
    if need_R:
        extra += "     qr=(rg>3)+(rg>7)+(rg>15)+(rg>31)+(rg>63)+(rg>127);R=lambda v:(v-lo)*%d//rg\n" % cfg['NQ']
    if need_ud:
        extra += "     u=(NWW,NW,Nv,NE,NEE,WW,Wv,NN,NNE,NNW,p[o-2*PW+2],p[o-2*PW-2]);ud=sum(z>pr for z in u)*16+sum(z<pr for z in u)\n"
    items = ",".join(CTXPY[i].replace("pos", "o") for i in ctxs)
    sel = ",".join("(%s)*512+%d" % (MSELPY[i], j * 64) if j else "(%s)*512" % MSELPY[i] for j, i in enumerate(sels))
    zs = {0: "r", 1: "q&15", 2: "m&15", 4: "q>>3"}
    zsel = ",".join("(%s)*512+%d" % (zs[i], j * 64) for j, i in enumerate([i for i in sels if i in zs]))
    code = TEMPLATE
    if MR:
        mk = [1, 0x2F0B3A49, 0x9E3779B1, 0x85EBCA77, 0xC2B2AE3D, 0x27D4EB2F, 0x165667B1, 0xD3A2646C, 0xFD7046C5, 0xB55A4F09]
        offs = ["o-1", "o-PW", "o-PW-1", "o-PW+1", "o-2", "o-2*PW", "o-2*PW+1", "o-PW-2", "o-PW+2", "o-2*PW-1"]
        mh = "+".join(("pk[%s]*%d" % (offs[k], mk[k])) if mk[k] != 1 else "pk[%s]" % offs[k] for k in range(MR))
        code = code.replace("@MATCHLOOK@", "   mh=(%s)*M>>40&4194303\n   if not ml or not mp:mp=mt.get(mh,0);ml=0\n" % mh)
        code = code.replace("@MATCHUPD@", "   if mp and pk[mp]==v:ml+=1;mp+=1\n   else:ml=mp=0\n   mt[mh]=o\n")
    else:
        code = code.replace("@MATCHLOOK@", "").replace("@MATCHUPD@", "")
    rep = {'@LIM@': str(cfg['LIM']), '@TS@': str((1 << TB) + (1 << 20)), '@WI@': str(cfg['WI']),
           '@A1@': str(4 - cfg['APMW']), '@A2@': str(cfg['APMW']), '@LRF@': str(cfg['LRF']),
           '@ETH@': str(cfg['ETH']), '@LR@': str(cfg['LR']), '@LT@': str(cfg['LT']),
           '@EXTRA@': extra, '@TMASK@': str((1 << TB) - 1), '@CTX@': items, '@MSEL@': sel, '@ZSEL@': zsel}
    for k, v in rep.items():
        code = code.replace(k, v)
    return code

def gen(digits, W, H, cfg):
    """-> (program text, code bytes, data bytes); data bytes = one byte per arithmetic-coder digit"""
    code = gen_code(W, H, cfg)
    z = lzma.compress(code.encode(), format=lzma.FORMAT_ALONE, preset=9 | lzma.PRESET_EXTREME)
    cd = to_digits(b'\x01' + z)          # leading 0x01 byte keeps leading zero bytes of z
    n = len(cd)
    data = encode_digits(cd + list(digits)).decode('ascii')
    prog = ("import lzma\nD=b\'\'\'%s\'\'\'\nx=0\nfor c in D[:%d]:x=x*124+c-1-(c>13)-(c>39)-(c>92)\n"
            "exec(lzma.decompress(x.to_bytes(%d,'big')[1:]))\n"
            "from PIL import Image\nImage.frombytes('RGB',(%d,%d),bytes(F(D[%d:],%d,%d))).save(OUT)\n") % (data, n, len(z) + 1, W, H, n, W, H)
    total = len(prog.encode())
    return prog, total - len(digits), len(digits)
