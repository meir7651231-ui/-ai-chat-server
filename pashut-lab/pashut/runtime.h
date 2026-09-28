/* runtime.h — ספריית זמן הריצה של "פשוט".
 * כל תוכנית שנבנית כוללת את הקובץ הזה. אין כאן Python — רק C רגיל.
 * הכלל: אף פעם לא ממשיכים עם ערך שגוי. כל כשל = הודעה בעברית עם מספר שורה, ויציאה. */
/* לא כל תוכנית משתמשת בכל פעולה כאן — זה בסדר */
#pragma GCC diagnostic ignored "-Wunused-function"
/* משתנה שהתוכנית שלך נותנת לו ערך ולא משתמשת בו — זה עניין של התוכנית, לא של המהדר */
#pragma GCC diagnostic ignored "-Wunused-but-set-variable"
#pragma GCC diagnostic ignored "-Winfinite-recursion"
#define _DEFAULT_SOURCE
#ifdef _WIN32
/* Windows: printf/strtod מדויקים (כמו ב-glibc) — חשוב להדפסת שברים זהה */
#define __USE_MINGW_ANSI_STDIO 1
#include <windows.h>
#include <shellapi.h>
#include <sys/stat.h>
#endif
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#ifndef _WIN32
#include <signal.h>
#include <unistd.h>
#endif
#include <math.h>
#include <errno.h>
#ifdef _WIN32
#define strtod __mingw_strtod
#endif

/* ---------- שגיאות ---------- */
static int pd_ntry;
static const char *pd_err_text;
static char *pd_err_copy(const char *m) { size_t n = strlen(m); char *r = malloc(n + 1); if (r) memcpy(r, m, n + 1); return r ? r : "?"; }
#include <setjmp.h>
static jmp_buf **pd_tries;
static void (*pd_worker_hook)(int line, const char *msg);
__attribute__((noreturn)) static void pd_die(int line, const char *msg) {
    if (pd_ntry > 0) {                 /* יש "נסה" פעיל — עוברים ל"אם נכשל" שלו */
        pd_err_text = pd_err_copy(msg);
        pd_ntry--;
        longjmp(*pd_tries[pd_ntry], 1);
    }
    if (pd_worker_hook) pd_worker_hook(line, msg);     /* בתוך עובד של "במקביל" — מדווחים להורה */
    fflush(stdout);
    fprintf(stderr, "שגיאה בשורה %d: %s\n", line, msg);
    exit(1);
}
#ifdef PD_NO_GC
/* מצב בדיקה בלבד: malloc רגיל בלי איסוף — כדי ש-ASan יראה כל אובייקט בנפרד ויתפוס גלישה */
static void pd_oom(void) { fflush(stdout); fputs("שגיאה: נגמר הזיכרון\n", stderr); exit(1); }
static void *pd_alloc_kind(size_t n, int atomic) { (void)atomic; void *p = calloc(1, n ? n : 1); if (!p) pd_oom(); return p; }
static void *pd_alloc(size_t n) { return pd_alloc_kind(n, 0); }
static void *pd_alloc_atomic(size_t n) { return pd_alloc_kind(n, 1); }
static void *pd_grow(void *p, size_t oldn, size_t newn, int atomic) {
    void *q = pd_alloc_kind(newn, atomic); if (p) memcpy(q, p, oldn < newn ? oldn : newn); return q;
}
static void (*pd_fin_fn)(void *);
static void *pd_alloc_fin(size_t n) { return pd_alloc_kind(n, 2); }
#else
/* ---------- זיכרון: איסוף אוטומטי ----------
 * כל טקסט, רשימה, מילון ומבנה נוצרים כאן. מדי פעם עוצרים ובודקים מה עוד בשימוש:
 * מתחילים מהמשתנים (המחסנית, המשתנים של כל התוכנית), עוקבים אחרי כל מה שהם מצביעים עליו,
 * וכל מה שלא הגענו אליו — משתחרר ויחזור לשימוש. ("mark & sweep", שמרני: כל מילה שנראית כמו
 * כתובת בתוך הזיכרון שלנו נחשבת מצביע — כך לא משחררים בטעות שום דבר חי.)
 * הזיכרון מחולק לדפים של 4KB. בכל דף תאים בגודל אחד (16..2048 בתים). גדול מזה — כמה דפים רצופים. */
#ifndef _WIN32
#include <sys/mman.h>
#endif
#define PD_PAGE 4096u
#define PD_NCLS 14
#define PD_SMALL_MAX 2048u
static const uint32_t pd_cls_size[PD_NCLS] = {16, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048};
enum { PD_PG_FREE = 0, PD_PG_SMALL = 1, PD_PG_LARGE = 2, PD_PG_CONT = 3 };
typedef struct {
    uint8_t kind, atomic, cls; uint8_t pad;
    uint32_t npages;        /* דף ראשון של אובייקט גדול: כמה דפים; דף המשך: המרחק אחורה לדף הראשון */
    uint64_t alloc[4], mark[4];   /* ביט לכל תא (עד 256 תאים בדף) — לדף גדול: mark[0] */
} pd_pmeta;
static char *pd_heap_lo, *pd_heap_bump, *pd_heap_hi;
static pd_pmeta *pd_meta;
static void *pd_freelist[PD_NCLS][3];      /* [גודל][0 רגיל, 1 אטומי, 2 עם "סיום" — עטיפה של ערך Python] */
static void (*pd_fin_fn)(void *);           /* נקרא לכל תא "עם סיום" שמשתחרר */
typedef struct { uint64_t start, len; } pd_run;
static pd_run *pd_runs; static size_t pd_nruns, pd_capruns;   /* דפים פנויים (רצפים) — מחוץ לערימה */
static size_t pd_since_gc, pd_gc_limit = 8u << 20, pd_live;
static unsigned char pd_cls_of[PD_SMALL_MAX / 16 + 1];
#ifdef _WIN32
extern char __data_start__[], __data_end__[], __bss_start__[], __bss_end__[];
static void *pd_os_reserve(size_t n) { void *p = VirtualAlloc(NULL, n, MEM_RESERVE, PAGE_NOACCESS); return p ? p : (void *)-1; }
static void pd_os_commit(void *p, size_t n) { if (n && !VirtualAlloc(p, n, MEM_COMMIT, PAGE_READWRITE)) { fflush(stdout); fputs("שגיאה: נגמר הזיכרון\n", stderr); exit(1); } }
static void pd_os_release(void *p, size_t n) { VirtualAlloc(p, n, MEM_RESET, PAGE_READWRITE); }
#define PD_RESERVE_FAILED ((void *)-1)
#else
extern void *__libc_stack_end;
extern char __data_start[], _end[];
static void *pd_os_reserve(size_t n) { return mmap(NULL, n, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS | MAP_NORESERVE, -1, 0); }
static void pd_os_commit(void *p, size_t n) { (void)p; (void)n; }          /* לינוקס: הדפים נוצרים כשנוגעים בהם */
static void pd_os_release(void *p, size_t n) { madvise(p, n, MADV_DONTNEED); }
#define PD_RESERVE_FAILED MAP_FAILED
#endif

static void pd_oom(void) { fflush(stdout); fputs("שגיאה: נגמר הזיכרון\n", stderr); exit(1); }
static void pd_heap_init(void) {
    if (pd_heap_lo) return;
    size_t sizes[] = {(size_t)1 << 38, (size_t)1 << 36, (size_t)1 << 34, (size_t)1 << 32, (size_t)1 << 30};
    for (int i = 0; i < 5 && !pd_heap_lo; i++) {
        void *p = pd_os_reserve(sizes[i]);
        if (p == PD_RESERVE_FAILED) continue;
        size_t np = sizes[i] / PD_PAGE;
        void *m = pd_os_reserve(np * sizeof(pd_pmeta));
        if (m == PD_RESERVE_FAILED) continue;     /* (הזיכרון הראשון רק שמור, לא בשימוש — לא נורא) */
        pd_heap_lo = pd_heap_bump = p; pd_heap_hi = (char *)p + sizes[i]; pd_meta = m;
    }
    if (!pd_heap_lo) pd_oom();
    for (unsigned s = 0, c = 0; s <= PD_SMALL_MAX / 16; s++) { while (pd_cls_size[c] < s * 16) c++; pd_cls_of[s] = (unsigned char)c; }
}
static inline uint64_t pd_pageno(const void *p) { return (uint64_t)((const char *)p - pd_heap_lo) / PD_PAGE; }
static inline char *pd_pageaddr(uint64_t pg) { return pd_heap_lo + pg * PD_PAGE; }

