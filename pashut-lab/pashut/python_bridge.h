/* python_bridge.h — גשר לספריות של Python. נכלל רק בתוכנה שיש בה "ייבא".
 * כל ערך של Python עטוף בתא קטן בזיכרון שלנו; כשהאיסוף משחרר את התא — גם Python משחרר את הערך. */
#define PY_SSIZE_T_CLEAN
#include <Python.h>
typedef struct { PyObject *o; } pd_py;

static void pd_py_fin(void *p) { PyObject *o = ((pd_py *)p)->o; ((pd_py *)p)->o = NULL; if (o) Py_DECREF(o); }
static void pd_py_init(void) {
    if (Py_IsInitialized()) return;
    Py_Initialize();
    pd_fin_fn = pd_py_fin;
}
/* שגיאה מ-Python -> שגיאה רגילה שלנו (אפשר לתפוס ב"נסה") */
__attribute__((noreturn)) static void pd_py_fail(int line) {
    PyObject *t = NULL, *v = NULL, *tb = NULL;
    PyErr_Fetch(&t, &v, &tb);
    PyErr_NormalizeException(&t, &v, &tb);
    pd_sb b = {0};
    pd_sb_add(&b, "שגיאה מ-Python: ");
    if (t) {
        PyObject *n = PyObject_GetAttrString(t, "__name__");
        const char *ns = n ? PyUnicode_AsUTF8(n) : NULL;
        pd_sb_add(&b, ns ? ns : "?");
    }
    if (v) {
        PyObject *s = PyObject_Str(v);
        const char *ss = s ? PyUnicode_AsUTF8(s) : NULL;
        if (ss && *ss) { pd_sb_add(&b, ": "); pd_sb_add(&b, ss); }
    }
    PyErr_Clear();
    pd_die(line, pd_sb_done(&b));
}
/* לוקח בעלות על o (הפניה חדשה) */
static pd_py *pd_py_wrap(PyObject *o, int line) {
    if (!o) pd_py_fail(line);
    pd_py *b = pd_alloc_fin(sizeof *b);
    b->o = o;
    return b;
}
static PyObject *pd_py_ref(pd_py *b) { Py_INCREF(b->o); return b->o; }
static pd_py *pd_py_import(const char *full, const char *top, int line) {
    pd_py_init();
    PyObject *m = PyImport_ImportModule(full);
    if (!m) pd_py_fail(line);
    if (strcmp(full, top) != 0) { Py_DECREF(m); m = PyImport_ImportModule(top); }   /* ייבא os.path -> os */
    return pd_py_wrap(m, line);
}
/* --- מהערכים שלנו ל-Python (תמיד הפניה חדשה) --- */
static PyObject *pd_topy_check(PyObject *o, int line) { if (!o) pd_py_fail(line); return o; }
static PyObject *pd_topy_i(int64_t v, int line) { return pd_topy_check(PyLong_FromLongLong(v), line); }
static PyObject *pd_topy_f(double v, int line) { return pd_topy_check(PyFloat_FromDouble(v), line); }
static PyObject *pd_topy_s(const char *v, int line) { return v ? pd_topy_check(PyUnicode_FromString(v), line) : Py_NewRef(Py_None); }
static PyObject *pd_topy_b(bool v, int line) { (void)line; return PyBool_FromLong(v); }
static PyObject *pd_topy_py(pd_py *v, int line) { (void)line; return v ? pd_py_ref(v) : Py_NewRef(Py_None); }
static PyObject *pd_topy_list(pd_list *l, PyObject *(*one)(pd_val, int), int line) {
    if (!l) return Py_NewRef(Py_None);
    PyObject *r = pd_topy_check(PyList_New(l->len), line);
    for (int64_t i = 0; i < l->len; i++) PyList_SET_ITEM(r, i, one(l->a[i], line));
    return r;
}
static PyObject *pd_topy_dict(pd_dict *d, PyObject *(*k)(pd_val, int), PyObject *(*v)(pd_val, int), int line) {
    if (!d) return Py_NewRef(Py_None);
    PyObject *r = pd_topy_check(PyDict_New(), line);
    for (int64_t e = 0; e < d->n; e++) if (!d->dead[e]) {
        PyObject *kk = k(d->k[e], line), *vv = v(d->v[e], line);
        if (PyDict_SetItem(r, kk, vv) < 0) pd_py_fail(line);
        Py_DECREF(kk); Py_DECREF(vv);
    }
    return r;
}
/* --- פעולות על ערכי Python --- */
static pd_py *pd_py_getattr(pd_py *o, const char *name, int line) { return pd_py_wrap(PyObject_GetAttrString(o->o, name), line); }
static void pd_py_setattr(pd_py *o, const char *name, PyObject *v, int line) {
    int r = PyObject_SetAttrString(o->o, name, v); Py_DECREF(v); if (r < 0) pd_py_fail(line);
}
/* קריאה: args ו-kvals הם הפניות חדשות — הפעולה משחררת אותן */
static pd_py *pd_py_call(pd_py *f, int n, PyObject **args, int nk, const char **knames, PyObject **kvals, int line) {
    PyObject *t = PyTuple_New(n);
    if (!t) pd_py_fail(line);
    for (int i = 0; i < n; i++) PyTuple_SET_ITEM(t, i, args[i]);
    PyObject *kw = NULL;
    if (nk) {
        kw = PyDict_New();
        for (int i = 0; i < nk; i++) { PyDict_SetItemString(kw, knames[i], kvals[i]); Py_DECREF(kvals[i]); }
    }
    PyObject *r = PyObject_Call(f->o, t, kw);
    Py_DECREF(t); Py_XDECREF(kw);
    return pd_py_wrap(r, line);
}
static pd_py *pd_py_getitem(pd_py *o, PyObject *k, int line) { PyObject *r = PyObject_GetItem(o->o, k); Py_DECREF(k); return pd_py_wrap(r, line); }
static void pd_py_setitem(pd_py *o, PyObject *k, PyObject *v, int line) {
    int r = PyObject_SetItem(o->o, k, v); Py_DECREF(k); Py_DECREF(v); if (r < 0) pd_py_fail(line);
}
static pd_py *pd_py_binop(char op, PyObject *a, PyObject *b, int line) {
    PyObject *r;
    switch (op) {
    case '+': r = PyNumber_Add(a, b); break;
    case '-': r = PyNumber_Subtract(a, b); break;
    case '*': r = PyNumber_Multiply(a, b); break;
    case '/': r = PyNumber_TrueDivide(a, b); break;
    case 'f': r = PyNumber_FloorDivide(a, b); break;
    default:  r = PyNumber_Remainder(a, b); break;
    }
    Py_DECREF(a); Py_DECREF(b);
    return pd_py_wrap(r, line);
}
static pd_py *pd_py_neg(pd_py *a, int line) { return pd_py_wrap(PyNumber_Negative(a->o), line); }
static bool pd_py_cmp(int op, PyObject *a, PyObject *b, int line) {
    int r = PyObject_RichCompareBool(a, b, op);
    Py_DECREF(a); Py_DECREF(b);
    if (r < 0) pd_py_fail(line);
    return r;
}
static bool pd_py_contains(pd_py *c, PyObject *x, int line) {
    int r = PySequence_Contains(c->o, x); Py_DECREF(x); if (r < 0) pd_py_fail(line); return r;
}
static bool pd_py_truth(pd_py *o, int line) { int r = PyObject_IsTrue(o->o); if (r < 0) pd_py_fail(line); return r; }
static int64_t pd_py_len(pd_py *o, int line) { Py_ssize_t n = PyObject_Length(o->o); if (n < 0) pd_py_fail(line); return n; }
/* --- מ-Python לערכים שלנו (רק כשמבקשים במפורש: מספר(...), שבר(...), טקסט(...)) --- */
static int64_t pd_py_to_int(pd_py *o, int line) {
    PyObject *n = PyNumber_Long(o->o);
    if (!n) pd_py_fail(line);
    int ovf = 0; long long v = PyLong_AsLongLongAndOverflow(n, &ovf);
    Py_DECREF(n);
    if (ovf) pd_die(line, PD_OVF);
    if (v == -1 && PyErr_Occurred()) pd_py_fail(line);
    return v;
}
static double pd_py_to_float(pd_py *o, int line) {
    double v = PyFloat_AsDouble(o->o);
    if (v == -1.0 && PyErr_Occurred()) pd_py_fail(line);
    return pd_fcheck(v, line);
}
static const char *pd_py_text_of(PyObject *s, int line) {
    if (!s) pd_py_fail(line);
    Py_ssize_t n; const char *u = PyUnicode_AsUTF8AndSize(s, &n);
    if (!u) { Py_DECREF(s); pd_py_fail(line); }
    if ((Py_ssize_t)strlen(u) != n) { Py_DECREF(s); pd_die(line, "הטקסט מ-Python מכיל תו אפס"); }
    const char *r = pd_substr(u, (size_t)n);
    Py_DECREF(s);
    return r;
}
static const char *pd_py_str(pd_py *o, int line) { return o ? pd_py_text_of(PyObject_Str(o->o), line) : "כלום"; }
static const char *pd_py_repr(pd_py *o) { return o ? pd_py_text_of(PyObject_Repr(o->o), 0) : "כלום"; }
/* לולאה על ערך של Python */
static PyObject *pd_py_iter(pd_py *o, int line) { PyObject *it = PyObject_GetIter(o->o); if (!it) pd_py_fail(line); return it; }
static pd_py *pd_py_next(PyObject *it, int line) {
    PyObject *x = PyIter_Next(it);
    if (!x) { if (PyErr_Occurred()) pd_py_fail(line); return NULL; }
    return pd_py_wrap(x, line);
}
