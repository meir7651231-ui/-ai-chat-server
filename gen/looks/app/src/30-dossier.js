/* התיקים — המקום שבו 12 האגפים נפגשים על ישות אחת. */

/* ---------------------------------------------------------- תיק משפחה --- */
VIEWS.family = {
  name: 'תיק משפחה',
  render([id]) {
    const f = fam(id) || DB.families[0];
    const kids = f.kids.map(stu);
    const pays = DB.payments.filter(p => p.familyId === f.id);
    const loans = DB.loans.filter(l => l.familyId === f.id);
    const don = f.donor ? DB.donations.filter(d => d.donorId === f.donor) : [];
    const visits = DB.queue.filter(q => q.familyId === f.id);
    const props = DB.proposals.filter(p => p.a === f.id || p.b === f.id);
    const yz = DB.yahrzeits.filter(y => y.familyId === f.id);
    const st = f.seat ? seat(f.seat) : null;
    const k = kids.length, bus = kids.filter(s => s.routeId).length;
    const rows = [
      ['שכר לימוד · ' + k + ' × ' + nis(DB.tariff.tuition), k * DB.tariff.tuition],
      ['הסעות · ' + bus + ' נוסעים', bus * DB.tariff.bus],
      ['ספרים וציוד · ' + k + ' × ' + nis(DB.tariff.books), k * DB.tariff.books],
      ['הנחה ' + f.discount + '% (הגבוהה בלבד)', -(charged(f) - discounted(f))],
      ['שולם', -f.paid],
    ];
    const sec = (t, dept, body) => `<section class="dsec"><h2>${esc(t)}<span class="dep">${esc(dept)}</span></h2>${body}</section>`;
    return `<div class="dossier">
      <header class="dhead">
        ${avatar(f.name, f.id, 64)}
        <div class="who"><h1>${esc(f.name)}</h1>
          <p>${esc(f.city)} · ${ltr(f.phone)} · ${esc(nameOf(f.head))} ו${esc(nameOf(f.spouse))}</p></div>
        <div class="dstats">
          ${kpi(k, 'ילדים במוסד', 'תלמידים שה-familyId שלהם הוא ' + f.id + '.')}
          ${kpi(money(balance(f)), 'יתרה', 'חיוב אחרי הנחה פחות מה ששולם. החישוב המלא בסעיף הגבייה.')}
          ${kpi(f.hok ? 'פעילה' : 'אין', 'הוראת קבע', 'שדה hok ברשומת המשפחה.')}
          ${kpi(loans.length, 'הלוואות', 'רשומות גמ״ח שמקושרות למשפחה.')}
        </div>
      </header>

      <nav class="dtabs" aria-label="מעבר בתיק">
        <a href="#money">גבייה</a><a href="#kids">חינוך</a><a href="#hall">בית המדרש</a>
        <a href="#hesed">חסד</a><a href="#give">תרומות</a><a href="#more">עוד</a>
      </nav>

      ${sec('חיוב ותשלומים', 'גבייה', `<div id="money" class="two2">
        <table class="mini"><caption>מאיפה מגיע החיוב</caption><tbody>
          ${rows.map(r => `<tr class="${r[1] < 0 ? 'minus' : ''}"><th scope="row">${esc(r[0])}</th>
            <td class="n">${r[1] < 0 ? '−' : ''}${money(Math.abs(r[1]))}</td></tr>`).join('')}
          <tr class="tot"><th scope="row">נותר לתשלום</th><td class="n">${money(balance(f))}</td></tr>
        </tbody></table>
        <div><h3>תשלומים אחרונים</h3>
          ${pays.length ? `<ul class="mlist">${pays.slice(0, 6).map(p => `<li><span>${esc(p.method)}</span>
            <span class="n">${money(p.amount)}</span><span class="ago">לפני ${p.ago} ימים</span></li>`).join('')}</ul>` : empty('אין תשלומים רשומים')}
          <div class="dacts"><button class="btn pri" data-pay="${f.id}">רישום תשלום ${money(1000)}</button>
            <button class="btn" data-disc="${f.id}">הגדלת הנחה ב-10%</button></div></div>
      </div>`)}

      ${sec('ילדים וכיתות', 'חינוך', `<div id="kids" class="kidcards">
        ${kids.map(s => `<a class="kidcard" href="#/student/${s.id}">
          ${avatar(nameOf(s.personId), s.id, 40)}
          <div><b>${esc(nameOf(s.personId))}</b><span>${esc(cls(s.classId).name)} · ${esc(cls(s.classId).room)}</span>
          <span>נוכחות ${s.att.filter(Boolean).length}/5 ${s.routeId ? '· ' + esc(route(s.routeId).name.split(' · ')[0]) : '· בלי הסעה'}</span></div>
        </a>`).join('') || empty('אין ילדים רשומים')}</div>`)}

      ${sec('מקום וזכרונות', 'בית המדרש', `<div id="hall" class="two2">
        <div>${st ? `<p class="big2">שורה ${['א', 'ב', 'ג', 'ד', 'ה', 'ו'][st.row]} · מקום ${st.col + 1}</p>
          <p class="s">${esc(st.status)}${st.price ? ' · ' + money(st.price) + ' לשנה' : ''}</p>
          <a class="btn" href="#/medrash/${st.id}">הצגה במפה</a>` : empty('אין מקום קבוע')}</div>
        <div>${yz.length ? `<h3>יארצייטים</h3><ul class="mlist">${yz.map(y => `<li><span>${esc(y.name)}</span><span class="ago">${esc(y.day)}</span></li>`).join('')}</ul>` : empty('אין יארצייטים רשומים')}</div>
      </div>`)}

      ${sec('גמ״ח', 'חסד', `<div id="hesed">${loans.length ? `<ul class="mlist">${loans.map(l => `<li>
        <span><a class="lk" href="#/loanp/${l.id}">${esc(l.purpose)}</a> · ${esc(l.stage)}</span>
        <span class="n">${money(l.amount)}</span>
        <span class="ago">${l.paid ? l.paid + '/' + l.installments + ' תשלומים' : l.guarantors + '/2 ערבים'}</span></li>`).join('')}</ul>`
        : empty('אין הלוואות')}</div>`)}

      ${sec('תרומות', 'תרומות', `<div id="give">${don.length ? `<ul class="mlist">${don.slice(0, 5).map(d => `<li>
        <span>${esc(DB.campaigns.find(c => c.id === d.campaignId).name)}</span><span class="n">${money(d.amount)}</span>
        <span class="ago">${esc(d.method)}</span></li>`).join('')}</ul>
        <p class="s">סך הכל ${money(don.reduce((a, d) => a + d.amount, 0))} · ${link('donorp/' + f.donor, 'כרטיס התורם')}</p>`
        : empty('המשפחה אינה רשומה כתורמת')}</div>`)}

      ${sec('עוד מהמוסד', 'החצר · שידוכים · תקשורת', `<div id="more" class="two2">
        <div><h3>קבלת קהל</h3>${visits.length ? `<ul class="mlist">${visits.map(v => `<li><span>${ROLE.kvittel ? esc(v.reason) : 'חסוי'}</span>
          <span class="ago">${v.state === 'inside' ? 'בפנים' : 'ממתין · מספר ' + v.no}</span></li>`).join('')}</ul>` : empty('אין ביקורים פתוחים')}</div>
        <div><h3>שידוכים</h3>${props.length ? (ROLE.views === '*' || ROLE.views.includes('shiduch')
        ? `<ul class="mlist">${props.map(p => `<li><a class="lk" href="#/shiduch/${p.id}">הצעה · ${esc(p.stage)}</a>
            <span class="ago">${p.days} ימים</span></li>`).join('')}</ul>`
        : `<p class="s masked">${props.length} הצעות · חסוי בתפקיד ${esc(ROLE.name)}</p>`) : empty('אין הצעות')}</div>
      </div>`)}

      <section class="dsec"><h2>יומן התיק<span class="dep">נגזר</span></h2>
        <ol class="tline">
          <li><b>חיוב ${DB.tariff.year}</b><span>${money(discounted(f))} · ${k} ילדים · הנחה ${f.discount}%</span></li>
          ${pays.slice(0, 3).map(p => `<li><b>תשלום ${money(p.amount)}</b><span>${esc(p.method)} · לפני ${p.ago} ימים</span></li>`).join('')}
          ${loans.map(l => `<li><b>הלוואה ${money(l.amount)}</b><span>${esc(l.purpose)} · ${esc(l.stage)}</span></li>`).join('')}
          ${st ? `<li><b>מקום בבית המדרש</b><span>שורה ${st.row + 1} מקום ${st.col + 1} · ${esc(st.status)}</span></li>` : ''}
        </ol></section>
    </div>`;
  },
  mount([id]) {
    const f = fam(id) || DB.families[0];
    document.querySelector('.dossier').addEventListener('click', (e) => {
      const p = e.target.closest('[data-pay]'), d = e.target.closest('[data-disc]');
      if (!p && !d) return;
      if (p) {
        if (balance(f) <= 0) { blocked('יתרה שלילית', 'גבייה', 'חיוב'); return; }
        act('נרשם תשלום ' + nis(1000) + ' · ' + f.name, 'גבייה', () => {
          f.paid += 1000; DB.payments.unshift({ id: 'y' + Date.now(), familyId: f.id, amount: 1000, method: 'אשראי', ago: 0 });
          return () => { f.paid -= 1000; DB.payments.shift(); };
        });
        toast('נרשם תשלום של ' + nis(1000));
      } else {
        /* «הנחות מצטברות (הגבוהה בלבד)» — כלל מהאפיון: לא מחברים, בוחרים את הגבוהה */
        const next = Math.max(f.discount, f.discount + 10 > 35 ? 35 : f.discount + 10);
        if (next === f.discount) { blocked('הנחות מצטברות (הגבוהה בלבד)', 'גבייה', 'חיוב'); return; }
        const before = f.discount;
        act('הנחה ' + before + '% ← ' + next + '% · ' + f.name, 'גבייה', () => { f.discount = next; return () => { f.discount = before; }; });
        toast('ההנחה עודכנה ל-' + next + '%');
      }
    });
  },
};