/* n דפים רצופים: מהרשימה של הפנויים, אחרת מהסוף */
static uint64_t pd_take_pages(uint64_t n) {
    for (size_t i = 0; i < pd_nruns; i++) if (pd_runs[i].len >= n) {
        uint64_t s = pd_runs[i].start;
        pd_runs[i].start += n; pd_runs[i].len -= n;
        if (!pd_runs[i].len) { memmove(&pd_runs[i], &pd_runs[i + 1], (pd_nruns - i - 1) * sizeof(pd_run)); pd_nruns--; }
        if (n > 1) memset(pd_pageaddr(s), 0, n * PD_PAGE);   /* דף קטן: כל תא מתאפס כשמקצים אותו */
        return s;
    }
    if ((size_t)(pd_heap_hi - pd_heap_bump) < n * PD_PAGE) pd_oom();
    uint64_t s = pd_pageno(pd_heap_bump);
    pd_os_commit(pd_heap_bump, n * PD_PAGE);
    pd_os_commit(&pd_meta[s], n * sizeof(pd_pmeta));
    pd_heap_bump += n * PD_PAGE;
    return s;                                  /* דפים חדשים מה-OS כבר מאופסים */
}
static void pd_gc(void);
static void *pd_alloc_kind(size_t n, int atomic) {
    if (!pd_heap_lo) pd_heap_init();
    if (n == 0) n = 1;
#ifdef PD_GC_TORTURE            /* בדיקה: איסוף כל PD_GC_TORTURE הקצאות */
    { static unsigned long cnt; if (++cnt % (PD_GC_TORTURE) == 0) pd_gc(); }
#else
    if (pd_since_gc > pd_gc_limit) pd_gc();
#endif
    if (n <= PD_SMALL_MAX) {
        unsigned c = pd_cls_of[(n + 15) / 16];
        size_t sz = pd_cls_size[c];
        pd_since_gc += sz;
        void **fl = &pd_freelist[c][atomic];
        if (!*fl) {                            /* דף חדש לגודל הזה */
            uint64_t pg = pd_take_pages(1);
            pd_pmeta *m = &pd_meta[pg];
            memset(m, 0, sizeof *m);
            m->kind = PD_PG_SMALL; m->atomic = (uint8_t)atomic; m->cls = (uint8_t)c;
            char *base = pd_pageaddr(pg);
            unsigned ns = PD_PAGE / (unsigned)sz;
            for (unsigned i = ns; i-- > 0;) { *(void **)(base + i * sz) = *fl; *fl = base + i * sz; }
        }
        char *p = *fl;
        *fl = *(void **)p;
        uint64_t pg = pd_pageno(p);
        unsigned slot = (unsigned)((uint64_t)(p - pd_pageaddr(pg)) / sz);
        pd_meta[pg].alloc[slot >> 6] |= (uint64_t)1 << (slot & 63);
        if (atomic != 1) memset(p, 0, sz);     /* בתוך אטומי אף פעם לא מחפשים מצביעים — אין צורך לאפס */
        else *(void **)p = NULL;
        return p;
    }
    uint64_t np = (n + PD_PAGE - 1) / PD_PAGE;
    if (np > (uint64_t)(pd_heap_hi - pd_heap_lo) / PD_PAGE) pd_oom();
    pd_since_gc += np * PD_PAGE;
    uint64_t pg = pd_take_pages(np);
    pd_pmeta *m = &pd_meta[pg];
    memset(m, 0, sizeof *m);
    m->kind = PD_PG_LARGE; m->atomic = (uint8_t)atomic; m->npages = (uint32_t)np;
    for (uint64_t i = 1; i < np; i++) { pd_meta[pg + i].kind = PD_PG_CONT; pd_meta[pg + i].npages = (uint32_t)i; }
    return pd_pageaddr(pg);
}
static void *pd_alloc(size_t n) { return pd_alloc_kind(n, 0); }          /* יכול להכיל מצביעים */
static void *pd_alloc_atomic(size_t n) { return pd_alloc_kind(n, 1); }   /* רק בתים (טקסט, מספרים) */
static void *pd_alloc_fin(size_t n) { return pd_alloc_kind(n, 2); }      /* כשמשתחרר — pd_fin_fn */
static void *pd_grow(void *p, size_t oldn, size_t newn, int atomic) {
    void *q = pd_alloc_kind(newn, atomic);
    if (p) memcpy(q, p, oldn < newn ? oldn : newn);
    return q;
}

/* --- סימון --- */
typedef struct { char *p; size_t n; } pd_span;
static pd_span *pd_mstack; static size_t pd_mtop, pd_mcap;
static void pd_mpush(char *p, size_t n) {
    if (pd_mtop == pd_mcap) {
        pd_mcap = pd_mcap ? pd_mcap * 2 : 4096;
        pd_mstack = realloc(pd_mstack, pd_mcap * sizeof(pd_span));   /* מחוץ לערימה שלנו */
        if (!pd_mstack) pd_oom();
    }
    pd_mstack[pd_mtop].p = p; pd_mstack[pd_mtop].n = n; pd_mtop++;
}
static inline void pd_mark_ptr(uintptr_t w) {
    if (w < (uintptr_t)pd_heap_lo || w >= (uintptr_t)pd_heap_bump) return;
    uint64_t pg = pd_pageno((void *)w);
    pd_pmeta *m = &pd_meta[pg];
    if (m->kind == PD_PG_CONT) { pg -= m->npages; m = &pd_meta[pg]; }
    if (m->kind == PD_PG_LARGE) {
        if (m->mark[0]) return;
        m->mark[0] = 1;
        pd_live += (size_t)m->npages * PD_PAGE;
        if (m->atomic == 0) pd_mpush(pd_pageaddr(pg), (size_t)m->npages * PD_PAGE);
        return;
    }
    if (m->kind != PD_PG_SMALL) return;
    size_t sz = pd_cls_size[m->cls];
    char *base = pd_pageaddr(pg);
    unsigned slot = (unsigned)((w - (uintptr_t)base) / sz);
    if (slot >= PD_PAGE / sz) return;
    uint64_t bit = (uint64_t)1 << (slot & 63);
    if (!(m->alloc[slot >> 6] & bit) || (m->mark[slot >> 6] & bit)) return;
    m->mark[slot >> 6] |= bit;
    pd_live += sz;
    if (m->atomic == 0) pd_mpush(base + slot * sz, sz);
}
/* קוראים את המחסנית כמילים — גם אזורים ש-ASan מסמן כאסורים; זה בכוונה */
#ifdef PD_VALGRIND               /* בדיקה עם valgrind: הקריאה של המחסנית בכוונה — לא לדווח עליה */
#include <valgrind/memcheck.h>
#endif
__attribute__((no_sanitize_address, noinline))
static void pd_mark_range(const char *lo, const char *hi) {
    lo = (const char *)(((uintptr_t)lo + 7) & ~(uintptr_t)7);
#ifdef PD_VALGRIND
    if (hi > lo) VALGRIND_MAKE_MEM_DEFINED(lo, (size_t)(hi - lo));
#endif
    for (const char *p = lo; p + 8 <= hi; p += 8) pd_mark_ptr(*(const uintptr_t *)p);
}
static void pd_mark_all(void) {
    while (pd_mtop) { pd_mtop--; pd_mark_range(pd_mstack[pd_mtop].p, pd_mstack[pd_mtop].p + pd_mstack[pd_mtop].n); }
}

/* --- ניקוי --- */
static void pd_sweep(void) {
    for (int c = 0; c < PD_NCLS; c++) pd_freelist[c][0] = pd_freelist[c][1] = pd_freelist[c][2] = NULL;
    uint64_t npg = pd_pageno(pd_heap_bump);
    pd_nruns = 0;
    for (uint64_t pg = 0; pg < npg;) {
        pd_pmeta *m = &pd_meta[pg];
        uint64_t span = 1;
        if (m->kind == PD_PG_SMALL) {
            size_t sz = pd_cls_size[m->cls];
            unsigned ns = PD_PAGE / (unsigned)sz;
            bool any = false;
            if (m->atomic == 2 && pd_fin_fn) {          /* לפני שמשחררים: "סיום" לכל תא שמת */
                char *base = pd_pageaddr(pg);
                for (unsigned i = 0; i < ns; i++) {
                    uint64_t bit = (uint64_t)1 << (i & 63);
                    if ((m->alloc[i >> 6] & bit) && !(m->mark[i >> 6] & bit)) pd_fin_fn(base + i * sz);
                }
            }
            for (int i = 0; i < 4; i++) { m->alloc[i] &= m->mark[i]; m->mark[i] = 0; any |= m->alloc[i] != 0; }
            if (!any) m->kind = PD_PG_FREE;
            else {
                char *base = pd_pageaddr(pg);
                for (unsigned i = ns; i-- > 0;) if (!(m->alloc[i >> 6] & ((uint64_t)1 << (i & 63)))) {
#ifdef PD_GC_TORTURE
                    memset(base + i * sz, 0xAB, sz);   /* מה שהשתחרר — ממלאים זבל, כדי שטעות תתגלה מיד */
#endif
                    *(void **)(base + i * sz) = pd_freelist[m->cls][m->atomic];
                    pd_freelist[m->cls][m->atomic] = base + i * sz;
                }
            }
        } else if (m->kind == PD_PG_LARGE) {
            span = m->npages;
            if (!m->mark[0]) {
                for (uint64_t i = 0; i < span; i++) pd_meta[pg + i].kind = PD_PG_FREE;
#ifdef PD_GC_TORTURE
                memset(pd_pageaddr(pg), 0xAB, span * PD_PAGE);
#endif
            }
            m->mark[0] = 0;
        }
        if (pd_meta[pg].kind == PD_PG_FREE) {           /* מאחדים דפים פנויים רצופים */
            if (pd_nruns && pd_runs[pd_nruns - 1].start + pd_runs[pd_nruns - 1].len == pg) pd_runs[pd_nruns - 1].len += span;
            else {
                if (pd_nruns == pd_capruns) {
                    pd_capruns = pd_capruns ? pd_capruns * 2 : 256;
                    pd_runs = realloc(pd_runs, pd_capruns * sizeof(pd_run));
                    if (!pd_runs) pd_oom();
                }
                pd_runs[pd_nruns].start = pg; pd_runs[pd_nruns].len = span; pd_nruns++;
            }
        }
        pg += span;
    }
    /* דפים פנויים: שומרים בערך כמות של סבב אחד לשימוש חוזר (בלי לבקש מחדש מהמערכת), ואת השאר מחזירים למערכת */
    uint64_t keep = pd_gc_limit / PD_PAGE, kept = 0;
    for (size_t i = 0; i < pd_nruns; i++) {
        if (kept + pd_runs[i].len <= keep) { kept += pd_runs[i].len; continue; }
        if (pd_runs[i].len >= 16) pd_os_release(pd_pageaddr(pd_runs[i].start), pd_runs[i].len * PD_PAGE);
    }
}
__attribute__((noinline)) static void pd_gc(void) {
    if (!pd_heap_lo) return;
    jmp_buf regs;                      /* מצביעים שנמצאים עכשיו רק ברגיסטרים — נשמרים כאן, על המחסנית */
    setjmp(regs);
    volatile char here = 0;
    pd_live = 0;
#ifdef _WIN32
    pd_mark_range((const char *)&here, (const char *)((NT_TIB *)NtCurrentTeb())->StackBase);
    pd_mark_range((const char *)&regs, (const char *)&regs + sizeof regs);
    pd_mark_range(__data_start__, __data_end__);
    pd_mark_range(__bss_start__, __bss_end__);
#else
    pd_mark_range((const char *)&here, (const char *)__libc_stack_end);
    pd_mark_range((const char *)&regs, (const char *)&regs + sizeof regs);
    pd_mark_range(__data_start, _end);
#endif
    pd_mark_all();
    pd_sweep();
    pd_since_gc = 0;
    pd_gc_limit = pd_live * 2 > ((size_t)8 << 20) ? pd_live * 2 : ((size_t)8 << 20);
}
#endif

/* ערך שאולי הוא כלום (NULL), בשימוש שצריך ערך אמיתי */
#define pd_nn(x, line) ({ __auto_type _nn = (x); if (!_nn) pd_die(line, "הערך כאן הוא כלום — אין לו שדות, איברים או ערך לחשב איתו"); _nn; })

