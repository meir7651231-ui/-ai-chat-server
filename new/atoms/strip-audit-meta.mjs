/** חוט · strip-audit-meta — קודם אוטומטית (אפיון-Golden). חוזה: strip-audit-meta.contract.md */
export function stripAuditMeta(meta) {
    if (!('audit' in meta))
        return meta;
    const rest = { ...meta };
    delete rest.audit;
    return rest;
}