/* ---------------------------------------------------------- תיק תלמיד --- */
VIEWS.student = {
  name: 'תיק תלמיד',
  render([id]) {
    const s = stu(id) || DB.students[0], f = fam(s.familyId), c = cls(s.classId), r = s.routeId ? route(s.routeId) : null;
    return `<div class="dossier">
      <header class="dhead">${avatar(nameOf(s.personId), s.id, 64)}
        <div class="who"><h1>${esc(nameOf(s.personId))}</h1>
          <p>${link('family/' + f.id, f.name)} · כיתה ${esc(c.name)} · ${esc(c.room)}</p></div>
        <div class="dstats">
          ${kpi(s.att.filter(Boolean).length + '/5', 'נוכחות השבוע', 'מתוך מערך הנוכחות של התלמיד.')}
          ${kpi(esc(c.name), 'כיתה', 'שיוך הכיתה ברשומת התלמיד.')}
          ${kpi(r ? esc(r.name.split(' · ')[0]) : '—', 'הסעה', r ? 'הקו שאליו התלמיד משויך, תחנה ' + (s.stopIdx + 1) : 'אין שיוך לקו.')}
        </div></header>
      <section class="dsec"><h2>נוכחות<span class="dep">חינוך</span></h2>
        <div class="attrow">${['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳'].map((d, i) => `<span class="attday ${s.att[i] ? 'y' : 'n'}">
          <b>${d}</b>${s.att[i] ? '✓' : '✗'}</span>`).join('')}</div>
        ${s.note ? `<p class="s">הערת הר״מ: ${esc(s.note)}</p>` : ''}
        <p class="s">ר״מ הכיתה: ${link('staffp/' + c.rebbe, nameOf(staff(c.rebbe).personId))} ·
          ${link('hinuch/' + c.id, 'מערכת הכיתה')}</p></section>
      ${r ? `<section class="dsec"><h2>הסעה<span class="dep">תפעול</span></h2>
        <p class="s">${link('tifol/' + r.id, r.name)} · תחנה «${esc(r.stops[s.stopIdx].name)}» בשעה ${ltr(r.stops[s.stopIdx].time)} ·
          נהג: ${r.driver ? esc(nameOf(staff(r.driver).personId)) : 'לא שובץ'}</p></section>` : ''}
      <section class="dsec"><h2>אחים במוסד<span class="dep">אנשים</span></h2>
        <div class="kidcards">${f.kids.filter(k => k !== s.id).map(k => { const b = stu(k); return `<a class="kidcard" href="#/student/${b.id}">
          ${avatar(nameOf(b.personId), b.id, 40)}<div><b>${esc(nameOf(b.personId))}</b><span>${esc(cls(b.classId).name)}</span></div></a>`; }).join('') || empty('אין')}</div></section>
    </div>`;
  },
};

