/** חוט · donation-split-on — האם פיצול-התרומות (מסלול-B) פעיל. חוזה: donation-split-on.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:63-65 (opt-in מפורש — חסר=כבוי). */
export function donationSplitOn(cfg) {
    return cfg.donationSplit === true;
}