#ifdef _WIN32
/* Windows: המחסנית נגמרה (או קריסה אחרת) — הודעה בעברית במקום חלון שגיאה */
static LONG WINAPI pd_win_overflow(EXCEPTION_POINTERS *e) {
    if (e->ExceptionRecord->ExceptionCode != EXCEPTION_STACK_OVERFLOW) return EXCEPTION_CONTINUE_SEARCH;
    static const char m[] = "שגיאה: רקורסיה עמוקה מדי — פעולה קוראת לעצמה יותר מדי פעמים\n";
    DWORD w; WriteFile(GetStdHandle(STD_ERROR_HANDLE), m, sizeof m - 1, &w, NULL);
    ExitProcess(1);
    return EXCEPTION_CONTINUE_SEARCH;
}
static LONG WINAPI pd_win_crash(EXCEPTION_POINTERS *e) {
    fflush(stdout);
    static const char m1[] = "שגיאה: רקורסיה עמוקה מדי — פעולה קוראת לעצמה יותר מדי פעמים\n";
    static const char m2[] = "שגיאה פנימית: התוכנה קרסה (זה באג במהדר, לא בקוד שלך)\n";
    bool so = e->ExceptionRecord->ExceptionCode == EXCEPTION_STACK_OVERFLOW;
    DWORD w; WriteFile(GetStdHandle(STD_ERROR_HANDLE), so ? m1 : m2, (DWORD)(so ? sizeof m1 : sizeof m2) - 1, &w, NULL);
    ExitProcess(1);
    return EXCEPTION_EXECUTE_HANDLER;
}
static void pd_init(void) {
    SetConsoleOutputCP(CP_UTF8);         /* עברית במסך */
    SetConsoleCP(CP_UTF8);
    ULONG g = 64 * 1024; SetThreadStackGuarantee(&g);
    AddVectoredExceptionHandler(1, pd_win_overflow);   /* נקרא ראשון — גם כשהמחסנית כמעט גמורה */
    SetUnhandledExceptionFilter(pd_win_crash);
    SetErrorMode(SEM_FAILCRITICALERRORS | SEM_NOGPFAULTERRORBOX);
}
#else
/* רקורסיה עמוקה מדי: המחסנית נגמרת. תופסים את זה על מחסנית חלופית ומדווחים. */
static char pd_altstack[1 << 16];
static void pd_on_segv(int sig) {
    (void)sig;
    fflush(stdout);
    static const char m[] = "שגיאה: רקורסיה עמוקה מדי — פעולה קוראת לעצמה יותר מדי פעמים\n";
    ssize_t w = write(2, m, sizeof m - 1); (void)w;
    _exit(1);
}
static void pd_init(void) {
    stack_t ss;
    memset(&ss, 0, sizeof ss);
    ss.ss_sp = pd_altstack; ss.ss_size = sizeof pd_altstack;
    sigaltstack(&ss, NULL);
    struct sigaction sa;
    memset(&sa, 0, sizeof sa);
    sa.sa_handler = pd_on_segv;
    sa.sa_flags = SA_ONSTACK;
    sigaction(SIGSEGV, &sa, NULL);
}
#endif

/* ---------- מספרים שלמים: חשבון בטוח ---------- */
#define PD_OVF "המספר גדול מדי (מעבר לטווח של מספר שלם)"
static int64_t pd_add(int64_t a, int64_t b, int l) { int64_t r; if (__builtin_add_overflow(a, b, &r)) pd_die(l, PD_OVF); return r; }
static int64_t pd_sub(int64_t a, int64_t b, int l) { int64_t r; if (__builtin_sub_overflow(a, b, &r)) pd_die(l, PD_OVF); return r; }
static int64_t pd_mul(int64_t a, int64_t b, int l) { int64_t r; if (__builtin_mul_overflow(a, b, &r)) pd_die(l, PD_OVF); return r; }
static int64_t pd_neg(int64_t a, int l) { if (a == INT64_MIN) pd_die(l, PD_OVF); return -a; }
static int64_t pd_abs(int64_t a, int l) { return a < 0 ? pd_neg(a, l) : a; }
/* // ו-% כמו ב-Python: עיגול כלפי מטה, והשארית באותו סימן כמו המחלק */
static int64_t pd_floordiv(int64_t a, int64_t b, int l) {
    if (b == 0) pd_die(l, "חלוקה באפס");
    if (a == INT64_MIN && b == -1) pd_die(l, PD_OVF);
    int64_t q = a / b;
    if ((a % b != 0) && ((a < 0) != (b < 0))) q--;
    return q;
}
static int64_t pd_mod(int64_t a, int64_t b, int l) {
    if (b == 0) pd_die(l, "חלוקה באפס (שארית)");
    if (b == -1) return 0;
    int64_t r = a % b;
    if (r != 0 && ((r < 0) != (b < 0))) r += b;
    return r;
}

/* ---------- שברים ---------- */
static double pd_fcheck(double v, int l) {
    if (!isfinite(v)) pd_die(l, "שבר גדול מדי (אינסוף)");
    return v;
}
static double pd_fdiv(double a, double b, int l) {
    if (b == 0) pd_die(l, "חלוקה באפס");
    return pd_fcheck(a / b, l);
}

/* ---------- טקסט (UTF-8) ---------- */
static int pd_u8len(unsigned char c) {
    if (c < 0x80) return 1;
    if ((c >> 5) == 0x6) return 2;
    if ((c >> 4) == 0xE) return 3;
    if ((c >> 3) == 0x1E) return 4;
    return 1;
}
#include "unidata.h"
static uint32_t pd_u8dec(const unsigned char *p, int *n) {
    int k = pd_u8len(*p); *n = k;
    if (k == 1) return *p;
    uint32_t c = *p & (0xFF >> (k + 1));
    for (int i = 1; i < k; i++) c = (c << 6) | (p[i] & 0x3F);
    return c;
}
static bool pd_in_ranges(const uint32_t (*t)[2], size_t n, uint32_t c) {
    size_t lo = 0, hi = n;
    while (lo < hi) { size_t m = (lo + hi) / 2; if (c < t[m][0]) hi = m; else if (c > t[m][1]) lo = m + 1; else return true; }
    return false;
}
#define PD_NT(t) (sizeof t / sizeof t[0])

/* אורך באותיות, לא בבתים: כמה("שלום") = 4 */
static int64_t pd_len(const char *s) {
    size_t b = strlen(s);
    const unsigned char *p = (const unsigned char *)s;
    int64_t n = 0;
    for (size_t i = 0; i < b; i++) n += (p[i] & 0xC0) != 0x80;   /* הקומפיילר הופך את זה לפעולות וקטוריות */
    return n;
}
static const char *pd_substr(const char *p, size_t n) {
    char *r = pd_alloc_atomic(n + 1);
    memcpy(r, p, n); r[n] = 0;
    return r;
}
static const char *pd_concat(const char *a, const char *b) {
    size_t x = strlen(a), y = strlen(b);
    char *r = pd_alloc_atomic(x + y + 1);
    memcpy(r, a, x); memcpy(r + x, b, y + 1);
    return r;
}

/* ---------- המרות ---------- */
static const char *pd_int_to_text(int64_t v) {
    char b[32]; snprintf(b, sizeof b, "%lld", (long long)v);
    return pd_substr(b, strlen(b));
}
/* שבר לטקסט כמו ב-Python: הכי מעט ספרות שמחזירות בדיוק את אותו מספר */
static const char *pd_float_to_text(double v) {
    char e[64], out[80];
    if (v == 0) return signbit(v) ? "-0.0" : "0.0";
    int p;
    for (p = 1; p <= 17; p++) {
        snprintf(e, sizeof e, "%.*e", p - 1, v);
        if (strtod(e, NULL) == v) break;
    }
    /* e = [-]d.ddde±XX */
    char digits[32]; int nd = 0, neg = 0, exp10;
    const char *q = e;
    if (*q == '-') { neg = 1; q++; }
    for (; *q && *q != 'e'; q++) if (*q != '.') digits[nd++] = *q;
    while (nd > 1 && digits[nd - 1] == '0') nd--;
    exp10 = atoi(q + 1);
    char *o = out;
    if (neg) *o++ = '-';
    if (exp10 >= -4 && exp10 < 16) {
        if (exp10 < 0) {
            *o++ = '0'; *o++ = '.';
            for (int i = 0; i < -exp10 - 1; i++) *o++ = '0';
            for (int i = 0; i < nd; i++) *o++ = digits[i];
        } else {
            for (int i = 0; i <= exp10; i++) *o++ = i < nd ? digits[i] : '0';
            *o++ = '.';
            if (nd > exp10 + 1) for (int i = exp10 + 1; i < nd; i++) *o++ = digits[i];
            else *o++ = '0';
        }
        *o = 0;
    } else {
        *o++ = digits[0];
        if (nd > 1) { *o++ = '.'; for (int i = 1; i < nd; i++) *o++ = digits[i]; }
        snprintf(o, sizeof out - (size_t)(o - out), "e%c%02d", exp10 < 0 ? '-' : '+', exp10 < 0 ? -exp10 : exp10);
    }
    return pd_substr(out, strlen(out));
}
static const char *pd_bool_to_text(bool b) { return b ? "נכון" : "לא נכון"; }

/* מספר("42") — קפדני: רווחים מסביב, סימן אופציונלי, ספרות בלבד */
static int64_t pd_text_to_int(const char *s, int l) {
    const char *p = s;
    while (*p == ' ' || *p == '\t') p++;
    int neg = 0;
    if (*p == '+' || *p == '-') { neg = *p == '-'; p++; }
    if (*p < '0' || *p > '9') goto bad;
    int64_t v = 0;
    for (; *p >= '0' && *p <= '9'; p++) {
        if (__builtin_mul_overflow(v, (int64_t)10, &v) || __builtin_sub_overflow(v, (int64_t)(*p - '0'), &v))
            pd_die(l, PD_OVF);
    }
    while (*p == ' ' || *p == '\t' || *p == '\r' || *p == '\n') p++;
    if (*p) goto bad;
    if (!neg) { if (v == INT64_MIN) pd_die(l, PD_OVF); v = -v; }
    return v;
bad:;
    char m[300];
    snprintf(m, sizeof m, "הטקסט \"%.200s\" אינו מספר שלם", s);
    pd_die(l, m);
    return 0;
}
static double pd_text_to_float(const char *s, int l) {
    char *end;
    errno = 0;
    double v = strtod(s, &end);
    while (*end == ' ' || *end == '\t' || *end == '\r' || *end == '\n') end++;
    const char *p = s; while (*p == ' ' || *p == '\t') p++;
    if (end == s || *end || !*p || errno == ERANGE || !isfinite(v)) {
        char m[300];
        snprintf(m, sizeof m, "הטקסט \"%.200s\" אינו מספר", s);
        pd_die(l, m);
    }
    return v;
}
static int64_t pd_float_to_int(double v, int l) {
    if (!(v > -9223372036854775808.0 && v < 9223372036854775808.0)) pd_die(l, PD_OVF);
    return (int64_t)v;
}

