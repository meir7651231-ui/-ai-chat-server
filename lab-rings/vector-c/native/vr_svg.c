/* vr_svg.c -- SVG subset parser with Blink painting semantics -> vr raster calls.
 * Supported: svg, g(transform), defs, linearGradient, radialGradient, stop, rect, circle, ellipse,
 * line, polyline, polygon, path; fill / stroke / stroke-width / stroke-linejoin / stroke-linecap /
 * stroke-miterlimit / fill-rule; transform: translate, rotate, scale, matrix. */
#include "vr.h"
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>
#include <stdio.h>

/* ------------------------------------------------------------------ Blink float number parser */
static int is_svg_space(char c) { return c == ' ' || c == '\t' || c == '\n' || c == '\r'; }
static void skip_spaces(const char **p, const char *e) { while (*p < e && is_svg_space(**p)) (*p)++; }
static void skip_spaces_or_delim(const char **p, const char *e) {
    skip_spaces(p, e);
    if (*p < e && **p == ',') { (*p)++; skip_spaces(p, e); }
}
static int parse_number(const char **pp, const char *e, float *out, int trailing) {
    const char *p = *pp;
    skip_spaces(&p, e);
    int sign = 1;
    if (p < e && *p == '+') p++;
    else if (p < e && *p == '-') { p++; sign = -1; }
    if (p >= e || (!isdigit((unsigned char)*p) && *p != '.')) return 0;
    const char *ds = p; size_t nd = 0;
    while (p + nd < e && isdigit((unsigned char)p[nd])) nd++;
    float integer = 0;
    if (nd) {
        float mult = 1;
        for (size_t i = nd; i > 0; i--) { integer += mult * (float)(ds[i - 1] - '0'); mult *= 10; }
        p += nd;
    }
    float decimal = 0;
    if (p < e && *p == '.') {
        p++;
        if (p >= e || !isdigit((unsigned char)*p)) return 0;
        float frac = 1;
        while (p < e && isdigit((unsigned char)*p)) { frac *= (float)0.1; decimal += (*p - '0') * frac; p++; }
    }
    float number = integer + decimal;
    number *= sign;
    if (e - p > 1 && (*p == 'e' || *p == 'E') && p[1] != 'x' && p[1] != 'm') {
        p++;
        int neg = 0;
        if (*p == '+') p++; else if (*p == '-') { p++; neg = 1; }
        if (p >= e || !isdigit((unsigned char)*p)) return 0;
        float ex = 0;
        while (p < e && isdigit((unsigned char)*p)) { ex *= 10.0f; ex += *p - '0'; p++; }
        if (neg) ex = -ex;
        if (ex > 38) return 0;
        if (ex) number *= (float)pow(10.0, ex);
    }
    if (!isfinite(number)) return 0;
    if (trailing) skip_spaces_or_delim(&p, e);
    *pp = p; *out = number;
    return 1;
}

/* CSS-ish attribute number (double, then float) */
static float attr_num(const char *v, float def) {
    if (!v) return def;
    char *end; double d = strtod(v, &end);
    if (end == v) return def;
    return (float)d;
}

/* ------------------------------------------------------------------ XML */
typedef struct { char name[32]; const char *s; int n; } Attr;
typedef struct { char tag[32]; int closing, selfclose; Attr a[40]; int na; } Tag;

static const char *attr_get(const Tag *t, const char *name, char *buf, int bufsz) {
    for (int i = 0; i < t->na; i++) if (!strcmp(t->a[i].name, name)) {
        int n = t->a[i].n < bufsz - 1 ? t->a[i].n : bufsz - 1;
        memcpy(buf, t->a[i].s, n); buf[n] = 0; return buf;
    }
    return NULL;
}
static int attr_raw(const Tag *t, const char *name, const char **s, int *n) {
    for (int i = 0; i < t->na; i++) if (!strcmp(t->a[i].name, name)) { *s = t->a[i].s; *n = t->a[i].n; return 1; }
    return 0;
}

/* returns pointer after tag, or NULL at end */
static const char *next_tag(const char *p, Tag *t) {
    for (;;) {
        p = strchr(p, '<');
        if (!p) return NULL;
        if (!strncmp(p, "<!--", 4)) { const char *q = strstr(p, "-->"); if (!q) return NULL; p = q + 3; continue; }
        if (p[1] == '?' || p[1] == '!') { const char *q = strchr(p, '>'); if (!q) return NULL; p = q + 1; continue; }
        break;
    }
    p++;
    t->closing = 0; t->selfclose = 0; t->na = 0;
    if (*p == '/') { t->closing = 1; p++; }
    int k = 0;
    while (*p && !isspace((unsigned char)*p) && *p != '>' && *p != '/') { if (k < 31) t->tag[k++] = *p; p++; }
    t->tag[k] = 0;
    for (;;) {
        while (*p && isspace((unsigned char)*p)) p++;
        if (!*p) return NULL;
        if (*p == '>') return p + 1;
        if (*p == '/' && p[1] == '>') { t->selfclose = 1; return p + 2; }
        int nk = 0; char nm[32];
        while (*p && *p != '=' && !isspace((unsigned char)*p) && *p != '>' && *p != '/') { if (nk < 31) nm[nk++] = *p; p++; }
        nm[nk] = 0;
        while (*p && isspace((unsigned char)*p)) p++;
        if (*p != '=') continue;
        p++;
        while (*p && isspace((unsigned char)*p)) p++;
        char q = *p;
        if (q != '"' && q != '\'') return NULL;
        p++;
        const char *vs = p;
        while (*p && *p != q) p++;
        if (t->na < 40) { strcpy(t->a[t->na].name, nm); t->a[t->na].s = vs; t->a[t->na].n = (int)(p - vs); t->na++; }
        if (*p) p++;
    }
}

