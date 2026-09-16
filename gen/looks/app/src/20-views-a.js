/* בית · אנשים · חינוך · צוות */
const VIEWS = {};

/* ---------------------------------------------------------------- בית --- */
VIEWS.bait = {
  name: 'בית',
  render() {
    const t = totals(), f = fund(), sc = specCount();
    const camp = DB.campaigns[0], got = raised(camp.id);
    const byMonth = DB.hmonths.map((m, i) => DB.donations.filter(d => d.ago % 12 === i).reduce((a, d) => a + d.amount, 0) / 1000);
    const att = DB.classes.map(c => [c.name, attendanceOf(c.id), attendanceOf(c.id) < 85]);
    const worst = sortBy(DB.classes, c => attendanceOf(c.id))[0];
    const late = lateFamilies();
    const noDriver = DB.routes.filter(r => !r.driver);
    const absent = DB.staff.filter(s => s.absent);
    const now = DB.minyanim[4];
    return `<div class="wrap">
    <header class="top">
      <h1 class="mark">בית</h1>
      <p class="when"><b>${DB.today.hd} ${DB.today.hy}</b> · ${DB.today.dow} · ${num(DB.people.length)} רשומות אנשים · נתוני דוגמה</p>
    </header>

    <div class="bento">
      <a class="tile w5 h2x pulse" href="#/medrash">
        <h2>עכשיו במוסד</h2>
        <ol>${DB.minyanim.map(m => `<li class="${m === now ? 'now' : m.time < now.time ? 'ok' : 'next'}">
          <time>${ltr(m.time)}</time><span class="dot" aria-hidden="true"></span>
          <span>${esc(m.name)}${m.count ? ' · ' + m.count + ' משתתפים' : ''}</span></li>`).join('')}</ol>
        <p class="sub">הלוח המלא בבית המדרש ←</p>
      </a>

      <a class="tile w4" href="#/gviya">
        <span class="cap">גבייה · שכר לימוד ${DB.tariff.year}</span>
        <div class="ring">${ring(t.pct, '--c2', 104, 12, 'נגבו ' + t.pct + ' אחוז מהחיוב השנתי')}
          <span class="mid"><b>${t.pct}%</b><span>מהחיוב</span></span></div>
        <p class="sub">${money(t.paid)} נגבו · ${money(t.open)} פתוחים</p>
      </a>

      <a class="tile w3" href="#/tzevet">
        <span class="cap">צוות · נוכחות היום</span>
        <div class="big">${presentToday()}<span class="of">/${DB.staff.length}</span></div>
        <div class="faces" aria-hidden="true">${absent.slice(0, 3).map(s => avatar(nameOf(s.personId), s.id, 30)).join('')}
          <span class="av more">+${DB.staff.length - 3}</span></div>
        <p class="sub">${absent.length} חסרים · ${absent.filter(s => s.sub).length} מחליפים שובצו</p>
      </a>

      <a class="tile w4" href="#/trumot">
        <span class="cap">תרומות · ${camp.name}</span>
        ${spark(byMonth, '--c5', 'תרומות לפי חודש עברי, באלפי שקלים')}
        <p class="sub">${money(got)} מתוך ${money(camp.goal)} · ${Math.round(got / camp.goal * 100)}%</p>
      </a>

      <a class="tile w5" href="#/hinuch">
        <span class="cap">חינוך · נוכחות לפי כיתה</span>
        ${bars(att, 'נוכחות לפי כיתה באחוזים')}
        <p class="sub">הנמוכה: ${worst.name} — ${attendanceOf(worst.id)}% · ${num(DB.students.length)} תלמידים</p>
      </a>

      <a class="tile w3" href="#/hesed">
        <span class="cap">חסד · גמ״ח הלוואות</span>
        <div class="big">${money(f.free)}</div>
        <p class="sub">זמין להלוואה · ${f.active} פעילות · ${DB.loans.filter(l => l.stage === 'בקשה').length} ממתינות</p>
      </a>

      <div class="tile w4 alerts">
        <h2>דורש הכרעה</h2>
        <ul>
          <li><span class="sev s1" aria-hidden="true"></span><span>ביטוח האולם פג בעוד 6 ימים</span><a href="#/ksafim">כספים</a></li>
          <li><span class="sev s2" aria-hidden="true"></span><span>${late.length} משפחות בפיגור בלי הוראת קבע</span><a href="#/gviya">גבייה</a></li>
          ${noDriver.map(r => `<li><span class="sev s2" aria-hidden="true"></span><span>${esc(r.name)} בלי נהג למחר</span><a href="#/tifol/${r.id}">תפעול</a></li>`).join('')}
          <li><span class="sev s3" aria-hidden="true"></span><span>${DB.queue.filter(q => q.state === 'wait').length} ממתינים בקבלת קהל</span><a href="#/hatzer">החצר</a></li>
        </ul>
      </div>

      <div class="tile w8">
        <span class="cap">כל האגפים · המספרים נספרים מהמחסן בזמן אמת</span>
        <div class="grid12">
          ${link('anashim', 'אנשים')}${link('hinuch', 'חינוך')}${link('tzevet', 'צוות')}${link('gviya', 'גבייה')}
          ${link('trumot', 'תרומות')}${link('ksafim', 'כספים')}${link('medrash', 'בית המדרש')}${link('hatzer', 'החצר')}
          ${link('hesed', 'חסד')}${link('tifol', 'תפעול')}${link('shiduch', 'שידוכים')}${link('tikshor', 'תקשורת')}
        </div>
      </div>
    </div>

    <footer class="foot">
      <span>${kpi(num(sc.ent), 'ישויות באפיון', `האפיון של המוסד נטען למערכת: ${sc.dept} אגפים · ${sc.ent} ישויות · ${num(sc.fld)} שדות · ${sc.st} שלבים · ${sc.fb} איסורים · ${sc.roles} תפקידים. המסכים קוראים ממנו את השלבים והכללים.`)}</span>
      <span><a class="lk" href="#/spec">לצפייה באפיון ←</a></span>
      <span><a class="lk" href="#/log">יומן הפעולות ←</a></span>
    </footer></div>`;
  },
  mount() {
    document.querySelectorAll('.grid12 .lk').forEach(a => {
      const id = a.getAttribute('href').slice(2);
      const n = { anashim: num(DB.people.length) + ' רשומות', hinuch: num(DB.students.length) + ' תלמידים', tzevet: DB.staff.length + ' עובדים',
        gviya: totals().pct + '% מהחיוב', trumot: DB.campaigns.length + ' מגביות', ksafim: 'תקציב ' + DB.tariff.year,
        medrash: DB.minyanim.length + ' זמנים', hatzer: DB.queue.filter(q => q.state === 'wait').length + ' בתור',
        hesed: DB.loans.length + ' הלוואות', tifol: DB.routes.length + ' קווים', shiduch: DB.proposals.length + ' הצעות', tikshor: DB.groups.length + ' קבוצות' }[id];
      if (n) a.insertAdjacentHTML('beforeend', '<span>' + n + '</span>');
    });
  },
};

