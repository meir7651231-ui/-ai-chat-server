// G20 · loader-hook: מקור האטום-הנבדק (TT_ATOM) עובר שינוי-צורה — היצוא נעטף במקליט (globalThis.__ttRec) בלי לשנות התנהגות
export async function load(url, context, next) {
  const r = await next(url, context);
  if (process.env.TT_ATOM && url === process.env.TT_ATOM && r.source) {
    let src = String(r.source);
    const names = [];
    src = src.replace(/^export\s+(async\s+)?function\s+(\w+)\s*\(/gm, (m, a, n) => { names.push(n); return `${a || ''}function ${n}__o(`; });
    src = src.replace(/^export\s+const\s+(\w+)\s*=\s*(\(|async\s*\(|function)/gm, (m, n, rest) => { names.push(n); return `const ${n}__o = ${rest}`; });
    src += '\n' + names.map((n) => `export const ${n} = globalThis.__ttRec('${n}', ${n}__o);`).join('\n') + '\n';
    return { ...r, source: src, shortCircuit: true };
  }
  return r;
}