/* ---------- בניית טקסט ---------- */
typedef struct { char *s; size_t len, cap; } pd_sb;
static void pd_sb_add(pd_sb *b, const char *t) {
    size_t n = strlen(t);
    if (b->len + n + 1 > b->cap) {
        size_t c = b->cap ? b->cap * 2 : 64;
        while (c < b->len + n + 1) c *= 2;
        b->s = pd_grow(b->s, b->len + 1, c, 1); b->cap = c;
    }
    memcpy(b->s + b->len, t, n + 1);
    b->len += n;
}
static inline void pd_sb_addn(pd_sb *b, const char *t, size_t n) {
    if (b->len + n + 1 > b->cap) {
        size_t c = b->cap ? b->cap * 2 : 64;
        while (c < b->len + n + 1) c *= 2;
        b->s = pd_grow(b->s, b->len + 1, c, 1); b->cap = c;
    }
    memcpy(b->s + b->len, t, n); b->len += n; b->s[b->len] = 0;
}
static const char *pd_sb_done(pd_sb *b) { if (!b->s) pd_sb_add(b, ""); return b->s; }

/* ---------- קלט ופלט ---------- */
static bool pd_valid_utf8(const unsigned char *p, size_t n);
#define pd_valid_utf8_fwd pd_valid_utf8
static const char *pd_input(const char *prompt, int l) {
    fputs(prompt, stdout);
    fflush(stdout);
    /* כמו Python בלינוקס: השורה נגמרת ב-\n בלבד (\r נשאר חלק מהטקסט) */
    pd_sb b = {0}; pd_sb_add(&b, "");
    char chunk[256]; size_t k = 0; int c; bool any = false;
    while ((c = getchar()) != EOF) {
        any = true;
        if (c == '\n') break;
        if (c == 0) pd_die(l, "הקלט לא בקידוד UTF-8 (או שיש בו תו אפס)");
        chunk[k++] = (char)c;
        if (k == sizeof chunk - 1) { chunk[k] = 0; pd_sb_add(&b, chunk); k = 0; }
    }
    if (!any) pd_die(l, "לא התקבל קלט (הקלט נגמר)");
    chunk[k] = 0; pd_sb_add(&b, chunk);
    const char *line = pd_sb_done(&b);
    if (!pd_valid_utf8_fwd((const unsigned char *)line, strlen(line))) pd_die(l, "הקלט לא בקידוד UTF-8 (או שיש בו תו אפס)");
    return line;
}
static void pd_sep(void) { putchar(' '); }
static void pd_print_text(const char *s) { fputs(s, stdout); }
static void pd_print_int(int64_t v) { printf("%lld", (long long)v); }
static void pd_print_float(double v) { fputs(pd_float_to_text(v), stdout); }
static void pd_print_bool(bool b) { fputs(pd_bool_to_text(b), stdout); }
static void pd_endl(void) { putchar('\n'); }

/* טקסט בתוך רשימה מוצג עם מרכאות, כמו ב-Python: ['א', 'ב'] */
static const char *pd_repr_text(const char *s) {
    char q = (strchr(s, '\'') && !strchr(s, '"')) ? '"' : '\'';
    pd_sb b = {0};
    char one[8] = {q, 0};
    pd_sb_add(&b, one);
    for (const unsigned char *p = (const unsigned char *)s; *p; p++) {
        char t[16];
        if (*p >= 0x80) {       /* אות לא-אנגלית: מוצגת כמו שהיא, אלא אם היא "בלתי נראית" — אז כמו Python: \xa0, \u2028 */
            int n; uint32_t c = pd_u8dec(p, &n);
            if (pd_in_ranges(pd_noprint_tab, PD_NT(pd_noprint_tab), c)) {
                if (c < 0x100) snprintf(t, sizeof t, "\\x%02x", c);
                else if (c < 0x10000) snprintf(t, sizeof t, "\\u%04x", c);
                else snprintf(t, sizeof t, "\\U%08x", c);
                pd_sb_add(&b, t);
            } else { memcpy(t, p, (size_t)n); t[n] = 0; pd_sb_add(&b, t); }
            p += n - 1;
            continue;
        }
        if (*p == '\\') pd_sb_add(&b, "\\\\");
        else if (*p == (unsigned char)q) { t[0] = '\\'; t[1] = q; t[2] = 0; pd_sb_add(&b, t); }
        else if (*p == '\n') pd_sb_add(&b, "\\n");
        else if (*p == '\t') pd_sb_add(&b, "\\t");
        else if (*p == '\r') pd_sb_add(&b, "\\r");
        else if (*p < 0x20 || *p == 0x7f) { snprintf(t, sizeof t, "\\x%02x", *p); pd_sb_add(&b, t); }
        else { t[0] = (char)*p; t[1] = 0; pd_sb_add(&b, t); }
    }
    pd_sb_add(&b, one);
    return pd_sb_done(&b);
}

/* אות במקום i בטקסט (לפי אותיות; -1 = האחרונה) */
static const char *pd_text_at(const char *s, int64_t i, int l) {
    int64_t n = pd_len(s), j = i < 0 ? i + n : i;
    if (j < 0 || j >= n) {
        char m[160];
        snprintf(m, sizeof m, "אין אות במקום %lld (בטקסט יש %lld אותיות)", (long long)i, (long long)n);
        pd_die(l, m);
    }
    const unsigned char *p = (const unsigned char *)s;
    for (int64_t k = 0; k < j; k++) p += pd_u8len(*p);
    return pd_substr((const char *)p, (size_t)pd_u8len(*p));
}
static bool pd_text_contains(const char *hay, const char *needle) { return strstr(hay, needle) != NULL; }

/* ---------- רשימות ---------- */
typedef union { int64_t i; double f; const char *s; bool b; void *p; } pd_val;
typedef struct { int64_t len, cap; pd_val *a; } pd_list;
static pd_val pd_vi(int64_t x) { pd_val v; v.i = x; return v; }
static pd_val pd_vf(double x) { pd_val v; v.f = x; return v; }
static pd_val pd_vs(const char *x) { pd_val v; v.s = x; return v; }
static pd_val pd_vb(bool x) { pd_val v; v.i = 0; v.b = x; return v; }
static pd_val pd_vp(void *x) { pd_val v; v.p = x; return v; }

static pd_list *pd_list_new(int64_t cap) {
    pd_list *l = pd_alloc(sizeof *l);
    l->len = 0; l->cap = cap > 0 ? cap : 4;
    l->a = pd_alloc(sizeof(pd_val) * (size_t)l->cap);
    return l;
}
static void pd_list_push(pd_list *l, pd_val v) {
    if (l->len == l->cap) {
        int64_t c = l->cap * 2;
        l->a = pd_grow(l->a, sizeof(pd_val) * (size_t)l->len, sizeof(pd_val) * (size_t)c, 0); l->cap = c;
    }
    l->a[l->len++] = v;
}
static int64_t pd_list_index(pd_list *l, int64_t i, int line) {
    int64_t j = i < 0 ? i + l->len : i;
    if (j < 0 || j >= l->len) {
        char m[160];
        if (l->len == 0) snprintf(m, sizeof m, "אין איבר במקום %lld — הרשימה ריקה", (long long)i);
        else if (l->len == 1) snprintf(m, sizeof m, "אין איבר במקום %lld (ברשימה יש איבר אחד, במקום 0)", (long long)i);
        else snprintf(m, sizeof m, "אין איבר במקום %lld (ברשימה יש %lld איברים: מקומות 0 עד %lld)",
                      (long long)i, (long long)l->len, (long long)(l->len - 1));
        pd_die(line, m);
    }
    return j;
}
static pd_val pd_list_get(pd_list *l, int64_t i, int line) { return l->a[pd_list_index(l, i, line)]; }
static void pd_list_set(pd_list *l, int64_t i, pd_val v, int line) { l->a[pd_list_index(l, i, line)] = v; }
static pd_val pd_list_pop(pd_list *l, int line) {
    if (l->len == 0) pd_die(line, "אי אפשר להוציא איבר מרשימה ריקה");
    return l->a[--l->len];
}
static pd_list *pd_list_concat(pd_list *a, pd_list *b) {
    pd_list *r = pd_list_new(a->len + b->len);
    for (int64_t i = 0; i < a->len; i++) pd_list_push(r, a->a[i]);
    for (int64_t i = 0; i < b->len; i++) pd_list_push(r, b->a[i]);
    return r;
}
static pd_list *pd_list_copy(pd_list *a) { return pd_list_concat(a, pd_list_new(0)); }
static void pd_list_need(pd_list *l, const char *what, int line) {
    if (l->len == 0) { char m[160]; snprintf(m, sizeof m, "%s של רשימה ריקה — אין בה אף איבר", what); pd_die(line, m); }
}
/* סכום שברים — אותה שיטה כמו Python 3.12 ומעלה (צבירה מתוקנת), כדי ש-0.1 עשר פעמים ייתן 1.0 */
static double pd_fsum(pd_list *l, int line) {
    double r = 0, c = 0;
    for (int64_t i = 0; i < l->len; i++) {
        double x = l->a[i].f, t = r + x;
        if (fabs(r) >= fabs(x)) c += (r - t) + x; else c += (x - t) + r;
        r = t;
    }
    if (c != 0 && isfinite(c)) r += c;
    pd_fcheck(r, line);
    return r;
}

static int pd_cmp_i(const void *x, const void *y) { int64_t a = ((const pd_val *)x)->i, b = ((const pd_val *)y)->i; return (a > b) - (a < b); }
static int pd_cmp_f(const void *x, const void *y) { double a = ((const pd_val *)x)->f, b = ((const pd_val *)y)->f; return (a > b) - (a < b); }
static int pd_cmp_s(const void *x, const void *y) { return strcmp(((const pd_val *)x)->s, ((const pd_val *)y)->s); }
/* מיון יציב (מיזוג), כמו ב-Python */
static void pd_msort(pd_val *a, pd_val *t, int64_t n, int (*cmp)(const void *, const void *)) {
    if (n < 2) return;
    int64_t m = n / 2;
    pd_msort(a, t, m, cmp); pd_msort(a + m, t, n - m, cmp);
    int64_t i = 0, j = m, k = 0;
    while (i < m && j < n) t[k++] = cmp(&a[j], &a[i]) < 0 ? a[j++] : a[i++];
    while (i < m) t[k++] = a[i++];
    while (j < n) t[k++] = a[j++];
    memcpy(a, t, sizeof(pd_val) * (size_t)n);
}
static pd_list *pd_sorted(pd_list *l, int (*cmp)(const void *, const void *)) {
    pd_list *r = pd_list_copy(l);
    pd_val *t = pd_alloc(sizeof(pd_val) * (size_t)(r->len ? r->len : 1));
    pd_msort(r->a, t, r->len, cmp);
    return r;
}

