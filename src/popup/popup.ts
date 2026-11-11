import { fetchAvailableLanguages } from "../util.js";
declare const browser: any;
const VIDEO_ID = "XFW46DzuIvw";
// popup/popup.ts

async function initPopup() {
  try {
    // 1. Target the active YouTube tab
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const activeTabId = tabs[0]?.id;
    if (!activeTabId) return;

    // 2. Await the response from the content script
    const response = await browser.tabs.sendMessage(activeTabId, {
      action: "GET_AVAILABLE_LANGUAGES",
    });

    if (response?.success) {
      // 3. Populate your dropdown menus with the real live data!
      populateDropdowns(response.languages);
    } else {
      console.error("Content script error:", response?.error);
    }
  } catch (error) {
    console.error(
      "Could not communicate with content script. Make sure you are on a YouTube video page.",
      error,
    );
  }
}

function populateDropdowns(tracks: any[]) {
  const firstSelect = document.getElementById("firstLang") as HTMLSelectElement;
  const secondSelect = document.getElementById(
    "secondLang",
  ) as HTMLSelectElement;
  if (!firstSelect || !secondSelect) return;

  firstSelect.innerHTML = "";
  secondSelect.innerHTML = "";

  tracks.forEach((track) => {
    firstSelect.add(new Option(track.languageName.toUpperCase(), track.url));
    secondSelect.add(new Option(track.languageName.toUpperCase(), track.url));
  });
  if (tracks.length > 1) secondSelect.selectedIndex = 1;
}

// Kick off initialization immediately when popup opens
document.addEventListener("DOMContentLoaded", initPopup);
