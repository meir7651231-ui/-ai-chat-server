#!/bin/bash
# builds libvr.so (portable -O2; no FMA contraction so float math matches Skia's x86 build)
cd "$(dirname "$0")"
SRC="vr_geom.c vr_aaa.c vr_clip.c vr_blit.c vr_rect.c vr_svg.c vr_stroke.c vr_grad.c"
gcc -O2 -fPIC -shared -std=gnu11 -ffp-contract=off -fno-fast-math -Wall -Wno-unused-function -Wno-misleading-indentation -o libvr.so $SRC -lm
# C kernels for the engines' Python hot loops (bit-exact with the numpy originals, see vcfit.c)
gcc -O2 -fPIC -shared -std=gnu11 -ffp-contract=off -fno-fast-math -Wall -Wno-misleading-indentation -o libvcfit.so vcfit.c -lm
