/* החצר · חסד · תפעול · שידוכים · תקשורת */

/* -------------------------------------------------------------- החצר --- */
VIEWS.hatzer = {
  name: 'החצר',
  render() {
    const inside = DB.queue.find(q => q.state === 'inside');
    const wait = DB.queue.filter(q => q.state === 'wait');
    const mask = !ROLE.kvittel;
    const reason = (q) => mask && q.reason.includes('קוויטל')
      ? '<span class="masked" title="רק הגבאי רואה תוכן קוויטל">קוויטל · חסוי</span>' : esc(q.reason);
    return `<div class="board">
      <header class="top"><h1>קבלת קהל</h1><span class="sp"></span>
        <span class="meta">${DB.today.hd} ${DB.today.hy} · ${ltr('13:48')}</span></header>
      <div class="stage">
        <section class="nowcard" aria-live="polite">
          <span class="cap">נכנס עכשיו</span>
          <span class="n num">${inside ? ltr(String(inside.no)) : '—'}</span>
          <span class="who">${inside ? esc(fam(inside.familyId).name) : 'אין איש בפנים'}</span>
          <span class="why">${inside ? reason(inside) : ''}</span>
          <span class="since">${inside ? 'בפנים ' + inside.mins + ' דקות · ממוצע היום ' + ltr('5:20') + ' דקות' : ''}</span>
        </section>
        <div class="side">
          <div class="stat"><b>${wait.length}</b><span>ממתינים</span></div>
          <div class="stat"><b>כ-${ltr(String(wait.length * 5 + 2))} דק׳</b><span>המתנה צפויה לאחרון</span></div>
          <div class="stat"><b>${31 + DB.queue.filter(q => q.state === 'done').length}</b><span>נכנסו היום</span></div>
        </div>
      </div>

      <section class="queue"><h2>הבאים בתור</h2>
        <ul id="q">${wait.map((q, i) => `<li class="${i === 0 ? 'next' : ''}">
          <span class="num">${ltr(String(q.no))}</span>
          <span><span class="nm"><a class="lk" href="#/family/${q.familyId}">${esc(fam(q.familyId).name)}</a></span>
          <br><span class="rs">${reason(q)}</span></span>
          <span class="eta">~${(i + 1) * 5} דק׳</span>
          <button class="in" data-in="${q.id}">הכנס</button></li>`).join('')}</ul>
      </section>

      <form class="intake" onsubmit="return false">
        <label>משפחה<input id="in-name" placeholder="שם משפחה" autocomplete="off" list="fams"></label>
        <datalist id="fams">${DB.families.slice(0, 40).map(f => `<option value="${esc(f.name)}">`).join('')}</datalist>
        <label>עניין<select id="in-kind"><option>קוויטל</option><option>שידוך</option><option>עניין הוועד</option><option>בקשת הנחה</option></select></label>
        <button id="add">הוספה לתור</button>
      </form>
      <p class="hint">${esc(momentOf('החצר', 'קבלת קהל') || 'המספר הבא יינתן אוטומטית.')}
        ${mask ? ' · תוכן הקוויטלך חסוי בתפקיד ' + esc(ROLE.name) + '.' : ''}</p>
    </div>`;
  },
  mount() {
    document.getElementById('add').onclick = () => {
      const nm = document.getElementById('in-name').value.trim();
      const f = DB.families.find(x => x.name === nm) || DB.families.find(x => x.name.includes(nm));
      if (!f) { blocked('רישום בלי זיהוי מבקש', 'החצר', 'קבלת קהל'); return; }
      const no = Math.max(...DB.queue.map(q => q.no)) + 1;
      act('נוסף לתור · ' + f.name, 'החצר', () => {
        DB.queue.push({ id: 'u' + Date.now(), no, familyId: f.id, reason: document.getElementById('in-kind').value, state: 'wait', mins: null });
        return () => DB.queue.pop();
      });
      toast(f.name + ' נוספה לתור · מספר ' + no);
    };
    document.getElementById('q').addEventListener('click', e => {
      const b = e.target.closest('[data-in]'); if (!b) return;
      const q = DB.queue.find(x => x.id === b.dataset.in);
      const prev = DB.queue.find(x => x.state === 'inside');
      act('הוכנס · ' + fam(q.familyId).name, 'החצר', () => {
        const before = prev && prev.state;
        if (prev) prev.state = 'done';
        q.state = 'inside'; q.mins = 0;
        return () => { q.state = 'wait'; q.mins = null; if (prev) prev.state = before; };
      });
      toast(fam(q.familyId).name + ' נכנס');
    });
  },
};

