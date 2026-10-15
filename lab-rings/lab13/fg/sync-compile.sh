#!/bin/bash
# Copies Track B's compiler (lab13-fgB/fg) into this tree. Re-run to pick up a newer version.
# Without it, fg/compile.mjs must be the stub (cp fg/compile-stub.mjs fg/compile.mjs).
S=/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad
SRC=$S/lab13-fgB/fg; DST=$S/lab13-fgA/fg
[ -f $SRC/compile.mjs ] || { echo "no Track B compiler yet; using the stub"; cp $DST/compile-stub.mjs $DST/compile.mjs; exit 0; }
for f in compile.mjs bricks.mjs lamc.mjs ir.mjs subspec.mjs learned-tools.json subspec-cache.json; do [ -f $SRC/$f ] && cp $SRC/$f $DST/$f; done
mkdir -p $DST/ref && cp $SRC/ref/*.mjs $DST/ref/
date -u +%FT%TZ > $DST/compile.synced; md5sum $SRC/compile.mjs >> $DST/compile.synced
echo synced; cat $DST/compile.synced
