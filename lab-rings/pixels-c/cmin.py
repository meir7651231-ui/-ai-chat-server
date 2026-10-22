"""cmin.py -- small, safe C minifier used by the px-c program generators.

* strips comments and all whitespace that is not needed between tokens
* renames every identifier that is not a C keyword / libc name / listed in `keep` to the shortest
  free name (most frequent identifier gets the shortest name)
* keeps #include lines verbatim; #define lines stay on their own line (renamed like the rest)
* string literals (including the huge raw-byte data literal) are copied byte for byte
* macros=True: afterwards a greedy "preprocessor dictionary" pass replaces repeated token sequences
  of the code by object-like macros (#define XY tokens...), longest saving first, nested, until no
  sequence saves a byte.  Function-like macro invocations are never split between a macro body and
  the source (a body holding a macro name holds the whole invocation; otherwise an occurrence must
  lie inside one argument), so the expansion is exactly the original token sequence.

Works on bytes (latin-1) so raw high bytes inside the data literal survive unchanged.
"""
import re, string

KEYWORDS = set("""auto break case char const continue default do double else enum extern float for goto if
inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void
volatile while _Bool define __int128 __VA_ARGS__ __attribute__ __builtin_expect""".split())
LIBC = set("""printf fprintf fopen fwrite fclose fputs putc putchar malloc calloc free memcpy memset memcmp exp log
FILE stdout stderr main NULL abs size_t lzma_stream LZMA_STREAM_INIT lzma_raw_decoder lzma_code lzma_filter
lzma_options_lzma LZMA_FILTER_LZMA2 LZMA_VLI_UNKNOWN LZMA_RUN LZMA_FINISH next_in avail_in next_out avail_out
id options dict_size lc lp pb uint8_t uint32_t uint64_t pragma GCC optimize""".split())

TOK = re.compile(rb'''
  (?P<ws>[ \t\r\n]+)
 |(?P<com>//[^\n]*|/\*.*?\*/)
 |(?P<pp>\#[^\n]*)
 |(?P<str>"(?:\\.|[^"\\\n])*")
 |(?P<chr>'(?:\\.|[^'\\\n])*')
 |(?P<id>[A-Za-z_]\w*)
 |(?P<num>\.?\d(?:[eEpP][+-]|[\w.])*)
 |(?P<op>\.\.\.|<<=|>>=|->|\+\+|--|<<|>>|<=|>=|==|!=|&&|\|\||[*/%+\-&^|]=|\#\#|[^\s])
''', re.X | re.S)

TWO = {"++", "--", "&&", "||", "<<", ">>", "->", "==", "!=", "<=", ">=", "+=", "-=", "*=", "/=", "%=",
       "&=", "|=", "^=", "##", "//", "/*", "<:", ":>", "<%", "%>", "%:", ".."}


def tokens(src):
    out = []
    pos = 0
    while pos < len(src):
        m = TOK.match(src, pos)
        if not m:
            raise ValueError("cannot tokenize at %r" % src[pos:pos + 40])
        pos = m.end()
        k = m.lastgroup
        if k in ('ws', 'com'):
            continue
        out.append((k, m.group()))
    return out


def names():
    L = string.ascii_letters
    for c in L:
        yield c
    for a in L:
        for b in L + string.digits + '_':
            yield a + b


def _w(ch):
    return ch.isalnum() or ch == b'_'


def nspace(prev, k, t):
    """number of blanks needed between rendered token `prev` and the next token (kind k, text t)"""
    if not prev:
        return 0
    n = 0
    a, b = prev[-1:], t[:1]
    if _w(a) and _w(b):
        n = 1
    elif k == 'op' and len(prev) <= 3 and not _w(a):
        # space only if gluing would make the lexer read a different first token
        m = TOK.match(prev + t)
        if m.end() != len(prev) or (prev + t[:1]) in (b'//', b'/*'):
            n = 1
    elif (a == b'.' and b.isdigit()) or (a.isdigit() and b == b'.'):
        n = 1
    if prev[:1].isdigit() and a in b'eEpP' and b in b'+-':
        n += 1          # 0x1E+1 would lex as one pp-number
    return n