/* ------------------------------------------------------------------ colours / paints */
typedef struct { double a, b, c, d, e, f; } DMat;
typedef struct { char id[64]; int linear; int userSpace; float x1, y1, x2, y2, cx, cy, r, fx, fy;
                 int hasx1, hasy1, hasx2, hasy2, hascx, hascy, hasr;
                 Mat gt; DMat gtd; int nstops; float off[MAXSTOPS]; float col[MAXSTOPS][4]; char href[64]; } Grad;

typedef struct { Grad g[64]; int n; } GradTab;

static int hexv(char c) { if (c >= '0' && c <= '9') return c - '0'; c = (char)tolower(c); if (c >= 'a' && c <= 'f') return c - 'a' + 10; return -1; }
static int parse_color(const char *v, uint8_t rgb[3]) {
    while (*v && isspace((unsigned char)*v)) v++;
    if (*v == '#') {
        size_t n = 0; while (isxdigit((unsigned char)v[1 + n])) n++;
        if (n == 3) { for (int i = 0; i < 3; i++) rgb[i] = (uint8_t)(hexv(v[1 + i]) * 17); return 1; }
        if (n == 6) { for (int i = 0; i < 3; i++) rgb[i] = (uint8_t)(hexv(v[1 + 2 * i]) * 16 + hexv(v[2 + 2 * i])); return 1; }
        return 0;
    }
    if (!strncmp(v, "white", 5)) { rgb[0] = rgb[1] = rgb[2] = 255; return 1; }
    if (!strncmp(v, "black", 5)) { rgb[0] = rgb[1] = rgb[2] = 0; return 1; }
    if (!strncmp(v, "red", 3)) { rgb[0] = 255; rgb[1] = rgb[2] = 0; return 1; }
    if (!strncmp(v, "rgb(", 4)) {
        int r, g, b; if (sscanf(v + 4, "%d,%d,%d", &r, &g, &b) == 3 || sscanf(v + 4, "%d %d %d", &r, &g, &b) == 3) {
            rgb[0] = (uint8_t)r; rgb[1] = (uint8_t)g; rgb[2] = (uint8_t)b; return 1; }
    }
    return 0;
}

/* ------------------------------------------------------------------ transforms (Blink AffineTransform in double) */
static void dm_ident(DMat *m) { m->a = 1; m->b = 0; m->c = 0; m->d = 1; m->e = 0; m->f = 0; }
static DMat dm_mul(DMat x, DMat y) {   /* x * y */
    DMat r;
    r.a = x.a * y.a + x.c * y.b; r.b = x.b * y.a + x.d * y.b;
    r.c = x.a * y.c + x.c * y.d; r.d = x.b * y.c + x.d * y.d;
    r.e = x.a * y.e + x.c * y.f + x.e; r.f = x.b * y.e + x.d * y.f + x.f;
    return r;
}
static DMat parse_transform(const char *s, int n) {
    DMat m; dm_ident(&m);
    const char *p = s, *e = s + n;
    while (p < e) {
        while (p < e && (is_svg_space(*p) || *p == ',')) p++;
        if (p >= e) break;
        const char *nm = p;
        while (p < e && isalpha((unsigned char)*p)) p++;
        int nl = (int)(p - nm);
        while (p < e && is_svg_space(*p)) p++;
        if (p >= e || *p != '(') break;
        p++;
        float v[6]; int k = 0;
        while (k < 6 && parse_number(&p, e, &v[k], 1)) k++;
        while (p < e && *p != ')') p++;
        if (p < e) p++;
        DMat t; dm_ident(&t);
        if (nl == 9 && !strncmp(nm, "translate", 9)) { t.e = v[0]; t.f = k > 1 ? v[1] : 0; }
        else if (nl == 5 && !strncmp(nm, "scale", 5)) { t.a = v[0]; t.d = k > 1 ? v[1] : v[0]; }
        else if (nl == 6 && !strncmp(nm, "rotate", 6)) {
            double rad = (double)v[0] * 3.14159265358979323846 / 180.0;
            double cs = cos(rad), sn = sin(rad);
            DMat r = {cs, sn, -sn, cs, 0, 0};
            if (k >= 3) {
                DMat t1 = {1, 0, 0, 1, v[1], v[2]}, t2 = {1, 0, 0, 1, -(double)v[1], -(double)v[2]};
                t = dm_mul(dm_mul(t1, r), t2);
            } else t = r;
        } else if (nl == 6 && !strncmp(nm, "matrix", 6) && k == 6) {
            t.a = v[0]; t.b = v[1]; t.c = v[2]; t.d = v[3]; t.e = v[4]; t.f = v[5];
        }
        m = dm_mul(m, t);
    }
    return m;
}
static Mat to_mat(DMat d) { Mat m = {(float)d.a, (float)d.c, (float)d.e, (float)d.b, (float)d.d, (float)d.f}; return m; }