/* --------------------------------------------------------------- חסד --- */
const LFLOW = ['בקשה', 'ועדה', 'אושר', 'ניתן', 'בהחזר', 'נפרע'];
VIEWS.hesed = {
  name: 'חסד',
  render() {
    const f = fund();
    const fb = forbiddenOf('חסד', 'הלוואה');
    const late = DB.loans.filter(l => l.stage === 'באיחור');
    const col = (st) => DB.loans.filter(l => l.stage === st);
    return `<header class="hd"><h1>חסד · גמ״ח הלוואות</h1><span class="sp"></span></header>
    <section class="fund">
      <div>${kpi(money(f.cap), 'הון הקרן', 'ההון הרשום של הגמ״ח.')}</div>
      <div>${kpi(money(f.out), 'בהלוואות פעילות', `סכום הקרן שטרם הוחזר: לכל הלוואה בשלב ניתן/בהחזר/באיחור — הסכום כפול חלק התשלומים שנותרו. ${f.active} הלוואות.`)}</div>
      <div class="free">${kpi(money(f.free), 'זמין להלוואה', 'הון הקרן פחות מה שבחוץ.')}</div>
      <div>${kpi(DB.loans.length, 'הלוואות בתיק', 'כל הרשומות, בכל השלבים.')}</div>
      <div class="${late.length ? 'err' : ''}">${kpi(late.length, 'באיחור', 'הלוואות שסומנו «באיחור» — שלב מתוך האפיון.')}</div>
    </section>

    <div class="board" id="board">
      ${LFLOW.map(st => {
      const cards = col(st), sum = cards.reduce((a, c) => a + c.amount, 0);
      return `<section class="col" data-stage="${esc(st)}" aria-label="${esc(st)}">
        <h2>${esc(st)}<span class="cnt">${cards.length}</span><span class="sum">${money(sum)}</span></h2>
        ${cards.map(l => card(l)).join('') || '<p class="empty">אין בקשות בשלב הזה</p>'}</section>`;
    }).join('')}
    </div>

    ${late.length ? `<section class="lane"><h2>מחוץ לזרימה</h2>
      <div class="board">${late.map(l => card(l)).join('')}</div></section>` : ''}

    <section class="rules"><h3>מה אסור — מתוך האפיון</h3>
      <ul>${fb.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      <p class="moment">${esc(momentOf('חסד', 'הלוואה'))}</p></section>`;
  },
  mount() {
    document.getElementById('board').addEventListener('click', e => {
      const b = e.target.closest('[data-dir]'); if (!b || b.disabled) return;
      const l = loan(b.closest('.card').dataset.id);
      const i = LFLOW.indexOf(l.stage) + (+b.dataset.dir);
      if (i < 0 || i >= LFLOW.length) return;
      const to = LFLOW[i];
      /* הכלל של המוסד, לא שלי: הלוואה בלי שני ערבים לא עוברת את הוועדה */
      if (+b.dataset.dir > 0 && LFLOW.indexOf(to) >= 2 && l.guarantors < 2) {
        blocked('הלוואה בלי שני ערבים', 'חסד', 'הלוואה'); return;
      }
      const from = l.stage;
      act('הלוואה ' + fam(l.familyId).name + ' · ' + from + ' ← ' + to, 'חסד', () => { l.stage = to; return () => { l.stage = from; }; });
      toast(fam(l.familyId).name + ' · עברה ל«' + to + '»');
    });
  },
};
function card(l) {
  const f = fam(l.familyId), i = LFLOW.indexOf(l.stage);
  return `<article class="card" data-id="${l.id}">
    <div class="r1"><span class="fam"><a class="lk" href="#/loanp/${l.id}">${esc(f.name)}</a></span><span class="amt">${money(l.amount)}</span></div>
    <p class="why">${esc(l.purpose)}</p>
    <div class="meta">
      <span class="tag ${l.guarantors === 2 ? 'ok' : l.guarantors === 1 ? 'warn' : 'err'}">${l.guarantors}/2 ערבים</span>
      ${l.days > 7 ? `<span class="tag warn">${l.days} ימים ממתין</span>` : l.days ? `<span class="tag">${l.days} ימים</span>` : ''}
      ${l.late ? `<span class="tag err">${l.late} תשלומים באיחור</span>` : ''}
    </div>
    ${l.paid ? `<div class="bar" role="img" aria-label="נפרעו ${l.paid} מתוך ${l.installments}"><i style="width:${Math.round(l.paid / l.installments * 100)}%"></i></div>
      <p class="why">${l.paid} מתוך ${l.installments} תשלומים</p>` : ''}
    <div class="move">
      <button data-dir="-1"${i <= 0 ? ' disabled' : ''} aria-label="אחורה">→ אחורה</button>
      <button data-dir="1"${i < 0 || i >= LFLOW.length - 1 ? ' disabled' : ''} aria-label="קדימה">קדימה ←</button>
    </div></article>`;
}

