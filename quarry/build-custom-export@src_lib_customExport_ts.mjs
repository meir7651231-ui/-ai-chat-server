/** 🪨 טיוטת-חוט (דרגת-מחצבה) · buildCustomExport — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/customExport.ts:159-323 (165 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): buildCustomExport, expFieldDefs, pick, sessionsOf, enrollCount, hebParts, getTime, setDate, getDate, isoOf, hebAnnualEq, hebDateFull
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function buildCustomExport(cfg, db, target, range, selectedKeys) {
    const defs = expFieldDefs(cfg, target).filter((f) => selectedKeys.includes(f.key));
    const rows = [defs.map((f) => f.label)];
    if (!defs.length)
        return rows;
    const pick = (obj) => defs.map((f) => obj[f.key] ?? '');
    if (target === 'courses') {
        // אינדקס בני משפחה לשמות התלמידים (בלי לגעת ב-store); טלפון — של הילד/ה,
        // fallback לטלפון המשפחה (לעמודת studentsFull של הדוח המלא)
        const memberInfo = new Map();
        for (const fam of db.families)
            for (const m of fam.members)
                memberInfo.set(m.id, { first: m.first, phone: m.phone || fam.phone || '' });
        const roomName = new Map(db.rooms.map((r) => [r.id, r.name]));
        for (const c of db.courses) {
            const ens = db.enrollments.filter((e) => e.courseId === c.id);
            let payN = 0;
            let paySum = 0;
            let absN = 0;
            let revenue = 0;
            for (const e of ens) {
                for (const p of e.payments) {
                    revenue += p.amount || 0;
                    if (inR(p.date, range)) {
                        payN++;
                        paySum += p.amount || 0;
                    }
                }
                for (const ab of e.absences)
                    if (inR(ab.date, range))
                        absN++;
            }
            const t = db.teachers.find((x) => x.id === c.teacherId);
            rows.push(pick({
                name: c.name,
                teacher: (t?.name || '') + (t?.phone ? ' ' + t.phone : ''),
                grade: c.gradeMin || c.gradeMax ? [c.gradeMin, c.gradeMax].filter(Boolean).join('–') : '',
                audience: c.audience || '',
                room: roomName.get(c.roomId) || '',
                schedule: sessionsOf(c)
                    .map((s) => ('יום ' + DAY_NAMES[s.day] + (s.time ? ' ' + s.time : '')).trim())
                    .join(' · '),
                model: (c.model === 'punch'
                    ? 'כרטיסייה'
                    : c.model === 'half_year'
                        ? 'מנוי חצי-שנתי'
                        : c.model === 'year'
                            ? 'מנוי שנתי'
                            : 'מנוי חודשי') +
                    ' · ₪' +
                    (c.price || 0),
                occ: enrollCount(db, c.id) + '/' + (c.maxStudents || '—'),
                students: ens.map((e) => memberInfo.get(e.memberId)?.first || '').filter(Boolean).join(' · '),
                studentsFull: ens
                    .map((e) => {
                    const mi = memberInfo.get(e.memberId);
                    if (!mi)
                        return '';
                    const paid = (e.payments || []).reduce((a, p) => a + (p.amount || 0), 0);
                    return mi.first + (mi.phone ? ' ' + mi.phone : '') + ' · יתרה ₪' + Math.max(0, (e.totalDue || 0) - paid);
                })
                    .filter(Boolean)
                    .join(' | '),
                pays: payN + ' תשלומים · ₪' + paySum,
                revenue: '₪' + revenue,
                abs: absN + ' חיסורים',
                notes: c.notes || '',
            }));
        }
        return rows;
    }
    if (target === 'events') {
        const bounded = !!range.from && !!range.to;
        const occ = [];
        for (const ev of db.events) {
            if (!ev.date)
                continue;
            const rec = {
                title: ev.title,
                type: ev.customType || EV_META[ev.type].label,
                time: ev.time || '',
                fam: db.families.find((f) => f.id === ev.famId)?.name || '',
                notes: ev.notes || '',
                done: ev.done,
            };
            if (HEBREW_RECURRING.has(ev.type) && bounded) {
                const oh = hebParts(new Date(ev.date + 'T12:00:00'));
                const d0 = new Date(range.from + 'T12:00:00');
                const d1raw = new Date(range.to + 'T12:00:00');
                // תקרת-ימים (עקבי עם courseDaily MAX_DAYS) — טעות בשנת "עד" (טווח של
                // עשרות שנים) הקפיאה את הדפדפן בלולאה יום-יום. חוסמים ל-~11 שנים.
                const CAP_DAYS = 4000;
                const capped = new Date(d0.getTime() + CAP_DAYS * 86400000);
                const d1 = d1raw < capped ? d1raw : capped;
                for (let dd = new Date(d0); dd <= d1; dd.setDate(dd.getDate() + 1)) {
                    // נרמול אדר משותף — עקבי עם הלוח והבית; בלעדיו אזכרה ב"אדר" נעדרת מהייצוא בשנה מעוברת.
                    // חסם תחתון >= ev.date — עקבי עם eventsOnDate/eventOccursOn; בלעדיו נוצרות שורות רפאים לפני האירוע.
                    // (עוגן, יום-נבדק) — oh הוא תאריך האירוע המקורי, dd היום שנסרק; הסדר קריטי מאז שהשוויון א-סימטרי.
                    if (isoOf(dd) >= ev.date && hebAnnualEq(oh, hebParts(dd)))
                        occ.push({ ...rec, date: isoOf(dd) });
                }
            }
            else if (inR(ev.date, range) || (!range.from && !range.to)) {
                occ.push({ ...rec, date: ev.date });
            }
        }
        occ.sort((a, b) => a.date.localeCompare(b.date));
        for (const o of occ) {
            rows.push(pick({
                title: o.title,
                type: o.type,
                hdate: hebDateFull(o.date),
                gdate: fmtD(o.date),
                time: o.time,
                fam: o.fam,
                notes: o.notes,
                done: o.done ? 'כן' : 'לא',
            }));
        }
        return rows;
    }
    // supporters
    const ayinOn = featureOn(cfg, 'supporters.ayin');
    for (const sp of db.supporters) {
        const dons = sp.donations.filter((d) => inR(d.date, range));
        const a = sp.ayin;
        const answers = a ? a.answers.filter((x) => inR(x.date, range)) : [];
        const touchedInRange = ayinOn && !!a && (inR(a.lastTouch, range) || a.log.some((l) => inR(l.date, range)));
        if (!(dons.length || answers.length || touchedInRange))
            continue;
        const ils = dons.filter((d) => d.cur !== '$').reduce((x, d) => x + (+d.amount || 0), 0);
        const usd = dons.filter((d) => d.cur === '$').reduce((x, d) => x + (+d.amount || 0), 0);
        const obj = {
            name: sp.name,
            phone: sp.phone || '',
            email: sp.email || '',
            address: sp.address || '',
            city: sp.city || '',
            cat: sp.cat || '',
            forWho: sp.forWho || '',
            dons: dons.length + ' ' + termOf(cfg, 'entity.donations', 'תרומות') + ' · ₪' + ils + (usd ? ' + $' + usd : ''),
            // "כל-הזמן" = הצבירה המוצגת (קבלות + היסטוריה) — הכרעת-בעלים 9.8 "לכולל":
            // CSV הוא משטח-תצוגה, לכן supCount/supIls/supUsd (כולל hist), לא המונים השמורים.
            donsAll: supCount(sp) + ' ' + termOf(cfg, 'entity.donations', 'תרומות') + ' · ₪' + supIls(sp) + (supUsd(sp) ? ' + $' + supUsd(sp) : ''),
            tier: supTier(supScore(sp, db.usdRate)).label,
            notes: sp.notes || '',
        };
        if (ayinOn && a) {
            obj.stage = stageLabel(cfg, a.stage);
            obj.names = a.names
                .map((n) => n.name + (n.eyes !== '' && n.eyes != null ? ' ·' + n.eyes : '') + (n.done ? ' ✓' : ''))
                .join(' · ');
            obj.eyesTotal = String(a.names.reduce((x, n) => x + (+n.eyes || 0), 0));
            obj.paid = a.paid ? 'כן' : 'לא';
            obj.answers = answers.map((x) => x.note).join(' | ');
            obj.next = a.nextTalk ? fmtD(a.nextTalk) + (a.nextTalkTime ? ' ' + a.nextTalkTime : '') : '';
        }
        rows.push(pick(obj));
    }
    return rows;
}
