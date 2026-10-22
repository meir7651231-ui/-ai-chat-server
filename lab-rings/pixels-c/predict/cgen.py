"""cgen.py -- decoder half of the "predict" engine, C target.

Turns a pxenc digit stream (radix 251, RB=251) into ONE standalone C file:
    gcc -O2 prog.c -o prog && ./prog OUT.ppm
The decoder is the bit-exact mirror of pxenc.c (same integer model, same context expressions:
they are read out of pxenc.c itself, so encoder and decoder cannot drift apart).  The program
reads no input; the arithmetic-coder digits live in one string literal, one byte per digit,
alphabet = bytes 1..255 minus LF, CR, '"' and backslash (251 symbols, 7.97 bits per byte).
Only the contexts / mixer gates enabled in cfg are emitted, then the source is minified (cmin.py, with its
macro-dictionary pass for the final program).
"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import cmin

RB = 251
ALPH = [c for c in range(1, 256) if c not in (10, 13, 34, 92)]
assert len(ALPH) == RB


def _calls(src, name):
    out, i = [], 0
    while True:
        j = src.find(name + '(', i)
        if j < 0:
            return out
        if src[j - 1].isalnum() or src[j - 1] == '_':
            i = j + 1; continue
        k = st = j + len(name) + 1; d = 1
        while d:
            d += {'(': 1, ')': -1}.get(src[k], 0); k += 1
        a, b = src[st:k - 1].split(',', 1)
        if a.strip().isdigit():
            out.append((int(a), b.strip()))
        i = k


_src = open(os.path.join(HERE, 'pxenc.c')).read()
_ctx = _calls(_src, 'CTX')
_sel = _calls(_src, 'MSEL')
FLATCTX = [e for i, e in _ctx[:5]]                      # flat-neighbourhood contexts (always all five)
CTXC = dict(_ctx[5:])                                   # channel contexts, id -> C expression
FLATSEL = dict(_sel[:4])                                # flat mixer gates (MS bits 0,1,2,4)
SELC = dict(_sel[4:])                                   # channel mixer gates
assert len(CTXC) == 43 and sorted(FLATSEL) == [0, 1, 2, 4] and len(SELC) == 6

MACROS = {
    'K': '#define K 1024LL',
    'CL': '#define CL(v) ((v)<-32?-32:(v)>32?32:(v))',
    'C2': '#define C2(v) ((v)<-2?((v)<-8?0:1):(v)>2?((v)>8?8:7):(v)+4)',
    'S3': '#define S3(v) ((v)>0?2:(v)<0?1:0)',
    'NR': '#define NR(v) (fdiv((L)((v)-lo)*@NQ@,rg))',
}

OUT_PPM = r'''FILE*F=fopen(av[1],"wb");fputs("P6 @W@ @H@ 255\n",F);fwrite(O,1,@NPX3@,F);'''

# self-contained PNG writer (stored deflate blocks, own CRC32/Adler32; no zlib/libpng)
PNG_FUNCS = r'''FILE*F;unsigned cr;
void pb(int b){putc(b,F);cr^=b&255;for(int k=8;k--;)cr=cr>>1^0xEDB88320&-(cr&1);}
void p4(unsigned v){for(int k=24;k>=0;k-=8)pb(v>>k);}
void ck(char*t,int n){unsigned c;p4(n);cr=~0;for(;*t;)pb(*t++);}
void ce(){unsigned c=~cr;p4(c);}
'''
OUT_PNG = r'''F=fopen(av[1],"wb");fwrite("\211PNG\r\n\32\n",1,8,F);ck("IHDR",13);p4(@W@);p4(@H@);pb(8);pb(2);pb(0);pb(0);pb(0);ce();
{unsigned n=@H@*(@W@*3+1),a=1,b=0,i,j,l;ck("IDAT",n+n/65535*5+11);pb(120);pb(1);
for(i=0;i<n;i+=l){l=n-i<65535?n-i:65535;pb(i+l>=n);pb(l);pb(l>>8);pb(~l);pb(~l>>8);for(j=i;j<i+l;j++){int y=j/(@W@*3+1),x=j%(@W@*3+1),v=x?O[y*@W@*3+x-1]:0;pb(v);a=(a+v)%65521;b=(b+a)%65521;}}
p4(b<<16|a);ce();ck("IEND",0);ce();}'''

TEMPLATE = r'''#include<stdio.h>
#include<stdlib.h>
typedef long long L;typedef unsigned long long U;typedef unsigned short H;
#define M 0x9E3779B97F4A7C15
#define FOR(i,n) for(i=0;i<n;i++)
@MACROS@
char*D="@DATA@";
int SQ[4095],ST[4096],RT[32],di,nm,nk,ms[6],a1,a2,FW[448],al_,aw_;U hb[64],r,x;unsigned*T;int*MW[6];H*A1,*A2;
@PNGF@
int sq(int d){return SQ[(d>2047?2047:d<-2047?-2047:d)+2047];}
L fdiv(L a,L b){return a/b-(a%b<0);}
int q(int v){int a=abs(v),r=(a>0)+(a>2)+(a>6)+(a>14)+(a>30)+(a>62);return v<0?-r:r;}
int med(int a,int b,int c){int x=a>b?a:b,n=a<b?a:b;return c>=x?n:c<=n?x:a+b-c;}
int cl(int v){return v<0?0:v>255?255:v;}
void sc(int*p,int*g,int o,int*f,int n,int*R){R[0]=-1;R[1]=999;for(;n--;f++){int G=g[o+*f],v=p[o+*f]+G;if(G>R[0])R[0]=G,R[2]=v;if(G<R[1])R[1]=G,R[3]=v;}}
void hh(L*v,int n,int c){FOR(nm,n)hb[nm]=(U)(v[nm]*256+nm*4+c)*M>>20&@TM@;}
int ip(H*a){return a[al_]*(128-aw_)+a[al_+1]*aw_>>11;}
void au_(H*a,int u){u*=65535;a[al_]+=(u-a[al_])*(128-aw_)>>13;a[al_+1]+=(u-a[al_+1])*aw_>>13;}
int dg(){int c=di<@ND@?D[di++]&255:1;return c-1-(c>10)-(c>13)-(c>34)-(c>92);}
int cb(int nd,int mn){
 int s[64],ix[64],pk[7],sk[7],i,k,b,u,p,pf,e,*w,*wp[6],*f=FW+mn*7;L t;unsigned v[64];
 H*A=A1+(a1*64+mn)*33,*B=A2+(a2*64+mn&65535)*33;
 FOR(i,nm)ix[i]=hb[i]+((U)nd*0x9E3779B1&1048575),v[i]=T[ix[i]],s[i]=ST[v[i]>>12];
 s[nm]=256;
 FOR(k,nk){w=wp[k]=MW[k]+(ms[k]*64+mn)*@SW@;for(t=i=0;i<=nm;i++)t+=(L)w[i]*s[i];pk[k]=sq(t>>16);sk[k]=ST[pk[k]];}
 for(sk[nk]=256,t=k=0;k<=nk;k++)t+=(L)f[k]*sk[k];
 pf=sq(t>>16);u=ST[pf]+2048;al_=u>>7;aw_=u&127;
 p=(@PFA@(ip(A)+ip(B)+1>>1)*@A2W@+2)>>2;
 p=p<1?1:p>4095?4095:p;
 U z=r*p>>12;(b=x<z)?r=z:(x-=z,r-=z);
 for(;r<@BOT@;r*=@RB@)x=x*@RB@+dg();
 au_(A,b);au_(B,b);
 for(e=((b<<12)-pf)*@LRF@,k=0;k<=nk;k++)f[k]+=sk[k]*e>>14;
 FOR(k,nk)if(e=(b<<12)-pk[k],e>=@ETH@||e<=-@ETH@)for(w=wp[k],e*=@LR@,i=0;i<=nm;i++)w[i]+=s[i]*e>>14;
 FOR(i,nm)u=v[i]&255,p=v[i]>>8,v[i]=p+(((L)(b<<16)-p)*RT[u]>>16)<<8|(u<@LIM@?u+1:u);
 FOR(i,nm)T[ix[i]]=v[i];
 return b;}
int main(int ac,char**av){
 int t[33]={1,2,3,6,10,16,27,45,73,120,194,310,488,747,1101,1546,2047,2549,2994,3348,3607,3785,3901,3975,4024,4050,4068,4079,4085,4089,4092,4093,4094},i,j,k,c,y,X,o,e,PW=@PW@,N=@NN@,*P[3],*E[3],*pk=calloc(N,4),*mt=calloc(1<<22,4),mp=0,mlen=0,zrun=0,A[4],Bv[4],f8[8]={-1,-PW,-PW-1,-PW+1,-2,-2*PW,-PW-2,-PW+2},fz[7]={2-PW,-2*PW,1-2*PW,2-2*PW,-2,-1-2*PW,-2-PW};
 unsigned char*O=malloc(@NPX3@),*op=O;
 for(e=0,i=-2047;i<2048;i++)for(j=i&127,k=(i>>7)+16,SQ[i+2047]=t[k]*(128-j)+t[k+1]*j+64>>7;e<=SQ[i+2047];)ST[e++]=i;
 for(j=e;j<4096;)ST[j++]=2047;
 FOR(i,32)RT[i]=131072/(2*i+3);
 T=malloc(4*@TS@);FOR(i,@TS@)T[i]=8388608;
 FOR(k,@NK@)for(MW[k]=malloc(4*65536*@SW@),i=0;i<65536*@SW@;i++)MW[k][i]=@WI@;
 FOR(i,448)FW[i]=32768;
 A2=malloc(2*33*69632);A1=A2+65536*33;
 FOR(i,69632*33)A2[i]=sq(i%33*128-2048)*16;
 for(r=1,i=0;i<4;i++)r*=@RB@,x=x*@RB@+dg();
 FOR(c,3)P[c]=calloc(N,4)@EALLOC@;
 FOR(y,@H@)FOR(X,@W@){
  int @EGDECL@Z=0,useZ,G0;o=(y+2)*PW+X+2;
@MATCHLOOK@  int*nn=pk+o-PW;useZ=pk[o-1]==*nn&&*nn==nn[-1]&&*nn==nn[1];
  if(useZ){int W_=pk[o-1],eqp=0,zr=zrun>15?15:zrun,mz=mp?1+(pk[mp]==W_)+2*(mlen>15?15:mlen):0;
   FOR(k,7)eqp+=(pk[o+fz[k]]==W_)<<k;
   L cv[]={@FLATCTX@};
   hh(cv,5,3);a1=zr;a2=1000+zr;@FLATSEL@
   if(Z=cb(7000,60))FOR(c,3)P[c][o]=P[c][o-1];}
  if(Z)zrun++;else{FOR(c,3){int*p=P[c],Wv=p[o-1],Nv=p[o-PW],NW=p[o-PW-1],NE=p[o-PW+1],@NBDECL@pr=med(Wv,Nv,NW),@LDECL@qa,a,*g=P[0],d,om,t16;
    G0=g[o];
    if(c){sc(p,g,o,f8,4,A);d=A[0]-A[1];om=med(Wv+g[o-1],Nv+g[o-PW],NW+g[o-PW-1])-G0;
     if(d<@LT@)pr=om;else{t16=fdiv((L)(G0-A[1])*(A[2]-A[3])*16+d/2,d);pr=cl(A[3]+(t16+8>>4))-G0;@LFR@}
@ALT@@LP2@}
    a=abs(Wv-NW)+abs(Nv-NW)+abs(Nv-NE);for(qa=k=0;k<9;)qa+=a>"\0\2\5\t\17\30\47\77\143"[k++];
@EXTRA@    L cv[]={@CTX@};
    hh(cv,@NC@,c);a1=c*16+qa;a2=@MST@;@SEL@
    if(cb(0,0))e=0;else{int s=cb(1,1),n=0;while(cb(2+n+s*16,2+n+s*16))n++;for(e=1,k=0;k<n;k++)e=e*2+cb(64+s*4096+n*256+(k?128+k*4+(e&3):e),34+n+s*10);if(s)e=-e;}
    p[o]=pr+e;@ESTORE@}
   zrun=0;}
  G0=P[0][o];j=P[1][o]+G0;k=P[2][o]+G0;*op++=j;*op++=G0;*op++=k;pk[o]=j<<16|G0<<8|k;
@MATCHUPD@ }
 @OUT@
 return 0;}
'''


def gen_source(digits, W, H, cfg, png=False):
    """-> C source (unminified, data placeholder @DATA@) specialised to cfg"""
    cm, msk = cfg['CM'], cfg['MS']
    ctxs = [i for i in range(64) if cm >> i & 1]
    assert all(i in CTXC for i in ctxs), "context without C mirror"
    sels = [i for i in range(6) if msk >> i & 1]
    MR = cfg['MR']
    # without the match model (MR=0) the match context is the constant 0 (ev/mlen are not declared then)
    exprs = [CTXC[i].replace('MR&&mp', 'mp') if MR else ('0' if 'MR&&mp' in CTXC[i] else CTXC[i]) for i in ctxs]
    selx = [SELC[i] for i in sels]
    ids = set(re.findall(r'[A-Za-z_]\w*', ' '.join(exprs + selx)))
    decl, stmt = [], ''
    needE = bool(ids & {'eW', 'eN', 'eNW', 'eNE'})
    if needE:
        decl.append('*Ec=E[c],eW=Ec[o-1],eN=Ec[o-PW],eNW=Ec[o-PW-1],eNE=Ec[o-PW+1]')
    if ids & {'lo', 'hi', 'qr', 'NR'}:
        decl.append('lo=Wv,hi=Wv,rg,qr,vv[6]={Nv,NW,NE,NN,WW,NEE}')
        stmt += 'FOR(k,6){if(vv[k]<lo)lo=vv[k];if(vv[k]>hi)hi=vv[k];}rg=hi-lo;if(rg<1)rg=1;qr=(rg>3)+(rg>7)+(rg>15)+(rg>31)+(rg>63)+(rg>127);'
    if ids & {'GW', 'GN'}:
        decl.append('GW=g[o-1],GN=g[o-PW]')
    if MR:
        decl.append('ev=mp?CL(p[mp]-pr):0')
    if ids & {'up', 'dn'}:
        decl.append('up=0,dn=0,uu[12]={NWW,NW,Nv,NE,NEE,WW,Wv,NN,NNE,NNW,p[o-2*PW+2],p[o-2*PW-2]}')
        stmt += 'FOR(k,12)up+=uu[k]>pr,dn+=uu[k]<pr;'
    extra = ('    int %s;%s\n' % (','.join(decl), stmt)) if decl else ''
    ldecl = ''.join(v + '=0,' for v in ('lfr', 'lp2', 'alt') if v in ids)
    nb_all = dict(WW='p[o-2]', NN='p[o-2*PW]', NNE='p[o-2*PW+1]', NWW='p[o-PW-2]', NEE='p[o-PW+2]', NNW='p[o-2*PW-1]')
    nbused = set(ids)
    if ids & {'lo', 'hi', 'qr', 'NR'}: nbused |= {'NN', 'WW', 'NEE'}
    if ids & {'up', 'dn'}: nbused |= set(nb_all)
    nbdecl = ''.join('%s=%s,' % (k, v) for k, v in nb_all.items() if k in nbused)
    lfr = ('lfr=1+(t16+8&15)+16*(q(A[2]-A[3])+8)+256*((d>3)+(d>7)+(d>15)+(d>31));' if 'lfr' in ids else '')
    alt = ('     alt=1+(CL(om-pr)+40)*128+CL(med(Wv,Nv,NW)-pr)+40;\n' if 'alt' in ids else '')
    lp2 = ('     sc(p,g,o,f8,8,Bv);d=Bv[0]-Bv[1];if(d>=@LT@)t16=fdiv((L)(G0-Bv[1])*(Bv[2]-Bv[3])*16+d/2,d),lp2=1+CL(cl(Bv[3]+(t16+8>>4))-G0-pr)+64;\n'
           if 'lp2' in ids else '')
    egdecl = ''.join(v + '=0,' for v in ('eg', 'er_') if v in ids)
    estore = ('E[c][o]=e;' if needE else '') + ('if(!c)eg=e;' if 'eg' in ids else '') + ('er_=e;' if 'er_' in ids else '')
    if MR:
        mk = [1, 0x2F0B3A49, 0x9E3779B1, 0x85EBCA77, 0xC2B2AE3D, 0x27D4EB2F, 0x165667B1, 0xD3A2646C, 0xFD7046C5, 0xB55A4F09]
        offs = ["o-1", "o-PW", "o-PW-1", "o-PW+1", "o-2", "o-2*PW", "o-2*PW+1", "o-PW-2", "o-PW+2", "o-2*PW-1"]
        mh = '+'.join(('pk[%s]*%dull' % (offs[k], mk[k])) if mk[k] != 1 else 'pk[%s]' % offs[k] for k in range(MR))
        if MR == 1:
            mh = '(U)' + mh
        look = '  int mh=(%s)*M>>40&4194303;if(!mlen||!mp)mp=mt[mh],mlen=0;\n' % mh
        upd = '  if(mp&&pk[mp]==pk[o])mlen++,mp++;else mlen=mp=0;mt[mh]=o;\n'
        mst = 'c*130+(mp?(ev+32)*2+(mlen>2)+1:0)'
    else:
        look = upd = ''
        mst = 'c*130'
    fs = [FLATSEL[i] for i in sels if i in FLATSEL]
    flatsel = ''.join('ms[%d]=%s;' % (j, 'a1' if e == 'zr' else e) for j, e in enumerate(fs)) + 'nk=%d;' % len(fs)
    sel = ''.join('ms[%d]=%s;' % (j, 'a1' if e == 'c*16+qa' else e.replace('mst', 'a2')) for j, e in enumerate(selx)) + 'nk=%d;' % len(selx)
    a1w = 4 - cfg['APMW']
    rep = {
        '@MATCHLOOK@': look, '@MATCHUPD@': upd, '@EXTRA@': extra, '@LFR@': lfr, '@ALT@': alt, '@LP2@': lp2,
        '@LDECL@': ldecl, '@NBDECL@': nbdecl, '@EGDECL@': egdecl, '@ESTORE@': estore, '@EALLOC@': ',E[c]=calloc(N,4)' if needE else '',
        '@FLATCTX@': ','.join(e.replace('(ll)', '') for e in FLATCTX), '@FLATSEL@': flatsel,
        '@CTX@': ','.join(exprs), '@NC@': str(len(ctxs)), '@SEL@': sel, '@MST@': mst,
        '@PFA@': ('pf*%d+' % a1w if a1w > 1 else 'pf+' if a1w == 1 else ''),
        '@OUT@': OUT_PNG if png else OUT_PPM, '@PNGF@': PNG_FUNCS if png else '',
    }
    code = TEMPLATE
    for k, v in rep.items():
        code = code.replace(k, v)
    tb = cfg['TB']
    rep2 = {'@SW@': str(max(len(ctxs), 5) + 1), '@NK@': str(max(len(sels), len(fs), 1)),
            '@A2W@': str(cfg['APMW']), '@LRF@': str(cfg['LRF']),
            '@ETH@': str(cfg['ETH']), '@LR@': str(cfg['LR']), '@LT@': str(cfg['LT']), '@LIM@': str(cfg['LIM']),
            '@WI@': str(cfg['WI']), '@NQ@': str(cfg['NQ']), '@TM@': str((1 << tb) - 1), '@TS@': str((1 << tb) + (1 << 20)),
            '@RB@': str(RB), '@BOT@': str(RB ** 3), '@W@': str(W), '@H@': str(H), '@PW@': str(W + 4), '@NN@': str((W + 4) * (H + 2)), '@NPX3@': str(W * H * 3), '@ND@': str(len(digits))}
    toks = set(re.findall(r'[A-Za-z_]\w*', code))
    macros = '\n'.join(MACROS[m] for m in ('K', 'CL', 'C2', 'S3', 'NR') if m in toks or (m == 'CL' and 'NR' in toks))
    code = code.replace('@MACROS@', macros)
    for k, v in rep2.items():
        code = code.replace(k, v)
    assert '@' not in code.replace('@DATA@', ''), re.findall(r'@\w+@', code)
    return code


def gen(digits, W, H, cfg, png=False, macros=True):
    """-> (program bytes, code bytes, data bytes); data bytes = one byte per arithmetic-coder digit.
    macros: run cmin's macro-dictionary pass (final programs; the search's code_size() skips it, as it can
    only shrink the file).  The data literal goes through cmin.literal() (a rare 2-byte '""' split)."""
    code = gen_source(digits, W, H, cfg, png)
    mini, _ = cmin.minify(code.replace('@DATA@', 'DATAMARK'), keep=('DATAMARK',), macros=macros)
    data = bytes(ALPH[d] for d in digits)
    assert mini.count(b'"DATAMARK"') == 1
    lit = cmin.literal(data)
    prog = mini.replace(b'"DATAMARK"', b'"' + lit + b'"')
    return prog, len(prog) - len(lit), len(lit)


def code_size(W, H, cfg, ndig, png=False):
    """exact program size for a stream of ndig digits (used by the encoder's parameter search)"""
    code = gen_source([0] * ndig, W, H, cfg, png)
    mini, _ = cmin.minify(code.replace('@DATA@', 'DATAMARK'), keep=('DATAMARK',))
    return len(mini) - len(b'DATAMARK') + ndig
