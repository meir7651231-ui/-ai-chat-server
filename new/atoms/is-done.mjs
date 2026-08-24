/** חוט · is-done — האם קמפיין-החייגן הסתיים (תור ריק). חוזה: is-done.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dialer.ts:97-105. */
export function isDone(c) {
  return c.queue.length === 0;
}
