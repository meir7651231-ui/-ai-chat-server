# חוזה · חוט telephony-to-tenant
**תפקיד:** ממיר תצורת-אשף-טלפוניה ידידותית ל-raw-tenant שמנוע-הטלפוניה
(config-as-data) מקבל. ערוצי-שער (gatewayChannel) מוקצים אוטומטית ל-SIM-ים
לפי סדרם; קווים בלי ‏e164 מסוננים; אפס דליפת-ספק (רק ציוד-לקוח).
מפות-הקבע (חלק מהמכונה, מקובעות במקור): ‏kind→onramp:
‏sim→'sim-in-gateway' · ‏virtual→'customer-forward' · ‏whatsapp→'device-link';
‏kind→channels: ‏sim/virtual→['voice'] · ‏whatsapp→['whatsapp'].
**קלט:** ‏tc (תצורת-אשף: ‏numbers[]{id,e164,label?,kind,kosher?} · ‏officeDays[] ·
‏officeStart/End · ‏officeExt/managerExt/vmBox · ‏city · דגלי ‏kosherMode/
hebrewCalendar/shabbat/fasts/zmanim/voicemail) · ‏orgName · ‏tenantId.
**פלט:** אובייקט-tenant ‏{tenantId, orgName, timezone, city?, officeHours,
numbers, destinations, outbound, cti, features}.
**דוגמאות מחייבות** (‏tc בסיס: ‏officeDays:[4,0,2] · ‏officeStart:'09:00' ·
‏officeEnd:'17:00' · ‏officeExt:'101' · ‏managerExt:'201' · ‏vmBox:'100' ·
‏city:'' · ‏kosherMode:false · ‏hebrewCalendar:true · ‏zmanim:false ·
‏shabbat:true · ‏fasts:false · ‏voicemail:true):
1. קו ‏{id:'n2',e164:'',kind:'virtual'} מסונן — לא מופיע ב-‏numbers.
2. ‏{id:'n1',e164:' +972501234567 ',label:'קו ראשי',kind:'sim'} ⇒
   ‏{id:'n1', e164:'+972501234567' (trim), label:'קו ראשי', type:'sim',
   onramp:'sim-in-gateway', channels:['voice'], gatewayChannel:1}; SIM שני
   מקבל ‏gatewayChannel:2.
3. ‏{id:'n3',e164:'+97277',kind:'virtual'} (בלי label) ⇒ ‏label:'n3' (נופל ל-id),
   ‏onramp:'customer-forward', בלי ‏gatewayChannel; ‏{id:'n4',e164:'+97252',
   kind:'whatsapp',kosher:true} ⇒ ‏onramp:'device-link', channels:['whatsapp'],
   kosher:true (מפתח קיים רק כש-truthy).
4. ‏outbound.defaultNumberId = ה-SIM הראשון (‏'n1'); בלי אף SIM ⇒ הקו הראשון;
   אפס קווים ⇒ ‏'n1' (ברירת-מחדל).
5. ‏officeHours = ‏{days:[0,2,4] (ממוין!), start:'09:00', end:'17:00'};
   ‏destinations = ‏{office:{ext:['101'],ringSeconds:25}, manager:{ext:'201',
   ringSeconds:30}, voicemail:{box:'100'}}; ‏cti = ‏{org:tenantId,mode:'directory'}.
6. ‏orgName='' ⇒ ‏'ארגון'; ‏city='' ⇒ אין מפתח ‏city; ‏timezone תמיד
   ‏'Asia/Jerusalem'; ‏city:'צפת' ⇒ ‏city:'צפת'.
7. ‏features = ‏{'voice.kosher':false, 'calendar.hebrew':true,
   'calendar.shabbat':true, 'calendar.fasts':false, 'calendar.zmanim':false,
   voicemail:true} (מיפוי ישיר מדגלי-האשף).
**מוצא:** maor/src/components/telephony/lib.ts:68-132 (‏telephonyToTenant);
מפות ‏ONRAMP/CHANNELS — שם, שורות 23-31 (קבועים פרטיים-למודול, הוטמעו באטום).
