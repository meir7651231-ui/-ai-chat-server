cd "$(dirname "$0")"
SKIPDONE=1 ALT=2 SAVE=6 MIN=1 node ladder.mjs > L6save2.out 2>&1
ALT=2 TEST=7 node ladder.mjs > L7test.out 2>&1
TEST=7 NOPREV=1 node ladder.mjs > L7noprev.out 2>&1
echo DONE > L7.done
