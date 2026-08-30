/** 🔌 חוט-מפעל · make-normalize-config — מחטא-הקונפיג הראשי (הלב של ה-White-label):
 *  allowlist-הרחבות · דגלי-true-מפורש (cloudRoot/donationSplit/supporterEnforce) ·
 *  emoji<=12 · motion-allowlist · accentCustom=true-בלבד · תבניות-allowlist · אתר/טלפוניה
 *  דרך המחטאים הייעודיים. זבל ⇒ null.
 *  מוצא: maor/src/lib/config.ts:515-631 כלשונו + normalizeFirebase הפרטי (128-145);
 *  התלויות הוזרקו כשקעי-מפעל (חוק-1).
 *  @param deps { DEFAULT_CONFIG, INTEGRATION_KEYS, INTEGRATION_SETTING_KEYS, MOTION_KEYS,
 *                TEMPLATE_KEYS, normalizeSite, normalizeTelephony } */
export function makeNormalizeConfig(deps, T) {
  const { DEFAULT_CONFIG, INTEGRATION_KEYS, INTEGRATION_SETTING_KEYS, MOTION_KEYS, TEMPLATE_KEYS, normalizeSite, normalizeTelephony } = deps;
  T.k1;
  /** צבע-CSS בטוח בלבד (hex/rgb/hsl/keyword) — חוסם הזרקת url() וכו' ל-`--accent`.
   *  מוצא: maor/src/lib/config.ts:866-872 כלשונו (פונקציה-טהורה קטנה ⇒ מוטמעת, חוק-1). */
  function isSafeAccent(a) {
      return (/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(a) ||
          /^(?:rgb|rgba|hsl|hsla)\([0-9.,%\s/]+\)$/i.test(a) ||
          /^[a-zA-Z]{3,20}$/.test(a));
  }
  /** נרמול שדה ה-firebase — נשמר רק אם ארבעת שדות החובה הם מחרוזות לא-ריקות. */
  function normalizeFirebase(raw) {
      if (!raw || typeof raw !== T.k2 || Array.isArray(raw))
          return undefined;
      const f = raw;
      const req = [f.apiKey, f.authDomain, f.projectId, f.appId];
      if (!req.every((v) => typeof v === T.k3 && v.length > 0))
          return undefined;
      const out = {
          apiKey: f.apiKey,
          authDomain: f.authDomain,
          projectId: f.projectId,
          appId: f.appId,
      };
      if (typeof f.storageBucket === T.k3 && f.storageBucket)
          out.storageBucket = f.storageBucket;
      if (typeof f.messagingSenderId === T.k3 && f.messagingSenderId) {
          out.messagingSenderId = f.messagingSenderId;
      }
      return out;
  }
  
  function normalizeConfig(raw) {
      if (!raw || typeof raw !== T.k2 || Array.isArray(raw))
          return null;
      const c = raw;
      if (typeof c.slug !== T.k3 && typeof c.orgName !== T.k3 && typeof c.theme !== T.k3) {
          return null;
      }
      const cfg = {
          ...DEFAULT_CONFIG,
          ...c,
          slug: typeof c.slug === T.k3 && c.slug ? c.slug : DEFAULT_CONFIG.slug,
          orgName: typeof c.orgName === T.k3 ? c.orgName : DEFAULT_CONFIG.orgName,
          theme: typeof c.theme === T.k3 && c.theme ? c.theme : DEFAULT_CONFIG.theme,
          modules: c.modules && typeof c.modules === T.k2 && !Array.isArray(c.modules) ? { ...c.modules } : {},
          features: c.features && typeof c.features === T.k2 && !Array.isArray(c.features)
              ? { ...c.features }
              : {},
          terms: c.terms && typeof c.terms === T.k2 && !Array.isArray(c.terms) ? { ...c.terms } : {},
      };
      const fb = normalizeFirebase(c.firebase);
      if (fb)
          cfg.firebase = fb;
      else
          delete cfg.firebase;
      // נתיבי-שורש בענן (CLOUD2) — רק true מפורש נשמר; כל השאר = orgs/{slug}
      if (c.cloudRoot === true)
          cfg.cloudRoot = true;
      else
          delete cfg.cloudRoot;
      // מסלול-B — פיצול-תרומות: רק true מפורש נשמר (off-by-default; השורש פטור ב-donationSplitOn).
      if (c.donationSplit === true)
          cfg.donationSplit = true;
      else
          delete cfg.donationSplit;
      // אכיפת-תומכים — רק true מפורש נשמר (off-by-default; ארגוני-פלטפורמה בלבד).
      if (c.supporterEnforce === true)
          cfg.supporterEnforce = true;
      else
          delete cfg.supporterEnforce;
      // הרחבות (INTEGRATIONS גל א׳) — חיטוי: רק מפתחות מה-allowlist (שגיאת-כתיב
      // לא נבלעת בשקט — ביקורת 4.8) ורק רשומות {enabled:boolean}. ריק ⇒ מוסר.
      const intsRaw = c.integrations;
      if (intsRaw && typeof intsRaw === T.k2 && !Array.isArray(intsRaw)) {
          const ints = {};
          for (const [k, v] of Object.entries(intsRaw)) {
              if (!INTEGRATION_KEYS.includes(k))
                  continue;
              if (v && typeof v === T.k2 && !Array.isArray(v) && typeof v.enabled === T.k4) {
                  const entry = { enabled: v.enabled };
                  // גל ג׳: הגדרות-מחרוזת מה-allowlist בלבד (payUrl וכו') — השאר נזרק
                  for (const s of INTEGRATION_SETTING_KEYS[k] ?? []) {
                      const sv = v[s];
                      if (typeof sv === T.k3 && sv.trim())
                          entry[s] = sv.trim();
                  }
                  ints[k] = entry;
              }
          }
          if (Object.keys(ints).length)
              cfg.integrations = ints;
          else
              delete cfg.integrations;
      }
      else
          delete cfg.integrations;
      // תבניות-הודעה (#12) — allowlist ‏TEMPLATE_KEYS, מחרוזות בלבד, תקרת-אורך 500
      const tplRaw = c.templates;
      if (tplRaw && typeof tplRaw === T.k2 && !Array.isArray(tplRaw)) {
          const tpl = {};
          for (const [k, v] of Object.entries(tplRaw)) {
              if (!TEMPLATE_KEYS.includes(k))
                  continue;
              if (typeof v === T.k3 && v.trim())
                  tpl[k] = v.trim().slice(0, T.k5);
          }
          if (Object.keys(tpl).length)
              cfg.templates = tpl;
          else
              delete cfg.templates;
      }
      else
          delete cfg.templates;
      // מיילי-אדמין — רק מחרוזות לא-ריקות; ריק/לא-מערך → מוסר (אין הגבלה)
      const admins = Array.isArray(c.adminEmails)
          ? c.adminEmails.filter((e) => typeof e === T.k3 && e.trim() !== '')
          : [];
      if (admins.length)
          cfg.adminEmails = admins;
      else
          delete cfg.adminEmails;
      // תפקידים (P3 פריט 15) — מפת מורות מייל→teacherId, רק זוגות מחרוזת לא-ריקים
      const rolesRaw = c.roles;
      const teachersRaw = rolesRaw && typeof rolesRaw === T.k2 && rolesRaw.teachers && typeof rolesRaw.teachers === T.k2
          ? rolesRaw.teachers
          : null;
      if (teachersRaw) {
          const teachers = {};
          for (const [k, v] of Object.entries(teachersRaw))
              if (k.trim() && typeof v === T.k3 && v.trim())
                  teachers[k.trim()] = v.trim();
          if (Object.keys(teachers).length)
              cfg.roles = { teachers };
          else
              delete cfg.roles;
      }
      else
          delete cfg.roles;
      // טלפוניה (downstream) — חיטוי allowlist מלא; חסר/לא-אובייקט ⇒ מוסר (ה-spread
      // של ...c היה מעביר telephony לא-מחוטא, לכן חובה set/delete מפורש).
      const tel = normalizeTelephony(c.telephony);
      if (tel)
          cfg.telephony = tel;
      else
          delete cfg.telephony;
      // זהות-ורטיקל חזותית (16.8) — אימוג'י-ארגון: מחרוזת קצרה בלבד (glyph),
      // תקרת-אורך 12 (אימוג'י מרובה-נקודות-קוד). ריק/לא-מחרוזת ⇒ מוסר (ביט-זהה להיום).
      if (typeof c.emoji === T.k3 && c.emoji.trim())
          cfg.emoji = c.emoji.trim().slice(0, T.k6);
      else
          delete cfg.emoji;
      // סגנון-תנועה — allowlist בלבד (calm/snappy/bold); כל ערך אחר ⇒ מוסר.
      if (typeof c.motion === T.k3 && MOTION_KEYS.includes(c.motion))
          cfg.motion = c.motion;
      else
          delete cfg.motion;
      // צבע-מותאם-ידני (provenance) — רק true מפורש נשמר.
      if (c.accentCustom === true)
          cfg.accentCustom = true;
      else
          delete cfg.accentCustom;
      // 🔴 נחיל-אבטחה 16.8 — חיטוי accent: הערך מוזרק ל-CSS `--accent` (applyTheme,
      // setProperty) ונצרך כ-background ⇒ ערך זדוני מהענן כמו `url('https://attacker/b.gif')`
      // היה מבצע GET-מאולץ מכל דפדפן-עובד (ביקון-מעקב). מתירים רק צבע-CSS אמיתי:
      // hex · rgb/rgba/hsl/hsla (ספרות/פסיקים/רווח/%/. בלבד) · מילת-צבע. אחרת מוסר.
      if (typeof cfg.accent === T.k3 && isSafeAccent(cfg.accent.trim()))
          cfg.accent = cfg.accent.trim();
      else
          delete cfg.accent;
      // אתר-ציבורי — חיטוי allowlist מלא (ה-spread של ...c היה מעביר site לא-מחוטא,
      // לכן חובה set/delete מפורש). חסר/לא-אובייקט ⇒ מוסר (⇒ אין אתר, ביט-זהה להיום).
      const site = normalizeSite(c.site);
      if (site)
          cfg.site = site;
      else
          delete cfg.site;
      // הגנת-מקור (16.8) — allowlist מארחים: מערך-מחרוזות מנוקה (עד 12, כ"א ≤120).
      if (Array.isArray(c.allowedHosts)) {
          const hosts = c.allowedHosts.filter((h) => typeof h === T.k3 && !!h.trim()).map((h) => h.trim().slice(0, T.k7)).slice(0, T.k6);
          if (hosts.length)
              cfg.allowedHosts = hosts;
          else
              delete cfg.allowedHosts;
      }
      else
          delete cfg.allowedHosts;
      return cfg;
  }
  return normalizeConfig;
}
