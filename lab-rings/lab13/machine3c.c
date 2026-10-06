/* המכונה + לולאת-הבודק ב-C (WebAssembly). זהה בדיוק ל-machine3f.mjs: אותן פקודות, אותן שגיאות, אותו ערבוב (חשבון double כמו ב-JS) */
#define ST 65536
#define CS 52   /* מקרה: pa, aa, scramble, mem[16], nfx, fx[32] */
static int STK[ST]; int MEMO[16]; int ADDT[256]; int SHRT[16];
static double fmod31(double x){ double q=__builtin_trunc(x/2147483648.0); return x-q*2147483648.0; }
static int run(const int*ops,const int*args,int n,int pa,int aa,const int*mem0,int maxSteps,int scr){
  for(int i=0;i<16;i++) MEMO[i]=mem0[i];
  int A=0,P=0,pc=0,steps=0,sp=0; double sd=(double)scr;
  while(pc<n){ if(++steps>maxSteps) return -1; int op=ops[pc], k=pc==0?pa:pc==2?aa:args[pc]; pc++;
    switch(op){
      case 0: A=k; break;
      case 1: if(!sp) return -1; A=STK[--sp]%16; break;
      case 2: P=A; break;
      case 3: { if(!sp) return -1; int v=STK[--sp]; if(v!=0){ int back=A<pc; pc=A; if(scr&&back){ sd=fmod31(sd*1103515245.0+12345.0); A=(int)__builtin_floor((sd/2147483648.0)*16.0); sd=fmod31(sd*1103515245.0+12345.0); P=(int)__builtin_floor((sd/2147483648.0)*16.0); } } break; }
      case 4: if(P>=16||P<0) return -1; if(sp>=ST) return -2; STK[sp++]=MEMO[P]; break;
      case 5: if(!sp||P>=16||P<0) return -1; MEMO[P]=STK[--sp]; break;
      case 6: { if(sp<2) return -1; int b=STK[--sp], a=STK[--sp]; STK[sp++]=ADDT[(a*16+b)&255]; break; }
      case 7: if(!sp) return -1; STK[sp-1]=SHRT[STK[sp-1]&15]; break;
      case 8: { if(sp<2) return -1; int b=STK[--sp], a=STK[--sp]; STK[sp++]=~(a&b)&15; break; }
    } }
  return sp==0?1:2; }
/* מריץ את המקרים לפי הסדר מ-start. מחזיר -1 = כולם עברו; אחרת i*4+סוג: 1 נכשל · 2 צריך מכונה איטית · 3 צריך בודק-JS (MEMO מכיל את התוצאה) */
int batch(const int*ops,const int*args,int n,const int*cases,const int*order,int ncases,int maxSteps,int start){
  for(int i=start;i<ncases;i++){ const int*c=cases+order[i]*CS; int r=run(ops,args,n,c[0],c[1],c+3,maxSteps,c[2]);
    if(r==-2) return i*4+2; if(r!=1) return i*4+1; int nfx=c[19]; if(nfx<0) return i*4+3;
    const int*fx=c+20; for(int j=0;j<nfx;j+=2) if(MEMO[fx[j]]!=fx[j+1]) return i*4+1; }
  return -1; }
int* memo(void){ return MEMO; } int* addt(void){ return ADDT; } int* shrt(void){ return SHRT; }
int runone(const int*ops,const int*args,int n,int pa,int aa,const int*mem0,int maxSteps,int scr){ return run(ops,args,n,pa,aa,mem0,maxSteps,scr); }
