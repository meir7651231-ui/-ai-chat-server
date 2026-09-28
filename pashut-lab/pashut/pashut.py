#!/usr/bin/env python3
"""פשוט — שפת תכנות בעברית יום-יומית.

הקוד בעברית מתורגם ל-C, ו-gcc הופך אותו לתוכנה שרצה ישר על המעבד.
Python משמש רק כדי לבנות — התוכנה שיוצאת לא צריכה Python בכלל.

שימוש:
    python3 pashut.py תוכנית.פשוט            בונה תוכנה בשם 'תוכנית'
    python3 pashut.py תוכנית.פשוט --הרץ      בונה ומריץ
    python3 pashut.py תוכנית.פשוט --C        מציג את קוד ה-C שנוצר
    python3 pashut.py תוכנית.פשוט --ווינדוס  בונה תוכנה ל-Windows (תוכנית.exe) — גם מלינוקס
    python3 pashut.py תוכנית.פשוט --אתר      בונה דף אינטרנט (תוכנית.html) — עובד בכל דפדפן, גם בטלפון
"""
import re
import json
from html import escape as html_escape
import ast
import io
import os
import subprocess
import sys
import tempfile
import tokenize

HERE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- המילים
KEYWORDS = {
    'אם': 'if', 'ואם': 'elif', 'אחרת': 'else', 'לכל': 'for', 'בתוך': 'in',
    'עצור': 'break', 'הבא': 'continue', 'פעולה': 'def', 'תן': 'return',
    'נכון': 'true', 'וגם': 'and', 'או': 'or', 'לא': 'not', 'בהמשך': 'pass', 'מבנה': 'class', 'נסה': 'try', 'כלום': 'nil', 'ייבא': 'import',
}
PHRASES = {('כל', 'עוד'): 'while', ('לא', 'נכון'): 'false', ('אם', 'נכשל'): 'except'}
UI_BUILTINS = {'כותרת', 'טקסט_בדף', 'שדה_קלט', 'כפתור', 'רשימת_שורות', 'כל_כמה', 'לוח'}
MATH_BUILTINS = {'אקראי', 'זרע', 'אקספ', 'לוג', 'שורש', 'חזקה'}
BUILTINS = {'אקראי', 'זרע', 'אקספ', 'לוג', 'שורש', 'חזקה', 'לוח', 'כותרת', 'טקסט_בדף', 'שדה_קלט', 'כפתור', 'רשימת_שורות', 'כל_כמה', 'במקביל', 'שגיאה', 'קוד_אות', 'אות_מקוד', 'עגל', 'קרא_קובץ', 'כתוב_קובץ', 'הוסף_לקובץ', 'קיים_קובץ', 'ארגומנטים',
            'מפתחות', 'ערכים', 'הצג', 'שאל', 'כמה', 'מספר', 'שבר', 'טקסט', 'ספירה', 'חיובי',
            'סכום', 'הגדול', 'הקטן', 'מסודר'}
# פעולות של טקסט: שם -> (כמה ערכים מותר, הסוג שחוזר, ה-C)
TEXT_METHODS = {
    'פצל': ((0, 1), 'list:text'), 'חבר': ((1,), 'text'), 'החלף': ((2,), 'text'), 'נקה': ((0, 1), 'text'),
    'גדולות': ((0,), 'text'), 'קטנות': ((0,), 'text'), 'מתחיל_ב': ((1,), 'bool'), 'נגמר_ב': ((1,), 'bool'),
    'מצא': ((1,), 'int'), 'ספור': ((1,), 'int'), 'שורות': ((0,), 'list:text'),
}
METHODS = {'הוסף', 'הוצא', 'קבל'} | set(TEXT_METHODS)
TYPE_NAMES = {'מספר': 'int', 'שבר': 'float', 'טקסט': 'text', 'לוגי': 'bool'}
KEY_TYPES = ('int', 'text', 'bool')
BASE_HEB = {'int': 'מספר', 'float': 'שבר', 'text': 'טקסט', 'bool': 'נכון/לא נכון', 'none': 'שום ערך', '?': 'לא ידוע',
            'nil': 'כלום', 'py': 'ערך של Python', 'el': 'רכיב בדף'}


class LangError(Exception):
    def __init__(self, line, msg):
        super().__init__(msg)
        self.line, self.msg = line, msg


class Unknown(Exception):
    """טיפוס שעוד לא ידוע (למשל פעולה שקוראת לעצמה) — ננסה שוב בסבב הבא."""


# ---------------------------------------------------------------- סוגים
# 'int' 'float' 'text' 'bool' 'none', רשימה: 'list:<סוג>'.
# סוג שעוד לא ידוע (איברים של [] ריקה, פרמטר בלי סוג) הוא "משבצת": '?3'.
# כל העותקים של אותה רשימה חולקים את אותה משבצת — כשמתברר הסוג במקום אחד, הוא ידוע בכולם.
TV = {}            # מספר משבצת -> הסוג שנקבע לה (או None)
CHANGED = [False]  # משבצת התמלאה בסבב הזה


def new_var():
    TV[len(TV)] = None
    return f'?{len(TV) - 1}'


def norm(t):
    """הסוג אחרי שממלאים את כל המשבצות הידועות."""
    if t is None:
        return None
    if t.startswith('?'):
        b = TV[int(t[1:])]
        return t if b is None else norm(b)
    if t.startswith('list:'):
        return 'list:' + norm(t[5:])
    if t.startswith('dict:'):
        k, v = t[5:].split('|', 1)
        return 'dict:' + norm(k) + '|' + norm(v)
    if t.startswith('opt:'):
        b = norm(t[4:])
        return b if b.startswith('opt:') or b == 'nil' else 'opt:' + b
    return t


# "X או כלום": 'opt:X' — אפשר רק לטקסט, רשימה, מילון או מבנה (אלה מצביעים, וכלום = NULL)
def is_opt(t):
    return norm(t).startswith('opt:')


def obase(t):
    t = norm(t)
    return t[4:] if t.startswith('opt:') else t


def opt_ok(b):
    b = norm(b)
    return b.startswith(('?', 'list:', 'dict:', 'obj:')) or b == 'text'


def is_var(t):
    return norm(t).startswith('?')


def is_list(t):
    return norm(t).startswith('list:')


def elem(t):
    return norm(t)[5:]


# מילון: 'dict:<סוג המפתח>|<סוג הערך>'. מפתח הוא תמיד מספר, טקסט, נכון/לא נכון או משבצת — בלי '|' בתוכו,
# אז ה-'|' הראשון תמיד מפריד בין המפתח לערך.
def is_dict(t):
    return norm(t).startswith('dict:')


def dkey(t):
    return norm(t)[5:].split('|', 1)[0]


def dval(t):
    return norm(t)[5:].split('|', 1)[1]


# מבנה שהמשתמש הגדיר: 'obj:<שם>'
def is_obj(t):
    return norm(t).startswith('obj:')


def oname(t):
    return norm(t)[4:]


def is_ref(t):
    return is_list(t) or is_dict(t) or is_obj(t)


def is_ptr(t):
    """מיוצג ב-C כמצביע (ולכן יכול להיות NULL = כלום)"""
    return is_ref(t) or is_opt(t) or norm(t) in ('text', 'nil', 'py')


def heb(t):
    t = norm(t)
    if t.startswith('opt:'):
        return heb(t[4:]) + ' או כלום'
    if is_list(t):
        return 'רשימה של ' + heb(elem(t))
    if is_dict(t):
        return f'מילון מ{heb(dkey(t))} ל{heb(dval(t))}'
    if is_obj(t):
        return oname(t)
    return BASE_HEB['?' if t.startswith('?') else t]


def bind(v, t):
    if v in re.findall(r'\?\d+', t):     # משבצת שמכילה את עצמה (רשימה של עצמה) — אין סוג כזה
        return None
    TV[int(v[1:])] = t
    CHANGED[0] = True
    return t


def unify(a, b, promote=True):
    """הסוג המשותף של שני ערכים, או None. בתוך רשימות — בלי המרת מספר לשבר.
    משבצת ריקה מתמלאת בסוג של הצד השני."""
    a, b = norm(a), norm(b)
    if a == b:
        return a
    if a.startswith('?'):
        return bind(a, 'opt:' + new_var() if b == 'nil' else b)
    if b.startswith('?'):
        return bind(b, 'opt:' + new_var() if a == 'nil' else a)
    if 'nil' in (a, b):                      # כלום + X = "X או כלום"
        o = b if a == 'nil' else a
        if o.startswith('opt:'):
            return o
        return 'opt:' + o if opt_ok(o) else None
    if a.startswith('opt:') or b.startswith('opt:'):
        u = unify(obase(a), obase(b), promote=False)
        return 'opt:' + norm(u) if u is not None and opt_ok(u) else None
    if promote and {a, b} == {'int', 'float'}:
        return 'float'
    if is_list(a) and is_list(b):
        e = unify(elem(a), elem(b), promote=False)
        return None if e is None else 'list:' + e
    if is_dict(a) and is_dict(b):
        k = unify(dkey(a), dkey(b), promote=False)
        v = None if k is None else unify(dval(a), dval(b), promote=False)
        return None if v is None else 'dict:' + norm(k) + '|' + norm(v)
    return None


def accepts(target, value):
    """אפשר לשים value במקום של target?"""
    target, value = norm(target), norm(value)
    if target == value or (target == 'float' and value == 'int'):
        return True
    if target.startswith('opt:') and value == 'nil':
        return True
    if target.startswith('opt:') or value.startswith('opt:'):     # כלום במקום שצריך ערך — נבדק בזמן ריצה
        return accepts(obase(target), obase(value))
    if '?' in target or '?' in value:
        return unify(target, value, promote=False) is not None
    return False


def resolved(t):
    t = re.sub(r'opt:\?\d+', 'opt:text', norm(t))          # רק כלום, אף פעם לא ערך — לא משנה איזה סוג
    return re.sub(r'\?\d+', 'int', t)


def tid(t):
    t = re.sub(r'obj:([^|:]+)', lambda m: 'o' + m.group(1).encode('utf-8').hex(), resolved(t))
    return t.replace(':', '_').replace('|', '_V_')


def sname(name):
    return 'S_' + name.encode('utf-8').hex()


def ctype(t):
    t = norm(t)
    if t.startswith('opt:'):
        return ctype(t[4:])
    if t == 'nil':
        return 'void *'
    if t == 'py':
        return 'pd_py *'
    if is_dict(t):
        return 'pd_dict *'
    if is_obj(t):
        return f'struct {sname(oname(t))} *'
    return 'pd_list *' if is_list(t) else {'int': 'int64_t', 'float': 'double', 'text': 'const char *',
                                           'bool': 'bool', 'none': 'void'}[t]


def czero(t):
    t = norm(t)
    return 'NULL' if is_ref(t) or t.startswith('opt:') or t in ('nil', 'py') else {'int': '0', 'float': '0.0', 'text': '""', 'bool': 'false'}[t]


def dkind(t):
    return {'int': 'PD_KI', 'bool': 'PD_KB', 'text': 'PD_KS'}[resolved(dkey(t))]


def new_of(t):
    """C שיוצר רשימה/מילון ריקים מהסוג t"""
    return f'pd_dict_new({dkind(t)})' if is_dict(t) else 'pd_list_new(0)'


def box(code, t):
    t = obase(t)
    if t == 'nil':
        return 'pd_vp(NULL)'
    return f'pd_vp({code})' if is_ref(t) or t == 'py' else {'int': f'pd_vi({code})', 'float': f'pd_vf({code})',
                                                'text': f'pd_vs({code})', 'bool': f'pd_vb({code})'}[resolved(t)]


def unbox(code, t):
    t = obase(t)
    if t == 'py':
        return f'((pd_py *)({code}).p)'
    if is_dict(t):
        return f'((pd_dict *)({code}).p)'
    if is_obj(t):
        return f'(({ctype(t)})({code}).p)'
    return f'((pd_list *)({code}).p)' if is_list(t) else f'({code}).' + {'int': 'i', 'float': 'f', 'text': 's',
                                                                         'bool': 'b'}[resolved(t)]


# ---------------------------------------------------------------- פירוק למילים
class Tok:
    __slots__ = ('kind', 'val', 'line', 'src')

    def __init__(self, kind, val, line):
        self.kind, self.val, self.line = kind, val, line


def lex(src):
    try:
        raw = list(tokenize.generate_tokens(io.StringIO(src).readline))
    except tokenize.TokenError as e:
        raise LangError(e.args[1][0], 'סוגריים או מרכאות שלא נסגרו עד סוף הקובץ')
    except IndentationError as e:
        raise LangError(e.lineno, 'ההזחה (הרווחים בתחילת השורה) לא מתאימה לשורות שמעליה')
    out, i = [], 0
    while i < len(raw):
        t = raw[i]
        ln = t.start[0]
        if t.type == tokenize.NAME:
            nxt = raw[i + 1] if i + 1 < len(raw) else None
            if nxt is not None and nxt.type == tokenize.NAME and (t.string, nxt.string) in PHRASES:
                out.append(Tok('kw', PHRASES[(t.string, nxt.string)], ln))
                i += 2
                continue
            if t.string in KEYWORDS:
                tk = Tok('kw', KEYWORDS[t.string], ln)
                tk.src = t.string          # המילה המקורית — כדי שאפשר יהיה לקרוא כך לשדה (x.הבא)
                out.append(tk)
            else:
                out.append(Tok('name', t.string, ln))
        elif t.type == tokenize.NUMBER:
            s = t.string.replace('_', '')
            if s.isdigit():
                v = int(s)
                if v > 2**63 - 1:
                    raise LangError(ln, f'המספר {t.string} גדול מדי')
                out.append(Tok('int', v, ln))
            else:
                try:
                    v = float(s)
                except ValueError:
                    raise LangError(ln, f'"{t.string}" אינו מספר שהשפה מכירה')
                if v != v or v in (float('inf'), float('-inf')):
                    raise LangError(ln, f'"{t.string}" אינו מספר שהשפה מכירה')
                out.append(Tok('float', v, ln))
        elif t.type == tokenize.STRING:
            try:
                v = ast.literal_eval(t.string)
            except Exception:
                raise LangError(ln, 'הטקסט הזה לא נתמך (רק טקסט רגיל במרכאות)')
            if not isinstance(v, str):
                raise LangError(ln, 'הטקסט הזה לא נתמך (רק טקסט רגיל במרכאות)')
            if '\0' in v:
                raise LangError(ln, 'טקסט לא יכול להכיל תו אפס')
            out.append(Tok('str', v, ln))
        elif t.type == tokenize.OP:
            out.append(Tok('op', t.string, ln))
        elif t.type == tokenize.NEWLINE:
            if out and out[-1].kind != 'newline':
                out.append(Tok('newline', None, ln))
        elif t.type == tokenize.INDENT:
            out.append(Tok('indent', None, ln))
        elif t.type == tokenize.DEDENT:
            out.append(Tok('dedent', None, ln))
        elif t.type == tokenize.ENDMARKER:
            if out and out[-1].kind not in ('newline', 'dedent'):
                out.append(Tok('newline', None, ln))
            out.append(Tok('eof', None, ln))
        elif t.type == tokenize.ERRORTOKEN and t.string.strip():
            if t.string in ('"', "'"):
                raise LangError(ln, 'מרכאות שנפתחו ולא נסגרו')
            raise LangError(ln, f'התו "{t.string}" לא מוכר בשפה')
        i += 1
    return out


# ---------------------------------------------------------------- עץ התוכנית
class Node:
    def __init__(self, kind, line, **kw):
        self.kind, self.line = kind, line
        self.__dict__.update(kw)


ASSIGN_OPS = ('=', '+=', '-=', '*=')
CMP_OPS = ('==', '!=', '<', '>', '<=', '>=')


