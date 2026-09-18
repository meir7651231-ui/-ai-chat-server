#!/usr/bin/env bash
# ראיית-הפנקס, מחוללת ולא מוקלדת: מריץ את המנועים שחוברו לשכבה `yeshiva/rminhu.mjs`
# ואוסף את מהלכי-ה«ורמינהו» שהם רשמו **בריצה אמיתית**. הפלט הוא הראיה שהקומיט נושא.
#
#   bash knowledge/connect/2026-09-18/ledger/collect.sh [<קובץ-פלט>]
#
# והישיבה קוראת אותו verbatim (בלי שינוי ב-yeshiva-engine):
#   mkdir -p /tmp/pk/.maimatai && cp <קובץ-פלט> /tmp/pk/.maimatai/log.jsonl
#   cd /tmp/pk && PYTHONPATH=/home/user/yeshiva-engine python3 -m yeshiva.gate log </dev/null
set -uo pipefail
cd "$(dirname "$0")/../../../.." || exit 1
OUT="${1:-$(mktemp -d)/ledger.jsonl}"
: > "$OUT"
export YESHIVA_LEDGER="$OUT"
q() { "$@" >/dev/null 2>&1; }

# ── גל-1 · מדף-אטומים ─────────────────────────────────────────────────────
q node machtzev/generator/match.mjs "טבלת תשלומים"          # match.best · חד שיעורא
q node machtzev/generator/match.mjs "קרפדה סגלגלה"           # match.best · «לא מצינו»
q node -e 'import("./machtzev/generator/match.mjs").then((m)=>{m.matchClass("_MetricGrid");m.matchClass("_Zzqqx")})'
q node -e 'import("./machtzev/generator/atlas.mjs").then((m)=>m.buildAtlas({forge:true}))'   # atlas.shelf · 6 מדפים
q node machtzev/search-proof-check.mjs --files new/atoms/zzq-nonexistent.mjs                  # search-proof-check
q node -e 'import("./machtzev/generator/capability.mjs").then((m)=>{try{m.emitApp("הצג את מפלס המים כאשר הלחץ עולה על הסף")}catch{};try{m.emitApp("קרפדה")}catch{}})'
q node -e 'import("./machtzev/search-score.mjs").then((m)=>m.loadOracle())'                   # search-score · שני קובצי-האורקל

# ── גל-2 · חלקיקים ────────────────────────────────────────────────────────
q node machtzev/generator/ops-particles.mjs Family משפחה                                      # ops-particles · 38 פעולות

# ── גל-3 · משפט ⇒ כוונה ───────────────────────────────────────────────────
q node machtzev/generator/intent.mjs "רשימת לקוחות עם סטטוס"                                  # intent
q node machtzev/generator/retrieve-screen.mjs "קרפדה סגלגלה"                                  # retrieve-screen · ציון-0 המוסתר
q node machtzev/census/engine-index.mjs --find "הקראה בקול"                                    # engine-index --find
q node -e 'import("./machtzev/generator/tzinor.mjs").then((m)=>{for(const w of ["הודעה","שיחה","הלקוח","קרפדה"])m.soleClassOf(w)})'
q node -e 'import("./yeshiva/purpose.mjs").then((m)=>{m.goalPsak("לשמור את השיחה עם הלקוח ולשלוח תזכורת מעל 3 ימים","ליבה");m.goalPsak("מערכת ניהול מלאי","ליבה")})'

