const DEFAULT_SETTINGS = {
  serverUrl: "",
  deviceToken: "",
  paired: false
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

async function getSettings() {
  return { ...DEFAULT_SETTINGS, ...(await chrome.storage.local.get(DEFAULT_SETTINGS)) };
}

async function saveSettings(settings) {
  await chrome.storage.local.set(settings);
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function sendToActiveTab(message) {
  const tab = await getActiveTab();
  if (!tab?.id) throw new Error("No active tab");
  return chrome.tabs.sendMessage(tab.id, message);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message?.type) {
      case "settings:get":
        sendResponse({ ok: true, settings: await getSettings() });
        break;
      case "settings:save":
        await saveSettings(message.settings || {});
        sendResponse({ ok: true, settings: await getSettings() });
        break;
      case "browser:getActiveTab": {
        const tab = await getActiveTab();
        sendResponse({ ok: true, tab: tab ? { id: tab.id, title: tab.title, url: tab.url } : null });
        break;
      }
      case "browser:getPageSnapshot": {
        const snapshot = await sendToActiveTab({ type: "content:getPageSnapshot" });
        sendResponse({ ok: true, snapshot });
        break;
      }
      case "browser:listForms": {
        const forms = await sendToActiveTab({ type: "content:listForms" });
        sendResponse({ ok: true, forms });
        break;
      }
      case "browser:highlight": {
        const result = await sendToActiveTab({ type: "content:highlight", selector: message.selector });
        sendResponse({ ok: true, result });
        break;
      }
      default:
        sendResponse({ ok: false, error: `Unknown message type: ${message?.type}` });
    }
  })().catch(error => sendResponse({ ok: false, error: error.message }));
  return true;
});
