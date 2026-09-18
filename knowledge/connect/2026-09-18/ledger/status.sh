#!/usr/bin/env bash
# מדד-שלב-5, מחולל: לכל אחד מ-46 מנועי-החיפוש (‏PLAN-100 §2) — מחובר לשכבת-הוורמינהו?
# נעוץ? אזכור-בלבד? הפלט הוא המספר שהדוח נושא, ואין מספר שנכתב ביד.
#   bash knowledge/connect/2026-09-18/ledger/status.sh [--list]
set -uo pipefail
cd "$(dirname "$0")/../../../.." || exit 1
LIST="${1:-}"

ENGINES="machtzev/search-record.mjs machtzev/search-score.mjs machtzev/search-proof-check.mjs
machtzev/cross-source-check.mjs machtzev/generator/match.mjs machtzev/generator/cover.mjs
machtzev/generator/capability.mjs machtzev/generator/fillable.mjs machtzev/generator/atlas.mjs
machtzev/generator/particles.mjs machtzev/generator/ops-particles.mjs machtzev/generator/op-census.mjs
machtzev/generator/peruk.mjs machtzev/generator/hamtzaa.mjs machtzev/generator/intent.mjs
machtzev/generator/tzinor.mjs yeshiva/purpose.mjs machtzev/generator/retrieve-screen.mjs
machtzev/census/engine-index.mjs machtzev/carve/ast_carve.dart machtzev/carve/screen-decomp.mjs
machtzev/carve/widget-dedup.mjs machtzev/extract/functions.mjs machtzev/generator/quarry-golden.mjs
machtzev/dedup/dedup.mjs machtzev/dedup/dedup-atoms.mjs machtzev/dedup/dedup-cross.mjs
machtzev/dedup/dedup-cross-dart.mjs machtzev/dedup/dedup-deep.mjs machtzev/dedup/reconcile.mjs
machtzev/generator/behavior-plan.mjs machtzev/generator/logic-proof.mjs machtzev/generator/synth.mjs
machtzev/generator/auto-logic.mjs machtzev/generator/auto-skin.mjs machtzev/census/oracle.mjs
machtzev/census/atom-index.mjs machtzev/census/atom-census.mjs machtzev/census/logic-census.mjs
machtzev/census/import-graph.mjs machtzev/census.mjs machtzev/empire-coverage.mjs
machtzev/tools/box-coverage.mjs engine/atlas.mjs engine/lib.mjs gen/packs-apply.mjs"

n=0; wired=0; pinned=0; open_=0; missing=0
for f in $ENGINES; do
  n=$((n + 1))
  if [ ! -f "$f" ]; then missing=$((missing + 1)); [ "$LIST" = "--list" ] && printf 'MISSING  %s\n' "$f"; continue; fi
  w=$(grep -cE "from '[^']*rminhu\.mjs'" "$f" 2>/dev/null); w=${w:-0}
  p=$(grep -Fc "$f" machtzev/pins.sha256 2>/dev/null); p=${p:-0}
  if [ "$w" -gt 0 ]; then wired=$((wired + 1)); tag=WIRED
  elif [ "$p" -gt 0 ]; then pinned=$((pinned + 1)); tag=PINNED
  else open_=$((open_ + 1)); tag=OPEN; fi
  [ "$LIST" = "--list" ] && printf '%-8s %s\n' "$tag" "$f"
done
echo "מנועים: $n · מחוברים-לשכבה: $wired · נעוצים (דורשים Allow): $pinned · פתוחים-ולא-חוברו: $open_ · חסרים: $missing"
echo "אזכור-בלבד (grep 'ורמינהו|rminhu|--none' > 0 ובלי ייבוא-השכבה):"
for f in $ENGINES; do
  [ -f "$f" ] || continue
  m=$(grep -c 'ורמינהו\|rminhu\|--none' "$f" 2>/dev/null); m=${m:-0}
  w=$(grep -cE "from '[^']*rminhu\.mjs'" "$f" 2>/dev/null); w=${w:-0}
  [ "$m" -gt 0 ] && [ "$w" -eq 0 ] && printf '  %s (%s אזכורים)\n' "$f" "$m"
done
exit 0