/* ---------- חיתוך: רשימה[מ:עד:קפיצה], טקסט[מ:עד:קפיצה] — אותם כללים כמו Python ---------- */
/* has = אילו מהשלושה נכתבו (1=מ, 2=עד, 4=קפיצה). מחזיר כמה איברים, ומה ההתחלה והקפיצה */
static int64_t pd_slice_adjust(int64_t len, int has, int64_t a, int64_t b, int64_t s, int64_t *start, int64_t *step, int line) {
    if (!(has & 4)) s = 1;
    if (s == 0) pd_die(line, "הקפיצה בחיתוך לא יכולה להיות 0");
    if (s < -INT64_MAX) s = -INT64_MAX;
    if (!(has & 1)) a = s < 0 ? INT64_MAX : 0;
    if (!(has & 2)) b = s < 0 ? INT64_MIN : INT64_MAX;
    if (a < 0) { a += len; if (a < 0) a = s < 0 ? -1 : 0; }
    else if (a >= len) a = s < 0 ? len - 1 : len;
    if (b < 0) { b += len; if (b < 0) b = s < 0 ? -1 : 0; }
    else if (b >= len) b = s < 0 ? len - 1 : len;
    *start = a; *step = s;
    if (s < 0) return b < a ? (a - b - 1) / (-s) + 1 : 0;
    return a < b ? (b - a - 1) / s + 1 : 0;
}
static pd_list *pd_list_slice(pd_list *l, int has, int64_t a, int64_t b, int64_t s, int line) {
    int64_t st, sp, n = pd_slice_adjust(l->len, has, a, b, s, &st, &sp, line);
    pd_list *r = pd_list_new(n);
    for (int64_t k = 0; k < n; k++) pd_list_push(r, l->a[st + k * sp]);
    return r;
}
static const char *pd_text_slice(const char *t, int has, int64_t a, int64_t b, int64_t s, int line) {
    int64_t len = pd_len(t);
    const char **at = pd_alloc(sizeof(char *) * (size_t)(len + 1));   /* איפה מתחילה כל אות */
    const unsigned char *p = (const unsigned char *)t;
    for (int64_t k = 0; k < len; k++) { at[k] = (const char *)p; p += pd_u8len(*p); }
    at[len] = (const char *)p;
    int64_t st, sp, n = pd_slice_adjust(len, has, a, b, s, &st, &sp, line);
    pd_sb r = {0};
    pd_sb_add(&r, "");
    char one[8];
    for (int64_t k = 0; k < n; k++) {
        int64_t j = st + k * sp;
        size_t w = (size_t)(at[j + 1] - at[j]);
        memcpy(one, at[j], w); one[w] = 0;
        pd_sb_add(&r, one);
    }
    return pd_sb_done(&r);
}

/* ---------- מילונים: מפתח ← ערך, בסדר ההכנסה (כמו Python) ---------- */
enum { PD_KI = 0, PD_KB = 1, PD_KS = 2 };   /* סוג המפתח: מספר, נכון/לא נכון, טקסט */
typedef struct {
    int64_t len;          /* כמה מפתחות חיים */
    int64_t n, cap;       /* כמה רשומות (כולל מחוקות), וכמה מקום */
    int64_t icap;         /* גודל טבלת החיפוש (חזקה של 2) */
    int64_t ver;          /* עולה בכל הוספה/מחיקה של מפתח — כדי לתפוס שינוי בזמן לולאה */
    int kind;
    pd_val *k, *v;
    bool *dead;
    int64_t *ix;          /* טבלת החיפוש: מקום הרשומה + 1, או 0 = ריק */
} pd_dict;

static uint64_t pd_hash(int kind, pd_val k) {
    if (kind == PD_KS) {
        uint64_t h = 1469598103934665603ULL;
        for (const unsigned char *p = (const unsigned char *)k.s; *p; p++) { h ^= *p; h *= 1099511628211ULL; }
        return h;
    }
    uint64_t x = kind == PD_KB ? (uint64_t)k.b : (uint64_t)k.i;
    x += 0x9e3779b97f4a7c15ULL; x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL; return x ^ (x >> 31);
}
static bool pd_key_eq(int kind, pd_val a, pd_val b) {
    if (kind == PD_KS) return strcmp(a.s, b.s) == 0;
    if (kind == PD_KB) return a.b == b.b;
    return a.i == b.i;
}
__attribute__((noipa)) static const char *pd_key_text(int kind, pd_val k) {   /* noinline: gcc מזהיר בטעות על ענף שלא רץ */
    if (kind == PD_KS) return pd_repr_text(k.s);
    if (kind == PD_KB) return pd_bool_to_text(k.b);
    return pd_int_to_text(k.i);
}
static pd_dict *pd_dict_new(int kind) {
    pd_dict *d = pd_alloc(sizeof *d);
    d->len = d->n = 0; d->cap = 8; d->icap = 16; d->ver = 0; d->kind = kind;
    d->k = pd_alloc(sizeof(pd_val) * 8); d->v = pd_alloc(sizeof(pd_val) * 8);
    d->dead = pd_alloc_atomic(sizeof(bool) * 8);
    d->ix = pd_alloc_atomic(sizeof(int64_t) * 16);
    memset(d->ix, 0, sizeof(int64_t) * 16);
    return d;
}
static void pd_dict_reindex(pd_dict *d) {
    int64_t w = 0;                       /* קודם מסלקים מחוקים */
    for (int64_t r = 0; r < d->n; r++)
        if (!d->dead[r]) { d->k[w] = d->k[r]; d->v[w] = d->v[r]; d->dead[w] = false; w++; }
    d->n = w;
    while (d->icap < 4 * (d->n + 1)) d->icap *= 2;
    d->ix = pd_alloc_atomic(sizeof(int64_t) * (size_t)d->icap);
    memset(d->ix, 0, sizeof(int64_t) * (size_t)d->icap);
    for (int64_t r = 0; r < d->n; r++) {
        uint64_t m = (uint64_t)d->icap - 1, h = pd_hash(d->kind, d->k[r]) & m;
        while (d->ix[h]) h = (h + 1) & m;
        d->ix[h] = r + 1;
    }
}
/* מקום בטבלה: של המפתח אם קיים, אחרת של תא ריק */
static uint64_t pd_dict_slot(pd_dict *d, pd_val k) {
    uint64_t m = (uint64_t)d->icap - 1, h = pd_hash(d->kind, k) & m;
    for (;;) {
        int64_t e = d->ix[h];
        if (!e) return h;
        if (!d->dead[e - 1] && pd_key_eq(d->kind, d->k[e - 1], k)) return h;
        h = (h + 1) & m;
    }
}
static int64_t pd_dict_find(pd_dict *d, pd_val k) {
    int64_t e = d->ix[pd_dict_slot(d, k)];
    return e ? e - 1 : -1;
}
static bool pd_dict_has(pd_dict *d, pd_val k) { return pd_dict_find(d, k) >= 0; }
static void pd_dict_set(pd_dict *d, pd_val k, pd_val v) {
    int64_t e = pd_dict_find(d, k);
    if (e >= 0) { d->v[e] = v; return; }
    if (d->n == d->cap) {
        int64_t c = d->cap * 2;
        d->k = pd_grow(d->k, sizeof(pd_val) * (size_t)d->n, sizeof(pd_val) * (size_t)c, 0);
        d->v = pd_grow(d->v, sizeof(pd_val) * (size_t)d->n, sizeof(pd_val) * (size_t)c, 0);
        d->dead = pd_grow(d->dead, sizeof(bool) * (size_t)d->n, sizeof(bool) * (size_t)c, 1);
        d->cap = c;
    }
    d->k[d->n] = k; d->v[d->n] = v; d->dead[d->n] = false; d->n++;
    d->len++; d->ver++;
    if (4 * d->n >= 3 * d->icap) pd_dict_reindex(d);
    else d->ix[pd_dict_slot(d, k)] = d->n;
}
static void pd_dict_missing(pd_dict *d, pd_val k, int line) {
    pd_sb b = {0};
    pd_sb_add(&b, "אין במילון את המפתח ");
    pd_sb_add(&b, pd_key_text(d->kind, k));
    pd_die(line, pd_sb_done(&b));
}
static pd_val pd_dict_get(pd_dict *d, pd_val k, int line) {
    int64_t e = pd_dict_find(d, k);
    if (e < 0) pd_dict_missing(d, k, line);
    return d->v[e];
}
static pd_val pd_dict_get_or(pd_dict *d, pd_val k, pd_val def) {
    int64_t e = pd_dict_find(d, k);
    return e < 0 ? def : d->v[e];
}
static pd_val pd_dict_pop(pd_dict *d, pd_val k, int line) {
    int64_t e = pd_dict_find(d, k);
    if (e < 0) pd_dict_missing(d, k, line);
    pd_val v = d->v[e];
    d->dead[e] = true; d->len--; d->ver++;
    if (d->n > 16 && 2 * d->len < d->n) pd_dict_reindex(d);   /* הרבה מחוקים — לנקות */
    return v;
}
static pd_list *pd_dict_keys(pd_dict *d) {
    pd_list *r = pd_list_new(d->len);
    for (int64_t e = 0; e < d->n; e++) if (!d->dead[e]) pd_list_push(r, d->k[e]);
    return r;
}
static pd_list *pd_dict_values(pd_dict *d) {
    pd_list *r = pd_list_new(d->len);
    for (int64_t e = 0; e < d->n; e++) if (!d->dead[e]) pd_list_push(r, d->v[e]);
    return r;
}
/* לולאה על מילון: המקום הבא, או -1 בסוף. אם נוסף/נמחק מפתח באמצע — עוצרים, כמו Python */
static int64_t pd_dict_next(pd_dict *d, volatile int64_t *i, int64_t ver, int line) {
    if (d->ver != ver) pd_die(line, "המילון השתנה (נוסף או נמחק מפתח) בזמן שהלולאה עוברת עליו");
    while (*i < d->n && d->dead[*i]) (*i)++;
    if (*i >= d->n) return -1;
    return (*i)++;
}

