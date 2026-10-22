// pxenc.c -- encoder half of the "predict" image->program engine.
//
// Reads raw RGB (W*H*3 bytes), predicts every sample from already-coded neighbours and codes the
// prediction residual with a binary context-mixing model + arithmetic coder whose output alphabet
// is 124 printable/ASCII symbols (so the stream can live inside a Python bytes literal).
// The generated Python program (pxgen.py) contains the bit-exact mirror of this model.
//
// usage: pxenc in.rgb W H out.digits [KEY=value ...]
//        pxenc --serve   (worker mode: one job per stdin line "in.rgb W H out.digits KEY=value...", one
//                         result line per job; the big tables stay allocated (transparent huge pages) between jobs)
//   keys: TB LR LIM LRF APMW LT MR NQ WI ETH CM(context mask) MS(mixer-selector mask) ENC(0=cost only) RB(radix, 124)
// px-c changes (output for RB=124 is byte-identical to px-predict/pxenc.c): runtime radix RB, one packed counter table,
// software prefetch of each residual's decision slots (speed only).
//
// Model summary (per pixel, raster order):
//  * flat neighbourhood (W==N==NW==NE as RGB): one binary "pixel == W" decision with 5 cheap contexts
//  * otherwise channels G, R-G, B-G in turn:
//      G: MED predictor.  R,B: colour-line predictor (line through the min-G and max-G neighbours,
//      evaluated at the current G; falls back to MED of the channel when the neighbours are flat).
//      residual binarised as zero?/sign/exp-Golomb bucket (unary)/mantissa bits; every binary
//      decision is predicted by ~28 hashed context counters, 4 gated logistic mixers, a final
//      mixer and two interpolated SSE stages (APM).
//  * a 2-D match model (hash of 4 causal neighbour pixels -> last position) supplies the
//      "what came after this neighbourhood last time" value as context, mixer gate and SSE context.
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <math.h>
#include <sys/mman.h>
typedef long long ll; typedef unsigned long long ull;

static int SQ[4095], ST[4096];
static int sq(int d){ if(d>2047)d=2047; if(d<-2047)d=-2047; return SQ[d+2047]; }
static void tables(void){
  static const int t[33]={1,2,3,6,10,16,27,45,73,120,194,310,488,747,1101,1546,2047,2549,2994,3348,3607,3785,3901,3975,4024,4050,4068,4079,4085,4089,4092,4093,4094};
  for(int d=-2047; d<=2047; d++){ int w=d&127, i=(d>>7)+16; SQ[d+2047]=(t[i]*(128-w)+t[i+1]*w+64)>>7; }
  int pi=0; for(int x=-2047;x<=2047;x++){ int v=sq(x); for(int j=pi;j<=v;j++) ST[j]=x; pi=v+1; } for(int j=pi;j<4096;j++) ST[j]=2047;
}
static ll fdiv(ll a, ll b){ ll q=a/b; if((a%b!=0)&&((a<0)!=(b<0))) q--; return q; }   // floor division (= Python //)

// ---------------- parameters
static int TB=25, LR=12, LIM=30, LRF=4, APMW=3, LT=2, MR=4, NQ=5, WI=4000, ETH=256;
static ull CMASK=6390440155575ULL; static unsigned MSMASK=53;
static ull TM; static const ull OM=(1<<20)-1;
// ---------------- model state
#define NM 48
#define NK 6
#define MNODES 64
#define MSELN 1024
static uint32_t *Tt;                               // counter table: probability (16 bit) << 8 | count (one cache line per lookup)
static int nm; static ull hb[NM];                   // per-sample context slots
static ll cvl[64]; static int cen[64];
static int nk; static int msel[NK];                 // mixer gates
static int *MWt[NK];
static int FW[MNODES][NK+1];
static int RT[256];
static int apmsel, apmsel2; static uint16_t (*APM)[33], (*APM2)[33];
// ---------------- arithmetic coder, base-124 digits
static ull B=124, BOT, TOP, B2=0;                  // output radix (RB=, default 124 = Python-literal alphabet; 251 for C literals)
                                                   // RB2=r: a second coder in radix r codes the same decisions -> out.digits.2