class Parser:
    def __init__(self, toks):
        self.t, self.i = toks, 0

    def peek(self, k=0):
        return self.t[min(self.i + k, len(self.t) - 1)]

    def at(self, kind, val=None):
        p = self.peek()
        return p.kind == kind and (val is None or p.val == val)

    def take(self, kind, val=None, what=None):
        p = self.peek()
        if not self.at(kind, val):
            raise LangError(p.line, f'ציפיתי ל{what or self.describe(kind, val)}, אבל מצאתי {self.show(p)}')
        self.i += 1
        return p

    @staticmethod
    def describe(kind, val):
        names = {':': 'נקודתיים ":" בסוף השורה', '(': '"("', ')': '")"', ']': '"]"', '=': '"="'}
        if kind == 'op':
            return names.get(val, f'"{val}"')
        return {'name': 'שם', 'newline': 'סוף שורה',
                'indent': 'שורות מוזחות (עם רווחים בהתחלה) אחרי הנקודתיים'}.get(kind, kind)

    @staticmethod
    def show(p):
        if p.kind == 'newline':
            return 'סוף שורה'
        if p.kind == 'eof':
            return 'סוף הקובץ'
        if p.kind in ('indent', 'dedent'):
            return 'הזחה לא צפויה'
        if p.kind == 'kw':
            rev = {v: k for k, v in KEYWORDS.items()}
            rev.update({v: ' '.join(k) for k, v in PHRASES.items()})
            return f'"{rev.get(p.val, p.val)}"'
        return f'"{p.val}"'

    def program(self):
        body = []
        while not self.at('eof'):
            if self.at('newline'):
                self.i += 1
                continue
            body.append(self.statement())
        return body

    def block(self):
        self.take('op', ':')
        self.take('newline', what='סוף שורה אחרי הנקודתיים')
        self.take('indent')
        body = []
        while not self.at('dedent') and not self.at('eof'):
            body.append(self.statement())
        if self.at('dedent'):
            self.i += 1
        return body

    def type_annot(self, prefix=''):
        t = self.type_annot1(prefix)
        if self.at('kw', 'or') and self.peek(1).kind == 'kw' and self.peek(1).val == 'nil':
            ln = self.peek().line
            self.i += 2
            if not opt_ok(t):
                raise LangError(ln, f'"{heb(t)} או כלום" לא אפשרי — כלום אפשר רק בטקסט, רשימה, מילון או מבנה')
            t = 'opt:' + t
        return t

    def type_annot1(self, prefix=''):
        tn = self.take('name', what='סוג: מספר, שבר, טקסט, לוגי, רשימה של ... או מילון מ... ל...')
        word = tn.val
        if prefix:     # "מטקסט" / "למספר" — האות הראשונה היא מ/ל של העברית
            if not word.startswith(prefix) or len(word) == 1:
                raise LangError(tn.line, 'כתוב מילון כך: "מילון מטקסט למספר" (מ + סוג המפתח, ל + סוג הערך)')
            word = word[1:]
        if word == 'מילון':
            nx = self.peek()
            if nx.kind == 'name' and nx.val[1:] in ('רשימה', 'מילון'):
                raise LangError(tn.line, 'המפתח במילון יכול להיות מספר, טקסט או לוגי — לא רשימה או מילון')
            k = self.type_annot('מ')
            if k not in ('int', 'text', 'bool'):
                raise LangError(tn.line, 'המפתח במילון יכול להיות מספר, טקסט או לוגי')
            return 'dict:' + k + '|' + self.type_annot('ל')
        if word == 'רשימה':
            if not (self.at('name') and self.peek().val == 'של'):
                raise LangError(tn.line, 'כתוב איזו רשימה: "רשימה של מספר", "רשימה של טקסט" וכו\'')
            self.i += 1
            return 'list:' + self.type_annot()
        if word not in TYPE_NAMES:
            return 'obj:' + word          # שם של מבנה — נבדק אחר כך שהוא באמת קיים
        return TYPE_NAMES[word]

    def statement(self):
        p = self.peek()
        ln = p.line
        if p.kind == 'indent':
            raise LangError(ln, 'השורה הזאת מוזחת בלי סיבה (רווחים מיותרים בתחילת השורה)')
        if p.kind == 'kw' and self.peek(1).kind == 'op' and self.peek(1).val in ASSIGN_OPS:
            raise LangError(ln, f'המילה {self.show(p)} שמורה לשפה — אי אפשר להשתמש בה כשם של משתנה')
        if self.at('kw', 'if'):
            self.i += 1
            branches = [(self.expr(), self.block())]
            orelse = []
            while self.at('kw', 'elif'):
                self.i += 1
                branches.append((self.expr(), self.block()))
            if self.at('kw', 'else'):
                self.i += 1
                orelse = self.block()
            return Node('if', ln, branches=branches, orelse=orelse)
        if self.at('kw', 'while'):
            self.i += 1
            return Node('while', ln, cond=self.expr(), body=self.block())
        if self.at('kw', 'import'):
            self.i += 1
            parts = [self.take('name', what='שם של ספרייה של Python, למשל: ייבא math').val]
            while self.at('op', '.'):
                self.i += 1
                parts.append(self.take('name', what='שם אחרי הנקודה').val)
            self.end_line()
            return Node('import', ln, full='.'.join(parts), name=parts[0])
        if self.at('kw', 'try'):
            self.i += 1
            body = self.block()
            if not self.at('kw', 'except'):
                raise LangError(self.peek().line, 'אחרי "נסה:" צריך לבוא "אם נכשל:" — מה לעשות אם משהו נכשל')
            self.i += 1
            errname = None
            if self.at('name') and self.peek().val == 'עם':
                self.i += 1
                errname = self.take('name', what='שם למשתנה שיקבל את הודעת השגיאה').val
            return Node('try', ln, body=body, handler=self.block(), errname=errname)
        if self.at('kw', 'except'):
            raise LangError(ln, '"אם נכשל" בא רק אחרי "נסה:"')
        if self.at('kw', 'for'):
            self.i += 1
            var = self.take('name', what='שם של משתנה אחרי "לכל"').val
            self.take('kw', 'in', what='"בתוך"')
            it = self.expr()
            return Node('for', ln, var=var, it=it, body=self.block())
        if self.at('kw', 'class'):
            self.i += 1
            name = self.take('name', what='שם למבנה').val
            self.take('op', ':')
            self.take('newline', what='סוף שורה אחרי הנקודתיים')
            self.take('indent')
            fields, methods = [], []
            while not self.at('dedent') and not self.at('eof'):
                fl = self.peek().line
                if self.at('kw', 'def'):
                    methods.append(self.statement())
                elif self.at('kw', 'pass'):
                    self.i += 1
                    self.end_line()
                elif (self.at('name') or (self.at('kw') and getattr(self.peek(), 'src', None) and self.peek().val not in ('def', 'pass'))) \
                        and self.peek(1).kind == 'op' and self.peek(1).val == ':':
                    tk = self.peek(); self.i += 1
                    fname = tk.val if tk.kind == 'name' else tk.src
                    self.i += 1
                    ftype = self.type_annot()
                    default = None
                    if self.at('op', '='):
                        self.i += 1
                        default = self.expr()
                    self.end_line()
                    fields.append((fname, ftype, default, fl))
                else:
                    raise LangError(fl, 'בתוך מבנה כותבים שדות (שם: סוג) ופעולות (פעולה ...)')
            if self.at('dedent'):
                self.i += 1
            return Node('struct', ln, name=name, fields=fields, methods=methods)
        if self.at('kw', 'def'):
            self.i += 1
            name = self.take('name', what='שם לפעולה').val
            self.take('op', '(')
            params = []
            while not self.at('op', ')'):
                pn = self.take('name', what='שם של פרמטר').val
                ptype = None          # בלי סוג: ייקבע לפי הקריאות לפעולה
                if self.at('op', ':'):
                    self.i += 1
                    ptype = self.type_annot()
                params.append((pn, ptype))
                if not self.at('op', ')'):
                    self.take('op', ',', what='פסיק בין הפרמטרים')
            self.take('op', ')')
            return Node('def', ln, name=name, params=params, body=self.block())
        if self.at('kw', 'return'):
            self.i += 1
            val = None if self.at('newline') else self.expr()
            self.end_line()
            return Node('return', ln, val=val)
        if self.at('kw', 'break') or self.at('kw', 'continue') or self.at('kw', 'pass'):
            k = self.peek().val
            self.i += 1
            self.end_line()
            return Node(k, ln)
        if self.at('name') and self.peek(1).kind == 'op' and self.peek(1).val in ASSIGN_OPS:
            name = self.take('name').val
            op = self.take('op').val
            val = self.expr()
            self.end_line()
            if op != '=':
                val = Node('bin', ln, op=op[0], a=Node('var', ln, name=name), b=val)
            return Node('assign', ln, name=name, val=val)
        e = self.expr()
        if self.at('op') and self.peek().val in ASSIGN_OPS:
            op = self.take('op').val
            if e.kind == 'slice':
                raise LangError(ln, 'שינוי של חיתוך (רשימה[1:3] = ...) עוד לא נתמך — שנה איבר איבר')
            if e.kind == 'attr':
                val = self.expr()
                self.end_line()
                aug = op != '='
                if aug:
                    val = Node('bin', ln, op=op[0], a=Node('slotref', ln), b=val)
                return Node('setattr', ln, target=e, val=val, aug=aug)
            if e.kind != 'index':
                raise LangError(ln, 'אפשר לשים ערך רק בתוך משתנה (שם = ערך) או במקום ברשימה/מילון (שם[מקום] = ערך)')
            val = self.expr()
            self.end_line()
            aug = op != '='
            if aug:     # x[i] += v: המקום מחושב פעם אחת (ראה emit_stmt)
                val = Node('bin', ln, op=op[0], a=Node('slotref', ln), b=val)
            return Node('setindex', ln, target=e, val=val, aug=aug)
        self.end_line()
        if e.kind not in ('call', 'method'):
            raise LangError(ln, 'השורה הזאת מחשבת משהו ולא עושה איתו כלום (אולי שכחת "הצג"?)')
        return Node('expr', ln, e=e)

    def end_line(self):
        if not self.at('newline') and not self.at('eof') and not self.at('dedent'):
            p = self.peek()
            raise LangError(p.line, f'מצאתי {self.show(p)} במקום סוף שורה')
        if self.at('newline'):
            self.i += 1

    # --- ביטויים (מהחלש לחזק)
    def expr(self):
        return self.or_()

    def or_(self):
        a = self.and_()
        while self.at('kw', 'or'):
            ln = self.take('kw').line
            a = Node('logic', ln, op='or', a=a, b=self.and_())
        return a

    def and_(self):
        a = self.not_()
        while self.at('kw', 'and'):
            ln = self.take('kw').line
            a = Node('logic', ln, op='and', a=a, b=self.not_())
        return a

    def not_(self):
        if self.at('kw', 'not') and not (self.peek(1).kind == 'kw' and self.peek(1).val == 'in'):
            ln = self.take('kw').line
            return Node('not', ln, a=self.not_())
        return self.cmp()

    def cmp(self):
        a = self.add()
        if self.at('kw', 'in'):
            ln = self.take('kw').line
            return Node('member', ln, a=a, b=self.add(), neg=False)
        if self.at('kw', 'not') and self.peek(1).kind == 'kw' and self.peek(1).val == 'in':
            ln = self.take('kw').line
            self.i += 1
            return Node('member', ln, a=a, b=self.add(), neg=True)
        if self.at('op') and self.peek().val in CMP_OPS:
            p = self.take('op')
            b = self.add()
            if self.at('op') and self.peek().val in CMP_OPS:
                raise LangError(p.line, 'השוואה כפולה (כמו 1 < x < 5) עוד לא נתמכת — כתוב עם "וגם"')
            return Node('cmp', p.line, op=p.val, a=a, b=b)
        return a

    def add(self):
        a = self.mul()
        while self.at('op') and self.peek().val in ('+', '-'):
            p = self.take('op')
            a = Node('bin', p.line, op=p.val, a=a, b=self.mul())
        return a

    def mul(self):
        a = self.unary()
        while self.at('op') and self.peek().val in ('*', '/', '//', '%'):
            p = self.take('op')
            a = Node('bin', p.line, op=p.val, a=a, b=self.unary())
        return a

    def unary(self):
        if self.at('op', '-'):
            ln = self.take('op').line
            return Node('neg', ln, a=self.unary())
        if self.at('op', '+'):
            self.i += 1
            return self.unary()
        return self.postfix()

    def args(self, close):
        args = []
        while not self.at('op', close):
            args.append(self.expr())
            if not self.at('op', close):
                self.take('op', ',', what='פסיק בין הערכים')
        self.take('op', close)
        return args

    def postfix(self):
        e = self.atom()
        while True:
            if self.at('op', '['):
                ln = self.take('op').line
                parts, colons = [None], 0
                while not self.at('op', ']'):
                    if self.at('op', ':'):
                        self.i += 1
                        colons += 1
                        if colons > 2:
                            raise LangError(ln, 'בחיתוך יש לכל היותר שני נקודתיים: [מ:עד:קפיצה]')
                        parts.append(None)
                    else:
                        if parts[-1] is not None:
                            self.take('op', ']')
                        parts[-1] = self.expr()
                self.take('op', ']')
                if colons == 0:
                    if parts[0] is None:
                        raise LangError(ln, 'חסר מקום בתוך הסוגריים המרובעים')
                    e = Node('index', ln, obj=e, idx=parts[0])
                else:
                    parts += [None] * (3 - len(parts))
                    e = Node('slice', ln, obj=e, a=parts[0], b=parts[1], step=parts[2])
            elif self.at('op', '.'):
                ln = self.take('op').line
                if self.at('kw') and getattr(self.peek(), 'src', None):
                    name = self.peek().src; self.i += 1       # גם מילה שמורה יכולה להיות שם של שדה: x.הבא
                else:
                    name = self.take('name', what='שם של שדה או פעולה אחרי הנקודה').val
                if self.at('op', '('):
                    self.i += 1
                    args, kwargs = self.call_args(ln)
                    e = Node('method', ln, obj=e, name=name, args=args, kwargs=kwargs)
                else:
                    e = Node('attr', ln, obj=e, name=name)
            else:
                return e

    def atom(self):
        p = self.peek()
        ln = p.line
        if p.kind in ('int', 'float', 'str'):
            self.i += 1
            return Node(p.kind, ln, val=p.val)
        if self.at('kw', 'true') or self.at('kw', 'false'):
            self.i += 1
            return Node('bool', ln, val=p.val == 'true')
        if self.at('kw', 'nil'):
            self.i += 1
            return Node('nil', ln)
        if self.at('op', '('):
            self.i += 1
            e = self.expr()
            self.take('op', ')')
            return e
        if self.at('op', '['):
            self.i += 1
            return Node('list', ln, items=self.args(']'))
        if self.at('op', '{'):
            self.i += 1
            keys, vals = [], []
            while not self.at('op', '}'):
                keys.append(self.expr())
                if not self.at('op', ':'):
                    raise LangError(ln, 'במילון כל פריט כתוב מפתח: ערך, למשל {"דנה": 90}')
                self.i += 1
                vals.append(self.expr())
                if not self.at('op', '}'):
                    self.take('op', ',', what='פסיק בין הפריטים במילון')
            self.take('op', '}')
            return Node('dict', ln, keys=keys, vals=vals)
        if p.kind == 'name':
            self.i += 1
            if self.at('op', '('):
                self.i += 1
                args, kwargs = self.call_args(ln)
                return Node('call', ln, name=p.val, args=args, kwargs=kwargs)
            return Node('var', ln, name=p.val)
        raise LangError(ln, f'ציפיתי לערך (מספר, טקסט, רשימה, מילון, שם או חישוב), אבל מצאתי {self.show(p)}')

    def call_args(self, ln):
        args, kwargs = [], []
        while not self.at('op', ')'):
            if self.at('name') and self.peek(1).kind == 'op' and self.peek(1).val == '=':
                kn = self.take('name').val
                self.i += 1
                if kn in [k for k, _ in kwargs]:
                    raise LangError(ln, f'השם "{kn}" מופיע פעמיים')
                kwargs.append((kn, self.expr()))
            else:
                if kwargs:
                    raise LangError(ln, 'ערכים עם שם (שם=ערך) באים אחרי הערכים בלי שם')
                args.append(self.expr())
            if not self.at('op', ')'):
                self.take('op', ',', what='פסיק בין הערכים')
        self.take('op', ')')
        return args, kwargs


# ---------------------------------------------------------------- טיפוסים ו-C
def values(n):
    return 'ערך אחד' if n == 1 else ('אף ערך' if n == 0 else f'{n} ערכים')


def mangle(prefix, name):
    return prefix + '_' + name.encode('utf-8').hex()


def c_str(s):
    out = []
    for b in s.encode('utf-8'):
        c = chr(b)
        if c == '"':
            out.append('\\"')
        elif c == '\\':
            out.append('\\\\')
        elif 32 <= b < 127 and c != '?':
            out.append(c)
        else:
            out.append('\\%03o' % b)
    return '"' + ''.join(out) + '"'


def sub_bodies(s):
    if s.kind == 'if':
        return [b for _, b in s.branches] + [s.orelse]
    if s.kind == 'try':
        return [s.body, s.handler]
    if s.kind in ('while', 'for', 'def'):
        return [s.body]
    return []


def has_try(body):
    return any(s.kind == 'try' or any(has_try(b) for b in sub_bodies(s)) for s in body)


def assigned_names(body, acc):
    for s in body:
        if s.kind == 'assign':
            acc.add(s.name)
        elif s.kind == 'for':
            acc.add(s.var)
        elif s.kind == 'try' and s.errname:
            acc.add(s.errname)
        elif s.kind == 'import':
            acc.add(s.name)
        for b in sub_bodies(s):
            if s.kind != 'def':
                assigned_names(b, acc)
    return acc


class Func:
    def __init__(self, node, owner=None):
        """owner = שם המבנה, אם זו פעולה של מבנה (ואז יש לה פרמטר ראשון "זה")"""
        self.node, self.owner = node, owner
        self.name = f'{owner}.{node.name}' if owner else node.name
        self.cfunc = mangle('m', owner + '.' + node.name) if owner else mangle('f', node.name)
        params = ([('זה', 'obj:' + owner)] if owner else []) + list(node.params)
        if owner and 'זה' in [p for p, _ in node.params]:
            raise LangError(node.line, 'בפעולה של מבנה, "זה" כבר קיים לבד — אל תכתוב אותו ברשימת הפרמטרים')
        self.params = {p: (t or new_var()) for p, t in params}
        self.order = [p for p, _ in params]
        self.locals_ = {}
        self.ret = None
        self.bare = False          # יש "תן" בלי ערך
        self.assigned = assigned_names(node.body, set())


class Struct:
    def __init__(self, node):
        self.name, self.line = node.name, node.line
        self.fields, self.defaults, self.flines = {}, {}, {}
        for fname, ftype, default, fl in node.fields:
            self.flines[fname] = fl
            if fname in self.fields:
                raise LangError(fl, f'השדה "{fname}" כבר מופיע במבנה "{node.name}"')
            if default is None and self.defaults:
                raise LangError(fl, f'שדה בלי ערך התחלתי ("{fname}") צריך לבוא לפני השדות שיש להם ערך התחלתי')
            if default is not None:
                v = default
                if v.kind == 'neg' and v.a.kind in ('int', 'float'):
                    v = Node(v.a.kind, v.line, val=-v.a.val)
                if v.kind not in ('int', 'float', 'str', 'bool', 'nil'):
                    raise LangError(fl, 'ערך התחלתי של שדה יכול להיות רק מספר, שבר, טקסט, נכון/לא נכון או כלום')
                self.defaults[fname] = v
            self.fields[fname] = ftype
        if not self.fields:
            raise LangError(node.line, f'למבנה "{node.name}" צריך לפחות שדה אחד (שם: סוג)')
        self.methods = {}
        for m in node.methods:
            if m.name in self.fields or m.name in self.methods:
                raise LangError(m.line, f'השם "{m.name}" כבר קיים במבנה "{node.name}"')
            self.methods[m.name] = Func(m, owner=node.name)