/* ------------------------------------------------------------------ path data (Blink SVGPathParser + SVGPathBuilder) */
static int parse_flag(const char **p, const char *e, int *flag) {
    skip_spaces(p, e);
    if (*p >= e) return 0;
    char c = **p;
    if (c != '0' && c != '1') return 0;
    (*p)++;
    *flag = c == '1';
    skip_spaces_or_delim(p, e);
    return 1;
}

static void parse_path_d(const char *s, int n, Path *path) {
    const char *p = s, *e = s + n;
    Pt cur = {0, 0}, sub = {0, 0}, lastCtrl = {0, 0};
    char cmd = 0, prev = 0;
    skip_spaces(&p, e);
    while (p < e) {
        char c = *p;
        if (isalpha((unsigned char)c)) { cmd = c; p++; skip_spaces(&p, e); }
        else if (cmd == 0) break;
        else if (cmd == 'M') cmd = 'L'; else if (cmd == 'm') cmd = 'l';
        else if (cmd == 'z' || cmd == 'Z') break;
        int rel = islower((unsigned char)cmd);
        char C = (char)toupper((unsigned char)cmd);
        float v[7];
        int ok = 1;
        switch (C) {
            case 'Z':
                path_close(path); cur = sub; prev = 'Z';
                skip_spaces(&p, e);
                continue;
            case 'M': case 'L': case 'T':
                ok = parse_number(&p, e, &v[0], 1) && parse_number(&p, e, &v[1], 1); break;
            case 'H': case 'V': ok = parse_number(&p, e, &v[0], 1); break;
            case 'C': for (int i = 0; i < 6 && ok; i++) ok = parse_number(&p, e, &v[i], 1); break;
            case 'S': case 'Q': for (int i = 0; i < 4 && ok; i++) ok = parse_number(&p, e, &v[i], 1); break;
            case 'A': {
                int la, sw;
                ok = parse_number(&p, e, &v[0], 1) && parse_number(&p, e, &v[1], 1) && parse_number(&p, e, &v[2], 1) &&
                     parse_flag(&p, e, &la) && parse_flag(&p, e, &sw) && parse_number(&p, e, &v[5], 1) && parse_number(&p, e, &v[6], 1);
                v[3] = (float)la; v[4] = (float)sw;
                break;
            }
            default: ok = 0;
        }
        if (!ok) break;
        Pt t, c1, c2;
        switch (C) {
            case 'M':
                t.x = rel ? cur.x + v[0] : v[0]; t.y = rel ? cur.y + v[1] : v[1];
                path_move(path, t); cur = sub = t; break;
            case 'L':
                t.x = rel ? cur.x + v[0] : v[0]; t.y = rel ? cur.y + v[1] : v[1];
                path_line(path, t); cur = t; break;
            case 'H':
                t.x = rel ? cur.x + v[0] : v[0]; t.y = cur.y; path_line(path, t); cur = t; break;
            case 'V':
                t.x = cur.x; t.y = rel ? cur.y + v[0] : v[0]; path_line(path, t); cur = t; break;
            case 'C':
                c1.x = rel ? cur.x + v[0] : v[0]; c1.y = rel ? cur.y + v[1] : v[1];
                c2.x = rel ? cur.x + v[2] : v[2]; c2.y = rel ? cur.y + v[3] : v[3];
                t.x = rel ? cur.x + v[4] : v[4]; t.y = rel ? cur.y + v[5] : v[5];
                path_cubic(path, c1, c2, t); lastCtrl = c2; cur = t; break;
            case 'S':
                if (prev == 'C' || prev == 'S') { c1.x = 2 * cur.x - lastCtrl.x; c1.y = 2 * cur.y - lastCtrl.y; }
                else c1 = cur;
                c2.x = rel ? cur.x + v[0] : v[0]; c2.y = rel ? cur.y + v[1] : v[1];
                t.x = rel ? cur.x + v[2] : v[2]; t.y = rel ? cur.y + v[3] : v[3];
                path_cubic(path, c1, c2, t); lastCtrl = c2; cur = t; break;
            case 'Q':
                c1.x = rel ? cur.x + v[0] : v[0]; c1.y = rel ? cur.y + v[1] : v[1];
                t.x = rel ? cur.x + v[2] : v[2]; t.y = rel ? cur.y + v[3] : v[3];
                path_quad(path, c1, t); lastCtrl = c1; cur = t; break;
            case 'T':
                if (prev == 'Q' || prev == 'T') { c1.x = 2 * cur.x - lastCtrl.x; c1.y = 2 * cur.y - lastCtrl.y; }
                else c1 = cur;
                t.x = rel ? cur.x + v[0] : v[0]; t.y = rel ? cur.y + v[1] : v[1];
                path_quad(path, c1, t); lastCtrl = c1; cur = t; break;
            case 'A':
                t.x = rel ? cur.x + v[5] : v[5]; t.y = rel ? cur.y + v[6] : v[6];
                path_svg_arc(path, v[0], v[1], v[2], v[3] != 0, v[4] != 0, t);
                cur = t; break;
        }
        prev = C;
    }
}