def render(otoks):
    out = bytearray()
    prev = b''
    for k, t in otoks:
        if k == 'ppl':
            if out and out[-1:] != b'\n':
                out += b'\n'
            out += t + b'\n'; prev = b''; continue
        if k == 'ppstart':
            if out and out[-1:] != b'\n':
                out += b'\n'
            out += b'#'; prev = b''; continue
        if k == 'ppend':
            out += b'\n'; prev = b''; continue
        if k == 'sp':
            out += b' '; prev = b''; continue
        out += b' ' * nspace(prev, k, t)
        out += t
        prev = t
    if out[-1:] != b'\n':
        out += b'\n'
    return bytes(out)


def minify(src, keep=(), subst=None, macros=False):
    """subst: identifier -> replacement token text (e.g. image constants baked into the program)"""
    if isinstance(src, str):
        src = src.encode('latin-1')
    toks = []
    for k, t in tokens(src):
        if k == 'pp':
            # preprocessor: #include kept verbatim, #define/#pragma tokenized (macro body renamed too)
            if re.match(rb'#\s*include', t):
                toks.append(('ppl', re.sub(rb'\s+', b'', t).replace(b'include', b'include', 1)))
            else:
                body = t[1:]
                sub = tokens(body)
                toks.append(('ppstart', b'#'))
                m = re.match(rb'\s*define\s+\w+(\s+)\(', body)
                if m:   # object-like macro whose body starts with '(' must keep the space
                    toks.extend(sub[:2]); toks.append(('sp', b' ')); toks.extend(sub[2:])
                else:
                    toks.extend(sub)
                toks.append(('ppend', b'\n'))
        else:
            toks.append((k, t))
    if subst:
        sb = {k.encode(): str(v).encode() for k, v in subst.items()}
        toks = [('num', sb[t]) if k == 'id' and t in sb else (k, t) for k, t in toks]
    reserved = KEYWORDS | LIBC | set(keep)
    cnt = {}
    for k, t in toks:
        if k == 'id':
            s = t.decode()
            if s not in reserved:
                cnt[s] = cnt.get(s, 0) + 1
    used = set(t.decode() for k, t in toks if k == 'id')
    forbidden = reserved | (used - set(cnt))
    gen = (n for n in names() if n not in forbidden)
    ren = {}
    for s, _ in sorted(cnt.items(), key=lambda kv: (-kv[1], kv[0])):
        ren[s] = next(gen)
    otoks = [(k, ren[t.decode()].encode()) if k == 'id' and t.decode() in ren else (k, t) for k, t in toks]
    out = render(otoks)
    if macros:
        o2 = macroize(otoks, set(keep))
        r2 = render(o2)
        if len(r2) < len(out):
            out = r2
    return out, ren


# --------------------------------------------------------------------------- macro dictionary pass
MAXN = 48          # longest token sequence considered for one macro


def _funlike(otoks):
    """names of function-like macros defined in the token list"""
    fl = set()
    for i in range(len(otoks) - 3):
        if otoks[i][0] == 'ppstart' and otoks[i + 1][1] == b'define' and otoks[i + 3][1] == b'(':
            fl.add(otoks[i + 2][1])
    return fl