class Compiler:
    def __init__(self, prog):
        TV.clear()
        self.slot_t = None
        self.funcs = {}
        self.structs = {}
        self.globals_ = {}
        self.top = [s for s in prog if s.kind not in ('def', 'struct')]
        self.top_assigned = assigned_names(self.top, set())
        for s in prog:
            if s.kind == 'struct':
                if s.name in self.structs or s.name in BUILTINS or s.name in TYPE_NAMES or s.name in ('רשימה', 'מילון'):
                    raise LangError(s.line, f'השם "{s.name}" כבר תפוס — בחר שם אחר למבנה')
                self.structs[s.name] = Struct(s)
                for m in s.methods:
                    for b in sub_bodies(m):
                        self.no_nested_defs(b)
        for s in prog:
            if s.kind == 'def' and s.name in self.structs:
                raise LangError(s.line, f'"{s.name}" הוא שם של מבנה — בחר שם אחר לפעולה')
            if s.kind == 'struct':
                continue
            if s.kind == 'def':
                if s.name in self.funcs:
                    raise LangError(s.line, f'הפעולה "{s.name}" כבר הוגדרה')
                if s.name in BUILTINS or s.name in TYPE_NAMES:
                    raise LangError(s.line, f'"{s.name}" היא מילה של השפה — בחר שם אחר לפעולה')
                self.funcs[s.name] = Func(s)
                for b in sub_bodies(s):
                    self.no_nested_defs(b)
            else:
                for b in sub_bodies(s):
                    self.no_nested_defs(b)
        self.tmp = 0
        self.helpers = set()
        self.ctx = []
        self.vol = ''
        self.cur_line = 0
        self.uses_py = False
        self.py_helpers = {}
        self.ser_helpers, self.de_helpers, self.work_fns = {}, {}, []
        # כל סוג שנכתב בקוד (שדות, פרמטרים) — אם יש בו שם של מבנה, המבנה צריך להיות קיים
        for st in self.structs.values():
            for fname, ftype in st.fields.items():
                self.check_type(ftype, st.flines[fname])
        for f in self.all_funcs():
            for p, t in f.params.items():
                self.check_type(t, f.node.line)
        def no_struct_names(body, fn_names):
            for st_ in body:
                if st_.kind in ('assign', 'for'):
                    nm = st_.name if st_.kind == 'assign' else st_.var
                    if nm in self.structs:
                        raise LangError(st_.line, f'"{nm}" הוא שם של מבנה — בחר שם אחר למשתנה')
                for b in sub_bodies(st_):
                    no_struct_names(b, fn_names)
        no_struct_names(self.top, None)
        for f in self.all_funcs():
            no_struct_names(f.node.body, None)
            for pn in f.order:
                if pn in self.structs:
                    raise LangError(f.node.line, f'"{pn}" הוא שם של מבנה — בחר שם אחר לפרמטר')

    def all_funcs(self):
        return list(self.funcs.values()) + [m for st in self.structs.values() for m in st.methods.values()]

    def check_type(self, t, line):
        for nm in re.findall(r'obj:([^|:]+)', t):
            if nm not in self.structs:
                raise LangError(line, f'"{nm}" אינו סוג. הסוגים: מספר, שבר, טקסט, לוגי, רשימה של ..., מילון מ... ל..., או שם של מבנה שהגדרת')

    def no_nested_defs(self, body):
        for s in body:
            if s.kind == 'def':
                raise LangError(s.line, 'פעולה בתוך פעולה או בתוך בלוק עוד לא נתמכת — הגדר אותה בנפרד')
            for b in sub_bodies(s):
                self.no_nested_defs(b)

    # --- משתנים
    def table_of(self, name, fn):
        if fn is not None and name in fn.params:
            return None
        return fn.locals_ if (fn is not None and name in fn.assigned) else self.globals_

    def lookup(self, name, fn, line, declared):
        if fn is not None:
            if name in fn.params:
                return fn.params[name]
            if name in fn.assigned:
                if name not in fn.locals_:
                    raise Unknown()
                return fn.locals_[name]
        if name in self.globals_:
            return self.globals_[name]
        if name in self.top_assigned:
            raise Unknown()
        if name in self.funcs or name in BUILTINS:
            raise LangError(line, f'"{name}" היא פעולה — כדי להפעיל אותה כתוב {name}(...)')
        raise LangError(line, f'אין משתנה בשם "{name}"')

    def py_arg(self, a, fn, declared):
        """ערך שעובר ל-Python: כל סוג חוץ ממבנה (אותו Python לא מכיר)"""
        t = self.typeof(a, fn, declared)
        if 'obj:' in t:
            raise LangError(a.line, f'אי אפשר להעביר ל-Python {heb(t)} — העבר את השדות שלו')
        if t == 'none':
            raise LangError(a.line, 'הפעולה הזאת לא נותנת ערך, אז אין מה להעביר ל-Python')
        if is_var(t) or re.search(r'\?\d', t):
            raise Unknown()
        return t

    def is_py_var(self, n, fn):
        if n in self.funcs or n in self.structs or (n in BUILTINS and not (n in self.globals_ or (fn and n in fn.locals_))):
            return False
        t = None
        if fn is not None and n in fn.locals_:
            t = fn.locals_[n]
        elif fn is not None and n in fn.params:
            t = fn.params[n]
        elif n in self.globals_:
            t = self.globals_[n]
        return t is not None and norm(t) == 'py'

    def check_key(self, kt, line):
        kt = norm(kt)
        if not kt.startswith('?') and kt not in KEY_TYPES:
            raise LangError(line, f'המפתח במילון יכול להיות מספר, טקסט או נכון/לא נכון — לא {heb(kt)}')

    def dict_key(self, dt, kt, line):
        """מפתח kt מתאים למילון dt? (ואם סוג המפתחות עוד לא ידוע — עכשיו הוא ידוע)"""
        if unify(dkey(dt), kt, promote=False) is None:
            raise LangError(line, f'המפתחות במילון הזה הם {heb(dkey(dt))} — אי אפשר לחפש לפי {heb(kt)}')
        self.check_key(kt, line)

    # --- הסוג של ביטוי
    def typeof(self, e, fn, declared):
        t = norm(self._typeof(e, fn, declared))
        if getattr(e, 'unwrap', False) and is_opt(t):
            return obase(t)
        return t

    def operand(self, e, fn, declared):
        """ערך שמשתמשים בו בפעולה (שדה, מקום, חשבון...): אם הוא "X או כלום" — בודקים בזמן ריצה שאינו כלום"""
        t = norm(self._typeof(e, fn, declared))
        if t == 'nil':
            raise LangError(e.line, 'כאן הערך הוא תמיד כלום — אי אפשר להשתמש בו כך')
        if is_opt(t):
            e.unwrap = True
            if is_var(obase(t)):
                raise Unknown()
            return obase(t)
        return t

    def _typeof(self, e, fn, declared):
        k = e.kind
        if k in ('int', 'float', 'bool'):
            return k
        if k == 'nil':
            return 'nil'
        if k == 'str':
            return 'text'
        if k == 'var':
            t = norm(self.lookup(e.name, fn, e.line, declared))
            if t.startswith('?'):
                raise Unknown()          # הסוג עוד לא ידוע — ננסה בסבב הבא
            return t
        if k == 'list':
            if not hasattr(e, 'tv'):
                e.tv = new_var()     # אותה משבצת בכל סבב
            t = e.tv
            for x in e.items:
                xt = self.typeof(x, fn, declared)
                u = unify(t, xt)
                if u is None or xt == 'none':
                    if (xt == 'nil' or is_opt(t) or is_opt(xt)) and not opt_ok(obase(xt if xt != 'nil' else t)):
                        raise LangError(x.line, 'כלום יכול להיות רק במקום של טקסט, רשימה, מילון או מבנה — לא ליד מספר או נכון/לא נכון')
                    raise LangError(x.line, f'כל האיברים ברשימה צריכים להיות מאותו סוג — יש כאן {heb(t)} ו{heb(xt)}')
                t = u
            return 'list:' + t
        if k == 'dict':
            if not hasattr(e, 'tv'):
                e.tv = (new_var(), new_var())
            kt, vt = e.tv
            for x, y in zip(e.keys, e.vals):
                xt, yt = self.typeof(x, fn, declared), self.typeof(y, fn, declared)
                u = unify(kt, xt, promote=False)
                if u is None:
                    raise LangError(x.line, f'כל המפתחות במילון צריכים להיות מאותו סוג — יש כאן {heb(kt)} ו{heb(xt)}')
                self.check_key(u, x.line)
                u = unify(vt, yt)
                if u is None or yt == 'none':
                    raise LangError(y.line, f'כל הערכים במילון צריכים להיות מאותו סוג — יש כאן {heb(vt)} ו{heb(yt)}')
                vt = u
            return 'dict:' + norm(kt) + '|' + norm(vt)
        if k == 'slice':
            ot = self.operand(e.obj, fn, declared)
            for x in (e.a, e.b, e.step):
                if x is not None and self.operand(x, fn, declared) != 'int':
                    raise LangError(e.line, f'בחיתוך [מ:עד:קפיצה] צריך מספרים שלמים, לא {heb(self.typeof(x, fn, declared))}')
            if ot == 'text' or is_list(ot):
                return ot
            raise LangError(e.line, f'אפשר לחתוך [מ:עד] רק רשימה או טקסט, לא {heb(ot)}')
        if k == 'slotref':
            if self.slot_t is None or is_var(self.slot_t):
                raise Unknown()
            return self.slot_t
        if k == 'index':
            ot = self.operand(e.obj, fn, declared)
            if ot == 'py':
                self.py_arg(e.idx, fn, declared)
                return 'py'
            it = self.operand(e.idx, fn, declared)
            if is_dict(ot):
                self.dict_key(ot, it, e.line)
                if is_var(dval(ot)):
                    raise Unknown()
                return dval(ot)
            if it != 'int':
                raise LangError(e.line, f'המקום בסוגריים המרובעים צריך להיות מספר שלם, לא {heb(it)}')
            if ot == 'text':
                return 'text'
            if not is_list(ot):
                raise LangError(e.line, f'אפשר לקחת מקום [..] רק מרשימה, ממילון או מטקסט, לא מ{heb(ot)}')
            if is_var(elem(ot)):
                raise Unknown()
            return elem(ot)
        if k == 'attr':
            ot = self.operand(e.obj, fn, declared)
            if ot == 'py':
                return 'py'
            if not is_obj(ot):
                raise LangError(e.line, f'רק למבנה יש שדות (x.{e.name}) — כאן יש {heb(ot)}')
            st = self.structs[oname(ot)]
            if e.name in st.methods:
                raise LangError(e.line, f'"{e.name}" היא פעולה — כדי להפעיל אותה כתוב .{e.name}(...)')
            if e.name not in st.fields:
                raise LangError(e.line, f'למבנה "{st.name}" אין שדה בשם "{e.name}" (יש: {", ".join(st.fields)})')
            return st.fields[e.name]
        if k == 'method':
            ot = self.operand(e.obj, fn, declared)
            if ot == 'el':
                # שם -> (סוגי הערכים, מה חוזר). בלוח: קבע(שורה, עמודה, טקסט), קרא(שורה, עמודה), סמן(שורה, עמודה, נכון/לא נכון)
                sig = {'שנה': (['text'], 'none'), 'ערך': ([], 'text'), 'נקה': ([], 'none'), 'הוסף': (['text'], 'none'),
                       'קבע': (['int', 'int', 'text'], 'none'), 'קרא': (['int', 'int'], 'text'), 'סמן': (['int', 'int', 'bool'], 'none'),
                       'נעל': (['int', 'int'], 'none')}
                if e.name not in sig:
                    raise LangError(e.line, f'לרכיב בדף אין פעולה בשם "{e.name}" (יש: {", ".join(sig)})')
                want = sig[e.name][0]
                if len(e.args) != len(want) or e.kwargs:
                    raise LangError(e.line, f'"{e.name}" צריך {values(len(want))}, אבל קיבל {values(len(e.args))}')
                for a, w in zip(e.args, want):
                    at = self.operand(a, fn, declared)
                    if at != w:
                        raise LangError(e.line, f'"{e.name}" צריך {heb(w)} כאן, לא {heb(at)}' + (' — אפשר להשתמש ב-טקסט(...)' if w == 'text' else ''))
                return sig[e.name][1]
            if ot == 'py':
                for a in e.args + [v for _, v in e.kwargs]:
                    self.py_arg(a, fn, declared)
                return 'py'
            if e.kwargs:
                raise LangError(e.line, 'ערכים עם שם (שם=ערך) עובדים ביצירת מבנה, ב-מסודר/הגדול/הקטן, ובקריאה ל-Python')
            if is_obj(ot):
                st = self.structs[oname(ot)]
                if e.name not in st.methods:
                    if e.name in st.fields:
                        raise LangError(e.line, f'"{e.name}" הוא שדה, לא פעולה — כתוב בלי סוגריים: x.{e.name}')
                    raise LangError(e.line, f'למבנה "{st.name}" אין פעולה בשם "{e.name}"' + (f' (יש: {", ".join(st.methods)})' if st.methods else ''))
                return self.check_call(st.methods[e.name], e.args, [self.typeof(a, fn, declared) for a in e.args], e.line, skip_self=True)
            if ot == 'text':
                if e.name not in TEXT_METHODS:
                    raise LangError(e.line, f'לטקסט אין פעולה בשם "{e.name}" (יש: {", ".join(TEXT_METHODS)})')
                counts, ret = TEXT_METHODS[e.name]
                if len(e.args) not in counts:
                    raise LangError(e.line, f'"{e.name}" צריך {" או ".join(values(c) for c in counts)}, אבל קיבל {values(len(e.args))}')
                for a in e.args:
                    at = self.typeof(a, fn, declared)
                    if e.name == 'חבר':
                        if not (is_list(at) and unify(elem(at), 'text') is not None):
                            raise LangError(e.line, f'"חבר" מחבר רשימה של טקסט, למשל ", ".חבר(שמות) — קיבל {heb(at)}')
                    elif at != 'text':
                        raise LangError(e.line, f'"{e.name}" צריך טקסט, לא {heb(at)}')
                return ret
            if is_dict(ot):
                if e.name == 'הוצא':
                    if len(e.args) != 1:
                        raise LangError(e.line, f'"הוצא" במילון צריך מפתח אחד: מילון.הוצא(מפתח) — קיבל {values(len(e.args))}')
                    self.dict_key(ot, self.typeof(e.args[0], fn, declared), e.line)
                    if is_var(dval(ot)):
                        raise Unknown()
                    return dval(ot)
                if e.name == 'קבל' and len(e.args) == 1 and opt_ok(dval(ot)) and not is_var(dval(ot)):
                    self.dict_key(ot, self.operand(e.args[0], fn, declared), e.line)
                    return 'opt:' + dval(ot)
                if e.name == 'קבל':
                    if len(e.args) != 2:
                        raise LangError(e.line, f'"קבל" צריך מפתח וערך למקרה שהמפתח חסר: מילון.קבל(מפתח, 0) — קיבל {values(len(e.args))}')
                    self.dict_key(ot, self.typeof(e.args[0], fn, declared), e.line)
                    dt = self.typeof(e.args[1], fn, declared)
                    if not accepts(dval(ot), dt):
                        raise LangError(e.line, f'הערכים במילון הם {heb(dval(ot))} — ערך ברירת המחדל צריך להיות מאותו סוג, לא {heb(dt)}')
                    return dval(ot)
                raise LangError(e.line, f'למילון אין פעולה בשם "{e.name}" (יש: הוצא, קבל)')
            if e.name == 'קבל' and is_list(ot):
                raise LangError(e.line, '"קבל" היא פעולה של מילון. ברשימה כתוב רשימה[מקום]')
            if not is_list(ot):
                raise LangError(e.line, f'".{e.name}" עובד על רשימות ומילונים, לא על {heb(ot)}')
            if e.name == 'הוסף':
                if len(e.args) != 1:
                    raise LangError(e.line, f'"הוסף" צריך ערך אחד, קיבל {values(len(e.args))}')
                vt = self.typeof(e.args[0], fn, declared)
                et = elem(ot)
                if vt == 'none':
                    raise LangError(e.line, 'אין מה להוסיף — הפעולה הזאת לא נותנת ערך')
                if not accepts(et, vt):
                    tip = ' (אם צריך שברים, התחל את הרשימה עם שבר, למשל [0.0])' if (et, vt) == ('int', 'float') else ''
                    raise LangError(e.line, f'אי אפשר להוסיף {heb(vt)} לרשימה של {heb(et)}{tip}')
                return 'none'
            if e.name == 'הוצא':
                if e.args:
                    raise LangError(e.line, '"הוצא" מוציא את האיבר האחרון ולא מקבל ערכים')
                if is_var(elem(ot)):
                    raise Unknown()
                return elem(ot)
            raise LangError(e.line, f'לרשימה אין פעולה בשם "{e.name}" (יש: הוסף, הוצא)')
        if k == 'member':
            at, bt = self.operand(e.a, fn, declared), self.operand(e.b, fn, declared)
            if bt == 'py':
                self.py_arg(e.a, fn, declared)
                return 'bool'
            if at == 'py':
                raise LangError(e.line, 'כדי לחפש ערך של Python ברשימה, המר אותו קודם (מספר(...), טקסט(...))')
            if bt == 'text':
                if at != 'text':
                    raise LangError(e.line, f'בטקסט אפשר לחפש רק טקסט, לא {heb(at)}')
                return 'bool'
            if is_dict(bt):
                self.dict_key(bt, at, e.line)
                return 'bool'
            if not is_list(bt):
                raise LangError(e.line, f'"בתוך" מחפש ברשימה, במילון או בטקסט, לא ב{heb(bt)}')
            et = elem(bt)
            if unify(et, at) is None:
                raise LangError(e.line, f'אין טעם לחפש {heb(at)} ברשימה של {heb(et)}')
            return 'bool'
        if k == 'neg':
            t = self.operand(e.a, fn, declared)
            if t == 'py':
                return 'py'
            if t not in ('int', 'float'):
                raise LangError(e.line, f'אי אפשר לשים מינוס לפני {heb(t)}')
            return t
        if k == 'not':
            t = self.operand(e.a, fn, declared)
            if t != 'bool' and t != 'py':
                raise LangError(e.line, f'"לא" צריך לבוא לפני תנאי (נכון/לא נכון), לא לפני {heb(t)}')
            return 'bool'
        if k == 'logic':
            for x in (e.a, e.b):
                t = self.operand(x, fn, declared)
                if t != 'bool' and t != 'py':
                    raise LangError(e.line, f'"{"וגם" if e.op == "and" else "או"}" מחבר תנאים (נכון/לא נכון), לא {heb(t)}')
            return 'bool'
        if k == 'cmp':
            a, b = self.typeof(e.a, fn, declared), self.typeof(e.b, fn, declared)
            if 'py' in (a, b):
                self.py_arg(e.a, fn, declared); self.py_arg(e.b, fn, declared)
                return 'bool'
            if e.op in ('==', '!=') and ('nil' in (a, b) or is_opt(a) or is_opt(b)):
                if unify(a, b, promote=False) is None:
                    raise LangError(e.line, f'אי אפשר להשוות {heb(a)} ל{heb(b)}')
                return 'bool'
            if e.op not in ('==', '!='):
                a, b = self.operand(e.a, fn, declared), self.operand(e.b, fn, declared)
            if is_ref(a) or is_ref(b):
                if e.op not in ('==', '!='):
                    raise LangError(e.line, ('מילונים אפשר רק להשוות אם הם שווים (==, !=)' if is_dict(a) or is_dict(b) else
                                             'רשימות אפשר רק להשוות אם הן שוות (==, !=)' if is_list(a) or is_list(b) else
                                             f'את "{heb(a)}" אפשר רק להשוות אם שווים (==, !=)'))
                if unify(a, b, promote=False) is None:
                    raise LangError(e.line, f'אי אפשר להשוות {heb(a)} ל{heb(b)}')
                return 'bool'
            if unify(a, b) is None or 'none' in (a, b):
                raise LangError(e.line, f'אי אפשר להשוות {heb(a)} ל{heb(b)}')
            if a == 'bool' and e.op not in ('==', '!='):
                raise LangError(e.line, 'את נכון/לא נכון אפשר רק להשוות (==, !=), לא לבדוק מי גדול')
            return 'bool'
        if k == 'bin':
            a, b = self.operand(e.a, fn, declared), self.operand(e.b, fn, declared)
            if 'py' in (a, b):
                self.py_arg(e.a, fn, declared); self.py_arg(e.b, fn, declared)
                return 'py'
            if e.op == '+' and a == b == 'text':
                return 'text'
            if e.op == '*' and {a, b} == {'text', 'int'}:
                return 'text'
            if e.op == '*' and 'int' in (a, b) and (is_list(a) or is_list(b)):
                return a if is_list(a) else b
            if e.op == '+' and is_list(a) and is_list(b):
                u = unify(a, b, promote=False)
                if u is None:
                    raise LangError(e.line, f'אי אפשר לחבר {heb(a)} ו{heb(b)}')
                return u
            if 'text' in (a, b):
                if e.op == '+':
                    raise LangError(e.line, f'אי אפשר לחבר טקסט ל{heb(b if a == "text" else a)} — כתוב טקסט(...) כדי להפוך אותו לטקסט')
                raise LangError(e.line, f'הפעולה "{e.op}" לא עובדת על טקסט')
            if a not in ('int', 'float') or b not in ('int', 'float'):
                if is_dict(a) or is_dict(b):
                    raise LangError(e.line, f'הפעולה "{e.op}" לא עובדת על מילונים — כדי להוסיף כתוב מילון[מפתח] = ערך')
                if is_obj(a) or is_obj(b):
                    raise LangError(e.line, f'הפעולה "{e.op}" לא עובדת על {heb(a if is_obj(a) else b)} — אפשר על השדות שלו')
                if is_list(a) or is_list(b):
                    other = b if is_list(a) else a
                    if e.op == '+':
                        raise LangError(e.line, f'אי אפשר לחבר רשימה ו{heb(other)} — כדי להוסיף איבר כתוב .הוסף(...), כדי לחבר רשימות שים את האיבר בסוגריים [ ]')
                    raise LangError(e.line, f'הפעולה "{e.op}" לא עובדת על רשימות')
                raise LangError(e.line, f'הפעולה "{e.op}" עובדת רק על מספרים')
            if e.op == '/':
                return 'float'
            if e.op in ('//', '%') and 'float' in (a, b):
                raise LangError(e.line, f'"{e.op}" עובד רק על מספרים שלמים')
            return 'float' if 'float' in (a, b) else 'int'
        if k == 'call':
            return self.call_type(e, fn, declared)
        raise LangError(e.line, 'ביטוי לא מוכר')

    def check_call(self, f, args, ts, line, skip_self=False):
        order = f.order[1:] if skip_self else f.order
        if len(args) != len(order):
            raise LangError(line, f'הפעולה "{f.name}" צריכה {values(len(order))}, אבל קיבלה {values(len(args))}')
        for i, (pn, t) in enumerate(zip(order, ts)):
            want = f.params[pn]
            if not accepts(want, t):
                hint = f' (אם "{pn}" אמור להיות {heb(t)}, כתוב בהגדרה: {pn}: {heb(t)})' if t != 'none' else ''
                raise LangError(line, f'הערך מספר {i + 1} ל"{f.name}" צריך להיות {heb(want)}, אבל הוא {heb(t)}{hint}')
        if f.ret is None:
            raise Unknown()
        return f.ret

    def sort_type(self, e, fn, declared):
        """מסודר(ל, לפי=פעולה, הפוך=נכון) / הגדול(ל, לפי=פעולה)"""
        n = e.name
        if len(e.args) != 1:
            raise LangError(e.line, f'עם "לפי" או "הפוך", "{n}" מקבל רשימה אחת (או מילון)')
        lt = self.typeof(e.args[0], fn, declared)
        if not (is_list(lt) or (n == 'מסודר' and is_dict(lt))):
            raise LangError(e.line, f'"{n}" צריך רשימה' + (' או מילון' if n == 'מסודר' else '') + f', לא {heb(lt)}')
        et = dkey(lt) if is_dict(lt) else elem(lt)
        kinds = dict(e.kwargs)
        for kn in kinds:
            if kn not in ('לפי', 'הפוך') or (kn == 'הפוך' and n != 'מסודר'):
                raise LangError(e.line, f'ל"{n}" אין ערך בשם "{kn}" (יש: לפי' + (', הפוך' if n == 'מסודר' else '') + ')')
        if 'הפוך' in kinds and self.typeof(kinds['הפוך'], fn, declared) != 'bool':
            raise LangError(e.line, '"הפוך" צריך להיות נכון או לא נכון')
        kt = et
        if 'לפי' in kinds:
            kf = kinds['לפי']
            if kf.kind != 'var' or kf.name not in self.funcs:
                raise LangError(e.line, '"לפי" צריך שם של פעולה שהגדרת (בלי סוגריים), למשל: מסודר(תלמידים, לפי=ציון_של)')
            f = self.funcs[kf.name]
            kt = self.check_call(f, [e.args[0]], [et], e.line)
        if is_var(kt):
            raise Unknown()
        if kt not in ('int', 'float', 'text', 'bool'):
            raise LangError(e.line, f'אפשר לסדר לפי מספר, שבר, טקסט או נכון/לא נכון — לא לפי {heb(kt)}')
        e.key_t = kt
        return 'list:' + et if n == 'מסודר' else et

    def ctor_fields(self, e):
        """יצירת מבנה: לאיזה שדה הולך כל ערך (לפי הסדר, או לפי שם)"""
        st = self.structs[e.name]
        names = list(st.fields)
        if len(e.args) > len(names):
            raise LangError(e.line, f'למבנה "{st.name}" יש {values(len(names)).replace("ערכים", "שדות").replace("ערך אחד", "שדה אחד")}, אבל קיבל {values(len(e.args))}')
        got = {nm: a for nm, a in zip(names, e.args)}
        for kn, kv in e.kwargs:
            if kn not in st.fields:
                raise LangError(e.line, f'למבנה "{st.name}" אין שדה בשם "{kn}" (יש: {", ".join(names)})')
            if kn in got:
                raise LangError(e.line, f'השדה "{kn}" קיבל ערך פעמיים')
            got[kn] = kv
        for nm in names:
            if nm not in got and nm not in st.defaults:
                raise LangError(e.line, f'חסר ערך לשדה "{nm}" של "{st.name}"')
        return st, got

    def parallel_type(self, e, fn, declared):
        """במקביל(פעולה, רשימה) — הפעולה על כל איבר, על כל הליבות. התוצאה: רשימה של התוצאות, באותו סדר"""
        if len(e.args) != 2 or e.args[0].kind != 'var' or e.args[0].name not in self.funcs:
            raise LangError(e.line, '"במקביל" צריך שם של פעולה שהגדרת ורשימה: במקביל(חשב, רשימה)')
        for kn, kv in e.kwargs:
            if kn != 'עובדים':
                raise LangError(e.line, f'ל"במקביל" אין ערך בשם "{kn}" (יש: עובדים)')
            if self.typeof(kv, fn, declared) != 'int':
                raise LangError(e.line, '"עובדים" צריך להיות מספר שלם')
        lt = self.operand(e.args[1], fn, declared)
        if not is_list(lt):
            raise LangError(e.line, f'"במקביל" עובר על רשימה, לא על {heb(lt)}')
        f = self.funcs[e.args[0].name]
        rt = self.check_call(f, [e.args[1]], [elem(lt)], e.line)
        if rt == 'none':
            raise LangError(e.line, f'הפעולה "{f.name}" לא נותנת ערך — ב"במקביל" צריך פעולה שנותנת תוצאה (תן ...)')
        if 'py' in norm(rt):
            raise LangError(e.line, 'ערך של Python לא יכול לחזור מ"במקביל" — המר אותו קודם (מספר, טקסט...)')
        return 'list:' + rt

    def func_ref(self, a, nparams, what):
        """ערך שהוא שם של פעולה שהגדרת (בלי סוגריים) — למשל הפעולה שכפתור מפעיל"""
        if a.kind != 'var' or a.name not in self.funcs:
            raise LangError(a.line, f'{what} צריך שם של פעולה שהגדרת (בלי סוגריים)')
        f = self.funcs[a.name]
        if len(f.order) != nparams:
            raise LangError(a.line, f'הפעולה "{f.name}" צריכה לא לקבל ערכים (היא נקראת מתוך הדף)')
        return f

    def ui_type(self, e, fn, declared):
        n, args = e.name, e.args
        if e.kwargs:
            raise LangError(e.line, f'"{n}" לא מקבל ערכים עם שם')
        def txt(i):
            t = self.operand(args[i], fn, declared)
            if t != 'text':
                raise LangError(e.line, f'"{n}" צריך טקסט, לא {heb(t)} — אפשר להשתמש ב-טקסט(...)')
        want = {'כותרת': (1, 1), 'טקסט_בדף': (1, 1), 'שדה_קלט': (1, 2), 'כפתור': (2, 2), 'רשימת_שורות': (0, 0), 'כל_כמה': (2, 2),
                'לוח': (2, 3)}[n]
        if not want[0] <= len(args) <= want[1]:
            raise LangError(e.line, f'"{n}" צריך {values(want[0])}' + (f' או {values(want[1])}' if want[1] != want[0] else '') + f', אבל קיבל {values(len(args))}')
        if n in ('כותרת', 'טקסט_בדף', 'שדה_קלט', 'כפתור'):
            txt(0)
        if n == 'שדה_קלט' and len(args) == 2:
            self.func_ref(args[1], 0, '"שדה_קלט" (מה לעשות כשלוחצים Enter)')
        if n == 'כפתור':
            self.func_ref(args[1], 0, '"כפתור" (מה לעשות כשלוחצים)')
        if n == 'לוח':
            if len(args) == 3:
                self.func_ref(args[2], 0, '"לוח" (מה לעשות כשמשבצת משתנה)')
            for a in args[:2]:
                if self.operand(a, fn, declared) != 'int':
                    raise LangError(e.line, '"לוח" צריך מספר שורות ומספר עמודות (מספרים שלמים)')
        if n == 'כל_כמה':
            t = self.operand(args[0], fn, declared)
            if t not in ('int', 'float'):
                raise LangError(e.line, '"כל_כמה" צריך מספר שניות')
            self.func_ref(args[1], 0, '"כל_כמה" (מה לעשות כל פעם)')
            return 'none'
        return 'el'

    def call_type(self, e, fn, declared):
        n, args = e.name, e.args
        if n in UI_BUILTINS and n not in self.funcs:
            return self.ui_type(e, fn, declared)
        if n == 'במקביל' and n not in self.funcs:
            return self.parallel_type(e, fn, declared)
        if n in self.structs:
            st, got = self.ctor_fields(e)
            for nm, a in got.items():
                t = self.typeof(a, fn, declared)
                if t == 'none' or not accepts(st.fields[nm], t):
                    raise LangError(e.line, f'השדה "{nm}" של "{st.name}" הוא {heb(st.fields[nm])}, אבל קיבל {heb(t)}')
            return 'obj:' + n
        if n in ('מסודר', 'הגדול', 'הקטן') and e.kwargs:
            return self.sort_type(e, fn, declared)
        if e.kwargs and self.is_py_var(n, fn):
            for a in e.args + [v for _, v in e.kwargs]:
                self.py_arg(a, fn, declared)
            return 'py'
        if e.kwargs:
            raise LangError(e.line, 'ערכים עם שם (שם=ערך) עובדים ביצירת מבנה, ב-מסודר/הגדול/הקטן (לפי=..., הפוך=...), ובקריאה ל-Python')
        # פעולות מוכנות צריכות ערך אמיתי (כמה(כלום) = שגיאה, כמו ב-Python); הצג וטקסט מציגים גם כלום
        ts = [self.typeof(a, fn, declared) if n in ('הצג', 'טקסט') or n in self.funcs else self.operand(a, fn, declared)
              for a in args]

        def need(count):
            if len(args) != count:
                raise LangError(e.line, f'"{n}" צריך {values(count)}, אבל קיבל {values(len(args))}')

        if n == 'הצג':
            for a, t in zip(args, ts):
                if t == 'none':
                    raise LangError(a.line, 'אי אפשר להציג פעולה שלא נותנת ערך')
            return 'none'
        if n == 'שאל':
            if len(args) > 1:
                raise LangError(e.line, '"שאל" מקבל שאלה אחת לכל היותר')
            if ts and ts[0] != 'text':
                raise LangError(e.line, 'השאלה ב"שאל" צריכה להיות טקסט')
            return 'text'
        if n in ('כמה', 'מספר', 'שבר', 'טקסט') and len(ts) == 1 and ts[0] == 'py':
            return {'כמה': 'int', 'מספר': 'int', 'שבר': 'float', 'טקסט': 'text'}[n]
        if n == 'כמה':
            need(1)
            if ts[0] != 'text' and not is_list(ts[0]) and not is_dict(ts[0]):
                raise LangError(e.line, f'"כמה" סופר אותיות בטקסט, איברים ברשימה או מפתחות במילון — קיבל {heb(ts[0])}')
            return 'int'
        if n == 'אקראי':
            need(0)
            return 'float'
        if n == 'זרע':
            need(1)
            if ts[0] != 'int':
                raise LangError(e.line, '"זרע" צריך מספר שלם')
            return 'none'
        if n in ('אקספ', 'לוג', 'שורש', 'חזקה'):
            need(2 if n == 'חזקה' else 1)
            for t in ts:
                if t not in ('int', 'float'):
                    raise LangError(e.line, f'"{n}" עובד על מספרים, לא על {heb(t)}')
            return 'float'
        if n == 'שגיאה':
            need(1)
            if ts[0] != 'text':
                raise LangError(e.line, f'"שגיאה" צריך טקסט — ההודעה שתוצג, לא {heb(ts[0])}')
            return 'none'
        if n in ('קוד_אות', 'קרא_קובץ', 'קיים_קובץ'):
            need(1)
            if ts[0] != 'text':
                raise LangError(e.line, f'"{n}" צריך טקסט, לא {heb(ts[0])}')
            return {'קוד_אות': 'int', 'קרא_קובץ': 'text', 'קיים_קובץ': 'bool'}[n]
        if n == 'אות_מקוד':
            need(1)
            if ts[0] != 'int':
                raise LangError(e.line, f'"אות_מקוד" צריך מספר שלם, לא {heb(ts[0])}')
            return 'text'
        if n in ('כתוב_קובץ', 'הוסף_לקובץ'):
            need(2)
            if ts[0] != 'text' or ts[1] != 'text':
                raise LangError(e.line, f'"{n}" צריך שם של קובץ וטקסט: {n}("קובץ.txt", טקסט) — כדי לכתוב מספר, השתמש ב-טקסט(...)')
            return 'none'
        if n == 'ארגומנטים':
            need(0)
            return 'list:text'
        if n == 'עגל':
            if len(args) not in (1, 2):
                raise LangError(e.line, f'"עגל" צריך מספר, ואפשר גם כמה ספרות אחרי הנקודה — קיבל {values(len(args))}')
            if ts[0] not in ('int', 'float'):
                raise LangError(e.line, f'"עגל" עובד על מספרים, לא על {heb(ts[0])}')
            if len(args) == 2 and ts[1] != 'int':
                raise LangError(e.line, f'מספר הספרות ב"עגל" צריך להיות מספר שלם, לא {heb(ts[1])}')
            return 'int' if len(args) == 1 or ts[0] == 'int' else 'float'
        if n in ('מפתחות', 'ערכים'):
            need(1)
            if not is_dict(ts[0]):
                raise LangError(e.line, f'"{n}" עובד על מילון — קיבל {heb(ts[0])}')
            return 'list:' + (dkey(ts[0]) if n == 'מפתחות' else dval(ts[0]))
        if n in ('מספר', 'שבר'):
            need(1)
            if ts[0] not in ('int', 'float', 'text'):
                raise LangError(e.line, f'אי אפשר להפוך {heb(ts[0])} ל{n}')
            return 'int' if n == 'מספר' else 'float'
        if n == 'טקסט':
            need(1)
            if ts[0] == 'none':
                raise LangError(e.line, 'אין מה להפוך לטקסט — הפעולה הזאת לא נותנת ערך')
            return 'text'
        if n == 'חיובי':
            need(1)
            if ts[0] not in ('int', 'float'):
                raise LangError(e.line, '"חיובי" עובד על מספרים')
            return ts[0]
        if n == 'סכום':
            need(1)
            if is_list(ts[0]) and is_var(elem(ts[0])):
                raise Unknown()
            if not is_list(ts[0]) or elem(ts[0]) not in ('int', 'float'):
                raise LangError(e.line, f'"סכום" מחבר רשימה של מספרים — קיבל {heb(ts[0])}')
            return elem(ts[0])
        if n in ('הגדול', 'הקטן'):
            if len(args) == 1:
                if is_list(ts[0]) and is_var(elem(ts[0])):
                    raise Unknown()
                if not is_list(ts[0]) or elem(ts[0]) not in ('int', 'float', 'text'):
                    raise LangError(e.line, f'"{n}" עובד על רשימה של מספרים או של טקסט, או על כמה ערכים')
                return elem(ts[0])
            if len(args) < 1:
                raise LangError(e.line, f'"{n}" צריך רשימה או כמה ערכים')
            t = ts[0]
            for x in ts[1:]:
                t = unify(t, x) if t else None
            if t not in ('int', 'float', 'text'):
                raise LangError(e.line, f'"{n}" משווה מספרים או טקסטים מאותו סוג')
            return t
        if n == 'מסודר':
            need(1)
            if is_dict(ts[0]):      # כמו Python: המפתחות, מסודרים
                if is_var(dkey(ts[0])):
                    raise Unknown()
                if dkey(ts[0]) == 'bool':
                    raise LangError(e.line, '"מסודר" מסדר מספרים או טקסט — המפתחות כאן הם נכון/לא נכון')
                return 'list:' + dkey(ts[0])
            if not is_list(ts[0]) or not (is_var(elem(ts[0])) or elem(ts[0]) in ('int', 'float', 'text')):
                raise LangError(e.line, f'"מסודר" מסדר רשימה של מספרים או של טקסט — קיבל {heb(ts[0])}')
            return ts[0]
        if n == 'ספירה':
            raise LangError(e.line, '"ספירה" עובד רק בלולאה: לכל x בתוך ספירה(...)')
        if n in self.funcs:
            return self.check_call(self.funcs[n], args, ts, e.line)
        if self.is_py_var(n, fn):
            for a in args:
                self.py_arg(a, fn, declared)
            return 'py'
        if n in METHODS:
            raise LangError(e.line, f'"{n}" היא פעולה של רשימה, מילון או טקסט — כתוב שם.{n}(...)')
        for st in self.structs.values():
            if n in st.methods:
                raise LangError(e.line, f'"{n}" היא פעולה של המבנה "{st.name}" — כתוב x.{n}(...)')
        raise LangError(e.line, f'אין פעולה בשם "{n}"')

    # --- סבב הבנת טיפוסים (חוזר עד שהכל ידוע)
    def set_var(self, name, t, fn, line):
        if fn is not None and name in fn.params:
            want = fn.params[name]
            if not accepts(want, t):
                raise LangError(line, f'"{name}" הוא {heb(want)} — אי אפשר לשים בו {heb(t)}')
            return False
        if t == 'none':
            raise LangError(line, 'הפעולה הזאת לא נותנת ערך, אז אין מה לשים במשתנה')
        if name in self.funcs:   # שם של פעולה מוכנה (סכום, מספר...) מותר כמשתנה, כמו ב-Python; שם של פעולה שלך — לא
            raise LangError(line, f'"{name}" הוא שם של פעולה שהגדרת — בחר שם אחר למשתנה')
        table = self.table_of(name, fn)
        old = norm(table.get(name))
        if old is None:
            table[name] = 'opt:' + new_var() if t == 'nil' else t
            return True
        if t == 'nil' or is_opt(old) or is_opt(t):
            if unify(old, t, promote=False) is not None:
                u = unify(old, t, promote=False)
                if norm(u) != old:
                    table[name] = u
                    return True
                return False
            raise LangError(line, f'"{name}" הוא {heb(old)} — אי אפשר לשים בו {heb(t)}'
                            + (' (כלום אפשר רק בטקסט, רשימה, מילון או מבנה)' if 'nil' in (t, old) or not opt_ok(obase(old)) else ''))
        if old == t or (old == 'float' and t == 'int'):
            return False
        if (is_list(old) and is_list(t)) or is_var(old) or is_var(t):
            if unify(old, t, promote=False) is not None:
                return False      # אם משבצת התמלאה — CHANGED כבר מסמן סבב נוסף
        if old == 'int' and t == 'float':
            raise LangError(line, f'"{name}" התחיל כמספר שלם ועכשיו מקבל שבר — אם צריך שברים, תן לו ערך התחלתי כמו 0.0')
        raise LangError(line, f'"{name}" הוא {heb(old)} — אי אפשר לשים בו {heb(t)}')

    def infer_body(self, body, fn, declared, in_loop=0):
        changed = False
        for s in body:
            try:
                changed |= self.infer_stmt(s, fn, declared, in_loop)
            except Unknown:
                pass
        return changed

    def aug_hint(self, s, fn, declared):
        """x[k] += v כשסוג המקום עוד לא ידוע: התוצאה נשמרת באותו מקום, אז המקום מאותו סוג כמו v"""
        if s.aug and is_var(self.slot_t):
            unify(self.slot_t, self.typeof(s.val.b, fn, declared), promote=False)

    def widen_ret(self, fn, t, line):
        old = norm(fn.ret)
        u = unify(old, t)
        if u is None:
            if t == 'nil':
                raise LangError(line, f'הפעולה "{fn.name}" נותנת {heb(old)} ובמקום אחר שום ערך (תן בלי ערך) — '
                                      f'אפשר "תן כלום" רק כשהיא נותנת טקסט, רשימה, מילון או מבנה')
            raise LangError(line, f'הפעולה "{fn.name}" נותנת פעם {heb(old)} ופעם {heb(t)}')
        if norm(u) != old:
            fn.ret = u
            return True
        return False

    def infer_stmt(self, s, fn, declared, in_loop):
        k = s.kind
        if k == 'assign':
            t = self.typeof(s.val, fn, declared)
            ch = self.set_var(s.name, t, fn, s.line)
            declared.add(s.name)
            return ch
        if k == 'setattr' and self.operand(s.target.obj, fn, declared) == 'py':
            self.py_arg(s.val.b if s.aug else s.val, fn, declared)
            return False
        if k == 'setattr':
            ft = self.typeof(s.target, fn, declared)
            self.slot_t = ft
            vt = self.typeof(s.val, fn, declared)
            if vt == 'none' or not accepts(ft, vt):
                tip = ' (אם צריך שברים, הגדר את השדה כ-שבר)' if (ft, vt) == ('int', 'float') else ''
                raise LangError(s.line, f'השדה "{s.target.name}" הוא {heb(ft)} — אי אפשר לשים בו {heb(vt)}{tip}')
            return False
        if k == 'setindex':
            ot = self.operand(s.target.obj, fn, declared)
            if ot == 'py':
                self.py_arg(s.target.idx, fn, declared)
                self.slot_t = 'py'
                if s.aug:
                    self.py_arg(s.val.b, fn, declared)
                else:
                    self.py_arg(s.val, fn, declared)
                return False
            if is_dict(ot):
                self.dict_key(ot, self.operand(s.target.idx, fn, declared), s.line)
                self.slot_t = dval(ot)
                self.aug_hint(s, fn, declared)
                vt = self.typeof(s.val, fn, declared)
                if vt == 'none':
                    raise LangError(s.line, 'הפעולה הזאת לא נותנת ערך, אז אין מה לשים במילון')
                if not accepts(dval(ot), vt):
                    tip = ' (אם צריך שברים, התחל עם שבר, למשל 0.0)' if (dval(ot), vt) == ('int', 'float') else ''
                    raise LangError(s.line, f'הערכים במילון הזה הם {heb(dval(ot))} — אי אפשר לשים {heb(vt)}{tip}')
                return False
            if ot == 'text':
                raise LangError(s.line, 'אי אפשר לשנות אות בתוך טקסט — טקסט לא משתנה. בנה טקסט חדש')
            if not is_list(ot):
                self.typeof(s.target, fn, declared)     # ההודעה הרגילה על [..]
            if self.operand(s.target.idx, fn, declared) != 'int':
                self.typeof(s.target, fn, declared)
            self.slot_t = elem(ot)
            self.aug_hint(s, fn, declared)
            vt = self.typeof(s.val, fn, declared)
            if vt == 'none':
                raise LangError(s.line, 'הפעולה הזאת לא נותנת ערך, אז אין מה לשים ברשימה')
            tt = elem(ot)        # גם אם הסוג עוד לא ידוע — הערך הזה קובע אותו
            if not accepts(tt, vt):
                raise LangError(s.line, f'במקום הזה ברשימה יש {heb(tt)} — אי אפשר לשים {heb(vt)}')
            return False
        if k == 'expr':
            self.typeof(s.e, fn, declared)
            return False
        if k == 'import':
            return self.set_var(s.name, 'py', fn, s.line)
        if k == 'try':
            ch = self.infer_body(s.body, fn, declared, in_loop)
            if s.errname:
                ch |= self.set_var(s.errname, 'text', fn, s.line)
            return ch | self.infer_body(s.handler, fn, declared, in_loop)
        if k in ('if', 'while'):
            conds = [c for c, _ in s.branches] if k == 'if' else [s.cond]
            for c in conds:
                t = self.operand(c, fn, declared)
                if t != 'bool' and t != 'py':
                    raise LangError(c.line, f'תנאי צריך להיות נכון/לא נכון (למשל x > 5), לא {heb(t)}')
            ch = False
            for b in sub_bodies(s):
                ch |= self.infer_body(b, fn, declared, in_loop + (k == 'while'))
            return ch
        if k == 'for':
            it = s.it
            if it.kind == 'call' and it.name == 'ספירה':
                if not 1 <= len(it.args) <= 3:
                    raise LangError(it.line, '"ספירה" מקבלת 1 עד 3 מספרים: ספירה(עד) / ספירה(מ, עד) / ספירה(מ, עד, קפיצה)')
                for a in it.args:
                    if self.typeof(a, fn, declared) != 'int':
                        raise LangError(a.line, '"ספירה" עובדת עם מספרים שלמים')
                vt = 'int'
            else:
                t = self.operand(it, fn, declared)
                if t == 'text':
                    vt = 'text'
                elif is_list(t):
                    vt = elem(t)
                elif is_dict(t):
                    vt = dkey(t)
                elif t == 'py':
                    vt = 'py'
                else:
                    raise LangError(it.line, f'"לכל" עובר על ספירה(...), על רשימה, על מילון או על אותיות של טקסט — לא על {heb(t)}')
            ch = self.set_var(s.var, vt, fn, s.line)
            declared.add(s.var)
            return ch | self.infer_body(s.body, fn, declared, in_loop + 1)
        if k in ('break', 'continue'):
            if not in_loop:
                raise LangError(s.line, f'"{"עצור" if k == "break" else "הבא"}" עובד רק בתוך לולאה')
            return False
        if k == 'pass':
            return False
        if k == 'return':
            if fn is None:
                raise LangError(s.line, '"תן" עובד רק בתוך פעולה')
            if s.val is None:
                # "תן" בלי ערך: הסוג נקבע לפי שאר ה"תן" — אם יש כאלה עם ערך, זה כמו "תן כלום" (כמו Python)
                if not fn.bare:
                    fn.bare = True
                    if fn.ret is not None and not is_opt(fn.ret):
                        return self.widen_ret(fn, 'nil', s.line)
                return False
            t = self.typeof(s.val, fn, declared)
            if t == 'nil':
                t = 'opt:' + new_var()
            if fn.bare:
                u = unify(t, 'nil')
                if u is None:
                    raise LangError(s.line, f'הפעולה "{fn.name}" נותנת פעם {heb(t)} ופעם שום ערך (תן בלי ערך) — '
                                            f'אפשר "תן כלום" רק כשהיא נותנת טקסט, רשימה, מילון או מבנה')
                t = u
            if fn.ret is None:
                fn.ret = t
                return True
            return self.widen_ret(fn, t, s.line)
        raise LangError(s.line, 'פקודה לא מוכרת')

    def infer(self):
        for rnd in range(2):
            for _ in range(200):
                CHANGED[0] = False
                ch = False
                for f in self.all_funcs():
                    ch |= self.infer_body(f.node.body, f, set(f.params))
                ch |= self.infer_body(self.top, None, set())
                if not ch and not CHANGED[0]:
                    break
            # פעולה שכל ה"תן" שלה תלויים רק בעצמה (למשל תן f(n-1) + 1, והיציאה היא בשגיאה) — מנחשים מספר, ובודקים שוב
            if rnd == 0:
                for f in self.all_funcs():
                    if f.ret is None and self.has_return(f.node.body):
                        f.ret = new_var()
            # משבצת שאף אחד לא מילא (רשימה שנשארה ריקה, פעולה שלא נקראה): סוג האיברים לא משנה — קובעים מספר
            for v in TV:
                if TV[v] is None:
                    TV[v] = 'int'
        for f in self.all_funcs():
            if f.ret is None:
                if not self.has_return(f.node.body):
                    f.ret = 'none'
                else:
                    raise LangError(f.node.line, f'לא הצלחתי להבין מה הפעולה "{f.name}" נותנת — ודא שיש לה "תן" עם ערך שלא תלוי רק בעצמה')
        # רשימה שנשארה ריקה לתמיד: סוג האיברים לא משנה — קובעים מספר
        for tbl in [self.globals_] + [f.locals_ for f in self.all_funcs()]:
            for n in tbl:
                tbl[n] = resolved(tbl[n])
        for f in self.all_funcs():
            f.ret = resolved(f.ret)
            f.params = {p: resolved(t) for p, t in f.params.items()}

    # --- האם למשתנה כבר יש ערך? (בכל מסלול אפשרי של התוכנית)
    # da = משתנים שבטוח קיבלו ערך; ma = משתנים שאולי קיבלו ערך.
    # קריאה של משתנה שבטוח אין לו ערך — שגיאה עוד לפני ההרצה.
    # קריאה של משתנה שאולי אין לו ערך — בדיקה בזמן ריצה (Python נותן אז NameError; אנחנו לא נותנים 0 בשקט).
    def flow(self):
        self.checked = set()        # (פעולה או None, שם) שצריכים דגל "קיבל ערך"
        self.flow_body(self.top, None, set(), set())
        for f in self.all_funcs():
            self.flow_body(f.node.body, f, set(f.params), set(f.params))

    def is_local(self, name, fn):
        return fn is not None and (name in fn.params or name in fn.assigned)

    def flow_expr(self, e, fn, da, ma):
        if e is None:
            return
        if isinstance(e, list):
            for x in e:
                self.flow_expr(x, fn, da, ma)
            return
        if e.kind == 'call' and e.name not in self.funcs and e.name not in self.structs \
                and (self.is_local(e.name, fn) or e.name in self.globals_):
            e.fvar = Node('var', e.line, name=e.name)        # קריאה לערך של Python שנמצא במשתנה
            self.flow_expr(e.fvar, fn, da, ma)
        if e.kind == 'var' and e.name in self.funcs and not self.is_local(e.name, fn) and e.name not in self.globals_:
            return                                  # שם של פעולה (במקביל(חשב, ...))
        if e.kind == 'var':
            if fn is not None and not self.is_local(e.name, fn):
                if e.name in self.globals_:          # משתנה של כל התוכנית, נקרא מתוך פעולה: אולי עוד לא קיבל ערך
                    e.check = (None, e.name)
                    self.checked.add(e.check)
                return
            if e.name not in ma:
                raise LangError(e.line, f'המשתנה "{e.name}" משמש לפני שקיבל ערך')
            if e.name not in da:
                e.check = (fn.name if fn else None, e.name)
                self.checked.add(e.check)
            return
        for key, v in e.__dict__.items():
            if key == 'kwargs':
                self.flow_expr([x for kn, x in v if not (kn == 'לפי' and x.kind == 'var' and x.name in self.funcs)], fn, da, ma)
            elif isinstance(v, Node) or (isinstance(v, list) and v and isinstance(v[0], Node)):
                self.flow_expr(v, fn, da, ma)

    def flow_body(self, body, fn, da, ma):
        """מחזיר (da, ma, נגמר) — נגמר = הבלוק תמיד יוצא ב-תן/עצור/הבא"""
        da, ma, ended = set(da), set(ma), False
        for s in body:
            k = s.kind
            if k == 'assign':
                self.flow_expr(s.val, fn, da, ma)
                da.add(s.name); ma.add(s.name)
            elif k == 'import':
                da.add(s.name); ma.add(s.name)
            elif k in ('setindex', 'setattr'):
                self.flow_expr([s.val, s.target], fn, da, ma)
            elif k == 'expr':
                self.flow_expr(s.e, fn, da, ma)
            elif k == 'return':
                self.flow_expr(s.val, fn, da, ma)
                ended = True
            elif k in ('break', 'continue'):
                ended = True
            elif k == 'if':
                outs = []
                for c, b in s.branches:
                    self.flow_expr(c, fn, da, ma)
                    outs.append(self.flow_body(b, fn, da, ma))
                outs.append(self.flow_body(s.orelse, fn, da, ma) if s.orelse else (da, ma, False))
                live = [o for o in outs if not o[2]]
                for o in outs:
                    ma |= o[1]
                if live:
                    da = set.intersection(*[o[0] for o in live])
                else:
                    ended = True
            elif k == 'try':
                b_da, b_ma, b_end = self.flow_body(s.body, fn, da, ma)
                h_in = {s.errname} if s.errname else set()
                # "אם נכשל" יכול להתחיל מכל נקודה בתוך "נסה" — מה שאולי כבר קרה שם, אולי קרה
                h_da, h_ma, h_end = self.flow_body(s.handler, fn, da | h_in, ma | assigned_names(s.body, set()) | h_in)
                ma = ma | b_ma | h_ma
                live = [x for x, e_ in ((b_da, b_end), (h_da, h_end)) if not e_]
                if live:
                    da = set.intersection(*live)
                else:
                    ended = True
            elif k in ('while', 'for'):
                loop_ma = ma | assigned_names(s.body, set()) | ({s.var} if k == 'for' else set())
                if k == 'while':
                    self.flow_expr(s.cond, fn, da, loop_ma)
                    self.flow_body(s.body, fn, da, loop_ma)
                else:
                    self.flow_expr(s.it, fn, da, ma)
                    self.flow_body(s.body, fn, da | {s.var}, loop_ma)
                ma = loop_ma
        return da, ma, ended

    def has_return(self, body):
        for s in body:
            if s.kind == 'return' and s.val is not None:
                return True
            if any(self.has_return(b) for b in sub_bodies(s)):
                return True
        return False

    # --- כתיבת C
    def cname(self, name, fn):
        if fn is not None and (name in fn.params or name in fn.assigned):
            return mangle('l', name)
        return mangle('g', name)

    def var_type(self, name, fn):
        if fn is not None:
            if name in fn.params:
                return resolved(fn.params[name])
            if name in fn.assigned:
                return resolved(fn.locals_[name])
        return resolved(self.globals_[name])

    @staticmethod
    def flag(key):
        return mangle('gs' if key[0] is None else 'ls', key[1])

    def set_flag(self, name, fn):
        key = (fn.name if self.is_local(name, fn) else None, name)
        return f' {self.flag(key)} = true;' if key in self.checked else ''

    def conv(self, code, frm, to):
        if frm is not None and to is not None and (is_opt(frm) or norm(frm) == 'nil') and not is_opt(to) and norm(to) != 'nil':
            return self.nn(code, self.cur_line)   # כלום שנכנס למקום שצריך ערך — שגיאה בזמן ריצה, לא NULL בשקט
        return f'(double)({code})' if frm == 'int' and to == 'float' else code

    def topy(self, code, t, L):
        """C שהופך ערך שלנו לערך של Python (הפניה חדשה)"""
        t = resolved(t)
        self.uses_py = True
        if t == 'nil':
            return 'Py_NewRef(Py_None)'
        if is_opt(t):
            return f'({{ __auto_type _x = {code}; _x ? {self.topy("_x", obase(t), L)} : Py_NewRef(Py_None); }})'
        if t in ('int', 'float', 'text', 'bool', 'py'):
            return f'pd_topy_{ {"int": "i", "float": "f", "text": "s", "bool": "b", "py": "py"}[t] }({code}, {L})'
        if is_list(t):
            return f'pd_topy_list({code}, {self.topyv(elem(t))}, {L})'
        if is_dict(t):
            return f'pd_topy_dict({code}, {self.topyv(dkey(t))}, {self.topyv(dval(t))}, {L})'
        raise LangError(L, f'אי אפשר להעביר ל-Python {heb(t)}')

    def topyv(self, t):
        """שם של פעולת C שהופכת pd_val מסוג t לערך של Python"""
        t = resolved(t)
        name = f'pd_topyv_{tid(t)}'
        if t not in self.py_helpers:
            self.py_helpers[t] = None
            body = self.topy(unbox('v', t), t, 'line')
            self.py_helpers[t] = f'static PyObject *{name}(pd_val v, int line) {{ return {body}; }}'
        return name

    def cbool(self, e, fn):
        """תנאי: נכון/לא נכון, או ערך של Python (לפי האמת שלו, כמו ב-Python)"""
        c = self.cexpr(e, fn)
        return f'pd_py_truth({c}, {e.line})' if self.ty(e, fn) == 'py' else c

    def py_call(self, f_code, args, kwargs, fn, L, first=None):
        """קריאה לפעולה של Python. first: קוד שמחושב לפני הכל (האובייקט של x.פעולה)"""
        self.uses_py = True
        n, nk = len(args), len(kwargs)
        parts = [f'pd_py *_f = {f_code};']
        parts.append(f'PyObject *_a[{max(n, 1)}]; const char *_kn[{max(nk, 1)}]; PyObject *_kv[{max(nk, 1)}];')
        for i, a in enumerate(args):
            parts.append(f'_a[{i}] = {self.topy(self.cexpr(a, fn), self.ty(a, fn), L)};')
        for i, (kn, v) in enumerate(kwargs):
            parts.append(f'_kn[{i}] = {c_str(kn)}; _kv[{i}] = {self.topy(self.cexpr(v, fn), self.ty(v, fn), L)};')
        parts.append(f'pd_py_call(_f, {n}, _a, {nk}, _kn, _kv, {L});')
        return '({ ' + ' '.join(parts) + ' })'

    @staticmethod
    def nn(code, line):
        return f'pd_nn({code}, {line})'

    def ty(self, e, fn):
        return resolved(self.typeof(e, fn, None))

    def raw_ty(self, e, fn):
        """הסוג לפני הבדיקה-שאינו-כלום"""
        return resolved(norm(self._typeof(e, fn, None)))

    def need_helpers(self, t):
        t = resolved(t)
        if t not in self.helpers:
            self.helpers.add(t)
            if is_list(t):
                self.need_helpers(elem(t))
            if is_dict(t):
                self.need_helpers(dkey(t))
                self.need_helpers(dval(t))
            if is_obj(t):
                for ft in self.structs[oname(t)].fields.values():
                    self.need_helpers(ft)
            if is_opt(t):
                self.need_helpers(obase(t))

    def to_text(self, code, t):
        t = resolved(t)
        if t == 'py':
            return f'pd_py_str({code}, {self.cur_line})'
        if t == 'nil':
            return f'((void)({code}), "כלום")'
        if is_opt(t):
            return f'({{ __auto_type _o = {code}; _o ? {self.to_text("_o", obase(t))} : "כלום"; }})'
        if is_ref(t):
            self.need_helpers(t)
            return f'pd_str_{tid(t)}(pd_vp({code}))'
        return {'int': f'pd_int_to_text({code})', 'float': f'pd_float_to_text({code})',
                'text': code, 'bool': f'pd_bool_to_text({code})'}[t]

    def seq(self, nodes, codes, force=False):
        """ב-C אין סדר מובטח בין חלקי ביטוי; ב-Python יש — משמאל לימין.
        כששני חלקים או יותר אינם קבועים, מחשבים אותם לפי הסדר לתוך משתנים זמניים."""
        idx = [i for i, x in enumerate(nodes) if x.kind not in ('int', 'float', 'str', 'bool', 'nil')]
        if len(idx) < (1 if force else 2):
            return '', list(codes)
        self.tmp += 1
        n = self.tmp
        decl = ' '.join(f'__auto_type _q{n}_{i} = {codes[i]};' for i in idx)
        return decl, [f'_q{n}_{i}' if i in idx else c for i, c in enumerate(codes)]

    @staticmethod
    def wrap(decl, code):
        return f'({{ {decl} {code}; }})' if decl else code

    def cexpr(self, e, fn):
        code = self._cexpr(e, fn)
        if getattr(e, 'unwrap', False) and is_opt(self.raw_ty(e, fn)):
            return self.nn(code, e.line)
        return code

    def _cexpr(self, e, fn):
        k, L = e.kind, e.line
        t = self.ty(e, fn)
        if k == 'nil':
            return 'NULL'
        if k == 'int':
            return f'INT64_C({e.val})'
        if k == 'float':
            return repr(float(e.val))
        if k == 'str':
            return c_str(e.val)
        if k == 'bool':
            return 'true' if e.val else 'false'
        if k == 'var':
            c = self.cname(e.name, fn)
            chk = getattr(e, 'check', None)
            if chk:
                msg = c_str(f'המשתנה "{e.name}" עוד לא קיבל ערך')
                return f'({self.flag(chk)} ? {c} : (pd_die({L}, {msg}), {c}))'
            return c
        if k == 'list':
            et = elem(t)
            parts = [f'pd_list_push(_l, {box(self.conv(self.cexpr(x, fn), self.ty(x, fn), et), et)});' for x in e.items]
            return f'({{ pd_list *_l = pd_list_new({max(len(e.items), 4)}); {" ".join(parts)} _l; }})'
        if k == 'slotref':
            return '_cur'
        if k == 'attr':
            if self.ty(e.obj, fn) == 'py':
                return f'pd_py_getattr({self.cexpr(e.obj, fn)}, {c_str(e.name)}, {L})'
            return f'(({self.cexpr(e.obj, fn)})->{mangle("f", e.name)})'
        if k == 'dict':
            kt, vt = dkey(t), dval(t)
            parts = [f'{{ pd_val _k = {box(self.cexpr(x, fn), kt)}; pd_val _v = {box(self.conv(self.cexpr(y, fn), self.ty(y, fn), vt), vt)}; '
                     f'pd_dict_set(_d, _k, _v); }}' for x, y in zip(e.keys, e.vals)]
            return f'({{ pd_dict *_d = {new_of(t)}; {" ".join(parts)} _d; }})'
        if k == 'slice':
            ot = self.ty(e.obj, fn)
            has = sum(b for x, b in ((e.a, 1), (e.b, 2), (e.step, 4)) if x is not None)
            vals = ' '.join(f'int64_t _{nm} = {self.cexpr(x, fn) if x is not None else "0"};'
                            for nm, x in (('a', e.a), ('b', e.b), ('s', e.step)))
            if ot == 'text':
                return f'({{ const char *_o = {self.cexpr(e.obj, fn)}; {vals} pd_text_slice(_o, {has}, _a, _b, _s, {L}); }})'
            return f'({{ pd_list *_o = {self.cexpr(e.obj, fn)}; {vals} pd_list_slice(_o, {has}, _a, _b, _s, {L}); }})'
        if k == 'index' and self.ty(e.obj, fn) == 'py':
            return (f'({{ pd_py *_o = {self.cexpr(e.obj, fn)}; PyObject *_k = {self.topy(self.cexpr(e.idx, fn), self.ty(e.idx, fn), L)}; '
                    f'pd_py_getitem(_o, _k, {L}); }})')
        if k == 'index':
            ot = self.ty(e.obj, fn)
            o, i = self.cexpr(e.obj, fn), self.cexpr(e.idx, fn)
            if is_dict(ot):
                return unbox(f'({{ pd_dict *_o = {o}; pd_val _k = {box(i, dkey(ot))}; pd_dict_get(_o, _k, {L}); }})', t)
            decl, (o, i) = self.seq([e.obj, e.idx], [o, i])
            if ot == 'text':
                return self.wrap(decl, f'pd_text_at({o}, {i}, {L})')
            return self.wrap(decl, unbox(f'pd_list_get({o}, {i}, {L})', t))
        if k == 'method':
            ot = self.ty(e.obj, fn)
            o = self.cexpr(e.obj, fn)
            if ot == 'py':
                return self.py_call(f'pd_py_getattr({o}, {c_str(e.name)}, {L})', e.args, e.kwargs, fn, L)
            if is_obj(ot):
                m = self.structs[oname(ot)].methods[e.name]
                decl, cs = self.seq([e.obj] + e.args, [o] + [self.cexpr(a, fn) for a in e.args], force=len(e.args) > 0)
                cargs = [cs[0]] + [self.conv(c, self.ty(a, fn), m.params[pn]) for c, a, pn in zip(cs[1:], e.args, m.order[1:])]
                return self.wrap(decl, f'{m.cfunc}({", ".join(cargs)})')
            if ot == 'text':
                decl, cs = self.seq([e.obj] + e.args, [o] + [self.cexpr(a, fn) for a in e.args])
                o, a = cs[0], cs[1:]
                c = {'פצל': lambda: f'pd_text_split({o}, {a[0] if a else "NULL"}, {L})',
                     'חבר': lambda: f'pd_text_join({o}, {a[0]})',
                     'החלף': lambda: f'pd_text_replace({o}, {a[0]}, {a[1]})',
                     'נקה': lambda: f'pd_text_strip({o}, {a[0] if a else "NULL"})',
                     'גדולות': lambda: f'pd_text_case({o}, true)',
                     'קטנות': lambda: f'pd_text_case({o}, false)',
                     'מתחיל_ב': lambda: f'pd_text_starts({o}, {a[0]})',
                     'נגמר_ב': lambda: f'pd_text_ends({o}, {a[0]})',
                     'מצא': lambda: f'pd_text_find({o}, {a[0]})',
                     'ספור': lambda: f'pd_text_count({o}, {a[0]})',
                     'שורות': lambda: f'pd_text_lines({o})'}[e.name]()
                return self.wrap(decl, c)
            if is_dict(ot):
                kc = box(self.cexpr(e.args[0], fn), dkey(ot))
                if e.name == 'הוצא':
                    return unbox(f'({{ pd_dict *_o = {o}; pd_val _k = {kc}; pd_dict_pop(_o, _k, {L}); }})', t)
                if len(e.args) == 1:
                    return unbox(f'({{ pd_dict *_o = {o}; pd_val _k = {kc}; pd_dict_get_or(_o, _k, pd_vp(NULL)); }})', t)
                a = e.args[1]
                dc = box(self.conv(self.cexpr(a, fn), self.ty(a, fn), t), t)
                return unbox(f'({{ pd_dict *_o = {o}; pd_val _k = {kc}; pd_val _f = {dc}; pd_dict_get_or(_o, _k, _f); }})', t)
            if e.name == 'הוסף':
                et = elem(ot)
                a = e.args[0]
                decl, (o, ac) = self.seq([e.obj, a], [o, self.cexpr(a, fn)])
                return self.wrap(decl, f'pd_list_push({o}, {box(self.conv(ac, self.ty(a, fn), et), et)})')
            return unbox(f'pd_list_pop({o}, {L})', t)
        if k == 'member' and self.ty(e.b, fn) == 'py':
            r = (f'({{ PyObject *_x = {self.topy(self.cexpr(e.a, fn), self.ty(e.a, fn), L)}; '
                 f'pd_py_contains({self.cexpr(e.b, fn)}, _x, {L}); }})')
            return f'(!{r})' if e.neg else r
        if k == 'member':
            at, bt = self.ty(e.a, fn), self.ty(e.b, fn)
            decl, (a, b) = self.seq([e.a, e.b], [self.cexpr(e.a, fn), self.cexpr(e.b, fn)])
            if bt == 'text':
                r = f'({{ const char *_x = {a}; pd_text_contains({b}, _x); }})'
            elif is_dict(bt):
                r = f'({{ pd_val _x = {box(a, dkey(bt))}; pd_dict_has({b}, _x); }})'
            else:
                et = elem(bt)
                self.need_helpers(et)
                r = f'pd_in_{tid(et)}({b}, {box(self.conv(a, at, et), et)})'
            r = self.wrap(decl, r)
            return f'(!{r})' if e.neg else r
        if k == 'neg' and self.ty(e.a, fn) == 'py':
            return f'pd_py_neg({self.cexpr(e.a, fn)}, {L})'
        if k == 'neg':
            a = self.cexpr(e.a, fn)
            return f'pd_neg({a}, {L})' if t == 'int' else f'(-({a}))'
        if k == 'not':
            return f'(!({self.cbool(e.a, fn)}))'
        if k == 'logic':
            op = '&&' if e.op == 'and' else '||'
            return f'(({self.cbool(e.a, fn)}) {op} ({self.cbool(e.b, fn)}))'
        if k == 'cmp' and 'py' in (self.ty(e.a, fn), self.ty(e.b, fn)):
            opn = {'==': 'Py_EQ', '!=': 'Py_NE', '<': 'Py_LT', '<=': 'Py_LE', '>': 'Py_GT', '>=': 'Py_GE'}[e.op]
            return (f'({{ PyObject *_x = {self.topy(self.cexpr(e.a, fn), self.ty(e.a, fn), L)}; '
                    f'PyObject *_y = {self.topy(self.cexpr(e.b, fn), self.ty(e.b, fn), L)}; pd_py_cmp({opn}, _x, _y, {L}); }})')
        if k == 'cmp':
            ta, tb = self.ty(e.a, fn), self.ty(e.b, fn)
            decl, (a, b) = self.seq([e.a, e.b], [self.cexpr(e.a, fn), self.cexpr(e.b, fn)])
            if e.op in ('==', '!=') and ('nil' in (ta, tb) or is_opt(ta) or is_opt(tb)):
                if 'nil' in (ta, tb):
                    r = f'((const void *)({b if ta == "nil" else a}) == NULL)' if ta != tb else '1'
                else:
                    ot = ta if is_opt(ta) else 'opt:' + ta
                    self.need_helpers(ot)
                    r = f'pd_eqv_{tid(ot)}({box(a, ta)}, {box(b, tb)})'
                return self.wrap(decl, r if e.op == '==' else f'(!{r})')
            if is_ref(ta):
                self.need_helpers(ta)
                r = f'pd_eqv_{tid(ta)}(pd_vp({a}), pd_vp({b}))'
                return self.wrap(decl, r if e.op == '==' else f'(!{r})')
            if ta == 'text':
                return self.wrap(decl, f'(strcmp({a}, {b}) {e.op} 0)')
            if 'float' in (ta, tb):
                a, b = self.conv(a, ta, 'float'), self.conv(b, tb, 'float')
            return self.wrap(decl, f'(({a}) {e.op} ({b}))')
        if k == 'bin' and t == 'py':
            opc = {'+': '+', '-': '-', '*': '*', '/': '/', '//': 'f', '%': '%'}[e.op]
            return (f'({{ PyObject *_x = {self.topy(self.cexpr(e.a, fn), self.ty(e.a, fn), L)}; '
                    f'PyObject *_y = {self.topy(self.cexpr(e.b, fn), self.ty(e.b, fn), L)}; pd_py_binop({opc!r}, _x, _y, {L}); }})')
        if k == 'bin':
            ta, tb = self.ty(e.a, fn), self.ty(e.b, fn)
            decl, (a, b) = self.seq([e.a, e.b], [self.cexpr(e.a, fn), self.cexpr(e.b, fn)])
            if t == 'text' and e.op == '*':
                r = f'pd_text_repeat({a}, {b}, {L})' if ta == 'text' else f'pd_text_repeat({b}, {a}, {L})'
            elif is_list(t) and e.op == '*':
                r = f'pd_list_repeat({a}, {b}, {L})' if is_list(ta) else f'pd_list_repeat({b}, {a}, {L})'
            elif t == 'text':
                r = f'pd_concat({a}, {b})'
            elif is_list(t):
                r = f'pd_list_concat({a}, {b})'
            elif e.op == '/':
                r = f'pd_fdiv({self.conv(a, ta, "float")}, {self.conv(b, tb, "float")}, {L})'
            elif t == 'int':
                fnm = {'+': 'pd_add', '-': 'pd_sub', '*': 'pd_mul', '//': 'pd_floordiv', '%': 'pd_mod'}[e.op]
                r = f'{fnm}({a}, {b}, {L})'
            else:
                a, b = self.conv(a, ta, 'float'), self.conv(b, tb, 'float')
                r = f'pd_fcheck(({a}) {e.op} ({b}), {L})'
            return self.wrap(decl, r)
        if k == 'call' and e.name in self.structs:
            st, got = self.ctor_fields(e)
            written = list(e.args) + [v for _, v in e.kwargs]           # כמו Python: לפי הסדר שבו נכתבו
            decl, cs = self.seq(written, [self.cexpr(a, fn) for a in written], force=True)
            code = dict(zip([id(a) for a in written], cs))
            sets = []
            for nm, ft in st.fields.items():
                if nm in got:
                    a = got[nm]
                    v = self.conv(code[id(a)], self.ty(a, fn), ft)
                else:
                    v = self.conv(self.cexpr(st.defaults[nm], fn), self.ty(st.defaults[nm], fn), ft)
                sets.append(f'_s->{mangle("f", nm)} = {v};')
            return (f'({{ {decl} struct {sname(st.name)} *_s = pd_alloc(sizeof *_s); '
                    f'{" ".join(sets)} _s; }})')
        if k == 'call':
            return self.ccall(e, fn, t)
        raise LangError(L, 'ביטוי לא מוכר')

    def csort(self, e, fn, t):
        n, L = e.name, e.line
        kinds = dict(e.kwargs)
        lt = self.ty(e.args[0], fn)
        et = dkey(lt) if is_dict(lt) else elem(lt)
        kt = e.key_t
        cmp = {'int': 'pd_cmp_i', 'float': 'pd_cmp_f', 'text': 'pd_cmp_s', 'bool': 'pd_cmp_b'}[kt]
        written = [e.args[0]] + [v for kn, v in e.kwargs if kn == 'הפוך']
        decl, cs = self.seq(written, [self.cexpr(x, fn) for x in written], force=True)
        src = f'pd_dict_keys({cs[0]})' if is_dict(lt) else cs[0]
        rev = cs[1] if len(cs) > 1 else 'false'
        if 'לפי' in kinds:
            f = self.funcs[kinds['לפי'].name]
            arg = self.conv(unbox('_l->a[_i]', et), et, f.params[f.order[0]])
            keys = (f'pd_list *_ks = pd_list_new(_l->len); for (int64_t _i = 0; _i < _l->len; _i++) '
                    f'pd_list_push(_ks, {box(f"{f.cfunc}({arg})", kt)});')
        else:
            keys = 'pd_list *_ks = _l;'
        if n == 'מסודר':
            return f'({{ {decl} pd_list *_l = {src}; {keys} pd_sorted_by(_l, _ks, {cmp}, {rev}); }})'
        d = 1 if n == 'הגדול' else -1
        return unbox(f'({{ {decl} pd_list *_l = {src}; {keys} pd_best_by(_l, _ks, {cmp}, {d}, "{n}", {L}); }})', t)

    def ser(self, t):
        """שם של פעולת C שכותבת ערך מסוג t לבתים (בשביל במקביל)"""
        t = resolved(t)
        name = f'pd_ser_{tid(t)}'
        if t in self.ser_helpers:
            return name
        self.ser_helpers[t] = None
        if t == 'int': body = 'pd_wr_i(b, v.i);'
        elif t == 'float': body = 'pd_wr_f(b, v.f);'
        elif t == 'bool': body = 'char c = v.b; pd_sb_addn(b, &c, 1);'
        elif t == 'text': body = 'pd_wr_s(b, v.s);'
        elif t == 'nil': body = ''
        elif is_opt(t): body = f'char c = v.p != NULL; pd_sb_addn(b, &c, 1); if (c) {self.ser(obase(t))}(b, v);'
        elif is_list(t): body = f'pd_list *l = v.p; pd_wr_i(b, l->len); for (int64_t i = 0; i < l->len; i++) {self.ser(elem(t))}(b, l->a[i]);'
        elif is_dict(t):
            body = (f'pd_dict *d = v.p; pd_wr_i(b, d->len); for (int64_t e = 0; e < d->n; e++) if (!d->dead[e]) '
                    f'{{ {self.ser(dkey(t))}(b, d->k[e]); {self.ser(dval(t))}(b, d->v[e]); }}')
        elif is_obj(t):
            st = self.structs[oname(t)]
            body = f'{ctype(t)} o = v.p; ' + ' '.join(f'{self.ser(ft)}(b, {box("o->" + mangle("f", nm), ft)});' for nm, ft in st.fields.items())
        else:
            raise LangError(self.cur_line, f'אי אפשר להחזיר {heb(t)} מ"במקביל"')
        self.ser_helpers[t] = f'static void {name}(pd_sb *b, pd_val v) {{ {body} }}'
        self.de(t)
        return name

    def de(self, t):
        t = resolved(t)
        name = f'pd_de_{tid(t)}'
        if t in self.de_helpers:
            return name
        self.de_helpers[t] = None
        if t == 'int': body = 'return pd_vi(pd_rd_i(p));'
        elif t == 'float': body = 'return pd_vf(pd_rd_f(p));'
        elif t == 'bool': body = 'return pd_vb(*(*p)++ != 0);'
        elif t == 'text': body = 'return pd_vs(pd_rd_s(p));'
        elif t == 'nil': body = 'return pd_vp(NULL);'
        elif is_opt(t): body = f'if (!*(*p)++) return pd_vp(NULL); return {self.de(obase(t))}(p);'
        elif is_list(t): body = f'int64_t n = pd_rd_i(p); pd_list *l = pd_list_new(n); for (int64_t i = 0; i < n; i++) pd_list_push(l, {self.de(elem(t))}(p)); return pd_vp(l);'
        elif is_dict(t):
            body = (f'int64_t n = pd_rd_i(p); pd_dict *d = {new_of(t)}; for (int64_t i = 0; i < n; i++) '
                    f'{{ pd_val k = {self.de(dkey(t))}(p); pd_val v = {self.de(dval(t))}(p); pd_dict_set(d, k, v); }} return pd_vp(d);')
        elif is_obj(t):
            st = self.structs[oname(t)]
            body = (f'{ctype(t)} o = pd_alloc(sizeof *o); '
                    + ' '.join(f'o->{mangle("f", nm)} = {unbox(self.de(ft) + "(p)", ft)};' for nm, ft in st.fields.items())
                    + ' return pd_vp(o);')
        self.de_helpers[t] = f'static pd_val {name}(const char **p) {{ {body} }}'
        return name

    def cparallel(self, e, fn, t):
        f = self.funcs[e.args[0].name]
        et, rt = elem(self.ty(e.args[1], fn)), elem(t)
        self.tmp += 1
        wname = f'pd_work_{self.tmp}'
        arg = self.conv(unbox('in->a[i]', et), et, f.params[f.order[0]])
        self.work_fns.append(f'static void {wname}(pd_list *in, int64_t i, pd_sb *out) {{ '
                             f'{self.ser(rt)}(out, {box(f"{f.cfunc}({arg})", rt)}); }}')
        workers = next((v for kn, v in e.kwargs if kn == 'עובדים'), None)
        decl, cs = self.seq([e.args[1]] + ([workers] if workers else []),
                            [self.cexpr(e.args[1], fn)] + ([self.cexpr(workers, fn)] if workers else []), force=True)
        wc = cs[1] if workers else '0'
        return self.wrap(decl, f'pd_parallel({cs[0]}, {wc}, {wname}, {self.de(rt)}, {e.line})')

    def ccall(self, e, fn, t):
        if e.name in UI_BUILTINS and e.name not in self.funcs:
            raise LangError(e.line, f'"{e.name}" בונה דף אינטרנט — זה עובד רק כשבונים אתר: python3 pashut.py קובץ.פשוט --אתר')
        if e.name == 'במקביל' and e.name not in self.funcs:
            return self.cparallel(e, fn, t)
        if self.is_py_var(e.name, fn):
            f = self.cexpr(e.fvar, fn) if hasattr(e, 'fvar') else self.cname(e.name, fn)
            return self.py_call(f, e.args, e.kwargs, fn, e.line)
        if e.kwargs:
            return self.csort(e, fn, t)
        decl, code = self.seq(e.args, [self.cexpr(a, fn) for a in e.args])
        return self.wrap(decl, self.ccall_(e, fn, t, code))

    def ccall_(self, e, fn, t, args):
        n, L = e.name, e.line
        if n in ('כמה', 'מספר', 'שבר', 'טקסט') and len(e.args) == 1 and self.ty(e.args[0], fn) == 'py':
            f = {'כמה': 'pd_py_len', 'מספר': 'pd_py_to_int', 'שבר': 'pd_py_to_float', 'טקסט': 'pd_py_str'}[n]
            return f'{f}({args[0]}, {L})'
        ts = [self.ty(a, fn) for a in e.args]
        if n == 'שאל':
            return f'pd_input({args[0] if args else chr(34) * 2}, {L})'
        if n == 'כמה':
            return f'pd_len({args[0]})' if ts[0] == 'text' else f'(({args[0]})->len)'
        if n == 'שגיאה':
            return f'pd_die({L}, {args[0]})'
        if n == 'אקראי':
            return 'pd_rand()'
        if n == 'זרע':
            return f'pd_seed({args[0]})'
        if n in ('אקספ', 'לוג', 'שורש'):
            f = {'אקספ': 'pd_exp', 'לוג': 'pd_log', 'שורש': 'pd_sqrt'}[n]
            return f'{f}({self.conv(args[0], ts[0], "float")}, {L})'
        if n == 'חזקה':
            return f'pd_pow({self.conv(args[0], ts[0], "float")}, {self.conv(args[1], ts[1], "float")}, {L})'
        if n == 'קוד_אות':
            return f'pd_ord({args[0]}, {L})'
        if n == 'אות_מקוד':
            return f'pd_chr({args[0]}, {L})'
        if n == 'קרא_קובץ':
            return f'pd_read_file({args[0]}, {L})'
        if n == 'כתוב_קובץ':
            return f'pd_write_file({args[0]}, {args[1]}, false, {L})'
        if n == 'הוסף_לקובץ':
            return f'pd_write_file({args[0]}, {args[1]}, true, {L})'
        if n == 'קיים_קובץ':
            return f'pd_file_exists({args[0]})'
        if n == 'ארגומנטים':
            return 'pd_list_copy(pd_args)'
        if n == 'עגל':
            if ts[0] == 'int':
                return args[0] if len(args) == 1 else f'({{ int64_t _r = {args[0]}; int64_t _n = {args[1]}; if (_n < 0) pd_die({L}, "\\"עגל\\" עם מספר ספרות שלילי עוד לא נתמך"); _r; }})'
            return f'pd_round0({args[0]}, {L})' if len(args) == 1 else f'pd_roundn({args[0]}, {args[1]}, {L})'
        if n == 'מפתחות':
            return f'pd_dict_keys({args[0]})'
        if n == 'ערכים':
            return f'pd_dict_values({args[0]})'
        if n == 'מספר':
            return {'int': args[0], 'float': f'pd_float_to_int({args[0]}, {L})',
                    'text': f'pd_text_to_int({args[0]}, {L})'}[ts[0]]
        if n == 'שבר':
            return {'int': f'(double)({args[0]})', 'float': args[0],
                    'text': f'pd_text_to_float({args[0]}, {L})'}[ts[0]]
        if n == 'טקסט':
            return self.to_text(args[0], ts[0])
        if n == 'חיובי':
            return f'pd_abs({args[0]}, {L})' if ts[0] == 'int' else f'fabs({args[0]})'
        if n == 'סכום':
            if t == 'int':
                return f'({{ pd_list *_l = {args[0]}; int64_t _s = 0; for (int64_t _i = 0; _i < _l->len; _i++) _s = pd_add(_s, _l->a[_i].i, {L}); _s; }})'
            return f'pd_fsum({args[0]}, {L})'
        if n in ('הגדול', 'הקטן'):
            better = '>' if n == 'הגדול' else '<'
            if len(args) == 1:
                x = unbox('_l->a[_i]', t)
                test = f'strcmp({x}, _m) {better} 0' if t == 'text' else f'{x} {better} _m'
                return (f'({{ pd_list *_l = {args[0]}; pd_list_need(_l, "{n}", {L}); {ctype(t)} _m = {unbox("_l->a[0]", t)}; '
                        f'for (int64_t _i = 1; _i < _l->len; _i++) if ({test}) _m = {x}; _m; }})')
            vals = [self.conv(a, at, t) for a, at in zip(args, ts)]
            body = f'{ctype(t)} _m = {vals[0]}; {ctype(t)} _x; '
            for v in vals[1:]:
                test = f'strcmp(_x, _m) {better} 0' if t == 'text' else f'_x {better} _m'
                body += f'_x = {v}; if ({test}) _m = _x; '
            return f'({{ {body}_m; }})'
        if n == 'מסודר':
            cmp = {'int': 'pd_cmp_i', 'float': 'pd_cmp_f', 'text': 'pd_cmp_s'}[elem(t)]
            src = f'pd_dict_keys({args[0]})' if is_dict(ts[0]) else args[0]
            return f'pd_sorted({src}, {cmp})'
        f = self.funcs[n]
        cargs = [self.conv(a, at, f.params[p]) for a, at, p in zip(args, ts, f.order)]
        return f'{f.cfunc}({", ".join(cargs)})'

    def emit_body(self, body, fn, out, ind):
        for s in body:
            self.emit_stmt(s, fn, out, ind)

    def tries_to(self, stop_at_loop):
        """כמה "נסה" פתוחים נעזוב אם נצא עכשיו (עד הלולאה הקרובה, או עד סוף הפעולה)"""
        n = 0
        for c in reversed(self.ctx):
            if c == 'loop' and stop_at_loop:
                break
            n += c == 'try'
        return n

    def emit_stmt(self, s, fn, out, ind):
        p = '    ' * ind
        k, L = s.kind, s.line
        self.cur_line = L
        if k == 'assign':
            target = self.var_type(s.name, fn)
            out.append(f'{p}{self.cname(s.name, fn)} = {self.conv(self.cexpr(s.val, fn), self.ty(s.val, fn), target)};{self.set_flag(s.name, fn)}')
        elif k == 'import':
            self.uses_py = True
            out.append(f'{p}{self.cname(s.name, fn)} = pd_py_import({c_str(s.full)}, {c_str(s.name)}, {L});{self.set_flag(s.name, fn)}')
        elif k == 'setattr' and self.ty(s.target.obj, fn) == 'py':
            o, nm = self.cexpr(s.target.obj, fn), c_str(s.target.name)
            if s.aug:
                opc = {'+': '+', '-': '-', '*': '*'}[s.val.op]
                b = self.topy(self.cexpr(s.val.b, fn), self.ty(s.val.b, fn), L)
                out.append(f'{p}{{ pd_py *_o = {o}; PyObject *_c = pd_py_ref(pd_py_getattr(_o, {nm}, {L})); PyObject *_b = {b}; '
                           f'pd_py_setattr(_o, {nm}, pd_py_ref(pd_py_binop({opc!r}, _c, _b, {L})), {L}); }}')
            else:
                v = self.topy(self.cexpr(s.val, fn), self.ty(s.val, fn), L)
                out.append(f'{p}{{ PyObject *_v = {v}; pd_py *_o = {o}; pd_py_setattr(_o, {nm}, _v, {L}); }}')
        elif k == 'setindex' and self.ty(s.target.obj, fn) == 'py':
            o = self.cexpr(s.target.obj, fn)
            kc = self.topy(self.cexpr(s.target.idx, fn), self.ty(s.target.idx, fn), L)
            if s.aug:
                opc = {'+': '+', '-': '-', '*': '*'}[s.val.op]
                b = self.topy(self.cexpr(s.val.b, fn), self.ty(s.val.b, fn), L)
                out.append(f'{p}{{ pd_py *_o = {o}; PyObject *_k = {kc}; Py_INCREF(_k); '
                           f'PyObject *_c = pd_py_ref(pd_py_getitem(_o, _k, {L})); PyObject *_b = {b}; '
                           f'pd_py_setitem(_o, _k, pd_py_ref(pd_py_binop({opc!r}, _c, _b, {L})), {L}); }}')
            else:
                v = self.topy(self.cexpr(s.val, fn), self.ty(s.val, fn), L)
                out.append(f'{p}{{ PyObject *_v = {v}; pd_py *_o = {o}; PyObject *_k = {kc}; pd_py_setitem(_o, _k, _v, {L}); }}')
        elif k == 'setattr':
            ot = self.ty(s.target.obj, fn)
            ft = self.structs[oname(ot)].fields[s.target.name]
            f = mangle('f', s.target.name)
            self.slot_t = ft
            o = self.cexpr(s.target.obj, fn)
            v = self.conv(self.cexpr(s.val, fn), self.ty(s.val, fn), ft)
            if s.aug:
                out.append(f'{p}{{ {ctype(ot)} _o = {o}; {ctype(ft)} _cur = _o->{f}; {ctype(ft)} _v = {v}; _o->{f} = _v; }}')
            else:
                out.append(f'{p}{{ {ctype(ft)} _v = {v}; {ctype(ot)} _o = {o}; _o->{f} = _v; }}')
        elif k == 'setindex':
            ot = self.ty(s.target.obj, fn)
            d = is_dict(ot)
            tt = dval(ot) if d else elem(ot)
            self.slot_t = tt
            o, i = self.cexpr(s.target.obj, fn), self.cexpr(s.target.idx, fn)
            v = self.conv(self.cexpr(s.val, fn), self.ty(s.val, fn), tt)
            oc, ic = ('pd_dict *', 'pd_val') if d else ('pd_list *', 'int64_t')
            kv = box(i, dkey(ot)) if d else i
            store = f'pd_dict_set(_o, _k, {box("_v", tt)});' if d else f'pd_list_set(_o, _k, {box("_v", tt)}, {L});'
            if s.aug:     # המקום מחושב פעם אחת, כמו ב-Python
                get = f'pd_dict_get(_o, _k, {L})' if d else f'pd_list_get(_o, _k, {L})'
                out.append(f'{p}{{ {oc}_o = {o}; {ic} _k = {kv}; {ctype(tt)} _cur = {unbox(get, tt)}; '
                           f'{ctype(tt)} _v = {v}; {store} }}')
            else:         # כמו ב-Python: קודם הערך, אחר כך איפה לשים אותו
                out.append(f'{p}{{ {ctype(tt)} _v = {v}; {oc}_o = {o}; {ic} _k = {kv}; {store} }}')
        elif k == 'expr':
            e = s.e
            if e.kind == 'call' and e.name == 'הצג':
                # כמו Python: קודם מחשבים את כל הערכים, ורק אחר כך מדפיסים
                decl, codes = self.seq(e.args, [self.cexpr(a, fn) for a in e.args], force=True)
                out.append(f'{p}{{ {decl}')
                for i, (a, c) in enumerate(zip(e.args, codes)):
                    if i:
                        out.append(f'{p}  pd_sep();')
                    out.append(f'{p}  pd_print_text({self.to_text(c, self.ty(a, fn))});')
                out.append(f'{p}  pd_endl(); }}')
            else:
                t = self.ty(e, fn)
                out.append(f'{p}(void)({self.cexpr(e, fn)});' if t != 'none' else f'{p}{self.cexpr(e, fn)};')
        elif k == 'if':
            for i, (c, b) in enumerate(s.branches):
                out.append(f'{p}{"if" if i == 0 else "} else if"} ({self.cbool(c, fn)}) {{')
                self.emit_body(b, fn, out, ind + 1)
            if s.orelse:
                out.append(f'{p}}} else {{')
                self.emit_body(s.orelse, fn, out, ind + 1)
            out.append(f'{p}}}')
        elif k == 'while':
            out.append(f'{p}while ({self.cbool(s.cond, fn)}) {{')
            self.ctx.append('loop')
            self.emit_body(s.body, fn, out, ind + 1)
            self.ctx.pop()
            out.append(f'{p}}}')
        elif k == 'try':
            self.tmp += 1
            n = self.tmp
            out.append(f'{p}{{ jmp_buf *_jb{n} = pd_try_push({L});')
            out.append(f'{p}  if (setjmp(*_jb{n}) == 0) {{')
            self.ctx.append('try')
            self.emit_body(s.body, fn, out, ind + 2)
            self.ctx.pop()
            out.append(f'{p}    pd_ntry--;')
            out.append(f'{p}  }} else {{')
            if s.errname:
                out.append(f'{p}    {self.cname(s.errname, fn)} = pd_err_text;{self.set_flag(s.errname, fn)}')
            self.emit_body(s.handler, fn, out, ind + 2)
            out.append(f'{p}  }}')
            out.append(f'{p}}}')
        elif k == 'for':
            self.ctx.append('loop')
            self.tmp += 1
            n = self.tmp
            v = self.cname(s.var, fn)
            it = s.it
            if it.kind == 'call' and it.name == 'ספירה':
                a = [self.cexpr(x, fn) for x in it.args]
                start, end, step = ('INT64_C(0)', a[0], 'INT64_C(1)') if len(a) == 1 else \
                    (a[0], a[1], 'INT64_C(1)') if len(a) == 2 else (a[0], a[1], a[2])
                out.append(f'{p}{{ int64_t{self.vol} _i{n} = {start}, _e{n} = {end}, _s{n} = {step};')
                out.append(f'{p}  if (_s{n} == 0) pd_die({L}, "הקפיצה בספירה לא יכולה להיות 0");')
                out.append(f'{p}  bool{self.vol} _go{n} = _s{n} > 0 ? _i{n} < _e{n} : _i{n} > _e{n};')
                out.append(f'{p}  while (_go{n}) {{')
                out.append(f'{p}    {v} = _i{n};{self.set_flag(s.var, fn)}')
                out.append(f'{p}    {{ int64_t _t{n}; if (__builtin_add_overflow(_i{n}, _s{n}, &_t{n})) _go{n} = false;')
                out.append(f'{p}      else {{ _i{n} = _t{n}; _go{n} = _s{n} > 0 ? _i{n} < _e{n} : _i{n} > _e{n}; }} }}')
                self.emit_body(s.body, fn, out, ind + 2)
                out.append(f'{p}  }}')
                out.append(f'{p}}}')
            elif self.ty(it, fn) == 'py':
                out.append(f'{p}{{ PyObject *{self.vol} _it{n} = pd_py_iter({self.cexpr(it, fn)}, {L}); pd_py *_x{n};')
                out.append(f'{p}  while ((_x{n} = pd_py_next(_it{n}, {L}))) {{')
                out.append(f'{p}    {v} = _x{n};{self.set_flag(s.var, fn)}')
                self.emit_body(s.body, fn, out, ind + 2)
                out.append(f'{p}  }}')
                out.append(f'{p}}}')
            elif self.ty(it, fn) == 'text':
                out.append(f'{p}{{ const char *{self.vol} _p{n} = {self.cexpr(it, fn)};')
                out.append(f'{p}  while (*_p{n}) {{')
                out.append(f'{p}    int _n{n} = pd_u8len((unsigned char)*_p{n});')
                out.append(f'{p}    {v} = pd_substr(_p{n}, (size_t)_n{n}); _p{n} += _n{n};{self.set_flag(s.var, fn)}')
                self.emit_body(s.body, fn, out, ind + 2)
                out.append(f'{p}  }}')
                out.append(f'{p}}}')
            elif is_dict(self.ty(it, fn)):
                kt = dkey(self.ty(it, fn))
                out.append(f'{p}{{ pd_dict *{self.vol} _d{n} = {self.cexpr(it, fn)}; int64_t{self.vol} _i{n} = 0; int64_t _v{n} = _d{n}->ver, _e{n};')
                out.append(f'{p}  while ((_e{n} = pd_dict_next(_d{n}, &_i{n}, _v{n}, {L})) >= 0) {{')
                out.append(f'{p}    {v} = {unbox(f"_d{n}->k[_e{n}]", kt)};{self.set_flag(s.var, fn)}')
                self.emit_body(s.body, fn, out, ind + 2)
                out.append(f'{p}  }}')
                out.append(f'{p}}}')
            else:
                et = elem(self.ty(it, fn))
                out.append(f'{p}{{ pd_list *{self.vol} _l{n} = {self.cexpr(it, fn)};')
                out.append(f'{p}  for (int64_t{self.vol} _i{n} = 0; _i{n} < _l{n}->len; _i{n}++) {{')
                out.append(f'{p}    {v} = {unbox(f"_l{n}->a[_i{n}]", et)};{self.set_flag(s.var, fn)}')
                self.emit_body(s.body, fn, out, ind + 2)
                out.append(f'{p}  }}')
                out.append(f'{p}}}')
            self.ctx.pop()
        elif k in ('break', 'continue'):
            pops = self.tries_to(True)
            out.append(f'{p}{f"pd_ntry -= {pops}; " if pops else ""}{k};')
        elif k == 'pass':
            out.append(f'{p};')
        elif k == 'return':
            if s.val is None:
                pops = self.tries_to(False)
                if is_opt(fn.ret):
                    out.append(f'{p}{f"pd_ntry -= {pops}; " if pops else ""}return NULL;')
                else:
                    if fn.ret != 'none':
                        raise LangError(L, f'הפעולה "{fn.name}" נותנת {heb(fn.ret)} — "תן" צריך ערך')
                    out.append(f'{p}{f"pd_ntry -= {pops}; " if pops else ""}return;')
            else:
                if fn.ret == 'none':
                    raise LangError(L, 'הפעולה הזאת לא נותנת ערך')
                v = self.conv(self.cexpr(s.val, fn), self.ty(s.val, fn), fn.ret)
                pops = self.tries_to(False)
                if pops:     # קודם מחשבים (אולי זה ייכשל — ואז "אם נכשל" עוד פעיל), רק אחר כך יוצאים מה"נסה"
                    out.append(f'{p}{{ {ctype(fn.ret)} _r = {v}; pd_ntry -= {pops}; return _r; }}')
                else:
                    out.append(f'{p}return {v};')

    def helper_code(self):
        """לכל סוג שמופיע ברשימה: להפוך לטקסט, להשוות, לחפש."""
        order = sorted(self.helpers, key=lambda t: t.count('list:') + t.count('dict:') + t.count('obj:'))
        protos, bodies = [], []
        for t in order:
            i = tid(t)
            protos += [f'static const char *pd_str_{i}(pd_val v);', f'static bool pd_eqv_{i}(pd_val a, pd_val b);',
                       f'static bool pd_in_{i}(pd_list *l, pd_val x);']
            if t == 'py':
                bodies.append(f'static const char *pd_str_{i}(pd_val v) {{ return pd_py_repr(v.p); }}')
                bodies.append(f'static bool pd_eqv_{i}(pd_val a, pd_val b) {{ return pd_py_cmp(Py_EQ, pd_py_ref(a.p), pd_py_ref(b.p), 0); }}')
            elif is_opt(t):
                bi = tid(obase(t))
                bodies.append(f'static const char *pd_str_{i}(pd_val v) {{ return v.p ? pd_str_{bi}(v) : "כלום"; }}')
                bodies.append(f'static bool pd_eqv_{i}(pd_val a, pd_val b) {{ return (!a.p || !b.p) ? a.p == b.p : pd_eqv_{bi}(a, b); }}')
            elif is_obj(t):
                st = self.structs[oname(t)]
                parts = []
                for j, (nm, ft) in enumerate(st.fields.items()):
                    lab = c_str((', ' if j else st.name + '(') + nm + '=')
                    parts.append(f'pd_sb_add(&b, {lab}); pd_sb_add(&b, pd_str_{tid(ft)}({box("o->" + mangle("f", nm), ft)}));')
                eqs = ' && '.join(f'pd_eqv_{tid(ft)}({box("x->" + mangle("f", nm), ft)}, {box("y->" + mangle("f", nm), ft)})'
                                  for nm, ft in st.fields.items())
                bodies.append(f'static const char *pd_str_{i}(pd_val v) {{ {ctype(t)} o = v.p; pd_sb b = {{0}}; {" ".join(parts)} '
                              f'pd_sb_add(&b, ")"); return pd_sb_done(&b); }}')
                bodies.append(f'static bool pd_eqv_{i}(pd_val a, pd_val b) {{ {ctype(t)} x = a.p; {ctype(t)} y = b.p; '
                              f'return x == y || ({eqs}); }}')
            elif is_dict(t):
                ki, vi = tid(dkey(t)), tid(dval(t))
                bodies.append(f'static const char *pd_str_{i}(pd_val v) {{ pd_dict *d = v.p; pd_sb b = {{0}}; pd_sb_add(&b, "{{"); bool first = true; '
                              f'for (int64_t e = 0; e < d->n; e++) {{ if (d->dead[e]) continue; if (!first) pd_sb_add(&b, ", "); first = false; '
                              f'pd_sb_add(&b, pd_str_{ki}(d->k[e])); pd_sb_add(&b, ": "); pd_sb_add(&b, pd_str_{vi}(d->v[e])); }} '
                              f'pd_sb_add(&b, "}}"); return pd_sb_done(&b); }}')
                bodies.append(f'static bool pd_eqv_{i}(pd_val a, pd_val b) {{ pd_dict *x = a.p, *y = b.p; if (x->len != y->len) return false; '
                              f'for (int64_t e = 0; e < x->n; e++) {{ if (x->dead[e]) continue; int64_t f = pd_dict_find(y, x->k[e]); '
                              f'if (f < 0 || !pd_eqv_{vi}(x->v[e], y->v[f])) return false; }} return true; }}')
            elif is_list(t):
                e, ei = elem(t), tid(elem(t))
                bodies.append(f'static const char *pd_str_{i}(pd_val v) {{ pd_list *l = v.p; pd_sb b = {{0}}; pd_sb_add(&b, "["); '
                              f'for (int64_t k = 0; k < l->len; k++) {{ if (k) pd_sb_add(&b, ", "); pd_sb_add(&b, pd_str_{ei}(l->a[k])); }} '
                              f'pd_sb_add(&b, "]"); return pd_sb_done(&b); }}')
                bodies.append(f'static bool pd_eqv_{i}(pd_val a, pd_val b) {{ pd_list *x = a.p, *y = b.p; if (x->len != y->len) return false; '
                              f'for (int64_t k = 0; k < x->len; k++) if (!pd_eqv_{ei}(x->a[k], y->a[k])) return false; return true; }}')
            else:
                s = {'int': 'pd_int_to_text(v.i)', 'float': 'pd_float_to_text(v.f)', 'text': 'pd_repr_text(v.s)',
                     'bool': 'pd_bool_to_text(v.b)'}[t]
                q = {'int': 'a.i == b.i', 'float': 'a.f == b.f', 'text': 'strcmp(a.s, b.s) == 0', 'bool': 'a.b == b.b'}[t]
                bodies.append(f'static const char *pd_str_{i}(pd_val v) {{ return {s}; }}')
                bodies.append(f'static bool pd_eqv_{i}(pd_val a, pd_val b) {{ return {q}; }}')
            bodies.append(f'static bool pd_in_{i}(pd_list *l, pd_val x) {{ for (int64_t k = 0; k < l->len; k++) '
                          f'if (pd_eqv_{i}(l->a[k], x)) return true; return false; }}')
        return protos + bodies

    def compile(self):
        self.infer()
        self.flow()
        glob = [f'static {ctype(t)} {mangle("g", n)} = {czero(t)};' for n, t in self.globals_.items()]
        glob += [f'static bool {self.flag(k)} = false;' for k in sorted(self.checked, key=str) if k[0] is None]
        protos = []
        structs = [f'struct {sname(n)};' for n in self.structs]
        for n, st in self.structs.items():
            structs.append(f'struct {sname(n)} {{ ' + ' '.join(f'{ctype(resolved(t))} {mangle("f", fn_)};' for fn_, t in st.fields.items()) + ' };')
        for f in self.all_funcs():
            # בפעולה שיש בה "נסה": משתנים מקומיים volatile — אחרת אחרי קפיצה ל"אם נכשל" הערכים שלהם לא מובטחים (כלל של C)
            f.vol = ' volatile' if has_try(f.node.body) else ''
            ps = ', '.join(f'{ctype(f.params[p])}{f.vol} {mangle("l", p)}' for p in f.order) or 'void'
            protos.append(f'static {ctype(f.ret)} {f.cfunc}({ps})')
        body = []
        for f, proto in zip(self.all_funcs(), protos):
            self.vol = f.vol
            body.append(proto + ' {')
            for name, t in f.locals_.items():
                body.append(f'    {ctype(t)}{f.vol} {mangle("l", name)} = {new_of(t) if is_list(t) or is_dict(t) else czero(t)};')
                if (f.name, name) in self.checked:
                    body.append(f'    bool{f.vol} {self.flag((f.name, name))} = false;')
            self.emit_body(f.node.body, f, body, 1)
            if is_opt(f.ret):
                body.append('    return NULL;')        # כמו Python: פעולה שנגמרת בלי "תן" נותנת כלום
            elif f.ret != 'none':
                body.append(f'    pd_die({f.node.line}, {c_str(f"הפעולה " + f.name + " הגיעה לסוף בלי לתת ערך (חסר תן)")});')
                body.append(f'    return {czero(f.ret)};')
            body.append('}')
            body.append('')
        self.vol = ' volatile' if has_try(self.top) else ''
        body.append('int main(int argc, char **argv) {')
        body.append('    pd_init();')
        body.append('    pd_set_args(argc, argv);')
        for n, t in self.globals_.items():
            if is_list(t) or is_dict(t):
                body.append(f'    {mangle("g", n)} = {new_of(t)};')
        self.emit_body(self.top, None, body, 1)
        body += ['    fflush(stdout);', '    return 0;', '}']
        head = ['/* נוצר אוטומטית מקוד "פשוט" */', '#include "runtime.h"']
        if self.uses_py:
            head.append('#include "python_bridge.h"')
        head.append('')
        glob += [h for h in reversed(list(self.py_helpers.values())) if h]   # הפנימיים קודם
        par = ([f'static void pd_ser_{tid(t)}(pd_sb *b, pd_val v);' for t in self.ser_helpers] +
               [f'static pd_val pd_de_{tid(t)}(const char **p);' for t in self.de_helpers] +
               [h for h in self.ser_helpers.values() if h] + [h for h in self.de_helpers.values() if h])
        return '\n'.join(head + structs + glob + [x + ';' for x in protos] + self.helper_code() + par + self.work_fns + [''] + body) + '\n'


