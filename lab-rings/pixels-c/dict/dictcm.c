// dictcm.c -- C port of px-dict/model_tpl.py (the "dict" context-mixing pixel model), bit-exact.
//
// One source, two builds:
//   encoder:  gcc -O2 -DENC dictcm.c -o dictcm -lm
//             ./dictcm in.rgb W H out.digits O0 O1 O2 NC T LIM LR AR RB
//             (RB=256 reproduces the Python encoder's digit stream byte for byte; RB=251 = C-literal radix)
//   decoder:  cgen_dict.py strips the ENC parts, substitutes the image constants, minifies and embeds the
//             digits -> one standalone C program.
// Everything that influences the coded bits mirrors CPython 3.11 exactly: tuple hash() (xxHash lanes,
// hash(-1) == -2), the iteration order of the candidate set() (open addressing, 9 linear probes,
// perturbed probing, resize to 4*used), float evaluation order (no FMA: fp-contract off).
// exp/log: with -DLIBM the libm functions are used (= what Python calls) and the encoder reproduces the
// Python engine's digit stream bit for bit (xcheck*.py).  Without LIBM (the shipped programs) ex()/lg()
// are short pure +-*/ implementations, so the program needs no -lm and decodes identically on any
// IEEE-754 machine regardless of its libm; encoder and decoder share them, so the stream is consistent.
#pragma GCC optimize("fp-contract=off")
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
typedef long long L;typedef unsigned long long U;typedef double F;
#ifdef LIBM
#include<math.h>
#define ex exp
#define lg log
#else
F ex(F x){F s=1,t=1;int i;x/=1024;for(i=1;i<10;i++)t*=x/i,s+=t;for(i=0;i<10;i++)s*=s;return s;}
F lg(F x){int e=0,i;F z,t,s=0;for(;x>1.4142135623730951;e++)x/=2;for(;x<.7071067811865476;e--)x*=2;z=(x-1)/(x+1);for(t=z,i=1;i<26;i+=2)s+=t/i,t*=z*z;return 2*s+e*.6931471805599453;}
#endif
#define FA(x) ((x)<0?-(x):(x))
#define ML malloc
#define CA calloc
#define BR break
#define FOR(i,n) for(i=0;i<n;i++)
#define HT(...) th((L[]){__VA_ARGS__},sizeof((L[]){__VA_ARGS__})/8)
#define MN(a,b) ((a)<(b)?(a):(b))
#define CL3(z) ((z)<-3?-3:(z)>3?3:(z))
#ifdef ENC
#define Y_(x) ,x
int W,H,O0,O1,O2,NC,TT,LIM,RB,SW,NN,SH0,SH1,SH2,JR,JG,JB,*TRUTH,nout;F LR,AR;unsigned char*out;
#else
#define Y_(x)
#define SW @SW@
#define NN @NN@
char*D="@DATA@";int di;
int dg(){int c=di<@ND@?D[di++]&255:1;return c-1-(c>10)-(c>13)-(c>34)-(c>92);}
#endif
// ---------------------------------------------------------------- model state
F sg(F x){return 1/(1+ex(-x));}
F*TP,*MW,*AP,CF[300],NWt[3][8],**E[3];unsigned char*TN;int*MC,QT[4000],*CO,*V[3],*R[3],*OFF,*MD,*OF2;U A0,A1,A2,D7;
L th(L*v,int n){U a=2870177450012600261ull;int i;FOR(i,n){U l=v[i]==-1?-2:v[i];a+=l*14029467366897019727ull;a=a<<31|a>>33;a*=11400714785074694791ull;}a+=n^2870177450013471926ull;return a==-1ull?1546275796:a;}
// ---- CPython set() of small positive ints: insertion + iteration order
L*sT,*sO;int sM,sF,sU;
void sadd(L k){U m=sM,i=k&m,p=k;L*e;int n;if(!k)return;for(;;){e=sT+i;n=i+9<=m?9:0;do{if(!*e)goto u;if(*e==k)return;e++;}while(n--);p>>=5;i=(i*5+1+p)&m;}
 u:*e=k;sF++;sU++;if((U)sF*5<m*3)return;
 {int ns=8,mu=sU>50000?sU*2:sU*4;while(ns<=mu)ns<<=1;memcpy(sO,sT,8*(m+1));memset(sT,0,8*ns);sM=ns-1;sF=sU=0;FOR(n,m+1)if(sO[n])sadd(sO[n]);}}
