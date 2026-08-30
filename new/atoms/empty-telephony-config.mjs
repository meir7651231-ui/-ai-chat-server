/** חוט · empty-telephony-config — קודם אוטומטית (צילום-גטר). חוזה: empty-telephony-config.contract.md */
export function emptyTelephonyConfig(T) {
    return {
        numbers: [{ id: 'n1', e164: '', label: T.k1, kind: T.k2 }],
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
