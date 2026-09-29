#!/usr/bin/env bash
# step 1 (release-gate): prove the gates fail when they should.
#
#   tests/gate.sh --inject
#
# Each injection breaks one invariant in a throwaway git worktree and asserts that the gate that
# guards it goes red. A gate that stays green on its own fault is worse than no gate: it signs off
# on a lie. Injections that need a built, signed APK in dist/ are listed as DEFERRED until the first
# ship through ship/release.mjs writes one - they are never silently counted as passing.
set -uo pipefail
REPO="$(git rev-parse --show-toplevel)"
WT="${LIBA_GATE_WT:-/tmp/claude-0/liba-gate-wt}"

[ "${1:-}" = "--inject" ] || { echo "usage: tests/gate.sh --inject"; exit 2; }

# the worktree keeps its own HEAD, so pin it to what the repo has NOW - otherwise the injections
# run against whatever commit the worktree was created at and every gate looks green.
HEAD_SHA="$(git -C "$REPO" rev-parse HEAD)"
if [ ! -d "$WT/.git" ] && [ ! -f "$WT/.git" ]; then
  git -C "$REPO" worktree add --detach "$WT" "$HEAD_SHA" >/dev/null 2>&1 || { echo "לא הצלחתי ליצור worktree ב-$WT"; exit 2; }
fi
git -C "$WT" checkout -f --detach "$HEAD_SHA" >/dev/null 2>&1
git -C "$WT" clean -fdq >/dev/null 2>&1

pass=0; fail=0; deferred=0
reset() { git -C "$WT" checkout -f --detach "$HEAD_SHA" >/dev/null 2>&1; git -C "$WT" clean -fdq >/dev/null 2>&1; }

# run <name> <gate-or-command> — expects a NON-zero exit
expect_red() {
  local name="$1"; shift
  if (cd "$WT" && "$@" >/dev/null 2>&1); then
    echo "  ✗ $name — השער נשאר ירוק על תקלה מוזרקת"; fail=$((fail+1))
  else
    echo "  ✓ $name"; pass=$((pass+1))
  fi
  reset
}

echo "הזרקת תקלות:"

# 1. version.json disagrees with VERSION
python3 - "$WT" <<'PY'
import json,sys
p=sys.argv[1]+'/version.json'; j=json.load(open(p)); j['versionCode']=j['versionCode']+7
open(p,'w').write(json.dumps(j))
PY
expect_red "version.json מול VERSION" node gates/one-version.mjs

# 2. the version number reappears hardcoded in the build file
sed -i 's/versionCode = vCode/versionCode = 99/' "$WT/android/app/build.gradle.kts"
expect_red "מספר גרסה קשיח ב-build.gradle" node gates/one-version.mjs

# 3. the page contract number drifts from PAGE
echo "99" > "$WT/PAGE"
expect_red "PAGE מול page: בדף" node gates/page-version.mjs

# 4. a literal signing password in a tracked file
printf 'storePassword=hunter2\n' > "$WT/ship/leaked.properties"
git -C "$WT" add ship/leaked.properties >/dev/null 2>&1
expect_red "סיסמת חתימה בקובץ במעקב" node gates/no-secret.mjs

# 5. a keystore itself in the tree
head -c 64 /dev/urandom > "$WT/ship/liba.jks"
git -C "$WT" add -f ship/liba.jks >/dev/null 2>&1
expect_red "קיסטור במעקב" node gates/no-secret.mjs

# 6. a static page invariant broken (the owner protocol the static test asserts)
sed -i "s#channel/owner#channel/gone#g" "$WT/liba-call.html"
expect_red "בדיקת הדף הסטטית" node tests/page.test.js

# 7. the live page loses a behaviour the harness asserts
sed -i "s/else if(d.liba==='spoke')/else if(d.liba==='__never__')/" "$WT/liba-call.html"
expect_red "בדיקת הדף החי" env NODE_PATH="$(npm root -g)" node tests/page.e2e.js

# 8-10. everything that needs a signed APK in dist/
if [ -f "$REPO/dist/liba.apk" ]; then
  cp "$REPO/dist/liba.apk" "$WT/dist/liba.apk"
  head -c 200000 "$REPO/dist/liba.apk" > "$WT/dist/liba.apk"
  expect_red "APK קצוץ מול sha256" node gates/apk-hash.mjs
  cp "$REPO/dist/liba.apk" "$WT/dist/liba.apk"
  sed -i 's/^a7/b7/' "$WT/keys/PINNED.sha256"
  expect_red "חותם זר" node gates/apk-hash.mjs
  cp "$REPO/dist/liba.apk" "$WT/dist/liba.apk"
  python3 - "$WT" <<'PY'
import json,sys
p=sys.argv[1]+'/version.json'; j=json.load(open(p)); j['sha256']='0'*64
open(p,'w').write(json.dumps(j))
PY
  expect_red "sha256 לא תואם" node gates/apk-hash.mjs
else
  deferred=3
  echo "  · 3 הזרקות ממתינות ל-dist/liba.apk (חותם זר, APK קצוץ, sha256 לא תואם) — יופעלו אחרי השילוח הראשון דרך ship/release.mjs"
fi

echo
echo "$pass/$((pass+fail)) תקלות מוזרקות הפילו את השער$([ $deferred -gt 0 ] && echo " · $deferred ממתינות ל-APK")"
[ $fail -eq 0 ] || exit 1
