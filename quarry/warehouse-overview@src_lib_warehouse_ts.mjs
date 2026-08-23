/** 🪨 טיוטת-חוט (דרגת-מחצבה) · warehouseOverview — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/warehouse.ts:31-67 (37 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): warehouseOverview, norm
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function warehouseOverview(warehouse, supporters) {
    // איסוף צריכה פר-שם-מנורמל: name → [{projectId, projectName, qty}]
    const used = new Map();
    for (const sp of supporters) {
        const mat = sp.ayin?.mat;
        if (!mat || !mat.length)
            continue;
        // צבירה פר-פרויקט-ושם (כמה מאותו-חומר בפרויקט אחד).
        const perName = new Map();
        for (const m of mat) {
            const k = norm(m.name);
            if (!k)
                continue;
            perName.set(k, (perName.get(k) || 0) + (+m.qty || 0));
        }
        for (const [k, qty] of perName) {
            if (qty <= 0)
                continue;
            used.set(k, [...(used.get(k) || []), { id: sp.id, name: sp.name, qty }]);
        }
    }
    return warehouse.map((item) => {
        const rows = used.get(norm(item.name)) || [];
        const allocated = rows.reduce((a, r) => a + r.qty, 0);
        const remaining = (+item.qty || 0) - allocated;
        return {
            item,
            allocated,
            remaining,
            short: remaining < 0,
            byProject: [...rows].sort((a, b) => b.qty - a.qty),
        };
    });
}
/** ערך-מלאי כולל (Σ qty×cost) — למדד-מחסן. */