int path_tight_bounds(const Path *p, float *l, float *t, float *r, float *b);
static void parse_points(const char *s, int n, Path *path, int close) {
    const char *p = s, *e = s + n;
    skip_spaces(&p, e);
    int first = 1;
    while (p < e) {
        float x, y;
        if (!parse_number(&p, e, &x, 1) || !parse_number(&p, e, &y, 1)) break;
        Pt t = {x, y};
        if (first) { path_move(path, t); first = 0; } else path_line(path, t);
    }
    if (close && !first) path_close(path);
}

/* ------------------------------------------------------------------ style */
typedef struct {
    int fillKind; uint8_t fill[3]; char fillRef[64];     /* fillKind: 0 none, 1 color, 2 url */
    int strokeKind; uint8_t stroke[3]; char strokeRef[64];
    float strokeWidth, miter; int cap, join, fillRule;
    DMat ctm;
} Style;

static void parse_paint(const char *v, int *kind, uint8_t rgb[3], char *ref) {
    while (*v && isspace((unsigned char)*v)) v++;
    if (!strncmp(v, "none", 4)) { *kind = 0; return; }
    if (!strncmp(v, "url(", 4)) {
        const char *h = strchr(v, '#'); const char *q = strchr(v, ')');
        if (h && q && q > h) { int n = (int)(q - h - 1); if (n > 63) n = 63; memcpy(ref, h + 1, n); ref[n] = 0; *kind = 2; return; }
    }
    if (parse_color(v, rgb)) *kind = 1;
}

static void apply_style(Style *st, const Tag *t) {
    char buf[256];
    const char *v;
    if ((v = attr_get(t, "fill", buf, sizeof buf))) parse_paint(v, &st->fillKind, st->fill, st->fillRef);
    if ((v = attr_get(t, "stroke", buf, sizeof buf))) parse_paint(v, &st->strokeKind, st->stroke, st->strokeRef);
    if ((v = attr_get(t, "stroke-width", buf, sizeof buf))) st->strokeWidth = attr_num(v, 1);
    if ((v = attr_get(t, "stroke-miterlimit", buf, sizeof buf))) st->miter = attr_num(v, 4);
    if ((v = attr_get(t, "stroke-linejoin", buf, sizeof buf))) st->join = !strcmp(v, "round") ? JOIN_ROUND : !strcmp(v, "bevel") ? JOIN_BEVEL : JOIN_MITER;
    if ((v = attr_get(t, "stroke-linecap", buf, sizeof buf))) st->cap = !strcmp(v, "round") ? CAP_ROUND : !strcmp(v, "square") ? CAP_SQUARE : CAP_BUTT;
    if ((v = attr_get(t, "fill-rule", buf, sizeof buf))) st->fillRule = !strcmp(v, "evenodd") ? FILL_EVENODD : FILL_WINDING;
    const char *ts; int tn;
    if (attr_raw(t, "transform", &ts, &tn)) st->ctm = dm_mul(st->ctm, parse_transform(ts, tn));
}

/* ------------------------------------------------------------------ gradients */
static float grad_len(const char *v, float def, int userSpace) {
    if (!v) return def;
    char *end; double d = strtod(v, &end);
    if (end == v) return def;
    if (*end == '%') d = userSpace ? d / 100.0 : d / 100.0;
    return (float)d;
}

static void parse_grad(Grad *g, const Tag *t, int linear) {
    char buf[256]; const char *v;
    memset(g, 0, sizeof *g);
    g->linear = linear;
    mat_identity(&g->gt);
    if ((v = attr_get(t, "id", buf, sizeof buf))) { strncpy(g->id, v, 63); }
    if ((v = attr_get(t, "href", buf, sizeof buf)) || (v = attr_get(t, "xlink:href", buf, sizeof buf))) { if (*v == '#') strncpy(g->href, v + 1, 63); }
    v = attr_get(t, "gradientUnits", buf, sizeof buf);
    g->userSpace = v && !strcmp(v, "userSpaceOnUse");
    int us = g->userSpace;
    /* defaults (objectBoundingBox fractions or user units) */
    g->x1 = 0; g->y1 = 0; g->x2 = 1; g->y2 = 0; g->cx = 0.5f; g->cy = 0.5f; g->r = 0.5f;
    if ((v = attr_get(t, "x1", buf, sizeof buf))) { g->x1 = grad_len(v, 0, us); g->hasx1 = 1; }
    if ((v = attr_get(t, "y1", buf, sizeof buf))) { g->y1 = grad_len(v, 0, us); g->hasy1 = 1; }
    if ((v = attr_get(t, "x2", buf, sizeof buf))) { g->x2 = grad_len(v, 1, us); g->hasx2 = 1; }
    if ((v = attr_get(t, "y2", buf, sizeof buf))) { g->y2 = grad_len(v, 0, us); g->hasy2 = 1; }
    if ((v = attr_get(t, "cx", buf, sizeof buf))) { g->cx = grad_len(v, 0.5f, us); g->hascx = 1; }
    if ((v = attr_get(t, "cy", buf, sizeof buf))) { g->cy = grad_len(v, 0.5f, us); g->hascy = 1; }
    if ((v = attr_get(t, "r", buf, sizeof buf))) { g->r = grad_len(v, 0.5f, us); g->hasr = 1; }
    g->fx = g->cx; g->fy = g->cy;
    const char *ts; int tn;
    dm_ident(&g->gtd);
    if (attr_raw(t, "gradientTransform", &ts, &tn)) { g->gtd = parse_transform(ts, tn); g->gt = to_mat(g->gtd); }
}

