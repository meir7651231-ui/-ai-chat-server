cd "$(dirname "$0")"
node -e 'const o=JSON.parse(require("fs").readFileSync("endless-state.json"));process.stdout.write("const SEED="+JSON.stringify(o.shelf.map(({name,ins,ops,len})=>({name,ins,ops,len})))+";\n")' > seed.inc.js
{ cat page-head.html; echo "<script>"; cat seed.inc.js engine.inc.js page-run.js; echo "</script>"; } > rings-live.html