/* ---------- פעולות על טקסט — כמו ב-Python (split, join, replace, strip, upper, lower, find...) ---------- */
static bool pd_isspace(uint32_t c) { return pd_in_ranges(pd_space_tab, PD_NT(pd_space_tab), c); }
static const char *pd_case_find(const void *tab, size_t n, uint32_t c) {
    const struct { uint32_t cp; const char *s; } *t = tab;
    size_t lo = 0, hi = n;
    while (lo < hi) { size_t m = (lo + hi) / 2; if (c < t[m].cp) hi = m; else if (c > t[m].cp) lo = m + 1; else return t[m].s; }
    return NULL;
}
/* בודק שטקסט שהגיע מבחוץ (קלט, קובץ, ארגומנט) הוא UTF-8 תקין — כמו ש-Python בודק */
static bool pd_valid_utf8(const unsigned char *p, size_t n) {
    size_t i = 0;
    while (i < n) {
        unsigned char c = p[i];
        if (c == 0) return false;
        if (c < 0x80) { i++; continue; }
        int k; uint32_t v, min;
        if ((c >> 5) == 0x6) { k = 2; v = c & 0x1F; min = 0x80; }
        else if ((c >> 4) == 0xE) { k = 3; v = c & 0x0F; min = 0x800; }
        else if ((c >> 3) == 0x1E) { k = 4; v = c & 0x07; min = 0x10000; }
        else return false;
        if (i + (size_t)k > n) return false;
        for (int j = 1; j < k; j++) { if ((p[i + j] & 0xC0) != 0x80) return false; v = (v << 6) | (p[i + j] & 0x3F); }
        if (v < min || v > 0x10FFFF || (v >= 0xD800 && v < 0xE000)) return false;
        i += (size_t)k;
    }
    return true;
}
static const char *pd_text_case(const char *s, bool up) {
    size_t n0 = strlen(s);
    pd_sb b = {0};
    b.s = pd_alloc_atomic(n0 + 16); b.cap = n0 + 16; b.s[0] = 0;   /* בדרך כלל האורך לא משתנה */
    const unsigned char *p = (const unsigned char *)s, *run = p;
    const uint64_t *blk = up ? pd_upper_blk : pd_lower_blk;
    /* מעתיקים רצפים שלמים; עוצרים רק באות לא-אנגלית שיש לה צורה אחרת (האנגליות מתוקנות בסוף, במקום) */
    while (*p) {
        if (*p < 0x80) { p++; continue; }
        int n; uint32_t c = pd_u8dec(p, &n);
        if (!(blk[c >> 12] >> ((c >> 6) & 63) & 1)) { p += n; continue; }
        const char *m = up ? pd_case_find(pd_upper_tab, PD_NT(pd_upper_tab), c) : pd_case_find(pd_lower_tab, PD_NT(pd_lower_tab), c);
        if (!up && c == 0x3A3) {          /* Σ: בסוף מילה ς, אחרת σ — הכלל של Python */
            const unsigned char *r0 = p; uint32_t d = 0; bool fin = false;
            while (r0 > (const unsigned char *)s) {       /* אחורה, מדלגים על תווים שקופים */
                do r0--; while (r0 > (const unsigned char *)s && (*r0 & 0xC0) == 0x80);
                int k; d = pd_u8dec(r0, &k);
                if (!pd_in_ranges(pd_ign_tab, PD_NT(pd_ign_tab), d)) { fin = pd_in_ranges(pd_cased_tab, PD_NT(pd_cased_tab), d); break; }
            }
            if (fin) {                                   /* קדימה: אם יש אחריו אות — זה לא סוף מילה */
                const unsigned char *r = p + n;
                while (*r) {
                    int k; d = pd_u8dec(r, &k);
                    if (!pd_in_ranges(pd_ign_tab, PD_NT(pd_ign_tab), d)) { if (pd_in_ranges(pd_cased_tab, PD_NT(pd_cased_tab), d)) fin = false; break; }
                    r += k;
                }
            }
            m = fin ? "\xcf\x82" : "\xcf\x83";
        }
        if (m) {
            pd_sb_addn(&b, (const char *)run, (size_t)(p - run));
            pd_sb_addn(&b, m, strlen(m));
            run = p + n;
        }
        p += n;
    }
    pd_sb_addn(&b, (const char *)run, (size_t)(p - run));
    /* אותיות אנגליות: תיקון במקום. (אותיות שנוצרו מהטבלה, כמו SS מ-ß, כבר בצורה הנכונה — לא ישתנו) */
    char *o = b.s;
    if (up) { for (size_t i = 0; i < b.len; i++) if (o[i] >= 'a' && o[i] <= 'z') o[i] = (char)(o[i] - 32); }
    else    { for (size_t i = 0; i < b.len; i++) if (o[i] >= 'A' && o[i] <= 'Z') o[i] = (char)(o[i] + 32); }
    return pd_sb_done(&b);
}
/* מקום בבתים -> מקום באותיות */
static int64_t pd_cp_index(const char *s, const char *at) {
    int64_t k = 0;
    for (const unsigned char *p = (const unsigned char *)s; p < (const unsigned char *)at; p++) if ((*p & 0xC0) != 0x80) k++;
    return k;
}
static int64_t pd_text_find(const char *s, const char *sub) {
    const char *f = strstr(s, sub);
    return f ? pd_cp_index(s, f) : -1;
}
static int64_t pd_text_count(const char *s, const char *sub) {
    if (!*sub) return pd_len(s) + 1;
    int64_t n = 0; size_t k = strlen(sub);
    for (const char *f = strstr(s, sub); f; f = strstr(f + k, sub)) n++;
    return n;
}
static bool pd_text_starts(const char *s, const char *x) { return strncmp(s, x, strlen(x)) == 0; }
static bool pd_text_ends(const char *s, const char *x) {
    size_t a = strlen(s), b = strlen(x);
    return b <= a && memcmp(s + a - b, x, b) == 0;
}
static const char *pd_text_replace(const char *s, const char *old, const char *new_) {
    pd_sb b = {0}; pd_sb_add(&b, "");
    if (!*old) {                      /* "ab".replace("", "-") = "-a-b-" */
        char one[8];
        pd_sb_add(&b, new_);
        for (const unsigned char *p = (const unsigned char *)s; *p;) {
            int n = pd_u8len(*p); memcpy(one, p, (size_t)n); one[n] = 0; pd_sb_add(&b, one); pd_sb_add(&b, new_); p += n;
        }
        return pd_sb_done(&b);
    }
    size_t k = strlen(old);
    const char *p = s;
    for (const char *f = strstr(p, old); f; f = strstr(p, old)) {
        pd_sb_add(&b, pd_substr(p, (size_t)(f - p)));
        pd_sb_add(&b, new_);
        p = f + k;
    }
    pd_sb_add(&b, p);
    return pd_sb_done(&b);
}
/* פצל: בלי מפריד — לפי רווחים (כל סוג), בלי חלקים ריקים. עם מפריד — בדיוק לפיו */
static pd_list *pd_text_split(const char *s, const char *sep, int line) {
    pd_list *r = pd_list_new(0);
    if (sep) {
        if (!*sep) pd_die(line, "המפריד ב\"פצל\" לא יכול להיות טקסט ריק");
        size_t k = strlen(sep);
        const char *p = s;
        for (const char *f = strstr(p, sep); f; f = strstr(p, sep)) { pd_list_push(r, pd_vs(pd_substr(p, (size_t)(f - p)))); p = f + k; }
        pd_list_push(r, pd_vs(pd_substr(p, strlen(p))));
        return r;
    }
    const unsigned char *p = (const unsigned char *)s, *start = NULL;
    while (*p) {
        int n; uint32_t c = pd_u8dec(p, &n);
        if (pd_isspace(c)) { if (start) { pd_list_push(r, pd_vs(pd_substr((const char *)start, (size_t)(p - start)))); start = NULL; } }
        else if (!start) start = p;
        p += n;
    }
    if (start) pd_list_push(r, pd_vs(pd_substr((const char *)start, (size_t)(p - start))));
    return r;
}
/* שורות: כמו splitlines() — כל סוגי סוף-השורה, בלי שורה ריקה בסוף */
static pd_list *pd_text_lines(const char *s) {
    pd_list *r = pd_list_new(0);
    const unsigned char *p = (const unsigned char *)s, *start = p;
    while (*p) {
        int n; uint32_t c = pd_u8dec(p, &n);
        bool br = c == '\n' || c == '\r' || c == 0x0B || c == 0x0C || c == 0x1C || c == 0x1D || c == 0x1E ||
                  c == 0x85 || c == 0x2028 || c == 0x2029;
        if (br) {
            pd_list_push(r, pd_vs(pd_substr((const char *)start, (size_t)(p - start))));
            p += n;
            if (c == '\r' && *p == '\n') p++;
            start = p;
        } else p += n;
    }
    if (*start) pd_list_push(r, pd_vs(pd_substr((const char *)start, strlen((const char *)start))));
    return r;
}
static const char *pd_text_join(const char *sep, pd_list *l) {
    pd_sb b = {0}; pd_sb_add(&b, "");
    for (int64_t i = 0; i < l->len; i++) { if (i) pd_sb_add(&b, sep); pd_sb_add(&b, l->a[i].s); }
    return pd_sb_done(&b);
}
/* נקה: מוריד מההתחלה ומהסוף רווחים (או את האותיות שב-chars) */
static bool pd_strip_has(const char *chars, uint32_t c) {
    if (!chars) return pd_isspace(c);
    for (const unsigned char *q = (const unsigned char *)chars; *q;) { int k; if (pd_u8dec(q, &k) == c) return true; q += k; }
    return false;
}
static const char *pd_text_strip(const char *s, const char *chars) {
    const unsigned char *p = (const unsigned char *)s, *end = p + strlen(s);
    while (p < end) { int n; uint32_t c = pd_u8dec(p, &n); if (!pd_strip_has(chars, c)) break; p += n; }
    while (end > p) {
        const unsigned char *q = end;
        do q--; while (q > p && (*q & 0xC0) == 0x80);
        int n; uint32_t c = pd_u8dec(q, &n);
        if (!pd_strip_has(chars, c)) break;
        end = q;
    }
    return pd_substr((const char *)p, (size_t)(end - p));
}
/* "ab" * 3 */
static const char *pd_text_repeat(const char *s, int64_t n, int line) {
    size_t k = strlen(s);
    if (n <= 0 || k == 0) return "";
    if ((uint64_t)n > (SIZE_MAX / 2) / k) pd_die(line, "הטקסט יוצא גדול מדי");
    char *r = pd_alloc_atomic(k * (size_t)n + 1);
    for (int64_t i = 0; i < n; i++) memcpy(r + (size_t)i * k, s, k);
    r[k * (size_t)n] = 0;
    return r;
}
static pd_list *pd_list_repeat(pd_list *l, int64_t n, int line) {
    if (n <= 0 || l->len == 0) return pd_list_new(0);
    if (n > INT64_MAX / 16 / l->len) pd_die(line, "הרשימה יוצאת גדולה מדי");
    pd_list *r = pd_list_new(l->len * n);
    for (int64_t i = 0; i < n; i++) for (int64_t j = 0; j < l->len; j++) pd_list_push(r, l->a[j]);
    return r;
}
/* קוד_אות("א") = 1488 ; אות_מקוד(1488) = "א" */
static int64_t pd_ord(const char *s, int line) {
    if (pd_len(s) != 1) {
        char m[160]; snprintf(m, sizeof m, "\"קוד_אות\" צריך אות אחת בדיוק — קיבל טקסט עם %lld אותיות", (long long)pd_len(s));
        pd_die(line, m);
    }
    int n; return pd_u8dec((const unsigned char *)s, &n);
}
static const char *pd_chr(int64_t c, int line) {
    if (c <= 0 || c > 0x10FFFF || (c >= 0xD800 && c < 0xE000)) {
        char m[160]; snprintf(m, sizeof m, "%lld אינו קוד של אות (צריך 1 עד 1114111, בלי 55296–57343)", (long long)c);
        pd_die(line, m);
    }
    char b[5]; int n;
    if (c < 0x80) { b[0] = (char)c; n = 1; }
    else if (c < 0x800) { b[0] = (char)(0xC0 | (c >> 6)); b[1] = (char)(0x80 | (c & 0x3F)); n = 2; }
    else if (c < 0x10000) { b[0] = (char)(0xE0 | (c >> 12)); b[1] = (char)(0x80 | ((c >> 6) & 0x3F)); b[2] = (char)(0x80 | (c & 0x3F)); n = 3; }
    else { b[0] = (char)(0xF0 | (c >> 18)); b[1] = (char)(0x80 | ((c >> 12) & 0x3F)); b[2] = (char)(0x80 | ((c >> 6) & 0x3F)); b[3] = (char)(0x80 | (c & 0x3F)); n = 4; }
    return pd_substr(b, (size_t)n);
}
/* עגל(x) — למספר השלם הקרוב, וחצי הולך לזוגי (כמו Python). עגל(x, n) — n ספרות אחרי הנקודה, מדויק */
static int64_t pd_round0(double x, int line) { return pd_float_to_int(nearbyint(x), line); }
static double pd_roundn(double x, int64_t n, int line) {
    if (n < 0) pd_die(line, "\"עגל\" עם מספר ספרות שלילי עוד לא נתמך");
    if (n > 330) return x;
    char b[400];
    snprintf(b, sizeof b, "%.*f", (int)n, x);   /* printf של glibc מעגל מדויק, חצי לזוגי — בדיוק כמו Python */
    double r = strtod(b, NULL);
    return pd_fcheck(r, line);
}

