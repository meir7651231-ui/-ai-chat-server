/** חוט · net-check-script — קודם אוטומטית (אפיון-Golden). חוזה: net-check-script.contract.md */
export function netCheckScript(results, T) {
    const blocked = results.filter((r) => !r.ok);
    if (!blocked.length)
        return '';
    return [
        T.k1,
        T.k2,
        ...blocked.map((r) => '• ' + r.domain),
        T.k3,
    ].join('\n');
}
