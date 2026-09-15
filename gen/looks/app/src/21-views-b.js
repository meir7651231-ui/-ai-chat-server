/* גבייה · תרומות · כספים · בית המדרש */

/* ------------------------------------------------------------- גבייה --- */
VIEWS.gviya = {
  name: 'גבייה',
  render() {
    const t = totals();
    const late = sortBy(lateFamilies(), f => -balance(f)).slice(0, 5);
    const top = sortBy(DB.families.filter(f => balance(f) > 0), f => -balance(f)).slice(0, 8);
    const fb = forbiddenOf('גבייה', 'חיוב');
    const tasks = [
      ['צ׳קים להפקדה', DB.payments.filter(p => p.method === 'המחאה').length, 'עד יום חמישי', 2],
      ['משפחות בפיגור', late.length, 'שיחה או תזכורת', 5],
      ['בקשות הנחה', DB.families.filter(f => f.discount >= 21).length, 'ממתינות לוועדה', 1],
      ['הלוואות', DB.loans.filter(l => l.stage === 'בקשה').length, 'להחזר החודש', 3],
      ['קבלות', DB.payments.slice(0, 12).length, 'להפקה', 4],
    ];
    return `<header class="app"><h1>גבייה <small>שכר לימוד · ${DB.tariff.year} · נתוני דוגמה</small></h1>
      <nav class="ctx" aria-label="תצוגה">
        <button aria-pressed="true">הכל</button><button aria-pressed="false">בפיגור</button><button aria-pressed="false">בהוראת קבע</button>
      </nav>
      <div class="find"><span aria-hidden="true">⌕</span>
        <input id="q" type="search" role="combobox" aria-expanded="false" aria-controls="hits" aria-autocomplete="list"
               placeholder="שם משפחה, סכום או פעולה…" autocomplete="off" aria-label="חיפוש בגבייה">
        <select id="kind" aria-label="סוג תוצאה"><option value="">כל הסוגים</option><option>משפחה</option><option>תשלום</option></select>
      </div></header>

    <div class="results" id="results" hidden>
      <ul class="hits" id="hits" role="listbox" aria-label="תוצאות חיפוש"></ul>
      <div class="detail" id="detail" aria-live="polite"></div>
    </div>

    <div class="pad">
      <div class="shelf-h"><h2>לטפל היום</h2><a class="lk" href="#/log">יומן ←</a></div>
      <div class="shelf">${tasks.map(([n, c, m, col]) => `<div class="sq">
        <div class="art num" style="background:var(--c${col}-soft);color:var(--c${col})">${c}</div>
        <div class="t">${esc(n)}</div><div class="m">${esc(m)}</div></div>`).join('')}</div>

      <div class="shelf-h"><h2>משפחות לפי יתרה פתוחה</h2>
        ${kpi(money(t.open), 'סך פתוח', `סכום היתרות של ${DB.families.length} משפחות: חיוב אחרי הנחה (${money(t.due)}) פחות ששולם (${money(t.paid)}).`)}</div>
      <div class="shelf">${top.map(f => `<a class="rd" href="#/family/${f.id}">
        ${avatar(f.name, f.id, 92)}<div class="t">${esc(f.name)}</div><div class="m">${money(balance(f))}</div></a>`).join('')}</div>

      <section class="calc" aria-labelledby="calcH" id="calc"></section>

      <div class="prods-h"><h2>איך החיוב מחושב</h2>
        <p class="moment">${esc(momentOf('גבייה', 'חיוב'))}</p></div>
      <div class="rules">
        <h3>מה אסור — מתוך האפיון</h3>
        <ul>${fb.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      </div>
    </div>`;
  },
  mount() {
    let famSel = sortBy(DB.families.filter(f => balance(f) > 0), f => -balance(f))[0];
    const q = document.getElementById('q'), results = document.getElementById('results'), hits = document.getElementById('hits');

    const calc = () => {
      const f = famSel, k = f.kids.length;
      const bus = f.kids.filter(id => stu(id).routeId).length;
      const rows = [
        ['שכר לימוד · ' + k + ' ילדים × ' + nis(DB.tariff.tuition), k * DB.tariff.tuition],
        ['הסעות · ' + bus + ' נוסעים', bus * DB.tariff.bus],
        ['ספרים וציוד · ' + k + ' × ' + nis(DB.tariff.books), k * DB.tariff.books],
        ['הנחה · ' + f.discount + '%', -(charged(f) - discounted(f))],
        ['שולם עד היום', -f.paid],
      ];
      document.getElementById('calc').innerHTML = `
        <h2 id="calcH" class="s">חישוב חיוב למשפחה</h2>
        <div class="pick">${avatar(f.name, f.id, 32)}
          <span class="who"><a class="lk" href="#/family/${f.id}">${esc(f.name)}</a> · ${f.kids.length} ילדים · ${esc(f.city)}</span>
          <button class="btn" id="changeFam">שנה משפחה</button></div>
        <button class="rate" id="rateBtn" aria-expanded="false" aria-controls="bd">
          <span aria-hidden="true">🔒</span><span>תעריף ${DB.tariff.year}: ${money(DB.tariff.tuition)} לילד</span><span aria-hidden="true">›</span></button>
        <div class="lbl" id="amtLbl">נותר לתשלום</div>
        <div class="bigrow"><input class="big num" id="amount" inputmode="numeric" aria-labelledby="amtLbl"><span class="unit" aria-hidden="true">₪</span></div>
        <div class="offer">רישום תשלום עכשיו?
          <button id="payBtn">${money(Math.min(balance(f), 2000))} כעת</button></div>
        <div class="bd" id="bd" hidden>
          ${rows.map(r => `<div${r[1] < 0 ? ' class="minus"' : ''}><span>${esc(r[0])}</span><span class="num">${r[1] < 0 ? '−' : ''}${money(Math.abs(r[1]))}</span></div>`).join('')}
          <div class="tot"><span>נותר לתשלום</span><span class="num">${money(balance(f))}</span></div>
        </div>`;
      const amount = document.getElementById('amount');
      const fit = () => { amount.style.width = Math.max(4, amount.value.length + 0.5) + 'ch'; };
      amount.value = ROLE.money ? Math.round(balance(f)).toLocaleString('he-IL') : '•••';
      fit();
      amount.addEventListener('input', () => { const d = amount.value.replace(/[^\d]/g, ''); amount.value = d ? Number(d).toLocaleString('he-IL') : ''; fit(); });
      document.getElementById('rateBtn').onclick = e => {
        const bd = document.getElementById('bd'), open = bd.hidden;
        bd.hidden = !open; e.currentTarget.setAttribute('aria-expanded', String(open));
      };
      document.getElementById('changeFam').onclick = () => { q.focus(); q.value = 'משפחת'; search(); };
      document.getElementById('payBtn').onclick = () => {
        const sum = Math.min(balance(f), 2000);
        if (sum <= 0) { blocked('יתרה שלילית', 'גבייה', 'חיוב'); return; }
        act('נרשם תשלום ' + nis(sum) + ' · ' + f.name, 'גבייה', () => {
          const before = f.paid; f.paid += sum;
          DB.payments.unshift({ id: 'y' + Date.now(), familyId: f.id, amount: sum, method: 'אשראי', ago: 0 });
          return () => { f.paid = before; DB.payments.shift(); };
        });
        toast('נרשם תשלום ' + nis(sum) + ' למשפחת ' + f.name.replace('משפחת ', ''));
      };
    };

    const search = () => {
      const v = q.value.trim(), kind = document.getElementById('kind').value;
      if (!v) { results.hidden = true; q.setAttribute('aria-expanded', 'false'); return; }
      let list = [];
      if (kind !== 'תשלום') list = list.concat(DB.families.filter(f => f.name.includes(v) || f.city.includes(v) || String(Math.round(balance(f))).includes(v)).slice(0, 8).map(f => ({ f })));
      if (kind !== 'משפחה') list = list.concat(DB.payments.filter(p => fam(p.familyId).name.includes(v)).slice(0, 4).map(p => ({ p })));
      results.hidden = !list.length; q.setAttribute('aria-expanded', String(!!list.length));
      hits.innerHTML = list.map((x, i) => x.f
        ? `<li role="option" id="hit${i}" aria-selected="${i === 0}" data-fam="${x.f.id}">${avatar(x.f.name, x.f.id)}
            <span><span class="t">${esc(x.f.name)}</span><br><span class="s">${esc(x.f.city)} · ${x.f.kids.length} ילדים</span></span>
            <span class="num">${money(balance(x.f))}</span></li>`
        : `<li role="option" id="hit${i}" aria-selected="false" data-pay="${x.p.id}">${avatar(fam(x.p.familyId).name, x.p.familyId)}
            <span><span class="t">תשלום · ${esc(x.p.method)}</span><br><span class="s">${esc(fam(x.p.familyId).name)}</span></span>
            <span class="num">${money(x.p.amount)}</span></li>`).join('');
      const first = list[0];
      document.getElementById('detail').innerHTML = first && first.f ? detailOf(first.f) : '<div class="none">בחר תוצאה</div>';
      if (list.length) q.setAttribute('aria-activedescendant', 'hit0');
    };
    const detailOf = (f) => `<h3>${esc(f.name)}</h3><p class="s">${esc(f.city)} · ${esc(f.phone)}</p>
      <dl class="dl"><div><dt>חיוב אחרי הנחה</dt><dd>${money(discounted(f))}</dd></div>
      <div><dt>שולם</dt><dd>${money(f.paid)}</dd></div>
      <div><dt>יתרה</dt><dd>${money(balance(f))}</dd></div>
      <div><dt>הוראת קבע</dt><dd>${f.hok ? 'פעילה' : 'אין'}</dd></div></dl>
      <div class="acts"><button class="btn pri" data-open="${f.id}">בחר לחישוב</button>
        <a class="btn" href="#/family/${f.id}">תיק מלא</a></div>`;

    q.addEventListener('input', search);
    document.getElementById('kind').addEventListener('change', search);
    q.addEventListener('keydown', e => {
      const rows = [...hits.querySelectorAll('li')];
      if (!rows.length) return;
      let i = rows.findIndex(r => r.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        i = (i + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
        rows.forEach((r, k) => r.setAttribute('aria-selected', String(k === i)));
        q.setAttribute('aria-activedescendant', rows[i].id);
        const f = fam(rows[i].dataset.fam); if (f) document.getElementById('detail').innerHTML = detailOf(f);
      } else if (e.key === 'Enter' && rows[i] && rows[i].dataset.fam) {
        famSel = fam(rows[i].dataset.fam); q.value = ''; search(); calc();
      }
    });
    document.getElementById('results').addEventListener('click', e => {
      const b = e.target.closest('[data-open]'); if (b) { famSel = fam(b.dataset.open); q.value = ''; search(); calc(); return; }
      const li = e.target.closest('[data-fam]'); if (li) { const f = fam(li.dataset.fam); document.getElementById('detail').innerHTML = detailOf(f); }
    });
    calc();
  },
};

/* ------------------------------------------------------------ תרומות --- */
VIEWS.trumot = {
  name: 'תרומות',
  render() {
    const c = DB.campaigns[0], got = raised(c.id), pct = got / c.goal * 100;
    const wall = DB.donations.slice(0, 8);
    const amb = sortBy(DB.ambassadors, a => -ambRaised(a.id));
    const ago = (i) => ['לפני 4 דק׳', 'לפני 19 דק׳', 'לפני 52 דק׳', 'לפני שעה', 'לפני 3 שעות', 'לפני 4 שעות', 'אתמול', 'אתמול'][i] || 'השבוע';
    return `<div class="page">
      <header class="top"><span class="eyebrow">מגבית פעילה</span><span class="sp"></span></header>
      <h1 class="hero">${esc(c.name)} — מגבית ${DB.tariff.year}</h1>
      <p class="lede">כל שקל נרשם על שם התורם בפנקס הבניין, וכל אבן-דרך נפתחת רק כשהקודמת נסגרה.
        ${num(DB.donations.filter(d => d.campaignId === c.id).length)} תרומות מ-${num(new Set(DB.donations.filter(d => d.campaignId === c.id).map(d => d.donorId)).size)} תורמים.</p>

      <section class="meter" aria-label="התקדמות המגבית">
        <div class="nums"><span class="now">${money(got)}</span><span class="goal">מתוך ${money(c.goal)}</span>
          <span class="pct">${kpi(Math.round(pct) + '%', 'מהיעד', `סכום ${DB.donations.filter(d => d.campaignId === c.id).length} התרומות למגבית חלקי היעד ${nis(c.goal)}.`)}</span></div>
        <div class="track" role="img" aria-label="נאספו ${Math.round(pct)} אחוז"><div class="fill" style="width:${Math.min(100, pct).toFixed(1)}%"></div></div>
        <div class="flags">${c.miles.map(([p, n]) => `<span class="flag ${pct >= p ? 'done' : ''}" style="inset-inline-start:${p}%"><b>${esc(n)}</b>${p}%</span>`).join('')}</div>
        <div class="cta"><button class="pri" id="addDon">רישום תרומה</button><button id="recBtn">הפקת קבלה 46א׳</button></div>
      </section>

      <div class="two">
        <section class="wall"><h2 class="sec">קיר התורמים</h2><p class="sub">8 האחרונות · מתעדכן עם כל רישום</p>
          <ul id="wall">${wall.map((d, i) => { const dn = DB.donors.find(x => x.id === d.donorId); return `<li>
            <span><span class="who">${dn.anon ? 'בעילום שם' : `<a class="lk" href="#/donorp/${dn.id}">${esc(nameOf(dn.personId))}</a>`}</span>
            <br><span class="where">${esc(dn.city)}</span></span>
            <span class="amt">${money(d.amount)}</span><span class="ago">${ago(i)}</span></li>`; }).join('')}</ul></section>

        <section class="amb"><h2 class="sec">שגרירים</h2><p class="sub">כל שגריר והיעד האישי שלו</p>
          <ul>${amb.map((a, i) => { const got2 = ambRaised(a.id); return `<li>
            <div class="r1"><span class="rank">${i + 1}</span>
              <span class="nm"><a class="lk" href="#/person/${a.personId}">${esc(nameOf(a.personId))}</a></span>
              <span class="sum">${money(got2)}</span></div>
            <div class="t"><i style="width:${Math.min(100, got2 / a.goal * 100)}%"></i></div>
            <div class="of"><span>${Math.round(got2 / a.goal * 100)}% מהיעד (${money(a.goal)})</span>
              <span>${Math.round(got2 / raised('k0') * 100)}% מהמגבית</span></div></li>`; }).join('')}</ul></section>
      </div>

      <section class="more"><h2 class="sec">מגביות נוספות</h2>
        <ul>${DB.campaigns.slice(1).map(k => `<li><a class="lk" href="#/trumot">${esc(k.name)}</a>
          <span>${k.open ? 'פתוחה' : 'נסגרה'} · ${money(raised(k.id))}</span></li>`).join('')}</ul></section>
    </div>`;
  },
  mount() {
    document.getElementById('addDon').onclick = () => {
      const donor = DB.donors[Math.floor(Math.random() * DB.donors.length)];
      const amount = 1800;
      act('נרשמה תרומה ' + nis(amount), 'תרומות', () => {
        DB.donations.unshift({ id: 'n' + Date.now(), donorId: donor.id, amount, campaignId: 'k0', amb: donor.amb, ago: 0, method: 'אשראי' });
        return () => DB.donations.shift();
      });
      toast('נרשמה תרומה של ' + nis(amount) + ' — המד והקיר עודכנו');
    };
    document.getElementById('recBtn').onclick = () =>
      blocked(forbiddenOf('תרומות', 'תרומה')[0] || 'מחיקת תרומה שהופקה עליה קבלה', 'תרומות', 'תרומה');
  },
};

/* ------------------------------------------------------------- כספים --- */
VIEWS.ksafim = {
  name: 'כספים',
  render() {
    const bt = budgetTotals();
    const t = totals(), got = raised('k0');
    const maxM = Math.max(...DB.budget.map(b => Math.max(...b.months)), 240);
    const perMonth = DB.hmonths.map((_, i) => DB.budget.reduce((a, b) => a + b.months[i], 0));
    const planM = Math.round(bt.plan / 11);
    return `<div class="deskbar"><span class="s">גיליון להדפסה · נתוני דוגמה</span><span class="sp"></span>
      <button onclick="window.print()">הדפסה</button></div>
    <div class="sheet">
      <header class="mast"><div><h1>דוח תקציב מול ביצוע</h1>
        <p class="sub2">שנת ${DB.tariff.year} · נכון ל-${DB.today.hd} · <span class="stamp">טיוטה לוועד</span></p></div>
        <p class="who">עמותת המוסד (ע״ר)<br>מספר עמותה ${ltr('58-0000000')}<br>מגיש: גזבר המוסד</p></header>

      <h2 class="num"><i>1</i>תמצית</h2>
      <p class="body">התקציב לשנת ${DB.tariff.year} עומד על ${money(bt.plan * 1000)}, והביצוע בפועל —
        אחד-עשר חודשים — על ${money(bt.actual * 1000)}, ${Math.round(bt.actual / bt.plan * 100)}% מהתקציב.
        מנגד, הגבייה משכר לימוד הביאה ${money(t.paid)} מתוך ${money(t.due)} שחויבו, והמגבית ${money(got)}.
        ${DB.budget.filter(b => budgetActual(b) > b.plan).length} סעיפים חרגו.</p>

      <h2 class="num"><i>2</i>ביצוע לפי סעיף</h2>
      <table><caption>באלפי ₪ · עמודת הניצול מציירת את היחס בין הביצוע לתקציב</caption>
        <thead><tr><th scope="col">סעיף</th><th scope="col" class="n">תקציב</th><th scope="col" class="n">בפועל</th>
          <th scope="col" class="n">יתרה</th><th scope="col" class="use">ניצול</th></tr></thead>
        <tbody>${DB.budget.map(b => { const a = budgetActual(b), pct = Math.round(a / b.plan * 100), over = a > b.plan;
      return `<tr><th scope="row" class="reg">${esc(b.name)}</th>
          <td class="n">${num(b.plan)}</td><td class="n${over ? ' over' : ''}">${num(a)}</td>
          <td class="n${over ? ' over' : ''}">${num(b.plan - a)}</td>
          <td class="use"><div class="usebar"><i class="${over ? 'over' : ''}" style="width:${Math.min(100, pct)}%"></i></div>
            <div class="usetxt">${pct}%</div></td></tr>`; }).join('')}</tbody>
        <tfoot><tr><td>סך הכל</td><td class="n">${num(bt.plan)}</td><td class="n">${num(bt.actual)}</td>
          <td class="n">${num(bt.plan - bt.actual)}</td><td class="use">${Math.round(bt.actual / bt.plan * 100)}%</td></tr></tfoot></table>

      <h2 class="num"><i>3</i>הוצאה חודשית מול התכנון</h2>
      <figure><svg viewBox="0 0 640 220" class="chart" role="img"
          aria-label="הוצאה חודשית מול תכנון של ${planM} אלף בחודש; אלול טרם נסגר">
        ${[0, 60, 120, 180, 240].map(v => `<g><line class="gl" x1="42" y1="${180 - v / maxM * 150}" x2="632" y2="${180 - v / maxM * 150}"></line>
          <text x="36" y="${180 - v / maxM * 150 + 3}" text-anchor="end">${v}</text></g>`).join('')}
        <line class="axis" x1="42" y1="180" x2="632" y2="180"></line>
        ${DB.hmonths.map((m, i) => { const x = 632 - 12 - i * 49, hp = planM / maxM * 150, hr = perMonth[i] / maxM * 150;
      return `<rect x="${x - 34}" y="${180 - hp}" width="16" height="${hp}" fill="var(--sunk)" rx="2"></rect>
          ${perMonth[i] ? `<rect x="${x - 17}" y="${180 - hr}" width="16" height="${hr}" fill="var(--c${perMonth[i] > planM ? 5 : 2})" rx="2"></rect>` : ''}
          <text x="${x - 18}" y="196" text-anchor="middle">${esc(m)}</text>`; }).join('')}
        <text x="636" y="24" text-anchor="end" class="unit">אלפי ₪</text></svg>
        <figcaption>העמודה האפורה היא התכנון החודשי (${num(planM)} אלף), הצבעונית הביצוע. אלול טרם נסגר.</figcaption></figure>
      <p class="key"><span><i style="background:var(--sunk)"></i>תכנון</span>
        <span><i style="background:var(--c2)"></i>בתוך התכנון</span><span><i style="background:var(--c5)"></i>מעל התכנון</span></p>

      <h2 class="num"><i>4</i>להכרעת הוועד</h2>
      <p class="body">א. חידוש ביטוח האולם — פג בעוד שישה ימים.
        ב. ${DB.budget.filter(b => budgetActual(b) > b.plan).map(b => 'הגדלת סעיף «' + b.name + '» ב-' + num(budgetActual(b) - b.plan) + ' אלף').join('; ') || 'אין חריגות'}.
        ג. ${lateFamilies().length} משפחות בפיגור בלי הוראת קבע — מוצע מכתב ועדה.</p>

      <div class="sign"><div><b></b>גזבר</div><div><b></b>מנהל</div><div><b></b>יו״ר הוועד</div></div>
      <p class="foot">הדוח הופק מהמערכת · הסכומים באלפי ₪ אלא אם צוין אחרת</p>
    </div>`;
  },
};

/* -------------------------------------------------------- בית המדרש --- */
VIEWS.medrash = {
  name: 'בית המדרש',
  render([seatId]) {
    const sel = seat(seatId) || DB.seats.find(s => s.familyId) || DB.seats[0];
    const now = DB.minyanim[4];
    return `<header class="hd"><h1>בית המדרש</h1><span class="sp"></span>
      <p class="zman">${DB.today.hd} ${DB.today.hy} · שקיעה ${ltr('18:52')}<br>צאת הכוכבים ${ltr('19:09')}</p></header>
    <div class="split">
      <section class="day"><h2>סדר היום</h2>
        <ol>${DB.minyanim.map(m => `<li class="${m === now ? 'now' : m.time < now.time ? 'past' : ''}">
          <time>${ltr(m.time)}</time><span><span class="t">${esc(m.name)}</span>
          ${m.where ? `<br><span class="s">${esc(m.where)}${m.count ? ' · ' + m.count + ' משתתפים' : ''}</span>` : ''}</span></li>`).join('')}</ol>
      </section>

      <div class="hall pad2">
        <h2>מפת מקומות · האולם הגדול</h2>
        <p class="s">${DB.seats.length} מקומות · ${kpi(DB.seats.filter(s => s.familyId).length, 'משויכים', 'נספרו מקומות שיש להם שדה משפחה.')} ·
          ${kpi(DB.seats.filter(s => s.status === 'פנוי').length, 'פנויים', 'מקומות בלי שיוך ובלי שמירה.')}</p>
        <div class="plan">
          <div class="aron">ארון הקודש · מזרח</div>
          <div class="seats" id="seats">
            ${[0, 1, 2, 3, 4, 5].map(r => `<span class="rl">${['א', 'ב', 'ג', 'ד', 'ה', 'ו'][r]}</span>` +
      DB.seats.filter(s => s.row === r).map(s => `<button class="seat s${['פנוי', 'קבוע', 'מושכר', 'שמור'].indexOf(s.status)}"
        data-id="${s.id}" aria-pressed="${s.id === sel.id}"
        aria-label="שורה ${r + 1} מקום ${s.col + 1} · ${s.status}${s.familyId ? ' · ' + fam(s.familyId).name : ''}">${s.col + 1}</button>`).join('')).join('')}
          </div>
          <div class="bima">בימה</div>
        </div>
        <div class="seatinfo" id="info" aria-live="polite"></div>
        <p class="key"><span><i style="background:var(--c1-soft)"></i>קבוע</span><span><i style="background:var(--c4-soft)"></i>מושכר</span>
          <span><i style="background:var(--sunk)"></i>פנוי</span><span><i class="s3" style="background:var(--raise)"></i>שמור</span></p>

        <section class="yahr"><h2>יארצייטים השבוע</h2>
          <ul>${DB.yahrzeits.map(y => `<li><b>${esc(y.name)}</b><span class="d">${esc(y.day)}</span>
            <span class="f"><a class="lk" href="#/family/${y.familyId}">${esc(fam(y.familyId).name)}</a></span></li>`).join('')}</ul></section>
      </div>
    </div>`;
  },
  mount([seatId]) {
    const info = document.getElementById('info');
    const show = (s) => {
      info.innerHTML = `<b>שורה ${['א', 'ב', 'ג', 'ד', 'ה', 'ו'][s.row]} · מקום ${s.col + 1}</b>
        <span>${esc(s.status)}${s.familyId ? ' · ' + fam(s.familyId).name : ''}${s.price ? ' · ' + nis(s.price) + ' לשנה' : ''}</span>
        <span class="sp"></span>
        ${s.familyId ? `<a class="btn" href="#/family/${s.familyId}">תיק המשפחה</a>` : ''}
        <button class="btn" data-assign="${s.id}">${s.familyId ? 'ביטול שיוך' : 'שיוך מקום'}</button>`;
    };
    document.getElementById('seats').addEventListener('click', e => {
      const b = e.target.closest('.seat'); if (!b) return;
      document.querySelectorAll('.seat').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      show(seat(b.dataset.id));
    });
    info.addEventListener('click', e => {
      const b = e.target.closest('[data-assign]'); if (!b) return;
      const s = seat(b.dataset.assign);
      if (s.familyId) {
        const f = fam(s.familyId);
        act('בוטל שיוך מקום · ' + f.name, 'בית המדרש', () => { s.familyId = null; s.status = 'פנוי'; f.seat = null; return () => { s.familyId = f.id; s.status = 'קבוע'; f.seat = s.id; }; });
        toast('המקום שוחרר');
      } else {
        const f = DB.families.find(x => !x.seat);
        act('שויך מקום · ' + f.name, 'בית המדרש', () => { s.familyId = f.id; s.status = 'קבוע'; f.seat = s.id; return () => { s.familyId = null; s.status = 'פנוי'; f.seat = null; }; });
        toast('המקום שויך ל' + f.name);
      }
    });
    show(seat(seatId) || DB.seats.find(s => s.familyId) || DB.seats[0]);
  },
};
