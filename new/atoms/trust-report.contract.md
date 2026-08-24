# חוזה · חוט trust-report
**תפקיד:** דוח-אמון פר-עמותה (טלפוניה · item 18) — כרטיס-אמון אחד שהמפעיל
מציג לוועד: מאגד את האורקלים הקיימים לרשימת-בדיקות ‏{key,label,pass,severity,
detail}, ומחשב ציון משוקלל-חומרה (critical=3 · high=2 · info=1), דרגה A–F
ומוכנות-להפעלה. טהור, קריאה-בלבד. הבדיקות בסדר קבוע:
1. ‏route-closure (critical) — סגירת-מסלולים דרך שקע-auditRoutes; בכשל ה-detail
   מאחד ‏dangling+orphanTransfers+missingGateways בפסיקים אחרי 'יתומים: '.
2. ‏failsafe (critical) — שקע-failsafeRoute; בהצלחה ‏detail='נפילה למנהל <fallback>'.
3. ‏toll-caps (high) — ‏featureOn(tenant,'voice.hardening').
4. ‏kosher-integrity (high) — רק כש-‏featureOn('voice.kosher'); pass ⇔ קיים מספר
   עם ‏kosher && onramp='sim-in-gateway' && gatewayChannel שלם && 'voice' ב-channels.
5. ‏recording-encryption (high) — רק כש-‏featureOn('recording'); **pass:false תמיד**
   (נחיל-5 F4 — ההצפנה דורמנטית, אסור להצהיר לוועד על-סמך דגל); ה-detail מבחין:
   ‏enabled ⇒ 'מוגדר אך דורמנטי…', אחרת 'הקלטות פעילות בלי הצפנה'.
6. ‏secrets (critical) — רק כש-‏opt.env נמסר; ‏secretPreflight([bundle], env).
7. ‏isolation (critical) — רק כש-‏opt.peers מערך לא-ריק; ‏crossTenantLeakScan([bundle,...peers]).
8. ‏downstream + ‏cti-readonly (info) — תמיד עוברים (הצהרת-אינווריאנטים).
ציון = ‏round(משקל-שעבר / משקל-כולל × 100) (ריק ⇒ 100). דרגה: כשל-critical
כלשהו ⇒ 'F'; אחרת ‏≥95 'A' · ‏≥85 'B' · ‏≥70 'C' · אחרת 'D'. ‏ready = אין
כשל-critical. ‏tenantId מועבר מ-‏bundle.tenant (חסר ⇒ ‏{}).
**שקעים (חוק-1 — השכנים הוזרקו כאובייקט eng):**
- ‏eng.auditRoutes(bundle) ⇒ ‏{ok, dangling[], orphanTransfers[], missingGateways[]}
- ‏eng.failsafeRoute(tenant) ⇒ ‏{ok, fallback}
- ‏eng.featureOn(tenant, key) ⇒ boolean (נשאל על 'voice.hardening' ·
  'voice.kosher' · 'recording')
- ‏eng.recordingEncryption(tenant) ⇒ ‏{enabled}
- ‏eng.secretPreflight(bundles, env) ⇒ ‏{ok, missing[]}
- ‏eng.crossTenantLeakScan(bundles) ⇒ ‏{clean, violations[]}
**קלט:** ‏bundle (תוצר buildTenant: ‏{tenant, files, manifest?}) · ‏opt
(‏{env?, peers?}, ברירת-מחדל {}) · ‏eng.
**פלט:** ‏{tenantId, checks, failing, score, grade, ready}.
**דוגמאות מחייבות** (בסיס: ‏auditRoutes⇒{ok:true} · ‏failsafeRoute⇒{ok:true,
fallback:'200'} · ‏featureOn לפי מפה; בלי env/peers אלא אם צוין):
1. ירוק מינימלי (hardening=true · kosher=false · recording=false) ⇒ בדיוק
   5 בדיקות בסדר ‏[route-closure, failsafe, toll-caps, downstream, cti-readonly],
   משקלים 3+3+2+1+1=10 ⇒ ‏score=100 · ‏grade='A' · ‏ready=true · ‏failing=[];
   ‏failsafe.detail='נפילה למנהל 200'; ‏tenantId='t1'.
2. ‏failsafeRoute⇒{ok:false} ⇒ ‏score=70 (‏7/10) · ‏grade='F' (critical) ·
   ‏ready=false · ‏failing=[failsafe] · ‏detail='אין מנהל — מבוי-סתום אפשרי'.
3. ‏hardening=false (השאר כדוגמה 1) ⇒ ‏score=80 · ‏grade='C' · ‏ready=true
   (כשל-high אינו חוסם-חי).
4. ‏recording=true · ‏recordingEncryption⇒{enabled:true} ⇒ נוספת בדיקה שישית
   ‏recording-encryption עם ‏pass=false תמיד; משקלים 12, עבר 10 ⇒
   ‏score=round(10/12×100)=83 · ‏grade='C'; ה-detail מתחיל ב-'מוגדר אך דורמנטי'.
5. ‏kosher=true עם ‏numbers=[{kosher:true,onramp:'sim-in-gateway',
   gatewayChannel:2,channels:['voice']}] (ו-hardening=true) ⇒ ‏kosher-integrity
   pass · משקלים 12, עבר 12 ⇒ ‏score=100 · ‏grade='A'.
6. ‏opt={env:{K:'v'},peers:[peer]} ⇒ ‏secretPreflight נקרא עם ‏([bundle], env)
   ו-‏crossTenantLeakScan עם ‏[bundle, peer]; ‏secretPreflight⇒{ok:false,
   missing:['A','B']} ⇒ ‏grade='F' · ‏ready=false ·
   ‏secrets.detail='חסרים 2 (שער-דומם)'.
7. ‏auditRoutes⇒{ok:false,dangling:['x'],orphanTransfers:['y'],
   missingGateways:['z']} ⇒ ‏route-closure.detail='יתומים: x, y, z'.
**מוצא:** maor/telephony/lib/report.mjs:22-81 (המקור הטהור; ‏src/lib/telephony/
engine.ts:92 הוא רק re-export מוקלד). ששת השכנים הוזרקו כאובייקט-שקעים eng
(חוק-1); הקבוע הפרטי SEV הוא חלק מהיחידה — נשאר בקובץ.