/* ---------- קבצים ---------- */
static const char *pd_errno_he(int e) {
    switch (e) {
    case ENOENT: return "הקובץ או התיקייה לא קיימים";
    case EACCES: case EPERM: return "אין הרשאה";
    case EISDIR: return "זו תיקייה, לא קובץ";
    case ENOTDIR: return "חלק מהנתיב אינו תיקייה";
    case ENOSPC: return "הדיסק מלא";
    case EROFS: return "הדיסק לקריאה בלבד";
    case ENAMETOOLONG: return "השם ארוך מדי";
    default: return strerror(e);
    }
}
static void pd_file_fail(const char *what, const char *path, const char *why, int line) {
    pd_sb b = {0};
    pd_sb_add(&b, what); pd_sb_add(&b, " "); pd_sb_add(&b, pd_repr_text(path)); pd_sb_add(&b, ": "); pd_sb_add(&b, why);
    pd_die(line, pd_sb_done(&b));
}
#ifdef _WIN32
/* Windows: שמות קבצים בעברית — דרך UTF-16 */
static wchar_t *pd_wide(const char *s) {
    int n = MultiByteToWideChar(CP_UTF8, 0, s, -1, NULL, 0);
    wchar_t *w = pd_alloc_atomic(sizeof(wchar_t) * (size_t)(n > 0 ? n : 1));
    if (n > 0) MultiByteToWideChar(CP_UTF8, 0, s, -1, w, n); else w[0] = 0;
    return w;
}
static FILE *pd_fopen(const char *path, const char *mode) { return _wfopen(pd_wide(path), pd_wide(mode)); }
#else
#define pd_fopen fopen
#endif
static const char *pd_read_file(const char *path, int line) {
    FILE *f = pd_fopen(path, "rb");
#ifdef _WIN32
    if (!f) {                              /* Windows אומר "אין הרשאה" גם על תיקייה — בודקים בעצמנו */
        DWORD a = GetFileAttributesW(pd_wide(path));
        if (a != INVALID_FILE_ATTRIBUTES && (a & FILE_ATTRIBUTE_DIRECTORY)) errno = EISDIR;
    }
#endif
    if (!f) pd_file_fail("אי אפשר לקרוא את הקובץ", path, pd_errno_he(errno), line);
    pd_sb b = {0}; pd_sb_add(&b, "");
    char buf[65536]; size_t n;
    while ((n = fread(buf, 1, sizeof buf - 1, f)) > 0) {
        if (memchr(buf, 0, n)) { fclose(f); pd_file_fail("הקובץ", path, "מכיל תו אפס — זה לא קובץ טקסט", line); }
        buf[n] = 0; pd_sb_add(&b, buf);
    }
    if (ferror(f)) { int e = errno; fclose(f); pd_file_fail("אי אפשר לקרוא את הקובץ", path, pd_errno_he(e), line); }
    fclose(f);
    const char *s = pd_sb_done(&b);
    if (!pd_valid_utf8((const unsigned char *)s, strlen(s))) pd_file_fail("הקובץ", path, "לא שמור בקידוד UTF-8", line);
    return s;
}
static void pd_write_file(const char *path, const char *text, bool append, int line) {
    FILE *f = pd_fopen(path, append ? "ab" : "wb");
    if (!f) pd_file_fail("אי אפשר לכתוב לקובץ", path, pd_errno_he(errno), line);
    size_t n = strlen(text);
    if (fwrite(text, 1, n, f) != n || fclose(f) != 0) pd_file_fail("אי אפשר לכתוב לקובץ", path, pd_errno_he(errno), line);
}
#include <sys/stat.h>
#ifdef _WIN32
static bool pd_file_exists(const char *path) { return GetFileAttributesW(pd_wide(path)) != INVALID_FILE_ATTRIBUTES; }
#else
static bool pd_file_exists(const char *path) { struct stat st; return stat(path, &st) == 0; }
#endif
static pd_list *pd_args;
static void pd_set_args(int argc, char **argv) {
#ifdef _WIN32
    /* Windows: הארגומנטים המקוריים (UTF-16) -> UTF-8, כדי שעברית תעבור נכון */
    int wn; LPWSTR *wa = CommandLineToArgvW(GetCommandLineW(), &wn);
    if (wa) {
        pd_args = pd_list_new(wn);
        for (int i = 1; i < wn; i++) {
            int n = WideCharToMultiByte(CP_UTF8, 0, wa[i], -1, NULL, 0, NULL, NULL);
            char *u = pd_alloc_atomic((size_t)(n > 0 ? n : 1));
            if (n > 0) WideCharToMultiByte(CP_UTF8, 0, wa[i], -1, u, n, NULL, NULL); else u[0] = 0;
            pd_list_push(pd_args, pd_vs(u));
        }
        LocalFree(wa);
        return;
    }
#endif
    pd_args = pd_list_new(argc);
    for (int i = 1; i < argc; i++) {
        if (!pd_valid_utf8((const unsigned char *)argv[i], strlen(argv[i]))) {
            fflush(stdout); fprintf(stderr, "שגיאה: ארגומנט %d לא בקידוד UTF-8\n", i); exit(1);
        }
        pd_list_push(pd_args, pd_vs(argv[i]));
    }
}

/* ---------- מיון לפי כלל (key=) והפוך (reverse=) — יציב, כמו Python ---------- */
static int pd_cmp_b(const void *x, const void *y) { int a = ((const pd_val *)x)->b, b = ((const pd_val *)y)->b; return (a > b) - (a < b); }
static void pd_isort(int64_t *a, int64_t *t, int64_t n, pd_val *keys, int (*cmp)(const void *, const void *), int dir) {
    if (n < 2) return;
    int64_t m = n / 2;
    pd_isort(a, t, m, keys, cmp, dir); pd_isort(a + m, t, n - m, keys, cmp, dir);
    int64_t i = 0, j = m, k = 0;
    while (i < m && j < n) t[k++] = dir * cmp(&keys[a[j]], &keys[a[i]]) < 0 ? a[j++] : a[i++];
    while (i < m) t[k++] = a[i++];
    while (j < n) t[k++] = a[j++];
    memcpy(a, t, sizeof(int64_t) * (size_t)n);
}
/* keys[i] הוא המפתח של l->a[i]. rev: מהגדול לקטן, ושווים נשארים בסדר המקורי (כמו Python) */
static pd_list *pd_sorted_by(pd_list *l, pd_list *keys, int (*cmp)(const void *, const void *), bool rev) {
    int64_t n = l->len;
    int64_t *ix = pd_alloc_atomic(sizeof(int64_t) * (size_t)(n ? n : 1)), *t = pd_alloc_atomic(sizeof(int64_t) * (size_t)(n ? n : 1));
    for (int64_t i = 0; i < n; i++) ix[i] = i;
    pd_isort(ix, t, n, keys->a, cmp, rev ? -1 : 1);
    pd_list *r = pd_list_new(n);
    for (int64_t i = 0; i < n; i++) pd_list_push(r, l->a[ix[i]]);
    return r;
}
/* הגדול/הקטן לפי כלל: הראשון מבין השווים, כמו Python */
static pd_val pd_best_by(pd_list *l, pd_list *keys, int (*cmp)(const void *, const void *), int dir, const char *what, int line) {
    pd_list_need(l, what, line);
    int64_t b = 0;
    for (int64_t i = 1; i < l->len; i++) if (dir * cmp(&keys->a[i], &keys->a[b]) > 0) b = i;
    return l->a[b];
}

/* ---------- נסה / אם נכשל ---------- */
#include <setjmp.h>
/* pd_tries: כל אחד מוקצה לחוד — כדי שלא יזוז בזיכרון */
static int pd_captry;
static jmp_buf *pd_try_push(int line) {
    if (pd_ntry == pd_captry) {
        int c = pd_captry ? pd_captry * 2 : 16;
        if (c > 1000000) pd_die(line, "יותר מדי \"נסה\" אחד בתוך השני");
        jmp_buf **n = realloc(pd_tries, sizeof(jmp_buf *) * (size_t)c);
        if (!n) { fflush(stdout); fputs("שגיאה: נגמר הזיכרון\n", stderr); exit(1); }
        pd_tries = n;
        for (int i = pd_captry; i < c; i++) pd_tries[i] = NULL;
        pd_captry = c;
    }
    if (!pd_tries[pd_ntry]) { pd_tries[pd_ntry] = malloc(sizeof(jmp_buf)); if (!pd_tries[pd_ntry]) pd_oom(); }
    return pd_tries[pd_ntry++];
}

