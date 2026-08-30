/** חוט · commands-filter-commands — Golden. חוזה: commands-filter-commands.contract.md
 * מוצא: commands.ts:85 (filterCommands) + norm:45 (inline). חוק-4 verbatim.
 * מסנן פקודות לפי שאילתה. ריק ⇒ פעולות (בלי כרטיסי-תורם) בראש. טהור, אפס-שקעים.
 */
export function filterCommands(commands, query, limit = 12, T) {
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const q = norm(query);
  if (!q) return commands.filter((c) => c.kind !== T.k1).slice(0, limit);
  const tokens = q.split(' ');
  const scored = [];
  for (const c of commands) {
    if (!tokens.every((t) => c.keywords.includes(t))) continue;
    const nl = norm(c.label);
    let score = nl === q ? T.k2 : nl.startsWith(q) ? T.k3 : nl.includes(q) ? T.k4 : T.k5;
    if (c.kind !== T.k1) score += 5;
    scored.push({ c, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.c);
}
