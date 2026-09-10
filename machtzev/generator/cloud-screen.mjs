#!/usr/bin/env node
// ☁️ cloud-screen — מסך-החיבור **נגזר מדאטה** (G60 · הכרעה-30 «לא אחד-אחד ביד»).
//   שלושת הסעיפים (ענן · דחיפה · OAuth) נכתבו ביד, שורת-ווידג׳ט אחרי שורת-ווידג׳ט,
//   וזה בדיוק הדפוס שהכרעה-30 אסרה. עכשיו: `cloud-sockets.data.json` מתאר **מה היכולת
//   צריכה ומתי לשאול**, וכאן מרנדרים לולאה אחת. שקע חדש = שורה בדאטה, אפס Dart ביד.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const SOCKETS = JSON.parse(fs.readFileSync(path.join(HERE, 'cloud-sockets.data.json'), 'utf8'));

const pad = (top, body) => `Padding(padding: const EdgeInsets.only(top: ${top}), child: ${body})`;

/// מרנדר את סעיף-הענן. `k` = פונקציית-הקבוע של המסך, `L` = מילון-הכרום.
export function renderCloudSection(k, L) {
  const g = SOCKETS.gate;
  const field = (s) => {
    const val = s.kind === 'store' ? `appStore.setting('${s.key}')` : s.key;
    const set = s.kind === 'store' ? `appStore.setSetting('${s.key}', v)` : `${s.key} = v`;
    return `DsField(label: ${k(L[s.label])}, hint: '${s.hint}', value: ${val}, onChanged: (v) => ${set})`;
  };
  const rows = [];
  rows.push(`Padding(padding: const EdgeInsets.only(bottom: 8), child: Text(_cloudState(), style: TextStyle(color: DsLook.of(context).muted, fontSize: 13)))`);
  for (const need of ['always', 'config', 'account']) {
    const fs_ = SOCKETS.sockets.filter((s) => s.need === need);
    const ns = SOCKETS.notes.filter((n) => n.need === need);
    const as = SOCKETS.actions.filter((a) => a.need === need);
    const body = [
      ...fs_.map((s) => pad(8, field(s))),
      ...ns.map((n) => pad(8, `DsNote(message: ${k(L[n.label])}, label: '', tone: 0)`)),
      ...as.map((a) => pad(8, a.primary
        ? `DsPrimaryButton(label: ${k(L[a.label])}, onTap: _cloudBusy ? null : ${a.call})`
        : `DsChipButton(label: ${k(L[a.label])}, onTap: _cloudBusy ? null : ${a.call})`)),
    ];
    if (!body.length) continue;
    rows.push(g[need] ? `if (${g[need]}) ...[\n        ${body.join(',\n        ')},\n      ]` : body.join(',\n      '));
  }
  rows.push(`if (_cloudNote.isNotEmpty) ${pad(8, `DsNote(message: _cloudNote, label: '', tone: 0)`)}`);
  return `DsSection(title: ${k(L.cloudTitle)}, children: [
      ${rows.join(',\n      ')},
    ])`;
}

/// כמה ווידג׳טים המסך אמור להכיל — השער סופר מול זה (אין ווידג׳ט-ענן שלא בא מהדאטה).
export const cloudWidgetCount = () => SOCKETS.sockets.length + SOCKETS.notes.length + SOCKETS.actions.length + 1;   // +1 = שורת-ההודעה (_cloudNote), חלק קבוע מהסעיף
