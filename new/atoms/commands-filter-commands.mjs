/** חוט · commands-filter-commands — Golden. חוזה: commands-filter-commands.contract.md
 * מוצא: commands.ts:85 (filterCommands) + norm:45 (inline). חוק-4 verbatim.
 * מסנן פקודות לפי שאילתה. ריק ⇒ פעולות (בלי כרטיסי-תורם) בראש. טהור, אפס-שקעים.
 */
export function filterCommands(commands, query, limit = 12) {
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const q = norm(query);
  if (!q) return commands.filter((c) => c.kind !== 'openDonor').slice(0, limit);
  const tokens = q.split(' ');
  const scored = [];
  for (const c of commands) {
    if (!tokens.every((t) => c.keywords.includes(t))) continue;
    const nl = norm(c.label);
    let score = nl === q ? 100 : nl.startsWith(q) ? 60 : nl.includes(q) ? 40 : 20;
    if (c.kind !== 'openDonor') score += 5;
    scored.push({ c, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.c);
}
