/** חוט · strip-audit-meta — קודם אוטומטית (אפיון-Golden). חוזה: strip-audit-meta.contract.md */
export function stripAuditMeta(meta) {
    if (!('audit' in meta))
        return meta;
    const { audit: _a, ...rest } = meta;
    void _a;
    return rest;
}
