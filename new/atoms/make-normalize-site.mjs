/** 🔌 חוט-מפעל · make-normalize-site — חיטוי תוכן-האתר-הציבורי: allowlist מלא + תקרות.
 *  הקונפיג מסתנכרן לענן/גיבוי ⇒ כל שדה זר נזרק; קישורים https-בלבד; טקסטים מגוזמים.
 *  חסר/לא-אובייקט ⇒ undefined (אין אתר-ציבורי — ביט-זהה).
 *  מוצא: maor/src/lib/config.ts:216-512 כלשונו (עוזרי-הקובץ הפרטיים siteStr/normLocalized/
 *  sitePosNum/sitePhone נכללו); ‏safeHttpsUrl ו-SITE_LANGS הוזרקו כשקעי-מפעל (חוק-1).
 *  @param safeHttpsUrl שקע: (raw)=>string|null · @param SITE_LANGS שקע: readonly string[] */
export function makeNormalizeSite(safeHttpsUrl, SITE_LANGS, T, cf) {
  function siteStr(v, max) {
      return typeof v === T.k1 ? v.replace(/\p{Cc}/gu, '').trim().slice(0, max) : '';
  }
  /** טקסט רב-לשוני: מחרוזת ⇒ מגוזמת; מפה ⇒ רק שפות-allowlist עם ערך לא-ריק; אחרת undefined. */
  function normLocalized(v, max) {
      if (typeof v === T.k1) {
          const s = siteStr(v, max);
          return s || undefined;
      }
      if (v && typeof v === T.k2 && !Array.isArray(v)) {
          const out = {};
          for (const l of SITE_LANGS) {
              const s = siteStr(v[l], max);
              if (s)
                  out[l] = s;
          }
          return Object.keys(out).length ? out : undefined;
      }
      return undefined;
  }
  /** מספר חיובי-סופי או undefined. */
  function sitePosNum(v) {
      return typeof v === T.k3 && Number.isFinite(v) && v >= 0 ? v : undefined;
  }
  /** טלפון לתצוגה/חיוג — ספרות ‎+()- ‎ ורווח בלבד, עד 24. */
  function sitePhone(v) {
      return typeof v === T.k1 ? v.replace(/[^\d+()\-\s]/g, '').trim().slice(0, T.k15) : '';
  }
  /**
   * חיטוי תוכן-האתר-הציבורי — allowlist מלא + תקרות. הקונפיג מסתנכרן לענן/גיבוי,
   * לכן כל שדה זר נזרק; קישורים https בלבד (safeHttpsUrl); טקסטים מגוזמים. חסר/
   * לא-אובייקט ⇒ undefined (⇒ אין אתר ציבורי, ביט-זהה להיום).
   */
  function normalizeSite(raw) {
      if (!raw || typeof raw !== T.k2 || Array.isArray(raw))
          return undefined;
      const s = raw;
      const out = {};
      if (s.enabled === false)
          out.enabled = false;
      else if (s.enabled === true)
          out.enabled = true;
      const icon = siteStr(s.icon, T.k16);
      if (icon)
          out.icon = icon;
      const langs = Array.isArray(s.langs)
          ? [...new Set(s.langs.filter((l) => SITE_LANGS.includes(l)))]
          : [];
      if (langs.length)
          out.langs = langs;
      const tagline = normLocalized(s.tagline, T.k17);
      if (tagline)
          out.tagline = tagline;
      if (Array.isArray(s.heroWords)) {
          const words = s.heroWords.map((w) => normLocalized(w, T.k18)).filter((w) => !!w).slice(0, 8);
          if (words.length)
              out.heroWords = words;
      }
      if (Array.isArray(s.stats)) {
          const stats = s.stats
              .map((st) => {
              if (!st || typeof st !== T.k2)
                  return null;
              const o = st;
              const value = siteStr(o.value, T.k15);
              const label = normLocalized(o.label, T.k18);
              return value && label ? { value, label } : null;
          })
              .filter((x) => !!x)
              .slice(0, 8);
          if (stats.length)
              out.stats = stats;
      }
      if (s.liveFamilies === true)
          out.liveFamilies = true;
      const lfl = normLocalized(s.liveFamiliesLabel, T.k18);
      if (lfl)
          out.liveFamiliesLabel = lfl;
      if (s.campaign && typeof s.campaign === T.k2 && !Array.isArray(s.campaign)) {
          const c = s.campaign;
          const camp = {};
          const ct = normLocalized(c.title, T.k19);
          if (ct)
              camp.title = ct;
          const goal = sitePosNum(c.goal);
          if (goal !== undefined)
              camp.goal = goal;
          const raised = sitePosNum(c.raised);
          if (raised !== undefined)
              camp.raised = raised;
          const end = siteStr(c.end, T.k20);
          if (end)
              camp.end = end;
          const cur = siteStr(c.currency, 4);
          if (cur)
              camp.currency = cur;
          if (Object.keys(camp).length)
              out.campaign = camp;
      }
      if (Array.isArray(s.services)) {
          const svcs = s.services
              .map((sv) => {
              if (!sv || typeof sv !== T.k2)
                  return null;
              const o = sv;
              const title = normLocalized(o.title, T.k21);
              if (!title)
                  return null;
              const svc = { title };
              const icon = siteStr(o.icon, T.k16);
              if (icon)
                  svc.icon = icon;
              const text = normLocalized(o.text, T.k22);
              if (text)
                  svc.text = text;
              return svc;
          })
              .filter((x) => !!x)
              .slice(0, T.k16);
          if (svcs.length)
              out.services = svcs;
      }
      const news = normLocalized(s.news, T.k23);
      if (news)
          out.news = news;
      const story = normLocalized(s.story, T.k24);
      if (story)
          out.story = story;
      if (Array.isArray(s.gallery)) {
          const imgs = s.gallery
              .map((g) => (typeof g === T.k1 ? safeHttpsUrl(g) : null))
              .filter((g) => !!g)
              .slice(0, T.k15);
          if (imgs.length)
              out.gallery = imgs;
      }
      if (s.contact && typeof s.contact === T.k2 && !Array.isArray(s.contact)) {
          const c = s.contact;
          const contact = {};
          if (Array.isArray(c.phones)) {
              const phones = c.phones.map(sitePhone).filter((p) => p).slice(0, 8);
              if (phones.length)
                  contact.phones = phones;
          }
          const wa = sitePhone(c.whatsapp);
          if (wa)
              contact.whatsapp = wa;
          const email = siteStr(c.email, T.k19);
          if (email && email.includes('@'))
              contact.email = email;
          const addr = normLocalized(c.address, T.k17);
          if (addr)
              contact.address = addr;
          const hours = normLocalized(c.hours, T.k19);
          if (hours)
              contact.hours = hours;
          const taxNote = normLocalized(c.taxNote, T.k17);
          if (taxNote)
              contact.taxNote = taxNote;
          if (typeof c.mapUrl === T.k1) {
              const mu = safeHttpsUrl(c.mapUrl);
              if (mu)
                  contact.mapUrl = mu;
          }
          if (Object.keys(contact).length)
              out.contact = contact;
      }
      if (typeof s.donateUrl === T.k1) {
          const u = safeHttpsUrl(s.donateUrl);
          if (u)
              out.donateUrl = u;
      }
      /* ── עיצוב-דף-התרומות: שדות חדשים (allowlist + תקרות) ── */
      const imgUrl = (v) => (typeof v === T.k1 ? safeHttpsUrl(v) || undefined : undefined);
      const setLT = (k, v, max) => {
          const t = normLocalized(v, max);
          if (t)
              out[k] = t;
      };
      const hi = imgUrl(s.heroImage);
      if (hi)
          out.heroImage = hi;
      setLT(T.k4, s.heroTitle, T.k21);
      setLT(T.k5, s.brandLine, T.k18);
      setLT(T.k6, s.heroBadge, T.k21);
      setLT(T.k7, s.titleAccent, T.k18);
      setLT(T.k8, s.servicesHeading, T.k21);
      setLT(T.k9, s.microCopy, T.k19);
      setLT(T.k10, s.ticker, T.k25);
      setLT(T.k11, s.storyTitle, T.k19);
      setLT(T.k12, s.storyTitleAccent, T.k21);
      setLT(T.k13, s.storyBadge, T.k21);
      setLT(T.k14, s.donateNote, T.k22);
      if (Array.isArray(s.marquee)) {
          const mq = s.marquee.map((m) => normLocalized(m, T.k21)).filter((m) => !!m).slice(0, 16);
          if (mq.length)
              out.marquee = mq;
      }
      if (s.calc && typeof s.calc === T.k2 && !Array.isArray(s.calc)) {
          const c = s.calc;
          const calc = {};
          const amt = sitePosNum(c.unitAmount);
          if (amt !== undefined)
              calc.unitAmount = amt;
          const unit = normLocalized(c.unit, T.k18);
          if (unit)
              calc.unit = unit;
          const note = normLocalized(c.note, T.k19);
          if (note)
              calc.note = note;
          if (Object.keys(calc).length)
              out.calc = calc;
      }
      if (Array.isArray(s.tiers)) {
          const tiers = s.tiers.map((tr) => {
              if (!tr || typeof tr !== T.k2)
                  return null;
              const o = tr;
              const name = normLocalized(o.name, T.k18);
              if (!name)
                  return null;
              const t = { name };
              const amt = sitePosNum(o.amount);
              if (amt !== undefined)
                  t.amount = amt;
              const period = normLocalized(o.period, T.k26);
              if (period)
                  t.period = period;
              if (Array.isArray(o.perks)) {
                  const perks = o.perks.map((p) => normLocalized(p, T.k27)).filter((p) => !!p).slice(0, 8);
                  if (perks.length)
                      t.perks = perks;
              }
              if (o.featured === true)
                  t.featured = true;
              const url = imgUrl(o.url);
              if (url)
                  t.url = url;
              return t;
          }).filter((x) => !!x).slice(0, 6);
          if (tiers.length)
              out.tiers = tiers;
      }
      if (Array.isArray(s.testimonials)) {
          const items = s.testimonials.map((tt) => {
              if (!tt || typeof tt !== T.k2)
                  return null;
              const o = tt;
              const quote = normLocalized(o.quote, T.k28);
              if (!quote)
                  return null;
              const t = { quote };
              const author = siteStr(o.author, T.k21);
              if (author)
                  t.author = author;
              const role = normLocalized(o.role, T.k21);
              if (role)
                  t.role = role;
              return t;
          }).filter((x) => !!x).slice(0, T.k16);
          if (items.length)
              out.testimonials = items;
      }
      if (Array.isArray(s.faq)) {
          const items = s.faq.map((f) => {
              if (!f || typeof f !== T.k2)
                  return null;
              const o = f;
              const q = normLocalized(o.q, T.k17);
              const a = normLocalized(o.a, T.k23);
              return q && a ? { q, a } : null;
          }).filter((x) => !!x).slice(0, T.k29);
          if (items.length)
              out.faq = items;
      }
      if (Array.isArray(s.events)) {
          const items = s.events.map((e) => {
              if (!e || typeof e !== T.k2)
                  return null;
              const o = e;
              const title = normLocalized(o.title, T.k19);
              if (!title)
                  return null;
              const ev = { title };
              const date = siteStr(o.date, T.k20);
              if (date)
                  ev.date = date;
              const meta = normLocalized(o.meta, T.k19);
              if (meta)
                  ev.meta = meta;
              const url = imgUrl(o.url);
              if (url)
                  ev.url = url;
              return ev;
          }).filter((x) => !!x).slice(0, T.k16);
          if (items.length)
              out.events = items;
      }
      if (Array.isArray(s.partners)) {
          const items = s.partners.map((p) => {
              if (!p || typeof p !== T.k2)
                  return null;
              const o = p;
              const name = siteStr(o.name, T.k21);
              if (!name)
                  return null;
              const pt = { name };
              const logo = imgUrl(o.logo);
              if (logo)
                  pt.logo = logo;
              const url = imgUrl(o.url);
              if (url)
                  pt.url = url;
              return pt;
          }).filter((x) => !!x).slice(0, T.k15);
          if (items.length)
              out.partners = items;
      }
      if (s.transparency && typeof s.transparency === T.k2 && !Array.isArray(s.transparency)) {
          const o = s.transparency;
          const tr = {};
          const heading = normLocalized(o.heading, T.k19);
          if (heading)
              tr.heading = heading;
          const text = normLocalized(o.text, T.k30);
          if (text)
              tr.text = text;
          const url = imgUrl(o.reportsUrl);
          if (url)
              tr.reportsUrl = url;
          if (Array.isArray(o.badges)) {
              const badges = o.badges.map((b) => normLocalized(b, T.k18)).filter((b) => !!b).slice(0, 6);
              if (badges.length)
                  tr.badges = badges;
          }
          if (Object.keys(tr).length)
              out.transparency = tr;
      }
      /* ── סיפור: מייסד/ת + ציר-זמן ── */
      if (s.founder && typeof s.founder === T.k2 && !Array.isArray(s.founder)) {
          const o = s.founder;
          const f = {};
          const name = normLocalized(o.name, T.k21);
          if (name)
              f.name = name;
          const quote = normLocalized(o.quote, T.k17);
          if (quote)
              f.quote = quote;
          const photo = imgUrl(o.photo);
          if (photo)
              f.photo = photo;
          if (Object.keys(f).length)
              out.founder = f;
      }
      if (Array.isArray(s.timeline)) {
          const items = s.timeline.map((m) => {
              if (!m || typeof m !== T.k2)
                  return null;
              const o = m;
              const year = siteStr(o.year, T.k16);
              const title = normLocalized(o.title, T.k19);
              if (!year || !title)
                  return null;
              const it = { year, title };
              const note = normLocalized(o.note, T.k25);
              if (note)
                  it.note = note;
              return it;
          }).filter((x) => !!x).slice(0, T.k31);
          if (items.length)
              out.timeline = items;
      }
      if (s.growth && typeof s.growth === T.k2 && !Array.isArray(s.growth)) {
          const o = s.growth;
          const g = {};
          const label = normLocalized(o.label, T.k19);
          if (label)
              g.label = label;
          const delta = siteStr(o.delta, T.k26);
          if (delta)
              g.delta = delta;
          if (Array.isArray(o.points)) {
              const pts = o.points.map((p) => (typeof p === T.k3 && Number.isFinite(p) ? Math.max(0, Math.min(1, p)) : null)).filter((p) => p !== null).slice(0, T.k26);
              if (pts.length >= 2)
                  g.points = pts;
          }
          if (Object.keys(g).length)
              out.growth = g;
      }
      if (Array.isArray(s.paymentMethods)) {
          const items = s.paymentMethods.map((p) => {
              if (!p || typeof p !== T.k2)
                  return null;
              const o = p;
              const label = normLocalized(o.label, T.k18);
              const detail = normLocalized(o.detail, T.k17);
              if (!label || !detail)
                  return null;
              const pm = { label, detail };
              if (o.ltr === true)
                  pm.ltr = true;
              return pm;
          }).filter((x) => !!x).slice(0, 6);
          if (items.length)
              out.paymentMethods = items;
      }
      if (s.contactForm && typeof s.contactForm === T.k2 && !Array.isArray(s.contactForm)) {
          const o = s.contactForm;
          if (o.enabled === true)
              cf.enabled = true;
          else if (o.enabled === false)
              cf.enabled = false;
          const note = normLocalized(o.note, T.k17);
          if (note)
              cf.note = note;
          if (Object.keys(cf).length)
              out.contactForm = cf;
      }
      return Object.keys(out).length ? out : undefined;
  }
  return normalizeSite;
}