static void parse_stop(Grad *g, const Tag *t) {
    char buf[256]; const char *v;
    if (g->nstops >= MAXSTOPS) return;
    float off = 0;
    if ((v = attr_get(t, "offset", buf, sizeof buf))) {
        const char *p = v, *e = v + strlen(v);
        float f; if (parse_number(&p, e, &f, 0)) { off = f; if (p < e && *p == '%') off = f / 100.0f; }
    }
    if (off < 0) off = 0; if (off > 1) off = 1;
    if (g->nstops && off < g->off[g->nstops - 1]) off = g->off[g->nstops - 1];
    uint8_t rgb[3] = {0, 0, 0};
    if ((v = attr_get(t, "stop-color", buf, sizeof buf))) parse_color(v, rgb);
    float op = 1;
    if ((v = attr_get(t, "stop-opacity", buf, sizeof buf))) op = attr_num(v, 1);
    g->off[g->nstops] = off;
    g->col[g->nstops][0] = rgb[0] / 255.0f; g->col[g->nstops][1] = rgb[1] / 255.0f; g->col[g->nstops][2] = rgb[2] / 255.0f;
    g->col[g->nstops][3] = op;
    g->nstops++;
}

static int make_paint(Paint *pt, int kind, const uint8_t rgb[3], const char *ref, GradTab *gt, const Mat *ctm,
                      float bbl, float bbt, float bbw, float bbh) {
    memset(pt, 0, sizeof *pt);
    if (kind == 1) { pt->kind = 0; pt->r = rgb[0]; pt->g = rgb[1]; pt->b = rgb[2]; return 1; }
    if (kind != 2) return 0;
    Grad *g = NULL;
    for (int i = 0; i < gt->n; i++) if (!strcmp(gt->g[i].id, ref)) { g = &gt->g[i]; break; }
    if (!g) return 0;
    Grad *sg = g;   /* stops via href */
    if (!sg->nstops && sg->href[0]) for (int i = 0; i < gt->n; i++) if (!strcmp(gt->g[i].id, sg->href)) { sg = &gt->g[i]; break; }
    if (sg->nstops == 0) return 0;
    if (sg->nstops == 1) { pt->kind = 0; pt->r = (uint8_t)lrintf(sg->col[0][0] * 255); pt->g = (uint8_t)lrintf(sg->col[0][1] * 255); pt->b = (uint8_t)lrintf(sg->col[0][2] * 255); return 1; }
    /* local matrix (Blink: bbox mapping * gradientTransform in double, then to float) */
    DMat L; dm_ident(&L);
    if (!g->userSpace) {
        if (bbw <= 0 || bbh <= 0) return 0;
        DMat bb = {bbw, 0, 0, bbh, bbl, bbt};
        L = dm_mul(L, bb);
    }
    L = dm_mul(L, g->gtd);
    int lid = L.a == 1 && L.b == 0 && L.c == 0 && L.d == 1 && L.e == 0 && L.f == 0;
    if (!lid) vr_flags |= VR_FLAG_GRADIENT_APPROX;
    for (int i = 0; i < sg->nstops; i++) if (sg->col[i][3] != 1) vr_flags |= VR_FLAG_UNSUPPORTED;
    Mat lm = to_mat(L);
    return grad_setup(pt, g->linear, g->x1, g->y1, g->x2, g->y2, g->cx, g->cy, g->r, ctm, &lm, lid, sg->nstops, sg->off,
                      (const float (*)[4])sg->col);
}

/* ------------------------------------------------------------------ drawing */
static void draw_path_fill(Canvas *c, Path *p, const Mat *ctm, const Paint *paint, int fillRule) {
    Path dev; path_init(&dev); path_append(&dev, p);
    dev.fill = fillRule;
    dev.convex = p->convex;
    if (!mat_is_identity(ctm)) path_transform(&dev, ctm);
    fill_path_aa(c, &dev, paint);
    path_free(&dev);
}