typedef struct { ull B, BOT, TOP, low, rng; uint8_t *out; long nout; } Coder;
static Coder cdr[2]; static int ncdr=1; static int ENCODE=1;
static double cost; static long ndec; static double ccost[3]; static FILE*trf;
static long st_flat, st_copy, st_zero[3], st_n[3], st_match, st_mhit, st_line;   // statistics only
// buffers are kept between jobs of one process (--serve: 2 MB aligned + MADV_HUGEPAGE, faulted in once)
static int thp;
static void*getbuf(int slot, size_t n, int zero){
  static void*p[32]; static size_t sz[32];
  if(n>sz[slot]){ free(p[slot]); size_t a=1<<21, m=(n+a-1)/a*a; p[slot]=thp?aligned_alloc(a,m):malloc(m);
    if(!p[slot]){ fprintf(stderr,"out of memory\n"); exit(1); }
    if(thp) madvise(p[slot],m,MADV_HUGEPAGE);
    sz[slot]=m; }
  if(zero) memset(p[slot],0,n);
  return p[slot];
}
static void carry(Coder*c){ long i=c->nout-1; while(1){ c->out[i]++; if(c->out[i]<c->B) break; c->out[i]=0; i--; } }
static void encbit1(Coder*c, int bit, int p){
  ull bound=(c->rng*p)>>12;
  if(bit) c->rng=bound; else { c->low+=bound; c->rng-=bound; }
  if(c->low>=c->TOP){ c->low-=c->TOP; carry(c); }
  while(c->rng<c->BOT){ c->out[c->nout++]=(uint8_t)(c->low/c->BOT); c->low=(c->low%c->BOT)*c->B; c->rng*=c->B; }
}
static void encbit(int bit, int p){ for(int k=0;k<ncdr;k++) encbit1(cdr+k,bit,p);
}
static void encflush(Coder*c){
  ull hiv=c->low+c->rng-1, v=c->low, pw=c->TOP;          // value in [low,low+rng) with most trailing zero digits
  while(pw>1){ ull q=(hiv/pw)*pw; if(q>=c->low){ v=q; break; } pw/=c->B; }
  if(v>=c->TOP){ v-=c->TOP; carry(c); }
  for(int k=0;k<4;k++){ c->out[c->nout++]=(uint8_t)(v/c->BOT); v=(v%c->BOT)*c->B; }
  while(c->nout>0 && c->out[c->nout-1]==0) c->nout--;    // decoder pads with zero digits
}

