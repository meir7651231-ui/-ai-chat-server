/** 🪨 טיוטת-חוט (דרגת-מחצבה) · parseFamiliesCsv — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/familiesImport.ts:60-114 (55 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): parseFamiliesCsv, clean, normName, digits
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function parseFamiliesCsv(rows, existing) {
    const news = [];
    const upds = [];
    for (const r of rows.slice(1)) {
        let name = clean(r[0]);
        if (!name || name.includes('שם פרטי שם משפחה'))
            continue;
        let isFair = false;
        if (/יריד חנוכה/.test(name)) {
            isFair = true;
            name = clean(name.replace(/-?\s*יריד חנוכה תשפ..?/g, ''));
        }
        name = clean(name.replace('#NAME?', ''));
        if (!name)
            continue;
        let city = clean(r[6]);
        if (city === 'רגיל')
            city = '';
        if (city === 'ביתר' || city === 'ביתר עלית')
            city = 'ביתר עילית';
        const noteRaw = r[12] || '';
        const stc = clean((noteRaw.match(/סטטוס:\s*([^\n]+)/) || [])[1] || '');
        const obj = {
            name,
            father: '',
            mother: clean(r[3]),
            fatherId: clean(r[1]),
            motherId: clean(r[4]),
            phone: clean(r[2]) === '-' ? '' : clean(r[2]),
            phone2: clean(r[5]) === '-' ? '' : clean(r[5]),
            email: '',
            address: clean([r[7], r[8]].map(clean).filter(Boolean).join(' ')),
            city,
            status: stc.includes('לא פעיל') ? 'inactive' : 'active',
            maritalStatus: stc.includes('אלמנ') || (r[9] || '').includes('אלמן')
                ? 'אלמן/ה'
                : stc.includes('גרוש')
                    ? 'גרושים'
                    : 'נשואים',
            language: 'עברית',
            community: clean(r[10]) || 'חסידי',
            notes: isFair ? 'השתתפה ביריד חנוכה תשפ"ו' : '',
        };
        const ex = existing.find((f) => normName(f.name) === normName(name) &&
            (!digits(obj.phone) || !digits(f.phone) || digits(f.phone) === digits(obj.phone)));
        if (ex)
            upds.push({ id: ex.id, obj });
        else
            news.push(obj);
    }
    return { news, upds };
}
/**
 * החלת עדכון על משפחה קיימת — רק ערכים לא-ריקים דורסים (legacy:1005:
 * `if (obj[k]) f[k] = obj[k]`, בדילוג members/docs). טהור ואימוטבילי.
 */
