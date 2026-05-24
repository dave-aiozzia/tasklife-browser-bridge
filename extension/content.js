function visibleText() {
  return document.body?.innerText?.replace(/\n{3,}/g, "\n\n").trim().slice(0, 20000) || "";
}

function selectedText() {
  return window.getSelection()?.toString() || "";
}

function fieldLabel(el) {
  if (el.id) {
    const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (label?.innerText) return label.innerText.trim();
  }
  const wrapping = el.closest("label");
  if (wrapping?.innerText) return wrapping.innerText.trim();
  return el.getAttribute("aria-label") || el.getAttribute("placeholder") || el.getAttribute("name") || "";
}

function selectorFor(el) {
  if (el.id) return `#${CSS.escape(el.id)}`;
  if (el.name) return `${el.tagName.toLowerCase()}[name="${CSS.escape(el.name)}"]`;
  return el.tagName.toLowerCase();
}

function listForms() {
  const controls = [...document.querySelectorAll("input, textarea, select, button")];
  return controls.map((el, index) => ({
    index,
    tag: el.tagName.toLowerCase(),
    type: el.getAttribute("type") || "",
    name: el.getAttribute("name") || "",
    id: el.id || "",
    label: fieldLabel(el),
    placeholder: el.getAttribute("placeholder") || "",
    selector: selectorFor(el),
    disabled: Boolean(el.disabled),
    valuePreview: el.type === "password" ? "[password field]" : String(el.value || "").slice(0, 120)
  }));
}

function highlight(selector) {
  const el = document.querySelector(selector);
  if (!el) return { found: false };
  const previous = el.style.outline;
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  el.style.outline = "3px solid #7c3aed";
  setTimeout(() => { el.style.outline = previous; }, 4000);
  return { found: true, selector };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message?.type === "content:getPageSnapshot") {
      sendResponse({
        url: location.href,
        title: document.title,
        selectedText: selectedText(),
        visibleText: visibleText(),
        forms: listForms().slice(0, 200)
      });
      return;
    }
    if (message?.type === "content:listForms") {
      sendResponse(listForms());
      return;
    }
    if (message?.type === "content:highlight") {
      sendResponse(highlight(message.selector));
      return;
    }
  } catch (error) {
    sendResponse({ error: error.message });
  }
});
