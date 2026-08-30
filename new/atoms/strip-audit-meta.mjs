/** חוט · strip-audit-meta — קודם אוטומטית (אפיון-Golden). חוזה: strip-audit-meta.contract.md */
export function stripAuditMeta(meta, T) {
    if (!(T.k1 in meta))
        return meta;
    const rest = { ...meta };
    delete rest.audit;
    return rest;
}
