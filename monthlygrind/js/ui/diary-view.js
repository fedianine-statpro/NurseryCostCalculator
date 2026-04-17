// Renders the scrolling diary/log pane. Newest entry at the top.
// We keep the latest 50 entries visible in the DOM.

const MAX_ENTRIES = 50;

export function renderLog(state) {
  const el = document.getElementById("log");
  const entries = state.log.slice(-MAX_ENTRIES);

  el.innerHTML = "";
  for (const entry of entries) {
    const li = document.createElement("li");
    li.className = `log__entry log__entry--${entry.kind || "sys"}`;
    const parts = [];
    parts.push(`<span class="log__turn">T${entry.turn}</span>`);
    parts.push(`<span class="log__text">${escapeHtml(entry.text)}</span>`);
    if (entry.delta !== undefined && entry.delta !== 0) {
      const sign = entry.delta > 0 ? "up" : "down";
      const val = entry.delta > 0 ? `+$${entry.delta}` : `−$${Math.abs(entry.delta)}`;
      parts.push(`<span class="log__delta log__delta--${sign}">${val}</span>`);
    }
    li.innerHTML = parts.join("");
    el.appendChild(li);
  }
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
