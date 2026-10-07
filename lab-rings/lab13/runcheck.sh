cd "$(dirname "$0")"
K=3 SEED=11 VMS=90000 node randladder.mjs > rand-cover.out 2>&1
K=3 SEED=23 VMS=90000 node randladder.mjs > rand-cover2.out 2>&1
for L in 3 4 5 6 7; do ALT=2 TEST=$L node ladder.mjs > reg-L$L.out 2>&1; done
echo DONE > check.done
