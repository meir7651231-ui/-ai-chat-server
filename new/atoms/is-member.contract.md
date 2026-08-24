# חוזה · חוט is-member
**תפקיד:** האם המייל חבר בארגון — מנהל-הארגון (דרך שקע ‏isOrgManager) **או**
מופיע ב-‏org.members (כל חבר-שמור מנורמל ‏trim+toLowerCase לפני ההשוואה;
המייל הנבדק מנורמל דרך שקע-normEmail). ‏members חסר ⇒ רשימה ריקה.
**שקעים (חוק-1 — קריאות-שכן הוזרקו כפרמטרים):**
- ‏normEmail(email) — מנרמל-מייל (בקוד-המקור: ‏trim().toLowerCase()).
- ‏isOrgManager(email, org) — האם מנהל-הארגון (החוט השכן ‏is-org-manager;
  הקופסה מחווטת אותו לשקע — כבר עם שקע-הנירמול שלו סגור).
**קלט:** ‏email (מחרוזת) · ‏org (‏{manager?: string, members?: string[]}) ·
שקע-normEmail · שקע-isOrgManager. **פלט:** boolean.
**דוגמאות מחייבות** (בכולן ‏nrm=(e)=>e.trim().toLowerCase() ·
‏mgr=(e,o)=>{const m=(o.manager??'').trim().toLowerCase(); return !!m&&nrm(e)===m;}):
1. ‏email='boss@x.com' · ‏org={manager:'Boss@x.com', members:[]} ⇒ true —
   מנהל הוא תמיד חבר, גם בלי להופיע ב-members.
2. ‏email=' Anna@x.com' · ‏org={manager:'boss@x.com', members:['anna@x.com ']} ⇒
   true — חברה ברשימה, נירמול דו-צדדי.
3. ‏email='guest@x.com' · ‏org={manager:'boss@x.com', members:['anna@x.com']} ⇒
   false — לא מנהל ולא ברשימה.
4. ‏email='a@x.com' · ‏org={} ⇒ false — אין מנהל ואין members (‏?? []).
5. ‏email='b@x.com' · ‏org={members:[' B@X.com ']} ⇒ true — נירמול-החברים
   (trim+lower) מאחד גם רישיות וגם רווחים.
**מוצא:** maor/src/components/platform/lib.ts:163-168 (‏isMember, היררכיית
ORGADMIN + שער-החברות). השכנים normEmail ו-isOrgManager הפכו לשקעים (חוק-1).
