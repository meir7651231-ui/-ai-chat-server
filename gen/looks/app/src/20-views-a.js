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
const LETTERS = [...'אבגדהוזחטיכלמנסעפצקרשת'];
VIEWS.anashim = {
  name: 'אנשים',
  render() {
    return `<header class="hd"><h1>אנשים</h1>
      <p class="cnt">${num(DB.people.length)} רשומות · ${DB.families.length} משפחות · ${DB.staff.length} עובדים · ${DB.donors.length} תורמים</p>
      <input id="q" type="search" placeholder="שם, עיר או תפקיד…" aria-label="סינון אנשים" autocomplete="off"></header>
    <div class="cols">
      <nav class="rail" id="rail" aria-label="קפיצה לאות"></nav>
      <div class="book" id="book" aria-label="רשימת אנשים"></div>
      <aside class="panel"><div class="pcard" id="panel" aria-live="polite"></div></aside>
    </div>`;
  },
  mount() {
    const rows = () => {
      const q = (document.getElementById('q').value || '').trim();
      return DB.families.map(f => ({
        id: f.id, t: f.name, l: f.name.replace('משפחת ', '')[0], sub: f.city + ' · ' + f.kids.length + ' ילדים', f,
      })).filter(r => !q || r.t.includes(q) || r.sub.includes(q));
    };
    const paint = () => {
      const list = rows(); let out = '', last = '';
      list.forEach(r => {
        if (r.l !== last) { last = r.l; out += `<h2 class="lgroup" id="L${r.l}">${r.l}</h2>`; }
        out += `<a class="person" href="#/family/${r.id}">${avatar(r.t, r.id, 38)}
          <span><span class="nm">${esc(r.t)}</span><br><span class="ro">${esc(r.sub)}</span></span>
          <span class="ci">${money(balance(r.f))}</span></a>`;
      });
      document.getElementById('book').innerHTML = list.length ? out : empty('אין תוצאה.');
      document.getElementById('rail').innerHTML = LETTERS.map(L => {
        const has = list.some(r => r.l === L);
        return `<button data-l="${L}" data-has="${has ? 'y' : 'n'}"${has ? '' : ' disabled'} aria-label="קפוץ לאות ${L}">${L}</button>`;
      }).join('');
      const f = list[0] && list[0].f;
      document.getElementById('panel').innerHTML = f ? panelOf(f) : empty('בחר משפחה');
    };
    const panelOf = (f) => {
      const kids = f.kids.map(stu);
      return `<div class="who">${avatar(f.name, f.id, 52)}<span><h2>${esc(f.name)}</h2><span class="ro">${esc(f.city)}</span></span></div>
      <div class="chips">${tag(f.kids.length + ' ילדים')}${f.hok ? tag('הוראת קבע', 'ok') : tag('בלי הו״ק', 'warn')}${f.discount ? tag('הנחה ' + f.discount + '%') : ''}</div>
      <dl class="kv">
        <dt>אב</dt><dd>${esc(nameOf(f.head))}</dd>
        <dt>אם</dt><dd>${esc(nameOf(f.spouse))}</dd>
        <dt>טלפון</dt><dd class="num">${ltr(f.phone)}</dd>
        <dt>יתרה</dt><dd>${money(balance(f))}</dd>
        <dt>מקום בבית המדרש</dt><dd>${f.seat ? 'שורה ' + (seat(f.seat).row + 1) + ' · ' + (seat(f.seat).col + 1) : '—'}</dd>
      </dl>
      <div class="tree"><h3>ילדים במוסד</h3>
        <ul class="kidlist">${kids.map(k => `<li><a class="lk" href="#/student/${k.id}">${esc(nameOf(k.personId))}</a>
          <span>${esc(cls(k.classId).name)} · נוכחות ${k.att.filter(Boolean).length}/5</span></li>`).join('') || empty('אין')}</ul></div>
      <div class="acts"><a class="btn pri" href="#/family/${f.id}">פתיחת התיק המלא</a></div>`;
    };
    document.getElementById('q').addEventListener('input', paint);
    document.getElementById('rail').addEventListener('click', e => {
      const b = e.target.closest('[data-l]'); if (!b || b.dataset.has !== 'y') return;
      const t = document.getElementById('L' + b.dataset.l);
      if (t) t.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
    });
    document.getElementById('book').addEventListener('mouseover', e => {
      const a = e.target.closest('.person'); if (!a) return;
      const f = fam(a.getAttribute('href').split('/')[2]); if (f) document.getElementById('panel').innerHTML = panelOf(f);
    });
    paint();
  },
};

/* ------------------------------------------------------------- חינוך --- */
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
