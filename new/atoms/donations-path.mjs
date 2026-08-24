/** חוט · donations-path — נתיב אוסף-התרומות הנפרד (מסלול-B). חוזה: donations-path.contract.md
 *  חולץ מ-maor/src/lib/cloud-diff.ts:67-69 · שקעים: colPath, donationsCol (היו שכנים באותו קובץ). */
export function donationsPath(slug, cloudRoot, colPath, donationsCol) {
    return colPath(slug, cloudRoot, donationsCol);
}
