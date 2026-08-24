/** חוט · parse-acc — פענוח JSON העדפות-נגישות. חוזה: parse-acc.contract.md · טהור, אפס-שקעים.
 *  חולץ כלשונו מ-maor/src/lib/a11y.ts:49-59. */
export function parseAcc(raw) {
  const off = { contrast: false, noanim: false, links: false, spacing: false };
  if (!raw) return off;
  try {
    const a = JSON.parse(raw);
    return { contrast: !!a?.contrast, noanim: !!a?.noanim, links: !!a?.links, spacing: !!a?.spacing };
  } catch {
    return off;
  }
}
