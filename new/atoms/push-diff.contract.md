# חוזה · חוט push-diff
**תפקיד:** דחיפת diff של מסד-הישויות לענן בכתיבות-אצווה — עד **400 פעולות
ל-batch** (מגבלת Firestore: 500). כל ‏set עובר ‏toPlain (סיבוב-JSON: ‏Firestore
דוחה undefined — מנוקה; וגם מנתק הפניות); ‏dek קיים ⇒ המסמך מוצפן למעטפה;
**נעדר ⇒ נתיב plaintext ביט-זהה** (ratchet). אכיפת-נתונים (dormant): כשהיא
דלוקה, מסמך באוסף-נאכף נושא ‏skey **plaintext מחוץ למעטפה** (Rules + ‏where
בארגון-מוצפן), ומסמך-ה-meta מקולף מלוג-הפעולות (שמות-תורמים נשארים מקומיים).
מסמך-ה-meta נכתב **אחרי כל האצוות**, בעסקה נפרדת בטוחה-למונים (דרך השקע —
לא בכתיבת-האצווה העיוורת; רצף קבלות-מס).
**שקעים (חוק-1 — קריאות-החוץ ומצב-המודול הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedCol(name) ⇒ string — שם-אוסף ⇒ נתיב סקופי-לארגון.
- ‏fs — ערכת-Firestore: ‏{ doc, writeBatch } — ‏writeBatch(db) ⇒ batch עם
  ‏set(ref,body) / delete(ref) / commit() אסינכרוני.
- ‏encryptDoc(plain, dek) ⇒ ‏Promise<מעטפה> — נקרא רק כש-dek קיים.
- ‏pushMeta(metaPlain, dek) ⇒ ‏Promise<void> — במקור: ‏pushMetaCounterSafe
  (עסקת-המונים-המונוטוניים 🐛 נחיל-עמוק 13.8) — שכן ⇒ שקע.
- ‏sup — ערכת-האכיפה (במקור: מצב-מודול ‏supEnforceOn + ‏supporterPartition):
  ‏{ enforceOn:boolean, keyedCols:string[], docSkey(col,data,map)⇒string,
  stripAuditMeta(meta)⇒meta }. ברירת-מחדל: ‏{enforceOn:false} — כבוי ⇒ ביט-זהה.
**קלט:** ‏diff = ‏{sets:[{col,id,data}], deletes:[{col,id}], meta?} · ‏dek ·
‏supKeyBySpId (Map, ברירת-מחדל ריקה) · השקעים. **פלט:** ‏Promise<void>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד):
1. ‏sets=[{col:'families', id:'f1', data:{name:'לוי', amount:250, note:undefined}}] ·
   ‏deletes=[{col:'rooms', id:'r9'}] · ‏dek=null · אכיפה כבויה · בלי meta ⇒
   ‏batch יחיד, commit אחד; ‏set על ‏doc(db,'orgs/demo/families','f1') עם גוף
   ‏{name:'לוי', amount:250} — ‏note=undefined **נוקה** (toPlain) והגוף אינו אותו
   אובייקט כמו ‏data (הפניה מנותקת); ‏delete על ‏doc(db,'orgs/demo/rooms','r9');
   ‏pushMeta **לא** נקרא.
2. הצפנה: ‏dek='DEK' · ‏encryptDoc=(p)=>({enc:JSON.stringify(p), iv:'IV'}) ⇒
   ‏encryptDoc נקרא עם העותק-הנקי ‏({name:'לוי', amount:250}, 'DEK') והגוף
   שנכתב = המעטפה ‏{enc:…, iv:'IV'} בלבד.
3. אכיפה + skey: ‏sup={enforceOn:true, keyedCols:['supporters','events'],
   docSkey:(col,data,map)=>col+'#'+data.forWho, …} · set באוסף ‏'supporters'
   ‏(data={forWho:'sp1', amount:100}) ⇒ הגוף = ‏{skey:'supporters#sp1', amount:100,
   forWho:'sp1'} — ‏skey ראשון ומחוץ למעטפה; ‏docSkey מקבל את ‏data **הגולמי**
   ואת ‏supKeyBySpId. ‏set באוסף לא-נאכף ('rooms') באותה קריאה ⇒ בלי skey.
4. חיתוך-אצווה: 401 פעולות ⇒ שני batches — 400 + 1, שני commits, ה-commit
   הראשון קודם לפתיחת ה-batch השני.
5. ‏meta בלי אכיפה: ‏diff.meta={seq:12, receiptSeq:7} ⇒ ‏pushMeta נקרא פעם אחת,
   אחרי ה-commit האחרון, עם ‏({seq:12, receiptSeq:7}, dek); ‏stripAuditMeta לא נקרא.
6. ‏meta עם אכיפה: ‏sup.enforceOn=true · ‏stripAuditMeta=(m)=>({seq:m.seq}) ·
   ‏meta={seq:12, auditlog:[{op:'x'}]} ⇒ ‏pushMeta מקבל ‏{seq:12} — הלוג קולף.
**מוצא:** maor/src/lib/cloud.ts:422-457 (‏pushDiff — נתיב-הסנכרון הראשי).
חולץ כלשונו; ‏requireDb/scopedCol/doc/writeBatch/encryptDoc/pushMetaCounterSafe/
‏supEnforceOn/SUP_KEYED_COLS/docSkey/stripAuditMeta הפכו לשקעים (חוק-1);
‏toPlain (עוזר-פרטי חד-שורתי של אותו קובץ, cloud.ts:383-385) הוטמע ומתועד.