/* ------------------------------------------------------------- תפעול --- */
VIEWS.tifol = {
  name: 'תפעול',
  render([routeId]) {
    const r = route(routeId) || DB.routes[0];
    return `<header class="hd"><h1>תפעול · הסעות ואחזקה</h1><span class="sp"></span></header>
    <div class="pad">
      <div class="picker" role="group" aria-label="בחירת קו">
        ${DB.routes.map(x => `<a href="#/tifol/${x.id}" role="button" aria-pressed="${x.id === r.id}" class="${x.driver ? '' : 'noDriver'}">
          <i style="background:var(--${colorOf(x.id)})"></i>${esc(x.name.split(' · ')[0])}<span>${esc(x.name.split(' · ')[1] || '')}</span></a>`).join('')}
      </div>

      <div class="linehead"><h2>${esc(r.name)}</h2>
        <span class="drv">נהג: ${r.driver ? link('staffp/' + r.driver, nameOf(staff(r.driver).personId)) : '—'}</span>
        ${r.at ? `<span class="drv">בדרך · ${Math.round((1 - r.at[1]) * 100)}% לתחנה הבאה</span>` : ''}
        ${r.driver ? '' : '<span class="alert">אין נהג משובץ</span>'}
        ${r.driver ? '' : '<button class="btn" id="assign">שיבוץ נהג</button>'}</div>

      <div class="map">${lineSvg(r)}</div>
      <p class="riders">
        <span>${kpi(ridersOf(r), 'נוסעים בקו', 'נספרו התלמידים שמשויכים לתחנות הקו.')}</span>
        <span>תחנות: <b>${r.stops.length}</b></span>
        <span>יציאה: <b>${ltr(r.stops[0].time)}</b> · הגעה: <b>${ltr(r.stops[r.stops.length - 1].time)}</b></span>
      </p>

      <section class="stopstable">
        <h2>מי עולה בכל תחנה</h2>
        <div style="overflow-x:auto"><table>
          <thead><tr><th scope="col">תחנה</th><th scope="col">שעה</th><th scope="col">נוסעים</th><th scope="col">מי</th></tr></thead>
          <tbody>${r.stops.map(s => `<tr><th scope="row">${esc(s.name)}</th><td class="num">${ltr(s.time)}</td>
            <td class="num">${s.riders.length}</td>
            <td>${s.riders.slice(0, 4).map(id => `<a class="lk" href="#/student/${id}">${esc(nameOf(stu(id).personId))}</a>`).join(' · ')}
              ${s.riders.length > 4 ? ' ועוד ' + (s.riders.length - 4) : ''}</td></tr>`).join('')}</tbody>
        </table></div>
      </section>

      <section class="calls"><h2>קריאות שירות פתוחות</h2>
        <p class="s">${DB.calls.length} פתוחות · ${DB.calls.filter(c => c.sev === 'דחוף').length} דחופות ·
          ${DB.calls.filter(c => !c.owner).length} בלי אחראי</p>
        <ul>${DB.calls.map(c => `<li class="d${c.sev === 'דחוף' ? 1 : c.sev === 'רגיל' ? 2 : 3}">
          <span class="sev" aria-hidden="true"></span>
          <span>${esc(c.text)}<br><span class="age">${esc(c.sev)}</span></span>
          <span class="age">${c.days} ימים</span>
          <span class="own ${c.owner ? '' : 'none'}">${c.owner ? esc(nameOf(staff(c.owner).personId)) : 'לא שובץ'}</span></li>`).join('')}</ul>
      </section>
    </div>`;
  },
  mount([routeId]) {
    const b = document.getElementById('assign'); if (!b) return;
    b.onclick = () => {
      const r = route(routeId) || DB.routes[0];
      const d = DB.staff.find(s => s.role === 'נהג' && !s.absent);
      act('שובץ נהג לקו · ' + r.name, 'תפעול', () => { r.driver = d.id; return () => { r.driver = null; }; });
      toast(nameOf(d.personId) + ' שובץ ל' + r.name);
    };
  },
};
function lineSvg(r) {
  const W = 760, pad = 64, y = 64, step = (W - pad * 2) / Math.max(1, r.stops.length - 1);
  const x = k => W - pad - k * step;
  const c = colorOf(r.id);
  let s = `<svg viewBox="0 0 ${W} 132" role="img" aria-label="${esc(r.name)}: ${r.stops.map(st => st.name + ' ב-' + st.time).join(', ')}">
    <line x1="${x(0)}" y1="${y}" x2="${x(r.stops.length - 1)}" y2="${y}" stroke="var(--${c})" stroke-width="7" stroke-linecap="round"></line>`;
  r.stops.forEach((st, k) => {
    const last = k === r.stops.length - 1;
    s += `<circle cx="${x(k)}" cy="${y}" r="${last ? 10 : 7}" fill="var(--card)" stroke="var(--${c})" stroke-width="4"></circle>
      <text x="${x(k)}" y="${y - 22}" text-anchor="middle">${esc(st.name)}</text>
      <text class="t2" x="${x(k)}" y="${y + 30}" text-anchor="middle" dir="ltr">${esc(st.time)}</text>` +
      (st.riders.length ? `<text class="t3" x="${x(k)}" y="${y + 46}" text-anchor="middle" fill="var(--${c})">${st.riders.length} נוסעים</text>` : '');
  });
  if (r.at) {
    const bx = x(r.at[0]) - step * r.at[1];
    s += `<g transform="translate(${bx.toFixed(1)},${y})"><rect x="-15" y="-13" width="30" height="26" rx="7" fill="var(--${c})"></rect>
      <text x="0" y="5" text-anchor="middle" fill="var(--on-acc)" style="font-size:13px">🚌</text></g>`;
  }
  return s + '</svg>';
}

