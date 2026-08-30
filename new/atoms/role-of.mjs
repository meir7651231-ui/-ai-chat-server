/** חוט · role-of — תפקיד-משתמש מהקונפיג לפי מייל: admin ⇒ teacher ⇒ staff.
 *  חוזה: role-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:650-659 (תורגם TS→JS). טהור, אפס שקעים;
 *  המיילים = קלט-ריצה בלבד (חוק-6 — זהות אינה אטום). */
export function roleOf(config, email, T) {
    const e = (email || '').trim().toLowerCase();
    if (!e)
        return T.k1;
    if (config.adminEmails?.some((a) => a.trim().toLowerCase() === e))
        return T.k2;
    const teachers = config.roles?.teachers;
    if (teachers && Object.keys(teachers).some((k) => k.trim().toLowerCase() === e))
        return T.k3;
    return T.k1;
}