# ---------------------------------------------------------------- אתר: תרגום ל-JavaScript
class JSCompiler(Compiler):
    """אותה בדיקה של התוכנית (סוגים, משתנים בלי ערך...) — רק הפלט הוא JavaScript שרץ בדפדפן.
    מספר שלם = BigInt, כדי שהתוצאות יהיו בדיוק כמו בגרסה שרצה על המעבד."""

    def js_name(self, name, fn):
        return self.cname(name, fn)

    def jconv(self, code, frm, to):
        frm, to = (resolved(frm) if frm else frm), (resolved(to) if to else to)
        if frm and to and (is_opt(frm) or frm == 'nil') and not is_opt(to) and to != 'nil':
            return f'pd.nn({code}, {self.cur_line})'
        if frm == 'int' and to == 'float':
            return f'Number({code})'
        return code

    def fref(self, a):
        return self.funcs[a.name].cfunc

    def jx(self, e, fn):
        code = self._jx(e, fn)
        if getattr(e, 'unwrap', False) and is_opt(self.raw_ty(e, fn)):
            return f'pd.nn({code}, {e.line})'
        return code

    def _jx(self, e, fn):
        k, L = e.kind, e.line
        t = self.ty(e, fn)
        if k == 'nil':
            return 'null'
        if k == 'int':
            return f'{e.val}n'
        if k == 'float':
            return repr(float(e.val))
        if k == 'str':
            return json.dumps(e.val)
        if k == 'bool':
            return 'true' if e.val else 'false'
        if k == 'slotref':
            return '_cur'
        if k == 'var':
            c = self.js_name(e.name, fn)
            if getattr(e, 'check', None):
                return f'({c} !== undefined ? {c} : pd.unset({json.dumps(e.name)}, {L}))'
            return c
        if k == 'list':
            et = elem(t)
            return '[' + ', '.join(self.jconv(self.jx(x, fn), self.ty(x, fn), et) for x in e.items) + ']'
        if k == 'dict':
            kt, vt = dkey(t), dval(t)
            return 'pd.dict([' + ', '.join(f'[{self.jx(x, fn)}, {self.jconv(self.jx(y, fn), self.ty(y, fn), vt)}]'
                                          for x, y in zip(e.keys, e.vals)) + '])'
        if k == 'slice':
            ot = self.ty(e.obj, fn)
            parts = ', '.join(self.jx(x, fn) if x is not None else 'null' for x in (e.a, e.b, e.step))
            return f'pd.{"sliceText" if ot == "text" else "sliceList"}({self.jx(e.obj, fn)}, {parts}, {L})'
        if k == 'index':
            ot = self.ty(e.obj, fn)
            o, i = self.jx(e.obj, fn), self.jx(e.idx, fn)
            if is_dict(ot):
                return f'pd.dget({o}, {i}, {L})'
            if ot == 'text':
                return f'pd.textAt({o}, {i}, {L})'
            return f'pd.get({o}, {i}, {L})'
        if k == 'attr':
            return f'({self.jx(e.obj, fn)}).{mangle("f", e.name)}'
        if k == 'method':
            ot = self.ty(e.obj, fn)
            o = self.jx(e.obj, fn)
            a = [self.jx(x, fn) for x in e.args]
            if ot == 'el':
                return {'שנה': lambda: f'pd.el.set({o}, {a[0]})', 'ערך': lambda: f'pd.el.get({o})',
                        'נקה': lambda: f'pd.el.clear({o})', 'הוסף': lambda: f'pd.el.add({o}, {a[0]}, {L})',
                        'קבע': lambda: f'pd.el.cell({o}, {a[0]}, {a[1]}, {L}).set({a[2]})',
                        'קרא': lambda: f'pd.el.cell({o}, {a[0]}, {a[1]}, {L}).get()',
                        'סמן': lambda: f'pd.el.cell({o}, {a[0]}, {a[1]}, {L}).mark({a[2]})',
                        'נעל': lambda: f'pd.el.cell({o}, {a[0]}, {a[1]}, {L}).lock()'}[e.name]()
            if is_obj(ot):
                m = self.structs[oname(ot)].methods[e.name]
                cargs = [o] + [self.jconv(c, self.ty(x, fn), m.params[pn]) for c, x, pn in zip(a, e.args, m.order[1:])]
                return f'{m.cfunc}({", ".join(cargs)})'
            if ot == 'text':
                return {'פצל': lambda: f'pd.split({o}, {a[0] if a else "null"}, {L})', 'חבר': lambda: f'pd.join({o}, {a[0]})',
                        'החלף': lambda: f'pd.replace({o}, {a[0]}, {a[1]})', 'נקה': lambda: f'pd.strip({o}, {a[0] if a else "null"})',
                        'גדולות': lambda: f'pd.upper({o})', 'קטנות': lambda: f'pd.lower({o})',
                        'מתחיל_ב': lambda: f'pd.starts({o}, {a[0]})', 'נגמר_ב': lambda: f'pd.ends({o}, {a[0]})',
                        'מצא': lambda: f'pd.find({o}, {a[0]})', 'ספור': lambda: f'pd.count({o}, {a[0]})',
                        'שורות': lambda: f'pd.lines({o})'}[e.name]()
            if is_dict(ot):
                if e.name == 'הוצא':
                    return f'pd.dpop({o}, {a[0]}, {L})'
                if len(a) == 1:
                    return f'pd.dgetor({o}, {a[0]}, null)'
                return f'pd.dgetor({o}, {a[0]}, {self.jconv(a[1], self.ty(e.args[1], fn), t)})'
            if e.name == 'הוסף':
                return f'void ({o}).push({self.jconv(a[0], self.ty(e.args[0], fn), elem(ot))})'
            return f'pd.pop({o}, {L})'
        if k == 'member':
            at, bt = self.ty(e.a, fn), self.ty(e.b, fn)
            a, b = self.jx(e.a, fn), self.jx(e.b, fn)
            if bt == 'text':
                r = f'((_a, _b) => pd.contains(_b, _a))({a}, {b})'
            elif is_dict(bt):
                r = f'((_a, _b) => pd.dhas(_b, _a))({a}, {b})'
            else:
                r = f'((_a, _b) => pd.inList(_b, _a))({self.jconv(a, at, elem(bt))}, {b})'
            return f'(!{r})' if e.neg else r
        if k == 'neg':
            a = self.jx(e.a, fn)
            return f'pd.neg({a}, {L})' if t == 'int' else f'(-({a}))'
        if k == 'not':
            return f'(!({self.jx(e.a, fn)}))'
        if k == 'logic':
            op = '&&' if e.op == 'and' else '||'
            return f'(({self.jx(e.a, fn)}) {op} ({self.jx(e.b, fn)}))'
        if k == 'cmp':
            ta, tb = self.ty(e.a, fn), self.ty(e.b, fn)
            a, b = self.jx(e.a, fn), self.jx(e.b, fn)
            if 'float' in (ta, tb):
                a, b = self.jconv(a, ta, 'float'), self.jconv(b, tb, 'float')
            if e.op in ('==', '!='):
                r = f'pd.eq({a}, {b})'
                return r if e.op == '==' else f'(!{r})'
            if ta == 'text':
                return f'(pd.cmp({a}, {b}) {e.op} 0)'
            return f'(({a}) {e.op} ({b}))'
        if k == 'bin':
            ta, tb = self.ty(e.a, fn), self.ty(e.b, fn)
            a, b = self.jx(e.a, fn), self.jx(e.b, fn)
            if t == 'text' and e.op == '*':
                return f'pd.repeatText({a}, {b}, {L})' if ta == 'text' else f'((_n, _s) => pd.repeatText(_s, _n, {L}))({a}, {b})'
            if is_list(t) and e.op == '*':
                return f'pd.repeatList({a}, {b}, {L})' if is_list(ta) else f'((_n, _s) => pd.repeatList(_s, _n, {L}))({a}, {b})'
            if t == 'text':
                return f'({a} + {b})'
            if is_list(t):
                return f'[...{a}, ...{b}]'
            if e.op == '/':
                return f'pd.fdiv({self.jconv(a, ta, "float")}, {self.jconv(b, tb, "float")}, {L})'
            if t == 'int':
                fnm = {'+': 'add', '-': 'sub', '*': 'mul', '//': 'floordiv', '%': 'mod'}[e.op]
                return f'pd.{fnm}({a}, {b}, {L})'
            a, b = self.jconv(a, ta, 'float'), self.jconv(b, tb, 'float')
            return f'pd.fc(({a}) {e.op} ({b}), {L})'
        if k == 'call':
            return self.jcall(e, fn, t)
        raise LangError(L, 'ביטוי לא מוכר')

    def jcall(self, e, fn, t):
        n, L = e.name, e.line
        if n in self.structs:
            st, got = self.ctor_fields(e)
            written = list(e.args) + [v for _, v in e.kwargs]
            names = [f'_a{i}' for i in range(len(written))]
            byid = dict(zip([id(a) for a in written], names))
            fields = []
            for nm, ft in st.fields.items():
                if nm in got:
                    fields.append(self.jconv(byid[id(got[nm])], self.ty(got[nm], fn), ft))
                else:
                    fields.append(self.jconv(self.jx(st.defaults[nm], fn), self.ty(st.defaults[nm], fn), ft))
            return (f'(({", ".join(names)}) => new {sname(st.name)}({", ".join(fields)}))'
                    f'({", ".join(self.jx(a, fn) for a in written)})')
        if n in UI_BUILTINS and n not in self.funcs:
            a = e.args
            if n == 'כותרת': return f'pd.title({self.jx(a[0], fn)})'
            if n == 'טקסט_בדף': return f'pd.textEl({self.jx(a[0], fn)})'
            if n == 'שדה_קלט': return f'pd.input_el({self.jx(a[0], fn)}, {self.fref(a[1]) if len(a) > 1 else "null"})'
            if n == 'כפתור': return f'pd.button({self.jx(a[0], fn)}, {self.fref(a[1])})'
            if n == 'רשימת_שורות': return 'pd.listEl()'
            if n == 'לוח': return f'pd.grid({self.jx(a[0], fn)}, {self.jx(a[1], fn)}, {L}, {self.fref(a[2]) if len(a) > 2 else "null"})'
            if n == 'כל_כמה': return f'pd.every({self.jconv(self.jx(a[0], fn), self.ty(a[0], fn), "float")}, {self.fref(a[1])}, {L})'
        if n in ('מסודר', 'הגדול', 'הקטן') and e.kwargs and n not in self.funcs:
            kinds = dict(e.kwargs)
            lt = self.ty(e.args[0], fn)
            src = f'pd.keys({self.jx(e.args[0], fn)})' if is_dict(lt) else self.jx(e.args[0], fn)
            et = dkey(lt) if is_dict(lt) else elem(lt)
            if 'לפי' in kinds:
                f = self.funcs[kinds['לפי'].name]
                keys = f'_l.map(_x => {f.cfunc}({self.jconv("_x", et, f.params[f.order[0]])}))'
            else:
                keys = 'null'
            rev = self.jx(kinds['הפוך'], fn) if 'הפוך' in kinds else 'false'
            if n == 'מסודר':
                return f'((_l, _r) => pd.sorted(_l, {keys}, _r))({src}, {rev})'
            return f'(_l => pd.best(_l, {keys}, {1 if n == "הגדול" else -1}, "{n}", {L}))({src})'
        if n == 'במקביל' and n not in self.funcs:
            f = self.funcs[e.args[0].name]
            et = elem(self.ty(e.args[1], fn))
            return f'({self.jx(e.args[1], fn)}).map(_x => {f.cfunc}({self.jconv("_x", et, f.params[f.order[0]])}))'
        if self.is_py_var(n, fn) or n == 'ייבא':
            raise LangError(L, 'ספריות של Python ("ייבא") לא עובדות באתר')
        args = [self.jx(a, fn) for a in e.args]
        ts = [self.ty(a, fn) for a in e.args]
        if n == 'שאל':
            return f'pd.input({args[0] if args else json.dumps("")}, {L})'
        if n == 'כמה':
            return {'text': f'BigInt(pd.len({args[0]}))'}.get(ts[0], f'BigInt(pd.size({args[0]}))')
        if n == 'מספר':
            return {'int': args[0], 'float': f'pd.ftoi({args[0]}, {L})', 'text': f'pd.stoi({args[0]}, {L})'}[ts[0]]
        if n == 'שבר':
            return {'int': f'Number({args[0]})', 'float': args[0], 'text': f'pd.stof({args[0]}, {L})'}[ts[0]]
        if n == 'טקסט':
            return f'pd.str({args[0]})'
        if n == 'חיובי':
            return f'pd.abs({args[0]}, {L})' if ts[0] == 'int' else f'Math.abs({args[0]})'
        if n == 'סכום':
            return f'pd.sumI({args[0]}, {L})' if t == 'int' else f'pd.sumF({args[0]}, {L})'
        if n in ('הגדול', 'הקטן'):
            d = 1 if n == 'הגדול' else -1
            if len(args) == 1:
                return f'pd.best({args[0]}, null, {d}, "{n}", {L})'
            vals = ', '.join(self.jconv(a, at, t) for a, at in zip(args, ts))
            return f'pd.best([{vals}], null, {d}, "{n}", {L})'
        if n == 'מסודר':
            return f'pd.sorted(pd.keys({args[0]}), null, false)' if is_dict(ts[0]) else f'pd.sorted({args[0]}, null, false)'
        if n == 'מפתחות': return f'pd.keys({args[0]})'
        if n == 'ערכים': return f'pd.values({args[0]})'
        if n == 'קוד_אות': return f'pd.ord({args[0]}, {L})'
        if n == 'אות_מקוד': return f'pd.chr({args[0]}, {L})'
        if n == 'קרא_קובץ': return f'pd.readFile({args[0]}, {L})'
        if n == 'כתוב_קובץ': return f'pd.writeFile({args[0]}, {args[1]}, false, {L})'
        if n == 'הוסף_לקובץ': return f'pd.writeFile({args[0]}, {args[1]}, true, {L})'
        if n == 'קיים_קובץ': return f'pd.exists({args[0]})'
        if n == 'ארגומנטים': return 'pd.args()'
        if n == 'שגיאה': return f'pd.die({L}, {args[0]})'
        if n == 'אקראי': return 'pd.rand()'
        if n == 'זרע': return f'pd.seed({args[0]})'
        if n in ('אקספ', 'לוג', 'שורש'):
            return f'pd.{ {"אקספ": "exp", "לוג": "log", "שורש": "sqrt"}[n] }({self.jconv(args[0], ts[0], "float")}, {L})'
        if n == 'חזקה':
            return f'pd.pow({self.jconv(args[0], ts[0], "float")}, {self.jconv(args[1], ts[1], "float")}, {L})'
        if n == 'עגל':
            if ts[0] == 'int':
                return args[0] if len(args) == 1 else f'((_r, _n) => (_n < 0n ? pd.die({L}, "\\"עגל\\" עם מספר ספרות שלילי עוד לא נתמך") : _r))({args[0]}, {args[1]})'
            return f'pd.round0({args[0]}, {L})' if len(args) == 1 else f'pd.roundn({args[0]}, {args[1]}, {L})'
        f = self.funcs[n]
        cargs = [self.jconv(a, at, f.params[p]) for a, at, p in zip(args, ts, f.order)]
        return f'{f.cfunc}({", ".join(cargs)})'

    # --- פקודות
    def jbody(self, body, fn, out, ind):
        for s in body:
            self.jstmt(s, fn, out, ind)

    def jstmt(self, s, fn, out, ind):
        p = '    ' * ind
        k, L = s.kind, s.line
        self.cur_line = L
        if k == 'assign':
            out.append(f'{p}{self.js_name(s.name, fn)} = {self.jconv(self.jx(s.val, fn), self.ty(s.val, fn), self.var_type(s.name, fn))};')
        elif k == 'import':
            raise LangError(L, 'ספריות של Python ("ייבא") לא עובדות באתר')
        elif k == 'setattr':
            ot = self.ty(s.target.obj, fn)
            ft = self.structs[oname(ot)].fields[s.target.name]
            f = mangle('f', s.target.name)
            self.slot_t = ft
            o = self.jx(s.target.obj, fn)
            v = self.jconv(self.jx(s.val, fn), self.ty(s.val, fn), ft)
            if s.aug:
                out.append(f'{p}{{ const _o = {o}; const _cur = _o.{f}; _o.{f} = {v}; }}')
            else:
                out.append(f'{p}{{ const _v = {v}; const _o = {o}; _o.{f} = _v; }}')
        elif k == 'setindex':
            ot = self.ty(s.target.obj, fn)
            d = is_dict(ot)
            tt = dval(ot) if d else elem(ot)
            self.slot_t = tt
            o, i = self.jx(s.target.obj, fn), self.jx(s.target.idx, fn)
            v = self.jconv(self.jx(s.val, fn), self.ty(s.val, fn), tt)
            store = 'pd.dset(_o, _k, _v);' if d else f'pd.set(_o, _k, _v, {L});'
            if s.aug:
                get = f'pd.dget(_o, _k, {L})' if d else f'pd.get(_o, _k, {L})'
                out.append(f'{p}{{ const _o = {o}; const _k = {i}; const _cur = {get}; const _v = {v}; {store} }}')
            else:
                out.append(f'{p}{{ const _v = {v}; const _o = {o}; const _k = {i}; {store} }}')
        elif k == 'expr':
            e = s.e
            if e.kind == 'call' and e.name == 'הצג' and e.name not in self.funcs:
                # כמו Python: קודם מחשבים את כל הערכים, ורק אחר כך הופכים לטקסט ומדפיסים
                out.append(f'{p}pd.print([{", ".join(self.jx(a, fn) for a in e.args)}].map(pd.str));')
            else:
                out.append(f'{p}{self.jx(e, fn)};')
        elif k == 'if':
            for i, (c, b) in enumerate(s.branches):
                out.append(f'{p}{"if" if i == 0 else "} else if"} ({self.jx(c, fn)}) {{')
                self.jbody(b, fn, out, ind + 1)
            if s.orelse:
                out.append(f'{p}}} else {{')
                self.jbody(s.orelse, fn, out, ind + 1)
            out.append(f'{p}}}')
        elif k == 'while':
            out.append(f'{p}while ({self.jx(s.cond, fn)}) {{')
            self.jbody(s.body, fn, out, ind + 1)
            out.append(f'{p}}}')
        elif k == 'try':
            out.append(f'{p}try {{')
            self.jbody(s.body, fn, out, ind + 1)
            out.append(f'{p}}} catch (_e) {{')
            out.append(f'{p}    if (!(_e instanceof PdError)) throw _e;')
            if s.errname:
                out.append(f'{p}    {self.js_name(s.errname, fn)} = _e.msg;')
            self.jbody(s.handler, fn, out, ind + 1)
            out.append(f'{p}}}')
        elif k == 'for':
            self.tmp += 1
            n = self.tmp
            v = self.js_name(s.var, fn)
            it = s.it
            if it.kind == 'call' and it.name == 'ספירה':
                a = [self.jx(x, fn) for x in it.args]
                start, end, step = ('0n', a[0], '1n') if len(a) == 1 else (a[0], a[1], '1n') if len(a) == 2 else (a[0], a[1], a[2])
                out.append(f'{p}{{ const _a{n} = {start}, _e{n} = {end}, _s{n} = {step};')
                out.append(f'{p}  if (_s{n} === 0n) pd.die({L}, "הקפיצה בספירה לא יכולה להיות 0");')
                out.append(f'{p}  for (let _i{n} = _a{n}; _s{n} > 0n ? _i{n} < _e{n} : _i{n} > _e{n}; _i{n} += _s{n}) {{')
                out.append(f'{p}    {v} = _i{n};')
                self.jbody(s.body, fn, out, ind + 2)
                out.append(f'{p}  }}')
                out.append(f'{p}}}')
            else:
                t = self.ty(it, fn)
                if t == 'text':
                    out.append(f'{p}for (const _c{n} of {self.jx(it, fn)}) {{')
                    out.append(f'{p}    {v} = _c{n};')
                elif is_dict(t):
                    out.append(f'{p}for (const _k{n} of pd.diter({self.jx(it, fn)}, {L})) {{')
                    out.append(f'{p}    {v} = _k{n};')
                else:
                    out.append(f'{p}for (let _i{n} = 0, _l{n} = {self.jx(it, fn)}; _i{n} < _l{n}.length; _i{n}++) {{')
                    out.append(f'{p}    {v} = _l{n}[_i{n}];')
                self.jbody(s.body, fn, out, ind + 1)
                out.append(f'{p}}}')
        elif k in ('break', 'continue'):
            out.append(f'{p}{k};')
        elif k == 'pass':
            out.append(f'{p};')
        elif k == 'return':
            if s.val is None:
                out.append(f'{p}return{" null" if is_opt(fn.ret) else ""};')
            else:
                out.append(f'{p}return {self.jconv(self.jx(s.val, fn), self.ty(s.val, fn), fn.ret)};')

    def compile_js(self):
        self.infer()
        self.flow()
        out = ['"use strict";']
        for n, st in self.structs.items():
            keys = [mangle('f', f) for f in st.fields]
            out.append(f'class {sname(n)} {{ constructor({", ".join(keys)}) {{ ' + ' '.join(f'this.{k} = {k};' for k in keys) + ' } }')
            out.append(f'{sname(n)}.prototype.__pd = {{ name: {json.dumps(n)}, fields: {json.dumps(list(st.fields), ensure_ascii=False)}, keys: {json.dumps(keys)} }};')
        if self.globals_:
            out.append('let ' + ', '.join(mangle('g', n) for n in self.globals_) + ';')
        for f in self.all_funcs():
            out.append(f'function {f.cfunc}({", ".join(mangle("l", p) for p in f.order)}) {{')
            if f.locals_:
                out.append('    let ' + ', '.join(mangle('l', n) for n in f.locals_) + ';')
            self.jbody(f.node.body, f, out, 1)
            if is_opt(f.ret):
                out.append('    return null;')
            elif f.ret != 'none':
                out.append(f'    pd.die({f.node.line}, {json.dumps("הפעולה " + f.name + " הגיעה לסוף בלי לתת ערך (חסר תן)", ensure_ascii=False)});')
            out.append('}')
        out.append('pd.run(() => {')
        self.jbody(self.top, None, out, 1)
        out.append('});')
        return '\n'.join(out) + '\n'