/* ------------------------------------------------------------- אנשים --- */
/* ---------- אנשים ----------
   טבלה דינמית. המבנה וההתנהגות הועתקו במדידה מ-Atlassian Design System
   (atlassian.design/components/dynamic-table — 7,552 אלמנטים, 14 מצבים):
   שורה 48 · כותרת 653 12/16 מעל קו 2px · אפס קו בין שורות · טעינה
   ב-20% שקיפות במקום שלד · מצב-ריק · ומיקוד אחרי שהשורה יוצאת מהתצוגה.
   הצבעים הם של האפליקציה, לא של אטלסיאן — המבנה עובר, הפלטה נשארת.  */
const AN = { page: 1, per: 25, key: 'name', dir: 1, q: '', kind: '', left: false, focus: null };

VIEWS.anashim = {
  name: 'אנשים',
  render() {
    const kinds = [...new Set(DB.people.map(p => p.kind))];
    return `<header class="hd"><h1>אנשים</h1>
      <p class="cnt">${num(DB.people.length)} רשומות · ${kinds.map(k => DB.people.filter(p => p.kind === k).length + ' ' + k).join(' · ')}</p>
      <input id="q" type="search" placeholder="שם, עיר או שיוך…" aria-label="סינון אנשים" autocomplete="off" value="${esc(AN.q)}">
      <label class="hid" for="kf">סוג</label>
      <select id="kf"><option value="">כל הסוגים</option>${kinds.map(k => `<option${AN.kind === k ? ' selected' : ''}>${esc(k)}</option>`).join('')}</select>
      <button class="gh" id="showLeft" type="button" aria-pressed="${AN.left}">${AN.left ? 'הסתרת מי שעזב' : 'הצגת מי שעזב'}</button>
      <span class="cnt2" id="cnt"></span></header>
    <div class="holder" id="holder">
      <div class="spin" role="status" aria-live="polite"><span class="hid">טוען</span></div>
      <table>
        <thead><tr>
          <th class="srt" data-s="name" style="width:36%"><button type="button">שם<span class="ar">▾</span></button></th>
          <th class="srt" data-s="kind"><button type="button">סוג<span class="ar">▾</span></button></th>
          <th class="srt" data-s="city"><button type="button">עיר<span class="ar">▾</span></button></th>
          <th>שיוך</th>
          <th class="e">יתרה</th>
          <th class="e">פעולה</th>
        </tr></thead>
        <tbody id="tb"></tbody>
      </table>
      <div class="none"><b>אין רשומות מתאימות</b>אף אדם לא עונה על החיפוש והסינון. נסה לנקות את החיפוש או לבחור סוג אחר.</div>
    </div>
    <nav class="pg" id="pg" aria-label="עימוד"></nav>`;
  },
  mount() {
    const tb = document.getElementById('tb'), pg = document.getElementById('pg'),
          holder = document.getElementById('holder'), cnt = document.getElementById('cnt');

    /* השיוך והיתרה נגזרים — לא נשמרים על האדם */
    const tie = (p) => {
      if (p.kind === 'עובד') { const s = DB.staff.find(x => x.personId === p.id);
        return s ? { t: s.role, bal: 0, href: '#/staffp/' + s.id } : { t: '—', bal: 0 }; }
      if (p.kind === 'תלמיד') { const s = DB.students.find(x => x.personId === p.id);
        const c = s && cls(s.classId);
        return s ? { t: c ? c.name : '—', bal: 0, href: '#/student/' + s.id } : { t: '—', bal: 0 }; }
      if (p.kind === 'הורה') { const f = DB.families.find(x => x.head === p.id || x.spouse === p.id);
        return f ? { t: f.name, bal: balance(f), href: '#/family/' + f.id } : { t: '—', bal: 0 }; }
      const d = DB.donors.find(x => x.personId === p.id);
      return d ? { t: d.anon ? 'בעילום שם' : 'תורם', bal: 0, href: '#/donorp/' + d.id } : { t: '—', bal: 0 };
    };
    const view = () => {
      const q = AN.q.trim();
      return DB.people.filter(p => {
        if (p.left && !AN.left) return false;
        if (AN.kind && p.kind !== AN.kind) return false;
        if (!q) return true;
        const n = p.first + ' ' + p.last;
        return n.includes(q) || p.city.includes(q) || tie(p).t.includes(q);
      }).map(p => ({ p, name: p.first + ' ' + p.last, kind: p.kind, city: p.city, tieO: tie(p) }))
        .sort((a, b) => (a[AN.key] > b[AN.key] ? 1 : a[AN.key] < b[AN.key] ? -1 : 0) * AN.dir);
    };
    const paint = () => {
      const v = view(), pages = Math.max(1, Math.ceil(v.length / AN.per));
      AN.page = Math.min(Math.max(1, AN.page), pages);
      const slice = v.slice((AN.page - 1) * AN.per, AN.page * AN.per);
      holder.classList.toggle('empty', !v.length);
      cnt.innerHTML = v.length ? `${num(v.length)} · עמוד ${AN.page} מתוך ${pages}` : '0 רשומות';
      tb.innerHTML = slice.map(r => `<tr data-id="${r.p.id}">
        <td><span class="nmc">${avatar(r.name, r.p.id, 36)}<span>${r.tieO.href
          ? `<a class="lk" href="${r.tieO.href}">${esc(r.name)}</a>` : `<b>${esc(r.name)}</b>`}
          ${r.p.left ? `<span class="sub">עזב · ${esc(r.p.left)}</span>` : ''}</span></span></td>
        <td>${tag(r.kind)}</td><td>${esc(r.city)}</td><td>${esc(r.tieO.t)}</td>
        <td class="e">${r.tieO.bal > 0 ? money(r.tieO.bal) : '<span class="sub">—</span>'}</td>
        <td class="e">${r.p.left ? '<span class="sub">ארכיון</span>'
          : `<button class="gh sm" type="button" data-go="${r.p.id}">סימון «עזב»</button>`}</td></tr>`).join('');
      /* עימוד מקוצר */
      const set = { 1: 1, 2: 1 }; set[pages] = 1; set[pages - 1] = 1;
      for (let i = AN.page - 1; i <= AN.page + 1; i++) if (i >= 1 && i <= pages) set[i] = 1;
      let last = 0;
      const out = [`<button type="button" id="prev"${AN.page === 1 ? ' disabled' : ''} aria-label="הקודם">‹</button>`];
      Object.keys(set).map(Number).filter(n => n >= 1 && n <= pages).sort((a, b) => a - b).forEach(n => {
        if (last && n > last + 1) out.push('<span class="gap">…</span>');
        out.push(`<button type="button" data-p="${n}"${n === AN.page ? ' aria-current="page"' : ''}>${n}</button>`);
        last = n;
      });
      out.push(`<button type="button" id="next"${AN.page === pages ? ' disabled' : ''} aria-label="הבא">›</button>`);
      pg.innerHTML = out.join('');
      /* שחזור מיקוד אחרי ש-act() בנה את המסך מחדש */
      if (AN.focus != null) {
        const rows = tb.children;
        let t = null;
        if (rows.length) {
          const i = Math.min(AN.focus, rows.length - 1);
          for (let k = i; k >= 0 && !t; k--) t = rows[k].querySelector('[data-go]');
          for (let k = i; k < rows.length && !t; k++) t = rows[k].querySelector('[data-go]');
        }
        (t || document.getElementById('q')).focus();
        AN.focus = null;
      }
    };
    /* המצב ה-14 של אטלסיאן: המיקום נקרא לפני שהשורה יוצאת */
    const leave = (id, btn) => {
      const tr = btn.closest('tr');
      AN.focus = Array.prototype.indexOf.call(tb.children, tr);
      const p = DB.people.find(x => x.id === id);
      const nm = p.first + ' ' + p.last;
      act('סומן «עזב» · ' + nm, 'אנשים', () => {
        const was = p.left || null;
        p.left = DB.today.hd + ' ' + DB.today.hy;
        return () => { p.left = was; };
      });
      toast('סומן «עזב» · ' + nm);
    };
    document.getElementById('q').addEventListener('input', e => { AN.q = e.target.value; AN.page = 1; paint(); });
    document.getElementById('kf').addEventListener('change', e => { AN.kind = e.target.value; AN.page = 1; paint(); });
    document.getElementById('showLeft').addEventListener('click', function () {
      AN.left = !AN.left; this.setAttribute('aria-pressed', String(AN.left));
      this.textContent = AN.left ? 'הסתרת מי שעזב' : 'הצגת מי שעזב'; AN.page = 1; paint();
    });
    document.querySelector('thead').addEventListener('click', e => {
      const th = e.target.closest('th.srt'); if (!th) return;
      const k = th.dataset.s;
      if (AN.key === k) AN.dir = -AN.dir; else { AN.key = k; AN.dir = 1; }
      AN.page = 1; syncSort(); paint();
    });
    tb.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) leave(b.dataset.go, b); });
    pg.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.id === 'prev') AN.page--; else if (b.id === 'next') AN.page++; else AN.page = +b.dataset.p;
      paint(); document.getElementById('app').scrollIntoView({ block: 'start' });
    });
    const syncSort = () => {
      document.querySelectorAll('th.srt').forEach(x => { x.removeAttribute('aria-sort'); x.querySelector('.ar').textContent = '▾'; });
      const th = document.querySelector(`th[data-s="${AN.key}"]`);
      if (th) { th.setAttribute('aria-sort', AN.dir > 0 ? 'ascending' : 'descending'); th.querySelector('.ar').textContent = AN.dir > 0 ? '▾' : '▴'; }
    };
    syncSort(); paint();
  },
};

