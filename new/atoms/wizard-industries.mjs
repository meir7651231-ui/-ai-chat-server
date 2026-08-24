/** חוט · wizard-industries — תחומי-העסק לאשף מתוך חבילות-הוורטיקל (id·emoji·label·sub).
 *  חוזה: wizard-industries.contract.md
 *  חולץ כלשונו מ-maor/src/lib/signupWizard.ts:10-15 (תורגם TS→JS); במקור קבוע-מודול
 *  על VERTICAL_PACKS המיובא — השכן הוזרק כשקע packs (חוק-1 — אפס import פנימי). */
export function wizardIndustries(packs) {
    return packs.map((p) => ({
        id: p.id,
        emoji: p.emoji,
        label: p.label,
        sub: p.sub,
    }));
}