// ---- one binary decision: 2 logistic mixers over hashed contexts + SSE, carry-less range coder radix RB
int B(L*hs,int n,int nd,int mk,int m2 Y_(int y)){
 int ix[16],i,lo,p;F st[16],*wv=MW+mk*16,*w2=MW+m2*16,d1=0,d2=0,p1,p2,dt,sx,fw,*ab=AP+mk*33,a,b;
 FOR(i,n)ix[i]=hs[i]+nd*0x9E3779B1ull&4194303,st[i]=lg(TP[ix[i]]/(1-TP[ix[i]]))*CF[TN[ix[i]]];
 st[n++]=.3;
 FOR(i,n)d1+=wv[i]*st[i];FOR(i,n)d2+=w2[i]*st[i];
 d1=d1<20?d1:20;d1=d1>-20?d1:-20;d2=d2<20?d2:20;d2=d2>-20?d2:-20;
 p1=sg(d1);p2=sg(d2);dt=(d1+d2)/2;sx=(dt+8)*2;sx=sx<31.999?sx:31.999;sx=sx>0?sx:0;lo=sx;fw=sx-lo;
 p=(sg(dt)+ab[lo]*(1-fw)+ab[lo+1]*fw)/2*65536;p=p<65535?p:65535;p=p>1?p:1;
 U xm=A0+(U)((unsigned __int128)(A1-A0)*p>>16);
#ifndef ENC
 int y=A2<=xm;
#endif
 if(y)A1=xm;else A0=xm+1;
 while(A0/D7==A1/D7){
#ifdef ENC
  out[nout++]=A0/D7;
#else
  A2=A2%D7*RB+dg();
#endif
  A0=A0%D7*RB;A1=A1%D7*RB+RB-1;}
 a=(y-p1)*LR*(1+3/(1+MC[mk]/16.));b=(y-p2)*LR*(1+3/(1+MC[m2]/16.));
 FOR(i,n)wv[i]+=a*st[i];FOR(i,n)w2[i]+=b*st[i];MC[mk]++;MC[m2]++;
 ab[lo]+=(y-ab[lo])*AR*(1-fw);ab[lo+1]+=(y-ab[lo+1])*AR*fw;
 FOR(i,n-1){int k=ix[i],c=TN[k];F t=TP[k]+(y-TP[k])/(c+1.5);t=t<.9999?t:.9999;TP[k]=t>.0001?t:.0001;if(c<LIM)TN[k]=c+1;}
 return y;}