/* ----------------------------------------------------------- תיק עובד --- */
VIEWS.staffp = {
  name: 'תיק עובד',
  render([id]) {
    const s = staff(id) || DB.staff[0];
    const c = s.classId ? cls(s.classId) : null;
    const rts = DB.routes.filter(r => r.driver === s.id);
    return `<div class="dossier">
      <header class="dhead">${avatar(nameOf(s.personId), s.id, 64)}
        <div class="who"><h1>${esc(nameOf(s.personId))}</h1><p>${esc(s.role)} · ${esc(s.since)} במוסד · ${ltr(s.phone)}</p></div>
        <div class="dstats">
          ${kpi(s.absent ? esc(s.absent) : 'נוכח', 'מצב היום', 'שדה ההיעדרות ברשומת העובד.')}
          ${kpi(s.shifts.length, 'משבצות היום', 'מספר קטעי המשמרת שנגזרו מהתפקיד.')}
          ${kpi(c ? c.students.length : rts.length ? ridersOf(rts[0]) : 0, c ? 'תלמידים בכיתה' : 'נוסעים בקו', 'נספר מהשיוך.')}
        </div></header>
      <section class="dsec"><h2>משמרות היום<span class="dep">צוות</span></h2>
        ${s.shifts.length ? `<ul class="mlist">${s.shifts.map(([a, b, l]) => `<li><span>${esc(l)}</span>
          <span class="n">${ltr(a + '–' + b)}</span></li>`).join('')}</ul>`
        : `<p class="s">${esc(s.absent)} · ${s.sub ? 'מחליף: ' + esc(nameOf(staff(s.sub).personId)) : 'אין מחליף משובץ'}</p>
           ${s.sub ? '' : '<button class="btn pri" id="findSub">שיבוץ מחליף</button>'}`}</section>
      ${c ? `<section class="dsec"><h2>הכיתה<span class="dep">חינוך</span></h2>
        <p class="s">${link('hinuch/' + c.id, 'כיתה ' + c.name)} · ${c.students.length} תלמידים · נוכחות ${attendanceOf(c.id)}%</p></section>` : ''}
      ${rts.length ? `<section class="dsec"><h2>קווים<span class="dep">תפעול</span></h2>
        <ul class="mlist">${rts.map(r => `<li><span>${link('tifol/' + r.id, r.name)}</span><span class="n">${ridersOf(r)} נוסעים</span></li>`).join('')}</ul></section>` : ''}
    </div>`;
  },
  mount([id]) {
    const b = document.getElementById('findSub'); if (!b) return;
    const s = staff(id) || DB.staff[0];
    b.onclick = () => {
      const free = DB.staff.find(x => !x.absent && x.role === s.role && !x.subFor);
      if (!free) { blocked('משמרת בלי כיסוי', 'צוות', 'מחליף'); return; }
      act('שובץ מחליף ל' + nameOf(s.personId), 'צוות', () => {
        s.sub = free.id; free.subFor = s.id; const old = free.shifts;
        free.shifts = [['08:00', '16:00', 'במקום ' + nameOf(s.personId)]];
        return () => { s.sub = null; free.subFor = null; free.shifts = old; };
      });
      toast(nameOf(free.personId) + ' שובץ כמחליף');
    };
  },
};

