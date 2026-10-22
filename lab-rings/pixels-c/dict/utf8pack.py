"""utf8pack.py - pack bytes into a Python string literal using the whole UTF-8 character space.

Characters usable inside a triple-quoted literal:
  124 one-byte  (ASCII 1..127 minus CR, '"', '\\')
  1920 two-byte (U+0080..U+07FF)
  61440 three-byte (U+0800..U+FFFF minus surrogates)
They get static frequencies F1 : F2 : 1 ~ 1 : x : x^2 with 124x+1920x^2+61440x^3 = 1, which is the
optimal code for letters whose cost is their UTF-8 length: 7.137 bits per file byte instead of
log2(124) = 6.954 for pure ASCII (2.6% smaller).

Engine side (pack): a finite-precision range *decoder* reads the data bytes and emits characters.
Program side (U):  the matching range *encoder* turns the characters back into the bytes
(its 'low' is a Python big int, so carries need no special handling).
"""
AL = [c for c in range(1, 128) if c not in (13, 34, 92)]
F1, F2 = 19697, 140
C1 = 124 * F1
C2 = C1 + 1920 * F2
T = C2 + 61440


def char_of(q):
    """symbol containing cumulative position q -> (char, cum, freq)"""
    if q < C1:
        k = q // F1; return chr(AL[k]), k * F1, F1
    if q < C2:
        k = (q - C1) // F2; return chr(0x80 + k), C1 + k * F2, F2
    k = q - C2; o = 0x800 + k
    if o >= 0xD800: o += 0x800
    return chr(o), C2 + k, 1


def pack(data):
    nb = len(data)
    buf = data + b'\x80' + bytes(24)
    d = int.from_bytes(buf[:7], 'big'); pos = 7
    g = 1 << 56
    out = []
    n = 0
    while 7 + n < nb + 8:
        r = g // T
        q = d // r
        if q >= T: q = T - 1
        ch, cum, f = char_of(q)
        out.append(ch)
        d -= r * cum
        g = g - r * cum if cum + f == T else r * f
        assert 0 <= d < g
        while g < 1 << 48:
            g <<= 8; d = (d << 8) | buf[pos]; pos += 1; n += 1
    return ''.join(out)


UNPACK = '''def U(s,b):
 l=n=0;g=1<<56
 for c in s:
  o=ord(c);f=1
  if o<128:f=%(F1)d;k=(o-1-(o>13)-(o>34)-(o>92))*f
  elif o<2048:f=%(F2)d;k=%(K2)d+o*f
  else:k=%(K3)d+o-(o>57343)*2048
  r=g//%(T)d;l+=r*k;g=g-r*k if o>65534 else r*f
  while g<1<<48:g<<=8;l<<=8;n+=1
 return(l>>8*(7+n-b)).to_bytes(b,'big')
'''
UNPACK_SRC = UNPACK % dict(F1=F1, F2=F2, K2=C1 - 128 * F2, K3=C2 - 2048, T=T)


def unpack(s, nb):
    ns = {}
    exec(UNPACK_SRC, ns)
    return ns['U'](s, nb)


if __name__ == '__main__':
    import os, time
    for n in (1, 10, 1000, 80000):
        for trial in range(3):
            d = os.urandom(n) if trial else bytes(n)
            t0 = time.time(); s = pack(d); t1 = time.time()
            b = unpack(s, n); t2 = time.time()
            assert b == d, (n, trial)
        print(n, 'chars', len(s), 'utf8 bytes', len(s.encode()), 'ratio %.4f' % (len(s.encode()) / n), 'pack %.2fs unpack %.2fs' % (t1 - t0, t2 - t1))
    print(len(UNPACK_SRC), UNPACK_SRC)
