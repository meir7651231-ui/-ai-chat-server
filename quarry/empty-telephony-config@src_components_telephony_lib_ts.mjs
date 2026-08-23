/** 🪨 טיוטת-חוט (דרגת-מחצבה) · emptyTelephonyConfig — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/telephony/lib.ts:34-53 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): emptyTelephonyConfig
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function emptyTelephonyConfig() {
    return {
        numbers: [{ id: 'n1', e164: '', label: 'קו ראשי', kind: 'sim' }],
        officeDays: [0, 1, 2, 3, 4],
        officeStart: '09:00',
        officeEnd: '17:00',
        officeExt: '101',
        managerExt: '201',
        vmBox: '100',
        city: '',
        kosherMode: false,
        hebrewCalendar: true,
        zmanim: false,
        shabbat: true,
        fasts: false,
        voicemail: true,
    };
}
/** slug תקין ל-tenantId (אותיות-קטנות/ספרות/מקף, 3–40) מתוך שם-הארגון/slug. */