/* -------------------------------------------------------- תיק הלוואה --- */
VIEWS.loanp = {
  name: 'תיק הלוואה',
  render([id]) {
    const l = loan(id) || DB.loans[0], f = fam(l.familyId);
    const fields = fieldsOf('חסד', 'הלוואה');
    return `<div class="dossier">
      <header class="dhead">${avatar(f.name, f.id, 64)}
        <div class="who"><h1>הלוואה · ${esc(f.name)}</h1><p>${esc(l.purpose)} · ${esc(l.stage)}</p></div>
        <div class="dstats">
          ${kpi(money(l.amount), 'קרן', 'סכום ההלוואה כפי שאושר.')}
          ${kpi(l.paid + '/' + l.installments, 'תשלומים', 'נפרעו מתוך סך התשלומים.')}
          ${kpi(money(Math.round(l.amount * (1 - l.paid / l.installments))), 'יתרה', 'הקרן כפול חלק התשלומים שנותרו.')}
        </div></header>
      <section class="dsec"><h2>מסלול<span class="dep">האפיון</span></h2>
        <ol class="flow">${stagesOf('חסד', 'הלוואה').map(s => `<li class="${s === l.stage ? 'on' : ''}">${esc(s)}</li>`).join('')}</ol>
        <p class="s">${l.paid ? progress(Math.round(l.paid / l.installments * 100)) : ''}</p></section>
      <section class="dsec"><h2>ערבים ותנאים<span class="dep">חסד</span></h2>
        <p class="s">${l.guarantors}/2 ערבים · ${l.late ? l.late + ' תשלומים באיחור' : 'אין איחורים'} ·
          ${link('family/' + f.id, 'תיק המשפחה')}</p>
        <h3>מה אסור</h3><ul class="rulelist">${forbiddenOf('חסד', 'הלוואה').map(r => `<li>${esc(r)}</li>`).join('')}</ul></section>
      <section class="dsec"><h2>השדות שהאפיון מגדיר<span class="dep">${fields.length} שדות</span></h2>
        <div class="fieldgrid">${fields.map(([n, shape, req]) => `<span class="fld">${esc(n)}<i>${esc(shape || '')}${req ? ' · חובה' : ''}</i></span>`).join('')}</div></section>
    </div>`;
  },
};

