# runs exactly one new lesson (the next one not in the file) for each of the two versions, in parallel
for m in net nonet; do timeout 560 node school.mjs $m > school_$m.log 2>&1 & done; wait
for m in net nonet; do grep "^[✓✗]" school_$m.log | grep -v "from the file" | sed "s/^/$m: /"; done