int bl(int x){int n=0;for(;x>0;x>>=1)n++;return n;}
int HM;int fs(int*K,int*k,int n){U h=0;int s,i;FOR(i,n)h=(h+k[i])*0x9E3779B97F4A7C15;for(s=h>>40&HM-1;K[s*n]!=-2&&memcmp(K+s*n,k,n*4);)s=s+1&HM-1;return s;}
int main(int ac,char**av){
#ifdef ENC
 if(ac<14){fprintf(stderr,"usage: dictcm in.rgb W H out.digits O0 O1 O2 NC T LIM LR AR RB\n");return 2;}
 W=atoi(av[2]);H=atoi(av[3]);O0=atoi(av[5]);O1=atoi(av[6]);O2=atoi(av[7]);NC=atoi(av[8]);TT=atoi(av[9]);LIM=atoi(av[10]);
 LR=atof(av[11]);AR=atof(av[12]);RB=atoi(av[13]);SW=W+6;NN=(H+3)*SW;SH0=16-8*O0;SH1=16-8*O1;SH2=16-8*O2;
 JR=O0==0?0:O1==0?1:2;JG=O0==1?0:O1==1?1:2;JB=O0==2?0:O1==2?1:2;
 if(NC>4||RB<2||RB>256||LIM>255){fprintf(stderr,"bad parameter\n");return 1;}
 {FILE*f=fopen(av[1],"rb");unsigned char*px=ML(W*H*3);if(!f||fread(px,1,W*H*3,f)!=W*H*3){fprintf(stderr,"bad input\n");return 1;}fclose(f);
  TRUTH=ML(NN*4);int k;FOR(k,NN)TRUTH[k]=-1;FOR(k,W*H)TRUTH[(k/W+3)*SW+k%W+3]=px[3*k]<<16|px[3*k+1]<<8|px[3*k+2];}
 out=ML(W*H*16+64);
#endif
 int SH[3]={SH0,SH1,SH2},TM[10]={-1,-2,-SW-2,-SW-1,-SW,-SW+1,-SW+2,-2*SW-1,-2*SW,-2*SW+1},W16[16]={-1,-2,-3,-SW-3,-SW-2,-SW-1,-SW,-SW+1,-SW+2,-SW+3,-2*SW-2,-2*SW-1,-2*SW,-2*SW+1,-2*SW+2,-3*SW},
  i,j,k,t,x,y,c,*G,*HD=CA(4,4848505),*NP=ML(12*W*H+4),*NX=ML(12*W*H+4),nn=1,*K1,*K2;
 for(HM=1;HM<2*W*H;)HM*=2;K1=ML(44*HM);K2=ML(16*HM);int*V1=ML(4*HM),*V2=ML(4*HM);
 FOR(k,11*HM)K1[k]=-2;FOR(k,4*HM)K2[k]=-2;
 sT=CA(8,2048);sO=CA(8,2048);
 TP=ML(8<<22);TN=CA(1,1<<22);FOR(k,1<<22)TP[k]=.5;
 MW=ML(8*16*24172);FOR(k,16*24172)MW[k]=.1;MC=CA(4,24172);
 AP=ML(8*33*24172);FOR(k,33*24172)AP[k]=sg(k%33/2.-8);
 FOR(k,300)CF[k]=MN(1,.4+.15*k);
 {F q=1;for(t=k=0;k<4000;k++){for(;q*1.5<=k&&t<15;t++)q*=1.5;QT[k]=k<3?k:t;}}
 CO=ML(4*NN);FOR(k,NN)CO[k]=-1;
 FOR(j,3){V[j]=CA(4,NN);R[j]=CA(4,NN);E[j]=ML(8*18);FOR(k,18)E[j][k]=CA(8,NN);}G=V[0];
 OFF=CA(4,NN);MD=CA(4,NN);OF2=CA(4,NN);
 for(D7=1,k=0;k<7;k++)D7*=RB;A1=D7*RB-1;
#ifndef ENC
 FOR(k,8)A2=A2*RB+dg();
#endif
 FOR(y,H)FOR(x,W){
  int i=(y+3)*SW+x+3,o,ka=0,kb=0,kk[3],bo=0,b2=0,bd=99999,bd2=99999,d,mi,m2,qbd,cw,cn,cnw,cne,vb4,e1,e2,em,nd,fd=0,md=1,s1,s2,cc[5],ncc=0,vt;
#ifdef ENC
  vt=TRUTH[i];
#endif
  memset(sT,0,8*(sM+1));sM=7;sF=sU=0;
  int jj[5]={i-1,i-SW,i-SW-1,i-SW+1,i-2};
  FOR(k,5)sadd(OFF[jj[k]]),sadd(OF2[jj[k]]);
  FOR(k,7)ka=ka*9+(G[i+TM[k]]>>5),kb=kb*9+(G[i+TM[k]]+16>>5);
  kk[0]=ka;kk[1]=kb;kk[2]=4782969+(G[i-1]>>4)*4096+(G[i-SW]>>4)*256+(G[i-SW+1]>>4)*16+(G[i-SW-1]>>4);
  FOR(k,3)for(t=HD[kk[k]],c=0;t&&c<64;t=NX[t],c++)sadd(i-NP[t]);
  FOR(c,sM+1)if(o=sT[c]){if(!bd2)BR;d=0;FOR(t,10){d+=abs(G[i+TM[t]]-G[i-o+TM[t]]);if(d>=bd2)BR;}
   if(d<bd)bd2=bd,b2=bo,bd=d,bo=o;else if(d<bd2)bd2=d,b2=o;}
  mi=bo?i-bo:i-1;m2=b2?i-b2:mi;qbd=bo?QT[MN(bd,3999)]:16;
  cw=CO[i-1];cn=CO[i-SW];cnw=CO[i-SW-1];cne=CO[i-SW+1];
  vb4=bo?(cw==CO[i-1-bo])*8+(cn==CO[i-SW-bo])*4+(cne==CO[i-SW+1-bo])*2+(cnw==CO[i-SW-1-bo]):16;
  int k1[11]={cw,cn,cnw,cne,CO[i-2],CO[i-3],CO[i-SW-2],CO[i-SW+2],CO[i-2*SW-1],CO[i-2*SW],CO[i-2*SW+1]};
  s1=fs(K1,k1,11);s2=fs(K2,k1,4);
  e1=K1[s1*11]==-2?-1:V1[s1];e2=K2[s2*4]==-2?-1:V2[s2];
  em=bo?CO[mi]:-1;nd=1+(cn!=cw)+(cnw!=cw&&cnw!=cn)+(cne!=cw&&cne!=cn&&cne!=cnw);
  L mx3=HT(MD[i-1],MD[i-SW],MD[i-SW+1]);
  if(e1>=0){int ag=(e1==em)*2+(e1==e2);
   L hs[7]={HT(ag,nd),HT(e1,ag>0),HT(cw,cn,ag),HT(ag,cw==cn,cn==cne,cw==cnw),HT(ag,MN(qbd,8),11),HT(ag,vb4,12),HT(ag,mx3,13)};
   if(fd=B(hs,7,0,ag*8+MN(nd,7),23900+vb4*16+MN(qbd,15) Y_(vt==e1)))FOR(j,3)V[j][i]=e1>>SH[j]&255;}
  {L cv[5]={em,e2,e1,cw,cn};FOR(k,5)if(cv[k]>=0){FOR(t,ncc)if(cc[t]==cv[k])BR;if(t==ncc)cc[ncc++]=cv[k];}}
  FOR(j,3){int*Vj=V[j],*Rj=R[j],sh=SH[j],a=Vj[i-1],b=Vj[i-SW],c_=Vj[i-SW-1],dd=Vj[i-SW+1],mv=Vj[mi],np=j?18:10,*U_=V[j?j-1:0],u=U_[i],v,s,mr;
   F pr[18]={a,b,a+b-c_,(a+dd)/2.,dd,b+dd-Vj[i-2*SW+1],2*a-Vj[i-2],2*b-Vj[i-2*SW],mv},pls=0,**Ej=E[j],*nw=NWt[j],pn,b0,z;
   mr=j?mv+u-U_[mi]:mv;
   if(j){int uw=U_[i-1],un=U_[i-SW],unw=U_[i-SW-1],une=U_[i-SW+1],n0[4]={uw,un,unw,une},n1[4]={a,b,c_,dd},bs=-1,bt=0,bdd=0;
    pr[9]=a+u-uw;pr[10]=b+u-un;pr[11]=c_+u-unw;pr[12]=dd+u-une;pr[13]=a+b-c_+u-uw-un+unw;pr[14]=mr;
    FOR(s,4)for(t=s+1;t<4;t++)if(abs(n0[s]-n0[t])>bdd)bdd=abs(n0[s]-n0[t]),bs=s,bt=t;
    if(bs<0)pr[15]=a;else{z=n1[bs]+(F)((n1[bt]-n1[bs])*(u-n0[bs]))/(n0[bt]-n0[bs]);z=z>0?z:0;pr[15]=z<255?z:255;}
    F g0=G[i],sw=0,su=0,sv=0,suu=0,suv=0,gu,w,vv,um,vm,var;
    FOR(t,16){gu=G[i+W16[t]];w=1./(FA(gu-g0)+2.);vv=Vj[i+W16[t]];sw+=w;su+=w*gu;sv+=w*vv;suu+=w*gu*gu;suv+=w*gu*vv;}
    um=su/sw;vm=sv/sw;var=suu/sw-um*um;pls=vm+(var>1e-6?(suv/sw-um*vm)/var:1.)*(g0-um);z=pls>0?pls:0;pr[16]=z<255?z:255;}
   b0=(a+b)/2.;F fx[8]={a-b0,b-b0,c_-b0,dd-b0,Vj[i-2]-b0,Vj[i-2*SW]-b0,Vj[i-2*SW+1]-b0,(j?pls:mv)-b0};
   pn=b0;FOR(k,8)pn+=nw[k]*fx[k];z=pn>0?pn:0;pr[np-1]=z<255?z:255;
   if(!fd){F ers[18],sw=0,sp=0,pf,me;int Pp,qe,rp=j?R[j-1][i]:99,X_[4],nX=0,rk=0,yb=0;
#ifdef ENC
    int vj=vt>>sh&255;
#endif
    FOR(k,np)ers[k]=Ej[k][i-1]+Ej[k][i-SW]+Ej[k][i-SW-1]+Ej[k][i-SW+1];
    ers[8]=(ers[8]+bd*.25)/2;
    FOR(k,np){F w=1./(ers[k]*ers[k]+.5);sw+=w;sp+=w*pr[k];}
    pf=sp/sw;Pp=pf+.5;Pp=Pp<255?Pp:255;Pp=Pp>0?Pp:0;
    for(me=ers[0],k=1;k<np;k++)if(ers[k]<me)me=ers[k];qe=QT[MN((int)me,3999)];
    FOR(t,ncc){int cv=cc[t],cvj,ag,dv;if(rk>=NC)BR;
     FOR(k,j)if((cv>>SH[k]&255)!=V[k][i])BR;if(k<j)continue;
     cvj=cv>>sh&255;FOR(k,nX)if(X_[k]==cvj)BR;if(k<nX)continue;
     ag=(cv==em)*8+(cv==e2)*4+(cv==e1)*2+(cv==cw);dv=cvj-Pp;dv=abs(dv)<6?dv:6+(dv>0);
     L hs[7]={HT(j,rk,ag,vb4,MN(qbd,9),21),HT(j,ag,dv,qe,22),HT(j,ag,cvj,23),HT(j,ag,a==cvj,b==cvj,c_==cvj,dd==cvj,24),HT(j,rk,ag,rp,25),HT(j,ag,nd,cw==cn,26),HT(j,rk,ag,mx3,27)};
     if(B(hs,7,0,19832+(j*16+ag)*4+rk,20024+((j*20+vb4)*17+MN(qbd,16))*4+rk Y_(vj==cvj))){yb=1;if(!j)md=2+(ag&12)/4;v=cvj;BR;}
     X_[nX++]=cvj;rk++;}
    if(!yb){int m2v=Vj[m2]+(j?u-U_[m2]:0),x0=nX?X_[0]-Pp:99,nh=10,mc=32+(j*16+qe)*200,m3=9632+(j*17+MN(qbd,16))*200,r=0,inx,sg,Lm,m;
     x0=abs(x0)<5?x0:5+(x0>0);
     L hs[12]={HT(j,qe,1),HT(j,qe,CL3(rp),2),HT(j,CL3(Rj[i-1]),CL3(Rj[i-SW]),qe>4,3),HT(j,a,b,c_,dd,rp,4),HT(j,Pp,5),HT(j,qe,(int)((pf-Pp)*4+2),CL3(a-Pp),CL3(b-Pp),6),
      HT(j,abs(mr-Pp)<12?mr-Pp:12+(mr>Pp),MN(qbd,9),7),HT(j,x0,nX,qe,10),HT(j,m2v-Pp<-6?-6:m2v-Pp>6?6:m2v-Pp,mr-Pp<-6?-6:mr-Pp>6?6:mr-Pp,14),HT(j,a>Pp,b>Pp,c_>Pp,dd>Pp,Vj[i-2]>Pp,Vj[i-2*SW]>Pp,qe>3,32)};
     if(j){L dl=(L)(pls+.5)-Pp;dl=dl<8&&dl>-8?dl:8+(dl>0);hs[10]=HT(j,dl,qe>3,8);hs[11]=HT(j,dl,(int)((pls-(L)pls)*4),CL3(rp),9);nh=12;}
#ifdef ENC
     int r_=vj-Pp,m_=abs(r_),z1_=m_-TT;
#endif
     FOR(k,nX)if(X_[k]==Pp)BR;inx=k<nX;
     if(inx||!B(hs,nh,0,mc,m3 Y_(r_==0))){
      s=0<Pp&&Pp<255?B(hs,nh,1,mc+1,m3+1 Y_(r_>0)):Pp==0;Lm=s?255-Pp:Pp;sg=s?32:48;
      for(k=1;;k++){if(k>=Lm){m=Lm;BR;}
       if(k>TT){int nb=1,mx=bl(Lm-TT),zz=1;while(nb<mx&&B(hs,nh,64+nb,mc+64+nb,m3+64+nb Y_(bl(z1_)>nb)))nb++;
        for(t=nb-2;t>=0;t--)zz=zz*2+B(hs,nh,96+nb*8+t,mc+96+nb*8+t,m3+96+nb*8+t Y_(z1_>>t&1));m=TT+zz;BR;}
       c=s?Pp+k:Pp-k;FOR(t,nX)if(X_[t]==c)BR;
       if(t==nX&&!B(hs,nh,sg+k,mc+sg+k,m3+sg+k Y_(m_>k))){m=k;BR;}}
      r=s?m:-m;}
     v=Pp+r;}
    Rj[i]=v-Pp;Vj[i]=v;}
   else v=Vj[i],Rj[i]=0;
   FOR(k,np)Ej[k][i]=FA(v-pr[k]);
   {F q2=0,en;FOR(k,8)q2+=fx[k]*fx[k];en=(v-pn)*.03/(q2+16);FOR(k,8)nw[k]+=en*fx[k];}}
  vt=V[JR][i]<<16|V[JG][i]<<8|V[JB][i];
#ifdef ENC
  if(vt!=TRUTH[i]){fprintf(stderr,"model mismatch at %d\n",i);return 3;}
#endif
  memcpy(K1+s1*11,k1,44);V1[s1]=vt;memcpy(K2+s2*4,k1,16);V2[s2]=vt;CO[i]=vt;
  if(bo&&CO[i-bo]!=vt)FOR(c,sM+1)if((o=sT[c])&&CO[i-o]==vt){b2=bo;bo=o;BR;}
  OFF[i]=bo;MD[i]=fd?6:md;OF2[i]=b2;
  FOR(k,3)NP[nn]=i,NX[nn]=HD[kk[k]],HD[kk[k]]=nn++;}
#ifdef ENC
 {int n;U m,v=0;unsigned __int128 w;for(n=1;n<9;n++){for(m=1,k=0;k<8-n;k++)m*=RB;w=((unsigned __int128)A0+m-1)/m*m;if(w<=A1){v=w;BR;}}
  FOR(k,8){out[nout++]=v/D7;v=v%D7*RB;}
  while(nout&&!out[nout-1])nout--;
  FILE*g=fopen(av[4],"wb");fwrite(out,1,nout,g);fclose(g);printf("digits %d\n",nout);}
#else
 @OUT@
#endif
 return 0;}