static int code_bit(int bit, int node, int mn){
  int st[NM+1], idx[NM], pv[NM], cn_[NM]; int pk[NK], sk[NK+1];
  int no=(int)(((ull)node*0x9E3779B1ULL)&OM);
  for(int i=0;i<nm;i++){ idx[i]=(int)hb[i]+no; uint32_t tv=Tt[idx[i]]; pv[i]=tv>>8; cn_[i]=tv&255; st[i]=ST[pv[i]>>4]; }
  st[nm]=256;
  for(int k=0;k<nk;k++){ int *w=MWt[k]+((ll)(msel[k]*MNODES+mn)*(NM+1)); ll dot=0; for(int i=0;i<=nm;i++) dot+=(ll)w[i]*st[i]; pk[k]=sq((int)(dot>>16)); sk[k]=ST[pk[k]]; }
  int *f=FW[mn]; ll dot=0; sk[nk]=256; for(int k=0;k<=nk;k++) dot+=(ll)f[k]*sk[k];
  int pf=sq((int)(dot>>16)), p=pf;
  { int s=ST[p]+2048; int lo=s>>7, wt=s&127, target=bit?65535:0;
    uint16_t*a=APM[apmsel*MNODES+mn], *b=APM2[(apmsel2*MNODES+mn)&0xffff];
    int pa=(a[lo]*(128-wt)+a[lo+1]*wt)>>11, pb=(b[lo]*(128-wt)+b[lo+1]*wt)>>11;
    a[lo]+=((target-a[lo])*(128-wt))>>13; a[lo+1]+=((target-a[lo+1])*wt)>>13;
    b[lo]+=((target-b[lo])*(128-wt))>>13; b[lo+1]+=((target-b[lo+1])*wt)>>13;
    p=(p*(4-APMW)+((pa+pb+1)>>1)*APMW+2)>>2; }
  if(p<1)p=1; if(p>4095)p=4095;
  cost += -log2((bit? p : 4096-p)/4096.0); ndec++;
  if(ENCODE) encbit(bit,p);
  if(trf) fprintf(trf,"%d %d %d\n",node,p,bit);
  { int err=((bit<<12)-pf)*LRF; for(int k=0;k<=nk;k++) f[k]+=(sk[k]*err)>>14; }
  for(int k=0;k<nk;k++){ int e0=(bit<<12)-pk[k]; if(e0>=ETH||e0<=-ETH){ int *w=MWt[k]+((ll)(msel[k]*MNODES+mn)*(NM+1)); int err=e0*LR; for(int i=0;i<=nm;i++) w[i]+=(st[i]*err)>>14; } }
  { int nv[NM], nn[NM];   // all new states from old ones, then written in order (mirrors the Python map/setitem)
    for(int i=0;i<nm;i++){ int n=cn_[i]; nv[i]=pv[i]+(int)((((ll)(bit<<16)-pv[i])*RT[n])>>16); nn[i]=n<LIM?n+1:n; }
    for(int i=0;i<nm;i++) Tt[idx[i]]=(uint32_t)nv[i]<<8|nn[i]; }
  return bit;
}
// prefetch every table slot / mixer row one decision will touch (speed only, no effect on the output)
static void pfn(int node, int mn){
  int no=(int)(((ull)node*0x9E3779B1ULL)&OM);
  for(int i=0;i<nm;i++) __builtin_prefetch(Tt+(int)hb[i]+no,1,3);
  for(int k=0;k<nk;k++){ int*w=MWt[k]+((ll)(msel[k]*MNODES+mn)*(NM+1)); for(int i=0;i<=nm;i+=16) __builtin_prefetch(w+i,1,3); __builtin_prefetch(w+nm,1,3); }
  __builtin_prefetch(APM2[(apmsel2*MNODES+mn)&0xffff],1,3);
}
static void code_res(int e){
  // the encoder knows the whole decision sequence of this residual: prefetch all of it first
  pfn(0,0);
  if(e){ int s=e<0, m=s?-e:e, so=s*16, nb=0; while(m>>(nb+1)) nb++;
    pfn(1,1); for(int i=0;i<=nb;i++) pfn(2+i+so,2+i+so);
    int t=1; for(int d=0;d<nb;d++){ int b=(m>>(nb-1-d))&1; pfn(64+s*4096+nb*256+(d<1?t:128+d*4+(t&3)), 34+nb+s*10); t=t*2+b; } }
  if(code_bit(e==0,0,0)) return;
  int s = e<0; code_bit(s,1,1); int m = (s?-e:e), so=s*16;
  int nb=0; while((m>>(nb+1))) nb++;
  for(int i=0;i<nb;i++) code_bit(1, 2+i+so, 2+i+so); code_bit(0,2+nb+so, 2+nb+so);
  int t=1; for(int d=0;d<nb;d++){ int b=(m>>(nb-1-d))&1; code_bit(b, 64+s*4096+nb*256+(d<1? t: 128+d*4+(t&3)), 34+nb+s*10); t=t*2+b; }
}
static inline int clamp(int v){ return v<0?0:v>255?255:v; }
static inline int med(int a,int b,int c){ int mx=a>b?a:b, mn=a<b?a:b; if(c>=mx) return mn; if(c<=mn) return mx; return a+b-c; }
static inline int iabs(int a){return a<0?-a:a;}
static int q(int v){ int a=iabs(v); int r = a==0?0: a<3?1: a<7?2: a<15?3: a<31?4: a<63?5:6; return v<0?-r:r; }
#define CL(v) ((v)<-32?-32:(v)>32?32:(v))
#define C2(v) ((v)<-2?((v)<-8?0:1):(v)>2?((v)>8?8:7):(v)+4)
#define S3(v) ((v)>0?2:(v)<0?1:0)
#define CTX(i, expr) if((CMASK>>(i))&1 || c==3) { cvl[i]=(ll)(expr); cen[i]=1; }
static void build_hb(int c){ nm=0; for(int i=0;i<64;i++) if(cen[i]){ hb[nm]=((((ull)(cvl[i]*256+nm*4+c))*0x9E3779B97F4A7C15ULL)>>20)&TM; nm++; cen[i]=0; } }
#define MSEL(bit, expr) if(MSMASK&(1u<<(bit))) msel[nk++]=(expr);

