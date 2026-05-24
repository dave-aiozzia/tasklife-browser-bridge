const $ = id => document.getElementById(id);

async function send(type, payload = {}) {
  return chrome.runtime.sendMessage({ type, ...payload });
}

function show(obj) {
  $("output").textContent = JSON.stringify(obj, null, 2);
}

async function loadSettings() {
  const res = await send("settings:get");
  if (res.ok) $("serverUrl").value = res.settings.serverUrl || "";
}

$("saveSettings").addEventListener("click", async () => {
  const serverUrl = $("serverUrl").value.trim();
  const res = await send("settings:save", { settings: { serverUrl } });
  $("settingsStatus").textContent = res.ok ? "Saved." : `Error: ${res.error}`;
});

$("snapshot").addEventListener("click", async () => {
  show(await send("browser:getPageSnapshot"));
});

$("forms").addEventListener("click", async () => {
  show(await send("browser:listForms"));
});

$("send").addEventListener("click", () => {
  const text = $("prompt").value.trim();
  if (!text) return;
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = `You: ${text}`;
  $("messages").appendChild(div);
  $("prompt").value = "";
});

loadSettings();