PAGE = '''<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{body}
</html>
'''
# תוכן הדף (בלי המעטפת) — כך אפשר גם לפרסם אותו כמו שהוא
PAGE_BODY = '''<title>{title}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&display=swap">
<style>
:root {{ --bg: #eef2f0; --card: #fbfcfb; --ink: #1c2622; --muted: #56655e; --accent: #0f6b5c; --accent-ink: #ffffff;
        --line: #d6dfdb; --field: #f3f6f5; --err: #b3261e; color-scheme: light; }}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{ --bg: #111715; --card: #19211e; --ink: #e5ece9; --muted: #9fb0a8; --accent: #4fc2ac;
        --accent-ink: #0b1411; --line: #2a3531; --field: #141b19; --err: #ff8a80; color-scheme: dark; }}
}}
:root[data-theme="dark"] {{ --bg: #111715; --card: #19211e; --ink: #e5ece9; --muted: #9fb0a8; --accent: #4fc2ac;
        --accent-ink: #0b1411; --line: #2a3531; --field: #141b19; --err: #ff8a80; color-scheme: dark; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--bg); color: var(--ink); font: 18px/1.6 "Assistant", system-ui, "Segoe UI", Arial, sans-serif;
        padding-inline: 16px; padding-block: 32px; }}
#pd-app {{ max-width: 620px; margin-inline: auto; padding: 28px 24px; background: var(--card); border: 1px solid var(--line); border-radius: 14px;
          display: flex; flex-direction: column; gap: 10px; }}
@media (max-width: 520px) {{ body {{ padding-block: 12px; }} #pd-app {{ padding: 20px 16px; }} }}
.pd-title {{ font-size: 30px; line-height: 1.2; margin: 0 0 6px; text-wrap: balance; font-weight: 700; }}
.pd-text {{ margin: 0; color: var(--muted); }}
.pd-input {{ width: 100%; font: inherit; padding: 10px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--field); color: var(--ink); }}
.pd-input:focus-visible, .pd-button:focus-visible {{ outline: 3px solid var(--accent); outline-offset: 2px; }}
.pd-button {{ font: inherit; font-weight: 600; padding: 9px 20px; border: 0; border-radius: 10px;
              background: var(--accent); color: var(--accent-ink); cursor: pointer; }}
.pd-row {{ display: flex; flex-wrap: wrap; gap: 8px; }}
.pd-list {{ list-style: none; padding: 0; margin: 4px 0 0; border-top: 1px solid var(--line); }}
.pd-list:empty {{ border-top: 0; }}
.pd-list li {{ padding: 10px 2px; border-bottom: 1px solid var(--line); overflow-wrap: anywhere; }}
.pd-out {{ white-space: pre-wrap; overflow-x: auto; font: 15px/1.5 ui-monospace, Consolas, monospace; background: var(--field); padding: 12px; border-radius: 10px; margin: 0; }}
.pd-grid {{ display: grid; gap: 0; border: 2px solid var(--ink); border-radius: 8px; overflow: hidden; width: 100%;
            direction: ltr; margin-block: 6px; }}
.pd-grid-sq {{ max-width: 460px; }}
.pd-scroll {{ overflow-x: auto; }}
.pd-grid-wide {{ border-width: 1px; border-color: var(--line); }}
.pd-grid input {{ width: 100%; min-width: 0; border: 1px solid var(--line); background: var(--field); color: var(--ink);
                 font-variant-numeric: tabular-nums; border-radius: 0; }}
.pd-grid-sq input {{ aspect-ratio: 1; font: 600 clamp(15px, 4.8vw, 24px) "Assistant", system-ui, sans-serif; text-align: center; padding: 0; }}
.pd-grid-wide input {{ height: 38px; font: 15px "Assistant", system-ui, sans-serif; padding: 0 8px; text-align: start; }}
.pd-grid input:focus-visible {{ outline: 3px solid var(--accent); outline-offset: -3px; }}
.pd-grid input[readonly] {{ background: var(--card); }}
.pd-grid input.pd-head {{ background: var(--bg); color: var(--muted); font-weight: 700; text-align: center; }}
.pd-grid input.pd-mark {{ color: var(--accent); font-weight: 600; }}
.pd-grid-sq input.pd-mark {{ background: var(--card); }}
.pd-grid input.pd-b-r {{ border-right: 2px solid var(--ink); }}
.pd-grid input.pd-b-b {{ border-bottom: 2px solid var(--ink); }}
.pd-error {{ color: var(--err); border: 1px solid var(--err); border-radius: 10px; padding: 10px 14px; }}
@media (prefers-reduced-motion: no-preference) {{ .pd-button {{ transition: filter .15s; }} .pd-button:hover {{ filter: brightness(1.08); }} }}
</style>
<main id="pd-app" dir="rtl" lang="he"></main>
<script>
{runtime}
{program}
</script>
'''