int vr_flags = 0;
static float sk_length(float dx, float dy) {
    float mag2 = dx * dx + dy * dy;
    if (isfinite(mag2)) return sqrtf(mag2);
    double xx = dx, yy = dy; return (float)sqrt(xx * xx + yy * yy);
}
static void draw_path_stroke(Canvas *c, Path *p, const Mat *ctm, const Paint *paint, const Style *st) {
    if (st->strokeWidth <= 0) return;
    /* skcpu::DrawTreatAsHairline: thin AA strokes become hairlines (not emulated -> flag) */
    {
        float w = st->strokeWidth;
        float d0x = w * ctm->sx, d0y = w * ctm->ky, d1x = w * ctm->kx, d1y = w * ctm->sy;   /* mapVectors */
        float ax = fabsf(d0x), ay = fabsf(d0y); if (ax < ay) { float t = ax; ax = ay; ay = t; }
        float bx = fabsf(d1x), by = fabsf(d1y); if (bx < by) { float t = bx; bx = by; by = t; }
        float len0 = ax + ay * 0.5f, len1 = bx + by * 0.5f;
        if (len0 <= 1.0f && len1 <= 1.0f) { vr_flags |= VR_FLAG_HAIRLINE; return; }
    }
    /* resScale from the matrix (SkMatrixPriv::ComputeResScaleForStroking, SkPoint::Length) */
    float sx = sk_length(ctm->sx, ctm->ky), sy = sk_length(ctm->kx, ctm->sy);
    float resScale = 1;
    if (isfinite(sx) && isfinite(sy)) { float scale = sx > sy ? sx : sy; if (scale > 0) resScale = scale; }
    Path out; path_init(&out);
    stroke_path(p, st->strokeWidth, st->cap, st->join, st->miter, resScale, &out);
    out.fill = FILL_WINDING;
    if (!mat_is_identity(ctm)) path_transform(&out, ctm);
    fill_path_aa(c, &out, paint);
    path_free(&out);
}

static void map_rect(const Mat *m, float l, float t, float r, float b, float *L, float *T, float *R, float *B) {
    Pt q[2] = {{l, t}, {r, b}}; mat_map(m, q, q, 2);
    *L = fminf(q[0].x, q[1].x); *R = fmaxf(q[0].x, q[1].x); *T = fminf(q[0].y, q[1].y); *B = fmaxf(q[0].y, q[1].y);
}

static void draw_element(Canvas *c, const Tag *t, Style *st, GradTab *gt) {
    char buf[256];
    Mat ctm = to_mat(st->ctm);
    if (c->tileX != 0 || c->tileY != 0) { ctm.tx = ctm.tx + -c->tileX; ctm.ty = ctm.ty + -c->tileY; }
    Path path; path_init(&path);
    int isRect = 0, isOval = 0;
    float rl = 0, rt = 0, rr = 0, rb = 0;   /* rect / oval bounds */
    float bbl = 0, bbt = 0, bbw = 0, bbh = 0;
    const char *s; int n;
    if (!strcmp(t->tag, "rect")) {
        float x = attr_num(attr_get(t, "x", buf, sizeof buf), 0), y = attr_num(attr_get(t, "y", buf, sizeof buf), 0);
        float w = attr_num(attr_get(t, "width", buf, sizeof buf), 0), h = attr_num(attr_get(t, "height", buf, sizeof buf), 0);
        const char *rxs = attr_get(t, "rx", buf, sizeof buf);
        float rx = rxs ? attr_num(rxs, 0) : -1;
        const char *rys = attr_get(t, "ry", buf, sizeof buf);
        float ry = rys ? attr_num(rys, 0) : -1;
        if (!(w > 0 && h > 0)) { path_free(&path); return; }
        if (!rxs || rx < 0) rx = fmaxf(0.f, rys ? ry : 0);
        if (!rys || ry < 0) ry = rx;
        rl = x; rt = y; rr = x + w; rb = y + h;
        bbl = x; bbt = y; bbw = w; bbh = h;
        if (rx > 0 || ry > 0) {
            if (rx > w * 0.5f) rx = w * 0.5f;
            if (ry > h * 0.5f) ry = h * 0.5f;
            path_add_rrect(&path, rl, rt, rr, rb, rx, ry, 0, 0);
        } else {
            isRect = 1;
            path_add_rect(&path, rl, rt, rr, rb, 0, 0);
        }
    } else if (!strcmp(t->tag, "circle") || !strcmp(t->tag, "ellipse")) {
        float cx = attr_num(attr_get(t, "cx", buf, sizeof buf), 0), cy = attr_num(attr_get(t, "cy", buf, sizeof buf), 0);
        float rx, ry;
        if (t->tag[0] == 'c') rx = ry = attr_num(attr_get(t, "r", buf, sizeof buf), 0);
        else {
            const char *a = attr_get(t, "rx", buf, sizeof buf); rx = a ? attr_num(a, 0) : -1;
            char b2[64]; const char *b = attr_get(t, "ry", b2, sizeof b2); ry = b ? attr_num(b, 0) : -1;
            if (rx < 0) rx = ry; else if (ry < 0) ry = rx;
        }
        rx = fmaxf(rx, 0.f); ry = fmaxf(ry, 0.f);
        if (!(rx > 0 && ry > 0)) { path_free(&path); return; }
        float x = cx - rx, y = cy - ry, w = rx * 2, h = ry * 2;
        rl = x; rt = y; rr = x + w; rb = y + h;
        bbl = x; bbt = y; bbw = w; bbh = h;
        isOval = 1;
        path_add_oval(&path, rl, rt, rr, rb, 0, 1);
    } else if (!strcmp(t->tag, "line")) {
        Pt a = {attr_num(attr_get(t, "x1", buf, sizeof buf), 0), attr_num(attr_get(t, "y1", buf, sizeof buf), 0)};
        Pt b = {attr_num(attr_get(t, "x2", buf, sizeof buf), 0), attr_num(attr_get(t, "y2", buf, sizeof buf), 0)};
        path_move(&path, a); path_line(&path, b);
    } else if (!strcmp(t->tag, "polyline") || !strcmp(t->tag, "polygon")) {
        if (attr_raw(t, "points", &s, &n)) parse_points(s, n, &path, t->tag[4] == 'g');
    } else if (!strcmp(t->tag, "path")) {
        if (attr_raw(t, "d", &s, &n)) parse_path_d(s, n, &path);
    } else { path_free(&path); return; }
    if (!isRect && !isOval) {
        /* cc DrawPathOp::CountSlowPaths() caches the convexity of the local-space path */
        path_is_convex(&path);
        float l, tt, r, b;
        /* Blink object bounding box: <rect> keeps (x, y, w, h) even with rounded corners; paths use tight bounds */
        if (strcmp(t->tag, "rect") && path_tight_bounds(&path, &l, &tt, &r, &b)) { bbl = l; bbt = tt; bbw = r - l; bbh = b - tt; }
    }
    /* fill */
    if (st->fillKind && strcmp(t->tag, "line")) {
        Paint pt;
        if (make_paint(&pt, st->fillKind, st->fill, st->fillRef, gt, &ctm, bbl, bbt, bbw, bbh)) {
            int simpleStroke = st->join == JOIN_MITER && st->miter >= 1.5f;   /* Blink DefinitelyHasSimpleStroke */
            if (isRect && simpleStroke && mat_rect_stays_rect(&ctm)) {
                float L, T, R, B; map_rect(&ctm, rl, rt, rr, rb, &L, &T, &R, &B);
                fill_rect_aa(c, L, T, R, B, &pt);
            } else {
                draw_path_fill(c, &path, &ctm, &pt, (isRect || isOval) ? FILL_WINDING : st->fillRule);
            }
        }
    }
    /* stroke */
    if (st->strokeKind && st->strokeWidth > 0) {
        Paint pt;
        if (make_paint(&pt, st->strokeKind, st->stroke, st->strokeRef, gt, &ctm, bbl, bbt, bbw, bbh)) {
            if (isRect && st->join == JOIN_MITER && st->miter >= 1.5f && mat_rect_stays_rect(&ctm)) {
                float L, T, R, B; map_rect(&ctm, rl, rt, rr, rb, &L, &T, &R, &B);
                /* compute_stroke_size: width mapped by the matrix */
                float sw = st->strokeWidth * fabsf(ctm.sx != 0 ? ctm.sx : ctm.kx);
                float sh = st->strokeWidth * fabsf(ctm.sy != 0 ? ctm.sy : ctm.ky);
                frame_rect_aa(c, L, T, R, B, sw, sh, &pt);
            } else {
                draw_path_stroke(c, &path, &ctm, &pt, st);
            }
        }
    }
    path_free(&path);
}