const SLOTS = [['08:00', '08:45'], ['08:50', '09:35'], ['09:40', '10:25'], ['10:25', '10:45'], ['10:45', '11:30'],
['11:35', '12:20'], ['12:20', '13:45'], ['13:45', '14:30'], ['14:35', '15:20']];
const DAYS6 = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳'];
const SUBJ = [['גמרא · בבא מציעא', 1], ['חומש ורש״י', 3], ['הלכה', 2], ['משנה ברורה', 2], ['נביא', 3],
['חשבון', 6], ['לשון וכתיבה', 6], ['מדעים', 6], ['מוסר', 4], ['שיחה', 4], ['מבחן שבועי', 5], ['סדר עיון', 1]];
VIEWS.hinuch = {
  name: 'חינוך',
  render([classId]) {
    const c = cls(classId) || DB.classes[8];
    const rb = staff(c.rebbe);
    const ss = DB.students.filter(s => s.classId === c.id);
    /* המערכת נגזרת מהכיתה — אותה כיתה תמיד תקבל אותה מערכת */
    const pick2 = (d, r) => SUBJ[(d * 7 + r * 3 + c.id.charCodeAt(1)) % SUBJ.length];
    const week = DAYS6.map((_, d) => {
      const out = [[1, 2, 'גמרא · בבא מציעא', 1], [3, 1, pick2(d, 1)[0], pick2(d, 1)[1]], [4, 1, 'הפסקה', 0],
      [5, 1, pick2(d, 2)[0], pick2(d, 2)[1]], [6, 1, pick2(d, 3)[0], pick2(d, 3)[1]], [7, 1, 'מנחה וסעודה', 0]];
      if (d < 5) out.push([8, 2, 'סדר עיון', 1]);
      return out;
    });
    return `<header class="bar"><h1>חינוך</h1>
      <div class="seg" role="group" aria-label="כיתה">
        ${DB.classes.map(k => `<a href="#/hinuch/${k.id}" role="button" aria-pressed="${k.id === c.id}">${esc(k.name)}</a>`).join('')}
      </div><span class="sp"></span>
      <div class="wk"><span>${esc(c.room)} · ר״מ ${link('staffp/' + rb.id, nameOf(rb.personId))}</span></div></header>

    <div class="pad">
      <div class="clsline">
        ${kpi(ss.length, 'תלמידים בכיתה', `נספרו התלמידים שה-classId שלהם הוא «${c.name}»: ${ss.length} מתוך ${DB.students.length}.`)}
        ${kpi(attendanceOf(c.id) + '%', 'נוכחות השבוע', `סך ימי-נוכחות של ${ss.length} תלמידים חלקי ${ss.length}×5 ימים.`)}
        ${kpi(ss.filter(s => s.routeId).length, 'בהסעות', 'תלמידים עם שיוך לקו הסעה.')}
        ${kpi(new Set(ss.map(s => s.familyId)).size, 'משפחות', 'מספר המשפחות השונות שילדיהן בכיתה.')}
      </div>

      <div class="tt" id="tt">
        <div class="dh" style="grid-column:1"></div>
        ${DAYS6.map((d, i) => `<div class="dh" data-today="${i === 2 ? 'y' : 'n'}" style="grid-column:${i + 2}">יום ${d}<small>${i === 2 ? 'היום' : ''}</small></div>`).join('')}
        ${SLOTS.map((s, r) => `<div class="th" style="grid-row:${r + 2}">${s[0]}<br>${s[1]}</div>`).join('')}
        ${week.map((day, di) => day.map(([r, sp, sub, col]) =>
      `<div class="cell c${col}" style="grid-column:${di + 2};grid-row:${r + 1}/span ${sp}">${col ? `<b>${esc(sub)}</b><span>${esc(nameOf(rb.personId))}</span>` : esc(sub)}</div>`).join('')).join('')}
        <div class="now" id="nowline" hidden></div>
      </div>

      <section class="att">
        <h2>נוכחות השבוע · ${esc(c.name)}</h2>
        <p class="s">כל ריבוע הוא יום לימודים. לחיצה על שם פותחת את תיק התלמיד.</p>
        <div style="overflow-x:auto"><table>
          <thead><tr><th scope="col">תלמיד</th>${DAYS6.slice(0, 5).map(d => `<th scope="col" class="m">${d}</th>`).join('')}<th scope="col" class="m">%</th><th scope="col">משפחה</th></tr></thead>
          <tbody>${ss.map(s => `<tr><th scope="row"><a class="lk" href="#/student/${s.id}">${esc(nameOf(s.personId))}</a></th>
            ${s.att.map(v => `<td class="m"><span class="mk ${v ? 'y' : 'n'}">${v ? '✓' : '✗'}</span></td>`).join('')}
            <td class="m num">${Math.round(s.att.filter(Boolean).length / 5 * 100)}%</td>
            <td><a class="lk" href="#/family/${s.familyId}">${esc(fam(s.familyId).name)}</a></td></tr>`).join('')}</tbody>
          <tfoot><tr><td>סך הכל</td>${[0, 1, 2, 3, 4].map(d => `<td class="m num">${ss.filter(s => s.att[d]).length}/${ss.length}</td>`).join('')}
            <td class="m num">${attendanceOf(c.id)}%</td><td></td></tr></tfoot>
        </table></div>
      </section>
    </div>`;
  },
  mount() {
    const tt = document.getElementById('tt'), line = document.getElementById('nowline');
    const mins = s => +s.slice(0, 2) * 60 + +s.slice(3);
    const d = new Date(), now = d.getHours() * 60 + d.getMinutes();
    const i = SLOTS.findIndex(s => now >= mins(s[0]) && now < mins(s[1]));
    if (i < 0) return;
    const th = tt.querySelectorAll('.th')[i]; if (!th) return;
    const r = th.getBoundingClientRect(), t = tt.getBoundingClientRect();
    const f = (now - mins(SLOTS[i][0])) / (mins(SLOTS[i][1]) - mins(SLOTS[i][0]));
    line.style.top = Math.round(r.top - t.top + tt.scrollTop + r.height * f) + 'px';
    line.hidden = false;
  },
};