/* --------------------------------------------------------- תיק תורם --- */
VIEWS.donorp = {
  name: 'תיק תורם',
  render([id]) {
    const d = DB.donors.find(x => x.id === id) || DB.donors[0];
    const mine = DB.donations.filter(x => x.donorId === d.id);
    const tot = mine.reduce((a, x) => a + x.amount, 0);
    const p = DB.people.find(x => x.id === d.personId);
    return `<div class="dossier">
      <header class="dhead">${avatar(nameOf(d.personId), d.id, 64)}
        <div class="who"><h1>${esc(nameOf(d.personId))}</h1><p>${esc(d.city)}${p.familyId ? ' · ' + link('family/' + p.familyId, fam(p.familyId).name) : ''}</p></div>
        <div class="dstats">
          ${kpi(money(tot), 'סך תרומות', 'סכום ' + mine.length + ' התרומות הרשומות על שמו.')}
          ${kpi(mine.length, 'תרומות', 'מספר הרשומות.')}
          ${kpi(d.amb ? 'כן' : 'לא', 'שגריר', 'שיוך לשגריר במגבית.')}
        </div></header>
      <section class="dsec"><h2>תרומות<span class="dep">תרומות</span></h2>
        <ul class="mlist">${mine.map(x => `<li><span>${esc(DB.campaigns.find(c => c.id === x.campaignId).name)}</span>
          <span class="n">${money(x.amount)}</span><span class="ago">${esc(x.method)}</span></li>`).join('') || empty('אין')}</ul></section>
    </div>`;
  },
};

