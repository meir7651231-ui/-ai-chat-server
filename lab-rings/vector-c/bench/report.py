#!/usr/bin/env python3
"""Builds the old-vs-new table from bench result JSONL files.

usage: report.py OLD.jsonl[,OLD2.jsonl...] NEW.jsonl[,NEW2.jsonl...]  -> prints a table (plain text) and
writes bench/report.json.  When an image appears in several files of one side, the last record wins."""
import sys, json, os

KEYS = ['close_pct', 'psnr_db', 'shapes', 'svg_bytes', 'exact_pct']
IMGS = ['icon', 'chart', 'logo', 'blob', 'text', 'glow', 'flag', 'pie', 'face']


def load(spec):
    out = {}
    for f in spec.split(','):
        if not os.path.exists(f):
            continue
        for line in open(f):
            line = line.strip()
            if line:
                r = json.loads(line)
                out[(r['engine'], r['image'])] = r
    return out


def native_info(r):
    """native renders / Chromium fallbacks in the search loop and the final-check result of a new run"""
    if not r:
        return '-'
    st, fc = r.get('render_stats'), r.get('final_check')
    lg = r.get('svg', '') + '.log'
    if (st is None or fc is None) and os.path.exists(lg):
        for line in open(lg):
            if line.startswith('render_stats '):
                st = json.loads(line.split(' ', 1)[1])
            elif line.startswith('final check native vs chromium: '):
                fc = eval(line.split(': ', 1)[1], {'True': True, 'False': False})
    if not st:
        return '-'
    t = f"nat {st.get('native', 0)} fb {st.get('fallback', 0)}"
    if fc:
        t += f" chk max {fc.get('max')} {'ok' if fc.get('ok') else 'RERUN'}"
    return t


def main():
    old, new = load(sys.argv[1]), load(sys.argv[2])
    rows = []
    hdr = (f'{"engine":6s} {"image":6s} {"old s":>8s} {"new s":>7s} {"speedup":>8s} | '
           f'{"close% old/new":>15s} {"psnr old/new":>13s} {"shapes":>7s} {"bytes old/new":>13s} | {"svg":9s} | native loop / final check')
    print(hdr); print('-' * len(hdr))
    for eng in ('trace', 'prims'):
        for im in IMGS:
            o, n = old.get((eng, im)), new.get((eng, im))
            if not o and not n:
                continue
            def g(r, k, fmt='{}'):
                return fmt.format(r[k]) if r and k in r else '-'
            os_ = o['secs'] if o and o.get('rc') == 0 else None
            ns = n['secs'] if n and n.get('rc') == 0 else None
            otxt = f'{os_:.1f}' if os_ is not None else (f'>{o["secs"]:.0f}' if o else '-')
            sp = f'{os_ / ns:.1f}x' if os_ and ns else (f'>{o["secs"] / ns:.0f}x' if o and ns and o.get('rc') != 0 else '-')
            same = '-'
            if o and n and os.path.exists(o.get('svg', '')) and os.path.exists(n.get('svg', '')):
                same = 'identical' if open(o['svg'], 'rb').read() == open(n['svg'], 'rb').read() else 'differs'
            print(f'{eng:6s} {im:6s} {otxt:>8s} {(f"{ns:.1f}" if ns else "-"):>7s} {sp:>8s} | '
                  f'{g(o, "close_pct"):>7s}/{g(n, "close_pct"):<7s} {g(o, "psnr_db"):>6s}/{g(n, "psnr_db"):<6s} '
                  f'{g(o, "shapes"):>3s}/{g(n, "shapes"):<3s} {g(o, "svg_bytes"):>6s}/{g(n, "svg_bytes"):<6s} | {same:9s} | {native_info(n)}')
            rows.append(dict(engine=eng, image=im, old=o, new=n, svg=same))
    json.dump(rows, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'report.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