/* -------------------------------------------------------------- צוות --- */
const H0 = 6, H1 = 22, GCOLS = (H1 - H0) * 2;
const t2c = (t) => Math.min(GCOLS + 2, Math.max(2, (+t.slice(0, 2) - H0) * 2 + (+t.slice(3) >= 30 ? 1 : 0) + 2));
VIEWS.tzevet = {
  name: 'צוות',
  render() {
    const cover = Array.from({ length: GCOLS }, (_, i) => {
      const c = i + 2;
      return DB.staff.reduce((n, s) => n + (s.shifts.some(([a, b]) => c >= t2c(a) && c < t2c(b)) ? 1 : 0), 0);
    });
    const thin = cover.indexOf(Math.min(...cover.filter(v => v > 0)));
    const maxc = Math.max(...cover);
    const absent = DB.staff.filter(s => s.absent);
    return `<header class="hd"><h1>צוות</h1>
      <p class="sub2">${DB.today.dow} ${DB.today.hd} · ${ltr('06:00')}–${ltr('22:00')}</p><span class="sp"></span></header>
    <section class="kpi">
      <div>${kpi(presentToday(), 'נוכחים מתוך ' + DB.staff.length, `נספרו עובדים בלי סימון היעדרות: ${presentToday()} מתוך ${DB.staff.length}.`)}</div>
      <div class="warn">${kpi(absent.filter(s => s.sub).length, 'חסרים · שובץ מחליף', 'עובדים נעדרים שיש להם שדה «מחליף» מאויש.')}</div>
      <div class="err">${kpi(absent.filter(s => !s.sub).length, 'חסרים · בלי מחליף', 'עובדים נעדרים בלי מחליף — אלה שדורשים החלטה היום.')}</div>
      <div>${kpi(ltr(String(H0 + Math.floor(thin / 2)).padStart(2, '0') + ':' + (thin % 2 ? '30' : '00')), 'הכיסוי הדק ביותר', 'החריץ שבו הכי מעט אנשי צוות בו-זמנית, נספר מהמשבצות עצמן.')}</div>
    </section>

    <div class="scroll">
      <div class="gantt">
        ${Array.from({ length: H1 - H0 }, (_, i) => `<div class="hh" style="grid-column:${i * 2 + 2}/span 2">${String(H0 + i).padStart(2, '0')}</div>`).join('')}
        ${DB.staff.map((s, r) => {
      const row = r + 2;
      const nm = `<div class="nm" style="grid-row:${row}"><b><a class="lk" href="#/staffp/${s.id}">${esc(nameOf(s.personId))}</a></b><span>${esc(s.role)}${s.classId ? ' · ' + cls(s.classId).name : ''}</span></div>`;
      if (!s.shifts.length) return nm + `<div class="off" style="grid-row:${row}">${esc(s.absent)} · לא במשמרת${s.sub ? ' · מחליף: ' + esc(nameOf(staff(s.sub).personId)) : ' · אין מחליף'}</div>`;
      return nm + `<div class="lane" style="grid-row:${row}"></div>` + s.shifts.map(([a, b, lab]) =>
        `<div class="bar b${colorOf(s.id).slice(1)}" style="grid-row:${row};grid-column:${t2c(a)}/${t2c(b)}">${esc(lab)} · ${ltr(a + '–' + b)}</div>`).join('');
    }).join('')}
        <div class="nowl" id="nowl" style="grid-column:${t2c('13:45')}" aria-hidden="true"></div>
        <div class="clab">כיסוי</div>
        <div class="cover" role="img" aria-label="עקומת כיסוי: בין ${Math.min(...cover)} ל-${maxc} אנשי צוות בו-זמנית">
          ${cover.map(v => `<i class="${v === 0 ? 'none' : v <= 2 ? 'thin' : ''}" style="height:${Math.max(4, v / maxc * 100)}%"></i>`).join('')}
        </div>
      </div>
    </main>
    <p class="legend"><span><i style="background:var(--acc-soft)"></i>כיסוי תקין</span>
      <span><i style="background:var(--warn-soft)"></i>כיסוי דק (≤2)</span>
      <span><i class="hatch"></i>חופשה או מחלה</span>
      <span>הקו הכחול = השעה הנוכחית (בין ${ltr('06:00')} ל-${ltr('22:00')}).</span></p>`;
  },
  mount() {
    const n = document.getElementById('nowl'), d = new Date(), h = d.getHours() + d.getMinutes() / 60;
    if (h < H0 || h >= H1) { n.hidden = true; return; }
    n.style.gridColumn = String(Math.round((h - H0) * 2) + 2);
  },
};
