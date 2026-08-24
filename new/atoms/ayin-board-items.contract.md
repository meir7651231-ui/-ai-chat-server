# חוזה · חוט ayin-board-items
**תפקיד:** כל השמות בכרטיסי מעקב-הטיפול כפריטי-לוח שטוחים — אותה סמנטיקה
כמו הדוח המלא (תומך בלי ayin מדולג · שם ריק/רווחים מדולג · ayin חלקי ממוזג
עם emptyAyin). ‏eyes עובר כפייה-למספר (+) כשאינו ריק/‏null, אחרת '' ·
‏done עובר כפייה-לבוליאני (!!). טהור.
**שקעים (חוק-1):** emptyAyin()→תיק-ריק עם כל המערכים (names/answers/log/…).
**קלט:** supporters[] ({id, name, phone?, ayin?}) · שקע emptyAyin.
**פלט:** {supporterId, supporter, phone, name, eyes, note, done, stage}[].
**דוגמאות מחייבות (supporters = [ {id:'s1', name:'דוד', phone:'050',
ayin:{stage:'lead', names:[{name:'משה',eyes:'7',note:'x',done:1},
{name:'',eyes:2},{name:'רות'}]}}, {id:'s2', name:'בלי-ayin'} ]):** אורך=2 ·
‏[0]={supporterId:'s1', supporter:'דוד', phone:'050', name:'משה', eyes:7
(‏'7'→7 מספר), note:'x', done:true (‏1→true), stage:'lead'} ·
‏[1]={…, name:'רות', eyes:'' (‏undefined⇒''), note:'', done:false, stage:'lead'} ·
שם ריק מדולג · תומך בלי-ayin מדולג · טלפון חסר ⇒ ''.
**מוצא:** חולץ כלשונו מ-maor/src/lib/ayin.ts:335-357 (‏emptyAyin שוקע).