/* ----------------------------------------------------------- שידוכים --- */
VIEWS.shiduch = {
  name: 'שידוכים',
  render([pid]) {
    const p = DB.proposals.find(x => x.id === pid) || DB.proposals[0];
    const A = fam(p.a), B = fam(p.b);
    const yes = p.crit.filter(c => c.ok === 'yes').length;
    const pct = Math.round(yes / p.crit.length * 100);
    const stages = stagesOf('שידוכים', 'הצעה');
    const side = (f, cls2, who) => `<section class="side ${cls2}">
      ${avatar(f.name, f.id, 54)}
      <h2>${esc(who)} · ${esc(f.name.replace('משפחת ', '')[0])}׳</h2>
      <p class="fam">${esc(f.name)}</p>
      <dl><div><dt>עיר</dt><dd>${esc(f.city)}</dd></div>
        <div><dt>אחים במוסד</dt><dd class="num">${f.kids.length}</dd></div>
        <div><dt>אב</dt><dd>${esc(nameOf(f.head))}</dd></div>
        <div><dt>תיק</dt><dd><a class="lk" href="#/family/${f.id}">פתיחה</a></dd></div></dl>
      <p class="note">${ROLE.name === 'שדכן' || ROLE.name === 'מנהל כללי' ? 'הערות הרכז גלויות לך.' : 'הערות הרכז חסויות בתפקיד ' + esc(ROLE.name) + '.'}</p></section>`;
    return `<header class="hd"><h1>שידוכים</h1><span class="sp"></span>
      <span class="lock">${DB.proposals.length} הצעות · גישה: רכז השידוכים</span></header>
    <div class="pad">
      <div class="duel">
        ${side(A, 'a', 'בחור')}
        <div class="axis"><span class="line"></span>
          <div class="ring">${ring(pct, '--ok', 74, 7, 'התאמה ' + pct + ' אחוז')}<b>${pct}%</b></div>
          <span class="lbl">${yes} מתוך ${p.crit.length} נקודות נבדקו והתאימו</span><span class="line"></span></div>
        ${side(B, 'b', 'בחורה')}
      </div>

      <section class="crit"><h2>מה נבדק</h2>
        ${p.crit.map(c => `<div class="row"><span class="k">${esc(c.k)}</span>
          <span>${c.ok === 'yes' ? 'תואם' : 'חלקית'}</span>
          <span class="m ${c.ok}" aria-label="${c.ok === 'yes' ? 'מתאים' : 'חלקית'}">${c.ok === 'yes' ? '✓' : '≈'}</span>
          <span class="b">${c.ok === 'yes' ? 'תואם' : 'לבירור'}</span></div>`).join('')}
      </section>

      <div class="acts">
        ${stages.map(s => `<button class="btn ${s === p.stage ? 'pri' : ''}" data-stage="${esc(s)}" data-p="${p.id}">${esc(s)}</button>`).join('')}
      </div>

      <section class="pipe"><h2>כל ההצעות</h2>
        <ol>${stages.map(s => `<li><b>${DB.proposals.filter(x => x.stage === s).length}</b><span>${esc(s)}</span></li>`).join('')}</ol>
        <div class="plist">${DB.proposals.slice(0, 12).map(x => `<a class="lk" href="#/shiduch/${x.id}">
          ${esc(fam(x.a).name.replace('משפחת ', ''))} — ${esc(fam(x.b).name.replace('משפחת ', ''))}<span>${esc(x.stage)}</span></a>`).join('')}</div>
      </section>
    </div>`;
  },
  mount() {
    document.querySelector('.acts').addEventListener('click', e => {
      const b = e.target.closest('[data-stage]'); if (!b) return;
      const p = DB.proposals.find(x => x.id === b.dataset.p), from = p.stage, to = b.dataset.stage;
      if (from === to) return;
      act('הצעה · ' + from + ' ← ' + to, 'שידוכים', () => { p.stage = to; return () => { p.stage = from; }; });
      toast('ההצעה עברה ל«' + to + '»');
    });
  },
};