# ── גל-4 · חציבה ──────────────────────────────────────────────────────────
SCR=$(ls new/dart-ui-bs/screens__*/*.dart 2>/dev/null | head -1)
[ -n "$SCR" ] && q node machtzev/carve/screen-decomp.mjs "$SCR"      # screen-decomp · אטום-לקידום
q node machtzev/carve/widget-dedup.mjs new/dart-ui-bs                 # widget-dedup · משפחות-רופפות
# carve-land (הצד-ה-JS של ast_carve.dart) — נחיתה לתיקייה זמנית, לא למדף (CARVE_OUT)
CO=$(mktemp -d); mkdir -p "$CO/dart" "$CO/dart-maor"
cat > "$CO/carved.json" <<'JSON'
[{"name":"qqWubble","ok":true,"trivial":true,"_srcRef":"buildsmart/app_flutter/lib/util/qqw.dart:10-12",
  "fnSource":"int qqWubble(int n) => n * n;","origName":"qqWubble","paramsSimple":true,
  "origParams":[{"name":"n","type":"int"}],"imports":[],"inlineTypes":[],"copiedTypes":[],"erasedTypes":[],
  "socketDecls":[],"socketMeta":[],"typeSamples":{"int":["1","2","3"]},"autoSocket":false}]
JSON
CARVE_OUT="$CO/" DART_SDK_BIN="${DART_SDK_BIN:-/root/dart-sdk/bin}" q node machtzev/carve/carve-land.mjs "$CO/carved.json"
q node machtzev/extract/functions.mjs maor                            # דורש machtzev/registry (צד-maor) — כאן קורס לפני הפסק

# ── גל-5 · כפילות ─────────────────────────────────────────────────────────
q node machtzev/dedup/dedup-atoms.mjs                                 # dedup-atoms · 4 עדשות
q node machtzev/dedup/dedup-cross.mjs                                 # dedup-cross · עדשת-שם בלבד
q node machtzev/dedup/dedup-cross-dart.mjs                            # dedup-cross-dart · שתי עדשות
q node machtzev/dedup/dedup.mjs                                       # dedup.load · קובצי-מרשם חסרים
q node machtzev/dedup/dedup-deep.mjs                                  # דורש machtzev/registry — קורס לפני הפסק
q node machtzev/dedup/reconcile.mjs                                   # דורש machtzev/registry — קורס לפני הפסק

# הרצת-המנוע-המלאה על מטרת-הליבה — המקור הגדול של מהלכים
q node machtzev/generator/behavior-plan.mjs --goal knowledge/connect/goals/liba.txt
# שחזור תופעות-הלוואי: המנועים כותבים תוצרים, והראיה אינה שינוי-עץ.
# **פר-נתיב**: `git checkout` עם רשימה נכשל כולו על נתיב-אחד-לא-מעוקב, וזה בדיוק
# איך שני קבצים נשארו דרוסים בריצה הראשונה (‏L110 §5: פקודת-שחזור שאיש לא בודק).
for f in machtzev/generator/goals machtzev/generator/atlas.json machtzev/generator/atlas-data.json \
         screens-seed machtzev/dedup/DEDUP-REPORT.md machtzev/dedup/OPTWINS-REPORT.md; do
  git checkout -- "$f" 2>/dev/null || true
done
git checkout -- machtzev/dedup/optwins.json 2>/dev/null || true
rm -f machtzev/dedup/dupdeep.json 2>/dev/null || true
#   רק **תוצרים**, לא מקורות-המנועים (אחרת הבדיקה סופרת את העבודה שבעץ כדריסה)
DIRTY=$(git status --porcelain machtzev/generator/goals machtzev/generator/atlas.json \
        machtzev/generator/atlas-data.json screens-seed \
        machtzev/dedup/DEDUP-REPORT.md machtzev/dedup/OPTWINS-REPORT.md 2>/dev/null)
[ -n "$DIRTY" ] && { echo "🔴 שחזור נכשל — העץ נשאר דרוס:"; echo "$DIRTY"; exit 1; }

echo "פנקס: $OUT · $(wc -l < "$OUT") מהלכים"
python3 - "$OUT" <<'PY'
import collections, json, sys
c = collections.Counter()
v = collections.Counter()
for line in open(sys.argv[1], encoding='utf-8'):
    r = json.loads(line)
    c[r['engine']] += 1
    b = r['rminhu']
    if 'none' in b:
        v['לא מצינו'] += 1
    else:
        for _, psak in b.get('sources', []):
            v[psak.split(':')[0]] += 1
print('לפי מנוע:')
for k, n in c.most_common():
    print(f'  {n:5d}  {k}')
print('לפי פסק:')
for k, n in v.most_common():
    print(f'  {n:5d}  {k}')
PY