VIEWS.person = {
  name: 'אדם',
  render([id]) {
    const p = DB.people.find(x => x.id === id) || DB.people[0];
    if (p.familyId) return VIEWS.family.render([p.familyId]);
    if (p.donorId) return VIEWS.donorp.render([p.donorId]);
    const s = DB.staff.find(x => x.personId === p.id);
    if (s) return VIEWS.staffp.render([s.id]);
    return `<div class="dossier"><header class="dhead">${avatar(p.first + ' ' + p.last, p.id, 64)}
      <div class="who"><h1>${esc(p.first + ' ' + p.last)}</h1><p>${esc(p.city)}</p></div></header></div>`;
  },
};

/* -------------------------------------------------------------- יומן --- */
VIEWS.log = {
  name: 'יומן פעולות',
  render() {
    return `<div class="pad narrow">
      <h1>יומן פעולות</h1>
      <p class="s">כל שינוי במערכת נרשם כאן עם מי, מה ומתי — וניתן לביטול כל עוד לא נדרס.</p>
      <ol class="logl">${DB.log.map(e => `<li><span class="w">${esc(e.what)}</span>
        <span class="d">${esc(e.dept)}</span><span class="t">${esc(e.when)} · ${esc(e.who)}</span>
        ${e.undo ? `<button class="btn" data-undo="${e.id}">בטל</button>` : '<span class="done">—</span>'}</li>`).join('')}</ol>
    </div>`;
  },
  mount() {
    document.querySelector('.logl').addEventListener('click', e => {
      const b = e.target.closest('[data-undo]'); if (!b) return;
      const entry = DB.log.find(x => x.id === b.dataset.undo); if (!entry || !entry.undo) return;
      entry.undo(); entry.what += ' · בוטל'; entry.undo = null;
      listeners.forEach(f => f('undo'));
      toast('הפעולה בוטלה', false);
    });
  },
};

/* ------------------------------------------------------------ האפיון --- */
VIEWS.spec = {
  name: 'האפיון',
  render() {
    const c = specCount();
    return `<div class="pad narrow">
      <h1>האפיון של המוסד</h1>
      <p class="s">${c.dept} אגפים · ${c.ent} ישויות · ${num(c.fld)} שדות · ${c.st} שלבים · ${c.fb} איסורים · ${c.roles} תפקידים.
        המסכים קוראים מכאן את השלבים, הכללים והשדות — זה לא תיעוד, זו המערכת.</p>
      <input id="sq" type="search" placeholder="חיפוש ישות או שדה…" aria-label="חיפוש באפיון">
      <div id="spec"></div></div>`;
  },
  mount() {
    const paint = () => {
      const q = (document.getElementById('sq').value || '').trim();
      document.getElementById('spec').innerHTML = SPEC.depts.map(d => {
        const ents = d.e.filter(e => !q || e.n.includes(q) || e.f.some(f => f[0].includes(q)));
        if (!ents.length) return '';
        return `<section class="specd"><h2>${esc(d.n)}<span>${ents.length} ישויות</span></h2>
          ${ents.map(e => `<details class="spece"><summary>${esc(e.n)}
            <span>${e.f.length} שדות${e.st.length ? ' · ' + e.st.length + ' שלבים' : ''}${e.fb.length ? ' · ' + e.fb.length + ' איסורים' : ''}</span></summary>
            ${e.mo ? `<p class="mo">${esc(e.mo)}</p>` : ''}
            ${e.st.length ? `<ol class="flow">${e.st.map(s => `<li>${esc(s)}</li>`).join('')}</ol>` : ''}
            ${e.fb.length ? `<ul class="rulelist">${e.fb.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
            <div class="fieldgrid">${e.f.map(f => `<span class="fld">${esc(f[0])}<i>${esc(f[1] || '')}${f[2] ? ' · חובה' : ''}</i></span>`).join('')}</div>
          </details>`).join('')}</section>`;
      }).join('');
    };
    document.getElementById('sq').addEventListener('input', paint);
    paint();
  },
};