/* ----------------------------------------------------------- תקשורת --- */
const TPL = [
  ['תזכורת תשלום', 'שלום {שם}, נותרה יתרה של {סכום} בשכר הלימוד לשנת {שנה}. ניתן לשלם בקישור: {קישור}. אם שולם — נא להתעלם.'],
  ['ביטול לימודים', 'הורים יקרים, בשל {סיבה} אין לימודים ביום {יום}. ההסעות מבוטלות. נעדכן על השלמה.'],
  ['הזמנה לאירוע', 'בשמחה רבה מוזמנים ל{אירוע} ביום {יום} בשעה {שעה} באולם המוסד.'],
  ['הודעה חופשית', ''],
];
VIEWS.tikshor = {
  name: 'תקשורת',
  render() {
    return `<header class="hd"><h1>תקשורת</h1><span class="sp"></span>
      <span class="s">שלוחה ${ltr('073-000-0000')}</span></header>
    <div class="work">
      <div class="editor">
        <fieldset><legend>למי</legend><div class="chips">
          ${DB.groups.map((g, i) => `<label><input type="checkbox" class="grp" data-c="${g.count}" ${i === 0 ? 'checked' : ''}>${esc(g.name)}<span class="cnt">${g.count}</span></label>`).join('')}
        </div></fieldset>
        <fieldset><legend>תבנית</legend><select id="tpl">${TPL.map(([n], i) => `<option value="${i}">${esc(n)}</option>`).join('')}</select></fieldset>
        <fieldset><legend>נוסח</legend>
          <textarea id="txt" aria-describedby="meter">${esc(TPL[0][1])}</textarea>
          <div class="vars"><span class="s">הוספת שדה:</span>
            ${['{שם}', '{סכום}', '{שנה}', '{כיתה}', '{קישור}'].map(v => `<button data-v="${v}">${v}</button>`).join('')}</div>
          <p class="meter" id="meter"><span>תווים: <b id="chars">0</b></span><span>מקטעי SMS: <b id="segs">1</b></span>
            <span>נמענים: <b id="rcpt">0</b></span><span>עלות: <b id="cost">₪0</b></span></p>
        </fieldset>
        <div class="send"><button class="pri" id="sendBtn">שליחה עכשיו</button>
          <button id="shabbat">שליחה בשבת (בדיקה)</button>
          <span class="note" id="note">${esc(momentOf('תקשורת', 'הודעה') || '')}</span></div>
      </div>

      <aside class="preview"><h2>כך זה ייראה אצל ההורה</h2>
        <div class="phone"><div class="bar"><span>${ltr('13:48')}</span><span>${ltr('SMS')}</span></div>
          <p class="from">המוסד</p><div class="bubble" id="bub"></div>
          <p class="stamp">נמסר · ${ltr('13:48')}</p></div>
        <p class="previewfoot">השדות בסוגריים מוחלפים לכל נמען בנפרד — הערכים נלקחים מהמחסן.</p>
        <div class="sample" id="sample"></div>
      </aside>

      <section class="hist"><h2>נשלחו לאחרונה</h2>
        <ul>${DB.messages.map(m => `<li><span class="t">${esc(m.text)}</span>
          <span class="ok">${m.ok} נשלחו</span>${m.bad ? `<span class="bad">${m.bad} נכשלו</span>` : ''}
          <span class="when">${esc(m.when)}</span></li>`).join('')}</ul></section>
    </div>`;
  },
  mount() {
    const txt = document.getElementById('txt'), bub = document.getElementById('bub');
    const f0 = DB.families[0];
    const paint = () => {
      const s = txt.value;
      bub.innerHTML = esc(s).replace(/\{[^}]+\}/g, m => '<span class="var">' + m + '</span>') || '<span class="ph">הנוסח יופיע כאן…</span>';
      const n = s.length, segs = Math.max(1, Math.ceil(n / (/[֐-׿]/.test(s) ? 70 : 160)));
      const rcpt = [...document.querySelectorAll('.grp')].filter(c => c.checked).reduce((a, c) => a + +c.dataset.c, 0);
      document.getElementById('chars').textContent = n;
      document.getElementById('segs').textContent = segs;
      document.getElementById('rcpt').textContent = rcpt;
      document.getElementById('cost').innerHTML = money(segs * rcpt * 0.07);
      /* התצוגה עם נתונים אמיתיים של נמען אחד */
      const filled = s.replace('{שם}', f0.name).replace('{סכום}', nis(balance(f0))).replace('{שנה}', DB.tariff.year)
        .replace('{כיתה}', cls(stu(f0.kids[0]) ? stu(f0.kids[0]).classId : 'c0').name).replace('{קישור}', 'mosad.link/p/' + f0.id);
      document.getElementById('sample').innerHTML = `<h3>דוגמה אמיתית · ${esc(f0.name)}</h3><p>${esc(filled)}</p>`;
    };
    txt.addEventListener('input', paint);
    document.querySelectorAll('.grp').forEach(c => c.addEventListener('change', paint));
    document.getElementById('tpl').addEventListener('change', e => { txt.value = TPL[+e.target.value][1]; paint(); });
    document.querySelectorAll('.vars button').forEach(b => b.onclick = () => {
      const p = txt.selectionStart ?? txt.value.length;
      txt.value = txt.value.slice(0, p) + b.dataset.v + txt.value.slice(txt.selectionEnd ?? p);
      txt.focus(); txt.selectionStart = txt.selectionEnd = p + b.dataset.v.length; paint();
    });
    document.getElementById('sendBtn').onclick = () => {
      const n = +document.getElementById('rcpt').textContent;
      if (!n) { blocked('שליחה בלי נמענים', 'תקשורת', 'הודעה'); return; }
      act('נשלחה הודעה ל-' + n + ' נמענים', 'תקשורת', () => {
        DB.messages.unshift({ id: 'g' + Date.now(), text: txt.value.slice(0, 40) + '…', ok: n, bad: 0, when: 'עכשיו' });
        return () => DB.messages.shift();
      });
      toast('נשלח ל-' + n + ' נמענים (דוגמה)');
    };
    document.getElementById('shabbat').onclick = () =>
      blocked('שליחה בשבת/חג (תזמון אוטומטי למוצאי)', 'תקשורת', 'הודעה');
    paint();
  },
};