/* ---------- במקביל: אותה פעולה על כל איבר ברשימה, על כל ליבות המעבד ----------
 * כל "עובד" הוא תהליך נפרד (fork) — עותק של התוכנה. הוא לוקח את האיבר הבא, מחשב, ושולח את התוצאה בחזרה בצינור.
 * כך אין שני עובדים שנוגעים באותו זיכרון — אין מרוצים ואין תקלות מוזרות. */
typedef void (*pd_work_fn)(pd_list *in, int64_t i, pd_sb *out);
typedef pd_val (*pd_de_fn)(const char **p);
#ifdef _WIN32
/* Windows (בינתיים): אותה תוצאה, על ליבה אחת */
static pd_list *pd_parallel(pd_list *in, int64_t workers, pd_work_fn work, pd_de_fn de, int line) {
    (void)workers; (void)line;
    pd_list *res = pd_list_new(in->len);
    pd_sb out = {0};
    for (int64_t i = 0; i < in->len; i++) {
        out.len = 0;
        work(in, i, &out);
        const char *q = out.s;
        pd_list_push(res, de(&q));
    }
    return res;
}
static void pd_wr_i(pd_sb *b, int64_t v) { pd_sb_addn(b, (const char *)&v, 8); }
static void pd_wr_f(pd_sb *b, double v) { pd_sb_addn(b, (const char *)&v, 8); }
static void pd_wr_s(pd_sb *b, const char *s) { uint64_t n = strlen(s); pd_sb_addn(b, (const char *)&n, 8); pd_sb_addn(b, s, n); }
static int64_t pd_rd_i(const char **p) { int64_t v; memcpy(&v, *p, 8); *p += 8; return v; }
static double pd_rd_f(const char **p) { double v; memcpy(&v, *p, 8); *p += 8; return v; }
static const char *pd_rd_s(const char **p) { uint64_t n; memcpy(&n, *p, 8); *p += 8; const char *r = pd_substr(*p, n); *p += n; return r; }
#else
#include <sys/wait.h>
#include <sys/mman.h>
#include <poll.h>
static int pd_worker_fd = -1;
static int64_t pd_worker_item;              /* על איזה איבר העובד עובד עכשיו */
static void pd_wr(int fd, const void *b, size_t n) {
    const char *p = b;
    while (n) { ssize_t w = write(fd, p, n); if (w <= 0) { if (errno == EINTR) continue; _exit(3); } p += w; n -= (size_t)w; }
}
/* שגיאה בתוך עובד (בלי "נסה" פעיל בתוכו): שולחים אותה להורה, שיעצור איתה כאילו קרתה אצלו */
static void pd_worker_die(int line, const char *msg) {
    fflush(stdout);
    size_t n = strlen(msg);
    char k = 'E'; int64_t i = pd_worker_item, l = line; uint64_t len = 8 + n;     /* [E][איבר][אורך][שורה][הודעה] */
    pd_wr(pd_worker_fd, &k, 1); pd_wr(pd_worker_fd, &i, 8); pd_wr(pd_worker_fd, &len, 8); pd_wr(pd_worker_fd, &l, 8); pd_wr(pd_worker_fd, msg, n);
    _exit(1);
}
/* סדרה של בתים -> ערכים */
static int64_t pd_rd_i(const char **p) { int64_t v; memcpy(&v, *p, 8); *p += 8; return v; }
static double pd_rd_f(const char **p) { double v; memcpy(&v, *p, 8); *p += 8; return v; }
static void pd_wr_i(pd_sb *b, int64_t v) { pd_sb_addn(b, (const char *)&v, 8); }
static void pd_wr_f(pd_sb *b, double v) { pd_sb_addn(b, (const char *)&v, 8); }
static void pd_wr_s(pd_sb *b, const char *s) { uint64_t n = strlen(s); pd_sb_addn(b, (const char *)&n, 8); pd_sb_addn(b, s, n); }
static const char *pd_rd_s(const char **p) { uint64_t n; memcpy(&n, *p, 8); *p += 8; const char *r = pd_substr(*p, n); *p += n; return r; }

static pd_list *pd_parallel(pd_list *in, int64_t workers, pd_work_fn work, pd_de_fn de, int line) {
    int64_t n = in->len;
    pd_list *res = pd_list_new(n);
    if (n == 0) return res;
    if (workers <= 0) { long c = sysconf(_SC_NPROCESSORS_ONLN); workers = c > 0 ? c : 1; }
    if (workers > n) workers = n;
    if (workers > 256) workers = 256;
    /* המונה המשותף: "מי לוקח את האיבר הבא" */
    int64_t *next = mmap(NULL, 8, PROT_READ | PROT_WRITE, MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    if (next == MAP_FAILED) pd_die(line, "במקביל: אי אפשר ליצור זיכרון משותף");
    *next = 0;
    fflush(stdout); fflush(stderr);
    int fds[256]; pid_t pids[256];
    for (int64_t w = 0; w < workers; w++) {
        int pp[2];
        if (pipe(pp) != 0) pd_die(line, "במקביל: אי אפשר ליצור צינור");
        pid_t pid = fork();
        if (pid < 0) pd_die(line, "במקביל: אי אפשר ליצור עובד");
        if (pid == 0) {                       /* העובד */
            close(pp[0]);
            for (int64_t j = 0; j < w; j++) close(fds[j]);
            pd_worker_fd = pp[1];
            pd_worker_hook = pd_worker_die;
            pd_ntry = 0;                      /* "נסה" של ההורה לא תופס בתוך העובד — השגיאה חוזרת להורה */
            pd_sb out = {0};
            for (;;) {
                int64_t i = __atomic_fetch_add(next, 1, __ATOMIC_SEQ_CST);
                if (i >= n) break;
                out.len = 0;
                pd_worker_item = i;
                work(in, i, &out);
                fflush(stdout);
                char k = 'R'; uint64_t len = out.len;
                pd_wr(pp[1], &k, 1); pd_wr(pp[1], &i, 8); pd_wr(pp[1], &len, 8); pd_wr(pp[1], out.s, out.len);
            }
            fflush(stdout);
            _exit(0);
        }
        close(pp[1]);
        fds[w] = pp[0]; pids[w] = pid;
    }
    /* ההורה: קוראים מכל הצינורות בבת אחת (אחרת עובד עלול להיתקע כשהצינור שלו מלא) */
    pd_sb buf[256]; memset(buf, 0, sizeof buf);
    struct pollfd pf[256]; int open_n = (int)workers;
    for (int64_t w = 0; w < workers; w++) { pf[w].fd = fds[w]; pf[w].events = POLLIN; }
    char chunk[65536];
    while (open_n > 0) {
        if (poll(pf, (nfds_t)workers, -1) < 0) { if (errno == EINTR) continue; pd_die(line, "במקביל: תקלה בקריאה מהעובדים"); }
        for (int64_t w = 0; w < workers; w++) {
            if (pf[w].fd < 0 || !(pf[w].revents & (POLLIN | POLLHUP | POLLERR))) continue;
            ssize_t r = read(pf[w].fd, chunk, sizeof chunk);
            if (r > 0) pd_sb_addn(&buf[w], chunk, (size_t)r);
            else if (r == 0 || errno != EINTR) { close(pf[w].fd); pf[w].fd = -1; open_n--; }
        }
    }
    munmap(next, 8);
    bool crashed = false;
    for (int64_t w = 0; w < workers; w++) {
        int st; while (waitpid(pids[w], &st, 0) < 0 && errno == EINTR) {}
        if (!(WIFEXITED(st) && (WEXITSTATUS(st) == 0 || WEXITSTATUS(st) == 1))) crashed = true;
    }
    /* מפענחים. שגיאה: של האיבר עם המקום הכי נמוך — כמו שהיה קורה בלולאה רגילה */
    pd_val *vals = pd_alloc(sizeof(pd_val) * (size_t)n);
    bool *got = pd_alloc_atomic((size_t)n); memset(got, 0, (size_t)n);
    int64_t err_line = 0, err_item = -1; const char *err_msg = NULL;
    for (int64_t w = 0; w < workers; w++) {
        const char *p = buf[w].s, *end = p + buf[w].len;
        while (p && p + 17 <= end) {
            char k = *p++;
            int64_t i = pd_rd_i(&p); uint64_t len; memcpy(&len, p, 8); p += 8;
            if (k == 'R') { const char *q = p; vals[i] = de(&q); got[i] = true; }
            else if (err_item < 0 || i < err_item) {       /* השגיאה של האיבר הכי מוקדם — כמו בלולאה רגילה */
                err_item = i; memcpy(&err_line, p, 8); err_msg = pd_substr(p + 8, len - 8);
            }
            p += len;
        }
    }
    int64_t missing = -1;
    for (int64_t i = 0; i < n; i++) if (!got[i]) { missing = i; break; }
    if (err_msg && missing >= 0 && err_item <= missing) pd_die((int)err_line, err_msg);
    if (crashed || missing >= 0) pd_die(line, "במקביל: אחד העובדים קרס (למשל רקורסיה עמוקה מדי)");
    for (int64_t i = 0; i < n; i++) pd_list_push(res, vals[i]);
    return res;
}
#endif  /* !_WIN32 (במקביל) */

/* ---------- מספרים אקראיים ופעולות מתמטיות ---------- */
/* splitmix64 — אותו רצף בדיוק גם בגרסת האתר (runtime.js), כדי שתוצאות עם זרע יהיו זהות */
#include <time.h>
static uint64_t pd_rng_state;
static bool pd_rng_ready;
static void pd_seed(int64_t s) { pd_rng_state = (uint64_t)s; pd_rng_ready = true; }
static double pd_rand(void) {
    if (!pd_rng_ready) { pd_rng_state = (uint64_t)time(NULL) ^ ((uint64_t)clock() << 32); pd_rng_ready = true; }
    uint64_t z = (pd_rng_state += 0x9E3779B97F4A7C15ULL);
    z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
    z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
    z ^= z >> 31;
    return (double)(z >> 11) * (1.0 / 9007199254740992.0);      /* 0 <= x < 1 */
}
static double pd_exp(double x, int l) { return pd_fcheck(exp(x), l); }
static double pd_log(double x, int l) { if (x <= 0) pd_die(l, "\"לוג\" עובד רק על מספר גדול מ-0"); return log(x); }
static double pd_sqrt(double x, int l) { if (x < 0) pd_die(l, "\"שורש\" של מספר שלילי"); return sqrt(x); }
static double pd_pow(double a, double b, int l) {
    if (a == 0 && b < 0) pd_die(l, "חלוקה באפס");
    if (a < 0 && b != floor(b)) pd_die(l, "\"חזקה\" של מספר שלילי בשבר — התוצאה לא מספר ממשי");
    return pd_fcheck(pow(a, b), l);
}