static int run(int argc, char**argv){
  TB=25; LR=12; LIM=30; LRF=4; APMW=3; LT=2; MR=4; NQ=5; WI=4000; ETH=256; CMASK=6390440155575ULL; MSMASK=53;
  B=124; B2=0; ncdr=1; ENCODE=1; cost=0; ndec=0; ccost[0]=ccost[1]=ccost[2]=0; trf=0; nm=0; nk=0; memset(cen,0,sizeof cen);
  st_flat=st_copy=st_match=st_mhit=st_line=0; for(int c=0;c<3;c++) st_zero[c]=st_n[c]=0;
  if(argc<5){ fprintf(stderr,"usage: pxenc in.rgb W H out.digits [KEY=value...]\n"); return 2; }
  int W=atoi(argv[2]), H=atoi(argv[3]); const char*outfn=argv[4];
  for(int a=5;a<argc;a++){ char k[64]; char v[64]; if(sscanf(argv[a],"%63[^=]=%63s",k,v)==2){ ull x=strtoull(v,0,0);
    if(!strcmp(k,"TB"))TB=x; else if(!strcmp(k,"LR"))LR=x; else if(!strcmp(k,"LIM"))LIM=x; else if(!strcmp(k,"LRF"))LRF=x;
    else if(!strcmp(k,"APMW"))APMW=x; else if(!strcmp(k,"LT"))LT=x; else if(!strcmp(k,"MR"))MR=x; else if(!strcmp(k,"NQ"))NQ=x;
    else if(!strcmp(k,"WI"))WI=x; else if(!strcmp(k,"CM"))CMASK=x; else if(!strcmp(k,"MS"))MSMASK=x; else if(!strcmp(k,"ENC"))ENCODE=x;
    else if(!strcmp(k,"ETH"))ETH=x; else if(!strcmp(k,"RB"))B=x; else if(!strcmp(k,"RB2"))B2=x;
    else { fprintf(stderr,"bad key %s\n",k); return 1; } } }
  if(LIM>31||TB>30||MR>10||B<2||B>251||B2==1||B2>251){ fprintf(stderr,"bad parameter\n"); return 1; }
  TM=(1ULL<<TB)-1; BOT=B*B*B; TOP=BOT*B;
  FILE*f=fopen(argv[1],"rb"); if(!f){ perror(argv[1]); return 1; }
  uint8_t*img=getbuf(0,(size_t)W*H*3+1,0); if(fread(img,1,(size_t)W*H*3,f)!=(size_t)W*H*3){ fprintf(stderr,"short input\n"); return 1; } fclose(f);
  tables(); if(getenv("TRACE")) trf=fopen(getenv("TRACE"),"w");
  for(int n=0;n<256;n++) RT[n]= 131072/(2*n+3);
  ull TS=(1ULL<<TB)+OM+1; Tt=getbuf(1,4*TS,0); for(ull j=0;j<TS;j++) Tt[j]=32768u<<8;
  for(int k=0;k<NK;k++){ MWt[k]=getbuf(2+k,sizeof(int)*MSELN*MNODES*(NM+1),0); for(long j=0;j<(long)MSELN*MNODES*(NM+1);j++) MWt[k][j]=WI; }
  for(int i=0;i<MNODES;i++) for(int k=0;k<=NK;k++) FW[i][k]=(1<<16)/2;
  APM=getbuf(8,sizeof(uint16_t)*33*64*MNODES,0); for(int i=0;i<64*MNODES;i++) for(int j=0;j<33;j++) APM[i][j]=sq((j-16)*128)*16;
  APM2=getbuf(9,sizeof(uint16_t)*33*65536,0); for(int i=0;i<65536;i++) for(int j=0;j<33;j++) APM2[i][j]=sq((j-16)*128)*16;
  ncdr=B2?2:1; for(int k=0;k<ncdr;k++){ Coder*c=cdr+k; c->B=k?B2:B; c->BOT=c->B*c->B*c->B; c->TOP=c->BOT*c->B; c->low=0; c->rng=c->TOP; c->nout=0; c->out=getbuf(10+k,(size_t)W*H*8+100,0); }
  int PW=W+4; int *pl[3], *er[3]; for(int c=0;c<3;c++){ pl[c]=getbuf(12+c,(size_t)PW*(H+2)*sizeof(int),1); er[c]=getbuf(15+c,(size_t)PW*(H+2)*sizeof(int),1); }
  int *pk=getbuf(18,(size_t)PW*(H+2)*sizeof(int),1); const int MTB=22; int *mt=getbuf(19,(1<<MTB)*sizeof(int),1); int mp=0, mlen=0, zrun=0;
  for(int y=0;y<H;y++) for(int x=0;x<W;x++){
    int pos=(y+2)*PW+x+2; uint8_t*px=img+((size_t)y*W+x)*3;
    int val[3]={px[1], px[0]-px[1], px[2]-px[1]};
    int eg=0, er_=0;
    ll mh=0;
    if(MR){ static const int mo[10]={1,0,1,-1,2,0,-1,2,-2,1}, my[10]={0,1,1,1,0,2,2,1,1,2};   // W N NW NE WW NN NNE NWW NEE NNW
      static const ull MK[10]={1,0x2F0B3A49ULL,0x9E3779B1ULL,0x85EBCA77ULL,0xC2B2AE3DULL,0x27D4EB2FULL,0x165667B1ULL,0xD3A2646CULL,0xFD7046C5ULL,0xB55A4F09ULL};
      ull s_=0; for(int k=0;k<MR;k++) s_+=(ull)pk[pos-my[k]*PW-mo[k]]*MK[k];
      mh=(ll)(((s_*0x9E3779B97F4A7C15ULL)>>40)&((1ULL<<MTB)-1));
      if(!mlen || !mp) { mp=mt[mh]; mlen=0; } }
    // predictions of all three channels (needed to know whether the pixel is exactly predicted)
    int Z=1;
    for(int c=0;c<3;c++){ int *p=pl[c]; int pr = med(p[pos-1],p[pos-PW],p[pos-PW-1]);
      if(c){
        int offs[4]={-1,-PW,-PW-1,-PW+1}; int gmx=-1,gmn=999,cmx=0,cmn=0;
        for(int k=0;k<4;k++){ int pp=pos+offs[k]; int g=pl[0][pp]; int cv=pl[c][pp]+g; if(g>gmx){gmx=g;cmx=cv;} if(g<gmn){gmn=g;cmn=cv;} }
        int d=gmx-gmn;
        if(d<LT){ int a[3]; for(int k=0;k<3;k++){ int pp=pos+offs[k]; a[k]=pl[c][pp]+pl[0][pp]; } pr=med(a[0],a[1],a[2])-val[0]; }
        else { int p16=(int)fdiv((ll)(val[0]-gmn)*(cmx-cmn)*16+d/2, d); pr=clamp(cmn+((p16+8)>>4))-val[0]; }
      }
      if(val[c]!=pr) Z=0; }
    int useZ = pk[pos-1]==pk[pos-PW] && pk[pos-PW]==pk[pos-PW-1] && pk[pos-PW]==pk[pos-PW+1];
    if(useZ){   // flat neighbourhood: one decision "pixel == W"
      ull W_=pk[pos-1];
      int eqp=(pk[pos-PW+2]==W_)+2*(pk[pos-2*PW]==W_)+4*(pk[pos-2*PW+1]==W_)+8*(pk[pos-2*PW+2]==W_)+16*(pk[pos-2]==W_)+32*(pk[pos-2*PW-1]==W_)+64*(pk[pos-PW-2]==W_);
      int zr=zrun>15?15:zrun; int mz=mp? 1+(pk[mp]==W_)+2*(mlen>15?15:mlen):0;
      int c=3;
      CTX(0, (ll)W_+(1LL<<24)*zr)
      CTX(1, eqp+128*zr)
      CTX(2, mz+64*eqp)
      CTX(3, (ll)W_+(1LL<<24)*eqp)
      CTX(4, (ll)W_+(1LL<<24)*(mz+64*zr))
      build_hb(3);
      nk=0; MSEL(0, zr) MSEL(1, eqp&15) MSEL(2, mz&15) MSEL(4, eqp>>3)
      apmsel=zr; apmsel2=1000+zr;
      double c0=cost; code_bit(Z, 7000, 60); ccost[0]+=cost-c0; st_flat++; st_copy+=Z;
    }
    for(int c=0;c<3;c++){
      if(useZ && Z){ pl[c][pos]=val[c]; er[c][pos]=0; continue; }
      int *p=pl[c]; int Wv=p[pos-1], Nv=p[pos-PW], NW=p[pos-PW-1], NE=p[pos-PW+1], WW=p[pos-2], NN=p[pos-2*PW];
      int NNE=p[pos-2*PW+1], NWW=p[pos-PW-2], NEE=p[pos-PW+2], NNW=p[pos-2*PW-1];
      int pr = med(Wv,Nv,NW); int lfr=0, lp2=0, alt=0;
      if(c){
        int offs[4]={-1,-PW,-PW-1,-PW+1}; int gmx=-1,gmn=999,cmx=0,cmn=0;
        for(int k=0;k<4;k++){ int pp=pos+offs[k]; int g=pl[0][pp]; int cv=pl[c][pp]+g; if(g>gmx){gmx=g;cmx=cv;} if(g<gmn){gmn=g;cmn=cv;} }
        int d=gmx-gmn;
        if(d<LT){ int a[3]; for(int k=0;k<3;k++){ int pp=pos+offs[k]; a[k]=pl[c][pp]+pl[0][pp]; } pr=med(a[0],a[1],a[2])-val[0]; }
        else { int p16=(int)fdiv((ll)(val[0]-gmn)*(cmx-cmn)*16+d/2, d); pr=clamp(cmn+((p16+8)>>4))-val[0]; lfr=1+((p16+8)&15)+16*(q(cmx-cmn)+8)+256*(d<4?0:d<8?1:d<16?2:d<32?3:4); }
        { int offs8[8]={-1,-PW,-PW-1,-PW+1,-2,-2*PW,-PW-2,-PW+2}; int gx=-1,gn=999,cx=0,cn=0;
          for(int k=0;k<8;k++){ int pp=pos+offs8[k]; int g=pl[0][pp]; int cv=pl[c][pp]+g; if(g>gx){gx=g;cx=cv;} if(g<gn){gn=g;cn=cv;} }
          { int a[3]; for(int k=0;k<3;k++){ int pp=pos+offs8[k]; a[k]=pl[c][pp]+pl[0][pp]; } int om=med(a[0],a[1],a[2])-val[0]; int dm=med(Wv,Nv,NW);
            alt=1+(CL(om-pr)+40)*128+CL(dm-pr)+40; }
          int d8=gx-gn; if(d8>=LT){ int p16=(int)fdiv((ll)(val[0]-gn)*(cx-cn)*16+d8/2, d8); lp2=1+CL(clamp(cn+((p16+8)>>4))-val[0]-pr)+64; } }
      }
      int act = iabs(Wv-NW)+iabs(Nv-NW)+iabs(Nv-NE);
      int qa = act==0?0: act<3?1: act<6?2: act<10?3: act<16?4: act<25?5: act<40?6: act<64?7: act<100?8:9;
      int e = val[c]-pr;
      int eW=er[c][pos-1], eN=er[c][pos-PW], eNW=er[c][pos-PW-1], eNE=er[c][pos-PW+1];
      int lo=Wv, hi=Wv; { int vv[6]={Nv,NW,NE,NN,WW,NEE}; for(int k=0;k<6;k++){ if(vv[k]<lo) lo=vv[k]; if(vv[k]>hi) hi=vv[k]; } }
      int rg=hi-lo; if(rg<1) rg=1; int qr = rg<4?0:rg<8?1:rg<16?2:rg<32?3:rg<64?4:rg<128?5:6;
      #define NR(v) (fdiv((ll)((v)-lo)*NQ, rg))
      int G0=val[0], GW=pl[0][pos-1], GN=pl[0][pos-PW];
      int ev = mp? CL(pl[c][mp]-pr) : 0;
      int up=0,dn=0; { int vv[12]={NWW,NW,Nv,NE,NEE,WW,Wv,NN,NNE,NNW,p[pos-2*PW+2],p[pos-2*PW-2]}; for(int k=0;k<12;k++){ up+=vv[k]>pr; dn+=vv[k]<pr; } }
      #define K 1024LL
      CTX(0, qa)
      CTX(1, (q(Wv-pr)+8)*16+(q(Nv-pr)+8) + 256*((q(NE-pr)+8)*16+q(NW-pr)+8))
      CTX(2, Wv+K*Nv)
      CTX(3, Wv+K*(Nv+K*(NW+K*NE)))
      CTX(4, (q(eg)+8)*16 + qa + 256*((q(WW-Wv)+8)*16 + q(NN-Nv)+8))
      CTX(5, c? G0+K*(Wv+K*GW) : pr)
      CTX(6, Wv+K*(WW+K*(Nv+K*NN)))
      CTX(7, c? G0+K*(Nv+K*GN) : (Wv-NW)+K*(Nv-NW))
      CTX(8, pr*16+q(Wv-Nv))
      CTX(9, Nv+K*(NE+K*NNE))
      CTX(10, c? eg+K*qa : CL(NE-pr)+K*CL(NW-pr))
      CTX(11, c==2? eg+K*er_ : c==1? eg+K*(Wv-pr) : Nv+K*NN)
      CTX(12, CL(eW)+128*(CL(eN)+128*(CL(eNW)+128*CL(eNE))))
      CTX(13, Wv+K*(Nv+K*(NE+K*eg)))
      CTX(14, MR&&mp? (ev+64)*32+(mlen>15?15:mlen)+1 : 0)
      CTX(15, Wv+K*(NW+K*NWW))
      CTX(16, CL(Wv-pr)+K*CL(Nv-pr))
      CTX(17, CL(eW)+K*CL(eN))
      CTX(18, Nv+K*(NE+K*(NEE+K*NNE)))
      CTX(19, pr*16+qa)
      CTX(20, (Wv+Nv)+K*(NE-NW))
      CTX(21, C2(NE-Nv)+9*C2(NEE-NE)+81*C2(Nv-NW)+729*C2(NW-NWW)+6561*C2(Wv-NW)+59049*C2(WW-NWW))
      CTX(22, C2(NE-Nv)+9*C2(Nv-NW)+81*C2(Wv-NW)+729*C2(NN-Nv)+6561*C2(NNE-NE)+59049*C2(NNW-NW))
      CTX(23, C2(NE-Nv)+9*C2(NEE-NE)+81*C2(Nv-NW)+729*C2(Wv-NW)+6561*C2(Wv-pr)+59049*C2(eg))
      CTX(24, C2(NE-Nv)+9*C2(NEE-NE)+81*C2(Nv-NW)+729*C2(NW-NWW)+6561*C2(Wv-NW)+59049*C2(WW-NWW)+531441LL*(C2(NN-Nv)+9*C2(NNE-NE)+81*C2(NNW-NW)+729*C2(Wv-WW)))
      CTX(25, CL(2*Nv-NN-pr)+K*CL(2*Wv-WW-pr))
      CTX(26, CL(Nv+NE-NNE-pr)+K*CL(Wv+NE-Nv-pr))
      CTX(27, CL(Nv+NW-NNW-pr)+K*CL(Wv+NW-NWW-pr))
      CTX(28, CL(NE-pr)+K*CL(NEE-pr))
      CTX(29, (lo-pr)+K*(hi-pr))
      CTX(30, ((lo-pr)>>2)+K*(((hi-pr)>>2)+K*qa))
      CTX(31, NR(Wv)+8*(NR(Nv)+8*(NR(NW)+8*(NR(NE)+8*(NR(NN)+8*(NR(WW)+8*(qr+8*NR(pr))))))))
      CTX(32, NR(NWW)+8*(NR(NW)+8*(NR(Nv)+8*(NR(NE)+8*(NR(NEE)+8*(NR(Wv)+8*(qr+8*NR(pr))))))))
      CTX(33, NR(Wv)+8*(NR(Nv)+8*(NR(NW)+8*(NR(NE)+8*(NR(NNE)+8*(NR(NNW)+8*qr))))))
      CTX(34, up*16+dn + 256*(q(eg)+8))
      CTX(35, up*16+dn + 256*(S3(Wv-pr)*27+S3(Nv-pr)*9+S3(NW-pr)*3+S3(NE-pr)))
      CTX(36, lfr)
      CTX(37, lfr*16+q(eg)+8)
      CTX(38, lp2*16+q(eg)+8)
      CTX(39, lp2*1024+lfr)
      CTX(40, alt)
      CTX(41, alt*16+q(eg)+8)
      CTX(42, (zrun>15?15:zrun)*2+useZ)
      build_hb(c);
      int mst = c*130 + (mp? (ev+32)*2+(mlen>2)+1 : 0);     // match state
      nk=0;
      MSEL(0, c*16+qa)
      MSEL(1, c*16 + q(eg)+8)
      MSEL(2, c*16 + (eW==0)+2*(eN==0)+4*(eNW==0)+8*(eNE==0))
      MSEL(3, c*64 + (q(eg)+8)*4 + (eW==0)+2*(eN==0))
      MSEL(4, c*256 + (q(Wv-pr)+8)*16+(q(Nv-pr)+8))
      MSEL(5, mst)
      apmsel = c*16+qa; apmsel2 = mst;
      double c0=cost; code_res(e); ccost[c]+=cost-c0; st_n[c]++; st_zero[c]+=(e==0); if(c && lfr) st_line++;
      p[pos]=val[c]; er[c][pos]=e; if(c==0) eg=e; if(c==1) er_=e;
    }
    pk[pos]=(px[0]<<16)|(px[1]<<8)|px[2];
    if(mp){ st_match++; st_mhit+=pk[mp]==pk[pos]; }
    if(useZ && Z) zrun++; else zrun=0;
    if(MR){ if(mp && pk[mp]==pk[pos]){ mlen++; mp++; } else { mlen=0; mp=0; } mt[mh]=pos; }
  }
  if(ENCODE) for(int k=0;k<ncdr;k++){ char fn[4096]; snprintf(fn,sizeof fn,k?"%s.2":"%s",outfn); encflush(cdr+k); FILE*g=fopen(fn,"wb"); if(!g){ perror(fn); return 1; } fwrite(cdr[k].out,1,cdr[k].nout,g); fclose(g); }
  if(getenv("STATS")) printf("pixels %d flat-neighbourhood %ld (exact copies of W %ld); coded samples G %ld R %ld B %ld, exact predictions G %ld R %ld B %ld; colour-line predictor used %ld; match candidates %ld, correct %ld\n", W*H, st_flat, st_copy, st_n[0], st_n[1], st_n[2], st_zero[0], st_zero[1], st_zero[2], st_line, st_match, st_mhit);
  printf("ideal %.0f bytes (G %.0f R %.0f B %.0f) digits %ld decisions %ld", cost/8, ccost[0]/8, ccost[1]/8, ccost[2]/8, cdr[0].nout, ndec); if(ncdr>1) printf(" digits2 %ld", cdr[1].nout); printf("\n");
  if(trf) fclose(trf);
  return 0;
}

int main(int argc, char**argv){
  if(argc==2 && !strcmp(argv[1],"--serve")){
    thp=!getenv("PXENC_NOTHP");
    static char line[1<<16];
    while(fgets(line,sizeof line,stdin)){
      char*av[128]; int ac=0; av[ac++]="pxenc";
      for(char*t=strtok(line," \t\r\n"); t && ac<127; t=strtok(0," \t\r\n")) av[ac++]=t;
      int rc=run(ac,av); if(rc) printf("ERROR %d\n",rc); fflush(stdout); }
    return 0; }
  return run(argc,argv);
}
