// @ts-nocheck
import browser from "webextension-polyfill";
import type { AvailableLanguage } from "../util";
document.addEventListener("DOMContentLoaded", async () => {
  const firstSelect = document.getElementById("firstLang");
  const secondSelect = document.getElementById("secondLang");
  const applyBtn = document.getElementById("applyBtn");

  // 1. Find the active tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tabs || !tabs[0]) return;
  const activeTabId = tabs[0].id;

  // 2. Ask content script for languages
  browser.tabs
    .sendMessage(activeTabId, {
      action: "get_languages",
    })
    .then((response) => {
      if (response && response.success) {
        populateDropdowns(response.languages);
        if (response.selectedLanguages) {
          firstSelect.value = response.selectedLanguages.firstLang;
          secondSelect.value = response.selectedLanguages.secondLang;
        }
      } else {
        showError(response?.error || "Failed to load languages.");
      }
    })
    .catch((err) => {
      showError("Make sure you are on an active YouTube video page.");
    });

  // Helper to fill <select> options
  function populateDropdowns(languages: AvailableLanguage[]) {
    languages.forEach((lang) => {
      // Handles both string arrays and object arrays safely
      const val = lang.languageCode;
      const name = lang.languageName;

      firstSelect.options.add(new Option(name, val));
      secondSelect.options.add(new Option(name, val));
    });
  }

  function showError(msg) {
    firstSelect.innerHTML = `<option>${msg}</option>`;
    secondSelect.innerHTML = `<option>--</option>`;
  }

  // 3. Send selections back to content script when clicking apply
  applyBtn.addEventListener("click", async () => {
    await browser.tabs.sendMessage(activeTabId, {
      action: "apply_captions",
      firstLang: firstSelect.value,
      secondLang: secondSelect.value,
    });
  });
});
