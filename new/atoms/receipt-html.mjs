/** 🔌 חוט · receipt-html — הקבלה כ-HTML מוכן-להדפסה (טהור — מחרוזת בלבד).
 *  מוצא: maor/src/lib/receipt.ts:165-195 כלשונו; ‏receiptLines הוזרק כשקע (חוק-1 —
 *  אפס import פנימי; מקור-האמת היחיד לתוכן נשאר אצל שורות-הטקסט).
 *  ‏esc = עוזר-פנימי לא-מיוצא במקור — נכלל (שם-תורם/ייעוד הם קלט חופשי, אסור שיוזרקו). */
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** @param o פרטי-הקבלה · @param receiptLines שקע: (o)=>string[] — שורות-הטקסט של הקבלה */
export function receiptHtml(o, receiptLines) {
  const lines = receiptLines(o).filter((x) => x !== '');
  const [first, ...rest] = lines;
  const body = rest.map((ln) => '<div class="ln">' + esc(ln) + '</div>').join('\n');
  return (
    '<!doctype html><html dir="rtl" lang="he"><head><meta charset="utf-8">' +
    '<title>' + esc('קבלה ' + o.rid) + '</title>' +
    '<style>' +
    'body{font-family:"Segoe UI",Arial,"Noto Sans Hebrew",sans-serif;color:#111;margin:0;padding:32px;direction:rtl}' +
    '.sheet{max-width:520px;margin:0 auto;border:1px solid #bbb;border-radius:10px;padding:28px 32px}' +
    '.mark{font-size:12px;letter-spacing:.08em;color:#555;text-align:left}' +
    '.ln{font-size:14.5px;line-height:1.9}' +
    '.ln:first-of-type{font-size:19px;font-weight:700;margin-bottom:6px}' +
    '@media print{body{padding:0}.sheet{border:none}}' +
    '</style></head><body><div class="sheet">' +
    '<div class="mark">' + esc(first) + '</div>' +
    body +
    '</div></body></html>'
  );
}
