/** חוט · sessions-of — המפגשים-בפועל של חוג: מערך-המפגשים או נפילה למפגש-יחיד.
 *  חוזה: sessions-of.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:84-91 (תורגם TS→JS);
 *  טהור לחלוטין — אפס שקעים, אפס import (חוק-1). */
export function sessionsOf(c) {
    return c.sessions && c.sessions.length ? c.sessions : [{ day: c.weekday, time: c.time, label: '' }];
}