def macroize(otoks, keep=()):
    """greedy longest-saving object-like macro substitution over the code tokens (see module doc)"""
    fl = _funlike(otoks)
    allnames = set(t.decode() for k, t in otoks if k == 'id') | KEYWORDS | LIBC | set(keep)
    free = iter([n for n in names() if n not in allnames])
    free_peek = [next(free)]
    # split into head (pp lines etc. kept in place) and a flat code list with barriers
    flat = []      # entries: (k, t) code token, or None = barrier
    lines = []     # pp lines in order with their position in flat
    i = 0
    while i < len(otoks):
        k, t = otoks[i]
        if k == 'ppstart':
            j = i
            while otoks[j][0] != 'ppend':
                j += 1
            lines.append((len(flat), otoks[i:j + 1]))
            flat.append(None)
            i = j + 1; continue
        if k == 'ppl':
            lines.append((len(flat), [otoks[i]]))
            flat.append(None)
            i += 1; continue
        flat.append((k, t))
        i += 1
    # include lines must stay first; new defines go right after the last leading ppl line
    defs = []      # (name, body tokens)

    def blocked(x):
        e = flat[x]
        return e is None or (e[0] == 'str' and len(e[1]) > 200)

    while True:
        N = len(flat)
        # invocation structure of function-like macros in the current stream
        close_of = {}; owner = [-1] * N
        for s in range(N - 1):
            e = flat[s]
            if e and e[0] == 'id' and e[1] in fl and flat[s + 1] and flat[s + 1][1] == b'(':
                d = 0; x = s + 1
                while True:
                    tt = flat[x][1] if flat[x] else b''
                    if tt == b'(':
                        d += 1
                        if d == 1: owner[x] = s
                    elif tt == b')':
                        d -= 1
                        if d == 0: owner[x] = s; break
                    elif tt == b',' and d == 1:
                        owner[x] = s
                    x += 1
                close_of[s] = x
        # next barrier position for O(1) window checks
        nb = [N] * (N + 1)
        for x in range(N - 1, -1, -1):
            nb[x] = x if blocked(x) else nb[x + 1]

        def valid(p, q):
            for x in range(p, q):
                if x in close_of and close_of[x] >= q:
                    return False
                o = owner[x]
                if o >= 0 and o < p:
                    return False
            return True

        texts = [e[1] if e else b'' for e in flat]
        best = None
        for n in range(2, MAXN + 1):
            groups = {}
            for p in range(N - n + 1):
                if nb[p] < p + n:
                    continue
                key = tuple(texts[p:p + n])
                g = groups.get(key)
                if g is None:
                    groups[key] = [p]
                else:
                    g.append(p)
            any2 = False
            for key, pos in groups.items():
                if len(pos) < 2:
                    continue
                any2 = True
                sel = []; last = -1
                for p in pos:
                    if p >= last and valid(p, p + n):
                        sel.append(p); last = p + n
                if len(sel) < 2:
                    continue
                body = [flat[p] for p in range(sel[0], sel[0] + n)]
                L = len(render(body)) - 1
                nm = len(free_peek[0])
                sav = 0
                for p in sel:
                    pv = texts[p - 1] if p and flat[p - 1] else b''
                    nx = flat[p + n] if p + n < N and flat[p + n] else None
                    before = nspace(pv, body[0][0], body[0][1]) + L + (nspace(body[-1][1], nx[0], nx[1]) if nx else 0)
                    after = nspace(pv, 'id', b'Zz') + nm + (nspace(b'Zz', nx[0], nx[1]) if nx else 0)
                    sav += before - after
                sav -= len(b'#define ') + nm + 1 + L + 1
                if sav > 0 and (best is None or sav > best[0]):
                    best = (sav, n, key, sel)
            if not any2:
                break
        if best is None:
            break
        sav, n, key, sel = best
        name = free_peek[0].encode(); free_peek[0] = next(free)
        body = [flat[p] for p in range(sel[0], sel[0] + n)]
        selset = set(sel)
        nf = []; x = 0
        # positions of barriers shift: rebuild lines' indices
        newpos = {}
        while x < N:
            if x in selset:
                nf.append(('id', name)); x += n
            else:
                newpos[x] = len(nf)
                nf.append(flat[x]); x += 1
        lines = [(newpos[p], l) for p, l in lines]
        flat = nf
        defs.append((name, body))
    return _assemble(flat, lines, defs)


def _assemble(flat, lines, defs):
    """flat code + pp lines (by position) + new defines (just before the first code token)"""
    out = []
    lp = dict(lines)
    head_done = False
    for x, e in enumerate(flat):
        if e is None:
            out.extend(lp[x])
            continue
        if not head_done:
            out.extend(_defs(defs)); head_done = True
        out.append(e)
    if not head_done:
        out.extend(_defs(defs))
    return out


def _defs(defs):
    out = []
    for name, body in defs:
        out += [('ppstart', b'#'), ('id', b'define'), ('id', name), ('sp', b' ')] + list(body) + [('ppend', b'\n')]
    return out


# ------------------------------------------------------------------- raw-byte data string literals
_BREAK = re.compile(rb'\xe2\x80[\xaa-\xae\x8e\x8f]|\xe2\x81[\xa6-\xa9]|\xd8\x9c|\?\?[=/\'()!<>-]')


def literal(data):
    """raw data bytes -> the body of a C string literal (without the outer quotes).
    The data alphabet already excludes NUL LF CR '"' and backslash.  Byte runs that a compiler could treat
    specially are split with '""' (adjacent literals concatenate, so the program sees the same bytes):
    UTF-8 encoded bidi controls (gcc -Wbidi-chars warns about them) and trigraphs (would be replaced
    under -std=c99/c11)."""
    return _BREAK.sub(lambda m: m.group()[:1] + b'""' + m.group()[1:], data)