# ---------------------------------------------------------------- הפעלה
def to_js(src):
    return JSCompiler(Parser(lex(src)).program()).compile_js()


def to_c(src):
    return Compiler(Parser(lex(src)).program()).compile()


def python_flags():
    """הדגלים של gcc כדי לחבר את Python (רק לתוכנה שיש בה ייבא)"""
    for cfg in ('python3.13-config', 'python3.12-config', 'python3-config'):
        try:
            inc = subprocess.run([cfg, '--includes'], capture_output=True, text=True)
            ld = subprocess.run([cfg, '--ldflags', '--embed'], capture_output=True, text=True)
        except OSError:
            continue
        if inc.returncode == 0 and ld.returncode == 0:
            return inc.stdout.split(), ld.stdout.split()
    return None


def report(err, src):
    lines = src.split('\n')
    msg = f'שגיאה בשורה {err.line}: {err.msg}'
    if 1 <= err.line <= len(lines) and lines[err.line - 1].strip():
        msg += f'\n    {lines[err.line - 1].strip()}'
    print(msg, file=sys.stderr)


def main(argv):
    if len(argv) < 2 or argv[1] in ('-h', '--help', '--עזרה'):
        print(__doc__)
        return 0 if len(argv) >= 2 else 2
    path = argv[1]
    flags = set(argv[2:])
    try:
        with open(path, encoding='utf-8') as fh:
            src = fh.read()
    except OSError:
        print(f'שגיאה: לא מצאתי את הקובץ "{path}"', file=sys.stderr)
        return 2
    except UnicodeDecodeError:
        print(f'שגיאה: הקובץ "{path}" לא שמור בקידוד UTF-8', file=sys.stderr)
        return 2
    web = '--אתר' in flags or '--js' in flags
    try:
        c = to_js(src) if web else to_c(src)
    except LangError as e:
        report(e, src)
        return 1
    except Unknown:
        print('שגיאה: לא הצלחתי להבין את הסוגים בתוכנית — כנראה פעולה שקוראת לעצמה בלי מקרה עצירה', file=sys.stderr)
        return 1
    if '--C' in flags:
        print(c)
        return 0
    base = os.path.splitext(path)[0]
    if web:
        rt = open(os.path.join(HERE, 'unidata.js'), encoding='utf-8').read() + open(os.path.join(HERE, 'runtime.js'), encoding='utf-8').read()
        if '--js' in flags:            # לבדיקות: קובץ שרץ ב-node
            out = base + '.js'
            with open(out, 'w', encoding='utf-8') as fh:
                fh.write(rt + '\n' + c)
        else:
            out = base + '.html'
            m = re.search(r'כותרת\(\s*"([^"\\]{1,80})"', src)      # שם הדף: מה שכתוב בכותרת הראשונה
            title = html_escape(m.group(1) if m else os.path.basename(base))
            with open(out, 'w', encoding='utf-8') as fh:
                body = PAGE_BODY.format(title=title, runtime=rt.replace('</script', '<\\/script'), program=c.replace('</script', '<\\/script'))
                fh.write(body if '--גוף' in flags else PAGE.replace('{body}', body))
        if '--הרץ' in flags and '--js' in flags:
            return subprocess.run(['node', out]).returncode
        print(f'נבנה: {out}' + ('' if '--js' in flags else '  (פותחים אותו בדפדפן)'))
        return 0
    windows = os.name == 'nt' or '--ווינדוס' in flags or '--windows' in flags
    exe = base if base != path else path + '.out'
    if windows:
        exe = base + '.exe'
    for f in flags:
        if f.startswith('--יציאה='):
            exe = f.split('=', 1)[1]
    with tempfile.TemporaryDirectory() as d:
        cfile = os.path.join(d, 'prog.c')
        with open(cfile, 'w', encoding='utf-8') as fh:
            fh.write(c)
        extra = os.environ.get('PASHUT_CFLAGS', '').split()     # לבדיקות: למשל -DPD_GC_TORTURE
        libs = []
        if '#include "python_bridge.h"' in c and windows:
            print('שגיאה: "ייבא" (ספריות של Python) עוד לא עובד בתוכנה ל-Windows', file=sys.stderr)
            return 1
        if '#include "python_bridge.h"' in c:
            pyflags = python_flags()
            if pyflags is None:
                print('שגיאה: התוכנה משתמשת ב"ייבא", אבל לא מצאתי Python לחיבור (צריך python3-dev / python3.12-config)', file=sys.stderr)
                return 1
            extra += pyflags[0]
            libs = pyflags[1]
        cc = 'gcc'
        if windows:
            # תוכנה ל-Windows: מלינוקס — עם המהדר של mingw; ב-Windows עצמו — gcc של mingw
            if os.name != 'nt':
                cc = 'x86_64-w64-mingw32-gcc'
                if subprocess.run(['which', cc], capture_output=True).returncode:
                    print('שגיאה: כדי לבנות ל-Windows מלינוקס צריך את mingw (sudo apt install gcc-mingw-w64-x86-64)', file=sys.stderr)
                    return 1
            extra += ['-static', '-Wl,--stack,8388608']      # בלי קבצים נלווים; מחסנית כמו בלינוקס
            libs += ['-lshell32']
        r = subprocess.run([cc, '-O2', '-std=gnu11', '-w', '-I', HERE, *extra, cfile, '-o', exe, *libs, '-lm'],
                           capture_output=True, text=True)
    if r.returncode:
        print('שגיאה פנימית בבנייה (זה באג במהדר, לא בקוד שלך):', file=sys.stderr)
        print(r.stderr[:2000], file=sys.stderr)
        return 3
    if '--הרץ' in flags:
        return subprocess.run([os.path.abspath(exe)]).returncode
    print(f'נבנה: {exe}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