/* cc tiling for CPU raster: TileSizeCalculator (default 256x256, max untiled 512x512, round-up 64,
 * alignment 4) and TilingData with 1 border texel.  vr_tile_mode: 1 = emulate cc, 0 = untiled. */
int vr_tile_mode = 1, vr_tile_border = 1;
static void render_pass(const char *svg, Canvas *cp);
static int roundup(int v, int m) { return (v + m - 1) / m * m; }
static void cc_tile_size(int W, int H, int *tw, int *th) {
    int dw = 256, dh = 256;
    if (W < dw) dh = 512;
    if (H < dh) dw = 512;
    if (W < 512 && H < 512) { dw = 512; dh = 512; }
    int w = dw, h = dh;
    if (W < dw) { w = roundup(W, 64); if (w > dw) w = dw; }
    if (H < dh) { h = roundup(H, 64); if (h > dh) h = dh; }
    *tw = roundup(w, 4); *th = roundup(h, 4);
}
static int tile_count(int size, int T, int B) {
    if (T - 2 * B <= 0) return size > 0 && T >= size ? 1 : 0;
    int n = 1 + (size - 1 - 2 * B) / (T - 2 * B);
    return n < 1 ? 1 : n;
}
static void tile_bounds(int i, int n, int size, int T, int B, int *lo, int *hi, int *blo, int *bhi) {
    int c = T - 2 * B;
    int l = c * i; if (i != 0) l += B;
    int h = c * (i + 1) + B; if (i + 1 == n) h += B;
    if (h > size) h = size;
    *lo = l; *hi = h;
    int bl = c * i, bh = bl + c + 2 * B;
    if (bh > size) bh = size;
    *blo = bl; *bhi = bh;
}
int vr_render_svg(const char *svg, int W, int H, uint8_t *out) {
    Canvas c; c.W = W; c.H = H;
    vr_flags = 0;
    memset(out, 255, (size_t)W * H * 3);
    int TW, TH; cc_tile_size(W, H, &TW, &TH);
    int nx = tile_count(W, TW, vr_tile_border), ny = tile_count(H, TH, vr_tile_border);
    if (!vr_tile_mode || (nx == 1 && ny == 1)) {
        c.px = out; c.ox = 0; c.oy = 0; c.stride = W; c.tileX = c.tileY = 0;
        c.clipL = 0; c.clipT = 0; c.clipR = W; c.clipB = H;
        render_pass(svg, &c);
        return 0;
    }
    uint8_t *tile = (uint8_t *)malloc((size_t)TW * TH * 3 + 16);
    for (int j = 0; j < ny; j++) {
        int y0, y1, by0, by1; tile_bounds(j, ny, H, TH, vr_tile_border, &y0, &y1, &by0, &by1);
        for (int i = 0; i < nx; i++) {
            int x0, x1, bx0, bx1; tile_bounds(i, nx, W, TW, vr_tile_border, &x0, &x1, &bx0, &bx1);
            c.ox = 0; c.oy = 0; c.stride = bx1 - bx0; c.px = tile;
            c.tileX = (float)bx0; c.tileY = (float)by0;
            memset(tile, 255, (size_t)(bx1 - bx0) * (by1 - by0) * 3);
            c.clipL = 0; c.clipT = 0; c.clipR = bx1 - bx0; c.clipB = by1 - by0;
            render_pass(svg, &c);
            for (int y = y0; y < y1; y++)
                memcpy(out + 3 * ((size_t)y * W + x0), tile + 3 * ((size_t)(y - by0) * c.stride + (x0 - bx0)), 3 * (size_t)(x1 - x0));
        }
    }
    free(tile);
    return 0;
}
static void check_supported(const Tag *t) {
    static const char *tags[] = {"rect", "circle", "ellipse", "line", "polyline", "polygon", "path", "stop",
                                 "linearGradient", "radialGradient", NULL};
    int ok = 0;
    for (int i = 0; tags[i]; i++) if (!strcmp(t->tag, tags[i])) ok = 1;
    if (!ok) { vr_flags |= VR_FLAG_UNSUPPORTED; return; }
    static const char *bad[] = {"opacity", "fill-opacity", "stroke-opacity", "stroke-dasharray", "style", "clip-path",
                                "mask", "filter", "vector-effect", "visibility", "display", "paint-order", "fx", "fy",
                                "spreadMethod", "stroke-dashoffset", "marker-start", "marker-mid", "marker-end", NULL};
    for (int i = 0; i < t->na; i++) for (int j = 0; bad[j]; j++) if (!strcmp(t->a[i].name, bad[j])) vr_flags |= VR_FLAG_UNSUPPORTED;
}
static void check_root(const Tag *t, int W, int H) {
    char buf[128]; const char *v = attr_get(t, "viewBox", buf, sizeof buf);
    if (v) { float a, b, c, d; if (sscanf(v, "%f %f %f %f", &a, &b, &c, &d) != 4 || a != 0 || b != 0 || c != W || d != H) vr_flags |= VR_FLAG_UNSUPPORTED; }
    for (int i = 0; i < t->na; i++) if (!strcmp(t->a[i].name, "transform") || !strcmp(t->a[i].name, "style") || !strcmp(t->a[i].name, "opacity")) vr_flags |= VR_FLAG_UNSUPPORTED;
}
static void render_pass(const char *svg, Canvas *cp) {
    Canvas c = *cp;
    GradTab *gt = (GradTab *)calloc(1, sizeof(GradTab));
    /* pass 1: gradients */
    Tag t; const char *p = svg; Grad *cur = NULL;
    while ((p = next_tag(p, &t))) {
        if (!t.closing && (!strcmp(t.tag, "linearGradient") || !strcmp(t.tag, "radialGradient"))) {
            if (gt->n < 64) { cur = &gt->g[gt->n++]; parse_grad(cur, &t, t.tag[0] == 'l'); if (t.selfclose) cur = NULL; }
        } else if (t.closing && (!strcmp(t.tag, "linearGradient") || !strcmp(t.tag, "radialGradient"))) cur = NULL;
        else if (!t.closing && !strcmp(t.tag, "stop") && cur) parse_stop(cur, &t);
    }
    /* pass 2: drawing */
    Style stack[32]; int sp = 0;
    memset(&stack[0], 0, sizeof(Style));
    stack[0].fillKind = 1; stack[0].strokeWidth = 1; stack[0].miter = 4; dm_ident(&stack[0].ctm);
    int indefs = 0;
    p = svg;
    while ((p = next_tag(p, &t))) {
        if (!strcmp(t.tag, "defs")) { indefs = !t.closing && !t.selfclose; continue; }
        if (indefs) continue;
        if (!strcmp(t.tag, "g") || !strcmp(t.tag, "svg")) {
            if (t.closing) { if (sp > 0) sp--; continue; }
            if (sp < 31) { stack[sp + 1] = stack[sp]; sp++; }
            if (t.tag[0] == 'g') { apply_style(&stack[sp], &t); for (int i = 0; i < t.na; i++) if (!strcmp(t.a[i].name, "opacity") || !strcmp(t.a[i].name, "style") || !strcmp(t.a[i].name, "clip-path") || !strcmp(t.a[i].name, "mask") || !strcmp(t.a[i].name, "filter")) vr_flags |= VR_FLAG_UNSUPPORTED; }
            else check_root(&t, c.W, c.H);
            if (t.selfclose && sp > 0) sp--;
            continue;
        }
        if (t.closing) continue;
        check_supported(&t);
        Style st = stack[sp];
        apply_style(&st, &t);
        draw_element(&c, &t, &st, gt);
    }
    free(gt);
}
